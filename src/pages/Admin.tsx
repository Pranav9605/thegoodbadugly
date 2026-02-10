import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle, ExternalLink, AlertTriangle, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import type { Article } from "@/types/article";

// Mock pending stories data
const mockPendingStories: (Article & { evidenceUrl: string; submittedAt: string })[] = [
  {
    id: 101,
    title: "New Battery Technology Breakthrough",
    summary: "Researchers achieve 5x energy density with solid-state lithium batteries.",
    category: "good",
    status: "ongoing",
    author: "tech.researcher@email.com",
    chapters: [
      {
        date: "Feb 9, 2026",
        title: "The Discovery",
        summary: "Lab results show unprecedented energy storage capabilities.",
        content: "A team at MIT has published results showing a new solid-state battery design that achieves five times the energy density of current lithium-ion cells. The breakthrough relies on a novel ceramic electrolyte that remains stable at high temperatures. Industry experts are cautiously optimistic, noting that laboratory results don't always translate to mass production."
      }
    ],
    evidenceUrl: "https://arxiv.org/example-paper",
    submittedAt: "2026-02-09T10:30:00Z"
  },
  {
    id: 102,
    title: "Major Bank Faces Liquidity Questions",
    summary: "Internal documents suggest misreporting of reserve ratios.",
    category: "bad",
    status: "ongoing",
    author: "finance.whistleblower@proton.me",
    chapters: [
      {
        date: "Feb 8, 2026",
        title: "The Leaked Memo",
        summary: "Documents reveal discrepancies between reported and actual reserves.",
        content: "An anonymous source has provided documents suggesting that a major regional bank has been understating its exposure to commercial real estate loans. The discrepancy appears to be in the hundreds of millions. Regulators have been contacted but have not yet responded publicly."
      }
    ],
    evidenceUrl: "https://documents.example.com/leak",
    submittedAt: "2026-02-08T15:45:00Z"
  }
];

// Mock disputes data
const mockDisputes = [
  {
    id: 1,
    storyId: 5,
    storyTitle: "Solar Surpasses Coal",
    reporterEmail: "factcheck@email.com",
    evidenceUrl: "https://iea.org/corrected-data",
    explanation: "The original article cited outdated IEA figures. The actual crossover date was Q4 2025, not Q3.",
    status: "open" as const,
    createdAt: "2026-02-07T09:00:00Z"
  },
  {
    id: 2,
    storyId: 12,
    storyTitle: "Cryptocurrency Exchange Collapse",
    reporterEmail: "",
    evidenceUrl: "https://court-records.example.com/case-123",
    explanation: "The timeline is incorrect. The withdrawal halt happened on Nov 3, not Nov 2. Court records confirm this.",
    status: "open" as const,
    createdAt: "2026-02-06T14:20:00Z"
  }
];

