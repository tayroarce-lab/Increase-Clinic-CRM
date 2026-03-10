/**
 * ContextoAutenticacion.jsx - Contexto global para gestión de autenticación.
 * Provee el estado del usuario actual, funciones de login/registro/cerrarSesion,
 * y persiste la sesión en localStorage para mantenerla entre recargas.
 */

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import ServicioUsuarios from "../services/ServicioUsuarios";

/** Contexto de autenticación (valor inicial: null) */
const ContextoAutenticacion = createContext<any>(null);

/**
 * ProveedorAutenticacion - Componente proveedor que envuelve la aplicación
 * y expone el estado y métodos de autenticación a todos sus hijos.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto.
 */
function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  /** Usuario autenticado o null si no hay sesión */
  const [usuario, setUsuario] = useState(null);
  /** Indica si se está recuperando la sesión de localStorage */
  const [cargando, setCargando] = useState(true);

  // Al montar, intentar recuperar la sesión guardada en localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioIncreaseClinic");
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (errorParseo) {
        console.error("Error al recuperar sesión:", errorParseo);
        localStorage.removeItem("usuarioIncreaseClinic");
      }
    }
    setCargando(false);
  }, []);

  /**
   * Inicia sesión con las credenciales proporcionadas.
   * Guarda los datos del usuario en el estado y en localStorage.
   * @param {string} correo - Correo electrónico del usuario.
   * @param {string} contrasena - Contraseña del usuario.
   * @returns {Promise<Object>} Los datos del usuario autenticado.
   */
  async function login(correo: string, contrasena: string) {
    const usuarios = await ServicioUsuarios.getUser();
    const datosUsuario = usuarios.find((u: any) => u.correo === correo && u.contrasena === contrasena);
    if (!datosUsuario) throw new Error("Credenciales incorrectas");
    setUsuario(datosUsuario);
    localStorage.setItem("usuarioIncreaseClinic", JSON.stringify(datosUsuario));
    return datosUsuario;
  }

  /**
   * Registra un nuevo usuario e inicia sesión automáticamente.
   * @param {Object} datosRegistro - Datos del nuevo usuario.
   * @returns {Promise<Object>} Los datos del usuario recién creado.
   */
  async function registro(datosRegistro: any) {
    const usuarios = await ServicioUsuarios.getUser();
    if (usuarios.some((u: any) => u.nombreUsuario === datosRegistro.nombreUsuario)) {
      throw new Error("El nombre de usuario ya existe");
    }
    if (usuarios.some((u: any) => u.correo === datosRegistro.correo)) {
      throw new Error("Este correo electrónico ya está registrado");
    }
    const nuevoUsuario = await ServicioUsuarios.postUser({ ...datosRegistro, rol: "cliente" });
    setUsuario(nuevoUsuario);
    localStorage.setItem("usuarioIncreaseClinic", JSON.stringify(nuevoUsuario));
    return nuevoUsuario;
  }

  /**
   * Cierra la sesión del usuario actual.
   * Limpia el estado y remueve los datos de localStorage.
   */
  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem("usuarioIncreaseClinic");
  }

  /** Valor expuesto a todos los consumidores del contexto */
  const valorContexto = {
    usuario,
    cargando,
    login,
    registro,
    cerrarSesion,
  };

  return (
    <ContextoAutenticacion.Provider value={valorContexto}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

/**
 * Hook personalizado para consumir el contexto de autenticación.
 * Debe usarse dentro de un componente envuelto por ProveedorAutenticacion.
 * @returns {Object} El estado y funciones de autenticación.
 * @throws {Error} Si se usa fuera del ProveedorAutenticacion.
 */
function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error("useAutenticacion debe usarse dentro de ProveedorAutenticacion");
  }
  return contexto;
}

export { ProveedorAutenticacion, useAutenticacion };

