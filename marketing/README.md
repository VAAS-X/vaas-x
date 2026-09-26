# VAAS-X Marketing Console

Internal GTM tool locked to the **live product** on [vaasx.com](https://vaasx.com) — not speculative thread pitches.

## Product surfaces

| Surface | Entry |
|---|---|
| SDK | `pip install vaas-x` · [vaasx.com](https://vaasx.com) |
| MCP | [vaasxmcp](https://mcp.vaasx.com/mcp) · registry `io.github.VAAS-X/vaasxmcp` |

## Console modules

1. **Positioning kit** — homepage-style pitches for site verticals (agents, predictive maintenance, mission/edge, sensitive data)
2. **vaasxmcp demo** — simulated `recall` → `remember` → `record_outcome`
3. **Product outreach** — free key, MCP connect, demo/pilot, Enterprise
4. **Tier talk-track** — Free / Developer / Professional / Enterprise

Proof points are limited to published claims (14ms / 1.18M episodes, CMAPSS, MCP tools).

## Run

```bash
cd marketing
python3 -m http.server 8080
```

Open `http://localhost:8080`.
