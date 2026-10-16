import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { o as SESSION_READ_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { Tn as validateModelsListParams } from "./src-l2dWvEsN.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as authorizeCurrentOperatorRoleScopes } from "./operator-role-policy-BqPaarjx.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-5KDV2tDJ.mjs";
import { c as applyRemoteModelCatalogUpdate } from "./prepared-model-runtime-B8unFFC9.mjs";
import { f as refreshExpiredPreparedModelCatalog } from "./prepared-model-catalog-DB_HuZmL.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { a as projectModelFastModeCatalog, n as prepareOperatorModelPresentation } from "./operator-model-presentation-B_liypCy.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-D1br86TX.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-wfMmajkJ.mjs";
import { n as resolveChatMetadataReadParams } from "./chat-metadata-handler-B7h1yvcw.mjs";
import { t as preparePersonalModelAccountSelection } from "./users-model-account-access-CNkupmnu.mjs";
import { i as projectSessionModelCatalog } from "./chat-metadata-session-projection-D6fB6baF.mjs";
import { i as UnknownModelCatalogProviderError, t as buildModelsListResult } from "./models-list-result-DWY3Hxul.mjs";
//#region src/gateway/server-methods/models.ts
const modelsHandlers = { "models.list": async (options) => {
	const { params, respond, context, client } = options;
	if (!assertValidParams(params, validateModelsListParams, "models.list", respond)) return;
	let scope;
	let publicationScope;
	try {
		const scoped = Boolean(params.sessionKey || params.authProfileId);
		const draftAccountSelection = !params.sessionKey && params.authProfileId ? await preparePersonalModelAccountSelection(options, params.authProfileId, SESSION_READ_SCOPE) : void 0;
		scope = scoped ? await resolveChatMetadataReadParams(options, params, draftAccountSelection) : void 0;
		if (scoped && !scope) return;
		const cfg = context.getRuntimeConfig();
		const resolved = scope ?? resolveAgentIdOrRespondError({
			rawAgentId: params.agentId ?? tryResolveAmbientOwnerAgentId(cfg),
			respond,
			cfg,
			normalize: normalizeOptionalString
		});
		if (!resolved) return;
		if (!scope) {
			const roleError = authorizeCurrentOperatorRoleScopes(client, cfg);
			if (roleError) {
				respond(false, void 0, roleError);
				return;
			}
			const scopes = client?.connect.scopes ?? [];
			if (roleScopesAllow({
				role: "operator",
				requestedScopes: ["operator.sessions.read"],
				allowedScopes: scopes
			}) && !roleScopesAllow({
				role: "operator",
				requestedScopes: ["operator.read"],
				allowedScopes: scopes
			})) {
				scope = await resolveChatMetadataReadParams(options, { agentId: resolved.agentId });
				if (!scope) return;
			}
		}
		publicationScope = scope ?? await resolveChatMetadataReadParams(options, { agentId: resolved.agentId });
		if (!publicationScope) return;
		publicationScope.assertCurrent?.();
		if (params.refresh !== true) refreshExpiredPreparedModelCatalog({
			agentId: resolved.agentId,
			config: cfg
		});
		const includeManualSelection = hasGatewayClientCap(client?.connect.caps, GATEWAY_CLIENT_CAPS.MODEL_SELECTION_POLICY);
		const result = (!scope && params.refresh !== true ? await context.readPreparedModelsList?.({
			agentId: resolved.agentId,
			params,
			includeManualSelection,
			requesterProfileId: publicationScope.requesterProfileId
		}) : void 0) ?? await buildModelsListResult({
			source: {
				kind: "gateway",
				context
			},
			agentId: resolved.agentId,
			params,
			includeManualSelection,
			requesterProfileId: publicationScope.requesterProfileId,
			readScope: scope,
			publicationScope
		});
		publicationScope.draftAccountSelection?.assertCurrent();
		publicationScope.assertCurrent?.();
		const currentConfig = context.getRuntimeConfig();
		const projected = scope && params.view !== "provider-config" ? {
			...result,
			models: projectSessionModelCatalog(scope, result.models, currentConfig)
		} : result;
		const policy = prepareOperatorModelPresentation({
			cfg: currentConfig,
			policyConfig: context.getCommittedRuntimeConfig?.() ?? currentConfig,
			client
		})?.forAgent(resolved.agentId, projected.models);
		respond(true, projectModelFastModeCatalog(policy ? policy.catalog(projected) : projected, client), void 0);
		if (params.refresh === true) Promise.resolve().then(() => applyRemoteModelCatalogUpdate(context.getRuntimeConfig)).catch((error) => {
			context.logGateway.warn("remote model catalog adoption failed", { error: String(error) });
		});
	} catch (error) {
		if (error instanceof UnknownModelCatalogProviderError) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
			return;
		}
		if (error instanceof SessionMutationAuthorizationChangedError) {
			respond(false, void 0, error.error);
			return;
		}
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
		(publicationScope ?? scope)?.release?.();
	}
} };
//#endregion
export { modelsHandlers };
