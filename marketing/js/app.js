const LINKS = {
  site: "https://vaasx.com",
  mcp: "https://mcp.vaasx.com/mcp",
  registry: "io.github.VAAS-X/vaasxmcp",
  sales: "sales@vaasx.com",
  hello: "hello@vaasx.com",
};

const PROOF = [
  "14ms mean retrieval across 1.18M episodes on standard CPU (no GPU)",
  "1.11ms desktop mean on i5-10600KF",
  "100% blind channel identification on NASA CMAPSS FD001",
  "MCP live: recall / remember / record_outcome / get_memory / await_pending",
];

const EPISODES = {
  support: [
    {
      id: "ep_sup_184",
      text: "Billing dispute after plan downgrade — clarified prorated credit + sent receipt link",
      outcome: "success",
      score: 0.91,
    },
    {
      id: "ep_sup_201",
      text: "Same billing dispute — offered refund without checking invoice history",
      outcome: "failure",
      score: 0.88,
    },
    {
      id: "ep_sup_156",
      text: "Angry churn risk — acknowledged delay, gave exact restore ETA, followed up once",
      outcome: "success",
      score: 0.84,
    },
  ],
  outbound: [
    {
      id: "ep_out_77",
      text: "Follow-up after no-reply: one-line value + single CTA to 15-min slot",
      outcome: "success",
      score: 0.89,
    },
    {
      id: "ep_out_62",
      text: "Follow-up with long feature list and three links",
      outcome: "failure",
      score: 0.86,
    },
    {
      id: "ep_out_91",
      text: "Breakup email referencing their published hiring post for SDRs",
      outcome: "success",
      score: 0.82,
    },
  ],
  agent: [
    {
      id: "ep_ag_33",
      text: "Ambiguous user ask — recalled prior successful plan, chose search then act",
      outcome: "success",
      score: 0.9,
    },
    {
      id: "ep_ag_28",
      text: "Same ask — jumped to write tool without checking prior failures",
      outcome: "failure",
      score: 0.85,
    },
    {
      id: "ep_ag_41",
      text: "Tool error — remembered workaround path and retried with narrower args",
      outcome: "success",
      score: 0.81,
    },
  ],
  maintenance: [
    {
      id: "ep_mnt_12",
      text: "Rising exhaust temp + vibration band — scheduled inspection before trip",
      outcome: "success",
      score: 0.93,
    },
    {
      id: "ep_mnt_09",
      text: "Same signature — ignored as sensor noise",
      outcome: "failure",
      score: 0.87,
    },
    {
      id: "ep_mnt_21",
      text: "Pre-fault window matched prior CMAPSS-like channel drift — reduced load",
      outcome: "success",
      score: 0.84,
    },
  ],
};

const DEFAULT_QUERIES = {
  support: "customer angry about unexpected charge after downgrade",
  outbound: "prospect opened email but did not reply after two days",
  agent: "user asks to update production config but request is underspecified",
  maintenance: "engine running hot with rising vibration",
};

function $(id) {
  return document.getElementById(id);
}

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 1600);
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  toast("Copied");
}

function audienceNoun(audience) {
  return {
    "agent-builder": "agent builders",
    "outbound-agency": "outbound / SDR agencies",
    "cx-agency": "CX and support agencies",
    enterprise: "enterprise AI and ops buyers",
    edge: "edge, robotics, and industrial teams",
  }[audience];
}

