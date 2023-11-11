import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAIA_ORG,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = JSON.parse(req.body);
  console.log("🚀 ~ file: assistantExample.ts:15 ~ prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: 'requiredParam "prompt" is missing' });
  }
  // assistant api: https://platform.openai.com/docs/assistants/overview?lang=node.js

  // define our files:
  const markscheme_file = await openai.files.create({
    file: fs.createReadStream("techstars_hackathon_markscheme.pdf"),
    purpose: "assistants",
  });

  console.log("", markscheme_file);

  const paper_file = await openai.files.create({
    file: fs.createReadStream("techstars_hackathon_questionpaper.pdf"),
    purpose: "assistants",
  });

  console.log("paper_file", paper_file);

  //   const student_answer = await openai.files.create({
  //     file: fs.createReadStream("studentAnswer.txt"),
  //     purpose: "assistants",
  //   });

  // make an assistant
  const assistant = await openai.beta.assistants.create({
    name: "English Tutor",
    instructions:
      "You are an English tutor. You are given two files which I want you to read. One will be a set of questions, the other a markscheme. Return me your answer in syntactitcally correct markdown",
    tools: [{ type: "retrieval" }],
    model: "gpt-4-1106-preview",
    file_ids: [markscheme_file.id, paper_file.id],
  });

  // make a thread
  const thread = await openai.beta.threads.create();

  // pass in Q to existing thread
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: `
    You've been provided with an exam paper called techstars_hackathon_questionpaper and a mark scheme called techstars_hackathon_markscheme. When a student submits an answer to a question on the paper, follow these guidelines to respond:
    ### Response Format:
    #### Question
    (Write full question)
    ##Grading
    (Write scoring for question)
    #### Student's Answer
    (Write student's answer)
    #### Grading AO1-AO3
    | **Assessment Objective** | **Comments** | **Grade** |
    | ------------------------ | ------------ | --------- |
    | AO1                      | (Comments against AO1) | (Grade for AO1) |
    | AO2                      | (Comments against AO2) | (Grade for AO2) |
    | AO3                      | (Comments against AO3) | (Grade for AO3) |
    | **Average level across AO1-AO3** | | |
    | **Score:**               | | |
    #### Grading AO4:
    | **Assessment Objective** | **Comments** | **Grade** |
    | ------------------------ | ------------ | --------- |
    | AO4                      | (Comments against AO4) | (Grade for AO4) |
    | **AO4 Score:**           | | |
    ### Student's Answer to Section A Question 1: ${prompt}`,
  });

  // Use runs to wait for the assistant response and then retrieve it
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

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

  res.status(200).json({ data: lastMessageForRun });
}
