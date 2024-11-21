import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Preloader from "./pages/components/Preloader";
import Languages from "./pages/Languages";
import Features from "./pages/Features";
import "./App.css";
import Permissions from "./pages/Permissions";
import Welcome from "./pages/Welcome";
import MapScreen from "./pages/MapScreen";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import EventList from "./pages/EventList";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay or fetch data
    const timer = setTimeout(() => setLoading(false), 2000); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? (
        <Preloader />
      ) : (
        <Routes>
          <Route path="/" element={<Languages />} />
          <Route path="/features" element={<Features />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mapscreen" element={<MapScreen />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/eventlist" element={<EventList />} />
        </Routes>
          )}
      {/* <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mapscreen" element={<MapScreen />} />
          <Route path="/favorites" element={<Favorites />} />
      </Routes> */}

    </Router>
  );
}

export default App;
