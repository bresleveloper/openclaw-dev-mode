import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BJKolYfz.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { t as classifySessionKind } from "./classify-session-kind-BBHw4D98.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { l as resolveSessionTotalTokens, o as resolveFreshSessionTotalTokens } from "./types-BGDhC4_W.mjs";
import { t as formatTokenCount } from "./token-format-DW77OPWV.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import "./config-B3oiWDlr.mjs";
import "./sessions-CnzPI1yx.mjs";
import { n as resolveProjectedSessionContextTokens } from "./context-token-provenance-1ZLJbdqW.mjs";
import { t as resolveCurrentSessionAgentRuntimeMetadata } from "./agent-runtime-metadata-B5dnCB4A.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { n as prepareCliProviderClassifier } from "./model-selection-cli-CxV7VRIV.mjs";
import { o as selectModelCatalogRuntimeEntry } from "./model-catalog-view-UkLRAY5C.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { n as info } from "./globals-XVSoVbNQ.mjs";
import { t as sortAndLimitBy } from "./sort-and-limit-NdojqZsZ.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { t as ExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import { n as resolveAgentRuntimeLabel } from "./agent-runtime-label-X2Hryd-W.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BerrlExF.mjs";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-BGyWa30_.mjs";
import { t as resolveCommandSessionStoreTargets } from "./session-store-targets-Cv9wo-6s.mjs";
import { a as toSessionDisplayRow, i as formatSessionModelCell, n as formatSessionFlagsCell, r as formatSessionKeyCell, s as resolveSessionDisplayModelRef, t as formatSessionAgeCell } from "./sessions-table-gr0dMhfC.mjs";
//#region src/commands/sessions.ts
const DEFAULT_SESSIONS_LIMIT = 100;
function toSessionCatalogEntry(model, runtime = model) {
	return {
		id: model.id,
		name: model.name,
		provider: model.provider,
		contextWindow: runtime.contextWindow,
		contextTokens: runtime.contextTokens,
		contextWindows: runtime.contextWindows,
		contextWindowDefault: runtime.contextWindowDefault,
		...runtime.agentRuntime && !["auto", "openclaw"].includes(runtime.agentRuntime.id) ? { nativeRuntime: runtime.agentRuntime.id } : {}
	};
}
/** True ACP sessions use the child runtime's model, not the configured fallback. */
function applyAcpModelOverlayIfNeeded(modelRef, sessionKey, acpRuntime) {
	if (!acpRuntime || !isAcpSessionKey(sessionKey)) return modelRef;
	return {
		provider: "acpx",
		model: `${parseAgentSessionKey(sessionKey)?.agentId ?? "acp"}-acp`
	};
}
function compareSessionRowsByUpdatedAt(a, b) {
	return (b.entry.updatedAt ?? 0) - (a.entry.updatedAt ?? 0);
}
function parseSessionsLimit(value) {
	if (value === void 0) return DEFAULT_SESSIONS_LIMIT;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.toLowerCase() === "all") return;
		if (!/^\d+$/.test(trimmed)) return null;
		return parseStrictPositiveInteger(trimmed) ?? null;
	}
	return Number.isInteger(value) && value > 0 ? value : null;
}
const colorByPct = (label, pct, rich) => {
	if (!rich || pct === null) return label;
	if (pct >= 95) return theme.error(label);
	if (pct >= 80) return theme.warn(label);
	if (pct >= 60) return theme.success(label);
	return theme.muted(label);
};
const formatTokensCell = (total, freshTotal, contextTokens, rich) => {
	const ctxLabel = contextTokens ? formatTokenCount(contextTokens) : "?";
	if (total === void 0) {
		const label = `unknown/${ctxLabel} (?%)`;
		return rich ? theme.muted(label) : label;
	}
	const pct = contextTokens && freshTotal !== void 0 ? Math.min(999, Math.round(freshTotal / contextTokens * 100)) : null;
	const label = `${formatTokenCount(total)}/${ctxLabel} (${pct ?? "?"}%)`;
	return colorByPct(label, pct, rich);
};
const formatKindCell = (kind, rich) => {
	const colors = {
		group: theme.accentBright,
		global: theme.warn,
		direct: theme.accent,
		cron: theme.muted,
		"spawn-child": theme.muted,
		unknown: theme.muted
	};
	return colorize(rich, colors[kind], kind);
};
function resolveSessionRuntimeLabel(params) {
	const id = normalizeOptionalLowercaseString(params.agentRuntime.id);
	const resolvedHarness = id && id !== "openclaw" && id !== "auto" ? id : void 0;
	return resolveAgentRuntimeLabel({
		config: params.cfg,
		sessionEntry: params.entry,
		resolvedHarness,
		fallbackProvider: params.modelProvider,
		classifyCliProvider: params.classifyCliProvider
	});
}
function resolveSessionStoreDisplayPath(target) {
	return resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path;
}
function stripChannelRecipientPrefix(value, channel) {
	const raw = normalizeOptionalString(value);
	const normalizedChannel = normalizeOptionalLowercaseString(channel);
	if (!raw || !normalizedChannel) return raw;
	const prefix = `${normalizedChannel}:`;
	if (!raw.toLowerCase().startsWith(prefix)) return raw;
	const stripped = raw.slice(prefix.length);
	const topicMarkerIndex = stripped.toLowerCase().indexOf(":topic:");
	return topicMarkerIndex >= 0 ? stripped.slice(0, topicMarkerIndex) : stripped;
}
function resolveDisplayRuntimePolicySessionKey(params) {
	const { cfg, entry, key } = params;
	const origin = sessionDeliveryOrigin(entry);
	const deliveryContext = deliveryContextFromSession(entry);
	const chatType = normalizeChatType(origin?.chatType ?? entry.chatType);
	if (chatType !== "direct") return;
	const channel = normalizeOptionalString(origin?.provider ?? deliveryContext?.channel ?? origin?.surface);
	const to = normalizeOptionalString(origin?.to ?? deliveryContext?.to);
	const from = normalizeOptionalString(origin?.from);
	const nativeDirectUserId = normalizeOptionalString(origin?.nativeDirectUserId);
	const peerId = nativeDirectUserId ?? stripChannelRecipientPrefix(to, channel) ?? stripChannelRecipientPrefix(from, channel);
	const runtimePolicySessionKey = resolveRuntimePolicySessionKey({
		agentId: params.agentId,
		cfg,
		sessionKey: key,
		ctx: {
			SessionKey: key,
			AgentId: params.agentId,
			Provider: channel,
			Surface: normalizeOptionalString(origin?.surface),
			AccountId: normalizeOptionalString(origin?.accountId ?? deliveryContext?.accountId),
			ChatType: chatType,
			NativeDirectUserId: nativeDirectUserId,
			SenderId: peerId,
			OriginatingTo: to,
			From: from,
			To: to
		}
	});
	return runtimePolicySessionKey && runtimePolicySessionKey !== key ? runtimePolicySessionKey : void 0;
}
async function sessionsCommand(opts, runtime) {
	const aggregateAgents = opts.allAgents === true;
	const cfg = await captureRuntimeConfigAsyncReader()();
	const { resolveModelContextTokenProjection } = await import("./context-pVGsGbNW.mjs");
	const { loadPreparedModelCatalogSnapshot } = await import("./prepared-model-catalog-CCWmZ0HZ.mjs");
	const { callGateway, isImplicitLocalGatewayTarget } = await import("./call-BvbeEASg.mjs");
	const { readActiveGatewayLockIdentity } = await import("./gateway-lock-BLFQD0F1.mjs");
	const targets = resolveCommandSessionStoreTargets({
		cfg,
		opts
	});
	let activeMinutes;
	if (opts.active !== void 0) {
		const parsed = parseStrictPositiveInteger(opts.active);
		if (parsed === void 0) {
			const message = "--active must be a positive number of minutes, for example --active 30.";
			throw new ExpectedCliError({
				message,
				humanOutput: message,
				machineOutput: message
			});
		}
		activeMinutes = parsed;
	}
	const limit = parseSessionsLimit(opts.limit);
	if (limit === null) {
		const message = "--limit must be a positive integer or \"all\", for example --limit 25.";
		throw new ExpectedCliError({
			message,
			humanOutput: message,
			machineOutput: message
		});
	}
	const classifyCliProvider = prepareCliProviderClassifier(cfg);
	const activeSince = activeMinutes === void 0 ? void 0 : Date.now() - activeMinutes * 6e4;
	const allEntries = targets.flatMap((target) => {
		return listSessionEntriesReadOnly({
			agentId: target.agentId,
			storePath: target.storePath,
			projection: "list"
		}).filter(({ entry }) => activeSince === void 0 || typeof entry.updatedAt === "number" && entry.updatedAt >= activeSince).map(({ sessionKey, entry }) => ({
			agentId: target.agentId,
			entry,
			sessionKey
		}));
	});
	const totalCount = allEntries.length;
	const sessionEntries = sortAndLimitBy(allEntries, limit, compareSessionRowsByUpdatedAt).map(({ agentId: storeAgentId, entry, sessionKey }) => {
		const row = toSessionDisplayRow(sessionKey, entry);
		const agentId = parseAgentSessionKey(row.key)?.agentId ?? storeAgentId;
		return {
			acpSessionKey: resolveStoredSessionKeyForAgentStore({
				cfg,
				agentId,
				sessionKey: row.key
			}),
			agentId,
			entry,
			row
		};
	});
	const acpSessionMetadata = await readAcpSessionMetaForEntries({
		cfg,
		entries: sessionEntries.map(({ acpSessionKey, agentId, entry }) => ({
			sessionKey: acpSessionKey,
			agentId,
			entry
		}))
	});
	const catalogs = /* @__PURE__ */ new Map();
	let catalogWarningShown = false;
	const warnCatalogUnavailable = () => {
		if (!catalogWarningShown) {
			catalogWarningShown = true;
			runtime.error("Could not read the active Gateway model catalog; showing configured or last verified capacity. Retry when the Gateway is reachable.");
		}
	};
	const gatewayOwner = opts.store === void 0 && sessionEntries.length > 0 && await isImplicitLocalGatewayTarget({ config: cfg }) ? await readActiveGatewayLockIdentity({ requireInspection: true }).catch(() => {
		warnCatalogUnavailable();
	}) : void 0;
	const rows = await Promise.all(sessionEntries.map(async ({ acpSessionKey, agentId, entry, row }, index) => {
		const acpMeta = acpSessionMetadata[index];
		const acpRuntime = acpMeta != null;
		const modelRef = applyAcpModelOverlayIfNeeded(resolveSessionDisplayModelRef(cfg, row, classifyCliProvider, agentId), acpSessionKey, acpRuntime);
		const agentRuntime = resolveCurrentSessionAgentRuntimeMetadata({
			cfg,
			agentId,
			sessionEntry: entry,
			provider: modelRef.provider,
			model: modelRef.model,
			sessionKey: acpSessionKey,
			acpRuntime,
			acpBackend: acpMeta?.backend
		});
		const catalogKey = `${agentId}\0${entry.spawnedWorkspaceDir ?? ""}\0${modelRef.provider}`;
		let pendingCatalog = catalogs.get(catalogKey);
		if (!pendingCatalog) {
			const readSavedCatalog = () => loadPreparedModelCatalogSnapshot({
				config: cfg,
				agentId,
				workspaceDir: entry.spawnedWorkspaceDir,
				readOnly: true,
				providerDiscoveryProviderIds: [modelRef.provider]
			}).catch(() => void 0);
			pendingCatalog = gatewayOwner && (!entry.spawnedWorkspaceDir || entry.spawnedWorkspaceDir === resolveAgentWorkspaceDir(cfg, agentId)) ? callGateway({
				config: cfg,
				localPortOverride: gatewayOwner.port,
				method: "models.list",
				params: {
					agentId,
					provider: modelRef.provider,
					view: "all",
					includeDetails: true,
					includeDefaultModels: false,
					preparedOnly: true
				}
			}).then(({ models }) => ({
				entries: models.map((model) => toSessionCatalogEntry(model)),
				routeVariants: models.flatMap((model) => [model, ...model.runtimeChoices ?? []].map((choice) => toSessionCatalogEntry(model, choice)))
			})).catch(() => {
				warnCatalogUnavailable();
				return readSavedCatalog();
			}) : readSavedCatalog();
			catalogs.set(catalogKey, pendingCatalog);
		}
		const catalog = await pendingCatalog;
		const logicalEntry = findModelInCatalog(catalog?.entries ?? [], modelRef.provider, modelRef.model);
		if (agentRuntime.id === "auto") agentRuntime.id = resolveEffectiveAgentRuntime({
			cfg,
			agentScope: {
				kind: "prepared",
				agentId
			},
			sessionKey: acpSessionKey,
			sessionEntry: entry,
			provider: modelRef.provider,
			modelId: modelRef.model,
			modelApi: logicalEntry?.api,
			modelBaseUrl: logicalEntry?.baseUrl
		});
		const catalogEntry = logicalEntry && selectModelCatalogRuntimeEntry({
			entry: logicalEntry,
			routeVariants: catalog?.routeVariants ?? [],
			runtimeId: agentRuntime.id,
			allowApiFallback: false
		}).entry;
		const modelContext = resolveModelContextTokenProjection({
			cfg,
			provider: modelRef.provider,
			model: modelRef.model,
			modelContextWindow: resolveModelContextWindowProfile({
				catalogEntry,
				selected: entry.contextWindow
			}).contextTokens,
			modelContextTokens: catalogEntry?.contextTokens,
			allowCacheLookup: false,
			allowAsyncLoad: false
		});
		const contextTokens = resolveProjectedSessionContextTokens({
			entry,
			provider: modelRef.provider,
			model: modelRef.model,
			agentHarnessId: agentRuntime.id,
			resolvedContextTokens: modelContext.contextTokens,
			authoredContextTokens: modelContext.authoredContextTokens
		});
		return Object.assign(row, {
			agentId,
			acpRuntime,
			agentRuntime,
			contextTokens,
			displayModelRef: modelRef,
			kind: classifySessionKind(row.key, entry),
			runtimePolicySessionKey: resolveDisplayRuntimePolicySessionKey({
				agentId,
				cfg,
				key: row.key,
				entry
			}),
			runtimeLabel: opts.json ? "" : resolveSessionRuntimeLabel({
				cfg,
				entry,
				agentRuntime,
				modelProvider: modelRef.provider,
				classifyCliProvider
			})
		});
	}));
	const hasMore = rows.length < totalCount;
	if (opts.json) {
		const multi = targets.length > 1;
		const aggregate = aggregateAgents || multi;
		writeRuntimeJson(runtime, {
			path: aggregate || !targets[0] ? null : resolveSessionStoreDisplayPath(targets[0]),
			stores: aggregate ? targets.map((target) => ({
				agentId: target.agentId,
				path: resolveSessionStoreDisplayPath(target)
			})) : void 0,
			allAgents: aggregateAgents ? true : void 0,
			count: rows.length,
			totalCount,
			limitApplied: limit ?? null,
			hasMore,
			activeMinutes: activeMinutes ?? null,
			sessions: rows.map(({ displayModelRef: modelRef, runtimeLabel, ...row }) => {
				return Object.assign(row, {
					totalTokens: resolveSessionTotalTokens(row) ?? null,
					totalTokensFresh: resolveFreshSessionTotalTokens(row) !== void 0,
					contextTokens: row.contextTokens ?? null,
					modelProvider: modelRef.provider,
					model: modelRef.model
				});
			})
		});
		return;
	}
	const primaryTarget = targets[0];
	if (primaryTarget && targets.length === 1 && !aggregateAgents) runtime.log(info(`Session store: ${sanitizeTerminalText(resolveSessionStoreDisplayPath(primaryTarget))}`));
	else runtime.log(info(`Session stores: ${targets.length} (${targets.map((t) => t.agentId).join(", ")})`));
	runtime.log(info(hasMore && limit !== void 0 ? `Sessions listed: ${rows.length} of ${totalCount} (limit ${limit})` : `Sessions listed: ${rows.length}`));
	if (activeMinutes) runtime.log(info(`Filtered to last ${activeMinutes} minute(s)`));
	if (rows.length === 0) {
		runtime.log("No sessions found.");
		return;
	}
	const rich = isRich();
	const showAgentColumn = aggregateAgents || targets.length > 1;
	runtime.log(renderTable({
		width: getTerminalTableWidth(),
		columns: [
			...showAgentColumn ? [{
				key: "agent",
				header: "Agent"
			}] : [],
			{
				key: "kind",
				header: "Kind"
			},
			{
				key: "key",
				header: "Key"
			},
			{
				key: "age",
				header: "Age"
			},
			{
				key: "model",
				header: "Model"
			},
			{
				key: "runtime",
				header: "Runtime"
			},
			{
				key: "tokens",
				header: "Tokens (ctx %)"
			},
			{
				key: "flags",
				header: "Flags",
				flex: true
			}
		].map((column) => Object.assign(column, { header: colorize(rich, theme.heading, column.header) })),
		rows: rows.map((row) => ({
			agent: colorize(rich, theme.accentBright, sanitizeTerminalText(row.agentId)),
			kind: formatKindCell(row.kind, rich),
			key: formatSessionKeyCell(row.key, rich),
			age: formatSessionAgeCell(row.updatedAt, rich),
			model: formatSessionModelCell(row.displayModelRef.model, rich),
			runtime: colorize(rich, theme.info, sanitizeTerminalText(row.runtimeLabel)),
			tokens: formatTokensCell(resolveSessionTotalTokens(row), resolveFreshSessionTotalTokens(row), row.contextTokens ?? null, rich),
			flags: formatSessionFlagsCell(row, rich)
		}))
	}).trimEnd());
}
//#endregion
export { sessionsCommand };
