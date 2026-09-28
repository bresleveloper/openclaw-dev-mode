import { p as resolveCodexAppServerUserHomeDir } from "./config-security-BEReZ6go.mjs";
import { N as readBoundedOptionalString } from "./session-catalog-native-projection-DowriLid.mjs";
import { s as codexCatalogHomeId } from "./session-catalog-events-Bj6j94E_.mjs";
import { o as formatCodexDisplayText } from "./command-formatters-Bmqvr9tO.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { runCommandBuffered, withCommandProcessScope } from "openclaw/plugin-sdk/process-runtime";
import { materializeWindowsSpawnProgram, resolveWindowsSpawnProgram } from "openclaw/plugin-sdk/windows-spawn";
import path from "node:path";
import fs from "node:fs/promises";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import process from "node:process";
import { parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { resolvePreferredOpenClawTmpDir } from "openclaw/plugin-sdk/temp-path";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/codex/src/jsonl-lines.ts
const JSONL_STREAM_THRESHOLD_BYTES = 4194304;
const JSONL_READ_CHUNK_BYTES = 1048576;
async function visitJsonlLines(file, visitor) {
	let size;
	try {
		size = (await fs.stat(file)).size;
	} catch {
		return {
			ok: false,
			lineCount: 0
		};
	}
	if (size <= JSONL_STREAM_THRESHOLD_BYTES) {
		let content;
		try {
			content = await fs.readFile(file, "utf8");
		} catch {
			return {
				ok: false,
				lineCount: 0
			};
		}
		if (content.length === 0) return {
			ok: true,
			lineCount: 0
		};
		let lineCount = 0;
		for (const line of content.split(/\r?\n/u)) {
			lineCount += 1;
			visitor(line);
		}
		return {
			ok: true,
			lineCount
		};
	}
	let handle;
	try {
		handle = await fs.open(file, "r");
	} catch {
		return {
			ok: false,
			lineCount: 0
		};
	}
	const buffer = Buffer.allocUnsafe(JSONL_READ_CHUNK_BYTES);
	const decoder = new TextDecoder();
	let pendingFragments = [];
	let lineCount = 0;
	try {
		while (true) {
			const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
			if (bytesRead === 0) break;
			const content = decoder.decode(buffer.subarray(0, bytesRead), { stream: true });
			let lineStart = 0;
			while (true) {
				const newline = content.indexOf("\n", lineStart);
				if (newline === -1) break;
				let rawLine = content.slice(lineStart, newline);
				if (pendingFragments.length > 0) {
					pendingFragments.push(rawLine);
					rawLine = pendingFragments.join("");
					pendingFragments = [];
				}
				const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
				lineCount += 1;
				visitor(line);
				lineStart = newline + 1;
			}
			if (lineStart < content.length) pendingFragments.push(content.slice(lineStart));
		}
		const decoderTail = decoder.decode();
		if (decoderTail.length > 0) pendingFragments.push(decoderTail);
		if (pendingFragments.length > 0) {
			const rawLine = pendingFragments.join("");
			const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
			lineCount += 1;
			visitor(line);
		}
		return {
			ok: true,
			lineCount
		};
	} catch {
		return {
			ok: false,
			lineCount: 0
		};
	} finally {
		await handle.close().catch(() => void 0);
	}
}
//#endregion
//#region extensions/codex/src/node-cli-sessions.ts
const CODEX_CLI_SESSIONS_LIST_COMMAND = "codex.cli.sessions.list";
const CODEX_CLI_SESSION_RESUME_COMMAND = "codex.cli.session.resume";
const CODEX_CLI_SESSION_SOURCE_CAPABILITY = "codex-cli-session-source";
const CODEX_CLI_SESSION_SOURCE_UPGRADE_MESSAGE = "Update the node and approve its refreshed capabilities before continuing this Codex catalog session.";
const DEFAULT_SESSION_LIMIT = 10;
const MAX_SESSION_LIMIT = 50;
const DEFAULT_RESUME_TIMEOUT_MS = 12e5;
const SESSION_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;
const activeResumeSessions = /* @__PURE__ */ new Set();
function createCodexCliSessionNodeHostCommands(resolveCatalogSource) {
	return [{
		command: CODEX_CLI_SESSIONS_LIST_COMMAND,
		cap: "codex-cli-sessions",
		hasActiveWork: () => false,
		handle: listLocalCodexCliSessions
	}, {
		command: CODEX_CLI_SESSION_RESUME_COMMAND,
		cap: CODEX_CLI_SESSION_SOURCE_CAPABILITY,
		dangerous: true,
		hasActiveWork: () => activeResumeSessions.size > 0,
		handle: (paramsJSON, _io, context) => resumeLocalCodexCliSession(paramsJSON, resolveCatalogSource, context)
	}];
}
function createCodexCliSessionNodeInvokePolicies() {
	return [{
		commands: [CODEX_CLI_SESSIONS_LIST_COMMAND],
		defaultPlatforms: [
			"macos",
			"linux",
			"windows"
		],
		handle: (ctx) => ctx.invokeNode()
	}, {
		commands: [CODEX_CLI_SESSION_RESUME_COMMAND],
		dangerous: true,
		handle: (ctx) => isRecord(ctx.params) && (ctx.params.agentId !== void 0 || ctx.params.sourceHomeId !== void 0) && !ctx.node?.caps?.includes("codex-cli-session-source") ? {
			ok: false,
			code: "CODEX_NODE_SOURCE_UNAVAILABLE",
			message: CODEX_CLI_SESSION_SOURCE_UPGRADE_MESSAGE
		} : ctx.invokeNode()
	}];
}
async function listCodexCliSessionsOnNode(params) {
	const node = await resolveCodexCliNode({
		runtime: params.runtime,
		requestedNode: params.requestedNode,
		command: CODEX_CLI_SESSIONS_LIST_COMMAND
	});
	return {
		node,
		result: parseCodexCliSessionsListResult(await params.runtime.nodes.invoke({
			nodeId: readNodeId(node),
			command: CODEX_CLI_SESSIONS_LIST_COMMAND,
			params: {
				limit: params.limit,
				filter: params.filter
			},
			timeoutMs: 15e3,
			scopes: ["operator.write"]
		}))
	};
}
async function resolveCodexCliSessionForBindingOnNode(params) {
	const listing = await listCodexCliSessionsOnNode({
		runtime: params.runtime,
		requestedNode: params.requestedNode,
		filter: params.sessionId,
		limit: MAX_SESSION_LIMIT
	});
	if (!listing.node.commands?.includes("codex.cli.session.resume")) throw new Error(`Node ${formatNodeLabel(listing.node)} does not expose ${CODEX_CLI_SESSION_RESUME_COMMAND}.`);
	return {
		node: listing.node,
		session: listing.result.sessions.find((session) => session.sessionId === params.sessionId)
	};
}
async function resumeCodexCliSessionOnNode(params) {
	let catalogAgentId;
	let catalogHomeId;
	if (params.sessionKey) {
		const { adoptionSessionKeyRest, CODEX_NODE_SESSION_KEY_PREFIX, readNodeSessionMarker } = await import("./session-catalog-node-adoption-ITddWx_X.mjs");
		const entry = params.runtime.agent.session.getSessionEntry({
			sessionKey: params.sessionKey,
			readConsistency: "latest"
		});
		const codex = entry?.pluginExtensions?.codex;
		if (adoptionSessionKeyRest(params.sessionKey).startsWith(CODEX_NODE_SESSION_KEY_PREFIX) || isRecord(codex) && codex.sessionCatalog !== void 0) {
			const marker = entry ? readNodeSessionMarker(entry) : void 0;
			catalogAgentId = params.agentId?.trim();
			if (!catalogAgentId || parseAgentSessionKey(params.sessionKey)?.agentId !== catalogAgentId || !marker || marker.initializing === true || marker.nodeId !== params.nodeId || marker.sourceHostId !== `node:${params.nodeId}` || marker.sourceThreadId !== params.sessionId || entry?.initializationPending === true || entry?.agentHarnessId !== "codex" || entry.modelSelectionLocked !== true) throw new Error("Codex catalog session changed before its node turn could run.");
			if (!marker.sourceHomeId) throw new Error("This Codex catalog session has no saved source home. Reopen it from the catalog to continue in a new chat.");
			catalogHomeId = marker.sourceHomeId;
		}
	}
	const payload = unwrapNodeInvokePayload(await params.runtime.nodes.invoke({
		nodeId: params.nodeId,
		command: CODEX_CLI_SESSION_RESUME_COMMAND,
		params: {
			sessionId: params.sessionId,
			...catalogAgentId ? { agentId: catalogAgentId } : {},
			...catalogHomeId ? { sourceHomeId: catalogHomeId } : {},
			prompt: params.prompt,
			cwd: params.cwd,
			timeoutMs: params.timeoutMs
		},
		timeoutMs: (params.timeoutMs ?? DEFAULT_RESUME_TIMEOUT_MS) + 5e3,
		scopes: ["operator.write"]
	}));
	if (!isRecord(payload) || payload.ok !== true || typeof payload.text !== "string") throw new Error("Codex CLI resume returned an invalid payload.");
	return {
		ok: true,
		sessionId: typeof payload.sessionId === "string" ? payload.sessionId : params.sessionId,
		text: payload.text
	};
}
function formatCodexCliSessions(params) {
	if (params.result.sessions.length === 0) return `No Codex CLI sessions returned from ${formatCodexDisplayText(formatNodeLabel(params.node))}.`;
	return [`Codex CLI sessions on ${formatCodexDisplayText(formatNodeLabel(params.node))}:`, ...params.result.sessions.map((session) => {
		const details = [session.cwd, session.updatedAt].filter((value) => Boolean(value));
		return `- ${formatCodexDisplayText(session.sessionId)}${session.lastMessage ? ` - ${formatCodexDisplayText(session.lastMessage)}` : ""}${details.length > 0 ? ` (${details.map(formatCodexDisplayText).join(", ")})` : ""}\n  Bind: /codex resume ${formatCodexDisplayText(session.sessionId)} --host ${formatCodexDisplayText(readNodeId(params.node))} --bind here`;
	})].join("\n");
}
async function listLocalCodexCliSessions(paramsJSON) {
	const params = readRecordParam(paramsJSON);
	const limit = normalizeLimit(params.limit);
	const filter = typeof params.filter === "string" ? params.filter.trim().toLowerCase() : "";
	const codexHome = resolveCodexAppServerUserHomeDir();
	const summaries = await readHistorySessions(codexHome);
	await hydrateSessionsFromSessionFiles(codexHome, summaries);
	const sessions = [...summaries.values()].filter((session) => {
		if (!filter) return true;
		return [
			session.sessionId,
			session.cwd,
			session.lastMessage
		].some((value) => value?.toLowerCase().includes(filter));
	}).toSorted((a, b) => compareOptionalStringsDesc(a.updatedAt, b.updatedAt)).slice(0, limit);
	return JSON.stringify({
		sessions,
		codexHome
	});
}
async function resumeLocalCodexCliSession(paramsJSON, resolveCatalogSource, context) {
	context?.signal?.throwIfAborted();
	const params = readRecordParam(paramsJSON);
	const sessionId = typeof params.sessionId === "string" ? params.sessionId.trim() : "";
	const prompt = typeof params.prompt === "string" ? params.prompt.trim() : "";
	const expectedHomeId = readBoundedOptionalString(params, "sourceHomeId", 256);
	if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) throw new Error("Missing or invalid Codex CLI session id.");
	if (!prompt) throw new Error("Missing Codex CLI prompt.");
	let codexHome = resolveCodexAppServerUserHomeDir();
	let sourceHomeId;
	let assertCurrent;
	if (params.agentId !== void 0) {
		if (typeof params.agentId !== "string" || !params.agentId.trim()) throw new Error("Codex catalog agent id must be a nonempty string.");
		const source = await resolveCatalogSource(params.agentId.trim());
		if (source.transport !== "stdio") throw new Error("Codex CLI continuation requires a local Codex catalog source.");
		codexHome = source.codexHome;
		sourceHomeId = source.sourceHomeId;
		assertCurrent = () => source.assertCurrent();
	} else sourceHomeId = codexCatalogHomeId(codexHome);
	if (expectedHomeId && expectedHomeId !== sourceHomeId) throw new Error("Codex catalog source home changed. Reopen the session from the catalog.");
	context?.signal?.throwIfAborted();
	const resumeKey = `${sourceHomeId}\0${sessionId}`;
	if (activeResumeSessions.has(resumeKey)) throw new Error(`Codex CLI session ${sessionId} already has an active resume turn.`);
	activeResumeSessions.add(resumeKey);
	try {
		const text = await runCodexExecResume({
			sessionId,
			prompt,
			cwd: typeof params.cwd === "string" && params.cwd.trim() ? params.cwd.trim() : void 0,
			timeoutMs: normalizeTimeoutMs(params.timeoutMs),
			codexHome,
			assertCurrent,
			signal: context?.signal
		});
		return JSON.stringify({
			ok: true,
			sessionId,
			text: text.trim() || "Codex completed without a text reply."
		});
	} finally {
		activeResumeSessions.delete(resumeKey);
	}
}
async function runCodexExecResume(params) {
	const outputPath = path.join(await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-codex-cli-")), "last-message.txt");
	try {
		const args = [
			"exec",
			"resume",
			"--skip-git-repo-check",
			"--output-last-message",
			outputPath,
			params.sessionId,
			"-"
		];
		const invocation = materializeWindowsSpawnProgram(resolveWindowsSpawnProgram({
			command: "codex",
			platform: process.platform,
			env: process.env,
			execPath: process.execPath,
			packageName: "@openai/codex"
		}), args);
		const result = await withCommandProcessScope(() => {
			params.assertCurrent?.();
			return runCommandBuffered([invocation.command, ...invocation.argv], {
				cwd: params.cwd || process.cwd(),
				input: params.prompt,
				env: {
					...process.env,
					CODEX_HOME: params.codexHome
				},
				killGraceMs: 2e3,
				signal: params.signal,
				terminateOnOutputError: true,
				timeoutMs: params.timeoutMs
			});
		}, params.signal);
		params.signal?.throwIfAborted();
		if (result.termination === "timeout") throw new Error(`codex exec resume timed out after ${String(params.timeoutMs)}ms`);
		if (result.termination === "error" && result.error) throw result.error;
		if (result.code !== 0) {
			const message = result.stderr.toString("utf8").trim() || result.stdout.toString("utf8").trim() || `codex exec resume exited with code ${String(result.code)}`;
			throw new Error(message);
		}
		const text = await fs.readFile(outputPath, "utf8");
		params.signal?.throwIfAborted();
		return text;
	} finally {
		await fs.rm(path.dirname(outputPath), {
			recursive: true,
			force: true
		});
	}
}
async function readHistorySessions(codexHome) {
	const summaries = /* @__PURE__ */ new Map();
	if (!(await visitJsonlLines(path.join(codexHome, "history.jsonl"), (line) => {
		const trimmed = line.trim();
		if (!trimmed) return;
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			return;
		}
		if (!isRecord(parsed) || typeof parsed.session_id !== "string") return;
		const sessionId = parsed.session_id.trim();
		if (!sessionId) return;
		const entry = summaries.get(sessionId) ?? {
			sessionId,
			messageCount: 0
		};
		entry.messageCount += 1;
		if (typeof parsed.text === "string" && parsed.text.trim()) entry.lastMessage = truncateText(parsed.text.trim(), 140);
		if (typeof parsed.ts === "number") entry.updatedAt = timestampMsToIsoString(parsed.ts * 1e3) ?? entry.updatedAt;
		summaries.set(sessionId, entry);
	})).ok) return /* @__PURE__ */ new Map();
	return summaries;
}
async function hydrateSessionsFromSessionFiles(codexHome, summaries) {
	const files = await findSessionFiles(path.join(codexHome, "sessions"), 4);
	for (const file of files) {
		const summary = await readSessionFileSummary(file);
		if (!summary) continue;
		const existing = summaries.get(summary.sessionId);
		summaries.set(summary.sessionId, {
			...summary,
			...existing,
			cwd: existing?.cwd ?? summary.cwd,
			sessionFile: existing?.sessionFile ?? summary.sessionFile,
			updatedAt: existing?.updatedAt ?? summary.updatedAt,
			lastMessage: existing?.lastMessage ?? summary.lastMessage,
			messageCount: existing?.messageCount ?? summary.messageCount
		});
	}
}
async function readSessionFileSummary(file) {
	let sessionId = "";
	let cwd;
	let updatedAt;
	let lastMessage;
	let messageCount = 0;
	const result = await visitJsonlLines(file, (line) => {
		const trimmed = line.trim();
		if (!trimmed) return;
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			return;
		}
		if (!isRecord(parsed)) return;
		if (typeof parsed.timestamp === "string" && parsed.timestamp.trim()) updatedAt = parsed.timestamp.trim();
		if (parsed.type === "session_meta" && isRecord(parsed.payload)) {
			if (typeof parsed.payload.id === "string" && parsed.payload.id.trim()) sessionId = parsed.payload.id.trim();
			if (typeof parsed.payload.cwd === "string" && parsed.payload.cwd.trim()) cwd = parsed.payload.cwd.trim();
			return;
		}
		const messageText = readResponseItemMessageText(parsed);
		if (messageText) {
			messageCount += 1;
			lastMessage = truncateText(messageText, 140);
		}
	});
	if (!result.ok) return null;
	if (result.lineCount === 0) return null;
	if (!sessionId) sessionId = readSessionIdFromFilename(file) ?? "";
	if (!sessionId) return null;
	return {
		sessionId,
		updatedAt: updatedAt ?? await readFileMtimeIso(file),
		lastMessage,
		cwd,
		sessionFile: file,
		messageCount
	};
}
async function findSessionFiles(dir, maxDepth) {
	if (maxDepth < 0) return [];
	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return [];
	}
	const files = [];
	for (const entry of entries) {
		const entryPath = path.join(dir, entry.name);
		if (entry.isDirectory()) files.push(...await findSessionFiles(entryPath, maxDepth - 1));
		else if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push(entryPath);
	}
	return files;
}
function readResponseItemMessageText(parsed) {
	if (parsed.type !== "response_item" || !isRecord(parsed.payload)) return;
	if (parsed.payload.type !== "message") return;
	if ((typeof parsed.payload.role === "string" ? parsed.payload.role : "") !== "user") return;
	const parts = (Array.isArray(parsed.payload.content) ? parsed.payload.content : []).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const text = typeof entry.text === "string" ? entry.text : typeof entry.input_text === "string" ? entry.input_text : void 0;
		return text?.trim() ? [text.trim()] : [];
	});
	return parts.length > 0 ? parts.join(" ") : void 0;
}
function readSessionIdFromFilename(file) {
	return path.basename(file).match(/[0-9a-f]{8}-[0-9a-f-]{27,}/iu)?.[0];
}
async function resolveCodexCliNode(params) {
	const list = await params.runtime.nodes.list(params.requestedNode ? void 0 : { connected: true });
	const requested = params.requestedNode?.trim();
	const candidates = list.nodes.filter((node) => {
		if (requested) return [
			node.nodeId,
			node.displayName,
			node.remoteIp
		].some((value) => value === requested);
		return node.connected === true && node.commands?.includes(params.command);
	});
	if (candidates.length === 0) throw new Error(requested ? `Codex CLI node ${requested} was not found.` : "No connected node exposes Codex CLI session commands.");
	const usable = candidates.filter((node) => node.commands?.includes(params.command));
	if (usable.length === 0) throw new Error(`Node ${requested ?? "candidate"} does not expose ${params.command}.`);
	if (usable.length > 1) throw new Error("Multiple Codex CLI-capable nodes connected. Pass --host <node-id>.");
	return expectDefined(usable[0], "single usable Codex CLI node");
}
function parseCodexCliSessionsListResult(raw) {
	const payload = unwrapNodeInvokePayload(raw);
	if (!isRecord(payload) || !Array.isArray(payload.sessions)) throw new Error("Codex CLI session list returned an invalid payload.");
	return {
		codexHome: typeof payload.codexHome === "string" ? payload.codexHome : "",
		sessions: payload.sessions.flatMap((entry) => {
			if (!isRecord(entry) || typeof entry.sessionId !== "string") return [];
			return [{
				sessionId: entry.sessionId,
				updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : void 0,
				lastMessage: typeof entry.lastMessage === "string" ? entry.lastMessage : void 0,
				cwd: typeof entry.cwd === "string" ? entry.cwd : void 0,
				sessionFile: typeof entry.sessionFile === "string" ? entry.sessionFile : void 0,
				messageCount: typeof entry.messageCount === "number" && Number.isFinite(entry.messageCount) ? entry.messageCount : 0
			}];
		})
	};
}
function unwrapNodeInvokePayload(raw) {
	const record = isRecord(raw) ? raw : {};
	if (typeof record.payloadJSON === "string" && record.payloadJSON.trim()) try {
		return JSON.parse(record.payloadJSON);
	} catch (error) {
		throw new Error("Codex CLI node command returned malformed payloadJSON.", { cause: error });
	}
	if ("payload" in record) return record.payload;
	return raw;
}
function readRecordParam(paramsJSON) {
	if (!paramsJSON?.trim()) return {};
	try {
		const parsed = JSON.parse(paramsJSON);
		return isRecord(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
async function readFileMtimeIso(file) {
	try {
		return (await fs.stat(file)).mtime.toISOString();
	} catch {
		return;
	}
}
function normalizeLimit(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.min(MAX_SESSION_LIMIT, Math.max(1, Math.floor(value))) : DEFAULT_SESSION_LIMIT;
}
function normalizeTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.min(36e5, Math.floor(value)) : DEFAULT_RESUME_TIMEOUT_MS;
}
function truncateText(value, max) {
	if (value.length <= max) return value;
	return `${truncateUtf16Safe(value, Math.max(0, max - 3))}...`;
}
function compareOptionalStringsDesc(a, b) {
	return (b ?? "").localeCompare(a ?? "");
}
function readNodeId(node) {
	if (!node.nodeId) throw new Error("Codex CLI node did not include a node id.");
	return node.nodeId;
}
function formatNodeLabel(node) {
	return [
		node.displayName,
		node.nodeId,
		node.remoteIp
	].filter(Boolean).join(" / ") || "node";
}
//#endregion
export { createCodexCliSessionNodeInvokePolicies as a, resolveCodexCliSessionForBindingOnNode as c, createCodexCliSessionNodeHostCommands as i, resumeCodexCliSessionOnNode as l, CODEX_CLI_SESSION_SOURCE_CAPABILITY as n, formatCodexCliSessions as o, CODEX_CLI_SESSION_SOURCE_UPGRADE_MESSAGE as r, listCodexCliSessionsOnNode as s, CODEX_CLI_SESSION_RESUME_COMMAND as t };
