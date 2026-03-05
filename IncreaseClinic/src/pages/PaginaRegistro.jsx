/**
 * PaginaRegistro.jsx - Página de registro de usuario.
 * Redirige al home si el usuario ya tiene sesión activa.
 * De lo contrario, renderiza el componente Registro.
 */

import { Navigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import Registro from "../components/Registro";

export default function PaginaRegistro() {
  const { usuario } = useAutenticacion();

  // Si ya inició sesión, redirigir al inicio
  if (usuario) {
    return <Navigate to="/" replace />;
  }

  return <Registro />;
}
