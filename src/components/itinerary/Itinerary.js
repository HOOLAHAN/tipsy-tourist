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
  VStack,
  HStack,
  Link,
  Tooltip,
  Center,
} from "@chakra-ui/react";
import { useUITheme } from "../../context/ThemeContext";
import { StarIcon, LinkIcon, PhoneIcon, CalendarIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";
import tipsyTouristLogo3 from "../../assets/images/logo3.svg";

function convertDay(day) {
  return day === 0 ? 6 : day - 1;
}

const OpenNow = ({ data }) => {
  const today = new Date();
  const dayIndex = convertDay(today.getDay());

  if (
    !data.opening_hours ||
    !data.opening_hours.weekday_text ||
    !Array.isArray(data.opening_hours.weekday_text) ||
    data.opening_hours.weekday_text.length <= dayIndex
  ) {
    return <Text>No opening hours info</Text>;
  }

  const label = data.opening_hours.weekday_text[dayIndex];
  const openNow = data.opening_hours.open_now;

  if (openNow) {
    const closingAt = label.split("–")[1] || "";
    return (
      <Tooltip label={label} aria-label="Open today">
        <Text>Open{closingAt ? ` – Closes at ${closingAt}` : ""}</Text>
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
        <VStack align="start" spacing={2}>
          <Center>
            <Image w="200px" borderRadius="md" src={imageLink} alt={data.name} />
          </Center>
          <HStack spacing={2}><FaHome /><Text>{data.vicinity}</Text></HStack>
          {data.formatted_phone_number && (
            <HStack spacing={2}><PhoneIcon /><Text>{data.formatted_phone_number}</Text></HStack>
          )}
          {data.website && (
            <HStack spacing={2}><LinkIcon /><Link href={data.website} isExternal color={theme.accent}>{data.name} – website</Link></HStack>
          )}
          {data.rating && (
            <HStack spacing={1} align="center">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} color={i < Math.round(data.rating) ? "yellow.400" : "gray.300"} />
              ))}
              <Text>({data.rating})</Text>
            </HStack>
          )}
          <HStack spacing={2}><CalendarIcon /><OpenNow data={data} /></HStack>
        </VStack>
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
