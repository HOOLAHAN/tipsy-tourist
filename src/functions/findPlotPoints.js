const findPlotPoints = (start, end, stopsNum) => {
  const latDiff = (end[0] - start[0]) / (stopsNum - 1);
  const lngDiff = (end[1] - start[1]) / (stopsNum - 1);
  let startLat = start[0];
  let startLng = start[1];
  let plotPoints = [{ lat: startLat, lng: startLng }];
  for (let i = 0; i < stopsNum - 1; i++) {
    startLat += latDiff;
    startLng += lngDiff;
    plotPoints.push({ lat: startLat, lng: startLng });
  }
  return plotPoints;
};

export default findPlotPoints;