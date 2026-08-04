import { Box, HStack, IconButton, Text, Tooltip, VStack } from "@chakra-ui/react";
import { FaBeer, FaCameraRetro, FaChevronDown, FaChevronUp, FaRedo, FaTrash, FaWalking } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

export default function ItineraryItem({ place, stopNumber, isLast, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onOpen, onRemove, onRegenerate, updating, leg }) {
  const theme = useUITheme();
  if (!place) return null;
  const attraction = place.stopType === "attraction";
  const color = attraction ? "#7c3aed" : "#e11d48";
  return (
    <HStack align="stretch" spacing={2} minH="104px">
      <VStack w="42px" spacing={0} position="relative">
        <Box w="34px" h="34px" borderRadius="full" bg={color} color="white" display="grid" placeItems="center" fontWeight="extrabold" zIndex={1}>{stopNumber}</Box>
        {!isLast && <Box position="absolute" top="33px" bottom="-1px" w="2px" bg={theme.accent} opacity={0.45} />}
      </VStack>
      <HStack flex={1} align="center" bg={`${theme.accent}12`} border={`1px solid ${theme.accent}`} borderRadius="2xl" px={4} py={3} mb={3} minW={0} cursor="pointer" onClick={onOpen} _hover={{ borderColor: theme.primary }}>
        <Box flex={1} minW={0}>
          <HStack color={color} spacing={2} mb={1}>{attraction ? <FaCameraRetro /> : <FaBeer />}<Text fontSize="xs" fontWeight="extrabold" letterSpacing="0.12em">{attraction ? "ATTRACTION" : "PUB"}</Text></HStack>
          <Text fontSize="lg" fontWeight="extrabold" noOfLines={1}>{place.name}</Text>
          <Text fontSize="sm" opacity={0.65} noOfLines={1}>{place.vicinity || "Place details available from the map pin"}</Text>
          {leg && <HStack mt={1} spacing={1} color={theme.primary}><FaWalking /><Text fontSize="xs" fontWeight="bold">{stopNumber === 1 ? "From start" : "From previous stop"} · {leg.duration} · {leg.distance}</Text></HStack>}
        </Box>
        <VStack spacing={1}>
          <Tooltip label="Replace stop"><IconButton aria-label="Replace stop" icon={<FaRedo />} size="xs" isRound isLoading={updating} onClick={(event) => { event.stopPropagation(); onRegenerate?.(); }} color={theme.primary} /></Tooltip>
          <Tooltip label="Remove stop"><IconButton aria-label="Remove stop" icon={<FaTrash />} size="xs" isRound isDisabled={updating} onClick={(event) => { event.stopPropagation(); onRemove?.(); }} color="#e11d48" /></Tooltip>
          <Tooltip label="Move earlier"><IconButton aria-label="Move earlier" icon={<FaChevronUp />} size="xs" isRound isDisabled={!canMoveUp} onClick={(event) => { event.stopPropagation(); onMoveUp?.(); }} color={theme.primary} /></Tooltip>
          <Tooltip label="Move later"><IconButton aria-label="Move later" icon={<FaChevronDown />} size="xs" isRound isDisabled={!canMoveDown} onClick={(event) => { event.stopPropagation(); onMoveDown?.(); }} color={theme.primary} /></Tooltip>
        </VStack>
      </HStack>
    </HStack>
  );
}
