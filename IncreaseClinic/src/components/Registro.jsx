/**
 * Registro.jsx - Componente de registro de nuevos usuarios.
 * Presenta un formulario con validación de campos obligatorios,
 * longitud mínima de contraseña y confirmación de contraseña.
 * Al completar el registro, inicia sesión automáticamente y redirige a /citas.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import { HeartPulse, UserCircle, User, Mail, Lock, ShieldCheck, AlertCircle, UserPlus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

function Registro() {
  // --- Estados del formulario ---
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);

  const { registro } = useAutenticacion();
  const navegar = useNavigate();

  /**
   * Valida todos los campos del formulario de registro.
   * @returns {boolean} true si la validación pasa.
   */
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

  /**
   * Procesa el envío del formulario de registro.
   */
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
        rol: "cliente",
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
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: errorRegistro.message || "No se pudo crear la cuenta",
        confirmButtonColor: "#2563EB",
      });
      setMensajeError(errorRegistro.message || "Error al registrar usuario");
    } finally {
      setEstaCargando(false);
    }
  }

  return (
    <div id="paginaRegistro" className="paginaAutenticacion">
      <div className="paginaAutenticacion__tarjeta">
        {/* Encabezado con icono */}
        <div className="paginaAutenticacion__encabezado">
          <div className="paginaAutenticacion__iconoTitulo">
            <HeartPulse size={32} strokeWidth={2} />
          </div>
          <h1 className="paginaAutenticacion__titulo">IncreaseClinic</h1>
          <p className="paginaAutenticacion__subtitulo">Crear Cuenta</p>
        </div>

        {/* Mensaje de error */}
        {mensajeError && (
          <div id="mensajeErrorRegistro" className="mensajeError">
            <AlertCircle size={16} />
            <span>{mensajeError}</span>
          </div>
        )}

        {/* Campo: Nombre de usuario */}
        <div className="formulario__grupo">
          <label htmlFor="campoNombreUsuario" className="formulario__etiqueta">
            <UserCircle size={14} />
            <span>Nombre de Usuario</span>
          </label>
          <input
            id="campoNombreUsuario"
            type="text"
            className="formulario__campo"
            placeholder="Ej: juanperez"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Campo: Nombre completo */}
        <div className="formulario__grupo">
          <label htmlFor="campoNombreCompleto" className="formulario__etiqueta">
            <User size={14} />
            <span>Nombre Completo</span>
          </label>
          <input
            id="campoNombreCompleto"
            type="text"
            className="formulario__campo"
            placeholder="Ej: Juan Pérez García"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Campo: Correo electrónico */}
        <div className="formulario__grupo">
          <label htmlFor="campoCorreoRegistro" className="formulario__etiqueta">
            <Mail size={14} />
            <span>Correo Electrónico</span>
          </label>
          <input
            id="campoCorreoRegistro"
            type="email"
            className="formulario__campo"
            placeholder="Ej: juan@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Campo: Contraseña */}
        <div className="formulario__grupo">
          <label htmlFor="campoContrasenaRegistro" className="formulario__etiqueta">
            <Lock size={14} />
            <span>Contraseña</span>
          </label>
          <input
            id="campoContrasenaRegistro"
            type="password"
            className="formulario__campo"
            placeholder="Mínimo 6 caracteres"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Campo: Confirmar contraseña */}
        <div className="formulario__grupo">
          <label htmlFor="campoConfirmarContrasena" className="formulario__etiqueta">
            <ShieldCheck size={14} />
            <span>Confirmar Contraseña</span>
          </label>
          <input
            id="campoConfirmarContrasena"
            type="password"
            className="formulario__campo"
            placeholder="Repite tu contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Botón de envío */}
        <button
          id="botonRegistro"
          type="button"
          className="formulario__boton formulario__boton--primario"
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

        {/* Enlace al login */}
        <p className="paginaAutenticacion__enlace">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
