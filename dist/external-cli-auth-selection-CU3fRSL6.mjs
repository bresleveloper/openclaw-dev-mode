import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import "./profile-ids-B9fFWPvP.mjs";
import "./persisted-BVyWmvfF.mjs";
import { m as resolveExplicitAuthOrderSelection } from "./order-B7W96aON.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-B4sEclNg.mjs";
//#region src/agents/auth-profiles/external-cli-auth-selection.ts
/**
* External CLI auth selection scoping.
* Narrows CLI discovery to the provider/profile selected by model auth routing
* so runtime auth setup avoids broad CLI probing.
*/
const CLAUDE_CLI_PROVIDER_ID = "claude-cli";
/** Resolve external CLI overlay scope from the user's auth/model selection. */
function resolveExternalCliAuthOverlayScopeFromSelection(params) {
	const authScope = resolveExternalCliAuthScopeFromAuthSelection({
		provider: params.provider,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		store: params.store,
		userPinnedAuthProfileId: params.userPinnedAuthProfileId
	});
	const selectedRuntimeProvider = resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.cfg,
		agentId: params.agentId,
		modelId: params.modelId,
		authProfileId: params.userPinnedAuthProfileId
	}) || (params.provider === CLAUDE_CLI_PROVIDER_ID ? CLAUDE_CLI_PROVIDER_ID : void 0);
	const selectedProvider = authScope.selectedProviderId ?? (selectedRuntimeProvider === CLAUDE_CLI_PROVIDER_ID ? CLAUDE_CLI_PROVIDER_ID : void 0);
	const providerIds = [.../* @__PURE__ */ new Set([...authScope.providerIds, ...selectedRuntimeProvider === CLAUDE_CLI_PROVIDER_ID ? [CLAUDE_CLI_PROVIDER_ID] : []])];
	return {
		...providerIds.length > 0 ? { providerIds } : {},
		ignoreAutoPreferredProfile: !params.userPinnedAuthProfileId && selectedProvider === CLAUDE_CLI_PROVIDER_ID
	};
}
function resolveExternalCliAuthScopeFromAuthSelection(params) {
	const providerIds = [];
	const orderedProfileIds = resolveConfiguredAuthProfileOrder(params);
	const allProfileIds = [.../* @__PURE__ */ new Set([...Object.keys(params.cfg?.auth?.profiles ?? {}), ...Object.keys(params.store?.profiles ?? {})])];
	const discoveredProfileIds = orderedProfileIds.length > 0 ? orderedProfileIds : allProfileIds;
	const profileIds = params.userPinnedAuthProfileId ? [params.userPinnedAuthProfileId, ...discoveredProfileIds.filter((profileId) => profileId !== params.userPinnedAuthProfileId)] : discoveredProfileIds;
	let selectedProviderId;
	let compatibleProfileCount = 0;
	for (const profileId of profileIds) {
		const resolved = resolveExternalCliProviderIdForCompatibleAuthProfile({
			...params,
			profileId
		});
		if (!resolved.compatible) continue;
		compatibleProfileCount += 1;
		if (compatibleProfileCount === 1) selectedProviderId = resolved.externalCliProviderId;
		if (resolved.externalCliProviderId) providerIds.push(resolved.externalCliProviderId);
	}
	if (params.userPinnedAuthProfileId || orderedProfileIds.length > 0) return {
		providerIds: [...new Set(providerIds)],
		...selectedProviderId ? { selectedProviderId } : {}
	};
	const uniqueProviderIds = [...new Set(providerIds)];
	return {
		providerIds: uniqueProviderIds,
		...compatibleProfileCount === 1 && uniqueProviderIds[0] ? { selectedProviderId: uniqueProviderIds[0] } : {}
	};
}
function resolveConfiguredAuthProfileOrder(params) {
	const providerAuthKey = resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		workspaceDir: params.workspaceDir
	});
	const orderedProfileIds = resolveExplicitAuthOrderSelection({
		storeOrder: params.store?.order,
		configuredOrder: params.cfg?.auth?.order,
		providerKey: params.provider,
		providerAuthKey
	}).order ?? [];
	return [...new Set(orderedProfileIds.map((profileId) => profileId?.trim()).filter((profileId) => Boolean(profileId)))];
}
function resolveExternalCliProviderIdForCompatibleAuthProfile(params) {
	const profile = params.cfg?.auth?.profiles?.[params.profileId];
	const credential = params.store?.profiles?.[params.profileId];
	const profileProvider = profile?.provider ?? credential?.provider ?? (params.profileId === "anthropic:claude-cli" ? CLAUDE_CLI_PROVIDER_ID : void 0);
	if (!profileProvider) return { compatible: false };
	const authAliasParams = {
		config: params.cfg,
		workspaceDir: params.workspaceDir
	};
	const providerAuthKey = resolveProviderIdForAuth(params.provider, authAliasParams);
	const profileAuthKey = resolveProviderIdForAuth(profileProvider, {
		...authAliasParams,
		storedCredential: true
	});
	if (!providerAuthKey || profileAuthKey !== providerAuthKey) return { compatible: false };
	return {
		compatible: true,
		...normalizeProviderId(profileProvider) === CLAUDE_CLI_PROVIDER_ID ? { externalCliProviderId: CLAUDE_CLI_PROVIDER_ID } : {}
	};
}
//#endregion
export { resolveExternalCliAuthOverlayScopeFromSelection as t };
