const LINKS = {
  site: "https://vaasx.com",
  docs: "https://vaasx.com/docs",
  guides: "https://vaasx.com/guides",
  mcp: "https://mcp.vaasx.com/mcp",
  registry: "io.github.VAAS-X/vaasxmcp",
  sales: "sales@vaasx.com",
  hello: "hello@vaasx.com",
  support: "support@vaasx.com",
};

const PROOF = [
  "14ms mean retrieval across 1.18M episodes on a standard AWS CPU instance — no GPU",
  "1.11ms desktop mean on i5-10600KF (297× vs conventional search baseline in published table)",
  "100% blind classification on NASA CMAPSS FD001 (24 unlabelled sensor channels, zero prior schema)",
  "vaasxmcp live on the official MCP registry: recall / remember / record_outcome / get_memory / await_pending",
];

const VERTICALS = {
  agents: {
    label: "agent builders",
    gap: "Most agent frameworks lose memory when the session ends.",
    pitch:
      "VAAS-X fills that at the infrastructure level — agents recall prior sessions, decisions, and outcomes, with success-weighted recall.",
  },
  maintenance: {
    label: "industrial / predictive-maintenance teams",
    gap: "Most monitoring tells you after something has already failed.",
    pitch:
      "VAAS-X lets machines recall operational states that preceded faults across a fleet — Bootstrap connects sensor streams with no schema design.",
  },
  mission: {
    label: "edge, UAV, and autonomous platform teams",
    gap: "Mission platforms generate operational data every run — and discard it on shutdown.",
    pitch:
      "VAAS-X runs on-device (validated to ESP32-class hardware), accumulating persistent mission memory with no cloud round-trip.",
  },
  sensitive: {
    label: "healthcare, finance, and defence teams",
    gap: "Regulated buyers need cognition over sensitive operational data without careless exposure.",
    pitch:
      "VAAS-X ships encryption at rest and in transit on every tier; encrypted-data operation is available for custom Enterprise deployments — confirm current availability with sales.",
  },
  general: {
    label: "teams evaluating AI memory infrastructure",
    gap: "Vector databases find similar text. Chatbots generate answers.",
    pitch:
      "VAAS-X is operational memory infrastructure: state → action → outcome episodes, recalled by what worked — fixed infrastructure cost, not a per-query bill.",
  },
};

