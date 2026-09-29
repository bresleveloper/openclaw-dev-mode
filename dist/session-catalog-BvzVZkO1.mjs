import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { y as resolveSessionAgentIds } from "./agent-scope-CTuYDtny.mjs";
import "./session-state-events-CMg59EpB.mjs";
import "./input-provenance-C4tQegGN.mjs";
import { i as runNodePtyCommand, n as decodeNodePtyResumeParams, t as resolveNodeHostExecutable } from "./node-host-BLmevr7Y.mjs";
import "./session-catalog-history-import-ekE8vMjr.mjs";
import { a as parseClaudeCliHistoryEntry, f as resolveClaudeCliTimestampMs, m as parseCliReseedPrompt, u as resolveClaudeCliPromptTextCandidates } from "./cli-session-history.claude-D82aq7_9.mjs";
import { createHash } from "node:crypto";
//#region src/plugins/session-catalog.ts
function normalizeUserText(text) {
	return text.trim().replace(/\s+/g, " ");
}
function isExternalUserText(probe, text) {
	const normalized = text === void 0 ? "" : normalizeUserText(text);
	return !probe.ownRecentUserTexts.includes(normalized);
}
function listSessionCatalogEntries(params) {
	const requiresExplicitOwner = params.config.agents?.ownership === "explicit";
	const requestedAgentId = params.agentId || requiresExplicitOwner ? resolveSessionAgentIds({
		config: params.config,
		agentId: params.agentId
	}).sessionAgentId : void 0;
	const requestEntries = params.sessionEntries?.entriesForCatalog?.();
	if (requestEntries) return requiresExplicitOwner && requestedAgentId ? requestEntries.filter((entry) => entry.agentId === requestedAgentId) : requestEntries;
	const defaultAgentId = requestedAgentId ?? resolveSessionAgentIds({ config: params.config }).defaultAgentId;
	return (requiresExplicitOwner ? [defaultAgentId] : [defaultAgentId, ...listAgentIds(params.config).filter((agentId) => agentId !== defaultAgentId)]).flatMap((agentId) => {
		return (params.sessionEntries ? params.sessionEntries.entriesForAgent(agentId) : params.runtime.agent.session.listSessionEntries({
			agentId,
			readOnly: true
		})).map((entry) => Object.assign({}, entry, { agentId }));
	});
}
function sessionCatalogAdoptedSourceKey(hostId, threadId) {
	return `${hostId}\0${threadId}`;
}
function sessionCatalogAdoptedSessionKey(prefix, source) {
	return `${prefix}${createHash("sha256").update(source).digest("hex")}`;
}
function listAdoptedSessionCatalogSessions(params) {
	const adopted = /* @__PURE__ */ new Map();
	for (const { sessionKey, entry } of listSessionCatalogEntries(params)) {
		const source = params.sourceFromEntry(entry);
		if (source && entry.pluginOwnerId === params.pluginId && entry.initializationPending !== true) adopted.set(sessionCatalogAdoptedSourceKey(source.hostId, source.threadId), sessionKey);
	}
	return adopted;
}
function createSessionCatalogAdoptionCoordinator() {
	const operations = /* @__PURE__ */ new Map();
	return async (params) => {
		const pending = operations.get(params.sourceKey);
		if (pending) return await pending;
		const operation = (async () => {
			const existing = await params.findExisting();
			if (existing) return await params.complete({ sessionKey: existing });
			const continued = await params.create().catch(async (error) => {
				const raced = await params.findExisting();
				if (raced) return { sessionKey: raced };
				throw error;
			});
			return await params.complete(continued);
		})();
		operations.set(params.sourceKey, operation);
		try {
			return await operation;
		} finally {
			if (operations.get(params.sourceKey) === operation) operations.delete(params.sourceKey);
		}
	};
}
//#endregion
//#region src/gateway/cli-session-history.claude-activity.ts
function classifyClaudeCliHistoryEntry(params) {
	const entry = params.entry;
	const content = entry.message?.content;
	if (entry.type !== "user" || entry.message?.role !== "user") return { humanTurn: false };
	if (typeof content !== "string" && !Array.isArray(content)) return { humanTurn: false };
	const candidates = resolveClaudeCliPromptTextCandidates(entry, content);
	if (candidates.length === 0 || candidates.some(({ text }) => text.startsWith("[Inter-session message]") || parseCliReseedPrompt(text).kind !== "none")) return { humanTurn: false };
	if (parseClaudeCliHistoryEntry(entry, params.cliSessionId, params.sourceLineNumber, /* @__PURE__ */ new Map(), { reseedMode: "preserve" })?.role !== "user") return { humanTurn: false };
	const occurredAt = resolveClaudeCliTimestampMs(entry.timestamp);
	return {
		humanTurn: true,
		userText: candidates[0]?.text,
		...occurredAt === void 0 ? {} : { occurredAt }
	};
}
/** Classifies one native JSONL row through the same filters used by history import. */
function classifyClaudeCliHistoryLine(params) {
	let entry;
	try {
		entry = JSON.parse(params.line);
	} catch {
		return { humanTurn: false };
	}
	return classifyClaudeCliHistoryEntry({
		...params,
		entry
	});
}
/** Applies native history filters to an already-decoded catalog user message. */
function classifyClaudeCliHistoryMessage(params) {
	return classifyClaudeCliHistoryEntry({
		cliSessionId: params.cliSessionId,
		sourceLineNumber: params.sourceLineNumber,
		entry: {
			type: "user",
			timestamp: params.timestamp,
			message: {
				role: "user",
				content: params.content
			}
		}
	});
}
//#endregion
//#region src/plugins/session-catalog-family.ts
function nodeLabel(node) {
	return node.displayName?.trim() || node.remoteIp?.trim() || node.nodeId;
}
function unwrapNodePayload(value) {
	return isRecord(value) && typeof value.payloadJSON === "string" ? JSON.parse(value.payloadJSON) : value;
}
function isOptionalString(value) {
	return value === void 0 || typeof value === "string";
}
function isOptionalNumber(value) {
	return value === void 0 || typeof value === "number";
}
function isNodeSession(value, sessionIdPattern) {
	return isRecord(value) && typeof value.threadId === "string" && sessionIdPattern.test(value.threadId) && typeof value.status === "string" && value.status.length > 0 && typeof value.archived === "boolean" && typeof value.canContinue === "boolean" && typeof value.canArchive === "boolean" && isOptionalString(value.name) && isOptionalString(value.color) && isOptionalString(value.cwd) && isOptionalString(value.source) && isOptionalString(value.modelProvider) && isOptionalString(value.cliVersion) && isOptionalString(value.gitBranch) && isOptionalString(value.sessionKey) && isOptionalNumber(value.createdAt) && isOptionalNumber(value.updatedAt) && isOptionalNumber(value.recencyAt);
}
const TRANSCRIPT_ITEM_TYPES = /* @__PURE__ */ new Set([
	"userMessage",
	"agentMessage",
	"reasoning",
	"toolCall",
	"toolResult",
	"other"
]);
function isNodeTranscriptItem(value) {
	return isRecord(value) && typeof value.type === "string" && TRANSCRIPT_ITEM_TYPES.has(value.type) && isOptionalString(value.id) && isOptionalString(value.text) && isOptionalString(value.timestamp) && isOptionalString(value.model) && (value.truncated === void 0 || typeof value.truncated === "boolean");
}
function parseNodeSessionPage(value, options, isExactCursor) {
	if (!isRecord(value) || !Array.isArray(value.sessions) || value.sessions.length > options.node.maxPageLimit || !value.sessions.every((session) => isNodeSession(session, options.node.sessionIdPattern))) throw new Error(options.messages.invalidNodeSessionPage);
	const nextCursor = value.nextCursor;
	if (nextCursor !== void 0 && !isExactCursor(nextCursor)) throw new Error(options.messages.invalidNodeCursor);
	return {
		sessions: value.sessions,
		...nextCursor !== void 0 ? { nextCursor } : {}
	};
}
function parseNodeTranscriptPage(value, threadId, options, isExactCursor) {
	if (!isRecord(value) || value.threadId !== threadId || !Array.isArray(value.items) || value.items.length > options.node.maxPageLimit || !value.items.every(isNodeTranscriptItem)) throw new Error(options.messages.invalidNodeTranscriptPage);
	const nextCursor = value.nextCursor;
	if (nextCursor !== void 0 && !isExactCursor(nextCursor)) throw new Error(options.messages.invalidNodeCursor);
	return {
		hostId: options.local.hostId,
		threadId,
		items: value.items,
		...nextCursor !== void 0 ? { nextCursor } : {}
	};
}
function projectPageCapabilities(page, capabilities, project) {
	return {
		...page,
		sessions: page.sessions.map((session) => project(session, capabilities))
	};
}
function projectAdoptedSessions(page, adopted, localHostId) {
	return {
		...page,
		sessions: page.sessions.map((session) => {
			const sessionKey = adopted.get(sessionCatalogAdoptedSourceKey(localHostId, session.threadId));
			return sessionKey ? {
				...session,
				sessionKey
			} : session;
		})
	};
}
async function listNodeHost(options, query, node, isExactCursor) {
	const hostId = `node:${node.nodeId}`;
	const common = {
		hostId,
		label: nodeLabel(node),
		kind: "node",
		connected: node.connected === true,
		nodeId: node.nodeId
	};
	if (node.connected !== true) return {
		...common,
		sessions: [],
		error: {
			code: "NODE_OFFLINE",
			message: "Paired node is offline"
		}
	};
	try {
		query.signal?.throwIfAborted();
		const cursor = query.cursors?.[hostId];
		if (cursor !== void 0 && !isExactCursor(cursor)) throw new Error("cursor is invalid");
		const raw = await options.runtime.nodes.invoke({
			nodeId: node.nodeId,
			command: options.node.listCommand,
			params: {
				...query.limitPerHost ? { limit: query.limitPerHost } : {},
				...query.search ? { searchTerm: query.search } : {},
				...cursor !== void 0 ? { cursor } : {}
			},
			timeoutMs: options.node.timeoutMs,
			scopes: ["operator.write"],
			signal: query.signal
		});
		query.signal?.throwIfAborted();
		const page = parseNodeSessionPage(unwrapNodePayload(raw), options, isExactCursor);
		return {
			...common,
			...projectPageCapabilities(page, options.capabilities.node(node), options.capabilities.project)
		};
	} catch {
		query.signal?.throwIfAborted();
		return {
			...common,
			sessions: [],
			error: {
				code: "NODE_INVOKE_FAILED",
				message: options.messages.nodeInvokeFailed
			}
		};
	}
}
async function listHosts(options, query, isExactCursor) {
	query.signal?.throwIfAborted();
	const requested = query.hostIds ? new Set(query.hostIds) : void 0;
	const hosts = [];
	if ((!requested || requested.has(options.local.hostId)) && await options.local.available(query)) {
		let host;
		try {
			query.signal?.throwIfAborted();
			const capabilities = await options.capabilities.local();
			query.signal?.throwIfAborted();
			const adopted = query.sessionEntries ? await options.continuation.listAdopted(query.agentId, query.sessionEntries) : /* @__PURE__ */ new Map();
			query.signal?.throwIfAborted();
			const localPage = await options.local.list(query);
			query.signal?.throwIfAborted();
			const page = projectAdoptedSessions(projectPageCapabilities(localPage, capabilities, options.capabilities.project), adopted, options.local.hostId);
			query.signal?.throwIfAborted();
			host = {
				hostId: options.local.hostId,
				label: options.local.label,
				kind: "gateway",
				connected: true,
				...page
			};
		} catch {
			query.signal?.throwIfAborted();
			host = {
				hostId: options.local.hostId,
				label: options.local.label,
				kind: "gateway",
				connected: true,
				sessions: [],
				error: {
					code: "LOCAL_READ_FAILED",
					message: options.messages.localReadFailed
				}
			};
		}
		hosts.push(host);
		query.onHost?.(host);
	}
	query.signal?.throwIfAborted();
	if (requested && !Array.from(requested).some((hostId) => hostId.startsWith("node:"))) return hosts;
	let nodes;
	try {
		nodes = (await (query.listNodes?.() ?? options.runtime.nodes.list())).nodes;
	} catch {
		query.signal?.throwIfAborted();
		return hosts;
	}
	query.signal?.throwIfAborted();
	const pending = nodes.filter((node) => node.commands?.includes(options.node.listCommand) && (!requested || requested.has(`node:${node.nodeId}`))).toSorted((left, right) => nodeLabel(left).localeCompare(nodeLabel(right))).slice(0, options.node.maxHosts - hosts.length).map((node) => listNodeHost(options, query, node, isExactCursor).then((host) => {
		query.signal?.throwIfAborted();
		query.onHost?.(host);
		return host;
	}));
	let nodeHosts;
	try {
		nodeHosts = await Promise.all(pending);
	} finally {
		await Promise.allSettled(pending);
	}
	query.signal?.throwIfAborted();
	return [...hosts, ...nodeHosts];
}
async function readTranscript(options, request, isExactCursor) {
	if (request.cursor !== void 0 && !isExactCursor(request.cursor)) throw new Error("cursor is invalid");
	if (request.hostId === options.local.hostId) {
		options.local.assertAccess(request.hostId, request.allowProcessHomeFallback);
		return await options.local.read(request);
	}
	if (!request.hostId.startsWith("node:")) throw new Error(options.messages.invalidHostId);
	const nodeId = request.hostId.slice(5);
	const node = (await options.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected === true && candidate.commands?.includes(options.node.readCommand));
	if (!node) throw new Error(options.messages.nodeReadUnavailable);
	return {
		...parseNodeTranscriptPage(unwrapNodePayload(await options.runtime.nodes.invoke({
			nodeId,
			command: options.node.readCommand,
			params: {
				threadId: request.threadId,
				...request.limit ? { limit: request.limit } : {},
				...request.cursor !== void 0 ? { cursor: request.cursor } : {}
			},
			timeoutMs: options.node.timeoutMs,
			scopes: ["operator.write"]
		})), request.threadId, options, isExactCursor),
		hostId: request.hostId,
		label: nodeLabel(node)
	};
}
async function openTerminal(options, request, isExactCursor) {
	const title = options.terminal.title(request.threadId);
	if (request.hostId === options.local.hostId) {
		options.local.assertAccess(request.hostId, request.allowProcessHomeFallback);
		const session = await options.terminal.requireLocalSession(request.threadId);
		const resolution = resolveNodeHostExecutable(options.terminal.executable, {
			env: process.env,
			pathEnv: process.env.PATH ?? "",
			strategy: "fallback"
		});
		if (!resolution) throw new Error(options.terminal.unavailableMessage);
		return {
			kind: "local",
			argv: [resolution.executable, ...options.terminal.args(request.threadId)],
			...session.cwd ? { cwd: session.cwd } : {},
			...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
			title
		};
	}
	if (!request.hostId.startsWith("node:")) throw new Error(options.messages.invalidHostId);
	const nodeId = request.hostId.slice(5);
	if (!(await options.runtime.nodes.list()).nodes.find((candidate) => {
		const commands = candidate.invocableCommands ?? candidate.commands;
		return candidate.nodeId === nodeId && candidate.connected === true && commands?.includes(options.node.listCommand) === true && commands.includes(options.node.terminalCommand);
	})) throw new Error(options.messages.nodeTerminalUnavailable);
	const session = parseNodeSessionPage(unwrapNodePayload(await options.runtime.nodes.invoke({
		nodeId,
		command: options.node.listCommand,
		params: {
			searchTerm: request.threadId,
			limit: options.node.maxPageLimit
		},
		timeoutMs: options.node.timeoutMs,
		scopes: ["operator.write"]
	})), options, isExactCursor).sessions.find((candidate) => candidate.threadId === request.threadId);
	if (!session) throw new Error(options.messages.sessionUnavailable);
	return {
		kind: "node",
		nodeId,
		command: options.node.terminalCommand,
		...options.terminal.uploadPathStyle ? { uploadPathStyle: options.terminal.uploadPathStyle } : {},
		paramsJSON: JSON.stringify({ threadId: request.threadId }),
		...session.cwd ? { cwd: session.cwd } : {},
		title
	};
}
/** Compose the shared local-plus-paired-node runtime for one CLI session-catalog family. */
function createSessionCatalogFamily(options, isExactCursor) {
	const continueAdoption = createSessionCatalogAdoptionCoordinator();
	return {
		list: async (query) => await listHosts(options, query, isExactCursor),
		read: async (request) => await readTranscript(options, request, isExactCursor),
		continueSession: async (request) => {
			options.local.assertAccess(request.hostId, request.allowProcessHomeFallback);
			if (request.hostId.startsWith("node:")) throw new Error(options.continuation.nodeReadOnlyMessage);
			if (request.hostId !== options.local.hostId) throw new Error(options.messages.invalidHostId);
			const available = await options.continuation.availability();
			if (!available.available) throw new Error(available.message);
			const agentId = options.continuation.resolveAgentId(request.agentId);
			const sourceKey = sessionCatalogAdoptedSourceKey(request.hostId, request.threadId);
			const operationKey = `${agentId}\0${sourceKey}`;
			return await continueAdoption({
				sourceKey: operationKey,
				findExisting: async () => (await options.continuation.listAdopted(agentId)).get(sourceKey),
				create: async () => {
					const session = await options.continuation.loadSession(request.threadId);
					options.continuation.validateSession(session);
					const current = await options.continuation.availability();
					if (!current.available) throw new Error(current.message);
					return await options.continuation.create({
						agentId,
						hostId: request.hostId,
						threadId: request.threadId,
						session
					});
				},
				complete: async (continued) => await options.continuation.complete(continued, request.threadId)
			});
		},
		checkUpstreamActivity: options.checkUpstreamActivity,
		openTerminal: async (request) => await openTerminal(options, request, isExactCursor)
	};
}
/** Build the three node-host commands and their explicit terminal-only invoke policy. */
function createSessionCatalogNodeHostBindings(options) {
	const terminal = {
		command: options.terminalCommand,
		cap: options.capability,
		dangerous: false,
		duplex: true,
		hasActiveWork: options.hasActiveWork,
		isAvailable: options.terminalAvailable,
		handle: async (paramsJSON, io) => {
			if (!io) throw new Error(options.terminalIoRequiredMessage);
			const params = decodeNodePtyResumeParams(paramsJSON, (value) => {
				if (typeof value !== "string" || !options.sessionIdPattern.test(value)) throw new Error(options.invalidThreadIdMessage);
				return value;
			});
			const session = await options.requireSession(params.threadId);
			const resolution = resolveNodeHostExecutable(options.executable, {
				env: process.env,
				pathEnv: process.env.PATH ?? process.env.Path ?? "",
				strategy: "direct"
			});
			if (!resolution) throw new Error(options.terminalUnavailableMessage);
			return JSON.stringify(await runNodePtyCommand({
				file: resolution.executable,
				args: options.args(params.threadId),
				cwd: session.cwd,
				cols: params.cols,
				rows: params.rows
			}, io));
		}
	};
	return {
		commands: [
			{
				command: options.listCommand,
				cap: options.capability,
				dangerous: false,
				hasActiveWork: options.hasActiveWork,
				isAvailable: options.listAvailable,
				handle: async (paramsJSON) => JSON.stringify(await options.list(options.parseParams(paramsJSON)))
			},
			{
				command: options.readCommand,
				cap: options.capability,
				dangerous: false,
				hasActiveWork: options.hasActiveWork,
				isAvailable: options.listAvailable,
				handle: async (paramsJSON) => JSON.stringify(await options.read(options.parseParams(paramsJSON)))
			},
			terminal
		],
		policies: [{
			commands: [
				options.listCommand,
				options.readCommand,
				options.terminalCommand
			],
			defaultPlatforms: [
				"macos",
				"linux",
				"windows"
			],
			handle: (context) => context.command === options.terminalCommand ? { ok: true } : context.invokeNode()
		}]
	};
}
//#endregion
export { createSessionCatalogAdoptionCoordinator as a, listSessionCatalogEntries as c, sessionCatalogAdoptedSourceKey as d, classifyClaudeCliHistoryMessage as i, normalizeUserText as l, createSessionCatalogNodeHostBindings as n, isExternalUserText as o, classifyClaudeCliHistoryLine as r, listAdoptedSessionCatalogSessions as s, createSessionCatalogFamily as t, sessionCatalogAdoptedSessionKey as u };
