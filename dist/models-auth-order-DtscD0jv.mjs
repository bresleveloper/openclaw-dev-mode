import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { vn as validateModelsAuthOrderSetParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { o as setAuthProfileOrder } from "./profiles-B-MkhBI8.mjs";
import { s as resolveExplicitAuthOrderSelection } from "./order-BQhYF772.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import { n as readPreparedCatalog } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as resolveModelAuthAgentScope, t as modelAuthAgentScopeError } from "./model-auth-agent-scope-EqqePUcC.mjs";
import { t as refreshModelAuthStateAfterMutation } from "./model-auth-refresh-CxrZyDks.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
import { t as resolveConfigBoundProfileIds } from "./models-auth-status-config-wiqYPiJA.mjs";
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
			respond(false, void 0, modelAuthAgentScopeError(scope));
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
		const invalidProfile = profileIds?.find((profileId) => {
			const credential = preparedSnapshot.authStore.profiles[profileId];
			return !credential || resolveProviderIdForAuth(credential.provider, {
				...authAliasLookupParams,
				storedCredential: true
			}) !== authProvider;
		});
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
