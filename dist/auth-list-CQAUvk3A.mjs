import { R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { y as resolveAuthStatePathForDisplay } from "./profiles-DblRQQgZ.mjs";
import { i as buildAuthProfileUnusableHint } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BbOBKQM3.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-BcoYkagW.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-CYVlYrag.mjs";
import { l as resolveModelsTargetAgent } from "./shared-CyxoXW6o.mjs";
import { t as loadModelsConfig } from "./load-config-Dtx-C8_k.mjs";
//#region src/commands/models/auth-list.ts
/** Command helpers for listing saved model auth profiles. */
function resolveProviderFilter(rawProvider) {
	const provider = rawProvider?.trim() ? resolveProviderIdForAuth(rawProvider) : void 0;
	if (!provider) return {
		provider: void 0,
		externalCliProvider: void 0,
		matches: () => true
	};
	return {
		provider,
		externalCliProvider: provider,
		matches: (profile) => profile.provider === provider
	};
}
function formatTimestamp(value) {
	return timestampMsToIsoString(value);
}
function resolveProfileExpiry(profile) {
	return profile.type === "api_key" ? void 0 : formatTimestamp(profile.expires);
}
function summarizeProfile(params) {
	const expiresAt = resolveProfileExpiry(params.profile);
	const cooldownUntil = formatTimestamp(params.usage?.cooldownUntil);
	const disabledUntil = formatTimestamp(params.usage?.disabledUntil);
	const disabledActive = Boolean(disabledUntil);
	const reason = disabledActive ? params.usage?.disabledReason : cooldownUntil ? params.usage?.cooldownReason : void 0;
	const recoveryHint = disabledUntil || cooldownUntil ? buildAuthProfileUnusableHint({
		kind: disabledActive ? "disabled" : "cooldown",
		reason,
		provider: params.profile.provider,
		profileId: params.profileId
	}) : void 0;
	return {
		id: params.profileId,
		provider: resolveProviderIdForAuth(params.profile.provider),
		type: params.profile.type,
		label: resolveAuthProfileDisplayLabel({
			cfg: params.cfg,
			store: params.store,
			profileId: params.profileId
		}),
		...params.profile.email ? { email: params.profile.email } : {},
		...params.profile.displayName ? { displayName: params.profile.displayName } : {},
		...expiresAt ? { expiresAt } : {},
		...cooldownUntil ? { cooldownUntil } : {},
		...disabledUntil ? { disabledUntil } : {},
		...params.usage?.cooldownReason ? { cooldownReason: params.usage.cooldownReason } : {},
		...params.usage?.cooldownClassification ? { cooldownClassification: params.usage.cooldownClassification } : {},
		...params.usage?.disabledReason ? { disabledReason: params.usage.disabledReason } : {},
		...recoveryHint ? { recoveryHint } : {}
	};
}
function formatProfileLine(profile) {
	const details = [`${profile.provider}/${profile.type}`];
	if (profile.expiresAt) details.push(`expires ${profile.expiresAt}`);
	if (profile.cooldownUntil) {
		const diagnostic = profile.cooldownClassification ?? profile.cooldownReason;
		details.push(`cooldown${diagnostic ? `:${diagnostic}` : ""} until ${profile.cooldownUntil}`);
	}
	if (profile.disabledUntil) details.push(`disabled${profile.disabledReason ? `:${profile.disabledReason}` : ""} until ${profile.disabledUntil}`);
	return `- ${profile.label} [${details.join("; ")}]${profile.recoveryHint ? ` — ${profile.recoveryHint}` : ""}`;
}
/** Lists auth profiles for the selected agent, optionally filtered by provider. */
async function modelsAuthListCommand(opts, runtime) {
	const cfg = await loadModelsConfig({
		commandName: "models auth list",
		runtime
	});
	const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent, { kind: "read" });
	const providerFilter = resolveProviderFilter(opts.provider);
	const store = ensureAuthProfileStore(agentDir, providerFilter.externalCliProvider ? { externalCli: externalCliDiscoveryForProviderAuth({
		cfg,
		provider: providerFilter.externalCliProvider
	}) } : void 0);
	const profiles = Object.entries(store.profiles).map(([profileId, profile]) => summarizeProfile({
		cfg,
		store,
		profileId,
		profile,
		usage: store.usageStats?.[profileId]
	})).filter((profile) => providerFilter.matches(profile)).toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
	if (opts.json) {
		writeRuntimeJson(runtime, {
			agentId,
			agentDir: shortenHomePath(agentDir),
			authStatePath: shortenHomePath(resolveAuthStatePathForDisplay(agentDir)),
			provider: providerFilter.provider ?? null,
			profiles
		});
		return;
	}
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Auth state store: ${shortenHomePath(resolveAuthStatePathForDisplay(agentDir))}`);
	if (providerFilter.provider) runtime.log(`Provider: ${providerFilter.provider}`);
	if (profiles.length === 0) {
		runtime.log("Profiles: (none)");
		return;
	}
	runtime.log("Profiles:");
	for (const profile of profiles) runtime.log(formatProfileLine(profile));
}
//#endregion
export { modelsAuthListCommand };
