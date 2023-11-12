import {
    Box,
    Text,
    Heading,
    Card,
  } from "@chakra-ui/react";


//@ts-ignore
export default function GradingCard({
  assessment_objective,
  comments,
  level_achieved,
}) {
  return (
    <>
      <Card p={2}>
        <Heading size="sm" p={1}>
          {assessment_objective}
        </Heading>

        <Box
          display="flex"
          justifyContent="space-between"
          borderTop="2px"
          borderColor="#E2E8F0"
        >
          <Text mt={2}>{comments}</Text>

          <Text borderLeft="2px" borderColor="#E2E8F0" p={2}>
            Level{" "}
            <Text fontWeight="bold" textAlign="center" borderColor="grey">
              {level_achieved}
            </Text>
          </Text>
        </Box>
      </Card>
    </>
  );
}