const Admin = () => {
  const [pendingStories, setPendingStories] = useState(mockPendingStories);
  const [disputes, setDisputes] = useState(mockDisputes);
  const [selectedStory, setSelectedStory] = useState<typeof mockPendingStories[0] | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleApprove = (id: number) => {
    setPendingStories(prev => prev.filter(s => s.id !== id));
    setSelectedStory(null);
    toast({
      title: "Story Approved",
      description: "The story has entered a 48-hour cooling period before publication.",
    });
  };

  const handleReject = () => {
    if (!selectedStory) return;
    setPendingStories(prev => prev.filter(s => s.id !== selectedStory.id));
    setSelectedStory(null);
    setShowRejectDialog(false);
    setRejectReason("");
    toast({
      title: "Story Rejected",
      description: "The author has been notified with your feedback.",
      variant: "destructive",
    });
  };

  const handleResolveDispute = (id: number) => {
    setDisputes(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Dispute Resolved",
      description: "The dispute has been marked as resolved.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link
            to="/"
            className="font-ui flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to feed
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground">
            Editorial Dashboard
          </h1>
          <p className="font-ui text-sm text-muted-foreground mt-1">
            Review pending submissions and manage disputes
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6 bg-secondary border border-border">
            <TabsTrigger value="pending" className="font-ui data-[state=active]:bg-foreground data-[state=active]:text-background">
              Pending Review ({pendingStories.length})
            </TabsTrigger>
            <TabsTrigger value="disputes" className="font-ui data-[state=active]:bg-foreground data-[state=active]:text-background">
              Disputes ({disputes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Story List */}
              <div className="space-y-3">
                <h3 className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  Submissions Queue
                </h3>
                {pendingStories.length === 0 ? (
                  <div className="border-2 border-dashed border-border p-8 text-center">
                    <p className="font-body text-muted-foreground italic">
                      No pending submissions.
                    </p>
                  </div>
                ) : (
                  pendingStories.map(story => (
                    <button
                      key={story.id}
                      onClick={() => setSelectedStory(story)}
                      className={`w-full text-left p-4 border-2 transition-colors ${
                        selectedStory?.id === story.id
                          ? "border-foreground bg-secondary"
                          : "border-border hover:border-foreground/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <span className={`inline-block font-ui text-xs uppercase tracking-wider mb-1 ${
                            story.category === "good" ? "text-foreground" :
                            story.category === "bad" ? "text-destructive" : "text-muted-foreground"
                          }`}>
                            {story.category}
                          </span>
                          <h4 className="font-display text-lg font-bold text-foreground truncate">
                            {story.title}
                          </h4>
                          <p className="font-ui text-xs text-muted-foreground mt-1">
                            {story.author} • {formatDate(story.submittedAt)}
                          </p>
                        </div>
                        <Clock size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Right: Review Pane */}
              <div className="border-2 border-border min-h-[400px]">
                {selectedStory ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <span className={`inline-block font-ui text-xs uppercase tracking-wider mb-2 ${
                        selectedStory.category === "good" ? "text-foreground" :
                        selectedStory.category === "bad" ? "text-destructive" : "text-muted-foreground"
                      }`}>
                        {selectedStory.category}
                      </span>
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        {selectedStory.title}
                      </h2>
                      <p className="font-body text-muted-foreground mt-2">
                        {selectedStory.summary}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4 mb-6">
                      <h3 className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-3">
                        Chapter Content
                      </h3>
                      {selectedStory.chapters.map((chapter, i) => (
                        <div key={i} className="mb-4">
                          <p className="font-display font-bold text-foreground">
                            {chapter.title}
                          </p>
                          <p className="font-body text-sm text-foreground mt-2 leading-relaxed">
                            {chapter.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 mb-6">
                      <h3 className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Evidence URL
                      </h3>
                      <a
                        href={selectedStory.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-custom text-sm text-foreground hover:underline inline-flex items-center gap-2"
                      >
                        {selectedStory.evidenceUrl}
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border">
                      <button
                        onClick={() => handleApprove(selectedStory.id)}
                        className="flex-1 font-ui text-sm px-4 py-3 bg-foreground text-background hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Approve (48h Cooling)
                      </button>
                      <button
                        onClick={() => setShowRejectDialog(true)}
                        className="flex-1 font-ui text-sm px-4 py-3 border-2 border-destructive text-destructive hover:bg-destructive hover:text-background transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-8">
                    <div>
                      <AlertTriangle size={32} className="mx-auto text-muted-foreground mb-4" />
                      <p className="font-body text-muted-foreground">
                        Select a story to review
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="disputes">
            <div className="space-y-4">
              <h3 className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Open Disputes
              </h3>
              {disputes.length === 0 ? (
                <div className="border-2 border-dashed border-border p-8 text-center">
                  <p className="font-body text-muted-foreground italic">
                    No open disputes.
                  </p>
                </div>
              ) : (
                disputes.map(dispute => (
                  <div key={dispute.id} className="border-2 border-border p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-ui text-xs text-muted-foreground">
                          Regarding: <span className="text-foreground font-medium">{dispute.storyTitle}</span>
                        </p>
                        <p className="font-ui text-xs text-muted-foreground mt-1">
                          Reported: {formatDate(dispute.createdAt)}
                          {dispute.reporterEmail && ` • ${dispute.reporterEmail}`}
                        </p>
                      </div>
                      <MessageSquare size={16} className="text-muted-foreground" />
                    </div>

                    <p className="font-body text-foreground mb-4">
                      {dispute.explanation}
                    </p>

                    <div className="mb-4">
                      <p className="font-ui text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        Evidence
                      </p>
                      <a
                        href={dispute.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono-custom text-sm text-foreground hover:underline inline-flex items-center gap-2"
                      >
                        {dispute.evidenceUrl}
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    <button
                      onClick={() => handleResolveDispute(dispute.id)}
                      className="font-ui text-sm px-4 py-2 border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      Mark as Resolved
                    </button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-background border-2 border-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Reject Submission</DialogTitle>
            <DialogDescription className="font-body text-muted-foreground">
              Provide a reason for rejection. This will be sent to the author.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why this story is being rejected..."
            className="w-full font-body text-sm bg-transparent border-2 border-border p-4 outline-none resize-none focus:border-foreground transition-colors text-foreground min-h-[120px]"
          />
          <DialogFooter className="gap-2">
            <button
              onClick={() => setShowRejectDialog(false)}
              className="font-ui text-sm px-4 py-2 border-2 border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="font-ui text-sm px-4 py-2 bg-destructive text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Rejection
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Admin;
