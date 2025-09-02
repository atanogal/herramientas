import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import pedidoService from "../services/pedido.service.js";
import PersonaService from "../services/persona.service.js";
import mailService from "../services/mail.service.js";

const MailPedidoWrapper = ({ nroPedido, show, onHide }) => {
  const [pedido, setPedido] = useState(null);
  const [responsables, setResponsables] = useState([]);
  const [responsableLegajo, setResponsableLegajo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nroPedido) return;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        const pedidoData = await pedidoService.getById(nroPedido);
        setPedido(pedidoData);

        const personas = await PersonaService.getAll();
        setResponsables(personas);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [nroPedido]);

  if (loading) return <p>Cargando pedido...</p>;
  if (!pedido) return <p>No se encontró el pedido.</p>;

  const handleEnviar = async () => {
    if (!responsableLegajo) return alert("Seleccione un responsable");

    // Asunto formal
    const asunto = `Notificación - Pedido de herramientas Nº ${pedido.nroPedido}`;

    // Mensaje formal
    const mensaje = `
Estimado/a,

Le informamos el estado actual del pedido de herramientas:

- Nº de Pedido: ${pedido.nroPedido}
- Fecha de Inicio: ${new Date(pedido.fechaInicio).toLocaleDateString()}
- Fecha de Plazo: ${new Date(pedido.fechaPlazo).toLocaleDateString()}
- Fecha de Finalización: ${
      pedido.fechaFin ? new Date(pedido.fechaFin).toLocaleDateString() : "Pendiente"
    }
- Ubicación: ${pedido.ubicacion}
- Estado: ${pedido.estado}
- Solicitante: ${pedido.persona}

Por favor, tenga en cuenta esta información y gestione las acciones correspondientes.

Saludos cordiales,
Sistema de Gestión de Herramientas
    `.trim();

    try {
      await mailService.enviarMailPedido({
        nroPedido: pedido.nroPedido,
        responsableLegajo,
        asunto,
        mensaje,
      });
      alert("Mail enviado correctamente");
      onHide();
    } catch (err) {
      console.error(err);
      alert("Error enviando el mail");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Pedido #{pedido.nroPedido} - Resumen y Envío de Mail
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Resumen del pedido */}
        <h5>Resumen del Pedido</h5>
        <Table striped bordered hover size="sm">
          <tbody>
            <tr>
              <td>Nro Pedido</td>
              <td>{pedido.nroPedido}</td>
            </tr>
            <tr>
              <td>Fecha Inicio</td>
              <td>{new Date(pedido.fechaInicio).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Fecha Plazo</td>
              <td>{new Date(pedido.fechaPlazo).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>Fecha Fin</td>
              <td>
                {pedido.fechaFin
                  ? new Date(pedido.fechaFin).toLocaleDateString()
                  : "Pendiente"}
              </td>
            </tr>
            <tr>
              <td>Ubicación</td>
              <td>{pedido.ubicacion}</td>
            </tr>
            <tr>
              <td>Estado</td>
              <td>{pedido.estado}</td>
            </tr>
            <tr>
              <td>Persona</td>
              <td>{pedido.persona}</td>
            </tr>
          </tbody>
        </Table>

        {/* Selección del responsable */}
        <Form.Group className="mb-3">
          <Form.Label>Responsable</Form.Label>
          <Form.Select
            value={responsableLegajo}
            onChange={(e) => setResponsableLegajo(e.target.value)}
          >
            <option value="">Seleccione responsable</option>
            {responsables.map((r) => (
              <option key={r.legajo} value={r.legajo}>
                {r.nombre} ({r.correo})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Vista previa del mail */}
        <Form.Group className="mb-3">
          <Form.Label>Asunto</Form.Label>
          <Form.Control
            type="text"
            value={`Notificación - Pedido de herramientas Nº ${pedido.nroPedido}`}
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={`
Estimado/a,

Le informamos el estado actual del pedido de herramientas:

- Nº de Pedido: ${pedido.nroPedido}
- Fecha de Inicio: ${new Date(pedido.fechaInicio).toLocaleDateString()}
- Fecha de Plazo: ${new Date(pedido.fechaPlazo).toLocaleDateString()}
- Fecha de Finalización: ${
              pedido.fechaFin
                ? new Date(pedido.fechaFin).toLocaleDateString()
                : "Pendiente"
            }
- Ubicación: ${pedido.ubicacion}
- Estado: ${pedido.estado}
- Solicitante: ${pedido.persona}

Por favor, tenga en cuenta esta información y gestione las acciones correspondientes.

Saludos cordiales,
Sistema de Gestión de Herramientas
            `}
            readOnly
          />
        </Form.Group>

        <Button
          variant="primary"
          disabled={!responsableLegajo}
          onClick={handleEnviar}
        >
          Enviar Mail
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default MailPedidoWrapper;
