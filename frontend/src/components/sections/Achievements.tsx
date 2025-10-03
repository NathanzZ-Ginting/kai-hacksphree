import { Users, Map, Trophy, Star } from "lucide-react";

const Achievements = () => {
  const stats = [
    {
      number: "50 Juta+",
      label: "Penumpang per Tahun",
      icon: <Users className="w-8 h-8" />,
      description: "Dilayani dengan standar keselamatan tertinggi",
    },
    {
      number: "100+",
      label: "Kota Terhubung",
      icon: <Map className="w-8 h-8" />,
      description: "Jaringan yang mencakup seluruh nusantara",
    },
    {
      number: "5x",
      label: "Penghargaan Nasional",
      icon: <Trophy className="w-8 h-8" />,
      description: "Layanan transportasi terbaik",
    },
    {
      number: "99%",
      label: "Kepuasan Pelanggan",
      icon: <Star className="w-8 h-8" />,
      description: "Rating positif dari penumpang",
    },
  ];

  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pencapaian Kami
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Bukti komitmen kami dalam memberikan layanan transportasi terbaik
            untuk Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-red-600 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-red-400 font-semibold mb-3">
                  {stat.label}
                </div>
                <div className="text-gray-300 text-sm">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
