import { Navigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import Login from "../components/Login";

export default function PaginaLogin() {
  const { usuario } = useAutenticacion();

  if (usuario) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}
