// components/booking/BookingSearch.tsx
import { useState, useEffect } from "react";
import { Search, Calendar, Users, ArrowRightLeft } from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import type { Station } from "../../types/booking";

const BookingSearch = () => {
  const { state, dispatch } = useBooking();
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock stations data - in real app, this would come from API
  useEffect(() => {
    const mockStations: Station[] = [
      {
        id: "GMR",
        name: "Gambir",
        city: "Jakarta",
        code: "GMR",
        type: "STATION",
      },
      {
        id: "BDO",
        name: "Bandung",
        city: "Bandung",
        code: "BDO",
        type: "STATION",
      },
      {
        id: "SLO",
        name: "Solo Balapan",
        city: "Solo",
        code: "SLO",
        type: "STATION",
      },
      {
        id: "YK",
        name: "Yogyakarta",
        city: "Yogyakarta",
        code: "YK",
        type: "STATION",
      },
      {
        id: "SBI",
        name: "Surabaya Gubeng",
        city: "Surabaya",
        code: "SBI",
        type: "STATION",
      },
    ];
    setStations(mockStations);
  }, []);

  const handleSwapStations = () => {
    if (state.searchData.from && state.searchData.to) {
      dispatch({
        type: "SET_SEARCH_DATA",
        payload: {
          from: state.searchData.to,
          to: state.searchData.from,
        },
      });
    }
  };

  const handleSearch = async () => {
    if (
      !state.searchData.from ||
      !state.searchData.to ||
      !state.searchData.departureDate
    ) {
      alert("Harap lengkapi semua field pencarian");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockSchedules = [
        {
          id: "1",
          train: {
            id: "t1",
            name: "Argo Parahyangan",
            number: "45",
            class: "EKSEKUTIF" as const,
            subclass: "Executive",
            facilities: ["AC", "Toilet", "Snack", "Power Outlet"],
            capacity: 80,
          },
          departure: {
            station: state.searchData.from!,
            time: "08:00",
            date: state.searchData.departureDate,
          },
          arrival: {
            station: state.searchData.to!,
            time: "10:30",
            date: state.searchData.departureDate,
          },
          duration: "2j 30m",
          price: 150000,
          availableSeats: 45,
        },
        {
          id: "2",
          train: {
            id: "t2",
            name: "Argo Parahyangan",
            number: "47",
            class: "EKSEKUTIF" as const,
            subclass: "Executive Premium",
            facilities: ["AC", "Toilet", "Meal", "Power Outlet", "Wifi"],
            capacity: 60,
          },
          departure: {
            station: state.searchData.from!,
            time: "14:00",
            date: state.searchData.departureDate,
          },
          arrival: {
            station: state.searchData.to!,
            time: "16:45",
            date: state.searchData.departureDate,
          },
          duration: "2j 45m",
          price: 200000,
          availableSeats: 25,
        },
      ];

      dispatch({ type: "SET_SCHEDULES", payload: mockSchedules });
      dispatch({ type: "SET_STEP", payload: "select" });
      setIsLoading(false);
    }, 1500);
  };

  const totalPassengers =
    state.searchData.passengerCount.adult +
    state.searchData.passengerCount.child +
    state.searchData.passengerCount.infant;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* From Station */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stasiun Asal
          </label>
          <select
            value={state.searchData.from?.id || ""}
            onChange={(e) => {
              const station = stations.find((s) => s.id === e.target.value);
              dispatch({
                type: "SET_SEARCH_DATA",
                payload: { from: station || null },
              });
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Pilih Stasiun Asal</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.code})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="lg:col-span-1 flex justify-center">
          <button
            onClick={handleSwapStations}
            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Tukar stasiun"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </button>
        </div>

        {/* To Station */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stasiun Tujuan
          </label>
          <select
            value={state.searchData.to?.id || ""}
            onChange={(e) => {
              const station = stations.find((s) => s.id === e.target.value);
              dispatch({
                type: "SET_SEARCH_DATA",
                payload: { to: station || null },
              });
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Pilih Stasiun Tujuan</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.code})
              </option>
            ))}
          </select>
        </div>

        {/* Departure Date */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Berangkat
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={state.searchData.departureDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                dispatch({
                  type: "SET_SEARCH_DATA",
                  payload: { departureDate: e.target.value },
                })
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Penumpang
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={totalPassengers}
              onChange={(e) => {
                // In real app, this would open a passenger selector modal
                const adults = Math.max(1, parseInt(e.target.value));
                dispatch({
                  type: "SET_SEARCH_DATA",
                  payload: {
                    passengerCount: {
                      adult: adults,
                      child: 0,
                      infant: 0,
                    },
                  },
                });
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} Penumpang
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <Search className="h-5 w-5" />
            <span>{isLoading ? "Mencari..." : "Cari"}</span>
          </button>
        </div>
      </div>

      {/* Round Trip Toggle */}
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="roundTrip"
          checked={state.searchData.isRoundTrip}
          onChange={(e) =>
            dispatch({
              type: "SET_SEARCH_DATA",
              payload: { isRoundTrip: e.target.checked },
            })
          }
          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <label htmlFor="roundTrip" className="ml-2 text-sm text-gray-700">
          Pulang Pergi
        </label>
      </div>
    </div>
  );
};

export default BookingSearch;
