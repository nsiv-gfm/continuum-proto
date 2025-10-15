import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Download, Search, X } from "lucide-react";

/**
 * GFM Cohort Prototype — Round 2 Visual + UX Enhancements
 * -------------------------------------------------
 * Pages:
 * 1) Continuum (accent Emerging) + Pre‑course Check‑in
 * 2) Introductions (Paula, Hank, Kyle) with bios, photos, Paula video + transcript; cards expand on click
 * 3) Smorgasbord Explorer (searchable; filter by rhythm, engagement, and who; modal with details + video/transcript; add‑state feedback)
 * 4) Smorgasbord Refinement (click to expand an item then edit)
 * 5) VPS Dialog Prep (rendered preview; Word/PDF export; JSON hidden)
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
  // converts https://www.youtube.com/watch?v=ID to https://www.youtube.com/embed/ID
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

// ---------- Data (Paula real; Hank/Kyle temp) ----------
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
    transcript: `Faculty Community Overview:

I started working on William Mary\'s campus six years ago with my InterVarsity faculty ministry hat on, and started meeting with as many people as would meet with me, and by the end of that first semester, I had about 35 names of faculty, and that list has grown to about 80 faculty and staff today, of whom I know 40 or so personally. And I would say 20 to 25 are actively involved. But in terms of structures, we have no one particular gathering. We have a smorgasbord of many different events that I invite faculty and staff into. But I also will say that my husband and I founded a Christian study center called Cambridge House, and so the epicenter of what I would describe as the university faculty ministry, really is located under the umbrella of a Christian Study Center at William and Mary.`,
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

// Paula items (expanded to 9); Hank/Kyle temp to match count with good rhythm spread
const storyItems = {
  paula: [
    // DAILY
    { id: "pa-oneonones", title: "Campus Walks & One‑on‑Ones", rhythm: "daily", type: "practice", engagement: "conversation", text: "30‑minute campus walks for relational one‑on‑one conversations. Meetings or walks scheduled weekly.", video: embedFromWatch("https://www.youtube.com/watch?v=tlcSzjqeR9Q"), transcript: "Build trust and listen to stories. Spiritual friendship & connection." },
    // MONTHLY
    { id: "pa-morningprayer", title: "Morning Prayer at Wren Chapel", rhythm: "monthly", type: "gathering", engagement: "prayer", text: "30‑minute liturgical morning prayer in Wren Chapel (first Mon/Tue each full month). Attendance 20–35; open to faculty/staff/students/alumni.", video: embedFromWatch("https://www.youtube.com/watch?v=tf1TStEIWXA"), transcript: "Cultivate shared spiritual rhythm on campus." },
    { id: "pa-facultyfellowship", title: "Faculty Fellowship Event", rhythm: "monthly", type: "event", engagement: "testimony", text: "60‑minute late‑afternoon gathering with two faculty speakers.", video: embedFromWatch("https://www.youtube.com/watch?v=282ZRB1YK_s"), transcript: "Share faith‑and‑work integration stories." },
    // SEMESTER
    { id: "pa-dinners", title: "Faculty Fellowship Dinner", rhythm: "semester", type: "event", engagement: "meal", text: "10–14 people for dinner & guided conversation.", video: embedFromWatch("https://www.youtube.com/watch?v=_Cu0pZtHQyo"), transcript: "Deepen relationships & vision for faculty community." },
    { id: "pa-lectures", title: "Public Lecture Series", rhythm: "semester", type: "event", engagement: "public talk", text: "Faculty Advisory Council–planned lectures (1/semester) drawing 50–125; topics include economics of the Kingdom, global health, etc.", video: embedFromWatch("https://www.youtube.com/watch?v=ftm3-sBb1vk"), transcript: "Engage the university with a Christian perspective; welcome campus & community." },
    { id: "pa-openhouse", title: "Open House Event", rhythm: "semester", type: "event", engagement: "hospitality", text: "Study Center open house with light breakfast before fall & January terms; families welcome (30–55 attend).", video: embedFromWatch("https://www.youtube.com/watch?v=agYyWxpQtDQ"), transcript: "Hospitality & blessing as semester begins; facilitate connection." },
    { id: "pa-studentbooks", title: "Student Book Discussion", rhythm: "semester", type: "practice", engagement: "study", text: "Faculty‑led discussion group (often 3–4 weeks; sometimes year‑long) with grad/undergrad students.", video: embedFromWatch("https://www.youtube.com/watch?v=P7VEySRBUnw"), transcript: "Mentoring students and strengthening faculty–student connection." },
    // YEARLY
    { id: "pa-facultybooks", title: "Faculty Book Discussion", rhythm: "yearly", type: "gathering", engagement: "study", text: "Four‑session (60 min) faculty reading group; easy on‑ramp; provide coffee; hosted in campus space.", video: embedFromWatch("https://www.youtube.com/watch?v=UVW8vX3bFOo"), transcript: "Equip faculty for missional presence; finite commitment increases participation." },
    { id: "pa-sacredspace", title: "Sacred Space (Online)", rhythm: "yearly", type: "gathering", engagement: "video call", text: "30‑minute online spiritual formation gathering during workday (12:00–12:30). Practices: Lectio/Visio Divina, Examen, virtual prayer walks. Currently paused; may return.", video: embedFromWatch("https://www.youtube.com/watch?v=PCaTEZJ1gxU"), transcript: "Integrate faith and workday rhythms for faculty/staff." },
  ],
  hank: [
    { id: "ha-coffee", title: "Hallway Coffee Drop‑ins", rhythm: "daily", type: "practice", engagement: "hospitality", text: "Open door with coffee; greet 2–3 colleagues and make connections.", transcript: "Informal welcome fosters cross‑department intros." },
    { id: "ha-prayerwalk", title: "Lunchtime Prayer Walk", rhythm: "weekly", type: "practice", engagement: "prayer", text: "Pair walk; note names/needs.", transcript: "Prayerful attentiveness on campus routes." },
    { id: "ha-brownbag", title: "Brown‑Bag: Faith & Teaching", rhythm: "monthly", type: "gathering", engagement: "discussion", text: "60‑min prompt; 6–8 attend.", transcript: "Syllabus moments, office‑hour care." },
    { id: "ha-welcome", title: "Welcome Coffee for New Faculty", rhythm: "semester", type: "event", engagement: "hospitality", text: "Name‑tag mingle + 10‑min vision.", transcript: "Easy on‑ramp for newcomers." },
    { id: "ha-guest", title: "Guest Lab Tour + Story", rhythm: "semester", type: "event", engagement: "public talk", text: "5‑min origin story + 20‑min lab demo.", transcript: "Bridges across departments." },
    { id: "ha-reading", title: "Article Swap", rhythm: "monthly", type: "gathering", engagement: "study", text: "Share one short read and a question.", transcript: "Rotate facilitators to build ownership." },
    { id: "ha-officehour", title: "Open Office Hour for Grads", rhythm: "weekly", type: "practice", engagement: "conversation", text: "Mentor slot for grad students.", transcript: "Creates gentle mentoring channel." },
    { id: "ha-retreat", title: "Mini Quiet Retreat", rhythm: "yearly", type: "gathering", engagement: "prayer", text: "2‑hour silence + sharing.", transcript: "Refresh & re‑center mid‑year." },
    { id: "ha-panel", title: "Faith & Research Lightning Panel", rhythm: "semester", type: "event", engagement: "public talk", text: "3x5‑min testimonies.", transcript: "Surface stories; invite next steps." },
  ],
  kyle: [
    { id: "ky-officehours", title: "Cross‑Campus Virtual Office Hours", rhythm: "weekly", type: "practice", engagement: "video call", text: "45‑min Zoom open door across schools.", transcript: "Captures interest and pairs prayer partners." },
    { id: "ky-reading", title: "Short‑Read Circle", rhythm: "monthly", type: "gathering", engagement: "study", text: "One 6–8 page essay + prompts.", transcript: "Rotating facilitator to grow voice." },
    { id: "ky-mixer", title: "Inter‑School Mixer", rhythm: "semester", type: "event", engagement: "hospitality", text: "1.5‑hr mingle + lightning testimonies.", transcript: "Collects leads for core team." },
    { id: "ky-retreat", title: "Half‑Day Quiet Retreat", rhythm: "semester", type: "gathering", engagement: "prayer", text: "Guided Lectio + silence + sharing.", transcript: "Refresh + discernment." },
    { id: "ky-panels", title: "Faith & Field Student Panel", rhythm: "semester", type: "event", engagement: "public talk", text: "3 faculty + 3 students discuss vocation.", transcript: "Bridge student‑faculty vocations." },
    { id: "ky-prayertriads", title: "Prayer Triads", rhythm: "daily", type: "practice", engagement: "prayer", text: "Short daily check‑in by text or 10‑minute call; weekly longer meet.", transcript: "Sustainable micro‑community." },
    { id: "ky-welcome", title: "Welcome Lunch for New Postdocs", rhythm: "yearly", type: "event", engagement: "hospitality", text: "Hosted with dept admin.", transcript: "Locate persons of peace early." },
    { id: "ky-skillshare", title: "Skill‑Share Mini‑workshops", rhythm: "monthly", type: "gathering", engagement: "discussion", text: "Peer tips on advising & teaching.", transcript: "Practical and relational." },
    { id: "ky-reading2", title: "Prayer & Paper Check‑in", rhythm: "daily", type: "practice", engagement: "study", text: "5‑minute morning text ‘what’s your focused task + a prayer’.", transcript: "Blends formation and productivity." },
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

// ---------- Main App ----------
export default function App() {
  const [step, setStep] = useState(1);
  const total = 5;
  const next = () => setStep((s) => Math.min(total, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  // Visual polish (background gradient w/ color)
  const bg = "min-h-screen bg-gradient-to-b from-sky-50 via-emerald-50 to-white text-zinc-900";

  // Step 1 — check‑in
  const [pulse, setPulse] = useState({ enthusiasm: "", sensing: "", prayer: "" });

  // Step 2 — expand/collapse subject cards
  const [openSubject, setOpenSubject] = useState(null);

  // Step 3/4 — plan builder
  const { plan, addItem, removeItem, updateItem, reset } = usePlanState();

  // Explorer state
  const [q, setQ] = useState("");
  const [rFilter, setRFilter] = useState("all");
  const [tFilter, setTFilter] = useState("all");
  const [wFilter, setWFilter] = useState("all");
  const [addedIds, setAddedIds] = useState(new Set());
  const [modalItem, setModalItem] = useState(null);
  const [modalView, setModalView] = useState("video");

  const allItems = useMemo(() => {
    return Object.entries(storyItems).flatMap(([who, items]) => items.map((it) => ({ ...it, who })));
  }, []);

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

  // Step 4 — click to enable editing per item
  const [openEditors, setOpenEditors] = useState({});
  const toggleEditor = (rk, idx) => setOpenEditors((s) => ({ ...s, [`${rk}-${idx}`]: !s[`${rk}-${idx}`] }));

  // Export — rendered preview + Word/PDF
  const renderPlanHTML = () => {
    return (
      `<div>` +
      rhythmKeys.map((rk) => (
        `<h3 style="margin:12px 0">${rk[0].toUpperCase() + rk.slice(1)}</h3>` +
        (plan[rk].length ? `<ul>` + plan[rk].map((it) => `<li><b>${it.title}</b> <i>(${it.type} · ${it.engagement})</i><br/><span>${it.text || ""}</span></li>`).join("") + `</ul>` : `<p><i>No items</i></p>`) 
      )).join("") +
      `</div>`
    );
  };

  const buildExportHTML = () => {
    const pulseHTML = `<h2>Pre‑Course Check‑in</h2>
      <p><b>Enthusiasm:</b> ${pulse.enthusiasm || ""}</p>
      <p><b>Sensing:</b> ${pulse.sensing || ""}</p>
      <p><b>Prayer/Scripture:</b> ${pulse.prayer || ""}</p>`;
    const vps = `<h2>V/P/S Notes</h2>
      <p><b>Vision:</b> ${vpsState.vision || ""}</p>
      <p><b>People:</b> ${vpsState.people || ""}</p>
      <p><b>Structure:</b> ${vpsState.structure || ""}</p>`;
    const planHTML = `<h2>Plan</h2>${renderPlanHTML()}`;

    return `<!DOCTYPE html><html><head><meta charset='utf-8'><title>GFM Smorgasbord Plan</title>
      <style>body{font-family:system-ui,Segoe UI,Arial,Helvetica,sans-serif;line-height:1.4;padding:24px} h1{margin:0 0 8px} h2{margin:18px 0 8px} h3{margin:12px 0 6px} ul{margin:6px 0 14px}</style>
      </head><body>
      <h1>GFM Smorgasbord Plan</h1>
      ${pulseHTML}
      ${planHTML}
      ${vps}
    </body></html>`;
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

  // VPS state
  const [vpsState, setVpsState] = useState({ vision: "", people: "", structure: "" });

  return (
    <div className={bg}>
      {/* Step 1: Continuum + Check‑in */}
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

      {/* Step 2: Introductions (expand on click) */}
      {step === 2 && (
        <StepShell step={2} total={total} onPrev={prev} onNext={next}>
          <div className="grid md:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <Card key={s.id} className={`transition-all ${openSubject===s.id?"ring-2 ring-sky-300":"hover:shadow"}`} onClick={() => setOpenSubject(openSubject===s.id?null:s.id)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.photo} alt={`${s.name} headshot`} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{s.name}</div>
                      <CardDescription>{s.role}</CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground"><span className="font-medium">Why this example:</span> {s.why}</p>
                  {openSubject===s.id && (
                    <div className="space-y-4">
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

      {/* Step 3: Explorer (search + filters + who + modal + add state) */}
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

      {/* Step 4: Refinement (click item to edit) */}
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
                  {plan[rk].map((it, idx) => {
                    const key = `${rk}-${idx}`;
                    const open = !!openEditors[key];
                    return (
                      <div key={idx} className={`rounded-lg border p-2 ${open?"bg-sky-50 border-sky-200":"hover:bg-zinc-50"}`} onClick={() => toggleEditor(rk, idx)}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{it.title}</div>
                            <div className="text-xs text-muted-foreground capitalize">{it.type} • {it.engagement}</div>
                          </div>
                          <Badge variant="secondary">{open?"Editing":"Click to edit"}</Badge>
                        </div>
                        {open && (
                          <div className="mt-2 space-y-2">
                            <Input value={it.title} onChange={(e) => updateItem(rk, idx, { title: e.target.value })} />
                            <Textarea value={it.text || ""} onChange={(e) => updateItem(rk, idx, { text: e.target.value })} placeholder="Describe how you’ll run this for your campus…"/>
                            <div className="flex justify-end">
                              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); removeItem(rk, idx); }}>Remove</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
                <CardFooter className="justify-between">
                  <Badge variant="secondary">{plan[rk].length}</Badge>
                  <div className="text-[10px] text-muted-foreground">Aim for 1–2 per rhythm</div>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button variant="secondary" onClick={() => setStep(5)}>Proceed to VPS</Button>
          </div>
        </StepShell>
      )}

      {/* Step 5: VPS + Export (rendered preview, JSON hidden) */}
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
                <div dangerouslySetInnerHTML={{ __html: `<h2>Pre‑Course Check‑in</h2>
                  <p><b>Enthusiasm:</b> ${pulse.enthusiasm || ""}</p>
                  <p><b>Sensing:</b> ${pulse.sensing || ""}</p>
                  <p><b>Prayer/Scripture:</b> ${pulse.prayer || ""}</p>
                  <h2>Plan</h2>${renderPlanHTML()}
                  <h2>V/P/S Notes</h2>
                  <p><b>Vision:</b> ${vpsState.vision || ""}</p>
                  <p><b>People:</b> ${vpsState.people || ""}</p>
                  <p><b>Structure:</b> ${vpsState.structure || ""}</p>` }} />
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
