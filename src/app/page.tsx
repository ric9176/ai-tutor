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

import GradingCard from "./components/gradingCard";
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
              <Heading size="md">Simon Smith</Heading>
              <Text fontSize="sm">AQA English Literature 2019</Text>
            </Box>
            <Card p={2}>
              <Heading size="md">Section A: Question 2</Heading>
              <Text mt={4}>
                Lady Macbeth is a female character who changes during the
                play...
              </Text>
            </Card>
            <Box>
              <Textarea placeholder="Student's answer..." height="300px" />
              <Button colorScheme="blue" mt={2}>
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

            <Card p={2}>
              <Heading size="sm">AO2</Heading>
              <Text mt={2}>
                There is an effective analysis of Lady Macbeth's...
              </Text>
            </Card>

            <GradingCard comments={"the student accurately note that...."} assessment_objective={"AO3"}  ></GradingCard>

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
          <Text>{completion && JSON.stringify(completion)}</Text>
        </VStack>{" "}
      </Container>
    </>
  );
};

export default Home;
