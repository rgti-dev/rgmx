<template>
    <div class="tickets-container flex w-full bg-gray-50">
      <!-- Sidebar -->
      <Sidebar v-model:isExpanded="sidebarExpanded" />
  
      <!-- Contenido del Dashboard -->
      <div class="content flex-1 w-full relative transition-all duration-300"
        :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }">
  
        <div class="p-4 md:p-8 mt-2">
          <!-- Header mejorado -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">Sistema de Tickets</h1>
              <p class="text-gray-600 mt-1">Levanta un nuevo ticket con soporte técnico</p>
            </div>
  
            <div class="mt-4 md:mt-0 flex flex-wrap gap-3">
              <button @click="openNewTicketModal"
                class="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-sm hover:shadow">
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Ticket
              </button>
            </div>
          </div>
  
          <!-- Filtros -->
          <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div class="relative">
                <input v-model="searchQuery" type="text" placeholder="Buscar por título, descripción o usuario..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
  
            <div class="w-full sm:w-auto">
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select v-model="filterStatus"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Todos</option>
                <option value="nuevo">Nuevo</option>
                <option value="en_proceso">En Proceso</option>
                <option value="en_espera">En Espera</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
  
            <div class="w-full sm:w-auto">
              <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select v-model="filterPriority"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Todas</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
  
            <div class="w-full sm:w-auto">
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select v-model="filterCategory"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Todas</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="red">Red</option>
                <option value="acceso">Acceso</option>
                <option value="otros">Otros</option>
              </select>
            </div>
  
            <div class="flex items-end">
              <button @click="resetFilters"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Limpiar
              </button>
            </div>
          </div>
  
          <!-- Vista de Lista -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div v-if="filteredTickets.length > 0">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Título
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Solicitante
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col"
                        class="px-6 py-3 text-right hidden text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="ticket in filteredTickets" :key="ticket.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">#{{ ticket.id }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-gray-900 truncate max-w-[200px]">{{ ticket.titulo }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="avatar-circle-sm"
                            :style="{ backgroundColor: getAvatarColor(ticket.usuario?.nombre || 'Usuario') }">
                            {{ getInitials(ticket.usuario?.nombre || 'Usuario') }}
                          </div>
                          <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">{{ ticket.usuario?.nombre || 'Usuario' }}</div>
                            <div class="text-xs text-gray-500">{{ ticket.usuario?.email || '' }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="getStatusClass(ticket.estado)">
                          {{ getStatusText(ticket.estado) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="getPriorityClass(ticket.prioridad)">
                          {{ getPriorityText(ticket.prioridad) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ getCategoryText(ticket.categoria) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(ticket.createdAt) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium hidden">
                        <div class="flex justify-end space-x-3">
                          <button @click="openTicketDetail(ticket)"
                            class="text-blue-600 hover:text-blue-800 transition-colors" title="Ver detalles">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button @click="openEditTicketModal(ticket)"
                            class="text-amber-600 hover:text-amber-800 transition-colors" title="Editar ticket">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-lg font-medium text-gray-500">No se encontraron tickets</p>
              <p class="mt-2 text-gray-500">Intenta con otros filtros o crea un nuevo ticket</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Modal para crear/editar ticket -->
    <transition name="modal-fade">
      <div v-if="showTicketModal" class="modal-backdrop" @click.self="closeTicketModal">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 transform transition-all">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ editMode ? 'Editar Ticket' : 'Nuevo Ticket' }}
            </h2>
            <button @click="closeTicketModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <form @submit.prevent="submitTicket" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input type="text" v-model="ticketForm.titulo" required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Título del ticket" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select v-model="ticketForm.categoria" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="" disabled>Seleccionar categoría</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="red">Red</option>
                  <option value="acceso">Acceso</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
              
              <!-- Nuevo bloque: mostrar lista de equipos si la categoría es hardware -->
              <div v-if="ticketForm.categoria === 'hardware'">
                <label class="block text-sm font-medium text-gray-700 mb-1">Equipo asignado</label>
                <select v-model="ticketForm.equipoId" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="" disabled>Seleccionar equipo</option>
                  <option v-for="equipo in equipos" :key="equipo.id" :value="equipo.id">
                    {{ equipo.nombre }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select v-model="ticketForm.prioridad" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="" disabled>Seleccionar prioridad</option>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
              
              <div class="hidden">
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select v-model="ticketForm.estado" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="nuevo">Nuevo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="en_espera">En Espera</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea v-model="ticketForm.descripcion" required rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe el problema o solicitud..."></textarea>
            </div>
  
            
  
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeTicketModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {{ editMode ? 'Actualizar Ticket' : 'Crear Ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  
    <!-- Modal para detalles del ticket -->
    <transition name="modal-fade">
      <div v-if="showDetailModal" class="modal-backdrop" @click.self="closeDetailModal">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 transform transition-all max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">
              Detalles del Ticket #{{ selectedTicket.id }}
            </h2>
            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <div class="space-y-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">{{ selectedTicket.titulo }}</h3>
                <p class="text-sm text-gray-500">{{ formatDate(selectedTicket.createdAt) }}</p>
              </div>
            </div>
  
            <div>
              <p class="text-sm text-gray-900">{{ selectedTicket.descripcion }}</p>
            </div>
  
            <div class="flex justify-end">
              <button @click="closeDetailModal"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import Sidebar from '../../components/Sidebar.vue';
  import { getTickets, createTicket, updateTicket } from '@/api/tickets.js';
  
  export default {
    name: 'SupportTickets',
    components: { Sidebar },
    setup() {
      // Obtenemos el usuario actual
      const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
      // Asumimos que currentUser.equipos es un array con los equipos asignados
      const equipos = ref(currentUser.equipos || []);
  
      // Estados generales y demás variables...
      const sidebarExpanded = ref(false);
      const searchQuery = ref('');
      const filterStatus = ref('all');
      const filterPriority = ref('all');
      const filterCategory = ref('all');
      const showTicketModal = ref(false);
      const showDetailModal = ref(false);
      const editMode = ref(false);
      const selectedTicket = ref({});
      const ticketForm = ref({
        id: null,
        titulo: '',
        descripcion: '',
        categoria: '',
        prioridad: '',
        estado: 'nuevo',
        equipoId: null,
        usuarioId: null
      });
      const tickets = ref([]);
  
      const fetchTickets = async () => {
        try {
          const data = await getTickets();
          tickets.value = data;
          console.log("Tickets cargados:", tickets.value);
        } catch (error) {
          console.error("Error fetching tickets", error);
        }
      };
  
      onMounted(fetchTickets);
  
      // Filtrar tickets y mostrar únicamente los correspondientes al usuario actual
      const filteredTickets = computed(() => {
        return tickets.value.filter(ticket => {
          // Solo mostramos tickets que pertenezcan al usuario actual
          const belongsToUser = ticket.usuario?.id === currentUser.id;
          const matchesSearch =
            searchQuery.value === '' ||
            ticket.titulo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            ticket.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (ticket.usuario?.nombre || '').toLowerCase().includes(searchQuery.value.toLowerCase());
          const matchesStatus = filterStatus.value === 'all' || ticket.estado === filterStatus.value;
          const matchesPriority = filterPriority.value === 'all' || ticket.prioridad === filterPriority.value;
          const matchesCategory = filterCategory.value === 'all' || ticket.categoria === filterCategory.value;
  
          return belongsToUser && matchesSearch && matchesStatus && matchesPriority && matchesCategory;
        });
      });
  
      const resetFilters = () => {
        searchQuery.value = '';
        filterStatus.value = 'all';
        filterPriority.value = 'all';
        filterCategory.value = 'all';
      };
  
      const openNewTicketModal = () => {
        editMode.value = false;
        ticketForm.value = {
          id: null,
          titulo: '',
          descripcion: '',
          categoria: '',
          prioridad: '',
          estado: 'nuevo',
          equipoId: null,
          usuarioId: currentUser.id || null
        };
        showTicketModal.value = true;
      };
  
      const openEditTicketModal = (ticket) => {
        editMode.value = true;
        ticketForm.value = {
          id: ticket.id,
          titulo: ticket.titulo,
          descripcion: ticket.descripcion,
          categoria: ticket.categoria,
          prioridad: ticket.prioridad,
          estado: ticket.estado,
          equipoId: ticket.equipoId,
          usuarioId: ticket.usuarioId
        };
  
        showTicketModal.value = true;
  
        if (showDetailModal.value) {
          showDetailModal.value = false;
        }
      };
  
      const closeTicketModal = () => {
        showTicketModal.value = false;
      };
  
      const openTicketDetail = (ticket) => {
        selectedTicket.value = ticket;
        showDetailModal.value = true;
      };
  
      const closeDetailModal = () => {
        showDetailModal.value = false;
      };
  
      // Enviar ticket (crear o actualizar)
      const submitTicket = async () => {
        try {
          if (editMode.value) {
            const updateData = {
              titulo: ticketForm.value.titulo,
              descripcion: ticketForm.value.descripcion,
              categoria: ticketForm.value.categoria,
              prioridad: ticketForm.value.prioridad,
              estado: ticketForm.value.estado,
              equipoId: ticketForm.value.equipoId
            };
            await updateTicket(ticketForm.value.id, updateData);
          } else {
            const newTicketData = {
              titulo: ticketForm.value.titulo,
              descripcion: ticketForm.value.descripcion,
              categoria: ticketForm.value.categoria,
              prioridad: ticketForm.value.prioridad,
              usuarioId: ticketForm.value.usuarioId,
              equipoId: ticketForm.value.equipoId,
              estado: ticketForm.value.estado
            };
            console.log("Creando ticket con datos:", newTicketData);
            await createTicket(newTicketData);
          }
          await fetchTickets();
          closeTicketModal();
        } catch (error) {
          console.error("Error submitting ticket", error);
        }
      };
  
      // Utilidades
      const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
  
      const getInitials = (name) => {
        if (!name) return '';
        return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
      };
  
      const getAvatarColor = (name) => {
        if (!name) return '#6B7280';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316'];
        return colors[Math.abs(hash) % colors.length];
      };
  
      const getStatusClass = (status) => {
        const classes = {
          nuevo: 'bg-blue-100 text-blue-800',
          pendiente: 'bg-amber-100 text-amber-800',
          en_proceso: 'bg-amber-100 text-amber-800',
          en_espera: 'bg-purple-100 text-purple-800',
          resuelto: 'bg-green-100 text-green-800',
          cerrado: 'bg-gray-100 text-gray-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
      };
  
      const getStatusText = (status) => {
        const texts = {
          nuevo: 'Nuevo',
          pendiente: 'Pendiente',
          en_proceso: 'En Proceso',
          en_espera: 'En Espera',
          resuelto: 'Resuelto',
          cerrado: 'Cerrado'
        };
        return texts[status] || status;
      };
  
      const getPriorityClass = (priority) => {
        const classes = {
          baja: 'bg-green-100 text-green-800',
          media: 'bg-blue-100 text-blue-800',
          alta: 'bg-amber-100 text-amber-800',
          critica: 'bg-red-100 text-red-800'
        };
        return classes[priority] || 'bg-gray-100 text-gray-800';
      };
  
      const getPriorityText = (priority) => {
        const texts = {
          baja: 'Baja',
          media: 'Media',
          alta: 'Alta',
          critica: 'Crítica'
        };
        return texts[priority] || priority;
      };
  
      const getCategoryText = (category) => {
        const texts = {
          hardware: 'Hardware',
          software: 'Software',
          red: 'Red',
          acceso: 'Acceso',
          otros: 'Otros'
        };
        return texts[category] || category;
      };
  
      return {
        sidebarExpanded,
        searchQuery,
        filterStatus,
        filterPriority,
        filterCategory,
        showTicketModal,
        showDetailModal,
        editMode,
        selectedTicket,
        ticketForm,
        tickets,
        filteredTickets,
        resetFilters,
        openNewTicketModal,
        openEditTicketModal,
        closeTicketModal,
        openTicketDetail,
        closeDetailModal,
        submitTicket,
        formatDate,
        getInitials,
        getAvatarColor,
        getStatusClass,
        getStatusText,
        getPriorityClass,
        getPriorityText,
        getCategoryText,
        equipos
      };
    }
  };
  </script>
  
  <style scoped>
  .avatar-circle-sm {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .avatar-circle-xs {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
  }
  
  @media (max-width: 768px) {
    table {
      display: block;
      overflow-x: auto;
      white-space: nowrap;
    }
  }
  
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    backdrop-filter: blur(3px);
    animation: fadeIn 0.2s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  </style>