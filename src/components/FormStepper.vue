<template>
  <div class="form-stepper">
    <div v-if="step === 1">
      <h3>Paso 1: Información del modelo</h3>
      <input v-model="formData.name" placeholder="Nombre del modelo" />
      <button @click="nextStep">Siguiente</button>
    </div>
    <div v-if="step === 2">
      <h3>Paso 2: Detalles adicionales</h3>
      <input v-model="formData.description" placeholder="Descripción" />
      <button @click="prevStep">Anterior</button>
      <button @click="submit">Enviar</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'FormStepper',
  emits: ['submit'],
  setup(_, { emit }) {
    const step = ref(1);
    const formData = ref({
      name: '',
      description: '',
    });

    const nextStep = () => {
      step.value++;
    };

    const prevStep = () => {
      step.value--;
    };

    const submit = () => {
      emit('submit', formData.value);
    };

    return {
      step,
      formData,
      nextStep,
      prevStep,
      submit,
    };
  },
};
</script>

<style scoped>
.form-stepper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
  max-width: 300px;
}

button {
  margin: 5px;
  padding: 10px 20px;
}
</style>