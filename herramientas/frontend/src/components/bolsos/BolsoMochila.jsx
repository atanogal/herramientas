import React from "react";
import { FaHammer, FaWrench, FaScrewdriver } from "react-icons/fa";
import mochilaImg from "./images/mochila.png"; // ajusta según la ubicación de tu archivo

const BolsoMochila = ({ herramientas = [] }) => {
  return (
    <div className="relative w-48 h-64 mx-auto">
      {/* Mochila de fondo */}
      <img
        src={mochilaImg}
        alt="Mochila"
        className="w-full h-full object-contain"
      />

      {/* Herramientas dentro */}
      <div className="absolute inset-0 flex flex-wrap justify-center items-center p-4 gap-2">
        {herramientas.map((herr, index) => (
          <div
            key={index}
            className="text-2xl text-gray-800 flex items-center justify-center"
            title={herr.nombre}
          >
            {herr.tipo === "martillo" && <FaHammer />}
            {herr.tipo === "destornillador" && <FaScrewdriver />}
            {herr.tipo === "llave inglesa" && <FaWrench />}
            {/* fallback */}
            {!["martillo", "destornillador", "llave inglesa"].includes(
              herr.tipo
            ) && <span>🔧</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BolsoMochila;
