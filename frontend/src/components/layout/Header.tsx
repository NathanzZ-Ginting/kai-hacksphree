import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Train,
  Truck,
  Building,
  Plane,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const servicesItems = [
    {
      name: "Layanan Penumpang",
      href: "/services/passenger",
      icon: Train,
      description: "Kereta penumpang berbagai kelas",
    },
    {
      name: "Logistik & Kargo",
      href: "/services/logistics",
      icon: Truck,
      description: "Pengiriman barang dan logistik",
    },
    {
      name: "Pengelolaan Properti",
      href: "/services/property",
      icon: Building,
      description: "Pengembangan properti stasiun",
    },
    {
      name: "Bandara & Travel",
      href: "/services/airport",
      icon: Plane,
      description: "Konektivitas bandara & travel",
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

  const handleNavClick = (href: string, hasDropdown = false) => {
    if (hasDropdown) {
      setIsServicesDropdownOpen(!isServicesDropdownOpen);
    } else {
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

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const isServicesActive = servicesItems.some(
    (item) =>
      location.pathname === item.href || location.pathname.startsWith(item.href)
  );

  return (
    <header
      className={`fixed top-0 z-50 transition-all duration-300 w-full ${
        isScrolled
          ? "bg-white shadow-md backdrop-blur-sm bg-white/95"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/">
              <img
                src="assets/images/logos/logo-KAI.png"
                alt="logo KAI"
                className="h-14"
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
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in-50 zoom-in-95"
                  >
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Layanan KAI
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Pilih jenis layanan yang Anda butuhkan
                        </p>
                      </div>

                      <div className="space-y-2">
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
                            <div
                              className={`p-2 rounded-lg group-hover:bg-orange-100 transition-colors ${
                                location.pathname === service.href
                                  ? "bg-orange-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <service.icon
                                className={`h-5 w-5 ${
                                  location.pathname === service.href
                                    ? "text-orange-600"
                                    : "text-gray-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div
                                className={`font-medium group-hover:text-orange-600 transition-colors ${
                                  location.pathname === service.href
                                    ? "text-orange-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {service.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {service.description}
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
          <div className="hidden md:flex items-center space-x-4">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-orange-600"
                  : "text-white hover:text-orange-300"
              }`}
            >
              Login
            </button>
            <button
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              onClick={handleOrderTicket}
            >
              Pesan Tiket
            </button>
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
                    onClick={() => handleNavClick(item.href, item.hasDropdown)}
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
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isServicesDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Mobile Services Dropdown - Diperbarui */}
                  {item.hasDropdown && isServicesDropdownOpen && (
                    <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 text-base">
                            Layanan KAI
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Pilih jenis layanan yang Anda butuhkan
                          </p>
                        </div>

                        <div className="space-y-2">
                          {servicesItems.map((service) => (
                            <button
                              key={service.name}
                              onClick={() => handleServiceClick(service.href)}
                              className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-all hover:bg-orange-50 group ${
                                location.pathname === service.href
                                  ? "bg-orange-50 border border-orange-200"
                                  : "hover:border-orange-200"
                              }`}
                            >
                              <div
                                className={`p-2 rounded-lg group-hover:bg-orange-100 transition-colors ${
                                  location.pathname === service.href
                                    ? "bg-orange-100"
                                    : "bg-gray-100"
                                }`}
                              >
                                <service.icon
                                  className={`h-4 w-4 ${
                                    location.pathname === service.href
                                      ? "text-orange-600"
                                      : "text-gray-600"
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <div
                                  className={`font-medium group-hover:text-orange-600 transition-colors ${
                                    location.pathname === service.href
                                      ? "text-orange-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {service.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {service.description}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => handleServiceClick("/services")}
                            className="w-full text-center text-orange-600 hover:text-orange-700 font-medium text-sm py-2"
                          >
                            Lihat Semua Layanan →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <button
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isScrolled
                      ? "text-gray-700 border border-gray-300 hover:bg-gray-50"
                      : "text-white border border-white/50 hover:bg-white/20"
                  }`}
                >
                  Login
                </button>
                <button
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  onClick={handleOrderTicket}
                >
                  Pesan Tiket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
