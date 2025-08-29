import React, { useState, useMemo } from "react";
import BolsoModificar from "./BolsoModificar";
import BolsoMochila from "./BolsoMochila";

const BolsoCard = ({ bolso }) => {
  const [modificar, setModificar] = useState(false);

  // Mapear detalles del bolso a herramientas con tipo
  const herramientas = useMemo(() => {
    if (!bolso.DetalleBolsos) return [];
    return bolso.DetalleBolsos.map((detalle) => ({
      nroHerramienta: detalle.nroHerramienta,
      nombre: detalle.Herramienta?.nombre,
      tipo: detalle.Herramienta?.tipo || "otro",
    }));
  }, [bolso]);

  return (
    <div className="card mb-2 p-3">
      <h5>Bolso #{bolso.nroBolso}</h5>
      <p>
        {bolso.Persona?.nombre} ({bolso.legajo})
      </p>

      {/* Vista mochila con herramientas */}
      <BolsoMochila herramientas={herramientas} />

      <button
        className="btn btn-primary btn-sm mt-2"
        onClick={() => setModificar(!modificar)}
      >
        {modificar ? "Cerrar" : "Modificar Bolso"}
      </button>

      {modificar && <BolsoModificar nroBolso={bolso.nroBolso} />}
    </div>
  );
};

export default BolsoCard;
