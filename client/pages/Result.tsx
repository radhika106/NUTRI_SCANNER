import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Check, CheckCircle2, Download, FileText, Info, Leaf, Lightbulb, Moon, ScanLine, ShieldAlert, Sun, TriangleAlert, XCircle } from "lucide-react";

type AnalysisState = "success" | "loading" | "error" | "empty";
type IngredientRisk = "safe" | "moderate" | "high";
type Ingredient = { name: string; risk: IngredientRisk; description: string; assessment: string };

type Analysis = {
  product: { image: string; name: string; brand: string; category: string };
  score: number;
  rating: string;
  explanation: string;
  factors: { label: string; value: string; tone: "good" | "moderate" | "high" }[];
  good: string[];
  watchOut: string[];
  ingredients: Ingredient[];
  nutrition: { label: string; value: string; warning?: boolean }[];
  recommendation: { title: string; detail: string };
};

const analysis: Analysis = {
  product: { image: "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2Fe7867c7552b84aff8107d262e4eb4382?format=webp&width=800&height=1200", name: "Crispy Oat Bites", brand: "Harvest & Co.", category: "Snack / Breakfast" },
  score: 45,
  rating: "Moderate Choice",
  explanation: "This product is okay for occasional consumption.",
  factors: [{ label: "High Sugar", value: "High", tone: "high" }, { label: "Saturated Fat", value: "Moderate", tone: "moderate" }, { label: "Trans Fat", value: "Good", tone: "good" }, { label: "Additives", value: "Moderate", tone: "moderate" }],
  good: ["Contains oats which are a good source of fiber", "No trans fat detected", "Provides some essential minerals", "No artificial colors detected"],
  watchOut: ["High in sugar", "Contains palm oil", "Contains artificial flavour", "Refined flour is used"],
  ingredients: [
    { name: "Oats (35%)", risk: "safe", description: "A whole-grain ingredient that contributes fiber and texture.", assessment: "Low concern" },
    { name: "Wheat Flour (Maida)", risk: "moderate", description: "Refined flour used as the main structure for the snack.", assessment: "Moderate" },
    { name: "Sugar", risk: "high", description: "Adds sweetness and is listed high in the ingredient order.", assessment: "High concern" },
    { name: "Palm Oil", risk: "moderate", description: "Commonly used in packaged foods for texture and shelf life.", assessment: "Moderate" },
    { name: "Inverted Syrup", risk: "moderate", description: "A sweetening syrup that increases the total added sugar load.", assessment: "Moderate" },
    { name: "Cocoa Solids", risk: "safe", description: "Provides the product's cocoa flavor and color.", assessment: "Low concern" },
    { name: "Milk Solids", risk: "safe", description: "Adds dairy flavor and a small amount of protein.", assessment: "Low concern" },
    { name: "Emulsifier (INS 322)", risk: "safe", description: "Helps keep the ingredients blended and consistent.", assessment: "Low concern" },
    { name: "Raising Agent (INS 500(ii))", risk: "safe", description: "Helps the baked product achieve a lighter texture.", assessment: "Low concern" },
    { name: "Iodised Salt", risk: "moderate", description: "Adds flavor; sodium intake is best kept moderate.", assessment: "Moderate" },
    { name: "Artificial Flavour (Vanilla)", risk: "moderate", description: "Added flavoring used to create a consistent vanilla note.", assessment: "Moderate" },
  ],
  nutrition: [{ label: "Energy", value: "452 kcal" }, { label: "Carbohydrates", value: "68 g" }, { label: "Sugar", value: "27 g", warning: true }, { label: "Protein", value: "7 g" }, { label: "Total Fat", value: "18 g" }, { label: "Saturated Fat", value: "9 g", warning: true }, { label: "Trans Fat", value: "0 g" }],
  recommendation: { title: "Okay for occasional consumption.", detail: "Consider a lower-sugar, whole-grain alternative for daily use." },
};

