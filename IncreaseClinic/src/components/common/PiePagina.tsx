/**
 * PiePagina.jsx - Footer profesional de la aplicación.
 * Incluye información de contacto, enlaces rápidos y redes sociales.
 */
import { HeartPulse, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import "../../styles/PiePagina.css";

function PiePagina() {
  return (
    <footer className="footer">
      <div className="footerContenido">
        {/* Sección: Branding */}
        <div className="footerColumna">
          <div className="footerLogo">
            <HeartPulse size={24} />
            <span>IncreaseClinic</span>
          </div>
          <p className="footerDescripcion">
            Cuidando tu salud con tecnología y calidez humana.
            Líderes en gestión médica digital.
          </p>
          <div className="footerRedes">
            <a href="#" className="footerRedSocial"><Instagram size={18} /></a>
            <a href="#" className="footerRedSocial"><Facebook size={18} /></a>
            <a href="#" className="footerRedSocial"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Sección: Contacto */}
        <div className="footerColumna">
          <h4 className="footerTituloColumna">Contacto</h4>
          <ul className="footerLista">
            <li><MapPin size={16} /> <span>Av. Salud 123, Ciudad Salud</span></li>
            <li><Phone size={16} /> <span>+57 300 000 0000</span></li>
            <li><Mail size={16} /> <span>contacto@increaseclinic.com</span></li>
          </ul>
        </div>

        {/* Sección: Enlaces Rápidos */}
        <div className="footerColumna">
          <h4 className="footerTituloColumna">Servicios</h4>
          <ul className="footerLista">
            <li>Gestión de Citas</li>
            <li>Telemedicina</li>
            <li>Historial Clínico</li>
            <li>Atención 24/7</li>
          </ul>
        </div>
      </div>
      
      <div className="footerInferior">
        <p>&copy; 2024 IncreaseClinic CRM. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default PiePagina;
