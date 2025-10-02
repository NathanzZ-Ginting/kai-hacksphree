import { Calendar, User, ArrowRight } from "lucide-react";
import { useLazyLoad } from "../../hooks/useLazyLoad";
import { useNavigate } from "react-router-dom";

const NewsSection = () => {
  const { ref, isVisible } = useLazyLoad();
  const navigate = useNavigate();

  const handleViewAllNews = () => {
    navigate("/news");
  };

  const news = [
    {
      id: 1,
      title: "KAI Luncurkan Layanan Kereta Bandara Terbaru",
      excerpt:
        "Peluncuran rute baru yang menghubungkan bandara dengan pusat kota untuk kenyamanan penumpang.",
      date: "15 Des 2024",
      author: "Tim Media KAI",
      category: "Pengumuman",
      image: "/assets/images/promos/promo-1.jpg",
    },
    {
      id: 2,
      title: "Peningkatan Kapasitas Kereta Selama Musim Liburan",
      excerpt:
        "KAI menambah jumlah perjalanan kereta untuk mengakomodasi lonjakan penumpang musim liburan.",
      date: "10 Des 2024",
      author: "Tim Operasional",
      category: "Operasional",
      image: "/assets/images/promos/promo-2.jpg",
    },
    {
      id: 3,
      title: "Inovasi Tiket Digital untuk Kemudahan Penumpang",
      excerpt:
        "Pengembangan sistem tiket digital terbaru dengan fitur-fitur yang lebih lengkap dan aman.",
      date: "5 Des 2024",
      author: "Tim Teknologi",
      category: "Teknologi",
      image: "/assets/images/promos/promo-3.jpg",
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Berita & Pengumuman
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Update terbaru seputar layanan, pengumuman operasional, dan
            perkembangan KAI
          </p>
        </div>

        {isVisible && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.date}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <User className="h-4 w-4 mr-1" />
                      {item.author}
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleViewAllNews}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium inline-flex items-center cursor-pointer"
          >
            Lihat Semua Berita
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
