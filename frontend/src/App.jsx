
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Home,
  FileText,
  MessageSquare,
  Database,
  Search,
  Upload,
  Paperclip,
  ArrowUp,
  MoreHorizontal,
  ChevronRight,
  Settings,
  Sparkles,
  CheckCircle2,
  Clock3,
  Plus,
  Command,
  HelpCircle,
  X,
  Menu,
  Trash2,
  Zap,
  BarChart3,
  Circle,
} from "lucide-react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("Home");
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [aiOnline, setAiOnline] = useState(true);
  const fileInputRef = useRef(null);

  const documents = [
    {
      name: "Annual_Report_2024.pdf",
      description: "Financial report and analysis",
      type: "PDF",
      size: "2.4 MB",
      updated: "2 hours ago",
      color: "pink",
    },
    {
      name: "Project_Proposal.pdf",
      description: "Project overview and requirements",
      type: "PDF",
      size: "1.8 MB",
      updated: "5 hours ago",
      color: "orange",
    },
    {
      name: "User_Guide.docx",
      description: "Product documentation and user guide",
      type: "DOCX",
      size: "940 KB",
      updated: "1 day ago",
      color: "purple",
    },
    {
      name: "Research_Paper.pdf",
      description: "Market research and analysis",
      type: "PDF",
      size: "3.2 MB",
      updated: "1 day ago",
      color: "pink",
    },
    {
      name: "Meeting_Notes.docx",
      description: "Team meeting notes and action items",
      type: "DOCX",
      size: "560 KB",
      updated: "2 days ago",
      color: "yellow",
    },
  ];

  const conversations = [
    {
      title: "Annual report key insights",
      text: "Here are the key insights from the annual report...",
      time: "2 hours ago",
    },
    {
      title: "Project proposal summary",
      text: "The project proposal focuses on the following key...",
      time: "5 hours ago",
    },
    {
      title: "User guide quick start",
      text: "Based on the user guide, here's a quick start...",
      time: "1 day ago",
    },
    {
      title: "Meeting notes action items",
      text: "Here are the action items from the meeting notes...",
      time: "2 days ago",
    },
    {
      title: "Research findings overview",
      text: "The research paper highlights several key findings...",
      time: "3 days ago",
    },
  ];

  const filteredDocuments = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return documents;

    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(value) ||
        doc.description.toLowerCase().includes(value)
    );
  }, [search]);

  const filteredConversations = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return conversations;

    return conversations.filter(
      (chat) =>
        chat.title.toLowerCase().includes(value) ||
        chat.text.toLowerCase().includes(value)
    );
  }, [search]);

  const newQuestion = () => {
    setQuestion("");
    setAnswer("");
    setError("");
    setSelectedFile(null);
    setActivePage("Home");
  };

  const askQuestion = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ask/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setAnswer(data.answer);
      setAiOnline(true);
    } catch (err) {
      setError(err.message || "Unable to connect to the AI service.");
      setAiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const openPage = (page) => {
    setActivePage(page);
    setMobileSidebar(false);

    if (page !== "Home") {
      setAnswer("");
      setError("");
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowSettings(false);
        setShowMenu(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#18191C]">
      <div className="flex min-h-screen">

        {/* MOBILE OVERLAY */}
        {mobileSidebar && (
          <div
            className="fixed inset-0 z-40 bg-[#18191C]/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebar(false)}
          />
        )}

        {/* ================= SIDEBAR ================= */}
        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen w-[258px] flex-col border-r border-[#454052] bg-[#2F2B3A] text-white transition-transform duration-300 lg:translate-x-0 ${
            mobileSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* BRAND */}
          <div className="flex h-[82px] items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#8B7CF6] via-[#F472B6] to-[#FB923C] text-white shadow-[0_10px_30px_rgba(139,124,246,0.30)]">
                <Sparkles size={20} strokeWidth={2.2} />

                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#2F2B3A] bg-[#FACC15]" />
              </div>

              <div>
                <h1 className="text-[15px] font-bold tracking-tight">
                  QA Bot
                </h1>

                <p className="mt-0.5 text-[10px] text-[#B3AFBB]">
                  AI Knowledge Workspace
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebar(false)}
              className="rounded-lg p-1.5 text-[#9994A5] hover:bg-white/5 hover:text-white lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* NEW QUESTION */}
          <div className="px-4">
            <button
              onClick={newQuestion}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B7CF6] via-[#A56DF0] to-[#F472B6] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(139,124,246,0.24)] transition hover:brightness-105 hover:shadow-[0_12px_32px_rgba(139,124,246,0.32)] active:scale-[0.98]"
            >
              <Plus size={17} />

              New Question

              <span className="ml-auto hidden text-[9px] text-white/60 xl:block">
                ⌘ N
              </span>
            </button>
          </div>

          {/* NAVIGATION */}
          <div className="mt-8 px-4">
            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8F8A9C]">
              Workspace
            </p>

            <nav className="space-y-1">
              {[
                { name: "Home", icon: Home },
                { name: "Documents", icon: FileText },
                { name: "Chat History", icon: MessageSquare },
                { name: "Knowledge Base", icon: Database },
              ].map((item) => {
                const Icon = item.icon;
                const active = activePage === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => openPage(item.name)}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "bg-[#8B7CF6]/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                        : "text-[#B0ACB9] hover:bg-white/[0.045] hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 h-5 w-[3px] rounded-full bg-gradient-to-b from-[#8B7CF6] via-[#F472B6] to-[#FB923C]" />
                    )}

                    <Icon
                      size={17}
                      strokeWidth={active ? 2.2 : 1.9}
                      className={
                        active
                          ? "text-[#C4B5FD]"
                          : "text-[#8B8795] group-hover:text-[#D8D4E0]"
                      }
                    />

                    <span>{item.name}</span>

                    {item.name === "Knowledge Base" && (
                      <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[#FACC15]/10 px-2 py-1 text-[8px] font-semibold text-[#FDE68A]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" />
                        Ready
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* RECENT CHATS */}
          <div className="mt-8 min-h-0 flex-1 overflow-hidden px-4">
            <div className="mb-3 flex items-center justify-between px-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8F8A9C]">
                Recent Chats
              </p>

              <button
                onClick={() => openPage("Chat History")}
                className="rounded-md p-1 text-[#8F8A9C] hover:bg-white/5 hover:text-white"
              >
                <MoreHorizontal size={15} />
              </button>
            </div>

            <div className="space-y-1">
              {conversations.slice(0, 4).map((chat, index) => (
                <button
                  key={chat.title}
                  onClick={() => {
                    setQuestion(chat.title);
                    setActivePage("Home");
                    setMobileSidebar(false);
                  }}
                  className="group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[0.045]"
                >
                  <MessageSquare
                    size={14}
                    className="mt-0.5 shrink-0 text-[#8B8795] group-hover:text-[#C4B5FD]"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-[#D0CDD6]">
                      {chat.title}
                    </p>

                    <p className="mt-1 text-[9px] text-[#8B8795]">
                      {index === 0
                        ? "2 hours ago"
                        : index === 1
                        ? "5 hours ago"
                        : index === 2
                        ? "1 day ago"
                        : "2 days ago"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* KNOWLEDGE CARD */}
          <div className="mx-4 mb-4 rounded-2xl border border-[#4A4555] bg-[#373242] p-4 shadow-[0_10px_30px_rgba(20,16,30,0.18)]">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B7CF6]/10 text-[#A99CF8]">
                <Database size={15} />
              </div>

              <span className="rounded-full bg-[#FACC15]/10 px-2 py-1 text-[8px] font-semibold text-[#FDE68A]">
                Active
              </span>
            </div>

            <p className="mt-3 text-xs font-semibold text-white">
              Knowledge Base
            </p>

            <p className="mt-1 text-[10px] leading-4 text-[#A5A0AE]">
              12 documents are indexed and ready for AI search.
            </p>

            <button
              onClick={() => openPage("Knowledge Base")}
              className="mt-3 text-[10px] font-semibold text-[#C4B5FD] hover:text-white"
            >
              View details →
            </button>
          </div>

          {/* USER */}
          <div className="border-t border-[#454052] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#8B7CF6] to-[#F472B6] text-xs font-bold text-white shadow-sm">
                AI
              </div>

              <div className="flex-1">
                <p className="text-xs font-semibold text-white">
                  QA Bot
                </p>

                <p className="text-[9px] text-[#8B8795]">
                  Workspace
                </p>
              </div>

              <button
                onClick={() => setShowSettings(true)}
                className="rounded-lg p-1.5 text-[#8B8795] hover:bg-white/5 hover:text-white"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="min-h-screen flex-1 lg:ml-[258px]">

          {/* TOPBAR */}
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#E3E4E7] bg-white/90 px-5 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebar(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E1E3E6] bg-white text-[#6B7078] lg:hidden"
              >
                <Menu size={18} />
              </button>

              <div className="relative hidden w-[420px] md:block">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA0A8]"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents and conversations..."
                  className="h-10 w-full rounded-xl border border-[#E1E3E6] bg-[#F7F7F8] pl-10 pr-14 text-xs text-[#18191C] outline-none transition placeholder:text-[#9AA0A8] focus:border-[#8B7CF6] focus:bg-white focus:ring-4 focus:ring-[#8B7CF6]/10"
                />

                <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-[#E1E3E6] bg-white px-1.5 py-1 text-[9px] font-medium text-[#9AA0A8] shadow-sm">
                  <Command size={10} />
                  K
                </div>
              </div>

              <div className="md:hidden">
                <p className="text-sm font-bold">
                  QA Bot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <div
                className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 sm:flex ${
                  aiOnline
                    ? "border-[#DDD8FC] bg-[#F6F4FF]"
                    : "border-red-100 bg-red-50"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    aiOnline ? "bg-[#8B7CF6]" : "bg-red-500"
                  }`}
                />

                <span
                  className={`text-[10px] font-semibold ${
                    aiOnline ? "text-[#6659B5]" : "text-red-600"
                  }`}
                >
                  {aiOnline ? "AI Online" : "Offline"}
                </span>
              </div>

              <button
                onClick={() => setShowSettings(true)}
                className="hidden text-xs font-semibold text-[#6B7078] hover:text-[#8B7CF6] sm:block"
              >
                Settings
              </button>

              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#8B7CF6] to-[#F472B6] text-xs font-bold text-white shadow-sm">
                A
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-lg p-1.5 text-[#7D828A] hover:bg-[#F1F2F3] hover:text-[#18191C]"
                >
                  <MoreHorizontal size={19} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-10 z-50 w-40 rounded-xl border border-[#E1E3E6] bg-white p-1.5 shadow-[0_15px_40px_rgba(24,25,28,0.12)]">
                    <button
                      onClick={() => {
                        setSearch("");
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#4B5057] hover:bg-[#F7F7F8]"
                    >
                      <Search size={14} />
                      Clear search
                    </button>

                    <button
                      onClick={() => {
                        newQuestion();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#4B5057] hover:bg-[#F7F7F8]"
                    >
                      <Plus size={14} />
                      New question
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="px-5 pb-12 pt-6 sm:px-8 sm:pt-8">

            {/* PAGE HEADER */}
            {activePage !== "Home" && (
              <section className="mb-6">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B7CF6]">
                      <Circle size={7} fill="currentColor" />
                      Workspace
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-[#18191C]">
                      {activePage}
                    </h2>

                    <p className="mt-1 text-sm text-[#6B7078]">
                      {activePage === "Documents" &&
                        "Manage and explore your indexed documents."}

                      {activePage === "Chat History" &&
                        "Review previous conversations with your AI workspace."}

                      {activePage === "Knowledge Base" &&
                        "Monitor the documents available to your AI assistant."}
                    </p>
                  </div>

                  <button
                    onClick={newQuestion}
                    className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B7CF6] to-[#F472B6] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 hover:shadow-md sm:flex"
                  >
                    <Plus size={15} />
                    New Question
                  </button>
                </div>
              </section>
            )}

            {/* ================= HOME ================= */}
            {activePage === "Home" && (
              <>
                {/* HERO */}
                <section className="relative overflow-hidden rounded-[22px] border border-[#E1E3E6] bg-gradient-to-br from-white via-white to-[#F7F4FF] px-6 py-7 shadow-[0_8px_30px_rgba(24,25,28,0.045)] sm:px-8 sm:py-8">

                  <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#8B7CF6]/10 blur-3xl" />

                  <div className="pointer-events-none absolute right-[25%] top-20 h-36 w-36 rounded-full bg-[#F472B6]/8 blur-3xl" />

                  <div className="pointer-events-none absolute bottom-[-50px] left-[40%] h-32 w-32 rounded-full bg-[#FB923C]/8 blur-3xl" />

                  <div className="relative z-10 max-w-[720px]">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDD8FC] bg-[#F6F4FF] px-3 py-1.5">
                      <Sparkles
                        size={12}
                        className="text-[#8B7CF6]"
                      />

                      <span className="text-[10px] font-bold text-[#6659B5]">
                        AI KNOWLEDGE WORKSPACE
                      </span>
                    </div>

                    <h2 className="text-[32px] font-bold leading-[1.12] tracking-[-0.035em] text-[#18191C] sm:text-[40px]">
                      Ask your documents.
                      <br />

                      <span className="bg-gradient-to-r from-[#7C6CE8] via-[#D85D9C] to-[#E8793D] bg-clip-text text-transparent">
                        Get intelligent answers.
                      </span>
                    </h2>

                    <p className="mt-4 max-w-[610px] text-[13px] leading-6 text-[#6B7078] sm:text-[14px]">
                      Search your knowledge base, understand complex
                      documents, and get context-aware answers in seconds.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-lg border border-[#E1E3E6] bg-white px-2.5 py-1.5 text-[9px] font-semibold text-[#6B7078] shadow-sm">
                        12 Documents
                      </span>

                      <span className="rounded-lg border border-[#DDD8FC] bg-[#FAF9FF] px-2.5 py-1.5 text-[9px] font-semibold text-[#7164C1] shadow-sm">
                        AI Search
                      </span>

                      <span className="rounded-lg border border-[#F6D5E3] bg-[#FFF8FB] px-2.5 py-1.5 text-[9px] font-semibold text-[#C65383] shadow-sm">
                        Context Aware
                      </span>
                    </div>
                  </div>

                  {/* DECORATIVE DOCUMENTS */}
                  <div className="absolute right-10 top-7 hidden h-[175px] w-[245px] lg:block">

                    <div className="absolute left-4 top-9 h-[118px] w-[86px] rotate-[-8deg] rounded-xl border border-[#E1E3E6] bg-white p-3 shadow-[0_18px_40px_rgba(24,25,28,0.10)]">
                      <div className="mb-3 flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF1F7] text-[8px] font-bold text-[#F472B6]">
                        PDF
                      </div>

                      <div className="space-y-2">
                        <div className="h-1.5 w-12 rounded-full bg-[#E5E7EB]" />
                        <div className="h-1.5 w-16 rounded-full bg-[#E5E7EB]" />
                        <div className="h-1.5 w-10 rounded-full bg-[#E5E7EB]" />
                        <div className="h-1.5 w-14 rounded-full bg-[#E5E7EB]" />
                      </div>
                    </div>

                    <div className="absolute left-[92px] top-1 h-[135px] w-[98px] rotate-[5deg] rounded-xl border border-[#E1E3E6] bg-white p-3 shadow-[0_20px_45px_rgba(24,25,28,0.12)]">
                      <div className="mb-3 flex h-6 w-6 items-center justify-center rounded-md bg-[#F5F3FF] text-[9px] font-bold text-[#8B7CF6]">
                        W
                      </div>

                      <div className="space-y-2">
                        <div className="h-1.5 w-14 rounded-full bg-[#E5E7EB]" />
                        <div className="h-1.5 w-16 rounded-full bg-[#E5E7EB]" />
                        <div className="h-1.5 w-11 rounded-full bg-[#E5E7EB]" />
                        <div className="h-1.5 w-14 rounded-full bg-[#E5E7EB]" />
                      </div>
                    </div>

                    <div className="absolute right-0 top-16 h-[98px] w-[74px] rotate-[9deg] rounded-xl border border-[#E1E3E6] bg-white p-3 shadow-[0_18px_35px_rgba(24,25,28,0.09)]">
                      <div className="mb-3 flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF7ED] text-[9px] font-bold text-[#FB923C]">
                        X
                      </div>

                      <div className="space-y-2">
                        <div className="h-1.5 w-9 rounded-full bg-[#E5E7EB]" />
                        <div className="h-1.5 w-12 rounded-full bg-[#E5E7EB]" />
                        <div className="h-1.5 w-8 rounded-full bg-[#E5E7EB]" />
                      </div>
                    </div>

                    <div className="absolute right-2 top-24 rounded-lg border border-[#DDD8FC] bg-white px-3 py-2 shadow-[0_8px_25px_rgba(24,25,28,0.10)]">
                      <div className="flex items-center gap-2">
                        <Sparkles
                          size={12}
                          className="text-[#8B7CF6]"
                        />

                        <span className="text-[8px] font-semibold text-[#4B5057]">
                          Context found
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* QUESTION BOX */}
                <section className="relative z-10 mt-5 overflow-hidden rounded-[20px] border border-[#DDE0E3] bg-white shadow-[0_12px_35px_rgba(24,25,28,0.07)]">

                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F5F3FF] to-[#FFF1F7] text-[#8B7CF6]">
                        <Sparkles size={17} />
                      </div>

                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={3}
                        placeholder="Ask anything about your documents..."
                        className="w-full resize-none border-none bg-transparent pt-1 text-sm leading-6 text-[#18191C] outline-none placeholder:text-[#9AA0A8]"
                      />
                    </div>

                    {selectedFile && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#E0E3E6] bg-[#F7F8F9] px-3 py-2">
                        <FileText
                          size={13}
                          className="text-[#8B7CF6]"
                        />

                        <span className="max-w-[220px] truncate text-[10px] font-semibold text-[#4B5057]">
                          {selectedFile.name}
                        </span>

                        <button
                          onClick={() => setSelectedFile(null)}
                          className="ml-1 text-[#98A0A8] hover:text-red-500"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-[#E8EAEC] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFile}
                        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                      />

                      <button
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="flex items-center gap-2 text-[11px] font-medium text-[#6B7078] transition hover:text-[#8B7CF6]"
                      >
                        <Paperclip size={14} />
                        Attach files
                      </button>

                      <div className="h-4 w-px bg-[#E1E3E6]" />

                      <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-[#6B7078]">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="peer sr-only"
                        />

                        <span className="relative h-5 w-9 rounded-full bg-[#D4D7DB] transition peer-checked:bg-[#8B7CF6]">
                          <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-4" />
                        </span>

                        Search all documents
                      </label>
                    </div>

                    <button
                      onClick={askQuestion}
                      disabled={loading || !question.trim()}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B7CF6] via-[#A56DF0] to-[#F472B6] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_7px_18px_rgba(139,124,246,0.22)] transition hover:brightness-105 hover:shadow-[0_9px_24px_rgba(139,124,246,0.32)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? (
                        <>
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Thinking
                        </>
                      ) : (
                        <>
                          Ask
                          <ArrowUp size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </section>

                <p className="mt-2 px-2 text-[9px] text-[#9AA0A8]">
                  Press Enter to send · Shift + Enter for new line
                </p>

                {/* ERROR */}
                {error && (
                  <div className="mt-5 rounded-2xl border border-[#FECACA] bg-[#FFF7F7] p-4">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FEE2E2] text-red-500">
                        <X size={15} />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-red-700">
                          Something went wrong
                        </p>

                        <p className="mt-1 text-xs text-red-600">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ANSWER */}
                {answer && !loading && (
                  <section className="mt-6 overflow-hidden rounded-[20px] border border-[#DDE0E3] bg-white shadow-[0_8px_30px_rgba(24,25,28,0.045)]">
                    <div className="flex items-center gap-3 border-b border-[#E8EAEC] px-5 py-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#8B7CF6]">
                        <Sparkles size={15} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#18191C]">
                          AI Answer
                        </p>

                        <p className="text-[9px] text-[#9AA0A8]">
                          Generated from your knowledge base
                        </p>
                      </div>

                      <span className="ml-auto hidden items-center gap-1 rounded-full bg-[#F5F3FF] px-2.5 py-1 text-[9px] font-semibold text-[#6659B5] sm:flex">
                        <CheckCircle2 size={11} />
                        Context found
                      </span>
                    </div>

                    <div className="px-6 py-5">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-[#4B5057]">
                        {answer}
                      </p>
                    </div>
                  </section>
                )}

                {/* BOTTOM CARDS */}
                {!answer && (
                  <>
                    <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">

                      {/* DOCUMENTS */}
                      <section className="overflow-hidden rounded-[20px] border border-[#E1E3E6] bg-white shadow-[0_5px_20px_rgba(24,25,28,0.025)]">
                        <div className="flex items-center justify-between border-b border-[#E8EAEC] px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF1F7] text-[#F472B6]">
                              <FileText size={16} />
                            </div>

                            <div>
                              <h3 className="text-sm font-bold text-[#18191C]">
                                Recent Documents
                              </h3>

                              <p className="text-[9px] text-[#9AA0A8]">
                                Latest indexed files
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => openPage("Documents")}
                            className="flex items-center gap-1 text-[10px] font-semibold text-[#8B7CF6] hover:text-[#6659B5]"
                          >
                            View all
                            <ChevronRight size={13} />
                          </button>
                        </div>

                        <div>
                          {filteredDocuments
                            .slice(0, 5)
                            .map((doc) => (
                              <div
                                key={doc.name}
                                className="group flex items-center gap-3 border-b border-[#F0F1F2] px-5 py-3.5 transition hover:bg-[#FAFAFB]"
                              >
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                    doc.color === "pink"
                                      ? "bg-[#FFF1F7] text-[#F472B6]"
                                      : doc.color === "orange"
                                      ? "bg-[#FFF7ED] text-[#FB923C]"
                                      : doc.color === "yellow"
                                      ? "bg-[#FEFCE8] text-[#CA8A04]"
                                      : "bg-[#F5F3FF] text-[#8B7CF6]"
                                  }`}
                                >
                                  <FileText size={16} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[11px] font-semibold text-[#34373C]">
                                    {doc.name}
                                  </p>

                                  <p className="mt-0.5 truncate text-[9px] text-[#9AA0A8]">
                                    {doc.description}
                                  </p>
                                </div>

                                <span
                                  className={`hidden rounded-md px-2 py-1 text-[8px] font-bold sm:block ${
                                    doc.type === "PDF"
                                      ? "bg-[#FFF1F7] text-[#D85D91]"
                                      : "bg-[#F5F3FF] text-[#796BE0]"
                                  }`}
                                >
                                  {doc.type}
                                </span>

                                <span className="hidden w-16 text-right text-[9px] text-[#9AA0A8] md:block">
                                  {doc.size}
                                </span>

                                <button
                                  onClick={() =>
                                    setSelectedFile({
                                      name: doc.name,
                                    })
                                  }
                                  className="text-[#B0B4BA] opacity-0 transition hover:text-[#8B7CF6] group-hover:opacity-100"
                                >
                                  <MoreHorizontal size={15} />
                                </button>
                              </div>
                            ))}
                        </div>
                      </section>

                      {/* CONVERSATIONS */}
                      <section className="overflow-hidden rounded-[20px] border border-[#E1E3E6] bg-white shadow-[0_5px_20px_rgba(24,25,28,0.025)]">
                        <div className="flex items-center justify-between border-b border-[#E8EAEC] px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#8B7CF6]">
                              <MessageSquare size={16} />
                            </div>

                            <div>
                              <h3 className="text-sm font-bold text-[#18191C]">
                                Recent Conversations
                              </h3>

                              <p className="text-[9px] text-[#9AA0A8]">
                                Continue where you left off
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => openPage("Chat History")}
                            className="flex items-center gap-1 text-[10px] font-semibold text-[#8B7CF6]"
                          >
                            View all
                            <ChevronRight size={13} />
                          </button>
                        </div>

                        <div>
                          {filteredConversations
                            .slice(0, 5)
                            .map((chat) => (
                              <button
                                key={chat.title}
                                onClick={() => {
                                  setQuestion(chat.title);
                                  setAnswer("");
                                  setActivePage("Home");
                                }}
                                className="group flex w-full items-center gap-3 border-b border-[#F0F1F2] px-5 py-3.5 text-left transition hover:bg-[#FAFAFB]"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F3FF] text-[#8B7CF6]">
                                  <MessageSquare size={13} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[10px] font-semibold text-[#34373C]">
                                    {chat.title}
                                  </p>

                                  <p className="mt-0.5 truncate text-[9px] text-[#9AA0A8]">
                                    {chat.text}
                                  </p>

                                  <p className="mt-1 text-[8px] text-[#B0B4BA]">
                                    {chat.time}
                                  </p>
                                </div>

                                <ChevronRight
                                  size={14}
                                  className="shrink-0 text-[#C8CBD0] transition group-hover:translate-x-0.5 group-hover:text-[#8B7CF6]"
                                />
                              </button>
                            ))}
                        </div>
                      </section>
                    </div>

                    {/* STATS */}
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                      <div className="rounded-2xl border border-[#E1E3E6] bg-white p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#8B7CF6]">
                            <Database size={16} />
                          </div>

                          <div>
                            <p className="text-lg font-bold text-[#18191C]">
                              12
                            </p>

                            <p className="text-[9px] text-[#9AA0A8]">
                              Documents indexed
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#E1E3E6] bg-white p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#FB923C]">
                            <Zap size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#18191C]">
                              AI Ready
                            </p>

                            <p className="text-[9px] text-[#9AA0A8]">
                              Knowledge base available
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => openPage("Knowledge Base")}
                        className="rounded-2xl border border-[#E1E3E6] bg-white p-4 text-left transition hover:border-[#DDD8FC] hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEFCE8] text-[#CA8A04]">
                            <HelpCircle size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#18191C]">
                              Need help?
                            </p>

                            <p className="text-[9px] text-[#9AA0A8]">
                              Explore your knowledge base
                            </p>
                          </div>

                          <ChevronRight
                            size={15}
                            className="ml-auto text-[#9AA0A8]"
                          />
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ================= DOCUMENTS ================= */}
            {activePage === "Documents" && (
              <section className="overflow-hidden rounded-[20px] border border-[#E1E3E6] bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#E8EAEC] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold">
                      All Documents
                    </h3>

                    <p className="mt-1 text-[10px] text-[#9AA0A8]">
                      {filteredDocuments.length} indexed documents available
                    </p>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B7CF6] to-[#F472B6] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:brightness-105 hover:shadow-md"
                  >
                    <Upload size={14} />
                    Upload document
                  </button>
                </div>

                <div>
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center gap-4 border-b border-[#F0F1F2] px-5 py-4 hover:bg-[#FAFAFB]"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          doc.type === "PDF"
                            ? "bg-[#FFF1F7] text-[#F472B6]"
                            : "bg-[#F5F3FF] text-[#8B7CF6]"
                        }`}
                      >
                        <FileText size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold">
                          {doc.name}
                        </p>

                        <p className="mt-1 text-[10px] text-[#9AA0A8]">
                          {doc.description}
                        </p>
                      </div>

                      <span className="hidden text-[10px] text-[#9AA0A8] sm:block">
                        {doc.size}
                      </span>

                      <span className="hidden text-[10px] text-[#9AA0A8] md:block">
                        {doc.updated}
                      </span>

                      <button className="rounded-lg p-2 text-[#9AA0A8] hover:bg-[#F1F2F3] hover:text-[#8B7CF6]">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ================= CHAT HISTORY ================= */}
            {activePage === "Chat History" && (
              <section className="overflow-hidden rounded-[20px] border border-[#E1E3E6] bg-white shadow-sm">
                <div className="border-b border-[#E8EAEC] px-5 py-5">
                  <h3 className="text-sm font-bold">
                    Conversation History
                  </h3>

                  <p className="mt-1 text-[10px] text-[#9AA0A8]">
                    Your recent questions and AI interactions.
                  </p>
                </div>

                {filteredConversations.map((chat) => (
                  <button
                    key={chat.title}
                    onClick={() => {
                      setQuestion(chat.title);
                      setActivePage("Home");
                    }}
                    className="group flex w-full items-center gap-4 border-b border-[#F0F1F2] px-5 py-4 text-left hover:bg-[#FAFAFB]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#8B7CF6]">
                      <MessageSquare size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {chat.title}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-[#9AA0A8]">
                        {chat.text}
                      </p>

                      <p className="mt-1 text-[9px] text-[#B0B4BA]">
                        {chat.time}
                      </p>
                    </div>

                    <ChevronRight
                      size={16}
                      className="text-[#C4C8CD] group-hover:text-[#8B7CF6]"
                    />
                  </button>
                ))}
              </section>
            )}

            {/* ================= KNOWLEDGE BASE ================= */}
            {activePage === "Knowledge Base" && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  <div className="rounded-2xl border border-[#E1E3E6] bg-white p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#8B7CF6]">
                      <Database size={18} />
                    </div>

                    <p className="mt-4 text-2xl font-bold">
                      12
                    </p>

                    <p className="mt-1 text-[10px] text-[#9AA0A8]">
                      Indexed documents
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E1E3E6] bg-white p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1F7] text-[#F472B6]">
                      <BarChart3 size={18} />
                    </div>

                    <p className="mt-4 text-2xl font-bold">
                      98%
                    </p>

                    <p className="mt-1 text-[10px] text-[#9AA0A8]">
                      Search availability
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E1E3E6] bg-white p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEFCE8] text-[#CA8A04]">
                      <Clock3 size={18} />
                    </div>

                    <p className="mt-4 text-sm font-bold">
                      Updated today
                    </p>

                    <p className="mt-1 text-[10px] text-[#9AA0A8]">
                      Knowledge base status
                    </p>
                  </div>
                </div>

                <section className="mt-5 rounded-[20px] border border-[#E1E3E6] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold">
                        Knowledge Base Status
                      </h3>

                      <p className="mt-1 text-[10px] text-[#9AA0A8]">
                        Your AI assistant is ready to search indexed content.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-[#FEFCE8] px-3 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#FACC15]" />

                      <span className="text-[9px] font-bold text-[#A16207]">
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E8EAEC]">
                    <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-[#8B7CF6] via-[#F472B6] to-[#FB923C]" />
                  </div>

                  <p className="mt-2 text-[9px] text-[#9AA0A8]">
                    98% of your indexed content is available for AI retrieval.
                  </p>
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {/* ================= SETTINGS MODAL ================= */}
      {showSettings && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#18191C]/45 p-5 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
        >
          <div
            className="w-full max-w-md rounded-[22px] border border-[#E1E3E6] bg-white p-6 shadow-[0_25px_80px_rgba(24,25,28,0.20)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#8B7CF6]">
                  <Settings size={18} />
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  Workspace Settings
                </h3>

                <p className="mt-1 text-xs text-[#9AA0A8]">
                  Manage your QA Bot workspace preferences.
                </p>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-2 text-[#9AA0A8] hover:bg-[#F1F2F3] hover:text-[#18191C]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-[#E5E7E9] p-4">
                <div>
                  <p className="text-xs font-semibold">
                    AI status
                  </p>

                  <p className="mt-1 text-[9px] text-[#9AA0A8]">
                    Show connection status
                  </p>
                </div>

                <span className="rounded-full bg-[#F5F3FF] px-2.5 py-1 text-[9px] font-bold text-[#6659B5]">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#E5E7E9] p-4">
                <div>
                  <p className="text-xs font-semibold">
                    Indexed documents
                  </p>

                  <p className="mt-1 text-[9px] text-[#9AA0A8]">
                    Current knowledge base
                  </p>
                </div>

                <span className="text-xs font-bold">
                  12
                </span>
              </div>

              <button
                onClick={() => {
                  setQuestion("");
                  setAnswer("");
                  setError("");
                  setShowSettings(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-[#F3D4D4] p-4 text-left text-red-600 hover:bg-[#FFF8F8]"
              >
                <Trash2 size={16} />

                <div>
                  <p className="text-xs font-semibold">
                    Clear current session
                  </p>

                  <p className="mt-1 text-[9px] text-red-400">
                    Remove the current question and answer.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
