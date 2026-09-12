import { useEffect, useState } from "react";
import { api, type Guide } from "../api";
import { MapPin, Star, CheckCircle } from "lucide-react";

export default function Guides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/guides").then(r => setGuides(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Verified Local Guides</h1>
      <p className="text-gray-600 mb-6">Meet trusted experts who bring destinations to life.</p>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({length:6}).map((_,i) => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.map(g => (
            <div key={g.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-5">
              <div className="flex items-center gap-3 mb-3">
                {g.image_url && <img src={g.image_url} alt={g.name} className="w-16 h-16 rounded-full object-cover" />}
                <div>
                  <h3 className="font-bold text-brand-blue flex items-center gap-1">
                    {g.name}
                    {g.verification_status === "verified" && <CheckCircle size={16} className="text-brand-green"/>}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12}/> {g.location}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{g.bio}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {g.specialties.map(s => <span key={s} className="text-xs bg-brand-cream text-brand-teal px-2 py-0.5 rounded">{s}</span>)}
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <div className="text-sm">
                  <p className="flex items-center gap-1 text-brand-saffron font-semibold">
                    <Star size={14} fill="currentColor"/> {g.rating}
                    <span className="text-gray-400 font-normal">({g.review_count})</span>
                  </p>
                  <p className="text-gray-600">₹{g.price_per_day}/day</p>
                </div>
                <button className="bg-brand-teal text-white px-4 py-2 rounded-lg text-sm hover:opacity-90">
                  Contact
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Languages: {g.languages.join(", ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}