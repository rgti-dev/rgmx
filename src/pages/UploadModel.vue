<template>
  <div class="upload-model">
    <!-- Área de arrastrar y soltar para subir archivos -->
    <div
      class="drag-and-drop"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <p>Arrastra y suelta tu archivo .glb aquí o haz clic para seleccionar</p>
      <input type="file" accept=".glb" @change="handleFileSelect" ref="fileInput" hidden />
    </div>
    <button @click="openFileDialog">Seleccionar archivo</button>

    <!-- Modal para la vista previa del archivo 3D -->
    <Modal v-if="showModal" @close="showModal = false">
      <template #header>
        <h3>Vista previa del archivo 3D</h3>
      </template>
      <template #body>
        <div ref="previewContainer" class="preview-container"></div>
        <FormStepper @submit="handleSubmit" />
      </template>
    </Modal>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ref } from 'vue';
import Modal from '@/components/Modal.vue';
import FormStepper from '@/components/FormStepper.vue';

export default {
  name: 'UploadModel',
  components: { Modal, FormStepper },
  setup() {
    const fileInput = ref(null); // Referencia al input de archivo
    const showModal = ref(false); // Estado para mostrar/ocultar el modal
    const previewContainer = ref(null); // Referencia al contenedor de vista previa
    let controls; // Controles de órbita para mover el modelo

    // Abre el diálogo de selección de archivos
    const openFileDialog = () => {
      fileInput.value.click();
    };

    // Maneja la selección de archivos desde el input
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file && file.name.endsWith('.glb')) {
        showModal.value = true;
        loadPreview(file);
      }
    };

    // Maneja la acción de arrastrar y soltar archivos
    const handleDrop = (event) => {
      const file = event.dataTransfer.files[0];
      if (file && file.name.endsWith('.glb')) {
        showModal.value = true;
        loadPreview(file);
      }
    };

    // Carga la vista previa del archivo 3D
    const loadPreview = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(300, 300); // Tamaño del renderizador
        renderer.setClearColor(0xffffff); // Color de fondo blanco
        previewContainer.value.innerHTML = '';
        previewContainer.value.appendChild(renderer.domElement);

        // Agregar luces a la escena
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        const loader = new GLTFLoader();
        loader.parse(e.target.result, '', (gltf) => {
          const model = gltf.scene;
          scene.add(model);

          // Centrar el modelo
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);

          // Ajustar la posición de la cámara
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          camera.position.z = maxDim * 2.5; // Ajustar la posición de la cámara

          controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.25;
          controls.enableZoom = true;
          controls.enablePan = true; // Permitir el paneo
          controls.enableRotate = true; // Permitir la rotación

          const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          };
          animate();
        });
      };
      reader.readAsArrayBuffer(file);
    };

    // Maneja el envío del formulario
    const handleSubmit = (formData) => {
      console.log('Form submitted:', formData);
      showModal.value = false;
    };

    return {
      fileInput,
      showModal,
      previewContainer,
      openFileDialog,
      handleFileSelect,
      handleDrop,
      loadPreview,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.upload-model {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.drag-and-drop {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.preview-container {
  width: 300px; /* Tamaño del contenedor de vista previa */
  height: 300px; /* Tamaño del contenedor de vista previa */
  margin-bottom: 20px;
}
</style>