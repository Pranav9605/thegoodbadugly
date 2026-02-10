import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";
interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AuthModal = ({ open, onClose, onSuccess }: AuthModalProps) => {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, isConfigured } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === "login") {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    onSuccess?.();
                    onClose();
                }
            } else {
                const { error } = await signUp(email, password, displayName);
                if (error) {
                    setError(error.message);
                } else {
                    setError(null);
                    // Show confirmation message
                    setMode("login");
                    setError("Check your email to confirm your account, then log in.");
                }
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setDisplayName("");
        setError(null);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 bg-background border border-border p-8 shadow-lg">
                <button
                    onClick={() => {
                        resetForm();
                        onClose();
                    }}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    {mode === "login" ? "Welcome Back" : "Join the Narrative"}
                </h2>

                {!isConfigured && (
                    <div className="mb-4 p-3 bg-muted border border-border text-sm text-muted-foreground">
                        ⚠️ Supabase not configured. Add credentials to <code>.env.local</code>
                    </div>
                )}

                {/* Tab Buttons */}
                <div className="flex mb-6 border border-border">
                    <button
                        type="button"
                        onClick={() => { setMode("login"); setError(null); }}
                        className={`flex-1 py-2 font-ui text-sm transition-colors ${mode === "login"
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode("signup"); setError(null); }}
                        className={`flex-1 py-2 font-ui text-sm transition-colors ${mode === "signup"
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                        <div>
                            <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                                Display Name
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your pen name"
                                    className="w-full pl-10 pr-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                            />
                        </div>
                    </div>

                    {mode === "login" && (
                        <button
                            type="button"
                            onClick={async () => {
                                if (!email) {
                                    toast.error("Enter your email first");
                                    return;
                                }
                                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                    redirectTo: `${window.location.origin}/reset-password`,
                                });
                                if (error) {
                                    toast.error(error.message);
                                } else {
                                    toast.success("Check your email for reset link");
                                }
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                        >
                            Forgot password?
                        </button>
                    )}

                    {error && (
                        <div className={`p-3 border text-sm ${error.includes("Check your email")
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-red-500 text-red-600 bg-red-50"
                            }`}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !isConfigured}
                        className="w-full py-3 bg-foreground text-background font-ui text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
                    </button>
                </form>

                <p className="font-body text-sm text-muted-foreground mt-6 text-center">
                    {mode === "login"
                        ? "New here? Click Sign Up above."
                        : "By signing up, you agree to write only original content."}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
