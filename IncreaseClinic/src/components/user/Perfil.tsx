// Aquí puedes ver tus datos personales.

import { useAutenticacion } from "../../context/ContextoAutenticacion";
import { User, AtSign, Mail, Shield } from "lucide-react";
import "../../styles/userStyles/Perfil.css";

function Perfil() {
  const { usuario } = useAutenticacion();

  return (
    <div id="perfilCliente" className="perfilCliente">
      {/* El título de arriba. */}
      <div className="perfilClienteEncabezado">
        <h1 className="perfilClienteTitulo">Mi Perfil</h1>
        <p className="perfilClienteSubtitulo">Información personal</p>
      </div>

      {/* La tarjeta con tus datos. */}
      <div className="perfilClienteTarjeta">
        {/* Tu dibujito de perfil. */}
        <div className="perfilClienteAvatar">
          <User size={48} strokeWidth={1.5} color="white" />
        </div>

        {/* Aquí están tus datos. */}
        <div className="perfilClienteDatos">
          {/* Tu nombre real. */}
          <div className="perfilClienteCampo">
            <span className="perfilClienteEtiqueta">
              <User size={13} />
              Nombre Completo
            </span>
            <span className="perfilClienteValor">
              {usuario.nombreCompleto || "Sin especificar"}
            </span>
          </div>

          {/* Tu nombre de usuario. */}
          <div className="perfilClienteCampo">
            <span className="perfilClienteEtiqueta">
              <AtSign size={13} />
              Usuario
            </span>
            <span className="perfilClienteValor">{usuario.nombreUsuario}</span>
          </div>

          {/* Tu email. */}
          <div className="perfilClienteCampo">
            <span className="perfilClienteEtiqueta">
              <Mail size={13} />
              Correo Electrónico
            </span>
            <span className="perfilClienteValor">
              {usuario.correo || "Sin especificar"}
            </span>
          </div>

          {/* Qué tipo de cuenta tienes. */}
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
