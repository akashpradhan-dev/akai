export const fetchAiResponse = async (
  prompt: string,
  token: string | null,
  onChunk: (text: string) => void,
  history: { role: "user" | "bot"; parts: { text: string }[] }[] = []
) => {
  if (!token) {
    throw new Error("Missing authorization token");
  }

  const res = await fetch("/api/generate-chart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: prompt, history }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API error: ${res.status} - ${errorBody}`);
  }

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    result += chunk;
    onChunk(chunk);
  }

  return result;
};
