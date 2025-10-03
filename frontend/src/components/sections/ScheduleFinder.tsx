import { useState, useEffect } from "react";
import axios from "axios";
import {
  Clock,
  Train,
  ArrowRightLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(2);

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
        setCurrentPage(1); // Reset ke halaman 1
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
          setCurrentPage(1); // Reset ke halaman 1 ketika data berubah
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

  // Format tanggal singkat untuk mobile
  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = schedules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(schedules.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Skeleton Loader Component
  const ScheduleSkeleton = () => (
    <div className="border border-gray-200 rounded-xl p-4 md:p-6 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Info Kereta Skeleton */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3 md:w-1/4"></div>
            <div className="bg-gray-200 px-3 py-1 rounded-full text-sm w-20 h-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
            {/* Stasiun Keberangkatan Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/3 md:w-1/4"></div>
              <div className="h-6 md:h-8 bg-gray-300 rounded w-1/4 md:w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 md:w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 md:w-3/4"></div>
            </div>

            {/* Stasiun Kedatangan Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/3 md:w-1/4"></div>
              <div className="h-6 md:h-8 bg-gray-300 rounded w-1/4 md:w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 md:w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 md:w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="lg:text-right">
          <div className="h-10 md:h-12 bg-gray-300 rounded-lg w-20 md:w-24"></div>
        </div>
      </div>

      {/* Duration Bar Skeleton */}
      <div className="mt-4 flex items-center gap-3 text-sm">
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 md:w-1/4"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8 md:py-12">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-3 md:mt-4 text-gray-600">Memuat data stasiun...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !startStation && !endStation) {
    return (
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8 md:py-12">
            <p className="text-red-600 text-sm md:text-base">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 md:mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm md:text-base"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-800">
            Cari Jadwal Kereta
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Temukan jadwal perjalanan kereta api antar stasiun
          </p>
        </div>

        {/* Station Selector */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
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
            <div className="mt-2 md:mt-8 order-2 md:order-none">
              <button
                onClick={swapStations}
                disabled={!startStation || !endStation}
                className="p-2 md:p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Tukar Stasiun"
              >
                <ArrowRightLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
              </button>
            </div>

            {/* Stasiun Tujuan */}
            <div className="flex-1 w-full order-1 md:order-none">
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
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6">
          {/* Header Results */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold flex items-center text-gray-800">
              <Calendar className="h-5 w-5 md:h-6 md:w-6 text-orange-600 mr-2" />
              Jadwal Tersedia
            </h3>

            {startStation && endStation && (
              <div className="text-xs md:text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                {stations.find((s) => s.uuid === startStation)?.name} →{" "}
                {stations.find((s) => s.uuid === endStation)?.name}
              </div>
            )}
          </div>

          {!startStation || !endStation ? (
            <div className="text-center py-8 md:py-12 text-gray-500">
              <Train className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 text-gray-300" />
              <p className="text-base md:text-lg">
                Pilih stasiun awal dan tujuan untuk melihat jadwal
              </p>
            </div>
          ) : scheduleLoading ? (
            <div className="space-y-3 md:space-y-4">
              {/* Menampilkan 2 skeleton loader */}
              <ScheduleSkeleton />
              <ScheduleSkeleton />
            </div>
          ) : error ? (
            <div className="text-center py-8 md:py-12 text-gray-500">
              <Train className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 text-gray-300" />
              <p className="text-base md:text-lg text-red-600 mb-2">{error}</p>
              <p className="text-xs md:text-sm">
                Coba pilih stasiun lain atau periksa koneksi internet Anda
              </p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-8 md:py-12 text-gray-500">
              <Train className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 text-gray-300" />
              <p className="text-base md:text-lg">
                Tidak ada jadwal yang tersedia
              </p>
              <p className="text-xs md:text-sm mt-2">
                Tidak ditemukan jadwal untuk rute yang dipilih
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 md:space-y-4">
                {currentSchedules.map((schedule, index) => {
                  const { hours, minutes } = calculateDuration(
                    schedule.departureTime,
                    schedule.arrivalTime
                  );

                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Info Kereta */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-500 rounded-full"></div>
                              <h4 className="font-bold text-lg md:text-xl text-gray-800 line-clamp-1">
                                {schedule.trainName}
                              </h4>
                            </div>
                            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs md:text-sm font-medium w-fit">
                              {hours}j {minutes}m
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
                            {/* Stasiun Keberangkatan */}
                            <div className="space-y-1 md:space-y-2">
                              <div className="font-semibold text-gray-700 text-xs md:text-sm">
                                Keberangkatan
                              </div>
                              <div className="text-xl md:text-2xl font-bold text-gray-900">
                                {formatTime(schedule.departureTime)}
                              </div>
                              <div className="text-gray-600 text-sm md:text-base">
                                {schedule.originStationName}
                              </div>
                              <div className="text-gray-500 text-xs md:text-sm">
                                {/* Desktop: tampilkan lengkap, Mobile: tampilkan singkat */}
                                <span className="hidden md:inline">
                                  {formatDate(schedule.departureTime)}
                                </span>
                                <span className="md:hidden">
                                  {formatDateShort(schedule.departureTime)}
                                </span>
                              </div>
                            </div>

                            {/* Stasiun Kedatangan */}
                            <div className="space-y-1 md:space-y-2">
                              <div className="font-semibold text-gray-700 text-xs md:text-sm">
                                Kedatangan
                              </div>
                              <div className="text-xl md:text-2xl font-bold text-gray-900">
                                {formatTime(schedule.arrivalTime)}
                              </div>
                              <div className="text-gray-600 text-sm md:text-base">
                                {schedule.destinationStationName}
                              </div>
                              <div className="text-gray-500 text-xs md:text-sm">
                                <span className="hidden md:inline">
                                  {formatDate(schedule.arrivalTime)}
                                </span>
                                <span className="md:hidden">
                                  {formatDateShort(schedule.arrivalTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="lg:text-right mt-4 lg:mt-0">
                          <button
                            className="w-full lg:w-auto px-4 py-2 md:px-6 md:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold text-sm md:text-base"
                            onClick={handleOrderTicket}
                          >
                            Pesan Tiket
                          </button>
                        </div>
                      </div>

                      {/* Duration Bar */}
                      <div className="mt-3 md:mt-4 flex items-center gap-2 text-xs md:text-sm text-gray-500">
                        <Clock className="h-3 w-3 md:h-4 md:w-4" />
                        <span>
                          Durasi perjalanan: {hours} jam {minutes} menit
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-xs md:text-sm text-gray-600 order-2 sm:order-1">
                    Menampilkan {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, schedules.length)} dari{" "}
                    {schedules.length} jadwal
                  </div>

                  <div className="flex items-center gap-1 md:gap-2 order-1 sm:order-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">Sebelumnya</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm font-medium rounded-lg ${
                              currentPage === page
                                ? "bg-orange-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline">Selanjutnya</span>
                      <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Informasi */}
        {schedules.length > 0 && totalPages === 1 && (
          <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-500">
            Menampilkan {schedules.length} jadwal tersedia
          </div>
        )}
      </div>
    </section>
  );
};

export default ScheduleFinder;
