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
  Plus,
  Minus,
  X,
} from "lucide-react";

// Types (tetap sama)
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

interface OrderResponse {
  success: boolean;
  message: string;
  data?: {
    snapRedirectUrl: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TicketDetail;
}

// Interface baru untuk passenger counter
interface PassengerCounter {
  type: string;
  label: string;
  description: string;
  count: number;
  priceMultiplier: number;
}

// Interface untuk layout kursi
interface SeatLayout {
  rows: number;
  columns: number;
  seatsPerRow: number;
  layout: string[][];
  hasAisle?: boolean;
  businessClass?: boolean;
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

  // State baru untuk modal Midtrans
  const [showMidtransModal, setShowMidtransModal] = useState(false);
  const [snapRedirectUrl, setSnapRedirectUrl] = useState("");

  // Form states baru
  const [passengerCounters, setPassengerCounters] = useState<
    PassengerCounter[]
  >([
    {
      type: "dewasa",
      label: "Dewasa",
      description: "Umur 13 tahun ke atas",
      count: 1,
      priceMultiplier: 1,
    },
    {
      type: "anak",
      label: "Anak-anak",
      description: "Umur 3-12 tahun",
      count: 0,
      priceMultiplier: 0.7,
    },
  ]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<number>(1);

  const API_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

  // Data gerbong berdasarkan kategori kereta
  const getCoachesByCategory = (category: string): number[] => {
    switch (category.toLowerCase()) {
      case "eksekutif":
        return [1, 2, 3]; // 3 gerbong untuk eksekutif
      case "bisnis":
        return [1, 2, 3, 4]; // 4 gerbong untuk bisnis
      case "ekonomi":
        return [1, 2, 3, 4, 5, 6, 7, 8]; // 8 gerbong untuk ekonomi
      case "luxury":
        return [1, 2]; // 2 gerbong untuk luxury
      case "priority":
        return [1, 2, 3]; // 3 gerbong untuk priority
      default:
        return [1, 2, 3, 4]; // default 4 gerbong
    }
  };

  // Layout kursi berdasarkan kategori kereta
  const getSeatLayoutByCategory = (category: string): SeatLayout => {
    const categoryLower = category.toLowerCase();

    if (categoryLower === "eksekutif") {
      return {
        rows: 10,
        columns: 4,
        seatsPerRow: 4,
        hasAisle: true,
        businessClass: true,
        layout: [
          ["A1", "A2", "", "A3", "A4"],
          ["B1", "B2", "", "B3", "B4"],
          ["C1", "C2", "", "C3", "C4"],
          ["D1", "D2", "", "D3", "D4"],
          ["E1", "E2", "", "E3", "E4"],
          ["F1", "F2", "", "F3", "F4"],
          ["G1", "G2", "", "G3", "G4"],
          ["H1", "H2", "", "H3", "H4"],
          ["I1", "I2", "", "I3", "I4"],
          ["J1", "J2", "", "J3", "J4"],
        ],
      };
    }

    if (categoryLower === "bisnis") {
      return {
        rows: 12,
        columns: 4,
        seatsPerRow: 4,
        hasAisle: true,
        layout: [
          ["A1", "A2", "", "A3", "A4"],
          ["B1", "B2", "", "B3", "B4"],
          ["C1", "C2", "", "C3", "C4"],
          ["D1", "D2", "", "D3", "D4"],
          ["E1", "E2", "", "E3", "E4"],
          ["F1", "F2", "", "F3", "F4"],
          ["G1", "G2", "", "G3", "G4"],
          ["H1", "H2", "", "H3", "H4"],
          ["I1", "I2", "", "I3", "I4"],
          ["J1", "J2", "", "J3", "J4"],
          ["K1", "K2", "", "K3", "K4"],
          ["L1", "L2", "", "L3", "L4"],
        ],
      };
    }

    if (categoryLower === "luxury") {
      return {
        rows: 8,
        columns: 3,
        seatsPerRow: 3,
        hasAisle: true,
        businessClass: true,
        layout: [
          ["A1", "A2", "A3"],
          ["B1", "B2", "B3"],
          ["C1", "C2", "C3"],
          ["D1", "D2", "D3"],
          ["E1", "E2", "E3"],
          ["F1", "F2", "F3"],
          ["G1", "G2", "G3"],
          ["H1", "H2", "H3"],
        ],
      };
    }

    if (categoryLower === "priority") {
      return {
        rows: 10,
        columns: 3,
        seatsPerRow: 3,
        hasAisle: false,
        layout: [
          ["A1", "A2", "A3"],
          ["B1", "B2", "B3"],
          ["C1", "C2", "C3"],
          ["D1", "D2", "D3"],
          ["E1", "E2", "E3"],
          ["F1", "F2", "F3"],
          ["G1", "G2", "G3"],
          ["H1", "H2", "H3"],
          ["I1", "I2", "I3"],
          ["J1", "J2", "J3"],
        ],
      };
    }

    // Default: Ekonomi
    return {
      rows: 14,
      columns: 4,
      seatsPerRow: 4,
      hasAisle: true,
      layout: [
        ["A1", "A2", "", "A3", "A4"],
        ["B1", "B2", "", "B3", "B4"],
        ["C1", "C2", "", "C3", "C4"],
        ["D1", "D2", "", "D3", "D4"],
        ["E1", "E2", "", "E3", "E4"],
        ["F1", "F2", "", "F3", "F4"],
        ["G1", "G2", "", "G3", "G4"],
        ["H1", "H2", "", "H3", "H4"],
        ["I1", "I2", "", "I3", "I4"],
        ["J1", "J2", "", "J3", "J4"],
        ["K1", "K2", "", "K3", "K4"],
        ["L1", "L2", "", "L3", "L4"],
        ["M1", "M2", "", "M3", "M4"],
        ["N1", "N2", "", "N3", "N4"],
      ],
    };
  };

  // Generate semua kursi berdasarkan gerbong dan kategori
  const generateAllSeats = (category: string) => {
    const allSeats: string[] = [];
    const coaches = getCoachesByCategory(category);
    const seatLayout = getSeatLayoutByCategory(category);

    coaches.forEach((coach) => {
      seatLayout.layout.forEach((row) => {
        row.forEach((seat) => {
          if (seat && seat.trim() !== "") {
            allSeats.push(`${coach}${seat}`);
          }
        });
      });
    });
    return allSeats;
  };

  const [allSeats, setAllSeats] = useState<string[]>([]);

  // Update seats ketika ticket berubah
  useEffect(() => {
    if (ticket) {
      const seats = generateAllSeats(ticket.trainCategoryName);
      setAllSeats(seats);
    }
  }, [ticket]);

  // Fetch ticket detail
  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        setLoading(true);
        if (location.state?.ticket) {
          setTicket(location.state.ticket);
          setLoading(false);
          return;
        }

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

  // Hitung total passenger
  const totalPassengers = passengerCounters.reduce(
    (total, counter) => total + counter.count,
    0
  );

  // Update selected seats ketika jumlah passenger berubah
  useEffect(() => {
    if (selectedSeats.length > totalPassengers) {
      setSelectedSeats(selectedSeats.slice(0, totalPassengers));
    } else if (selectedSeats.length < totalPassengers) {
      const newSeats = [...selectedSeats];
      while (newSeats.length < totalPassengers) {
        newSeats.push("");
      }
      setSelectedSeats(newSeats);
    }
  }, [totalPassengers]);

  // Handler untuk passenger counter
  const updatePassengerCount = (type: string, newCount: number) => {
    if (newCount < 0) return;

    setPassengerCounters((prev) =>
      prev.map((counter) =>
        counter.type === type ? { ...counter, count: newCount } : counter
      )
    );
  };

  // Handler untuk memilih kursi
  const handleSeatSelect = (seat: string, passengerIndex: number) => {
    // Cek apakah kursi sudah dipilih oleh passenger lain
    if (
      selectedSeats.includes(seat) &&
      selectedSeats[passengerIndex] !== seat
    ) {
      return;
    }

    const updatedSeats = [...selectedSeats];
    updatedSeats[passengerIndex] = seat;
    setSelectedSeats(updatedSeats);
  };

  // Generate typePassenger array sesuai format yang diinginkan
  const generateTypePassengerArray = (): string[] => {
    const typeArray: string[] = [];
    passengerCounters.forEach((counter) => {
      for (let i = 0; i < counter.count; i++) {
        typeArray.push(counter.type);
      }
    });
    return typeArray;
  };

  const calculateTotalPrice = () => {
    if (!ticket) return 0;

    let total = 0;
    passengerCounters.forEach((counter) => {
      total += ticket.price * counter.priceMultiplier * counter.count;
    });
    return total;
  };

  const handleSubmitOrder = async () => {
    if (!ticket) return;

    // Validasi
    if (totalPassengers === 0) {
      setError("Harap pilih minimal 1 penumpang");
      return;
    }

    if (
      selectedSeats.length !== totalPassengers ||
      selectedSeats.some((seat) => !seat)
    ) {
      setError("Harap pilih kursi untuk semua penumpang");
      return;
    }

    try {
      setOrderLoading(true);
      setError("");

      const userDataString = localStorage.getItem("userData");

      if (!userDataString) {
        setError("User data tidak ditemukan. Silakan login kembali.");
        return;
      }

      let userUuid: string;

      try {
        const userData = JSON.parse(userDataString);
        userUuid = userData.uuid;

        if (!userUuid || typeof userUuid !== "string") {
          throw new Error("UUID tidak valid");
        }
      } catch (parseError) {
        console.error("Error parsing userData:", parseError);
        setError("Format user data tidak valid. Silakan login kembali.");
        return;
      }

      const typePasangger = generateTypePassengerArray();

      const orderData = {
        userUuid: userUuid,
        ticketUuid: ticket.uuid,
        totalPasangger: totalPassengers,
        totalPrice: calculateTotalPrice(),
        typePasangger: typePasangger,
        seatNumbers: selectedSeats,
      };

      console.log("Order data:", orderData);

      const response = await axios.post<OrderResponse>(
        `${API_URL}/order/order-ticket`,
        orderData
      );

      if (response.data.success && response.data.data) {
        setOrderSuccess(true);
        setSnapRedirectUrl(response.data.data.snapRedirectUrl);
        setShowMidtransModal(true);
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

  // Handler untuk modal Midtrans
  const handleCloseMidtransModal = () => {
    setShowMidtransModal(false);
    setOrderSuccess(false);
    // Redirect ke halaman success atau tetap di halaman ini
    // navigate("/booking/success");
  };

  // Handler untuk membuka Midtrans di tab baru
  const handleOpenMidtransInNewTab = () => {
    window.open(snapRedirectUrl, "_blank");
  };

  // Filter kursi berdasarkan gerbong yang dipilih
  const getSeatsByCoach = (coach: number) => {
    return allSeats.filter((seat) => seat.startsWith(coach.toString()));
  };

  const currentCoachSeats = getSeatsByCoach(selectedCoach);

  // Helper functions
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

  // Render seat layout berdasarkan kategori
  const renderSeatLayout = () => {
    if (!ticket) return null;

    const seatLayout = getSeatLayoutByCategory(ticket.trainCategoryName);
    const categoryLower = ticket.trainCategoryName.toLowerCase();

    return (
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-2">
          {seatLayout.layout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-2">
              {row.map((seat, seatIndex) => {
                if (seat === "") {
                  // Render aisle
                  return (
                    <div
                      key={`aisle-${rowIndex}-${seatIndex}`}
                      className="w-12 h-12 flex items-center justify-center"
                    >
                      <div className="w-1 h-8 bg-gray-300 rounded"></div>
                    </div>
                  );
                }

                const fullSeatNumber = `${selectedCoach}${seat}`;
                const isSelected = selectedSeats.includes(fullSeatNumber);
                const passengerIndex = selectedSeats.findIndex(
                  (s) => s === fullSeatNumber
                );
                const isOccupied = Math.random() < 0.2; // Simulasi kursi terisi

                // Tentukan ukuran kursi berdasarkan kategori
                const seatSize =
                  categoryLower === "luxury"
                    ? "w-14 h-14"
                    : categoryLower === "eksekutif"
                    ? "w-12 h-12"
                    : "w-10 h-10";

                return (
                  <button
                    key={seat}
                    onClick={() => {
                      if (!isOccupied) {
                        const availableIndex = selectedSeats.findIndex(
                          (s, idx) =>
                            !s && !selectedSeats.includes(fullSeatNumber)
                        );
                        if (availableIndex !== -1) {
                          handleSeatSelect(fullSeatNumber, availableIndex);
                        }
                      }
                    }}
                    disabled={isOccupied && !isSelected}
                    className={`${seatSize} rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-orange-600 text-white scale-105 shadow-lg"
                        : isOccupied
                        ? "bg-red-500 text-white cursor-not-allowed opacity-70"
                        : "bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:shadow-md"
                    } ${
                      categoryLower === "luxury"
                        ? "border-2 border-gold"
                        : categoryLower === "eksekutif"
                        ? "border border-blue-300"
                        : "border border-gray-300"
                    }`}
                  >
                    <span
                      className={
                        categoryLower === "luxury"
                          ? "text-xs font-bold"
                          : "text-xs"
                      }
                    >
                      {seat}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] mt-1">
                        P{passengerIndex + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Informasi tambahan berdasarkan kategori */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {categoryLower === "luxury" && (
            <p>
              ✨ Luxury Class - Lebih luas dan nyaman dengan fasilitas premium
            </p>
          )}
          {categoryLower === "eksekutif" && (
            <p>💺 Executive Class - Kenyamanan premium dengan legroom ekstra</p>
          )}
          {categoryLower === "bisnis" && (
            <p>💼 Business Class - Nyaman untuk perjalanan bisnis</p>
          )}
          {categoryLower === "ekonomi" && (
            <p>🚉 Economy Class - Hemat dengan kenyamanan terjamin</p>
          )}
        </div>
      </div>
    );
  };

  // Modal Midtrans
  const MidtransModal = () => {
    if (!showMidtransModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              Lanjutkan Pembayaran
            </h3>
            <button
              onClick={handleCloseMidtransModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Pemesanan Berhasil!
              </h4>
              <p className="text-gray-600">
                Silakan lanjutkan pembayaran melalui Midtrans untuk
                menyelesaikan pemesanan Anda.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">
                  Total Pembayaran:
                </span>
                <span className="text-blue-700 font-bold">
                  {ticket && formatPrice(calculateTotalPrice())}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  // Buka Midtrans di iframe atau tab saat ini
                  window.location.href = snapRedirectUrl;
                }}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Bayar Sekarang
              </button>

              <button
                onClick={handleOpenMidtransInNewTab}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Buka di Tab Baru
              </button>

              <button
                onClick={handleCloseMidtransModal}
                className="w-full text-gray-600 py-3 rounded-lg hover:text-gray-800 transition-colors font-medium"
              >
                Bayar Nanti
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Pembayaran aman diproses oleh Midtrans</p>
            </div>
          </div>
        </div>
      </div>
    );
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

  const coaches = getCoachesByCategory(ticket.trainCategoryName);
  const seatLayout = getSeatLayoutByCategory(ticket.trainCategoryName);

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
                    <p className="text-sm text-gray-600 mt-1">
                      {seatLayout.rows} baris × {seatLayout.columns} kolom
                      {seatLayout.hasAisle && " • Dengan lorong"}
                      {seatLayout.businessClass && " • Kelas bisnis"}
                    </p>
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

            {/* New Passenger Counter Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Jumlah Penumpang
              </h2>

              <div className="space-y-6">
                {passengerCounters.map((counter, index) => (
                  <div
                    key={counter.type}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {counter.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {counter.description}
                      </p>
                      <p className="text-sm text-orange-600 font-medium mt-1">
                        {formatPrice(ticket.price * counter.priceMultiplier)} /
                        orang
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() =>
                          updatePassengerCount(counter.type, counter.count - 1)
                        }
                        disabled={counter.count === 0}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="text-xl font-bold w-8 text-center text-gray-700">
                        {counter.count}
                      </span>

                      <button
                        onClick={() =>
                          updatePassengerCount(counter.type, counter.count + 1)
                        }
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Passengers Summary */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total Penumpang
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalPassengers} orang
                  </span>
                </div>
              </div>
            </div>

            {/* Seat Selection */}
            {totalPassengers > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Pilih Kursi
                </h2>

                {/* Coach Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pilih Gerbong ({coaches.length} gerbong tersedia)
                  </h3>
                  <div className="flex space-x-2">
                    {coaches.map((coach) => (
                      <button
                        key={coach}
                        onClick={() => setSelectedCoach(coach)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                          selectedCoach === coach
                            ? "bg-orange-600 text-white scale-110 shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {coach}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seat Layout */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Gerbong {selectedCoach} - {ticket.trainCategoryName}
                  </h3>

                  {/* Train Coach Visualization */}
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="text-center text-white mb-4 font-semibold">
                      GERBONG {selectedCoach} -{" "}
                      {ticket.trainCategoryName.toUpperCase()}
                    </div>

                    {/* Dynamic Seat Layout */}
                    {renderSeatLayout()}
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Tersedia</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-orange-600 rounded"></div>
                      <span>Terpilih</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Terisi</span>
                    </div>
                  </div>
                </div>

                {/* Selected Seats Summary */}
                {selectedSeats.filter((seat) => seat).length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Kursi Terpilih:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(
                        (seat, index) =>
                          seat && (
                            <div
                              key={index}
                              className="bg-white px-3 py-2 rounded-lg border border-green-200"
                            >
                              <span className="font-semibold">
                                Penumpang {index + 1}:{" "}
                              </span>
                              <span className="text-green-600 font-bold">
                                {seat}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
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
                  <span className="font-medium text-right text-gray-700">
                    {ticket.trainName}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kelas</span>
                  <span className="font-medium text-right text-gray-700">
                    {ticket.trainCategoryName}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rute</span>
                  <span className="font-medium text-right text-gray-700">
                    {ticket.originStationName} → {ticket.destinationStationName}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium text-gray-700">
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
                {passengerCounters
                  .map((counter) => {
                    if (counter.count > 0) {
                      const totalForType =
                        ticket.price * counter.priceMultiplier * counter.count;
                      return (
                        <div
                          key={counter.type}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {counter.label} ({counter.count} orang)
                          </span>
                          <span className="font-medium">
                            {formatPrice(totalForType)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })
                  .filter(Boolean)}
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

              {/* Selected Seats */}
              {selectedSeats.filter((seat) => seat).length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Kursi:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedSeats.map(
                      (seat, index) =>
                        seat && (
                          <span
                            key={index}
                            className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm"
                          >
                            {seat}
                          </span>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {orderSuccess && !showMidtransModal && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    ✅ Pemesanan berhasil! Mengarahkan ke pembayaran...
                  </p>
                </div>
              )}

              {/* Order Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={
                  orderLoading ||
                  orderSuccess ||
                  totalPassengers === 0 ||
                  selectedSeats.length !== totalPassengers ||
                  selectedSeats.some((seat) => !seat)
                }
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

      {/* Midtrans Modal */}
      <MidtransModal />
    </div>
  );
};

export default TicketDetailPage;
