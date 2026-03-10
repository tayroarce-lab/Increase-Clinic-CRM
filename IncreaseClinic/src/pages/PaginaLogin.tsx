/**
 * PaginaLogin.jsx - Página de inicio de sesión.
 * Redirige al home si el usuario ya tiene sesión activa.
 * De lo contrario, renderiza el componente Login.
 */

import { Navigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import Login from "../components/user/Login";

export default function PaginaLogin() {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return <div className="indicadorCarga">Cargando...</div>;
  }

  // Si ya inició sesión, redirigir al inicio
  if (usuario) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}
