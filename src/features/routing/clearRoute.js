// src/features/routing/clearRoute.js

const clearRoute = (
  setCombinedStops,
  setDirectionsResponse,
  setDistance,
  setTime,
  setJourneyWarning,
  setRouteError,
  setIsPlanningRoute,
  setPickedStart,
  setPickedFinish,
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
  if (typeof setRouteError === "function") {
    setRouteError("");
  }
  if (typeof setIsPlanningRoute === "function") {
    setIsPlanningRoute(false);
  }
  if (typeof setPickedStart === "function") {
    setPickedStart(null);
  }
  if (typeof setPickedFinish === "function") {
    setPickedFinish(null);
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
