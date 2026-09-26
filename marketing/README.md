# VAAS-X Marketing Console

Internal GTM tool locked to the **live product** on [vaasx.com](https://vaasx.com).

## Product surfaces

| Surface | Entry |
|---|---|
| SDK | `pip install vaas-x` · [vaasx.com](https://vaasx.com) |
| MCP | [vaasxmcp](https://mcp.vaasx.com/mcp) · registry `io.github.VAAS-X/vaasxmcp` |

## Complete funnel

1. **Awareness** — site, GitHub, MCP registry, whitepapers  
2. **Capture** — free API key (no card)  
3. **Activation** — first ingest/remember + recall  
4. **Engagement** — guides, docs, multi-device usage  
5. **Conversion** — Developer / Professional  
6. **Expansion** — Enterprise / on-prem / air-gap  

## Contacts

Filterable lead list in the console (`marketing/js/funnel-data.js`):

- **Owned** — sales@ / hello@ / support@ / free-key & MCP cohorts  
- **Ecosystem** — MCP registry, GitHub, Claude Connectors  
- **Public channel** — verified org emails (e.g. `welcome@bytelake.com`, `contact@antmicro.com`)  
- **Persona target** — role + company + public URL (no invented personal inboxes)

## Other modules

- Positioning kit (site verticals)  
- vaasxmcp demo  
- Product outreach  
- Tier talk-track  

## Run

```bash
cd marketing
python3 -m http.server 8080
```

Open `http://localhost:8080`.
