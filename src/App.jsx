import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Download, Search, X } from "lucide-react";

/**
 * GFM Cohort Prototype — v2
 * Changes in this version:
 * - Step 2: Larger circular headshots at top; name/title centered under photo
 * - Step 4: Removed inline click-to-edit; uses popup modal for editing/removing items
 * - Step 5: Export render is more graphical with cards and pills
 */

// ---------- Helpers ----------
const rhythmKeys = ["daily", "weekly", "monthly", "semester", "yearly"]; // canonical order
const engagementTypes = [
  "prayer",
  "gathering",
  "practice",
  "event",
  "video call",
  "study",
  "hospitality",
  "conversation",
  "public talk",
];

const embedFromWatch = (url) => {
  try {
    const u = new URL(url);
    const id = u.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch { return url; }
};

const VideoFrame = ({ src, title }) => (
  <div className="rounded-xl overflow-hidden shadow">
    <div className="relative pb-[56.25%] h-0 w-full">
      <iframe
        className="absolute left-0 top-0 h-full w-full"
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  </div>
);

const StepShell = ({ step, total, onPrev, onNext, children }) => (
  <div className="mx-auto max-w-6xl p-4 md:p-8">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">GFM Cohort Prototype</h1>
        <p className="text-sm text-muted-foreground">Storyboard walkthrough · Step {step} of {total}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} disabled={step === 1}><ChevronLeft className="mr-1 h-4 w-4"/>Back</Button>
        <Button onClick={onNext}>{step === total ? "Finish" : <>Next<ChevronRight className="ml-1 h-4 w-4"/></>}</Button>
      </div>
    </div>
    {children}
  </div>
);

// ---------- Data (Paula real; Hank/Kyle trimmed to 1 per rhythm) ----------
const continuum = [
  { key: "prospective", title: "Prospective" },
  { key: "connected", title: "Connected" },
  { key: "emerging", title: "Emerging", focus: true },
  { key: "establishing", title: "Establishing" },
  { key: "catalyzing", title: "Catalyzing" },
];

const subjects = [
  {
    id: "paula",
    name: "Paula – William & Mary",
    role: "InterVarsity Faculty Ministry & Cambridge House co‑founder",
    why: "Shows how a smorgasbord of light‑lift rhythms can grow from emerging contacts to a stable community.",
    photo: "https://github.com/nsiv-gfm/continuum-proto/blob/main/image/paula.jpg?raw=true",
    videoLabel: "Faculty Community Overview",
    videoUrl: embedFromWatch("https://www.youtube.com/watch?v=z82mretFcss"),
    transcript: `Faculty Community Overview

I started working on William & Mary’s campus six years ago with my InterVarsity Faculty Ministry hat on. I began meeting with as many people as would meet with me, and by the end of that first semester, I had about 35 names of faculty. That list has now grown to about 80 faculty and staff, about 40 of whom I know personally. I’d say 20 to 25 are actively involved.

We don’t have one particular gathering — instead, we have a smorgasbord of different events that I invite faculty and staff into. My husband and I also founded a Christian study center called Cambridge House, which has become the epicenter of what I would describe as the university’s faculty ministry. Cambridge House operates as a Christian Study Center at William & Mary.

We have seven faculty and staff who serve on a Faculty Advisory Council. Their two main goals are to increase faculty and staff involvement in the life of Cambridge House and to advise the Cambridge House staff on our public lecture series. We host weekly, monthly, and semesterly events.

As InterVarsity chaplain to faculty and staff, I’m usually focused on two things: spending a lot of one-on-one time with people, and communicating regularly with all 80 or so on my mailing list to invite them into the life of these gatherings.`,
  },
  {
    id: "hank",
    name: "Hank — UNC (temp)",
    role: "STEM faculty champion; connector between graduate students and faculty",
    why: "Models low‑lift hospitality and relationship‑building that surfaces persons of peace and creates simple on‑ramps.",
    photo: "https://github.com/nsiv-gfm/continuum-proto/blob/main/image/hank.jpg?raw=true",
    videoLabel: "",
    videoUrl: "",
    transcript: "Sample: Hank shares how weekly hallway coffee created space for cross‑department introductions and prayer prompts.",
  },
  {
    id: "kyle",
    name: "Kyle — Boston (temp)",
    role: "Postdoc networker spanning multiple schools",
    why: "Demonstrates bridging Emerging → Establishing by convening virtual office hours and short‑read circles while forming a core team.",
    photo: "https://github.com/nsiv-gfm/continuum-proto/blob/main/image/kyle.jpg?raw=true",
    videoLabel: "",
    videoUrl: "",
    transcript: "Sample: Kyle explains how virtual office hours revealed shared vocation questions that led to a rotating short‑read circle.",
  },
];

