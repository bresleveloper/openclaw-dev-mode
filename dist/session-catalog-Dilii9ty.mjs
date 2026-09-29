import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { b as resolveSessionAgentIdsStrict } from "./agent-scope-CTuYDtny.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import "./session-catalog-BvzVZkO1.mjs";
import { n as sessionCatalogPaging } from "./session-catalog-paging-Bvcta34E.mjs";
import { t as resolveClaudeCatalogHomeDir } from "./session-catalog-home-DC4c4SgQ.mjs";
import { o as ClaudeCatalogParamsError } from "./session-catalog-shared-CiyzxK6Y.mjs";
import { a as configuredClaudeConfigDir, s as gatewayClaudeScanOptions } from "./session-catalog-scan-CiBc8XV5.mjs";
import { r as adoptedSourceKey, t as CLAUDE_LOCAL_SESSION_HOST_ID } from "./session-catalog-adoption-C3d_naEs.mjs";
import { t as collectTranscriptText } from "./session-catalog-transcript-BzQ7HJEL.mjs";
import { t as listClaudeSessions } from "./session-catalog-discovery-BVK4Wrh7.mjs";
import { t as isExactClaudeSessionCursor } from "./session-catalog-cursor-NPLrVaSJ.mjs";
import { d as readTranscriptParams } from "./session-catalog-parsing-7DJUkz4W.mjs";
import { a as terminalEligibility, i as startClaudeCatalogTerminal, n as isClaudeCliAvailable, r as openClaudeCatalogTerminal } from "./session-catalog-terminal-ClcbZn9O.mjs";
import { a as readClaudeSessionTranscript, n as listClaudeSessionCatalog, s as resolveNodeClaudeRecord, t as assertClaudeLocalAccess } from "./session-catalog-listing-B1rK2PN6.mjs";
import { n as listBoundClaudeSessions } from "./session-catalog-runtime-DIZSvEvj.mjs";
import { t as checkClaudeUpstreamActivity } from "./session-upstream-activity-6OVKSlZw.mjs";
import { t as continueClaudeSession } from "./session-catalog-continue-BLNOGjFo.mjs";
//#region extensions/anthropic/session-catalog.ts
const CLAUDE_TRANSCRIPT_TYPES = /* @__PURE__ */ new Map([
	["userMessage", "userMessage"],
	["agentMessage", "agentMessage"],
	["reasoning", "reasoning"],
	["toolCall", "toolCall"],
	["toolResult", "toolResult"]
]);
const CLAUDE_BLOCK_TYPES = /* @__PURE__ */ new Map([
	["thinking", "reasoning"],
	["tool_use", "toolCall"],
	["tool_result", "toolResult"]
]);
function toGenericClaudeItems(item) {
	const common = {
		...item.timestamp ? { timestamp: item.timestamp } : {},
		...item.model ? { model: item.model } : {},
		...item.truncated ? { truncated: true } : {}
	};
	if (!Array.isArray(item.content)) return [{
		...common,
		...item.uuid ? { id: item.uuid } : {},
		type: item.truncated ? "other" : CLAUDE_TRANSCRIPT_TYPES.get(item.type) ?? "other",
		...item.text ? { text: item.text } : {}
	}];
	return item.content.flatMap((block, index) => {
		if (!isRecord(block)) return [];
		const messageType = item.type === "userMessage" ? "userMessage" : "agentMessage";
		const type = block.type === "text" ? messageType : CLAUDE_BLOCK_TYPES.get(block.type) ?? "other";
		const fragments = [];
		if (block.type === "tool_use") {
			fragments.push(typeof block.name === "string" ? block.name : "tool");
			if (block.input !== void 0) fragments.push(JSON.stringify(block.input));
		} else {
			const content = block.type === "text" ? typeof block.text === "string" ? block.text : "" : block;
			collectTranscriptText(content, fragments);
		}
		const text = fragments.join("\n\n");
		return [{
			...common,
			...item.uuid ? { id: `${item.uuid}:${index}` } : {},
			type,
			...text ? { text } : {}
		}];
	}).toReversed();
}
function toGenericClaudeHost(host, bound, cliAvailable) {
	return {
		hostId: host.hostId,
		label: host.label,
		kind: host.kind,
		connected: host.connected,
		canStartTerminal: host.kind === "gateway" ? cliAvailable : host.canStartTerminal === true,
		...host.nodeId ? { nodeId: host.nodeId } : {},
		sessions: host.sessions.flatMap((session) => {
			const boundSession = bound.get(adoptedSourceKey(host.hostId, session.threadId));
			if (boundSession && !boundSession.adopted) return [];
			const terminal = terminalEligibility(host, session.source, cliAvailable);
			const nodeCli = host.kind === "node" && host.canContinueClaude === true && session.source === "claude-cli";
			const existingSessionKey = boundSession?.sessionKey;
			const continuable = terminal.localResumable || nodeCli || Boolean(existingSessionKey);
			return [{
				threadId: session.threadId,
				...session.name ? { name: session.name } : {},
				...session.color ? { color: session.color } : {},
				...session.cwd ? { cwd: session.cwd } : {},
				status: session.status,
				...session.createdAt !== void 0 ? { createdAt: session.createdAt } : {},
				...session.updatedAt !== void 0 ? { updatedAt: session.updatedAt } : {},
				...session.recencyAt != null ? { recencyAt: session.recencyAt } : {},
				source: session.source,
				modelProvider: session.modelProvider,
				...session.cliVersion ? { cliVersion: session.cliVersion } : {},
				...session.gitBranch ? { gitBranch: session.gitBranch } : {},
				...session.customGroup ? { customGroup: session.customGroup } : {},
				...session.pullRequest ? { pullRequest: session.pullRequest } : {},
				archived: session.archived,
				...continuable && existingSessionKey ? { sessionKey: existingSessionKey } : {},
				canContinue: continuable,
				canArchive: false,
				canOpenTerminal: terminal.canOpenTerminal
			}];
		}),
		...host.nextCursor ? { nextCursor: host.nextCursor } : {},
		...host.error ? { error: host.error } : {}
	};
}
function createClaudeSessionCatalogRuntime(api) {
	return {
		list: async (query) => {
			const bound = listBoundClaudeSessions(api, query.agentId, query.sessionEntries);
			const localCliAvailable = isClaudeCliAvailable();
			const { allowProcessHomeFallback, allowPartialResults: _allowPartialResults, agentId: _agentId, listNodes, onHost, waitUntil, signal, sessionEntries: _sessionEntries, ...gatewayQuery } = query;
			const mapHost = (host) => toGenericClaudeHost(host, bound, localCliAvailable);
			return (await listClaudeSessionCatalog({
				runtime: api.runtime,
				query: gatewayQuery,
				allowProcessHomeFallback,
				listNodes,
				waitUntil,
				signal,
				...onHost ? { onHost: (host) => onHost(mapHost(host)) } : {}
			})).hosts.map(mapHost);
		},
		read: async (request) => {
			const { threadId, limit, cursor } = readTranscriptParams({
				threadId: request.threadId,
				limit: request.limit,
				cursor: request.cursor
			});
			const blockCursor = /^block:(\d+):(.+)$/u.exec(cursor ?? "");
			const skip = Number(blockCursor?.[1] ?? 0);
			if (!Number.isSafeInteger(skip) || cursor?.startsWith("block:") && !blockCursor) throw new ClaudeCatalogParamsError("transcript cursor is invalid");
			const page = await readClaudeSessionTranscript({
				runtime: api.runtime,
				hostId: request.hostId,
				threadId,
				cursor: blockCursor?.[2] ?? cursor,
				limit,
				allowProcessHomeFallback: request.allowProcessHomeFallback
			});
			if (skip && !page.items.length) throw new ClaudeCatalogParamsError("transcript cursor is invalid");
			const projected = page.items.flatMap((row, index) => {
				const blocks = toGenericClaudeItems(row);
				const offset = index === 0 ? skip : 0;
				if (offset && offset >= blocks.length) throw new ClaudeCatalogParamsError("transcript cursor is invalid");
				return blocks.slice(offset).map((item, block) => ({
					item,
					row,
					skip: offset + block
				}));
			});
			const { items } = sessionCatalogPaging.boundTranscriptPage(projected.map(({ item }) => item).toReversed(), limit, 0);
			for (const [index, item] of items.entries()) if (item.text !== projected[index]?.item.text && projected[index]?.item.text) item.truncated = true;
			const resume = projected[items.length];
			if (resume && !isExactClaudeSessionCursor(resume.row.resumeCursor)) throw new Error("Update the Claude session node to page mixed transcript blocks");
			const nextCursor = resume ? `block:${resume.skip}:${resume.row.resumeCursor}` : page.nextCursor;
			return {
				...page,
				items,
				nextCursor
			};
		},
		continueSession: async (request) => {
			assertClaudeLocalAccess(request.hostId, request.allowProcessHomeFallback);
			const agentId = resolveSessionAgentIdsStrict({
				config: api.config,
				agentId: request.agentId
			}).sessionAgentId;
			return await continueClaudeSession(api, agentId, request.hostId, request.threadId, request.allowProcessHomeFallback);
		},
		startTerminalSession: async (request) => {
			if (!request.nodeId) {
				if (request.hostId && request.hostId !== "gateway:local") throw new ClaudeCatalogParamsError("Claude terminal host is unavailable; select a listed host");
				assertClaudeLocalAccess(CLAUDE_LOCAL_SESSION_HOST_ID, request.allowProcessHomeFallback);
			}
			return await startClaudeCatalogTerminal(request);
		},
		openTerminal: async (request) => {
			assertClaudeLocalAccess(request.hostId, request.allowProcessHomeFallback);
			return await openClaudeCatalogTerminal({
				api,
				...request,
				listClaudeSessions: () => listClaudeSessions(resolveClaudeCatalogHomeDir(), gatewayClaudeScanOptions(request.allowProcessHomeFallback)),
				resolveNodeClaudeRecord
			});
		},
		checkUpstreamActivity: async (probes, policy) => {
			const localAllowed = policy?.allowProcessHomeFallback !== false || configuredClaudeConfigDir() !== void 0;
			const eligible = probes.filter((probe) => probe.hostId !== "gateway:local" || localAllowed);
			return await checkClaudeUpstreamActivity(eligible, async (probe) => {
				return (await readClaudeSessionTranscript({
					runtime: api.runtime,
					hostId: probe.hostId,
					threadId: probe.threadId,
					limit: 50,
					allowProcessHomeFallback: policy?.allowProcessHomeFallback
				})).items;
			});
		}
	};
}
//#endregion
export { createClaudeSessionCatalogRuntime as t };
