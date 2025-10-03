import { Train, Zap, Smartphone, MapPin, Users, Clock } from "lucide-react";

const CompanyHistory = () => {
  const milestones = [
    {
      year: "1945",
      title: "Pendirian KAI",
      description:
        "Memulai operasi dengan kereta uap pertama pasca-kemerdekaan Indonesia",
      icon: <Train className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      stats: "5 Rute Awal",
      statIcon: <MapPin className="w-4 h-4" />,
    },
    {
      year: "1990",
      title: "Modernisasi Armada",
      description:
        "Pengenalan kereta listrik untuk layanan yang lebih cepat dan efisien",
      icon: <Zap className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-orange-50",
      stats: "50+ Kereta Baru",
      statIcon: <Users className="w-4 h-4" />,
    },
    {
      year: "2020",
      title: "Era Digital",
      description:
        "Peluncuran layanan digital dan pemesanan tiket online melalui aplikasi",
      icon: <Smartphone className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-blue-50",
      stats: "10Jt+ Pengguna",
      statIcon: <Clock className="w-4 h-4" />,
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-red-100 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-100 rounded-full opacity-20 blur-xl"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            Sejarah Perjalanan
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jejak Perjalanan <span className="text-red-600">Kami</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dari armada sederhana pasca-kemerdekaan hingga menjadi jaringan
            transportasi modern yang melayani{" "}
            <span className="font-semibold text-gray-800">
              jutaan penumpang
            </span>{" "}
            setiap tahunnya.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500 via-orange-400 to-blue-500 hidden md:block rounded-full shadow-lg"></div>

          {/* Timeline Dots */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex flex-col justify-between h-full py-8">
            {milestones.map((_, index) => (
              <div key={index} className="relative">
                <div className="w-6 h-6 bg-white border-4 border-red-600 rounded-full shadow-lg shadow-red-200 z-20"></div>
                <div className="absolute inset-0 animate-ping bg-red-400 rounded-full opacity-20"></div>
              </div>
            ))}
          </div>

          <div className="space-y-8 md:space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center transition-all duration-500 hover:scale-[1.02] ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content Card */}
                <div
                  className={`md:w-1/2 ${
                    index % 2 === 0 ? "md:pl-12" : "md:pr-12"
                  } mb-6 md:mb-0`}
                >
                  <div
                    className={`relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-red-500 ${milestone.bgColor} group overflow-hidden`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                      {milestone.icon}
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`p-3 rounded-xl ${milestone.bgColor} border border-white shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className={milestone.color}>{milestone.icon}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl font-bold text-red-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                            {milestone.year}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 bg-white px-2 py-1 rounded-md shadow-sm">
                            {milestone.statIcon}
                            <span className="font-medium">
                              {milestone.stats}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors duration-300">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Effect Line */}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-500 group-hover:w-full transition-all duration-500"></div>
                  </div>
                </div>

                {/* Timeline Dot (Mobile) */}
                <div className="md:hidden flex items-center justify-center my-4">
                  <div className="w-8 h-8 bg-white border-4 border-red-600 rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                </div>

                {/* Spacer for desktop */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Train className="w-6 h-6" />
            <span className="font-semibold text-lg">
              Terus Bergerak Maju Bersama KAI
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyHistory;
