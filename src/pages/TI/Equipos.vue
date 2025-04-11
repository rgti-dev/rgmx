<template>
  <div class="equipos-container flex w-full">
    <!-- Sidebar -->
    <Sidebar v-model:isExpanded="sidebarExpanded" />

    <!-- Contenido del Dashboard -->
    <div class="content flex-1 w-full relative transition-all duration-300"
      :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }">

      <div class="p-6">
        <!-- Header con título y botón de agregar -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Gestión de Equipos</h1>
            <p class="text-gray-600 mt-1">Administra todos los equipos de la organización</p>
          </div>
          <button @click="abrirModal('crear')"
            class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2 shadow-md">
            <i class="fas fa-plus"></i> Agregar Equipo
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
                <input type="text" v-model="busqueda" placeholder="Buscar por nombre, responsable, departamento..."
                  class="w-full pl-10 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <div class="flex gap-2">
              <select v-model="filtroTipo" class="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
                <option value="">Todos los tipos</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Móvil">Móvil</option>
                <option value="Tablet">Tablet</option>
                <option value="Otro">Otro</option>
              </select>

              <select v-model="filtroEstado" class="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
                <option value="">Todos los estados</option>
                <option value="Asignado">Asignado</option>
                <option value="No asignado">No asignado</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tabla de Equipos con columnas dinámicas -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto">
              <thead>
                <tr class="bg-gray-800 text-white">
                  <th v-for="col in columnas" :key="col.key" class="px-4 py-3 cursor-pointer text-left"
                    @click="ordenarPor(col.key)">
                    <div class="flex items-center">
                      {{ col.label }}
                      <span v-if="columnaOrden === col.key" class="ml-1">
                        <i :class="ordenAscendente ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
                      </span>
                      <i v-else class="fas fa-sort text-gray-400 ml-1"></i>
                    </div>
                  </th>
                  <th class="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="equipo in equiposFiltrados" :key="equipo.id"
                  class="border-b hover:bg-gray-50 transition-colors">
                  <td v-for="col in columnas" :key="col.key" class="px-4 py-3 text-left">
                    <template v-if="col.key === 'responsable'">
                      <div class="flex items-center">
                        <div
                          class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2">
                          {{ (equipo.responsable?.nombre || 'S/R').charAt(0) }}
                        </div>
                        <span>{{ equipo.responsable?.nombre || 'Sin Responsable' }}</span>
                      </div>
                    </template>
                    <template v-else-if="col.key === 'estado'">
                      <span :class="{
                        'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium': equipo.estado === 'Asignado',
                        'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium': equipo.estado === 'No asignado',
                        'bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium': equipo.estado === 'Mantenimiento'
                      }">
                        {{ equipo.estado }}
                      </span>
                    </template>
                    <template v-else-if="col.key === 'tipo'">
                      <div class="flex items-center">
                        <i :class="getTipoIcon(equipo.tipo)" class="mr-2"></i>
                        {{ equipo[col.key] }}
                      </div>
                    </template>
                    <template v-else>
                      {{ equipo[col.key] }}
                    </template>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex space-x-2 justify-center">
                      <button @click="abrirModal('editar', equipo)" title="Editar"
                        class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="generatePDF(equipo)" title="Generar responsiva"
                        class="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-300">
                        <i class="fas fa-file-pdf"></i>
                      </button>
                      <button @click="verDetalles(equipo)" title="Ver detalles"
                        class="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-300">
                        <i class="fas fa-info-circle"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="equiposFiltrados.length === 0">
                  <td :colspan="columnas.length + 1" class="px-4 py-8 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                      <i class="fas fa-search text-4xl mb-2"></i>
                      <p>No se encontraron equipos que coincidan con tu búsqueda</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div class="flex justify-between items-center p-4 bg-gray-50 border-t">
            <div class="text-gray-600">
              Mostrando {{ equiposFiltrados.length }} de {{ equiposFiltradosSinPaginacion.length }} equipos
            </div>
            <div class="flex items-center space-x-2">
              <button @click="paginaActual = 1" :disabled="paginaActual === 1"
                class="bg-gray-200 p-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition">
                <i class="fas fa-angle-double-left"></i>
              </button>
              <button @click="paginaActual--" :disabled="paginaActual === 1"
                class="bg-gray-200 p-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition">
                <i class="fas fa-angle-left"></i>
              </button>

              <span class="text-gray-700 px-4">Página {{ paginaActual }} de {{ totalPaginas }}</span>

              <button @click="paginaActual++" :disabled="paginaActual === totalPaginas"
                class="bg-gray-200 p-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition">
                <i class="fas fa-angle-right"></i>
              </button>
              <button @click="paginaActual = totalPaginas" :disabled="paginaActual === totalPaginas"
                class="bg-gray-200 p-2 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition">
                <i class="fas fa-angle-double-right"></i>
              </button>

              <select v-model="equiposPorPagina" class="ml-4 p-2 border rounded-lg">
                <option :value="10">10 por página</option>
                <option :value="25">25 por página</option>
                <option :value="50">50 por página</option>
                <option :value="100">100 por página</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Equipo -->
    <ModalEquipo v-if="mostrarModal" :visible="mostrarModal" :modo="modo" :equipo="equipoActual" @close="cerrarModal"
      @submit="handleModalDataSubmit" />

    <!-- Modal de Detalles -->
    <ModalDetallesEquipo v-if="mostrarDetalles" :visible="mostrarDetalles" :equipo="equipoDetalle"
      @close="cerrarDetalles" />

    <!-- Modal de PDF -->
    <ModalPDF v-if="mostrarPDF" :visible="mostrarPDF" :pdfUrl="pdfUrl" @close="cerrarPDF" />
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import ModalEquipo from "@/components/ModalEquipo.vue";
import ModalDetallesEquipo from "@/components/ModalDetallesEquipo.vue";
import ModalPDF from "@/components/ModalPDF.vue"; // <-- Agregado
import { getEquipos, createEquipo, updateEquipo } from "@/api/equipos.js";
import { generatePDF } from "@/components/PdfGenerator.js";
import { useToast } from "vue-toastification";

