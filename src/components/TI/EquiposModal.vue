<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-fadeo" @click.self="close">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl p-0 overflow-hidden">
        <!-- Header del modal -->
        <div class="bg-gray-50 p-6 border-b">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="avatar-circle mr-4" :style="{ backgroundColor: getAvatarColor(usuario.nombre) }">
                {{ getInitials(usuario.nombre) }}
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ usuario.nombre }}</h2>
                <p class="text-gray-600">{{ usuario.email }}</p>
              </div>
            </div>
            <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenido del modal -->
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Equipos asignados</h3>

          <div v-if="usuario.equipos && usuario.equipos.length > 0">
            <!-- Tarjetas de equipos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="equipo in usuario.equipos" :key="equipo.id"
                class="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow p-5">
                <div class="flex items-start">
                  <div class="equipment-icon-container mr-4">
                    <i :class="getEquipmentIcon(equipo.tipo)" class="equipment-icon"></i>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="text-lg font-semibold text-gray-800">{{ equipo.nombre }}</h4>
                      <span class="status-badge" :class="getStatusClass(equipo.estado)">
                        {{ equipo.estado }}
                      </span>
                    </div>

                    <div class="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                      <div class="info-item">
                        <span class="info-label">Tipo:</span>
                        <span class="info-value">{{ equipo.tipo }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Marca:</span>
                        <span class="info-value">{{ equipo.marca }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Modelo:</span>
                        <span class="info-value">{{ equipo.modelo }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Serie:</span>
                        <span class="info-value">{{ equipo.serie || 'N/A' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Departamento:</span>
                        <span class="info-value">{{ equipo.departamento || 'N/A' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Puesto:</span>
                        <span class="info-value">{{ equipo.puesto || 'N/A' }}</span>
                      </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-gray-100">
                      <div class="accordion">
                        <button @click="toggleAccordion(equipo.id)" class="accordion-button">
                          <span>Información adicional</span>
                          <svg class="w-5 h-5 transform transition-transform"
                            :class="{ 'rotate-180': openAccordions.includes(equipo.id) }" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        <div v-show="openAccordions.includes(equipo.id)" class="accordion-content">
                          <div class="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                            <div class="info-item">
                              <span class="info-label">Precio:</span>
                              <span class="info-value">${{ equipo.precio || '0' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Proveedor:</span>
                              <span class="info-value">{{ equipo.proveedor || 'N/A' }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Fecha Compra:</span>
                              <span class="info-value">{{ formatDate(equipo.fechaCompra) }}</span>
                            </div>
                            <div class="info-item">
                              <span class="info-label">Fin Garantía:</span>
                              <span class="info-value">{{ formatDate(equipo.finGarantia) }}</span>
                            </div>

                            <!-- Campos específicos según el tipo de equipo -->
                            <template v-if="equipo.tipo === 'Celular'">
                              <div class="info-item col-span-2">
                                <span class="info-label">Número Asignado:</span>
                                <span class="info-value">{{ equipo.numeroAsignado || 'N/A' }}</span>
                              </div>
                              <div class="info-item col-span-2">
                                <span class="info-label">IMEI:</span>
                                <span class="info-value">{{ equipo.IMEI || 'N/A' }}</span>
                              </div>
                            </template>

                            <template v-if="equipo.tipo === 'Equipo'">
                              <div class="info-item">
                                <span class="info-label">Procesador:</span>
                                <span class="info-value">{{ equipo.procesador || 'N/A' }}</span>
                              </div>
                              <div class="info-item">
                                <span class="info-label">RAM:</span>
                                <span class="info-value">{{ equipo.ram || 'N/A' }}</span>
                              </div>
                              <div class="info-item">
                                <span class="info-label">Almacenamiento:</span>
                                <span class="info-value">{{ equipo.almacenamiento || 'N/A' }}</span>
                              </div>
                              <div class="info-item">
                                <span class="info-label">Sistema Operativo:</span>
                                <span class="info-value">{{ equipo.sistemaOperativo || 'N/A' }}</span>
                              </div>
                            </template>

                            <div v-if="equipo.notas" class="info-item col-span-2 mt-2">
                              <span class="info-label">Notas:</span>
                              <span class="info-value">{{ equipo.notas }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-medium text-gray-500">No se encontraron equipos asignados.</p>
          </div>
        </div>

        <!-- Footer del modal -->
        <div class="bg-gray-50 p-4 border-t flex justify-end">
          <button @click="close"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'EquiposModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    usuario: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const openAccordions = ref([]);

    const close = () => {
      emit('close');
    };

    const toggleAccordion = (equipoId) => {
      const index = openAccordions.value.indexOf(equipoId);
      if (index === -1) {
        openAccordions.value.push(equipoId);
      } else {
        openAccordions.value.splice(index, 1);
      }
    };

    const getInitials = (name) => {
      if (!name) return '';
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };

    const getAvatarColor = (name) => {
      if (!name) return '#6B7280'; // Default gray

      // Lista de colores para avatares
      const colors = [
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // amber
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#EF4444', // red
        '#06B6D4', // cyan
        '#6366F1', // indigo
      ];

      // Usar el nombre para generar un índice consistente
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }

      // Convertir a índice positivo dentro del rango de colores
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    };

    const getEquipmentIcon = (tipo) => {
      switch (tipo?.toLowerCase()) {
        case 'celular':
          return 'fas fa-mobile-alt';
        case 'equipo':
          return 'fas fa-desktop';
        case 'monitor':
          return 'fas fa-tv';
        case 'impresora':
          return 'fas fa-print';
        default:
          return 'fas fa-microchip';
      }
    };

    const getStatusClass = (estado) => {
      switch (estado?.toLowerCase()) {
        case 'asignado':
          return 'status-assigned';
        case 'no asignado':
          return 'status-unassigned';
        case 'mantenimiento':
          return 'status-maintenance';
        default:
          return 'status-default';
      }
    };

    const formatDate = (dateString) => {
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
    };

    return {
      openAccordions,
      close,
      toggleAccordion,
      getInitials,
      getAvatarColor,
      getEquipmentIcon,
      getStatusClass,
      formatDate
    };
  }
};
</script>

<style scoped>
/* Avatar styling */
.modal-fadeo {
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

.avatar-circle {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
  color: white;
  flex-shrink: 0;
}

/* Equipment icon styling */
.equipment-icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  flex-shrink: 0;
}

.equipment-icon {
  font-size: 1.5rem;
}

.fas.fa-mobile-alt {
  color: #10b981;
  /* green */
}

.fas.fa-desktop {
  color: #3b82f6;
  /* blue */
}

.fas.fa-tv {
  color: #8b5cf6;
  /* purple */
}

.fas.fa-print {
  color: #f59e0b;
  /* amber */
}

.fas.fa-microchip {
  color: #6b7280;
  /* gray */
}

/* Status badges */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-assigned {
  background-color: #dcfce7;
  color: #166534;
}

.status-unassigned {
  background-color: #f3f4f6;
  color: #4b5563;
}

.status-maintenance {
  background-color: #fff7ed;
  color: #c2410c;
}

.status-default {
  background-color: #e0f2fe;
  color: #0369a1;
}

/* Info items in equipment cards */
.info-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.125rem;
}

.info-value {
  font-size: 0.875rem;
  color: #1f2937;
}

.info-item.col-span-2 {
  grid-column: span 2;
}

/* Accordion styling */
.accordion {
  border-radius: 0.5rem;
  overflow: hidden;
}

.accordion-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  transition: color 0.2s;
}

.accordion-button:hover {
  color: #1f2937;
}

.accordion-content {
  padding-top: 0.5rem;
  animation: slideDown 0.3s ease-out;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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
  .avatar-circle {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }

  .equipment-icon-container {
    width: 2.5rem;
    height: 2.5rem;
  }

  .equipment-icon {
    font-size: 1.25rem;
  }
}
</style>