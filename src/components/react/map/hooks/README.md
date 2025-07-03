# Map Hooks

This directory contains React hooks for map-related functionality.

## useNearbyLocations

A generic hook for fetching and managing nearby locations (OBH or Posbankum) based on user's position and radius.

### Usage

```tsx
import { useNearbyLocations } from "@components/react/map/hooks/use-nearby-locations.tsx";
import type { MapType } from "@/lib/map";

// For OBH locations
const OBHComponent = () => {
  const { position, setPosition, radius, setRadius, nearbyLocations, isLoading } = 
    useNearbyLocations("obh");
  
  // nearbyLocations will be of type OBH[]
  return (
    // Your component JSX
  );
};

// For Posbankum locations
const PosbankumComponent = () => {
  const { position, setPosition, radius, setRadius, nearbyLocations, isLoading } = 
    useNearbyLocations("posbankum");
  
  // nearbyLocations will be of type Posbankum[]
  return (
    // Your component JSX
  );
};
```

### Return Values

- `position`: Current position (L.LatLng)
- `setPosition`: Function to update position
- `radius`: Current search radius in meters
- `setRadius`: Function to update radius
- `nearbyLocations`: Array of nearby locations (OBH[] or Posbankum[] depending on type)
- `isLoading`: Boolean indicating if data is being fetched

### For Backward Compatibility

The hook also exports a default `useNearbyOBHs` function that maintains the original API for backward compatibility:

```tsx
import useNearbyOBHs from "@components/react/map/hooks/use-nearby-locations.tsx";

const OldComponent = () => {
  const { position, setPosition, radius, setRadius, nearbyOBHs, isLoading } = 
    useNearbyOBHs();
  
  // nearbyOBHs will be of type OBH[]
  return (
    // Your component JSX
  );
};
```
