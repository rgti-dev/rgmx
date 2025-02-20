import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Dashboard from '../pages/Dashboard.vue';
import Equipos from '../pages/Equipos.vue';
import Tickets from '../pages/Tickets.vue';
import Mantenimientos from '@/pages/Mantenimientos.vue';
import Usuarios from '@/pages/Usuarios.vue';
import UploadModel from '../pages/UploadModel.vue';
import { useAuthStore } from '../store/auth';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/equipos',
    component: Equipos,
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets',
    component: Tickets,
    meta: { requiresAuth: true }
  },
  {
    path: '/mantenimientos',
    component: Mantenimientos,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    component: Usuarios,
    meta: { requiresAuth: true }
  },
  {
    path: '/design/uploadmodel1',
    component: UploadModel,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// **Protección de Rutas con JWT**
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Verifica si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Si no hay un token o el token está expirado, redirige al login
    if (!auth.isAuthenticated()) {
      return next('/login');
    }
  }

  next();
});

export default router;
