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
  Grid,
  GridItem,
  Heading,
  FormControl,
  FormLabel,
  Card,
} from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import GradingCard from "./components/GradingCard";

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
    // setStudentInput("");

    setIsLoading(true);

    const { data } = await fetch("/api/assistantExample", {
      method: "POST",
      body: JSON.stringify({
        prompt: studentInput,
      }),
    }).then((r) => r.json());

    setCompletion(data);

    setIsLoading(false);
    // setStudentInput("");
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
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} p={5}>
        <GridItem colSpan={2}>
          <VStack align="stretch" spacing={5}>
            <Box>
              <Heading size="md">
                {(completion && completion.name) || "John Smith"}
              </Heading>
              <Text fontSize="sm">
                {(completion && completion.paper) || "AQA English 2023"}
              </Text>
            </Box>
            <Card p={2}>
              <Heading size="md">Section A: Question 2</Heading>
              <Text mt={4}>
                Lady Macbeth is a female character who changes during the
                play...
              </Text>
            </Card>
            <Box as="form">
              <Textarea
                placeholder="Student's answer..."
                size="md"
                autoFocus
                height="300px"
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
              />
              <Button
                type="submit"
                mt={2}
                isLoading={isLoading}
                colorScheme="teal"
                onClick={handleOnGenerateText}
              >
                Submit Answer
              </Button>
            </Box>
          </VStack>
        </GridItem>
        <GridItem colSpan={1}>
          <VStack align="stretch" spacing={5}>
            <Card p={2}>
              <Heading size="sm">AO1</Heading>
              <Text mt={2}>
                The student demonstrates a clear understanding...
              </Text>
            </Card>


            <GradingCard assessment_objective={"AO2"} comments={"The student shows ..."} level_achieved={"3"}></GradingCard>


            <Card p={2}>
              <Heading size="sm">AO3</Heading>
              <Text mt={2}>
                The student shows understanding of the broader themes...
              </Text>
            </Card>
            <Card p={2}>
              <Heading size="sm">AO4</Heading>
              <Text mt={2}>
                The student’s answer is well-structured and coherent...
              </Text>
            </Card>
            <Card borderWidth="1px" p={4}>
              <FormControl id="ao1-ao3-score">
                <FormLabel>Score (AO1 - AO3)</FormLabel>
                <Input
                  type="number"
                  value={"scoreA03"}
                  // onChange={(e) => setScoreAO1AO3(e.target.value)}
                />
              </FormControl>
              <FormControl id="ao4-score" mt={4}>
                <FormLabel>Score (AO4)</FormLabel>
                <Input
                  type="number"
                  value={"scoreA04"}
                  // onChange={(e) => setScoreAO4(e.target.value)}
                />
              </FormControl>
              <Button colorScheme="green" mt={4}>
                Save Score
              </Button>
            </Card>
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
};

export default Home;
