import React from "react";
import Header from "./components/Header";
import Filtros from "./components/Filtros";
import TabelaJogos from "./components/TabelaJogos";
import { jogos } from "./data/jogos";

export default function App() {
  return (
    <div className="min-h-screen px-4 py-6">
      <Header />
      <Filtros />
      <TabelaJogos jogos={jogos} />
    </div>
  );
}