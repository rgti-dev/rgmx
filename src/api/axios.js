import axios from "axios";

// Crear una instancia de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://dotenv.ddns.net:5000/api", // Usar la URL de la API desde las variables de entorno o localhost
  headers: {
    "Content-Type": "application/json", // Configurar el tipo de contenido por defecto
  },
});

// Interceptor para incluir el token en las cabeceras de las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtener el token del localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Incluir el token en la cabecera
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores en las respuestas
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, simplemente devolverla
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el error es 401 (No autorizado)
      localStorage.removeItem("token"); // Eliminar el token del localStorage
      console.error("Sesión expirada o no autorizada. Redirigiendo...");
      // Redirigir al usuario a la página de inicio de sesión
      window.location.href = "/login"; // Cambia "/login" por la ruta de tu página de inicio de sesión
    }
    return Promise.reject(error);
  }
);

export default api;