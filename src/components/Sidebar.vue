<template>
  <div class="sidebar bg-white text-sooty w-16 h-full mt-16 transition-all duration-300 shadow-lg">
    <!-- Contenido del sidebar -->
    <div class="p-4">
      <h2 class="text-xl font-semibold hidden"></h2>
    </div>
    <ul class="space-y-4 mt-6">
      <!-- Elementos del sidebar -->
      <li class="sidebar-item">
        <router-link to="/dashboard" class="text-sooty flex items-center space-x-2">
          <i class="fas fa-tachometer-alt h-6 w-6"></i>
          <span class="sidebar-text">Dashboard</span>
        </router-link>
      </li>

      <!-- Oficina Técnica con submenú -->
      <li class="sidebar-item relative" @click="toggleSubMenu('design')">
        <div class="text-sooty flex items-center space-x-2 cursor-pointer">
          <i class="fas fa-tachometer-alt h-6 w-6"></i>
          <span class="sidebar-text">Oficina Técnica</span>
          <i class="fas fa-chevron-down ml-auto transition-transform" :class="{'rotate-180': openSubmenu === 'design'}"></i>
        </div>
        <ul v-show="openSubmenu === 'design'" class="submenu pl-6 space-y-2">
          <li class="sidebar-subitem">
            <router-link to="/design/uploadmodel1" class="text-sooty flex-col items-center space-x-2">
              <i class="fas fa-circle h-4 w-4"></i>
              <span class="sidebar-text">Subir modelo</span>
            </router-link>
          </li>
          <li class="sidebar-subitem">
            <router-link to="/design/option2" class="text-sooty flex-col items-center space-x-2">
              <i class="fas fa-circle h-4 w-4"></i>
              <span class="sidebar-text">Opción 2</span>
            </router-link>
          </li>
        </ul>
      </li>

      <li class="sidebar-item">
        <router-link to="/equipos" class="text-sooty flex items-center space-x-2">
          <i class="fas fa-cogs h-6 w-6"></i>
          <span class="sidebar-text">Equipos</span>
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link to="/mantenimientos" class="text-sooty flex items-center space-x-2">
          <i class="fas fa-wrench h-6 w-6"></i>
          <span class="sidebar-text">Mantenimientos</span>
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link to="/tickets" class="text-sooty flex items-center space-x-2">
          <i class="fas fa-ticket-alt h-6 w-6"></i>
          <span class="sidebar-text">Tickets</span>
        </router-link>
      </li>
      <li class="sidebar-item">
        <router-link to="/usuarios" class="text-sooty flex items-center space-x-2">
          <i class="fas fa-users h-6 w-6"></i>
          <span class="sidebar-text">Usuarios</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      openSubmenu: null, // Estado para manejar qué submenú está abierto
    };
  },
  methods: {
    toggleSubMenu(menu) {
      this.openSubmenu = this.openSubmenu === menu ? null : menu;
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  transition: width 0.3s ease-in-out;
}

.sidebar:hover {
  width: 250px; /* Sidebar expandido */
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s;
}

.sidebar-item:hover {
  background-color: #7e909a;
}

.sidebar-text {
  display: none;
  transition: opacity 0.3s ease-in-out;
}

.sidebar:hover .sidebar-text {
  display: inline-block;
  opacity: 1;
}

.sidebar-item i {
  color: #141414;
  transition: color 0.3s ease-in-out;
}

.sidebar-item:hover i {
  color: #ffffff;
}

/* Estilos del submenú */
.submenu {
  transition: all 0.3s ease-in-out;
}

.submenu .sidebar-subitem {
  padding-left: 20px;
  font-size: 14px;
}

.sidebar-subitem:hover {
  background-color: #b0b0b0;
}

/* Animación de la flecha */
.rotate-180 {
  transform: rotate(180deg);
}
</style>
