import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, type Destination, type Activity } from "../api";
import { MapPin, Star, AlertTriangle, Sun, CheckCircle } from "lucide-react";

export default function DestinationDetail() {
  const { slug } = useParams();
  const [d, setD] = useState<Destination | null>(null);
  const [acts, setActs] = useState<Activity[]>([]);
  const [alts, setAlts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/api/destinations/slug/${slug}`).then(async r => {
      setD(r.data);
      const [a, alt] = await Promise.all([
        api.get(`/api/activities?destination_id=${r.data.id}`),
        r.data.crowd_level === "crowded"
          ? api.get(`/api/demand/alternatives/${r.data.id}`)
          : Promise.resolve({ data: [] }),
      ]);
      setActs(a.data); setAlts(alt.data);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
    <div className="h-64 bg-gray-200 rounded-xl mb-4" />
    <div className="h-8 bg-gray-200 rounded w-1/3" />
  </div>;
  if (!d) return <div className="max-w-7xl mx-auto px-4 py-8">Destination not found.</div>;

  return (
    <div>
      <div className="relative h-72 md:h-96 bg-gray-200">
        {d.image_url && <img src={d.image_url} alt={d.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{d.name}</h1>
            <p className="flex items-center gap-2 text-white/90">
              <MapPin size={16} /> {d.district ? `${d.district}, ` : ""}{d.state} · Best: {d.best_season}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <p className="text-lg text-gray-700">{d.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(d.categories || []).map(c => (
                <span key={c} className="bg-brand-cream text-brand-teal px-3 py-1 rounded-full text-sm">{c}</span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Info icon={<AlertTriangle className="text-yellow-600" size={18}/>}
              label="Crowd Level" value={`${d.crowd_level} (score ${d.crowd_score.toFixed(1)})`} />
            <Info icon={<Sun className="text-brand-saffron" size={18}/>}
              label="Weather (demo)" value="28°C · Clear skies" />
            <Info icon={<CheckCircle className="text-brand-green" size={18}/>}
              label="Verified" value={d.verified ? "Yes" : "No"} />
            <Info icon={<Star className="text-brand-saffron" size={18}/>}
              label="Data source" value="demo_seed_data" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-brand-blue mb-4">Activities & Experiences</h2>
            <div className="space-y-3">
              {acts.length === 0 ? (
                <p className="text-gray-500">No activities listed yet.</p>
              ) : acts.map(a => (
                <div key={a.id} className="bg-white p-4 rounded-xl shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-brand-blue">{a.name}</h3>
                      <p className="text-sm text-gray-600">{a.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {a.category} · {a.duration_minutes} min · {a.price_range}
                      </p>
                    </div>
                    <Link to="/bookings" className="shrink-0 ml-4 bg-brand-teal text-white px-3 py-1.5 rounded text-sm hover:opacity-90">
                      Inquire
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          {alts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                <AlertTriangle size={18}/> Crowded — try these
              </h3>
              <p className="text-sm text-yellow-900 mb-3">
                {d.name} is currently marked as crowded in this demo dataset. Consider:
              </p>
              {alts.map((a:any) => (
                <Link key={a.destination.id} to={`/destinations/${a.destination.slug}`}
                  className="block bg-white p-3 rounded-lg mb-2 hover:shadow transition">
                  <p className="font-semibold text-brand-blue text-sm">{a.destination.name}</p>
                  <p className="text-xs text-gray-600">{a.reason}</p>
                </Link>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-brand-blue mb-3">Quick Actions</h3>
            <Link to="/plan-trip" className="block text-center bg-brand-saffron text-white py-2 rounded-lg mb-2 hover:opacity-90">
              Plan a Trip Here
            </Link>
            <Link to="/guides" className="block text-center border border-brand-teal text-brand-teal py-2 rounded-lg hover:bg-brand-teal hover:text-white transition">
              Find a Guide
            </Link>
          </div>

          <div className="bg-brand-cream rounded-xl p-4 text-sm text-gray-700">
            <strong className="text-brand-blue">Demo data notice:</strong> Information shown is
            sample data for SIH 2026 demonstration purposes. Verify details before travel.
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ icon, label, value }: any) {
  return (
    <div className="bg-white p-3 rounded-lg border flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-sm capitalize">{value}</p>
      </div>
    </div>
  );
}