import React from "react";

export default function TabelaJogos({ jogos }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-x-auto">
      <table className="w-full text-center text-sm">
        <thead className="bg-gray-700">
          <tr>
            <th className="py-2">Hora</th>
            <th>Casa</th>
            <th>Fora</th>
            <th>1</th>
            <th>X</th>
            <th>2</th>
          </tr>
        </thead>
        <tbody>
          {jogos.map((jogo, i) => (
            <tr key={i} className="border-t border-gray-600">
              <td className="py-2">{jogo.hora}</td>
              <td>{jogo.timeCasa}</td>
              <td>{jogo.timeFora}</td>
              <td className="text-green-400">{jogo.odd1}</td>
              <td className="text-yellow-400">{jogo.oddX}</td>
              <td className="text-red-400">{jogo.odd2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}