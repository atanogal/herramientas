import { useState, useEffect } from "react";
import pedidoService from "../../services/pedido.service";
import tipoHerramientaService from "../../services/tipoHerramienta.service";
import stockService from "../../services/stock.service";

export default function PedidosGestion({ onClose }) {
  // Estados generales
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detalles, setDetalles] = useState([]);

  // Para crear pedido
  const [formPedido, setFormPedido] = useState({
    persona: "",
    ubicacion: "",
    fechaInicio: "",
    fechaPlazo: "",
  });

  // Para agregar detalle
  const [tiposHerramienta, setTiposHerramienta] = useState([]);
  const [herramientasFiltradas, setHerramientasFiltradas] = useState([]);
  const [detalleNuevo, setDetalleNuevo] = useState({
    nroTipoHerramienta: "",
    nroHerramienta: "",
    cantidad: 1,
  });

  const [loading, setLoading] = useState(false);

  // Carga inicial: traer pedidos y tipos de herramienta
  useEffect(() => {
    pedidoService.getAll()
      .then(setPedidos)
      .catch(console.error);

    tipoHerramientaService.getAll()
      .then(setTiposHerramienta)
      .catch(console.error);
  }, []);

  // Cuando cambia el tipo herramienta, cargar herramientas filtradas
  useEffect(() => {
    if (detalleNuevo.nroTipoHerramienta) {
      stockService
        .getHerramientasPorTipoEstado(detalleNuevo.nroTipoHerramienta, "PteAsignar")
        .then(setHerramientasFiltradas)
        .catch(console.error);
    } else {
      setHerramientasFiltradas([]);
      setDetalleNuevo((prev) => ({ ...prev, nroHerramienta: "" }));
    }
  }, [detalleNuevo.nroTipoHerramienta]);

  // Cuando selecciono pedido, cargo sus detalles
  useEffect(() => {
    if (pedidoSeleccionado) {
      pedidoService.getDetalles(pedidoSeleccionado.nroPedido)
        .then(setDetalles)
        .catch(console.error);
    } else {
      setDetalles([]);
    }
  }, [pedidoSeleccionado]);

  // Cambios en formulario de pedido
  const handleChangePedido = (e) => {
    const { name, value } = e.target;
    setFormPedido((prev) => ({ ...prev, [name]: value }));
  };

  // Cambios en formulario detalle
  const handleChangeDetalle = (e) => {
    const { name, value } = e.target;
    setDetalleNuevo((prev) => ({ ...prev, [name]: value }));
  };

  // Crear pedido vacío (sin detalles)
  const handleCrearPedido = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const pedidoData = {
      persona: formPedido.persona,
      ubicacion: formPedido.ubicacion,
      fechaInicio: formPedido.fechaInicio,
      fechaPlazo: formPedido.fechaPlazo,
      nroEstado: 5, // estado fijo PteEntrega
    };
    const creado = await pedidoService.createMain(pedidoData);

    console.log("Respuesta createMain (pedido creado):", creado);
    console.log("nroPedido creado:", creado?.nroPedido);

    setPedidos((prev) => [...prev, creado]);
    setPedidoSeleccionado(creado);
    setFormPedido({ persona: "", ubicacion: "", fechaInicio: "", fechaPlazo: "" });
  } catch (error) {
    console.error(error);
    alert("Error creando pedido");
  } finally {
    setLoading(false);
  }
};

  // Seleccionar pedido de la lista
  const handleSeleccionarPedido = (e) => {
    const nroPedido = parseInt(e.target.value);
    const pedido = pedidos.find((p) => p.nroPedido === nroPedido) || null;
    setPedidoSeleccionado(pedido);
  };

  // Agregar detalle al pedido seleccionado
  const handleAgregarDetalle = async () => {
  if (!pedidoSeleccionado) {
    alert("Selecciona un pedido primero");
    return;
  }
  if (!detalleNuevo.nroTipoHerramienta || !detalleNuevo.nroHerramienta || detalleNuevo.cantidad < 1) {
    alert("Completa todos los campos para el detalle");
    return;
  }
  setLoading(true);
  try {
    const detalle = {
      nroHerramienta: parseInt(detalleNuevo.nroHerramienta),
      cantidad: parseInt(detalleNuevo.cantidad),
    };

    console.log("Pedido seleccionado al agregar detalle:", pedidoSeleccionado);
    console.log("nroPedido al agregar detalle:", pedidoSeleccionado?.nroPedido);
    console.log("Detalle a agregar:", detalle);

    const creados = await pedidoService.addDetalles(pedidoSeleccionado.nroPedido, [detalle]);
    setDetalles((prev) => [...prev, ...creados]);
    setDetalleNuevo({ nroTipoHerramienta: "", nroHerramienta: "", cantidad: 1 });
  } catch (error) {
    console.error("Error agregando detalle:", error);
    alert("Error agregando detalle");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      overflowY: "auto",
      padding: "2rem"
    }}>
      <div style={{ background: "#fff", padding: "2rem", borderRadius: "8px", maxWidth: "700px", width: "100%" }}>
        <h2>Gestión de Pedidos</h2>

        {/* Formulario crear pedido */}
        <form onSubmit={handleCrearPedido}>
          <h4>Crear Pedido Vacío</h4>
          <div className="mb-2">
            <input
              name="persona"
              placeholder="Persona"
              value={formPedido.persona}
              onChange={handleChangePedido}
              className="form-control"
              required
            />
          </div>
          <div className="mb-2">
            <input
              name="ubicacion"
              placeholder="Ubicación"
              value={formPedido.ubicacion}
              onChange={handleChangePedido}
              className="form-control"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="date"
              name="fechaInicio"
              placeholder="Fecha Inicio"
              value={formPedido.fechaInicio}
              onChange={handleChangePedido}
              className="form-control"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="date"
              name="fechaPlazo"
              placeholder="Fecha Plazo"
              value={formPedido.fechaPlazo}
              onChange={handleChangePedido}
              className="form-control"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creando..." : "Crear Pedido"}
          </button>
        </form>

        <hr />
        {pedidoSeleccionado && (
          <>
            <h4>Agregar Detalle a Pedido #{pedidoSeleccionado.nroPedido}</h4>

        <div>
          <h4>Seleccionar Pedido para agregar detalles</h4>
          <select
            className="form-select"
            name="nroTipoHerramienta"
            value={detalleNuevo.nroTipoHerramienta}
            onChange={handleChangeDetalle}
            required
          >
            <option value="">-- Seleccionar Tipo de Herramienta --</option>
            {tiposHerramienta.map((t) => (
              <option key={t.nroTipoHerramienta} value={t.nroTipoHerramienta}>
                {t.nombre} 
              </option>
            ))}
          </select>
        </div>

            <div className="mb-2">
              <select
                className="form-select"
                name="nroHerramienta"
                value={detalleNuevo.nroHerramienta}
                onChange={handleChangeDetalle}
                required
                disabled={!detalleNuevo.nroTipoHerramienta}
              >
                <option value="">-- Seleccionar Herramienta --</option>
                {herramientasFiltradas.map((h) => (
                  <option key={h.nroHerramienta} value={h.nroHerramienta}>
                    {h.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <input
                type="number"
                name="cantidad"
                min="1"
                className="form-control"
                value={detalleNuevo.cantidad}
                onChange={handleChangeDetalle}
                required
              />
            </div>

            <button
              className="btn btn-success"
              onClick={handleAgregarDetalle}
              disabled={loading}
              type="button"
            >
              {loading ? "Agregando..." : "Agregar Detalle"}
            </button>

            <hr />

            <h5>Detalles agregados:</h5>
            <ul>
              {detalles.map((d, i) => (
                <li key={i}>
                  Herramienta ID: {d.nroHerramienta} - Cantidad: {d.cantidad}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-3 d-flex justify-content-end">
          <button onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
