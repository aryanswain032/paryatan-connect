import { useState } from "react";
import { MessageCircle, X, Sparkles, Send } from "lucide-react";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Namaste! 🙏 I'm your Paryatan Assistant. Ask me about destinations, or pick a quick action below." }
  ]);
  const [input, setInput] = useState("");

  const quickPrompts = [
    { label: "🏛️ Heritage spots", query: "heritage" },
    { label: "🏖️ Beaches", query: "beach" },
    { label: "🦁 Wildlife", query: "wildlife" },
    { label: "🍛 Food trails", query: "food" },
  ];

  const handleQuick = (query: string) => {
    setMessages(prev => [...prev,
      { role: "user", text: query },
      { role: "bot", text: `Great choice! Search our Destinations page for "${query}" — click "Destinations" in the navbar and use the category filter. Or try the AI Trip Planner for a personalized itinerary!` }
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "bot",
        text: `I'll help you with "${userMsg}". For a complete answer, try our AI Trip Planner (click "Plan Trip" in navbar) — it crafts a personalized itinerary based on your budget and interests!`
      }]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-brand-saffron to-brand-teal text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform"
        aria-label="Open AI Assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[500px]">
          <div className="bg-gradient-to-r from-brand-blue to-brand-teal text-white p-4 flex items-center gap-2">
            <Sparkles size={20} className="text-brand-saffron" />
            <div>
              <h3 className="font-bold text-sm">Paryatan Assistant</h3>
              <p className="text-xs opacity-90">Demo AI — ask me anything</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-cream">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-brand-teal text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t bg-white">
            <div className="flex flex-wrap gap-1 mb-2">
              {quickPrompts.map(p => (
                <button
                  key={p.query}
                  onClick={() => handleQuick(p.query)}
                  className="text-xs bg-brand-cream hover:bg-brand-teal hover:text-white px-2 py-1 rounded-full border border-gray-200 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
              <button
                onClick={handleSend}
                className="bg-brand-saffron text-white rounded-full p-2 hover:opacity-90"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}