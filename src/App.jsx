import React, { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Download, Search, X, Check, Globe, Users, TrendingUp, Map, Handshake, Church, Rocket, FlaskConical, FileText } from "lucide-react";

/**
 * GFM Cohort Prototype — app.jsx (Final Cohesive Version)
 * - UPDATED: Step 1: Scripture/Prayer box is now a full Textarea.
 * - UPDATED: Step 3: Removed "Example Minister" filter.
 * - UPDATED: Step 4: Changed rhythm card header colors to a lighter, less intense scheme.
 * - UPDATED: Step 1 Continuum uses FlaskConical icon.
 * - UPDATED: Step 3 Rhythm Badges are now full color with white text (Fix for all-black tags).
 * - UPDATED: Step 1 Pre-Course Check-in now has short descriptions below the title.
 * - NEW: Updated Step 1 Continuum with new icons and descriptions based on GFM Continuum PDF.
 * - NEW: Removed CardFooter and structural line from Step 3 cards.
 * - NEW: Added "View Continuum PDF" button to Step 1 CardHeader.
 * - FIXED: Line 21 syntax error (missing closing array bracket)
 * - FIXED: Line 8 missing Lucide-React imports (Map, Handshake, Church, Rocket, FlaskConical, FileText)
 */

const rhythmKeys = ["daily", "weekly", "monthly", "semester", "yearly"];
const engagementTypes = ["prayer", "gathering", "practice", "event", "video call", "study", "hospitality", "conversation", "public talk"];
// FIX: Added closing bracket ']' before the final ')'
const filterOptions = [...new Set([...engagementTypes, ...rhythmKeys, 'practice', 'gathering', 'event', 'video call', 'study', 'hospitality', 'public talk'])];

// Helper to get consistent light background color mapping for Step 4 Rhythm Card Headers
const getStep4HeaderColor = (rk) => {
    switch (rk) {
        case "daily": return "bg-sky-100 text-sky-800";
        case "weekly": return "bg-emerald-100 text-emerald-800";
        case "monthly": return "bg-amber-100 text-amber-800";
        case "semester": return "bg-pink-100 text-pink-800";
        case "yearly": return "bg-lime-100 text-lime-800";
        default: return "bg-zinc-100 text-zinc-800";
    }
};

// NEW Helper: Full color background for Step 3 badges (full color / white text).
const getStep3BadgeColor = (rk) => {
    switch (rk) {
        case "daily": return "bg-sky-600 text-white";
        case "weekly": return "bg-emerald-600 text-white";
        case "monthly": return "bg-amber-600 text-white";
        case "semester": return "bg-pink-600 text-white";
        case "yearly": return "bg-lime-600 text-white";
        default: return "bg-zinc-600 text-white";
    }
};

// This is used for the Step 4 card header border color. Leaving as light shades.
const getRhythmColorHex = (rk) => {
    switch (rk) {
        case "daily": return "#E0F2FE"; // Light Sky
        case "weekly": return "#ECFCCB"; // Light Emerald
        case "monthly": return "#FEF3C7"; // Light Amber
        case "semester": return "#FCE7F3"; // Light Pink
        case "yearly": return "#DCFCE7"; // Light Lime
        default: return '#F4F4F5';
    }
}

const embedFromWatch = (url) => {
    try { const u = new URL(url); const id = u.searchParams.get("v"); return id ? `https://www.youtube.com/embed/${id}` : url; }
    catch { return url; }
};

const VideoFrame = ({ src, title }) => (
    <div className="rounded-xl overflow-hidden shadow-lg">
        <div className="relative pb-[56.25%] h-0 w-full">
            <iframe className="absolute left-0 top-0 h-full w-full" src={src} title={title} frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        </div>
    </div>
);

const StepShell = ({ step, total, onPrev, onNext, children }) => (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-4 md:p-8">
            {/* Progress Indicator */}
            <div className="mb-6">
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / total) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="text-sm text-center text-muted-foreground mt-2">Step {step} of {total}</div>
            </div>

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-800">Smorgasbord Planner</h1>
                    <p className="text-md text-emerald-600 font-medium">GFM Cohort Prototype</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onPrev} disabled={step === 1}><ChevronLeft className="mr-1 h-4 w-4" />Back</Button>
                    <Button onClick={onNext} className="bg-emerald-600 hover:bg-emerald-700">{step === total ? "Finish" : (<>Next<ChevronRight className="ml-1 h-4 w-4" /></>)}</Button>
                </div>
            </div>
            {children}
        </div>
    </div>
);

// UPDATED CONTINUUM ARRAY with new icons and descriptions
const continuum = [
    { 
        key: "prospective", 
        title: "Prospective", 
        icon: Map, 
        description: "Learn about God's movement on campus. Core focus is to Meet faculty and learn their stories and start a network map.", 
    },
    { 
        key: "connected", 
        title: "Connected", 
        icon: Handshake, 
        description: "Cultivate a network of support. Core focus is to Invite faculty to respond to a vision for mission (4 loves) and locate two local partners.", 
    },
    { 
        key: "emerging", 
        title: "Emerging", 
        focus: true, 
        icon: Church, 
        description: "A community has formed. Core focus is to Launch gatherings to engage the four loves. The group has grown in trust and candor and is exploring the four faculty loves.", 
    },
    { 
        key: "establishing", 
        title: "Establishing", 
        icon: Rocket, 
        description: "An engaged missional community is developing. Core focus is to Grow a team to lead the community and organize missional ways to serve.", 
    },
    { 
        key: "catalyzing", 
        title: "Catalyzing", 
        icon: FlaskConical, // <-- Corrected icon name
        description: "The witnessing community is engaging multiple corners. Core focus is to Multiply impact to diverse corners and/or campuses. The group is on mission with the four faculty loves.", 
    },
];