// Paula items (verbatim transcripts) + Hank/Kyle trimmed to 1 per rhythm
const storyItems = {
  paula: [
    { id: "pa-oneonones", title: "Campus Walks & One‑on‑Ones", rhythm: "daily", type: "practice", engagement: "conversation", text: "30‑minute campus walks for relational one‑on‑one conversations. Meetings or walks scheduled weekly.", video: embedFromWatch("https://www.youtube.com/watch?v=tlcSzjqeR9Q"), transcript: `One-on-ones are my favorite part of my job. I have two wonderful dogs that most people who know me recognize instantly because I walk them every day. When I reach out to a faculty or staff member, I usually invite them to take a walk with me on campus or meet for a drink — hot or cold.

About 95% of the time, they take me up on the dog walk. I’ll meet them at their office, and we’ll stroll around campus for about 30 minutes. I’ve already had 15 to 17 of these walks this semester with faculty. They’re such meaningful, relational times.` },
    { id: "pa-morningprayer", title: "Morning Prayer at Wren Chapel", rhythm: "monthly", type: "gathering", engagement: "prayer", text: "30‑minute liturgical morning prayer in Wren Chapel (first Mon/Tue each full month). Attendance 20–35; open to faculty/staff/students/alumni.", video: embedFromWatch("https://www.youtube.com/watch?v=tf1TStEIWXA"), transcript: `Monthly Morning Prayer began with a professor who returned to William & Mary for a second term after teaching at Wheaton. It’s a huge passion of his, and we’ve been delighted to see it flourish.

He plans and organizes a liturgical morning prayer in the historic Wren Chapel once a month — on the first Monday or Tuesday of each full month during the semester. It lasts about 30 minutes.

Cambridge House and I both help spread the word. It’s open to faculty, staff, students, alumni, and the broader community. We usually see between 20 and 35 people. It’s a lovely, grounding rhythm in the life of our campus community.` },
    { id: "pa-facultyfellowship", title: "Faculty Fellowship Event", rhythm: "monthly", type: "event", engagement: "testimony", text: "60‑minute late‑afternoon gathering with two faculty speakers.", video: embedFromWatch("https://www.youtube.com/watch?v=282ZRB1YK_s"), transcript: `We host our Faculty Fellowship Events at Cambridge House near the end of the workday — usually from 3:30 to 4:30 or 4:30 to 5:30. We provide food and drinks and frame the time as both fellowship and conversation around integration — how faith connects with academic life.

At each event, we feature two faculty members (typically one man and one woman) and invite them to share, in classic InterVarsity fashion, how their Christian faith impacts their work as professors.

Everyone listens, asks thoughtful questions, and the conversations are rich and personal. We usually have 10 to 18 people.

The planning is simple: invite one or two faculty you already know and love, provide some snacks, and you have an event. I’ll sometimes ask someone directly, “Would you be willing to speak for five to seven minutes about how your faith shapes your teaching?” — and everyone I’ve asked has always said yes.

They love it. It’s a simple but powerful way to build community.` },
    { id: "pa-dinners", title: "Faculty Fellowship Dinner", rhythm: "semester", type: "event", engagement: "meal", text: "10–14 people for dinner & guided conversation.", video: embedFromWatch("https://www.youtube.com/watch?v=_Cu0pZtHQyo"), transcript: `Our Faculty Fellowship Dinners are the highlight of the semester — for both the faculty and for me. We’ve been doing them for about five years at Cambridge House, our Christian Study Center.

They usually take place on a Wednesday or Thursday evening from 6:00 to 8:00. We generally have between 10 and 14 people. We serve a wonderful meal and then move into a guided conversation that starts with personal sharing and getting to know one another. I always make sure they know how much I appreciate them.

Sometimes we focus on a topic, like Reimagining a More Robust Faculty Christian Community at William & Mary. Other times, we feature a faculty member who shares about integrating faith into their research. These evenings are always rich and deeply encouraging.` },
    { id: "pa-lectures", title: "Public Lecture Series", rhythm: "semester", type: "event", engagement: "public talk", text: "Faculty Advisory Council–planned lectures (1/semester) drawing 50–125; topics include economics of the Kingdom, global health, etc.", video: embedFromWatch("https://www.youtube.com/watch?v=ftm3-sBb1vk"), transcript: `Our Public Lecture Series has grown tremendously. The first one was literally in my home — my husband and I were living in Cambridge House at the time — and we had 75 people packed into our basement! A philosophy professor spoke on My Favorite Argument for God, and it was amazing.

Now, the Faculty Advisory Council plans these lectures and recommends speakers. We hold them in large campus venues, drawing anywhere from 50 to 125 people. We do one per semester.

It’s a wonderful way for faculty to participate — they make recommendations and help shape the themes. For example, we’ve hosted an economics professor from VCU who spoke on The Economy of the Kingdom of God, and a global health specialist from UNC Chapel Hill who shared a provocative talk titled Unlearning Colonial Ways of Doing Good: But I Meant Well.

These lectures are probably our most outreach-oriented events, engaging campus discussions from a Christian perspective and welcoming students, faculty, and the Williamsburg community alike.` },
    { id: "pa-openhouse", title: "Open House Event", rhythm: "semester", type: "event", engagement: "hospitality", text: "Study Center open house with light breakfast before fall & January terms; families welcome (30–55 attend).", video: embedFromWatch("https://www.youtube.com/watch?v=agYyWxpQtDQ"), transcript: `On the Saturday morning before classes start in the fall — and again in January — we host what is probably our largest event of the year: an Open House at the Study Center.

We invite every faculty and staff member, their spouses, their children, our Cambridge House board and staff, and myself as InterVarsity chaplain. We usually see between 30 and 55 people for a light breakfast. Our main goal is to love on them, facilitate conversation, connect them with one another, and bless them as the semester begins.

They especially love that the event includes their families. Faculty show up with strollers and little ones, and we often see emeritus faculty as well. Spouses really appreciate being included.

Faculty often help with our dinners and play a big role in inviting colleagues, but this Open House is something I put on almost as a gift to them.` },
    { id: "pa-studentbooks", title: "Student Book Discussion", rhythm: "semester", type: "practice", engagement: "study", text: "Faculty‑led discussion group (often 3–4 weeks; sometimes year‑long) with grad/undergrad students.", video: embedFromWatch("https://www.youtube.com/watch?v=P7VEySRBUnw"), transcript: `One of my favorite aspects of partnering with a Christian Study Center as an InterVarsity Faculty Chaplain is this: when we invite professors into the life of Cambridge House, we tell them it’s both a place for you to do ministry and a place for you to be ministered to. They love that idea.

We invite faculty to lead student discussion groups, offer fireside chats, and mentor students. Many jump at the opportunity.

A student book discussion might run for three or four weeks — sometimes longer. One math professor led a year-long study on virtue with graduate and undergraduate students. Another biology professor led a year-long book discussion on environmental stewardship and faith — one of our most popular offerings ever.` },
    { id: "pa-facultybooks", title: "Faculty Book Discussion", rhythm: "yearly", type: "gathering", engagement: "study", text: "Four‑session (60 min) faculty reading group; easy on‑ramp; provide coffee; hosted in campus space.", video: embedFromWatch("https://www.youtube.com/watch?v=UVW8vX3bFOo"), transcript: `I’ve only hosted a few of these so far, but I plan to do another soon. One of my favorites was reading Rick Mattson’s Faith Is Like Skydiving: Evangelism in the Academy. I thought, “I know a few missional faculty who’d love to read this with me,” and sure enough, five agreed.

We met for four sessions, each 60 minutes long, at the business school — and yes, I bought everyone a fancy coffee. Keeping it short and finite really helped people say yes. They loved it, and so did I.

For the next one — maybe in the new year or next fall — I’m thinking of gathering a group of women professors to read Elaine Howard Ecklund’s upcoming book on the integration of faith and work.` },
    { id: "pa-sacredspace", title: "Sacred Space (Online)", rhythm: "yearly", type: "gathering", engagement: "video call", text: "30‑minute online spiritual formation gathering during workday (12:00–12:30). Practices: Lectio/Visio Divina, Examen, virtual prayer walks. Currently paused; may return.", video: embedFromWatch("https://www.youtube.com/watch?v=PCaTEZJ1gxU"), transcript: `Sacred Space is very close to my heart — and a little different from the other gatherings I’ve described. I started it during COVID, paused it last year, and I’m considering bringing it back.

It’s a 30-minute online gathering during the workday, usually from 12:00 to 12:30, where faculty and staff join me for a time of spiritual formation.

We’ve practiced Lectio Divina, Visio Divina, virtual prayer walks around campus (even while sitting at our desks!), and the Examen. I also created a “Liturgy of the Workday” to help integrate faith right into the rhythms of work.

For the faculty and staff who joined, it was a deeply meaningful time — they felt seen, not just as professors who are Christians, but as Christian professors. Spiritual formation is a huge passion of mine, and this gathering became a way to pour that out. I’m not running it currently, but it may reappear in the spring.` },
  ],
  hank: [
    { id: "ha-coffee", title: "Hallway Coffee Drop‑ins", rhythm: "daily", type: "practice", engagement: "hospitality", text: "Open door with coffee; greet 2–3 colleagues and make connections.", transcript: "Informal welcome fosters cross-department introductions and builds trust over time." },
    { id: "ha-prayerwalk", title: "Lunchtime Prayer Walk", rhythm: "weekly", type: "practice", engagement: "prayer", text: "Pair walk; note names/needs on campus and pray as you walk.", transcript: "Prayerful attentiveness on campus routes creates gentle spiritual rhythms." },
    { id: "ha-brownbag", title: "Brown‑Bag: Faith & Teaching", rhythm: "monthly", type: "gathering", engagement: "discussion", text: "60‑minute lunch discussion; 6–8 faculty share classroom stories and faith intersections.", transcript: "Promotes integration of faith and teaching; simple fellowship with substance." },
    { id: "ha-welcome", title: "Welcome Coffee for New Faculty", rhythm: "semester", type: "event", engagement: "hospitality", text: "Casual meet‑and‑greet with name tags and a 10‑minute vision for community.", transcript: "Provides a friendly on‑ramp for newcomers and identifies persons of peace." },
    { id: "ha-retreat", title: "Mini Quiet Retreat", rhythm: "yearly", type: "gathering", engagement: "prayer", text: "2‑hour retreat for silence, Scripture reflection, and sharing.", transcript: "Refreshes faculty spiritually and re‑centers the community each academic year." },
  ],
  kyle: [
    { id: "ky-prayertriads", title: "Prayer Triads", rhythm: "daily", type: "practice", engagement: "prayer", text: "Short daily check‑in by text or 10‑minute call; weekly longer meeting.", transcript: "Builds consistency and shared spiritual focus across research disciplines." },
    { id: "ky-officehours", title: "Cross‑Campus Virtual Office Hours", rhythm: "weekly", type: "practice", engagement: "video call", text: "45-minute open Zoom door across schools; informal mentoring and conversation.", transcript: "Captures interest and pairs graduate students with prayer partners." },
    { id: "ky-reading", title: "Short-Read Circle", rhythm: "monthly", type: "gathering", engagement: "study", text: "6–8 page reading with prompts; rotating facilitator.", transcript: "Encourages thoughtful reflection and voice development among faculty and postdocs." },
    { id: "ky-mixer", title: "Inter‑School Mixer", rhythm: "semester", type: "event", engagement: "hospitality", text: "1.5-hour meet-and-greet with lightning testimonies.", transcript: "Bridges departments and surfaces future collaborators for faith and work initiatives." },
    { id: "ky-welcome", title: "Welcome Lunch for New Postdocs", rhythm: "yearly", type: "event", engagement: "hospitality", text: "Simple hosted lunch with department admin to greet new postdocs.", transcript: "Locates persons of peace early in the academic year." },
  ],
};

