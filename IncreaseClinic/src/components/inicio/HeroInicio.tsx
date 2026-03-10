import { Link } from "react-router-dom";
import { useAutenticacion } from "../../context/ContextoAutenticacion";
import { HeartPulse, LogIn, UserPlus, ArrowRight } from "lucide-react";
import "../../styles/userStyles/HeroInicio.css";

// La parte de arriba de la página de inicio.
function HeroInicio() {
  const { usuario } = useAutenticacion();

  return (
    <header className="hero">
      <div className="heroContenido">
        {/* El dibujito de arriba. */}
        <div className="heroIconoPrincipal">
          <HeartPulse size={56} strokeWidth={1.8} />
        </div>

        <h1 className="heroTitulo">Bienvenido a IncreaseClinic</h1>
        <p className="heroDescripcion">
          La plataforma líder en gestión de pacientes y citas médicas.
          Tecnología de vanguardia para el cuidado de tu salud.
        </p>
        <div className="heroAcciones">
          {/* Si no has entrado, mostramos botones para entrar o anotarte. */}
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
            /* Si ya entraste, te llevamos a tu panel. */
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
