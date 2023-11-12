import {
    Box,
    Text,
    Heading,
    Card,
  } from "@chakra-ui/react";



// @ts-ignore
export default function BottomScores({title, student_score}){

    return ( 
        <>

            <Card p={2}>

                <Box display="flex" justifyContent="space-between" alignItems="baseline">
                    
                    <Heading size="sm">
                        {title}
                    </Heading>
                
                    <Text size="sm" >{student_score} / 30</Text>
                
                </Box>
            

            </Card>


        </>
        
)};