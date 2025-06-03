import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const API_KEY = "501374aa07d6d9efc9d5425d3398c4b3";
const API_URL = "https://v3.football.api-sports.io";

const headers = {
  "x-apisports-key": API_KEY,
};

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Array com os filtros dos mercados para gerar checkboxes
const mercados = [
  { id: "vitoria_1x2", label: "Vitória 1X2" },
  { id: "ambas_marcam", label: "Ambas marcam" },
  { id: "over_under_1_5", label: "Over/Under 1.5" },
  { id: "over_under_3_5", label: "Over/Under 3.5" },
  { id: "casa_vencer_ou_empate", label: "Casa para vencer ou empate" },
  { id: "casa_ou_visitante_vencer", label: "Casa ou visitante para vencer" },
  { id: "empate_ou_visitante_vencer", label: "Empate ou visitante para vencer" },
  { id: "cartoes_over_under_1_5", label: "Cartões Over/Under 1.5" },
  { id: "cartoes_over_under_2_5", label: "Cartões Over/Under 2.5" },
  { id: "cartoes_over_under_3_5", label: "Cartões Over/Under 3.5" },
  { id: "escanteios_over_under_7_5", label: "Escanteios Over/Under 7.5" },
  { id: "escanteios_over_under_8_5", label: "Escanteios Over/Under 8.5" },
  { id: "escanteios_over_under_9_5", label: "Escanteios Over/Under 9.5" },
  { id: "escanteios_over_under_10_5", label: "Escanteios Over/Under 10.5" },
];

