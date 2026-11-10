import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { Ng as errorShape, zn as validateModelsAuthOrderSetParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { m as resolveExplicitAuthOrderSelection } from "./order-CElLtwMu.mjs";
import { n as readPreparedCatalog } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { n as respondUnavailableOnThrow } from "./response-ajmyFl3V.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { o as setAuthProfileOrder } from "./profiles-Df1OQ7iN.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { t as resolveModelAuthAgentScope } from "./model-auth-agent-scope-CiCE5zUc.mjs";
import { t as refreshModelAuthStateAfterMutation } from "./model-auth-refresh-DCZ8NSwG.mjs";
import { t as resolveConfigBoundProfileIds } from "./models-auth-status-config-C9zg5VTT.mjs";
//#region src/gateway/server-methods/models-auth-order.ts
const log = createSubsystemLogger("models-auth-order");
const modelsAuthOrderHandlers = { "models.authOrderSet": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateModelsAuthOrderSetParams, "models.authOrderSet", respond)) return;
	const provider = params.provider;
	const profileIds = params.profileIds ?? null;
	const rejectInvalidOrder = (message) => respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
	await respondUnavailableOnThrow(respond, async () => {
		const cfg = context.getRuntimeConfig();
		const scope = resolveModelAuthAgentScope(cfg, params.agentId);
		if (!scope.ok) {
			respond(false, void 0, scope.error);
			return;
		}
		const preparedSnapshot = await readPreparedCatalog(context, scope.agentId);
		if (!preparedSnapshot) throw new Error(`prepared model auth owner is unavailable (${scope.agentId})`);
		const authAliasLookupParams = {
			config: preparedSnapshot.config,
			workspaceDir: preparedSnapshot.workspaceDir,
			metadataSnapshot: preparedSnapshot.metadataSnapshot,
			includeUntrustedWorkspacePlugins: false
		};
		const authProvider = resolveProviderIdForAuth(provider, authAliasLookupParams);
		const configuredOrder = resolveExplicitAuthOrderSelection({
			storeOrder: preparedSnapshot.authStore.order,
			configuredOrder: preparedSnapshot.config.auth?.order,
			providerKey: provider,
			providerAuthKey: authProvider
		});
		if (profileIds && configuredOrder.order !== void 0 && !configuredOrder.fromStore) {
			rejectInvalidOrder(`profile priority for provider ${provider} is controlled by auth configuration`);
			return;
		}
		const availableProfileIds = Object.entries(preparedSnapshot.authStore.profiles).filter(([, credential]) => resolveProviderIdForAuth(credential.provider, {
			...authAliasLookupParams,
			storedCredential: true
		}) === authProvider).map(([profileId]) => profileId);
		const configBoundProfileIds = resolveConfigBoundProfileIds(preparedSnapshot.config, preparedSnapshot.authStore, authAliasLookupParams);
		if (profileIds && availableProfileIds.some((profileId) => configBoundProfileIds.has(profileId))) {
			rejectInvalidOrder(`profile priority for provider ${provider} is controlled by provider configuration`);
			return;
		}
		const invalidProfile = profileIds?.find((profileId) => !availableProfileIds.includes(profileId));
		if (invalidProfile) {
			rejectInvalidOrder(`profileId ${invalidProfile} is unavailable for provider ${provider}`);
			return;
		}
		if (profileIds && profileIds.length !== availableProfileIds.length) {
			rejectInvalidOrder(`profileIds must include every available profile for provider ${provider}`);
			return;
		}
		if (!await setAuthProfileOrder({
			agentDir: preparedSnapshot.agentDir,
			provider: authProvider,
			order: profileIds
		})) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "auth profile order is temporarily unavailable"));
			return;
		}
		const result = {
			provider,
			profileIds
		};
		try {
			await refreshModelAuthStateAfterMutation(context.getRuntimeConfig, scope.agentId);
		} catch (err) {
			log.warn(`auth profile order saved but runtime publication failed: ${formatForLog(err)}`);
			result.warning = "Profile priority saved. Live status is unavailable; refresh Models or restart the Gateway.";
		}
		respond(true, result, void 0);
	});
} };
//#endregion
export { modelsAuthOrderHandlers };
