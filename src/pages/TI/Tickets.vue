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
            <p class="text-gray-600 mt-1">Gestiona solicitudes de soporte técnico</p>
          </div>

          <div class="mt-4 md:mt-0 flex flex-wrap gap-3">
            <!-- Botón para cambiar vista -->
            <button @click="toggleView"
              class="flex items-center justify-center bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-300 shadow-sm">
              <svg v-if="currentView === 'kanban'" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0-2 2" />
              </svg>
              {{ currentView === 'kanban' ? 'Vista Lista' : 'Vista Kanban' }}
            </button>

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
        <div v-if="currentView === 'list'" class="bg-white rounded-lg shadow-sm overflow-hidden">
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
                      class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

        <!-- Vista Kanban -->
        <Kanban v-else :getTicketsByStatus="getTicketsByStatus" :openTicketDetail="openTicketDetail"
          :getPriorityClass="getPriorityClass" :getPriorityText="getPriorityText" :getAvatarColor="getAvatarColor"
          :getInitials="getInitials" :formatDate="formatDate" :getCategoryText="getCategoryText"
          :updateTicketState="updateTicketState" />
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

          <!-- Remove solicitante and email fields since they're part of usuario object -->
          <!-- Instead, we'll use the current user from localStorage -->

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

            <div v-if="editMode">
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

          <div v-if="editMode">
            <label class="block text-sm font-medium text-gray-700 mb-1">Solución / Comentarios</label>
            <textarea v-model="ticketForm.solucion" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe la solución aplicada o agrega comentarios..."></textarea>
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
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 transform transition-all max-h-[90vh] overflow-y-auto">
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
              <div class="flex items-center mt-2">
                <div class="avatar-circle-sm mr-3"
                  :style="{ backgroundColor: getAvatarColor(selectedTicket.usuario.nombre) }">
                  {{ getInitials(selectedTicket.usuario.nombre) }}
                  {{ console.log("Usuario" + selectedTicket.usuario.nombre) }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ selectedTicket.usuario.nombre }}</p>
                  <p class="text-sm text-gray-500">{{ selectedTicket.usuario.email }}</p>
                </div>
              </div>
            </div>

            <div class="mt-4 md:mt-0 flex flex-col items-end">
              <div class="flex space-x-2 mb-2">
                <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(selectedTicket.estado)">
                  {{ getStatusText(selectedTicket.estado) }}
                </span>
                <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(selectedTicket.prioridad)">
                  {{ getPriorityText(selectedTicket.prioridad) }}
                </span>
              </div>
              <p class="text-sm text-gray-500">Creado: {{ formatDate(selectedTicket.createdAt) }}</p>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Categoría</h4>
            <p class="text-sm text-gray-900">{{ getCategoryText(selectedTicket.categoria) }}</p>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Descripción</h4>
            <p class="text-sm text-gray-900 whitespace-pre-line">{{ selectedTicket.descripcion }}</p>
          </div>

          <div v-if="selectedTicket.solucion" class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Solución / Comentarios</h4>
            <p class="text-sm text-gray-900 whitespace-pre-line">{{ selectedTicket.solucion }}</p>
          </div>

          <div class="border-t border-gray-200 pt-4 flex justify-end space-x-3">
            <button @click="openEditTicketModal(selectedTicket)"
              class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
              Editar Ticket
            </button>
            <button v-if="selectedTicket.estado !== 'resuelto' && selectedTicket.estado !== 'cerrado'"
              @click="resolveTicket(selectedTicket)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Marcar como Resuelto
            </button>
            <button v-if="selectedTicket.estado !== 'cerrado'" @click="closeTicket(selectedTicket)"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Cerrar Ticket
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
import Kanban from '../../components/Kanban.vue';
import { getTickets, createTicket, updateTicket, deleteTicket } from '@/api/tickets.js';

