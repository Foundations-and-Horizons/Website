/**
 * Dashboard access control flag.
 *
 * When the environment variable `DASHBOARD_PUBLIC` is set to "true", the
 * dashboard is served WITHOUT requiring a Supabase login. This is intended
 * for temporarily sharing the dashboard UI (e.g. for design feedback from
 * other tools) — it exposes real data to anyone with the URL, so leave it
 * unset (or "false") in normal operation and only flip it on deliberately.
 *
 * Toggle it in your host (e.g. Vercel → Project → Settings → Environment
 * Variables) without any code change, then redeploy.
 */
export function isDashboardPublic(): boolean {
  return process.env.DASHBOARD_PUBLIC === "true";
}
