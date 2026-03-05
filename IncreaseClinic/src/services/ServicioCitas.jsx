/**
 * ServicioCitas.jsx - Servicio para operaciones CRUD de citas médicas.
 * Todas las funciones se comunican con el endpoint /citas del json-server.
 */

import { URL_BASE, manejarRespuesta } from "./api";

/**
 * Obtiene todas las citas asociadas a un usuario específico.
 * @param {string} idUsuario - El ID del usuario (siempre como string).
 * @returns {Promise<Array>} Lista de citas del usuario.
 */
async function obtenerCitasPorUsuario(idUsuario) {
  try {
    // Obtenemos todas las citas y filtramos en el cliente para evitar
    // inconsistencias con el filtrado automático de json-server y tipos (string vs number)
    const respuesta = await fetch(`${URL_BASE}/citas`);
    const todasLasCitas = await manejarRespuesta(respuesta);
    
    // El ID del usuario se compara como string para máxima seguridad
    const idABuscar = String(idUsuario);
    return todasLasCitas.filter(cita => String(cita.idUsuario) === idABuscar);
  } catch (error) {
    console.error("Error al obtener citas del usuario:", error);
    throw error;
  }
}

/**
 * Obtiene todas las citas sin filtro (usado por el panel de administrador).
 * @returns {Promise<Array>} Lista completa de todas las citas.
 */
async function obtenerTodasLasCitas() {
  try {
    const respuesta = await fetch(`${URL_BASE}/citas`);
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al obtener todas las citas:", error);
    throw error;
  }
}

/**
 * Crea una nueva cita en el servidor.
 * @param {Object} datosCita - Objeto con los datos de la cita (idUsuario, fecha, hora, motivo, estado).
 * @returns {Promise<Object>} La cita creada con su ID asignado.
 */
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

/**
 * Elimina una cita del servidor por su ID.
 * @param {string} idCita - El ID de la cita a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
async function eliminarCita(idCita) {
  try {
    const respuesta = await fetch(`${URL_BASE}/citas/${idCita}`, {
      method: "DELETE",
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    throw error;
  }
}

/**
 * Actualiza una cita existente con nuevos datos (p.ej. cambiar el estado).
 * @param {string} idCita - El ID de la cita a actualizar.
 * @param {Object} datosActualizados - Los nuevos datos de la cita.
 * @returns {Promise<Object>} La cita actualizada.
 */
async function actualizarCita(idCita, datosActualizados) {
  try {
    const respuesta = await fetch(`${URL_BASE}/citas/${idCita}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosActualizados),
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    throw error;
  }
}

export {
  obtenerCitasPorUsuario,
  obtenerTodasLasCitas,
  crearCita,
  actualizarCita,
  eliminarCita,
};
