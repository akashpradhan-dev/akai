export const fetchAiResponse = async (
  prompt: string,
  onChunk: (text: string) => void
) => {
  const res = await fetch("/api/generate-chart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: prompt }),
  });

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
