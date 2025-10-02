import { Clock, Users, Wifi, Utensils, Zap } from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import type { Schedule } from "../../types/booking";

const ScheduleSelection = () => {
  const { state, dispatch } = useBooking();

  const handleSelectSchedule = (schedule: Schedule) => {
    dispatch({ type: "SELECT_SCHEDULE", payload: schedule });

    // Initialize passengers based on search data
    const passengers = [];
    for (let i = 0; i < state.searchData.passengerCount.adult; i++) {
      passengers.push({
        type: "ADULT" as const,
        name: "",
        identityNumber: "",
        price: schedule.price,
      });
    }
    for (let i = 0; i < state.searchData.passengerCount.child; i++) {
      passengers.push({
        type: "CHILD" as const,
        name: "",
        identityNumber: "",
        price: schedule.price * 0.7, // 30% discount for children
      });
    }
    for (let i = 0; i < state.searchData.passengerCount.infant; i++) {
      passengers.push({
        type: "INFANT" as const,
        name: "",
        identityNumber: "",
        price: 0, // Free for infants
      });
    }

    passengers.forEach((passenger) => {
      dispatch({ type: "ADD_PASSENGER", payload: passenger });
    });

    dispatch({ type: "SET_STEP", payload: "passenger" });
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "meal":
        return <Utensils className="h-4 w-4" />;
      case "power outlet":
        return <Zap className="h-4 w-4" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pilih Jadwal Kereta
        </h2>

        {/* Search Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <div className="font-semibold text-gray-900">
                  {state.searchData.from?.name} → {state.searchData.to?.name}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(state.searchData.departureDate).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {state.searchData.passengerCount.adult} Dewasa
                {state.searchData.passengerCount.child > 0 &&
                  `, ${state.searchData.passengerCount.child} Anak`}
                {state.searchData.passengerCount.infant > 0 &&
                  `, ${state.searchData.passengerCount.infant} Bayi`}
              </div>
              <button
                onClick={() =>
                  dispatch({ type: "SET_STEP", payload: "search" })
                }
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Ubah Pencarian
              </button>
            </div>
          </div>
        </div>

        {/* Schedules List */}
        <div className="space-y-4">
          {state.availableSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleSelectSchedule(schedule)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  {/* Train Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {schedule.train.name}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {schedule.train.number} • {schedule.train.subclass}
                      </div>
                    </div>

                    {/* Schedule Timeline */}
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {schedule.departure.time}
                        </div>
                        <div className="text-sm text-gray-600">
                          {schedule.departure.station.code}
                        </div>
                      </div>

                      <div className="flex-1 text-center">
                        <div className="text-sm text-gray-500 mb-1">
                          {schedule.duration}
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full">
                          <div className="h-1 bg-red-500 rounded-full w-3/4"></div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {schedule.arrival.time}
                        </div>
                        <div className="text-sm text-gray-600">
                          {schedule.arrival.station.code}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Availability */}
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {formatPrice(schedule.price)}
                    </div>
                    <div className="flex items-center justify-end text-sm text-gray-600 mb-3">
                      <Users className="h-4 w-4 mr-1" />
                      {schedule.availableSeats} kursi tersedia
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      {schedule.train.facilities
                        .slice(0, 3)
                        .map((facility, index) => (
                          <div
                            key={index}
                            className="text-gray-400"
                            title={facility}
                          >
                            {getFacilityIcon(facility)}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {state.availableSchedules.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada jadwal tersedia
            </h3>
            <p className="text-gray-600">
              Coba ubah tanggal atau rute perjalanan Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSelection;
