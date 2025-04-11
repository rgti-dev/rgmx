<template>
  <div class="dashboard-container flex w-full">
    <!-- Sidebar con binding para isExpanded -->
    <Sidebar v-model:isExpanded="sidebarExpanded" />

    <!-- Contenido que se desplaza según el estado del Sidebar -->
    <div
      class="content flex-1 w-full relative transition-all duration-300"
      :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }"
    >
      <!-- Navbar eliminado -->

      <!-- Contenido principal con mejor aprovechamiento del espacio -->
      <div class="p-4 md:p-8">
        <!-- Header con acciones principales -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 class="text-3xl font-bold text-gray-800">Datos de OT Proyectos</h1>
          
          <div class="mt-4 md:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div class="relative w-full sm:w-auto">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar proyecto..." 
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @keyup.enter="searchProjects"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm">
                <span class="text-sm text-gray-600">Vista:</span>
                <button 
                  @click="viewType = 'tabla'" 
                  class="p-1.5 rounded-md transition-colors"
                  :class="viewType === 'tabla' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                  </svg>
                </button>
                <button 
                  @click="viewType = 'lista'" 
                  class="p-1.5 rounded-md transition-colors"
                  :class="viewType === 'lista' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <button 
                @click="loadProyectos" 
                class="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Actualizar datos"
              >
                <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Contador de resultados -->
        <div class="mb-4 text-sm text-gray-600">
          Mostrando {{ filteredProjects.length }} proyectos
          <span v-if="searchQuery"> para la búsqueda "{{ searchQuery }}"</span>
        </div>

        <!-- Espacio para la tabla o lista con animaciones -->
        <transition name="fade" mode="out-in">
          <!-- Tabla Mejorada -->
          <div v-if="viewType === 'tabla'" class="bg-white rounded-xl shadow-md overflow-hidden" key="tabla">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Proyecto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="proyecto in filteredProjects" 
                    :key="proyecto.id" 
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ proyecto.codigoProyecto }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ proyecto.nombreProyecto }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(proyecto.createdAt) }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {{ proyecto.descripcion || 'Sin descripción' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        @click="selectProject(proyecto)" 
                        class="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                  <!-- Mensaje cuando no hay resultados -->
                  <tr v-if="filteredProjects.length === 0">
                    <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                      No se encontraron proyectos que coincidan con la búsqueda.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Vista de lista mejorada -->
          <div v-else key="lista" class="space-y-4">
            <div 
              v-for="proyecto in filteredProjects" 
              :key="proyecto.id" 
              class="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              @click="selectProject(proyecto)"
            >
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">{{ proyecto.nombreProyecto }}</h3>
                  <div class="mt-1 flex items-center space-x-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ proyecto.codigoProyecto }}
                    </span>
                    <span class="text-sm text-gray-500">{{ formatDate(proyecto.createdAt) }}</span>
                  </div>
                </div>
                <div class="mt-3 md:mt-0 flex items-center">
                  <button 
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver detalles
                    <svg class="ml-1.5 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-600 line-clamp-2">
                {{ proyecto.descripcion || 'Sin descripción disponible para este proyecto.' }}
              </p>
            </div>
            
            <!-- Mensaje cuando no hay resultados -->
            <div v-if="filteredProjects.length === 0" class="bg-white p-8 rounded-xl shadow text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="mt-2 text-lg font-medium text-gray-900">No se encontraron proyectos</h3>
              <p class="mt-1 text-sm text-gray-500">Intenta con otra búsqueda o actualiza los datos.</p>
            </div>
          </div>
        </transition>
      </div>

      <!-- Panel lateral de detalles mejorado -->
      <transition name="slide">
        <div v-if="selectedProject" class="fixed inset-0 flex justify-end z-50">
          <!-- Overlay con efecto blur -->
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeProject"></div>
          
          <!-- Panel de detalles -->
          <div class="relative w-full md:w-2/3 lg:w-1/2 h-full bg-white shadow-2xl overflow-auto">
            <!-- Encabezado con botones -->
            <div class="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <span class="inline-block w-2 h-6 bg-blue-600 rounded mr-3"></span>
                Detalles del Proyecto
              </h2>
              <div class="flex items-center space-x-2">
                <button 
                  @click="downloadLabels" 
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar etiquetas
                </button>
                <button 
                  @click="closeProject" 
                  class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Cerrar panel"
                >
                  <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="p-6">
              <!-- Información del proyecto con diseño de tarjeta -->
              <div class="bg-gray-50 rounded-xl p-6 mb-6">
                <div class="flex flex-col md:flex-row">
                  <!-- Vista previa 3D principal -->
                  <div class="w-full md:w-1/3 mb-6 md:mb-0 md:pr-6">
                    <div class="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md">
                      <model-viewer 
                        :src="getModelUrl(selectedProject.filePath)" 
                        alt="Vista previa 3D" 
                        auto-rotate 
                        camera-controls 
                        style="width: 100%; height: 100%;"
                        shadow-intensity="1"
                        environment-image="neutral"
                      ></model-viewer>
                    </div>
                  </div>
                  
                  <!-- Información detallada -->
                  <div class="w-full md:w-2/3">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ selectedProject.nombreProyecto }}</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm text-gray-500">Código de Proyecto</div>
                        <div class="font-medium text-gray-900">{{ selectedProject.codigoProyecto }}</div>
                      </div>
                      
                      <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm text-gray-500">Fecha de Creación</div>
                        <div class="font-medium text-gray-900">{{ formatDate(selectedProject.createdAt) }}</div>
                      </div>
                    </div>
                    
                    <div class="mt-4 bg-white p-3 rounded-lg shadow-sm">
                      <div class="text-sm text-gray-500">Descripción</div>
                      <div class="font-medium text-gray-900">{{ selectedProject.descripcion || 'Sin descripción disponible' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pestañas mejoradas -->
              <div class="mb-6">
                <div class="flex border-b">
                  <button 
                    @click="activeTab = 'padre'" 
                    class="px-4 py-2 focus:outline-none transition-colors relative"
                    :class="activeTab === 'padre' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'"
                  >
                    Modelo Principal
                    <div v-if="activeTab === 'padre'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                  </button>
                  <button 
                    @click="activeTab = 'hijos'" 
                    class="px-4 py-2 focus:outline-none transition-colors relative"
                    :class="activeTab === 'hijos' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'"
                  >
                    Componentes
                    <div v-if="activeTab === 'hijos'" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                  </button>
                </div>
              </div>

              <!-- Contenido de pestañas con transiciones -->
              <transition name="fade" mode="out-in">
                <div v-if="activeTab === 'padre'" key="padre" class="bg-white rounded-xl overflow-hidden shadow-md">
                  <!-- Vista principal mejorada -->
                  <model-viewer 
                    :src="getModelUrl(selectedProject.filePath)" 
                    alt="Vista previa 3D principal" 
                    auto-rotate 
                    camera-controls 
                    style="width: 100%; height: 400px;"
                    shadow-intensity="1"
                    environment-image="neutral"
                  ></model-viewer>
                </div>
                
                <div v-else-if="activeTab === 'hijos'" key="hijos">
                  <div v-if="selectedProject.childFiles && selectedProject.childFiles.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(child, index) in selectedProject.childFiles" :key="index" 
                         class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div class="aspect-video relative">
                        <model-viewer 
                          :src="getModelUrl(child.filePath)" 
                          alt="Vista previa 3D componente" 
                          auto-rotate 
                          camera-controls 
                          style="width: 100%; height: 100%;"
                          shadow-intensity="1"
                          environment-image="neutral"
                        ></model-viewer>
                      </div>
                      <div class="p-4">
                        <h4 class="font-medium text-gray-900 mb-2">{{ child.fileName }}</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span class="text-gray-500">Tamaño:</span>
                            <span class="ml-1 text-gray-900">{{ formatFileSize(child.fileSize) }}</span>
                          </div>
                          <div>
                            <span class="text-gray-500">Extensión:</span>
                            <span class="ml-1 text-gray-900">{{ child.extension }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="bg-gray-50 p-8 rounded-xl text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 class="mt-2 text-lg font-medium text-gray-900">No hay componentes asociados</h3>
                    <p class="mt-1 text-sm text-gray-500">Este proyecto no tiene componentes adicionales registrados.</p>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import { getArchivos3D } from '@/api/archivos3d';
// Importamos las librerías para generar el Excel y el QR
import ExcelJS from 'exceljs';
import QRCode from 'qrcode';

export default {
  components: {
    Navbar,
    Sidebar
  },
  data() {
    return {
      sidebarExpanded: false,
      searchQuery: '',
      viewType: 'tabla',
      proyectos: [],
      selectedProject: null,
      activeTab: 'padre', // 'padre' o 'hijos'
      isLoading: false,
    };
  },
  computed: {
    filteredProjects() {
      if (!this.searchQuery) return this.proyectos;
      
      const query = this.searchQuery.toLowerCase();
      return this.proyectos.filter(proyecto =>
        proyecto.nombreProyecto.toLowerCase().includes(query) ||
        proyecto.codigoProyecto.toString().includes(query) ||
        (proyecto.descripcion && proyecto.descripcion.toLowerCase().includes(query))
      );
    },
  },
  mounted() {
    this.loadProyectos();
  },
  methods: {
    async loadProyectos() {
      this.isLoading = true;
      try {
        const data = await getArchivos3D();
        this.proyectos = data;
      } catch (error) {
        console.error('Error al cargar los proyectos:', error);
      } finally {
        this.isLoading = false;
      }
    },
    searchProjects() {
      console.log('Buscando:', this.searchQuery);
    },
    selectProject(proyecto) {
      this.activeTab = 'padre';
      this.selectedProject = proyecto;
    },
    closeProject() {
      this.selectedProject = null;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' bytes';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      else return (bytes / 1048576).toFixed(1) + ' MB';
    },
    // Concatena la URL base con el filePath, reemplazando las barras invertidas por '/'
    getModelUrl(filePath) {
      const baseURL = import.meta.env.VITE_API_URLD; // Ejemplo: "https://tu-api.com/"
      const normalizedPath = filePath.replace(/\\/g, '/');
      return baseURL + normalizedPath;
    },
    // Función para obtener una imagen en base64 (necesaria para agregarla al Excel)
    async getImageBase64(url) {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },
    // Función para generar y descargar el archivo Excel con las etiquetas
    async downloadLabels() {
      if (!this.selectedProject || !this.selectedProject.childFiles || !this.selectedProject.childFiles.length) {
        alert("No hay componentes asociados para generar etiquetas.");
        return;
      }

      // Crear un nuevo workbook y worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Etiquetas');

      // Configurar el ancho de las columnas (puedes ajustar según necesidad)
      worksheet.columns = [
        { key: 'col1', width: 40 },
        { key: 'col2', width: 20 },
      ];

      // Ruta del logo (asegúrate de tenerlo en tu proyecto o usar una URL válida)
      const logoUrl = '../src/assets/logomexico.png'; // Ajusta la ruta según corresponda
      const logoBase64 = await this.getImageBase64(logoUrl);
      // Agregar el logo al workbook (se agregará una vez y se reutilizará en cada etiqueta)
      const logoImageId = workbook.addImage({
        base64: logoBase64,
        extension: 'png',
      });

      let currentRow = 1; // Fila de inicio para la primera etiqueta

      // Iterar sobre cada componente hijo para generar su etiqueta
      for (const child of this.selectedProject.childFiles) {
        // Generar el código QR para la URL completa del componente
        const apiRoute = this.getModelUrl(child.filePath);
        const qrCodeDataUrl = await QRCode.toDataURL(apiRoute);

        // Agregar el QR generado como imagen al workbook
        const qrImageId = workbook.addImage({
          base64: qrCodeDataUrl,
          extension: 'png',
        });

        // **Primera fila de la etiqueta:**
        // Columna A: Código de proyecto + Nombre
        worksheet.getCell(`A${currentRow}`).value = `${this.selectedProject.codigoProyecto} - ${this.selectedProject.nombreProyecto}`;
        // Columna B: Logo (se coloca en la celda correspondiente)
        worksheet.addImage(logoImageId, {
          tl: { col: 1, row: currentRow - 1 }, // 'col' es 0-based; col:1 corresponde a la columna B
          ext: { width: 100, height: 50 }
        });

        // **Segunda fila de la etiqueta:**
        // Columna A: Nombre de la pieza (componente hijo)
        worksheet.getCell(`A${currentRow + 1}`).value = child.fileName;
        // Columna B: Código QR
        worksheet.addImage(qrImageId, {
          tl: { col: 1, row: currentRow }, // Se posiciona en la columna B de la siguiente fila
          ext: { width: 100, height: 100 }
        });

        // Ajustar la altura de las filas para acomodar las imágenes
        worksheet.getRow(currentRow).height = 40;
        worksheet.getRow(currentRow + 1).height = 80;

        // Dejar una fila en blanco entre cada etiqueta
        currentRow += 3;
      }

      // Generar el archivo Excel y disparar la descarga
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'etiquetas.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f7fafc;
}
.content {
  padding: 20px;
}
</style>
