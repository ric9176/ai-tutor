import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAIA_ORG,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // assistant api: https://platform.openai.com/docs/assistants/overview?lang=node.js
  const availableModels = await openai.models.list();

  res.status(200).json({ data: availableModels });
}
