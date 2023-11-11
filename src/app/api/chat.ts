import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage } from "langchain/schema";
import { NextRequest } from "next/server";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  const { messages } = await req.json();
  const { stream, handlers } = LangChainStream();

  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    streaming: true,
    temperature: 0.9,
  });

  console.log("here");

  llm
    .call(
      (messages as Message[]).map((m) =>
        m.role == "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      ),
      {},
      [handlers]
    )
    .catch(console.error);
  return new StreamingTextResponse(stream);
}
