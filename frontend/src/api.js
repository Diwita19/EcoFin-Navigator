import axios from "axios";
const API = "http://127.0.0.1:8000";

export async function sendMessage(message) {
    const res = await axios.post(`${API}/chat`, { message });
    return res.data;
}

export async function runFullAnalysis() {
    const res = await axios.get(`${API}/analysis/full`);
    return res.data;
}