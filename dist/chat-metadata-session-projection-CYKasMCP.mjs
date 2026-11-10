import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./session-key-CSDERtm3.mjs";
import { G as parseUserModelAuthProfileId, W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { g as readUserProfileVersion, n as captureUserProfileAuthorityRead, r as captureUserProfileModelAccountLinksAuthority } from "./user-profile-events-CXjmX5Qy.mjs";
import { i as resolveSessionAuthProfileOverrideSource, r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-DAkjzBhe.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { o as getPreparedModelRuntimeAuthMaterializations } from "./prepared-model-runtime-auth-xGBK6WuU.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { a as resolveGatewaySessionRuntimeSelectionLocked } from "./session-utils-projection-M7JDHtmu.mjs";
import { s as readUserModelAccountSelectionAsync } from "./user-model-account-operations-DIqTwy80.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { n as withCurrentReadAuthority, t as settleCurrentReadPreparations } from "./current-read-authority-CySCga_Z.mjs";
import { t as workerInferenceMetadata } from "./inference-placement-C1SOuYae.mjs";
import { toUSVString } from "node:util";
//#region src/gateway/server-methods/chat-account-selection.ts
async function prepareChatAccountSelection(params) {
	const requesterProfileId = params.readRequesterProfileId ? params.readRequesterProfileId() : params.requesterProfileId;
	const authProfileId = params.sessionEntry?.authProfileOverride?.trim();
	let personal;
	let ownerDisplayName;
	let isCurrent;
	if (authProfileId && isUserModelAuthProfileId(authProfileId)) {
		const { admission } = captureOpenClawStateReadContext();
		const linksCurrent = requesterProfileId ? captureUserProfileModelAccountLinksAuthority(admission, requesterProfileId) : void 0;
		const authority = await captureUserProfileAuthorityRead(admission);
		const displayVersion = readUserProfileVersion();
		const selection = await readUserModelAccountSelectionAsync({
			profileId: requesterProfileId,
			authProfileId
		}, { path: admission.databasePath });
		personal = selection?.personal;
		ownerDisplayName = selection?.owner?.displayName;
		const locator = parseUserModelAuthProfileId(authProfileId);
		const identityCurrent = authority.bind([
			requesterProfileId,
			locator?.ownerProfileId,
			selection?.owner?.profileId
		].filter((id) => id !== void 0));
		isCurrent = () => {
			if (admission.identity.key.startsWith("file:")) assertExistingDatabaseIdentity(admission.databasePath, admission.identity.key, admission.identity.birthtime);
			return Boolean(identityCurrent?.()) && linksCurrent?.() !== false && readUserProfileVersion() === displayVersion;
		};
	}
	return () => {
		if (isCurrent?.() === false || params.sessionEntry?.authProfileOverride?.trim() !== authProfileId || params.readRequesterProfileId && params.readRequesterProfileId() !== requesterProfileId) throw new PreparedModelRuntimePublicationSupersededError("Personal account changed while preparing its metadata. Retry the request.");
		return resolveChatAccountSelection({
			...params,
			personal,
			ownerDisplayName
		});
	};
}
/** The session owns this preference; it is not a receipt for the account that served a turn. */
function resolveChatAccountSelection(params) {
	const authProfileId = params.sessionEntry?.authProfileOverride?.trim();
	if (!authProfileId) return {
		kind: "automatic",
		label: "Automatic account selection"
	};
	const source = resolveSessionAuthProfileOverrideSource(params.sessionEntry);
	if (!isUserModelAuthProfileId(authProfileId)) {
		const credential = params.authStore.profiles[authProfileId];
		return {
			kind: "shared",
			authProfileId,
			label: truncateUtf16Safe(toUSVString(credential?.displayName?.trim() || authProfileId), 256),
			source
		};
	}
	const personal = params.personal;
	if (personal) return {
		kind: "personal",
		authProfileId,
		label: personal.label,
		source
	};
	const rawDisplayName = params.ownerDisplayName?.trim();
	const displayName = rawDisplayName ? toUSVString(rawDisplayName) : void 0;
	return {
		kind: "personal",
		label: displayName ? truncateUtf16Safe(`${displayName}'s account`, 256) : "Personal account",
		source
	};
}
//#endregion
//#region src/gateway/server-methods/chat-metadata-session-projection.ts
function readPreparedChatMetadata(projection, readParams, config, acpMeta, runtimeOwnership, readAccountSelection) {
	readParams.draftAccountSelection?.assertCurrent();
	const { agent } = projection;
	const metadata = {
		...projection.read(),
		...agent.commands !== void 0 ? { commands: agent.commands } : {},
		swarmEnabled: agent.swarmEnabled,
		accountSelection: readAccountSelection?.() ?? resolveChatAccountSelection({
			authStore: agent.authStore,
			sessionEntry: readParams.sessionEntry
		})
	};
	const projected = metadata.models ? {
		...metadata,
		models: projectSessionModelCatalog(readParams, metadata.models, config, runtimeOwnership)
	} : metadata;
	if (!readParams.sessionKey) return projected;
	return {
		...projected,
		runtimeSelectionLocked: resolveGatewaySessionRuntimeSelectionLocked(readParams.sessionEntry, acpMeta ?? void 0),
		requiredWorkerInferenceProfileId: resolveRequiredWorkerInferenceProfileId(readParams, config)
	};
}
async function prepareSessionAcpMeta(params, cfg) {
	if (!params.sessionKey) return null;
	const [meta] = await readAcpSessionMetaForEntries({
		cfg,
		entries: [{
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			entry: params.sessionEntry
		}]
	});
	return meta ?? null;
}
async function prepareChatMetadataModelProjection(params) {
	const [{ prepareModelsListResult }, { prepareModelCatalogDecisions }] = await Promise.all([import("./models-list-result-yX_YwdVs.mjs"), import("./model-catalog-decisions-DxpM2Jvn.mjs")]);
	await withCurrentReadAuthority(params, () => {});
	const snapshot = params.facts.modelCatalog;
	const config = captureRuntimeConfig(params.facts.owner.config);
	const projector = await prepareModelCatalogDecisions({
		cfg: config,
		agentId: params.facts.agentId,
		snapshot,
		metadataSnapshot: params.facts.owner.metadataSnapshot,
		preparedAuthStore: params.facts.authStore,
		accountCatalog: params.facts.owner.accountCatalog,
		requesterProfileId: params.requesterProfileId,
		preparedRuntimeAuthModes: params.facts.authModes,
		preparedRuntimeAuthMaterializations: getPreparedModelRuntimeAuthMaterializations(params.facts.owner),
		pluginRegistry: params.facts.owner.pluginRegistry,
		isCurrent: params.facts.owner.isCurrent,
		observationConfig: params.facts.owner.observationConfig,
		...params.preferredProfileId ? { preferredProfileId: params.preferredProfileId } : {},
		...params.pinnedProfileId ? { pinnedProfileId: params.pinnedProfileId } : {},
		...params.profileProvider ? { profileProvider: params.profileProvider } : {},
		...params.runtimeOverride ? { runtimeOverride: params.runtimeOverride } : {}
	}, params);
	const work = [projector.projectCatalog(params), prepareModelsListResult({
		source: {
			kind: "gateway",
			context: params.context
		},
		agentId: params.facts.agentId,
		params: {
			view: "configured",
			includeDefaultModels: false
		},
		preloadedCatalog: {
			agentId: params.facts.agentId,
			config,
			snapshot
		},
		preloadedOnly: true,
		preparationAuthority: params,
		catalogProjector: projector
	})];
	const [modelCatalog, readModels] = await settleCurrentReadPreparations(work);
	await withCurrentReadAuthority(params, () => {});
	return {
		modelCatalog,
		read: () => ({ models: readModels.read().models }),
		isCurrent: readModels.isCurrent
	};
}
function resolveSessionCatalogProfiles(sessionEntry, config, agentId) {
	const profileId = sessionEntry?.authProfileOverride?.trim();
	const runtime = sessionEntry?.agentRuntimeOverride?.trim();
	const provider = sessionEntry?.providerOverride ?? (runtime ? resolveSessionModelRef(config, sessionEntry, agentId, { allowPluginNormalization: false }).provider : void 0);
	const context = {
		...provider ? { profileProvider: provider } : {},
		...runtime ? { runtimeOverride: runtime } : {}
	};
	if (!profileId) return context;
	const profileSource = resolveCollapsedSessionAuthPinSource(sessionEntry);
	return {
		preferredProfileId: profileId,
		...context,
		...profileSource === "user" ? { pinnedProfileId: profileId } : {}
	};
}
function sessionProjectionKey(agentId, profiles) {
	return [
		normalizeAgentId(agentId),
		profiles.preferredProfileId ?? "",
		profiles.pinnedProfileId ?? "",
		profiles.profileProvider ?? "",
		profiles.runtimeOverride ?? ""
	].join("\0");
}
function hasSessionCatalogContext(profiles) {
	return profiles.preferredProfileId !== void 0 || profiles.pinnedProfileId !== void 0 || profiles.profileProvider !== void 0 || profiles.runtimeOverride !== void 0;
}
function resolveRequiredWorkerInferenceProfileId(readParams, config) {
	const required = config.cloudWorkers?.requiredProfile;
	const profile = required ? config.cloudWorkers?.profiles?.[required] : void 0;
	const runtime = resolveSessionPinnedHarnessId(readParams.sessionEntry) ?? normalizeOptionalAgentRuntimeId(readParams.sessionEntry?.agentRuntimeOverride);
	return readParams.sessionKey && (isDefaultAgentRuntimeId(runtime) || runtime === "openclaw") && profile && workerInferenceMetadata({
		providerId: profile.provider,
		profileSnapshot: profile
	}).inference ? required : void 0;
}
function projectSessionModelCatalog(readParams, models, config, ownership) {
	const requiredWorker = resolveRequiredWorkerInferenceProfileId(readParams, config);
	const nativeAuth = ownership?.auth === "native";
	const entry = readParams.sessionEntry;
	const authProfileSource = resolveCollapsedSessionAuthPinSource(entry);
	const workerAuth = (readParams.workerInference === "worker" || requiredWorker !== void 0) && !entry?.modelOverride?.trim() && !entry?.agentRuntimeOverride?.trim() && !(entry?.authProfileOverride?.trim() && authProfileSource === "user");
	if (!nativeAuth && !workerAuth) return models;
	const renderedModel = ownership?.modelRef ?? resolveSessionModelRef(config, readParams.sessionEntry, readParams.agentId, { allowPluginNormalization: false });
	return models.map((model) => {
		if (model.provider !== renderedModel.provider || model.id !== renderedModel.model) return model;
		if (workerAuth && model.unavailableReason !== "missing-auth" && model.unavailableReason !== "auth-failed") return model;
		const { available: _available, unavailableReason: _reason, unavailableUntil: _until, ...available } = model;
		return available;
	});
}
//#endregion
export { readPreparedChatMetadata as a, prepareChatAccountSelection as c, projectSessionModelCatalog as i, prepareChatMetadataModelProjection as n, resolveSessionCatalogProfiles as o, prepareSessionAcpMeta as r, sessionProjectionKey as s, hasSessionCatalogContext as t };
