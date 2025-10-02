import { Users, Clock, Shield, Star } from "lucide-react";

const PassengerServicePage = () => {
  const trainClasses = [
    {
      class: "Eksekutif",
      description:
        "Layanan terbaik dengan fasilitas premium untuk kenyamanan maksimal",
      facilities: [
        "Kursi reclining elektrik",
        "Makanan dan minuman included",
        "Power outlet setiap kursi",
        "WiFi premium",
        "Toilet premium",
        "Layanan steward/stewardess",
      ],
      priceRange: "Rp 150.000 - Rp 500.000",
      image: "/images/executive-class.jpg",
      features: [
        "Priority boarding",
        "Welcome drink",
        "Entertainment system",
        "Bantal dan selimut",
      ],
    },
    {
      class: "Bisnis",
      description:
        "Layanan nyaman dengan harga terjangkau untuk perjalanan bisnis",
      facilities: [
        "Kursi nyaman dengan sandaran adjustable",
        "Snack dan minuman",
        "Power outlet shared",
        "AC terkontrol",
        "Toilet bersih",
        "Meja lipat",
      ],
      priceRange: "Rp 100.000 - Rp 300.000",
      image: "/images/business-class.jpg",
      features: ["Boarding teratur", "Air mineral gratis", "Majalah onboard"],
    },
    {
      class: "Ekonomi",
      description:
        "Layanan hemat untuk perjalanan sehari-hari dengan kenyamanan terjamin",
      facilities: [
        "Kursi standard ergonomis",
        "AC standar",
        "Toilet terawat",
        "Harga terjangkau",
        "Jadwal frequent",
      ],
      priceRange: "Rp 50.000 - Rp 150.000",
      image: "/images/economy-class.jpg",
      features: ["Self-service", "Food court access", "Smoking area"],
    },
    {
      class: "Commuter Line",
      description:
        "Layanan praktis untuk perjalanan jarak dekat dan daily commute",
      facilities: [
        "Kursi praktis",
        "AC standar",
        "Jadwal padat",
        "Akses mudah",
        "Multiple stops",
      ],
      priceRange: "Rp 3.000 - Rp 10.000",
      image: "/images/commuter-class.jpg",
      features: ["Quick boarding", "Digital payment", "Real-time tracking"],
    },
  ];

  const popularRoutes = [
    { from: "Jakarta", to: "Bandung", duration: "3 jam", price: "Rp 150.000" },
    {
      from: "Jakarta",
      to: "Yogyakarta",
      duration: "8 jam",
      price: "Rp 300.000",
    },
    {
      from: "Jakarta",
      to: "Surabaya",
      duration: "10 jam",
      price: "Rp 400.000",
    },
    {
      from: "Bandung",
      to: "Yogyakarta",
      duration: "6 jam",
      price: "Rp 250.000",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Layanan Penumpang
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Pengalaman perjalanan kereta api yang nyaman, aman, dan terpercaya
              untuk setiap perjalanan Anda
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Kenyamanan Perjalanan adalah Prioritas Kami
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                KAI menyediakan berbagai kelas layanan penumpang yang dirancang
                untuk memenuhi kebutuhan perjalanan Anda. Dari perjalanan bisnis
                yang membutuhkan kenyamanan ekstra hingga perjalanan sehari-hari
                yang praktis.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-orange-600" />
                  <span className="font-semibold text-gray-900">
                    Aman & Terpercaya
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-8 w-8 text-orange-600" />
                  <span className="font-semibold text-gray-900">
                    Layanan Premium
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <span className="font-semibold text-gray-900">
                    Tepat Waktu
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-orange-600" />
                  <span className="font-semibold text-gray-900">
                    Ramah Penumpang
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center">
              <Users className="h-24 w-24 text-gray-400" />
              {/* In real app: <img src="/images/passenger-service-hero.jpg" alt="Layanan Penumpang" className="rounded-2xl" /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Train Classes */}
      <section className="py-16 bg-gray-50">
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

          <div className="space-y-8">
            {trainClasses.map((trainClass, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="lg:col-span-1 bg-gray-200 h-64 lg:h-full flex items-center justify-center">
                    <Users className="h-16 w-16 text-gray-400" />
                    {/* In real app: <img src={trainClass.image} alt={trainClass.class} className="w-full h-full object-cover" /> */}
                  </div>

                  <div className="lg:col-span-2 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Kelas {trainClass.class}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {trainClass.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">
                          {trainClass.priceRange}
                        </div>
                        <div className="text-sm text-gray-500">Mulai dari</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Fasilitas Utama
                        </h4>
                        <ul className="space-y-2">
                          {trainClass.facilities.map((facility, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-gray-600"
                            >
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                              {facility}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Fitur Tambahan
                        </h4>
                        <ul className="space-y-2">
                          {trainClass.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-gray-600"
                            >
                              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                      Pesan Tiket {trainClass.class}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Rute Populer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {route.from} → {route.to}
                </div>
                <div className="flex items-center justify-center text-gray-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  {route.duration}
                </div>
                <div className="text-orange-600 font-bold text-xl">
                  {route.price}
                </div>
                <button className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                  Pesan Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai Perjalanan?</h2>
          <p className="text-orange-100 mb-8 text-lg">
            Pesan tiket kereta Anda sekarang dan nikmati pengalaman perjalanan
            yang tak terlupakan
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold text-lg">
            Pesan Tiket Sekarang
          </button>
        </div>
      </section>
    </div>
  );
};

export default PassengerServicePage;
