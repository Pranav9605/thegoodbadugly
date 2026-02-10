import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";

interface AppHeaderProps {
  onWriteClick: () => void;
}

const AppHeader = ({ onWriteClick }: AppHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 border-b border-border bg-background">
      <Link
        to="/"
        className="text-3xl md:text-4xl tracking-tight text-foreground hover:opacity-80 transition-opacity"
        style={{ fontFamily: "'Pirata One', cursive" }}
      >
        The Good, The Bad &amp; The Ugly
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <Link
            to="/my-stories"
            className="font-ui text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          >
            My Stories
          </Link>
        )}
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

