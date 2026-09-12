import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { Sparkles, Loader2 } from "lucide-react";

const INTERESTS = ["heritage","nature","beach","food","culture","wildlife","adventure","spiritual","shopping","wellness"];

export default function PlanTrip() {
  const [form, setForm] = useState({
    budget: 8000, duration_days: 3, starting_city: "Bhubaneswar",
    preferred_region: "Odisha", interests: ["heritage","food"] as string[],
    travel_type: "family", language: "English",
    crowd_preference: "avoid_crowds", accessibility_required: false,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (i: string) => {
    setForm(f => ({
      ...f, interests: f.interests.includes(i)
        ? f.interests.filter(x => x !== i) : [...f.interests, i]
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const r = await api.post("/api/recommendations", form);
      setResult(r.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate plan.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-2 flex items-center justify-center gap-3">
          <Sparkles className="text-brand-saffron"/> AI Trip Planner
        </h1>
        <p className="text-gray-600">Tell us what you love. We'll craft a personalized India itinerary.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <form onSubmit={submit} className="md:col-span-2 bg-white p-6 rounded-xl shadow space-y-4 h-fit">
          <div>
            <label className="text-sm font-medium text-gray-700">Budget (INR)</label>
            <input type="number" value={form.budget} min={1000}
              onChange={e => setForm({...form, budget: +e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-teal outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Number of days</label>
            <input type="number" value={form.duration_days} min={1} max={30}
              onChange={e => setForm({...form, duration_days: +e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-teal outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Starting city</label>
            <input value={form.starting_city}
              onChange={e => setForm({...form, starting_city: e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-teal outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Preferred region</label>
            <select value={form.preferred_region}
              onChange={e => setForm({...form, preferred_region: e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg">
              <option value="Odisha">Odisha</option>
              <option value="Any">Anywhere in India</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => (
                <button key={i} type="button" onClick={() => toggleInterest(i)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    form.interests.includes(i)
                      ? "bg-brand-teal text-white border-brand-teal"
                      : "bg-white text-gray-700 border-gray-300 hover:border-brand-teal"}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Travel type</label>
              <select value={form.travel_type}
                onChange={e => setForm({...form, travel_type: e.target.value})}
                className="w-full mt-1 px-3 py-2 border rounded-lg">
                {["solo","couple","family","friends","senior"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Language</label>
              <select value={form.language}
                onChange={e => setForm({...form, language: e.target.value})}
                className="w-full mt-1 px-3 py-2 border rounded-lg">
                <option>English</option><option>Hindi</option><option>Odia</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Crowd preference</label>
            <select value={form.crowd_preference}
              onChange={e => setForm({...form, crowd_preference: e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg">
              <option value="avoid_crowds">Avoid crowds</option>
              <option value="balanced">Balanced</option>
              <option value="popular">Popular places are fine</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.accessibility_required}
              onChange={e => setForm({...form, accessibility_required: e.target.checked})} />
            Accessibility required
          </label>
          <button type="submit" disabled={loading}
            className="w-full bg-brand-saffron text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={18}/> Generating…</> : "Generate My Trip"}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        <div className="md:col-span-3 space-y-5">
          {!result && !loading && (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 border-2 border-dashed">
              <Sparkles className="mx-auto text-brand-saffron mb-3" size={40}/>
              <p>Fill the form to see your personalized itinerary.</p>
            </div>
          )}
          {result && (
            <>
              <div className="bg-gradient-to-r from-brand-blue to-brand-teal text-white rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-2">{result.summary}</h2>
                <p className="text-white/90">Estimated budget: ₹{result.estimated_budget.toLocaleString()}</p>
                <p className="text-xs text-white/70 mt-2">{result.disclaimer}</p>
              </div>

              {result.alternative_destination_reason && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
                  <strong>Smart suggestion:</strong> {result.alternative_destination_reason}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-brand-blue mb-3">Recommended Destinations</h3>
                <div className="space-y-3">
                  {result.destinations.map((x:any) => (
                    <Link key={x.destination.id} to={`/destinations/${x.destination.slug}`}
                      className="block bg-white p-4 rounded-xl shadow-sm hover:shadow transition">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-brand-blue">{x.destination.name}</h4>
                            <span className="text-xs bg-brand-cream text-brand-teal px-2 py-0.5 rounded">
                              score {x.score}
                            </span>
                            {x.destination.is_emerging && (
                              <span className="text-xs bg-brand-green text-white px-2 py-0.5 rounded">Emerging</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{x.destination.state} · {x.destination.best_season}</p>
                          <p className="text-sm text-gray-700 italic">
                            <strong>Why:</strong> {x.reason || "Popular match for your profile."}
                          </p>
                        </div>
                        {x.destination.image_url && (
                          <img src={x.destination.image_url} alt={x.destination.name}
                            className="w-24 h-24 rounded-lg object-cover shrink-0" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-brand-blue mb-3">Day-by-Day Itinerary</h3>
                <div className="space-y-3">
                  {result.daily_itinerary.map((d:any) => (
                    <div key={d.day} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-brand-saffron">
                      <p className="text-sm text-brand-saffron font-semibold">Day {d.day}</p>
                      <h4 className="font-bold text-brand-blue">{d.title}</h4>
                      <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                        {d.activities.map((a:string, i:number) => <li key={i}>{a}</li>)}
                      </ul>
                      <p className="text-xs text-gray-500 mt-2">{d.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {result.activities.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-brand-blue mb-3">Suggested Activities</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.activities.map((a:any) => (
                      <div key={a.activity.id} className="bg-white p-3 rounded-lg shadow-sm border">
                        <h4 className="font-semibold text-sm text-brand-blue">{a.activity.name}</h4>
                        <p className="text-xs text-gray-600">{a.activity.category} · {a.activity.price_range}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.recommended_guides.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-brand-blue mb-3">Local Guides</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {result.recommended_guides.map((g:any) => (
                      <div key={g.id} className="bg-white p-3 rounded-lg shadow-sm border text-center">
                        <img src={g.image_url} alt={g.name}
                          className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                        <p className="font-semibold text-sm text-brand-blue">{g.name}</p>
                        <p className="text-xs text-gray-500">₹{g.price_per_day}/day · ⭐ {g.rating}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}