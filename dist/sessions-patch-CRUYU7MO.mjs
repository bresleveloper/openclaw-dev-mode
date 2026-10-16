import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { a as normalizeFastMode, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-vismCEk2.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { c as normalizeThinkLevel, o as normalizeElevatedLevel, s as normalizeReasoningLevel, u as normalizeUsageDisplay } from "./thinking.shared-Jy32Vp-O.mjs";
import { a as normalizeExecTarget } from "./exec-approvals-core-s7tTQC_a.mjs";
import { i as normalizeSessionToolOverrides } from "./agent-bundle-mcp-runtime-config-4IdPhrfp.mjs";
import { v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as SESSION_COLOR_IDS, o as normalizeSessionColorValue, r as SESSION_ICON_GLYPH_IDS, s as normalizeSessionIconValue } from "./session-agent-status-BSzRJm_2.mjs";
import { d as resolveThinkingProfile, l as resolveSupportedThinkingLevelFromProfile } from "./thinking-DK1cFezU.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { m as resolveMissingAgentHarnessSessionError, o as isAgentHarnessSessionKeyOwnedBy } from "./agent-harness-session-key-D8EQIzja.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-BwS3HC5I.mjs";
import { n as requiresAgentHarnessPluginSelection, r as resolveAgentHarnessOwnerPluginIds } from "./runtime-plugin-load-plan-BRzvw1z3.mjs";
import "./model-catalog-B5tSuR_i.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-BzuAi3ao.mjs";
import { h as isPinnableSessionEntry } from "./store-maintenance-CGOlSbiV.mjs";
import "./exec-approvals-B1rZTeax.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { c as invalidSessionRequest } from "./session-request-agent-Bxi11ET4.mjs";
import { s as isModelSelectionLocked, t as MODEL_SELECTION_LOCKED_MESSAGE } from "./model-overrides-uZFvcSRc.mjs";
import { t as normalizeSendPolicy } from "./send-policy-dVeTk31X.mjs";
import { n as readAcpSessionMetaForEntry } from "./session-meta-readonly-CvCR0QQG.mjs";
import { g as normalizeInheritedToolDenylist, h as normalizeInheritedToolAllowlist } from "./subagent-capabilities-DD6QCsqy.mjs";
import { t as normalizeGroupActivation } from "./group-activation-C9UsJ0Nq.mjs";
import { it as sessionAgentStatusExpiresAt, nt as resolveActiveSessionAgentStatus, rt as sanitizeSessionAgentStatusNote, tt as isSessionAgentAttentionIconId } from "./session-row-prepared-read-eHG52FnK.mjs";
import { i as selectModelCatalogRuntimeEntry } from "./model-catalog-view-B5SlLDbh.mjs";
import { i as snapshotAgentModelFallback, n as isSessionStatusModelPatchOrigin, t as isAgentSessionModelPatchOrigin } from "./session-model-patch-origin-DhnZWUu3.mjs";
import { t as applyModelOverrideWithAuthProfileCompatibility } from "./auth-profile-preservation-C7x4I4Ip.mjs";
import { t as parseSessionLabel } from "./session-label-DSD-L6TD.mjs";
import { n as resolveModelRuntimeDirective, t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-BwbBgcYH.mjs";
import { i as parseVerboseOverride, n as applyVerboseOverride, r as parseTraceOverride, t as applyTraceOverride } from "./level-overrides-DL5nwCWf.mjs";
import { s as resolveProtectedSessionVisibilityError } from "./sessions-shared-CHxhVZeL.mjs";
import { n as prepareSessionPatchModelSelection, o as resolveSessionPatchModelSelection } from "./sessions-patch-model-selection-CJHin-tx.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/session-unread-ack.ts
var session_unread_ack_exports = /* @__PURE__ */ __exportAll({
	isSessionUnreadAckOnlyPatch: () => isSessionUnreadAckOnlyPatch,
	resolveSessionUnreadAck: () => resolveSessionUnreadAck,
	validateSessionUnreadAck: () => validateSessionUnreadAck
});
const CONDITIONAL_UNREAD_ACK_ALLOWED_KEYS = /* @__PURE__ */ new Set([
	"agentId",
	"expectedLifecycleRevision",
	"expectedMarkedUnreadAt",
	"expectedSessionId",
	"key",
	"unread"
]);
/**
* A patch that carries nothing but the read acknowledgement itself (plus its
* compare-and-swap preconditions). Shared with the patch projection owner, which
* must not age the session row for a read.
*/
function isSessionUnreadAckOnlyPatch(patch) {
	return patch.unread === false && Object.entries(patch).every(([key, value]) => value === void 0 || CONDITIONAL_UNREAD_ACK_ALLOWED_KEYS.has(key));
}
function validateSessionUnreadAck(patch, target) {
	if (target.expectedMarkedUnreadAt === void 0) return;
	if (isSessionUnreadAckOnlyPatch(patch)) return;
	return "expectedMarkedUnreadAt requires unread=false as the only mutation.";
}
function resolveSessionUnreadAck(entry, patch) {
	const { expectedMarkedUnreadAt } = patch;
	if (!isSessionUnreadAckOnlyPatch(patch) || expectedMarkedUnreadAt === void 0) return { kind: "apply" };
	if (!entry) return { kind: "missing" };
	return (entry.markedUnreadAt ?? null) === expectedMarkedUnreadAt ? { kind: "apply" } : {
		kind: "stale",
		entry
	};
}
//#endregion
//#region src/gateway/session-execution-settings.ts
/** Projects validated execution preferences; admission and commit guards remain with the patch owner. */
function applySessionExecutionSettings(next, patch) {
	if ("execHost" in patch) {
		const raw = patch.execHost;
		if (raw === null) delete next.execHost;
		else if (raw !== void 0) {
			const normalized = normalizeExecTarget(raw) ?? void 0;
			if (!normalized) return "invalid execHost (use \"auto\"|\"sandbox\"|\"gateway\"|\"node\")";
			next.execHost = normalized;
		}
	}
	if ("execNode" in patch) {
		if (patch.execNode === null) {
			delete next.execNode;
			delete next.execCwd;
			if (next.execHost === "node") delete next.execHost;
		} else if (patch.execNode !== void 0) {
			const trimmed = normalizeOptionalString(patch.execNode) ?? "";
			if (!trimmed) return "invalid execNode: empty";
			if (trimmed !== next.execNode) delete next.execCwd;
			next.execNode = trimmed;
		}
	}
	if (patch.sandboxMode === "off") {
		if (next.sandbox === "required") return "This session requires a sandbox and cannot run without one.";
		next.sandboxMode = "off";
	} else if (patch.sandboxMode === null) delete next.sandboxMode;
	if (patch.permissionMode === null) delete next.permissionMode;
	else if (patch.permissionMode !== void 0) next.permissionMode = patch.permissionMode;
	if (patch.nativeRuntimeConsent === null || next.permissionMode !== "full" || next.sandboxMode !== "off") delete next.nativeRuntimeConsent;
	else if (patch.nativeRuntimeConsent !== void 0) next.nativeRuntimeConsent = patch.nativeRuntimeConsent;
}
//#endregion
//#region src/gateway/sessions-patch-context-window.ts
function* applySessionContextWindowPatch(params) {
	if ("contextWindow" in params.patch) {
		const previous = params.next.contextWindow;
		const raw = params.patch.contextWindow;
		if (raw === null) delete params.next.contextWindow;
		else if (raw !== void 0) params.next.contextWindow = raw.trim();
		if (previous !== params.next.contextWindow) {
			params.next.liveModelSwitchPending = true;
			delete params.next.contextTokens;
			delete params.next.contextTokensSource;
			delete params.next.contextBudgetStatus;
		}
	}
	if (!("contextWindow" in params.patch) && !("model" in params.patch) && !("agentRuntime" in params.patch)) return { ok: true };
	const selected = normalizeOptionalString(params.next.contextWindow);
	if (!selected) {
		delete params.next.contextWindow;
		return { ok: true };
	}
	const provider = params.next.providerOverride ?? params.defaultProvider;
	const model = params.next.modelOverride ?? params.defaultModel;
	const catalog = yield* params.loadModelCatalog();
	const logical = catalog ? findModelCatalogEntry(catalog, {
		provider,
		modelId: model
	}) : void 0;
	const catalogEntry = logical ? selectModelCatalogRuntimeEntry({
		entry: logical,
		routeVariants: params.routeVariants() ?? catalog ?? [],
		runtimeId: params.runtimeId(provider, model, params.next)
	}).entry : void 0;
	if (catalogEntry?.contextWindows?.some((option) => option.id === selected)) return { ok: true };
	if (!("contextWindow" in params.patch)) {
		delete params.next.contextWindow;
		return { ok: true };
	}
	const allowed = catalogEntry?.contextWindows?.map((option) => option.id).join("|");
	return {
		ok: false,
		error: `contextWindow "${selected}" is not supported for ${provider}/${model}${allowed ? ` (use ${allowed})` : ""}`
	};
}
//#endregion
//#region src/gateway/sessions-patch-display-metadata.ts
/** Applies display-metadata patch fields onto the next entry; returns an error message on invalid input. */
function applySessionsPatchDisplayMetadata(params) {
	const { patch, next } = params;
	for (const field of ["autoLabel", "label"]) {
		if (!(field in patch)) continue;
		const raw = patch[field];
		if (raw === null) delete next[field];
		else if (raw !== void 0) {
			const parsed = parseSessionLabel(raw);
			if (!parsed.ok) return parsed.error;
			if (field === "label" && params.isLabelInUse(parsed.label)) return `label already in use: ${parsed.label}`;
			next[field] = parsed.label;
		}
	}
	if ("icon" in patch) {
		const raw = patch.icon;
		if (raw === null || raw === "") delete next.icon;
		else if (raw !== void 0) {
			const icon = normalizeSessionIconValue(raw);
			if (!icon) return `icon must be a single emoji, a named icon (${SESSION_ICON_GLYPH_IDS.join(", ")}), or self-contained SVG markup/data URL up to 16 KiB`;
			next.icon = icon;
		}
	}
	if ("color" in patch) {
		const raw = patch.color;
		if (raw === null || raw === "") delete next.color;
		else if (raw !== void 0) {
			const color = normalizeSessionColorValue(raw);
			if (!color) return `color must be one of: ${SESSION_COLOR_IDS.join(", ")}`;
			next.color = color;
		}
	}
	if ("category" in patch) {
		const raw = patch.category;
		if (raw === null) delete next.category;
		else if (raw !== void 0) {
			const trimmed = normalizeOptionalString(raw) ?? "";
			if (!trimmed) return "invalid category: empty";
			if (trimmed.length > 512) return `invalid category: too long (max 512)`;
			next.category = trimmed;
		}
	}
	if ("boardFace" in patch && patch.boardFace !== void 0) next.boardFace = patch.boardFace;
	if ("boardPresentation" in patch) {
		if (patch.boardPresentation === null) delete next.boardPresentation;
		else if (patch.boardPresentation !== void 0) next.boardPresentation = patch.boardPresentation;
	}
}
//#endregion
//#region src/gateway/sessions-patch-lifecycle-flags.ts
function applySessionPatchLifecycleFlags(params) {
	const { patch, next, existingEntry, storeKey, now, archivedBy } = params;
	if ("archived" in patch) {
		if (patch.archived === true) {
			if (next.archivedAt === void 0) {
				next.archivedAt = now;
				next.archiveReason = "manual";
				if (archivedBy) next.archivedBy = archivedBy;
				else delete next.archivedBy;
			}
			delete next.pinnedAt;
			delete next.snoozedUntil;
			delete next.snoozedAt;
		} else {
			delete next.archivedAt;
			delete next.archivedBy;
			delete next.archiveReason;
		}
	}
	const pinnable = isPinnableSessionEntry(storeKey, next);
	if (!pinnable) delete next.pinnedAt;
	if ("snoozedUntil" in patch) {
		const snoozedUntil = patch.snoozedUntil;
		if (snoozedUntil === null) {
			delete next.snoozedUntil;
			delete next.snoozedAt;
		} else if (snoozedUntil !== void 0) {
			if (next.archivedAt !== void 0) return invalidSessionRequest("cannot snooze an archived session; restore it first").error;
			if (!pinnable) return invalidSessionRequest("cannot snooze a child session; snooze its parent session instead").error;
			if (!(snoozedUntil > now)) return invalidSessionRequest("snooze wake time must be in the future").error;
			if (next.snoozedUntil !== snoozedUntil) {
				next.snoozedUntil = snoozedUntil;
				next.snoozedAt = now;
			}
		}
	}
	if ("pinned" in patch) {
		if (patch.pinned === true) {
			if (next.archivedAt !== void 0) return invalidSessionRequest("cannot pin an archived session; restore it first").error;
			if (!pinnable) return invalidSessionRequest("cannot pin a child session; pin its parent session instead").error;
			next.pinnedAt ??= now;
			delete next.snoozedUntil;
			delete next.snoozedAt;
		} else delete next.pinnedAt;
	}
	if ("unread" in patch) {
		if (patch.unread === true) next.markedUnreadAt = Math.max(now, (existingEntry?.markedUnreadAt ?? 0) + 1);
		else {
			next.lastReadAt = now;
			delete next.markedUnreadAt;
			delete next.agentStatus;
		}
	}
}
//#endregion
//#region src/gateway/sessions-patch-subagent-policy.ts
function supportsSpawnPolicy(storeKey) {
	return isSubagentSessionKey(storeKey) || isAcpSessionKey(storeKey);
}
function unsupportedField(field, storeKey) {
	return supportsSpawnPolicy(storeKey) ? void 0 : `${field} is only supported for subagent:* or acp:* sessions`;
}
/** Applies the remaining public child-policy fields after lineage became creation-only. */
function applySessionsPatchSubagentPolicy(params) {
	const { existing, next, patch, storeKey } = params;
	if ("completionOwnerSessionKey" in patch) {
		const raw = patch.completionOwnerSessionKey;
		if (raw === null && existing?.completionOwnerSessionKey) return "completionOwnerSessionKey cannot be cleared once set";
		if (raw !== null && raw !== void 0) {
			const unsupported = unsupportedField("completionOwnerSessionKey", storeKey);
			if (unsupported) return unsupported;
			const normalized = normalizeOptionalString(raw);
			if (!normalized) return "invalid completionOwnerSessionKey: empty";
			if (existing?.completionOwnerSessionKey && existing.completionOwnerSessionKey !== normalized) return "completionOwnerSessionKey cannot be changed once set";
			next.completionOwnerSessionKey = normalized;
		}
	}
	if ("inheritedToolPolicyVersion" in patch) {
		const raw = patch.inheritedToolPolicyVersion;
		if (raw === null && existing?.inheritedToolPolicyVersion !== void 0) return "inheritedToolPolicyVersion cannot be cleared once set";
		if (raw !== null && raw !== void 0) {
			const unsupported = unsupportedField("inheritedToolPolicyVersion", storeKey);
			if (unsupported) return unsupported;
			if (raw !== 1) return "invalid inheritedToolPolicyVersion (expected 1)";
			next.inheritedToolPolicyVersion = 1;
		}
	}
	for (const field of ["inheritedToolDeny", "inheritedToolAllow"]) {
		if (!(field in patch)) continue;
		const raw = patch[field];
		if (raw === null) {
			delete next[field];
			continue;
		}
		if (raw === void 0) continue;
		if (!Array.isArray(raw)) return `invalid ${field} (use an array of tool names)`;
		const unsupported = unsupportedField(field, storeKey);
		if (unsupported) return unsupported;
		const normalized = field === "inheritedToolDeny" ? normalizeInheritedToolDenylist(raw) : normalizeInheritedToolAllowlist(raw);
		if (normalized.length > 0) next[field] = normalized;
		else delete next[field];
	}
}
//#endregion
//#region src/gateway/sessions-patch.ts
/** Stop at the first actual catalog use without committing or acquiring runtime effects. */
function prepareSessionsPatchEntry(params) {
	const projection = projectSessionPatchSteps(params);
	const first = projection.next();
	if (first.done) return {
		kind: "complete",
		result: first.value
	};
	return {
		kind: "model-catalog",
		finish: (catalog) => {
			const completed = projection.next(catalog);
			if (!completed.done) throw new Error("Session patch preparation requested the catalog more than once");
			return completed.value;
		}
	};
}
/** Project a validated gateway session patch for one session entry. */
async function projectSessionsPatchEntry(params) {
	const preparation = prepareSessionsPatchEntry(params);
	if (preparation.kind === "complete") return preparation.result;
	if (!params.loadGatewayModelCatalogSnapshot) return preparation.finish(void 0);
	const catalog = await params.loadGatewayModelCatalogSnapshot();
	return preparation.finish(catalog);
}
function* projectSessionPatchSteps(params) {
	const { cfg, storeKey, patch, creation } = params;
	if ("execSecurity" in patch || "execAsk" in patch) return invalidSessionRequest("execSecurity/execAsk are retired; set permissionMode (read-only|guarded|workspace|full) instead, or use /exec for this run only.");
	const harnessSessionError = params.existingEntry === void 0 && isAgentHarnessSessionKeyOwnedBy(storeKey, params.authorizedAgentHarnessId) ? void 0 : resolveMissingAgentHarnessSessionError(storeKey, params.existingEntry);
	if (harnessSessionError) return invalidSessionRequest(harnessSessionError);
	if (typeof patch.archived === "boolean" || "snoozedUntil" in patch) {
		if (!params.existingEntry?.sessionId) return invalidSessionRequest(`session not found: ${storeKey}`);
		if (patch.expectedSessionId === void 0) return invalidSessionRequest(`expectedSessionId required for session lifecycle patch: ${storeKey}`);
	}
	if (("model" in patch || "agentRuntime" in patch) && isModelSelectionLocked(params.existingEntry)) return invalidSessionRequest(MODEL_SELECTION_LOCKED_MESSAGE);
	if (typeof patch.agentRuntime === "string" && typeof patch.model !== "string") return invalidSessionRequest("agentRuntime requires an explicit canonical provider/model selection");
	const now = Date.now();
	const parsedAgent = parseAgentSessionKey(storeKey);
	const sessionAgentId = normalizeAgentId(params.agentId ?? parsedAgent?.agentId ?? resolveDefaultAgentId(cfg));
	let resolvedDefault = resolveDefaultModelForAgent({
		cfg,
		agentId: sessionAgentId
	});
	const subagentModelHint = isSubagentSessionKey(storeKey) ? resolveSubagentConfiguredModelSelection({
		cfg,
		agentId: sessionAgentId
	}) : void 0;
	const resolveThinkingRuntime = (provider, model, entry) => {
		const acpMeta = readAcpSessionMetaForEntry({
			sessionKey: storeKey,
			agentId: sessionAgentId,
			entry
		});
		return params.preparedAgentRuntime ?? acpMeta?.backend ?? resolveEffectiveAgentRuntime({
			cfg,
			provider,
			modelId: model,
			agentId: sessionAgentId,
			sessionKey: storeKey,
			sessionEntry: entry
		});
	};
	let loadedModelCatalog;
	let validateModelSelection;
	let catalogPrepared = false;
	function* loadPreparedModelCatalogForPatch() {
		if (!catalogPrepared) {
			loadedModelCatalog = yield;
			catalogPrepared = true;
		}
		return loadedModelCatalog?.entries;
	}
	function* loadThinkingProfileForPatch(provider, model, entry) {
		const catalog = yield* loadPreparedModelCatalogForPatch();
		const agentRuntime = resolveThinkingRuntime(provider, model, entry);
		const logical = catalog ? findModelCatalogEntry(catalog, {
			provider,
			modelId: model
		}) : void 0;
		const selected = logical && loadedModelCatalog ? selectModelCatalogRuntimeEntry({
			entry: logical,
			routeVariants: loadedModelCatalog.routeVariants,
			runtimeId: agentRuntime
		}).entry : void 0;
		return resolveThinkingProfile({
			provider,
			model,
			catalog: selected ? [selected] : catalog,
			agentRuntime
		});
	}
	const existing = params.existingEntry && projectCanonicalSessionEntryShape({ ...params.existingEntry });
	const nextUpdatedAt = isSessionUnreadAckOnlyPatch(patch) ? existing?.updatedAt ?? now : Math.max(existing?.updatedAt ?? 0, now);
	const next = {
		...existing,
		sessionId: existing?.sessionId || randomUUID(),
		...existing?.sessionId ? {} : { lifecycleRevision: randomUUID() },
		updatedAt: nextUpdatedAt,
		...params.preparedSessionRoot ? { sessionRoot: params.preparedSessionRoot } : {},
		...creation && params.existingEntry === void 0 ? buildSessionCreationStamp(creation) : {}
	};
	if (existing && !existing.sessionId) {
		delete next.label;
		delete next.autoLabel;
		delete next.category;
		delete next.displayName;
	}
	function applyNormalizedPreference(key, normalize, error) {
		const raw = patch[key];
		if (raw === null) delete next[key];
		else if (raw !== void 0) {
			const value = normalize(raw);
			if (value === void 0) return error;
			next[key] = value;
		}
	}
	const subagentPolicyError = applySessionsPatchSubagentPolicy({
		existing,
		next,
		patch,
		storeKey
	});
	if (subagentPolicyError) return invalidSessionRequest(subagentPolicyError);
	const displayMetadataError = applySessionsPatchDisplayMetadata({
		patch,
		next,
		isLabelInUse: params.isLabelInUse
	});
	if (displayMetadataError) return invalidSessionRequest(displayMetadataError);
	if ("statusNote" in patch || "attention" in patch || "ttlMinutes" in patch) {
		const rawNote = patch.statusNote;
		const rawAttention = patch.attention;
		const ttlMinutes = patch.ttlMinutes;
		if (ttlMinutes !== void 0 && (!Number.isInteger(ttlMinutes) || ttlMinutes < 1 || ttlMinutes > 120)) return invalidSessionRequest(`invalid ttlMinutes (use 1-120)`);
		if (rawNote === null || rawAttention === null) {
			if (rawNote !== void 0 && rawNote !== null || rawAttention !== void 0 && rawAttention !== null) return invalidSessionRequest("cannot clear and set agent status in the same patch");
			delete next.agentStatus;
		} else {
			const current = resolveActiveSessionAgentStatus(next.agentStatus, now);
			const note = rawNote === void 0 ? current?.note : sanitizeSessionAgentStatusNote(rawNote);
			if (!note) return invalidSessionRequest("statusNote required before setting attention or ttlMinutes");
			if (rawAttention !== void 0 && !isSessionAgentAttentionIconId(rawAttention)) return invalidSessionRequest("invalid attention icon");
			const attention = rawAttention ?? current?.attention;
			next.agentStatus = {
				note,
				expiresAt: sessionAgentStatusExpiresAt(now, ttlMinutes),
				...attention ? { attention } : {}
			};
		}
	}
	if (patch.snoozedUntil !== void 0 && patch.snoozedUntil !== null) {
		const protectedError = resolveProtectedSessionVisibilityError(cfg, storeKey, "snooze");
		if (protectedError) return {
			ok: false,
			error: protectedError
		};
	}
	const lifecycleFlagsError = applySessionPatchLifecycleFlags({
		patch,
		next,
		existingEntry: params.existingEntry,
		storeKey,
		now,
		archivedBy: params.archivedBy
	});
	if (lifecycleFlagsError) return {
		ok: false,
		error: lifecycleFlagsError
	};
	const rawThinking = patch.thinkingLevel;
	if (rawThinking === null) delete next.thinkingLevel;
	else if (rawThinking !== void 0) {
		const normalized = normalizeThinkLevel(rawThinking);
		if (!normalized) {
			const profile = yield* loadThinkingProfileForPatch(normalizeOptionalString(existing?.providerOverride) || resolvedDefault.provider, normalizeOptionalString(existing?.modelOverride) || resolvedDefault.model, existing);
			return invalidSessionRequest(`invalid thinkingLevel (use ${profile.levels.map(({ label }) => label).join("|")})`);
		}
		next.thinkingLevel = normalized;
	}
	const fastModeError = applyNormalizedPreference("fastMode", normalizeFastMode, "invalid fastMode (use true, false, \"auto\", or \"ultrafast\")");
	if (fastModeError) return invalidSessionRequest(fastModeError);
	if ("toolOverrides" in patch) {
		const raw = patch.toolOverrides;
		if (raw === null) delete next.toolOverrides;
		else if (raw !== void 0) {
			const normalized = normalizeSessionToolOverrides(raw);
			if (normalized) next.toolOverrides = normalized;
			else delete next.toolOverrides;
		}
	}
	if ("verboseLevel" in patch) {
		const parsed = parseVerboseOverride(patch.verboseLevel);
		if (!parsed.ok) return invalidSessionRequest(parsed.error);
		applyVerboseOverride(next, parsed.value);
	}
	if ("traceLevel" in patch) {
		const parsed = parseTraceOverride(patch.traceLevel);
		if (!parsed.ok) return invalidSessionRequest(parsed.error);
		applyTraceOverride(next, parsed.value);
	}
	const preferenceError = applyNormalizedPreference("reasoningLevel", normalizeReasoningLevel, "invalid reasoningLevel (use \"on\"|\"off\"|\"stream\")") ?? applyNormalizedPreference("responseUsage", normalizeUsageDisplay, "invalid responseUsage (use \"off\"|\"tokens\"|\"full\")") ?? applyNormalizedPreference("elevatedLevel", normalizeElevatedLevel, "invalid elevatedLevel (use \"on\"|\"off\"|\"ask\"|\"full\")");
	if (preferenceError) return invalidSessionRequest(preferenceError);
	const executionError = applySessionExecutionSettings(next, patch);
	if (executionError) return invalidSessionRequest(executionError);
	if ("agentRuntime" in patch && readAcpSessionMetaForEntry({
		sessionKey: storeKey,
		agentId: sessionAgentId,
		entry: existing
	})) return invalidSessionRequest("Runtime selection is owned by this ACP session.");
	if (patch.agentRuntime === null) applyModelRuntimeDirective(next, { kind: "clear" });
	if (typeof patch.nativeRuntimeConsent === "string" && typeof patch.model !== "string") yield* loadPreparedModelCatalogForPatch();
	if ("model" in patch) {
		const statusModelPatch = isSessionStatusModelPatchOrigin();
		const agentModelFallback = isAgentSessionModelPatchOrigin() ? next.modelFallback?.source === "agent-patch" ? {
			...next.modelFallback,
			ts: Math.max(now, next.modelFallback.ts + 1)
		} : snapshotAgentModelFallback(cfg, next, sessionAgentId, now) : void 0;
		if (!statusModelPatch) delete next.modelFallback;
		const raw = patch.model;
		let selection;
		if (raw === null) selection = {
			...resolvedDefault,
			isDefault: true
		};
		else if (raw !== void 0) {
			const trimmed = normalizeOptionalString(raw) ?? "";
			if (!trimmed) return invalidSessionRequest("invalid model: empty");
			const catalog = yield* loadPreparedModelCatalogForPatch();
			if (!catalog) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "model catalog is still loading; retry in a few seconds")
			};
			const resolved = resolveSessionPatchModelSelection({
				cfg,
				agentId: sessionAgentId,
				catalog,
				raw: trimmed,
				defaultProvider: statusModelPatch && next.providerOverride?.trim() || resolvedDefault.provider,
				defaultModel: resolvedDefault.model,
				subagentModelHint,
				preparedModelSelection: params.preparedModelSelection
			});
			if (!resolved.ok) return invalidSessionRequest(resolved.error);
			selection = resolved;
		}
		if (selection) {
			const prepared = prepareSessionPatchModelSelection({
				cfg,
				agentId: sessionAgentId,
				selection,
				resetToDefault: raw === null,
				operatorAuthority: params.operatorAuthority
			});
			if (!prepared.ok) return prepared;
			selection = prepared.selection;
			validateModelSelection = params.operatorAuthority ? prepared.validate : void 0;
			if (raw === null) resolvedDefault = selection;
			if (typeof patch.agentRuntime === "string" && splitTrailingAuthProfile(raw ?? "").model !== `${selection.provider}/${selection.model}`) return invalidSessionRequest("agentRuntime requires an explicit canonical provider/model selection");
			const runtime = resolveModelRuntimeDirective({
				cfg,
				provider: selection.provider,
				rawRuntime: patch.agentRuntime ?? void 0,
				sessionEntry: next
			});
			if (runtime.kind === "invalid") return invalidSessionRequest(runtime.errorText);
			if (typeof patch.agentRuntime === "string" && (runtime.kind !== "set" || runtime.runtime !== patch.agentRuntime)) return invalidSessionRequest("Use a canonical agentRuntime id, or null to follow configured routing");
			applyModelRuntimeDirective(next, runtime);
			if (selection.profile && isUserModelAuthProfileId(selection.profile)) {
				if (params.personalModelSelection?.authProfileId !== selection.profile) return {
					ok: false,
					error: errorShape(ErrorCodes.FORBIDDEN, "Choose your personal account from an identified Gateway connection.")
				};
				params.personalModelSelection.assertCurrent();
			}
			const harnessSelection = {
				provider: selection.provider,
				modelId: selection.model,
				runtime: params.preparedAgentRuntime ?? resolveEffectiveAgentRuntime({
					cfg,
					provider: selection.provider,
					modelId: selection.model,
					agentId: sessionAgentId,
					sessionKey: storeKey,
					sessionEntry: next,
					mode: "execution"
				}),
				agentId: sessionAgentId
			};
			if (!readAcpSessionMetaForEntry({
				sessionKey: storeKey,
				agentId: sessionAgentId,
				entry: next
			}) && requiresAgentHarnessPluginSelection(harnessSelection, cfg) && resolveAgentHarnessOwnerPluginIds({
				...harnessSelection,
				config: cfg,
				workspaceDir: resolveAgentWorkspaceDir(cfg, sessionAgentId)
			}).length === 0) return invalidSessionRequest(`Model ${selection.provider}/${selection.model} requires agent harness "${harnessSelection.runtime}", but no enabled plugin provides it. Install and enable its plugin, restart the Gateway, then select the model again.`);
			applyModelOverrideWithAuthProfileCompatibility({
				cfg,
				agentDir: resolveAgentDir(cfg, sessionAgentId),
				entry: next,
				currentProvider: next.providerOverride ?? next.modelProvider ?? resolvedDefault.provider,
				selection,
				explicitDefaultSelection: raw === null || statusModelPatch && selection.isDefault,
				profileOverride: selection.profile,
				...params.providerAuthMetadataSnapshot ? { metadataSnapshot: params.providerAuthMetadataSnapshot } : {},
				markLiveSwitchPending: statusModelPatch || raw !== null
			});
			if (raw === null && !statusModelPatch) delete next.liveModelSwitchPending;
		}
		if (agentModelFallback) next.modelFallback = agentModelFallback;
	}
	if ("thinkingLevel" in patch || "model" in patch || "agentRuntime" in patch) {
		const effectiveProvider = next.providerOverride ?? resolvedDefault.provider;
		const effectiveModel = next.modelOverride ?? resolvedDefault.model;
		const thinkingLevel = normalizeThinkLevel(next.thinkingLevel);
		if (!thinkingLevel) delete next.thinkingLevel;
		else {
			const profile = yield* loadThinkingProfileForPatch(effectiveProvider, effectiveModel, next);
			if ("thinkingLevel" in patch && !profile.levels.some(({ id }) => id === thinkingLevel)) return invalidSessionRequest(`thinkingLevel "${thinkingLevel}" is not supported for ${effectiveProvider}/${effectiveModel} (use ${profile.levels.map(({ label }) => label).join("|")})`);
			next.thinkingLevel = resolveSupportedThinkingLevelFromProfile(profile, thinkingLevel);
		}
	}
	const contextWindowPatch = yield* applySessionContextWindowPatch({
		defaultModel: resolvedDefault.model,
		defaultProvider: resolvedDefault.provider,
		loadModelCatalog: loadPreparedModelCatalogForPatch,
		runtimeId: resolveThinkingRuntime,
		routeVariants: () => loadedModelCatalog?.routeVariants,
		next,
		patch
	});
	if (!contextWindowPatch.ok) return invalidSessionRequest(contextWindowPatch.error);
	if (next.modelFallback?.source === "agent-patch" && !("model" in patch) && ("thinkingLevel" in patch || "contextWindow" in patch)) next.modelFallback = {
		...next.modelFallback,
		..."thinkingLevel" in patch ? { prevThinkingLevel: next.thinkingLevel } : {},
		..."contextWindow" in patch ? { prevContextWindow: next.contextWindow } : {}
	};
	const deliveryPreferenceError = applyNormalizedPreference("sendPolicy", normalizeSendPolicy, "invalid sendPolicy (use \"allow\"|\"deny\")") ?? applyNormalizedPreference("groupActivation", normalizeGroupActivation, "invalid groupActivation (use \"mention\"|\"always\")");
	if (deliveryPreferenceError) return invalidSessionRequest(deliveryPreferenceError);
	if ("agentRuntime" in patch && existing?.agentRuntimeOverride !== next.agentRuntimeOverride) {
		delete next.contextTokens;
		delete next.contextTokensSource;
		delete next.contextBudgetStatus;
		next.liveModelSwitchPending = true;
	}
	if (!existing?.sessionId) delete next.liveModelSwitchPending;
	return {
		ok: true,
		entry: next,
		...validateModelSelection ? { validateModelSelection } : {}
	};
}
//#endregion
export { projectSessionsPatchEntry as n, session_unread_ack_exports as r, prepareSessionsPatchEntry as t };
