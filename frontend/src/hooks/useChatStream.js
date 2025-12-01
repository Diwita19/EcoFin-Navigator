// src/hooks/useChatStream.js
import { useRef } from "react";

export default function useChatStream() {
    const eventSourceRef = useRef(null);

    function startStream(url, payload, onThinking, onFinal) {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const query = new URLSearchParams({
            message: payload.message,
            history: JSON.stringify(payload.history),
        });

        const es = new EventSource(`${url}?${query.toString()}`);
        eventSourceRef.current = es;

        es.addEventListener("thinking", (e) => {
            try {
                onThinking(JSON.parse(e.data));
            } catch {
                onThinking(e.data);
            }
        });

        es.addEventListener("final", (e) => {
            try {
                onFinal(JSON.parse(e.data));
            } catch {
                onFinal(e.data);
            }
            es.close();
        });

        es.onerror = () => {
            es.close();
        };

        return () => es.close();
    }

    return startStream;
}