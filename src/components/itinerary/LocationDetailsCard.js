import { CalendarIcon, ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, LinkIcon, PhoneIcon, StarIcon } from "@chakra-ui/icons";
import { Box, Button, Center, Collapse, HStack, Image, Link, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaDirections, FaHome, FaMapMarkedAlt, FaPoundSign, FaWheelchair } from "react-icons/fa";
import tipsyTouristLogo3 from "../../assets/images/logo3.svg";
import { useUITheme } from "../../context/ThemeContext";
import { getCachedPlaceDetails } from "../../lib/placeDetailsCache";

function openingLabel(data) {
  if (!data?.opening_hours) return "No opening hours info";
  if (!data.opening_hours.open_now) return "Closed now";
  const day = new Date().getDay();
  const index = day === 0 ? 6 : day - 1;
  const hours = data.opening_hours.weekday_text?.[index];
  return hours?.includes("–") ? `Open – closes at ${hours.split("–")[1].trim()}` : "Open now";
}

export default function LocationDetailsCard({ place_id, place, stopNumber }) {
  const theme = useUITheme();
  const [details, setDetails] = useState(place || null);
  const [showHours, setShowHours] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    let active = true;
    setDetails(place || null);
    if (place_id) getCachedPlaceDetails(place_id).then((data) => active && setDetails({ ...place, ...data }));
    return () => { active = false; };
  }, [place_id, place]);

  if (!details) return <Center minH="260px"><Spinner color={theme.primary} size="lg" /></Center>;
  const attraction = details.stopType === "attraction" || place?.stopType === "attraction";
  const color = attraction ? "#7c3aed" : "#e11d48";
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || window.REACT_APP_GOOGLE_MAPS_API_KEY;
  const image = details.photos?.[0]?.photo_reference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${details.photos[0].photo_reference}&key=${apiKey}`
    : tipsyTouristLogo3;
  const rows = [
    [<FaHome />, details.formatted_address || details.vicinity],
    [<PhoneIcon />, details.formatted_phone_number],
    [<CalendarIcon />, openingLabel(details)],
  ];
  const mapsUrl = details.url || (details.place_id ? `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(details.place_id)}&query=${encodeURIComponent(details.name || "Place")}` : null);
  const directionsUrl = details.place_id ? `https://www.google.com/maps/dir/?api=1&destination_place_id=${encodeURIComponent(details.place_id)}&destination=${encodeURIComponent(details.name || "Place")}` : null;

  return (
    <Box bg={`${theme.accent}12`} border={`1px solid ${theme.accent}`} borderRadius="3xl" p={{ base: 4, md: 5 }}>
      <HStack mb={4} justify="space-between" align="center">
        <HStack minW={0}>
          {stopNumber && <Center flexShrink={0} w="44px" h="44px" borderRadius="full" bg={color} color="white" fontWeight="extrabold">{stopNumber}</Center>}
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="extrabold" noOfLines={2}>{details.name}</Text>
        </HStack>
        <Text flexShrink={0} bg={attraction ? "purple.100" : "red.100"} color={attraction ? "purple.700" : "red.700"} borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="extrabold">{attraction ? "ATTRACTION" : "PUB"}</Text>
      </HStack>
      <Image src={image} alt={details.name || "Location"} w="100%" h={{ base: "190px", md: "230px" }} objectFit="cover" borderRadius="2xl" mb={5} />
      <VStack align="stretch" spacing={3}>
        {rows.filter(([, value]) => value).map(([icon, value], index) => <HStack key={index} align="start" spacing={3}><Box color={theme.text} pt="3px">{icon}</Box><Text>{value}</Text></HStack>)}
        {details.website && <HStack spacing={3}><LinkIcon /><Link href={details.website} isExternal color={theme.primary}>{details.name} – website</Link></HStack>}
        {details.rating && <HStack><HStack spacing={1}>{Array.from({ length: 5 }, (_, i) => <StarIcon key={i} color={i < Math.round(details.rating) ? "yellow.400" : "gray.300"} />)}</HStack><Text fontWeight="semibold">{details.rating}{details.user_ratings_total ? ` (${details.user_ratings_total})` : ""}</Text></HStack>}
        {details.price_level !== undefined && <HStack spacing={3}><FaPoundSign /><Text>Price level <b>{"£".repeat(Math.max(1, details.price_level))}</b></Text></HStack>}
        {!!details.opening_hours?.weekday_text?.length && <Box><Button w="100%" size="sm" variant="ghost" borderRadius="full" color={theme.primary} rightIcon={showHours ? <ChevronUpIcon /> : <ChevronDownIcon />} onClick={() => setShowHours((value) => !value)}>{showHours ? "Hide weekly hours" : "View weekly hours"}</Button><Collapse in={showHours} animateOpacity><VStack align="stretch" spacing={1} mt={2} p={3} borderRadius="2xl" bg={theme.bg}>{details.opening_hours.weekday_text.map((line) => <Text key={line} fontSize="sm">{line}</Text>)}</VStack></Collapse></Box>}
        {details.editorial_summary?.overview && <Text fontSize="sm" lineHeight="tall" opacity={0.75}>{details.editorial_summary.overview}</Text>}
        {details.wheelchair_accessible_entrance !== undefined && <HStack spacing={3} align="start"><Box pt="3px"><FaWheelchair /></Box><Text>{details.wheelchair_accessible_entrance ? "Wheelchair-accessible entrance" : "Entrance not marked as wheelchair accessible"}</Text></HStack>}
        {(mapsUrl || directionsUrl) && <SimpleGrid columns={2} spacing={2}>{mapsUrl && <Button as={Link} href={mapsUrl} isExternal borderRadius="full" leftIcon={<FaMapMarkedAlt />} rightIcon={<ExternalLinkIcon />} color={theme.primary}>Open in Maps</Button>}{directionsUrl && <Button as={Link} href={directionsUrl} isExternal borderRadius="full" leftIcon={<FaDirections />} bg={theme.primary} color="white" _hover={{ bg: theme.accent, textDecoration: "none" }}>Directions</Button>}</SimpleGrid>}
        {!!details.reviews?.length && <Box><Button w="100%" size="sm" variant="ghost" borderRadius="full" color={theme.primary} rightIcon={showReviews ? <ChevronUpIcon /> : <ChevronDownIcon />} onClick={() => setShowReviews((value) => !value)}>{showReviews ? "Hide reviews" : `Recent reviews (${Math.min(2, details.reviews.length)})`}</Button><Collapse in={showReviews} animateOpacity><VStack align="stretch" spacing={2} mt={2}>{details.reviews.slice(0, 2).map((review, index) => <Box key={`${review.author_name}-${index}`} bg={theme.bg} borderRadius="2xl" p={3}><HStack justify="space-between" mb={1}><Text fontSize="sm" fontWeight="bold">{review.author_name || "Google user"}</Text><Text fontSize="xs" opacity={0.65}>{review.rating ? `★ ${review.rating}` : ""} {review.relative_time_description}</Text></HStack><Text fontSize="sm" opacity={0.75} noOfLines={4}>{review.text}</Text></Box>)}</VStack></Collapse></Box>}
      </VStack>
    </Box>
  );
}
