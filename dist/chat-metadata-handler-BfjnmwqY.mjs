import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { K as validateChatMetadataParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { v as readGatewayAccessRevision } from "./operator-role-policy-Bt6aG_wj.mjs";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { B as hiddenSessionNotFound, E as createSessionListEntryFilter } from "./session-sharing-C_5FkkwM.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as normalizeOptionalChatText } from "./chat-text-normalization-HsVzW9xs.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-gjbDbUD5.mjs";
import { t as retainGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-BnB-xa1-.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DCjK5aia.mjs";
import { r as resolveAuthenticatedProfileId } from "./users-profile-access-CP66FGZy.mjs";
import { t as preparePersonalModelAccountSelection } from "./users-model-account-access-DlgTxbVh.mjs";
//#region src/gateway/server-methods/chat-metadata-handler.ts
/** Resolve saved-session grants or capture a new draft's current human authority. */
function resolveChatMetadataReadParams(options, params) {
	const { respond, context, client, signal } = options;
	const cfg = context.getRuntimeConfig();
	if (params.sessionKey) {
		const sessionKey = params.sessionKey;
		const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, normalizeOptionalChatText(params.agentId));
		if (!requested.ok) {
			respond(false, void 0, requested.error);
			return;
		}
		const accessRevision = readGatewayAccessRevision();
		const requesterProfileId = resolveAuthenticatedProfileId(client);
		const profileInput = client?.authenticatedUserProfile?.profileId;
		const userInput = client?.authenticatedUserId;
		const session = retainGatewaySessionEntryReadOnly(params.sessionKey, requested.agentId);
		const assertVisible = () => {
			const visible = createSessionListEntryFilter({
				client,
				cfg: context.getRuntimeConfig()
			});
			if (session.entry && visible?.(session.legacyKey ?? session.canonicalKey, session.entry) === false) throw new SessionMutationAuthorizationChangedError(hiddenSessionNotFound(sessionKey));
		};
		const isCurrent = () => !signal?.aborted && readGatewayAccessRevision() === accessRevision && client?.authenticatedUserProfile?.profileId === profileInput && client?.authenticatedUserId === userInput && session.isCurrent();
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
					if (!isCurrent() || context.getRuntimeConfig() !== cfg || !session.isCurrentAtResponse()) throw new PreparedModelRuntimePublicationSupersededError("Session changed while preparing its metadata. Retry the request.");
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
	const draftAccountSelection = params.authProfileId ? preparePersonalModelAccountSelection({
		client,
		context,
		signal
	}, params.authProfileId, "operator.read") : void 0;
	return {
		agentId: resolved.agentId,
		requesterProfileId: draftAccountSelection?.owner ?? resolveAuthenticatedProfileId(client),
		...draftAccountSelection ? { draftAccountSelection } : {}
	};
}
async function handleChatMetadataRequest(options) {
	const { params, respond, context } = options;
	if (!assertValidParams(params, validateChatMetadataParams, "chat.metadata", respond)) return;
	let scope;
	try {
		scope = resolveChatMetadataReadParams(options, params);
		if (!scope) return;
		const metadata = await context.readChatMetadata(scope);
		scope.draftAccountSelection?.assertCurrent();
		scope.assertCurrent?.();
		respond(true, metadata);
	} catch (error) {
		if (!(error instanceof ModelAccountConnectAuthorityError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message));
	} finally {
		scope?.release?.();
	}
}
//#endregion
export { resolveChatMetadataReadParams as n, handleChatMetadataRequest as t };
