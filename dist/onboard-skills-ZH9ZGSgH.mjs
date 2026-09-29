import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as resolveBrewExecutable } from "./brew-1OE2HOX6.mjs";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { n as buildWorkspaceSkillStatus } from "./status-DwtyrGkB.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { t as detectBinary } from "./detect-binary-CzJJYZjS.mjs";
import "./onboard-helpers-0ZuVvEiw.mjs";
import { i as resolveInstallerKindReadiness, n as installSkill, t as MIN_AUTO_GO_VERSION } from "./install-xnis_cuQ.mjs";
import { t as isNodeManagerChoice } from "./onboard-types-Du2Y9b-2.mjs";
//#region src/commands/onboard-skills.ts
/**
* Interactive skill dependency setup for onboarding.
*
* It reports workspace skill readiness, offers safe dependency installs, and
* leaves per-skill credentials to the agent when a skill actually needs them.
*/
const HOMEBREW_PROMPT_PLATFORMS = /* @__PURE__ */ new Set(["darwin", "linux"]);
const SKIPPED_INSTALL_NAME_LIMIT = 8;
function supportsHomebrewPrompt(platform) {
	return HOMEBREW_PROMPT_PLATFORMS.has(platform);
}
function summarizeInstallFailure(message) {
	const cleaned = message.replace(/^Install failed(?:\s*\([^)]*\))?\s*:?\s*/i, "").trim();
	if (!cleaned) return;
	return cleaned.length > 140 ? `${truncateUtf16Safe(cleaned, 139)}…` : cleaned;
}
function formatSkillHint(skill) {
	const desc = skill.description?.trim();
	const installLabel = skill.install[0]?.label?.trim();
	const combined = desc && installLabel ? `${desc} — ${installLabel}` : desc || installLabel;
	if (!combined) return "install";
	return combined.length > 90 ? `${truncateUtf16Safe(combined, 89)}…` : combined;
}
const SKIP_REASON_LABELS = {
	brew: "Homebrew",
	go: `Go toolchain (${MIN_AUTO_GO_VERSION}+)`,
	uv: "uv"
};
function formatSkillNames(names) {
	const visible = names.slice(0, SKIPPED_INSTALL_NAME_LIMIT);
	const suffix = names.length > visible.length ? ` (+${names.length - visible.length} more)` : "";
	return `${visible.join(", ")}${suffix}`;
}
function formatSkippedInstallNote(skipped) {
	const byReason = /* @__PURE__ */ new Map();
	for (const item of skipped) {
		const names = byReason.get(item.reason) ?? [];
		names.push(item.skill.name);
		byReason.set(item.reason, names);
	}
	const lines = [t("wizard.skills.manualPrereqsIntro")];
	for (const reason of [
		"brew",
		"go",
		"uv"
	]) {
		const names = byReason.get(reason);
		if (!names || names.length === 0) continue;
		lines.push(`${SKIP_REASON_LABELS[reason]}: ${formatSkillNames(names)}`);
	}
	for (const item of skipped.filter((entry) => entry.detail).slice(0, SKIPPED_INSTALL_NAME_LIMIT)) lines.push(`${item.skill.name}: ${item.detail}`);
	lines.push(t("wizard.skills.manualPrereqsDoctorHint"));
	return lines.join("\n");
}
function isBrewOnlyInstallableSkill(skill) {
	return skill.install.length > 0 && skill.missing.bins.length > 0 && skill.install.every((option) => option.kind === "brew");
}
function isTrustedAutoInstallableSkill(skill) {
	return skill.bundled && skill.source === "openclaw-bundled";
}
function resolveDefaultNodeManager(config, requested, runtime) {
	if (requested !== void 0) {
		if (!isNodeManagerChoice(requested)) {
			runtime.error("Invalid --node-manager. Use \"npm\", \"pnpm\", or \"bun\".");
			runtime.exit(1);
			return "npm";
		}
		return requested;
	}
	return config.skills?.install?.nodeManager ?? "npm";
}
/** Runs the interactive skills setup step and returns the updated config. */
async function setupSkills(cfg, workspaceDir, runtime, prompter, options = {}) {
	const report = buildWorkspaceSkillStatus(workspaceDir, { config: cfg });
	const eligible = report.skills.filter((s) => s.eligible);
	const unsupportedOs = report.skills.filter((s) => !s.disabled && !s.blockedByAllowlist && s.missing.os.length > 0);
	const missing = report.skills.filter((s) => !s.eligible && !s.disabled && !s.blockedByAllowlist && s.missing.os.length === 0);
	const blocked = report.skills.filter((s) => s.blockedByAllowlist);
	await prompter.note([
		`Eligible: ${eligible.length}`,
		`Missing requirements: ${missing.length}`,
		`Unsupported on this OS: ${unsupportedOs.length}`,
		`Blocked by allowlist: ${blocked.length}`
	].join("\n"), t("wizard.skills.statusTitle"));
	const baseInstallable = missing.filter((skill) => skill.install.length > 0 && skill.missing.bins.length > 0 && isTrustedAutoInstallableSkill(skill));
	let brewAvailable;
	const detectBrewOnce = async () => {
		brewAvailable ??= await detectBinary("brew") || resolveBrewExecutable() !== void 0;
		return brewAvailable;
	};
	const readinessByKind = /* @__PURE__ */ new Map();
	const resolveKindReadinessOnce = async (kind) => {
		const cached = readinessByKind.get(kind);
		if (cached) return cached;
		const readiness = await resolveInstallerKindReadiness(kind);
		readinessByKind.set(kind, readiness);
		return readiness;
	};
	const inLinuxContainer = process.platform === "linux" && isContainerEnvironment();
	let installable = baseInstallable;
	if (inLinuxContainer && baseInstallable.length > 0 && !await detectBrewOnce()) {
		const hiddenBrewOnly = baseInstallable.filter(isBrewOnlyInstallableSkill);
		installable = baseInstallable.filter((skill) => !isBrewOnlyInstallableSkill(skill));
		if (hiddenBrewOnly.length > 0) await prompter.note([t("wizard.skills.containerBrewHidden"), t("wizard.skills.containerBrewManual")].join("\n"), t("wizard.skills.containerInstallsTitle"));
	}
	const candidateInstallable = installable;
	const readinessBySkillName = /* @__PURE__ */ new Map();
	for (const skill of candidateInstallable) {
		const primaryInstall = skill.install[0];
		if (!primaryInstall) continue;
		const readiness = await resolveKindReadinessOnce(primaryInstall.kind);
		readinessBySkillName.set(skill.name, readiness);
	}
	let next = cfg;
	if (candidateInstallable.length === 0 && missing.length === 0) {
		await prompter.note([
			"No missing skill dependencies to install.",
			`To inspect available skills, run: ${formatCliCommand("openclaw skills list --verbose")}`,
			`To check skill status, run: ${formatCliCommand("openclaw skills check")}`
		].join("\n"), t("wizard.skills.allReadyTitle") ?? "All skills ready");
		return next;
	}
	if (candidateInstallable.length > 0) {
		const selectedSkills = (await prompter.multiselect({
			message: t("wizard.skills.installDeps"),
			options: [{
				value: "__skip__",
				label: t("common.skipForNow"),
				hint: t("wizard.skills.skipDepsHint")
			}, ...candidateInstallable.map((skill) => ({
				value: skill.name,
				label: `${skill.emoji ?? "🧩"} ${skill.name}`,
				hint: formatSkillHint(skill)
			}))]
		})).filter((name) => name !== "__skip__").map((name) => candidateInstallable.find((skill) => skill.name === name)).filter((skill) => skill !== void 0);
		const selectedReadySkills = [];
		const selectedSkippedInstallable = [];
		for (const skill of selectedSkills) {
			const readiness = readinessBySkillName.get(skill.name);
			if (readiness?.ready !== false) selectedReadySkills.push(skill);
			else selectedSkippedInstallable.push({
				skill,
				reason: readiness.reason
			});
		}
		if (selectedReadySkills.some((skill) => skill.install.some((option) => option.kind === "node"))) {
			const nodeManager = resolveDefaultNodeManager(next, options.nodeManager, runtime);
			next = {
				...next,
				skills: {
					...next.skills,
					install: {
						...next.skills?.install,
						nodeManager
					}
				}
			};
		}
		const deferredSkippedInstallable = [];
		for (const target of selectedReadySkills) {
			if (target.install.length === 0) continue;
			const installId = target.install[0]?.id;
			if (!installId) continue;
			await options.beforePersistentEffect?.();
			const spin = prompter.progress(t("wizard.skills.installing", { name: target.name }));
			const result = await installSkill({
				workspaceDir,
				skillName: target.name,
				installId,
				config: next
			});
			const warnings = result.warnings ?? [];
			if (result.ok) {
				spin.stop(warnings.length > 0 ? t("wizard.skills.installedWithWarnings", { name: target.name }) : t("wizard.skills.installed", { name: target.name }));
				for (const warning of warnings) runtime.log(warning);
				continue;
			}
			if (result.skipReason) {
				spin.stop(t("wizard.skills.installSkipped", { name: target.name }));
				const detail = summarizeInstallFailure(result.message);
				deferredSkippedInstallable.push({
					skill: target,
					reason: result.skipReason,
					...detail ? { detail } : {}
				});
				for (const warning of warnings) runtime.log(warning);
				continue;
			}
			const code = result.code == null ? "" : ` (exit ${result.code})`;
			const detail = summarizeInstallFailure(result.message);
			spin.stop(t("wizard.skills.installFailed", {
				name: target.name,
				code,
				detail: detail ? ` - ${detail}` : ""
			}));
			for (const warning of warnings) runtime.log(warning);
			if (result.stderr) runtime.log(result.stderr.trim());
			else if (result.stdout) runtime.log(result.stdout.trim());
			runtime.log(`Tip: run \`${formatCliCommand("openclaw doctor")}\` to review skills + requirements.`);
			runtime.log(t("wizard.skills.docsLine"));
		}
		if (deferredSkippedInstallable.length > 0) selectedSkippedInstallable.push(...deferredSkippedInstallable);
		if (supportsHomebrewPrompt(process.platform) && selectedSkippedInstallable.some((item) => item.reason === "brew")) await prompter.note([
			"Many skill dependencies are shipped via Homebrew.",
			"Without brew, you'll need to build from source or download releases manually.",
			"",
			"Install Homebrew:",
			"/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
		].join("\n"), t("wizard.skills.homebrewRecommendedTitle"));
		if (selectedSkippedInstallable.length > 0) await prompter.note(formatSkippedInstallNote(selectedSkippedInstallable), t("wizard.skills.manualPrereqsTitle"));
	}
	return next;
}
//#endregion
export { setupSkills as t };
