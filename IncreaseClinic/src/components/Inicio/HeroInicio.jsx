import { Link } from "react-router-dom";
import { useAutenticacion } from "../../../context/ContextoAutenticacion";
import { HeartPulse, LogIn, UserPlus, ArrowRight } from "lucide-react";
import "../../../styles/userStyles/HeroInicio.css";

/**
 * HeroInicio - Sección hero (encabezado visual) de la página de inicio.
 * Muestra un título de bienvenida, descripción y botones de acción
 * que cambian según el estado de autenticación del usuario.
 */
function HeroInicio() {
  const { usuario } = useAutenticacion();

  return (
    <header className="hero">
      <div className="heroContenido">
        {/* Icono decorativo del hero */}
        <div className="heroIconoPrincipal">
          <HeartPulse size={56} strokeWidth={1.8} />
        </div>

        <h1 className="heroTitulo">Bienvenido a IncreaseClinic</h1>
        <p className="heroDescripcion">
          La plataforma líder en gestión de pacientes y citas médicas.
          Tecnología de vanguardia para el cuidado de tu salud.
        </p>
        <div className="heroAcciones">
          {/* Si el usuario NO ha iniciado sesión, mostramos Login y Registro */}
          {!usuario ? (
            <>
              <Link to="/login" className="boton botonPrimario">
                <LogIn size={18} />
                <span>Iniciar Sesión</span>
              </Link>
              <Link to="/registro" className="boton botonSecundario">
                <UserPlus size={18} />
                <span>Registrarse</span>
              </Link>
            </>
          ) : (
            /* Si ya inició sesión, mostramos enlace a su panel correspondiente */
            <Link
              to={usuario.rol === "admin" ? "/admin" : "/citas"}
              className="boton botonPrimario"
            >
              <span>Ir a mi Panel</span>
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default HeroInicio;
