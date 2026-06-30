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

const STATUSES = ["idea", "drafted", "posted"] as const;
const STATUS_LABELS = { idea: "Ideas", drafted: "Drafted", posted: "Posted" };

function startOfWeek() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split("T")[0];
}

export default function LinkedInPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
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
    ? Math.floor((Date.now() - new Date(lastPost.posted_date).getTime()) / 86400000)
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">LinkedIn Content</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-[#2a3db4] text-white text-sm px-4 py-2 rounded hover:bg-[#1e2d8a] transition-colors">
          + New Post
        </button>
      </div>

      {/* Cadence bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-6 flex-wrap">
        <div>
          <p className="text-xs text-gray-500">This week</p>
          <p className={`text-2xl font-bold ${postsThisWeek >= 3 ? "text-green-600" : "text-yellow-600"}`}>
            {postsThisWeek}/3
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Days since last post</p>
          <p className="text-2xl font-bold text-gray-800">{daysSincePost !== null ? daysSincePost : "—"}</p>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map((status) => (
          <div key={status}>
            <h2 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              {STATUS_LABELS[status]} ({posts.filter((p) => p.status === status).length})
            </h2>
            <div className="space-y-3">
              {posts.filter((p) => p.status === status).map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow p-4">
                  {post.topic_tag && (
                    <span className="text-xs bg-blue-50 text-blue-600 rounded px-2 py-0.5 mb-2 inline-block">
                      {post.topic_tag}
                    </span>
                  )}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
                    {post.draft_text || "(no text yet)"}
                  </p>
                  {post.posted_date && (
                    <p className="text-xs text-gray-400 mt-1">Posted {post.posted_date}</p>
                  )}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {post.draft_text && (
                      <button
                        onClick={() => copyText(post.id, post.draft_text!)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
                      >
                        {copied === post.id ? "Copied!" : "Copy"}
                      </button>
                    )}
                    {status !== "posted" && (
                      <button onClick={() => markPosted(post)}
                        className="text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1 hover:bg-green-100">
                        Mark posted
                      </button>
                    )}
                    <button onClick={() => { setEditing(post); setShowForm(true); }}
                      className="text-xs text-[#2a3db4] hover:underline">Edit</button>
                    <button onClick={() => remove(post.id)}
                      className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
    status: post?.status || "idea",
    draft_text: post?.draft_text || "",
    topic_tag: post?.topic_tag || "",
    posted_date: post?.posted_date || "",
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{post ? "Edit Post" : "New Post"}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Status</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Post["status"] }))}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
              <option value="idea">Idea</option>
              <option value="drafted">Drafted</option>
              <option value="posted">Posted</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Topic Tag</label>
            <input value={form.topic_tag} onChange={(e) => setForm((f) => ({ ...f, topic_tag: e.target.value }))}
              placeholder="e.g. book chapter, platform demo"
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-0.5">Post Text</label>
            <textarea value={form.draft_text} onChange={(e) => setForm((f) => ({ ...f, draft_text: e.target.value }))}
              rows={6} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
          </div>
          {form.status === "posted" && (
            <div>
              <label className="block text-xs text-gray-600 mb-0.5">Posted Date</label>
              <input type="date" value={form.posted_date} onChange={(e) => setForm((f) => ({ ...f, posted_date: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-5 justify-end">
          <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(post ? { ...form, id: post.id } : form)}
            className="text-sm px-4 py-2 bg-[#2a3db4] text-white rounded hover:bg-[#1e2d8a]">Save</button>
        </div>
      </div>
    </div>
  );
}
