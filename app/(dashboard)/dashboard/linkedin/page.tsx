"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: string;
  status: "idea" | "drafted" | "posted";
  draft_text: string | null;
  topic_tag: string | null;
  posted_date: string | null;
  created_at: string;
};

const TAG_COLORS: Record<string, string> = {
  "operations": "border-purple-400",
  "leadership": "border-blue-400",
  "book": "border-amber-400",
  "strategy": "border-green-400",
  "platform": "border-cyan-400",
  "story": "border-rose-400",
};
function tagColor(tag: string | null) {
  if (!tag) return "border-gray-200";
  const key = Object.keys(TAG_COLORS).find((k) => tag.toLowerCase().includes(k));
  return key ? TAG_COLORS[key] : "border-[#2a3db4]";
}

function startOfWeek() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split("T")[0];
}

function calcStreak(posts: Post[]): number {
  const posted = posts
    .filter((p) => p.status === "posted" && p.posted_date)
    .map((p) => p.posted_date!)
    .sort()
    .reverse();
  if (!posted.length) return 0;
  const weeks = new Set(posted.map((d) => {
    const dt = new Date(d);
    dt.setDate(dt.getDate() - dt.getDay());
    return dt.toISOString().split("T")[0];
  }));
  const weekArr = Array.from(weeks).sort().reverse();
  let streak = 0;
  const now = new Date();
  now.setDate(now.getDate() - now.getDay());
  const thisWeek = now.toISOString().split("T")[0];
  for (let i = 0; i < weekArr.length; i++) {
    const expected = new Date(thisWeek);
    expected.setDate(expected.getDate() - i * 7);
    const exp = expected.toISOString().split("T")[0];
    if (weekArr[i] === exp) streak++;
    else break;
  }
  return streak;
}

function WeeklyRing({ count, goal = 3 }: { count: number; goal?: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const fill = Math.min(count / goal, 1);
  const dash = circ * fill;
  const color = count >= goal ? "#16a34a" : count >= 2 ? "#2a3db4" : count >= 1 ? "#f59e0b" : "#e5e7eb";
  return (
    <svg width={72} height={72} viewBox="0 0 72 72">
      <circle cx={36} cy={36} r={r} fill="none" stroke="#f3f4f6" strokeWidth={7} />
      <circle cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 36 36)" style={{ transition: "stroke-dasharray 0.4s ease" }} />
      <text x={36} y={40} textAnchor="middle" fontSize={18} fontWeight="bold" fill={color}>
        {count}
      </text>
    </svg>
  );
}

const COLUMNS = [
  { status: "idea" as const, label: "In the Vault", emoji: "💡", bg: "bg-amber-50", border: "border-amber-200", header: "text-amber-700" },
  { status: "drafted" as const, label: "Ready to Ship", emoji: "✍️", bg: "bg-blue-50", border: "border-blue-200", header: "text-blue-700" },
  { status: "posted" as const, label: "Live", emoji: "🚀", bg: "bg-green-50", border: "border-green-200", header: "text-green-700" },
];

