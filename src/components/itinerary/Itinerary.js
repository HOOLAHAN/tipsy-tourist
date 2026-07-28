import { Box } from "@chakra-ui/react";
import ItineraryItem from "./ItineraryItem";

const Itinerary = ({ combinedStops, onMoveStop, onSelectStop, onRemoveStop, onRegenerateStop, updatingStopId }) => {
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
        />
      ))}
    </Box>
  );
};

export default Itinerary;
