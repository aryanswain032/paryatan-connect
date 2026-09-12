import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function Register({ setUser }: any) {
  const [form, setForm] = useState({
    email: "", password: "", full_name: "",
    role: "tourist", preferred_language: "English", consent_given: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!form.consent_given) { setError("Please accept the privacy consent."); return; }
    setLoading(true);
    try {
      const r = await api.post("/api/auth/register", form);
      localStorage.setItem("token", r.data.access_token);
      setUser(r.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-brand-blue mb-6">Create Account</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input required value={form.full_name}
              onChange={e => setForm({...form, full_name: e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-teal outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-teal outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Password (min 6 chars)</label>
            <input type="password" required minLength={6} value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-teal outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">I am a…</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
              className="w-full mt-1 px-3 py-2 border rounded-lg">
              <option value="tourist">Tourist</option>
              <option value="guide">Local Guide</option>
              <option value="business">Business Owner</option>
              <option value="tourism_board">Tourism Board</option>
            </select>
          </div>
          <label className="flex items-start gap-2 text-xs text-gray-700">
            <input type="checkbox" checked={form.consent_given}
              onChange={e => setForm({...form, consent_given: e.target.checked})} className="mt-1" />
            I consent to Paryatan Connect storing my email and name for account and booking purposes.
            This is a hackathon demo — no real payments or sensitive data collection.
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full bg-brand-saffron text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 text-center">
          Already have an account? <Link to="/login" className="text-brand-teal font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
}