import {
    Box,
    Text,
    Heading,
    Card,
    Button,
  } from "@chakra-ui/react";

import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';

//@ts-ignore
export default function BottomButtons() {


    return (
        <>

        <Card borderWidth="1px" p={4}>
        
            <Button colorScheme="blue" mt={4}>
                Save Score
            </Button>

            <Box display="flex" justifyContent="space-between" alignItems="baseline" p={4}>
                    
                <Button backgroundColor="#E8ECF7" leftIcon={<ChevronLeftIcon />}>
                    Previous Answer
                </Button>

                <Button backgroundColor="#E8ECF7" rightIcon={<ChevronRightIcon />}>
                    Next Answer
                </Button>
                
            </Box>
      
        </Card>

        </>



)};