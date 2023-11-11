import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAIA_ORG,
});

export async function GET(res: NextApiResponse) {
  // Docs: https://platform.openai.com/docs/guides/gpt/chat-completions-api

  // const availableModels = await openai.models.list();

  // const assistant = await openai.beta.assistants.create({
  //   name: "Math Tutor",
  //   instructions: "You are a personal math tutor. Write and run code to answer math questions.",
  //   tools: [{ type: "code_interpreter" }],
  //   model: "gpt-4-1106-preview"
  // });

  //const thread = await openai.beta.threads.create();

  // const message = await openai.beta.threads.messages.create(
  //   thread.id,
  //   {
  //     role: "user",
  //     content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
  //   }
  // );

  // const run = await openai.beta.threads.runs.create(
  //   thread.id,
  //   { 
  //     assistant_id: assistant.id,
  //     instructions: "Please address the user as Jane Doe. The user has a premium account."
  //   }
  // );

  // const run_finished = await openai.beta.threads.runs.retrieve(
  //   thread.id,
  //   run.id
  // );

  // const messages = await openai.beta.threads.messages.list(
  //   thread.id
  // );


  // make an assistant
  const assistant = await openai.beta.assistants.create({
    name: "Math Tutor",
    instructions: "You are a personal math tutor. Write and run code to answer math questions.",
    tools: [{"type": "retrieval"}],
    model: "gpt-4-1106-preview"
  });

  // make a thread
  const thread = await openai.beta.threads.create();

  // pass in Q to existing thread
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
  });

  // Use runs to wait for the assistant response and then retrieve it
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  let runStatus = await openai.beta.threads.runs.retrieve(
    thread.id,
    run.id
  );

  // Polling mechanism to see if runStatus is completed
  // This should be made more robust.
  while (runStatus.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }

  // Get the last assistant message from the messages array
  const messages = await openai.beta.threads.messages.list(thread.id);

  // Find the last message for the current run
  const lastMessageForRun = messages.data
    .filter(
      (message) => message.run_id === run.id && message.role === "assistant"
    )
    .pop();

  // If an assistant message is found, console.log() it
  // if (lastMessageForRun) {
  //   console.log(`${lastMessageForRun.content[0].text.value} \n`);
  // }

  res.status(200).json(lastMessageForRun);

  // res.status(200).json(availableModels);
}




