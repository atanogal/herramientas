import React, { useEffect, useState } from "react";
import stockService from "../../services/stock.service";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StockPDFGenerator = ({ tipos = [], tipoIndividual = null, onClose }) => {
  const [herramientas, setHerramientas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [filtradasPorTipo, setFiltradasPorTipo] = useState({});

  // Traer datos herramientas y pedidos
  useEffect(() => {
    const fetchData = async () => {
      try { // Añadido try-catch para manejar errores de carga de datos
        const [herrRes, pedRes] = await Promise.all([
          stockService.getHerramientas(),
          axios.get("http://localhost:4000/pedidos"),
        ]);
        setHerramientas(herrRes || []);
        setPedidos(pedRes.data || []);
      } catch (error) {
        console.error("Error al cargar datos para PDF:", error);
        // Podrías añadir lógica para mostrar un mensaje de error al usuario
      }
    };
    fetchData();
  }, []);

  // Filtrar herramientas por tipo y asignar persona
  useEffect(() => {
    if (!herramientas.length || !pedidos.length) return;

    const asignadas = {};
    pedidos.forEach((p) => {
      p.DetallePedidos.forEach((d) => {
        if ([5, 6].includes(d.nroEstado)) {
          asignadas[d.nroHerramienta] = p.persona;
        }
      });
    });

    const tiposFiltrar = tipoIndividual ? [tipoIndividual] : tipos;
    const resultado = {};

    tiposFiltrar.forEach((tipo) => {
      resultado[tipo] = herramientas
        // Accede al nombre del tipo de herramienta usando la notación de corchetes
        .filter((h) => h['TipoHerramientum.nombre'] === tipo)
        .map((h) => ({
          ...h,
          // El campo 'estado' aquí sigue siendo el calculado ('Asignada'/'Libre')
          estado: asignadas[h.nroHerramienta] ? "Asignada" : "Libre",
          persona: asignadas[h.nroHerramienta] || "",
          // Si necesitas el nombre del estado de la DB, podrías añadirlo así:
          // estadoDB: h['Estado.nombre']
        }));
    });

    setFiltradasPorTipo(resultado);
  }, [herramientas, pedidos, tipos, tipoIndividual]);

  // Cuando ya esté todo filtrado, generar PDF
  useEffect(() => {
    const tiposAImprimir = tipoIndividual ? [tipoIndividual] : tipos;
    // Asegúrate de que todos los tipos a imprimir tienen datos filtrados
    if (
      Object.keys(filtradasPorTipo).length === tiposAImprimir.length &&
      tiposAImprimir.every((t) => filtradasPorTipo[t] !== undefined) // Verifica que el tipo exista en el objeto filtradasPorTipo
    ) {
      generarPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtradasPorTipo]); // Dependencia actualizada para asegurar que se ejecuta cuando filtradasPorTipo está completo

  const generarPDF = () => {
    const doc = new jsPDF();

    const tiposAImprimir = tipoIndividual ? [tipoIndividual] : tipos;

    tiposAImprimir.forEach((tipo, index) => {
      if (index !== 0) doc.addPage();

      doc.setFontSize(16);
      doc.text(`Listado Tipo: ${tipo}`, 14, 20);

      const body = (filtradasPorTipo[tipo] || []).map((h) => [
        h.nroHerramienta,
        h.nombre,
        // Usa el estado calculado ('Asignada'/'Libre') o el de la DB si lo mapeaste (ej. h.estadoDB)
        h.estado, // Esto usa el estado calculado en el useEffect anterior
        h.persona || "-",
        // Accede al nombre del estado de la base de datos si lo quieres en el PDF
        h['Estado.nombre'], // Este es el nombre del estado directamente de la DB
        h.createdAt ? new Date(h.createdAt).toLocaleDateString() : "-",
      ]);

      autoTable(doc, {
        head: [["#", "Nombre", "Estado Asignado", "Persona", "Estado DB", "Creado"]], // Encabezado ajustado
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

    if (onClose) onClose();
  };

  return <div>Generando PDF, por favor espere...</div>;
};

export default StockPDFGenerator;
