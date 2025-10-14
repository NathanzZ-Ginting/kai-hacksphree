import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  LogOut,
  Save,
  X,
  Shield,
  Bell,
  CreditCard,
  MapPin,
  Camera,
  Clock,
  Train,
  Receipt,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface UserProfile {
  uuid: string;
  name: string;
  age: number;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileData {
  name?: string;
  age?: number;
  phoneNumber?: string;
}

interface Transaction {
  id: string;
  orderNumber: string;
  ticketType: string;
  route: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  seatNumber?: string;
  trainName?: string;
  passangerName: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileData>({});
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'security' | 'notifications' | 'payment'>('profile');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.API_URL || "http://localhost:3000/api/v1";

  // Fetch user profile dari backend
  const fetchUserProfile = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.get(`${API_URL}/auth/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setProfile(response.data.data);
      } else {
        throw new Error(response.data.message || "Gagal mengambil data profil");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Sesi telah berakhir, silakan login kembali");
          logout();
          navigate("/login");
          return;
        }
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data profil"
        );
      } else {
        toast.error("Terjadi kesalahan saat mengambil data profil");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (data: UpdateProfileData) => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.put(`${API_URL}/auth/user/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setProfile(response.data.data);
        toast.success("Profil berhasil diperbarui");
        setIsEditing(false);
        setEditForm({});
      } else {
        throw new Error(response.data.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Sesi telah berakhir, silakan login kembali");
          logout();
          navigate("/login");
          return;
        }
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat memperbarui profil"
        );
      } else {
        toast.error("Terjadi kesalahan saat memperbarui profil");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    try {
      setTransactionLoading(true);
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await axios.get(`${API_URL}/auth/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.data.success) {
        setTransactions(response.data.data);
      } else {
        throw new Error(response.data.message || "Gagal mengambil riwayat transaksi");
      }

    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      
      // If no transactions found or user hasn't made any orders, show empty state
      if (error.response?.status === 404 || error.message?.includes("tidak ditemukan")) {
        setTransactions([]);
      } else {
        toast.error("Gagal mengambil riwayat transaksi");
      }
    } finally {
      setTransactionLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "history") {
      fetchTransactions();
    }
  }, [activeTab]);

  const handleEdit = () => {
    if (profile) {
      setEditForm({
        name: profile.name,
        age: profile.age,
        phoneNumber: profile.phoneNumber,
      });
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editForm.name?.trim()) {
      toast.error("Nama tidak boleh kosong");
      return;
    }

    if (!editForm.phoneNumber?.trim()) {
      toast.error("Nomor telepon tidak boleh kosong");
      return;
    }

    if (!editForm.age || editForm.age < 1) {
      toast.error("Usia harus diisi dengan benar");
      return;
    }

    setIsUpdating(true);
    await updateUserProfile(editForm);
  };

  const handleInputChange = (
    field: keyof UpdateProfileData,
    value: string | number
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate avatar URL dengan gradient yang lebih modern
  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=linear-gradient(135deg,orange,orangered)&color=fff&size=128&bold=true&rounded=true`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header Modern dengan Glass Effect */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-orange-100 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={handleBack}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-orange-600 transition-all duration-300 hover:scale-105 group"
            >
              <div className="p-1.5 rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm sm:text-base">Kembali</span>
            </button>

            <div className="text-center">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Profil Saya
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
                Kelola informasi profil Anda
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-105 group"
            >
              <span className="font-medium text-sm sm:text-base">Keluar</span>
              <div className="p-1.5 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                <LogOut className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-orange-100 overflow-hidden lg:sticky lg:top-24">
              {/* Profile Summary */}
              <div className="p-4 sm:p-6 text-center border-b border-orange-50">
                <div className="relative inline-block mb-3 sm:mb-4">
                  <img
                    src={getAvatarUrl(
                      profile?.name || userData?.name || "User"
                    )}
                    alt="Profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <button className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                  {profile?.name || userData?.name}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm truncate">
                  {profile?.email || userData?.email}
                </p>
              </div>

              {/* Navigation Menu */}
              <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base ${
                    activeTab === "profile"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium">Profil Saya</span>
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base ${
                    activeTab === "history"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium">Riwayat Transaksi</span>
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base ${
                    activeTab === "security"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium">Keamanan</span>
                </button>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base ${
                    activeTab === "notifications"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium">Notifikasi</span>
                </button>

                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base ${
                    activeTab === "payment"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium">Pembayaran</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 min-w-0">
            {activeTab === "profile" && (
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-orange-50 bg-gradient-to-r from-orange-50 to-amber-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Informasi Pribadi
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={handleEdit}
                          className="flex items-center justify-center space-x-2 bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="font-medium">Edit Profil</span>
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
                            disabled={isUpdating}
                          >
                            <X className="h-4 w-4" />
                            <span>Batal</span>
                          </button>
                          <button
                            onClick={handleSave}
                            className="flex items-center justify-center space-x-2 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            <span className="text-sm sm:text-base">
                              {isUpdating ? "Menyimpan..." : "Simpan"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      {/* Nama */}
                      <div className="space-y-2 sm:space-y-3">
                        <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-2">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                          <span>Nama Lengkap</span>
                        </label>
                        <input
                          type="text"
                          value={
                            isEditing
                              ? editForm.name || profile?.name || ""
                              : profile?.name || ""
                          }
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-700 focus:border-orange-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-700 transition-all duration-300 bg-white text-sm sm:text-base"
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2 sm:space-y-3">
                        <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-2">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                          <span>Email</span>
                        </label>
                        <input
                          type="email"
                          value={profile?.email || userData?.email || ""}
                          disabled
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed text-sm sm:text-base"
                          placeholder="Email"
                        />
                        <p className="text-xs text-gray-500 flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>Email tidak dapat diubah</span>
                        </p>
                      </div>

                      {/* Nomor Telepon */}
                      <div className="space-y-2 sm:space-y-3">
                        <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-2">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                          <span>Nomor Telepon</span>
                        </label>
                        <input
                          type="tel"
                          value={
                            isEditing
                              ? editForm.phoneNumber ||
                                profile?.phoneNumber ||
                                ""
                              : profile?.phoneNumber || ""
                          }
                          onChange={(e) =>
                            handleInputChange("phoneNumber", e.target.value)
                          }
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-700 focus:border-orange-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-700 transition-all duration-300 bg-white text-sm sm:text-base"
                          placeholder="Contoh: 081234567890"
                        />
                      </div>

                      {/* Usia */}
                      <div className="space-y-2 sm:space-y-3">
                        <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center space-x-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                          <span>Usia</span>
                        </label>
                        <input
                          type="number"
                          value={
                            isEditing
                              ? editForm.age || profile?.age || ""
                              : profile?.age || ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "age",
                              parseInt(e.target.value) || 0
                            )
                          }
                          disabled={!isEditing}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 text-gray-700 focus:ring-orange-500 focus:border-orange-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-700 transition-all duration-300 bg-white text-sm sm:text-base"
                          placeholder="Contoh: 25"
                          min="1"
                          max="120"
                        />
                      </div>
                    </div>

                    {/* Informasi Akun */}
                    <div className="pt-4 sm:pt-6 border-t border-orange-50">
                      <h4 className="text-sm sm:text-md font-semibold text-gray-900 mb-3 sm:mb-4">
                        Informasi Akun
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3">
                          <label className="text-xs sm:text-sm font-semibold text-gray-700">
                            User ID
                          </label>
                          <div className="px-3 sm:px-4 py-2 sm:py-3 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-100">
                            <p className="text-xs sm:text-sm text-orange-800 font-mono truncate">
                              {profile?.uuid || "-"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <label className="text-xs sm:text-sm font-semibold text-gray-700">
                            Bergabung Sejak
                          </label>
                          <div className="px-3 sm:px-4 py-2 sm:py-3 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-100">
                            <p className="text-xs sm:text-sm text-orange-800">
                              {profile?.createdAt
                                ? formatDate(profile.createdAt)
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Cards */}
                <div className="w-full">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-300 text-sm sm:text-base">
                          Poin Loyalty
                        </h4>
                        <p className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">1,250</p>
                        <p className="text-gray-300 text-xs sm:text-sm mt-1">
                          Tukar poin Anda
                        </p>
                      </div>
                      <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction History Tab */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-orange-50 bg-gradient-to-r from-orange-50 to-amber-50">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Riwayat Transaksi
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Lihat semua transaksi pembelian tiket Anda
                    </p>
                  </div>

                  <div className="p-3 sm:p-6">
                    {transactionLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-600 text-sm sm:text-base">Memuat riwayat transaksi...</span>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-12">
                        <Receipt className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                          Belum Ada Transaksi
                        </h4>
                        <p className="text-sm sm:text-base text-gray-500 mb-6 px-4">
                          Anda belum melakukan pembelian tiket apapun
                        </p>
                        <button
                          onClick={() => navigate('/booking')}
                          className="bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-orange-600 transition-all duration-300 font-medium text-sm sm:text-base"
                        >
                          Pesan Tiket Sekarang
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                              <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                                <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                                  <Train className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                      {transaction.orderNumber}
                                    </h4>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 sm:mt-0 self-start ${
                                      transaction.status === 'completed' 
                                        ? 'bg-green-100 text-green-700'
                                        : transaction.status === 'confirmed'
                                        ? 'bg-blue-100 text-blue-700' 
                                        : transaction.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                      {transaction.status === 'completed' && (
                                        <CheckCircle className="h-3 w-3 inline mr-1" />
                                      )}
                                      {transaction.status === 'confirmed' && (
                                        <CheckCircle className="h-3 w-3 inline mr-1" />
                                      )}
                                      {transaction.status === 'pending' && (
                                        <AlertCircle className="h-3 w-3 inline mr-1" />
                                      )}
                                      {transaction.status === 'cancelled' && (
                                        <XCircle className="h-3 w-3 inline mr-1" />
                                      )}
                                      {transaction.status === 'completed' ? 'Selesai' 
                                        : transaction.status === 'confirmed' ? 'Dikonfirmasi'
                                        : transaction.status === 'pending' ? 'Menunggu'
                                        : 'Dibatalkan'}
                                    </span>
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                    <p className="break-words">
                                      <span className="font-medium">{transaction.route}</span>
                                      {transaction.trainName && (
                                        <span className="ml-1 sm:ml-2 text-gray-500 block sm:inline">
                                          • {transaction.trainName}
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-xs sm:text-sm">
                                      {transaction.departureTime} - {transaction.arrivalTime}
                                    </p>
                                    <p className="text-xs sm:text-sm break-words">
                                      Penumpang: {transaction.passangerName}
                                      {transaction.seatNumber && (
                                        <span className="ml-1 sm:ml-2 block sm:inline">• Kursi {transaction.seatNumber}</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right sm:text-right self-start sm:self-auto flex-shrink-0">
                                <p className="text-base sm:text-lg font-bold text-gray-900">
                                  Rp {transaction.price.toLocaleString('id-ID')}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short', 
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs Content */}
            {activeTab !== "profile" && activeTab !== "history" && (
              <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {activeTab === "security" && (
                      <Shield className="h-8 w-8 text-orange-600" />
                    )}
                    {activeTab === "notifications" && (
                      <Bell className="h-8 w-8 text-orange-600" />
                    )}
                    {activeTab === "payment" && (
                      <CreditCard className="h-8 w-8 text-orange-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {activeTab === "security" && "Keamanan Akun"}
                    {activeTab === "notifications" && "Pengaturan Notifikasi"}
                    {activeTab === "payment" && "Metode Pembayaran"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === "security" &&
                      "Kelola kata sandi dan keamanan akun Anda"}
                    {activeTab === "notifications" &&
                      "Atur preferensi notifikasi Anda"}
                    {activeTab === "payment" && "Kelola metode pembayaran Anda"}
                  </p>
                  <button className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all duration-300 font-medium">
                    Kelola {activeTab === "security" && "Keamanan"}
                    {activeTab === "notifications" && "Notifikasi"}
                    {activeTab === "payment" && "Pembayaran"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
