<template>
  <aside class="sidebar fixed top-0 left-0 bottom-0 shadow-xl transition-all duration-300 overflow-hidden z-10"
    @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
    :class="[{ 'w-64': isExpanded, 'w-20': !isExpanded }, currentThemeClasses]">

    <!-- Título del sidebar -->
    <div class="p-4 flex items-center justify-center border-b" :class="borderColorClass">
      <div v-if="isExpanded" class="h-12">
        <img src="@/assets/logomexico.png" alt="Logo" class="h-full object-contain" />
      </div>
      <div v-else class="h-10 w-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
        <img src="@/assets/logomexico.png" alt="Logo" class="h-8 w-8 object-contain" />
      </div>
    </div>

    <!-- Menú de navegación -->
    <nav class="mt-2 overflow-y-auto sidebar-nav">
      <ul class="space-y-1 px-2">
        <!-- Dashboard -->
        <li>
          <router-link to="/dashboard" class="flex items-center p-3 rounded-lg transition-colors"
            :class="[{ 'justify-center': !isExpanded }, hoverBgClass]">
            <i class="fas fa-tachometer-alt text-white sidebar-icon"></i>
            <span class="ml-4 text-white font-medium" v-if="isExpanded">Dashboard</span>
          </router-link>
        </li>

        <!-- Support -->
        <li>
          <router-link to="/support" class="flex items-center p-3 rounded-lg transition-colors"
            :class="[{ 'justify-center': !isExpanded }, hoverBgClass]">
            <i class="fas fa-life-ring text-white sidebar-icon"></i>
            <span class="ml-4 text-white font-medium" v-if="isExpanded">Soporte</span>
          </router-link>
        </li>

        <!-- Oficina Técnica con submenu -->
        <li>
          <div class="flex flex-col">
            <div class="flex items-center p-3 rounded-lg transition-colors cursor-pointer" :class="[
              { 'justify-center': !isExpanded },
              hoverBgClass,
              { [activeBgClass]: openSubmenu === 'oficina' }
            ]" @click="toggleSubMenu('oficina')">
              <i class="fas fa-paint-brush text-white sidebar-icon"></i>
              <span class="ml-4 text-white font-medium flex-1" v-if="isExpanded">Oficina Técnica</span>
              <i v-if="isExpanded" class="fas fa-chevron-down text-white transition-transform duration-300"
                :class="{ 'rotate-180': openSubmenu === 'oficina' }"></i>
            </div>
            <transition name="submenu">
              <ul v-show="openSubmenu === 'oficina'" class="ml-4 mt-1 space-y-1 rounded-lg py-2"
                :class="[{ 'ml-0': !isExpanded }, submenuBgClass]">
                <li>
                  <router-link to="/design/dashboard" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-project-diagram submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Dashboard</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/design/uploadmodel1" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-upload submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Subir Modelo</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/design/tasksOT" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-sliders-h submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Actividades</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </li>

        <!-- Lógistica con submenu -->
        <li>
          <div class="flex flex-col">
            <div class="flex items-center p-3 rounded-lg transition-colors cursor-pointer" :class="[
              { 'justify-center': !isExpanded },
              hoverBgClass,
              { [activeBgClass]: openSubmenu === 'logistica' }
            ]" @click="toggleSubMenu('logistica')">
              <i class="fas fa-truck text-white sidebar-icon"></i>
              <span class="ml-4 text-white font-medium flex-1" v-if="isExpanded">Lógistica</span>
              <i v-if="isExpanded" class="fas fa-chevron-down text-white transition-transform duration-300"
                :class="{ 'rotate-180': openSubmenu === 'logistica' }"></i>
            </div>
            <transition name="submenu">
              <ul v-show="openSubmenu === 'logistica'" class="ml-4 mt-1 space-y-1 rounded-lg py-2"
                :class="[{ 'ml-0': !isExpanded }, submenuBgClass]">
                <li>
                  <router-link to="/logistica/detalles" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-tags submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Detalles</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/logistica/carpetas" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-folder-open submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Carpetas</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </li>

        <!-- Finanzas con submenu -->
        <li>
          <div class="flex flex-col">
            <div class="flex items-center p-3 rounded-lg transition-colors cursor-pointer" :class="[
              { 'justify-center': !isExpanded },
              hoverBgClass,
              { [activeBgClass]: openSubmenu === 'finanzas' }
            ]" @click="toggleSubMenu('finanzas')">
              <i class="fas fa-dollar-sign text-white sidebar-icon"></i>
              <span class="ml-4 text-white font-medium flex-1" v-if="isExpanded">Finanzas</span>
              <i v-if="isExpanded" class="fas fa-chevron-down text-white transition-transform duration-300"
                :class="{ 'rotate-180': openSubmenu === 'finanzas' }"></i>
            </div>
            <transition name="submenu">
              <ul v-show="openSubmenu === 'finanzas'" class="ml-4 mt-1 space-y-1 rounded-lg py-2"
                :class="[{ 'ml-0': !isExpanded }, submenuBgClass]">
                <li>
                  <router-link to="/finanzas/dashboard" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-chart-line submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Dashboard</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/finanzas/solicitudes" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-file-invoice-dollar submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Solicitud</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/finanzas/aprobaciones" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-check-double submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Aprobaciones</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/finanzas/comprobaciones" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-receipt submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Comprobación de
                      Gastos</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </li>

        <!-- TI con submenu (solo para admin) -->
        <li v-if="isAdmin">
          <div class="flex flex-col">
            <div class="flex items-center p-3 rounded-lg transition-colors cursor-pointer" :class="[
              { 'justify-center': !isExpanded },
              hoverBgClass,
              { [activeBgClass]: openSubmenu === 'TI' }
            ]" @click="toggleSubMenu('TI')">
              <i class="fas fa-desktop text-white sidebar-icon"></i>
              <span class="ml-4 text-white font-medium flex-1" v-if="isExpanded">TI</span>
              <i v-if="isExpanded" class="fas fa-chevron-down text-white transition-transform duration-300"
                :class="{ 'rotate-180': openSubmenu === 'TI' }"></i>
            </div>
            <transition name="submenu">
              <ul v-show="openSubmenu === 'TI'" class="ml-4 mt-1 space-y-1 rounded-lg py-2"
                :class="[{ 'ml-0': !isExpanded }, submenuBgClass]">
                <li>
                  <router-link to="/equipos" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-cogs submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Equipos</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/mantenimientos" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-wrench submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Mantenimientos</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/tickets" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-ticket-alt submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Tickets</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/usuarios" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-users submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Usuarios</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/actividades" class="flex items-center p-2 rounded-lg transition-colors"
                    :class="[{ 'justify-center': !isExpanded }, submenuHoverClass]">
                    <i class="fas fa-tasks submenu-icon" :class="submenuTextClass"></i>
                    <span class="ml-2 font-medium" v-if="isExpanded" :class="submenuTextClass">Actividades</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Footer con información de usuario y configuración -->
    <div class="absolute bottom-0 left-0 right-0 border-t" :class="borderColorClass" v-if="isExpanded">
      <!-- Selector de temas y opciones de usuario -->
      <div v-if="showUserMenu" class="p-3 bg-opacity-20 bg-black">
        <div class="mb-4">
          <h3 class="text-white text-sm font-medium mb-2 flex items-center">
            <i class="fas fa-palette mr-2"></i>Temas
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="(theme, index) in themes" :key="index"
              class="h-8 rounded-md cursor-pointer border border-white border-opacity-30 transition-all hover:scale-105 flex items-center justify-center"
              :class="[theme.previewClass, { 'ring-2 ring-white ring-opacity-70': currentTheme === theme.name }]"
              @click="setTheme(theme.name)">
              <span class="text-xs text-white font-medium opacity-80">{{ theme.label }}</span>
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-white border-opacity-10">
          <button @click="logout"
            class="w-full flex items-center p-2 rounded-md hover:bg-red-700 hover:bg-opacity-10 text-white transition-colors">
            <i class="fas fa-sign-out-alt mr-2"></i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      <!-- Panel de usuario -->
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center">
          <div class="h-10 w-10 rounded-full bg-white flex items-center justify-center">
            <i class="fas fa-user" :class="userIconClass"></i>
          </div>
          <div class="ml-3">
            <p class="text-white font-medium truncate max-w-[120px]">{{ userName || 'Usuario' }}</p>
            <p class="text-sm" :class="subtextClass">{{ isAdmin ? 'Administrador' : 'Usuario' }}</p>
          </div>
        </div>
        <div>
          <button @click="toggleUserMenu()" class="text-white p-2 rounded relative">
            <i class="fas fa-cog" :class="{ 'animate-spin-slow': showUserMenu }"></i>
            <span v-if="showUserMenu" class="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white"></span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
