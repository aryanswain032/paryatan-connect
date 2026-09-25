import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, type User } from "./api";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import PlanTrip from "./pages/PlanTrip";
import Guides from "./pages/Guides";
import Businesses from "./pages/Businesses";
import Activities from "./pages/Activities";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { Compass, Menu, X } from "lucide-react";
import AIAssistant from "./components/AIAssistant";


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/api/auth/me").then(r => setUser(r.data)).catch(() => {
        localStorage.removeItem("token");
      }).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const navLink = (to: string, label: string) => (
    <Link to={to} onClick={() => setMenuOpen(false)}
      className={`px-3 py-2 rounded transition ${location.pathname === to
        ? "bg-brand-saffron text-white" : "hover:bg-white/10"}`}>
      {label}
    </Link>
  );

  if (loading) return <div className="p-8 text-center">Loading…</div>;

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <nav className="bg-brand-blue text-white sticky top-0 z-40 shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Compass className="text-brand-saffron" /> Paryatan Connect
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLink("/destinations", "Destinations")}
            {navLink("/activities", "Activities")}
            {navLink("/guides", "Guides")}
            {navLink("/businesses", "Businesses")}
            {navLink("/plan-trip", "Plan Trip")}
            {user ? (
              <>
                {navLink("/bookings", "My Bookings")}
                {user.role === "guide" || user.role === "business" ? navLink("/provider", "Dashboard") : null}
                {user.role === "admin" ? navLink("/admin", "Admin") : null}
                <button onClick={logout} className="ml-2 px-3 py-2 rounded bg-brand-saffron hover:opacity-90">
                  Logout ({user.full_name.split(" ")[0]})
                </button>
              </>
            ) : (
              <>
                <select
                 className="bg-white/10 text-white px-2 py-1 rounded text-sm border border-white/20 mr-1"
                 aria-label="Language"
                 defaultValue={localStorage.getItem("lang") || "English"}
                 onChange={(e) => {
                 localStorage.setItem("lang", e.target.value);
                window.dispatchEvent(new Event("langChange"));
                 }}
                  >
                <option className="text-black">English</option>
                <option className="text-black">हिंदी</option>
                <option className="text-black">ଓଡ଼ିଆ</option>
                </select>
                 {navLink("/login", "Login")}
                 <Link to="/register" className="ml-2 px-4 py-2 rounded bg-brand-saffron hover:opacity-90 font-medium">
                  Sign Up
                 </Link>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-1 px-4 pb-4">
            {navLink("/destinations", "Destinations")}
            {navLink("/activities", "Activities")}
            {navLink("/guides", "Guides")}
            {navLink("/businesses", "Businesses")}
            {navLink("/plan-trip", "Plan Trip")}
            {user ? (
              <>
                {navLink("/bookings", "My Bookings")}
                {(user.role === "guide" || user.role === "business") && navLink("/provider", "Dashboard")}
                {user.role === "admin" && navLink("/admin", "Admin")}
                <button onClick={logout} className="text-left px-3 py-2 rounded bg-brand-saffron">Logout</button>
              </>
            ) : (
              <>
                {navLink("/login", "Login")}
                {navLink("/register", "Sign Up")}
              </>
            )}
            
          </div>
        )}
        <AIAssistant />
      </nav>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/bookings" element={user ? <Bookings /> : <Login setUser={setUser} />} />
          <Route path="/provider" element={user ? <ProviderDashboard user={user} /> : <Login setUser={setUser} />} />
          <Route path="/admin" element={user ? <AdminDashboard /> : <Login setUser={setUser} />} />
        </Routes>
      </main>

      <footer className="bg-brand-blue text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Paryatan Connect</h3>
            <p className="text-sm text-white/70">AI-Powered Smart Tourism Ecosystem. Discover India beyond crowded destinations.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Explore</h4>
            <ul className="text-sm space-y-1 text-white/80">
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/plan-trip">AI Trip Planner</Link></li>
              <li><Link to="/guides">Local Guides</Link></li>
              <li><Link to="/businesses">Businesses</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <p className="text-sm text-white/70">Team TechnoTrek · SIH 2026 · SIH26204</p>
            <p className="text-xs text-white/50 mt-2">Demo data only. Not a commercial service.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}