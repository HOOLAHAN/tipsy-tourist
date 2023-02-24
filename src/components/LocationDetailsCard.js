import {
  Box,
  Text,
  Image,
  Link,
  Center,
  PopoverBody,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  HStack,
} from "@chakra-ui/react";

import { StarIcon, LinkIcon, PhoneIcon } from "@chakra-ui/icons";

import {
  FaHome,
} from "react-icons/fa"; // icons


import tipsyTouristLogo3 from "../images/logo3.svg";

import { React } from "react";


const LocationDetailsCard = ({locationCardData}) => {

  let imageLink = "";
  if (locationCardData.photos === undefined) {
    imageLink = tipsyTouristLogo3;
  } else {
    imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${locationCardData.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    console.log(imageLink)
  }

  return (
    <PopoverContent>
    <PopoverArrow />
    <PopoverCloseButton />
      <PopoverHeader>
        <Text as="b">{locationCardData.name}</Text>
      </PopoverHeader>
      <PopoverBody>
        <Center>
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
        </Center>
        <HStack>
          <LinkIcon />
          <Link href={locationCardData.website}>
            {locationCardData.name} - website
          </Link>
        </HStack>
        <HStack>
          <PhoneIcon />
          <Text>
            {locationCardData.formatted_phone_number}
          </Text>
        </HStack>
        <HStack>
          <FaHome />
          <Text>
            {locationCardData.vicinity}
          </Text>
        </HStack>
        <Image src={imageLink} alt="no image" maxW="300px" />
      </PopoverBody>
    </PopoverContent>
  );
};

export default LocationDetailsCard;