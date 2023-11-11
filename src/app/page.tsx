"use client";
import type { NextPage } from "next";
import {
  Box,
  Button,
  Textarea,
  VStack,
  Container,
  Text,
  Input,
  HStack,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const Home: NextPage = () => {
  const [markdownText, setMarkdownText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [studentInput, setStudentInput] = useState("");
  const [completion, setCompletion] = useState(null);
  console.log("🚀 ~ file: page.tsx:26 ~ completion:", completion);

  async function handleOnGenerateText(e: React.SyntheticEvent) {
    e.preventDefault();
    setStudentInput("");

    setIsLoading(true);

    const { data } = await fetch("/api/assistantExample", {
      method: "POST",
      body: JSON.stringify({
        prompt: studentInput,
      }),
    }).then((r) => r.json());

    setCompletion(data);

    setIsLoading(false);
    setStudentInput("");
  }

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async (e: any) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  };
  return (
    <Container maxW="container.lg" pb={10}>
      <VStack spacing={2} w="60%" as="form" alignItems="center">
        <Input
          placeholder="Enter student answer"
          value={studentInput}
          onChange={(e) => setStudentInput(e.target.value)}
          maxW="lg"
          width="100%"
        />
        <Spacer />
        <Button
          type="submit"
          isLoading={isLoading}
          colorScheme="teal"
          onClick={handleOnGenerateText}
          px={8}
        >
          Evaluate Answer
        </Button>
        <ReactMarkdown>
          {completion && completion.content[0].text.value}
        </ReactMarkdown>
      </VStack>{" "}
      {/* <VStack flex={1} p={4} spacing={4} align="center">
        <Button onClick={onOpen}>Upload Files</Button>
        <input
          type="file"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          ref={(ref) => isOpen && ref && ref.click()}
          onClose={onClose}
        />
        <Textarea
          placeholder="Enter Markdown here..."
          value={markdownText}
          onChange={(e) => setMarkdownText(e.target.value)}
          size="lg"
          w="full"
        />
        <ReactMarkdown>
          {`#### Question  1  ‘Lady Macbeth is a female character who changes during the play.’
Starting with this moment in the play explore how far you agree with this view. Write about: 
• how Shakespeare presents Lady Macbeth in this extract
• how far Shakespeare presents Lady Macbeth as a female character who changes in the play as a whole. 
[30 marks] 
AO4 [4 marks]【17†source】.
## Grading\nFor AO1-AO3: 
Marks are awarded based on the explanation and examples provided by students related to the critical style and personal response, usage of textual references, analysis of language, form and structure, and understanding of the text in its context【11†source】.
For AO4: Marks are awarded based on the level of spelling and punctuation accuracy, vocabulary and sentence structures to achieve control of meaning with a grading scale from 0 to 4 marks【12†source】【13†source】.
### Student's Answer
"Alright, so in this part of 'Macbeth,' we're looking at Lady Macbeth sleepwalking and talking in her sleep. It's pretty intense because she's freaking out about the murders she and Macbeth have been involved in. Like, she keeps trying to wash imaginary blood off her hands and talks about the smell of blood that perfumes can't cover up. This is totally different from how she was earlier in the play. Remember when she was all like, 'We gotta be tough and do what needs to be done'? Now, she's super guilt-ridden and scared.
In the beginning, Lady Macbeth was really ambitious and kind of pushed Macbeth to do all those bad things. She was pretty strong and seemed like she could handle anything. But now, in this scene, she's falling apart. It's like the guilt is too much for her, and she can't deal with what they've done. So, yeah, she's changed a lot. She started off all tough and ended up being overwhelmed by guilt and fear.
Overall, Shakespeare shows Lady Macbeth as someone who goes through a big change. At first, she's all about power and doing whatever it takes to get it. But then, she can't handle the consequences of her actions and totally breaks down. It's kind of a warning about ambition and guilt, I guess. So, I'd say I agree that she changes during the play, and it's a pretty dramatic change too."
### Grading AO1-AO3
| **Assessment Objective** | **Comments** | **Grade** |
| ------------------------ | ------------ | --------- |
| AO1                      | The student has demonstrated a personal response, but the critical style could be developed further. Limited textual references have been used to support interpretations. | 2 |
| AO2                      | Analysis of language is present but lacks depth. The student could have included specific terminology and more detailed examples. | 2 |
| AO3                      | Understanding of text and context is evident; however, explicit connections between Lady Macbeth's development and the wider context of the play are not thoroughly explored. | 2 |
| **Average level across AO1-AO3** | | 2 |\n| **Score:**               | | 6/30 |

### Grading AO4:
| **Assessment Objective** | **Comments** | **Grade** |
| ------------------------ | ------------ | --------- |
| AO4                      | The spelling and punctuation are reasonably accurate, and the sentence structures are appropriate for clarity, making it a threshold performance.| 1 |
| **AO4 Score:**           | | 1/4 |`}
        </ReactMarkdown>
      </VStack> */}
    </Container>
  );
};

export default Home;
