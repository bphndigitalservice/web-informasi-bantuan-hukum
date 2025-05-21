import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { RadiusMarker } from "./radius-marker";
import L from "leaflet";

export default function Map(){
  return (
    <MapContainer className={"relative z-20 border border-black w-full h-[50vh]"} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RadiusMarker
        center={L.latLng(51.505, -0.09)}
        radius={1000}
        onChange={(newLatLng) => console.log('Marker moved to:', newLatLng)}
      />

    </MapContainer>
  )
}
