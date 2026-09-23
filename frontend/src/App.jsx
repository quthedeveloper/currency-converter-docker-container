import { useEffect, useState } from "react";

const API_BASE = "/api";



function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4v16" />
      <path d="M3.5 7.5 7 4l3.5 3.5" />
      <path d="M17 20V4" />
      <path d="M20.5 16.5 17 20l-3.5-3.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export default function App() {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [spun, setSpun] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/currencies`)
      .then((res) => res.json())
      .then((data) => {
        if (data.currencies) setCurrencies(data.currencies);
      })
      .catch(() => setError("Currency list didn't load. Check the backend is running."));
  }, []);

  async function handleConvert(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/convert?amount=${amount}&from=${from}&to=${to}`
      );
      const data = await res.json();

      if (!res.ok) {
        setResult(null);
        setError(data.error || "That conversion didn't go through. Try again.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setResult(null);
      setError("No response from the backend. Start it and try again.");
    } finally {
      setLoading(false);
    }
  }

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
    setResult(null);
    setSpun((n) => n + 1);
  }

  const rate =
    result && result.amount > 0
      ? (result.result / result.amount).toFixed(4)
      : null;

  return (
    <div className="page">
      <main className="card">
        <div className="logo">
          <span className="logo-rule left" />
          <span className="logo-mark">QP</span>
          <span className="logo-rule" />
        </div>

        <header className="card-head">
          <h1>Currency converter</h1>
          <p>Live mid-market rates, updated each weekday.</p>
        </header>

        <form onSubmit={handleConvert}>
          <div className="field">
            <label htmlFor="amount">Amount</label>
            <div className="input-group">
              <input
                id="amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div className="select-wrap">
                <select
                  aria-label="Convert from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </div>
          </div>

          <div className="swap-rail">
            <span className="rule" />
            <button
              type="button"
              className="swap-btn"
              onClick={swapCurrencies}
              aria-label="Swap currencies"
              style={{ "--turns": spun }}
            >
              <SwapIcon />
            </button>
            <span className="rule" />
          </div>

          <div className="field">
            <label htmlFor="to">Converted to</label>
            <div className="select-wrap full">
              <select
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <SpinnerIcon /> : <ArrowIcon />}
            <span>{loading ? "Converting" : "Convert"}</span>
          </button>
        </form>

        {error && (
          <p className="error" role="alert">
            <AlertIcon />
            <span>{error}</span>
          </p>
        )}

        {result && !error && (
          <section className="result" key={`${result.from}${result.to}${result.result}`}>
            <p className="result-from">
              {Number(result.amount).toLocaleString()} {result.from} equals
            </p>
            <p className="result-figure">
              <span className="figure">
                {Number(result.result).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="code">{result.to}</span>
            </p>
            <p className="result-meta">
              1 {result.from} = {rate} {result.to} &nbsp;·&nbsp; rates from {result.date}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}