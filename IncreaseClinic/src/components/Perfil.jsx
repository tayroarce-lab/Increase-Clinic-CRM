import { useAutenticacion } from "../context/ContextoAutenticacion";

function PerfilCliente() {
  const { usuario } = useAutenticacion();

  return (
    <div id="perfilCliente" className="perfilCliente">
      <div className="perfilCliente__encabezado">
        <h1 className="perfilCliente__titulo">Mi Perfil</h1>
        <p className="perfilCliente__subtitulo">Información personal</p>
      </div>

      <div className="perfilCliente__tarjeta">
        <div className="perfilCliente__avatar">
          <span className="perfilCliente__avatarIcono">👤</span>
        </div>

        <div className="perfilCliente__datos">
          <div className="perfilCliente__campo">
            <span className="perfilCliente__etiqueta">Nombre Completo</span>
            <span className="perfilCliente__valor">
              {usuario.nombreCompleto || "Sin especificar"}
            </span>
          </div>

          <div className="perfilCliente__campo">
            <span className="perfilCliente__etiqueta">Usuario</span>
            <span className="perfilCliente__valor">{usuario.nombreUsuario}</span>
          </div>

          <div className="perfilCliente__campo">
            <span className="perfilCliente__etiqueta">Correo Electrónico</span>
            <span className="perfilCliente__valor">
              {usuario.correo || "Sin especificar"}
            </span>
          </div>

          <div className="perfilCliente__campo">
            <span className="perfilCliente__etiqueta">Rol</span>
            <span className="perfilCliente__valor perfilCliente__valor--rol">
              {usuario.rol === "admin" ? "Administrador" : "Cliente"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilCliente;
