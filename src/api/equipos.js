import api from "./axios";

export const getEquipos = async () => {
  const response = await api.get("/equipos/");

  return response.data;

};

export const createEquipo = async (data) => {
  const response = await api.post("/equipos/", data);
  return response.data;
};


export const updateEquipo = async (id, data) => {
  const formData = new FormData();
  // Recorremos cada propiedad de 'data' y la agregamos a FormData.
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  // Realizamos la solicitud PUT con el FormData.
  const response = await api.put(`/equipos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

