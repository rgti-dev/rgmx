<template>
  <div v-if="visible" class="modal-fadeo">
    <div class="modal-content bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="modal-header bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 class="text-xl font-bold flex items-center">
          <i :class="getTipoIcon(equipo.tipo)" class="mr-2"></i>
          Detalles del Equipo: {{ equipo.nombre }}
        </h2>
        <button @click="$emit('close')" class="text-white hover:text-gray-300 transition">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- Información básica -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Columna 1: Información general -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Información General</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">ID:</span>
                <span class="font-medium">{{ equipo.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Nombre:</span>
                <span class="font-medium">{{ equipo.nombre }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tipo:</span>
                <span class="font-medium">{{ equipo.tipo }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Estado:</span>
                <span :class="{
                  'text-green-600 font-medium': equipo.estado === 'Asignado',
                  'text-red-600 font-medium': equipo.estado === 'No asignado',
                  'text-orange-600 font-medium': equipo.estado === 'Mantenimiento'
                }">{{ equipo.estado }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Departamento:</span>
                <span class="font-medium">{{ equipo.departamento || 'No asignado' }}</span>
              </div>
            </div>
          </div>

          <!-- Columna 2: Especificaciones técnicas -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Especificaciones</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Marca:</span>
                <span class="font-medium">{{ equipo.marca || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Modelo:</span>
                <span class="font-medium">{{ equipo.modelo || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Serie:</span>
                <span class="font-medium">{{ equipo.serie || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Procesador:</span>
                <span class="font-medium">{{ equipo.procesador || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">RAM:</span>
                <span class="font-medium">{{ equipo.ram || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Almacenamiento:</span>
                <span class="font-medium">{{ equipo.almacenamiento || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Sistema Operativo:</span>
                <span class="font-medium">{{ equipo.sistemaOperativo || 'No especificado' }}</span>
              </div>
            </div>
          </div>

          <!-- Columna 3: Información de asignación -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Asignación</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Responsable:</span>
                <span class="font-medium">{{ equipo.responsable?.nombre || 'Sin asignar' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Puesto:</span>
                <span class="font-medium">{{ equipo.puesto || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Ubicación:</span>
                <span class="font-medium">{{ equipo.ubicacion || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">IP Asignada:</span>
                <span class="font-medium">{{ equipo.ipAsignada || 'No asignada' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">MAC Address:</span>
                <span class="font-medium">{{ equipo.macAddress || 'No especificado' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Información de compra -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Información de Compra</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Fecha de Compra:</span>
                <span class="font-medium">{{ formatDate(equipo.fechaCompra) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Número de Factura:</span>
                <span class="font-medium">{{ equipo.numeroFactura || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Proveedor:</span>
                <span class="font-medium">{{ equipo.proveedor || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Precio:</span>
                <span class="font-medium">{{ formatCurrency(equipo.precio) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Garantía:</span>
                <span class="font-medium">{{ equipo.garantia || 'No especificado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Fin de Garantía:</span>
                <span class="font-medium">{{ formatDate(equipo.finGarantia) }}</span>
              </div>
            </div>
          </div>

          <!-- Información específica por tipo -->
          <div v-if="equipo.tipo === 'Móvil'" class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Información del Dispositivo Móvil</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Número Asignado:</span>
                <span class="font-medium">{{ equipo.numeroAsignado || 'No asignado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">IMEI:</span>
                <span class="font-medium">{{ equipo.IMEI || 'No especificado' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notas -->
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Notas</h3>
          <p class="text-gray-700 whitespace-pre-line">{{ equipo.notas || 'No hay notas disponibles para este equipo.' }}</p>
        </div>

        <!-- Historial (placeholder para futura implementación) -->
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 flex items-center">
            <i class="fas fa-history mr-2"></i> Historial
          </h3>
          <p class="text-gray-500 italic">El historial de este equipo estará disponible próximamente.</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer bg-gray-100 p-4 flex justify-between">
        <div class="hidden">
          <button @click="generatePDF(equipo)" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
            <i class="fas fa-file-pdf mr-2"></i> Generar Responsiva
          </button>
        </div>
        <div>
          <button @click="$emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition mr-2">
            Cerrar
          </button>
          <button @click="editarEquipo" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <i class="fas fa-edit mr-2"></i> Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generatePDF } from "@/components/PdfGenerator.js";
import { useToast } from "vue-toastification";

export default {
  name: "ModalDetallesEquipo",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    equipo: {
      type: Object,
      required: true
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    getTipoIcon(tipo) {
      const iconMap = {
        'Laptop': 'fas fa-laptop',
        'Desktop': 'fas fa-desktop',
        'Móvil': 'fas fa-mobile-alt',
        'Tablet': 'fas fa-tablet-alt',
        'Impresora': 'fas fa-print',
        'Servidor': 'fas fa-server',
        'Monitor': 'fas fa-tv',
        'Otro': 'fas fa-microchip'
      };
      return iconMap[tipo] || 'fas fa-microchip';
    },
    formatDate(dateString) {
      if (!dateString) return 'No especificado';
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(date);
      } catch (error) {
        console.error("Error al formatear fecha:", error);
        return dateString;
      }
    },
    formatCurrency(value) {
      if (!value) return 'No especificado';
      try {
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN'
        }).format(value);
      } catch (error) {
        console.error("Error al formatear moneda:", error);
        return value;
      }
    },
    generatePDF(equipo) {
      try {
        generatePDF(equipo);
        this.toast.success('Responsiva generada exitosamente');
      } catch (error) {
        console.error("Error al generar PDF:", error);
        this.toast.error('Error al generar la responsiva');
      }
    },
    editarEquipo() {
      this.$emit('close');
      this.$parent.abrirModal('editar', this.equipo);
    }
  }
};
</script>

<style scoped>
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

.modal-content {
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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
</style>