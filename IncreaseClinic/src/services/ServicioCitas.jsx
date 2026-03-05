import { URL_BASE, manejarRespuesta } from "./api";

async function obtenerCitasPorUsuario(idUsuario) {
  try {
    const respuesta = await fetch(`${URL_BASE}/citas?idUsuario=${idUsuario}`);
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    throw error;
  }
}

async function obtenerTodasLasCitas() {
  try {
    const respuesta = await fetch(`${URL_BASE}/citas`);
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al obtener todas las citas:", error);
    throw error;
  }
}

async function crearCita(datosCita) {
  try {
    const respuesta = await fetch(`${URL_BASE}/citas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosCita),
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al crear cita:", error);
    throw error;
  }
}

async function eliminarCita(id) {
  try {
    const respuesta = await fetch(`${URL_BASE}/citas/${id}`, {
      method: "DELETE",
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    throw error;
  }
}

export { obtenerCitasPorUsuario, obtenerTodasLasCitas, crearCita, eliminarCita };
