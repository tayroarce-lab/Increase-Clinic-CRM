import { useState, useEffect } from "react";
import {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from "../services/ServicioPacientes";
import IndicadorCarga from "../components/IndicadorCarga";
import Swal from "sweetalert2";

function PanelAdmin() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState("");

  const [formulario, setFormulario] = useState({
    nombre: "",
    edad: "",
    telefono: "",
    correo: "",
    diagnostico: "",
  });

  useEffect(() => {
    cargarPacientes();
  }, []);

  async function cargarPacientes() {
    try {
      setCargando(true);
      setError("");
      const datos = await obtenerPacientes();
      setPacientes(datos);
    } catch (error) {
      setError("Error al cargar los pacientes: " + error.message);
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario({
      nombre: "",
      edad: "",
      telefono: "",
      correo: "",
      diagnostico: "",
    });
    setPacienteEditando(null);
    setMostrarFormulario(false);
    setErrorFormulario("");
  }

  function abrirFormularioCrear() {
    limpiarFormulario();
    setMostrarFormulario(true);
  }

  function abrirFormularioEditar(paciente) {
    setFormulario({
      nombre: paciente.nombre,
      edad: paciente.edad.toString(),
      telefono: paciente.telefono,
      correo: paciente.correo,
      diagnostico: paciente.diagnostico,
    });
    setPacienteEditando(paciente);
    setMostrarFormulario(true);
    setErrorFormulario("");
  }

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

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

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
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el paciente: " + error.message,
        confirmButtonColor: "#2563EB",
      });
      setErrorFormulario("Error al guardar: " + error.message);
    }
  }

  async function manejarEliminar(paciente) {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar paciente?",
      text: `¿Estás seguro de eliminar a ${paciente.nombre}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;

    try {
      await eliminarPaciente(paciente.id);
      await cargarPacientes();
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: `${paciente.nombre} ha sido eliminado correctamente`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error.message,
        confirmButtonColor: "#2563EB",
      });
    }
  }

  if (cargando) return <IndicadorCarga mensaje="Cargando pacientes..." />;

  return (
    <div id="panelAdmin" className="panelAdmin">
      <div className="panelAdmin__encabezado">
        <h1 className="panelAdmin__titulo">Panel de Administración</h1>
        <p className="panelAdmin__subtitulo">Gestión de Pacientes</p>
      </div>

      {error && (
        <div className="mensajeError">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="panelAdmin__acciones">
        <button
          id="botonCrearPaciente"
          className="formulario__boton formulario__boton--primario"
          onClick={abrirFormularioCrear}
        >
          + Nuevo Paciente
        </button>
        <span className="panelAdmin__contador">
          Total: {pacientes.length} pacientes
        </span>
      </div>

      {mostrarFormulario && (
        <div className="panelAdmin__modal">
          <div className="panelAdmin__modalContenido">
            <h2 className="panelAdmin__modalTitulo">
              {pacienteEditando ? "Editar Paciente" : "Nuevo Paciente"}
            </h2>

            {errorFormulario && (
              <div className="mensajeError">
                <span>⚠️</span> {errorFormulario}
              </div>
            )}

            <div id="formularioPaciente" className="formulario">
              <div className="formulario__grupo">
                <label htmlFor="campoNombrePaciente" className="formulario__etiqueta">
                  Nombre Completo
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

              <div className="formulario__fila">
                <div className="formulario__grupo">
                  <label htmlFor="campoEdadPaciente" className="formulario__etiqueta">
                    Edad
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
                    Teléfono
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

              <div className="formulario__grupo">
                <label htmlFor="campoCorreoPaciente" className="formulario__etiqueta">
                  Correo
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

              <div className="formulario__grupo">
                <label htmlFor="campoDiagnosticoPaciente" className="formulario__etiqueta">
                  Diagnóstico
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

              <div className="formulario__botonesModal">
                <button
                  type="button"
                  className="formulario__boton formulario__boton--primario"
                  onClick={manejarEnvio}
                >
                  {pacienteEditando ? "Guardar Cambios" : "Crear Paciente"}
                </button>
                <button
                  type="button"
                  className="formulario__boton formulario__boton--secundario"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="panelAdmin__tabla">
        {pacientes.length === 0 ? (
          <div className="panelAdmin__vacio">
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
                      ✏️ Editar
                    </button>
                    <button
                      className="botonAccion botonAccion--eliminar"
                      onClick={() => manejarEliminar(paciente)}
                    >
                      🗑️ Eliminar
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

export default PanelAdmin;
