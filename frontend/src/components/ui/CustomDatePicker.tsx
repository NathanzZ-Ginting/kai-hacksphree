import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// Props untuk CustomDatePicker
interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
}

// Custom Date Picker Component
const CustomDatePicker = ({
  value,
  onChange,
  placeholder = "Pilih Tanggal",
  minDate,
}: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, ...)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Navigate months
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Check if date is disabled based on minDate
  const isDateDisabled = (date: Date) => {
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      return date < min;
    }
    return false;
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    // Only select if not disabled
    if (!isDateDisabled(selectedDate)) {
      const dateString = new Date(
        Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      )
        .toISOString()
        .split("T")[0];
      onChange(dateString);
      setIsOpen(false);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Previous month days
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const daysInPrevMonth = getDaysInMonth(prevMonth);

    // Fill in days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
      days.push({ day, isCurrentMonth: false, date });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      days.push({ day, isCurrentMonth: true, date });
    }

    // Next month days to fill the grid
    const totalCells = 42;
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        nextMonthDay
      );
      days.push({ day: nextMonthDay, isCurrentMonth: false, date });
      nextMonthDay++;
    }

    // Check if each day is disabled
    return days;
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Month names in Indonesian
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Render component
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none text-left flex items-center justify-between ${
          value ? "text-gray-800" : "text-gray-500"
        }`}
      >
        <span>{formatDisplayDate(value)}</span>
        <Calendar className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="text-lg font-semibold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["M", "S", "S", "R", "K", "J", "S"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map(
                ({ day, isCurrentMonth, date }, index) => {
                  const disabled = isDateDisabled(date);
                  const today = isToday(date);
                  const selected = isSelected(date);

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(day)}
                      disabled={disabled || !isCurrentMonth}
                      className={`
                      h-8 rounded-lg text-sm font-medium transition-colors
                      ${
                        selected
                          ? "bg-orange-600 text-white"
                          : today
                          ? "bg-orange-100 text-orange-600"
                          : isCurrentMonth
                          ? "text-gray-800 hover:bg-gray-100"
                          : "text-gray-400"
                      }
                      ${disabled ? "opacity-30 cursor-not-allowed" : ""}
                    `}
                    >
                      {day}
                    </button>
                  );
                }
              )}
            </div>
          </div>
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                onChange(today);
                setIsOpen(false);
              }}
              className="w-full py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
            >
              Pilih Hari Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
