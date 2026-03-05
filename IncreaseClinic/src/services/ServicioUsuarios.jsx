import { URL_BASE, manejarRespuesta } from "./api";

async function obtenerUsuarios() {
  try {
    const respuesta = await fetch(`${URL_BASE}/usuarios`);
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
}

async function iniciarSesion(nombreUsuario, contrasena) {
  try {
    const respuesta = await fetch(
      `${URL_BASE}/usuarios?nombreUsuario=${nombreUsuario}&contrasena=${contrasena}`
    );
    const usuarios = await manejarRespuesta(respuesta);

    if (usuarios.length === 0) {
      throw new Error("Credenciales incorrectas");
    }

    return usuarios[0];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}

async function registrarUsuario(datosUsuario) {
  try {
    const usuariosExistentes = await fetch(
      `${URL_BASE}/usuarios?nombreUsuario=${datosUsuario.nombreUsuario}`
    );
    const existentes = await manejarRespuesta(usuariosExistentes);

    if (existentes.length > 0) {
      throw new Error("El nombre de usuario ya existe");
    }

    const respuesta = await fetch(`${URL_BASE}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...datosUsuario, rol: "cliente" }),
    });

    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
}

export { obtenerUsuarios, iniciarSesion, registrarUsuario };
