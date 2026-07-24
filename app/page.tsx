"use client";

import { useMemo, useState } from "react";

type SortKey = "company" | "score" | "tier" | "value" | "region";
type View = "dashboard" | "lead" | "prospecting";
type TabName = "Company & Applications" | "Product Matching" | "Decision Makers" | "Outreach" | "Agent Audit";

type DecisionMaker = {
  name: string;
  role: string;
  rationale: string;
  confidence: "High" | "Medium";
};

type Application = {
  name: string;
  tag: string;
  score: number;
  summary: string;
  relevance: string;
  evidence: string;
  products: string[];
  incompatible: string[];
  competitors: string[];
  decisionMakers: DecisionMaker[];
  roadmap: [string, string, string];
  history: string[];
};

type Lead = {
  id: string;
  company: string;
  account: string;
  region: string;
  market: string;
  score: number;
  tier: number;
  value: number;
  created: string;
  updated: string;
  application: string;
  accent: string;
  summary?: string;
  buyerStatus?: string;
  competitorGrade?: string;
  source?: string;
  sourceLabel?: string;
  applications?: Application[];
};

type ModalContent = {
  title: string;
  intro: string;
  items: { title: string; meta?: string; body: string; tone?: "good" | "warn" | "neutral" }[];
};

type Prospect = {
  name: string;
  location: string;
  likelihood: number;
  segment: string;
  description: string;
  fit: string;
  program: string;
  approach: string;
};

const reweApplications: Application[] = [
  {
    name: "Private-label white-brined cheese",
    tag: "Top 10",
    score: 94,
    summary: "A retailer-scale private-label range for Balkan and Mediterranean cheese formats.",
    relevance:
      "The opportunity combines a broad store footprint with a mature own-brand model. The closest production fit is white-brined cow’s-milk cheese in retail-ready foil and tub formats, supported by EU food-safety documentation.",
    evidence:
      "REWE Group is a major European food retailer. The product and commercial-fit assessment shown here is a fictional demo hypothesis based on the target dairy portfolio.",
    products: [
      "White-brined cow’s-milk cheese · 200 g foil pack",
      "White-brined cheese · 400 g brine tub",
      "Kashkaval-style yellow cheese · 250 g wedge",
    ],
    incompatible: [
      "Individually wrapped processed-cheese slices",
      "Mould-ripened soft-cheese production",
      "Pre-grated cheese in zipper pouches",
    ],
    competitors: [
      "Lactalis · assortment overlap hypothesis",
      "Savencia · specialty cheese benchmark",
      "Hochland · processed-cheese alternative",
    ],
    decisionMakers: [
      {
        name: "Demo contact A",
        role: "Category Director, Dairy & Chilled",
        rationale: "Likely owner of assortment strategy, price architecture, and supplier performance.",
        confidence: "High",
      },
      {
        name: "Demo contact B",
        role: "Private Label Procurement Lead",
        rationale: "Likely commercial owner for specification, tender, MOQ, and cost negotiations.",
        confidence: "High",
      },
      {
        name: "Demo contact C",
        role: "Supplier Quality & Compliance Manager",
        rationale: "Likely gatekeeper for audits, EU documentation, packaging, and food-safety validation.",
        confidence: "Medium",
      },
    ],
    roadmap: [
      "Confirm target specifications, annual volume bands, pack sizes, and benchmark samples.",
      "Complete quality dossier, factory audit, sensory review, and pilot production.",
      "Negotiate tender award, packaging artwork, phased launch, and replenishment cadence.",
    ],
    history: [
      "Large European grocery footprint supports multi-market scale.",
      "Own-brand assortment creates a direct route for specification-led manufacturing.",
      "EU production location can simplify quality and logistics conversations.",
    ],
  },
  {
    name: "UHT milk & cooking cream",
    tag: "Top 20",
    score: 89,
    summary: "Shelf-stable dairy formats for value and standard own-brand tiers.",
    relevance:
      "UHT milk and cream align with long shelf-life requirements, centralized distribution, and predictable private-label replenishment. The recommended entry point is a limited two-SKU trial.",
    evidence:
      "The product fit is based on the demo manufacturer’s declared portfolio. No current supplier relationship is asserted.",
    products: [
      "UHT whole milk · 1 L carton",
      "UHT semi-skimmed milk · 1 L carton",
      "Cooking cream · 500 ml carton",
    ],
    incompatible: [
      "Aseptic PET bottle filling",
      "Lactose-free membrane separation",
      "Extended-shelf-life fresh milk",
    ],
    competitors: [
      "DMK Group · regional scale benchmark",
      "Arla Foods · branded and private-label alternative",
      "Müller · chilled dairy benchmark",
    ],
    decisionMakers: [
      {
        name: "Demo contact D",
        role: "Senior Buyer, Ambient Dairy",
        rationale: "Likely owner of commercial evaluation for UHT milk and cream.",
        confidence: "High",
      },
      {
        name: "Demo contact E",
        role: "Own Brand Product Manager",
        rationale: "Likely responsible for pack, proposition, and specification sign-off.",
        confidence: "Medium",
      },
    ],
    roadmap: [
      "Benchmark current shelf offer and agree target landed cost.",
      "Run shelf-life, carton, pallet, and sensory validation.",
      "Launch a two-SKU regional test before broader allocation.",
    ],
    history: [
      "UHT categories are suited to centralized warehousing.",
      "Carton formats support export transit without cold-chain dependence.",
      "A two-SKU test contains artwork and line-change complexity.",
    ],
  },
];

