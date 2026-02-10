import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import SegmentControl from "@/components/SegmentControl";
import ArticleCard from "@/components/ArticleCard";
import StoryDetailView from "@/components/StoryDetailView";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import type { Article } from "@/types/article";

type View = "reader" | "detail";
type Segment = "good" | "bad" | "ugly";

const initialArticles: Article[] = [
  // ==========================================
  // 🟢 THE GOOD (Progress, Hope, Solutions)
  // ==========================================
  {
    id: 1,
    title: "The Fusion Energy Milestone",
    summary: "Scientists at NIF achieve net energy gain for the second time, proving repeatability.",
    category: "good",
    status: "ongoing",
    author: "Energy Correspondent",
    image: "https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Dec 13, 2024",
        title: "Ignition Achieved",
        summary: "Scientists at NIF achieve net energy gain for the second time, proving repeatability.",
        content: "For the first time in history, a fusion reaction has produced more energy than was used to start it. The experiment at the National Ignition Facility yielded 3.15 megajoules of energy output for 2.05 megajoules of laser input."
      },
      {
        date: "Jan 20, 2025",
        title: "Commercial Roadmap",
        summary: "Major energy consortium announces 10-year plan for first pilot plant.",
        content: "Building on the breakthrough, a coalition of 12 nations has signed the 'Clean Grid' pact. Construction is slated to begin in France, targeting a functional 500MW pilot reactor by 2035."
      }
    ]
  },
  {
    id: 2,
    title: "The Great Green Wall",
    summary: "The massive African reforestation project hits a critical survival milestone.",
    category: "good",
    status: "ongoing",
    author: "Climate Desk",
    image: "https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Feb 10, 2024",
        title: "15% Completion",
        summary: "The initiative to grow an 8,000km natural wonder across Africa is working.",
        content: "The initiative to grow an 8,000km natural wonder across the width of Africa is working. Satellite data confirms that 15% of the wall is now self-sustaining, restoring micro-climates in the Sahel."
      },
      {
        date: "Mar 05, 2024",
        title: "Economic Rebound",
        summary: "Local crop yields in Senegal have tripled due to soil restoration.",
        content: "It is not just about trees. The returning vegetation has stabilized the soil, allowing farmers to reclaim land previously lost to desertification. Food security in the region is at a 10-year high."
      }
    ]
  },
  {
    id: 3,
    title: "ALS Gene Therapy Success",
    summary: "New treatment halts paralysis progression in 80% of trial patients.",
    category: "good",
    status: "concluded",
    author: "Medical Journal",
    image: "https://images.unsplash.com/photo-1530482054429-cc491f61333b?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Nov 15, 2024",
        title: "Phase 3 Results",
        summary: "New treatment halts paralysis progression in 80% of trial patients.",
        content: "The FDA has fast-tracked the 'Tofersen' drug after it showed unprecedented ability to lower levels of the toxic proteins that destroy motor neurons. For many patients, the disease has simply stopped."
      }
    ]
  },
  {
    id: 4,
    title: "The Ocean Cleanup",
    summary: "The largest cleanup barrier ever built enters the Great Pacific Garbage Patch.",
    category: "good",
    status: "ongoing",
    author: "Ocean Watch",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Aug 01, 2024",
        title: "System 03 Launch",
        summary: "The largest cleanup barrier ever built enters the Great Pacific Garbage Patch.",
        content: "Spanning 2.4 kilometers, System 03 is now fully operational. It captures plastic at a rate of 1000kg per hour."
      }
    ]
  },
  {
    id: 5,
    title: "Solar Surpasses Coal",
    summary: "Wind and solar together overtake coal as the world's top electricity source.",
    category: "good",
    status: "concluded",
    author: "Energy Analyst",
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Sep 30, 2025",
        title: "A Global Turning Point",
        summary: "Wind and solar together overtake coal as the world's top electricity source.",
        content: "Grid data shows renewables now supply a larger share of global electricity than coal, marking a structural shift in the energy system and pushing new fossil projects into financial risk."
      },
      {
        date: "Jan 05, 2026",
        title: "Cheaper Power, Cleaner Air",
        summary: "Most new solar and wind projects undercut fossil fuel costs.",
        content: "Analysts report that over 90% of new wind and solar capacity is now cheaper than building new coal plants, accelerating the retirement of ageing fossil infrastructure."
      }
    ]
  },
  {
    id: 6,
    title: "Cancer Outcomes Improve",
    summary: "New drug and immunotherapy combinations double survival in some cancers.",
    category: "good",
    status: "ongoing",
    author: "Health Editor",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Jul 12, 2025",
        title: "Targeted Treatments",
        summary: "New drug and immunotherapy combinations double survival in some cancers.",
        content: "Clinical data shows that patients receiving tailored therapies, guided by genetic profiling of tumours, are living significantly longer with fewer side effects than with traditional chemotherapy alone."
      },
      {
        date: "Nov 22, 2025",
        title: "mRNA Vaccines for Cancer",
        summary: "Personalised cancer vaccines enter late-stage trials.",
        content: "Researchers are testing mRNA shots that teach the immune system to recognise each patient's tumour, turning a once-generic treatment into something as customised as a fingerprint."
      }
    ]
  },
  {
    id: 7,
    title: "Species Bounce Back",
    summary: "A once-endangered sea turtle population recovers enough to lose its threatened status.",
    category: "good",
    status: "concluded",
    author: "Wildlife Monitor",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Jun 03, 2025",
        title: "Turtles Off the List",
        summary: "A once-endangered sea turtle population recovers enough to lose its threatened status.",
        content: "Decades of protected nesting beaches, fishing regulation and local stewardship have allowed turtle numbers to climb steadily, turning a symbol of loss into a case study in recovery."
      }
    ]
  },
  {
    id: 8,
    title: "Eradicating Old Diseases",
    summary: "More countries are certified free from malaria and infectious blindness.",
    category: "good",
    status: "ongoing",
    author: "Global Health",
    image: "https://images.unsplash.com/photo-1582719478250-cc6733cda3ed?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Oct 05, 2025",
        title: "Malaria & Blindness in Retreat",
        summary: "More countries are certified free from malaria and infectious blindness.",
        content: "Public health campaigns, bed nets, vaccines and basic eye care have combined to wipe out diseases that once defined childhood in many regions, freeing up entire health systems for new challenges."
      }
    ]
  },

  // ==========================================
  // 🔴 THE BAD (Failures, Warnings, Economy)
  // ==========================================
  {
    id: 9,
    title: "The Housing Market Freeze",
    summary: "Central banks raise rates again, causing mortgage applications to hit 30-year lows.",
    category: "bad",
    status: "ongoing",
    author: "Finance Desk",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Feb 28, 2025",
        title: "Rates Hit 8%",
        summary: "Central banks raise rates again, causing mortgage applications to hit 30-year lows.",
        content: "The aggressive inflation combat strategy has frozen the property market. First-time buyers are effectively locked out, while sellers refuse to lower prices, creating a toxic stagnation."
      },
      {
        date: "Mar 15, 2025",
        title: "Construction Halted",
        summary: "Major developers pause 40% of ongoing residential projects.",
        content: "With borrowing costs soaring, the supply of new homes has vanished. Economists warn this supply crunch will cause a rental price explosion in Q3."
      }
    ]
  },
  {
    id: 10,
    title: "Tech Antitrust Lawsuit",
    summary: "US regulators sue a major search giant for monopolistic ad practices.",
    category: "bad",
    status: "ongoing",
    author: "Tech Reporter",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Jan 10, 2025",
        title: "The DOJ Filing",
        summary: "US regulators sue a major search giant for monopolistic ad practices.",
        content: "The 120-page filing alleges that the company manipulated auction prices to overcharge advertisers while underpaying publishers, entrenching its dominance in digital advertising."
      },
      {
        date: "Sep 18, 2025",
        title: "Platform Remedies Debated",
        summary: "Courts weigh break-up vs behavioural remedies for dominant platforms.",
        content: "Lawmakers and economists are split between forcing structural separation of ad tech and imposing strict conduct rules, knowing that either path will reshape online media economics."
      }
    ]
  },
  {
    id: 11,
    title: "Global Airline Outage",
    summary: "A legacy software bug grounds 4,000 flights worldwide.",
    category: "bad",
    status: "concluded",
    author: "Transport Editor",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Apr 04, 2024",
        title: "System Failure",
        summary: "A legacy software bug grounds 4,000 flights worldwide.",
        content: "A single corrupted file in the NOTAM system forced the FAA to issue a ground stop. Critics point to the decades-old infrastructure running critical transport networks."
      }
    ]
  },
  {
    id: 12,
    title: "Cryptocurrency Exchange Collapse",
    summary: "Top 3 exchange halts withdrawals citing 'market conditions'.",
    category: "bad",
    status: "concluded",
    author: "Crypto Analyst",
    image: "https://images.unsplash.com/photo-1621504450168-38f6d5ce9688?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Nov 02, 2024",
        title: "Liquidity Crisis",
        summary: "Top 3 exchange halts withdrawals citing 'market conditions'.",
        content: "Billions in user funds are trapped. Leaked balance sheets show the exchange was leveraging user deposits for high-risk trading bets."
      },
      {
        date: "Dec 12, 2024",
        title: "Regulatory Crackdown",
        summary: "New rules demand full-reserve custody and proof-of-assets audits.",
        content: "In response to the collapse, regulators propose strict segregation of customer funds and real-time transparency dashboards to prevent hidden leverage from building up again."
      }
    ]
  },
  {
    id: 13,
    title: "Water Stress Cities",
    summary: "Several large cities approach critical reservoir lows after repeated droughts.",
    category: "bad",
    status: "ongoing",
    author: "Urban Affairs",
    image: "https://images.unsplash.com/photo-1541009179958-5c0d9c7e9777?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Aug 09, 2025",
        title: "Day Zero Alerts",
        summary: "Several large cities approach critical reservoir lows after repeated droughts.",
        content: "Authorities roll out water rationing and emergency imports, while ageing pipe systems leak a significant fraction of treated water before it ever reaches households."
      }
    ]
  },
  {
    id: 14,
    title: "Election Disinformation Surge",
    summary: "Coordinated bot networks flood social platforms with misleading clips before key votes.",
    category: "bad",
    status: "ongoing",
    author: "Digital Rights",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Oct 01, 2025",
        title: "Synthetic Campaigns",
        summary: "Coordinated bot networks flood social platforms with misleading clips before key votes.",
        content: "Cheap, targeted videos and fabricated quotes spread faster than fact-checks can keep up, deepening distrust in both institutions and information itself."
      }
    ]
  },

  // ==========================================
  // ⚫ THE UGLY (Raw Truths, Exploitation, Waste)
  // ==========================================
  {
    id: 15,
    title: "Fast Fashion's Graveyard",
    summary: "Satellite imagery confirms the desert clothing pile is now visible from space.",
    category: "ugly",
    status: "ongoing",
    author: "Investigative Unit",
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Oct 12, 2024",
        title: "The Atacama Dump",
        summary: "Satellite imagery confirms the desert clothing pile is now visible from space.",
        content: "Tens of thousands of tons of unsold clothing are dumped here annually. The synthetic fibers are not biodegrading; they are catching fire, releasing toxic fumes into nearby communities."
      },
      {
        date: "Nov 01, 2024",
        title: "Brand Silence",
        summary: "Top retailers refuse to disclose supply chain audits despite evidence.",
        content: "When confronted with tags found in the dump, several major brands claimed 'counterfeit goods', despite clear batch numbers linking back to their factories."
      }
    ]
  },
  {
    id: 16,
    title: "The Cobalt Cost",
    summary: "Report exposes child labor in the EV battery supply chain.",
    category: "ugly",
    status: "ongoing",
    author: "Human Rights Watch",
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Dec 05, 2024",
        title: "Artisanal Mines",
        summary: "Report exposes child labor in the EV battery supply chain.",
        content: "While the world pivots to 'green energy', the raw materials are being dug by hand by unregulated workers in the DRC, often without basic safety equipment like shoes or masks."
      }
    ]
  },
  {
    id: 17,
    title: "Algorithmic Discrimination",
    summary: "AI resume screener found to auto-reject candidates based on zip code.",
    category: "ugly",
    status: "concluded",
    author: "Tech Ethics",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Sep 20, 2024",
        title: "Hiring Bias",
        summary: "AI resume screener found to auto-reject candidates based on zip code.",
        content: "An internal audit revealed a hiring system had learned to penalize applicants from lower-income neighbourhoods, effectively turning historical redlining into automated HR policy."
      }
    ]
  },
  {
    id: 18,
    title: "Deepfake Identity Theft",
    summary: "Scammers use 3-second audio clips to bypass bank biometrics.",
    category: "ugly",
    status: "ongoing",
    author: "Cybersecurity Desk",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Jan 15, 2025",
        title: "Voice Cloning",
        summary: "Scammers use 3-second audio clips to bypass bank biometrics.",
        content: "The era of 'voice verification' is effectively over. Families are losing life savings to phone calls that sound exactly like their distressed relatives."
      }
    ]
  },
  {
    id: 19,
    title: "Silicon E-Waste Mountains",
    summary: "Obsolete chips and data center hardware pile up faster than recycling systems can cope.",
    category: "ugly",
    status: "ongoing",
    author: "Environment Editor",
    image: "https://images.unsplash.com/photo-1510851896000-498520af2236?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "May 19, 2025",
        title: "AI Hardware Scrapyards",
        summary: "Obsolete chips and data center hardware pile up faster than recycling systems can cope.",
        content: "Short product cycles for AI accelerators and cloud infrastructure have created dense clusters of discarded hardware, leaking heavy metals into soils and waterways in countries that import e-waste."
      }
    ]
  },
  {
    id: 20,
    title: "Migrant Worker Exploitation",
    summary: "Reports document deadly conditions for workers building prestige infrastructure.",
    category: "ugly",
    status: "ongoing",
    author: "Labor Rights",
    image: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&q=80&w=800",
    chapters: [
      {
        date: "Mar 03, 2025",
        title: "Invisible Labor on Mega-Projects",
        summary: "Reports document deadly conditions for workers building prestige infrastructure.",
        content: "Debt bondage, confiscated passports and extreme heat are recurring themes in testimonies from workers who power the very skylines used to advertise a nation's modernity."
      }
    ]
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("reader");
  const [segment, setSegment] = useState<Segment>("good");
  const [articles] = useState<Article[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user } = useAuth();

  const handleCardClick = (article: Article) => {
    setSelectedArticle(article);
    setView("detail");
  };

  const filteredArticles = articles.filter((a) => a.category === segment);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {view !== "detail" && (
        <AppHeader
          onWriteClick={() => {
            if (!user) {
              setShowAuthModal(true);
            } else {
              navigate("/write");
            }
          }}
        />
      )}

      {view === "reader" && (
        <>
          <SegmentControl active={segment} onChange={setSegment} />
          <main className="flex-1 max-w-2xl w-full mx-auto px-6 pb-8">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-body text-muted-foreground italic">
                  No stories yet in this category.
                </p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => handleCardClick(article)}
                />
              ))
            )}
          </main>
          <Footer />
        </>
      )}

      {view === "detail" && selectedArticle && (
        <>
          <StoryDetailView
            article={selectedArticle}
            onBack={() => {
              setView("reader");
              setSelectedArticle(null);
            }}
          />
          <Footer />
        </>
      )}

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          navigate("/write");
        }}
      />
    </div>
  );
};

export default Index;
