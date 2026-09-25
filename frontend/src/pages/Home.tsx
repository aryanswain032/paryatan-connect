import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Destination } from "../api";
import {
  MapPin, Users, Sparkles, ShieldCheck, TrendingUp, Search, Brain,
  Languages, Building2, BarChart3, Leaf, ArrowRight, CheckCircle2, Target
} from "lucide-react";

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
      {/* ============ HERO ============ */}
      <section className="relative bg-gradient-to-br from-brand-blue via-brand-teal to-brand-blue text-white">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600')",
                   backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="inline-block bg-brand-saffron/90 text-white text-xs md:text-sm font-semibold px-3 py-1 rounded-full mb-4">
            🏆 SIH 2026 · SIH26204 · Team TechnoTrek
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Discover India <span className="text-brand-saffron">beyond the crowded destinations.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-2">
            Plan personalized journeys, meet trusted local experts, and discover lesser-known places across India.
          </p>
          <p className="text-base md:text-lg text-brand-saffron font-semibold italic mb-8 max-w-3xl">
            "We don't just tell tourists where to go — we help destinations manage where tourists go."
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

          {/* Stat Strip */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl">
            <StatItem label="Destinations" value="10+" />
            <StatItem label="Verified Guides" value="5+" />
            <StatItem label="Local Businesses" value="8+" />
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            title="How It Works"
            subtitle="From your preferences to a personalized journey — in 6 steps"
          />
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StepCard n={1} icon={<Users size={22} />} title="You Share" text="Budget, interests, duration, language" />
            <StepCard n={2} icon={<Brain size={22} />} title="AI Recommends" text="Personalized trip itinerary" />
            <StepCard n={3} icon={<MapPin size={22} />} title="You Discover" text="Places, activities, local guides" />
            <StepCard n={4} icon={<CheckCircle2 size={22} />} title="You Book" text="Hotels, guides, restaurants" />
            <StepCard n={5} icon={<BarChart3 size={22} />} title="You Review" text="Feedback & analytics" />
            <StepCard n={6} icon={<TrendingUp size={22} />} title="We Redistribute" text="Redirect demand to emerging spots" />
          </div>
        </div>
      </section>

      {/* ============ POPULAR ============ */}
      <Section title="Popular Destinations" subtitle="Highly visited — plan ahead or explore alternatives" loading={loading}>
        <Row items={popular} />
      </Section>

      {/* ============ EMERGING ============ */}
      <Section title="Emerging Destinations" subtitle="Lesser-known gems that need your love" loading={loading}>
        <Row items={emerging} />
      </Section>

      {/* ============ DEMAND DISTRIBUTION (Enhanced) ============ */}
      <section className="bg-gradient-to-br from-brand-blue to-brand-teal text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-brand-saffron text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              ⭐ CORE INNOVATION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              AI-Powered Demand Redistribution
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Our engine detects overcrowded destinations and intelligently redirects tourist interest to similar, less-visited alternatives — spreading tourism benefits across India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <FeatureCard
              icon={<Users />}
              title="Detects Crowds"
              text="Combines visitor, booking, search & review signals into a live crowd score."
            />
            <FeatureCard
              icon={<MapPin />}
              title="Finds Alternatives"
              text="Matches similar destinations by category, distance & availability."
            />
            <FeatureCard
              icon={<TrendingUp />}
              title="Boosts Local Income"
              text="Redirects demand to emerging regions, hotels, guides and vendors."
            />
          </div>

          {/* Redistribution Flow Visual */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8">
            <h3 className="font-bold text-lg mb-4 text-center">Example Flow (Demo Data)</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              <FlowBox label="Crowded" value="Puri" color="bg-red-500/90" />
              <ArrowRight className="text-brand-saffron rotate-90 md:rotate-0" size={24} />
              <FlowBox label="Engine Detects" value="Crowd Score 100" color="bg-yellow-500/90" />
              <ArrowRight className="text-brand-saffron rotate-90 md:rotate-0" size={24} />
              <FlowBox label="Suggests" value="Dhauli / Cuttack" color="bg-green-500/90" />
              <ArrowRight className="text-brand-saffron rotate-90 md:rotate-0" size={24} />
              <FlowBox label="Result" value="30% Redirected" color="bg-brand-saffron" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ UNIQUE VALUE PROPOSITIONS ============ */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            title="What Makes Us Different"
            subtitle="Four unique value propositions"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <UVP
              icon={<MapPin className="text-brand-saffron" />}
              title="India-First Tier-2/3 Focus"
              text="Designed for emerging destinations, not just the famous few."
            />
            <UVP
              icon={<Brain className="text-brand-teal" />}
              title="AI + Redistribution"
              text="Personalization and demand distribution in one ecosystem."
            />
            <UVP
              icon={<Languages className="text-brand-green" />}
              title="Local-Language Support"
              text="English, Hindi, Odia & more — designed for real India."
            />
            <UVP
              icon={<Building2 className="text-brand-blue" />}
              title="Works for Small Players"
              text="Hotels, homestays, vendors, guides — all welcome."
            />
          </div>
        </div>
      </section>

      {/* ============ SMART FEATURES ============ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Smart Features" subtitle="Everything you need, in one place" />
          <div className="grid md:grid-cols-3 gap-5">
            <FeatureCardLight icon={<Sparkles />} title="AI Trip Planner" text="Transparent recommendations with clear reasons." />
            <FeatureCardLight icon={<ShieldCheck />} title="Verified Network" text="Green verified badge on trusted guides & businesses." />
            <FeatureCardLight icon={<TrendingUp />} title="Demand Alerts" text="Real-time crowd levels for every destination." />
            <FeatureCardLight icon={<Search />} title="Smart Discovery" text="Search by interest, category, budget & language." />
            <FeatureCardLight icon={<BarChart3 />} title="Provider Analytics" text="Simple dashboards for local businesses." />
            <FeatureCardLight icon={<Leaf />} title="Sustainable Tourism" text="Spread benefits, reduce overcrowding." />
          </div>
        </div>
      </section>

      {/* ============ IMPACT GOALS (Targets) ============ */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-brand-saffron text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              🎯 YEAR-1 TARGETS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Impact Goals</h2>
            <p className="text-white/80 max-w-2xl mx-auto text-sm">
              Proposed targets for our pilot phase. Not yet achieved — these define our roadmap.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            <ImpactCard value="100,000+" label="Tourists to Reach" />
            <ImpactCard value="5,000+" label="Businesses to Onboard" />
            <ImpactCard value="1,000+" label="Guide Jobs to Create" />
            <ImpactCard value="₹2.5 Cr" label="Local Income Target" />
            <ImpactCard value="30%" label="Traffic to Redirect" />
          </div>

          <p className="text-center text-xs text-white/60 mt-8 max-w-2xl mx-auto">
            ⚠️ Targets only. These are our proposed Phase-1 goals and are not yet achieved. 
            Official tourism statistics: 
            <a href="https://data.tourism.gov.in" target="_blank" rel="noreferrer" className="text-brand-saffron underline ml-1">
              data.tourism.gov.in
            </a>
          </p>
        </div>
      </section>

      {/* ============ FOR BUSINESSES CTA ============ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-brand-teal to-brand-blue rounded-2xl p-8 md:p-12 text-white text-center">
            <Target size={48} className="mx-auto text-brand-saffron mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Own a Hotel, Restaurant, or Homestay?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join Paryatan Connect for free. Get visitor insights, listing optimization tips, 
              and connect with tourists looking for authentic local experiences.
            </p>
            <Link to="/register" className="inline-block px-6 py-3 bg-brand-saffron text-white font-semibold rounded-lg hover:opacity-90">
              List Your Business — Free
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TRUST ============ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ShieldCheck size={40} className="mx-auto text-brand-green mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-2">Verified Trust Network</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Every guide, hotel and experience goes through a verification workflow. Look for the green verified badge.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ============ HELPER COMPONENTS ============ */

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
      <p className="text-2xl font-bold text-brand-saffron">{value}</p>
      <p className="text-xs text-white/80">{label}</p>
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-2">{title}</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}

function StepCard({ n, icon, title, text }: any) {
  return (
    <div className="relative bg-brand-cream rounded-xl p-4 text-center hover:shadow-md transition">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-brand-saffron text-white text-xs font-bold flex items-center justify-center">
        {n}
      </div>
      <div className="text-brand-teal mt-3 mb-2 flex justify-center">{icon}</div>
      <h3 className="font-bold text-brand-blue text-sm">{title}</h3>
      <p className="text-xs text-gray-600 mt-1">{text}</p>
    </div>
  );
}

function FeatureCard({ icon, title, text }: any) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
      <div className="text-brand-saffron flex justify-center mb-3">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-white/80">{text}</p>
    </div>
  );
}

function FeatureCardLight({ icon, title, text }: any) {
  return (
    <div className="bg-brand-cream rounded-xl p-5">
      <div className="text-brand-teal mb-3">{icon}</div>
      <h3 className="font-bold text-brand-blue mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}

function UVP({ icon, title, text }: any) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition">
      <div className="mb-3">{icon}</div>
      <h3 className="font-bold text-brand-blue mb-1 text-sm">{title}</h3>
      <p className="text-xs text-gray-600">{text}</p>
    </div>
  );
}

function FlowBox({ label, value, color }: any) {
  return (
    <div className={`${color} rounded-xl px-4 py-3 text-center text-white min-w-[140px]`}>
      <p className="text-xs opacity-90">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function ImpactCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
      <p className="text-3xl font-bold text-brand-saffron mb-1">{value}</p>
      <p className="text-xs text-white/80">{label}</p>
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