import axios from "axios";

const API_URL = "http://localhost:5000/api/webpages";


export const getAllWebPages = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo páginas web:", error);
    throw error;
  }
};
export const getWebPagesByCityActividad = async (ciudad, actividad) => {
    try {
        let url = `http://localhost:5000/api/webpages/ciudad/${encodeURIComponent(ciudad)}`;

        if (actividad) {
            url += `/actividad/${encodeURIComponent(actividad)}`;
        }

        const response = await axios.get(url);
        
        // Si la respuesta está vacía, devolvemos un array vacío
        return response.data.length > 0 ? response.data : [];

    } catch (error) {
        console.error("Error obteniendo páginas web por ciudad y actividad:", error);

        // 🔹 En vez de lanzar el error, devolvemos un array vacío
        return [];
    }
};