function buildCopy(channel, audience) {
  const who = audienceNoun(audience);
  const mcpLine = `Add VAAS-X Cognitive Memory (vaasxmcp): ${LINKS.mcp}`;
  const sdkLine = `SDK: pip install vaas-x · ${LINKS.site}`;

  const map = {
    "one-liner": `VAAS-X gives ${who} persistent, outcome-grounded memory — recall what actually worked, not just what’s similar. ${sdkLine} · MCP ${LINKS.mcp}`,

    registry:
      `Persistent, outcome-grounded episodic memory for Claude and MCP clients. ` +
      `vaasxmcp stores state → action → outcome episodes so recall() can prefer what worked. ` +
      `Same substrate as the vaas-x SDK — 14ms CPU retrieval across 1.18M episodes, no GPU, no vector DB to run yourself. ` +
      `Connector: ${LINKS.mcp} · Registry: ${LINKS.registry}`,

    linkedin:
      `Most agent “memory” is either a resetting context window or a vector DB that only finds what’s similar.\n\n` +
      `VAAS-X is neither.\n\n` +
      `It stores what happened as state → action → outcome, then recalls what worked — on CPU, in milliseconds.\n\n` +
      `Two ways in for ${who}:\n` +
      `• SDK: pip install vaas-x (${LINKS.site})\n` +
      `• MCP: ${LINKS.mcp} (${LINKS.registry})\n\n` +
      `Free API key, no card. If you’re wiring agents or client workflows this week, start there.`,

    "email-short":
      `Subject: Outcome-grounded memory for your stack (VAAS-X / vaasxmcp)\n\n` +
      `Hi — quick note for ${who}.\n\n` +
      `VAAS-X is persistent episodic memory infrastructure: ingest state/action/outcome, recall what worked, close the loop with outcomes.\n\n` +
      `${sdkLine}\n${mcpLine}\n\n` +
      `Proof points we use publicly:\n- ${PROOF[0]}\n- ${PROOF[2]}\n\n` +
      `If useful, I can run a short pilot on your logs or agent traces.\n\n` +
      `— VAAS-X · ${LINKS.sales}`,

    objection:
      `Objection: “We already have a vector database / chatbot memory.”\n\n` +
      `Response: Those find nearest text. VAAS-X stores operational episodes (state → action → outcome) and ranks toward what worked. ` +
      `That’s why recall defaults to success-weighted ranking on vaasxmcp. ` +
      `It’s infrastructure with predictable cost — not a per-query chat memory bill. Demo path: free key on ${LINKS.site}, connector ${LINKS.mcp}.`,

    proof:
      `Public proof stack (use only these):\n` +
      PROOF.map((p) => `• ${p}`).join("\n") +
      `\n• Product: ${LINKS.site}\n• MCP: ${LINKS.mcp}\n• Registry: ${LINKS.registry}\n• Sales: ${LINKS.sales}`,
  };

  return map[channel];
}

function buildOutreach({ type, name, contact }) {
  const agency = name.trim() || "your team";
  const hi = contact.trim() || "there";
  const angles = {
    outbound: {
      loop: "reply → meeting booked",
      hook: "next follow-up that historically got the meeting",
    },
    cx: {
      loop: "ticket → resolved / CSAT",
      hook: "next reply that historically closed similar tickets",
    },
    ai: {
      loop: "agent tool choice → task success",
      hook: "wholesale outcome memory you can mark up into client agent builds",
    },
    revops: {
      loop: "sequence step → SQL / pipeline movement",
      hook: "decision layer on top of the sequences you already run",
    },
  };
  const a = angles[type];

  return (
    `Subject: Wholesale VAAS-X memory for ${agency} clients\n\n` +
    `Hi ${hi},\n\n` +
    `I work on VAAS-X — outcome-grounded episodic memory used via the vaas-x SDK and vaasxmcp (${LINKS.mcp}).\n\n` +
    `${agency} already owns a measurable loop (${a.loop}). We’re offering agencies a simple package:\n` +
    `1) Prepaid episode / decision credits on the live substrate\n` +
    `2) A 48-hour pilot: load one client queue/log → private recall endpoint biased to what worked\n\n` +
    `Positioning for your clients: ${a.hook} — not another chatbot.\n\n` +
    `Public proof we stick to: ${PROOF[0]}; MCP tools recall / remember / record_outcome.\n\n` +
    `If you’re open to it, I’ll send a one-page SKU and we pick a single client workflow.\n\n` +
    `Best,\nVAAS-X\n${LINKS.sales}\n${LINKS.site}`
  );
}

function buildSku({ offer, price, client }) {
  const who = client.trim() || "[Prospect]";
  const labels = {
    credits: "Prepaid decision / episode credits",
    pilot: "48h log → private oracle pilot",
    "mcp-team": "MCP team seats + episode cap",
    enterprise: "Enterprise / on-prem conversation starter",
  };
  const bodies = {
    credits:
      `Access to VAAS-X substrate via API and/or vaasxmcp (${LINKS.mcp}). ` +
      `Credits apply to episode volume / decision calls. Free key remains the top-of-funnel; this is the paid pack.`,
    pilot:
      `Fixed-scope pilot: receive one client log/ticket/agent trace dump, stand up a private memory store, ` +
      `demonstrate recall() preferring successful outcomes, hand back a short readout + connector instructions.`,
    "mcp-team":
      `Team usage of vaasxmcp with shared account controls and higher episode limits. ` +
      `Connector URL ${LINKS.mcp}; registry ${LINKS.registry}. Upgrade path from free key on ${LINKS.site}.`,
    enterprise:
      `Discovery toward on-prem / air-gapped / compliance-sensitive deployment. ` +
      `Start from public product facts on ${LINKS.site}; route to ${LINKS.sales}.`,
  };

  return (
    `VAAS-X SKU SLIP\n` +
    `================\n` +
    `Prospect: ${who}\n` +
    `Offer: ${labels[offer]}\n` +
    `Quote: £${Number(price).toLocaleString("en-GB")}\n` +
    `Product surfaces: vaas-x SDK (${LINKS.site}) · vaasxmcp (${LINKS.mcp})\n\n` +
    `Scope:\n${bodies[offer]}\n\n` +
    `Proof allowed in this quote:\n` +
    PROOF.map((p) => `- ${p}`).join("\n") +
    `\n\nNext step: prepaid acceptance → schedule load / key issuance\nContact: ${LINKS.sales}`
  );
}