export default function JogosHojeAmanha() {
  const [paises, setPaises] = useState([]);
  const [ligas, setLigas] = useState([]);
  const [paisSelecionado, setPaisSelecionado] = useState("");
  const [ligaSelecionada, setLigaSelecionada] = useState("");
  const [jogos, setJogos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({});
  const [mostrarAoVivo, setMostrarAoVivo] = useState(false);

  // Estado dos filtros de mercado (checkboxes)
  const [filtrosMercados, setFiltrosMercados] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/countries`, { headers }).then((res) => {
      setPaises(res.data.response);
    });
  }, []);

  useEffect(() => {
    if (paisSelecionado) {
      axios
        .get(`${API_URL}/leagues?country=${paisSelecionado}`, { headers })
        .then((res) => {
          setLigas(res.data.response);
        });
    } else {
      setLigas([]);
    }
  }, [paisSelecionado]);

  const buscarJogos = () => {
    const hoje = formatDate(new Date());
    const amanha = formatDate(new Date(Date.now() + 86400000));

    // A API do API-SPORTS não aceita 2 datas no mesmo parâmetro, vamos fazer duas chamadas e juntar resultados
    const urls = [
      `${API_URL}/fixtures?date=${hoje}`,
      `${API_URL}/fixtures?date=${amanha}`,
    ];

    Promise.all(
      urls.map((url) =>
        axios.get(
          ligaSelecionada ? `${url}&league=${ligaSelecionada}` : url,
          { headers }
        )
      )
    )
      .then((results) => {
        // Juntar resultados e remover duplicados se houver
        const todosJogos = results.flatMap((res) => res.data.response);
        setJogos(todosJogos);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    buscarJogos();
    const interval = setInterval(buscarJogos, 60000); // Atualiza a cada 1 min
    return () => clearInterval(interval);
  }, [ligaSelecionada]);

  const toggleStats = async (id, homeId, awayId) => {
    if (selected === id) {
      setSelected(null);
      return;
    }

    try {
      const [statsRes, h2hRes, lastHome, lastAway] = await Promise.all([
        axios.get(`${API_URL}/fixtures/statistics?fixture=${id}`, { headers }),
        axios.get(`${API_URL}/fixtures/headtohead?h2h=${homeId}-${awayId}`, {
          headers,
        }),
        axios.get(`${API_URL}/fixtures?team=${homeId}&last=5`, { headers }),
        axios.get(`${API_URL}/fixtures?team=${awayId}&last=5`, { headers }),
      ]);

      setStats({
        [id]: {
          estatisticas: statsRes.data.response,
          h2h: h2hRes.data.response,
          ultimosHome: lastHome.data.response,
          ultimosAway: lastAway.data.response,
        },
      });
      setSelected(id);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  // Função para alternar filtros de mercado
  const toggleFiltro = (id) => {
    setFiltrosMercados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtra jogos ao vivo ou todos
  let jogosFiltrados = mostrarAoVivo
    ? jogos.filter((j) =>
        ["1H", "2H", "LIVE"].includes(j.fixture.status.short)
      )
    : jogos;

  // Aqui você pode aplicar os filtros de mercados (depois de adicionar lógica)
  // Por enquanto, vou deixar sem filtro real pois depende dos dados da API e da estrutura dos odds
  // Pode ser feito futuramente ao mapear odds dos jogos e verificar se atendem aos filtros

  return (
    <div className="p-4 space-y-4 max-w-screen-md mx-auto">
      {/* Filtros país, liga, ao vivo */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          className="bg-gray-800 text-white p-3 rounded text-lg w-full sm:w-auto"
          value={paisSelecionado}
          onChange={(e) => {
            setPaisSelecionado(e.target.value);
            setLigaSelecionada("");
          }}
          aria-label="Selecione um país"
        >
          <option value="">Selecione um país</option>
          {paises.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="bg-gray-800 text-white p-3 rounded text-lg w-full sm:w-auto"
          value={ligaSelecionada}
          onChange={(e) => setLigaSelecionada(e.target.value)}
          disabled={!ligas.length}
          aria-label="Selecione uma liga"
        >
          <option value="">Selecione uma liga</option>
          {ligas.map((l) => (
            <option key={l.league.id} value={l.league.id}>
              {l.league.name}
            </option>
          ))}
        </select>

        <Button
          onClick={() => setMostrarAoVivo(!mostrarAoVivo)}
          className="w-full sm:w-auto px-6 py-3 text-lg font-semibold"
          aria-pressed={mostrarAoVivo}
        >
          {mostrarAoVivo ? "Ver Todos" : "Somente Ao Vivo"}
        </Button>
      </div>

      {/* Filtros mercados */}
      <div className="bg-gray-800 p-4 rounded grid grid-cols-2 sm:grid-cols-4 gap-2 text-white max-h-72 overflow-auto">
        {mercados.map(({ id, label }) => (
          <label
            key={id}
            className="flex items-center gap-2 cursor-pointer text-sm sm:text-base select-none"
          >
            <input
              type="checkbox"
              checked={!!filtrosMercados[id]}
              onChange={() => toggleFiltro(id)}
              className="accent-yellow-400"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Listagem de jogos */}
      {jogosFiltrados.length === 0 && (
        <div className="text-center text-gray-400">
          Nenhum jogo encontrado para os filtros selecionados.
        </div>
      )}

      {jogosFiltrados.map((jogo) => {
        const {
          fixture: { id, date, status },
          teams,
          league,
        } = jogo;

        const jogoStats = stats[id];
        const aoVivo = ["1H", "2H", "LIVE"].includes(status.short);

        return (
          <Card
            key={id}
            className={`text-white ${
              aoVivo ? "bg-red-700 animate-pulse" : "bg-gray-900"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col space-y-1">
                  <div className="text-sm">{league.name}</div>
                  <div className="text-xl font-bold">
                    {teams.home.name} vs {teams.away.name}
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    {aoVivo ? (
                      <>
                        <Flame
                          className="text-yellow-400 animate-bounce"
                          size={16}
                          aria-label="Ao vivo"
                        />{" "}
                        AO VIVO - {status.elapsed}'
                      </>
                    ) : (
                      new Date(date).toLocaleString()
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => toggleStats(id, teams.home.id, teams.away.id)}
                  className="px-6 py-3 text-lg font-semibold min-w-[160px]"
                  aria-expanded={selected === id}
                  aria-controls={`stats-${id}`}
                >
                  {selected === id ? "Fechar Estatísticas" : "Ver Estatísticas"}
                </Button>
              </div>

              {selected === id && jogoStats && (
                <div
                  id={`stats-${id}`}
                  className="mt-4 overflow-x-auto"
                  tabIndex={0} // para focar no teclado
                >
                  <div className="min-w-[600px] grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {/* Exemplo simples de estatísticas */}
                    <div className="bg-gray-700 p-2 rounded text-center">
                      <div className="font-semibold">Estatística 1</div>
                      <div>{/* valor */}</div>
                    </div>
                    <div className="bg-gray-700 p-2 rounded text-center">
                      <div className="font-semibold">Estatística 2</div>
                      <div>{/* valor */}</div>
                    </div>
                    <div className="bg-gray-700 p-2 rounded text-center">
                      <div className="font-semibold">Estatística 3</div>
                      <div>{/* valor */}</div>
                    </div>
                    <div className="bg-gray-700 p-2 rounded text-center">
                      <div className="font-semibold">Estatística 4</div>
                      <div>{/* valor */}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
