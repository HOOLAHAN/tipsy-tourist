import getPub from "./getPub"

async function getAllPubs(plotPoints) {
  const promises = plotPoints.map((point) => {
    return getPub(point);
  });
  const pubsInfo = await Promise.all(promises);
  return pubsInfo;
}

export default getAllPubs;