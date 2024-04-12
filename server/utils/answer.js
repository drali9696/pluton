import { createParser } from "eventsource-parser";

export const OpenAIStream = async (prompt, response) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.aiguoguo199.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: process.env.OPENAI_API_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that accurately answers the user's queries based on the given text. You ALWAYS answer in language user asked you in.",
        },
        { role: "user", content: prompt },
      ],
      // max_tokens: 120,
      temperature: 0,
      stream: true,
    }),
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            response.end("===DONE===");
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            response.write(text);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
