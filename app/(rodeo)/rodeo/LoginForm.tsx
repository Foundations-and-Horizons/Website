"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "linear-gradient(180deg,#6FD0C4 0%,#46B5A8 100%)",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#E8D7B9",
          borderRadius: 22,
          padding: 28,
          boxShadow: "0 12px 34px rgba(42,33,27,.25)",
          border: "2px dashed rgba(46,139,139,.6)",
        }}
      >
        <div
          style={{
            fontFamily:
              "'Arial Narrow','Helvetica Neue Condensed',Impact,system-ui,sans-serif",
            fontWeight: 800,
            fontSize: 34,
            lineHeight: 0.95,
            color: "#2A211B",
            letterSpacing: ".01em",
          }}
        >
          RODEO ROAD LOG
        </div>
        <div style={{ color: "#5C3A21", fontSize: 14, marginTop: 6 }}>
          Enter the family password to continue.
        </div>

        {!configured && (
          <div
            style={{
              marginTop: 14,
              background: "rgba(190,75,35,.12)",
              color: "#BE4B23",
              fontSize: 13,
              borderRadius: 10,
              padding: "10px 12px",
            }}
          >
            Setup isn&rsquo;t finished yet — a family password hasn&rsquo;t been
            configured on the server.
          </div>
        )}

        <form action={action} style={{ marginTop: 18 }}>
          <label
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              color: "#5C3A21",
              marginBottom: 6,
            }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            autoFocus
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "11px 12px",
              borderRadius: 10,
              border: "2px solid rgba(217,154,61,.5)",
              background: "#fff",
              fontSize: 16,
              color: "#2A211B",
            }}
          />
          {state.error && (
            <div style={{ color: "#BE4B23", fontSize: 13, marginTop: 8 }}>
              {state.error}
            </div>
          )}
          <button
            type="submit"
            disabled={pending}
            style={{
              width: "100%",
              marginTop: 16,
              padding: 13,
              borderRadius: 999,
              border: "none",
              background: "#BE4B23",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              opacity: pending ? 0.6 : 1,
            }}
          >
            {pending ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
