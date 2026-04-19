// components/common/TravelModeButtons.js

import { Button, ButtonGroup } from "@chakra-ui/react";
import { FaCar, FaBicycle, FaWalking } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const TravelModeButtons = ({ onCarClick, onBikeClick, onWalkClick, travelMethod }) => {
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
    { mode: "DRIVING", label: "Car", icon: <FaCar />, onClick: onCarClick },
    { mode: "BICYCLING", label: "Bike", icon: <FaBicycle />, onClick: onBikeClick },
    { mode: "WALKING", label: "Walk", icon: <FaWalking />, onClick: onWalkClick },
  ];

  return (
    <ButtonGroup isAttached w="100%" size="sm">
      {modes.map(({ mode, label, icon, onClick }) => (
        <Button
          key={mode}
          aria-label={label}
          leftIcon={icon}
          onClick={onClick}
          flex="1"
          borderWidth="1px"
          {...getButtonStyle(mode)}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default TravelModeButtons;
