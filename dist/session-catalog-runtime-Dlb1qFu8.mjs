import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-BwS3HC5I.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./command-auth-native-Df-1rxxc.mjs";
import { c as listSessionCatalogEntries } from "./session-catalog-cKrf5Bg3.mjs";
import { d as CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS, t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-D6douw4O.mjs";
import { r as adoptedSourceKey, t as CLAUDE_LOCAL_SESSION_HOST_ID } from "./session-catalog-adoption-C3d_naEs.mjs";
//#region extensions/anthropic/session-catalog-runtime.ts
function currentClaudeSessionCatalogConfig(api) {
	return api.runtime.config?.current?.() ?? api.config ?? {};
}
function boundClaudeSource(pluginId, entry) {
	const anthropic = isRecord(entry.pluginExtensions) ? entry.pluginExtensions.anthropic : void 0;
	const marker = isRecord(anthropic) ? anthropic.sessionCatalog : void 0;
	const hostId = isRecord(marker) && typeof marker.sourceHostId === "string" ? marker.sourceHostId : entry.execHost === "node" && typeof entry.execNode === "string" && entry.execNode.trim() ? `node:${entry.execNode.trim()}` : CLAUDE_LOCAL_SESSION_HOST_ID;
	const adopted = entry.pluginOwnerId === pluginId;
	const binding = (isRecord(entry.cliSessionBindings) ? entry.cliSessionBindings : void 0)?.[CLAUDE_CLI_BACKEND_ID];
	if (isRecord(binding) && typeof binding.sessionId === "string" && binding.sessionId) return {
		adopted,
		hostId,
		threadId: binding.sessionId
	};
	if (!adopted || entry.modelSelectionLocked !== true) return;
	return isRecord(marker) && typeof marker.sourceThreadId === "string" ? {
		adopted,
		hostId,
		threadId: marker.sourceThreadId
	} : void 0;
}
const boundSessionsByApi = /* @__PURE__ */ new WeakMap();
function listBoundClaudeSessions(api, agentId, sessionEntries) {
	const config = currentClaudeSessionCatalogConfig(api);
	const revision = sessionEntries?.revision;
	let revisions = boundSessionsByApi.get(api);
	let configs = revision ? revisions?.get(revision) : void 0;
	let agents = configs?.get(config);
	const cached = agents?.get(agentId);
	if (cached) return cached;
	const bound = /* @__PURE__ */ new Map();
	for (const { sessionKey, entry } of listSessionCatalogEntries({
		agentId,
		config,
		runtime: api.runtime,
		sessionEntries
	})) {
		const source = boundClaudeSource(api.id, entry);
		if (!source) continue;
		const sourceKey = adoptedSourceKey(source.hostId, source.threadId);
		if (bound.get(sourceKey)?.adopted && !source.adopted) continue;
		bound.set(sourceKey, {
			adopted: source.adopted,
			sessionKey
		});
	}
	if (revision) {
		if (!revisions) {
			revisions = /* @__PURE__ */ new WeakMap();
			boundSessionsByApi.set(api, revisions);
		}
		if (!configs) {
			configs = /* @__PURE__ */ new WeakMap();
			revisions.set(revision, configs);
		}
		if (!agents) {
			agents = /* @__PURE__ */ new Map();
			configs.set(config, agents);
		}
		agents.set(agentId, bound);
	}
	return bound;
}
/**
* Resolve the Claude model an agent actually routes to the Claude CLI backend.
* Callers must not assume the current default is routed: existing configs pin
* older Claude models, and stamping the default onto their sessions would
* select a model the operator never routed or allowed.
*/
function resolveClaudeCliRoutedModelId(config, agentId) {
	return CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS.find((modelId) => resolveEffectiveAgentRuntime({
		cfg: config,
		provider: "anthropic",
		modelId,
		agentId
	}) === CLAUDE_CLI_BACKEND_ID);
}
//#endregion
export { listBoundClaudeSessions as n, resolveClaudeCliRoutedModelId as r, currentClaudeSessionCatalogConfig as t };
