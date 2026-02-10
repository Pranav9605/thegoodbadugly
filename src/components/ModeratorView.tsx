import { ArrowLeft, Check, X, Clock, Keyboard, ClipboardPaste, Shield, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { Article } from "@/types/article";
import type { WritingMetadata } from "@/lib/database.types";
import { calculateTrustScore, formatTime } from "@/hooks/useWritingMetrics";

interface ModeratorViewProps {
  pending: Article[];
  onBack: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

// Mock writing metadata for demo (in production this comes from chapters.writing_metadata)
const getMockMetrics = (articleId: number): WritingMetadata => {
  // Generate varied but consistent metrics based on article id
  const seed = articleId * 17;
  return {
    time_spent_seconds: 120 + (seed % 600),
    paste_attempts: seed % 5,
    paste_character_count: (seed % 5) * 50,
    total_keystrokes: 500 + (seed % 2000),
    backspace_count: 50 + (seed % 200),
    avg_words_per_minute: 25 + (seed % 40),
    session_breaks: seed % 3,
  };
};

const TrustBadge = ({ score }: { score: 'high' | 'medium' | 'low' }) => {
  const config = {
    high: { color: 'text-green-600 bg-green-50 border-green-200', icon: Shield, label: 'HIGH TRUST' },
    medium: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertTriangle, label: 'MEDIUM' },
    low: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertTriangle, label: 'LOW TRUST' },
  };
  const { color, icon: Icon, label } = config[score];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-ui border ${color}`}>
      <Icon size={12} />
      {label}
    </span>
  );
};

const MetricsPanel = ({ metrics }: { metrics: WritingMetadata }) => {
  const trustScore = calculateTrustScore(metrics);

  return (
    <div className="mt-4 p-4 bg-secondary/50 border border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
          Writing Analysis
        </span>
        <TrustBadge score={trustScore} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-muted-foreground" />
          <div>
            <div className="font-ui text-xs text-muted-foreground">Time</div>
            <div className="font-display font-bold text-foreground">
              {formatTime(metrics.time_spent_seconds || 0)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Keyboard size={14} className="text-muted-foreground" />
          <div>
            <div className="font-ui text-xs text-muted-foreground">Keystrokes</div>
            <div className="font-display font-bold text-foreground">
              {metrics.total_keystrokes?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ClipboardPaste size={14} className={metrics.paste_attempts && metrics.paste_attempts > 2 ? "text-orange-500" : "text-muted-foreground"} />
          <div>
            <div className="font-ui text-xs text-muted-foreground">Paste Attempts</div>
            <div className={`font-display font-bold ${metrics.paste_attempts && metrics.paste_attempts > 2 ? "text-orange-500" : "text-foreground"}`}>
              {metrics.paste_attempts || 0}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 flex items-center justify-center text-muted-foreground text-xs font-bold">⌨</div>
          <div>
            <div className="font-ui text-xs text-muted-foreground">WPM</div>
            <div className="font-display font-bold text-foreground">
              {metrics.avg_words_per_minute || '—'}
            </div>
          </div>
        </div>
      </div>

      {metrics.paste_attempts && metrics.paste_attempts > 0 && (
        <div className="mt-3 text-xs text-orange-600 font-ui">
          ⚠️ {metrics.paste_character_count} characters were attempted to be pasted
        </div>
      )}
    </div>
  );
};

const ModeratorView = ({ pending, onBack, onApprove, onReject }: ModeratorViewProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="font-ui flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to feed
      </button>

      <h2 className="font-display text-3xl font-bold mb-2 text-foreground">Moderator Queue</h2>
      <p className="font-ui text-sm text-muted-foreground mb-8">
        {pending.length} pending draft{pending.length !== 1 ? "s" : ""} • Review writing metrics before approving
      </p>

      {pending.length === 0 ? (
        <div className="text-center py-16">
          <Shield size={48} className="mx-auto mb-4 text-muted-foreground/50" />
          <p className="font-body text-muted-foreground italic">Nothing to review. The feed is clean.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((article) => {
            const metrics = getMockMetrics(article.id);
            const trustScore = calculateTrustScore(metrics);
            const isExpanded = expandedId === article.id;

            return (
              <div key={article.id} className="border border-border">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
                          {article.category}
                        </span>
                        <TrustBadge score={trustScore} />
                      </div>
                      <h3 className="font-display text-xl font-bold mt-1 mb-2 text-foreground">
                        {article.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : article.id)}
                    className="font-ui text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {isExpanded ? 'Hide' : 'Show'} Writing Metrics
                  </button>

                  {isExpanded && <MetricsPanel metrics={metrics} />}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => onApprove(article.id)}
                      className="font-ui text-xs flex items-center gap-1.5 px-4 py-2 bg-foreground text-background hover:opacity-90 transition-opacity"
                    >
                      <Check size={14} />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(article.id)}
                      className="font-ui text-xs flex items-center gap-1.5 px-4 py-2 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModeratorView;
