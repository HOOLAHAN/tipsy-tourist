// src/components/itinerary/LocationDetailsCard.js

import details from "../../lib/details";
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
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import tipsyTouristLogo3 from "../../assets/images/logo3.svg";
import { useUITheme } from "../../context/ThemeContext";

function convertDay(day) {
  return day === 0 ? 6 : day - 1;
}

const OpenNow = ({ data }) => {
  const today = new Date();
  const dayIndex = convertDay(today.getDay());

  if (!data.opening_hours) return <Box />;

  const label = data.opening_hours.weekday_text[dayIndex];
  const openNow = data.opening_hours.open_now;

  if (openNow) {
    const closingAt = label.split("–")[1];
    return (
      <Tooltip label={label} aria-label="Open today">
        <Text>Open – Closes at {closingAt}</Text>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip label={label} aria-label="Closed today">
        <Text>Closed</Text>
      </Tooltip>
    );
  }
};

const LocationDetailsCard = ({ place_id }) => {
  const theme = useUITheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [locationCardData, setLocationCardData] = useState({});

  async function getDetails(place_id) {
    if (!locationCardData.place_id) {
      const place = await details(place_id);
      const locationData = place.result;
      setLocationCardData(locationData);
    }
  }

  async function handleClick() {
    onOpen();
    getDetails(place_id);
  }

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || window.REACT_APP_GOOGLE_MAPS_API_KEY;
  const imageLink = locationCardData.photos
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${locationCardData.photos[0].photo_reference}&key=${googleMapsApiKey}`
    : tipsyTouristLogo3;

  return (
    <Box mt={2}>
      <Button
        onClick={handleClick}
        bg={theme.primary}
        color="white"
        _hover={{ bg: theme.accent }}
        boxShadow="md"
      >
        More Info
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={theme.bg} color={theme.text}>
          <ModalHeader fontWeight="bold">{locationCardData.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center mb={2}>
              <Box display="flex" mt="2" alignItems="center">
                {Array(5)
                  .fill("")
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      color={
                        i < Math.round(locationCardData.rating)
                          ? "yellow.400"
                          : "gray.300"
                      }
                    />
                  ))}
              </Box>
            </Center>

            <HStack spacing={2} mb={1}>
              <LinkIcon />
              <Link href={locationCardData.website} isExternal color={theme.accent}>
                {locationCardData.name} – website
              </Link>
            </HStack>

            <HStack spacing={2} mb={1}>
              <PhoneIcon />
              <Text>{locationCardData.formatted_phone_number}</Text>
            </HStack>

            <HStack spacing={2} mb={1}>
              <FaHome />
              <Text>{locationCardData.vicinity}</Text>
            </HStack>

            <HStack spacing={2} mb={4}>
              <CalendarIcon />
              <OpenNow data={locationCardData} />
            </HStack>

            <Center>
              <Image src={imageLink} alt="Location" maxW="300px" borderRadius="md" />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LocationDetailsCard;
