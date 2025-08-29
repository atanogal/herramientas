import React, { useEffect, useState } from "react";
import pedidoService from "../../services/pedido.service.js";
import estadoService from "../../services/estado.service.js"; 
import PedidoModal from "./pedidoModal.jsx";
import PedidoCrear from "./pedidosCrear.jsx";

function parseFecha(fechaStr) {
  if (!fechaStr) return "N/A";
  if (fechaStr.includes("/")) {
    const [dd, mm, yyyy] = fechaStr.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }
  return new Date(fechaStr);
}

export default function PedidoListado() {
  const [pedidos, setPedidos] = useState([]);
  const [estados, setEstados] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [detallesSeleccionados, setDetallesSeleccionados] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarCrear, setMostrarCrear] = useState(false);

  // 🔹 Estados de filtrado
  const [filtroPersona, setFiltroPersona] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(null);

useEffect(() => {
  async function cargarDatos() {
    try {
      const [pedidosData, estadosData] = await Promise.all([
        pedidoService.getAll(),
        estadoService.getAll(),
      ]);

      const pedidosOrdenados = pedidosData.sort(
        (a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)
      );

      setPedidos(pedidosOrdenados);
      setEstados(estadosData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }
  cargarDatos();
}, []);


  function claseBordePorEstado(nroEstado) {
    switch (nroEstado) {
      case 6: return "borde-verde";
      case 5: return "borde-amarillo";
      case 7: return "borde-naranja";
      case 8: return "borde-rojo";
      default: return "";
    }
  }

  function nombreEstado(nroEstado) {
    const estado = estados.find((e) => e.nroEstado === nroEstado);
    return estado ? estado.nombre : nroEstado;
  }

  const abrirModal = async (pedido) => {
    try {
      const detalles = await pedidoService.getDetalles(pedido.nroPedido);
      setDetallesSeleccionados(detalles);
      setPedidoSeleccionado(pedido);
      setShowModal(true);
    } catch (error) {
      console.error("Error cargando detalles del pedido:", error);
    }
  };

  // 🔹 Filtrar y ordenar pedidos (más nuevo primero)
  const pedidosFiltrados = pedidos
    .filter((pedido) => {
      const coincidePersona = pedido.persona
        ?.toLowerCase()
        .includes(filtroPersona.toLowerCase());
      const coincideEstado = filtroEstado ? pedido.nroEstado === filtroEstado : true;
      return coincidePersona && coincideEstado;
    })
    .sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)); 

  return (
    <div className="container my-4">
      <h2 className="mb-4">Listado de Pedidos</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setMostrarCrear(true)}
      >
        Nuevo Pedido
      </button>

      {/* 🔍 Barra de filtros */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Buscar por persona..."
          value={filtroPersona}
          onChange={(e) => setFiltroPersona(e.target.value)}
        />

        <div className="d-flex flex-wrap gap-2">
          <button
            className={`btn btn-sm ${filtroEstado === null ? "btn-secondary" : "btn-outline-secondary"}`}
            onClick={() => setFiltroEstado(null)}
          >
            Todos
          </button>
          {estados
            .filter((estado) => estado.ambito === "Pedido")
            .map((estado) => (
              <button
                key={estado.nroEstado}
                className={`btn btn-sm ${
                  filtroEstado === estado.nroEstado
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setFiltroEstado(estado.nroEstado)}
              >
                {estado.nombre}
              </button>
            ))}
        </div>
      </div>

      <div className="row g-3">
        {pedidosFiltrados.map((pedido) => (
          <div
            key={pedido.nroPedido}
            className={`col-12 col-sm-6 col-md-4 col-lg-3`}
          >
            <div
              className={`card h-100 shadow-sm ${claseBordePorEstado(
                pedido.nroEstado
              )}`}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Pedido #{pedido.nroPedido}</h5>
                <p className="card-text mb-1">
                  <strong>Estado:</strong> {nombreEstado(pedido.nroEstado)}
                </p>
                <p className="card-text mb-1">
                  <strong>Responsable:</strong> {pedido.persona || "N/A"}
                </p>
                <p className="card-text mb-1">
                  <strong>Inicio:</strong>{" "}
                  {parseFecha(pedido.fechaInicio).toLocaleDateString()}
                </p>
                <p className="card-text mb-1">
                  <strong>Plazo:</strong>{" "}
                  {parseFecha(pedido.fechaPlazo).toLocaleDateString()}
                </p>

                {pedido.nroEstado === 6 && (
                  <p className="card-text mb-1">
                    <strong>Fecha Fin:</strong>{" "}
                    {pedido.fechaFin
                      ? parseFecha(pedido.fechaFin).toLocaleDateString()
                      : "N/A"}
                  </p>
                )}

                <p className="card-text mb-3">
                  <strong>Ubicación:</strong> {pedido.ubicacion || "N/A"}
                </p>

                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => abrirModal(pedido)}
                >
                  <i className="bi bi-info-circle me-2"></i> Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <div className="modal-backdrop-blur"></div>}
      <PedidoModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        detalles={detallesSeleccionados}
        pedido={pedidoSeleccionado}
      />

      {mostrarCrear && (
        <PedidoCrear onClose={() => setMostrarCrear(false)} />
      )}
    </div>
  );
}
