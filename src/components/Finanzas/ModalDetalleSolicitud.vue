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
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Detalles de la Solicitud
                </h3>
                <span :class="{
                  'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium': solicitud.estado === 'Pendiente',
                  'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium': solicitud.estado === 'Aprobado',
                  'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium': solicitud.estado === 'Rechazado',
                  'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium': solicitud.estado === 'Pagado'
                }">
                  {{ solicitud.estado }}
                </span>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg mb-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm font-medium text-gray-500">ID</p>
                    <p class="text-sm font-semibold">#{{ solicitud.id }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Fecha</p>
                    <p class="text-sm font-semibold">{{ formatDate(solicitud.fecha) }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Solicitante</p>
                    <p class="text-sm font-semibold">{{ solicitud.solicitante.nombre }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Departamento</p>
                    <p class="text-sm font-semibold">{{ solicitud.departamento }}</p>
                  </div>
                </div>
              </div>
              
              <div class="mb-4">
                <h4 class="text-md font-medium text-gray-900 mb-2">Información de la Solicitud</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="mb-3">
                    <p class="text-sm font-medium text-gray-500">Concepto</p>
                    <p class="text-sm font-semibold">{{ solicitud.concepto }}</p>
                  </div>
                  <div class="mb-3">
                    <p class="text-sm font-medium text-gray-500">Tipo</p>
                    <div class="flex items-center">
                      <i :class="getTipoIcon(solicitud.tipo)" class="mr-2"></i>
                      <p class="text-sm font-semibold">{{ solicitud.tipo }}</p>
                    </div>
                  </div>
                  <div class="mb-3">
                    <p class="text-sm font-medium text-gray-500">Monto</p>
                    <p class="text-sm font-semibold">${{ formatNumber(solicitud.monto) }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Descripción</p>
                    <p class="text-sm">{{ solicitud.descripcion || 'Sin descripción' }}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="text-md font-medium text-gray-900 mb-2">Comprobantes</h4>
                <div class="bg-gray-50 p-4 rounded-lg text-center">
                  <p v-if="!solicitud.comprobantes || solicitud.comprobantes.length === 0" class="text-sm text-gray-500">
                    No hay comprobantes adjuntos
                  </p>
                  <div v-else class="grid grid-cols-2 gap-2">
                    <div v-for="(comprobante, index) in solicitud.comprobantes" :key="index" class="border rounded p-2">
                      <p class="text-sm">{{ comprobante.nombre }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="$emit('close')"
            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalDetalleSolicitud',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    solicitud: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup() {
    // Formatear números con separadores de miles
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Formatear fechas
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };
    
    // Obtener icono según el tipo de solicitud
    const getTipoIcon = (tipo) => {
      switch (tipo) {
        case 'Viáticos': return 'fas fa-plane-departure text-blue-500';
        case 'Materiales': return 'fas fa-box text-yellow-500';
        case 'Equipos': return 'fas fa-laptop text-green-500';
        case 'Servicios': return 'fas fa-concierge-bell text-purple-500';
        case 'Otros': return 'fas fa-file-invoice-dollar text-gray-500';
        default: return 'fas fa-file-invoice-dollar text-gray-500';
      }
    };
    
    return {
      formatNumber,
      formatDate,
      getTipoIcon
    };
  }
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>