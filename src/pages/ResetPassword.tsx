import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("[ResetPassword] Auth event:", event);
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
      setChecking(false);
    });

    // Also check hash params for recovery type
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
    
    // Fallback timeout
    const timeout = setTimeout(() => setChecking(false), 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      console.error("[ResetPassword] Error:", error.message);
      if (error.message.includes("same password")) {
        toast.error("New password must be different from your current password.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    setSuccess(true);
    toast.success("Password updated successfully!");
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Zap className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">Internly</span>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 shadow-card">
            <h2 className="text-xl font-semibold mb-2">Invalid or expired link</h2>
            <p className="text-muted-foreground text-sm mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password">
              <Button variant="hero" className="w-full">Request New Link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">Internly</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Set new password</h1>
          <p className="text-muted-foreground">Enter your new password below</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-card">
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Password updated!</h2>
              <p className="text-muted-foreground text-sm">
                Redirecting you to the dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <Button variant="hero" className="w-full h-11" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
