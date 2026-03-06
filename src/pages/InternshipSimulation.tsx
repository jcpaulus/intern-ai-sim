import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Loader2, Send, Sparkles, CheckCircle, AlertTriangle, Upload, FileText, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const INTERNSHIP_ROLES = [
  {
    value: "marketing-intern",
    label: "Marketing Intern",
    context: "You are assigning tasks to a Marketing Intern at a digital agency. Create realistic marketing tasks involving campaign planning, copywriting, social media strategy, or data reporting.",
  },
  {
    value: "product-manager-intern",
    label: "Product Manager Intern",
    context: "You are assigning tasks to a Product Manager Intern at a tech startup. Create realistic PM tasks involving user research, feature prioritization, PRD writing, or stakeholder communication.",
  },
  {
    value: "startup-founder-intern",
    label: "Startup Founder Intern",
    context: "You are assigning tasks to a Startup Founder Intern in a venture studio. Create realistic founder tasks involving market validation, pitch deck creation, business model design, or customer discovery.",
  },
];

const InternshipSimulation = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [task, setTask] = useState<{ title: string; brief: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [generatingTask, setGeneratingTask] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateTask = async () => {
    if (!selectedRole) {
      toast.error("Please choose an internship first.");
      return;
    }

    const role = INTERNSHIP_ROLES.find((r) => r.value === selectedRole);
    if (!role) return;

    setGeneratingTask(true);
    setTask(null);
    setFeedback(null);
    setAnswer("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-task", {
        body: { role: role.value, context: role.context },
      });

      if (error) throw error;
      setTask(data.task);
    } catch (e: any) {
      console.error("Generate task error:", e);
      toast.error("Failed to generate task. Please try again.");
    } finally {
      setGeneratingTask(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error("Only PDF, DOCX, and TXT files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be under 10MB.");
      return;
    }
    setUploadedFile(file);
    toast.success(`File "${file.name}" selected.`);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const readFileAsText = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "txt") {
      return await file.text();
    }
    // For PDF/DOCX, convert to base64 and let the edge function know
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `[FILE:${ext}:${file.name}]\n${btoa(binary)}`;
  };

  const uploadFileToStorage = async (file: File): Promise<string | null> => {
    try {
      const timestamp = Date.now();
      const filePath = `internship-sim/${timestamp}_${file.name}`;
      const { error } = await supabase.storage
        .from("submissions")
        .upload(filePath, file);
      if (error) throw error;
      return filePath;
    } catch (e) {
      console.error("File upload error:", e);
      toast.error("Failed to upload file.");
      return null;
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() && !uploadedFile) {
      toast.error("Please write your answer or upload a file.");
      return;
    }
    if (!task) {
      toast.error("No task to submit against.");
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      let fileContent: string | undefined;
      let fileName: string | undefined;

      if (uploadedFile) {
        // Upload to storage
        await uploadFileToStorage(uploadedFile);
        // Read content for AI evaluation
        fileContent = await readFileAsText(uploadedFile);
        fileName = uploadedFile.name;
      }

      const { data, error } = await supabase.functions.invoke("evaluate-submission", {
        body: {
          submission: answer,
          taskTitle: task.title,
          taskBrief: task.brief,
          fileContent,
          fileName,
        },
      });

      if (error) throw error;
      setFeedback(data.feedback);

      // Save simulation run to database
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error: insertError } = await supabase.from("simulation_runs" as any).insert({
          user_id: session.user.id,
          role: selectedRole,
          task: JSON.stringify(task),
          answer: answer || null,
          feedback: JSON.stringify(data.feedback),
        } as any);
        if (insertError) console.error("Failed to save simulation run:", insertError);
      }

      toast.success("Feedback received!");
    } catch (e: any) {
      console.error("Submit error:", e);
      toast.error("Failed to get feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold">Internly</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Roles
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Internship Simulation</h1>
          <p className="text-muted-foreground text-lg">
            Pick a role, get an AI-generated task, and submit your work for instant feedback.
          </p>
        </div>

        {/* Role Selection + Generate */}
        <Card className="border-border">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Choose Internship</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  {INTERNSHIP_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="hero"
              onClick={handleGenerateTask}
              disabled={generatingTask || !selectedRole}
              className="w-full sm:w-auto"
            >
              {generatingTask ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Task
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Task Card */}
        <Card className={`border-border transition-opacity ${task ? "opacity-100" : "opacity-40"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-5 h-5 text-accent" /> Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            {task ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{task.brief}</p>
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                {generatingTask ? "Generating your task..." : "Select a role and click Generate Task to begin."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Answer Section */}
        <Card className={`border-border transition-opacity ${task ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          <CardHeader>
            <CardTitle className="text-xl">Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[180px] resize-y"
              disabled={!task}
            />

            {/* File Upload */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
                disabled={!task}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={!task}
                className="gap-2"
              >
                <Upload className="w-4 h-4" /> Upload File
              </Button>
              <p className="text-xs text-muted-foreground">Supported: PDF, DOCX, TXT (max 10MB)</p>

              {uploadedFile && (
                <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 w-fit">
                  <FileText className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                  <button
                    onClick={removeFile}
                    className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <Button
              variant="hero"
              onClick={handleSubmitAnswer}
              disabled={submitting || !task || (!answer.trim() && !uploadedFile)}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Evaluating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Answer
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Feedback Card */}
        <Card className={`border-border transition-opacity ${feedback ? "opacity-100" : "opacity-40"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-5 h-5 text-accent" /> AI Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedback ? (
              <div className="space-y-6">
                {/* Score + Hiring Decision */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
                    <span className="text-3xl font-black text-foreground">{feedback.score ?? "–"}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Score</p>
                    <p className="text-sm text-muted-foreground">out of 10</p>
                  </div>
                  <div className="ml-auto">
                    <Badge
                      className={`text-sm px-4 py-1.5 font-bold ${
                        feedback.hiring_decision === "Hire"
                          ? "bg-green-500/15 text-green-400 border-green-500/30"
                          : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {feedback.hiring_decision === "Hire" ? "✓ Hire" : "⚠ Needs Improvement"}
                    </Badge>
                  </div>
                </div>

                {/* Strengths */}
                {feedback.strengths?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-1.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" /> Strengths
                    </h4>
                    <ul className="space-y-1.5">
                      {feedback.strengths.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 bg-secondary/30 rounded-lg px-3 py-2">
                          <span className="text-green-500 mt-0.5 shrink-0">•</span>
                          <span className="text-sm">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-1.5 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" /> Areas for Improvement
                    </h4>
                    <ul className="space-y-1.5">
                      {feedback.improvements.map((imp: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 bg-secondary/30 rounded-lg px-3 py-2">
                          <span className="text-yellow-500 mt-0.5 shrink-0">•</span>
                          <span className="text-sm">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendation */}
                {feedback.recommendation && (
                  <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Recommendation</p>
                    <p className="text-sm font-medium">{feedback.recommendation}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                {submitting ? "Analyzing your submission..." : "Submit your answer to receive AI feedback."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InternshipSimulation;