function ResultHeader({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  return <header className="bg-[#001F16] text-white"><div className="mx-auto flex h-[88px] max-w-[1240px] items-center justify-between px-5 lg:px-8"><Link to="/" className="flex items-center gap-3"><span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#168A4A] text-[#B6F35B]"><Leaf className="h-5 w-5" /><span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#001F16] bg-[#65C51A]" /></span><span><span className="block text-[22px] font-bold leading-none">Nutri<span className="text-[#B6F35B]">Scan</span></span><span className="mt-1 block text-[10px] text-[#B4C9BF]">Scan. Understand. Choose Better.</span></span></Link><nav className="hidden items-center gap-8 md:flex"><Link to="/" className="result-nav-link"><ScanLine className="h-4 w-4" /> Scan</Link><Link to="/history" className="result-nav-link">History</Link><Link to="/about" className="result-nav-link">About</Link></nav><div className="flex items-center gap-3"><button onClick={onToggleTheme} aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"} className="icon-button">{isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}</button><button className="login-button hidden sm:flex">Log In</button></div></div></header>;
}

function ScoreRing({ score }: { score: number }) { return <div className="result-score-ring" style={{ background: `conic-gradient(#18D96B 0deg ${score * 3.6}deg, #E7C84F ${score * 3.6}deg 205deg, #DCE8DF 205deg 360deg)` }}><div><strong>{score}</strong><span>/100</span></div></div>; }
function StatusBadge({ tone, value }: { tone: "good" | "moderate" | "high"; value: string }) { return <span className={`status-badge ${tone}`}>{tone === "good" ? <Check className="h-3 w-3" /> : tone === "high" ? <XCircle className="h-3 w-3" /> : <TriangleAlert className="h-3 w-3" />}{value}</span>; }
function InsightPanel({ good, items }: { good: boolean; items: string[] }) { return <section className={`analysis-panel ${good ? "good" : "watch"}`}><div className="flex items-center gap-2">{good ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}<h2>{good ? "What's Good" : "Watch Out"}</h2></div><ul className="mt-5 space-y-3">{items.map((item) => <li key={item}><span>{good ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}</span>{item}</li>)}</ul></section>; }

function IngredientExplorer({ ingredients }: { ingredients: Ingredient[] }) {
  const [openIngredient, setOpenIngredient] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideTap = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpenIngredient(null);
    };
    document.addEventListener("pointerdown", closeOnOutsideTap);
    return () => document.removeEventListener("pointerdown", closeOnOutsideTap);
  }, []);

  return <div ref={containerRef} className="ingredient-explorer" role="list">{ingredients.map((ingredient) => {
    const isOpen = openIngredient === ingredient.name;
    const indicator = ingredient.risk === "safe" ? "✓" : ingredient.risk === "moderate" ? "⚠" : "!";
    return <div className={`ingredient-item ${isOpen ? "is-open" : ""}`} key={ingredient.name} role="listitem" onMouseEnter={() => setOpenIngredient(ingredient.name)} onMouseLeave={() => setOpenIngredient(null)}><button type="button" className="ingredient-row" aria-expanded={isOpen} aria-controls={`ingredient-info-${ingredient.name}`} onClick={() => setOpenIngredient(isOpen ? null : ingredient.name)} onFocus={() => setOpenIngredient(ingredient.name)}><span className={`ingredient-risk ${ingredient.risk}`} aria-label={`${ingredient.risk} concern`}>{indicator}</span><span>{ingredient.name}</span></button>{isOpen && <div id={`ingredient-info-${ingredient.name}`} className="ingredient-info-card" role="tooltip"><strong>{ingredient.name}</strong><p>{ingredient.description}</p><span>AI assessment: <b>{ingredient.assessment}</b></span></div>}</div>;
  })}</div>;
}

