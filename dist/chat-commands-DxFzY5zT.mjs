import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { k as walkDirectorySync } from "./fs-safe-BUXBSN-4.mjs";
import { m as isPathInsideWithRealpath } from "./includes-BkzfmxST.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as readRootJsonObjectSync } from "./json-files-C5mNTScg.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { t as createDedupeCache } from "./dedupe-qhwfyIea.mjs";
import { i as hasExplicitPluginConfig, p as resolveEffectivePluginActivationState, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { c as normalizeBundlePathList, n as CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH, s as mergeBundlePathLists } from "./bundle-manifest-BiKYAnae.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as resolveEffectiveAgentSkillFilter } from "./agent-filter-KIvrTe_y.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-JwCDUODD.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { f as stripFrontmatterBlock, r as parseFrontmatterBool, u as parseFrontmatterBlock } from "./frontmatter-ByhFzIgC.mjs";
import { a as isWorkspaceAccessUnavailableError, i as getAgentWorkspaceAccess } from "./workspace-access-DjFUgH7e.mjs";
import { n as resolveSkillTelemetrySource } from "./source-DbWOnpPI.mjs";
import { i as resolveSkillFileHost } from "./skill-file-host-CJXc2mOP.mjs";
import { t as canonicalizePath } from "./paths-DqLuHi-X.mjs";
import { i as resolveNodeExecEligibility } from "./exec-defaults-tLsLm83r.mjs";
import { h as sanitizeSkillCommandName } from "./store-BeSK43aH.mjs";
import { n as isSkillUserInvocable, t as isSkillPromptVisible } from "./skill-index-fJ6kPuHX.mjs";
import { i as prepareWorkspaceSkills, s as filterSkillEntries, t as loadVisibleSkills } from "./workspace-skill-loader-CWlRhYtz.mjs";
import { n as prepareRemoteSkillConnections } from "./remote-skills-CVJsA9ab.mjs";
import { r as recordSkillCommandFileHost } from "./skill-command-provenance-D3weQ69x.mjs";
import { t as getRemoteSkillEligibility } from "./remote-Da_JQTVV.mjs";
import { i as listReservedChatSlashCommandNames } from "./chat-command-invocation-BmtIkOnO.mjs";
import fs from "node:fs";
import path from "node:path";
import { readRegularFileSync } from "@openclaw/fs-safe/advanced";
//#region src/plugins/bundle-commands.ts
const BUNDLE_COMMAND_MAX_BYTES = 1048576;
const log = createSubsystemLogger("plugins/bundle-commands");
function readClaudeBundleManifest(rootDir) {
	const result = readRootJsonObjectSync({
		rootDir,
		relativePath: CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH,
		boundaryLabel: "plugin root",
		rejectHardlinks: true
	});
	return result.ok ? result.value : {};
}
function resolveClaudeCommandRootDirs(rootDir) {
	const raw = readClaudeBundleManifest(rootDir);
	const declared = normalizeBundlePathList(raw.commands);
	const defaults = fs.existsSync(path.join(rootDir, "commands")) ? ["commands"] : [];
	return mergeBundlePathLists(defaults, declared);
}
function listMarkdownFilesRecursive(rootDir) {
	return walkDirectorySync(rootDir, {
		symlinks: "skip",
		descend: ({ name }) => !name.startsWith("."),
		include: ({ kind, name }) => kind === "file" && !name.startsWith(".") && Boolean(normalizeOptionalLowercaseString(name)?.endsWith(".md"))
	}).entries.map((entry) => entry.path).toSorted((a, b) => a.localeCompare(b));
}
function toDefaultCommandName(rootDir, filePath) {
	return path.relative(rootDir, filePath).replace(/\.[^.]+$/u, "").split(path.sep).join(":");
}
function toDefaultDescription(promptTemplate) {
	const lineEnd = promptTemplate.indexOf("\n");
	return (lineEnd < 0 ? promptTemplate : promptTemplate.slice(0, lineEnd)).trimEnd();
}
function loadBundleCommandsFromRoot(params) {
	const entries = [];
	for (const filePath of listMarkdownFilesRecursive(params.commandRoot)) {
		let raw;
		try {
			raw = readRegularFileSync({
				filePath,
				maxBytes: BUNDLE_COMMAND_MAX_BYTES
			}).buffer.toString("utf-8");
		} catch (error) {
			log.warn(`skipping unreadable bundle command file ${filePath}: ${formatErrorMessage(error)}`);
			continue;
		}
		const frontmatter = parseFrontmatterBlock(raw);
		if (!parseFrontmatterBool(frontmatter["user-invocable"], true)) continue;
		const promptTemplate = stripFrontmatterBlock(raw);
		if (!promptTemplate) continue;
		const rawName = normalizeOptionalString(frontmatter.name) || toDefaultCommandName(params.commandRoot, filePath);
		if (!rawName) continue;
		const description = normalizeOptionalString(frontmatter.description) || toDefaultDescription(promptTemplate);
		entries.push({
			pluginId: params.pluginId,
			rawName,
			description,
			promptTemplate,
			sourceFilePath: filePath
		});
	}
	return entries;
}
function loadEnabledClaudeBundleCommands(params) {
	if (!hasExplicitPluginConfig(params.cfg?.plugins)) return [];
	const registry = loadPluginManifestRegistryForPluginRegistry({
		workspaceDir: params.workspaceDir,
		config: params.cfg,
		includeDisabled: true
	});
	const normalizedPlugins = normalizePluginsConfig(params.cfg?.plugins);
	const commands = [];
	for (const record of registry.plugins) {
		if (record.format !== "bundle" || record.bundleFormat !== "claude" || !(record.bundleCapabilities ?? []).includes("commands")) continue;
		if (!resolveEffectivePluginActivationState({
			id: record.id,
			origin: record.origin,
			channelIds: record.channels,
			config: normalizedPlugins,
			rootConfig: params.cfg
		}).activated) continue;
		for (const relativeRoot of resolveClaudeCommandRootDirs(record.rootDir)) {
			const commandRoot = path.resolve(record.rootDir, relativeRoot);
			if (!fs.existsSync(commandRoot)) continue;
			if (!isPathInsideWithRealpath(record.rootDir, commandRoot, { requireRealpath: true })) continue;
			commands.push(...loadBundleCommandsFromRoot({
				pluginId: record.id,
				commandRoot
			}));
		}
	}
	return commands;
}
//#endregion
//#region src/skills/discovery/command-specs.ts
const skillsLogger = createSubsystemLogger("skills");
const skillCommandDebugOnce = createDedupeCache({
	ttlMs: 0,
	maxSize: 1024
});
function logSkillCommandOnce(messageKey, message, meta, level = "debug") {
	if (skillCommandDebugOnce.check(messageKey)) return;
	skillsLogger[level](message, meta);
}
function resolveUniqueSkillCommandName(base, used) {
	const normalizedBase = normalizeLowercaseStringOrEmpty(base);
	if (!used.has(normalizedBase)) return base;
	for (let index = 2; index < 1e3; index += 1) {
		const suffix = `_${index}`;
		const maxBaseLength = Math.max(1, 32 - suffix.length);
		const candidate = `${base.slice(0, maxBaseLength)}${suffix}`;
		const candidateKey = normalizeLowercaseStringOrEmpty(candidate);
		if (!used.has(candidateKey)) return candidate;
	}
	return `${base.slice(0, Math.max(1, 30))}_x`;
}
function resolveCommandSkillLoadOptions(opts) {
	return {
		bundledSkillName: opts?.bundledSkillName,
		config: opts?.config,
		managedSkillsDir: opts?.managedSkillsDir,
		bundledSkillsDir: opts?.bundledSkillsDir,
		librarySelections: opts?.librarySelections,
		agentId: opts?.agentId,
		agentSkillFilter: opts?.includeAllowlistHidden ? "ignore" : "apply",
		skillFilter: opts?.includeAllowlistHidden ? void 0 : opts?.skillFilter ?? resolveEffectiveAgentSkillFilter(opts?.config, opts?.agentId),
		eligibility: opts?.eligibility,
		pluginMetadataSnapshot: opts?.pluginMetadataSnapshot
	};
}
/** Builds user-invocable slash command specs for synchronous SDK consumers. */
function buildWorkspaceSkillCommandSpecs(workspaceDir, opts) {
	const loadOptions = {
		...resolveCommandSkillLoadOptions(opts),
		gatewayOnly: opts?.gatewayOnly
	};
	return assembleWorkspaceSkillCommandSpecs(workspaceDir, opts?.entries ? filterSkillEntries(opts.entries, loadOptions) : loadVisibleSkills(workspaceDir, loadOptions), opts);
}
/** Prepares eligibility once before sharing the synchronous command assembly. */
async function prepareWorkspaceSkillCommandSpecs(workspaceDir, opts, assertCurrent) {
	const eligible = await prepareWorkspaceSkills(workspaceDir, resolveCommandSkillLoadOptions(opts), assertCurrent);
	assertCurrent?.();
	return assembleWorkspaceSkillCommandSpecs(workspaceDir, eligible, opts);
}
function assembleWorkspaceSkillCommandSpecs(workspaceDir, eligible, opts) {
	const userInvocable = eligible.filter(isSkillUserInvocable);
	const used = /* @__PURE__ */ new Set();
	for (const reserved of opts?.reservedNames ?? []) {
		used.add(normalizeLowercaseStringOrEmpty(reserved));
		used.add(sanitizeSkillCommandName(reserved));
	}
	const specs = [];
	const claimName = (rawName, bundle = false) => {
		const prefix = bundle ? "bundle-" : "";
		const label = bundle ? "bundle" : "skill";
		const level = bundle ? "debug" : "trace";
		const base = sanitizeSkillCommandName(rawName);
		if (base !== rawName) logSkillCommandOnce(`${prefix}sanitize:${rawName}:${base}`, `Sanitized ${label} command name "${rawName}" to "/${base}".`, {
			rawName,
			sanitized: `/${base}`
		}, level);
		const unique = resolveUniqueSkillCommandName(base, used);
		if (unique !== base) logSkillCommandOnce(`${prefix}dedupe:${rawName}:${unique}`, `De-duplicated ${label} command name for "${rawName}" to "/${unique}".`, {
			rawName,
			deduped: `/${unique}`
		}, level);
		used.add(normalizeLowercaseStringOrEmpty(unique));
		return unique;
	};
	for (const entry of userInvocable) {
		const rawName = entry.skill.name;
		const unique = claimName(rawName);
		const description = entry.skill.description?.trim() || rawName;
		const dispatch = entry.disableCommandDispatch ? void 0 : (() => {
			if (normalizeLowercaseStringOrEmpty(entry.frontmatter?.["command-dispatch"] ?? entry.frontmatter?.["command_dispatch"] ?? "") !== "tool") return;
			const toolName = (entry.frontmatter?.["command-tool"] ?? entry.frontmatter?.["command_tool"] ?? "").trim();
			if (!toolName) {
				logSkillCommandOnce(`dispatch:missingTool:${rawName}`, `Skill command "/${unique}" requested tool dispatch but did not provide command-tool. Ignoring dispatch.`, {
					skillName: rawName,
					command: unique
				});
				return;
			}
			const argModeRaw = normalizeOptionalLowercaseString(entry.frontmatter?.["command-arg-mode"] ?? entry.frontmatter?.["command_arg_mode"] ?? "");
			if (argModeRaw && argModeRaw !== "raw") logSkillCommandOnce(`dispatch:badArgMode:${rawName}:${argModeRaw}`, `Skill command "/${unique}" requested tool dispatch but has unknown command-arg-mode. Falling back to raw.`, {
				skillName: rawName,
				command: unique,
				argMode: argModeRaw
			});
			return {
				kind: "tool",
				toolName,
				argMode: "raw"
			};
		})();
		const spec = {
			name: unique,
			displayName: entry.skill.displayName ?? rawName,
			skillFile: canonicalizePath(entry.skill.filePath),
			skillName: rawName,
			description,
			modelVisible: isSkillPromptVisible(entry),
			skillSource: resolveSkillTelemetrySource(entry.skill),
			...dispatch ? { dispatch } : {}
		};
		const fileHost = resolveSkillFileHost(entry.skill);
		if (fileHost) recordSkillCommandFileHost(spec, fileHost);
		specs.push(spec);
	}
	const bundleCommands = loadEnabledClaudeBundleCommands({
		workspaceDir,
		cfg: opts?.config
	});
	for (const entry of bundleCommands) specs.push({
		name: claimName(entry.rawName, true),
		skillName: entry.rawName,
		description: entry.description,
		modelVisible: false,
		promptTemplate: entry.promptTemplate,
		sourceFilePath: entry.sourceFilePath
	});
	return specs;
}
//#endregion
//#region src/skills/discovery/chat-commands.ts
function resolveWorkspaceSkillCommandOptions(params) {
	const nodeSkills = resolveNodeExecEligibility({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionEntry: params.sessionEntry,
		sessionKey: params.sessionKey,
		execOverrides: params.execOverrides
	});
	const eligibility = {
		nodeSkills,
		remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
	};
	return {
		config: params.cfg,
		agentId: params.agentId,
		skillFilter: params.skillFilter,
		includeAllowlistHidden: params.includeAllowlistHidden,
		eligibility,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot,
		librarySelections: params.sessionEntry?.skillLibrarySelections
	};
}
function hasRemoteWorkspace(workspaceDir) {
	try {
		return Boolean(getAgentWorkspaceAccess(workspaceDir, "loadSkills")?.loadSkills);
	} catch (error) {
		if (isWorkspaceAccessUnavailableError(error)) return true;
		throw error;
	}
}
/** Synchronous public SDK contract; remote workspace menus are deferred. */
function listSkillCommandsForWorkspace(params) {
	return buildWorkspaceSkillCommandSpecs(params.workspaceDir, {
		...resolveWorkspaceSkillCommandOptions(params),
		reservedNames: listReservedChatSlashCommandNames(),
		gatewayOnly: hasRemoteWorkspace(params.workspaceDir)
	});
}
async function prepareSkillCommandsForWorkspace(params, assertCurrent) {
	assertCurrent?.();
	await prepareRemoteSkillConnections();
	assertCurrent?.();
	const commands = await prepareWorkspaceSkillCommandSpecs(params.workspaceDir, {
		...resolveWorkspaceSkillCommandOptions(params),
		reservedNames: listReservedChatSlashCommandNames()
	}, assertCurrent);
	assertCurrent?.();
	return commands;
}
/** Resolve Gateway-bundled commands with the active Harness eligibility checks. */
async function prepareBundledSkillCommandForWorkspace(params) {
	await prepareRemoteSkillConnections();
	return (await prepareWorkspaceSkillCommandSpecs(params.workspaceDir, {
		...resolveWorkspaceSkillCommandOptions(params),
		reservedNames: listReservedChatSlashCommandNames(),
		bundledSkillName: params.skillName
	})).find((command) => command.skillSource === "bundled" && command.skillName.trim().toLowerCase() === params.skillName.trim().toLowerCase());
}
function finalizeSkillCommands(commands) {
	const seen = /* @__PURE__ */ new Set();
	return commands.filter((cmd) => {
		const key = normalizeOptionalLowercaseString(cmd.skillName);
		if (key && seen.has(key)) return false;
		if (key) seen.add(key);
		return true;
	}).toSorted((left, right) => left.skillName.localeCompare(right.skillName, "en"));
}
function* resolveAgentSkillCommandWorkspaces(params, allowRemote = false) {
	const agentIds = params.agentIds ?? listAgentIds(params.cfg);
	const hasSingleAgentContext = agentIds.length === 1;
	const workspaceAgents = [];
	for (const agentId of agentIds) {
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const remote = allowRemote ? Boolean(getAgentWorkspaceAccess(workspaceDir, "loadSkills")?.loadSkills) : hasRemoteWorkspace(workspaceDir);
		if (!remote) {
			if (!fs.existsSync(workspaceDir)) {
				logVerbose(`Skipping agent "${agentId}": workspace does not exist: ${workspaceDir}`);
				continue;
			}
			try {
				fs.realpathSync(workspaceDir);
			} catch {
				logVerbose(`Skipping agent "${agentId}": cannot resolve workspace: ${workspaceDir}`);
				continue;
			}
		}
		workspaceAgents.push({
			agentId,
			workspaceDir,
			gatewayOnly: remote && !allowRemote,
			skillFilter: resolveEffectiveAgentSkillFilter(params.cfg, agentId)
		});
	}
	for (const { agentId, workspaceDir, skillFilter, gatewayOnly } of workspaceAgents) yield {
		workspaceDir,
		options: {
			...resolveWorkspaceSkillCommandOptions({
				cfg: params.cfg,
				agentId,
				workspaceDir,
				skillFilter,
				...hasSingleAgentContext ? {
					sessionEntry: params.sessionEntry,
					sessionKey: params.sessionKey,
					execOverrides: params.execOverrides
				} : {}
			}),
			gatewayOnly
		}
	};
}
function appendSkillCommands(entries, used, commands) {
	for (const command of commands) {
		used.add(normalizeLowercaseStringOrEmpty(command.name));
		entries.push(command);
	}
}
/** Synchronous public SDK contract for native command consumers. */
function listSkillCommandsForAgents(params) {
	const used = listReservedChatSlashCommandNames();
	const entries = [];
	for (const { workspaceDir, options } of resolveAgentSkillCommandWorkspaces(params)) appendSkillCommands(entries, used, buildWorkspaceSkillCommandSpecs(workspaceDir, {
		...options,
		reservedNames: used
	}));
	return finalizeSkillCommands(entries);
}
async function prepareSkillCommandsForAgents(params) {
	params.signal?.throwIfAborted();
	await prepareRemoteSkillConnections();
	params.signal?.throwIfAborted();
	const used = listReservedChatSlashCommandNames();
	const entries = [];
	for (const { workspaceDir, options } of resolveAgentSkillCommandWorkspaces(params, true)) {
		const commands = await racePromiseWithAbortSignal(prepareWorkspaceSkillCommandSpecs(workspaceDir, {
			...options,
			reservedNames: used
		}), params.signal);
		params.signal?.throwIfAborted();
		appendSkillCommands(entries, used, commands);
	}
	return finalizeSkillCommands(entries);
}
//#endregion
export { prepareSkillCommandsForWorkspace as a, prepareSkillCommandsForAgents as i, listSkillCommandsForWorkspace as n, prepareBundledSkillCommandForWorkspace as r, listSkillCommandsForAgents as t };
