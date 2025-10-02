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
    },
    {
      icon: "image",
      image: barangIcon,
      title: "Angkutan Barang",
      description:
        "Solusi pengiriman barang yang efisien dan aman untuk berbagai kebutuhan",
      features: ["Angkutan Retail", "Angkutan Korporat"],
    },
    {
      icon: "image",
      image: asetIcon,
      title: "Pengusahaan Aset",
      description:
        "Optimalisasi pemanfaatan aset properti untuk nilai tambah maksimal",
      features: ["Area Kontrol", "Space Iklan", "Bangunan Dinas"],
    },
  ];

  const handleServiceClick = () => {
    navigate("/services");
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
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 group cursor-pointer relative overflow-hidden"
            >
              <div className="w-full flex items-center justify-center mb-4">
                {service.icon === "image" ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full object-contain"
                  />
                ) : (
                  <User className="h-6 w-6 group-hover:text-white" />
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600 mb-4">{service.description}</p>

              <ul className="space-y-2 mb-12">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-500"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer">
                <button
                  onClick={handleServiceClick}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                >
                  Selengkapnya
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
