import React, { useEffect, useState } from 'react';
import stockService from '../../services/stock.service';
import axios from 'axios';

const StockListado = ({ tipoSeleccionado, onClose, modoImpresion = false, onLoaded }) => {
  const [herramientas, setHerramientas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [filtradas, setFiltradas] = useState([]);

  // Cargar herramientas y pedidos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [herrRes, pedRes] = await Promise.all([
          stockService.getHerramientas(),
          axios.get('http://localhost:4000/pedidos')
        ]);
        setHerramientas(herrRes || []);
        setPedidos(pedRes.data || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  // Filtrar herramientas según tipo y estado de asignación
  useEffect(() => {
    const asignadas = {};

    pedidos.forEach((p) => {
      p.DetallePedidos.forEach((d) => {
        if ([5, 6].includes(d.nroEstado)) {
          // Guardar la última asignación por fecha
          if (
            !asignadas[d.nroHerramienta] ||
            new Date(p.createdAt) > new Date(asignadas[d.nroHerramienta].fecha)
          ) {
            asignadas[d.nroHerramienta] = {
              persona: d.nroEstado === 5 ? null : p.persona, // null si está PteEntrega
              fecha: p.createdAt,
            };
          }
        }
      });
    });

    const filtradasTemp = herramientas
      .filter((h) => h['TipoHerramientum.nombre'] === tipoSeleccionado)
      .map((h) => ({
        ...h,
        estado:
          asignadas[h.nroHerramienta] && asignadas[h.nroHerramienta].persona
            ? 'Asignada'
            : 'Libre',
        persona:
          asignadas[h.nroHerramienta]
            ? asignadas[h.nroHerramienta].persona || '-'
            : '-',
      }));

    setFiltradas(filtradasTemp);
  }, [herramientas, pedidos, tipoSeleccionado]);

  // Llamar a onLoaded si es modo impresión
  useEffect(() => {
    if (modoImpresion && filtradas.length && onLoaded) {
      onLoaded();
    }
  }, [modoImpresion, filtradas, onLoaded]);

  return (
    <div className="mt-3 mb-4 print-area">
      <h5 className="text-secondary">
        Herramientas del tipo: <strong>{tipoSeleccionado}</strong>
      </h5>
      {!modoImpresion && (
        <button className="btn btn-sm btn-danger mb-2" onClick={onClose}>
          Cerrar
        </button>
      )}
      <table className="table table-bordered table-sm">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Persona</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((h) => (
            <tr key={h.nroHerramienta}>
              <td>{h.nroHerramienta}</td>
              <td>{h.nombre}</td>
              <td>{h['Estado.nombre']}</td>
              <td>{h.persona || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockListado;
