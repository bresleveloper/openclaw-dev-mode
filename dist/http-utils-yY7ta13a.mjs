import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { S as isCronSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { f as getActivePluginRegistryWorkspaceDirFromStateCore } from "./model-ref-shared-KBg0y299.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { n as parseModelRef } from "./model-selection-normalize-AjjSfI-g.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { a as isAgentHarnessSessionKey, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-D8EQIzja.mjs";
import { r as getHeader } from "./http-header-value-BM79-5V8.mjs";
import "./method-scopes-BrMPjfvW.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-Di4jQk7u.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { t as canonicalizeSessionKeyForAgent } from "./session-store-key-Ci099tm9.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-BqJElO3o.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-C9Xz8Ynt.mjs";
import { a as authorizeResolvedSessionMutation, p as isResolvedIncognitoSession } from "./session-sharing-policy-4QkIpHi4.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { t as loadGatewayModelCatalog } from "./server-model-catalog-ByWMet2_.mjs";
import "./http-auth-utils-Bk1YwS0V.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/http-utils.ts
const OPENCLAW_MODEL_ID = "openclaw";
/** Default OpenAI-compatible model alias that targets the default OpenClaw agent. */
const OPENCLAW_DEFAULT_MODEL_ID = "openclaw/default";
const AGENT_MODEL_PATTERN = /^(?:openclaw[:/]|agent:)(?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i;
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
function isGatewayAgentRequestError(err) {
	return isAgentSelectionRequiredError(err) || err instanceof InvalidGatewayModelError || isUnknownGatewayAgentError(err);
}
function isGatewayRequestContextError(err) {
	return isGatewayAgentRequestError(err) || err instanceof GatewaySessionKeyOverrideError;
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
	const agentId = raw.match(AGENT_MODEL_PATTERN)?.groups?.agentId;
	if (!agentId) return;
	return normalizeAgentId(agentId);
}
/** Checks OpenClaw routing-model syntax without resolving fleet ownership. */
function isOpenClawAgentModelId(model) {
	const raw = model?.trim();
	if (!raw) return false;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "openclaw" || lowered === "openclaw/default") return true;
	return AGENT_MODEL_PATTERN.test(raw);
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
	const workspaceDir = getActivePluginRegistryWorkspaceDirFromStateCore();
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
export { isGatewayAgentRequestError as a, isUnknownGatewayAgentError as c, resolveGatewayRequestContext as d, resolveOpenAiCompatModelOverride as f, isAgentSelectionRequiredError as i, resolveAgentIdForRequest as l, OPENCLAW_MODEL_ID as n, isGatewayRequestContextError as o, authorizeOpenAiCompatibleHttpSession as r, isOpenClawAgentModelId as s, OPENCLAW_DEFAULT_MODEL_ID as t, resolveAgentIdFromModel as u };
