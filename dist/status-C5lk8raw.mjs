import { t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as resolveEffectiveAgentSkillFilter } from "./agent-filter-Cseetb4e.mjs";
import { t as resolveSkillSource } from "./source-BwY_Vy9W.mjs";
import { a as normalizeSkillIndexName, i as isSkillUserInvocable, r as isSkillPromptVisible } from "./skill-index-Bh90u5mi.mjs";
import { n as hasBinary } from "./config-eval-BOec6g4L.mjs";
import { r as resolveSkillKey } from "./frontmatter-2H_F0IFB.mjs";
import { c as resolveSkillConfig, i as isSkillEnvRequirementSatisfied, l as resolveSkillsInstallPreferences, n as isBundledSkillAllowed, r as isSkillConfigPathTruthy, s as resolveBundledAllowlist } from "./config-oZlvXJO6.mjs";
import { i as prepareWorkspaceSkillEntries, r as loadWorkspaceSkills, u as readWorkspaceSkillStatusFacts } from "./workspace-skill-loader-CHLLbFK6.mjs";
import { i as loadSkillLibrarySelection } from "./selection-DRWWbX7-.mjs";
import { t as mergeRemoteNodeSkillEntries } from "./remote-skills-CZuGGEXx.mjs";
import { t as resolveBundledSkillsDir } from "./bundled-dir-BA8EutwF.mjs";
import { t as evaluateEntryRequirementsForCurrentPlatform } from "./entry-status-B2j_-Dly.mjs";
import path from "node:path";
//#region src/skills/discovery/status.ts
/** Missing prerequisites exclude intentional disablement and are independent of agent exposure. */
function hasMissingSkillRequirements(skill) {
	return !skill.eligible && !skill.disabled && !skill.blockedByAllowlist;
}
const skillsLogger = createSubsystemLogger("skills");
let hasWarnedMissingBundledDir = false;
function resolveSkillStatusEntry(skills, requestedName) {
	const raw = requestedName.trim();
	if (!raw) return null;
	const lower = raw.toLowerCase();
	const normalized = normalizeSkillIndexName(raw);
	const matchers = [
		(skill) => skill.name === raw,
		(skill) => skill.skillKey === raw,
		(skill) => skill.name.toLowerCase() === lower || skill.skillKey.toLowerCase() === lower,
		(skill) => Boolean(normalized) && (normalizeSkillIndexName(skill.name) === normalized || normalizeSkillIndexName(skill.skillKey) === normalized)
	];
	for (const matches of matchers) {
		const candidates = skills.filter(matches);
		if (candidates.length > 0) return candidates.length === 1 ? candidates[0] : null;
	}
	return null;
}
function selectPreferredInstallSpec(install, prefs, hasLocalBin) {
	const findKind = (kind) => install.find((spec) => spec.kind === kind);
	const brewSpec = findKind("brew");
	const brewAvailable = brewSpec && hasLocalBin("brew");
	return (prefs.preferBrew && brewAvailable ? brewSpec : void 0) ?? findKind("uv") ?? findKind("node") ?? (brewAvailable ? brewSpec : void 0) ?? findKind("go") ?? findKind("download") ?? brewSpec ?? install[0];
}
function normalizeInstallOptions(entry, prefs, hasLocalBin, platform) {
	const requiredOs = entry.metadata?.os ?? [];
	if (requiredOs.length > 0 && !requiredOs.includes(platform)) return [];
	const install = entry.metadata?.install ?? [];
	if (install.length === 0) return [];
	const supportsPlatform = (spec) => {
		const osList = spec.os ?? [];
		return osList.length === 0 || osList.includes(platform);
	};
	const filtered = install.filter(supportsPlatform);
	if (filtered.length === 0) return [];
	const toOption = (spec, index) => {
		const id = (spec.id ?? `${spec.kind}-${index}`).trim();
		const bins = spec.bins ?? [];
		let label = (spec.label ?? "").trim();
		if (spec.kind === "node" && spec.package) label = `Install ${spec.package} (${prefs.nodeManager})`;
		if (!label) {
			if (spec.kind === "brew" && spec.formula) label = `Install ${spec.formula} (brew)`;
			else if (spec.kind === "node" && spec.package) label = `Install ${spec.package} (${prefs.nodeManager})`;
			else if (spec.kind === "go" && spec.module) label = `Install ${spec.module} (go)`;
			else if (spec.kind === "uv" && spec.package) label = `Install ${spec.package} (uv)`;
			else if (spec.kind === "download" && spec.url) {
				const url = spec.url.trim();
				const last = url.split("/").pop();
				label = `Download ${last && last.length > 0 ? last : url}`;
			} else label = "Run installer";
		}
		return {
			id,
			kind: spec.kind,
			label,
			bins
		};
	};
	if (filtered.every((spec) => spec.kind === "download")) {
		const options = [];
		for (const [index, spec] of install.entries()) if (supportsPlatform(spec)) options.push(toOption(spec, index));
		return options;
	}
	const preferred = selectPreferredInstallSpec(filtered, prefs, hasLocalBin);
	if (!preferred) return [];
	return [toOption(preferred, install.indexOf(preferred))];
}
function buildSkillRequirements(entry, context) {
	const skillKey = resolveSkillKey(entry.skill, entry);
	const { config, eligibility, allowBundled } = context;
	const skillConfig = resolveSkillConfig(config, skillKey);
	const disabled = skillConfig?.enabled === false;
	const blockedByAllowlist = !isBundledSkillAllowed(entry, allowBundled);
	const always = entry.metadata?.always === true;
	const isEnvSatisfied = (envName) => isSkillEnvRequirementSatisfied({
		envName,
		skillConfig,
		primaryEnv: entry.metadata?.primaryEnv
	});
	const isConfigSatisfied = (pathStr) => isSkillConfigPathTruthy(config, pathStr);
	const { emoji, homepage, required, missing, requirementsSatisfied, configChecks } = evaluateEntryRequirementsForCurrentPlatform({
		always,
		entry,
		hasLocalBin: context.hasWorkspaceBin,
		platform: context.platform,
		remote: eligibility?.remote,
		isEnvSatisfied,
		isConfigSatisfied
	});
	return {
		skillKey,
		always,
		disabled,
		blockedByAllowlist,
		eligible: !disabled && !blockedByAllowlist && requirementsSatisfied,
		emoji,
		homepage,
		required,
		missing,
		configChecks
	};
}
function buildSkillStatus(entry, context) {
	const { prefs, agentSkillSet } = context;
	const { skillKey, always, disabled, blockedByAllowlist, eligible, emoji, homepage, required, missing, configChecks } = buildSkillRequirements(entry, context);
	const blockedByAgentFilter = agentSkillSet !== void 0 && !agentSkillSet.has(entry.skill.name);
	const skillSource = resolveSkillSource(entry.skill);
	const bundled = skillSource === "openclaw-bundled" || skillSource === "openclaw-custodian";
	const platformIncompatible = missing.os.length > 0;
	const availableToAgent = eligible && !blockedByAgentFilter;
	const userInvocable = isSkillUserInvocable(entry);
	const fileFacts = context.files.find((facts) => facts.name === entry.skill.name && facts.filePath === entry.skill.filePath);
	const clawhub = fileFacts?.clawhub;
	const card = fileFacts?.skillCard;
	const skillCard = card ? {
		present: true,
		path: card.path,
		sizeBytes: card.sizeBytes
	} : void 0;
	return {
		name: entry.skill.name,
		description: entry.skill.description,
		source: skillSource,
		bundled,
		filePath: entry.skill.filePath,
		baseDir: entry.skill.baseDir,
		skillKey,
		primaryEnv: entry.metadata?.primaryEnv,
		emoji,
		homepage,
		always,
		disabled,
		blockedByAllowlist,
		blockedByAgentFilter,
		eligible,
		platformIncompatible,
		modelVisible: availableToAgent && isSkillPromptVisible(entry),
		userInvocable,
		commandVisible: availableToAgent && userInvocable,
		requirements: required,
		missing,
		configChecks,
		install: normalizeInstallOptions(entry, prefs, context.hasWorkspaceBin, context.platform),
		...clawhub ? { clawhub } : {},
		...skillCard ? { skillCard } : {}
	};
}
function prepareWorkspaceSkillRequirements(workspaceDir, opts) {
	const managedSkillsDir = opts?.managedSkillsDir ?? path.join(CONFIG_DIR, "skills");
	const bundledSkillsDir = resolveBundledSkillsDir();
	if (!bundledSkillsDir && !hasWarnedMissingBundledDir) {
		hasWarnedMissingBundledDir = true;
		skillsLogger.warn("Bundled skills directory could not be resolved; built-in skills may be missing.");
	}
	const agentSkillFilter = opts?.agentId ? resolveEffectiveAgentSkillFilter(opts.config, opts.agentId) : void 0;
	const skillEntries = mergeRemoteNodeSkillEntries(opts?.entries ?? loadWorkspaceSkills(workspaceDir, {
		config: opts?.config,
		agentId: opts?.agentId,
		agentSkillFilter: "ignore",
		managedSkillsDir,
		bundledSkillsDir
	}), {
		canExec: opts?.eligibility?.nodeSkills?.canExec,
		node: opts?.eligibility?.nodeSkills?.node
	});
	const allowBundled = resolveBundledAllowlist(opts?.config);
	const binaryAvailability = /* @__PURE__ */ new Map();
	const hostBins = opts?.runtime ? new Set(opts.runtime.bins) : void 0;
	const hasLocalBin = (bin) => {
		let available = binaryAvailability.get(bin);
		if (available === void 0) {
			available = hasBinary(bin);
			binaryAvailability.set(bin, available);
		}
		return available;
	};
	return {
		managedSkillsDir,
		agentSkillFilter,
		skillEntries,
		context: {
			config: opts?.config,
			hasWorkspaceBin: hostBins ? (bin) => hostBins.has(bin) : hasLocalBin,
			platform: opts?.runtime?.platform ?? process.platform,
			eligibility: opts?.eligibility,
			allowBundled
		}
	};
}
/** Assemble status from the workspace host's files and Gateway-owned policy. */
async function prepareWorkspaceSkillStatus(workspaceDir, opts) {
	const { eligibility: _eligibility, ...loadOptions } = opts ?? {};
	const sources = await prepareWorkspaceSkillEntries(workspaceDir, {
		...loadOptions,
		agentSkillFilter: "ignore",
		status: { skillCardKey: opts?.skillCardKey }
	});
	if (sources.runtime && !sources.status) throw new Error("Remote workspace skill status is unavailable");
	const localEntries = sources.status ? [...loadSkillLibrarySelection(opts?.librarySelections ?? []), ...sources.entries.filter((entry) => entry.skill.fileHost === "gateway")] : sources.entries;
	const localFacts = localEntries.length || !sources.status ? readWorkspaceSkillStatusFacts({
		entries: localEntries,
		workspaceDir,
		managedSkillsDir: opts?.managedSkillsDir ?? path.join(CONFIG_DIR, "skills"),
		skillCardKey: opts?.skillCardKey
	}) : void 0;
	const hostPaths = new Set(sources.entries.filter((entry) => entry.skill.fileHost === "workspace").map((entry) => entry.skill.filePath));
	const files = [...sources.status?.files.filter((file) => hostPaths.has(file.filePath)) ?? [], ...localFacts?.files ?? []];
	return {
		report: buildWorkspaceSkillStatus(workspaceDir, {
			...opts,
			entries: sources.entries,
			files,
			runtime: sources.runtime
		}),
		files
	};
}
function buildWorkspaceSkillStatus(workspaceDir, opts) {
	const { managedSkillsDir, agentSkillFilter, skillEntries, context } = prepareWorkspaceSkillRequirements(workspaceDir, opts);
	const prefs = resolveSkillsInstallPreferences(opts?.config);
	const files = opts?.files ?? readWorkspaceSkillStatusFacts({
		entries: skillEntries,
		workspaceDir,
		managedSkillsDir
	}).files;
	const statusContext = {
		...context,
		prefs,
		agentSkillSet: agentSkillFilter === void 0 ? void 0 : new Set(agentSkillFilter),
		files
	};
	return {
		workspaceDir,
		managedSkillsDir,
		agentId: opts?.agentId,
		agentSkillFilter,
		skills: skillEntries.map((entry) => buildSkillStatus(entry, statusContext))
	};
}
/** Readiness uses the same discovery and requirements without detailed install metadata. */
function buildWorkspaceSkillReadiness(workspaceDir, opts) {
	const { skillEntries, context } = prepareWorkspaceSkillRequirements(workspaceDir, opts);
	let eligible = 0;
	let missing = 0;
	for (const entry of skillEntries) {
		const requirements = buildSkillRequirements(entry, context);
		if (requirements.eligible) eligible += 1;
		if (hasMissingSkillRequirements(requirements)) missing += 1;
	}
	return {
		workspaceDir,
		eligible,
		missing
	};
}
//#endregion
export { resolveSkillStatusEntry as a, prepareWorkspaceSkillStatus as i, buildWorkspaceSkillStatus as n, hasMissingSkillRequirements as r, buildWorkspaceSkillReadiness as t };
