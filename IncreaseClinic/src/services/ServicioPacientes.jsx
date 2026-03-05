/**
 * ServicioPacientes.jsx - Servicio para operaciones CRUD de pacientes.
 * Todas las funciones se comunican con el endpoint /pacientes del json-server.
 */

import { URL_BASE, manejarRespuesta } from "./api";

/**
 * Obtiene la lista completa de pacientes registrados en el sistema.
 * @returns {Promise<Array>} Lista de objetos paciente.
 */
async function obtenerPacientes() {
  try {
    const respuesta = await fetch(`${URL_BASE}/pacientes`);
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    throw error;
  }
}

/**
 * Crea un nuevo paciente en el servidor.
 * @param {Object} datosPaciente - Datos del paciente (nombre, edad, telefono, correo, diagnostico).
 * @returns {Promise<Object>} El paciente creado con su ID asignado.
 */
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

/**
 * Actualiza los datos de un paciente existente.
 * @param {string} idPaciente - El ID del paciente a actualizar.
 * @param {Object} datosPaciente - Los nuevos datos del paciente.
 * @returns {Promise<Object>} El paciente actualizado.
 */
async function actualizarPaciente(idPaciente, datosPaciente) {
  try {
    const respuesta = await fetch(`${URL_BASE}/pacientes/${idPaciente}`, {
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

/**
 * Elimina un paciente del servidor por su ID.
 * @param {string} idPaciente - El ID del paciente a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
async function eliminarPaciente(idPaciente) {
  try {
    const respuesta = await fetch(`${URL_BASE}/pacientes/${idPaciente}`, {
      method: "DELETE",
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    throw error;
  }
}

export { obtenerPacientes, crearPaciente, actualizarPaciente, eliminarPaciente };