const mafApplications: Application[] = [
  {
    name: "Halal white-brined cheese",
    tag: "Top 10",
    score: 95,
    summary: "Halal-ready cheese portfolio for Carrefour and HyperMax own-brand programs.",
    relevance:
      "The strongest fit is white-brined cheese in family and single-household formats. A credible offer would combine halal documentation, ambient export handling before cold-store receipt, and bilingual packaging readiness.",
    evidence:
      "Majid Al Futtaim operates grocery retail across 12 markets. Product-fit details and contact roles are fictional demo analysis.",
    products: [
      "White-brined cheese · 200 g foil pack",
      "White-brined cheese · 500 g brine tub",
      "Kashkaval-style yellow cheese · 400 g block",
    ],
    incompatible: [
      "Shelf-stable cheese sauce",
      "Processed cheese slices",
      "Single-serve glass-jar filling",
    ],
    competitors: [
      "Lactalis · regional assortment benchmark",
      "FrieslandCampina · dairy category benchmark",
      "Savencia · specialty cheese benchmark",
    ],
    decisionMakers: [
      {
        name: "Demo contact A",
        role: "Regional Category Head, Dairy",
        rationale: "Likely sponsor for multi-market assortment and range harmonisation.",
        confidence: "High",
      },
      {
        name: "Demo contact B",
        role: "Private Label Sourcing Manager",
        rationale: "Likely owner of tender terms, landed cost, pack formats, and MOQ.",
        confidence: "High",
      },
      {
        name: "Demo contact C",
        role: "Food Safety & Halal Compliance Lead",
        rationale: "Likely validator for certificates, label language, and supplier approval.",
        confidence: "Medium",
      },
    ],
    roadmap: [
      "Align on country cluster, halal scope, pack sizes, and target landed price.",
      "Submit samples, bilingual labels, audit pack, and cold-chain plan.",
      "Pilot in one market, then expand through regional listing windows.",
    ],
    history: [
      "Carrefour private-label products are already part of the retail offer.",
      "A multi-market network creates expansion potential after a local pilot.",
      "Halal documentation is a central qualification workstream.",
    ],
  },
  {
    name: "UHT milk & cream for MENA",
    tag: "Top 20",
    score: 92,
    summary: "Shelf-stable dairy designed for warm-climate logistics and regional distribution.",
    relevance:
      "Long-life milk and cream fit high-throughput grocery, wholesale, and foodservice-adjacent formats. The recommended commercial wedge is full-fat milk plus cooking cream.",
    evidence:
      "The assessment uses public retail context and fictional opportunity values. It does not imply active procurement.",
    products: [
      "UHT full-fat milk · 1 L carton",
      "UHT semi-skimmed milk · 1 L carton",
      "Cooking cream · 500 ml carton",
    ],
    incompatible: [
      "200 ml straw-pack filling",
      "Flavoured milk formulation",
      "Lactose-free UHT processing",
    ],
    competitors: [
      "Almarai · regional branded benchmark",
      "Arla Foods · international dairy benchmark",
      "FrieslandCampina · ambient dairy benchmark",
    ],
    decisionMakers: [
      {
        name: "Demo contact D",
        role: "Ambient Dairy Buying Manager",
        rationale: "Likely commercial owner for UHT range and promotional calendar.",
        confidence: "High",
      },
      {
        name: "Demo contact E",
        role: "Regional Supply Chain Manager",
        rationale: "Likely evaluator of pallet, lead time, import, and service-level constraints.",
        confidence: "Medium",
      },
    ],
    roadmap: [
      "Validate landed-cost model and import documentation by market.",
      "Run shelf-life, heat exposure, palletisation, and artwork checks.",
      "Start with two core SKUs and extend after service-level validation.",
    ],
    history: [
      "Ambient dairy reduces dependence on refrigerated international transport.",
      "Regional scale can reward standardised specifications.",
      "Local sourcing preference must be addressed with differentiated value.",
    ],
  },
];

const freshippoApplications: Application[] = [
  {
    name: "Premium European yogurt & butter",
    tag: "Top 20",
    score: 87,
    summary: "Imported premium dairy for digital-first, freshness-led retail.",
    relevance:
      "A curated European-origin proposition can support premium discovery and online storytelling. The lowest-complexity entry is cultured yogurt and butter in a focused seasonal assortment.",
    evidence:
      "Freshippo publicly describes private-label and premium fresh-food programs. The proposed assortment and contacts are fictional demo hypotheses.",
    products: [
      "Strained-style yogurt · 400 g cup",
      "Natural yogurt · 500 g cup",
      "Unsalted butter · 250 g foil",
    ],
    incompatible: [
      "Ambient-stable yogurt",
      "Drinkable yogurt bottle filling",
      "Lactose-free cultured dairy",
    ],
    competitors: [
      "Yili · domestic dairy benchmark",
      "Mengniu · domestic dairy benchmark",
      "Fonterra · imported dairy benchmark",
    ],
    decisionMakers: [
      {
        name: "Demo contact A",
        role: "International Sourcing Director, Dairy",
        rationale: "Likely owner of imported assortment and supplier discovery.",
        confidence: "High",
      },
      {
        name: "Demo contact B",
        role: "Private Brand Category Manager",
        rationale: "Likely responsible for positioning, price tier, digital merchandising, and SKU launch.",
        confidence: "High",
      },
      {
        name: "Demo contact C",
        role: "Import Quality & Regulatory Manager",
        rationale: "Likely gatekeeper for China labels, registration, testing, and cold-chain evidence.",
        confidence: "Medium",
      },
    ],
    roadmap: [
      "Confirm importer route, cold-chain model, target price, and China label requirements.",
      "Run sensory testing, e-commerce content review, and limited-city pilot.",
      "Scale only after repeat-purchase and waste-rate validation.",
    ],
    history: [
      "Freshippo blends store and app-based grocery shopping.",
      "Premium ingredients and private-label products are part of its public proposition.",
      "Cold-chain and import compliance are the critical gating factors.",
    ],
  },
  {
    name: "Imported cheese assortment",
    tag: "Top 25",
    score: 84,
    summary: "Distinctive European cheese formats for premium, discovery-led merchandising.",
    relevance:
      "White-brined cheese and kashkaval can add a differentiated Eastern European story. The opportunity is best framed as a narrow, education-supported range rather than a broad commodity listing.",
    evidence:
      "The fit is a demo inference from Freshippo’s premium grocery positioning and the manufacturer’s cheese portfolio.",
    products: [
      "White-brined cheese · 400 g tub",
      "Kashkaval-style cheese · 250 g wedge",
      "White-brined cheese · 200 g foil",
    ],
    incompatible: [
      "Processed cheese slices",
      "Mould-ripened cheese production",
      "Pre-grated zipper-pouch cheese",
    ],
    competitors: [
      "Lactalis · imported cheese benchmark",
      "Savencia · specialty range benchmark",
      "Milkground · local specialty benchmark",
    ],
    decisionMakers: [
      {
        name: "Demo contact D",
        role: "Cheese Category Merchant",
        rationale: "Likely owner of assortment curation, margin, and in-app merchandising.",
        confidence: "High",
      },
      {
        name: "Demo contact E",
        role: "Global Supplier Development Manager",
        rationale: "Likely owner of supplier qualification and commercial onboarding.",
        confidence: "Medium",
      },
    ],
    roadmap: [
      "Test product naming, education content, price points, and pack sizes.",
      "Complete China label, sample, import, and city-cluster validation.",
      "Expand from a seasonal story to a permanent line if velocity supports it.",
    ],
    history: [
      "Differentiated origin stories can support premium discovery.",
      "Digital merchandising can explain unfamiliar cheese styles.",
      "Small initial range reduces compliance and waste exposure.",
    ],
  },
];

