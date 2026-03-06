/**
 * AdminUsuarios.jsx - Componente para la gestión de usuarios (Administradores y Clientes).
 * Permite listar todos los usuarios, crear nuevos administradores y eliminar cuentas.
 * Protege al administrador principal de ser eliminado.
 */
import { useState, useEffect } from "react";
import { obtenerUsuarios, crearUsuarioAdmin, eliminarUsuario } from "../../services/ServicioUsuarios";
import { Users, UserPlus, Shield, Trash2, Mail, Lock, UserCircle, AlertCircle, Save, X, Search } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/adminStyles/AdminUsuarios.css";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const CORREO_ADMIN_PRINCIPAL = "admin@increaseclinic.com";

  /** Estado del formulario de nuevo admin */
  const [nuevoAdmin, setNuevoAdmin] = useState({
    nombreUsuario: "",
    contrasena: "",
    nombreCompleto: "",
    correo: "",
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  /** Carga la lista completa de usuarios desde el servidor */
  async function cargarUsuarios() {
    try {
      setEstaCargando(true);
      const datos = await obtenerUsuarios();
      setUsuarios(datos);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    } finally {
      setEstaCargando(false);
    }
  }

  /** Maneja el cambio en los campos del formulario */
  function manejarCambio(e) {
    const { name, value } = e.target;
    setNuevoAdmin(prev => ({ ...prev, [name]: value }));
  }

  /** Procesa la creación de un nuevo administrador */
  async function manejarCrearAdmin() {
    setErrorFormulario("");
    
    // Validaciones básicas
    if (!nuevoAdmin.nombreUsuario.trim() || !nuevoAdmin.contrasena.trim() || !nuevoAdmin.correo.trim()) {
      setErrorFormulario("Todos los campos marcados son obligatorios");
      return;
    }

    try {
      await crearUsuarioAdmin(nuevoAdmin);
      Swal.fire({
        icon: "success",
        title: "Admin Creado",
        text: `El usuario ${nuevoAdmin.nombreUsuario} ahora es administrador.`,
        timer: 2000,
        showConfirmButton: false
      });
      setMostrarModal(false);
      setNuevoAdmin({ nombreUsuario: "", contrasena: "", nombreCompleto: "", correo: "" });
      await cargarUsuarios();
    } catch (error) {
      setErrorFormulario(error.message);
    }
  }

  /** Elimina un usuario con confirmación, protegiendo al admin principal */
  async function manejarEliminar(usuarioSeleccionado) {
    // Protección del admin principal
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
      await eliminarUsuario(usuarioSeleccionado.id);
      await cargarUsuarios();
      Swal.fire("Eliminado", "El usuario ha sido removido del sistema.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar al usuario", "error");
    }
  }

  // Filtrar usuarios según la búsqueda
  const usuariosFiltrados = usuarios.filter(u => 
    u.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="adminUsuarios">
      <div className="panelAdminAcciones">
        <button 
          className="formularioBoton formularioBotonPrimario"
          onClick={() => setMostrarModal(true)}
        >
          <UserPlus size={18} />
          <span>Crear Nuevo Admin</span>
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
                      <button 
                        className="botonAccion botonAccionEliminar"
                        onClick={() => manejarEliminar(u)}
                      >
                        <Trash2 size={13} />
                        <span>Eliminar</span>
                      </button>
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

      {/* Modal para Crear Admin */}
      {mostrarModal && (
        <div className="panelAdminModal">
          <div className="panelAdminModalContenido">
            <h2 className="panelAdminModalTitulo">Registrar Nuevo Administrador</h2>
            
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
                  value={nuevoAdmin.nombreUsuario}
                  onChange={manejarCambio} 
                />
              </div>

              <div className="formularioGrupo">
                <label className="formularioEtiqueta">Correo</label>
                <input 
                  type="email" 
                  name="correo"
                  className="formularioCampo"
                  placeholder="admin@increaseclinic.com"
                  value={nuevoAdmin.correo}
                  onChange={manejarCambio} 
                />
              </div>

              <div className="formularioGrupo">
                <label className="formularioEtiqueta">Nombre Completo</label>
                <input 
                  type="text" 
                  name="nombreCompleto"
                  className="formularioCampo"
                  placeholder="Nombre del doctor/admin"
                  value={nuevoAdmin.nombreCompleto}
                  onChange={manejarCambio} 
                />
              </div>

              <div className="formularioGrupo">
                <label className="formularioEtiqueta">Contraseña</label>
                <input 
                  type="password" 
                  name="contrasena"
                  className="formularioCampo"
                  placeholder="••••••••"
                  value={nuevoAdmin.contrasena}
                  onChange={manejarCambio} 
                />
              </div>

              <div className="formularioBotonesModal">
                <button className="formularioBoton formularioBotonPrimario" onClick={manejarCrearAdmin}>
                  <Save size={16} /> <span>Crear Administrador</span>
                </button>
                <button className="formularioBoton formularioBotonSecundario" onClick={() => setMostrarModal(false)}>
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
