import { Users, Clock, Shield, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PassengerServicePage = () => {
  const navigate = useNavigate();

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
      image: "/assets/images/services/angkutan_penumpang.jpg",
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

  const handleOrderTicket = () => {
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative h-[20rem] md:h-[26rem] flex items-center text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("/assets/images/banners/banner-angkutan-penumpang.jpg")',
        }}
      >
        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
              Layanan Penumpang
            </h1>
            <p className="text-lg md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Pengalaman perjalanan kereta api yang nyaman, aman, dan terpercaya
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                Kenyamanan Perjalanan adalah Prioritas Kami
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                KAI menyediakan berbagai kelas layanan penumpang yang dirancang
                untuk memenuhi kebutuhan perjalanan Anda.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 py-2">
                  <Shield className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
                  <span className="font-medium text-gray-900 text-sm md:text-base">
                    Aman & Terpercaya
                  </span>
                </div>
                <div className="flex items-center space-x-3 py-2">
                  <Star className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
                  <span className="font-medium text-gray-900 text-sm md:text-base">
                    Layanan Premium
                  </span>
                </div>
                <div className="flex items-center space-x-3 py-2">
                  <Clock className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
                  <span className="font-medium text-gray-900 text-sm md:text-base">
                    Tepat Waktu
                  </span>
                </div>
                <div className="flex items-center space-x-3 py-2">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
                  <span className="font-medium text-gray-900 text-sm md:text-base">
                    Ramah Penumpang
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl h-64 md:h-96 flex items-center justify-center mt-6 md:mt-0">
              <img
                src="/assets/images/services/angkutan_penumpang.jpg"
                alt="Layanan Penumpang"
                className="h-full w-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Train Classes */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Kelas Layanan Kereta
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto px-4">
              Pilih kelas perjalanan yang sesuai dengan kebutuhan dan budget
              Anda
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {trainClasses.map((trainClass, index) => (
              <div
                key={index}
                className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/3 bg-gray-200 min-h-full p-20 flex items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>

                  <div className="lg:w-2/3 p-4 md:p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="mb-3 md:mb-0">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                          Kelas {trainClass.class}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base mb-3">
                          {trainClass.description}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-lg font-bold text-orange-600">
                          {trainClass.priceRange}
                        </div>
                        <div className="text-sm text-gray-500">Mulai dari</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                          Fasilitas Utama
                        </h4>
                        <ul className="space-y-1 md:space-y-2">
                          {trainClass.facilities
                            .slice(0, 3)
                            .map((facility, idx) => (
                              <li
                                key={idx}
                                className="flex items-center text-gray-600 text-sm md:text-base"
                              >
                                <ChevronRight className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                                <span>{facility}</span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                          Fitur Tambahan
                        </h4>
                        <ul className="space-y-1 md:space-y-2">
                          {trainClass.features
                            .slice(0, 3)
                            .map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-center text-gray-600 text-sm md:text-base"
                              >
                                <ChevronRight className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Siap Memulai Perjalanan?
          </h2>
          <p className="text-orange-100 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
            Pesan tiket kereta Anda sekarang dan nikmati pengalaman perjalanan
            terbaik
          </p>
          <button
            className="w-full md:w-auto bg-white text-orange-600 px-6 py-3 md:px-8 md:py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold text-base md:text-lg"
            onClick={handleOrderTicket}
          >
            Pesan Tiket Sekarang
          </button>
        </div>
      </section>
    </div>
  );
};

export default PassengerServicePage;
