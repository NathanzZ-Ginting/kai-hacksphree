import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  CreditCard,
  Calendar,
  FileText,
  Shield,
  Copy,
} from "lucide-react";

// Types
interface OrderData {
  transaction_status: string;
  transaction_id: string;
  order_id: string;
  payment_type: string;
  transaction_time: string;
  gross_amount: string;
  fraud_status: string;
  status_code: string;
  status_message: string;
}

const SuccessOrderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const orderId = searchParams.get("order_id");
  const API_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

  // Fetch order data
  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!orderId) {
        setError("Order ID tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/payment/check-status/${orderId}`
        );

        if (response.data.success) {
          setOrderData(response.data.data);
        } else {
          setError(response.data.message || "Gagal memuat data order");
        }
      } catch (err: any) {
        console.error("Error fetching order status:", err);
        setError(
          err.response?.data?.message ||
            "Terjadi kesalahan saat memuat data order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "settlement":
      case "success":
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
      case "capture":
        return "bg-yellow-100 text-yellow-800";
      case "deny":
      case "cancel":
      case "expire":
      case "failure":
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "settlement":
        return "BERHASIL";
      case "pending":
        return "MENUNGGU PEMBAYARAN";
      case "capture":
        return "TERKAPAN";
      case "deny":
        return "DITOLAK";
      case "cancel":
        return "DIBATALKAN";
      case "expire":
        return "KADALUARSA";
      case "failure":
        return "GAGAL";
      default:
        return status.toUpperCase();
    }
  };

  const getPaymentTypeText = (type: string) => {
    switch (type.toLowerCase()) {
      case "qris":
        return "QRIS";
      case "bank_transfer":
        return "Transfer Bank";
      case "credit_card":
        return "Kartu Kredit";
      case "gopay":
        return "Gopay";
      case "shopeepay":
        return "ShopeePay";
      default:
        return type.toUpperCase();
    }
  };

  // Fungsi untuk menyalin order_id
  const copyOrderId = async () => {
    if (!orderData?.order_id) return;

    try {
      await navigator.clipboard.writeText(orderData.order_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks: ", err);
      const textArea = document.createElement("textarea");
      textArea.value = orderData.order_id;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Data Order Tidak Ditemukan
          </h3>
          <p className="text-gray-600 mb-6">
            Order ID yang diminta tidak valid atau telah kadaluarsa
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle className="h-20 w-20 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Pembayaran Berhasil!
          </h1>
          <p className="text-green-100 text-lg">
            Transaksi Anda telah berhasil diproses
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Order #{orderData.order_id}
                </h2>
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-gray-600 hover:text-gray-800"
                  title="Salin Order ID"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? "Tersalin!" : "Salin"}
                </button>
              </div>
              <p className="text-gray-600">
                Transaksi pada {formatDateTime(orderData.transaction_time)}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  orderData.transaction_status
                )}`}
              >
                {getStatusText(orderData.transaction_status)}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">
            Detail Transaksi
          </h3>

          {/* Transaction Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-gray-400" />
              <h4 className="font-semibold text-gray-900">
                Informasi Transaksi
              </h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ID Transaksi</span>
                <span className="font-medium text-gray-900 text-sm">
                  {orderData.transaction_id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {orderData.order_id}
                  </span>
                  <button
                    onClick={copyOrderId}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Salin Order ID"
                  >
                    <Copy className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-gray-900">
                  {getStatusText(orderData.transaction_status)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <h4 className="font-semibold text-gray-900">
                Informasi Pembayaran
              </h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Metode Pembayaran</span>
                <span className="font-medium text-gray-900">
                  {getPaymentTypeText(orderData.payment_type)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Waktu Transaksi</span>
                <span className="font-medium text-gray-900">
                  {formatDateTime(orderData.transaction_time)}
                </span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-gray-400" />
              <h4 className="font-semibold text-gray-900">Status Keamanan</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fraud Status</span>
                <span
                  className={`font-medium ${
                    orderData.fraud_status === "accept"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {orderData.fraud_status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <h4 className="font-semibold text-gray-900">
                Ringkasan Pembayaran
              </h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Pembayaran</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(orderData.gross_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium text-center cursor-pointer"
            >
              Pesan Tiket Lainnya
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center cursor-pointer"
            >
              Kembali ke Beranda
            </button>
            <button
              onClick={() => navigate("/help")}
              className="flex-1 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center cursor-pointer border border-gray-300"
            >
              Butuh Bantuan?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessOrderPage;
