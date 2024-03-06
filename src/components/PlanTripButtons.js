// components/PlanTripButtons.js
import { Button, Center } from "@chakra-ui/react";

const PlanTripButtons = ({ onPlanTrip, onSeeItinerary }) => (
  <Center mt={1} mb={1}>
    <Button
      backgroundColor="#38A169"
      color="white"
      onClick={onPlanTrip}
      mr={2}
      size="sm"
      boxShadow="md"
    >
      Plan my Tipsy Tour!
    </Button>
    <Button
      onClick={onSeeItinerary}
      size="sm"
      boxShadow="md"
      backgroundColor="#38A169"
      color="white"
    >
      See Itinerary
    </Button>
  </Center>
);

export default PlanTripButtons;
