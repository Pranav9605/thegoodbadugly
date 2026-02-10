import { Link } from "react-router-dom";
import { ArrowLeft, Clock, FileCheck, Eye, Share2 } from "lucide-react";
import Footer from "@/components/Footer";

const principles = [
  {
    icon: FileCheck,
    title: "1. Evidence Required",
    description:
      "Every story must be backed by verifiable sources. We require at least one primary source URL for each submission. Rumors and speculation are not published until independently confirmed.",
  },
  {
    icon: Clock,
    title: "2. 48-Hour Cooling Period",
    description:
      "All approved stories enter a mandatory 48-hour delay before publication. This prevents reactionary publishing and allows time for fact-checking, corrections, and deeper analysis.",
  },
  {
    icon: Eye,
    title: "3. Transparent Corrections",
    description:
      "When we get something wrong, we don't delete — we correct publicly. Every story maintains a visible timeline showing when it was written, edited, and corrected.",
  },
  {
    icon: Share2,
    title: "4. No Social Amplification",
    description:
      "We don't optimize for engagement. There are no share buttons, no comment sections, no algorithms. If a story matters, readers will remember it — not because it was pushed to them, but because it was true.",
  },
];

const Principles = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b-2 border-foreground">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link
            to="/"
            className="font-ui flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to feed
          </Link>

          <h1 className="font-brand text-4xl md:text-5xl text-foreground mb-4">
            Our Principles
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-xl">
            Slow news for a fast world. These are the rules we live by.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {principles.map((principle, index) => (
            <div key={index} className="border-l-4 border-foreground pl-6 py-2">
              <div className="flex items-center gap-3 mb-3">
                <principle.icon size={24} className="text-foreground" />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {principle.title}
                </h2>
              </div>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t-2 border-border">
          <h3 className="font-display text-xl font-bold text-foreground mb-4">
            Why "Slow News"?
          </h3>
          <div className="font-body text-muted-foreground space-y-4 leading-relaxed">
            <p>
              The 24-hour news cycle has failed us. Breaking news notifications train us to react before we understand. Algorithms amplify outrage over accuracy. We've become addicted to information that makes us anxious but not informed.
            </p>
            <p>
              <strong className="text-foreground">The Good, The Bad & The Ugly</strong> is an experiment in the opposite direction. We believe that important stories deserve time — time to verify, time to contextualize, time to matter.
            </p>
            <p>
              Not every story is worth telling. But the ones we tell, we tell properly.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Principles;
