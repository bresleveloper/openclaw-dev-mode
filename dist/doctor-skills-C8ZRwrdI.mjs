import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { n as buildWorkspaceSkillStatus } from "./status-DQx5F0If.mjs";
import { r as shouldAutoApproveDoctorFix } from "./doctor-repair-mode-CGb0a8nw.mjs";
import { n as disableUnavailableSkillsInConfig, t as collectUnavailableAgentSkills } from "./doctor-skills-core-Yeo8bqi0.mjs";
import { existsSync } from "node:fs";
import { posix, win32 } from "node:path";
//#region src/skills/lifecycle/gh-config-discovery.ts
function pathFor(platform) {
	return platform === "win32" ? win32 : posix;
}
const HOSTS_FILE = "hosts.yml";
function resolveEffectiveGhConfigDir(input) {
	const env = input.env;
	const xdg = env.XDG_CONFIG_HOME?.trim();
	if (xdg) return pathFor(input.platform).join(xdg, "gh");
	if (input.platform === "win32") {
		const appData = env.APPDATA?.trim();
		if (appData) return pathFor(input.platform).join(appData, "GitHub CLI");
		const profile = env.USERPROFILE?.trim();
		if (profile) return pathFor(input.platform).join(profile, "AppData", "Roaming", "GitHub CLI");
	}
	const home = env.HOME?.trim();
	if (!home) return;
	return pathFor(input.platform).join(home, ".config", "gh");
}
function defaultCandidateOperatorHomes(input) {
	const env = input.env;
	const homes = /* @__PURE__ */ new Set();
	if (input.platform !== "win32") homes.add("/root");
	if (env.SUDO_USER?.trim()) {
		const sudoUser = env.SUDO_USER.trim();
		homes.add(pathFor(input.platform).join("/home", sudoUser));
		if (input.platform === "darwin") homes.add(pathFor(input.platform).join("/Users", sudoUser));
	}
	if (env.USER?.trim()) {
		const user = env.USER.trim();
		if (user !== "root") {
			if (input.platform === "darwin") homes.add(pathFor(input.platform).join("/Users", user));
			else if (input.platform !== "win32") homes.add(pathFor(input.platform).join("/home", user));
		}
	}
	const processHome = env.HOME?.trim();
	if (processHome) homes.delete(processHome);
	return [...homes];
}
function detectGhConfigDirMismatch(input) {
	const env = input.env;
	if (env.GH_CONFIG_DIR && env.GH_CONFIG_DIR.trim()) return {
		kind: "explicit-gh-config-dir-set",
		ghConfigDir: env.GH_CONFIG_DIR.trim()
	};
	const effective = resolveEffectiveGhConfigDir(input);
	if (!effective) return { kind: "no-process-home" };
	const effectiveHosts = pathFor(input.platform).join(effective, HOSTS_FILE);
	if (input.fileExists(effectiveHosts)) return {
		kind: "auth-discoverable",
		effectiveConfigDir: effective
	};
	const candidates = input.candidateOperatorHomes ?? defaultCandidateOperatorHomes(input);
	for (const home of candidates) {
		const candidateDir = pathFor(input.platform).join(home, ".config", "gh");
		if (candidateDir === effective) continue;
		const candidateHosts = pathFor(input.platform).join(candidateDir, HOSTS_FILE);
		if (input.fileExists(candidateHosts)) return {
			kind: "mismatch",
			effectiveConfigDir: effective,
			alternateConfigDir: candidateDir,
			alternateHostsFile: candidateHosts,
			alternateHomeHint: home,
			suggestedEnvValue: candidateDir
		};
	}
	return {
		kind: "no-known-auth",
		effectiveConfigDir: effective
	};
}
function formatGhConfigDirMismatchHint(mismatch) {
	const lines = [
		"GitHub CLI auth was found at a different HOME than the one this OpenClaw process uses.",
		`  Process gh config dir: ${mismatch.effectiveConfigDir}`,
		`  Authenticated config:  ${mismatch.alternateConfigDir} (contains ${HOSTS_FILE})`
	];
	if (mismatch.alternateHomeHint) lines.push(`  Authenticated HOME:    ${mismatch.alternateHomeHint}`);
	lines.push(`  Fix: set GH_CONFIG_DIR=${mismatch.suggestedEnvValue} on the OpenClaw service environment, then restart the gateway.`);
	return lines;
}
//#endregion
//#region src/commands/doctor-skills.ts
function describeGhConfigDirHint(skills) {
	const discoveryInput = {
		platform: process.platform,
		env: process.env,
		fileExists: existsSync
	};
	const githubSkill = skills.find((skill) => skill.name === "github");
	if (!githubSkill?.eligible || githubSkill.blockedByAgentFilter) return [];
	const result = detectGhConfigDirMismatch(discoveryInput);
	if (result.kind !== "mismatch") return [];
	return formatGhConfigDirMismatchHint(result);
}
function formatUnavailableSkillDoctorLines(skills, includeDisableHint) {
	const count = skills.length;
	const lines = [`${count} allowed skill${count === 1 ? " is" : "s are"} not usable in this environment (missing binaries, env vars, or config).`, `- ${skills.map((skill) => skill.name).toSorted((a, b) => a.localeCompare(b)).join(", ")}`];
	if (skills.some((skill) => skill.missing.bins.length > 0 || skill.missing.anyBins.length > 0)) lines.push("Missing local binaries may exist on paired nodes; these skills remain enabled.");
	if (includeDisableHint) lines.push(`Disable unused skills: ${formatCliCommand("openclaw doctor --fix")}`);
	lines.push(`Inspect details: ${formatCliCommand("openclaw skills check --agent <id>")} or ${formatCliCommand("openclaw skills info <name> --agent <id>")}`);
	return lines;
}
function collectFleetUnavailableSkills(reports) {
	const preservedKeys = new Set(reports.flatMap(({ skills }) => skills.filter((skill) => !skill.blockedByAgentFilter && (skill.eligible || skill.missing.bins.length > 0 || skill.missing.anyBins.length > 0)).map((skill) => skill.skillKey)));
	const candidates = /* @__PURE__ */ new Map();
	for (const skill of reports.flatMap(({ unavailable }) => unavailable)) if (!preservedKeys.has(skill.skillKey)) candidates.set(skill.skillKey, skill);
	return [...candidates.values()];
}
/** Checks every agent's skill readiness without disabling skills for missing local binaries. */
async function maybeRepairSkillReadiness(params) {
	const agentIds = listAgentIds(params.cfg);
	const reports = agentIds.map((agentId) => ({
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(params.cfg, agentId)
	})).map(({ agentId, workspaceDir }) => {
		const buildReport = () => {
			const report = buildWorkspaceSkillStatus(workspaceDir, {
				config: params.cfg,
				agentId
			});
			return {
				agentId,
				skills: report.skills,
				unavailable: collectUnavailableAgentSkills(report)
			};
		};
		return params.runWithPluginMetadataSnapshot ? params.runWithPluginMetadataSnapshot({
			config: params.cfg,
			workspaceDir
		}, buildReport) : buildReport();
	});
	const fleetUnavailable = collectFleetUnavailableSkills(reports);
	const globallyUnavailableKeys = new Set(fleetUnavailable.map((skill) => skill.skillKey));
	const willRepair = shouldAutoApproveDoctorFix(params.prompter.repairMode, { blockDuringUpdate: true });
	for (const { agentId, skills, unavailable: unavailableForAgent } of reports) {
		const prefix = agentIds.length > 1 ? `Agent "${agentId}":\n` : "";
		const githubHint = describeGhConfigDirHint(skills);
		if (githubHint.length > 0) note(`${prefix}${githubHint.join("\n")}`, "GitHub CLI");
		if (unavailableForAgent.length > 0) {
			const includesGlobalCandidate = unavailableForAgent.some((skill) => globallyUnavailableKeys.has(skill.skillKey));
			note(`${prefix}${formatUnavailableSkillDoctorLines(unavailableForAgent, includesGlobalCandidate && !willRepair).join("\n")}`, "Skills");
		}
	}
	if (fleetUnavailable.length === 0) return params.cfg;
	if (!await params.prompter.confirmRuntimeRepair({
		message: agentIds.length === 1 ? `Disable ${fleetUnavailable.length} unavailable skill${fleetUnavailable.length === 1 ? "" : "s"} in config?` : `Disable ${fleetUnavailable.length} skill${fleetUnavailable.length === 1 ? "" : "s"} unavailable to every configured agent?`,
		initialValue: false
	})) return params.cfg;
	const next = disableUnavailableSkillsInConfig(params.cfg, fleetUnavailable);
	note(fleetUnavailable.map((skill) => `- Disabled ${skill.name}`).join("\n"), "Doctor changes");
	return next;
}
//#endregion
export { maybeRepairSkillReadiness };
