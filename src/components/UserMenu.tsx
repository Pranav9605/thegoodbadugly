import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    if (!user) return null;

    const displayName = profile?.display_name || user.email?.split("@")[0] || "User";

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut({ scope: 'local' });
            if (error) throw error;

            queryClient.clear(); // clear ALL TanStack Query cache
            toast.success("Signed out.");
            navigate("/", { replace: true }); // force clean redirect
            setIsOpen(false);

            // Last-resort fallback if race persists
            setTimeout(() => {
                window.location.href = "/";
            }, 100);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Logout failed";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white hover:bg-gray-100 transition-colors font-ui text-sm"
            >
                <User size={16} />
                <span className="hidden sm:inline">{displayName}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] border-2 border-black bg-white shadow-lg">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-3 text-left font-ui text-sm hover:bg-gray-100 transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserMenu;

