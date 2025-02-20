<template>
  <div class="equipos-container flex w-full">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenido del Dashboard -->
    <div class="content ml-0 w-full">
      <!-- Navbar -->
      <Navbar />

      <div class="p-8 mt-10">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-3xl font-bold text-gray-800">Gestión de Equipos</h1>
          <button @click="abrirModal('crear')"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
            + Agregar Equipo
          </button>
        </div>

        <!-- Barra de búsqueda -->
        <input type="text" v-model="busqueda" placeholder="Buscar equipo..."
          class="w-full p-2 mb-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" />

        <!-- Tabla de Equipos con columnas dinámicas -->
        <div class="overflow-x-auto rounded-lg shadow-lg">
          <table class="min-w-full table-auto rounded-lg">
            <thead>
              <tr class="bg-gray-700 text-white">
                <th v-for="col in columnas" :key="col.key" class="px-4 py-2 cursor-pointer"
                  @click="ordenarPor(col.key)">
                  {{ col.label }}
                  <span v-if="columnaOrden === col.key">
                    <span v-if="ordenAscendente">🔼</span>
                    <span v-else>🔽</span>
                  </span>
                </th>
                <th class="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="equipo in equiposFiltrados" :key="equipo.id" class="border hover:bg-gray-100 transition">
                <td v-for="col in columnas" :key="col.key" class="px-4 py-2">
                  <template v-if="col.key === 'responsable'">
                    {{ equipo.responsable?.nombre || 'Sin Responsable' }}
                  </template>
                  <template v-else-if="col.key === 'estado'">
                    <span :class="{
                      'bg-green-500 text-white px-2 py-1 rounded-lg': equipo.estado === 'Asignado',
                      'bg-red-500 text-white px-2 py-1 rounded-lg': equipo.estado === 'No asignado',
                      'bg-orange-500 text-white px-2 py-1 rounded-lg': equipo.estado === 'Mantenimiento'
                    }">
                      {{ equipo.estado }}
                    </span>
                  </template>
                  <template v-else>
                    {{ equipo[col.key] }}
                  </template>
                </td>
                <td class="px-4 py-2 flex space-x-2 justify-center">
                  <button @click="abrirModal('editar', equipo)"
                    class="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition duration-300">
                    Editar
                  </button>
                  <button @click="generatePDF(equipo)"
                    class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300">
                    Responsiva
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="flex justify-between items-center mt-4">
          <button @click="paginaActual--" :disabled="paginaActual === 1"
            class="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition">
            Anterior
          </button>
          <span class="text-gray-700">Página {{ paginaActual }} de {{ totalPaginas }}</span>
          <button @click="paginaActual++" :disabled="paginaActual === totalPaginas"
            class="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition">
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Modal (con Stepper y selección de tipo) -->
    <div v-if="mostrarModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
      <div
        class="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 max-h-full overflow-y-auto transform transition-all duration-300">
        <!-- Encabezado del modal con botón de cierre -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            {{ modo === 'crear' ? 'Agregar Equipo' : 'Editar Equipo' }}
          </h2>
          <button @click="cerrarModal"
            class="text-gray-600 hover:text-red-500 transition text-3xl leading-none">&times;</button>
        </div>

        <!-- Selección de tipo para creación -->
        <div v-if="modo === 'crear' && mostrarSeleccionTipo">
          <h3 class="text-xl font-semibold mb-4 text-center">Seleccione el tipo de equipo</h3>
          <div class="flex justify-around">
            <div @click="seleccionarTipo('Equipo')"
              class="cursor-pointer rounded-lg px-14 py-4 hover:bg-gray-200 hover:shadow-2xl transition text-center">
              <i class="fas fa-desktop text-6xl text-blue-600 mb-2"></i>
              <div class="text-xl font-bold">Equipo</div>
            </div>
            <div @click="seleccionarTipo('Celular')"
              class="cursor-pointer rounded-lg px-14 py-4 hover:bg-gray-200 hover:shadow-2xl transition text-center">
              <i class="fas fa-mobile-alt text-6xl text-green-600 mb-2"></i>
              <div class="text-xl font-bold">Celular</div>
            </div>
            <div @click="seleccionarTipo('Monitor')"
              class="cursor-pointer rounded-lg px-14 py-4 hover:bg-gray-200 hover:shadow-2xl transition text-center">
              <i class="fas fa-tv text-6xl text-purple-600 mb-2"></i>
              <div class="text-xl font-bold">Monitor</div>
            </div>
          </div>
        </div>

        <!-- Formulario completo (pasos) -->
        <div v-else>
          <!-- Stepper -->
          <div class="flex justify-between items-center mb-6">
            <div v-for="step in totalSteps" :key="step" class="flex-1 flex flex-col items-center">
              <div :class="{
                'bg-green-500': step < currentStep,
                'bg-blue-600': step === currentStep,
                'bg-gray-300': step > currentStep
              }" class="w-10 h-10 rounded-full flex items-center justify-center mb-1">
                <span class="text-white text-lg">
                  <template v-if="step === 1">
                    <i class="fas fa-desktop"></i>
                  </template>
                  <template v-else-if="step === 2">
                    <i class="fas fa-file-alt"></i>
                  </template>
                  <template v-else-if="step === 3">
                    <i class="fas fa-user"></i>
                  </template>
                </span>
              </div>
              <div class="text-sm" :class="{
                'text-blue-600 font-bold': step === currentStep,
                'text-gray-600': step !== currentStep
              }">
                {{ stepTitle(step) }}
              </div>
            </div>
          </div>

          <!-- Formulario por pasos -->
          <form @submit.prevent="currentStep === totalSteps ? submitForm() : nextStep()">
            <!-- Paso 1: Datos de Equipo -->
            <div v-if="currentStep === 1">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block font-semibold">Nombre:</label>
                  <input v-model="equipoActual.nombre" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label class="block font-semibold">Tipo:</label>
                  <input v-model="equipoActual.tipo" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required
                    :disabled="modo === 'crear'" />
                </div>
                <div>
                  <label class="block font-semibold">Marca:</label>
                  <input v-model="equipoActual.marca" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Modelo:</label>
                  <input v-model="equipoActual.modelo" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Serie:</label>
                  <input v-model="equipoActual.serie" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div v-if="equipoActual.tipo === 'Celular' || equipoActual.tipo === 'Equipo'">
                  <label class="block font-semibold">Procesador:</label>
                  <input v-model="equipoActual.procesador" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div v-if="equipoActual.tipo === 'Celular' || equipoActual.tipo === 'Equipo'">
                  <label class="block font-semibold">Ram:</label>
                  <input v-model="equipoActual.ram" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div v-if="equipoActual.tipo === 'Celular' || equipoActual.tipo === 'Equipo'">
                  <label class="block font-semibold">Almacenamiento:</label>
                  <input v-model="equipoActual.almacenamiento" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div v-if="equipoActual.tipo === 'Celular' || equipoActual.tipo === 'Equipo'">
                  <label class="block font-semibold">Sistema Operativo:</label>
                  <input v-model="equipoActual.sistemaOperativo" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div v-if="equipoActual.tipo === 'Celular' || equipoActual.tipo === 'Equipo'">
                  <label class="block font-semibold">Ip Asignada:</label>
                  <input v-model="equipoActual.ipAsignada" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div v-if="equipoActual.tipo === 'Celular' || equipoActual.tipo === 'Equipo'">
                  <label class="block font-semibold">Mac Address:</label>
                  <input v-model="equipoActual.macAddress" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div v-if="equipoActual.tipo === 'Celular'">
                  <label class="block font-semibold">Número Asignado:</label>
                  <input v-model="equipoActual.numeroAsignado" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div v-if="equipoActual.tipo === 'Celular'">
                  <label class="block font-semibold">IMEI:</label>
                  <input v-model="equipoActual.IMEI" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <!-- Paso 2: Datos de Facturación -->
            <div v-if="currentStep === 2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block font-semibold">Número Factura:</label>
                  <input v-model="equipoActual.numeroFactura" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Proveedor:</label>
                  <input v-model="equipoActual.proveedor" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Garantía:</label>
                  <input v-model="equipoActual.garantia" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Fin Garantía:</label>
                  <input v-model="equipoActual.finGarantia" type="date"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Fecha Compra:</label>
                  <input v-model="equipoActual.fechaCompra" type="date"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Precio:</label>
                  <input v-model="equipoActual.precio" type="number" step="0.01"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <!-- Paso 3: Personal Asignado -->
            <div v-if="currentStep === 3">
              <div class="grid grid-cols-2 gap-8 mb-4">
                <div>
                  <label class="block font-semibold">Departamento:</label>
                  <input v-model="equipoActual.departamento" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Puesto:</label>
                  <input v-model="equipoActual.puesto" type="text"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Responsable ID:</label>
                  <input v-model="equipoActual.responsableId" type="number"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block font-semibold">Estado:</label>
                  <select v-model="equipoActual.estado"
                    class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                    <option value="No asignado">No asignado</option>
                    <option value="Asignado">Asignado</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>
              </div>
              <div class="mb-4">
                <label class="block font-semibold">Notas:</label>
                <textarea v-model="equipoActual.notas"
                  class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
              </div>
              <!-- CardView de Drag and Drop para cargar Responsiva (solo en modo editar) -->
              <div v-if="modo === 'editar'" class="mt-4">
                <!-- Responsiva: Descarga o carga de PDF (solo en modo editar) -->
                <div v-if="modo === 'editar'" class="mt-4">
                  <label class="block font-semibold mb-1">Responsiva (PDF):</label>
                  <span class="text-gray-800">
                    Archivo: {{ equipoActual.PATH }}
                  </span>
                  <!-- Si ya se cuenta con un archivo asignado, se muestra el botón para descargar -->
                  <div v-if="equipoActual.PATH">
                    <button @click="descargarResponsiva"
                      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                      Descargar Responsiva
                    </button>
                  </div>
                  <!-- Si no existe el archivo, se muestra la funcionalidad drag and drop -->
                  <div v-else class="border border-dashed border-gray-400 p-4 text-center cursor-pointer"
                    @dragover.prevent="onDragOver" @drop.prevent="onDrop" @click="triggerFileInput">
                    Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionar.
                  </div>
                  <input type="file" ref="fileInput" style="display: none" accept="application/pdf"
                    @change="handleFileUpload" />
                </div>

              </div>
            </div>

            <!-- Navegación de pasos -->
            <div class="flex flex-col mt-4 space-y-2">
              <div class="flex justify-between">
                <button type="button" @click="prevStep()" :disabled="currentStep === 1"
                  class="bg-gray-300 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition">
                  Anterior
                </button>
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  {{ currentStep === totalSteps ? (modo === 'crear' ? 'Guardar' : 'Actualizar') : 'Siguiente' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import { getEquipos, createEquipo, updateEquipo } from "@/api/equipos.js";
import { generatePDF } from "@/components/PdfGenerator.js";

export default {
  components: {
    Navbar,
    Sidebar,
  },
  data() {
    return {
      equipos: [],
      busqueda: "",
      paginaActual: 1,
      equiposPorPagina: 10,
      mostrarModal: false,
      modo: "crear",
      // Flag para mostrar la selección de tipo al crear
      mostrarSeleccionTipo: false,
      // Objeto con todos los campos para un equipo
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
      // Para el stepper
      currentStep: 1,
      totalSteps: 3,
      // Definición de columnas dinámicas
      columnas: [
        { key: "id", label: "ID" },
        { key: "nombre", label: "Nombre" },
        { key: "tipo", label: "Tipo" },
        { key: "responsable", label: "Responsable" },
        { key: "departamento", label: "Departamento" },
        { key: "estado", label: "Estado" },
      ],
      // Para el ordenamiento de columnas
      columnaOrden: "id",
      ordenAscendente: true,
    };
  },
  computed: {
    equiposFiltrados() {
      const filtered = this.equipos.filter((e) =>
        e.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        (e.responsable?.nombre || "").toLowerCase().includes(this.busqueda.toLowerCase())
      );
      const sorted = filtered.sort((a, b) => {
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
      const inicio = (this.paginaActual - 1) * this.equiposPorPagina;
      return sorted.slice(inicio, inicio + this.equiposPorPagina);
    },
    totalPaginas() {
      return Math.ceil(this.equipos.length / this.equiposPorPagina);
    },
  },
  async created() {
    try {
      this.equipos = await getEquipos();
      console.log("Equipos cargados:", this.equipos);
    } catch (error) {
      console.error("Error al obtener los equipos:", error);
    }
  },
  methods: {
    stepTitle(step) {
      switch (step) {
        case 1:
          return "Equipo";
        case 2:
          return "Facturación";
        case 3:
          return "Personal";
        default:
          return "";
      }
    },
    abrirModal(modo, equipo = null) {
      this.modo = modo;
      this.currentStep = 1;
      if (modo === "editar" && equipo) {
        console.log("Abriendo modal en modo editar para el equipo:", equipo);
        this.equipoActual = { ...equipo };
        if (this.equipoActual.fechaCompra) {
          this.equipoActual.fechaCompra = this.equipoActual.fechaCompra.split("T")[0];
        }
        if (this.equipoActual.finGarantia) {
          this.equipoActual.finGarantia = this.equipoActual.finGarantia.split("T")[0];
        }
        this.mostrarSeleccionTipo = false;
      } else {
        console.log("Abriendo modal en modo crear");
        this.equipoActual = {
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
        };
        this.mostrarSeleccionTipo = true;
      }
      this.mostrarModal = true;
    },
    cerrarModal() {
      console.log("Cerrando modal");
      this.mostrarModal = false;
    },
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    validateForm() {
      if (!this.equipoActual.nombre || this.equipoActual.nombre.trim() === "") {
        alert("El nombre es obligatorio.");
        console.error("Validación fallida: nombre vacío");
        return false;
      }
      if (!this.equipoActual.tipo || this.equipoActual.tipo.trim() === "") {
        alert("El tipo es obligatorio.");
        console.error("Validación fallida: tipo vacío");
        return false;
      }
      if (!this.equipoActual.estado || this.equipoActual.estado.trim() === "") {
        alert("El estado es obligatorio.");
        console.error("Validación fallida: estado vacío");
        return false;
      }
      if (this.equipoActual.precio && isNaN(parseFloat(this.equipoActual.precio))) {
        alert("El precio debe ser un número válido.");
        console.error("Validación fallida: precio no es un número válido");
        return false;
      }
      return true;
    },
    async submitForm() {
      if (!this.validateForm()) {
        console.error("El formulario no pasó la validación");
        return;
      }
      const confirmMessage = this.modo === "crear"
        ? "¿Estás seguro de que deseas crear este equipo?"
        : "¿Estás seguro de que deseas actualizar este equipo?";
      if (window.confirm(confirmMessage)) {
        console.log("Confirmación recibida. Procediendo en modo:", this.modo);
        if (this.modo === "crear") {
          await this.guardarEquipo();
        } else {
          await this.actualizarEquipo();
        }
      } else {
        console.log("Operación cancelada por el usuario");
      }
    },
    async guardarEquipo() {
      try {
        console.log("Intentando crear un nuevo equipo con los datos:", this.equipoActual);
        const nuevoEquipo = await createEquipo(this.equipoActual);
        console.log("Equipo creado con éxito:", nuevoEquipo);
        this.equipos.push(nuevoEquipo);
        this.cerrarModal();
      } catch (error) {
        console.error("Error al guardar el equipo:", error);
      }
    },
    async actualizarEquipo() {
      try {
        if (!this.equipoActual.id) {
          console.error("No se encontró el ID del equipo a actualizar");
          return;
        }
        console.log("Intentando actualizar el equipo con ID:", this.equipoActual.id);
        const equipoActualizado = await updateEquipo(this.equipoActual.id, this.equipoActual);
        console.log("Respuesta de actualización:", equipoActualizado);
        const index = this.equipos.findIndex(e => e.id === equipoActualizado.id);
        if (index !== -1) {
          this.equipos.splice(index, 1, equipoActualizado);
        } else {
          console.warn("No se encontró el equipo en la lista local");
        }
        this.cerrarModal();
      } catch (error) {
        console.error("Error al actualizar el equipo:", error);
      }
    },
    ordenarPor(key) {
      if (this.columnaOrden === key) {
        this.ordenAscendente = !this.ordenAscendente;
      } else {
        this.columnaOrden = key;
        this.ordenAscendente = true;
      }
    },
    seleccionarTipo(tipo) {
      this.equipoActual.tipo = tipo;
      this.mostrarSeleccionTipo = false;
    },
    generatePDF(equipo) {
      generatePDF(equipo);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.handleFile(file);
    },
    handleFile(file) {
      if (!file) return;
      if (file.type !== "application/pdf") {
        alert("Solo se permiten archivos PDF");
        console.error("Archivo inválido: Se esperaba PDF");
        return;
      }
      console.log("Archivo PDF asignado:", file);
      this.equipoActual.PATH = file;
    },
    onDragOver(event) {
      event.preventDefault();
    },
    onDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    },
    descargarResponsiva() {
      if (this.equipoActual.PATH) {
        let url;
        // Si PATH es una cadena (por ejemplo, una URL proveniente del servidor)
        if (typeof this.equipoActual.PATH === 'string') {
          url = this.equipoActual.PATH;
        } else {
          // Si es un objeto File, se crea un URL temporal para su descarga
          url = URL.createObjectURL(this.equipoActual.PATH);
        }
        window.open(url, '_blank');
      }
    }
    ,
  },
};
</script>

<style scoped>
.equipos-container {
  display: flex;
  min-height: 100vh;
}

.content {
  padding: 20px;
  margin-left: 5rem;
  flex: 1;
}

/* Diseño de tabla */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

th,
td {
  border: 1px solid #e1e1e1;
  text-align: center;
  padding: 12px;
  font-size: 14px;
}

th {
  background-color: #4a5568;
  color: white;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f7fafc;
}

tr:hover {
  background-color: #e2e8f0;
  transition: background-color 0.3s;
}

/* Estilos para la vista de selección de tipo */
.card-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-selection .card {
  cursor: pointer;
  padding: 1rem;
  text-align: center;
  transition: background-color 0.3s;
}

.card-selection .card:hover {
  background-color: #f7fafc;
}
</style>
