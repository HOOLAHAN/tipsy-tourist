// functions/clearRoute.js

const clearRoute = (setCombinedStops, setDirectionsResponse, setDistance, setJourneyWarning, startRef, finishRef) => {
  setCombinedStops([]);
  setDirectionsResponse(null);
  setDistance("");
  setJourneyWarning("walking");

  if (startRef.current) {
    startRef.current.value = "";
  }

  if (finishRef.current) {
    finishRef.current.value = "";
  }
};

export { clearRoute };
