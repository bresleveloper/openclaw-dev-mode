import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { l as redactToolDetail } from "./redact-BcXJu5HP.mjs";
import { t as isPlainObject } from "./plain-object-BFvGATnd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { a as readAgentRosterProperty } from "./agent-roster-gkYP38su.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { Ct as validateConfigSchemaParams, Ng as errorShape, bt as validateConfigPatchParams, vt as validateConfigApplyParams, wt as validateConfigSetParams, xt as validateConfigSchemaLookupParams, yt as validateConfigGetParams } from "./src-pLJQA6J5.mjs";
import { a as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-FWbk4b3p.mjs";
import { p as resolveConfigSnapshotHash, s as parseConfigJson5 } from "./io.read-helpers-KYk5dB53.mjs";
import { g as redactSecretDegradationReason, u as isRetryableSecretDegradationReason } from "./runtime-degraded-state-SptB0g_t.mjs";
import { l as getActiveSecretsRuntimeSnapshotState } from "./runtime-state-DDDhACod.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { n as formatConfigIssueLines } from "./issue-format-Cu1pIc3h.mjs";
import { n as normalizeSubmittedConfigModelRefs } from "./model-input-normalization-vDjxHMLC.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { i as normalizeConfigPatchReplacePaths, n as formatConfigPatchPath, r as isMergePatchObjectKeyAllowed, t as collectBaseArrayPaths } from "./patch-replace-paths-smD0Mrey.mjs";
import { t as projectRuntimeChangesOntoSource } from "./source-value-projection-v5vH7oJ8.mjs";
import { G as isBuiltInModelProviderOverlayId } from "./zod-schema.core-BohYkI3l.mjs";
import { i as validateConfigObjectWithPlugins, r as validateConfigObjectRawWithPlugins } from "./validation-gzn6Bd6i.mjs";
import { r as restoreRedactedValues, t as redactConfigObject } from "./redact-snapshot-D_TnZpW0.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-BBNhGTcQ.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-D-eANYlX.mjs";
import { C as createRuntimeConfigWriteApplication, l as readConfigFileSnapshotForWrite, x as attachRuntimeConfigWriteApplication } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as extractDeliveryInfo } from "./delivery-info-BlWXIzDQ.mjs";
import { r as resolveGatewayAuth } from "./auth-resolve-BLx2Z8Ad.mjs";
import "./auth-fv7y-hds.mjs";
import { n as holdGatewayPolicyResponse } from "./ws-policy-close-2inJAtve.mjs";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-McXSFzXR.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BeRsGF9T.mjs";
import { u as scheduleGatewayRestart } from "./restart-B5lVkjlo.mjs";
import { i as resolveConfigReloadMetadata, n as isNoopGatewayReloadPlan, o as diffConfigPaths, r as listConfigReloadRefinementPrefixes, s as diffGatewayReloadPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-B6NE-M4X.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { T as writeRestartSentinel, c as formatDoctorNonInteractiveHint } from "./restart-sentinel-BPoW-ukG.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { r as lookupConfigSchema } from "./schema-r6axo63S.mjs";
import { n as invalidateGatewayRuntimeConfigSchema, r as loadGatewayRuntimeConfigSchema } from "./runtime-schema-DvdVpE4c.mjs";
import { i as summarizeChangedPaths, r as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-DhEbrRsy.mjs";
import { n as parseRestartRequestParams } from "./restart-request-Bb_ECfbs.mjs";
import { a as sanitizePathForLog, i as resolveOpenPathCommand, n as formatOpenPathError, r as isHeadlessOpenPathError, t as execOpenPath } from "./open-path-DSpXaNx6.mjs";
import { a as prepareSecretsRuntimeSnapshot } from "./runtime-Dnoq_32U.mjs";
import { n as readConfigGetResponse, t as invalidateConfigGetResponseCache } from "./config-get-response-BzJGWyiF.mjs";
import { t as resolveBaseHashParam } from "./base-hash-DxpcXxxb.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/config-patch-intent.ts
function isHashlessPatchLwwPath(path) {
	return path === "ui.prefs" || path.startsWith("ui.prefs.");
}
function hasHashlessPatchLwwStructure(patch) {
	if (!isPlainObject(patch)) return false;
	if (!Object.hasOwn(patch, "ui")) return true;
	const ui = patch.ui;
	return isPlainObject(ui) && (!Object.hasOwn(ui, "prefs") || isPlainObject(ui.prefs));
}
function diffConfigLeafPaths(prev, next, prefix = "") {
	if (isPlainObject(prev) || isPlainObject(next)) {
		const prevRecord = isPlainObject(prev) ? prev : {};
		const nextRecord = isPlainObject(next) ? next : {};
		const keys = [.../* @__PURE__ */ new Set([...Object.keys(prevRecord), ...Object.keys(nextRecord)])];
		if (keys.length === 0) return isDeepStrictEqual(prev, next) ? [] : [prefix || "<root>"];
		return keys.flatMap((key) => diffConfigLeafPaths(prevRecord[key], nextRecord[key], prefix ? `${prefix}.${key}` : key));
	}
	return diffConfigPaths(prev, next, prefix);
}
//#endregion
//#region src/gateway/server-methods/config-submission-validation.ts
const MAX_CONFIG_ISSUES_IN_ERROR_SUMMARY = 3;
function summarizeConfigValidationIssues(issues) {
	const trimmed = issues.slice(0, MAX_CONFIG_ISSUES_IN_ERROR_SUMMARY);
	const lines = normalizeStringEntries(formatConfigIssueLines(trimmed, "", { normalizeRoot: true }));
	if (lines.length === 0) return "invalid config";
	const hiddenCount = Math.max(0, issues.length - lines.length);
	return `invalid config: ${lines.join("; ")}${hiddenCount > 0 ? ` (+${hiddenCount} more issue${hiddenCount === 1 ? "" : "s"})` : ""}`;
}
function validateSubmittedConfigOrRespond(params) {
	const normalizationCandidate = params.candidate;
	const validationCandidate = normalizeSubmittedConfigModelRefs(normalizationCandidate, params.pluginMetadataSnapshot?.owners.modelIdNormalizationPolicies);
	const respondInvalid = (issues) => {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, summarizeConfigValidationIssues(issues), { details: { issues } }));
	};
	const validationParams = { pluginMetadataSnapshot: params.pluginMetadataSnapshot };
	const sourceValidated = validateConfigObjectRawWithPlugins(validationCandidate, validationParams);
	if (!sourceValidated.ok) {
		respondInvalid(sourceValidated.issues);
		return null;
	}
	const validated = validateConfigObjectWithPlugins(validationCandidate, validationParams);
	if (!validated.ok) {
		respondInvalid(validated.issues);
		return null;
	}
	return {
		validationCandidate,
		config: validated.config
	};
}
//#endregion
//#region src/gateway/server-methods/config-write-flow.ts
function resolveGatewayConfigPath(snapshot) {
	return snapshot?.path ?? createConfigIO().configPath;
}
/** Compares the effective shared Gateway auth surface that active clients use. */
function didSharedGatewayAuthChange(prev, next) {
	const prevResolvedAuth = resolveGatewayAuth({
		authConfig: prev.gateway?.auth,
		env: process.env,
		tailscaleMode: prev.gateway?.tailscale?.mode
	});
	const nextResolvedAuth = resolveGatewayAuth({
		authConfig: next.gateway?.auth,
		env: process.env,
		tailscaleMode: next.gateway?.tailscale?.mode
	});
	return prevResolvedAuth.mode !== nextResolvedAuth.mode || prevResolvedAuth.mode !== "trusted-proxy" && resolveSharedGatewaySessionGeneration(prevResolvedAuth, prev.gateway?.trustedProxies) !== resolveSharedGatewaySessionGeneration(nextResolvedAuth, next.gateway?.trustedProxies);
}
function projectAuthoredValuesOntoRuntimeOverlay(params) {
	const { source, active } = params;
	if (active === void 0) return structuredClone(params.fallback);
	if (!isRecord(source) || !isRecord(active)) return structuredClone(isDeepStrictEqual(source, params.activeSource) ? active : params.fallback);
	const fallback = isRecord(params.fallback) ? params.fallback : {};
	const activeSource = isRecord(params.activeSource) ? params.activeSource : {};
	const sourceKeys = new Set(Object.keys(source));
	return Object.fromEntries([...Object.entries(fallback).filter(([key]) => !sourceKeys.has(key)), ...Object.keys(source).map((key) => [key, projectAuthoredValuesOntoRuntimeOverlay({
		source: source[key],
		activeSource: activeSource[key],
		active: active[key],
		fallback: fallback[key]
	})])]);
}
/** Compares against the active secrets-expanded config when one is available. */
function didActiveSharedGatewayAuthChange(params) {
	const active = getActiveSecretsRuntimeSnapshotState();
	if (!active) return didSharedGatewayAuthChange(params.fallbackPrev, params.next);
	const currentSourceGateway = (params.fallbackSource ?? active.sourceConfig).gateway;
	const activeSourceGateway = active.sourceConfig.gateway;
	const activeGateway = active.config.gateway;
	const fallbackGateway = params.fallbackPrev.gateway;
	const selectOwnedGatewayValue = (key) => currentSourceGateway && Object.hasOwn(currentSourceGateway, key) ? projectAuthoredValuesOntoRuntimeOverlay({
		source: currentSourceGateway[key],
		activeSource: activeSourceGateway?.[key],
		active: activeGateway?.[key],
		fallback: fallbackGateway?.[key]
	}) : fallbackGateway?.[key];
	return didSharedGatewayAuthChange({
		...params.fallbackPrev,
		gateway: {
			...fallbackGateway,
			auth: selectOwnedGatewayValue("auth"),
			tailscale: selectOwnedGatewayValue("tailscale"),
			trustedProxies: selectOwnedGatewayValue("trustedProxies")
		}
	}, params.next);
}
function resolveConfigRestartRequirement(params) {
	const reloadSettings = resolveGatewayReloadSettings(params.nextConfig);
	const plan = buildGatewayReloadPlan(params.changedPaths, {
		previousConfig: params.previousConfig,
		candidateConfig: params.nextConfig
	});
	const requiresRestart = !isNoopGatewayReloadPlan(plan) && (reloadSettings.mode === "off" || plan.restartGateway);
	return {
		requiresRestart,
		scheduleDirectRestart: requiresRestart && reloadSettings.mode === "off" && !params.deferRestartWhenReloadOff
	};
}
/**
* `openclaw config set/patch/unset` route here while a Gateway owns the state and keep the
* offline write's outcomes. Stable Gateways close the request schema, so the connection
* identity carries this rather than a request field.
*/
function isCliRoutedConfigPatch(mode, client) {
	const cli = client?.connect?.client;
	return mode === "config.patch" && cli?.id === GATEWAY_CLIENT_NAMES.CLI && cli.mode === GATEWAY_CLIENT_MODES.CLI;
}
/**
* Responds when an awaited runtime application did not fully apply, and reports whether it
* did. A CLI-routed write keeps the offline outcome: persisted and restarting is success.
*/
function respondConfigWriteApplicationOutcome(params) {
	const { outcome, mode } = params;
	if (outcome === "applied") return false;
	if (outcome === "restart-pending" && isCliRoutedConfigPatch(mode, params.client)) {
		params.respond(true, {
			...params.success,
			restartPending: true
		}, void 0);
		return true;
	}
	const message = outcome === "applied-restart-required" ? `${mode} persisted and updated the active Gateway, but a recovery restart is required; wait for the Gateway to restart, then run config.get to confirm the active revision` : outcome === "restart-pending" ? `${mode} persisted and was accepted for restart; wait for the Gateway to restart, then run config.get to confirm the active revision` : `${mode} persisted but was not applied to the active Gateway (${outcome}); run config.get, then use config.apply to reapply the saved config or restart the Gateway`;
	params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, { details: { persistedConfig: params.persistedConfig } }));
	return true;
}
/** Returns whether a managed config write can settle without restarting the Gateway. */
function shouldAwaitGatewayConfigApplication(params) {
	return resolveGatewayReloadSettings(params.nextConfig).mode !== "off" && !resolveConfigRestartRequirement(params).requiresRestart;
}
/** Persists a gateway config write and returns follow-up work that must run after response. */
async function commitGatewayConfigWrite(params) {
	const previousRuntimeConfig = params.context?.getCommittedRuntimeConfig?.() ?? params.snapshot.config;
	const application = params.awaitRuntimeApplication ? createRuntimeConfigWriteApplication(captureGatewayRootWorkAdmissionContinuationScope()?.run) : void 0;
	holdGatewayPolicyResponse(params.respond);
	const result = await replaceConfigFile({
		sourceConfig: params.nextConfig,
		baseHash: resolveConfigSnapshotHash(params.snapshot) ?? void 0,
		writeOptions: attachRuntimeConfigWriteApplication({
			...params.writeOptions,
			auditOrigin: "config-rpc",
			runtimeRefresh: {
				...params.writeOptions.runtimeRefresh,
				includeAuthStoreRefs: false
			}
		}, application),
		afterWrite: { mode: "auto" }
	});
	return {
		path: resolveGatewayConfigPath(params.snapshot),
		config: result.nextConfig,
		hash: result.persistedHash,
		...application ? { application: application.claimed ? application.result : Promise.resolve("unclaimed") } : {},
		queueFollowUp: () => {
			if (!application?.claimed) queueMicrotask(() => {
				params.context?.enforceSharedGatewayAuthGenerationForConfigWrite?.(result.nextConfig, previousRuntimeConfig);
				if (params.disconnectSharedAuthClients) params.context?.disconnectClientsUsingSharedGatewayAuth?.();
			});
		}
	};
}
async function resolveGatewayConfigRestartWriteResult(params) {
	const { sessionKey, note, restartDelayMs, deliveryContext, threadId } = parseRestartRequestParams(params.requestParams);
	const sessionDelivery = await extractDeliveryInfo(sessionKey);
	const actor = resolveControlPlaneActor(params.client);
	const restartRequirement = resolveConfigRestartRequirement({
		...params,
		deferRestartWhenReloadOff: isCliRoutedConfigPatch(params.mode, params.client)
	});
	const payload = {
		kind: params.kind,
		status: "ok",
		ts: Date.now(),
		sessionKey,
		deliveryContext: deliveryContext ?? sessionDelivery.deliveryContext,
		threadId: threadId ?? sessionDelivery.threadId,
		message: note ?? null,
		doctorHint: formatDoctorNonInteractiveHint(),
		stats: {
			mode: params.mode,
			root: params.configPath,
			requiresRestart: restartRequirement.requiresRestart
		}
	};
	const sentinelPersisted = await writeRestartSentinel(payload).then(() => true, () => false);
	const restart = restartRequirement.scheduleDirectRestart ? scheduleGatewayRestart({
		delayMs: restartDelayMs,
		reason: params.mode,
		audit: {
			actor: actor.actor,
			deviceId: actor.deviceId,
			clientIp: actor.clientIp,
			changedPaths: params.changedPaths
		}
	}) : void 0;
	if (restart?.coalesced) params.context?.logGateway?.warn(`${params.mode} restart coalesced ${formatControlPlaneActor(actor)} delayMs=${restart.delayMs}`);
	return {
		payload,
		sentinelPersisted,
		restart
	};
}
//#endregion
//#region src/gateway/server-methods/config-write-snapshot.ts
function requireConfigBaseHash(params, snapshot, respond, revisionProjector) {
	if (!snapshot.exists) return true;
	const snapshotHash = resolveConfigSnapshotHash(snapshot);
	const baseHash = resolveBaseHashParam(params);
	if (!snapshotHash || !baseHash) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `config base hash ${snapshotHash ? "required" : "unavailable"}; re-run config.get and retry`));
		return false;
	}
	if (baseHash !== revisionProjector.projectRawHash(snapshotHash)) {
		invalidateConfigGetResponseCache();
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "config changed since last load; re-run config.get and retry"));
		return false;
	}
	return true;
}
async function readConfigWriteSnapshotOrRespond(params, respond, revisionProjector) {
	const result = await readConfigFileSnapshotForWrite();
	if (!requireConfigBaseHash(params, result.snapshot, respond, revisionProjector)) return null;
	return result;
}
//#endregion
//#region src/gateway/server-methods/config.ts
const configWriteRecovery = /* @__PURE__ */ new WeakMap();
function collectDestructiveArrayPatchPaths(params) {
	if (!isPlainObject(params.patch) || !isPlainObject(params.base)) return [];
	const merged = isPlainObject(params.merged) ? params.merged : {};
	const paths = [];
	for (const [key, patchValue] of Object.entries(params.patch)) {
		const path = formatConfigPatchPath(params.path ?? "", key);
		if (!isMergePatchObjectKeyAllowed(key, params.path)) continue;
		const baseValue = params.base[key];
		const mergedValue = merged[key];
		if (Array.isArray(baseValue)) {
			if (patchValue === null || !Array.isArray(patchValue)) {
				paths.push(path);
				continue;
			}
			if (Array.isArray(mergedValue)) {
				if (isConfigPatchIdKeyedArray(baseValue)) {
					if (!idKeyedArrayPreservesBaseIds(baseValue, mergedValue)) {
						paths.push(path);
						continue;
					}
					paths.push(...collectDestructiveIdKeyedArrayEntryPatchPaths({
						base: baseValue,
						patch: patchValue,
						merged: mergedValue,
						path
					}));
				} else if (!arrayPreservesBaseEntries(baseValue, mergedValue)) {
					paths.push(path);
					continue;
				}
			}
		} else if (isPlainObject(baseValue) && !isPlainObject(patchValue)) {
			paths.push(...collectBaseArrayPaths(baseValue, path));
			continue;
		}
		if (isPlainObject(patchValue)) paths.push(...collectDestructiveArrayPatchPaths({
			base: baseValue,
			patch: patchValue,
			merged: mergedValue,
			path
		}));
	}
	return paths;
}
function isConfigPatchObjectWithStringId(value) {
	return isPlainObject(value) && typeof value.id === "string" && value.id.length > 0;
}
function assertNoDuplicateConfigPatchIds(params) {
	const path = params.path ?? "";
	if (Array.isArray(params.patch)) {
		if (!Array.isArray(params.current) || params.replacePaths.has(path) || !isConfigPatchIdKeyedArray(params.current)) return;
		const currentIds = /* @__PURE__ */ new Set();
		for (const entry of params.current) {
			if (currentIds.has(entry.id)) throw new Error(`Cannot ID-merge array at ${path || "<root>"}: current config contains duplicate ID ${entry.id}; use replacePaths for an explicit replacement.`);
			currentIds.add(entry.id);
		}
		const ids = /* @__PURE__ */ new Set();
		for (const entry of params.patch) {
			if (!isConfigPatchObjectWithStringId(entry)) continue;
			if (ids.has(entry.id)) throw new Error(`Ambiguous duplicate ID ${entry.id} in array at ${path || "<root>"}.`);
			ids.add(entry.id);
		}
		const currentById = new Map(params.current.map((entry) => [entry.id, entry]));
		for (const entry of params.patch) {
			if (!isConfigPatchObjectWithStringId(entry)) continue;
			const currentEntry = currentById.get(entry.id);
			if (currentEntry) assertNoDuplicateConfigPatchIds({
				patch: entry,
				current: currentEntry,
				replacePaths: params.replacePaths,
				path: `${path}[]`
			});
		}
		return;
	}
	if (!isRecord(params.patch) || !isRecord(params.current)) return;
	for (const [key, child] of Object.entries(params.patch)) assertNoDuplicateConfigPatchIds({
		patch: child,
		current: params.current[key],
		replacePaths: params.replacePaths,
		path: formatConfigPatchPath(path, key)
	});
}
function isConfigPatchIdKeyedArray(value) {
	return value.every(isConfigPatchObjectWithStringId);
}
function idKeyedArrayPreservesBaseIds(base, merged) {
	const mergedIds = new Set(merged.filter(isConfigPatchObjectWithStringId).map((entry) => entry.id));
	return base.every((entry) => mergedIds.has(entry.id));
}
function arrayPreservesBaseEntries(base, merged) {
	const unmatchedMerged = [...merged];
	for (const baseEntry of base) {
		const matchIndex = unmatchedMerged.findIndex((mergedEntry) => isDeepStrictEqual(mergedEntry, baseEntry));
		if (matchIndex === -1) return false;
		unmatchedMerged.splice(matchIndex, 1);
	}
	return true;
}
function collectDestructiveIdKeyedArrayEntryPatchPaths(params) {
	const baseById = new Map(params.base.map((entry) => [entry.id, entry]));
	const mergedById = new Map(params.merged.filter(isConfigPatchObjectWithStringId).map((entry) => [entry.id, entry]));
	const paths = [];
	for (const patchEntry of params.patch) {
		if (!isConfigPatchObjectWithStringId(patchEntry)) continue;
		const baseEntry = baseById.get(patchEntry.id);
		const mergedEntry = mergedById.get(patchEntry.id);
		if (!baseEntry || !mergedEntry) continue;
		paths.push(...collectDestructiveArrayPatchPaths({
			base: baseEntry,
			patch: patchEntry,
			merged: mergedEntry,
			path: `${params.path}[]`
		}));
	}
	return paths;
}
function rejectDestructiveArrayPatchWithoutIntent(params) {
	const unconfirmedPaths = collectDestructiveArrayPatchPaths({
		base: params.currentConfig,
		patch: params.patch,
		merged: params.mergedConfig
	}).filter((path) => !params.replacePaths.has(path));
	if (unconfirmedPaths.length === 0) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `config.patch would remove entries from array path(s): ${unconfirmedPaths.join(", ")}. Pass replacePaths with the exact path(s) when this is intentional, or use config.apply for full-config replacement.`));
	return true;
}
function hasOwnRecordValue(value, key) {
	return isRecord(value) && Object.hasOwn(value, key);
}
function stripBundledProviderRuntimeDefaults(params) {
	if (!isRecord(params.candidate)) return params.candidate;
	const models = params.candidate.models;
	if (!isRecord(models) || !isRecord(models.providers)) return params.candidate;
	const sourceModels = isRecord(params.sourceConfig) ? params.sourceConfig.models : void 0;
	const sourceProviders = isRecord(sourceModels) ? sourceModels.providers : void 0;
	let nextProviders;
	for (const [providerId, provider] of Object.entries(models.providers)) {
		if (!isBuiltInModelProviderOverlayId(providerId) || !isRecord(provider)) continue;
		const sourceProvider = isRecord(sourceProviders) ? sourceProviders[providerId] : void 0;
		let nextProvider;
		if (provider.baseUrl === "" && !hasOwnRecordValue(sourceProvider, "baseUrl")) {
			nextProvider = { ...provider };
			delete nextProvider.baseUrl;
		}
		if (Array.isArray(provider.models) && provider.models.length === 0 && !hasOwnRecordValue(sourceProvider, "models")) {
			nextProvider ??= { ...provider };
			delete nextProvider.models;
		}
		if (nextProvider) {
			nextProviders ??= { ...models.providers };
			nextProviders[providerId] = nextProvider;
		}
	}
	if (!nextProviders) return params.candidate;
	return {
		...params.candidate,
		models: {
			...models,
			providers: nextProviders
		}
	};
}
async function prepareConfigReplacementOrRespond(params, respond, revisionProjector) {
	const writeSnapshot = await readConfigWriteSnapshotOrRespond(params, respond, revisionProjector);
	if (!writeSnapshot) return null;
	const { snapshot, writeOptions } = writeSnapshot;
	const parsedRes = parseConfigJson5(params.raw);
	if (!parsedRes.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, parsedRes.error));
		return null;
	}
	const schema = loadGatewayRuntimeConfigSchema();
	const restored = restoreRedactedValues(parsedRes.parsed, snapshot.config, schema.uiHints);
	if (!restored.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, restored.humanReadableMessage ?? "invalid config"));
		return null;
	}
	const validatedSubmission = validateSubmittedConfigOrRespond({
		candidate: stripBundledProviderRuntimeDefaults({
			candidate: snapshot.valid ? projectRuntimeChangesOntoSource(snapshot.resolved, snapshot.config, restored.result) : restored.result,
			sourceConfig: snapshot.sourceConfig
		}),
		pluginMetadataSnapshot: writeOptions.basePluginMetadataSnapshot,
		respond
	});
	if (!validatedSubmission) return null;
	return {
		writeSnapshot,
		config: validatedSubmission.config,
		writeConfig: validatedSubmission.validationCandidate,
		schema
	};
}
function listExplicitAgentRosterIds(config) {
	const roster = readAgentRosterProperty(config);
	if (roster?.kind === "entries" && isRecord(roster.value)) return Object.keys(roster.value);
	if (roster?.kind !== "list" || !Array.isArray(roster.value)) return [];
	return roster.value.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []);
}
function rejectDroppedAgentRosterEntries(params) {
	const submittedIds = new Set(listExplicitAgentRosterIds(params.submittedConfig).map((agentId) => normalizeAgentId(agentId)));
	const droppedIds = listExplicitAgentRosterIds(params.currentConfig).filter((agentId) => !submittedIds.has(normalizeAgentId(agentId))).toSorted();
	if (droppedIds.length === 0) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `config.set would remove existing agent entries: ${droppedIds.join(", ")}. Use the agents.delete RPC or \`openclaw agents delete <id>\` for intentional deletion.`));
	return true;
}
async function ensureResolvableSecretRefsOrRespond(params) {
	try {
		const snapshot = await prepareSecretsRuntimeSnapshot({
			config: params.config,
			includeAuthStoreRefs: false,
			allowUnavailableSecretOwners: true
		});
		for (const owner of snapshot.degradedOwners ?? []) {
			const reason = redactSecretDegradationReason(owner.reason);
			if (!isRetryableSecretDegradationReason(reason)) throw new Error(reason);
		}
		return snapshot;
	} catch (error) {
		const details = formatErrorMessage(error);
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid config: active SecretRef resolution failed (${details})`));
		return null;
	}
}
function preparedSecretDegradationPayload(snapshot) {
	const degradedSecretOwners = (snapshot.degradedOwners ?? []).map((owner) => ({
		ownerKind: owner.ownerKind,
		ownerId: owner.ownerId,
		state: owner.degradationState ?? "cold",
		paths: [...owner.paths],
		reason: redactSecretDegradationReason(owner.reason)
	}));
	return degradedSecretOwners.length > 0 ? { degradedSecretOwners } : {};
}
async function commitConfigRestartWrite(params) {
	const { snapshot, writeOptions } = params.writeSnapshot;
	const changedPaths = diffGatewayReloadPaths(snapshot.config, params.nextConfig, listConfigReloadRefinementPrefixes());
	params.context?.logGateway?.info(`${params.mode} write ${formatControlPlaneActor(resolveControlPlaneActor(params.client))} changedPaths=${summarizeChangedPaths(changedPaths)} restartReason=${params.mode}`);
	const disconnectSharedAuthClients = didSharedGatewayAuthChange(snapshot.config, params.nextConfig) || didActiveSharedGatewayAuthChange({
		fallbackPrev: snapshot.config,
		fallbackSource: snapshot.sourceConfig,
		next: params.preparedSecretsSnapshot.config
	});
	const writeResult = await commitGatewayConfigWriteOrRespond({
		snapshot,
		writeOptions,
		nextConfig: params.writeConfig,
		context: params.context,
		disconnectSharedAuthClients,
		awaitRuntimeApplication: shouldAwaitGatewayConfigApplication({
			changedPaths,
			previousConfig: snapshot.config,
			nextConfig: params.nextConfig
		}),
		respond: params.respond
	});
	if (!writeResult) return;
	const persistedConfig = {
		...writeResult.hash ? { hash: params.context.configRevisionProjector.projectRawHash(writeResult.hash) } : {},
		...!params.summary ? { config: redactConfigObject(writeResult.config, params.uiHints) } : {}
	};
	if (writeResult.application && respondConfigWriteApplicationOutcome({
		outcome: await writeResult.application,
		mode: params.mode,
		client: params.client,
		respond: params.respond,
		success: {
			ok: true,
			path: writeResult.path,
			...persistedConfig,
			changedPaths
		},
		persistedConfig
	})) {
		writeResult.queueFollowUp();
		return;
	}
	const noopReload = isNoopGatewayReloadPlan(buildGatewayReloadPlan(changedPaths, {
		previousConfig: snapshot.config,
		candidateConfig: params.nextConfig
	}));
	if (!noopReload) invalidateGatewayRuntimeConfigSchema();
	if (params.summary && noopReload) {
		params.respond(true, {
			ok: true,
			path: writeResult.path,
			...persistedConfig,
			changedPaths
		});
		writeResult.queueFollowUp();
		return;
	}
	const { payload, sentinelPersisted, restart } = await resolveGatewayConfigRestartWriteResult({
		requestParams: params.requestParams,
		kind: params.mode === "config.patch" ? "config-patch" : "config-apply",
		mode: params.mode,
		configPath: writeResult.path,
		changedPaths,
		previousConfig: snapshot.config,
		nextConfig: params.nextConfig,
		client: params.client,
		context: params.context
	});
	params.respond(true, {
		ok: true,
		path: writeResult.path,
		...persistedConfig,
		...params.mode === "config.patch" ? { changedPaths } : {},
		...preparedSecretDegradationPayload(params.preparedSecretsSnapshot),
		restart,
		sentinel: {
			persisted: sentinelPersisted,
			payload
		}
	}, void 0);
	writeResult.queueFollowUp();
}
async function commitGatewayConfigWriteOrRespond(params) {
	const gateway = params.context.configRevisionProjector;
	const recoveryAtStart = configWriteRecovery.get(gateway);
	try {
		const result = await commitGatewayConfigWrite(params);
		if (configWriteRecovery.get(gateway) === recoveryAtStart) configWriteRecovery.delete(gateway);
		return result;
	} catch (error) {
		if (error instanceof ConfigWritePostCommitError) {
			const outcome = errorShape(ErrorCodes.UNAVAILABLE, redactToolDetail(formatErrorMessage(error)), { details: {
				publication: error.publication,
				rollbackStatus: error.rollbackStatus,
				configPath: error.configPath,
				...error.recoveryBackupPath !== void 0 ? { recoveryBackupPath: error.recoveryBackupPath } : {}
			} });
			if (error.rollbackStatus !== "restored") {
				configWriteRecovery.set(gateway, {
					configPath: error.configPath,
					error: outcome
				});
				invalidateConfigGetResponseCache();
			}
			params.respond(false, void 0, outcome);
			return null;
		}
		if (!(error instanceof ConfigMutationConflictError)) throw error;
		if (error.retryable) invalidateConfigGetResponseCache();
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.retryable ? `${error.message}; re-run config.get and retry` : error.message));
		return null;
	}
}
const configHandlers = {
	"config.get": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateConfigGetParams, "config.get", respond)) return;
		const gateway = context.configRevisionProjector;
		const recoveryAtStart = configWriteRecovery.get(gateway);
		const snapshot = await readConfigGetResponse({
			getHotReloadStatus: context.getConfigReloaderHotReloadStatus,
			loadUiHints: () => loadGatewayRuntimeConfigSchema().uiHints,
			revisionProjector: context.configRevisionProjector
		});
		const recovery = configWriteRecovery.get(gateway);
		if (recovery?.configPath === snapshot.path) {
			if (recovery === recoveryAtStart && snapshot.exists && snapshot.valid) configWriteRecovery.delete(gateway);
			else {
				respond(true, {
					...snapshot,
					writeError: recovery.error
				}, void 0);
				return;
			}
		}
		respond(true, snapshot, void 0);
	},
	"config.schema": ({ params, respond }) => {
		if (!assertValidParams(params, validateConfigSchemaParams, "config.schema", respond)) return;
		respond(true, loadGatewayRuntimeConfigSchema(), void 0);
	},
	"config.schema.lookup": ({ params, respond }) => {
		if (!assertValidParams(params, validateConfigSchemaLookupParams, "config.schema.lookup", respond)) return;
		const { path } = params;
		const schema = loadGatewayRuntimeConfigSchema();
		const result = lookupConfigSchema(schema, path, resolveConfigReloadMetadata);
		if (!result) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "config schema path not found"));
			return;
		}
		respond(true, result, void 0);
	},
	"config.set": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateConfigSetParams, "config.set", respond)) return;
		const parsed = await prepareConfigReplacementOrRespond(params, respond, context.configRevisionProjector);
		if (!parsed) return;
		const { snapshot, writeOptions } = parsed.writeSnapshot;
		if (rejectDroppedAgentRosterEntries({
			currentConfig: snapshot.config,
			submittedConfig: parsed.config,
			respond
		})) return;
		const preparedSecretsSnapshot = await ensureResolvableSecretRefsOrRespond({
			config: parsed.config,
			respond
		});
		if (!preparedSecretsSnapshot) return;
		const writeResult = await commitGatewayConfigWriteOrRespond({
			snapshot,
			writeOptions,
			nextConfig: parsed.writeConfig,
			context,
			respond
		});
		if (!writeResult) return;
		invalidateGatewayRuntimeConfigSchema();
		respond(true, {
			ok: true,
			path: writeResult.path,
			...writeResult.hash ? { hash: context.configRevisionProjector.projectRawHash(writeResult.hash) } : {},
			config: redactConfigObject(writeResult.config, parsed.schema.uiHints),
			...preparedSecretDegradationPayload(preparedSecretsSnapshot)
		}, void 0);
		writeResult.queueFollowUp();
	},
	"config.patch": async (options) => {
		const { params, respond, client, context } = options;
		const authority = readGatewayRequestMutationAuthority(options);
		if (!assertValidParams(params, validateConfigPatchParams, "config.patch", respond)) return;
		const hashlessPatch = resolveBaseHashParam(params) === null;
		const writeSnapshot = hashlessPatch ? await readConfigFileSnapshotForWrite() : await readConfigWriteSnapshotOrRespond(params, respond, context.configRevisionProjector);
		if (!writeSnapshot) return;
		const { snapshot, writeOptions } = writeSnapshot;
		const modelIdNormalizationPolicies = writeOptions.basePluginMetadataSnapshot?.owners.modelIdNormalizationPolicies;
		if (!snapshot.valid) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `${summarizeConfigValidationIssues(snapshot.issues)}; fix (openclaw doctor) before patching`, { details: { issues: snapshot.issues } }));
			return;
		}
		const parsedRes = parseConfigJson5(params.raw);
		if (!parsedRes.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, parsedRes.error));
			return;
		}
		if (!isRecord(parsedRes.parsed)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "config.patch raw must be an object"));
			return;
		}
		const normalizedPatch = normalizeSubmittedConfigModelRefs(parsedRes.parsed, modelIdNormalizationPolicies);
		if (hashlessPatch && !hasHashlessPatchLwwStructure(normalizedPatch)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "config base hash required; re-run config.get and retry"));
			return;
		}
		const replacePaths = normalizeConfigPatchReplacePaths(params.replacePaths);
		try {
			assertNoDuplicateConfigPatchIds({
				patch: normalizedPatch,
				current: snapshot.config,
				replacePaths
			});
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
			return;
		}
		const sourceConfig = normalizeSubmittedConfigModelRefs(snapshot.sourceConfig, modelIdNormalizationPolicies);
		const mergedSource = applyMergePatch(sourceConfig, normalizedPatch, {
			mergeObjectArraysById: true,
			replaceArrayPaths: replacePaths
		});
		const schemaPatch = loadGatewayRuntimeConfigSchema();
		const restoredMerge = restoreRedactedValues(mergedSource, snapshot.config, schemaPatch.uiHints);
		if (!restoredMerge.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, restoredMerge.humanReadableMessage ?? "invalid config"));
			return;
		}
		if (rejectDestructiveArrayPatchWithoutIntent({
			currentConfig: snapshot.config,
			mergedConfig: applyMergePatch(snapshot.config, createMergePatch(sourceConfig, restoredMerge.result)),
			patch: normalizedPatch,
			replacePaths,
			respond
		})) return;
		const restoredChangedPaths = diffConfigLeafPaths(sourceConfig, restoredMerge.result);
		if (hashlessPatch && !restoredChangedPaths.every(isHashlessPatchLwwPath)) {
			const guardedPaths = restoredChangedPaths.filter((path) => !isHashlessPatchLwwPath(path));
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `config base hash required for ${guardedPaths.join(", ")}; re-run config.get and retry with baseHash`));
			return;
		}
		const actor = resolveControlPlaneActor(client);
		if (restoredChangedPaths.length === 0) {
			context?.logGateway?.info(`config.patch noop ${formatControlPlaneActor(actor)} (no changed paths)`);
			respond(true, {
				ok: true,
				noop: true,
				changedPaths: [],
				path: resolveGatewayConfigPath(snapshot),
				...params.response !== "summary" ? { config: redactConfigObject(snapshot.config, schemaPatch.uiHints) } : {}
			}, void 0);
			return;
		}
		const validatedSubmission = validateSubmittedConfigOrRespond({
			candidate: restoredMerge.result,
			pluginMetadataSnapshot: writeOptions.basePluginMetadataSnapshot,
			respond
		});
		if (!validatedSubmission) return;
		const writeConfig = validatedSubmission.validationCandidate;
		const validatedConfig = validatedSubmission.config;
		const preparedSecretsSnapshot = await ensureResolvableSecretRefsOrRespond({
			config: validatedConfig,
			respond
		});
		if (!preparedSecretsSnapshot) return;
		const allowedAgentRosterRemovals = [];
		const sourceEntries = sourceConfig.agents?.entries;
		const patchEntries = normalizedPatch.agents?.entries;
		if (!hashlessPatch && sourceEntries && patchEntries) {
			for (const [id, entry] of Object.entries(patchEntries)) if (entry === null && Object.hasOwn(sourceEntries, id)) allowedAgentRosterRemovals.push(id);
		}
		await commitConfigRestartWrite({
			requestParams: params,
			mode: "config.patch",
			writeSnapshot: {
				...writeSnapshot,
				writeOptions: {
					...writeOptions,
					allowedAgentRosterRemovals,
					assertBeforePublish: () => {
						writeOptions.assertBeforePublish?.();
						authority.assertCurrent();
					}
				}
			},
			writeConfig,
			nextConfig: validatedConfig,
			client,
			context,
			respond,
			uiHints: schemaPatch.uiHints,
			preparedSecretsSnapshot,
			summary: params.response === "summary"
		});
	},
	"config.apply": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateConfigApplyParams, "config.apply", respond)) return;
		const parsed = await prepareConfigReplacementOrRespond(params, respond, context.configRevisionProjector);
		if (!parsed) return;
		const preparedSecretsSnapshot = await ensureResolvableSecretRefsOrRespond({
			config: parsed.config,
			respond
		});
		if (!preparedSecretsSnapshot) return;
		await commitConfigRestartWrite({
			requestParams: params,
			mode: "config.apply",
			writeSnapshot: parsed.writeSnapshot,
			writeConfig: parsed.writeConfig,
			nextConfig: parsed.config,
			client,
			context,
			respond,
			uiHints: parsed.schema.uiHints,
			preparedSecretsSnapshot
		});
	},
	"config.openFile": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateConfigGetParams, "config.openFile", respond)) return;
		const configPath = createConfigIO().configPath;
		const command = resolveOpenPathCommand(configPath);
		try {
			await execOpenPath(command);
			respond(true, {
				ok: true,
				path: configPath
			}, void 0);
		} catch (error) {
			const errorMessage = formatOpenPathError(error);
			const detailedError = isHeadlessOpenPathError(error, command) ? `Cannot open file in headless environment. File path: ${configPath}. This environment appears to lack a graphical or terminal browser handler.` : `Failed to open config file: ${errorMessage}`;
			context?.logGateway?.warn(`config.openFile failed path=${sanitizePathForLog(configPath)}: ${errorMessage}`);
			respond(true, {
				ok: false,
				path: configPath,
				error: detailedError
			}, void 0);
		}
	}
};
//#endregion
export { configHandlers };
