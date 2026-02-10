import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";
import { ReactNode, useEffect } from "react";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    useEffect(() => {
        console.error("Error caught by boundary:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="text-center max-w-md">
                <h1
                    className="mb-6 text-6xl md:text-7xl font-bold text-foreground leading-none"
                    style={{ fontFamily: "'Pirata One', cursive" }}
                >
                    Error
                </h1>
                <p className="mb-8 text-lg font-body text-muted-foreground">
                    Something broke. We'll fix it.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={resetErrorBoundary}
                        className="px-6 py-3 border-2 border-black bg-white text-black font-ui text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors"
                    >
                        Try Again
                    </button>
                    <Link
                        to="/"
                        className="px-6 py-3 border-2 border-black bg-foreground text-background font-ui text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

interface ErrorBoundaryProps {
    children: ReactNode;
}

const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Reset application state if needed
                window.location.href = "/";
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;
