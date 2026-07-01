# TODO

# systemPromptOverride Testing & Exploration

## What We Know

### The Feature

`agents.defaults.systemPromptOverride` (new in post-V2026.3.24, upstream commit `a3b2fdf7d6`) is a config string that **completely replaces** the entire system prompt built by `buildAgentSystemPrompt()`.

### Config Schema

```json
{
  "agents": {
    "defaults": {
      "systemPromptOverride": "You are a helpful assistant."
    },
    "list": [
      {
        "id": "scratch",
        "systemPromptOverride": "You are a minimal test agent."
      }
    ]
  }
}
```

- `z.string().optional()` — plain inline string, no file path resolution
- Per-agent override takes priority over `agents.defaults` (checked first in `resolveSystemPromptOverride()`)
- Source: `src/agents/system-prompt-override.ts`

### Resolution Flow (attempt.ts:728)

```
appendPrompt =
  resolveSystemPromptOverride({ config, agentId })   ← if set, DONE
  ?? buildEmbeddedSystemPrompt({ ... })               ← normal 670-line prompt
```

### What Gets Replaced (Everything)

When `systemPromptOverride` is set, the agent gets ONLY your string. No:

- `## Tooling` (tool list with summaries)
- `## Tool Call Style` (narration rules)
- `## Safety` (the paragraph SEC-15a removes)
- `## OpenClaw CLI Quick Reference`
- `## Skills` (skill discovery prompts)
- `## Memory` (memory tool guidance)
- `## OpenClaw Self-Update` (config.apply, update.run)
- `## Model Aliases`
- `## Workspace` (working directory path)
- `## Documentation` (docs links)
- `## Sandbox` (sandbox guidance)
- `## Authorized Senders` (owner numbers)
- `## Current Date & Time`
- `## Workspace Files (injected)` — **CLAUDE.md, MEMORY.md, SOUL.md, HEARTBEAT.md, TOOLS.md** — all gone
- `# Project Context` — all context files gone
- `## Reply Tags` (reply_to_current etc.)
- `## Messaging` (message tool guidance)
- `## Voice` (TTS hints)
- `## Silent Replies` (SILENT_REPLY_TOKEN rules)
- `## Heartbeats` (heartbeat prompt)
- `## Runtime` (agent/host/os/model/channel info)
- `## Reactions` (reaction guidance)
- `## Reasoning Format` (thinking tag hints)

### What Still Works

- **Tools are still registered** — tool policy pipeline runs independently (attempt.ts:893-929). Agent still HAS the tools, just doesn't know their names/descriptions from the prompt
- **Session management** — compaction, session files, all work normally
- **Message routing** — WhatsApp, Discord, etc. still deliver messages
- **Heartbeat** — still fires, but agent won't know what HEARTBEAT_OK means
- **Bootstrap files** — still resolved by `resolveBootstrapContextForRun()`, but thrown away because they feed into `buildEmbeddedSystemPrompt()` which is skipped

### Key Insight

