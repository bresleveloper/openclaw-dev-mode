import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as buildAgentMainSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, T as parseCronRunScopeSuffix } from "./session-key-CSDERtm3.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { _ as prepareAmbientGroupWatchTargetsRead, s as listAmbientGroupWatchTargets } from "./session-state-events-BCzDVKh0.mjs";
import { n as resolveCanonicalMainSessionKey } from "./main-session-key-BNNxukz6.mjs";
import { u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
import { t as deriveSessionTitle } from "./session-utils-core-DYhQWF9T.mjs";
import { o as resolveSandboxSessionToolsVisibility } from "./session-visibility-CMzmBVR3.mjs";
import { n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-bzCyHFCH.mjs";
//#region src/agents/credential-safety-prompt.ts
function buildCredentialSafetyPrompt(input) {
	const knownAvailability = typeof input !== "string" && typeof input?.controlToolsAvailable === "boolean";
	return [
		knownAvailability && "Use or store credentials the user supplies as requested, and complete the task. In the final reply, briefly acknowledge how the supplied credential was used or stored, without repeating its value. Keep the acknowledgment factual and non-alarming.",
		"For user-requested login or pairing in a group, deliver short-lived codes and verification URLs only to the requesting user in private, then acknowledge in the group without them.",
		knownAvailability && input.controlToolsAvailable === false && "Channel, provider, and credential setup: terminal `openclaw channels add <channel>` or `openclaw configure` masks secrets."
	].filter(Boolean).join("\n");
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
/** System-prompt contribution that keeps the agent's learned (Workshop) skills current. */
const SKILL_WORKSHOP_TOOL_NAME = "skill_workshop";
/** Build the system-prompt section for Skill Workshop. */
function buildSkillWorkshopPromptSection() {
	return [
		"## Skill Workshop",
		"`skill_workshop` edits your learned skills: procedures for tasks this user repeats, so you do not work them out from scratch again. When a learned skill you used was wrong or incomplete, view it and patch the misleading step. After hard multi-step work the user will repeat, save the working procedure: patch the skill that covers it or create one. Knowledge about one codebase belongs in that repository's docs or AGENTS.md, not a learned skill. Every change keeps the previous version. When the user says undo right after a 💾 Learned notice, they mean that skill change: restore the named skill, or archive it if the notice says it was created.",
		"Skills the user owns (repository or workspace `skills/`, `.agents/skills/`, configured skill dirs) are ordinary files: edit them directly when asked, never through skill_workshop.",
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
	lines.push("Loaded project context:");
	for (const [basename, guidance] of Object.entries({
		"soul.md": "SOUL.md: persona/tone. Follow it unless higher-priority instructions override.",
		"memory.md": "MEMORY.md: durable non-profile facts and decisions; use when relevant unless higher-priority instructions override.",
		"user.md": "USER.md: durable user preferences and profile directives; follow unless higher-priority instructions override."
	})) if (files.some((file) => file.basename === basename)) lines.push(guidance);
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
		const targets = [...new Set(await watches.read())].toSorted();
		assertCurrent();
		if (targets.length === 0) return;
		const prepared = await withSessionStoreReaderInWorker({
			agentId: access.agentId,
			storePath,
			env
		}, async ({ reader, database, continuation, assertCurrent: assertStoreCurrent }) => {
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
