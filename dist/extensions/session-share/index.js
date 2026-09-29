import { a as asOptionalRecord, c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { O as listAgentIds } from "../../agent-scope-config-IQKOEtZ4.mjs";
import { S as isSubagentSessionKey } from "../../session-key-CBvmC8zz.mjs";
import { b as redactToolPayloadText } from "../../redact-B5EGyLvV.mjs";
import { t as areDiagnosticsEnabledForProcess } from "../../diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "../../subsystem-DleLyu58.mjs";
import { n as validateJsonSchemaValue } from "../../schema-validator-G8odGT6Q.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../routing-JKvWkBDR.mjs";
import "../../agent-scope-runtime-OY7yRyJL.mjs";
import { _ as createSessionCatalogGitHubLinker, g as readSessionTranscriptCatalogTitle, h as readSessionTranscriptCatalogPage, v as createSessionCatalogSourceActorProjector } from "../../session-transcript-runtime-BW5gMlRE.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../json-schema-runtime-ty5aNvzs.mjs";
import "../../logging-core-PsFqpLw0.mjs";
import "../../diagnostic-runtime-dzEIwnbc.mjs";
import "../../session-catalog-BvzVZkO1.mjs";
import { n as sessionCatalogPaging } from "../../session-catalog-paging-Bvcta34E.mjs";
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
function sharedEntries(api) {
	const config = api.runtime.config.current();
	const groups = new Set(sessionShareGroups(config));
	if (groups.size === 0) return [];
	return listAgentIds(config).toSorted().flatMap((agentId) => {
		const storePath = api.runtime.agent.session.resolveStorePath(config.session?.store, { agentId });
		return api.runtime.agent.session.listSessionEntries({
			agentId,
			storePath,
			readOnly: true
		}).map((session) => Object.assign({}, session, {
			agentId,
			storePath
		}));
	}).filter(({ sessionKey, entry }) => entry.category !== void 0 && groups.has(entry.category) && entry.incognito !== true && entry.visibility !== "draft" && !isSubagentSessionKey(sessionKey) && entry.createdVia !== "spawn" && !entry.spawnedBy?.trim() && !/^agent:[^:]+:catalog:/i.test(sessionKey));
}
function createSessionShareNodeCommands(api) {
	const source = {
		pluginId: "session-share",
		sourceDomain: "openclaw"
	};
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
			for (const { agentId, sessionKey, storePath, entry } of sharedEntries(api)) {
				const name = search ? readSessionTranscriptCatalogTitle({
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
					recencyAt: Math.max(entry.updatedAt, entry.lastInteractionAt ?? 0, entry.lastActivityAt ?? 0)
				});
			}
			sessions.sort((left, right) => right.recencyAt - left.recencyAt || left.threadId.localeCompare(right.threadId));
			const selected = sessions.slice(offset, offset + params.limit);
			if (!search) for (const session of selected) session.name = readSessionTranscriptCatalogTitle({
				agentId: session.agentId,
				sessionKey: session.threadId,
				storePath: session.storePath,
				entry: session.entry
			});
			const projectCreator = createSessionCatalogSourceActorProjector({
				...source,
				actors: selected.map(({ entry }) => entry.createdActor)
			});
			const page = selected.map(({ threadId, name, entry, recencyAt }) => {
				const archived = entry.archivedAt !== void 0;
				const cwd = entry.execCwd ?? entry.spawnedCwd ?? entry.spawnedWorkspaceDir ?? entry.worktree?.canonicalWorkspaceDir ?? entry.worktree?.repoRoot;
				return {
					threadId,
					name,
					color: entry.color,
					cwd: cwd ? redactToolPayloadText(cwd).slice(0, 6e3) : void 0,
					status: archived ? "archived" : "idle",
					createdAt: entry.createdAt,
					updatedAt: entry.updatedAt,
					recencyAt,
					gitBranch: entry.worktree?.branch ? redactToolPayloadText(entry.worktree.branch).slice(0, 6e3) : void 0,
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
			const session = sharedEntries(api).find(({ sessionKey }) => sessionKey === params.threadId);
			if (!session) throw new Error("Session is not shared. The source operator must select its group and keep it non-draft.");
			const page = await readSessionTranscriptCatalogPage({
				...source,
				agentId: session.agentId,
				sessionKey: session.sessionKey,
				storePath: session.storePath,
				limit: params.limit,
				cursor: params.cursor
			});
			if (!sharedEntries(api).some(({ agentId, sessionKey, storePath, entry }) => agentId === session.agentId && sessionKey === session.sessionKey && storePath === session.storePath && entry.sessionId === session.entry.sessionId)) throw new Error("Session is no longer shared. Refresh the session catalog.");
			return JSON.stringify({
				threadId: session.sessionKey,
				...page
			});
		}
	}];
}
function createSessionShareNodeInvokePolicies() {
	return [{
		commands: SESSION_SHARE_COMMANDS,
		defaultPlatforms: [
			"macos",
			"linux",
			"windows"
		],
		handle: (context) => context.invokeNode()
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
function observeCatalogPhase(phase, operation) {
	if (!areDiagnosticsEnabledForProcess() || !log.isEnabled("warn")) return operation();
	const started = performance.now();
	const finish = (outcome, error) => {
		try {
			if (!areDiagnosticsEnabledForProcess() || !log.isEnabled("warn")) return;
			const elapsedMs = performance.now() - started;
			if (elapsedMs < 1e3) return;
			const details = asOptionalRecord(asOptionalRecord(error)?.details);
			const nodeError = asOptionalRecord(details?.nodeError);
			const nodeErrorCode = nodeError?.code;
			log.warn("slow Session Share catalog phase", {
				phase,
				elapsedMs: Math.round(elapsedMs),
				outcome,
				...nodeError ? { nodeErrorCode: typeof nodeErrorCode === "string" && nodeErrorCodes.has(nodeErrorCode) ? nodeErrorCode : "unknown" } : {},
				...typeof details?.nodeCommandDispatched === "boolean" ? { nodeCommandDispatched: details.nodeCommandDispatched } : {}
			});
		} catch {}
	};
	try {
		return operation().then((value) => {
			finish("resolved");
			return value;
		}, (error) => {
			finish("rejected", error);
			throw error;
		});
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
	const bindingFor = (nodeId) => sessionShareNodeBinding(api.runtime.config.current(), nodeId);
	const invoke = (nodeId, command, params, signal) => api.runtime.nodes.invoke({
		nodeId,
		command,
		params,
		timeoutMs: 3e4,
		scopes: ["operator.write"],
		signal
	});
	async function listNode(node, query) {
		const hostId = `node:${node.nodeId}`;
		const common = {
			hostId,
			label: nodeLabel(node),
			kind: "node",
			nodeId: node.nodeId,
			connected: node.connected === true
		};
		if (!node.connected) return {
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
			if (cursor !== void 0) sessionCatalogPaging.decodeCursor(cursor);
			const raw = await observeCatalogPhase("invoke", () => invoke(node.nodeId, SESSION_SHARE_LIST_COMMAND, {
				limit: sessionCatalogPaging.boundedLimit(query.limitPerHost),
				...query.search ? { searchTerm: query.search } : {},
				...cursor !== void 0 ? { cursor } : {}
			}, query.signal));
			query.signal?.throwIfAborted();
			const page = parseSessionSharePage(raw);
			const binding = bindingFor(node.nodeId);
			const linker = binding.owner || binding.linkGitHubIdentities ? createSessionCatalogGitHubLinker() : void 0;
			const owner = binding.owner ? linker?.resolveOwner(binding.owner) : void 0;
			const linkParticipant = binding.linkGitHubIdentities ? linker?.linkParticipant : void 0;
			return {
				...common,
				...page,
				sessions: page.sessions.map((session) => bindSession(session, hostId, owner, linkParticipant))
			};
		} catch {
			query.signal?.throwIfAborted();
			return {
				...common,
				sessions: [],
				error: {
					code: "NODE_INVOKE_FAILED",
					message: "Cannot list OpenClaw sessions. Check the paired node's session-share configuration and connection."
				}
			};
		}
	}
	return {
		id: "openclaw",
		label: "OpenClaw sessions",
		supportsProcessHomeIsolation: true,
		audience: "session-viewers",
		async list(query) {
			query.signal?.throwIfAborted();
			let nodes;
			try {
				nodes = (await observeCatalogPhase("discovery", () => query.listNodes?.() ?? api.runtime.nodes.list())).nodes;
			} catch {
				query.signal?.throwIfAborted();
				return [];
			}
			query.signal?.throwIfAborted();
			const requested = query.hostIds ? new Set(query.hostIds) : void 0;
			const pending = nodes.filter((node) => isSessionHost(node) && (!requested || requested.has(`node:${node.nodeId}`))).toSorted((left, right) => nodeLabel(left).localeCompare(nodeLabel(right)) || left.nodeId.localeCompare(right.nodeId)).slice(0, 32).map(async (node) => {
				const host = await listNode(node, query);
				query.signal?.throwIfAborted();
				query.onHost?.(host);
				return host;
			});
			let hosts;
			try {
				hosts = await Promise.all(pending);
			} finally {
				await Promise.allSettled(pending);
			}
			query.signal?.throwIfAborted();
			return hosts;
		},
		async read(request) {
			if (!request.hostId.startsWith("node:") || !request.hostId.slice(5)) throw new Error("Select a paired node host to read an OpenClaw session");
			const nodeId = request.hostId.slice(5);
			const node = (await api.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected && isSessionHost(candidate));
			if (!node) throw new Error("OpenClaw session node is unavailable. Reconnect it and refresh the catalog.");
			const page = parseSessionShareTranscriptPage(await invoke(nodeId, SESSION_SHARE_READ_COMMAND, {
				threadId: request.threadId,
				limit: sessionCatalogPaging.boundedLimit(request.limit),
				...request.cursor !== void 0 ? { cursor: request.cursor } : {}
			}), request.threadId);
			const linkParticipant = bindingFor(nodeId).linkGitHubIdentities ? createSessionCatalogGitHubLinker().linkParticipant : void 0;
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
		for (const policy of createSessionShareNodeInvokePolicies()) api.registerNodeInvokePolicy(policy);
	}
});
//#endregion
export { session_share_default as default };
