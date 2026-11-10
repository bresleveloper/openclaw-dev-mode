import { R as timestampMsToIsoString } from "./number-coercion-CkhMiRw8.mjs";
import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { O as readAuthProfileUsageStats, S as isActiveUnusableWindow } from "./user-model-account-authority-DFFjC5J5.mjs";
import { i as buildAuthProfileUnusableHint } from "./oauth-refresh-failure-H1_-S915.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kYfv_bUN.mjs";
import { r as ensureAuthProfileStore } from "./store-runtime-CwqGD12G.mjs";
import { o as resolveAuthStatePathForDisplay } from "./oauth-refresh-fence-eL04wGfj.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./display-D4lohsyV.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { l as resolveModelsTargetAgent } from "./shared-Ck_WZImY.mjs";
import { t as loadModelsConfig } from "./load-config-DvAs1Afc.mjs";
//#region src/commands/models/auth-list.ts
function summarizeProfile(params) {
	const expiresAt = params.profile.type === "api_key" ? void 0 : timestampMsToIsoString(params.profile.expires);
	const blockedUntil = isActiveUnusableWindow(params.usage?.blockedUntil, Date.now()) ? timestampMsToIsoString(params.usage?.blockedUntil) : void 0;
	const blockedModel = params.usage?.blockedScope === "model" ? params.usage.blockedModel : void 0;
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
		...blockedUntil ? {
			blockedUntil,
			...params.usage?.blockedReason ? { blockedReason: params.usage.blockedReason } : {},
			...params.usage?.blockedSource ? { blockedSource: params.usage.blockedSource } : {},
			blockedScope: blockedModel ? "model" : "profile",
			...blockedModel ? { blockedModel } : {}
		} : {},
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
	if (profile.blockedUntil) {
		const reason = profile.blockedReason ? `:${profile.blockedReason}` : "";
		const source = profile.blockedSource ? ` via ${profile.blockedSource}` : "";
		const scope = profile.blockedScope === "model" ? ` for model${profile.blockedModel ? ` ${profile.blockedModel}` : ""}` : " for profile";
		details.push(`blocked${reason}${source}${scope} until ${profile.blockedUntil}`);
	}
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
		usage: readAuthProfileUsageStats(store, profileId)
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
	const logLine = (line) => runtime.log(sanitizeTerminalText(line));
	logLine(`Agent: ${agentId}`);
	logLine(`Auth state store: ${shortenHomePath(resolveAuthStatePathForDisplay(agentDir))}`);
	if (provider) logLine(`Provider: ${provider}`);
	if (profiles.length === 0) {
		logLine("Profiles: (none)");
		return;
	}
	logLine("Profiles:");
	for (const profile of profiles) logLine(formatProfileLine(profile));
}
//#endregion
export { modelsAuthListCommand };
