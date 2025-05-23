// components/Header.js
import { Box, Center, HStack, VStack, IconButton, Image, Heading, useBreakpointValue } from "@chakra-ui/react";
import { FaLocationArrow } from "react-icons/fa";
import tipsyTouristLogo3 from "../assets/images/logo3.svg";
import PlanTripButtons from './plan/PlanTripButtons';

const Header = ({ onCenter, onPlanTrip, onSeeItinerary }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box bg="white" py={2} width="100%" zIndex={1}>
      <Center>
        {isMobile ? (
          <VStack spacing={2} alignItems="center">
            <HStack spacing={2} alignItems="center">
              <Image boxSize="40px" objectFit="cover" src={tipsyTouristLogo3} alt="logo" zIndex={1} />
              <Heading color="#393f49" size="md">Tipsy Tourist</Heading>
              <IconButton
                bgColor="white"
                aria-label="center back"
                icon={<FaLocationArrow />}
                isRound
                onClick={onCenter}
              />
            </HStack>
            <HStack spacing={2}>
              <PlanTripButtons onPlanTrip={onPlanTrip} onSeeItinerary={onSeeItinerary} position="left" />
              <PlanTripButtons onPlanTrip={onPlanTrip} onSeeItinerary={onSeeItinerary} position="right" />
            </HStack>
          </VStack>
        ) : (
          <HStack spacing={2} alignItems="center">
            <PlanTripButtons onPlanTrip={onPlanTrip} onSeeItinerary={onSeeItinerary} position="left" />
            <Image boxSize="40px" objectFit="cover" src={tipsyTouristLogo3} alt="logo" zIndex={1} />
            <Heading color="#393f49">Tipsy Tourist</Heading>
            <IconButton
              bgColor="white"
              aria-label="center back"
              icon={<FaLocationArrow />}
              isRound
              onClick={onCenter}
            />
            <PlanTripButtons onPlanTrip={onPlanTrip} onSeeItinerary={onSeeItinerary} position="right" />
          </HStack>
        )}
      </Center>
    </Box>
  );
}

export default Header;
