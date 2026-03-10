/**
 * RequiereRol.jsx - Componente de ruta protegida por rol.
 * Verifica que el usuario autenticado tenga el rol requerido
 * antes de renderizar el contenido. Si no tiene el rol correcto,
 * redirige al panel correspondiente a su rol real.
 */

import { Navigate } from "react-router-dom";
import { useAutenticacion } from "./ContextoAutenticacion";

/**
 * Envuelve rutas que requieren un rol específico (ej: "admin" o "cliente").
 * @param {Object} props
 * @param {string} props.rol - El rol requerido para acceder a esta ruta.
 * @param {React.ReactNode} props.children - Contenido a renderizar si el rol coincide.
 * @returns {React.ReactNode} Los children si el rol coincide, o redirect al panel correcto.
 */
function RequiereRol({ rol, children }: { rol: "admin" | "cliente", children: React.ReactNode }) {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return <div className="indicadorCarga">Cargando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  if (usuario.rol !== rol) {
    const rutaRedireccion = usuario.rol === "admin" ? "/admin" : "/citas";
    return <Navigate to={rutaRedireccion} replace />;
  }

  return children;
}

export default RequiereRol;
