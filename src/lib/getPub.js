// src/lib/getPub.js

import Locations from "./Locations";

async function getPub(plotPoints) {
  const pub = await Locations(plotPoints.lat, plotPoints.lng);

  const pubData = pub.results[0];
  return pubData;
}

export default getPub;