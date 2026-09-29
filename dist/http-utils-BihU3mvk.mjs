import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-C5tDvNBc.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, m as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import { S as isSubagentSessionKey, x as isCronSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as parseModelRef } from "./model-selection-normalize-Dij_chYC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { a as isAgentHarnessSessionKey, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { t as canonicalizeSessionKeyForAgent } from "./session-store-key-BoleEY7N.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-CwzWysXO.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-BJsmC-p-.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-Doz1rFpm.mjs";
import { H as isResolvedIncognitoSession, P as authorizeResolvedSessionMutation } from "./session-sharing-C4w_but1.mjs";
import { t as loadGatewayModelCatalog } from "./server-model-catalog-D-Wkj4tH.mjs";
import "./http-auth-utils-BJQtuB_7.mjs";
import { n as getHeader } from "./http-header-value-Be14tJQx.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/http-utils.ts
const OPENCLAW_MODEL_ID = "openclaw";
/** Default OpenAI-compatible model alias that targets the default OpenClaw agent. */
const OPENCLAW_DEFAULT_MODEL_ID = "openclaw/default";
var UnknownGatewayAgentError = class extends Error {
	constructor(agentId) {
		super(`Unknown agent '${agentId}'.`);
		this.agentId = agentId;
		this.name = "UnknownGatewayAgentError";
	}
};
var GatewaySessionKeyOverrideError = class extends Error {
	constructor() {
		super("`x-openclaw-session-key` cannot use reserved internal session namespaces.");
		this.name = "GatewaySessionKeyOverrideError";
	}
};
var InvalidGatewayModelError = class extends Error {
	constructor() {
		super("Invalid `model`. Use `openclaw` or `openclaw/<agentId>`.");
		this.name = "InvalidGatewayModelError";
	}
};
function isUnknownGatewayAgentError(err) {
	return err instanceof UnknownGatewayAgentError;
}
function isAgentSelectionRequiredError(err) {
	return err instanceof AgentSelectionRequiredError;
}
function isInvalidGatewayModelError(err) {
	return err instanceof InvalidGatewayModelError;
}
function isGatewaySessionKeyOverrideError(err) {
	return err instanceof GatewaySessionKeyOverrideError;
}
function assertKnownAgentId(agentId, cfg = getRuntimeConfig()) {
	if (!listAgentIds(cfg).includes(agentId)) throw new UnknownGatewayAgentError(agentId);
}
function resolveAgentIdFromHeader(req) {
	const raw = normalizeOptionalString(getHeader(req, "x-openclaw-agent-id")) || normalizeOptionalString(getHeader(req, "x-openclaw-agent")) || "";
	if (!raw) return;
	if (!isValidAgentId(raw)) throw new UnknownGatewayAgentError(raw);
	return normalizeAgentId(raw);
}
/** Resolves the target agent encoded by an OpenAI-compatible model id. */
function resolveAgentIdFromModel(model, cfg = getRuntimeConfig()) {
	const raw = model?.trim();
	if (!raw) return;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "openclaw" || lowered === "openclaw/default") return resolveDefaultAgentId(cfg);
	const agentId = (raw.match(/^openclaw[:/](?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i) ?? raw.match(/^agent:(?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i))?.groups?.agentId;
	if (!agentId) return;
	return normalizeAgentId(agentId);
}
/** Checks OpenClaw routing-model syntax without resolving fleet ownership. */
function isOpenClawAgentModelId(model) {
	const raw = model?.trim();
	if (!raw) return false;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "openclaw" || lowered === "openclaw/default") return true;
	return /^openclaw[:/][a-z0-9][a-z0-9_-]{0,63}$/i.test(raw) || /^agent:[a-z0-9][a-z0-9_-]{0,63}$/i.test(raw);
}
/** Validates and resolves the `x-openclaw-model` override for OpenAI-compatible requests. */
async function resolveOpenAiCompatModelOverride(params) {
	const requestModel = params.model?.trim();
	if (requestModel && !isOpenClawAgentModelId(requestModel)) return { errorMessage: "Invalid `model`. Use `openclaw` or `openclaw/<agentId>`." };
	const raw = getHeader(params.req, "x-openclaw-model")?.trim();
	if (!raw) return {};
	const cfg = getRuntimeConfig();
	const defaultProvider = resolveDefaultModelForAgent({
		cfg,
		agentId: params.agentId
	}).provider;
	const workspaceDir = getActivePluginRegistryWorkspaceDirFromState();
	const modelManifestContext = { manifestPlugins: getCurrentPluginMetadataSnapshot({
		config: cfg,
		env: process.env,
		...workspaceDir ? { workspaceDir } : {}
	}) };
	const parsed = parseModelRef(raw, defaultProvider, {
		allowManifestNormalization: true,
		allowPluginNormalization: true,
		...modelManifestContext
	});
	if (!parsed) return { errorMessage: "Invalid `x-openclaw-model`." };
	const catalog = await loadGatewayModelCatalog({ agentId: params.agentId });
	const policy = createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider,
		agentId: params.agentId,
		allowManifestNormalization: true,
		allowPluginNormalization: true,
		...modelManifestContext
	});
	const normalized = modelKey(parsed.provider, parsed.model);
	if (!policy.allows(parsed)) return { errorMessage: `Model '${normalized}' is not allowed for agent '${params.agentId}'.` };
	return { modelOverride: raw };
}
/** Resolves the request agent from headers, model alias, or the configured default. */
function resolveAgentIdForRequest(params) {
	const cfg = getRuntimeConfig();
	if (params.model?.trim() && !isOpenClawAgentModelId(params.model)) throw new InvalidGatewayModelError();
	const fromHeader = resolveAgentIdFromHeader(params.req);
	if (fromHeader) {
		assertKnownAgentId(fromHeader, cfg);
		return fromHeader;
	}
	const fromModel = resolveAgentIdFromModel(params.model, cfg);
	if (fromModel) {
		assertKnownAgentId(fromModel, cfg);
		return fromModel;
	}
	return resolveDefaultAgentId(cfg);
}
function resolveSessionKey(params) {
	const explicit = getHeader(params.req, "x-openclaw-session-key")?.trim();
	if (explicit) {
		if (isReservedSessionKeyOverride(explicit, params.agentId)) throw new GatewaySessionKeyOverrideError();
		return explicit;
	}
	const user = params.user?.trim();
	const mainKey = user ? `${params.prefix}-user:${user}` : `${params.prefix}:${randomUUID()}`;
	return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey
	});
}
function isReservedSessionKeyOverride(sessionKey, agentId) {
	const lowered = normalizeLowercaseStringOrEmpty(sessionKey);
	const harnessLookupKey = sessionKey.startsWith("agent:") ? sessionKey : canonicalizeSessionKeyForAgent(agentId, sessionKey);
	const harnessEntry = isAgentHarnessSessionKey(sessionKey) ? resolveSessionEntryAccessTarget({
		cfg: getRuntimeConfig(),
		sessionKey: harnessLookupKey
	}).entry : void 0;
	const harnessKeyReserved = isAgentHarnessSessionKey(sessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(sessionKey, harnessEntry));
	return lowered.startsWith("subagent:") || lowered.startsWith("cron:") || lowered.startsWith("acp:") || harnessKeyReserved || isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey) || isAcpSessionKey(sessionKey);
}
/** Resolves gateway agent/session/channel context for OpenAI-compatible handlers. */
function resolveGatewayRequestContext(params) {
	const agentId = resolveAgentIdForRequest({
		req: params.req,
		model: params.model
	});
	return {
		agentId,
		sessionKey: resolveSessionKey({
			req: params.req,
			agentId,
			user: params.user,
			prefix: params.sessionPrefix
		}),
		messageChannel: params.useMessageChannelHeader ? normalizeMessageChannel(getHeader(params.req, "x-openclaw-message-channel")) ?? params.defaultMessageChannel : params.defaultMessageChannel
	};
}
function authorizeOpenAiCompatibleHttpSession(params) {
	const cfg = getRuntimeConfig();
	const authenticatedUserProfile = params.requestAuth.authenticatedUserProfile;
	const authorizationError = authorizeResolvedSessionMutation({
		cfg,
		client: createSyntheticPluginRuntimeClient({
			...authenticatedUserProfile ? { authenticatedUserProfile } : {},
			operatorRoleActor: params.requestAuth.operatorRoleActor,
			operatorAccessAuthority: params.requestAuth.operatorAccessAuthority,
			scopes: params.senderIsOwner ? [ADMIN_SCOPE] : []
		}),
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (authorizationError) return {
		allowed: false,
		message: authorizationError.message
	};
	if (!params.senderIsOwner && !authenticatedUserProfile && isResolvedIncognitoSession({
		cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	})) return {
		allowed: false,
		message: `missing scope: ${ADMIN_SCOPE}`
	};
	return { allowed: true };
}
//#endregion
export { isGatewaySessionKeyOverrideError as a, isUnknownGatewayAgentError as c, resolveGatewayRequestContext as d, resolveOpenAiCompatModelOverride as f, isAgentSelectionRequiredError as i, resolveAgentIdForRequest as l, OPENCLAW_MODEL_ID as n, isInvalidGatewayModelError as o, authorizeOpenAiCompatibleHttpSession as r, isOpenClawAgentModelId as s, OPENCLAW_DEFAULT_MODEL_ID as t, resolveAgentIdFromModel as u };
