import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as resolveSessionAuthProfileOverrideSource, r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { v as isUserModelAuthProfileId, y as parseUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { c as readUserModelAccountSummary } from "./user-model-accounts-sYn17idc.mjs";
import { n as getUserProfileDisplay } from "./user-profile-list-CtETKur7.mjs";
import { s as resolveUserProfileId } from "./user-profiles-DYQbtiqy.mjs";
import { o as getPreparedModelRuntimeAuthMaterializations } from "./prepared-model-runtime-auth-Dn7HF9Vu.mjs";
import { n as readAcpSessionMetaForEntry } from "./session-meta-readonly-CvCR0QQG.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-zMXEXgI3.mjs";
import { n as readSessionRuntimeOwnership } from "./session-utils-model-selection-Bxzwl80r.mjs";
import { i as resolveGatewaySessionRuntimeSelectionLocked } from "./session-utils-projection-Dlr1AjDb.mjs";
import { toUSVString } from "node:util";
//#region src/gateway/server-methods/chat-account-selection.ts
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
	const personal = params.requesterProfileId ? readUserModelAccountSummary({
		profileId: params.requesterProfileId,
		authProfileId
	}) : void 0;
	if (personal) return {
		kind: "personal",
		authProfileId,
		label: personal.label,
		source
	};
	const locator = parseUserModelAuthProfileId(authProfileId);
	const owner = locator ? resolveUserProfileId(locator.ownerProfileId) : void 0;
	const rawDisplayName = owner ? getUserProfileDisplay(owner).displayName?.trim() : void 0;
	const displayName = rawDisplayName ? toUSVString(rawDisplayName) : void 0;
	return {
		kind: "personal",
		label: displayName ? truncateUtf16Safe(`${displayName}'s account`, 256) : "Personal account",
		source
	};
}
//#endregion
//#region src/gateway/server-methods/chat-metadata-session-projection.ts
async function prepareChatMetadataModelProjection(params) {
	const { prepareModelsListResult, createGatewayAgentModelCatalogProjector } = await import("./models-list-result-khzxkrL1.mjs");
	params.assertCurrent?.();
	const snapshot = params.facts.modelCatalog;
	const projector = createGatewayAgentModelCatalogProjector({
		cfg: params.facts.owner.config,
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
	});
	const [modelCatalog, readModels] = await Promise.all([projector.projectCatalog(), prepareModelsListResult({
		source: {
			kind: "gateway",
			context: params.context
		},
		agentId: params.facts.agentId,
		params: { view: "configured" },
		preloadedCatalog: {
			agentId: params.facts.agentId,
			config: params.facts.owner.config,
			snapshot
		},
		preloadedOnly: true,
		catalogProjector: projector
	})]);
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
function projectSessionModelCatalog(readParams, models, config) {
	const ownership = readSessionRuntimeOwnership({
		...readParams,
		config
	});
	if (ownership?.auth !== "native") return models;
	const renderedModel = ownership.modelRef ?? resolveSessionModelRef(config, readParams.sessionEntry, readParams.agentId, { allowPluginNormalization: false });
	return models.map((model) => {
		if (model.provider !== renderedModel.provider || model.id !== renderedModel.model) return model;
		const { available: _available, unavailableReason: _reason, unavailableUntil: _until, ...native } = model;
		return native;
	});
}
function projectChatSessionMetadata(readParams, metadata, config) {
	const projected = metadata.models ? {
		...metadata,
		models: projectSessionModelCatalog(readParams, metadata.models, config)
	} : metadata;
	if (!readParams.sessionKey) return projected;
	const entry = readParams.sessionEntry;
	const acpMeta = entry?.acp ?? (entry ? readAcpSessionMetaForEntry({
		cfg: config,
		sessionKey: readParams.sessionKey,
		agentId: readParams.agentId,
		entry
	}) : void 0);
	return {
		...projected,
		runtimeSelectionLocked: resolveGatewaySessionRuntimeSelectionLocked(entry, acpMeta)
	};
}
//#endregion
export { resolveSessionCatalogProfiles as a, projectSessionModelCatalog as i, prepareChatMetadataModelProjection as n, sessionProjectionKey as o, projectChatSessionMetadata as r, resolveChatAccountSelection as s, hasSessionCatalogContext as t };
