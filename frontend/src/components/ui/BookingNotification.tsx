import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Link } from "react-router-dom";

const BookingNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const desktopVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -20,
      y: 100,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      y: 100,
      scale: 0.9,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  // Animation variants untuk mobile (turun dari atas)
  const mobileVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 0,
      y: -100,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      x: 0,
      y: -100,
      scale: 0.9,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Desktop Notification */}
          <motion.div
            className="hidden md:flex fixed bottom-6 left-6 z-50 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-2xl border border-orange-100 max-w-xs backdrop-blur-sm bg-white/95"
            variants={desktopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative p-4">
              {/* Decorative Elements */}
              <button
                onClick={handleClose}
                className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                aria-label="Tutup notifikasi"
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Cek Jadwal Harian!
                  </h3>
                  <p className="text-xs text-gray-600 mb-3 leading-tight">
                    Nikmati perjalanan lebih{" "}
                    <span className="font-semibold text-orange-600">
                      nyaman
                    </span>{" "}
                    dengan pilihan jadwal yang fleksibel.
                  </p>

                  <div className="flex space-x-2">
                    <Link
                      to="/booking"
                      className="flex-1 px-3 py-2 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-md text-center"
                      onClick={handleClose}
                    >
                      Lihat Jadwal
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Notification - Positioned lower to account for navbar */}
          <motion.div
            className="md:hidden fixed top-20 left-4 right-4 z-50 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-2xl border border-orange-100 backdrop-blur-sm bg-white/95"
            variants={mobileVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative p-4">
              {/* Badge */}
              <button
                onClick={handleClose}
                className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                aria-label="Tutup notifikasi"
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Jadwal Terbaru!
                  </h3>
                  <p className="text-xs text-gray-600 leading-tight">
                    Cek jadwal kereta harian sekarang
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to="/booking"
                    className="px-4 py-2 bg-orange-500 text-white text-xs font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    onClick={handleClose}
                  >
                    Cek
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingNotification;
