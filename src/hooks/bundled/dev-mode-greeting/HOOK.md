---
name: dev-mode-greeting
description: "[dev-mode] The agent greets you after /new, /reset, /compact and auto-compaction."
metadata:
  {
    "openclaw":
      {
        "emoji": "👋",
        "events": ["command:new", "command:reset", "session:compact:after"],
        "requires": { "env": ["OPENCLAW_DEV_MODE"] },
      },
  }
---

# Dev-mode greeting (fork)

With `OPENCLAW_DEV_MODE=1`, the agent sends you a short chat message after a bare `/new` or
`/reset`, after `/compact`, and after automatic compaction (at most once per 10 minutes per
session). The message is written by the agent in its own voice, not canned text.

Style it in `~/.openclaw/.env`, next to `OPENCLAW_DEV_MODE=1`:

```bash
OPENCLAW_DEV_MODE_GREETING="be very snide and remind me of the last task or talk"
```

Enable once:

```bash
openclaw hooks enable dev-mode-greeting
```

How it works: the handler queues a system event for the session and requests an immediate wake —
the same mechanism upstream uses for `POST /hooks/wake`. The wake runs a turn in that session and
the reply is delivered like any heartbeat reply.