// Updated Paula's top-level transcript (for Step 2 Modal)
const paulaTopLevelTranscript = `I started working on William & Mary’s campus six years ago with my InterVarsity Faculty Ministry hat on. I began meeting with as many people as would meet with me, and by the end of that first semester, I had about 35 names of faculty. That list has now grown to about 80 faculty and staff, about 40 of whom I know personally. I’d say 20 to 25 are actively involved. 

We don’t have one particular gathering — instead, we have a smorgasbord of different events that I invite faculty and staff into. My husband and I also founded a Christian study center called Cambridge House, which has become the epicenter of what I would describe as the university’s faculty ministry. Cambridge House operates as a Christian Study Center at William & Mary. 

We have seven faculty and staff who serve on a Faculty Advisory Council. Their two main goals are to increase faculty and staff involvement in the life of Cambridge House and to advise the Cambridge House staff on our public lecture series. We host weekly, monthly, and semesterly events. 

As InterVarsity chaplain to faculty and staff, I’m usually focused on two things: spending a lot of one-on-one time with people, and communicating regularly with all 80 or so on my mailing list to invite them into the life of these gatherings.`;


// Updated Paula's item-specific transcripts (for Step 3 Modals)
const paulaTranscript_oneonones = `One-on-ones are my favorite part of my job. I have two wonderful dogs that most people who know me recognize instantly because I walk them every day. When I reach out to a faculty or staff member, I usually invite them to take a walk with me on campus or meet for a drink — hot or cold. 

About 95% of the time, they take me up on the dog walk. I’ll meet them at their office, and we’ll stroll around campus for about 30 minutes. I’ve already had 15 to 17 of these walks this semester with faculty. They’re such meaningful, relational times.`;

const paulaTranscript_dinners = `Our Faculty Fellowship Dinners are the highlight of the semester — for both the faculty and for me. We’ve been doing them for about five years at Cambridge House, our Christian Study Center. 

They usually take place on a Wednesday or Thursday evening from 6:00 to 8:00. We generally have between 10 and 14 people. We serve a wonderful meal and then move into a guided conversation that starts with personal sharing and getting to know one another. I always make sure they know how much I appreciate them. 

Sometimes we focus on a topic, like Reimagining a More Robust Faculty Christian Community at William & Mary. Other times, we feature a faculty member who shares about integrating faith into their research. These evenings are always rich and deeply encouraging.`;

const paulaTranscript_openhouse = `On the Saturday morning before classes start in the fall — and again in January — we host what is probably our largest event of the year: an Open House at the Study Center. 

We invite every faculty and staff member, their spouses, their children, our Cambridge House board and staff, and myself as InterVarsity chaplain. We usually see between 30 and 55 people for a light breakfast. Our main goal is to love on them, facilitate conversation, connect them with one another, and bless them as the semester begins. 

They especially love that the event includes their families. Faculty show up with strollers and little ones, and we often see emeritus faculty as well. Spouses really appreciate being included. 

Faculty often help with our dinners and play a big role in inviting colleagues, but this Open House is something I put on almost as a gift to them.`;

const paulaTranscript_morningprayer = `Monthly Morning Prayer began with a professor who returned to William & Mary for a second term after teaching at Wheaton. It’s a huge passion of his, and we’ve been delighted to see it flourish. 

He plans and organizes a liturgical morning prayer in the historic Wren Chapel once a month — on the first Monday or Tuesday of each full month during the semester. It lasts about 30 minutes. 

Cambridge House and I both help spread the word. It’s open to faculty, staff, students, alumni, and the broader community. We usually see between 20 and 35 people. It’s a lovely, grounding rhythm in the life of our campus community.`;

const paulaTranscript_lectures = `Our Public Lecture Series has grown tremendously. The first one was literally in my home — my husband and I were living in Cambridge House at the time — and we had 75 people packed into our basement! A philosophy professor spoke on My Favorite Argument for God, and it was amazing. 

Now, the Faculty Advisory Council plans these lectures and recommends speakers. We hold them in large campus venues, drawing anywhere from 50 to 125 people. We do one per semester. 

It’s a wonderful way for faculty to participate — they make recommendations and help shape the themes. For example, we’ve hosted an economics professor from VCU who spoke on The Economy of the Kingdom of God, and a global health specialist from UNC Chapel Hill who shared a provocative talk titled Unlearning Colonial Ways of Doing Good: But I Meant Well. 

These lectures are probably our most outreach-oriented events, engaging campus discussions from a Christian perspective and welcoming students, faculty, and the Williamsburg community alike.`;

