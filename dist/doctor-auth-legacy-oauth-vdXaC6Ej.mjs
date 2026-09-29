import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import { _ as applyProviderConfigDefaultsForConfig } from "./validation-core-DwJVlxTe.mjs";
import { a as loadPersistedAuthProfileStore } from "./persisted-B486xwB_.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-BcoYkagW.mjs";
import { t as repairOAuthProfileIdMismatch } from "./repair-BcSbbkEG.mjs";
import { i as removeAuthProfileConfig, r as configReferencesAuthProfile } from "./provider-auth-helpers-CVzRzfCc.mjs";
import { t as listAuthProfileRepairCandidates } from "./doctor-auth-legacy-paths-C7z3rdwq.mjs";
//#region src/commands/doctor-auth-legacy-oauth.ts
/** Removes retired provider profiles and repairs legacy OAuth profile ids. */
function sanitizePromptLabel(label) {
	return (label ? sanitizeForLog(label).trim() : void 0) || void 0;
}
/**
* Applies provider-declared OAuth profile id repairs to config after prompting.
*
* Providers own the legacy id mapping; doctor only loads setup-time provider metadata and asks
* before writing config so stale provider-specific ids do not silently shadow current profiles.
*/
async function maybeRepairLegacyOAuthProfileIds(cfg, prompter) {
	let nextCfg = cfg;
	const retiredProfileCleanupPlans = [];
	const repairCandidates = listAuthProfileRepairCandidates(cfg, process.env).map(({ agentDir }) => ({
		agentDir,
		profiles: loadPersistedAuthProfileStore(agentDir)?.profiles ?? {}
	}));
	if (Object.keys(cfg.auth?.profiles ?? {}).length === 0 && !Object.values(cfg.auth?.order ?? {}).some((order) => order.length > 0) && !Object.values(cfg.models?.providers ?? {}).some((provider) => typeof provider.apiKey === "string") && repairCandidates.every(({ profiles }) => Object.keys(profiles).length === 0)) return {
		config: nextCfg,
		retiredProfileCleanupPlans
	};
	const { resolvePluginProvidersCore } = await import("./providers.runtime.js");
	const providers = resolvePluginProvidersCore({
		config: cfg,
		env: process.env,
		mode: "setup"
	});
	for (const provider of providers) for (const profileId of provider.deprecatedProfileIds ?? []) {
		const profileStores = repairCandidates.flatMap(({ agentDir, profiles }) => {
			const profile = profiles[profileId];
			return profile ? [{
				agentDir,
				provider: profile.provider
			}] : [];
		});
		if (profileStores.length === 0 && !configReferencesAuthProfile(nextCfg, profileId)) continue;
		const { note } = await import("./terminal-core/note.js");
		note(`- Remove retired auth profile ${profileId}. The provider's native login remains unchanged.`, "Auth profiles");
		const label = sanitizePromptLabel(provider.label) ?? provider.id;
		if (!await prompter.confirm({
			message: `Remove retired ${label} auth profile now?`,
			initialValue: true
		})) continue;
		const configuredProfileProvider = nextCfg.auth?.profiles?.[profileId]?.provider;
		const selectedProviderIds = /* @__PURE__ */ new Set([provider.id, ...profileStores.map((store) => store.provider)]);
		if (configuredProfileProvider) selectedProviderIds.add(configuredProfileProvider);
		if (collectConfiguredModelRefs(nextCfg).some(({ value }) => {
			const separator = value.indexOf("/");
			return separator > 0 && selectedProviderIds.has(value.slice(0, separator));
		})) nextCfg = applyProviderConfigDefaultsForConfig({
			provider: provider.id,
			config: nextCfg,
			env: process.env
		});
		nextCfg = removeAuthProfileConfig(nextCfg, profileId);
		for (const candidate of profileStores) retiredProfileCleanupPlans.push({
			agentDir: candidate.agentDir,
			profileIds: [profileId]
		});
	}
	if (!Object.values(nextCfg.auth?.profiles ?? {}).some((profile) => profile?.mode === "oauth")) return {
		config: nextCfg,
		retiredProfileCleanupPlans
	};
	const store = ensureAuthProfileStoreWithoutExternalProfiles();
	if (Object.keys(store.profiles).length === 0) return {
		config: nextCfg,
		retiredProfileCleanupPlans
	};
	for (const provider of providers) for (const repairSpec of provider.oauthProfileIdRepairs ?? []) {
		const repair = repairOAuthProfileIdMismatch({
			cfg: nextCfg,
			store,
			provider: provider.id,
			legacyProfileId: repairSpec.legacyProfileId
		});
		if (!repair.migrated || repair.changes.length === 0) continue;
		const { note } = await import("./terminal-core/note.js");
		note(repair.changes.map((c) => `- ${c}`).join("\n"), "Auth profiles");
		const label = sanitizePromptLabel(repairSpec.promptLabel) ?? sanitizePromptLabel(provider.label) ?? provider.id;
		if (!await prompter.confirm({
			message: `Update ${label} OAuth profile id in config now?`,
			initialValue: true
		})) continue;
		nextCfg = repair.config;
	}
	return {
		config: nextCfg,
		retiredProfileCleanupPlans
	};
}
//#endregion
export { maybeRepairLegacyOAuthProfileIds };
