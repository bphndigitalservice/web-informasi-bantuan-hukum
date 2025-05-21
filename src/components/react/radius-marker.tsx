import "leaflet-geometryutil";
import { Marker, useMap, Popup, Circle } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L, { LatLng, Marker as LeafletMarker } from "leaflet";
type RadiusMarkerProps = {
  center: LatLng;
  radius: number;
  draggable?: boolean;
  onChange?: (radius: number) => void;
};
export function RadiusMarker({
  center: initialCenter,
  radius: initialRadius,
  draggable = true,
  onChange,
}: RadiusMarkerProps) {
  const [centerPosition, setCenterPosition] = useState<LatLng>(initialCenter);
  const [radius, setRadius] = useState<number>(initialRadius);
  // Default initial angle (can be any value, 120 is just a starting point)
  const angleRef = useRef<number>(120);
  const [radiusSizerMarkerPosition, setRadiusSizerMarkerPosition] =
    useState<LatLng>(() =>
      L.GeometryUtil.destination(centerPosition, angleRef.current, initialRadius),
    );
  const centerMarkerRef = useRef<LeafletMarker | null>(null);
  const sizerMarkerRef = useRef<LeafletMarker | null>(null);
  const map = useMap();
  const isDraggingCenter = useRef(false);
  // Update position and radius when props change
  useEffect(() => {
    if (!isDraggingCenter.current) {
      setCenterPosition(initialCenter);
      setRadius(initialRadius);
      setRadiusSizerMarkerPosition(
        L.GeometryUtil.destination(initialCenter, angleRef.current, initialRadius),
      );
    }
  }, [initialCenter, initialRadius]);
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
  // Update sizer marker position with current angle and radius
  const updateSizerPosition = (center: LatLng, currentRadius: number) => {
    return L.GeometryUtil.destination(center, angleRef.current, currentRadius);
  };
  return (
    <>
      <Circle
        center={centerPosition}
        radius={radius}
        color="red"
        fillOpacity={0.5}
      ></Circle>
      <Marker
        ref={(ref) => {
          if (ref) centerMarkerRef.current = ref;
        }}
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
            if (onChange) {
              onChange(radius);
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
            if (onChange) {
              onChange(radius);
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