export default {
  name: 'Tickets',
  components: {
    Sidebar,
    Kanban
  },
  setup() {
    // Estados generales
    const sidebarExpanded = ref(false);
    const currentView = ref('list');
    const searchQuery = ref('');
    const filterStatus = ref('all');
    const filterPriority = ref('all');
    const filterCategory = ref('all');

    // Estados de modales y edición
    const showTicketModal = ref(false);
    const showDetailModal = ref(false);
    const editMode = ref(false);
    const selectedTicket = ref({});

    // Formulario para crear/editar tickets
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

    // Lista de tickets obtenida de la API
    const tickets = ref([]);

    // Función para traer los tickets desde el endpoint
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        tickets.value = data;
        console.log("Tickets cargados:", tickets.value);
      } catch (error) {
        console.error("Error fetching tickets", error);
      }
    };

    onMounted(() => {
      fetchTickets();
    });

    // Tickets filtrados según los criterios de búsqueda
    const filteredTickets = computed(() => {
      return tickets.value.filter(ticket => {
        const matchesSearch = searchQuery.value === '' ||
          ticket.titulo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          ticket.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (ticket.usuario?.nombre || '').toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesStatus = filterStatus.value === 'all' || ticket.estado === filterStatus.value;
        const matchesPriority = filterPriority.value === 'all' || ticket.prioridad === filterPriority.value;
        const matchesCategory = filterCategory.value === 'all' || ticket.categoria === filterCategory.value;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
      });
    });

    // Métodos para vista y filtros
    const toggleView = () => {
      currentView.value = currentView.value === 'list' ? 'kanban' : 'list';
    };

    const resetFilters = () => {
      searchQuery.value = '';
      filterStatus.value = 'all';
      filterPriority.value = 'all';
      filterCategory.value = 'all';
    };

    // Modal para nuevo ticket
    const openNewTicketModal = () => {
      editMode.value = false;
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('currentUser'));
      } catch (e) {
        console.error('Error parsing currentUser from localStorage', e);
      }

      ticketForm.value = {
        id: null,
        titulo: '',
        descripcion: '',
        categoria: '',
        prioridad: '',
        estado: 'nuevo',
        equipoId: null,
        usuarioId: user?.id || null
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
          // Actualizar ticket
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
          // Crear ticket
          const newTicketData = {
            titulo: ticketForm.value.titulo,
            descripcion: ticketForm.value.descripcion,
            categoria: ticketForm.value.categoria,
            prioridad: ticketForm.value.prioridad,
            usuarioId: ticketForm.value.usuarioId,
            equipoId: ticketForm.value.equipoId,
            estado: ticketForm.value.estado // Verifica que aquí sea 'nuevo'
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

    // Marcar ticket como resuelto
    const resolveTicket = async (ticket) => {
      try {
        const updateData = { estado: 'resuelto' };
        await updateTicket(ticket.id, updateData);
        await fetchTickets();
        if (selectedTicket.value.id === ticket.id) {
          selectedTicket.value = { ...ticket, estado: 'resuelto' };
        }
      } catch (error) {
        console.error("Error resolving ticket", error);
      }
    };

    // Cerrar ticket
    const closeTicket = async (ticket) => {
      try {
        const updateData = {
          estado: 'cerrado',
          fechaCierre: new Date().toISOString()
        };
        await updateTicket(ticket.id, updateData);
        await fetchTickets();
        if (selectedTicket.value.id === ticket.id) {
          selectedTicket.value = {
            ...ticket,
            estado: 'cerrado',
            fechaCierre: new Date().toISOString()
          };
        }
        closeDetailModal();
      } catch (error) {
        console.error("Error closing ticket", error);
      }
    };

    const getTicketsByStatus = (status) => {
      // Add console log to debug
      console.log(`Filtering tickets by status: ${status}`,
        filteredTickets.value.filter(ticket => ticket.estado === status));
      return filteredTickets.value.filter(ticket => ticket.estado === status);
    };

    // Función para actualizar el estado del ticket
    const updateTicketState = async (ticketId, newState) => {
      try {
        await updateTicket(ticketId, { estado: newState });
        await fetchTickets();
      } catch (error) {
        console.error("Error actualizando el estado del ticket", error);
      }
    };

    // Funciones de utilidades
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
      currentView,
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
      toggleView,
      resetFilters,
      openNewTicketModal,
      openEditTicketModal,
      closeTicketModal,
      openTicketDetail,
      closeDetailModal,
      submitTicket,
      resolveTicket,
      closeTicket,
      getTicketsByStatus,
      updateTicketState,
      formatDate,
      getInitials,
      getAvatarColor,
      getStatusClass,
      getStatusText,
      getPriorityClass,
      getPriorityText,
      getCategoryText
    };
  }
};
</script>

<style scoped>
/* Estilos para los avatares */
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

/* Estilos para las columnas Kanban */
.kanban-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 240px);
}

/* Animaciones para modales */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Estilos para truncar texto */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Estilos para tarjetas de tickets */
.ticket-card {
  transition: all 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Estilos para tablas responsivas */
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>