// src/components/itinerary/ItineraryItem.js

import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Link,
  Tooltip,
} from "@chakra-ui/react";
import { StarIcon, LinkIcon, PhoneIcon, CalendarIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";
import tipsyTouristLogo3 from "../../assets/images/logo3.svg";
import { useUITheme } from "../../context/ThemeContext";
import details from "../../lib/details";

const convertDay = (day) => (day === 0 ? 6 : day - 1);

const OpenNow = ({ opening_hours }) => {
  const today = new Date();
  const dayIndex = convertDay(today.getDay());

  if (
    !opening_hours ||
    !Array.isArray(opening_hours.weekday_text) ||
    opening_hours.weekday_text.length <= dayIndex
  ) {
    return <Text fontStyle="italic" color="gray.500">No opening hours info</Text>;
  }

  const label = opening_hours.weekday_text[dayIndex];
  const openNow = opening_hours.open_now;
  const closingAt = label.includes("–") ? label.split("–")[1] : "";

  return (
    <Tooltip label={label} aria-label="Opening hours">
      <Text>
        {openNow ? `Open${closingAt ? ` – Closes at ${closingAt}` : ""}` : "Closed"}
      </Text>
    </Tooltip>
  );
};

const ItineraryItem = ({ place_id }) => {
  const theme = useUITheme();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      const response = await details(place_id);
      console.log("Fetched place details:", response);
      setData(response.result);
    }
    fetchDetails();
  }, [place_id]);

  if (!data || !data.name) {
    return (
      <Box p={3}>
        <Text fontStyle="italic" color="gray.500">Failed to load details for this location.</Text>
      </Box>
    );
  }

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || window.REACT_APP_GOOGLE_MAPS_API_KEY;
  const imageLink = data.photos?.[0]?.photo_reference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${data.photos[0].photo_reference}&key=${googleMapsApiKey}`
    : tipsyTouristLogo3;

  return (
    <Box p={3} borderWidth="1px" borderRadius="md" borderColor={theme.accent} mb={4}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>{data.name}</Text>
      <Image src={imageLink} alt={data.name} borderRadius="md" maxW="100%" maxH="150px" objectFit="cover" mb={2} />

      <VStack align="start" spacing={2}>
        <HStack spacing={2}><FaHome /><Text>{data.vicinity}</Text></HStack>
        {data.formatted_phone_number && (
          <HStack spacing={2}><PhoneIcon /><Text>{data.formatted_phone_number}</Text></HStack>
        )}
        {data.website && (
          <HStack spacing={2}><LinkIcon /><Link href={data.website} isExternal color={theme.accent}>{data.name} – website</Link></HStack>
        )}
        {data.rating && (
          <HStack spacing={1}>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} color={i < Math.round(data.rating) ? "yellow.400" : "gray.300"} />
            ))}
            <Text>({data.rating})</Text>
          </HStack>
        )}
        <HStack spacing={2}><CalendarIcon /><OpenNow opening_hours={data.opening_hours} /></HStack>
      </VStack>
    </Box>
  );
};

export default ItineraryItem;
