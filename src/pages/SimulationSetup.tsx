import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight, ArrowLeft, Building2 } from "lucide-react";
import { useProgress, STEPS } from "@/hooks/useProgress";

const roleData: Record<string, { title: string; description: string }> = {
  "business-analyst": { title: "Business Analyst", description: "Analyze business requirements, identify process improvements, and communicate with stakeholders." },
  "marketing-associate": { title: "Marketing Associate", description: "Support marketing campaigns, create content, and conduct market research." },
  "operations-assistant": { title: "Operations Assistant", description: "Assist with operations tasks, manage scheduling, and optimize workflow processes." },
};

const companies = [
  {
    id: "nexora",
    name: "Nexora",
    industry: "Fintech Startup",
    size: "50 employees",
    description: "A fast-growing digital payments startup making cross-border payments instant and affordable. Teams work across engineering, marketing, and analytics with a data-driven culture.",
    culture: "Move fast, data-driven, radical transparency",
  },
  {
    id: "brightwave",
    name: "BrightWave Marketing",
    industry: "Media/Advertising",
    size: "200 employees",
    description: "A creative marketing agency specializing in digital campaigns for clients. Teams span branding, social media, and analytics, using tools like Google Analytics and Hootsuite.",
    culture: "Creative, data-driven strategy, collaborative",
  },
  {
    id: "atlas-robotics",
    name: "Atlas Robotics",
    industry: "Robotics & Engineering",
    size: "300 employees",
    description: "An industrial automation company building next-generation robotic systems. Teams span hardware, firmware, software, and operations with a focus on precision and reliability.",
    culture: "Engineering excellence, safety first, continuous improvement",
  },
];

const SimulationSetup = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { saveProgress, getStep, loading: progressLoading } = useProgress();
  const role = roleData[roleId || ""] || roleData["business-analyst"];

  const [duration, setDuration] = useState("4");
  const [level, setLevel] = useState("intermediate");
  const [managerStyle, setManagerStyle] = useState("supportive");
  const [selectedCompany, setSelectedCompany] = useState("nexora");
  const [restored, setRestored] = useState(false);

  // Restore saved setup progress
  useEffect(() => {
    if (progressLoading || restored) return;
    const saved = getStep(STEPS.SIMULATION_SETUP);
    if (saved?.metadata && saved.status !== "completed") {
      if (saved.metadata.duration) setDuration(saved.metadata.duration);
      if (saved.metadata.level) setLevel(saved.metadata.level);
      if (saved.metadata.managerStyle) setManagerStyle(saved.metadata.managerStyle);
      if (saved.metadata.selectedCompany) setSelectedCompany(saved.metadata.selectedCompany);
    }
    setRestored(true);
  }, [progressLoading, restored, getStep]);

  // Auto-save setup changes
  const saveSetup = (overrides: Record<string, any> = {}) => {
    saveProgress(STEPS.SIMULATION_SETUP, "in_progress", {
      roleId, duration, level, managerStyle, selectedCompany, ...overrides,
    });
  };

  const durations = [
    { value: "2", label: "2 Weeks", tasks: "10 tasks" },
    { value: "4", label: "4 Weeks", tasks: "20 tasks" },
    { value: "6", label: "6 Weeks", tasks: "30 tasks" },
    { value: "8", label: "8 Weeks", tasks: "40 tasks" },
    { value: "12", label: "12 Weeks", tasks: "60 tasks" },
  ];

  const levels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
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
            <div className="grid grid-cols-5 gap-3">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => { setDuration(d.value); saveSetup({ duration: d.value }); }}
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

           {/* Level */}
           <div>
             <Label className="text-base font-semibold mb-3 block">Level</Label>
             <div className="grid grid-cols-3 gap-3">
               {levels.map((l) => (
                 <button
                   key={l.value}
                   onClick={() => setLevel(l.value)}
                   className={`p-4 rounded-xl border text-center transition-all ${
                     level === l.value ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground"
                   }`}
                 >
                   <div className="font-semibold">{l.label}</div>
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

          {/* Navigation */}
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="py-6" onClick={() => navigate("/roles")}>
              <ArrowLeft className="w-5 h-5 mr-1" /> Back to Roles
            </Button>
            <Button variant="hero" size="lg" className="flex-1 text-lg py-6" onClick={() => {
              const company = companies.find(c => c.id === selectedCompany)!;
              navigate("/simulation/orientation", {
                state: {
                  roleId: roleId || "marketing-associate",
                  roleTitle: role.title,
                  company,
                  duration,
                  level,
                  managerStyle,
                },
              });
            }}>
              Begin Internship at {companies.find(c => c.id === selectedCompany)?.name} <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationSetup;
