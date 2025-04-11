<template>
  <div class="mantenimientos-container flex w-full bg-gray-50">
    <!-- Sidebar -->
    <Sidebar v-model:isExpanded="sidebarExpanded"/>

    <!-- Contenido del Dashboard -->
    <div class="content flex-1 w-full relative transition-all duration-300"
    :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }"
    >
      <div class="p-4 md:p-8">
        <!-- Header mejorado -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Gestión de Mantenimientos</h1>
            <p class="text-gray-600 mt-1">Programa y visualiza los mantenimientos de equipos</p>
          </div>
          
          <div class="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button 
              @click="toggleView"
              class="flex items-center justify-center bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-300 shadow-sm"
            >
              <svg v-if="currentView === 'calendar'" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ currentView === 'calendar' ? 'Ver Lista' : 'Ver Calendario' }}
            </button>
            
            <button 
              @click="abrirModal(null)"
              class="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-sm hover:shadow"
            >
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Programar Mantenimiento
            </button>
          </div>
        </div>
        
        <!-- Filtros -->
        <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div class="relative">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar por equipo o responsable..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select 
              v-model="filterStatus" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          
          <div class="w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
            <input 
              v-model="filterDateFrom" 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div class="w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
            <input 
              v-model="filterDateTo" 
              type="date" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div class="flex items-end">
            <button 
              @click="resetFilters" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
        
        <!-- Vista de Calendario -->
        <div v-if="currentView === 'calendar'" class="bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <FullCalendar 
            ref="calendar" 
            :options="calendarOptions" 
            class="fc-theme-standard" 
          />
        </div>
        
        <!-- Vista de Lista -->
        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div v-if="filteredMantenimientos.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipo
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="mantenimiento in filteredMantenimientos" :key="mantenimiento.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="equipment-icon-container mr-3">
                          <i :class="getEquipmentIcon(mantenimiento.equipo.tipo)" class="equipment-icon"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ mantenimiento.equipo.nombre }}</div>
                          <div class="text-sm text-gray-500">{{ mantenimiento.equipo.marca }} {{ mantenimiento.equipo.modelo }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(mantenimiento.fecha) }}</div>
                      <div class="text-sm text-gray-500">{{ formatTime(mantenimiento.fecha) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ mantenimiento.responsable }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(mantenimiento.estado)">
                        {{ mantenimiento.estado }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ mantenimiento.tipo }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex justify-end space-x-3">
                        <button
                          @click="abrirModal(mantenimiento)"
                          class="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar mantenimiento"
                        >
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="completarMantenimiento(mantenimiento)"
                          v-if="mantenimiento.estado === 'Pendiente'"
                          class="text-green-600 hover:text-green-800 transition-colors"
                          title="Marcar como completado"
                        >
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          @click="eliminarMantenimiento(mantenimiento)"
                          class="text-red-600 hover:text-red-800 transition-colors"
                          title="Eliminar mantenimiento"
                        >
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div v-else class="text-center py-10">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-medium text-gray-500">No se encontraron mantenimientos</p>
            <p class="mt-2 text-gray-500">Intenta con otros filtros o programa un nuevo mantenimiento</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para programar/editar mantenimiento -->
  <transition name="modal-fade">
    <div v-if="mostrarModal" 
         class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
         @click.self="cerrarModal">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            {{ editMode ? 'Editar Mantenimiento' : 'Programar Mantenimiento' }}
          </h2>
          <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="guardarMantenimiento" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Equipo</label>
            <select
              v-model="formData.equipoId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Seleccionar equipo</option>
              <option v-for="equipo in equipos" :key="equipo.id" :value="equipo.id">
                {{ equipo.nombre }} - {{ equipo.marca }} {{ equipo.modelo }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              v-model="formData.fecha"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              v-model="formData.hora"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <input
              type="text"
              v-model="formData.responsable"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del responsable"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Mantenimiento</label>
            <select
              v-model="formData.tipo"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Seleccionar tipo</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
              <option value="Actualización">Actualización</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              v-model="formData.descripcion"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detalles del mantenimiento a realizar"
            ></textarea>
          </div>
          
          <div v-if="editMode">
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="formData.estado"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="cerrarModal"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{ editMode ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>

  <!-- Modal de confirmación para eliminar -->
  <transition name="modal-fade">
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">¿Eliminar mantenimiento?</h3>
          <p class="mt-2 text-sm text-gray-500">
            Esta acción no se puede deshacer. El mantenimiento será eliminado permanentemente.
          </p>
        </div>
        <div class="mt-6 flex justify-center space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmarEliminar"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import Modal from '@/components/Modal.vue'
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { ref, computed, reactive } from 'vue';

export default {
  components: {
    Navbar,
    Sidebar,
    Modal,
    FullCalendar
  },
  setup() {
    const sidebarExpanded = ref(false);
    const mostrarModal = ref(false);
    const showDeleteModal = ref(false);
    const currentView = ref('calendar');
    const editMode = ref(false);
    const mantenimientoToDelete = ref(null);
    const calendar = ref(null);
    
    // Datos de formulario
    const formData = reactive({
      id: null,
      equipoId: '',
      fecha: '',
      hora: '',
      responsable: '',
      tipo: '',
      descripcion: '',
      estado: 'Pendiente'
    });
    
    // Filtros
    const searchQuery = ref('');
    const filterStatus = ref('all');
    const filterDateFrom = ref('');
    const filterDateTo = ref('');
    
    // Datos de ejemplo (reemplazar con datos reales de API)
    const equipos = ref([
      { id: 1, nombre: 'Laptop Dell', marca: 'Dell', modelo: 'Latitude 5420', tipo: 'Equipo' },
      { id: 2, nombre: 'iPhone 13', marca: 'Apple', modelo: 'iPhone 13 Pro', tipo: 'Celular' },
      { id: 3, nombre: 'Impresora HP', marca: 'HP', modelo: 'LaserJet Pro', tipo: 'Impresora' },
      { id: 4, nombre: 'Monitor LG', marca: 'LG', modelo: 'UltraWide', tipo: 'Monitor' },
      { id: 5, nombre: 'Servidor', marca: 'Dell', modelo: 'PowerEdge', tipo: 'Servidor' }
    ]);
    
    const mantenimientos = ref([
      {
        id: 1,
        equipoId: 1,
        equipo: equipos.value.find(e => e.id === 1),
        fecha: '2023-06-15T10:00:00',
        responsable: 'Juan Pérez',
        tipo: 'Preventivo',
        descripcion: 'Limpieza general y actualización de software',
        estado: 'Completado'
      },
      {
        id: 2,
        equipoId: 2,
        equipo: equipos.value.find(e => e.id === 2),
        fecha: '2023-06-20T14:30:00',
        responsable: 'María López',
        tipo: 'Correctivo',
        descripcion: 'Reparación de pantalla',
        estado: 'Pendiente'
      },
      {
        id: 3,
        equipoId: 3,
        equipo: equipos.value.find(e => e.id === 3),
        fecha: '2023-06-25T09:00:00',
        responsable: 'Carlos Rodríguez',
        tipo: 'Preventivo',
        descripcion: 'Cambio de tóner y limpieza',
        estado: 'Pendiente'
      }
    ]);
    
    // Filtrar mantenimientos
    const filteredMantenimientos = computed(() => {
      return mantenimientos.value.filter(m => {
        // Filtro por búsqueda
        const searchMatch = !searchQuery.value || 
          m.equipo.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          m.responsable.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          m.tipo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          m.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase());
        
        // Filtro por estado
        const statusMatch = filterStatus.value === 'all' || 
          (filterStatus.value === 'pending' && m.estado === 'Pendiente') ||
          (filterStatus.value === 'completed' && m.estado === 'Completado') ||
          (filterStatus.value === 'cancelled' && m.estado === 'Cancelado');
        
        // Filtro por fecha
        const date = new Date(m.fecha);
        const fromDate = filterDateFrom.value ? new Date(filterDateFrom.value) : null;
        const toDate = filterDateTo.value ? new Date(filterDateTo.value) : null;
        
        const dateMatch = 
          (!fromDate || date >= fromDate) && 
          (!toDate || date <= toDate);
        
        return searchMatch && statusMatch && dateMatch;
      });
    });
    
    // Eventos para el calendario
    const calendarEvents = computed(() => {
      return filteredMantenimientos.value.map(m => ({
        id: m.id,
        title: `${m.equipo.nombre} - ${m.tipo}`,
        start: m.fecha,
        end: addHours(new Date(m.fecha), 2).toISOString(),
        backgroundColor: getEventColor(m.estado),
        borderColor: getEventColor(m.estado),
        extendedProps: {
          mantenimiento: m
        }
      }));
    });
    
    // Opciones del calendario
    const calendarOptions = computed(() => ({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      },
      locale: esLocale,
      events: calendarEvents.value,
      eventClick: handleEventClick,
      dateClick: handleDateClick,
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      height: 'auto',
      firstDay: 1, // Lunes como primer día
      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        list: 'Lista'
      }
    }));
    
    // Funciones auxiliares
    function addHours(date, hours) {
      const newDate = new Date(date);
      newDate.setHours(newDate.getHours() + hours);
      return newDate;
    }
    
    function getEventColor(estado) {
      switch (estado) {
        case 'Completado': return '#10B981'; // green
        case 'Pendiente': return '#3B82F6'; // blue
        case 'Cancelado': return '#EF4444'; // red
        default: return '#6B7280'; // gray
      }
    }
    
    function getStatusClass(estado) {
      switch (estado) {
        case 'Completado': return 'bg-green-100 text-green-800';
        case 'Pendiente': return 'bg-blue-100 text-blue-800';
        case 'Cancelado': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
    
    function getEquipmentIcon(tipo) {
      switch (tipo?.toLowerCase()) {
        case 'celular': return 'fas fa-mobile-alt';
        case 'equipo': return 'fas fa-desktop';
        case 'monitor': return 'fas fa-tv';
        case 'impresora': return 'fas fa-print';
        case 'servidor': return 'fas fa-server';
        default: return 'fas fa-microchip';
      }
    }
    
    function formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    }
    
    function formatTime(dateString) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        return '';
      }
    }
    
    // Manejadores de eventos
    function handleEventClick(info) {
      const mantenimiento = info.event.extendedProps.mantenimiento;
      abrirModal(mantenimiento);
    }
    
    function handleDateClick(info) {
      // Crear un nuevo mantenimiento con la fecha seleccionada
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      resetFormData();
      formData.fecha = info.dateStr;
      formData.hora = `${hours}:${minutes}`;
      
      abrirModal(null);
    }
    
    function resetFormData() {
      Object.assign(formData, {
        id: null,
        equipoId: '',
        fecha: '',
        hora: '',
        responsable: '',
        tipo: '',
        descripcion: '',
        estado: 'Pendiente'
      });
    }
    
    function abrirModal(mantenimiento) {
      if (mantenimiento) {
        // Modo edición
        editMode.value = true;
        const fecha = new Date(mantenimiento.fecha);
        
        Object.assign(formData, {
          id: mantenimiento.id,
          equipoId: mantenimiento.equipoId,
          fecha: fecha.toISOString().split('T')[0],
          hora: fecha.toTimeString().slice(0, 5),
          responsable: mantenimiento.responsable,
          tipo: mantenimiento.tipo,
          descripcion: mantenimiento.descripcion,
          estado: mantenimiento.estado
        });
      } else {
        // Modo creación
        editMode.value = false;
      }
      
      mostrarModal.value = true;
    }
    
    function cerrarModal() {
      mostrarModal.value = false;
      resetFormData();
    }
    
    function guardarMantenimiento() {
      // Combinar fecha y hora
      const fechaHora = new Date(`${formData.fecha}T${formData.hora}`);
      
      if (editMode.value) {
        // Actualizar mantenimiento existente
        const index = mantenimientos.value.findIndex(m => m.id === formData.id);
        if (index !== -1) {
          const equipoSeleccionado = equipos.value.find(e => e.id === parseInt(formData.equipoId));
          
          mantenimientos.value[index] = {
            ...mantenimientos.value[index],
            equipoId: parseInt(formData.equipoId),
            equipo: equipoSeleccionado,
            fecha: fechaHora.toISOString(),
            responsable: formData.responsable,
            tipo: formData.tipo,
            descripcion: formData.descripcion,
            estado: formData.estado
          };
        }
      } else {
        // Crear nuevo mantenimiento
        const equipoSeleccionado = equipos.value.find(e => e.id === parseInt(formData.equipoId));
        
        const nuevoMantenimiento = {
          id: mantenimientos.value.length + 1,
          equipoId: parseInt(formData.equipoId),
          equipo: equipoSeleccionado,
          fecha: fechaHora.toISOString(),
          responsable: formData.responsable,
          tipo: formData.tipo,
          descripcion: formData.descripcion,
          estado: 'Pendiente'
        };
        
        mantenimientos.value.push(nuevoMantenimiento);
      }
      
      cerrarModal();
    }
    
    function completarMantenimiento(mantenimiento) {
      const index = mantenimientos.value.findIndex(m => m.id === mantenimiento.id);
      if (index !== -1) {
        mantenimientos.value[index].estado = 'Completado';
      }
    }
    
    function eliminarMantenimiento(mantenimiento) {
      mantenimientoToDelete.value = mantenimiento;
      showDeleteModal.value = true;
    }
    
    function confirmarEliminar() {
      if (mantenimientoToDelete.value) {
        mantenimientos.value = mantenimientos.value.filter(
          m => m.id !== mantenimientoToDelete.value.id
        );
        showDeleteModal.value = false;
        mantenimientoToDelete.value = null;
      }
    }
    
    function toggleView() {
      currentView.value = currentView.value === 'calendar' ? 'list' : 'calendar';
    }
    
    function resetFilters() {
      searchQuery.value = '';
      filterStatus.value = 'all';
      filterDateFrom.value = '';
      filterDateTo.value = '';
    }
    
    return {
      sidebarExpanded,
      mostrarModal,
      showDeleteModal,
      currentView,
      editMode,
      formData,
      searchQuery,
      filterStatus,
      filterDateFrom,
      filterDateTo,
      equipos,
      mantenimientos,
      filteredMantenimientos,
      calendarOptions,
      calendar,
      abrirModal,
      cerrarModal,
      guardarMantenimiento,
      completarMantenimiento,
      eliminarMantenimiento,
      confirmarEliminar,
      toggleView,
      resetFilters,
      getStatusClass,
      getEquipmentIcon,
      formatDate,
      formatTime
    };
  }
}
</script>
<style scoped>
/* Base layout */
.mantenimientos-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.content {
  transition: margin-left 0.3s ease;
}

