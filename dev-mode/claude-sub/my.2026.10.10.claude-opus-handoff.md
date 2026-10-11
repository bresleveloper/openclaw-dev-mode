> **Superseded on 2026-10-11. Read `claude-compliance.md` first.** Later on 2026-10-10 (21:37 UTC), main
> moved to the `claude-cli` runtime: the official Claude Code binary, with the token on fd 3. The
> `user-agent` header overlay in this recipe was then REMOVED. With the setup-token, that overlay makes
> OpenClaw's own HTTP client pose as Claude Code, and Anthropic bills that as extra usage or rejects it.
> Never re-add it. A `400 claude_code_version_too_old` now means some model is on the embedded route, so
> fix the routing, not the header. This file is kept as the setup and troubleshooting history.

tasks (2026-10-10, Windows PC session):

1. "need help, trying to get my dev openclaw to run with claude according to this https://docs.openclaw.ai/providers/anthropic, with tos change of this […], but i cant manage to succeed. connect to the dev vps and make it so that the main agent (only) is running opus 5.5 (the rest of everything, the "defaults" should stay at ollama kimi 2.7). also change the default of main agent only to thinking high. create a copy in /tmp/whatever of anything you change in case something breaks"
2. "seems easier to just upgrade the claude code - update to latest"
3. "turn off main agent heartbeat, he should not have one. after that write a handoff to /dev-mode about everything so any1 else with same issues can solve this"

---

# Claude — handoff: main agent on Claude Opus 5.5 via a Claude subscription setup-token (2026-10-10)

**Status:** working. `main` runs `anthropic/claude-opus-5-5`, thinking `high`, no recurring heartbeat.
`agents.defaults` + skill-suggester stay on `ollama/kimi-k2.7-code:cloud`. VPS config + Claude CLI only —
**no fork code changed**. VPS on `ff84ec1a2b5` (V2026.9.6 + FIX-07). Times: UTC (Israel = UTC+3).

Context: Anthropic support update 2026-10-07 — Max/Team plans include monthly API credits, and "you can
still use the Claude Agent SDK, `claude -p`, and third-party apps with your subscription limits".

## Verdict

Two blockers, in the order they showed up, plus one unrelated outage:

1. **No Anthropic credential at all** — `auth.profiles` held only `ollama:default`; the earlier
   `models auth login` / `onboard` attempts had stored nothing. Fix: setup-token via `paste-token`.
2. **`400 claude_code_version_too_old`** — "Claude Code 2.1.278 does not support this model; version
   2.1.280 or newer is required". Subscription (setup-token/OAuth) requests are sent _as Claude Code_;
   Opus 5.5 needs ≥ 2.1.280; 9.6 sends its hardcoded floor 2.1.278. **`claude update` alone does not fix
   it on 9.6** (see Mechanism). Fix: config header
   `models.providers.anthropic.headers["user-agent"] = "claude-cli/<installed version>"`.
