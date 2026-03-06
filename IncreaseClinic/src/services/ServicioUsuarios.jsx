/**
 * ServicioUsuarios.jsx - Servicio para operaciones de usuarios y autenticación.
 * Maneja el inicio de sesión, registro y obtención de usuarios
 * contra el endpoint /usuarios del json-server.
 */

import { URL_BASE, manejarRespuesta } from "./api";

/**
 * Obtiene la lista completa de usuarios registrados.
 * @returns {Promise<Array>} Lista de objetos usuario.
 */
async function obtenerUsuarios() {
  try {
    const respuesta = await fetch(`${URL_BASE}/usuarios`);
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
}

/**
 * Autentica a un usuario buscando por correo y contraseña.
 * @param {string} correo - El correo electrónico del usuario.
 * @param {string} contrasena - La contraseña del usuario.
 * @returns {Promise<Object>} Los datos del usuario autenticado.
 * @throws {Error} Si las credenciales no coinciden con ningún usuario.
 */
async function iniciarSesion(correo, contrasena) {
  try {
    const correoCodificado = encodeURIComponent(correo);
    const contrasenaCodificada = encodeURIComponent(contrasena);
    const respuesta = await fetch(
      `${URL_BASE}/usuarios?correo=${correoCodificado}&contrasena=${contrasenaCodificada}`
    );
    const usuariosEncontrados = await manejarRespuesta(respuesta);

    // Si no se encontró ningún usuario con esas credenciales
    if (usuariosEncontrados.length === 0) {
      throw new Error("Credenciales incorrectas");
    }

    // Retornamos el primer (y único) resultado
    return usuariosEncontrados[0];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}

/**
 * Registra un nuevo usuario en el sistema.
 * Antes de crear, verifica que no exista un usuario con el mismo nombre o correo.
 * @param {Object} datosUsuario - Datos del nuevo usuario (nombreUsuario, contrasena, nombreCompleto, correo).
 * @returns {Promise<Object>} El usuario creado con su ID asignado.
 * @throws {Error} Si el nombre de usuario o correo ya existen.
 */
async function registrarUsuario(datosUsuario) {
  try {
    // Verificar si el nombre de usuario ya está en uso
    const nombreUsuarioCodificado = encodeURIComponent(datosUsuario.nombreUsuario);
    const respuestaNombreUsuario = await fetch(
      `${URL_BASE}/usuarios?nombreUsuario=${nombreUsuarioCodificado}`
    );
    const usuariosConMismoNombre = await manejarRespuesta(respuestaNombreUsuario);

    if (usuariosConMismoNombre.length > 0) {
      throw new Error("El nombre de usuario ya existe");
    }

    // Verificar si el correo electrónico ya está registrado
    const correoCodificado = encodeURIComponent(datosUsuario.correo);
    const respuestaCorreo = await fetch(`${URL_BASE}/usuarios?correo=${correoCodificado}`);
    const usuariosConMismoCorreo = await manejarRespuesta(respuestaCorreo);

    if (usuariosConMismoCorreo.length > 0) {
      throw new Error("Este correo electrónico ya está registrado");
    }

    // Si no hay duplicados, crear el nuevo usuario con rol "cliente" por defecto
    const respuestaCreacion = await fetch(`${URL_BASE}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...datosUsuario, rol: "cliente" }),
    });

    return await manejarRespuesta(respuestaCreacion);
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
}

/**
 * Crea un nuevo usuario con rol de administrador.
 * @param {Object} datosAdmin - Datos del nuevo administrador.
 * @returns {Promise<Object>} El usuario creado.
 */
async function crearUsuarioAdmin(datosAdmin) {
  try {
    // Reutilizamos la lógica de validación (podría refactorizarse, pero por ahora duplicamos para simplicidad)
    const nombreUsuarioCodificado = encodeURIComponent(datosAdmin.nombreUsuario);
    const resNombre = await fetch(`${URL_BASE}/usuarios?nombreUsuario=${nombreUsuarioCodificado}`);
    const existeNombre = await manejarRespuesta(resNombre);
    if (existeNombre.length > 0) throw new Error("El nombre de usuario ya existe");

    const correoCodificado = encodeURIComponent(datosAdmin.correo);
    const resCorreo = await fetch(`${URL_BASE}/usuarios?correo=${correoCodificado}`);
    const existeCorreo = await manejarRespuesta(resCorreo);
    if (existeCorreo.length > 0) throw new Error("Este correo ya está registrado");

    const respuesta = await fetch(`${URL_BASE}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...datosAdmin, rol: "admin" }),
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al crear administrador:", error);
    throw error;
  }
}

/**
 * Elimina un usuario por su ID.
 * @param {string} idUsuario - El ID del usuario a eliminar.
 */
async function eliminarUsuario(idUsuario) {
  try {
    const respuesta = await fetch(`${URL_BASE}/usuarios/${idUsuario}`, {
      method: "DELETE",
    });
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
}

export { obtenerUsuarios, iniciarSesion, registrarUsuario, crearUsuarioAdmin, eliminarUsuario };