const paulaTranscript_studentbooks = `One of my favorite aspects of partnering with a Christian Study Center as an InterVarsity Faculty Chaplain is this: when we invite professors into the life of Cambridge House, we tell them it’s both a place for you to do ministry and a place for you to be ministered to. They love that idea. 

We invite faculty to lead student discussion groups, offer fireside chats, and mentor students. Many jump at the opportunity. 

A student book discussion might run for three or four weeks — sometimes longer. One math professor led a year-long study on virtue with graduate and undergraduate students. Another biology professor led a year-long book discussion on environmental stewardship and faith — one of our most popular offerings ever.`;

const paulaTranscript_sacredspace = `Sacred Space is very close to my heart — and a little different from the other gatherings I’ve described. I started it during COVID, paused it last year, and I’m considering bringing it back. 

It’s a 30-minute online gathering during the workday, usually from 12:00 to 12:30, where faculty and staff join me for a time of spiritual formation. 

We’ve practiced Lectio Divina, Visio Divina, virtual prayer walks around campus (even while sitting at our desks!), and the Examen. I also created a “Liturgy of the Workday” to help integrate faith right into the rhythms of work. 

For the faculty and staff who joined, it was a deeply meaningful time — they felt seen, not just as professors who are Christians, but as Christian professors. Spiritual formation is a huge passion of mine, and this gathering became a way to pour that out. I’m not running it currently, but it may reappear in the spring.`;

const paulaTranscript_facultybooks = `I’ve only hosted a few of these so far, but I plan to do another soon. One of my favorites was reading Rick Mattson’s Faith Is Like Skydiving: Evangelism in the Academy. I thought, “I know a few missional faculty who’d love to read this with me,” and sure enough, five agreed. 

We met for four sessions, each 60 minutes long, at the business school — and yes, I bought everyone a fancy coffee. Keeping it short and finite really helped people say yes. They loved it, and so did I. 

For the next one — maybe in the new year or next fall — I’m thinking of gathering a group of women professors to read Elaine Howard Ecklund’s upcoming book on the integration of faith and work.`;

const paulaTranscript_facultyfellowship = `We host our Faculty Fellowship Events at Cambridge House near the end of the workday — usually from 3:30 to 4:30 or 4:30 to 5:30. We provide food and drinks and frame the time as both fellowship and conversation around integration — how faith connects with academic life. 

At each event, we feature two faculty members (typically one man and one woman) and invite them to share, in classic InterVarsity fashion, how their Christian faith impacts their work as professors. 

Everyone listens, asks thoughtful questions, and the conversations are rich and personal. We usually have 10 to 18 people. 

The planning is simple: invite one or two faculty you already know and love, provide some snacks, and you have an event. I’ll sometimes ask someone directly, “Would you be willing to speak for five to seven minutes about how your faith shapes your teaching?” — and everyone I’ve asked has always said yes. 

They love it. It’s a simple but powerful way to build community.`;

const subjects = [
    { id: "paula", name: "Paula – William & Mary", role: "InterVarsity Faculty Ministry Chaplain & Cambridge House co‑founder",
        why: "Demonstrates how a Campus Minister can use a smorgasbord of light‑lift rhythms to grow a ministry from emerging contacts to a stable community.",
        photo: "https://github.com/nsiv-gfm/continuum-proto/blob/main/image/paula.jpg?raw=true",
        videoLabel: "Faculty Community Overview", videoUrl: embedFromWatch("https://www.youtube.com/watch?v=z82mretFcss"),
        transcript: paulaTopLevelTranscript
    },
    { id: "hank", name: "Hank — UNC", role: "InterVarsity Campus Minister to Faculty",
        why: "A Campus Minister modeling low‑lift hospitality and relationship‑building that surfaces persons of peace and creates simple on‑ramps to faculty ministry.",
        photo: "https://github.com/nsiv-gfm/continuum-proto/blob/main/image/hank.jpg?raw=true",
        transcript: "Hank's story focuses on daily acts of hallway hospitality and weekly prayer walks, essential practices for a Campus Minister to build trust and connection with faculty.",
    },
    // Kyle updated to USC and Faculty
    { id: "kyle", name: "Kyle — USC", role: "InterVarsity Campus Minister to Faculty",
        why: "A Campus Minister demonstrating how to bridge Emerging → Establishing with virtual office hours and short‑read circles while forming a core faculty team.",
        photo: "https://github.com/nsiv-gfm/continuum-proto/blob/main/image/kyle.jpg?raw=true",
        transcript: "Kyle's method involves utilizing technology for cross-campus connection via virtual office hours and focused study groups to support faculty community.",
    },
];

// Helper map for Step 3 photo display (now less needed but kept for completeness)
const subjectPhotoMap = subjects.reduce((acc, s) => ({ ...acc, [s.id]: { photo: s.photo, name: s.name.split(' – ')[0] } }), {});


