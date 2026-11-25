# vaas-x

[![PyPI](https://img.shields.io/pypi/v/vaas-x.svg)](https://pypi.org/project/vaas-x/)
[![Python](https://img.shields.io/pypi/pyversions/vaas-x.svg)](https://pypi.org/project/vaas-x/)
[![License](https://img.shields.io/badge/license-proprietary-lightgrey.svg)](LICENSE)
[![mcptry](https://mcptry.com/badge/io.github.VAAS-X/vaasxmcp)](https://mcptry.com/servers/io.github.VAAS-X/vaasxmcp)
[![VAAS-X Cognitive Memory MCP connector – tool definition quality and endpoint health on Glama](https://glama.ai/mcp/connectors/io.github.VAAS-X/vaasxmcp/badges/score.svg)](https://glama.ai/mcp/connectors/io.github.VAAS-X/vaasxmcp)

Episodic memory that persists, for AI agents and connected devices. It keeps what happened, what was done and how it turned out, and brings back what worked.

`pip install vaas-x` gives any device or agent a persistent, queryable
record of what it has seen: what happened, what it did, what the outcome
was. It retrieves the closest matching past episode in milliseconds, on an
ordinary CPU, with no vector database to run yourself. With an API key the SDK
works against the hosted VAAS-X service (your data is held in London); your
data stream is profiled on your own machine first. Fully on-device and
air-gapped deployments are a separate arrangement: see Tiers below.

## Install

```bash
pip install vaas-x
```

Get a free API key at [vaasx.com](https://vaasx.com): an email address, no card.

## Quickstart

```python
from vaasx import Bootstrap

brain = Bootstrap(api_key="vx_...")     # the key we emailed you. A Free account has one memory: leave device_id out.
# On Personal and above you can keep separate memories, e.g. Bootstrap(api_key="vx_...", device_id="line3_press")

# Point it at a structured data stream (sensor readings, agent actions,
# API events: anything JSON-shaped) and it profiles the stream
# automatically, no schema design required.
brain.connect("https://your-data-stream.com/events")

# Query for the most similar past episodes, ranked by what actually
# worked, not just what is nearest in vector space.
hits = brain.query("engine running hot", k=5, prefer_success=True)
```

## Which machine, run or session each reading belongs to

```python
brain.connect("press_4.csv", unit="press_4_run_17")      # every reading of this stream belongs to one run
brain.connect("all_machines.csv", unit_field="machine")   # or read it from a column of the file
```

The unit is sent with every reading as the tag `unit:<id>` (at most 40 characters, no control characters). Readings that share a unit are kept together when the service checks how
well an estimate holds up on machines it has not seen, and a device needs ten or more distinct units before the service gives a probability for it. Readings sent without a unit
count as one unit per day. A column named in `unit_field` is used only to name the unit; it is not stored as a measurement. A unit that the service would not keep is refused when
you call `connect()`, with a message that says why. Available from 0.1.18.

An agent that already knows its own outcome the moment it acts can log a
full state/action/outcome episode in one call instead of a separate
ingest-then-tag-later round trip:

```python
resp = brain.ingest([{
    "state": {"observation": observation},
    "action": {"taken": action},
    "outcome": {"success": result.success},
}])
episode_id = resp["episode_ids"][0]
```

Then report back on a retrieved episode once you know how it went:

```python
brain.outcome(hits[0]["id"], success=True, delta=0.12)
```

Three calls (`ingest`, `query`, `outcome`) cover the whole loop. No schema to design, no vector database to host, no embedding model to serve yourself.

## Prefer no code? Use the connector

If you use Claude, Cursor, VS Code or another agent that supports MCP, you
do not need this package. Add `https://mcp.vaasx.com/mcp` as a remote MCP
server and the agent gets the same memory, with no key to paste. Whether an
agent uses its memory without being asked depends on the agent. You can see
and manage everything it remembers at [app.vaasx.com](https://app.vaasx.com)
(sign in with an emailed code).

## What the connectors read

A web address, file, WebSocket or MQTT topic can hold more than numbers, and the SDK looks at each record before it decides what to do with it (the "scout"):

- **Numbers and true/false** are profiled and classified as sensor channels, as before.
- **Text, descriptions, titles, timestamps, ids and nested values** are kept with their values in a readable episode, so an agent that recalls it can read it. Long text is split into parts.
- A web address can return **JSON, an RSS or Atom feed, or a plain text or HTML page**.
- A record that repeats exactly, such as a feed polled again with no new stories, is stored once. A numeric reading is never skipped. Pass `dedupe=False` to `connect()` to turn this off.

## Say what the fields mean

A feed gives names, not meanings: GitHub's `watchers_count` is the star count, and the real watchers are `subscribers_count`. Say what your fields mean once and every agent that recalls
the device reads the meaning next to the value:

```python
brain.describe_fields({
    "watchers_count": "the star count (an old GitHub name); real watchers are subscribers_count",
    "size": "repository size in kilobytes",
})
# or as the source is connected
brain.connect("https://api.github.com/repos/VAAS-X/vaas-x", interval_s=60, field_notes={"size": "repository size in kilobytes"})
```

`describe_fields()` adds to what is there (`replace=True` makes it the whole dictionary; a blank meaning removes a note), `field_notes()` reads it and `clear_field_notes()` removes it.
Only the owner's key can change it: an agent connected through the MCP connector cannot. You can also edit it in the app, with the **Fields** button on a device.

## Look at what is stored

```python
hits = brain.query("engine running hot", prefer_success=False)   # rank without favouring what worked, so things that failed surface too
page = brain.episodes(outcome="failed", limit=10)                # list what a memory holds, newest first: "all", "worked", "failed" or "pending"
print(page["total"], page["counts"])                            # everything stored, and how many worked, failed or are still pending
for ep in page["items"]:
    print(ep["id"], ep["state"], ep["text"])
print(brain.devices()["devices"])                                # the memories on this account and how many episodes each holds
```

Both listings only read: they change nothing and do not count as searches. `episodes()` returns at most 100 a call (step through with `offset`), shortens long text (fetch the whole episode
with `get_episode()`), and takes `q="word"` to keep only episodes that contain it (a plain text match; `query()` is the search). `episodes()` and `devices()` are available from 0.1.20.

## Rate limits

The service limits how many requests one key can make in a minute (60 on Free, more on paid plans). When a request is refused for that reason, the SDK waits and tries again, for up to about a minute in total, before it raises an error. A request refused because your plan's note limit is full is never retried. Use `Bootstrap(..., max_retries=0)` to fail at once.

## When the service says no

```python
from vaasx import Bootstrap, VaasxAPIError

try:
    hits = brain.query("engine running hot")
except VaasxAPIError as e:
    print(e.hint or e)       # a plain sentence about what to do next, when there is one
```

The most common answers (a plan's daily search limit or its limit on stored episodes or devices, a key that is not valid, a lapsed subscription, too many requests in a minute, no network)
come with a plain sentence in `error.hint`. `error.code` is the service's own short name for the problem (for example `free_tier_daily_query_limit_reached`), and `error.status_code` and
`error.detail` are as before; `str(error)` has not changed. Available from 0.1.20.

## What it does

- Profiles a raw data stream automatically: statistical profiling,
  schema classification and anomaly detection all run locally before
  anything touches the network.
- Stores episodes as (state, action, outcome) triples, so retrieval can be
  weighted toward what worked last time in a similar situation, not just
  nearest by embedding distance.
- Runs on both a small edge device and a standard server: same codebase,
  no domain-specific build.

## Numbers, not adjectives

- **13.99 ms mean retrieval** (16.14 ms P95, 93.15% Recall@10 in quality mode) across 1.18M stored episodes on a standard AWS m7i-flex.large CPU instance, on the ANN-Benchmarks GloVe-100 set.
- Blind-tested on NASA's CMAPSS FD001 predictive-maintenance benchmark: given 24 sensor channels with every identifier stripped, it correctly classified all 24 with zero prior domain knowledge.
- A consistent zero-config classification result across 8 independent subjects on a real wearable IMU dataset (UCI Daily and Sports Activities).

These are results we ran ourselves and have not yet had independently replicated. The classification results have step-by-step reproduction guides, below.

## Reproduce the benchmarks yourself

Step-by-step guides, each against a real public dataset or environment, with your own API key and an independent local cross-check that does not depend on the SDK at all:

- [CMAPSS predictive maintenance](https://vaasx.com/guides/cmapss.html)
- [Room-occupancy detection](https://vaasx.com/guides/occupancy.html)
- [Memory-augmented CartPole](https://vaasx.com/guides/cartpole.html) (zero download)
- [Wearable activity classification](https://vaasx.com/guides/sports_wearable.html)
- [Physics simulations](https://vaasx.com/guides/scientific_computing.html) (QEC, lattice field theory, Ising model)
- [Live drone control loop](https://vaasx.com/guides/drone_control.html)

Full guide index: [vaasx.com/guides](https://vaasx.com/guides/index.html)

## When files stop being enough

If one agent on one machine is all you have, a markdown file is a fine
place to start. A memory service earns its place when several agents need
the same memory, when facts change mid-project, and when you want recall
ranked by what worked. Every published result has a reproduction guide you
can run yourself: [vaasx.com/guides](https://vaasx.com/guides/index.html).
Comparisons: [Mem0](https://vaasx.com/vs-mem0.html),
[Supermemory](https://vaasx.com/vs-supermemory.html),
[a vector database](https://vaasx.com/vs-vector-database.html).

## Tiers

Free gets you an API key by email (10,000 episodes, 100 queries a day,
one memory: no device name needed). Personal (£9.99 a month) adds the app, 50,000 notes, unlimited
searches and 3 separate memories. Developer and Professional are self-serve SDK
tiers with higher episode and device limits. Enterprise is contract-based,
for teams wanting on-prem or air-gapped deployment. See
[vaasx.com/pricing](https://vaasx.com/pricing) for current details.

## The honest caveat

This package ships as a compiled wheel, not source-available. The
retrieval and indexing internals are proprietary and protected as a trade
secret, not through patent filing. What *is* open: full API documentation,
working examples, and the wire format, so you can see exactly what goes in
and comes back even without reading the internals.

Multimodal support (vision/audio/depth/thermal, via the optional `ac`
extra) is real but still early: encoder models are in active training
and not yet production-tuned; treat it as a preview, not a finished
feature.

## In this repository

- `examples/`: working examples
- `mcp/`: the connector's registry manifest and docs

## Links

- [Documentation](https://vaasx.com/docs)
- [Homepage](https://vaasx.com)

## License

Proprietary -- see `LICENSE`.
