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
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { StarIcon, LinkIcon, PhoneIcon, CalendarIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";
import tipsyTouristLogo3 from "../../assets/images/logo3.svg";
import { useUITheme } from "../../context/ThemeContext";
import { getCachedPlaceDetails } from "../../lib/placeDetailsCache";

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

const ItineraryItem = ({ place_id, stopNumber, stopType }) => {
  const theme = useUITheme();
  const [data, setData] = useState(null);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchDetails() {
      setHasFailed(false);
      try {
        const response = await getCachedPlaceDetails(place_id);
        if (isMounted) setData(response);
      } catch (error) {
        if (isMounted) setHasFailed(true);
      }
    }

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [place_id]);

  if (hasFailed) {
    return (
      <Box p={3}>
        <Text fontStyle="italic" color="gray.500">Failed to load details for this location.</Text>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3} borderWidth="1px" borderRadius="md" borderColor={theme.accent} mb={4}>
        <HStack>
          <Spinner size="sm" />
          <Text fontStyle="italic" color="gray.500">Loading stop details...</Text>
        </HStack>
      </Box>
    );
  }

  if (!data.name) {
    return (
      <Box p={3}>
        <Text fontStyle="italic" color="gray.500">No details available for this location.</Text>
      </Box>
    );
  }

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || window.REACT_APP_GOOGLE_MAPS_API_KEY;
  const imageLink = data.photos?.[0]?.photo_reference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${data.photos[0].photo_reference}&key=${googleMapsApiKey}`
    : tipsyTouristLogo3;

  return (
    <Box p={3} borderWidth="1px" borderRadius="md" borderColor={theme.accent} mb={4}>
      <HStack justify="space-between" align="start" mb={2}>
        <HStack align="center">
          {stopNumber && (
            <Badge
              bg={theme.primary}
              color="white"
              borderRadius="full"
              minW="24px"
              textAlign="center"
              py={1}
            >
              {stopNumber}
            </Badge>
          )}
          <Text fontSize="lg" fontWeight="bold">{data.name}</Text>
        </HStack>
        {stopType && (
          <Badge colorScheme={stopType === "attraction" ? "purple" : "red"}>
            {stopType}
          </Badge>
        )}
      </HStack>
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
