import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-B5xWSzLp.mjs";
import { c as findActiveDegradedSecretOwner, p as listActiveDegradedSecretOwners } from "./runtime-degraded-state-DVMYGogL.mjs";
import { t as resolveSkillSource } from "./source-BwY_Vy9W.mjs";
import { i as prepareBinaryAvailability, n as hasBinary, r as isConfigPathTruthyWithDefaults, t as evaluateRuntimeEligibility } from "./config-eval-BOec6g4L.mjs";
import { r as resolveSkillKey } from "./frontmatter-2H_F0IFB.mjs";
//#region src/skills/loading/config.ts
const DEFAULT_CONFIG_VALUES = {
	"browser.enabled": true,
	"browser.evaluateEnabled": true
};
function resolveSkillsInstallPreferences(config) {
	const raw = config?.skills?.install;
	const preferBrew = raw?.preferBrew ?? true;
	const manager = normalizeLowercaseStringOrEmpty(normalizeOptionalString(raw?.nodeManager));
	return {
		preferBrew,
		nodeManager: manager === "pnpm" || manager === "yarn" || manager === "bun" || manager === "npm" ? manager : "npm"
	};
}
function isSkillConfigPathTruthy(config, pathStr) {
	return isConfigPathTruthyWithDefaults(config, pathStr, DEFAULT_CONFIG_VALUES);
}
function resolveSkillConfig(config, skillKey) {
	const skills = config?.skills?.entries;
	if (!skills || typeof skills !== "object") return;
	const entry = skills[skillKey];
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
function normalizeAllowlist(input) {
	if (!input) return;
	if (!Array.isArray(input)) return;
	const normalized = normalizeStringEntries(input);
	return normalized.length > 0 ? new Set(normalized) : void 0;
}
const BUNDLED_SOURCES = /* @__PURE__ */ new Set(["openclaw-bundled", "openclaw-custodian"]);
function isBundledSkill(entry) {
	return BUNDLED_SOURCES.has(resolveSkillSource(entry.skill));
}
function resolveBundledAllowlist(config) {
	return normalizeAllowlist(config?.skills?.allowBundled);
}
function isBundledSkillAllowed(entry, allowlist) {
	if (!allowlist || allowlist.size === 0) return true;
	if (!isBundledSkill(entry)) return true;
	const key = resolveSkillKey(entry.skill, entry);
	return allowlist.has(key) || allowlist.has(entry.skill.name);
}
function shouldIncludeSkill(params) {
	const { entry, config, bundledAllowlist, eligibility } = params;
	const skillKey = resolveSkillKey(entry.skill, entry);
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
		if (needsBinaries) {
			for (const bin of entry.metadata?.requires?.bins ?? []) bins.add(bin);
			for (const bin of entry.metadata?.requires?.anyBins ?? []) bins.add(bin);
		}
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
//#endregion
export { isSkillSecretOwnerUnavailable as a, resolveSkillConfig as c, isSkillEnvRequirementSatisfied as i, resolveSkillsInstallPreferences as l, isBundledSkillAllowed as n, prepareSkillBinaryProbe as o, isSkillConfigPathTruthy as r, resolveBundledAllowlist as s, hasUnavailableSkillSecretOwners as t, shouldIncludeSkill as u };
