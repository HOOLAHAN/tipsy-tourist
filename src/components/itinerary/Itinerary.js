import { Box } from "@chakra-ui/react";
import ItineraryItem from "./ItineraryItem";

const Itinerary = ({ combinedStops, onMoveStop }) => {
  if (combinedStops.length === 0) return null;

  return (
    <Box maxH="400px" overflowY="auto">
      {combinedStops.map((item, index) => (
        <ItineraryItem
          key={item.place_id}
          place_id={item.place_id}
          stopNumber={index + 1}
          stopType={item.stopType}
          canMoveUp={index > 0}
          canMoveDown={index < combinedStops.length - 1}
          onMoveUp={() => onMoveStop?.(index, -1)}
          onMoveDown={() => onMoveStop?.(index, 1)}
        />
      ))}
    </Box>
  );
};

export default Itinerary;
