/**
 * VAAS-X Marketing Agent — drafts only.
 * HARD RULE: never transmit email, posts, or API outbound.
 * Release actions are clipboard copy or mailto: draft (user still hits Send).
 */

import { FUNNEL, CONTACTS, VERTICAL_LABELS, STAGE_LABELS } from "./funnel-data.js";

const STORAGE_KEY = "vaasx_marketing_agent_queue_v1";
const POLICY =
  "POLICY: This agent never sends. It only drafts. You must Approve, then Release (copy or open a mail draft). Your mail/social client still requires you to hit Send.";

const SITE = "https://vaasx.com";
const MCP = "https://mcp.vaasx.com/mcp";
const SALES = "sales@vaasx.com";

function uid() {
  return `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function loadQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

function emailBodyForContact(contact) {
  const vertical = VERTICAL_LABELS[contact.vertical] || contact.vertical;
  return (
    `Hi,\n\n` +
    `I'm reaching out from VAAS-X about persistent, outcome-grounded episodic memory ` +
    `for ${vertical.toLowerCase()} workloads (${SITE}).\n\n` +
    `Why ${contact.org}: ${contact.why}\n\n` +
    `Two ways to try the live product:\n` +
    `• SDK: pip install vaas-x — free API key at ${SITE}\n` +
    `• MCP: add ${MCP} in Claude Connectors\n\n` +
    `Happy to share a short demo or walk a guide on your stream.\n\n` +
    `Best,\nVAAS-X\n${SALES}`
  );
}

function linkedInDraft(verticalKey) {
  const label = VERTICAL_LABELS[verticalKey] || "AI systems";
  return (
    `Most AI systems are stateless — they process data and discard it.\n\n` +
    `VAAS-X gives ${label.toLowerCase()} teams persistent memory of what was observed, ` +
    `what action was taken, and what the outcome was — recalled in milliseconds on CPU.\n\n` +
    `Not a chatbot. Not a vector database. Operational memory infrastructure.\n\n` +
    `• SDK: pip install vaas-x → ${SITE}\n` +
    `• MCP: ${MCP}\n` +
    `Free API key, no card.`
  );
}

/**
 * Propose a batch of draft actions. Nothing is sent.
 */
