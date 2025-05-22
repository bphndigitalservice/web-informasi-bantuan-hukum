import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { RadiusWidget } from "./radius-widget.tsx";
import L from "leaflet";
import { useState, useEffect, useCallback } from "react";
import logo from "@images/logo.svg?url";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import { Phone, Mail, Globe, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import type { OBH } from "@/lib/types.ts";
import obhMarkerIcon from "@components/react/map/icons/object-marker.png?url";

// Constants
const DEFAULT_POSITION = L.latLng(-6.2593186, 106.865371);
const DEFAULT_RADIUS = 1000;
const DEBOUNCE_DELAY = 300;

// Utility functions
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const getDirections = (address: string) => {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, "_blank");
};

// Map marker icon
const obhIcon = new L.Icon({
  iconUrl: obhMarkerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Custom hook for location and OBH data
const useNearbyOBHs = () => {
  const [position, setPosition] = useState<L.LatLng>(DEFAULT_POSITION);
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS);
  const [nearbyOBHs, setNearbyOBHs] = useState<OBH[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNearbyOBHs = useCallback(async (lat: number, lon: number, rad: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/nearby-obhs?lat=${lat}&lon=${lon}&radius=${rad}`);
      if (!response.ok) {
        throw new Error("Failed to fetch nearby OBHs");
      }
      const data = await response.json() as OBH[];
      setNearbyOBHs(data);
    } catch (error) {
      console.error("Error fetching nearby OBHs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchNearbyOBHs = useCallback(
    debounce((lat: number, lon: number, rad: number) => {
      fetchNearbyOBHs(lat, lon, rad);
    }, DEBOUNCE_DELAY),
    [fetchNearbyOBHs]
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition(L.latLng(latitude, longitude));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    debouncedFetchNearbyOBHs(position.lat, position.lng, radius);
  }, [position, radius, debouncedFetchNearbyOBHs]);

  return {
    position,
    setPosition,
    radius,
    setRadius,
    nearbyOBHs,
    isLoading
  };
};

// OBH Popup Component
const OBHPopup = ({ obh }: { obh: OBH }) => (
  <Card className="w-[300px] border-0 shadow-none bg-transparent text-foreground">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{obh.obh_name}</CardTitle>
      <CardDescription className="flex items-start gap-1">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>{obh.obh_address}</span>
      </CardDescription>
    </CardHeader>
    <CardContent className="pb-2 space-y-2">
      <div className="flex items-start gap-2">
        <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div className="flex flex-col">
          {obh.obh_phone_json.telpon?.length > 0 && (
            <span>Tel: {obh.obh_phone_json.telpon.join(", ")}</span>
          )}
          {obh.obh_phone_json.handphone?.length > 0 && (
            <span>Mobile: {obh.obh_phone_json.handphone.join(", ")}</span>
          )}
          {obh.obh_phone_json.fax?.length > 0 && (
            <span>Fax: {obh.obh_phone_json.fax.join(", ")}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <a href={`mailto:${obh.obh_email}`} className="text-blue-600 hover:underline">
          {obh.obh_email}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <a
          href={`https://example.com`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          Website
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={() => getDirections(obh.obh_address)} className="w-full">
        Get Directions
      </Button>
    </CardFooter>
  </Card>
);

// Loading Indicator Component
const LoadingIndicator = () => (
  <div
    className="absolute top-1/2 left-1/2 z-[1000] transform -translate-x-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-800/70 p-2 rounded-lg backdrop-blur-sm">
    Loading...
  </div>
);

// Main Component
export default function LegalAidOrganizationMap() {
  const { position, setPosition, radius, setRadius, nearbyOBHs, isLoading } = useNearbyOBHs();

  const handlePositionChange = (newLatLng: L.LatLng) => {
    setPosition(newLatLng);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
  };

  return (
    <div className="relative z-0">
      {isLoading && <LoadingIndicator />}

      <MapContainer
        className="h-[80vh] w-full rounded-2xl border border-gray-800"
        center={position}
        zoom={14}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RadiusWidget
          center={position}
          radius={radius}
          onRadiusChange={handleRadiusChange}
          onCenterChange={handlePositionChange}
        />

        {nearbyOBHs.map((obh, index) => (
          <Marker
            key={index}
            icon={obhIcon}
            position={[obh.latitude, obh.longitude]}
          >
            <Popup>
              <OBHPopup obh={obh} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div
        className="absolute top-4 right-4 z-[1000] rounded-lg bg-white/30 backdrop-blur-2xl p-2 shadow-md dark:bg-gray-300">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
      </div>
    </div>
  );
}
