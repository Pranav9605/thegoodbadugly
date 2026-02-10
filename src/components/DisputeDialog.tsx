import { useState } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface DisputeDialogProps {
  open: boolean;
  onClose: () => void;
  storyTitle: string;
  storyId: number;
}

const DisputeDialog = ({ open, onClose, storyTitle, storyId }: DisputeDialogProps) => {
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [explanation, setExplanation] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUrl(evidenceUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid evidence URL.",
        variant: "destructive",
      });
      return;
    }

    if (explanation.trim().length < 20) {
      toast({
        title: "Explanation Too Short",
        description: "Please provide a detailed explanation (at least 20 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - in production this would submit to database
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Dispute submitted:", { storyId, evidenceUrl, explanation, email });

    toast({
      title: "Dispute Submitted",
      description: "Thank you. Our editorial team will review your report.",
    });

    setIsSubmitting(false);
    setEvidenceUrl("");
    setExplanation("");
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-background border-2 border-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <AlertTriangle size={20} />
            Report Factual Error
          </DialogTitle>
          <DialogDescription className="font-body text-muted-foreground">
            Disputing: <span className="text-foreground font-medium">{storyTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Evidence URL <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full font-mono-custom text-sm bg-transparent border-2 border-border p-3 pr-10 outline-none focus:border-foreground transition-colors text-foreground placeholder:text-muted-foreground/50"
              />
              <ExternalLink size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <p className="font-ui text-xs text-muted-foreground mt-1">
              Link to source that contradicts the published story
            </p>
          </div>

          <div>
            <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Explanation <span className="text-destructive">*</span>
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Describe the factual error and what the correct information should be..."
              required
              rows={4}
              className="w-full font-body text-sm bg-transparent border-2 border-border p-3 outline-none resize-none focus:border-foreground transition-colors text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          <div>
            <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Your Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="For follow-up questions"
              className="w-full font-ui text-sm bg-transparent border-2 border-border p-3 outline-none focus:border-foreground transition-colors text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="font-ui text-sm px-4 py-2 border-2 border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !evidenceUrl || !explanation.trim()}
              className="font-ui text-sm px-4 py-2 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeDialog;
