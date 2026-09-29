import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { o as DirectoryCache } from "./target-resolver-BZNj5Sdk.mjs";
import { n as listCoreToolFactoryDescriptors, t as isCoreCodingSurfaceToolName } from "./core-tool-factory-descriptors-CGmz8OlS.mjs";
import { r as loadPairedComputerUseAvailabilityForSurface } from "./computer-tool-eUElmgWU.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import { n as readMcpLoopbackToolName, t as buildMcpToolSchema } from "./mcp-http.schema-BZBf_SU-.mjs";
import { t as loadNodeExecAvailability } from "./node-exec-availability-_9R234rk.mjs";
import { t as resolveGatewayScopedTools } from "./tool-resolution-DkcUmo8J.mjs";
//#region src/gateway/mcp-http.runtime.ts
const TOOL_CACHE_TTL_MS = 3e4;
const TOOL_CACHE_MAX_ENTRIES = 256;
const NATIVE_TOOL_EXCLUDE = new Set(listCoreToolFactoryDescriptors().map(({ name }) => name).filter(isCoreCodingSurfaceToolName));
function resolveMediatedNativeTools(toolsAllow, mode) {
	if (mode === "exact") return new Set((toolsAllow ?? []).map((name) => normalizeToolPolicyName(name)).filter((name) => NATIVE_TOOL_EXCLUDE.has(name)));
	if (toolsAllow === void 0 || toolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*")) return /* @__PURE__ */ new Set();
	return new Set(applyEmbeddedAttemptToolsAllow(Array.from(NATIVE_TOOL_EXCLUDE, (name) => ({ name })), toolsAllow).map((tool) => tool.name));
}
async function resolveNodeExecScope(params, mode) {
	if (!(!params.rootedExecution && params.context.nodeExecAllowed === true && resolveMediatedNativeTools(params.context.toolsAllow, mode).size === 0)) return params;
	return {
		...params,
		nodeExecAvailability: await loadNodeExecAvailability(params.signal)
	};
}
function isComputerAllowedByMcpScope(params, mode) {
	const { toolsAllow } = params.context;
	if (mode === "exact") return toolsAllow === void 0 || toolsAllow.some((name) => normalizeToolPolicyName(name) === "computer");
	return applyEmbeddedAttemptToolsAllow([{ name: "computer" }], toolsAllow).length === 1;
}
async function resolveNodeScope(input, mode) {
	return resolvePairedComputerNodeScope(await resolveNodeExecScope(input, mode), mode);
}
async function resolvePairedComputerNodeScope(params, mode) {
	if (!(isComputerAllowedByMcpScope(params, mode) && params.context.modelHasVision !== false && !params.rootedExecution)) return { params };
	const policyResolved = resolveMcpLoopbackTools(params, mode);
	const computerAllowed = policyResolved.tools.some((tool) => readMcpLoopbackToolName(tool) === "computer");
	const pairedComputerUseAvailability = await loadPairedComputerUseAvailabilityForSurface({
		computerAllowed,
		modelHasVision: params.context.modelHasVision,
		computerTransport: params.rootedExecution ? null : void 0,
		signal: params.signal
	});
	if (!pairedComputerUseAvailability) return {
		params,
		policyResolved
	};
	const resolvedParams = { params: {
		...params,
		pairedComputerUseAvailability
	} };
	return pairedComputerUseAvailability.prepared ? resolvedParams : {
		...resolvedParams,
		policyResolved
	};
}
function resolveMcpLoopbackTools(params, mode) {
	params.signal?.throwIfAborted();
	const { toolsAllow, webSearchDisabled, ...context } = params.context;
	const excludeToolNames = new Set(NATIVE_TOOL_EXCLUDE);
	if (webSearchDisabled) excludeToolNames.add("web_search");
	const mediatedNativeTools = params.rootedExecution ? new Set(NATIVE_TOOL_EXCLUDE) : resolveMediatedNativeTools(toolsAllow, mode);
	for (const toolName of mediatedNativeTools) excludeToolNames.delete(toolName);
	const includeNodeExecTool = context.nodeExecAllowed === true && mediatedNativeTools.size === 0;
	if (includeNodeExecTool) excludeToolNames.delete("exec");
	const skillWorkshop = context.skillWorkshop || params.skillLibraryAuthoring ? {
		...context.skillWorkshop,
		libraryAuthoring: params.skillLibraryAuthoring
	} : void 0;
	const scoped = resolveGatewayScopedTools({
		...context,
		rootedExecution: params.rootedExecution,
		messageActionTurnCapability: params.messageActionTurnCapability,
		cfg: params.cfg,
		authProfileStore: params.authProfileStore,
		onYield: params.onYield,
		skillWorkshop,
		nativeCronCreatorToolAllowlist: context.nativeCronCreatorToolAllowlist ?? void 0,
		agentDir: params.authProfileStoreAgentDir,
		conversationReadOrigin: "delegated",
		surface: "loopback",
		isGrantCurrent: params.isGrantCurrent,
		excludeToolNames,
		mediatedToolNames: mediatedNativeTools,
		includeNodeExecTool,
		nodeExecAvailable: params.nodeExecAvailability?.isAvailable,
		pairedNodeComputerUse: params.pairedComputerUseAvailability?.prepared
	});
	const tools = mode === "exact" ? applyGrantToolsAllow(scoped.tools, toolsAllow) : applyPolicyToolsAllow(scoped.tools, toolsAllow);
	const toolSchema = buildMcpToolSchema(tools);
	scoped.captureFinalCronCreatorTools?.(new Set(toolSchema.map((tool) => tool.name)));
	return {
		agentId: scoped.agentId,
		workspaceDir: scoped.workspaceDir,
		tools,
		toolSchema
	};
}
/** Resolves loopback-visible tools from the exact names carried by a minted grant. */
async function resolveMcpLoopbackScopedTools(params) {
	const resolved = await resolveNodeScope(params, "exact");
	return resolved.policyResolved ?? resolveMcpLoopbackTools(resolved.params, "exact");
}
/** Materializes runtime policy expressions against the concrete loopback catalog. */
async function resolveMcpLoopbackPolicyTools(params) {
	const resolved = await resolveNodeScope(params, "policy");
	return resolved.policyResolved ?? resolveMcpLoopbackTools(resolved.params, "policy");
}
/**
* Hard-enforces a per-run grant allowlist on the loopback surface. Both
* tools/list and tools/call consume this list, so a tool outside the
* allowlist can be neither discovered nor executed even when the CLI runs
* with a bypass permission mode. An empty allowlist fails closed.
*/
function applyGrantToolsAllow(tools, toolsAllow) {
	if (!toolsAllow) return tools;
	const allowed = new Set(toolsAllow.map((name) => normalizeToolPolicyName(name)).filter(Boolean));
	return tools.filter((tool) => {
		const name = readMcpLoopbackToolName(tool);
		return name !== void 0 && allowed.has(normalizeToolPolicyName(name));
	});
}
function applyPolicyToolsAllow(tools, toolsAllow) {
	if (!toolsAllow) return tools;
	const candidates = tools.flatMap((tool) => {
		const name = readMcpLoopbackToolName(tool);
		return name ? [{
			name,
			tool
		}] : [];
	});
	return applyEmbeddedAttemptToolsAllow(candidates, toolsAllow, { toolMeta: (candidate) => getPluginToolMeta(candidate.tool) }).map((candidate) => candidate.tool);
}
function buildMcpLoopbackToolCacheKey(params) {
	const { context } = params;
	return `${params.grantToken ?? ""}\u0000${stableStringify({
		context: {
			...context,
			clientCaps: [...new Set(context.clientCaps ?? [])].toSorted(),
			toolsAllow: context.toolsAllow ? [...new Set(context.toolsAllow)].toSorted() : void 0,
			modelHasVision: context.modelHasVision,
			pinnedWidgetAuthoring: context.pinnedWidgetAuthoring === true,
			currentInboundAudio: context.currentInboundAudio === true,
			sourceReplyOnly: context.sourceReplyOnly === true,
			requireExplicitMessageTarget: context.requireExplicitMessageTarget === true,
			nodeExecAllowed: context.nodeExecAllowed === true,
			delegationCapability: context.delegationCapability === "report_only" ? "report_only" : void 0
		},
		authProfileStoreAgentDir: params.authProfileStoreAgentDir,
		yieldContextCacheKey: params.yieldContextCacheKey,
		nodeExecAvailability: params.nodeExecAvailability?.cacheKey,
		pairedComputerUseAvailability: params.pairedComputerUseAvailability?.cacheKey
	})}`;
}
/** Short-lived cache for loopback tool lists keyed by session/channel context. */
var McpLoopbackToolCache = class {
	#entries = new DirectoryCache(TOOL_CACHE_TTL_MS, TOOL_CACHE_MAX_ENTRIES);
	#grantConfigScopes = /* @__PURE__ */ new Map();
	#epoch = 0;
	async resolve(input) {
		const epoch = this.#epoch;
		const nodeExecParams = await resolveNodeExecScope(input, "exact");
		input.signal?.throwIfAborted();
		const preDiscoveryCacheKey = buildMcpLoopbackToolCacheKey(nodeExecParams);
		const preDiscoveryCached = this.#entries.get(preDiscoveryCacheKey, nodeExecParams.cfg);
		if (preDiscoveryCached) return preDiscoveryCached;
		const resolved = await resolvePairedComputerNodeScope(nodeExecParams, "exact");
		input.signal?.throwIfAborted();
		const { params } = resolved;
		const cacheKey = buildMcpLoopbackToolCacheKey(params);
		const cached = this.#entries.get(cacheKey, params.cfg);
		if (cached) return cached;
		const nextEntry = resolved.policyResolved ?? resolveMcpLoopbackTools(params, "exact");
		if (epoch !== this.#epoch) return nextEntry;
		this.#entries.set(cacheKey, nextEntry, params.cfg);
		if (params.grantToken) {
			const scopes = this.#grantConfigScopes.get(params.grantToken) ?? /* @__PURE__ */ new Set();
			scopes.add(params.cfg);
			this.#grantConfigScopes.set(params.grantToken, scopes);
		}
		return nextEntry;
	}
	evictGrant(token) {
		this.#epoch += 1;
		const scopes = this.#grantConfigScopes.get(token);
		if (!scopes) return false;
		const cacheKeyPrefix = `${token}\u0000`;
		for (const cfg of scopes) this.#entries.clearMatching((cacheKey) => cacheKey.startsWith(cacheKeyPrefix), cfg);
		this.#grantConfigScopes.delete(token);
		return true;
	}
	clear() {
		this.#epoch += 1;
		this.#entries.clear();
		this.#grantConfigScopes.clear();
	}
};
//#endregion
export { resolveMcpLoopbackPolicyTools as n, resolveMcpLoopbackScopedTools as r, McpLoopbackToolCache as t };
