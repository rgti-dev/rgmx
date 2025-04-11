import api from "./axios";

// Obtener todas las tareas (incluyendo sus subtareas y datos de createdBy y updatedBy)
export const getTasks = async () => {
  const response = await api.get("/tasksOT/");
  return response.data;
};

// Obtener una tarea por ID (incluyendo sus relaciones)
export const getTask = async (id) => {
  const response = await api.get(`/tasksOT/${id}`);
  return response.data;
};


// Crear una nueva tarea
export const createTask = async (data) => {
  // Se espera que 'data' incluya, por ejemplo, createdById, name, description, etc.
  const response = await api.post("/tasksOT/", data);
  return response.data;
};

// Actualizar una tarea existente
export const updateTask = async (id, data) => {
  // Se espera que 'data' incluya, por ejemplo, updatedById, name, description, etc.
  const response = await api.put(`/tasksOT/${id}`, data);
  return response.data;
};

// Eliminar una tarea
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasksOT/${id}`);
  return response.data;
};

export function updateSubtaskStatus({ id, status }) {
  return axios.patch(`${API_BASE_URL}/subtasks/${id}`, { status });
}