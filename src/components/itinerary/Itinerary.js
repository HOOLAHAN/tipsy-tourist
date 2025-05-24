// src/components/itinerary/Itinerary.js

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Image,
} from "@chakra-ui/react";
import { useUITheme } from "../../context/ThemeContext";
import tipsyTouristLogo3 from "../../assets/images/logo3.svg";
import LocationDetailsCard from "./LocationDetailsCard";

const NewAccordionItem = (data, theme) => {
  let imageLink = "";
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || window.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (data.photos === undefined) {
    imageLink = tipsyTouristLogo3;
  } else {
    imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${data.photos[0].photo_reference}&key=${googleMapsApiKey}`;
  }

  return (
    <AccordionItem w="100%" borderColor={theme.accent}>
      <h2>
        <AccordionButton _expanded={{ bg: theme.accent, color: "white" }}>
          <Box as="span" flex="1" textAlign="left">
            <Text as="b" color={theme.text}>{data.name}</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4} bg={theme.bg}>
        <Box mb={2}>
          <Image w="200px" src={imageLink} borderRadius="md" />
        </Box>
        <LocationDetailsCard place_id={data.place_id} />
      </AccordionPanel>
    </AccordionItem>
  );
};

const Itinerary = ({ combinedStops }) => {
  const theme = useUITheme();

  if (combinedStops.length > 0) {
    return (
      <Accordion allowToggle defaultIndex={[0]} bg={theme.bg} borderRadius="md" p={2}>
        {combinedStops.map((result) => (
          <NewAccordionItem key={result.place_id} {...result} theme={theme} />
        ))}
      </Accordion>
    );
  }

  return null;
};

export default Itinerary;
