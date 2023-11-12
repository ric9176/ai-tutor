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
export default function AnswerLevel( {level_achieved} ){
    
    return ( 
        <>
        <Text p={2}>
            Level 
            <Heading size="sm">{level_achieved}</Heading>
        </Card>
        </>
)};



