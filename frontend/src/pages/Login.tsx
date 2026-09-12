import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function Login({ setUser }: any) {
  const [email, setEmail] = useState("tourist@demo.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const r = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", r.data.access_token);
      setUser(r.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-brand-blue mb-6">Welcome Back</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-teal outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-teal outline-none" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full bg-brand-saffron text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 text-center">
          No account? <Link to="/register" className="text-brand-teal font-medium">Sign up</Link>
        </div>
        <div className="mt-6 p-3 bg-brand-cream rounded-lg text-xs text-gray-700">
          <strong>Demo accounts:</strong><br/>
          tourist@demo.com / demo1234<br/>
          guide@demo.com / demo1234<br/>
          admin@demo.com / demo1234
        </div>
      </div>
    </div>
  );
}