const seedLeads: Lead[] = [
  {
    id: "DEMO-7R2A",
    company: "REWE Group",
    account: "Open prospect",
    region: "Europe",
    market: "Cologne, Germany",
    score: 91,
    tier: 10,
    value: 5400000,
    created: "Jul 18, 2026",
    updated: "Jul 24, 2026",
    application: "Private-label cheese",
    accent: "#4f9c91",
    buyerStatus: "Priority buyer",
    competitorGrade: "Competitive category",
    summary:
      "REWE Group is a strong European retail target for a scalable private-label dairy program. The best entry points are white-brined cheese and a compact UHT milk and cream range, supported by EU production, export experience, and specification-led manufacturing.",
    source: "https://www.rewe-group.com/en/",
    sourceLabel: "REWE Group company profile",
    applications: reweApplications,
  },
  {
    id: "DEMO-9M4F",
    company: "Majid Al Futtaim Retail",
    account: "Open prospect",
    region: "MENA",
    market: "Dubai, UAE",
    score: 88,
    tier: 20,
    value: 4100000,
    created: "Jul 20, 2026",
    updated: "Jul 24, 2026",
    application: "Halal UHT dairy",
    accent: "#4d88a6",
    buyerStatus: "Regional buyer",
    competitorGrade: "High competition",
    summary:
      "Majid Al Futtaim Retail offers a multi-market path into MENA grocery through Carrefour, HyperMax, and related formats. The strongest demo opportunities are halal white-brined cheese and shelf-stable UHT dairy designed for regional logistics.",
    source: "https://www.majidalfuttaim.com/en/what-we-do/our-industries/industry/retail",
    sourceLabel: "Majid Al Futtaim retail overview",
    applications: mafApplications,
  },
  {
    id: "DEMO-3C8X",
    company: "Freshippo",
    account: "Open prospect",
    region: "China",
    market: "Shanghai, China",
    score: 83,
    tier: 25,
    value: 3200000,
    created: "Jul 22, 2026",
    updated: "Jul 24, 2026",
    application: "Imported premium dairy",
    accent: "#b07b39",
    buyerStatus: "Import target",
    competitorGrade: "Premium category",
    summary:
      "Freshippo is a relevant China prospect for a tightly curated premium European dairy range. The most credible starting points are yogurt and butter, plus a small imported cheese story, with import compliance and cold-chain economics treated as the main gates.",
    source: "https://www.alibabagroup.com/en-US/about-alibaba-businesses-1747800973536919552",
    sourceLabel: "Alibaba Group Freshippo overview",
    applications: freshippoApplications,
  },
];

const worldProspects: Prospect[] = [
  {
    name: "SPAR International",
    location: "Amsterdam, Netherlands",
    likelihood: 86,
    segment: "International grocery network",
    description: "A multi-market grocery network with local operators and established private-label activity.",
    fit: "White-brined cheese, kashkaval, UHT milk, and cooking cream can be proposed as a modular country-market assortment.",
    program: "Pilot with one national SPAR operator, then reuse the compliance and commercial pack across adjacent markets.",
    approach: "Engage international sourcing and the chosen country operator together. Lead with export readiness and flexible pack sizes.",
  },
  {
    name: "Migros Cooperative Federation",
    location: "Zurich, Switzerland",
    likelihood: 81,
    segment: "National grocery cooperative",
    description: "A large grocery cooperative with a strong own-brand heritage and quality-led product proposition.",
    fit: "A differentiated Balkan cheese range can complement premium and world-food assortment while UHT supports value tiers.",
    program: "Start with a limited white-brined cheese and kashkaval tender supported by sensory samples.",
    approach: "Position the offer around traceability, EU manufacture, origin story, and retailer-specific specification work.",
  },
  {
    name: "Auchan Retail",
    location: "Croix, France",
    likelihood: 78,
    segment: "International food retailer",
    description: "A broad-format retailer with multi-country operations and private-label category depth.",
    fit: "Shelf-stable milk, cooking cream, and family-format cheese fit centralized sourcing and high-volume retail.",
    program: "Use a two-SKU UHT offer as the simplest operational entry, then extend into cheese.",
    approach: "Target dairy sourcing with a costed specification, pallet plan, factory-audit pack, and launch lead time.",
  },
];

const chinaProspects: Prospect[] = [
  {
    name: "China Resources Vanguard",
    location: "Shenzhen, China",
    likelihood: 84,
    segment: "National grocery retailer",
    description: "A large multi-format retailer with premium and mainstream grocery banners.",
    fit: "Imported cheese and butter can be tested through premium formats before wider grocery distribution.",
    program: "Propose a three-SKU European dairy trial with importer, China label, and cold-chain plan attached.",
    approach: "Engage imported-food sourcing and category teams; lead with origin, traceability, and a city-cluster pilot.",
  },
  {
    name: "Yonghui Superstores",
    location: "Fuzhou, China",
    likelihood: 79,
    segment: "Fresh-led supermarket group",
    description: "A major Chinese grocery operator with a strong fresh-food and household shopping proposition.",
    fit: "Premium yogurt, butter, and a compact cheese range suit affluent-city stores if logistics support the margin.",
    program: "Test in selected high-income city stores with digital education and strict waste-rate monitoring.",
    approach: "Contact imported dairy buying and supply chain together; make cold-chain economics explicit from the first meeting.",
  },
  {
    name: "Wumart Group",
    location: "Beijing, China",
    likelihood: 75,
    segment: "Omnichannel grocery retailer",
    description: "A technology-enabled retail group operating supermarket and convenience formats.",
    fit: "UHT dairy provides the lowest-logistics-risk entry, with premium butter and cheese as selective extensions.",
    program: "Begin with shelf-stable milk and cooking cream, then evaluate chilled formats by city.",
    approach: "Frame the proposal as a measurable assortment test with clear landed cost, shelf life, and reorder thresholds.",
  },
];

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const tabs: TabName[] = ["Company & Applications", "Product Matching", "Decision Makers", "Outreach", "Agent Audit"];

