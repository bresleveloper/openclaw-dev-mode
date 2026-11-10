import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as isSkillsMachineOutput } from "./argv-C7hqFLn5.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { p as shortenHomePath, t as CONFIG_DIR } from "./utils-gjJ-tD2q.mjs";
import { b as resolveGatewayPort } from "./paths-orClZ-2Z.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as stripAnsi, n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { c as sanitizeHostExecEnv } from "./host-env-security-D0hvR517.mjs";
import { n as sanitizeTerminalText$1 } from "./safe-text-BjmWJADa.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir, h as resolveConfiguredAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { l as resolveAgentIdByWorkspacePath } from "./agent-scope-DXrnO3F4.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import { r as SKILL_LIBRARY_MAX_FILE_BYTES, t as SKILL_LIBRARY_MAX_BUNDLE_BYTES } from "./skill-library-Bgib5R_8.mjs";
import "./config-B3oiWDlr.mjs";
import { l as withInstallWorkspace } from "./install-source-utils-DCME3COX.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { t as parseSkillFrontmatter } from "./frontmatter-siV6LZij.mjs";
import { t as loadSingleSkillDirectory } from "./local-loader-DuDhVnOL.mjs";
import { a as resolveSkillDiscoveryLimits } from "./skill-root-discovery-FGRFW_77.mjs";
import { r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { i as canFallbackToImplicitLocalGateway, r as callGatewayFromCliWithTransport, t as addGatewayClientOptions } from "./gateway-rpc-Wcwajg7Y.mjs";
import { i as fetchClawHubSkillCard, n as CLAWHUB_SKILLS_SH_TRUST_LABEL } from "./clawhub-skills-D--udhAy.mjs";
import { r as validateRequestedSkillSlug } from "./install-paths-CdlkBGI2.mjs";
import { g as readTrackedClawHubSkillSlugs } from "./clawhub-store-DrAcibyA.mjs";
import { c as searchSkillsFromClawHub, i as resolveClawHubSkillVerificationTarget } from "./clawhub-status-DjGpJ2Qf.mjs";
import { t as CLAWHUB_TRUST_ERROR_CODE } from "./clawhub-install-trust-BOwMNTuQ.mjs";
import { i as acquireGitSource, n as isImmutableGitCommitRef, r as parseGitPluginSpec } from "./git-install-I8ZcITNI.mjs";
import { n as formatTimeAgo } from "./format-relative-DP9tOdyD.mjs";
import { c as restoreWorkshopSkill, d as listWorkshopChanges, l as viewWorkshopSkill, n as archiveWorkshopSkill } from "./library-lvOOduU2.mjs";
import { n as decorativePrefix, t as decorativeEmoji } from "./decorative-emoji-HzqsNcgP.mjs";
import { n as runCommandWithRuntime, t as resolveOptionFromCommand } from "./cli-utils-C0bJ9VIR.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { n as parseStrictPositiveIntOption, t as collectOption } from "./helpers-CZZt1vds.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
import { t as resolveClawHubInstallConfirmation } from "./clawhub-install-confirmation-DtwZ_7ZV.mjs";
import { r as installExtractedSkillRoot } from "./archive-install-C2hZs-1d.mjs";
import { a as readVerifiedClawHubSkillSourceUrl, i as verifySkillWithClawHub, r as updateSkillsFromClawHub, t as installSkillFromClawHub } from "./clawhub-DjTGy1R4.mjs";
import { n as setCommandJsonMode } from "./json-mode-BIqJ-P-D.mjs";
import { n as formatCliStatusTable, t as formatCliRequirements } from "./skills-hooks-cli.format-BY3DrbL-.mjs";
import { t as formatVersionLabel } from "./version-format-B-C6AzAF.mjs";
import { t as resolveInstallPolicyWarningAcknowledgementCliOptions } from "./install-policy-warning-acknowledgement-Dx2zPtGO.mjs";
import { a as resolveSkillStatusEntry, r as hasMissingSkillRequirements } from "./status-DQx5F0If.mjs";
import { t as recordSkillSourceInstall } from "./source-install-metadata-CxVpj-ry.mjs";
import { t as buildSkillsWorkshopListResult } from "./workshop-list-DYBpEzvD.mjs";
import { createHash } from "node:crypto";
import * as fs$1 from "node:fs/promises";
import fs from "node:fs/promises";
import path from "node:path";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
import { Option } from "commander";
//#region src/skills/lifecycle/source-install.ts
const log = createSubsystemLogger("skills");
async function resolveSkillInstallSlug(params) {
	const explicit = normalizeOptionalString(params.slug);
	if (explicit) return validateRequestedSkillSlug(explicit);
	try {
		const raw = await fs.readFile(path.join(params.sourceDir, "SKILL.md"), "utf8");
		const frontmatterName = normalizeOptionalString(parseSkillFrontmatter(raw).name);
		if (frontmatterName) return validateRequestedSkillSlug(frontmatterName);
	} catch {}
	return validateRequestedSkillSlug(params.fallbackLabel);
}
async function rejectUndiscoverableSkillSource(params) {
	let rootRealPath;
	try {
		rootRealPath = await fs.realpath(params.sourceDir);
	} catch {
		return {
			ok: false,
			error: `Skill path not found: ${params.sourceDir}`
		};
	}
	const diagnostics = [];
	if (loadSingleSkillDirectory({
		skillDir: rootRealPath,
		rootRealPath,
		source: "source-install",
		maxBytes: resolveSkillDiscoveryLimits(params.config).maxSkillFileBytes,
		rejectHardlinks: false,
		onDiagnostic: (diagnostic) => {
			diagnostics.push(diagnostic);
		}
	})) return { ok: true };
	return {
		ok: false,
		error: `Skill source is not loadable: ${diagnostics[0]?.message ?? "SKILL.md is missing"}`
	};
}
async function installLocalSkillDir(params) {
	const slug = await resolveSkillInstallSlug({
		sourceDir: params.sourceDir,
		fallbackLabel: params.fallbackLabel,
		slug: params.slug
	});
	const discoverable = await rejectUndiscoverableSkillSource({
		sourceDir: params.sourceDir,
		config: params.config
	});
	if (!discoverable.ok) return discoverable;
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
	try {
		const { refreshSkillsDiscovery } = await import("./refresh-C3a1Ipyv.mjs");
		await refreshSkillsDiscovery({
			workspaceDir: params.workspaceDir,
			config: params.config
		});
	} catch (error) {
		log.warn(`Skill source saved, but discovery refresh failed: ${formatErrorMessage(error)}`);
	}
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
				env: sanitizeHostExecEnv({
					baseEnv: {
						...process.env,
						GIT_CONFIG_NOSYSTEM: "1",
						GIT_TERMINAL_PROMPT: "0"
					},
					blockPathOverrides: false
				})
			})
		});
		if (!acquired.ok) return acquired;
		const git = {
			url: redactSensitiveUrlLikeString(parsed.url),
			...parsed.ref ? { ref: parsed.ref } : {},
			commit: acquired.commit,
			resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			await fs.cp(repoDir, exportDir, {
				recursive: true,
				filter: (source) => !path.relative(repoDir, source).split(path.sep).includes(".git")
			});
		} catch (err) {
			return {
				ok: false,
				error: `failed to prepare git skill source: ${String(err)}`
			};
		}
		return await installLocalSkillDir({
			...params,
			sourceDir: exportDir,
			sourceSpec: redactSensitiveUrlLikeString(parsed.normalizedSpec),
			source: "git",
			fallbackLabel: path.basename(parsed.label),
			git
		});
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
	const sourceDir = resolveUserPath(spec);
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
		...params,
		sourceDir,
		sourceSpec: spec,
		source: "path",
		fallbackLabel: path.basename(path.resolve(sourceDir)).trim()
	});
}
//#endregion
//#region src/cli/skills-cli-verification-output.ts
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
function formatSkillCheckSection(title, skills, reason) {
	return skills.length === 0 ? [] : [
		"",
		theme.heading(title),
		...skills.map((skill) => {
			const emoji = normalizeSkillEmoji(skill.emoji);
			const suffix = reason ? ` ${theme.muted(`(${reason(skill)})`)}` : "";
			return `  ${emoji ? `${emoji} ` : ""}${sanitizeForLog(skill.name)}${suffix}`;
		})
	];
}
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
	return appendClawHubHint(formatCliStatusTable({
		title: "Skills",
		ready: skills.filter(isReadyForAgent).length,
		nameColumn: {
			key: "Skill",
			header: "Skill",
			minWidth: 22
		},
		sourceColumn: {
			key: "Source",
			header: "Source",
			minWidth: 10
		},
		verbose: opts.verbose,
		rows: skills.map((skill) => ({
			Status: formatSkillStatus(skill),
			Skill: formatSkillName(skill),
			Description: theme.muted(skill.description),
			Source: skill.source,
			Missing: opts.verbose ? theme.warn(formatSkillMissingSummary(skill)) : ""
		}))
	}));
}
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
	const emoji = normalizeSkillEmoji(skill.emoji);
	const safeName = sanitizeForLog(skill.name);
	const safeHomepage = skill.homepage ? sanitizeForLog(skill.homepage) : void 0;
	const safeSkillKey = sanitizeForLog(skill.skillKey);
	const lines = [
		`${emoji ? `${emoji} ` : ""}${theme.heading(safeName)} ${formatSkillStatus(skill, true)}`,
		"",
		sanitizeForLog(skill.description),
		"",
		theme.heading("Details:"),
		`${theme.muted("  Source:")} ${sanitizeForLog(skill.source)}`,
		`${theme.muted("  Path:")} ${shortenHomePath(skill.filePath)}`
	];
	if (safeHomepage) lines.push(`${theme.muted("  Homepage:")} ${safeHomepage}`);
	lines.push(`${theme.muted("  Visible to model:")} ${skill.modelVisible ? theme.success("yes") : theme.warn("no")}`);
	lines.push(`${theme.muted("  Available as command:")} ${skill.commandVisible ? theme.success("yes") : theme.warn("no")}`);
	if (skill.blockedByAgentFilter) lines.push(`${theme.muted("  Agent allowlist:")} excludes this skill`);
	if (skill.primaryEnv) lines.push(`${theme.muted("  Primary env:")} ${skill.primaryEnv}`);
	lines.push(...formatCliRequirements(skill, SKILL_REQUIREMENT_GROUPS));
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
	lines.push(...formatSkillCheckSection("Ready and visible to model:", modelVisible), ...formatSkillCheckSection("Ready but hidden from model prompt:", promptHidden, (skill) => skill.commandVisible ? "skill hides its instructions from the model; commands/cron may still use it" : "skill hides its instructions from the model and is not exposed as a command"), ...formatSkillCheckSection("Excluded by agent allowlist:", agentFiltered, () => "loaded, but this agent is not allowed to see/use it"), ...formatSkillCheckSection("Missing requirements:", missingReqs, formatSkillMissingSummary));
	return appendClawHubHint(lines.join("\n"));
}
function formatSkillsWorkshopList(result) {
	const lines = [
		`${theme.muted("Agent:")} ${sanitizeForLog(result.agentId)}  ${theme.muted("Mode:")} ${result.mode}`,
		`${theme.muted("Root:")} ${shortenHomePath(result.root)}`,
		""
	];
	if (result.skills.length === 0) lines.push("No learned skills.");
	for (const skill of result.skills) {
		const uses = skill.useCount === void 0 ? "" : `  uses=${skill.useCount}`;
		lines.push(`${theme.command(sanitizeForLog(skill.name))}  updated ${formatTimeAgo(Math.max(0, Date.now() - skill.updatedAtMs))}${uses}  ${sanitizeForLog(skill.description)}`);
	}
	const archived = result.archived.filter((entry) => !entry.live);
	if (archived.length > 0) {
		lines.push("", theme.heading("Archived:"));
		for (const entry of archived) lines.push(`${sanitizeForLog(entry.name)}  versions=${entry.versions.length}`);
	}
	return `${lines.join("\n")}\n`;
}
function formatSkillsWorkshopChanges(result) {
	if (result.changes.length === 0) return "No Workshop changes.\n";
	return `${result.changes.map((change) => {
		const version = change.versionId ? `  version=${change.versionId}` : "";
		return `${formatTimeAgo(Math.max(0, Date.now() - change.createdAtMs))}  ${change.actor}  ${change.action}  ${sanitizeForLog(change.skillName)}  ${sanitizeForLog(change.summary)}${version}`;
	}).join("\n")}\n`;
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
function sanitizeTerminalText(value) {
	return sanitizeTerminalText$1(value).replace(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/gu, "");
}
function rpcOptions(command) {
	const opts = command.opts();
	const value = (name) => inheritOptionFromParent(command, name) ?? opts[name];
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
	return `${sanitizeTerminalText(receipt.state)}: ${sanitizeTerminalText(receipt.entry.slug)} (${sanitizeTerminalText(receipt.target)}, owner ${sanitizeTerminalText(receipt.entry.ownerLabel)})\nSkill ID: ${sanitizeTerminalText(receipt.entry.skillId)}\nRevision: ${sanitizeTerminalText(receipt.entry.revision)}\n${sanitizeTerminalText(receipt.nextAction)}\n`;
}
async function saveLocalLibrarySkill(input, slug, rpc) {
	return callGatewayFromCliWithTransport("skills.library.save", rpc, {
		slug,
		expectedRevision: null,
		...await readLibraryInput(input)
	});
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
	].map(sanitizeTerminalText).join("\n")));
	leaf("read", "Read the complete SKILL.md, supporting files, and revision history").argument("<skill-id>", "Stable library skill ID").option("--revision <hash>", "Read a retained revision").option("--session <key>", "Read an exact session pin (requires --revision)").action((skillId, opts, command) => execute(command, (rpc) => {
		if (opts.session && !opts.revision) throw new Error("--session requires --revision to read an exact selected pin.");
		return callGatewayFromCliWithTransport("skills.library.read", rpc, {
			skillId,
			...opts.revision ? { revision: opts.revision } : {},
			...opts.session ? { sessionKey: opts.session } : {}
		});
	}, (result) => [
		`${sanitizeTerminalText(result.entry.slug)} (${sanitizeTerminalText(result.entry.ownerLabel)})`,
		`Skill ID: ${sanitizeTerminalText(result.entry.skillId)}`,
		`Revision: ${sanitizeTerminalText(result.entry.revision)}`,
		`Command: ${sanitizeTerminalText(result.entry.name)}`,
		"--- SKILL.md ---",
		result.content,
		...result.files.flatMap((file) => [`--- ${sanitizeTerminalText(file.path)} (${sanitizeTerminalText(file.encoding ?? "utf8")}${file.executable ? ", executable" : ""}) ---`, file.content]),
		"Retained revisions:",
		...result.revisions.map((revision) => `${sanitizeTerminalText(revision.revision)}  ${new Date(revision.createdAt).toISOString()}`),
		""
	].join("\n")));
	leaf("create", "Save a private skill from SKILL.md or a complete local directory").argument("<path>", "Local SKILL.md or skill directory").requiredOption("--slug <slug>", "Library name (lowercase letters, digits, hyphens)").action((input, opts, command) => execute(command, (rpc) => saveLocalLibrarySkill(input, opts.slug, rpc), receiptText));
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
		return saveLocalLibrarySkill(source, opts.slug, rpc);
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
		}), (result) => `Queued for next turn: ${sanitizeTerminalText(result.sessionKey)}\n${result.selections.map((selection) => `${sanitizeTerminalText(selection.skillId)}  ${sanitizeTerminalText(selection.name)}  ${sanitizeTerminalText(selection.revision)}`).join("\n")}\n`));
	}
	applyParentDefaultHelpAction(library);
}
//#endregion
//#region src/cli/skills-search-cli.ts
function formatClawHubSearchText(value) {
	return sanitizeForLog(value.replace(/\s+/gu, " ")).trim();
}
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
const skillInstallLogger = {
	info: (message) => defaultRuntime.log(message),
	warn: (message) => defaultRuntime.log(message.includes("╭─") ? message : theme.warn(message))
};
function isClawHubSkillBlockedCliFailure(result) {
	return result.code === CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED && typeof result.warning === "string" && result.warning.trim().length > 0;
}
const GATEWAY_SKILLS_STATUS_TIMEOUT_MS = 1500;
const GATEWAY_SKILLS_REFRESH_TIMEOUT_MS = 12e4;
const GATEWAY_SKILLS_OFFLINE_LOCK_TIMEOUT_MS = 250;
const GATEWAY_SKILLS_WORKSHOP_MUTATION_TIMEOUT_MS = 3e4;
async function callSkillsGateway(params) {
	const { callGateway } = await import("./call-BvbeEASg.mjs");
	return await callGateway({
		timeoutMs: GATEWAY_SKILLS_STATUS_TIMEOUT_MS,
		clientName: GATEWAY_CLIENT_NAMES.CLI,
		mode: GATEWAY_CLIENT_MODES.CLI,
		...params
	});
}
async function refreshLocalGatewaySkills(target) {
	try {
		const { isImplicitLocalGatewayTarget } = await import("./call-BvbeEASg.mjs");
		if (!await isImplicitLocalGatewayTarget({ config: target.config })) return;
		const agentId = target.agentId ?? listAgentIds(target.config)[0];
		if (!agentId) return;
		await callSkillsGateway({
			config: target.config,
			method: "skills.status",
			params: {
				agentId,
				refresh: true
			},
			timeoutMs: GATEWAY_SKILLS_REFRESH_TIMEOUT_MS
		});
	} catch (error) {
		skillInstallLogger.warn(`Skill files changed, but local Gateway refresh failed: ${formatErrorMessage(error)}. Restart the Gateway to refresh skills.`);
	}
}
function normalizeExplicitAgentId(agentId) {
	const normalizedAgentId = agentId?.trim();
	if (agentId !== void 0 && !normalizedAgentId) throw new Error("--agent must not be blank");
	return normalizedAgentId;
}
async function resolveSkillsWorkspace(options) {
	const config = await captureRuntimeConfigAsyncReader(options?.skipPluginValidation ? { skipPluginValidation: true } : void 0)();
	const explicitAgentId = normalizeExplicitAgentId(options?.agentId);
	const inferredAgentId = explicitAgentId ? void 0 : resolveAgentIdByWorkspacePath(config, process.cwd());
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
async function loadSkillsStatusReport(agentId) {
	const resolved = await resolveSkillsWorkspace({
		agentId,
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
		const { prepareWorkspaceSkillStatus } = await import("./status-welFNywk.mjs");
		return prepareWorkspaceSkillStatus(resolved.workspaceDir, {
			config: resolved.config,
			agentId: resolved.agentId
		}).then(({ report }) => report);
	}
}
async function runSkillsAction(render, agentId) {
	await runCommandWithRuntime(defaultRuntime, async () => {
		const report = await loadSkillsStatusReport(agentId);
		defaultRuntime.writeStdout(render(report));
	});
}
async function resolveClawHubTargetWorkspace(command, opts, reportError = defaultRuntime.error) {
	const agentId = normalizeExplicitAgentId(resolveOptionFromCommand(command, "agent"));
	if (opts.global && agentId) {
		reportError("Use either --global or --agent, not both.");
		defaultRuntime.exit(1);
		return;
	}
	if (opts.global) return {
		config: await captureRuntimeConfigAsyncReader()(),
		workspaceDir: CONFIG_DIR
	};
	return resolveSkillsWorkspace({ agentId });
}
function shouldFailSkillVerification(result) {
	const envelope = result;
	return envelope.ok !== true || envelope.decision !== "pass";
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
async function callSkillsWorkshop(resolved, method, params, loadLocal) {
	const request = {
		config: resolved.config,
		method: `skills.workshop.${method}`,
		params: {
			agentId: resolved.agentId,
			...params
		}
	};
	if (method === "archive" || method === "restore") {
		const { isImplicitLocalGatewayTarget } = await import("./call-BvbeEASg.mjs");
		const { acquireGatewayLock } = await import("./gateway-lock-BLFQD0F1.mjs");
		const lock = await isImplicitLocalGatewayTarget({ config: resolved.config }) ? await acquireGatewayLock({
			allowInTests: true,
			port: resolveGatewayPort(resolved.config, process.env),
			role: "sqlite-maintenance",
			timeoutMs: GATEWAY_SKILLS_OFFLINE_LOCK_TIMEOUT_MS
		}).catch(() => void 0) : void 0;
		if (!lock) return await callSkillsGateway({
			...request,
			timeoutMs: GATEWAY_SKILLS_WORKSHOP_MUTATION_TIMEOUT_MS
		});
		try {
			return await lock.run(loadLocal);
		} finally {
			await lock.release();
		}
	}
	try {
		return await callSkillsGateway(request);
	} catch (error) {
		if (!await canFallbackToImplicitLocalGateway({
			config: resolved.config,
			error
		})) throw error;
		return await loadLocal();
	}
}
function registerSkillsCli(program) {
	const skills = program.command("skills").description("List and inspect available skills").option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").option("--json", "Output as JSON", false).addHelpText("after", () => formatDocsHelp("/cli/skills"));
	const hasJsonOutput = (opts) => Boolean(opts?.json || skills.opts().json);
	const reportAction = (format) => (opts, command) => runSkillsAction((report) => format(report, {
		...opts,
		json: hasJsonOutput(opts)
	}), resolveOptionFromCommand(command, "agent"));
	const runSkillsList = reportAction(formatSkillsList);
	setCommandJsonMode(skills, "output", ({ argv, command }) => isSkillsMachineOutput(argv, command));
	registerSkillsLibraryCli(skills);
	registerSkillsSearchCli(skills);
	skills.command("install").description("Install a skill from ClawHub, git, or a local directory").argument("<skill-ref>", "ClawHub skill ref (@owner/slug or skills-sh:owner/repo/slug), git:<repo>, or local skill directory").option("--version <version>", "Install a specific version").option("--force", "Overwrite an existing workspace skill", false).option("--force-install", "Install a pending GitHub-backed skill before ClawHub scan completes", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).option("--global", "Install into the shared managed skills directory", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").option("--as <slug>", "Install a git/local skill under this slug").addHelpText("after", "\nExamples:\n  openclaw skills install @owner/weather\n  openclaw skills install skills-sh:owner/repo/weather\n").action(async (slug, opts, command) => {
		try {
			const target = await resolveClawHubTargetWorkspace(command, opts);
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
					logger: skillInstallLogger
				});
				if (!result.ok) {
					defaultRuntime.error(result.error);
					defaultRuntime.exit(1);
					return;
				}
				await refreshLocalGatewaySkills(target);
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
				logger: skillInstallLogger
			});
			if (!result.ok) {
				if (!isClawHubSkillBlockedCliFailure(result)) defaultRuntime.error(result.error);
				defaultRuntime.exit(1);
				return;
			}
			await refreshLocalGatewaySkills(target);
			defaultRuntime.log(`Installed ${result.slug}@${result.version} -> ${result.targetDir}`);
		} catch (err) {
			if (err instanceof ExitError) throw err;
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
			const target = await resolveClawHubTargetWorkspace(command, opts);
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
				logger: skillInstallLogger,
				config: target.config
			});
			if (results.some((result) => result.ok && result.changed)) await refreshLocalGatewaySkills(target);
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
			if (err instanceof ExitError) throw err;
			defaultRuntime.error(formatErrorMessage(err));
			defaultRuntime.exit(1);
		}
	});
	skills.command("verify").description("Verify a ClawHub skill with ClawHub").argument("<skill-ref>", "ClawHub skill ref (@owner/slug)").option("--version <version>", "Verify a specific version").option("--tag <tag>", "Verify a dist tag").option("--card", "Print the generated Skill Card Markdown", false).option("--json", "Output as JSON", false).option("--global", "Resolve installed skill metadata from the shared managed skills directory", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").addHelpText("after", "\nExamples:\n  openclaw skills verify @owner/weather\n").action(async (slug, opts, command) => {
		let exitCode;
		const reportError = hasJsonOutput(opts) || opts.card !== true ? (message) => defaultRuntime.writeJson(formatCliJsonFailure(message)) : defaultRuntime.error;
		try {
			const workspace = await resolveClawHubTargetWorkspace(command, opts, reportError);
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
			if (err instanceof ExitError) throw err;
			reportError(formatErrorMessage(err));
			exitCode = 1;
		}
		if (exitCode) exitCliAfterOutput(defaultRuntime, exitCode);
	});
	const workshop = skills.command("workshop").description("Inspect, archive, and restore learned Workshop skills").option("--agent <id>", "Target agent (defaults to cwd-inferred, then default agent)");
	const runWorkshopAction = async (opts, command, action, format) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await action(await resolveSkillsWorkspace({ agentId: resolveOptionFromCommand(command, "agent") }));
			if (hasJsonOutput(opts)) {
				defaultRuntime.writeJson(result);
				return;
			}
			defaultRuntime.writeStdout(format(result));
		});
	};
	workshop.command("list").description("List learned skills and archived skills").option("--json", "Output as JSON", false).action((opts, command) => runWorkshopAction(opts, command, (resolved) => callSkillsWorkshop(resolved, "list", {}, () => buildSkillsWorkshopListResult(resolved)), formatSkillsWorkshopList));
	workshop.command("changes").description("Show recent learned-skill changes").option("--limit <n>", "Max changes", (value) => parseStrictPositiveIntOption(value, "--limit")).option("--json", "Output as JSON", false).action((opts, command) => runWorkshopAction(opts, command, (resolved) => callSkillsWorkshop(resolved, "changes", opts.limit === void 0 ? {} : { limit: opts.limit }, async () => ({ changes: await listWorkshopChanges(resolved.agentId, { limit: opts.limit }) })), formatSkillsWorkshopChanges));
	workshop.command("show").description("Print a learned skill file").argument("<name>", "Skill name").option("--file <path>", "Skill file to print (default SKILL.md)").option("--version <id>", "Print a saved version instead of the live skill").option("--json", "Output as JSON", false).action((name, opts, command) => runWorkshopAction(opts, command, (resolved) => callSkillsWorkshop(resolved, "read", {
		name,
		...opts.file ? { filePath: opts.file } : {},
		...opts.version ? { versionId: opts.version } : {}
	}, () => viewWorkshopSkill(resolved.config, resolved.agentId, name, opts.file, opts.version)), (skill) => skill.content.endsWith("\n") ? skill.content : `${skill.content}\n`));
	workshop.command("archive").description("Archive a learned skill so its agent no longer sees it").argument("<name>", "Skill name").option("--reason <text>", "Why the skill is archived").option("--json", "Output as JSON", false).action((name, opts, command) => runWorkshopAction(opts, command, (resolved) => callSkillsWorkshop(resolved, "archive", {
		name,
		...opts.reason ? { reason: opts.reason } : {}
	}, async () => ({ change: await archiveWorkshopSkill({
		config: resolved.config,
		agentId: resolved.agentId,
		actor: "user"
	}, {
		name,
		reason: opts.reason
	}) })), ({ change }) => `Archived ${change.skillName}. Undo with: ${formatCliCommand(`openclaw skills workshop restore ${change.skillName}`)}\n`));
	workshop.command("restore").description("Restore an archived skill or a saved version").argument("<name>", "Skill name").option("--version <id>", "Version to restore (default newest)").option("--json", "Output as JSON", false).action((name, opts, command) => runWorkshopAction(opts, command, (resolved) => callSkillsWorkshop(resolved, "restore", {
		name,
		...opts.version ? { versionId: opts.version } : {}
	}, async () => ({ change: await restoreWorkshopSkill({
		config: resolved.config,
		agentId: resolved.agentId,
		actor: "user"
	}, {
		name,
		versionId: opts.version
	}) })), ({ change }) => `Restored ${change.skillName}.\n`));
	for (const command of workshop.commands) command.option("--agent <id>", "Target agent (defaults to cwd-inferred, then default agent)");
	applyParentDefaultHelpAction(workshop);
	skills.command("list").description("List all available skills").option("--json", "Output as JSON", false).option("--eligible", "Show only eligible (ready to use) skills", false).option("-v, --verbose", "Show more details including missing requirements", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").action(runSkillsList);
	skills.command("info").description("Show detailed information about a skill").argument("<name>", "Skill name").option("--json", "Output as JSON", false).option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").action(async (name, opts, command) => {
		let skillFound = false;
		await runSkillsAction((report) => {
			skillFound = resolveSkillStatusEntry(report.skills, name) !== null;
			return formatSkillInfo(report, name, {
				...opts,
				json: hasJsonOutput(opts)
			});
		}, resolveOptionFromCommand(command, "agent"));
		if (!skillFound) defaultRuntime.exit(1);
	});
	skills.command("check").description("Check which skills are ready, visible, or missing requirements").option("--agent <id>", "Target agent workspace (defaults to cwd-inferred, then default agent)").option("--json", "Output as JSON", false).action(reportAction(formatSkillsCheck));
	skills.action(runSkillsList);
}
//#endregion
export { registerSkillsCli };
