import { Link } from "react-router-dom";
import { useAutenticacion } from "../../context/ContextoAutenticacion";
import { HeartPulse, LogIn, UserPlus, ArrowRight } from "lucide-react";

/**
 * HeroInicio - Sección hero (encabezado visual) de la página de inicio.
 * Muestra un título de bienvenida, descripción y botones de acción
 * que cambian según el estado de autenticación del usuario.
 */
function HeroInicio() {
  const { usuario } = useAutenticacion();

  return (
    <header className="hero">
      <div className="hero__contenido">
        {/* Icono decorativo del hero */}
        <div className="hero__iconoPrincipal">
          <HeartPulse size={56} strokeWidth={1.8} />
        </div>

        <h1 className="hero__titulo">Bienvenido a IncreaseClinic</h1>
        <p className="hero__descripcion">
          La plataforma líder en gestión de pacientes y citas médicas.
          Tecnología de vanguardia para el cuidado de tu salud.
        </p>
        <div className="hero__acciones">
          {/* Si el usuario NO ha iniciado sesión, mostramos Login y Registro */}
          {!usuario ? (
            <>
              <Link to="/login" className="boton boton--primario">
                <LogIn size={18} />
                <span>Iniciar Sesión</span>
              </Link>
              <Link to="/registro" className="boton boton--secundario">
                <UserPlus size={18} />
                <span>Registrarse</span>
              </Link>
            </>
          ) : (
            /* Si ya inició sesión, mostramos enlace a su panel correspondiente */
            <Link
              to={usuario.rol === "admin" ? "/admin" : "/citas"}
              className="boton boton--primario"
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