export function proposeActions({ focusStage = "awareness", max = 5 } = {}) {
  const stage = FUNNEL.find((s) => s.id === focusStage) || FUNNEL[0];
  const stageContacts = CONTACTS.filter(
    (c) => c.stage === focusStage && c.status !== "owned"
  );
  const publicOrPersona = stageContacts.filter((c) =>
    ["public-channel", "persona-target", "ecosystem"].includes(c.status)
  );

  const proposals = [];

  // Always include a channel draft for the stage CTA
  proposals.push({
    id: uid(),
    type: "content",
    channel: "linkedin",
    stage: stage.id,
    title: `LinkedIn draft — ${stage.name}`,
    target: "Public social",
    subject: null,
    body: linkedInDraft(
      focusStage === "expansion" ? "sensitive" : focusStage === "activation" ? "agents" : "agents"
    ),
    status: "awaiting_approval",
    createdAt: new Date().toISOString(),
    note: "Draft only. Approve → Release copies text. You post manually.",
  });

  // Nurture / owned cohort reminders (no external send)
  if (focusStage === "conversion" || focusStage === "engagement") {
    proposals.push({
      id: uid(),
      type: "nurture",
      channel: "email-draft",
      stage: focusStage,
      title: "Nurture note — free-key / MCP cohort",
      target: "Owned warm leads (export from your key system)",
      subject: "VAAS-X: limits, guides, or upgrade?",
      body:
        `Hi,\n\n` +
        `Quick note from VAAS-X — if you already have a free API key or vaasxmcp connected:\n\n` +
        `• Guides: https://vaasx.com/guides\n` +
        `• Docs: https://vaasx.com/docs\n` +
        `• When you hit episode limits: Developer / Professional on ${SITE}\n\n` +
        `Questions → ${SALES}\n\n` +
        `— VAAS-X`,
      status: "awaiting_approval",
      createdAt: new Date().toISOString(),
      note: "Requires your recipient list. Agent will not mail-merge or send.",
    });
  }

  // Contact-specific drafts
  for (const c of publicOrPersona.slice(0, Math.max(0, max - proposals.length))) {
    const isEmail = c.contact.includes("@") && c.status === "public-channel";
    proposals.push({
      id: uid(),
      type: "outreach",
      channel: isEmail ? "email-draft" : "manual-outreach",
      stage: c.stage,
      title: `Outreach draft — ${c.org}`,
      target: `${c.org} · ${c.role}`,
      subject: `VAAS-X · ${STAGE_LABELS[c.stage] || c.stage} · ${VERTICAL_LABELS[c.vertical]}`,
      body: emailBodyForContact(c),
      to: isEmail ? c.contact : null,
      url: c.url,
      status: "awaiting_approval",
      createdAt: new Date().toISOString(),
      note: isEmail
        ? "Approve → Release opens a mailto: draft in YOUR client. You still click Send."
        : "Persona/ecosystem target — after Approve, Release copies the draft; you send via their public channel.",
      contactId: c.id,
    });
  }

  // Stage play reminder
  proposals.push({
    id: uid(),
    type: "ops",
    channel: "checklist",
    stage: stage.id,
    title: `Ops checklist — ${stage.name}`,
    target: "Internal",
    subject: null,
    body:
      `Stage goal: ${stage.goal}\n\n` +
      `CTA: ${stage.cta}\n` +
      `Metric: ${stage.metric}\n\n` +
      `Assets:\n${stage.assets.map((a) => `• ${a}`).join("\n")}\n\n` +
      `Channels:\n${stage.channels.map((a) => `• ${a}`).join("\n")}`,
    status: "awaiting_approval",
    createdAt: new Date().toISOString(),
    note: "Internal checklist. Approve to mark ready; nothing external is sent.",
  });

  return proposals.slice(0, max);
}

export function getPolicy() {
  return POLICY;
}

export function getQueue() {
  return loadQueue();
}

export function enqueueProposals(proposals) {
  const queue = loadQueue();
  const next = [...proposals, ...queue];
  saveQueue(next);
  return next;
}

export function updateItem(id, patch) {
  const queue = loadQueue().map((item) =>
    item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item
  );
  saveQueue(queue);
  return queue;
}

export function approveItem(id) {
  return updateItem(id, { status: "approved" });
}

export function rejectItem(id) {
  return updateItem(id, { status: "rejected" });
}

export function resetToAwaiting(id) {
  return updateItem(id, { status: "awaiting_approval" });
}

/**
 * Release does NOT send.
 * Returns { mode: 'clipboard' | 'mailto', payload } for the UI to execute locally.
 */
export function prepareRelease(id) {
  const item = loadQueue().find((x) => x.id === id);
  if (!item) throw new Error("Item not found");
  if (item.status !== "approved") {
    throw new Error("Refuse release: item is not approved. Approve first.");
  }

  if (item.channel === "email-draft" && item.to) {
    const mailto =
      `mailto:${encodeURIComponent(item.to)}` +
      `?subject=${encodeURIComponent(item.subject || "VAAS-X")}` +
      `&body=${encodeURIComponent(item.body)}`;
    return {
      mode: "mailto",
      payload: mailto,
      warning: "Opens your mail client with a DRAFT only. Nothing is sent until you click Send.",
    };
  }

  const text = item.subject ? `Subject: ${item.subject}\n\n${item.body}` : item.body;
  return {
    mode: "clipboard",
    payload: text,
    warning: "Copied to clipboard only. You paste/post/send manually.",
  };
}

export function markReleased(id) {
  return updateItem(id, { status: "released", releasedAt: new Date().toISOString() });
}

export function clearRejected() {
  const queue = loadQueue().filter((x) => x.status !== "rejected");
  saveQueue(queue);
  return queue;
}

export function clearAll() {
  saveQueue([]);
  return [];
}
