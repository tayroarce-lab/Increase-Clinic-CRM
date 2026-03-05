import { useState, useEffect } from "react";
import {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from "../services/ServicioPacientes";
import IndicadorCarga from "./IndicadorCarga";
import AdminCitas from "./AdminCitas";
import { Users, CalendarDays, UserPlus, AlertCircle, Pencil, Trash2, User, Phone, Mail, FileText, Save, X } from "lucide-react";
import Swal from "sweetalert2";

/**
 * PanelAdmin - Componente principal del panel de administración.
 * Contiene dos pestañas:
 *   1. Gestión de Pacientes (CRUD completo)
 *   2. Gestión de Citas (ver todas las citas solicitadas y cambiar su estado)
 */
function PanelAdmin() {
  // --- Estados del componente ---
  const [pacientes, setPacientes] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState("");

  /** Pestaña activa: "pacientes" o "citas" */
  const [pestanaActiva, setPestanaActiva] = useState("pacientes");

  /** Estado del formulario de pacientes */
  const [formulario, setFormulario] = useState({
    nombre: "",
    edad: "",
    telefono: "",
    correo: "",
    diagnostico: "",
  });

  // --- Efecto: carga inicial de pacientes ---
  useEffect(() => {
    cargarPacientes();
  }, []);

  // --- Funciones de gestión de pacientes ---

  /**
   * Obtiene la lista de todos los pacientes desde el servidor.
   */
  async function cargarPacientes() {
    try {
      setEstaCargando(true);
      setMensajeError("");
      const datos = await obtenerPacientes();
      setPacientes(datos);
    } catch (errorPeticion) {
      setMensajeError("Error al cargar los pacientes: " + errorPeticion.message);
    } finally {
      setEstaCargando(false);
    }
  }

  /**
   * Limpia todos los campos del formulario y cierra el modal.
   */
  function limpiarFormulario() {
    setFormulario({ nombre: "", edad: "", telefono: "", correo: "", diagnostico: "" });
    setPacienteEditando(null);
    setMostrarFormulario(false);
    setErrorFormulario("");
  }

  /**
   * Abre el formulario vacío para crear un nuevo paciente.
   */
  function abrirFormularioCrear() {
    limpiarFormulario();
    setMostrarFormulario(true);
  }

  /**
   * Abre el formulario pre-llenado con los datos de un paciente existente.
   * @param {Object} pacienteSeleccionado - El paciente que se desea editar.
   */
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

  /**
   * Valida que los campos obligatorios del formulario de paciente estén completos.
   * @returns {boolean} true si el formulario es válido.
   */
  function validarFormulario() {
    if (!formulario.nombre.trim()) {
      setErrorFormulario("El nombre es obligatorio");
      return false;
    }
    if (!formulario.edad || isNaN(formulario.edad) || Number(formulario.edad) <= 0) {
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

  /**
   * Actualiza el estado del formulario conforme el admin escribe en los campos.
   * @param {Event} evento - Evento de cambio del input.
   */
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setFormulario((estadoAnterior) => ({ ...estadoAnterior, [name]: value }));
  }

  /**
   * Envía los datos del formulario al servidor.
   */
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
        await actualizarPaciente(pacienteEditando.id, datosPaciente);
        Swal.fire({
          icon: "success",
          title: "Paciente actualizado",
          text: `Los datos de ${formulario.nombre} han sido actualizados`,
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await crearPaciente(datosPaciente);
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

  /**
   * Elimina un paciente permanentemente tras confirmación del admin.
   * @param {Object} pacienteSeleccionado - El paciente que se desea eliminar.
   */
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
      await eliminarPaciente(pacienteSeleccionado.id);
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

  // --- Renderizado condicional: estado de carga ---
  if (estaCargando) return <IndicadorCarga mensaje="Cargando pacientes..." />;

  // --- Renderizado principal ---
  return (
    <div id="panelAdmin" className="panelAdmin">
      {/* Encabezado del panel */}
      <div className="panelAdmin__encabezado">
        <h1 className="panelAdmin__titulo">Panel de Administración</h1>
        <p className="panelAdmin__subtitulo">Gestión integral de Pacientes y Citas</p>
      </div>

      {/* Pestañas de navegación interna con iconos */}
      <div className="panelAdmin__pestanas">
        <button
          id="pestanaPacientes"
          className={`panelAdmin__pestana ${pestanaActiva === "pacientes" ? "panelAdmin__pestana--activa" : ""}`}
          onClick={() => setPestanaActiva("pacientes")}
        >
          <Users size={16} />
          <span>Pacientes</span>
        </button>
        <button
          id="pestanaCitas"
          className={`panelAdmin__pestana ${pestanaActiva === "citas" ? "panelAdmin__pestana--activa" : ""}`}
          onClick={() => setPestanaActiva("citas")}
        >
          <CalendarDays size={16} />
          <span>Citas Solicitadas</span>
        </button>
      </div>

      {/* ============================== */}
      {/* PESTAÑA: Gestión de Pacientes  */}
      {/* ============================== */}
      {pestanaActiva === "pacientes" && (
        <>
          {/* Mensaje de error global */}
          {mensajeError && (
            <div className="mensajeError">
              <AlertCircle size={16} />
              <span>{mensajeError}</span>
            </div>
          )}

          {/* Barra de acciones: crear + contador */}
          <div className="panelAdmin__acciones">
            <button
              id="botonCrearPaciente"
              className="formulario__boton formulario__boton--primario"
              onClick={abrirFormularioCrear}
            >
              <UserPlus size={18} />
              <span>Nuevo Paciente</span>
            </button>
            <span className="panelAdmin__contador">
              Total: {pacientes.length} pacientes
            </span>
          </div>

          {/* Modal de formulario (crear / editar paciente) */}
          {mostrarFormulario && (
            <div className="panelAdmin__modal">
              <div className="panelAdmin__modalContenido">
                <h2 className="panelAdmin__modalTitulo">
                  {pacienteEditando ? "Editar Paciente" : "Nuevo Paciente"}
                </h2>

                {/* Error de validación del formulario */}
                {errorFormulario && (
                  <div className="mensajeError">
                    <AlertCircle size={16} />
                    <span>{errorFormulario}</span>
                  </div>
                )}

                <div id="formularioPaciente" className="formulario">
                  {/* Campo: Nombre Completo */}
                  <div className="formulario__grupo">
                    <label htmlFor="campoNombrePaciente" className="formulario__etiqueta">
                      <User size={14} />
                      <span>Nombre Completo</span>
                    </label>
                    <input
                      id="campoNombrePaciente"
                      type="text"
                      name="nombre"
                      className="formulario__campo"
                      placeholder="Nombre del paciente"
                      value={formulario.nombre}
                      onChange={manejarCambio}
                    />
                  </div>

                  {/* Fila: Edad + Teléfono */}
                  <div className="formulario__fila">
                    <div className="formulario__grupo">
                      <label htmlFor="campoEdadPaciente" className="formulario__etiqueta">
                        <span>Edad</span>
                      </label>
                      <input
                        id="campoEdadPaciente"
                        type="number"
                        name="edad"
                        className="formulario__campo"
                        placeholder="Edad"
                        value={formulario.edad}
                        onChange={manejarCambio}
                      />
                    </div>

                    <div className="formulario__grupo">
                      <label htmlFor="campoTelefonoPaciente" className="formulario__etiqueta">
                        <Phone size={14} />
                        <span>Teléfono</span>
                      </label>
                      <input
                        id="campoTelefonoPaciente"
                        type="text"
                        name="telefono"
                        className="formulario__campo"
                        placeholder="555-0000"
                        value={formulario.telefono}
                        onChange={manejarCambio}
                      />
                    </div>
                  </div>

                  {/* Campo: Correo */}
                  <div className="formulario__grupo">
                    <label htmlFor="campoCorreoPaciente" className="formulario__etiqueta">
                      <Mail size={14} />
                      <span>Correo</span>
                    </label>
                    <input
                      id="campoCorreoPaciente"
                      type="email"
                      name="correo"
                      className="formulario__campo"
                      placeholder="correo@ejemplo.com"
                      value={formulario.correo}
                      onChange={manejarCambio}
                    />
                  </div>

                  {/* Campo: Diagnóstico */}
                  <div className="formulario__grupo">
                    <label htmlFor="campoDiagnosticoPaciente" className="formulario__etiqueta">
                      <FileText size={14} />
                      <span>Diagnóstico</span>
                    </label>
                    <textarea
                      id="campoDiagnosticoPaciente"
                      name="diagnostico"
                      className="formulario__campo formulario__campo--area"
                      placeholder="Diagnóstico o motivo de consulta"
                      value={formulario.diagnostico}
                      onChange={manejarCambio}
                      rows={3}
                    />
                  </div>

                  {/* Botones del modal: guardar / cancelar */}
                  <div className="formulario__botonesModal">
                    <button
                      type="button"
                      className="formulario__boton formulario__boton--primario"
                      onClick={manejarEnvio}
                    >
                      <Save size={16} />
                      <span>{pacienteEditando ? "Guardar Cambios" : "Crear Paciente"}</span>
                    </button>
                    <button
                      type="button"
                      className="formulario__boton formulario__boton--secundario"
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

          {/* Tabla de pacientes registrados */}
          <div className="panelAdmin__tabla">
            {pacientes.length === 0 ? (
              <div className="panelAdmin__vacio">
                <Users size={40} strokeWidth={1.5} />
                <p>No hay pacientes registrados aún.</p>
              </div>
            ) : (
              <table id="tablaPacientes" className="tabla">
                <thead className="tabla__encabezado">
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
                <tbody className="tabla__cuerpo">
                  {pacientes.map((paciente) => (
                    <tr key={paciente.id} className="tabla__fila">
                      <td className="tabla__celda">{paciente.id}</td>
                      <td className="tabla__celda">{paciente.nombre}</td>
                      <td className="tabla__celda">{paciente.edad}</td>
                      <td className="tabla__celda">{paciente.telefono}</td>
                      <td className="tabla__celda">{paciente.correo}</td>
                      <td className="tabla__celda">{paciente.diagnostico}</td>
                      <td className="tabla__celda">{paciente.fechaRegistro}</td>
                      <td className="tabla__celda tabla__celda--acciones">
                        <button
                          className="botonAccion botonAccion--editar"
                          onClick={() => abrirFormularioEditar(paciente)}
                        >
                          <Pencil size={13} />
                          <span>Editar</span>
                        </button>
                        <button
                          className="botonAccion botonAccion--eliminar"
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

      {/* ========================== */}
      {/* PESTAÑA: Gestión de Citas  */}
      {/* ========================== */}
      {pestanaActiva === "citas" && <AdminCitas />}
    </div>
  );
}

export default PanelAdmin;
