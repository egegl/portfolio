import Together from 'together-ai';

/**
 * Chat API endpoint handler. Streams chat completion responses from TogetherAI.
 * 
 * @param {Request} request - Incoming POST request with JSON body { messages }
 * @returns {Response} - Server-sent event (SSE) stream with chat messages
 */
export async function POST(request: Request) {
  // Parse the messages array from client
  const { messages } = await request.json();
  // Safely access the TogetherAI API key from environment variables
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key is not configured.' }), { status: 500 });
  }

  // Initialize TogetherAI SDK
  const together = new Together({ apiKey });

  // Create streaming chat completion
  const stream = await together.chat.completions.create({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    messages,
    stream: true,
  });

  // Setup text encoder and readable stream for SSE
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        // Send each streamed chunk as SSE data
        for await (const token of stream) {
          const content = token.choices[0]?.delta?.content;
          if (content) {
            const data = JSON.stringify({ content });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`data: {"error": "${String(err)}"}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  // Respond with event-stream headers for SSE
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
