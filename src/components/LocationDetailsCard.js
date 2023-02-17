import {
  Box,
  HStack,
  VStack,
  // IconButton,
  Text,
  Image,
  Link,
} from "@chakra-ui/react";

import { StarIcon, LinkIcon, PhoneIcon } from "@chakra-ui/icons";

import {
  // FaTimes,
  FaHome,
} from "react-icons/fa"; // icons


import tipsyTouristLogo3 from "../images/logo3.svg";

import { useState, React } from "react";


const LocationDetailsCard = ({locationCardData, showHideLocationCard}) => {

  // const [locationCardData, setLocationCardData] = useState({});
  // const [boxZIndex, setBoxZIndex] = useState("-1");

  let imageLink = "";
  if (locationCardData.photos === undefined) {
    imageLink = tipsyTouristLogo3;
  } else {
    imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${locationCardData.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    console.log(imageLink)
  }

  if ( showHideLocationCard ) {

  return (
    <Box
      p={4}
      borderRadius="lg"
      mt={4}
      bgColor="white"
      shadow="base"
      minW="container.sm"
      // zIndex={boxZIndex}
    >
      <HStack justifyContent="right">
        {/* <IconButton
          aria-label="center back"
          icon={<FaTimes />}
          colorScheme="red"
          isRound
          onClick={() => {
            setBoxZIndex("-1");
          }}
        /> */}
      </HStack>
      <VStack>
        <Text as="b">{locationCardData.name}</Text>
        <Box display="flex" mt="2" alignItems="center">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                key={i}
                color={
                  i < Math.round(locationCardData.rating)
                    ? "yellow.500"
                    : "gray.300"
                }
              />
            ))}
        </Box>
        <Link href={locationCardData.website}>
          <LinkIcon />
          {locationCardData.website}
        </Link>
        <Text>
          <PhoneIcon />
          {locationCardData.formatted_phone_number}
        </Text>
        <Text icon={<FaHome />}>{locationCardData.vicinity}</Text>
        <Image src={imageLink} alt="no image" maxW="300px" />
      </VStack>
    </Box>
  );
  }
};

export default LocationDetailsCard;