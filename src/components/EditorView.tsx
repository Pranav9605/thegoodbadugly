import { useState, useRef } from "react";
import { ArrowLeft, AlertTriangle, Plus, Clock, Keyboard } from "lucide-react";
import { z } from "zod";
import { toast as sonnerToast } from "sonner";
import type { Article } from "@/types/article";
import { useWritingMetrics, formatTime } from "@/hooks/useWritingMetrics";
import type { WritingMetadata } from "@/lib/database.types";
import ThumbnailUpload from "@/components/ThumbnailUpload";

const storySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  summary: z.string().min(1, "Summary is required"),
  category: z.enum(["good", "bad", "ugly"], { required_error: "Category is required" }),
  chapterTitle: z.string().min(1, "Chapter title is required"),
  chapterSummary: z.string().min(1, "Chapter summary is required"),
  chapterContent: z.string().refine(
    (val) => val.trim().split(/\s+/).filter((w) => w.length > 0).length >= 50,
    "Content must be at least 50 words"
  ),
});

type StoryFormErrors = Partial<Record<keyof z.infer<typeof storySchema>, string>>;

interface EditorViewProps {
  onBack: () => void;
  onPublish: (title: string, summary: string, category: "good" | "bad" | "ugly", chapterTitle: string, chapterSummary: string, chapterContent: string, writingMetrics?: WritingMetadata, thumbnailUrl?: string) => void;
  existingStories: Article[];
  onAddChapter: (storyId: number, chapterTitle: string, chapterSummary: string, chapterContent: string, writingMetrics?: WritingMetadata) => void;
}

