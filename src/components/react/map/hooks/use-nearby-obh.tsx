import type { OBH, Posbankum } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import L from "leaflet";
import type { MapType } from "@/lib/map";

// Constants
const DEFAULT_POSITION = L.latLng(-6.2593186, 106.865371);
const DEFAULT_RADIUS = 1000;
const DEBOUNCE_DELAY = 300;

// Type for the nearby locations (either OBH or Posbankum)
type NearbyLocation<T extends MapType> = T extends "obh" ? OBH : Posbankum;

// Custom hook for location and nearby data (OBH or Posbankum)
const useNearbyLocations = <T extends MapType>(type: T) => {
  const [position, setPosition] = useState<L.LatLng>(DEFAULT_POSITION);
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS);
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation<T>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNearbyLocations = useCallback(async (lat: number, lon: number, rad: number) => {
    setIsLoading(true);
    try {
      // Use the appropriate API endpoint based on the type
      const endpoint = type === "obh" ? "nearby-obhs" : "nearby-posbankums";
      const response = await fetch(`/api/${endpoint}?lat=${lat}&lon=${lon}&radius=${rad}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch nearby ${type === "obh" ? "OBHs" : "Posbankums"}`);
      }
      const data = await response.json() as NearbyLocation<T>[];
      setNearbyLocations(data);
    } catch (error) {
      console.error(`Error fetching nearby ${type === "obh" ? "OBHs" : "Posbankums"}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  const debouncedFetchNearbyLocations = useCallback(
    debounce((lat: number, lon: number, rad: number) => {
      fetchNearbyLocations(lat, lon, rad);
    }, DEBOUNCE_DELAY),
    [fetchNearbyLocations]
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
    debouncedFetchNearbyLocations(position.lat, position.lng, radius);
  }, [position, radius, debouncedFetchNearbyLocations]);

  return {
    position,
    setPosition,
    radius,
    setRadius,
    nearbyLocations,
    isLoading
  };
};


const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// For backward compatibility
const useNearbyOBHs = () => {
  const { position, setPosition, radius, setRadius, nearbyLocations, isLoading } = useNearbyLocations("obh");
  return {
    position,
    setPosition,
    radius,
    setRadius,
    nearbyOBHs: nearbyLocations as OBH[],
    isLoading
  };
};

export { useNearbyLocations };
export default useNearbyOBHs;
