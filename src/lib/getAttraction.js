// src/lib/getAtraction.js

import Attractions from "./Attractions";

async function getAttraction(plotPoints) {
  const attraction = await Attractions(plotPoints.lat, plotPoints.lng, plotPoints.radius);
  const attractionData = attraction.results[0];
  return attractionData;
}

export default getAttraction;
