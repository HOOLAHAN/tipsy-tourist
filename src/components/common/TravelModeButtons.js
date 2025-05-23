// components/common/TravelModeButtons.js
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { FaCar, FaBicycle, FaWalking } from "react-icons/fa";

const TravelModeButtons = ({ onCarClick, onBikeClick, onWalkClick, travelMethod }) => (
  <ButtonGroup>
    <IconButton
      aria-label="car"
      icon={<FaCar color={travelMethod === "DRIVING" ? "white" : "black"} />}
      isRound
      onClick={onCarClick}
      backgroundColor={travelMethod === "DRIVING" ? "#E53E3E" : "#EDF2F7"}
    />
    <IconButton
      aria-label="bike"
      icon={<FaBicycle color={travelMethod === "BICYCLING" ? "white" : "black"} />}
      isRound
      onClick={onBikeClick}
      backgroundColor={travelMethod === "BICYCLING" ? "#FFBF00" : "#EDF2F7"}
    />
    <IconButton
      aria-label="walk"
      icon={<FaWalking color={travelMethod === "WALKING" ? "white" : "black"} />}
      isRound
      onClick={onWalkClick}
      backgroundColor={travelMethod === "WALKING" ? "#38A169" : "#EDF2F7"}
    />
  </ButtonGroup>
);

export default TravelModeButtons;
