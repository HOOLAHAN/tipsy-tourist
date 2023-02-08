import getAttraction from "./getAttraction"

async function getAllAttractions(plotPoints) {
  const promises = plotPoints.map((point) => {
    return getAttraction(point);
  });
  const AttragetAllAttractionsInfo = await Promise.all(promises);
  return AttragetAllAttractionsInfo;
}

export default getAllAttractions;