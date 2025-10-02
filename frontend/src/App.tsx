// App.tsx - Update Routes
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import PassengerServicePage from "./pages/services/PassengerServicePage";
import LogisticsServicePage from "./pages/services/LogisticsServicePage";
import PropertyServicePage from "./pages/services/PropertyServicePage";
import AirportServicePage from "./pages/services/AirportServicePage";
import NewsPage from "./pages/NewsPage";
import HelpPage from "./pages/HelpPage";
import BookingPage from "./pages/BookingPage";

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route
                path="/services/passenger"
                element={<PassengerServicePage />}
              />
              <Route
                path="/services/logistics"
                element={<LogisticsServicePage />}
              />
              <Route
                path="/services/property"
                element={<PropertyServicePage />}
              />
              <Route
                path="/services/airport"
                element={<AirportServicePage />}
              />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/booking" element={<BookingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;
