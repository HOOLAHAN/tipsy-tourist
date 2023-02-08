function calculateDistance(results) {
  let distance = 0;
  results.routes[0].legs.forEach((leg) => {
    distance += leg.distance.value;
  });
  return `${Math.round(distance / 1000)} km`;
}

export default calculateDistance;