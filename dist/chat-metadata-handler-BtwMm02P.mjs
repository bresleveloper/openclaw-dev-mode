import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { o as SESSION_READ_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { q as validateChatMetadataParams } from "./src-l2dWvEsN.mjs";
import { W as readUserProfileAliasRevision } from "./user-profiles-internal-DlO1LBbo.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { c as readOperatorRolePolicyRevision } from "./operator-role-policy-BqPaarjx.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-5KDV2tDJ.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { d as hiddenSessionNotFound, u as hasSessionReadAccessChanged } from "./session-sharing-policy-BVt5saXn.mjs";
import { l as createSessionListEntryFilter } from "./session-sharing-target-read-DUttMvj3.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { a as projectModelFastModeCatalog, n as prepareOperatorModelPresentation } from "./operator-model-presentation-CO5pZsTT.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as retainGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-G3aYt8Jc.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-D1br86TX.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-CZ6O5eqZ.mjs";
import { t as preparePersonalModelAccountSelection } from "./users-model-account-access-FDkaQbfU.mjs";
import { t as prepareAuthenticatedProfile } from "./users-profile-access-DD95ZM-3.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/chat-metadata-contract.ts
const chatMetadataSessionFields = [
	"sessionId",
	"lifecycleRevision",
	"sessionStartedAt",
	"acp",
	"agentHarnessId",
	"agentRuntimeOverride",
	"modelSelectionLocked",
	"pluginOwnerId",
	"providerOverride",
	"modelOverride",
	"modelOverrideRouteResolution",
	"modelOverrideFallbackOriginProvider",
	"modelOverrideFallbackOriginModel",
	"authProfileOverride",
	"authProfileOverrideSource",
	"authProfileOverrideCompactionCount"
];
//#endregion
//#region src/gateway/server-methods/chat-metadata-handler.ts
/** Resolve saved-session grants or capture a new draft's current human authority. */
async function resolveChatMetadataReadParams(options, params, draftAccountSelection) {
	const { respond, context, client, signal } = options;
	const cfg = context.getRuntimeConfig();
	draftAccountSelection?.assertCurrent();
	const requester = await prepareAuthenticatedProfile(options);
	requester.assertCurrent();
	const roleRevision = readOperatorRolePolicyRevision();
	const aliasRevision = readUserProfileAliasRevision();
	const profileInput = client?.authenticatedUserProfile?.profileId;
	const userInput = client?.authenticatedUserId;
	const isRequestCurrent = () => !signal?.aborted && readOperatorRolePolicyRevision() === roleRevision && readUserProfileAliasRevision() === aliasRevision && client?.authenticatedUserProfile?.profileId === profileInput && client?.authenticatedUserId === userInput;
	const assertRequestCurrent = () => {
		if (!isRequestCurrent() || context.getRuntimeConfig() !== cfg) throw new PreparedModelRuntimePublicationSupersededError("Chat metadata access changed while preparing its metadata. Retry the request.");
		requester.assertCurrent();
		draftAccountSelection?.assertCurrent();
	};
	if (params.sessionKey) {
		const sessionKey = params.sessionKey;
		const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, normalizeOptionalString(params.agentId));
		if (!requested.ok) {
			respond(false, void 0, requested.error);
			return;
		}
		const requesterProfileId = requester.profileId;
		const session = retainGatewaySessionEntryReadOnly(params.sessionKey, requested.agentId, (previous, current) => !hasSessionReadAccessChanged(previous, current) && chatMetadataSessionFields.every((field) => isDeepStrictEqual(previous[field], current[field])));
		const isCurrent = () => isRequestCurrent() && session.isCurrent();
		const assertVisible = () => {
			const visible = createSessionListEntryFilter({
				client,
				cfg: (context.getCommittedRuntimeConfig ?? context.getRuntimeConfig)()
			});
			if (session.entry && visible?.(session.legacyKey ?? session.canonicalKey, session.entry) === false) throw new SessionMutationAuthorizationChangedError(hiddenSessionNotFound(sessionKey));
		};
		try {
			assertVisible();
			return {
				agentId: resolveSessionAgentId({
					sessionKey: params.sessionKey,
					config: session.cfg,
					agentId: requested.agentId
				}),
				sessionKey: session.canonicalKey,
				storePath: session.readSource?.path ?? session.storePath,
				sessionEntry: session.entry,
				isCurrent,
				assertCurrent: () => {
					assertVisible();
					assertRequestCurrent();
					if (!session.isCurrentAtResponse()) throw new PreparedModelRuntimePublicationSupersededError("Session changed while preparing its metadata. Retry the request.");
				},
				release: session.release,
				requesterProfileId
			};
		} catch (error) {
			session.release();
			throw error;
		}
	}
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg,
		normalize: (id) => typeof id === "string" && id.trim() ? normalizeAgentId(id) : void 0
	});
	if (!resolved) return;
	assertRequestCurrent();
	return {
		agentId: resolved.agentId,
		requesterProfileId: draftAccountSelection?.owner ?? requester.profileId,
		isCurrent: isRequestCurrent,
		assertCurrent: assertRequestCurrent,
		...draftAccountSelection ? { draftAccountSelection } : {}
	};
}
async function handleChatMetadataRequest(options) {
	const { params, respond, context, client } = options;
	if (!assertValidParams(params, validateChatMetadataParams, "chat.metadata", respond)) return;
	let scope;
	try {
		scope = await resolveChatMetadataReadParams(options, params, !params.sessionKey && params.authProfileId ? await preparePersonalModelAccountSelection(options, params.authProfileId, SESSION_READ_SCOPE) : void 0);
		if (!scope) return;
		scope.assertCurrent?.();
		const metadata = await context.readChatMetadata(scope);
		scope.draftAccountSelection?.assertCurrent();
		scope.assertCurrent?.();
		const cfg = context.getRuntimeConfig();
		const policy = prepareOperatorModelPresentation({
			cfg,
			policyConfig: context.getCommittedRuntimeConfig?.() ?? cfg,
			client
		})?.forAgent(scope.agentId, metadata.models);
		respond(true, projectModelFastModeCatalog(policy ? policy.metadata(metadata) : metadata, client));
	} catch (error) {
		if (error instanceof SessionMutationAuthorizationChangedError) {
			respond(false, void 0, error.error);
			return;
		}
		if (!(error instanceof ModelAccountConnectAuthorityError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message));
	} finally {
		scope?.release?.();
	}
}
//#endregion
export { resolveChatMetadataReadParams as n, handleChatMetadataRequest as t };
