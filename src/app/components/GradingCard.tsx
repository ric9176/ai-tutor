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
  color_index
}) {

    function color_switcher(color_index){
    switch (color_index) {
        case 0:
            return  "#FBC9CD";
        case 1:
            return  "#B3DAEE";
        case 2:
            return "#D8FCDD";
        case 3:
            return "#FBD8FC";

        default:
            return "#E2E8F0";
    }};

  return (
    <>
      <Card p={2}>
        <Heading size="sm" p={1} backgroundColor={color_switcher(color_index)} maxWidth='44px'>
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
