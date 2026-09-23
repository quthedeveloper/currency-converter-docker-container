import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;
const FRANKFURTER_URL = "https://api.frankfurter.app/latest";

app.use(cors());
app.use(express.json());

// GET /api/currencies -> list of supported currency codes
app.get("/api/currencies", async (req, res) => {
  try {
    const response = await fetch(FRANKFURTER_URL);
    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);
    const data = await response.json();
    const currencies = [...Object.keys(data.rates), data.base].sort();
    res.json({ currencies });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// GET /api/convert?amount=1&from=USD&to=EUR
app.get("/api/convert", async (req, res) => {
  const amount = parseFloat(req.query.amount) || 1;
  const from = (req.query.from || "USD").toUpperCase();
  const to = (req.query.to || "EUR").toUpperCase();

  try {
    const url = `${FRANKFURTER_URL}?amount=${amount}&from=${from}&to=${to}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);
    const data = await response.json();
    const result = data.rates?.[to];

    if (result === undefined) {
      return res.status(400).json({ error: `Could not convert to ${to}` });
    }

    res.json({ amount, from, to, result, date: data.date });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Health check for Docker/Kubernetes
app.get("/healthz", (_, res) => res.status(200).json({ status: "ok" }));

app.listen(PORT,"0.0.0.0", () => {
  console.log(`Currency converter API running on port ${PORT}`);
});
