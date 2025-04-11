import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import router from '../router'; // Ajusta la ruta según tu estructura
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    lastActivity: Date.now(), 
    logoutTimer: null,
  }),

  actions: {
    async login({ email, password }) {
      try {
        const response = await fetch('https://dotenv.ddns.net:5000/api/usuarios/login', {
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

        // Decodificar el token para extraer el nombre y rol
        const decoded = jwtDecode(data.token);
        const user = { Id: decoded.id, name: decoded.nombre, role: decoded.rol, id: decoded.id, email:decoded.email, niv_apr_gas: data.usuario.niv_apr_gas , equipos: data.usuario.equipos, departamento: data.usuario.departamento }; // <-- Se añade aquí
        localStorage.setItem('currentUser', JSON.stringify(user));

        return { success: true, user };
      } catch (error) {
        return { success: false };
      }
    },

    logout() {
      this.token = null;
      localStorage.removeItem('token');
      clearTimeout(this.logoutTimer);

      router.push('/login').then(() => {
        window.location.reload(); // Recargar la página para reflejar el cambio de estado
      });
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
        let sessionExtended = false;
        Swal.fire({
          title: 'Inactividad detectada',
          html: `
            <div class="session-timeout-alert">
              <p>Su sesión se cerrará en <b id="seconds">30</b> segundos por inactividad.</p>
              <div class="progress-container">
                <div id="progress-bar" class="progress-bar"></div>
              </div>
              <button id="extendBtn" class="extend-session-btn">Extender sesión</button>
            </div>
          `,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            popup: 'session-timeout-popup'
          },
          didOpen: () => {
            // Añadir estilos personalizados
            const style = document.createElement('style');
            style.innerHTML = `
              .session-timeout-popup { max-width: 400px; }
              .session-timeout-alert { text-align: center; }
              .extend-session-btn {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 15px;
                font-weight: bold;
                transition: background-color 0.3s;
              }
              .extend-session-btn:hover { background-color: #45a049; }
              .progress-container {
                width: 100%;
                height: 8px;
                background-color: #f1f1f1;
                border-radius: 4px;
                margin: 15px 0;
              }
              .progress-bar {
                height: 100%;
                background-color: #ff9800;
                border-radius: 4px;
                width: 100%;
                transition: width 1s linear;
              }
            `;
            document.head.appendChild(style);
            
            // Configuración del temporizador y barra de progreso
            let timeLeft = 30; // Aumentado a 30 segundos para dar más tiempo al usuario
            const totalTime = timeLeft;
            const progressBar = Swal.getHtmlContainer().querySelector('#progress-bar');
            
            const interval = setInterval(() => {
              timeLeft--;
              const percentage = (timeLeft / totalTime) * 100;
              
              // Actualizar texto y barra de progreso
              const secondsElement = Swal.getHtmlContainer().querySelector('#seconds');
              if (secondsElement) {
                secondsElement.textContent = timeLeft;
              }
              
              if (progressBar) {
                progressBar.style.width = `${percentage}%`;
                // Cambiar color según el tiempo restante
                if (percentage < 30) {
                  progressBar.style.backgroundColor = '#f44336'; // Rojo cuando queda poco tiempo
                } else if (percentage < 70) {
                  progressBar.style.backgroundColor = '#ff9800'; // Naranja en tiempo medio
                }
              }
              
              if (timeLeft <= 0) {
                clearInterval(interval);
                Swal.close();
              }
            }, 1000);
            
            // Configurar el botón de extensión
            const extendBtn = Swal.getPopup().querySelector('#extendBtn');
            extendBtn.addEventListener('click', () => {
              clearInterval(interval);
              sessionExtended = true;
              Swal.close();
              this.resetActivityTimer();
            });
            
            // Añadir soporte para tecla Enter para extender la sesión
            window.addEventListener('keydown', function(e) {
              if (e.key === 'Enter') {
                extendBtn.click();
              }
            });
          }
        }).then(() => {
          // Solo se cierra la sesión si no se extendió la sesión
          if (!sessionExtended && this.token) {
            this.logout();
          }
        });
      }, 5 * 60 * 1000); // Aumentado a 5 minutos de inactividad
    },

    resetActivityTimer() {
      this.lastActivity = Date.now();
      this.startAutoLogout();
    },
  },
});
