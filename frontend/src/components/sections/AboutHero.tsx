const AboutHero = () => {
  return (
    <section className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang KAI</h1>
            <p className="text-xl text-gray-300 mb-8">
              Sejak 1945, PT Kereta Api Indonesia (Persero) telah menjadi tulang
              punggung transportasi darat Indonesia, menghubungkan masyarakat
              dan mendorong pertumbuhan ekonomi nasional.
            </p>
            <div className="flex space-x-4">
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Sejarah Kami
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium">
                Visi & Misi
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/images/logos/logo-KAI.png"
              alt="Sejarah KAI"
              className="rounded-2xl shadow-2xl bg-white h-40"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
