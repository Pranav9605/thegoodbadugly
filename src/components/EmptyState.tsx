import { PenLine } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    showAction?: boolean;
}

const EmptyState = ({
    title = "Nothing here yet",
    description = "The Registry is waiting for your truth.",
    actionLabel = "Write Story",
    onAction,
    showAction = true,
}: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <p
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
                style={{ fontFamily: "'Pirata One', cursive" }}
            >
                {title}
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-md font-body">
                {description}
            </p>
            {showAction && onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-8 py-4 border-2 border-black bg-foreground text-background font-ui text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                    <PenLine size={18} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
