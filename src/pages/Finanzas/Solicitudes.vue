<template>
  <div class="solicitudes-container flex w-full">
    <!-- Sidebar -->
    <Sidebar v-model:isExpanded="sidebarExpanded" />

    <!-- Contenido principal -->
    <div class="content flex-1 w-full relative transition-all duration-300"
      :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }">

      <div class="p-6">
        <!-- Header con título y botón de agregar -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Solicitudes de Gastos y Viáticos</h1>
            <p class="text-gray-600 mt-1">Gestiona todas las solicitudes de la organización</p>
          </div>
          <button @click="abrirModal('crear')"
            class="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition duration-300 flex items-center gap-2 shadow-md">
            <i class="fas fa-plus"></i> Nueva Solicitud
          </button>
        </div>

        <!-- Filtros y búsqueda -->
        <div class="bg-white p-4 rounded-lg shadow-md mb-6">
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex-grow">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i class="fas fa-search"></i>
                </span>
                <input type="text" v-model="busqueda" placeholder="Buscar por concepto, solicitante, departamento..."
                  class="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            <div class="flex gap-2">
              <select v-model="filtroTipo" class="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                <option value="">Todos los tipos</option>
                <option value="Viáticos">Viáticos</option>
                <option value="Materiales">Materiales</option>
                <option value="Equipos">Equipos</option>
                <option value="Servicios">Servicios</option>
                <option value="Otros">Otros</option>
              </select>

              <select v-model="filtroEstado" class="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500">
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Pagado">Pagado</option>
              </select>
              
              <div class="relative">
                <input type="date" v-model="filtroFechaDesde" class="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" />
                <span class="absolute inset-y-0 left-3 flex items-center text-gray-500 pointer-events-none">
                  Desde:
                </span>
              </div>
              
              <div class="relative">
                <input type="date" v-model="filtroFechaHasta" class="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500" />
                <span class="absolute inset-y-0 left-3 flex items-center text-gray-500 pointer-events-none">
                  Hasta:
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de Solicitudes -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
              <thead>
                <tr class="bg-gray-800 text-white">
                  <th class="px-4 py-3 cursor-pointer text-left" @click="ordenarPor('id')">
                    <div class="flex items-center">
                      ID
                      <span v-if="columnaOrden === 'id'" class="ml-1">
                        <i :class="ordenAscendente ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                      </span>
                      <i v-else class="fas fa-sort text-gray-400 ml-1"></i>
                    </div>
                  </th>
                  <th class="px-4 py-3 cursor-pointer text-left" @click="ordenarPor('fecha')">
                    <div class="flex items-center">
                      Fecha
                      <span v-if="columnaOrden === 'fecha'" class="ml-1">
                        <i :class="ordenAscendente ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                      </span>
                      <i v-else class="fas fa-sort text-gray-400 ml-1"></i>
                    </div>
                  </th>
                  <th class="px-4 py-3 cursor-pointer text-left" @click="ordenarPor('solicitante')">
                    <div class="flex items-center">
                      Solicitante
                      <span v-if="columnaOrden === 'solicitante'" class="ml-1">
                        <i :class="ordenAscendente ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                      </span>
                      <i v-else class="fas fa-sort text-gray-400 ml-1"></i>
                    </div>
                  </th>
                  <th class="px-4 py-3 cursor-pointer text-left" @click="ordenarPor('concepto')">
                    <div class="flex items-center">
                      Concepto
                      <span v-if="columnaOrden === 'concepto'" class="ml-1">
                        <i :class="ordenAscendente ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                      </span>
                      <i v-else class="fas fa-sort text-gray-400 ml-1"></i>
                    </div>
                  </th>
                  <th class="px-4 py-3 cursor-pointer text-left" @click="ordenarPor('tipo')">
                    <div class="flex items-center">
                      Tipo
                      <span v-if="columnaOrden === 'tipo'" class="ml-1">
                        <i :class="ordenAscendente ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                      </span>
                      <i v-else class="fas fa-sort text-gray-400 ml-1"></i>
                    </div>
                  </th>
                  <th class="px-4 py-3 cursor-pointer text-left" @click="ordenarPor('monto')">
                    <div class="flex items-center">
                      Monto
                      <span v-if="columnaOrden === 'monto'" class="ml-1">
                        <i :class="ordenAscendente ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                      </span>
                      <i v-else class="fas fa-sort text-gray-400 ml-1"></i>
                    </div>
                  </th>
                  <th class="px-4 py-3 cursor-pointer text-left" @click="ordenarPor('estado')">
                    <div class="flex items-center">
                      Estado
                      <span v-if="columnaOrden === 'estado'" class="ml-1">
                        <i :class="ordenAscendente ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                      </span>
                      <i v-else class="fas fa-sort text-gray-400 ml-1"></i>
                    </div>
                  </th>
                  <th class="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="solicitud in solicitudesFiltradas" :key="solicitud.id"
                  class="border-b hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 text-left">#{{ solicitud.id }}</td>
                  <td class="px-4 py-3 text-left">{{ formatDate(solicitud.fecha) }}</td>
                  <td class="px-4 py-3 text-left">
                    <div class="flex items-center">
                      <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2">
                        {{ solicitud.solicitante.nombre.charAt(0) }}
                      </div>
                      <span>{{ solicitud.solicitante.nombre }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-left">{{ solicitud.concepto }}</td>
                  <td class="px-4 py-3 text-left">
                    <div class="flex items-center">
                      <i :class="getTipoIcon(solicitud.tipo)" class="mr-2"></i>
                      {{ solicitud.tipo }}
                    </div>
                  </td>
                  <td class="px-4 py-3 text-left">${{ formatNumber(solicitud.monto) }}</td>
                  <td class="px-4 py-3 text-left">
                    <span :class="{
                      'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium': solicitud.estado === 'Pendiente',
                      'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium': solicitud.estado === 'Aprobado',
                      'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium': solicitud.estado === 'Rechazado',
                      'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium': solicitud.estado === 'Pagado'
                    }">
                      {{ solicitud.estado }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex space-x-2 justify-center">
                      <button @click="verDetalles(solicitud)"
                        class="text-blue-600 hover:text-blue-800 transition-colors">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button @click="abrirModal('editar', solicitud)"
                        class="text-yellow-600 hover:text-yellow-800 transition-colors">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button v-if="solicitud.estado === 'Pendiente'" @click="confirmarEliminar(solicitud)"
                        class="text-red-600 hover:text-red-800 transition-colors">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Paginación -->
          <div class="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-sm text-gray-700">
                Mostrando <span class="font-medium">{{ paginaActual * solicitudesPorPagina - solicitudesPorPagina + 1 }}</span> a 
                <span class="font-medium">{{ Math.min(paginaActual * solicitudesPorPagina, totalSolicitudes) }}</span> de 
                <span class="font-medium">{{ totalSolicitudes }}</span> resultados
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1"
                class="px-3 py-1 rounded border" :class="paginaActual === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'">
                Anterior
              </button>
              <div v-for="pagina in totalPaginas" :key="pagina" class="hidden md:block">
                <button @click="cambiarPagina(pagina)"
                  class="px-3 py-1 rounded border" :class="pagina === paginaActual ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'">
                  {{ pagina }}
                </button>
              </div>
              <button @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas"
                class="px-3 py-1 rounded border" :class="paginaActual === totalPaginas ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal para crear/editar solicitud -->
    <ModalSolicitud 
      v-if="mostrarModal" 
      :visible="mostrarModal" 
      :modo="modo" 
      :solicitud="solicitudActual" 
      @close="cerrarModal" 
      @submit="handleModalSubmit" 
    />
    
    <!-- Modal para ver detalles -->
    <ModalDetalleSolicitud 
      v-if="mostrarDetalles" 
      :visible="mostrarDetalles" 
      :solicitud="solicitudDetalle" 
      @close="cerrarDetalles" 
    />
  </div>
</template>
<script>
import Sidebar from "@/components/Sidebar.vue";
import ModalSolicitud from "@/components/Finanzas/ModalSolicitud.vue";
import ModalDetalleSolicitud from "@/components/Finanzas/ModalDetalleSolicitud.vue";
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { getAllSolicitudes, createSolicitud, updateSolicitud, deleteSolicitud } from '@/api/solicitud';

export default {
  name: "Solicitudes",
  components: {
    Sidebar,
    ModalSolicitud,
    ModalDetalleSolicitud
  },
  setup() {
    // Estado del sidebar
    const sidebarExpanded = ref(false);
    
    // Estado de modales
    const mostrarModal = ref(false);
    const mostrarDetalles = ref(false);
    const modo = ref('crear');
    const solicitudActual = ref({});
    const solicitudDetalle = ref({});
    
    // Filtros y búsqueda
    const busqueda = ref('');
    const filtroTipo = ref('');
    const filtroEstado = ref('');
    const filtroFechaDesde = ref('');
    const filtroFechaHasta = ref('');
    
    // Ordenamiento
    const columnaOrden = ref('id');
    const ordenAscendente = ref(false);
    
    // Paginación
    const paginaActual = ref(1);
    const solicitudesPorPagina = ref(10);
    
    // Datos reales desde la API
    const solicitudes = ref([]);
    
    // Cargar datos de la API
    const cargarDatos = async () => {
      try {
        const res = await getAllSolicitudes();
        solicitudes.value = res.data;
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error);
        Swal.fire('Error', 'No se pudieron cargar las solicitudes.', 'error');
      }
    };
    
    // Solicitudes filtradas sin paginación
    const solicitudesFiltradosSinPaginacion = computed(() => {
      return solicitudes.value.filter(s => {
        // Filtro de búsqueda; verifica s.solicitante.nombre
        const matchBusqueda = busqueda.value === '' ||
          s.concepto.toLowerCase().includes(busqueda.value.toLowerCase()) ||
          s.solicitante.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
          s.departamento.toLowerCase().includes(busqueda.value.toLowerCase());
        
        // Filtro de tipo
        const matchTipo = filtroTipo.value === '' || s.tipo === filtroTipo.value;
        
        // Filtro de estado
        const matchEstado = filtroEstado.value === '' || s.estado === filtroEstado.value;
        
        // Filtro de fecha desde
        const matchFechaDesde = filtroFechaDesde.value === '' || 
          new Date(s.fecha) >= new Date(filtroFechaDesde.value);
        
        // Filtro de fecha hasta
        const matchFechaHasta = filtroFechaHasta.value === '' || 
          new Date(s.fecha) <= new Date(filtroFechaHasta.value);
        
        return matchBusqueda && matchTipo && matchEstado && matchFechaDesde && matchFechaHasta;
      }).sort((a, b) => {
        // Si ordenamos por solicitante, usar el nombre
        let aVal = columnaOrden.value === 'solicitante'
          ? a.solicitante.nombre
          : a[columnaOrden.value];
        let bVal = columnaOrden.value === 'solicitante'
          ? b.solicitante.nombre
          : b[columnaOrden.value];

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return ordenAscendente.value ? -1 : 1;
        if (aVal > bVal) return ordenAscendente.value ? 1 : -1;
        return 0;
      });
    });
    
    // Solicitudes filtradas con paginación
    const solicitudesFiltradas = computed(() => {
      const inicio = (paginaActual.value - 1) * solicitudesPorPagina.value;
      return solicitudesFiltradosSinPaginacion.value.slice(inicio, inicio + solicitudesPorPagina.value);
    });
    
    // Total de solicitudes filtradas
    const totalSolicitudes = computed(() => solicitudesFiltradosSinPaginacion.value.length);
    
    // Total de páginas
    const totalPaginas = computed(() => 
      Math.max(1, Math.ceil(totalSolicitudes.value / solicitudesPorPagina.value))
    );
    
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
    
    // Cambiar página
    const cambiarPagina = (pagina) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina;
      }
    };
    
    // Ordenar por columna
    const ordenarPor = (columna) => {
      if (columnaOrden.value === columna) {
        ordenAscendente.value = !ordenAscendente.value;
      } else {
        columnaOrden.value = columna;
        ordenAscendente.value = true;
      }
    };
    
    // Abrir modal para crear o editar
    const abrirModal = (modoParam, solicitud = null) => {
      modo.value = modoParam;
      if (modoParam === 'crear') {
        solicitudActual.value = {
          solicitante: '',
          departamento: '',
          concepto: '',
          tipo: '',
          monto: 0,
          estado: 'Pendiente',
          fecha: new Date().toISOString().split('T')[0],
          descripcion: '',
          comprobantes: []
        };
      } else {
        solicitudActual.value = { ...solicitud };
      }
      mostrarModal.value = true;
    };
    
    // Cerrar modal
    const cerrarModal = () => {
      mostrarModal.value = false;
    };
    
    // Ver detalles de solicitud
    const verDetalles = (solicitud) => {
      solicitudDetalle.value = solicitud;
      mostrarDetalles.value = true;
    };
    
    // Cerrar detalles
    const cerrarDetalles = () => {
      mostrarDetalles.value = false;
    };
    
    // Confirmar eliminación
    const confirmarEliminar = (solicitud) => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar la solicitud "${solicitud.concepto}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          eliminarSolicitud(solicitud.id);
        }
      });
    };
    
    // Eliminar solicitud desde la API
    const eliminarSolicitud = async (id) => {
      try {
        await deleteSolicitud(id);
        solicitudes.value = solicitudes.value.filter(s => s.id !== id);
        Swal.fire('¡Eliminado!', 'La solicitud ha sido eliminada.', 'success');
      } catch (error) {
        console.error("Error al eliminar la solicitud:", error);
        Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
      }
    };
    
    // Manejar envío del modal (crear o editar)
    const handleModalSubmit = async (data) => {
      // Validar y formatear la fecha
      if (!data.fecha || isNaN(new Date(data.fecha))) {
        Swal.fire('Error', 'La fecha ingresada es inválida.', 'error');
        return;
      }
      data.fecha = new Date(data.fecha).toISOString();
      
      try {
        if (modo.value === 'crear') {
          const res = await createSolicitud(data);
          solicitudes.value.push(res.data);
          Swal.fire('¡Creado!', 'La solicitud ha sido creada exitosamente.', 'success');
        } else {
          const res = await updateSolicitud(data.id, data);
          const index = solicitudes.value.findIndex((s) => s.id === res.data.id);
          if (index !== -1) {
            solicitudes.value[index] = res.data;
          }
          Swal.fire('¡Actualizado!', 'La solicitud ha sido actualizada exitosamente.', 'success');
        }
        // Cerrar modal y reiniciar solicitudActual para forzar la reactividad
        cerrarModal();
        solicitudActual.value = {}; 
        
        // Recargar los datos para asegurar que tenemos la información más actualizada
        await cargarDatos();
      } catch (error) {
        console.error(
          'Error al guardar la solicitud:',
          error.response ? error.response.data : error
        );
        const errorMessage =
          error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : 'No se pudo guardar la solicitud.';
        Swal.fire('Error', errorMessage, 'error');
      }
    };
    
    // Cargar datos al montar el componente
    onMounted(() => {
      cargarDatos();
    });
    
    return {
      sidebarExpanded,
      mostrarModal,
      mostrarDetalles,
      modo,
      solicitudActual,
      solicitudDetalle,
      busqueda,
      filtroTipo,
      filtroEstado,
      filtroFechaDesde,
      filtroFechaHasta,
      columnaOrden,
      ordenAscendente,
      paginaActual,
      solicitudesPorPagina,
      solicitudesFiltradas,
      totalSolicitudes,
      totalPaginas,
      formatNumber,
      formatDate,
      getTipoIcon,
      cambiarPagina,
      ordenarPor,
      abrirModal,
      cerrarModal,
      cerrarDetalles,
      verDetalles,
      confirmarEliminar,
      handleModalSubmit
    };
  }
};
</script>

<style scoped>
.solicitudes-container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

.content {
  flex: 1;
}

/* Estilos para los botones de acción */
button {
  transition: all 0.2s ease;
}

button:focus {
  outline: none;
}

/* Estilos para los inputs de fecha */
input[type="date"] {
  position: relative;
  padding-left: 4.5rem;
}

/* Estilos para scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animaciones para las filas de la tabla */
tbody tr {
  transition: all 0.3s ease;
}

/* Estilos para los estados de las solicitudes */
.bg-yellow-100 {
  transition: background-color 0.3s ease;
}

.bg-green-100 {
  transition: background-color 0.3s ease;
}

.bg-red-100 {
  transition: background-color 0.3s ease;
}

.bg-blue-100 {
  transition: background-color 0.3s ease;
}

/* Responsive para pantallas pequeñas */
@media (max-width: 768px) {
  .flex-wrap {
    flex-direction: column;
  }
  
  .flex-wrap > div {
    margin-bottom: 0.5rem;
  }
}
</style>