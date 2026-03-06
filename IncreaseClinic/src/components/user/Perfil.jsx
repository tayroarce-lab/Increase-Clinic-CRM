/**
 * Perfil.jsx - Componente de perfil del cliente.
 * Muestra la información personal del usuario autenticado en una tarjeta visual.
 * Los datos se obtienen del contexto de autenticación (no del servidor directamente).
 */

import { useAutenticacion } from "../../context/ContextoAutenticacion";
import { User, AtSign, Mail, Shield } from "lucide-react";
import "../../styles/userStyles/Perfil.css";

function Perfil() {
  const { usuario } = useAutenticacion();

  return (
    <div id="perfilCliente" className="perfilCliente">
      {/* Encabezado de la sección */}
      <div className="perfilClienteEncabezado">
        <h1 className="perfilClienteTitulo">Mi Perfil</h1>
        <p className="perfilClienteSubtitulo">Información personal</p>
      </div>

      {/* Tarjeta de perfil */}
      <div className="perfilClienteTarjeta">
        {/* Avatar del usuario con icono profesional */}
        <div className="perfilClienteAvatar">
          <User size={48} strokeWidth={1.5} color="white" />
        </div>

        {/* Datos del usuario */}
        <div className="perfilClienteDatos">
          {/* Nombre completo */}
          <div className="perfilClienteCampo">
            <span className="perfilClienteEtiqueta">
              <User size={13} />
              Nombre Completo
            </span>
            <span className="perfilClienteValor">
              {usuario.nombreCompleto || "Sin especificar"}
            </span>
          </div>

          {/* Nombre de usuario */}
          <div className="perfilClienteCampo">
            <span className="perfilClienteEtiqueta">
              <AtSign size={13} />
              Usuario
            </span>
            <span className="perfilClienteValor">{usuario.nombreUsuario}</span>
          </div>

          {/* Correo electrónico */}
          <div className="perfilClienteCampo">
            <span className="perfilClienteEtiqueta">
              <Mail size={13} />
              Correo Electrónico
            </span>
            <span className="perfilClienteValor">
              {usuario.correo || "Sin especificar"}
            </span>
          </div>

          {/* Rol del usuario */}
          <div className="perfilClienteCampo">
            <span className="perfilClienteEtiqueta">
              <Shield size={13} />
              Rol
            </span>
            <span className="perfilClienteValor perfilClienteValorRol">
              {usuario.rol === "admin" ? "Administrador" : "Cliente"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
