import { useState, useEffect } from "react";
import ServicioCitas from "../../services/ServicioCitas";
import IndicadorCarga from "../common/IndicadorCarga";
import { AlertCircle, CheckCircle, XCircle, RotateCcw, Trash2, CalendarDays } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/adminStyles/AdminCitas.css";
import { Cita } from "../../services/ServicioCitas";

// Aquí el jefe mira y cambia las citas.
function AdminCitas() {
  // Aquí guardamos los datos de las citas.
  const [listaCitas, setListaCitas] = useState<Cita[]>([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");

  // Al empezar, buscamos todas las citas.
  useEffect(() => {
    cargarTodasLasCitas();
  }, []);

  // Estas cajitas de código mueven los datos de las citas.

  // Trae todas las citas del internet.
  async function cargarTodasLasCitas() {
    try {
      setEstaCargando(true);
      setMensajeError("");
      const citasRecibidas = await ServicioCitas.getCitas();
      setListaCitas(citasRecibidas);
    } catch (errorPeticion) {
      const errorMessage = errorPeticion instanceof Error ? errorPeticion.message : 'Error desconocido';
      setMensajeError(`Error al cargar las citas: ${errorMessage}`);
    } finally {
      setEstaCargando(false);
    }
  }

  // Cambia si la cita está lista, pendiente o cancelada.
  async function cambiarEstadoCita(citaSeleccionada: Cita, nuevoEstado: Cita["estado"]) {
    const alertaConfirmacion = await Swal.fire({
      icon: "question",
      title: `¿Cambiar estado a "${nuevoEstado}"?`,
      text: `Cita de ${citaSeleccionada.nombrePaciente} (${citaSeleccionada.fecha} - ${citaSeleccionada.hora})`,
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (!alertaConfirmacion.isConfirmed) return;

    try {
      const citaActualizada = { ...citaSeleccionada, estado: nuevoEstado }; // los 3 puntos "..." copian lo de antes para no borrar nada al escribir
      await ServicioCitas.patchCitas(citaActualizada, citaSeleccionada.id!);
      await cargarTodasLasCitas();

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `La cita fue marcada como "${nuevoEstado}".`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (errorActualizacion) {
      const errorMessage = errorActualizacion instanceof Error ? errorActualizacion.message : 'Error desconocido';
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: `No se pudo cambiar el estado: ${errorMessage}`,
        confirmButtonColor: "#2563EB",
      });
    }
  }

  // Borra una cita para siempre si el jefe quiere.
  async function confirmarEliminacionCita(citaSeleccionada: Cita) {
    const alertaConfirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar esta cita?",
      text: `Cita de ${citaSeleccionada.nombrePaciente} (${citaSeleccionada.fecha}). Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!alertaConfirmacion.isConfirmed) return;

    try {
      await ServicioCitas.deleteCitas(citaSeleccionada.id!);
      await cargarTodasLasCitas();

      Swal.fire({
        icon: "success",
        title: "Cita eliminada",
        text: "La cita fue eliminada permanentemente del sistema.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (errorEliminacion) {
      const errorMessage = errorEliminacion instanceof Error ? errorEliminacion.message : 'Error desconocido';
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: errorMessage,
        confirmButtonColor: "#2563EB",
      });
    }
  }

  // Elige el color del aviso según cómo esté la cita.
  function resolverEstiloEstado(estadoCita: string) {
    const mapaEstilos: Record<string, string> = {
      pendiente: "estadoCitaPendiente",
      confirmada: "estadoCitaConfirmada",
      cancelada: "estadoCitaCancelada",
    };
    return mapaEstilos[estadoCita] || "";
  }

  // Si todavía está cargando, mostramos un aviso.
  if (estaCargando) {
    return <IndicadorCarga mensaje="Cargando todas las citas..." />;
  }

  // Aquí dibujamos lo que se ve en la pantalla.
  return (
    <div id="adminCitasContenedor" className="panelAdmin">
      {/* Un aviso si algo sale mal. */}
      {mensajeError && (
        <div className="mensajeError">
          <AlertCircle size={16} />
          <span>{mensajeError}</span>
        </div>
      )}

      {/* Dice cuántas citas hay en total. */}
      <div className="panelAdminAcciones">
        <span className="panelAdminContador">
          Total: {listaCitas.length} citas
        </span>
      </div>

      {/* La lista de citas o un aviso si no hay ninguna. */}
      <div className="panelAdminTabla">
        {listaCitas.length === 0 ? (
          <div className="panelAdminVacio">
            <CalendarDays size={40} strokeWidth={1.5} />
            <p>No hay citas solicitadas aún.</p>
          </div>
        ) : (
          <table id="tablaCitasAdmin" className="tabla">
            <thead className="tablaEncabezado">
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="tablaCuerpo">
              {listaCitas.map((cita) => (
                <tr key={cita.id} className="tablaFila">
                  <td className="tablaCelda">{cita.id}</td>
                  <td className="tablaCelda">{cita.nombrePaciente}</td>
                  <td className="tablaCelda">{cita.fecha}</td>
                  <td className="tablaCelda">{cita.hora}</td>
                  <td className="tablaCelda">{cita.motivo}</td>
                  <td className="tablaCelda">
                    <span className={`estadoCita ${resolverEstiloEstado(cita.estado)}`}>
                      {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </span>
                  </td>
                  <td className="tablaCelda tablaCeldaAcciones">
                    {/* Botón para decir que la cita está bien. */}
                    {cita.estado !== "confirmada" && (
                      <button
                        className="botonAccion botonAccionEditar"
                        onClick={() => cambiarEstadoCita(cita, "confirmada")}
                      >
                        <CheckCircle size={13} />
                        <span>Confirmar</span>
                      </button>
                    )}
                    {/* Botón para decir que la cita no se hace. */}
                    {cita.estado !== "cancelada" && (
                      <button
                        className="botonAccion botonAccionCancelar"
                        onClick={() => cambiarEstadoCita(cita, "cancelada")}
                      >
                        <XCircle size={13} />
                        <span>Cancelar</span>
                      </button>
                    )}
                    {/* Botón para poner la cita en espera. */}
                    {cita.estado !== "pendiente" && (
                      <button
                        className="botonAccion botonAccionPendiente"
                        onClick={() => cambiarEstadoCita(cita, "pendiente")}
                      >
                        <RotateCcw size={13} />
                        <span>Pendiente</span>
                      </button>
                    )}
                    {/* Botón para borrar la cita de la lista. */}
                    <button
                      className="botonAccion botonAccionEliminar"
                      onClick={() => confirmarEliminacionCita(cita)}
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
    </div>
  );
}

export default AdminCitas;
