import { a as asOptionalRecord, c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { t as areDiagnosticsEnabledForProcess } from "../../diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "../../subsystem-mStysHHC.mjs";
import { w as isSubagentSessionKey } from "../../session-key-CSDERtm3.mjs";
import { i as listAgentIds } from "../../agent-roster-gkYP38su.mjs";
import { n as validateJsonSchemaValue } from "../../schema-validator-B9g4ZpIt.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import "../../routing-Dl7FngGa.mjs";
import "../../agent-scope-runtime-Dld1eD8B.mjs";
import { C as prepareSessionCatalogSourceActorProjector, S as prepareSessionCatalogGitHubLinker, v as readSessionTranscriptCatalogPage, y as readSessionTranscriptCatalogTitleAsync } from "../../session-transcript-runtime-Bxvuf0q8.mjs";
import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import "../../json-schema-runtime-DwjLDY1j.mjs";
import "../../diagnostic-runtime-CMknAYR3.mjs";
import "../../session-catalog-D8nD7pNy.mjs";
import { n as sessionCatalogPaging, t as publishSessionCatalogHost } from "../../session-catalog-paging-Ca-qWw_C.mjs";
//#region extensions/session-share/src/config.ts
function sessionShareConfig(config) {
	const value = config.plugins?.entries?.["session-share"]?.config;
	return isRecord(value) ? value : {};
}
function sessionShareGroups(config) {
	const share = sessionShareConfig(config).share;
	if (!isRecord(share) || !Array.isArray(share.groups)) return [];
	return share.groups.filter((group) => typeof group === "string" && group.length > 0);
}
function sessionShareNodeBinding(config, nodeId) {
	const nodes = sessionShareConfig(config).nodes;
	const binding = isRecord(nodes) ? nodes[nodeId] : void 0;
	return {
		...isRecord(binding) && typeof binding.owner === "string" ? { owner: binding.owner } : {},
		linkGitHubIdentities: isRecord(binding) && binding.linkGitHubIdentities === true
	};
}
//#endregion
//#region extensions/session-share/src/node-commands.ts
const SESSION_SHARE_LIST_COMMAND = "openclaw.sessions.list.v1";
const SESSION_SHARE_READ_COMMAND = "openclaw.sessions.read.v1";
const SESSION_SHARE_COMMANDS = [SESSION_SHARE_LIST_COMMAND, SESSION_SHARE_READ_COMMAND];
const parameterMessages = {
	listNotObject: "Session list parameters must be an object",
	unknownListParameter: (key) => `Unknown session list parameter: ${key}`,
	invalidSearchTerm: "searchTerm must be a non-empty string of at most 500 characters",
	readNotObject: "Session read parameters must be an object",
	unknownReadParameter: (key) => `Unknown session read parameter: ${key}`,
	invalidThreadId: "threadId must be a non-empty session key of at most 512 characters"
};
function parseNodeParams(paramsJSON) {
	return paramsJSON ? JSON.parse(paramsJSON) : void 0;
}
function isSharedEntry(groups, { sessionKey, entry }) {
	return entry.category !== void 0 && groups.has(entry.category) && entry.incognito !== true && entry.visibility !== "draft" && !isSubagentSessionKey(sessionKey) && entry.createdVia !== "spawn" && !entry.spawnedBy?.trim() && !/^agent:[^:]+:catalog:/i.test(sessionKey);
}
function sharedEntries(api, selected) {
	const config = api.runtime.config.current();
	const groups = new Set(sessionShareGroups(config));
	if (groups.size === 0) return [];
	return listAgentIds(config).filter((agentId) => selected.some((entry) => entry.agentId === agentId)).toSorted().flatMap((agentId) => {
		const storePath = api.runtime.agent.session.resolveStorePath(config.session?.store, { agentId });
		const sessionKeys = selected.filter((entry) => entry.agentId === agentId && entry.storePath === storePath).map((entry) => entry.sessionKey);
		if (sessionKeys.length === 0) return [];
		return api.runtime.agent.session.listSessionEntries({
			agentId,
			storePath,
			readOnly: true,
			includeParticipants: false,
			sessionKeys
		}).map((session) => Object.assign({}, session, {
			agentId,
			storePath
		}));
	}).filter((session) => isSharedEntry(groups, session));
}
function createSessionShareNodeCommands(api) {
	const source = {
		pluginId: "session-share",
		sourceDomain: "openclaw"
	};
	let readersConfig;
	const readers = /* @__PURE__ */ new Map();
	async function readSharedEntries() {
		const config = api.runtime.config.current();
		if (config !== readersConfig) {
			readers.clear();
			readersConfig = config;
		}
		const groups = new Set(sessionShareGroups(config));
		const sessions = [];
		const active = /* @__PURE__ */ new Set();
		for (const agentId of groups.size ? listAgentIds(config).toSorted() : []) {
			const storePath = api.runtime.agent.session.resolveStorePath(config.session?.store, { agentId });
			const key = JSON.stringify([agentId, storePath]);
			active.add(key);
			let read = readers.get(key);
			if (!read) {
				read = api.runtime.agent.session.createSessionEntryListReader({
					agentId,
					storePath
				});
				readers.set(key, read);
			}
			const snapshot = await (await read)();
			if (api.runtime.config.current() !== config) throw new Error("Session sharing configuration changed. Refresh the session catalog.");
			for (const session of snapshot.entries) if (isSharedEntry(groups, session)) sessions.push({
				...session,
				agentId,
				storePath,
				assertSourceCurrent: snapshot.assertCurrent
			});
		}
		for (const key of readers.keys()) if (!active.has(key)) readers.delete(key);
		return sessions;
	}
	return [{
		command: SESSION_SHARE_LIST_COMMAND,
		hasActiveWork: () => false,
		cap: "openclaw-sessions",
		dangerous: false,
		isAvailable: ({ config }) => sessionShareGroups(config).length > 0,
		async handle(paramsJSON) {
			const params = sessionCatalogPaging.parseListParams(parseNodeParams(paramsJSON), {
				searchMaxLength: 500,
				messages: parameterMessages
			});
			const offset = sessionCatalogPaging.decodeCursor(params.cursor);
			const search = params.searchTerm?.toLowerCase();
			const sessions = [];
			for (const { agentId, sessionKey, storePath, entry, assertSourceCurrent } of await readSharedEntries()) {
				const name = search ? await readSessionTranscriptCatalogTitleAsync({
					agentId,
					sessionKey,
					storePath,
					entry
				}) : void 0;
				if (search && !name?.toLowerCase().includes(search) && !sessionKey.toLowerCase().includes(search)) continue;
				sessions.push({
					agentId,
					storePath,
					threadId: sessionKey,
					name,
					entry,
					assertSourceCurrent,
					recencyAt: Math.max(entry.updatedAt, entry.lastInteractionAt ?? 0, entry.lastActivityAt ?? 0)
				});
			}
			sessions.sort((left, right) => right.recencyAt - left.recencyAt || left.threadId.localeCompare(right.threadId));
			const selected = sessions.slice(offset, offset + params.limit);
			if (!search) for (const session of selected) session.name = await readSessionTranscriptCatalogTitleAsync({
				agentId: session.agentId,
				sessionKey: session.threadId,
				storePath: session.storePath,
				entry: session.entry
			});
			const sourceAssertions = new Set(selected.map((session) => session.assertSourceCurrent));
			const projectCreator = await prepareSessionCatalogSourceActorProjector({
				...source,
				actors: selected.map(({ entry }) => entry.createdActor)
			});
			sourceAssertions.forEach((assertCurrent) => assertCurrent());
			const current = sharedEntries(api, selected.map((session) => ({
				agentId: session.agentId,
				storePath: session.storePath,
				sessionKey: session.threadId
			})));
			if (selected.some((session) => !current.some(({ agentId, sessionKey, storePath, entry }) => agentId === session.agentId && sessionKey === session.threadId && storePath === session.storePath && entry.sessionId === session.entry.sessionId))) throw new Error("Session is no longer shared. Refresh the session catalog.");
			const page = selected.map(({ threadId, name, entry, recencyAt }) => {
				const archived = entry.archivedAt !== void 0;
				const cwd = entry.execCwd ?? entry.spawnedCwd ?? entry.spawnedWorkspaceDir ?? entry.worktree?.canonicalWorkspaceDir ?? entry.worktree?.repoRoot;
				return {
					threadId,
					name,
					color: entry.color,
					cwd: cwd ? cwd.slice(0, 6e3) : void 0,
					status: archived ? "archived" : "idle",
					createdAt: entry.createdAt,
					updatedAt: entry.updatedAt,
					recencyAt,
					gitBranch: entry.worktree?.branch ? entry.worktree.branch.slice(0, 6e3) : void 0,
					archived,
					canContinue: false,
					canArchive: false,
					canOpenTerminal: false,
					createdActor: projectCreator(entry.createdActor)
				};
			});
			return JSON.stringify({
				sessions: page,
				...offset + page.length < sessions.length ? { nextCursor: sessionCatalogPaging.encodeCursor(offset + page.length) } : {}
			});
		}
	}, {
		command: SESSION_SHARE_READ_COMMAND,
		hasActiveWork: () => false,
		cap: "openclaw-sessions",
		dangerous: false,
		isAvailable: ({ config }) => sessionShareGroups(config).length > 0,
		async handle(paramsJSON) {
			const params = sessionCatalogPaging.parseReadParams(parseNodeParams(paramsJSON), {
				threadIdMaxLength: 512,
				threadIdPattern: /^[^\0\r\n]+$/,
				cursorMaxLength: 1200,
				messages: parameterMessages
			});
			const session = (await readSharedEntries()).find(({ sessionKey }) => sessionKey === params.threadId);
			if (!session) throw new Error("Session is not shared. The source operator must select its group and keep it non-draft.");
			const page = await readSessionTranscriptCatalogPage({
				...source,
				agentId: session.agentId,
				sessionKey: session.sessionKey,
				storePath: session.storePath,
				limit: params.limit,
				cursor: params.cursor
			});
			session.assertSourceCurrent();
			if (!sharedEntries(api, [session]).some(({ agentId, sessionKey, storePath, entry }) => agentId === session.agentId && sessionKey === session.sessionKey && storePath === session.storePath && entry.sessionId === session.entry.sessionId)) throw new Error("Session is no longer shared. Refresh the session catalog.");
			return JSON.stringify({
				threadId: session.sessionKey,
				...page
			});
		}
	}];
}
//#endregion
//#region extensions/session-share/src/wire.ts
const shortString = {
	type: "string",
	minLength: 1,
	maxLength: 512
};
const label = {
	type: "string",
	minLength: 1,
	maxLength: 200
};
const text = {
	type: "string",
	maxLength: 6e3
};
const cursor = {
	type: "string",
	minLength: 1,
	maxLength: 2048,
	pattern: "^[A-Za-z0-9_-]+$"
};
const identity = { oneOf: [
	{
		type: "object",
		additionalProperties: false,
		required: [
			"type",
			"pluginId",
			"domain",
			"idKind",
			"id"
		],
		properties: {
			type: { const: "remote" },
			pluginId: shortString,
			domain: shortString,
			idKind: shortString,
			id: shortString
		}
	},
	{
		type: "object",
		additionalProperties: false,
		required: [
			"type",
			"pluginId",
			"accountId",
			"senderKind",
			"id"
		],
		properties: {
			type: { const: "observation" },
			pluginId: { anyOf: [shortString, { type: "null" }] },
			accountId: { anyOf: [shortString, { type: "null" }] },
			senderKind: { enum: [
				"human",
				"bot",
				"unknown"
			] },
			id: shortString
		}
	},
	{
		type: "object",
		additionalProperties: false,
		required: ["type", "id"],
		properties: {
			type: { const: "agent" },
			id: shortString
		}
	},
	{
		type: "object",
		additionalProperties: false,
		required: [
			"type",
			"actorType",
			"source",
			"id"
		],
		properties: {
			type: { const: "legacy" },
			actorType: shortString,
			source: { anyOf: [shortString, { type: "null" }] },
			id: text
		}
	}
] };
const participant = {
	type: "object",
	additionalProperties: false,
	required: ["identity"],
	properties: {
		identity,
		label,
		avatarUrl: shortString
	}
};
const sessionPageSchema = {
	type: "object",
	additionalProperties: false,
	required: ["sessions"],
	properties: {
		nextCursor: cursor,
		sessions: {
			type: "array",
			maxItems: 100,
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"threadId",
					"status",
					"archived",
					"canContinue",
					"canArchive"
				],
				properties: {
					threadId: shortString,
					name: text,
					color: shortString,
					cwd: text,
					status: { enum: [
						"live",
						"idle",
						"archived"
					] },
					createdAt: { type: "number" },
					updatedAt: { type: "number" },
					recencyAt: { type: "number" },
					gitBranch: text,
					archived: { type: "boolean" },
					createdActor: {
						type: "object",
						additionalProperties: false,
						required: ["type"],
						properties: {
							type: { enum: [
								"human",
								"agent",
								"system"
							] },
							id: shortString,
							identity,
							label,
							avatarUrl: shortString
						}
					},
					canContinue: { const: false },
					canArchive: { const: false },
					canOpenTerminal: { const: false }
				}
			}
		}
	}
};
const transcriptPageSchema = {
	type: "object",
	additionalProperties: false,
	required: ["threadId", "items"],
	properties: {
		threadId: shortString,
		nextCursor: cursor,
		items: {
			type: "array",
			maxItems: 100,
			items: {
				type: "object",
				additionalProperties: false,
				required: ["type"],
				properties: {
					type: { enum: [
						"userMessage",
						"agentMessage",
						"reasoning",
						"toolCall",
						"toolResult",
						"other"
					] },
					id: shortString,
					text,
					timestamp: shortString,
					model: shortString,
					sender: participant,
					truncated: { type: "boolean" }
				}
			}
		}
	}
};
function isSessionPage(value) {
	return validateJsonSchemaValue({
		schema: sessionPageSchema,
		cacheKey: "session-share.sessions.v1",
		value
	}).ok;
}
function isTranscriptPage(value) {
	return validateJsonSchemaValue({
		schema: transcriptPageSchema,
		cacheKey: "session-share.transcript.v1",
		value
	}).ok;
}
function unwrapPayload(value) {
	if (isRecord(value) && typeof value.payloadJSON === "string") {
		if (value.payloadJSON.length > 2097152) throw new Error("Session catalog response exceeded the page limit");
		return JSON.parse(value.payloadJSON);
	}
	return value;
}
function parseSessionSharePage(raw) {
	const value = unwrapPayload(raw);
	if (!isSessionPage(value) || value.nextCursor !== void 0 && !sessionCatalogPaging.isExactCursor(value.nextCursor)) throw new Error("Invalid OpenClaw session page from paired node");
	return value;
}
function parseSessionShareTranscriptPage(raw, threadId) {
	const value = unwrapPayload(raw);
	if (!isTranscriptPage(value) || value.threadId !== threadId) throw new Error("Invalid OpenClaw transcript page from paired node");
	return value;
}
//#endregion
//#region extensions/session-share/src/session-catalog.ts
const REFRESH_MS = 3e4;
const MAX_STALENESS_MS = 6e4;
const REFRESH_BUDGET_MS = 3e5;
const MAX_SNAPSHOTS = 32;
const MAX_REFRESHES = 4;
const MAX_SNAPSHOT_ROWS = 1e4;
const MAX_SNAPSHOT_BYTES = 16777216;
var SnapshotLimitError = class extends Error {
	constructor() {
		super("Shared catalog exceeds the snapshot limit (10,000 sessions or 16 MiB). Reduce the shared groups on the source node.");
	}
};
const log = createSubsystemLogger("gateway/session-catalog");
const nodeErrorCodes = /* @__PURE__ */ new Set([
	"TIMEOUT",
	"NOT_CONNECTED",
	"PAIRING_CHANGED",
	"ROUTE_CHANGED",
	"ABORTED",
	"UNAVAILABLE",
	"POLICY_CHANGED",
	"APPROVAL_AUTHORITY_CLOSED"
]);
async function observeCatalogRefresh(operation, warn) {
	if (!areDiagnosticsEnabledForProcess() || !log.isEnabled("warn")) return operation();
	const started = performance.now();
	const finish = (outcome, error) => {
		try {
			if (!areDiagnosticsEnabledForProcess() || !log.isEnabled("warn")) return;
			const elapsedMs = performance.now() - started;
			if (elapsedMs < 1e3 || !warn()) return;
			const details = asOptionalRecord(asOptionalRecord(error)?.details);
			const nodeError = asOptionalRecord(details?.nodeError);
			const nodeErrorCode = nodeError?.code;
			log.warn("slow Session Share catalog refresh", {
				elapsedMs: Math.round(elapsedMs),
				outcome,
				...nodeError ? { nodeErrorCode: typeof nodeErrorCode === "string" && nodeErrorCodes.has(nodeErrorCode) ? nodeErrorCode : "unknown" } : {},
				...typeof details?.nodeCommandDispatched === "boolean" ? { nodeCommandDispatched: details.nodeCommandDispatched } : {}
			});
		} catch {}
	};
	try {
		const value = await operation();
		finish("resolved");
		return value;
	} catch (error) {
		finish("rejected", error);
		throw error;
	}
}
function namespaceIdentity(identity, hostId) {
	return identity.type === "remote" && identity.pluginId === "session-share" ? {
		...identity,
		domain: hostId
	} : identity;
}
function nodeLabel(node) {
	return node.displayName?.trim() || node.remoteIp?.trim() || node.nodeId;
}
function isSessionHost(node) {
	return SESSION_SHARE_COMMANDS.every((command) => node.commands?.includes(command));
}
function bindSession(session, hostId, owner, linkParticipant) {
	const sourceActor = session.createdActor;
	const portable = sourceActor?.type === "human" && (sourceActor.identity?.type === "remote" || sourceActor.identity?.type === "observation");
	const actor = !portable && owner ? owner : sourceActor;
	if (!actor?.identity) return actor ? {
		...session,
		createdActor: actor
	} : session;
	const participant = {
		identity: namespaceIdentity(actor.identity, hostId),
		label: actor.label,
		avatarUrl: actor.avatarUrl
	};
	const linked = portable && linkParticipant ? linkParticipant(participant) : participant;
	return {
		...session,
		createdActor: {
			...actor,
			...linked,
			...linked.identity.type === "profile" ? { id: linked.identity.id } : {}
		}
	};
}
function createSessionShareCatalog(api) {
	const snapshots = /* @__PURE__ */ new Map();
	const publicationGuards = /* @__PURE__ */ new WeakMap();
	let context;
	let nextWarningAt = 0;
	const workers = /* @__PURE__ */ new Set();
	const queued = /* @__PURE__ */ new Map();
	const bindingFor = (nodeId) => sessionShareNodeBinding(api.runtime.config.current(), nodeId);
	const current = (entry) => !entry.scope.signal.aborted && api.runtime.config.current() === entry.config && snapshots.get(entry.node.nodeId) === entry;
	const retire = (entry) => {
		snapshots.delete(entry.node.nodeId);
		entry.sessions = void 0;
		entry.scope.stop();
	};
	const sameConnection = (entry, node) => node?.connected && isSessionHost(node) && node.connectedAtMs === entry.node.connectedAtMs;
	function pump(owner) {
		if (context !== owner || owner.scheduler.signal.aborted) return;
		for (let worker = 0; worker < MAX_REFRESHES; worker++) {
			if (workers.has(worker) || !queued.size) continue;
			workers.add(worker);
			owner.scheduler.schedule({
				id: `refresh:${worker}`,
				delayMs: 0,
				async run() {
					try {
						for (;;) {
							const next = queued.entries().next().value;
							if (!next) return;
							const [entry, run] = next;
							queued.delete(entry);
							if (current(entry)) await run();
							else retire(entry);
						}
					} finally {
						workers.delete(worker);
						pump(owner);
					}
				}
			});
		}
	}
	function refresh(entry, owner) {
		const completion = Promise.withResolvers();
		entry.pending = completion.promise;
		const signal = entry.scope.signal;
		const release = () => {
			queued.delete(entry);
			completion.resolve();
		};
		signal.addEventListener("abort", release, { once: true });
		queued.set(entry, async () => {
			try {
				const snapshot = await observeCatalogRefresh(async () => {
					const deadline = performance.now() + REFRESH_BUDGET_MS;
					const sessions = [];
					let cursor;
					let bytes = 0;
					do {
						if (!current(entry) || !owner.invokeNode) throw new Error("Session Share catalog owner retired");
						const timeoutMs = Math.min(REFRESH_MS, Math.ceil(deadline - performance.now()));
						if (timeoutMs <= 0) throw new Error("Session Share catalog refresh timed out");
						const page = parseSessionSharePage(await owner.invokeNode({
							nodeId: entry.node.nodeId,
							command: SESSION_SHARE_LIST_COMMAND,
							params: {
								limit: 100,
								...cursor ? { cursor } : {}
							},
							timeoutMs,
							signal
						}));
						bytes += Buffer.byteLength(JSON.stringify(page));
						if (sessions.length + page.sessions.length > MAX_SNAPSHOT_ROWS || bytes > MAX_SNAPSHOT_BYTES) throw new SnapshotLimitError();
						sessions.push(...page.sessions);
						if (page.nextCursor !== void 0 && sessionCatalogPaging.decodeCursor(page.nextCursor) <= sessionCatalogPaging.decodeCursor(cursor)) throw new Error("Session Share catalog cursor did not advance");
						cursor = page.nextCursor;
					} while (cursor);
					return sessions;
				}, () => {
					const now = performance.now();
					if (now < nextWarningAt) return false;
					nextWarningAt = now + MAX_STALENESS_MS;
					return true;
				});
				const connectedNode = (await api.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === entry.node.nodeId);
				if (!current(entry)) return;
				if (!sameConnection(entry, connectedNode)) {
					retire(entry);
					return;
				}
				entry.sessions = snapshot;
				entry.refreshedAt = performance.now();
				entry.retryMs = REFRESH_MS;
				entry.error = void 0;
			} catch (error) {
				entry.retryMs = entry.error ? Math.min(entry.retryMs * 2, 3e5) : REFRESH_MS;
				entry.error = error instanceof SnapshotLimitError ? {
					code: "CATALOG_TOO_LARGE",
					message: error.message
				} : {
					code: "NODE_INVOKE_FAILED",
					message: "Cannot refresh OpenClaw sessions. Check the paired node's session-share configuration and connection."
				};
			} finally {
				entry.pending = void 0;
				signal.removeEventListener("abort", release);
				completion.resolve();
				if (current(entry)) entry.scope.schedule({
					id: "next-refresh",
					delayMs: entry.retryMs,
					run: () => refresh(entry, owner)
				});
			}
		});
		pump(owner);
	}
	function reconcile(nodes) {
		const owner = context;
		if (!owner || owner.scheduler.signal.aborted) return;
		const config = api.runtime.config.current();
		for (const entry of snapshots.values()) if (entry.config !== config || !sameConnection(entry, nodes.find((node) => node.nodeId === entry.node.nodeId))) retire(entry);
	}
	function admit(nodes) {
		const owner = context;
		if (!owner || owner.scheduler.signal.aborted) return;
		const config = api.runtime.config.current();
		const selected = new Set(nodes.map((node) => node.nodeId));
		for (const node of nodes.filter((candidate) => candidate.connected)) {
			const existing = snapshots.get(node.nodeId);
			if (existing) {
				snapshots.delete(node.nodeId);
				snapshots.set(node.nodeId, existing);
				continue;
			}
			if (snapshots.size >= MAX_SNAPSHOTS) {
				const victim = Array.from(snapshots.values()).find((candidate) => !candidate.pending && !selected.has(candidate.node.nodeId));
				if (!victim) continue;
				retire(victim);
			}
			const entry = {
				node,
				config,
				scope: owner.scheduler.scope(),
				refreshedAt: 0,
				retryMs: REFRESH_MS
			};
			snapshots.set(node.nodeId, entry);
			refresh(entry, owner);
		}
	}
	api.registerService({
		id: "session-share-catalog",
		apiVersion: 2,
		start(ctx) {
			workers.clear();
			context = ctx;
			ctx.scheduler.schedule({
				id: "nodes",
				delayMs: 0,
				everyMs: REFRESH_MS,
				async run() {
					if (!snapshots.size) return;
					const { nodes } = await api.runtime.nodes.list();
					if (context === ctx) reconcile(nodes);
				}
			});
		},
		stop() {
			context = void 0;
			snapshots.clear();
			queued.clear();
		}
	});
	async function listNode(node, query) {
		const hostId = `node:${node.nodeId}`;
		const { onHost, waitUntil, signal, allowPartialResults } = query;
		const search = query.search?.trim().toLowerCase();
		const cursor = query.cursors?.[hostId];
		const limit = sessionCatalogPaging.boundedLimit(query.limitPerHost);
		const common = {
			hostId,
			label: nodeLabel(node),
			kind: "node",
			nodeId: node.nodeId,
			connected: node.connected === true
		};
		const failed = (code, message) => ({
			...common,
			sessions: [],
			error: {
				code,
				message
			}
		});
		if (!node.connected) return failed("NODE_OFFLINE", "Paired node is offline");
		const entry = snapshots.get(node.nodeId);
		const project = async () => {
			if (!entry) return failed(context ? "CATALOG_LOADING" : "NODE_INVOKE_FAILED", "Session Share is unavailable or busy. Refresh the catalog.");
			if (!current(entry)) return failed("NODE_INVOKE_FAILED", "Session Share is unavailable. Refresh the catalog.");
			if (!entry.sessions || performance.now() - entry.refreshedAt >= MAX_STALENESS_MS) return entry.error ? {
				...common,
				sessions: [],
				error: entry.error
			} : failed("CATALOG_LOADING", "Session Share catalog is still loading. Refresh the catalog.");
			const sessions = search ? entry.sessions.filter((session) => session.name?.toLowerCase().includes(search) || session.threadId.toLowerCase().includes(search)) : entry.sessions;
			const offset = sessionCatalogPaging.decodeCursor(cursor);
			const binding = bindingFor(node.nodeId);
			const selected = sessions.slice(offset, offset + limit);
			const linker = binding.owner || binding.linkGitHubIdentities ? await prepareSessionCatalogGitHubLinker({
				owners: binding.owner ? [binding.owner] : [],
				participants: binding.linkGitHubIdentities ? selected.flatMap(({ createdActor }) => createdActor?.identity ? [{ identity: createdActor.identity }] : []) : []
			}) : void 0;
			if (!current(entry) || signal?.aborted) return failed("NODE_INVOKE_FAILED", "Session Share is unavailable. Refresh the catalog.");
			const owner = binding.owner ? linker?.resolveOwner(binding.owner) : void 0;
			const linkParticipant = binding.linkGitHubIdentities ? linker?.linkParticipant : void 0;
			const host = {
				...common,
				sessions: selected.map((session) => bindSession(session, hostId, owner, linkParticipant)),
				...offset + limit < sessions.length ? { nextCursor: sessionCatalogPaging.encodeCursor(offset + limit) } : {}
			};
			publicationGuards.set(host, () => {
				if (!current(entry) || signal?.aborted) throw new Error("Session Share is unavailable. Refresh the catalog.");
				linker?.assertCurrent();
			});
			return host;
		};
		const host = await project();
		if (entry && !current(entry) || signal?.aborted) return failed("NODE_INVOKE_FAILED", "Session Share is unavailable. Refresh the catalog.");
		publicationGuards.get(host)?.();
		if (entry?.pending && allowPartialResults === true && onHost && waitUntil) {
			publishSessionCatalogHost({
				waitUntil,
				onHost: (completedHost) => {
					if (completedHost && current(entry) && !signal?.aborted) {
						publicationGuards.get(completedHost)?.();
						onHost(completedHost);
					}
				}
			}, entry.pending.then(() => signal?.aborted ? void 0 : project()));
			if (!host.error) {
				const pendingHost = {
					...host,
					pending: true
				};
				const guard = publicationGuards.get(host);
				if (guard) publicationGuards.set(pendingHost, guard);
				return pendingHost;
			}
		}
		onHost?.(host);
		return host;
	}
	return {
		id: "openclaw",
		label: "OpenClaw sessions",
		supportsProcessHomeIsolation: true,
		audience: "session-viewers",
		async list(query) {
			query.signal?.throwIfAborted();
			const config = api.runtime.config.current();
			let nodes;
			try {
				nodes = (await (query.listNodes?.() ?? api.runtime.nodes.list())).nodes;
			} catch (error) {
				query.signal?.throwIfAborted();
				throw error;
			}
			query.signal?.throwIfAborted();
			if (api.runtime.config.current() !== config) return [];
			reconcile(nodes);
			const requested = query.hostIds ? new Set(query.hostIds) : void 0;
			const eligible = nodes.filter((node) => isSessionHost(node) && (!requested || requested.has(`node:${node.nodeId}`))).toSorted((left, right) => nodeLabel(left).localeCompare(nodeLabel(right)) || left.nodeId.localeCompare(right.nodeId)).slice(0, MAX_SNAPSHOTS);
			admit(eligible);
			const owner = context;
			const hosts = await Promise.all(eligible.map((node) => {
				query.signal?.throwIfAborted();
				return listNode(node, query);
			}));
			query.signal?.throwIfAborted();
			if (context !== owner || api.runtime.config.current() !== config) return [];
			for (const host of hosts) publicationGuards.get(host)?.();
			return hosts;
		},
		async read(request) {
			if (!request.hostId.startsWith("node:") || !request.hostId.slice(5)) throw new Error("Select a paired node host to read an OpenClaw session");
			const nodeId = request.hostId.slice(5);
			const node = (await api.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected && isSessionHost(candidate));
			if (!node) throw new Error("OpenClaw session node is unavailable. Reconnect it and refresh the catalog.");
			const page = parseSessionShareTranscriptPage(await api.runtime.nodes.invoke({
				nodeId,
				command: SESSION_SHARE_READ_COMMAND,
				timeoutMs: 3e4,
				scopes: ["operator.write"],
				params: {
					threadId: request.threadId,
					limit: sessionCatalogPaging.boundedLimit(request.limit),
					...request.cursor !== void 0 ? { cursor: request.cursor } : {}
				}
			}), request.threadId);
			const config = api.runtime.config.current();
			const linkParticipant = bindingFor(nodeId).linkGitHubIdentities ? (await prepareSessionCatalogGitHubLinker({ participants: page.items.flatMap((item) => item.sender ? [item.sender] : []) })).linkParticipant : void 0;
			if (api.runtime.config.current() !== config) throw new Error("Session Share configuration changed while preparing the page. Retry the request.");
			return {
				...page,
				hostId: request.hostId,
				label: nodeLabel(node),
				items: page.items.map((item) => {
					if (!item.sender) return item;
					const sender = {
						...item.sender,
						identity: namespaceIdentity(item.sender.identity, request.hostId)
					};
					return Object.assign({}, item, { sender: linkParticipant?.(sender) ?? sender });
				})
			};
		}
	};
}
//#endregion
//#region extensions/session-share/index.ts
var session_share_default = definePluginEntry({
	id: "session-share",
	name: "Session Share",
	description: "Read-only OpenClaw sessions on paired gateways",
	register(api) {
		api.registerSessionCatalog(createSessionShareCatalog(api));
		for (const command of createSessionShareNodeCommands(api)) api.registerNodeHostCommand(command);
		api.registerNodeInvokePolicy({
			commands: SESSION_SHARE_COMMANDS,
			defaultPlatforms: [
				"macos",
				"linux",
				"windows"
			],
			handle: (context) => context.invokeNode()
		});
	}
});
//#endregion
export { session_share_default as default };
