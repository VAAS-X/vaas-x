"""Wiring vaas-x into an AI agent's decision loop.

The agent already knows the outcome the moment it acts, so log the whole
episode (state, action, outcome) in one call instead of ingest-then-tag
later. Query similar past episodes before the *next* decision and bias
toward what worked, not just what's nearest in vector space.

Requires: pip install vaas-x
"""
import os
from vaasx import Bootstrap

brain = Bootstrap(api_key=os.environ["VAASX_API_KEY"], device_id="my_agent")


def agent_step(observation, act_fn, execute_fn):
      action = act_fn(observation)
      result = execute_fn(action)

    resp = brain.ingest([{
              "state": {"observation": observation},
              "action": {"taken": action},
              "outcome": {"success": result.success},
    }])
    episode_id = resp["episode_ids"][0]  # server-assigned, no UUID plumbing needed

    # Recall similar past situations before the *next* decision
    past = brain.query(str(observation), k=3, prefer_success=True)
    return action, episode_id, past
