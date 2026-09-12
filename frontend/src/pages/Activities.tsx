import { useEffect, useState } from "react";
import { api, type Activity } from "../api";
import { Clock } from "lucide-react";

export default function Activities() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/activities").then(r => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Activities & Experiences</h1>
      <p className="text-gray-600 mb-6">Curated things to do across India.</p>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({length:6}).map((_,i) => <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(a => (
            <div key={a.id} className="bg-white rounded-xl shadow p-5">
              <span className="text-xs bg-brand-cream text-brand-teal px-2 py-1 rounded">{a.category}</span>
              <h3 className="font-bold text-brand-blue mt-2 mb-1">{a.name}</h3>
              <p className="text-sm text-gray-700 mb-3">{a.description}</p>
              <div className="flex items-center justify-between text-sm border-t pt-3">
                <span className="text-gray-500 flex items-center gap-1"><Clock size={14}/> {a.duration_minutes} min</span>
                <span className="font-semibold text-brand-saffron">{a.price_range}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}