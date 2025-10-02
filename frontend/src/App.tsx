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
import NewsPage from "./pages/NewsPage";
import HelpPage from "./pages/HelpPage";
import BookingPage from "./pages/BookingPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Header />
            <main>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
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
                <Route path="/news" element={<NewsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/article/:id" element={<ArticleDetailPage />} />
                <Route path="/booking" element={<BookingPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
