const valueOf = (value) => typeof value === "function" ? value() : value;

const toPoint = (location) => ({
  lat: valueOf(location?.lat),
  lng: valueOf(location?.lng),
});

const distanceInMetres = (start, end) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const earthRadius = 6371000;
  const latitudeDelta = toRadians(end.lat - start.lat);
  const longitudeDelta = toRadians(end.lng - start.lng);
  const startLatitude = toRadians(start.lat);
  const endLatitude = toRadians(end.lat);
  const a = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const midpointAlongPath = (path) => {
  const points = path.map(toPoint).filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
  if (points.length < 2) return points[0];
  const distances = points.slice(1).map((point, index) => distanceInMetres(points[index], point));
  const halfway = distances.reduce((sum, distance) => sum + distance, 0) / 2;
  let covered = 0;
  for (let index = 0; index < distances.length; index += 1) {
    if (covered + distances[index] >= halfway) {
      const amount = distances[index] ? (halfway - covered) / distances[index] : 0;
      return {
        lat: points[index].lat + (points[index + 1].lat - points[index].lat) * amount,
        lng: points[index].lng + (points[index + 1].lng - points[index].lng) * amount,
      };
    }
    covered += distances[index];
  }
  return points.at(-1);
};

const calculateLegDetails = (directions) =>
  (directions?.routes?.[0]?.legs || []).map((leg) => {
    const path = (leg.steps || []).flatMap((step) => step.path || []);
    return {
      distance: leg.distance?.text || "",
      duration: leg.duration?.text || "",
      midpoint: midpointAlongPath(path.length ? path : [leg.start_location, leg.end_location]),
    };
  });

export default calculateLegDetails;
