import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Destination } from "../api";
import { MapPin, Users, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";

export default function Home() {
  const [popular, setPopular] = useState<Destination[]>([]);
  const [emerging, setEmerging] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/destinations?crowd_level=crowded"),
      api.get("/api/destinations?is_emerging=true"),
    ]).then(([p, e]) => {
      setPopular(p.data);
      setEmerging(e.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-brand-blue via-brand-teal to-brand-blue text-white">
        <div className="absolute inset-0 opacity-20"
          style={{backgroundImage:"url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600')",
                  backgroundSize:"cover", backgroundPosition:"center"}} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Discover India <span className="text-brand-saffron">beyond the crowded destinations.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
            Plan personalized journeys, meet trusted local experts, and discover lesser-known places across India.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/plan-trip" className="px-6 py-3 rounded-lg bg-brand-saffron text-white font-semibold hover:opacity-90 flex items-center gap-2">
              <Sparkles size={18} /> Plan My Trip
            </Link>
            <Link to="/destinations" className="px-6 py-3 rounded-lg bg-white text-brand-blue font-semibold hover:bg-white/90">
              Explore Destinations
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-lg border-2 border-white/60 hover:bg-white/10">
              Become a Guide
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-lg border-2 border-white/60 hover:bg-white/10">
              List Your Business
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <Section title="Popular Destinations" subtitle="Highly visited — plan ahead or explore alternatives" loading={loading}>
        <Row items={popular} />
      </Section>

      {/* EMERGING */}
      <Section title="Emerging Destinations" subtitle="Lesser-known gems that need your love" loading={loading}>
        <Row items={emerging} />
      </Section>

      {/* DEMAND DISTRIBUTION */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-blue mb-4 text-center">
            Smart Demand Distribution
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Our engine detects overcrowded destinations and suggests similar, less-visited alternatives — spreading tourism benefits across India.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card icon={<Users className="text-brand-saffron" />} title="Detects Crowds" text="Combines visitor, booking, search and review signals." />
            <Card icon={<MapPin className="text-brand-teal" />} title="Suggests Alternatives" text="Finds similar destinations with lower crowd levels." />
            <Card icon={<TrendingUp className="text-brand-green" />} title="Boosts Local Income" text="Redirects demand to emerging regions and providers." />
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ShieldCheck size={48} className="mx-auto text-brand-green mb-4" />
          <h2 className="text-3xl font-bold text-brand-blue mb-2">Verified Trust Network</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every guide, hotel and experience goes through a verification workflow. Look for the green verified badge.
          </p>
        </div>
      </section>
    </div>
  );
}

function Section({ title, subtitle, loading, children }: any) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-1">{title}</h2>
        <p className="text-gray-600 mb-6">{subtitle}</p>
        {loading ? <div className="animate-pulse h-64 bg-gray-200 rounded-lg" /> : children}
      </div>
    </section>
  );
}

function Row({ items }: { items: Destination[] }) {
  if (!items.length) return <p className="text-gray-500">No destinations to show.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.slice(0, 8).map(d => <DestCard key={d.id} d={d} />)}
    </div>
  );
}

function DestCard({ d }: { d: Destination }) {
  return (
    <Link to={`/destinations/${d.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      <div className="relative h-44 overflow-hidden bg-gray-200">
        {d.image_url && <img src={d.image_url} alt={d.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
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
        <p className="text-sm text-gray-500 mb-2">{d.state}</p>
        <p className="text-sm text-gray-700 line-clamp-2">{d.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {(d.categories || []).slice(0, 3).map(c => (
            <span key={c} className="text-xs bg-brand-cream text-brand-teal px-2 py-1 rounded">{c}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function Card({ icon, title, text }: any) {
  return (
    <div className="bg-brand-cream p-6 rounded-xl">
      <div className="mb-3">{icon}</div>
      <h3 className="font-bold text-brand-blue mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}