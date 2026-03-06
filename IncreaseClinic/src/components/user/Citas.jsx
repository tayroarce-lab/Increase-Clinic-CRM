import { useState, useEffect } from "react";
import { useAutenticacion } from "../../context/ContextoAutenticacion";
import { obtenerCitasPorUsuario, crearCita, eliminarCita } from "../../services/ServicioCitas";
import { obtenerPacientes, crearPaciente } from "../../services/ServicioPacientes";
import IndicadorCarga from "../common/IndicadorCarga";
import { CalendarPlus, X, CalendarDays, Clock, FileText, AlertCircle, ClipboardList, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/userStyles/Citas.css";

/**
 * Citas - Componente para que el cliente visualice, solicite y cancele sus citas.
 * Se comunica con la API para obtener las citas filtradas por el ID del usuario actual.
 */
function Citas() {
  // --- Estados del componente ---
  const { usuario } = useAutenticacion();
  const [listaCitas, setListaCitas] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarFormularioNuevaCita, setMostrarFormularioNuevaCita] = useState(false);
  const [errorValidacionCita, setErrorValidacionCita] = useState("");

  /** Datos del formulario de nueva cita */
  const [datosNuevaCita, setDatosNuevaCita] = useState({
    fechaCita: "",
    horaCita: "",
    motivoConsulta: "",
  });

  // --- Efecto: cargar citas al montar o cuando cambia el usuario ---
  useEffect(() => {
    if (usuario?.id) {
      cargarHistorialCitas();
    }
  }, [usuario?.id]);

  // --- Funciones principales ---

  /**
   * Obtiene la lista de citas del servidor filtradas por el ID del usuario actual.
   */
  async function cargarHistorialCitas() {
    try {
      setEstaCargando(true);
      setMensajeError("");
      const idUsuarioStr = String(usuario.id);
      const citasRecibidas = await obtenerCitasPorUsuario(idUsuarioStr);
      setListaCitas(citasRecibidas);
    } catch (errorPeticion) {
      setMensajeError(`Hubo un error al cargar las citas: ${errorPeticion.message}`);
    } finally {
      setEstaCargando(false);
    }
  }

  /**
   * Valida que todos los campos del formulario de nueva cita estén llenos.
   * @returns {boolean} true si el formulario es válido.
   */
  function validarCamposCita() {
    if (!datosNuevaCita.fechaCita) {
      setErrorValidacionCita("Seleccionar una fecha es obligatorio");
      return false;
    }
    if (!datosNuevaCita.horaCita) {
      setErrorValidacionCita("Seleccionar una hora es obligatorio");
      return false;
    }
    if (!datosNuevaCita.motivoConsulta.trim()) {
      setErrorValidacionCita("Describir el motivo de la cita es obligatorio");
      return false;
    }
    return true;
  }

  /**
   * Actualiza el estado local con los valores que el usuario escribe en los campos.
   * @param {Event} eventoAsociado - Evento de cambio del input.
   */
  function manejarCambioCampo(eventoAsociado) {
    const { name, value } = eventoAsociado.target;
    setDatosNuevaCita((estadoAnterior) => ({ ...estadoAnterior, [name]: value }));
  }

  /**
   * Verifica si el usuario actual ya existe en la colección de "pacientes".
   * Si no existe, lo registra automáticamente basándose en sus datos de usuario.
   */
  async function validarYRegistrarComoPaciente() {
    try {
      const todosLosPacientes = await obtenerPacientes();
      const pacienteExistente = todosLosPacientes.find(
        (pacienteActual) => pacienteActual.correo === usuario.correo
      );

      if (!pacienteExistente) {
        const nuevoPerfilPaciente = {
          nombre: usuario.nombreCompleto || usuario.nombreUsuario,
          edad: 0,
          telefono: "Por definir",
          correo: usuario.correo,
          diagnostico: "Paciente registrado automáticamente al solicitar cita",
          fechaRegistro: new Date().toISOString().split("T")[0],
        };
        await crearPaciente(nuevoPerfilPaciente);
      }
    } catch (errorValidacion) {
      console.error("No se pudo registrar como paciente:", errorValidacion);
    }
  }

  /**
   * Procesa la solicitud de una nueva cita.
   */
  async function enviarSolicitudCita() {
    setErrorValidacionCita("");

    if (!validarCamposCita()) return;

    const informacionCitaNueva = {
      idUsuario: String(usuario.id),
      nombrePaciente: usuario.nombreCompleto || usuario.nombreUsuario,
      fecha: datosNuevaCita.fechaCita,
      hora: datosNuevaCita.horaCita,
      motivo: datosNuevaCita.motivoConsulta,
      estado: "pendiente",
    };

    try {
      await validarYRegistrarComoPaciente();
      await crearCita(informacionCitaNueva);

      setDatosNuevaCita({ fechaCita: "", horaCita: "", motivoConsulta: "" });
      setMostrarFormularioNuevaCita(false);
      await cargarHistorialCitas();

      Swal.fire({
        icon: "success",
        title: "¡Cita solicitada exitosamente!",
        text: `Se registró tu cita para el ${informacionCitaNueva.fecha} a las ${informacionCitaNueva.hora}`,
        timer: 2300,
        showConfirmButton: false,
      });
    } catch (errorEnvio) {
      Swal.fire({
        icon: "error",
        title: "Houston, tenemos un problema",
        text: `Error al crear cita: ${errorEnvio.message}`,
        confirmButtonColor: "#2563EB",
      });
      setErrorValidacionCita(`Ocurrió un error en el servidor: ${errorEnvio.message}`);
    }
  }

  /**
   * Cancela y elimina una cita tras pedir confirmación al usuario.
   * @param {Object} citaSeleccionada - La cita que se desea cancelar.
   */
  async function confirmarEliminacionCita(citaSeleccionada) {
    const alertaConfirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Deseas cancelar esta cita médica?",
      text: `Está agendada el ${citaSeleccionada.fecha} a las ${citaSeleccionada.hora} por: ${citaSeleccionada.motivo}`,
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Mantener cita",
    });

    if (!alertaConfirmacion.isConfirmed) return;

    try {
      await eliminarCita(citaSeleccionada.id);
      await cargarHistorialCitas();

      Swal.fire({
        icon: "success",
        title: "Cita médica cancelada",
        text: "Tu solicitud ha sido revocada de nuestra agenda.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (errorEliminacion) {
      Swal.fire({
        icon: "error",
        title: "No se pudo cancelar",
        text: `Error interno: ${errorEliminacion.message}`,
        confirmButtonColor: "#2563EB",
      });
    }
  }

  /**
   * Retorna la clase CSS que pinta el badge según el estado de la cita.
   * @param {string} estadoCita - "pendiente", "confirmada" o "cancelada".
   * @returns {string} La clase CSS correspondiente.
   */
  function resolverEstiloEstadoColor(estadoCita) {
    const mapaEstilosEstado = {
      pendiente: "estadoCitaPendiente",
      confirmada: "estadoCitaConfirmada",
      cancelada: "estadoCitaCancelada",
    };
    return mapaEstilosEstado[estadoCita] || "";
  }

  // --- Renderizado condicional: estado de carga ---
  if (estaCargando) {
    return <IndicadorCarga mensaje="Cargando tu historial de citas..." />;
  }

  // --- Renderizado principal ---
  return (
    <div id="seccionCitasCliente" className="citasCliente">
      {/* Encabezado de la sección */}
      <div className="citasClienteEncabezado">
        <h1 className="citasClienteTitulo">Mis Citas</h1>
        <p className="citasClienteSubtitulo">Administra tu agenda de salud con IncreaseClinic</p>
      </div>

      {/* Mensaje de error global */}
      {mensajeError && (
        <div className="mensajeError">
          <AlertCircle size={16} />
          <span>{mensajeError}</span>
        </div>
      )}

      {/* Botón para mostrar/ocultar el formulario de nueva cita */}
      <div className="citasClienteAcciones">
        <button
          id="botonAgendarCita"
          className="formularioBoton formularioBotonPrimario"
          onClick={() => setMostrarFormularioNuevaCita(!mostrarFormularioNuevaCita)}
        >
          {mostrarFormularioNuevaCita ? (
            <>
              <X size={18} />
              <span>Cancelar Solicitud</span>
            </>
          ) : (
            <>
              <CalendarPlus size={18} />
              <span>Agendar Nueva Cita</span>
            </>
          )}
        </button>
      </div>

      {/* Formulario de solicitud de nueva cita */}
      {mostrarFormularioNuevaCita && (
        <div className="citasClienteFormularioContenedor">
          <h2 className="citasClienteFormularioTitulo">Datos de Nueva Cita</h2>

          {errorValidacionCita && (
            <div className="mensajeError">
              <AlertCircle size={16} />
              <span>{errorValidacionCita}</span>
            </div>
          )}

          <div id="cuerpoFormularioCita" className="formulario">
            {/* Fila: Fecha + Hora */}
            <div className="formularioFila">
              <div className="formularioGrupo">
                <label htmlFor="inputFechaCita" className="formularioEtiqueta">
                  <CalendarDays size={14} />
                  <span>Fecha Deseada</span>
                </label>
                <input
                  id="inputFechaCita"
                  type="date"
                  name="fechaCita"
                  className="formularioCampo"
                  value={datosNuevaCita.fechaCita}
                  onChange={manejarCambioCampo}
                />
              </div>

              <div className="formularioGrupo">
                <label htmlFor="inputHoraCita" className="formularioEtiqueta">
                  <Clock size={14} />
                  <span>Hora Sugerida</span>
                </label>
                <input
                  id="inputHoraCita"
                  type="time"
                  name="horaCita"
                  className="formularioCampo"
                  value={datosNuevaCita.horaCita}
                  onChange={manejarCambioCampo}
                />
              </div>
            </div>

            {/* Campo: Motivo de la visita */}
            <div className="formularioGrupo">
              <label htmlFor="inputAreaMotivo" className="formularioEtiqueta">
                <FileText size={14} />
                <span>¿Por qué nos visitas? (Motivo)</span>
              </label>
              <textarea
                id="inputAreaMotivo"
                name="motivoConsulta"
                className="formularioCampo formularioCampoArea"
                placeholder="Por favor, describe los síntomas o el propósito de tu visita..."
                value={datosNuevaCita.motivoConsulta}
                onChange={manejarCambioCampo}
                rows={3}
              />
            </div>

            {/* Botón de confirmación */}
            <button
              id="botonConfirmarCita"
              type="button"
              className="formularioBoton formularioBotonPrimario"
              onClick={enviarSolicitudCita}
            >
              <CalendarPlus size={18} />
              <span>Confirmar Solicitud de Cita</span>
            </button>
          </div>
        </div>
      )}

      {/* Historial de citas del usuario */}
      <div className="citasClienteLista">
        {listaCitas.length === 0 ? (
          <div className="citasClienteVacio">
            <ClipboardList size={40} strokeWidth={1.5} />
            <p>Aún no posees citas programadas.</p>
            <p>Puedes empezar agendando una utilizando el botón superior.</p>
          </div>
        ) : (
          listaCitas.map((registroCita) => (
            <div key={registroCita.id} className="citasClienteTarjeta">
              {/* Encabezado: Estado + Fecha/Hora */}
              <div className="citasClienteTarjetaEncabezado">
                <span className={`estadoCita ${resolverEstiloEstadoColor(registroCita.estado)}`}>
                  {registroCita.estado.charAt(0).toUpperCase() + registroCita.estado.slice(1)}
                </span>
                <span className="citasClienteTarjetaFecha">
                  <CalendarDays size={14} />
                  {registroCita.fecha}
                  <Clock size={14} style={{ marginLeft: "0.5rem" }} />
                  {registroCita.hora}
                </span>
              </div>
              {/* Cuerpo: Motivo */}
              <div className="citasClienteTarjetaCuerpo">
                <p className="citasClienteTarjetaMotivo">
                  <strong>Detalle de visita:</strong> {registroCita.motivo}
                </p>
              </div>
              {/* Acciones: botón para revocar la cita */}
              <div className="citasClienteTarjetaAcciones">
                <button
                  id={`botonCancelar-${registroCita.id}`}
                  className="botonAccion botonAccionEliminar"
                  onClick={() => confirmarEliminacionCita(registroCita)}
                >
                  <XCircle size={14} />
                  <span>Revocar Cita</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Citas;
