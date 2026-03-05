import { Navigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import Registro from "../components/Registro";

export default function PaginaRegistro() {
  const { usuario } = useAutenticacion();

  if (usuario) {
    return <Navigate to="/" replace />;
  }

  return <Registro />;
}
