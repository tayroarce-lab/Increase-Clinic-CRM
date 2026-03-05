/**
 * Login.jsx - Componente de inicio de sesión.
 * Presenta un formulario con campos de correo y contraseña.
 * Valida los datos antes de enviarlos y redirige al panel
 * correspondiente según el rol del usuario (admin → /admin, cliente → /citas).
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import { HeartPulse, Mail, Lock, LogIn, AlertCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

function Login() {
  // --- Estados del formulario ---
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);

  const { login } = useAutenticacion();
  const navegar = useNavigate();

  /**
   * Valida que los campos del formulario estén completos y sean correctos.
   * @returns {boolean} true si la validación pasa.
   */
  function validarFormulario() {
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
    return true;
  }

  /**
   * Procesa el envío del formulario de login.
   * Valida, autentica contra el servidor y redirige según el rol.
   */
  async function manejarEnvio() {
    setMensajeError("");

    if (!validarFormulario()) return;

    setEstaCargando(true);

    try {
      const datosUsuario = await login(correo, contrasena);

      // Notificar éxito antes de redirigir
      await Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Hola, ${datosUsuario.nombreCompleto || datosUsuario.nombreUsuario}`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirigir según el rol del usuario
      if (datosUsuario.rol === "admin") {
        navegar("/admin");
      } else {
        navegar("/citas");
      }
    } catch (errorLogin) {
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: errorLogin.message || "Credenciales incorrectas",
        confirmButtonColor: "#2563EB",
      });
      setMensajeError(errorLogin.message || "Error al iniciar sesión");
    } finally {
      setEstaCargando(false);
    }
  }

  return (
    <div id="paginaLogin" className="paginaAutenticacion">
      <div className="paginaAutenticacion__tarjeta">
        {/* Encabezado del formulario con icono */}
        <div className="paginaAutenticacion__encabezado">
          <div className="paginaAutenticacion__iconoTitulo">
            <HeartPulse size={32} strokeWidth={2} />
          </div>
          <h1 className="paginaAutenticacion__titulo">IncreaseClinic</h1>
          <p className="paginaAutenticacion__subtitulo">Iniciar Sesión</p>
        </div>

        {/* Mensaje de error */}
        {mensajeError && (
          <div id="mensajeError" className="mensajeError">
            <AlertCircle size={16} />
            <span>{mensajeError}</span>
          </div>
        )}

        {/* Campo: Correo electrónico */}
        <div className="formulario__grupo">
          <label htmlFor="campoCorreo" className="formulario__etiqueta">
            <Mail size={14} />
            <span>Correo</span>
          </label>
          <input
            id="campoCorreo"
            type="email"
            className="formulario__campo"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Campo: Contraseña */}
        <div className="formulario__grupo">
          <label htmlFor="campoContrasena" className="formulario__etiqueta">
            <Lock size={14} />
            <span>Contraseña</span>
          </label>
          <input
            id="campoContrasena"
            type="password"
            className="formulario__campo"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Botón de envío */}
        <button
          id="botonLogin"
          type="button"
          className="formulario__boton formulario__boton--primario"
          disabled={estaCargando}
          onClick={manejarEnvio}
        >
          {estaCargando ? (
            <>
              <Loader2 size={18} className="iconoGirando" />
              <span>Ingresando...</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>Iniciar Sesión</span>
            </>
          )}
        </button>

        {/* Enlace al registro */}
        <p className="paginaAutenticacion__enlace">
          ¿No tienes cuenta?{" "}
          <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
