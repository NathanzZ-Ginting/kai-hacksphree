import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("tiket");
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = {
    tiket: {
      name: "Tiket & Pemesanan",
      icon: "🎫",
    },
    pembatalan: {
      name: "Pembatalan & Refund",
      icon: "🔄",
    },
    perjalanan: {
      name: "Perjalanan & Keberangkatan",
      icon: "🚆",
    },
    kebijakan: {
      name: "Kebijakan & Ketentuan",
      icon: "📋",
    },
  };

  const faqs = [
    {
      id: 1,
      question: "Bagaimana cara memesan tiket kereta online?",
      answer:
        "Anda dapat memesan tiket melalui website KAI atau aplikasi mobile. Pilih stasiun asal dan tujuan, tanggal keberangkatan, jumlah penumpang, lalu ikuti proses pembayaran.",
      category: "tiket",
    },
    {
      id: 2,
      question: "Apa saja metode pembayaran yang diterima?",
      answer:
        "KAI menerima berbagai metode pembayaran termasuk transfer bank, kartu kredit/debit, e-wallet (GoPay, OVO, Dana), dan pembayaran di minimarket.",
      category: "tiket",
    },
    {
      id: 3,
      question: "Bagaimana prosedur pembatalan tiket?",
      answer:
        "Pembatalan dapat dilakukan melalui website atau aplikasi sebelum waktu keberangkatan. Biaya pembatalan tergantung pada waktu pembatalan dan jenis tiket.",
      category: "pembatalan",
    },
    {
      id: 4,
      question: "Berapa lama proses refund berlangsung?",
      answer:
        "Proses refund biasanya memakan waktu 7-14 hari kerja tergantung metode pembayaran yang digunakan.",
      category: "pembatalan",
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
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pertanyaan Umum
          </h2>
          <p className="text-xl text-gray-600">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeCategory === key
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
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
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openItems.includes(faq.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openItems.includes(faq.id) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12 p-8 bg-white rounded-2xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Butuh Bantuan Lainnya?
          </h3>
          <p className="text-gray-600 mb-6">
            Tim customer service kami siap membantu Anda 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
              Hubungi Customer Service
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
