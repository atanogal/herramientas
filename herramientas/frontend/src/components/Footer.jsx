// src/components/Footer.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="bg-primary text-white text-center py-3 mt-auto">
      <div className="container">
        <small>
          Inventario Herramientas es un sistema para el manejo eficiente de herramientas, control de inventarios y gestión de pedidos y préstamos.
          <br />
          &copy; {new Date().getFullYear()} Derechos reservados para Atahualpa Queno.
        </small>

        <div className="mt-2">
          <a href="https://facebook.com/tuusuario" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="https://twitter.com/tuusuario" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://instagram.com/tuusuario" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://linkedin.com/in/tuusuario" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
