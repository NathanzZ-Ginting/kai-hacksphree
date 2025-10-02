// pages/HelpPage.tsx
import { useState } from "react";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Download,
  Clock,
  Users,
  Ticket,
  X,
} from "lucide-react";

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState("tiket");
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = {
    tiket: {
      name: "Tiket & Pemesanan",
      icon: "🎫",
      description:
        "Pertanyaan seputar pemesanan tiket, pembayaran, dan konfirmasi",
    },
    pembatalan: {
      name: "Pembatalan & Refund",
      icon: "🔄",
      description: "Prosedur pembatalan tiket dan pengembalian dana",
    },
    perjalanan: {
      name: "Perjalanan & Keberangkatan",
      icon: "🚆",
      description: "Informasi keberangkatan, kedatangan, dan fasilitas kereta",
    },
    kebijakan: {
      name: "Kebijakan & Ketentuan",
      icon: "📋",
      description: "Syarat dan ketentuan layanan KAI",
    },
    teknis: {
      name: "Masalah Teknis",
      icon: "🔧",
      description: "Kendala teknis website dan aplikasi",
    },
  };

  const faqs = [
    // Tiket & Pemesanan
    {
      id: 1,
      question: "Bagaimana cara memesan tiket kereta online?",
      answer:
        "Anda dapat memesan tiket melalui website KAI atau aplikasi mobile KAI Access. Pilih stasiun asal dan tujuan, tanggal keberangkatan, jumlah penumpang, lalu ikuti proses pembayaran. Setelah pembayaran berhasil, e-ticket akan dikirim ke email Anda.",
      category: "tiket",
    },
    {
      id: 2,
      question: "Apa saja metode pembayaran yang diterima?",
      answer:
        "KAI menerima berbagai metode pembayaran termasuk transfer bank (BCA, Mandiri, BNI, BRI), kartu kredit/debit (Visa, MasterCard), e-wallet (GoPay, OVO, Dana, LinkAja), dan pembayaran di minimarket (Alfamart, Indomaret).",
      category: "tiket",
    },
    {
      id: 3,
      question: "Berapa batas waktu pembayaran setelah memesan tiket?",
      answer:
        "Batas waktu pembayaran adalah 2 jam setelah pemesanan untuk pembayaran online, dan 24 jam untuk pembayaran via minimarket. Jika melebihi batas waktu, pemesanan akan dibatalkan otomatis.",
      category: "tiket",
    },
    // Pembatalan & Refund
    {
      id: 4,
      question: "Bagaimana prosedur pembatalan tiket?",
      answer:
        "Pembatalan dapat dilakukan melalui website atau aplikasi sebelum waktu keberangkatan. Login ke akun Anda, pilih tiket yang ingin dibatalkan, dan ikuti proses pembatalan. Biaya pembatalan tergantung pada waktu pembatalan dan jenis tiket.",
      category: "pembatalan",
    },
    {
      id: 5,
      question: "Berapa lama proses refund berlangsung?",
      answer:
        "Proses refund biasanya memakan waktu 7-14 hari kerja tergantung metode pembayaran yang digunakan. Untuk kartu kredit, refund akan dikembalikan ke kartu yang sama. Untuk transfer bank, dana akan dikembalikan ke rekening Anda.",
      category: "pembatalan",
    },
    // Perjalanan & Keberangkatan
    {
      id: 6,
      question:
        "Berapa jam sebelum keberangkatan saya harus datang ke stasiun?",
      answer:
        "Disarankan datang 1-2 jam sebelum keberangkatan untuk proses check-in dan pemeriksaan tiket. Untuk kereta bandara dan kereta jarak jauh, disarankan datang lebih awal.",
      category: "perjalanan",
    },
    {
      id: 7,
      question: "Apa saja barang yang tidak boleh dibawa ke dalam kereta?",
      answer:
        "Barang yang dilarang antara lain: senjata tajam, bahan mudah terbakar, bahan kimia berbahaya, narkoba, dan barang ilegal lainnya. Untuk barang berharga, disarankan untuk selalu dijaga.",
      category: "perjalanan",
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Center",
      description: "Hubungi kami 24/7",
      contact: "121",
      subtitle: "Gratis dari telepon rumah dan HP",
      action: "Hubungi Sekarang",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat dengan customer service",
      contact: "Tersedia 08.00 - 22.00 WIB",
      subtitle: "Respon cepat via chat",
      action: "Mulai Chat",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Kirim pertanyaan via email",
      contact: "customer@kai.id",
      subtitle: "Respon dalam 24 jam",
      action: "Kirim Email",
    },
  ];

  const quickLinks = [
    {
      icon: FileText,
      title: "Syarat & Ketentuan",
      description: "Ketentuan penggunaan layanan KAI",
    },
    {
      icon: Download,
      title: "Download Aplikasi",
      description: "Dapatkan aplikasi KAI Access",
    },
    {
      icon: Users,
      title: "Status Keberangkatan",
      description: "Cek jadwal kereta real-time",
    },
    {
      icon: Ticket,
      title: "Cek Tiket",
      description: "Verifikasi tiket Anda",
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.category === activeCategory &&
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Pusat Bantuan</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Temukan solusi untuk pertanyaan dan kendala Anda
          </p>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pertanyaan atau masalah..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickLinks.map((link, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <link.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </div>
            ))}
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-100"
              >
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {method.contact}
                </div>
                <p className="text-sm text-gray-500 mb-4">{method.subtitle}</p>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan Umum
            </h2>
            <p className="text-xl text-gray-600">
              Temukan jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeCategory === key
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Category Description */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {
                categories[activeCategory as keyof typeof categories]
                  .description
              }
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4 text-lg">
                    {faq.question}
                  </span>
                  {openItems.includes(faq.id) ? (
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-0.5 bg-purple-600"></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 border-r-2 border-b-2 border-purple-600 transform rotate-45 translate-y-[-1px]"></div>
                    </div>
                  )}
                </button>

                {openItems.includes(faq.id) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tidak ada pertanyaan ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah kata kunci pencarian atau pilih kategori lain
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Masih Butuh Bantuan?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tim customer service kami siap membantu Anda dengan senang hati
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Mulai Live Chat
            </button>
            <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              Hubungi Call Center
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;
