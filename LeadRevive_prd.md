# Product Requirements Document (PRD)
## LeadRevive AI — Automated Lead Follow-Up & Qualification Bot for Small Businesses

**Version:** 1.0
**Prepared for:** FlowZint AI Hackathon 2026 (Unstop)
**Brand color:** `#6f54e8`
**Tech stack:** React + Next.js, Tailwind CSS, Node.js + Express, MongoDB (Email-based auth)

---

## 1. Executive Summary

LeadRevive AI is a SaaS tool that automatically engages, qualifies, and nurtures inbound sales leads for small businesses (real estate agents, coaching institutes, local shops, service providers) in the minutes after they come in — before they go cold. It uses AI to ask qualifying questions, scores leads by intent/urgency, and triggers automated follow-ups for leads that aren't ready to convert yet.

---

## 2. Problem Statement

Small businesses generate leads through ads, landing page forms, and social media inquiries, but **60–70% of these leads go cold** because no one follows up within the critical first few minutes. Sales teams at small businesses are typically 1–3 people who cannot manually respond to every lead in real time, resulting in lost revenue that has nothing to do with product quality and everything to do with response speed.

---

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Reduce lead response time | Bot responds within seconds of lead creation (vs. hours/days manually) |
| Improve lead qualification accuracy | Every lead tagged with a status (Hot/Warm/Cold) before a human touches it |
| Reduce cold-lead leakage | Automated follow-up sequence triggers with zero manual effort |
| Demonstrate hackathon MVP value | Working end-to-end demo: lead comes in → bot qualifies → dashboard updates → follow-up simulated |

---

## 4. Target Users

- **Primary:** Small business owners / solo sales reps (real estate agents, coaching institute admins, local service providers) in India
- **Secondary:** Small sales teams (2–5 people) who need shared visibility into lead status

---

## 5. Tech Stack

| Layer | Choice |
|---|---|
| Frontend framework | React + Next.js |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose ODM) |
| Auth | Email + Password only (JWT access + refresh token, no OAuth) |
| AI | LLM API (Claude/OpenAI) for qualification chat logic + language detection |
| Validation | Zod (backend + frontend env/schema validation) |

> Note: Following the project blueprint pattern — env variables validated with Zod at startup, standard `{success, data}` / `{success, error: {code, message, fields}}` response shape across all endpoints, `assertOwnership()` used on every controller so leads are always scoped to the logged-in business/user.

---

## 6. Branding

- **Brand name:** LeadRevive AI
- **Primary color:** `#6f54e8` (violet-purple — signals "AI-powered," modern SaaS)
- **Primary Dark (hover/active):** `#5638d1`
- **Primary Light (backgrounds):** `#F3F0FF`
- **Background:** `#FAFAFB`
- **Text (primary):** `#111827` | **Text (secondary):** `#6B7280`

**Lead status badge colors:**
| Status | Color |
|---|---|
| New | `#3B82F6` (blue) |
| Contacted | `#F59E0B` (amber) |
| Qualified | `#6f54e8` (brand purple) |
| Hot | `#EF4444` (red) |
| Cold | `#9CA3AF` (gray) |
| Converted | `#10B981` (green) |

---

## 7. Information Architecture — Pages

```
Pages
 ├── Home (Landing)
 │    ├── Header
 │    └── Hero
 ├── Login and Signup
 │    └── Email Based Only
 ├── Dashboard
 │    ├── All Leads (list view)
 │    └── Lead Detail (conversation + status)
 ├── Lead Intake Simulator
 │    └── Form to simulate incoming leads for demo purposes
 ├── Settings
 │    └── Qualifying Questions Config
 └── Pricing
      └── Pricing Table with Title
           ├── Free Forever
           └── ₹499/mo Plan
```

### Page-level detail

**7.1 Home (Landing)**
- Header: logo, nav (Features / Pricing / Login), CTA "Get Started"
- Hero: headline (e.g. "Never Let a Lead Go Cold Again"), sub-headline, CTA button, product screenshot/mock

