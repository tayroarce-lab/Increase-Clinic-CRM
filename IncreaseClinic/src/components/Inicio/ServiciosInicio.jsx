import { CalendarCheck, Users, Stethoscope } from "lucide-react";

/**
 * ServiciosInicio - Sección que muestra los servicios destacados de la clínica.
 * Cada tarjeta (card) describe un servicio ofrecido con un icono de lucide-react y breve descripción.
 */
function ServiciosInicio() {
  /**
   * Lista de servicios que se muestran en la landing page.
   * Se define como arreglo para facilitar agregar/quitar servicios a futuro.
   * Cada servicio incluye un componente de icono de lucide-react.
   */
  const listaServicios = [
    {
      id: "servicioCitas",
      icono: <CalendarCheck size={44} strokeWidth={1.5} />,
      titulo: "Gestión de Citas",
      descripcion: "Agende y administre sus citas médicas de forma sencilla y rápida.",
    },
    {
      id: "servicioAtencion",
      icono: <Users size={44} strokeWidth={1.5} />,
      titulo: "Atención Personalizada",
      descripcion: "Nuestro equipo médico está comprometido con brindarle el mejor cuidado.",
    },
    {
      id: "servicioTecnologia",
      icono: <Stethoscope size={44} strokeWidth={1.5} />,
      titulo: "Tecnología Médica",
      descripcion: "Contamos con las herramientas más avanzadas para su diagnóstico y tratamiento.",
    },
  ];

  return (
    <section className="servicios">
      <h2 className="servicios__titulo">Nuestros Servicios</h2>
      <div className="servicios__grid">
        {/* Renderizamos cada servicio dinámicamente desde el arreglo */}
        {listaServicios.map((servicio) => (
          <div key={servicio.id} className="servicio-card">
            <span className="servicio-card__icono">{servicio.icono}</span>
            <h3>{servicio.titulo}</h3>
            <p>{servicio.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServiciosInicio;
