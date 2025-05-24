// components/common/TravelModeButtons.js

import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { FaCar, FaBicycle, FaWalking } from "react-icons/fa";
import { useUITheme } from "../../context/ThemeContext";

const TravelModeButtons = ({ onCarClick, onBikeClick, onWalkClick, travelMethod }) => {
  const theme = useUITheme();

  const getButtonStyle = (mode) => ({
    backgroundColor: travelMethod === mode ? theme.primary : "gray.100",
    _hover: {
      backgroundColor: travelMethod === mode ? theme.accent : "gray.200",
    },
    iconColor: travelMethod === mode ? "white" : "black",
  });

  return (
    <ButtonGroup>
      <IconButton
        aria-label="car"
        icon={<FaCar color={getButtonStyle("DRIVING").iconColor} />}
        isRound
        onClick={onCarClick}
        bg={getButtonStyle("DRIVING").backgroundColor}
        _hover={getButtonStyle("DRIVING")._hover}
      />
      <IconButton
        aria-label="bike"
        icon={<FaBicycle color={getButtonStyle("BICYCLING").iconColor} />}
        isRound
        onClick={onBikeClick}
        bg={getButtonStyle("BICYCLING").backgroundColor}
        _hover={getButtonStyle("BICYCLING")._hover}
      />
      <IconButton
        aria-label="walk"
        icon={<FaWalking color={getButtonStyle("WALKING").iconColor} />}
        isRound
        onClick={onWalkClick}
        bg={getButtonStyle("WALKING").backgroundColor}
        _hover={getButtonStyle("WALKING")._hover}
      />
    </ButtonGroup>
  );
};

export default TravelModeButtons;
