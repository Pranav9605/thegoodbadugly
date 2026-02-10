import { useParams, useNavigate } from "react-router-dom";
import StoryDetailView from "@/components/StoryDetailView";
import Footer from "@/components/Footer";
import type { Article } from "@/types/article";

// This would come from database/API in production
const mockStories: Article[] = [
  {
    id: 1,
    title: "The Fusion Energy Milestone",
    summary: "Scientists at NIF achieve net energy gain for the second time, proving repeatability.",
    category: "good",
    status: "ongoing",
    author: "Energy Correspondent",
    chapters: [
      {
        date: "Dec 13, 2024",
        title: "Ignition Achieved",
        summary: "Scientists at NIF achieve net energy gain for the second time.",
        content: "For the first time in history, a fusion reaction has produced more energy than was used to start it. The experiment at the National Ignition Facility yielded 3.15 megajoules of energy output for 2.05 megajoules of laser input."
      },
      {
        date: "Jan 20, 2025",
        title: "Commercial Roadmap",
        summary: "Major energy consortium announces 10-year plan for first pilot plant.",
        content: "Building on the breakthrough, a coalition of 12 nations has signed the 'Clean Grid' pact. Construction is slated to begin in France, targeting a functional 500MW pilot reactor by 2035."
      }
    ]
  }
];

const Story = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the story by ID
  const story = mockStories.find(s => s.id === Number(id));

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Story Not Found
            </h1>
            <p className="font-body text-muted-foreground mb-6">
              The story you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/")}
              className="font-ui text-sm px-6 py-3 bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Return Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StoryDetailView
        article={story}
        onBack={() => navigate("/")}
      />
      <Footer />
    </div>
  );
};

export default Story;
