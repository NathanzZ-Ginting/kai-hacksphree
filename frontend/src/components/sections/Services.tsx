import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import penumpangIcon from "/assets/images/services/angkutan_penumpang.jpg";
import barangIcon from "/assets/images/services/angkutan_barang.jpg";
import asetIcon from "/assets/images/services/pengusahaan_aset.jpg";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: "image",
      image: penumpangIcon,
      title: "Angkutan Penumpang",
      description:
        "Layanan transportasi penumpang yang nyaman dan terpercaya untuk perjalanan Anda",
      features: ["Fasilitas Utama", "Promo", "Jelajah Nusantara"],
      href: "/services/passenger",
    },
    {
      icon: "image",
      image: barangIcon,
      title: "Angkutan Barang",
      description:
        "Solusi pengiriman barang yang efisien dan aman untuk berbagai kebutuhan",
      features: ["Angkutan Retail", "Angkutan Korporat"],
      href: "/services/logistics",
    },
    {
      icon: "image",
      image: asetIcon,
      title: "Pengusahaan Aset",
      description:
        "Optimalisasi pemanfaatan aset properti untuk nilai tambah maksimal",
      features: ["Area Kontrol", "Space Iklan", "Bangunan Dinas"],
      href: "/services/property",
    },
  ];

  const handleServiceClick = (href: string) => {
    navigate(href);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Layanan Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Berbagai layanan terpadu untuk memenuhi kebutuhan transportasi dan
            logistik Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 p-6 group cursor-pointer relative overflow-hidden border border-gray-100 hover:border-red-100"
              onClick={() => handleServiceClick(service.href)}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

              <div className="relative z-10">
                <div className="w-full flex items-center justify-center mb-4">
                  {service.icon === "image" ? (
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors duration-300">
                      <User className="h-6 w-6 text-red-500" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300"
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 group-hover:bg-red-600 transition-colors duration-300"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-100 group-hover:border-red-100 transition-colors duration-300">
                  <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform group-hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-md">
                    Selengkapnya
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
