import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share,
  Bookmark,
  Eye,
} from "lucide-react";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);

  // Data artikel lengkap - dalam real application, ini bisa dari API
  const articlesData = [
    {
      id: "1",
      title: "Cara Memesan Tiket Kereta Online",
      category: "Pemesanan",
      reads: "12.4K",
      date: "15 November 2023",
      author: "Tim KAI",
      readTime: "5 menit baca",
      content: `
        <h2>Langkah-langkah Memesan Tiket Kereta Online</h2>
        
        <p>Memesan tiket kereta secara online melalui website KAI atau aplikasi KAI Access sangat mudah dan praktis. Berikut panduan lengkapnya:</p>
        
        <h3>1. Akses Platform KAI</h3>
        <p>Buka website <strong>kai.id</strong> atau aplikasi <strong>KAI Access</strong> yang bisa diunduh melalui Play Store atau App Store.</p>
        
        <h3>2. Pilih Rute Perjalanan</h3>
        <p>Isi informasi perjalanan Anda:</p>
        <ul>
          <li>Stasiun asal keberangkatan</li>
          <li>Stasiun tujuan</li>
          <li>Tanggal keberangkatan</li>
          <li>Jumlah penumpang (dewasa dan anak-anak)</li>
        </ul>
        
        <h3>3. Pilih Kereta dan Kelas</h3>
        <p>Setelah mencari, Anda akan melihat daftar kereta yang tersedia. Pilih kereta dan kelas yang diinginkan:</p>
        <ul>
          <li><strong>Eksekutif:</strong> Fasilitas terbaik dengan harga premium</li>
          <li><strong>Bisnis:</strong> Kenyamanan dengan harga terjangkau</li>
          <li><strong>Ekonomi:</strong> Pilihan hemat dengan fasilitas memadai</li>
        </ul>
        
        <h3>4. Isi Data Penumpang</h3>
        <p>Masukkan data lengkap penumpang:</p>
        <ul>
          <li>Nama lengkap (sesuai KTP)</li>
          <li>Nomor identitas</li>
          <li>Tanggal lahir</li>
          <li>Nomor telepon dan email</li>
        </ul>
        
        <h3>5. Pilih Kursi</h3>
        <p>Pilih kursi yang tersedia sesuai preferensi Anda. Sistem akan menampilkan denah kursi yang masih available.</p>
        
        <h3>6. Metode Pembayaran</h3>
        <p>Pilih metode pembayaran yang tersedia:</p>
        <ul>
          <li>Transfer Bank (BCA, Mandiri, BNI, BRI)</li>
          <li>Kartu Kredit/Debit</li>
          <li>E-Wallet (GoPay, OVO, Dana, LinkAja)</li>
          <li>Minimarket (Alfamart, Indomaret)</li>
        </ul>
        
        <h3>7. Konfirmasi dan E-Ticket</h3>
        <p>Setelah pembayaran berhasil, e-ticket akan dikirim ke email Anda. Simpan e-ticket untuk proses check-in di stasiun.</p>
        
        <div class="tips">
          <h4>💡 Tips Penting:</h4>
          <ul>
            <li>Pastikan data penumpang sesuai dengan dokumen identitas</li>
            <li>Lakukan pembayaran sebelum batas waktu yang ditentukan</li>
            <li>Download aplikasi KAI Access untuk kemudahan akses</li>
            <li>Simpan bukti pembayaran dan e-ticket</li>
          </ul>
        </div>
      `,
      relatedArticles: [
        {
          id: "2",
          title: "Panduan Pembatalan dan Refund Tiket",
          category: "Pembatalan",
        },
        {
          id: "4",
          title: "Cek Status Keberangkatan Kereta",
          category: "Informasi",
        },
      ],
    },
    {
      id: "2",
      title: "Panduan Pembatalan dan Refund Tiket",
      category: "Pembatalan",
      reads: "8.7K",
      date: "10 November 2023",
      author: "Tim Customer Service",
      readTime: "7 menit baca",
      content: `
        <h2>Prosedur Pembatalan dan Pengembalian Dana Tiket KAI</h2>
        
        <p>Berikut adalah panduan lengkap untuk pembatalan tiket dan proses refund yang berlaku di KAI.</p>
        
        <h3>Syarat Pembatalan Tiket</h3>
        <ul>
          <li>Tiket dapat dibatalkan minimal 2 jam sebelum keberangkatan</li>
          <li>Pembatalan dilakukan melalui website atau aplikasi KAI Access</li>
          <li>Refund hanya untuk tiket yang belum digunakan</li>
        </ul>
        
        <h3>Biaya Pembatalan</h3>
        <p>Biaya administrasi pembatalan bervariasi berdasarkan waktu pembatalan:</p>
        <ul>
          <li>Lebih dari 24 jam: 25% dari harga tiket</li>
          <li>2-24 jam sebelum keberangkatan: 50% dari harga tiket</li>
          <li>Kurang dari 2 jam: Tidak dapat dibatalkan</li>
        </ul>
        
        <h3>Proses Refund</h3>
        <p>Dana akan dikembalikan dalam waktu 7-14 hari kerja ke metode pembayaran awal.</p>
      `,
      relatedArticles: [
        {
          id: "1",
          title: "Cara Memesan Tiket Kereta Online",
          category: "Pemesanan",
        },
        {
          id: "3",
          title: "Syarat dan Ketentuan Pembayaran",
          category: "Pembayaran",
        },
      ],
    },
    {
      id: "3",
      title: "Syarat dan Ketentuan Pembayaran",
      category: "Pembayaran",
      reads: "15.2K",
      date: "5 November 2023",
      author: "Tim Finance KAI",
      readTime: "6 menit baca",
      content: `
        <h2>Syarat dan Ketentuan Pembayaran Tiket KAI</h2>
        
        <p>Ketentuan lengkap mengenai metode pembayaran dan batas waktu yang berlaku.</p>
        
        <h3>Metode Pembayaran yang Diterima</h3>
        <ul>
          <li>Transfer Bank (berbagai bank tersedia)</li>
          <li>Kartu Kredit dan Debit</li>
          <li>E-Wallet populer</li>
          <li>Pembayaran di Minimarket</li>
        </ul>
        
        <h3>Batas Waktu Pembayaran</h3>
        <p>Setiap metode pembayaran memiliki batas waktu yang berbeda.</p>
      `,
      relatedArticles: [
        {
          id: "1",
          title: "Cara Memesan Tiket Kereta Online",
          category: "Pemesanan",
        },
        {
          id: "2",
          title: "Panduan Pembatalan dan Refund Tiket",
          category: "Pembatalan",
        },
      ],
    },
    {
      id: "4",
      title: "Cek Status Keberangkatan Kereta",
      category: "Informasi",
      reads: "23.1K",
      date: "20 November 2023",
      author: "Tim Operasional KAI",
      readTime: "4 menit baca",
      content: `
        <h2>Memantau Status Keberangkatan Kereta Secara Real-Time</h2>
        
        <p>Fitur untuk mengecek jadwal dan status keberangkatan kereta secara akurat.</p>
        
        <h3>Cara Cek Status</h3>
        <ul>
          <li>Melalui website KAI</li>
          <li>Aplikasi KAI Access</li>
          <li>Live chat customer service</li>
        </ul>
        
        <h3>Informasi yang Tersedia</h3>
        <p>Detail lengkap mengenai jadwal, delay, dan informasi penting lainnya.</p>
      `,
      relatedArticles: [
        {
          id: "1",
          title: "Cara Memesan Tiket Kereta Online",
          category: "Pemesanan",
        },
        {
          id: "5",
          title: "Fasilitas di Stasiun dan Kereta",
          category: "Fasilitas",
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulasi fetch data artikel berdasarkan ID
    const foundArticle = articlesData.find((art) => art.id === id);
    setArticle(foundArticle);

    // Scroll to top ketika artikel berubah
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Artikel tidak ditemukan
          </h2>
          <button
            onClick={() => navigate("/help")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Kembali ke Pusat Bantuan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white pt-16 pb-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/help")}
            className="flex items-center text-white font-medium mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Pusat Bantuan
          </button>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200 mb-4">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
              {article.category}
            </span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {article.date}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {article.readTime}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" /> {article.reads} dibaca
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {article.title}
          </h1>

          <div className="flex items-center gap-4">
            <button className="flex items-center text-gray-200">
              <Share className="h-5 w-5 mr-2" />
              Bagikan
            </button>
            <button className="flex items-center text-gray-200">
              <Bookmark className="h-5 w-5 mr-2" />
              Simpan
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Artikel Terkait
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {article.relatedArticles.map((related: any) => (
                <button
                  key={related.id}
                  onClick={() => navigate(`/article/${related.id}`)}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium mb-3 inline-block">
                    {related.category}
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {related.title}
                  </h4>
                  <p className="text-purple-600 font-medium text-sm flex items-center">
                    Baca selengkapnya
                    <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Butuh Bantuan Lebih Lanjut?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tim customer service kami siap membantu Anda 24/7 melalui berbagai
            channel yang tersedia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/help")}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Hubungi Customer Service
            </button>
            <button
              onClick={() => navigate("/help")}
              className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium cursor-pointer"
            >
              Kembali ke Pusat Bantuan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
