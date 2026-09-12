import { useEffect, useState } from "react";
import { api, type Business } from "../api";
import { MapPin, Star, CheckCircle } from "lucide-react";

export default function Businesses() {
  const [items, setItems] = useState<Business[]>([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/api/businesses", { params: type ? { business_type: type } : {} })
      .then(r => setItems(r.data)).finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-blue mb-2">Local Businesses</h1>
      <p className="text-gray-600 mb-6">Hotels, restaurants, shops and activity providers.</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {["","hotel","restaurant","shop","activity","vendor"].map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`px-4 py-2 rounded-full text-sm border ${
              type === t ? "bg-brand-teal text-white border-brand-teal"
              : "bg-white border-gray-300 hover:border-brand-teal"}`}>
            {t ? t.charAt(0).toUpperCase() + t.slice(1) : "All"}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({length:6}).map((_,i) => <div key={i} className="h-56 bg-gray-200 rounded-xl animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(b => (
            <div key={b.id} className="bg-white rounded-xl shadow overflow-hidden">
              {b.image_url && <img src={b.image_url} alt={b.name} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-brand-blue">{b.name}</h3>
                  {b.verification_status === "verified" && <CheckCircle size={16} className="text-brand-green"/>}
                </div>
                <p className="text-xs text-brand-saffron uppercase font-semibold mb-2">{b.business_type}</p>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{b.description}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><MapPin size={12}/> {b.address}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-saffron flex items-center gap-1">
                    <Star size={14} fill="currentColor"/> {b.rating}
                    <span className="text-gray-400 font-normal">({b.review_count})</span>
                  </span>
                  <span className="text-sm text-gray-600">{b.price_range}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}