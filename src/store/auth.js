import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    lastActivity: Date.now(), 
    logoutTimer: null,
  }),

  actions: {
    async login({ email, password }) {
      try {
        const response = await fetch('http://localhost:5000/api/usuarios/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');

        this.token = data.token;
        localStorage.setItem('token', data.token);
        this.lastActivity = Date.now(); 

        this.startAutoLogout();
        return true;
      } catch (error) {
        return false;
      }
    },

    logout() {
      this.token = null;
      localStorage.removeItem('token');
      clearTimeout(this.logoutTimer);

      const router = useRouter();
      router.push('/login'); // 📌 Redirigir al usuario al login tras cerrar sesión
    },

    isAuthenticated() {
      if (!this.token) return false;

      try {
        const decoded = jwtDecode(this.token);
        const now = Math.floor(Date.now() / 1000);
        
        if (decoded.exp < now) {
          this.logout();
          return false;
        }

        this.resetActivityTimer(); // Reiniciar temporizador si está autenticado
        return true;
      } catch (error) {
        this.logout();
        return false;
      }
    },

    startAutoLogout() {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = setTimeout(() => {
        this.logout();
      }, 5 * 60 * 1000); //  minuto de inactividad
    },

    resetActivityTimer() {
      this.lastActivity = Date.now();
      this.startAutoLogout();
    },
  },
});
