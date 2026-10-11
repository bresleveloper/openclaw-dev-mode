# How OpenClaw drives Claude Code (`claude-cli` runtime) — V2026.9.6

Written 2026-10-11 from the 9.6 source and docs. Companion: `dev-mode/claude-compliance.md` (Anthropic's
rules and how this setup follows them).

## TL;DR

- OpenClaw does **not** start a new `claude -p` per message. Each OpenClaw session gets **one long-lived
  `claude --print` process in streaming-input mode**, driven over Claude Code's stdio control protocol (the
  same protocol the Claude Agent SDK uses). It is reused across turns while nothing relevant changes.
- Claude Code runs the agent loop with its own tools (Bash, Read, Edit, Grep, WebFetch, Agent…). OpenClaw's
  tools (`message`, `sessions_spawn`, `gateway`, `openclaw`, cron…) reach it as MCP tools served by the
  gateway over HTTP on 127.0.0.1.
- The subscription token is handed to the real Claude Code binary on file descriptor 3; OpenClaw never puts
  it in argv or the environment.

## The flow of one WhatsApp turn

```
WhatsApp msg ─▶ gateway: anthropic/claude-opus-5-5 → runtime claude-cli
                │ prepare: OpenClaw system prompt, Claude session id,
                │          MCP config → http://127.0.0.1:<port>/mcp (+ per-run grant)
                ▼
   warm `claude` for this session? ── no ─▶ spawn `claude --print …` (token on fd 3)
                │ yes                        + control "initialize" (prompt, hooks)
                ▼
   stdin  ◀── {"type":"user", content:<turn>}       (one JSON line per turn)
   stdout ──▶ stream-json: thinking, text, tool_use, result
                ├─ native tool (Bash/Read/Edit/Agent…) ─▶ can_use_tool / PreToolUse ─▶ OpenClaw policy
                └─ mcp__openclaw__<tool> ─▶ HTTP to gateway loopback ─▶ tool runs in the gateway
                ▼
   result ─▶ transcript mirrored to SQLite, reply sent; process stays warm 10 min
```

### 1. Routing

`agents.entries.main.model.primary = "anthropic/claude-opus-5-5"` plus
`agents.defaults.models["anthropic/claude-opus-5-5"].agentRuntime.id = "claude-cli"` sends the run to the
CLI runner (`src/agents/cli-runner/`) with the backend the bundled anthropic plugin registers
(`extensions/anthropic/cli-backend.ts`). On the VPS all 10 configured `anthropic/*` models carry that
runtime.

Runtime policy is resolved in this order (`src/agents/model-runtime-policy.ts:221-288`): the agent's exact
model entry → `models.providers.<p>.models[]` → the agent's wildcard entry (e.g. `"anthropic/*"`) →
`models.providers.<p>.agentRuntime`. A Claude model with no match anywhere runs on OpenClaw's embedded
runner instead, i.e. direct API calls (see the compliance doc).

### 2. Launch (only when no warm process fits)

Observed on the VPS on 2026-10-11 (live process of main's WhatsApp session, child of the gateway,
`exe → /root/.local/share/claude/versions/2.1.296`):

```
/root/.local/bin/claude --strict-mcp-config --mcp-config /tmp/openclaw-cli-mcp-<rand>/mcp.json
  --disallowedTools ScheduleWakeup,CronCreate,Bash(run_in_background:true),Monitor,WebSearch
  --plugin-dir /tmp/openclaw/openclaw-claude-skills-<rand>/openclaw-skills --effort high
  --print --input-format stream-json --output-format stream-json --verbose
  --include-partial-messages --replay-user-messages
  --permission-prompt-tool stdio --permission-mode default --setting-sources user
  --model claude-opus-5-5 --allowedTools mcp__openclaw__* --session-id <uuid>
env: CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR=3  CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1
     CLAUDE_CODE_AUTO_COMPACT_WINDOW=400000     (no token or API-key variable)
```

