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

const distanceInMetres = (start, end) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const earthRadius = 6371000;
  const latitudeDelta = toRadians(end[0] - start[0]);
  const longitudeDelta = toRadians(end[1] - start[1]);
  const startLatitude = toRadians(start[0]);
  const endLatitude = toRadians(end[0]);
  const a = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const adaptiveSearchRadius = (start, end, searchCount) => {
  const routeDistance = distanceInMetres(start, end);
  const gaps = Math.max(searchCount - 1, 1);
  const radiusForOverlappingCoverage = (routeDistance / gaps) * 0.6;
  return Math.round(Math.min(3000, Math.max(400, radiusForOverlappingCoverage)));
};

export async function calculateRoute(startRef, finishRef, pubStops, attractionStops, travelMethod, directionsService, setDirectionsResponse, setDistance, setTime, setCombinedStops, setJourneyWarning, setRouteError, setSearchCoverage) {
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
  const searchRadius = adaptiveSearchRadius(start, end, stopTypes.length);
  setSearchCoverage?.({
    points: plotPoints.map((point, index) => ({
      ...point,
      stopType: stopTypes[index],
      radius: searchRadius,
    })),
    path: [
      { lat: start[0], lng: start[1] },
      { lat: end[0], lng: end[1] },
    ],
  });
  const searchPoints = plotPoints.map((point) => ({ ...point, radius: searchRadius }));
  const pubPlotPoints = searchPoints.filter((_, index) => stopTypes[index] === "pub");
  const attractionPlotPoints = searchPoints.filter((_, index) => stopTypes[index] === "attraction");

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
