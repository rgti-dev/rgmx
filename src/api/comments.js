import api from "./axios";

// Obtener todos los comentarios (opcionalmente filtrados por taskId vía query)
export const getComments = async (params) => {
  const response = await api.get("/comments/", { params });
  return response.data;
};

// Obtener un comentario por ID
export const getComment = async (id) => {
  const response = await api.get(`/comments/${id}`);
  return response.data;
};

// Crear un comentario
export const createComment = async (data) => {
  // Se espera que 'data' incluya, por ejemplo, content, taskId, createdBy, etc.
  const response = await api.post("/comments/", data);
  return response.data;
};

// Actualizar un comentario existente
export const updateComment = async (id, data) => {
  // Se espera que 'data' incluya el campo a actualizar, por ejemplo, content
  const response = await api.put(`/comments/${id}`, data);
  return response.data;
};

// Eliminar un comentario
export const deleteComment = async (id) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};