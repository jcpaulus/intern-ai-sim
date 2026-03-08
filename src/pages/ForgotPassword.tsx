import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Loader2, ArrowLeft, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      console.error("[ForgotPassword] Error:", error.message);
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Password reset link sent! Check your email.");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold">Internly</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Forgot password?</h1>
          <p className="text-muted-foreground">We'll send you a link to reset it</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-card">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Check your email</h2>
              <p className="text-muted-foreground text-sm">
                We sent a password reset link to <strong className="text-foreground">{email}</strong>. 
                Click the link in the email to set a new password.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1"
                />
              </div>
              <Button variant="hero" className="w-full h-11" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/login" className="text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
