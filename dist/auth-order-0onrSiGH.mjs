import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-Dij_chYC.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { o as setAuthProfileOrder, y as resolveAuthStatePathForDisplay } from "./profiles-B-MkhBI8.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BbOBKQM3.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { l as resolveModelsTargetAgent } from "./shared-yzzedLUF.mjs";
import { t as loadModelsConfig } from "./load-config-CQ4HhFsY.mjs";
import { t as refreshRunningGatewayAuthState } from "./auth-refresh-BO5R6QVA.mjs";
//#region src/commands/models/auth-order.ts
/** Commands for viewing and editing per-agent provider auth profile order. */
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
/** Shows the configured auth profile priority order for a provider. */
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
/** Clears the configured auth profile priority order for a provider. */
async function modelsAuthOrderClearCommand(opts, runtime) {
	const { cfg, agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime, "mutation");
	if (!await setAuthProfileOrder({
		agentDir,
		provider: resolveProviderIdForAuth(provider, { config: cfg }),
		order: null
	})) throw new Error(`Failed to update auth state; the auth state lock may be busy. Wait a moment and rerun ${formatCliCommand("openclaw models auth order clear --provider " + provider)}.`);
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Provider: ${provider}`);
	runtime.log(`Auth profile order override cleared; ${describeOrderFallback(cfg, provider)}.`);
	await refreshRunningGatewayAuthState(agentId, "update", runtime);
}
/** Sets the provider auth profile priority order after validating each profile id. */
async function modelsAuthOrderSetCommand(opts, runtime) {
	const { cfg, agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime, "mutation");
	const store = ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
		cfg,
		provider
	}) });
	const providerKey = resolveProviderIdForAuth(provider, { config: cfg });
	const requested = normalizeStringEntries(opts.order ?? []);
	if (requested.length === 0) throw new Error(`Missing profile ids. Run ${formatCliCommand("openclaw models auth list --provider " + provider)} to choose one or more profile ids.`);
	for (const profileId of requested) {
		const cred = store.profiles[profileId];
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
	if (!updated) throw new Error(`Failed to update auth state; the auth state lock may be busy. Wait a moment and rerun ${formatCliCommand("openclaw models auth order set --provider " + provider + " <profileIds...>")}.`);
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Provider: ${provider}`);
	runtime.log(`Auth profile order override: ${describeOrder(updated, provider, cfg).join(", ")}`);
	await refreshRunningGatewayAuthState(agentId, "update", runtime);
}
//#endregion
export { modelsAuthOrderClearCommand, modelsAuthOrderGetCommand, modelsAuthOrderSetCommand };
