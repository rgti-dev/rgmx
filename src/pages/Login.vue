<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
    <transition name="fade">
      <div v-if="showCard" class="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 hover:scale-[1.01]">
        <!-- Logo en la parte superior -->
        <div class="flex justify-center mb-6">
          <img src="/src/assets/logomexico.png" alt="Logo" class="h-20 w-auto drop-shadow-md" />
        </div>
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
          Iniciar Sesión
        </h2>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="relative">
            <label for="email" class="block text-gray-700 font-medium mb-2">Correo</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input id="email" type="text" v-model="email" placeholder="Correo electrónico"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div class="relative">
            <label for="password" class="block text-gray-700 font-medium mb-2">Contraseña</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" placeholder="Contraseña"
                class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember" type="checkbox" v-model="rememberEmail" 
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="remember" class="ml-2 text-gray-600">Recordar correo</label>
            </div>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-800 transition-colors">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" :disabled="isLoading"
            class="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md">
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Ingresando...
            </span>
            <span v-else>Ingresar</span>
          </button>
        </form>
        <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center text-sm">
          {{ error }}
        </div>
        <div class="mt-6 text-center text-sm text-gray-500">
          ¿No tienes una cuenta? <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Regístrate aquí</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const rememberEmail = ref(false);
const error = ref(null);
const showCard = ref(false);
const isLoading = ref(false);
const showPassword = ref(false);

onMounted(() => {
  // Mostrar card con animación
  showCard.value = true;
  // Redirigir si ya hay sesión activa
  if (auth.isAuthenticated()) {
    router.push('/dashboard');
  }
  // Cargar el correo recordado (si existe)
  const savedEmail = localStorage.getItem('rememberedEmail');
  if (savedEmail) {
    email.value = savedEmail;
    rememberEmail.value = true;
  }
});

const handleLogin = async () => {
  error.value = null;
  
  // Validación básica
  if (!email.value.trim()) {
    error.value = "Por favor ingresa tu correo electrónico";
    return;
  }
  
  if (!password.value) {
    error.value = "Por favor ingresa tu contraseña";
    return;
  }
  
  isLoading.value = true;
  
  try {
    const success = await auth.login({ email: email.value, password: password.value });

    if (success) {
      // Guardar o limpiar el correo en localStorage según la selección
      if (rememberEmail.value) {
        localStorage.setItem('rememberedEmail', email.value);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Mostrar alerta de éxito con SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // Opcional: animar la salida de la card y redirigir
      showCard.value = false;
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
    } else {
      error.value = "Correo o contraseña incorrectos.";
    }
  } catch (err) {
    error.value = "Error al conectar con el servidor. Intenta nuevamente.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Animación de entrada/salida para el card */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Estilo para el fondo con patrón sutil */
.min-h-screen {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E"),
    linear-gradient(to bottom right, #FF9E18, #8C8C8A);
}
</style>
  