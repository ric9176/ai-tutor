"use client";
import type { NextPage } from "next";
import {
  Box,
  Button,
  Textarea,
  VStack,
  Text,
  Input,
  Grid,
  GridItem,
  Heading,
  FormControl,
  FormLabel,
  Card,
  Skeleton,
} from "@chakra-ui/react";
import { useState } from "react";
import GradingCard from "./components/GradingCard";

const Home: NextPage = () => {
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
                {(completion && completion.paper) ||
                  "AQA English Literature 2023"}
              </Text>
            </Box>
            <Card p={2}>
              <Heading size="md">Section A: Question 2</Heading>
              <Text mt={4}>
                Lady Macbeth is a female character who changes during the play."
                Starting with this moment in the play explore how far you agree
                with this view. Write about - how Shakespeare presents Lady
                Macbeth in this extract - how far Shakespeare presents Lady
                Macbeth as a female character who changes in the play as a whole
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
          <Skeleton isLoaded={!isLoading}>
            <VStack align="stretch" spacing={5}>
              {completion &&
                completion.grading.length > 0 &&
                completion.grading.map(
                  ({ assesment_objective, comments, level_achieved }) => (
                    <GradingCard
                      assessment_objective={assesment_objective}
                      comments={comments}
                      level_achieved={level_achieved}
                    ></GradingCard>
                  )
                )}

              <Card borderWidth="1px" p={4}>
                <FormControl id="ao1-ao3-score">
                  <FormLabel>Score (AO1 - AO3)</FormLabel>
                  <Input type="number" value={"scoreA03"} />
                </FormControl>
                <FormControl id="ao4-score" mt={4}>
                  <FormLabel>Score (AO4)</FormLabel>
                  <Input type="number" value={"scoreA04"} />
                </FormControl>
                <Button colorScheme="green" mt={4}>
                  Save Score
                </Button>
              </Card>
            </VStack>
          </Skeleton>
        </GridItem>
      </Grid>
    </>
  );
};

export default Home;
