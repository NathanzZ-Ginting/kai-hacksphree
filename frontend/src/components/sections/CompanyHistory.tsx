import { Train, Zap, Smartphone, MapPin, Users, Clock } from "lucide-react";

const CompanyHistory = () => {
  const milestones = [
    {
      year: "1867",
      title: "Pendirian KAI",
      description:
        "Jalur pertama Semarang–Tanggung dibuka 1867. Setelah merdeka, berdiri PJKA (1945) yang jadi cikal bakal PT KAI.",
      icon: <Train className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      stats: "2 Rute Awal",
      statIcon: <MapPin className="w-4 h-4" />,
    },
    {
      year: "2011",
      title: "Modernisasi Armada",
      description:
        "KAI hadirkan 400+ kereta baru seperti eksekutif, KRL, dan kereta bandara untuk tingkatkan layanan.",
      icon: <Zap className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-orange-50",
      stats: "400+ Kereta Baru",
      statIcon: <Users className="w-4 h-4" />,
    },
    {
      year: "2012 - Sekarang",
      title: "Era Digital",
      description:
        "Mulai tiket online 2012, kini aplikasi KAI Access dipakai lebih dari 33 juta pengguna.",
      icon: <Smartphone className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-blue-50",
      stats: "32Jt+ Pengguna",
      statIcon: <Clock className="w-4 h-4" />,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-full text-base font-medium mb-6 shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            Sejarah Perjalanan
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-6">
            Jejak Perjalanan <span className="text-orange-500">Kami</span>
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

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500/30 via-orange-400/30 to-blue-500/30 hidden md:block"></div>
          
          {/* Milestones */}
          <div className="space-y-20 md:space-y-0">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-center transition-all duration-500 hover:scale-[1.02] ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Milestone Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-20" : "md:pl-20"}`}>
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-5 mb-5">
                        <div className={`p-4 rounded-xl ${milestone.bgColor} border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <div className={milestone.color}>{milestone.icon}</div>
                        </div>
                        
                        <div className="w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                            <div className="text-3xl font-bold text-red-600 bg-gradient-to-r from-red-50 to-orange-50 px-3 py-2 rounded-xl shadow-sm">
                              {milestone.year}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg shadow-sm">
                              {milestone.statIcon}
                              <span className="font-medium whitespace-nowrap overflow-x-auto scrollbar-hide">{milestone.stats}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors duration-300">
                            {milestone.title}
                          </h3>
                          
                          <p className="text-gray-600 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover effect line */}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-full transition-all duration-700"></div>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full ${
                  milestone.color
                } ${milestone.bgColor} border-4 border-white z-20 shadow-lg`}>
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
                </div>
                
                {/* Spacer for desktop */}
                <div className="hidden md:block h-20 w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-5 bg-gradient-to-r from-red-600 to-orange-600 text-white px-10 py-5 rounded-3xl shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105">
            <Train className="w-8 h-8" />
            <span className="font-bold text-xl">
              Terus Bergerak Maju Bersama KAI
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyHistory;
