/**
 * Perfil.jsx - Componente de perfil del cliente.
 * Muestra la información personal del usuario autenticado en una tarjeta visual.
 * Los datos se obtienen del contexto de autenticación (no del servidor directamente).
 */

import { useAutenticacion } from "../context/ContextoAutenticacion";
import { User, AtSign, Mail, Shield } from "lucide-react";

function Perfil() {
  const { usuario } = useAutenticacion();

  return (
    <div id="perfilCliente" className="perfilCliente">
      {/* Encabezado de la sección */}
      <div className="perfilCliente__encabezado">
        <h1 className="perfilCliente__titulo">Mi Perfil</h1>
        <p className="perfilCliente__subtitulo">Información personal</p>
      </div>

      {/* Tarjeta de perfil */}
      <div className="perfilCliente__tarjeta">
        {/* Avatar del usuario con icono profesional */}
        <div className="perfilCliente__avatar">
          <User size={48} strokeWidth={1.5} color="white" />
        </div>

        {/* Datos del usuario */}
        <div className="perfilCliente__datos">
          {/* Nombre completo */}
          <div className="perfilCliente__campo">
            <span className="perfilCliente__etiqueta">
              <User size={13} />
              Nombre Completo
            </span>
            <span className="perfilCliente__valor">
              {usuario.nombreCompleto || "Sin especificar"}
            </span>
          </div>

          {/* Nombre de usuario */}
          <div className="perfilCliente__campo">
            <span className="perfilCliente__etiqueta">
              <AtSign size={13} />
              Usuario
            </span>
            <span className="perfilCliente__valor">{usuario.nombreUsuario}</span>
          </div>

          {/* Correo electrónico */}
          <div className="perfilCliente__campo">
            <span className="perfilCliente__etiqueta">
              <Mail size={13} />
              Correo Electrónico
            </span>
            <span className="perfilCliente__valor">
              {usuario.correo || "Sin especificar"}
            </span>
          </div>

          {/* Rol del usuario */}
          <div className="perfilCliente__campo">
            <span className="perfilCliente__etiqueta">
              <Shield size={13} />
              Rol
            </span>
            <span className="perfilCliente__valor perfilCliente__valor--rol">
              {usuario.rol === "admin" ? "Administrador" : "Cliente"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
