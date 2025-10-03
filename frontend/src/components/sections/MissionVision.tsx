import { Eye, Target } from "lucide-react";

const MissionVision = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Vision */}
          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Visi Kami
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Menjadi penyedia transportasi kereta api terdepan di Asia
                Tenggara, menghubungkan komunitas dengan layanan yang aman,
                nyaman, dan inovatif untuk mendukung percepatan pertumbuhan
                ekonomi Indonesia.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Misi Kami
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Menyediakan solusi transportasi yang terjangkau, ramah
                lingkungan, dan berorientasi pada pelanggan melalui inovasi
                teknologi dan pengembangan sumber daya manusia yang unggul.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
