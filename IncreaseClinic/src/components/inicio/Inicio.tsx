import HeroInicio from "./HeroInicio";
import ServiciosInicio from "./ServiciosInicio";

// Esta es la página principal con todo lo de bienvenida.
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
