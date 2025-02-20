import api from "./axios";

// Obtener todos los usuarios (solo admin)
export const getUsuarios = async () => {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Obtener el perfil del usuario autenticado
export const getUsuarioAutenticado = async () => {
  try {
    const response = await api.get("/usuarios/perfil");
    return response.data;
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    throw error;
  }
};

// Obtener un usuario por ID (solo admin o el propio usuario)
export const getUsuarioById = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    throw error;
  }
};

// Registrar un nuevo usuario
export const createUsuario = async (usuarioData) => {
  try {
    const response = await api.post("/usuarios/register", usuarioData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw error;
  }
};

// Iniciar sesión
export const loginUsuario = async (credenciales) => {
  try {
    const response = await api.post("/usuarios/login", credenciales);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Eliminar un usuario (solo admin)
export const deleteUsuario = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};