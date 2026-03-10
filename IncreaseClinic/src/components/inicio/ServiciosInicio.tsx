import { CalendarCheck, Users, Stethoscope } from "lucide-react";
import "../../styles/userStyles/ServiciosInicio.css";

// Aquí mostramos lo que hace la clínica por ti.
function ServiciosInicio() {
  // Esta es la lista de cosas que ofrecemos.
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
      <h2 className="serviciosTitulo">Nuestros Servicios</h2>
      <div className="serviciosGrid">
        {/* Dibujamos cada cosa que ofrecemos de la lista. */}
        {listaServicios.map((servicio) => (
          <div key={servicio.id} className="servicioCard">
            <span className="servicioCardIcono">{servicio.icono}</span>
            <h3>{servicio.titulo}</h3>
            <p>{servicio.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServiciosInicio;
