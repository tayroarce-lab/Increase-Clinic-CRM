import { useState, useEffect } from "react";
import ServicioPacientes from "../../services/ServicioPacientes";
import IndicadorCarga from "../common/IndicadorCarga";
import AdminCitas from "./AdminCitas";
import AdminUsuarios from "./AdminUsuarios";
import { Users, CalendarDays, UserPlus, AlertCircle, Pencil, Trash2, User, Phone, Mail, FileText, Save, X, Shield } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/adminStyles/Admin.css";

// Esta es la pantalla principal para el administrador.
function PanelAdmin() {
  // Aquí guardamos cosas importantes.
  const [pacientes, setPacientes] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState("");

  // Para saber qué botón tocamos.
  const [pestanaActiva, setPestanaActiva] = useState("pacientes");

  // Aquí anotamos los datos de la persona.
  const [formulario, setFormulario] = useState({
    nombre: "",
    edad: "",
    telefono: "",
    correo: "",
    diagnostico: "",
  });

  // Al empezar, buscamos la lista de personas.
  useEffect(() => {
    cargarPacientes();
  }, []);

  // Estas cajitas de código sirven para mover datos.

// Trae a todos los pacientes del internet.
  async function cargarPacientes() {
    try {
      setEstaCargando(true);
      setMensajeError("");
      const datos = await ServicioPacientes.getPacientes();
      setPacientes(datos);
    } catch (errorPeticion) {
      setMensajeError("Error al cargar los pacientes: " + errorPeticion.message);
    } finally {
      setEstaCargando(false);
    }
  }

// Borra lo que escribimos y cierra la ventanita.
  function limpiarFormulario() {
    setFormulario({ nombre: "", edad: "", telefono: "", correo: "", diagnostico: "" });
    setPacienteEditando(null);
    setMostrarFormulario(false);
    setErrorFormulario("");
  }

// Abre la ventana para anotar a alguien nuevo.
  function abrirFormularioCrear() {
    limpiarFormulario();
    setMostrarFormulario(true);
  }

// Abre la ventana para cambiar datos de alguien.
  function abrirFormularioEditar(pacienteSeleccionado) {
    setFormulario({
      nombre: pacienteSeleccionado.nombre,
      edad: pacienteSeleccionado.edad.toString(),
      telefono: pacienteSeleccionado.telefono,
      correo: pacienteSeleccionado.correo,
      diagnostico: pacienteSeleccionado.diagnostico,
    });
    setPacienteEditando(pacienteSeleccionado);
    setMostrarFormulario(true);
    setErrorFormulario("");
  }

// Revisa que no nos falte escribir nada.
  function validarFormulario() {
    if (!formulario.nombre.trim()) {
      setErrorFormulario("El nombre es obligatorio");
      return false;
    }
    if (!formulario.edad || isNaN(formulario.edad) || Number(formulario.edad) <= 0) { //isNaN = is not a number
      setErrorFormulario("Ingresa una edad válida");
      return false;
    }
    if (!formulario.telefono.trim()) {
      setErrorFormulario("El teléfono es obligatorio");
      return false;
    }
    if (!formulario.correo.trim() || !formulario.correo.includes("@")) {
      setErrorFormulario("Ingresa un correo válido");
      return false;
    }
    return true;
  }

// Anota lo que vamos escribiendo en los cuadros.
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    // Los 3 puntos '...' copian lo de antes para no borrar nada al escribir.
    setFormulario((estadoAnterior) => ({ ...estadoAnterior, [name]: value }));
  }

// Manda los datos al internet para guardarlos.
  async function manejarEnvio() {
    setErrorFormulario("");

    if (!validarFormulario()) return;

    const datosPaciente = {
      ...formulario,
      edad: Number(formulario.edad),
      fechaRegistro: pacienteEditando
        ? pacienteEditando.fechaRegistro
        : new Date().toISOString().split("T")[0], 
    };

    try {
      if (pacienteEditando) {
        await ServicioPacientes.patchPacientes(datosPaciente, pacienteEditando.id);
        Swal.fire({
          icon: "success",
          title: "Paciente actualizado",
          text: `Los datos de ${formulario.nombre} han sido actualizados`,
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await ServicioPacientes.postPacientes(datosPaciente);
        Swal.fire({
          icon: "success",
          title: "Paciente creado",
          text: `${formulario.nombre} ha sido registrado exitosamente`,
          timer: 1800,
          showConfirmButton: false,
        });
      }
      limpiarFormulario();
      await cargarPacientes();
    } catch (errorEnvio) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el paciente: " + errorEnvio.message,
        confirmButtonColor: "#2563EB",
      });
      setErrorFormulario("Error al guardar: " + errorEnvio.message);
    }
  }

