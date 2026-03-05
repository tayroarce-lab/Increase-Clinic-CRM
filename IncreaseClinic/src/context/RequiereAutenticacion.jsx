/**
 * RequiereAutenticacion.jsx - Componente de ruta protegida.
 * Verifica que el usuario esté autenticado antes de renderizar
 * el contenido protegido. Si no hay sesión, redirige a /login.
 */

import { Navigate } from "react-router-dom";
import { useAutenticacion } from "./ContextoAutenticacion";

/**
 * Envuelve rutas que requieren que el usuario haya iniciado sesión.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a renderizar si hay sesión activa.
 * @returns {React.ReactNode} Los children si está autenticado, o redirect a /login.
 */
function RequiereAutenticacion({ children }) {
  const { usuario, cargando } = useAutenticacion();

  // Mientras se verifica la sesión, mostrar indicador de carga
  if (cargando) {
    return <div className="indicadorCarga">Cargando...</div>;
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar el contenido protegido
  return children;
}

export default RequiereAutenticacion;