const storyItems = {
    paula: [
        { id: "pa-oneonones", title: "Campus Walks & One‑on‑Ones", rhythm: "daily", type: "practice", engagement: "conversation", text: "30‑minute campus walks for relational one‑on‑one conversations. Meetings or walks scheduled weekly.", video: embedFromWatch("https://www.youtube.com/watch?v=tlcSzjqeR9Q"), transcript: paulaTranscript_oneonones },
        { id: "pa-morningprayer", title: "Morning Prayer at Wren Chapel", rhythm: "monthly", type: "gathering", engagement: "prayer", text: "30‑minute liturgical morning prayer in Wren Chapel (first Mon/Tue each full month). Attendance 20–35; open to faculty/staff/students/alumni.", video: embedFromWatch("https://www.youtube.com/watch?v=tf1TStEIWXA"), transcript: paulaTranscript_morningprayer },
        { id: "pa-facultyfellowship", title: "Faculty Fellowship Event", rhythm: "monthly", type: "event", engagement: "testimony", text: "60‑minute late‑afternoon gathering with two faculty speakers.", video: embedFromWatch("https://www.youtube.com/watch?v=282ZRB1YK_s"), transcript: paulaTranscript_facultyfellowship },
        { id: "pa-dinners", title: "Faculty Fellowship Dinner", rhythm: "semester", type: "event", engagement: "meal", text: "10–14 people for dinner & guided conversation.", video: embedFromWatch("https://www.youtube.com/watch?v=_Cu0pZtHQyo"), transcript: paulaTranscript_dinners },
        { id: "pa-lectures", title: "Public Lecture Series", rhythm: "semester", type: "event", engagement: "public talk", text: "FAC‑planned lectures (1/semester) drawing 50–125; econ of the Kingdom, global health, etc.", video: embedFromWatch("https://www.youtube.com/watch?v=ftm3-sBb1vk"), transcript: paulaTranscript_lectures },
        { id: "pa-openhouse", title: "Open House Event", rhythm: "semester", type: "event", engagement: "hospitality", text: "Study Center open house; light breakfast before terms; families welcome (30–55 attend).", video: embedFromWatch("https://www.youtube.com/watch?v=agYyWxpQtDQ"), transcript: paulaTranscript_openhouse },
        { id: "pa-studentbooks", title: "Student Book Discussion", rhythm: "semester", type: "practice", engagement: "study", text: "Faculty‑led discussion group (3–4 weeks; sometimes year‑long) with grad/undergrad students.", video: embedFromWatch("https://www.youtube.com/watch?v=P7VEySRBUnw"), transcript: paulaTranscript_studentbooks },
        { id: "pa-facultybooks", title: "Faculty Book Discussion", rhythm: "yearly", type: "gathering", engagement: "study", text: "Four‑session (60 min) faculty reading group; easy on‑ramp; coffee provided.", video: embedFromWatch("https://www.youtube.com/watch?v=UVW8vX3bFOo"), transcript: paulaTranscript_facultybooks },
        { id: "pa-sacredspace", title: "Sacred Space (Online)", rhythm: "yearly", type: "gathering", engagement: "video call", text: "30‑minute online formation during workday; Lectio/Visio Divina, Examen; paused; may return.", video: embedFromWatch("https://www.youtube.com/watch?v=PCaTEZJ1gxU"), transcript: paulaTranscript_sacredspace },
    ],
    hank: [
        { id: "ha-coffee", title: "Hallway Coffee Drop‑ins", rhythm: "daily", type: "practice", engagement: "hospitality", text: "Open door with coffee; greet 2–3 colleagues and make connections." },
        { id: "ha-prayerwalk", title: "Lunchtime Prayer Walk", rhythm: "weekly", type: "practice", engagement: "prayer", text: "Pair walk; note names/needs and pray as you go." },
        { id: "ha-brownbag", title: "Brown‑Bag: Faith & Teaching", rhythm: "monthly", type: "gathering", engagement: "discussion", text: "60‑minute lunch; 6–8 faculty share classroom stories and faith intersections." },
        { id: "ha-welcome", title: "Welcome Coffee for New Faculty", rhythm: "semester", type: "event", engagement: "hospitality", text: "Casual meet‑and‑greet with name tags and 10‑minute vision." },
        { id: "ha-retreat", title: "Mini Quiet Retreat", rhythm: "yearly", type: "gathering", engagement: "prayer", text: "2‑hour retreat for silence, Scripture reflection, and sharing." },
    ],
    kyle: [
        { id: "ky-prayertriads", title: "Prayer Triads", rhythm: "daily", type: "practice", engagement: "prayer", text: "Short daily check‑in by text or 10‑minute call; weekly longer meeting." },
        { id: "ky-officehours", title: "Cross‑Campus Virtual Office Hours", rhythm: "weekly", type: "practice", engagement: "video call", text: "45-minute open Zoom door across schools; informal mentoring." },
        { id: "ky-reading", title: "Short-Read Circle", rhythm: "monthly", type: "gathering", engagement: "study", text: "6–8 page reading with prompts; rotating facilitator." },
        { id: "ky-mixer", title: "Inter‑School Mixer", rhythm: "semester", type: "event", engagement: "hospitality", text: "1.5-hour meet-and-greet with lightning testimonies." },
        { id: "ky-welcome", title: "Welcome Lunch for New Postdocs", rhythm: "yearly", type: "event", engagement: "hospitality", text: "Simple hosted lunch with department admin to greet new postdocs." },
    ],
};

