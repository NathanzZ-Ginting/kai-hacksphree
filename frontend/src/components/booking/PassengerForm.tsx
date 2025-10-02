import { useBooking } from "../../context/BookingContext";
import { User, IdCard, AlertCircle } from "lucide-react";

const PassengerForm = () => {
  const { state, dispatch } = useBooking();

  const handlePassengerChange = (
    index: number,
    field: string,
    value: string
  ) => {
    dispatch({
      type: "UPDATE_PASSENGER",
      payload: {
        index,
        data: { [field]: value },
      },
    });
  };

  const handleContactChange = (field: string, value: string) => {
    dispatch({
      type: "SET_CONTACT_INFO",
      payload: { [field]: value },
    });
  };

  const isFormValid = () => {
    // Check all passengers have name and identity number
    const allPassengersValid = state.passengers.every(
      (p) => p.name.trim() && p.identityNumber.trim()
    );

    // Check contact info is complete
    const contactValid =
      state.contactInfo.name.trim() &&
      state.contactInfo.email.trim() &&
      state.contactInfo.phone.trim();

    return allPassengersValid && contactValid;
  };

  const handleContinue = () => {
    if (isFormValid()) {
      dispatch({ type: "SET_STEP", payload: "payment" });
    }
  };

  const getPassengerTypeLabel = (type: string) => {
    switch (type) {
      case "ADULT":
        return "Dewasa";
      case "CHILD":
        return "Anak (3-12 tahun)";
      case "INFANT":
        return "Bayi (0-2 tahun)";
      default:
        return type;
    }
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
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Data Penumpang
        </h2>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">
                {state.selectedSchedule?.train.name}{" "}
                {state.selectedSchedule?.train.number}
              </div>
              <div className="text-sm text-gray-600">
                {state.searchData.from?.name} → {state.searchData.to?.name} •
                {state.selectedSchedule?.departure.time} -{" "}
                {state.selectedSchedule?.arrival.time}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-red-600 text-lg">
                {formatPrice(totalAmount)}
              </div>
              <button
                onClick={() =>
                  dispatch({ type: "SET_STEP", payload: "select" })
                }
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Ubah Jadwal
              </button>
            </div>
          </div>
        </div>

        {/* Passengers Forms */}
        <div className="space-y-6">
          {state.passengers.map((passenger, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-red-600" />
                Penumpang {index + 1} - {getPassengerTypeLabel(passenger.type)}
                {passenger.price > 0 && (
                  <span className="ml-2 text-red-600 text-sm font-normal">
                    ({formatPrice(passenger.price)})
                  </span>
                )}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) =>
                      handlePassengerChange(index, "name", e.target.value)
                    }
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <IdCard className="h-4 w-4 mr-1" />
                    Nomor Identitas
                  </label>
                  <input
                    type="text"
                    value={passenger.identityNumber}
                    onChange={(e) =>
                      handlePassengerChange(
                        index,
                        "identityNumber",
                        e.target.value
                      )
                    }
                    placeholder="KTP / Paspor / SIM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {passenger.type === "INFANT" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Untuk penumpang bayi, nama dan nomor identitas diisi sesuai
                    data orang tua/wali yang mendampingi.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-8 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informasi Kontak
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={state.contactInfo.name}
                onChange={(e) => handleContactChange("name", e.target.value)}
                placeholder="Nama pemesan"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={state.contactInfo.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={state.contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: "select" })}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Kembali
          </button>

          <button
            onClick={handleContinue}
            disabled={!isFormValid()}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Lanjut ke Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengerForm;
