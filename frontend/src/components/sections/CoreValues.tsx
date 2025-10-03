import { Shield, Lightbulb, Leaf, Users } from "lucide-react";

const CoreValues = () => {
  const values = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Integritas",
      description:
        "Menjunjung tinggi kejujuran, transparansi, dan akuntabilitas dalam setiap tindakan",
    },
    {
      icon: <Lightbulb className="w-10 h-10" />,
      title: "Inovasi",
      description:
        "Terus berinovasi untuk meningkatkan pengalaman dan layanan pelanggan",
    },
    {
      icon: <Leaf className="w-10 h-10" />,
      title: "Keberlanjutan",
      description:
        "Berkomitmen pada praktik bisnis yang ramah lingkungan dan berkelanjutan",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Kolaborasi",
      description:
        "Bekerja sama untuk mencapai tujuan bersama dan menciptakan nilai tambah",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nilai Inti <span className="text-red-600">Kami</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prinsip-prinsip yang menjadi fondasi dalam setiap layanan dan operasional kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-red-200 overflow-hidden"
            >
              <div className="relative mb-6">
                <div className="absolute -inset-2 bg-gradient-to-r from-red-400/10 to-orange-400/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <div className="text-red-600 group-hover:text-red-700 transition-colors duration-300">
                    {value.icon}
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-red-600 transition-colors duration-300">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                {value.description}
              </p>
              
              {/* Animated underline */}
              <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700 rounded-full"></div>
            </div>
          ))}
        </div>
        
        {/* Decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg">
            Nilai-nilai yang Membimbing Kami
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
