<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar v-model:isExpanded="sidebarExpanded" />

    <!-- Contenido principal -->
    <div class="flex-1 p-6 ml-20" :class="{ 'ml-64': sidebarExpanded }">
      <div class="max-w-7xl mx-auto">
        <!-- Encabezado -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Aprobaciones Financieras</h1>
          <p class="text-gray-600">Gestiona las solicitudes pendientes de aprobación</p>
        </div>

        <!-- Filtros y búsqueda -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
          <div class="flex flex-wrap gap-3">
            <div class="flex-1 min-w-[180px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input type="text" v-model="busqueda" placeholder="Buscar por solicitante, concepto..."
                  class="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            <div class="w-full sm:w-auto flex-1 min-w-[150px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select v-model="filtroTipo"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                <option value="">Todos los tipos</option>
                <option value="Viáticos">Viáticos</option>
                <option value="Materiales">Materiales</option>
                <option value="Equipos">Equipos</option>
                <option value="Servicios">Servicios</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div class="w-full sm:w-auto flex-1 min-w-[150px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <select v-model="filtroDepartamento"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                <option value="">Todos los departamentos</option>
                <option v-for="(dept, index) in departamentos" :key="index" :value="dept">{{ dept }}</option>
              </select>
            </div>

            <div class="w-full sm:w-auto flex-1 min-w-[120px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
              <input type="date" v-model="filtroFechaDesde"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>

            <div class="w-full sm:w-auto flex-1 min-w-[120px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
              <input type="date" v-model="filtroFechaHasta"
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div class="bg-white rounded-lg shadow-md p-3 border-l-4 border-yellow-500">
            <div class="flex items-center">
              <div class="p-2 rounded-full bg-yellow-100 mr-3">
                <i class="fas fa-clock text-yellow-500 text-lg"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                <p class="text-xl font-bold text-gray-800">{{ estadisticas.pendientes }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-3 border-l-4 border-green-500">
            <div class="flex items-center">
              <div class="p-2 rounded-full bg-green-100 mr-3">
                <i class="fas fa-check text-green-500 text-lg"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Aprobadas</p>
                <p class="text-xl font-bold text-gray-800">{{ estadisticas.aprobadas }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-3 border-l-4 border-red-500">
            <div class="flex items-center">
              <div class="p-2 rounded-full bg-red-100 mr-3">
                <i class="fas fa-times text-red-500 text-lg"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Rechazadas</p>
                <p class="text-xl font-bold text-gray-800">{{ estadisticas.rechazadas }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de solicitudes -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 table-fixed">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col"
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-[5%]"
                    @click="ordenarPor('id')">
                    ID
                    <i class="fas fa-sort ml-1" :class="{
                      'fa-sort-up': columnaOrden === 'id' && ordenAscendente,
                      'fa-sort-down': columnaOrden === 'id' && !ordenAscendente
                    }"></i>
                  </th>
                  <th scope="col"
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-[15%]"
                    @click="ordenarPor('solicitante')">
                    Solicitante
                    <i class="fas fa-sort ml-1" :class="{
                      'fa-sort-up': columnaOrden === 'solicitante' && ordenAscendente,
                      'fa-sort-down': columnaOrden === 'solicitante' && !ordenAscendente
                    }"></i>
                  </th>
                  <th scope="col"
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-[15%]"
                    @click="ordenarPor('departamento')">
                    Departamento
                    <i class="fas fa-sort ml-1" :class="{
                      'fa-sort-up': columnaOrden === 'departamento' && ordenAscendente,
                      'fa-sort-down': columnaOrden === 'departamento' && !ordenAscendente
                    }"></i>
                  </th>
                  <th scope="col"
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-[20%]"
                    @click="ordenarPor('concepto')">
                    Concepto
                    <i class="fas fa-sort ml-1" :class="{
                      'fa-sort-up': columnaOrden === 'concepto' && ordenAscendente,
                      'fa-sort-down': columnaOrden === 'concepto' && !ordenAscendente
                    }"></i>
                  </th>
                  <th scope="col"
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-[10%]"
                    @click="ordenarPor('tipo')">
                    Tipo
                    <i class="fas fa-sort ml-1" :class="{
                      'fa-sort-up': columnaOrden === 'tipo' && ordenAscendente,
                      'fa-sort-down': columnaOrden === 'tipo' && !ordenAscendente
                    }"></i>
                  </th>
                  <th scope="col"
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-[10%]"
                    @click="ordenarPor('monto')">
                    Monto
                    <i class="fas fa-sort ml-1" :class="{
                      'fa-sort-up': columnaOrden === 'monto' && ordenAscendente,
                      'fa-sort-down': columnaOrden === 'monto' && !ordenAscendente
                    }"></i>
                  </th>
                  <th scope="col"
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-[10%]"
                    @click="ordenarPor('fecha')">
                    Fecha
                    <i class="fas fa-sort ml-1" :class="{
                      'fa-sort-up': columnaOrden === 'fecha' && ordenAscendente,
                      'fa-sort-down': columnaOrden === 'fecha' && !ordenAscendente
                    }"></i>
                  </th>
                  <th scope="col"
                    class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="solicitud in solicitudesFiltradas" :key="solicitud.id" class="hover:bg-gray-50">
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{{ solicitud.id }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 truncate">
                    {{ solicitud.solicitante && solicitud.solicitante.nombre ? solicitud.solicitante.nombre : 'N/A' }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 truncate">
                    {{ solicitud.departamento }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 truncate">
                    {{ solicitud.concepto }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex items-center">
                      <i :class="getTipoIcon(solicitud.tipo)" class="mr-1"></i>
                      {{ solicitud.tipo }}
                    </div>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    ${{ formatNumber(solicitud.monto) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(solicitud.fecha) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <button @click="verDetalles(solicitud)" class="text-blue-600 hover:text-blue-900 p-1">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button @click="aprobarSolicitud(solicitud)" class="text-green-600 hover:text-green-900 p-1">
                        <i class="fas fa-check"></i>
                      </button>
                      <button @click="rechazarSolicitud(solicitud)" class="text-red-600 hover:text-red-900 p-1">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="solicitudesFiltradas.length === 0">
                  <td colspan="8" class="px-3 py-4 text-center text-sm text-gray-500">
                    No hay solicitudes pendientes de aprobación
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando <span class="font-medium">{{ solicitudesFiltradas.length }}</span> de <span
                    class="font-medium">{{ totalSolicitudes }}</span> solicitudes
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': paginaActual === 1 }">
                    <span class="sr-only">Anterior</span>
                    <i class="fas fa-chevron-left"></i>
                  </button>

                  <button v-for="pagina in totalPaginas" :key="pagina" @click="cambiarPagina(pagina)"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
                    :class="{ 'bg-green-50 text-green-600 border-green-500': paginaActual === pagina, 'text-gray-700': paginaActual !== pagina }">
                    {{ pagina }}
                  </button>

                  <button @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': paginaActual === totalPaginas }">
                    <span class="sr-only">Siguiente</span>
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <ModalDetalleSolicitud :visible="mostrarDetalles" :solicitud="solicitudDetalle" @close="cerrarDetalles" />

    <!-- Modal de comentarios para rechazo -->
    <div v-if="mostrarModalRechazo" class="modal-backdrop" @click.self="mostrarModalRechazo = false">
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Contenido del modal -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <i class="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">
                Rechazar solicitud
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Está a punto de rechazar la solicitud #{{ solicitudParaRechazar?.id || '' }}. Esta acción no se puede deshacer.
              </p>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Motivo del rechazo</label>
                <textarea v-model="comentarioRechazo" rows="4" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Explique el motivo del rechazo..."></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="confirmarRechazo"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
            Rechazar
          </button>
          <button type="button" @click="mostrarModalRechazo = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sidebar from "@/components/Sidebar.vue";
import ModalDetalleSolicitud from "@/components/Finanzas/ModalDetalleSolicitud.vue";
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { getAllSolicitudes, updateSolicitud } from '@/api/solicitud'; // Import API functions

export default {
  name: 'AprobacionesFinanzas',
  components: {
    Sidebar,
    ModalDetalleSolicitud
  },
  setup() {
    // Estado del sidebar
    const sidebarExpanded = ref(false);

    // Estado de modales
    const mostrarDetalles = ref(false);
    const mostrarModalRechazo = ref(false);
    const solicitudDetalle = ref({});
    const solicitudParaRechazar = ref(null);
    const comentarioRechazo = ref('');

    // Filtros y búsqueda
    const busqueda = ref('');
    const filtroTipo = ref('');
    const filtroDepartamento = ref('');
    const filtroFechaDesde = ref('');
    const filtroFechaHasta = ref('');

    // Paginación
    const paginaActual = ref(1);
    const solicitudesPorPagina = ref(10);

    // Ordenamiento
    const columnaOrden = ref('id');
    const ordenAscendente = ref(true);

    // Datos de solicitudes (ahora desde API)
    const solicitudes = ref([]);

    // Cargar datos desde la API
    const cargarDatos = async () => {
      try {
        const res = await getAllSolicitudes();
        solicitudes.value = res.data;
      } catch (error) {
        console.error("Error al cargar las solicitudes:", error);
        Swal.fire('Error', 'No se pudieron cargar las solicitudes.', 'error');
      }
    };

    // Lista de departamentos únicos para el filtro
    const departamentos = computed(() => {
      const depts = new Set(solicitudes.value.map(s => s.departamento));
      return [...depts].sort();
    });

    // Estadísticas
    const estadisticas = computed(() => {
      return {
        // Se usa el mismo filtro de pendientes por nivel de aprobación
        pendientes: solicitudesFiltradosSinPaginacion.value.length,
        aprobadas: solicitudes.value.filter(s => s.estado === 'Aprobado').length,
        rechazadas: solicitudes.value.filter(s => s.estado === 'Rechazado').length
      };
    });

    // Solicitudes filtradas sin paginación
    const solicitudesFiltradosSinPaginacion = computed(() => {
      // Obtiene el nivel de aprobación del usuario desde localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const nivelAprobacion = Number(currentUser?.niv_apr_gas || 0);

      return solicitudes.value.filter(s => {
        // Mostrar solo solicitudes que estén en estado "Pendiente"
        if (s.estado !== 'Pendiente') return false;

        // Filtrar de acuerdo al nivel de aprobación
        // Si el usuario no tiene poder de aprobación (nivel 0), no se muestra nada.
        if (nivelAprobacion === 0) return false;
        if (nivelAprobacion === 1) {
          // Mostrar si aprobadoNivel1 es false
          if (s.aprobadoNivel1 !== false) return false;
        } else if (nivelAprobacion === 2) {
          // Para nivel 2, deben estar aprobadas a nivel 1 y no a nivel 2
          if (!s.aprobadoNivel1 || s.aprobadoNivel2 !== false) return false;
        } else if (nivelAprobacion === 3) {
          // Para nivel 3, deben estar aprobadas a nivel 1 y 2 y no a nivel 3
          if (!s.aprobadoNivel1 || !s.aprobadoNivel2 || s.aprobadoNivel3 !== false) return false;
        }

        // Aplica el resto de los filtros (búsqueda, tipo, departamento y fechas)
        const matchBusqueda =
          busqueda.value === '' ||
          s.concepto.toLowerCase().includes(busqueda.value.toLowerCase()) ||
          (s.solicitante &&
            s.solicitante.nombre &&
            s.solicitante.nombre.toLowerCase().includes(busqueda.value.toLowerCase())) ||
          s.departamento.toLowerCase().includes(busqueda.value.toLowerCase());

        const matchTipo = filtroTipo.value === '' || s.tipo === filtroTipo.value;
        const matchDepartamento =
          filtroDepartamento.value === '' || s.departamento === filtroDepartamento.value;
        const matchFechaDesde =
          filtroFechaDesde.value === '' || new Date(s.fecha) >= new Date(filtroFechaDesde.value);
        const matchFechaHasta =
          filtroFechaHasta.value === '' || new Date(s.fecha) <= new Date(filtroFechaHasta.value);

        return matchBusqueda && matchTipo && matchDepartamento && matchFechaDesde && matchFechaHasta;
      }).sort((a, b) => {
        // Ordenamiento adaptado para la estructura de datos de la API
        let aVal, bVal;

        if (columnaOrden.value === 'solicitante') {
          aVal = a.solicitante && a.solicitante.nombre ? a.solicitante.nombre : '';
          bVal = b.solicitante && b.solicitante.nombre ? b.solicitante.nombre : '';
        } else {
          aVal = a[columnaOrden.value];
          bVal = b[columnaOrden.value];
        }

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

    // Total de solicitudes
    const totalSolicitudes = computed(() => {
      return solicitudesFiltradosSinPaginacion.value.length;
    });

    // Total de páginas para paginación
    const totalPaginas = computed(() => {
      return Math.ceil(totalSolicitudes.value / solicitudesPorPagina.value);
    });

    // Métodos
    const ordenarPor = (columna) => {
      if (columnaOrden.value === columna) {
        ordenAscendente.value = !ordenAscendente.value;
      } else {
        columnaOrden.value = columna;
        ordenAscendente.value = true;
      }
    };

    const cambiarPagina = (pagina) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina;
      }
    };

    const verDetalles = (solicitud) => {
      solicitudDetalle.value = { ...solicitud };
      mostrarDetalles.value = true;
    };

    const cerrarDetalles = () => {
      mostrarDetalles.value = false;
    };

    // Determinar el nivel de aprobación actual del usuario
    const obtenerNivelAprobacion = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      // Aquí deberías implementar la lógica para determinar el nivel de aprobación
      // basado en el rol o permisos del usuario actual
      return currentUser?.nivelAprobacion || 1; // Por defecto nivel 1
    };

    const aprobarSolicitud = async (solicitud) => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // Crear una copia profunda para evitar referencias reactivas
        const datosActualizados = JSON.parse(JSON.stringify(solicitud));

        if (!solicitud.aprobadoNivel1) {
          // Marcar Aprobado a Nivel 1
          datosActualizados.aprobadoNivel1 = true;
          datosActualizados.aprobadoPor1 = currentUser?.id;
          datosActualizados.fechaAprobacion1 = new Date();
        } else if (!solicitud.aprobadoNivel2) {
          // Marcar Aprobado a Nivel 2 si ya está aprobado a Nivel 1
          datosActualizados.aprobadoNivel2 = true;
          datosActualizados.aprobadoPor2 = currentUser?.id;
          datosActualizados.fechaAprobacion2 = new Date();
        } else if (!solicitud.aprobadoNivel3) {
          // Marcar Aprobado a Nivel 3 si ya están aprobados los niveles 1 y 2,
          // y adicionalmente se actualiza el estado a "Aprobado"
          datosActualizados.aprobadoNivel3 = true;
          datosActualizados.aprobadoPor3 = currentUser?.id;
          datosActualizados.fechaAprobacion3 = new Date();
          datosActualizados.estado = 'Aprobado';
        }

        console.log('Datos a actualizar:', datosActualizados);
        await updateSolicitud(solicitud.id, datosActualizados);
        await cargarDatos();

        await Swal.fire({
          icon: 'success',
          title: 'Solicitud aprobada',
          text: `La solicitud #${solicitud.id} ha sido actualizada correctamente`,
          showConfirmButton: false,
          timer: 2000
        });
      } catch (error) {
        console.error('Error al aprobar la solicitud:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al aprobar la solicitud'
        });
      }
    };

    const rechazarSolicitud = (solicitud) => {
      // Make a deep copy of the solicitud to avoid reference issues
      solicitudParaRechazar.value = JSON.parse(JSON.stringify(solicitud));
      comentarioRechazo.value = '';
      mostrarModalRechazo.value = true;
    };

    const confirmarRechazo = async () => {
      if (!comentarioRechazo.value.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Comentario requerido',
          text: 'Por favor, indique el motivo del rechazo'
        });
        return;
      }

      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!solicitudParaRechazar.value || !solicitudParaRechazar.value.id) {
          throw new Error('No se ha seleccionado una solicitud para rechazar');
        }

        // Crear objeto con los datos a actualizar
        const datosActualizados = { ...solicitudParaRechazar.value };
        datosActualizados.estado = 'Rechazado';
        datosActualizados.comentarios = comentarioRechazo.value;
        datosActualizados.rechazadoPor = currentUser?.id || null;
        datosActualizados.fechaRechazo = new Date();

        // Llamar a la API para actualizar la solicitud
        await updateSolicitud(solicitudParaRechazar.value.id, datosActualizados);

        // Cerrar el modal antes de recargar los datos
        mostrarModalRechazo.value = false;

        // Recargar los datos
        await cargarDatos();

        await Swal.fire({
          icon: 'info',
          title: 'Solicitud rechazada',
          text: `La solicitud #${solicitudParaRechazar.value.id} ha sido rechazada`,
          showConfirmButton: false,
          timer: 2000
        });
      } catch (error) {
        console.error('Error al rechazar la solicitud:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al rechazar la solicitud: ' + (error.message || 'Error desconocido')
        });
      }
    };

    const formatNumber = (num) => {
      return num.toLocaleString('es-MX');
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-MX', options);
    };

    const getTipoIcon = (tipo) => {
      const iconMap = {
        'Viáticos': 'fas fa-plane-departure text-blue-500',
        'Materiales': 'fas fa-boxes text-yellow-600',
        'Equipos': 'fas fa-laptop text-purple-500',
        'Servicios': 'fas fa-concierge-bell text-green-500',
        'Otros': 'fas fa-ellipsis-h text-gray-500'
      };

      return iconMap[tipo] || 'fas fa-question-circle text-gray-400';
    };

    // Inicialización
    onMounted(() => {
      cargarDatos();
    });

    return {
      sidebarExpanded,
      solicitudes,
      solicitudesFiltradas,
      totalSolicitudes,
      totalPaginas,
      paginaActual,
      busqueda,
      filtroTipo,
      filtroDepartamento,
      filtroFechaDesde,
      filtroFechaHasta,
      departamentos,
      columnaOrden,
      ordenAscendente,
      estadisticas,
      mostrarDetalles,
      solicitudDetalle,
      mostrarModalRechazo,
      comentarioRechazo,
      ordenarPor,
      cambiarPagina,
      verDetalles,
      cerrarDetalles,
      aprobarSolicitud,
      rechazarSolicitud,
      confirmarRechazo,
      formatNumber,
      formatDate,
      getTipoIcon
    };
  }
};
</script>
<style scoped>
/* Estilos para la transición de la barra lateral */
.flex-1 {
  transition: margin-left 0.3s ease;
}

