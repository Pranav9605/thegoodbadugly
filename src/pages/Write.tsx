import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import EditorView from "@/components/EditorView";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import type { Article } from "@/types/article";
import type { WritingMetadata } from "@/lib/database.types";
import { toast } from "@/hooks/use-toast";

// For now, we use mock data - in production this would come from the database
const mockOngoingStories: Article[] = [];

const Write = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePublish = (
    title: string,
    summary: string,
    category: "good" | "bad" | "ugly",
    chapterTitle: string,
    chapterSummary: string,
    chapterContent: string,
    _writingMetrics?: WritingMetadata,
    _thumbnailUrl?: string
  ) => {
    // In production, this would submit to the database with status: 'pending_review'
    toast({
      title: "Story Submitted",
      description: "Your story is now pending review. It will enter a 48-hour cooling period before publication.",
    });
    navigate("/");
  };

  const handleAddChapter = (
    storyId: number,
    chapterTitle: string,
    chapterSummary: string,
    chapterContent: string,
    _writingMetrics?: WritingMetadata
  ) => {
    // In production, this would add a chapter to the database
    console.log("Adding chapter to story", storyId, chapterTitle, chapterSummary, chapterContent);
    toast({
      title: "Chapter Added",
      description: "Your new chapter has been added to the story.",
    });
    navigate("/");
  };

  // If not logged in, show auth modal
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader onWriteClick={() => setShowAuthModal(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <h2 className="font-display text-3xl font-bold mb-4 text-foreground">
              Sign In to Write
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              You need to be signed in to submit stories. All submissions go through a review process and a 48-hour cooling period before publication.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="font-ui text-sm px-6 py-3 bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Sign In / Sign Up
            </button>
          </div>
        </main>
        <Footer />
        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EditorView
        onBack={() => navigate("/")}
        onPublish={handlePublish}
        existingStories={mockOngoingStories}
        onAddChapter={handleAddChapter}
      />
      <Footer />
    </div>
  );
};

export default Write;
