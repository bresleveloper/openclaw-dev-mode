import { c as normalizeOptionalString, i as normalizeFastMode, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import "./agent-scope-B2Pk_xhT.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, n as isAcpSessionKey } from "./session-key-utils-A-JGvyXu.js";
import { b as toAgentStoreSessionKey, p as resolveAgentIdFromSessionKey, u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-BMy8GnRz.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { n as isThinkingLevelSupported, o as resolveSupportedThinkingLevel, t as formatThinkingLevels } from "./thinking-BcvxxriC.js";
import { a as normalizeElevatedLevel, l as normalizeUsageDisplay, o as normalizeReasoningLevel, s as normalizeThinkLevel } from "./thinking.shared-BWnbgBUO.js";
import { i as hasInternalHookListeners, m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks-CpcP-fFV.js";
import { r as resolveAgentMainSessionKey } from "./main-session-D7Jmp9DO.js";
import { ct as resolveSessionStoreAgentId, lt as resolveSessionStoreKey } from "./store-Cvp82S16.js";
import { f as createSessionEntryWithTranscript } from "./session-accessor-CwhXEUId.js";
import { a as resolveAllowedModelRef, c as resolveDefaultModelForAgent, p as resolveSubagentConfiguredModelSelection } from "./model-selection-CFL1kjzt.js";
import { i as readAcpSessionMetaForEntry } from "./session-meta-BSnnGiFM.js";
import { l as isEmbeddedAgentRunActive } from "./runs-CGcPGyzc.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-DHKmmAgL.js";
import { g as resolveGatewaySessionStoreTarget, u as loadSessionEntry } from "./session-utils-D5cDecWw.js";
import { t as normalizeSendPolicy } from "./send-policy-dIsJy4mX.js";
import { h as normalizeInheritedToolDenylist, m as normalizeInheritedToolAllowlist } from "./subagent-capabilities-CsP4k-tO.js";
import { w as normalizeExecTarget } from "./exec-approvals-BIKWP8_V.js";
import { r as parseSessionLabel } from "./openclaw-tools-B-W5sEDk.js";
import "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import { t as applyModelOverrideToSessionEntry } from "./model-overrides-BfccGJ_e.js";
import { n as forkSessionFromParent, r as resolveParentForkDecision } from "./session-fork-DfIJcRuB.js";
import "./embedded-agent-rBjsQK7b.js";
import { o as isSessionWorkAdmissionActive, s as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-DfdITEs1.js";
import { t as normalizeGroupActivation } from "./group-activation-MKTJBUwi.js";
import { i as parseVerboseOverride, n as applyVerboseOverride, r as parseTraceOverride, t as applyTraceOverride } from "./level-overrides-DUUBq8xq.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/sessions-patch.ts
function invalid(message) {
	return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, message)
	};
}
function normalizeExecSecurity(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (normalized === "deny" || normalized === "allowlist" || normalized === "full") return normalized;
}
function normalizeExecAsk(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (normalized === "off" || normalized === "on-miss" || normalized === "always") return normalized;
}
function shouldPreserveSessionAuthProfileOverride(params) {
	const profileOverride = normalizeOptionalString(params.entry.authProfileOverride);
	if (!profileOverride) return false;
	const provider = normalizeOptionalLowercaseString(params.provider);
	if (!provider) return false;
	const resolvesToTargetProvider = (rawProvider) => {
		const candidate = normalizeOptionalLowercaseString(rawProvider);
		if (!candidate) return false;
		return resolveProviderIdForAuth(candidate, { config: params.cfg }) === resolveProviderIdForAuth(provider, { config: params.cfg });
	};
	const delimiterIndex = profileOverride.indexOf(":");
	if (delimiterIndex < 0) return resolvesToTargetProvider(params.currentProvider);
	const profileProvider = normalizeOptionalLowercaseString(profileOverride.slice(0, delimiterIndex));
	if (!profileProvider) return false;
	return resolvesToTargetProvider(profileProvider);
}
function supportsSpawnLineage(storeKey) {
	return isSubagentSessionKey(storeKey) || isAcpSessionKey(storeKey);
}
function normalizeSubagentRole(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (normalized === "orchestrator" || normalized === "leaf") return normalized;
}
function normalizeSubagentControlScope(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (normalized === "children" || normalized === "none") return normalized;
}
/** Project a validated gateway session patch for one session entry. */
async function projectSessionsPatchEntry(params) {
	const { cfg, storeKey, patch } = params;
	const now = Date.now();
	const parsedAgent = parseAgentSessionKey(storeKey);
	const sessionAgentId = normalizeAgentId(params.agentId ?? parsedAgent?.agentId ?? resolveDefaultAgentId(cfg));
	const resolvedDefault = resolveDefaultModelForAgent({
		cfg,
		agentId: sessionAgentId
	});
	const subagentModelHint = isSubagentSessionKey(storeKey) ? resolveSubagentConfiguredModelSelection({
		cfg,
		agentId: sessionAgentId
	}) : void 0;
	const resolveThinkingRuntime = (provider, model, entry) => {
		return readAcpSessionMetaForEntry({
			sessionKey: storeKey,
			entry
		})?.backend ?? resolveEffectiveAgentRuntime({
			cfg,
			provider,
			modelId: model,
			agentId: sessionAgentId,
			sessionKey: storeKey,
			sessionEntry: entry
		});
	};
	let loadedModelCatalog;
	const loadModelCatalogForPatch = async () => {
		if (loadedModelCatalog) return loadedModelCatalog;
		if (!params.loadGatewayModelCatalog) return;
		const catalog = await params.loadGatewayModelCatalog();
		loadedModelCatalog = Array.isArray(catalog) ? catalog : [];
		return loadedModelCatalog;
	};
	const existing = params.existingEntry;
	const next = existing?.sessionId ? {
		...existing,
		updatedAt: Math.max(existing.updatedAt ?? 0, now)
	} : {
		...existing,
		sessionId: randomUUID(),
		sessionFile: void 0,
		updatedAt: Math.max(existing?.updatedAt ?? 0, now)
	};
	if (existing && !existing.sessionId) {
		delete next.label;
		delete next.category;
		delete next.displayName;
	}
	const checkSpawnLineage = (field) => supportsSpawnLineage(storeKey) ? null : invalid(`${field} is only supported for subagent:* or acp:* sessions`);
	const applyImmutableString = (field, checkLineageBeforeEmpty) => {
		if (!(field in patch)) return null;
		const raw = patch[field];
		if (raw === null) return existing?.[field] ? invalid(`${field} cannot be cleared once set`) : null;
		if (raw === void 0) return null;
		const earlyLineage = checkLineageBeforeEmpty ? checkSpawnLineage(field) : null;
		if (earlyLineage) return earlyLineage;
		const trimmed = normalizeOptionalString(raw) ?? "";
		if (!trimmed) return invalid(`invalid ${field}: empty`);
		const lateLineage = checkLineageBeforeEmpty ? null : checkSpawnLineage(field);
		if (lateLineage) return lateLineage;
		if (existing?.[field] && existing[field] !== trimmed) return invalid(`${field} cannot be changed once set`);
		next[field] = trimmed;
		return null;
	};
	const applyImmutableNormalized = (field, normalize, invalidMessage) => {
		if (!(field in patch)) return null;
		const raw = patch[field];
		if (raw === null) return existing?.[field] ? invalid(`${field} cannot be cleared once set`) : null;
		if (raw === void 0) return null;
		const lineage = checkSpawnLineage(field);
		if (lineage) return lineage;
		const normalized = normalize(raw);
		if (!normalized) return invalid(invalidMessage);
		if (existing?.[field] && existing[field] !== normalized) return invalid(`${field} cannot be changed once set`);
		next[field] = normalized;
		return null;
	};
	for (const fieldParams of [
		{
			field: "spawnedBy",
			checkLineageBeforeEmpty: false
		},
		{
			field: "spawnedWorkspaceDir",
			checkLineageBeforeEmpty: true
		},
		{
			field: "spawnedCwd",
			checkLineageBeforeEmpty: true
		}
	]) {
		const result = applyImmutableString(fieldParams.field, fieldParams.checkLineageBeforeEmpty);
		if (result) return result;
	}
	if ("spawnDepth" in patch) {
		const raw = patch.spawnDepth;
		if (raw === null) {
			if (typeof existing?.spawnDepth === "number") return invalid("spawnDepth cannot be cleared once set");
		} else if (raw !== void 0) {
			if (!supportsSpawnLineage(storeKey)) return invalid("spawnDepth is only supported for subagent:* or acp:* sessions");
			const numeric = raw;
			if (!Number.isInteger(numeric) || numeric < 0) return invalid("invalid spawnDepth (use an integer >= 0)");
			const normalized = numeric;
			if (typeof existing?.spawnDepth === "number" && existing.spawnDepth !== normalized) return invalid("spawnDepth cannot be changed once set");
			next.spawnDepth = normalized;
		}
	}
	for (const fieldParams of [{
		field: "subagentRole",
		normalize: normalizeSubagentRole,
		invalidMessage: "invalid subagentRole (use \"orchestrator\" or \"leaf\")"
	}, {
		field: "subagentControlScope",
		normalize: normalizeSubagentControlScope,
		invalidMessage: "invalid subagentControlScope (use \"children\" or \"none\")"
	}]) {
		const result = applyImmutableNormalized(fieldParams.field, fieldParams.normalize, fieldParams.invalidMessage);
		if (result) return result;
	}
	if ("inheritedToolDeny" in patch) {
		const raw = patch.inheritedToolDeny;
		if (raw === null) delete next.inheritedToolDeny;
		else if (raw !== void 0) {
			if (!Array.isArray(raw)) return invalid("invalid inheritedToolDeny (use an array of tool names)");
			if (!supportsSpawnLineage(storeKey)) return invalid("inheritedToolDeny is only supported for subagent:* or acp:* sessions");
			const inheritedToolDeny = normalizeInheritedToolDenylist(raw);
			if (inheritedToolDeny.length > 0) next.inheritedToolDeny = inheritedToolDeny;
			else delete next.inheritedToolDeny;
		}
	}
	if ("inheritedToolAllow" in patch) {
		const raw = patch.inheritedToolAllow;
		if (raw === null) delete next.inheritedToolAllow;
		else if (raw !== void 0) {
			if (!Array.isArray(raw)) return invalid("invalid inheritedToolAllow (use an array of tool names)");
			if (!supportsSpawnLineage(storeKey)) return invalid("inheritedToolAllow is only supported for subagent:* or acp:* sessions");
			const inheritedToolAllow = normalizeInheritedToolAllowlist(raw);
			if (inheritedToolAllow.length > 0) next.inheritedToolAllow = inheritedToolAllow;
			else delete next.inheritedToolAllow;
		}
	}
	if ("label" in patch) {
		const raw = patch.label;
		if (raw === null) delete next.label;
		else if (raw !== void 0) {
			const parsed = parseSessionLabel(raw);
			if (!parsed.ok) return invalid(parsed.error);
			for (const { sessionKey, entry } of params.entries) {
				if (sessionKey === storeKey) continue;
				if (entry?.label === parsed.label) return invalid(`label already in use: ${parsed.label}`);
			}
			next.label = parsed.label;
		}
	}
	if ("category" in patch) {
		const raw = patch.category;
		if (raw === null) delete next.category;
		else if (raw !== void 0) {
			const trimmed = normalizeOptionalString(raw) ?? "";
			if (!trimmed) return invalid("invalid category: empty");
			if (trimmed.length > 512) return invalid(`invalid category: too long (max 512)`);
			next.category = trimmed;
		}
	}
	if ("archived" in patch) if (patch.archived === true) {
		next.archivedAt ??= now;
		delete next.pinnedAt;
	} else delete next.archivedAt;
	if ("pinned" in patch) if (patch.pinned === true) {
		if (next.archivedAt !== void 0) return invalid("cannot pin an archived session; restore it first");
		next.pinnedAt ??= now;
	} else delete next.pinnedAt;
	if ("unread" in patch) if (patch.unread === true) next.markedUnreadAt = now;
	else {
		next.lastReadAt = now;
		delete next.markedUnreadAt;
	}
	if ("thinkingLevel" in patch) {
		const raw = patch.thinkingLevel;
		if (raw === null) delete next.thinkingLevel;
		else if (raw !== void 0) {
			const normalized = normalizeThinkLevel(raw);
			if (!normalized) {
				const hintProvider = normalizeOptionalString(existing?.providerOverride) || resolvedDefault.provider;
				const hintModel = normalizeOptionalString(existing?.modelOverride) || resolvedDefault.model;
				return invalid(`invalid thinkingLevel (use ${formatThinkingLevels(hintProvider, hintModel, "|", await loadModelCatalogForPatch(), resolveThinkingRuntime(hintProvider, hintModel, existing))})`);
			}
			next.thinkingLevel = normalized;
		}
	}
	if ("fastMode" in patch) {
		const raw = patch.fastMode;
		if (raw === null) delete next.fastMode;
		else if (raw !== void 0) {
			const normalized = normalizeFastMode(raw);
			if (normalized === void 0) return invalid("invalid fastMode (use true, false, or \"auto\")");
			next.fastMode = normalized;
		}
	}
	if ("verboseLevel" in patch) {
		const raw = patch.verboseLevel;
		const parsed = parseVerboseOverride(raw);
		if (!parsed.ok) return invalid(parsed.error);
		applyVerboseOverride(next, parsed.value);
	}
	if ("traceLevel" in patch) {
		const raw = patch.traceLevel;
		const parsed = parseTraceOverride(raw);
		if (!parsed.ok) return invalid(parsed.error);
		applyTraceOverride(next, parsed.value);
	}
	if ("reasoningLevel" in patch) {
		const raw = patch.reasoningLevel;
		if (raw === null) delete next.reasoningLevel;
		else if (raw !== void 0) {
			const normalized = normalizeReasoningLevel(raw);
			if (!normalized) return invalid("invalid reasoningLevel (use \"on\"|\"off\"|\"stream\")");
			next.reasoningLevel = normalized;
		}
	}
	if ("responseUsage" in patch) {
		const raw = patch.responseUsage;
		if (raw === null) delete next.responseUsage;
		else if (raw !== void 0) {
			const normalized = normalizeUsageDisplay(raw);
			if (!normalized) return invalid("invalid responseUsage (use \"off\"|\"tokens\"|\"full\")");
			next.responseUsage = normalized;
		}
	}
	if ("elevatedLevel" in patch) {
		const raw = patch.elevatedLevel;
		if (raw === null) delete next.elevatedLevel;
		else if (raw !== void 0) {
			const normalized = normalizeElevatedLevel(raw);
			if (!normalized) return invalid("invalid elevatedLevel (use \"on\"|\"off\"|\"ask\"|\"full\")");
			next.elevatedLevel = normalized;
		}
	}
	if ("execHost" in patch) {
		const raw = patch.execHost;
		if (raw === null) delete next.execHost;
		else if (raw !== void 0) {
			const normalized = normalizeExecTarget(raw) ?? void 0;
			if (!normalized) return invalid("invalid execHost (use \"auto\"|\"sandbox\"|\"gateway\"|\"node\")");
			next.execHost = normalized;
		}
	}
	if ("execSecurity" in patch) {
		const raw = patch.execSecurity;
		if (raw === null) delete next.execSecurity;
		else if (raw !== void 0) {
			const normalized = normalizeExecSecurity(raw);
			if (!normalized) return invalid("invalid execSecurity (use \"deny\"|\"allowlist\"|\"full\")");
			next.execSecurity = normalized;
		}
	}
	if ("execAsk" in patch) {
		const raw = patch.execAsk;
		if (raw === null) delete next.execAsk;
		else if (raw !== void 0) {
			const normalized = normalizeExecAsk(raw);
			if (!normalized) return invalid("invalid execAsk (use \"off\"|\"on-miss\"|\"always\")");
			next.execAsk = normalized;
		}
	}
	if ("execNode" in patch) {
		const raw = patch.execNode;
		if (raw === null) delete next.execNode;
		else if (raw !== void 0) {
			const trimmed = normalizeOptionalString(raw) ?? "";
			if (!trimmed) return invalid("invalid execNode: empty");
			next.execNode = trimmed;
		}
	}
	if ("model" in patch) {
		const raw = patch.model;
		if (raw === null) {
			applyModelOverrideToSessionEntry({
				entry: next,
				selection: {
					provider: resolvedDefault.provider,
					model: resolvedDefault.model,
					isDefault: true
				},
				preserveAuthProfileOverride: shouldPreserveSessionAuthProfileOverride({
					cfg,
					currentProvider: next.providerOverride ?? next.modelProvider ?? resolvedDefault.provider,
					entry: next,
					provider: resolvedDefault.provider
				})
			});
			delete next.liveModelSwitchPending;
		} else if (raw !== void 0) {
			const trimmed = normalizeOptionalString(raw) ?? "";
			if (!trimmed) return invalid("invalid model: empty");
			if (!params.loadGatewayModelCatalog) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "model catalog unavailable")
			};
			const catalog = await loadModelCatalogForPatch();
			if (!catalog) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "model catalog unavailable")
			};
			const { model: modelWithoutProfile, profile: trailingProfile } = splitTrailingAuthProfile(trimmed);
			const resolved = resolveAllowedModelRef({
				cfg,
				catalog,
				raw: modelWithoutProfile,
				defaultProvider: resolvedDefault.provider,
				defaultModel: subagentModelHint ?? resolvedDefault.model
			});
			if ("error" in resolved) return invalid(resolved.error);
			const isDefault = resolved.ref.provider === resolvedDefault.provider && resolved.ref.model === resolvedDefault.model;
			applyModelOverrideToSessionEntry({
				entry: next,
				selection: {
					provider: resolved.ref.provider,
					model: resolved.ref.model,
					isDefault
				},
				profileOverride: trailingProfile || void 0,
				preserveAuthProfileOverride: shouldPreserveSessionAuthProfileOverride({
					cfg,
					currentProvider: next.providerOverride ?? next.modelProvider ?? resolvedDefault.provider,
					entry: next,
					provider: resolved.ref.provider
				}),
				markLiveSwitchPending: true
			});
		}
	}
	if (next.thinkingLevel && ("thinkingLevel" in patch || "model" in patch)) {
		const effectiveProvider = next.providerOverride ?? resolvedDefault.provider;
		const effectiveModel = next.modelOverride ?? resolvedDefault.model;
		const thinkingLevel = normalizeThinkLevel(next.thinkingLevel);
		const thinkingCatalog = await loadModelCatalogForPatch();
		if (!thinkingLevel) delete next.thinkingLevel;
		else {
			const thinkingRuntime = resolveThinkingRuntime(effectiveProvider, effectiveModel, next);
			if (!isThinkingLevelSupported({
				provider: effectiveProvider,
				model: effectiveModel,
				level: thinkingLevel,
				catalog: thinkingCatalog,
				agentRuntime: thinkingRuntime
			})) {
				if ("thinkingLevel" in patch) return invalid(`thinkingLevel "${thinkingLevel}" is not supported for ${effectiveProvider}/${effectiveModel} (use ${formatThinkingLevels(effectiveProvider, effectiveModel, "|", thinkingCatalog, thinkingRuntime)})`);
				next.thinkingLevel = resolveSupportedThinkingLevel({
					provider: effectiveProvider,
					model: effectiveModel,
					level: thinkingLevel,
					catalog: thinkingCatalog,
					agentRuntime: thinkingRuntime
				});
			}
		}
	}
	if ("sendPolicy" in patch) {
		const raw = patch.sendPolicy;
		if (raw === null) delete next.sendPolicy;
		else if (raw !== void 0) {
			const normalized = normalizeSendPolicy(raw);
			if (!normalized) return invalid("invalid sendPolicy (use \"allow\"|\"deny\")");
			next.sendPolicy = normalized;
		}
	}
	if ("groupActivation" in patch) {
		const raw = patch.groupActivation;
		if (raw === null) delete next.groupActivation;
		else if (raw !== void 0) {
			const normalized = normalizeGroupActivation(raw);
			if (!normalized) return invalid("invalid groupActivation (use \"mention\"|\"always\")");
			next.groupActivation = normalized;
		}
	}
	return {
		ok: true,
		entry: next
	};
}
/** Apply a validated gateway session patch to an in-memory session store entry. */
async function applySessionsPatchToStore(params) {
	const projected = await projectSessionsPatchEntry({
		cfg: params.cfg,
		entries: Object.entries(params.store).map(([sessionKey, entry]) => ({
			sessionKey,
			entry
		})),
		existingEntry: params.store[params.storeKey],
		storeKey: params.storeKey,
		agentId: params.agentId,
		patch: params.patch,
		loadGatewayModelCatalog: params.loadGatewayModelCatalog
	});
	if (projected.ok) params.store[params.storeKey] = projected.entry;
	return projected;
}
//#endregion
//#region src/gateway/session-create-service.ts
const loadSessionLifecycleRuntime = createLazyRuntimeModule(() => import("./sessions.runtime.js"));
function resolveRequestedSessionAgentId(cfg, key, explicitAgentId) {
	const canonicalKey = resolveSessionStoreKey({
		cfg,
		sessionKey: key
	});
	const parsed = parseAgentSessionKey(key);
	const requestedAgentId = normalizeOptionalString(explicitAgentId);
	if (requestedAgentId) {
		const agentId = normalizeAgentId(requestedAgentId);
		if (!listAgentIds(cfg).includes(agentId)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${explicitAgentId}"`)
		};
		if (parsed?.agentId && normalizeAgentId(parsed.agentId) !== agentId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId")
		};
		if (canonicalKey !== "global") {
			if ((parsed?.agentId ? normalizeAgentId(parsed.agentId) : normalizeAgentId(resolveSessionStoreAgentId(cfg, canonicalKey))) !== agentId) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId")
			};
		}
		return {
			ok: true,
			agentId
		};
	}
	if (!parsed?.agentId) return { ok: true };
	const inferredAgentId = normalizeAgentId(parsed.agentId);
	if (canonicalKey === "global" && !listAgentIds(cfg).includes(inferredAgentId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${parsed.agentId}"`)
	};
	return {
		ok: true,
		agentId: canonicalKey === "global" ? inferredAgentId : void 0
	};
}
function buildDashboardSessionKey(agentId) {
	return `agent:${agentId}:dashboard:${randomUUID()}`;
}
function inheritSessionRuntimeSelection(parentEntry) {
	if (!parentEntry) return {};
	return {
		...parentEntry.providerOverride ? { providerOverride: parentEntry.providerOverride } : {},
		...parentEntry.modelOverride ? { modelOverride: parentEntry.modelOverride } : {},
		...parentEntry.modelOverrideSource ? { modelOverrideSource: parentEntry.modelOverrideSource } : {},
		...parentEntry.agentRuntimeOverride ? { agentRuntimeOverride: parentEntry.agentRuntimeOverride } : {},
		...parentEntry.modelProvider ? { modelProvider: parentEntry.modelProvider } : {},
		...parentEntry.model ? { model: parentEntry.model } : {},
		...parentEntry.thinkingLevel ? { thinkingLevel: parentEntry.thinkingLevel } : {},
		...parentEntry.fastMode !== void 0 ? { fastMode: parentEntry.fastMode } : {},
		...parentEntry.verboseLevel ? { verboseLevel: parentEntry.verboseLevel } : {},
		...parentEntry.traceLevel ? { traceLevel: parentEntry.traceLevel } : {},
		...parentEntry.reasoningLevel ? { reasoningLevel: parentEntry.reasoningLevel } : {},
		...parentEntry.elevatedLevel ? { elevatedLevel: parentEntry.elevatedLevel } : {},
		...parentEntry.authProfileOverride ? { authProfileOverride: parentEntry.authProfileOverride } : {},
		...parentEntry.authProfileOverrideSource ? { authProfileOverrideSource: parentEntry.authProfileOverrideSource } : {}
	};
}
async function createGatewaySession(params) {
	const requestedKey = normalizeOptionalString(params.key);
	const agentId = normalizeAgentId(normalizeOptionalString(params.agentId) ?? resolveDefaultAgentId(params.cfg));
	if (requestedKey) {
		const requestedAgentId = parseAgentSessionKey(requestedKey)?.agentId;
		if (requestedAgentId && requestedAgentId !== agentId && normalizeOptionalString(params.agentId)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `sessions.create key agent (${requestedAgentId}) does not match agentId (${agentId})`)
		};
	}
	const loweredRequestedKey = normalizeOptionalLowercaseString(requestedKey);
	const explicitTargetKey = requestedKey ? loweredRequestedKey === "global" || loweredRequestedKey === "unknown" ? loweredRequestedKey : toAgentStoreSessionKey({
		agentId,
		requestKey: requestedKey,
		mainKey: params.cfg.session?.mainKey
	}) : void 0;
	const parentSessionKey = normalizeOptionalString(params.parentSessionKey);
	if (params.fork === true && !parentSessionKey) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "fork requires parentSessionKey")
	};
	let canonicalParentSessionKey;
	let parentSessionEntry;
	let parentSelectedAgentId;
	let parentSessionTarget;
	if (parentSessionKey) {
		if (resolveSessionStoreKey({
			cfg: params.cfg,
			sessionKey: parentSessionKey
		}) === "global") {
			const parentRequestedAgent = resolveRequestedSessionAgentId(params.cfg, parentSessionKey, params.agentId);
			if (!parentRequestedAgent.ok) return parentRequestedAgent;
			parentSelectedAgentId = parentRequestedAgent.agentId;
		}
		const parent = loadSessionEntry(parentSessionKey, parentSelectedAgentId ? { agentId: parentSelectedAgentId } : void 0);
		if (!parent.entry?.sessionId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `unknown parent session: ${parentSessionKey}`)
		};
		canonicalParentSessionKey = parent.canonicalKey;
		parentSessionEntry = parent.entry;
		parentSessionTarget = resolveGatewaySessionStoreTarget({
			cfg: params.cfg,
			key: parentSessionKey,
			...canonicalParentSessionKey === "global" && parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {}
		});
	}
	if (canonicalParentSessionKey && explicitTargetKey && resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: explicitTargetKey,
		agentId
	}).canonicalKey === canonicalParentSessionKey) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create key must differ from parentSessionKey")
	};
	if (canonicalParentSessionKey && params.fork !== true && params.emitCommandHooks === true && !requestedKey && params.resetMainWhenUnspecified === true && params.cfg.session?.dmScope === "main") {
		const parentAgentId = normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? resolveDefaultAgentId(params.cfg));
		const parentMainKey = resolveAgentMainSessionKey({
			cfg: params.cfg,
			agentId: parentAgentId
		});
		if (canonicalParentSessionKey === parentMainKey) {
			const { performGatewaySessionReset } = await loadSessionLifecycleRuntime();
			const spawnedCwd = normalizeOptionalString(params.spawnedCwd);
			const resetResult = await performGatewaySessionReset({
				key: canonicalParentSessionKey,
				...canonicalParentSessionKey === "global" && parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {},
				reason: "new",
				commandSource: params.commandSource,
				...spawnedCwd ? { spawnedCwd } : {},
				...params.clearSpawnedCwd && !spawnedCwd ? { clearSpawnedCwd: true } : {}
			});
			if (!resetResult.ok) return resetResult;
			return {
				ok: true,
				key: resetResult.key,
				agentId: resetResult.agentId,
				entry: resetResult.entry,
				resetExisting: true
			};
		}
	}
	let createdContext;
	const createChildSession = async () => {
		let currentParentSessionEntry = parentSessionEntry;
		if (canonicalParentSessionKey && parentSessionTarget && (params.emitCommandHooks === true || params.fork === true)) {
			const currentParentEntry = loadSessionEntry(canonicalParentSessionKey, parentSelectedAgentId ? { agentId: parentSelectedAgentId } : void 0).entry;
			if (!currentParentEntry?.sessionId || currentParentEntry.sessionId !== parentSessionEntry?.sessionId) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `Parent session ${parentSessionKey} changed before ${params.fork === true ? "fork" : "/new"}; retry.`)
			};
			currentParentSessionEntry = currentParentEntry;
			if (isEmbeddedAgentRunActive(currentParentEntry.sessionId) || isSessionWorkAdmissionActive(parentSessionTarget.storePath, [canonicalParentSessionKey, currentParentEntry.sessionId])) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Parent session ${parentSessionKey} is still active; try again in a moment.`)
			};
		}
		if (canonicalParentSessionKey && parentSessionTarget && params.emitCommandHooks === true) {
			const parentEntry = currentParentSessionEntry;
			const parentAgentId = normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? resolveDefaultAgentId(params.cfg));
			const workspaceDir = resolveAgentWorkspaceDir(params.cfg, parentAgentId);
			if (hasInternalHookListeners("command", "new")) await triggerInternalHook(createInternalHookEvent("command", "new", canonicalParentSessionKey, {
				sessionEntry: parentEntry,
				previousSessionEntry: parentEntry,
				commandSource: params.commandSource,
				cfg: params.cfg,
				workspaceDir
			}));
			const { emitGatewayBeforeResetPluginHook } = await loadSessionLifecycleRuntime();
			await emitGatewayBeforeResetPluginHook({
				cfg: params.cfg,
				key: canonicalParentSessionKey,
				target: parentSessionTarget,
				storePath: parentSessionTarget.storePath,
				entry: parentEntry,
				reason: "new"
			});
		}
		const key = explicitTargetKey ?? buildDashboardSessionKey(agentId);
		const target = resolveGatewaySessionStoreTarget({
			cfg: params.cfg,
			key,
			agentId
		});
		const created = await createSessionEntryWithTranscript({
			agentId: target.agentId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}, async ({ sessionEntries }) => {
			const patched = await applySessionsPatchToStore({
				cfg: params.cfg,
				store: sessionEntries,
				storeKey: target.canonicalKey,
				agentId: target.agentId,
				patch: {
					key: target.canonicalKey,
					label: normalizeOptionalString(params.label),
					model: normalizeOptionalString(params.model)
				},
				loadGatewayModelCatalog: params.loadGatewayModelCatalog
			});
			const spawnedCwd = normalizeOptionalString(params.spawnedCwd);
			if (patched.ok && spawnedCwd) {
				patched.entry.spawnedCwd = spawnedCwd;
				sessionEntries[target.canonicalKey] = patched.entry;
			}
			if (!patched.ok || !canonicalParentSessionKey) return patched;
			const inheritedSelection = normalizeOptionalString(params.model) ? {} : inheritSessionRuntimeSelection(currentParentSessionEntry);
			const entry = {
				...patched.entry,
				...inheritedSelection,
				parentSessionKey: canonicalParentSessionKey
			};
			if (params.fork !== true) return {
				...patched,
				entry
			};
			if (!currentParentSessionEntry || !parentSessionTarget) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "failed to resolve parent session for fork")
			};
			const forkDecision = await resolveParentForkDecision({
				parentEntry: currentParentSessionEntry,
				agentId: parentSessionTarget.agentId,
				storePath: parentSessionTarget.storePath
			});
			if (forkDecision.status === "skip") return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `parent session is too large to fork (${forkDecision.parentTokens}/${forkDecision.maxTokens} tokens)`)
			};
			const fork = await forkSessionFromParent({
				parentEntry: currentParentSessionEntry,
				agentId: parentSessionTarget.agentId,
				parentSessionKey: canonicalParentSessionKey,
				sessionKey: target.canonicalKey,
				storePath: parentSessionTarget.storePath,
				targetStorePath: target.storePath
			});
			if (!fork) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "failed to fork parent session transcript")
			};
			return {
				...patched,
				entry: {
					...entry,
					sessionId: fork.sessionId,
					sessionFile: fork.sessionFile,
					forkedFromParent: true,
					totalTokens: void 0,
					totalTokensFresh: false
				}
			};
		});
		if (!created.ok) return {
			ok: false,
			error: created.phase === "transcript" ? errorShape(ErrorCodes.UNAVAILABLE, `failed to create session transcript: ${created.error}`) : created.error
		};
		createdContext = {
			key: target.canonicalKey,
			agentId: target.agentId,
			entry: created.entry,
			storePath: target.storePath
		};
		if (canonicalParentSessionKey && parentSessionTarget && params.emitCommandHooks === true) {
			const parentEntry = currentParentSessionEntry;
			const { emitGatewaySessionEndPluginHook, emitGatewaySessionStartPluginHook } = await loadSessionLifecycleRuntime();
			emitGatewaySessionEndPluginHook({
				cfg: params.cfg,
				sessionKey: canonicalParentSessionKey,
				sessionId: parentEntry?.sessionId,
				storePath: parentSessionTarget.storePath,
				sessionFile: parentEntry?.sessionFile,
				agentId: parentSessionTarget.agentId,
				reason: "new",
				nextSessionId: created.entry.sessionId,
				nextSessionKey: target.canonicalKey
			});
			emitGatewaySessionStartPluginHook({
				cfg: params.cfg,
				sessionKey: target.canonicalKey,
				sessionId: created.entry.sessionId,
				resumedFrom: parentEntry?.sessionId,
				storePath: target.storePath,
				sessionFile: created.entry.sessionFile,
				agentId: target.agentId
			});
		}
		return {
			ok: true,
			key: target.canonicalKey,
			agentId: target.agentId,
			entry: created.entry,
			resetExisting: false
		};
	};
	if (canonicalParentSessionKey && parentSessionEntry?.sessionId && parentSessionTarget && (params.emitCommandHooks === true || params.fork === true)) {
		const result = await runExclusiveSessionLifecycleMutation({
			scope: parentSessionTarget.storePath,
			identities: [canonicalParentSessionKey, parentSessionEntry.sessionId],
			run: createChildSession
		});
		if (result.ok && !result.resetExisting && createdContext) await params.afterCreate?.(createdContext);
		return result;
	}
	const result = await createChildSession();
	if (result.ok && !result.resetExisting && createdContext) await params.afterCreate?.(createdContext);
	return result;
}
//#endregion
export { projectSessionsPatchEntry as i, createGatewaySession as n, resolveRequestedSessionAgentId as r, buildDashboardSessionKey as t };
