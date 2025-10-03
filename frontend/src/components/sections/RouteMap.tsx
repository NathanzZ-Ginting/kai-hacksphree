import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Train, ArrowRightLeft } from "lucide-react";
import StationDropdown from "../ui/StationDropdown";
import type { Station } from "../../types/kai";

const RouteMap = () => {
  const [startStation, setStartStation] = useState<string>("");
  const [endStation, setEndStation] = useState<string>("");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

  // Fetch data stasiun dari API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/master-data/station`);

        if (response.data.success) {
          setStations(response.data.data);
        } else {
          setError("Gagal mengambil data stasiun");
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Terjadi kesalahan saat mengambil data stasiun");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Data rute kereta (sementara masih dummy, bisa disesuaikan dengan API jika tersedia)
  const trainRoutes = [
    {
      id: 1,
      name: "Argo Parahyangan",
      route: ["GMR", "BD"],
      segments: [{ from: "GMR", to: "BD", distance: 150, duration: 180 }],
    },
    {
      id: 2,
      name: "Taksaka",
      route: ["GMR", "YK", "SLO", "SMT"],
      segments: [
        { from: "GMR", to: "YK", distance: 400, duration: 480 },
        { from: "YK", to: "SLO", distance: 60, duration: 45 },
        { from: "SLO", to: "SMT", distance: 100, duration: 90 },
      ],
    },
    {
      id: 3,
      name: "Gumarang",
      route: ["GMR", "SMT", "SGU", "PAS"],
      segments: [
        { from: "GMR", to: "SMT", distance: 450, duration: 540 },
        { from: "SMT", to: "SGU", distance: 350, duration: 420 },
        { from: "SGU", to: "PAS", distance: 5, duration: 10 },
      ],
    },
  ];

  // Fungsi untuk mencari rute yang tersedia
  const findAvailableRoutes = () => {
    if (!startStation || !endStation) return [];

    return trainRoutes.filter((route) => {
      const startIndex = route.route.indexOf(startStation);
      const endIndex = route.route.indexOf(endStation);
      return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
    });
  };

  // Fungsi untuk mendapatkan detail segment dari rute
  const getRouteSegments = (route: (typeof trainRoutes)[0]) => {
    const startIndex = route.route.indexOf(startStation);
    const endIndex = route.route.indexOf(endStation);

    return route.segments.filter((segment) => {
      const segmentStartIndex = route.route.indexOf(segment.from);
      const segmentEndIndex = route.route.indexOf(segment.to);
      return segmentStartIndex >= startIndex && segmentEndIndex <= endIndex;
    });
  };

  // Fungsi untuk menghitung total jarak dan durasi
  const calculateTotalDistanceAndDuration = (
    segments: (typeof trainRoutes)[0]["segments"]
  ) => {
    const totalDistance = segments.reduce(
      (sum, segment) => sum + segment.distance,
      0
    );
    const totalDuration = segments.reduce(
      (sum, segment) => sum + segment.duration,
      0
    );
    return { totalDistance, totalDuration };
  };

  // Fungsi swap stasiun
  const swapStations = () => {
    const temp = startStation;
    setStartStation(endStation);
    setEndStation(temp);
  };

  const availableRoutes = findAvailableRoutes();

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data stasiun...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          Cari Rute Kereta
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Temukan rute perjalanan kereta api antar stasiun
        </p>

        {/* Station Selector */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Stasiun Awal */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stasiun Awal
              </label>
              <StationDropdown
                value={startStation}
                onChange={setStartStation}
                placeholder="Pilih Stasiun Awal"
                stations={stations}
              />
            </div>

            {/* Swap Button */}
            <div className="mt-6 md:mt-0">
              <button
                onClick={swapStations}
                disabled={!startStation || !endStation}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Tukar Stasiun"
              >
                <ArrowRightLeft className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Stasiun Tujuan */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stasiun Tujuan
              </label>
              <StationDropdown
                value={endStation}
                onChange={setEndStation}
                placeholder="Pilih Stasiun Tujuan"
                stations={stations}
              />
            </div>
          </div>
        </div>

        {/* Route Results */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-600">
            <Train className="h-6 w-6 text-orange-600 mr-2" />
            Rute Tersedia
          </h3>

          {!startStation || !endStation ? (
            <div className="text-center py-8 text-gray-500">
              Pilih stasiun awal dan tujuan untuk melihat rute
            </div>
          ) : availableRoutes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Tidak ada rute langsung dari{" "}
              {stations.find((s) => s.stationCode === startStation)?.name} ke{" "}
              {stations.find((s) => s.stationCode === endStation)?.name}
            </div>
          ) : (
            <div className="space-y-6">
              {availableRoutes.map((route) => {
                const segments = getRouteSegments(route);
                const { totalDistance, totalDuration } =
                  calculateTotalDistanceAndDuration(segments);

                return (
                  <div
                    key={route.id}
                    className="border-l-4 border-orange-500 pl-4 py-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg text-gray-800">
                        {route.name}
                      </h4>
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                        {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {segments.map((segment, index) => {
                        const fromStation = stations.find(
                          (s) => s.stationCode === segment.from
                        );
                        const toStation = stations.find(
                          (s) => s.stationCode === segment.to
                        );

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {fromStation?.name} → {toStation?.name}
                            </span>
                            <span className="text-gray-500">
                              {segment.distance}km • {segment.duration}m
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Total: {totalDistance}km •{" "}
                        {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                      </div>
                      <div>{segments.length} Segment</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RouteMap;
