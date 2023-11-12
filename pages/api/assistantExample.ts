import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import fs from "fs";
import { EXAMPLE_PROMPT } from "langchain/chains/query_constructor";

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

  const shape = {
    name: "string",
    paper: "string",
    question: "string",
    grading: [
      {
        assesment_objective: "string",
        comments: "string",
        level_achieved: "number",
      },
    ],
    score: [{ assesment_objective: "string", total_score: "string" }],
    student_answer: "string",
  };

  // make an assistant

  const assistant = await openai.beta.assistants.create({
    name: "English Tutor",
    instructions: `You are an English tutor. You are given two files which I want you to read. One will be a set of questions, the other a markscheme. Return me your answer in syntactitcally correct JSON, use the following schema: ${JSON.stringify(
      shape
    )}, ONLY RETURN VALID JSON`,
    tools: [{ type: "retrieval" }],
    model: "gpt-4-1106-preview",
    file_ids: [markscheme_file.id, paper_file.id],
  });

  // make a thread
  const thread = await openai.beta.threads.create();

  // pass in Q to existing thread

  const exampleResponse = {
    name: "John Smith",
    paper: "AQA English Literature 2023",
    question: `"Lady Macbeth is a female character who changes during the play." Starting with this moment in the play explore how far you agree with this view. Write about
    - how Shakespeare presents Lady Macbeth in this extract
    - how far Shakespeare presents Lady Macbeth as a female character who changes in the play as a whole`,
    grading: [
      {
        assesment_objective: "A01",
        comments:
          "The student provides a personal response to the character of Lady Macbeth and her changes over the course of the play. There is a clear understanding and engagement with the text, although the analysis could be more developed with explicit references to the extract and text as a whole.",
        level_achieved: 4,
      },
      {
        assesment_objective: "A02",
        comments: "The student...",
        level_achieved: 3,
      },
      {
        assesment_objective: "A03",
        comments: "The student...",
        level_achieved: 4,
      },
      {
        assesment_objective: "A04",
        comments: "The student...",
        level_achieved: 3,
      },
    ],
    score: [{ title: "Score (A01 - A03)", total_score: "18/30" }],
    student_answer: `Alright, so in this part of 'Macbeth,' we're looking at Lady Macbeth sleepwalking and talking in her sleep. It's pretty intense because she's freaking out about the murders she and Macbeth have been involved in. Like, she keeps trying to wash imaginary blood off her hands and talks about the smell of blood that perfumes can't cover up. This is totally different from how she was earlier in the play. Remember when she was all like, 'We gotta be tough and do what needs to be done'? Now, she's super guilt-ridden and scared.
    In the beginning, Lady Macbeth was really ambitious and kind of pushed Macbeth to do all those bad things. She was pretty strong and seemed like she could handle anything. But now, in this scene, she's falling apart. It's like the guilt is too much for her, and she can't deal with what they've done. So, yeah, she's changed a lot. She started off all tough and ended up being overwhelmed by guilt and fear.
    Overall, Shakespeare shows Lady Macbeth as someone who goes through a big change. At first, she's all about power and doing whatever it takes to get it. But then, she can't handle the consequences of her actions and totally breaks down. It's kind of a warning about ambition and guilt, I guess. So, I'd say I agree that she changes during the play, and it's a pretty dramatic change too.`,
  };

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: `
    You've been provided with an exam paper called techstars_hackathon_questionpaper and a mark scheme called techstars_hackathon_markscheme. When a student submits an answer to a question on the paper, follow these guidelines to respond:
    Example Format:
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
    ### Student's Answer to Section A Question 1: ${prompt}
    IMPORTANT: return a valid JSON object, for example: ${JSON.stringify(
      exampleResponse
    )} VALID JSON ONLY, CALCULATE THE LEVEL ACHIEVED BASED ON THE MARKSCHEME DOCUMENT DATA`,
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
  console.log("🚀 ~ file: assistantExample.ts:156 ~ messages:", messages);

  // Find the last message for the current run
  const lastMessageForRun = messages.data
    .filter(
      (message) => message.run_id === run.id && message.role === "assistant"
    )
    .pop();

  console.log("response ===>>>", lastMessageForRun.content[0].text.value);
  const formatedData = lastMessageForRun.content[0].text.value
    .replace("```json", "")
    .replace("```", "");
  console.log(
    "🚀 ~ file: assistantExample.ts:154 ~ formatedData:",
    formatedData
  );

  const data = JSON.parse(formatedData as string);

  res.status(200).json({ data });
}
