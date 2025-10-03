import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import NewsSection from "../components/sections/NewsSection";
import ScheduleFinder from "../components/sections/ScheduleFinder";
import BookingNotification from "../components/ui/BookingNotification";

const HomePage = () => {
  return (
    <>
      <Hero />
      <Services />
      <ScheduleFinder />
      <NewsSection />
      <BookingNotification />
    </>
  );
};

export default HomePage;
