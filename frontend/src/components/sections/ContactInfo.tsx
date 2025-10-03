import {
  MapPin,
  Phone,
  Mail,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Headphones,
} from "lucide-react";

const ContactInfo = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kami siap melayani dan menjawab pertanyaan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Kantor Pusat
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Alamat</p>
                    <p className="text-gray-600">
                      Jl. Perintis Kemerdekaan No.1
                      <br />
                      Bandung, Jawa Barat, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Telepon</p>
                    <p className="text-gray-600">(021) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Email</p>
                    <p className="text-gray-600">info@kai.id</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Additional Info */}
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Ikuti Kami
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Twitter", icon: <Twitter className="w-6 h-6" /> },
                  {
                    name: "Instagram",
                    icon: <Instagram className="w-6 h-6" />,
                  },
                  { name: "LinkedIn", icon: <Linkedin className="w-6 h-6" /> },
                  { name: "Facebook", icon: <Facebook className="w-6 h-6" /> },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center justify-center space-x-3 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group hover:border-red-600"
                  >
                    <div className="text-gray-600 group-hover:text-red-600 transition-colors">
                      {social.icon}
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Layanan Pelanggan
              </h3>
              <p className="text-gray-600 mb-4">
                Tim customer service kami siap membantu 24/7 melalui berbagai
                channel
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full">
                Hubungi Customer Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