Sources: default args `extensions/anthropic/cli-backend.ts:40-52`; transport argv
`extensions/anthropic/cli-runtime-args.ts:98-118`; MCP flags and the `WebSearch` denial
`src/agents/cli-runner/bundle-mcp-claude.ts:89-127`; OpenClaw skills as a Claude Code plugin
`src/agents/cli-runner/claude-skills-plugin.ts:92-156`. Thinking maps to `--effort` / `MAX_THINKING_TOKENS`
(`cli-backend.ts:264-275`). A resumed session uses `--resume <id>` instead of `--session-id`.

### 3. Auth

- OpenClaw first strips `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`,
  `CLAUDE_CODE_OAUTH_TOKEN` and similar from the child environment, so Claude Code cannot fall back to API
  billing or a stray token (`extensions/anthropic/cli-constants.ts:25-47`).
- The selected profile (here `anthropic:manual`, a `claude setup-token` token saved with
  `openclaw models auth paste-token`) is written to **fd 3**, with `CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR=3`
  in the env (`cli-backend.ts:78-150`). An API-key profile would use `CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR`.
- With no forwarded profile, Claude Code uses its own native login (`claude auth login`); OpenClaw never
  reads or forwards native login tokens. On the VPS there is no native login (`claude auth status` says
  "Not logged in") — runs work because of the fd-3 token.

### 4. Prompt

Claude Code keeps its own system prompt. OpenClaw's prompt (AGENTS.md, SOUL.md, tool rules…) is appended
through the control-protocol `initialize` request, which also registers two hooks, `UserPromptSubmit` and
`PreToolUse` (`extensions/anthropic/cli.runtime.ts:388-400`).

### 5. Turns and tools

- Each turn is one JSON `user` line on stdin (`cli.runtime.ts:425-431`); stdout streams thinking, text,
  `tool_use` and a final `result`.
- **Native tools**: before a call, Claude Code sends `can_use_tool` (or the `PreToolUse` hook fires);
  OpenClaw answers from its tool policy and exec approvals (`cli.runtime.ts:107-205`). With the default
  `security: "full"`, `ask: "off"` they run.
- **OpenClaw tools**: Claude calls `mcp__openclaw__<tool>` → HTTP POST to the gateway's loopback MCP server
  with a per-run bearer grant → the gateway runs the tool in-process (`src/gateway/mcp-http.ts:195-470`).
  This is the layer where FIX-08's `missing scope: operator.admin` happens.

### 6. Reuse and restarts

- The warm process is reused only while agent, session, auth profile, model, system prompt and tool policy
  all match (a fingerprint). Otherwise OpenClaw kills it and starts a new one with `--resume <id>`, so the
  conversation continues. Log lines: `cli exec: … reuse=reusable` or `reuse=invalidated:<reason>`, then
  `cli live session start`, then `cli turn: … durationMs=…`.
- Idle limit: 10 minutes (`cli.runtime.ts:19,226-237`). Gateway-wide cap: 16 warm processes; beyond that
  new runs fail over with "Too many CLI live sessions are active" (`cli-live-session-registry.ts:14,155-164`).
- Claude Code keeps its own transcript under `~/.claude/projects/`; OpenClaw mirrors each turn into its
  SQLite session store (`src/agents/cli-runner/cli-run-transcript.ts`).

### 7. Fresh one-shot processes

`/compact` (`claude -p "/compact"`), side questions and tool-free utility completions (titles, digests,
progress notes) start their own short-lived process when their model is routed to `claude-cli`
(`src/agents/isolated-completion.ts`). A utility model without a `claude-cli` route calls the API directly
instead; see the compliance doc.

### 8. Background work

Claude Code's own background agents (its Agent tool) are supported: OpenClaw can deliver the answer while
they run and keeps the process until they finish (`cli.runtime.ts:20-24,264-330`).

## What this means for subagents

- **OpenClaw subagents** (`sessions_spawn`) on a Claude model = one more warm Claude Code process each,
  same subscription limits. Parallel children multiply usage; keep `agents.defaults.subagents.maxConcurrent`
  modest (4 on the VPS).
- **Claude Code's own Agent tool** runs inside the parent's process — same limits, invisible to OpenClaw's
  session list.
- **Children on Ollama models** run in OpenClaw's embedded loop against Ollama Cloud; no Claude involved.
