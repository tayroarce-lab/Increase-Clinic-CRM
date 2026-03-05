import { Navigate } from "react-router-dom";
import { useAutenticacion } from "./ContextoAutenticacion";

function RequiereAutenticacion({ children }) {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return <div className="indicadorCarga">Cargando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequiereAutenticacion;
