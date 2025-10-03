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
    <section className="py-24 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">
            Hubungi <span className="text-orange-500">Kami</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kami siap melayani dan menjawab pertanyaan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-10">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Kantor Pusat
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-lg mb-1">Alamat</p>
                    <p className="text-gray-600 text-lg">
                      Jl. Perintis Kemerdekaan No.1
                      <br />
                      Bandung, Jawa Barat, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-lg mb-1">Telepon</p>
                    <p className="text-gray-600 text-lg">(021) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-lg mb-1">Email</p>
                    <p className="text-gray-600 text-lg">cs@kai.id</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interactive map placeholder */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Lokasi Kami</h4>
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-red-600 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Kantor Pusat KAI</p>
                  <p className="text-gray-500 text-sm">Bandung, Jawa Barat</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form & Additional Info */}
          <div className="space-y-10">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Kirim Pesan
              </h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nama</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Subjek</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Subjek pesan"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Pesan</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Tulis pesan Anda..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-10 border border-gray-200">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Ikuti Kami
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { name: "Twitter", icon: <Twitter className="w-6 h-6" />, color: "text-blue-400 hover:text-blue-500" },
                  { name: "Instagram", icon: <Instagram className="w-6 h-6" />, color: "text-pink-400 hover:text-pink-500" },
                  { name: "LinkedIn", icon: <Linkedin className="w-6 h-6" />, color: "text-blue-600 hover:text-blue-700" },
                  { name: "Facebook", icon: <Facebook className="w-6 h-6" />, color: "text-blue-800 hover:text-blue-900" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center justify-center space-x-3 bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group hover:border-red-600"
                  >
                    <div className={`${social.color} transition-colors`}>
                      {social.icon}
                    </div>
                    <span className="font-bold text-gray-700 group-hover:text-red-600 transition-colors">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Customer Service */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-10 border border-red-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Layanan Pelanggan
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Tim customer service kami siap membantu 24/7 melalui berbagai channel
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 w-full">
                  Hubungi Customer Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
