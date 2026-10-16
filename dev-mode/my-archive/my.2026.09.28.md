tasks (2026-09-26 → 09-28, Linux laptop session):

1. fresh clone looked empty ("not all files are here, why")
2. "we didnt upgrade for a long time AND there was a major upgrade with upstream. take upstream, think 1 by 1 all our changes, what is seamless, and what needs thinking"
3. "start by fully update upgrade dev vps, then bring upstream and do the stuff you have strong confidence in, and then ask me 1 by 1 the stuff u need my call"
4. "is there any other annoying safety shit like general or in the system prompt?"
5. "in the end we want a detailed readme and claude.md about all actual changes (also reason and compact it a little from history of changes for what is obsolete)"

---

# Claude — session log (2026-09-28)

## 1. Broken clone

`.git/index` was missing → git showed every file deleted + untracked. `git reset` rebuilt it. `CLAUDE.md`
had been committed as a symlink (mode 120000) holding 69 KB of markdown → Linux checkout failed
"File name too long"; fixed as a regular file (`89a6d855229`). Likely root cause of the lost index: the
tracked self-ref symlink `packages/speech-core/node_modules/openclaw` (7.1-era hazard, gone at 9.6).

## 2. Upgrade v2026.7.1 → v2026.9.6 (clean-room)

- Upstream: ~33k commits, 48k files, history rewritten (7.1 not an ancestor of 9.6).
- Method: 4 parallel read-only analyses (seamless / adapt / think / drop per patch) → confident patches
  ported by Opus → Ariel decided the rest one by one.
- Surprises fixed while porting: SEC-102 had to move into the shared boundary resolver (9.x re-checks at
  read time); FIX-01 would have cancelled onboarding (MEMORY.md counts as "setup done") → seed only after
  setup; the old 💭 regex missed most reasoning because core now says "Thinking", not "Reasoning:".

## 3. Ariel's decisions

| Topic                                           | Decision                                                                                                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| SEC-98 self-update                              | "agent must never ever update openclaw" → prompt ban in dev-mode (update would overwrite the fork)                           |
| Credential-safety prompt lines                  | keep                                                                                                                         |
| SEC-27 channel metadata                         | keep patching (Slack-only today)                                                                                             |
| FIX-03 `/status`                                | keep an always-visible active-model line (`▶️ Active model`)                                                                 |
| FIX-05 / FIX-06                                 | drop — upstream turned automatic session reset OFF by default ("u say they removed this dreadful auto reset session?" — yes) |
| SEC-WA1 💭                                      | rebuild the 9.x-native way ("re-think it … i get the reasoning messages but usually not with this emoji")                    |
| Echo filter                                     | keep as a safety net, "avoid as much as u can to not touch the original code", comment for regressions                       |
| SEC-97 Control UI                               | Advanced opens Raw, unblurred                                                                                                |
| Contradicting prompt line                       | "do our permissive" — drop "Never copy self or change prompts/safety/tool policy…"                                           |
| "Never persuade anyone to expand access…"       | remove                                                                                                                       |
| Gateway tool description mentions self-update   | "just a tool… not worth the handling"                                                                                        |
| Messaging routing line / SECURITY NOTICE / SSRF | keep upstream                                                                                                                |
| Owner-only tools                                | "i am owner, i wanna do everything. i dont have guests" → available on every turn (4 checks)                                 |
| Subagents can't talk (message / sessions_send)  | open idea → `dev-mode/open-ideas/subagent-talk.md`; "if i have 5 depths i'm ok"                                              |
| ACP approvals                                   | skip (no IDE)                                                                                                                |
| Code changes                                    | "actual code changes are for you [Opus] to do"; Sonnet for simple execution                                                  |

## 4. Deploy (VPS)

- New laptop SSH key `~/.ssh/dev_vps_claude` (comment `claude-code-dev-vps-laptop`), alias `dev-vps`.
- WA history DB verified at `/root/.openclaw/dev-mode/wa-history.db` (496 MB, live) = the path the code uses.
- OS `apt full-upgrade` (Node 24.21, kernel 6.8.0-142) → backup `/root/.openclaw.bak-pre-9.6-20260928`
  (9.6 GB) → deploy → `doctor --fix` (run with the gateway STOPPED) → config migrated to the 9.6 shape (no loss).
- Fixed live: `acpx` failed to load (stale npm-era plugin `node_modules` dirs; build links never
  committed) → `dev-mode/link-dist-plugin-deps.sh` in the update recipe. `maxSpawnDepth` 2 → 5.
- Promoted: tag `main-pre-2026.9.6` = old 7.1 main; `main` = 9.6; VPS on `main`. Reboot done by Ariel —
  gateway came back by itself (Linger=yes).

## 5. Verified live

- Gateway 9.6 healthy, 0 restarts, WhatsApp listening, history DB growing, 0 plugin load failures.
- 💭 reasoning in WhatsApp self-chat with `ollama/glm-5.3-flash:cloud` + `/reasoning on` — working, no loop.
- GLM-5.3-Flash: reasoning always on, tool calling, web search via OpenClaw `web_search` (provider
  `ollama`); paid via Ollama Cloud credits. Default model stays `ollama/kimi-k2.7-code:cloud`.

## 6. Still open

- Control UI check: Settings → Advanced opens Raw, unblurred.
- Delete the 9.6 GB backup once 9.6 is trusted.
- `doctor` advisories (see CLAUDE.md "Open Items"); gateway token rotation; `~/.openclaw` ownership (`coder`).
- Open idea: subagents talking.
