import { useState } from "react";
import axios from "axios";
import {
  X,
  Search,
  FileText,
  User,
  Calendar,
} from "lucide-react";

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

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceModal = ({ isOpen, onClose }: InvoiceModalProps) => {
  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const API_URL =
    import.meta.env.API_URL || "http://localhost:3000/api/v1";

  const handleCheckInvoice = async () => {
    if (!invoiceId.trim()) {
      setError("Masukkan kode booking / invoice number");
      return;
    }

    setLoading(true);
    setError("");
    setInvoiceData(null);

    try {
      const response = await axios.get<ApiResponse>(
        `${API_URL}/master-data/order-ticket/${invoiceId.trim()}`
      );

      if (response.data.success && response.data.data.length > 0) {
        setInvoiceData(response.data.data[0]);
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

  const handleClose = () => {
    setInvoiceId("");
    setError("");
    setInvoiceData(null);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "Lunas";
      case "pending":
        return "Menunggu Pembayaran";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Cek Status Booking
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Masukkan kode booking atau invoice number
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Search Form */}
            {!invoiceData && (
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={invoiceId}
                      onChange={(e) => setInvoiceId(e.target.value)}
                      placeholder="Masukkan kode booking / invoice number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-colors text-gray-700"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleCheckInvoice();
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleCheckInvoice}
                    disabled={loading}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                    <span>{loading ? "Memeriksa..." : "Cek"}</span>
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-700">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">!</span>
                      </div>
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Invoice Data */}
            {invoiceData && (
              <div className="space-y-6">
                {/* Status Banner */}
                <div
                  className={`p-4 rounded-lg border-2 ${getStatusColor(
                    invoiceData.status
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {getStatusText(invoiceData.status)}
                      </h4>
                      <p className="text-sm opacity-80 mt-1">
                        Invoice: {invoiceData.invoiceNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatPrice(invoiceData.totalPrice)}
                      </div>
                      <p className="text-sm opacity-80">
                        {invoiceData.numberOfPassanger} penumpang
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detail Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <User className="h-5 w-5 text-orange-600" />
                      <span>Informasi Pesanan</span>
                    </h5>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nomor Invoice:</span>
                        <span className="font-medium">
                          {invoiceData.invoiceNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jumlah Penumpang:</span>
                        <span className="font-medium">
                          {invoiceData.numberOfPassanger} orang
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Harga:</span>
                        <span className="font-medium text-orange-600">
                          {formatPrice(invoiceData.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <span>Waktu Transaksi</span>
                    </h5>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal Pesan:</span>
                        <span className="font-medium text-right">
                          {formatDate(invoiceData.orderDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status Terakhir:</span>
                        <span className="font-medium">
                          {formatDate(invoiceData.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setInvoiceData(null);
                      setInvoiceId("");
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cek Invoice Lain
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
