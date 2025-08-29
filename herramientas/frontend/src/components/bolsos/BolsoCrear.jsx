import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bolsoService from "../../services/bolso.service";
import personaService from "../../services/persona.service";

const BolsoCrear = ({ onCreado }) => {
  const navigate = useNavigate();
  const [legajo, setLegajo] = useState("");
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    const cargarPersonas = async () => {
      const data = await personaService.getAll();
      setPersonas(data);
    };
    cargarPersonas();
  }, []);

  const handleGuardar = async () => {
    if (!legajo) return alert("Seleccione una persona");
    await bolsoService.create({ legajo });
    alert("Bolso creado");
    if (onCreado) onCreado();
    navigate(0);
  };

  return (
    <div className="card p-3 mb-3">
      <label>Persona</label>
      <select className="form-select" value={legajo} onChange={(e) => setLegajo(e.target.value)}>
        <option value="">-- Seleccione --</option>
        {personas.map((p) => (
          <option key={p.legajo} value={p.legajo}>
            {p.legajo} - {p.nombre}
          </option>
        ))}
      </select>
      <button className="btn btn-success mt-2" onClick={handleGuardar}>Crear Bolso</button>
    </div>
  );
};

export default BolsoCrear;
