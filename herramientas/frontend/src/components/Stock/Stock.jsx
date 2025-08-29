import React, { useEffect, useState } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { FaList, FaPrint } from "react-icons/fa";
import stockService from "../../services/stock.service";
import StockListado from "./StockListado";
import StockPDFGenerator from "./StockPDFGenerator";

const Stock = () => {
  const [resumenStock, setResumenStock] = useState([]);
  const [estados, setEstados] = useState([]);
  const [tipoExpandido, setTipoExpandido] = useState(null);
  const [tipoParaImprimir, setTipoParaImprimir] = useState(null);
  const [imprimirTodo, setImprimirTodo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await stockService.getResumenCantidadPorTipo();
        
        // Ordenar los datos por el nombre del tipo de herramienta
        const sortedData = data.sort((a, b) => a.tipo.localeCompare(b.tipo));
        setResumenStock(sortedData);

        const estadosSet = new Set();
        sortedData.forEach((item) => { // Usar sortedData para obtener los estados
          Object.keys(item.resumen).forEach((key) => {
            if (key !== "total") estadosSet.add(key);
          });
        });
        setEstados([...estadosSet]);
      } catch (error) {
        console.error("Error al obtener datos de stock:", error);
      }
    };

    fetchData();
  }, []);

  const toggleListado = (tipo) => {
    setTipoExpandido(tipoExpandido === tipo ? null : tipo);
  };

  const tiposHerramientas = resumenStock.map((item) => item.tipo);

  return (
    <Container className="mt-4">
      <h2>Resumen Stock de Herramientas</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tipo Herramienta</th>
            <th>Total</th>
            {estados.map((estado) => (
              <th key={estado}>{estado}</th>
            ))}
            <th>Pendientes de Asignación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resumenStock.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{item.tipo}</td>
                <td>{item.resumen.total}</td>
                {estados.map((estado) => (
                  <td key={estado}>{item.resumen[estado] || 0}</td>
                ))}
                <td>{item.resumen.PteAsignar || 0}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => toggleListado(item.tipo)}
                  >
                    <FaList /> Listar
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setTipoParaImprimir(item.tipo)}
                  >
                    <FaPrint /> Imprimir PDF
                  </Button>
                </td>
              </tr>
              {tipoExpandido === item.tipo && (
                <tr>
                  <td colSpan={6 + estados.length}>
                    <StockListado
                      tipoSeleccionado={item.tipo}
                      onClose={() => setTipoExpandido(null)}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end mt-3">
        <Button variant="dark" onClick={() => setImprimirTodo(true)}>
          <FaPrint className="me-2" /> Imprimir Todo PDF
        </Button>
      </div>

      {tipoParaImprimir && (
        <StockPDFGenerator
          tipoIndividual={tipoParaImprimir}
          onClose={() => setTipoParaImprimir(null)}
        />
      )}

      {imprimirTodo && (
        <StockPDFGenerator
          tipos={tiposHerramientas}
          onClose={() => setImprimirTodo(false)}
        />
      )}
    </Container>
  );
};

export default Stock;