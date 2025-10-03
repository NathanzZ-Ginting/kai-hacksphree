import { Shield, Lightbulb, Leaf, Users } from "lucide-react";

const CoreValues = () => {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Integritas",
      description:
        "Menjunjung tinggi kejujuran, transparansi, dan akuntabilitas dalam setiap tindakan",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Inovasi",
      description:
        "Terus berinovasi untuk meningkatkan pengalaman dan layanan pelanggan",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Keberlanjutan",
      description:
        "Berkomitmen pada praktik bisnis yang ramah lingkungan dan berkelanjutan",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Kolaborasi",
      description:
        "Bekerja sama untuk mencapai tujuan bersama dan menciptakan nilai tambah",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nilai Inti Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prinsip-prinsip yang menjadi fondasi dalam setiap layanan dan
            operasional kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="group text-center">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-red-600">{value.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