const emptyPlan = { daily: [], weekly: [], monthly: [], semester: [], yearly: [] };

function usePlanState() {
  const [plan, setPlan] = useState(emptyPlan);
  const addItem = (item) => {
    const r = (item.rhythm || "weekly").toLowerCase();
    const key = rhythmKeys.includes(r) ? r : "weekly";
    setPlan((p) => ({ ...p, [key]: [...p[key], { ...item }] }));
  };
  const removeItem = (key, idx) => setPlan((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));
  const updateItem = (key, idx, patch) => setPlan((p) => ({ ...p, [key]: p[key].map((it, i) => i === idx ? { ...it, ...patch } : it) }));
  const reset = () => setPlan(emptyPlan);
  return { plan, addItem, removeItem, updateItem, reset };
}

// ---------- Simple Modal ----------
function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-zinc-100"><X className="h-5 w-5"/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const total = 5;
  const next = () => setStep((s) => Math.min(total, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const bg = "min-h-screen bg-gradient-to-b from-sky-50 via-emerald-50 to-white text-zinc-900";

  // Step 1 — check‑in
  const [pulse, setPulse] = useState({ enthusiasm: "", sensing: "", prayer: "" });

  // Step 2 — expand/collapse subject cards
  const [openSubject, setOpenSubject] = useState(null);

  // Step 3/4 — plan builder
  const { plan, addItem, removeItem, updateItem, reset } = usePlanState();

  // Step 4 — editor modal state
  const [editModal, setEditModal] = useState({ open: false, rk: null, idx: null, item: null });

  // Explorer state
  const [q, setQ] = useState("");
  const [rFilter, setRFilter] = useState("all");
  const [tFilter, setTFilter] = useState("all");
  const [wFilter, setWFilter] = useState("all");
  const [addedIds, setAddedIds] = useState(new Set());
  const [modalItem, setModalItem] = useState(null);
  const [modalView, setModalView] = useState("video");

  const allItems = useMemo(() => Object.entries(storyItems).flatMap(([who, items]) => items.map((it) => ({ ...it, who }))), []);

  const filtered = allItems.filter((it) => {
    const matchQ = q.trim() === "" || (it.title + " " + (it.text || "") + " " + it.who).toLowerCase().includes(q.toLowerCase());
    const matchR = rFilter === "all" || it.rhythm === rFilter;
    const matchT = tFilter === "all" || (it.engagement === tFilter || it.type === tFilter);
    const matchW = wFilter === "all" || it.who === wFilter;
    return matchQ && matchR && matchT && matchW;
  });

  const handleAdd = (it) => {
    addItem(it);
    setAddedIds((prev) => new Set(prev).add(it.id));
  };

  // Export helpers — graphical
  const renderPlanHTML = () => {
    const color = (rk) => ({
      daily: '#E0F2FE',
      weekly: '#ECFCCB',
      monthly: '#FEF3C7',
      semester: '#FCE7F3',
      yearly: '#DCFCE7',
    })[rk] || '#F4F4F5';

    return (
      `<div class="grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">` +
      rhythmKeys.map((rk) => (
        `<div class="card" style="background:${color(rk)};padding:12px;border-radius:12px;border:1px solid #e5e7eb">` +
        `<div style="font-weight:600;text-transform:capitalize;margin-bottom:6px">${rk}</div>` +
        (plan[rk].length
          ? `<ul style="margin:6px 0 0 16px;">` +
            plan[rk].map((it) => (
              `<li style="margin-bottom:6px"><span style="font-weight:600">${it.title}</span><br/><span style="font-size:12px;opacity:.8;text-transform:capitalize">${it.type} • ${it.engagement}</span><br/><span>${it.text || ''}</span></li>`
            )).join('') + `</ul>`
          : `<p style="font-size:12px;opacity:.7;margin:0"><i>No items</i></p>`
        ) +
        `</div>`
      )).join('') +
      `</div>`
    );
  };

  const buildExportHTML = () => {
    const brand = `
      <style>
        :root{--fg:#0f172a;--muted:#475569;--ring:#22c55e}
        body{font-family:system-ui,Segoe UI,Arial,Helvetica,sans-serif;line-height:1.5;padding:28px;color:var(--fg)}
        h1{margin:0 0 12px;font-size:22px}
        h2{margin:18px 0 10px;font-size:16px}
        h3{margin:8px 0 6px;font-size:14px}
        .pill{display:inline-block;padding:2px 8px;border-radius:9999px;background:#e2e8f0;color:#0f172a;font-size:12px;margin-right:6px}
        .section{background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin:10px 0}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
        .meta b{display:inline-block;min-width:110px}
      </style>`;

    const header = `<div class="section" style="display:flex;align-items:center;gap:12px"><div style="width:10px;height:10px;border-radius:9999px;background:var(--ring)"></div><div><h1>GFM Smorgasbord Plan</h1><div><span class="pill">Emerging focus</span><span class="pill">Four Loves</span></div></div></div>`;

    const pulseHTML = `<div class="section"><h2>Pre‑Course Check‑in</h2>
      <div class="meta"><p><b>Enthusiasm</b> ${pulse.enthusiasm || ""}</p>
      <p><b>Sensing</b> ${pulse.sensing || ""}</p>
      <p><b>Prayer/Scripture</b> ${pulse.prayer || ""}</p></div></div>`;

    const planHTML = `<div class="section"><h2>Plan Overview</h2>${renderPlanHTML()}</div>`;

    const vps = `<div class="section"><h2>V/P/S Notes</h2>
      <div class="grid">
        <div><h3>Vision</h3><p>${vpsState.vision || ""}</p></div>
        <div><h3>People</h3><p>${vpsState.people || ""}</p></div>
        <div><h3>Structure</h3><p>${vpsState.structure || ""}</p></div>
      </div>
    </div>`;

    return `<!DOCTYPE html><html><head><meta charset='utf-8'><title>GFM Smorgasbord Plan</title>${brand}</head><body>${header}${pulseHTML}${planHTML}${vps}</body></html>`;
  };

  const downloadWord = () => {
    const html = buildExportHTML();
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "gfm-smorgasbord-plan.doc"; a.click();
    URL.revokeObjectURL(url);
  };

  const openPrintView = () => {
    const html = buildExportHTML();
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(html + `<script>window.onload=()=>window.print()<\/script>`);
    win.document.close();
  };

  const [vpsState, setVpsState] = useState({ vision: "", people: "", structure: "" });

  return (
    <div className={bg}>
      {/* Step 1 */}
      {step === 1 && (
        <StepShell step={1} total={total} onPrev={prev} onNext={next}>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="bg-gradient-to-r from-amber-50 to-emerald-50 border-amber-200">
              <CardHeader>
                <CardTitle>Faculty Continuum</CardTitle>
                <CardDescription>We\'ll emphasize the <span className="font-semibold">Emerging</span> stage in this cohort.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {continuum.map((c) => (
                    <div key={c.key} className={`rounded-2xl p-4 border text-center ${c.focus ? "bg-amber-100/70 border-amber-300 ring-2 ring-amber-400" : "bg-white"}`}>
                      <div className={`font-medium ${c.focus ? "text-amber-900" : "text-zinc-700"}`}>{c.title}</div>
                      {c.focus && <div className="mt-2 text-xs text-amber-800">Locate persons of peace • embody the Four Loves • form simple rhythms.</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-sky-50 to-white">
              <CardHeader>
                <CardTitle>Pre‑Course Check‑in</CardTitle>
                <CardDescription>Quick spiritual/vision temperature‑check for your campus.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Where are you sensing enthusiasm right now?</label>
                  <Textarea value={pulse.enthusiasm} onChange={(e) => setPulse({ ...pulse, enthusiasm: e.target.value })} placeholder="e.g., 3 faculty voiced interest in a monthly brown‑bag…" />
                </div>
                <div>
                  <label className="text-sm font-medium">What might the Holy Spirit be stirring?</label>
                  <Textarea value={pulse.sensing} onChange={(e) => setPulse({ ...pulse, sensing: e.target.value })} placeholder="e.g., hospitality toward new faculty; prayer for student stress…" />
                </div>
                <div>
                  <label className="text-sm font-medium">A short prayer or Scripture you’re holding</label>
                  <Input value={pulse.prayer} onChange={(e) => setPulse({ ...pulse, prayer: e.target.value })} placeholder="e.g., Psalm 90:17" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </StepShell>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <StepShell step={2} total={total} onPrev={prev} onNext={next}>
          <div className="grid md:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <Card
                key={s.id}
                className={`transition-all cursor-pointer ${openSubject===s.id?"ring-2 ring-sky-300":"hover:shadow"}`}
                onClick={() => setOpenSubject(openSubject===s.id?null:s.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-100 ring-2 ring-white shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.photo} alt={`${s.name} headshot`} className="w-full h-full object-cover"/>
                    </div>
                    <div className="mt-3">
                      <div className="text-lg font-semibold">{s.name}</div>
                      <div className="text-sm text-muted-foreground">{s.role}</div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground max-w-prose"><span className="font-medium">Why this example:</span> {s.why}</p>
                  </div>

                  {openSubject===s.id && (
                    <div className="space-y-4 mt-4">
                      {s.videoUrl && (
                        <VideoFrame src={s.videoUrl} title={s.videoLabel || "Intro video"} />
                      )}
                      {s.transcript && (
                        <div>
                          <div className="text-sm font-medium mb-2">Transcript</div>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap bg-zinc-50 border rounded-xl p-3 max-h-64 overflow-auto">{s.transcript}</div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </StepShell>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <StepShell step={3} total={total} onPrev={prev} onNext={next}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Smorgasbord Explorer</h2>
            <p className="text-sm text-muted-foreground">Search by title/description, filter by rhythm, engagement type, or who. Click a card to open details. In the details, use the Video/Transcript toggle when available. Use the green “Added” button state to confirm it’s in your plan.</p>
            <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <ul className="list-disc pl-4 space-y-1">
                <li>Click any card to preview details or watch a short clip.</li>
                <li>Use filters to view by rhythm (daily → yearly), by engagement type, or by who (Paula/Hank/Kyle).</li>
                <li>Press “Add to My Plan” to select an item; the card will highlight in green.</li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-5 gap-3 mb-4">
            <div className="md:col-span-2 relative">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"/>
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"/>
            </div>
            <select className="border rounded-md p-2" value={rFilter} onChange={(e) => setRFilter(e.target.value)}>
              <option value="all">All rhythms</option>
              {rhythmKeys.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="border rounded-md p-2" value={tFilter} onChange={(e) => setTFilter(e.target.value)}>
              <option value="all">All engagement types</option>
              {engagementTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="border rounded-md p-2" value={wFilter} onChange={(e) => setWFilter(e.target.value)}>
              <option value="all">All (who)</option>
              {Object.keys(storyItems).map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((it) => {
              const added = addedIds.has(it.id);
              return (
                <Card key={it.id} className={`transition-shadow cursor-pointer ${added?"ring-2 ring-emerald-300 bg-emerald-50":"hover:shadow-md"}`} onClick={() => setModalItem(it)}>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{it.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">{it.rhythm}</Badge>
                        <Badge variant="outline" className="capitalize">{it.who}</Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className="capitalize">{it.type} • {it.engagement}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{it.text}</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); handleAdd(it); }} className={`w-full ${added?"bg-emerald-600 hover:bg-emerald-700 text-white":""}`}>{added?"Added":"Add to My Plan"}</Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          <Modal open={!!modalItem} title={modalItem?.title} onClose={() => setModalItem(null)}>
            {modalItem && (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground capitalize">{modalItem.who} • {modalItem.rhythm} • {modalItem.type} • {modalItem.engagement}</div>
                {(modalItem.video || modalItem.transcript) && (
                  <div className="flex gap-2">
                    <Button size="sm" variant={modalView==='video' ? 'default' : 'outline'} onClick={() => setModalView('video')} disabled={!modalItem.video}>Video</Button>
                    <Button size="sm" variant={modalView==='transcript' ? 'default' : 'outline'} onClick={() => setModalView('transcript')} disabled={!modalItem.transcript}>Transcript</Button>
                  </div>
                )}
                {modalView==='video' && modalItem.video && (
                  <VideoFrame src={modalItem.video} title={modalItem.title} />
                )}
                {modalView==='transcript' && modalItem.transcript && (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap bg-zinc-50 border rounded-xl p-3 max-h-52 overflow-auto">{modalItem.transcript}</div>
                )}
                <p className="text-sm leading-relaxed">{modalItem.text}</p>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => { handleAdd(modalItem); }} className="flex-1">{addedIds.has(modalItem.id)?"Added":"Add to My Plan"}</Button>
                  <Button variant="outline" onClick={() => setModalItem(null)} className="flex-1">Close</Button>
                </div>
              </div>
            )}
          </Modal>
        </StepShell>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <StepShell step={4} total={total} onPrev={prev} onNext={next}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Refine Your Smorgasbord</h2>
            <p className="text-sm text-muted-foreground">Click an item to open edit mode, then adjust title/description to fit your context.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {rhythmKeys.map((rk) => (
              <Card key={rk} className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="capitalize text-base">{rk}</CardTitle>
                  <CardDescription>Selected items</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan[rk].length === 0 && (
                    <p className="text-sm text-muted-foreground">No items yet.</p>
                  )}
                  {plan[rk].map((it, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border p-2 hover:bg-zinc-50 cursor-pointer"
                      onClick={() => setEditModal({ open: true, rk, idx, item: { ...it } })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{it.title}</div>
                          <div className="text-xs text-muted-foreground capitalize">{it.type} • {it.engagement}</div>
                        </div>
                        <Badge variant="secondary">Edit</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="justify-between">
                  <Badge variant="secondary">{plan[rk].length}</Badge>
                  <div className="text-[10px] text-muted-foreground">Aim for 1–2 per rhythm</div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Editor Modal */}
          <Modal open={editModal.open} title={editModal.item?.title || "Edit item"} onClose={() => setEditModal({ open:false, rk:null, idx:null, item:null })}>
            {editModal.item && (
              <div className="space-y-3">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={editModal.item.title}
                    onChange={(e) => setEditModal((m) => ({ ...m, item: { ...m.item, title: e.target.value } }))}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editModal.item.text || ""}
                    onChange={(e) => setEditModal((m) => ({ ...m, item: { ...m.item, text: e.target.value } }))}
                    placeholder="Describe how you’ll run this for your campus…"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      updateItem(editModal.rk, editModal.idx, { title: editModal.item.title, text: editModal.item.text });
                      setEditModal({ open:false, rk:null, idx:null, item:null });
                    }}
                    className="flex-1"
                  >Save</Button>
                  <Button
                    variant="destructive"
                    onClick={() => { removeItem(editModal.rk, editModal.idx); setEditModal({ open:false, rk:null, idx:null, item:null }); }}
                    className="flex-1"
                  >Remove</Button>
                </div>
              </div>
            )}
          </Modal>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button variant="secondary" onClick={() => setStep(5)}>Proceed to VPS</Button>
          </div>
        </StepShell>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <StepShell step={5} total={total} onPrev={prev} onNext={() => {}}>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-emerald-50/40">
              <CardHeader>
                <CardTitle>Vision</CardTitle>
                <CardDescription>Why these rhythms?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea value={vpsState.vision} onChange={(e) => setVpsState({ ...vpsState, vision: e.target.value })} placeholder="Which Four Loves are we engaging? What fruit do we pray for in 90 days?"/>
              </CardContent>
            </Card>
            <Card className="bg-sky-50/40">
              <CardHeader>
                <CardTitle>People</CardTitle>
                <CardDescription>Ownership & roles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea value={vpsState.people} onChange={(e) => setVpsState({ ...vpsState, people: e.target.value })} placeholder="Who are 1–2 hosts/facilitators? Any person of peace? What\'s realistic time‑wise?"/>
              </CardContent>
            </Card>
            <Card className="bg-amber-50/40">
              <CardHeader>
                <CardTitle>Structure</CardTitle>
                <CardDescription>Lightweight scaffolding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea value={vpsState.structure} onChange={(e) => setVpsState({ ...vpsState, structure: e.target.value })} placeholder="Simple calendar & invites; feedback loop after 2–3 touchpoints."/>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Rendered Plan Preview</CardTitle>
              <CardDescription>This is what your export will look like. Use the buttons to download Word or save to PDF.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: buildExportHTML() }} />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" onClick={downloadWord}><Download className="mr-2 h-4 w-4"/>Download Word</Button>
              <Button onClick={openPrintView}>Open Print View (PDF)</Button>
            </CardFooter>
          </Card>
        </StepShell>
      )}
    </div>
  );
}
