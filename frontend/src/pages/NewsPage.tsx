import { useState } from "react";
import {
  Calendar,
  User,
  ArrowRight,
  Search,
  Filter,
  Clock,
} from "lucide-react";

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "Semua Berita" },
    { id: "pengumuman", name: "Pengumuman" },
    { id: "operasional", name: "Operasional" },
    { id: "teknologi", name: "Teknologi" },
    { id: "promo", name: "Promo & Diskon" },
    { id: "corporate", name: "Corporate" },
  ];

  const news = [
    {
      id: 1,
      title:
        "KAI Luncurkan Layanan Kereta Bandara Terbaru di Bandara Soekarno-Hatta",
      excerpt:
        "PT KAI meluncurkan layanan kereta bandara terbaru yang menghubungkan Bandara Soekarno-Hatta dengan pusat kota Jakarta untuk kenyamanan penumpang.",
      content:
        "Layanan baru ini akan beroperasi mulai 1 Januari 2024 dengan frekuensi 30 menit sekali. Penumpang dapat menikmati fasilitas premium dan konektivitas yang lebih baik...",
      date: "15 Desember 2024",
      author: "Tim Media KAI",
      category: "operasional",
      image: "/images/news-1.jpg",
      readTime: "3 min read",
      featured: true,
    },
    {
      id: 2,
      title: "Peningkatan Kapasitas Kereta Selama Musim Liburan Nataru",
      excerpt:
        "KAI menambah jumlah perjalanan kereta untuk mengakomodasi lonjakan penumpang selama musim liburan Natal dan Tahun Baru.",
      content:
        "Untuk mengantisipasi lonjakan penumpang selama periode Natal dan Tahun Baru, KAI akan menambah 50% kapasitas kursi pada rute-rute utama...",
      date: "10 Desember 2024",
      author: "Tim Operasional KAI",
      category: "operasional",
      image: "/images/news-2.jpg",
      readTime: "2 min read",
      featured: false,
    },
    {
      id: 3,
      title:
        "Inovasi Tiket Digital dengan Fitur Terbaru untuk Kemudahan Penumpang",
      excerpt:
        "Pengembangan sistem tiket digital terbaru dengan fitur-fitur yang lebih lengkap dan keamanan yang ditingkatkan.",
      content:
        "Aplikasi KAI Access kini hadir dengan fitur-fitur terbaru termasuk pembatalan tiket instan, notifikasi real-time, dan integrasi dengan sistem pembayaran digital...",
      date: "5 Desember 2024",
      author: "Tim Teknologi KAI",
      category: "teknologi",
      image: "/images/news-3.jpg",
      readTime: "4 min read",
      featured: true,
    },
    {
      id: 4,
      title: "Program Diskon 30% untuk Pelajar dan Mahasiswa",
      excerpt:
        "KAI memberikan diskon khusus 30% untuk pelajar dan mahasiswa pada rute-rute tertentu selama periode ujian.",
      content:
        "Dalam rangka mendukung pendidikan, KAI memberikan diskon khusus sebesar 30% untuk pelajar dan mahasiswa yang bepergian menggunakan kereta...",
      date: "1 Desember 2024",
      author: "Tim Marketing KAI",
      category: "promo",
      image: "/images/news-4.jpg",
      readTime: "2 min read",
      featured: false,
    },
    {
      id: 5,
      title: "KAI Raih Penghargaan Perusahaan Transportasi Terbaik 2024",
      excerpt:
        "PT KAI meraih penghargaan sebagai perusahaan transportasi terbaik tahun 2024 dari Kementerian Perhubungan.",
      content:
        "Penghargaan ini diberikan atas inovasi dan kontribusi KAI dalam mengembangkan sistem transportasi darat di Indonesia...",
      date: "28 November 2024",
      author: "Tim Corporate KAI",
      category: "corporate",
      image: "/images/news-5.jpg",
      readTime: "3 min read",
      featured: false,
    },
    {
      id: 6,
      title: "Pembaruan Jadwal Perjalanan Kereta Mulai Desember 2024",
      excerpt:
        "Penyesuaian jadwal perjalanan kereta api efektif mulai 1 Desember 2024 untuk meningkatkan efisiensi operasional.",
      content:
        "Dalam upaya meningkatkan efisiensi dan kenyamanan layanan, KAI melakukan penyesuaian jadwal perjalanan pada 15 rute utama...",
      date: "25 November 2024",
      author: "Tim Operasional KAI",
      category: "pengumuman",
      image: "/images/news-6.jpg",
      readTime: "2 min read",
      featured: false,
    },
  ];

  const filteredNews = news.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = news.filter((item) => item.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Berita & Media
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Update terbaru seputar layanan, pengumuman operasional, dan
            perkembangan KAI
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Berita Utama
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
                >
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-gray-400" />
                    {/* In real app: <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> */}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {article.date}
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News Filter & Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-gray-400" />
                  {/* In real app: <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> */}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {article.date}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {article.author}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tidak ada berita ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Muat Lebih Banyak Berita
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Dapatkan Update Terbaru</h2>
          <p className="text-green-100 mb-8 text-lg">
            Berlangganan newsletter untuk mendapatkan informasi promo, berita,
            dan pengumuman terbaru dari KAI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-300 focus:border-transparent"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold">
              Berlangganan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
