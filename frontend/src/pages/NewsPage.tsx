import { useState } from "react";
import {
  User,
  Search,
  Filter,
  Clock,
  Share2,
  Bookmark,
  Eye,
  ChevronDown,
  TrendingUp,
  Calendar,
  ArrowRight,
  Bell,
  Star,
} from "lucide-react";

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&h=300&fit=crop&auto=format",
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
      image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&h=300&fit=crop&auto=format",
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
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop&auto=format",
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
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=300&fit=crop&auto=format",
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
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop&auto=format",
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
      image: "https://via.placeholder.com/500x300/FF6B35/FFFFFF?text=Jadwal+Kereta",
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
      image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=500&h=300&fit=crop&auto=format",
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
      image: "https://via.placeholder.com/500x300/DC2626/FFFFFF?text=Tips+Perjalanan",
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
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop&auto=format",
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-900 via-red-900 to-amber-900 text-white py-16 md:py-24 overflow-hidden">
        {/* Unique animated pattern for news page */}
        <div className="absolute inset-0 opacity-5">
          {/* Geometric shapes instead of circles */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white transform rotate-45 animate-pulse"></div>
          <div className="absolute top-1/4 right-20 w-24 h-24 bg-white rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 left-1/4 w-40 h-8 bg-white transform -rotate-12 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-white transform rotate-45 animate-pulse delay-1500"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white rounded-full animate-pulse delay-2000"></div>
          
          {/* Train track inspired lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-20"></div>
          <div className="absolute top-4 left-0 w-full h-1 bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-20"></div>
          <div className="absolute bottom-4 left-0 w-full h-1 bg-white opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Berita KAI Terkini
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-orange-100 max-w-4xl mx-auto mb-12 leading-relaxed">
              Informasi terdepan seputar layanan, inovasi, dan perkembangan 
              Kereta Api Indonesia untuk Indonesia yang lebih maju
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-orange-200 text-sm lg:text-base">Berita Minggu Ini</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">8</div>
                <div className="text-orange-200 text-sm lg:text-base">Kategori Berita</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">100K+</div>
                <div className="text-orange-200 text-sm lg:text-base">Pembaca Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-orange-200 text-sm lg:text-base">Update Real-time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Enhanced News Filter & Search */}
            <section className="mb-8 bg-white rounded-3xl shadow-lg p-6 lg:p-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search */}
                <div className="relative w-full lg:w-96">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${searchTerm ? 'text-orange-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Cari berita, pengumuman, atau informasi..."
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 font-medium text-gray-900 placeholder-gray-500 ${searchTerm ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Category Filter - Desktop */}
                <div className="hidden lg:flex items-center space-x-3 overflow-x-auto w-full lg:w-auto no-scrollbar">
                  <div className="flex items-center space-x-2 text-gray-600 flex-shrink-0">
                    <Filter className="h-5 w-5" />
                    <span className="font-medium text-sm">Filter:</span>
                  </div>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden w-full">
                  <button
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 rounded-2xl text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center font-medium">
                      <Filter className="h-5 w-5 mr-3 text-gray-400" />
                      Filter: {categories.find(c => c.id === selectedCategory)?.name || 'Semua'}
                    </span>
                    <ChevronDown className={`h-5 w-5 transform transition-transform duration-300 ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Mobile Categories */}
                  {mobileFiltersOpen && (
                    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-lg">
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setMobileFiltersOpen(false);
                            }}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              selectedCategory === category.id
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Search Results Info */}
              {searchTerm && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Search className="h-4 w-4 mr-2" />
                    <span>
                      Menampilkan <span className="font-semibold text-orange-600">{filteredNews.length}</span> hasil 
                      untuk "<span className="font-semibold">{searchTerm}</span>"
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Enhanced Featured News */}
            {featuredNews.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Berita Utama
                      </h2>
                      <p className="text-gray-600 mt-1">Informasi terpenting dan terdepan</p>
                    </div>
                  </div>
                  <div className="hidden lg:block w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                </div>
                
                <div className="space-y-8">
                  {featuredNews.map((article, index) => (
                    <article
                      key={article.id}
                      className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 ${
                        index === 0 ? "lg:min-h-[500px]" : ""
                      }`}
                    >
                      <div className={`flex ${index === 0 ? "flex-col lg:flex-row" : "flex-col md:flex-row"}`}>
                        <div className={`relative overflow-hidden ${
                          index === 0 
                            ? "h-64 lg:h-auto lg:w-1/2" 
                            : "h-48 md:h-40 md:w-2/5"
                        }`}>
                          <div className="absolute top-4 left-4 z-20">
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                              {categories.find(c => c.id === article.category)?.name || article.category}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4 z-20">
                            <button className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-orange-600 hover:bg-white transition-all">
                              <Bookmark className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="bg-gradient-to-br from-orange-100 to-red-100 w-full h-full flex items-center justify-center">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                        </div>
                        
                        <div className={`p-6 lg:p-8 ${
                          index === 0 
                            ? "lg:w-1/2 flex flex-col justify-center" 
                            : "md:w-3/5 flex flex-col justify-center"
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {article.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {article.readTime}
                              </div>
                            </div>
                          </div>
                          
                          <h3 className={`font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300 leading-tight ${
                            index === 0 ? "text-2xl lg:text-4xl" : "text-xl lg:text-2xl"
                          }`}>
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-gray-500 text-sm">
                                <User className="h-4 w-4 mr-2" />
                                {article.author}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {formatNumber(article.views)}
                                </div>
                                <button className="flex items-center hover:text-orange-600 transition-colors">
                                  <Share2 className="h-4 w-4 mr-1" />
                                  {formatNumber(article.shares)}
                                </button>
                              </div>
                              
                              <button className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group-hover:translate-x-2 transition-all duration-300">
                                <span>Baca Selengkapnya</span>
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Enhanced News Grid */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {selectedCategory === "all"
                      ? "Semua Berita"
                      : categories.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600">
                    Menampilkan <span className="font-semibold text-orange-600">{filteredNews.length}</span> berita terbaru
                  </p>
                </div>
                
                <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Diperbarui setiap hari</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredNews.map((article) => (
                  <article
                    key={article.id}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 transform hover:-translate-y-2"
                  >
                    <div className="relative h-48 lg:h-56 overflow-hidden">
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {categories.find(c => c.id === article.category)?.name || article.category}
                        </span>
                      </div>
                      
                      <div className="absolute top-4 right-4 z-20 flex space-x-2">
                        <button className="w-8 h-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-orange-600 transition-all">
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-br from-orange-100 to-red-100 w-full h-full flex items-center justify-center relative">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {article.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {article.readTime}
                        </div>
                      </div>

                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-2" />
                          <span className="truncate">{article.author}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-xs text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            {formatNumber(article.views)}
                          </div>
                          <button className="text-gray-400 hover:text-orange-600 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button className="w-full inline-flex items-center justify-center text-orange-600 hover:text-orange-700 font-semibold text-sm group-hover:translate-x-2 transition-all duration-300">
                          <span>Baca Selengkapnya</span>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredNews.length === 0 && (
                <div className="col-span-full text-center py-16 bg-white rounded-3xl shadow-lg">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Tidak ada berita ditemukan
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
                    Coba ubah kata kunci pencarian atau pilih kategori yang
                    berbeda untuk menemukan berita yang Anda cari
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              {/* Enhanced Load More Button */}
              {filteredNews.length > 0 && (
                <div className="text-center mt-12">
                  <button className="group bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg inline-flex items-center space-x-3 transform hover:scale-105">
                    <span>Muat Berita Lainnya</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-gray-500 text-sm mt-4">
                    Tekan untuk memuat 10 berita terbaru lainnya
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Trending News */}
            <section className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Trending</h3>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              </div>
              
              <div className="space-y-6">
                {trendingNews.map((article, index) => (
                  <div
                    key={article.id}
                    className="group flex items-start space-x-4 cursor-pointer p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight mb-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {formatNumber(article.views)} views
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="w-full text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center justify-center group">
                  <span>Lihat Semua Trending</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>

            {/* Enhanced Categories */}
            <section className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                <Filter className="h-5 w-5 mr-3 text-orange-600" />
                Kategori Berita
              </h3>
              
              <div className="space-y-3">
                {categories.map((category) => {
                  const count = category.id === 'all' 
                    ? news.length 
                    : news.filter((item) => item.category === category.id).length;
                    
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-4 rounded-2xl transition-all duration-300 flex justify-between items-center group ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105"
                          : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? "bg-white bg-opacity-20 text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Enhanced Newsletter */}
            <section className="relative bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 rounded-3xl shadow-2xl p-6 lg:p-8 text-white overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Newsletter KAI</h3>
                    <p className="text-orange-100 text-sm">Update harian langsung ke email</p>
                  </div>
                </div>
                
                <p className="text-orange-100 mb-6 text-sm leading-relaxed">
                  Dapatkan berita terbaru, pengumuman penting, dan promo eksklusif 
                  langsung di kotak masuk Anda setiap hari.
                </p>
                
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Masukkan alamat email Anda"
                    className="w-full bg-white px-4 py-4 rounded-2xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-300 focus:outline-none text-sm border border-orange-200 shadow-lg"
                  />
                  <button className="w-full bg-white text-orange-600 px-4 py-4 rounded-2xl hover:bg-orange-50 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
                    Berlangganan Gratis
                  </button>
                </div>
                
                <div className="mt-4 flex items-center text-xs text-orange-100">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>Gratis • Tanpa Spam • Bisa Unsubscribe Kapan Saja</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
