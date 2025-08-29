// src/components/Inicio.jsx
import React, { useState } from 'react';
import cara from "./resources/cara.jpeg"

function Inicio() {
  const [descripcion, setDescripcion] = useState('');

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-3">¡Bienvenido al Inventario de herramientas!</h2>
              <p className="card-text">
                Este sistema está diseñado para gestionar el inventario y manejo de herramientas, así como el control de pedidos y préstamos. <br />
                Este mismo esta planteado su uso para los empleados del Area de logistica informatica que integran el poder judicial.
              </p>
              <img src={cara} alt="algo ta mal" className="d-block mx-auto"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