function renderHits(scenario, preferSuccess = true) {
  const hits = [...EPISODES[scenario]].sort((a, b) => {
    if (preferSuccess && a.outcome !== b.outcome) {
      return a.outcome === "success" ? -1 : 1;
    }
    return b.score - a.score;
  });
  const root = $("demo-hits");
  root.innerHTML = hits
    .map(
      (h) => `
      <article class="hit" data-id="${h.id}">
        <strong>${h.text}</strong>
        <div class="meta">
          <span>${h.id}</span>
          <span class="${h.outcome === "success" ? "tag-success" : "tag-failure"}">${h.outcome}</span>
          <span>score ${h.score.toFixed(2)}</span>
        </div>
      </article>`
    )
    .join("");
  return hits;
}

function logLine(msg) {
  const el = $("demo-log");
  const ts = new Date().toLocaleTimeString();
  el.textContent += `[${ts}] ${msg}\n`;
  el.scrollTop = el.scrollHeight;
}

let lastEpisodeId = null;

function initDemo() {
  const scenario = $("demo-scenario");
  const query = $("demo-query");
  query.value = DEFAULT_QUERIES[scenario.value];
  $("demo-log").textContent = "Ready. Connector target: https://mcp.vaasx.com/mcp\n";
  $("demo-hits").innerHTML = `<p class="hint" style="margin:0;color:var(--muted)">Run recall() to surface outcome-weighted episodes.</p>`;

  scenario.addEventListener("change", () => {
    query.value = DEFAULT_QUERIES[scenario.value];
    $("run-outcome").disabled = true;
    lastEpisodeId = null;
  });

  $("run-recall").addEventListener("click", () => {
    const q = query.value.trim() || DEFAULT_QUERIES[scenario.value];
    logLine(`recall({ query: "${q}", k: 3, include_failures: false })`);
    const hits = renderHits(scenario.value, true);
    logLine(`← ${hits.length} episodes (success-weighted)`);
    $("run-outcome").disabled = false;
    lastEpisodeId = hits.find((h) => h.outcome === "success")?.id || hits[0].id;
  });

  $("run-remember").addEventListener("click", () => {
    const q = query.value.trim() || DEFAULT_QUERIES[scenario.value];
    lastEpisodeId = `ep_new_${Math.floor(Math.random() * 900 + 100)}`;
    logLine(
      `remember({ text: "Handled: ${q}", outcome: "neutral", tags: "${scenario.value}" })`
    );
    logLine(`← episode_id ${lastEpisodeId}`);
    $("run-outcome").disabled = false;
  });

  $("run-outcome").addEventListener("click", () => {
    if (!lastEpisodeId) return;
    logLine(`record_outcome({ episode_id: "${lastEpisodeId}", result: "success", delta: 0.1 })`);
    logLine("← loop closed — future recall() will prefer this path");
    toast("Outcome recorded (demo)");
  });
}

function init() {
  $("copy-output").textContent = buildCopy("one-liner", "agent-builder");
  $("gen-copy").addEventListener("click", () => {
    $("copy-output").textContent = buildCopy($("copy-channel").value, $("copy-audience").value);
  });
  $("copy-copy").addEventListener("click", () => copyText($("copy-output").textContent));

  $("gen-outreach").addEventListener("click", () => {
    $("outreach-output").textContent = buildOutreach({
      type: $("agency-type").value,
      name: $("agency-name").value,
      contact: $("agency-contact").value,
    });
  });
  $("copy-outreach").addEventListener("click", () => copyText($("outreach-output").textContent));
  $("gen-outreach").click();

  $("gen-sku").addEventListener("click", () => {
    $("sku-output").textContent = buildSku({
      offer: $("sku-offer").value,
      price: $("sku-price").value,
      client: $("sku-client").value,
    });
  });
  $("copy-sku").addEventListener("click", () => copyText($("sku-output").textContent));
  $("gen-sku").click();

  initDemo();
}

init();
