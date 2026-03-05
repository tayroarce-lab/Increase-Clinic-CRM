/**
 * PiePagina.jsx - Footer profesional de la aplicación.
 * Incluye información de contacto, enlaces rápidos y redes sociales.
 */
import { HeartPulse, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

function PiePagina() {
  return (
    <footer className="footer">
      <div className="footer__contenido">
        {/* Sección: Branding */}
        <div className="footer__columna">
          <div className="footer__logo">
            <HeartPulse size={24} />
            <span>IncreaseClinic</span>
          </div>
          <p className="footer__descripcion">
            Cuidando tu salud con tecnología y calidez humana.
            Líderes en gestión médica digital.
          </p>
          <div className="footer__redes">
            <a href="#" className="footer__redSocial"><Instagram size={18} /></a>
            <a href="#" className="footer__redSocial"><Facebook size={18} /></a>
            <a href="#" className="footer__redSocial"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Sección: Contacto */}
        <div className="footer__columna">
          <h4 className="footer__tituloColumna">Contacto</h4>
          <ul className="footer__lista">
            <li><MapPin size={16} /> <span>Av. Salud 123, Ciudad Salud</span></li>
            <li><Phone size={16} /> <span>+57 300 000 0000</span></li>
            <li><Mail size={16} /> <span>contacto@increaseclinic.com</span></li>
          </ul>
        </div>

        {/* Sección: Enlaces Rápidos */}
        <div className="footer__columna">
          <h4 className="footer__tituloColumna">Servicios</h4>
          <ul className="footer__lista">
            <li>Gestión de Citas</li>
            <li>Telemedicina</li>
            <li>Historial Clínico</li>
            <li>Atención 24/7</li>
          </ul>
        </div>
      </div>
      
      <div className="footer__inferior">
        <p>&copy; 2024 IncreaseClinic CRM. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default PiePagina;
