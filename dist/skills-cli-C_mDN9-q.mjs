import { S as isSkillsMachineOutput } from "./argv-IYTsfFsq.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-f6PhkiZS.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { p as shortenHomePath, t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { f as resolveConfiguredAgentId, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { n as formatConcreteConfigPath } from "./dot-path-BSC76DAI.mjs";
import { r as readRegularFile } from "./regular-file-D4i0kJHS.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as stripAnsi, n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { s as sanitizeHostExecEnv } from "./host-env-security-D7wdDMke.mjs";
import { l as resolveAgentIdByWorkspacePath } from "./agent-scope-CTuYDtny.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { i as canFallbackToImplicitLocalGateway, r as callGatewayFromCliWithTransport, t as addGatewayClientOptions } from "./gateway-rpc-DXO3PHhc.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as SKILL_LIBRARY_MAX_FILE_BYTES, t as SKILL_LIBRARY_MAX_BUNDLE_BYTES } from "./skill-library-C7RO5Y8q.mjs";
import { c as withInstallWorkspace } from "./install-source-utils-CeCvRCDR.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-BNUXOhfF.mjs";
import { t as CLAWHUB_TRUST_ERROR_CODE } from "./clawhub-install-trust-DUzoqrpN.mjs";
import { i as fetchClawHubSkillCard, n as CLAWHUB_SKILLS_SH_TRUST_LABEL } from "./clawhub-skills-DTZJRHzC.mjs";
import { i as acquireGitSource, n as isImmutableGitCommitRef, r as parseGitPluginSpec } from "./git-install-BmbTWBzd.mjs";
import { n as formatTimeAgo } from "./format-relative-BOUle7M5.mjs";
import { t as parseSkillFrontmatter } from "./frontmatter-2H_F0IFB.mjs";
import { r as validateRequestedSkillSlug } from "./install-paths-DBBNLgEr.mjs";
import { m as readTrackedClawHubSkillSlugs } from "./clawhub-store-CLSS382v.mjs";
import { c as searchSkillsFromClawHub, i as resolveClawHubSkillVerificationTarget } from "./clawhub-status-DVwv_3mo.mjs";
import { c as proposeCreateSkill, g as readSkillProposalDraftFile, h as readSkillProposalDraftDirectory, i as reviseSkillProposal, l as proposeUpdateSkill, n as quarantineSkillProposal, r as rejectSkillProposal, t as applySkillProposal } from "./service-ChKarKGD.mjs";
import { n as listSkillProposals, t as inspectSkillProposal } from "./service-query-CBcNmTSa.mjs";
import { a as resolveSkillStatusEntry, r as hasMissingSkillRequirements } from "./status-C5lk8raw.mjs";
import { n as decorativePrefix, t as decorativeEmoji } from "./decorative-emoji-Dgii7osH.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BRdXcJHh.mjs";
import { n as runCommandWithRuntime, t as resolveOptionFromCommand } from "./cli-utils-CPCW_T04.mjs";
import { n as parseStrictPositiveIntOption, t as collectOption } from "./helpers-BuPKARfv.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.mjs";
import { t as resolveClawHubInstallConfirmation } from "./clawhub-install-confirmation-CctKL64D.mjs";
import { r as installExtractedSkillRoot } from "./archive-install-DvPJCL8V.mjs";
import { a as readVerifiedClawHubSkillSourceUrl, i as verifySkillWithClawHub, r as updateSkillsFromClawHub, t as installSkillFromClawHub } from "./clawhub-BGD8Bvto.mjs";
import { n as setCommandJsonMode } from "./json-mode-BYKm3vNF.mjs";
import { t as formatVersionLabel } from "./version-format-B-C6AzAF.mjs";
import { t as resolveInstallPolicyWarningAcknowledgementCliOptions } from "./install-policy-warning-acknowledgement-CYbro62d.mjs";
import { t as recordSkillSourceInstall } from "./source-install-metadata-CU-WdGq2.mjs";
import { n as getSkillCuratorStatus, t as SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE } from "./curator-BpldtG30.mjs";
import path from "node:path";
import * as fs$1 from "node:fs/promises";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { Option } from "commander";
//#region src/skills/lifecycle/source-install.ts
function createGitCommandEnv() {
	return sanitizeHostExecEnv({
		baseEnv: {
			...process.env,
			GIT_CONFIG_NOSYSTEM: "1",
			GIT_TERMINAL_PROMPT: "0"
		},
		blockPathOverrides: false
	});
}
async function readSkillNameFromFrontmatter(skillDir) {
	try {
		const raw = await fs.readFile(path.join(skillDir, "SKILL.md"), "utf8");
		const frontmatter = parseSkillFrontmatter(raw);
		return normalizeOptionalString(frontmatter.name) ?? null;
	} catch {
		return null;
	}
}
function resolveFallbackSlugFromPath(sourcePath) {
	return path.basename(path.resolve(sourcePath)).trim();
}
async function resolveSkillInstallSlug(params) {
	const explicit = normalizeOptionalString(params.slug);
	if (explicit) return validateRequestedSkillSlug(explicit);
	const frontmatterName = await readSkillNameFromFrontmatter(params.sourceDir);
	if (frontmatterName) try {
		return validateRequestedSkillSlug(frontmatterName);
	} catch {}
	return validateRequestedSkillSlug(params.fallbackLabel);
}
async function copyGitWorktreeExport(params) {
	try {
		await fs.cp(params.repoDir, params.exportDir, {
			recursive: true,
			filter: (source) => !path.relative(params.repoDir, source).split(path.sep).includes(".git")
		});
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			error: `failed to prepare git skill source: ${String(err)}`
		};
	}
}
async function installLocalSkillDir(params) {
	const slug = await resolveSkillInstallSlug({
		sourceDir: params.sourceDir,
		fallbackLabel: params.fallbackLabel,
		slug: params.slug
	});
	const workspaceAccess = getAgentWorkspaceAccess(params.workspaceDir, "loadSkills");
	const access = workspaceAccess?.loadSkills ? workspaceAccess : void 0;
	if (access && !access.recordSkillSourceInstall) return {
		ok: false,
		error: "Remote workspace skill source tracking is unavailable"
	};
	const recordInstall = access?.recordSkillSourceInstall ?? recordSkillSourceInstall;
	const install = await installExtractedSkillRoot({
		workspaceDir: params.workspaceDir,
		slug,
		extractedRoot: params.sourceDir,
		mode: params.force ? "update" : "install",
		timeoutMs: params.timeoutMs,
		logger: params.logger,
		policy: {
			config: params.config,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			installId: params.source,
			origin: {
				type: params.source,
				spec: params.sourceSpec,
				...params.git?.commit ? { commit: params.git.commit } : {},
				...params.git?.ref ? { ref: params.git.ref } : {}
			},
			source: params.source === "git" ? {
				kind: "git",
				authority: "third-party",
				mutable: !isImmutableGitCommitRef(params.git?.ref),
				network: true
			} : {
				kind: "local-path",
				authority: "user",
				mutable: true,
				network: false
			},
			requestedSpecifier: params.sourceSpec
		}
	});
	if (!install.ok) return {
		ok: false,
		error: install.error
	};
	await recordInstall({
		workspaceDir: params.workspaceDir,
		targetDir: install.targetDir,
		origin: {
			version: 1,
			source: params.source,
			spec: params.sourceSpec,
			slug,
			installedAt: Date.now(),
			...params.git ? { git: params.git } : {}
		}
	});
	return {
		ok: true,
		slug,
		targetDir: install.targetDir,
		source: params.source,
		...params.git ? { git: params.git } : {}
	};
}
async function installGitSkill(params) {
	const parsed = parseGitPluginSpec(params.spec);
	if (!parsed) return {
		ok: false,
		error: `Unsupported git skill spec: ${params.spec}`
	};
	return await withInstallWorkspace("openclaw-git-skill-", async (tmpDir) => {
		const repoDir = path.join(tmpDir, "repo");
		const exportDir = path.join(tmpDir, "export");
		params.logger?.info?.(`Cloning ${sanitizeForLog(redactSensitiveUrlLikeString(parsed.label))}...`);
		const acquired = await acquireGitSource({
			...parsed,
			repoDir,
			refMode: "resolve-remote",
			timeoutMs: params.timeoutMs,
			commandEnv: () => ({
				baseEnv: {},
				env: createGitCommandEnv()
			})
		});
		if (!acquired.ok) return acquired;
		const git = {
			url: redactSensitiveUrlLikeString(parsed.url),
			...parsed.ref ? { ref: parsed.ref } : {},
			commit: acquired.commit,
			resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const exported = await copyGitWorktreeExport({
			repoDir,
			exportDir
		});
		if (!exported.ok) return exported;
		return await installLocalSkillDir({
			workspaceDir: params.workspaceDir,
			sourceDir: exportDir,
			sourceSpec: redactSensitiveUrlLikeString(parsed.normalizedSpec),
			source: "git",
			fallbackLabel: path.basename(parsed.label),
			slug: params.slug,
			force: params.force,
			timeoutMs: params.timeoutMs,
			logger: params.logger,
			config: params.config,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			git
		});
	});
}
async function installPathSkill(params) {
	const sourceDir = resolveUserPath(params.spec);
	let stat;
	try {
		stat = await fs.stat(sourceDir);
	} catch {
		return {
			ok: false,
			error: `Skill path not found: ${sourceDir}`
		};
	}
	if (!stat.isDirectory()) return {
		ok: false,
		error: `Skill path is not a directory: ${sourceDir}`
	};
	return await installLocalSkillDir({
		workspaceDir: params.workspaceDir,
		sourceDir,
		sourceSpec: params.spec,
		source: "path",
		fallbackLabel: resolveFallbackSlugFromPath(sourceDir),
		slug: params.slug,
		force: params.force,
		timeoutMs: params.timeoutMs,
		logger: params.logger,
		config: params.config,
		onInstallPolicyWarning: params.onInstallPolicyWarning
	});
}
function isSkillSourceInstallSpec(raw) {
	const trimmed = raw.trim();
	return trimmed.toLowerCase().startsWith("git:") || trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed.startsWith("~/") || path.isAbsolute(trimmed);
}
async function installSkillFromSource(params) {
	const spec = params.spec.trim();
	if (spec.toLowerCase().startsWith("git:")) return await installGitSkill({
		...params,
		spec
	});
	return await installPathSkill({
		...params,
		spec
	});
}
//#endregion
//#region src/cli/skills-cli.format.ts
function appendClawHubHint(output) {
	const command = formatCliCommand("openclaw skills");
	return `${output}\n\nTip: use \`${command} search\`, \`${command} install\`, and \`${command} update\` for ClawHub-backed skills.`;
}
function formatSkillStatus(skill, detailed = false) {
	if (skill.disabled) return theme.warn(decorativePrefix("⏸", detailed ? "Disabled" : "disabled"));
	if (skill.blockedByAllowlist) return theme.warn(decorativePrefix("🚫", detailed ? "Blocked by allowlist" : "blocked"));
	if (skill.blockedByAgentFilter) return theme.warn(decorativePrefix("🚫", detailed ? "Excluded by agent allowlist" : "excluded"));
	if (skill.eligible) return theme.success(detailed ? "✓ Ready" : "✓ ready");
	return theme.warn(detailed ? "△ Needs setup" : "△ needs setup");
}
function normalizeSkillEmoji(emoji) {
	if (emoji) return emoji.replaceAll("︎", "️");
	return decorativeEmoji("📦");
}
const REMAINING_ESC_SEQUENCE_REGEX = new RegExp(String.raw`\u001b(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])`, "g");
const JSON_CONTROL_CHAR_REGEX = new RegExp(String.raw`[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]`, "g");
function sanitizeJsonString(value) {
	return stripAnsi(value).replace(REMAINING_ESC_SEQUENCE_REGEX, "").replace(JSON_CONTROL_CHAR_REGEX, "");
}
function formatSkillsJson(value) {
	return JSON.stringify(value, (_key, entry) => typeof entry === "string" ? sanitizeJsonString(entry) : entry, 2);
}
function formatSkillName(skill) {
	const emoji = normalizeSkillEmoji(skill.emoji);
	const name = theme.command(sanitizeForLog(skill.name));
	return emoji ? `${emoji} ${name}` : name;
}
const SKILL_REQUIREMENT_GROUPS = [
	["bins", "Binaries"],
	["anyBins", "Any binaries"],
	["env", "Environment"],
	["config", "Config"],
	["os", "OS"]
];
function formatSkillMissingSummary(skill) {
	return SKILL_REQUIREMENT_GROUPS.filter(([key]) => skill.missing[key].length > 0).map(([key]) => `${key}: ${skill.missing[key].join(", ")}`).join("; ");
}
/** Render skill discovery status as sanitized JSON or a terminal table. */
function formatSkillsList(report, opts) {
	const isReadyForAgent = (skill) => skill.eligible && !skill.blockedByAgentFilter;
	const skills = opts.eligible ? report.skills.filter(isReadyForAgent) : report.skills;
	if (opts.json) return formatSkillsJson({
		workspaceDir: report.workspaceDir,
		managedSkillsDir: report.managedSkillsDir,
		skills: skills.map((s) => ({
			name: s.name,
			description: s.description,
			emoji: s.emoji,
			eligible: s.eligible,
			disabled: s.disabled,
			blockedByAllowlist: s.blockedByAllowlist,
			blockedByAgentFilter: s.blockedByAgentFilter,
			modelVisible: s.modelVisible,
			userInvocable: s.userInvocable,
			commandVisible: s.commandVisible,
			source: s.source,
			bundled: s.bundled,
			primaryEnv: s.primaryEnv,
			homepage: s.homepage,
			missing: s.missing
		}))
	});
	if (skills.length === 0) return appendClawHubHint(opts.eligible ? `No eligible skills found. Run \`${formatCliCommand("openclaw skills list")}\` to see all skills.` : "No skills found.");
	const ready = skills.filter(isReadyForAgent);
	const tableWidth = getTerminalTableWidth();
	const rows = skills.map((skill) => ({
		Status: formatSkillStatus(skill),
		Skill: formatSkillName(skill),
		Description: theme.muted(skill.description),
		Source: skill.source,
		Missing: opts.verbose ? theme.warn(formatSkillMissingSummary(skill)) : ""
	}));
	const columns = [
		{
			key: "Status",
			header: "Status",
			minWidth: 10
		},
		{
			key: "Skill",
			header: "Skill",
			minWidth: 22
		},
		{
			key: "Description",
			header: "Description",
			minWidth: 24,
			flex: true
		},
		{
			key: "Source",
			header: "Source",
			minWidth: 10
		}
	];
	if (opts.verbose) columns.push({
		key: "Missing",
		header: "Missing",
		minWidth: 18,
		flex: true
	});
	const lines = [];
	lines.push(`${theme.heading("Skills")} ${theme.muted(`(${ready.length}/${skills.length} ready)`)}`);
	lines.push(renderTable({
		width: tableWidth,
		columns,
		rows
	}).trimEnd());
	return appendClawHubHint(lines.join("\n"));
}
/** Render one skill's status, requirements, install hints, and API-key setup details. */
function formatSkillInfo(report, skillName, opts) {
	const requestedName = skillName.trim();
	const skill = resolveSkillStatusEntry(report.skills, requestedName);
	if (!skill) {
		if (opts.json) return formatSkillsJson({
			...formatCliJsonFailure(`Skill "${requestedName}" not found.`),
			skill: requestedName
		});
		return appendClawHubHint(`Skill "${sanitizeJsonString(sanitizeForLog(requestedName))}" not found. Run \`${formatCliCommand("openclaw skills list")}\` to see available skills.`);
	}
	if (opts.json) return formatSkillsJson(skill);
	const lines = [];
	const emoji = normalizeSkillEmoji(skill.emoji);
	const status = formatSkillStatus(skill, true);
	const safeName = sanitizeForLog(skill.name);
	const safeHomepage = skill.homepage ? sanitizeForLog(skill.homepage) : void 0;
	const safeSkillKey = sanitizeForLog(skill.skillKey);
	lines.push(`${emoji ? `${emoji} ` : ""}${theme.heading(safeName)} ${status}`);
	lines.push("");
	lines.push(sanitizeForLog(skill.description));
	lines.push("");
	lines.push(theme.heading("Details:"));
	lines.push(`${theme.muted("  Source:")} ${sanitizeForLog(skill.source)}`);
	lines.push(`${theme.muted("  Path:")} ${shortenHomePath(skill.filePath)}`);
	if (safeHomepage) lines.push(`${theme.muted("  Homepage:")} ${safeHomepage}`);
	lines.push(`${theme.muted("  Visible to model:")} ${skill.modelVisible ? theme.success("yes") : theme.warn("no")}`);
	lines.push(`${theme.muted("  Available as command:")} ${skill.commandVisible ? theme.success("yes") : theme.warn("no")}`);
	if (skill.blockedByAgentFilter) lines.push(`${theme.muted("  Agent allowlist:")} excludes this skill`);
	if (skill.primaryEnv) lines.push(`${theme.muted("  Primary env:")} ${skill.primaryEnv}`);
	const requirementGroups = SKILL_REQUIREMENT_GROUPS.filter(([key]) => skill.requirements[key].length > 0);
	if (requirementGroups.length > 0) {
		lines.push("");
		lines.push(theme.heading("Requirements:"));
		const formatRequirementStatus = (value, satisfied) => satisfied ? theme.success(`✓ ${value}`) : theme.error(`✗ ${value}`);
		for (const [key, label] of requirementGroups) {
			const required = skill.requirements[key];
			const missing = skill.missing[key];
			let requirementStatus;
			if (key === "anyBins" || key === "os") requirementStatus = formatRequirementStatus(`(${key === "anyBins" ? "any of: " : ""}${required.join(", ")})`, missing.length === 0);
			else requirementStatus = required.map((requirement) => formatRequirementStatus(requirement, !missing.includes(requirement))).join(", ");
			lines.push(`${theme.muted(`  ${label}:`)} ${requirementStatus}`);
		}
	}
	if (skill.install.length > 0 && !skill.eligible) {
		lines.push("");
		lines.push(theme.heading("Install options:"));
		for (const inst of skill.install) lines.push(`  ${theme.warn("→")} ${inst.label}`);
	}
	if (skill.primaryEnv && skill.missing.env.includes(skill.primaryEnv)) {
		const apiKeyPath = quoteCliArg(formatConcreteConfigPath([
			"skills",
			"entries",
			safeSkillKey,
			"apiKey"
		]));
		lines.push("");
		lines.push(theme.heading("API key setup:"));
		if (safeHomepage) lines.push(`  Get your key: ${safeHomepage}`);
		lines.push(`  Save via UI: ${theme.muted("Control UI → Skills → ")}${safeName}${theme.muted(" → Save key")}`);
		lines.push(`  Save via CLI: ${formatCliCommand(`openclaw config set ${apiKeyPath} YOUR_KEY`)}`);
		lines.push(`  Stored in: ${theme.muted("$OPENCLAW_CONFIG_PATH")} ${theme.muted("(default: ~/.openclaw/openclaw.json)")}`);
	}
	return appendClawHubHint(lines.join("\n"));
}
/** Render aggregate setup health for all discovered skills. */
function formatSkillsCheck(report, opts) {
	const eligible = report.skills.filter((s) => s.eligible);
	const modelVisible = report.skills.filter((s) => s.modelVisible);
	const commandVisible = report.skills.filter((s) => s.commandVisible);
	const disabled = report.skills.filter((s) => s.disabled);
	const blocked = report.skills.filter((s) => s.blockedByAllowlist && !s.disabled);
	const agentFiltered = report.skills.filter((s) => s.blockedByAgentFilter);
	const promptHidden = report.skills.filter((s) => s.eligible && !s.blockedByAgentFilter && !s.modelVisible);
	const missingReqs = report.skills.filter(hasMissingSkillRequirements);
	const agentId = report.agentId ?? opts.agent;
	if (opts.json) return formatSkillsJson({
		agentId,
		agentSkillFilter: report.agentSkillFilter,
		workspaceDir: report.workspaceDir,
		managedSkillsDir: report.managedSkillsDir,
		summary: {
			total: report.skills.length,
			eligible: eligible.length,
			modelVisible: modelVisible.length,
			commandVisible: commandVisible.length,
			disabled: disabled.length,
			blocked: blocked.length,
			agentFiltered: agentFiltered.length,
			notInjected: promptHidden.length,
			missingRequirements: missingReqs.length
		},
		eligible: eligible.map((s) => s.name),
		modelVisible: modelVisible.map((s) => s.name),
		commandVisible: commandVisible.map((s) => s.name),
		disabled: disabled.map((s) => s.name),
		blocked: blocked.map((s) => s.name),
		agentFiltered: agentFiltered.map((s) => s.name),
		notInjected: promptHidden.map((s) => ({
			name: s.name,
			reason: "disable-model-invocation"
		})),
		missingRequirements: missingReqs.map((s) => ({
			name: s.name,
			missing: s.missing,
			install: s.install
		}))
	});
	const lines = [];
	lines.push(theme.heading("Skills Status Check"));
	if (agentId) lines.push(`${theme.muted("Agent:")} ${sanitizeForLog(agentId)}`);
	lines.push("");
	lines.push(`${theme.muted("Total:")} ${report.skills.length}`);
	lines.push(`${theme.success("✓")} ${theme.muted("Eligible:")} ${eligible.length}`);
	lines.push(`${theme.success("✓")} ${theme.muted("Visible to model:")} ${modelVisible.length}`);
	lines.push(`${theme.success("✓")} ${theme.muted("Available as command:")} ${commandVisible.length}`);
	lines.push(`${theme.warn(decorativePrefix("⏸", "Disabled:"))} ${theme.muted(String(disabled.length))}`);
	lines.push(`${theme.warn(decorativePrefix("🚫", "Blocked by allowlist:"))} ${theme.muted(String(blocked.length))}`);
	if (agentId || agentFiltered.length > 0) lines.push(`${theme.warn(decorativePrefix("🚫", "Excluded by agent allowlist:"))} ${theme.muted(String(agentFiltered.length))}`);
	if (promptHidden.length > 0) lines.push(`${theme.warn("△")} ${theme.muted("Ready but hidden from model prompt:")} ${promptHidden.length}`);
	lines.push(`${theme.error("✗")} ${theme.muted("Missing requirements:")} ${missingReqs.length}`);
	if (modelVisible.length > 0 || commandVisible.length > 0 || promptHidden.length > 0) {
		lines.push("");
		lines.push(theme.heading("What this means:"));
		lines.push(`  ${theme.muted("Eligible:")} installed and requirements pass; the agent may still exclude it.`);
		if (modelVisible.length > 0) lines.push(`  ${theme.muted("Visible to model:")} the agent can see the skill instructions during normal chat.`);
		if (commandVisible.length > 0) lines.push(`  ${theme.muted("Available as command:")} people, scripts, or automations can call the skill explicitly.`);
		if (promptHidden.length > 0) lines.push(`  ${theme.muted("Hidden from model prompt:")} installed and ready, but kept out of normal chat.`);
	}
	if (modelVisible.length > 0) {
		lines.push("");
		lines.push(theme.heading("Ready and visible to model:"));
		for (const skill of modelVisible) {
			const emoji = normalizeSkillEmoji(skill.emoji);
			lines.push(`  ${emoji ? `${emoji} ` : ""}${sanitizeForLog(skill.name)}`);
		}
	}
	if (promptHidden.length > 0) {
		lines.push("");
		lines.push(theme.heading("Ready but hidden from model prompt:"));
		for (const skill of promptHidden) {
			const emoji = normalizeSkillEmoji(skill.emoji);
			const reason = skill.commandVisible ? "skill hides its instructions from the model; commands/cron may still use it" : "skill hides its instructions from the model and is not exposed as a command";
			lines.push(`  ${emoji ? `${emoji} ` : ""}${sanitizeForLog(skill.name)} ${theme.muted(`(${reason})`)}`);
		}
	}
	if (agentFiltered.length > 0) {
		lines.push("");
		lines.push(theme.heading("Excluded by agent allowlist:"));
		for (const skill of agentFiltered) {
			const emoji = normalizeSkillEmoji(skill.emoji);
			lines.push(`  ${emoji ? `${emoji} ` : ""}${sanitizeForLog(skill.name)} ${theme.muted("(loaded, but this agent is not allowed to see/use it)")}`);
		}
	}
	if (missingReqs.length > 0) {
		lines.push("");
		lines.push(theme.heading("Missing requirements:"));
		for (const skill of missingReqs) {
			const emoji = normalizeSkillEmoji(skill.emoji);
			const missing = formatSkillMissingSummary(skill);
			lines.push(`  ${emoji ? `${emoji} ` : ""}${sanitizeForLog(skill.name)} ${theme.muted(`(${missing})`)}`);
		}
	}
	return appendClawHubHint(lines.join("\n"));
}
function formatSkillCuratorStatus(status) {
	const timestamp = (value) => value === null ? "never" : new Date(value).toISOString();
	const lines = [
		`Last attempt: ${timestamp(status.lastAttemptAtMs)}`,
		`Last success: ${timestamp(status.lastSuccessAtMs)}`,
		`Counts: ${status.counts.active} active, ${status.counts.stale} stale, ${status.counts.archived} archived`
	];
	if (!("inventory" in status)) lines.push("Legacy inventory: this Gateway reports limited coverage. Upgrade the Gateway for current Workshop inventory.");
	if (status.lastError) lines.push(`Last error: ${status.lastError}`);
	const relative = (value) => formatTimeAgo(Math.max(0, Date.now() - value));
	for (const review of Object.values(status.collectionReview ?? {})) lines.push(`Collection review: attempted ${relative(review.attemptedAtMs)}; ${review.error ? `failed: ${review.error}` : review.succeededAtMs ? `succeeded ${relative(review.succeededAtMs)}` : "running"}`);
	for (const [workspace, review] of Object.entries(status.experienceReview ?? {})) lines.push(`Experience review ${workspace.slice(0, 8)}: ${review.outcome}${review.error ? `: ${review.error}` : review.proposalId ? ` (${review.proposalId})` : ""}; attempted ${relative(review.attemptedAtMs)}`);
	const keyCounts = /* @__PURE__ */ new Map();
	for (const skill of status.skills) keyCounts.set(skill.skillKey, (keyCounts.get(skill.skillKey) ?? 0) + 1);
	for (const skill of status.skills) {
		const pinned = skill.pinned ? " pinned" : "";
		const lastUsed = skill.lastUsedAtMs === null ? "not recorded" : new Date(skill.lastUsedAtMs).toISOString();
		const label = keyCounts.get(skill.skillKey) === 1 ? skill.skillKey : `${skill.skillKey} (${skill.skillFile})`;
		lines.push(`${label}  ${skill.state}${pinned}  last-used=${lastUsed}  uses=${skill.useCount}`);
	}
	for (const overlap of status.overlaps) lines.push(`Legacy overlap: ${overlap.left} ~ ${overlap.right}`);
	return `${lines.join("\n")}\n`;
}
//#endregion
//#region src/cli/skills-library-input.ts
async function readLibraryInput(input) {
	const root = path.resolve(input);
	const info = await fs$1.lstat(root);
	let total = 0;
	let count = 0;
	const files = [];
	let content;
	const read = async (file, relative) => {
		count += 1;
		if (count > 256) throw new Error("Skill bundle exceeds the 1 MiB/file, 8 MiB/bundle, or 256-file limit.");
		const { buffer: bytes, stat } = await readRegularFile({
			filePath: file,
			maxBytes: Math.min(SKILL_LIBRARY_MAX_FILE_BYTES, SKILL_LIBRARY_MAX_BUNDLE_BYTES - total)
		});
		total += bytes.length;
		if (relative === "SKILL.md") {
			content = new TextDecoder("utf-8", {
				fatal: true,
				ignoreBOM: true
			}).decode(bytes);
			return;
		}
		files.push({
			path: relative,
			content: bytes.toString("base64"),
			encoding: "base64",
			executable: (stat.mode & 73) !== 0
		});
	};
	const walk = async (directory, prefix = "") => {
		for (const entry of (await fs$1.readdir(directory, { withFileTypes: true })).toSorted((a, b) => a.name.localeCompare(b.name))) {
			const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
			if (entry.isDirectory()) await walk(path.join(directory, entry.name), relative);
			else await read(path.join(directory, entry.name), relative);
		}
	};
	if (info.isDirectory()) await walk(root);
	else await read(root, "SKILL.md");
	if (content === void 0) throw new Error("The bundle must contain SKILL.md at its root.");
	return {
		content,
		...info.isDirectory() ? { files } : {}
	};
}
async function uploadLibraryZip(input, slug, opts) {
	const { buffer: bytes } = await readRegularFile({
		filePath: input,
		maxBytes: SKILL_LIBRARY_MAX_BUNDLE_BYTES
	});
	if (bytes.length === 0) throw new Error("ZIP import requires a regular file between 1 byte and 8 MiB.");
	const call = (params) => callGatewayFromCliWithTransport("skills.library.upload", opts, params);
	const begin = await call({
		action: "begin",
		slug,
		sizeBytes: bytes.length,
		sha256: createHash("sha256").update(bytes).digest("hex")
	});
	if (!("uploadId" in begin)) throw new Error("Gateway did not open the upload. Retry the import.");
	let offset = begin.offset;
	while (offset < bytes.length) {
		const end = Math.min(offset + begin.maxChunkBytes, bytes.length);
		const chunk = await call({
			action: "chunk",
			uploadId: begin.uploadId,
			offset,
			data: bytes.subarray(offset, end).toString("base64")
		});
		if (!("offset" in chunk) || chunk.offset !== end) throw new Error("Upload acknowledgement did not match the chunk. Retry the import.");
		offset = chunk.offset;
	}
	const result = await call({
		action: "commit",
		uploadId: begin.uploadId
	});
	if (!("state" in result)) throw new Error("Gateway did not confirm publication. List your library before retrying.");
	return result;
}
//#endregion
//#region src/cli/skills-library-cli.ts
function rpcOptions(command) {
	const opts = command.opts();
	const value = (name) => command.getOptionValueSource(name) !== "default" && opts[name] !== void 0 ? opts[name] : inheritOptionFromParent(command, name) ?? opts[name];
	return {
		url: value("url"),
		port: value("port"),
		token: value("token"),
		password: value("password"),
		timeout: value("timeout"),
		expectFinal: value("expectFinal"),
		json: value("json")
	};
}
function receiptText(receipt) {
	return `${receipt.state}: ${receipt.entry.slug} (${receipt.target}, owner ${receipt.entry.ownerLabel})\nSkill ID: ${receipt.entry.skillId}\nRevision: ${receipt.entry.revision}\n${receipt.nextAction}\n`;
}
function registerSkillsLibraryCli(skills) {
	const library = addGatewayClientOptions(skills.command("library").description("Manage authenticated personal and team skill libraries")).option("--json", "Output as JSON", false).addHelpText("after", "\nCreate: openclaw skills library create ./my-skill --slug my-skill\nRead:   openclaw skills library read <skill-id> --json\nUpdate: openclaw skills library update <skill-id> ./SKILL.md --expected-revision <hash>\nPersonal libraries require a signed-in Gateway profile. Workspace installs remain under skills install.\n");
	const leaf = (name, description) => addGatewayClientOptions(library.command(name).description(description)).option("--json", "Output as JSON", false);
	const execute = (command, action, format) => runCommandWithRuntime(defaultRuntime, async () => {
		const opts = rpcOptions(command);
		const result = await action(opts);
		if (opts.json) defaultRuntime.writeJson(result);
		else defaultRuntime.writeStdout(format(result));
	});
	leaf("list", "List your own and visible shared skills").addOption(new Option("--scope <scope>", "Library scope").choices([
		"mine",
		"team",
		"all"
	]).default("all")).option("--session <key>", "Include this session’s selected revisions and attachable skills").action((opts, command) => execute(command, (rpc) => callGatewayFromCliWithTransport("skills.library.list", rpc, {
		scope: opts.scope,
		...opts.session ? { sessionKey: opts.session } : {}
	}), (result) => [
		`Default target: ${result.defaultTarget}`,
		`New-session default selection limit: ${result.defaultSelectionLimit}`,
		...result.defaultSelectionNotice ? [result.defaultSelectionNotice] : [],
		...result.session ? [
			`Session: ${result.session.sessionKey}`,
			...result.session.selections.map((selection) => `Selected: ${selection.skillId}  ${selection.slug}  owner=${selection.ownerLabel}  ${selection.revision}  ${selection.name}`),
			...result.session.attachable.map((entry) => `Attachable: ${entry.skillId}  ${entry.slug}  owner=${entry.ownerLabel}`)
		] : [],
		...result.entries.map((entry) => `${entry.skillId}  ${entry.slug}  owner=${entry.ownerLabel}  ${entry.enabled ? "enabled" : "disabled"}${entry.shared ? " shared" : ""}  ${entry.revision}`),
		...!result.profileId ? ["Sign in with a durable Gateway profile to create personal skills. Administrators can use skills install for workspace skills."] : [],
		""
	].join("\n")));
	leaf("read", "Read the complete SKILL.md, supporting files, and revision history").argument("<skill-id>", "Stable library skill ID").option("--revision <hash>", "Read a retained revision").option("--session <key>", "Read an exact session pin (requires --revision)").action((skillId, opts, command) => execute(command, (rpc) => {
		if (opts.session && !opts.revision) throw new Error("--session requires --revision to read an exact selected pin.");
		return callGatewayFromCliWithTransport("skills.library.read", rpc, {
			skillId,
			...opts.revision ? { revision: opts.revision } : {},
			...opts.session ? { sessionKey: opts.session } : {}
		});
	}, (result) => [
		`${result.entry.slug} (${result.entry.ownerLabel})`,
		`Skill ID: ${result.entry.skillId}`,
		`Revision: ${result.entry.revision}`,
		`Command: ${result.entry.name}`,
		"--- SKILL.md ---",
		result.content,
		...result.files.flatMap((file) => [`--- ${file.path} (${file.encoding ?? "utf8"}${file.executable ? ", executable" : ""}) ---`, file.content]),
		"Retained revisions:",
		...result.revisions.map((revision) => `${revision.revision}  ${new Date(revision.createdAt).toISOString()}`),
		""
	].join("\n")));
	leaf("create", "Save a private skill from SKILL.md or a complete local directory").argument("<path>", "Local SKILL.md or skill directory").requiredOption("--slug <slug>", "Library name (lowercase letters, digits, hyphens)").action((input, opts, command) => execute(command, async (rpc) => callGatewayFromCliWithTransport("skills.library.save", rpc, {
		slug: opts.slug,
		expectedRevision: null,
		...await readLibraryInput(input)
	}), receiptText));
	leaf("update", "Save a revision; a single SKILL.md preserves supporting files, a directory replaces the bundle").argument("<skill-id>", "Stable library skill ID").argument("<path>", "Local SKILL.md or complete replacement directory").requiredOption("--expected-revision <hash>", "Current revision from library read; conflicts never overwrite").option("--slug <slug>", "Change the library name").option("--delete-file <path>", "Explicitly remove a supporting file (repeatable)", collectOption).action((skillId, input, opts, command) => execute(command, async (rpc) => {
		const current = await callGatewayFromCliWithTransport("skills.library.read", rpc, { skillId });
		const bundle = await readLibraryInput(input);
		const files = bundle.files ?? current.files;
		for (const deleted of opts.deleteFile ?? []) if (!files.some((file) => file.path === deleted)) throw new Error(`Supporting file not found: ${deleted}`);
		return callGatewayFromCliWithTransport("skills.library.save", rpc, {
			skillId,
			expectedRevision: opts.expectedRevision,
			slug: opts.slug ?? current.entry.slug,
			content: bundle.content,
			files: files.filter((file) => !opts.deleteFile?.includes(file.path))
		});
	}, receiptText));
	leaf("import", "Privately import a local bundle, ZIP, or ClawHub skill").argument("<source>", "Local path or ClawHub reference with --clawhub").requiredOption("--slug <slug>", "Destination name in your personal library").option("--clawhub", "Read source from ClawHub; never publishes your files", false).option("--version <version>", "ClawHub version").action((source, opts, command) => execute(command, async (rpc) => {
		if (opts.version && !opts.clawhub) throw new Error("--version requires --clawhub.");
		if (opts.clawhub) return callGatewayFromCliWithTransport("skills.library.import", rpc, {
			slug: opts.slug,
			source: {
				kind: "clawhub",
				slug: source,
				...opts.version ? { version: opts.version } : {}
			}
		});
		if (source.toLowerCase().endsWith(".zip")) return uploadLibraryZip(source, opts.slug, rpc);
		return callGatewayFromCliWithTransport("skills.library.save", rpc, {
			slug: opts.slug,
			expectedRevision: null,
			...await readLibraryInput(source)
		});
	}, receiptText));
	for (const action of [
		"remove",
		"share",
		"unshare",
		"transfer",
		"enable",
		"disable",
		"rollback"
	]) {
		const command = leaf(action, action === "transfer" ? "Transfer ownership to the team (administrator only)" : `${action.charAt(0).toUpperCase()}${action.slice(1)} a managed skill`).argument("<skill-id>", "Stable library skill ID").requiredOption("--expected-revision <hash>", "Current revision from library read");
		if (action === "rollback") command.requiredOption("--revision <hash>", "Retained revision to restore");
		command.action((skillId, opts, cmd) => execute(cmd, (rpc) => callGatewayFromCliWithTransport("skills.library.mutate", rpc, {
			skillId,
			action,
			expectedRevision: opts.expectedRevision,
			...opts.revision ? { revision: opts.revision } : {}
		}), receiptText));
	}
	for (const action of [
		"attach",
		"detach",
		"refresh"
	]) {
		const command = leaf(action, `${action.charAt(0).toUpperCase()}${action.slice(1)} managed selections explicitly for the next session turn`).requiredOption("--session <key>", "Exact target session key");
		if (action === "refresh") command.option("--skill-id <id>", "Refresh only this selected skill; omit to refresh all");
		else command.requiredOption("--skill-id <id>", "Stable library skill ID");
		if (action === "attach") command.option("--revision <hash>", "Retained revision to select");
		command.action((opts, cmd) => execute(cmd, (rpc) => callGatewayFromCliWithTransport("skills.library.activate", rpc, {
			action,
			sessionKey: opts.session,
			...opts.skillId ? { skillId: opts.skillId } : {},
			...opts.revision ? { revision: opts.revision } : {}
		}), (result) => `Queued for next turn: ${result.sessionKey}\n${result.selections.map((selection) => `${selection.skillId}  ${selection.name}  ${selection.revision}`).join("\n")}\n`));
	}
	applyParentDefaultHelpAction(library);
}
//#endregion
//#region src/cli/skills-search-cli.ts
function formatClawHubSearchText(value) {
	return sanitizeForLog(value.replace(/\s+/gu, " ")).trim();
}
/** Register ClawHub skill search and its terminal/JSON output. */
function registerSkillsSearchCli(skills) {
	skills.command("search").description("Search ClawHub skills").argument("[query...]", "Optional search query").option("--limit <n>", "Max results", (value) => parseStrictPositiveIntOption(value, "--limit")).option("--json", "Output as JSON", false).action(async (queryParts, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const results = await searchSkillsFromClawHub({
				query: normalizeOptionalString(queryParts.join(" ")),
				limit: opts.limit
			});
			if (opts.json || skills.opts().json) {
				defaultRuntime.writeJson({ results });
				return;
			}
			if (results.length === 0) {
				defaultRuntime.log("No ClawHub skills found.");
				return;
			}
			for (const entry of results) {
				const installRef = normalizeOptionalString(entry.installRef);
				const skillRef = formatClawHubSearchText(installRef ?? entry.slug);
				const isExternalSource = installRef?.startsWith("skills-sh:") === true && entry.trustState === "not-scanned-by-clawhub";
				const version = entry.version ? ` ${formatVersionLabel(formatClawHubSearchText(entry.version))}` : "";
				const summary = entry.summary ? `  ${formatClawHubSearchText(entry.summary)}` : "";
				const displayName = formatClawHubSearchText(entry.displayName);
				const trust = isExternalSource ? `  ${CLAWHUB_SKILLS_SH_TRUST_LABEL}` : "";
				defaultRuntime.log(`${skillRef}${version}  ${displayName}${summary}${trust}`);
			}
		});
	});
}
//#endregion
//#region src/cli/skills-cli.ts
function formatSkillWarning(message) {
	return message.includes("╭─") ? message : theme.warn(message);
}
function isClawHubSkillBlockedCliFailure(result) {
	return result.code === CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED && typeof result.warning === "string" && result.warning.trim().length > 0;
}
const GATEWAY_SKILLS_STATUS_TIMEOUT_MS = 1500;
const GATEWAY_SKILLS_EVALUATION_TIMEOUT_MS = 65e4;
const GATEWAY_SKILLS_OFFLINE_LOCK_TIMEOUT_MS = 250;
const GATEWAY_SKILLS_APPLY_TIMEOUT_MS = 185e4;
async function callSkillsGateway(params) {
	const { callGateway } = await import("./call-bfuNQIMk.mjs");
	return await callGateway({
		timeoutMs: GATEWAY_SKILLS_STATUS_TIMEOUT_MS,
		clientName: GATEWAY_CLIENT_NAMES.CLI,
		mode: GATEWAY_CLIENT_MODES.CLI,
		...params
	});
}
function normalizeExplicitAgentId(agentId) {
	const normalizedAgentId = agentId?.trim();
	if (agentId !== void 0 && !normalizedAgentId) throw new Error("--agent must not be blank");
	return normalizedAgentId;
}
function resolveSkillsWorkspace(options) {
	const config = getRuntimeConfig(options?.skipPluginValidation ? { skipPluginValidation: true } : void 0);
	const explicitAgentId = normalizeExplicitAgentId(options?.agentId);
	const inferredAgentId = explicitAgentId ? void 0 : resolveAgentIdByWorkspacePath(config, options?.cwd ?? process.cwd());
	const agentId = explicitAgentId ? resolveConfiguredAgentId(config, explicitAgentId) : inferredAgentId ?? resolveDefaultAgentId(config, {
		surface: "the skills command",
		hint: "Pass --agent <id>."
	});
	return {
		config,
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(config, agentId)
	};
}
function resolveAgentOption(command, opts) {
	return resolveOptionFromCommand(command, "agent") ?? opts?.agent;
}
async function loadSkillsStatusReport(options) {
	const resolved = resolveSkillsWorkspace({
		...options,
		skipPluginValidation: true
	});
	try {
		return await callSkillsGateway({
			config: resolved.config,
			method: "skills.status",
			params: { agentId: resolved.agentId }
		});
	} catch (error) {
		if (!await canFallbackToImplicitLocalGateway({
			config: resolved.config,
			error,
			legacyMethod: "skills.status",
			legacyAgentId: true
		})) throw error;
		const { prepareWorkspaceSkillStatus } = await import("./status-CvxAp21T.mjs");
		return prepareWorkspaceSkillStatus(resolved.workspaceDir, {
			config: resolved.config,
			agentId: resolved.agentId
		}).then(({ report }) => report);
	}
}
async function runSkillsAction(render, options) {
	await runCommandWithRuntime(defaultRuntime, async () => {
		const report = await loadSkillsStatusReport(options);
		defaultRuntime.writeStdout(render(report));
	});
}
function resolveSkillsWorkspaceForCommand(command, opts) {
	return resolveSkillsWorkspace({ agentId: resolveAgentOption(command ?? void 0, opts) });
}
function resolveClawHubTargetWorkspace(command, opts, reportError = defaultRuntime.error) {
	const agentId = normalizeExplicitAgentId(resolveAgentOption(command, opts));
	if (opts.global && agentId) {
		reportError("Use either --global or --agent, not both.");
		defaultRuntime.exit(1);
		return;
	}
	if (opts.global) return {
		config: getRuntimeConfig(),
		workspaceDir: CONFIG_DIR
	};
	return resolveSkillsWorkspace({ agentId });
}
function shouldFailSkillVerification(result) {
	const envelope = result;
	return envelope.ok !== true || envelope.decision !== "pass";
}
function buildSkillVerificationOutput(result, target) {
	const verifiedSourceUrl = readVerifiedClawHubSkillSourceUrl(result.provenance);
	return {
		...result,
		openclaw: {
			resolution: {
				source: target.resolution.source,
				selector: target.resolution.selector,
				registry: target.resolution.registry,
				installedVersion: target.resolution.installedVersion,
				...target.requestedReference ? { reference: target.requestedReference } : {}
			},
			...target.trustState ? { trust: {
				state: target.trustState,
				label: CLAWHUB_SKILLS_SH_TRUST_LABEL
			} } : {},
			...verifiedSourceUrl ? { verifiedSourceUrl } : {}
		}
	};
}
function readVerifiedSkillCardUrl(result) {
	if (!result.card || typeof result.card !== "object" || Array.isArray(result.card)) return {
		ok: false,
		error: "ClawHub verification response did not include a Skill Card URL."
	};
	const card = result.card;
	if (card.available === false) return {
		ok: false,
		error: "Skill Card is not available."
	};
	const url = normalizeOptionalString(card.url);
	if (!url) return {
		ok: false,
		error: "ClawHub verification response did not include a Skill Card URL."
	};
	return {
		ok: true,
		url
	};
}
function formatSkillProposalList(manifest) {
	if (manifest.proposals.length === 0) return "No skill proposals.\n";
	return `${manifest.proposals.map((entry) => `${entry.id}  ${entry.status}  ${entry.kind}  ${entry.skillKey}  ${entry.title}`).join("\n")}\n`;
}
function formatSkillProposalInspect(read) {
	const { record } = read;
	const supportFiles = read.supportFiles && read.supportFiles.length > 0 ? [
		"",
		"Support files:",
		...read.supportFiles.flatMap((file) => [
			"",
			`--- ${file.path} ---`,
			file.content
		])
	] : [];
	return [
		`ID: ${record.id}`,
		`Status: ${record.status}`,
		`Kind: ${record.kind}`,
		`Skill: ${record.target.skillName}`,
		`Target: ${record.target.skillFile}`,
		`Scanner: ${record.scan.state}`,
		record.statusReason ? `Reason: ${record.statusReason}` : void 0,
		"",
		read.content,
		...supportFiles
	].filter((line) => line !== void 0).join("\n");
}
function formatSkillProposalEvaluation(result) {
	const lines = [
		`Proposal: ${result.record.id}`,
		`Proposed version: ${result.evaluation.proposedVersion}`,
		`Revision hash: ${result.evaluation.revisionHash}`,
		`Evaluators: ${result.evaluation.outcomes.length}`
	];
	for (const outcome of result.evaluation.outcomes) {
		const plugin = outcome.pluginVersion ? `${outcome.pluginId}@${outcome.pluginVersion}` : outcome.pluginId;
		const prefix = `${outcome.evaluatorId} (${plugin})`;
		if (outcome.status === "completed") {
			const decision = outcome.result.decision ? ` ${outcome.result.decision}` : "";
			const summary = outcome.result.summary ? `: ${outcome.result.summary}` : "";
			lines.push(`${prefix}  completed${decision}${summary}`);
			continue;
		}
		if (outcome.status === "error") {
			lines.push(`${prefix}  error: ${outcome.error}`);
			continue;
		}
		lines.push(`${prefix}  skipped`);
	}
	return `${lines.join("\n")}\n`;
}
async function withOfflineGatewayLock(config, gatewayError, action) {
	const { acquireGatewayLock } = await import("./gateway-lock-Iihe0f2N.mjs");
	const lock = await acquireGatewayLock({
		allowInTests: true,
		port: resolveGatewayPort(config, process.env),
		role: "skill-workshop-apply",
		timeoutMs: GATEWAY_SKILLS_OFFLINE_LOCK_TIMEOUT_MS
	}).catch(() => void 0);
	if (!lock) throw gatewayError;
	try {
		return await action();
	} finally {
		await lock.release();
	}
}
async function callSkillCurator(method, params, loadLocal) {
	const config = getRuntimeConfig();
	try {
		return await callSkillsGateway({
			config,
			method: `skills.curator.${method}`,
			params,
			...method === "status" ? { caps: [GATEWAY_CLIENT_CAPS.SKILL_CURATOR_LIVE_INVENTORY] } : {}
		});
	} catch (error) {
		if (!await canFallbackToImplicitLocalGateway({
			config,
			error,
			...method === "status" ? { legacyMethod: "skills.curator.status" } : {}
		})) throw error;
		return method === "status" ? loadLocal(config) : await withOfflineGatewayLock(config, error, () => loadLocal(config));
	}
}
function throwRetiredSkillCuratorAction() {
	throw new Error(SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE);
}
async function runSkillCuratorMutation(method, skill) {
	await callSkillCurator(method, { skill }, throwRetiredSkillCuratorAction);
	return throwRetiredSkillCuratorAction();
}
async function runSkillProposalApply(resolved, proposalId) {
	let proposal;
	try {
		proposal = await callSkillsGateway({
			config: resolved.config,
			method: "skills.proposals.inspect",
			params: {
				agentId: resolved.agentId,
				proposalId
			},
			requiredMethods: ["skills.proposals.apply"]
		});
	} catch (err) {
		if (!await canFallbackToImplicitLocalGateway({
			config: resolved.config,
			error: err
		})) throw err;
		return await withOfflineGatewayLock(resolved.config, err, async () => {
			const reviewedProposal = await inspectSkillProposal(proposalId, {
				agentId: resolved.agentId,
				config: resolved.config
			});
			if (!reviewedProposal) throw new Error(`Skill proposal not found: ${proposalId}`, { cause: err });
			return await applySkillProposal({
				agentId: resolved.agentId,
				eventActor: {
					type: "system",
					id: "cli"
				},
				workspaceDir: resolved.workspaceDir,
				config: resolved.config,
				proposalId,
				expectedRevisionHash: reviewedProposal.revisionHash
			});
		});
	}
	return await callSkillsGateway({
		config: resolved.config,
		method: "skills.proposals.apply",
		params: {
			agentId: resolved.agentId,
			proposalId,
			expectedRevisionHash: proposal.revisionHash
		},
		timeoutMs: GATEWAY_SKILLS_APPLY_TIMEOUT_MS
	});
}
async function runSkillProposalEvaluate(resolved, proposalId, correlationId) {
	const proposal = await callSkillsGateway({
		config: resolved.config,
		method: "skills.proposals.inspect",
		params: {
			agentId: resolved.agentId,
			proposalId
		}
	});
	return await callSkillsGateway({
		config: resolved.config,
		method: "skills.proposals.evaluate",
		params: {
			agentId: resolved.agentId,
			proposalId,
			expectedRevisionHash: proposal.revisionHash,
			...correlationId ? { correlationId } : {}
		},
		timeoutMs: GATEWAY_SKILLS_EVALUATION_TIMEOUT_MS
	});
}
async function readSkillProposalInput(options) {
	const proposal = normalizeOptionalString(options.proposal);
	const proposalDir = normalizeOptionalString(options.proposalDir);
	if (proposal && proposalDir) throw new Error("Use either --proposal or --proposal-dir, not both.");
	if (!proposal && !proposalDir) throw new Error("Provide --proposal or --proposal-dir.");
	if (proposalDir) return await readSkillProposalDraftDirectory(proposalDir);
	return { content: await readSkillProposalDraftFile(proposal) };
}
/**
* Register the skills CLI commands
*/
function registerSkillsCli(program) {
	const skills = program.command("skills").description("List and inspect available skills").option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").option("--json", "Output as JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/skills", "docs.openclaw.ai/cli/skills")}\n`);
	const hasJsonOutput = (opts) => Boolean(opts?.json || skills.opts().json);
	setCommandJsonMode(skills, "output", ({ argv, command }) => isSkillsMachineOutput(argv, command));
	registerSkillsLibraryCli(skills);
	registerSkillsSearchCli(skills);
	skills.command("install").description("Install a skill from ClawHub, git, or a local directory").argument("<skill-ref>", "ClawHub skill ref (@owner/slug or skills-sh:owner/repo/slug), git:<repo>, or local skill directory").option("--version <version>", "Install a specific version").option("--force", "Overwrite an existing workspace skill", false).option("--force-install", "Install a pending GitHub-backed skill before ClawHub scan completes", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).option("--global", "Install into the shared managed skills directory", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").option("--as <slug>", "Install a git/local skill under this slug").addHelpText("after", "\nExamples:\n  openclaw skills install @owner/weather\n  openclaw skills install skills-sh:owner/repo/weather\n").action(async (slug, opts, command) => {
		try {
			const target = resolveClawHubTargetWorkspace(command, opts);
			if (!target) return;
			const { config, workspaceDir } = target;
			if (slug.trim().startsWith("skills-sh/")) {
				defaultRuntime.error(`Invalid skills.sh skill reference: ${slug}`);
				defaultRuntime.exit(1);
				return;
			}
			if (isSkillSourceInstallSpec(slug)) {
				const clawHubOnlyOption = [opts.version && "--version", opts.forceInstall && "--force-install"].find(Boolean);
				if (clawHubOnlyOption) {
					defaultRuntime.error(`${clawHubOnlyOption} is only supported for ClawHub skill installs.`);
					defaultRuntime.exit(1);
					return;
				}
				const result = await installSkillFromSource({
					workspaceDir,
					spec: slug,
					slug: opts.as,
					force: Boolean(opts.force),
					config,
					...resolveInstallPolicyWarningAcknowledgementCliOptions({ acknowledgeInstallPolicyWarning: opts.acknowledgeInstallPolicyWarning }),
					logger: {
						info: (message) => defaultRuntime.log(message),
						warn: (message) => defaultRuntime.log(formatSkillWarning(message))
					}
				});
				if (!result.ok) {
					defaultRuntime.error(result.error);
					defaultRuntime.exit(1);
					return;
				}
				defaultRuntime.log(`Installed ${result.slug} from ${result.source} -> ${result.targetDir}`);
				return;
			}
			if (opts.as) {
				defaultRuntime.error("--as is only supported for git and local directory skill installs.");
				defaultRuntime.exit(1);
				return;
			}
			if (slug.trim().startsWith("skills-sh:") && opts.version) {
				defaultRuntime.error("--version is not supported for skills-sh references.");
				defaultRuntime.exit(1);
				return;
			}
			const result = await installSkillFromClawHub({
				workspaceDir,
				slug,
				version: opts.version,
				force: Boolean(opts.force),
				config,
				...resolveInstallPolicyWarningAcknowledgementCliOptions({ acknowledgeInstallPolicyWarning: opts.acknowledgeInstallPolicyWarning }),
				...opts.forceInstall ? { forceInstall: true } : {},
				confirmInstall: resolveClawHubInstallConfirmation(),
				logger: {
					info: (message) => defaultRuntime.log(message),
					warn: (message) => defaultRuntime.log(formatSkillWarning(message))
				}
			});
			if (!result.ok) {
				if (!isClawHubSkillBlockedCliFailure(result)) defaultRuntime.error(result.error);
				defaultRuntime.exit(1);
				return;
			}
			defaultRuntime.log(`Installed ${result.slug}@${result.version} -> ${result.targetDir}`);
		} catch (err) {
			defaultRuntime.error(formatErrorMessage(err));
			defaultRuntime.exit(1);
		}
	});
	skills.command("update").description("Update ClawHub-installed skills in the active or shared managed directory").argument("[skill-ref]", "Single ClawHub skill ref (@owner/slug)").option("--all", "Update all tracked ClawHub skills", false).option("--force", "Replace installed skills even when they have local changes", false).option("--force-install", "Install a pending GitHub-backed skill before ClawHub scan completes", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).option("--global", "Update skills in the shared managed skills directory", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").action(async (slug, opts, command) => {
		try {
			if (!slug && !opts.all) {
				defaultRuntime.error("Provide a skill slug or use --all.");
				defaultRuntime.exit(1);
				return;
			}
			if (slug && opts.all) {
				defaultRuntime.error("Use either a skill slug or --all.");
				defaultRuntime.exit(1);
				return;
			}
			const target = resolveClawHubTargetWorkspace(command, opts);
			if (!target) return;
			const tracked = await readTrackedClawHubSkillSlugs(target.workspaceDir);
			if (opts.all && tracked.length === 0) {
				defaultRuntime.log("No tracked ClawHub skills to update.");
				return;
			}
			const results = await updateSkillsFromClawHub({
				workspaceDir: target.workspaceDir,
				slug,
				...opts.force ? { force: true } : {},
				...opts.forceInstall ? { forceInstall: true } : {},
				...resolveInstallPolicyWarningAcknowledgementCliOptions({ acknowledgeInstallPolicyWarning: opts.acknowledgeInstallPolicyWarning }),
				logger: {
					info: (message) => defaultRuntime.log(message),
					warn: (message) => defaultRuntime.log(formatSkillWarning(message))
				},
				config: target.config
			});
			let failed = false;
			for (const result of results) {
				if (!result.ok) {
					failed = true;
					if (result.code === "force_required") defaultRuntime.error(`${result.error} Re-run with --force to update it anyway.`);
					else if (!isClawHubSkillBlockedCliFailure(result)) defaultRuntime.error(result.error);
					continue;
				}
				if (result.changed) {
					defaultRuntime.log(`Updated ${result.slug}: ${result.previousVersion ?? "unknown"} -> ${result.version}`);
					continue;
				}
				defaultRuntime.log(`${result.slug} already at ${result.version}`);
			}
			if (failed) defaultRuntime.exit(1);
		} catch (err) {
			defaultRuntime.error(formatErrorMessage(err));
			defaultRuntime.exit(1);
		}
	});
	skills.command("verify").description("Verify a ClawHub skill with ClawHub").argument("<skill-ref>", "ClawHub skill ref (@owner/slug)").option("--version <version>", "Verify a specific version").option("--tag <tag>", "Verify a dist tag").option("--card", "Print the generated Skill Card Markdown", false).option("--json", "Output as JSON", false).option("--global", "Resolve installed skill metadata from the shared managed skills directory", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").addHelpText("after", "\nExamples:\n  openclaw skills verify @owner/weather\n").action(async (slug, opts, command) => {
		let exitCode;
		const reportError = hasJsonOutput(opts) || opts.card !== true ? (message) => defaultRuntime.writeJson(formatCliJsonFailure(message)) : defaultRuntime.error;
		try {
			const workspace = resolveClawHubTargetWorkspace(command, opts, reportError);
			if (!workspace) return;
			const target = await resolveClawHubSkillVerificationTarget({
				workspaceDir: workspace.workspaceDir,
				slug,
				version: opts.version,
				tag: opts.tag
			});
			if (!target.ok) {
				reportError(target.error);
				exitCode = 1;
			} else {
				const result = await verifySkillWithClawHub({
					slug: target.slug,
					...target.ownerHandle ? { ownerHandle: target.ownerHandle } : {},
					...target.requestedReference ? { requestedReference: target.requestedReference } : {},
					version: target.version,
					tag: target.tag,
					baseUrl: target.baseUrl
				});
				if (!result.ok) {
					reportError(result.error);
					exitCode = 1;
				} else if (opts.card && !hasJsonOutput(opts)) {
					const verification = result.value;
					const cardUrl = readVerifiedSkillCardUrl(verification);
					if (!cardUrl.ok) {
						reportError(cardUrl.error);
						exitCode = 1;
					} else {
						const card = await fetchClawHubSkillCard({
							url: cardUrl.url,
							baseUrl: target.baseUrl
						});
						defaultRuntime.writeStdout(card.endsWith("\n") ? card : `${card}\n`);
						exitCode = shouldFailSkillVerification(verification) ? 1 : void 0;
					}
				} else {
					const verification = result.value;
					defaultRuntime.writeJson(buildSkillVerificationOutput(verification, target));
					exitCode = shouldFailSkillVerification(verification) ? 1 : void 0;
				}
			}
		} catch (err) {
			reportError(formatErrorMessage(err));
			exitCode = 1;
		}
		if (exitCode) exitCliAfterOutput(defaultRuntime, exitCode);
	});
	const curator = skills.command("curator").description("Inspect skill usage and collection review outcomes").option("--json", "Output as JSON", false);
	const showCuratorStatus = async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const status = await callSkillCurator("status", {}, (config) => getSkillCuratorStatus({ config }));
			if (hasJsonOutput(opts) || inheritOptionFromParent(command, "json")) {
				defaultRuntime.writeJson(status);
				return;
			}
			defaultRuntime.writeStdout(formatSkillCuratorStatus(status));
		});
	};
	curator.command("status").description("Show skill usage and collection review status").action(showCuratorStatus);
	for (const action of [
		"pin",
		"unpin",
		"restore"
	]) curator.command(action).description(`${action} is retired; collection review manages skills`).argument("<skill>", "Skill name or key").action(async (skill) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await runSkillCuratorMutation(action, skill);
		});
	});
	for (const command of curator.commands) command.option("--json", "Output as JSON", false);
	curator.action(() => showCuratorStatus(curator.opts(), curator));
	const workshop = skills.command("workshop").description("Manage pending skill proposals").option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)");
	const runWorkshopAction = async (opts, command, action, format) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await action(resolveSkillsWorkspaceForCommand(command, opts));
			if (hasJsonOutput(opts)) {
				defaultRuntime.writeJson(result);
				return;
			}
			defaultRuntime.writeStdout(format(result));
		});
	};
	const runWorkshopDraftAction = (opts, command, action, format = (proposal) => `${proposal.record.id}\n`) => runWorkshopAction(opts, command, async ({ config, workspaceDir, agentId }) => {
		const draft = await readSkillProposalInput(opts);
		return await action({
			workspaceDir,
			agentId,
			eventActor: {
				type: "system",
				id: "cli"
			},
			config,
			content: draft.content,
			supportFiles: draft.supportFiles,
			description: opts.description,
			goal: opts.goal,
			evidence: opts.evidence
		});
	}, format);
	workshop.command("list").description("List pending and completed skill proposals").option("--json", "Output as JSON", false).action((opts, command) => runWorkshopAction(opts, command, ({ config, agentId }) => listSkillProposals({
		config,
		agentId
	}), formatSkillProposalList));
	workshop.command("inspect").description("Inspect a skill proposal").argument("<proposal-id>", "Skill proposal id").option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopAction(opts, command, async ({ agentId, config }) => {
		const proposal = await inspectSkillProposal(proposalId, {
			agentId,
			config
		});
		if (!proposal) throw new Error(`Skill proposal not found: ${proposalId}`);
		return proposal;
	}, formatSkillProposalInspect));
	workshop.command("propose-create").description("Create a pending proposal for a new Workshop-generated skill").requiredOption("--name <name>", "Skill name").requiredOption("--description <description>", "Skill description").option("--proposal <path>", "Path to PROPOSAL.md draft content").option("--proposal-dir <path>", "Path to proposal directory with PROPOSAL.md and UTF-8 text support files").option("--goal <text>", "Proposal or improvement goal").option("--evidence <text>", "Evidence or notes for the proposal").option("--json", "Output as JSON", false).action((opts, command) => runWorkshopDraftAction(opts, command, (input) => proposeCreateSkill({
		...input,
		name: opts.name,
		description: opts.description,
		createdBy: "cli"
	})));
	workshop.command("propose-update").description("Create a pending proposal for an existing Workshop-generated skill").argument("<skill>", "Skill name or key").option("--proposal <path>", "Path to PROPOSAL.md draft content").option("--proposal-dir <path>", "Path to proposal directory with PROPOSAL.md and UTF-8 text support files").option("--description <text>", "Concise proposal description").option("--goal <text>", "Proposal or improvement goal").option("--evidence <text>", "Evidence or notes for the proposal").option("--json", "Output as JSON", false).action((skill, opts, command) => runWorkshopDraftAction(opts, command, (input) => proposeUpdateSkill({
		...input,
		skillName: skill,
		createdBy: "cli"
	})));
	workshop.command("revise").description("Revise a pending skill proposal").argument("<proposal-id>", "Skill proposal id").option("--proposal <path>", "Path to revised PROPOSAL.md draft content").option("--proposal-dir <path>", "Path to revised proposal directory with PROPOSAL.md and UTF-8 text support files").option("--description <description>", "Replacement proposal description").option("--goal <text>", "Replacement research or improvement goal").option("--evidence <text>", "Replacement evidence or notes for the proposal").option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopDraftAction(opts, command, (input) => reviseSkillProposal({
		...input,
		proposalId
	}), (proposal) => `Revised ${proposal.record.id} ${proposal.record.proposedVersion}\n`));
	workshop.command("evaluate").description("Evaluate the exact current skill proposal through Gateway plugins").argument("<proposal-id>", "Skill proposal id").option("--correlation-id <id>", "External run or experiment correlation id").option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopAction(opts, command, (resolved) => runSkillProposalEvaluate(resolved, proposalId, normalizeOptionalString(opts.correlationId)), formatSkillProposalEvaluation));
	workshop.command("apply").description("Apply a pending skill proposal").argument("<proposal-id>", "Skill proposal id").option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopAction(opts, command, (resolved) => runSkillProposalApply(resolved, proposalId), (applied) => `Applied ${applied.record.id} -> ${applied.targetSkillFile}\n`));
	for (const [name, description, reasonDescription, verb, action] of [[
		"reject",
		"Reject a pending skill proposal",
		"Reason for rejection",
		"Rejected",
		rejectSkillProposal
	], [
		"quarantine",
		"Quarantine a skill proposal",
		"Reason for quarantine",
		"Quarantined",
		quarantineSkillProposal
	]]) workshop.command(name).description(description).argument("<proposal-id>", "Skill proposal id").option("--reason <text>", reasonDescription).option("--json", "Output as JSON", false).action((proposalId, opts, command) => runWorkshopAction(opts, command, async ({ agentId, config, workspaceDir }) => {
		const reviewed = name === "reject" ? await inspectSkillProposal(proposalId, {
			agentId,
			config
		}) : void 0;
		if (name === "reject" && !reviewed) throw new Error(`Skill proposal not found: ${proposalId}`);
		return action({
			agentId,
			eventActor: {
				type: "system",
				id: "cli"
			},
			workspaceDir,
			config,
			proposalId,
			...reviewed ? { expectedRevisionHash: reviewed.revisionHash } : {},
			reason: opts.reason
		});
	}, (record) => `${verb} ${record.id}\n`));
	for (const command of workshop.commands) command.option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)");
	applyParentDefaultHelpAction(workshop);
	skills.command("list").description("List all available skills").option("--json", "Output as JSON", false).option("--eligible", "Show only eligible (ready to use) skills", false).option("-v, --verbose", "Show more details including missing requirements", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").action(async (opts, command) => {
		await runSkillsAction((report) => formatSkillsList(report, {
			...opts,
			json: hasJsonOutput(opts)
		}), { agentId: resolveAgentOption(command, opts) });
	});
	skills.command("info").description("Show detailed information about a skill").argument("<name>", "Skill name").option("--json", "Output as JSON", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").action(async (name, opts, command) => {
		let skillFound = false;
		await runSkillsAction((report) => {
			skillFound = resolveSkillStatusEntry(report.skills, name) !== null;
			return formatSkillInfo(report, name, {
				...opts,
				json: hasJsonOutput(opts)
			});
		}, { agentId: resolveAgentOption(command, opts) });
		if (!skillFound) defaultRuntime.exit(1);
	});
	skills.command("check").description("Check which skills are ready, visible, or missing requirements").option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").option("--json", "Output as JSON", false).action(async (opts, command) => {
		await runSkillsAction((report) => formatSkillsCheck(report, {
			...opts,
			json: hasJsonOutput(opts)
		}), { agentId: resolveAgentOption(command, opts) });
	});
	skills.action(async (opts, command) => {
		await runSkillsAction((report) => formatSkillsList(report, { json: hasJsonOutput(opts) }), { agentId: resolveAgentOption(command, opts) });
	});
}
//#endregion
export { registerSkillsCli };
