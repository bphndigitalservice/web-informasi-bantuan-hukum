import type { OBH } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import L from "leaflet";

// Constants
const DEFAULT_POSITION = L.latLng(-6.2593186, 106.865371);
const DEFAULT_RADIUS = 1000;
const DEBOUNCE_DELAY = 300;

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


const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default useNearbyOBHs;
