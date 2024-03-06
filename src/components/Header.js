// components/Header.js
import { Box, Center, HStack, IconButton, Image, Heading } from "@chakra-ui/react";
import { FaLocationArrow } from "react-icons/fa";
import tipsyTouristLogo3 from "../images/logo3.svg";

const Header = ({ onCenter }) => (
  <Box bg="white" py={1} width="100%" zIndex={1}>
    <Center>
      <HStack spacing={2} alignItems="center">
        <Image boxSize="40px" objectFit="cover" src={tipsyTouristLogo3} alt="logo" zIndex={1} />
        <Heading color="#393f49">Tipsy Tourist</Heading>
        <IconButton
          bgColor="white"
          aria-label="center back"
          icon={<FaLocationArrow />}
          isRound
          onClick={onCenter}
        />
      </HStack>
    </Center>
  </Box>
);

export default Header;
