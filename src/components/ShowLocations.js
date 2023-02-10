import {
  Box,
  HStack,
  IconButton,
} from "@chakra-ui/react";

import {
  FaTimes,
} from "react-icons/fa"; // icons

import { useState, React } from "react";

import LocationsCard from "./LocationsCard"


const ShowLocations = ({combinedStops}) => {
  // const [stops, setStops] = useState([]);
  // setStops(combinedStops)
  // console.log("set stops")
  if (combinedStops.length > 0) {
    return (
      <Box
        height="300px"
        position="absolute"
        top="65%"
        borderRadius="lg"
        minW="container.md"
      >
        <HStack justify="right">
          <IconButton
            aria-label="center back"
            icon={<FaTimes />}
            colorScheme="red"
            isRound
            // onClick={() => {
            //   setStops([])
            //   // setShowComponent(false);
            // }}
          />
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