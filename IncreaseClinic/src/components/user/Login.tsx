// Formulario para entrar a tu cuenta.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAutenticacion } from "../../context/ContextoAutenticacion";
import { HeartPulse, Mail, Lock, LogIn, AlertCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/userStyles/Login.css";

function Login() {
  // Aquí guardamos los datos para entrar.
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [estaCargando, setEstaCargando] = useState(false);

  const { login } = useAutenticacion();
  const navegar = useNavigate();

  // Revisa que el correo y la clave estén bien escritos.
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

  // Envía tus datos para dejarte entrar.
  async function manejarEnvio() {
    setMensajeError("");

    if (!validarFormulario()) return;

    setEstaCargando(true);

    try {
      const datosUsuario = await login(correo, contrasena);

      // Te avisa si entraste bien.
      await Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Hola, ${datosUsuario.nombreCompleto || datosUsuario.nombreUsuario}`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Te lleva a tu lugar según seas jefe o cliente.
      if (datosUsuario.rol === "admin") {
        navegar("/admin");
      } else {
        navegar("/citas");
      }
    } catch (errorLogin: any) {
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
      <div className="paginaAutenticacionTarjeta">
        {/* El título y el dibujito de arriba. */}
        <div className="paginaAutenticacionEncabezado">
          <div className="paginaAutenticacionIconoTitulo">
            <HeartPulse size={32} strokeWidth={2} />
          </div>
          <h1 className="paginaAutenticacionTitulo">IncreaseClinic</h1>
          <p className="paginaAutenticacionSubtitulo">Iniciar Sesión</p>
        </div>

        {/* Un aviso si escribiste algo mal. */}
        {mensajeError && (
          <div id="mensajeError" className="mensajeError">
            <AlertCircle size={16} />
            <span>{mensajeError}</span>
          </div>
        )}

        {/* Para poner tu email. */}
        <div className="formularioGrupo">
          <label htmlFor="campoCorreo" className="formularioEtiqueta">
            <Mail size={14} />
            <span>Correo</span>
          </label>
          <input
            id="campoCorreo"
            type="email"
            className="formularioCampo"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Para poner tu clave secreta. */}
        <div className="formularioGrupo">
          <label htmlFor="campoContrasena" className="formularioEtiqueta">
            <Lock size={14} />
            <span>Contraseña</span>
          </label>
          <input
            id="campoContrasena"
            type="password"
            className="formularioCampo"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            disabled={estaCargando}
          />
        </div>

        {/* Botón para entrar. */}
        <button
          id="botonLogin"
          type="button"
          className="formularioBoton formularioBotonPrimario"
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

        {/* Por si no tienes cuenta todavía. */}
        <p className="paginaAutenticacionEnlace">
          ¿No tienes cuenta?{" "}
          <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
