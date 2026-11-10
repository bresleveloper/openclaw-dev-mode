import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-DulZGI4S.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kYfv_bUN.mjs";
import { r as ensureAuthProfileStore } from "./store-runtime-CwqGD12G.mjs";
import { o as resolveAuthStatePathForDisplay } from "./oauth-refresh-fence-eL04wGfj.mjs";
import { o as setAuthProfileOrder } from "./profiles-Df1OQ7iN.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { l as resolveModelsTargetAgent } from "./shared-Ck_WZImY.mjs";
import { t as loadModelsConfig } from "./load-config-DvAs1Afc.mjs";
import { n as refreshRunningGatewayAuthState } from "./auth-refresh-vo4_5i4e.mjs";
//#region src/commands/models/auth-order.ts
function describeOrder(store, provider, cfg) {
	const authProvider = resolveProviderIdForAuth(provider, { config: cfg });
	const canonical = findNormalizedProviderValue(store.order, authProvider);
	if (canonical !== void 0) return canonical;
	return Object.entries(store.order ?? {}).filter(([key]) => resolveProviderIdForAuth(key, { config: cfg }) === authProvider).toSorted(([left], [right]) => left.localeCompare(right))[0]?.[1] ?? [];
}
function describeOrderFallback(cfg, provider) {
	const authProvider = resolveProviderIdForAuth(provider, { config: cfg });
	const configuredOrder = findNormalizedProviderValue(cfg.auth?.order, authProvider) ?? findNormalizedProviderValue(cfg.auth?.order, provider);
	if (configuredOrder === void 0) return "selecting automatically";
	return configuredOrder.length > 0 ? `using order from config: ${configuredOrder.join(", ")}` : "config selects no profiles";
}
async function resolveAuthOrderContext(opts, runtime, kind) {
	const rawProvider = opts.provider?.trim();
	if (!rawProvider) throw new Error(`Missing --provider. Run ${formatCliCommand("openclaw models auth list")} to see saved provider profiles.`);
	const provider = normalizeProviderId(rawProvider);
	const cfg = await loadModelsConfig({
		commandName: "models auth-order",
		runtime
	});
	const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent, { kind });
	return {
		cfg,
		agentId,
		agentDir,
		provider
	};
}
async function modelsAuthOrderGetCommand(opts, runtime) {
	const { cfg, agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime, "read");
	const order = describeOrder(ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
		cfg,
		provider
	}) }), provider, cfg);
	if (opts.json) {
		writeRuntimeJson(runtime, {
			agentId,
			agentDir,
			provider,
			authStatePath: shortenHomePath(resolveAuthStatePathForDisplay(agentDir)),
			order: order.length > 0 ? order : null
		});
		return;
	}
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Provider: ${provider}`);
	runtime.log(`Auth state store: ${shortenHomePath(resolveAuthStatePathForDisplay(agentDir))}`);
	runtime.log(order.length > 0 ? `Auth profile order override: ${order.join(", ")}` : `Auth profile order override: none (${describeOrderFallback(cfg, provider)})`);
}
async function modelsAuthOrderUpdateCommand(opts, runtime) {
	const { cfg, agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime, "mutation");
	const store = opts.order === null ? null : ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
		cfg,
		provider
	}) });
	const providerKey = resolveProviderIdForAuth(provider, { config: cfg });
	const requested = opts.order === null ? null : normalizeStringEntries(opts.order ?? []);
	if (requested?.length === 0) throw new Error(`Missing profile ids. Run ${formatCliCommand("openclaw models auth list --provider " + provider)} to choose one or more profile ids.`);
	for (const profileId of requested ?? []) {
		const cred = store?.profiles[profileId];
		if (!cred) throw new Error(`Auth profile "${profileId}" not found in ${shortenHomePath(agentDir)}. Run ${formatCliCommand("openclaw models auth list --provider " + provider)} to see saved profiles.`);
		if (resolveProviderIdForAuth(cred.provider, {
			config: cfg,
			storedCredential: true
		}) !== providerKey) throw new Error(`Auth profile "${profileId}" is for ${cred.provider}, not ${provider}.`);
	}
	const updated = await setAuthProfileOrder({
		agentDir,
		provider: providerKey,
		order: requested
	});
	if (!updated) {
		const command = requested ? `openclaw models auth order set --provider ${provider} <profileIds...>` : `openclaw models auth order clear --provider ${provider}`;
		throw new Error(`Failed to update auth state; the auth state lock may be busy. Wait a moment and rerun ${formatCliCommand(command)}.`);
	}
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Provider: ${provider}`);
	runtime.log(requested ? `Auth profile order override: ${describeOrder(updated, provider, cfg).join(", ")}` : `Auth profile order override cleared; ${describeOrderFallback(cfg, provider)}.`);
	await refreshRunningGatewayAuthState(agentId, "update", runtime);
}
//#endregion
export { modelsAuthOrderGetCommand, modelsAuthOrderUpdateCommand };
