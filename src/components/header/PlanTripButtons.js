// components/header/PlanTripButtons.js

import { Button } from "@chakra-ui/react";
import { useUITheme } from "../../context/ThemeContext";

const PlanTripButtons = ({ onPlanTrip, onSeeItinerary, position }) => {
  const theme = useUITheme();

  const baseStyle = {
    bg: theme.primary,
    color: "white",
    _hover: { bg: theme.accent },
    size: "sm",
    boxShadow: "md",
  };

  return position === "left" ? (
    <Button
      {...baseStyle}
      onClick={onPlanTrip}
      minW="150px"
      mr={2}
      border={`1px solid ${theme.accent}`}
    >
      Plan my Tipsy Tour!
    </Button>

  ) : (
    <Button
      {...baseStyle}
      onClick={onSeeItinerary}
      ml={2}
      minW="110px"
      border={`1px solid ${theme.accent}`}
    >
      See Itinerary
    </Button>
  );
};

export default PlanTripButtons;
