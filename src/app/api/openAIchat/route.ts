import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { NextRequest } from "next/server";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    temperature: 0.9,
    messages: messages.map((message: any) => ({
      content: message.content,
      role: message.role,
    })),
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
