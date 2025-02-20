<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <input type="text" v-model="email" placeholder="Correo" class="w-full px-4 py-2 mb-3 border rounded-lg" />
        <input type="password" v-model="password" placeholder="Contraseña"
          class="w-full px-4 py-2 mb-3 border rounded-lg" />
        <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Ingresar
        </button>
      </form>
      <p v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref(null);

// ✅ Verificar si ya hay sesión activa
onMounted(() => {
  if (auth.isAuthenticated()) {
    router.push('/dashboard'); // Redirige automáticamente si el usuario ya está logueado
  }
});

const handleLogin = async () => {
  error.value = null;
  const success = await auth.login({ email: email.value, password: password.value });
  if (success) {
    router.push('/dashboard');
  } else {
    error.value = "Correo o contraseña incorrectos.";
  }
};

</script>