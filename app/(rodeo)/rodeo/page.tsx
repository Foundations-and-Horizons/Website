import type { Metadata } from "next";
import { isAuthed, isPasswordConfigured } from "@/lib/rodeo/auth";
import { fetchAll } from "@/lib/rodeo/db";
import LoginForm from "./LoginForm";
import RodeoApp from "./RodeoApp";

export const metadata: Metadata = {
  title: "Rodeo Road Log",
  description: "Track barrel-racing runs, arenas, and travel.",
};

// Reads cookies, so this route always renders per-request.
export const dynamic = "force-dynamic";

export default async function RodeoPage() {
  const authed = await isAuthed();

  if (!authed) {
    return <LoginForm configured={isPasswordConfigured()} />;
  }

  const data = await fetchAll();
  return (
    <RodeoApp
      initialRuns={data.runs}
      initialStays={data.stays}
      initialArenas={data.arenas}
    />
  );
}
