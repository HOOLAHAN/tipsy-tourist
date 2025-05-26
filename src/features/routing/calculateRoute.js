// src/features/routing/calculateRoute.js

import geocode from "../../lib/geocode";
import findPlotPoints from "../../utils/findPlotPoints";
import getAllPubs from "../../lib/getAllPubs";
import getAllAttractions from "../../lib/getAllAttractions";
import { calculateWaypoints } from "./calculateWaypoints";
import calculateDistance from "../../utils/calculateDistance";
import calculateTime from "../../utils/calculateTime";
import onlyUnique from "../../utils/onlyUnique";

export async function calculateRoute(startRef, finishRef, pubStops, attractionStops, travelMethod, directionsService, setDirectionsResponse, setDistance, setTime, setCombinedStops, setJourneyWarning) {
  if (startRef.current.value === "" || finishRef.current.value === "") {
    return;
  }
  setJourneyWarning("walking");
  const start = await geocode(startRef.current?.value);
  const end = await geocode(finishRef.current?.value);

  const pubPlotPoints = findPlotPoints(start, end, pubStops);
  const attractionPlotPoints = findPlotPoints(start, end, attractionStops);

  const pubData = await getAllPubs(pubPlotPoints);
  const attractionData = await getAllAttractions(attractionPlotPoints);
  const combinationArray = pubData.concat(attractionData);
  const combinationArray2 = combinationArray.filter(
    (location) => location !== undefined
  );

  const filteredCombinationArray = combinationArray2.filter(onlyUnique);

  setCombinedStops(filteredCombinationArray);
  
  const waypoints = calculateWaypoints(pubData, attractionData, setJourneyWarning);

  let results = null;
  try {
    results = await directionsService.route({
      origin: startRef.current.value,
      destination: finishRef.current.value,
      waypoints: waypoints,
      optimizeWaypoints: true,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode[travelMethod],
    });
  } catch (error) {
    console.log(error);
    setJourneyWarning("non-viable");
  }
  
  setDirectionsResponse(results);
  setDistance(calculateDistance(results));
  setTime(calculateTime(results));
}