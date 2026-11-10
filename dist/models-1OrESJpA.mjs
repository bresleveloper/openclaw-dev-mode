import { f as ModelAccountConnectAuthorityError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape, Wn as validateModelsListParams } from "./src-pLJQA6J5.mjs";
import { o as SESSION_READ_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as authorizeCurrentOperatorRoleScopes } from "./operator-role-policy-Coro3qc5.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { t as createPreparedReadHandler } from "./prepared-read-C_6yTKv-.mjs";
import { a as projectModelFastModeCatalog, n as prepareOperatorModelPresentation } from "./operator-model-presentation-C1cUPSmr.mjs";
import { i as readSessionRuntimeOwnershipAsync } from "./session-utils-model-selection-pzj_r9Dj.mjs";
import { t as sessionModelRevision } from "./session-model-revision-CBPmDUHh.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { c as applyRemoteModelCatalogUpdate } from "./prepared-model-runtime-wDlPVSla.mjs";
import { r as getPublishedPreparedModelCatalogOwnerSnapshot } from "./prepared-model-catalog-B9Dr8wIV.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BTlRmOxU.mjs";
import { n as resolveChatMetadataReadParams } from "./chat-metadata-handler-D7b65rB5.mjs";
import { t as preparePersonalModelAccountSelection } from "./users-model-account-access-CmjctvSj.mjs";
import { i as projectSessionModelCatalog } from "./chat-metadata-session-projection-CYKasMCP.mjs";
import { r as UnknownModelCatalogProviderError, t as buildModelsListResult } from "./models-list-result-CVnWrwic.mjs";
//#region src/gateway/server-methods/models.ts
const modelsHandlers = { "models.list": createPreparedReadHandler(async (options) => {
	const { params, respond: respondToCaller, context, client } = options;
	if (!assertValidParams(params, validateModelsListParams, "models.list", respondToCaller)) return;
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
			respond: respondToCaller,
			cfg
		});
		if (!resolved) return;
		if (!scope) {
			const roleError = authorizeCurrentOperatorRoleScopes(client, cfg);
			if (roleError) {
				respondToCaller(false, void 0, roleError);
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
		const preparedScope = publicationScope;
		const assertCurrent = () => {
			preparedScope.draftAccountSelection?.assertCurrent();
			preparedScope.assertCurrent?.();
		};
		const { ensureGatewayPreparedModelRuntimeReady } = await import("./prepared-model-runtime-Dd6wQg9H.mjs");
		assertCurrent();
		await ensureGatewayPreparedModelRuntimeReady({ agentId: resolved.agentId });
		assertCurrent();
		if (params.refresh !== true) {
			const owner = getPublishedPreparedModelCatalogOwnerSnapshot({
				agentId: resolved.agentId,
				config: cfg
			});
			owner?.recheckNativeLogin?.();
			if (!params.preparedOnly && params.view !== "provider-config") {
				await owner?.loadNativeModelCatalog?.();
				assertCurrent();
			}
		}
		return {
			assertCurrent,
			release: preparedScope.release,
			run: async (respond) => {
				const includeManualSelection = hasGatewayClientCap(client?.connect.caps, GATEWAY_CLIENT_CAPS.MODEL_SELECTION_POLICY);
				const listParams = () => ({
					agentId: resolved.agentId,
					params,
					includeManualSelection,
					requesterProfileId: preparedScope.requesterProfileId,
					readScope: scope
				});
				const result = (params.refresh !== true ? await context.readPreparedModelsList?.(listParams()) : void 0) ?? await buildModelsListResult({
					source: {
						kind: "gateway",
						context
					},
					...listParams(),
					publicationScope: preparedScope
				});
				const runtimeOwnership = scope && params.view !== "provider-config" ? await readSessionRuntimeOwnershipAsync({
					...scope,
					config: context.getRuntimeConfig(),
					assertCurrent
				}) : void 0;
				const publish = () => {
					assertCurrent();
					const currentConfig = context.getRuntimeConfig();
					const projected = scope && params.view !== "provider-config" ? {
						...result,
						...scope.sessionKey ? { sessionModelRevision: sessionModelRevision(scope.sessionEntry, scope.workerInference) } : {},
						models: projectSessionModelCatalog(scope, result.models, currentConfig, runtimeOwnership)
					} : result;
					const policy = prepareOperatorModelPresentation({
						cfg: currentConfig,
						policyConfig: context.getCommittedRuntimeConfig?.() ?? currentConfig,
						client
					})?.forAgent(resolved.agentId, projected.models);
					respond(true, projectModelFastModeCatalog(policy ? policy.catalog(projected) : projected, client), void 0);
				};
				if (preparedScope.withCurrent) await preparedScope.withCurrent(publish);
				else publish();
				if (params.refresh === true) Promise.resolve().then(() => applyRemoteModelCatalogUpdate(context.getRuntimeConfig)).catch((error) => {
					context.logGateway.warn("remote model catalog adoption failed", { error: String(error) });
				});
			}
		};
	} catch (error) {
		(publicationScope ?? scope)?.release?.();
		throw error;
	}
}, (error, { respond }) => {
	let failure;
	if (error instanceof UnknownModelCatalogProviderError) failure = errorShape(ErrorCodes.INVALID_REQUEST, error.message);
	else if (error instanceof SessionMutationAuthorizationChangedError) failure = error.error;
	else if (error instanceof PreparedModelRuntimePublicationSupersededError) failure = errorShape(ErrorCodes.UNAVAILABLE, error.message, {
		retryable: true,
		retryAfterMs: 0
	});
	else if (error instanceof ModelAccountConnectAuthorityError) failure = errorShape(ErrorCodes.FORBIDDEN, error.message);
	else throw error;
	respond(false, void 0, failure);
}) };
//#endregion
export { modelsHandlers };