3. _(Unrelated, still open)_ Ollama Cloud `429 You reached your Pro weekly limit` → `ollama:default` in a
   13 h rate-limit cooldown → every kimi agent (and main's kimi fallback) fails until the limit resets.

## Mechanism — why `claude update` alone isn't enough on 9.6

- Floor: `packages/ai/src/providers/anthropic-model-contract.ts:45` `ANTHROPIC_CLAUDE_CODE_VERSION =
"2.1.278"`. `buildAnthropicClaudeCodeIdentity()` (same file) takes a `user-agent: claude-cli/x.y.z` from
  its header sources only if it is newer than the floor, then sends `user-agent: claude-cli/<v>` (:80) and
  the billing system block `cc_version=<v>` (`packages/ai/src/transports/anthropic-payload-policy.ts:219`).
  OAuth-branch header sources: `model.headers`, then per-call option headers
  (`packages/ai/src/transports/anthropic-transport-stream.ts:504`).
- The installed CLI version is meant to arrive as an option header from the anthropic plugin:
  `extensions/anthropic/stream-wrappers.ts:53` (`createAnthropicClaudeCodeIdentityWrapper`) +
  `extensions/anthropic/cli-version.ts:10-20` (lazy, once per gateway process: `claude --version` from the
  gateway's PATH, 1.5 s timeout), wired at `extensions/anthropic/register.runtime.ts:881-886`.
- **The 9.6 gateway never starts the anthropic plugin for these models.**
  `src/plugins/gateway-startup-plugin-providers.ts:151-170` (`configuredModelProviderNeedsRuntimePlugin`):
  `anthropic/claude-*` uses API `anthropic-messages`, which is in `CORE_BUILT_IN_MODEL_APIS` → "core handles
  it" → plugin not started, even with `anthropic` in `plugins.allow`. Core still sends the request with the
  token (auth works), but the wrapper never runs → always the 2.1.278 floor.
- Proof: after `claude update` (2.1.132 → 2.1.296) + restart, and again after allowlisting + restart, the
  error still said 2.1.278 and the gateway log still said
  `http server listening (8 plugins: acpx, browser, device-pair, memory-core, ollama, talk-voice, tts-local-cli, whatsapp; …)`.
- Misleading: the CLI's `openclaw plugins list` showed `anthropic` as enabled / `loaded` the whole time —
  that is the CLI process's view, not the gateway's. Trust the gateway's startup line.
- The fix path: `model.headers` comes from config `models.providers.<id>.headers`
  (`src/config/zod-schema.core.ts:584`; bundled-provider overlays may omit `baseUrl`/`models`, :594-598),
  so the overlay feeds the same `buildAnthropicClaudeCodeIdentity()` and beats the floor. Its value is the
  real installed version — exactly what the plugin wrapper would have sent.

## Recipe (anyone with the same setup)

0. Snapshot `~/.openclaw/openclaw.json` and `~/.openclaw/state/openclaw.sqlite` (step 2 writes the latter;
   take an online copy with `node:sqlite` `backup()` or `sqlite3 .backup`, not `cp`, while the gateway runs).
1. Make a token on any machine with a browser + Claude Code: `claude setup-token` → `sk-ant-oat01-…` (~1 year).
2. Store it on the gateway host **without putting it on a command line**:
   ```
   printf '%s\n' "$TOKEN" | ssh <vps> 'openclaw models auth paste-token --provider anthropic --agent main'
   ```
   (or run `openclaw models auth paste-token --provider anthropic --agent main` in an interactive shell — masked
   prompt). Result: profile `anthropic:manual` (type token) in the shared store
   `~/.openclaw/state/openclaw.sqlite` + an `auth.profiles` entry in config. Hot, no restart.
   - `models auth login` / `setup-token` over non-TTY SSH fail with "requires an interactive TTY"
     (`src/commands/models/auth.ts:714`, `:1323`); `paste-token` reads piped stdin (`auth.ts:155`).
   - Avoid `--set-default` and `openclaw onboard --auth-choice anthropic`: they move the **global** default model.
3. Update Claude Code on the gateway host: `/root/.local/bin/claude update` (not on the non-interactive SSH
   PATH); note `claude --version`.
4. One config patch — `openclaw config patch --file p.json5 --dry-run`, then without `--dry-run`, then
   `openclaw config validate`:
   ```json5
   {
     agents: {
       defaults: { contextPruning: { mode: "off" } }, // keep the other agents' behaviour (see Gotchas)
       entries: {
         main: {
           model: {
             primary: "anthropic/claude-opus-5-5",
             fallbacks: ["ollama/kimi-k2.7-code:cloud"],
           },
           thinkingDefault: "high",
           heartbeat: { every: "0m" }, // optional: no recurring heartbeat for this agent
         },
       },
     },
     // = the installed `claude --version`
     models: { providers: { anthropic: { headers: { "user-agent": "claude-cli/2.1.296" } } } },
   }
   ```
   All hot-reloaded, no restart (`src/gateway/config-reload-plan.ts`: `agents.defaults` :183,
   `agents.entries` :209, `models` :202, `auth.profiles` :275; only `gateway.auth.token|password` force a
   restart, :90/:144). The kimi fallback is optional — drop `fallbacks` for Opus-only.
5. Verify:
   - `openclaw models status --agent main` → `Default (agent): anthropic/claude-opus-5-5`, `anthropic:manual` listed.
   - `openclaw gateway call sessions.list --json --params '{"agentId":"main"}'` → rows show
     `model: claude-opus-5-5`, `thinkingDefault: high`, `modelOverrideSource: null`. A session with its own
     model override or `thinkingLevel` beats the agent default — clear it there.
   - Isolated test turn (no `--deliver` → nothing reaches a channel):
     `openclaw agent --agent main --session-key opus-test --json --message "Reply with exactly: opus-ok"` →
     `result.meta.agentMeta.provider/model` = `anthropic`/`claude-opus-5-5`,
     `executionTrace.fallbackUsed: false`, `requestShaping.thinking: "high"`.
   - Gateway log `/tmp/openclaw/openclaw-YYYY-MM-DD.log`:
     `[model-fetch] response provider=anthropic … model=claude-opus-5-5 status=200`.

## Gotchas

- **Anthropic smart defaults** (`extensions/anthropic/config-defaults.ts:279-294`), active once any
  Anthropic profile exists: unset `agents.defaults.contextPruning.mode` → `cache-ttl`/1h for **all** agents
  (our Ollama models use `api: "anthropic-messages"`, so they qualify); unset
  `agents.defaults.heartbeat.every` → `1h` (token/OAuth; `30m` for API keys). They ship in the plugin's
  policy artifact (`extensions/anthropic/provider-policy-api.ts`), which core loads directly
  (`src/plugins/provider-policy-surface.ts`) without starting the plugin — assume they apply. Pinning
  `contextPruning.mode` keeps the old behaviour.
- **Heartbeat off for one agent:** `agents.entries.<id>.heartbeat.every: "0m"`
  (https://docs.openclaw.ai/gateway/heartbeat). Don't delete the block instead: if any entry has a
  heartbeat block, only those agents run (`src/infra/heartbeat-config.ts:114`); delete the last block and
  the injected `defaults.heartbeat.every = 1h` enrolls every agent. `0m` → no interval (`:82`); the built-in
  job `heartbeat-<id>` stays in `openclaw cron list --all` with `enabled: false`. Event wakes (e.g. a
  background exec finishing) still happen; `agents.entries.<id>.tools.exec.notifyOnExit: false` stops those.
- **Model allowlist:** `agents.defaults.models` is a legacy exact-only allowlist that keeps each agent's
  configured default (`src/agents/model-selection-shared.ts:1570`), so Opus need not be added. Add it (e.g.
  `"anthropic/claude-opus-5-5": { alias: "OPUS" }`) only to allow `/model OPUS` switching.
- Everything the agent runs now bills the subscription: its cron jobs (8 for main here) and its utility
  model (`anthropic/claude-haiku-4-5`, the provider default). Set a model on cron payloads if that's too much.
- `openclaw gateway stop` refuses on the operator's service without `--force`; `openclaw gateway restart`
  works. `openclaw models status --probe` refuses while the gateway runs → use the test turn.
- `openclaw models list --provider anthropic` says "No models found" (configured-only view) — use `--all`
  (the catalog shows up once auth exists).
- Tried and useless: `plugins.allow` += `anthropic` (startup planner above). It is still in the VPS
  config — harmless.
- Untested alternative: a Console API key (`openclaw models auth paste-api-key --provider anthropic --agent
main`, possibly covered by the new Max/Team monthly API credits) skips the Claude Code identity
  entirely — no version gate, no overlay.

## Maintenance

- `claude_code_version_too_old` again (Anthropic raised the minimum): `/root/.local/bin/claude update` on the
  VPS, bump the header to the new `claude --version` (hot, no restart).
- Every OpenClaw upgrade: check `ANTHROPIC_CLAUDE_CODE_VERSION` and whether the gateway startup line now lists
  `anthropic` for an `anthropic/*` agent model. If either changed, the overlay may be removable.
- Possible fork patch (not done, Ariel's call): bump the floor constant, or start the anthropic plugin when an
  agent uses `anthropic/*` with a token profile.

## What changed on the VPS (2026-10-10, UTC)

| Time   | Change                                                                     | Backup in `/tmp/openclaw-opus-main-20261010/`                                  |
| ------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 20:16  | snapshots                                                                  | `openclaw.json`, `openclaw.json.last-good`, `dot-env`, `state-openclaw.sqlite` |
| ~20:20 | token → `anthropic:manual` (paste-token via stdin)                         | `state-openclaw.sqlite` (pre-token)                                            |
| 20:21  | main → Opus 5.5 + kimi fallback, thinking high; `contextPruning.mode: off` | `patch-main-opus.json5`                                                        |
| 20:25  | Claude Code 2.1.132 → 2.1.296; gateway restart                             | `claude-2.1.132-binary`, `claude-symlink-before`, `claude-cli-before.txt`      |
| 20:28  | `plugins.allow` += `anthropic` (+ restart 20:29) — no effect               | `openclaw.json.after-step1`, `patch-plugins-allow.json5`                       |
| 20:34  | `models.providers.anthropic.headers` user-agent overlay → **works**        | `openclaw.json.after-step2`, `patch-anthropic-ua.json5`                        |
| 20:45  | `agents.entries.main.heartbeat.every: "0m"` → `heartbeat-main` disabled    | `openclaw.json.before-heartbeat-off`, `cron-list-before-heartbeat-off.json`    |

Rollback: `cp /tmp/openclaw-opus-main-20261010/openclaw.json ~/.openclaw/openclaw.json` (hot;
`openclaw gateway restart` to be sure). CLI: `ln -sfn /root/.local/share/claude/versions/2.1.132
/root/.local/bin/claude`. `/tmp` gets cleaned — move the folder if it should survive.

## Side notes

- Until 20:34 every main turn failed — kimi 429 (Ollama weekly limit), and from 20:21 first the Opus 400.
  WhatsApp messages in that window need resending.
- Test session `agent:main:opus-test-20261010` is left in main's session store.
- The setup-token was pasted into the Claude Code chat, so it sits in that session's local transcript on
  the PC. Regenerate (`claude setup-token` + `paste-token`) if that matters.
- Pre-existing, untouched: root's `~/.bash_history` holds a plaintext OpenRouter key (an old
  `openclaw onboard --token …`); alias `GLM` resolves to `openai/glm-5.3-flash:cloud` because its
  `agents.defaults.models` key lacks the `ollama/` prefix.
- acpx's "claude" agent runs its own `npx @agentclientprotocol/claude-agent-acp` against Ollama — not
  affected by the Claude Code update.
- This PC's clone: still origin/main + 1 unpushed commit (SEC-97 revert) and a dirty `dist/` — untouched;
  this handoff is not committed.
