import React from "react";
import { Modal, Button } from "react-bootstrap";

const Notificacion = ({ show, onHide, pedidosDemorados, pedidosProximos, onEnviarMail, onMarcarLeida }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Notificaciones de Pedidos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Pedidos Demorados</h5>
        {pedidosDemorados.length === 0 ? (
          <p>No hay pedidos demorados.</p>
        ) : (
          <ul>
            {pedidosDemorados.map((p) => (
              <li key={p.nroPedido}>
                Pedido #{p.nroPedido} - Plazo: {new Date(p.fechaPlazo).toLocaleDateString()}
                <Button
                  variant="link"
                  onClick={() => onMarcarLeida(p.nroPedido)}
                  style={{ marginLeft: "10px" }}
                >
                  Marcar como leído
                </Button>
                <Button
                  variant="link"
                  onClick={() => onEnviarMail(p.nroPedido)}
                  style={{ marginLeft: "10px" }}
                >
                  Enviar Mail
                </Button>
              </li>
            ))}
          </ul>
        )}

        <h5>Pedidos próximos a vencer (3 días)</h5>
        {pedidosProximos.length === 0 ? (
          <p>No hay pedidos próximos a vencer.</p>
        ) : (
          <ul>
            {pedidosProximos.map((p) => (
              <li key={p.nroPedido}>
                Pedido #{p.nroPedido} - Plazo: {new Date(p.fechaPlazo).toLocaleDateString()}
                <Button
                  variant="link"
                  onClick={() => onMarcarLeida(p.nroPedido)}
                  style={{ marginLeft: "10px" }}
                >
                  Marcar como leído
                </Button>
                <Button
                  variant="link"
                  onClick={() => onEnviarMail(p.nroPedido)}
                  style={{ marginLeft: "10px" }}
                >
                  Enviar Mail
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Notificacion;
