# 🚀 Real-Time Crypto Dashboard

A modern, high-performance real-time cryptocurrency tracking dashboard built with **SolidJS**, **TypeScript**, **WebSockets**, and **Bun**.

## 🛠️ Tech Stack

- **Frontend:** SolidJS, Vite, TypeScript, CSS Modules
- **Backend/Server:** Bun, Native WebSockets (for live data streaming)

## 📁 Project Structure

```text
realtime-crypto-dashboard/
├── frontend/        # SolidJS user interface
├── server.ts        # Bun WebSocket server
└── tsconfig.json    # TypeScript configurations 

## ⚙️ Getting Started Locally
Make sure you have Bun installed on your machine.

1. Clone the repository
Bash
git clone [https://github.com/Ձեր-GitHub-ի-Անունը/realtime-crypto-dashboard.git](https://github.com/Ձեր-GitHub-ի-Անունը/realtime-crypto-dashboard.git)
cd realtime-crypto-dashboard
2. Run the WebSocket Server
Start the backend server using Bun:

Bash
bun run server.ts
3. Run the Frontend
Open a new terminal window, navigate to the frontend folder, install dependencies, and start the development server:

Bash
cd frontend
bun install
bun run dev
Open http://localhost:5173 in your browser to view the live crypto dashboard.
