import AboutHero from "../components/sections/AboutHero";
import CompanyHistory from "../components/sections/CompanyHistory";
import MissionVision from "../components/sections/MissionVision";
import CoreValues from "../components/sections/CoreValues";
import LeadershipTeam from "../components/sections/LeadershipTeam";
import Achievements from "../components/sections/Achievements";
import ContactInfo from "../components/sections/ContactInfo";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AboutHero />
      <CompanyHistory />
      <MissionVision />
      <CoreValues />
      <LeadershipTeam />
      <Achievements />
      <ContactInfo />
    </div>
  );
};

export default AboutPage;
