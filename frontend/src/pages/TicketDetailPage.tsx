// pages/TicketDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Train,
  Users,
  CreditCard,
  User,
  Shield,
} from "lucide-react";

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

interface TicketDetail {
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

// interface OrderRequest {
//   userUuid: string;
//   ticketUuid: string;
//   totalPasangger: number;
//   totalPrice: number;
//   typePasangger: string[];
//   seatNumbers: string[];
// }

interface OrderResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TicketDetail;
}

interface PassengerForm {
  type: string;
  name: string;
  identityNumber: string;
  seat: string;
}

const TicketDetailPage = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form states
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState<PassengerForm[]>([
    { type: "dewasa", name: "", identityNumber: "", seat: "" },
  ]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

  // Available seats (dummy data - in real app this would come from API)
  const availableSeats = [
    "A1",
    "A2",
    "A3",
    "A4",
    "B1",
    "B2",
    "B3",
    "B4",
    "C1",
    "C2",
    "C3",
    "C4",
    "D1",
    "D2",
    "D3",
    "D4",
  ];

  // Passenger types
  const passengerTypes = [
    { value: "dewasa", label: "Dewasa", priceMultiplier: 1 },
    { value: "anak", label: "Anak (3-12 tahun)", priceMultiplier: 0.7 },
    { value: "bayi", label: "Bayi (0-2 tahun)", priceMultiplier: 0 },
  ];

  // Fetch ticket detail
  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        setLoading(true);
        // Check if we have ticket data from navigation state first
        if (location.state?.ticket) {
          setTicket(location.state.ticket);
          setLoading(false);
          return;
        }

        // If not, fetch from API
        const response = await axios.get<ApiResponse>(
          `${API_URL}/master-data/ticket/${uuid}`
        );

        if (response.data.success) {
          setTicket(response.data.data);
        } else {
          setError("Gagal memuat detail tiket");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat detail tiket");
        console.error("Error fetching ticket detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchTicketDetail();
    }
  }, [uuid, location.state]);

  // Update passengers when count changes
  useEffect(() => {
    const newPassengers = [];
    for (let i = 0; i < passengerCount; i++) {
      if (passengers[i]) {
        newPassengers.push(passengers[i]);
      } else {
        newPassengers.push({
          type: "dewasa",
          name: "",
          identityNumber: "",
          seat: selectedSeats[i] || "",
        });
      }
    }
    setPassengers(newPassengers);
    // Reset selected seats if count decreases
    if (selectedSeats.length > passengerCount) {
      setSelectedSeats(selectedSeats.slice(0, passengerCount));
    }
  }, [passengerCount]);

  const handlePassengerChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);
  };

  const handleSeatSelect = (seat: string, index: number) => {
    // Check if seat is already selected by another passenger
    if (selectedSeats.includes(seat) && selectedSeats[index] !== seat) {
      return;
    }

    const updatedSelectedSeats = [...selectedSeats];
    updatedSelectedSeats[index] = seat;
    setSelectedSeats(updatedSelectedSeats);

    // Update passenger form
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      seat: seat,
    };
    setPassengers(updatedPassengers);
  };

  const calculateTotalPrice = () => {
    if (!ticket) return 0;

    return passengers.reduce((total, passenger) => {
      const type = passengerTypes.find((t) => t.value === passenger.type);
      const multiplier = type ? type.priceMultiplier : 1;
      return total + ticket.price * multiplier;
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (!ticket) return;

    // Validation
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      if (
        !passenger.name.trim() ||
        !passenger.identityNumber.trim() ||
        !passenger.seat
      ) {
        setError(`Harap lengkapi data penumpang ${i + 1}`);
        return;
      }
    }

    try {
      setOrderLoading(true);
      setError("");

      // Get user UUID from localStorage or context (assuming you have auth system)
      const userUuid = localStorage.getItem("userUuid") || "demo-user-uuid";

      const orderData = {
        userUuid: userUuid,
        ticketUuid: ticket.uuid,
        totalPasangger: passengerCount,
        totalPrice: calculateTotalPrice(),
        typePasangger: passengers.map((p) => p.type),
        seatNumbers: passengers.map((p) => p.seat),
      };

      const response = await axios.post(`${API_URL}/order`, orderData);

      if (response.data.success) {
        setOrderSuccess(true);
        // Redirect to success page or show success message
        setTimeout(() => {
          navigate("/booking/success", {
            state: {
              order: response.data.data,
              ticket: ticket,
            },
          });
        }, 2000);
      } else {
        setError(response.data.message || "Gagal melakukan pemesanan");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat memesan tiket"
      );
      console.error("Error submitting order:", err);
    } finally {
      setOrderLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr.getTime() - dep.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} jam ${minutes} menit`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail tiket...</p>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/booking")}
            className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Kembali ke Pencarian
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Tiket tidak ditemukan</p>
          <button
            onClick={() => navigate("/booking")}
            className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Kembali ke Pencarian
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/booking")}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Pencarian
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detail Perjalanan
              </h2>

              <div className="space-y-6">
                {/* Train Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Train className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {ticket.trainName}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getCategoryColor(
                        ticket.trainCategoryName
                      )}`}
                    >
                      {ticket.trainCategoryName}
                    </span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(ticket.schedule.departureTime)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatDate(ticket.schedule.departureTime)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {ticket.originStationName}
                    </div>
                  </div>

                  <div className="flex-1 px-6 text-center">
                    <div className="text-sm text-gray-500 mb-2">
                      {calculateDuration(
                        ticket.schedule.departureTime,
                        ticket.schedule.arrivalTime
                      )}
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full relative">
                      <div className="h-1 bg-orange-500 rounded-full w-full"></div>
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(ticket.schedule.arrivalTime)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatDate(ticket.schedule.arrivalTime)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {ticket.destinationStationName}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Harga per penumpang:
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      {formatPrice(ticket.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Data Penumpang
              </h2>

              {/* Passenger Count */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Users className="h-4 w-4 inline mr-1" />
                  Jumlah Penumpang
                </label>
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} Penumpang
                    </option>
                  ))}
                </select>
              </div>

              {/* Passenger Forms */}
              <div className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-orange-600" />
                      Penumpang {index + 1}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipe Penumpang
                        </label>
                        <select
                          value={passenger.type}
                          onChange={(e) =>
                            handlePassengerChange(index, "type", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          {passengerTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor Kursi
                        </label>
                        <select
                          value={passenger.seat}
                          onChange={(e) =>
                            handlePassengerChange(index, "seat", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Pilih Kursi</option>
                          {availableSeats.map((seat) => (
                            <option
                              key={seat}
                              value={seat}
                              disabled={
                                selectedSeats.includes(seat) &&
                                selectedSeats[index] !== seat
                              }
                            >
                              {seat}{" "}
                              {selectedSeats.includes(seat) &&
                              selectedSeats[index] !== seat
                                ? "(Sudah dipilih)"
                                : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Ringkasan Pemesanan
              </h2>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kereta</span>
                  <span className="font-medium text-right">
                    {ticket.trainName}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rute</span>
                  <span className="font-medium text-right">
                    {ticket.originStationName} → {ticket.destinationStationName}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium">
                    {formatDate(ticket.schedule.departureTime)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Berangkat</span>
                  <span className="font-medium">
                    {formatTime(ticket.schedule.departureTime)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiba</span>
                  <span className="font-medium">
                    {formatTime(ticket.schedule.arrivalTime)}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-3">
                {passengers.map((passenger, index) => {
                  const type = passengerTypes.find(
                    (t) => t.value === passenger.type
                  );
                  const multiplier = type ? type.priceMultiplier : 1;
                  const price = ticket.price * multiplier;

                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        Penumpang {index + 1} ({type?.label})
                      </span>
                      <span className="font-medium">{formatPrice(price)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {formatPrice(calculateTotalPrice())}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {orderSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    ✅ Pemesanan berhasil! Mengarahkan ke halaman konfirmasi...
                  </p>
                </div>
              )}

              {/* Order Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={orderLoading || orderSuccess}
                className="w-full mt-6 bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center"
              >
                {orderLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Bayar Sekarang
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Transaksi aman dan terenkripsi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