export default function LinkedInPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("linkedin_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  }
  useEffect(() => { load(); }, []);

  async function save(post: Partial<Post> & { id?: string }) {
    if (post.id) {
      await supabase.from("linkedin_posts").update(post).eq("id", post.id);
    } else {
      await supabase.from("linkedin_posts").insert(post);
    }
    setEditing(null);
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    await supabase.from("linkedin_posts").delete().eq("id", id);
    load();
  }

  async function markPosted(post: Post) {
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("linkedin_posts").update({ status: "posted", posted_date: today }).eq("id", post.id);
    const weekStart = startOfWeek();
    const weekCount = posts.filter((p) => p.status === "posted" && p.posted_date && p.posted_date >= weekStart).length;
    if (weekCount + 1 >= 3) { setCelebrating(true); setTimeout(() => setCelebrating(false), 3000); }
    load();
  }

  async function advanceStatus(post: Post) {
    const next = post.status === "idea" ? "drafted" : "posted";
    if (next === "posted") { markPosted(post); return; }
    await supabase.from("linkedin_posts").update({ status: next }).eq("id", post.id);
    load();
  }

  function copyText(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const weekStart = startOfWeek();
  const postsThisWeek = posts.filter((p) => p.status === "posted" && p.posted_date && p.posted_date >= weekStart).length;
  const lastPost = posts.find((p) => p.status === "posted" && p.posted_date);
  const daysSincePost = lastPost?.posted_date
    ? Math.floor((Date.now() - new Date(lastPost.posted_date + "T12:00:00").getTime()) / 86400000)
    : null;
  const streak = calcStreak(posts);
  const totalPosted = posts.filter((p) => p.status === "posted").length;

  return (
    <div>
      {/* Celebration banner */}
      {celebrating && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-8 py-3 rounded-full shadow-xl text-lg font-bold animate-bounce">
          🎉 Weekly goal smashed! Keep it up!
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LinkedIn Engine</h1>
          <p className="text-sm text-gray-400">Consistency beats virality. Show up every week.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-[#2a3db4] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#1e2d8a] transition-colors font-medium shadow"
        >
          + Capture Idea
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Weekly ring */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4 col-span-2 sm:col-span-1">
          <WeeklyRing count={postsThisWeek} />
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">This Week</p>
            <p className="text-sm font-semibold text-gray-700">{postsThisWeek}/3 posts</p>
            <p className="text-xs text-gray-400">{postsThisWeek >= 3 ? "Goal hit! 🎯" : `${3 - postsThisWeek} to go`}</p>
          </div>
        </div>

        {/* Streak */}
        <div className={`bg-white rounded-xl shadow p-4 ${streak >= 3 ? "ring-2 ring-orange-400" : ""}`}>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Streak</p>
          <p className="text-2xl font-bold text-gray-900">{streak} {streak >= 3 ? "🔥" : streak >= 1 ? "✨" : "💤"}</p>
          <p className="text-xs text-gray-400">{streak === 1 ? "week" : "weeks"} consistent</p>
        </div>

        {/* Days since last post */}
        <div className={`bg-white rounded-xl shadow p-4 ${daysSincePost !== null && daysSincePost > 3 ? "ring-2 ring-red-300" : ""}`}>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Last Post</p>
          <p className={`text-2xl font-bold ${daysSincePost !== null && daysSincePost > 3 ? "text-red-500" : "text-gray-900"}`}>
            {daysSincePost !== null ? `${daysSincePost}d` : "—"}
          </p>
          <p className="text-xs text-gray-400">
            {daysSincePost === null ? "No posts yet" : daysSincePost > 3 ? "Time to post! 👀" : "ago"}
          </p>
        </div>

        {/* Total posted */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">All Time</p>
          <p className="text-2xl font-bold text-gray-900">{totalPosted}</p>
          <p className="text-xs text-gray-400">posts published</p>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colPosts = posts.filter((p) => p.status === col.status);
          return (
            <div key={col.status}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${col.bg} border ${col.border}`}>
                <span className="text-base">{col.emoji}</span>
                <h2 className={`text-sm font-bold uppercase tracking-wide ${col.header}`}>{col.label}</h2>
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.header} border ${col.border}`}>
                  {colPosts.length}
                </span>
              </div>

              <div className="space-y-3">
                {colPosts.length === 0 && (
                  <div className={`border-2 border-dashed ${col.border} rounded-xl p-6 text-center`}>
                    <p className="text-xs text-gray-400">Nothing here yet</p>
                  </div>
                )}
                {colPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 ${tagColor(post.topic_tag)} p-4 group`}
                  >
                    {post.topic_tag && (
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 mb-2 inline-block">
                        #{post.topic_tag}
                      </span>
                    )}
                    <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4 leading-relaxed">
                      {post.draft_text || <span className="italic text-gray-400">No text yet — add a draft</span>}
                    </p>
                    {post.draft_text && (
                      <p className="text-xs text-gray-300 mt-1">{post.draft_text.length} chars</p>
                    )}
                    {post.posted_date && (
                      <p className="text-xs text-gray-400 mt-1">📅 {post.posted_date}</p>
                    )}

                    <div className="mt-3 flex gap-2 flex-wrap items-center">
                      {post.draft_text && (
                        <button
                          onClick={() => copyText(post.id, post.draft_text!)}
                          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 transition-colors"
                        >
                          {copied === post.id ? "✅ Copied!" : "📋 Copy"}
                        </button>
                      )}
                      {post.status !== "posted" && (
                        <button
                          onClick={() => advanceStatus(post)}
                          className={`text-xs font-semibold rounded-lg px-3 py-1 transition-colors ${
                            post.status === "drafted"
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          {post.status === "idea" ? "→ Draft it" : "🚀 Post it!"}
                        </button>
                      )}
                      <button
                        onClick={() => { setEditing(post); setShowForm(true); }}
                        className="text-xs text-gray-400 hover:text-[#2a3db4] transition-colors ml-auto"
                      >
                        Edit
                      </button>
                      <button onClick={() => remove(post.id)} className="text-xs text-gray-300 hover:text-red-500 transition-colors">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <PostForm
          post={editing}
          onSave={save}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function PostForm({ post, onSave, onClose }: {
  post: Post | null;
  onSave: (p: Partial<Post> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    status: post?.status || "idea" as Post["status"],
    draft_text: post?.draft_text || "",
    topic_tag: post?.topic_tag || "",
    posted_date: post?.posted_date || "",
  });

  const charCount = form.draft_text.length;
  const charColor = charCount > 3000 ? "text-red-500" : charCount > 2500 ? "text-amber-500" : "text-gray-400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <h2 className="text-lg font-bold mb-4">{post ? "Edit Post" : "✨ New Post Idea"}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Status</label>
            <div className="flex gap-2">
              {(["idea", "drafted", "posted"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.status === s
                      ? "bg-[#2a3db4] text-white border-[#2a3db4]"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {s === "idea" ? "💡 Idea" : s === "drafted" ? "✍️ Drafted" : "🚀 Posted"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Topic Tag</label>
            <input
              value={form.topic_tag}
              onChange={(e) => setForm((f) => ({ ...f, topic_tag: e.target.value }))}
              placeholder="e.g. operations, leadership, book, strategy"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Post Text</label>
              <span className={`text-xs ${charColor}`}>{charCount} / 3000</span>
            </div>
            <textarea
              value={form.draft_text}
              onChange={(e) => setForm((f) => ({ ...f, draft_text: e.target.value }))}
              rows={7}
              placeholder="Write your post here..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30 resize-none"
            />
          </div>
          {form.status === "posted" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Posted Date</label>
              <input
                type="date"
                value={form.posted_date}
                onChange={(e) => setForm((f) => ({ ...f, posted_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3db4]/30"
              />
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave(post ? { ...form, id: post.id } : form)}
            className="flex-1 py-2.5 bg-[#2a3db4] text-white rounded-lg text-sm font-semibold hover:bg-[#1e2d8a]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
