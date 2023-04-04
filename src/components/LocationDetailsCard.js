import Details from "../functions/Details";

import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Center,
  HStack,
  Link,
  Text,
  Image,
  Tooltip
} from '@chakra-ui/react'

import { StarIcon, LinkIcon, PhoneIcon, CalendarIcon } from "@chakra-ui/icons";

import { useState, React } from "react";

import {
  FaHome,
} from "react-icons/fa"; // icons


import tipsyTouristLogo3 from "../images/logo3.svg";

const LocationDetailsCard = ({place_id}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [locationCardData, setLocationCardData] = useState({});

  async function getDetails(place_id) {
    if (!locationCardData.place_id) {
      console.log("API CALLED!");
      const place = await Details(place_id);
      const locationData = place.result;
      setLocationCardData(locationData);
      console.log(locationData.opening_hours.open_now)
      console.log(locationData)

      return locationData;
    }
  }

  async function handleClick() {
    onOpen()
    getDetails(place_id)
  }

  let imageLink = "";
  if (locationCardData.photos === undefined) {
    imageLink = tipsyTouristLogo3;
  } else {
    imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${locationCardData.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    console.log(imageLink)
  }

  function openNow() {
    if(locationCardData.opening_hours.open_now) {
      console.log("location is currently open")
      return "Open"
    } else {
      return "Closed"
    }
  }
 
  return (
      <Box>
      <Button onClick={handleClick} bgColor="#38A169" color="white">More Info</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader as="b"> {locationCardData.name} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
        <Center>
          <Link href={locationCardData.website}>
            {locationCardData.name} - website
          </Link>
          </Center>
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
        <HStack>
          <CalendarIcon />
        <Tooltip label="Hey, I'm here!" aria-label='A tooltip'>
          Test
          { openNow()}

        </Tooltip>
        </HStack>

        <Center>
          <Image src={imageLink} alt="no image" maxW="300px" />
        </Center>
        </ModalBody>
        </ModalContent>
      </Modal>
      </Box>
  );
};

export default LocationDetailsCard;