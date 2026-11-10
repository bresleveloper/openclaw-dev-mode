import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DaxQ5QU2.mjs";
//#region src/agents/tool-description-presets.ts
const SECRET_EGRESS_USAGE_PROMPT = "Gateway-host commands: use auto-injected opaque env sentinel under stored name. No secret templates; never override/print that variable. Native shell/sandbox/node: no protected injection. First command snapshots store for run; late saves need next turn.";
const EXEC_TOOL_DISPLAY_SUMMARY = "Run shell now.";
const PROCESS_TOOL_DISPLAY_SUMMARY = "Inspect/control exec sessions.";
const CRON_TOOL_DISPLAY_SUMMARY = "Schedule reminders, automations, wake events.";
const SESSIONS_LIST_TOOL_DISPLAY_SUMMARY = "List visible sessions; filters/previews.";
const SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY = "Read sanitized session history.";
const SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY = "Search past session transcripts.";
const SESSIONS_SEND_TOOL_DISPLAY_SUMMARY = "Run same-Gateway session/agent.";
const SESSIONS_SEND_RESULT_GUIDANCE = "Accepted results report target admission as `targetDisposition: \"queued\"` or `\"steered\"`; `delivery.status` is only later reply delivery state, and neither proves target completion.";
const SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY = "Spawn hidden subagent (ephemeral) or visible work session (durable).";
const SESSIONS_SPAWN_SUBAGENT_TOOL_DISPLAY_SUMMARY = "Spawn subagent session.";
const AGENTS_WAIT_TOOL_DISPLAY_SUMMARY = "Wait for collector subagents.";
const SESSION_STATUS_TOOL_DISPLAY_SUMMARY = "Show session status/model/usage.";
const ASK_USER_TOOL_DISPLAY_SUMMARY = "Ask the user and wait for an answer.";
const SUGGEST_TASK_TOOL_DISPLAY_SUMMARY = "Suggest follow-up work for operator approval.";
const DISMISS_TASK_TOOL_DISPLAY_SUMMARY = "Withdraw a pending task suggestion.";
const SKILL_WORKSHOP_TOOL_DISPLAY_SUMMARY = "Save, improve, archive, and restore your learned skills.";
function describeAgentsListTool(sessionsSpawnAvailable) {
	return sessionsSpawnAvailable ? "List configured agent ids with name/model/runtime metadata, allowed as `sessions_spawn(runtime:\"subagent\")` targets." : "List configured agent ids with name/model/runtime metadata that can be used as subagent spawn targets.";
}
function describeAgentsWaitTool(sessionsSpawnAvailable) {
	return `Wait for ${sessionsSpawnAvailable ? "collector subagents started by sessions_spawn collect=true" : "collector subagent runs"}. Accepts many run ids; returns once any completes (completed results incl. structured output, plus pending ids), or on timeoutSeconds.`;
}
const SESSION_VISIBILITY_SCOPE_COPY = {
	self: "current session only",
	tree: "current session + own spawn subtree; the main session sees all sessions of its agent",
	agent: "all sessions of this agent",
	all: "all sessions, cross-agent per tools.agentToAgent"
};
function describeSessionVisibilityScope(visibility, options) {
	if (options?.spawnRestricted && visibility === "tree") return "current session + own spawn subtree (sandbox: spawned sessions only)";
	return SESSION_VISIBILITY_SCOPE_COPY[visibility];
}
const SESSION_LINK_RULE_DESCRIPTION = "How to build Control UI URLs for sessionKey values in this result.";
function describeSessionLinkRule(base) {
	return `When pointing the user at a session, cite its Control UI URL: main session -> \`${base}/chat/<agentId>\`; any other display session key -> \`${base}/chat/<agentId>/~key/\` + key minus \`agent:<agentId>:\`, with \`:\` replaced by \`/\`.`;
}
/** Describes the sessions_list tool for model-facing instructions. */
function describeSessionsListTool(options) {
	return [
		"List visible session metadata and groups; filter ownerId/creatorId, projectId/workspaceDir, group/pinned, kind/agent/activity/archive. relationship=owned|created|involving selects the authenticated requesting user's sessions, not the agent's owner.",
		"Metadata-only by default. limit defaults to 100; larger requests stay valid but limitApplied never exceeds 200. count is this page, not an inventory total. Continue with nextOffset and identical filters while hasMore; truncationReason names a scan/byte budget. Pages are live: deduplicate by agentId/key/sessionId or restart for a fresh inventory. archived=all includes active and archived rows.",
		"Preview recent messages inline via includeLastMessage/messageLimit; includeDerivedTitles adds derived titles. enrichmentOmitted means previews exceeded the byte budget; read history separately.",
		"Use before history/send target selection.",
		...options?.sessionLinkBase ? [describeSessionLinkRule(options.sessionLinkBase)] : []
	].join(" ");
}
/** Describes the sessions_history tool for model-facing instructions. */
function describeSessionsHistoryTool(options) {
	return [
		"Read sanitized visible-session history.",
		"Before reply/debug/resume. Use messageId for anchored history; sessionId selects its transcript and requires messageId. Omit both for the latest tail. offset pages unanchored history and is ignored with messageId. limit bounds either mode. Include tool messages with includeTools.",
		"pendingInputs are accepted inputs outside model history; page with pendingBefore=nextBefore. Cancelled inputs never replay; interrupted means saved without an active retry. Eligible durable peer sends can regain queued custody on startup. Lower limit for richer pending previews.",
		...options?.sessionLinkBase ? [describeSessionLinkRule(options.sessionLinkBase)] : []
	].join(" ");
}
/** Describes the sessions_search tool for model-facing instructions. */
function describeSessionsSearchTool(options) {
	return ["Search visible past sessions for matching user and assistant text.", ...options?.sessionLinkBase ? [describeSessionLinkRule(options.sessionLinkBase)] : []].join(" ");
}
/** Describes the sessions_send tool for model-facing instructions. */
function describeSessionsSendTool(options) {
	return [
		"Run a permitted session on this Gateway by sessionKey/label, or a configured local agent by agentId; sessionKey wins redundant label. Explicit per-agent send destinations can permit messaging without transcript access.",
		"A session identifies model context, not an external address. A peer reply reaches you once: inline when available, otherwise as a later inter-session input. Continue with another sessions_send; post to channels with message.",
		SESSIONS_SEND_RESULT_GUIDANCE,
		"Omit mode to automatically continue your paused native child task; returns runId/taskRunId with task-owned completion instead of an inline wait or watch. With timeoutSeconds:0, your own running child is steered into its active run (admission only, no separate completion turn; use mode:followup for one); other sessions use ordinary message delivery. mode:notify queues ephemeral context for the next turn without waking or starting work (bounded process memory, not a durable inbox). mode:steer injects guidance into an active supported run and never starts idle work. mode:followup starts a separate turn without steering or resuming a paused task. mode:resume requires a paused native child task and rejects watch:true and positive timeoutSeconds.",
		`${options?.allowThreadTargets ? "" : "Thread chats rejected: target parent channel. "}Missing configured-agent main created. status "no_reply" is terminal, so do not wait for another reply.`,
		"A timeoutSeconds:0 followup to your existing native child gives this turn a completion to await with sessions_yield, even while queued. watch:true requires status visibility and additionally reports later target-session changes; on a steer it can claim the child's existing pending completion."
	].join(" ");
}
function describeSubagentSpawnContext(threadAvailable) {
	return ["Native: explicit context=\"isolated\" starts clean; context=\"fork\" copies requester transcript and requires the same agent.", threadAvailable ? "Omitted context follows configured threadBindings.defaultSpawnContext policy (fork by default) with thread=true; without a thread it is isolated." : "Omitted context is isolated."].join(" ");
}
const SESSIONS_SPAWN_COLLECTOR_GUIDANCE = "Default to ordinary spawn for one or a few children. Reserve `collect=true` (swarm) for large parallel fan-out (several similar children, about five or more). Collectors send no completion notification and cannot be steered; explicitly collect their results; structured result per `outputSchema`; `groupId` groups a batch.";
/** Describes the sessions_spawn tool for model-facing instructions. */
function describeSessionsSpawnTool(options) {
	const visibilityLine = options?.sessionToolsVisibility ? `Session listing/addressing obeys \`tools.sessions.visibility\` (${options.sessionToolsVisibility}: ${describeSessionVisibilityScope(options.sessionToolsVisibility, { spawnRestricted: options.spawnRestricted })}).` : `Session listing/addressing obeys \`tools.sessions.visibility\` (\`all\` default: ${describeSessionVisibilityScope("all")}).`;
	return [
		options?.acpAvailable === false ? "Spawn child session; default `runtime=\"subagent\"`." : "Spawn child session; default `runtime=\"subagent\"`; ACP needs explicit `runtime=\"acp\"`.",
		options?.threadAvailable ? "`mode=\"run\"` one-shot; `mode=\"session\"` persistent/thread-bound only on supporting requester channel." : "`mode=\"run\"` one-shot background.",
		"`agentId` targets a configured agent; `model` overrides its model; `cleanup` delete|keep hidden child session; `sandbox` inherit|require.",
		"Execute work directly by default. Delegate a bounded, independent task only when parallel execution or an independent review provides a concrete benefit. Keep dependent steps with the same owner. Once delegation is appropriate, use a hidden subagent unless the user needs a separate, independently steerable session. This includes substantial, bounded API/service investigations that can be handed off with the needed context and capabilities. For hidden subagents, omit `visible` or set it false, and report results through the parent.",
		"Native hidden or visible children support `worktree=true` with optional `projectId`, `worktreeName`, and `worktreeBaseRef`. Hidden `projectId` requires `worktree=true`; name/base always require it. Preparation is asynchronous; the first turn waits for the managed checkout. Hidden `cleanup=delete` uses session snapshot/removal; `keep` retains it. ACP does not support managed-worktree parameters. `group`, `projectGitUrl`, and cloud profiles require `visible=true`.",
		"`visible=true`: durable visible session. Use only when the user requests a separate session or needs to revisit and steer the work independently. Shows in web UI sidebar; works without UI: announcing runs report back, progress checkable. `group` places it in a custom sidebar group (a new name creates the group); omission or an empty string leaves it ungrouped. Subagent only; omit `mode` (`mode=\"run\"` is also accepted), `thread`, `thinking`, and `lightContext`; `attachments=[]` and omitted/blank `attachAs.mountPath` are accepted, but nonempty attachment staging is unsupported; inherits the caller tool-policy ceiling except for configured deny-only `delegateToolsTo` grants (not tool arguments); select a registered project with `projectId` or a managed GitHub clone with `projectGitUrl` (mutually exclusive with each other and `cwd`); may check out a git worktree via `worktree`/`worktreeName`/`worktreeBaseRef`. When its accepted result includes `sessionUrl`, channel acknowledgements put the session URL on the first line and `Owner: <label>` on the second line.",
		"Omit `placement` or use `{kind:\"local\"}` for local execution. `{kind:\"profile\",profileId,os?,machineClass?}` selects a configured cloud profile and requires `visible=true` and `worktree=true`. Cloud placement creates first, dispatches, then starts the task; failures retain the child for inspection, never fall back locally.",
		visibilityLine,
		...options?.swarmEnabled ? [SESSIONS_SPAWN_COLLECTOR_GUIDANCE] : [],
		"Inherits parent workspace. Native task arrives in the child's initial `[Subagent Task]` message.",
		...options?.acpAvailable === false ? [] : ["`runtime=\"acp\"` ids: codex, claude, gemini, opencode, or configured ACP."],
		describeSubagentSpawnContext(options?.subagentThreadAvailable === true),
		"A PR/report, long runtime, or isolated worktree alone does not justify a sidebar session. A request for a subagent does not request a separate session. No spawn for quick lookup/single read.",
		"After spawn, do non-overlap work; follow the receipt's completion mode."
	].join(" ");
}
/** Describes the session_status tool for model-facing instructions. */
function describeSessionStatusTool() {
	return [
		"Show visible-session model/usage/time/cost/tasks.",
		"`sessionKey=\"current\"` for current; UI labels are not keys.",
		"`model` overrides; `model=default` resets. Use for active model/session questions."
	].join(" ");
}
/** Describes the ask_user tool and its decision-only use policy. */
function describeAskUserTool() {
	return [
		"Ask the human user 1-3 structured questions and wait for their answer; `multiSelect` allows picking several options and `timeoutSeconds` bounds the wait.",
		"Use only when blocked on a decision genuinely theirs that cannot be resolved from the request, code, or sensible defaults; never ask whether to proceed or confirm a plan.",
		"Ask exactly one question per call unless several answers must be submitted together; one single-select question uses native controls on supported messaging channels.",
		"Put every selectable choice in `options`, never only in the question text. Put the recommended option first and suffix its label with ` (Recommended)`.",
		"Use `multiSelect` only when the user may choose several options at once; otherwise omit it.",
		"Do not include an Other option; free text is added automatically.",
		"If the result is no_answer, continue with best judgment."
	].join(" ");
}
/** Describes the secrets tool and the store semantics the model cannot observe. */
function describeSecretsTool() {
	return [
		"Protected credentials: `list` metadata first; `request` missing task-needed name + reason via human masked entry; `delete` removes an entry.",
		"Request waits for human; value goes straight to shared store, never model/chat. Use the returned store SecretRef for supported config fields.",
		"Gateway HTTPS egress only: enabled proxy + exact allowedHosts required; no hosts blocks egress, not config refs. No plaintext fallback.",
		"Protected entries cannot supply SSH/sudo passwords or subprocess stdin; `${secret:NAME}` is not shell substitution. Check the supported consumer before requesting a credential.",
		SECRET_EGRESS_USAGE_PROMPT,
		"Operator-set env entries are readable and managed separately from this protected store. no_answer means no credential was supplied."
	].join(" ");
}
//#endregion
//#region src/agents/tool-catalog.ts
/**
* Core tool catalog and profile defaults.
* Drives built-in profile allowlists, group expansion, and UI section metadata
* for OpenClaw-owned tools.
*
* This module is bundled into the Control UI via tool-policy-shared. Keep it
* pure data + tiny pure functions: a value import of server config/runtime
* modules here drags the whole gateway graph into the ui build and breaks it.
*/
const CORE_TOOL_SECTION_ORDER = [
	{
		id: "fs",
		label: "Files"
	},
	{
		id: "runtime",
		label: "Runtime"
	},
	{
		id: "web",
		label: "Web"
	},
	{
		id: "memory",
		label: "Memory"
	},
	{
		id: "sessions",
		label: "Sessions"
	},
	{
		id: "ui",
		label: "UI"
	},
	{
		id: "messaging",
		label: "Messaging"
	},
	{
		id: "automation",
		label: "Automation"
	},
	{
		id: "nodes",
		label: "Nodes"
	},
	{
		id: "agents",
		label: "Agents"
	},
	{
		id: "media",
		label: "Media"
	}
];
function coreTools(sectionId, defaults, tools) {
	return tools.map(([id, description, options]) => ({
		id,
		description,
		sectionId,
		...defaults,
		...options
	}));
}
const CORE_TOOL_DEFINITIONS = [
	...coreTools("agents", {
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	}, [["decision_evaluate", "Evaluate explicit evidence with the agent's decision model"]]),
	...coreTools("fs", {
		profiles: ["coding"],
		executionLocation: "placement"
	}, [
		["ls", "List directory entries"],
		["read", "Read file contents"],
		["write", "Create or overwrite files"],
		["edit", "Make precise edits"],
		["apply_patch", "Patch files"]
	]),
	...coreTools("runtime", { profiles: ["coding"] }, [
		[
			"exec",
			EXEC_TOOL_DISPLAY_SUMMARY,
			{ executionLocation: "placement" }
		],
		[
			"process",
			PROCESS_TOOL_DISPLAY_SUMMARY,
			{ executionLocation: "placement" }
		],
		[
			"code_execution",
			"Run sandboxed remote analysis",
			{ includeInOpenClawGroup: true }
		],
		[
			"secrets",
			"Request and manage write-only credentials",
			{
				profiles: ["coding", "messaging"],
				includeInOpenClawGroup: true
			}
		]
	]),
	...coreTools("web", {
		profiles: ["coding"],
		includeInOpenClawGroup: true
	}, [
		["web_search", "Search the web"],
		["web_fetch", "Fetch web content"],
		["x_search", "Search X posts"]
	]),
	...coreTools("memory", {
		profiles: ["coding"],
		includeInOpenClawGroup: true
	}, [
		["memory_search", "Semantic search"],
		["memory_get", "Read memory files"],
		[
			"personal_instructions",
			"Edit the requesting user’s personal instructions",
			{ profiles: ["coding", "messaging"] }
		]
	]),
	...coreTools("sessions", {
		profiles: ["coding", "messaging"],
		includeInOpenClawGroup: true
	}, [
		[
			"presence",
			"Online people, connected devices, recent activity, and connection location",
			{
				executionLocation: "gateway",
				profiles: [
					"minimal",
					"coding",
					"messaging"
				]
			}
		],
		["sessions", "Session settings: label, pin, archive, groups"],
		["sessions_list", SESSIONS_LIST_TOOL_DISPLAY_SUMMARY],
		["sessions_history", SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY],
		["sessions_search", SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY],
		["conversations_list", "List exact external conversation addresses"],
		["conversations_send", "Send to an exact external conversation"],
		["conversations_turn", "Send and wait for a correlated external reply"],
		[
			"sessions_send",
			SESSIONS_SEND_TOOL_DISPLAY_SUMMARY,
			{ executionLocation: "gateway" }
		],
		[
			"sessions_spawn",
			SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY,
			{ executionLocation: "gateway" }
		],
		[
			"github_identity_status",
			"Inspect the effective GitHub identity and credential health",
			{ profiles: ["coding"] }
		],
		[
			"github_publish",
			"Publish the reconciled session worktree as a draft GitHub pull request",
			{ profiles: ["coding"] }
		],
		[
			"agents_wait",
			AGENTS_WAIT_TOOL_DISPLAY_SUMMARY,
			{ profiles: ["coding"] }
		],
		["sessions_yield", "End turn to receive sub-agent results"],
		["subagents", "Background work: subagents, media gen, automation runs. list/cancel."],
		[
			"session_status",
			SESSION_STATUS_TOOL_DISPLAY_SUMMARY,
			{ profiles: [
				"minimal",
				"coding",
				"messaging"
			] }
		],
		[
			"suggest_task",
			SUGGEST_TASK_TOOL_DISPLAY_SUMMARY,
			{ profiles: ["coding"] }
		],
		[
			"dismiss_task",
			DISMISS_TASK_TOOL_DISPLAY_SUMMARY,
			{ profiles: ["coding"] }
		]
	]),
	...coreTools("ui", {
		profiles: ["coding"],
		includeInOpenClawGroup: true
	}, [
		[
			"browser",
			"Control web browser",
			{
				executionLocation: "placement",
				profiles: []
			}
		],
		["screen", "Drive operator web UI"],
		[
			"theme",
			"List, select, and create appearance themes",
			{ profiles: ["coding", "messaging"] }
		],
		["dashboard", "Read and arrange the session dashboard"],
		["terminal", "Use shared operator terminals with policy-governed input"],
		[
			"portal",
			"Expose local web apps through the gateway",
			{ executionLocation: "gateway" }
		],
		[
			"canvas",
			"Control node Canvas surfaces when the Canvas plugin is enabled",
			{
				profiles: [],
				includeInOpenClawGroup: false
			}
		],
		[
			"show_widget",
			"Show an interactive widget on chat or an auto-fitting dashboard",
			{ profiles: [] }
		]
	]),
	...coreTools("messaging", {
		profiles: ["messaging"],
		includeInOpenClawGroup: true
	}, [["message", "Send messages"]]),
	...coreTools("automation", {
		profiles: [],
		includeInOpenClawGroup: true
	}, [
		["heartbeat_respond", "Accept heartbeat outcomes for post-turn handling"],
		[
			AUTOMATIONS_TOOL_NAME,
			CRON_TOOL_DISPLAY_SUMMARY,
			{ profiles: ["coding"] }
		],
		[
			"gateway",
			"Update OpenClaw; read Gateway config/schema when permitted",
			{ profiles: [
				"minimal",
				"coding",
				"messaging"
			] }
		],
		[
			"plugins",
			"Manage and reload plugins",
			{ profiles: ["coding"] }
		],
		["openclaw", "Delegate OpenClaw setup and repair"]
	]),
	...coreTools("nodes", {
		profiles: [],
		includeInOpenClawGroup: true
	}, [
		["nodes", "Nodes + devices"],
		[
			"computer",
			"Control the Gateway desktop or a paired computer",
			{ executionLocation: "placement" }
		],
		["mobile_ui", "Observe and control a paired Android app"]
	]),
	...coreTools("agents", {
		profiles: ["coding"],
		includeInOpenClawGroup: true
	}, [
		[
			"agents_list",
			"List agents",
			{ profiles: [] }
		],
		["get_goal", "Get current thread goal"],
		["create_goal", "Create a thread goal"],
		["update_goal", "Complete or block a thread goal"],
		["progress_card", "Maintain the session progress card"],
		[
			"ask_user",
			ASK_USER_TOOL_DISPLAY_SUMMARY,
			{ profiles: ["coding", "messaging"] }
		],
		[
			"skill_workshop",
			SKILL_WORKSHOP_TOOL_DISPLAY_SUMMARY,
			{ executionLocation: "gateway" }
		],
		["skills_search", "Search installed eligible skills"],
		["skills_read", "Read complete installed skill instructions"]
	]),
	...coreTools("media", {
		profiles: ["coding"],
		includeInOpenClawGroup: true
	}, [
		["view_image", "Image understanding"],
		["image_generate", "Image generation"],
		["music_generate", "Music generation"],
		["video_generate", "Video generation"],
		[
			"transcripts",
			"Inspect and manage meeting transcript captures",
			{
				profiles: [],
				includeInSectionGroup: false,
				includeInOpenClawGroup: false
			}
		],
		[
			"tts",
			"Text-to-speech conversion",
			{ profiles: [] }
		],
		[
			"pdf",
			"PDF reading and extraction",
			{ profiles: [] }
		]
	])
];
const CORE_TOOL_BY_ID = new Map(CORE_TOOL_DEFINITIONS.map((tool) => [tool.id, tool]));
const CORE_WORKER_LAUNCH_TOOL_NAMES = Object.freeze(CORE_TOOL_DEFINITIONS.filter((tool) => tool.executionLocation).map((tool) => tool.id));
function resolveCoreToolExecutionLocation(toolId) {
	return CORE_TOOL_BY_ID.get(toolId)?.executionLocation ?? "gateway";
}
const CORE_TOOL_SECTIONS = CORE_TOOL_SECTION_ORDER.map(({ id, label }) => ({
	id,
	label,
	tools: CORE_TOOL_DEFINITIONS.filter((tool) => tool.sectionId === id)
}));
function listCoreToolIdsForProfile(profile) {
	return CORE_TOOL_DEFINITIONS.filter((tool) => tool.profiles.includes(profile)).map((tool) => tool.id);
}
const CORE_TOOL_PROFILES = {
	minimal: { allow: listCoreToolIdsForProfile("minimal") },
	coding: { allow: [...listCoreToolIdsForProfile("coding"), "bundle-mcp"] },
	messaging: { allow: [...listCoreToolIdsForProfile("messaging"), "bundle-mcp"] },
	full: { allow: ["*"] }
};
function buildCoreToolGroupMap() {
	const sectionToolMap = /* @__PURE__ */ new Map();
	for (const tool of CORE_TOOL_DEFINITIONS) {
		if (tool.includeInSectionGroup === false) continue;
		const groupId = `group:${tool.sectionId}`;
		const list = sectionToolMap.get(groupId) ?? [];
		list.push(tool.id);
		sectionToolMap.set(groupId, list);
	}
	return {
		"group:openclaw": CORE_TOOL_DEFINITIONS.filter((tool) => tool.includeInOpenClawGroup).map((tool) => tool.id),
		...Object.fromEntries(sectionToolMap.entries())
	};
}
/** Built-in core tool groups keyed by group id. */
const CORE_TOOL_GROUPS = buildCoreToolGroupMap();
/** Profile options shown in model/tool configuration UIs. */
const PROFILE_OPTIONS = [
	{
		id: "minimal",
		label: "Minimal"
	},
	{
		id: "coding",
		label: "Coding"
	},
	{
		id: "messaging",
		label: "Messaging"
	},
	{
		id: "full",
		label: "Full"
	}
];
/** Resolves the allow/deny policy for a built-in tool profile. */
function resolveCoreToolProfilePolicy(profile) {
	if (!profile) return;
	const resolved = CORE_TOOL_PROFILES[profile];
	if (!resolved?.allow && !resolved?.deny) return;
	return {
		allow: resolved.allow ? [...resolved.allow] : void 0,
		deny: resolved.deny ? [...resolved.deny] : void 0
	};
}
/** Lists configurable core tools; per-run authorization belongs to runtime assembly. */
function listCoreToolSections(params) {
	const swarmEnabled = params?.swarmEnabled === true;
	return CORE_TOOL_SECTIONS.map((section) => ({
		id: section.id,
		label: section.label,
		tools: section.tools.filter((tool) => (tool.id !== "agents_wait" || swarmEnabled) && (tool.id !== "personal_instructions" || params?.personalInstructionsEnabled === true)).map((tool) => ({
			id: tool.id,
			label: tool.id,
			description: tool.description
		}))
	})).filter((section) => section.tools.length > 0);
}
/** Lists built-in profile ids that include a core tool. */
function resolveCoreToolProfiles(toolId) {
	return [...CORE_TOOL_BY_ID.get(toolId)?.profiles ?? []];
}
/** Returns true when a tool id is a known core tool. */
function isKnownCoreToolId(toolId) {
	return CORE_TOOL_BY_ID.has(toolId);
}
//#endregion
export { describeSessionLinkRule as A, SESSION_STATUS_TOOL_DISPLAY_SUMMARY as C, describeAgentsWaitTool as D, describeAgentsListTool as E, describeSessionsSearchTool as F, describeSessionsSendTool as I, describeSessionsSpawnTool as L, describeSessionVisibilityScope as M, describeSessionsHistoryTool as N, describeAskUserTool as O, describeSessionsListTool as P, describeSubagentSpawnContext as R, SESSION_LINK_RULE_DESCRIPTION as S, SUGGEST_TASK_TOOL_DISPLAY_SUMMARY as T, SESSIONS_SEND_RESULT_GUIDANCE as _, listCoreToolSections as a, SESSIONS_SPAWN_SUBAGENT_TOOL_DISPLAY_SUMMARY as b, resolveCoreToolProfiles as c, DISMISS_TASK_TOOL_DISPLAY_SUMMARY as d, EXEC_TOOL_DISPLAY_SUMMARY as f, SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY as g, SESSIONS_LIST_TOOL_DISPLAY_SUMMARY as h, isKnownCoreToolId as i, describeSessionStatusTool as j, describeSecretsTool as k, ASK_USER_TOOL_DISPLAY_SUMMARY as l, SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY as m, CORE_WORKER_LAUNCH_TOOL_NAMES as n, resolveCoreToolExecutionLocation as o, PROCESS_TOOL_DISPLAY_SUMMARY as p, PROFILE_OPTIONS as r, resolveCoreToolProfilePolicy as s, CORE_TOOL_GROUPS as t, CRON_TOOL_DISPLAY_SUMMARY as u, SESSIONS_SEND_TOOL_DISPLAY_SUMMARY as v, SKILL_WORKSHOP_TOOL_DISPLAY_SUMMARY as w, SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY as x, SESSIONS_SPAWN_COLLECTOR_GUIDANCE as y };
