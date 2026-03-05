const URL_BASE = "http://localhost:3001";

async function manejarRespuesta(respuesta) {
  if (!respuesta.ok) {
    const error = await respuesta.text();
    throw new Error(error || `Error HTTP: ${respuesta.status}`);
  }
  return respuesta.json();
}

export { URL_BASE, manejarRespuesta };
