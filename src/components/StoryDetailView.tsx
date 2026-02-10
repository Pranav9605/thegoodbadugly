import { useState } from "react";
import { ArrowLeft, ChevronDown, Flag } from "lucide-react";
import { Article } from "@/types/article";
import DisputeDialog from "@/components/DisputeDialog";

interface StoryDetailViewProps {
  article: Article;
  onBack: () => void;
}

const StoryDetailView = ({ article, onBack }: StoryDetailViewProps) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [showDispute, setShowDispute] = useState(false);

  const toggleChapter = (index: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="font-ui flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to feed
      </button>

      <div className="mb-8">
        <span className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
          {article.category === "good" ? "Hope" : article.category === "bad" ? "Warning" : "Truth"}
          {article.status === "ongoing" && (
            <span className="ml-2 px-2 py-0.5 bg-foreground text-background text-[10px]">ONGOING</span>
          )}
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground leading-tight">
          {article.title}
        </h1>
        <p className="font-body text-lg text-muted-foreground mt-4 leading-relaxed">
          {article.summary}
        </p>
        {article.author && (
          <p className="font-ui text-xs text-muted-foreground mt-3">
            By {article.author}
          </p>
        )}
      </div>

      {/* Accordion Timeline */}
      <div className="relative pl-8 border-l-2 border-border">
        {article.chapters.map((chapter, index) => {
          const isExpanded = expandedChapters.has(index);

          return (
            <div key={index} className="relative mb-4 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute -left-[calc(2rem+5px)] w-3 h-3 bg-foreground rounded-full" />

              {/* Clickable Chapter Card */}
              <button
                onClick={() => toggleChapter(index)}
                className="w-full text-left border-2 border-border p-4 hover:border-foreground/50 transition-colors bg-background"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-ui text-xs text-muted-foreground uppercase tracking-widest">
                      {chapter.date}
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground mt-1">
                      {chapter.title}
                    </h3>
                    {!isExpanded && (
                      <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-1">
                        {chapter.summary}
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground transition-transform duration-300 ml-4 flex-shrink-0 ${isExpanded ? "rotate-180" : ""
                      }`}
                  />
                </div>

                {/* Expandable Content */}
                <div
                  className={`grid transition-all duration-300 ease-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-border pt-4">
                      <p className="font-body text-base text-foreground leading-relaxed">
                        {chapter.content}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}

        {/* Case Closed marker */}
        {article.status === "concluded" && (
          <div className="relative mt-6">
            <div className="absolute -left-[calc(2rem+7px)] w-4 h-4 bg-foreground" />
            <div className="font-ui text-sm uppercase tracking-widest font-semibold text-foreground border-2 border-border p-4 bg-secondary">
              ◼ CASE CLOSED
            </div>
          </div>
        )}
      </div>

      {/* Report Error Link */}
      <div className="mt-12 pt-6 border-t border-border">
        <button
          onClick={() => setShowDispute(true)}
          className="font-ui text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          <Flag size={12} />
          Report Factual Error
        </button>
      </div>

      <DisputeDialog
        open={showDispute}
        onClose={() => setShowDispute(false)}
        storyTitle={article.title}
        storyId={article.id}
      />
    </div>
  );
};

export default StoryDetailView;
