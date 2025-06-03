import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import { RadiusWidget } from "./radius-widget.tsx";
import L from "leaflet";
import { useState, useEffect, useCallback, useRef } from "react";
import logo from "@images/logo.svg?url";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  SmartphoneIcon,
  ExternalLink,
  AlertCircle,
  MapPinIcon,
  Loader2,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { OBH, Posbankum } from "@/lib/types.ts";
import obhMarkerIcon from "@components/react/map/icons/object-marker.png?url";
import { useNearbyLocations } from "@components/react/map/hooks/use-nearby-locations.tsx";
import LoadingIndicator from "@components/react/map/loading-indicator.tsx";

// Import added to customize the Lenis scroll behavior
import Lenis from "lenis";
import { getDirections } from "@/lib/map.ts";


// Map marker icon
const posbankumIcon = new L.Icon({
  iconUrl: obhMarkerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});


const PosbankumPopup = ({ posbankum }: { posbankum: Posbankum }) => (
  <Card className="text-foreground w-[300px] border-0 bg-transparent shadow-none">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{posbankum.posbankum_name}</CardTitle>
      <CardDescription className="flex items-start gap-1">
        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <span>{posbankum.posbankum_address}</span>
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-2 pb-2">
      <div className="flex items-start gap-2">
        <Phone className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
        <div className="flex flex-col">
            <span>Tel: {posbankum.posbankum_phone}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="text-muted-foreground h-4 w-4" />
        <a
          href={`mailto:${posbankum.posbankum_email}`}
          className="text-blue-600 hover:underline"
        >
          {posbankum.posbankum_email}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Globe className="text-muted-foreground h-4 w-4" />
        <a
          href={`#`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:underline"
        >
          Website
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={() => getDirections(posbankum.posbankum_address)} className="w-full">
        Petunjuk Arah
      </Button>
    </CardFooter>
  </Card>
);

// Main Component
export default function PosbankumMap() {
  const { position, setPosition, radius, setRadius, nearbyLocations, isLoading } =
    useNearbyLocations("posbankum");
  const [locationPermission, setLocationPermission] = useState<
    "prompt" | "granted" | "denied" | "checking"
  >("checking");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  // Ref for the scroll area element
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  const handleLocationClick = (locationId: number) => {
    setActiveLocation(locationId);
    // You could also center the map on this location here
  };
  const handleMapInteraction = () => {
    if (!isMobile) {
      setIsInteracting(true);
    }
  };

  // Calculate sidebar height on mount and resize
  useEffect(() => {
    const updateSidebarHeight = () => {
      if (sidebarRef.current) {
        const headerHeight =
          sidebarRef.current.querySelector("div")?.offsetHeight || 0;
        const totalHeight = sidebarRef.current.offsetHeight;
        setSidebarHeight(totalHeight - headerHeight);
      }
    };

    updateSidebarHeight();
    window.addEventListener("resize", updateSidebarHeight);
    return () => window.removeEventListener("resize", updateSidebarHeight);
  }, []);

  // Add mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize Lenis with ScrollArea as excluded element
  useEffect(() => {
    // Get the ScrollArea element
    const scrollAreaElement = scrollAreaRef.current;

    if (scrollAreaElement) {
      // Create a custom Lenis instance that excludes the ScrollArea
      const lenis = new Lenis({
        autoRaf: true,
        // Add scroll areas to the exclude list to prevent conflicts
        eventsTarget: document.documentElement,
        smoothWheel: true,
        // This prevents Lenis from handling scroll events in ScrollArea
        prevent: (el: Element) => {
          // Check if the element is inside a ScrollArea
          return (
            el === scrollAreaElement ||
            el.closest("[data-radix-scroll-area-viewport]") !== null ||
            el.closest("[data-slot='scroll-area-viewport']") !== null
          );
        },
      });

      // Clean up Lenis when component unmounts
      return () => {
        lenis.destroy();
      };
    }
  }, []);

  // Auto-hide sidebar when interacting with map
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isInteracting && !isMobile) {
      setSidebarVisible(false);
      timeout = setTimeout(() => {
        setIsInteracting(false);
        setSidebarVisible(true);
      }, 3000); // Show sidebar again after 3 seconds of no interaction
    }
    return () => clearTimeout(timeout);
  }, [isInteracting, isMobile]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission("denied");
      return;
    }
    try {
      // Check if permission is already granted
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      if (permission.state === "granted") {
        getCurrentLocation();
      } else if (permission.state === "denied") {
        setLocationPermission("denied");
      } else {
        setLocationPermission("prompt");
      }
      // Listen for permission changes
      permission.onchange = () => {
        if (permission.state === "granted") {
          getCurrentLocation();
        } else if (permission.state === "denied") {
          setLocationPermission("denied");
        } else {
          setLocationPermission("prompt");
        }
      };
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      setLocationPermission("prompt");
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition(L.latLng(latitude, longitude));
        setLocationPermission("granted");
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationPermission("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  };

  const requestLocationPermission = () => {
    setLocationPermission("checking");
    getCurrentLocation();
  };

  const handlePositionChange = (newLatLng: L.LatLng) => {
    setPosition(newLatLng);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
  };

  return (
    <div className="relative z-0 h-full w-full overflow-hidden">
      {/* Left Sidebar Overlay - Hidden on mobile */}
      {!isMobile && (
        <div
          ref={sidebarRef}
          className={`border-accent-foreground/10 absolute top-2.5 bottom-2.5 left-2.5 z-[500] flex w-80 flex-col overflow-hidden rounded-lg border bg-yellow-300/10 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out dark:bg-black/50 ${
            sidebarVisible ? "translate-x-0" : "-translate-x-full"
          }`}
          onMouseEnter={() => setSidebarVisible(true)}
        >
          <div className="border-border shrink-0 border-b p-4">
            <h2 className="mb-2 text-lg font-semibold dark:text-white">
              {location ? "Posbankum Terdekat" : "Semua Posbankum"}
            </h2>
            <p className="text-muted-foreground text-sm dark:text-white">
              {location
                ? `Terdapat ${nearbyLocations.length} Posbankum di dekat anda.`
                : `Showing ${nearbyLocations.length} Posbankum`}
            </p>
          </div>

          {/* ScrollArea container with explicit height and reference */}
          <div
            ref={scrollAreaRef}
            className="flex-grow overflow-hidden"
            style={{
              height: `calc(100% - ${sidebarRef.current?.querySelector("div")?.offsetHeight || 0}px)`,
            }}
          >
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center space-x-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <div className="flex-1 space-y-2">
                            <div className="bg-muted h-4 animate-pulse rounded" />
                            <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div className="py-4 text-center">
                      <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                      <p className="text-muted-foreground text-sm">
                        Finding nearby organizations...
                      </p>
                    </div>
                  </div>
                ) : (
                  nearbyLocations.map((location, index) => (
                    <Card
                      key={location.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        activeLocation === location.id
                          ? "ring-primary ring-2"
                          : ""
                      }`}
                      onClick={() => handleLocationClick(location.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex flex-row items-start justify-between">
                          <CardTitle className="text-base  leading-tight">
                            {location.posbankum_name}
                          </CardTitle>
                          {location.jarak_meter && (
                            <Badge
                              variant="secondary"
                              className="ml-2 flex items-center gap-1"
                            >
                              <Navigation className="h-3 w-3" />
                              {(location.jarak_meter / 1000).toFixed(2)} KM
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-start gap-1 text-xs">
                          <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
                          <span>{location.posbankum_address}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground h-3 w-3" />
                            <span>{location.posbankum_phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground h-3 w-3" />
                            <span>{location.posbankum_email}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            getDirections(location.posbankum_address);
                          }}
                        >
                          <span className="flex items-center gap-1">
                            <Navigation className={"w-24 h-24"}/>Petunjuk Arah</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
      {/* Sidebar Toggle Button - Only visible when sidebar is hidden */}
      {!isMobile && !sidebarVisible && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 left-4 z-[600] shadow-lg"
          onClick={() => setSidebarVisible(true)}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Show List
        </Button>
      )}
      {/* Location Permission Overlay */}
      {(locationPermission === "prompt" ||
        locationPermission === "denied" ||
        locationPermission === "checking") && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center">
          {/* Blurred backdrop */}
          <div className="bg-background/80 absolute inset-0 backdrop-blur-sm" />
          {/* Overlay content */}
          <Card className="relative z-10 mx-4 w-[400px]">
            <CardHeader className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                {locationPermission === "checking" ? (
                  <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                ) : locationPermission === "denied" ? (
                  <AlertCircle className="text-destructive h-6 w-6" />
                ) : (
                  <MapPinIcon className="text-primary h-6 w-6" />
                )}
              </div>
              <CardTitle className="text-xl">
                {locationPermission === "checking"
                  ? "Getting Your Location..."
                  : locationPermission === "denied"
                    ? "Location Access Denied"
                    : "Enable Location Services"}
              </CardTitle>
              <CardDescription className="text-center">
                {locationPermission === "checking"
                  ? "Please wait while we access your location to show nearby legal aid services."
                  : locationPermission === "denied"
                    ? "Location access was denied. You can still browse all legal aid locations on the map, but we cannot show services near you."
                    : "Allow location access to find legal aid services near you and get personalized recommendations."}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2">
              {locationPermission !== "checking" && (
                <>
                  <Button
                    onClick={requestLocationPermission}
                    className="w-full"
                    disabled={["prompt", "checking"].includes(
                      locationPermission,
                    )}
                  >
                    {locationPermission === "denied"
                      ? "Try Again"
                      : "Allow Location Access"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLocationPermission("granted")}
                    className="w-full"
                  >
                    Continue Without Location
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
      {isLoading && <LoadingIndicator />}
      <div
        className={"flex h-full w-full items-center justify-center"}
        onMouseDown={handleMapInteraction}
        onTouchStart={handleMapInteraction}
        onWheel={handleMapInteraction}
      >
        <MapContainer
          className="border-accent-foreground h-[80vh] w-full rounded-lg border shadow-lg"
          center={position}
          zoom={14}
          zoomControl={false}
          scrollWheelZoom={false}
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
          {nearbyLocations.map((posbankum, index) => (
            <Marker
              key={index}
              icon={posbankumIcon}
              position={[posbankum.latitude, posbankum.longitude]}
            >
              <Popup>
                <PosbankumPopup posbankum={posbankum} />
              </Popup>
            </Marker>
          ))}
          <ZoomControl position="topright" />
        </MapContainer>
      </div>
    </div>
  );
}
