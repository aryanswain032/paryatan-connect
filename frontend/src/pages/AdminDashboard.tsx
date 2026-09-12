import { useEffect, useState } from "react";
import { api } from "../api";
import { Users, MapPin, Star, BookOpen, AlertTriangle, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminDashboard({ user }: any) {
  const [stats, setStats] = useState<any>(null);
  const [demand, setDemand] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/stats"),
      api.get("/api/admin/demand-analytics"),
    ]).then(([s, d]) => { setStats(s.data); setDemand(d.data); });
  }, []);

  if (user.role !== "admin") {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-red-600 font-semibold">Admin access required.</p>
      <p className="text-sm text-gray-600 mt-2">Login as admin@demo.com / demo1234</p>
    </div>;
  }

  if (!stats) return <div className="max-w-7xl mx-auto px-4 py-8">Loading…</div>;

  const chartData = [
    { name: "Crowded", value: demand?.total_crowded || 0, fill: "#ef4444" },
    { name: "Emerging", value: demand?.total_emerging || 0, fill: "#138808" },
    { name: "Total", value: demand?.total_destinations || 0, fill: "#0B3C5D" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Platform overview · SIH 2026 Demo</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Users/>} label="Tourists" value={stats.total_tourists} color="saffron" />
        <StatCard icon={<MapPin/>} label="Destinations" value={stats.total_destinations} color="blue" />
        <StatCard icon={<BookOpen/>} label="Bookings" value={stats.total_bookings} color="teal" />
        <StatCard icon={<Star/>} label="Avg Rating" value={stats.avg_rating} color="green" />
        <StatCard icon={<Users/>} label="Providers" value={stats.total_providers} color="teal" />
        <StatCard icon={<Users/>} label="Guides" value={stats.total_guides} color="blue" />
        <StatCard icon={<Sparkles/>} label="Activities" value={stats.total_activities} color="saffron" />
        <StatCard icon={<AlertTriangle/>} label="Pending" value={stats.pending_bookings} color="saffron" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-bold text-brand-blue mb-4">Demand Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-bold text-brand-blue mb-4">Crowd Levels by Destination</h2>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {[...(demand?.crowded || []), ...(demand?.busy || [])].map((d:any) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="font-medium">{d.name}</span>
                <span className={`px-2 py-1 rounded text-xs text-white ${
                  d.score >= 70 ? "bg-red-500" : "bg-yellow-600"}`}>
                  {d.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-brand-cream p-4 rounded-xl text-sm text-gray-700">
        <strong>Demo notice:</strong> All statistics shown are computed from demo seed data for
        SIH 2026 demonstration. Not for real-world decisions. Official tourism statistics:
        <a href="https://data.tourism.gov.in" target="_blank" rel="noreferrer" className="text-brand-teal underline ml-1">
          data.tourism.gov.in
        </a>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    saffron: "text-brand-saffron", blue: "text-brand-blue",
    teal: "text-brand-teal", green: "text-brand-green",
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <div className={colors[color]}>{icon}</div>
      <p className="text-xs text-gray-500 mt-2">{label}</p>
      <p className="text-2xl font-bold text-brand-blue">{value}</p>
    </div>
  );
}