import HeroInicio from "./Inicio/HeroInicio";
import ServiciosInicio from "./Inicio/ServiciosInicio";

/**
 * Inicio - Componente contenedor de la página de inicio (Landing Page).
 * No contiene HTML directo; únicamente compone los sub-componentes
 * HeroInicio y ServiciosInicio para mantener la separación de responsabilidades.
 */
function Inicio() {
  return (
    <div id="paginaInicio" className="paginaInicio">
      {/* Sección hero: bienvenida y botones de acción */}
      <HeroInicio />

      {/* Sección de servicios destacados de la clínica */}
      <ServiciosInicio />
    </div>
  );
}

export default Inicio;
