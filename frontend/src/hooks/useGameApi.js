import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
  timeout: 8000,
});

export const useGameApi = () => {
  const handle = async (request) => {
    try {
      const response = await request();
      return { data: response.data, error: null };
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Request failed";
      return { data: null, error: message };
    }
  };

  return {
    init: () => handle(() => api.post("/init")),
    restart: () => handle(() => api.post("/restart")),
    getBoard: () => handle(() => api.get("/board")),
    classicalMove: (cell) => handle(() => api.post("/move/classical", { cell })),
    quantumMove: (cellA, cellB) => handle(() => api.post("/move/quantum", { cellA, cellB })),
    collapse: () => handle(() => api.post("/collapse")),
    getCircuit: () => handle(() => api.get("/circuit")),
    aiMove: (player) => handle(() => api.post("/ai/move", { player })),
  };
};
