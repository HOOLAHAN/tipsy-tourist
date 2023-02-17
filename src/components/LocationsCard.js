import {
  Box,
  HStack,
  VStack,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import tipsyTouristLogo3 from "../images/logo3.svg";
import { useState, React } from "react";
import LocationDetailsCard from "./LocationDetailsCard";
import Details from "../functions/Details"


const LocationsCard = (result) => {
  const [showHideLocationCard, setShowHideLocationCard] = useState(false);
  const [locationCardData, setLocationCardData] = useState({})
  
  async function getDetails(place_id) {
    const place = await Details(place_id);
    const locationData = place.result;
    setLocationCardData(locationData);
    return locationData;
  }

  let imageLink = "";
  if (result.photos === undefined) {
    imageLink = tipsyTouristLogo3;
  } else {
    imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${result.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
  }

  return (

    <Box
    justifyContent="left"
    shadow="base"
    borderRadius="lg"
    bgColor="white"
    height="250px"
    >
      <VStack>
      <Box>
        <LocationDetailsCard locationCardData={locationCardData} showHideLocationCard={showHideLocationCard}/>
      </Box>
      </VStack>
      <VStack>
        <HStack justifyContent="space-between">
          <Text
            noOfLines={[1, 2]}
            color="#393f49"
            as="b"
            fontSize="m"
            justifyContent="center"
            >
            {result.name}
          </Text>
          <IconButton
            leftIcon={<BsFillArrowUpRightCircleFill />}
            isRound
            color="green"
            bgColor="white"
            type="submit"
            onClick={() => {
                getDetails(result.place_id);
                setShowHideLocationCard(!showHideLocationCard);
            }}
          ></IconButton>
        </HStack>
        <Image
          src={imageLink}
          borderRadius="lg"
          alt="no image"
          boxSize="200px"
          maxW="200px"
        />
      </VStack>
    </Box>
  );
};

export default LocationsCard;