import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import Swal from "sweetalert2";

function PaginaLogin() {
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAutenticacion();
  const navegar = useNavigate();


  function validarFormulario() {
    if (!correoUsuario.trim()) {
      setError("El correo es obligatorio");
      return false;
    }
    if (!contrasena.trim()) {
      setError("La contraseña es obligatoria");
      return false;
    }
    return true;
  }

  async function manejarEnvio() {
    setError("");

    if (!validarFormulario()) return;

    setCargando(true);

    try {
      const datosUsuario = await login(correoUsuario, contrasena);

      await Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Hola, ${datosUsuario.nombreCompleto || datosUsuario.correoUsuario}`,
        timer: 1500,
        showConfirmButton: false,
      });

      if (datosUsuario.rol === "admin") {
        navegar("/admin");
      } else {
        navegar("/perfil");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.message || "Credenciales incorrectas",
        confirmButtonColor: "#2563EB",
      });
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div id="paginaLogin" className="paginaAutenticacion">
      <div className="paginaAutenticacion__tarjeta">
        <div className="paginaAutenticacion__encabezado">
          <h1 className="paginaAutenticacion__titulo">IncreaseClinic</h1>
          <p className="paginaAutenticacion__subtitulo">Iniciar Sesión</p>
        </div>

        {error && (
          <div id="mensajeError" className="mensajeError">
            <span>⚠️</span> {error}
          </div>
        )}

          <div className="formulario__grupo">
            <label htmlFor="campoCorreo" className="formulario__etiqueta">
              Correo
            </label>
            <input
              id="campoCorreo"
              type="email"
              className="formulario__campo"
              placeholder="Ingresa tu correo"
              value={correoUsuario}
              onChange={(e) => setCorreoUsuario(e.target.value)}
              disabled={cargando}
            />
          </div>

          <div className="formulario__grupo">
            <label htmlFor="campoContrasena" className="formulario__etiqueta">
              Contraseña
            </label>
            <input
              id="campoContrasena"
              type="password"
              className="formulario__campo"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              disabled={cargando}
            />
          </div>

          <button
            id="botonLogin"
            type="button"
            className="formulario__boton formulario__boton--primario"
            disabled={cargando}
            onClick={manejarEnvio}
          >
            {cargando ? "Ingresando..." : "Iniciar Sesión"}
          </button>


        <p className="paginaAutenticacion__enlace">
          ¿No tienes cuenta?{" "}
          <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default PaginaLogin;
