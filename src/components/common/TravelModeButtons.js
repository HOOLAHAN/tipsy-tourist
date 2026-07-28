// components/common/TravelModeButtons.js

import { Button, ButtonGroup } from "@chakra-ui/react";
import { FaBicycle, FaWalking } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const TravelModeButtons = ({ onBikeClick, onWalkClick, travelMethod }) => {
  const theme = useUITheme();

  const getButtonStyle = (mode) => ({
    backgroundColor: travelMethod === mode ? theme.primary : "transparent",
    color: travelMethod === mode ? "white" : theme.text,
    borderColor: travelMethod === mode ? theme.primary : theme.accent,
    _hover: {
      backgroundColor: travelMethod === mode ? theme.accent : `${theme.accent}22`,
    },
  });

  const modes = [
    { mode: "BICYCLING", label: "Bike", icon: <FaBicycle />, onClick: onBikeClick },
    { mode: "WALKING", label: "Walk", icon: <FaWalking />, onClick: onWalkClick },
  ];

  return (
    <ButtonGroup w="100%" size="md" bg={theme.bg} border={`1px solid ${theme.accent}`} borderRadius="full" p={1} spacing={1}>
      {modes.map(({ mode, label, icon, onClick }) => (
        <Button
          key={mode}
          aria-label={label}
          leftIcon={icon}
          onClick={onClick}
          flex="1"
          borderWidth="1px"
          borderRadius="full"
          {...getButtonStyle(mode)}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default TravelModeButtons;
