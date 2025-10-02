import { useBooking } from "../../context/BookingContext";
import { CheckCircle, Download, Printer, Mail, Train } from "lucide-react";

const ConfirmationSection = () => {
  const { state, dispatch } = useBooking();

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

  // Generate random booking code
  const bookingCode = `KAI${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;

  const handleNewBooking = () => {
    dispatch({ type: "RESET_BOOKING" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pembayaran Berhasil!
        </h1>

        <p className="text-xl text-gray-600 mb-2">
          Tiket kereta Anda telah berhasil dipesan
        </p>

        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg inline-block mb-8">
          <div className="text-sm font-medium">Kode Booking</div>
          <div className="text-2xl font-bold">{bookingCode}</div>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {state.selectedSchedule?.train.name}{" "}
                {state.selectedSchedule?.train.number}
              </h3>
              <p className="text-gray-600">
                {state.selectedSchedule?.train.subclass}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {formatPrice(totalAmount)}
              </div>
              <div className="text-sm text-gray-600">Total Pembayaran</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Detail Perjalanan
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rute</span>
                  <span className="font-medium">
                    {state.searchData.from?.name} → {state.searchData.to?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium">
                    {new Date(
                      state.searchData.departureDate
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Berangkat</span>
                  <span className="font-medium">
                    {state.selectedSchedule?.departure.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiba</span>
                  <span className="font-medium">
                    {state.selectedSchedule?.arrival.time}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Penumpang</h4>
              <div className="space-y-2 text-sm">
                {state.passengers.map((passenger, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">
                      Penumpang {index + 1} (
                      {passenger.type === "ADULT"
                        ? "Dewasa"
                        : passenger.type === "CHILD"
                        ? "Anak"
                        : "Bayi"}
                      )
                    </span>
                    <span className="font-medium">{passenger.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center">
            <Download className="h-5 w-5 mr-2" />
            Download E-Ticket
          </button>

          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
            <Printer className="h-5 w-5 mr-2" />
            Cetak Tiket
          </button>

          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
            <Mail className="h-5 w-5 mr-2" />
            Kirim ke Email
          </button>
        </div>

        <div className="mt-8 pt-6 border-t">
          <button
            onClick={handleNewBooking}
            className="text-red-600 hover:text-red-700 font-medium flex items-center justify-center mx-auto"
          >
            <Train className="h-5 w-5 mr-2" />
            Pesan Tiket Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationSection;
