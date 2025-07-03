import "leaflet-geometryutil";
import { Marker, useMap, Popup, Circle } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L, { LatLng, Marker as LeafletMarker } from "leaflet";
import sizer from "@components/react/map/icons/radius-sizer.png?url";
import pin from "@components/react/map/icons/map-pin.png?url";

// Types
type RadiusWidgetProps = {
  center: LatLng;
  radius: number;
  draggable?: boolean;
  onRadiusChange?: (radius: number) => void;
  onCenterChange?: (center: LatLng) => void;
};

type MarkerDragEvent = {
  target: {
    getLatLng: () => LatLng;
  };
};

// Constants
const INITIAL_ANGLE = 120;
const CIRCLE_COLORS = {
  stroke: "#3e61f5",
  fill: "#7795ff",
  via: "#3e61f5"
};

const CIRCLE_CLASS_NAME =
  "fill-opacity-50 animate-[gradientFill_3s_ease-in-out_infinite] " +
  "bg-gradient-to-tr from-[#7795ff] via-[#3e61f5] to-[#7795ff] " +
  "bg-[length:200%_200%] stroke-[#3e61f5]";

const RIPPLE_CIRCLE_CLASS_NAME =
  "fill-opacity-20 stroke-2 w-16 h-16 ";

// Icons
const sizerIcon = new L.Icon({
  iconUrl: sizer,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const centerIcon = new L.Icon({
  iconUrl: pin,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Helper functions
const calculateAngle = (center: LatLng, point: LatLng): number => {
  const x = point.lng - center.lng;
  const y = point.lat - center.lat;
  // Calculate angle in radians and convert to degrees
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  // Normalize to 0-360 degrees (Leaflet azimuth is 0 at east, clockwise)
  angle = (angle + 90) % 360;
  if (angle < 0) angle += 360;
  return angle;
};

// Ripple Effect Component
const RippleEffect = ({ center, radius }: { center: LatLng; radius: number }) => {
  // Create multiple circles with different animation delays
  return (
    <>
      {[0.5, 1, 1.5].map((delayFactor, index) => (
        <Circle
          key={index}
          center={center}
          radius={radius}
          color={CIRCLE_COLORS.stroke}
          fillColor={CIRCLE_COLORS.fill}
          className={`${RIPPLE_CIRCLE_CLASS_NAME} leaflet-ripple-effect`}
          pathOptions={{
            fillOpacity: 0.15,
            opacity: 0.25,
            weight: 1.5,
            dashArray: "5,10",
          }}

          eventHandlers={{
            add: (e) => {
              const path = e.target;
              if (path._path) {
                path._path.style.animationDelay = `${delayFactor}s`;
                path._path.style.transformOrigin = "center";
              }
            },
          }}

        />
      ))}
    </>
  );
};

export function RadiusWidget({
                               center: initialCenter,
                               radius: initialRadius,
                               draggable = true,
                               onRadiusChange,
                               onCenterChange
                             }: RadiusWidgetProps) {
  const [centerPosition, setCenterPosition] = useState<LatLng>(initialCenter);
  const [radius, setRadius] = useState<number>(initialRadius);
  const angleRef = useRef<number>(INITIAL_ANGLE);
  const [radiusSizerMarkerPosition, setRadiusSizerMarkerPosition] = useState<LatLng>(() =>
    L.GeometryUtil.destination(centerPosition, angleRef.current, initialRadius)
  );

  const centerMarkerRef = useRef<LeafletMarker | null>(null);
  const sizerMarkerRef = useRef<LeafletMarker | null>(null);
  const map = useMap();
  const isDraggingCenter = useRef(false);

  // Update sizer marker position with current angle and radius
  const updateSizerPosition = (center: LatLng, currentRadius: number): LatLng => {
    return L.GeometryUtil.destination(center, angleRef.current, currentRadius);
  };

  // Update position and radius when props change
  useEffect(() => {
    map.setView(initialCenter, map.getZoom());
    if (!isDraggingCenter.current) {
      setCenterPosition(initialCenter);
      setRadius(initialRadius);
      setRadiusSizerMarkerPosition(
        L.GeometryUtil.destination(initialCenter, angleRef.current, initialRadius)
      );
    }
  }, [initialCenter, initialRadius, map]);

  // Center marker event handlers
  const handleCenterDragStart = () => {
    isDraggingCenter.current = true;
    if (sizerMarkerRef.current) {
      const sizerPos = sizerMarkerRef.current.getLatLng();
      angleRef.current = calculateAngle(centerPosition, sizerPos);
    }
  };

  const handleCenterDrag = (e: MarkerDragEvent) => {
    const newCenter = e.target.getLatLng();
    setCenterPosition(newCenter);
    const newSizerPosition = updateSizerPosition(newCenter, radius);
    setRadiusSizerMarkerPosition(newSizerPosition);
  };

  const handleCenterDragEnd = (e: MarkerDragEvent) => {
    isDraggingCenter.current = false;
    const finalCenter = e.target.getLatLng();
    setCenterPosition(finalCenter);
    const finalSizerPosition = updateSizerPosition(finalCenter, radius);
    setRadiusSizerMarkerPosition(finalSizerPosition);

    if (onCenterChange) {
      onCenterChange(finalCenter);
    }
  };

  // Sizer marker event handlers
  const handleSizerDrag = (e: MarkerDragEvent) => {
    const newLatLng = e.target.getLatLng();
    setRadiusSizerMarkerPosition(newLatLng);
    const newRadius = map.distance(centerPosition, newLatLng);
    setRadius(newRadius);
    angleRef.current = calculateAngle(centerPosition, newLatLng);
  };

  const handleSizerDragEnd = () => {
    if (onRadiusChange) {
      onRadiusChange(radius);
    }
  };

  return (
    <>
      {/* Main Circle */}
      <Circle
        center={centerPosition}
        radius={radius}
        color={CIRCLE_COLORS.fill}
        fillColor={CIRCLE_COLORS.fill}
        className={CIRCLE_CLASS_NAME}
      />


      <Marker
        ref={(ref) => {
          if (ref) centerMarkerRef.current = ref;
        }}
        icon={centerIcon}
        position={centerPosition}
        draggable={draggable}
        eventHandlers={{
          dragstart: handleCenterDragStart,
          drag: handleCenterDrag,
          dragend: handleCenterDragEnd
        }}
      >
        <Popup>
          Lat: {centerPosition.lat} <br />
          Lng: {centerPosition.lng} <br />
        </Popup>
      </Marker>

      <Marker
        icon={sizerIcon}
        draggable={true}
        position={radiusSizerMarkerPosition}
        ref={(ref) => {
          if (ref) sizerMarkerRef.current = ref;
        }}
        eventHandlers={{
          drag: handleSizerDrag,
          dragend: handleSizerDragEnd
        }}
      >
        <Popup>
          Radius: {(radius / 1000).toFixed(2)} km <br />
        </Popup>
      </Marker>
    </>
  );
}
