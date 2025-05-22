import "leaflet-geometryutil";
import { Marker, useMap, Popup, Circle } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L, { LatLng, Marker as LeafletMarker } from "leaflet";
import sizer from "@components/react/map/icons/radius-sizer.png?url";
import pin from "@components/react/map/icons/map-pin.png?url";

type RadiusWidgetProps = {
  center: LatLng;
  radius: number;
  draggable?: boolean;
  onRadiusChange?: (radius: number) => void;
  onCenterChange?: (center: LatLng) => void;
};

const sizerIcon = new L.Icon({
  iconUrl: sizer,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const centerIcon = new L.Icon({
  iconUrl: pin,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export function RadiusWidget({
  center: initialCenter,
  radius: initialRadius,
  draggable = true,
  onRadiusChange,
  onCenterChange,
}: RadiusWidgetProps) {
  const [centerPosition, setCenterPosition] = useState<LatLng>(initialCenter);
  const [radius, setRadius] = useState<number>(initialRadius);
  // Default initial angle (can be any value, 120 is just a starting point)
  const angleRef = useRef<number>(120);
  const [radiusSizerMarkerPosition, setRadiusSizerMarkerPosition] =
    useState<LatLng>(() =>
      L.GeometryUtil.destination(
        centerPosition,
        angleRef.current,
        initialRadius,
      ),
    );
  const centerMarkerRef = useRef<LeafletMarker | null>(null);
  const sizerMarkerRef = useRef<LeafletMarker | null>(null);
  const map = useMap();
  const isDraggingCenter = useRef(false);

  // Update sizer marker position with current angle and radius
  const updateSizerPosition = (center: LatLng, currentRadius: number) => {
    return L.GeometryUtil.destination(center, angleRef.current, currentRadius);
  };

  // Update position and radius when props change
  useEffect(() => {
    map.setView(initialCenter, map.getZoom());
    if (!isDraggingCenter.current) {
      setCenterPosition(initialCenter);
      setRadius(initialRadius);
      setRadiusSizerMarkerPosition(
        L.GeometryUtil.destination(
          initialCenter,
          angleRef.current,
          initialRadius,
        ),
      );
    }
  }, [initialCenter, initialRadius]);



  return (
    <>
      <Circle
        center={centerPosition}
        radius={radius}
        color={"#7795ff"}
        fillColor={"#7795ff"}
        className={
          "fill-opacity-50 animate-[gradientFill_3s_ease-in-out_infinite] bg-gradient-to-tr from-[#7795ff] via-[#3e61f5] to-[#7795ff] bg-[length:200%_200%] stroke-[#3e61f5]"
        }
      ></Circle>
      <Marker
        ref={(ref) => {
          if (ref) centerMarkerRef.current = ref;
        }}
        icon={centerIcon}
        position={centerPosition}
        draggable={draggable}
        eventHandlers={{
          dragstart: (e) => {
            isDraggingCenter.current = true;
            // Update angle reference in case it was modified by sizer marker movement
            if (sizerMarkerRef.current) {
              const sizerPos = sizerMarkerRef.current.getLatLng();
              angleRef.current = calculateAngle(centerPosition, sizerPos);
            }
          },
          drag: (e) => {
            const newCenter = e.target.getLatLng();
            setCenterPosition(newCenter);
            // Update sizer marker position maintaining the same angle
            const newSizerPosition = updateSizerPosition(newCenter, radius);
            setRadiusSizerMarkerPosition(newSizerPosition);
          },
          dragend: (e) => {
            isDraggingCenter.current = false;

            // Final update after drag ends
            const finalCenter = e.target.getLatLng();
            setCenterPosition(finalCenter);
            const finalSizerPosition = updateSizerPosition(finalCenter, radius);
            setRadiusSizerMarkerPosition(finalSizerPosition);

            if (onCenterChange) {
              onCenterChange(finalCenter);
            }
          },
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
          drag: (e) => {
            const newLatLng = e.target.getLatLng();
            setRadiusSizerMarkerPosition(newLatLng);
            const newRadius = map.distance(centerPosition, newLatLng);
            setRadius(newRadius);
            // Update the angle reference when sizer marker is dragged
            angleRef.current = calculateAngle(centerPosition, newLatLng);
          },
          dragend: (e) => {
            if (onRadiusChange) {
              onRadiusChange(radius);
            }
          },
        }}
      >
        <Popup>
          Radius: {(radius / 1000).toFixed(2)} km <br />
        </Popup>
      </Marker>
    </>
  );
}

// Calculate angle between two points in degrees (0-360)
const calculateAngle = (center: LatLng, point: LatLng): number => {
  // Convert to simple x,y for angle calculation
  const x = point.lng - center.lng;
  const y = point.lat - center.lat;
  // Calculate angle in radians and convert to degrees
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  // Normalize to 0-360 degrees (Leaflet azimuth is 0 at east, clockwise)
  angle = (angle + 90) % 360;
  if (angle < 0) angle += 360;
  return angle;
};


