import { useState, useEffect } from "react";
import { useAutenticacion } from "../context/ContextoAutenticacion";
import { obtenerCitasPorUsuario, crearCita, eliminarCita } from "../services/ServicioCitas";
import IndicadorCarga from "../components/IndicadorCarga";
import Swal from "sweetalert2";

function CitasCliente() {
  const { usuario } = useAutenticacion();
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");

  const [formulario, setFormulario] = useState({
    fecha: "",
    hora: "",
    motivo: "",
  });

  useEffect(() => {
    cargarCitas();
  }, []);

  async function cargarCitas() {
    try {
      setCargando(true);
      setError("");
      const datos = await obtenerCitasPorUsuario(usuario.id);
      setCitas(datos);
    } catch (error) {
      setError("Error al cargar las citas: " + error.message);
    } finally {
      setCargando(false);
    }
  }

  function validarFormulario() {
    if (!formulario.fecha) {
      setErrorFormulario("La fecha es obligatoria");
      return false;
    }
    if (!formulario.hora) {
      setErrorFormulario("La hora es obligatoria");
      return false;
    }
    if (!formulario.motivo.trim()) {
      setErrorFormulario("El motivo es obligatorio");
      return false;
    }
    return true;
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  async function manejarEnvio() {
    setErrorFormulario("");

    if (!validarFormulario()) return;

    const datosCita = {
      idUsuario: usuario.id,
      nombrePaciente: usuario.nombreCompleto || usuario.nombreUsuario,
      fecha: formulario.fecha,
      hora: formulario.hora,
      motivo: formulario.motivo,
      estado: "pendiente",
    };

    try {
      await crearCita(datosCita);
      setFormulario({ fecha: "", hora: "", motivo: "" });
      setMostrarFormulario(false);
      await cargarCitas();

      Swal.fire({
        icon: "success",
        title: "¡Cita solicitada!",
        text: `Tu cita para el ${datosCita.fecha} a las ${datosCita.hora} ha sido registrada`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo solicitar la cita: " + error.message,
        confirmButtonColor: "#2563EB",
      });
      setErrorFormulario("Error al solicitar cita: " + error.message);
    }
  }

  async function manejarCancelarCita(cita) {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "¿Cancelar esta cita?",
      text: `Cita del ${cita.fecha} a las ${cita.hora} — ${cita.motivo}`,
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, cancelar cita",
      cancelButtonText: "No, mantener",
    });

    if (!resultado.isConfirmed) return;

    try {
      await eliminarCita(cita.id);
      await cargarCitas();
      Swal.fire({
        icon: "success",
        title: "Cita cancelada",
        text: "La cita ha sido cancelada correctamente",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cancelar la cita: " + error.message,
        confirmButtonColor: "#2563EB",
      });
    }
  }

  function obtenerClaseEstado(estado) {
    const clases = {
      pendiente: "estadoCita--pendiente",
      confirmada: "estadoCita--confirmada",
      cancelada: "estadoCita--cancelada",
    };
    return clases[estado] || "";
  }

  if (cargando) return <IndicadorCarga mensaje="Cargando citas..." />;

  return (
    <div id="citasCliente" className="citasCliente">
      <div className="citasCliente__encabezado">
        <h1 className="citasCliente__titulo">Mis Citas</h1>
        <p className="citasCliente__subtitulo">Gestiona tus citas médicas</p>
      </div>

      {error && (
        <div className="mensajeError">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="citasCliente__acciones">
        <button
          id="botonSolicitarCita"
          className="formulario__boton formulario__boton--primario"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "📅 Solicitar Cita"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="citasCliente__formularioContenedor">
          <h2 className="citasCliente__formularioTitulo">Nueva Cita</h2>

          {errorFormulario && (
            <div className="mensajeError">
              <span>⚠️</span> {errorFormulario}
            </div>
          )}

          <div id="formularioCita" className="formulario">
            <div className="formulario__fila">
              <div className="formulario__grupo">
                <label htmlFor="campoFechaCita" className="formulario__etiqueta">
                  Fecha
                </label>
                <input
                  id="campoFechaCita"
                  type="date"
                  name="fecha"
                  className="formulario__campo"
                  value={formulario.fecha}
                  onChange={manejarCambio}
                />
              </div>

              <div className="formulario__grupo">
                <label htmlFor="campoHoraCita" className="formulario__etiqueta">
                  Hora
                </label>
                <input
                  id="campoHoraCita"
                  type="time"
                  name="hora"
                  className="formulario__campo"
                  value={formulario.hora}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            <div className="formulario__grupo">
              <label htmlFor="campoMotivoCita" className="formulario__etiqueta">
                Motivo de la Cita
              </label>
              <textarea
                id="campoMotivoCita"
                name="motivo"
                className="formulario__campo formulario__campo--area"
                placeholder="Describe el motivo de tu cita"
                value={formulario.motivo}
                onChange={manejarCambio}
                rows={3}
              />
            </div>

            <button
              type="button"
              className="formulario__boton formulario__boton--primario"
              onClick={manejarEnvio}
            >
              Solicitar Cita
            </button>
          </div>
        </div>
      )}

      <div className="citasCliente__lista">
        {citas.length === 0 ? (
          <div className="citasCliente__vacio">
            <p>📋 No tienes citas programadas.</p>
            <p>Solicita una nueva cita usando el botón de arriba.</p>
          </div>
        ) : (
          citas.map((cita) => (
            <div key={cita.id} className="citasCliente__tarjeta">
              <div className="citasCliente__tarjetaEncabezado">
                <span className={`estadoCita ${obtenerClaseEstado(cita.estado)}`}>
                  {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                </span>
                <span className="citasCliente__tarjetaFecha">
                  📅 {cita.fecha} - 🕐 {cita.hora}
                </span>
              </div>
              <div className="citasCliente__tarjetaCuerpo">
                <p className="citasCliente__tarjetaMotivo">
                  <strong>Motivo:</strong> {cita.motivo}
                </p>
              </div>
              <div className="citasCliente__tarjetaAcciones">
                <button
                  className="botonAccion botonAccion--eliminar"
                  onClick={() => manejarCancelarCita(cita)}
                >
                  ❌ Cancelar Cita
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CitasCliente;
