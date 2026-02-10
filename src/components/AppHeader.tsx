import { PenLine } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";

interface AppHeaderProps {
  onWriteClick: () => void;
}

const AppHeader = ({ onWriteClick }: AppHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 border-b border-border bg-background">
      <h1 className="text-3xl md:text-4xl tracking-tight text-foreground" style={{ fontFamily: "'Pirata One', cursive" }}>
        The Good, The Bad &amp; The Ugly
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={onWriteClick}
          className="font-ui flex items-center gap-2 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
        >
          <PenLine size={16} />
          Write
        </button>
        {user && <UserMenu />}
      </div>
    </header>
  );
};

export default AppHeader;
