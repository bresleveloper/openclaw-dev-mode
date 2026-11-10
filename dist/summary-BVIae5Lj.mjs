import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as resolveRuntimeServiceVersion } from "./version-jg_14gWz.mjs";
import { _ as readOpenClawStateWalHealth } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-CJrzFzqU.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { O as withAgentRosterFactsBatch, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { g as listActiveDegradedPlugins, y as toPublicPluginVerificationDiagnostic } from "./discovery-availability-CEoTdFoo.mjs";
import { g as redactSecretDegradationReason, m as listActiveDegradedSecretOwners } from "./runtime-degraded-state-SptB0g_t.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { i as hasUserPinnedModelSelection, t as hasSessionActiveAutoModelFallback } from "./model-override-provenance-ByJqxWxk.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import { c as resolveSystemEventQueueKey } from "./system-event-ownership-DAgHWXZ1.mjs";
import { _ as peekSystemEvents } from "./system-events-Bf4ozS7L.mjs";
import { n as resolveCanonicalMainSessionKey } from "./main-session-key-BNNxukz6.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { l as resolveSessionTotalTokens, o as resolveFreshSessionTotalTokens } from "./types-BGDhC4_W.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./config-B3oiWDlr.mjs";
import { n as resolveProjectedSessionContextTokens } from "./context-token-provenance-1ZLJbdqW.mjs";
import { t as listGatewayAgentsBasic } from "./agent-list-CCh58b5o.mjs";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { t as sortAndLimitBy } from "./sort-and-limit-NdojqZsZ.mjs";
import { n as getSecretEgressCertificateStatus } from "./registry-vAykEA0u.mjs";
import { a as getGatewayInstallationReplacement } from "./stale-install-CUqZoIvN.mjs";
import { o as readStartupMigrationWarning } from "./state-migrations.messages-CB0bXmSE.mjs";
import { t as hasResolvableHeartbeatOwnerRoute } from "./targets-CYH5cCbP.mjs";
import { i as resolveHeartbeatSummariesForAgents } from "./heartbeat-summary-projection-Be7gbjfb.mjs";
import { t as readStartupRecoveryWarning } from "./main-session-restart-recovery-diagnostics-CCDcnsT7.mjs";
import { n as resolveHeartbeatSessionKey } from "./heartbeat-runner-session-TVWWDso7.mjs";
import { n as readStatusSessionStores } from "./session-stores-o9sf-Y0l.mjs";
import { t as resolveMemoryPluginStatus } from "./memory-plugin-C0OSVysP.mjs";
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
const channelSummaryModuleLoader = createLazyImportLoader(() => import("./channel-summary-C-I7QRsI.mjs"));
const channelPluginIdsModuleLoader = createLazyImportLoader(() => import("./channel-plugin-ids-Boz_oeW_.mjs"));
const linkChannelModuleLoader = createLazyImportLoader(() => import("./link-channel-CcmZv4yQ.mjs"));
const loadStatusSummaryRuntimeModule = createLazyRuntimeSurface(() => import("./commands/status.summary.runtime.js"), ({ statusSummaryRuntime }) => statusSummaryRuntime);
const buildFlags = (entry) => {
	if (!entry) return [];
	const flags = [];
	const think = entry?.thinkingLevel;
	if (typeof think === "string" && think.length > 0) flags.push(`think:${think}`);
	const verbose = entry?.verboseLevel;
	if (typeof verbose === "string" && verbose.length > 0) flags.push(`verbose:${verbose}`);
	if (entry?.fastMode === "auto" || entry?.fastMode === "ultrafast") flags.push(`fast:${entry.fastMode}`);
	else if (typeof entry?.fastMode === "boolean") flags.push(entry.fastMode ? "fast" : "fast:off");
	const reasoning = entry?.reasoningLevel;
	if (typeof reasoning === "string" && reasoning.length > 0) flags.push(`reasoning:${reasoning}`);
	const elevated = entry?.elevatedLevel;
	if (typeof elevated === "string" && elevated.length > 0) flags.push(`elevated:${elevated}`);
	if (entry?.systemSent) flags.push("system");
	if (entry?.abortedLastRun) flags.push("aborted");
	const sessionId = entry.sessionId;
	if (typeof sessionId === "string" && sessionId.length > 0) flags.push(`id:${sessionId}`);
	return flags;
};
function compareSessionCandidatesByUpdatedAt(left, right) {
	return (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0);
}
async function prepareSessionStatusDetails(cfg, now, candidates) {
	const { classifySessionKey, resolveConfiguredStatusModelRef, resolveAuthoredModelContextTokens, resolveContextTokensForModel, resolveSessionRuntime, readSessionRuntimeMetadata, resolveSessionModelRef, resolveStatusModelComparisonLabel, resolveStatusModelLookupRef, createStatusModelContextResolver } = await loadStatusSummaryRuntimeModule();
	const metadata = await readSessionRuntimeMetadata(cfg, candidates);
	const metadataByCandidate = new Map(candidates.map((candidate, index) => [candidate, metadata[index] ?? null]));
	const resolveModelContext = await createStatusModelContextResolver(cfg);
	const resolved = resolveConfiguredStatusModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const configModel = resolved.model ?? "gpt-6-astra";
	const configModelContext = await resolveModelContext(resolved.provider ?? "openai", configModel);
	const configContextTokens = resolveContextTokensForModel({
		cfg,
		provider: resolved.provider ?? "openai",
		model: configModel,
		...configModelContext,
		allowAsyncLoad: false,
		allowCacheLookup: false
	}) ?? null;
	const sessionRows = /* @__PURE__ */ new Map();
	const buildSessionRows = async (rows) => Promise.all(rows.map(async (candidate) => {
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
		const model = resolvedModel.model ?? configuredSessionModel;
		const lookupModel = resolveStatusModelLookupRef({
			provider: resolvedModel.provider,
			model,
			defaultProvider: configuredForSession.provider ?? "openai"
		}) ?? resolvedModel;
		const lookupModelId = lookupModel.model ?? model;
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
		const runtime = resolveSessionRuntime({
			cfg,
			entry,
			provider: lookupModel.provider,
			model: lookupModelId ?? "",
			agentId,
			sessionKey: key,
			acpMeta: metadataByCandidate.get(candidate) ?? null
		});
		const modelContext = await resolveModelContext(lookupModel.provider, lookupModelId ?? void 0, agentId, runtime.id, entry);
		const resolvedContextTokens = resolveContextTokensForModel({
			cfg,
			provider: lookupModel.provider,
			model: lookupModelId,
			...modelContext,
			allowAsyncLoad: false,
			allowCacheLookup: false
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
/** Builds the aggregate status summary for agents, sessions, heartbeat, and channels. */
async function getStatusSummary(options = {}) {
	const { includeSensitive = true, includeChannelSummary = true } = options;
	const cfg = options.config ?? await captureRuntimeConfigAsyncReader()();
	const channelScopeConfig = options.sourceConfig === void 0 ? { config: cfg } : {
		config: cfg,
		activationSourceConfig: options.sourceConfig
	};
	const needsChannelPlugins = includeChannelSummary && await channelPluginIdsModuleLoader.load().then(({ hasConfiguredChannelsForReadOnlyScopeAsync }) => hasConfiguredChannelsForReadOnlyScopeAsync(channelScopeConfig));
	const linkContext = needsChannelPlugins ? await linkChannelModuleLoader.load().then(({ resolveLinkChannelContext }) => resolveLinkChannelContext(cfg, { sourceConfig: options.sourceConfig })) : null;
	const agentList = await listGatewayAgentsBasic(cfg);
	const heartbeatInputs = withAgentRosterFactsBatch(cfg, () => {
		const heartbeatSummaries = resolveHeartbeatSummariesForAgents(cfg, agentList.agents.map((agent) => agent.id));
		return agentList.agents.map((agent, index) => {
			const summary = expectDefined(heartbeatSummaries[index], "heartbeat summary");
			let routeTarget;
			if (summary.enabled && !agent.admissionRefusal && (summary.target === "last" || summary.target === "owner")) {
				const heartbeatSession = resolveHeartbeatSessionKey(cfg, agent.id, summary.session === void 0 ? void 0 : { session: summary.session });
				routeTarget = {
					storePath: heartbeatSession.storePath,
					sessionKey: heartbeatSession.sessionKey,
					target: summary.target,
					heartbeat: {
						...cfg.agents?.defaults?.heartbeat,
						...resolveAgentConfig(cfg, agent.id)?.heartbeat
					}
				};
			}
			return {
				status: {
					agentId: agent.id,
					enabled: summary.enabled && !agent.admissionRefusal,
					every: summary.every,
					everyMs: summary.everyMs,
					waitingForRoute: false
				},
				routeTarget
			};
		});
	});
	const heartbeatStores = /* @__PURE__ */ new Map();
	for (const { status, routeTarget } of heartbeatInputs) {
		if (!routeTarget) continue;
		let store = heartbeatStores.get(routeTarget.storePath);
		if (!store) {
			store = {
				agentId: status.agentId,
				storePath: routeTarget.storePath,
				sessionKeys: []
			};
			heartbeatStores.set(routeTarget.storePath, store);
		}
		store.sessionKeys.push(routeTarget.sessionKey);
	}
	const heartbeatStoreInputs = [...heartbeatStores.values()];
	const heartbeatEntries = heartbeatStoreInputs.length ? await withSessionEntriesFromStoresInWorker(heartbeatStoreInputs.map(({ agentId, storePath, sessionKeys }) => ({
		agentId,
		storePath,
		sessionKeys,
		projection: "exact",
		snapshotFields: []
	})), (reads) => new Map(reads.flatMap(({ result }, index) => result.entries.map((row) => [`${heartbeatStoreInputs[index].storePath}\0${row.sessionKey}`, row.entry])))) : /* @__PURE__ */ new Map();
	const heartbeatAgents = [];
	for (const { status, routeTarget } of heartbeatInputs) {
		if (routeTarget) {
			const entry = heartbeatEntries.get(`${routeTarget.storePath}\0${routeTarget.sessionKey}`);
			if (routeTarget.target === "last") {
				const route = deliveryContextFromSession(entry);
				status.waitingForRoute = !(route?.channel && route.to);
			} else status.waitingForRoute = !await hasResolvableHeartbeatOwnerRoute({
				cfg,
				agentId: status.agentId,
				entry,
				heartbeat: routeTarget.heartbeat
			});
		}
		heartbeatAgents.push(status);
	}
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
	const now = Date.now();
	const sessionStores = options.sessionStores ?? await readStatusSessionStores(cfg, agentList.agents, includeSensitive ? 10 : 0, options.sessionRowProjection);
	const recentCandidates = sortAndLimitBy(sessionStores.recent, 10, compareSessionCandidatesByUpdatedAt);
	const sessionDetails = includeSensitive ? await prepareSessionStatusDetails(cfg, now, [.../* @__PURE__ */ new Set([...recentCandidates, ...sessionStores.byAgent.flatMap(({ recent }) => recent)])]) : void 0;
	const byAgent = await Promise.all(sessionStores.byAgent.map(async ({ agent, path, count, recent }) => ({
		agentId: agent.id,
		...agent.status ? { status: agent.status } : {},
		...includeSensitive && agent.admissionRefusal ? { admissionRefusal: agent.admissionRefusal } : {},
		path: includeSensitive ? path : "[redacted]",
		count,
		recent: sessionDetails ? await sessionDetails.buildSessionRows(recent) : []
	})));
	const recent = sessionDetails ? await sessionDetails.buildSessionRows(recentCandidates) : [];
	const hostDesktopStatus = options.hostDesktopStatus ?? (await (await import("./host-source-DI2h8iZL.mjs")).inspectHostDesktop({ config: cfg.desktop?.host })).status;
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
		secretEgressProxy: await getSecretEgressCertificateStatus(),
		degradedSecretOwners: listActiveDegradedSecretOwners().map(({ ownerKind, ownerId, state, degradationState, paths, reason }) => ({
			ownerKind,
			ownerId,
			state,
			degradationState: degradationState ?? "cold",
			paths,
			reason: redactSecretDegradationReason(reason)
		})),
		degradedPlugins: listActiveDegradedPlugins().map(({ pluginId, state, diagnostic }) => ({
			pluginId,
			state,
			diagnostic: toPublicPluginVerificationDiagnostic(diagnostic)
		})),
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
