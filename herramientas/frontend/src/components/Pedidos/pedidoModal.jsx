import React, { useEffect, useState } from "react";
import pedidoService from "../../services/pedido.service.js";
import estadoService from "../../services/estado.service.js";
import tipoHerramientaService from "../../services/tipoHerramienta.service.js";

export default function PedidoModal({ show, handleClose, pedido: pedidoProp }) {
  const [detalles, setDetalles] = useState([]);
  const [estados, setEstados] = useState([]);
  const [tiposHerramienta, setTiposHerramienta] = useState([]);
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar estados y tipos de herramientas
  useEffect(() => {
    if (!show) return;

    async function cargarDatos() {
      try {
        const [estadosData, tiposData] = await Promise.all([
          estadoService.getAll(),
          tipoHerramientaService.getAll(),
        ]);
        setEstados(estadosData);
        setTiposHerramienta(tiposData);
      } catch (error) {
        console.error("Error cargando estados o tipos de herramienta:", error);
      }
    }

    cargarDatos();
  }, [show]);

  // Cargar pedido completo y detalles usando nroPedido
  useEffect(() => {
    if (!show || !pedidoProp?.nroPedido) return;

    async function cargarPedidoYDetalles() {
      try {
        // Traer el pedido completo
        const pedidoCompleto = await pedidoService.getById(pedidoProp.nroPedido);
        setPedido(pedidoCompleto);

        // Traer detalles
        const detallesData = await pedidoService.getDetalles(pedidoProp.nroPedido);
        setDetalles(detallesData);
        console.log("Detalles cargados:", detallesData);
      } catch (error) {
        console.error("Error cargando pedido o detalles:", error);
      }
    }

    cargarPedidoYDetalles();
  }, [show, pedidoProp]);

  const nombreEstado = (nroEstado) => {
    const estado = estados.find((e) => e.nroEstado === nroEstado);
    return estado ? estado.nombre : nroEstado;
  };

  const nombreTipoHerramienta = (nroTipo) => {
    const tipo = tiposHerramienta.find((t) => t.nroTipoHerramienta === nroTipo);
    return tipo ? tipo.nombre : nroTipo;
  };

  const entregarDetalle = async (idDetalle) => {
    if (!pedido?.nroPedido) return;
    setLoading(true);
    try {
      await pedidoService.actualizarEstadoDetalle(idDetalle, 6);
      const detallesData = await pedidoService.getDetalles(pedido.nroPedido);
      setDetalles(detallesData);
    } catch (error) {
      console.error("Error al entregar detalle:", error);
    } finally {
      setLoading(false);
    }
  };

  const entregarTodoPedido = async () => {
    if (!pedido?.nroPedido) return;
    setLoading(true);
    try {
      await Promise.all(
        detalles.map((d) => pedidoService.actualizarEstadoDetalle(d.id, 6))
      );
      const detallesData = await pedidoService.getDetalles(pedido.nroPedido);
      setDetalles(detallesData);
    } catch (error) {
      console.error("Error al entregar todo el pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!show || !pedido) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              Detalles del Pedido #{pedido.nroPedido} - Estado: {nombreEstado(pedido.nroEstado)}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            {detalles.length === 0 ? (
              <p>No hay detalles para este pedido.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nro Herramienta</th>
                    <th>Nombre Herramienta</th>
                    <th>Tipo Herramienta</th>
                    <th>Cantidad</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle) => (
                    <tr key={detalle.id}>
                      <td>{detalle.nroHerramienta}</td>
                      <td>{detalle.Herramientum?.nombre || "N/A"}</td>
                      <td>{nombreTipoHerramienta(detalle.Herramientum?.nroTipoHerramienta)}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{nombreEstado(detalle.nroEstado)}</td>
                      <td>
                        {detalle.nroEstado !== 6 && (
                          <button
                            className="btn btn-sm btn-success"
                            disabled={loading}
                            onClick={() => entregarDetalle(detalle.id)}
                          >
                            Entregar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={entregarTodoPedido}
              disabled={loading || detalles.length === 0}
            >
              Entregar Todo
            </button>
            <button className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
          </div>

        </div>
      </div>
    </div>
  );
}
