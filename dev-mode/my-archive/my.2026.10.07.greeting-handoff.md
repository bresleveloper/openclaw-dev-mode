tasks (2026-10-07, Windows PC session):

1. "in the dev, the part where after compact it shoud greent me according to the compact hook, but it doesnt. investigate and report"
2. "write small handoff to /dev-mode folder"

---

# Claude — handoff: dev-mode-greeting after /compact (2026-10-07)

**Status:** investigated + reported. **No code changed.** Fix below waits for Ariel's go.
VPS was on `ff84ec1a2b5` (has the hook + wording fix). Times: Israel (UTC+3); VPS logs are UTC.

## Verdict

The hook works — it fires and its wake turn runs every time. It greets only if the session is idle
when compaction ends. `/compact` takes 4–7 min, so a message sent meanwhile is usually waiting; that
message's turn swallows the greeting instruction and the greeting turn then answers `NO_REPLY`.

## The four /compact runs that day

| /compact      | Result              | Why                                                                                      |
| ------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| 16:23 → 16:30 | no greeting         | Ariel's 16:28 question was queued; its turn drained the instruction; wake → NO_REPLY     |
| 16:36 → 16:37 | no greeting         | hook's 10-min per-session cooldown, armed by the lost 16:30 greeting                     |
| 20:59         | none (correct)      | compaction failed: Ollama Cloud 429 (5-hour limit)                                       |
| 21:00 → 21:04 | greeted at 21:04:42 | "Your two new crons are sitting pretty, ready to ruin your sleep at 03:00 and 03:30 IL…" |

## Mechanism

1. The hook queues the instruction as a session system event + requests a wake
   (`src/hooks/bundled/dev-mode-greeting/handler.ts:91-101`).
2. Normal user turns drain every queued system event except exec completions
   (`src/auto-reply/reply/session-system-events.ts:102-107`, called at
   `get-reply-run-admission.ts:169`). The wake retries every 1 s while the session is busy, but the
   queued message is first in the session lane.
3. Transcript proof (16:30): the question's turn reasoned "The system instructed me to write a short,
   snide chat message… not call tools…" (→ the odd "Did I not receive a message? I received _many_
   messages, mate…"); the wake turn saw only the heartbeat prompt → `NO_REPLY`, nothing sent.
4. Side effect: the leaked rule "do not call any tools" can sabotage a real request. Also seen on 09-29
   (the instruction landed inside a normal task turn and was then handled twice more).

## Latent (not the cause that day)

- Wake reason `"dev-mode:greeting"` (`handler.ts:98`) is not `hook:`-prefixed →
  `isTargetedUnscheduledWake` rejects it (`src/infra/heartbeat-wake-policy.ts:80-81`). Works only
  because `main` has `heartbeat.every: 30m`; without it the scheduler drops the wake as
  `skipped: disabled` (`src/infra/heartbeat-runner-scheduler.ts:325-336`); with `activeHours` it would
  drop outside them. Upstream `/hooks/wake` uses `hook:wake` (`src/gateway/server/hooks.ts:285`).
- The cooldown (`handler.ts:33`, `:86`) arms even when the greeting is never delivered, and applies to
  manual `/compact` too.

Ruled out: hook loaded (`loaded 2 internal hook handlers`, `hooks list` ready), `.env` has
`OPENCLAW_DEV_MODE=1` + `OPENCLAW_DEV_MODE_GREETING`, compaction (safeguard mode → legacy engine) fires
`session:compact:after`, delivery to self-chat works.

## Proposed fix (awaiting Ariel)

1. Mirror upstream's exec-completion exemption: user turns leave `dev-mode-greeting:*` events queued for
   the heartbeat path → greeting arrives right after the reply to the waiting message. One guarded filter
   in `session-system-events.ts`, logic in a fork-owned helper, regression note in the hook header.
2. Wake reason → `hook:dev-mode-greeting`.
3. Optional: manual `/compact` skips the cooldown (needs the trigger in the event context — small extra
   upstream hook).

Verify after deploy: `/compact`, send a message while it runs → expect the answer, then the greeting.
Check what was actually sent in `~/.openclaw/dev-mode/wa-history.db` (`messages` by WhatsApp id from the
log's `Sent message <id>` lines).

## Evidence recipe (read-only)

- Logs: `/tmp/openclaw/openclaw-YYYY-MM-DD.log`; the hook's wake run shares the compaction's `traceId`
  (run start = `tool-search: cataloged N tools…`).
- Transcript: `~/.openclaw/agents/main/agent/openclaw-agent.sqlite` → `transcript_events(session_id, seq,
event_json, created_at)`; system events are not persisted as text (only the model's thinking shows
  them); wake turns are user rows `[OpenClaw session event]`. Open with `node:sqlite` `readOnly: true`.

## Side notes

- The 7-min compaction hit WhatsApp ingress's 5-min handler timeout → the `/compact` message was
  re-dispatched and deduped (`skipped:duplicate`); the `IngressAdoptionLostError` lines at 16:30:55 are
  that noise, not a second compaction.
- This PC's clone: origin/main + 1 unpushed commit (SEC-97 revert) and a dirty `dist/` from a local build
  — left untouched.
