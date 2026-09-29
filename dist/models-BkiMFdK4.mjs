import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Cn as validateModelsListParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-CMUHZZob.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DCjK5aia.mjs";
import { r as resolveAuthenticatedProfileId } from "./users-profile-access-YpysuaBj.mjs";
import { n as resolveChatMetadataReadParams } from "./chat-metadata-handler-DMlZ_Dbo.mjs";
import { i as projectSessionModelCatalog } from "./chat-metadata-session-projection-CWI8MG-_.mjs";
import { t as buildModelsListResult } from "./models-list-result-CoAWHt84.mjs";
//#region src/gateway/server-methods/models.ts
const modelsHandlers = { "models.list": async (options) => {
	const { params, respond, context, client } = options;
	if (!assertValidParams(params, validateModelsListParams, "models.list", respond)) return;
	let scope;
	try {
		const scoped = Boolean(params.sessionKey || params.authProfileId);
		scope = scoped ? resolveChatMetadataReadParams(options, params) : void 0;
		if (scoped && !scope) return;
		const cfg = context.getRuntimeConfig();
		const resolved = scope ?? resolveAgentIdOrRespondError({
			rawAgentId: params.agentId ?? tryResolveAmbientOwnerAgentId(cfg),
			respond,
			cfg,
			normalize: normalizeOptionalString
		});
		if (!resolved) return;
		const result = await buildModelsListResult({
			source: {
				kind: "gateway",
				context
			},
			agentId: resolved.agentId,
			params,
			includeManualSelection: hasGatewayClientCap(client?.connect.caps, GATEWAY_CLIENT_CAPS.MODEL_SELECTION_POLICY),
			requesterProfileId: scope?.requesterProfileId ?? resolveAuthenticatedProfileId(client),
			...scope ? { readScope: scope } : {}
		});
		scope?.draftAccountSelection?.assertCurrent();
		scope?.assertCurrent?.();
		respond(true, scope && params.view !== "provider-config" ? {
			...result,
			models: projectSessionModelCatalog(scope, result.models, context.getRuntimeConfig())
		} : result, void 0);
	} catch (error) {
		if (error instanceof PreparedModelRuntimePublicationSupersededError) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, {
				retryable: true,
				retryAfterMs: 0
			}));
			return;
		}
		if (!(error instanceof ModelAccountConnectAuthorityError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message));
	} finally {
		scope?.release?.();
	}
} };
//#endregion
export { modelsHandlers };
