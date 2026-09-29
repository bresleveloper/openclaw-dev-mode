import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { A as parseAgentSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./defaults-BbU4k6fu.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { n as info } from "./globals-QODkv80i.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { c as prepareCliProviderClassifier } from "./model-selection-CaFyCMqp.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { l as resolveSessionTotalTokens, o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { t as classifySessionKind } from "./classify-session-kind-BOSciWMV.mjs";
import { i as readAcpSessionMetaBatch } from "./session-meta-BxRb6CVY.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./sessions-DE4llkPV.mjs";
import { n as resolveProjectedSessionContextTokens } from "./context-token-provenance-CO52ZGCb.mjs";
import { n as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-ByGRIRPi.mjs";
import { c as resolveAuthoredModelContextTokens } from "./context-resolution-D64R_bgD.mjs";
import { t as sortAndLimitBy } from "./sort-and-limit-NdojqZsZ.mjs";
import { t as resolveAgentRuntimeLabel } from "./agent-runtime-label-DB2U4nbv.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BRdXcJHh.mjs";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-Dln1Uhpe.mjs";
import { t as resolveCommandSessionStoreTargets } from "./session-store-targets-BtlJnu5U.mjs";
import { a as toSessionDisplayRow, i as formatSessionModelCell, l as resolveSessionDisplayModelRef, n as formatSessionFlagsCell, r as formatSessionKeyCell, s as resolveSessionDisplayDefaults, t as formatSessionAgeCell } from "./sessions-table-C7Oc5qV2.mjs";
//#region src/commands/sessions.ts
/**
* Session listing command.
*
* It loads one or more agent session stores, enriches rows with model/runtime
* metadata, and emits JSON or terminal tables.
*/
const DEFAULT_SESSIONS_LIMIT = 100;
const contextLookupRuntimeLoader = createLazyImportLoader(() => import("./context-DNft4vCK.mjs"));
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
	if (!rich) return kind;
	if (kind === "group") return theme.accentBright(kind);
	if (kind === "global") return theme.warn(kind);
	if (kind === "direct") return theme.accent(kind);
	return theme.muted(kind);
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
/** Lists sessions across selected stores with optional JSON output. */
async function sessionsCommand(opts, runtime) {
	const aggregateAgents = opts.allAgents === true;
	const cfg = getRuntimeConfig();
	const displayDefaults = resolveSessionDisplayDefaults(cfg);
	const { lookupContextTokens, resolveModelContextTokenProjection } = await contextLookupRuntimeLoader.load();
	const configContextTokens = lookupContextTokens(displayDefaults.model, { allowAsyncLoad: false }) ?? 2e5;
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
	const acpSessionMetaByEntry = readAcpSessionMetaBatch({
		cfg,
		entries: sessionEntries.map(({ acpSessionKey, agentId, entry }) => ({
			sessionKey: acpSessionKey,
			agentId,
			entry
		}))
	});
	const rows = sessionEntries.map(({ acpSessionKey, agentId, entry, row }) => {
		const acpMeta = acpSessionMetaByEntry.get(entry);
		const acpRuntime = acpMeta != null;
		const modelRef = applyAcpModelOverlayIfNeeded(resolveSessionDisplayModelRef(cfg, row, classifyCliProvider, agentId), acpSessionKey, acpRuntime);
		const agentRuntime = resolveModelAgentRuntimeMetadata({
			cfg,
			agentId,
			sessionEntry: entry,
			provider: modelRef.provider,
			model: modelRef.model,
			sessionKey: acpSessionKey,
			acpRuntime,
			acpBackend: acpMeta?.backend
		});
		const modelContext = !(typeof entry.contextTokens === "number" && entry.contextTokens > 0) && classifyCliProvider(agentRuntime.id) ? {
			contextTokens: lookupContextTokens(modelRef.model, { allowAsyncLoad: false }),
			authoredContextTokens: resolveAuthoredModelContextTokens({
				cfg,
				provider: modelRef.provider,
				model: modelRef.model
			})
		} : resolveModelContextTokenProjection({
			cfg,
			provider: modelRef.provider,
			model: modelRef.model,
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
	});
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
					contextTokens: row.contextTokens ?? configContextTokens ?? null,
					modelProvider: modelRef.provider,
					model: modelRef.model
				});
			})
		});
		return;
	}
	const primaryTarget = targets[0];
	if (primaryTarget && targets.length === 1 && !aggregateAgents) runtime.log(info(`Session store: ${resolveSessionStoreDisplayPath(primaryTarget)}`));
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
			tokens: formatTokensCell(resolveSessionTotalTokens(row), resolveFreshSessionTotalTokens(row), row.contextTokens ?? configContextTokens, rich),
			flags: formatSessionFlagsCell(row, rich)
		}))
	}).trimEnd());
}
//#endregion
export { sessionsCommand };
