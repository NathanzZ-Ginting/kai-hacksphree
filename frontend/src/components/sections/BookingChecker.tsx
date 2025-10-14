// components/sections/BookingChecker.tsx
import { useState } from "react";
import axios from "axios";
import { Search, FileText } from "lucide-react";
import InvoiceModal from "../ui/InvoiceModal";

// Types untuk response invoice
interface InvoiceData {
  uuid: string;
  userId: string;
  invoiceNumber: string;
  status: string;
  numberOfPassanger: number;
  orderDate: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: InvoiceData[];
}

const BookingChecker = () => {
  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

  const handleCheckInvoice = async () => {
    if (!invoiceId.trim()) {
      setError("Masukkan kode booking / invoice number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Ambil userUuid dari localStorage dengan penanganan error yang konsisten
      const userDataString = localStorage.getItem("userData");

      if (!userDataString) {
        setError("User data tidak ditemukan. Silakan login kembali.");
        return;
      }

      let userUuid: string;

      try {
        const userData = JSON.parse(userDataString);
        userUuid = userData.uuid;

        if (!userUuid || typeof userUuid !== "string") {
          throw new Error("UUID tidak valid");
        }
      } catch (parseError) {
        console.error("Error parsing userData:", parseError);
        setError("Format user data tidak valid. Silakan login kembali.");
        return;
      }

      const response = await axios.get<ApiResponse>(
        `${API_URL}/master-data/order-ticket/${invoiceId.trim()}`
      );

      if (response.data.success && response.data.data.length > 0) {
        const invoice = response.data.data[0];

        // Validasi userId dengan userUuid yang sudah diambil dari localStorage
        if (invoice.userId !== userUuid) {
          setError("Tiket tidak ditemukan atau tidak terkait dengan akun Anda");
          return;
        }

        setInvoiceData(invoice);
        setIsModalOpen(true);
      } else {
        setError("Invoice tidak ditemukan");
      }
    } catch (err: any) {
      console.error("Error fetching invoice:", err);
      if (err.response?.status === 404) {
        setError("Invoice tidak ditemukan");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan saat memeriksa invoice");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInvoiceData(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheckInvoice();
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cek Status Booking Anda
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Masukkan kode booking atau invoice number untuk melihat status
            pemesanan tiket kereta api Anda
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan kode booking / invoice number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-colors text-gray-700 text-center sm:text-left"
              />
            </div>
            <button
              onClick={handleCheckInvoice}
              disabled={loading}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium whitespace-nowrap flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span>{loading ? "Memeriksa..." : "Cek Status"}</span>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Butuh bantuan? Hubungi customer service kami di 121
            </p>
          </div>
        </div>
      </div>

      <InvoiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        invoiceData={invoiceData}
      />
    </section>
  );
};

export default BookingChecker;