// Helper map for Step 3 photo display (now less needed but kept for completeness)
const subjectPhotoMap = subjects.reduce((acc, s) => ({ ...acc, [s.id]: { photo: s.photo, name: s.name.split(' – ')[0] } }), {});


const storyItems = {
    paula: [
        { id: "pa-oneonones", title: "Campus Walks & One‑on‑Ones", rhythm: "daily", type: "practice", engagement: "conversation", text: "30‑minute campus walks for relational one‑on‑one conversations. Meetings or walks scheduled weekly.", video: embedFromWatch("https://www.youtube.com/watch?v=tlcSzjqeR9Q"), transcript: paulaTranscript_oneonones },
        { id: "pa-morningprayer", title: "Morning Prayer at Wren Chapel", rhythm: "monthly", type: "gathering", engagement: "prayer", text: "30‑minute liturgical morning prayer in Wren Chapel (first Mon/Tue each full month). Attendance 20–35; open to faculty/staff/students/alumni.", video: embedFromWatch("https://www.youtube.com/watch?v=tf1TStEIWXA"), transcript: paulaTranscript_morningprayer },
        { id: "pa-facultyfellowship", title: "Faculty Fellowship Event", rhythm: "monthly", type: "event", engagement: "testimony", text: "60‑minute late‑afternoon gathering with two faculty speakers.", video: embedFromWatch("https://www.youtube.com/watch?v=282ZRB1YK_s"), transcript: paulaTranscript_facultyfellowship },
        { id: "pa-dinners", title: "Faculty Fellowship Dinner", rhythm: "semester", type: "event", engagement: "meal", text: "10–14 people for dinner & guided conversation.", video: embedFromWatch("https://www.youtube.com/watch?v=_Cu0pZtHQyo"), transcript: paulaTranscript_dinners },
        { id: "pa-lectures", title: "Public Lecture Series", rhythm: "semester", type: "event", engagement: "public talk", text: "FAC‑planned lectures (1/semester) drawing 50–125; econ of the Kingdom, global health, etc.", video: embedFromWatch("https://www.youtube.com/watch?v=ftm3-sBb1vk"), transcript: paulaTranscript_lectures },
        { id: "pa-openhouse", title: "Open House Event", rhythm: "semester", type: "event", engagement: "hospitality", text: "Study Center open house; light breakfast before terms; families welcome (30–55 attend).", video: embedFromWatch("https://www.youtube.com/watch?v=agYyWxpQtDQ"), transcript: paulaTranscript_openhouse },
        { id: "pa-studentbooks", title: "Student Book Discussion", rhythm: "semester", type: "practice", engagement: "study", text: "Faculty‑led discussion group (3–4 weeks; sometimes year‑long) with grad/undergrad students.", video: embedFromWatch("https://www.youtube.com/watch?v=P7VEySRBUnw"), transcript: paulaTranscript_studentbooks },
        { id: "pa-facultybooks", title: "Faculty Book Discussion", rhythm: "yearly", type: "gathering", engagement: "study", text: "Four‑session (60 min) faculty reading group; easy on‑ramp; coffee provided.", video: embedFromWatch("https://www.youtube.com/watch?v=UVW8vX3bFOo"), transcript: paulaTranscript_facultybooks },
        { id: "pa-sacredspace", title: "Sacred Space (Online)", rhythm: "yearly", type: "gathering", engagement: "video call", text: "30‑minute online formation during workday; Lectio/Visio Divina, Examen; paused; may return.", video: embedFromWatch("https://www.youtube.com/watch?v=PCaTEZJ1gxU"), transcript: paulaTranscript_sacredspace },
    ],
    hank: [
        { id: "ha-coffee", title: "Hallway Coffee Drop‑ins", rhythm: "daily", type: "practice", engagement: "hospitality", text: "Open door with coffee; greet 2–3 colleagues and make connections." },
        { id: "ha-prayerwalk", title: "Lunchtime Prayer Walk", rhythm: "weekly", type: "practice", engagement: "prayer", text: "Pair walk; note names/needs and pray as you go." },
        { id: "ha-brownbag", title: "Brown‑Bag: Faith & Teaching", rhythm: "monthly", type: "gathering", engagement: "discussion", text: "60‑minute lunch; 6–8 faculty share classroom stories and faith intersections." },
        { id: "ha-welcome", title: "Welcome Coffee for New Faculty", rhythm: "semester", type: "event", engagement: "hospitality", text: "Casual meet‑and‑greet with name tags and 10‑minute vision." },
        { id: "ha-retreat", title: "Mini Quiet Retreat", rhythm: "yearly", type: "gathering", engagement: "prayer", text: "2‑hour retreat for silence, Scripture reflection, and sharing." },
    ],
    kyle: [
        { id: "ky-prayertriads", title: "Prayer Triads", rhythm: "daily", type: "practice", engagement: "prayer", text: "Short daily check‑in by text or 10‑minute call; weekly longer meeting." },
        { id: "ky-officehours", title: "Cross‑Campus Virtual Office Hours", rhythm: "weekly", type: "practice", engagement: "video call", text: "45-minute open Zoom door across schools; informal mentoring." },
        { id: "ky-reading", title: "Short-Read Circle", rhythm: "monthly", type: "gathering", engagement: "study", text: "6–8 page reading with prompts; rotating facilitator." },
        { id: "ky-mixer", title: "Inter‑School Mixer", rhythm: "semester", type: "event", engagement: "hospitality", text: "1.5-hour meet-and-greet with lightning testimonies." },
        { id: "ky-welcome", title: "Welcome Lunch for New Postdocs", rhythm: "yearly", type: "event", engagement: "hospitality", text: "Simple hosted lunch with department admin to greet new postdocs." },
    ],
};

