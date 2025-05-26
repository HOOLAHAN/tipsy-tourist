import { Box } from "@chakra-ui/react";
import ItineraryItem from "./ItineraryItem";

const Itinerary = ({ combinedStops }) => {
  if (combinedStops.length === 0) return null;

  return (
    <Box maxH="400px" overflowY="auto">
      {combinedStops.map((item) => (
        <ItineraryItem key={item.place_id} place_id={item.place_id} />
      ))}
    </Box>
  );
};

export default Itinerary;