// Borra a alguien si el jefe dice que sí.
  async function manejarEliminar(pacienteSeleccionado) {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar paciente?",
      text: `¿Estás seguro de eliminar a ${pacienteSeleccionado.nombre}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;

    try {
      await ServicioPacientes.deletePacientes(pacienteSeleccionado.id);
      await cargarPacientes();
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: `${pacienteSeleccionado.nombre} ha sido eliminado correctamente`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (errorEliminacion) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: errorEliminacion.message,
        confirmButtonColor: "#2563EB",
      });
    }
  }

// Si todavía está cargando, mostramos un aviso.
  if (estaCargando) return <IndicadorCarga mensaje="Cargando pacientes..." />;

// Aquí dibujamos todo lo que se ve en pantalla.
  return (
    <div id="panelAdmin" className="panelAdmin">
      {/* El título de arriba. */}
      <div className="panelAdminEncabezado">
        <h1 className="panelAdminTitulo">Panel de Administración</h1>
        <p className="panelAdminSubtitulo">Gestión integral de Pacientes y Citas</p>
      </div>

      {/* Los botones para cambiar de lugar. */}
      <div className="panelAdminPestanas">
        <button
          id="pestanaPacientes"
          className={`panelAdminPestana ${pestanaActiva === "pacientes" ? "panelAdminPestanaActiva" : ""}`}
          onClick={() => setPestanaActiva("pacientes")}
        >
          <Users size={16} />
          <span>Pacientes</span>
        </button>
        <button
          id="pestanaCitas"
          className={`panelAdminPestana ${pestanaActiva === "citas" ? "panelAdminPestanaActiva" : ""}`}
          onClick={() => setPestanaActiva("citas")}
        >
          <CalendarDays size={16} />
          <span>Citas Solicitadas</span>
        </button>
        <button
          id="pestanaUsuarios"
          className={`panelAdminPestana ${pestanaActiva === "usuarios" ? "panelAdminPestanaActiva" : ""}`}
          onClick={() => setPestanaActiva("usuarios")}
        >
          <Shield size={16} />
          <span>Gestión de Usuarios</span>
        </button>
      </div>

      {/* Sección para cuidar a los pacientes. */}
      {pestanaActiva === "pacientes" && (
        <>
          {/* Un aviso si algo sale mal. */}
          {mensajeError && (
            <div className="mensajeError">
              <AlertCircle size={16} />
              <span>{mensajeError}</span>
            </div>
          )}

          {/* Botón para agregar y contador. */}
          <div className="panelAdminAcciones">
            <button
              id="botonCrearPaciente"
              className="formularioBoton formularioBotonPrimario"
              onClick={abrirFormularioCrear}
            >
              <UserPlus size={18} />
              <span>Nuevo Paciente</span>
            </button>
            <span className="panelAdminContador">
              Total: {pacientes.length} pacientes
            </span>
          </div>

          {/* La ventanita para anotar datos. */}
          {mostrarFormulario && (
            <div className="panelAdminModal">
              <div className="panelAdminModalContenido">
                <h2 className="panelAdminModalTitulo">
                  {pacienteEditando ? "Editar Paciente" : "Nuevo Paciente"}
                </h2>

                {/* Aviso si olvidaste escribir algo. */}
                {errorFormulario && (
                  <div className="mensajeError">
                    <AlertCircle size={16} />
                    <span>{errorFormulario}</span>
                  </div>
                )}

                <div id="formularioPaciente" className="formulario">
                  {/* Para poner el nombre. */}
                  <div className="formularioGrupo">
                    <label htmlFor="campoNombrePaciente" className="formularioEtiqueta">
                      <User size={14} />
                      <span>Nombre Completo</span>
                    </label>
                    <input
                      id="campoNombrePaciente"
                      type="text"
                      name="nombre"
                      className="formularioCampo"
                      placeholder="Nombre del paciente"
                      value={formulario.nombre}
                      onChange={manejarCambio}
                    />
                  </div>

                  {/* Para poner edad y número. */}
                  <div className="formularioFila">
                    <div className="formularioGrupo">
                      <label htmlFor="campoEdadPaciente" className="formularioEtiqueta">
                        <span>Edad</span>
                      </label>
                      <input
                        id="campoEdadPaciente"
                        type="number"
                        name="edad"
                        className="formularioCampo"
                        placeholder="Edad"
                        value={formulario.edad}
                        onChange={manejarCambio}
                      />
                    </div>

                    <div className="formularioGrupo">
                      <label htmlFor="campoTelefonoPaciente" className="formularioEtiqueta">
                        <Phone size={14} />
                        <span>Teléfono</span>
                      </label>
                      <input
                        id="campoTelefonoPaciente"
                        type="text"
                        name="telefono"
                        className="formularioCampo"
                        placeholder="555-0000"
                        value={formulario.telefono}
                        onChange={manejarCambio}
                      />
                    </div>
                  </div>

                  {/* Para poner el email. */}
                  <div className="formularioGrupo">
                    <label htmlFor="campoCorreoPaciente" className="formularioEtiqueta">
                      <Mail size={14} />
                      <span>Correo</span>
                    </label>
                    <input
                      id="campoCorreoPaciente"
                      type="email"
                      name="correo"
                      className="formularioCampo"
                      placeholder="correo@ejemplo.com"
                      value={formulario.correo}
                      onChange={manejarCambio}
                    />
                  </div>

                  {/* Para escribir qué le duele. */}
                  <div className="formularioGrupo">
                    <label htmlFor="campoDiagnosticoPaciente" className="formularioEtiqueta">
                      <FileText size={14} />
                      <span>Diagnóstico</span>
                    </label>
                    <textarea
                      id="campoDiagnosticoPaciente"
                      name="diagnostico"
                      className="formularioCampo formularioCampoArea"
                      placeholder="Diagnóstico o motivo de consulta"
                      value={formulario.diagnostico}
                      onChange={manejarCambio}
                      rows={3}
                    />
                  </div>

                  {/* Botones para guardar o salir. */}
                  <div className="formularioBotonesModal">
                    <button
                      type="button"
                      className="formularioBoton formularioBotonPrimario"
                      onClick={manejarEnvio}
                    >
                      <Save size={16} />
                      <span>{pacienteEditando ? "Guardar Cambios" : "Crear Paciente"}</span>
                    </button>
                    <button
                      type="button"
                      className="formularioBoton formularioBotonSecundario"
                      onClick={limpiarFormulario}
                    >
                      <X size={16} />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* La lista de todas las personas. */}
          <div className="panelAdminTabla">
            {pacientes.length === 0 ? (
              <div className="panelAdminVacio">
                <Users size={40} strokeWidth={1.5} />
                <p>No hay pacientes registrados aún.</p>
              </div>
            ) : (
              <table id="tablaPacientes" className="tabla">
                <thead className="tablaEncabezado">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Diagnóstico</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="tablaCuerpo">
                  {pacientes.map((paciente) => (
                    <tr key={paciente.id} className="tablaFila">
                      <td className="tablaCelda">{paciente.id}</td>
                      <td className="tablaCelda">{paciente.nombre}</td>
                      <td className="tablaCelda">{paciente.edad}</td>
                      <td className="tablaCelda">{paciente.telefono}</td>
                      <td className="tablaCelda">{paciente.correo}</td>
                      <td className="tablaCelda">{paciente.diagnostico}</td>
                      <td className="tablaCelda">{paciente.fechaRegistro}</td>
                      <td className="tablaCelda tablaCeldaAcciones">
                        <button
                          className="botonAccion botonAccionEditar"
                          onClick={() => abrirFormularioEditar(paciente)}
                        >
                          <Pencil size={13} />
                          <span>Editar</span>
                        </button>
                        <button
                          className="botonAccion botonAccionEliminar"
                          onClick={() => manejarEliminar(paciente)}
                        >
                          <Trash2 size={13} />
                          <span>Eliminar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Sección para ver las citas. */}
      {pestanaActiva === "citas" && <AdminCitas />}

      {/* Sección para cuidar a los usuarios. */}
      {pestanaActiva === "usuarios" && <AdminUsuarios />}
    </div>
  );
}

export default PanelAdmin;
