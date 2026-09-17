import WebSocket from "ws";

const server = Bun.serve({
  port: 3001,

  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Crypto WebSocket Server Running!");
  },

  websocket: {
    open(ws) {
      console.log("🟢 Frontend connected to the Bun server!");
      ws.subscribe("crypto-updates");
    },
    message() {},
    close() {
      console.log("🔴 Frontend disconnected from the Bun server!");
    },
  },
});

console.log(`🚀 Bun Server is running on ws://localhost:${server.port}`);

const binanceWs = new WebSocket(
  "wss://stream.binance.com:9443/ws/btcusdt@trade/ethusdt@trade/solusdt@trade/xrpusdt@trade"
);

binanceWs.on("message", (data) => {
  const parsed = JSON.parse(data.toString());

  const cryptoData = JSON.stringify({
    symbol: parsed.s,
    price: parsed.p,
    time: parsed.E,
  });

  server.publish("crypto-updates", cryptoData);
});