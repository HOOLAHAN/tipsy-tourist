// src/features/routing/calculateRoute.js

import geocode from "../../lib/geocode";
import findPlotPoints from "../../utils/findPlotPoints";
import getAllPubs from "../../lib/getAllPubs";
import getAllAttractions from "../../lib/getAllAttractions";
import calculateDistance from "../../utils/calculateDistance";
import calculateTime from "../../utils/calculateTime";
import onlyUnique from "../../utils/onlyUnique";

const withStopType = (stop, stopType) => {
  if (!stop) return undefined;
  return { ...stop, stopType };
};

const mixedStopTypes = (pubCount, attractionCount) => {
  const total = pubCount + attractionCount;
  let pubsUsed = 0;
  let attractionsUsed = 0;
  return Array.from({ length: total }, (_, index) => {
    if (pubsUsed >= pubCount) { attractionsUsed += 1; return "attraction"; }
    if (attractionsUsed >= attractionCount) { pubsUsed += 1; return "pub"; }
    const pubDeficit = ((index + 1) * pubCount) / total - pubsUsed;
    const attractionDeficit = ((index + 1) * attractionCount) / total - attractionsUsed;
    if (pubDeficit >= attractionDeficit) { pubsUsed += 1; return "pub"; }
    attractionsUsed += 1;
    return "attraction";
  });
};

export async function calculateRoute(startRef, finishRef, pubStops, attractionStops, travelMethod, directionsService, setDirectionsResponse, setDistance, setTime, setCombinedStops, setJourneyWarning, setRouteError) {
  const startInput = startRef.current?.value?.trim();
  const finishInput = finishRef.current?.value?.trim();

  if (!startInput || !finishInput) {
    setRouteError?.("missing-inputs");
    return false;
  }

  setRouteError?.("");
  setJourneyWarning("walking");

  let start;
  let end;
  try {
    start = await geocode(startInput);
    end = await geocode(finishInput);
  } catch (error) {
    setRouteError?.("geocode-failed");
    return false;
  }

  if (!Number.isFinite(start?.[0]) || !Number.isFinite(start?.[1]) || !Number.isFinite(end?.[0]) || !Number.isFinite(end?.[1])) {
    setRouteError?.("geocode-failed");
    return false;
  }

  const stopTypes = mixedStopTypes(Number(pubStops), Number(attractionStops));
  const plotPoints = findPlotPoints(start, end, stopTypes.length);
  const pubPlotPoints = plotPoints.filter((_, index) => stopTypes[index] === "pub");
  const attractionPlotPoints = plotPoints.filter((_, index) => stopTypes[index] === "attraction");

  let pubData;
  let attractionData;
  try {
    pubData = await getAllPubs(pubPlotPoints);
    attractionData = await getAllAttractions(attractionPlotPoints);
  } catch (error) {
    setRouteError?.("places-failed");
    return false;
  }

  let pubIndex = 0;
  let attractionIndex = 0;
  const mixedStops = stopTypes.map((type) => type === "pub" ? withStopType(pubData[pubIndex++], "pub") : withStopType(attractionData[attractionIndex++], "attraction"));
  const filteredCombinationArray = mixedStops.filter(Boolean).filter(onlyUnique);
  if (filteredCombinationArray.length < stopTypes.length) setJourneyWarning("shortened");
  const waypoints = filteredCombinationArray.map((stop) => ({ location: stop.geometry.location, stopover: true }));

  let results = null;
  try {
    results = await directionsService.route({
      origin: startInput,
      destination: finishInput,
      waypoints: waypoints,
      optimizeWaypoints: false,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode[travelMethod],
    });
  } catch (error) {
    setJourneyWarning("non-viable");
    setRouteError?.("non-viable");
    return false;
  }
  
  setDirectionsResponse(results);
  setCombinedStops(filteredCombinationArray);
  setDistance(calculateDistance(results));
  setTime(calculateTime(results));
  return true;
}
