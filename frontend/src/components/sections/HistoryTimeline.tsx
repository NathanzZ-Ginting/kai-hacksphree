import { Calendar, MapPin, Users } from "lucide-react";

const HistoryTimeline = () => {
  const milestones = [
    {
      year: "1945",
      title: "Lahirnya Djawatan Kereta Api",
      description:
        "Dibentuknya Djawatan Kereta Api Republik Indonesia (DKARI) pasca kemerdekaan",
      icon: Calendar,
    },
    {
      year: "1950",
      title: "Nasionalisasi Perkeretaapian",
      description:
        "Penggabungan seluruh perusahaan kereta api di Indonesia menjadi satu entitas",
      icon: MapPin,
    },
    {
      year: "1990",
      title: "Modernisasi Armada",
      description:
        "Pengenalan kereta api ekspres dan peningkatan layanan penumpang",
      icon: Users,
    },
    {
      year: "2010",
      title: "Era Digitalisasi",
      description:
        "Peluncuran sistem pemesanan tiket online dan transformasi digital",
      icon: Calendar,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Perjalanan Sejarah KAI
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-red-200 h-full"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="w-1/2 pr-8">
                  <div
                    className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${
                      index % 2 === 0 ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <milestone.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow"></div>

                <div className="w-1/2 pl-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;
