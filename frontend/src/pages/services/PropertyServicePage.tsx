import { Building, Store, Coffee } from "lucide-react";

const PropertyServicePage = () => {
  const services = [
    {
      icon: Store,
      title: "Retail Stasiun",
      description: "Pengelolaan ruang retail di area stasiun",
      features: [
        "Food & Beverage",
        "Convenience Store",
        "Souvenir Shop",
        "ATM Center",
      ],
    },
    {
      icon: Building,
      title: "Pengembangan Kawasan",
      description: "Pengembangan properti komersial di sekitar stasiun",
      features: [
        "Office Space",
        "Commercial Area",
        "Mixed-use Development",
        "Public Facilities",
      ],
    },
    {
      icon: Coffee,
      title: "Hospitality",
      description: "Layanan hospitality dan F&B premium",
      features: [
        "Lounge Executive",
        "Coffee Shop",
        "Restaurant",
        "Meeting Rooms",
      ],
    },
  ];

  const featuredProperties = [
    {
      name: "Stasiun Gambir",
      location: "Jakarta Pusat",
      facilities: [
        "Retail Mall",
        "Food Court",
        "Business Lounge",
        "Parking Area",
      ],
      image: "/images/gambir-station.jpg",
    },
    {
      name: "Stasiun Bandung",
      location: "Bandung",
      facilities: [
        "Shopping Arcade",
        "Restaurants",
        "Hotel",
        "Conference Hall",
      ],
      image: "/images/bandung-station.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Pengelolaan Properti
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Pengembangan dan pengelolaan properti serta kawasan stasiun yang
              strategis
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Properti Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mengoptimalkan aset properti untuk menciptakan nilai tambah dan
              kenyamanan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Tertarik Bermitra?</h2>
          <p className="text-green-100 mb-8 text-lg">
            Manfaatkan peluang bisnis di lokasi strategis stasiun KAI
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold text-lg">
            Ajukan Proposal
          </button>
        </div>
      </section>
    </div>
  );
};

export default PropertyServicePage;
