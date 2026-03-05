import { useState, useEffect } from "react";
import {
  obtenerTodasLasCitas,
  actualizarCita,
  eliminarCita,
} from "../services/ServicioCitas";
import IndicadorCarga from "./IndicadorCarga";
import { AlertCircle, CheckCircle, XCircle, RotateCcw, Trash2, CalendarDays } from "lucide-react";
import Swal from "sweetalert2";

/**
 * AdminCitas - Componente para la gestión de citas desde el panel de administrador.
 * Permite al admin visualizar todas las citas solicitadas y cambiar su estado
 * (pendiente, confirmada, cancelada) o eliminarlas del sistema.
 */
function AdminCitas() {
  // --- Estados del componente ---
  const [listaCitas, setListaCitas] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");

  // --- Efecto: carga inicial de todas las citas ---
  useEffect(() => {
    cargarTodasLasCitas();
  }, []);

  // --- Funciones principales ---

  /**
   * Obtiene todas las citas del servidor sin importar el usuario.
   */
  async function cargarTodasLasCitas() {
    try {
      setEstaCargando(true);
      setMensajeError("");
      const citasRecibidas = await obtenerTodasLasCitas();
      setListaCitas(citasRecibidas);
    } catch (errorPeticion) {
      setMensajeError(`Error al cargar las citas: ${errorPeticion.message}`);
    } finally {
      setEstaCargando(false);
    }
  }

  /**
   * Cambia el estado de una cita y actualiza la lista visual.
   * @param {Object} citaSeleccionada - La cita cuyo estado se quiere modificar.
   * @param {string} nuevoEstado - El nuevo estado: "pendiente", "confirmada" o "cancelada".
   */
  async function cambiarEstadoCita(citaSeleccionada, nuevoEstado) {
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
      const citaActualizada = { ...citaSeleccionada, estado: nuevoEstado };
      await actualizarCita(citaSeleccionada.id, citaActualizada);
      await cargarTodasLasCitas();

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `La cita fue marcada como "${nuevoEstado}".`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (errorActualizacion) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: `No se pudo cambiar el estado: ${errorActualizacion.message}`,
        confirmButtonColor: "#2563EB",
      });
    }
  }

  /**
   * Elimina permanentemente una cita tras confirmación del admin.
   * @param {Object} citaSeleccionada - La cita que se quiere eliminar.
   */
  async function confirmarEliminacionCita(citaSeleccionada) {
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
      await eliminarCita(citaSeleccionada.id);
      await cargarTodasLasCitas();

      Swal.fire({
        icon: "success",
        title: "Cita eliminada",
        text: "La cita fue eliminada permanentemente del sistema.",
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

  /**
   * Retorna la clase CSS correspondiente al badge de estado de la cita.
   * @param {string} estadoCita - El estado actual.
   * @returns {string} La clase CSS asociada al estado.
   */
  function resolverEstiloEstado(estadoCita) {
    const mapaEstilos = {
      pendiente: "estadoCita--pendiente",
      confirmada: "estadoCita--confirmada",
      cancelada: "estadoCita--cancelada",
    };
    return mapaEstilos[estadoCita] || "";
  }

  // --- Renderizado condicional: estado de carga ---
  if (estaCargando) {
    return <IndicadorCarga mensaje="Cargando todas las citas..." />;
  }

  // --- Renderizado principal ---
  return (
    <div id="adminCitasContenedor" className="panelAdmin">
      {/* Mensaje de error si la petición falló */}
      {mensajeError && (
        <div className="mensajeError">
          <AlertCircle size={16} />
          <span>{mensajeError}</span>
        </div>
      )}

      {/* Contador de citas totales */}
      <div className="panelAdmin__acciones">
        <span className="panelAdmin__contador">
          Total: {listaCitas.length} citas
        </span>
      </div>

      {/* Tabla de citas o mensaje vacío */}
      <div className="panelAdmin__tabla">
        {listaCitas.length === 0 ? (
          <div className="panelAdmin__vacio">
            <CalendarDays size={40} strokeWidth={1.5} />
            <p>No hay citas solicitadas aún.</p>
          </div>
        ) : (
          <table id="tablaCitasAdmin" className="tabla">
            <thead className="tabla__encabezado">
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
            <tbody className="tabla__cuerpo">
              {listaCitas.map((cita) => (
                <tr key={cita.id} className="tabla__fila">
                  <td className="tabla__celda">{cita.id}</td>
                  <td className="tabla__celda">{cita.nombrePaciente}</td>
                  <td className="tabla__celda">{cita.fecha}</td>
                  <td className="tabla__celda">{cita.hora}</td>
                  <td className="tabla__celda">{cita.motivo}</td>
                  <td className="tabla__celda">
                    <span className={`estadoCita ${resolverEstiloEstado(cita.estado)}`}>
                      {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </span>
                  </td>
                  <td className="tabla__celda tabla__celda--acciones">
                    {/* Botón para confirmar la cita */}
                    {cita.estado !== "confirmada" && (
                      <button
                        className="botonAccion botonAccion--editar"
                        onClick={() => cambiarEstadoCita(cita, "confirmada")}
                      >
                        <CheckCircle size={13} />
                        <span>Confirmar</span>
                      </button>
                    )}
                    {/* Botón para cancelar la cita */}
                    {cita.estado !== "cancelada" && (
                      <button
                        className="botonAccion botonAccion--cancelar"
                        onClick={() => cambiarEstadoCita(cita, "cancelada")}
                      >
                        <XCircle size={13} />
                        <span>Cancelar</span>
                      </button>
                    )}
                    {/* Botón para volver a pendiente */}
                    {cita.estado !== "pendiente" && (
                      <button
                        className="botonAccion botonAccion--pendiente"
                        onClick={() => cambiarEstadoCita(cita, "pendiente")}
                      >
                        <RotateCcw size={13} />
                        <span>Pendiente</span>
                      </button>
                    )}
                    {/* Botón para eliminar definitivamente */}
                    <button
                      className="botonAccion botonAccion--eliminar"
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
