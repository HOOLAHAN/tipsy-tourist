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

import tipsyTouristLogo3 from "../images/logo3.svg";
import LocationDetailsCard from "./LocationDetailsCard";

const NewAccordionItem = (data) => {
  let imageLink = "";
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || window.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (data.photos === undefined) {
    imageLink = tipsyTouristLogo3;
  } else {
    imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${data.photos[0].photo_reference}&key=${googleMapsApiKey}`;
  }

  return (
    <AccordionItem w="100%">
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            <Text as="b">{data.name}</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Box>
          <Image w="200px" src={imageLink}></Image>
        </Box>
          <LocationDetailsCard place_id={data.place_id} />
      </AccordionPanel>
    </AccordionItem>
  );
};

const Itinerary = ({ combinedStops, showHideItinerary }) => {
  if (combinedStops.length > 0 && showHideItinerary) {
    return (
      <Accordion allowToggle defaultIndex={[0]} bgColor="white">
        {combinedStops.map((result) => (
          <NewAccordionItem key={result.place_id} {...result} />
        ))}
      </Accordion>
    );
  }
};

export default Itinerary;
