import api from "./axios";

export const getArchivos3D = async () => {
    const response = await api.get("/archivos3d/");
    return response.data;
};

export const createArchivo3D = async (data) => {
    // Debug: Verificar el contenido del FormData recibido
    console.log('Contenido del FormData recibido:');
    for (const pair of data.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await api.post("/archivos3d/", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};


export const updateArchivo3D = async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
    });
    const response = await api.put(`/archivos3d/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteArchivo3D = async (id) => {
    const response = await api.delete(`/archivos3d/${id}`);
    return response.data;
};