export default function Home() {
  const [leads, setLeads] = useState(seedLeads);
  const [view, setView] = useState<View>("dashboard");
  const [selectedLeadId, setSelectedLeadId] = useState(seedLeads[0].id);
  const [activeTab, setActiveTab] = useState<TabName>("Company & Applications");
  const [applicationIndex, setApplicationIndex] = useState(0);
  const [expandedApplication, setExpandedApplication] = useState<number | null>(0);
  const [prospectingRegion, setProspectingRegion] = useState<"World" | "China">("World");
  const [expandedProspect, setExpandedProspect] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [addOpen, setAddOpen] = useState(false);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [toast, setToast] = useState("");

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) ?? leads[0];
  const applications = selectedLead.applications ?? fallbackApplications(selectedLead);
  const selectedApplication = applications[applicationIndex] ?? applications[0];

  const visibleLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return leads
      .filter((lead) =>
        [lead.company, lead.region, lead.market, lead.application, lead.id]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .sort((a, b) => {
        const left = a[sortKey];
        const right = b[sortKey];
        const comparison =
          typeof left === "number" && typeof right === "number"
            ? left - right
            : String(left).localeCompare(String(right));
        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [leads, query, sortDirection, sortKey]);

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  function setSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("desc");
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function openLead(lead: Lead) {
    setSelectedLeadId(lead.id);
    setActiveTab("Company & Applications");
    setApplicationIndex(0);
    setExpandedApplication(0);
    setView("lead");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startProspecting(index = 0) {
    setApplicationIndex(index);
    setProspectingRegion("World");
    setExpandedProspect(0);
    setView("prospecting");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const company = String(form.get("company") || "New prospect");
    const region = String(form.get("region") || "Europe");
    const market = String(form.get("market") || "Location pending");
    const application = String(form.get("application") || "Dairy portfolio review");
    setLeads((current) => [
      ...current,
      {
        id: `DEMO-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        company,
        account: "New lead",
        region,
        market,
        score: 72,
        tier: 50,
        value: 1200000,
        created: "Jul 24, 2026",
        updated: "Jul 24, 2026",
        application,
        accent: "#6a91a3",
        buyerStatus: "New buyer",
        competitorGrade: "Research pending",
        summary: `${company} is a manually entered demo lead. The workspace has generated two placeholder dairy applications so the full interaction flow remains available.`,
      },
    ]);
    setAddOpen(false);
    notify(`${company} added to the demo pipeline`);
  }

  return (
    <main className="app-shell">
      <GlobalHeader />
      <PrimaryNav />
      <div className="pattern-band" />

      {view === "dashboard" && (
        <Dashboard
          leads={leads}
          visibleLeads={visibleLeads}
          totalValue={totalValue}
          query={query}
          sortKey={sortKey}
          sortDirection={sortDirection}
          setQuery={setQuery}
          setSort={setSort}
          setSortKey={setSortKey}
          setSortDirection={setSortDirection}
          setAddOpen={setAddOpen}
          openLead={openLead}
          notify={notify}
        />
      )}

      {view === "lead" && (
        <LeadWorkspace
          lead={selectedLead}
          leads={leads}
          applications={applications}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          expandedApplication={expandedApplication}
          setExpandedApplication={setExpandedApplication}
          setView={setView}
          openLead={openLead}
          startProspecting={startProspecting}
          setModal={setModal}
          notify={notify}
        />
      )}

      {view === "prospecting" && (
        <ProspectingWorkspace
          lead={selectedLead}
          application={selectedApplication}
          region={prospectingRegion}
          setRegion={setProspectingRegion}
          expandedProspect={expandedProspect}
          setExpandedProspect={setExpandedProspect}
          setView={setView}
          setModal={setModal}
        />
      )}

      {addOpen && <AddLeadModal handleAdd={handleAdd} close={() => setAddOpen(false)} />}
      {modal && <InformationModal content={modal} close={() => setModal(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

function GlobalHeader() {
  return (
    <header className="global-header">
      <div className="brand">
        <span className="brand-mark">D</span>
        <span>
          <strong>DairyFlow</strong>
          <small>EXPORT INTELLIGENCE</small>
        </span>
      </div>
      <div className="global-search">
        <span aria-hidden="true">⌕</span>
        <input aria-label="Global search" placeholder="Search the workspace..." />
        <kbd>⌘ K</kbd>
      </div>
      <div className="header-actions" aria-label="Workspace actions">
        <button aria-label="Create">＋</button>
        <button aria-label="Help">?</button>
        <span className="avatar">DE</span>
      </div>
    </header>
  );
}

function PrimaryNav() {
  return (
    <div className="primary-nav">
      <button className="app-grid" aria-label="App menu">
        {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
      </button>
      <span className="nav-title">Sales Agent</span>
      <button className="nav-tab active">Agent Panel</button>
      <span className="demo-badge">WHITE-LABEL DEMO</span>
    </div>
  );
}

function Dashboard({
  leads,
  visibleLeads,
  totalValue,
  query,
  sortKey,
  sortDirection,
  setQuery,
  setSort,
  setSortKey,
  setSortDirection,
  setAddOpen,
  openLead,
  notify,
}: {
  leads: Lead[];
  visibleLeads: Lead[];
  totalValue: number;
  query: string;
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
  setQuery: (value: string) => void;
  setSort: (key: SortKey) => void;
  setSortKey: (key: SortKey) => void;
  setSortDirection: (value: "asc" | "desc") => void;
  setAddOpen: (value: boolean) => void;
  openLead: (lead: Lead) => void;
  notify: (message: string) => void;
}) {
  return (
    <section className="workspace">
      <WorkspaceTop />
      <div className="content">
        <div className="heading-row">
          <div>
            <p className="eyebrow">PRIVATE-LABEL PIPELINE</p>
            <h2>Leads Management</h2>
            <p>{leads.length} qualified leads</p>
          </div>
          <div className="action-row">
            <button className="button primary" onClick={() => notify("Open a lead to run application-level prospecting")}>
              ✦ Run Prospecting
            </button>
            <button className="button secondary" onClick={() => notify("Demo import ready for XLSX or CSV")}>⇧ Import</button>
            <button className="button secondary" onClick={() => notify("Demo pipeline exported")}>⇩ Export</button>
            <button className="button dark" onClick={() => setAddOpen(true)}>＋ Add Lead</button>
          </div>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <div>
              <span>Total leads</span>
              <strong>{leads.length}</strong>
              <small>{leads.length} research-ready</small>
            </div>
            <span className="metric-icon people">♟</span>
          </article>
          <article className="metric-card">
            <div>
              <span>Potential contract value</span>
              <strong>€{(totalValue / 1000000).toFixed(1)}M</strong>
              <small>Illustrative annual value</small>
            </div>
            <span className="metric-icon value">€</span>
          </article>
        </div>

        <div className="search-toolbar">
          <label className="lead-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by company, region, application, or demo ID..."
            />
          </label>
          <button className="button secondary" onClick={() => setSort("region")}>▾ Sort: {sortKey}</button>
          <button
            className="button secondary"
            onClick={() => {
              setQuery("");
              setSortKey("score");
              setSortDirection("desc");
            }}
          >
            ↻ Reset
          </button>
        </div>

        <div className="lead-table-wrap">
          <table className="lead-table">
            <thead>
              <tr>
                <th><input aria-label="Select all leads" type="checkbox" /></th>
                <th><SortButton label="Company" field="company" {...{ sortKey, sortDirection, setSort }} /></th>
                <th>Contact</th>
                <th>Owner</th>
                <th><SortButton label="Match" field="score" {...{ sortKey, sortDirection, setSort }} /></th>
                <th><SortButton label="Tier" field="tier" {...{ sortKey, sortDirection, setSort }} /></th>
                <th><SortButton label="Region" field="region" {...{ sortKey, sortDirection, setSort }} /></th>
                <th><SortButton label="Potential value" field="value" {...{ sortKey, sortDirection, setSort }} /></th>
                <th>Created</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead) => (
                <tr key={lead.id} onClick={() => openLead(lead)}>
                  <td onClick={(event) => event.stopPropagation()}>
                    <input aria-label={`Select ${lead.company}`} type="checkbox" />
                  </td>
                  <td>
                    <button className="company-cell" onClick={(event) => { event.stopPropagation(); openLead(lead); }}>
                      <strong>{lead.company}</strong>
                      <span>{lead.market}</span>
                      <small>{lead.id}</small>
                    </button>
                  </td>
                  <td>
                    <strong className="muted-strong">{lead.account}</strong>
                    <span className="cell-subline">Fictional role profile</span>
                  </td>
                  <td>
                    <strong className="muted-strong">Demo Owner</strong>
                    <span className="cell-subline">{lead.application}</span>
                  </td>
                  <td>
                    <div className="score-cell">
                      <span className="score-bar"><i style={{ width: `${lead.score}%`, background: lead.accent }} /></span>
                      <strong>{lead.score}%</strong>
                    </div>
                  </td>
                  <td><span className="tier-badge">Top {lead.tier}</span></td>
                  <td><span className="region-badge">{lead.region}</span></td>
                  <td><strong className="value-cell">{currency.format(lead.value)}</strong></td>
                  <td>{lead.created}</td>
                  <td>{lead.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleLeads.length === 0 && (
            <div className="empty-state">
              <strong>No leads match “{query}”</strong>
              <button onClick={() => setQuery("")}>Clear search</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function WorkspaceTop() {
  return (
    <div className="workspace-top">
      <div className="workspace-identity">
        <span className="spark-icon">✦</span>
        <h1>Sales Agent</h1>
        <nav aria-label="Sales Agent areas">
          <button className="pill active">Leads</button>
          <button>Inquiries</button>
        </nav>
      </div>
      <div className="privacy-note">
        <span>✓</span>
        Companies are real · contacts &amp; values are demo data
      </div>
    </div>
  );
}

function LeadWorkspace({
  lead,
  leads,
  applications,
  activeTab,
  setActiveTab,
  expandedApplication,
  setExpandedApplication,
  setView,
  openLead,
  startProspecting,
  setModal,
  notify,
}: {
  lead: Lead;
  leads: Lead[];
  applications: Application[];
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  expandedApplication: number | null;
  setExpandedApplication: (index: number | null) => void;
  setView: (view: View) => void;
  openLead: (lead: Lead) => void;
  startProspecting: (index?: number) => void;
  setModal: (content: ModalContent) => void;
  notify: (message: string) => void;
}) {
  return (
    <section className="workspace detail-workspace">
      <div className="detail-heading">
        <div className="workspace-identity">
          <span className="spark-icon">✦</span>
          <h1>Sales Agent</h1>
        </div>
        <div className="lead-mini-data">
          <span><small>REGISTRATION</small><strong>Prospect</strong></span>
          <span><small>COMPANY</small><strong>{lead.company}</strong></span>
          <span><small>OWNER</small><strong>Demo Owner</strong></span>
          <span><small>REGION</small><strong>{lead.region}</strong></span>
        </div>
        <div className="action-row">
          <button className="button secondary" onClick={() => notify("Demo record is ready for editing")}>Edit Lead</button>
          <button className="button secondary" onClick={() => notify("CRM handoff simulated")}>Sync to CRM</button>
          <button className="button primary" onClick={() => startProspecting(0)}>✦ Run Prospecting</button>
        </div>
      </div>

      <div className="stage-row">
        {["Lead Captured", "Standardized", "Product Matches", "Decision Makers", "Outreach", "Agent Audit"].map((stage, index) => (
          <span key={stage} className={index === 5 ? "current" : ""}>{stage}</span>
        ))}
      </div>

      <div className="detail-grid">
        <aside className="recent-leads">
          <button className="back-link" onClick={() => setView("dashboard")}>← All Registrations</button>
          <h2><span>♟</span> Recent Leads</h2>
          <p>{leads.length} demo records</p>
          <div className="recent-list">
            {leads.map((item) => (
              <button key={item.id} className={item.id === lead.id ? "active" : ""} onClick={() => openLead(item)}>
                <small>{item.id}</small>
                <strong>{item.company}</strong>
                <span>{item.market}</span>
                <i>{item.score}%</i>
              </button>
            ))}
          </div>
        </aside>

        <div className="detail-main">
          <div className="tab-row" role="tablist" aria-label="Lead details">
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Company & Applications" && (
            <>
              <CompanySnapshot lead={lead} applications={applications} setModal={setModal} />
              <section className="application-section">
                <div className="section-heading">
                  <div>
                    <span className="section-icon">✦</span>
                    <h2>Relevant Applications</h2>
                    <p>Two best-fit opportunities, ranked against the demo dairy portfolio.</p>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() =>
                      setModal({
                        title: `Sources — ${lead.company}`,
                        intro: "Public company context used to ground the demo. All contact profiles, scores, values, and fit statements are fictional.",
                        items: [
                          {
                            title: lead.sourceLabel ?? "Public company profile",
                            meta: "Official source",
                            body: lead.source ?? "Manually entered demo record with no public source attached.",
                            tone: "good",
                          },
                        ],
                      })
                    }
                  >
                    View Sources
                  </button>
                </div>

                <div className="application-list">
                  {applications.map((application, index) => (
                    <ApplicationCard
                      key={application.name}
                      application={application}
                      expanded={expandedApplication === index}
                      toggle={() => setExpandedApplication(expandedApplication === index ? null : index)}
                      startProspecting={() => startProspecting(index)}
                      setModal={setModal}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === "Product Matching" && (
            <ProductMatching lead={lead} applications={applications} setModal={setModal} />
          )}

          {activeTab === "Decision Makers" && (
            <DecisionMakers lead={lead} applications={applications} />
          )}

          {activeTab === "Outreach" && <Outreach lead={lead} applications={applications} notify={notify} />}

          {activeTab === "Agent Audit" && <AgentAudit lead={lead} />}
        </div>
      </div>
    </section>
  );
}

function CompanySnapshot({
  lead,
  applications,
  setModal,
}: {
  lead: Lead;
  applications: Application[];
  setModal: (content: ModalContent) => void;
}) {
  return (
    <section className="snapshot-card">
      <div className="snapshot-top">
        <div>
          <span className="snapshot-label">▦ Company Snapshot</span>
          <h2>{lead.company}</h2>
          <p>{lead.summary}</p>
          <span className="location-line">● {lead.market}</span>
        </div>
        <div className="snapshot-score">
          <strong>{lead.score}%</strong>
          <span>↗ High match</span>
          <small>{lead.buyerStatus}</small>
          <small className="competition">{lead.competitorGrade}</small>
        </div>
      </div>
      <div className="snapshot-facts">
        <div>
          <small>Relevant applications</small>
          {applications.map((application) => <span key={application.name}>• {application.name}</span>)}
        </div>
        <div>
          <small>Primary contact</small>
          <strong>Fictional role profile</strong>
          <span>No personal data used</span>
        </div>
        <div>
          <small>Potential annual value</small>
          <strong>{currency.format(lead.value)}</strong>
          <span>Illustrative · medium confidence</span>
        </div>
        <button
          className="score-breakdown"
          onClick={() =>
            setModal({
              title: `Score breakdown — ${lead.company}`,
              intro: "Illustrative scoring model for the prototype.",
              items: [
                { title: "Portfolio fit", meta: "35% weight", body: "Two high-relevance applications match current dairy categories.", tone: "good" },
                { title: "Commercial scale", meta: "30% weight", body: "Retail footprint and private-label potential support meaningful annual volume.", tone: "good" },
                { title: "Access & complexity", meta: "20% weight", body: "Supplier onboarding, competition, and import steps reduce the near-term score.", tone: "warn" },
                { title: "Geographic fit", meta: "15% weight", body: `The ${lead.region} route aligns with the export strategy represented in the demo.`, tone: "neutral" },
              ],
            })
          }
        >
          ▥ Score breakdown
        </button>
      </div>
    </section>
  );
}

function ApplicationCard({
  application,
  expanded,
  toggle,
  startProspecting,
  setModal,
}: {
  application: Application;
  expanded: boolean;
  toggle: () => void;
  startProspecting: () => void;
  setModal: (content: ModalContent) => void;
}) {
  return (
    <article className={`application-card ${expanded ? "expanded" : ""}`}>
      <button className="application-summary" onClick={toggle} aria-expanded={expanded}>
        <span className="application-grid-icon">▦</span>
        <span className="application-title">
          <strong>{application.name} <i>{application.tag}</i></strong>
          <small>{application.summary}</small>
        </span>
        <span className="ring-score" style={{ "--score": `${application.score * 3.6}deg` } as React.CSSProperties}>
          <b>{application.score}%</b>
        </span>
        <span className="chevron">{expanded ? "⌃" : "⌄"}</span>
      </button>

      {expanded && (
        <div className="application-body">
          <div className="rank-line">
            <span>Tier ranking</span>
            <strong>{application.tag}</strong>
            <p>This application is ranked among the strongest demo opportunities in the current lead set.</p>
          </div>

          <InfoBlock title="Relevance" body={application.relevance} />
          <InfoBlock title="Evidence" body={application.evidence} />

          <div className="contact-cards">
            <ActionInfoCard
              title="Working with competitors"
              body="Likely category alternatives and relationships."
              button="View competitor hypotheses"
              onClick={() =>
                setModal({
                  title: `Working with competitors — ${application.name}`,
                  intro: "These are demo hypotheses for sales preparation, not verified supplier relationships.",
                  items: application.competitors.map((item) => {
                    const [title, body] = item.split(" · ");
                    return { title, meta: "Verify before outreach", body, tone: "warn" as const };
                  }),
                })
              }
            />
            <ActionInfoCard
              title="Decision Makers"
              body="Fictional role profiles for the buying process."
              button="View decision makers"
              onClick={() =>
                setModal({
                  title: `Decision makers — ${application.name}`,
                  intro: "Role profiles are fictional and intentionally contain no personal data.",
                  items: application.decisionMakers.map((person) => ({
                    title: `${person.name} — ${person.role}`,
                    meta: `Confidence: ${person.confidence.toLowerCase()}`,
                    body: person.rationale,
                    tone: person.confidence === "High" ? "good" as const : "neutral" as const,
                  })),
                })
              }
            />
            <ActionInfoCard
              title="Contact routes"
              body="Suggested paths into procurement and quality."
              button="View contact routes"
              onClick={() =>
                setModal({
                  title: `Contact routes — ${application.name}`,
                  intro: "Recommended public, permission-based outreach paths.",
                  items: [
                    { title: "Supplier onboarding portal", meta: "Primary", body: "Use the retailer’s public supplier or partner route where available.", tone: "good" },
                    { title: "Category leadership", meta: "Secondary", body: "Target the relevant dairy category role with a short, specification-led introduction.", tone: "neutral" },
                    { title: "Trade event meeting", meta: "Alternative", body: "Use a scheduled meeting to present samples, certifications, MOQ, and lead time.", tone: "neutral" },
                  ],
                })
              }
            />
          </div>

          <div className="roadmap">
            <div className="roadmap-heading"><span>Likely roadmap</span><i>Confidence: medium</i></div>
            <div className="roadmap-line"><b>1</b><b>2</b><b>3</b></div>
            <div className="roadmap-grid">
              {application.roadmap.map((item, index) => (
                <div key={item}>
                  <strong>{index === 0 ? "0–6 months" : index === 1 ? "6–12 months" : "12–24 months"}</strong>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="history">
            <strong>Research signals</strong>
            <ul>{application.history.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>

          <div className="application-actions">
            <button
              className="button secondary"
              onClick={() =>
                setModal({
                  title: `Matched products — ${application.name}`,
                  intro: "Products from the anonymized dairy portfolio that fit the opportunity.",
                  items: application.products.map((item, index) => ({
                    title: item,
                    meta: index === 0 ? "Primary recommendation" : "Portfolio option",
                    body: index === 0 ? "Best balance of production fit, buyer relevance, and trial simplicity." : "Relevant extension after specification confirmation.",
                    tone: index === 0 ? "good" as const : "neutral" as const,
                  })),
                })
              }
            >
              View products
            </button>
            <button
              className="button secondary"
              onClick={() =>
                setModal({
                  title: `Incompatible technologies — ${application.name}`,
                  intro: "Capabilities not represented in the demo production setup. Flagged early to avoid a false product match.",
                  items: application.incompatible.map((item) => ({
                    title: item,
                    meta: "Capability gap",
                    body: "Do not position as currently manufacturable without a partner, line investment, or revised specification.",
                    tone: "warn" as const,
                  })),
                })
              }
            >
              View incompatible technologies
            </button>
            <button className="button primary" onClick={startProspecting}>✦ Run prospecting</button>
          </div>
        </div>
      )}
    </article>
  );
}

function ProductMatching({
  lead,
  applications,
  setModal,
}: {
  lead: Lead;
  applications: Application[];
  setModal: (content: ModalContent) => void;
}) {
  return (
    <section className="tab-panel">
      <div className="section-heading">
        <div>
          <span className="section-icon">▦</span>
          <h2>Product Matching</h2>
          <p>Portfolio fit for {lead.company}, with known capability gaps separated from valid matches.</p>
        </div>
      </div>
      <div className="match-grid">
        {applications.map((application) => (
          <article className="match-card" key={application.name}>
            <div className="match-card-top">
              <span>{application.score}% match</span>
              <strong>{application.name}</strong>
              <p>{application.summary}</p>
            </div>
            <div className="match-columns">
              <div>
                <small>MATCHED PRODUCTS</small>
                {application.products.map((product) => <span className="match-item good" key={product}>✓ {product}</span>)}
              </div>
              <div>
                <small>CAPABILITY GAPS</small>
                {application.incompatible.map((item) => <span className="match-item gap" key={item}>× {item}</span>)}
              </div>
            </div>
            <button
              className="button secondary"
              onClick={() =>
                setModal({
                  title: `Why this match — ${application.name}`,
                  intro: "Concise product-to-opportunity rationale.",
                  items: [
                    { title: "Portfolio coverage", body: application.relevance, tone: "good" },
                    { title: "Limits", body: `Excluded: ${application.incompatible.join(", ")}.`, tone: "warn" },
                  ],
                })
              }
            >
              Explain match
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function DecisionMakers({ lead, applications }: { lead: Lead; applications: Application[] }) {
  return (
    <section className="tab-panel">
      <div className="section-heading">
        <div>
          <span className="section-icon">♟</span>
          <h2>Decision Makers</h2>
          <p>Fictional role profiles for {lead.company}; no real personal information is used.</p>
        </div>
        <span className="fiction-badge">DEMO PROFILES</span>
      </div>
      {applications.map((application) => (
        <div className="decision-group" key={application.name}>
          <h3>{application.name}</h3>
          <div className="decision-grid">
            {application.decisionMakers.map((person) => (
              <article className="decision-card" key={`${application.name}-${person.name}`}>
                <span className="person-icon">{person.name.slice(-1)}</span>
                <div>
                  <small>{person.name}</small>
                  <strong>{person.role}</strong>
                  <p>{person.rationale}</p>
                  <i>Confidence: {person.confidence.toLowerCase()}</i>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function Outreach({
  lead,
  applications,
  notify,
}: {
  lead: Lead;
  applications: Application[];
  notify: (message: string) => void;
}) {
  const first = applications[0];
  return (
    <section className="tab-panel">
      <div className="section-heading">
        <div>
          <span className="section-icon">↗</span>
          <h2>Outreach</h2>
          <p>Editable first-contact draft based on the highest-ranked application.</p>
        </div>
        <button
          className="button primary"
          onClick={() => {
            void navigator.clipboard?.writeText(`Private-label dairy opportunity for ${lead.company}`);
            notify("Draft copied to clipboard");
          }}
        >
          Copy draft
        </button>
      </div>
      <div className="outreach-layout">
        <article className="email-card">
          <div className="email-meta">
            <span><small>TO ROLE</small><strong>{first.decisionMakers[0].role}</strong></span>
            <span><small>SUBJECT</small><strong>Private-label dairy proposal for {lead.company}</strong></span>
          </div>
          <div className="email-body">
            <p>Hello,</p>
            <p>
              I am reaching out regarding a potential private-label collaboration in <strong>{first.name.toLowerCase()}</strong>.
              We manufacture export-ready dairy products in the EU and can adapt specifications, pack formats, and volumes for
              retailer own-brand programs.
            </p>
            <p>
              Based on your current market position, the most relevant starting options appear to be {first.products.slice(0, 2).join(" and ")}.
              We can provide a specification pack, certificates, benchmark samples, and an initial landed-cost model.
            </p>
            <p>Would a short review with the dairy category and supplier-quality teams be useful?</p>
            <p>Best regards,<br />Demo Export Team</p>
          </div>
        </article>
        <aside className="outreach-notes">
          <h3>Personalization signals</h3>
          <span>✓ Lead with the top-ranked application</span>
          <span>✓ Mention EU manufacture and export readiness</span>
          <span>✓ Offer samples and a specification pack</span>
          <span>✓ Avoid unverified competitor claims</span>
          <span>✓ Verify the real recipient before sending</span>
        </aside>
      </div>
    </section>
  );
}

function AgentAudit({ lead }: { lead: Lead }) {
  const steps = [
    ["Lead imported", "Company and geography standardized", "Jul 24 · 09:12"],
    ["Public sources reviewed", "Official company context attached", "Jul 24 · 09:14"],
    ["Applications ranked", "Two portfolio opportunities retained", "Jul 24 · 09:16"],
    ["Capability gaps checked", "Unsupported formats separated from matches", "Jul 24 · 09:17"],
    ["Role profiles generated", "Personal names removed for the white-label demo", "Jul 24 · 09:18"],
  ];
  return (
    <section className="tab-panel">
      <div className="section-heading">
        <div>
          <span className="section-icon">✓</span>
          <h2>Agent Audit</h2>
          <p>Transparent demo trail for {lead.company}.</p>
        </div>
      </div>
      <div className="audit-list">
        {steps.map(([title, body, time], index) => (
          <article key={title}>
            <span>{index + 1}</span>
            <div><strong>{title}</strong><p>{body}</p></div>
            <time>{time}</time>
          </article>
        ))}
      </div>
      <div className="audit-note">
        <strong>Data handling note</strong>
        This prototype uses public company names and fictional commercial data. It contains no original client identifiers,
        employees, product codes, internal scores, or CRM records.
      </div>
    </section>
  );
}

function ProspectingWorkspace({
  lead,
  application,
  region,
  setRegion,
  expandedProspect,
  setExpandedProspect,
  setView,
  setModal,
}: {
  lead: Lead;
  application: Application;
  region: "World" | "China";
  setRegion: (region: "World" | "China") => void;
  expandedProspect: number | null;
  setExpandedProspect: (index: number | null) => void;
  setView: (view: View) => void;
  setModal: (content: ModalContent) => void;
}) {
  const prospects = region === "World" ? worldProspects : chinaProspects;
  return (
    <section className="workspace prospecting-workspace">
      <div className="prospecting-nav">
        <div className="workspace-identity">
          <span className="spark-icon">✦</span>
          <h1>Sales Agent</h1>
        </div>
        <button className="button secondary" onClick={() => setView("lead")}>← Back to {lead.company}</button>
      </div>

      <div className="prospecting-content">
        <section className="prospecting-hero">
          <div className="prospecting-title">
            <span className="product-icon">▧</span>
            <div><small>PRODUCT &amp; APPLICATION</small><h2>{application.name}</h2></div>
          </div>
          <div className="prospecting-facts">
            <div><small>Anchor product</small><strong>{application.products[0]}</strong></div>
            <div><small>Source lead</small><strong>{lead.company}</strong></div>
            <div>
              <small>Region</small>
              <div className="segment-control">
                <button className={region === "World" ? "active" : ""} onClick={() => setRegion("World")}>World</button>
                <button className={region === "China" ? "active" : ""} onClick={() => setRegion("China")}>China</button>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider"><span>✦ Prospecting Results</span></div>

        <section className="prospect-results">
          <div className="section-heading">
            <div>
              <span className="section-icon">✦</span>
              <h2>{region} prospects</h2>
              <p>Real companies with fictional opportunity analysis and role profiles.</p>
            </div>
            <span className="result-count">{prospects.length} companies found</span>
          </div>

          <div className="prospect-list">
            {prospects.map((prospect, index) => {
              const expanded = expandedProspect === index;
              return (
                <article className={`prospect-card ${expanded ? "expanded" : ""}`} key={prospect.name}>
                  <button
                    className="prospect-summary"
                    onClick={() => setExpandedProspect(expanded ? null : index)}
                    aria-expanded={expanded}
                  >
                    <span className="prospect-icon">♟</span>
                    <span>
                      <strong>{prospect.name}</strong>
                      <small>{prospect.description}</small>
                    </span>
                    <span className="ring-score" style={{ "--score": `${prospect.likelihood * 3.6}deg` } as React.CSSProperties}>
                      <b>{prospect.likelihood}%</b>
                    </span>
                    <i>{expanded ? "⌃" : "⌄"}</i>
                  </button>
                  {expanded && (
                    <div className="prospect-body">
                      <div className="prospect-meta">
                        <span><small>INDUSTRY SEGMENT</small><strong>{prospect.segment}</strong></span>
                        <span><small>HEADQUARTERS</small><strong>{prospect.location}</strong></span>
                        <span><small>ESTIMATED VOLUME</small><strong>Medium–high</strong></span>
                      </div>
                      <InfoBlock title="Relevance" body={prospect.fit} />
                      <InfoBlock title="Suggested pilot" body={prospect.program} />
                      <InfoBlock title="Suggested contact approach" body={prospect.approach} />
                      <div className="contact-cards prospect-contact-cards">
                        <ActionInfoCard
                          title="Decision makers"
                          body="Fictional role profiles for outreach."
                          button="View roles"
                          onClick={() =>
                            setModal({
                              title: `Decision makers — ${prospect.name}`,
                              intro: "Role profiles are fictional and must be resolved to real, verified people before outreach.",
                              items: [
                                { title: "Demo contact A — Head of Private Label", body: "Likely sponsor for proposition, margin, and range strategy.", tone: "good" },
                                { title: "Demo contact B — Dairy Category Buyer", body: "Likely owner of product, pricing, samples, and tender process.", tone: "good" },
                                { title: "Demo contact C — Supplier Quality Manager", body: "Likely validator of audits, labels, certificates, and specifications.", tone: "neutral" },
                              ],
                            })
                          }
                        />
                        <ActionInfoCard
                          title="Working with competitors"
                          body="Category alternatives to verify."
                          button="View hypotheses"
                          onClick={() =>
                            setModal({
                              title: `Competitor hypotheses — ${prospect.name}`,
                              intro: "No active supplier relationship is asserted.",
                              items: application.competitors.map((item) => {
                                const [title, body] = item.split(" · ");
                                return { title, body, meta: "Research hypothesis", tone: "warn" as const };
                              }),
                            })
                          }
                        />
                        <ActionInfoCard
                          title="Commercial assessment"
                          body="Illustrative opportunity framing."
                          button="View assessment"
                          onClick={() =>
                            setModal({
                              title: `Commercial assessment — ${prospect.name}`,
                              intro: "Illustrative only; validate through discovery.",
                              items: [
                                { title: "Potential", body: "Multi-SKU private-label or imported range with repeat order potential.", tone: "good" },
                                { title: "Primary risk", body: region === "China" ? "Import, cold-chain, China labeling, and landed-cost complexity." : "Tender competition, specification fit, and incumbent suppliers.", tone: "warn" },
                              ],
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}

function ActionInfoCard({
  title,
  body,
  button,
  onClick,
}: {
  title: string;
  body: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="action-info-card">
      <strong>◉ {title}</strong>
      <p>{body}</p>
      <button onClick={onClick}>{button}</button>
    </div>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="info-block">
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}

function SortButton({
  label,
  field,
  sortKey,
  sortDirection,
  setSort,
}: {
  label: string;
  field: SortKey;
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
  setSort: (key: SortKey) => void;
}) {
  return (
    <button className="sort-button" onClick={() => setSort(field)}>
      {label}
      <span>{sortKey === field ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}</span>
    </button>
  );
}

function AddLeadModal({
  handleAdd,
  close,
}: {
  handleAdd: (event: React.FormEvent<HTMLFormElement>) => void;
  close: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <form className="modal add-modal" onSubmit={handleAdd} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div><span className="eyebrow">MANUAL ENTRY</span><h3>Add a lead</h3></div>
          <button type="button" className="icon-button" onClick={close} aria-label="Close">×</button>
        </div>
        <label>Company name<input name="company" required placeholder="e.g. Retail group" autoFocus /></label>
        <div className="form-grid">
          <label>
            Region
            <select name="region" defaultValue="Europe" aria-label="Region">
              <option>Europe</option><option>MENA</option><option>China</option><option>Global</option>
            </select>
          </label>
          <label>Headquarters<input name="market" placeholder="City, country" /></label>
        </div>
        <label>First application to research<input name="application" placeholder="e.g. Private-label cheese" /></label>
        <p className="form-note">New records are stored only in this browser session.</p>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={close}>Cancel</button>
          <button type="submit" className="button dark">Add lead</button>
        </div>
      </form>
    </div>
  );
}

function InformationModal({ content, close }: { content: ModalContent; close: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <section className="modal information-modal" role="dialog" aria-modal="true" aria-label={content.title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div><span className="eyebrow">SALES RESEARCH</span><h3>{content.title}</h3></div>
          <button type="button" className="icon-button" onClick={close} aria-label="Close">×</button>
        </div>
        <p className="modal-intro">{content.intro}</p>
        <div className="modal-item-list">
          {content.items.map((item, index) => (
            <article className={`modal-item ${item.tone ?? "neutral"}`} key={`${item.title}-${index}`}>
              <div>
                <strong>{item.title}</strong>
                {item.meta && <span>{item.meta}</span>}
              </div>
              {item.body.startsWith("http") ? (
                <a href={item.body} target="_blank" rel="noreferrer">Open official source ↗</a>
              ) : (
                <p>{item.body}</p>
              )}
            </article>
          ))}
        </div>
        <div className="modal-actions"><button className="button dark" onClick={close}>Close</button></div>
      </section>
    </div>
  );
}

function fallbackApplications(lead: Lead): Application[] {
  const base = reweApplications.map((application) => ({
    ...application,
    decisionMakers: application.decisionMakers.map((person) => ({ ...person })),
    products: [...application.products],
    incompatible: [...application.incompatible],
    competitors: [...application.competitors],
    history: [...application.history],
    roadmap: [...application.roadmap] as [string, string, string],
  }));
  base[0].name = lead.application;
  base[0].summary = `Initial portfolio opportunity generated for ${lead.company}.`;
  base[1].name = "Secondary dairy portfolio review";
  return base;
}
