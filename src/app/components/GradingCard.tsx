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
    Card,
  } from "@chakra-ui/react";


//@ts-ignore
export default function GradingCard( {assessment_objective, comments} ){
    
    return ( 
        <>
        <Card p={2}>
            <Heading size="sm">{assessment_objective}</Heading>
            <Text mt={2}>
                {comments}
            </Text>
        </Card>
        </>
)};



