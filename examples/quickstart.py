"""Minimal vaas-x quickstart -- ingest one episode, query it back.

Requires: pip install vaas-x
Get a free API key at https://vaasx.com (no card required).
"""
import os
from vaasx import Bootstrap

brain = Bootstrap(
      api_key=os.environ["VAASX_API_KEY"],
      device_id="quickstart_example",
)

# Log an episode -- what happened, what was done, how it turned out.
resp = brain.ingest([{
      "state": {"text": "Engine temperature reading: 210F, load: 80%"},
      "action": {"text": "Reduced load to 60%"},
      "outcome": {"text": "Temperature dropped to 195F within 2 minutes", "success": True},
}])
episode_id = resp["episode_ids"][0]
print(f"ingested episode: {episode_id}")

# Query for similar past situations, ranked toward what worked.
hits = brain.query("Engine running hot under high load", k=5, prefer_success=True)
for h in hits:
      print(f"  [{h['score']:.3f}] {h['text']}")

# If you acted on a retrieved episode, report back on how it went.
if hits:
      brain.outcome(hits[0]["id"], success=True, delta=0.1)