function ResultContent({ data }: { data: Analysis }) {
  return <div className="mx-auto max-w-[1240px] px-5 pb-20 lg:px-8"><div className="result-summary"><div className="result-product-large"><img src={data.product.image} alt={`${data.product.name} package`} /></div><div className="min-w-0"><span className="category-badge">{data.product.category}</span><h2 className="mt-3 text-2xl font-bold tracking-[-.04em]">{data.product.name}</h2><p className="mt-1 text-sm text-[#667085]">{data.product.brand}</p><p className="mt-6 text-xs text-[#98A2B3]"><CalendarDays className="mr-1 inline h-3.5 w-3.5" /> Scanned today · 10:30 AM</p></div><div className="result-score-block"><ScoreRing score={data.score} /><p className="mt-3 font-bold">{data.rating}</p><p className="mt-1 max-w-[210px] text-center text-xs leading-5 text-[#667085]">{data.explanation}</p></div><div className="factor-list">{data.factors.map((factor) => <div className="factor-row" key={factor.label}><span>{factor.label}</span><StatusBadge tone={factor.tone} value={factor.value} /></div>)}</div></div><div className="mt-6 grid gap-5 md:grid-cols-2"><InsightPanel good items={data.good} /><InsightPanel good={false} items={data.watchOut} /></div><section className="analysis-card mt-6"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><FileText className="h-5 w-5 text-[#168A4A]" /><h2>Ingredients</h2></div><button className="text-sm font-bold text-[#168A4A]">View Full Ingredients</button></div><div className="mt-5"><IngredientExplorer ingredients={data.ingredients} /></div><p className="mt-5 flex items-center gap-2 text-xs text-[#98A2B3]"><Info className="h-3.5 w-3.5" /> Ingredients are listed in descending order by weight.</p></section><section className="analysis-card mt-6"><div className="flex items-center gap-2"><Leaf className="h-5 w-5 text-[#168A4A]" /><h2>Nutrition Snapshot <span className="ml-1 text-xs font-normal text-[#98A2B3]">per 100g</span></h2></div><div className="nutrition-grid mt-5">{data.nutrition.map((item) => <div className={item.warning ? "nutrition-item warning" : "nutrition-item"} key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></section><section className="recommendation-large mt-6"><Lightbulb className="h-6 w-6 shrink-0 text-[#C49400]" /><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#9A7600]">Recommendation</p><h2 className="mt-2 text-lg font-bold text-[#7B5C00]">{data.recommendation.title}</h2><p className="mt-1 text-sm leading-6 text-[#92752A]">{data.recommendation.detail}</p></div></section><div className="mt-8 text-center"><Link to="/" className="primary-cta"><ArrowLeft className="h-4 w-4" /> Scan Another Product</Link></div></div>;
}

export default function Result() {
  const [isDark, setIsDark] = useState(() => window.localStorage.getItem("nutriscan-theme") !== "light");
  const [state] = useState<AnalysisState>("success");
  const toggleTheme = () => setIsDark((current) => { const next = !current; window.localStorage.setItem("nutriscan-theme", next ? "dark" : "light"); return next; });
  return <div className={`min-h-screen font-sans ${isDark ? "dark-theme" : "bg-[#F7FBF7]"}`}><ResultHeader isDark={isDark} onToggleTheme={toggleTheme} /><main className="px-5 py-10 lg:px-8"><div className="mx-auto max-w-[1240px]"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow"><CheckCircle2 className="mr-1 inline h-4 w-4" /> Analysis Complete!</p><h1 className="section-title mt-2">Here's what we found in your product</h1></div><div className="flex gap-3"><Link to="/" className="back-button"><ArrowLeft className="h-4 w-4" /> Back to Scan</Link><button className="download-button" onClick={() => { const file = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(file); const link = document.createElement("a"); link.href = url; link.download = "nutriscan-report.json"; link.click(); URL.revokeObjectURL(url); }}><Download className="h-4 w-4" /> Download Report</button></div></div>{state === "loading" && <div className="analysis-empty">Analyzing your product…</div>}{state === "error" && <div className="analysis-empty">We couldn't load this result. Please scan again.</div>}{state === "empty" && <div className="analysis-empty">No analysis is available yet.</div>}{state === "success" && <ResultContent data={analysis} />}</div></main></div>;
}
