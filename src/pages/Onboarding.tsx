import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, ArrowRight, ArrowLeft } from "lucide-react";

const quizSteps = [
  {
    question: "What field interests you?",
    options: ["Marketing", "Data & Analytics", "Design", "Tech & Engineering", "Business"],
  },
  {
    question: "What's your experience level?",
    options: ["No experience", "Some experience", "1+ years of experience"],
  },
  {
    question: "How many hours per week can you commit?",
    options: ["1–3 hours", "3–5 hours", "5+ hours"],
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const progress = ((step + 1) / quizSteps.length) * 100;
  const current = quizSteps[step];
  const selectedAnswer = answers[step];

  const selectAnswer = (option: string) => {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
  };

  const handleNext = async () => {
    if (step < quizSteps.length - 1) {
      setStep(step + 1);
    } else {
      // Mark onboarding as completed
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
        .eq("id", user?.id ?? "");
      if (error) {
        console.error("[Onboarding] Failed to update profile:", error);
        toast.error("Failed to save onboarding status.");
      }
      navigate("/roles");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Zap className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">Internly</span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">Step {step + 1} of {quizSteps.length}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-card animate-fade-in" key={step}>
          <h2 className="text-2xl font-bold mb-6">{current.question}</h2>
          <div className="space-y-3 mb-8">
            {current.options.map((option) => (
              <button
                key={option}
                onClick={() => selectAnswer(option)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedAnswer === option
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button
              variant="hero"
              className="flex-1"
              disabled={!selectedAnswer}
              onClick={handleNext}
            >
              {step === quizSteps.length - 1 ? "Get My Recommendations" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