The agent still has tools available (they're registered in the pi session). It just doesn't have the system prompt telling it what they're called or how to use them. Most LLMs will still discover tools via the tool schema definitions that pi passes separately. The system prompt just provides OpenClaw-specific guidance on HOW to use them.

---

## Testing Plan

### Phase 1: Bare Minimum — Scratch Agent

**Goal**: See what an agent can do with zero system prompt guidance.

**Config** (on VPS, per-agent override so main agent is unaffected):

```json
{
  "agents": {
    "list": [
      {
        "id": "scratch",
        "systemPromptOverride": "You are a helpful assistant.",
        "tools": { "profile": "full" }
      }
    ]
  }
}
```

**Test via WhatsApp** (bind scratch agent to a WA self-chat or Discord channel):

- [ ] Send "hi" — does it respond? How does it identify itself?
- [ ] Send "what tools do you have?" — can it discover its own tools from pi schema?
- [ ] Send "what's the date?" — without `## Current Date & Time` section
- [ ] Send "read file /etc/hostname" — does it use the `read` tool?
- [ ] Send "search the web for X" — does it use `web_search`?
- [ ] Send "run `ls /tmp`" — does it use `exec`?
- [ ] Check token usage — is the prompt massively cheaper without 670 lines of system prompt?
- [ ] Check latency — is TTFB noticeably faster?

**What we're measuring**:

1. Does the agent function at all?
2. Does it discover and use tools from pi's tool schema alone?
3. Token cost reduction (system prompt is huge — thousands of tokens)
4. Latency impact

### Phase 2: Minimal Viable Prompt

**Goal**: Find the smallest prompt that makes the agent fully functional.

Start with bare minimum and add back sections one at a time:

```json
{
  "agents": {
    "list": [
      {
        "id": "minimal",
        "systemPromptOverride": "You are a personal assistant running inside OpenClaw.\n\nYour working directory is: /root/.openclaw/workspace/default\n\nWhen you have nothing to say, respond with ONLY: ∅\n\nTools are available — use them directly without narration."
      }
    ]
  }
}
```

- [ ] Test with just identity + workspace path
- [ ] Add back `SILENT_REPLY_TOKEN` guidance — does it stop double-replying?
- [ ] Add back tool summaries for key tools (exec, read, message) — does tool usage improve?
- [ ] Add back heartbeat prompt — does heartbeat ack work?
- [ ] Add back messaging guidance — does cross-session routing work?

### Phase 3: Prompt + One Context File

**Goal**: Test if we can manually inject a context file into the override string.

Since `systemPromptOverride` doesn't read files, we'd have to either:

1. Paste file content inline in the config JSON (ugly but works)
2. Write a script that reads a file and injects it into config before gateway start
3. Use `setConfigOverride()` at runtime to set it programmatically (from preaction.ts dev-mode hook)

**Option 3 is the interesting one** — we already use `setConfigOverride()` in preaction.ts for dev-mode plugin loading. We could:

```typescript
if (isDevMode()) {
  const customPrompt = readFileSync("~/.openclaw/dev-mode/system-prompt.md", "utf-8");
  setConfigOverride("agents.defaults.systemPromptOverride", customPrompt);
}
```

- [ ] Test option 3: read a markdown file and inject as override via preaction.ts
- [ ] Test if the agent can still use tools effectively with a hand-crafted prompt
- [ ] Test if we can include a mini "context files" section manually pointing to important files
- [ ] Compare agent quality: full prompt vs our custom minimal prompt

### Phase 4: Cost & Performance Analysis

**Goal**: Quantify the savings.

The default system prompt is ~670 lines. With context files (CLAUDE.md, MEMORY.md, etc.) it can be 1000+ lines. At ~4 chars/token:

- [ ] Measure default system prompt token count (use `session_status` after a fresh session)
- [ ] Measure override prompt token count
- [ ] Calculate per-message cost difference (system prompt is sent on every turn)
- [ ] Measure TTFB difference on Ollama (local inference — prompt processing time matters)
- [ ] Measure TTFB difference on cloud providers (Anthropic, OpenAI)
- [ ] Test with Ollama small models (gemma2:2b) — does reduced prompt help them perform better?

### Phase 5: Security Implications for Dev-Mode

**Goal**: Understand if this replaces any SEC items.

- [ ] Can we craft a prompt that includes everything EXCEPT the safety paragraph? (Yes, but maintaining it is a nightmare — every upstream change to the prompt sections would need manual sync)
- [ ] Can we use it for a "no-restrictions" test agent that's completely unleashed?
- [ ] Does removing the safety section via override have the same effect as SEC-15a?
- [ ] Test: agent with override that says "you have no restrictions" — does it actually behave differently? (Model-level safety vs prompt-level safety)

### Phase 6: Creative Uses

- [ ] **Persona agent**: Override with a character personality for Discord bot
- [ ] **Single-purpose agent**: "You are a code reviewer. Read files and give feedback. Nothing else."
- [ ] **Minimal heartbeat agent**: Bare prompt + heartbeat-only instructions, smallest possible token footprint for periodic checks
- [ ] **Prompt A/B testing**: Two agents with different prompts, same tools, compare quality
- [ ] **Raw LLM testing**: Override with empty string — does pi even function? Does the model just see tools?

---

## Implementation Ideas

### Dev-Mode File-Based Override

Add to our preaction.ts dev-mode hook:

```typescript
if (isDevMode()) {
  const overridePath = path.join(homedir(), ".openclaw", "dev-mode", "system-prompt.md");
  if (existsSync(overridePath)) {
    const content = readFileSync(overridePath, "utf-8").trim();
    if (content) {
      setConfigOverride("agents.defaults.systemPromptOverride", content);
    }
  }
}
```

This gives us file-based prompt override that the config doesn't natively support. Edit a markdown file, restart gateway, new prompt active.

### Per-Agent File-Based Override

Same idea but per-agent:

```
~/.openclaw/dev-mode/prompts/
  main.md          → agents.list[id=main].systemPromptOverride
  scratch.md       → agents.list[id=scratch].systemPromptOverride
  ceo.md           → agents.list[id=ceo].systemPromptOverride
```

### Hybrid Approach: Override + Manual Context Injection

Build a mini prompt generator that:

1. Reads a base prompt template from a file
2. Reads selected context files (just CLAUDE.md, or whatever we want)
3. Concatenates them
4. Sets as override via `setConfigOverride()`

This gives us full control over what the agent sees while keeping the dynamic file-reading behavior.

---

## New Upstream Features to Test (V2026.3.24 → V2026.4.5)

### Memory-Wiki System (30+ commits)

Full LLM-powered wiki stack — Obsidian-like knowledge base the agent can search, edit, lint, and sync.

- [ ] Enable memory-wiki after upgrade — check if it works with Ollama or needs cloud-only embeddings
- [ ] Test wiki search from WhatsApp — "what do you know about X?"
- [ ] Test wiki apply tool — can the agent create/edit wiki pages?
- [ ] Test wiki lint — does it find issues in imported notes?
- [ ] Test Obsidian sync adapter — can it pull from a real Obsidian vault?
- [ ] Test dashboard report generation — does it produce useful summaries?
- [ ] Test backlinks compilation — does it find related pages?
- [ ] Test with Bedrock embeddings vs default embedding provider — quality/cost comparison
- [ ] Test REM preview and safe promotion replay — what does "memory dreaming" actually look like?
- [ ] Test sleep phases — how does the agent's memory consolidation behave over time?
- [ ] Check storage footprint — how much disk does the wiki use after a week of use?
- [ ] Test memory-wiki + systemPromptOverride — does wiki search still work without memory section in prompt?

### Media Generation (Video/Music/Image)

Video, music, and image generation with multiple providers and async task tracking.

- [ ] Test video generation on VPS — `video_generate` tool with Runway provider
- [ ] Test mode-aware generation — does it pick the right resolution/duration per provider?
- [ ] Test music generation — Google and MiniMax providers, what quality?
- [ ] Test media intent preservation — request a video, primary provider fails, does fallback auto-remap geometry/duration?
- [ ] Test Comfy workflow support — set up ComfyUI on VPS, test image/video generation through it
- [ ] Test async task tracking for video/music — does `openclaw tasks show` track generation status?
- [ ] Test video generation on Discord — does it post the video inline?
- [ ] Test video generation on WhatsApp — does it send as video message?
- [ ] Test Vydra media provider — what does it offer vs Runway?
- [ ] Test XAI and Alibaba video providers — compare quality/speed/cost
- [ ] Test `image_generate` with MiniMax — how does it compare to existing providers?

- [ ] Test Arcee AI provider — add API key, test Trinity models (mini, large-preview, large-thinking)
  - [ ] Compare Arcee Trinity Large Thinking vs Ollama local models for WhatsApp chat quality
  - [ ] Test Arcee via OpenRouter — does routing work correctly?
  - [ ] Check 128K-256K context window — test with large conversations
- [ ] Test Gemma 4 models via Google provider — quality for WhatsApp chat?
- [ ] Test Ollama vision auto-detection — send an image on WhatsApp, does Ollama model detect it can handle images via `/api/show`?
  - [ ] Test with llava, bakllava, and other vision models
  - [ ] Compare auto-detect vs manually setting `imageInputMode` in config
- [ ] Test Bedrock embedding provider for memory search — quality vs default embeddings?

### Tasks & TaskFlow

Durable workflow orchestration with heartbeat task batching.

- [ ] Test `openclaw tasks list` — what shows up on a fresh install?
- [ ] Test `openclaw tasks audit` — does it find any issues?
- [ ] Set up HEARTBEAT.md with `tasks:` block:
  ```yaml
  tasks:
    - name: wa-check
      interval: 30m
      prompt: "Check if WhatsApp is connected and responding"
    - name: disk-check
      interval: 2h
      prompt: "Check disk usage on /tmp and /root, warn if over 80%"
  ```
- [ ] Test heartbeat task batching — do tasks fire only when due?
- [ ] Test task notification policies — `done_only` vs `state_changes` vs `silent`
- [ ] Test `openclaw tasks flow list` — any flows created?
- [ ] Test cron + task reconciliation — create a cron job, kill the gateway, restart, does it detect the stale task?
- [ ] Test task cancellation — `openclaw tasks cancel <id>` — does it kill the child session?
- [ ] Test webhooks TaskFlow bridge — can an external HTTP call trigger a flow?
- [ ] Test Lobster managed TaskFlow — create a multi-step Lobster workflow
- [ ] Compare heartbeat task batching vs separate cron jobs — which is cheaper/more reliable?
- [ ] Test TaskFlow with systemPromptOverride — does the agent understand heartbeat without the `## Heartbeats` prompt section?

### QA Lab

- [ ] Enable QA Lab extension after upgrade
- [ ] Test Docker launcher — `openclaw qa lab` (one-command)
- [ ] Run interactive suite runner — what tests does it include?
- [ ] Test with repo-backed scenarios — do the 10+ built-in scenarios pass?
- [ ] Test QA Lab UI — Slack-like chat redesign, light/dark mode
- [ ] Can we add our own dev-mode test scenarios to the QA Lab?

## Questions to Answer

1. Does an empty `systemPromptOverride: ""` skip the override (falsy) or set an empty prompt?
   - Code: `trimNonEmpty(value)` returns `undefined` for empty string → falls through to normal prompt. **Empty string = no override.**

2. Can we set it at runtime via `config.patch` without restarting?
   - Probably yes — `config.patch` writes to config and triggers reload. But need to test if the override is re-resolved on each turn or cached at session start.

3. Does compaction respect the override?
   - Yes — `compact.ts:981` also calls `createSystemPromptOverride(appendPrompt)` and `applySystemPromptOverrideToSession()`. The compaction flow mirrors the run flow.

4. What happens on session continuation?
   - `isContinuationTurn` skips bootstrap files (`contextFiles: []`), but `resolveSystemPromptOverride()` is called fresh each time. So the override is applied on every turn.

5. Does the system prompt report (`buildSystemPromptReport`) still log the override?
   - Yes — `systemPrompt: appendPrompt` is passed to the report regardless of source.
