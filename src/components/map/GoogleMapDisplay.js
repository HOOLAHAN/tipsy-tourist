import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Polyline,
  Circle,
  OverlayView,
} from "@react-google-maps/api";
import { mapThemes } from "./styles/customMapStyle";
import { Box } from "@chakra-ui/react";
import { FaWalking } from "react-icons/fa";

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
  searchCoverage = { points: [], path: [] },
  showSearchCoverage = true,
  routeLegs = [],
  showRouteLegs = true,
}) => {

  const validStops = combinedStops.filter(
    (stop) =>
      stop?.geometry?.location?.lat &&
      stop?.geometry?.location?.lng
  );

  const firstLeg = directionsResponse?.routes?.[0]?.legs?.[0];
  const lastLegs = directionsResponse?.routes?.[0]?.legs || [];
  const lastLeg = lastLegs[lastLegs.length - 1];

  const makeMarkerIcon = (fillColor, scale = 0.72) => ({
    path: "M 0,-22 C -12,-22 -20,-13 -20,-2 C -20,11 0,30 0,30 C 0,30 20,11 20,-2 C 20,-13 12,-22 0,-22 Z",
    fillColor,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale,
    // eslint-disable-next-line no-undef
    anchor: new google.maps.Point(0, 30),
    // eslint-disable-next-line no-undef
    labelOrigin: new google.maps.Point(0, -1),
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
      {showSearchCoverage && searchCoverage.path?.length > 1 && (
        <Polyline
          path={searchCoverage.path}
          options={{
            strokeOpacity: 0,
            clickable: false,
            icons: [{
              icon: {
                // eslint-disable-next-line no-undef
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#0f172a",
                fillOpacity: 0.42,
                scale: 2,
                strokeOpacity: 0,
              },
              offset: "0",
              repeat: "14px",
            }],
            zIndex: 2,
          }}
        />
      )}

      {showSearchCoverage && searchCoverage.points?.map((point, index) => {
        const color = point.stopType === "local" ? "#3b82f6" : point.stopType === "attraction" ? "#7c3aed" : "#e11d48";
        const radius = point.radius;
        return (
          <Circle
            key={`search-area-${index}`}
            center={point}
            radius={radius}
            options={{
              clickable: false,
              fillColor: color,
              fillOpacity: point.stopType === "local" ? 0.05 : 0.035,
              strokeColor: color,
              strokeOpacity: point.stopType === "local" ? 0.42 : 0.34,
              strokeWeight: 2,
              zIndex: 1,
            }}
          />
        );
      })}

      {showSearchCoverage && !directionsResponse && searchCoverage.points?.map((point, index) => (
        <Circle
          key={`search-center-${index}`}
          center={point}
          radius={14}
          options={{
            clickable: false,
            fillColor: point.stopType === "local" ? "#3b82f6" : point.stopType === "attraction" ? "#7c3aed" : "#e11d48",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeOpacity: 1,
            strokeWeight: 2,
            zIndex: 3,
          }}
        />
      ))}

      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{ suppressMarkers: true, polylineOptions: { strokeColor: "#4285f4", strokeWeight: 6, strokeOpacity: 0.92, zIndex: 5 } }}
        />
      )}

      {showRouteLegs && routeLegs.map((leg, index) => leg.midpoint && (
        <OverlayView
          key={`route-leg-${index}`}
          position={leg.midpoint}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={(width, height) => ({
            x: -(width / 2),
            y: -(height / 2) + (index % 2 === 0 ? -18 : 18),
          })}
        >
          <Box
            display="inline-flex"
            alignItems="center"
            gap={1}
            width="max-content"
            minWidth="max-content"
            bg="white"
            color="#172033"
            border="1px solid #4285f4"
            borderRadius="full"
            boxShadow="0 2px 8px rgba(15,23,42,.14)"
            px={2}
            py={1}
            fontSize="10px"
            fontWeight="800"
            whiteSpace="nowrap"
            pointerEvents="none"
          >
            <FaWalking color="#4285f4" aria-hidden="true" />
            <Box as="span">
              {leg.duration.replace(" mins", "m").replace(" min", "m")} · {leg.distance.replace(" km", "km").replace(" m", "m")}
            </Box>
          </Box>
        </OverlayView>
      ))}

      {firstLeg?.start_location && (
        <Marker
          position={firstLeg.start_location}
          title={startLabel || "Start"}
          icon={makeMarkerIcon("#2563eb", 0.84)}
          label={makeMarkerLabel("S", "13px")}
        />
      )}

      {!firstLeg?.start_location && pickedStart && (
        <Marker
          position={pickedStart}
          title={startLabel || "Start"}
          icon={makeMarkerIcon("#2563eb", 0.84)}
          label={makeMarkerLabel("S", "13px")}
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
          icon={makeMarkerIcon(location.stopType === "attraction" ? "#7c3aed" : "#e11d48")}
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
          icon={makeMarkerIcon("#16a34a", 0.84)}
          label={makeMarkerLabel("F", "13px")}
        />
      )}

      {!lastLeg?.end_location && pickedFinish && (
        <Marker
          position={pickedFinish}
          title={finishLabel || "Finish"}
          icon={makeMarkerIcon("#16a34a", 0.84)}
          label={makeMarkerLabel("F", "13px")}
        />
      )}
    </GoogleMap>
  );
};

export default GoogleMapDisplay;
