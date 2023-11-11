"use client";
import type { NextPage } from "next";
import {
  Box,
  Button,
  Textarea,
  VStack,
  Container,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

const Home: NextPage = () => {
  const [markdownText, setMarkdownText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Handle file upload
  const handleFileUpload = (event) => {
    // Logic to handle file upload
  };
  return (
    <Container maxW="container.lg" pb={10}>
      {/* Main Content */}
      <VStack flex={1} p={4} spacing={4} align="center">
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
      </VStack>

      {/* Sidebar */}
      <Box w="300px" bg="gray.200" p={4}>
        <Text>Placeholder Text for Sidebar</Text>
        {/* Add more sidebar content here */}
      </Box>
    </Container>
  );
};

export default Home;
