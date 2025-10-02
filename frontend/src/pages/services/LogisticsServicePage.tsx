import { Truck, Package, Clock, MapPin } from "lucide-react";

const LogisticsServicePage = () => {
  const services = [
    {
      icon: Package,
      title: "Kargo Express",
      description: "Pengiriman barang cepat dengan jaminan waktu sampai",
      features: [
        "Door-to-door service",
        "Real-time tracking",
        "Insurance included",
        "24/7 customer support",
      ],
      deliveryTime: "1-3 hari",
    },
    {
      icon: Truck,
      title: "Logistik Supply Chain",
      description: "Solusi logistik terintegrasi untuk bisnis Anda",
      features: [
        "Warehouse management",
        "Inventory control",
        "Distribution network",
        "Custom clearance",
      ],
      deliveryTime: "Flexible",
    },
    {
      icon: MapPin,
      title: "Layanan Khusus",
      description: "Pengiriman barang khusus dan berukuran besar",
      features: [
        "Heavy cargo",
        "Temperature controlled",
        "Fragile items",
        "Oversized goods",
      ],
      deliveryTime: "Custom",
    },
  ];

  const coverageAreas = [
    {
      region: "Jawa",
      cities: ["Jakarta", "Bandung", "Semarang", "Surabaya", "Yogyakarta"],
    },
    {
      region: "Sumatera",
      cities: ["Medan", "Palembang", "Padang", "Pekanbaru"],
    },
    {
      region: "Bali & Nusa Tenggara",
      cities: ["Denpasar", "Mataram", "Kupang"],
    },
    { region: "Kalimantan", cities: ["Balikpapan", "Samarinda", "Pontianak"] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section dengan Background Image */}
      <section
        className="relative h-[26rem] flex items-center text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("/assets/images/banners/banner-angkutan-penumpang.jpg")',
        }}
      >
        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Logistik & Kargo
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Layanan pengiriman barang yang handal, aman, dan terpercaya ke
              seluruh Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Logistik Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Berbagai solusi logistik untuk memenuhi kebutuhan pengiriman
              barang Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.deliveryTime}
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Detail Layanan →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Areas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Jaringan Pengiriman
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coverageAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {area.region}
                </h3>
                <ul className="space-y-2">
                  {area.cities.map((city, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Pengiriman Barang?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Konsultasikan kebutuhan logistik Anda dengan tim profesional kami
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg">
            Konsultasi Gratis
          </button>
        </div>
      </section>
    </div>
  );
};

export default LogisticsServicePage;
