import React, { useEffect, useState } from "react";
import stockService from "../../services/stock.service";
import detalleBolsoService from "../../services/detalleBolso.service";
import tipoHerramientaService from "../../services/tipoHerramienta.service";

const BolsoModificar = ({ nroBolso }) => {
  const [herramientasBolso, setHerramientasBolso] = useState([]);
  const [herrDisponibles, setHerrDisponibles] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tipoSel, setTipoSel] = useState("");

  useEffect(() => {
    if (!nroBolso) return;

    const cargarTipos = async () => {
      const data = await tipoHerramientaService.getAll();
      setTipos(data);
    };

    const cargarHerramientasBolso = async () => {
      try {
        const bolsoData = await detalleBolsoService.getByBolso(nroBolso);
        setHerramientasBolso(bolsoData);
      } catch (e) {
        console.error(e);
      }
    };

    cargarTipos();
    cargarHerramientasBolso();
  }, [nroBolso]);

  // Cargar herramientas disponibles cada vez que cambie el tipo seleccionado
  useEffect(() => {
    const cargarDisponibles = async () => {
      if (!tipoSel) {
        setHerrDisponibles([]);
        return;
      }
      try {
        const disponibles = await stockService.getHerramientasPorTipoEstado(
          tipoSel,
          "PteAsignar"
        );
        setHerrDisponibles(disponibles);
      } catch (e) {
        console.error(e);
      }
    };
    cargarDisponibles();
  }, [tipoSel]);

  const agregarHerramienta = async (nroHerr) => {
    try {
      await detalleBolsoService.create({ nroBolso, nroHerramienta: nroHerr });
      await stockService.actualizarEstado(nroHerr, 9);
      setHerramientasBolso([
        ...herramientasBolso,
        { nroBolso, nroHerramienta: nroHerr },
      ]);
      setHerrDisponibles(
        herrDisponibles.filter((h) => h.nroHerramienta !== nroHerr)
      );
    } catch (e) {
      console.error(e);
    }
  };

  const quitarHerramienta = async (nroHerr) => {
    try {
      await detalleBolsoService.remove(nroBolso, nroHerr);
      await stockService.actualizarEstado(nroHerr, 1);
      setHerrDisponibles([...herrDisponibles, { nroHerramienta: nroHerr }]);
      setHerramientasBolso(
        herramientasBolso.filter((h) => h.nroHerramienta !== nroHerr)
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mt-2">
      <h6>Herramientas del bolso</h6>
      <ul>
        {herramientasBolso.map((h) => (
          <li key={h.nroHerramienta}>
            {h.nroHerramienta} - {h.nombre}
            <button
              className="btn btn-sm btn-danger ms-2"
              onClick={() => quitarHerramienta(h.nroHerramienta)}
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>

      <h6>Agregar herramientas</h6>
      <select
        className="form-select mb-2"
        value={tipoSel}
        onChange={(e) => setTipoSel(Number(e.target.value))}
      >
        <option value="">-- Seleccione Tipo --</option>
        {tipos.map((t) => (
          <option key={t.nroTipoHerramienta} value={t.nroTipoHerramienta}>
            {t.nombre}
          </option>
        ))}
      </select>

      <ul>
        {herrDisponibles.map((h) => (
          <li key={h.nroHerramienta}>
            {h.nroHerramienta} - {h.nombre}
            <button
              className="btn btn-sm btn-success ms-2"
              onClick={() => agregarHerramienta(h.nroHerramienta)}
            >
              Agregar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BolsoModificar;
