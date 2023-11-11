import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAIA_ORG,
});

export async function GET(res: NextApiResponse) {
  // Docs: https://platform.openai.com/docs/guides/gpt/chat-completions-api

  const availableModels = await openai.models.list();

  return new NextResponse(JSON.stringify({ data: availableModels }), {
    status: 200,
  });
}

// export async function POST(request: NextRequest) {
//   const { nameLookup }: MyData = await request.json();

//   if (!nameLookup) {
//     return new NextResponse(
//       JSON.stringify({ name: "Please provide something to search for" }),
//       { status: 400 }
//     );
//   }

//   return new NextResponse(JSON.stringify({ answer: "John Doe" }), {
//     status: 200,
//   });
// }
