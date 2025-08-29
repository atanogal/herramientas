import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faBell, faHammer } from "@fortawesome/free-solid-svg-icons";
import Notificacion from "./notificacion";
import MailPedidoWrapper from "./MailPedido";
import pedidoService from "../services/pedido.service";

function Menu() {
  const [showNotif, setShowNotif] = useState(false);
  const [showMail, setShowMail] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [pedidosDemorados, setPedidosDemorados] = useState([]);
  const [pedidosProximos, setPedidosProximos] = useState([]);

  const hoy = new Date();
  const tresDiasDespues = new Date();
  tresDiasDespues.setDate(hoy.getDate() + 3);

  const today = hoy.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Cargar notificaciones al montar
  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const pedidos = await pedidoService.getAll();
        setPedidosDemorados(pedidos.filter(p => p.nroEstado === 8)); // Demorado
        setPedidosProximos(
          pedidos.filter(p => {
            const fechaPlazo = new Date(p.fechaPlazo);
            return fechaPlazo > hoy && fechaPlazo <= tresDiasDespues;
          })
        );
      } catch (err) {
        console.error("Error cargando pedidos:", err);
      }
    };
    cargarNotificaciones();
  }, []);

  // Abrir modal Mail con pedido seleccionado
  const handleEnviarMail = (nroPedido) => {
    setPedidoSeleccionado(nroPedido);
    setShowMail(true);
    setShowNotif(false); // opcional: cerrar notificaciones
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand d-flex align-items-center">
            <FontAwesomeIcon icon={faHammer} className="me-2" />
            Herramientas
          </NavLink>

          <div className="mx-auto text-white d-none d-lg-block">{today}</div>

          <div className="d-flex align-items-center">
            <NavLink
              to="/stock"
              className={({ isActive }) => "nav-link me-3 " + (isActive ? "active" : "text-white")}
            >
              Stock
            </NavLink>
            <NavLink
              to="/pedidos"
              className={({ isActive }) => "nav-link me-3 " + (isActive ? "active" : "text-white")}
            >
              Pedidos
            </NavLink>
            <NavLink
              to="/bolso"
              className={({ isActive }) => "nav-link me-3 " + (isActive ? "active" : "text-white")}
            >
              Bolsos
            </NavLink>

            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setShowNotif(true); }}
              className="nav-link text-white position-relative"
            >
              <FontAwesomeIcon icon={faBell} />
              {pedidosDemorados.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                >
                  <span className="visually-hidden">Notificaciones nuevas</span>
                </span>
              )}
            </a>
          </div>
        </div>
      </nav>

      {/* Modal de Notificaciones */}
      {showNotif && (
        <Notificacion
          show={showNotif}
          onHide={() => setShowNotif(false)}
          pedidosDemorados={pedidosDemorados}
          pedidosProximos={pedidosProximos}
          onEnviarMail={handleEnviarMail}
        />
      )}

      {/* Modal de Mail */}
      {showMail && pedidoSeleccionado && (
        <MailPedidoWrapper
          nroPedido={pedidoSeleccionado}
          show={showMail}
          onHide={() => setShowMail(false)}
        />
      )}
    </>
  );
}

export default Menu;
