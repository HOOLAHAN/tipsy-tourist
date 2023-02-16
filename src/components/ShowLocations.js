import {
  Box,
  HStack,

} from "@chakra-ui/react";

import { React } from "react";

import LocationsCard from "./LocationsCard"


const ShowLocations = ({combinedStops, showHideItinerary}) => {
  if (combinedStops.length > 0 && showHideItinerary) {
    return (
      <Box
        height="300px"
        position="absolute"
        top="65%"
        borderRadius="lg"
        minW="container.md"
      >
        <HStack justify="right">
        </HStack>
        <HStack spacing={4} mt={10} justifyContent="left" z-index="1">
          {combinedStops.map((result) => (
            <LocationsCard key={result.place_id} {...result} />
          ))}
        </HStack>
      </Box>
    );
  }
};

export default ShowLocations;