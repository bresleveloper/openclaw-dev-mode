import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, O as listAgentIds, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-DKxKaZGG.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString, y as readUtilityModelSetting } from "./model-selection-shared-0uvJbX1M.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-CTuYDtny.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { f as resolveExecPolicyForMode } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { d as listAgentProvenance } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { i as loadExecApprovals } from "./exec-approvals-store-CTT-ox-I.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-BBylVEaq.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { r as readAcpSessionMeta } from "./session-meta-DHUOlEoy.mjs";
import { t as readAcpSessionMetaForEntry } from "./session-meta-readonly-CY2eWmkz.mjs";
import "./sessions-Cesa3L0p.mjs";
import { t as SESSION_PERMISSION_BY_EXEC_MODE } from "./session-permission-exec-mode-Bn0mEuts.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { o as insideGitCheckout } from "./git-DSwuA7YL.mjs";
import { a as resolveGatewaySessionStoreTarget, o as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-CVR56ULk.mjs";
import { n as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata--JWhWgO5.mjs";
import { n as resolveExecDefaults } from "./exec-defaults-aBiGwrXO.mjs";
import { r as resolveAgentAvatarUrlFromSource } from "./identity-avatar-file-DbxXI2gj.mjs";
import { n as resolveConfiguredPrimaryModelForAgent } from "./utility-model-Bk8FTgwT.mjs";
import { t as listGatewayAgentsBasic } from "./agent-list-BEVnf1d5.mjs";
import { r as resolveGatewayAssistantAvatar } from "./assistant-avatar-D6yA4rZS.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-PDZExznz.mjs";
import { i as resolveGatewayModelThinkingProfile } from "./session-utils-model-CUQjuht1.mjs";
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
	const canonicalMatch = resolveCanonicalSessionStoreMatchFromStoreKeys(store, target.storeKeys);
	const legacyKey = canonicalMatch?.key !== target.canonicalKey ? canonicalMatch?.key : void 0;
	const entry = readOnly && opts?.clone !== false && canonicalMatch?.entry ? structuredClone(canonicalMatch.entry) : canonicalMatch?.entry;
	return {
		cfg,
		agentId: target.agentId,
		storePath,
		store,
		...target.readSource ? { readSource: target.readSource } : {},
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
/** Returns the one canonical entry and the exact persisted key that owns it. */
function resolveCanonicalSessionStoreMatchFromStoreKeys(store, storeKeys) {
	let selected;
	for (const key of storeKeys) {
		const entry = store[key];
		if (!entry) continue;
		const match = {
			key,
			entry
		};
		if (selected) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${storeKeys[0] ?? key}`);
		selected = match;
	}
	if (selected && selected.key !== storeKeys[0]) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${storeKeys[0] ?? selected.key}`);
	return selected;
}
function resolveCanonicalSessionEntryFromStoreKeys(store, storeKeys) {
	return resolveCanonicalSessionStoreMatchFromStoreKeys(store, storeKeys)?.entry;
}
function resolveCanonicalGatewaySessionStoreKey(params) {
	const target = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.key,
		store: params.store,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	const primaryKey = target.canonicalKey;
	resolveCanonicalSessionStoreMatchFromStoreKeys(params.store, target.storeKeys);
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
function normalizeFallbackList(values) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const value of values) {
		const trimmed = value.trim();
		if (!trimmed) continue;
		const key = normalizeLowercaseStringOrEmpty(trimmed);
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(trimmed);
	}
	return out;
}
function resolveGatewayAgentModel(cfg, agentId, resolvedModel) {
	const primary = `${resolvedModel.provider}/${resolvedModel.model}`;
	const utilityOnly = !resolveConfiguredPrimaryModelForAgent({
		cfg,
		agentId
	}) && readUtilityModelSetting(cfg, agentId).kind === "explicit";
	const fallbackOverride = resolveAgentModelFallbacksOverride(cfg, agentId);
	const defaultFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
	const fallbacks = normalizeFallbackList((fallbackOverride ?? defaultFallbacks).map((value) => splitTrailingAuthProfile(value).model));
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
	const basic = listGatewayAgentsBasic(cfg);
	const provenanceRecords = await listAgentProvenance();
	const execApprovals = loadExecApprovals();
	const identityById = /* @__PURE__ */ new Map();
	for (const entry of listAgentEntries(cfg)) {
		if (!entry?.id) continue;
		const agentId = normalizeAgentId(entry.id);
		const avatar = normalizeOptionalString(entry.identity?.avatar);
		const httpAvatar = avatar && options?.httpAvatarBasePath !== void 0 ? resolveGatewayAssistantAvatar({
			cfg,
			identity: {
				agentId,
				avatar
			},
			httpBasePath: options.httpAvatarBasePath
		}).avatar : void 0;
		const avatarUrl = httpAvatar ?? resolveAgentAvatarUrlFromSource(cfg, agentId, avatar);
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
export { parseGroupKey as a, resolveCanonicalSessionStoreMatchFromStoreKeys as c, loadGatewaySessionEntryReadOnly as i, resolveDeletedAgentIdFromSessionKey as l, listAgentsForGateway as n, resolveCanonicalGatewaySessionStoreKey as o, loadGatewaySessionEntry as r, resolveCanonicalSessionEntryFromStoreKeys as s, isGroupOrChannelDisplaySession as t };
