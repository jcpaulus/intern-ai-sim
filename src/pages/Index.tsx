import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BarChart3, Users, CheckCircle, Star, Zap, Shield } from "lucide-react";

const LandingHero = () => (
  <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
    </div>
    <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-in">
      <div className="inline-flex items-center gap-2 bg-secondary/50 border border-border rounded-full px-4 py-1.5 mb-8">
        <Sparkles className="w-4 h-4 text-accent" />
        <span className="text-sm text-muted-foreground">AI-Powered Internship Simulations</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
        The AI Internship That Gets You Hired{" "}
        <span className="text-gradient">— Before You're Hired</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
        Complete realistic internship tasks, receive AI manager feedback, and build a portfolio that proves you're ready for the real world.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="hero" size="lg" className="text-lg px-8 py-6" asChild>
          <Link to="/signup">
            Start Free Simulation <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
          <Link to="/roles">Browse Roles</Link>
        </Button>
      </div>
    </div>
  </section>
);

const steps = [
  { icon: Users, title: "Choose Your Role", desc: "Pick from Marketing Analyst, Data Analyst, or UI/UX Designer roles." },
  { icon: CheckCircle, title: "Complete Tasks", desc: "Work on realistic tasks and get AI manager feedback in real time." },
  { icon: BarChart3, title: "Get Your Report", desc: "Download a professional Performance Report to share with employers." },
];

const HowItWorks = () => (
  <section className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
      <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">Three simple steps to build real-world experience</p>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="relative bg-card border border-border rounded-xl p-8 shadow-card hover:border-primary/50 transition-colors group">
            <div className="absolute -top-4 -left-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-foreground">
              {i + 1}
            </div>
            <step.icon className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const stats = [
  { value: "300M+", label: "Graduates Worldwide" },
  { value: "3", label: "Roles Available" },
  { value: "AI", label: "Powered Feedback" },
  { value: "PDF", label: "Performance Reports" },
];

const SocialProof = () => (
  <section className="py-24 px-6 bg-secondary/30">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Trusted by Ambitious Students</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{s.value}</div>
            <div className="text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple Pricing</h2>
      <p className="text-muted-foreground text-center mb-16">Start free, upgrade when you're ready</p>
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-card">
          <h3 className="text-xl font-semibold mb-2">Free</h3>
          <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-muted-foreground font-normal">/month</span></div>
          <ul className="space-y-3 mb-8">
            {["1 role available", "1-week simulations", "AI manager feedback", "Basic task briefs"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
        {/* Premium */}
        <div className="bg-card border-2 border-primary rounded-xl p-8 shadow-glow relative">
          <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" /> POPULAR
          </div>
          <h3 className="text-xl font-semibold mb-2">Premium</h3>
          <div className="text-4xl font-bold mb-6">$15<span className="text-lg text-muted-foreground font-normal">/month</span></div>
          <ul className="space-y-3 mb-8">
            {["All 3 roles", "1, 2 & 4-week durations", "AI manager feedback", "PDF Performance Reports", "LinkedIn sharing", "Priority support"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Button variant="hero" className="w-full" asChild>
            <Link to="/signup">Start Premium</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-border py-12 px-6">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <Zap className="w-6 h-6 text-accent" />
        <span className="text-xl font-bold">Internly</span>
      </div>
      <div className="flex gap-8 text-sm text-muted-foreground">
        <Link to="/roles" className="hover:text-foreground transition-colors">Roles</Link>
        <Link to="/internship-simulation" className="hover:text-foreground transition-colors">Simulation</Link>
        <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
        <span className="cursor-pointer hover:text-foreground transition-colors">Privacy</span>
        <span className="cursor-pointer hover:text-foreground transition-colors">Terms</span>
      </div>
      <div className="text-sm text-muted-foreground">© 2026 Internly. All rights reserved.</div>
    </div>
  </footer>
);

const Index = () => (
  <div className="min-h-screen bg-background">
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-accent" />
          <span className="text-xl font-bold">Internly</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roles</Link>
          <Link to="/internship-simulation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Simulation</Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          <Button variant="hero" size="sm" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
    <LandingHero />
    <HowItWorks />
    <SocialProof />
    <Pricing />
    <Footer />
  </div>
);

export default Index;
