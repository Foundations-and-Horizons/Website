"use server";

import { redirect } from "next/navigation";
import { signIn, signOut, requireAuth } from "@/lib/rodeo/auth";
import * as db from "@/lib/rodeo/db";
import type { ArenaType, Horse, Run, Stay } from "@/lib/rodeo/types";

export type LoginState = { error: string | null };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") || "");
  const ok = await signIn(password);
  if (!ok) {
    return { error: "That password didn't work. Try again." };
  }
  redirect("/rodeo");
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/rodeo");
}

export async function saveRunAction(run: Run): Promise<Run> {
  await requireAuth();
  return db.upsertRun(run);
}

export async function deleteRunAction(id: string): Promise<void> {
  await requireAuth();
  await db.deleteRun(id);
}

export async function saveStayAction(stay: Stay): Promise<Stay> {
  await requireAuth();
  return db.upsertStay(stay);
}

export async function deleteStayAction(id: string): Promise<void> {
  await requireAuth();
  await db.deleteStay(id);
}

export async function saveArenaAction(
  name: string,
  type: ArenaType,
  notes: string
): Promise<void> {
  await requireAuth();
  await db.upsertArena(name, type, notes);
}

export async function saveHorseAction(horse: Horse): Promise<void> {
  await requireAuth();
  await db.upsertHorse(horse);
}

export async function deleteHorseAction(name: string): Promise<void> {
  await requireAuth();
  await db.deleteHorse(name);
}
