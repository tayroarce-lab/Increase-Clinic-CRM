/**
 * IndicadorCarga.jsx - Componente reutilizable de indicador de carga.
 * Muestra un spinner animado con un mensaje personalizable.
 * Se usa en múltiples secciones de la aplicación durante la carga de datos.
 *
 * @param {Object} props
 * @param {string} [props.mensaje="Cargando..."] - Texto que se muestra debajo del spinner.
 */
import { Loader2 } from "lucide-react";

function IndicadorCarga({ mensaje = "Cargando..." }) {
  return (
    <div id="indicadorCarga" className="indicadorCarga">
      <Loader2 size={36} className="iconoGirando" strokeWidth={2} />
      <p className="indicadorCarga__mensaje">{mensaje}</p>
    </div>
  );
}

export default IndicadorCarga;
