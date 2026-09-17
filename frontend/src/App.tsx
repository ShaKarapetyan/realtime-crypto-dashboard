import { createSignal, onMount, onCleanup, For } from "solid-js";
// @ts-ignore
import { createChart, LineSeries } from "lightweight-charts";

type CryptoPrice = {
  symbol: string;
  price: string;
  time: number;
};

type CardState = {
  price: string;
  status: "up" | "down" | "neutral";
};

export default function App() {
  const [prices, setPrices] = createSignal<{ [key: string]: CardState }>({});
  const [status, setStatus] = createSignal<string>("Connecting...");
  const [selectedSymbol, setSelectedSymbol] = createSignal<string>("BTCUSDT");

  let socket: WebSocket;
  let chartContainerRef: HTMLDivElement | undefined;
  let chart: any = null;
  let lineSeries: any = null;

  onMount(() => {
    if (chartContainerRef) {
      chart = createChart(chartContainerRef, {
        width: chartContainerRef.clientWidth,
        height: chartContainerRef.clientHeight || 420,
        layout: {
          background: { color: "#1e293b" },
          textColor: "#94a3b8",
        },
        grid: {
          vertLines: { color: "#334155" },
          horzLines: { color: "#334155" },
        },
        timeScale: { 
          timeVisible: true, 
          secondsVisible: true,
          borderVisible: false 
        },
      });

      lineSeries = chart.addSeries(LineSeries, {
        color: "#38bdf8",
        lineWidth: 2,
      });

      const handleResize = () => {
        if (chart && chartContainerRef) {
          chart.applyOptions({
            width: chartContainerRef.clientWidth,
            height: chartContainerRef.clientHeight,
          });
        }
      };

      window.addEventListener("resize", handleResize);
    }

    socket = new WebSocket("ws://localhost:3001");
    socket.onopen = () => setStatus("🟢 Connection established");

    socket.onmessage = (event) => {
      const data: CryptoPrice = JSON.parse(event.data);
      const newPriceStr = parseFloat(data.price).toFixed(2);
      const newPriceNum = parseFloat(newPriceStr);
      const timestamp = Math.floor(data.time / 1000);

      setPrices((prev) => {
        const currentData = prev[data.symbol];
        let priceStatus: "up" | "down" | "neutral" = "neutral";

        if (currentData) {
          const oldPrice = parseFloat(currentData.price);
          if (newPriceNum > oldPrice) priceStatus = "up";
          else if (newPriceNum < oldPrice) priceStatus = "down";
          else priceStatus = currentData.status;
        }

        return {
          ...prev,
          [data.symbol]: { price: newPriceStr, status: priceStatus },
        };
      });

      if (data.symbol === selectedSymbol() && lineSeries) {
        lineSeries.update({
          time: timestamp as any,
          value: newPriceNum,
        });
      }
    };

    socket.onclose = () => setStatus("🔴 Connection lost");
  });

  const changeSymbol = (symbol: string) => {
    setSelectedSymbol(symbol);
    if (lineSeries) {
      lineSeries.setData([]);
    }
  };

  onCleanup(() => {
    if (socket) socket.close();
    if (chart) chart.remove();
  });

  return (
    <div style={{ padding: "20px", "max-width": "1200px", margin: "0 auto", display: "flex", "flex-direction": "column", gap: "20px", "box-sizing": "border-box" }}>
      <div style={{ "text-align": "center" }}>
        <h1 style={{ color: "#f8fafc", "font-size": "24px", margin: "0 0 4px 0" }}> Real-Time Crypto Dashboard</h1>
        <p style={{ color: "#94a3b8", "font-size": "14px", margin: 0 }}>
          Status: <span style={{ color: "#38bdf8", "font-weight": "600" }}>{status()}</span>
        </p>
      </div>

      <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
        <For each={Object.entries(prices())}>
          {([symbol, item]) => {
            const isSelected = selectedSymbol() === symbol;
            const isUp = item.status === "up";
            const isDown = item.status === "down";

            return (
              <div
                onClick={() => changeSymbol(symbol)}
                style={{
                  background: isSelected ? "#1e293b" : "#0f172a",
                  border: `2px solid ${isSelected ? "#38bdf8" : isUp ? "#22c55e" : isDown ? "#ef4444" : "#334155"}`,
                  "border-radius": "12px",
                  padding: "16px",
                  "text-align": "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "box-shadow": isSelected ? "0 0 12px rgba(56, 189, 248, 0.3)" : "none",
                }}
              >
                <div style={{ color: "#94a3b8", "font-size": "14px", "font-weight": "600", "margin-bottom": "6px" }}>{symbol}</div>
                <div style={{ "font-size": "20px", "font-weight": "bold", color: isUp ? "#22c55e" : isDown ? "#ef4444" : "#f8fafc" }}>
                  ${item.price}
                </div>
              </div>
            );
          }}
        </For>
      </div>

      <div style={{ background: "#1e293b", "border-radius": "12px", border: "1px solid #334155", padding: "16px" }}>
        <h3 style={{ margin: "0 0 12px 0", color: "#38bdf8", "font-size": "16px" }}>
          📈 Live Chart: {selectedSymbol()}
        </h3>
        <div ref={chartContainerRef} style={{ width: "100%", height: "420px" }} />
      </div>
    </div>
  );
}