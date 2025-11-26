import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import NewsSection from "../components/sections/NewsSection";
import ScheduleFinder from "../components/sections/ScheduleFinder";
import BookingNotification from "../components/ui/BookingNotification";
import BookingChecker from "../components/sections/BookingChecker";

// HomePage Component
const HomePage = () => {
  // Render component
  return (
    <>
      <Hero />
      <BookingChecker />
      <Services />
      <ScheduleFinder />
      <NewsSection />
      <BookingNotification />
    </>
  );
};

export default HomePage;
