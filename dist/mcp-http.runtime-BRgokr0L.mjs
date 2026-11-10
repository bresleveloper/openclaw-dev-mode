import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { _ as resolveSessionAgentIds } from "./agent-scope-DXrnO3F4.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-B4OWlHAG.mjs";
import { d as toolPolicyRestrictsTools } from "./tool-policy-14GRhbFd.mjs";
import { m as readAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { I as prepareSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { a as DirectoryCache } from "./target-resolver-c-W9fpkt.mjs";
import { a as hasSessionControlAuthority } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { a as getInProcessGatewayToolContext } from "./in-process-gateway-DaAxH7mK.mjs";
import { r as loadPairedComputerUseAvailabilityForSurface } from "./computer-tool-DEQfJiDZ.mjs";
import { n as listCoreToolFactoryDescriptors, t as isCoreCodingSurfaceToolName } from "./core-tool-factory-descriptors-qKKUlMX_.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D12sns28.mjs";
import { n as readMcpLoopbackToolName, t as buildMcpToolSchema } from "./mcp-http.schema-DD_OLJv3.mjs";
import { t as loadNodeExecAvailability } from "./node-exec-availability-eRt4nwZc.mjs";
import { t as assertCompletionGrantLineage } from "./tool-resolution-completion-DtSI31A4.mjs";
import { t as resolveGatewayScopedTools } from "./tool-resolution-DM1PdUA8.mjs";
//#region src/gateway/mcp-http.runtime.ts
const TOOL_CACHE_TTL_MS = 3e4;
const TOOL_CACHE_MAX_ENTRIES = 256;
const NATIVE_TOOL_EXCLUDE = new Set(listCoreToolFactoryDescriptors().map(({ name }) => name).filter(isCoreCodingSurfaceToolName));
async function captureMcpLoopbackScope(params) {
	const canPreparePortal = params.context.senderIsOwner === false && Boolean(params.context.sessionKey.trim() && params.context.sessionId);
	const gateway = canPreparePortal ? getInProcessGatewayToolContext() : void 0;
	const projection = gateway ? getSessionRowProjection(gateway) : void 0;
	const prepared = await prepareSessionCapabilityRead(() => {
		params.signal?.throwIfAborted();
		assertCompletionGrantLineage(params);
		hasSessionControlAuthority(readAdmittedRunOperatorAuthority(params.admittedRunContext));
		if (params.isGrantCurrent?.() === false) throw new Error("MCP tool grant is no longer current");
		if (canPreparePortal && (getInProcessGatewayToolContext() !== gateway || getSessionRowProjection(gateway) !== projection)) throw new Error("MCP tool preparation belongs to a retired Gateway");
	});
	return {
		...params,
		projection,
		assertCurrent: prepared.read,
		[Symbol.dispose]: prepared.release
	};
}
function captureMcpCatalogSessionFacts(params) {
	if (!params.projection) return;
	const { sessionAgentId: agentId } = resolveSessionAgentIds({
		config: params.cfg,
		sessionKey: params.context.sessionKey,
		agentId: params.context.agentId
	});
	const row = params.projection.capture({
		agentId,
		key: params.context.sessionKey
	});
	return {
		projection: params.projection,
		generation: row?.generation,
		revision: row?.databaseFactsRevision
	};
}
function isMcpCatalogSessionCurrent(catalog, params) {
	const current = captureMcpCatalogSessionFacts(params);
	return catalog.sessionFacts?.projection === current?.projection && catalog.sessionFacts?.generation === current?.generation && catalog.sessionFacts?.revision === current?.revision;
}
function resolveMediatedNativeTools(toolsAllow, mode) {
	if (mode === "exact") return new Set((toolsAllow ?? []).map((name) => normalizeToolPolicyName(name)).filter((name) => NATIVE_TOOL_EXCLUDE.has(name)));
	if (toolsAllow === void 0) return /* @__PURE__ */ new Set();
	return new Set(applyEmbeddedAttemptToolsAllow(Array.from(NATIVE_TOOL_EXCLUDE, (name) => ({ name })), toolsAllow).map((tool) => tool.name));
}
async function resolveNodeExecScope(params, mode) {
	if (!(!params.context.trustedInternalHandoff && !toolPolicyRestrictsTools(pickSandboxToolPolicy(params.context.conversationToolPolicy)) && params.context.nodeExecAllowed === true && !params.defaultMediatedToolNames?.length && resolveMediatedNativeTools(params.context.toolsAllow, mode).size === 0)) return params;
	const nodeExecAvailability = await loadNodeExecAvailability(params.signal);
	params.assertCurrent();
	return {
		...params,
		nodeExecAvailability
	};
}
function isComputerAllowedByMcpScope(params, mode) {
	const { toolsAllow } = params.context;
	if (mode === "exact") return toolsAllow === void 0 || toolsAllow.some((name) => normalizeToolPolicyName(name) === "computer");
	return applyEmbeddedAttemptToolsAllow([{ name: "computer" }], toolsAllow).length === 1;
}
async function resolvePairedComputerNodeScope(params, mode) {
	params.assertCurrent();
	if (!(isComputerAllowedByMcpScope(params, mode) && params.context.modelHasVision !== false)) return { params };
	const policyResolved = await resolveMcpLoopbackTools(params, mode);
	params.assertCurrent();
	const computerAllowed = policyResolved.tools.some((tool) => readMcpLoopbackToolName(tool) === "computer");
	const pairedComputerUseAvailability = await loadPairedComputerUseAvailabilityForSurface({
		computerAllowed,
		modelHasVision: params.context.modelHasVision,
		signal: params.signal
	});
	params.assertCurrent();
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
async function resolveMcpLoopbackTools(params, mode, policyResolved) {
	return withReadyMcpSession(params, () => policyResolved && isMcpCatalogSessionCurrent(policyResolved, params) ? policyResolved : constructMcpLoopbackTools(params, mode));
}
async function withReadyMcpSession(params, consume) {
	params.assertCurrent();
	const { sessionKey, sessionId, senderIsOwner } = params.context;
	if (!params.projection || !sessionId || senderIsOwner !== false) return consume();
	const { sessionAgentId: agentId } = resolveSessionAgentIds({
		config: params.cfg,
		sessionKey,
		agentId: params.context.agentId
	});
	let receipt;
	do {
		receipt = await withReadySessionRows(params.projection, () => [{
			agentId,
			key: sessionKey
		}], () => {
			params.assertCurrent();
			return {
				sessionFacts: captureMcpCatalogSessionFacts(params),
				sharingRevision: params.projection?.sharingRevision
			};
		});
		params.assertCurrent();
	} while (receipt.sharingRevision === void 0 || receipt.sharingRevision !== params.projection.sharingRevision || !isMcpCatalogSessionCurrent(receipt, params));
	return consume();
}
async function constructMcpLoopbackTools(params, mode) {
	params.assertCurrent();
	const sessionFacts = captureMcpCatalogSessionFacts(params);
	const { toolsAllow, webSearchDisabled, ...context } = params.context;
	const excludeToolNames = new Set(NATIVE_TOOL_EXCLUDE);
	if (webSearchDisabled) excludeToolNames.add("web_search");
	const mediatedNativeTools = toolsAllow === void 0 && (context.trustedInternalHandoff || toolPolicyRestrictsTools(pickSandboxToolPolicy(context.conversationToolPolicy))) ? new Set(NATIVE_TOOL_EXCLUDE) : resolveMediatedNativeTools(toolsAllow, mode);
	for (const toolName of params.defaultMediatedToolNames ?? []) {
		const name = normalizeToolPolicyName(toolName);
		if (!NATIVE_TOOL_EXCLUDE.has(name)) throw new Error(`Unknown host-owned coding tool: ${toolName}`);
		mediatedNativeTools.add(name);
	}
	for (const toolName of mediatedNativeTools) excludeToolNames.delete(toolName);
	const includeNodeExecTool = context.nodeExecAllowed === true && mediatedNativeTools.size === 0;
	if (includeNodeExecTool) excludeToolNames.delete("exec");
	const skillWorkshop = params.skillLibraryAuthoring ? { libraryAuthoring: params.skillLibraryAuthoring } : void 0;
	const scopeOptions = {
		...context,
		messageActionTurnCapability: params.messageActionTurnCapability,
		cfg: params.cfg,
		authProfileStore: params.authProfileStore,
		onYield: params.onYield,
		skillWorkshop,
		bundledTools: params.bundledTools,
		nativeCronCreatorToolAllowlist: context.nativeCronCreatorToolAllowlist ?? void 0,
		agentDir: params.authProfileStoreAgentDir,
		conversationReadOrigin: "delegated",
		surface: "loopback",
		admittedRunContext: params.admittedRunContext,
		sessionEventSourcePolicy: params.sessionEventSourcePolicy,
		isGrantCurrent: params.isGrantCurrent,
		excludeToolNames,
		mediatedToolNames: mediatedNativeTools,
		includeNodeExecTool,
		nodeExecAvailable: params.nodeExecAvailability?.isAvailable,
		pairedNodeComputerUse: params.pairedComputerUseAvailability?.prepared
	};
	const scoped = await resolveGatewayScopedTools(scopeOptions, params.assertCurrent);
	params.assertCurrent();
	const tools = mode === "exact" ? applyGrantToolsAllow(scoped.tools, toolsAllow) : applyPolicyToolsAllow(scoped.tools, toolsAllow);
	const toolSchema = buildMcpToolSchema(tools);
	scoped.captureFinalCronCreatorTools?.(new Set(toolSchema.map((tool) => tool.name)));
	return {
		agentId: scoped.agentId,
		workspaceDir: scoped.workspaceDir,
		tools,
		toolSchema,
		sessionFacts
	};
}
async function resolveMcpLoopbackCatalog(params, mode) {
	try {
		var _usingCtx$1 = _usingCtx();
		const resolved = await resolvePairedComputerNodeScope(await resolveNodeExecScope(_usingCtx$1.u(await captureMcpLoopbackScope(params)), mode), mode);
		for (;;) {
			const tools = await resolveMcpLoopbackTools(resolved.params, mode, resolved.policyResolved);
			resolved.params.assertCurrent();
			if (isMcpCatalogSessionCurrent(tools, resolved.params)) return tools;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
/** Resolves loopback-visible tools from the exact names carried by a minted grant. */
function resolveMcpLoopbackScopedTools(params) {
	return resolveMcpLoopbackCatalog(params, "exact");
}
/** Materializes runtime policy expressions against the concrete loopback catalog. */
function resolveMcpLoopbackPolicyTools(params) {
	return resolveMcpLoopbackCatalog(params, "policy");
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
			pinnedWidgetAuthoring: context.pinnedWidgetAuthoring === true,
			currentInboundAudio: context.currentInboundAudio === true,
			sourceReplyOnly: context.sourceReplyOnly === true,
			requireExplicitMessageTarget: context.requireExplicitMessageTarget === true,
			nodeExecAllowed: context.nodeExecAllowed === true,
			delegationCapability: context.delegationCapability === "report_only" ? "report_only" : void 0
		},
		admittedRunInstance: params.admittedRunContext?.operationalRunInstance,
		defaultMediatedToolNames: params.defaultMediatedToolNames,
		sessionControlsAllowed: hasSessionControlAuthority(readAdmittedRunOperatorAuthority(params.admittedRunContext)),
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
		try {
			var _usingCtx3 = _usingCtx();
			const epoch = this.#epoch;
			const nodeExecParams = await resolveNodeExecScope(_usingCtx3.u(await captureMcpLoopbackScope(input)), "exact");
			for (;;) {
				nodeExecParams.assertCurrent();
				const preDiscoveryCacheKey = buildMcpLoopbackToolCacheKey(nodeExecParams);
				let preDiscoveryCached = this.#entries.get(preDiscoveryCacheKey, nodeExecParams.cfg);
				if (preDiscoveryCached) {
					preDiscoveryCached = await withReadyMcpSession(nodeExecParams, () => {
						const cached = this.#entries.get(preDiscoveryCacheKey, nodeExecParams.cfg);
						return cached && isMcpCatalogSessionCurrent(cached, nodeExecParams) ? cached : void 0;
					});
					nodeExecParams.assertCurrent();
					if (preDiscoveryCached && isMcpCatalogSessionCurrent(preDiscoveryCached, nodeExecParams)) return preDiscoveryCached;
				}
				const resolved = await resolvePairedComputerNodeScope(nodeExecParams, "exact");
				nodeExecParams.assertCurrent();
				const { params } = resolved;
				const cacheKey = buildMcpLoopbackToolCacheKey(params);
				const nextEntry = await withReadyMcpSession(params, async () => {
					const cached = this.#entries.get(cacheKey, params.cfg);
					if (cached && isMcpCatalogSessionCurrent(cached, params)) return cached;
					const next = resolved.policyResolved && isMcpCatalogSessionCurrent(resolved.policyResolved, params) ? resolved.policyResolved : await constructMcpLoopbackTools(params, "exact");
					params.assertCurrent();
					if (epoch === this.#epoch && isMcpCatalogSessionCurrent(next, params)) {
						this.#entries.set(cacheKey, next, params.cfg);
						if (params.grantToken) {
							const scopes = this.#grantConfigScopes.get(params.grantToken) ?? /* @__PURE__ */ new Set();
							scopes.add(params.cfg);
							this.#grantConfigScopes.set(params.grantToken, scopes);
						}
					}
					return next;
				});
				params.assertCurrent();
				if (isMcpCatalogSessionCurrent(nextEntry, params)) return nextEntry;
			}
		} catch (_) {
			_usingCtx3.e = _;
		} finally {
			_usingCtx3.d();
		}
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
