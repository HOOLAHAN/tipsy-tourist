import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { mapThemes } from "./styles/customMapStyle";

const GoogleMapDisplay = ({
  center,
  setMap,
  directionsResponse,
  combinedStops,
  setSelectedLocation,
  mapTheme = "classic",
  onMarkerClick,
}) => {

  const validStops = combinedStops.filter(
    (stop) =>
      stop?.geometry?.location?.lat &&
      stop?.geometry?.location?.lng
  );

  return (
    <GoogleMap
      center={center}
      zoom={15}
      mapContainerStyle={{ width: "100%", height: "100%" }}
      options={{
        styles: mapThemes[mapTheme],
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          suppressMarkers={true}
        />
      )}

      {validStops.map((location, index) => (
        <Marker
          key={location.place_id || index}
          position={{
            lat: location.geometry.location.lat,
            lng: location.geometry.location.lng,
          }}
          onClick={() => {
            onMarkerClick?.(location);
            setSelectedLocation?.(location);
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapDisplay;
