import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { p as getActivePluginRegistryWorkspaceDirFromStateCore } from "./model-ref-shared-BRJ3VRZV.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { r as buildAgentMainSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { S as isCronSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { n as parseModelRef } from "./model-selection-normalize-DulZGI4S.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./io-DIF-KW3P.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { r as getHeader } from "./http-header-value-BM79-5V8.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { t as canonicalizeSessionKeyForAgent } from "./session-store-key-DKpto8R6.mjs";
import { n as readResolvedSessionEntryInWorker } from "./session-accessor.entry-read-runtime-BoYobsOQ.mjs";
import { a as isAgentHarnessSessionKey, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-zbrcLVpT.mjs";
import "./session-accessor.entry-BLpjjUTc.mjs";
import { f as isResolvedIncognitoSession, i as authorizePreparedSessionMutation, y as withSessionSharingTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { c as prepareSessionSharingProfiles, o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-pIK04Peo.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { t as loadGatewayModelCatalog } from "./server-model-catalog-DWoTsvXa.mjs";
import "./http-auth-utils-DvoR_YDD.mjs";
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
function assertKnownAgentId(agentId, cfg = readRuntimeConfig()) {
	if (!listAgentIds(cfg).includes(agentId)) throw new UnknownGatewayAgentError(agentId);
}
function resolveAgentIdFromModel(model, cfg = readRuntimeConfig()) {
	const raw = model?.trim();
	if (!raw) return;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "openclaw" || lowered === "openclaw/default") return resolveDefaultAgentId(cfg);
	const agentId = raw.match(AGENT_MODEL_PATTERN)?.groups?.agentId;
	if (!agentId) return;
	return normalizeAgentId(agentId);
}
/** Maps accepted OpenClaw routing-model spellings to the canonical id listed by `/v1/models`. */
function canonicalizeOpenClawAgentModelId(model) {
	const raw = model?.trim();
	if (!raw) return;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "openclaw" || lowered === "openclaw/default") return lowered;
	const agentId = raw.match(AGENT_MODEL_PATTERN)?.groups?.agentId;
	return agentId ? `openclaw/${normalizeAgentId(agentId)}` : void 0;
}
/** Checks OpenClaw routing-model syntax without resolving fleet ownership. */
function isOpenClawAgentModelId(model) {
	return canonicalizeOpenClawAgentModelId(model) !== void 0;
}
/** Validates and resolves the `x-openclaw-model` override for OpenAI-compatible requests. */
async function resolveOpenAiCompatModelOverride(params) {
	const requestModel = params.model?.trim();
	if (requestModel && !isOpenClawAgentModelId(requestModel)) return { errorMessage: "Invalid `model`. Use `openclaw` or `openclaw/<agentId>`." };
	const raw = getHeader(params.req, "x-openclaw-model")?.trim();
	if (!raw) return {};
	const cfg = readRuntimeConfig();
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
	const cfg = readRuntimeConfig();
	if (params.model?.trim() && !isOpenClawAgentModelId(params.model)) throw new InvalidGatewayModelError();
	const headerAgent = normalizeOptionalString(getHeader(params.req, "x-openclaw-agent-id")) || normalizeOptionalString(getHeader(params.req, "x-openclaw-agent"));
	if (headerAgent) {
		if (!isValidAgentId(headerAgent)) throw new UnknownGatewayAgentError(headerAgent);
		const agentId = normalizeAgentId(headerAgent);
		assertKnownAgentId(agentId, cfg);
		return agentId;
	}
	const fromModel = resolveAgentIdFromModel(params.model, cfg);
	if (fromModel) {
		assertKnownAgentId(fromModel, cfg);
		return fromModel;
	}
	return resolveDefaultAgentId(cfg);
}
async function isReservedSessionKeyOverride(sessionKey, agentId) {
	const lowered = normalizeLowercaseStringOrEmpty(sessionKey);
	const harnessLookupKey = sessionKey.startsWith("agent:") ? sessionKey : canonicalizeSessionKeyForAgent(agentId, sessionKey);
	const harnessEntry = isAgentHarnessSessionKey(sessionKey) ? await readResolvedSessionEntryInWorker({
		cfg: readRuntimeConfig(),
		sessionKey: harnessLookupKey
	}) : void 0;
	const harnessKeyReserved = isAgentHarnessSessionKey(sessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(sessionKey, harnessEntry));
	return lowered.startsWith("subagent:") || lowered.startsWith("cron:") || lowered.startsWith("acp:") || harnessKeyReserved || isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey) || isAcpSessionKey(sessionKey);
}
async function resolveGatewayRequestContext(params) {
	const agentId = resolveAgentIdForRequest({
		req: params.req,
		model: params.model
	});
	const explicit = getHeader(params.req, "x-openclaw-session-key")?.trim();
	let sessionKey;
	if (explicit) {
		if (await isReservedSessionKeyOverride(explicit, agentId)) throw new GatewaySessionKeyOverrideError();
		sessionKey = explicit;
	} else {
		const user = params.user?.trim();
		const mainKey = user ? `${params.sessionPrefix}-user:${user}` : `${params.sessionPrefix}:${randomUUID()}`;
		sessionKey = buildAgentMainSessionKey({
			agentId,
			mainKey
		});
	}
	const messageChannel = normalizeMessageChannel(getHeader(params.req, "x-openclaw-message-channel")) ?? "webchat";
	return {
		agentId,
		sessionKey,
		messageChannel
	};
}
async function authorizeOpenAiCompatibleHttpSession(params) {
	const authenticatedUserProfile = params.requestAuth.authenticatedUserProfile;
	const client = createSyntheticPluginRuntimeClient({
		...authenticatedUserProfile ? { authenticatedUserProfile } : {},
		operatorRoleActor: params.requestAuth.operatorRoleActor,
		operatorAccessAuthority: params.requestAuth.operatorAccessAuthority,
		scopes: params.senderIsOwner ? [ADMIN_SCOPE] : []
	});
	const profiles = await prepareSessionSharingProfiles(client);
	return withSessionSharingTarget({
		cfg: readRuntimeConfig(),
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}, (read) => {
		read.assertCurrent();
		const cfg = readRuntimeConfig();
		const membership = new Set(read.members.map((member) => member.identityId));
		const sharing = prepareProjectedSessionSharing({
			cfg,
			client,
			profiles,
			isMember: (_target, id) => membership.has(id)
		});
		const authorizationError = authorizePreparedSessionMutation({
			cfg,
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		}, {
			target: read.target,
			membership
		}, {
			policy: sharing.policy,
			aliases: profiles.readCurrent().profile?.aliases ?? /* @__PURE__ */ new Set()
		});
		if (authorizationError) return {
			allowed: false,
			message: authorizationError.message
		};
		if (!params.senderIsOwner && !authenticatedUserProfile && isResolvedIncognitoSession({
			cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		}, read.target)) return {
			allowed: false,
			message: `missing scope: ${ADMIN_SCOPE}`
		};
		return { allowed: true };
	});
}
//#endregion
export { isAgentSelectionRequiredError as a, isOpenClawAgentModelId as c, resolveAgentIdFromModel as d, resolveGatewayRequestContext as f, canonicalizeOpenClawAgentModelId as i, isUnknownGatewayAgentError as l, OPENCLAW_MODEL_ID as n, isGatewayAgentRequestError as o, resolveOpenAiCompatModelOverride as p, authorizeOpenAiCompatibleHttpSession as r, isGatewayRequestContextError as s, OPENCLAW_DEFAULT_MODEL_ID as t, resolveAgentIdForRequest as u };
