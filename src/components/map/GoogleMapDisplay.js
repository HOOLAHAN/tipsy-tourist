// src/components/map/GoogleMapDisplay.js

import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { mapThemes } from './styles/customMapStyle';

const GoogleMapDisplay = ({
  center,
  map,
  setMap,
  directionsResponse,
  combinedStops,
  setSelectedLocation,
  selectedLocation,
  mapTheme = "neon" // default fallback
}) => (
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
    onLoad={(map) => setMap(map)}
  >
    {directionsResponse && (
      <DirectionsRenderer 
        directions={directionsResponse} 
        markerOptions={{ visible: false }}
        suppressMarkers={true}
      />
    )}
    {combinedStops.length > 0 && combinedStops.map((location, index) => {
      if (!location.geometry || !location.geometry.location) {
        return null;
      }
      const key = `marker-${location.id}-${index}`;
      return (
        <Marker
          key={key}
          position={{
            lat: location.geometry.location.lat,
            lng: location.geometry.location.lng,
          }}
          onClick={() => {
            setSelectedLocation(location);
          }}
        />
      );
    })}
    {selectedLocation && (
      <InfoWindow
        position={{
          lat: selectedLocation.geometry.location.lat,
          lng: selectedLocation.geometry.location.lng,
        }}
        onCloseClick={() => {
          setSelectedLocation(null);
        }}
      >
        <div>
          <strong><h3>{selectedLocation.name}</h3></strong>
          <p>{selectedLocation.vicinity}</p>
          <p>Status: {selectedLocation.opening_hours.open_now ? 'Open' : 'Closed'}</p>
        </div>
      </InfoWindow>
    )}
  </GoogleMap>
);

export default GoogleMapDisplay;
