import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Send, Lightbulb, MessageCircle, Upload, CheckCircle, Clock, AlertCircle, X, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FeedbackData {
  overall_score: number;
  strengths: { point: string; quote: string; why: string }[];
  improvements: { point: string; quote: string; why: string; suggestion: string }[];
  scores: {
    clarity: { score: number; reason: string };
    depth_of_insight: { score: number; reason: string };
    use_of_data: { score: number; reason: string };
    actionability: { score: number; reason: string };
  };
  final_summary: string;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileUploadState {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  storagePath?: string;
}

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
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const currentTask = tasks[2];
  const progress = (2 / 5) * 100;
  const currentTaskId = "task-3"; // mock task ID

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" terlalu besar. Maksimal 10MB.`;
    }
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      return `Format file "${file.name}" tidak didukung. Gunakan: PDF, DOCX, PNG, JPG.`;
    }
    return null;
  };

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles: FileUploadState[] = [];
    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
      } else {
        // Check for duplicate
        if (fileStates.some(fs => fs.file.name === file.name && fs.file.size === file.size)) {
          toast.error(`File "${file.name}" sudah ditambahkan.`);
          continue;
        }
        validFiles.push({ file, progress: 0, status: "pending" });
      }
    }
    if (validFiles.length > 0) {
      setFileStates(prev => [...prev, ...validFiles]);
    }
  }, [fileStates]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    addFiles(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFileStates(prev => prev.filter((_, i) => i !== index));
  };

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addFiles(Array.from(files));
    }
  }, [addFiles]);

  const uploadAllFiles = async (userId: string): Promise<boolean> => {
    let allSuccess = true;
    for (let i = 0; i < fileStates.length; i++) {
      const fs = fileStates[i];
      if (fs.status === "success") continue; // Already uploaded

      // Update status to uploading
      setFileStates(prev => prev.map((f, idx) => idx === i ? { ...f, status: "uploading" as const, progress: 10 } : f));

      const storagePath = `${userId}/${currentTaskId}/${Date.now()}_${fs.file.name}`;

      const { error } = await supabase.storage
        .from("submissions")
        .upload(storagePath, fs.file);

      if (error) {
        setFileStates(prev => prev.map((f, idx) => idx === i ? { ...f, status: "error" as const, error: error.message, progress: 0 } : f));
        toast.error(`Gagal upload "${fs.file.name}": ${error.message}`);
        allSuccess = false;
        continue;
      }

      // Update progress to 70%
      setFileStates(prev => prev.map((f, idx) => idx === i ? { ...f, progress: 70 } : f));

      // Save metadata to DB
      const { error: dbError } = await supabase
        .from("submissions_files")
        .insert({
          user_id: userId,
          task_id: currentTaskId,
          file_name: fs.file.name,
          file_path: storagePath,
          file_size: fs.file.size,
        });

      if (dbError) {
        setFileStates(prev => prev.map((f, idx) => idx === i ? { ...f, status: "error" as const, error: dbError.message, progress: 0 } : f));
        toast.error(`Gagal menyimpan metadata "${fs.file.name}": ${dbError.message}`);
        allSuccess = false;
        continue;
      }

      // Success
      setFileStates(prev => prev.map((f, idx) => idx === i ? { ...f, status: "success" as const, progress: 100, storagePath } : f));
    }
    return allSuccess;
  };

  const handleSubmit = async () => {
    if (!submission.trim() && fileStates.length === 0) return;
    setUploading(true);

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Kamu harus login terlebih dahulu untuk submit.");
      setUploading(false);
      return;
    }

    if (fileStates.length > 0) {
      const success = await uploadAllFiles(user.id);
      if (!success) {
        toast.error("Beberapa file gagal diupload. Coba lagi.");
        setUploading(false);
        return;
      }
      toast.success(`${fileStates.length} file berhasil diupload!`);
    }

    setUploading(false);
    setShowFeedback(true);
  };

  const getFileStatusIcon = (status: FileUploadState["status"]) => {
    switch (status) {
      case "uploading": return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case "success": return <CheckCircle className="w-4 h-4 text-accent" />;
      case "error": return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-card border-2 rounded-xl p-5 shadow-card transition-colors ${
                isDragging
                  ? "border-primary border-dashed bg-primary/5"
                  : "border-border"
              }`}
            >
              <h3 className="font-semibold mb-3">Your Submission</h3>
              <Textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Write your campaign performance report here..."
                className="min-h-[200px] mb-4 bg-secondary/30 border-border"
              />

              {/* Drag & Drop Zone */}
              {isDragging && (
                <div className="mb-4 border-2 border-dashed border-primary rounded-lg p-8 text-center animate-fade-in">
                  <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-primary font-medium">Lepaskan file di sini</p>
                </div>
              )}

              {/* Attached Files List */}
              {fileStates.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    {fileStates.length} file terlampir
                  </p>
                  {fileStates.map((fs, index) => (
                    <div key={index} className="bg-secondary/30 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 text-sm">
                        {getFileStatusIcon(fs.status)}
                        <span className="truncate flex-1">{fs.file.name}</span>
                        <span className="text-xs text-muted-foreground">{formatFileSize(fs.file.size)}</span>
                        {fs.status !== "uploading" && (
                          <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {/* Progress bar per file */}
                      {(fs.status === "uploading" || fs.status === "success") && (
                        <div className="mt-2">
                          <Progress value={fs.progress} className="h-1.5" />
                        </div>
                      )}
                      {fs.status === "error" && fs.error && (
                        <p className="text-xs text-destructive mt-1">{fs.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
              <div className="flex items-center gap-3">
                <Button
                  variant="hero"
                  onClick={handleSubmit}
                  disabled={(!submission.trim() && fileStates.length === 0) || uploading}
                >
                  {uploading ? (
                    <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Uploading...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-1" /> Submit Work</>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4 mr-1" /> Attach File
                </Button>
                <span className="text-xs text-muted-foreground hidden md:inline">
                  atau drag & drop file ke area ini
                </span>
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