/* Estilos para los iconos de ordenamiento */
.fa-sort,
.fa-sort-up,
.fa-sort-down {
  font-size: 0.75rem;
  opacity: 0.6;
}

.fa-sort-up,
.fa-sort-down {
  opacity: 1;
}

/* Estilos para las tarjetas de estadísticas */
.border-l-4 {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.border-l-4:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Estilos para los botones de acción en la tabla */
button i {
  transition: transform 0.2s ease;
}

button:hover i {
  transform: scale(1.2);
}

/* Estilos para la paginación */
.rounded-md button {
  transition: all 0.2s ease;
}

/* Estilos para los modales */
.fixed.inset-0 {
  z-index: 50;
}

/* Animación para el modal */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fixed.inset-0 {
  animation: fadeIn 0.3s ease forwards;
}

.fixed.inset-0 .inline-block {
  animation: slideIn 0.3s ease forwards;
}

/* Estilos para los inputs de filtro */
input:focus,
select:focus {
  box-shadow: 0 0 0 2px rgba(72, 187, 120, 0.2);
}

/* Estilos para las filas de la tabla */
tbody tr {
  transition: background-color 0.2s ease;
}

/* Estilos para el scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Optimización para dispositivos móviles y tablets */
@media (max-width: 768px) {
  .grid-cols-1 {
    gap: 0.75rem;
  }

  .px-3 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .truncate {
    max-width: 100px;
  }
}

/* Optimización para pantallas grandes */
@media (min-width: 1280px) {
  .max-w-7xl {
    max-width: 90%;
  }

  .truncate {
    max-width: 200px;
  }
}

/* Estilos para SweetAlert personalizado */
:deep(.swal2-popup-custom) {
  font-family: 'Inter', sans-serif;
  border-radius: 0.5rem;
}

/* Mejora para la tabla en pantallas pequeñas */
.table-fixed {
  table-layout: fixed;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.2s ease-out;
}
</style>