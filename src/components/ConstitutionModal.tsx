import { X } from "lucide-react";

interface ConstitutionModalProps {
  open: boolean;
  onClose: () => void;
}

const ConstitutionModal = ({ open, onClose }: ConstitutionModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="bg-background border border-border max-w-lg w-full mx-4 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="font-display text-2xl font-bold mb-6 text-foreground">The Rules</h2>

        <div className="space-y-5">
          <div className="card-good border border-border p-4">
            <h3 className="font-display text-lg font-bold text-foreground">The Good</h3>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Hope. Progress. Breakthroughs that remind us humanity is capable of extraordinary things.
            </p>
          </div>

          <div className="card-bad border border-border p-4">
            <h3 className="font-display text-lg font-bold text-foreground">The Bad</h3>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Warnings. Failures. Things that demand our attention before they get worse.
            </p>
          </div>

          <div className="card-ugly border border-border p-4">
            <h3 className="font-display text-lg font-bold text-foreground">The Ugly</h3>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Truth. Raw, unfiltered reality. The things we'd rather not look at but must.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-border">
          <p className="font-ui text-xs text-muted-foreground leading-relaxed">
            All submissions are human-written. Pasting is disabled. Typing speed is monitored.
            Every piece is reviewed before publication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionModal;
