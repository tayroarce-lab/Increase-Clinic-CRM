import { Navigate } from "react-router-dom";
import { useAutenticacion } from "./ContextoAutenticacion";

function RequiereRol({ rol, children }) {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return <div className="indicadorCarga">Cargando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== rol) {
    const rutaRedireccion = usuario.rol === "admin" ? "/admin" : "/perfil";
    return <Navigate to={rutaRedireccion} replace />;
  }

  return children;
}

export default RequiereRol;
