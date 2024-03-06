export function calculateWaypoints(pubData, attractionData, setJourneyWarning) {
  const waypointsArray = [];
  if (!pubData) {
    return waypointsArray;
  }
  pubData.forEach((pub) => {
    if (pub === undefined) {
      setJourneyWarning("shortened");
      return;
    } else {
      const obj = {
        location: pub.geometry.location,
        stopover: true,
      };
      waypointsArray.push(obj);
    }
  });
  if (!attractionData) {
    return waypointsArray;
  }
  attractionData.forEach((attraction) => {
    if (attraction === undefined) {
      setJourneyWarning("shortened");
      return;
    } else {
      const obj = {
        location: attraction.geometry.location,
        stopover: true,
      };
      waypointsArray.push(obj);
    }
  });
  
  return waypointsArray;
}