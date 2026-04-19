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
  startLabel,
  finishLabel,
  pickedStart,
  pickedFinish,
  activePicker,
  onMapPick,
  setSelectedLocation,
  mapTheme = "classic",
  onMarkerClick,
}) => {

  const validStops = combinedStops.filter(
    (stop) =>
      stop?.geometry?.location?.lat &&
      stop?.geometry?.location?.lng
  );

  const firstLeg = directionsResponse?.routes?.[0]?.legs?.[0];
  const lastLegs = directionsResponse?.routes?.[0]?.legs || [];
  const lastLeg = lastLegs[lastLegs.length - 1];

  const makeMarkerIcon = (fillColor, scale = 14) => ({
    // eslint-disable-next-line no-undef
    path: google.maps.SymbolPath.CIRCLE,
    fillColor,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale,
  });

  const makeMarkerLabel = (text, fontSize = "12px") => ({
    text,
    color: "#ffffff",
    fontSize,
    fontWeight: "700",
  });

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
        draggableCursor: activePicker ? "crosshair" : undefined,
      }}
      onLoad={(mapInstance) => setMap(mapInstance)}
      onClick={onMapPick}
    >
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{ suppressMarkers: true }}
        />
      )}

      {firstLeg?.start_location && (
        <Marker
          position={firstLeg.start_location}
          title={startLabel || "Start"}
          icon={makeMarkerIcon("#2563eb", 28)}
          label={makeMarkerLabel("Start", "10px")}
        />
      )}

      {!firstLeg?.start_location && pickedStart && (
        <Marker
          position={pickedStart}
          title={startLabel || "Start"}
          icon={makeMarkerIcon("#2563eb", 28)}
          label={makeMarkerLabel("Start", "10px")}
        />
      )}

      {validStops.map((location, index) => (
        <Marker
          key={location.place_id || index}
          position={{
            lat: location.geometry.location.lat,
            lng: location.geometry.location.lng,
          }}
          title={location.name}
          icon={makeMarkerIcon(location.stopType === "attraction" ? "#7c3aed" : "#dc2626")}
          label={makeMarkerLabel(String(index + 1))}
          onClick={() => {
            onMarkerClick?.(location);
            setSelectedLocation?.(location);
          }}
        />
      ))}

      {lastLeg?.end_location && (
        <Marker
          position={lastLeg.end_location}
          title={finishLabel || "Finish"}
          icon={makeMarkerIcon("#16a34a", 30)}
          label={makeMarkerLabel("Finish", "9px")}
        />
      )}

      {!lastLeg?.end_location && pickedFinish && (
        <Marker
          position={pickedFinish}
          title={finishLabel || "Finish"}
          icon={makeMarkerIcon("#16a34a", 30)}
          label={makeMarkerLabel("Finish", "9px")}
        />
      )}
    </GoogleMap>
  );
};

export default GoogleMapDisplay;
