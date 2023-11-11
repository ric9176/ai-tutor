import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAIA_ORG,
});

export async function GET(res: NextApiResponse) {
  // Docs: https://platform.openai.com/docs/guides/gpt/chat-completions-api

  const availableModels = await openai.models.list();

  res.status(200).json(availableModels);
}
