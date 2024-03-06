export function handlePubs(setPubStops, value) {
  setPubStops(value);
}

export function handleAttractions(setAttractionStops, value) {
  setAttractionStops(value);
}

export const handleCar = (setTravelMethod, setJourneyWarning) => {
  setTravelMethod("DRIVING");
  setJourneyWarning("driving");
  console.log("Selected car");
};

export const handleBicycling = (setTravelMethod, setJourneyWarning) => {
  setTravelMethod("BICYCLING");
  setJourneyWarning("bicycling");
};

export const handleWalking = (setTravelMethod, setJourneyWarning) => {
  setTravelMethod("WALKING");
  setJourneyWarning("walking");
};
