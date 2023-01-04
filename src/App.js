// Chakra styling
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes, FaBeer } from 'react-icons/fa'

function App() {

  // styling
  return (
    <Flex
    // background styling
      position='relative'
      flexDirection='column'
      alignItems='center'
      bgColor='teal.200'
      bgImage="url('./public/images/cocktails.png')"
      bgPos='bottom'
      h='100vh'
      w='100vw'
    >
      
      <Box position='absolute' left={0} top={0} h='100%' w='100%'></Box> 

      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='modal'
      >
        <HStack spacing={4}>
          <Input type='text' placeholder='Start' />
          <Input type='text' placeholder='Finish' />
          <ButtonGroup>
            <Button leftIcon={<FaBeer />}colorScheme='green' type='submit'>
              Plan my pub crawl!
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={() => alert('Update this')}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Total distance (walking): </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => alert('Update this')}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
