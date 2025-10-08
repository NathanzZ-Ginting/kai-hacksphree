import { useState } from "react";
import { MapPin, Clock, Train, Navigation, Calendar } from "lucide-react";

const RoutesPage = () => {
  const [selectedRegion, setSelectedRegion] = useState("jawa");

  const regions = {
    jawa: {
      name: "Pulau Jawa",
      routes: [
        {
          id: "jkt-bdg",
          name: "Jakarta - Bandung",
          trains: ["Argo Parahyangan", "Harina", "Ciremai"],
          duration: "3 jam",
          distance: "180 km",
          frequency: "12x sehari",
          stations: ["Gambir", "Bandung"],
        },
        {
          id: "jkt-yk",
          name: "Jakarta - Yogyakarta",
          trains: ["Argo Lawu", "Taksaka", "Bima"],
          duration: "8 jam",
          distance: "520 km",
          frequency: "8x sehari",
          stations: ["Gambir", "Yogyakarta"],
        },
        {
          id: "jkt-sby",
          name: "Jakarta - Surabaya",
          trains: ["Argo Bromo", "Sembrani", "Gumarang"],
          duration: "10 jam",
          distance: "725 km",
          frequency: "6x sehari",
          stations: ["Gambir", "Surabaya Gubeng"],
        },
      ],
    },
    sumatera: {
      name: "Pulau Sumatera",
      routes: [
        {
          id: "mdn-pek",
          name: "Medan - Pekanbaru",
          trains: ["Sribilah", "Bengkulu"],
          duration: "6 jam",
          distance: "320 km",
          frequency: "4x sehari",
          stations: ["Medan", "Pekanbaru"],
        },
      ],
    },
    bali: {
      name: "Bali & Nusa Tenggara",
      routes: [
        {
          id: "bali",
          name: "Layanan Bali",
          trains: ["Commuter Line Bali"],
          duration: "1-2 jam",
          distance: "80 km",
          frequency: "15x sehari",
          stations: ["Denpasar", "Singaraja"],
        },
      ],
    },
  };

  const popularRoutes = [
    {
      from: "Jakarta",
      to: "Bandung",
      travelTime: "3 jam",
      price: "Rp 150.000",
      popularity: "Sangat Populer",
    },
    {
      from: "Jakarta",
      to: "Yogyakarta",
      travelTime: "8 jam",
      price: "Rp 300.000",
      popularity: "Populer",
    },
    {
      from: "Jakarta",
      to: "Surabaya",
      travelTime: "10 jam",
      price: "Rp 400.000",
      popularity: "Populer",
    },
    {
      from: "Bandung",
      to: "Yogyakarta",
      travelTime: "6 jam",
      price: "Rp 250.000",
      popularity: "Sedang",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Jaringan & Rute Kereta
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Jelajahi jaringan kereta api yang menghubungkan seluruh Indonesia
          </p>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Peta Jaringan Kereta
            </h2>
            <p className="text-xl text-gray-600">
              Lihat cakupan jaringan kereta api di seluruh Indonesia
            </p>
          </div>

          <div className="bg-gray-100 rounded-2xl p-8 h-96 flex items-center justify-center mb-8">
            <div className="text-center text-gray-500">
              <Navigation className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg">Peta Interaktif Jaringan KAI</p>
              <p className="text-sm">(Integrasi dengan map service)</p>
            </div>
          </div>

          {/* Region Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.keys(regions).map((regionKey) => (
              <button
                key={regionKey}
                onClick={() => setSelectedRegion(regionKey)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedRegion === regionKey
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {regions[regionKey as keyof typeof regions].name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Routes by Region */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Rute di {regions[selectedRegion as keyof typeof regions].name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions[selectedRegion as keyof typeof regions].routes.map(
              (route) => (
                <div
                  key={route.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {}} // Removed setSelectedRoute functionality
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {route.name}
                      </h3>
                      <Train className="h-5 w-5 text-blue-600" />
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {route.duration}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {route.distance}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {route.frequency}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-500 mb-2">
                        Stasiun Utama:
                      </div>
                      <div className="text-sm font-medium">
                        {route.stations.join(" → ")}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm text-gray-500 mb-1">Kereta:</div>
                      <div className="flex flex-wrap gap-1">
                        {route.trains.map((train, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {train}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Rute Populer
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Rute
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Waktu Tempuh
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Harga Mulai
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Tingkat Kepopuleran
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {popularRoutes.map((route, index) => (
                  <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {route.from} → {route.to}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {route.travelTime}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {route.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          route.popularity === "Sangat Populer"
                            ? "bg-red-100 text-red-800"
                            : route.popularity === "Populer"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {route.popularity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Schedule Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Butuh Informasi Jadwal?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Cari jadwal kereta dan pesan tiket dengan mudah
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Cari Jadwal Kereta
          </button>
        </div>
      </section>
    </div>
  );
};

export default RoutesPage;
