/**
 * api.jsx - Configuración base de la API.
 * Define la URL del servidor JSON y la función utilitaria
 * para manejar las respuestas HTTP de forma consistente.
 */

/** URL base del servidor json-server */
const URL_BASE = "http://localhost:3001";

/**
 * Procesa la respuesta de una petición fetch.
 * Verifica si la respuesta fue exitosa; si no, lanza un error con el mensaje del servidor.
 * @param {Response} respuesta - El objeto Response devuelto por fetch.
 * @returns {Promise<Object>} Los datos JSON de la respuesta.
 * @throws {Error} Si el código de estado HTTP indica un error.
 */
async function manejarRespuesta(respuesta) {
  if (!respuesta.ok) {
    const textoError = await respuesta.text();
    throw new Error(textoError || `Error HTTP: ${respuesta.status}`);
  }
  return respuesta.json();
}

export { URL_BASE, manejarRespuesta };
