import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-C9K4a_6k.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-CG17uXFn.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString, y as readUtilityModelSetting } from "./model-selection-shared-DKlQ1p0S.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { u as resolveExecPolicyForMode } from "./exec-approvals-core-s7tTQC_a.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { n as listAgentProvenance } from "./agent-provenance-H6O0H8k6.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import "./model-selection-D3_rVb38.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { a as loadExecApprovalsReadOnlyAsync } from "./exec-approvals-store-DGp2moY9.mjs";
import { i as resolveAgentAvatarUrlFromSource } from "./identity-avatar-file-CzAdV6tU.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { n as readAcpSessionMetaForEntry } from "./session-meta-readonly-CvCR0QQG.mjs";
import { n as readAcpSessionMeta } from "./session-meta-DUw-8Na0.mjs";
import "./sessions-D_sxp1B4.mjs";
import { t as SESSION_PERMISSION_BY_EXEC_MODE } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
import { a as insideGitCheckout } from "./git-DK_u9XbK.mjs";
import { n as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-BYpiZnNd.mjs";
import { r as resolveExecDefaults } from "./exec-defaults-tLsLm83r.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DW7mpK3L.mjs";
import { o as resolveGatewaySessionStoreTarget, s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-CuE1uM7x.mjs";
import { i as resolveGatewayModelThinkingProfile } from "./session-utils-model-JtZ-2MzK.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-D5yJBcMK.mjs";
import { r as resolveConfiguredPrimaryModelForAgent } from "./utility-model-zUQQg0xn.mjs";
import { t as listGatewayAgentsBasic } from "./agent-list-CjU3FIen.mjs";
import { r as resolveGatewayAssistantAvatar } from "./assistant-avatar-CM_Vhve2.mjs";
//#region src/gateway/session-utils-store.ts
/**
* Returns the owning agent id if the session key belongs to an agent that is no
* longer present in config (deleted). Returns null for non-agent legacy/global
* keys, confirmed ACP runtime session keys, or when the owning agent still
* exists (#65524).
*/
function resolveDeletedAgentIdFromSessionKey(cfg, sessionKey, entry, options) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return null;
	const agentId = normalizeAgentId(parsed.agentId);
	if (listAgentIds(cfg).includes(agentId)) return null;
	if (isAcpSessionKey(sessionKey) && !parsed.rest.startsWith("acp:binding:")) {
		if (options?.acpMeta !== void 0 ? options.acpMeta : readAcpMetaForDeletedAgentCheck({
			cfg,
			sessionKey,
			entry,
			acpMetadataSessionKey: options?.acpMetadataSessionKey
		})) return null;
	}
	return agentId;
}
function readAcpMetaForDeletedAgentCheck(params) {
	if (params.entry?.acp) return params.entry.acp;
	const acpMetadataSessionKey = normalizeOptionalString(params.acpMetadataSessionKey);
	const directKeys = /* @__PURE__ */ new Set();
	if (acpMetadataSessionKey) directKeys.add(acpMetadataSessionKey);
	else {
		const acpMeta = readAcpSessionMeta({
			sessionKey: params.sessionKey,
			cfg: params.cfg
		});
		if (acpMeta) return acpMeta;
	}
	directKeys.add(params.sessionKey);
	for (const directKey of directKeys) {
		const agentId = parseAgentSessionKey(directKey)?.agentId ?? tryResolveSessionCompatibilityOwnerAgentId(params.cfg, directKey);
		const acpMeta = readAcpSessionMetaForEntry({
			sessionKey: directKey,
			...agentId ? { agentId } : {},
			entry: params.entry ?? void 0
		});
		if (acpMeta) return acpMeta;
	}
}
function loadSessionEntryWithMode(sessionKey, opts, readOnly, cfg = getRuntimeConfig()) {
	const key = normalizeOptionalString(sessionKey) ?? "";
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key,
		exactRead: true,
		readOnly,
		projection: opts?.projection,
		env: opts?.env,
		targetDiscoveryCache: opts?.targetDiscoveryCache,
		...opts?.clone === false ? { clone: false } : {},
		...opts?.agentId ? { agentId: opts.agentId } : {},
		...opts?.includeStoreChildEntries ? { includeStoreChildEntries: true } : {}
	});
	const storePath = target.storePath;
	const store = target.store;
	if (!readOnly) {
		for (const storeKey of target.storeKeys) if (isInternalSessionEffectsKey(storeKey)) delete store[storeKey];
	}
	const canonicalMatch = findCanonicalStoreMatch(store, target.storeKeys);
	const legacyKey = canonicalMatch?.key !== target.canonicalKey ? canonicalMatch?.key : void 0;
	const entry = readOnly && opts?.clone !== false && canonicalMatch?.entry ? structuredClone(canonicalMatch.entry) : canonicalMatch?.entry;
	return {
		cfg,
		agentId: target.agentId,
		storePath,
		store,
		...target.readSource ? { readSource: target.readSource } : {},
		...target.capturedReadSource ? { capturedReadSource: target.capturedReadSource } : {},
		...target.capturedReadSources ? { capturedReadSources: target.capturedReadSources } : {},
		entry,
		canonicalKey: target.canonicalKey,
		storeKeys: target.storeKeys,
		legacyKey
	};
}
function loadGatewaySessionEntry(sessionKey, opts, cfg) {
	return loadSessionEntryWithMode(sessionKey, opts, false, cfg);
}
function loadGatewaySessionEntryReadOnly(sessionKey, opts, cfg) {
	return loadSessionEntryWithMode(sessionKey, opts, true, cfg);
}
function resolveCanonicalSessionEntryFromStoreKeys(store, storeKeys) {
	return findCanonicalStoreMatch(store, storeKeys)?.entry;
}
function resolveCanonicalGatewaySessionStoreKey(params) {
	const target = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.key,
		store: params.store,
		...params.agentId ? { agentId: params.agentId } : {}
	});
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
async function listAgentsForGateway(cfg, modelCatalog, options) {
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
		const preparedCatalog = hasAgentCatalog ? options?.modelCatalogByAgentId?.get(id) : modelCatalog ? void 0 : options?.modelCatalogByAgentId?.get(basic.defaultId);
		const agentModelCatalog = hasAgentCatalog ? preparedCatalog?.entries : modelCatalog ?? preparedCatalog?.entries;
		const thinkingProfile = resolveGatewayModelThinkingProfile({
			cfg,
			agentId: id,
			provider: resolvedModel.provider,
			model: resolvedModel.model,
			modelCatalog: agentModelCatalog,
			sessionKey,
			providerPolicySource: preparedCatalog?.pluginRegistry
		});
		const workspace = resolveAgentWorkspaceDir(cfg, id);
		const workspaceGit = insideGitCheckout(workspace);
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
export { parseGroupKey as a, resolveDeletedAgentIdFromSessionKey as c, loadGatewaySessionEntryReadOnly as i, listAgentsForGateway as n, resolveCanonicalGatewaySessionStoreKey as o, loadGatewaySessionEntry as r, resolveCanonicalSessionEntryFromStoreKeys as s, isGroupOrChannelDisplaySession as t };
