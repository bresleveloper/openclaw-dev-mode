# Claude subscription compliance — OpenClaw dev-mode

> Yes, ariel — claude setup-token is the right command to generate a long-lived OAuth token for third-party apps like OpenClaw.
>
> Here's how it works:
>
> Run claude setup-token in your terminal
>
> Approve the browser authorization flow
>
> Copy the token that prints to your terminal
>
> Set it as the CLAUDE_CODE_OAUTH_TOKEN environment variable wherever you need authentication

— Claude's help agent, answering Ariel on 2026-10-11 (copied verbatim)

Written 2026-10-11. Not legal advice. Anthropic changes these rules often and says it may enforce them
"without prior notice", so re-read the sources below before relying on this page. How the runtime works
in detail: `dev-mode/claude-cli-flow.md`.

## How the VPS follows those steps

1. **`claude setup-token`**: Ariel runs it; sign-in completes in Anthropic's own browser flow.
2. **Copy the token**: it goes into OpenClaw once, with
   `openclaw models auth paste-token --provider anthropic --agent main`. It is stored as auth profile
   `anthropic:manual` (type `token`) in `~/.openclaw/state/openclaw.sqlite`.
3. **"Set it as `CLAUDE_CODE_OAUTH_TOKEN`"**: OpenClaw does this on every run with Claude Code's
   file-descriptor variant of that variable. It starts the official `claude` binary with
   `CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR=3` and writes the token to fd 3
   (`extensions/anthropic/cli-backend.ts:78-150`), so the token never appears in argv or in the environment.
4. **Agent turns on Claude models run inside that unmodified Claude Code binary**: this is the
   `claude-cli` runtime. OpenClaw only uses Claude Code's public interfaces: CLI flags, the stream-json
   control protocol and MCP. The one exception today is the utility model (see "Known gaps").

## What Anthropic says (checked 2026-10-11)

- **Agent SDK help article**
  ([support.claude.com/…/15036540](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)).
  - Notice of 2026-10-07: "You can still use the Claude Agent SDK, `claude -p`, and third-party apps with
    your subscription limits."
  - Notice of 2026-06-15: "We've paused the previously-announced changes to Claude Agent SDK usage." and
    "For now, nothing has changed."
