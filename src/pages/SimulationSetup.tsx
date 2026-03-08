import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight, Building2 } from "lucide-react";

const roleData: Record<string, { title: string; description: string }> = {
  "marketing-analyst": { title: "Marketing Analyst", description: "Plan campaigns, write copy, and analyze marketing data." },
  "data-analyst": { title: "Data Analyst", description: "Analyze datasets, create visualizations, and present insights." },
  "ui-ux-designer": { title: "UI/UX Designer", description: "Conduct user research, create wireframes, and iterate on design." },
};

const companies = [
  {
    id: "nexora",
    name: "Nexora",
    industry: "Fintech Startup",
    size: "50 employees",
    description: "A fast-growing digital payments startup disrupting cross-border remittances in Southeast Asia.",
    culture: "Move fast, data-driven, flat hierarchy",
  },
  {
    id: "greenleaf",
    name: "GreenLeaf Health",
    industry: "Health & Wellness NGO",
    size: "200 employees",
    description: "A global nonprofit improving maternal health outcomes through community programs and mobile tech.",
    culture: "Mission-first, collaborative, impact-oriented",
  },
  {
    id: "vividstyle",
    name: "VividStyle",
    industry: "Fashion E-commerce",
    size: "120 employees",
    description: "A DTC fashion brand blending streetwear with sustainable materials, selling across 30+ countries.",
    culture: "Creative, brand-obsessed, trend-setting",
  },
  {
    id: "atlas-robotics",
    name: "Atlas Robotics",
    industry: "Industrial Automation",
    size: "500 employees",
    description: "An enterprise robotics company building warehouse automation solutions for Fortune 500 logistics firms.",
    culture: "Engineering-led, process-driven, quality-first",
  },
  {
    id: "pulseplay",
    name: "PulsePlay",
    industry: "Gaming & Entertainment",
    size: "80 employees",
    description: "An indie game studio known for narrative-driven mobile RPGs with 10M+ monthly active players.",
    culture: "Creative freedom, player-centric, agile sprints",
  },
];

const SimulationSetup = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const role = roleData[roleId || ""] || roleData["marketing-analyst"];

  const [duration, setDuration] = useState("1");
  const [difficulty, setDifficulty] = useState("intern");
  const [managerStyle, setManagerStyle] = useState("supportive");
  const [selectedCompany, setSelectedCompany] = useState("nexora");

  const durations = [
    { value: "1", label: "1 Week", tasks: "5 tasks" },
    { value: "2", label: "2 Weeks", tasks: "10 tasks" },
    { value: "4", label: "4 Weeks", tasks: "20 tasks" },
  ];

  const difficulties = [
    { value: "intern", label: "Intern" },
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid-level" },
  ];

  const styles = [
    { value: "supportive", label: "Supportive", desc: "Encouraging, patient, detailed guidance" },
    { value: "demanding", label: "Demanding", desc: "High expectations, direct, concise" },
    { value: "detail-oriented", label: "Detail-oriented", desc: "Meticulous, thorough, analytical" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold">Internly</span>
          </Link>
          <Link to="/roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Roles</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{role.title}</h1>
          <p className="text-muted-foreground">{role.description}</p>
        </div>

        <div className="space-y-8">
          {/* Duration */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Duration</Label>
            <div className="grid grid-cols-3 gap-3">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    duration === d.value ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground"
                  }`}
                >
                  <div className="font-semibold">{d.label}</div>
                  <div className="text-sm text-muted-foreground">{d.tasks}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Difficulty</Label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    difficulty === d.value ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground"
                  }`}
                >
                  <div className="font-semibold">{d.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Company Setting */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              <Building2 className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Company Setting
            </Label>
            <div className="space-y-3">
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompany(c.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedCompany === c.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold">{c.name}</div>
                    <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-md">{c.industry}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{c.description}</p>
                  <p className="text-xs text-muted-foreground/70">{c.size} · {c.culture}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Manager Style */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Manager Style</Label>
            <div className="space-y-3">
              {styles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setManagerStyle(s.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    managerStyle === s.value ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground"
                  }`}
                >
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button variant="hero" size="lg" className="w-full text-lg py-6" onClick={() => {
            const company = companies.find(c => c.id === selectedCompany)!;
            navigate("/simulation/orientation", {
              state: {
                roleId: roleId || "marketing-analyst",
                roleTitle: role.title,
                company,
                duration,
                difficulty,
                managerStyle,
              },
            });
          }}>
            Begin Internship at {companies.find(c => c.id === selectedCompany)?.name} <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimulationSetup;
