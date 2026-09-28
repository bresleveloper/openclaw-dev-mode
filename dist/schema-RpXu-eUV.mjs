import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { r as isSensitiveUrlConfigPath, t as SENSITIVE_URL_HINT_TAG } from "./redact-sensitive-url-DspuXlEe.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { t as CHANNEL_IDS } from "./ids-NACrHrny.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-BMhosYMN.mjs";
import { t as isSensitiveConfigPath } from "./sensitive-paths-CR94ndkx.mjs";
import { n as sensitive } from "./zod-schema.sensitive-3bxjhHYT.mjs";
import { g as DESKTOP_FIELD_LABELS, h as DESKTOP_FIELD_HELP, n as TELEMETRY_FIELD_HELP, o as NODE_HOST_FIELD_LABELS, r as TELEMETRY_FIELD_LABELS, t as OpenClawSchema } from "./zod-schema-B-u3AXjg.mjs";
import { n as CLOUD_WORKER_FIELD_LABELS, o as walkConfigSchema, t as CLOUD_WORKER_FIELD_HELP } from "./zod-schema.cloud-workers-Bwo2REFq.mjs";
import { i as schemaHasChildren, n as cloneSchema, r as findWildcardHintMatch, t as asSchemaObject } from "./schema.shared-CcT3A7OF.mjs";
import crypto from "node:crypto";
//#region src/config/channel-config-keys.ts
const CHANNEL_KERNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
/** Return whether a channel config key names a kernel-owned namespace. */
function isKernelOwnedChannelConfigKey(key) {
	return CHANNEL_KERNEL_CONFIG_KEYS.has(key);
}
//#endregion
//#region src/config/schema.help.agents.ts
const AGENT_FIELD_HELP = {
	ui: "UI presentation settings for accenting and operator display preferences. Use this for readability customization without changing runtime behavior.",
	"ui.seamColor": "Primary accent color used by UI surfaces for emphasis, badges, and visual identity cues. Use high-contrast values that remain readable across light/dark themes.",
	"ui.prefs.accent": "Control UI accent: #RRGGBB for a custom color, or 'theme' for the selected theme’s palette. Overrides ui.seamColor; clear it to inherit the configured seam color or theme default.",
	tui: "Terminal UI display settings. Use this section for terminal-only presentation preferences without changing Gateway or other UI behavior.",
	"tui.footer": "Terminal UI footer display settings. Keep optional context compact so session, model, goal, and token information stay readable.",
	plugins: "Plugin system controls for enabling extensions, constraining load scope, configuring entries, and tracking installs. Keep plugin policy explicit and least-privilege in production environments.",
	"plugins.enabled": "Enable or disable plugin/extension loading globally during startup and config reload (default: true). Keep enabled only when extension capabilities are required by your deployment.",
	"plugins.allow": "Optional allowlist of plugin IDs; when set, only listed plugins are eligible to load. Configured bundled chat channels can still activate their bundled plugin when the channel is explicitly enabled in config. Use this to enforce approved extension inventories in controlled environments.",
	"plugins.deny": "Optional denylist of plugin IDs that are blocked even if allowlists or paths include them. Use deny rules for emergency rollback and hard blocks on risky plugins.",
	"plugins.load": "Plugin loader configuration group for specifying filesystem paths where plugins are discovered. Keep load paths explicit and reviewed to avoid accidental untrusted extension loading.",
	"plugins.load.paths": "Additional plugin files or directories scanned by the loader beyond built-in defaults. Use dedicated extension directories and avoid broad paths with unrelated executable content.",
	"plugins.slots": "Selects which plugins own exclusive runtime slots such as memory so only one plugin provides that capability. Use explicit slot ownership to avoid overlapping providers with conflicting behavior.",
	"plugins.slots.memory": "Select the active memory plugin by id, or \"none\" to disable memory plugins.",
	"plugins.slots.contextEngine": "Selects the active context engine plugin by id so one plugin provides context orchestration behavior.",
	"plugins.entries": "Per-plugin settings keyed by plugin ID including enablement and plugin-specific runtime configuration payloads. Use this for scoped plugin tuning without changing global loader policy.",
	"plugins.entries.*.enabled": "Per-plugin enablement override for a specific entry, applied on top of global plugin policy. With the default hybrid reload mode, changes hot-reload the plugin runtime for new agent turns without restarting the Gateway unless the plugin requires a restart for this path. Use this to stage plugin rollout gradually across environments.",
	"plugins.entries.*.hooks": "Per-plugin typed hook policy controls for core-enforced safety gates. Use this to constrain high-impact hook categories without disabling the entire plugin.",
	"plugins.entries.*.hooks.allowPromptInjection": "Controls whether this plugin may mutate prompts through typed hooks. Set false to block `before_prompt_build`.",
	"plugins.entries.*.hooks.allowConversationAccess": "Controls whether this plugin may read raw conversation content from typed hooks such as `before_agent_run`, `before_model_resolve`, `before_agent_reply`, `llm_input`, `llm_output`, `before_agent_finalize`, and `agent_end`. Non-bundled plugins must opt in explicitly.",
	"plugins.entries.*.hooks.timeoutMs": "Default timeout in milliseconds for this plugin's typed hooks, capped at 600000. When unset, each hook uses the plugin's declared timeout or the Gateway's per-hook policy; there is no single fixed default. Per-hook values in hooks.timeouts take precedence.",
	"plugins.entries.*.hooks.timeouts": "Per-hook timeout overrides in milliseconds keyed by typed hook name, capped at 600000. Use narrow overrides for known slow hooks such as before_prompt_build or agent_end instead of raising every hook timeout.",
	"plugins.entries.*.subagent": "Per-plugin subagent runtime controls for model override trust and allowlists. Keep this unset unless a plugin must explicitly steer subagent model selection.",
	"plugins.entries.*.subagent.allowModelOverride": "Explicitly allows this plugin to request provider/model overrides in background subagent runs. Keep false unless the plugin is trusted to steer model selection.",
	"plugins.entries.*.subagent.allowedModels": "Allowed override targets for trusted plugin subagent runs as canonical \"provider/model\" refs. Use \"*\" only when you intentionally allow any model.",
	"plugins.entries.*.llm": "Per-plugin api.runtime.llm.complete controls for model and agent override trust. Keep this unset unless a plugin must explicitly steer host-owned completion calls.",
	"plugins.entries.*.llm.allowModelOverride": "Explicitly allows this plugin to request model overrides in api.runtime.llm.complete. Keep false unless the plugin is trusted to steer model selection.",
	"plugins.entries.*.llm.allowedModels": "Allowed override targets for trusted plugin LLM calls as canonical \"provider/model\" refs. Use \"*\" only when you intentionally allow any model override.",
	"plugins.entries.*.llm.allowedCompletionModels": "Allowed targets for every plugin LLM completion as canonical \"provider/model\" refs, including host-resolved defaults and overrides. Use \"*\" only when you intentionally allow any model.",
	"plugins.entries.*.llm.allowAuthProfileOverride": "Allows this plugin to select a non-default auth profile for isolated agent-runtime completions. Keep false unless the plugin is trusted for explicit isolated credential routing.",
	"plugins.entries.*.llm.allowAgentIdOverride": "Explicitly allows this plugin to request api.runtime.llm.complete against a non-default agent id. Keep false unless the plugin is trusted for cross-agent model access.",
	"plugins.entries.*.apiKey": "Optional API key field consumed by plugins that accept direct key configuration in entry settings. Use secret/env substitution and avoid committing real credentials into config files.",
	"plugins.entries.*.env": "Per-plugin environment variable map injected for that plugin runtime context only. Use this to scope provider credentials to one plugin instead of sharing global process environment.",
	"plugins.entries.*.config": "Plugin-defined configuration payload interpreted by that plugin's own schema and validation rules. Use only documented fields from the plugin to prevent ignored or invalid settings.",
	"agents.entries.*.identity.avatar": "Agent avatar (workspace-relative path, http(s) URL, or data URI).",
	"agents.defaults.model.primary": "Primary model (provider/model).",
	"agents.defaults.model.fallbacks": "Ordered fallback models (provider/model). Used when the primary model fails.",
	"agents.defaults.embeddedAgent.cyberFailover": "Automatic Daybreak escalation for replay-safe OpenAI cyber-policy refusals in the embedded runtime.",
	"agents.defaults.embeddedAgent.cyberFailover.mode": "Enable automatic escalation (\"auto\", default) or keep provider refusals terminal (\"off\").",
	"agents.defaults.embeddedAgent.cyberFailover.model": "Provider/model target used for automatic cyber-policy escalation.",
	"agents.defaults.embeddedAgent.cyberFailover.cooloffMs": "How long an unavailable escalation target is skipped for the current session.",
	"agents.defaults.utilityModel": "Optional lower-cost model (provider/model or alias) for short internal tasks such as generated titles and progress narration. Unset derives the primary provider's declared small model when available (otherwise the primary model); set to an empty string to disable utility routing.",
	"agents.entries.*.utilityModel": "Optional per-agent utility model override for short internal tasks. Overrides agents.defaults.utilityModel.",
	"agents.defaults.decisionModel": "Optional provider/model for typed choices, scores, and boolean probabilities. Unset or empty disables decision calls. Supporting plugins send bounded task evidence to this provider; chat and utility models are unchanged.",
	"agents.entries.*.decisionModel": "Per-agent decision model. Unset inherits agents.defaults.decisionModel; an empty string disables decision calls for this agent.",
	"agents.entries.*.models": "Per-agent model catalog overrides keyed by full provider/model IDs.",
	"agents.entries.*.modelPolicy": "Per-agent model override policy. An explicit allow list replaces the default policy for this agent.",
	"agents.entries.*.modelPolicy.allow": "Allowed model override refs for this agent. Accepts aliases, full \"provider/model\" refs, and trailing prefix wildcards such as \"provider/*\" or \"provider/namespace/*\"; empty permits any model.",
	"agents.entries.*.models.*.agentRuntime": "Optional per-model runtime policy for this agent. Use this for agent-specific model exceptions instead of setting a whole-agent runtime.",
	"agents.entries.*.models.*.agentRuntime.id": "Per-agent model runtime id: \"openclaw\", \"auto\", a registered plugin harness id such as \"codex\", or a supported CLI backend alias such as \"claude-cli\".",
	"agents.entries.*.models.*.codeMode": "OpenClaw Code Mode for this agent and exact provider/model: On forces it on, Off disables it, and Default inherits the agent activation setting, then the shared model override, then tools.codeMode.enabled. This does not change the selected runtime or Codex native Code Mode.",
	"agents.defaults.imageModel.primary": "Optional image model (provider/model) used when the primary model lacks image input.",
	"agents.defaults.imageModel.fallbacks": "Ordered fallback image models (provider/model).",
	"agents.defaults.mediaModels.image.primary": "Optional image-generation model (provider/model) used by the shared image generation capability.",
	"agents.defaults.mediaModels.image.fallbacks": "Ordered fallback image-generation models (provider/model).",
	"agents.defaults.mediaModels.image.timeoutMs": "Default provider request timeout in milliseconds for image_generate calls. Per-call timeoutMs overrides this.",
	"agents.defaults.mediaModels.video.primary": "Optional video-generation model (provider/model) used by the shared video generation capability.",
	"agents.defaults.mediaModels.video.timeoutMs": "Default provider request timeout in milliseconds for video_generate calls. Per-call timeoutMs overrides this, and this value overrides provider-authored defaults.",
	"agents.defaults.mediaModels.video.fallbacks": "Ordered fallback video-generation models (provider/model).",
	"agents.defaults.mediaModels.music.primary": "Optional music-generation model (provider/model) used by the shared music generation capability.",
	"agents.defaults.mediaModels.music.fallbacks": "Ordered fallback music-generation models (provider/model).",
	"agents.defaults.voiceModel.primary": "Optional voice model (provider/model) used by speech, transcription, and realtime voice capabilities.",
	"agents.defaults.voiceModel.fallbacks": "Ordered fallback voice models (provider/model).",
	"agents.defaults.voiceModel.timeoutMs": "Default provider request timeout in milliseconds for voice model operations when the caller supports timeouts.",
	"agents.defaults.pdfModel.primary": "Optional PDF model (provider/model) for the PDF analysis tool. Defaults to imageModel, then session model.",
	"agents.defaults.pdfModel.fallbacks": "Ordered fallback PDF models (provider/model).",
	"agents.defaults.pdfMaxMb": "Maximum PDF file size in megabytes for the PDF tool (default: 10).",
	"agents.defaults.pdfMaxPages": "Maximum number of PDF pages to process for the PDF tool (default: 20).",
	"agents.defaults.imageMaxDimensionPx": "Max image side length in pixels when sanitizing transcript/tool-result image payloads (default: 1200).",
	"agents.defaults.imageQuality": "Image-tool media compression preference: \"auto\" adapts to provider/model limits and image count, \"efficient\" saves tokens and bytes, \"balanced\" keeps the current middle ground, and \"high\" preserves more detail for screenshots and document images.",
	"agents.defaults.compaction": "Compaction behavior for when context nears token limits, including strategy and pre-compaction memory flush behavior. Use this when long-running sessions need stable continuity under tight context windows.",
	"agents.defaults.compaction.enabled": "Enable embedded proactive auto-compaction (default: true). Set false to stop threshold-driven embedded compaction while preserving OpenClaw overflow recovery, preflight compaction, and manual /compact.",
	"agents.defaults.compaction.mode": "Compaction strategy mode: \"safeguard\" (the effective default when unset) applies guardrails to preserve recent context, while \"default\" uses baseline summarization without them. Set \"default\" only if safeguard summarization causes problems for your provider.",
	"agents.defaults.compaction.provider": "Id of a registered compaction provider plugin used for summarization. When set and the provider is registered, its summarize() method is called instead of the built-in summarizeInStages pipeline. Falls back to built-in on provider failure. Leave unset to use the default built-in summarization.",
	"agents.defaults.compaction.thinkingLevel": "Thinking level used only for embedded OpenClaw compaction summaries: \"off\", \"minimal\", \"low\", \"medium\", \"high\", \"xhigh\", \"adaptive\", \"max\", \"ultra\", or \"inherit\". Defaults to the provider compaction preference, otherwise \"low\"; native local Ollama prefers \"off\". Set \"inherit\" to reuse the session level. Explicit settings override provider defaults, and the selected level is clamped to the actual compaction model/runtime. Native Codex app-server compaction ignores this setting because its compact request has no per-operation thinking override, and OpenClaw logs a warning.",
	"agents.defaults.compaction.keepRecentTokens": "Minimum token budget preserved from the most recent conversation window during compaction. Use higher values to protect immediate context continuity and lower values to keep more long-tail history.",
	"agents.defaults.compaction.identifierPolicy": "Identifier-preservation policy for compaction summaries: \"strict\" prepends built-in opaque-identifier retention guidance (default), while \"off\" disables this prefix.",
	"agents.defaults.compaction.recentTurnsPreserve": "Number of most recent user/assistant turns kept verbatim outside safeguard summarization (default: 3). Raise this to preserve exact recent dialogue context, or lower it to maximize compaction savings.",
	"agents.defaults.compaction.qualityGuard": "Quality-audit retry settings for safeguard compaction summaries. Safeguard mode enables this by default; set enabled: false to skip summary audits and regeneration.",
	"agents.defaults.compaction.qualityGuard.enabled": "Enables summary quality audits and regeneration retries for safeguard compaction. Default: true in safeguard mode.",
	"agents.defaults.compaction.qualityGuard.maxRetries": "Maximum number of regeneration retries after a failed safeguard summary quality audit. Use small values to bound extra latency and token cost.",
	"agents.defaults.compaction.midTurnPrecheck": "Optional embedded OpenClaw tool-loop precheck that detects context pressure after a tool result is appended and before the next model call. When enabled, OpenClaw reuses existing precheck recovery to truncate tool results or compact before retrying.",
	"agents.defaults.compaction.midTurnPrecheck.enabled": "Enable structured mid-turn context pressure checks for embedded OpenClaw tool loops. Default: false. Keep disabled unless long tool-heavy sessions hit context overflow before normal turn-end compaction can run.",
	"agents.defaults.compaction.postIndexSync": "Controls post-compaction session memory reindex mode: \"off\", \"async\", or \"await\" (default: \"async\"). Use \"await\" for strongest freshness, \"async\" for lower compaction latency, and \"off\" only when session-memory sync is handled elsewhere.",
	"agents.defaults.compaction.postCompactionSections": "Opt-in AGENTS.md H2/H3 section names re-injected after compaction. Leave unset or set [] to disable reinjection. Explicitly set [\"Session Startup\", \"Red Lines\"] to enable the legacy default pair.",
	"agents.defaults.compaction.timeoutSeconds": "Safety window in seconds for each built-in compaction model request (default: 180). Multi-stage compaction refreshes the window as each serial request starts, so the complete compaction can take longer; plugin-owned compaction receives one window for the complete operation.",
	"agents.defaults.compaction.model": "Optional provider/model or configured bare alias used only for compaction summarization. Bare aliases resolve before dispatch; a configured literal model ID wins if it collides with an alias. Leave unset to keep using the primary agent model.",
	"agents.defaults.compaction.maxActiveTranscriptBytes": "Byte threshold that triggers normal preflight local compaction when the transcript window the model sees (since the latest compaction or reset) reaches this size (bytes or strings like \"20mb\"). Set to 0 or leave unset to disable. Also caps Codex app-server native rollout transcripts; oversized native threads restart fresh.",
	"agents.defaults.compaction.notifyUser": "When enabled, sends brief context-maintenance notices to the user: when compaction starts and completes (for example, '🧹 Compacting context...' and '🧹 Compaction complete'), and when a pre-compaction memory flush is exhausted so the reply continues in a degraded state (for example, '⚠️ Memory maintenance temporarily failed; continuing your reply.'). Disabled by default to keep context maintenance silent and non-intrusive.",
	"agents.defaults.compaction.memoryFlush": "Pre-compaction memory flush settings that run an agentic memory write before heavy compaction. Keep enabled for long sessions so salient context is persisted before aggressive trimming.",
	"agents.defaults.compaction.memoryFlush.enabled": "Enables pre-compaction memory flush before the runtime performs stronger history reduction near token limits. Keep enabled unless you intentionally disable memory side effects in constrained environments.",
	"agents.defaults.compaction.memoryFlush.model": "Optional provider/model override used only for pre-compaction memory flush turns. Set this to a local model such as ollama/qwen3:8b when durable memory extraction should avoid the active session's paid model. The override is exact and does not inherit the active model fallback chain.",
	"agents.defaults.compaction.memoryFlush.softThresholdTokens": "Threshold distance to compaction (in tokens) that triggers pre-compaction memory flush execution. Use earlier thresholds for safer persistence, or tighter thresholds for lower flush frequency.",
	"agents.defaults.compaction.memoryFlush.forceFlushTranscriptBytes": "Forces pre-compaction memory flush when the model-visible transcript window reaches this threshold (bytes or strings like \"2mb\"). After compaction, this includes the retained tail and subsequent turns rather than discarded history. Use this to prevent long-session hangs even when token counters are stale; set to 0 to disable.",
	"agents.defaults.embeddedAgent": "Embedded OpenClaw runner hardening controls for how workspace-local agent settings are trusted and applied in OpenClaw sessions.",
	"agents.defaults.embeddedAgent.projectSettingsPolicy": "How embedded OpenClaw handles workspace-local `.openclaw/settings.json`: \"sanitize\" (default) strips shellPath/shellCommandPrefix, \"ignore\" disables project settings entirely, and \"trusted\" applies project settings as-is.",
	"agents.defaults.embeddedAgent.executionContract": "Embedded OpenClaw execution contract: \"default\" keeps the standard runner behavior, while \"strict-agentic\" enables structured plan tracking and non-visible turn recovery for supported OpenAI/OpenAI Codex GPT-5-family runs.",
	"agents.entries.*.embeddedAgent": "Optional per-agent embedded OpenClaw overrides. Use this to opt specific agents into stricter GPT-5 execution behavior without changing the global default.",
	"agents.entries.*.embeddedAgent.executionContract": "Optional per-agent embedded OpenClaw execution contract override. Set \"strict-agentic\" to enable structured plan tracking and non-visible turn recovery for that agent on supported OpenAI/OpenAI Codex GPT-5-family runs, or \"default\" to inherit the standard runner behavior.",
	"agents.defaults.humanDelay.mode": "Delay style for block replies (\"off\", \"natural\", \"custom\").",
	"agents.defaults.humanDelay.minMs": "Minimum delay in ms for custom humanDelay (default: 800).",
	"agents.defaults.humanDelay.maxMs": "Maximum delay in ms for custom humanDelay (default: 2500).",
	"agents.defaults.typingMode": "Controls when typing starts for agents: \"never\", \"instant\", \"thinking\", or \"message\". Per-agent typingMode overrides this default.",
	"agents.defaults.typingIntervalSeconds": "Controls typing-indicator keepalive cadence in seconds for every agent. Increase it to reduce update frequency across all typing-capable channels.",
	"agents.entries.*.typingMode": "Overrides the default typing start policy for one agent without changing other agents.",
	commands: "Controls chat command surfaces, owner gating, and elevated command access behavior across providers. Keep defaults unless you need stricter operator controls or broader command availability.",
	"commands.native": "Registers native slash/menu commands with channels that support command registration (Discord, Slack, Telegram). Keep enabled for discoverability unless you intentionally run text-only command workflows.",
	"commands.nativeSkills": "Registers native skill commands so users can invoke skills directly from provider command menus where supported. Keep aligned with your skill policy so exposed commands match what operators expect.",
	"commands.text": "Enables text-command parsing in chat input in addition to native command surfaces where available. Keep this enabled for compatibility across channels that do not support native command registration.",
	"commands.bash": "Allow bash chat command (`!`; `/bash` alias) to run host shell commands (default: false; requires tools.elevated).",
	"commands.bashForegroundMs": "How long bash waits before backgrounding (default: 2000; 0 backgrounds immediately).",
	"commands.config": "Allow /config chat command to read/write config on disk (default: false).",
	"commands.mcp": "Allow /mcp chat command to manage OpenClaw MCP server config under mcp.servers (default: false).",
	"commands.plugins": "Allow /plugins chat command to list discovered plugins and toggle plugin enablement in config (default: false).",
	"commands.debug": "Allow /debug chat command for runtime-only overrides (default: false).",
	"commands.restart": "Allow /restart, /update, and external SIGUSR2 restart requests (default: true).",
	"commands.ownerAllowFrom": "Explicit owner allowlist for owner-scoped commands. Use channel-native IDs (optionally prefixed like \"whatsapp:+15551234567\"). '*' is ignored.",
	"commands.allowFrom": "Defines elevated command allow rules by channel and sender for owner-level command surfaces. Use narrow provider-specific identities so privileged commands are not exposed to broad chat audiences.",
	mcp: "Global MCP server definitions managed by OpenClaw. Embedded OpenClaw and other runtime adapters can consume these servers without storing them inside runtime-owned project settings.",
	"mcp.sessionIdleTtlMs": "Optional idle eviction for OpenClaw session MCP runtimes in milliseconds. Unset or 0 keeps runtimes alive until session cleanup or Gateway shutdown. Positive values round down; active leases and pending acquisitions prevent eviction. Run-owned runtimes still retire when their one-shot run ends.",
	"mcp.servers": "Named MCP server definitions. OpenClaw stores them in its own config and runtime adapters decide which transports are supported at execution time.",
	"mcp.servers.*.codex": "OpenClaw projection metadata for Codex app-server threads only. It does not affect ACP sessions or generic Codex harness config. Omit this block to keep the server available to every Codex app-server agent with Codex's default MCP approval behavior.",
	"mcp.servers.*.toolFilter": "Per-server MCP tool selection. Use include to expose only selected MCP tool names, or exclude to hide selected MCP tool names. Entries accept exact names and simple '*' globs.",
	"mcp.servers.*.toolFilter.include": "Exact MCP tool names or simple '*' globs to expose from this server. When omitted, all server tools remain eligible unless excluded.",
	"mcp.servers.*.toolFilter.exclude": "Exact MCP tool names or simple '*' globs to hide from this server.",
	"mcp.servers.*.oauth.identity": "OAuth credential ownership for this server. Omit this field or use \"shared\" for operator-managed credentials; use \"per-requester\" to let each authenticated sender connect their own account.",
	"mcp.servers.*.oauth.authProfileId": "Refresh-capable auth profile id used to inject the current bearer token into this remote MCP server. When set, OpenClaw resolves and refreshes the profile at runtime and does not project refresh material downstream.",
	"mcp.servers.*.codex.agents": "Optional non-empty OpenClaw agent ids that should receive this MCP server in Codex app-server thread config. Empty, blank, or invalid lists fail closed; when omitted, the server is projected for all Codex app-server agents.",
	"mcp.servers.*.codex.defaultToolsApprovalMode": "Optional Codex MCP tool approval mode for this server: \"auto\", \"prompt\", or \"approve\". Use only for MCP servers you intentionally trust.",
	"mcp.servers.*.codex.default_tools_approval_mode": "Codex-native spelling for the same per-server MCP tool approval mode. Prefer defaultToolsApprovalMode in OpenClaw config."
};
//#endregion
//#region src/config/schema.help.automation.ts
const AUTOMATION_FIELD_HELP = {
	session: "Global session routing, reset, delivery policy, and maintenance controls for conversation history behavior. Keep defaults unless you need stricter isolation, retention, or delivery constraints.",
	"session.scope": "Sets base session grouping strategy: \"per-sender\" isolates by sender and \"global\" shares one session per channel context. Keep \"per-sender\" for safer multi-user behavior unless deliberate shared context is required.",
	"session.dmScope": "DM session scoping: \"main\" keeps continuity, while \"per-peer\", \"per-channel-peer\", and \"per-account-channel-peer\" increase isolation. Use isolated modes for shared inboxes or multi-account deployments.",
	"session.groupScope": "Group/channel session scoping: \"per-group\" keeps rooms separate while the agent main session ambiently watches them, independently of dmScope; \"main\" merges room context into main and needs no watch. Use \"main\" only for trusted rooms.",
	"session.notifyOnCreate": "Queue a system notice in the owning agent's Home session when a session is created (default: true). Notices include available title and creator metadata and are read on the next Home turn or heartbeat. Set false to disable; drafts, incognito, internal sessions, and scheduled cron runs are excluded.",
	"session.identityLinks": "Maps canonical identities to provider-prefixed peer IDs so equivalent users resolve to one DM thread (example: telegram:123456). Use this when the same human appears across multiple channels or accounts.",
	"session.resetTriggers": "Lists message triggers that force a session reset when matched in inbound content. Use sparingly for explicit reset phrases so context is not dropped unexpectedly during normal conversation.",
	"session.reset": "Defines the default reset policy object used when no type-specific or channel-specific override applies. By default sessions do not reset automatically; use daily or idle schedules to opt in, while /new and /reset remain available at any time.",
	"session.reset.mode": "Selects reset strategy: \"none\" disables automatic reset (the default), \"daily\" resets at a configured hour, and \"idle\" resets after inactivity. /new and /reset remain available in every mode.",
	"session.reset.atHour": "Sets local-hour boundary (0-23) for daily reset mode so sessions roll over at predictable times. Use with mode=daily and align to operator timezone expectations for human-readable behavior.",
	"session.reset.idleMinutes": "Sets inactivity window before reset for idle mode and can also act as secondary guard with daily mode. Use larger values to preserve continuity or smaller values for fresher short-lived threads.",
	"session.resetByType": "Overrides reset behavior by chat type (direct, group, thread) when defaults are not sufficient. Use this when group/thread traffic needs different reset cadence than direct messages.",
	"session.resetByType.direct": "Defines reset policy for direct chats and supersedes the base session.reset configuration for that type. Use this as the canonical direct-message override instead of the legacy dm alias.",
	"session.resetByType.group": "Defines reset policy for group chat sessions where continuity and noise patterns differ from DMs. Use shorter idle windows for busy groups if context drift becomes a problem.",
	"session.resetByType.thread": "Defines reset policy for thread-scoped sessions, including focused channel thread workflows. Use this when thread sessions should expire faster or slower than other chat types.",
	"session.resetByChannel": "Provides channel-specific reset overrides keyed by provider/channel id for fine-grained behavior control. Use this only when one channel needs exceptional reset behavior beyond type-level policies.",
	"session.store": "Sets the session storage file path used to persist session records across restarts. Use an explicit path only when you need custom disk layout, backup routing, or mounted-volume storage.",
	"session.mainKey": "Accepted but ignored: the per-agent main session suffix is always \"main\". Omit this field; global session scope uses \"global\" instead.",
	"session.sendPolicy": "Controls cross-session send permissions using allow/deny rules evaluated against channel, chatType, and key prefixes. Use this to fence where session tools can deliver messages in complex environments.",
	"session.sendPolicy.default": "Sets fallback action when no sendPolicy rule matches: \"allow\" or \"deny\". Keep \"allow\" for simpler setups, or choose \"deny\" when you require explicit allow rules for every destination.",
	"session.sendPolicy.rules": "Ordered allow/deny rules evaluated before the default action, for example `{ action: \"deny\", match: { channel: \"discord\" } }`. Put most specific rules first so broad rules do not shadow exceptions.",
	"session.sendPolicy.rules[].action": "Defines rule decision as \"allow\" or \"deny\" when the corresponding match criteria are satisfied. Use deny-first ordering when enforcing strict boundaries with explicit allow exceptions.",
	"session.sendPolicy.rules[].match": "Defines optional rule match conditions that can combine channel, chatType, and key-prefix constraints. Keep matches narrow so policy intent stays readable and debugging remains straightforward.",
	"session.sendPolicy.rules[].match.channel": "Matches rule application to a specific channel/provider id (for example discord, telegram, slack). Use this when one channel should permit or deny delivery independently of others.",
	"session.sendPolicy.rules[].match.chatType": "Matches rule application to chat type (direct, group, thread) so behavior varies by conversation form. Use this when DM and group destinations require different safety boundaries.",
	"session.sendPolicy.rules[].match.keyPrefix": "Matches a normalized session-key prefix after internal key normalization steps in policy consumers. Use this for general prefix controls, and prefer rawKeyPrefix when exact full-key matching is required.",
	"session.sendPolicy.rules[].match.rawKeyPrefix": "Matches the raw, unnormalized session-key prefix for exact full-key policy targeting. Use this when normalized keyPrefix is too broad and you need agent-prefixed or transport-specific precision.",
	"session.threadBindings": "Shared defaults for thread-bound session spawning and routing across supported channels. Configure global defaults here and override per channel only when behavior differs.",
	"session.threadBindings.enabled": "Global master switch for thread-bound session spawning, routing, and delivery. Disable to turn off thread binding globally.",
	"session.threadBindings.idleHours": "Default inactivity window in hours for thread-bound sessions across providers/channels (0 disables idle expiry). Default: 24.",
	"session.threadBindings.maxAgeHours": "Optional hard max age in hours for thread-bound sessions across providers/channels (0 disables hard cap). Default: 0.",
	"session.threadBindings.spawnSessions": "Global default gate for creating thread-bound work sessions from sessions_spawn and ACP thread spawns. Default: true when thread bindings are enabled.",
	"session.threadBindings.defaultSpawnContext": "Default native subagent context for thread-bound spawns. Use \"fork\" to start from the requester transcript or \"isolated\" for a clean child. Default: \"fork\".",
	"session.sharing": "Controls which collaboration modes session owners and administrators may select. Omitted booleans default to enabled; set a mode false to remove it from the picker and reject new selections.",
	"session.sharing.readOnly": "Allows sessions to be made read-only for non-participants. Default: true.",
	"session.sharing.suggest": "Allows suggest visibility. In this phase it enforces the same admission policy as read-only; suggestion queues are configured by a later feature. Default: true.",
	"session.sharing.drafts": "Allows draft visibility, which hides sessions from non-owner, non-admin operators. Default: true.",
	"session.maintenance": "Automatic session-store maintenance controls for dashboard archiving, pruning age, entry caps, reset archive retention, and disk budget cleanup. Start in warn mode to observe impact, then enforce once thresholds are tuned.",
	"session.maintenance.mode": "Determines whether pruning and disk-budget policies are only reported (\"warn\") or actively applied (\"enforce\"). Keep \"warn\" during rollout and switch to \"enforce\" after validating safe thresholds. Cold storage has its own explicit enabled setting.",
	"session.maintenance.coldStorage": "Moves inactive transcripts into compressed JSONL archives while retaining session metadata. Archive files become required history and must be included in backups. Changes apply without restarting the Gateway.",
	"session.maintenance.coldStorage.enabled": "Enables background transcript archival (default false). A worker checks for eligible transcripts every minute. This explicit archive policy is separate from deletion and disk-budget cleanup.",
	"session.maintenance.coldStorage.afterDays": "Archive transcripts after this many inactive days (positive integer, default 30). Active work is protected; changing the cutoff takes effect on the next worker pass without a Gateway restart.",
	"session.maintenance.pruneAfter": "Archives eligible durable conversations and removes disposable automation entries older than this duration (default `30d`; for example `12h`). Archived conversations retain their history and can be restored; protected or routable conversations remain active.",
	"session.maintenance.archiveDashboardAfter": "Archives inactive dashboard sessions after this duration (for example `7d`) so they remain available without crowding the active session list. Set `false` or `0` to disable automatic dashboard archiving.",
	"session.maintenance.maxEntries": "Caps unarchived session entries (default 5000). Eligible durable overflow conversations are archived with their history; disposable automation entries are removed. Existing archives do not consume the cap. Protected active entries still count and can keep the store above the limit.",
	"session.maintenance.preserveRecent": "Protects interactive sessions active within this duration (for example `7d`) from automatic age, count, and disk-budget history eviction. Unset or `false` keeps the normal oldest-first policy. Synthetic model-run, cron, hook, heartbeat, ACP, and sub-agent rows remain eligible for bounded cleanup.",
	"session.maintenance.resetArchiveRetention": "Age-based retention for archived transcripts (`*.reset.<timestamp>` and `*.deleted.<timestamp>`). Defaults to keeping archives until the disk budget evicts them oldest-first; set a duration (for example `30d`) to opt into wall-clock deletion, or `false` to disable it explicitly.",
	"session.maintenance.maxDiskBytes": "Per-agent physical disk budget covering SQLite main/WAL and counted session-directory artifacts (for example `500mb`). Defaults to `10gb`; protected data can keep usage above the target. When exceeded, warn mode reports pressure and enforce mode removes old reset/delete artifacts, unreferenced history, then cap-created archives. Manual, age-retention, dashboard, recovery, and legacy archives remain protected. Set `false`, `0`, or `\"0\"` to disable.",
	"session.maintenance.highWaterBytes": "Target size after disk-budget cleanup (high-water mark). Defaults to 80% of maxDiskBytes; set explicitly for tighter reclaim behavior on constrained disks. A value that resolves to zero falls back to the default; negative values are invalid. Disable the budget with maxDiskBytes instead.",
	cron: "Global scheduler settings for stored automations, run concurrency, delivery fallback, and run-session retention. Keep defaults unless you are scaling automation volume or integrating external webhook receivers.",
	"cron.enabled": "Enables automation execution for stored schedules managed by the gateway. Keep enabled for normal reminder/automation flows, and disable only to pause all automation execution without deleting jobs.",
	"cron.skipMissedJobs": "Skips missed recurring cron/every slots at Gateway startup and schedules their next future occurrence instead of catching up. Default: false. Enable to avoid stale reminders after downtime; one-shot at jobs still catch up.",
	"cron.webhookToken": "Bearer token attached to automation webhook POST deliveries when webhook mode is used. Prefer secret/env substitution and rotate this token regularly if shared webhook endpoints are internet-reachable.",
	"cron.webhookSsrfPolicy": "SSRF policy applied to every outbound automation webhook. Private, loopback, link-local, and internal targets stay blocked unless this policy explicitly allows them. Keep unset for strict delivery.",
	"cron.webhookSsrfPolicy.dangerouslyAllowPrivateNetwork": "Allows automation webhooks to private and internal network targets. Keep disabled unless every configured webhook destination is trusted.",
	"cron.webhookSsrfPolicy.allowedHostnames": "Exact hostnames or IP literals allowed for automation webhook delivery, including otherwise blocked targets. Keep the list minimal.",
	"cron.webhookSsrfPolicy.blockedHostnames": "Hostname patterns denied before DNS and allow rules for automation webhook delivery. Supports exact hosts and \"*.example.com\" for subdomains only; add \"example.com\" separately to block the apex. Empty or unset adds no denials.",
	"cron.webhookSsrfPolicy.allowRfc2544BenchmarkRange": "Allows automation webhooks to RFC 2544 benchmark-range IPs (198.18.0.0/15). Use only with trusted fake-IP proxy environments.",
	"cron.webhookSsrfPolicy.allowIpv6UniqueLocalRange": "Allows automation webhooks to IPv6 Unique Local Addresses (fc00::/7). Use only with trusted fake-IP proxy environments.",
	"cron.sessionRetention": "Controls how long completed automation run sessions are kept before pruning (`24h`, `7d`, `1h30m`, or `false` to disable pruning; a zero duration such as `0h` also disables; default: `24h`). Use shorter retention to reduce storage growth on high-frequency schedules.",
	transcripts: "Core transcript capture settings for meeting notes, recording-capable agent tools, and configured live meeting auto-start sources. Meeting plugins capture durable notes by default; set enabled to false to opt out globally.",
	"transcripts.enabled": "Enables durable automatic meeting notes, the transcripts agent tool, and configured auto-start sources. Default: true. Set false to disable persistence and the tool; explicit meeting transcribe mode retains its bounded live tail.",
	"transcripts.autoStart": "Live transcript sources managed automatically from gateway startup. Each entry is enabled by being present; remove an entry to disable that source. Sources capture continuously unless whenOccupied is enabled.",
	"transcripts.autoStart[].providerId": "Transcript source provider id, such as a Discord voice or future Slack huddle provider. Use the exact id exposed by the provider plugin.",
	"transcripts.autoStart[].sessionId": "Optional fixed transcript session id for this auto-start source. Ignored when whenOccupied is true. Leave unset for generated ids unless you need a stable daily selector and can avoid same-day collisions.",
	"transcripts.autoStart[].whenOccupied": "Start a fresh transcript session each time humans are present in the source and stop it (generating notes) after the last human leaves. Requires a provider that reports occupancy, such as discord-voice. Default: false (capture continuously from gateway start).",
	"transcripts.autoStart[].title": "Optional title for future transcript captures. Changing only titles keeps current captures running and does not rename their admitted title or saved notes. Other source changes retain their normal restart handling.",
	"transcripts.autoStart[].accountId": "Optional provider account or workspace identifier for transcript sources that need account disambiguation. Use the provider's documented account id format.",
	"transcripts.autoStart[].guildId": "Optional Discord guild id for Discord voice transcript sources. Configure this with the matching channelId when the provider needs guild-scoped voice channel lookup.",
	"transcripts.autoStart[].channelId": "Provider channel id for the live transcript source, such as a Discord voice channel or Slack huddle channel. Verify provider-specific id semantics before enabling auto-start.",
	"transcripts.autoStart[].meetingUrl": "Optional meeting URL for providers that join by URL instead of channel id. Use only trusted meeting links because auto-start may join and capture that meeting.",
	hooks: "Inbound webhook automation surface for mapping external events into wake or agent actions in OpenClaw. Keep this locked down with explicit token/session/agent controls before exposing it beyond trusted networks.",
	"hooks.enabled": "Enables the hooks endpoint and mapping execution pipeline for inbound webhook requests. Keep disabled unless you are actively routing external events into the gateway.",
	"hooks.path": "HTTP path used by the hooks endpoint (for example `/hooks`) on the gateway control server. Use a non-guessable path and combine it with token validation for defense in depth.",
	"hooks.token": "Shared bearer token checked by hooks ingress for request authentication before mappings run. Treat holders as full-trust callers for the hook ingress surface, not as a separate non-owner role. Use environment substitution and rotate regularly when webhook endpoints are internet-accessible.",
	"hooks.defaultSessionKey": "Fallback session key used for hook deliveries when a request does not provide one through allowed channels. Use a stable but scoped key to avoid mixing unrelated automation conversations.",
	"hooks.allowRequestSessionKey": "Allows callers to supply a session key in hook requests when true, enabling caller-controlled routing. Keep false unless trusted integrators explicitly need custom session threading.",
	"hooks.allowedSessionKeyPrefixes": "Allowlist of accepted session-key prefixes for inbound hook requests when caller-provided keys are enabled. Use narrow prefixes to prevent arbitrary session-key injection.",
	"hooks.allowedAgentIds": "Allowlist of effective agent IDs that hook requests and mappings are allowed to target, including default-agent routing when agentId is omitted. Use this to constrain automation events to dedicated service agents and reduce blast radius if a hook token is exposed.",
	"hooks.presets": "Named hook preset bundles applied at load time to seed standard mappings and behavior defaults. Keep preset usage explicit so operators can audit which automations are active.",
	"hooks.transformsDir": "Base directory for hook transform modules referenced by mapping transform.module paths. Use a controlled repo directory so dynamic imports remain reviewable and predictable.",
	"hooks.mappings": "Ordered mapping rules that match inbound hook requests and choose wake or agent actions with optional delivery routing. Use specific mappings first to avoid broad pattern rules capturing everything.",
	"hooks.mappings[].id": "Optional stable identifier for a hook mapping entry used for auditing, troubleshooting, and targeted updates. Use unique IDs so logs and config diffs can reference mappings unambiguously.",
	"hooks.mappings[].match": "Grouping object for mapping match predicates such as path and source before action routing is applied. Keep match criteria specific so unrelated webhook traffic does not trigger automations.",
	"hooks.mappings[].match.path": "Path match condition for a hook mapping, usually compared against the inbound request path. Use this to split automation behavior by webhook endpoint path families.",
	"hooks.mappings[].match.source": "Source match condition for a hook mapping, typically set by trusted upstream metadata or adapter logic. Use stable source identifiers so routing remains deterministic across retries.",
	"hooks.mappings[].action": "Mapping action type: \"wake\" triggers agent wake flow, while \"agent\" sends directly to agent handling. Use \"agent\" for immediate execution and \"wake\" when heartbeat-driven processing is preferred.",
	"hooks.mappings[].wakeMode": "Wake scheduling mode: \"now\" wakes immediately, while \"next-heartbeat\" defers until the next heartbeat cycle. Use deferred mode for lower-priority automations that can tolerate slight delay.",
	"hooks.mappings[].name": "Human-readable mapping display name used in diagnostics and operator-facing config UIs. Keep names concise and descriptive so routing intent is obvious during incident review.",
	"hooks.mappings[].agentId": "Target agent ID for mapping execution when action routing should not use defaults. Use dedicated automation agents to isolate webhook behavior from interactive operator sessions.",
	"hooks.mappings[].sessionKey": "Explicit session key override for mapping-delivered messages to control thread continuity. Use stable scoped keys so repeated events correlate without leaking into unrelated conversations.",
	"hooks.mappings[].sessionMode": "Controls mapping session continuity: \"isolated\" starts a fresh run session, while \"persistent\" reuses the resolved sessionKey. Keep isolated unless the integration intentionally needs durable context.",
	"hooks.mappings[].messageTemplate": "Template for synthesizing structured mapping input into the final message content sent to the target action path. Keep templates deterministic so downstream parsing and behavior remain stable.",
	"hooks.mappings[].textTemplate": "Text-only fallback template used when rich payload rendering is not desired or not supported. Use this to provide a concise, consistent summary string for chat delivery surfaces.",
	"hooks.mappings[].forEach": "Top-level payload array key the mapping fans out over: each element dispatches its own action, and templates or transforms see a payload whose array holds only the current element. The Gmail preset uses forEach: messages so batched pushes dispatch one run per email.",
	"hooks.mappings[].deliver": "Controls whether mapping execution results are delivered back to a channel destination versus being processed silently. Disable delivery for background automations that should not post user-facing output.",
	"hooks.mappings[].allowUnsafeExternalContent": "When true, mapping content may include less-sanitized external payload data in generated messages. Keep false by default and enable only for trusted sources with reviewed transform logic.",
	"hooks.mappings[].channel": "Delivery channel override for mapping outputs (for example \"last\", \"telegram\", \"discord\", \"slack\", \"signal\", \"imessage\", or \"msteams\"). Keep channel overrides explicit to avoid accidental cross-channel sends.",
	"hooks.mappings[].to": "Destination identifier inside the selected channel when mapping replies should route to a fixed target. Verify provider-specific destination formats before enabling production mappings.",
	"hooks.mappings[].model": "Optional model override for mapping-triggered runs when automation should use a different model than agent defaults. Use this sparingly so behavior remains predictable across mapping executions.",
	"hooks.mappings[].thinking": "Optional thinking-effort override for mapping-triggered runs to tune latency versus reasoning depth. Keep low or minimal for high-volume hooks unless deeper reasoning is clearly required.",
	"hooks.mappings[].timeoutSeconds": "Maximum runtime allowed for mapping action execution before timeout handling applies. Use tighter limits for high-volume webhook sources to prevent queue pileups.",
	"hooks.mappings[].transform": "Transform configuration block defining module/export preprocessing before mapping action handling. Use transforms only from reviewed code paths and keep behavior deterministic for repeatable automation.",
	"hooks.mappings[].transform.module": "Relative transform module path loaded from hooks.transformsDir to rewrite incoming payloads before delivery. Keep modules local, reviewed, and free of path traversal patterns.",
	"hooks.mappings[].transform.export": "Named export to invoke from the transform module; defaults to module default export when omitted. Set this when one file hosts multiple transform handlers.",
	"hooks.gmail": "Gmail push integration settings used for Pub/Sub notifications and optional local callback serving. Keep this scoped to dedicated Gmail automation accounts where possible.",
	"hooks.gmail.account": "Google account identifier used for Gmail watch/subscription operations in this hook integration. Use a dedicated automation mailbox account to isolate operational permissions.",
	"hooks.gmail.label": "Optional Gmail label filter limiting which labeled messages trigger hook events. Keep filters narrow to avoid flooding automations with unrelated inbox traffic.",
	"hooks.gmail.topic": "Google Pub/Sub topic name used by Gmail watch to publish change notifications for this account. Ensure the topic IAM grants Gmail publish access before enabling watches.",
	"hooks.gmail.subscription": "Pub/Sub subscription consumed by the gateway to receive Gmail change notifications from the configured topic. Keep subscription ownership clear so multiple consumers do not race unexpectedly.",
	"hooks.gmail.hookUrl": "Public callback URL Gmail or intermediaries invoke to deliver notifications into this hook pipeline. Keep this URL protected with token validation and restricted network exposure.",
	"hooks.gmail.includeBody": "When true, fetch and include email body content for downstream mapping/agent processing. Keep false unless body text is required, because this increases payload size and sensitivity.",
	"hooks.gmail.allowUnsafeExternalContent": "Allows less-sanitized external Gmail content to pass into processing when enabled. Keep disabled for safer defaults, and enable only for trusted mail streams with controlled transforms.",
	"hooks.gmail.serve": "Local callback server settings block for directly receiving Gmail notifications without a separate ingress layer. Enable only when this process should terminate webhook traffic itself.",
	"hooks.gmail.pushToken": "Shared secret token required on Gmail push hook callbacks before processing notifications. Use env substitution and rotate if callback endpoints are exposed externally.",
	"hooks.gmail.maxBytes": "Maximum Gmail payload bytes processed per event when includeBody is enabled. Keep conservative limits to reduce oversized message processing cost and risk.",
	"hooks.gmail.renewEveryMinutes": "Renewal cadence in minutes for Gmail watch subscriptions to prevent expiration. Set below provider expiration windows and monitor renew failures in logs.",
	"hooks.gmail.serve.bind": "Bind address for the local Gmail callback HTTP server used when serving hooks directly. Keep loopback-only unless external ingress is intentionally required.",
	"hooks.gmail.serve.port": "Port for the local Gmail callback HTTP server when serve mode is enabled. Use a dedicated port to avoid collisions with gateway/control interfaces.",
	"hooks.gmail.serve.path": "HTTP path on the local Gmail callback server where push notifications are accepted. Keep this consistent with subscription configuration to avoid dropped events.",
	"hooks.gmail.tailscale.mode": "Tailscale exposure mode for Gmail callbacks: \"off\", \"serve\", or \"funnel\". Use \"serve\" for private tailnet delivery and \"funnel\" only when public internet ingress is required.",
	"hooks.gmail.tailscale": "Tailscale exposure configuration block for publishing Gmail callbacks through Serve/Funnel routes. Use private tailnet modes before enabling any public ingress path.",
	"hooks.gmail.tailscale.path": "Path published by Tailscale Serve/Funnel for Gmail callback forwarding when enabled. Keep it aligned with Gmail webhook config so requests reach the expected handler.",
	"hooks.gmail.tailscale.target": "Local service target forwarded by Tailscale Serve/Funnel (for example http://127.0.0.1:8787). Use explicit loopback targets to avoid ambiguous routing.",
	"hooks.gmail.model": "Optional model override for Gmail-triggered runs when mailbox automations should use dedicated model behavior. Keep unset to inherit agent defaults unless mailbox tasks need specialization.",
	"hooks.gmail.thinking": "Thinking effort override for Gmail-driven agent runs: \"off\", \"minimal\", \"low\", \"medium\", or \"high\". Keep modest defaults for routine inbox automations to control cost and latency.",
	"hooks.internal": "Internal hook runtime settings for bundled/custom event handlers loaded from module paths. Use this for trusted in-process automations and keep handler loading tightly scoped.",
	"hooks.internal.enabled": "Enables processing for internal hooks and configured entries in the internal hook runtime. Keep disabled unless internal hooks are intentionally configured.",
	"hooks.internal.entries": "Configured internal hook entry records used to register concrete runtime handlers and metadata. Keep entries explicit and versioned so production behavior is auditable.",
	"hooks.internal.load": "Internal hook loader settings controlling where handler modules are discovered at startup. Use constrained load roots to reduce accidental module conflicts or shadowing.",
	"hooks.internal.load.extraDirs": "Additional directories searched for internal hook modules beyond default load paths. Keep this minimal and controlled to reduce accidental module shadowing.",
	messages: "Message infrastructure and cross-agent defaults. Root siblings own infrastructure and cross-agent defaults; agents.defaults owns agent-loop behavior; agent entries may override either where supported.",
	"messages.visibleReplies": "Controls model-authored source replies across direct, group, and channel conversations. \"message_tool\" requires message(action=send) for normal assistant output and generic tool media; explicitly host-owned runtime output remains deliverable except for ambient room events. \"automatic\" posts normal replies as before.",
	"messages.usageTemplate": "Custom /usage full footer template, either an inline object or a JSON file path. Invalid or unavailable templates fall back to the built-in usage line.",
	"messages.responseUsage": "Default per-reply usage footer mode (\"off\"|\"tokens\"|\"full\") seeded into sessions that have not chosen one via /usage. Also accepts \"on\" as a legacy alias for \"tokens\". Accepts a bare mode or a per-channel map with a \"default\" fallback. Precedence: session value -> channel entry -> default -> off; an explicit /usage choice (including off) is persisted and overrides the default. Use /usage reset (aliases: inherit, clear, default) to clear a session override and re-inherit this configured default.",
	"messages.groupChat": "Group-message handling controls including mention triggers and history window sizing. Keep mention patterns narrow so group channels do not trigger on every message.",
	"messages.groupChat.mentionPatterns": "Safe case-insensitive regex patterns used to detect explicit mentions/trigger phrases in group chats. Use precise patterns to reduce false positives in high-volume channels; invalid or unsafe nested-repetition patterns are ignored.",
	"messages.groupChat.historyLimit": "Maximum number of prior group messages loaded as context per turn for group sessions. Use higher values for richer continuity, or lower values for faster and cheaper responses. Automatic prompt history is capped at 200 messages. The JSON integer maximum selects the channel default window (50 for shared group history), not an unlimited window.",
	"messages.groupChat.unmentionedInbound": "Controls how unmentioned always-on group chatter is submitted. \"user_request\" treats it as a user request; \"room_event\" submits it as quiet context where visible output requires the message tool.",
	"messages.groupChat.visibleReplies": "Overrides model-authored source replies for group/channel conversations. Defaults to \"automatic\" when no global visible reply policy is set. \"message_tool\" requires message(action=send) for normal assistant output and generic tool media; explicitly host-owned runtime output remains deliverable except for ambient room events. \"automatic\" posts normal replies as before.",
	"messages.queue": "Queue strategy for inbound messages that arrive while a session run is active. Use this to tune steering, deferred followups, batching, or interruption.",
	"messages.queue.mode": "Queue mode for active runs. Use \"steer\" to inject prompts into the active run, \"followup\" to run later, \"collect\" to batch compatible messages later, or \"interrupt\" to abort the active run before starting the newest prompt.",
	"messages.queue.byChannel": "Per-channel queue mode overrides keyed by provider id (for example telegram, discord, slack). Use this when one channel's traffic pattern needs different behavior than global defaults.",
	"messages.queue.debounceMsByChannel": "Per-channel debounce overrides for queue behavior keyed by provider id. Use this to tune burst handling independently for chat surfaces with different pacing.",
	"messages.queue.cap": "Maximum number of queued inbound items retained before drop policy applies. Default is 20; keep caps bounded in noisy channels so memory usage remains predictable.",
	"messages.queue.drop": "Drop strategy when queue cap is exceeded. \"summarize\" drops oldest entries but preserves compact summaries; \"old\" drops oldest without summaries; \"new\" rejects the newest item. Use \"summarize\" for long-running chats where context matters.",
	"messages.inbound": "Direct inbound debounce settings used before queue/turn processing starts. Configure this for provider-specific rapid message bursts from the same sender.",
	"messages.inbound.byChannel": "Per-channel inbound debounce overrides keyed by provider id in milliseconds. Use this where some providers send message fragments more aggressively than others.",
	tts: "Text-to-speech policy for reading agent replies aloud on supported voice or audio surfaces. Keep disabled unless voice playback is part of your operator/user workflow.",
	"tts.persona": "Default TTS persona id. Local TTS persona preferences can override this per host.",
	"tts.personas": "Named TTS personas that define stable spoken identity plus provider-specific speech bindings.",
	"tts.personas.*": "One TTS persona. Use provider-specific bindings for exact voices/models and prompt templates.",
	"tts.personas.*.providers": "Provider-specific TTS persona bindings keyed by speech provider id. These merge over tts.providers for the active persona.",
	"tts.providers": "Provider-specific TTS settings keyed by speech provider id. Use this instead of bundled provider-specific top-level keys so speech plugins stay decoupled from core config schema.",
	"tts.providers.*": "Provider-specific TTS configuration for one speech provider id. Keep fields scoped to the plugin that owns that provider.",
	"tts.providers.*.apiKey": "Provider API key used by that speech provider when its plugin requires authenticated TTS access.",
	channels: "Channel provider configurations plus shared defaults that control access policies, heartbeat visibility, and per-surface behavior. Keep defaults centralized and override per provider only where required.",
	"channels.mattermost": "Mattermost channel provider configuration for bot credentials, base URL, and message trigger modes. Keep mention/trigger rules strict in high-volume team channels.",
	"channels.defaults": "Default channel behavior applied across providers when provider-specific settings are not set. Use this to enforce consistent baseline policy before per-provider tuning.",
	"channels.defaults.groupPolicy": "Default group policy across channels: \"open\", \"disabled\", or \"allowlist\". Keep \"allowlist\" for safer production setups unless broad group participation is intentional.",
	"channels.defaults.contextVisibility": "Default supplemental context visibility for fetched quote/thread/history content: \"all\" (keep all context), \"allowlist\" (only allowlisted senders), or \"allowlist_quote\" (allowlist + keep explicit quotes).",
	"channels.defaults.implicitMentions": "Default policy for whether reply-to-bot, quoted-bot, and bot-participated-thread facts activate supporting message channels without an explicit mention.",
	"channels.defaults.implicitMentions.replyToBot": "Treat replies to the bot's own messages as implicit mentions by default. Defaults to true for backward compatibility.",
	"channels.defaults.implicitMentions.quotedBot": "Treat quoted bot messages as implicit mentions by default. Defaults to true for backward compatibility.",
	"channels.defaults.implicitMentions.threadParticipation": "Treat follow-ups in threads where the bot participated as implicit mentions by default. Defaults to true for backward compatibility.",
	"channels.defaults.heartbeatVisibility": "Default heartbeat visibility settings for status messages emitted by providers/channels. Tune this globally to reduce noisy healthy-state updates while keeping alerts visible.",
	"channels.defaults.heartbeatVisibility.showOk": "Shows healthy/OK heartbeat status entries when true in channel status outputs. Keep false in noisy environments and enable only when operators need explicit healthy confirmations.",
	"channels.defaults.heartbeatVisibility.showAlerts": "Shows degraded/error heartbeat alerts when true so operator channels surface problems promptly. Keep enabled in production so broken channel states are visible.",
	"channels.defaults.heartbeatVisibility.useIndicator": "Enables concise indicator-style heartbeat rendering instead of verbose status text where supported. Use indicator mode for dense dashboards with many active channels.",
	"channels.defaults.botLoopProtection": "Default pair loop protection settings for channel providers that support bot-to-bot loop guards. Use provider-specific overrides only when one channel needs a different budget.",
	"channels.defaults.botLoopProtection.enabled": "Enables pair loop protection by default for supporting channels when bot-authored messages can reach dispatch. Providers may still disable the guard when bots are ignored.",
	"channels.defaults.botLoopProtection.maxEventsPerWindow": "Maximum events a sender/receiver pair may exchange within the configured window before suppression starts. Default for supporting channels is 20.",
	"channels.defaults.botLoopProtection.windowSeconds": "Sliding window length in seconds for pair loop budgets. Default for supporting channels is 60.",
	"channels.defaults.botLoopProtection.cooldownSeconds": "Cooldown seconds applied to a pair after it exceeds the loop budget. Default for supporting channels is 60.",
	"agents.defaults.heartbeat.directPolicy": "Controls whether heartbeat delivery may target direct/DM chats: \"allow\" (default) permits DM delivery and \"block\" suppresses direct-target sends.",
	"agents.entries.*.heartbeat.directPolicy": "Per-agent override for heartbeat direct/DM delivery policy; use \"block\" for agents that should only send heartbeat alerts to non-DM destinations.",
	"channels.mattermost.configWrites": "Allow Mattermost to write config in response to channel events/commands (default: true).",
	"channels.modelByChannel": "Map provider -> channel id / DM peer id -> model override (values are provider/model or aliases).",
	"messages.ackReaction": "Emoji reaction used to acknowledge inbound messages (empty disables).",
	"messages.ackReactionScope": "When to send ack reactions (\"group-mentions\", \"group-all\", \"direct\", \"all\", \"off\", \"none\"). \"group-mentions\" acks group messages that mention the agent, whether or not the group requires mentions; \"group-all\" acks every group message. \"off\"/\"none\" disables ack reactions entirely.",
	"messages.statusReactions": "Lifecycle status reactions that update the emoji on the trigger message as the agent progresses (queued → thinking → tool → done/error).",
	"messages.statusReactions.enabled": "Enable lifecycle status reactions on supported channels. Discord treats unset as enabled when ack reactions are active; Slack, Signal, Telegram, and WhatsApp require this to be true before lifecycle reactions are used. Slack uses native assistant thread status for progress by default.",
	"messages.inbound.debounceMs": "Quiet window (ms) for batching rapid inbound messages from the same sender. Telegram defaults to 300ms when neither a global nor channel override is set; other channels default to 0. Zero disables ordinary burst batching, but Telegram still reassembles near-limit long-message chunks."
};
//#endregion
//#region src/config/schema.meta.ts
const META_FIELD_HELP = {
	meta: "Backward-readable compatibility metadata retained so older binaries can refuse unsafe config downgrades.",
	"meta.lastTouchedVersion": "OpenClaw version that most recently wrote this config.",
	"meta.migrations": "Bounded compatibility markers for completed config migrations.",
	"meta.migrations.modelPolicyAllowlist": "Records that legacy model-map restrictions were preserved or evaluated.",
	"meta.migrations.utilityModelSeparation": "Records that legacy implicit primary models were preserved before separating utility model selection."
};
const META_FIELD_LABELS = {
	meta: "Compatibility Metadata",
	"meta.lastTouchedVersion": "Config Last Touched Version",
	"meta.migrations": "Config Migration Markers",
	"meta.migrations.modelPolicyAllowlist": "Model Policy Allowlist Migration",
	"meta.migrations.utilityModelSeparation": "Utility Model Separation Migration"
};
//#endregion
//#region src/config/talk-defaults.ts
/** Platform-specific silence windows for talk/voice turn segmentation. */
const TALK_SILENCE_TIMEOUT_MS_BY_PLATFORM = {
	macos: 700,
	android: 700,
	ios: 900
};
/** Formats the talk silence defaults for config help text. */
function describeTalkSilenceTimeoutDefaults() {
	return `${TALK_SILENCE_TIMEOUT_MS_BY_PLATFORM.macos} ms on macOS and Android, ${TALK_SILENCE_TIMEOUT_MS_BY_PLATFORM.ios} ms on iOS`;
}
//#endregion
//#region src/config/schema.help.core.ts
const CORE_FIELD_HELP = {
	worktreeRoot: "Global directory for new managed worktrees. Use an absolute path or ~ for your home directory; defaults to <state-dir>/worktrees. Existing worktrees keep their recorded paths when this changes.",
	worktreeAcceleration: "Use filesystem acceleration for new managed worktrees when supported (default: true). Set false to use normal Git checkout and file copying. Applies only to new worktrees.",
	"channels.discord.activities": "Discord Activities configuration for presenting core show_widget documents inside Discord. Leave unset to keep Activity routes, presentation, and handlers disabled.",
	"channels.discord.activities.clientSecret": "OAuth2 client secret for the Discord application that hosts Activities. Keep this value secret; DISCORD_CLIENT_SECRET is used when this field is unset.",
	"channels.discord.activities.applicationId": "Optional Discord application ID for Activities. Defaults to the bot application ID learned from Discord at gateway startup.",
	...META_FIELD_HELP,
	env: "Environment import and override settings used to supply runtime variables to the gateway process. Use this section to control shell-env loading and explicit variable injection behavior.",
	"env.shellEnv": "Shell environment import controls for loading variables from your login shell during startup. Keep this enabled when you depend on profile-defined secrets or PATH customizations.",
	"env.shellEnv.enabled": "Enables loading environment variables from the user shell profile during startup initialization. Keep enabled for developer machines, or disable in locked-down service environments with explicit env management.",
	"env.shellEnv.timeoutMs": "Maximum time in milliseconds allowed for shell environment resolution before fallback behavior applies. Use tighter timeouts for faster startup, or increase when shell initialization is heavy.",
	"env.vars": "Explicit key/value environment variable overrides merged into runtime process environment for OpenClaw. Use this for deterministic env configuration instead of relying only on shell profile side effects.",
	secrets: "Secret reference providers, shared-store behavior, and optional subprocess egress protection.",
	"secrets.egressProxy": "Gateway-owned loopback proxy that replaces shared-store secret sentinels only at outbound request time. Restart the Gateway after changing this startup-scoped section.",
	"secrets.egressProxy.enabled": "Enables secret egress substitution for Gateway-hosted agent subprocesses. Default: false.",
	"secrets.egressProxy.allowedHosts": "Opt-in traffic allowlist for requests and CONNECT tunnels. When present, destinations must appear in this list, a per-secret host binding, or bypassHosts. An empty list permits only bound or bypassed hosts. Restart the Gateway after changing it.",
	"secrets.egressProxy.bypassHosts": "Exact hostnames that use authenticated blind CONNECT tunnels for certificate-pinned clients. Sentinels remain ciphertext and will fail vendor authentication instead of exposing plaintext.",
	wizard: "User-owned setup preferences. Machine-owned wizard history and acknowledgement state live in the shared state database.",
	"wizard.accessMode": "Discovery consent for guided setup: \"full\" scans silently while \"guarded\" asks before inspecting local applications.",
	"wizard.appRecommendations": "Controls whether guided setup may use installed-application labels to recommend relevant plugins and skills.",
	"wizard.lastRunAt": "Timestamp of the last successfully committed wizard run.",
	"wizard.lastRunVersion": "OpenClaw version used by the last wizard run.",
	"wizard.lastRunCommit": "Source commit used by the last development wizard run.",
	"wizard.lastRunCommand": "Command that invoked the last wizard run.",
	"wizard.lastRunMode": "Whether the last wizard run targeted \"local\" or \"remote\" setup.",
	"wizard.securityAcknowledgedAt": "Timestamp of the setup security acknowledgement, committed with the target config.",
	"logging.audit": "Bounded metadata-only audit history for operator review. Run and tool records are enabled by default; message lifecycle metadata is a separate privacy-sensitive opt-in. The background writer is best-effort rather than a lossless compliance archive.",
	"logging.audit.enabled": "Records new run, tool, and enabled message audit events. Default: true. Changes apply immediately; accepted writes finish and retained rows remain queryable until they expire.",
	"logging.audit.executionIdentity": "Retains bounded execution-identity attribution for exact-run inspection. Default: false. Requires logging.audit.enabled and applies to newly admitted runs; existing contexts remain unchanged.",
	"logging.audit.messages": "Controls content-free message lifecycle records: \"off\" (default), \"direct\" for known direct conversations only, or \"all\" for direct, group, channel, and unknown conversation kinds. Requires logging.audit.enabled. Changes apply to subsequent lifecycle events.",
	diagnostics: "Diagnostics controls for targeted tracing, telemetry export, and cache inspection during debugging. Keep baseline diagnostics minimal in production and enable deeper signals only when investigating issues.",
	"diagnostics.otel": "OpenTelemetry export settings for traces, metrics, and logs emitted by gateway components. Use this when integrating with centralized observability backends and distributed tracing pipelines.",
	"diagnostics.cacheTrace": "Cache-trace logging settings for observing cache decisions and payload context in embedded runs. Enable this temporarily for debugging and disable afterward to reduce sensitive log footprint.",
	logging: "Logging behavior controls for severity, output destinations, formatting, and sensitive-data redaction. Keep levels and redaction strict enough for production while preserving useful diagnostics.",
	"logging.level": "Primary log level threshold for runtime logger output: \"silent\", \"fatal\", \"error\", \"warn\", \"info\", \"debug\", or \"trace\". Keep \"info\" or \"warn\" for production, and use debug/trace only during investigation.",
	"logging.file": "Optional file path for persisted log output in addition to or instead of console logging. Use a managed writable path and align retention/rotation with your operational policy.",
	"logging.consoleLevel": "Console-specific log threshold: \"silent\", \"fatal\", \"error\", \"warn\", \"info\", \"debug\", or \"trace\" for terminal output control. Use this to keep local console quieter while retaining richer file logging if needed.",
	"logging.consoleStyle": "Console output format style: \"pretty\" or \"json\". Use json for machine parsing pipelines and pretty for human-first terminal workflows.",
	"logging.redactPatterns": "Custom regex strings replace the default string list for log/transcript output and add to safety-boundary UI/tool/diagnostic rules. Built-in form-body, structured-auth, and AWS bare-key protections always apply. Use this to mask deployment-specific tokens and identifiers.",
	update: "Update-channel and startup-check behavior for keeping OpenClaw runtime versions current. Use conservative channels in production and more experimental channels only in controlled environments.",
	"update.channel": "Update channel for git + npm installs (\"stable\", \"extended-stable\", \"beta\", or \"dev\"). Extended-stable is package-only: installation is foreground-only, with optional read-only startup hints.",
	"update.checkOnStart": "Checks for updates when the Gateway starts, including read-only extended-stable hints (default: true). Set false to disable automatic Gateway and headless-node update checks, applies, and anonymous update pings.",
	"update.auto.enabled": "Enable background auto-update for stable and beta package installs; extended-stable never auto-applies (default: false).",
	telemetry: "Explicit consent for anonymous feature statistics attached to the daily update check. Feature statistics are disabled by default and never include messages, credentials, or identifiers.",
	...TELEMETRY_FIELD_HELP,
	cloudWorkers: "Opt-in cloud worker profiles for disposable remote environments. When this section is omitted or has no profiles, cloud worker creation remains unavailable and existing gateway/node status behavior is unchanged.",
	...CLOUD_WORKER_FIELD_HELP,
	...DESKTOP_FIELD_HELP,
	gateway: "Gateway runtime surface for bind mode, auth, control UI, remote transport, and operational safety controls. Keep conservative defaults unless you intentionally expose the gateway beyond trusted local interfaces.",
	"gateway.port": "TCP port used by the gateway listener for API, control UI, and channel-facing ingress paths. Use a dedicated port and avoid collisions with reverse proxies or local developer services.",
	"gateway.mode": "Gateway operation mode: \"local\" runs channels and agent runtime on this host, while \"remote\" connects through remote transport. Keep \"local\" unless you intentionally run a split remote gateway topology.",
	"gateway.bind": "Network bind profile: \"auto\", \"lan\", \"loopback\", \"custom\", or \"tailnet\" to control interface exposure. Keep \"loopback\" for local-only operation; \"auto\" can expose all interfaces.",
	"gateway.customBindHost": "IPv4 address used for a custom bind. Specific IPv4s also require the same Gateway port on 127.0.0.1; avoid 0.0.0.0 unless all-interface exposure is required.",
	"gateway.controlUi": "Control UI hosting settings including enablement, pathing, and browser-origin/auth hardening behavior. Keep UI exposure minimal and pair with strong auth controls before internet-facing deployments.",
	"gateway.controlUi.enabled": "Enables serving the gateway Control UI from the gateway HTTP process when true. Keep enabled for local administration, and disable when an external control surface replaces it.",
	"gateway.cliAgents": "Control UI discovery for external CLI session engines exposed by the Gateway session catalog. Enabled by default; disable to prevent starting those engines from the new-session model picker.",
	"gateway.cliAgents.enabled": "Shows catalog-backed CLI agents in the Control UI new-session model picker when true (default: true). Set false to disable CLI agents and native CLI session creation. Only catalogs that advertise session creation are listed, and the picker stays hidden when the Gateway does not advertise session catalog support.",
	"gateway.terminal": "Operator terminal served to Control UI and mobile clients: a PTY-backed shell on the gateway host, restricted to admin-scope operator sessions. It starts in the target agent's workspace and is refused for fully-sandboxed agents (sandbox.mode 'all') rather than handing back an unconfined host shell.",
	"gateway.terminal.enabled": "Enables the operator terminal for admin-scope clients (default: true). This exposes a browser/mobile shell with the gateway process environment; set false to opt out on deployments where admin operators should not get a host shell. Changes apply without restarting the Gateway.",
	"gateway.terminal.shell": "Shell executable the operator terminal launches. Leave unset to use the host login shell ($SHELL on Unix, %ComSpec% on Windows), or pin an explicit interpreter for a consistent operator environment.",
	"gateway.terminal.detachedSessionTimeoutSeconds": "Seconds a terminal session survives after its connection drops (laptop sleep, page reload), staying reattachable via terminal.attach with its recent output replayed. Set 0 to kill sessions the moment the connection drops. Default: 300 (5 minutes). Detached sessions keep running their commands, so shorten this on shared or exposed hosts.",
	"gateway.auth": "Authentication policy for gateway HTTP/WebSocket access including mode, credentials, trusted-proxy behavior, and rate limiting. Keep auth enabled for every non-loopback deployment.",
	"gateway.auth.mode": "Gateway auth mode: \"none\", \"token\", \"password\", or \"trusted-proxy\" depending on your edge architecture. Token/password mode selects the configured secret (gateway.auth.token or gateway.auth.password); clients may send it in either connect auth field. Use token/password for direct exposure, and trusted-proxy only behind hardened identity-aware proxies.",
	"gateway.auth.allowTailscale": "Allows trusted Tailscale identity paths to satisfy gateway auth checks when configured. Use this only when your tailnet identity posture is strong and operator workflows depend on it.",
	"gateway.auth.identityScopes": "Maps verified trusted-proxy or Tailscale identities to connection-only operator scope grants. Email keys match case-insensitively; grants augment device scopes before the connection scope cap is applied.",
	"gateway.auth.rateLimit": "Login/auth attempt throttling controls to reduce credential brute-force risk at the gateway boundary. Keep enabled in exposed environments and tune thresholds to your traffic baseline.",
	"gateway.auth.trustedProxy": "Trusted-proxy auth header mapping for upstream identity providers that inject user claims. Use only with known proxy CIDRs and strict header allowlists to prevent spoofed identity headers.",
	"gateway.auth.trustedProxy.cloudflareAccessOidc": "Optional verified GitHub identity from a selected Cloudflare Access OIDC provider. Requires the standard Access email and assertion headers. Missing claims keep email-only profiles; existing profile roles and co-author preferences are preserved.",
	"gateway.auth.trustedProxy.cloudflareAccessOidc.issuer": "Exact HTTPS origin of the trusted Cloudflare Access team, such as https://example.cloudflareaccess.com, without a trailing slash. Claims from other issuers do not supply GitHub identity.",
	"gateway.auth.trustedProxy.cloudflareAccessOidc.providerId": "Exact Access identity-provider ID for the trusted OIDC integration. A provider display name or a matching claim name alone does not establish trust.",
	"gateway.auth.trustedProxy.cloudflareAccessOidc.githubAccountIdClaim": "Exact forwarded OIDC claim whose value is a verified positive decimal-string GitHub account ID. Configure Access to forward it in oidc_fields; never use an unverified user-editable claim.",
	"gateway.auth.trustedProxy.deviceAutoApprove": "Optional policy for automatically approving new browser and native UI operator devices and same-key scope upgrades after trusted-proxy authentication. Grants are capped by deviceAutoApprove.scopes and the proxy's x-openclaw-scopes header when present.",
	"gateway.auth.trustedProxy.deviceAutoApprove.enabled": "Automatically approves new browser and native UI operator devices and same-key scope upgrades after the reverse proxy authenticates an allowed user. Default: false. Enable only when the proxy identity boundary is strong enough to replace manual device pairing.",
	"gateway.auth.trustedProxy.deviceAutoApprove.scopes": "Maximum scopes granted to auto-approved operator devices. Defaults to operator.read, operator.write, operator.approvals, and operator.questions. Requested scopes are capped to this list; requests without scopes receive this list. When unset, auto-approval also adds operator.questions for older UI clients; an explicit list is never widened. Explicitly listing operator.admin lets every proxy-authenticated user auto-approve full admin and makes scope-less requests receive full admin automatically; it also triggers a critical security audit finding and Gateway startup warning.",
	"gateway.roles": "Optional profile-bound operator roles for team Gateways. Each named role controls access to other people's sessions, sandbox isolation, session and run agents, and granted operator scopes; omitting this section preserves existing operator behavior.",
	"gateway.roles.default": "Required role assigned to authenticated profiles without a valid explicit assignment whenever operator roles are configured. Its name must match a configured role definition.",
	"gateway.roles.definitions": "Nonempty administrator-named role definitions bundling the closed session-sharing, sandbox-isolation, agent-access, and operator-scope policies applied to authenticated user profiles.",
	"gateway.roles.definitions.*": "One named operator role. Every definition must explicitly provide its session-sharing policy, allowed session and run agents, and operator-scope ceiling, and can require sandbox isolation for newly created sessions and a plugin access policy.",
	"gateway.roles.definitions.*.sessions": "Session-sharing permissions granted to this role for sessions created by other authenticated people; a person's own sessions remain owner-accessible.",
	"gateway.roles.definitions.*.sessions.others": "Access to other people's sessions: \"none\" hides them, \"view\" allows reading, \"suggest\" permits the suggestion flow, and \"write\" permits participation. Explicit session membership can grant additional access.",
	"gateway.roles.definitions.*.sandbox": "Execution isolation for newly created sessions: \"inherit\" (default) uses the agent policy; \"required\" permanently requires a sandbox, even when the agent sandbox mode is off, and fails closed if the backend is unavailable.",
	"gateway.roles.definitions.*.agents": "Agents available when this role creates sessions or starts runs: set \"*\" to allow every agent, list agent IDs to allow only those agents, or use an empty list to disable both.",
	"gateway.roles.definitions.*.scopes": "Closed list of operator scopes granted as this role's maximum connection authority. Requested, paired, identity-granted, and upgraded scopes are intersected with this list.",
	"gateway.roles.definitions.*.accessPolicyPlugin": "Optional exact plugin ID whose Gateway access policy must authorize this role. Access is denied when the plugin is missing, disabled, fails to load, or supplies no current authority. Unavailable plugin IDs remain valid configuration so independent staff roles and the Gateway owner can repair access. Omitting this field adds no plugin dependency.",
	"gateway.trustedProxies": "CIDR/IP allowlist of upstream proxies permitted to provide forwarded client identity headers. Keep this list narrow so untrusted hops cannot impersonate users.",
	"gateway.allowRealIpFallback": "Enables x-real-ip fallback when x-forwarded-for is missing in proxy scenarios. Keep disabled unless your ingress stack requires this compatibility behavior.",
	"gateway.tools": "Gateway-level tool exposure allow/deny policy that can restrict runtime tool availability independent of agent/tool profiles. Use this for coarse emergency controls and production hardening.",
	"gateway.tools.allow": "Explicit gateway-level tool allowlist when you want a narrow set of tools available at runtime. Use this for locked-down environments where tool scope must be tightly controlled.",
	"gateway.tools.deny": "Explicit gateway-level tool denylist to block risky tools even if lower-level policies allow them. Use deny rules for emergency response and defense-in-depth hardening.",
	"gateway.tailscale": "Tailscale integration settings for Serve/Funnel exposure and lifecycle handling on gateway start/exit. Keep off unless your deployment intentionally relies on Tailscale ingress.",
	"gateway.tailscale.mode": "Tailscale publish mode: \"off\", \"serve\", or \"funnel\" for private or public exposure paths. Use \"serve\" for tailnet-only access and \"funnel\" only when public internet reachability is required.",
	"gateway.tailscale.preserveFunnel": "Deprecated migration guard for mode='serve'. If an external Funnel still targets the ordinary Gateway listener, OpenClaw leaves exposure unchanged and warns that only plugin-authenticated webhooks remain usable until password auth is configured and mode is migrated to 'funnel'.",
	"gateway.remote": "Remote gateway connection settings for direct or SSH transport when this instance proxies to another runtime host. Use remote mode only when split-host operation is intentionally configured.",
	"gateway.remote.transport": "Remote connection transport: \"direct\" uses configured URL connectivity, while \"ssh\" tunnels through SSH. Use SSH when you need encrypted tunnel semantics without exposing remote ports.",
	"gateway.reload": "Live config-reload policy for how edits are applied and when full restarts are triggered. Keep hybrid behavior for safest operational updates unless debugging reload internals.",
	"gateway.tls": "TLS certificate and key settings for terminating HTTPS directly in the gateway process. Use explicit certificates in production and avoid plaintext exposure on untrusted networks.",
	"gateway.tls.enabled": "Enables TLS termination at the gateway listener so clients connect over HTTPS/WSS directly. Keep enabled for direct internet exposure or any untrusted network boundary.",
	"gateway.tls.autoGenerate": "Auto-generates a local TLS certificate/key pair when explicit files are not configured. Use only for local/dev setups and replace with real certificates for production traffic.",
	"gateway.tls.certPath": "Filesystem path to the TLS certificate file used by the gateway when TLS is enabled. Use managed certificate paths and keep renewal automation aligned with this location.",
	"gateway.tls.keyPath": "Filesystem path to the TLS private key file used by the gateway when TLS is enabled. Keep this key file permission-restricted and rotate per your security policy.",
	"gateway.tls.caPath": "Optional CA bundle path for client verification or custom trust-chain requirements at the gateway edge. Use this when private PKI or custom certificate chains are part of deployment.",
	"gateway.http": "Gateway HTTP API configuration grouping endpoint toggles and transport-facing API exposure controls. Keep only required endpoints enabled to reduce attack surface.",
	"gateway.http.endpoints": "HTTP endpoint feature toggles under the gateway API surface for compatibility routes and optional integrations. Enable endpoints intentionally and monitor access patterns after rollout.",
	"gateway.http.securityHeaders": "Optional HTTP response security headers applied by the gateway process itself. Prefer setting these at your reverse proxy when TLS terminates there.",
	"gateway.http.securityHeaders.strictTransportSecurity": "Value for the Strict-Transport-Security response header. Set only on HTTPS origins that you fully control; use false to explicitly disable.",
	"gateway.remote.url": "Remote Gateway WebSocket URL (ws:// or wss://).",
	"gateway.remote.token": "Shared secret sent in the token field to authenticate this client to a remote gateway. The server's gateway.auth.mode selects its configured secret; either client token or password field is accepted. Store via secret/env substitution and rotate alongside remote gateway auth changes.",
	"gateway.remote.password": "Shared secret sent in the password field to authenticate this client to a remote gateway. The server's gateway.auth.mode selects its configured secret; either client token or password field is accepted. Keep this secret managed externally and avoid plaintext values in committed config.",
	"gateway.remote.edgeAuth": "Secret-backed HTTP headers presented to an identity-aware proxy in front of the configured remote Gateway. Headers are sent only to the exact gateway.remote.url origin over WSS and never follow redirects.",
	"gateway.remote.tlsFingerprint": "Expected sha256 TLS fingerprint for the remote gateway (pin to avoid MITM).",
	"gateway.remote.sshTarget": "Remote gateway over SSH (tunnels the gateway port to localhost). Format: user@host or user@host:port.",
	"gateway.remote.sshIdentity": "Optional SSH identity file path (passed to ssh -i).",
	"gateway.remote.sshHostKeyPolicy": "macOS SSH host-key verification policy. \"strict\" requires an already trusted host key; \"openssh\" explicitly delegates to effective OpenSSH configuration.",
	"talk.provider": "Active Talk provider id (for example \"acme-speech\").",
	"talk.providers": "Provider-specific Talk settings keyed by provider id. During migration, prefer this over legacy talk.* keys.",
	"talk.providers.*": "Provider-owned Talk config fields for the matching provider id.",
	"talk.providers.*.apiKey": "Provider API key for Talk mode.",
	"talk.realtime": "Realtime Talk provider, model, voice, mode, transport, and brain strategy. Keep speech/TTS provider config in talk.provider and talk.providers.",
	"talk.realtime.provider": "Active realtime voice provider id, such as openai or google.",
	"talk.realtime.providers": "Provider-specific realtime voice settings keyed by provider id.",
	"talk.realtime.providers.*": "Provider-owned realtime voice config for the matching provider id.",
	"talk.realtime.providers.*.apiKey": "Provider API key for realtime Talk.",
	"talk.realtime.model": "Realtime provider model id override for browser or Gateway-owned Talk sessions.",
	"talk.realtime.speakerVoice": "Realtime provider speaker voice name override for browser or Gateway-owned Talk sessions.",
	"talk.realtime.speakerVoiceId": "Realtime provider speaker voice id override for browser or Gateway-owned Talk sessions.",
	"talk.realtime.instructions": "Additional system instructions appended to OpenClaw's built-in realtime Talk prompt. Use this for voice style, tone, and other provider-facing realtime behavior while keeping agent-consult guidance intact.",
	"talk.realtime.mode": "Talk execution mode: realtime, stt-tts, or transcription.",
	"talk.realtime.transport": "Talk byte/session transport: webrtc, provider-websocket, gateway-relay, or managed-room.",
	"talk.realtime.vadThreshold": "Realtime voice activity detection threshold from 0 (most sensitive) to 1 (least sensitive).",
	"talk.realtime.silenceDurationMs": "Milliseconds of silence before a realtime Talk user turn is committed.",
	"talk.realtime.prefixPaddingMs": "Milliseconds of audio retained before realtime voice activity is detected.",
	"talk.realtime.reasoningEffort": "Provider-specific reasoning effort for realtime Talk sessions, such as minimal, low, medium, or high.",
	"talk.realtime.brain": "Talk reasoning strategy: agent-consult for Gateway-mediated agent help, direct-tools for local tool calls, or none.",
	"talk.realtime.consultRouting": "Gateway relay fallback for final user transcripts when the realtime provider skips openclaw_agent_consult. provider-direct preserves provider replies; force-agent-consult routes through OpenClaw.",
	"talk.consultThinkingLevel": "Use this to override the thinking level for the regular agent run behind Talk realtime consults.",
	"talk.consultFastMode": "Use this to set true or false fast mode for the regular agent run behind Talk realtime consults.",
	"talk.speechLocale": "BCP 47 locale id for Talk speech recognition on device nodes and the iOS system-voice fallback, for example \"ru-RU\". Leave unset to use each device default.",
	"talk.interruptOnSpeech": "If true (default), stop assistant speech when the user starts speaking in Talk mode. Keep enabled for conversational turn-taking.",
	"talk.silenceTimeoutMs": `Milliseconds of user silence before Talk mode finalizes and sends the current transcript. Leave unset to keep the platform default pause window (${describeTalkSilenceTimeoutDefaults()}).`,
	acp: "ACP runtime controls for enabling dispatch, selecting backends, constraining allowed agent targets, and selecting streamed turn projection behavior.",
	"acp.enabled": "Global ACP feature gate. Keep disabled unless ACP runtime + policy are configured.",
	"acp.dispatch.enabled": "Independent dispatch gate for ACP session turns (default: true). Set false to keep ACP commands available while blocking ACP turn execution.",
	"acp.backend": "Default ACP runtime backend id (for example: acpx). Must match a registered ACP runtime plugin backend.",
	"acp.fallbacks": "Ordered list of fallback ACP backend ids tried when the primary backend fails with UNAVAILABLE (for example: rate-limit / quota exhausted). Each entry must match a registered ACP runtime plugin backend.",
	"acp.defaultAgent": "Fallback ACP target agent id used when ACP spawns do not specify an explicit target.",
	"acp.allowedAgents": "Allowlist of ACP target agent ids permitted for ACP runtime sessions. Empty means no additional allowlist restriction.",
	"acp.stream": "ACP streaming projection controls for chunk sizing, metadata visibility, and deduped delivery behavior.",
	"acp.stream.repeatSuppression": "When true (default), suppress repeated ACP status/tool projection lines in a turn while keeping raw ACP events unchanged.",
	"acp.stream.deliveryMode": "ACP delivery style: live streams projected output incrementally, final_only buffers all projected ACP output until terminal turn events.",
	"acp.stream.tagVisibility": "Per-sessionUpdate visibility overrides for ACP projection (for example usage_update, available_commands_update).",
	"acp.runtime.installCommand": "Optional operator install/setup command shown by `/acp install` and `/acp doctor` when ACP backend wiring is missing.",
	surfaces: "Per-surface message policy overrides keyed by the resolved delivery surface id. Use this only when one deployed surface needs stricter silent-reply handling than the agent default.",
	"surfaces.*.silentReply": "Overrides silent-reply policy for one resolved delivery surface. Unset fields inherit agents.defaults.silentReply; use narrow surface ids so internal or group-specific behavior does not spill into other destinations.",
	"agents.entries.*.skills": "Optional allowlist of skills for this agent. If omitted, the agent inherits agents.defaults.skills when set; otherwise skills stay unrestricted. Set [] for no skills. An explicit list fully replaces inherited defaults instead of merging with them.",
	agents: "Agent runtime configuration root. Root siblings own infrastructure and cross-agent defaults; agents.defaults owns agent-loop behavior; agent entries may override either where supported.",
	"agents.ownership": "Durable multi-agent ownership generation marker. \"explicit\" means ambient channels, heartbeat, system-agent consults, Talk, cron, and bare CLI operations must resolve a surface-specific owner or fail closed. OpenClaw stamps this automatically when creating or migrating a fleet; omit it for a sole agent.",
	"agents.defaults": "Shared default settings inherited by agents unless overridden per entry in agents.entries. Use defaults to enforce consistent baseline behavior and reduce duplicated per-agent configuration.",
	"agents.defaults.skills": "Optional default skill allowlist inherited by agents that omit agents.entries.*.skills. Omit for unrestricted skills, set [] to give inheriting agents no skills, and remember explicit agents.entries.*.skills replaces this default instead of merging with it.",
	"agents.defaults.subagents.delegationMode": "Prompt-only sub-agent delegation strength. Defaults to \"prefer\" in each agent's main session and \"suggest\" elsewhere; \"prefer\" strongly instructs the agent to delegate non-trivial work via sessions_spawn.",
	"agents.entries.*.subagents.delegationMode": "Per-agent override for sub-agent delegation strength. Omit to use \"prefer\" in this agent's main session and \"suggest\" elsewhere; explicit \"prefer\" or \"suggest\" always wins.",
	"agents.entries.*.contextInjection": "Per-agent override for workspace bootstrap-file injection in the embedded runtime. Omit to inherit agents.defaults.contextInjection. Does not control CLI-backed prompt preparation.",
	"agents.entries.*.cwd": "Working directory for this agent's reply runs. Overrides agents.defaults.cwd but not session-spawned cwd; bootstrap and memory files stay in workspace. Supports ~ and relative paths; a distinct cwd requires an unsandboxed run.",
	"agents.entries.*.bootstrapMaxChars": "Per-agent override for max characters of each workspace bootstrap file injected into this agent's system prompt. Omit to inherit agents.defaults.bootstrapMaxChars.",
	"agents.entries.*.bootstrapTotalMaxChars": "Per-agent override for max total characters across all workspace bootstrap files injected into this agent's system prompt. Omit to inherit agents.defaults.bootstrapTotalMaxChars.",
	"agents.entries.*.experimental": "Per-agent experimental flags. Omitted fields inherit agents.defaults.experimental.",
	"agents.entries.*.experimental.localModelLean": "Per-agent troubleshooting override for lean local-model mode. Enable it only when restricting optional tools resolves a demonstrated model failure, without trimming tools from every agent.",
	"agents.defaults.contextLimits": "Focused per-agent-context budget defaults for selected high-volume excerpts and injected prompt blocks. Use this to tune bounded read/injection sizes without reopening any unbounded call paths.",
	"agents.defaults.contextLimits.memoryGetMaxChars": "Default max characters returned by memory_get before truncation metadata and continuation notice are added. Increase to approximate older larger excerpts, but keep it bounded.",
	"agents.defaults.contextLimits.postCompactionMaxChars": "Default max characters retained from AGENTS.md during post-compaction context refresh injection. Lower this to make compaction recovery cheaper, or raise it for agents that depend on longer startup guidance.",
	"agents.entries": "Explicit list of configured agents with IDs and optional overrides for model, tools, identity, and workspace. Keep IDs stable over time so bindings, approvals, and session routing remain deterministic.",
	"agents.entries.*.skillsLimits": "Optional per-agent overrides for skills subsystem budgets. Use this when an agent needs a different skills prompt budget without introducing a second generic context-limits path.",
	"agents.entries.*.skillsLimits.maxSkillsPromptChars": "Per-agent override for the skills prompt character budget. This extends the existing skills.limits.maxSkillsPromptChars path instead of routing the same budget through contextLimits.",
	"agents.entries.*.contextLimits": "Optional per-agent overrides for the focused context budget knobs. Omitted fields inherit agents.defaults.contextLimits.",
	"agents.entries.*.contextLimits.memoryGetMaxChars": "Per-agent override for the default memory_get max character budget.",
	"agents.entries.*.contextLimits.postCompactionMaxChars": "Per-agent override for the post-compaction AGENTS.md excerpt budget.",
	"agents.entries.*.thinkingDefault": "Optional per-agent default thinking level. Overrides agents.defaults.thinkingDefault for this agent when no per-message or session override is set.",
	"agents.entries.*.reasoningDefault": "Optional per-agent default reasoning visibility (on|off|stream). Applies when no per-message or session reasoning override is set.",
	"agents.entries.*.fastModeDefault": "Optional per-agent default for fast mode (\"auto\", true, or false). Applies when no per-message or session fast-mode override is set.",
	"agents.defaults.fastModeDefault": "Default fast-mode policy for the agent loop (\"auto\", true, or false). Individual agent entries override it.",
	"agents.entries.*.runtime": "Optional runtime descriptor for this agent. Use embedded for default OpenClaw execution or acp for external ACP harness defaults.",
	"agents.entries.*.runtime.type": "Runtime type for this agent: \"embedded\" (default OpenClaw runtime) or \"acp\" (ACP harness defaults).",
	"agents.entries.*.runtime.acp": "ACP runtime defaults for this agent when runtime.type=acp. Binding-level ACP overrides still take precedence per conversation.",
	"agents.entries.*.runtime.acp.agent": "Optional ACP harness agent id to use for this OpenClaw agent (for example codex, claude, cursor, gemini, openclaw).",
	"agents.entries.*.runtime.acp.backend": "Optional ACP backend override for this agent's ACP sessions (falls back to global acp.backend).",
	"agents.entries.*.runtime.acp.mode": "Optional ACP session mode default for this agent (persistent or oneshot).",
	"agents.entries.*.runtime.acp.cwd": "Optional default working directory for this agent's ACP sessions.",
	"agents.entries.*.identity.avatar": "Avatar image path (relative to the agent workspace only) or a remote URL/data URL.",
	"agents.defaults.heartbeat.timeoutSeconds": "Maximum time in seconds allowed for a heartbeat agent turn before it is aborted. Leave unset to use agents.defaults.timeoutSeconds when set, otherwise the heartbeat cadence capped at 600 seconds.",
	"agents.defaults.heartbeat.agentId": "Agent that owns ambient heartbeat runs when no per-agent heartbeat configuration exists. Leave unset to preserve configured-default routing.",
	"agents.entries.*.heartbeat.timeoutSeconds": "Per-agent maximum time in seconds allowed for a heartbeat agent turn before it is aborted. Leave unset to inherit the merged heartbeat timeout, then agents.defaults.timeoutSeconds when set, otherwise the heartbeat cadence capped at 600 seconds.",
	"agents.defaults.systemAgent": "Target settings for ambient OpenClaw system-agent and Custodian inference plus selected unscoped operator reads.",
	"agents.defaults.systemAgent.agentId": "Agent whose model and credentials own ambient system-agent and Custodian consults. Also used when models.list, models.authStatus, skills.status, doctor.memory.status, or an infer CLI command that resolves agent-owned model or auth state omits agentId or --agent; explicit request agentId always wins.",
	"agents.defaults.authInheritance": "Upgrade compatibility owner for the inherited credential store until credentials are relocated per agent.",
	"agents.defaults.authInheritance.agentId": "Agent whose legacy credential store remains the inheritance source after default-marker retirement. Written automatically during upgrade when the former owner was not main.",
	"agents.defaults.sessionStore": "Upgrade compatibility owner for retired main-agent rows and fixed legacy session stores.",
	"agents.defaults.sessionStore.agentId": "Agent that owns retired main-agent rows or unscoped rows in a fixed legacy session store after default-marker retirement. Written automatically during upgrade when the former owner was not main or the sole agent.",
	"talk.agentId": "Agent that owns Talk sessions created without an explicit agent-scoped session key."
};
//#endregion
//#region src/config/schema.help.models.ts
const MODEL_FIELD_HELP = {
	models: "Model catalog root for provider definitions, merge/replace behavior, and optional Bedrock discovery integration. Keep provider definitions explicit and validated before relying on production failover paths.",
	"models.mode": "Controls provider catalog behavior: \"merge\" keeps built-ins and overlays your custom providers, while \"replace\" uses only your configured providers. In \"merge\", matching provider IDs preserve non-empty agent models.json baseUrl values, while apiKey values are preserved only when the provider is not SecretRef-managed in current config/auth-profile context; SecretRef-managed providers refresh apiKey from current source markers, and matching model contextWindow/maxTokens use the higher value between explicit and implicit entries.",
	"models.providers": "Provider map keyed by provider ID containing connection/auth settings and concrete model definitions. Built-in providers may be tuned with provider-level overlays; custom providers must include baseUrl and models. Use stable provider keys so references from agents and tooling remain portable across environments.",
	"models.catalogRefresh": "Controls background updates to the bundled model catalog. Remote rows can update model metadata but cannot change provider endpoints or headers.",
	"models.catalogRefresh.enabled": "Fetch hosted model catalog updates in the background (default: true). Set to false to disable all remote model catalog traffic.",
	"models.catalogRefresh.url": "Override the hosted model catalog URL for a self-hosted HTTPS mirror (localhost HTTP is allowed for testing). Changes apply after a Gateway restart.",
	"models.providers.*.baseUrl": "Base URL for the provider endpoint used to serve model requests for that provider entry. Use HTTPS endpoints and keep URLs environment-specific through config templating where needed.",
	"models.providers.*.apiKey": "Provider credential used for API-key based authentication when the provider requires direct key auth. Use secret/env substitution and avoid storing real keys in committed config files.",
	"models.providers.*.auth": "Selects provider auth style: \"api-key\" for API key auth, \"token\" for bearer token auth, \"oauth\" for OAuth credentials, and \"aws-sdk\" for AWS credential resolution. Match this to your provider requirements.",
	"models.providers.*.api": "Provider API adapter selection controlling request/response compatibility handling for model calls. Use the adapter that matches your upstream provider protocol to avoid feature mismatch.",
	"models.providers.*.maxTokens": "Default maximum output token budget applied to models under this provider when a model entry does not set maxTokens.",
	"models.providers.*.timeoutSeconds": "Optional per-provider model request timeout in seconds. Provider-level request settings affect explicit provider-owned model rows; they do not create implicit models. For custom providers, set it alongside the provider baseUrl and models. Applies to provider HTTP fetches, including connect, headers, body, and total request abort handling, and also raises the LLM idle/stream watchdog ceiling for this provider above the implicit ~120s default. Use this for slow local or self-hosted model servers, or for cloud providers that buffer reasoning tokens silently on the wire (Gemini preview, large-tool-payload Claude/Opus), instead of changing global agent timeouts.",
	"models.providers.*.region": "Optional provider deployment/API region interpreted by providers that expose regional endpoints. Use provider docs for supported values; baseUrl overrides usually take precedence when both are set.",
	"models.providers.*.injectNumCtxForOpenAICompat": "Controls whether OpenClaw injects `options.num_ctx` for Ollama providers configured with the OpenAI-compatible adapter (`openai-completions`). Default is true. Set false only if your proxy/upstream rejects unknown `options` payload fields.",
	"models.providers.*.params": "Provider-specific runtime parameters interpreted by provider plugins. Keep keys documented by the provider, and prefer explicit provider docs over ad hoc shared assumptions.",
	"models.providers.*.headers": "Static HTTP headers merged into provider requests for tenant routing, proxy auth, or custom gateway requirements. Use this sparingly and keep sensitive header values in secrets.",
	"models.providers.*.authHeader": "When true, credentials are sent via the HTTP Authorization header even if alternate auth is possible. Use this only when your provider or proxy explicitly requires Authorization forwarding.",
	"models.providers.*.agentRuntime": "Optional low-level agent runtime policy for this provider. Use provider/model runtime policy instead of agent-wide runtime pins; omitted/default lets OpenClaw choose the runtime for the selected provider.",
	"models.providers.*.agentRuntime.id": "Provider agent runtime id: \"openclaw\", \"auto\", a registered plugin harness id such as \"codex\", or a supported CLI backend alias such as \"claude-cli\". OpenAI on the official endpoint defaults to the Codex harness when omitted.",
	"models.providers.*.localService": "Optional on-demand local model server process for this provider. OpenClaw probes healthUrl, starts the command when needed, waits for readiness, and then sends the model request.",
	"models.providers.*.localService.command": "Absolute executable path for the local model server process. Keep this path explicit so provider startup is deterministic and does not depend on shell PATH lookup.",
	"models.providers.*.localService.args": "Argument list passed to the local model server command without shell expansion.",
	"models.providers.*.localService.cwd": "Working directory for the local model server process.",
	"models.providers.*.localService.env": "Additional environment variables for the local model server process. Values that look secret are redacted from config snapshots.",
	"models.providers.*.localService.healthUrl": "Readiness URL probed before model requests. If omitted, OpenClaw uses the provider baseUrl with /models appended.",
	"models.providers.*.localService.readyTimeoutMs": "Maximum milliseconds to wait for the local model server readiness probe after starting the process.",
	"models.providers.*.localService.idleStopMs": "Milliseconds to keep an OpenClaw-started local model server alive after the last request finishes. Set 0 to keep it alive until OpenClaw exits.",
	"models.providers.*.request": "Optional request overrides for model-provider requests, including extra headers, auth overrides, proxy routing, TLS client settings, and optional allowPrivateNetwork for trusted self-hosted endpoints. Use these only when your upstream or enterprise network path requires transport customization.",
	"models.providers.*.request.headers": "Extra headers merged into provider requests after default attribution and auth resolution.",
	"models.providers.*.request.auth": "Override provider request authentication behavior for this provider.",
	"models.providers.*.request.auth.mode": "Auth override mode: \"provider-default\", \"authorization-bearer\", or \"header\".",
	"models.providers.*.request.auth.token": "Bearer token used when auth mode is authorization-bearer.",
	"models.providers.*.request.auth.headerName": "Custom auth header name used when auth mode is header.",
	"models.providers.*.request.auth.value": "Custom auth header value used when auth mode is header.",
	"models.providers.*.request.auth.prefix": "Optional prefix prepended to request.auth.value when auth mode is header.",
	"models.providers.*.request.proxy": "Optional proxy override for model-provider requests. Use \"env-proxy\" to honor environment proxy settings or \"explicit-proxy\" to route through a specific proxy URL.",
	"models.providers.*.request.proxy.mode": "Proxy override mode for model-provider requests: \"env-proxy\" or \"explicit-proxy\".",
	"models.providers.*.request.proxy.url": "Explicit proxy URL used when request.proxy.mode is explicit-proxy. Credentials embedded in the URL are treated as sensitive and redacted from snapshots.",
	"models.providers.*.request.proxy.tls": "Optional TLS settings used when connecting to the configured proxy.",
	"models.providers.*.request.proxy.tls.ca": "Custom CA bundle used to verify the proxy TLS certificate chain.",
	"models.providers.*.request.proxy.tls.cert": "Client TLS certificate presented to the proxy when mutual TLS is required.",
	"models.providers.*.request.proxy.tls.key": "Private key paired with request.proxy.tls.cert for proxy mutual TLS.",
	"models.providers.*.request.proxy.tls.passphrase": "Optional passphrase used to decrypt request.proxy.tls.key.",
	"models.providers.*.request.proxy.tls.serverName": "Optional SNI/server-name override used when establishing TLS to the proxy.",
	"models.providers.*.request.proxy.tls.insecureSkipVerify": "Skips proxy TLS certificate verification. Use only for controlled development environments.",
	proxy: "Operator-managed forward proxy routing for OpenClaw runtime HTTP, HTTPS, WebSocket, and supported raw-egress paths. Use this when central egress control is part of the deployment boundary.",
	"proxy.enabled": "Explicit managed-proxy override. URL presence enables routing by default; set false to ignore configured or environment proxy URLs without deleting them.",
	"proxy.proxyUrl": "Managed forward proxy URL. Use http:// for a plain CONNECT proxy or https:// when the connection to the proxy endpoint itself must use TLS.",
	"proxy.tls": "TLS settings used when connecting to the managed proxy endpoint. These settings apply to proxy TLS, not destination TLS after CONNECT.",
	"proxy.tls.caFile": "Filesystem path to a custom CA bundle used to verify an HTTPS managed proxy endpoint certificate.",
	"proxy.loopbackMode": "Controls Gateway loopback control-plane routing while managed proxy mode is active: \"gateway-only\", \"proxy\", or \"block\".",
	"models.providers.*.request.tls": "Optional TLS settings used when connecting directly to the upstream model endpoint.",
	"models.providers.*.request.tls.ca": "Custom CA bundle used to verify the upstream TLS certificate chain.",
	"models.providers.*.request.tls.cert": "Client TLS certificate presented to the upstream endpoint when mutual TLS is required.",
	"models.providers.*.request.tls.key": "Private key paired with request.tls.cert for upstream mutual TLS.",
	"models.providers.*.request.tls.passphrase": "Optional passphrase used to decrypt request.tls.key.",
	"models.providers.*.request.tls.serverName": "Optional SNI/server-name override used when establishing upstream TLS.",
	"models.providers.*.request.tls.insecureSkipVerify": "Skips upstream TLS certificate verification. Use only for controlled development environments.",
	"models.providers.*.request.allowPrivateNetwork": "When true, allow model-provider HTTP requests to private, CGNAT, or similar ranges through the provider HTTP fetch guard (fetchWithSsrFGuard). Custom/local provider base URLs already trust the exact configured origin, except metadata, link-local, and local-use NAT64 (64:ff9b:1::/48) origins; set this to false to opt out of that trust. OpenAI Responses WebSocket reuses request for headers/TLS but does not use that fetch SSRF path. Use true only for operator-controlled self-hosted endpoints that must reach private origins outside the configured baseUrl origin.",
	"models.providers.*.models": "Declared model list for a provider including identifiers, metadata, provider-specific params, and optional compatibility/cost hints. Keep IDs exact to provider catalog values so selection and fallback resolve correctly.",
	"models.providers.*.models[].agentRuntime": "Optional low-level agent runtime policy for this specific model. Model runtime policy overrides the provider runtime policy.",
	"models.providers.*.models[].agentRuntime.id": "Model agent runtime id: \"openclaw\", \"auto\", a registered plugin harness id such as \"codex\", or a supported CLI backend alias such as \"claude-cli\".",
	"models.providers.*.models[].mediaInput": "Optional model media capability metadata used by tools to choose conservative image compression defaults.",
	"models.providers.*.models[].mediaInput.image": "Optional image input limits for this model, such as maximum side length, maximum pixels, and preferred compression side.",
	"models.providers.*.models[].mediaInput.image.maxBytes": "Maximum encoded image payload size accepted by the provider for this model.",
	"models.providers.*.models[].mediaInput.image.maxPixels": "Maximum image pixel count accepted by the provider for this model.",
	"models.providers.*.models[].mediaInput.image.maxSidePx": "Maximum image width or height accepted by the provider for this model.",
	"models.providers.*.models[].mediaInput.image.preferredSidePx": "Preferred image resize side for balanced compression. Leave unset to use OpenClaw's conservative default.",
	"models.providers.*.models[].mediaInput.image.tokenMode": "Provider image token accounting style: \"tile\", \"detail\", or \"provider\".",
	auth: "Authentication profile root used for multi-profile provider credentials and cooldown-based failover ordering. Keep profiles minimal and explicit so automatic failover behavior stays auditable.",
	"channels.googlechat.botLoopProtection": "Sliding-window guard for accepted Google Chat bot-to-bot loops. Defaults to the shared bot loop protection budget when allowBots lets bot-authored messages reach dispatch.",
	"channels.mattermost.botToken": "Bot token from Mattermost System Console -> Integrations -> Bot Accounts.",
	"channels.mattermost.baseUrl": "Base URL for your Mattermost server (e.g., https://chat.example.com).",
	"channels.mattermost.chatmode": "Reply to channel messages on mention (\"oncall\"), on trigger chars (\">\" or \"!\") (\"onchar\"), or on every message (\"onmessage\").",
	"channels.mattermost.oncharPrefixes": "Trigger prefixes for onchar mode (default: [\">\", \"!\"]).",
	"channels.mattermost.requireMention": "Require @mention in channels before responding (default: true).",
	"auth.profiles": "Named auth profiles (provider + mode + optional email).",
	"auth.order": "Ordered auth profile IDs per provider (used for automatic failover).",
	"agents.defaults.workspace": "Default agent workspace for bootstrap and memory files. Also used as the working directory when agents.defaults.cwd is unset. Set this explicitly when running from wrappers so path resolution stays deterministic.",
	"agents.defaults.cwd": "Working directory for agent reply runs, separate from workspace bootstrap and memory files. Agent-specific cwd and session-spawned cwd take precedence. Supports ~ and relative paths; a distinct cwd requires an unsandboxed run.",
	"agents.defaults.skipBootstrap": "Skips automatic creation of workspace bootstrap files, not injection of existing files. For the embedded runtime, set agents.defaults.contextInjection to \"never\" to disable injection unless overridden per agent.",
	"agents.defaults.skipOptionalBootstrapFiles": "Optional bootstrap files that should not be created in agent workspaces. Valid values: SOUL.md, USER.md, IDENTITY.md (HEARTBEAT.md is accepted but a no-op).",
	"agents.defaults.contextInjection": "Controls workspace bootstrap-file injection in the embedded runtime: \"always\" uses normal injection (default), \"continuation-skip\" skips eligible continuation turns after a recorded full-bootstrap turn, and \"never\" disables injection. Does not control CLI-backed prompt preparation.",
	"agents.defaults.bootstrapMaxChars": "Max characters of each workspace bootstrap file injected into the system prompt before truncation (default: 20000).",
	"agents.defaults.bootstrapTotalMaxChars": "Max total characters across all injected workspace bootstrap files (default: 60000).",
	"agents.defaults.experimental": "Experimental agent-default flags. Keep these off unless you are intentionally testing a preview surface.",
	"agents.defaults.experimental.localModelLean": "Advanced troubleshooting override that restricts optional tools such as browser, automations, and message. Off by default; supported local runtimes use automatic Tool Search without this restriction. Explicit tool allows and required delivery tools are preserved.",
	"agents.defaults.startupContext": "Runtime-owned first-turn prelude for bare \"/new\" and \"/reset\". Use this to control whether recent daily memory files are preloaded into the first prompt instead of asking the model to decide what to read.",
	"agents.defaults.startupContext.enabled": "Enable the startup-context prelude for bare session resets (default: true). Disable this to fall back to prompt-only behavior with no runtime-loaded daily memory.",
	"agents.defaults.startupContext.applyOn": "Chooses which bare reset commands get startup context: include \"new\", \"reset\", or both (default: [\"new\",\"reset\"]).",
	"agents.defaults.startupContext.dailyMemoryDays": "Number of dated memory files to load counting backward from today in the configured user timezone (default: 2 for today + yesterday).",
	"agents.defaults.startupContext.maxFileBytes": "Maximum bytes allowed per daily memory file when building startup context (default: 16384). Files over this boundary-safe read limit are skipped.",
	"agents.defaults.startupContext.maxFileChars": "Maximum characters retained from each loaded daily memory file in the startup prelude (default: 1200).",
	"agents.defaults.startupContext.maxTotalChars": "Maximum total characters retained across all loaded daily memory files in the startup prelude (default: 2800). Additional files are truncated from the prelude once this cap is reached.",
	"agents.defaults.repoRoot": "Optional repository root shown in the system prompt runtime line (overrides auto-detect).",
	"agents.defaults.models": "Configured model catalog and per-model settings. Entries provide aliases, params, runtime metadata, and Code Mode overrides; they do not restrict model overrides.",
	"agents.defaults.modelSelectionScope": "Scope for chat commands and Gateway session model updates without an explicit scope: \"session\" (default) changes only the current session, \"agent\" also updates that agent's primary, and \"global\" also updates the shared agents.defaults.model fallback. Explicit scope flags take precedence; configured-default writes require owner/admin authority. Telegram callback pickers and the embedded local TUI stay session-only.",
	"agents.defaults.modelPolicy": "Explicit policy for model overrides. Omit it or leave allow empty to permit any model.",
	"agents.defaults.modelPolicy.allow": "Allowed model override refs. Accepts aliases, full \"provider/model\" refs, and provider wildcards such as \"openai/*\". Empty permits any model.",
	"agents.defaults.models.*.agentRuntime": "Optional per-model runtime policy for the default agent. Use this for model-specific runtime exceptions instead of setting a whole-agent runtime.",
	"agents.defaults.models.*.agentRuntime.id": "Default-agent model runtime id: \"openclaw\", \"auto\", a registered plugin harness id such as \"codex\", or a supported CLI backend alias such as \"claude-cli\".",
	"agents.defaults.models.*.codeMode": "OpenClaw Code Mode for this exact provider/model: On forces it on, Off disables it, and Default inherits tools.codeMode.enabled. Agent-specific activation settings take precedence. This does not change the selected runtime or Codex native Code Mode.",
	"memory.search": "Vector search over MEMORY.md and memory/*.md (per-agent overrides supported).",
	"memory.search.enabled": "Master toggle for memory search indexing and retrieval behavior on this agent profile. Keep enabled for semantic recall, and disable when you want fully stateless responses.",
	"memory.search.rememberAcrossConversations": "Use relevant context from this agent's other private conversations through protected transcript recall. Defaults on only when global session.dmScope is unset or \"main\" and no binding overrides DM scope; any configured DM isolation defaults it off. An explicit true or false always wins.",
	"memory.search.sources": "Chooses which sources are indexed: \"memory\" reads MEMORY.md + memory files, and \"sessions\" includes transcript history. Keep [\"memory\"] unless you need recall from prior chat transcripts.",
	"memory.search.extraPaths": "Adds extra directories or .md files to the memory index beyond default memory files. Entries may be path strings or objects with a root-relative glob pattern. When multimodal memory is enabled, matching image/audio files under these paths are also eligible for indexing.",
	"memory.search.extraPaths.*.path": "Sets the extra memory directory or file. Relative paths resolve from the agent workspace; direct file entries are indexed exactly.",
	"memory.search.extraPaths.*.pattern": "Limits a directory entry to supported files matching this root-relative glob, for example \"runbooks/**/*.md\". Omit it to scan all supported files recursively.",
	"memory.search.multimodal": "Optional multimodal memory settings for indexing image and audio files from configured extra paths. Keep this off unless your embedding model explicitly supports cross-modal embeddings, and set `memory.search.fallback` to \"none\" while it is enabled. Matching files are uploaded to the configured remote embedding provider during indexing.",
	"memory.search.multimodal.enabled": "Enables image/audio memory indexing from extraPaths. This currently requires Gemini embedding-2, keeps the default memory roots Markdown-only, disables memory-search fallback providers, and uploads matching binary content to the configured remote embedding provider.",
	"memory.search.multimodal.modalities": "Selects which multimodal file types are indexed from extraPaths: \"image\", \"audio\", or \"all\". Keep this narrow to avoid indexing large binary corpora unintentionally.",
	"memory.search.multimodal.maxFileBytes": "Sets the maximum bytes allowed per multimodal file before it is skipped during memory indexing. Use this to cap upload cost and indexing latency, or raise it for short high-quality audio clips.",
	"memory.search.experimental.sessionMemory": "Indexes session transcripts into memory search. Keep this advanced override when root and per-agent recall inheritance differ.",
	"memory.search.provider": "Selects the embedding backend used to build/query memory vectors. Defaults to \"openai\"; set \"openai-compatible\", \"gemini\", \"voyage\", \"mistral\", \"bedrock\", \"deepinfra\", \"github-copilot\", \"lmstudio\", \"ollama\", or \"local\" when you want a different backend.",
	"memory.search.model": "Embedding model override used by the selected memory provider when a non-default model is required. Set this only when you need explicit recall quality/cost tuning beyond provider defaults.",
	"memory.search.inputType": "Use this optional provider-specific `input_type` value only when the same label should apply to both query and document embedding requests. For asymmetric providers, prefer queryInputType and documentInputType.",
	"memory.search.queryInputType": "Optional provider-specific `input_type` value for query-time memory embeddings. Use this with OpenAI-compatible asymmetric embedding endpoints that require a query label.",
	"memory.search.documentInputType": "Optional provider-specific `input_type` value for document and indexing memory embeddings. Use this with OpenAI-compatible asymmetric embedding endpoints that require a passage or document label.",
	"memory.search.outputDimensionality": "Provider-specific output vector size override for memory embeddings. Gemini models support 128-3072 dimensions and recommend 768, 1536, or 3072; Bedrock families such as Titan V2, Cohere V4, and Nova expose their own allowed sizes. Expect a full reindex when you change it because stored vector dimensions must stay consistent.",
	"memory.search.remote.baseUrl": "Overrides the embedding API endpoint, such as an OpenAI-compatible proxy or custom Gemini base URL. Use this only when routing through your own gateway or vendor endpoint; keep provider defaults otherwise.",
	"memory.search.remote.apiKey": "Supplies a dedicated API key for remote embedding calls used by memory indexing and query-time embeddings. Use this when memory embeddings should use different credentials than global defaults or environment variables.",
	"memory.search.remote.headers": "Adds custom HTTP headers to remote embedding requests, merged with provider defaults. Use this for proxy auth and tenant routing headers, and keep values minimal to avoid leaking sensitive metadata.",
	"memory.search.remote.batch.enabled": "Enables provider batch APIs for embedding jobs when supported (OpenAI/Gemini), improving throughput on larger index runs. Keep this enabled unless debugging provider batch failures or running very small workloads.",
	"memory.search.local.modelPath": "Specifies the local embedding model source for local memory search, such as a GGUF file path or `hf:` URI. Use this only when provider is `local`, and verify model compatibility before large index rebuilds.",
	"memory.search.store.vector.enabled": "Controls the sqlite-vec semantic index. Keep this advanced override when root and per-agent vector policies differ.",
	"memory.search.fallback": "Backup provider used when primary embeddings fail: \"openai\", \"gemini\", \"voyage\", \"mistral\", \"bedrock\", \"lmstudio\", \"ollama\", \"local\", or \"none\". Set a real fallback for production reliability; use \"none\" only if you prefer explicit failures.",
	"memory.search.store.vector.extensionPath": "Overrides the auto-discovered sqlite-vec extension library path (`.dylib`, `.so`, or `.dll`). Use this when your runtime cannot find sqlite-vec automatically or you pin a known-good build.",
	"memory.search.query.maxResults": "Maximum number of memory hits returned from search before downstream reranking and prompt injection. Raise for broader recall, or lower for tighter prompts and faster responses.",
	"memory.search.query.minScore": "Minimum relevance score threshold for including memory results in final recall output. Increase to reduce weak/noisy matches, or lower when you need more permissive retrieval.",
	"memory.search.cache.enabled": "Caches computed chunk embeddings in SQLite so reindexing and incremental updates run faster (default: true). Keep this enabled unless investigating cache correctness or minimizing disk usage.",
	memory: "Built-in memory configuration (global).",
	"memory.citations": "Controls citation visibility in replies: \"auto\" shows citations when useful, \"on\" always shows them, and \"off\" hides them. Keep \"auto\" for a balanced signal-to-noise default."
};
//#endregion
//#region src/config/media-audio-field-metadata.ts
/** User-facing audio config metadata; the help map owns the supported field paths. */
const MEDIA_AUDIO_FIELD_HELP = {
	"tools.media.audio.enabled": "Enable audio understanding so voice notes or audio clips can be transcribed for agent context.",
	"tools.media.audio.preferredModel": "Prefer one capability-tagged tools.media.models entry for audio transcription before the remaining compatible fallbacks.",
	"tools.media.audio.maxBytes": "Default audio input size limit for configured and auto-detected models. Set this to the largest recording your providers and network should accept.",
	"tools.media.audio.maxChars": "Default maximum transcript length for configured and auto-detected models. Use a lower value to keep long voice notes from expanding agent context.",
	"tools.media.audio.prompt": "Default audio transcription prompt when a model entry does not override it. Keep the instruction stable when downstream workflows rely on transcript style.",
	"tools.media.audio.timeoutSeconds": "Default timeout for audio understanding requests. Increase it for long recordings or slower local transcription models.",
	"tools.media.audio.language": "Default language hint for audio transcription providers. Set it when the primary spoken language is known and provider detection is unreliable.",
	"tools.media.audio.scope": "Restrict audio understanding by channel, chat type, or source key. Keep this narrow where automatic transcription is sensitive or expensive.",
	"tools.media.audio.attachments": "Choose which matching audio attachments are processed. Use first-only handling unless multi-attachment transcription is intentional.",
	"tools.media.audio.echoTranscript": "Echo the audio transcript to the originating chat before agent processing. Enable this when users need to verify what the system heard.",
	"tools.media.audio.echoFormat": "Format the echoed transcript with a {transcript} placeholder. Keep the placeholder intact so delivery includes the transcript."
};
const MEDIA_AUDIO_FIELD_LABELS = {
	"tools.media.audio.enabled": "Enable Audio Understanding",
	"tools.media.audio.preferredModel": "Preferred Audio Understanding Model",
	"tools.media.audio.maxBytes": "Audio Understanding Max Bytes",
	"tools.media.audio.maxChars": "Audio Understanding Max Chars",
	"tools.media.audio.prompt": "Audio Understanding Prompt",
	"tools.media.audio.timeoutSeconds": "Audio Understanding Timeout (sec)",
	"tools.media.audio.language": "Audio Understanding Language",
	"tools.media.audio.scope": "Audio Understanding Scope",
	"tools.media.audio.attachments": "Audio Understanding Attachment Policy",
	"tools.media.audio.echoTranscript": "Echo Transcript to Chat",
	"tools.media.audio.echoFormat": "Transcript Echo Format"
};
//#endregion
//#region src/config/schema.node-capabilities.ts
const NODE_CAPABILITY_FIELD_HELP = {
	"gateway.nodes.pluginTools": "Controls whether paired nodes may publish agent-visible plugin tool descriptors.",
	"gateway.nodes.pluginTools.enabled": "Accept agent-visible plugin tool descriptors published by paired nodes (default: true). Set false to ignore and remove all node-published plugin tools.",
	"gateway.nodes.allowSkills": "Accept skills published by paired nodes while they are connected (default: true). Set false to ignore node-published skills."
};
const NODE_CAPABILITY_FIELD_LABELS = {
	"gateway.nodes.pluginTools": "Gateway Node Plugin Tools",
	"gateway.nodes.pluginTools.enabled": "Gateway Node Plugin Tools Enabled",
	"gateway.nodes.allowSkills": "Gateway Node Skills Enabled",
	"gateway.nodes.commands.allow": "Gateway Node Allowlist (Extra Commands)"
};
//#endregion
//#region src/config/schema.help.runtime.ts
const RUNTIME_FIELD_HELP = {
	browser: "Browser runtime controls for local or remote CDP attachment, profile routing, and screenshot/snapshot behavior. Keep defaults unless your automation workflow requires custom browser transport settings.",
	"browser.enabled": "Enables browser capability wiring in the gateway so browser tools and CDP-driven workflows can run. Disable when browser automation is not needed to reduce surface area and startup work.",
	"browser.allowSystemProfileImport": "Allows macOS hosts to import cookies from a local Chrome-family system profile into a managed OpenClaw browser profile. Disable this to prevent browser profile cookie import and its macOS Keychain consent prompt.",
	"browser.cdpUrl": "CDP/DevTools endpoint URL used to attach to an externally managed browser instance. Use this for centralized browser hosts, tunnels, or existing-session attachment, and keep URL access restricted to trusted network paths.",
	"browser.executablePath": "Explicit browser executable path when auto-discovery is insufficient for your host environment. Use an absolute stable path, or a path starting with ~ for your OS home directory, so launch behavior stays deterministic across restarts.",
	"browser.headless": "Forces browser launch in headless mode when the local launcher starts browser instances. Keep headless enabled for server environments and disable only when visible UI debugging is required.",
	"browser.noSandbox": "Disables Chromium sandbox isolation flags for environments where sandboxing fails at runtime. Keep this off whenever possible because process isolation protections are reduced.",
	"browser.attachOnly": "Restricts browser mode to attach-only behavior without starting local browser processes. Use this when all browser sessions are externally managed by a remote CDP provider.",
	"browser.defaultProfile": "Default browser profile name selected when callers do not explicitly choose a profile. Use a stable low-privilege profile as the default to reduce accidental cross-context state use.",
	"browser.profiles": "Named browser profile connection map used for explicit routing to CDP ports or URLs with optional metadata. Keep profile names consistent and avoid overlapping endpoint definitions.",
	"browser.profiles.*.cdpPort": "Per-profile local CDP port used when connecting to browser instances by port instead of URL. Use unique ports per profile to avoid connection collisions.",
	"browser.profiles.*.cdpUrl": "Per-profile CDP/DevTools endpoint URL used for explicit browser routing by profile name. Use this for remote CDP hosts, tunnels, or existing-session profiles that should attach through a running Chrome DevTools endpoint.",
	"browser.profiles.*.userDataDir": "Per-profile Chromium user data directory for existing-session attachment through Chrome DevTools MCP. Use this for Brave, Edge, Chromium, or non-default Chrome profiles when the built-in auto-connect path would pick the wrong browser data directory on the selected host or browser node. Paths starting with ~ expand to the OS home directory.",
	"browser.profiles.*.mcpCommand": "Per-profile Chrome DevTools MCP command for existing-session attachment. Defaults to npx.",
	"browser.profiles.*.mcpArgs": "Extra per-profile Chrome DevTools MCP arguments for existing-session attachment, such as --no-usage-statistics. Endpoint arguments here override the built-in auto-connect or browser URL selection.",
	"browser.profiles.*.driver": "Per-profile browser driver mode. Use \"openclaw\" (or legacy \"clawd\") for CDP-based profiles, \"existing-session\" for Chrome DevTools MCP attachment, or \"extension\" for the authenticated Chrome extension relay.",
	"browser.profiles.*.executablePath": "Per-profile browser executable path for locally launched managed browser profiles. Overrides browser.executablePath and accepts paths starting with ~ for the OS home directory.",
	"browser.profiles.*.headless": "Per-profile headless override for locally launched browser instances. Use this when one profile should stay headless without forcing browser.headless for every other profile.",
	"browser.profiles.*.attachOnly": "Per-profile attach-only override that skips local browser launch and only attaches to an existing CDP endpoint. Useful when one profile is externally managed but others are locally launched.",
	"browser.evaluateEnabled": "Enables browser-side evaluate helpers for runtime script evaluation capabilities where supported. Keep disabled unless your workflows require evaluate semantics beyond snapshots/navigation.",
	"browser.snapshotDefaults": "Default snapshot capture configuration used when callers do not provide explicit snapshot options. Tune this for consistent capture behavior across channels and automation paths.",
	"browser.snapshotDefaults.mode": "Default snapshot extraction mode controlling how page content is transformed for agent consumption. Choose the mode that balances readability, fidelity, and token footprint for your workflows.",
	"browser.tabCleanup": "Best-effort cleanup policy for browser tabs opened by primary-agent sessions. Keep enabled to avoid stale sandbox or managed-browser tabs accumulating across long-lived gateways.",
	"browser.tabCleanup.enabled": "Enables cleanup of idle tracked browser tabs for primary-agent sessions. Disable only when external tooling owns tab lifecycle completely.",
	"browser.extensionRelay": "Chrome extension relay authentication compatibility settings. Keep the legacy window only while older paired extensions or external CDP clients still need it.",
	"browser.extensionRelay.allowLegacyAuth": "Temporarily accepts legacy Bearer, Basic, and token-subprotocol relay authentication. Default: true for one migration window. Set false after every extension and external CDP client uses Browser Relay Authentication v2.",
	"browser.ssrfPolicy": "Server-side request forgery guardrail settings for browser/network fetch paths that could reach internal hosts. Keep restrictive defaults in production and open only explicitly approved targets.",
	"browser.ssrfPolicy.dangerouslyAllowPrivateNetwork": "Allows access to private-network address ranges from browser tooling. Default is disabled when unset; enable only for explicitly trusted private-network destinations.",
	"browser.ssrfPolicy.allowedHostnames": "Exact hostnames or IP literals allowed by browser SSRF policy checks. Keep the list minimal.",
	"browser.ssrfPolicy.blockedHostnames": "Hostname patterns denied before DNS and allow rules, even with private-network access enabled. Supports exact hosts and \"*.example.com\" for subdomains only; add \"example.com\" separately to block the apex. Empty or unset adds no denials.",
	"browser.ssrfPolicy.allowRfc2544BenchmarkRange": "Allow RFC 2544 benchmark-range IPs (198.18.0.0/15) for trusted fake-IP proxy environments.",
	"browser.ssrfPolicy.allowIpv6UniqueLocalRange": "Allow IPv6 Unique Local Addresses (fc00::/7) for trusted fake-IP proxy environments.",
	"discovery.mdns.mode": "mDNS broadcast mode (\"minimal\" default, \"full\" includes cliPath/sshPort, \"off\" disables mDNS).",
	discovery: "Service discovery settings for local mDNS advertisement and optional wide-area presence signaling. Keep discovery scoped to expected networks to avoid leaking service metadata.",
	"discovery.wideArea": "Wide-area discovery configuration group for exposing discovery signals beyond local-link scopes. Enable only in deployments that intentionally aggregate gateway presence across sites.",
	"discovery.wideArea.domain": "Optional unicast DNS-SD domain for wide-area discovery, such as openclaw.internal. Use this when you intentionally publish gateway discovery beyond local mDNS scopes.",
	"discovery.mdns": "mDNS discovery configuration group for local network advertisement and discovery behavior tuning. Keep minimal mode for routine LAN discovery unless extra metadata is required.",
	tools: "Tool infrastructure and cross-agent defaults. Root siblings own infrastructure and cross-agent defaults; agents.defaults owns agent-loop behavior; agent entries may override either where supported.",
	"tools.allow": "Absolute tool allowlist that replaces profile-derived defaults for strict environments. Use this only when you intentionally run a tightly curated subset of tool capabilities.",
	"tools.deny": "Global tool denylist that blocks listed tools even when profile or provider rules would allow them. Use deny rules for emergency lockouts and long-term defense-in-depth.",
	"tools.web": "Web-tool policy grouping for search/fetch providers, limits, and fallback behavior tuning. Keep enabled settings aligned with API key availability and outbound networking policy.",
	"tools.exec": "Exec-tool policy grouping for shell execution host, security mode, approval behavior, and runtime bindings. Keep conservative defaults in production and tighten elevated execution paths.",
	"tools.github": "Managed local GitHub CLI profile and optional Git author for agent tools. Omit this object to preserve the Gateway runtime user's native account and author; repository remote credentials are never overridden.",
	"tools.github.profileId": "Opaque generated profile version used to switch managed credentials atomically.",
	"tools.github.kind": "Marks a managed OAuth profile whose rotating refresh credential is owned by the Gateway. Omitted profiles use a personal access token.",
	"tools.github.gitAuthor.name": "Optional process-local Git author and committer name.",
	"tools.github.gitAuthor.email": "Optional process-local Git author and committer email.",
	"agents.entries.*.tools.github": "Complete managed GitHub CLI identity and Git author override for this agent. Omit it to inherit the system identity.",
	"tools.exec.host": "Selects execution target strategy for shell commands. Use \"auto\" for runtime-aware behavior (sandbox when available, otherwise gateway), or pin sandbox/gateway/node explicitly when you need a fixed surface.",
	"tools.exec.mode": "Normalized exec policy selector. Use \"auto\" for classifier-reviewed approval misses, \"ask\" for human-reviewed misses, \"allowlist\" for deterministic safe commands only, or \"full\" for trusted local operation.",
	"tools.exec.reviewer": "Model-backed exec reviewer used by auto mode before human approval fallback. Configure a narrow model override here when you want exec review isolated from the main agent model.",
	"tools.exec.reviewer.model": "Optional provider/model override for the exec reviewer agent. Omit to reuse the configured primary model for the target agent.",
	"tools.exec.reviewer.thinking": "Optional reasoning effort for OpenClaw model-backed approval reviews: minimal, low, medium, high, xhigh, or max. Omit to preserve provider defaults. Supported levels are normalized for the selected model. Does not configure native Codex Guardian.",
	"tools.exec.reviewer.fastMode": "Optional Fast mode for OpenClaw approval reviews: true requests priority processing on supported OpenAI Responses and ChatGPT/OAuth routes; false requests standard processing. Omit to preserve provider defaults. Fast mode may cost more and is subject to provider availability. Does not configure native Codex Guardian.",
	"tools.exec.reviewer.timeoutMs": "Per-stage exec reviewer timeout in milliseconds for model preparation and completion before falling back to human approval (default: 30000).",
	"tools.exec.node": "Node binding configuration for exec tooling when command execution is delegated through connected nodes. Use explicit node binding only when multi-node routing is required.",
	"tools.agentToAgent": "Policy for cross-agent session tool calls: sends, list, history, search, and status reads (default: enabled). Use allow to restrict agent pairs; enabled=false blocks ordinary cross-agent access. Requester-owned native subagent and ACP child sessions stay reachable under tree or all visibility. For strict separation, set tools.sessions.visibility to agent or self (tree still admits requester-owned native/ACP children), or use separate gateways.",
	"tools.agentToAgent.enabled": "Enables cross-agent session tool access (default: true); omitted or empty allow permits every agent pair. Set false to block ordinary cross-agent access; requester-owned native subagent and ACP child sessions stay reachable under tree or all visibility. For strict separation, set tools.sessions.visibility to agent or self (tree still admits requester-owned native/ACP children), or use separate gateways.",
	"tools.agentToAgent.allow": "Agent ids or * patterns that may take part in cross-agent calls; the requesting and target agent must both match. Cross-agent access is on by default, and omitted or empty allow permits every pair. Set an explicit list to restrict access; blank entries deny.",
	"tools.updatePlan": "Unified `progress_card` status tool for durable plans and narrative notes in parent sessions. Enabled by default; set false to opt out. Always unavailable to subagents.",
	"tools.toolSearch": "Compact large OpenClaw, MCP, and client tool catalogs. OpenClaw runtimes use structured Tool Search automatically when unset; engaged Code Mode takes precedence and Codex uses its native search. Set false to disable it, true for the code bridge, or use the object form to choose a mode.",
	"tools.toolSearch.enabled": "Enables Tool Search. When on, OpenClaw hides large tool catalogs behind `tool_search_code` or structured search/describe/call tools during embedded runtime runs.",
	"tools.toolSearch.mode": "Choose the model-facing surface: \"code\" exposes `tool_search_code`; \"tools\" exposes structured search/describe/call fallback tools; \"directory\" keeps a bounded tool directory visible, exposes a bounded set of likely or required schemas, and defers the rest behind search/describe/call.",
	"tools.toolSearch.codeTimeoutMs": "Maximum milliseconds for one `tool_search_code` execution. Runtime clamps values to the supported 1s..60s range.",
	"tools.toolSearch.searchDefaultLimit": "Default number of Tool Search results returned when the model omits a limit. Runtime clamps this to `maxSearchLimit`.",
	"tools.toolSearch.maxSearchLimit": "Maximum number of Tool Search results a model can request. Runtime clamps values to the supported 1..50 range.",
	"tools.codeMode": "Generic OpenClaw Code Mode. When omitted globally, defaults to `\"auto\"`; an authored object without `enabled` remains off. Engaged agent runs expose only `exec` and `wait` to the model and access normal tools through the catalog bridge.",
	"tools.codeMode.enabled": "Global OpenClaw Code Mode activation. A completely absent global setting defaults to `\"auto\"`; an authored object without `enabled` remains off. `\"auto\"` engages catalog-preferred models, while `true` engages tool-capable runs. Agent and model activation overrides take precedence. An engaged run fails closed if the runtime is unavailable instead of exposing the full tool list.",
	"tools.codeMode.executor": "JavaScript executor: \"node\" (default) uses Node vm for trusted code and is not a security sandbox; \"quickjs\" uses the bundled QuickJS WASM plugin for hardened guest execution. Tool permissions apply to both. A missing selected executor fails closed.",
	"tools.codeMode.mode": "Model-facing surface. Only \"only\" is supported: expose code-mode `exec` and `wait` and hide normal tools.",
	"tools.codeMode.timeoutMs": "Maximum milliseconds for one code-mode `exec` or `wait` call.",
	"tools.codeMode.memoryLimitBytes": "QuickJS guest heap limit or best-effort Node worker V8 heap budget in bytes. Node runtime overhead and minimum engine allocations affect the effective budget; external buffers and process RSS are excluded. This is not a security guarantee.",
	"tools.codeMode.maxOutputBytes": "Maximum serialized bytes returned through code-mode output.",
	"tools.codeMode.maxSnapshotBytes": "Maximum serialized bytes retained for one suspended QuickJS snapshot.",
	"tools.codeMode.maxPendingToolCalls": "Maximum concurrent nested tool calls a code-mode VM can start before it must resume later.",
	"tools.codeMode.snapshotTtlSeconds": "How long suspended Code Mode runs can be resumed with `wait` before they expire.",
	"tools.codeMode.searchDefaultLimit": "Default number of hidden catalog search results returned by `catalog.search` inside code mode.",
	"tools.codeMode.maxSearchLimit": "Maximum number of hidden catalog search results a code-mode program can request.",
	"tools.swarm": "Collector-mode subagent orchestration. Enabled by default; set false to opt out. Tool permissions still apply to agents_wait and swarm spawn options.",
	"tools.swarm.enabled": "Enables collector-mode subagents and agents_wait. Default is on; set false to opt out.",
	"tools.swarm.maxConcurrent": "Maximum concurrently running collector children per swarm group.",
	"tools.swarm.maxChildrenPerGroup": "Maximum live collector children per swarm group.",
	"tools.swarm.maxTotalPerGroup": "Maximum lifetime collector spawns per swarm group.",
	"tools.swarm.waitTimeoutSecondsMax": "Maximum timeout accepted by agents_wait, in seconds.",
	"tools.swarm.defaultAgentId": "Default target agent for swarm spawns that omit agentId. The subagent allowlist still applies.",
	"tools.elevated": "Elevated tool access controls for privileged command surfaces that should only be reachable from trusted senders. Keep disabled unless operator workflows explicitly require elevated actions.",
	"tools.elevated.enabled": "Enables elevated tool execution path when sender and policy checks pass. Keep disabled in public/shared channels and enable only for trusted owner-operated contexts.",
	"tools.elevated.allowFrom": "Sender allow rules for elevated tools, usually keyed by channel/provider identity formats. Use narrow, explicit identities so elevated commands cannot be triggered by unintended users.",
	"tools.subagents": "Tool policy wrapper for spawned subagents to restrict or expand tool availability compared to parent defaults. Use this to keep delegated agent capabilities scoped to task intent.",
	"tools.subagents.tools": "Allow/deny tool policy applied to spawned subagent runtimes. Keep this narrower than parent scope. Parent-owned tools such as progress_card are always denied, including through allow/alsoAllow.",
	"tools.sandbox": "Tool policy wrapper for sandboxed agent executions so sandbox runs can have distinct capability boundaries. Use this to enforce stronger safety in sandbox contexts.",
	"tools.sandbox.tools": "Allow/deny tool policy applied when agents run in sandboxed execution environments. Keep policies minimal so sandbox tasks cannot escalate into unnecessary external actions.",
	talk: "Talk-mode voice synthesis settings for voice identity, model selection, output format, and interruption behavior. Use this section to tune human-facing voice UX while controlling latency and cost.",
	"gateway.auth.token": "Shared secret selected by gateway.auth.mode=token, the default for new local onboarding. Clients may send it in either auth.token or auth.password. Non-loopback binds require an enabled authentication mode.",
	"gateway.auth.password": "Shared secret selected by gateway.auth.mode=password. Clients may send it in either auth.token or auth.password. Password mode is required for Tailscale Funnel.",
	"agents.defaults.sandbox.browser.network": "Docker network for sandbox browser containers (default: openclaw-sandbox-browser). Use the dedicated default or a custom bridge network; \"none\" is unsupported because browser control requires published CDP ports.",
	"agents.entries.*.sandbox.browser.network": "Per-agent override for the sandbox browser Docker network. Use a bridge network; \"none\" is unsupported because browser control requires published CDP ports.",
	"agents.defaults.sandbox.docker.dangerouslyAllowContainerNamespaceJoin": "DANGEROUS break-glass override that allows sandbox Docker network mode container:<id>. This joins another container namespace and weakens sandbox isolation.",
	"agents.entries.*.sandbox.docker.dangerouslyAllowContainerNamespaceJoin": "Per-agent DANGEROUS override for container namespace joins in sandbox Docker network mode.",
	"agents.defaults.sandbox.docker.gpus": "Optional Docker GPU passthrough value passed to --gpus, for example \"all\" or \"device=GPU-uuid\". Requires a compatible host runtime such as NVIDIA Container Toolkit.",
	"agents.entries.*.sandbox.docker.gpus": "Per-agent Docker GPU passthrough override for sandbox containers.",
	"agents.defaults.sandbox.browser.cdpSourceRange": "Optional CIDR allowlist for container-edge CDP ingress (for example 172.21.0.1/32).",
	"agents.entries.*.sandbox.browser.cdpSourceRange": "Per-agent override for CDP source CIDR allowlist.",
	"gateway.controlUi.basePath": "Optional URL prefix where the Control UI is served (e.g. /openclaw).",
	"gateway.controlUi.root": "Optional filesystem root for Control UI assets (defaults to dist/control-ui).",
	"gateway.controlUi.experimental": "Opt-in Control UI experiments. These capabilities may change between releases and remain disabled unless explicitly enabled.",
	"gateway.controlUi.experimental.customPlugins": "Allow user-installed plugins to execute native JavaScript in the Control UI (default: false). Bundled plugin views remain available. Custom UI shares the signed-in operator's Gateway permissions; enable only for trusted plugins. Changes apply without a Gateway restart. Reload open Control UI pages to clear previously loaded plugin code.",
	"gateway.controlUi.environment": "Optional public environment identity shown in the Control UI stripe, agent avatar, label pills, browser title, and favicon. Omit it to preserve the default appearance.",
	"gateway.controlUi.environment.label": "Environment label displayed in the Control UI and browser tab; surrounding whitespace is trimmed and the label must contain 1 to 24 characters.",
	"gateway.controlUi.environment.color": "Named environment color ramp: teal, amber, purple, coral, pink, blue, green, red, or gray.",
	"gateway.controlUi.communityInvite": "Show the Discord community invitation in the Control UI served by this Gateway (default on). Set false to hide it for every browser using this UI deployment. Changes apply after browser refresh or reconnect; re-enabling preserves browser-local dismissals.",
	"gateway.controlUi.github.token": "SecretRef-backed service credential for Control UI project discovery and GitHub hover previews without a managed identity. Hover previews prefer the selected agent's configured GitHub identity, inheriting the system identity when there is no override. Prefer explicit configuration for clear service ownership. Omit it to retain the GH_TOKEN/GITHUB_TOKEN fallback from the shared Gateway process environment. An explicitly configured but unavailable credential fails closed.",
	"gateway.controlUi.sessionObserver": "Produce live session status digests for subscribed Control UI clients with each agent's utility model (default on). Set false to disable observer model calls gateway-wide; setting agents.defaults.utilityModel to an empty string disables utility-model observation for agents that do not override it.",
	"gateway.controlUi.embedSandbox": "Iframe sandbox policy for hosted Control UI embeds. \"strict\" disables scripts, \"scripts\" allows interactive embeds while keeping origin isolation (default), and \"trusted\" adds `allow-same-origin` for same-site documents that intentionally need stronger privileges.",
	"gateway.controlUi.allowExternalEmbedUrls": "DANGEROUS toggle that allows hosted embeds to load absolute external http(s) URLs. Keep this off unless your Control UI intentionally embeds trusted third-party pages; hosted /__openclaw__/canvas and /__openclaw__/a2ui documents do not need it.",
	"gateway.controlUi.automaticallyFetchFavicons": "Fetch link favicons and browser-tab social previews through the Gateway (default on). Browser-tab cards load public page metadata and declared images without browser cookies or site credentials. All requests use strict SSRF checks and bounded HTML/image processing. Set false to disable both automatic favicon and page-preview fetches; live browser screenshots are unaffected.",
	"gateway.controlUi.allowedOrigins": "Allowed browser origins for Control UI/WebChat websocket connections (full origins only, e.g. https://control.example.com). Required for non-loopback Control UI deployments unless dangerous Host-header fallback is explicitly enabled. Setting [\"*\"] means allow any browser origin and should be avoided outside tightly controlled local testing.",
	"gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback": "DANGEROUS toggle that enables Host-header based origin fallback for Control UI/WebChat websocket checks. This mode is supported when your deployment intentionally relies on Host-header origin policy; explicit gateway.controlUi.allowedOrigins remains the recommended hardened default.",
	"gateway.portals": "Portal publication and private ingress settings.",
	"gateway.portals.ingress": "Optional operator-managed private HTTPS wildcard reverse proxy. Forward original Host, paths, and WebSocket upgrades to the dedicated loopback listener. Portal bearer authentication remains required. Requires Gateway restart.",
	"gateway.portals.ingress.domain": "Bare DNS domain for random portal subdomains (for example previews.example.net). Configure wildcard DNS and HTTPS privately; do not share the Gateway or Control UI hostname namespace.",
	"gateway.portals.ingress.port": "Dedicated loopback HTTP port receiving the private wildcard HTTPS proxy. Must differ from the Gateway port. This is the backend port, not the public HTTPS port.",
	"gateway.publicOrigin": "Externally reachable HTTPS origin of the Gateway. HTTP is allowed only for localhost, 127.0.0.1, or [::1]. Per-requester MCP OAuth uses it to build the callback URL at /oauth/mcp/callback; channel session links and plugin-generated viewer links use it to reach the Control UI and Gateway routes.",
	"mcp.apps": "MCP Apps UI support. When enabled, configured MCP servers may provide interactive HTML views for their tool results.",
	"mcp.apps.enabled": "Opt-in MCP Apps rendering and app-to-server bridge. Keep disabled unless you trust the configured MCP servers that provide app UI resources.",
	"mcp.apps.sandboxOrigin": "Optional dedicated public HTTP(S) origin for MCP Apps. Use this behind a reverse proxy or TLS terminator and proxy it only to the configured MCP Apps sandbox port. It must differ from the Control UI origin and must not serve authenticated content.",
	"mcp.apps.sandboxPort": "Dedicated MCP Apps sandbox listener port. Defaults to the Gateway port plus one. Set an unused port when another local service or Gateway profile already owns that port.",
	"gateway.push": "Push-delivery settings used by the gateway when it needs to wake or notify paired devices. Configure relay-backed APNs here for official iOS builds; direct APNs auth remains env-based for local/manual builds.",
	"gateway.push.apns": "APNs delivery settings for iOS devices paired to this gateway. Use relay settings for official App Store builds that register through the external push relay.",
	"gateway.push.apns.relay": "External relay settings for relay-backed APNs sends. The gateway uses the hosted OpenClaw relay by default, or this custom relay for push.test, wake nudges, and reconnect wakes after a paired official iOS build publishes a relay-backed registration.",
	"gateway.push.apns.relay.baseUrl": "Optional custom base HTTPS URL for the external APNs relay service used by official App Store iOS builds. Keep this aligned with the relay URL baked into the iOS build so registration and send traffic hit the same deployment.",
	"gateway.push.apns.relay.timeoutMs": "Timeout in milliseconds for relay send requests from the gateway to the APNs relay (default: 10000). Increase for slower relays or networks, or lower to fail wake attempts faster.",
	"gateway.http.endpoints.chatCompletions.enabled": "Enable the OpenAI-compatible `POST /v1/chat/completions` endpoint (default: false).",
	"gateway.http.endpoints.chatCompletions.images": "Image fetch/validation controls for OpenAI-compatible `image_url` parts.",
	"gateway.http.endpoints.chatCompletions.images.allowUrl": "Allow server-side URL fetches for `image_url` parts (default: false; data URIs remain supported). Set this to `false` to disable URL fetching entirely.",
	"gateway.http.endpoints.chatCompletions.images.urlAllowlist": "Optional hostname allowlist for `image_url` URL fetches; supports exact hosts and `*.example.com` wildcards. Empty or omitted lists mean no hostname allowlist restriction.",
	"gateway.http.endpoints.chatCompletions.images.allowedMimes": "Allowed MIME types for `image_url` parts (case-insensitive list).",
	"gateway.http.endpoints.chatCompletions.images.maxBytes": "Max bytes per fetched/decoded `image_url` image (default: 10MB).",
	"gateway.http.endpoints.chatCompletions.images.maxRedirects": "Max HTTP redirects allowed when fetching `image_url` URLs (default: 3).",
	"gateway.http.endpoints.chatCompletions.images.timeoutMs": "Timeout in milliseconds for `image_url` URL fetches (default: 10000).",
	"gateway.reload.mode": "Controls how config edits are applied: \"off\" ignores live edits and \"hybrid\" applies hot-safe changes then restarts when required.",
	"gateway.nodes.browser.mode": "Node browser routing (\"auto\" = prefer the host browser, use a single connected browser node when local capability is unavailable; \"manual\" = require an explicit node selection or configured pin; \"off\" = disable node routing).",
	"gateway.nodes.browser.node": "Pin browser routing to a specific node id or name (optional).",
	"gateway.nodes.pairing": "Node pairing policy settings. SSH-verified auto-approval is enabled by default; CIDR auto-approval stays disabled unless explicit trusted CIDR/IP allowlists are configured.",
	"gateway.nodes.pairing.autoApproveLocal": "Silently approve trusted local pairing and access upgrades (default: true); set false to trade convenience for explicit approval of every device.",
	"gateway.nodes.pairing.autoApproveCidrs": "Opt-in CIDR/IP allowlist for auto-approving first-time node-role device pairing with no requested scopes. Disabled when unset. Operator, browser, Control UI, and any role, scope, metadata, or public-key upgrade pairing still require manual approval.",
	"gateway.nodes.pairing.sshVerify": "SSH-verified auto-approval for first-time node-role device pairing (default: enabled). The gateway SSHes back to the pairing host (BatchMode, strict host keys) and approves only when the remote `openclaw node identity` output matches the pending device key. Set false to disable SSH verification (independent of autoApproveCidrs, which stays active); for manual-only pairing also unset autoApproveCidrs. Pass an object to override user/identity/timeoutMs/cidrs.",
	...NODE_CAPABILITY_FIELD_HELP,
	"gateway.nodes.commands.allow": "Extra node.invoke commands to allow beyond the gateway defaults (array of command strings). Enabling dangerous commands here is a security-sensitive override and is flagged by `openclaw security audit`.",
	"gateway.nodes.commands.deny": "Node command names to block even if present in node claims or default allowlist (exact command-name matching only, e.g. `system.run`; does not inspect shell text inside that command).",
	nodeHost: "Node host controls for features exposed from this gateway node to other nodes or clients. Keep defaults unless you intentionally proxy local capabilities across your node network.",
	"nodeHost.autoUpdate": "Controls automatic updates of the separate runtime for packaged headless node hosts. Checks hourly and waits for all node work to finish before restarting; automatic restarts are at least 12 hours apart.",
	"nodeHost.autoUpdate.enabled": "Enable automatic stable or beta updates for long-running packaged headless nodes (default: true). Set false to opt out. Also disabled by update.checkOnStart=false or OPENCLAW_NO_AUTO_UPDATE=1; source checkouts, native apps, private workers, dev, and extended-stable do not auto-apply.",
	"nodeHost.agentRuns": "Opt in to approval-gated native agent turns on this headless node host. Disabled by default.",
	"nodeHost.agentRuns.claude": "Controls whether this headless node host may advertise Claude CLI agent turns to the gateway.",
	"nodeHost.agentRuns.claude.enabled": "Advertise paired-node Claude session continuation when the local claude binary is available (default: false). Runs still require node exec approval.",
	"nodeHost.workerRuns": "Opt in to full OpenClaw worker session hosting from Gateway-managed bundles. Disabled by default.",
	"nodeHost.workerRuns.enabled": "Allow this paired node to host sessions from exact bundles installed by its Gateway (default: false).",
	"nodeHost.workerRuns.capacity": "Maximum concurrent worker sessions hosted by this node (default: the number of available CPU cores). Must be an integer from 1 through 1024.",
	"nodeHost.workerRuns.isolation": "Select the worker-session process boundary: \"none\" runs directly on the node host (default); \"container\" requires a working Docker-compatible engine and never falls back to host execution.",
	"nodeHost.workerRuns.containerImage": "Optional Node 24.16+ or 26.1+ image for container-isolated workers (default: \"node:24.19.0-slim\"). Use a digest-pinned, private-registry, or preloaded image when needed; missing images are pulled on first use.",
	"nodeHost.browserProxy": "Groups browser-proxy settings for exposing local browser control through node routing. Enable only when remote node workflows need your local browser profiles.",
	"nodeHost.browserProxy.enabled": "Expose the local browser control server through node proxy routing so remote clients can use this host's browser capabilities. Keep disabled unless remote automation explicitly depends on it.",
	"nodeHost.browserProxy.allowProfiles": "Optional allowlist of browser profile names exposed through node proxy routing. Leave empty to preserve the default full profile surface, including profile create/delete routes. When set, OpenClaw enforces least-privilege profile access and blocks persistent profile create/delete through the proxy.",
	"nodeHost.mcp": "Use MCP servers started by the headless node host and published to its paired gateway as agent tools. Restart the node host after changing this section.",
	"nodeHost.mcp.servers": "Named MCP server definitions local to this node. Uses the same server shape as mcp.servers; OAuth servers are not supported by the node host.",
	"nodeHost.skills": "Use this section to publish skills installed in ~/.openclaw/skills from the headless node host. Restart the node host after changing skill files.",
	"nodeHost.skills.enabled": "Scan and publish node-hosted skills after connecting (default: true). Set false to disable node skill publication.",
	attachments: "Top-level retention behavior shared across providers and tools that persist media. Use ttlHours when general staged media needs bounded cleanup.",
	"attachments.ttlHours": "Optional retention window in hours for persisted media handled by the general mtime sweep. Leave unset to disable that sweep, or set values like 24 (1 day) or 168 (7 days) to periodically remove older staged media. Managed outgoing media (chat-generated attachments) is excluded and follows its own SQLite- and transcript-aware retention.",
	bindings: "Top-level binding rules for routing and persistent ACP conversation ownership. Use type=route for normal routing and type=acp for persistent ACP harness bindings.",
	"bindings[].type": "Binding kind. Use \"route\" (or omit for legacy route entries) for normal routing, and \"acp\" for persistent ACP conversation bindings.",
	"bindings[].agentId": "Target agent ID that receives traffic when the corresponding binding match rule is satisfied. Use valid configured agent IDs only so routing does not fail at runtime.",
	"bindings[].session": "Optional route session overrides for conversations matched by this binding. Use this when a narrow route should keep the same agent but isolate session continuity differently.",
	"bindings[].session.dmScope": "Optional DM session scope override for this route binding. For example, keep global session.dmScope=\"main\" while using \"per-account-channel-peer\" for selected direct peers.",
	"bindings[].session.groupScope": "Optional group/channel session scope override for this route binding. \"per-group\" keeps matched rooms separate and ambiently watched by the agent main session regardless of dmScope; \"main\" merges their context into main and needs no watch.",
	"bindings[].match": "Match rule object for deciding when a binding applies, including channel and optional account/peer constraints. Keep rules narrow to avoid accidental agent takeover across contexts.",
	"bindings[].match.channel": "Channel/provider identifier this binding applies to, such as `telegram`, `discord`, or a plugin channel ID. Use the configured channel key exactly so binding evaluation works reliably.",
	"bindings[].match.accountId": "Optional account selector for multi-account channel setups so the binding applies only to one identity. Use this when account scoping is required for the route and leave unset otherwise.",
	"bindings[].match.peer": "Optional peer matcher for specific conversations including peer kind and peer id. Use this when only one direct/group/channel target should be pinned to an agent.",
	"bindings[].match.peer.kind": "Peer conversation type: \"direct\", \"group\", \"channel\", or legacy \"dm\" (deprecated alias for direct). Prefer \"direct\" for new configs and keep kind aligned with channel semantics.",
	"bindings[].match.peer.id": "Conversation identifier used with peer matching, such as a chat ID, channel ID, or group ID from the provider. Keep this exact to avoid silent non-matches.",
	"bindings[].match.guildId": "Optional Discord-style guild/server ID constraint for binding evaluation in multi-server deployments. Use this when the same peer identifiers can appear across different guilds.",
	"bindings[].match.teamId": "Optional team/workspace ID constraint used by providers that scope chats under teams. Add this when you need bindings isolated to one workspace context.",
	"bindings[].match.roles": "Optional role-based filter list used by providers that attach roles to chat context. Use this to route privileged or operational role traffic to specialized agents.",
	"bindings[].acp": "Optional per-binding ACP overrides for bindings[].type=acp. This layer overrides agents.entries.*.runtime.acp defaults for the matched conversation.",
	"bindings[].acp.mode": "ACP session mode override for this binding (persistent or oneshot).",
	"bindings[].acp.label": "Human-friendly label for ACP status/diagnostics in this bound conversation.",
	"bindings[].acp.cwd": "Working directory override for ACP sessions created from this binding.",
	"bindings[].acp.backend": "ACP backend override for this binding (falls back to agent runtime ACP backend, then global acp.backend).",
	broadcast: "Use agent group threads to run several configured agents on one inbound conversation, each in its own session. Channel-qualified entries support bounded follow-up rounds; legacy WhatsApp peer arrays retain single-pass behavior.",
	"broadcast.strategy": "Participant execution order: \"parallel\" (default) runs agents concurrently, while \"sequential\" runs them in configured order. Each round completes before the next begins.",
	"broadcast.*": "Use a channel-qualified peer ID (for example \"telegram:-100123\") to configure an array of agent IDs or a strict object with agents, mentionGating, maxRounds, and maxTurns. Qualified entries take precedence over legacy WhatsApp peer keys and allow at most 16 agents.",
	"broadcast.*.agents": "Participant agent IDs from agents.entries (maximum: 16). Each participant uses its own session for this channel, account, conversation, and thread.",
	"broadcast.*.mentionGating": "Select only explicitly @mentioned participants when any match; otherwise run all participants (default: true). Bare names or emoji do not select participants. Channel allowlists and admission rules still apply.",
	"broadcast.*.maxRounds": "Maximum rounds per inbound message, including the initial round (integer: 1–4, default: 1). Follow-up rounds share bounded, attributed sibling replies and stop when every participant passes.",
	"broadcast.*.maxTurns": "Maximum participant turns per inbound message across all rounds (integer: 1–32, default: agents.length). Slots are reserved before parallel dispatch; this bounds agent turns, not physical message chunks or tool sends. Budgets do not resume after restart.",
	"diagnostics.flags": "Enable targeted diagnostics logs by flag (e.g. [\"telegram.http\"]). Supports wildcards like \"telegram.*\" or \"*\".",
	"diagnostics.enabled": "Master toggle for diagnostics instrumentation output in logs and telemetry wiring paths. Defaults to enabled; set false only in tightly constrained environments.",
	"diagnostics.otel.enabled": "Enables OpenTelemetry export pipeline for traces, metrics, and logs based on configured endpoint/protocol settings. Keep disabled unless your collector endpoint and auth are fully configured.",
	"diagnostics.otel.endpoint": "Collector endpoint URL used for OpenTelemetry export transport, including scheme and port. Use a reachable, trusted collector endpoint and monitor ingestion errors after rollout.",
	"diagnostics.otel.tracesEndpoint": "Signal-specific OTLP/HTTP trace endpoint. When set, this overrides diagnostics.otel.endpoint and OTEL_EXPORTER_OTLP_ENDPOINT for trace export only.",
	"diagnostics.otel.metricsEndpoint": "Signal-specific OTLP/HTTP metrics endpoint. When set, this overrides diagnostics.otel.endpoint and OTEL_EXPORTER_OTLP_ENDPOINT for metrics export only.",
	"diagnostics.otel.logsEndpoint": "Signal-specific OTLP/HTTP logs endpoint. When set, this overrides diagnostics.otel.endpoint and OTEL_EXPORTER_OTLP_ENDPOINT for log export only.",
	"diagnostics.otel.protocol": "OTel transport protocol for telemetry export. Only \"http/protobuf\" is accepted; run \"openclaw doctor --fix\" to repair a persisted legacy \"grpc\" value or get source-specific manual-edit guidance.",
	"diagnostics.otel.headers": "Additional HTTP request headers sent with OpenTelemetry export requests, often used for tenant auth or routing. Keep secrets in env-backed values and avoid unnecessary header sprawl.",
	"diagnostics.otel.serviceName": "Service name reported in telemetry resource attributes to identify this gateway instance in observability backends. Use stable names so dashboards and alerts remain consistent over deployments.",
	"diagnostics.otel.metricNamePrefix": "Replaces the default \"openclaw.\" prefix on OpenClaw-owned metric names. Use an empty string to remove the prefix, or up to 128 ASCII letters, digits, underscores, dots, hyphens, and slashes starting with a letter. Include any separator you need, for example \"acme.\"; standard gen_ai.* metric names are unchanged. Changing this value requires updating dashboards and alerts that query the old names.",
	"diagnostics.otel.traces": "Enable trace signal export to the configured OpenTelemetry collector endpoint. Keep enabled when latency/debug tracing is needed, and disable if you only want metrics/logs.",
	"diagnostics.otel.metrics": "Enable metrics signal export to the configured OpenTelemetry collector endpoint. Keep enabled for runtime health dashboards, and disable only if metric volume must be minimized.",
	"diagnostics.otel.logs": "Enable log signal export through OpenTelemetry in addition to local logging sinks. Use this when centralized log correlation is required across services and agents.",
	"diagnostics.otel.logsExporter": "Log export sink for diagnostics.otel.logs. Use \"otlp\" for the configured OTLP logs endpoint, \"stdout\" for one JSON record per stdout line in container log pipelines, and \"both\" when both sinks are required.",
	"diagnostics.otel.sampleRate": "Trace sampling rate (0-1) controlling how much trace traffic is exported to observability backends. Lower rates reduce overhead/cost, while higher rates improve debugging fidelity.",
	"diagnostics.otel.flushIntervalMs": "Interval in milliseconds for periodic telemetry flush from buffers to the collector. Increase to reduce export chatter, or lower for faster visibility during active incident response.",
	"diagnostics.otel.captureContent": "Opt-in OTEL span content capture. Defaults to off; true captures non-system message and tool content.",
	"diagnostics.cacheTrace.enabled": "Log cache trace snapshots for embedded agent runs (default: false).",
	"tools.exec.applyPatch.enabled": "Enable or disable apply_patch for OpenAI and OpenAI Codex models when allowed by tool policy (default: true).",
	"tools.exec.applyPatch.workspaceOnly": "Restrict apply_patch paths to the workspace directory (default: true). Set false to allow writing outside the workspace (dangerous).",
	"tools.exec.applyPatch.allowModels": "Optional allowlist of model ids (e.g. \"gpt-5.4\" or \"openai/gpt-5.4\").",
	"tools.loopDetection.enabled": "Controls rolling-history tool-loop detection and the post-compaction guard. Omit to keep rolling detection off and post-compaction protection on. Set true to enable both, or false to disable both.",
	"tools.exec.notifyOnExit": "When true (default), backgrounded exec sessions on exit and node exec lifecycle events enqueue a system event and request a heartbeat.",
	"tools.exec.notifyOnExitEmptySuccess": "When true, successful backgrounded exec exits with empty output still enqueue a completion system event (default: false).",
	"tools.exec.pathPrepend": "Directories to prepend to PATH for exec runs (gateway/sandbox).",
	"tools.exec.safeBins": "Allow stdin-only safe binaries to run without explicit allowlist entries.",
	"tools.exec.strictInlineEval": "Require explicit approval for interpreter inline-eval forms such as `python -c`, `node -e`, `ruby -e`, or `osascript -e`. Prevents silent allowlist reuse and downgrades allow-always to ask-each-time for those forms.",
	"tools.exec.commandHighlighting": "Show parser-derived command highlights in exec approval prompts (default: false). Enable this to render highlighted command text without changing exec approval policy.",
	"tools.exec.grantExpiryDays": "Default lifetime, in days (1-3650), for standing grants minted by allow-always on automation approvals. Unset keeps grants valid until revoked or the owning automation changes. Terms freeze at mint, so changing this affects only future grants.",
	"tools.exec.safeBinTrustedDirs": "Additional explicit directories trusted for safe-bin path checks (PATH entries are never auto-trusted).",
	"tools.exec.safeBinProfiles": "Optional per-binary safe-bin profiles (positional limits + allowed/denied flags).",
	"tools.profile": "Global tool profile name used to select a predefined tool policy baseline before applying allow/deny overrides. Use this for consistent environment posture across agents and keep profile names stable.",
	"tools.alsoAllow": "Extra tool allowlist entries merged on top of the selected tool profile and default policy. Keep this list small and explicit so audits can quickly identify intentional policy exceptions.",
	"tools.byProvider": "Per-provider tool allow/deny overrides keyed by channel/provider ID to tailor capabilities by surface. Use this when one provider needs stricter controls than global tool policy.",
	"agents.entries.*.tools.profile": "Per-agent override for tool profile selection when one agent needs a different capability baseline. Use this sparingly so policy differences across agents stay intentional and reviewable.",
	"agents.entries.*.tools.alsoAllow": "Per-agent additive allowlist for tools on top of global and profile policy. Keep narrow to avoid accidental privilege expansion on specialized agents.",
	"agents.entries.*.tools.codeMode": "Per-agent Code Mode options. Explicit enabled overrides the shared model and global activation defaults; an agent-specific model codeMode override wins. Other options merge over tools.codeMode without changing activation.",
	"agents.entries.*.tools.swarm": "Per-agent swarm override. Values merge over the top-level tools.swarm configuration.",
	"agents.entries.*.tools.byProvider": "Per-agent provider-specific tool policy overrides for channel-scoped capability control. Use this when a single agent needs tighter restrictions on one provider than others.",
	"agents.entries.*.tools.message.crossContext.allowWithinProvider": "Per-agent message guard for sending to other conversations on the same provider. Set both this and allowAcrossProviders to false for current-conversation-only public agents.",
	"agents.entries.*.tools.message.crossContext.allowAcrossProviders": "Per-agent override for sending across providers. Inherits the global setting (default: true). Set false to block cross-provider messaging for this agent.",
	"agents.entries.*.tools.message.actions.allow": "Per-agent message action allowlist for the message tool. Set to a minimal list such as [\"send\"] for public sandbox agents so read, edit, delete, reaction, and other provider-specific message actions stay hidden and blocked.",
	"tools.exec.approvalRunningNoticeMs": "Delay in milliseconds before showing an in-progress notice after an exec approval is granted. Increase to reduce flicker for fast commands, or lower for quicker operator feedback.",
	"tools.links.enabled": "Enable automatic link understanding pre-processing so URLs can be summarized before agent reasoning. Keep enabled for richer context, and disable when strict minimal processing is required.",
	"tools.links.maxLinks": "Maximum number of links expanded per turn during link understanding. Use lower values to control latency/cost in chatty threads and higher values when multi-link context is critical.",
	"tools.links.timeoutSeconds": "Per-link understanding timeout budget in seconds before unresolved links are skipped. Keep this bounded to avoid long stalls when external sites are slow or unreachable.",
	"tools.links.models": "Preferred model list for link understanding tasks, evaluated in order as fallbacks when supported. Use lightweight models first for routine summarization and heavier models only when needed.",
	"tools.links.scope": "Controls when link understanding runs relative to conversation context and message type. Keep scope conservative to avoid unnecessary fetches on messages where links are not actionable.",
	"tools.media.models": "Canonical media-understanding model list. Use image, audio, or video capability tags on every entry so each pipeline selects only compatible fallbacks.",
	"tools.media.concurrency": "Maximum number of concurrent media understanding operations per turn across image, audio, and video tasks. Lower this in resource-constrained deployments to prevent CPU/network saturation.",
	"tools.media.image.enabled": "Enable image understanding so attached or referenced images can be interpreted into textual context. Disable if you need text-only operation or want to avoid image-processing cost.",
	"tools.media.image.preferredModel": "Prefer one capability-tagged tools.media.models entry for image understanding before the remaining compatible fallbacks.",
	"tools.media.image.maxBytes": "Default image input size limit for configured and auto-detected models. Set this to match provider payload limits and deployment bandwidth.",
	"tools.media.image.maxChars": "Default maximum image description length. Use a lower value for compact context or a higher value for detailed OCR and scene analysis.",
	"tools.media.image.prompt": "Default image-understanding prompt when an entry does not override it. Keep this deterministic when consumers rely on stable descriptions.",
	"tools.media.image.timeoutSeconds": "Default timeout for image-understanding requests. Increase it for large images or slower local vision models.",
	"tools.media.image.scope": "Restrict image understanding by channel, chat type, or source key. Keep this narrow in busy or untrusted channels to control processing.",
	"tools.media.image.attachments": "Choose which matching image attachments are processed. Use first-only handling unless multi-image analysis is intentional.",
	...MEDIA_AUDIO_FIELD_HELP,
	"tools.media.video.enabled": "Enable video understanding so clips can be summarized into text for downstream reasoning and responses. Disable when processing video is out of policy or too expensive for your deployment.",
	"tools.media.video.preferredModel": "Prefer one capability-tagged tools.media.models entry for video understanding before the remaining compatible fallbacks.",
	"tools.media.video.maxBytes": "Default video input size limit for configured and auto-detected models. Set this to match provider payload limits and deployment bandwidth.",
	"tools.media.video.maxChars": "Default maximum video description length. Use a lower value for compact context or a higher value for detailed scene summaries.",
	"tools.media.video.prompt": "Default video-understanding prompt when an entry does not override it. Keep this deterministic when consumers rely on stable summaries.",
	"tools.media.video.timeoutSeconds": "Default timeout for video-understanding requests. Increase it for longer clips or slower local analysis models.",
	"tools.media.video.scope": "Restrict video understanding by channel, chat type, or source key. Keep this narrow in busy or untrusted channels to control processing.",
	"tools.media.video.attachments": "Choose which matching video attachments are processed. Use first-only handling unless multi-video analysis is intentional.",
	"skills.load.extraDirs": "Additional shared skill roots to scan at lowest precedence. Use this for sibling repos or shared skill packs that should be available without copying them into the OpenClaw workspace.",
	"skills.load.allowSymlinkTargets": "Trusted real target roots that skill symlinks may resolve into when they sit outside their configured source root. Keep this narrow, such as a sibling repo skills directory.",
	"skills.load.watch": "Enable filesystem watching for skill-definition changes so updates can be applied without full process restart. Keep enabled in development workflows and disable in immutable production images.",
	"skills.workshop.autonomous.mode": "Controls background learning: \"off\" keeps only the suggestion nudge, \"propose\" creates pending proposals, and \"auto\" applies captured proposals and runs weekly review of Workshop-owned skills using ordinary file edits. Default: \"auto\".",
	approvals: "Approval routing controls for forwarding exec and plugin approval requests to chat destinations outside the originating session. Keep these disabled unless operators need explicit out-of-band approval visibility.",
	"approvals.exec": "Groups exec-approval forwarding behavior including enablement, routing mode, filters, and explicit targets. Configure here when approval prompts must reach operational channels instead of only the origin thread.",
	"approvals.exec.enabled": "Enables forwarding of exec approval requests to configured delivery destinations (default: false). Keep disabled in low-risk setups and enable only when human approval responders need channel-visible prompts.",
	"approvals.exec.mode": "Controls where approval prompts are sent: \"session\" uses origin chat, \"targets\" uses configured targets, and \"both\" sends to both paths. Use \"session\" as baseline and expand only when operational workflow requires redundancy.",
	"approvals.exec.agentFilter": "Optional allowlist of agent IDs eligible for forwarded approvals, for example `[\"primary\", \"ops-agent\"]`. Use this to limit forwarding blast radius and avoid notifying channels for unrelated agents.",
	"approvals.exec.sessionFilter": "Optional session-key filters matched as substring or regex-style patterns, for example `[\"discord:\", \"^agent:ops:\"]`. Use narrow patterns so only intended approval contexts are forwarded to shared destinations.",
	"approvals.exec.targets": "Explicit delivery targets used when forwarding mode includes targets, each with channel and destination details. Keep target lists least-privilege and validate each destination before enabling broad forwarding.",
	"approvals.exec.targets[].channel": "Channel/provider ID used for forwarded approval delivery, such as discord, slack, or a plugin channel id. Use valid channel IDs only so approvals do not silently fail due to unknown routes.",
	"approvals.exec.targets[].to": "Destination identifier inside the target channel (channel ID, user ID, or thread root depending on provider). Verify semantics per provider because destination format differs across channel integrations.",
	"approvals.exec.targets[].accountId": "Optional account selector for multi-account channel setups when approvals must route through a specific account context. Use this only when the target channel has multiple configured identities.",
	"approvals.exec.targets[].threadId": "Optional thread/topic target for channels that support threaded delivery of forwarded approvals. Use this to keep approval traffic contained in operational threads instead of main channels.",
	"approvals.plugin": "Groups plugin-approval forwarding behavior including enablement, routing mode, filters, and explicit targets. Independent of exec approval forwarding. Configure here when plugin approval prompts must reach operational channels.",
	"approvals.plugin.enabled": "Enables forwarding of plugin approval requests to configured delivery destinations (default: false). Independent of approvals.exec.enabled.",
	"approvals.plugin.mode": "Controls where plugin approval prompts are sent: \"session\" uses origin chat, \"targets\" uses configured targets, and \"both\" sends to both paths.",
	"approvals.plugin.agentFilter": "Optional allowlist of agent IDs eligible for forwarded plugin approvals, for example `[\"primary\", \"ops-agent\"]`. Use this to limit forwarding blast radius.",
	"approvals.plugin.sessionFilter": "Optional session-key filters matched as substring or regex-style patterns, for example `[\"discord:\", \"^agent:ops:\"]`. Use narrow patterns so only intended approval contexts are forwarded.",
	"approvals.plugin.targets": "Explicit delivery targets used when plugin approval forwarding mode includes targets, each with channel and destination details.",
	"approvals.plugin.targets[].channel": "Channel/provider ID used for forwarded plugin approval delivery, such as discord, slack, or a plugin channel id.",
	"approvals.plugin.targets[].to": "Destination identifier inside the target channel (channel ID, user ID, or thread root depending on provider).",
	"approvals.plugin.targets[].accountId": "Optional account selector for multi-account channel setups when plugin approvals must route through a specific account context.",
	"approvals.plugin.targets[].threadId": "Optional thread/topic target for channels that support threaded delivery of forwarded plugin approvals.",
	"tools.fs.workspaceOnly": "Restrict filesystem tools (read/write/edit/apply_patch) to the workspace directory (default: false).",
	"tools.sessions.visibility": "Controls which sessions can be targeted by sessions_list/sessions_history/sessions_search/sessions_send/session_status. (\"all\" default = any session on the Gateway, including other agents and users; \"agent\" = any session in the current agent id; \"self\" = only current; \"tree\" = current session + spawned subagent sessions). Cross-agent access is on by default and scoped by tools.agentToAgent; use narrower visibility to restrict access.",
	"tools.message.crossContext.allowWithinProvider": "Allow sends to other channels within the same provider (default: true).",
	"tools.message.crossContext.allowAcrossProviders": "Allow sends across different providers (default: true). Set false to block cross-provider messaging.",
	"tools.message.crossContext.marker.enabled": "Add a visible origin marker when sending cross-context (default: true).",
	"tools.message.crossContext.marker.prefix": "Text prefix for cross-context markers (supports \"{channel}\").",
	"tools.message.crossContext.marker.suffix": "Text suffix for cross-context markers (supports \"{channel}\").",
	"tools.message.broadcast.enabled": "Enable broadcast action (default: true).",
	"tools.message.actions.allow": "Global message action allowlist for the message tool. Use only when the whole runtime should expose and accept a reduced action set; prefer per-agent allowlists for public or sandboxed agents.",
	"tools.web.search.enabled": "Enable managed web_search and optional Codex-native search for eligible models.",
	"tools.web.search.provider": "Search provider id. Auto-detected from available API keys if omitted.",
	"tools.web.search.maxResults": "Number of results to return (1-10).",
	"tools.web.search.timeoutSeconds": "Timeout in seconds for web_search requests.",
	"tools.web.search.cacheTtlMinutes": "Cache TTL in minutes for web_search results.",
	"tools.web.search.openaiCodex.enabled": "Enable native Codex web search for Codex-capable models.",
	"tools.web.search.openaiCodex.mode": "Native Codex web search preference: \"cached\" (default; unrestricted Codex turns resolve it to live) or \"live\".",
	"tools.web.search.openaiCodex.allowedDomains": "Domain allowlist for native Codex web_search. On native-hosted-search turns, it also gates managed web_fetch; managed-provider turns are unchanged.",
	"tools.web.search.openaiCodex.contextSize": "Native Codex search context size hint: \"low\", \"medium\", or \"high\".",
	"tools.web.search.openaiCodex.userLocation.country": "Approximate country sent to native Codex web search.",
	"tools.web.search.openaiCodex.userLocation.region": "Approximate region/state sent to native Codex web search.",
	"tools.web.search.openaiCodex.userLocation.city": "Approximate city sent to native Codex web search.",
	"tools.web.search.openaiCodex.userLocation.timezone": "Approximate timezone sent to native Codex web search.",
	"tools.web.fetch.enabled": "Enable the web_fetch tool (lightweight HTTP fetch).",
	"tools.web.fetch.maxChars": "Max characters returned by web_fetch (truncated).",
	"tools.web.fetch.maxCharsCap": "Hard cap for web_fetch maxChars (applies to config and tool calls).",
	"tools.web.fetch.maxResponseBytes": "Max download size before truncation.",
	"tools.web.fetch.provider": "Web fetch fallback provider id.",
	"tools.web.fetch.timeoutSeconds": "Timeout in seconds for web_fetch requests.",
	"tools.web.fetch.cacheTtlMinutes": "Cache TTL in minutes for web_fetch results.",
	"tools.web.fetch.maxRedirects": "Maximum redirects allowed for web_fetch (default: 3).",
	"tools.web.fetch.userAgent": "Override User-Agent header for web_fetch requests.",
	"tools.web.fetch.headers": "Extra request headers sent with direct web_fetch requests, for example gateway routing or authentication headers. Every configured value is treated as sensitive and redacted from exposed config and debug captures. Values are plain strings, support ${VAR} substitution and the global $${VAR} literal escape, and are sent to model-chosen URLs. Entries are validated when the request is built rather than at config load, so a bad name or unsendable value is dropped and logged instead of disabling the surface; Accept, Accept-Language, User-Agent, and framing headers such as Transfer-Encoding are dropped too. Use tools.web.fetch.userAgent to change the user agent. Cross-origin redirects retain only the guarded-fetch safe header allowlist, and changing the headers actually sent partitions the fetch cache.",
	"tools.web.fetch.readability": "Use Readability to extract main content from HTML (fallbacks to basic HTML cleanup).",
	"tools.web.fetch.useTrustedEnvProxy": "Route web_fetch through a trusted HTTP(S) env proxy and let the proxy resolve DNS. Enable only when that proxy is operator-controlled and enforces outbound policy after DNS resolution.",
	"tools.web.fetch.ssrfPolicy": "Scoped SSRF policy overrides for web_fetch. Keep this narrow and opt in only for known local-network proxy environments.",
	"tools.web.fetch.ssrfPolicy.dangerouslyAllowPrivateNetwork": "Allows web_fetch access to private and internal network targets. Keep disabled unless model-selected URLs are trusted in this deployment.",
	"tools.web.fetch.ssrfPolicy.allowedHostnames": "Exact hostnames or IP literals allowed for web_fetch, including otherwise blocked targets. Keep the list minimal.",
	"tools.web.fetch.ssrfPolicy.blockedHostnames": "Hostname patterns denied before DNS and allow rules on every web_fetch redirect. Supports exact hosts and \"*.example.com\" for subdomains only; add \"example.com\" separately to block the apex. Empty or unset adds no denials.",
	"tools.web.fetch.ssrfPolicy.allowRfc2544BenchmarkRange": "Allow RFC 2544 benchmark-range IPs (198.18.0.0/15) for fake-IP proxy compatibility such as Clash or Surge.",
	"tools.web.fetch.ssrfPolicy.allowIpv6UniqueLocalRange": "Allow IPv6 Unique Local Addresses (fc00::/7) for trusted fake-IP proxy compatibility such as sing-box, Clash, or Surge."
};
//#endregion
//#region src/config/schema.help.ts
const FIELD_HELP = {
	...CORE_FIELD_HELP,
	...RUNTIME_FIELD_HELP,
	...MODEL_FIELD_HELP,
	...AGENT_FIELD_HELP,
	...AUTOMATION_FIELD_HELP
};
//#endregion
//#region src/config/schema.gateway-labels.ts
const GATEWAY_FIELD_LABELS = {
	gateway: "Gateway",
	"gateway.port": "Gateway Port",
	"gateway.mode": "Gateway Mode",
	"gateway.bind": "Gateway Bind Mode",
	"gateway.customBindHost": "Gateway Custom Bind Host",
	"gateway.portals": "Gateway Portals",
	"gateway.portals.ingress": "Private Portal Ingress",
	"gateway.portals.ingress.domain": "Portal Wildcard Domain",
	"gateway.portals.ingress.port": "Portal Ingress Loopback Port",
	"gateway.publicOrigin": "Gateway Public Origin",
	"gateway.controlUi": "Control UI",
	"gateway.controlUi.enabled": "Control UI Enabled",
	"gateway.cliAgents": "CLI Agents",
	"gateway.cliAgents.enabled": "CLI Agents Enabled",
	"gateway.terminal": "Operator Terminal",
	"gateway.terminal.enabled": "Operator Terminal Enabled",
	"gateway.terminal.shell": "Operator Terminal Shell",
	"gateway.terminal.detachedSessionTimeoutSeconds": "Operator Terminal Detached Session Timeout",
	"gateway.auth": "Gateway Auth",
	"gateway.auth.mode": "Gateway Auth Mode",
	"gateway.auth.allowTailscale": "Gateway Auth Allow Tailscale Identity",
	"gateway.auth.identityScopes": "Gateway Identity Scope Grants",
	"gateway.auth.rateLimit": "Gateway Auth Rate Limit",
	"gateway.auth.trustedProxy": "Gateway Trusted Proxy Auth",
	"gateway.auth.trustedProxy.cloudflareAccessOidc": "Cloudflare Access OIDC GitHub Identity",
	"gateway.auth.trustedProxy.cloudflareAccessOidc.issuer": "Cloudflare Access Issuer",
	"gateway.auth.trustedProxy.cloudflareAccessOidc.providerId": "Cloudflare Access OIDC Provider ID",
	"gateway.auth.trustedProxy.cloudflareAccessOidc.githubAccountIdClaim": "GitHub Account ID Claim",
	"gateway.auth.trustedProxy.deviceAutoApprove": "Trusted Proxy Device Auto-Approval",
	"gateway.auth.trustedProxy.deviceAutoApprove.enabled": "Trusted Proxy Device Auto-Approval Enabled",
	"gateway.auth.trustedProxy.deviceAutoApprove.scopes": "Trusted Proxy Device Auto-Approval Scopes",
	"gateway.roles": "Gateway Operator Roles",
	"gateway.roles.default": "Default Operator Role",
	"gateway.roles.definitions": "Operator Role Definitions",
	"gateway.roles.definitions.*": "Operator Role Definition",
	"gateway.roles.definitions.*.sessions": "Operator Role Session Access",
	"gateway.roles.definitions.*.sessions.others": "Operator Role Access to Other Sessions",
	"gateway.roles.definitions.*.sandbox": "Operator Role Sandbox Isolation",
	"gateway.roles.definitions.*.agents": "Operator Role Allowed Agents",
	"gateway.roles.definitions.*.scopes": "Operator Role Scope Ceiling",
	"gateway.roles.definitions.*.accessPolicyPlugin": "Operator Role Access Policy Plugin",
	"gateway.trustedProxies": "Gateway Trusted Proxy CIDRs",
	"gateway.allowRealIpFallback": "Gateway Allow x-real-ip Fallback",
	"gateway.tools": "Gateway Tool Exposure Policy",
	"gateway.tools.allow": "Gateway Tool Allowlist",
	"gateway.tools.deny": "Gateway Tool Denylist",
	"gateway.tailscale": "Gateway Tailscale",
	"gateway.tailscale.mode": "Gateway Tailscale Mode",
	"gateway.tailscale.preserveFunnel": "Gateway Tailscale External Funnel Migration Guard",
	"gateway.remote": "Remote Gateway",
	"gateway.remote.transport": "Remote Gateway Transport",
	"gateway.reload": "Config Reload",
	"gateway.tls": "Gateway TLS",
	"gateway.tls.enabled": "Gateway TLS Enabled",
	"gateway.tls.autoGenerate": "Gateway TLS Auto-Generate Cert",
	"gateway.tls.certPath": "Gateway TLS Certificate Path",
	"gateway.tls.keyPath": "Gateway TLS Key Path",
	"gateway.tls.caPath": "Gateway TLS CA Path",
	"gateway.http": "Gateway HTTP API",
	"gateway.http.endpoints": "Gateway HTTP Endpoints",
	"gateway.http.securityHeaders": "Gateway HTTP Security Headers",
	"gateway.http.securityHeaders.strictTransportSecurity": "Strict Transport Security Header",
	"gateway.remote.url": "Remote Gateway URL",
	"gateway.remote.sshTarget": "Remote Gateway SSH Target",
	"gateway.remote.sshIdentity": "Remote Gateway SSH Identity",
	"gateway.remote.sshHostKeyPolicy": "Remote Gateway SSH Host-Key Policy",
	"gateway.remote.token": "Remote Gateway Token",
	"gateway.remote.password": "Remote Gateway Password",
	"gateway.remote.edgeAuth": "Remote Gateway Edge Auth Headers",
	"gateway.remote.tlsFingerprint": "Remote Gateway TLS Fingerprint",
	"gateway.auth.token": "Gateway Token",
	"gateway.auth.password": "Gateway Password"
};
//#endregion
//#region src/config/schema.labels.agent-models.ts
const AGENT_MODEL_FIELD_LABELS = {
	"agents.defaults.models": "Models",
	"agents.defaults.modelSelectionScope": "Model Selection Scope",
	"agents.defaults.modelPolicy": "Model Policy",
	"agents.defaults.modelPolicy.allow": "Allowed Models",
	"agents.defaults.models.*.agentRuntime": "Default Agent Model Runtime",
	"agents.defaults.models.*.agentRuntime.id": "Default Agent Model Runtime ID",
	"agents.defaults.models.*.codeMode": "Code Mode",
	"agents.defaults.model.primary": "Primary Model",
	"agents.defaults.model.fallbacks": "Model Fallbacks",
	"agents.defaults.embeddedAgent.cyberFailover": "Cyber Policy Failover",
	"agents.defaults.embeddedAgent.cyberFailover.mode": "Cyber Policy Failover Mode",
	"agents.defaults.embeddedAgent.cyberFailover.model": "Cyber Policy Failover Model",
	"agents.defaults.embeddedAgent.cyberFailover.cooloffMs": "Cyber Policy Failover Cooloff",
	"agents.defaults.utilityModel": "Utility Model",
	"agents.entries.*.utilityModel": "Agent Utility Model",
	"agents.defaults.decisionModel": "Decision Model",
	"agents.entries.*.decisionModel": "Agent Decision Model",
	"agents.defaults.imageModel.primary": "Image Model",
	"agents.defaults.imageModel.fallbacks": "Image Model Fallbacks",
	"agents.defaults.mediaModels.image.primary": "Image Generation Model",
	"agents.defaults.mediaModels.image.fallbacks": "Image Generation Model Fallbacks",
	"agents.defaults.mediaModels.image.timeoutMs": "Image Generation Timeout (ms)",
	"agents.defaults.mediaModels.video.primary": "Video Generation Model",
	"agents.defaults.mediaModels.video.fallbacks": "Video Generation Model Fallbacks",
	"agents.defaults.mediaModels.video.timeoutMs": "Video Generation Timeout (ms)",
	"agents.defaults.mediaModels.music.primary": "Music Generation Model",
	"agents.defaults.mediaModels.music.fallbacks": "Music Generation Model Fallbacks",
	"agents.defaults.voiceModel.primary": "Voice Model",
	"agents.defaults.voiceModel.fallbacks": "Voice Model Fallbacks",
	"agents.defaults.voiceModel.timeoutMs": "Voice Timeout (ms)",
	"agents.defaults.pdfModel.primary": "PDF Model",
	"agents.defaults.pdfModel.fallbacks": "PDF Model Fallbacks",
	"agents.defaults.pdfMaxMb": "PDF Max Size (MB)",
	"agents.defaults.pdfMaxPages": "PDF Max Pages",
	"agents.defaults.imageMaxDimensionPx": "Image Max Dimension (px)",
	"agents.defaults.imageQuality": "Image Quality"
};
//#endregion
//#region src/config/schema.labels.session.ts
const SESSION_FIELD_LABELS = {
	session: "Session",
	"session.scope": "Session Scope",
	"session.dmScope": "DM Session Scope",
	"session.groupScope": "Group Session Scope",
	"session.notifyOnCreate": "Notify Home on Session Creation",
	"session.identityLinks": "Session Identity Links",
	"session.resetTriggers": "Session Reset Triggers",
	"session.reset": "Session Reset Policy",
	"session.reset.mode": "Session Reset Mode",
	"session.reset.atHour": "Session Daily Reset Hour",
	"session.reset.idleMinutes": "Session Reset Idle Minutes",
	"session.resetByType": "Session Reset by Chat Type",
	"session.resetByType.direct": "Session Reset (Direct)",
	"session.resetByType.group": "Session Reset (Group)",
	"session.resetByType.thread": "Session Reset (Thread)",
	"session.resetByChannel": "Session Reset by Channel",
	"session.store": "Session Store Path",
	"session.mainKey": "Session Main Key",
	"session.sendPolicy": "Session Send Policy",
	"session.sendPolicy.default": "Session Send Policy Default Action",
	"session.sendPolicy.rules": "Session Send Policy Rules",
	"session.sendPolicy.rules[].action": "Session Send Rule Action",
	"session.sendPolicy.rules[].match": "Session Send Rule Match",
	"session.sendPolicy.rules[].match.channel": "Session Send Rule Channel",
	"session.sendPolicy.rules[].match.chatType": "Session Send Rule Chat Type",
	"session.sendPolicy.rules[].match.keyPrefix": "Session Send Rule Key Prefix",
	"session.sendPolicy.rules[].match.rawKeyPrefix": "Session Send Rule Raw Key Prefix",
	"session.threadBindings": "Session Thread Bindings",
	"session.threadBindings.enabled": "Thread Binding Enabled",
	"session.threadBindings.idleHours": "Thread Binding Idle Timeout (hours)",
	"session.threadBindings.maxAgeHours": "Thread Binding Max Age (hours)",
	"session.threadBindings.spawnSessions": "Thread-Bound Session Spawns",
	"session.threadBindings.defaultSpawnContext": "Thread Spawn Context",
	"session.sharing": "Session Sharing Modes",
	"session.sharing.readOnly": "Allow Read-only Sessions",
	"session.sharing.suggest": "Allow Suggest Sessions",
	"session.sharing.drafts": "Allow Draft Sessions",
	"session.maintenance": "Session Maintenance",
	"session.maintenance.coldStorage": "Transcript Cold Storage",
	"session.maintenance.coldStorage.enabled": "Automatically Archive Old Transcripts",
	"session.maintenance.coldStorage.afterDays": "Archive After Inactive Days",
	"session.maintenance.mode": "Session Maintenance Mode",
	"session.maintenance.pruneAfter": "Session Prune After",
	"session.maintenance.archiveDashboardAfter": "Archive Inactive Dashboard Sessions After",
	"session.maintenance.maxEntries": "Session Max Entries",
	"session.maintenance.preserveRecent": "Preserve Recent Sessions",
	"session.maintenance.resetArchiveRetention": "Session Reset Archive Retention",
	"session.maintenance.maxDiskBytes": "Session Max Disk Budget",
	"session.maintenance.highWaterBytes": "Session Disk High-water Target"
};
//#endregion
//#region src/config/schema.labels.workspace.ts
const WORKSPACE_FIELD_LABELS = {
	"agents.defaults.workspace": "Workspace",
	"agents.defaults.cwd": "Working Directory",
	"agents.defaults.repoRoot": "Repo Root",
	"agents.defaults.skipBootstrap": "Skip Workspace Bootstrap Creation",
	"agents.defaults.skipOptionalBootstrapFiles": "Skipped Optional Bootstrap Files",
	"agents.defaults.contextInjection": "Context Injection",
	"agents.defaults.bootstrapMaxChars": "Bootstrap Max Chars",
	"agents.defaults.bootstrapTotalMaxChars": "Bootstrap Total Max Chars"
};
//#endregion
//#region src/config/schema.labels.ts
const FIELD_LABELS = {
	worktreeRoot: "Worktree Root",
	worktreeAcceleration: "Worktree Acceleration",
	"channels.discord.activities": "Discord Activities",
	"channels.discord.activities.clientSecret": "Discord Activities Client Secret",
	"channels.discord.activities.applicationId": "Discord Activities Application ID",
	...META_FIELD_LABELS,
	env: "Environment",
	"env.shellEnv": "Shell Environment Import",
	"env.shellEnv.enabled": "Shell Environment Import Enabled",
	"env.shellEnv.timeoutMs": "Shell Environment Import Timeout (ms)",
	"env.vars": "Environment Variable Overrides",
	secrets: "Secrets",
	"secrets.egressProxy": "Secret Egress Proxy",
	"secrets.egressProxy.enabled": "Secret Egress Proxy Enabled",
	"secrets.egressProxy.allowedHosts": "Secret Egress Proxy Allowed Hosts",
	"secrets.egressProxy.bypassHosts": "Secret Egress Proxy Bypass Hosts",
	wizard: "Setup Preferences",
	"wizard.accessMode": "Setup Discovery Access",
	"wizard.appRecommendations": "Setup App Recommendations",
	"wizard.lastRunAt": "Wizard Last Run Timestamp",
	"wizard.lastRunVersion": "Wizard Last Run Version",
	"wizard.lastRunCommit": "Wizard Last Run Commit",
	"wizard.lastRunCommand": "Wizard Last Run Command",
	"wizard.lastRunMode": "Wizard Last Run Mode",
	"wizard.securityAcknowledgedAt": "Wizard Security Acknowledgement Timestamp",
	"logging.audit": "Audit Ledger",
	"logging.audit.enabled": "Audit Ledger Enabled",
	"logging.audit.executionIdentity": "Execution Identity Audit",
	"logging.audit.messages": "Message Audit Scope",
	diagnostics: "Diagnostics",
	"diagnostics.otel": "OpenTelemetry",
	"diagnostics.cacheTrace": "Cache Trace",
	logging: "Logging",
	"logging.level": "Log Level",
	"logging.file": "Log File Path",
	"logging.consoleLevel": "Console Log Level",
	"logging.consoleStyle": "Console Log Style",
	"logging.redactPatterns": "Custom Redaction Patterns",
	update: "Updates",
	"update.channel": "Update Channel",
	"update.checkOnStart": "Update Check on Start",
	"update.auto.enabled": "Auto Update Enabled",
	telemetry: "Telemetry",
	...TELEMETRY_FIELD_LABELS,
	surfaces: "Surface Policies",
	"surfaces.*.silentReply": "Surface Silent Reply Policy",
	"diagnostics.enabled": "Diagnostics Enabled",
	"diagnostics.flags": "Diagnostics Flags",
	"diagnostics.otel.enabled": "OpenTelemetry Enabled",
	"diagnostics.otel.endpoint": "OpenTelemetry Endpoint",
	"diagnostics.otel.tracesEndpoint": "OpenTelemetry Traces Endpoint",
	"diagnostics.otel.metricsEndpoint": "OpenTelemetry Metrics Endpoint",
	"diagnostics.otel.logsEndpoint": "OpenTelemetry Logs Endpoint",
	"diagnostics.otel.protocol": "OpenTelemetry Protocol",
	"diagnostics.otel.headers": "OpenTelemetry Headers",
	"diagnostics.otel.serviceName": "OpenTelemetry Service Name",
	"diagnostics.otel.metricNamePrefix": "OpenTelemetry Metric Name Prefix",
	"diagnostics.otel.traces": "OpenTelemetry Traces Enabled",
	"diagnostics.otel.metrics": "OpenTelemetry Metrics Enabled",
	"diagnostics.otel.logs": "OpenTelemetry Logs Enabled",
	"diagnostics.otel.logsExporter": "OpenTelemetry Logs Exporter",
	"diagnostics.otel.sampleRate": "OpenTelemetry Trace Sample Rate",
	"diagnostics.otel.flushIntervalMs": "OpenTelemetry Flush Interval (ms)",
	"diagnostics.otel.captureContent": "OpenTelemetry Content Capture",
	"diagnostics.cacheTrace.enabled": "Cache Trace Enabled",
	"agents.entries.*.identity.avatar": "Identity Avatar",
	"agents.entries.*.skills": "Agent Skill Filter",
	"agents.entries.*.cwd": "Agent Working Directory",
	"agents.entries.*.runtime": "Agent Runtime",
	"agents.entries.*.runtime.type": "Agent Runtime Type",
	"agents.entries.*.runtime.acp": "Agent ACP Runtime",
	"agents.entries.*.runtime.acp.agent": "Agent ACP Harness Agent",
	"agents.entries.*.runtime.acp.backend": "Agent ACP Backend",
	"agents.entries.*.runtime.acp.mode": "Agent ACP Mode",
	"agents.entries.*.runtime.acp.cwd": "Agent ACP Working Directory",
	"agents.entries.*.thinkingDefault": "Agent Thinking Default",
	"agents.entries.*.reasoningDefault": "Agent Reasoning Default",
	"agents.entries.*.fastModeDefault": "Agent Fast Mode Default",
	"agents.defaults.fastModeDefault": "Default Agent Fast Mode",
	"agents.entries.*.contextInjection": "Agent Context Injection",
	"agents.entries.*.bootstrapMaxChars": "Agent Bootstrap Max Chars",
	"agents.entries.*.bootstrapTotalMaxChars": "Agent Bootstrap Total Max Chars",
	"agents.entries.*.experimental": "Agent Experimental Flags",
	"agents.entries.*.experimental.localModelLean": "Agent Lean Local Model Mode",
	agents: "Agents",
	"agents.ownership": "Agent Ownership Generation",
	"agents.defaults": "Agent Defaults",
	"agents.defaults.contextLimits": "Default Context Limits",
	"agents.defaults.contextLimits.memoryGetMaxChars": "Default memory_get Max Chars",
	"agents.defaults.contextLimits.postCompactionMaxChars": "Default Post-compaction Max Chars",
	"agents.entries": "Agent List",
	"agents.entries.*.skillsLimits": "Agent Skills Limits",
	"agents.entries.*.skillsLimits.maxSkillsPromptChars": "Agent Skills Prompt Max Chars",
	"agents.entries.*.contextLimits": "Agent Context Limits",
	"agents.entries.*.contextLimits.memoryGetMaxChars": "Agent memory_get Max Chars",
	"agents.entries.*.contextLimits.postCompactionMaxChars": "Agent Post-compaction Max Chars",
	"agents.entries.*.models": "Agent Model Overrides",
	"agents.entries.*.modelPolicy": "Agent Model Policy",
	"agents.entries.*.modelPolicy.allow": "Allowed Agent Models",
	"agents.entries.*.models.*.agentRuntime": "Agent Model Runtime",
	"agents.entries.*.models.*.agentRuntime.id": "Agent Model Runtime ID",
	"agents.entries.*.models.*.codeMode": "Code Mode",
	"agents.entries.*.agentRuntime": "Legacy Agent Runtime",
	"agents.entries.*.agentRuntime.id": "Legacy Agent Runtime ID",
	cloudWorkers: "Cloud Workers",
	...CLOUD_WORKER_FIELD_LABELS,
	...DESKTOP_FIELD_LABELS,
	...GATEWAY_FIELD_LABELS,
	browser: "Browser",
	"browser.enabled": "Browser Enabled",
	"browser.allowSystemProfileImport": "Allow System Profile Import",
	"browser.cdpUrl": "Browser CDP URL",
	"browser.executablePath": "Browser Executable Path",
	"browser.headless": "Browser Headless Mode",
	"browser.noSandbox": "Browser No-Sandbox Mode",
	"browser.attachOnly": "Browser Attach-only Mode",
	"browser.defaultProfile": "Browser Default Profile",
	"browser.profiles": "Browser Profiles",
	"browser.profiles.*.cdpPort": "Browser Profile CDP Port",
	"browser.profiles.*.cdpUrl": "Browser Profile CDP URL",
	"browser.profiles.*.userDataDir": "Browser Profile User Data Dir",
	"browser.profiles.*.mcpCommand": "Browser Profile Chrome MCP Command",
	"browser.profiles.*.mcpArgs": "Browser Profile Chrome MCP Args",
	"browser.profiles.*.driver": "Browser Profile Driver",
	"browser.profiles.*.executablePath": "Browser Profile Executable Path",
	"browser.profiles.*.headless": "Browser Profile Headless Mode",
	"browser.profiles.*.attachOnly": "Browser Profile Attach-only Mode",
	"browser.extensionRelay": "Browser Extension Relay",
	"browser.extensionRelay.allowLegacyAuth": "Allow Legacy Browser Relay Auth",
	tools: "Tools",
	"tools.allow": "Tool Allowlist",
	"tools.deny": "Tool Denylist",
	"tools.web": "Web Tools",
	"tools.exec": "Exec Tool",
	"tools.github": "GitHub CLI Identity and Git Author",
	"tools.github.profileId": "GitHub Profile Version",
	"tools.github.kind": "GitHub Credential Kind",
	"tools.github.gitAuthor.name": "Git Author Name",
	"tools.github.gitAuthor.email": "Git Author Email",
	"agents.entries.*.tools.github": "Agent GitHub CLI Identity Override",
	"agents.entries.*.tools.github.profileId": "Agent GitHub Profile Version",
	"agents.entries.*.tools.github.kind": "Agent GitHub Credential Kind",
	"agents.entries.*.tools.github.gitAuthor.name": "Agent Git Author Name",
	"agents.entries.*.tools.github.gitAuthor.email": "Agent Git Author Email",
	"tools.media.image.enabled": "Enable Image Understanding",
	"tools.media.image.preferredModel": "Preferred Image Understanding Model",
	"tools.media.image.maxBytes": "Image Understanding Max Bytes",
	"tools.media.image.maxChars": "Image Understanding Max Chars",
	"tools.media.image.prompt": "Image Understanding Prompt",
	"tools.media.image.timeoutSeconds": "Image Understanding Timeout (sec)",
	"tools.media.image.scope": "Image Understanding Scope",
	"tools.media.image.attachments": "Image Understanding Attachment Policy",
	"tools.media.models": "Media Understanding Shared Models",
	"tools.media.concurrency": "Media Understanding Concurrency",
	...MEDIA_AUDIO_FIELD_LABELS,
	"tools.media.video.enabled": "Enable Video Understanding",
	"tools.media.video.preferredModel": "Preferred Video Understanding Model",
	"tools.media.video.maxBytes": "Video Understanding Max Bytes",
	"tools.media.video.maxChars": "Video Understanding Max Chars",
	"tools.media.video.prompt": "Video Understanding Prompt",
	"tools.media.video.timeoutSeconds": "Video Understanding Timeout (sec)",
	"tools.media.video.scope": "Video Understanding Scope",
	"tools.media.video.attachments": "Video Understanding Attachment Policy",
	"tools.links.enabled": "Enable Link Understanding",
	"tools.links.maxLinks": "Link Understanding Max Links",
	"tools.links.timeoutSeconds": "Link Understanding Timeout (sec)",
	"tools.links.models": "Link Understanding Models",
	"tools.links.scope": "Link Understanding Scope",
	"tools.profile": "Tool Profile",
	"tools.alsoAllow": "Tool Allowlist Additions",
	"agents.entries.*.tools.profile": "Agent Tool Profile",
	"agents.entries.*.tools.alsoAllow": "Agent Tool Allowlist Additions",
	"agents.entries.*.tools.codeMode": "Agent Code Mode",
	"agents.entries.*.tools.swarm": "Agent Swarm",
	"tools.byProvider": "Tool Policy by Provider",
	"agents.entries.*.tools.byProvider": "Agent Tool Policy by Provider",
	"agents.entries.*.tools.message.crossContext.allowWithinProvider": "Agent Cross-Context Messaging (Same Provider)",
	"agents.entries.*.tools.message.crossContext.allowAcrossProviders": "Agent Cross-Context Messaging (Across Providers)",
	"agents.entries.*.tools.message.actions.allow": "Agent Message Action Allowlist",
	"tools.exec.applyPatch.enabled": "Enable apply_patch",
	"tools.exec.applyPatch.workspaceOnly": "apply_patch Workspace-Only",
	"tools.exec.applyPatch.allowModels": "apply_patch Model Allowlist",
	"tools.loopDetection.enabled": "Tool-loop Detection",
	"tools.fs.workspaceOnly": "Workspace-only FS tools",
	"tools.sessions.visibility": "Session Tools Visibility",
	"tools.exec.notifyOnExit": "Exec Notify On Exit",
	"tools.exec.notifyOnExitEmptySuccess": "Exec Notify On Empty Success",
	"tools.exec.approvalRunningNoticeMs": "Exec Approval Running Notice (ms)",
	"tools.exec.host": "Exec Target",
	"tools.exec.mode": "Exec Mode",
	"tools.exec.security": "Exec Security",
	"tools.exec.ask": "Exec Ask",
	"tools.exec.reviewer": "Exec Reviewer",
	"tools.exec.reviewer.model": "Exec Reviewer Model",
	"tools.exec.reviewer.thinking": "Exec Reviewer Thinking",
	"tools.exec.reviewer.fastMode": "Exec Reviewer Fast Mode",
	"tools.exec.reviewer.timeoutMs": "Exec Reviewer Timeout (ms)",
	"tools.exec.node": "Exec Node Binding",
	"tools.agentToAgent": "Agent-to-Agent Tool Access",
	"tools.agentToAgent.enabled": "Enable Agent-to-Agent Tool",
	"tools.agentToAgent.allow": "Agent-to-Agent Target Allowlist",
	"tools.updatePlan": "Enable Structured Plan Tool",
	"tools.toolSearch": "Tool Search",
	"tools.toolSearch.enabled": "Enable Tool Search",
	"tools.toolSearch.mode": "Tool Search Surface",
	"tools.toolSearch.codeTimeoutMs": "Tool Search Code Timeout",
	"tools.toolSearch.searchDefaultLimit": "Tool Search Default Results",
	"tools.toolSearch.maxSearchLimit": "Tool Search Max Results",
	"tools.codeMode": "Code Mode",
	"tools.codeMode.enabled": "Enable Code Mode",
	"tools.codeMode.executor": "Code Mode Executor",
	"tools.codeMode.mode": "Code Mode Surface",
	"tools.codeMode.timeoutMs": "Code Mode Timeout",
	"tools.codeMode.memoryLimitBytes": "Code Mode Memory Limit",
	"tools.codeMode.maxOutputBytes": "Code Mode Output Limit",
	"tools.codeMode.maxSnapshotBytes": "Code Mode Snapshot Limit",
	"tools.codeMode.maxPendingToolCalls": "Code Mode Pending Tool Limit",
	"tools.codeMode.snapshotTtlSeconds": "Code Mode Snapshot TTL",
	"tools.codeMode.searchDefaultLimit": "Code Mode Default Search Results",
	"tools.codeMode.maxSearchLimit": "Code Mode Max Search Results",
	"tools.swarm": "Swarm",
	"tools.swarm.enabled": "Enable Swarm",
	"tools.swarm.maxConcurrent": "Swarm Concurrent Children",
	"tools.swarm.maxChildrenPerGroup": "Swarm Live Children per Group",
	"tools.swarm.maxTotalPerGroup": "Swarm Total Children per Group",
	"tools.swarm.waitTimeoutSecondsMax": "Swarm Maximum Wait Timeout",
	"tools.swarm.defaultAgentId": "Swarm Default Agent",
	"tools.elevated": "Elevated Tool Access",
	"tools.elevated.enabled": "Enable Elevated Tool Access",
	"tools.elevated.allowFrom": "Elevated Tool Allow Rules",
	"tools.subagents": "Subagent Tool Policy",
	"tools.subagents.tools": "Subagent Tool Allow/Deny Policy",
	"tools.sandbox": "Sandbox Tool Policy",
	"tools.sandbox.tools": "Sandbox Tool Allow/Deny Policy",
	"tools.exec.pathPrepend": "Exec PATH Prepend",
	"tools.exec.safeBins": "Exec Safe Bins",
	"tools.exec.strictInlineEval": "Require Inline-Eval Approval",
	"tools.exec.commandHighlighting": "Exec Command Highlighting",
	"tools.exec.grantExpiryDays": "Standing Grant Expiry (Days)",
	"tools.exec.safeBinTrustedDirs": "Exec Safe Bin Trusted Dirs",
	"tools.exec.safeBinProfiles": "Exec Safe Bin Profiles",
	approvals: "Approvals",
	"approvals.exec": "Exec Approval Forwarding",
	"approvals.exec.enabled": "Forward Exec Approvals",
	"approvals.exec.mode": "Approval Forwarding Mode",
	"approvals.exec.agentFilter": "Approval Agent Filter",
	"approvals.exec.sessionFilter": "Approval Session Filter",
	"approvals.exec.targets": "Approval Forwarding Targets",
	"approvals.exec.targets[].channel": "Approval Target Channel",
	"approvals.exec.targets[].to": "Approval Target Destination",
	"approvals.exec.targets[].accountId": "Approval Target Account ID",
	"approvals.exec.targets[].threadId": "Approval Target Thread ID",
	"approvals.plugin": "Plugin Approval Forwarding",
	"approvals.plugin.enabled": "Forward Plugin Approvals",
	"approvals.plugin.mode": "Plugin Approval Forwarding Mode",
	"approvals.plugin.agentFilter": "Plugin Approval Agent Filter",
	"approvals.plugin.sessionFilter": "Plugin Approval Session Filter",
	"approvals.plugin.targets": "Plugin Approval Forwarding Targets",
	"approvals.plugin.targets[].channel": "Plugin Approval Target Channel",
	"approvals.plugin.targets[].to": "Plugin Approval Target Destination",
	"approvals.plugin.targets[].accountId": "Plugin Approval Target Account ID",
	"approvals.plugin.targets[].threadId": "Plugin Approval Target Thread ID",
	"tools.message.crossContext.allowWithinProvider": "Allow Cross-Context (Same Provider)",
	"tools.message.crossContext.allowAcrossProviders": "Allow Cross-Context (Across Providers)",
	"tools.message.crossContext.marker.enabled": "Cross-Context Marker",
	"tools.message.crossContext.marker.prefix": "Cross-Context Marker Prefix",
	"tools.message.crossContext.marker.suffix": "Cross-Context Marker Suffix",
	"tools.message.broadcast.enabled": "Enable Message Broadcast",
	"tools.message.actions.allow": "Message Action Allowlist",
	"tools.web.search.enabled": "Enable Web Search Tool",
	"tools.web.search.provider": "Web Search Provider",
	"tools.web.search.maxResults": "Web Search Max Results",
	"tools.web.search.timeoutSeconds": "Web Search Timeout (sec)",
	"tools.web.search.cacheTtlMinutes": "Web Search Cache TTL (min)",
	"tools.web.search.openaiCodex.enabled": "Enable Native Codex Web Search",
	"tools.web.search.openaiCodex.mode": "Codex Web Search Mode",
	"tools.web.search.openaiCodex.allowedDomains": "Codex Allowed Domains",
	"tools.web.search.openaiCodex.contextSize": "Codex Search Context Size",
	"tools.web.search.openaiCodex.userLocation.country": "Codex User Country",
	"tools.web.search.openaiCodex.userLocation.region": "Codex User Region",
	"tools.web.search.openaiCodex.userLocation.city": "Codex User City",
	"tools.web.search.openaiCodex.userLocation.timezone": "Codex User Timezone",
	"tools.web.fetch.enabled": "Enable Web Fetch Tool",
	"tools.web.fetch.maxChars": "Web Fetch Max Chars",
	"tools.web.fetch.maxCharsCap": "Web Fetch Hard Max Chars",
	"tools.web.fetch.maxResponseBytes": "Web Fetch Max Download Size (bytes)",
	"tools.web.fetch.provider": "Web Fetch Provider",
	"tools.web.fetch.timeoutSeconds": "Web Fetch Timeout (sec)",
	"tools.web.fetch.cacheTtlMinutes": "Web Fetch Cache TTL (min)",
	"tools.web.fetch.maxRedirects": "Web Fetch Max Redirects",
	"tools.web.fetch.userAgent": "Web Fetch User-Agent",
	"tools.web.fetch.headers": "Web Fetch Request Headers",
	"tools.web.fetch.readability": "Web Fetch Readability Extraction",
	"tools.web.fetch.useTrustedEnvProxy": "Web Fetch Trusted Env Proxy",
	"tools.web.fetch.ssrfPolicy": "Web Fetch SSRF Policy",
	"tools.web.fetch.ssrfPolicy.dangerouslyAllowPrivateNetwork": "Web Fetch Dangerously Allow Private Network",
	"tools.web.fetch.ssrfPolicy.allowedHostnames": "Web Fetch Allowed Hostnames",
	"tools.web.fetch.ssrfPolicy.blockedHostnames": "Web Fetch Blocked Hostnames",
	"tools.web.fetch.ssrfPolicy.allowRfc2544BenchmarkRange": "Web Fetch Allow RFC 2544 Benchmark Range",
	"tools.web.fetch.ssrfPolicy.allowIpv6UniqueLocalRange": "Web Fetch Allow IPv6 Unique Local Range",
	"gateway.controlUi.basePath": "Control UI Base Path",
	"gateway.controlUi.experimental": "Experimental Control UI Features",
	"gateway.controlUi.experimental.customPlugins": "Custom Plugin UI",
	"gateway.controlUi.environment": "Control UI Environment",
	"gateway.controlUi.environment.label": "Control UI Environment Label",
	"gateway.controlUi.environment.color": "Control UI Environment Color",
	"gateway.controlUi.communityInvite": "Control UI Community Invitation",
	"gateway.controlUi.github.token": "Control UI GitHub Service Credential",
	"gateway.controlUi.sessionObserver": "Control UI Session Observer",
	"gateway.controlUi.root": "Control UI Assets Root",
	"gateway.controlUi.embedSandbox": "Control UI Embed Sandbox Mode",
	"gateway.controlUi.allowExternalEmbedUrls": "Allow External Control UI Embed URLs",
	"gateway.controlUi.automaticallyFetchFavicons": "Automatically Fetch Link Favicons",
	"gateway.controlUi.allowedOrigins": "Control UI Allowed Origins",
	"gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback": "Dangerously Allow Host-Header Origin Fallback",
	"mcp.apps": "MCP Apps",
	"mcp.apps.enabled": "MCP Apps Enabled",
	"mcp.apps.sandboxOrigin": "MCP Apps Sandbox Origin",
	"mcp.apps.sandboxPort": "MCP Apps Sandbox Port",
	"gateway.push": "Gateway Push Delivery",
	"gateway.push.apns": "Gateway APNs Delivery",
	"gateway.push.apns.relay": "Gateway APNs Relay",
	"gateway.push.apns.relay.baseUrl": "Gateway APNs Relay Base URL",
	"gateway.push.apns.relay.timeoutMs": "Gateway APNs Relay Timeout (ms)",
	"gateway.http.endpoints.chatCompletions.enabled": "OpenAI Chat Completions Endpoint",
	"gateway.http.endpoints.chatCompletions.images": "OpenAI Chat Completions Image Limits",
	"gateway.http.endpoints.chatCompletions.images.allowUrl": "OpenAI Chat Completions Allow Image URLs",
	"gateway.http.endpoints.chatCompletions.images.urlAllowlist": "OpenAI Chat Completions Image URL Allowlist",
	"gateway.http.endpoints.chatCompletions.images.allowedMimes": "OpenAI Chat Completions Image MIME Allowlist",
	"gateway.http.endpoints.chatCompletions.images.maxBytes": "OpenAI Chat Completions Image Max Bytes",
	"gateway.http.endpoints.chatCompletions.images.maxRedirects": "OpenAI Chat Completions Image Max Redirects",
	"gateway.http.endpoints.chatCompletions.images.timeoutMs": "OpenAI Chat Completions Image Timeout (ms)",
	"gateway.reload.mode": "Config Reload Mode",
	"gateway.nodes.browser.mode": "Gateway Node Browser Mode",
	"gateway.nodes.browser.node": "Gateway Node Browser Pin",
	"gateway.nodes.pairing": "Gateway Node Pairing",
	"gateway.nodes.pairing.autoApproveLocal": "Gateway Node Pairing Auto-Approve Local",
	"gateway.nodes.pairing.autoApproveCidrs": "Gateway Node Pairing Auto-Approve CIDRs",
	"gateway.nodes.pairing.sshVerify": "Gateway Node Pairing SSH Verification",
	...NODE_CAPABILITY_FIELD_LABELS,
	"gateway.nodes.commands.deny": "Gateway Node Denylist",
	...NODE_HOST_FIELD_LABELS,
	attachments: "Attachments",
	"attachments.ttlHours": "Attachment Retention TTL (hours)",
	bindings: "Bindings",
	"bindings[].type": "Binding Type",
	"bindings[].agentId": "Binding Agent ID",
	"bindings[].session": "Binding Session",
	"bindings[].session.dmScope": "Binding Session DM Scope",
	"bindings[].session.groupScope": "Binding Session Group Scope",
	"bindings[].match": "Binding Match Rule",
	"bindings[].match.channel": "Binding Channel",
	"bindings[].match.accountId": "Binding Account ID",
	"bindings[].match.peer": "Binding Peer Match",
	"bindings[].match.peer.kind": "Binding Peer Kind",
	"bindings[].match.peer.id": "Binding Peer ID",
	"bindings[].match.guildId": "Binding Guild ID",
	"bindings[].match.teamId": "Binding Team ID",
	"bindings[].match.roles": "Binding Roles",
	"bindings[].acp": "ACP Binding Overrides",
	"bindings[].acp.mode": "ACP Binding Mode",
	"bindings[].acp.label": "ACP Binding Label",
	"bindings[].acp.cwd": "ACP Binding Working Directory",
	"bindings[].acp.backend": "ACP Binding Backend",
	broadcast: "Agent Group Threads",
	"broadcast.strategy": "Agent Group Strategy",
	"broadcast.*": "Agent Group Participants and Options",
	"broadcast.*.agents": "Agent Group Participants",
	"broadcast.*.mentionGating": "Agent Group Mention Selection",
	"broadcast.*.maxRounds": "Agent Group Maximum Rounds",
	"broadcast.*.maxTurns": "Agent Group Maximum Turns",
	"skills.load.extraDirs": "Extra Skill Directories",
	"skills.load.allowSymlinkTargets": "Allowed Skill Symlink Targets",
	"skills.load.watch": "Watch Skills",
	"skills.workshop.autonomous.mode": "Skill Workshop Autonomous Mode",
	"agents.defaults.skills": "Skills",
	"agents.defaults.subagents.delegationMode": "Sub-agent Delegation Mode",
	"agents.entries.*.subagents.delegationMode": "Sub-agent Delegation Mode",
	...WORKSPACE_FIELD_LABELS,
	"agents.defaults.experimental": "Experimental Agent Flags",
	"agents.defaults.experimental.localModelLean": "Enable Lean Local Model Mode (Experimental)",
	"agents.defaults.startupContext": "Startup Context",
	"agents.defaults.startupContext.enabled": "Enable Startup Context",
	"agents.defaults.startupContext.applyOn": "Startup Context Apply On",
	"agents.defaults.startupContext.dailyMemoryDays": "Startup Context Daily Memory Days",
	"agents.defaults.startupContext.maxFileBytes": "Startup Context Max File Bytes",
	"agents.defaults.startupContext.maxFileChars": "Startup Context Max File Chars",
	"agents.defaults.startupContext.maxTotalChars": "Startup Context Max Total Chars",
	"memory.search": "Memory Search",
	"memory.search.enabled": "Enable Memory Search",
	"memory.search.rememberAcrossConversations": "Remember Across Conversations",
	"memory.search.sources": "Memory Search Sources",
	"memory.search.extraPaths": "Extra Memory Paths",
	"memory.search.extraPaths.*.path": "Extra Memory Path",
	"memory.search.extraPaths.*.pattern": "Extra Memory Path Pattern",
	"memory.search.multimodal": "Memory Search Multimodal",
	"memory.search.multimodal.enabled": "Enable Memory Search Multimodal",
	"memory.search.multimodal.modalities": "Memory Search Multimodal Modalities",
	"memory.search.multimodal.maxFileBytes": "Memory Search Multimodal Max File Bytes",
	"memory.search.experimental.sessionMemory": "Memory Search Session Index (Experimental)",
	"memory.search.provider": "Memory Search Provider",
	"memory.search.remote.baseUrl": "Remote Embedding Base URL",
	"memory.search.remote.apiKey": "Remote Embedding API Key",
	"memory.search.remote.headers": "Remote Embedding Headers",
	"memory.search.remote.batch.enabled": "Remote Batch Embedding Enabled",
	"memory.search.model": "Memory Search Model",
	"memory.search.inputType": "Memory Search Input Type",
	"memory.search.queryInputType": "Memory Search Query Input Type",
	"memory.search.documentInputType": "Memory Search Document Input Type",
	"memory.search.outputDimensionality": "Memory Search Output Dimensionality",
	"memory.search.fallback": "Memory Search Fallback",
	"memory.search.local.modelPath": "Local Embedding Model Path",
	"memory.search.store.vector.enabled": "Memory Search Vector Index",
	"memory.search.store.vector.extensionPath": "Memory Search Vector Extension Path",
	"memory.search.query.maxResults": "Memory Search Max Results",
	"memory.search.query.minScore": "Memory Search Min Score",
	"memory.search.cache.enabled": "Memory Search Embedding Cache",
	memory: "Memory",
	"memory.citations": "Memory Citations Mode",
	auth: "Auth",
	"auth.profiles": "Auth Profiles",
	"auth.order": "Auth Profile Order",
	acp: "ACP",
	"acp.enabled": "ACP Enabled",
	"acp.dispatch.enabled": "ACP Dispatch Enabled",
	"acp.backend": "ACP Backend",
	"acp.fallbacks": "ACP Fallback Backends",
	"acp.defaultAgent": "ACP Default Agent",
	"acp.allowedAgents": "ACP Allowed Agents",
	"acp.stream": "ACP Stream",
	"acp.stream.repeatSuppression": "ACP Stream Repeat Suppression",
	"acp.stream.deliveryMode": "ACP Stream Delivery Mode",
	"acp.stream.tagVisibility": "ACP Stream Tag Visibility",
	"acp.runtime.installCommand": "ACP Runtime Install Command",
	models: "Models",
	"models.mode": "Model Catalog Mode",
	"models.catalogRefresh": "Model Catalog Refresh",
	"models.catalogRefresh.enabled": "Model Catalog Refresh Enabled",
	"models.catalogRefresh.url": "Model Catalog Refresh URL",
	"models.providers": "Model Providers",
	"models.providers.*.baseUrl": "Model Provider Base URL",
	"models.providers.*.apiKey": "Model Provider API Key",
	"models.providers.*.auth": "Model Provider Auth Mode",
	"models.providers.*.api": "Model Provider API Adapter",
	"models.providers.*.maxTokens": "Model Provider Max Tokens",
	"models.providers.*.timeoutSeconds": "Model Provider Request Timeout",
	"models.providers.*.region": "Model Provider Region",
	"models.providers.*.injectNumCtxForOpenAICompat": "Model Provider Inject num_ctx (OpenAI Compat)",
	"models.providers.*.params": "Model Provider Runtime Parameters",
	"models.providers.*.headers": "Model Provider Headers",
	"models.providers.*.authHeader": "Model Provider Authorization Header",
	"models.providers.*.agentRuntime": "Model Provider Runtime",
	"models.providers.*.agentRuntime.id": "Model Provider Runtime ID",
	"models.providers.*.localService": "Model Provider Local Service",
	"models.providers.*.localService.command": "Model Provider Local Service Command",
	"models.providers.*.localService.args": "Model Provider Local Service Arguments",
	"models.providers.*.localService.cwd": "Model Provider Local Service Working Directory",
	"models.providers.*.localService.env": "Model Provider Local Service Environment",
	"models.providers.*.localService.healthUrl": "Model Provider Local Service Health URL",
	"models.providers.*.localService.readyTimeoutMs": "Model Provider Local Service Ready Timeout",
	"models.providers.*.localService.idleStopMs": "Model Provider Local Service Idle Stop",
	"models.providers.*.request": "Model Provider Request Overrides",
	"models.providers.*.request.headers": "Model Provider Request Headers",
	"models.providers.*.request.auth": "Model Provider Request Auth Override",
	"models.providers.*.request.auth.mode": "Model Provider Request Auth Mode",
	"models.providers.*.request.auth.token": "Model Provider Request Bearer Token",
	"models.providers.*.request.auth.headerName": "Model Provider Request Auth Header Name",
	"models.providers.*.request.auth.value": "Model Provider Request Auth Header Value",
	"models.providers.*.request.auth.prefix": "Model Provider Request Auth Header Prefix",
	"models.providers.*.request.proxy": "Model Provider Request Proxy",
	"models.providers.*.request.proxy.mode": "Model Provider Request Proxy Mode",
	"models.providers.*.request.proxy.url": "Model Provider Request Proxy URL",
	"models.providers.*.request.proxy.tls": "Model Provider Request Proxy TLS",
	"models.providers.*.request.proxy.tls.ca": "Model Provider Request Proxy TLS CA",
	"models.providers.*.request.proxy.tls.cert": "Model Provider Request Proxy TLS Cert",
	"models.providers.*.request.proxy.tls.key": "Model Provider Request Proxy TLS Key",
	"models.providers.*.request.proxy.tls.passphrase": "Model Provider Request Proxy TLS Passphrase",
	"models.providers.*.request.proxy.tls.serverName": "Model Provider Request Proxy TLS Server Name",
	"models.providers.*.request.proxy.tls.insecureSkipVerify": "Model Provider Request Proxy TLS Skip Verify",
	proxy: "Managed Proxy",
	"proxy.enabled": "Managed Proxy Enabled",
	"proxy.proxyUrl": "Managed Proxy URL",
	"proxy.tls": "Managed Proxy TLS",
	"proxy.tls.caFile": "Managed Proxy TLS CA File",
	"proxy.loopbackMode": "Managed Proxy Loopback Mode",
	"models.providers.*.request.tls": "Model Provider Request TLS",
	"models.providers.*.request.tls.ca": "Model Provider Request TLS CA",
	"models.providers.*.request.tls.cert": "Model Provider Request TLS Cert",
	"models.providers.*.request.tls.key": "Model Provider Request TLS Key",
	"models.providers.*.request.tls.passphrase": "Model Provider Request TLS Passphrase",
	"models.providers.*.request.tls.serverName": "Model Provider Request TLS Server Name",
	"models.providers.*.request.tls.insecureSkipVerify": "Model Provider Request TLS Skip Verify",
	"models.providers.*.request.allowPrivateNetwork": "Model Provider Request Allow Private Network",
	"models.providers.*.models": "Model Provider Model List",
	"models.providers.*.models[].agentRuntime": "Model Runtime",
	"models.providers.*.models[].agentRuntime.id": "Model Runtime ID",
	"models.providers.*.models[].mediaInput": "Model Media Input",
	"models.providers.*.models[].mediaInput.image": "Model Image Input",
	"models.providers.*.models[].mediaInput.image.maxBytes": "Model Image Max Bytes",
	"models.providers.*.models[].mediaInput.image.maxPixels": "Model Image Max Pixels",
	"models.providers.*.models[].mediaInput.image.maxSidePx": "Model Image Max Side",
	"models.providers.*.models[].mediaInput.image.preferredSidePx": "Model Image Preferred Side",
	"models.providers.*.models[].mediaInput.image.tokenMode": "Model Image Token Mode",
	...AGENT_MODEL_FIELD_LABELS,
	"agents.defaults.humanDelay.mode": "Human Delay Mode",
	"agents.defaults.humanDelay.minMs": "Human Delay Min (ms)",
	"agents.defaults.humanDelay.maxMs": "Human Delay Max (ms)",
	"agents.defaults.typingMode": "Typing Mode",
	"agents.defaults.typingIntervalSeconds": "Typing Interval (Seconds)",
	"agents.entries.*.typingMode": "Agent Typing Mode",
	"agents.entries.*.sandbox.browser.network": "Agent Sandbox Browser Network",
	"agents.entries.*.sandbox.browser.cdpSourceRange": "Agent Sandbox Browser CDP Source Range",
	"agents.entries.*.sandbox.docker.dangerouslyAllowContainerNamespaceJoin": "Agent Sandbox Docker Allow Container Namespace Join",
	"agents.entries.*.sandbox.docker.gpus": "Agent Sandbox Docker GPUs",
	"agents.defaults.compaction": "Compaction",
	"agents.defaults.compaction.enabled": "Embedded Auto-Compaction",
	"agents.defaults.compaction.mode": "Compaction Mode",
	"agents.defaults.compaction.provider": "Compaction Provider",
	"agents.defaults.compaction.thinkingLevel": "Compaction Thinking Level",
	"agents.defaults.compaction.keepRecentTokens": "Compaction Keep Recent Tokens",
	"agents.defaults.compaction.identifierPolicy": "Compaction Identifier Policy",
	"agents.defaults.compaction.recentTurnsPreserve": "Compaction Preserve Recent Turns",
	"agents.defaults.compaction.qualityGuard": "Compaction Quality Guard",
	"agents.defaults.compaction.qualityGuard.enabled": "Compaction Quality Guard Enabled",
	"agents.defaults.compaction.qualityGuard.maxRetries": "Compaction Quality Guard Max Retries",
	"agents.defaults.compaction.midTurnPrecheck": "Compaction Mid-turn Precheck",
	"agents.defaults.compaction.midTurnPrecheck.enabled": "Compaction Mid-turn Precheck Enabled",
	"agents.defaults.compaction.postIndexSync": "Compaction Post-Index Sync",
	"agents.defaults.compaction.postCompactionSections": "Post-Compaction Context Sections",
	"agents.defaults.compaction.timeoutSeconds": "Compaction Timeout (Seconds)",
	"agents.defaults.compaction.model": "Compaction Model Override",
	"agents.defaults.compaction.maxActiveTranscriptBytes": "Compaction Active Transcript Size Threshold",
	"agents.defaults.compaction.notifyUser": "Compaction Notify User",
	"agents.defaults.compaction.memoryFlush": "Compaction Memory Flush",
	"agents.defaults.compaction.memoryFlush.enabled": "Compaction Memory Flush Enabled",
	"agents.defaults.compaction.memoryFlush.model": "Compaction Memory Flush Model Override",
	"agents.defaults.compaction.memoryFlush.softThresholdTokens": "Compaction Memory Flush Soft Threshold",
	"agents.defaults.compaction.memoryFlush.forceFlushTranscriptBytes": "Compaction Memory Flush Transcript Size Threshold",
	"agents.defaults.embeddedAgent": "Embedded OpenClaw",
	"agents.defaults.embeddedAgent.projectSettingsPolicy": "Embedded OpenClaw Project Settings Policy",
	"agents.defaults.embeddedAgent.executionContract": "Embedded OpenClaw Execution Contract",
	"agents.entries.*.embeddedAgent": "Agent Embedded OpenClaw",
	"agents.entries.*.embeddedAgent.executionContract": "Agent Embedded OpenClaw Execution Contract",
	"agents.defaults.heartbeat.directPolicy": "Heartbeat Direct Policy",
	"agents.defaults.heartbeat.agentId": "Heartbeat Agent",
	"agents.entries.*.heartbeat.directPolicy": "Heartbeat Direct Policy",
	"agents.defaults.heartbeat.timeoutSeconds": "Heartbeat Timeout (Seconds)",
	"agents.entries.*.heartbeat.timeoutSeconds": "Heartbeat Timeout (Seconds)",
	"agents.defaults.systemAgent": "System Agent Target",
	"agents.defaults.systemAgent.agentId": "System Agent Owner",
	"agents.defaults.authInheritance": "Auth Inheritance Target",
	"agents.defaults.authInheritance.agentId": "Auth Inheritance Owner",
	"agents.defaults.sessionStore": "Legacy Session Store Target",
	"agents.defaults.sessionStore.agentId": "Legacy Session Store Owner",
	"agents.defaults.sandbox.browser.network": "Sandbox Browser Network",
	"agents.defaults.sandbox.browser.cdpSourceRange": "Sandbox Browser CDP Source Port Range",
	"agents.defaults.sandbox.docker.dangerouslyAllowContainerNamespaceJoin": "Sandbox Docker Allow Container Namespace Join",
	"agents.defaults.sandbox.docker.gpus": "Sandbox Docker GPUs",
	commands: "Commands",
	"commands.native": "Native Commands",
	"commands.nativeSkills": "Native Skill Commands",
	"commands.text": "Text Commands",
	"commands.bash": "Allow Bash Chat Command",
	"commands.bashForegroundMs": "Bash Foreground Window (ms)",
	"commands.config": "Allow /config",
	"commands.mcp": "Allow /mcp",
	"commands.plugins": "Allow /plugins",
	"commands.debug": "Allow /debug",
	"commands.restart": "Allow Restart",
	"commands.ownerAllowFrom": "Command Owners",
	"commands.allowFrom": "Command Elevated Access Rules",
	mcp: "MCP",
	"mcp.sessionIdleTtlMs": "MCP Session Idle TTL (ms)",
	"mcp.servers": "MCP Servers",
	"mcp.servers.*.enabled": "MCP Server Enabled",
	"mcp.servers.*.auth": "MCP Server Auth",
	"mcp.servers.*.oauth": "MCP OAuth",
	"mcp.servers.*.oauth.identity": "MCP OAuth Identity",
	"mcp.servers.*.oauth.authProfileId": "MCP OAuth Auth Profile",
	"mcp.servers.*.oauth.scope": "MCP OAuth Scope",
	"mcp.servers.*.oauth.redirectUrl": "MCP OAuth Redirect URL",
	"mcp.servers.*.oauth.clientMetadataUrl": "MCP OAuth Client Metadata URL",
	"mcp.servers.*.requestTimeoutMs": "MCP Request Timeout (ms)",
	"mcp.servers.*.connectionTimeoutMs": "MCP Connect Timeout (ms)",
	"mcp.servers.*.supportsParallelToolCalls": "MCP Parallel Tool Calls",
	"mcp.servers.*.supports_parallel_tool_calls": "MCP Parallel Tool Calls",
	"mcp.servers.*.sslVerify": "MCP TLS Verification",
	"mcp.servers.*.ssl_verify": "MCP TLS Verification",
	"mcp.servers.*.clientCert": "MCP Client Certificate",
	"mcp.servers.*.client_cert": "MCP Client Certificate",
	"mcp.servers.*.clientKey": "MCP Client Key",
	"mcp.servers.*.client_key": "MCP Client Key",
	"mcp.servers.*.codex": "Codex MCP Projection",
	"mcp.servers.*.toolFilter": "MCP Tool Selection",
	"mcp.servers.*.toolFilter.include": "Included MCP Tools",
	"mcp.servers.*.toolFilter.exclude": "Excluded MCP Tools",
	"mcp.servers.*.codex.agents": "Codex MCP Agents",
	"mcp.servers.*.codex.defaultToolsApprovalMode": "Codex MCP Tool Approval",
	"mcp.servers.*.codex.default_tools_approval_mode": "Codex MCP Tool Approval",
	ui: "UI",
	"ui.seamColor": "Accent Color",
	"ui.prefs.accent": "User Accent Color",
	tui: "Terminal UI",
	"tui.footer": "Terminal UI Footer",
	"browser.evaluateEnabled": "Browser Evaluate Enabled",
	"browser.snapshotDefaults": "Browser Snapshot Defaults",
	"browser.snapshotDefaults.mode": "Browser Snapshot Mode",
	"browser.tabCleanup": "Browser Tab Cleanup",
	"browser.tabCleanup.enabled": "Browser Tab Cleanup Enabled",
	"browser.ssrfPolicy": "Browser SSRF Policy",
	"browser.ssrfPolicy.dangerouslyAllowPrivateNetwork": "Browser Dangerously Allow Private Network",
	"browser.ssrfPolicy.allowedHostnames": "Browser Allowed Hostnames",
	"browser.ssrfPolicy.blockedHostnames": "Browser Blocked Hostnames",
	"browser.ssrfPolicy.allowRfc2544BenchmarkRange": "Browser Allow RFC 2544 Benchmark Range",
	"browser.ssrfPolicy.allowIpv6UniqueLocalRange": "Browser Allow IPv6 Unique Local Range",
	"tools.exec.timeoutSeconds": "Exec Timeout (Seconds)",
	"agents.entries.*.tools.exec.timeoutSeconds": "Agent Exec Timeout (Seconds)",
	...SESSION_FIELD_LABELS,
	cron: "Automations",
	"cron.enabled": "Automations Enabled",
	"cron.skipMissedJobs": "Skip Missed Recurring Automations",
	"cron.webhookToken": "Automations Webhook Bearer Token",
	"cron.webhookSsrfPolicy": "Automations Webhook SSRF Policy",
	"cron.webhookSsrfPolicy.dangerouslyAllowPrivateNetwork": "Automations Webhook Dangerously Allow Private Network",
	"cron.webhookSsrfPolicy.allowedHostnames": "Automations Webhook Allowed Hostnames",
	"cron.webhookSsrfPolicy.blockedHostnames": "Automations Webhook Blocked Hostnames",
	"cron.webhookSsrfPolicy.allowRfc2544BenchmarkRange": "Automations Webhook Allow RFC 2544 Benchmark Range",
	"cron.webhookSsrfPolicy.allowIpv6UniqueLocalRange": "Automations Webhook Allow IPv6 Unique Local Range",
	"cron.sessionRetention": "Automations Session Retention",
	transcripts: "Transcripts",
	"transcripts.enabled": "Transcripts Enabled",
	"transcripts.autoStart": "Transcripts Auto-start Sources",
	"transcripts.autoStart[].providerId": "Transcript Source Provider ID",
	"transcripts.autoStart[].sessionId": "Transcript Session ID",
	"transcripts.autoStart[].whenOccupied": "Transcript Capture When Occupied",
	"transcripts.autoStart[].title": "Transcript Title",
	"transcripts.autoStart[].accountId": "Transcript Account ID",
	"transcripts.autoStart[].guildId": "Discord Guild ID",
	"transcripts.autoStart[].channelId": "Transcript Channel ID",
	"transcripts.autoStart[].meetingUrl": "Transcript Meeting URL",
	hooks: "Hooks",
	"hooks.enabled": "Hooks Enabled",
	"hooks.path": "Hooks Endpoint Path",
	"hooks.token": "Hooks Auth Token",
	"hooks.defaultSessionKey": "Hooks Default Session Key",
	"hooks.allowRequestSessionKey": "Hooks Allow Request Session Key",
	"hooks.allowedSessionKeyPrefixes": "Hooks Allowed Session Key Prefixes",
	"hooks.allowedAgentIds": "Hooks Allowed Agent IDs",
	"hooks.presets": "Hooks Presets",
	"hooks.transformsDir": "Hooks Transforms Directory",
	"hooks.mappings": "Hook Mappings",
	"hooks.mappings[].id": "Hook Mapping ID",
	"hooks.mappings[].match": "Hook Mapping Match",
	"hooks.mappings[].match.path": "Hook Mapping Match Path",
	"hooks.mappings[].match.source": "Hook Mapping Match Source",
	"hooks.mappings[].action": "Hook Mapping Action",
	"hooks.mappings[].wakeMode": "Hook Mapping Wake Mode",
	"hooks.mappings[].name": "Hook Mapping Name",
	"hooks.mappings[].agentId": "Hook Mapping Agent ID",
	"hooks.mappings[].sessionKey": "Hook Mapping Session Key",
	"hooks.mappings[].sessionMode": "Hook Mapping Session Mode",
	"hooks.mappings[].messageTemplate": "Hook Mapping Message Template",
	"hooks.mappings[].textTemplate": "Hook Mapping Text Template",
	"hooks.mappings[].forEach": "Hook Mapping Fan-Out Key",
	"hooks.mappings[].deliver": "Hook Mapping Deliver Reply",
	"hooks.mappings[].allowUnsafeExternalContent": "Hook Mapping Allow Unsafe External Content",
	"hooks.mappings[].channel": "Hook Mapping Delivery Channel",
	"hooks.mappings[].to": "Hook Mapping Delivery Destination",
	"hooks.mappings[].model": "Hook Mapping Model Override",
	"hooks.mappings[].thinking": "Hook Mapping Thinking Override",
	"hooks.mappings[].timeoutSeconds": "Hook Mapping Timeout (sec)",
	"hooks.mappings[].transform": "Hook Mapping Transform",
	"hooks.mappings[].transform.module": "Hook Transform Module",
	"hooks.mappings[].transform.export": "Hook Transform Export",
	"hooks.gmail": "Gmail Hook",
	"hooks.gmail.account": "Gmail Hook Account",
	"hooks.gmail.label": "Gmail Hook Label",
	"hooks.gmail.topic": "Gmail Hook Pub/Sub Topic",
	"hooks.gmail.subscription": "Gmail Hook Subscription",
	"hooks.gmail.pushToken": "Gmail Hook Push Token",
	"hooks.gmail.hookUrl": "Gmail Hook Callback URL",
	"hooks.gmail.includeBody": "Gmail Hook Include Body",
	"hooks.gmail.maxBytes": "Gmail Hook Max Body Bytes",
	"hooks.gmail.renewEveryMinutes": "Gmail Hook Renew Interval (min)",
	"hooks.gmail.allowUnsafeExternalContent": "Gmail Hook Allow Unsafe External Content",
	"hooks.gmail.serve": "Gmail Hook Local Server",
	"hooks.gmail.serve.bind": "Gmail Hook Server Bind Address",
	"hooks.gmail.serve.port": "Gmail Hook Server Port",
	"hooks.gmail.serve.path": "Gmail Hook Server Path",
	"hooks.gmail.tailscale": "Gmail Hook Tailscale",
	"hooks.gmail.tailscale.mode": "Gmail Hook Tailscale Mode",
	"hooks.gmail.tailscale.path": "Gmail Hook Tailscale Path",
	"hooks.gmail.tailscale.target": "Gmail Hook Tailscale Target",
	"hooks.gmail.model": "Gmail Hook Model Override",
	"hooks.gmail.thinking": "Gmail Hook Thinking Override",
	"hooks.internal": "Internal Hooks",
	"hooks.internal.enabled": "Internal Hooks Enabled",
	"hooks.internal.entries": "Internal Hook Entries",
	"hooks.internal.load": "Internal Hook Loader",
	"hooks.internal.load.extraDirs": "Internal Hook Extra Directories",
	web: "Web Channel",
	discovery: "Discovery",
	"discovery.wideArea": "Wide-area Discovery",
	"discovery.wideArea.domain": "Wide-area Discovery Domain",
	"discovery.mdns": "mDNS Discovery",
	talk: "Talk",
	"talk.agentId": "Talk Agent",
	"talk.speechLocale": "Talk Speech Locale",
	"talk.interruptOnSpeech": "Talk Interrupt on Speech",
	"talk.silenceTimeoutMs": "Talk Silence Timeout (ms)",
	"talk.consultThinkingLevel": "Talk Consult Thinking Level",
	"talk.consultFastMode": "Talk Consult Fast Mode",
	messages: "Messages",
	"messages.visibleReplies": "Visible Replies",
	"messages.responsePrefix": "Outbound Response Prefix",
	"messages.usageTemplate": "Usage Footer Template",
	"messages.responseUsage": "Default Usage Footer Mode",
	"messages.groupChat": "Group Chat Rules",
	"messages.groupChat.mentionPatterns": "Group Mention Patterns",
	"messages.groupChat.historyLimit": "Group History Limit",
	"messages.groupChat.unmentionedInbound": "Group Unmentioned Inbound",
	"messages.groupChat.visibleReplies": "Group Visible Replies",
	"messages.queue": "Inbound Queue",
	"messages.queue.mode": "Queue Mode",
	"messages.queue.byChannel": "Queue Mode by Channel",
	"messages.queue.debounceMsByChannel": "Queue Fallback Debounce by Channel (ms)",
	"messages.queue.cap": "Queue Capacity",
	"messages.queue.drop": "Queue Drop Strategy",
	"messages.inbound": "Inbound Debounce",
	"messages.ackReaction": "Ack Reaction Emoji",
	"messages.ackReactionScope": "Ack Reaction Scope",
	"messages.statusReactions": "Status Reactions",
	"messages.statusReactions.enabled": "Enable Status Reactions",
	"messages.inbound.debounceMs": "Inbound Message Debounce (ms)",
	"messages.inbound.byChannel": "Inbound Debounce by Channel (ms)",
	tts: "Text-to-Speech",
	"tts.persona": "TTS Persona",
	"tts.personas": "TTS Personas",
	"tts.personas.*": "TTS Persona",
	"tts.personas.*.providers": "TTS Persona Provider Bindings",
	"tts.providers": "TTS Provider Settings",
	"tts.providers.*": "TTS Provider Config",
	"tts.providers.*.apiKey": "TTS Provider API Key",
	"talk.provider": "Talk Active Provider",
	"talk.providers": "Talk Provider Settings",
	"talk.providers.*": "Talk Provider Config",
	"talk.providers.*.apiKey": "Talk Provider API Key",
	"talk.realtime": "Talk Realtime",
	"talk.realtime.provider": "Talk Realtime Provider",
	"talk.realtime.providers": "Talk Realtime Provider Settings",
	"talk.realtime.providers.*": "Talk Realtime Provider Config",
	"talk.realtime.providers.*.apiKey": "Talk Realtime Provider API Key",
	"talk.realtime.model": "Talk Realtime Model",
	"talk.realtime.speakerVoice": "Talk Realtime Speaker Voice",
	"talk.realtime.speakerVoiceId": "Talk Realtime Speaker Voice ID",
	"talk.realtime.instructions": "Talk Realtime Instructions",
	"talk.realtime.mode": "Talk Realtime Mode",
	"talk.realtime.transport": "Talk Realtime Transport",
	"talk.realtime.vadThreshold": "Talk Realtime VAD Threshold",
	"talk.realtime.silenceDurationMs": "Talk Realtime Silence Duration (ms)",
	"talk.realtime.prefixPaddingMs": "Talk Realtime Prefix Padding (ms)",
	"talk.realtime.reasoningEffort": "Talk Realtime Reasoning Effort",
	"talk.realtime.brain": "Talk Realtime Brain",
	"talk.realtime.consultRouting": "Talk Realtime Consult Routing",
	channels: "Channels",
	"channels.defaults": "Channel Defaults",
	"channels.defaults.groupPolicy": "Default Group Policy",
	"channels.defaults.contextVisibility": "Default Context Visibility",
	"channels.defaults.implicitMentions": "Default Implicit Mentions",
	"channels.defaults.implicitMentions.replyToBot": "Default Reply-to-Bot Implicit Mentions",
	"channels.defaults.implicitMentions.quotedBot": "Default Quoted-Bot Implicit Mentions",
	"channels.defaults.implicitMentions.threadParticipation": "Default Thread-Participation Implicit Mentions",
	"channels.defaults.heartbeatVisibility": "Default Heartbeat Visibility",
	"channels.defaults.heartbeatVisibility.showOk": "Heartbeat Show OK",
	"channels.defaults.heartbeatVisibility.showAlerts": "Heartbeat Show Alerts",
	"channels.defaults.heartbeatVisibility.useIndicator": "Heartbeat Use Indicator",
	"channels.defaults.botLoopProtection": "Default Bot Loop Protection",
	"channels.defaults.botLoopProtection.enabled": "Default Bot Loop Protection Enabled",
	"channels.defaults.botLoopProtection.maxEventsPerWindow": "Default Bot Loop Events per Window",
	"channels.defaults.botLoopProtection.windowSeconds": "Default Bot Loop Window Seconds",
	"channels.defaults.botLoopProtection.cooldownSeconds": "Default Bot Loop Cooldown Seconds",
	"channels.mattermost": "Mattermost",
	"channels.modelByChannel": "Channel Model Overrides",
	"channels.googlechat.botLoopProtection": "Google Chat Bot Loop Protection",
	"channels.mattermost.botToken": "Mattermost Bot Token",
	"channels.mattermost.baseUrl": "Mattermost Base URL",
	"channels.mattermost.configWrites": "Mattermost Config Writes",
	"channels.mattermost.chatmode": "Mattermost Chat Mode",
	"channels.mattermost.oncharPrefixes": "Mattermost Onchar Prefixes",
	"channels.mattermost.requireMention": "Mattermost Require Mention",
	"discovery.mdns.mode": "mDNS Discovery Mode",
	plugins: "Plugins",
	"plugins.enabled": "Enable Plugins",
	"plugins.allow": "Plugin Allowlist",
	"plugins.deny": "Plugin Denylist",
	"plugins.load": "Plugin Loader",
	"plugins.load.paths": "Plugin Load Paths",
	"plugins.slots": "Plugin Slots",
	"plugins.slots.memory": "Memory Plugin",
	"plugins.slots.contextEngine": "Context Engine Plugin",
	"plugins.entries": "Plugin Entries",
	"plugins.entries.*.enabled": "Plugin Enabled",
	"plugins.entries.*.hooks": "Plugin Hook Policy",
	"plugins.entries.*.hooks.allowConversationAccess": "Allow Conversation Access Hooks",
	"plugins.entries.*.hooks.allowPromptInjection": "Allow Prompt Injection Hooks",
	"plugins.entries.*.hooks.timeoutMs": "Plugin Hook Timeout (ms)",
	"plugins.entries.*.hooks.timeouts": "Plugin Hook Timeout Overrides",
	"plugins.entries.*.subagent": "Plugin Subagent Policy",
	"plugins.entries.*.subagent.allowModelOverride": "Allow Plugin Subagent Model Override",
	"plugins.entries.*.subagent.allowedModels": "Plugin Subagent Allowed Models",
	"plugins.entries.*.llm": "Plugin LLM Policy",
	"plugins.entries.*.llm.allowModelOverride": "Allow Plugin LLM Model Override",
	"plugins.entries.*.llm.allowedModels": "Plugin LLM Allowed Models",
	"plugins.entries.*.llm.allowedCompletionModels": "Plugin LLM Allowed Completion Models",
	"plugins.entries.*.llm.allowAuthProfileOverride": "Allow Plugin LLM Auth Profile Override",
	"plugins.entries.*.llm.allowAgentIdOverride": "Allow Plugin LLM Agent Override",
	"plugins.entries.*.apiKey": "Plugin API Key",
	"plugins.entries.*.env": "Plugin Environment Variables",
	"plugins.entries.*.config": "Plugin Config"
};
//#endregion
//#region src/config/schema.tiers.ts
const ROOT_TIER_PATHS = `
accessGroups acp agents approvals attachments auth bindings broadcast browser channels
cloudWorkers commands cron desktop diagnostics discovery env gateway hooks logging mcp memory messages
meta models nodeHost plugins proxy secrets security session skills surfaces talk telemetry tools transcripts
tts ui update wizard worktreeAcceleration worktreeRoot
`.trim().split(/\s+/);
const COMMON_TIER_PATHS = `
bindings commands messages session
acp.allowedAgents
agents.defaults.elevatedDefault agents.defaults.embeddedAgent.projectSettingsPolicy
agents.defaults.fastModeDefault agents.defaults.heartbeat.accountId
agents.defaults.heartbeat.activeHours agents.defaults.heartbeat.directPolicy
agents.defaults.heartbeat.model agents.defaults.heartbeat.target agents.defaults.heartbeat.to
agents.defaults.compaction.memoryFlush.model agents.defaults.compaction.model
agents.defaults.imageModel.primary agents.defaults.model
agents.defaults.mediaModels agents.defaults.model.primary agents.defaults.modelPolicy.allow
agents.defaults.pdfModel.primary agents.defaults.sandbox.browser.enabled
agents.defaults.sandbox.docker.network agents.defaults.sandbox.mode
agents.defaults.sandbox.sessionToolsVisibility agents.defaults.sandbox.workspaceAccess
agents.defaults.skills agents.defaults.subagents.allowAgents agents.defaults.subagents.requireAgentId
agents.defaults.subagents.model agents.defaults.subagents.model.primary
agents.defaults.sandbox.ssh.workspaceRoot
agents.defaults.sandbox.workspaceRoot
agents.defaults.thinkingDefault agents.defaults.userTimezone agents.defaults.voiceModel.primary
agents.defaults.workspace agents.entries.*.groupChat.mentionPatterns
agents.entries.*.groupChat.unmentionedInbound agents.entries.*.identity
agents.entries.*.memory.search.enabled agents.entries.*.memory.search.provider
agents.entries.*.memory.search.rememberAcrossConversations agents.entries.*.memory.search.model
agents.entries.*.memory.search.remote.apiKey agents.entries.*.heartbeat.model
agents.entries.*.model agents.entries.*.model.primary agents.entries.*.name
agents.entries.*.runtime.acp.agent agents.entries.*.runtime.type
agents.entries.*.sandbox.ssh.workspaceRoot agents.entries.*.sandbox.workspaceRoot
agents.entries.*.subagents.model agents.entries.*.subagents.model.primary agents.entries.*.workspace
agents.entries.*.tools.alsoAllow agents.entries.*.tools.deny
agents.entries.*.tools.github
agents.entries.*.tools.exec.applyPatch.workspaceOnly agents.entries.*.tools.exec.host
agents.entries.*.tools.exec.mode agents.entries.*.tools.exec.strictInlineEval
agents.entries.*.tools.exec.reviewer.model agents.entries.*.tools.exec.reviewer.model.primary
agents.entries.*.tools.fs.workspaceOnly agents.entries.*.tools.message
agents.entries.*.tools.profile agents.entries.*.tools.sandbox.tools.alsoAllow
agents.entries.*.tools.sandbox.tools.deny
agents.entries.*.tts.auto
agents.entries.*.tts.modelOverrides agents.entries.*.tts.persona
agents.entries.*.tts.personas.*.providers.*.apiKey agents.entries.*.tts.provider
agents.entries.*.tts.providers.*.apiKey
auth.profiles.*.mode auth.profiles.*.provider
browser.allowSystemProfileImport browser.defaultProfile browser.enabled browser.evaluateEnabled
browser.ssrfPolicy.allowedHostnames browser.ssrfPolicy.dangerouslyAllowPrivateNetwork
channels.*.allowFrom channels.*.contextVisibility channels.*.dmPolicy channels.*.enabled
channels.*.groupAllowFrom channels.*.groupPolicy channels.*.requireMention
channels.*.accessToken channels.*.apiKey channels.*.appPassword channels.*.appToken
channels.*.botToken channels.*.clientSecret channels.*.dmAllowlist channels.*.model
channels.*.password channels.*.port channels.*.refreshToken channels.*.secret
channels.*.token channels.*.webhookSecret channels.*.workspace
channels.*.accounts.*.allowFrom channels.*.accounts.*.dmPolicy channels.*.accounts.*.enabled
channels.*.accounts.*.groupAllowFrom channels.*.accounts.*.groupPolicy
channels.*.accounts.*.requireMention channels.*.accounts.*.accessToken
channels.*.accounts.*.apiKey channels.*.accounts.*.appPassword
channels.*.accounts.*.appToken channels.*.accounts.*.botToken
channels.*.accounts.*.clientSecret channels.*.accounts.*.dmAllowlist
channels.*.accounts.*.model channels.*.accounts.*.password channels.*.accounts.*.port
channels.*.accounts.*.refreshToken channels.*.accounts.*.secret channels.*.accounts.*.token
channels.*.accounts.*.webhookSecret channels.*.accounts.*.workspace
channels.defaults.contextVisibility
channels.clickclack.accounts.*.discussions.workspace channels.clickclack.discussions.workspace
channels.defaults.groupPolicy channels.discord.dm.enabled channels.discord.guilds.*.channels.*.enabled
channels.discord.guilds.*.channels.*.requireMention channels.discord.guilds.*.channels.*.roles
channels.discord.guilds.*.channels.*.users channels.discord.guilds.*.requireMention
channels.discord.guilds.*.roles channels.discord.guilds.*.users channels.discord.token
channels.discord.voice.allowedChannels channels.discord.voice.realtime.toolPolicy
channels.discord.activities.clientSecret channels.discord.pluralkit.token
channels.discord.voice.model channels.discord.voice.realtime.model
channels.discord.voice.tts.personas.*.providers.*.apiKey
channels.discord.voice.tts.providers.*.apiKey
channels.discord.accounts.*.activities.clientSecret channels.discord.accounts.*.pluralkit.token
channels.discord.accounts.*.voice.model channels.discord.accounts.*.voice.realtime.model
channels.discord.accounts.*.voice.tts.personas.*.providers.*.apiKey
channels.discord.accounts.*.voice.tts.providers.*.apiKey
channels.googlechat.audience channels.googlechat.audienceType channels.googlechat.dm.enabled
channels.googlechat.groups.*.enabled channels.googlechat.groups.*.users
channels.googlechat.requireMention channels.googlechat.serviceAccount
channels.googlechat.serviceAccountFile channels.googlechat.accounts.*.serviceAccount
channels.imessage.attachmentRoots channels.imessage.cliPath
channels.imessage.groups.*.requireMention channels.imessage.remoteAttachmentRoots
channels.imessage.service channels.irc.channels channels.irc.groups.*.allowFrom
channels.irc.groups.*.enabled channels.irc.groups.*.requireMention channels.irc.host
channels.irc.nick channels.irc.nickserv.password channels.irc.password channels.irc.port
channels.irc.tls channels.irc.accounts.*.nickserv.password channels.irc.accounts.*.port
channels.msteams.appId channels.msteams.appPassword channels.msteams.requireMention
channels.msteams.tenantId channels.msteams.webhook.port channels.qqbot.stt.apiKey
channels.qqbot.stt.model channels.signal.account channels.signal.cliPath
channels.signal.groups.*.requireMention channels.slack.appToken channels.slack.botToken
channels.slack.channels.*.enabled channels.slack.channels.*.requireMention
channels.slack.channels.*.users channels.slack.dm.enabled channels.slack.relay.authToken
channels.slack.requireMention channels.slack.signingSecret channels.slack.userTokenReadOnly
channels.slack.accounts.*.relay.authToken channels.slack.accounts.*.signingSecret
channels.sms.accounts.*.authToken channels.sms.authToken
channels.telegram.botToken channels.telegram.direct.*.allowFrom channels.telegram.direct.*.dmPolicy
channels.telegram.direct.*.enabled channels.telegram.groups.*.allowFrom
channels.telegram.groups.*.enabled channels.telegram.groups.*.groupPolicy
channels.telegram.groups.*.requireMention channels.telegram.groups.*.topics.*.allowFrom
channels.telegram.groups.*.topics.*.enabled channels.telegram.groups.*.topics.*.groupPolicy
channels.telegram.groups.*.topics.*.requireMention channels.telegram.webhookSecret
channels.telegram.accounts.*.direct.*.dmPolicy
channels.telegram.accounts.*.direct.*.topics.*.groupPolicy
channels.telegram.accounts.*.groups.*.groupPolicy
channels.telegram.accounts.*.groups.*.topics.*.groupPolicy
channels.telegram.direct.*.topics.*.groupPolicy
channels.whatsapp.groups.*.requireMention channels.whatsapp.selfChatMode
cron.enabled env.vars gateway.auth.mode gateway.auth.password gateway.auth.token
gateway.cliAgents.enabled
gateway.auth.trustedProxy.allowUsers gateway.auth.trustedProxy.userHeader gateway.bind
gateway.controlUi.allowedOrigins gateway.http.endpoints.chatCompletions.images.urlAllowlist
gateway.http.endpoints.responses.files.urlAllowlist
gateway.http.endpoints.responses.images.urlAllowlist gateway.mode gateway.nodes.allowSkills
gateway.nodes.pairing.autoApproveCidrs gateway.nodes.pairing.autoApproveLocal gateway.nodes.pluginTools.enabled gateway.port
gateway.remote.password gateway.remote.sshTarget gateway.remote.tlsFingerprint
gateway.remote.token gateway.remote.transport gateway.remote.url gateway.tailscale.mode
gateway.trustedProxies hooks.allowedAgentIds hooks.enabled hooks.gmail.account hooks.gmail.label
hooks.gmail.pushToken hooks.gmail.subscription hooks.gmail.topic
hooks.gmail.model hooks.gmail.serve.port hooks.internal.entries.*.enabled
hooks.mappings.*.agentId hooks.mappings.*.model hooks.token
logging.audit.messages
mcp.apps.enabled mcp.servers.*.args mcp.servers.*.auth mcp.servers.*.command
mcp.servers.*.cwd mcp.servers.*.enabled mcp.servers.*.env mcp.servers.*.headers
mcp.servers.*.oauth.authProfileId mcp.servers.*.transport mcp.servers.*.url
memory.search.enabled memory.search.model memory.search.provider memory.search.rememberAcrossConversations
memory.search.remote.apiKey
memory.search.sources models.providers.*.api models.providers.*.apiKey
models.providers.*.auth models.providers.*.baseUrl models.providers.*.models.*.id
models.providers.*.request.auth.token
nodeHost.browserProxy.allowProfiles nodeHost.mcp.servers.*.args
nodeHost.mcp.servers.*.command nodeHost.mcp.servers.*.env
nodeHost.mcp.servers.*.headers nodeHost.mcp.servers.*.transport
nodeHost.mcp.servers.*.url plugins.allow plugins.entries.*.apiKey
plugins.entries.*.config plugins.entries.*.enabled plugins.entries.*.env
plugins.slots.contextEngine plugins.slots.memory secrets.providers.*.command
secrets.providers.*.path secrets.providers.*.source skills.allowBundled
skills.entries.*.apiKey skills.entries.*.config skills.entries.*.enabled
skills.entries.*.env skills.install.allowUploadedArchives skills.install.nodeManager
skills.load.allowSymlinkTargets skills.load.extraDirs skills.workshop.approvalPolicy
skills.workshop.autonomous.mode talk.provider talk.providers.*.apiKey
talk.realtime.brain talk.realtime.mode talk.realtime.provider
talk.realtime.model talk.realtime.providers.*.apiKey talk.realtime.speakerVoice talk.speechLocale
tools.alsoAllow tools.deny tools.exec
tools.github
tools.fs tools.media.audio tools.media.image tools.media.video tools.message
tools.exec.reviewer.model.primary tools.media.models.*.model
tools.media.models.*.request.auth.token tools.profile tools.sessions
tools.loopDetection.enabled tools.swarm tools.swarm.enabled
tools.swarm.maxConcurrent tools.swarm.maxChildrenPerGroup tools.swarm.maxTotalPerGroup
tools.swarm.waitTimeoutSecondsMax tools.swarm.defaultAgentId
tools.web transcripts.enabled
tts.auto tts.persona tts.personas.*.providers.*.apiKey tts.provider
tts.providers.* tts.providers.*.apiKey
ui.prefs.accent ui.prefs.chatFollowUpMode
ui.prefs.chatPersistCommentary ui.prefs.chatSendShortcut ui.prefs.chatShowThinking
ui.prefs.chatShowToolCalls ui.prefs.locale
ui.prefs.theme ui.prefs.themeMode update.auto.enabled update.channel
wizard.accessMode wizard.appRecommendations
`.trim().split(/\s+/);
const ADVANCED_TUNING_PATHS = /* @__PURE__ */ new Set(["agents.defaults.heartbeat.every", "session.maintenance.preserveRecent"]);
const CHANNEL_KERNEL_TIER_PREFIXES = ["channels.defaults", "channels.modelByChannel"];
function isPluginOwnedChannelTierPath(path) {
	if (!path.startsWith("channels.") || path === "channels") return false;
	return !CHANNEL_KERNEL_TIER_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}.`));
}
function splitPath(path) {
	return path.replace(/\[(\*|\d*)\]/g, (_match, segment) => `.${segment || "*"}`).replace(/^\.+|\.+$/g, "").split(".").filter(Boolean);
}
function createHintMatcher(hints, acceptHint) {
	const exact = /* @__PURE__ */ new Map();
	const wildcardsByPrefix = /* @__PURE__ */ new Map();
	let order = 0;
	for (const [hintPath, hint] of Object.entries(hints)) {
		if (acceptHint && !acceptHint(hint)) continue;
		const parts = splitPath(hintPath);
		const wildcardCount = parts.filter((part) => part === "*").length;
		if (wildcardCount === 0) {
			exact.set(parts.join("."), hint);
			continue;
		}
		const prefix = parts.slice(0, parts.indexOf("*")).join(".");
		const key = `${parts.length}:${prefix}`;
		const bucket = wildcardsByPrefix.get(key) ?? [];
		bucket.push({
			parts,
			hint,
			wildcardCount,
			order: order++
		});
		wildcardsByPrefix.set(key, bucket);
	}
	for (const bucket of wildcardsByPrefix.values()) bucket.sort((left, right) => left.wildcardCount - right.wildcardCount);
	return (path) => {
		const canonical = exact.get(path);
		if (canonical !== void 0) return canonical;
		const parts = splitPath(path);
		const direct = exact.get(parts.join("."));
		if (direct !== void 0) return direct;
		let best;
		let prefix = parts.slice(0, -1).join(".");
		for (;;) {
			const candidate = wildcardsByPrefix.get(`${parts.length}:${prefix}`)?.find((rule) => rule.parts.every((part, index) => part === "*" || part === parts[index]));
			if (candidate && (!best || candidate.wildcardCount < best.wildcardCount || candidate.wildcardCount === best.wildcardCount && candidate.order < best.order)) best = candidate;
			if (!prefix) break;
			prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(".")));
		}
		return best?.hint;
	};
}
function createTierMatcher(hints) {
	const match = createHintMatcher(hints, (hint) => typeof hint.advanced === "boolean");
	return (path) => match(path)?.advanced;
}
function isNumericSchema(schema) {
	const types = Array.isArray(schema.type) ? schema.type : [schema.type];
	return types.includes("number") || types.includes("integer");
}
function mergeTierHint(hints, path, advanced, inherited) {
	const current = hints[path];
	if (current?.advanced !== advanced) hints[path] = {
		...current ?? inherited,
		advanced
	};
}
function visitSchemaNodes(schema, initialState, visit) {
	const visited = /* @__PURE__ */ new WeakMap();
	const walk = (value, path, state) => {
		const node = asSchemaObject(value);
		if (!node) return;
		const previousPaths = visited.get(node);
		if (previousPaths?.has(path)) return;
		if (previousPaths) previousPaths.add(path);
		else visited.set(node, /* @__PURE__ */ new Set([path]));
		const nextState = visit(node, path, state);
		for (const [key, child] of Object.entries(node.properties ?? {})) walk(child, path ? `${path}.${key}` : key, nextState);
		if (node.additionalProperties && typeof node.additionalProperties === "object") walk(node.additionalProperties, path ? `${path}.*` : "*", nextState);
		const items = Array.isArray(node.items) ? node.items : node.items ? [node.items] : [];
		for (const item of items) walk(item, path ? `${path}.*` : "*", nextState);
		for (const branches of [
			node.anyOf,
			node.oneOf,
			node.allOf
		]) for (const branch of branches ?? []) walk(branch, path, nextState);
	};
	walk(schema, "", initialState);
}
/** Add authored common/advanced tier boundaries to the base hint map. */
function applyConfigTierHints(hints, options) {
	const next = { ...hints };
	for (const path of ROOT_TIER_PATHS) mergeTierHint(next, path, true);
	for (const path of COMMON_TIER_PATHS) {
		if (!options?.includePluginOwnedChannels && isPluginOwnedChannelTierPath(path)) continue;
		mergeTierHint(next, path, false);
	}
	for (const path of ADVANCED_TUNING_PATHS) mergeTierHint(next, path, true);
	return next;
}
/** Materialize the resolved tier on every schema path for RPC/UI consumers. */
function applyResolvedConfigTierHints(schema, hints) {
	const next = { ...hints };
	const matchHint = createHintMatcher(hints);
	const authoredTier = createTierMatcher(hints);
	visitSchemaNodes(schema, void 0, (node, path) => {
		if (path && isNumericSchema(node) && splitPath(path).at(-1) !== "port" && authoredTier(path) === void 0) mergeTierHint(next, path, true, matchHint(path));
	});
	const matchTier = createTierMatcher(next);
	visitSchemaNodes(schema, true, (_node, path, inheritedTier) => {
		const advanced = path ? matchTier(path) ?? inheritedTier : inheritedTier;
		if (path) mergeTierHint(next, path, advanced, matchHint(path));
		return advanced;
	});
	return next;
}
//#endregion
//#region src/config/schema.hints.ts
const GROUP_HINTS = [
	[
		"wizard",
		"Wizard",
		20
	],
	[
		"update",
		"Update",
		25
	],
	[
		"cli",
		"CLI",
		26
	],
	[
		"diagnostics",
		"Diagnostics",
		27
	],
	[
		"telemetry",
		"Telemetry",
		28
	],
	[
		"logging",
		"Logging",
		900
	],
	[
		"gateway",
		"Gateway",
		30
	],
	[
		"nodeHost",
		"Node Host",
		35
	],
	[
		"cloudWorkers",
		"Cloud Workers",
		37
	],
	[
		"desktop",
		"Desktop",
		38
	],
	[
		"agents",
		"Agents",
		40
	],
	[
		"tools",
		"Tools",
		50
	],
	[
		"bindings",
		"Bindings",
		55
	],
	[
		"audio",
		"Audio",
		60
	],
	[
		"models",
		"Models",
		70
	],
	[
		"messages",
		"Messages",
		80
	],
	[
		"commands",
		"Commands",
		85
	],
	[
		"session",
		"Session",
		90
	],
	[
		"cron",
		"Automations",
		100
	],
	[
		"worktreeRoot",
		"Worktree Root",
		105
	],
	[
		"worktreeAcceleration",
		"Worktree Acceleration",
		106
	],
	[
		"hooks",
		"Hooks",
		110
	],
	[
		"ui",
		"UI",
		120
	],
	[
		"browser",
		"Browser",
		130
	],
	[
		"talk",
		"Talk",
		140
	],
	[
		"channels",
		"Messaging Channels",
		150
	],
	[
		"skills",
		"Skills",
		200
	],
	[
		"plugins",
		"Plugins",
		205
	],
	[
		"discovery",
		"Discovery",
		210
	],
	[
		"presence",
		"Presence",
		220
	],
	[
		"voicewake",
		"Voice Wake",
		230
	]
];
const SECTION_DOCS_URLS = {
	accessGroups: "https://docs.openclaw.ai/channels/access-groups",
	messages: "https://docs.openclaw.ai/concepts/messages",
	tts: "https://docs.openclaw.ai/tools/tts",
	commands: "https://docs.openclaw.ai/tools/slash-commands",
	hooks: "https://docs.openclaw.ai/automation/hooks",
	cron: "https://docs.openclaw.ai/automation/cron-jobs",
	bindings: "https://docs.openclaw.ai/concepts/agent-bindings",
	plugins: "https://docs.openclaw.ai/plugins/manage-plugins",
	mcp: "https://docs.openclaw.ai/tools/mcp",
	memory: "https://docs.openclaw.ai/concepts/memory",
	talk: "https://docs.openclaw.ai/nodes/talk",
	gateway: "https://docs.openclaw.ai/gateway/configuration",
	browser: "https://docs.openclaw.ai/tools/browser",
	nodeHost: "https://docs.openclaw.ai/nodes",
	discovery: "https://docs.openclaw.ai/gateway/discovery",
	acp: "https://docs.openclaw.ai/tools/acp-agents",
	agents: "https://docs.openclaw.ai/concepts/agent",
	models: "https://docs.openclaw.ai/concepts/models",
	skills: "https://docs.openclaw.ai/tools/skills",
	tools: "https://docs.openclaw.ai/tools",
	session: "https://docs.openclaw.ai/concepts/session",
	security: "https://docs.openclaw.ai/gateway/security",
	approvals: "https://docs.openclaw.ai/tools/exec-approvals",
	env: "https://docs.openclaw.ai/help/environment",
	auth: "https://docs.openclaw.ai/concepts/oauth",
	update: "https://docs.openclaw.ai/install/updating",
	telemetry: "https://docs.openclaw.ai/gateway/telemetry",
	logging: "https://docs.openclaw.ai/logging",
	diagnostics: "https://docs.openclaw.ai/gateway/diagnostics",
	cli: "https://docs.openclaw.ai/cli",
	secrets: "https://docs.openclaw.ai/gateway/secrets",
	ui: "https://docs.openclaw.ai/web/control-ui",
	wizard: "https://docs.openclaw.ai/start/wizard",
	channels: "https://docs.openclaw.ai/channels",
	broadcast: "https://docs.openclaw.ai/channels/broadcast-groups",
	audio: "https://docs.openclaw.ai/nodes/audio",
	voicewake: "https://docs.openclaw.ai/nodes/voicewake",
	presence: "https://docs.openclaw.ai/concepts/presence",
	cloudWorkers: "https://docs.openclaw.ai/gateway/cloud-workers",
	desktop: "https://docs.openclaw.ai/gateway/configuration",
	worktreeRoot: "https://docs.openclaw.ai/concepts/managed-worktrees",
	worktreeAcceleration: "https://docs.openclaw.ai/concepts/managed-worktrees",
	proxy: "https://docs.openclaw.ai/security/network-proxy",
	transcripts: "https://docs.openclaw.ai/plugins/meeting-plugins",
	surfaces: "https://docs.openclaw.ai/concepts/messages"
};
const FIELD_PLACEHOLDERS = {
	"plugins.entries.*.hooks.timeoutMs": "Automatic (per hook)",
	"plugins.entries.*.hooks.timeouts.*": "Automatic (plugin or hook default)",
	"gateway.cliAgents.enabled": "Default (enabled)",
	"nodeHost.autoUpdate.enabled": "Default (enabled)",
	"tools.loopDetection.enabled": "Default (post-compaction protection only)",
	"gateway.publicOrigin": "https://gateway.example.com",
	"gateway.remote.url": "ws://host:18789",
	"gateway.remote.tlsFingerprint": "sha256:ab12cd34…",
	"gateway.remote.sshTarget": "user@host",
	"gateway.remote.sshHostKeyPolicy": "strict",
	"gateway.controlUi.basePath": "/openclaw",
	"gateway.controlUi.environment.label": "edge",
	"gateway.controlUi.root": "dist/control-ui",
	"gateway.controlUi.allowedOrigins": "https://control.example.com",
	"gateway.push.apns.relay.baseUrl": "https://ios-push-relay.openclaw.ai",
	"channels.mattermost.baseUrl": "https://chat.example.com",
	"agents.entries.*.identity.avatar": "avatars/openclaw.png"
};
const CHANNEL_NAMESPACE_PREFIX = "channels.";
function isKernelOwnedChannelHintPath(path) {
	if (path === "channels") return true;
	const channelKey = path.startsWith(CHANNEL_NAMESPACE_PREFIX) ? path.slice(9).split(".", 1)[0] : void 0;
	return channelKey !== void 0 && isKernelOwnedChannelConfigKey(channelKey);
}
/** Return whether a channel hint path belongs to a plugin-owned channel namespace. */
function isPluginOwnedChannelHintPath(path) {
	if (!path.startsWith(CHANNEL_NAMESPACE_PREFIX)) return false;
	return !isKernelOwnedChannelHintPath(path);
}
/** Build core config UI hints while leaving plugin-owned channel hints to plugin schemas. */
function buildBaseHints() {
	const hints = {};
	for (const [group, label, order] of GROUP_HINTS) hints[group] = {
		label,
		group: label,
		order
	};
	for (const [path, docsUrl] of Object.entries(SECTION_DOCS_URLS)) hints[path] = {
		...hints[path],
		docsUrl
	};
	for (const [metadata, field] of [
		[FIELD_LABELS, "label"],
		[FIELD_HELP, "help"],
		[FIELD_PLACEHOLDERS, "placeholder"]
	]) for (const [path, value] of Object.entries(metadata)) if (!isPluginOwnedChannelHintPath(path)) hints[path] = {
		...hints[path],
		[field]: value
	};
	for (const path of ["agents.defaults.models.*", "agents.entries.*.models.*"]) {
		const runtimePath = `${path}.agentRuntime`;
		const codeModePath = `${path}.codeMode`;
		hints[runtimePath] = {
			...hints[runtimePath],
			order: -2
		};
		hints[codeModePath] = {
			...hints[codeModePath],
			order: -1,
			placeholder: "Default"
		};
	}
	return applyConfigTierHints(hints);
}
/** Mark sensitive config paths in a hint map without overwriting explicit sensitivity metadata. */
function applySensitiveHints(hints, allowedKeys) {
	const next = { ...hints };
	const keys = allowedKeys ? [...allowedKeys] : Object.keys(next);
	for (const key of keys) {
		const current = next[key];
		if (current?.sensitive !== void 0) continue;
		if (isSensitiveConfigPath(key)) next[key] = {
			...current,
			sensitive: true
		};
	}
	return next;
}
/** Add the sensitive-url tag to hint paths that carry URLs with credential risk. */
function applySensitiveUrlHints(hints, allowedKeys) {
	const next = { ...hints };
	const keys = allowedKeys ? [...allowedKeys] : Object.keys(next);
	for (const key of keys) {
		if (!isSensitiveUrlConfigPath(key)) continue;
		const current = next[key];
		const tags = new Set(current?.tags ?? []);
		tags.add(SENSITIVE_URL_HINT_TAG);
		next[key] = {
			...current,
			tags: [...tags]
		};
	}
	return next;
}
/**
* Traverses the Zod schema tree and returns a copy of `hints` with every
* sensitive path marked and credential-bearing URL paths tagged.
*/
function mapSensitivePaths(schema, path, hints) {
	const next = { ...hints };
	const urlPaths = /* @__PURE__ */ new Set();
	walkConfigSchema(schema, path, (fieldSchema, fieldPath) => {
		if (sensitive.has(fieldSchema)) next[fieldPath] = {
			...next[fieldPath],
			sensitive: true
		};
		if (fieldPath && isSensitiveUrlConfigPath(fieldPath)) urlPaths.add(fieldPath);
	});
	return applySensitiveUrlHints(next, urlPaths);
}
//#endregion
//#region src/config/schema-base.ts
/**
* Recursively walk a JSON Schema object and apply field docs using dot-path
* matching. Existing titles/descriptions (for example from Zod metadata) are
* preserved.
*/
function applyFieldDocumentation(node, prefixes = [""]) {
	const props = node.properties;
	if (props) for (const [key, child] of Object.entries(props)) {
		const childObj = asSchemaObject(child);
		if (!childObj) continue;
		const childPrefixes = prefixes.map((prefix) => prefix ? `${prefix}.${key}` : key);
		applyNodeDocumentation(childObj, childPrefixes);
		applyFieldDocumentation(childObj, childPrefixes);
	}
	if (node.additionalProperties && typeof node.additionalProperties === "object") {
		const addObj = asSchemaObject(node.additionalProperties);
		if (addObj) {
			const wildcardPrefixes = prefixes.map((prefix) => prefix ? `${prefix}.*` : "*");
			applyNodeDocumentation(addObj, wildcardPrefixes);
			applyFieldDocumentation(addObj, wildcardPrefixes);
		}
	}
	if (node.items) {
		const itemsObj = asSchemaObject(node.items);
		if (itemsObj) {
			const itemPrefixes = Array.from(new Set(prefixes.flatMap((prefix) => {
				const arrayPath = prefix ? `${prefix}[]` : "[]";
				const wildcardAlias = prefix ? `${prefix}.*` : "*";
				return wildcardAlias === arrayPath ? [arrayPath] : [wildcardAlias, arrayPath];
			})));
			applyNodeDocumentation(itemsObj, itemPrefixes);
			applyFieldDocumentation(itemsObj, itemPrefixes);
		}
	}
	for (const keyword of [
		"anyOf",
		"oneOf",
		"allOf"
	]) {
		const branches = node[keyword];
		if (Array.isArray(branches)) for (const branch of branches) {
			const branchObj = asSchemaObject(branch);
			if (branchObj) applyFieldDocumentation(branchObj, prefixes);
		}
	}
}
function applyNodeDocumentation(node, pathCandidates) {
	for (const path of pathCandidates) {
		const title = FIELD_LABELS[path];
		if (!node.title && title) node.title = title;
		const description = FIELD_HELP[path];
		if (!node.description && description) node.description = description;
	}
}
function preparePublicSchema(schema) {
	const root = asSchemaObject(schema);
	if (!root || !root.properties) return schema;
	delete root.properties.$schema;
	if (Array.isArray(root.required)) root.required = root.required.filter((key) => key !== "$schema");
	const channelsNode = asSchemaObject(root.properties.channels);
	if (channelsNode) channelsNode.additionalProperties = true;
	return schema;
}
let baseConfigSchemaStablePayload = null;
function computeBaseConfigSchemaStablePayload() {
	if (baseConfigSchemaStablePayload) return baseConfigSchemaStablePayload;
	const schema = OpenClawSchema.toJSONSchema({
		io: "input",
		target: "draft-07",
		unrepresentable: "any"
	});
	schema.title = "OpenClawConfig";
	const schemaRoot = asSchemaObject(schema);
	if (schemaRoot) applyFieldDocumentation(schemaRoot);
	const baseHints = mapSensitivePaths(OpenClawSchema, "", buildBaseHints());
	const publicSchema = preparePublicSchema(schema);
	const stablePayload = {
		schema: publicSchema,
		uiHints: applyResolvedConfigTierHints(publicSchema, baseHints),
		version: VERSION
	};
	baseConfigSchemaStablePayload = stablePayload;
	return stablePayload;
}
function computeBaseConfigSchemaResponse(params) {
	const stablePayload = computeBaseConfigSchemaStablePayload();
	return {
		schema: cloneSchema(stablePayload.schema),
		uiHints: cloneSchema(stablePayload.uiHints),
		version: stablePayload.version,
		generatedAt: params?.generatedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region src/config/schema.channel-field-help.ts
/**
* Help text for the channel leaves every channel inherits from the shared
* account shape. Channels declare their own hints for provider-specific keys;
* without this table those shared keys render as a bare label in the Control UI.
*/
const SHARED_CHANNEL_FIELD_HELP = {
	ackReaction: "Emoji reaction added to an inbound message while the agent works on it.",
	accounts: "Additional named accounts for this channel. Each one takes the same settings.",
	actions: "Which channel actions (messages, reactions, threads, search) the agent may call.",
	agentId: "Pin inbound messages from this channel to one agent.",
	allowBots: "Accept messages authored by other bots. Loop protection still applies.",
	allowFrom: "Sender ids allowed to reach the agent. Required by \"allowlist\"; use [\"*\"] to allow everyone.",
	botLoopProtection: "Guards against bot-to-bot reply loops once bot messages are accepted.",
	capabilities: "Override the channel capabilities OpenClaw assumes this account supports.",
	commands: "Native command surface for this channel, such as slash commands and command menus.",
	configWrites: "Let this channel write config in response to its own commands and events.",
	contextVisibility: "How much quoted context from other senders reaches the agent: \"all\" keeps it, the allowlist modes gate it by sender.",
	dangerouslyAllowNameMatching: "Break-glass compatibility: match allowlist entries by mutable display name instead of stable ids. Keep this off.",
	defaultAccount: "Account used when an outbound request does not name one.",
	defaultTo: "Target used for outbound messages when the caller supplies none.",
	dm: "Settings that apply only to direct messages on this channel.",
	dmHistoryLimit: "Channel-specific direct-message history limit. Consult channel guidance for message-window defaults and session user-turn trimming; zero has different meanings for those consumers.",
	dmPolicy: "Who may DM the agent: \"pairing\" approves each new sender, \"allowlist\" trusts allowFrom, \"open\" allows anyone, \"disabled\" turns DMs off.",
	dms: "Per-conversation overrides, keyed by DM id.",
	enabled: "Turn this channel on or off without removing its configuration.",
	execApprovals: "Approval prompts for commands that need operator sign-off, delivered in this channel.",
	groupAllowFrom: "Sender ids allowed in group chats. Falls back to allowFrom when unset.",
	groupPolicy: "Who may use the agent in groups: \"allowlist\" trusts groupAllowFrom, \"open\" allows any group, \"disabled\" turns group chat off.",
	groups: "Per-group overrides, keyed by group id.",
	healthMonitor: "Per-channel opt-out for the health monitor that restarts stalled channels.",
	heartbeatVisibility: "Which heartbeat results this channel shows.",
	historyLimit: "Channel-specific history limit. Consult channel guidance for observed-message windows and session user-turn trimming; zero has different meanings for those consumers.",
	markdown: "Markdown rendering overrides for this channel.",
	mediaMaxMb: "Per-attachment media limit in MiB. Channel transport limits still apply.",
	mentionPatterns: "Extra patterns that count as mentioning the agent in group chats.",
	model: "Model override for runs started from this channel.",
	name: "Display name for this account in the Control UI and logs.",
	network: "Outbound network settings for this channel, such as timeouts and retries.",
	proxy: "Proxy used for this channel's outbound connections.",
	reactionAllowlist: "Sender ids whose reactions reach the agent when reactionNotifications is \"allowlist\".",
	reactionLevel: "How freely the agent adds its own reactions to messages.",
	reactionNotifications: "Which inbound reactions reach the agent.",
	replyToMode: "When to attach a native reply to the message that triggered the run.",
	replyToModeByChatType: "Per-chat-type override of replyToMode.",
	requireMention: "Only respond in group chats when the agent is mentioned.",
	responsePrefix: "Text prepended to every outbound reply.",
	sendReadReceipts: "Mark inbound messages as read on this channel.",
	streaming: "How replies stream back to this channel while the agent is still working.",
	systemPrompt: "Extra system prompt applied to runs started from this channel.",
	textChunkLimit: "Maximum characters per outbound message before OpenClaw splits it.",
	threadBindings: "How chat threads bind to agent sessions, including idle expiry and spawning.",
	tokenFile: "Read the token from this file instead of storing it inline in config.",
	typingIndicator: "How this channel signals that the agent is working.",
	webhookHost: "Interface the inbound webhook listener binds to.",
	webhookPath: "Path the inbound webhook listener serves.",
	webhookPort: "Port the inbound webhook listener binds to.",
	webhookSecret: "Shared secret used to verify inbound webhook requests.",
	webhookUrl: "Public URL the provider should deliver webhooks to."
};
const SHARED_CHANNEL_FIELD_PATH = /^channels\.[^.]+(?:\.accounts\.[^.]+)?\.([^.]+)$/;
/** Fill missing help on shared channel leaves without overriding channel hints. */
function applySharedChannelFieldHelp(hints) {
	const next = { ...hints };
	for (const [path, hint] of Object.entries(hints)) {
		if (hint?.help !== void 0) continue;
		const field = SHARED_CHANNEL_FIELD_PATH.exec(path)?.[1];
		const help = field ? SHARED_CHANNEL_FIELD_HELP[field] : void 0;
		if (!help) continue;
		next[path] = {
			...hint,
			help
		};
	}
	return next;
}
//#endregion
//#region src/config/schema.lookup.ts
const FORBIDDEN_LOOKUP_SEGMENTS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
const LOOKUP_SCHEMA_STRING_KEYS = /* @__PURE__ */ new Set([
	"$id",
	"$schema",
	"title",
	"description",
	"format",
	"pattern",
	"contentEncoding",
	"contentMediaType"
]);
const LOOKUP_SCHEMA_NUMBER_KEYS = /* @__PURE__ */ new Set([
	"minimum",
	"maximum",
	"exclusiveMinimum",
	"exclusiveMaximum",
	"multipleOf",
	"minLength",
	"maxLength",
	"minItems",
	"maxItems",
	"minProperties",
	"maxProperties"
]);
const LOOKUP_SCHEMA_BOOLEAN_KEYS = /* @__PURE__ */ new Set([
	"additionalProperties",
	"uniqueItems",
	"deprecated",
	"readOnly",
	"writeOnly"
]);
const MAX_LOOKUP_PATH_SEGMENTS = 32;
const LOOKUP_SCHEMA_COMPOSITION_KEYS = [
	"anyOf",
	"oneOf",
	"allOf"
];
const LOOKUP_SCHEMA_NESTED_FORM_DEPTH = 4;
function normalizeLookupPath(path) {
	return path.trim().replace(/\[(\*|\d*)\]/g, (_match, segment) => `.${segment || "*"}`).replace(/^\.+|\.+$/g, "").replace(/\.+/g, ".");
}
function splitLookupPath(path) {
	const normalized = normalizeLookupPath(path);
	return normalized ? normalized.split(".").filter(Boolean) : [];
}
function resolveUiHintMatch(uiHints, path, splitPath) {
	return findWildcardHintMatch({
		uiHints,
		path,
		splitPath
	});
}
function resolveItemsSchema(schema, index) {
	if (Array.isArray(schema.items)) {
		const entry = index === void 0 ? schema.items.find((candidate) => typeof candidate === "object" && candidate !== null) : schema.items[index];
		return entry && typeof entry === "object" ? entry : null;
	}
	return schema.items && typeof schema.items === "object" ? schema.items : null;
}
function resolveLookupChildSchema(schema, segment) {
	if (FORBIDDEN_LOOKUP_SEGMENTS.has(segment)) return null;
	const properties = schema.properties;
	if (properties && Object.hasOwn(properties, segment)) return asSchemaObject(properties[segment]);
	const itemIndex = parseConfigPathArrayIndex(segment);
	const items = resolveItemsSchema(schema, itemIndex);
	if ((segment === "*" || itemIndex !== void 0) && items) return items;
	for (const key of LOOKUP_SCHEMA_COMPOSITION_KEYS) {
		const variants = schema[key];
		if (!Array.isArray(variants)) continue;
		for (const variant of variants) {
			const variantSchema = asSchemaObject(variant);
			const resolved = variantSchema ? resolveLookupChildSchema(variantSchema, segment) : null;
			if (resolved) return resolved;
		}
	}
	if (schema.additionalProperties && typeof schema.additionalProperties === "object") return schema.additionalProperties;
	return null;
}
function classifyLookupChildSchema(schema, segment) {
	if (schema.properties && Object.hasOwn(schema.properties, segment)) return "property";
	if (parseConfigPathArrayIndex(segment) !== void 0 && resolveItemsSchema(schema)) return "array-index";
	for (const key of LOOKUP_SCHEMA_COMPOSITION_KEYS) {
		const variants = schema[key];
		if (!Array.isArray(variants)) continue;
		for (const variant of variants) {
			const variantSchema = asSchemaObject(variant);
			const kind = variantSchema ? classifyLookupChildSchema(variantSchema, segment) : null;
			if (kind) return kind;
		}
	}
	if (schema.additionalProperties === true || typeof schema.additionalProperties === "object") return propertyNameSchemaAllows(schema.propertyNames, segment) ? "record-key" : "invalid-record-key";
	return null;
}
const PROPERTY_NAME_SCHEMA_KEYS = /* @__PURE__ */ new Set([
	"$id",
	"$schema",
	"title",
	"description",
	"type",
	"const",
	"enum",
	"pattern",
	"minLength",
	"maxLength",
	"anyOf",
	"oneOf",
	"allOf"
]);
function propertyNameSchemaAllows(schema, value) {
	if (schema === void 0 || schema === true) return true;
	if (schema === false) return false;
	const object = asSchemaObject(schema);
	if (!object || Object.keys(object).some((key) => !PROPERTY_NAME_SCHEMA_KEYS.has(key))) return false;
	const types = Array.isArray(object.type) ? object.type : [object.type];
	if (object.type !== void 0 && !types.includes("string")) return false;
	if (object.const !== void 0 && object.const !== value) return false;
	if (Array.isArray(object.enum) && !object.enum.includes(value)) return false;
	if (typeof object.minLength === "number" && value.length < object.minLength) return false;
	if (typeof object.maxLength === "number" && value.length > object.maxLength) return false;
	if (typeof object.pattern === "string") try {
		if (!new RegExp(object.pattern).test(value)) return false;
	} catch {
		return false;
	}
	if (object.allOf?.some((candidate) => !propertyNameSchemaAllows(candidate, value))) return false;
	if (object.anyOf && !object.anyOf.some((candidate) => propertyNameSchemaAllows(candidate, value))) return false;
	if (object.oneOf && object.oneOf.filter((candidate) => propertyNameSchemaAllows(candidate, value)).length !== 1) return false;
	return true;
}
/** Classify one already-parsed path segment without losing dots inside record keys. */
function classifyConfigSchemaPathSegment(response, parentParts, segment) {
	let current = asSchemaObject(response.schema);
	if (!current) return null;
	for (const parentPart of parentParts) {
		const next = resolveLookupChildSchema(current, parentPart);
		if (!next) return null;
		current = next;
	}
	return classifyLookupChildSchema(current, segment);
}
function stripSchemaForLookup(schema, nestedFormDepth = 0) {
	const next = {};
	for (const [key, value] of Object.entries(schema)) {
		if (LOOKUP_SCHEMA_STRING_KEYS.has(key) && typeof value === "string") {
			next[key] = value;
			continue;
		}
		if (LOOKUP_SCHEMA_NUMBER_KEYS.has(key) && typeof value === "number") {
			next[key] = value;
			continue;
		}
		if (LOOKUP_SCHEMA_BOOLEAN_KEYS.has(key) && typeof value === "boolean") {
			next[key] = value;
			continue;
		}
		if (key === "type") {
			if (typeof value === "string") next[key] = value;
			else if (Array.isArray(value) && value.every((entry) => typeof entry === "string")) next[key] = [...value];
			continue;
		}
		if (key === "enum" && Array.isArray(value)) {
			const entries = value.filter((entry) => entry === null || typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean");
			if (entries.length === value.length) next[key] = [...entries];
			continue;
		}
		if (key === "const" && (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean")) next[key] = value;
	}
	if (schema.properties && (nestedFormDepth > 0 && nestedFormDepth <= LOOKUP_SCHEMA_NESTED_FORM_DEPTH || schema.additionalProperties && typeof schema.additionalProperties === "object")) next.properties = Object.fromEntries(Object.entries(schema.properties).map(([key, child]) => [key, stripSchemaForLookup(child, nestedFormDepth + 1)]));
	if (schema.additionalProperties && typeof schema.additionalProperties === "object") next.additionalProperties = stripSchemaForLookup(schema.additionalProperties, nestedFormDepth + 1);
	if (Array.isArray(schema.items)) next.items = schema.items.map((item) => stripSchemaForLookup(item, nestedFormDepth + 1));
	else if (schema.items && typeof schema.items === "object") next.items = stripSchemaForLookup(schema.items, nestedFormDepth + 1);
	if (nestedFormDepth <= LOOKUP_SCHEMA_NESTED_FORM_DEPTH) for (const key of LOOKUP_SCHEMA_COMPOSITION_KEYS) {
		const variants = schema[key];
		if (!Array.isArray(variants)) continue;
		next[key] = variants.filter((variant) => variant && typeof variant === "object").map((variant) => stripSchemaForLookup(variant, nestedFormDepth + 1));
	}
	return next;
}
function buildLookupChildren(schema, path, uiHints, splitPath, resolveReloadMetadata) {
	const children = [];
	const required = new Set(schema.required ?? []);
	const pushChild = (key, childSchema, isRequired) => {
		const childPath = path ? `${path}.${key}` : key;
		const resolvedHint = resolveUiHintMatch(uiHints, childPath, splitPath);
		const reloadMetadata = resolveReloadMetadata?.(childPath);
		children.push({
			key,
			path: childPath,
			type: childSchema.type,
			required: isRequired,
			hasChildren: schemaHasChildren(childSchema),
			reloadKind: reloadMetadata?.kind,
			hint: resolvedHint?.hint,
			hintPath: resolvedHint?.path
		});
	};
	for (const [key, childSchema] of Object.entries(schema.properties ?? {})) pushChild(key, childSchema, required.has(key));
	const wildcardSchema = (schema.additionalProperties && typeof schema.additionalProperties === "object" && !Array.isArray(schema.additionalProperties) ? schema.additionalProperties : null) ?? resolveItemsSchema(schema);
	if (wildcardSchema) pushChild("*", wildcardSchema, false);
	return children;
}
function lookupConfigSchema(response, path, resolveReloadMetadata) {
	const wantsRoot = path.trim() === ".";
	const normalizedPath = normalizeLookupPath(path);
	if (!normalizedPath && !wantsRoot) return null;
	const parts = splitLookupPath(normalizedPath);
	if (!wantsRoot && parts.length === 0 || parts.length > MAX_LOOKUP_PATH_SEGMENTS) return null;
	let current = asSchemaObject(response.schema);
	if (!current) return null;
	for (const segment of parts) {
		const next = resolveLookupChildSchema(current, segment);
		if (!next) return null;
		current = next;
	}
	const hintParts = /* @__PURE__ */ new Map();
	const splitHintPath = schemaHasChildren(current) ? (hintPath) => {
		let cachedParts = hintParts.get(hintPath);
		if (!cachedParts) {
			cachedParts = splitLookupPath(hintPath);
			hintParts.set(hintPath, cachedParts);
		}
		return cachedParts;
	} : splitLookupPath;
	const resolvedHint = resolveUiHintMatch(response.uiHints, normalizedPath, splitHintPath);
	const reloadMetadata = resolveReloadMetadata?.(normalizedPath);
	return {
		path: wantsRoot ? "." : normalizedPath,
		schema: stripSchemaForLookup(current),
		reloadKind: reloadMetadata?.kind,
		hint: resolvedHint?.hint,
		hintPath: resolvedHint?.path,
		children: buildLookupChildren(current, wantsRoot ? "" : normalizedPath, response.uiHints, splitHintPath, resolveReloadMetadata)
	};
}
//#endregion
//#region src/config/schema.ts
function isObjectSchema(schema) {
	const type = schema.type;
	if (type === "object") return true;
	if (Array.isArray(type) && type.includes("object")) return true;
	return Boolean(schema.properties || schema.additionalProperties);
}
function mergeObjectSchema(base, extension) {
	const mergedRequired = /* @__PURE__ */ new Set([...base.required ?? [], ...extension.required ?? []]);
	const merged = {
		...base,
		...extension,
		properties: {
			...base.properties,
			...extension.properties
		}
	};
	if (mergedRequired.size > 0) merged.required = Array.from(mergedRequired);
	const additional = extension.additionalProperties ?? base.additionalProperties;
	if (additional !== void 0) merged.additionalProperties = additional;
	return merged;
}
const EXTENSION_SCHEMA_MAX_BYTES = 262144;
const EXTENSION_SCHEMA_TOTAL_MAX_BYTES = 2097152;
const EXTENSION_SCHEMA_MAX_ITEMS = 256;
function schemaJsonBytes(schema) {
	try {
		return Buffer.byteLength(JSON.stringify(schema), "utf-8");
	} catch {
		return Number.POSITIVE_INFINITY;
	}
}
function buildOmittedExtensionConfigSchema(kind, id) {
	return {
		type: "object",
		additionalProperties: true,
		description: `${kind} config schema for ${id} was omitted from the full config.schema response because installed extension schemas exceeded the Gateway response budget.`
	};
}
function limitExtensionSchemas(params) {
	let totalBytes = 0;
	let includedItems = 0;
	const keepSchema = (schema) => {
		const bytes = schemaJsonBytes(schema);
		if (!Number.isFinite(bytes) || bytes > EXTENSION_SCHEMA_MAX_BYTES || totalBytes + bytes > EXTENSION_SCHEMA_TOTAL_MAX_BYTES || includedItems >= EXTENSION_SCHEMA_MAX_ITEMS) return false;
		totalBytes += bytes;
		includedItems += 1;
		return true;
	};
	return {
		plugins: params.plugins.map((plugin) => {
			if (!plugin.configSchema || keepSchema(plugin.configSchema)) return plugin;
			return {
				...plugin,
				configSchema: buildOmittedExtensionConfigSchema("plugin", plugin.id)
			};
		}),
		channels: params.channels.map((channel) => {
			if (!channel.configSchema || keepSchema(channel.configSchema)) return channel;
			return {
				...channel,
				configSchema: buildOmittedExtensionConfigSchema("channel", channel.id)
			};
		})
	};
}
function collectExtensionHintKeys(hints, plugins, channels) {
	const keys = /* @__PURE__ */ new Set();
	const hintKeys = Object.keys(hints);
	const collectPrefixedHintKeys = (prefix) => {
		const childPrefix = `${prefix}.`;
		for (const key of hintKeys) if (key === prefix || key.startsWith(childPrefix)) keys.add(key);
	};
	const collectSchemaKeys = (schema, basePath) => {
		const node = asSchemaObject(schema);
		if (!node) return;
		keys.add(basePath);
		for (const [propertyKey, propertySchema] of Object.entries(node.properties ?? {})) collectSchemaKeys(propertySchema, `${basePath}.${propertyKey}`);
		if (node.additionalProperties && typeof node.additionalProperties === "object") collectSchemaKeys(node.additionalProperties, `${basePath}.*`);
		if (Array.isArray(node.items)) {
			for (const item of node.items) if (item && typeof item === "object") collectSchemaKeys(item, `${basePath}[]`);
			return;
		}
		if (node.items && typeof node.items === "object") collectSchemaKeys(node.items, `${basePath}[]`);
	};
	for (const plugin of plugins) {
		const id = plugin.id.trim();
		if (!id) continue;
		const prefix = `plugins.entries.${id}`;
		collectPrefixedHintKeys(prefix);
		collectSchemaKeys(plugin.configSchema, `${prefix}.config`);
	}
	for (const channel of channels) {
		const id = channel.id.trim();
		if (!id) continue;
		const prefix = `channels.${id}`;
		collectPrefixedHintKeys(prefix);
		collectSchemaKeys(channel.configSchema, prefix);
	}
	return keys;
}
function applyMetadataHints(hints, plugins, channels) {
	const next = { ...hints };
	const mergeRelativeHints = (basePath, uiHints) => {
		for (const [relPathRaw, hint] of Object.entries(uiHints ?? {})) {
			const relPath = relPathRaw.trim().replace(/^\./, "");
			if (!relPath) continue;
			const key = `${basePath}.${relPath}`;
			next[key] = {
				...next[key],
				...hint
			};
		}
	};
	for (const plugin of plugins) {
		const id = plugin.id.trim();
		if (!id) continue;
		const name = (plugin.name ?? id).trim() || id;
		const basePath = `plugins.entries.${id}`;
		next[basePath] = {
			...next[basePath],
			label: name,
			help: plugin.description ? `${plugin.description} (plugin: ${id})` : `Plugin entry for ${id}.`
		};
		next[`${basePath}.enabled`] = {
			...next[`${basePath}.enabled`],
			label: `Enable ${name}`
		};
		next[`${basePath}.config`] = {
			...next[`${basePath}.config`],
			label: `${name} Config`,
			help: `Plugin-defined config payload for ${id}.`,
			...plugin.configGroups ? { groups: plugin.configGroups } : {}
		};
		mergeRelativeHints(`${basePath}.config`, plugin.configUiHints);
		for (const relPath of plugin.configSecretInputPaths ?? []) {
			const key = `${basePath}.config.${relPath}`;
			next[key] = {
				...next[key],
				sensitive: true
			};
		}
	}
	for (const channel of channels) {
		const id = channel.id.trim();
		if (!id) continue;
		const basePath = `channels.${id}`;
		const current = next[basePath] ?? {};
		const label = channel.label?.trim();
		const help = channel.description?.trim();
		next[basePath] = {
			...current,
			...label ? { label } : {},
			...help ? { help } : {}
		};
		mergeRelativeHints(basePath, channel.configUiHints);
	}
	const channelList = listHeartbeatTargetChannels(channels);
	const help = `Delivery target ("owner", "last", "none", or a channel id).${channelList.length ? ` Known channels: ${channelList.join(", ")}.` : ""}`;
	for (const path of ["agents.defaults.heartbeat.target", "agents.entries.*.heartbeat.target"]) {
		const current = next[path] ?? {};
		next[path] = {
			...current,
			help: current.help ?? help,
			placeholder: current.placeholder ?? "owner"
		};
	}
	return next;
}
function listHeartbeatTargetChannels(channels) {
	const seen = /* @__PURE__ */ new Set();
	const ordered = [];
	for (const id of [...CHANNEL_IDS, ...channels.map((channel) => channel.id)]) {
		const normalized = normalizeLowercaseStringOrEmpty(id);
		if (!normalized || seen.has(normalized)) continue;
		seen.add(normalized);
		ordered.push(normalized);
	}
	return ordered;
}
/** Mutate a caller-owned schema; cached inputs must be cloned before merging. */
function mergeExtensionSchemas(schema, channels, plugins) {
	const root = asSchemaObject(schema);
	const pluginsNode = asSchemaObject(root?.properties?.plugins);
	const entriesNode = asSchemaObject(pluginsNode?.properties?.entries);
	const entryBase = asSchemaObject(entriesNode?.additionalProperties);
	const entryProperties = entriesNode?.properties ?? {};
	if (entriesNode && plugins) entriesNode.properties = entryProperties;
	for (const plugin of plugins ?? []) {
		if (!entriesNode || !plugin.configSchema) continue;
		const entryObject = entryBase ? cloneSchema(entryBase) : { type: "object" };
		const baseConfigSchema = asSchemaObject(entryObject.properties?.config);
		const pluginConfigSchema = cloneSchema(plugin.configSchema);
		const pluginSchema = asSchemaObject(pluginConfigSchema);
		const nextConfigSchema = baseConfigSchema && pluginSchema && isObjectSchema(baseConfigSchema) && isObjectSchema(pluginSchema) ? mergeObjectSchema(baseConfigSchema, pluginSchema) : pluginConfigSchema;
		entryObject.properties = {
			...entryObject.properties,
			config: nextConfigSchema
		};
		entryProperties[plugin.id] = entryObject;
	}
	const channelsNode = asSchemaObject(root?.properties?.channels);
	if (!channelsNode) return schema;
	const channelProps = channelsNode.properties ?? {};
	channelsNode.properties = channelProps;
	for (const channel of channels) {
		if (!channel.configSchema) continue;
		const existing = asSchemaObject(channelProps[channel.id]);
		const incoming = asSchemaObject(channel.configSchema);
		if (existing && incoming && isObjectSchema(existing) && isObjectSchema(incoming)) channelProps[channel.id] = mergeObjectSchema(existing, incoming);
		else channelProps[channel.id] = cloneSchema(channel.configSchema);
	}
	return schema;
}
let cachedBase = null;
const mergedSchemaCache = /* @__PURE__ */ new Map();
function buildMergedSchemaCacheKey(params) {
	const plugins = params.plugins.map((plugin) => ({
		id: plugin.id,
		name: plugin.name,
		description: plugin.description,
		configSchema: plugin.configSchema ?? null,
		configSecretInputPaths: plugin.configSecretInputPaths ?? null,
		configUiHints: plugin.configUiHints ?? null,
		configGroups: plugin.configGroups ?? null
	})).toSorted((a, b) => a.id.localeCompare(b.id));
	const channels = params.channels.map((channel) => ({
		id: channel.id,
		label: channel.label,
		description: channel.description,
		configSchema: channel.configSchema ?? null,
		configUiHints: channel.configUiHints ?? null
	})).toSorted((a, b) => a.id.localeCompare(b.id));
	const hash = crypto.createHash("sha256");
	hash.update("{\"plugins\":[");
	plugins.forEach((plugin, index) => {
		if (index > 0) hash.update(",");
		hash.update(JSON.stringify(plugin));
	});
	hash.update("],\"channels\":[");
	channels.forEach((channel, index) => {
		if (index > 0) hash.update(",");
		hash.update(JSON.stringify(channel));
	});
	hash.update("]}");
	return hash.digest("hex");
}
function setMergedSchemaCache(key, value) {
	pruneMapToMaxSize(mergedSchemaCache, 63);
	mergedSchemaCache.set(key, value);
}
function getBundledChannelSchemaMetadata() {
	return GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.map((entry) => {
		const metadata = Object.assign({ id: entry.channelId }, entry.label ? { label: entry.label } : {}, entry.description ? { description: entry.description } : {}, { configSchema: entry.schema });
		if ("uiHints" in entry) metadata.configUiHints = entry.uiHints;
		return metadata;
	});
}
/**
* Materialize the presentation hints that need the merged schema: tiers resolve
* per path, then shared channel leaves get their help.
*/
function resolveMergedUiHints(schema, hints, changedRoots) {
	const root = asSchemaObject(schema);
	return applySharedChannelFieldHelp(applyResolvedConfigTierHints({
		...root,
		properties: Object.fromEntries(Object.entries(root?.properties ?? {}).filter(([key]) => changedRoots.includes(key)))
	}, applyConfigTierHints(hints, { includePluginOwnedChannels: true })));
}
function buildBaseConfigSchema() {
	if (cachedBase) return cachedBase;
	const generated = computeBaseConfigSchemaResponse();
	const bundledChannels = getBundledChannelSchemaMetadata();
	const mergedWithoutSensitiveHints = applyMetadataHints(generated.uiHints, [], bundledChannels);
	const mergedHints = applySensitiveHints(mergedWithoutSensitiveHints, collectExtensionHintKeys(mergedWithoutSensitiveHints, [], bundledChannels));
	const mergedSchema = mergeExtensionSchemas(generated.schema, bundledChannels);
	const next = {
		...generated,
		schema: mergedSchema,
		uiHints: resolveMergedUiHints(mergedSchema, mergedHints, ["channels"])
	};
	cachedBase = next;
	return next;
}
function buildConfigSchemaCore(params) {
	const base = buildBaseConfigSchema();
	const { plugins, channels } = limitExtensionSchemas({
		plugins: params?.plugins ?? [],
		channels: params?.channels ?? []
	});
	if (plugins.length === 0 && channels.length === 0) return base;
	const cacheKey = params?.cache !== false ? buildMergedSchemaCacheKey({
		plugins,
		channels
	}) : null;
	if (cacheKey) {
		const cached = mergedSchemaCache.get(cacheKey);
		if (cached) return cached;
	}
	const mergedWithoutSensitiveHints = applyMetadataHints(base.uiHints, plugins, channels);
	const extensionHintKeys = collectExtensionHintKeys(mergedWithoutSensitiveHints, plugins, channels);
	const mergedHints = applySensitiveUrlHints(applySensitiveHints(mergedWithoutSensitiveHints, extensionHintKeys), extensionHintKeys);
	const mergedSchema = mergeExtensionSchemas(cloneSchema(base.schema), channels, plugins);
	const changedRoots = [...plugins.length ? ["plugins"] : [], ...channels.length ? ["channels"] : []];
	const merged = {
		...base,
		schema: mergedSchema,
		uiHints: resolveMergedUiHints(mergedSchema, mergedHints, changedRoots)
	};
	if (cacheKey) setMergedSchemaCache(cacheKey, merged);
	return merged;
}
//#endregion
export { isKernelOwnedChannelConfigKey as i, classifyConfigSchemaPathSegment as n, lookupConfigSchema as r, buildConfigSchemaCore as t };
