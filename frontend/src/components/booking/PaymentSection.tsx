import { useState } from "react";
import { useBooking } from "../../context/BookingContext";
import {
  CreditCard,
  Banknote,
  Smartphone,
  QrCode,
  Shield,
  Lock,
} from "lucide-react";

const PaymentSection = () => {
  const { state, dispatch } = useBooking();
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const paymentMethods = [
    {
      id: "credit_card",
      name: "Kartu Kredit",
      icon: CreditCard,
      description: "Visa, MasterCard, JCB",
    },
    {
      id: "bank_transfer",
      name: "Transfer Bank",
      icon: Banknote,
      description: "BCA, Mandiri, BNI, BRI",
    },
    {
      id: "ewallet",
      name: "E-Wallet",
      icon: Smartphone,
      description: "GoPay, OVO, Dana, LinkAja",
    },
    {
      id: "qris",
      name: "QRIS",
      icon: QrCode,
      description: "Semua e-wallet yang mendukung QRIS",
    },
  ];

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Pilih metode pembayaran terlebih dahulu");
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      dispatch({ type: "SET_STEP", payload: "confirmation" });
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalAmount = state.passengers.reduce(
    (sum, passenger) => sum + passenger.price,
    0
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Metode Pembayaran
            </h2>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        selectedMethod === method.id
                          ? "bg-red-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <method.icon
                        className={`h-6 w-6 ${
                          selectedMethod === method.id
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {method.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {method.description}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedMethod === method.id
                          ? "bg-red-500 border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Badge */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <Lock className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                Transaksi Anda aman dan terenkripsi
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Ringkasan Pemesanan
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kereta</span>
                <span className="font-medium">
                  {state.selectedSchedule?.train.name}{" "}
                  {state.selectedSchedule?.train.number}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rute</span>
                <span className="font-medium text-right">
                  {state.searchData.from?.code} → {state.searchData.to?.code}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tanggal</span>
                <span className="font-medium">
                  {new Date(state.searchData.departureDate).toLocaleDateString(
                    "id-ID"
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Berangkat</span>
                <span className="font-medium">
                  {state.selectedSchedule?.departure.time}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              {state.passengers.map((passenger, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    Penumpang {index + 1} (
                    {passenger.type === "ADULT"
                      ? "Dewasa"
                      : passenger.type === "CHILD"
                      ? "Anak"
                      : "Bayi"}
                    )
                  </span>
                  <span className="font-medium">
                    {formatPrice(passenger.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-red-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedMethod}
              className="w-full mt-6 bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              Bayar Sekarang
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
