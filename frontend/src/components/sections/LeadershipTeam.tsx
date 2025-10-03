const LeadershipTeam = () => {
  const leaders = [
    {
      name: "Budi Santoso",
      position: "Direktur Utama",
      image: "/images/ceo.jpg",
      bio: "Memimpin transformasi digital KAI dengan pengalaman 20 tahun di industri transportasi",
    },
    {
      name: "Ayu Lestari",
      position: "Direktur Keuangan",
      image: "/images/cfo.jpg",
      bio: "Ahli keuangan dengan spesialisasi dalam manajemen investasi dan strategi keuangan",
    },
    {
      name: "Rudi Hartono",
      position: "Direktur Operasional",
      image: "/images/coo.jpg",
      bio: "Bertanggung jawab atas operasional harian dan pengembangan jaringan kereta api",
    },
  ];

  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tim Kepemimpinan
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Para profesional berpengalaman yang memimpin KAI menuju masa depan
            transportasi yang lebih baik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-2xl p-8 text-center group hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700"
            >
              <div className="relative inline-block mb-6">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-700 group-hover:border-red-600 transition-colors duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600/20 to-transparent group-hover:from-red-600/40 transition-all duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {leader.name}
              </h3>
              <p className="text-red-400 font-semibold mb-4">
                {leader.position}
              </p>
              <p className="text-gray-300 leading-relaxed">{leader.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeam;
