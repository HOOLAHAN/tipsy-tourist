import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { mapThemes } from "./styles/customMapStyle";
import { useUITheme } from "../../context/ThemeContext";

const GoogleMapDisplay = ({
  center,
  map,
  setMap,
  directionsResponse,
  combinedStops,
  setSelectedLocation,
  selectedLocation,
  mapTheme = "classic"
}) => {
  const theme = useUITheme();

  console.log("Rendering route:", directionsResponse);

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
          key={JSON.stringify(directionsResponse?.routes?.[0]?.overview_polyline?.points || "")}
          directions={directionsResponse}
          suppressMarkers={true}
        />
      )}


      {combinedStops.map((location, index) => {
        if (!location.geometry || !location.geometry.location) return null;

        return (
          <Marker
            key={`marker-${location.id || index}`}
            position={{
              lat: location.geometry.location.lat,
              lng: location.geometry.location.lng,
            }}
            onClick={() => setSelectedLocation(location)}
          />
        );
      })}

      {selectedLocation && (
        <InfoWindow
          position={{
            lat: selectedLocation.geometry.location.lat,
            lng: selectedLocation.geometry.location.lng,
          }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div>
            <strong>
              <h3 style={{ color: theme.accent }}>{selectedLocation.name}</h3>
            </strong>
            <p>{selectedLocation.vicinity}</p>
            <p>
              Status:{" "}
              {selectedLocation.opening_hours?.open_now ? "Open" : "Closed"}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapDisplay;