const EPISODES = {
  agents: [
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
  mission: [
    {
      id: "ep_mis_07",
      text: "GPS degrade near canopy — switched to prior successful visual-hold pattern",
      outcome: "success",
      score: 0.92,
    },
    {
      id: "ep_mis_04",
      text: "Same degrade — continued waypoint track and drifted off corridor",
      outcome: "failure",
      score: 0.86,
    },
    {
      id: "ep_mis_11",
      text: "Battery cliff mid-mission — recalled abort altitude that preserved airframe",
      outcome: "success",
      score: 0.83,
    },
  ],
  sensitive: [
    {
      id: "ep_sec_15",
      text: "Access request with incomplete justification — recalled prior deny+escalate path",
      outcome: "success",
      score: 0.9,
    },
    {
      id: "ep_sec_10",
      text: "Same request pattern — auto-approved from similarity alone",
      outcome: "failure",
      score: 0.84,
    },
    {
      id: "ep_sec_19",
      text: "Audit follow-up — retrieved successful remediation episode with full trail",
      outcome: "success",
      score: 0.82,
    },
  ],
};

const DEFAULT_QUERIES = {
  agents: "user asks to update production config but request is underspecified",
  maintenance: "engine running hot with rising vibration",
  mission: "GPS degrade under canopy mid-waypoint",
  sensitive: "access request missing business justification",
};

const TIERS = {
  free: {
    title: "Free",
    body:
      "Instant API key from vaasx.com — no card required. Enough to install the SDK or connect vaasxmcp and store/recall episodes on the free tier limits.",
  },
  developer: {
    title: "Developer",
    body:
      "Self-serve paid tier (£19/mo per published marketing) with higher episode limits for builders wiring SDK or MCP into real workloads.",
  },
  professional: {
    title: "Professional",
    body:
      "Self-serve paid tier (£99/mo per published marketing) for higher limits and additional capabilities such as multi-device federation.",
  },
  enterprise: {
    title: "Enterprise",
    body:
      "Contract-based: on-prem, air-gapped, and compliance-sensitive deployments. Encrypted-data operation for custom Enterprise — confirm current availability with sales@vaasx.com.",
  },
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

function buildCopy(channel, verticalKey) {
  const v = VERTICALS[verticalKey];
  const sdk = `pip install vaas-x · ${LINKS.site}`;
  const mcp = `MCP connector: ${LINKS.mcp} (${LINKS.registry})`;

  const map = {
    "one-liner":
      `Your systems forget everything. VAAS-X makes them remember — persistent, outcome-grounded episodic memory for ${v.label}. ${sdk}. ${mcp}.`,

    homepage:
      `${v.gap}\n\n` +
      `${v.pitch}\n\n` +
      `This is not a chatbot. This is not a vector database. This is operational memory infrastructure.\n\n` +
      `Start: ${sdk}\n${mcp}\nFree API key (no card): ${LINKS.site}`,

    registry:
      `Persistent, outcome-grounded episodic memory for Claude and MCP clients. ` +
      `vaasxmcp stores state → action → outcome episodes so recall() can prefer what worked. ` +
      `Same substrate as the vaas-x SDK — 14ms CPU retrieval across 1.18M episodes, no GPU, no vector DB to run yourself. ` +
      `Connector: ${LINKS.mcp} · Registry: ${LINKS.registry} · Product: ${LINKS.site}`,

    linkedin:
      `Most AI systems are stateless — they process data and discard it.\n\n` +
      `VAAS-X gives ${v.label} a permanent, searchable record of operational experience: what was observed, what action was taken, what the outcome was — recalled in milliseconds on CPU.\n\n` +
      `${v.gap} ${v.pitch}\n\n` +
      `• SDK: ${sdk}\n` +
      `• MCP: ${mcp}\n` +
      `• Free API key at ${LINKS.site} — no card\n\n` +
      `Docs: ${LINKS.docs}`,

    "email-short":
      `Subject: Persistent memory for ${v.label} (VAAS-X)\n\n` +
      `Hi — sharing VAAS-X, the product at ${LINKS.site}.\n\n` +
      `${v.gap}\n${v.pitch}\n\n` +
      `Two ways in:\n` +
      `1) SDK — ${sdk}\n` +
      `2) MCP — add ${LINKS.mcp} in Claude Connectors (registry ${LINKS.registry})\n\n` +
      `Public proof we use:\n- ${PROOF[0]}\n- ${PROOF[2]}\n\n` +
      `Happy to arrange a demo or pilot on your stream: ${LINKS.sales}\n\n` +
      `— VAAS-X`,

    objection:
      `Objection: “We already have a vector database / chatbot memory.”\n\n` +
      `Response (from product positioning): Vector DBs find semantically similar content. Chatbots generate responses. ` +
      `VAAS-X stores operational experience as state → action → outcome and recalls what produced the best outcomes — ` +
      `on CPU, without a per-query memory bill. Demo path: free key on ${LINKS.site}, MCP at ${LINKS.mcp}, docs at ${LINKS.docs}.`,

    proof:
      `Public proof stack (vaasx.com / published benchmarks only):\n` +
      PROOF.map((p) => `• ${p}`).join("\n") +
      `\n• Product: ${LINKS.site}\n• Docs: ${LINKS.docs}\n• Guides: ${LINKS.guides}\n• MCP: ${LINKS.mcp}\n• Sales: ${LINKS.sales}`,
  };

  return map[channel];
}

function buildOutreach({ intent, vertical, contact, company }) {
  const v = VERTICALS[vertical];
  const hi = contact.trim() || "there";
  const co = company.trim() || "your team";

  const intents = {
    "free-key": {
      subject: `Free VAAS-X API key for ${co}`,
      ask: `If useful, grab a free API key (no card) at ${LINKS.site}, then either pip install vaas-x or connect ${LINKS.mcp} in Claude.`,
    },
    mcp: {
      subject: `Add VAAS-X memory to Claude (vaasxmcp)`,
      ask:
        `In Claude: Settings → Connectors → add ${LINKS.mcp}, authorize with your VAAS-X API key from ${LINKS.site}. ` +
        `Registry id: ${LINKS.registry}.`,
    },
    demo: {
      subject: `VAAS-X demo / pilot for ${co}`,
      ask:
        `If you want memory running on your data stream, reply and we’ll schedule a demo or pilot deployment — ${LINKS.sales}.`,
    },
    enterprise: {
      subject: `VAAS-X Enterprise for ${co}`,
      ask:
        `For on-prem, air-gapped, or compliance-sensitive deployments, the path is Enterprise via ${LINKS.sales}. ` +
        `Encrypted-data operation for custom Enterprise — confirm current availability with us.`,
    },
  };

  const i = intents[intent];

  return (
    `Subject: ${i.subject}\n\n` +
    `Hi ${hi},\n\n` +
    `I’m reaching out about VAAS-X — persistent, outcome-grounded episodic memory for devices and AI agents (${LINKS.site}).\n\n` +
    `For ${v.label}: ${v.gap} ${v.pitch}\n\n` +
    `Product surfaces:\n` +
    `• SDK: pip install vaas-x\n` +
    `• MCP: ${LINKS.mcp}\n` +
    `• Docs: ${LINKS.docs}\n\n` +
    `Proof we cite publicly: ${PROOF[0]}; ${PROOF[2]}.\n\n` +
    `${i.ask}\n\n` +
    `Best,\nVAAS-X\n${LINKS.hello} · ${LINKS.sales}`
  );
}

function buildTier({ tier, prospect }) {
  const t = TIERS[tier];
  const who = prospect.trim() || "[Prospect]";
  return (
    `VAAS-X TIER TALK-TRACK\n` +
    `======================\n` +
    `Prospect: ${who}\n` +
    `Tier: ${t.title}\n` +
    `Product: ${LINKS.site}\n` +
    `MCP: ${LINKS.mcp}\n\n` +
    `${t.body}\n\n` +
    `Category line: Not a better vector database — operational memory infrastructure.\n` +
    `How it works: Connect → Accumulate → Recall → Improve.\n\n` +
    `Proof allowed:\n` +
    PROOF.map((p) => `- ${p}`).join("\n") +
    `\n\nCTA: ${LINKS.site} · ${LINKS.sales}`
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
  $("demo-log").textContent = `Ready. Product: ${LINKS.site}\nConnector: ${LINKS.mcp}\n`;
  $("demo-hits").innerHTML =
    `<p class="hint" style="margin:0;color:var(--muted)">Run recall() to surface outcome-weighted episodes for this vertical.</p>`;

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
  $("copy-output").textContent = buildCopy("one-liner", "agents");
  $("gen-copy").addEventListener("click", () => {
    $("copy-output").textContent = buildCopy($("copy-channel").value, $("copy-audience").value);
  });
  $("copy-copy").addEventListener("click", () => copyText($("copy-output").textContent));

  $("gen-outreach").addEventListener("click", () => {
    $("outreach-output").textContent = buildOutreach({
      intent: $("outreach-intent").value,
      vertical: $("outreach-vertical").value,
      contact: $("outreach-contact").value,
      company: $("outreach-company").value,
    });
  });
  $("copy-outreach").addEventListener("click", () => copyText($("outreach-output").textContent));
  $("gen-outreach").click();

  $("gen-tier").addEventListener("click", () => {
    $("tier-output").textContent = buildTier({
      tier: $("tier-pick").value,
      prospect: $("tier-prospect").value,
    });
  });
  $("copy-tier").addEventListener("click", () => copyText($("tier-output").textContent));
  $("gen-tier").click();

  initDemo();
}

init();
