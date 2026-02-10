import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1
          className="mb-6 text-9xl md:text-[12rem] font-bold text-foreground leading-none"
          style={{ fontFamily: "'Pirata One', cursive" }}
        >
          404
        </h1>
        <p className="mb-8 text-lg md:text-xl font-body text-muted-foreground">
          This page does not exist in the Registry.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-4 border-2 border-black bg-foreground text-background font-ui text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
