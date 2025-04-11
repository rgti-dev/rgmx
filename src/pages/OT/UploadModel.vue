<template>
  <div class="upload-model bg-gray-100 min-h-screen">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar v-model:isExpanded="sidebarExpanded" />

      <!-- Contenido principal -->
      <div class="content flex-1 w-full relative transition-all duration-300"
           :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }">
        <!-- Navbar eliminado -->
        
        <main class="p-8">
          <!-- Encabezado de página -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Subir Modelos 3D</h1>
            <p class="text-gray-600 mt-2">Arrastra o selecciona archivos GLB para cargar tus modelos 3D</p>
          </div>
          
          <!-- Área de Drag & Drop mejorada -->
          <div 
            class="drag-area mx-auto bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border-2 border-dashed p-16 text-center cursor-pointer"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            @click="openFileDialog"
            :class="{
              'border-blue-500 bg-blue-50 scale-102': isDragging,
              'border-gray-200': !isDragging
            }"
          >
            <div class="space-y-6">
              <!-- Icono animado -->
              <div class="upload-icon-container mx-auto h-24 w-24 flex items-center justify-center">
                <svg class="upload-icon h-16 w-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800">Sube tus modelos 3D</h3>
              <p class="text-gray-600 font-medium">
                Arrastra tus archivos aquí o 
                <span class="text-blue-600 hover:text-blue-700 underline">busca en tu equipo</span>
              </p>
              <div class="flex justify-center space-x-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Formato .glb
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Múltiples archivos
                </div>
              </div>
            </div>
            <!-- Se permite seleccionar varios archivos -->
            <input type="file" accept=".glb" multiple @change="handleFileSelect" ref="fileInput" hidden />
          </div>
        </main>

        <!-- Modal mejorado -->
        <transition name="modal-fade">
          <div v-if="showModal" class="modal-backdrop">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden transform transition-all">
              <!-- Encabezado del Modal -->
              <div class="flex items-center justify-between p-6 border-b bg-gray-50">
                <h3 class="text-2xl font-semibold text-gray-800 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  Vista previa y detalles
                </h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- Contenido del Modal -->
              <div class="flex flex-col md:flex-row">
                <!-- Sección izquierda - Vista previa de modelos -->
                <div class="w-full md:w-1/2 p-6 border-b md:border-r md:border-b-0 bg-gray-50">
                  <h4 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Vista previa de modelos
                  </h4>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="(fileObj, index) in uploadedFiles" :key="index" 
                         class="preview-item border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div class="relative h-48 rounded-t-lg overflow-hidden bg-gray-100">
                        <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
                          <div class="loader-spinner"></div>
                          <p class="mt-3 text-gray-600 text-sm font-medium">Cargando{{ dots }}</p>
                        </div>
                        <model-viewer
                          v-if="fileObj.url"
                          :src="fileObj.url"
                          alt="Modelo 3D"
                          auto-rotate
                          camera-controls
                          :shadow-intensity="shadowIntensity"
                          environment-image="https://modelviewer.dev/shared-assets/environments/neutral.hdr"
                          class="w-full h-full"
                          @load="onModelLoad"
                        ></model-viewer>
                      </div>
                      <div class="p-3 bg-white">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center">
                            <input 
                              type="radio" 
                              v-model="parentIndex" 
                              :value="index" 
                              :id="`model-${index}`"
                              class="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <label :for="`model-${index}`" class="ml-2 text-gray-700 text-sm">
                              Modelo principal
                            </label>
                          </div>
                          <span class="text-xs text-gray-500 truncate max-w-[120px]">{{ fileObj.file.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Controles de visualización -->
                  <div class="mt-6 flex flex-wrap gap-2">
                    <button 
                      @click="toggleSupport"
                      class="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
                      </svg>
                      <span class="text-gray-700">{{ shadowIntensity > 0 ? 'Ocultar base' : 'Mostrar base' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Sección derecha - Formulario -->
                <div class="w-full md:w-1/2 p-6">
                  <h4 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    Información del modelo
                  </h4>
                  
                  <FormStepper @submit="handleSubmit" class="stepper-animate" />
                  
                  <!-- Mensaje de error -->
                  <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {{ errorMessage }}
                  </div>
                </div>
              </div>
              
              <!-- Footer del modal -->
              <div class="p-4 border-t bg-gray-50 flex justify-end">
                <button @click="closeModal" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.drag-area {
  transition: all 0.3s ease;
}

.scale-102 {
  transform: scale(1.02);
}

.stepper-animate {
  animation: slideInRight 0.5s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.upload-icon-container {
  position: relative;
}

.upload-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

model-viewer {
  --poster-color: transparent;
  --progress-bar-color: transparent;
  --progress-mask: transparent;
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

<script>
import { ref, watch } from 'vue';
import FormStepper from '@/components/FormStepper.vue';
import '@google/model-viewer';
import Swal from 'sweetalert2';
import { createArchivo3D } from '@/api/archivos3d';
import Sidebar from '@/components/Sidebar.vue';
import * as THREE from 'three';

export default {
  name: 'UploadModel',
  components: {
    FormStepper,
    Sidebar,
  },
  data() {
    return {
      sidebarExpanded: false,
    };
  },
  setup() {
    const fileInput = ref(null);
    const showModal = ref(false);
    // Array para almacenar cada archivo y su URL
    const uploadedFiles = ref([]);
    // Índice del archivo seleccionado como modelo principal (por defecto el primero)
    const parentIndex = ref(0);
    const shadowIntensity = ref(0.8);
    const errorMessage = ref('');
    const isLoading = ref(false);
    const dots = ref('');
    const isDragging = ref(false);

    // Animación de puntos para "Cargando..."
    let intervalId = null;
    watch(isLoading, (newVal) => {
      if (newVal) {
        intervalId = setInterval(() => {
          if (dots.value.length >= 3) {
            dots.value = '';
          } else {
            dots.value += '.';
          }
        }, 500);
      } else {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        dots.value = '';
      }
    });

    // Resto del código sin cambios...
    
    // Mantener el resto de las funciones igual
    const openFileDialog = () => {
      fileInput.value.click();
    };

    const handleFileSelect = (event) => {
      const files = event.target.files;
      if (files.length) {
        uploadedFiles.value = [];
        for (const file of files) {
          if (file.name.endsWith('.glb')) {
            const url = URL.createObjectURL(file);
            uploadedFiles.value.push({ file, url });
          } else {
            errorMessage.value = 'Por favor, selecciona solo archivos .glb válidos.';
          }
        }
        if (uploadedFiles.value.length > 0) {
          parentIndex.value = 0; // Por defecto, el primer archivo es el principal
          showModal.value = true;
          errorMessage.value = '';
        }
      }
    };

    const handleDrop = (event) => {
      isDragging.value = false;
      const files = event.dataTransfer.files;
      if (files.length) {
        uploadedFiles.value = [];
        for (const file of files) {
          if (file.name.endsWith('.glb')) {
            const url = URL.createObjectURL(file);
            uploadedFiles.value.push({ file, url });
          } else {
            errorMessage.value = 'Por favor, selecciona solo archivos .glb válidos.';
          }
        }
        if (uploadedFiles.value.length > 0) {
          parentIndex.value = 0;
          showModal.value = true;
          errorMessage.value = '';
        }
      }
    };

    const handleDragOver = () => {
      isDragging.value = true;
    };

    const handleDragLeave = () => {
      isDragging.value = false;
    };

    const closeModal = () => {
      showModal.value = false;
      // Revocar URLs creados para evitar fugas de memoria
      uploadedFiles.value.forEach(fileObj => {
        URL.revokeObjectURL(fileObj.url);
      });
      uploadedFiles.value = [];
      shadowIntensity.value = 0.8;
    };

    // Función que se ejecuta al cargar el modelo en model-viewer
    const onModelLoad = (event) => {
      const viewer = event.target;
      if (viewer && viewer.model) {
        const model = viewer.model;
        // Intentamos acceder a los materiales directamente
        if (model.materials && model.materials.length > 0) {
          model.materials.forEach(material => {
            // Si el material no tiene textura, asignamos una por defecto
            if (!material.map) {
              const textureLoader = new THREE.TextureLoader();
              // Reemplaza la URL por la de tu textura base
              textureLoader.load('https://modelviewer.dev/shared-assets/textures/default.jpg', (texture) => {
                material.map = texture;
                material.needsUpdate = true;
              });
            }
          });
        } else if (model.scene) {
          // En caso de no encontrar materiales directos, recorremos la escena en busca de mallas
          model.scene.traverse((child) => {
            if (child.isMesh) {
              const material = child.material;
              if (material && !material.map) {
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load('https://modelviewer.dev/shared-assets/textures/default.jpg', (texture) => {
                  material.map = texture;
                  material.needsUpdate = true;
                });
              }
            }
          });
        }
      }
    };

    const handleSubmit = async (formDataFromStepper) => {
      // Validación: debe haberse cargado al menos un archivo
      if (uploadedFiles.value.length === 0) {
        errorMessage.value = 'Por favor, selecciona al menos un archivo .glb antes de enviar.';
        return;
      }

      // Validación: campos obligatorios del formulario
      if (
        !formDataFromStepper.codigoProyecto ||
        !formDataFromStepper.nombreProyecto ||
        !formDataFromStepper.marca ||
        !formDataFromStepper.userId
      ) {
        errorMessage.value = 'Por favor, completa todos los campos obligatorios.';
        return;
      }

      // Crear el objeto FormData y agregar los datos del formulario
      const data = new FormData();
      Object.entries(formDataFromStepper).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Agregar archivos:
      // Se asume que el archivo seleccionado como "principal" se envía con un nombre de campo y
      // los demás se envían como archivos hijos.
      const parentFileObj = uploadedFiles.value[parentIndex.value];
      data.append('archivo_principal', parentFileObj.file);
      uploadedFiles.value.forEach((fileObj, index) => {
        if (index !== parentIndex.value) {
          data.append('archivos_hijos[]', fileObj.file);
        }
      });

      // Debug: mostrar el contenido del FormData en consola
      console.log('Datos enviados en FormData:');
      for (const [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      // Mostrar animación de carga
      isLoading.value = true;
      try {
        const response = await createArchivo3D(data);
        isLoading.value = false;
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Archivos subidos y registrados correctamente.',
        });
        closeModal();
        logRegistro(response);
      } catch (error) {
        isLoading.value = false;
        console.error('Error al subir los archivos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al subir los archivos. Por favor, inténtalo de nuevo.',
        });
        errorMessage.value = 'Error al subir los archivos. Por favor, inténtalo de nuevo.';
      }
    };

    const toggleSupport = () => {
      shadowIntensity.value = shadowIntensity.value > 0 ? 0 : 0.8;
    };

    const logRegistro = (registro) => {
      const logData = JSON.stringify(registro, null, 2);
      const logFile = new Blob([logData], { type: 'application/json' });
      const logUrl = URL.createObjectURL(logFile);
      const link = document.createElement('a');
      link.href = logUrl;
      link.download = 'registro.json';
      link.click();
      URL.revokeObjectURL(logUrl);
    };

    return {
      fileInput,
      showModal,
      uploadedFiles,
      parentIndex,
      shadowIntensity,
      openFileDialog,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      handleDragLeave,
      closeModal,
      handleSubmit,
      toggleSupport,
      errorMessage,
      isLoading,
      dots,
      isDragging,
      onModelLoad,
    };
  },
};
</script>
