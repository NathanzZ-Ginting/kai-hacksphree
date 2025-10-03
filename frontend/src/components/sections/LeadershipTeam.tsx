const LeadershipTeam = () => {
  const leaders = [
    {
      name: "Bobby Rasyidin",
      position: "Direktur Utama",
      image: "/assets/images/chairman/3.webp",
      bio: "Memimpin transformasi digital KAI dengan pengalaman 20 tahun di industri transportasi",
    },
    {
      name: "Indarto Pamoengkas",
      position: "Direktur Keuangan",
      image: "/assets/images/chairman/4.webp",
      bio: "Ahli keuangan dengan spesialisasi dalam manajemen investasi dan strategi keuangan",
    },
    {
      name: "Awan Hermawan Purwadinata",
      position: "Direktur Operasional",
      image: "/assets/images/chairman/5.webp",
      bio: "Bertanggung jawab atas operasional harian dan pengembangan jaringan kereta api",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tim <span className="text-red-400">Kepemimpinan</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Para profesional berpengalaman yang memimpin KAI menuju masa depan transportasi yang lebih baik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {leaders.map((leader, index) => (
            <div
              key={index}
              className="group bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-8 text-center shadow-2xl hover:shadow-red-500/10 transition-all duration-500 border border-gray-700 hover:border-red-500/30 overflow-hidden relative"
            >
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 to-orange-600"></div>
              
              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-orange-600/30 rounded-full blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="relative w-40 h-40 rounded-full object-cover mx-auto border-4 border-gray-700 group-hover:border-red-600 transition-all duration-500 z-10"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors duration-300">
                  {leader.name}
                </h3>
                <p className="text-red-400 font-semibold mb-4 text-lg">
                  {leader.position}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {leader.bio}
                </p>
                
                {/* Hover effect line */}
                <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700 rounded-full mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Decorative element */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg shadow-red-500/30">
            Kepemimpinan yang Visioner
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeam;
