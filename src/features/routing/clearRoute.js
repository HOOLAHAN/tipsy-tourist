// src/features/routing/clearRoute.js

const clearRoute = (
  setCombinedStops,
  setDirectionsResponse,
  setDistance,
  setTime,
  setJourneyWarning,
  startRef,
  finishRef,
  directionsRendererRef
) => {
  // Reset all state
  setCombinedStops([]);
  setDirectionsResponse(null);
  setDistance("");
  setTime("");
  if (typeof setJourneyWarning === "function") {
    setJourneyWarning("walking");
  }

  // Clear inputs safely
  if (startRef?.current) startRef.current.value = "";
  if (finishRef?.current) finishRef.current.value = "";

  // Remove the DirectionsRenderer instance if present
  if (directionsRendererRef?.current) {
    directionsRendererRef.current.setMap(null);
    directionsRendererRef.current = null;
  }
};

export { clearRoute };
