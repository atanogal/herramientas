import React, { useEffect, useState } from "react";
import bolsoService from "../../services/bolso.service";
import BolsoCard from "./BolsoCard";
import BolsoCrear from "./BolsoCrear";

const BolsoListado = () => {
  const [bolsos, setBolsos] = useState([]);
  const [crearVisible, setCrearVisible] = useState(false);

  useEffect(() => {
    const cargarBolsos = async () => {
      const data = await bolsoService.getAll();
      setBolsos(data);
    };
    cargarBolsos();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Bolsos</h2>
      <button className="btn btn-success mb-3" onClick={() => setCrearVisible(!crearVisible)}>
        {crearVisible ? "Cancelar" : "Crear Bolso"}
      </button>

      {crearVisible && <BolsoCrear onCreado={() => setCrearVisible(false)} />}

      <div className="row">
        {bolsos.map((b) => (
          <div className="col-md-4 mb-3" key={b.nroBolso}>
            <BolsoCard bolso={b} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BolsoListado;
