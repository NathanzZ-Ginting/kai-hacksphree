// components/ui/InvoiceModal.tsx
import { useEffect } from "react";
import { X, User, Calendar } from "lucide-react";

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

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData | null;
}

const InvoiceModal = ({ isOpen, onClose, invoiceData }: InvoiceModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
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
        {/* Backdrop dengan opacity lebih rendah */}
        <div
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ease-in-out"
          onClick={handleClose}
        />

        {/* Modal Panel dengan animasi */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-2xl animate-in fade-in-50 zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Detail Booking
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Informasi lengkap pesanan Anda
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {invoiceData ? (
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
                        <span className="font-medium text-gray-700">
                          {invoiceData.invoiceNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jumlah Penumpang:</span>
                        <span className="font-medium text-gray-700">
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
                        <span className="font-medium text-right text-gray-700">
                          {formatDate(invoiceData.orderDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status Terakhir:</span>
                        <span className="font-medium text-gray-700">
                          {formatDate(invoiceData.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleClose}
                    className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium duration-200"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Data Tidak Tersedia
                </h4>
                <p className="text-gray-500">
                  Tidak dapat menampilkan informasi invoice
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
