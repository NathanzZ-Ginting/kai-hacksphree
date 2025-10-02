import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, MapPin } from "lucide-react";

interface Station {
  id: string;
  name: string;
  city: string;
}

interface StationDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  stations: Station[];
}

const StationDropdown = ({
  value,
  onChange,
  placeholder = "Pilih Stasiun",
  stations,
}: StationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Kelompokkan stasiun berdasarkan kota
  const groupedStations = stations.reduce((acc, station) => {
    if (!acc[station.city]) {
      acc[station.city] = [];
    }
    acc[station.city].push(station);
    return acc;
  }, {} as Record<string, Station[]>);

  // Filter stasiun berdasarkan pencarian
  const filteredGroupedStations = Object.entries(groupedStations).reduce(
    (acc, [city, cityStations]) => {
      const filteredStations = cityStations.filter(
        (station) =>
          station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          station.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          station.id.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredStations.length > 0) {
        acc[city] = filteredStations;
      }
      return acc;
    },
    {} as Record<string, Station[]>
  );

  const selectedStation = stations.find((station) => station.id === value);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (stationId: string) => {
    onChange(stationId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-200 ${
          isOpen ? "ring-2 ring-orange-500 border-orange-500" : ""
        } ${value ? "text-gray-800" : "text-gray-500"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>
              {selectedStation
                ? `${selectedStation.name} (${selectedStation.city})`
                : placeholder}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[1001] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari stasiun atau kota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-gray-800"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Stations List */}
          <div className="overflow-y-auto max-h-64 no-scrollbar">
            {Object.keys(filteredGroupedStations).length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Tidak ada stasiun ditemukan</p>
              </div>
            ) : (
              Object.entries(filteredGroupedStations).map(
                ([city, cityStations]) => (
                  <div
                    key={city}
                    className="border-b border-gray-50 last:border-b-0"
                  >
                    {/* City Header */}
                    <div className="px-4 py-2 bg-gray-50 sticky top-0 z-10">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {city}
                      </h4>
                    </div>

                    {/* Stations in City */}
                    <div className="py-1">
                      {cityStations.map((station) => (
                        <button
                          key={station.id}
                          onClick={() => handleSelect(station.id)}
                          className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-150 flex items-center justify-between ${
                            value === station.id
                              ? "bg-orange-50 text-orange-600"
                              : "text-gray-700"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                value === station.id
                                  ? "bg-orange-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div className="text-left">
                              <div
                                className={`font-medium ${
                                  value === station.id
                                    ? "text-orange-600"
                                    : "text-gray-800"
                                }`}
                              >
                                {station.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                Kode: {station.id}
                              </div>
                            </div>
                          </div>
                          {value === station.id && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StationDropdown;
