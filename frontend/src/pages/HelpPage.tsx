import { useState } from "react";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Download,
  Users,
  Ticket,
  Bot,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import ChatBot from "../components/ui/ChatBot";
import { useNavigate } from "react-router-dom";

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Center",
      description: "Hubungi kami 24/7",
      contact: "121",
      subtitle: "Gratis dari telepon rumah dan HP",
      action: "Hubungi Sekarang",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat dengan customer service",
      contact: "08.00 - 22.00 WIB",
      subtitle: "Respon cepat via chat",
      action: "Mulai Chat",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Kirim pertanyaan via email",
      contact: "customer@kai.id",
      subtitle: "Respon dalam 24 jam",
      action: "Kirim Email",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const quickLinks = [
    {
      icon: FileText,
      title: "Syarat & Ketentuan",
      description: "Ketentuan penggunaan layanan KAI",
      link: "#",
    },
    {
      icon: Download,
      title: "Download Aplikasi",
      description: "Dapatkan aplikasi KAI Access",
      link: "#",
    },
    {
      icon: Users,
      title: "Status Keberangkatan",
      description: "Cek jadwal kereta real-time",
      link: "#",
    },
    {
      icon: Ticket,
      title: "Cek Tiket",
      description: "Verifikasi tiket Anda",
      link: "#",
    },
  ];

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
      question: "🛒 Cara memesan tiket kereta online?",
      answer:
        "Untuk memesan tiket kereta online:\n\n1. Buka website KAI atau aplikasi KAI Access\n2. Pilih stasiun asal dan tujuan\n3. Pilih tanggal keberangkatan\n4. Tentukan jumlah penumpang\n5. Pilih kelas kereta\n6. Lakukan pembayaran\n7. E-ticket akan dikirim ke email Anda\n\nButuh bantuan lebih lanjut?",
    },
    {
      question: "💳 Metode pembayaran yang tersedia?",
      answer:
        "KAI menerima berbagai metode pembayaran:\n\n• Transfer Bank (BCA, Mandiri, BNI, BRI)\n• Kartu Kredit/Debit (Visa, MasterCard)\n• E-Wallet (GoPay, OVO, Dana, LinkAja)\n• Minimarket (Alfamart, Indomaret)\n\nBatas waktu pembayaran: 2 jam untuk online, 24 jam untuk minimarket.",
    },
    {
      question: "❌ Cara membatalkan tiket?",
      answer:
        "Prosedur pembatalan tiket:\n\n1. Login ke akun KAI Access\n2. Pilih tiket yang ingin dibatalkan\n3. Ikuti proses pembatalan\n4. Konfirmasi pembatalan\n\nBiaya pembatalan tergantung waktu pembatalan. Refund membutuhkan 7-14 hari kerja.",
    },
    {
      question: "⏰ Waktu datang ke stasiun?",
      answer:
        "Disarankan datang 1-2 jam sebelum keberangkatan untuk:\n\n• Check-in tiket\n• Pemeriksaan keamanan\n• Menemukan peron\n• Boarding yang nyaman\n\nUntuk kereta bandara dan jarak jauh, disarankan datang lebih awal.",
    },
    {
      question: "🎒 Barang yang dilarang?",
      answer:
        "Barang yang tidak boleh dibawa:\n\n• Senjata tajam dan api\n• Bahan mudah terbakar\n• Bahan kimia berbahaya\n• Narkoba dan zat terlarang\n• Barang ilegal lainnya\n\nBarang berharga harap dijaga selama perjalanan.",
    },
    {
      question: "📱 Download aplikasi KAI?",
      answer:
        "Download KAI Access di:\n\n• Play Store: 'KAI Access'\n• App Store: 'KAI Access'\n\nFitur aplikasi:\n• Pesan tiket\n• Cek jadwal\n• Pembatalan tiket\n• Notifikasi real-time\n• E-ticket digital",
    },
  ];

  const handleContactSupport = () => {
    console.log("Redirect to customer service");
    setIsChatBotOpen(false);
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <Bot className="h-8 w-8 text-gray-800" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Pusat Bantuan KAI
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            Temukan solusi cepat untuk setiap pertanyaan dan kendala perjalanan
            Anda
          </p>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Butuh Bantuan Cepat?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pilih cara yang paling nyaman untuk menghubungi kami
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${method.color} text-white rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                <p className="opacity-90 mb-3">{method.description}</p>
                <div className="text-2xl font-bold mb-2">{method.contact}</div>
                <p className="text-sm opacity-80 mb-4">{method.subtitle}</p>
                <button className="w-full bg-white text-gray-900 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center justify-center">
                  {method.action}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Artikel Populer
            </h2>
            <p className="text-xl text-gray-600">
              Solusi yang paling sering dicari oleh pelanggan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
                onClick={() => handleArticleClick((index + 1).toString())}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
                    {article.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {article.reads}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  {article.title}
                </h3>
                <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center text-sm">
                  Baca selengkapnya
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-purple-100">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Coba KAI Assistant
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Dapatkan jawaban instan 24/7 dengan AI assistant kami. Cepat,
              akurat, dan siap membantu kapan saja.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setIsChatBotOpen(true)}
                className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center text-lg shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Bot className="h-6 w-6 mr-3" />
                Tanya KAI Assistant
              </button>
              <div className="flex items-center text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Gratis • 24/7 • Instant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pertanyaan Umum
            </h2>
            <p className="text-xl text-gray-600">
              Temukan jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => setIsChatBotOpen(true)}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-purple-200 transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0">
                    {q.question.split(" ")[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {q.question.substring(q.question.indexOf(" ") + 1)}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {q.answer.split("\n")[0]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
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

      {/* Floating Chat Button */}
      {!isChatBotOpen && (
        <button
          onClick={() => setIsChatBotOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2 hover:animate-none"
        >
          <Bot className="h-6 w-6" />
          <span className="font-medium">AI Assistant</span>
        </button>
      )}
    </div>
  );
};

export default HelpPage;
