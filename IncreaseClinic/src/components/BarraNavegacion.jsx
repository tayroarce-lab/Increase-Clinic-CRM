/**
 * BarraNavegacion.jsx - Barra de navegación principal de la aplicación.
 * Muestra enlaces contextuales según el estado de autenticación y el rol del usuario:
 *  - Sin sesión: "Iniciar Sesión" y "Registrarse"
 *  - Admin: "Panel Admin"
 *  - Cliente: "Mi Perfil" y "Mis Citas"
 * Incluye botón de cierre de sesión con confirmación vía SweetAlert2.
 */

import { Link, useNavigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import { HeartPulse, LogIn, UserPlus, LayoutDashboard, User, CalendarDays, LogOut } from "lucide-react";
import Swal from "sweetalert2";

function BarraNavegacion() {
  const { usuario, cerrarSesion } = useAutenticacion();
  const navegar = useNavigate();

  /**
   * Solicita confirmación al usuario antes de cerrar sesión.
   * Si confirma, limpia la sesión y redirige al login.
   */
  async function manejarCerrarSesion() {
    const resultado = await Swal.fire({
      icon: "question",
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir?",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;

    cerrarSesion();
    navegar("/login");

    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "Has cerrado sesión correctamente",
      timer: 1200,
      showConfirmButton: false,
    });
  }

  return (
    <nav id="barraNavegacion" className="barraNavegacion">
      {/* Logo de la aplicación con icono profesional */}
      <div className="barraNavegacion__logo">
        <Link to="/">
          <HeartPulse size={22} strokeWidth={2.5} />
          <span>IncreaseClinic</span>
        </Link>
      </div>

      {/* Enlaces de navegación */}
      <div className="barraNavegacion__enlaces">
        {/* Enlaces para usuario NO autenticado */}
        {!usuario && (
          <>
            <Link to="/login" className="barraNavegacion__enlace">
              <LogIn size={16} />
              <span>Iniciar Sesión</span>
            </Link>
            <Link to="/registro" className="barraNavegacion__enlace barraNavegacion__enlace--resaltado">
              <UserPlus size={16} />
              <span>Registrarse</span>
            </Link>
          </>
        )}

        {/* Enlaces exclusivos para administradores */}
        {usuario && usuario.rol === "admin" && (
          <Link to="/admin" className="barraNavegacion__enlace">
            <LayoutDashboard size={16} />
            <span>Panel Admin</span>
          </Link>
        )}

        {/* Enlaces exclusivos para clientes */}
        {usuario && usuario.rol === "cliente" && (
          <>
            <Link to="/perfil" className="barraNavegacion__enlace">
              <User size={16} />
              <span>Mi Perfil</span>
            </Link>
            <Link to="/citas" className="barraNavegacion__enlace">
              <CalendarDays size={16} />
              <span>Mis Citas</span>
            </Link>
          </>
        )}

        {/* Sección de usuario autenticado: saludo + cerrar sesión */}
        {usuario && (
          <div className="barraNavegacion__usuario">
            <span className="barraNavegacion__nombreUsuario">
              Hola, {usuario.nombreCompleto || usuario.nombreUsuario}
            </span>
            <button
              id="botonCerrarSesion"
              className="barraNavegacion__botonSalir"
              onClick={manejarCerrarSesion}
            >
              <LogOut size={14} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default BarraNavegacion;
