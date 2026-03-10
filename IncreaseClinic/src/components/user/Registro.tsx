// Formulario para crear una cuenta nueva.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAutenticacion } from "../../context/ContextoAutenticacion";
import { HeartPulse, UserCircle, User, Mail, Lock, ShieldCheck, AlertCircle, UserPlus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/userStyles/Registro.css";

function Registro() {
  // Aquí guardamos tus datos para registrarte.
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);

  const { registro } = useAutenticacion();
  const navegar = useNavigate();

  // Revisa que hayas escrito todo bien para crear tu cuenta.
  function validarFormulario() {
    if (!nombreUsuario.trim()) {
      setMensajeError("El nombre de usuario es obligatorio");
      return false;
    }
    if (nombreUsuario.length < 3) {
      setMensajeError("El nombre de usuario debe tener al menos 3 caracteres");
      return false;
    }
    if (!nombreCompleto.trim()) {
      setMensajeError("El nombre completo es obligatorio");
      return false;
    }
    if (!correo.trim()) {
      setMensajeError("El correo es obligatorio");
      return false;
    }
    if (!correo.includes("@")) {
      setMensajeError("Ingresa un correo válido");
      return false;
    }
    if (!contrasena.trim()) {
      setMensajeError("La contraseña es obligatoria");
      return false;
    }
    if (contrasena.length < 6) {
      setMensajeError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (contrasena !== confirmarContrasena) {
      setMensajeError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  }

  // Envía tus datos al internet para crear tu cuenta.
  async function manejarEnvio() {
    setMensajeError("");

    if (!validarFormulario()) return;

    setEstaCargando(true);

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

      navegar("/citas");
    } catch (errorRegistro) {
      const msg = errorRegistro instanceof Error ? errorRegistro.message : "Error desconocido";
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: msg || "No se pudo crear la cuenta",
        confirmButtonColor: "#2563EB",
      });
      setMensajeError(msg || "Error al registrar usuario");
    } finally {
      setEstaCargando(false);
    }
  }

  return (
    <div id="paginaRegistro" className="paginaAutenticacion">
      <div className="paginaAutenticacionTarjeta">
        {/* El título y el dibujito de arriba. */}
        <div className="paginaAutenticacionEncabezado">
          <div className="paginaAutenticacionIconoTitulo">
            <HeartPulse size={32} strokeWidth={2} />
          </div>
          <h1 className="paginaAutenticacionTitulo">IncreaseClinic</h1>
          <p className="paginaAutenticacionSubtitulo">Crear Cuenta</p>
        </div>

        {/* Un aviso si algo faltó o está mal. */}
        {mensajeError && (
          <div id="mensajeErrorRegistro" className="mensajeError">
            <AlertCircle size={16} />
            <span>{mensajeError}</span>
          </div>
        )}

        {/* Para poner tu nombre de usuario. */}
        <div className="formularioGrupo">
          <label htmlFor="campoNombreUsuario" className="formularioEtiqueta">
            <UserCircle size={14} />
            <span>Nombre de Usuario</span>
          </label>
          <input
            id="campoNombreUsuario"
            type="text"
            className="formularioCampo"
            placeholder="Ej: juanperez"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Para poner tu nombre real. */}
        <div className="formularioGrupo">
          <label htmlFor="campoNombreCompleto" className="formularioEtiqueta">
            <User size={14} />
            <span>Nombre Completo</span>
          </label>
          <input
            id="campoNombreCompleto"
            type="text"
            className="formularioCampo"
            placeholder="Ej: Juan Pérez García"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Para poner tu email. */}
        <div className="formularioGrupo">
          <label htmlFor="campoCorreoRegistro" className="formularioEtiqueta">
            <Mail size={14} />
            <span>Correo Electrónico</span>
          </label>
          <input
            id="campoCorreoRegistro"
            type="email"
            className="formularioCampo"
            placeholder="Ej: juan@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Para poner tu clave secreta. */}
        <div className="formularioGrupo">
          <label htmlFor="campoContrasenaRegistro" className="formularioEtiqueta">
            <Lock size={14} />
            <span>Contraseña</span>
          </label>
          <input
            id="campoContrasenaRegistro"
            type="password"
            className="formularioCampo"
            placeholder="Mínimo 6 caracteres"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Vuelve a poner tu clave para estar seguros. */}
        <div className="formularioGrupo">
          <label htmlFor="campoConfirmarContrasena" className="formularioEtiqueta">
            <ShieldCheck size={14} />
            <span>Confirmar Contraseña</span>
          </label>
          <input
            id="campoConfirmarContrasena"
            type="password"
            className="formularioCampo"
            placeholder="Repite tu contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Botón para crear tu cuenta. */}
        <button
          id="botonRegistro"
          type="button"
          className="formularioBoton formularioBotonPrimario"
          disabled={estaCargando}
          onClick={manejarEnvio}
        >
          {estaCargando ? (
            <>
              <Loader2 size={18} className="iconoGirando" />
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>Crear Cuenta</span>
            </>
          )}
        </button>

        {/* Por si ya tienes una cuenta. */}
        <p className="paginaAutenticacionEnlace">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