/* Equipment icon styling */
.equipment-icon-container {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  flex-shrink: 0;
}

.equipment-icon {
  font-size: 1.25rem;
}

.fas.fa-mobile-alt {
  color: #10b981; /* green */
}

.fas.fa-desktop {
  color: #3b82f6; /* blue */
}

.fas.fa-tv {
  color: #8b5cf6; /* purple */
}

.fas.fa-print {
  color: #f59e0b; /* amber */
}

.fas.fa-server {
  color: #6366f1; /* indigo */
}

.fas.fa-microchip {
  color: #6b7280; /* gray */
}

/* Calendar customization */
:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem !important;
  font-weight: 600;
}

:deep(.fc-button-primary) {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

:deep(.fc-button-primary:hover) {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}

:deep(.fc-button-primary:disabled) {
  background-color: #93c5fd !important;
  border-color: #93c5fd !important;
}

:deep(.fc-daygrid-day.fc-day-today) {
  background-color: #eff6ff !important;
}

:deep(.fc-event) {
  cursor: pointer;
  border-radius: 4px;
  padding: 2px;
  font-size: 0.875rem;
}

:deep(.fc-event:hover) {
  filter: brightness(0.9);
}

:deep(.fc-list-event:hover td) {
  background-color: #f3f4f6;
}

/* Modal animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content {
    margin-left: 0 !important;
    padding: 1rem;
  }
  
  :deep(.fc-toolbar) {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  :deep(.fc-toolbar-chunk) {
    display: flex;
    justify-content: center;
  }
  
  :deep(.fc-toolbar-title) {
    font-size: 1.125rem !important;
  }
  
  .equipment-icon-container {
    width: 2rem;
    height: 2rem;
  }
  
  .equipment-icon {
    font-size: 1rem;
  }
}
</style>