// src/features/routing/calculateRoute.js

import geocode from "../../lib/geocode";
import findPlotPoints from "../../utils/findPlotPoints";
import getAllPubs from "../../lib/getAllPubs";
import getAllAttractions from "../../lib/getAllAttractions";
import { calculateWaypoints } from "./calculateWaypoints";
import calculateDistance from "../../utils/calculateDistance";
import calculateTime from "../../utils/calculateTime";
import onlyUnique from "../../utils/onlyUnique";

const withStopType = (stop, stopType) => {
  if (!stop) return undefined;
  return { ...stop, stopType };
};

const orderStopsByDirections = (stops, directionsResult) => {
  const waypointOrder = directionsResult?.routes?.[0]?.waypoint_order;
  if (!Array.isArray(waypointOrder) || waypointOrder.length === 0) {
    return stops;
  }
  return waypointOrder.map((index) => stops[index]).filter(Boolean);
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

  const pubPlotPoints = findPlotPoints(start, end, Number(pubStops));
  const attractionPlotPoints = findPlotPoints(start, end, Number(attractionStops));

  let pubData;
  let attractionData;
  try {
    pubData = await getAllPubs(pubPlotPoints);
    attractionData = await getAllAttractions(attractionPlotPoints);
  } catch (error) {
    setRouteError?.("places-failed");
    return false;
  }

  const combinationArray = pubData
    .map((stop) => withStopType(stop, "pub"))
    .concat(attractionData.map((stop) => withStopType(stop, "attraction")));
  const combinationArray2 = combinationArray.filter(
    (location) => location !== undefined
  );

  const filteredCombinationArray = combinationArray2.filter(onlyUnique);
  
  const waypoints = calculateWaypoints(pubData, attractionData, setJourneyWarning);

  let results = null;
  try {
    results = await directionsService.route({
      origin: startInput,
      destination: finishInput,
      waypoints: waypoints,
      optimizeWaypoints: true,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode[travelMethod],
    });
  } catch (error) {
    setJourneyWarning("non-viable");
    setRouteError?.("non-viable");
    return false;
  }
  
  setDirectionsResponse(results);
  setCombinedStops(orderStopsByDirections(filteredCombinationArray, results));
  setDistance(calculateDistance(results));
  setTime(calculateTime(results));
  return true;
}
