import details from "../functions/details";

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
  Tooltip,
} from "@chakra-ui/react";

import { StarIcon, LinkIcon, PhoneIcon, CalendarIcon } from "@chakra-ui/icons";

import { useState, React } from "react";

import { FaHome } from "react-icons/fa"; // icons

import tipsyTouristLogo3 from "../images/logo3.svg";

function convertDay(day) {
  if (day === 0) {
    return 6
  } else {
    return day -1
  }
}

const OpenNow = ({ data }) => {
  let today = new Date();
  let dayIndex = convertDay(today.getDay())
  if (data.opening_hours === undefined) return <Box></Box>;
  else if (data.opening_hours.open_now === true) {
    let dayArray = data.opening_hours.weekday_text[dayIndex].split("–")
    let closingAt = dayArray[1]
    return (
      <Tooltip
        label={data.opening_hours.weekday_text[dayIndex]}
        aria-label="A tooltip"
      >
        <Text>
          Open - Closes at {closingAt}
        </Text>
      </Tooltip>
    );
  }
  else {
    return (
      <Tooltip
        label={data.opening_hours.weekday_text[dayIndex]}
        aria-label="A tooltip"
      >
        Closed
      </Tooltip>
    ); 
  };
}

const LocationDetailsCard = ({ place_id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [locationCardData, setLocationCardData] = useState({});

  async function getDetails(place_id) {
    if (!locationCardData.place_id) {
      const place = await details(place_id);
      const locationData = place.result;
      setLocationCardData(locationData);
      return locationData;
    }
  }

  async function handleClick() {
    onOpen();
    getDetails(place_id);
  }

  let imageLink = "";
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || window.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (locationCardData.photos === undefined) {
    imageLink = tipsyTouristLogo3;
  } else {
    imageLink = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${locationCardData.photos[0].photo_reference}&key=${googleMapsApiKey}`;
  }
  return (
    <Box>
      <Button onClick={handleClick} bgColor="#38A169" color="white">
        More Info
      </Button>

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
              <Text>{locationCardData.formatted_phone_number}</Text>
            </HStack>
            <HStack>
              <FaHome />
              <Text>{locationCardData.vicinity}</Text>
            </HStack>
            <HStack>
              <CalendarIcon />
              <OpenNow data={locationCardData} />
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
