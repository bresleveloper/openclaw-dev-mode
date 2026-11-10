import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { c as findActiveDegradedSecretOwner, m as listActiveDegradedSecretOwners } from "./runtime-degraded-state-SptB0g_t.mjs";
import { t as isSessionSkillEnabled } from "./agent-filter-B-HgchuV.mjs";
import { r as resolveSkillKey } from "./frontmatter-siV6LZij.mjs";
import { t as resolveSkillSource } from "./source-DbWOnpPI.mjs";
import { i as prepareBinaryAvailability, n as hasBinary, r as isConfigPathTruthyWithDefaults, t as evaluateRuntimeEligibility } from "./config-eval-wcqg1YVW.mjs";
//#region src/skills/loading/config.ts
const DEFAULT_CONFIG_VALUES = {
	"browser.enabled": true,
	"browser.evaluateEnabled": true
};
function resolveSkillsInstallPreferences(config) {
	return {
		preferBrew: config?.skills?.install?.preferBrew ?? true,
		nodeManager: config?.skills?.install?.nodeManager ?? "npm"
	};
}
function isSkillConfigPathTruthy(config, pathStr) {
	return isConfigPathTruthyWithDefaults(config, pathStr, DEFAULT_CONFIG_VALUES);
}
function resolveSkillConfig(config, skillKey) {
	const entry = config?.skills?.entries?.[skillKey];
	if (!entry || typeof entry !== "object") return;
	return entry;
}
/** Returns whether cold startup isolated this exact skill's configured secret. */
function isSkillSecretOwnerUnavailable(skillKey) {
	return Boolean(findActiveDegradedSecretOwner("capability", `skill:${skillKey}`));
}
/** Returns whether cold startup isolated any configured skill secret. */
function hasUnavailableSkillSecretOwners() {
	return listActiveDegradedSecretOwners().some((owner) => owner.degradationState !== "stale" && owner.ownerKind === "capability" && owner.ownerId.startsWith("skill:"));
}
function isSkillEnvRequirementSatisfied(params) {
	const { envName, skillConfig, primaryEnv } = params;
	return normalizeOptionalString(process.env[envName]) !== void 0 || normalizeOptionalString(skillConfig?.env?.[envName]) !== void 0 || primaryEnv === envName && hasConfiguredSecretInput(skillConfig?.apiKey);
}
const BUNDLED_SOURCES = /* @__PURE__ */ new Set(["openclaw-bundled", "openclaw-custodian"]);
function resolveBundledAllowlist(config) {
	const configured = config?.skills?.allowBundled;
	return configured === void 0 ? void 0 : new Set(normalizeStringEntries(configured));
}
function isBundledSkillAllowed(entry, allowlist) {
	if (!allowlist || !BUNDLED_SOURCES.has(resolveSkillSource(entry.skill))) return true;
	const key = resolveSkillKey(entry);
	return allowlist.has(key) || allowlist.has(entry.skill.name);
}
/** Learned Workshop skills bypass agent allowlists and session toggles; archiving hides them. */
function isSkillEntrySelected(entry, skillFilter, skillOverrides) {
	return resolveSkillSource(entry.skill) === "openclaw-workshop" || isSessionSkillEnabled(entry.skill.name, skillFilter, skillOverrides, resolveSkillKey(entry));
}
function shouldIncludeSkill(params) {
	const { entry, config, bundledAllowlist, eligibility } = params;
	const skillKey = resolveSkillKey(entry);
	const skillConfig = resolveSkillConfig(config, skillKey);
	if (skillConfig?.enabled === false) return false;
	if (isSkillSecretOwnerUnavailable(skillKey)) return false;
	if (!isBundledSkillAllowed(entry, bundledAllowlist)) return false;
	return evaluateRuntimeEligibility({
		os: entry.metadata?.os,
		platform: params.platform,
		remotePlatforms: eligibility?.remote?.platforms,
		always: entry.metadata?.always,
		requires: entry.metadata?.requires,
		hasBin: params.hasBin ?? hasBinary,
		hasRemoteBin: eligibility?.remote?.hasBin,
		hasAnyRemoteBin: eligibility?.remote?.hasAnyBin,
		hasEnv: (envName) => isSkillEnvRequirementSatisfied({
			envName,
			skillConfig,
			primaryEnv: entry.metadata?.primaryEnv
		}),
		isConfigPathTruthy: (configPath) => isSkillConfigPathTruthy(config, configPath)
	});
}
async function prepareSkillBinaryProbe(entries, opts, assertCurrent, runtime) {
	if (runtime) {
		const available = new Set(runtime.bins);
		return {
			hasBin: (bin) => available.has(bin),
			needsRetry: () => false
		};
	}
	const bins = /* @__PURE__ */ new Set();
	const bundledAllowlist = resolveBundledAllowlist(opts?.config);
	let needsBinaries;
	const recordBinaryRequirement = () => {
		needsBinaries = true;
		return true;
	};
	for (const entry of entries) {
		if (!isSkillEntrySelected(entry, opts?.skillFilter, opts?.skillOverrides)) continue;
		const requires = entry.metadata?.requires;
		if (!requires?.bins?.length && !requires?.anyBins?.length) continue;
		needsBinaries = false;
		shouldIncludeSkill({
			entry,
			config: opts?.config,
			bundledAllowlist,
			eligibility: opts?.eligibility,
			hasBin: recordBinaryRequirement
		});
		if (needsBinaries) for (const bin of resolveSkillRequiredBins(entry)) bins.add(bin);
	}
	const facts = await prepareBinaryAvailability(bins, assertCurrent);
	let unprepared = false;
	return {
		hasBin: (bin) => {
			if (!bins.has(bin)) {
				unprepared = true;
				return false;
			}
			return facts.hasBinary(bin);
		},
		needsRetry: () => unprepared || !facts.isCurrent()
	};
}
function resolveSkillRequiredBins(entry) {
	return (entry.metadata?.requires?.bins ?? []).concat(entry.metadata?.requires?.anyBins ?? []);
}
//#endregion
export { isSkillEnvRequirementSatisfied as a, resolveBundledAllowlist as c, resolveSkillsInstallPreferences as d, shouldIncludeSkill as f, isSkillEntrySelected as i, resolveSkillConfig as l, isBundledSkillAllowed as n, isSkillSecretOwnerUnavailable as o, isSkillConfigPathTruthy as r, prepareSkillBinaryProbe as s, hasUnavailableSkillSecretOwners as t, resolveSkillRequiredBins as u };
