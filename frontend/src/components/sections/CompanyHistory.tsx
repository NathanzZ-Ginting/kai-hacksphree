import { Train, Zap, Smartphone } from "lucide-react";

const CompanyHistory = () => {
  const milestones = [
    {
      year: "1945",
      title: "Pendirian KAI",
      description:
        "Memulai operasi dengan kereta uap pertama pasca-kemerdekaan",
      icon: <Train className="w-8 h-8" />,
      color: "text-red-600",
    },
    {
      year: "1990",
      title: "Modernisasi Armada",
      description: "Pengenalan kereta listrik untuk layanan yang lebih cepat",
      icon: <Zap className="w-8 h-8" />,
      color: "text-red-600",
    },
    {
      year: "2020",
      title: "Era Digital",
      description: "Peluncuran layanan digital dan pemesanan tiket online",
      icon: <Smartphone className="w-8 h-8" />,
      color: "text-red-600",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jejak Perjalanan Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dari armada sederhana pasca-kemerdekaan hingga menjadi jaringan
            transportasi modern yang melayani jutaan penumpang setiap tahunnya.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-600 to-red-700 hidden md:block"></div>

          <div className="space-y-12 md:space-y-0">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`md:w-1/2 ${
                    index % 2 === 0 ? "md:pl-12" : "md:pr-12"
                  } mb-8 md:mb-0`}
                >
                  <div className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                      <div className={milestone.color}>{milestone.icon}</div>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                <div className="md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyHistory;
