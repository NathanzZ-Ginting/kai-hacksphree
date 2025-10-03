import {
  Truck,
  Building,
  Plane,
  Bus,
  Package,
  Users,
  Wifi,
  Utensils,
  Zap,
} from "lucide-react";

const ServicesPage = () => {
  const mainServices = [
    {
      icon: Users,
      title: "Layanan Penumpang",
      description:
        "Layanan transportasi kereta api untuk penumpang dengan berbagai kelas dan fasilitas",
      features: [
        "Kereta Eksekutif",
        "Kereta Bisnis",
        "Kereta Ekonomi",
        "Commuter Line",
        "Kereta Bandara",
      ],
      image: "/images/passenger-service.jpg",
    },
    {
      icon: Truck,
      title: "Logistik & Kargo",
      description:
        "Layanan pengiriman barang dan logistik yang handal dan terpercaya",
      features: [
        "Kargo Barang",
        "Logistik Supply Chain",
        "Pengiriman Cepat",
        "Layanan Door-to-Door",
        "Tracking Real-time",
      ],
      image: "/images/logistics-service.jpg",
    },
    {
      icon: Building,
      title: "Pengelolaan Properti",
      description:
        "Pengembangan dan pengelolaan properti serta kawasan stasiun",
      features: [
        "Retail Stasiun",
        "Pengembangan Kawasan",
        "Property Management",
        "Food & Beverage",
        "Commercial Space",
      ],
      image: "/images/property-service.jpg",
    },
    {
      icon: Plane,
      title: "Layanan Bandara & Travel",
      description: "Konektivitas terintegrasi antara kereta api dan bandara",
      features: [
        "Airport Train",
        "Travel Services",
        "Tour Packages",
        "Hotel Partnerships",
        "Transportasi Bandara",
      ],
      image: "/images/airport-service.jpg",
    },
  ];

  const trainClasses = [
    {
      class: "Eksekutif",
      description: "Layanan terbaik dengan fasilitas premium",
      facilities: [
        "Kursi reclining",
        "Makanan included",
        "Power outlet",
        "WiFi",
        "Toilet premium",
      ],
      priceRange: "Rp 150.000 - Rp 500.000",
    },
    {
      class: "Bisnis",
      description: "Layanan nyaman dengan harga terjangkau",
      facilities: [
        "Kursi nyaman",
        "Snack",
        "Power outlet",
        "AC",
        "Toilet bersih",
      ],
      priceRange: "Rp 100.000 - Rp 300.000",
    },
    {
      class: "Ekonomi",
      description: "Layanan hemat untuk perjalanan sehari-hari",
      facilities: [
        "Kursi standard",
        "AC",
        "Toilet",
        "Terjangkau",
        "Frequent departure",
      ],
      priceRange: "Rp 50.000 - Rp 150.000",
    },
    {
      class: "Commuter",
      description: "Layanan untuk perjalanan jarak dekat",
      facilities: [
        "Kursi praktis",
        "AC",
        "Frequent schedule",
        "Affordable",
        "Multiple stops",
      ],
      priceRange: "Rp 3.000 - Rp 10.000",
    },
  ];

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "makanan included":
      case "snack":
        return <Utensils className="h-4 w-4" />;
      case "power outlet":
        return <Zap className="h-4 w-4" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
    }
  };

  // getFacilityIcon removed from usage - kept in file in case we reuse later

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Layanan KAI</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Berbagai layanan terpadu untuk memenuhi kebutuhan transportasi dan
            logistik Anda
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Utama Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              KAI tidak hanya menyediakan layanan transportasi penumpang, tetapi
              juga berbagai layanan pendukung yang komprehensif
            </p>
          </div>

          <div className="space-y-16">
            {mainServices.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-12 items-center`}
              >
                <div className="lg:w-1/2">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-64 bg-gray-200 flex items-center justify-center">
                      <service.icon className="h-16 w-16 text-gray-400" />
                      {/* In real app: <img src={service.image} alt={service.title} className="w-full h-full object-cover" /> */}
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-red-600" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>

                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="mt-8 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                    Pelajari Lebih Lanjut
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Train Classes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kelas Layanan Kereta
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pilih kelas perjalanan yang sesuai dengan kebutuhan dan budget
              Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainClasses.map((trainClass, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
              >
                <div className="h-32 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {trainClass.class}
                  </h3>

                  <p className="text-gray-600 mb-4 text-sm">
                    {trainClass.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {trainClass.facilities.map((facility, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        {facility}
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-500">Kisaran Harga</div>
                    <div className="font-semibold text-red-600">
                      {trainClass.priceRange}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Tambahan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Kargo Express
              </h3>
              <p className="text-gray-600">
                Layanan pengiriman barang cepat dengan jaminan waktu sampai
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Travel Partners
              </h3>
              <p className="text-gray-600">
                Kerjasama dengan penyedia travel untuk kenyamanan perjalanan
                Anda
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Stasiun Retail
              </h3>
              <p className="text-gray-600">
                Berbagai retail dan F&B di stasiun untuk kebutuhan perjalanan
                Anda
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
