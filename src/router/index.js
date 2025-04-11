import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Dashboard from '../pages/Dashboard.vue';
import Equipos from '../pages/TI/Equipos.vue';
import Tickets from '../pages/TI/Tickets.vue';
import Mantenimientos from '@/pages/TI/Mantenimientos.vue';
import Usuarios from '@/pages/TI/Usuarios.vue';
import UploadModel from '../pages/OT/UploadModel.vue';
import ActividadesOT from '../pages/OT/ActividadesOT.vue';
import ActividadesOTFeatures from '../pages/OT/ActividadesOT2.vue';
import Detalles from '@/pages/Logistica/PDetalles.vue';
import DashboardF from '../pages/Finanzas/Dashboard.vue';
import SolicitudesF from '../pages/Finanzas/Solicitudes.vue';
import AprobacionesF from '../pages/Finanzas/Aprobaciones.vue';
import ComprobacionesF from '../pages/Finanzas/Comprobaciones.vue';
import DashboardOT from '../pages/OT/Dashboard.vue'; // Importa el componente de DashboardOT si es necesario
import Activades from '@/pages/TI/Actividades.vue';
import { useAuthStore } from '../store/auth';
import SupportTickets from '../pages/Support/SupportTickets.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/support',
    component: SupportTickets,
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
  },
  {
    path: '/design/tasksOT',
    component: ActividadesOT,
    meta: { requiresAuth: true }
  },
  {
    path: '/design/dashboard',
    component: DashboardOT,
    meta: { requiresAuth: true }
  },
  {
    path: '/design/tasksOTFeatures',
    component: ActividadesOTFeatures,
    meta: { requiresAuth: false }
  },
  {
    path: '/logistica/detalles',
    component: Detalles,
    meta: { requiresAuth: true }
  },
  {
    path: '/finanzas/dashboard',
    component: DashboardF,
    meta: { requiresAuth: true }
  },
  {
    path: '/finanzas/solicitudes',
    component: SolicitudesF,
    meta: { requiresAuth: true }
  },
  {
    path: '/finanzas/aprobaciones',
    component: AprobacionesF,
    meta: { requiresAuth: true }
  },
  {
    path: '/finanzas/comprobaciones',
    component: ComprobacionesF, 
    meta: { requiresAuth: true }
  },
  {
    path: '/actividades',
    component: Activades,
    meta: { requiresAuth: true }
  },
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
