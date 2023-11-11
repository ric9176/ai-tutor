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
  // const handleFileUpload = async (e: any) => {
  //   e.preventDefault();
  //   if (!file) return;
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   const response = await fetch("/api/upload", {
  //     method: "POST",
  //     body: formData,
  //   });
  // };
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
        <Text>{completion && completion.paper}</Text>
      </VStack>{" "}
    </Container>
  );
};

export default Home;
