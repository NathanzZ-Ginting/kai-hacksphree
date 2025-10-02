import { useBooking } from "../context/BookingContext";
import BookingSearch from "../components/booking/BookingSearch";
import ScheduleSelection from "../components/booking/ScheduleSelection";
import PassengerForm from "../components/booking/PassengerForm";
import PaymentSection from "../components/booking/PaymentSection";
import ConfirmationSection from "../components/booking/ConfirmationSection";
import { CheckCircle } from "lucide-react";

const BookingPage = () => {
  const { state } = useBooking();

  const renderStep = () => {
    switch (state.step) {
      case "search":
        return <BookingSearch />;
      case "select":
        return <ScheduleSelection />;
      case "passenger":
        return <PassengerForm />;
      case "payment":
        return <PaymentSection />;
      case "confirmation":
        return <ConfirmationSection />;
      default:
        return <BookingSearch />;
    }
  };

  // Progress Steps
  const steps = [
    { id: "search", name: "Pencarian", status: state.step },
    { id: "select", name: "Pilih Jadwal", status: state.step },
    { id: "passenger", name: "Data Penumpang", status: state.step },
    { id: "payment", name: "Pembayaran", status: state.step },
    { id: "confirmation", name: "Selesai", status: state.step },
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    const currentIndex = steps.findIndex((step) => step.id === state.step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Progress Bar */}
      {state.step !== "confirmation" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      getStepStatus(step.id) === "completed"
                        ? "bg-red-600 text-white"
                        : getStepStatus(step.id) === "current"
                        ? "border-2 border-red-600 text-red-600"
                        : "border-2 border-gray-300 text-gray-500"
                    }`}
                  >
                    {getStepStatus(step.id) === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      getStepStatus(step.id) === "completed" ||
                      getStepStatus(step.id) === "current"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      getStepStatus(steps[index + 1].id) === "completed"
                        ? "bg-red-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Step Content */}
      {renderStep()}
    </div>
  );
};

export default BookingPage;
