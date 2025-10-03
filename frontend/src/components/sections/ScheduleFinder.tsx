import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Train, ArrowRightLeft, Calendar } from "lucide-react";
import StationDropdown from "../ui/StationDropdown";
import type { Station } from "../../types/kai";
import { useNavigate } from "react-router-dom";

interface Schedule {
  trainName: string;
  originStationName: string;
  destinationStationName: string;
  departureTime: string;
  arrivalTime: string;
}

const ScheduleFinder = () => {
  const navigate = useNavigate();
  const [startStation, setStartStation] = useState<string>("");
  const [endStation, setEndStation] = useState<string>("");
  const [stations, setStations] = useState<Station[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

  // Fetch data stasiun dari API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/master-data/station`);

        if (response.data.success) {
          setStations(response.data.data);
        } else {
          setError("Gagal mengambil data stasiun");
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Terjadi kesalahan saat mengambil data stasiun");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Fetch jadwal ketika stasiun awal dan tujuan dipilih
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!startStation || !endStation) {
        setSchedules([]);
        return;
      }

      try {
        setScheduleLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_URL}/master-data/schedules/${startStation}/${endStation}`
        );

        if (response.data.success) {
          setSchedules(response.data.data);
        } else {
          setError(response.data.message || "Gagal mengambil data jadwal");
          setSchedules([]);
        }
      } catch (err: any) {
        console.error("Error fetching schedules:", err);
        if (err.response?.status === 404) {
          setError("Tidak ada jadwal yang ditemukan untuk rute ini");
        } else {
          setError("Terjadi kesalahan saat mengambil data jadwal");
        }
        setSchedules([]);
      } finally {
        setScheduleLoading(false);
      }
    };

    // Debounce untuk menghindari request berlebihan
    const timeoutId = setTimeout(fetchSchedules, 500);
    return () => clearTimeout(timeoutId);
  }, [startStation, endStation]);

  // Fungsi swap stasiun
  const swapStations = () => {
    const temp = startStation;
    setStartStation(endStation);
    setEndStation(temp);
  };

  // Fungsi untuk memformat waktu
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOrderTicket = () => {
    navigate("/booking");
  };

  // Fungsi untuk menghitung durasi perjalanan
  const calculateDuration = (departure: string, arrival: string) => {
    const depTime = new Date(departure).getTime();
    const arrTime = new Date(arrival).getTime();
    const durationMs = arrTime - depTime;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data stasiun...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !startStation && !endStation) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          Cari Jadwal Kereta
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Temukan jadwal perjalanan kereta api antar stasiun
        </p>

        {/* Station Selector */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Stasiun Awal */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stasiun Awal
              </label>
              <StationDropdown
                value={startStation}
                onChange={setStartStation}
                placeholder="Pilih Stasiun Awal"
                stations={stations}
              />
            </div>

            {/* Swap Button */}
            <div className="mt-6 md:mt-8">
              <button
                onClick={swapStations}
                disabled={!startStation || !endStation}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Tukar Stasiun"
              >
                <ArrowRightLeft className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Stasiun Tujuan */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stasiun Tujuan
              </label>
              <StationDropdown
                value={endStation}
                onChange={setEndStation}
                placeholder="Pilih Stasiun Tujuan"
                stations={stations}
              />
            </div>
          </div>
        </div>

        {/* Schedule Results */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center text-gray-800">
              <Calendar className="h-6 w-6 text-orange-600 mr-2" />
              Jadwal Tersedia
            </h3>

            {startStation && endStation && (
              <div className="text-sm text-gray-600">
                {stations.find((s) => s.uuid === startStation)?.name} →{" "}
                {stations.find((s) => s.uuid === endStation)?.name}
              </div>
            )}
          </div>

          {!startStation || !endStation ? (
            <div className="text-center py-12 text-gray-500">
              <Train className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">
                Pilih stasiun awal dan tujuan untuk melihat jadwal
              </p>
            </div>
          ) : scheduleLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Mencari jadwal...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-gray-500">
              <Train className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-red-600 mb-2">{error}</p>
              <p className="text-sm">
                Coba pilih stasiun lain atau periksa koneksi internet Anda
              </p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Train className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Tidak ada jadwal yang tersedia</p>
              <p className="text-sm mt-2">
                Tidak ditemukan jadwal untuk rute yang dipilih
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule, index) => {
                const { hours, minutes } = calculateDuration(
                  schedule.departureTime,
                  schedule.arrivalTime
                );

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Info Kereta */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <h4 className="font-bold text-xl text-gray-800">
                            {schedule.trainName}
                          </h4>
                          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                            {hours}j {minutes}m
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {/* Stasiun Keberangkatan */}
                          <div className="space-y-2">
                            <div className="font-semibold text-gray-700">
                              Keberangkatan
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatTime(schedule.departureTime)}
                            </div>
                            <div className="text-gray-600">
                              {schedule.originStationName}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {formatDate(schedule.departureTime)}
                            </div>
                          </div>

                          {/* Stasiun Kedatangan */}
                          <div className="space-y-2">
                            <div className="font-semibold text-gray-700">
                              Kedatangan
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatTime(schedule.arrivalTime)}
                            </div>
                            <div className="text-gray-600">
                              {schedule.destinationStationName}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {formatDate(schedule.arrivalTime)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="lg:text-right">
                        <button
                          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                          onClick={handleOrderTicket}
                        >
                          Pesan Tiket
                        </button>
                      </div>
                    </div>

                    {/* Duration Bar */}
                    <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>
                        Durasi perjalanan: {hours} jam {minutes} menit
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informasi */}
        {schedules.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Menampilkan {schedules.length} jadwal tersedia
          </div>
        )}
      </div>
    </section>
  );
};

export default ScheduleFinder;
