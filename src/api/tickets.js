import axios from "./axios";

const ENDPOINT = "/tickets";

export const getTickets = async () => {
  try {
    const response = await axios.get(ENDPOINT);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    // ticketData debe incluir: { equipoId?, usuarioId, titulo, descripcion, prioridad }
    const response = await axios.post(ENDPOINT, ticketData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTicket = async (id, updateData) => {
  try {
    // updateData puede incluir por ejemplo: { estado }
    const response = await axios.put(`${ENDPOINT}/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (id) => {
  try {
    const response = await axios.delete(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};