// Aquí el jefe puede crear otros jefes o borrar usuarios.
import { useState, useEffect } from "react";
import ServicioUsuarios from "../../services/ServicioUsuarios";
import { Users, UserPlus, Shield, Trash2, Mail, Lock, UserCircle, AlertCircle, Save, X, Search, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/adminStyles/AdminUsuarios.css";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const CORREO_ADMIN_PRINCIPAL = "admin@increaseclinic.com";

  // Aquí anotamos los datos del usuario.
  const [formulario, setFormulario] = useState({
    nombreUsuario: "",
    contrasena: "",
    nombreCompleto: "",
    correo: "",
    rol: "admin"
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Trae a todos los usuarios del internet.
  async function cargarUsuarios() {
    try {
      setEstaCargando(true);
      const datos = await ServicioUsuarios.getUser();
      setUsuarios(datos);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    } finally {
      setEstaCargando(false);
    }
  }

  // Anota lo que escribimos en los cuadros.
  function manejarCambio(e) {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  }

  // Borra lo que escribimos y cierra la ventanita.
  function limpiarFormulario() {
    setFormulario({ nombreUsuario: "", contrasena: "", nombreCompleto: "", correo: "", rol: "admin" });
    setUsuarioEditando(null);
    setMostrarModal(false);
    setErrorFormulario("");
  }

  // Abre la ventana para crear alguien nuevo.
  function abrirFormularioCrear() {
    limpiarFormulario();
    setMostrarModal(true);
  }

  // Abre la ventana para cambiar datos de alguien.
  function abrirFormularioEditar(usuarioSelec) {
    setFormulario({
      nombreUsuario: usuarioSelec.nombreUsuario || "",
      contrasena: "", // Se deja vacía por si no la quiere cambiar.
      nombreCompleto: usuarioSelec.nombreCompleto || "",
      correo: usuarioSelec.correo || "",
      rol: usuarioSelec.rol || "cliente"
    });
    setUsuarioEditando(usuarioSelec);
    setMostrarModal(true);
    setErrorFormulario("");
  }

  // Guarda al usuario en el internet.
  async function manejarEnvio() {
    setErrorFormulario("");
    
    // Revisa que no falte escribir lo importante.
    if (!formulario.nombreUsuario.trim() || !formulario.correo.trim()) {
      setErrorFormulario("El usuario y el correo son obligatorios.");
      return;
    }

    if (!usuarioEditando && !formulario.contrasena.trim()) {
      setErrorFormulario("La contraseña es obligatoria para nuevos usuarios.");
      return;
    }

    try {
      const todos = await ServicioUsuarios.getUser();
      
      const nombreOcupado = todos.find(u => u.nombreUsuario === formulario.nombreUsuario && u.id !== usuarioEditando?.id);
      if (nombreOcupado) throw new Error("Ese nombre de usuario ya está usado.");

      if (usuarioEditando) {
        let datosEnviar = { ...formulario };
        if (!datosEnviar.contrasena) delete datosEnviar.contrasena;

        await ServicioUsuarios.patchUsuarios(datosEnviar, usuarioEditando.id);
        Swal.fire({ icon: "success", title: "Actualizado", text: "Datos guardados.", timer: 2000, showConfirmButton: false });
      } else {
        const correoOcupado = todos.find(u => u.correo === formulario.correo);
        if (correoOcupado) throw new Error("Ese correo ya está registrado.");

        await ServicioUsuarios.postUser({ ...formulario });
        Swal.fire({ icon: "success", title: "Creado", text: "Usuario creado.", timer: 2000, showConfirmButton: false });
      }

      limpiarFormulario();
      await cargarUsuarios();
    } catch (error) {
      setErrorFormulario(error.message);
    }
  }

  // Borra a un usuario si el jefe quiere, pero no al jefe principal.
  async function manejarEliminar(usuarioSeleccionado) {
    if (usuarioSeleccionado.correo === CORREO_ADMIN_PRINCIPAL) {
      Swal.fire({
        icon: "error",
        title: "Acción Denegada",
        text: "El administrador principal del sistema no puede ser eliminado por seguridad.",
        confirmButtonColor: "#2563EB"
      });
      return;
    }

    const resultado = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar Usuario?",
      text: `¿Estás seguro de eliminar a ${usuarioSeleccionado.nombreUsuario}? Se perderán todos sus datos y citas asociadas.`,
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, eliminar definitivamente",
      cancelButtonText: "Cancelar"
    });

    if (!resultado.isConfirmed) return;

    try {
      await ServicioUsuarios.deleteUsuarios(usuarioSeleccionado.id);
      await cargarUsuarios();
      Swal.fire("Eliminado", "El usuario ha sido removido del sistema.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar al usuario", "error");
    }
  }

  // Busca usuarios por su nombre o correo.
  const usuariosFiltrados = usuarios.filter(u => 
    u.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="adminUsuarios">
      <div className="panelAdminAcciones">
        <button 
          className="formularioBoton formularioBotonPrimario"
          onClick={abrirFormularioCrear}
        >
          <UserPlus size={18} />
          <span>Crear Usuario</span>
        </button>
        
        <div className="panelAdminBuscador">
          <Search size={16} className="panelAdminIconoBusqueda" />
          <input 
            type="text" 
            placeholder="Buscar por usuario o correo..."
            className="formularioCampo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {estaCargando ? (
        <p>Actualizando lista de usuarios...</p>
      ) : (
        <div className="panelAdminTabla">
          <table className="tabla">
            <thead className="tablaEncabezado">
              <tr>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="tablaCuerpo">
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="tablaFila">
                  <td className="tablaCelda">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCircle size={14} />
                      <strong>{u.nombreUsuario}</strong>
                    </div>
                  </td>
                  <td className="tablaCelda">{u.nombreCompleto || "Sin nombre"}</td>
                  <td className="tablaCelda">{u.correo}</td>
                  <td className="tablaCelda">
                    <span className={`estadoCita ${u.rol === 'admin' ? 'estadoCitaConfirmada' : 'estadoCitaPendiente'}`}>
                      {u.rol === 'admin' ? 'Administrador' : 'Cliente'}
                    </span>
                  </td>
                  <td className="tablaCelda tablaCeldaAcciones">
                    {u.correo !== CORREO_ADMIN_PRINCIPAL ? (
                      <>
                        <button 
                          className="botonAccion botonAccionEditar"
                          onClick={() => abrirFormularioEditar(u)}
                        >
                          <Pencil size={13} />
                          <span>Editar</span>
                        </button>
                        <button 
                          className="botonAccion botonAccionEliminar"
                          onClick={() => manejarEliminar(u)}
                        >
                          <Trash2 size={13} />
                          <span>Eliminar</span>
                        </button>
                      </>
                    ) : (
                      <span className="textoTenue"><Shield size={12} /> Protegido</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ventanita para anotar al nuevo jefe. */}
      {mostrarModal && (
        <div className="panelAdminModal">
          <div className="panelAdminModalContenido">
            <h2 className="panelAdminModalTitulo">
              {usuarioEditando ? "Editar Usuario" : "Registrar Nuevo Usuario"}
            </h2>
            
            {errorFormulario && (
              <div className="mensajeError">
                <AlertCircle size={16} />
                <span>{errorFormulario}</span>
              </div>
            )}

            <div className="formulario">
              <div className="formularioGrupo">
                <label className="formularioEtiqueta">Usuario</label>
                <input 
                  type="text" 
                  name="nombreUsuario"
                  className="formularioCampo"
                  placeholder="Ej: dr_perez"
                  value={formulario.nombreUsuario}
                  onChange={manejarCambio} 
                />
              </div>

              <div className="formularioGrupo">
                <label className="formularioEtiqueta">Correo {usuarioEditando && "(No se puede cambiar)"}</label>
                <input 
                  type="email" 
                  name="correo"
                  className="formularioCampo"
                  placeholder="admin@increaseclinic.com"
                  value={formulario.correo}
                  onChange={manejarCambio} 
                  disabled={usuarioEditando != null}
                  style={usuarioEditando ? { backgroundColor: "#e2e8f0", cursor: "not-allowed", color: "#64748b" } : {}}
                />
              </div>

              <div className="formularioGrupo">
                <label className="formularioEtiqueta">Nombre Completo</label>
                <input 
                  type="text" 
                  name="nombreCompleto"
                  className="formularioCampo"
                  placeholder="Nombre de la persona"
                  value={formulario.nombreCompleto}
                  onChange={manejarCambio} 
                />
              </div>

              <div className="formularioGrupo">
                <label className="formularioEtiqueta">Rol</label>
                <select 
                  name="rol"
                  className="formularioCampo"
                  value={formulario.rol}
                  onChange={manejarCambio}
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="formularioGrupo">
                <label className="formularioEtiqueta">Contraseña {usuarioEditando && "(Déjala vacía para no cambiarla)"}</label>
                <input 
                  type="password" 
                  name="contrasena"
                  className="formularioCampo"
                  placeholder="••••••••"
                  value={formulario.contrasena}
                  onChange={manejarCambio} 
                />
              </div>

              <div className="formularioBotonesModal">
                <button className="formularioBoton formularioBotonPrimario" onClick={manejarEnvio}>
                  <Save size={16} /> <span>Guardar</span>
                </button>
                <button className="formularioBoton formularioBotonSecundario" onClick={limpiarFormulario}>
                  <X size={16} /> <span>Cancelar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
