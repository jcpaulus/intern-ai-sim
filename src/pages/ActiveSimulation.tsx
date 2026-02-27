import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Send, Lightbulb, MessageCircle, Upload, CheckCircle, Clock, AlertCircle, X, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const tasks = [
  { id: 1, title: "Competitive Analysis Brief", status: "reviewed" as const },
  { id: 2, title: "Social Media Content Calendar", status: "submitted" as const },
  { id: 3, title: "Campaign Performance Report", status: "active" as const },
  { id: 4, title: "Email Marketing Draft", status: "pending" as const },
  { id: 5, title: "Brand Positioning Summary", status: "pending" as const },
];

const statusIcon = {
  reviewed: <CheckCircle className="w-4 h-4 text-accent" />,
  submitted: <Clock className="w-4 h-4 text-primary" />,
  active: <AlertCircle className="w-4 h-4 text-accent" />,
  pending: <div className="w-4 h-4 rounded-full border border-muted-foreground" />,
};

const ActiveSimulation = () => {
  const [submission, setSubmission] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const oversized = newFiles.filter(f => f.size > 10 * 1024 * 1024);
    if (oversized.length) {
      toast.error("File terlalu besar. Maksimal 10MB per file.");
      return;
    }
    setAttachedFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const uploaded: string[] = [];
    for (const file of attachedFiles) {
      const filePath = `submissions/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("task-submissions")
        .upload(filePath, file);
      if (error) {
        toast.error(`Gagal upload ${file.name}: ${error.message}`);
        return null;
      }
      uploaded.push(filePath);
    }
    return uploaded;
  };

  const currentTask = tasks[2]; // Task 3 active
  const progress = (2 / 5) * 100;

  const handleSubmit = () => {
    if (submission.trim()) setShowFeedback(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-full mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="font-bold">Internly</span>
            </Link>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Marketing Analyst</span>
              <span>•</span>
              <span>5 days remaining</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">2/5 tasks</span>
              <Progress value={progress} className="w-32 h-2" />
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">Exit</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Task List */}
        <aside className="hidden md:flex w-72 border-r border-border bg-card flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Tasks</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {tasks.map((task) => (
              <button
                key={task.id}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-colors ${
                  task.status === "active" ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary"
                }`}
              >
                {statusIcon[task.status]}
                <span className={task.status === "active" ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {task.id}. {task.title}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto w-full">
          {/* Task Brief - Email Style */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card mb-6 animate-fade-in">
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-foreground">SM</div>
                <div>
                  <div className="font-semibold">Sarah Martinez</div>
                  <div className="text-xs text-muted-foreground">Marketing Manager • Nexus Digital</div>
                </div>
                <Badge variant="secondary" className="ml-auto text-xs">Task 3/5</Badge>
              </div>
              <div className="font-semibold text-lg">Re: Campaign Performance Report Needed</div>
            </div>
            <div className="p-5 text-sm leading-relaxed text-muted-foreground space-y-3">
              <p>Hi there,</p>
              <p>Great work on the content calendar — the team loved the thematic consistency across platforms.</p>
              <p>For your next task, I need you to <span className="text-foreground font-medium">create a campaign performance report</span> for our Q1 social media campaigns. Here's what I'm looking for:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Overview of key metrics (impressions, engagement rate, click-through rate)</li>
                <li>Top 3 performing posts with analysis of why they worked</li>
                <li>Recommendations for Q2 based on the data</li>
              </ul>
              <p>Use the sample data provided in the attached brief. I'd like this by <span className="text-foreground font-medium">end of day Friday</span>.</p>
              <p>Let me know if you have questions!</p>
              <p>Best,<br />Sarah</p>
            </div>
          </div>

          {/* Hint Button */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="outline"
              size="sm"
              disabled={hintsUsed >= 2}
              onClick={() => setHintsUsed(hintsUsed + 1)}
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              Get Hint ({2 - hintsUsed} remaining)
            </Button>
            {hintsUsed > 0 && (
              <span className="text-xs text-muted-foreground">Note: Each hint reduces your score by 10%</span>
            )}
          </div>

          {/* Submission Area */}
          {!showFeedback ? (
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
              <h3 className="font-semibold mb-3">Your Submission</h3>
              <Textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Write your campaign performance report here..."
                className="min-h-[200px] mb-4 bg-secondary/30 border-border"
              />
              <div className="flex items-center gap-3">
                <Button variant="hero" onClick={handleSubmit} disabled={!submission.trim()}>
                  <Send className="w-4 h-4 mr-1" /> Submit Work
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-1" /> Attach File
                </Button>
              </div>
            </div>
          ) : (
            /* Feedback - Email Reply Style */
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card animate-fade-in">
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-foreground">SM</div>
                  <div>
                    <div className="font-semibold">Sarah Martinez</div>
                    <div className="text-xs text-muted-foreground">Feedback on Task 3</div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Badge className="bg-accent/20 text-accent border-0">8/10</Badge>
                  </div>
                </div>
                <div className="font-semibold">Re: Campaign Performance Report — Feedback</div>
              </div>
              <div className="p-5 text-sm leading-relaxed text-muted-foreground space-y-3">
                <p>Hey, thanks for getting this in on time!</p>
                <p><span className="text-foreground font-medium">What you did well:</span> Your analysis of the top-performing posts was insightful. I especially liked how you connected engagement spikes to content themes — that shows strong analytical thinking.</p>
                <p><span className="text-foreground font-medium">Areas to improve:</span></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>The Q2 recommendations could be more specific — tie them to actual metrics</li>
                  <li>Consider adding visual data representations next time</li>
                </ul>
                <p><span className="text-foreground font-medium">Next step:</span> For your next task, try using a framework like SMART goals when writing recommendations.</p>
                <p>Keep it up! 💪<br />Sarah</p>
              </div>
              <div className="p-5 border-t border-border flex gap-3">
                <Button variant="hero" asChild>
                  <Link to="/simulation/active">Next Task →</Link>
                </Button>
                <Button variant="outline" onClick={() => setShowChat(!showChat)}>
                  <MessageCircle className="w-4 h-4 mr-1" /> Ask Manager
                </Button>
              </div>
            </div>
          )}

          {/* Chat */}
          {showChat && (
            <div className="mt-4 bg-card border border-border rounded-xl p-5 shadow-card animate-fade-in">
              <h3 className="font-semibold mb-3 text-sm">Chat with Sarah</h3>
              <div className="flex gap-2">
                <Textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="bg-secondary/30 border-border min-h-[60px]"
                />
                <Button variant="hero" size="icon" className="flex-shrink-0 h-auto">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ActiveSimulation;
