import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Destination } from "../api";
import { Search } from "lucide-react";

export default function Destinations() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [crowd, setCrowd] = useState("");
  const [allStates, setAllStates] = useState<string[]>([]);
  const load = () => {
    setLoading(true);
    const params: any = {};
    if (q) params.q = q;
    if (state) params.state = state;
    if (category) params.category = category;
    if (crowd) params.crowd_level = crowd;
    api.get("/api/destinations", { params })
      .then(r => setItems(r.data))
      .finally(() => setLoading(false));
  };

  // On mount: load all destinations once to get unique states
useEffect(() => {
  api.get("/api/destinations").then(r => {
    const states = Array.from(new Set(r.data.map((d: Destination) => d.state))).sort();
    setAllStates(states as string[]);
  });
}, []);

useEffect(() => { load(); }, []);
useEffect(() => { load(); }, [state, category, crowd]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-blue mb-6">Explore Destinations</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-5 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load()}
            placeholder="Search destinations…"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-teal outline-none" />
        </div>
        <select value={state} onChange={e => setState(e.target.value)} className="px-3 py-2 border rounded-lg">
         <option value="">All States</option>
          {allStates.map(s => (
         <option key={s} value={s}>{s}</option>
         ))}
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="">All Categories</option>
          {["heritage","nature","beach","food","culture","wildlife","adventure","spiritual","shopping","wellness"].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={crowd} onChange={e => setCrowd(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="">All Crowd Levels</option>
          <option value="normal">Normal</option>
          <option value="busy">Busy</option>
          <option value="crowded">Crowded</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({length:6}).map((_,i) => <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No destinations found. Try different filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(d => (
            <Link key={d.id} to={`/destinations/${d.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition">
              <div className="relative h-48 bg-gray-200">
                {d.image_url && <img src={d.image_url} alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition" loading="lazy" />}
                {d.is_emerging && (
                  <span className="absolute top-2 left-2 bg-brand-green text-white text-xs px-2 py-1 rounded">Emerging</span>
                )}
                <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded text-white ${
                  d.crowd_level === "crowded" ? "bg-red-500" :
                  d.crowd_level === "busy" ? "bg-yellow-600" : "bg-green-600"}`}>
                  {d.crowd_level}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-brand-blue">{d.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{d.state} · {d.best_season}</p>
                <p className="text-sm line-clamp-2">{d.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {(d.categories || []).slice(0, 3).map(c => (
                    <span key={c} className="text-xs bg-brand-cream text-brand-teal px-2 py-1 rounded">{c}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}