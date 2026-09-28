import { A as parseCatalogPage, C as boundedCatalogString, D as filterCatalogPageByTitle, H as unwrapNodeInvokePayload, M as parseTranscriptPage, O as isInteractiveThreadSource, S as NODE_INVOKE_TIMEOUT_MS, h as CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND, m as CODEX_APP_SERVER_THREADS_LIST_COMMAND, v as CatalogParamsError, w as catalogError } from "./session-catalog-native-projection-DowriLid.mjs";
import { n as createCodexCliNodeConversationBindingData } from "./conversation-binding-data-CrcyZk6O.mjs";
import { i as withTimeout } from "./timeout-C910MdAB.mjs";
import { r as CODEX_CLI_SESSION_SOURCE_UPGRADE_MESSAGE, t as CODEX_CLI_SESSION_RESUME_COMMAND } from "./node-cli-sessions-r3avj02l.mjs";
import { o as lookupNodeCodexCatalogRecord } from "./session-catalog-Pno1xGcl.mjs";
import { t as codexLastTerminalTurnId } from "./session-upstream-marker-D15C9NHp.mjs";
import { createOrReuseNodeAdoptedSession, finalizeNodeAdoptedSession, findNodeAdoptedSessionEntry, nodeAdoptedSourceKey, nodeSessionMarker, runSessionActionExclusive } from "./session-catalog-node-adoption-ITddWx_X.mjs";
import { resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { createSessionCatalogAdoptionCoordinator, publishSessionCatalogHost, sessionCatalogAdoptedSourceKey } from "openclaw/plugin-sdk/session-catalog";
//#region extensions/codex/src/session-catalog-node-continue.ts
const CODEX_NODE_CONTINUE_COMMANDS = [
	CODEX_APP_SERVER_THREADS_LIST_COMMAND,
	CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND,
	CODEX_CLI_SESSION_RESUME_COMMAND
];
const NODE_CATALOG_LIST_RESPONSE_TIMEOUT_MS = 8e3;
const continueNodeAdoption = createSessionCatalogAdoptionCoordinator();
function nodeLabel(node) {
	return node.displayName?.trim() || node.remoteIp?.trim() || node.nodeId;
}
function compareNodeLabels(left, right) {
	const leftLabel = nodeLabel(left);
	const rightLabel = nodeLabel(right);
	if (leftLabel < rightLabel) return -1;
	if (leftLabel > rightLabel) return 1;
	return 0;
}
function canContinueCodexOnNode(node) {
	return node.connected === true && node.caps?.includes("codex-cli-session-source") === true && CODEX_NODE_CONTINUE_COMMANDS.every((command) => node.commands?.includes(command) === true && node.invocableCommands?.includes(command) === true);
}
async function listPairedNode(params) {
	const hostId = `node:${params.node.nodeId}`;
	const common = {
		hostId,
		label: nodeLabel(params.node),
		kind: "node",
		nodeId: params.node.nodeId,
		canContinueCodex: canContinueCodexOnNode(params.node),
		...params.terminalCapabilities
	};
	if (params.node.connected !== true) {
		const host = {
			...common,
			connected: false,
			sessions: [],
			error: {
				code: "NODE_OFFLINE",
				message: "Paired node is offline"
			}
		};
		params.onHost?.(host);
		return host;
	}
	if (!params.node.commands?.includes("codex.appServer.threads.list.v1")) {
		const host = {
			...common,
			connected: true,
			sessions: []
		};
		params.onHost?.(host);
		return host;
	}
	const eventualHost = Promise.resolve().then(async () => {
		const raw = await params.runtime.nodes.invoke({
			nodeId: params.node.nodeId,
			command: CODEX_APP_SERVER_THREADS_LIST_COMMAND,
			params: {
				agentId: params.agentId,
				cursor: params.query.cursors?.[hostId],
				limit: params.query.limitPerHost,
				searchTerm: params.query.search
			},
			timeoutMs: NODE_INVOKE_TIMEOUT_MS,
			scopes: ["operator.write"],
			signal: params.signal
		});
		const page = filterCatalogPageByTitle(parseCatalogPage(unwrapNodeInvokePayload(raw)), params.query.search);
		return {
			...common,
			connected: true,
			...page,
			canContinueCodex: common.canContinueCodex && page.canContinueCodex === true && Boolean(page.sourceHomeId),
			sessions: page.sessions.map((session) => Object.assign({}, session, page.sourceHomeId ? { sourceHomeId: page.sourceHomeId } : {}))
		};
	}).catch((error) => ({
		...common,
		connected: true,
		sessions: [],
		error: catalogError("NODE_INVOKE_FAILED", error)
	}));
	publishSessionCatalogHost(params, eventualHost);
	try {
		return await withTimeout(eventualHost, NODE_CATALOG_LIST_RESPONSE_TIMEOUT_MS, "paired node Codex session catalog timed out");
	} catch (error) {
		return {
			...common,
			connected: true,
			sessions: [],
			error: catalogError("NODE_INVOKE_FAILED", error)
		};
	}
}
async function requireNodeForCodexContinue(params) {
	const nodeId = params.hostId.slice(5).trim();
	if (!nodeId || params.hostId !== `node:${nodeId}`) throw new CatalogParamsError("Codex session catalog hostId is invalid");
	const node = (await params.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId);
	if (!node || !canContinueCodexOnNode(node)) {
		if (node?.connected && !node.caps?.includes("codex-cli-session-source")) throw new CatalogParamsError(CODEX_CLI_SESSION_SOURCE_UPGRADE_MESSAGE);
		throw new CatalogParamsError("paired node does not permit Codex session continuation");
	}
	return {
		node,
		nodeId
	};
}
function requireContinuableNodeRecord(record) {
	if (record.archived) throw new CatalogParamsError("Codex session is archived on the paired node");
	if (!isInteractiveThreadSource(record.source)) throw new CatalogParamsError("Codex session is not a non-archived interactive Codex session");
	if (record.status === "idle" || record.status === "notLoaded") return;
	if (record.status === "active") throw new CatalogParamsError("Codex session is active on the paired node; wait for it to finish before continuing");
	throw new CatalogParamsError("Codex session cannot be continued in its current state");
}
async function readNodeCodexHistory(params) {
	const raw = await params.runtime.nodes.invoke({
		nodeId: params.nodeId,
		command: CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND,
		params: {
			agentId: params.agentId,
			sourceHomeId: params.sourceHomeId,
			threadId: params.record.threadId,
			limit: 50
		},
		timeoutMs: NODE_INVOKE_TIMEOUT_MS,
		scopes: ["operator.write"]
	});
	const page = parseTranscriptPage(unwrapNodeInvokePayload(raw));
	const thread = {
		id: params.record.threadId,
		createdAt: params.record.createdAt ?? 0,
		modelProvider: params.record.modelProvider ?? "openai",
		projectId: null,
		turns: page.data.toReversed()
	};
	return {
		thread,
		throughTurnId: codexLastTerminalTurnId(thread, (value) => boundedCatalogString(value, 256)) ?? null
	};
}
async function continueNodeCodexSessionInner(params) {
	const { nodeId } = await requireNodeForCodexContinue({
		runtime: params.api.runtime,
		hostId: params.hostId
	});
	const lookup = await lookupNodeCodexCatalogRecord({
		agentId: params.agentId,
		runtime: params.api.runtime,
		nodeId,
		threadId: params.threadId,
		sourceHomeId: params.sourceHomeId
	});
	if (lookup.kind !== "found") throw new CatalogParamsError(lookup.kind === "cursor-cycle" ? "Codex session eligibility could not be verified" : "Codex session is unavailable on the paired node");
	if (lookup.canContinueCodex !== true || !lookup.sourceHomeId) throw new CatalogParamsError("Codex session source does not support Chat continuation; use a local stdio source or update the node.");
	const sourceHomeId = lookup.sourceHomeId;
	const record = lookup.record;
	requireContinuableNodeRecord(record);
	const existing = findNodeAdoptedSessionEntry({
		agentId: params.agentId,
		config: params.config,
		runtime: params.api.runtime,
		hostId: params.hostId,
		threadId: params.threadId,
		sourceHomeId,
		includeInitializing: true
	});
	let adopted;
	let disposition;
	if (existing) {
		adopted = existing;
		disposition = "existing";
	} else {
		const history = await readNodeCodexHistory({
			agentId: params.agentId,
			runtime: params.api.runtime,
			nodeId,
			sourceHomeId,
			record
		});
		adopted = await createOrReuseNodeAdoptedSession({
			agentId: params.agentId,
			api: params.api,
			config: params.config,
			hostId: params.hostId,
			nodeId,
			sourceHomeId,
			record,
			history
		});
		disposition = "forked";
	}
	const marker = nodeSessionMarker({
		hostId: params.hostId,
		threadId: params.threadId,
		sourceHomeId,
		nodeId
	});
	return {
		sessionKey: adopted.key,
		disposition,
		conversationBinding: {
			summary: "Continue this Codex session on its paired node.",
			detachHint: "Start a new chat to leave the paired-node Codex session.",
			data: createCodexCliNodeConversationBindingData({
				nodeId,
				sessionId: params.threadId,
				agentId: adopted.agentId,
				cwd: record.cwd
			})
		},
		afterConversationBound: async () => await finalizeNodeAdoptedSession({
			api: params.api,
			adopted,
			marker
		})
	};
}
async function continueNodeCodexSession(params) {
	if (params.clientScopes?.includes("operator.admin") !== true) throw new CatalogParamsError("continuing a paired-node Codex session requires operator.admin");
	const nodeId = params.hostId.slice(5).trim();
	if (!nodeId || params.hostId !== `node:${nodeId}`) throw new CatalogParamsError("Codex session catalog hostId is invalid");
	const agentId = resolveSessionAgentIdsStrict({
		config: params.config,
		agentId: params.agentId
	}).sessionAgentId;
	const sourceKey = sessionCatalogAdoptedSourceKey(`node:${nodeId}`, params.threadId);
	const operationKey = sessionCatalogAdoptedSourceKey(agentId, params.sourceHomeId ? nodeAdoptedSourceKey(`node:${nodeId}`, params.threadId, params.sourceHomeId) : sourceKey);
	return await continueNodeAdoption({
		sourceKey: operationKey,
		findExisting: () => void 0,
		create: () => runSessionActionExclusive(sourceKey, async () => continueNodeCodexSessionInner({
			...params,
			agentId
		})),
		complete: async (continued) => continued
	});
}
//#endregion
export { compareNodeLabels, continueNodeCodexSession, listPairedNode, nodeLabel };
