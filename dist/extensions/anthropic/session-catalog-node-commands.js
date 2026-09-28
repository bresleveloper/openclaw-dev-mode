import { r as validateClaudeSessionId } from "../../invoke-agent-cli-claude-params-Bi-USBdQ.mjs";
import { i as runNodePtyCommand, n as decodeNodePtyResumeParams, r as decodeNodePtyStartParams } from "../../node-host-BLmevr7Y.mjs";
import { t as resolveClaudeTerminalExecutable } from "../../session-catalog-executable-BtzrAp2a.mjs";
import { s as isResumableClaudeSource } from "../../session-catalog-shared-CiyzxK6Y.mjs";
import { t as isExactClaudeSessionCursor } from "../../session-catalog-cursor-NPLrVaSJ.mjs";
import { o as readLocalClaudeTranscriptPage, r as listLocalClaudeSessionPage } from "../../session-catalog-listing-2hy6qgsY.mjs";
import "../../session-catalog-BdJW1jNk.mjs";
//#region extensions/anthropic/session-catalog-node-commands.ts
const CLAUDE_NODE_LOOKUP_PAGE_LIMIT = 100;
function parseNodeParams(paramsJSON) {
	if (!paramsJSON) return;
	try {
		return JSON.parse(paramsJSON);
	} catch (error) {
		throw new Error("Claude session parameters must be valid JSON", { cause: error });
	}
}
async function requireLocalResumableClaudeSession(threadId) {
	let cursor;
	const seenCursors = /* @__PURE__ */ new Set();
	while (true) {
		const page = await listLocalClaudeSessionPage({
			limit: CLAUDE_NODE_LOOKUP_PAGE_LIMIT,
			...cursor ? { cursor } : {}
		});
		const record = page.sessions.find((candidate) => candidate.threadId === threadId);
		if (record) {
			if (isResumableClaudeSource(record.source)) return record;
			break;
		}
		const nextCursor = page.nextCursor;
		if (nextCursor === void 0 || seenCursors.has(nextCursor)) break;
		if (!isExactClaudeSessionCursor(nextCursor)) throw new Error("Claude session catalog returned an invalid cursor");
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
	throw new Error("Claude session cannot be resumed in a terminal");
}
async function listClaudeSessions(paramsJSON) {
	return JSON.stringify(await listLocalClaudeSessionPage(parseNodeParams(paramsJSON)));
}
async function readClaudeSession(paramsJSON) {
	return JSON.stringify(await readLocalClaudeTranscriptPage(parseNodeParams(paramsJSON)));
}
async function resumeClaudeSession(paramsJSON, io) {
	if (!io) throw new Error("Claude terminal command requires duplex transport");
	const params = decodeNodePtyResumeParams(paramsJSON, validateClaudeSessionId);
	const record = await requireLocalResumableClaudeSession(params.threadId);
	const resolution = resolveClaudeTerminalExecutable();
	if (!resolution) throw new Error("Claude CLI is unavailable");
	return JSON.stringify(await runNodePtyCommand({
		file: resolution.executable,
		args: ["--resume", params.threadId],
		cwd: record.cwd,
		...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
		cols: params.cols,
		rows: params.rows
	}, io));
}
async function startClaudeSession(paramsJSON, io) {
	if (!io) throw new Error("Claude terminal command requires duplex transport");
	const params = decodeNodePtyStartParams(paramsJSON);
	const resolution = resolveClaudeTerminalExecutable();
	if (!resolution) throw new Error("Claude CLI is unavailable; install Claude Code on this node and reconnect");
	return JSON.stringify(await runNodePtyCommand({
		file: resolution.executable,
		args: params.initialMessage !== void 0 ? ["--", params.initialMessage] : [],
		cwd: params.cwd,
		requiredCwd: true,
		...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
		cols: params.cols,
		rows: params.rows
	}, io));
}
//#endregion
export { listClaudeSessions, readClaudeSession, resumeClaudeSession, startClaudeSession };