**7.2 Login and Signup**
- Email + password fields only
- Client + server-side validation (Zod / React Hook Form)
- No Google OAuth for MVP

**7.3 Dashboard**
- *All Leads:* table/list view with columns — Name, Source, Status badge, Last Contacted, Assigned To
- Filter by status, search by name/phone
- *Lead Detail:* full conversation thread + editable status + notes + "Book a Call" button

**7.4 Lead Intake Simulator**
- A simple form (Name, Phone, Source, Message) that mimics an incoming webhook lead — used for live demo since real ad/form integrations are out of MVP scope

**7.5 Settings**
- Configure the qualifying questions the AI bot asks (e.g. budget, timeline, intent) — optional, build only if time permits

**7.6 Pricing**
- Free Forever tier vs ₹499/mo tier — table with feature comparison

---

## 8. Features (Detailed)

```
Features
 ├── Lead Capture
 │    └── Webhook/form intake, auto-creates lead in DB
 ├── AI Auto-Qualification
 │    1- Detects language (Hindi/English)
 │    2- Asks budget, intent, timeline
 │    3- Scores lead: Hot / Warm / Cold
 │    4- Saves qualification summary to lead record
 ├── Dashboard
 │    ├── Leads sorted by status (New → Contacted → Qualified → Hot → Cold → Converted)
 │    └── Filter/search leads
 ├── Auto Follow-Up
 │    1- Cold leads get scheduled nudge (simulated/logged)
 │    2- Follow-up timing configurable (e.g. after 24hrs)
 ├── Book a Call Button
 │    └── Fake confirmation (no real calendar integration)
 ├── Conversation View
 │    └── Full chat log per lead (styled like WhatsApp)
 ├── Notifications
 │    └── "New hot lead" alert to sales rep (in-app, not push)
 └── Create Lead Button
      └── Manual lead entry (for demo/testing)
```

### 8.1 Feature Detail — User Stories & Acceptance Criteria

**Lead Capture**
- *As a business owner*, when a new lead comes in through the intake simulator, a Lead record is created automatically with status `New`.
- Acceptance: POST to `/api/v1/leads` creates a document; appears in dashboard within 1 refresh cycle.

**AI Auto-Qualification**
- *As the system*, when a new lead is created, the AI bot initiates a qualification conversation asking about budget, intent, and timeline, detecting the lead's language and responding accordingly.
- Acceptance: after conversation completes (or after N exchanges), lead status auto-updates to `Qualified`, `Hot`, or `Cold` based on scoring logic; a qualification summary is saved to the lead record.

**Dashboard**
- *As a sales rep*, I can see all my leads sorted/filterable by status so I know who to prioritize.
- Acceptance: list view supports filter by status and search by name/phone; clicking a lead opens Lead Detail.

**Auto Follow-Up**
- *As the system*, cold leads that haven't converted get a scheduled follow-up nudge (simulated as a logged event/message, not a real SMS/WhatsApp send for MVP).
- Acceptance: a cron-style job (or simulated trigger) marks/logs a follow-up action after the configured delay (e.g. 24 hrs).

**Book a Call Button**
- *As a sales rep*, I can click "Book a Call" on a hot lead and see a confirmation — real calendar integration is out of scope for MVP.
- Acceptance: button shows a success toast/confirmation modal; no real calendar API call required.

**Conversation View**
- *As a sales rep*, I can view the full chat history with a lead in a WhatsApp-styled interface.
- Acceptance: messages render in chat bubbles with sender distinction (lead vs bot vs rep).

**Notifications**
- *As a sales rep*, I get an in-app alert when a lead is scored `Hot`.
- Acceptance: a visible in-app banner/badge appears; no push notification required for MVP.

**Create Lead Button**
- *As a sales rep*, I can manually add a lead for testing/demo purposes.
- Acceptance: form with Name, Phone, Source fields; creates lead same as automated intake.

