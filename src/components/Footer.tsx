import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t-2 border-border py-8 px-6 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="font-ui text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/write"
            className="font-ui text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Write
          </Link>
          <Link
            to="/principles"
            className="font-ui text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Principles
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <span className="font-ui text-xs text-muted-foreground">
            Slow news for a fast world.
          </span>
          <Link
            to="/admin"
            className="font-ui text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            •
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
