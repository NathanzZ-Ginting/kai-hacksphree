import { useState } from "react";
import { MapPin, Clock, Train, ArrowRightLeft } from "lucide-react";
import StationDropdown from "../ui/StationDropdown";

const RouteMap = () => {
  const [startStation, setStartStation] = useState<string>("");
  const [endStation, setEndStation] = useState<string>("");

  // Data stasiun yang lebih lengkap
  const stations = {
    jabodetabek: [
      { id: "GMR", name: "Gambir", city: "Jakarta Pusat" },
      { id: "BTL", name: "Batu Ceper", city: "Tangerang" },
      { id: "SUD", name: "Sudirman", city: "Jakarta Pusat" },
      { id: "BNG", name: "Bogor", city: "Bogor" },
      { id: "BKS", name: "Bekasi", city: "Bekasi" },
      { id: "TNG", name: "Tangerang", city: "Tangerang" },
      { id: "DPK", name: "Depok", city: "Depok" },
      { id: "CKR", name: "Cikarang", city: "Bekasi" },
      { id: "TBS", name: "Tebet", city: "Jakarta Selatan" },
      { id: "MGB", name: "Manggarai", city: "Jakarta Selatan" },
      { id: "JNG", name: "Jatinegara", city: "Jakarta Timur" },
      { id: "PSE", name: "Pasar Senen", city: "Jakarta Pusat" },
      { id: "KPB", name: "Kampung Bandan", city: "Jakarta Utara" },
    ],
    jawa: [
      { id: "GMR", name: "Gambir", city: "Jakarta Pusat" },
      { id: "BD", name: "Bandung", city: "Bandung" },
      { id: "YK", name: "Yogyakarta", city: "Yogyakarta" },
      { id: "SLO", name: "Solo Balapan", city: "Surakarta" },
      { id: "SLO2", name: "Solo Jebres", city: "Surakarta" },
      { id: "SMG", name: "Semarang Tawang", city: "Semarang" },
      { id: "SMC", name: "Semarang Poncol", city: "Semarang" },
      { id: "SBY", name: "Surabaya Gubeng", city: "Surabaya" },
      { id: "SBI", name: "Surabaya Pasar Turi", city: "Surabaya" },
      { id: "MLG", name: "Malang", city: "Malang" },
      { id: "JBR", name: "Jember", city: "Jember" },
      { id: "BWI", name: "Banyuwangi", city: "Banyuwangi" },
      { id: "CRB", name: "Cirebon", city: "Cirebon" },
      { id: "PWR", name: "Purwokerto", city: "Purwokerto" },
      { id: "TGL", name: "Tegal", city: "Tegal" },
      { id: "PWK", name: "Pekalongan", city: "Pekalongan" },
    ],
    sumatera: [
      { id: "MDN", name: "Medan", city: "Medan" },
      { id: "PBM", name: "Pematang Siantar", city: "Pematang Siantar" },
      { id: "PKL", name: "Padang", city: "Padang" },
      { id: "PLG", name: "Palembang", city: "Palembang" },
      { id: "LMP", name: "Lampung", city: "Lampung" },
      { id: "BKL", name: "Bengkulu", city: "Bengkulu" },
      { id: "JMB", name: "Jambi", city: "Jambi" },
      { id: "BDB", name: "Bandar Lampung", city: "Bandar Lampung" },
    ],
    bali: [
      { id: "DPS", name: "Denpasar", city: "Denpasar" },
      { id: "SGR", name: "Singaraja", city: "Singaraja" },
    ],
    kalimantan: [
      { id: "BJM", name: "Banjarmasin", city: "Banjarmasin" },
      { id: "PNK", name: "Pontianak", city: "Pontianak" },
      { id: "SMR", name: "Samarinda", city: "Samarinda" },
      { id: "BAL", name: "Balikpapan", city: "Balikpapan" },
    ],
    sulawesi: [
      { id: "UPG", name: "Makassar", city: "Makassar" },
      { id: "MDC", name: "Manado", city: "Manado" },
      { id: "PARE", name: "Parepare", city: "Parepare" },
    ],
  };

  const trainRoutes = [
    {
      id: 1,
      name: "Commuter Line Bogor",
      route: ["GMR", "SUD", "DPK", "BNG"],
      segments: [
        { from: "GMR", to: "SUD", distance: 5, duration: 10 },
        { from: "SUD", to: "DPK", distance: 15, duration: 20 },
        { from: "DPK", to: "BNG", distance: 10, duration: 15 },
      ],
    },
    {
      id: 2,
      name: "Argo Parahyangan",
      route: ["GMR", "BD"],
      segments: [{ from: "GMR", to: "BD", distance: 150, duration: 180 }],
    },
    {
      id: 3,
      name: "Taksaka",
      route: ["GMR", "YK", "SLO", "SMG"],
      segments: [
        { from: "GMR", to: "YK", distance: 400, duration: 480 },
        { from: "YK", to: "SLO", distance: 60, duration: 45 },
        { from: "SLO", to: "SMG", distance: 100, duration: 90 },
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
  const allStations = [
    ...stations.jabodetabek,
    ...stations.jawa,
    ...stations.sumatera,
    ...stations.bali,
    ...stations.kalimantan,
    ...stations.sulawesi,
  ];

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
                stations={allStations}
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
                stations={allStations}
              />
            </div>
          </div>
        </div>

        {/* Route Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                {allStations.find((s) => s.id === startStation)?.name} ke{" "}
                {allStations.find((s) => s.id === endStation)?.name}
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
                          {Math.floor(totalDuration / 60)}h {totalDuration % 60}
                          m
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {segments.map((segment, index) => {
                          const fromStation = allStations.find(
                            (s) => s.id === segment.from
                          );
                          const toStation = allStations.find(
                            (s) => s.id === segment.to
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
                          {Math.floor(totalDuration / 60)}h {totalDuration % 60}
                          m
                        </div>
                        <div>{segments.length} Segment</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Peta Rute</h3>
            <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                {startStation && endStation ? (
                  <>
                    <p>
                      Peta Rute{" "}
                      {allStations.find((s) => s.id === startStation)?.name} →{" "}
                      {allStations.find((s) => s.id === endStation)?.name}
                    </p>
                    <p className="text-sm">
                      ({availableRoutes.length} rute tersedia)
                    </p>
                  </>
                ) : (
                  <>
                    <p>Peta Interaktif Rute Kereta</p>
                    <p className="text-sm">Pilih stasiun untuk melihat rute</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteMap;
