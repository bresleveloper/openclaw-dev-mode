import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as captureRuntimeStateEnvironment } from "./paths-orClZ-2Z.mjs";
import { L as iterateProjectedAgentRunSessionKeys, t as buildProjectedAgentRunIndex } from "./agent-run-registry-gmaPgO-n.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-BJKolYfz.mjs";
import { n as buildSubagentSessionListReadIndex } from "./subagent-registry-read-DY0g8fGW.mjs";
import { t as resolveCurrentSessionAgentRuntimeMetadata } from "./agent-runtime-metadata-B5dnCB4A.mjs";
import { o as selectModelCatalogRuntimeEntry } from "./model-catalog-view-UkLRAY5C.mjs";
import { n as resolveSessionModelIdentityRef } from "./session-model-ref-BTkDCi12.mjs";
import { c as createSessionRowModelCacheKey, o as resolveEstimatedSessionCostUsd } from "./session-utils-core-DYhQWF9T.mjs";
import { a as resolveWorkerPlacementModelRuntime } from "./placement-session-runtime-CaRixRbi.mjs";
//#region src/gateway/session-utils-projection.ts
function buildSessionListRowMetadataContext(params) {
	const subagentRuns = params.subagentRuns ?? buildSubagentSessionListReadIndex(params.now, params.sessionKeys);
	const projectedAgentRuns = params.projectedAgentRuns ?? buildProjectedAgentRunIndex();
	const catalogEntries = /* @__PURE__ */ new WeakMap();
	const runtimeEntries = /* @__PURE__ */ new WeakMap();
	return {
		subagentRuns,
		projectedAgentRuns,
		projectedSubagentActivity: params.projectedSubagentActivity ?? buildProjectedSubagentActivity(subagentRuns, projectedAgentRuns),
		subagentRunsByChildSessionKey: subagentRuns.runsByChildSessionKey,
		configuredDefaultModelByAgent: /* @__PURE__ */ new Map(),
		thinkingFactsByModelRef: /* @__PURE__ */ new Map(),
		findModelCatalogEntry: (catalog, query) => {
			let entries = catalogEntries.get(catalog);
			if (!entries) {
				entries = /* @__PURE__ */ new Map();
				catalogEntries.set(catalog, entries);
			}
			const key = createSessionRowModelCacheKey(query.provider, query.modelId);
			if (!entries.has(key)) entries.set(key, findModelCatalogEntry(catalog, query));
			return entries.get(key);
		},
		selectModelCatalogRuntimeEntry: (selection) => {
			let entries = runtimeEntries.get(selection.routeVariants);
			if (!entries) {
				entries = /* @__PURE__ */ new Map();
				runtimeEntries.set(selection.routeVariants, entries);
			}
			const key = `${selection.runtimeId}\0${selection.allowApiFallback !== false}\0${createSessionRowModelCacheKey(selection.entry.provider, selection.entry.id)}`;
			let selected = entries.get(key);
			if (!selected) {
				selected = selectModelCatalogRuntimeEntry(selection);
				entries.set(key, selected);
			}
			return selected;
		},
		displayModelIdentityByKey: /* @__PURE__ */ new Map(),
		modelCostConfigByModelRef: /* @__PURE__ */ new Map(),
		userProfileIdentityById: params.userProfileIdentityById ?? /* @__PURE__ */ new Map()
	};
}
/** Prepare follow-up ancestor membership with the indexes, outside per-row presentation. */
function buildProjectedSubagentActivity(subagentRuns, projectedAgentRuns) {
	const active = /* @__PURE__ */ new Set();
	for (const key of iterateProjectedAgentRunSessionKeys(projectedAgentRuns)) {
		const run = subagentRuns.latestRunsByChildSessionKey.get(key);
		if (!run) continue;
		let requester = run.requesterSessionKey;
		while (requester && !active.has(requester)) {
			active.add(requester);
			requester = subagentRuns.latestRunsByChildSessionKey.get(requester)?.requesterSessionKey ?? "";
		}
	}
	return active;
}
/** Child presentation needs live ownership and sharing facts, never the child's stored payload. */
function projectSessionRowChildLinks(links) {
	return links?.map(({ key, entry }) => ({
		key,
		parsedKey: parseAgentSessionKey(key),
		entry: {
			sessionId: entry.sessionId,
			updatedAt: entry.updatedAt,
			archivedAt: entry.archivedAt,
			status: entry.status,
			startedAt: entry.startedAt,
			endedAt: entry.endedAt,
			spawnedBy: entry.spawnedBy,
			parentSessionKey: entry.parentSessionKey,
			createdActor: entry.createdActor,
			visibility: entry.visibility,
			incognito: entry.incognito
		}
	}));
}
function resolveTranscriptUsageFallbacks(params) {
	const { entry, agentId } = params;
	const fallbacks = /* @__PURE__ */ new Map();
	const snapshot = params.transcriptUsage;
	for (const fallbackModelRef of new Set(params.fallbackModelRefs)) {
		fallbacks.set(fallbackModelRef, null);
		if (!entry?.sessionId || !snapshot) continue;
		const resolvedModel = resolveSessionModelIdentityRef(params.cfg, entry, agentId, fallbackModelRef, { allowPluginNormalization: params.allowPluginNormalization });
		if (params.freshTotalTokens !== void 0 && resolveEstimatedSessionCostUsd({
			cfg: params.cfg,
			provider: resolvedModel.provider,
			model: resolvedModel.model,
			entry,
			rowContext: params.rowContext
		}) !== void 0) continue;
		const estimatedCostUsd = resolveEstimatedSessionCostUsd({
			cfg: params.cfg,
			provider: snapshot.modelProvider ?? resolvedModel.provider,
			model: snapshot.model ?? resolvedModel.model,
			explicitCostUsd: snapshot.costUsd,
			entry: snapshot,
			rowContext: params.rowContext
		});
		fallbacks.set(fallbackModelRef, {
			usageReport: snapshot.usageReport,
			totalTokens: snapshot.usageReport?.state === "available" ? asNonNegativeFiniteNumber(snapshot.totalTokens) : asPositiveFiniteNumber(snapshot.totalTokens),
			totalTokensFresh: snapshot.totalTokensFresh === true,
			estimatedCostUsd
		});
	}
	return fallbacks;
}
/** Runtime ownership is independent of whether the model itself can change. */
function resolveGatewaySessionRuntimeSelectionLocked(entry, acpMeta) {
	return entry?.modelSelectionLocked === true || acpMeta != null;
}
function resolveGatewaySessionRuntimeProjection(params) {
	const { entry } = params;
	const acpMeta = params.preparedAcpMeta ?? void 0;
	const agentRuntime = resolveCurrentSessionAgentRuntimeMetadata({
		cfg: params.cfg,
		agentScope: {
			kind: "prepared",
			agentId: params.agentId
		},
		provider: params.provider,
		model: params.model,
		sessionKey: params.sessionKey,
		sessionEntry: params.entry,
		acpRuntime: acpMeta != null,
		acpBackend: acpMeta?.backend
	});
	if (agentRuntime.id === "auto" && entry) agentRuntime.id = resolveWorkerPlacementModelRuntime({
		...params,
		entry,
		preparedEnvironment: params.rowContext ? params.rowContext.workerPlacementEnvironment ??= captureRuntimeStateEnvironment() : void 0
	});
	return {
		acpMeta,
		agentRuntime,
		runtimeSelectionLocked: resolveGatewaySessionRuntimeSelectionLocked(entry, acpMeta)
	};
}
//#endregion
export { resolveGatewaySessionRuntimeSelectionLocked as a, resolveGatewaySessionRuntimeProjection as i, buildSessionListRowMetadataContext as n, resolveTranscriptUsageFallbacks as o, projectSessionRowChildLinks as r, buildProjectedSubagentActivity as t };
