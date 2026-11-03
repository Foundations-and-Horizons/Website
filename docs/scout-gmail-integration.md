# Scout v1 Gmail connection — deployment gate

Status: NOT CONNECTED. The ChatGPT Gmail connector does not authorize the independently deployed F&H Next.js application.

## Required owner-assisted Google authorization
1. Choose the F&H Google account as the sole sender.
2. Create or select a Google Cloud project owned by F&H, configure OAuth consent and an authorized redirect URI for the F&H app.
3. Request the minimum Gmail OAuth scopes required for reading threads and sending mail. Confirm whether Google app verification is needed before production.
4. Have the account owner complete Google consent. Store tokens encrypted server-side; never put a refresh token, client secret, or service-role key in NEXT_PUBLIC variables, GitHub, or logs.
5. Implement server-side token refresh, scope checks, revocation handling, and thread pagination. Confirm actual sent-message IDs and Gmail thread IDs.
6. Verify signature behavior: Gmail API sends may not automatically append the signature. Append the approved F&H signature explicitly, once.
7. Before any initial outreach, search Gmail Sent and Inbox for prior contact with the organization and recipient. Block on ambiguity. Before follow-up, fetch complete thread, check replies, bounces, and opt-outs.
8. Write durable idempotency records and CRM activity, with explicit send states to recover from partial failures. Never retry an ambiguous send automatically.
9. Add authentication and authorization to any Scout admin or scheduled endpoint; scheduled jobs must not be public.
10. Test five real, sourced prospects in draft-only mode; require explicit launch approval after reviewing results.

## Non-negotiable gates
- No production deployment, scheduler, or live send while OAuth and CRM reconciliation remain unverified.
- No fabricated contact verification or research. Do not treat syntactically valid email as verified.
- Follow-up at most once, at least seven days after confirmed initial send; stop on reply, bounce, or opt-out.
- Keep unrelated USANA, Lazy B, and other projects isolated.
