import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Download, Linkedin, Star, ArrowLeft, ArrowRight } from "lucide-react";

const skillScores = [
  { skill: "Technical Skills", score: 8 },
  { skill: "Communication", score: 9 },
  { skill: "Problem Solving", score: 7 },
  { skill: "Time Management", score: 8 },
  { skill: "Initiative", score: 7 },
];

const taskBreakdown = [
  { task: "Competitive Analysis Brief", score: 85, feedback: "Strong research methodology and clear presentation of findings." },
  { task: "Social Media Content Calendar", score: 90, feedback: "Creative content themes with excellent platform-specific optimization." },
  { task: "Campaign Performance Report", score: 80, feedback: "Good data interpretation; recommendations could be more actionable." },
  { task: "Email Marketing Draft", score: 78, feedback: "Solid structure; subject line testing approach was impressive." },
  { task: "Brand Positioning Summary", score: 82, feedback: "Well-articulated brand voice with clear competitive differentiation." },
];

const PerformanceReport = () => {
  const overallScore = 83;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <span className="font-bold">Internly</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Download PDF
            </Button>
            <Button variant="hero" size="sm">
              <Linkedin className="w-4 h-4 mr-1" /> Share to LinkedIn
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-card mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">Internly</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Performance Evaluation Report</h1>
          <p className="text-muted-foreground">Marketing Analyst Internship Simulation</p>
          <div className="text-sm text-muted-foreground mt-2">February 1 – February 7, 2026 • Completed</div>
        </div>

        {/* Overall Score */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-card mb-8 text-center">
          <div className="text-6xl font-bold text-gradient mb-2">{overallScore}</div>
          <div className="text-muted-foreground">Overall Score out of 100</div>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
            <Star className="w-5 h-5 text-accent" />
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-card mb-8">
          <h2 className="text-xl font-bold mb-4">Executive Summary</h2>
          <p className="text-muted-foreground leading-relaxed">
            Alex demonstrated strong analytical capabilities and creative thinking throughout the Marketing Analyst simulation.
            Their content calendar work was particularly impressive, showing an ability to think strategically about audience engagement.
            With further development in data-driven recommendation frameworks, Alex would be well-prepared for entry-level marketing analyst positions.
          </p>
        </div>

        {/* Skills Scorecard */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-card mb-8">
          <h2 className="text-xl font-bold mb-6">Skills Scorecard</h2>
          <div className="space-y-4">
            {skillScores.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.skill}</span>
                  <span className="text-accent font-semibold">{s.score}/10</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-500"
                    style={{ width: `${s.score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Breakdown */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-card mb-8">
          <h2 className="text-xl font-bold mb-6">Task-by-Task Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-muted-foreground font-medium">Task</th>
                  <th className="text-center py-3 text-muted-foreground font-medium w-20">Score</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Key Feedback</th>
                </tr>
              </thead>
              <tbody>
                {taskBreakdown.map((t) => (
                  <tr key={t.task} className="border-b border-border/50">
                    <td className="py-3 font-medium">{t.task}</td>
                    <td className="py-3 text-center">
                      <span className="text-accent font-bold">{t.score}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">{t.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manager's Recommendation */}
        <div className="bg-card border-2 border-primary/30 rounded-xl p-8 shadow-glow mb-8">
          <h2 className="text-xl font-bold mb-4">Manager's Recommendation</h2>
          <p className="text-muted-foreground leading-relaxed italic">
            "Alex has shown strong potential for entry-level marketing analyst roles. Their ability to identify content trends
            and translate data into actionable insights is above average for this level. I recommend they focus on strengthening
            their quantitative analysis skills and practice presenting data visually. With these improvements, they would be
            a strong candidate for marketing analyst positions at growth-stage companies."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-foreground">SM</div>
            <div>
              <div className="font-semibold text-sm">Sarah Martinez</div>
              <div className="text-xs text-muted-foreground">Marketing Manager, Nexus Digital</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg">
            <Download className="w-5 h-5 mr-2" /> Download PDF Report
          </Button>
          <Button variant="outline" size="lg">
            <Linkedin className="w-5 h-5 mr-2" /> Share to LinkedIn
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/roles">Start New Simulation</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReport;
