// components/PlanTripButtons.js
import { Button } from "@chakra-ui/react";

const PlanTripButtons = ({ onPlanTrip, onSeeItinerary, position }) => (
  <>
    {position === "left" ? (
      <Button
        backgroundColor="#38A169"
        color="white"
        onClick={onPlanTrip}
        size="sm"
        boxShadow="md"
        mr={2}
      >
        Plan my Tipsy Tour!
      </Button>
    ) : (
      <Button
        onClick={onSeeItinerary}
        size="sm"
        boxShadow="md"
        backgroundColor="#38A169"
        color="white"
        ml={2}
      >
        See Itinerary
      </Button>
    )}
  </>
);

export default PlanTripButtons;
