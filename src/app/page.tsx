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
  SkeletonText,
} from "@chakra-ui/react";
import { useState } from "react";
import GradingCard from "./components/GradingCard";
import BottomScores from "./components/BottomScores";
import BottomButtons from "./components/BottomButtons";

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
          <Card p={4}>
            <VStack align="stretch" spacing={5}>
              <Box>
                <Heading size="md">
                  {(completion && completion.name) || "John Smith"}
                </Heading>

                <Text fontSize="sm">"AQA English Literature 2023"</Text>
              </Box>
              <Card p={2}>
                <Heading size="md">Section A: Question 2</Heading>
                <Text mt={4}>
                  Lady Macbeth is a female character who changes during the
                  play." Starting with this moment in the play explore how far
                  you agree with this view. Write about - how Shakespeare
                  presents Lady Macbeth in this extract - how far Shakespeare
                  presents Lady Macbeth as a female character who changes in the
                  play as a whole
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
          </Card>
        </GridItem>
        <GridItem colSpan={1}>
          {isLoading ? (
            <>
              {[...Array(4).keys()].map((key) => (
                <Box padding="5" boxShadow="lg" bg="white" mt={4}>
                  <SkeletonText
                    mt="3"
                    noOfLines={3}
                    spacing="4"
                    skeletonHeight="2"
                  />
                </Box>
              ))}
            </>
          ) : (
            <VStack align="stretch" spacing={5}>
              {completion &&
                completion.grading.length > 0 &&
                completion.grading.map(
                  ({ assesment_objective, comments, level_achieved }, index) => (
                    <GradingCard
                      assessment_objective={assesment_objective}
                      comments={comments}
                      level_achieved={level_achieved}
                      color_index={index}
                    ></GradingCard>
                  )
                )}
              {completion &&
                completion.score.length > 0 &&
                completion.score.map(({ assesment_objective, total_score }) => (
                  <BottomScores
                    student_score={total_score}
                    title={assesment_objective}
                  ></BottomScores>
                ))}

              <BottomButtons></BottomButtons>
            </VStack>
          )}
        </GridItem>
      </Grid>
    </>
  );
};

export default Home;
