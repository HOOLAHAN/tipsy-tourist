import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Popover,
  PopoverTrigger,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import tipsyTouristLogo3 from "../images/logo3.svg";
import { useState, React } from "react";
import LocationDetailsCard from "./LocationDetailsCard";
import Details from "../functions/Details";

const NewAccordionItem = (data) => {
  const [locationCardData, setLocationCardData] = useState({});

  async function getDetails(place_id) {
    if (!locationCardData.place_id) {
      console.log("API CALLED!");
      const place = await Details(place_id);
      const locationData = place.result;
      setLocationCardData(locationData);
      return locationData;
    }
  }

  let imageLink = "";
  if (data.photos === undefined) {
    imageLink = tipsyTouristLogo3;
  } else {
    imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${data.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
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
        {data.vicinity}
        <Box>
          <Image w="200px" src={imageLink}></Image>
        </Box>
        <Popover>
          <PopoverTrigger>
            <IconButton
              leftIcon={<BsFillArrowUpRightCircleFill />}
              isRound
              color="green"
              bgColor="white"
              type="submit"
              onClick={() => {
                getDetails(data.place_id);
              }}
            ></IconButton>
          </PopoverTrigger>
          <LocationDetailsCard locationCardData={locationCardData} />
        </Popover>
      </AccordionPanel>
    </AccordionItem>
  );
};

const Itinerary = ({ combinedStops }) => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple bgColor="white">
      {combinedStops.map((result) => (
        <NewAccordionItem key={result.place_id} {...result} />
      ))}
      {/* <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left'>
            Section 1 title
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>

    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left'>
            Section 2 title
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem> */}
    </Accordion>
  );
};

export default Itinerary;