const emptyPlan = rhythmKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {});

function usePlanState() {
    const [plan, setPlan] = useState(emptyPlan);
    const addItem = (item) => {
        const r = (item.rhythm || "weekly").toLowerCase();
        const key = rhythmKeys.includes(r) ? r : "weekly";
        setPlan((p) => ({ ...p, [key]: [...p[key], { ...item, uuid: crypto.randomUUID() }] }));
    };
    const removeItem = (key, idx) => setPlan((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));
    const updateItem = (key, idx, patch) => setPlan((p) => ({ ...p, [key]: p[key].map((it, i) => i === idx ? { ...it, ...patch } : it) }));
    const reset = () => setPlan(emptyPlan);
    return { plan, addItem, removeItem, updateItem, reset };
}

function Modal({ open, title, onClose, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 md:p-8 border border-zinc-100"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-zinc-800">{title}</h3>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-zinc-100 transition-colors">
                        <X className="h-5 w-5 text-zinc-500" />
                    </button>
                </div>
                {children}
            </motion.div>
        </div>
    );
}

export default function App() {
    const [step, setStep] = useState(1);
    const total = 5;
    const next = () => setStep((s) => Math.min(total, s + 1));
    const prev = () => setStep((s) => Math.max(1, s - 1));

    const bg = "min-h-screen bg-zinc-50 text-zinc-900";

    const [pulse, setPulse] = useState({ enthusiasm: "", sensing: "", prayer: "" });
    const [subjectModal, setSubjectModal] = useState(null);
    const { plan, addItem, removeItem, updateItem, reset } = usePlanState();

    const [editModal, setEditModal] = useState({ open: false, rk: null, idx: null, item: null });
    const [newItemModal, setNewItemModal] = useState({ open: false, item: { rhythm: "weekly", title: "", type: "practice", engagement: "", text: "" } });

    const [q, setQ] = useState("");
    const [rFilter, setRFilter] = useState("all");
    const [tFilter, setTFilter] = useState("all");
    // Removed [wFilter, setWFilter] state as requested by user.
    const [addedIds, setAddedIds] = useState(new Set());
    const [modalItem, setModalItem] = useState(null);
    const [modalView, setModalView] = useState("video");

    React.useEffect(() => {
        if (modalItem || subjectModal) {
            setModalView("video");
        }
    }, [modalItem, subjectModal]);

    const allItems = useMemo(() => Object.entries(storyItems).flatMap(([who, items]) => items.map((it) => ({ ...it, who }))), []);

    // UPDATED: Removed logic for wFilter
    const filtered = useMemo(() => allItems.filter((it) => {
        const searchString = (it.title + " " + (it.text || "") + " " + it.who).toLowerCase();
        const matchQ = q.trim() === "" || searchString.includes(q.toLowerCase());
        const matchR = rFilter === "all" || it.rhythm === rFilter;
        const matchT = tFilter === "all" || it.engagement === tFilter;
        return matchQ && matchR && matchT;
    }), [allItems, q, rFilter, tFilter]);


    // NEW: Group and sort the filtered items for Step 3 display
    const groupedAndSortedItems = useMemo(() => {
        // 1. Group the filtered items
        const itemsByMinister = filtered.reduce((acc, item) => {
            acc[item.who] = acc[item.who] || [];
            acc[item.who].push(item);
            return acc;
        }, {});

        // 2. Iterate through subjects (to maintain minister order: paula, hank, kyle)
        // 3. Sort the items for each minister by rhythm
        const rhythmOrderMap = rhythmKeys.reduce((acc, r, i) => ({ ...acc, [r]: i }), {});

        return subjects
            .filter(s => itemsByMinister[s.id] && itemsByMinister[s.id].length > 0) // Only include ministers with items after filtering
            .map(s => ({
                minister: s,
                items: itemsByMinister[s.id].sort((a, b) => {
                    return rhythmOrderMap[a.rhythm] - rhythmOrderMap[b.rhythm];
                })
            }));

    }, [filtered]);


    const handleAdd = useCallback((it) => { addItem(it); setAddedIds((prev) => new Set(prev).add(it.id)); }, [addItem]);

    // HTML export helpers remain the same
    const renderPlanHTML = () => {
        const color = (rk) => getRhythmColorHex(rk);
        return `<div class="grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;">` +
            rhythmKeys.map((rk) => (
                `<div class="card" style="background:${color(rk)};padding:16px;border-radius:14px;border:1px solid #e5e7eb;box-shadow:0 1px 3px 0 rgba(0,0,0,.05);">` +
                `<div style="font-weight:700;text-transform:uppercase;margin-bottom:8px;font-size:13px">${rk} RHYTHM</div>` +
                (plan[rk].length ? `<ul style="margin:6px 0 0 16px;list-style-type:disc;padding:0;">` +
                    plan[rk].map((it) => `<li style="margin-bottom:12px"><span style="font-weight:600">${it.title}</span><br/><span style="font-size:12px;opacity:.7;text-transform:capitalize">${it.type} • ${it.engagement}</span><br/><span style="font-size:14px">${it.text || ''}</span></li>`).join('') +
                    `</ul>` : `<p style="font-size:14px;opacity:.6;margin:0"><i>No items selected for this rhythm.</i></p>`) + `</div>`
            )).join('') + `</div>`;
    };

    const buildExportHTML = () => {
        const brand = `
            <style>
                :root{--fg:#1f2937;--muted:#6b7280;--ring:#059669;--card-bg:#f9fafb}
                body{font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;line-height:1.6;padding:32px;color:var(--fg);background:#ffffff}
                h1{margin:0 0 16px;font-size:24px;font-weight:800;color:var(--ring)}
                h2{margin:24px 0 12px;font-size:18px;font-weight:700;border-bottom:2px solid #e5e7eb;padding-bottom:4px;}
                h3{margin:12px 0 8px;font-size:16px;font-weight:600}
                p{margin:6px 0}
                .pill{display:inline-block;padding:4px 10px;border-radius:9999px;background:#fde68a;color:#b45309;font-size:12px;margin-right:8px;font-weight:500;border:1px solid #fcd34d}
                .section{background:var(--card-bg);border:1px solid #e5e7eb;border-radius:16px;padding:20px;margin:16px 0}
                .meta p{margin:4px 0}
                .meta b{display:inline-block;min-width:140px;font-weight:700;color:#374151}
                li{margin-left:16px;}
                .meta span{white-space:pre-wrap;} /* for V/P/S textareas */
            </style>`;
        const header = `<div style="text-align:center;padding:16px 0">
            <h1>GFM Smorgasbord Plan</h1>
            <p style="color:#10b981;font-size:16px;font-weight:600">Your Cohort Strategy</p>
        </div>`;
        const pulseHTML = `<div class="section"><h2>Pre‑Course Check‑in & Context</h2>
            <div class="meta" style="margin-top:10px">
                <p><b>Focus Continuum</b> <span class="pill">Emerging</span></p>
                <p><b>Sensing Enthusiasm</b> <span>${pulse.enthusiasm || "N/A"}</span></p>
                <p><b>Holy Spirit Stirring</b> <span>${pulse.sensing || "N/A"}</span></p>
                <p><b>Scripture/Prayer</b> <span>${pulse.prayer || "N/A"}</span></p>
            </div>
        </div>`;
        const planHTML = `<div class="section"><h2>Planned Rhythms & Activities</h2>${renderPlanHTML()}</div>`;
        const vps = `<div class="section"><h2>V/P/S (Vision / People / Structure)</h2>
            <div class="grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;">
                <div><h3>Vision (Why)</h3><p style="white-space:pre-wrap;">${vpsState.vision || "N/A"}</p></div>
                <div><h3>People (Who)</h3><p style="white-space:pre-wrap;">${vpsState.people || "N/A"}</p></div>
                <div><h3>Structure (How)</h3><p style="white-space:pre-wrap;">${vpsState.structure || "N/A"}</p></div>
            </div>
        </div>`;
        return `<!DOCTYPE html><html><head><meta charset='utf-8'><title>GFM Smorgasbord Plan</title>${brand}</head><body>${header}${pulseHTML}${planHTML}${vps}</body></html>`;
    };

    const downloadWord = () => { const html = buildExportHTML(); const blob = new Blob([html], { type: "application/msword" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "gfm-smorgasbord-plan.doc"; a.click(); URL.revokeObjectURL(url); };
    const openPrintView = () => { const html = buildExportHTML(); const win = window.open("", "_blank"); if (!win) return; win.document.open(); win.document.write(html + `<script>window.onload=()=>window.print()<\\/script>`); win.document.close(); };

    const [vpsState, setVpsState] = useState({ vision: "", people: "", structure: "" });


    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className={bg}>
            {/* Step 1 */}
            {step === 1 && (
                <StepShell step={1} total={total} onPrev={prev} onNext={next}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
                        <Card className="bg-amber-50 border-amber-200 shadow-md">
                            <CardHeader className="flex flex-row justify-between items-start"> {/* Modified for button placement */}
                                <div>
                                    <CardTitle className="text-2xl text-amber-900">Faculty Continuum</CardTitle>
                                    <CardDescription className="text-amber-800 text-lg">We'll emphasize the <span className="font-semibold">Emerging</span> stage in this cohort.</CardDescription>
                                </div>
                                <a href="https://github.com/nsiv-gfm/continuum-proto-v2/blob/main/public/continuum_model.pdf" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-400">
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Continuum PDF
                                    </Button>
                                </a>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-3">
                                    {continuum.map((c) => {
                                        const Icon = c.icon;
                                        return (
                                            <div key={c.key} className={`rounded-xl p-4 border text-center transition-all ${c.focus ? "bg-amber-100/80 border-amber-400 ring-4 ring-amber-200 scale-[1.02] shadow-lg" : "bg-white border-zinc-200 hover:bg-zinc-50"}`}>
                                                <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${c.focus ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className={`font-bold text-sm uppercase ${c.focus ? "text-amber-900" : "text-zinc-700"}`}>{c.title}</div>
                                                <div className="mt-2 text-xs text-amber-800 font-medium leading-relaxed min-h-16 flex items-center justify-center text-center">{c.description}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-sky-50 border-sky-200 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-2xl text-sky-900">Pre‑Course Check‑in</CardTitle>
                                <CardDescription className="text-sky-800">Quick spiritual/vision temperature‑check for your campus.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-6">
                                <div>
                                    {/* UPDATED: Added new description and removed placeholder from Textarea */}
                                    <label htmlFor="enthusiasm-input" className="text-sm font-semibold mb-1 block">Sensing Enthusiasm</label>
                                    <p className="text-xs text-muted-foreground mb-2">What is the most promising lead or greatest opportunity for faculty engagement you currently see?</p>
                                    <Textarea id="enthusiasm-input" value={pulse.enthusiasm} onChange={(e) => setPulse({ ...pulse, enthusiasm: e.target.value })} placeholder="" className="min-h-[100px] border border-zinc-300 w-full"/>
                                </div>
                                <div>
                                    {/* UPDATED: Added new description and removed placeholder from Textarea */}
                                    <label htmlFor="sensing-input" className="text-sm font-semibold mb-1 block">Holy Spirit Stirring</label>
                                    <p className="text-xs text-muted-foreground mb-2">What spiritual need or prompt are you sensing on campus or within your faculty network?</p>
                                    <Textarea id="sensing-input" value={pulse.sensing} onChange={(e) => setPulse({ ...pulse, sensing: e.target.value })} placeholder="" className="min-h-[100px] border border-zinc-300 w-full"/>
                                </div>
                                {/* UPDATED: Added new description and removed placeholder from Textarea */}
                                <div>
                                    <label htmlFor="prayer-input" className="text-sm font-semibold mb-1 block">Scripture / Prayer</label>
                                    <p className="text-xs text-muted-foreground mb-2">A short verse, prayer, or theme you're holding for the work ahead.</p>
                                    <Textarea id="prayer-input" value={pulse.prayer} onChange={(e) => setPulse({ ...pulse, prayer: e.target.value })} placeholder="" className="min-h-[100px] border border-zinc-300 w-full"/>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </StepShell>
            )}

            {/* Step 2 */}
            {step === 2 && (
                <StepShell step={2} total={total} onPrev={prev} onNext={next}>
                    <h2 className="text-2xl font-bold text-zinc-800">Campus Minister Examples</h2>
                    {/* Updated description as requested */}
                    <p className="text-sm text-muted-foreground mb-6">Get to know the Campus Ministers whose examples you'll review on the next page.</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {subjects.map((s) => (
                            <motion.div key={s.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
                                <Card className={`transition-all hover:shadow-lg hover:border-emerald-300 cursor-pointer`} onClick={() => setSubjectModal(s)}>
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 ring-4 ring-white shadow-md">
                                                <img src={s.photo} alt={`${s.name} headshot`} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="mt-4">
                                                <div className="text-lg font-bold text-zinc-800">{s.name}</div>
                                                <div className="text-sm text-emerald-600 font-medium">{s.role}</div>
                                            </div>
                                            <p className="mt-3 text-sm text-muted-foreground italic border-t pt-3 max-w-prose">{s.why}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                    <Modal open={!!subjectModal} title={subjectModal?.name || "Campus Minister Example"} onClose={() => setSubjectModal(null)}>
                        {subjectModal && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 border-b pb-4">
                                    <img src={subjectModal.photo} alt={`${subjectModal.name} headshot`} className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-300"/>
                                    <div>
                                        <div className="text-lg font-bold text-zinc-800">{subjectModal.role}</div>
                                        <div className="text-sm text-muted-foreground italic">{subjectModal.why}</div>
                                    </div>
                                </div>
                                {(subjectModal.videoUrl || subjectModal.transcript) && (
                                    <div className="flex gap-3">
                                        <Button size="sm" variant={modalView === 'video' ? 'default' : 'outline'} onClick={() => setModalView('video')} disabled={!subjectModal.videoUrl}>Video</Button>
                                        <Button size="sm" variant={modalView === 'transcript' ? 'default' : 'outline'} onClick={() => setModalView('transcript')} disabled={!subjectModal.transcript}>Transcript</Button>
                                    </div>
                                )}
                                {modalView === 'video' && subjectModal.videoUrl && <VideoFrame src={subjectModal.videoUrl} title={subjectModal.name} />}
                                {modalView === 'transcript' && subjectModal.transcript && (
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap bg-zinc-50 border rounded-xl p-4 max-h-52 overflow-auto text-zinc-700">{subjectModal.transcript}</div>
                                )}
                                <div className="flex justify-end pt-2">
                                    <Button variant="outline" onClick={() => setSubjectModal(null)}>Close</Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </StepShell>
            )}

            {/* Step 3 */}
            {step === 3 && (
                <StepShell step={3} total={total} onPrev={prev} onNext={next}>
                    <div className
