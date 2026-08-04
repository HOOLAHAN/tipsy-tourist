import { Box, HStack, Text } from "@chakra-ui/react";
import { FaWalking } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";
import ItineraryItem from "./ItineraryItem";

const Itinerary = ({ combinedStops, routeLegs = [], onMoveStop, onSelectStop, onRemoveStop, onRegenerateStop, updatingStopId }) => {
  const theme = useUITheme();
  if (!combinedStops?.length) return null;

  return (
    <Box>
      {combinedStops.filter(Boolean).map((item, index, stops) => (
        <ItineraryItem
          key={item.place_id}
          place={item}
          stopNumber={index + 1}
          stopType={item.stopType}
          isLast={index === stops.length - 1}
          canMoveUp={index > 0}
          canMoveDown={index < stops.length - 1}
          onMoveUp={() => onMoveStop?.(index, -1)}
          onMoveDown={() => onMoveStop?.(index, 1)}
          onOpen={() => onSelectStop?.(item)}
          updating={updatingStopId === item.place_id}
          onRemove={() => onRemoveStop?.(item)}
          onRegenerate={() => onRegenerateStop?.(item)}
          leg={routeLegs[index]}
        />
      ))}
      {routeLegs.length > combinedStops.length && (
        <HStack ml="42px" border={`1px solid ${theme.accent}`} bg={`${theme.accent}12`} borderRadius="xl" px={4} py={3} mb={3}>
          <FaWalking color={theme.primary} />
          <Text fontSize="sm" fontWeight="bold">Final stop to finish · {routeLegs[combinedStops.length].duration} · {routeLegs[combinedStops.length].distance}</Text>
        </HStack>
      )}
    </Box>
  );
};

export default Itinerary;
