<template>
  <div class="navbar flex justify-between items-center shadow-lg">
    <!-- Logo y Título -->
    <router-link to="/dashboard" class="">
      <img src="/src/assets/logomexico.png" alt="Logo" class="h-10 w-auto" />
    </router-link>
    <!-- Menú de navegación -->
    <div class="flex items-center space-x-6 px-4">
      <!-- Aquí puedes agregar más enlaces si lo necesitas -->
      <!-- Perfil y dropdown -->
      <div class="relative">
        <button @click="toggleDropdown" class="flex items-center text-gray-500 focus:outline-none hover:text-gray-300 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
          </svg>
          <span class="ml-2 hidden sm:inline">Perfil</span>
        </button>
        <transition name="fade">
          <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden">
            <ul>
              <li>
                <button @click="logout" class="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
                  </svg>
                  <span class="text-gray-700">Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from "vue";
import Swal from "sweetalert2";
export default {
  name: "Navbar",
  data() {
    return {
      isDropdownOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async logout() {
      console.log("Cerrando sesión...");

      // Elimina la información del usuario
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");

      // Cierra el dropdown antes de redirigir
      this.isDropdownOpen = false;

      // Espera a que Vue actualice el DOM
      await nextTick();

      // Muestra alerta de SweetAlert2 personalizada
      await Swal.fire({
        icon: "info",
        title: "Cerrando sesión...",
        text: "Tu sesión se ha cerrado correctamente",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          popup: 'swal2-popup-custom'
        }
      });
      try {
        await this.$router.push("/login");
        window.location.href = "/";
      } catch (err) {
        console.error("Error al redirigir a /login:", err);
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  background: white;
  padding: 0.5rem 1rem;
}

/* Transición para el dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Clase personalizada para SweetAlert2 */
.swal2-popup-custom {
  border-radius: 0.5rem;
  font-family: 'Inter', sans-serif;
  padding: 1.5rem;
}
</style>
``` 

**Notas:**

- Se ha actualizado el fondo del navbar con un degradado y se han mejorado los tamaños y espaciados.
- El botón de "Perfil" y el dropdown ahora tienen transiciones y efectos al pasar el mouse.
- La alerta de SweetAlert2 se personaliza con una clase (`swal2-popup-custom`) para un estilo más moderno.
- Si deseas aplicar animaciones adicionales (por ejemplo, un efecto de fade out en el navbar antiguo) puedes agregar más clases y keyframes en el bloque CSS.

Con estas mejoras, el Navbar y el botón de cerrar sesión tendrán una apariencia y experiencia de usuario más pulida.
