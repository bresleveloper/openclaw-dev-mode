import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-BPNHa36e.mjs";
import { r as resolveAgentConfig, w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as resolveRuntimeServiceVersion } from "./version-BkM1aB4w.mjs";
import { h as readOpenClawStateWalHealth } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { C as toPublicPluginVerificationDiagnostic, b as listActiveDegradedPlugins } from "./discovery-D_5mAUI7.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { O as hasUserPinnedModelSelection, T as hasSessionActiveAutoModelFallback } from "./agent-scope-CTuYDtny.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { h as redactSecretDegradationReason, p as listActiveDegradedSecretOwners } from "./runtime-degraded-state-DVMYGogL.mjs";
import { o as resolveSystemEventQueueKey } from "./system-event-ownership-CHVGbaAW.mjs";
import { t as resolveCanonicalMainSessionKey } from "./main-session-key-BE52ybIt.mjs";
import { u as peekSystemEvents } from "./system-events-ANKIkU0W.mjs";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-DZSSnYMd.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { l as resolveSessionTotalTokens, o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { n as resolveProjectedSessionContextTokens } from "./context-token-provenance-CO52ZGCb.mjs";
import { n as getSecretEgressCertificateStatus } from "./registry-DGG6-ieI.mjs";
import { t as listGatewayAgentsBasic } from "./agent-list-BEVnf1d5.mjs";
import { t as sortAndLimitBy } from "./sort-and-limit-NdojqZsZ.mjs";
import { i as resolveHeartbeatSummariesForAgents } from "./heartbeat-summary-projection-Crxlqz_G.mjs";
import { t as hasResolvableHeartbeatOwnerRoute } from "./targets-xfpX_XXd.mjs";
import { i as getGatewayInstallationReplacement } from "./stale-install-BTpQ40eq.mjs";
import { t as readStartupRecoveryWarning } from "./main-session-restart-recovery-diagnostics-B9UBxyC6.mjs";
import { o as readStartupMigrationWarning } from "./state-migrations.messages-B6_AgnV2.mjs";
import { n as resolveHeartbeatSessionKey } from "./heartbeat-runner-session-uGOk3OpX.mjs";
import { t as resolveMemoryPluginStatus } from "./memory-plugin-bRtlqyTC.mjs";
import { n as readStatusSessionStores } from "./session-stores-DzjixMJW.mjs";
//#region src/status/cli-projection.ts
/** Projects CLI facts from the status owner's existing config and agent roster. */
function buildStatusCliProjection(cfg, agentList) {
	return {
		agents: {
			defaultId: agentList.selectionRequired ? null : agentList.defaultId,
			ownership: agentList.ownership,
			selectionRequired: agentList.selectionRequired,
			rows: agentList.agents.map(({ id, name }) => ({
				id,
				...name ? { name } : {}
			}))
		},
		updateChannel: cfg.update?.channel ?? null,
		memoryPlugin: resolveMemoryPluginStatus(cfg)
	};
}
//#endregion
//#region src/status/summary.ts
const channelSummaryModuleLoader = createLazyImportLoader(() => import("./channel-summary-DLGIL4pg.mjs"));
const channelPluginIdsModuleLoader = createLazyImportLoader(() => import("./channel-plugin-ids-DFbOnITm.mjs"));
const linkChannelModuleLoader = createLazyImportLoader(() => import("./link-channel-D-nlklqD.mjs"));
const taskRegistryMaintenanceModuleLoader = createLazyImportLoader(() => import("./task-registry.maintenance-DpeVtl6M.mjs"));
const staticModelCatalogResolverLoader = createLazyImportLoader(async () => {
	const modelCatalog = await import("./model.static-catalog-CbkRK9Jt.mjs");
	return {
		resolveManifestModel: modelCatalog.createBundledStaticCatalogModelResolver({ includeRuntimeDiscovery: true }),
		createProviderContextResolver: modelCatalog.createBundledProviderStaticCatalogContextResolver
	};
});
const loadStatusSummaryRuntimeModule = createLazyRuntimeSurface(() => import("./commands/status.summary.runtime.js"), ({ statusSummaryRuntime }) => statusSummaryRuntime);
const buildFlags = (entry) => {
	if (!entry) return [];
	const flags = [];
	const think = entry?.thinkingLevel;
	if (typeof think === "string" && think.length > 0) flags.push(`think:${think}`);
	const verbose = entry?.verboseLevel;
	if (typeof verbose === "string" && verbose.length > 0) flags.push(`verbose:${verbose}`);
	if (entry?.fastMode === "auto") flags.push("fast:auto");
	else if (typeof entry?.fastMode === "boolean") flags.push(entry.fastMode ? "fast" : "fast:off");
	const reasoning = entry?.reasoningLevel;
	if (typeof reasoning === "string" && reasoning.length > 0) flags.push(`reasoning:${reasoning}`);
	const elevated = entry?.elevatedLevel;
	if (typeof elevated === "string" && elevated.length > 0) flags.push(`elevated:${elevated}`);
	if (entry?.systemSent) flags.push("system");
	if (entry?.abortedLastRun) flags.push("aborted");
	const sessionId = entry?.sessionId;
	if (typeof sessionId === "string" && sessionId.length > 0) flags.push(`id:${sessionId}`);
	return flags;
};
function compareSessionCandidatesByUpdatedAt(left, right) {
	return (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0);
}
async function prepareSessionStatusDetails(cfg, now) {
	const { classifySessionKey, resolveConfiguredStatusModelRef, resolveAuthoredModelContextTokens, resolveContextTokensForModel, resolveSessionRuntime, resolveSessionModelRef, resolveStatusModelComparisonLabel, resolveStatusModelLookupRef, waitForContextWindowCacheLoad } = await loadStatusSummaryRuntimeModule();
	await waitForContextWindowCacheLoad();
	const { resolveManifestModel, createProviderContextResolver } = await staticModelCatalogResolverLoader.load();
	const resolveProviderContext = createProviderContextResolver({ cfg });
	const modelContextCache = /* @__PURE__ */ new Map();
	const resolveStaticModelContext = async (provider, model) => {
		if (!provider || !model) return {};
		const key = `${provider}\0${model}`;
		const cached = modelContextCache.get(key);
		if (cached) return cached;
		const resolved = (async () => {
			try {
				const entry = resolveManifestModel({
					provider,
					modelId: model
				}) ?? await resolveProviderContext({
					provider,
					modelId: model
				});
				return {
					...entry?.contextWindow ? { modelContextWindow: entry.contextWindow } : {},
					...entry?.contextTokens ? { modelContextTokens: entry.contextTokens } : {}
				};
			} catch {
				return {};
			}
		})();
		modelContextCache.set(key, resolved);
		return resolved;
	};
	const resolved = resolveConfiguredStatusModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const configModel = resolved.model ?? "gpt-6-astra";
	const configModelContext = await resolveStaticModelContext(resolved.provider ?? "openai", configModel);
	const configContextTokens = resolveContextTokensForModel({
		cfg,
		provider: resolved.provider ?? "openai",
		model: configModel,
		...configModelContext,
		fallbackContextTokens: 2e5,
		allowAsyncLoad: false
	}) ?? 2e5;
	const sessionRows = /* @__PURE__ */ new Map();
	const buildSessionRows = async (candidates) => Promise.all(candidates.map(async (candidate) => {
		const cached = sessionRows.get(candidate);
		if (cached) return {
			...cached,
			flags: [...cached.flags]
		};
		const { sessionKey: key, entry } = candidate;
		const agentId = parseAgentSessionKey(key)?.agentId;
		const updatedAt = entry.updatedAt ?? null;
		const age = updatedAt ? now - updatedAt : null;
		const configuredForSession = resolveConfiguredStatusModelRef({
			cfg,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel: DEFAULT_MODEL,
			agentId
		});
		const configuredSessionModel = configuredForSession.model ?? "gpt-6-astra";
		const configuredSessionModelLabel = `${configuredForSession.provider ?? "openai"}/${configuredSessionModel}`;
		const resolvedModel = resolveSessionModelRef(configuredForSession, entry);
		const model = resolvedModel.model ?? configuredSessionModel ?? null;
		const lookupModel = resolveStatusModelLookupRef({
			provider: resolvedModel.provider,
			model,
			defaultProvider: configuredForSession.provider ?? "openai"
		}) ?? resolvedModel;
		const lookupModelId = lookupModel.model ?? model;
		const modelContext = await resolveStaticModelContext(lookupModel.provider, lookupModelId ?? void 0);
		const selectedModelLabel = resolvedModel.provider && model ? `${resolvedModel.provider}/${model}` : model;
		const configuredSessionModelComparisonLabel = resolveStatusModelComparisonLabel({
			provider: configuredForSession.provider ?? "openai",
			model: configuredSessionModel,
			defaultProvider: DEFAULT_PROVIDER
		});
		const selectedModelComparisonLabel = resolveStatusModelComparisonLabel({
			provider: resolvedModel.provider,
			model,
			defaultProvider: configuredForSession.provider ?? "openai"
		});
		const runtimeMatchesConfiguredModel = selectedModelComparisonLabel != null && configuredSessionModelComparisonLabel != null && areRuntimeModelRefsEquivalent(selectedModelComparisonLabel, configuredSessionModelComparisonLabel, { config: cfg });
		const contextModelProvider = runtimeMatchesConfiguredModel ? configuredForSession.provider : lookupModel.provider;
		const modelSelectionDiffers = selectedModelComparisonLabel != null && configuredSessionModelComparisonLabel != null && selectedModelComparisonLabel !== configuredSessionModelComparisonLabel && !runtimeMatchesConfiguredModel && (hasUserPinnedModelSelection(entry) || hasSessionActiveAutoModelFallback(entry));
		const resolvedContextTokens = resolveContextTokensForModel({
			cfg,
			provider: lookupModel.provider,
			model: lookupModelId,
			...modelContext,
			fallbackContextTokens: configContextTokens ?? void 0,
			allowAsyncLoad: false
		});
		const runtime = resolveSessionRuntime({
			cfg,
			entry,
			provider: lookupModel.provider,
			model: lookupModelId ?? "",
			agentId,
			sessionKey: key
		});
		const contextTokens = resolveProjectedSessionContextTokens({
			entry,
			provider: lookupModel.provider,
			model: lookupModelId,
			agentHarnessId: runtime.id,
			resolvedContextTokens,
			authoredContextTokens: resolveAuthoredModelContextTokens({
				cfg,
				provider: lookupModel.provider,
				modelProvider: contextModelProvider,
				model: lookupModelId
			})
		}) ?? null;
		const total = resolveSessionTotalTokens(entry);
		const freshTotal = resolveFreshSessionTotalTokens(entry);
		const totalTokensFresh = freshTotal !== void 0;
		const remaining = contextTokens != null && freshTotal !== void 0 ? Math.max(0, contextTokens - freshTotal) : null;
		const pct = contextTokens && contextTokens > 0 && freshTotal !== void 0 ? Math.min(999, Math.round(freshTotal / contextTokens * 100)) : null;
		const row = {
			agentId,
			key,
			kind: classifySessionKey(key, entry),
			sessionId: entry?.sessionId,
			updatedAt,
			age,
			thinkingLevel: entry?.thinkingLevel,
			fastMode: entry?.fastMode,
			verboseLevel: entry?.verboseLevel,
			traceLevel: entry?.traceLevel,
			reasoningLevel: entry?.reasoningLevel,
			elevatedLevel: entry?.elevatedLevel,
			systemSent: entry?.systemSent,
			abortedLastRun: entry?.abortedLastRun,
			inputTokens: entry?.inputTokens,
			outputTokens: entry?.outputTokens,
			cacheRead: entry?.cacheRead,
			cacheWrite: entry?.cacheWrite,
			totalTokens: total ?? null,
			totalTokensFresh,
			remainingTokens: remaining,
			percentUsed: pct,
			model,
			configuredModel: configuredSessionModelLabel,
			selectedModel: selectedModelLabel,
			modelSelectionReason: modelSelectionDiffers ? hasUserPinnedModelSelection(entry) ? "session override" : "fallback selected" : null,
			runtime: runtime.label,
			contextTokens,
			flags: buildFlags(entry)
		};
		sessionRows.set(candidate, row);
		return row;
	}));
	return {
		defaults: {
			model: configModel,
			contextTokens: configContextTokens
		},
		buildSessionRows
	};
}
/** Builds the aggregate status summary for agents, sessions, tasks, heartbeat, and channels. */
async function getStatusSummary(options = {}) {
	const { includeSensitive = true, includeChannelSummary = true } = options;
	const cfg = options.config ?? getRuntimeConfig();
	const channelScopeConfig = options.sourceConfig === void 0 ? { config: cfg } : {
		config: cfg,
		activationSourceConfig: options.sourceConfig
	};
	const needsChannelPlugins = includeChannelSummary && await channelPluginIdsModuleLoader.load().then(({ hasConfiguredChannelsForReadOnlyScope }) => hasConfiguredChannelsForReadOnlyScope(channelScopeConfig));
	const linkContext = needsChannelPlugins ? await linkChannelModuleLoader.load().then(({ resolveLinkChannelContext }) => resolveLinkChannelContext(cfg, { sourceConfig: options.sourceConfig })) : null;
	const agentList = listGatewayAgentsBasic(cfg);
	const heartbeatAgents = withAgentRosterFactsBatch(cfg, () => {
		const heartbeatSummaries = resolveHeartbeatSummariesForAgents(cfg, agentList.agents.map((agent) => agent.id));
		return agentList.agents.map((agent, index) => {
			const summary = expectDefined(heartbeatSummaries[index], "heartbeat summary");
			let waitingForRoute = false;
			if (summary.enabled && !agent.admissionRefusal && (summary.target === "last" || summary.target === "owner")) {
				const heartbeatSession = resolveHeartbeatSessionKey(cfg, agent.id, summary.session === void 0 ? void 0 : { session: summary.session });
				const entry = loadExactSessionEntryReadOnly({
					agentId: agent.id,
					storePath: heartbeatSession.storePath,
					sessionKey: heartbeatSession.sessionKey
				})?.entry;
				const route = deliveryContextFromSession(entry);
				waitingForRoute = summary.target === "last" ? !(route?.channel && route.to) : !hasResolvableHeartbeatOwnerRoute({
					cfg,
					agentId: agent.id,
					entry,
					heartbeat: {
						...cfg.agents?.defaults?.heartbeat,
						...resolveAgentConfig(cfg, agent.id)?.heartbeat
					}
				});
			}
			return {
				agentId: agent.id,
				enabled: summary.enabled && !agent.admissionRefusal,
				every: summary.every,
				everyMs: summary.everyMs,
				waitingForRoute
			};
		});
	});
	const channelSummary = needsChannelPlugins ? await channelSummaryModuleLoader.load().then(({ buildChannelSummary }) => buildChannelSummary(cfg, {
		colorize: true,
		includeAllowFrom: true,
		sourceConfig: options.sourceConfig
	})) : [];
	const queuedSystemEvents = agentList.agents.flatMap(({ id: agentId }) => peekSystemEvents(resolveSystemEventQueueKey(resolveCanonicalMainSessionKey({
		agentId,
		mainKey: cfg.session?.mainKey,
		sessionScope: cfg.session?.scope
	}), agentId)));
	const taskInspection = await (await taskRegistryMaintenanceModuleLoader.load()).getInspectableTaskStatusSummaryReadOnly();
	const now = Date.now();
	const { taskAudit, taskAuditRetainedLost } = taskInspection;
	const tasks = {
		...taskInspection.tasks,
		...taskInspection.state === "migration-required" ? { warning: "Task history is unavailable until Gateway startup or openclaw doctor --fix repairs the state database." } : {}
	};
	const sessionDetails = includeSensitive ? await prepareSessionStatusDetails(cfg, now) : void 0;
	const sessionStores = options.sessionStores ?? await readStatusSessionStores(cfg, agentList.agents, includeSensitive ? 10 : 0, options.sessionRowProjection);
	const byAgent = await Promise.all(sessionStores.byAgent.map(async ({ agent, path, count, recent }) => ({
		agentId: agent.id,
		...agent.status ? { status: agent.status } : {},
		...includeSensitive && agent.admissionRefusal ? { admissionRefusal: agent.admissionRefusal } : {},
		path: includeSensitive ? path : "[redacted]",
		count,
		recent: sessionDetails ? await sessionDetails.buildSessionRows(recent) : []
	})));
	const recent = sessionDetails ? await sessionDetails.buildSessionRows(sortAndLimitBy(sessionStores.recent, 10, compareSessionCandidatesByUpdatedAt)) : [];
	const hostDesktopStatus = options.hostDesktopStatus ?? (await (await import("./host-source-DQb1Z5IW.mjs")).inspectHostDesktop({ config: cfg.desktop?.host })).status;
	const sqliteWal = readOpenClawStateWalHealth();
	return {
		runtimeVersion: resolveRuntimeServiceVersion(process.env),
		...options.includeCliProjection ? { cliProjection: buildStatusCliProjection(cfg, agentList) } : {},
		sqliteWal: sqliteWal && !includeSensitive ? {
			...sqliteWal,
			error: void 0
		} : sqliteWal,
		hostDesktop: hostDesktopStatus,
		linkChannel: linkContext ? {
			id: linkContext.plugin.id,
			label: linkContext.plugin.meta.label ?? "Channel",
			linked: linkContext.linked,
			authAgeMs: linkContext.authAgeMs
		} : void 0,
		heartbeat: {
			defaultAgentId: agentList.defaultId,
			agents: heartbeatAgents
		},
		channelSummary,
		queuedSystemEvents,
		startupMigrationWarning: readStartupMigrationWarning(includeSensitive),
		startupRecoveryWarning: readStartupRecoveryWarning(includeSensitive),
		installationReplacementWarning: getGatewayInstallationReplacement()?.message,
		secretEgressProxy: getSecretEgressCertificateStatus(),
		degradedSecretOwners: listActiveDegradedSecretOwners().map(({ ownerKind, ownerId, state, degradationState, paths: ownerPaths, reason }) => {
			const redactedReason = redactSecretDegradationReason(reason);
			return {
				ownerKind,
				ownerId,
				state,
				degradationState: degradationState ?? "cold",
				paths: ownerPaths,
				reason: redactedReason
			};
		}),
		degradedPlugins: listActiveDegradedPlugins().map(({ pluginId, state, diagnostic }) => ({
			pluginId,
			state,
			diagnostic: toPublicPluginVerificationDiagnostic(diagnostic)
		})),
		tasks,
		taskAudit,
		...taskAuditRetainedLost.count > 0 ? { taskAuditRetainedLost } : {},
		sessions: {
			paths: includeSensitive ? sessionStores.paths : [],
			count: sessionStores.count,
			defaults: sessionDetails?.defaults ?? {
				model: null,
				contextTokens: null
			},
			recent,
			byAgent
		}
	};
}
//#endregion
export { getStatusSummary as t };
