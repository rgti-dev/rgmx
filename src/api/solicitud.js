import api from "./axios";

export const getAllSolicitudes = () => {
    return api.get('/solicitudes');
};

export const getSolicitudById = (id) => {
    return api.get(`/solicitudes/${id}`);
};

export const createSolicitud = (solicitudData) => {
    return api.post('/solicitudes', solicitudData);
};

export const updateSolicitud = (id, solicitudData) => {
    return api.put(`/solicitudes/${id}`, solicitudData);
};

export const deleteSolicitud = (id) => {
    return api.delete(`/solicitudes/${id}`);
};

export const getSolicitudesAprobadoNivel1 = () => {
    return api.get('/solicitudes/aprobadonivel1');
};