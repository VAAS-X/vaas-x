# VAAS-X Cognitive Memory (vaasxmcp)

Persistent, outcome-grounded episodic memory for Claude and any other MCP client — as a remote MCP server, not a library to install.

Most agent memory is either a context window that resets every session or a vector database that only ever tells you what's semantically *similar*. `vaasxmcp` is neither: it stores what happened as **state → action → outcome** episodes, so retrieval can surface what actually *worked*, not just what looks close. It's backed by the same VAAS-X substrate behind the `vaas-x` SDK.

```
https://mcp.vaasx.com/mcp
```

## Get an API key

1. Go to [vaasx.com/pricing](https://vaasx.com/pricing)
2. Enter your email to create a free account — no card required
3. Keep the key handy for the connector setup below (or leave the key box empty at sign-in and use your email)

## Add it to Claude

1. In Claude.ai: **Settings → Connectors → Add custom connector**
2. Paste `https://mcp.vaasx.com/mcp`
3. Authorize via OAuth — when prompted, enter your email to create a free account, or paste an API key you already have

Once connected, Claude has the tools below. Whether an agent uses its memory without being asked depends on the agent; you can always ask it to. You can see and manage everything it remembers at [app.vaasx.com](https://app.vaasx.com).

## Tools

### `recall`

Search past episodes, ranked toward what actually worked.

| Argument | Type | Default | Description |
|---|---|---|---|
| `query` | string | *required* | Short description of the current task or question |
| `k` | integer | `5` | Max results |
| `include_failures` | boolean | `false` | If `true`, don't bias ranking toward successful episodes — also surface what didn't work |
| `device_id` | string | account default | Query a different memory store instead of the default |
| `account_id` | string | this account | Read another linked account instead (see [`list_accounts`](#list_accounts)). Personal plans and above |

### `remember`

Record a distilled fact or decision.

| Argument | Type | Default | Description |
|---|---|---|---|
| `text` | string | *required* | The fact/decision to remember — one sentence or short paragraph, not a full transcript |
| `outcome` | string | `"neutral"` | `"success"`, `"failure"`, `"neutral"`, or `"pending"` (leave it unresolved so another session can pick it up) |
| `tags` | string | `""` | Comma-separated tags |
| `context` | string | `""` | Optional extra free-text context |
| `device_id` | string | account default | Write to a different memory store instead of the default |

### `record_outcome`

Close the loop on a memory once its outcome becomes known — e.g. a tentative fix is later confirmed working — or mark one as replaced.

| Argument | Type | Default | Description |
|---|---|---|---|
| `episode_id` | string | *required* | Id returned by `remember()` |
| `result` | string | *required* | `"success"` or `"failure"`, or `"superseded"` when a later memory replaces what an earlier one said |
| `delta` | number | `0` | Optional adjustment to this memory's ranking weight |
| `resolved` | string | `null` | Optional note on how it was resolved |
| `device_id` | string | account default | The memory store the episode lives on, if not the default |
| `expected_prior_result` | string | `null` | Compare-and-swap guard: the write only applies if the episode's current result still equals this (for example `"pending"`), so two workers cannot close the same item twice |

### `get_memory`

Direct lookup of one episode by id — an exact fetch, not a search.

| Argument | Type | Default | Description |
|---|---|---|---|
| `episode_id` | string | *required* | Id to fetch |
| `device_id` | string | account default | The memory store the episode lives on, if not the default |
| `account_id` | string | this account | Read from another linked account instead (see [`list_accounts`](#list_accounts)). Personal plans and above |

### `await_pending`

Long-poll for pending work on a memory store. Blocks until an episode with `outcome` still unresolved shows up, or the timeout elapses — call it in a loop from an otherwise-idle agent session to turn it into a live worker for tasks written by something else (a scheduled sweep, or another agent's `remember()` left unresolved).

| Argument | Type | Default | Description |
|---|---|---|---|
| `device_id` | string | account default | The memory store to watch, if not the default |
| `timeout_s` | number | `25` | Max seconds to wait (capped so a call always returns cleanly before typical reverse-proxy idle timeouts) |
| `poll_interval_s` | number | `3` | Seconds between checks while waiting |
| `query` | string | `"pending outcome awaiting confirmation task"` | Search query used to surface candidates — override if your pending episodes use different phrasing |
| `k` | integer | `25` | Max candidates considered per poll |

### `assess`

Report how similar past situations turned out: the share that had the result you ask about among those with a recorded or calculated result, a 95% range, a confidence word (provisional), and what was counted and what was not. With fewer than 8 counted results it gives no estimate. It is not a forecast and does not say what caused a result.

| Argument | Type | Default | Description |
|---|---|---|---|
| `situation` | string | `""` | The situation, in words (not needed with `like` or `latest`) |
| `like` | string | `null` | For a device that reports numbers: the id of a stored reading; situations are matched on the readings |
| `latest` | boolean | `false` | Use the device's newest reading instead of giving an id |
| `event` | string | `"success"` | `"success"` or `"failure"` |
| `k` | integer | `20` | How many similar situations to look at (at most 50) |
| `device_id` | string | account default | The memory store to assess, if not the default |

### `list_accounts`

List the accounts this connection can read: its own, and any others linked to the same owner in the app ([app.vaasx.com](https://app.vaasx.com), *Your accounts*). Each entry has `account_id`, `plan`, `active` and `this`. Pass an `account_id` to `recall` or `get_memory` to read that account's memory — read only.

- Only accounts linked through the app count. An account that is not linked answers `not_linked`, and the list never shows another person's accounts, email addresses or keys.
- Available on Personal plans and above: a connection on the Free plan answers `linked_accounts_need_a_paid_plan`. The account being read can be on any plan.
- Takes no arguments.

## How memory stores work

Each connected account gets a default memory store on first use. Pass a different `device_id` to any tool to keep separate stores — per project, per client, per agent — all under the same account (a Free account has one memory, so leave `device_id` out there). Enterprise-tier accounts can federate reads across multiple stores (HiveMind).

Results that came from an outside source (a feed, a web page, a file) are marked `untrusted` and wrapped in clear markers, so an agent can tell stored data from an instruction.

## Why outcome-grounded, not just similarity search

A plain vector search returns the nearest match. `recall()` defaults to `prefer_success`-weighted ranking, so a past episode you later marked as a failure doesn't outrank one that worked, even if it's a closer textual match. That distinction is the whole point when the recall is feeding a decision, not just a citation.

## Validated performance

The retrieval substrate behind this server is the same one behind the `vaas-x` SDK. These are results we ran ourselves and have not yet had independently replicated:

- **13.99 ms** mean retrieval (16.14 ms P95, 93.15% Recall@10 in quality mode) across **1.18M** stored episodes on a standard AWS CPU instance
- Blind classification of all 24 sensor channels of NASA's CMAPSS FD001 predictive-maintenance benchmark with zero prior domain knowledge

Reproduction guides for the classification results: [vaasx.com/guides](https://vaasx.com/guides)

## Pricing

A flat monthly plan with no per-query bill. Free: 10,000 notes, 100 searches a day, one memory, no card. Personal (£9.99 a month): 50,000 notes, unlimited searches, 3 separate memories, and linked accounts. Developer and Professional are for the SDK, with higher episode and device limits. See [vaasx.com/pricing](https://vaasx.com/pricing) for current details.

## Related

- SDK (`pip install vaas-x`) for building your own memory-backed applications: [github.com/VAAS-X/vaas-x](https://github.com/VAAS-X/vaas-x)
- Full documentation: [vaasx.com/docs](https://vaasx.com/docs)
- Questions: [hello@vaasx.com](mailto:hello@vaasx.com)

## License

Proprietary — the retrieval and indexing internals are protected as a trade secret. What's open here: the full tool contract above, so you can see exactly what goes in and comes back without needing the internals.
