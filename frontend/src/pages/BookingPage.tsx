import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Train,
  MapPin,
  Calendar,
  ArrowRight,
  Filter,
  ArrowUpDown,
  ArrowRightLeft,
} from "lucide-react";
import StationDropdown from "../components/ui/StationDropdown";
import CustomDatePicker from "../components/ui/CustomDatePicker";
import type { Station } from "../types/kai";

// Types
interface Schedule {
  uuid: string;
  originStationId: string;
  destinationStationId: string;
  trainId: string;
  departureTime: string;
  arrivalTime: string;
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  uuid: string;
  scheduleId: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  schedule: Schedule;
  trainName: string;
  trainCategoryName: string;
  originStationName: string;
  destinationStationName: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Ticket[];
}

const TicketSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 animate-pulse">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Train Info Skeleton */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>

            {/* Schedule Timeline Skeleton */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>

              <div className="flex-1 text-center">
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-1 bg-gray-200 rounded-full relative">
                  <div className="h-1 bg-gray-300 rounded-full w-3/4"></div>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              <div className="text-center">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>

          {/* Price & Action Skeleton */}
          <div className="lg:text-right">
            <div className="h-10 bg-gray-200 rounded w-24 mb-2 mx-auto lg:mx-0 lg:ml-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-4 mx-auto lg:mx-0"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [originStation, setOriginStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [sortBy, setSortBy] = useState("price");

  const API_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

  const checkIsLoggedIn = (): boolean => {
    const token = sessionStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    return !!(token && userData);
  };

  // Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setStationsLoading(true);
        const response = await axios.get(`${API_URL}/master-data/station`);

        if (response.data.success) {
          setStations(response.data.data);
        } else {
          setError("Gagal mengambil data stasiun");
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
      } finally {
        setStationsLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${API_URL}/master-data/ticket`
        );

        if (response.data.success) {
          setTickets(response.data.data);
          setFilteredTickets(response.data.data);
        } else {
          setError("Gagal memuat data tiket");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data");
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...tickets];

    // Filter by origin station
    if (originStation) {
      const originStationData = stations.find(
        (s) => s.stationCode === originStation
      );
      if (originStationData) {
        filtered = filtered.filter((ticket) =>
          ticket.originStationName
            .toLowerCase()
            .includes(originStationData.name.toLowerCase())
        );
      }
    }

    // Filter by destination station
    if (destinationStation) {
      const destinationStationData = stations.find(
        (s) => s.stationCode === destinationStation
      );
      if (destinationStationData) {
        filtered = filtered.filter((ticket) =>
          ticket.destinationStationName
            .toLowerCase()
            .includes(destinationStationData.name.toLowerCase())
        );
      }
    }

    // Filter by departure date
    if (departureDate) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.schedule.departureTime)
          .toISOString()
          .split("T")[0];
        return ticketDate === departureDate;
      });
    }

    // Sort tickets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "departure":
          return (
            new Date(a.schedule.departureTime).getTime() -
            new Date(b.schedule.departureTime).getTime()
          );
        case "duration":
          const durationA =
            new Date(a.schedule.arrivalTime).getTime() -
            new Date(a.schedule.departureTime).getTime();
          const durationB =
            new Date(b.schedule.arrivalTime).getTime() -
            new Date(b.schedule.departureTime).getTime();
          return durationA - durationB;
        default:
          return 0;
      }
    });

    setFilteredTickets(filtered);
  }, [
    originStation,
    destinationStation,
    departureDate,
    sortBy,
    tickets,
    stations,
  ]);

  // Swap stations function
  const swapStations = () => {
    const temp = originStation;
    setOriginStation(destinationStation);
    setDestinationStation(temp);
  };

  const handleBookTicket = (ticket: Ticket) => {
    // Cek apakah user sudah login
    if (!checkIsLoggedIn()) {
      // Jika belum login, redirect ke halaman login
      navigate("/login");
      return;
    }

    // Jika sudah login, redirect ke halaman detail tiket dengan UUID
    navigate(`/booking/detail/${ticket.uuid}`, { state: { ticket } });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr.getTime() - dep.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}j ${minutes}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "eksekutif":
        return "bg-blue-100 text-blue-800";
      case "bisnis":
        return "bg-green-100 text-green-800";
      case "ekonomi":
        return "bg-orange-100 text-orange-800";
      case "luxury":
        return "bg-purple-100 text-purple-800";
      case "priority":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-20">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Pesan Tiket Kereta
          </h1>
          <p className="text-orange-100 text-lg">
            Temukan dan pesan tiket kereta dengan mudah
          </p>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-end">
            {/* Origin Station */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Stasiun Asal
              </label>
              <StationDropdown
                value={originStation}
                onChange={setOriginStation}
                placeholder={
                  stationsLoading ? "Memuat stasiun..." : "Pilih Stasiun Awal"
                }
                stations={stations}
              />
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-1 flex justify-center">
              <button
                onClick={swapStations}
                disabled={!originStation || !destinationStation}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                title="Tukar Stasiun"
              >
                <ArrowRightLeft className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Destination Station */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Stasiun Tujuan
              </label>
              <StationDropdown
                value={destinationStation}
                onChange={setDestinationStation}
                placeholder={
                  stationsLoading ? "Memuat stasiun..." : "Pilih Stasiun Tujuan"
                }
                stations={stations}
              />
            </div>

            {/* Departure Date */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Tanggal Berangkat
              </label>
              <CustomDatePicker
                value={departureDate}
                onChange={setDepartureDate}
                placeholder="Pilih Tanggal"
                minDate={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1">
              <button className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center">
                <Search className="h-8 w-8 mr-2" />
                Cari
              </button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Urutkan:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "price", label: "Harga Terendah" },
                { value: "departure", label: "Keberangkatan Awal" },
                { value: "duration", label: "Durasi Terpendek" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    sortBy === option.value
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? (
              <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
            ) : (
              <>
                Menampilkan{" "}
                <span className="font-semibold">{filteredTickets.length}</span>{" "}
                tiket tersedia
              </>
            )}
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 gap-6">
          {loading
            ? // Skeleton Loaders
              Array.from({ length: 3 }).map((_, index) => (
                <TicketSkeleton key={index} />
              ))
            : // Actual Tickets
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.uuid}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Train Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Train className="h-6 w-6 text-orange-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xl font-bold text-gray-900 truncate">
                              {ticket.trainName}
                            </h3>
                            <div className="mt-1">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                                  ticket.trainCategoryName
                                )}`}
                              >
                                {ticket.trainCategoryName}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Schedule Timeline */}
                        <div className="flex items-center space-x-4 lg:space-x-6">
                          <div className="text-center min-w-20">
                            <div className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                              {formatTime(ticket.schedule.departureTime)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1 whitespace-nowrap">
                              {formatDate(ticket.schedule.departureTime)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {ticket.originStationName}
                            </div>
                          </div>

                          <div className="flex-1 text-center min-w-24">
                            <div className="text-sm text-gray-500 mb-2 whitespace-nowrap">
                              {calculateDuration(
                                ticket.schedule.departureTime,
                                ticket.schedule.arrivalTime
                              )}
                            </div>
                            <div className="h-1 bg-gray-200 rounded-full relative">
                              <div className="h-1 bg-orange-500 rounded-full w-3/4"></div>
                              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
                              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
                            </div>
                          </div>

                          <div className="text-center min-w-20">
                            <div className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                              {formatTime(ticket.schedule.arrivalTime)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1 whitespace-nowrap">
                              {formatDate(ticket.schedule.arrivalTime)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {ticket.destinationStationName}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="lg:text-right lg:min-w-48">
                        <div className="text-3xl font-bold text-orange-600 mb-2 whitespace-nowrap">
                          {formatPrice(ticket.price)}
                        </div>
                        <div className="text-sm text-gray-500 mb-4 whitespace-nowrap">
                          per penumpang
                        </div>
                        <button
                          onClick={() => handleBookTicket(ticket)}
                          className="w-full lg:w-auto bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center lg:justify-start whitespace-nowrap"
                        >
                          Pesan Sekarang
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty State */}
        {!loading && filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada tiket ditemukan
            </h3>
            <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
