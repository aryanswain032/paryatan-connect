import { useEffect, useState } from "react";
import { api, type Booking } from "../api";

export default function Bookings() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/bookings/my").then(r => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const statusColor: any = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-blue mb-6">My Booking Requests</h1>
      {loading ? <p>Loading…</p> :
       items.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center text-gray-500 border-2 border-dashed">
          No bookings yet. Explore destinations and request a booking.
        </div>
       ) : (
        <div className="space-y-3">
          {items.map(b => (
            <div key={b.id} className="bg-white p-5 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-brand-blue">{b.provider_name || "Provider"}</p>
                  <p className="text-sm text-gray-600">Type: {b.provider_type} · Date: {b.booking_date} · Guests: {b.guest_count}</p>
                  {b.message && <p className="text-sm text-gray-700 mt-1 italic">"{b.message}"</p>}
                  {b.provider_response && (
                    <p className="text-sm text-brand-teal mt-2">Provider: {b.provider_response}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[b.status] || ""}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Payment: {b.payment_status}</p>
            </div>
          ))}
        </div>
       )}
    </div>
  );
}