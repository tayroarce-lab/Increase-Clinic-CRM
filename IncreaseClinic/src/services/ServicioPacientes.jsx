import { URL_BASE, manejarRespuesta } from "./api";

async function obtenerPacientes() {
  try {
    const respuesta = await fetch(`${URL_BASE}/pacientes`);
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    throw error;
  }
}

async function crearPaciente(datosPaciente) {
  try {
    const respuesta = await fetch(`${URL_BASE}/pacientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosPaciente),
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al crear paciente:", error);
    throw error;
  }
}

async function actualizarPaciente(id, datosPaciente) {
  try {
    const respuesta = await fetch(`${URL_BASE}/pacientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosPaciente),
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    throw error;
  }
}

async function eliminarPaciente(id) {
  try {
    const respuesta = await fetch(`${URL_BASE}/pacientes/${id}`, {
      method: "DELETE",
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    throw error;
  }
}

export { obtenerPacientes, crearPaciente, actualizarPaciente, eliminarPaciente };
