import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  getOAuthRedirectUrl,
  getPostAuthDestination,
  getSafeNextPath,
  signInWithOAuth,
} from "@/lib/auth";

export type AuthMode = "login" | "signup" | "forgot";

interface AuthFormProps {
  initialMode?: AuthMode;
  nextPath?: string | null;
  onSuccess?: () => void;
  requireAdmin?: boolean;
}

const AuthForm = ({
  initialMode = "login",
  nextPath,
  onSuccess,
  requireAdmin = false,
}: AuthFormProps) => {
  const [mode, setMode] = useState<AuthMode>(requireAdmin ? "login" : initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const safeNextPath = getSafeNextPath(nextPath);
  const allowSignUp = !requireAdmin;

  const redirectAfterAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unable to load your account.");
    }

    const destination = await getPostAuthDestination(user.id, {
      fallbackPath: safeNextPath,
      requireAdmin,
    });

    onSuccess?.();
    navigate(destination, { replace: true });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        await signIn(formData.email, formData.password);
        toast.success(requireAdmin ? "Admin sign-in successful!" : "Signed in successfully!");
        await redirectAfterAuth();
      } else if (mode === "signup") {
        await signUp(formData.email, formData.password, formData.name);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          toast.success("Account created successfully!");
          await redirectAfterAuth();
        } else {
          toast.success("Account created! Please check your email to verify.");
          onSuccess?.();
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";

      if (requireAdmin && message.includes("admin access")) {
        await supabase.auth.signOut();
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: new URL("/reset-password", window.location.origin).toString(),
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset link sent! Check your email.");
      setMode("login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    setIsLoading(true);

    try {
      const redirectTo = getOAuthRedirectUrl({
        admin: requireAdmin ? "1" : undefined,
        next: safeNextPath || undefined,
      });
      const { data, error } = await signInWithOAuth(provider, redirectTo);

      if (error) {
        throw error;
      }

      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `${provider} sign-in failed`);
      setIsLoading(false);
    }
  };

  if (mode === "forgot") {
    return (
      <div className="p-6">
        <button
          onClick={() => setMode("login")}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </button>

        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight">Reset Password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-xs font-semibold uppercase tracking-wider">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="h-11 border-border bg-secondary pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="h-12 w-full text-sm font-bold uppercase tracking-wider">
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="flex border-b border-border">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
            mode === "login"
              ? "border-b-2 border-foreground text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        {allowSignUp && (
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
              mode === "signup"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Join
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight">
            {requireAdmin ? "Admin Sign In" : mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {requireAdmin
              ? "Use your admin account to access the dashboard."
              : mode === "login"
                ? "Sign in to access your account."
                : "Join MAGGS TROVE for exclusive access."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider">
                Full Name
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="h-11 border-border bg-secondary pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="h-11 border-border bg-secondary pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                className="h-11 border-border bg-secondary pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === "login" && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Forgot your password?
            </button>
          )}

          <Button type="submit" disabled={isLoading} className="h-12 w-full text-sm font-bold uppercase tracking-wider">
            {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {!requireAdmin && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => void handleOAuthSignIn("google")}
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-3 text-sm font-medium"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => void handleOAuthSignIn("apple")}
              disabled={isLoading}
              className="mt-3 flex h-12 w-full items-center justify-center gap-3 text-sm font-medium"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </Button>
          </>
        )}

        {allowSignUp && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-foreground underline"
              >
                {mode === "login" ? "Join now" : "Sign in"}
              </button>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthForm;
