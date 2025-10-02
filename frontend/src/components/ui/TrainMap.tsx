"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different station types
const startIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const endIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const routeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  startStation?: Station;
  endStation?: Station;
  routeStations?: Station[];
}

const TrainMap: React.FC<Props> = ({
  startStation,
  endStation,
  routeStations = [],
}) => {
  // Default center Indonesia dengan fallback
  const defaultCenter: [number, number] = [-2.5489, 118.0149]; // Center of Indonesia
  const defaultZoom = 5;

  // Determine map center based on available stations
  const getMapCenter = (): [number, number] => {
    if (startStation) return [startStation.lat, startStation.lng];
    if (endStation) return [endStation.lat, endStation.lng];
    if (routeStations.length > 0) {
      return [routeStations[0].lat, routeStations[0].lng];
    }
    return defaultCenter;
  };

  // Calculate bounds for all stations to fit map view
  const getBounds = (): L.LatLngBounds | undefined => {
    const allStations = [
      ...(startStation ? [startStation] : []),
      ...(endStation ? [endStation] : []),
      ...routeStations,
    ];

    if (allStations.length === 0) return undefined;

    const bounds = new L.LatLngBounds(
      allStations.map(
        (station) => [station.lat, station.lng] as [number, number]
      )
    );

    return bounds;
  };

  const center = getMapCenter();
  const bounds = getBounds();

  return (
    <div className="relative h-96 w-full rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">
      <MapContainer
        center={center}
        zoom={defaultZoom}
        className="h-full w-full"
        scrollWheelZoom={true}
        bounds={bounds}
        boundsOptions={{ padding: [20, 20] }}
      >
        {/* Base map dari OpenStreetMap dengan style yang lebih baik */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker stasiun awal */}
        {startStation && (
          <Marker
            position={[startStation.lat, startStation.lng]}
            icon={startIcon as any}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-green-600">🟢 Stasiun Awal</strong>
                <br />
                {startStation.name}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker stasiun tujuan */}
        {endStation && (
          <Marker
            position={[endStation.lat, endStation.lng]}
            icon={endIcon as any}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-red-600">🔴 Stasiun Tujuan</strong>
                <br />
                {endStation.name}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker stasiun rute (jika ada) */}
        {routeStations.map((station, index) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={routeIcon as any}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-blue-600">
                  🔵 Stasiun {index + 1}
                </strong>
                <br />
                {station.name}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Garis rute dengan style yang lebih baik */}
        {routeStations.length > 1 && (
          <Polyline
            positions={routeStations.map(
              (s) => [s.lat, s.lng] as [number, number]
            )}
            pathOptions={{
              color: "#3b82f6",
              weight: 5,
              opacity: 0.7,
            }}
          />
        )}

        {/* Garis dari start ke end jika ada keduanya */}
        {startStation && endStation && (
          <Polyline
            positions={[
              [startStation.lat, startStation.lng] as [number, number],
              [endStation.lat, endStation.lng] as [number, number],
            ]}
            pathOptions={{
              color: "#ef4444",
              weight: 3,
              opacity: 0.5,
              dashArray: "10, 10",
            }}
          />
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-[1000]">
        <div className="text-sm font-semibold mb-2">Legenda:</div>
        <div className="space-y-1">
          {startStation && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Stasiun Awal</span>
            </div>
          )}
          {endStation && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Stasiun Tujuan</span>
            </div>
          )}
          {routeStations.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs">Stasiun Rute</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainMap;
