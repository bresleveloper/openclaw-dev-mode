import { R as timestampMsToIsoString } from "./number-coercion-CuVhdCBs.mjs";
import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { y as resolveAuthStatePathForDisplay } from "./profiles-Dk53jI-3.mjs";
import { i as buildAuthProfileUnusableHint } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-CzdLbOjb.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-Qx0DZ2Si.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-BIPn3mmc.mjs";
import { l as resolveModelsTargetAgent } from "./shared-CP4E7wPe.mjs";
import { t as loadModelsConfig } from "./load-config-D0EM9qHZ.mjs";
//#region src/commands/models/auth-list.ts
function summarizeProfile(params) {
	const expiresAt = params.profile.type === "api_key" ? void 0 : timestampMsToIsoString(params.profile.expires);
	const cooldownUntil = timestampMsToIsoString(params.usage?.cooldownUntil);
	const disabledUntil = timestampMsToIsoString(params.usage?.disabledUntil);
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
async function modelsAuthListCommand(opts, runtime) {
	const cfg = await loadModelsConfig({
		commandName: "models auth list",
		runtime
	});
	const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent, { kind: "read" });
	const provider = opts.provider?.trim() ? resolveProviderIdForAuth(opts.provider) : void 0;
	const store = ensureAuthProfileStore(agentDir, provider ? { externalCli: externalCliDiscoveryForProviderAuth({
		cfg,
		provider
	}) } : void 0);
	const profiles = Object.entries(store.profiles).map(([profileId, profile]) => summarizeProfile({
		cfg,
		store,
		profileId,
		profile,
		usage: store.usageStats?.[profileId]
	})).filter((profile) => !provider || profile.provider === provider).toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
	if (opts.json) {
		writeRuntimeJson(runtime, {
			agentId,
			agentDir: shortenHomePath(agentDir),
			authStatePath: shortenHomePath(resolveAuthStatePathForDisplay(agentDir)),
			provider: provider || null,
			profiles
		});
		return;
	}
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Auth state store: ${shortenHomePath(resolveAuthStatePathForDisplay(agentDir))}`);
	if (provider) runtime.log(`Provider: ${provider}`);
	if (profiles.length === 0) {
		runtime.log("Profiles: (none)");
		return;
	}
	runtime.log("Profiles:");
	for (const profile of profiles) runtime.log(formatProfileLine(profile));
}
//#endregion
export { modelsAuthListCommand };
