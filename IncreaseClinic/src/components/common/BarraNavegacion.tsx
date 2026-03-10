// La barrita de arriba para moverte por la página.

import { Link, useNavigate } from "react-router-dom";
import { useAutenticacion } from "../../context/ContextoAutenticacion";
import { HeartPulse, LogIn, UserPlus, LayoutDashboard, User, CalendarDays, LogOut } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/BarraNavegacion.css";

function BarraNavegacion() {
  const { usuario, cerrarSesion } = useAutenticacion();
  const navegar = useNavigate();

  // Te saca de tu cuenta cuando presionas el botón.
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
      {/* El nombre y el dibujito de la clínica. */}
      <div className="barraNavegacionLogo">
        <Link to="/">
          <HeartPulse size={22} strokeWidth={2.5} />
          <span>IncreaseClinic</span>
        </Link>
      </div>

      {/* Botones para ir a otros lados. */}
      <div className="barraNavegacionEnlaces">
        {/* Botones para los que no han entrado. */}
        {!usuario && (
          <>
            <Link to="/login" className="barraNavegacionEnlace">
              <LogIn size={16} />
              <span>Iniciar Sesión</span>
            </Link>
            <Link to="/registro" className="barraNavegacionEnlace barraNavegacionEnlaceResaltado">
              <UserPlus size={16} />
              <span>Registrarse</span>
            </Link>
          </>
        )}

        {/* Botones solo para el jefe. */}
        {usuario && usuario.rol === "admin" && (
          <Link to="/admin" className="barraNavegacionEnlace">
            <LayoutDashboard size={16} />
            <span>Panel Admin</span>
          </Link>
        )}

        {/* Botones solo para los clientes. */}
        {usuario && usuario.rol === "cliente" && (
          <>
            <Link to="/perfil" className="barraNavegacionEnlace">
              <User size={16} />
              <span>Mi Perfil</span>
            </Link>
            <Link to="/citas" className="barraNavegacionEnlace">
              <CalendarDays size={16} />
              <span>Mis Citas</span>
            </Link>
          </>
        )}

        {/* Muestra tu nombre y el botón de salir. */}
        {usuario && (
          <div className="barraNavegacionUsuario">
            <span className="barraNavegacionNombreUsuario">
              Hola, {usuario.nombreCompleto || usuario.nombreUsuario}
            </span>
            <button
              id="botonCerrarSesion"
              className="barraNavegacionBotonSalir"
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
