# vaas-x

[![PyPI](https://img.shields.io/pypi/v/vaas-x.svg)](https://pypi.org/project/vaas-x/)
[![Python](https://img.shields.io/pypi/pyversions/vaas-x.svg)](https://pypi.org/project/vaas-x/)
[![License](https://img.shields.io/badge/license-proprietary-lightgrey.svg)](LICENSE)

Persistent, outcome-grounded memory for AI agents and connected devices.

`pip install vaas-x` gives any device or agent a persistent, queryable
record of what it's seen — what happened, what it did, what the outcome
was — and retrieves the closest matching past episode in milliseconds, on
CPU, with no GPU and no vector database to stand up yourself.

## Install

```bash
pip install vaas-x
```

Get a free-tier API key at [vaasx.com](https://vaasx.com) — no card
required.

## Quickstart

```python
from vaasx import Bootstrap

brain = Bootstrap(api_key="...", device_id="my_device")

# Point it at a structured data stream (sensor readings, agent actions,
# API events -- anything JSON-shaped) and it profiles the stream
# automatically, no schema design required.
brain.connect("https://your-data-stream.com/events")

# Query for the most similar past episodes, ranked by what actually
# worked, not just what's nearest in vector space.
hits = brain.query("engine running hot", k=5, prefer_success=True)
```

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

            # Report back on a retrieved episode once you know how it went
            brain.outcome(hits[0]["id"], success=True, delta=0.12)
            ```

            Three calls — `ingest`, `query`, `outcome` — cover the whole loop. No
            schema to design, no vector DB to host, no embedding model to serve
            yourself.

            ## What it does

            - Profiles a raw data stream automatically — statistical profiling,
              schema classification, and anomaly detection all run locally before
                anything touches the network.
                - Stores episodes as (state, action, outcome) triples, so retrieval can be
                  weighted toward what worked last time in a similar situation, not just
                    nearest by embedding distance.
                    - Runs on both a small edge device and a standard server — same codebase,
                      no domain-specific build. Verified live on a £30 ESP32 microcontroller
                        and on a standard EC2 instance.

                        ## Numbers, not adjectives

                        - 14ms mean retrieval across 1.18M stored episodes on a standard AWS
                          m7i-flex.large CPU instance — no GPU, no AVX-512.
                          - Blind-tested on NASA's CMAPSS FD001 predictive-maintenance benchmark:
                            given 24 sensor channels with every identifier stripped, correctly
                              classified all 24 with zero prior domain knowledge.
                              - Consistent zero-config classification result across 8 independent
                                subjects on a real wearable IMU dataset (UCI Daily and Sports
                                  Activities).

                                  Every number above is independently reproducible — see below.

                                  ## Reproduce the benchmarks yourself

                                  Every result this SDK's marketing points to has a step-by-step guide
                                  against a real public dataset or environment, with your own API key, plus
                                  an independent local cross-check that doesn't depend on the SDK at all:

                                  - [CMAPSS predictive maintenance](https://vaasx.com/guides/cmapss.html)
                                  - [Room-occupancy detection](https://vaasx.com/guides/occupancy.html)
                                  - [Memory-augmented CartPole](https://vaasx.com/guides/cartpole.html) (zero download)
                                  - [Wearable activity classification](https://vaasx.com/guides/sports_wearable.html)
                                  - [Physics simulations](https://vaasx.com/guides/scientific_computing.html) (QEC, lattice field theory, Ising model)
                                  - [Live drone control loop](https://vaasx.com/guides/drone_control.html)

                                  Full guide index: [vaasx.com/guides](https://vaasx.com/guides)

                                  ## Tiers

                                  Free gets you an API key instantly. Developer (£19/mo) and Professional
                                  (£99/mo) are self-serve paid tiers with higher episode limits and
                                  additional capabilities. Enterprise is contract-based, for teams wanting
                                  on-prem or air-gapped deployment. See
                                  [vaasx.com/pricing](https://vaasx.com/pricing) for current details.

                                  ## The honest caveat

                                  This package ships as a compiled wheel, not source-available — the
                                  retrieval and indexing internals are proprietary and protected as a trade
                                  secret. What *is* open: full API documentation, working examples, and the
                                  wire format, so you can see exactly what goes in and comes back even
                                  without reading the internals.

                                  Multimodal support (vision/audio/depth/thermal, via the optional `ac`
                                  extra) is real but still early — encoder models are in active training
                                  and not yet production-tuned; treat it as a preview, not a finished
                                  feature.

                                  ## Issues & questions

                                  This repo doesn't carry the source (see above), but it's the right place
                                  to file bugs against the published package, ask integration questions, or
                                  request a reproduction guide for a dataset/environment not covered above.

                                  ## Links

                                  - [Documentation](https://vaasx.com/docs)
                                  - [Whitepapers](https://vaasx.com/whitepapers) — technical deep dives, one per use case
                                  - [Homepage](https://vaasx.com)

                                  ## License

                                  Proprietary — see [LICENSE](LICENSE).