- **Claude Code legal and compliance page**
  ([code.claude.com/docs/en/legal-and-compliance](https://code.claude.com/docs/en/legal-and-compliance)).
  - "Advertised usage limits for Pro and Max plans assume ordinary, individual usage of Claude Code and
    the Agent SDK."
  - OAuth "is intended exclusively for purchasers of Claude Free, Pro, Max, Team, and Enterprise
    subscription plans and is designed to support ordinary use of Claude Code and other native Anthropic
    applications."
  - "Anthropic does not permit third-party developers to offer Claude.ai login into their own
    applications, or to route requests through Free, Pro, or Max plan credentials on behalf of their
    users. Moreover, developers may not collect, store, or intermediate Claude.ai credentials or session
    tokens — sign-in to a Claude account must complete through Anthropic's own flow."
  - It does not "prevent an end user from signing in to the unmodified Claude Code binary with their own
    Claude subscription".
  - "Anthropic reserves the right to take measures to enforce these restrictions and may do so without
    prior notice."
- **Claude Code on Pro/Max help article**
  ([support.claude.com/…/11145838](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)).
  - Limits "are shared across Claude and Claude Code".
  - With `ANTHROPIC_API_KEY` set, Claude Code uses the key, "resulting in API usage charges rather than
    using your subscription's included usage".
  - "Monthly API credits included with Max plans can't be used in Claude Code or the Claude apps,
    including for extra usage."
- **Monthly API credits for Max and Team plans**
  ([platform.claude.com/…/api-credits-for-subscribers](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers)).
  - $100 a month on Max 5x and $200 on Max 20x, paid into one linked Console organization.
  - Covers the "Claude API, Claude Managed Agents, the Claude Agent SDK, and playground". Doesn't cover
    "Claude Code, extra usage in the Claude apps".
  - Credits expire each billing cycle with no rollover, and they are used through a Console API key, not
    through the setup-token.
- **Earlier in 2026 (press reports, not Anthropic pages)**: subscription OAuth in outside clients was
  blocked in January and February. From April 4, plan limits stopped covering third-party harnesses such
  as OpenClaw. On May 13 a separate Agent SDK credit was announced for June 15, then paused on June 15.
  The October 7 notice above is the current state.

## The three ways OpenClaw can reach Claude

| Route                                     | When it happens                                                                      | What talks to Anthropic                                                                                                                                                                                                                                                                                                | Billed as                                                                                                                                             | Verdict                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **A. `claude-cli` runtime + setup-token** | the model resolves to `agentRuntime.id: "claude-cli"`                                | the official `claude` binary, token on fd 3                                                                                                                                                                                                                                                                            | subscription limits                                                                                                                                   | ✅ the "unmodified Claude Code binary" case         |
| **B. embedded runtime + setup-token**     | an `anthropic/*` model that does NOT resolve to `claude-cli`, e.g. the utility model | OpenClaw's own HTTP client posing as Claude Code: `user-agent: claude-cli/<v>`, `x-app: cli`, a billing-header block and "You are Claude Code, Anthropic's official CLI for Claude." (`packages/ai/src/providers/anthropic-model-contract.ts:47-80`, `packages/ai/src/transports/anthropic-payload-policy.ts:213-227`) | OpenClaw's source says metered extra usage, or rejected without extra-usage balance (`src/agents/embedded-agent-runner/cli-backend-dispatch.ts:1-12`) | ⚠️ avoid: plan credentials used outside Claude Code |
| **C. API key**                            | an `anthropic` API-key profile, or `ANTHROPIC_API_KEY` in the gateway env            | OpenClaw's own HTTP client                                                                                                                                                                                                                                                                                             | API rates; Max monthly API credits apply                                                                                                              | ✅ metered, not the plan                            |

A Claude model reaches route A only through runtime policy. OpenClaw resolves it in this order: the
agent's exact model entry → `models.providers.anthropic.models[]` → the agent's wildcard entry such as
`agents.defaults.models["anthropic/*"]` → `models.providers.anthropic.agentRuntime`
(`src/agents/model-runtime-policy.ts:221-288`). Tool-free utility completions (titles, summaries,
progress notes) follow the same rule. When their model resolves to `claude-cli` they run in a short-lived
Claude Code process (`src/agents/isolated-completion.ts`); otherwise they take route B.

## Current state on the VPS (verified 2026-10-11 05:33 UTC)

- Claude Code 2.1.296 from Anthropic's native installer (`/root/.local/share/claude/versions/2.1.296`).
  There is no native login: no `~/.claude/.credentials.json`, and `claude auth status` → "Not logged in".
- One Anthropic credential: profile `anthropic:manual` (type `token`), shared by the `anthropic` and
  `claude-cli` providers. There is no API key, and no `CLAUDE*`/`ANTHROPIC*` variable in the gateway env
  or `~/.openclaw/.env`.
- The live Claude Code process of main's WhatsApp session runs the official binary as a child of the
  gateway, with `CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR=3` and no token or API-key variable in its
  environment. Its full command line is in `dev-mode/claude-cli-flow.md`.
- `main` → `anthropic/claude-opus-5-5`, fallback `ollama/kimi-k2.7-code:cloud`. All 10 `anthropic/*`
  entries in `agents.defaults.models` carry `agentRuntime.id: "claude-cli"`: opus-5-5, haiku-5-5,
  opus-5, sonnet-5, fable-5-1, fable-5, opus-4-8, opus-4-7, sonnet-4-6 and opus-4-6.
- The provider config has no `headers`, `apiKey` or custom `baseUrl`. The 2026-10-10 `user-agent`
  overlay is gone; it existed only to get route B past the Claude Code version gate, and route A sends the
  real binary's own version.
- Only Ariel can start turns from a channel: WhatsApp allowlists only his number, and Discord is disabled.
- Log of 2026-10-11 up to 05:33 UTC: 28 Claude Code runs (route A) and 20 direct API calls, all
  `claude-haiku-4-5` with HTTP 200 (route B).
- History, 2026-10-10 (UTC): before the switch to `claude-cli`, main ran embedded with the overlay
  (route B). That produced 34 direct Opus calls with HTTP 200 (20:35–21:35), 14 version-gate `400`s
  (20:22–21:38) and 1 transport error. The first Claude Code run was at 21:37, followed by 13 more until
  23:55. Direct Haiku calls ran all evening: 40 calls with HTTP 200, 20:24–23:31.

## Known gaps

1. **Utility model `anthropic/claude-haiku-4-5` takes route B.** It is the "provider default" utility
   model and has no `claude-cli` entry, so titles, summaries and progress notes call the API directly with
   the setup-token. No billing errors so far, so these calls may be drawing **extra usage**. Check the
   claude.ai usage page. Ariel is handling this himself. Any of these fixes closes it:
   - add a `claude-cli` entry for `anthropic/claude-haiku-4-5`;
   - add a wildcard `agents.defaults.models["anthropic/*"].agentRuntime.id = "claude-cli"`;
   - point the utility model at a model that already has a `claude-cli` entry, or at Ollama.
2. **Any Claude model outside the list takes route B**, for example a subagent spawned on
   `anthropic/claude-sonnet-4-5`. The wildcard above covers future models as well.
3. **Volume**: each OpenClaw subagent on a Claude model is one more Claude Code process on the same plan.
   Keep fan-out modest (`agents.defaults.subagents.maxConcurrent` is 4) so usage stays "ordinary,
   individual".

## Rules of thumb

- Get tokens only from `claude setup-token`, or from `claude auth login` on the VPS itself. Never copy
  tokens out of `~/.claude/` or from another app.
- Store the token in one place: `openclaw models auth paste-token`. Do not also put it in
  `~/.openclaw/.env`:
  - `CLAUDE_CODE_OAUTH_TOKEN` is stripped before OpenClaw launches Claude Code
    (`extensions/anthropic/cli-constants.ts:25-47`), so it does nothing there.
  - `ANTHROPIC_OAUTH_TOKEN` is read as an Anthropic credential by the embedded runner
    (`src/secrets/provider-env-vars.ts:25`), which means route B.
- Every `anthropic/*` model OpenClaw may use must resolve to `claude-cli`.
- No `user-agent` or other header overlays on `models.providers.anthropic`. If a `400
claude_code_version_too_old` appears, something is on route B, so fix the routing rather than the
  header. The real binary needs `claude update` now and then.
- Keep it personal: Ariel's agents working for Ariel. Don't serve other people's requests from this
  token. For anything shared or high-volume, use an API key (route C), where the Max monthly API credits
  apply.
- Don't patch or wrap the Claude Code binary. The compliance case rests on "unmodified".

## Re-check (VPS, one SSH session)

```
claude --version; claude auth status
openclaw models status --agent main < /dev/null
openclaw config get agents.defaults.models < /dev/null          # every anthropic/* → agentRuntime claude-cli
openclaw config get models.providers.anthropic < /dev/null      # no headers overlay, no stray agentRuntime surprises
L=/tmp/openclaw/openclaw-$(date -u +%F).log
grep -c 'model-fetch.*provider=anthropic' "$L"                  # route B (direct API) calls; should be 0
grep -c 'cli exec: provider=claude-cli' "$L"                    # route A (Claude Code) runs
```

Fast successful direct calls are logged only at debug level (`src/agents/provider-transport-fetch.ts:822-830`),
so the route B count is a lower bound.
