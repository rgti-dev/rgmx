<template>
  <div class="navbar bg-white text-oscuro p-4 flex justify-between items-center shadow-md">
    <!-- Logo -->
    <div>
      <router-link to="/" class="text-oscuro text-2xl font-bold hover:text-acento transition duration-300">
        Logo
      </router-link>
    </div>

    <!-- Enlaces -->
    <div>
      <ul class="flex space-x-6 items-center">

        <!-- Perfil y submenú -->
        <li class="relative">
          <!-- Botón Perfil -->
          <button @click="toggleDropdown" class="flex items-center space-x-2 hover:text-acento transition">
            <!-- Icono Perfil -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-oscuro"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"
              />
            </svg>
            <span>Perfil</span>
          </button>

          <!-- Dropdown -->
          <transition name="fade">
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-secundario text-oscuro rounded-lg shadow-lg"
            >
              <ul>
                <li>
                  <button
                    @click="logout"
                    class="flex items-center space-x-2 p-2 hover:bg-acento w-full text-left transition duration-300 rounded"
                  >
                    <!-- Icono Cerrar Sesión -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-acento"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                      />
                    </svg>
                    <span>Cerrar sesión</span>
                  </button>
                </li>
              </ul>
            </div>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
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
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
/* Paleta de colores */
.bg-secundario {
  background-color: #A5D8DD; /* Fondo suave */
}

.text-oscuro {
  color: #202020; /* Texto oscuro */
}

.hover\:text-acento:hover {
  color: #EA6A47; /* Hover enlaces */
}

.bg-secundario {
  background-color: #A5D8DD; /* Fondo suave */
}

.text-oscuro {
  color: #202020; /* Texto oscuro */
}

.text-acento {
  color: #EA6A47; /* Color de los iconos de acento (cerrar sesión) */
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

/* Transición para dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px #7E909A; /* Sombras suaves */
}
</style>
