/* ---------------------------------------------------------------
   TOKENS
----------------------------------------------------------------*/
const COLORS = {
    brand: "#6f54e8",
    brandDark: "#5638d1",
    brandLight: "#F3F0FF",
    bg: "#FAFAFB",
    text: "#111827",
    textSoft: "#6B7280",
  };
  
  const STATUS_META = {
    new:       { label: "New",       color: "#3B82F6", bg: "#EFF6FF" },
    contacted: { label: "Contacted", color: "#F59E0B", bg: "#FFFBEB" },
    qualified: { label: "Qualified", color: "#6f54e8", bg: "#F3F0FF" },
    hot:       { label: "Hot",       color: "#EF4444", bg: "#FEF2F2" },
    cold:      { label: "Cold",      color: "#9CA3AF", bg: "#F9FAFB" },
    converted: { label: "Converted", color: "#10B981", bg: "#ECFDF5" },
  };

  /* ---------------------------------------------------------------
   API CLIENT
---------------------------------------------------------------*/
const API_URL = "http://localhost:5000/api/v1";

async function apiCall(method, endpoint, body = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (state.accessToken) {
    headers["Authorization"] = `Bearer ${state.accessToken}`;
  }
  
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "API error");
    return data.data || data;
  } catch (err) {
    console.error(err);
    toast(`Error: ${err.message}`);
    return null;
  }
}
  
  /* ---------------------------------------------------------------
     MOCK DATA
  ----------------------------------------------------------------*/
  const seedLeads = [
    {
      id: "L-1042", name: "Rohit Sharma", phone: "+91 98200 11234", source: "ad",
      status: "hot", budget: "₹45L–55L", intent: "Buying 2BHK, ready to move", timeline: "Within 2 weeks",
      language: "hi", lastContactedAt: "12 min ago",
      summary: "High urgency — actively viewing properties this week, financing pre-approved.",
      conversation: [
        { sender: "bot", message: "Hi Rohit! Thanks for your interest in Skyline Residences. Kya main aapko 2 min mein kuch sawaal pooch sakta hoon taaki sahi property dikha sakoon?", t: "10:02 AM" },
        { sender: "lead", message: "Haan bilkul, poochiye.", t: "10:03 AM" },
        { sender: "bot", message: "Great! Budget range kya soch rahe hain aap?", t: "10:03 AM" },
        { sender: "lead", message: "45 se 55 lakh tak dekh sakte hain.", t: "10:04 AM" },
        { sender: "bot", message: "Perfect. Aur kab tak move-in karna chahte hain?", t: "10:04 AM" },
        { sender: "lead", message: "Jaldi hi, 2 hafte mein decide karna hai.", t: "10:05 AM" },
        { sender: "rep", message: "Rohit, main Ananya hoon — calling you in 5 mins to shortlist 3 options for you.", t: "10:11 AM" },
      ],
    },
    {
      id: "L-1041", name: "Priya Menon", phone: "+91 90040 55210", source: "form",
      status: "qualified", budget: "₹18k/course", intent: "UPSC coaching, comparing institutes", timeline: "This month",
      language: "en", lastContactedAt: "1 hr ago",
      summary: "Comparing 2 other institutes, price-sensitive, needs EMI info.",
      conversation: [
        { sender: "bot", message: "Hi Priya! Thanks for reaching out about our UPSC batch. Mind if I ask a couple of quick questions?", t: "9:14 AM" },
        { sender: "lead", message: "Sure go ahead", t: "9:15 AM" },
        { sender: "bot", message: "What's your target start month, and are you open to EMI options?", t: "9:15 AM" },
        { sender: "lead", message: "Starting this month if possible. EMI would help, budget is tight.", t: "9:17 AM" },
      ],
    },
    {
      id: "L-1039", name: "Arjun Patel", phone: "+91 99870 30988", source: "referral",
      status: "contacted", budget: "—", intent: "General enquiry, not urgent", timeline: "Not specified",
      language: "en", lastContactedAt: "5 hr ago",
      summary: "Early-stage enquiry, no budget or timeline shared yet.",
      conversation: [
        { sender: "bot", message: "Hi Arjun! Saw you were referred by Neha — happy to help. What are you looking for?", t: "6:40 AM" },
        { sender: "lead", message: "Just exploring for now, not in a rush", t: "6:52 AM" },
      ],
    },
    {
      id: "L-1035", name: "Sneha Kulkarni", phone: "+91 88790 44210", source: "manual",
      status: "cold", budget: "₹8k", intent: "Skincare consult, went silent", timeline: "—",
      language: "en", lastContactedAt: "2 days ago",
      summary: "Stopped responding after pricing was shared. Follow-up scheduled.",
      conversation: [
        { sender: "bot", message: "Hi Sneha! Following up on your skincare consultation request — still interested?", t: "Mon, 4:20 PM" },
        { sender: "lead", message: "Yes, what's the pricing?", t: "Mon, 4:31 PM" },
        { sender: "bot", message: "Our starter consult is ₹8,000, includes a 2-week follow-up. Want me to lock a slot?", t: "Mon, 4:32 PM" },
      ],
    },
    {
      id: "L-1030", name: "Vikram Desai", phone: "+91 97690 12456", source: "ad",
      status: "converted", budget: "₹32L", intent: "Closed — 1BHK booked", timeline: "Done",
      language: "en", lastContactedAt: "4 days ago",
      summary: "Deal closed. Token amount paid.",
      conversation: [
        { sender: "rep", message: "Congrats on booking your 1BHK, Vikram! Sending the agreement copy now.", t: "Fri, 11:02 AM" },
        { sender: "lead", message: "Thank you so much for the quick help!", t: "Fri, 11:10 AM" },
      ],
    },
  ];
  
  const defaultQuestions = [
    { id: 1, label: "What's your budget range?", field: "budget" },
    { id: 2, label: "What's your intent / what are you looking for?", field: "intent" },
    { id: 3, label: "What's your ideal timeline?", field: "timeline" },
  ];
  
  /* ---------------------------------------------------------------
     STATE
  ----------------------------------------------------------------*/
  const state = {
    page: "landing",
    leads: [{ _id: "1", name: "Test Lead", phone: "9876543210", status: "hot" }],
    businessName: "Demo",
    accessToken: localStorage.getItem("accessToken"),  // ✅ NEW
    userId: localStorage.getItem("userId"),  // ✅ NEW
    activeLeadId: null,
    businessName: "",
    toastMsg: null,
    toastTimer: null,
    questions: JSON.parse(JSON.stringify(defaultQuestions)),
    followupHrs: 24,
    notifCount: 1,
  
    statusFilter: "all",
    searchQuery: "",
  
    noteDraft: "",
    msgDraft: "",
    questionDraft: "",
  
    authForm: { name: "", email: "", password: "" },
    intakeForm: { name: "", phone: "", source: "ad", message: "" },
  };

  function loggedIn() { return !!state.businessName; }
  
  /* ---------------------------------------------------------------
     RE-RENDER (preserves focus + cursor position across full re-draws,
     since we redraw via innerHTML rather than diffing a virtual DOM)
  ----------------------------------------------------------------*/
  function rerender() {
    const active = document.activeElement;
    const activeId = active && active.id;
    const selStart = (active && typeof active.selectionStart === "number") ? active.selectionStart : null;
    const selEnd = (active && typeof active.selectionEnd === "number") ? active.selectionEnd : null;
  
    renderApp();
  
    if (window.lucide) lucide.createIcons();
  
    if (activeId) {
      const el = document.getElementById(activeId);
      if (el) {
        el.focus();
        if (selStart !== null && el.setSelectionRange) {
          try { el.setSelectionRange(selStart, selEnd); } catch (e) {}
        }
      }
    }
  }
  
  /* ---------------------------------------------------------------
     SMALL PRIMITIVES
  ----------------------------------------------------------------*/
  function badgeHTML(status) {
    const m = STATUS_META[status] || STATUS_META.new;
    return `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style="color:${m.color};background:${m.bg}">
        <span class="w-1.5 h-1.5 rounded-full" style="background:${m.color}"></span>${m.label}
      </span>`;
  }
  
  function toastHTML() {
    if (!state.toastMsg) return "";
    return `
      <div id="toast" class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium" style="background:${COLORS.text}">
        <i data-lucide="check-circle-2" style="width:18px;height:18px;color:#34D399"></i>
        ${escapeHTML(state.toastMsg)}
        <button onclick="dismissToast()"><i data-lucide="x" style="width:14px;height:14px;opacity:0.6"></i></button>
      </div>`;
  }
  
  function logoHTML(size) {
    size = size || 22;
    return `
      <div class="flex items-center gap-2">
        <div class="flex items-center justify-center rounded-lg" style="width:${size + 14}px;height:${size + 14}px;background:${COLORS.brand}">
          <i data-lucide="zap" style="width:${size}px;height:${size}px;color:white;stroke-width:2.4"></i>
        </div>
        <span style="font-family:'Sora',sans-serif" class="font-bold text-[17px] text-gray-900">LeadRevive <span style="color:${COLORS.brand}">AI</span></span>
      </div>`;
  }
  
  function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
  
  /* ---------------------------------------------------------------
     LANDING PAGE
  ----------------------------------------------------------------*/
  function landingHTML() {
    const mockCards = seedLeads.slice(0, 3).map(l => `
      <div class="rounded-xl border border-gray-100 p-3">
        <div class="flex justify-between items-start mb-2">
          <span class="font-semibold text-sm text-gray-900">${escapeHTML(l.name)}</span>
          ${badgeHTML(l.status)}
        </div>
        <p class="text-xs text-gray-500 line-clamp-2">${escapeHTML(l.summary)}</p>
      </div>`).join("");
  
    const features = [
      { icon: "message-square", title: "Instant AI qualification", body: "Bot asks budget, intent, timeline — in Hindi or English — the moment a lead lands." },
      { icon: "flame", title: "Hot / Warm / Cold scoring", body: "Every lead is triaged automatically so your team calls the right person first." },
      { icon: "clock", title: "Auto follow-up", body: "Cold leads get nudged on a schedule you set, with zero manual chasing." },
    ].map(f => `
      <div class="p-5 rounded-xl bg-white border border-gray-100">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style="background:${COLORS.brandLight}">
          <i data-lucide="${f.icon}" style="width:18px;height:18px;color:${COLORS.brand}"></i>
        </div>
        <h3 style="font-family:'Sora',sans-serif" class="font-semibold text-gray-900 mb-1">${f.title}</h3>
        <p class="text-sm text-gray-500 leading-relaxed">${f.body}</p>
      </div>`).join("");
  
    return `
      <div style="background:${COLORS.bg};min-height:100vh">
        <header class="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          ${logoHTML()}
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" class="hover:text-gray-900">Features</a>
            <button onclick="go('pricing')" class="hover:text-gray-900">Pricing</button>
            <button onclick="go('login')" class="hover:text-gray-900">Login</button>
          </nav>
          <button onclick="go('signup')" class="px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm" style="background:${COLORS.brand}">
            Get Started
          </button>
        </header>
  
        <section id="hero" class="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style="background:${COLORS.brandLight};color:${COLORS.brandDark}">
            <i data-lucide="flame" style="width:13px;height:13px"></i> The average lead goes cold in 5 minutes
          </div>
          <h1 style="font-family:'Sora',sans-serif;color:${COLORS.text}" class="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Never let a lead<br />
            go <span style="color:${COLORS.brand}">cold</span> again.
          </h1>
          <p class="text-lg text-gray-500 max-w-xl mx-auto mb-9 leading-relaxed">
            LeadRevive AI replies to every inbound lead in seconds, asks the qualifying
            questions your team doesn't have time to ask, and tells you exactly who to call first.
          </p>
          <div class="flex items-center justify-center gap-3">
            <button onclick="go('signup')" class="px-6 py-3 rounded-lg text-white font-semibold shadow-md flex items-center gap-2" style="background:${COLORS.brand}">
              Start Free <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
            </button>
            <button onclick="go('intake')" class="px-6 py-3 rounded-lg font-semibold border border-gray-200 text-gray-700 bg-white">
              See a live demo
            </button>
          </div>
  
          <div class="mt-16 rounded-2xl border border-gray-200 shadow-xl bg-white overflow-hidden text-left">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <span class="w-2.5 h-2.5 rounded-full bg-red-300"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-300"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-green-300"></span>
            </div>
            <div class="p-5 grid grid-cols-3 gap-3">
              ${mockCards}
            </div>
          </div>
        </section>
  
        <section class="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
          ${features}
        </section>
      </div>`;
  }
  
  /* ---------------------------------------------------------------
     AUTH PAGES
  ----------------------------------------------------------------*/
  function authPageHTML() {
    const isLogin = state.page === "login";
    return `
      <div class="min-h-screen flex items-center justify-center px-6" style="background:${COLORS.bg}">
        <div class="w-full max-w-sm">
          <div class="flex justify-center mb-8">${logoHTML()}</div>
          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-7">
            <h2 style="font-family:'Sora',sans-serif" class="text-xl font-bold text-gray-900 mb-1">
              ${isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p class="text-sm text-gray-500 mb-6">
              ${isLogin ? "Log in to your leads dashboard." : "Free forever, no card needed."}
            </p>
            <div class="space-y-3">
              ${!isLogin ? `
              <input id="auth-name" placeholder="Business name" value="${escapeHTML(state.authForm.name)}"
                oninput="state.authForm.name = this.value"
                class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm" />` : ""}
              <input id="auth-email" placeholder="Email address" value="${escapeHTML(state.authForm.email)}"
                oninput="state.authForm.email = this.value"
                class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm" />
              <input id="auth-password" type="password" placeholder="Password" value="${escapeHTML(state.authForm.password)}"
                oninput="state.authForm.password = this.value"
                class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm" />
            </div>
            <button onclick="onAuth()" class="w-full mt-5 py-2.5 rounded-lg text-white font-semibold text-sm shadow-sm" style="background:${COLORS.brand}">
              ${isLogin ? "Log in" : "Sign up"}
            </button>
            <p class="text-center text-xs text-gray-500 mt-5">
              ${isLogin ? "New here?" : "Already have an account?"}
              <button onclick="go('${isLogin ? "signup" : "login"}')" class="font-semibold" style="color:${COLORS.brand}">
                ${isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
          <button onclick="go('landing')" class="w-full text-center text-xs text-gray-400 mt-5">← Back to home</button>
        </div>
      </div>`;
  }
  
  /* ---------------------------------------------------------------
     APP SHELL (sidebar nav once "logged in")
  ----------------------------------------------------------------*/
  function shellHTML(bodyHTML) {
    const nav = [
      { key: "dashboard", label: "All Leads", icon: "message-square" },
      { key: "intake", label: "Lead Intake Simulator", icon: "sparkles" },
      { key: "settings", label: "Settings", icon: "settings" },
      { key: "pricing", label: "Pricing", icon: "zap" },
    ];
  
    const navHTML = nav.map(n => {
      const active = state.page === n.key;
      const badge = (n.key === "dashboard" && state.notifCount > 0)
        ? `<span class="ml-auto text-[10px] flex items-center justify-center rounded-full text-white font-bold" style="background:#EF4444;min-width:18px;height:18px">${state.notifCount}</span>`
        : "";
      return `
        <button onclick="go('${n.key}')" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style="background:${active ? COLORS.brandLight : "transparent"};color:${active ? COLORS.brandDark : "#4B5563"}">
          <i data-lucide="${n.icon}" style="width:16px;height:16px"></i>
          ${n.label}
          ${badge}
        </button>`;
    }).join("");
  
    return `
      <div class="min-h-screen flex" style="background:${COLORS.bg}">
        <aside class="w-60 shrink-0 border-r border-gray-100 bg-white flex flex-col">
          <div class="px-5 py-5 border-b border-gray-50">${logoHTML(18)}</div>
          <nav class="flex-1 px-3 py-4 space-y-1">${navHTML}</nav>
          <div class="px-3 py-4 border-t border-gray-50">
            <div class="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-1">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:${COLORS.brand}">
                ${(state.businessName?.[0] || "U").toUpperCase()}
              </div>
              <span class="text-sm font-medium text-gray-700 truncate">${escapeHTML(state.businessName)}</span>
            </div>
            <button onclick="logout()" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
              <i data-lucide="log-out" style="width:15px;height:15px"></i> Log out
            </button>
          </div>
        </aside>
        <main class="flex-1 overflow-y-auto">${bodyHTML}</main>
      </div>`;
  }
  
  /* ---------------------------------------------------------------
     DASHBOARD — ALL LEADS
  ----------------------------------------------------------------*/
  function getFilteredSortedLeads() {
    const q = state.searchQuery.toLowerCase();
    const filtered = state.leads.filter(l => {
      const matchStatus = state.statusFilter === "all" || l.status === state.statusFilter;
      const matchQ = !q || l.name.toLowerCase().includes(q) || l.phone.includes(state.searchQuery);
      return matchStatus && matchQ;
    });
    const order = ["hot", "qualified", "contacted", "new", "cold", "converted"];
    return [...filtered].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
  }
  
  function dashboardHTML() {
    const sorted = getFilteredSortedLeads();
    const notify = state.notifCount > 0 ? `${state.notifCount} new hot lead${state.notifCount > 1 ? "s" : ""} need attention` : null;
  
    const filterChips = [`
      <button onclick="setStatusFilter('all')" class="px-3 py-1.5 rounded-full text-xs font-semibold border"
        style="${state.statusFilter === "all" ? `background:${COLORS.text};color:white;border-color:${COLORS.text}` : `border-color:#E5E7EB;color:#6B7280`}">
        All
      </button>`].concat(
      Object.entries(STATUS_META).map(([k, m]) => `
        <button onclick="setStatusFilter('${k}')" class="px-3 py-1.5 rounded-full text-xs font-semibold border"
          style="${state.statusFilter === k ? `background:${m.color};color:white;border-color:${m.color}` : `border-color:#E5E7EB;color:#6B7280`}">
          ${m.label}
        </button>`)
    ).join("");
  
    const rows = sorted.map(l => `
      <tr onclick="openLead('${l.id}')" class="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer">
        <td class="py-3.5 px-4">
          <div class="font-semibold text-gray-900">${escapeHTML(l.name)}</div>
          <div class="text-xs text-gray-400">${escapeHTML(l.phone)}</div>
        </td>
        <td class="py-3.5 px-4 capitalize text-gray-500">${escapeHTML(l.source)}</td>
        <td class="py-3.5 px-4">${badgeHTML(l.status)}</td>
        <td class="py-3.5 px-4 text-gray-500">${escapeHTML(l.lastContactedAt)}</td>
        <td class="py-3.5 px-4 text-right"><i data-lucide="chevron-right" style="width:16px;height:16px;color:#D1D5DB"></i></td>
      </tr>`).join("");
  
    return `
      <div class="px-8 py-7 max-w-6xl">
        ${notify ? `
        <div class="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl border" style="border-color:#FCA5A5;background:#FEF2F2">
          <i data-lucide="bell" style="width:16px;height:16px;color:#EF4444"></i>
          <span class="text-sm font-medium text-red-700">${notify}</span>
        </div>` : ""}
  
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 style="font-family:'Sora',sans-serif" class="text-2xl font-bold text-gray-900">All Leads</h1>
            <p class="text-sm text-gray-500 mt-0.5">${sorted.length} leads · sorted by priority</p>
          </div>
        </div>
  
        <div class="flex items-center gap-3 mb-4">
          <div class="relative flex-1 max-w-xs">
            <i data-lucide="search" style="width:15px;height:15px;color:#9CA3AF;position:absolute;left:12px;top:50%;transform:translateY(-50%)"></i>
            <input id="search-input" value="${escapeHTML(state.searchQuery)}" oninput="setSearchQuery(this.value)"
              placeholder="Search name or phone"
              class="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm bg-white" />
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">${filterChips}</div>
        </div>
  
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-gray-400 border-b border-gray-100">
                <th class="py-3 px-4 font-medium">Name</th>
                <th class="py-3 px-4 font-medium">Source</th>
                <th class="py-3 px-4 font-medium">Status</th>
                <th class="py-3 px-4 font-medium">Last Contacted</th>
                <th class="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="5" class="py-10 text-center text-gray-400 text-sm">No leads match this filter.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>`;
  }
  
  /* ---------------------------------------------------------------
     LEAD DETAIL
  ----------------------------------------------------------------*/
  function bubbleStyle(sender) {
    if (sender === "lead") return { bg: "white", align: "justify-start", text: COLORS.text, border: "1px solid #E5E7EB" };
    if (sender === "bot") return { bg: COLORS.brandLight, align: "justify-end", text: COLORS.brandDark, border: "none" };
    return { bg: "#DCFCE7", align: "justify-end", text: "#166534", border: "none" };
  }
  
  function leadDetailHTML() {
    const lead = state.leads.find(l => l.id === state.activeLeadId);
    if (!lead) return dashboardHTML();
  
    const bubbles = lead.conversation.map(c => {
      const s = bubbleStyle(c.sender);
      const senderLabel = c.sender !== "lead"
        ? `<div class="text-[10px] font-semibold uppercase tracking-wide mb-1 px-1" style="color:${s.text};opacity:0.7">${c.sender === "bot" ? "AI Bot" : "You"}</div>`
        : "";
      return `
        <div class="flex ${s.align}">
          <div class="max-w-[70%]">
            ${senderLabel}
            <div class="px-3.5 py-2.5 rounded-2xl text-sm leading-snug" style="background:${s.bg};color:${s.text};border:${s.border}">
              ${escapeHTML(c.message)}
            </div>
            <div class="text-[10px] text-gray-400 mt-1 px-1">${escapeHTML(c.t)}</div>
          </div>
        </div>`;
    }).join("");
  
    const statusOptions = Object.entries(STATUS_META).map(([k, m]) =>
      `<option value="${k}" ${lead.status === k ? "selected" : ""}>${m.label}</option>`).join("");
  
    return `
      <div class="px-8 py-7 max-w-5xl">
        <button onclick="go('dashboard')" class="text-sm text-gray-500 mb-4 flex items-center gap-1">← Back to all leads</button>
  
        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-2 bg-white rounded-xl border border-gray-100 flex flex-col" style="height:560px">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div class="font-semibold text-gray-900">${escapeHTML(lead.name)}</div>
                <div class="text-xs text-gray-400">${escapeHTML(lead.phone)} · ${lead.language === "hi" ? "Hindi" : "English"}</div>
              </div>
              ${badgeHTML(lead.status)}
            </div>
            <div id="chat-scroll" class="chat-scroll flex-1 overflow-y-auto px-5 py-4 space-y-3" style="background:#FAFAFA">
              ${bubbles}
            </div>
            <div class="px-4 py-3 border-t border-gray-100 flex gap-2">
              <input id="reply-input" value="${escapeHTML(state.msgDraft)}"
                oninput="state.msgDraft = this.value"
                onkeydown="if(event.key==='Enter') sendReply()"
                placeholder="Type a reply as the sales rep…"
                class="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm" />
              <button onclick="sendReply()" class="px-3.5 rounded-lg text-white flex items-center justify-center" style="background:${COLORS.brand}">
                <i data-lucide="send" style="width:16px;height:16px"></i>
              </button>
            </div>
          </div>
  
          <div class="space-y-4">
            <div class="bg-white rounded-xl border border-gray-100 p-5">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Qualification</h3>
              <div class="space-y-2.5 text-sm">
                <div class="flex justify-between"><span class="text-gray-400">Budget</span><span class="font-medium text-gray-900">${escapeHTML(lead.budget)}</span></div>
                <div class="flex justify-between"><span class="text-gray-400">Timeline</span><span class="font-medium text-gray-900">${escapeHTML(lead.timeline)}</span></div>
                <div class="text-gray-400">Intent</div>
                <div class="text-gray-800 -mt-1.5">${escapeHTML(lead.intent)}</div>
              </div>
              <p class="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50 leading-relaxed">${escapeHTML(lead.summary)}</p>
            </div>
  
            <div class="bg-white rounded-xl border border-gray-100 p-5">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Status</h3>
              <select onchange="setLeadStatus('${lead.id}', this.value)" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-3">
                ${statusOptions}
              </select>
              <button onclick="toast('Call booked — confirmation sent to ${escapeHTML(lead.name)}')"
                class="w-full py-2.5 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2" style="background:${COLORS.brand}">
                <i data-lucide="calendar" style="width:15px;height:15px"></i> Book a Call
              </button>
              <button onclick="startQualification()" class="w-full py-2.5 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 mt-3" style="background:${COLORS.brand}">
                <i data-lucide="message-square" style="width:16px;height:16px"></i> Start AI Qualification
               </button>
            </div>
  
            <div class="bg-white rounded-xl border border-gray-100 p-5">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Notes</h3>
              <textarea id="note-input" oninput="state.noteDraft = this.value" placeholder="Add a private note…" rows="3"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none">${escapeHTML(state.noteDraft)}</textarea>
            </div>
          </div>
        </div>
      </div>`;
  }
  
  /* ---------------------------------------------------------------
     LEAD INTAKE SIMULATOR
  ----------------------------------------------------------------*/
  function scoreOf(message) {
    const m = message.toLowerCase();
    if (m.includes("urgent") || m.includes("asap") || m.includes("today") || m.includes("jaldi")) return "hot";
    if (m.includes("maybe") || m.includes("just exploring") || m.includes("later")) return "cold";
    return "qualified";
  }
  
  function intakeHTML() {
    const f = state.intakeForm;
    return `
      <div class="px-8 py-7 max-w-xl">
        <h1 style="font-family:'Sora',sans-serif" class="text-2xl font-bold text-gray-900 mb-1">Lead Intake Simulator</h1>
        <p class="text-sm text-gray-500 mb-6">Mimics a webhook lead from an ad, form, or referral — for demo purposes.</p>
  
        <div class="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div>
            <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Name</label>
            <input id="intake-name" value="${escapeHTML(f.name)}" oninput="state.intakeForm.name = this.value"
              class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm" placeholder="e.g. Kavya Reddy" />
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Phone</label>
            <input id="intake-phone" value="${escapeHTML(f.phone)}" oninput="state.intakeForm.phone = this.value"
              class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm" placeholder="+91 90000 00000" />
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Source</label>
            <select id="intake-source" onchange="state.intakeForm.source = this.value" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm">
              <option value="ad" ${f.source === "ad" ? "selected" : ""}>Ad</option>
              <option value="form" ${f.source === "form" ? "selected" : ""}>Form</option>
              <option value="referral" ${f.source === "referral" ? "selected" : ""}>Referral</option>
              <option value="manual" ${f.source === "manual" ? "selected" : ""}>Manual</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Message</label>
            <textarea id="intake-message" oninput="state.intakeForm.message = this.value" rows="3"
              class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm resize-none"
              placeholder="e.g. Need this urgently, please call me today">${escapeHTML(f.message)}</textarea>
            <p class="text-[11px] text-gray-400 mt-1">Try words like "urgent" or "just exploring" — the scorer reacts to them live.</p>
          </div>
          <button onclick="submitIntake()" class="w-full py-2.5 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2" style="background:${COLORS.brand}">
            <i data-lucide="plus" style="width:16px;height:16px"></i> Simulate Incoming Lead
          </button>
        </div>
      </div>`;
  }
  
  /* ---------------------------------------------------------------
     SETTINGS
  ----------------------------------------------------------------*/
  function settingsHTML() {
    const qList = state.questions.map(q => `
      <div class="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-gray-50 text-sm">
        <span class="text-gray-700">${escapeHTML(q.label)}</span>
        <button onclick="removeQuestion(${q.id})"><i data-lucide="x" style="width:14px;height:14px;color:#9CA3AF"></i></button>
      </div>`).join("");
  
    return `
      <div class="px-8 py-7 max-w-xl">
        <h1 style="font-family:'Sora',sans-serif" class="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p class="text-sm text-gray-500 mb-6">Configure what the AI bot asks, and when cold leads get nudged.</p>
  
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Qualifying questions</h3>
          <div class="space-y-2 mb-3">${qList}</div>
          <div class="flex gap-2">
            <input id="question-draft" value="${escapeHTML(state.questionDraft)}" oninput="state.questionDraft = this.value"
              placeholder="Add a question the bot should ask…" class="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm" />
            <button onclick="addQuestion()" class="px-4 rounded-lg text-white text-sm font-semibold" style="background:${COLORS.brand}">Add</button>
          </div>
        </div>
  
        <div class="bg-white rounded-xl border border-gray-100 p-6 mb-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Auto follow-up timing</h3>
          <div class="flex items-center gap-3">
            <input id="followup-hrs" type="number" value="${state.followupHrs}" oninput="state.followupHrs = this.value"
              class="w-20 px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            <span class="text-sm text-gray-500">hours after a lead goes cold, send a follow-up nudge</span>
          </div>
        </div>
  
        <button onclick="toast('Settings saved')" class="px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style="background:${COLORS.brand}">
          Save Settings
        </button>
      </div>`;
  }
  
  /* ---------------------------------------------------------------
     PRICING
  ----------------------------------------------------------------*/
  function pricingHTML() {
    const plans = [
      { name: "Free Forever", price: "₹0", tagline: "For solo agents testing the waters", features: ["Up to 25 leads / month", "AI qualification (English only)", "Manual follow-up reminders", "1 team seat"], cta: "Start Free" },
      { name: "Growth", price: "₹499/mo", tagline: "For small teams that can't miss a lead", features: ["Unlimited leads", "AI qualification (Hindi + English)", "Automated follow-up sequences", "Up to 5 team seats", "Priority support"], cta: "Upgrade", highlight: true },
    ];
  
    const cards = plans.map(p => `
      <div class="rounded-2xl p-7 border" style="${p.highlight ? `border-color:${COLORS.brand};background:${COLORS.brandLight}` : `border-color:#E5E7EB;background:white`}">
        <h3 style="font-family:'Sora',sans-serif" class="text-lg font-bold text-gray-900">${p.name}</h3>
        <p class="text-sm text-gray-500 mb-4">${p.tagline}</p>
        <div class="text-3xl font-extrabold mb-5" style="color:${p.highlight ? COLORS.brandDark : COLORS.text};font-family:'Sora',sans-serif">${p.price}</div>
        <ul class="space-y-2.5 mb-6">
          ${p.features.map(f => `
            <li class="flex items-start gap-2 text-sm text-gray-700">
              <i data-lucide="check" style="width:15px;height:15px;margin-top:2px;color:${COLORS.brand}"></i> ${f}
            </li>`).join("")}
        </ul>
        <button onclick="go('${loggedIn() ? "dashboard" : "signup"}')" class="w-full py-2.5 rounded-lg text-sm font-semibold"
          style="${p.highlight ? `background:${COLORS.brand};color:white` : `background:#F3F4F6;color:${COLORS.text}`}">
          ${p.cta}
        </button>
      </div>`).join("");
  
    return `
      <div class="px-8 py-10 max-w-4xl">
        <div class="text-center mb-10">
          <h1 style="font-family:'Sora',sans-serif" class="text-3xl font-bold text-gray-900 mb-2">Simple, honest pricing</h1>
          <p class="text-gray-500 text-sm">Start free. Upgrade only when leads start converting.</p>
        </div>
        <div class="grid md:grid-cols-2 gap-6">${cards}</div>
      </div>`;
  }

  async function loadLeads() {
    const result = await apiCall("GET", "/leads");
    if (result && result.data) {
      state.leads = result.data;  // Array of leads from DB
    } else if (result && Array.isArray(result)) {
      state.leads = result;  // Fallback if data is direct array
    }
    rerender();
  }
  
  /* ---------------------------------------------------------------
     ACTIONS (state mutators — each ends with a rerender)
  ----------------------------------------------------------------*/
  function go(page) {
    state.page = page;
    if (page === "dashboard") {
      state.notifCount = 0;
      loadLeads();  // ✅ ADD THIS
    }
    rerender();
    window.scrollTo(0, 0);
  }
  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("businessName");
    state.businessName = "";
    state.accessToken = null;
    state.userId = null;
    state.leads = [];
    go("landing");
  }
  
  function openLead(id) {
    state.activeLeadId = id;
    state.noteDraft = "";
    state.msgDraft = "";
    state.page = "leadDetail";
    rerender();
    const scroller = document.getElementById("chat-scroll");
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }
  
  function updateLead(id, patch) {
    state.leads = state.leads.map(l => (l.id === id ? { ...l, ...patch } : l));
  }
  
  async function setLeadStatus(id, status) {
    const lead = state.leads.find(l => l._id === id || l.id === id);
    if (!lead) return;
    
    const result = await apiCall("PATCH", `/leads/${lead._id || id}`, { status });
    if (result) {
      state.leads = state.leads.map(l => (l._id === (lead._id || id) ? result : l));
      rerender();
    }
  }
  async function sendReply() {
    const lead = state.leads.find(l => l._id === state.activeLeadId || l.id === state.activeLeadId);
    if (!lead || !state.msgDraft.trim()) return;
    
    // Send message to backend
    const result = await apiCall("PATCH", `/leads/${lead._id || lead.id}`, {
      message: state.msgDraft,  // Adds to conversation
    });
    
    if (result) {
      state.msgDraft = "";
      await loadLeads();  // Refresh lead from backend
      rerender();
      const scroller = document.getElementById("chat-scroll");
      if (scroller) setTimeout(() => { scroller.scrollTop = scroller.scrollHeight; }, 100);
    }
  }
  
  async function submitIntake() {
    const f = state.intakeForm;
    if (!f.name || !f.phone) return;
    
    // Send to backend
    const result = await apiCall("POST", "/leads", {
      name: f.name,
      phone: f.phone,
      email: f.email || undefined,
      source: f.source,
      message: f.message,
    });
    
    if (result) {
      state.intakeForm = { name: "", phone: "", source: "ad", message: "" };
      toast("Lead created!");
      go("dashboard");
      await loadLeads();  // Refresh list from backend
    }
  }

  async function onAuth() {
    const isLogin = state.page === "login";
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const body = isLogin
      ? { email: state.authForm.email, password: state.authForm.password }
      : {
          name: state.authForm.name,
          email: state.authForm.email,
          password: state.authForm.password,
          passwordConfirm: state.authForm.password,
        };
    
    const result = await apiCall("POST", endpoint, body);
    if (result && result.data?.user) {
      state.accessToken = result.data.accessToken;
      state.userId = result.data.user._id;
      state.businessName = result.data.user.name;
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("userId", result.data.user._id);
      state.authForm = { name: "", email: "", password: "" };
      toast(`Logged in as ${result.data.user.name}!`);
      go("dashboard");
      rerender();
    }
  }
  
  function setStatusFilter(k) {
    state.statusFilter = k;
    rerender();
  }
  
  function setSearchQuery(v) {
    state.searchQuery = v;
    rerender();
  }
  
  function addQuestion() {
    if (!state.questionDraft.trim()) return;
    state.questions = [...state.questions, { id: Date.now(), label: state.questionDraft, field: "custom" }];
    state.questionDraft = "";
    rerender();
  }
  
  function removeQuestion(id) {
    state.questions = state.questions.filter(q => q.id !== id);
    rerender();
  }
  
  function toast(message) {
    state.toastMsg = message;
    if (state.toastTimer) clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(dismissToast, 3200);
    rerender();
  }
  
  function dismissToast() {
    state.toastMsg = null;
    rerender();
  }
  async function startQualification() {
    const lead = state.leads.find(l => l._id === state.activeLeadId || l.id === state.activeLeadId);
    if (!lead) return;
    
    toast("Starting AI qualification...");
    
    // Call qualification API
    const result = await apiCall("POST", `/leads/${lead._id || lead.id}/qualify`, {
      message: "",  // Empty = first turn (bot asks budget question)
    });
    
    if (result) {
      // Update lead with bot's response
      state.leads = state.leads.map(l => 
        (l._id === (lead._id || lead.id) || l.id === state.activeLeadId) ? result : l
      );
      rerender();
      const scroller = document.getElementById("chat-scroll");
      if (scroller) setTimeout(() => { scroller.scrollTop = scroller.scrollHeight; }, 100);
    }
  }
  
  /* ---------------------------------------------------------------
     ROOT RENDER
  ----------------------------------------------------------------*/
  function renderApp() {
    const loggedInPages = ["dashboard", "leadDetail", "intake", "settings"];
    const showShell = loggedIn() && (loggedInPages.includes(state.page) || state.page === "pricing");
  
    let body;
    if (state.page === "landing") body = landingHTML();
    else if (state.page === "login" || state.page === "signup") body = authPageHTML();
    else if (state.page === "dashboard") body = dashboardHTML();
    else if (state.page === "leadDetail" && state.leads.find(l => l.id === state.activeLeadId)) body = leadDetailHTML();
    else if (state.page === "intake") body = intakeHTML();
    else if (state.page === "settings") body = settingsHTML();
    else if (state.page === "pricing") body = pricingHTML();
    else body = landingHTML();
  
    const wrapped = showShell ? shellHTML(body) : body;
  
    document.getElementById("app").innerHTML = `
      <div style="font-family:'Inter',sans-serif">
        ${wrapped}
        ${toastHTML()}
      </div>`;
  }
  
  /* ---------------------------------------------------------------
     INIT
  ----------------------------------------------------------------*/
  document.addEventListener("DOMContentLoaded", () => {
    // Check if already logged in
    const token = localStorage.getItem("accessToken");
    if (token) {
      state.accessToken = token;
      state.userId = localStorage.getItem("userId");
      state.businessName = localStorage.getItem("businessName") || "Your Business";
    }
    
    renderApp();
    if (window.lucide) lucide.createIcons();
  });