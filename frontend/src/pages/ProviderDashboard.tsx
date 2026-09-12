import { useEffect, useState } from "react";
import { api, type Booking } from "../api";
import { CheckCircle, XCircle, TrendingUp, Users } from "lucide-react";

export default function ProviderDashboard({ user }: any) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/api/bookings/provider").then(r => setBookings(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id: number, status: string) => {
    const response = prompt("Optional response to tourist:") || "";
    await api.patch(`/api/bookings/${id}/status`, { status, provider_response: response });
    load();
  };

  const pending = bookings.filter(b => b.status === "pending").length;
  const accepted = bookings.filter(b => b.status === "accepted").length;
  const estimate = accepted * 1500;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Provider Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back, {user.full_name}.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Stat icon={<Users className="text-brand-saffron"/>} label="Pending" value={pending} />
        <Stat icon={<CheckCircle className="text-brand-green"/>} label="Accepted" value={accepted} />
        <Stat icon={<TrendingUp className="text-brand-teal"/>} label="Est. Earnings (demo)" value={`₹${estimate}`} />
      </div>

      <h2 className="text-xl font-bold text-brand-blue mb-4">Booking Requests</h2>
      {loading ? <p>Loading…</p> :
       bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center text-gray-500 border-2 border-dashed">
          No requests yet. Your listing will show up when tourists book.
        </div>
       ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="bg-white p-5 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-brand-blue">Request #{b.id} from {b.tourist_name}</p>
                  <p className="text-sm text-gray-600">Date: {b.booking_date} · Guests: {b.guest_count}</p>
                  {b.message && <p className="text-sm text-gray-700 mt-1 italic">"{b.message}"</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  b.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  b.status === "accepted" ? "bg-green-100 text-green-800" :
                  b.status === "rejected" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"}`}>{b.status}</span>
              </div>
              {b.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(b.id, "accepted")}
                    className="flex items-center gap-1 bg-brand-green text-white px-4 py-2 rounded-lg text-sm hover:opacity-90">
                    <CheckCircle size={14}/> Accept
                  </button>
                  <button onClick={() => updateStatus(b.id, "rejected")}
                    className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90">
                    <XCircle size={14}/> Reject
                  </button>
                </div>
              )}
              {b.provider_response && (
                <p className="text-sm text-brand-teal mt-2">Your response: {b.provider_response}</p>
              )}
            </div>
          ))}
        </div>
       )}
    </div>
  );
}

function Stat({ icon, label, value }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-brand-blue">{value}</p>
      </div>
    </div>
  );
}