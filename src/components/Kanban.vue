<template>
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <!-- Columna: Nuevo -->
        <div class="bg-white rounded-lg shadow-sm p-4"
            @dragover.prevent
            @drop="handleDrop('nuevo', $event)">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800">Nuevo</h3>
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {{ getTicketsByStatus('nuevo').length }}
                </span>
            </div>
            <div class="kanban-column overflow-y-auto">
                <div v-if="getTicketsByStatus('nuevo').length === 0"
                    class="flex flex-col items-center justify-center h-32 text-gray-400">
                    <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm">No hay tickets nuevos</p>
                </div>
                <div v-for="ticket in getTicketsByStatus('nuevo')" :key="ticket.id"
                    class="ticket-card bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-pointer hover:border-blue-300"
                    draggable="true"
                    @dragstart="handleDragStart(ticket, $event)"
                    @dblclick="openTicketDetail(ticket)">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-medium text-gray-900 line-clamp-2">{{ ticket.titulo }}</h4>
                        <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(ticket.prioridad)">
                            {{ getPriorityText(ticket.prioridad) }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ ticket.descripcion }}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="avatar-circle-xs"
                                :style="{ backgroundColor: getAvatarColor(ticket.usuario?.nombre || 'Usuario') }">
                                {{ getInitials(ticket.usuario?.nombre || 'Usuario') }}
                                {{ console.log(ticket.usuario) }}
                            </div>
                            <span class="ml-2 text-xs text-gray-500">{{ formatDate(ticket.createdAt) }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{ getCategoryText(ticket.categoria) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna: Pendiente -->
        <div class="bg-white rounded-lg shadow-sm p-4"
            @dragover.prevent
            @drop="handleDrop('pendiente', $event)">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800">Pendiente</h3>
                <span class="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {{ getTicketsByStatus('pendiente').length }}
                </span>
            </div>
            <div class="kanban-column overflow-y-auto">
                <div v-if="getTicketsByStatus('pendiente').length === 0"
                    class="flex flex-col items-center justify-center h-32 text-gray-400">
                    <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm">No hay tickets pendientes</p>
                </div>
                <div v-for="ticket in getTicketsByStatus('pendiente')" :key="ticket.id"
                    class="ticket-card bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-pointer hover:border-amber-300"
                    draggable="true"
                    @dragstart="handleDragStart(ticket, $event)"
                    @dblclick="openTicketDetail(ticket)">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-medium text-gray-900 line-clamp-2">{{ ticket.titulo }}</h4>
                        <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(ticket.prioridad)">
                            {{ getPriorityText(ticket.prioridad) }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ ticket.descripcion }}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="avatar-circle-xs"
                                :style="{ backgroundColor: getAvatarColor(ticket.usuario?.nombre || 'Usuario') }">
                                {{ getInitials(ticket.usuario?.nombre || 'Usuario') }}
                            </div>
                            <span class="ml-2 text-xs text-gray-500">{{ formatDate(ticket.createdAt) }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{ getCategoryText(ticket.categoria) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna: En Proceso -->
        <div class="bg-white rounded-lg shadow-sm p-4"
            @dragover.prevent
            @drop="handleDrop('en_proceso', $event)">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800">En Proceso</h3>
                <span class="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {{ getTicketsByStatus('en_proceso').length }}
                </span>
            </div>
            <div class="kanban-column overflow-y-auto">
                <div v-if="getTicketsByStatus('en_proceso').length === 0"
                    class="flex flex-col items-center justify-center h-32 text-gray-400">
                    <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm">No hay tickets en proceso</p>
                </div>
                <div v-for="ticket in getTicketsByStatus('en_proceso')" :key="ticket.id"
                    class="ticket-card bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-pointer hover:border-amber-300"
                    draggable="true"
                    @dragstart="handleDragStart(ticket, $event)"
                    @dblclick="openTicketDetail(ticket)">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-medium text-gray-900 line-clamp-2">{{ ticket.titulo }}</h4>
                        <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(ticket.prioridad)">
                            {{ getPriorityText(ticket.prioridad) }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ ticket.descripcion }}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="avatar-circle-xs"
                                :style="{ backgroundColor: getAvatarColor(ticket.usuario?.nombre || 'Usuario') }">
                                {{ getInitials(ticket.usuario?.nombre || 'Usuario') }}
                            </div>
                            <span class="ml-2 text-xs text-gray-500">{{ formatDate(ticket.createdAt) }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{ getCategoryText(ticket.categoria) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna: En Espera -->
        <div class="bg-white rounded-lg shadow-sm p-4"
            @dragover.prevent
            @drop="handleDrop('en_espera', $event)">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800">En Espera</h3>
                <span class="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {{ getTicketsByStatus('en_espera').length }}
                </span>
            </div>
            <div class="kanban-column overflow-y-auto">
                <div v-if="getTicketsByStatus('en_espera').length === 0"
                    class="flex flex-col items-center justify-center h-32 text-gray-400">
                    <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm">No hay tickets en espera</p>
                </div>
                <div v-for="ticket in getTicketsByStatus('en_espera')" :key="ticket.id"
                    class="ticket-card bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-pointer hover:border-purple-300"
                    draggable="true"
                    @dragstart="handleDragStart(ticket, $event)"
                    @dblclick="openTicketDetail(ticket)">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-medium text-gray-900 line-clamp-2">{{ ticket.titulo }}</h4>
                        <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(ticket.prioridad)">
                            {{ getPriorityText(ticket.prioridad) }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ ticket.descripcion }}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="avatar-circle-xs"
                                :style="{ backgroundColor: getAvatarColor(ticket.usuario?.nombre || 'Usuario') }">
                                {{ getInitials(ticket.usuario?.nombre || 'Usuario') }}
                            </div>
                            <span class="ml-2 text-xs text-gray-500">{{ formatDate(ticket.createdAt) }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{ getCategoryText(ticket.categoria) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna: Resuelto -->
        <div class="bg-white rounded-lg shadow-sm p-4"
            @dragover.prevent
            @drop="handleDrop('resuelto', $event)">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800">Resuelto</h3>
                <span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {{ getTicketsByStatus('resuelto').length }}
                </span>
            </div>
            <div class="kanban-column overflow-y-auto">
                <div v-if="getTicketsByStatus('resuelto').length === 0"
                    class="flex flex-col items-center justify-center h-32 text-gray-400">
                    <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm">No hay tickets resueltos</p>
                </div>
                <div v-for="ticket in getTicketsByStatus('resuelto')" :key="ticket.id"
                    class="ticket-card bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-pointer hover:border-green-300"
                    draggable="true"
                    @dragstart="handleDragStart(ticket, $event)"
                    @dblclick="openTicketDetail(ticket)">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-medium text-gray-900 line-clamp-2">{{ ticket.titulo }}</h4>
                        <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(ticket.prioridad)">
                            {{ getPriorityText(ticket.prioridad) }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ ticket.descripcion }}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="avatar-circle-xs"
                                :style="{ backgroundColor: getAvatarColor(ticket.usuario?.nombre || 'Usuario') }">
                                {{ getInitials(ticket.usuario?.nombre || 'Usuario') }}
                            </div>
                            <span class="ml-2 text-xs text-gray-500">{{ formatDate(ticket.createdAt) }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{ getCategoryText(ticket.categoria) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Columna: Cerrado -->
        <div class="bg-white rounded-lg shadow-sm p-4"
            @dragover.prevent
            @drop="handleDrop('cerrado', $event)">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800">Cerrado</h3>
                <span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {{ getTicketsByStatus('cerrado').length }}
                </span>
            </div>
            <div class="kanban-column overflow-y-auto">
                <div v-if="getTicketsByStatus('cerrado').length === 0"
                    class="flex flex-col items-center justify-center h-32 text-gray-400">
                    <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm">No hay tickets resueltos</p>
                </div>
                <div v-for="ticket in getTicketsByStatus('cerrado')" :key="ticket.id"
                    class="ticket-card bg-white border border-gray-200 rounded-lg p-4 mb-3 cursor-pointer hover:border-green-300"
                    draggable="true"
                    @dragstart="handleDragStart(ticket, $event)"
                    @dblclick="openTicketDetail(ticket)">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-medium text-gray-900 line-clamp-2">{{ ticket.titulo }}</h4>
                        <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(ticket.prioridad)">
                            {{ getPriorityText(ticket.prioridad) }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ ticket.descripcion }}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="avatar-circle-xs"
                                :style="{ backgroundColor: getAvatarColor(ticket.usuario?.nombre || 'Usuario') }">
                                {{ getInitials(ticket.usuario?.nombre || 'Usuario') }}
                            </div>
                            <span class="ml-2 text-xs text-gray-500">{{ formatDate(ticket.createdAt) }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{ getCategoryText(ticket.categoria) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Kanban',
    props: {
        getTicketsByStatus: {
            type: Function,
            required: true
        },
        openTicketDetail: {
            type: Function,
            required: true
        },
        getPriorityClass: {
            type: Function,
            required: true
        },
        getPriorityText: {
            type: Function,
            required: true
        },
        getAvatarColor: {
            type: Function,
            required: true
        },
        getInitials: {
            type: Function,
            required: true
        },
        formatDate: {
            type: Function,
            required: true
        },
        getCategoryText: {
            type: Function,
            required: true
        },
        updateTicketState: { // nueva función para actualizar el estado
            type: Function,
            required: true
        }
    },
    methods: {
        handleDragStart(ticket, event) {
            event.dataTransfer.setData("ticketId", ticket.id);
        },
        handleDrop(newState, event) {
            const ticketId = event.dataTransfer.getData("ticketId");
            if (ticketId) {
                this.updateTicketState(ticketId, newState);
            }
        }
    }
};
</script>

<style scoped>
.kanban-column {
    max-height: calc(100vh - 280px);
    min-height: 200px;
}

.ticket-card {
    transition: all 0.2s ease;
}

.ticket-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
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

</style>