const EditorView = ({ onBack, onPublish, existingStories, onAddChapter }: EditorViewProps) => {
  const [mode, setMode] = useState<"new" | "add">("new");
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState<"good" | "bad" | "ugly">("good");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterSummary, setChapterSummary] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [fastCount, setFastCount] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [errors, setErrors] = useState<StoryFormErrors>({});
  const lastCharTime = useRef(Date.now());

  // Writing metrics tracking
  const { metrics, handleKeyDown, handlePaste: trackPaste, stopTracking, resetMetrics } = useWritingMetrics();

  const wordCount = chapterContent.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const sentenceCount = chapterContent.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    trackPaste(e); // Track paste attempt in metrics
    sonnerToast.error("PASTE DISABLED — Write line-by-line.", {
      style: { border: '2px solid black', fontFamily: 'Inter, sans-serif' },
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const now = Date.now();
    const diff = now - lastCharTime.current;
    lastCharTime.current = now;

    if (diff < 80 && e.target.value.length > chapterContent.length) {
      const next = fastCount + 1;
      setFastCount(next);
      if (next >= 3) {
        setCooldown(true);
        setFastCount(0);
        sonnerToast.warning("You are typing entirely too fast. Are you a robot?");
        setTimeout(() => {
          setCooldown(false);
        }, 2000);
        return;
      }
    } else {
      setFastCount(0);
    }

    setChapterContent(e.target.value);
    // Clear content error on type
    if (errors.chapterContent) {
      setErrors((prev) => ({ ...prev, chapterContent: undefined }));
    }
  };

  const validate = (): boolean => {
    if (mode === "add") {
      // Simple validation for add chapter mode
      if (!selectedStoryId || !chapterTitle.trim() || !chapterSummary.trim() || !chapterContent.trim()) {
        return false;
      }
      return true;
    }

    const result = storySchema.safeParse({
      title: title.trim(),
      summary: summary.trim(),
      category,
      chapterTitle: chapterTitle.trim(),
      chapterSummary: chapterSummary.trim(),
      chapterContent: chapterContent.trim(),
    });

    if (!result.success) {
      const fieldErrors: StoryFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof StoryFormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const finalMetrics = stopTracking();

    if (mode === "new") {
      onPublish(title.trim(), summary.trim(), category, chapterTitle.trim(), chapterSummary.trim(), chapterContent.trim(), finalMetrics, thumbnail);
    } else {
      if (!selectedStoryId) return;
      onAddChapter(selectedStoryId, chapterTitle.trim(), chapterSummary.trim(), chapterContent.trim(), finalMetrics);
    }
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setChapterTitle("");
    setChapterSummary("");
    setChapterContent("");
    setSelectedStoryId(null);
    setThumbnail(undefined);
    setErrors({});
    resetMetrics();
  };

  const clearFieldError = (field: keyof StoryFormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const ongoingStories = existingStories.filter((s) => s.status === "ongoing");

  return (
    <div className="relative max-w-2xl mx-auto px-6 py-8">
      {cooldown && (
        <div className="cooldown-overlay">
          <div className="text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="font-display text-xl text-foreground">Slow down.</p>
            <p className="font-ui text-sm text-muted-foreground mt-2">
              Cooling off for 2 seconds...
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="font-ui flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to feed
      </button>

      <h2 className="font-display text-3xl font-bold mb-6 text-foreground">Write a chapter</h2>

      {/* Mode Toggle */}
      <div className="mb-6">
        <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
          Mode
        </label>
        <div className="segment-control">
          <button
            onClick={() => setMode("new")}
            className={`segment-item ${mode === "new" ? "segment-item-active" : ""}`}
          >
            New Story
          </button>
          <button
            onClick={() => setMode("add")}
            className={`segment-item ${mode === "add" ? "segment-item-active" : ""}`}
            disabled={ongoingStories.length === 0}
          >
            Add Chapter
          </button>
        </div>
      </div>

      {mode === "new" ? (
        <>
          <div className="mb-6">
            <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
              Category
            </label>
            <div className="segment-control">
              {(["good", "bad", "ugly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCategory(t)}
                  className={`segment-item ${category === t ? "segment-item-active" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Story Title"
              value={title}
              onChange={(e) => { setTitle(e.target.value); clearFieldError("title"); }}
              onPaste={handlePaste}
              className={`w-full font-brand text-3xl bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-foreground ${errors.title ? 'border-b-2 border-red-500' : ''}`}
            />
            {errors.title && <p className="font-ui text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Brief summary of this story..."
              value={summary}
              onChange={(e) => { setSummary(e.target.value); clearFieldError("summary"); }}
              onPaste={handlePaste}
              className={`w-full font-body text-base bg-transparent border-b pb-4 outline-none placeholder:text-muted-foreground/40 text-foreground ${errors.summary ? 'border-red-500' : 'border-border'}`}
            />
            {errors.summary && <p className="font-ui text-xs text-red-600 mt-1">{errors.summary}</p>}
          </div>

          <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />
        </>
      ) : (
        <div className="mb-6">
          <label className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
            Select Story
          </label>
          {ongoingStories.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground italic">No ongoing stories available.</p>
          ) : (
            <div className="space-y-2">
              {ongoingStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => setSelectedStoryId(story.id)}
                  className={`w-full text-left p-4 border transition-colors ${selectedStoryId === story.id
                    ? "border-foreground bg-secondary"
                    : "border-border hover:border-foreground/50"
                    }`}
                >
                  <span className="font-display text-lg font-bold text-foreground">{story.title}</span>
                  <span className="font-ui text-xs text-muted-foreground ml-2">
                    ({story.chapters.length} chapters)
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="border-t border-border pt-6 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={16} className="text-muted-foreground" />
          <span className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
            New Chapter
          </span>
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Chapter Title (e.g., 'The Rumor')"
            value={chapterTitle}
            onChange={(e) => { setChapterTitle(e.target.value); clearFieldError("chapterTitle"); }}
            onPaste={handlePaste}
            className="w-full font-display text-xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-foreground"
          />
          {errors.chapterTitle && <p className="font-ui text-xs text-red-600 mt-1">{errors.chapterTitle}</p>}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Chapter summary (one line preview)..."
            value={chapterSummary}
            onChange={(e) => { setChapterSummary(e.target.value); clearFieldError("chapterSummary"); }}
            onPaste={handlePaste}
            className={`w-full font-body text-sm bg-transparent border-b pb-3 outline-none placeholder:text-muted-foreground/40 text-muted-foreground ${errors.chapterSummary ? 'border-red-500' : 'border-border'}`}
          />
          {errors.chapterSummary && <p className="font-ui text-xs text-red-600 mt-1">{errors.chapterSummary}</p>}
        </div>

        <div>
          <textarea
            placeholder="Write the full chapter content..."
            value={chapterContent}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            rows={8}
            className={`w-full font-body text-base bg-transparent border p-4 outline-none resize-none placeholder:text-muted-foreground/40 focus:border-foreground transition-colors text-foreground ${errors.chapterContent ? 'border-red-500' : 'border-border'}`}
          />
          {errors.chapterContent && <p className="font-ui text-xs text-red-600 mt-1">{errors.chapterContent}</p>}
        </div>

        {/* Live Writing Metrics */}
        {metrics.time_spent_seconds > 0 && (
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-ui">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatTime(metrics.time_spent_seconds || 0)}
            </span>
            <span className="flex items-center gap-1">
              <Keyboard size={12} />
              {metrics.total_keystrokes || 0} keys
            </span>
            <span>
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </span>
            {metrics.paste_attempts > 0 && (
              <span className="text-orange-500">
                {metrics.paste_attempts} paste attempt{metrics.paste_attempts !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="font-ui text-xs text-muted-foreground">
            {sentenceCount} sentence{sentenceCount !== 1 ? "s" : ""} · {wordCount} word{wordCount !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleSubmit}
            disabled={
              mode === "new"
                ? !title.trim() || !chapterContent.trim()
                : !selectedStoryId || !chapterContent.trim()
            }
            className="font-ui text-sm px-6 py-2.5 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit to Review
          </button>
        </div>
      </div>

      <p className="font-ui text-xs text-muted-foreground mt-6 leading-relaxed">
        Your submission will be reviewed by a moderator before appearing in the feed.
        Pasting is disabled. Typing speed is monitored.
      </p>
    </div>
  );
};

export default EditorView;
