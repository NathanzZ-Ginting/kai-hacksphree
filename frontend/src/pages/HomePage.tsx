import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import NewsSection from "../components/sections/NewsSection";
import RouteMap from "../components/sections/RouteMap";
import BookingNotification from "../components/ui/BookingNotification";

const HomePage = () => {
  return (
    <>
      <Hero />
      <Services />
      <RouteMap />
      <NewsSection />
      <BookingNotification />
    </>
  );
};

export default HomePage;
