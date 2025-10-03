const AboutHero = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-block bg-orange-600/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-orange-600/30">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-orange-300">PT Kereta Api Indonesia (Persero)</h2>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="block">Menghubungkan</span>
              <span className="block text-orange-400 mt-2">Nusantara</span>
              <span className="block text-2xl sm:text-3xl mt-2 text-gray-300">Sejak 1945</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg">
              PT Kereta Api Indonesia (Persero) telah menjadi tulang
              punggung transportasi darat Indonesia, menghubungkan masyarakat
              dan mendorong pertumbuhan ekonomi nasional selama lebih dari 80 tahun.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button className="bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-orange-700 transition-all duration-300 font-medium transform hover:-translate-y-1">
                Eksplor Sejarah Kami
              </button>
              <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium backdrop-blur-sm bg-white/5">
                Lihat Visi & Misi
              </button>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative">
              <img
                src="/assets/images/logos/logo-KAI.png"
                alt="Logo KAI"
                className="relative rounded-3xl bg-white h-40 sm:h-52 md:h-60 w-auto object-contain z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
