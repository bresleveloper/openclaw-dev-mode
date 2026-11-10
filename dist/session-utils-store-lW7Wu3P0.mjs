import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { n as listAgentProvenance } from "./agent-provenance-Bj5CtKpW.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-CeM8o97s.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-DXrnO3F4.mjs";
import { b as readUtilityModelSetting, i as buildModelAliasIndex, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { u as resolveExecPolicyForMode } from "./exec-approvals-core-7oJu_fRe.mjs";
import "./io-DIF-KW3P.mjs";
import { t as SESSION_PERMISSION_BY_EXEC_MODE } from "./session-permission-exec-mode-orsENUww.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as listGatewayAgentsBasic } from "./agent-list-CCh58b5o.mjs";
import { a as resolveNativeGatewaySessionStoreTargetWithStore, o as withGatewaySessionStoreTarget, s as withQualifiedGatewaySessionStoreTarget } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { n as omitInternalSessionEffectsEntries, t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { n as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-B5dnCB4A.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-CaRixRbi.mjs";
import { i as resolveGatewayModelThinkingProfile } from "./session-utils-model-Bx2gzKtO.mjs";
import { i as resolveAgentAvatarUrlFromSource } from "./identity-avatar-file-B-RTE8eg.mjs";
import { r as hasWorkspaceGitCheckout } from "./workspace-git-CiP8oVHR.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { a as loadExecApprovalsReadOnlyAsync } from "./exec-approvals-store-BhzM_h1C.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { r as resolveExecDefaults } from "./exec-defaults-DrIV-0KT.mjs";
import { r as resolveConfiguredPrimaryModelForAgent } from "./utility-model-nsnbR10X.mjs";
import { i as resolveGatewayAssistantAvatar } from "./assistant-avatar-DB_cUu5U.mjs";
//#region src/gateway/session-utils-store.ts
/**
* Returns the owning agent id if the session key belongs to an agent that is no
* longer present in config (deleted). Returns null for non-agent legacy/global
* keys, confirmed ACP runtime session keys, or when the owning agent still
* exists (#65524).
*/
function resolveDeletedAgentIdFromSessionKey(cfg, sessionKey, acpMeta) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return null;
	const agentId = normalizeAgentId(parsed.agentId);
	if (listAgentIds(cfg).includes(agentId)) return null;
	if (isAcpSessionKey(sessionKey) && !parsed.rest.startsWith("acp:binding:")) {
		if (acpMeta) return null;
	}
	return agentId;
}
function prepareDeletedAgentSessionCheck(params) {
	const deletedAgentId = resolveDeletedAgentIdFromSessionKey(params.cfg, params.sessionKey);
	if (deletedAgentId === null || !isAcpSessionKey(params.sessionKey) || parseAgentSessionKey(params.sessionKey)?.rest.startsWith("acp:binding:")) return deletedAgentId;
	const keys = /* @__PURE__ */ new Set([normalizeOptionalString(params.acpMetadataSessionKey) ?? params.sessionKey, params.sessionKey]);
	params.assertCurrent?.();
	return readAcpSessionMetaForEntries({
		cfg: params.cfg,
		entries: [...keys].map((sessionKey) => ({
			sessionKey,
			agentId: parseAgentSessionKey(sessionKey)?.agentId ?? tryResolveSessionCompatibilityOwnerAgentId(params.cfg, sessionKey) ?? deletedAgentId,
			entry: params.entry ?? void 0
		}))
	}).then((metadata) => {
		params.assertCurrent?.();
		return metadata.some(Boolean) ? null : deletedAgentId;
	});
}
function loadIncognitoGatewaySessionEntryReadOnly(sessionKey, opts, cfg = readRuntimeConfig()) {
	const key = normalizeOptionalString(sessionKey) ?? "";
	if (!isIncognitoSessionKey(key)) throw new Error("Durable session entries require the asynchronous Gateway reader");
	const target = resolveNativeGatewaySessionStoreTargetWithStore({
		cfg,
		key,
		exactRead: true,
		readOnly: true,
		projection: opts?.projection,
		env: opts?.env,
		targetDiscoveryCache: opts?.targetDiscoveryCache,
		includeStoreChildEntries: opts?.includeStoreChildEntries,
		...opts?.clone === false ? { clone: false } : {},
		...opts?.agentId ? { agentId: opts.agentId } : {}
	});
	const storePath = target.storePath;
	const store = target.store;
	const canonicalMatch = findCanonicalStoreMatch(store, target.storeKeys);
	const legacyKey = canonicalMatch?.key !== target.canonicalKey ? canonicalMatch?.key : void 0;
	const entry = opts?.clone !== false && canonicalMatch?.entry ? structuredClone(canonicalMatch.entry) : canonicalMatch?.entry;
	return {
		cfg,
		agentId: target.agentId,
		storePath,
		store,
		...target.readSource ? { readSource: target.readSource } : {},
		...target.capturedReadSource ? { capturedReadSource: target.capturedReadSource } : {},
		...target.capturedReadSources ? { capturedReadSources: target.capturedReadSources } : {},
		...target.lifecycleTimestamps ? { lifecycleTimestamps: target.lifecycleTimestamps } : {},
		entry,
		canonicalKey: target.canonicalKey,
		storeKeys: target.storeKeys,
		legacyKey
	};
}
async function loadGatewaySessionEntryReadOnlyAsync(sessionKey, opts, cfg = readRuntimeConfig()) {
	const { loadGatewaySessionEntryReadOnlyInWorker } = await import("./session-utils-store-worker-CmMErbaH.mjs");
	return loadGatewaySessionEntryReadOnlyInWorker({
		cfg,
		key: sessionKey,
		...opts,
		readOnly: true
	});
}
/** Consume exact row facts synchronously while their physical worker owners remain retained. */
async function withGatewaySessionEntry(sessionKey, opts, consume, cfg = readRuntimeConfig(), assertConfigCurrent) {
	const assertRoutingCurrent = captureSessionMutationRouting(cfg, void 0, [{
		sessionKey,
		agentId: opts?.agentId
	}]);
	const assertConfig = assertConfigCurrent ?? (() => assertRoutingCurrent(readRuntimeConfig()));
	return withGatewaySessionStoreTarget({
		cfg,
		key: sessionKey,
		...opts
	}, (target, membership, assertSourceCurrent) => {
		omitInternalSessionEffectsEntries(target.store, target.storeKeys);
		const canonicalMatch = findCanonicalStoreMatch(target.store, target.storeKeys);
		const assertCurrent = () => {
			assertSourceCurrent();
			assertConfig();
		};
		assertCurrent();
		return consume({
			cfg,
			...target,
			entry: canonicalMatch?.entry,
			legacyKey: canonicalMatch?.key !== target.canonicalKey ? canonicalMatch?.key : void 0
		}, membership, assertCurrent);
	});
}
async function withQualifiedGatewaySessionEntry(params) {
	return withQualifiedGatewaySessionStoreTarget({
		...params,
		readOptions: {
			transcript: params.transcript,
			lifecycleSessionKey: params.includeLifecycle ? params.target.storeKey : void 0
		},
		consume: (target, membership, assertSourceCurrent) => {
			const canonicalMatch = findCanonicalStoreMatch(target.store, target.storeKeys);
			const storeKey = canonicalMatch?.key ?? params.target.storeKey;
			const assertCurrent = () => {
				assertSourceCurrent();
				params.assertConfigCurrent();
			};
			assertCurrent();
			return params.consume({
				cfg: params.cfg,
				...target,
				entry: canonicalMatch?.entry,
				legacyKey: storeKey !== target.canonicalKey ? storeKey : void 0
			}, membership, assertCurrent);
		}
	});
}
function resolveCanonicalSessionEntryFromStoreKeys(store, storeKeys) {
	return findCanonicalStoreMatch(store, storeKeys)?.entry;
}
function resolveCanonicalGatewaySessionStoreKey(params) {
	const target = params.target;
	const primaryKey = target.canonicalKey;
	findCanonicalStoreMatch(params.store, target.storeKeys);
	return {
		target,
		primaryKey,
		entry: params.store[primaryKey]
	};
}
function parseGroupKey(key) {
	const parts = (parseAgentSessionKey(key)?.rest ?? key).split(":").filter(Boolean);
	if (parts.length >= 3) {
		const [channel, kind, ...rest] = parts;
		if (kind === "group" || kind === "channel") return {
			channel,
			kind,
			id: rest.join(":")
		};
	}
	return null;
}
function isGroupOrChannelDisplaySession(entry, parsed) {
	return entry?.chatType === "group" || entry?.chatType === "channel" || parsed?.kind === "group" || parsed?.kind === "channel";
}
function resolveGatewayAgentModel(cfg, agentId, resolvedModel) {
	const primary = `${resolvedModel.provider}/${resolvedModel.model}`;
	const utilityOnly = !resolveConfiguredPrimaryModelForAgent({
		cfg,
		agentId
	}) && readUtilityModelSetting(cfg, agentId).kind === "explicit";
	const fallbackOverride = resolveAgentModelFallbacksOverride(cfg, agentId);
	const defaultFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
	const fallbacks = dedupeByKey((fallbackOverride ?? defaultFallbacks).map((value) => splitTrailingAuthProfile(value).model.trim()).filter(Boolean), normalizeLowercaseStringOrEmpty);
	return {
		...utilityOnly ? {} : { primary },
		...fallbacks.length > 0 ? { fallbacks } : {}
	};
}
function resolvedPermissionLabel(policy) {
	const { mode } = policy;
	const canonical = resolveExecPolicyForMode(mode);
	return mode !== "allowlist" && policy.security === canonical.security && policy.ask === canonical.ask ? SESSION_PERMISSION_BY_EXEC_MODE[mode] : void 0;
}
async function listAgentsForGateway(cfg, options) {
	const [basic, provenanceRecords, execApprovals] = await Promise.all([
		listGatewayAgentsBasic(cfg),
		listAgentProvenance(),
		loadExecApprovalsReadOnlyAsync()
	]);
	const identityById = /* @__PURE__ */ new Map();
	for (const entry of listAgentEntries(cfg)) {
		if (!entry?.id) continue;
		const agentId = normalizeAgentId(entry.id);
		const avatar = normalizeOptionalString(entry.identity?.avatar);
		const httpAvatar = avatar && options?.httpAvatarBasePath !== void 0 ? (await resolveGatewayAssistantAvatar({
			cfg,
			identity: {
				agentId,
				avatar
			},
			httpBasePath: options.httpAvatarBasePath
		})).avatar : void 0;
		const avatarUrl = httpAvatar ?? await resolveAgentAvatarUrlFromSource(cfg, agentId, avatar);
		const identity = entry.identity ? {
			name: normalizeOptionalString(entry.identity.name),
			theme: normalizeOptionalString(entry.identity.theme),
			emoji: normalizeOptionalString(entry.identity.emoji),
			avatar: httpAvatar ?? avatar,
			avatarUrl
		} : void 0;
		identityById.set(agentId, identity);
	}
	const roster = options?.includeSystem ? basic.agents : basic.agents.filter((entry) => entry.kind !== "system");
	const provenanceById = new Map(provenanceRecords.map((record) => [record.agentId, record]));
	const agents = roster.map((entry) => {
		const { id } = entry;
		const execDefaults = resolveExecDefaults({
			cfg,
			agentId: id,
			execApprovals
		});
		const defaultPermissionMode = resolveSandboxConfigForAgent(cfg, id).mode === "off" ? resolvedPermissionLabel(execDefaults) : void 0;
		const resolvedModel = resolveDefaultModelForAgent({
			cfg,
			agentId: id
		});
		const model = resolveGatewayAgentModel(cfg, id, resolvedModel);
		const utilitySetting = readUtilityModelSetting(cfg, id);
		const selectionParams = {
			cfg,
			agentId: id,
			defaultProvider: resolvedModel.provider
		};
		const utility = utilitySetting.kind === "explicit" ? resolveModelRefFromString({
			...selectionParams,
			raw: utilitySetting.modelRef,
			aliasIndex: buildModelAliasIndex(selectionParams)
		})?.ref : void 0;
		const sessionKey = resolveAgentMainSessionKey({
			cfg,
			agentId: id
		});
		const agentRuntime = projectWorkerPlacementAgentRuntime(resolveModelAgentRuntimeMetadata({
			cfg,
			agentId: id,
			provider: resolvedModel.provider,
			model: resolvedModel.model,
			sessionKey,
			acpRuntime: false
		}));
		const hasAgentCatalog = options?.modelCatalogByAgentId?.has(id);
		const preparedCatalog = options?.modelCatalogByAgentId?.get(hasAgentCatalog ? id : basic.defaultId);
		const thinkingProfile = resolveGatewayModelThinkingProfile({
			cfg,
			agentId: id,
			provider: resolvedModel.provider,
			model: resolvedModel.model,
			modelCatalog: preparedCatalog?.entries,
			sessionKey,
			providerPolicySource: preparedCatalog?.pluginRegistry
		});
		const workspace = resolveAgentWorkspaceDir(cfg, id);
		const workspaceGit = hasWorkspaceGitCheckout(workspace);
		const agent = Object.assign({
			id,
			...entry.admissionRefusal ? {
				status: entry.status,
				admissionRefusal: entry.admissionRefusal
			} : {},
			...options?.includeSystem ? { kind: entry.kind } : {},
			name: entry.name,
			identity: identityById.get(id),
			workspace,
			workspaceGit,
			agentRuntime,
			thinkingLevels: thinkingProfile.thinkingLevels,
			thinkingOptions: thinkingProfile.thinkingLevels.map((level) => level.label),
			thinkingDefault: thinkingProfile.thinkingDefault
		}, { model }, utility ? { utilityModel: `${utility.provider}/${utility.model}` } : {}, defaultPermissionMode ? { defaultPermissionMode } : {});
		const provenance = provenanceById.get(id);
		return provenance ? Object.assign(agent, {
			createdVia: provenance.createdVia,
			creatorAgentId: provenance.creatorAgentId,
			createdAt: provenance.createdAtMs
		}) : agent;
	});
	return {
		defaultId: basic.defaultId,
		ownership: basic.ownership,
		selectionRequired: basic.selectionRequired,
		mainKey: basic.mainKey,
		scope: basic.scope,
		agents
	};
}
//#endregion
export { parseGroupKey as a, resolveCanonicalSessionEntryFromStoreKeys as c, withQualifiedGatewaySessionEntry as d, loadIncognitoGatewaySessionEntryReadOnly as i, resolveDeletedAgentIdFromSessionKey as l, listAgentsForGateway as n, prepareDeletedAgentSessionCheck as o, loadGatewaySessionEntryReadOnlyAsync as r, resolveCanonicalGatewaySessionStoreKey as s, isGroupOrChannelDisplaySession as t, withGatewaySessionEntry as u };
