# VAAS-X Cognitive Memory (vaasxmcp)

Persistent, outcome-grounded episodic memory for Claude and any other MCP client — as a remote MCP server, not a library to install.

Most agent memory is either a context window that resets every session or a vector database that only ever tells you what's semantically *similar*. `vaasxmcp` is neither: it stores what happened as **state → action → outcome** episodes, so retrieval can surface what actually *worked*, not just what looks close. It's backed by the same VAAS-X substrate behind the `vaas-x` SDK — 14ms mean retrieval across 1.18M episodes on a standard CPU instance, no GPU, no vector DB to run yourself.

```
https://mcp.vaasx.com/mcp
```

## Get an API key

1. Go to [vaasx.com/pricing](https://vaasx.com/pricing)
2. Click **Get Your Free API Key** — no card required, key is issued instantly
3. Keep the key handy for the connector setup below

## Add it to Claude

1. In Claude.ai: **Settings → Connectors → Add custom connector**
2. Paste `https://mcp.vaasx.com/mcp`
3. Authorize via OAuth — when prompted, enter the API key from the step above to link the connector to your VAAS-X account

Once connected, Claude can recall relevant past episodes at the start of a task and write new ones as it works, without you asking it to.

## Tools

### `recall`

Search past episodes, ranked toward what actually worked.

| Argument | Type | Default | Description |
|---|---|---|---|
| `query` | string | *required* | Short description of the current task or question |
| `k` | integer | `5` | Max results |
| `include_failures` | boolean | `false` | If `true`, don't bias ranking toward successful episodes — also surface what didn't work |
| `device_id` | string | account default | Query a different memory store instead of the default |

### `remember`

Record a distilled fact or decision.

| Argument | Type | Default | Description |
|---|---|---|---|
| `text` | string | *required* | The fact/decision to remember — one sentence or short paragraph, not a full transcript |
| `outcome` | string | `"neutral"` | `"success"`, `"failure"`, or `"neutral"` — set this when you already know whether the approach worked, so future `recall()` calls rank it correctly |
| `tags` | string | `""` | Comma-separated tags |
| `context` | string | `""` | Optional extra free-text context |
| `device_id` | string | account default | Write to a different memory store instead of the default |

### `record_outcome`

Close the loop on a memory once its outcome becomes known — e.g. a tentative fix is later confirmed working.

| Argument | Type | Default | Description |
|---|---|---|---|
| `episode_id` | string | *required* | Id returned by `remember()` |
| `result` | string | *required* | `"success"` or `"failure"` |
| `delta` | number | `0` | Optional adjustment to this memory's ranking weight |
| `resolved` | string | `null` | Optional free-text note on how it was resolved |
| `device_id` | string | account default | The memory store the episode lives on, if not the default |

### `get_memory`

Direct lookup of one episode by id — an exact fetch, not a search.

| Argument | Type | Default | Description |
|---|---|---|---|
| `episode_id` | string | *required* | Id to fetch |
| `device_id` | string | account default | The memory store the episode lives on, if not the default |

### `await_pending`

Long-poll for pending work on a memory store. Blocks until an episode with `outcome` still unresolved shows up, or the timeout elapses — call it in a loop from an otherwise-idle agent session to turn it into a live worker for tasks written by something else (a scheduled sweep, or another agent's `remember()` left unresolved).

| Argument | Type | Default | Description |
|---|---|---|---|
| `device_id` | string | account default | The memory store to watch, if not the default |
| `timeout_s` | number | `25` | Max seconds to wait (hard-capped at 55s so a call always returns cleanly before typical reverse-proxy idle timeouts) |
| `poll_interval_s` | number | `3` | Seconds between checks while waiting |
| `query` | string | `"pending outcome awaiting confirmation task"` | Search query used to surface candidates — override if your pending episodes use different phrasing |
| `k` | integer | `25` | Max candidates considered per poll |

## How memory stores work

Each connected account gets a default memory store on first use. Pass a different `device_id` to any tool to keep separate stores — per project, per client, per agent — all under the same account. Enterprise-tier accounts can federate reads across multiple stores (HiveMind).

## Why outcome-grounded, not just similarity search

A plain vector search returns the nearest match. `recall()` defaults to `prefer_success`-weighted ranking, so a past episode you later marked as a failure doesn't outrank one that worked, even if it's a closer textual match. That distinction is the whole point when the recall is feeding a decision, not just a citation.

## Validated performance

The retrieval substrate behind this server is the same one behind the `vaas-x` SDK:

- **14ms** mean retrieval across **1.18M** stored episodes, standard AWS CPU instance, no GPU
- **100%** blind classification accuracy on NASA's CMAPSS FD001 predictive-maintenance benchmark (24 sensor channels, zero prior domain knowledge)
- **0.8965 TS-AUC** on the CrunchDAO Structural Break challenge, vs. a 0.6907 baseline (independent, leaderboard-validated)

Reproduction guides for each: [vaasx.com/guides](https://vaasx.com/guides)

## Pricing

Free tier gets you an API key instantly at [vaasx.com/pricing](https://vaasx.com/pricing) — no card required. Developer and Professional tiers unlock higher episode limits and multi-device federation. See the pricing page for current details.

## Related

- SDK (`pip install vaas-x`) for building your own memory-backed applications: [github.com/VAAS-X/vaas-x](https://github.com/VAAS-X/vaas-x)
- Full documentation: [vaasx.com/docs](https://vaasx.com/docs)
- Questions: [hello@vaasx.com](mailto:hello@vaasx.com)

## License

Proprietary — the retrieval and indexing internals are protected as a trade secret. What's open here: the full tool contract above, so you can see exactly what goes in and comes back without needing the internals.
