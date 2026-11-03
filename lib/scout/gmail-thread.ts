// Gmail message classifier for Scout. Pure functions: no network calls or sends.
// Caller must fetch the complete Gmail thread and pass all messages in chronological order.
export type GmailMessage = {
  id: string;
  from: string;
  to: string;
  subject: string;
  bodyText: string;
  labels?: string[];
  internalDate?: string;
};
export type ThreadStatus = {
  replied: boolean;
  bounced: boolean;
  optedOut: boolean;
  uncertain: boolean;
  reason: string;
};

function mailbox(header: string): string {
  const match = header.match(/<([^<>]+)>/);
  return (match?.[1] ?? header).trim().toLowerCase();
}
const autoReply = /\b(auto.?reply|out of office|automatic reply|vacation responder)\b/i;
const bounce = /\b(delivery status notification|undeliverable|mail delivery failed|address not found|delivery has failed)\b/i;
const optOut = /\b(unsubscribe|remove me|stop emailing|do not contact|don't contact|no further emails)\b/i;

export function inspectGmailThread(
  messages: GmailMessage[],
  senderAddress: string,
  expectedRecipient: string
): ThreadStatus {
  const hold = (reason: string): ThreadStatus => ({
    replied: false, bounced: false, optedOut: false, uncertain: true, reason
  });
  if (!messages.length || !senderAddress || !expectedRecipient) return hold("Missing thread or addresses");
  const sender = senderAddress.trim().toLowerCase();
  const recipient = expectedRecipient.trim().toLowerCase();
  if (!messages.some(m => mailbox(m.from) === sender && mailbox(m.to) === recipient))
    return hold("Original outgoing message not confirmed");
  const inbound = messages.filter(m => mailbox(m.from) !== sender);
  if (!inbound.length) return { replied: false, bounced: false, optedOut: false, uncertain: false, reason: "No inbound messages in confirmed thread" };
  if (inbound.some(m => bounce.test(m.subject + " " + m.bodyText)))
    return { replied: false, bounced: true, optedOut: false, uncertain: false, reason: "Delivery failure detected" };
  if (inbound.some(m => optOut.test(m.bodyText)))
    return { replied: true, bounced: false, optedOut: true, uncertain: false, reason: "Opt-out detected" };
  if (inbound.some(m => mailbox(m.from) === recipient && !autoReply.test(m.subject + " " + m.bodyText)))
    return { replied: true, bounced: false, optedOut: false, uncertain: false, reason: "Recipient replied" };
  return hold("Inbound message requires manual classification; do not follow up");
}
