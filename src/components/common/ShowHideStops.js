// src/components/common/ShowHideStops.js

import { Text } from "@chakra-ui/react";
import { useUITheme } from "../../context/ThemeContext";

const ShowHideStops = ({ showHideItinerary }) => {
  const theme = useUITheme();

  return (
    <Text color={theme.text}>
      {showHideItinerary ? "Hide Itinerary" : "Show Itinerary"}
    </Text>
  );
};

export default ShowHideStops;
