import { Eye, Target } from "lucide-react";
import { useState } from "react";

const MissionVision = () => {
  const [activeTab, setActiveTab] = useState<'vision' | 'mission'>('vision');
  
  const vision = {
    title: "Visi Kami",
    description: "Kami ingin menjadi layanan transportasi kereta api terdepan di Asia Tenggara. Bukan cuma soal perjalanan, tapi juga soal menghubungkan orang, menghadirkan pengalaman yang aman, nyaman, dan terus berinovasi agar bisa ikut mendorong pertumbuhan ekonomi Indonesia.",
    icon: <Eye className="w-10 h-10" />
  };
  
  const mission = {
    title: "Misi Kami",
    description: "Memberikan solusi transportasi yang terjangkau, ramah lingkungan, dan fokus pada kebutuhan pelanggan. Kami terus berinovasi dengan teknologi serta mengembangkan SDM yang handal untuk menghadirkan layanan terbaik.",
    icon: <Target className="w-10 h-10" />
  };

  return (
    <section className="py-24 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Visi & <span className="text-red-600">Misi</span> Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prinsip-prinsip utama yang menjadi pedoman dalam setiap langkah perjalanan kami
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex">
            <button
              onClick={() => setActiveTab('vision')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === 'vision'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Visi Kami
            </button>
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === 'mission'
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Misi Kami
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Icon Side */}
            <div className={`p-12 flex items-center justify-center transition-all duration-500 ${
              activeTab === 'vision' 
                ? 'bg-gradient-to-br from-red-50 to-orange-50' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50'
            }`}>
              <div className={`w-32 h-32 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                activeTab === 'vision' 
                  ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30'
              }`}>
                <div className="text-white">
                  {activeTab === 'vision' ? vision.icon : mission.icon}
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-12">
              <div className="transition-all duration-500">
                <h3 className={`text-3xl font-bold mb-6 ${
                  activeTab === 'vision' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {activeTab === 'vision' ? vision.title : mission.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {activeTab === 'vision' ? vision.description : mission.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-red-600 mb-2">100+</div>
            <div className="text-gray-600">Kota Terhubung</div>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-red-600 mb-2">50JT+</div>
            <div className="text-gray-600">Penumpang Tahunan</div>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-red-600 mb-2">99%</div>
            <div className="text-gray-600">Kepuasan Pelanggan</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
