import { useState, useEffect } from "react";
import { useAutenticacion } from "../../context/ContextoAutenticacion";
import ServicioCitas from "../../services/ServicioCitas";
import ServicioPacientes from "../../services/ServicioPacientes";
import IndicadorCarga from "../common/IndicadorCarga";
import { CalendarPlus, X, CalendarDays, Clock, FileText, AlertCircle, ClipboardList, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/userStyles/Citas.css";

// Aquí los clientes piden, miran o borran sus citas.
function Citas() {
  // Aquí guardamos los datos de tus citas.
  const { usuario } = useAutenticacion();
  const [listaCitas, setListaCitas] = useState<any[]>([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarFormularioNuevaCita, setMostrarFormularioNuevaCita] = useState(false);
  const [errorValidacionCita, setErrorValidacionCita] = useState("");

  // Aquí anotamos el día y la hora de tu cita.
  const [datosNuevaCita, setDatosNuevaCita] = useState({
    fechaCita: "",
    horaCita: "",
    motivoConsulta: "",
  });

  // Al abrir la página, buscamos tus citas.
  useEffect(() => {
    if (usuario?.id) {
      cargarHistorialCitas();
    }
  }, [usuario?.id]);

  // Estas cajitas de código sirven para mover los datos de tus citas.

  // Trae todas tus citas del internet.
  async function cargarHistorialCitas() {
    try {
      setEstaCargando(true);
      setMensajeError("");
      const idUsuarioStr = String(usuario.id);
      const citasRecibidas = await ServicioCitas.getCitas();
      setListaCitas(citasRecibidas.filter((cita: any) => String(cita.idUsuario) === idUsuarioStr));
    } catch (errorPeticion: any) {
      setMensajeError(`Hubo un error al cargar las citas: ${errorPeticion.message}`);
    } finally {
      setEstaCargando(false);
    }
  }

  // Revisa que hayas puesto el día, la hora y el motivo.
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

  // Anota lo que vas escribiendo en los cuadros.
  function manejarCambioCampo(eventoAsociado: any) {
    const { name, value } = eventoAsociado.target;
    setDatosNuevaCita((estadoAnterior) => ({ ...estadoAnterior, [name]: value }));
  }

  // Si eres nuevo, te anota en la lista de pacientes.
  async function validarYRegistrarComoPaciente() {
    try {
      const todosLosPacientes = await ServicioPacientes.getPacientes();
      const pacienteExistente = todosLosPacientes.find(
        (pacienteActual: any) => pacienteActual.correo === usuario.correo
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
        await ServicioPacientes.postPacientes(nuevoPerfilPaciente);
      }
    } catch (errorValidacion: any) {
      console.error("No se pudo registrar como paciente:", errorValidacion);
    }
  }

  // Envía tu pedido de cita al internet.
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
      await ServicioCitas.postCitas(informacionCitaNueva);

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
    } catch (errorEnvio: any) {
      Swal.fire({
        icon: "error",
        title: "Houston, tenemos un problema",
        text: `Error al crear cita: ${errorEnvio.message}`,
        confirmButtonColor: "#2563EB",
      });
      setErrorValidacionCita(`Ocurrió un error en el servidor: ${errorEnvio.message}`);
    }
  }

  // Borra tu cita si ya no quieres ir.
  async function confirmarEliminacionCita(citaSeleccionada: any) {
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
      await ServicioCitas.deleteCitas(citaSeleccionada.id);
      await cargarHistorialCitas();

      Swal.fire({
        icon: "success",
        title: "Cita médica cancelada",
        text: "Tu solicitud ha sido revocada de nuestra agenda.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (errorEliminacion: any) {
      Swal.fire({
        icon: "error",
        title: "No se pudo cancelar",
        text: `Error interno: ${errorEliminacion.message}`,
        confirmButtonColor: "#2563EB",
      });
    }
  }

  // Elige el color del aviso según cómo esté tu cita.
  function resolverEstiloEstadoColor(estadoCita: string) {
    const mapaEstilosEstado: Record<string, string> = {
      pendiente: "estadoCitaPendiente",
      confirmada: "estadoCitaConfirmada",
      cancelada: "estadoCitaCancelada",
    };
    return mapaEstilosEstado[estadoCita] || "";
  }

  // Si todavía está cargando, mostramos un aviso.
  if (estaCargando) {
    return <IndicadorCarga mensaje="Cargando tu historial de citas..." />;
  }

  // Aquí dibujamos todo lo que se ve en la pantalla.
  return (
    <div id="seccionCitasCliente" className="citasCliente">
      {/* El título de arriba. */}
      <div className="citasClienteEncabezado">
        <h1 className="citasClienteTitulo">Mis Citas</h1>
        <p className="citasClienteSubtitulo">Administra tu agenda de salud con IncreaseClinic</p>
      </div>

      {/* Un aviso si algo sale mal. */}
      {mensajeError && (
        <div className="mensajeError">
          <AlertCircle size={16} />
          <span>{mensajeError}</span>
        </div>
      )}

      {/* Botón para abrir o cerrar la ventana de citas. */}
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

      {/* La ventanita para pedir tu cita. */}
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
            {/* Para elegir el día y el momento. */}
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

            {/* Para contar por qué vienes al médico. */}
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

            {/* Botón para pedir la cita. */}
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

      {/* La lista de todas tus citas de antes. */}
      <div className="citasClienteLista">
        {listaCitas.length === 0 ? (
          <div className="citasClienteVacio">
            <ClipboardList size={40} strokeWidth={1.5} />
            <p>Aún no posees citas programadas.</p>
            <p>Puedes empezar agendando una utilizando el botón superior.</p>
          </div>
        ) : (
          listaCitas.map((registroCita: any) => (
            <div key={registroCita.id} className="citasClienteTarjeta">
              {/* Muestra si está aceptada y cuándo es. */}
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
              {/* Muestra por qué vas al médico. */}
              <div className="citasClienteTarjetaCuerpo">
                <p className="citasClienteTarjetaMotivo">
                  <strong>Detalle de visita:</strong> {registroCita.motivo}
                </p>
              </div>
              {/* Botón para borrar esta cita. */}
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
