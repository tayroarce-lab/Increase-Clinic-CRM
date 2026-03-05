import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import Swal from "sweetalert2";

function PaginaRegistro() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { registro } = useAutenticacion();
  const navegar = useNavigate();

  function validarFormulario() {
    if (!nombreUsuario.trim()) {
      setError("El nombre de usuario es obligatorio");
      return false;
    }
    if (nombreUsuario.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      return false;
    }
    if (!nombreCompleto.trim()) {
      setError("El nombre completo es obligatorio");
      return false;
    }
    if (!correo.trim()) {
      setError("El correo es obligatorio");
      return false;
    }
    if (!correo.includes("@")) {
      setError("Ingresa un correo válido");
      return false;
    }
    if (!contrasena.trim()) {
      setError("La contraseña es obligatoria");
      return false;
    }
    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  }

  async function manejarEnvio() {
    setError("");

    if (!validarFormulario()) return;

    setCargando(true);

    try {
      await registro({
        nombreUsuario,
        contrasena,
        nombreCompleto,
        correo,
      });

      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente",
        timer: 1800,
        showConfirmButton: false,
      });

      navegar("/perfil");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: error.message || "No se pudo crear la cuenta",
        confirmButtonColor: "#2563EB",
      });
      setError(error.message || "Error al registrar usuario");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div id="paginaRegistro" className="paginaAutenticacion">
      <div className="paginaAutenticacion__tarjeta">
        <div className="paginaAutenticacion__encabezado">
          <h1 className="paginaAutenticacion__titulo">IncreaseClinic</h1>
          <p className="paginaAutenticacion__subtitulo">Crear Cuenta</p>
        </div>

        {error && (
          <div id="mensajeErrorRegistro" className="mensajeError">
            <span>⚠️</span> {error}
          </div>
        )}

          <div className="formulario__grupo">
            <label htmlFor="campoNombreUsuario" className="formulario__etiqueta">
              Nombre de Usuario
            </label>
            <input
              id="campoNombreUsuario"
              type="text"
              className="formulario__campo"
              placeholder="Ej: juanperez"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              disabled={cargando}
            />
          </div>

          <div className="formulario__grupo">
            <label htmlFor="campoNombreCompleto" className="formulario__etiqueta">
              Nombre Completo
            </label>
            <input
              id="campoNombreCompleto"
              type="text"
              className="formulario__campo"
              placeholder="Ej: Juan Pérez García"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              disabled={cargando}
            />
          </div>

          <div className="formulario__grupo">
            <label htmlFor="campoCorreo" className="formulario__etiqueta">
              Correo Electrónico
            </label>
            <input
              id="campoCorreo"
              type="email"
              className="formulario__campo"
              placeholder="Ej: juan@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={cargando}
            />
          </div>

          <div className="formulario__grupo">
            <label htmlFor="campoContrasenaRegistro" className="formulario__etiqueta">
              Contraseña
            </label>
            <input
              id="campoContrasenaRegistro"
              type="password"
              className="formulario__campo"
              placeholder="Mínimo 6 caracteres"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              disabled={cargando}
            />
          </div>

          <div className="formulario__grupo">
            <label htmlFor="campoConfirmarContrasena" className="formulario__etiqueta">
              Confirmar Contraseña
            </label>
            <input
              id="campoConfirmarContrasena"
              type="password"
              className="formulario__campo"
              placeholder="Repite tu contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              disabled={cargando}
            />
          </div>

          <button
            id="botonRegistro"
            type="button"
            className="formulario__boton formulario__boton--primario"
            disabled={cargando}
            onClick={manejarEnvio}
          >
            {cargando ? "Registrando..." : "Crear Cuenta"}
          </button>

        <p className="paginaAutenticacion__enlace">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default PaginaRegistro;
