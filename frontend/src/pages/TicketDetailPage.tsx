import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Train,
  CreditCard,
  Shield,
  Plus,
  Minus,
  X,
  DoorOpen,
  Armchair,
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
  trainUuid: string;
  trainName: string;
  trainCategoryName: string;
  originStationName: string;
  destinationStationName: string;
}

interface Seat {
  uuid: string;
  trainId: string;
  nameSeat: string;
  categoryTrain: string;
  isAvailable?: boolean;
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

interface SeatApiResponse {
  success: boolean;
  message: string;
  data: Seat[];
}

interface PassengerCounter {
  type: string;
  label: string;
  description: string;
  count: number;
  priceMultiplier: number;
}

interface SeatLayout {
  rows: number;
  columns: number;
  seatsPerRow: number;
  layout: string[][];
  hasAisle?: boolean;
}

const TicketDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-gray-400">
            <div className="w-5 h-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Detail Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="h-8 bg-gray-300 rounded w-64 mb-6 animate-pulse"></div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-48 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-40 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="h-8 bg-gray-300 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-32 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="flex-1 px-6 text-center">
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2 mx-auto animate-pulse"></div>
                    <div className="h-1 bg-gray-300 rounded-full relative animate-pulse">
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full"></div>
                      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="h-8 bg-gray-300 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-32 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
                    <div className="h-8 bg-gray-300 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Counter Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="h-8 bg-gray-300 rounded w-48 mb-6 animate-pulse"></div>
              <div className="space-y-6">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl animate-pulse"
                  >
                    <div className="flex-1">
                      <div className="h-6 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-40 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="h-6 bg-gray-300 rounded w-8 animate-pulse"></div>
                      <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-100 rounded-xl border border-gray-200 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                  <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Seat Selection Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="h-8 bg-gray-300 rounded w-32 mb-6 animate-pulse"></div>
              <div className="mb-8">
                <div className="h-6 bg-gray-300 rounded w-48 mb-4 animate-pulse"></div>
                <div className="flex space-x-3">
                  {[1, 2, 3].map((coach) => (
                    <div
                      key={coach}
                      className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg p-6 h-64 animate-pulse"></div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="h-8 bg-gray-300 rounded w-48 mb-6 animate-pulse"></div>
              <div className="space-y-4 mb-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
                  <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="w-full mt-6 bg-gray-300 text-gray-300 py-4 rounded-lg font-semibold flex items-center justify-center animate-pulse">
                Memuat...
              </div>
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-300 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TicketDetailPage = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showMidtransModal, setShowMidtransModal] = useState(false);
  const [snapRedirectUrl, setSnapRedirectUrl] = useState("");
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
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  const API_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        setLoading(true);
        if (location.state?.ticket) {
          console.log(
            "Using ticket from location state:",
            location.state.ticket
          );
          setTicket(location.state.ticket);
          if (location.state.ticket.trainUuid) {
            console.log(
              "Fetching seats for trainUuid from state:",
              location.state.ticket.trainUuid
            );
            await fetchSeats(location.state.ticket.trainUuid);
          } else {
            console.warn("No trainUuid found in location state ticket");
          }
          setLoading(false);
          return;
        }

        console.log("Fetching ticket detail for UUID:", uuid);
        const response = await axios.get<ApiResponse>(
          `${API_URL}/master-data/ticket/${uuid}`
        );

        if (response.data.success) {
          setTicket(response.data.data);
          if (response.data.data.trainUuid) {
            console.log(
              "Fetching seats for trainUuid from API:",
              response.data.data.trainUuid
            );
            await fetchSeats(response.data.data.trainUuid);
          } else {
            console.warn(
              "No trainUuid found in API response",
              response.data.data
            );
          }
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

    const fetchSeats = async (trainUuid: string) => {
      try {
        console.log("Fetching seats for trainUuid:", trainUuid);
        const response = await axios.get<SeatApiResponse>(
          `${API_URL}/master-data/train-seat/${trainUuid}`
        );

        if (response.data.success) {
          const seatsWithAvailability = response.data.data.map((seat) => ({
            ...seat,
            isAvailable: Math.random() > 0.3,
          }));

          setSeats(seatsWithAvailability);
          const occupied = seatsWithAvailability
            .filter((seat) => !seat.isAvailable)
            .map((seat) => seat.nameSeat);
          setOccupiedSeats(occupied);
        } else {
          console.error("Failed to load seats:", response.data.message);
          setError("Gagal memuat data kursi");
        }
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError("Terjadi kesalahan saat memuat data kursi");
      }
    };

    if (uuid) {
      fetchTicketDetail();
    }
  }, [uuid, location.state]);

  const getCoaches = () => {
    if (seats.length === 0) return [];
    const coachSet = new Set<number>();
    seats.forEach((seat) => {
      const coachNum = parseInt(seat.nameSeat.charAt(0));
      if (!isNaN(coachNum)) {
        coachSet.add(coachNum);
      }
    });
    return Array.from(coachSet).sort((a, b) => a - b);
  };

  const getSeatLayoutForCoach = (coach: number): SeatLayout => {
    const coachSeats = getSeatsByCoach(coach);

    if (coachSeats.length === 0) {
      return {
        rows: 0,
        columns: 0,
        seatsPerRow: 0,
        hasAisle: false,
        layout: [],
      };
    }

    const seatsByRow: { [key: string]: string[] } = {};
    coachSeats.forEach((seatName) => {
      const rowMatch = seatName.match(/^\d+([A-Z])\d+$/);
      if (rowMatch) {
        const rowLetter = rowMatch[1];
        if (!seatsByRow[rowLetter]) {
          seatsByRow[rowLetter] = [];
        }
        seatsByRow[rowLetter].push(seatName);
      }
    });

    const sortedRows = Object.keys(seatsByRow).sort();
    const layout: string[][] = [];

    const categoryLower = ticket?.trainCategoryName.toLowerCase() || "bisnis";
    const isLuxuryOrPriority =
      categoryLower === "luxury" || categoryLower === "priority";

    sortedRows.forEach((rowLetter) => {
      const rowSeats = seatsByRow[rowLetter].sort((a, b) => {
        const aNum = parseInt(a.slice(-1));
        const bNum = parseInt(b.slice(-1));
        return aNum - bNum;
      });

      if (isLuxuryOrPriority) {
        layout.push([rowSeats[0] || "", "", rowSeats[1] || ""]);
      } else {
        layout.push([
          rowSeats[0] || "",
          rowSeats[1] || "",
          "",
          rowSeats[2] || "",
          rowSeats[3] || "",
        ]);
      }
    });

    const seatsPerRow = isLuxuryOrPriority ? 2 : 4;
    const columns = isLuxuryOrPriority ? 3 : 5;

    return {
      rows: layout.length,
      columns,
      seatsPerRow,
      hasAisle: true,
      layout,
    };
  };

  const getSeatsByCoach = (coach: number): string[] => {
    return seats
      .filter((seat) => seat.nameSeat.startsWith(coach.toString()))
      .map((seat) => seat.nameSeat);
  };

  const totalPassengers = passengerCounters.reduce(
    (total, counter) => total + counter.count,
    0
  );

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

  const updatePassengerCount = (type: string, newCount: number) => {
    if (newCount < 0) return;
    setPassengerCounters((prev) =>
      prev.map((counter) =>
        counter.type === type ? { ...counter, count: newCount } : counter
      )
    );
  };

  const handleSeatSelect = (seat: string, index: number) => {
    const seatData = seats.find((s) => s.nameSeat === seat);
    if (!seatData?.isAvailable) return;

    const updatedSeats = [...selectedSeats];
    if (updatedSeats[index] === seat) {
      updatedSeats[index] = "";
    } else {
      updatedSeats[index] = seat;
    }
    setSelectedSeats(updatedSeats);
  };

  const getSeatStatus = (seatName: string) => {
    if (selectedSeats.includes(seatName)) return "selected";
    if (occupiedSeats.includes(seatName)) return "occupied";
    const seatData = seats.find((seat) => seat.nameSeat === seatName);
    return seatData?.isAvailable ? "available" : "occupied";
  };

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

  const handleCloseMidtransModal = () => {
    setShowMidtransModal(false);
    setOrderSuccess(false);
  };

  const handleOpenMidtransInNewTab = () => {
    window.open(snapRedirectUrl, "_blank");
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

  const getSeatType = (seatName: string): "window" | "aisle" => {
    const seatNumber = parseInt(seatName.slice(-1));
    const categoryLower = ticket?.trainCategoryName.toLowerCase() || "";
    const isLuxuryOrPriority =
      categoryLower === "luxury" || categoryLower === "priority";

    if (isLuxuryOrPriority) {
      return "window";
    } else {
      return seatNumber === 1 || seatNumber === 4 ? "window" : "aisle";
    }
  };

  const renderSeatLayout = () => {
    if (!ticket) return null;

    const seatLayout = getSeatLayoutForCoach(selectedCoach);
    const categoryLower = ticket.trainCategoryName.toLowerCase();
    const isLuxuryOrPriority =
      categoryLower === "luxury" || categoryLower === "priority";

    const getSeatColor = (seatName: string) => {
      const status = getSeatStatus(seatName);

      switch (status) {
        case "selected":
          return "bg-orange-600 text-white border-orange-800";
        case "occupied":
          return "bg-red-500 text-white border-red-700 opacity-70 cursor-not-allowed";
        case "available":
          return "bg-green-500 text-white border-green-700 hover:bg-green-600 cursor-pointer";
        default:
          return "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed";
      }
    };

    return (
      <div className="bg-white rounded-lg p-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 px-4 rounded-t-lg mb-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center space-x-3">
            <Train className="h-6 w-6 text-orange-400" />
            <span className="font-bold text-lg">GERBONG {selectedCoach}</span>
          </div>
          <div className="text-sm bg-orange-500 px-3 py-1 rounded-full font-semibold">
            {ticket.trainCategoryName.toUpperCase()}
          </div>
        </div>

        <div className="relative bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg p-6 border-4 border-gray-400 shadow-inner">
          <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 rounded-t-lg border-b-2 border-gray-600"></div>
          <div className="absolute top-6 left-4 transform -translate-y-1">
            <div className="bg-gray-700 w-10 h-20 rounded-lg flex items-center justify-center shadow-lg border-2 border-gray-600">
              <DoorOpen className="h-8 w-8 text-gray-300" />
            </div>
          </div>
          <div className="absolute top-6 right-4 transform -translate-y-1">
            <div className="bg-gray-700 w-10 h-20 rounded-lg flex items-center justify-center shadow-lg border-2 border-gray-600">
              <DoorOpen className="h-8 w-8 text-gray-300" />
            </div>
          </div>
          <div className="absolute top-8 left-16 right-16 h-4 bg-blue-200 rounded-lg border border-blue-300 opacity-50"></div>

          <div className="ml-20 mr-20 mt-8">
            <div className="space-y-4">
              {seatLayout.layout.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex justify-between items-center"
                >
                  <div className="flex space-x-3">
                    {row
                      .slice(0, isLuxuryOrPriority ? 1 : 2)
                      .map((seat, seatIndex) => {
                        if (!seat)
                          return (
                            <div
                              key={`empty-${seatIndex}`}
                              className="w-14 h-14"
                            ></div>
                          );

                        const status = getSeatStatus(seat);
                        const isSelectable =
                          status === "available" ||
                          (status === "selected" &&
                            selectedSeats.includes(seat));
                        const passengerIndex = selectedSeats.indexOf(seat);

                        return (
                          <button
                            key={seat}
                            onClick={() => {
                              if (isSelectable) {
                                const indexToUpdate =
                                  passengerIndex !== -1
                                    ? passengerIndex
                                    : selectedSeats.indexOf("");
                                handleSeatSelect(seat, indexToUpdate);
                              }
                            }}
                            disabled={
                              !isSelectable && !selectedSeats.includes(seat)
                            }
                            className={`
                            w-14 h-14 rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all
                            relative border-2 shadow-lg transform hover:scale-110
                            ${getSeatColor(seat)}
                            ${
                              !isSelectable && !selectedSeats.includes(seat)
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }
                          `}
                          >
                            <Armchair className="h-5 w-5 mb-1" />
                            <span className="text-xs">{seat}</span>
                            {status === "selected" && (
                              <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-orange-600 shadow-lg">
                                P{passengerIndex + 1}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>

                  <div className="w-16 h-14 flex items-center justify-center">
                    <div className="w-1 h-12 bg-gray-800 rounded-lg shadow-inner border-2 border-gray-900"></div>
                  </div>

                  <div className="flex space-x-3">
                    {row
                      .slice(
                        isLuxuryOrPriority ? 2 : 3,
                        isLuxuryOrPriority ? 3 : 5
                      )
                      .map((seat, seatIndex) => {
                        if (!seat)
                          return (
                            <div
                              key={`empty-right-${seatIndex}`}
                              className="w-14 h-14"
                            ></div>
                          );

                        const status = getSeatStatus(seat);
                        const isSelectable =
                          status === "available" ||
                          (status === "selected" &&
                            selectedSeats.includes(seat));
                        const passengerIndex = selectedSeats.indexOf(seat);

                        return (
                          <button
                            key={seat}
                            onClick={() => {
                              if (isSelectable) {
                                const indexToUpdate =
                                  passengerIndex !== -1
                                    ? passengerIndex
                                    : selectedSeats.indexOf("");
                                handleSeatSelect(seat, indexToUpdate);
                              }
                            }}
                            disabled={
                              !isSelectable && !selectedSeats.includes(seat)
                            }
                            className={`
                            w-14 h-14 rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all
                            relative border-2 shadow-lg transform hover:scale-110
                            ${getSeatColor(seat)}
                            ${
                              !isSelectable && !selectedSeats.includes(seat)
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }
                          `}
                          >
                            <Armchair className="h-5 w-5 mb-1" />
                            <span className="text-xs">{seat}</span>
                            {status === "selected" && (
                              <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-orange-600 shadow-lg">
                                P{passengerIndex + 1}
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-600 rounded-b-lg border-t-2 border-gray-700"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-bold border-2 border-gray-600">
            GERBONG {selectedCoach}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-700"></div>
            <span className="text-gray-700">Tersedia</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-4 h-4 bg-orange-600 rounded border-2 border-orange-800"></div>
            <span className="text-gray-700">Terpilih</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-700"></div>
            <span className="text-gray-700">Terisi</span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-4 h-4 bg-gray-800 rounded border-2 border-gray-800"></div>
            <span className="text-gray-700">Lorong</span>
          </div>
        </div>
      </div>
    );
  };

  const MidtransModal = () => {
    if (!showMidtransModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-scrollbar">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                  window.location.href = snapRedirectUrl;
                }}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-lg"
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
    return <TicketDetailSkeleton />;
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

  const coaches = getCoaches();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detail Perjalanan
              </h2>
              <div className="space-y-6">
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
                      {getSeatLayoutForCoach(selectedCoach).rows} baris ×{" "}
                      {getSeatLayoutForCoach(selectedCoach).seatsPerRow} kursi
                      per baris
                    </p>
                  </div>
                </div>
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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Jumlah Penumpang
              </h2>
              <div className="space-y-6">
                {passengerCounters.map((counter, index) => (
                  <div
                    key={counter.type}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors"
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
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
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

            {totalPassengers > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Pilih Kursi
                </h2>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pilih Gerbong ({coaches.length} gerbong tersedia)
                  </h3>
                  <div className="flex space-x-3">
                    {coaches.map((coach) => (
                      <button
                        key={coach}
                        onClick={() => setSelectedCoach(coach)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all border-2 shadow-lg ${
                          selectedCoach === coach
                            ? "bg-orange-600 text-white scale-110 border-orange-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                        }`}
                      >
                        {coach}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Gerbong {selectedCoach} - {ticket.trainCategoryName}
                  </h3>
                  {renderSeatLayout()}
                </div>
                {selectedSeats.filter((seat) => seat).length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      🎫 Kursi Terpilih:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedSeats.map(
                        (seat, index) =>
                          seat && (
                            <div
                              key={index}
                              className="bg-white px-4 py-3 rounded-lg border border-green-300 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-700">
                                  Penumpang {index + 1}
                                </span>
                                <span className="text-green-600 font-bold text-lg">
                                  {seat}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-2 flex items-center">
                                {getSeatType(seat) === "window"
                                  ? "🪟 Kursi Jendela"
                                  : "🚶 Kursi Aisle"}
                                <span className="mx-2">•</span>
                                Gerbong {seat.charAt(0)}
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Ringkasan Pemesanan
              </h2>
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
                  <span className="font-medium text-gray-700">
                    {formatTime(ticket.schedule.departureTime)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiba</span>
                  <span className="font-medium text-gray-700">
                    {formatTime(ticket.schedule.arrivalTime)}
                  </span>
                </div>
              </div>
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
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {formatPrice(calculateTotalPrice())}
                  </span>
                </div>
              </div>
              {selectedSeats.filter((seat) => seat).length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Kursi Terpilih:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedSeats.map(
                      (seat, index) =>
                        seat && (
                          <span
                            key={index}
                            className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm border border-orange-200"
                          >
                            {seat}
                          </span>
                        )
                    )}
                  </div>
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              {orderSuccess && !showMidtransModal && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    ✅ Pemesanan berhasil! Mengarahkan ke pembayaran...
                  </p>
                </div>
              )}
              <button
                onClick={handleSubmitOrder}
                disabled={
                  orderLoading ||
                  orderSuccess ||
                  totalPassengers === 0 ||
                  selectedSeats.length !== totalPassengers ||
                  selectedSeats.some((seat) => !seat)
                }
                className="w-full mt-6 bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center shadow-lg"
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
      <MidtransModal />
    </div>
  );
};

export default TicketDetailPage;