---

## 9. Data Model

```typescript
// Lead
{
  _id: ObjectId,
  userId: ObjectId,          // owning sales rep/business (assertOwnership scope)
  name: string,
  phone: string,
  email?: string,
  source: "ad" | "form" | "referral" | "manual",
  status: "new" | "contacted" | "qualified" | "hot" | "cold" | "converted",
  budget?: string,
  intent?: string,
  timeline?: string,
  language: "en" | "hi" | "other",
  qualificationSummary?: string,
  conversation: [
    { sender: "lead" | "bot" | "rep", message: string, timestamp: Date }
  ],
  followUp: {
    scheduledAt?: Date,
    sent: boolean
  },
  isDeleted: boolean,
  createdAt: Date,
  lastContactedAt: Date
}

// User
{
  _id: ObjectId,
  name: string,
  email: string,
  passwordHash: string,
  businessName?: string,
  createdAt: Date
}
```

---

## 10. API Endpoints (following blueprint standard response shape)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Create account (email/password) | No |
| POST | `/api/v1/auth/login` | Login, returns access token + sets refresh cookie | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No (cookie) |
| POST | `/api/v1/auth/logout` | Clear session | Yes |
| GET | `/api/v1/users/me` | Get current user profile | Yes |
| POST | `/api/v1/leads` | Create a lead (manual or simulated intake) | Yes |
| GET | `/api/v1/leads` | List leads (paginated, filterable by status) | Yes |
| GET | `/api/v1/leads/:id` | Get lead detail + conversation | Yes |
| PATCH | `/api/v1/leads/:id` | Update lead status/notes | Yes |
| POST | `/api/v1/leads/:id/qualify` | Trigger AI qualification conversation turn | Yes |
| POST | `/api/v1/leads/:id/followup` | Trigger/simulate follow-up nudge | Yes |
| DELETE | `/api/v1/leads/:id` | Soft-delete a lead | Yes |
| GET | `/api/v1/health` | Liveness check | No |

All responses follow:
```json
{ "success": true, "data": { } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": {} } }
```

---

## 11. Non-Functional Requirements (MVP-scoped)

- **Security:** helmet, cors (explicit origin), express-mongo-sanitize, express-rate-limit (esp. on auth routes), Zod validation on all routes, `assertOwnership()` on every lead-related controller
- **Performance:** Paginated lead lists (no unbounded fetches)
- **Auth:** Email/password only; JWT access (15 min) + refresh (7 days, HttpOnly cookie)
- **Out of scope for MVP:** Google OAuth, real WhatsApp Business API, real calendar integration, Socket.io real-time push, Sentry/Winston production logging, GDPR export

---

## 12. MVP Build Priority (5-Day Scope)

1. **Day 1:** Auth (register/login/JWT) + Lead model + basic CRUD
2. **Day 2:** Lead Intake Simulator + Dashboard list/filter view
3. **Day 3:** AI qualification chat logic + status auto-scoring + Conversation View UI
4. **Day 4:** Auto Follow-Up (simulated) + Notifications (in-app) + Book a Call (fake confirmation)
5. **Day 5:** Landing page + Pricing page + polish UI with brand color `#6f54e8` + demo rehearsal

---

## 13. Risks & Assumptions

- **Assumption:** Real WhatsApp/SMS sending is not required for judging — simulated/logged follow-ups are acceptable and will be disclosed transparently in the pitch as "next step post-hackathon."
- **Risk:** AI qualification logic quality depends on prompt design — allocate dedicated time to test with realistic Hinglish/Hindi lead conversations before the demo.
- **Risk:** Time constraint (5 days) — Settings page and calendar/WhatsApp integrations are explicitly de-scoped to protect the core AI qualification + dashboard demo.

---

*Prepared for FlowZint AI Hackathon 2026 — Submission deadline 19th July 2026.*