import Together from 'together-ai';

const SYSTEM_PROMPT = process.env.CHAT_SYSTEM_PROMPT || 'You are EgeBot.';

export async function POST(request: Request) {
  const { messages } = await request.json();
  const apiKey = process.env.TOGETHER_API_KEY;
  const together = new Together({ apiKey });
  // Add system prompt at the start if not already present
  let startMessages = messages;
  if (!messages.some((m: any) => m.role === 'system')) {
    startMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];
  }
  const stream = await together.chat.completions.create({
    model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
    messages: startMessages,
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
