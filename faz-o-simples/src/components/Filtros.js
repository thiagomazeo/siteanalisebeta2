import React from "react";

export default function Filtros() {
  return (
    <div className="flex gap-4 mb-4">
      <select className="bg-gray-700 p-2 rounded">
        <option>Hoje</option>
        <option>Amanhã</option>
      </select>
      <select className="bg-gray-700 p-2 rounded">
        <option>Todos os Esportes</option>
        <option>Futebol</option>
      </select>
    </div>
  );
}