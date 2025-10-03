import { Users, Map, Trophy, Star } from "lucide-react";

const Achievements = () => {
  const stats = [
    {
      number: "50 Juta+",
      label: "Penumpang per Tahun",
      icon: <Users className="w-10 h-10" />,
      description: "Dilayani dengan standar keselamatan tertinggi",
    },
    {
      number: "100+",
      label: "Kota Terhubung",
      icon: <Map className="w-10 h-10" />,
      description: "Jaringan yang mencakup seluruh nusantara",
    },
    {
      number: "5x",
      label: "Penghargaan Nasional",
      icon: <Trophy className="w-10 h-10" />,
      description: "Layanan transportasi terbaik",
    },
    {
      number: "99%",
      label: "Kepuasan Pelanggan",
      icon: <Star className="w-10 h-10" />,
      description: "Rating positif dari penumpang",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pencapaian <span className="text-red-400">Kami</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Bukti komitmen kami dalam memberikan layanan transportasi terbaik untuk Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-8 text-center shadow-2xl hover:shadow-red-500/20 transition-all duration-500 border border-gray-700 hover:border-red-500/30 overflow-hidden relative"
            >
              {/* Animated background element */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                
                <div className="text-5xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors duration-500">
                  {stat.number}
                </div>
                
                <div className="text-red-400 font-bold text-lg mb-3">
                  {stat.label}
                </div>
                
                <div className="text-gray-300">
                  {stat.description}
                </div>
                
                {/* Animated underline */}
                <div className="mt-5 h-1 w-0 group-hover:w-1/2 bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000 rounded-full mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-12 py-5 rounded-full text-xl font-bold shadow-lg shadow-red-500/30">
            Komitmen untuk Layanan Terbaik
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
