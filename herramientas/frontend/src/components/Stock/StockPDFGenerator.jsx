import React, { useEffect, useState } from "react";
import stockService from "../../services/stock.service";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StockPDFGenerator = ({ tipos = [], tipoIndividual = null, onClose }) => {
  const [herramientas, setHerramientas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [filtradasPorTipo, setFiltradasPorTipo] = useState({});
  const [cargando, setCargando] = useState(true); // Para manejar la carga de datos

  // Traer datos herramientas y pedidos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [herrRes, pedRes] = await Promise.all([
          stockService.getHerramientas(),
          axios.get("http://localhost:4000/pedidos"),
        ]);
        setHerramientas(herrRes || []);
        setPedidos(pedRes.data || []);
        setCargando(false); // Marca como no cargando cuando los datos están listos
      } catch (error) {
        console.error("Error al cargar datos para PDF:", error);
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar herramientas por tipo y asignar persona
  useEffect(() => {
    if (!herramientas.length) return;

    const asignadas = {}; // Objeto para asignar persona a herramienta

    if (pedidos.length) {
      pedidos.forEach((p) => {
        p.DetallePedidos.forEach((d) => {
          if ([5, 6].includes(d.nroEstado)) {
            asignadas[d.nroHerramienta] = p.persona;
          }
        });
      });
    }

    const tiposFiltrar = tipoIndividual ? [tipoIndividual] : tipos;
    const resultado = {};

    tiposFiltrar.forEach((tipo) => {
      resultado[tipo] = herramientas
        .filter((h) => h['TipoHerramientum.nombre'] === tipo) // Filtrar por tipo
        .map((h) => ({
          ...h,
          estado: asignadas[h.nroHerramienta] ? "Asignada" : "Libre", // Asignado si tiene persona, Libre si no
          persona: asignadas[h.nroHerramienta] || "-", // Persona asignada o "-" si no está asignada
        }));
    });

    setFiltradasPorTipo(resultado);
  }, [herramientas, pedidos, tipos, tipoIndividual]);

  // Generar PDF cuando los datos estén listos
  useEffect(() => {
    if (cargando) return; // Si está cargando, no hacer nada

    const tiposAImprimir = tipoIndividual ? [tipoIndividual] : tipos;

    if (
      Object.keys(filtradasPorTipo).length === tiposAImprimir.length &&
      tiposAImprimir.every((t) => filtradasPorTipo[t] !== undefined)
    ) {
      generarPDF();
    }
  }, [filtradasPorTipo, cargando]); // Asegúrate de que el PDF solo se genere cuando todo esté listo

  const generarPDF = () => {
    const doc = new jsPDF();
    const tiposAImprimir = tipoIndividual ? [tipoIndividual] : tipos;

    tiposAImprimir.forEach((tipo, index) => {
      if (index !== 0) doc.addPage();

      doc.setFontSize(16);
      doc.text(`Listado Tipo: ${tipo}`, 14, 20);

      const body = (filtradasPorTipo[tipo] || []).map((h) => [
        h.nroHerramienta,  // Número de la herramienta
        h.nombre,           // Nombre de la herramienta
        h.estado,           // Estado calculado (Asignada o Libre)
        h.persona,          // Persona asignada o "-"
      ]);

      autoTable(doc, {
        head: [["#", "Nombre", "Estado", "Persona"]],
        body,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [63, 81, 181] },
      });
    });

    doc.save(
      tipoIndividual
        ? `Listado_Herramientas_${tipoIndividual}.pdf`
        : "Listado_Completo_Herramientas.pdf"
    );

    if (onClose) onClose(); // Cierra el componente después de generar el PDF
  };

  // Mientras cargamos los datos, mostrar el mensaje de espera
  if (cargando) return <div>Generando PDF, por favor espere...</div>;

  return null; // No renderiza nada después de generar el PDF
};

export default StockPDFGenerator;
