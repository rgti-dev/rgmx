import api from './axios';


/**
 * Obtiene todas las notificaciones.
 */
export function getNotifications() {
    return api.get('/notifications/');
}

/**
 * Obtiene una notificación por id.
 * @param {number|string} id
 */
export function getNotificationById(id) {
    return api.get(`/notifications/${id}`);
}

/**
 * Crea una nueva notificación.
 * @param {Object} payload
 */
export function createNotification(payload) {
    return api.post('/notifications', payload);
}

/**
 * Actualiza una notificación existente.
 * @param {number|string} id
 * @param {Object} payload
 */
export function updateNotification(id, payload) {
    return api.put(`/notifications/${id}`, payload);
}

/**
 * Elimina una notificación.
 * @param {number|string} id
 */
export function deleteNotification(id) {
    return api.delete(`/notifications/${id}`);
}