import { useState } from "react";
import {
  Calendar,
  User,
  ArrowRight,
  Search,
  Filter,
  Clock,
  Share2,
  Bookmark,
  Eye,
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
    { id: "keselamatan", name: "Keselamatan" },
    { id: "perjalanan", name: "Tips Perjalanan" },
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
      views: 1245,
      shares: 89,
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
      featured: true,
      views: 987,
      shares: 45,
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
      featured: false,
      views: 1567,
      shares: 112,
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
      views: 2341,
      shares: 167,
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
      views: 1876,
      shares: 78,
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
      views: 1456,
      shares: 63,
    },
    {
      id: 7,
      title: "Teknologi Terbaru Sistem Pengereman Kereta Cepat di Indonesia",
      excerpt:
        "Implementasi sistem pengereman regeneratif pada kereta cepat untuk efisiensi energi yang lebih baik.",
      content:
        "Sistem pengereman regeneratif memungkinkan kereta cepat untuk menghemat energi hingga 30% dengan mengubah energi pengereman menjadi listrik...",
      date: "20 November 2024",
      author: "Tim Teknologi KAI",
      category: "teknologi",
      image: "/images/news-7.jpg",
      readTime: "5 min read",
      featured: false,
      views: 1987,
      shares: 134,
    },
    {
      id: 8,
      title: "Tips Aman Bepergian dengan Kereta Selama Musim Hujan",
      excerpt:
        "Panduan lengkap untuk penumpang dalam mempersiapkan perjalanan kereta selama musim penghujan.",
      content:
        "Musim hujan memerlukan persiapan ekstra bagi penumpang kereta. Berikut tips untuk memastikan perjalanan Anda tetap nyaman dan aman...",
      date: "18 November 2024",
      author: "Tim Keselamatan KAI",
      category: "perjalanan",
      image: "/images/news-8.jpg",
      readTime: "4 min read",
      featured: false,
      views: 2765,
      shares: 201,
    },

    {
      id: 9,
      title: "Peningkatan Keamanan di Stasiun Besar Selama Libur Nataru",
      excerpt:
        "KAI meningkatkan keamanan di stasiun besar untuk memastikan kenyamanan penumpang selama musim liburan Nataru.",
      content:
        "Dengan penambahan petugas keamanan dan teknologi canggih, KAI berkomitmen memberikan pengalaman perjalanan yang aman...",
      date: "9 Desember 2024",
      author: "Tim Keselamatan KAI",
      category: "keselamatan",
      image: "/images/news-9.jpg",
      readTime: "3 min read",
      featured: true,
      views: 850,
      shares: 30,
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
  const trendingNews = news.slice(0, 4).sort((a, b) => b.views - a.views);

  const formatNumber = (num: any) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "rb";
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Berita & Informasi KAI
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Update terbaru seputar layanan, pengumuman operasional, dan
            perkembangan Kereta Api Indonesia
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Featured News */}
            {featuredNews.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Berita Utama
                  </h2>
                  <div className="w-32 h-1 bg-green-600"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredNews.map((article, index) => (
                    <div
                      key={article.id}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer border ${
                        index === 0 ? "lg:col-span-2" : ""
                      }`}
                    >
                      <div
                        className={`flex flex-col ${
                          index === 0 ? "lg:flex-row" : ""
                        }`}
                      >
                        <div
                          className={`${
                            index === 0 ? "lg:w-1/2" : "h-48"
                          } bg-gray-200 flex items-center justify-center relative`}
                        >
                          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {article.category}
                          </div>
                          <Calendar className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className={`p-6 ${index === 0 ? "lg:w-1/2" : ""}`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500">
                              {article.date}
                            </span>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Clock className="h-4 w-4 mr-1" />
                              {article.readTime}
                            </div>
                          </div>
                          <h3
                            className={`font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors ${
                              index === 0 ? "text-2xl" : "text-xl"
                            }`}
                          >
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-500 text-sm">
                              <User className="h-4 w-4 mr-1" />
                              {article.author}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {formatNumber(article.views)}
                              </div>
                              <button className="flex items-center hover:text-green-600">
                                <Share2 className="h-4 w-4 mr-1" />
                                {formatNumber(article.shares)}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* News Filter & Search */}
            <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari berita KAI..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto  no-scrollbar">
                  <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                        selectedCategory === category.id
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* News Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "all"
                    ? "Semua Berita"
                    : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-gray-500 text-sm">
                  Menampilkan {filteredNews.length} berita
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNews.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {article.category}
                      </div>
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">
                          {article.date}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {article.readTime}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {article.author}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-xs text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            {formatNumber(article.views)}
                          </div>
                          <button className="text-gray-400 hover:text-green-600 transition-colors">
                            <Bookmark className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-green-600 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredNews.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Tidak ada berita ditemukan
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Coba ubah kata kunci pencarian atau pilih kategori yang
                    berbeda
                  </p>
                </div>
              )}

              {/* Load More Button */}
              {filteredNews.length > 0 && (
                <div className="text-center mt-12">
                  <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg">
                    Muat Lebih Banyak Berita
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:w-1/3 space-y-8">
            {/* Trending News */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Trending</h3>
                <div className="w-12 h-1 bg-green-600"></div>
              </div>
              <div className="space-y-4">
                {trendingNews.map((article, index) => (
                  <div
                    key={article.id}
                    className="flex items-start space-x-3 group cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                        {article.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatNumber(article.views)} views
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Categories */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Kategori Berita
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex justify-between items-center ${
                      selectedCategory === category.id
                        ? "bg-green-50 text-green-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-400">
                      {
                        news.filter((item) => item.category === category.id)
                          .length
                      }
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Newsletter Subscription */}
            <section className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Newsletter KAI</h3>
              <p className="text-green-100 mb-4 text-sm leading-relaxed">
                Dapatkan update terbaru seputar promo, berita, dan pengumuman
                langsung di email Anda
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="w-full bg-white px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-300 focus:outline-none text-sm"
                />
                <button className="w-full bg-white text-green-600 px-4 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold text-sm">
                  Berlangganan Sekarang
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">KAI</span>
                </div>
                <span className="font-bold text-lg">KAI News</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sumber informasi terpercaya seputar Kereta Api Indonesia dan
                perkembangan transportasi darat.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kategori</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {categories.slice(1).map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className="hover:text-green-400 transition-colors"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tautan Cepat</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Kontak
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 021-121</li>
                <li>✉️ contact@kai.id</li>
                <li>🏢 Gedung KAI, Jakarta</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2024 PT Kereta Api Indonesia (Persero). All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsPage;
