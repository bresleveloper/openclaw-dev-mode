import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import "./utils-DgZn2dLu.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as DEFAULT_SOUL_FILENAME, r as DEFAULT_IDENTITY_FILENAME, s as DEFAULT_USER_FILENAME } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import "./workspace-7iuzSwDh.mjs";
import { n as resolveAgentIdentity } from "./identity-uzCeiPuC.mjs";
import { n as buildBootstrapContextFiles } from "./bootstrap-DROECufe.mjs";
import "./embedded-agent-helpers-B7llO2Rm.mjs";
import { s as resolveBootstrapFilesForRun } from "./bootstrap-files-CtnU-4C-.mjs";
import path from "node:path";
//#region src/agents/realtime-bootstrap-context.ts
/**
* Realtime bootstrap context loader.
*
* Voice/realtime sessions use this to inject selected profile files into model
* instructions with deterministic ordering and a hard character budget.
*/
const REALTIME_VOICE_AGENT_CONTEXT_INSTRUCTIONS = "Agent context: You speak for an OpenClaw agent that can run many sessions at once, such as direct chats, channel conversations, background work, subagents, and scheduled jobs. This voice call is attached to one of those sessions. You cannot see the other sessions directly, but they belong to the same agent, so never claim you are only in this conversation, have no other work, or are not the one running it. For questions about other sessions, what is running, progress, or priorities, delegate to OpenClaw instead of guessing.";
/** Default ordered profile files included in realtime bootstrap context. */
const REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES = [
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME,
	DEFAULT_SOUL_FILENAME
];
const REALTIME_BOOTSTRAP_CONTEXT_FILE_NAME_SET = new Set(REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES);
const DEFAULT_REALTIME_BOOTSTRAP_CONTEXT_MAX_CHARS = 12e3;
const REALTIME_BOOTSTRAP_CONTEXT_TITLE = "OpenClaw realtime voice profile context:";
const REALTIME_BOOTSTRAP_CONTEXT_GUIDANCE = "Use these profile files for identity, persona, and user grounding; do not mention them unless asked.";
function isRealtimeBootstrapContextFileName(value) {
	return REALTIME_BOOTSTRAP_CONTEXT_FILE_NAME_SET.has(value);
}
function formatRealtimeBootstrapContextFileName(pathValue) {
	return path.basename(pathValue.trim().replace(/\\/g, "/"));
}
/** Builds bounded realtime instructions from selected profile bootstrap files. */
async function resolveRealtimeBootstrapContextInstructions(params) {
	const requestedFiles = params.files ?? REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES;
	if (requestedFiles.length === 0) return;
	const requestedOrder = new Map(requestedFiles.map((fileName, index) => [fileName, index]));
	const workspaceDir = resolveUserPath(resolveAgentWorkspaceDir(params.config, params.agentId));
	const selectedFiles = (requestedFiles.some(isRealtimeBootstrapContextFileName) ? await resolveBootstrapFilesForRun({
		workspaceDir,
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		warn: params.warn
	}) : []).filter((file) => !file.missing && isRealtimeBootstrapContextFileName(file.name) && requestedOrder.has(file.name));
	const extraFiles = [...requestedOrder.keys()].filter((fileName) => !isRealtimeBootstrapContextFileName(fileName));
	if (extraFiles.length > 0) {
		const workspaceRoot = await root(workspaceDir).catch((error) => {
			params.warn?.(`realtime workspace context unavailable: ${String(error)}`);
		});
		if (workspaceRoot) for (const fileName of extraFiles) try {
			const content = await workspaceRoot.readText(fileName);
			if (content.trim()) selectedFiles.push({
				name: fileName,
				path: fileName,
				content,
				missing: false
			});
		} catch (error) {
			params.warn?.(`skipping realtime context file "${fileName}": ${String(error)}`);
		}
	}
	selectedFiles.sort((left, right) => {
		const leftOrder = requestedOrder.get(left.name) ?? 0;
		const rightOrder = requestedOrder.get(right.name) ?? 0;
		if (leftOrder !== rightOrder) return leftOrder - rightOrder;
		return left.path.localeCompare(right.path);
	});
	if (selectedFiles.length === 0) return;
	const totalMaxChars = params.maxChars ?? DEFAULT_REALTIME_BOOTSTRAP_CONTEXT_MAX_CHARS;
	const preamble = [REALTIME_BOOTSTRAP_CONTEXT_TITLE, REALTIME_BOOTSTRAP_CONTEXT_GUIDANCE].join("\n");
	const fileNames = selectedFiles.map((file) => formatRealtimeBootstrapContextFileName(file.path));
	const contentBudget = totalMaxChars - preamble.length - 2 * fileNames.length - fileNames.reduce((total, fileName) => total + `### ${fileName}\n`.length, 0);
	if (contentBudget <= 0) {
		params.warn?.(`realtime bootstrap context budget is too small to include selected profile files (limit ${totalMaxChars})`);
		return;
	}
	const perFileMaxChars = Math.max(1, Math.floor(contentBudget / selectedFiles.length));
	const contextFiles = buildBootstrapContextFiles(selectedFiles, {
		maxChars: perFileMaxChars,
		totalMaxChars: contentBudget,
		warn: params.warn
	});
	if (contextFiles.length === 0) return;
	const instructions = [preamble, ...contextFiles.map((file) => `### ${formatRealtimeBootstrapContextFileName(file.path)}\n${file.content.trimEnd()}`)].join("\n\n");
	return instructions.length <= totalMaxChars ? instructions : truncateUtf16Safe(instructions, totalMaxChars);
}
/** Compose the shared agent framing and optional identity/profile context for voice. */
async function resolveRealtimeVoiceAgentContextInstructions(params) {
	const sections = [REALTIME_VOICE_AGENT_CONTEXT_INSTRUCTIONS];
	if (params.includeIdentity) try {
		const identity = asOptionalRecord(resolveAgentIdentity(params.config, params.agentId));
		const lines = [
			["Name", identity?.name],
			["Emoji", identity?.emoji],
			["Vibe", identity?.vibe],
			["Theme", identity?.theme],
			["Creature/persona", identity?.creature]
		].flatMap(([label, value]) => {
			const text = normalizeOptionalString(value);
			return text ? [`- ${label}: ${text}`] : [];
		});
		if (lines.length > 0) sections.push(`Configured identity:\n${lines.join("\n")}`);
	} catch (error) {
		params.warn?.(`realtime configured identity unavailable: ${String(error)}`);
	}
	try {
		const profile = await resolveRealtimeBootstrapContextInstructions(params);
		if (profile) sections.push(profile);
	} catch (error) {
		params.warn?.(`realtime bootstrap context unavailable: ${String(error)}`);
	}
	return sections.join("\n\n");
}
//#endregion
export { resolveRealtimeBootstrapContextInstructions as n, resolveRealtimeVoiceAgentContextInstructions as r, REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES as t };
