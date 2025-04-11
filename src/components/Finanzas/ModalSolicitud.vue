<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div> 

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ modo === 'crear' ? 'Nueva Solicitud' : 'Editar Solicitud' }}
              </h3>
              
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Datos básicos -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Solicitante</label>
                    <input type="text" v-model="formData.solicitante.nombre" required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Departamento</label>
                    <input type="text" v-model="formData.departamento" required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Concepto</label>
                  <input type="text" v-model="formData.concepto" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Tipo</label>
                    <select v-model="formData.tipo" required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                      <option value="">Seleccionar tipo</option>
                      <option value="Viáticos">Viáticos</option>
                      <option value="Materiales">Materiales</option>
                      <option value="Equipos">Equipos</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Monto</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input type="number" v-model="formData.monto" min="0" step="0.01" required
                        class="pl-7 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Fecha</label>
                  <input type="date" v-model="formData.fecha" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea v-model="formData.descripcion" rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
                </div>

                <div class="hidden">
                  <label class="block text-sm font-medium text-gray-700">Centro de Costo</label>
                  <input type="text" v-model="formData.centroCosto" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <!-- Estado (solo para edición) -->
                <div v-if="modo === 'editar'">
                  <label class="block text-sm font-medium text-gray-700">Estado</label>
                  <select v-model="formData.estado"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Pagado">Pagado</option>
                  </select>
                </div>

                <div class="hidden">
                  <label class="block text-sm font-medium text-gray-700">Estado de Pago</label>
                  <select v-model="formData.estadoPago" required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <option value="no_pagado">No Pagado</option>
                  </select>
                </div>
                
                <!-- Comprobantes (funcionalidad a implementar) -->
                <div class="hidden">
                  <label class="block text-sm font-medium text-gray-700">Comprobantes</label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div class="space-y-1 text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-gray-600">
                        <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                          <span>Subir archivos</span>
                          <input id="file-upload" name="file-upload" type="file" class="sr-only" multiple disabled />
                        </label>
                        <p class="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p class="text-xs text-gray-500">
                        PNG, JPG, PDF hasta 10MB
                      </p>
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">Esta funcionalidad estará disponible próximamente.</p>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="handleSubmit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
            {{ modo === 'crear' ? 'Crear' : 'Guardar' }}
          </button>
          <button type="button" @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'ModalSolicitud',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    modo: {
      type: String,
      required: true,
      validator: (value) => ['crear', 'editar'].includes(value)
    },
    solicitud: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const formData = ref({
      id: null,
      solicitante: '',
      solicitanteId: null,
      departamento: '',
      concepto: '',
      tipo: '',
      monto: 0,
      estado: 'Pendiente',
      estadoPago: 'Pendiente',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      comprobantes: [],
      centroCosto: ''
    });
    
    // Inicializar formulario
    onMounted(() => {
      if (props.modo === 'editar' && props.solicitud) {
        formData.value = { ...props.solicitud };
        // Asegurarse de que la fecha esté en formato yyyy-mm-dd
        if (formData.value.fecha) {
          formData.value.fecha = new Date(formData.value.fecha).toISOString().split('T')[0];
        }
      } else if (props.modo === 'crear') {
        // Para nueva solicitud, inicializar con datos del usuario actual
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
          // Inicializar el objeto solicitante correctamente
          formData.value.solicitante = {
            nombre: currentUser.name || currentUser.nombre || '',
            id: currentUser.id || null
          };
          formData.value.solicitanteId = currentUser.id || null;
          formData.value.departamento = currentUser.departamento || '';
        }
      }
    });
    
    // Manejar envío del formulario
    const handleSubmit = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || !currentUser.id) {
        Swal.fire('Error', 'Usuario no autenticado', 'error');
        return;
      }
      
      formData.value.solicitanteId = currentUser.id;
      emit('submit', { ...formData.value });
      // Removed the emit('close') from here - we'll let the parent component close the modal after API success
    };
    
    return {
      formData,
      handleSubmit
    };
  }
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>