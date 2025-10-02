import { Train, Car, Clock, Users } from "lucide-react";

const AirportServicePage = () => {
  const services = [
    {
      icon: Train,
      title: "Airport Train",
      description:
        "Kereta bandara yang menghubungkan pusat kota dengan bandara",
      features: [
        "Direct connection",
        "Luggage space",
        "Comfortable seats",
        "WiFi onboard",
      ],
      frequency: "Every 30 minutes",
    },
    {
      icon: Car,
      title: "Airport Transfer",
      description: "Layanan transfer terintegrasi antara stasiun dan bandara",
      features: [
        "Shuttle service",
        "Luggage assistance",
        "Multiple pickups",
        "24/7 service",
      ],
    },
    {
      icon: Users,
      title: "Travel Services",
      description: "Paket perjalanan terintegrasi dengan maskapai penerbangan",
      features: [
        "Flight + Train packages",
        "Hotel partnerships",
        "Travel insurance",
        "Tour guides",
      ],
    },
  ];

  const airportConnections = [
    {
      airport: "Soekarno-Hatta (CGK)",
      station: "Stasiun Bandara Soekarno-Hatta",
      travelTime: "45 minutes",
      price: "Rp 100.000",
    },
    {
      airport: "Juanda (SUB)",
      station: "Stasiun Bandara Juanda",
      travelTime: "30 minutes",
      price: "Rp 75.000",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bandara & Travel
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Konektivitas terintegrasi antara kereta api dan bandara untuk
              perjalanan yang seamless
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Bandara & Travel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solusi perjalanan terpadu dari bandara ke tujuan akhir Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                {service.frequency && (
                  <div className="flex items-center text-sm text-purple-600 font-medium">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.frequency}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Rencanakan Perjalanan Anda
          </h2>
          <p className="text-purple-100 mb-8 text-lg">
            Nikmati kenyamanan perjalanan terintegrasi dari bandara ke tujuan
            Anda
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-lg">
            Pesan Layanan Bandara
          </button>
        </div>
      </section>
    </div>
  );
};

export default AirportServicePage;
