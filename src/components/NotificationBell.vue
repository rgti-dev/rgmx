<template>
  <div class="relative">
    <!-- Botón de la campana con contador -->
    <button @click="toggleNotifications" class="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors flex items-center shadow-sm relative">
      <span class="material-icons text-blue-500">notifications</span>
      <span v-if="todayUnreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {{ todayUnreadCount }}
      </span>
    </button>

    <!-- Panel de notificaciones -->
    <div v-if="showNotifications" class="absolute z-30 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 right-0 w-96">
      <!-- Encabezado con filtros -->
      <div class="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 class="font-semibold text-gray-700">Notificaciones</h3>
        <div class="flex items-center gap-2">
          <select v-model="currentFilter" class="text-xs border border-gray-200 rounded px-2 py-1">
            <option value="all">Todas</option>
            <option value="unread">No leídas</option>
            <option value="project">Proyectos</option>
            <option value="subtask">Subtareas</option>
          </select>
          <button @click="markAllAsRead" class="text-xs text-blue-500 hover:text-blue-600 flex items-center">
            <span class="material-icons text-sm mr-1">done_all</span>
            Marcar todo
          </button>
        </div>
      </div>

      <!-- Contenido de notificaciones -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Notificaciones de hoy -->
        <div v-if="filteredNotifications.today.length > 0" class="notification-group">
          <div class="bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500 sticky top-0 z-10 border-b border-gray-200">
            Hoy
          </div>
          <div v-for="notification in filteredNotifications.today" :key="notification.compositeId" 
               :class="['p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors', 
                        !notification.isRead ? 'bg-blue-50' : '']">
            <div class="flex items-start gap-3" @click="readNotification(notification)">
              <div :class="['notification-icon', getNotificationColorClass(notification)]">
                <span class="material-icons text-white">{{ getNotificationIcon(notification) }}</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <p class="text-sm font-medium text-gray-800">{{ getNotificationTitle(notification) }}</p>
                  <span class="text-xs text-gray-400">{{ formatTime(notification.scheduledAt) }}</span>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ notification.message }}</p>
                <div class="hidden mt-2 gap-2">
                  <!-- Botón "Ver" eliminado -->
                  <button v-if="!notification.isRead" @click.stop="readNotification(notification)" 
                    class="text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 flex items-center">
                    <span class="material-icons text-xs mr-1">check</span>
                    Marcar leído
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notificaciones de ayer -->
        <div v-if="filteredNotifications.yesterday.length > 0" class="notification-group">
          <div class="bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500 sticky top-0 z-10 border-b border-gray-200">
            Ayer
          </div>
          <div v-for="notification in filteredNotifications.yesterday" :key="notification.compositeId" 
               :class="['p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors', 
                        !notification.isRead ? 'bg-blue-50' : '']">
            <div class="flex items-start gap-3" @click="readNotification(notification)">
              <div :class="['notification-icon', getNotificationColorClass(notification)]">
                <span class="material-icons text-white">{{ getNotificationIcon(notification) }}</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <p class="text-sm font-medium text-gray-800">{{ getNotificationTitle(notification) }}</p>
                  <span class="text-xs text-gray-400">{{ formatTime(notification.scheduledAt) }}</span>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ notification.message }}</p>
                <div class="flex mt-2 gap-2">
                  <!-- Botón "Ver" eliminado -->
                  <button v-if="!notification.isRead" @click.stop="readNotification(notification)" 
                    class="text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 flex items-center">
                    <span class="material-icons text-xs mr-1">check</span>
                    Marcar leído
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notificaciones anteriores -->
        <div v-if="filteredNotifications.older.length > 0" class="notification-group">
          <div class="bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500 sticky top-0 z-10 border-b border-gray-200">
            Anteriores
          </div>
          <div v-for="notification in filteredNotifications.older" :key="notification.compositeId" 
               :class="['p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors', 
                        !notification.isRead ? 'bg-blue-50' : '']">
            <div class="flex items-start gap-3" @click="readNotification(notification)">
              <div :class="['notification-icon', getNotificationColorClass(notification)]">
                <span class="material-icons text-white">{{ getNotificationIcon(notification) }}</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <p class="text-sm font-medium text-gray-800">{{ getNotificationTitle(notification) }}</p>
                  <span class="text-xs text-gray-400">{{ formatTime(notification.scheduledAt) }}</span>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ notification.message }}</p>
                <div class="flex mt-2 gap-2">
                  <!-- Botón "Ver" eliminado -->
                  <button v-if="!notification.isRead" @click.stop="readNotification(notification)" 
                    class="text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 flex items-center">
                    <span class="material-icons text-xs mr-1">check</span>
                    Marcar leído
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay notificaciones -->
        <div v-if="!hasNotifications" class="flex flex-col items-center justify-center py-10 px-4">
          <span class="material-icons text-gray-300 text-5xl mb-2">notifications_off</span>
          <p class="text-gray-500 text-sm">No hay notificaciones disponibles</p>
          <p class="text-gray-400 text-xs mt-1">Las notificaciones aparecerán aquí cuando estén disponibles</p>
        </div>
      </div>

      <!-- Pie del panel -->
      <div class="p-2 border-t border-gray-200 bg-gray-50 text-center">
        <button @click="fetchNotifications" class="text-xs text-blue-500 hover:text-blue-600 flex items-center justify-center w-full">
          <span class="material-icons text-sm mr-1">refresh</span>
          Actualizar notificaciones
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotifications, updateNotification } from '@/api/notification';

