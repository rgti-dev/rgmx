<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
    <!-- Barra de progreso mejorada -->
    <div class="mb-8">
      <div class="flex justify-between mb-2">
        <span class="text-sm font-medium text-blue-600">Progreso</span>
        <span class="text-sm font-medium text-blue-600">{{ Math.round((step / totalSteps) * 100) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          class="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          :style="{ width: `${(step / totalSteps) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Pasos mejorados -->
    <div class="flex items-center mb-8">
      <!-- Paso 1 -->
      <div class="flex items-center">
        <div
          class="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-all duration-300"
          :class="[
            step > 1 ? 'bg-green-500' : step === 1 ? 'bg-blue-600 ring-4 ring-blue-200' : 'bg-gray-300',
          ]"
        >
          <template v-if="step > 1">
            <!-- Ícono de verificación -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </template>
          <template v-else>
            1
          </template>
        </div>
        <span class="ml-3 text-gray-700 font-medium">Información del modelo</span>
      </div>
      <!-- Línea divisoria animada -->
      <div class="flex-1 h-1 mx-4 relative">
        <div class="absolute inset-0 bg-gray-300"></div>
        <div 
          class="absolute inset-0 bg-green-500 transition-all duration-500 ease-in-out" 
          :style="{ width: step > 1 ? '100%' : '0%' }"
        ></div>
      </div>
      <!-- Paso 2 -->
      <div class="flex items-center">
        <div
          class="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-all duration-300"
          :class="[
            step > 2 ? 'bg-green-500' : step === 2 ? 'bg-blue-600 ring-4 ring-blue-200' : 'bg-gray-300',
          ]"
        >
          <template v-if="step > 2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </template>
          <template v-else>
            2
          </template>
        </div>
        <span class="ml-3 text-gray-700 font-medium">Detalles adicionales</span>
      </div>
    </div>

    <!-- Contenido de cada paso con transiciones -->
    <transition name="fade" mode="out-in">
      <div :key="step">
        <div v-if="step === 1" class="space-y-6">
          <h3 class="text-2xl font-semibold flex items-center text-gray-800">
            <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16h8M8 12h8M8 8h8"/>
            </svg>
            Paso 1: Información del modelo
          </h3>
          
          <div class="space-y-4">
            <div>
              <label for="codigoProyecto" class="block text-sm font-medium text-gray-700 mb-1">
                Código del proyecto <span class="text-red-500">*</span>
              </label>
              <input
                id="codigoProyecto"
                v-model="formData.codigoProyecto"
                placeholder="Ej: PRJ-001"
                class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                :class="[errors.codigoProyecto ? 'border-red-500' : 'border-gray-300']"
                @blur="validateField('codigoProyecto')"
              />
              <p v-if="errors.codigoProyecto" class="mt-1 text-sm text-red-500">{{ errors.codigoProyecto }}</p>
            </div>

            <div>
              <label for="nombreProyecto" class="block text-sm font-medium text-gray-700 mb-1">
                Nombre del proyecto <span class="text-red-500">*</span>
              </label>
              <input
                id="nombreProyecto"
                v-model="formData.nombreProyecto"
                placeholder="Nombre del proyecto"
                class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                :class="[errors.nombreProyecto ? 'border-red-500' : 'border-gray-300']"
                @blur="validateField('nombreProyecto')"
              />
              <p v-if="errors.nombreProyecto" class="mt-1 text-sm text-red-500">{{ errors.nombreProyecto }}</p>
            </div>

            <div>
              <label for="marca" class="block text-sm font-medium text-gray-700 mb-1">
                Marca <span class="text-red-500">*</span>
              </label>
              <input
                id="marca"
                v-model="formData.marca"
                placeholder="Marca"
                class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                :class="[errors.marca ? 'border-red-500' : 'border-gray-300']"
                @blur="validateField('marca')"
              />
              <p v-if="errors.marca" class="mt-1 text-sm text-red-500">{{ errors.marca }}</p>
            </div>

            <div>
              <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">
                ID del usuario <span class="text-red-500">*</span>
              </label>
              <input
                id="userId"
                v-model="formData.userId"
                placeholder="ID del usuario"
                type="number"
                class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                :class="[errors.userId ? 'border-red-500' : 'border-gray-300']"
                @blur="validateField('userId')"
              />
              <p v-if="errors.userId" class="mt-1 text-sm text-red-500">{{ errors.userId }}</p>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="validateAndNext"
              class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              :disabled="isStep1Invalid"
              :class="{ 'opacity-50 cursor-not-allowed': isStep1Invalid }"
            >
              Siguiente
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="step === 2" class="space-y-6">
          <h3 class="text-2xl font-semibold flex items-center text-gray-800">
            <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
            Paso 2: Detalles adicionales
          </h3>
          
          <div>
            <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span class="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              v-model="formData.descripcion"
              placeholder="Descripción detallada del proyecto"
              rows="4"
              class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              :class="[errors.descripcion ? 'border-red-500' : 'border-gray-300']"
              @blur="validateField('descripcion')"
            ></textarea>
            <p v-if="errors.descripcion" class="mt-1 text-sm text-red-500">{{ errors.descripcion }}</p>
          </div>

          <div class="flex justify-between">
            <button
              @click="prevStep"
              class="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            <button
              @click="validateAndSubmit"
              class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              :disabled="isStep2Invalid"
              :class="{ 'opacity-50 cursor-not-allowed': isStep2Invalid }"
            >
              Enviar
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Indicador de campos obligatorios -->
    <div class="mt-6 text-sm text-gray-500">
      <span class="text-red-500">*</span> Campos obligatorios
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'FormStepper',
  emits: ['submit'],
  setup(_, { emit }) {
    const step = ref(1);
    const totalSteps = 2;
    const formData = ref({
      codigoProyecto: '',
      nombreProyecto: '',
      marca: '',
      userId: '',
      descripcion: '',
    });

    const errors = ref({
      codigoProyecto: '',
      nombreProyecto: '',
      marca: '',
      userId: '',
      descripcion: '',
    });

    const validateField = (field) => {
      errors.value[field] = '';
      
      switch (field) {
        case 'codigoProyecto':
          if (!formData.value[field]) {
            errors.value[field] = 'El código del proyecto es obligatorio';
          } else if (formData.value[field].length < 3) {
            errors.value[field] = 'El código debe tener al menos 3 caracteres';
          }
          break;
        case 'nombreProyecto':
          if (!formData.value[field]) {
            errors.value[field] = 'El nombre del proyecto es obligatorio';
          }
          break;
        case 'marca':
          if (!formData.value[field]) {
            errors.value[field] = 'La marca es obligatoria';
          }
          break;
        case 'userId':
          if (!formData.value[field]) {
            errors.value[field] = 'El ID del usuario es obligatorio';
          } else if (isNaN(formData.value[field]) || formData.value[field] <= 0) {
            errors.value[field] = 'El ID debe ser un número positivo';
          }
          break;
        case 'descripcion':
          if (!formData.value[field]) {
            errors.value[field] = 'La descripción es obligatoria';
          } else if (formData.value[field].length < 10) {
            errors.value[field] = 'La descripción debe tener al menos 10 caracteres';
          }
          break;
      }
      
      return !errors.value[field];
    };

    const validateStep = (stepNumber) => {
      let isValid = true;
      
      if (stepNumber === 1) {
        ['codigoProyecto', 'nombreProyecto', 'marca', 'userId'].forEach(field => {
          if (!validateField(field)) {
            isValid = false;
          }
        });
      } else if (stepNumber === 2) {
        if (!validateField('descripcion')) {
          isValid = false;
        }
      }
      
      return isValid;
    };

    const isStep1Invalid = computed(() => {
      return !formData.value.codigoProyecto || 
             !formData.value.nombreProyecto || 
             !formData.value.marca || 
             !formData.value.userId;
    });

    const isStep2Invalid = computed(() => {
      return !formData.value.descripcion;
    });

    const validateAndNext = () => {
      if (validateStep(1)) {
        nextStep();
      }
    };

    const validateAndSubmit = () => {
      if (validateStep(2)) {
        submit();
      }
    };

    const nextStep = () => {
      if (step.value < totalSteps) {
        step.value++;
      }
    };

    const prevStep = () => {
      if (step.value > 1) {
        step.value--;
      }
    };

    const submit = () => {
      emit('submit', formData.value);
    };

    return {
      step,
      totalSteps,
      formData,
      errors,
      nextStep,
      prevStep,
      submit,
      validateField,
      validateAndNext,
      validateAndSubmit,
      isStep1Invalid,
      isStep2Invalid
    };
  },
};
</script>

<style scoped>
/* Animaciones de transición */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Estilos responsivos */
@media (max-width: 640px) {
  .max-w-md {
    max-width: 100%;
  }
}
</style>
