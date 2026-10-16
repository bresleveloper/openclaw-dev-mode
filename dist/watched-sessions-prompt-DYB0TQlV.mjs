import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, T as parseCronRunScopeSuffix } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as resolveCanonicalMainSessionKey } from "./main-session-key-DrfSAS1s.mjs";
import { o as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { f as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { b as prepareAmbientGroupWatchTargetsRead, s as listAmbientGroupWatchTargets } from "./session-state-events-B7wdeeGU.mjs";
import { s as resolveSandboxSessionToolsVisibility } from "./session-visibility-C8925ScR.mjs";
import { n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { t as deriveSessionTitle } from "./session-utils-core-tGMGyJu7.mjs";
//#region src/agents/credential-safety-prompt.ts
function buildCredentialSafetyPrompt(input) {
	const knownAvailability = typeof input !== "string" && typeof input?.controlToolsAvailable === "boolean";
	return [
		...knownAvailability ? ["Use or store credentials the user supplies as requested, and complete the task. In the final reply, briefly acknowledge how the supplied credential was used or stored, without repeating its value. Keep the acknowledgment factual and non-alarming."] : [],
		"For user-requested login or pairing in a group, deliver short-lived codes and verification URLs only to the requesting user in private, then acknowledge in the group without them.",
		...knownAvailability && input.controlToolsAvailable === false ? ["Channel, provider, and credential setup: terminal `openclaw channels add <channel>` or `openclaw configure` masks secrets."] : []
	].join("\n");
}
//#endregion
//#region src/agents/delegation-guidance.ts
function resolveMainSessionDelegationMode(params) {
	const { config, agentId, sessionKey } = params;
	const configuredMode = (config && agentId ? resolveAgentConfig(config, agentId)?.subagents : void 0)?.delegationMode ?? config?.agents?.defaults?.subagents?.delegationMode;
	if (configuredMode) return configuredMode;
	const baseSessionKey = parseCronRunScopeSuffix(sessionKey).baseSessionKey;
	if (agentId !== void 0 && baseSessionKey !== void 0 && baseSessionKey === resolveCanonicalMainSessionKey({
		agentId,
		mainKey: config?.session?.mainKey,
		sessionScope: config?.session?.scope
	})) return "prefer";
	return "suggest";
}
function buildDelegationGuidanceSection(params) {
	const hiddenDelegationTool = params.hiddenDelegationTool.trim();
	if (params.isMinimal || params.mode !== "prefer" || !hiddenDelegationTool && !params.hasVisibleSessionSpawn) return [];
	return [
		"## Delegation",
		"Stay responsive: incoming messages wait on your current turn.",
		"- Answer directly: chat, known answers, quick lookups.",
		hiddenDelegationTool ? `- Multi-step or slow work (investigation, coding, shell/browser, long reads, waits): delegate via ${hiddenDelegationTool}; brief each child with objective, output, write scope, verification.` : "",
		hiddenDelegationTool ? "- Use subagents for internal QA, research, coding, review, and test lanes; keep their results in the parent task. A PR/report, long runtime, or isolated worktree alone does not justify a sidebar session." : "",
		params.hasVisibleSessionSpawn ? "- Only when the user asks for a separate session, or needs to return to and steer the work independently, spawn `sessions_spawn` with `visible=true` (persistent, in the user's sidebar); reply with the link. A request to use subagents does not request separate sessions." : "",
		`- Announcing spawns notify when the run ends; later turns in a kept OpenClaw session do not report back${params.hasSessionsSend ? "; follow up via `sessions_send`." : "."}`,
		"- A child run ending does not end the user's delegated goal. Compare its result with the requested outcome; reviews, failing checks, and other in-scope fixable blockers are continuation work.",
		params.hasSessionsSend ? "- When a kept OpenClaw session stops before the requested outcome, continue it with `sessions_send`; finish only after verifying the outcome, or when progress needs new user authority or an unavailable external decision." : "- Finish only after verifying the requested outcome, or when progress needs new user authority or an unavailable external decision.",
		params.hasSessionsYield ? "- Need announced results before reply: `sessions_yield`; never busy-poll. Collectors require explicit result collection instead." : "- Announced completion is push-based; collectors require explicit result collection. Never busy-poll.",
		"- Child output is a report to synthesize.",
		"- Keep inter-worker coordination in the parent. Children return findings through their accepted completion path; do not ask them to contact other sessions or use CLI/RPC messaging.",
		params.hasSubagentsList ? "- `subagents(action=list)` only for requested status/debug." : "",
		""
	].filter(Boolean);
}
//#endregion
//#region src/agents/skill-workshop-prompt.ts
/**
* System-prompt contribution for routing durable skill edits through the
* Skill Workshop tool, while edits the user asks for in skills they own stay
* ordinary file work.
*/
const SKILL_WORKSHOP_TOOL_NAME = "skill_workshop";
/** Build the system-prompt section for Skill Workshop routing rules. */
function buildSkillWorkshopPromptSection() {
	return [
		"## Skill Workshop",
		"Durable reusable skill/playbook/workflow work you start on your own: `skill_workshop`; never write Workshop proposal or Workshop-owned skill files directly.",
		"Exception: when the user asks you to change a skill they own (repository skill source, the workspace `skills/` directory, project `.agents/skills/`, or a configured extra skill directory), edit it directly with normal file tools; do not route it through Workshop, and never infer Workshop ownership from a `SKILL.md` filename, skill-like directory, or name collision with an installed skill. Bundled, ClawHub-installed, and plugin-provided skills are replaced by their owners' updates: say so, and if the user wants the change kept, capture it as a Workshop skill.",
		"Exception: background Workshop maintenance may use normal file tools inside its provided Workshop directory when the run authorizes direct edits. Draft-only reviews continue to stage proposals.",
		"Used skill proved wrong or incomplete: read it and follow the available tool's publication and autonomous policy. Where supported, autonomous mode may disable repair, stage a proposal, or apply it. Without an applicable autonomous policy, unsolicited improvements stay pending proposals when supported; otherwise describe the suggestion without publishing. Capture only durable, evidenced procedure changes—never task artifacts, transient failures, or unresolved guesses.",
		"Publication-only create/update requires an explicit user request; never present it as a pending draft. Apply/reject/quarantine only explicit user ask.",
		"proposal_content = complete final skill body, never plan/diff; update/revise preserves unchanged content.",
		""
	];
}
//#endregion
//#region src/agents/system-prompt-context-files.ts
const PERSONAL_USER_CONTEXT_INSTRUCTIONS = "The personal users/<profile-id>/USER.md belongs to this session's selected person (assigned human owner, otherwise human creator). It supplements shared USER.md and overrides conflicting shared preferences, not higher-priority rules. Other participants do not change this personal context.";
const CONTEXT_FILE_ORDER = /* @__PURE__ */ new Map([
	["agents.md", 10],
	["soul.md", 20],
	["identity.md", 30],
	["user.md", 40],
	["tools.md", 50],
	["bootstrap.md", 60],
	["memory.md", 70]
]);
const DEFAULT_HEARTBEAT_PROMPT_CONTEXT_BLOCK = /Default heartbeat prompt:\r?\n`(?:Read HEARTBEAT\.md if it exists|Follow the heartbeat monitor scratch context when provided\.)[^`\r\n]*HEARTBEAT_OK\.`/gu;
function normalizeContextFilePath(pathValue) {
	return pathValue.trim().replace(/\\/g, "/");
}
function isBootstrapContextFile(pathValue) {
	return /(^|[\\/])BOOTSTRAP\.md$/iu.test(pathValue.trim());
}
function sanitizeContextFileContentForPrompt(content) {
	return content.replaceAll(DEFAULT_HEARTBEAT_PROMPT_CONTEXT_BLOCK, "").replace(/\n{3,}/g, "\n\n");
}
function prepareContextFilesForPrompt(contextFiles, options = {}) {
	return contextFiles.map((file) => {
		const path = normalizeContextFilePath(file.path);
		const rawBasename = path.slice(path.lastIndexOf("/") + 1);
		const basename = options.trimBasename === false ? rawBasename.toLowerCase() : normalizeLowercaseStringOrEmpty(rawBasename);
		return {
			file,
			path,
			basename,
			order: (options.order ?? CONTEXT_FILE_ORDER).get(basename) ?? Number.MAX_SAFE_INTEGER
		};
	}).toSorted((a, b) => {
		if (a.order !== b.order) return a.order - b.order;
		if (a.basename !== b.basename) return a.basename.localeCompare(b.basename);
		if (a.basename === "user.md") return 0;
		return options.caseInsensitivePathOrder ? a.path.toLowerCase().localeCompare(b.path.toLowerCase()) : a.path.localeCompare(b.path);
	});
}
function buildProjectContextSection(files) {
	if (files.length === 0) return [];
	const lines = ["# Project Context", ""];
	const hasSoulFile = files.some((file) => file.basename === "soul.md");
	const hasMemoryFile = files.some((file) => file.basename === "memory.md");
	const hasUserFile = files.some((file) => file.basename === "user.md");
	lines.push("Loaded project context:");
	if (hasSoulFile) lines.push("SOUL.md: persona/tone. Follow it unless higher-priority instructions override.");
	if (hasMemoryFile) lines.push("MEMORY.md: durable non-profile facts and decisions; use when relevant unless higher-priority instructions override.");
	if (hasUserFile) lines.push("USER.md: durable user preferences and profile directives; follow unless higher-priority instructions override.");
	if (files.some(({ file }) => file.personalUser)) lines.push(PERSONAL_USER_CONTEXT_INSTRUCTIONS);
	lines.push("");
	for (const { file } of files) lines.push(`## ${file.path}`, "", sanitizeContextFileContentForPrompt(file.content), "");
	return lines;
}
//#endregion
//#region src/agents/watched-sessions-prompt.ts
/**
* Prepares the Watched Sessions system-prompt section (openclaw#114797).
*
* Ambient group watches make same-agent group sessions readable from the main
* session, but the model only acts on that when the prompt names them. Prepare
* runs before synchronous prompt assembly, mirroring prepareAgentMemoryPrompt.
*/
const WATCHED_SESSIONS_PROMPT_LIMIT = 20;
const WATCHED_SESSION_TITLE_MAX_CHARS = 80;
const WATCHED_SESSION_READ_TOOLS = ["sessions_history", "sessions_search"];
function resolveWatchedSessionsPromptAccess(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!params.enabled || !sessionKey) return;
	const parsedKey = parseAgentSessionKey(sessionKey);
	if (!parsedKey || buildAgentMainSessionKey({ agentId: parsedKey.agentId }) !== sessionKey) return;
	if (params.sandboxed && resolveSandboxSessionToolsVisibility(params.config ?? {}) === "spawned") return;
	const availableTools = new Set([...params.toolNames, ...params.capabilityToolNames ?? []].map((tool) => tool.trim().toLowerCase()).filter(Boolean));
	const readToolNames = WATCHED_SESSION_READ_TOOLS.filter((tool) => availableTools.has(tool));
	if (readToolNames.length === 0) return;
	return {
		sessionKey,
		agentId: parsedKey.agentId,
		readToolNames,
		listToolAvailable: availableTools.has("sessions_list")
	};
}
function watchedSessionRow(key, entry) {
	const row = { key };
	const title = deriveSessionTitle(entry);
	if (title) row.title = truncateUtf16Safe(title, WATCHED_SESSION_TITLE_MAX_CHARS);
	return row;
}
/** Released synchronous SDK compatibility; bundled runtimes use the async preparer. */
function prepareWatchedSessionsPrompt(params) {
	const access = resolveWatchedSessionsPromptAccess(params);
	if (!access) return;
	const targets = [...listAmbientGroupWatchTargets(access.sessionKey)].toSorted();
	if (targets.length === 0) return;
	const sessions = targets.slice(0, WATCHED_SESSIONS_PROMPT_LIMIT).map((key) => {
		const entry = loadExactSessionEntryReadOnly({
			sessionKey: key,
			clone: false
		})?.entry;
		return watchedSessionRow(key, entry);
	});
	return {
		sessions,
		hiddenCount: targets.length - sessions.length,
		readToolNames: access.readToolNames,
		listToolAvailable: access.listToolAvailable
	};
}
/** Resolve durable watched-session facts without executing SQL on the caller thread. */
async function prepareWatchedSessionsPromptAsync(params) {
	const input = {
		...params,
		toolNames: [...params.toolNames],
		capabilityToolNames: [...params.capabilityToolNames ?? []]
	};
	const access = resolveWatchedSessionsPromptAccess(input);
	if (!access) return;
	const assertCallerCurrent = params.assertCurrent;
	assertCallerCurrent();
	const env = cloneEnvWithPlatformSemantics(process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const storePath = resolveOpenClawAgentSqlitePath({
		agentId: access.agentId,
		env
	});
	const identity = readDatabasePathIdentitySync(storePath);
	const assertCurrent = () => {
		assertCallerCurrent();
		const current = readDatabasePathIdentitySync(storePath);
		if (current.key !== identity.key || current.birthtime !== identity.birthtime || current.canonicalPath !== identity.canonicalPath) throw new Error("Watched-session title store changed during preparation");
	};
	const watches = prepareAmbientGroupWatchTargetsRead(access.sessionKey, { env });
	try {
		const prepared = await withSessionStoreReaderInWorker({
			agentId: access.agentId,
			storePath,
			env
		}, async ({ reader, database, continuation, assertCurrent: assertStoreCurrent }) => {
			const targets = [...new Set(await watches.read())].toSorted();
			assertCurrent();
			if (targets.length === 0) return;
			const keys = targets.slice(0, WATCHED_SESSIONS_PROMPT_LIMIT);
			const result = await reader.readExactEntries({
				sessionKeys: keys,
				projection: "list",
				env: database.env,
				continuation
			});
			assertStoreCurrent();
			assertCurrent();
			const currentTargets = [...new Set(await watches.read())].toSorted();
			assertStoreCurrent();
			watches.assertCurrent();
			assertCurrent();
			if (currentTargets.length !== targets.length || currentTargets.some((key, index) => key !== targets[index]) || !watches.isCurrent() || !resolveWatchedSessionsPromptAccess(input)) return;
			const entries = new Map(result.entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
			return {
				sessions: keys.map((key) => watchedSessionRow(key, entries.get(key))),
				hiddenCount: targets.length - keys.length,
				readToolNames: access.readToolNames,
				listToolAvailable: access.listToolAvailable
			};
		}, {
			backing: true,
			dataOnly: true
		});
		watches.assertCurrent();
		assertCurrent();
		return watches.isCurrent() && resolveWatchedSessionsPromptAccess(input) ? prepared : void 0;
	} finally {
		watches.release();
	}
}
/** Renders the shared Watched Sessions block used by every prompt-assembly surface. */
function buildWatchedSessionsPromptLines(prepared) {
	if (!prepared || prepared.sessions.length === 0) return [];
	const listHint = prepared.listToolAvailable ? "; rows appear in sessions_list" : "";
	return [
		"## Watched Sessions",
		`Group/topic sessions this session ambiently watches. Readable now (read-only) via ${prepared.readToolNames.join("/")}${listHint}.`,
		...prepared.sessions.map((session) => {
			const title = session.title ? ` — ${sanitizeForPromptLiteral(session.title)}` : "";
			return `- ${sanitizeForPromptLiteral(session.key)}${title}`;
		}),
		...prepared.hiddenCount > 0 ? [prepared.listToolAvailable ? `(+${prepared.hiddenCount} more: sessions_list kinds=["group"].)` : `(+${prepared.hiddenCount} more.)`] : [],
		""
	];
}
//#endregion
export { buildProjectContextSection as a, SKILL_WORKSHOP_TOOL_NAME as c, resolveMainSessionDelegationMode as d, buildCredentialSafetyPrompt as f, PERSONAL_USER_CONTEXT_INSTRUCTIONS as i, buildSkillWorkshopPromptSection as l, prepareWatchedSessionsPrompt as n, isBootstrapContextFile as o, prepareWatchedSessionsPromptAsync as r, prepareContextFilesForPrompt as s, buildWatchedSessionsPromptLines as t, buildDelegationGuidanceSection as u };
