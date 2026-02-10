import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);

    // Supabase v2 with PKCE: the email link contains a token_hash in the URL hash.
    // We must exchange it for a session before updateUser will work.
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const tokenHash = params.get('token_hash') || params.get('access_token');
        const type = params.get('type');

        console.log('[ResetPassword] URL hash params:', { tokenHash: !!tokenHash, type });

        if (tokenHash && type === 'recovery') {
            // Exchange the token for a valid session
            supabase.auth.verifyOtp({
                token_hash: tokenHash,
                type: 'recovery',
            }).then(({ error }) => {
                if (error) {
                    console.error('[ResetPassword] verifyOtp error:', error);
                    toast.error('Reset link expired or invalid. Please request a new one.');
                } else {
                    console.log('[ResetPassword] Recovery session established');
                    setSessionReady(true);
                }
            });
        } else {
            // Fallback: check if onAuthStateChange already set a recovery session
            supabase.auth.getSession().then(({ data: { session } }) => {
                console.log('[ResetPassword] Existing session:', !!session);
                if (session) {
                    setSessionReady(true);
                } else {
                    // No token in URL and no existing session - 
                    // still show form, user might have session from onAuthStateChange
                    setSessionReady(true);
                }
            });
        }
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        // Debug: log session state before update
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[ResetPassword] Session before updateUser:', !!session, session?.user?.email);

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                console.error('[ResetPassword] updateUser error:', error);
                toast.error(error.message);
            } else {
                toast.success('Password updated successfully!');
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 800);
            }
        } catch (err) {
            console.error('[ResetPassword] Unexpected error:', err);
            toast.error('Something went wrong. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="max-w-md w-full border-2 border-black p-8 md:p-12 bg-white">
                <h1
                    className="text-4xl md:text-5xl font-bold text-foreground mb-8"
                    style={{ fontFamily: "'Pirata One', cursive" }}
                >
                    Reset Password
                </h1>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-black px-4 py-3 font-mono focus:outline-none focus:bg-gray-50 transition-colors"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border-2 border-black px-4 py-3 font-mono focus:outline-none focus:bg-gray-50 transition-colors"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !sessionReady}
                        className="w-full py-3 bg-foreground text-background font-ui text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
                    >
                        {loading ? 'Updating…' : 'Update Password'}
                    </button>
                </form>

                <p className="text-sm text-muted-foreground mt-8 text-center font-body">
                    Back to{' '}
                    <Link to="/" className="underline hover:text-foreground transition-colors">
                        Registry
                    </Link>
                </p>
            </div>
        </div>
    );
}
