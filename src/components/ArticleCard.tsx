import { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const cardStyles: Record<string, string> = {
  good: "card-good",
  bad: "card-bad",
  ugly: "card-ugly",
};

const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  const isUgly = article.category === "ugly";

  return (
    <article
      onClick={onClick}
      className={`${cardStyles[article.category]} border border-border p-6 mb-4 transition-all hover:shadow-md hover:border-foreground/30 cursor-pointer group`}
    >
      <div className="flex gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-ui text-xs uppercase tracking-widest text-muted-foreground">
              {article.category === "good" ? "Hope" : article.category === "bad" ? "Warning" : "Truth"}
            </span>
            {article.status === "ongoing" && (
              <span className="px-2 py-0.5 bg-foreground text-background text-[10px] font-ui">ONGOING</span>
            )}
            {article.status === "concluded" && (
              <span className="px-2 py-0.5 border border-border text-[10px] font-ui text-muted-foreground">CLOSED</span>
            )}
          </div>
          <h2 className="font-display text-2xl font-bold mt-2 mb-3 text-foreground leading-tight">
            {article.title}
          </h2>
          <p className={`text-base leading-relaxed text-muted-foreground ${isUgly ? "font-mono-custom" : "font-body"}`}>
            {article.summary}
          </p>
          <div className="font-ui flex items-center gap-3 mt-4 text-xs text-muted-foreground">
            <span>{article.author || "Anonymous"}</span>
            <span>·</span>
            <span>{article.chapters.length} chapter{article.chapters.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Image - always visible when article has image */}
        {article.image && (
          <div className="flex flex-shrink-0 w-20 h-20 self-center overflow-hidden rounded">
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default ArticleCard;