export default {
  name: 'NotificationBell',
  data() {
    return {
      showNotifications: false,
      notifications: [],
      currentFilter: 'all'
    }
  },
  computed: {
    unreadCount() {
      const uniqueNotifications = this.getUniqueNotifications();
      return uniqueNotifications.filter(n => !n.isRead).length;
    },
    todayUnreadCount() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const uniqueNotifications = this.getUniqueNotifications();
      return uniqueNotifications.filter(n => {
        const notifDate = new Date(n.scheduledAt);
        notifDate.setHours(0, 0, 0, 0);
        return notifDate.getTime() === today.getTime() && !n.isRead;
      }).length;
    },
    hasNotifications() {
      return this.filteredNotifications.today.length > 0 ||
             this.filteredNotifications.yesterday.length > 0 ||
             this.filteredNotifications.older.length > 0;
    },
    filteredNotifications() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const uniqueNotifications = this.getUniqueNotifications();
      
      let filtered = [...uniqueNotifications];
      if (this.currentFilter === 'unread') {
        filtered = filtered.filter(n => !n.isRead);
      } else if (this.currentFilter !== 'all') {
        filtered = filtered.filter(n => n.alertType && n.alertType.toLowerCase().includes(this.currentFilter));
      }
      
      return {
        today: filtered.filter(n => {
          const notifDate = new Date(n.scheduledAt);
          notifDate.setHours(0, 0, 0, 0);
          return notifDate.getTime() === today.getTime();
        }),
        yesterday: filtered.filter(n => {
          const notifDate = new Date(n.scheduledAt);
          notifDate.setHours(0, 0, 0, 0);
          return notifDate.getTime() === yesterday.getTime();
        }),
        older: filtered.filter(n => {
          const notifDate = new Date(n.scheduledAt);
          notifDate.setHours(0, 0, 0, 0);
          return notifDate.getTime() < yesterday.getTime();
        })
      };
    }
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    getUniqueNotifications() {
      // Genera un identificador único combinando taskOTId y subtaskId (o 'project' si no tiene subtaskId)
      const uniqueMap = {};
      return this.notifications.map(notification => {
        const compositeId = notification.id || `${notification.taskOTId}-${notification.subtaskId || 'project'}`;
        notification.compositeId = compositeId;
        return notification;
      }).filter(n => {
        if (uniqueMap[n.compositeId]) {
          return false;
        }
        uniqueMap[n.compositeId] = true;
        return true;
      });
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.fetchNotifications();
      }
    },
    async fetchNotifications() {
      try {
        const res = await getNotifications();
        this.notifications = res.data;
      } catch (error) {
        console.error("Error al obtener notificaciones:", error.response?.data || error.message);
      }
    },
    async readNotification(notification) {
      if (!notification.isRead) {
        notification.isRead = true;
        try {
          // Usamos compositeId para identificar de manera única la notificación
          await updateNotification(notification.compositeId, {
            isRead: true,
            readAt: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error al marcar como leída:", error.response?.data || error.message);
        }
      }
    },
    async markAllAsRead() {
      const uniqueNotifications = this.getUniqueNotifications();
      for (const notif of uniqueNotifications) {
        if (!notif.isRead) {
          notif.isRead = true;
          try {
            await updateNotification(notif.compositeId, {
              isRead: true,
              readAt: new Date().toISOString()
            });
          } catch (error) {
            console.error("Error al marcar la notificación como leída:", error.response?.data || error.message);
          }
        }
      }
    },
    formatTime(time) {
      const now = new Date();
      const notifDate = new Date(time);
      const diff = now - notifDate;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
      if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
      if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
      return 'Ahora';
    },
    getNotificationIcon(notification) {
      const type = notification.alertType ? notification.alertType.toLowerCase() : '';
      
      if (type.includes('project')) return 'assignment';
      if (type.includes('subtask')) return 'task_alt';
      if (type.includes('comment')) return 'chat';
      if (type.includes('deadline')) return 'event';
      if (type.includes('alert')) return 'warning';
      
      return 'notifications';
    },
    getNotificationColorClass(notification) {
      const type = notification.alertType ? notification.alertType.toLowerCase() : '';
      
      if (type.includes('project')) return 'bg-blue-500';
      if (type.includes('subtask')) return 'bg-green-500';
      if (type.includes('comment')) return 'bg-purple-500';
      if (type.includes('deadline')) return 'bg-orange-500';
      if (type.includes('alert')) return 'bg-red-500';
      
      return 'bg-gray-500';
    },
    getNotificationTitle(notification) {
      const type = notification.alertType ? notification.alertType : 'Notificación';
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    },
    viewRelatedItem(notification) {
      if (notification.taskOTId) {
        this.$router.push(`/gantt-ot/${notification.taskOTId}`);
      } else {
        console.log('No hay elemento relacionado para esta notificación');
      }
    }
  }
}
</script>

<style scoped>
.notification-icon {
  width: 2rem; /* Replace @apply w-8 */
  height: 2rem; /* Replace @apply h-8 */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon .material-icons {
  font-size: 16px;
}

.notification-group:not(:first-child) .sticky {
  top: 0;
}
</style>