<script>
import { nextTick } from "vue";
import Swal from "sweetalert2";

export default {
  name: "Sidebar",
  props: {
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openSubmenu: null,
      showUserMenu: false,
      currentTheme: 'corporateBlue',
      themes: [
        {
          name: 'corporateBlue',
          label: 'Azul Corporativo',
          previewClass: 'bg-gradient-to-b from-[#2C3E50] to-[#1A2533]',
          classes: {
            main: 'bg-gradient-to-b from-[#2C3E50] to-[#1A2533]',
            border: 'border-[#34495E]',
            hover: 'hover:bg-[#34495E]',
            active: 'bg-[#34495E]',
            submenu: 'bg-[#1A2533]',
            submenuHover: 'hover:bg-[#2C3E50]',
            submenuText: 'text-gray-300',
            userIcon: 'text-[#2C3E50]',
            subtext: 'text-gray-300'
          }
        },
        {
          name: 'darkSlate',
          label: 'Gris Oscuro',
          previewClass: 'bg-gradient-to-b from-[#2D3436] to-[#1E272E]',
          classes: {
            main: 'bg-gradient-to-b from-[#2D3436] to-[#1E272E]',
            border: 'border-[#3D4852]',
            hover: 'hover:bg-[#3D4852]',
            active: 'bg-[#3D4852]',
            submenu: 'bg-[#1E272E]',
            submenuHover: 'hover:bg-[#2D3436]',
            submenuText: 'text-gray-300',
            userIcon: 'text-[#2D3436]',
            subtext: 'text-gray-300'
          }
        },
        {
          name: 'deepTeal',
          label: 'Verde Azulado',
          previewClass: 'bg-gradient-to-b from-[#004D40] to-[#00352C]',
          classes: {
            main: 'bg-gradient-to-b from-[#004D40] to-[#00352C]',
            border: 'border-[#00695C]',
            hover: 'hover:bg-[#00695C]',
            active: 'bg-[#00695C]',
            submenu: 'bg-[#00352C]',
            submenuHover: 'hover:bg-[#004D40]',
            submenuText: 'text-teal-200',
            userIcon: 'text-[#004D40]',
            subtext: 'text-teal-200'
          }
        },
        {
          name: 'richBurgundy',
          label: 'Borgoña',
          previewClass: 'bg-gradient-to-b from-[#4A1942] to-[#2E0F29]',
          classes: {
            main: 'bg-gradient-to-b from-[#4A1942] to-[#2E0F29]',
            border: 'border-[#5C2150]',
            hover: 'hover:bg-[#5C2150]',
            active: 'bg-[#5C2150]',
            submenu: 'bg-[#2E0F29]',
            submenuHover: 'hover:bg-[#4A1942]',
            submenuText: 'text-pink-200',
            userIcon: 'text-[#4A1942]',
            subtext: 'text-pink-200'
          }
        }
      ]
    };
  },
  computed: {
    userName() {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          return user.name || 'Usuario';
        } catch (error) {
          console.error("Error al parsear currentUser:", error);
        }
      }
      return 'Usuario';
    },
    isAdmin() {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          return user.role === "admin";
        } catch (error) {
          console.error("Error al parsear el usuario:", error);
          return false;
        }
      }
      return false;
    },
    currentThemeClasses() {
      const theme = this.themes.find(t => t.name === this.currentTheme);
      return theme ? theme.classes.main : '';
    },
    borderColorClass() {
      const theme = this.themes.find(t => t.name === this.currentTheme);
      return theme ? theme.classes.border : '';
    },
    hoverBgClass() {
      const theme = this.themes.find(t => t.name === this.currentTheme);
      return theme ? theme.classes.hover : '';
    },
    activeBgClass() {
      const theme = this.themes.find(t => t.name === this.currentTheme);
      return theme ? theme.classes.active : '';
    },
    submenuBgClass() {
      const theme = this.themes.find(t => t.name === this.currentTheme);
      return theme ? theme.classes.submenu : '';
    },
    submenuHoverClass() {
      const theme = this.themes.find(t => t.name === this.currentTheme);
      return theme ? theme.classes.submenuHover : '';
    },
    submenuTextClass() {
      const theme = this.themes.find(t => t.name === this.currentTheme);
      return theme ? theme.classes.submenuText : '';
    },
    userIconClass() {
      const theme = this.themes.find(t => t.name === this.currentTheme);
      return theme ? theme.classes.userIcon : '';
    },
    subtextClass() {
      const theme = this.themes.find(t => t.name === this.currentTheme);
      return theme ? theme.classes.subtext : '';
    }
  },
  created() {
    // Cargar tema guardado si existe
    const savedTheme = localStorage.getItem('sidebarTheme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }

    // Detectar si hay un submenu activo basado en la ruta actual
    this.detectActiveSubmenu();
  },
  methods: {
    handleMouseEnter() {
      this.$emit("update:isExpanded", true);
    },
    handleMouseLeave() {
      this.$emit("update:isExpanded", false);
      // Ocultar menú de usuario al contraer
      this.showUserMenu = false;
    },
    toggleSubMenu(menu) {
      this.openSubmenu = this.openSubmenu === menu ? null : menu;
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    setTheme(themeName) {
      this.currentTheme = themeName;
      // Guardar preferencia en localStorage
      localStorage.setItem('sidebarTheme', themeName);
    },
    async logout() {
      console.log("Cerrando sesión...");

      // Elimina la información del usuario
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");

      // Cierra el dropdown antes de redirigir
      this.showUserMenu = false;

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
    detectActiveSubmenu() {
      const path = this.$route?.path || '';

      if (path.includes('/design/')) {
        this.openSubmenu = 'oficina';
      } else if (path.includes('/logistica/')) {
        this.openSubmenu = 'logistica';
      } else if (path.includes('/finanzas/')) {
        this.openSubmenu = 'finanzas';
      } else if (path.includes('/equipos') || path.includes('/mantenimientos') ||
        path.includes('/tickets') || path.includes('/usuarios') ||
        path.includes('/actividades')) {
        this.openSubmenu = 'TI';
      }
    }
  },
  watch: {
    '$route'() {
      // Actualizar submenu activo cuando cambia la ruta
      this.detectActiveSubmenu();
    }
  }
};
</script>
<style scoped>
/* Estilos base del sidebar */
.sidebar {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.sidebar-nav {
  height: calc(100vh - 80px - 68px);
  /* Altura total - header - footer */
}

/* Iconos del sidebar */
.sidebar-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submenu-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animaciones para submenus */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

/* Estilos para router-link activo */
.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 3px solid white;
  padding-left: calc(0.75rem - 3px) !important;
  /* Ajustar padding para compensar el borde */
}

/* Animación para el icono de engranaje */
.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Estilos para scrollbar personalizado */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Transiciones suaves para todos los elementos */
.sidebar * {
  transition: all 0.2s ease;
}

/* Estilos para el panel de usuario */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estilos para el modo contraído */
@media (max-width: 768px) {
  .sidebar {
    width: 0 !important;
    transform: translateX(-100%);
  }

  .sidebar.expanded {
    width: 256px !important;
    transform: translateX(0);
  }
}
</style>