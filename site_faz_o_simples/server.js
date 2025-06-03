const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const SHEET_ID = "1dnYWpWZGqcP3GCoogY75HQ7uxpWdBBGD"; // ID da sua planilha
const SHEET_NAME = "Dicas"; // Nome da aba que contém os dados

app.get("/api/dicas", async (req, res) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}`;
    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer YOUR_ACCESS_TOKEN`, // Substitua pelo seu token de acesso
      },
    });

    const data = response.data.values;
    const header = data[0];
    const rows = data.slice(1);

    const dicas = rows.map(row => {
      const dica = {};
      header.forEach((col, index) => {
        dica[col] = row[index];
      });
      return dica;
    });

    res.json(dicas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados da planilha" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
