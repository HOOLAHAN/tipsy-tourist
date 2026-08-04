// src/features/routing/calculateRoute.js

import geocode from "../../lib/geocode";
import findPlotPoints from "../../utils/findPlotPoints";
import getAllPubs from "../../lib/getAllPubs";
import getAllAttractions from "../../lib/getAllAttractions";
import calculateDistance from "../../utils/calculateDistance";
import calculateTime from "../../utils/calculateTime";
import onlyUnique from "../../utils/onlyUnique";
import Locations from "../../lib/Locations";
import Attractions from "../../lib/Attractions";
import calculateLegDetails from "../../utils/calculateLegDetails";

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

export async function calculateRoute(startRef, finishRef, pubStops, attractionStops, travelMethod, directionsService, setDirectionsResponse, setDistance, setTime, setCombinedStops, setJourneyWarning, setRouteError, setSearchCoverage, setRouteLegs, plannerMode = "journey", localRadius = 1500) {
  const startInput = startRef.current?.value?.trim();
  const finishInput = finishRef.current?.value?.trim();

  if (Number(pubStops) + Number(attractionStops) < 1) {
    setRouteError?.("missing-stops");
    return false;
  }
  if (!startInput || (plannerMode === "journey" && !finishInput)) {
    setRouteError?.(plannerMode === "local" ? "missing-location" : "missing-inputs");
    return false;
  }

  setRouteError?.("");
  setJourneyWarning("walking");

  let start;
  let end;
  try {
    start = await geocode(startInput);
    end = plannerMode === "local" ? start : await geocode(finishInput);
  } catch (error) {
    setRouteError?.("geocode-failed");
    return false;
  }

  if (!Number.isFinite(start?.[0]) || !Number.isFinite(start?.[1]) || !Number.isFinite(end?.[0]) || !Number.isFinite(end?.[1])) {
    setRouteError?.("geocode-failed");
    return false;
  }

  const stopTypes = mixedStopTypes(Number(pubStops), Number(attractionStops));
  let filteredCombinationArray = [];
  if (plannerMode === "local") {
    const radius = Math.round(Math.min(5000, Math.max(500, Number(localRadius))));
    const centre = { lat: start[0], lng: start[1] };
    setSearchCoverage?.({ points: [{ ...centre, stopType: "local", radius }], path: [centre, centre] });
    try {
      const [pubResponse, attractionResponse] = await Promise.all([
        Number(pubStops) ? Locations(centre.lat, centre.lng, radius) : Promise.resolve({ results: [] }),
        Number(attractionStops) ? Attractions(centre.lat, centre.lng, radius) : Promise.resolve({ results: [] }),
      ]);
      const rank = (response, type) => (response?.results || [])
        .filter((place) => place.place_id && place.geometry?.location && place.business_status !== "CLOSED_PERMANENTLY" && (place.rating || 0) >= 3.8)
        .sort((a, b) => ((b.rating || 0) * 2.2 + Math.log10((b.user_ratings_total || 0) + 1) * 1.4) - ((a.rating || 0) * 2.2 + Math.log10((a.user_ratings_total || 0) + 1) * 1.4))
        .map((place) => withStopType(place, type));
      const candidates = { pub: rank(pubResponse, "pub"), attraction: rank(attractionResponse, "attraction") };
      const indices = { pub: 0, attraction: 0 };
      const selectedIds = new Set();
      filteredCombinationArray = stopTypes.map((type) => {
        while (indices[type] < candidates[type].length && selectedIds.has(candidates[type][indices[type]].place_id)) indices[type] += 1;
        const place = candidates[type][indices[type]++];
        if (place) selectedIds.add(place.place_id);
        return place;
      }).filter(Boolean).sort((a, b) =>
        Math.atan2(a.geometry.location.lng - centre.lng, a.geometry.location.lat - centre.lat) -
        Math.atan2(b.geometry.location.lng - centre.lng, b.geometry.location.lat - centre.lat)
      );
    } catch (error) {
      setRouteError?.("places-failed");
      return false;
    }
  } else {
    const plotPoints = findPlotPoints(start, end, stopTypes.length);
    const searchRadius = adaptiveSearchRadius(start, end, stopTypes.length);
    setSearchCoverage?.({
      points: plotPoints.map((point, index) => ({ ...point, stopType: stopTypes[index], radius: searchRadius })),
      path: [{ lat: start[0], lng: start[1] }, { lat: end[0], lng: end[1] }],
    });
    const searchPoints = plotPoints.map((point) => ({ ...point, radius: searchRadius }));
    try {
      const pubData = await getAllPubs(searchPoints.filter((_, index) => stopTypes[index] === "pub"));
      const attractionData = await getAllAttractions(searchPoints.filter((_, index) => stopTypes[index] === "attraction"));
      let pubIndex = 0;
      let attractionIndex = 0;
      filteredCombinationArray = stopTypes
        .map((type) => type === "pub" ? withStopType(pubData[pubIndex++], "pub") : withStopType(attractionData[attractionIndex++], "attraction"))
        .filter(Boolean).filter(onlyUnique);
    } catch (error) {
      setRouteError?.("places-failed");
      return false;
    }
  }
  if (filteredCombinationArray.length < stopTypes.length) setJourneyWarning("shortened");
  const waypoints = filteredCombinationArray.map((stop) => ({ location: stop.geometry.location, stopover: true }));

  let results = null;
  try {
    results = await directionsService.route({
      origin: startInput,
      destination: plannerMode === "local" ? startInput : finishInput,
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
  setRouteLegs?.(calculateLegDetails(results));
  return true;
}
