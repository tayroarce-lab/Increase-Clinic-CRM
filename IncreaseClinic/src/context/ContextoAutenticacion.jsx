import { createContext, useState, useContext, useEffect } from "react";
import { iniciarSesion, registrarUsuario } from "../services/ServicioUsuarios";

const ContextoAutenticacion = createContext(null);

function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioIncreaseClinic");
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error("Error al recuperar sesión:", error);
        localStorage.removeItem("usuarioIncreaseClinic");
      }
    }
    setCargando(false);
  }, []);

  async function login(nombreUsuario, contrasena) {
    const datosUsuario = await iniciarSesion(nombreUsuario, contrasena);
    setUsuario(datosUsuario);
    localStorage.setItem("usuarioIncreaseClinic", JSON.stringify(datosUsuario));
    return datosUsuario;
  }

  async function registro(datosRegistro) {
    const nuevoUsuario = await registrarUsuario(datosRegistro);
    setUsuario(nuevoUsuario);
    localStorage.setItem("usuarioIncreaseClinic", JSON.stringify(nuevoUsuario));
    return nuevoUsuario;
  }

  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem("usuarioIncreaseClinic");
  }

  const valor = {
    usuario,
    cargando,
    login,
    registro,
    cerrarSesion,
  };

  return (
    <ContextoAutenticacion.Provider value={valor}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error("useAutenticacion debe usarse dentro de ProveedorAutenticacion");
  }
  return contexto;
}

export { ProveedorAutenticacion, useAutenticacion };
