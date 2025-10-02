// Header.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Import images
import penumpangIcon from "/assets/images/services/angkutan_penumpang.jpg";
import barangIcon from "/assets/images/services/angkutan_barang.jpg";
import asetIcon from "/assets/images/services/pengusahaan_aset.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Gunakan Auth Context
  const { isLoggedIn, userData, logout } = useAuth();

  const servicesItems = [
    {
      name: "Angkutan Penumpang",
      href: "/services/passenger",
      image: penumpangIcon,
      description: "Layanan transportasi penumpang yang nyaman dan terpercaya",
      features: ["Fasilitas Utama", "Promo", "Jelajah Nusantara"],
    },
    {
      name: "Angkutan Barang",
      href: "/services/logistics",
      image: barangIcon,
      description: "Solusi pengiriman barang yang efisien dan aman",
      features: ["Angkutan Retail", "Angkutan Korporat"],
    },
    {
      name: "Pengusahaan Aset",
      href: "/services/property",
      image: asetIcon,
      description: "Optimalisasi pemanfaatan aset properti",
      features: ["Area Kontrol", "Space Iklan", "Bangunan Dinas"],
    },
  ];

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    {
      name: "Layanan",
      href: "/services",
      hasDropdown: true,
    },
    { name: "Berita", href: "/news" },
    { name: "Bantuan", href: "/help" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsServicesDropdownOpen(false);
      }

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOrderTicket = () => {
    navigate("/booking");
    setIsMenuOpen(false);
  };

  const handleNavClick = (
    href: string,
    hasDropdown = false,
    isMobile = false
  ) => {
    if (hasDropdown && !isMobile) {
      // Desktop: toggle dropdown
      setIsServicesDropdownOpen(!isServicesDropdownOpen);
    } else {
      // Mobile atau non-dropdown: navigate ke halaman
      navigate(href);
      setIsMenuOpen(false);
      setIsServicesDropdownOpen(false);
    }
  };

  const handleServiceClick = (href: string) => {
    navigate(href);
    setIsServicesDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleRegisterClick = () => {
    navigate("/register");
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    // Clear remember me data (jika ada)
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");

    // Logout dari context
    logout();

    // Reset state
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);

    // Redirect to home
    navigate("/");
  };

  const handleProfileNavigation = (path: string) => {
    navigate(path);
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const isServicesActive = servicesItems.some(
    (item) =>
      location.pathname === item.href || location.pathname.startsWith(item.href)
  );

  // Generate avatar URL using UI Avatars
  const getAvatarUrl = (name: string) => {
    const displayName = name || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=orange&color=fff&size=128&bold=true&rounded=true`;
  };

  return (
    <header
      className={`fixed top-0 z-50 transition-all duration-300 w-full ${
        isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/">
              <img
                src="/assets/images/logos/logo-KAI.png"
                alt="logo KAI"
                className="lg:h-14 h-10"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <button
                  onClick={() => handleNavClick(item.href, item.hasDropdown)}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg flex items-center space-x-1 ${
                    isActive(item.href) ||
                    (item.hasDropdown && isServicesActive)
                      ? "text-orange-600 bg-orange-50 font-semibold"
                      : isScrolled
                      ? "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                      : "text-white hover:text-orange-300 hover:bg-white/20"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isServicesDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Services Dropdown */}
                {item.hasDropdown && isServicesDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in-50 zoom-in-95"
                  >
                    <div className="p-4">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Layanan KAI
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Pilih jenis layanan yang Anda butuhkan
                        </p>
                      </div>

                      <div className="space-y-3">
                        {servicesItems.map((service) => (
                          <button
                            key={service.name}
                            onClick={() => handleServiceClick(service.href)}
                            className={`w-full flex items-start space-x-3 p-3 rounded-xl text-left transition-all hover:bg-orange-50 group ${
                              location.pathname === service.href
                                ? "bg-orange-50 border border-orange-200"
                                : "hover:border-orange-200"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`font-semibold group-hover:text-orange-600 transition-colors ${
                                  location.pathname === service.href
                                    ? "text-orange-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {service.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {service.description}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {service.features
                                  .slice(0, 2)
                                  .map((feature, index) => (
                                    <span
                                      key={index}
                                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                {service.features.length > 2 && (
                                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                                    +{service.features.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              onClick={handleOrderTicket}
            >
              Pesan Tiket
            </button>

            {isLoggedIn ? (
              // Profile dropdown setelah login
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className={`flex items-center space-x-2 p-1 rounded-full transition-colors ${
                    isScrolled ? "hover:bg-gray-100" : "hover:bg-white/20"
                  }`}
                >
                  <img
                    src={getAvatarUrl(userData.name)}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-orange-500"
                  />
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    } ${isScrolled ? "text-gray-700" : "text-white"}`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in-50 zoom-in-95">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getAvatarUrl(userData.name)}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border-2 border-orange-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {userData.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => handleProfileNavigation("/profile")}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Profil Saya</span>
                      </button>

                      <button
                        onClick={() => handleProfileNavigation("/settings")}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Pengaturan</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login/Register buttons sebelum login
              <div className="flex items-center">
                <button
                  className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isScrolled
                      ? "text-gray-700 hover:text-orange-600"
                      : "text-white hover:text-orange-300"
                  }`}
                  onClick={handleLoginClick}
                >
                  Login
                </button>
                <div className="w-px h-6 bg-gray-200"></div>
                <button
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isScrolled
                      ? "text-gray-700 hover:text-orange-600"
                      : "text-white hover:text-orange-300"
                  }`}
                  onClick={handleRegisterClick}
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X
                className={`h-6 w-6 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className={`md:hidden py-4 ${
              isScrolled
                ? "border-t border-gray-200"
                : "border-t border-white/30"
            }`}
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() =>
                      handleNavClick(item.href, item.hasDropdown, true)
                    }
                    className={`w-full text-left px-3 py-2 text-base font-medium rounded-lg transition-colors flex items-center justify-between ${
                      isActive(item.href) ||
                      (item.hasDropdown && isServicesActive)
                        ? "text-orange-600 bg-orange-50 font-semibold"
                        : isScrolled
                        ? "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                        : "text-white hover:text-orange-300 hover:bg-white/20"
                    }`}
                  >
                    <span>{item.name}</span>
                  </button>
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <button
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  onClick={handleOrderTicket}
                >
                  Pesan Tiket
                </button>

                {isLoggedIn ? (
                  // Mobile profile section setelah login
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <img
                        src={getAvatarUrl(userData.name)}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-orange-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">
                          {userData.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {userData.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleProfileNavigation("/profile")}
                      className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      <User className="h-4 w-4" />
                      <span>Profil Saya</span>
                    </button>

                    <button
                      onClick={() => handleProfileNavigation("/settings")}
                      className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Pengaturan</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  // Mobile login/register buttons sebelum login
                  <div className="flex items-center space-x-2">
                    <button
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isScrolled
                          ? "text-gray-700 border border-gray-300 hover:bg-gray-50"
                          : "text-white border border-white/50 hover:bg-white/20"
                      }`}
                      onClick={handleLoginClick}
                    >
                      Login
                    </button>
                    <button
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isScrolled
                          ? "text-gray-700 border border-gray-300 hover:bg-gray-50"
                          : "text-white border border-white/50 hover:bg-white/20"
                      }`}
                      onClick={handleRegisterClick}
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
