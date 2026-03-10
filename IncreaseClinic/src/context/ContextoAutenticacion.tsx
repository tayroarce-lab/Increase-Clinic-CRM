/**
 * ContextoAutenticacion.jsx - Contexto global para gestión de autenticación.
 * Provee el estado del usuario actual, funciones de login/registro/cerrarSesion,
 * y persiste la sesión en localStorage para mantenerla entre recargas.
 */

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import ServicioUsuarios from "../services/ServicioUsuarios";

export interface Usuario {
  id?: string;
  nombreUsuario: string;
  contrasena: string;
  nombreCompleto: string;
  correo: string;
  rol: "admin" | "cliente";
}

/** Estructura del valor del contexto */
interface ContextoAutenticacionTipo {
  usuario: Usuario | null;
  cargando: boolean;
  login: (correo: string, contrasena: string) => Promise<Usuario>;
  registro: (datosRegistro: Omit<Usuario, "rol">) => Promise<Usuario>;
  cerrarSesion: () => void;
}

/** Contexto de autenticación (valor inicial: null) */
const ContextoAutenticacion = createContext<ContextoAutenticacionTipo | null>(null);

/**
 * ProveedorAutenticacion - Componente proveedor que envuelve la aplicación
 * y expone el estado y métodos de autenticación a todos sus hijos.
 */
function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  /** Usuario autenticado o null si no hay sesión */
  const [usuario, setUsuario] = useState<Usuario | null>(null);
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
   */
  async function login(correo: string, contrasena: string): Promise<Usuario> {
    const usuarios = await ServicioUsuarios.getUser();
    const datosUsuario = usuarios.find((u: Usuario) => u.correo === correo && u.contrasena === contrasena);
    if (!datosUsuario) throw new Error("Credenciales incorrectas");
    setUsuario(datosUsuario);
    localStorage.setItem("usuarioIncreaseClinic", JSON.stringify(datosUsuario));
    return datosUsuario;
  }

  /**
   * Registra un nuevo usuario e inicia sesión automáticamente.
   */
  async function registro(datosRegistro: Omit<Usuario, "rol">): Promise<Usuario> {
    const usuarios = await ServicioUsuarios.getUser();
    if (usuarios.some((u: Usuario) => u.nombreUsuario === datosRegistro.nombreUsuario)) {
      throw new Error("El nombre de usuario ya existe");
    }
    if (usuarios.some((u: Usuario) => u.correo === datosRegistro.correo)) {
      throw new Error("Este correo electrónico ya está registrado");
    }
    const nuevoUsuario = await ServicioUsuarios.postUser({ ...datosRegistro, rol: "cliente" } as Usuario);
    if (!nuevoUsuario) throw new Error("Error al crear el usuario");
    
    setUsuario(nuevoUsuario);
    localStorage.setItem("usuarioIncreaseClinic", JSON.stringify(nuevoUsuario));
    return nuevoUsuario;
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem("usuarioIncreaseClinic");
  }

  /** Valor expuesto a todos los consumidores del contexto */
  const valorContexto: ContextoAutenticacionTipo = {
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
 */
function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error("useAutenticacion debe usarse dentro de ProveedorAutenticacion");
  }
  return contexto;
}

export { ProveedorAutenticacion, useAutenticacion };

