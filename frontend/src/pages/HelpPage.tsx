import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  Bot,
  ArrowRight,
  CheckCircle,
  Star,
  Search,
  Clock,
  Users,
  Shield,
  Headphones,
  BookOpen,
  ShoppingCart,
  CreditCard,
  X,
  Briefcase,
  Smartphone,
} from "lucide-react";
import ChatBot from "../components/ui/ChatBot";
import { useNavigate } from "react-router-dom";

const HelpPage = () => {
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Center",
      description: "Hubungi kami 24/7",
      contact: "121",
      subtitle: "Gratis dari telepon rumah dan HP",
      action: "Hubungi Sekarang",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat dengan customer service",
      contact: "08.00 - 22.00 WIB",
      subtitle: "Respon cepat via chat",
      action: "Mulai Chat",
      color: "from-red-500 to-orange-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Kirim pertanyaan via email",
      contact: "customer@kai.id",
      subtitle: "Respon dalam 24 jam",
      action: "Kirim Email",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
  ];

  const helpStats = [
    {
      icon: Users,
      number: "1M+",
      label: "Pengguna Terbantu",
      color: "text-orange-600",
    },
    {
      icon: Clock,
      number: "< 2 Min",
      label: "Waktu Respon",
      color: "text-red-600",
    },
    {
      icon: Shield,
      number: "99.9%",
      label: "Tingkat Kepuasan",
      color: "text-amber-600",
    },
    {
      icon: Headphones,
      number: "24/7",
      label: "Dukungan Online",
      color: "text-orange-600",
    },
  ];

  // quickLinks intentionally removed because not used in UI yet

  const popularArticles = [
    {
      title: "Cara Memesan Tiket Kereta Online",
      category: "Pemesanan",
      reads: "12.4K",
    },
    {
      title: "Panduan Pembatalan dan Refund Tiket",
      category: "Pembatalan",
      reads: "8.7K",
    },
    {
      title: "Syarat dan Ketentuan Pembayaran",
      category: "Pembayaran",
      reads: "15.2K",
    },
    {
      title: "Cek Status Keberangkatan Kereta",
      category: "Informasi",
      reads: "23.1K",
    },
  ];

  const quickQuestions = [
    {
      icon: ShoppingCart,
      question: "Cara memesan tiket kereta online?",
      answer:
        "Untuk memesan tiket kereta online:\n\n1. Buka website KAI atau aplikasi KAI Access\n2. Pilih stasiun asal dan tujuan\n3. Pilih tanggal keberangkatan\n4. Tentukan jumlah penumpang\n5. Pilih kelas kereta\n6. Lakukan pembayaran\n7. E-ticket akan dikirim ke email Anda\n\nButuh bantuan lebih lanjut?",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: CreditCard,
      question: "Metode pembayaran yang tersedia?",
      answer:
        "KAI menerima berbagai metode pembayaran:\n\n• Transfer Bank (BCA, Mandiri, BNI, BRI)\n• Kartu Kredit/Debit (Visa, MasterCard)\n• E-Wallet (GoPay, OVO, Dana, LinkAja)\n• Minimarket (Alfamart, Indomaret)\n\nBatas waktu pembayaran: 2 jam untuk online, 24 jam untuk minimarket.",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: X,
      question: "Cara membatalkan tiket?",
      answer:
        "Prosedur pembatalan tiket:\n\n1. Login ke akun KAI Access\n2. Pilih tiket yang ingin dibatalkan\n3. Ikuti proses pembatalan\n4. Konfirmasi pembatalan\n\nBiaya pembatalan tergantung waktu pembatalan. Refund membutuhkan 7-14 hari kerja.",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      icon: Clock,
      question: "Waktu datang ke stasiun?",
      answer:
        "Disarankan datang 1-2 jam sebelum keberangkatan untuk:\n\n• Check-in tiket\n• Pemeriksaan keamanan\n• Menemukan peron\n• Boarding yang nyaman\n\nUntuk kereta bandara dan jarak jauh, disarankan datang lebih awal.",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Briefcase,
      question: "Barang yang dilarang?",
      answer:
        "Barang yang tidak boleh dibawa:\n\n• Senjata tajam dan api\n• Bahan mudah terbakar\n• Bahan kimia berbahaya\n• Narkoba dan zat terlarang\n• Barang ilegal lainnya\n\nBarang berharga harap dijaga selama perjalanan.",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: Smartphone,
      question: "Download aplikasi KAI?",
      answer:
        "Download KAI Access di:\n\n• Play Store: 'KAI Access'\n• App Store: 'KAI Access'\n\nFitur aplikasi:\n• Pesan tiket\n• Cek jadwal\n• Pembatalan tiket\n• Notifikasi real-time\n• E-ticket digital",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  const handleContactSupport = () => {
    console.log("Redirect to customer service");
    setIsChatBotOpen(false);
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  // Filter questions based on search query
  const filteredQuestions = quickQuestions.filter((q) =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter articles based on search query
  const filteredArticles = popularArticles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-r from-orange-900 via-red-900 to-amber-900 text-white overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl mb-8">
              <img
              src="/kai.jpg"
              alt="Logo KAI"
              className="h-12 w-28 object-contain"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }}
              />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Pusat Bantuan KAI
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-orange-100 max-w-4xl mx-auto mb-12 leading-relaxed">
              Solusi cepat dan tepat untuk setiap pertanyaan perjalanan Anda. 
              Tim support kami siap membantu 24/7.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan atau topik bantuan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white bg-opacity-95 backdrop-blur-md border border-white border-opacity-50 rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all duration-300 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="text-center mt-3">
                  <span className="text-sm text-orange-100 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {filteredQuestions.length + filteredArticles.length} hasil ditemukan
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setIsChatBotOpen(true)}
                className="group bg-white text-orange-900 px-8 py-4 rounded-2xl font-semibold flex items-center justify-center text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Bot className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                Tanya AI Assistant
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-orange-900 transition-all duration-300">
                Hubungi Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {helpStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
                <div className="text-sm lg:text-base text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods - Modern Card Design */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">
              Cara Menghubungi Kami
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Pilih cara yang paling nyaman untuk mendapatkan bantuan dari tim support kami
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-slate-300 transform hover:-translate-y-2`}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 ${method.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className={`h-10 w-10 ${method.textColor}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{method.title}</h3>
                  <p className="text-slate-600 mb-4 text-lg">{method.description}</p>
                  
                  <div className={`text-3xl font-bold ${method.textColor} mb-2`}>
                    {method.contact}
                  </div>
                  <p className="text-slate-500 mb-8">{method.subtitle}</p>
                  
                  <button className={`w-full bg-gradient-to-r ${method.color} text-white py-4 px-6 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center text-lg`}>
                    {method.action}
                    <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles with Better Layout */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">
              Artikel Populer
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Panduan lengkap dan solusi yang paling sering dicari oleh pengguna KAI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-orange-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleArticleClick((index + 1).toString())}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm px-4 py-2 rounded-full font-semibold">
                      {article.category}
                    </span>
                    <div className="flex items-center text-slate-500 text-sm font-medium">
                      <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                      {article.reads} dibaca
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-4 text-xl lg:text-2xl group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                    {article.title}
                  </h3>
                  
                  <button className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-lg group-hover:translate-x-2 transition-transform duration-300">
                    Baca selengkapnya
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              ))
            ) : searchQuery && (
              <div className="col-span-1 lg:col-span-2 text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Artikel tidak ditemukan
                </h3>
                <p className="text-slate-600">
                  Tidak ada artikel yang sesuai dengan pencarian "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced AI Assistant Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-orange-500 via-red-600 to-amber-500 rounded-3xl lg:rounded-[3rem] p-1">
            <div className="bg-white rounded-3xl lg:rounded-[3rem] p-8 lg:p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Bot className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">
                KAI Assistant AI
              </h2>
              <p className="text-lg lg:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Teknologi AI terdepan untuk memberikan jawaban instan, akurat, dan personal. 
                Siap membantu Anda 24/7 dengan kecerdasan buatan terbaru.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Instant Response</h4>
                  <p className="text-slate-600">Jawaban dalam hitungan detik</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Akurat & Terpercaya</h4>
                  <p className="text-slate-600">Informasi valid dan terkini</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">24/7 Available</h4>
                  <p className="text-slate-600">Siap membantu kapan saja</p>
                </div>
              </div>

              <button
                onClick={() => setIsChatBotOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-5 rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-xl inline-flex items-center justify-center transform hover:scale-105"
              >
                <Bot className="h-7 w-7 mr-3 animate-pulse" />
                Mulai Chat dengan AI
                <ArrowRight className="h-6 w-6 ml-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">
              Pertanyaan Umum
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Temukan jawaban cepat untuk pertanyaan yang paling sering diajukan oleh pengguna
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setIsChatBotOpen(true)}
                  className="group bg-white rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl border border-slate-200 hover:border-orange-300 transition-all duration-500 text-left w-full transform hover:-translate-y-2"
                >
                  <div className="flex items-start space-x-4 w-full">
                    <div className={`w-12 h-12 ${q.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <q.icon className={`h-6 w-6 ${q.color}`} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors text-lg lg:text-xl leading-tight">
                        {q.question}
                      </h3>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {q.answer.split("\n")[0]}
                      </p>
                      <div className="mt-4 inline-flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                        <span className="text-sm">Tanya AI untuk detail lengkap</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-1 lg:col-span-2 text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Tidak ada hasil ditemukan
                </h3>
                <p className="text-slate-600 mb-6">
                  Coba kata kunci lain atau hubungi AI Assistant untuk bantuan lebih lanjut
                </p>
                <button
                  onClick={() => setIsChatBotOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Tanya AI Assistant
                </button>
              </div>
            )}
          </div>

          {/* CTA to view more FAQs */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Lihat Semua FAQ
            </button>
          </div>
        </div>
      </section>

      {/* ChatBot */}
      <ChatBot
        quickQuestions={quickQuestions}
        onContactSupport={handleContactSupport}
        isOpen={isChatBotOpen}
        onClose={() => setIsChatBotOpen(false)}
      />

      {/* Enhanced Floating Chat Button */}
      {!isChatBotOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsChatBotOpen(true)}
            className="group bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 lg:p-5 rounded-2xl lg:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-3 transform hover:scale-105 hover:-translate-y-1"
          >
            <Bot className="h-6 w-6 lg:h-7 lg:w-7 group-hover:animate-pulse" />
            <span className="font-semibold text-sm lg:text-base hidden sm:block">AI Assistant</span>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </button>
          
          {/* Floating hints */}
          <div className="absolute bottom-full right-0 mb-4 hidden lg:block">
            <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200 max-w-xs">
              <p className="text-sm text-slate-600 font-medium">
                💡 Tanya AI untuk bantuan instant!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;
