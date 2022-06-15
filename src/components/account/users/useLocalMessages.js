import { useState } from "react";

export default function useLocalMessages(mutate) {
  const [localMessages, setLocalMessages] = useState([]);

  const addMessage = async (text, send_promise) => {
    const date = new Date().toISOString().slice(0, -1);
    const message = {
      text: text,
      created_at: date,
      status: "pending",
    };

    setLocalMessages((prev) => {
      return [...prev, message];
    });

    send_promise.then(
      async () => {
        await mutate();
        setLocalMessages((prev) => {
          return prev.filter((m) => m?.created_at != message.created_at);
        });
      },
      () => {
        setLocalMessages((prev) => {
          prev[
            prev.findIndex((m) => m?.created_at == message.created_at)
          ].status = "error";
          return [...prev];
        });
      }
    );
  };

  return { addMessage, localMessages };
}
