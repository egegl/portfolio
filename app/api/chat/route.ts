import Together from 'together-ai';

export async function POST(request: Request) {
  const { messages } = await request.json();
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing TOGETHER_API_KEY' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const together = new Together({ apiKey });
  const stream = await together.chat.completions.create({
    model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
    messages,
    stream: true
  });
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const token of stream) {
        const content = token.choices[0]?.delta?.content;
        if (content) {
          const data = JSON.stringify({ content });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      }
      controller.close();
    }
  });
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  });
}