import { useState } from "react";
import { MessageCircle, X, Sparkles, Send } from "lucide-react";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: "bot", text: "Namaste! I am your Paryatan Assistant. Ask me anything about Indian tourism!" }
  ]);
  const [input, setInput] = useState("");

  const quickPrompts = [
    { label: "Heritage", query: "heritage" },
    { label: "Beaches", query: "beach" },
    { label: "Wildlife", query: "wildlife" },
    { label: "Food", query: "food" },
    { label: "Culture", query: "culture" },
    { label: "Wellness", query: "wellness" },
  ];

  function getBotReply(text: string): string {
    const t = text.toLowerCase();
    if (t.includes("heritage") || t.includes("temple") || t.includes("monument"))
      return "Heritage picks: Bhubaneswar (Lingaraj Temple), Konark Sun Temple, Dhauli, Puri, Hampi, Khajuraho, Mahabalipuram, Ajanta-Ellora. Use 'Destinations' with heritage filter or AI Trip Planner!";
    if (t.includes("beach") || t.includes("sea") || t.includes("coast"))
      return "Best beaches: Puri, Gopalpur, Chandipur (Odisha), Goa, Kovalam (Kerala), Pondicherry, Digha. Best season Oct-Mar. Try AI Trip Planner with 'beach' interest!";
    if (t.includes("wildlife") || t.includes("tiger") || t.includes("safari") || t.includes("animal"))
      return "Wildlife: Similipal Tiger Reserve, Satkosia, Chilika (dolphins!), Kaziranga (rhinos), Ranthambore, Bandipur. Best Nov-Apr. Try AI Trip Planner with wildlife + nature!";
    if (t.includes("food") || t.includes("cuisine") || t.includes("eat"))
      return "Food trails: Cuttack (Odia thali, dahibara), Bhubaneswar street food, Kolkata, Lucknow (kebabs), Hyderabad (biryani), Amritsar (langar), Delhi chaat.";
    if (t.includes("culture") || t.includes("art") || t.includes("dance") || t.includes("craft"))
      return "Culture gems: Raghurajpur (Pattachitra paintings), Konark, Puri (Odissi dance), Varanasi, Udaipur, Madurai. Our destination cards show culture filter!";
    if (t.includes("wellness") || t.includes("yoga") || t.includes("spa") || t.includes("ayurveda"))
      return "Wellness escapes: Gopalpur (Odisha), Rishikesh, Kerala (Ayurveda), Goa, Dharamshala. Best Sep-Apr. Try AI Trip Planner with wellness interest!";
    if (t.includes("budget") || t.includes("cheap") || t.includes("money") || t.includes("cost"))
      return "Set your budget in the AI Trip Planner. Rs.8000 works for 3-day Odisha trips. Rs.15000 for a week. Government hotels and homestays save 40%!";
    if (t.includes("trip") || t.includes("plan") || t.includes("itinerary"))
      return "Click Plan Trip in the navbar! Enter budget, days, and interests - we generate a personalized itinerary with reasons for each pick.";
    if (t.includes("guide") || t.includes("local expert"))
      return "Click Guides in the navbar to see 5 verified local experts with ratings, languages, and specialties. Book directly from their profile!";
    if (t.includes("book") || t.includes("hotel") || t.includes("stay") || t.includes("restaurant"))
      return "Click Businesses to see 8 verified hotels, restaurants, shops, and activity providers. Request a booking from any listing!";
    if (t.includes("odisha") || t.includes("odia"))
      return "Odisha highlights: Bhubaneswar, Puri, Konark, Dhauli, Chilika, Cuttack, Similipal, Satkosia, Gopalpur, Raghurajpur. Our platform starts with Odisha - more states coming soon!";
    if (t.includes("rajasthan") || t.includes("jaipur") || t.includes("udaipur"))
      return "Rajasthan: Jaipur (Pink City), Udaipur (City of Lakes), Jaisalmer (desert), Ranthambore (tigers). Best Oct-Mar!";
    if (t.includes("kerala") || t.includes("munnar") || t.includes("alleppey"))
      return "Kerala: Munnar tea gardens, Alleppey backwaters, Kovalam beaches, Wayanad forests. Best Sep-May!";
    if (t.includes("crowd") || t.includes("busy"))
      return "We detect crowds and suggest alternatives! If a destination is crowded, we redirect you to similar emerging spots with lower crowds. Check demand distribution on Home page!";
    if (t.includes("hi") || t.includes("hello") || t.includes("namaste") || t.includes("hey"))
      return "Namaste! How can I help you plan your Indian journey today?";
    return "I can help with: heritage, beaches, wildlife, food, culture, wellness, guides, bookings, or trip planning. Try a quick button below!";
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev: any[]) => [...prev, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev: any[]) => [...prev, { role: "bot", text: getBotReply(text) }]);
    }, 400);
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
              <p className="text-xs opacity-90">Ask me anything about Indian tourism</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-cream min-h-[200px]">
            {messages.map((m, i) => (
              <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={"max-w-[85%] rounded-2xl px-3 py-2 text-sm " + (m.role === "user" ? "bg-brand-teal text-white" : "bg-white text-gray-800 border border-gray-200")}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t bg-white">
            <div className="flex flex-wrap gap-1 mb-2">
              {quickPrompts.map(p => (
                <button key={p.query} onClick={() => sendMessage(p.query)} className="text-xs bg-brand-cream hover:bg-brand-teal hover:text-white px-2 py-1 rounded-full border border-gray-200">
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask about destinations..."
                className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
              <button onClick={() => sendMessage(input)} className="bg-brand-saffron text-white rounded-full p-2" aria-label="Send">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
