function calculateTime(results) {
  let distance = 0;
  results.routes[0].legs.forEach((leg) => {
    distance += leg.duration.value;
  });
  return `${Math.floor(distance / 60)} mins`;
}

export default calculateTime;