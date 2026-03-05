import { Link, useNavigate } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import Swal from "sweetalert2";

function BarraNavegacion() {
  const { usuario, cerrarSesion } = useAutenticacion();
  const navegar = useNavigate();

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
      <div className="barraNavegacion__logo">
        <Link to="/">🏥 IncreaseClinic</Link>
      </div>

      <div className="barraNavegacion__enlaces">
        {!usuario && (
          <>
            <Link to="/login" className="barraNavegacion__enlace">Iniciar Sesión</Link>
            <Link to="/registro" className="barraNavegacion__enlace barraNavegacion__enlace--resaltado">Registrarse</Link>
          </>
        )}

        {usuario && usuario.rol === "admin" && (
          <>
            <Link to="/admin" className="barraNavegacion__enlace">Panel Admin</Link>
          </>
        )}

        {usuario && usuario.rol === "cliente" && (
          <>
            <Link to="/perfil" className="barraNavegacion__enlace">Mi Perfil</Link>
            <Link to="/citas" className="barraNavegacion__enlace">Mis Citas</Link>
          </>
        )}

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
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default BarraNavegacion;