export default {
  components: {
    Sidebar,
    ModalEquipo,
    ModalDetallesEquipo,
    ModalPDF // <-- Agregado
  },
  data() {
    return {
      sidebarExpanded: false,
      equipos: [],
      busqueda: "",
      filtroTipo: "",
      filtroEstado: "",
      paginaActual: 1,
      equiposPorPagina: 10,
      mostrarModal: false,
      mostrarDetalles: false,
      mostrarPDF: false,       // <-- Agregado
      pdfUrl: "",              // <-- Agregado
      modo: "crear",
      equipoActual: {
        nombre: "",
        tipo: "",
        marca: "",
        modelo: "",
        serie: "",
        procesador: "",
        ram: "",
        almacenamiento: "",
        sistemaOperativo: "",
        ipAsignada: "",
        macAddress: "",
        ubicacion: "",
        estado: "",
        fechaCompra: "",
        numeroFactura: "",
        proveedor: "",
        garantia: "",
        finGarantia: "",
        responsableId: "",
        notas: "",
        precio: "",
        departamento: "",
        puesto: "",
        numeroAsignado: "",
        IMEI: "",
        PATH: null,
      },
      equipoDetalle: null,
      columnas: [
        { key: "id", label: "ID" },
        { key: "nombre", label: "Nombre" },
        { key: "tipo", label: "Tipo" },
        { key: "marca", label: "Marca" },
        { key: "modelo", label: "Modelo" },
        { key: "responsable", label: "Responsable" },
        { key: "departamento", label: "Departamento" },
        { key: "estado", label: "Estado" },
      ],
      columnaOrden: "id",
      ordenAscendente: true,
    };
  },
  computed: {
    equiposFiltradosSinPaginacion() {
      return this.equipos.filter((e) => {
        const matchBusqueda =
          e.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          (e.responsable?.nombre || "").toLowerCase().includes(this.busqueda.toLowerCase()) ||
          (e.departamento || "").toLowerCase().includes(this.busqueda.toLowerCase()) ||
          (e.marca || "").toLowerCase().includes(this.busqueda.toLowerCase()) ||
          (e.modelo || "").toLowerCase().includes(this.busqueda.toLowerCase());

        const matchTipo = this.filtroTipo ? e.tipo === this.filtroTipo : true;
        const matchEstado = this.filtroEstado ? e.estado === this.filtroEstado : true;

        return matchBusqueda && matchTipo && matchEstado;
      }).sort((a, b) => {
        let aVal, bVal;
        if (this.columnaOrden === "responsable") {
          aVal = (a.responsable?.nombre || "").toLowerCase();
          bVal = (b.responsable?.nombre || "").toLowerCase();
        } else {
          aVal = (a[this.columnaOrden] || "").toString().toLowerCase();
          bVal = (b[this.columnaOrden] || "").toString().toLowerCase();
        }
        return this.ordenAscendente ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    },
    equiposFiltrados() {
      const inicio = (this.paginaActual - 1) * this.equiposPorPagina;
      return this.equiposFiltradosSinPaginacion.slice(inicio, inicio + this.equiposPorPagina);
    },
    totalPaginas() {
      return Math.max(1, Math.ceil(this.equiposFiltradosSinPaginacion.length / this.equiposPorPagina));
    },
  },
  watch: {
    filtroTipo() {
      this.paginaActual = 1;
    },
    filtroEstado() {
      this.paginaActual = 1;
    },
    busqueda() {
      this.paginaActual = 1;
    },
    equiposPorPagina() {
      this.paginaActual = 1;
    }
  },
  async created() {
    try {
      this.equipos = await getEquipos();
      console.log("Equipos cargados:", this.equipos);
    } catch (error) {
      console.error("Error al obtener los equipos:", error);
    }
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    getTipoIcon(tipo) {
      // Normalize the input to lowercase for case-insensitive comparison
      const tipoLower = tipo ? tipo.toLowerCase() : '';

      const iconMap = {
        'laptop': 'fas fa-laptop',
        'equipo': 'fas fa-desktop',
        'escritorio': 'fas fa-desktop', // Added Spanish equivalent
        'móvil': 'fas fa-mobile-alt',
        'movil': 'fas fa-mobile-alt', // Added version without accent
        'celular': 'fas fa-mobile-alt', // Added another common term
        'tablet': 'fas fa-tablet-alt',
        'impresora': 'fas fa-print',
        'servidor': 'fas fa-server',
        'monitor': 'fas fa-tv',
        'otro': 'fas fa-microchip'
      };

      return iconMap[tipoLower] || 'fas fa-microchip';
    },
    abrirModal(modo, equipo = null) {
      this.modo = modo;
      if (modo === "editar" && equipo) {
        console.log("Abriendo modal en modo editar para el equipo:", equipo);
        // Asegúrate de copiar el id
        this.equipoActual = { ...equipo };
        if (this.equipoActual.fechaCompra) {
          this.equipoActual.fechaCompra = this.equipoActual.fechaCompra.split("T")[0];
        }
        if (this.equipoActual.finGarantia) {
          this.equipoActual.finGarantia = this.equipoActual.finGarantia.split("T")[0];
        }
      } else {
        // Crear: establecer objeto vacío
        this.equipoActual = {
          nombre: "", tipo: "", marca: "", modelo: "", serie: "",
          procesador: "", ram: "", almacenamiento: "", sistemaOperativo: "",
          ipAsignada: "", macAddress: "", ubicacion: "", estado: "",
          fechaCompra: "", numeroFactura: "", proveedor: "", garantia: "",
          finGarantia: "", responsableId: "", notas: "", precio: "",
          departamento: "", puesto: "", numeroAsignado: "", IMEI: "", PATH: null,
        };
      }
      this.mostrarModal = true;
    },
    cerrarModal() {
      console.log("Cerrando modal");
      this.mostrarModal = false;
    },
    verDetalles(equipo) {
      this.equipoDetalle = { ...equipo };
      this.mostrarDetalles = true;
    },
    cerrarDetalles() {
      this.mostrarDetalles = false;
      this.equipoDetalle = null;
    },
    validateEquipoData(equipo) {
      const errors = [];
      if (!equipo.nombre) errors.push('El nombre es obligatorio.');
      if (!equipo.tipo) errors.push('El tipo es obligatorio.');
      return {
        valid: errors.length === 0,
        errors,
      };
    },
    handleModalDataSubmit(updatedEquipo) {
      this.equipoActual = updatedEquipo;
      console.log("Datos recibidos del modal:", this.equipoActual);

      const validation = this.validateEquipoData(this.equipoActual);
      if (!validation.valid) {
        console.error("Errores de validación:", validation.errors);
        this.toast.error(`Errores: ${validation.errors.join(', ')}`);
        return;
      }

      if (this.modo === "crear" || !this.equipoActual.id) {
        console.log("Creando nuevo equipo con los siguientes datos:", this.equipoActual);
        this.guardarEquipo();
      } else {
        console.log("Actualizando equipo (ID:", this.equipoActual.id, ") con los siguientes datos:", this.equipoActual);
        this.actualizarEquipo();
      }
    },
    async guardarEquipo() {
      try {
        const nuevoEquipo = await createEquipo(this.equipoActual);
        console.log("Equipo creado exitosamente:", nuevoEquipo);
        this.equipos = await getEquipos();
        this.cerrarModal();
        this.toast.success('Equipo creado exitosamente');
      } catch (error) {
        console.error("Error al guardar el equipo:", error);
        this.toast.error('Error al crear el equipo');
      }
    },
    async actualizarEquipo() {
      try {
        if (!this.equipoActual.id) {
          console.error("No se encontró el ID del equipo a actualizar");
          return;
        }
        const equipoActualizado = await updateEquipo(this.equipoActual.id, this.equipoActual);
        console.log("Equipo actualizado exitosamente:", equipoActualizado);
        this.equipos = await getEquipos();
        this.cerrarModal();
        this.toast.success('Equipo actualizado exitosamente');
      } catch (error) {
        console.error("Error al actualizar el equipo:", error);
        this.toast.error('Error al actualizar el equipo');
      }
    },
    async generatePDF(equipo) {
      try {
        // Usamos await para esperar a que se genere el PDF
        const pdfDataUrl = await generatePDF(equipo, true);
        console.log("PDF Data URL generada correctamente");
        this.pdfUrl = pdfDataUrl;
        this.mostrarPDF = true;
        this.toast.success('Responsiva generada exitosamente');
      } catch (error) {
        console.error("Error al generar PDF:", error);
        this.toast.error('Error al generar la responsiva');
      }
    },
    cerrarPDF() {  // <-- Nuevo método para cerrar el modal del PDF
      this.mostrarPDF = false;
      this.pdfUrl = "";
    },
    exportarDatos(formato) {
      console.log(`Exportando datos en formato ${formato}`);
      this.$toast.info(`Exportación en ${formato} iniciada`);
    }
  },
};
</script>

<style scoped>
.equipos-container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

.content {
  transition: all 0.3s ease;
  padding: 0;
  flex: 1;
}

/* Animaciones para la tabla */
.table-row-enter-active,
.table-row-leave-active {
  transition: all 0.3s;
}

.table-row-enter-from,
.table-row-leave-to {
  opacity: 0;
  transform: translateX(-30px);
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

/* Estilos para hover en botones de acción */
button {
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

button:hover::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }

  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

/* Estilos para estados de equipos */
.estado-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Estilos para responsive */
@media (max-width: 768px) {
  .content {
    margin-left: 0 !important;
  }

  .flex-wrap {
    flex-direction: column;
  }

  .flex-wrap>div {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
