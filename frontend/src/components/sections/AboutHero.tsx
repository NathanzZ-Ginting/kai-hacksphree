const AboutHero = () => {
  return (
    <section className="bg-gradient-to-r from-orange-900 via-red-900 to-amber-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Large blurred circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
        
        {/* Floating circles pattern */}
        <div className="absolute top-16 right-1/4 w-24 h-24 bg-white rounded-full opacity-5 animate-bounce delay-300"></div>
        <div className="absolute top-32 left-1/4 w-16 h-16 bg-orange-300 rounded-full opacity-10 animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-16 w-20 h-20 bg-red-300 rounded-full opacity-8 animate-bounce delay-1000"></div>
        <div className="absolute top-2/3 right-20 w-12 h-12 bg-amber-300 rounded-full opacity-12 animate-pulse delay-1500"></div>
        <div className="absolute bottom-16 left-1/2 w-18 h-18 bg-white rounded-full opacity-6 animate-bounce delay-2000"></div>
        <div className="absolute top-1/4 right-1/3 w-14 h-14 bg-orange-400 rounded-full opacity-10 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-22 h-22 bg-red-400 rounded-full opacity-8 animate-bounce delay-1200"></div>
        <div className="absolute top-3/4 left-1/3 w-10 h-10 bg-amber-400 rounded-full opacity-15 animate-pulse delay-800"></div>
        
        {/* Train track inspired lines with circles */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-10">
          <div className="absolute top-0 left-1/4 w-4 h-4 bg-orange-300 rounded-full opacity-20 transform -translate-y-1"></div>
          <div className="absolute top-0 right-1/3 w-3 h-3 bg-red-300 rounded-full opacity-25 transform -translate-y-1"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-10">
          <div className="absolute bottom-0 left-1/3 w-5 h-5 bg-amber-300 rounded-full opacity-20 transform translate-y-1"></div>
          <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-orange-300 rounded-full opacity-25 transform translate-y-1"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-block bg-orange-600/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-orange-400/30">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-orange-200">PT Kereta Api Indonesia (Persero)</h2>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="block bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">Menghubungkan</span>
              <span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mt-2">Nusantara</span>
              <span className="block text-2xl sm:text-3xl mt-2 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">Sejak 1945</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-orange-100 leading-relaxed max-w-lg">
              PT Kereta Api Indonesia (Persero) telah menjadi tulang
              punggung transportasi darat Indonesia, menghubungkan masyarakat
              dan mendorong pertumbuhan ekonomi nasional selama lebih dari 80 tahun.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-medium transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Eksplor Sejarah Kami
              </button>
              <button className="border-2 border-orange-300 text-orange-100 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-orange-300 hover:text-orange-900 transition-all duration-300 font-medium backdrop-blur-sm bg-white/5">
                Lihat Visi & Misi
              </button>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
              <img
                src="/assets/images/logos/logo-KAI.png"
                alt="Logo KAI"
                className="relative rounded-3xl bg-white/90 backdrop-blur-sm h-40 sm:h-52 md:h-60 w-auto object-contain z-10 shadow-2xl border border-orange-200"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
