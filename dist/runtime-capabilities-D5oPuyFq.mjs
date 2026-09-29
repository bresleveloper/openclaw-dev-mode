import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries, f as normalizeStringEntriesLower } from "./string-normalization-_gRhJUDw.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { i as supportsThreadBindingSpawn } from "./conversation-resolution-BQfeG7hv.mjs";
import { t as formatSkillsForPromptBounded } from "./skill-prompt-limits-CwjetzV2.mjs";
import { a as prepareWorkspaceSkills } from "./workspace-skill-loader-CHrBsX7y.mjs";
import { a as prepareSkillLibrarySelection, n as captureSkillLibrarySelection } from "./selection-Y3a9jWK1.mjs";
import { f as normalizeWorkspaceSkillRoots, i as getSkillsSourceVersion } from "./refresh-state-NJJr9z6k.mjs";
import { t as resolveSkillRuntimeConfig } from "./runtime-config-DqYoTmGc.mjs";
import { a as resolveChannelPromptCapabilities } from "./channel-tools-CzqletgP.mjs";
import { c as resolveThreadBindingSpawnPolicy } from "./thread-bindings-policy-BbWqcnDl.mjs";
import path from "node:path";
//#region src/agents/embedded-agent-runner/sandbox-skills.ts
/**
* Sandbox skill runtime input selection.
*
* Sandboxed runs must build prompt-facing skill entries from readable in-sandbox
* copies instead of reusing host-path snapshots.
*/
const MATERIALIZED_SKILLS_WORKSPACE_CONTAINER_PARTS = [".openclaw", "sandbox-skills"];
function containerJoin(root, ...parts) {
	const normalizedRoot = root.replace(/\\/g, "/").replace(/\/+$/, "") || "/";
	const suffix = parts.map((part) => part.replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/");
	return suffix ? `${normalizedRoot}/${suffix}` : normalizedRoot;
}
function pathEscapesRoot(relativePath) {
	return relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath);
}
function mapPathFromWorkspaceToContainer(params) {
	if (!params.filePath || !path.isAbsolute(params.filePath)) return params.filePath;
	const relativePath = path.relative(path.resolve(params.sourceWorkspaceDir), path.resolve(params.filePath));
	if (pathEscapesRoot(relativePath)) return params.filePath;
	if (!relativePath) return params.targetWorkspaceDir.replace(/\\/g, "/");
	return containerJoin(params.targetWorkspaceDir, ...relativePath.split(path.sep).filter(Boolean));
}
function mapSandboxSkillEntriesForPrompt(params) {
	if (!params.entries || params.skillsWorkspaceDir === params.skillsPromptWorkspaceDir) return params.entries;
	return params.entries.map((entry) => {
		const filePath = mapPathFromWorkspaceToContainer({
			filePath: entry.skill.filePath,
			sourceWorkspaceDir: params.skillsWorkspaceDir,
			targetWorkspaceDir: params.skillsPromptWorkspaceDir
		}) ?? entry.skill.filePath;
		const baseDir = mapPathFromWorkspaceToContainer({
			filePath: entry.skill.baseDir,
			sourceWorkspaceDir: params.skillsWorkspaceDir,
			targetWorkspaceDir: params.skillsPromptWorkspaceDir
		}) ?? entry.skill.baseDir;
		const sourceInfoPath = mapPathFromWorkspaceToContainer({
			filePath: entry.skill.sourceInfo.path,
			sourceWorkspaceDir: params.skillsWorkspaceDir,
			targetWorkspaceDir: params.skillsPromptWorkspaceDir
		}) ?? entry.skill.sourceInfo.path;
		const sourceInfoBaseDir = mapPathFromWorkspaceToContainer({
			filePath: entry.skill.sourceInfo.baseDir,
			sourceWorkspaceDir: params.skillsWorkspaceDir,
			targetWorkspaceDir: params.skillsPromptWorkspaceDir
		});
		return {
			...entry,
			skill: {
				...entry.skill,
				filePath,
				baseDir,
				sourceInfo: {
					...entry.skill.sourceInfo,
					path: sourceInfoPath,
					...sourceInfoBaseDir === void 0 ? {} : { baseDir: sourceInfoBaseDir }
				}
			}
		};
	});
}
function createSandboxPromptEntryLoader(params) {
	return async () => mapSandboxSkillEntriesForPrompt({
		entries: await params.loadEntries(),
		skillsWorkspaceDir: params.skillsWorkspaceDir,
		skillsPromptWorkspaceDir: params.skillsPromptWorkspaceDir
	}) ?? [];
}
function mapSandboxSkillUsagePaths(params) {
	if (!params.paths || params.skillsWorkspaceDir === params.skillsPromptWorkspaceDir) return params.paths;
	return params.paths.map((entry) => ({
		...entry,
		readPath: mapPathFromWorkspaceToContainer({
			filePath: entry.readPath,
			sourceWorkspaceDir: params.skillsWorkspaceDir,
			targetWorkspaceDir: params.skillsPromptWorkspaceDir
		}) ?? entry.readPath
	}));
}
function resolveSandboxSkillRuntimeInputs(params) {
	if (params.sandbox?.enabled === true) {
		const skillsWorkspaceDir = params.sandbox.skillsWorkspaceDir ?? params.skillsAnchorWorkspace;
		const skillsPromptWorkspaceDir = params.sandbox.workspaceAccess === "rw" && params.sandbox.skillsWorkspaceDir && params.sandbox.containerWorkdir ? containerJoin(params.sandbox.containerWorkdir, ...MATERIALIZED_SKILLS_WORKSPACE_CONTAINER_PARTS) : params.sandbox.containerWorkdir ?? skillsWorkspaceDir;
		const skillUsagePaths = mapSandboxSkillUsagePaths({
			paths: params.sandbox.skillUsagePaths,
			skillsWorkspaceDir,
			skillsPromptWorkspaceDir
		});
		let selectedSnapshot = params.skillsSnapshot && !params.skillsSnapshot.prompt.trim() ? params.skillsSnapshot : void 0;
		if (params.skillsSnapshot?.librarySelections?.length) {
			const usageBySkillName = /* @__PURE__ */ new Map();
			for (const usage of skillUsagePaths ?? []) if (!usageBySkillName.has(usage.skillName)) usageBySkillName.set(usage.skillName, usage);
			const resolvedSkills = params.skillsSnapshot.resolvedSkills?.map((skill) => {
				const materialized = usageBySkillName.get(skill.name);
				if (!materialized) throw new Error(`Selected skill ${skill.name} was not delivered to the sandbox.`);
				return {
					...skill,
					filePath: materialized.readPath,
					baseDir: path.posix.dirname(materialized.readPath)
				};
			});
			if (!resolvedSkills) throw new Error("Selected skill snapshot must be hydrated before sandbox delivery.");
			selectedSnapshot = {
				...params.skillsSnapshot,
				resolvedSkills,
				prompt: formatSkillsForPromptBounded({
					skills: resolvedSkills,
					preserveOrder: true
				})
			};
		}
		return {
			...params.sandbox.skillsEligibility ? { skillsEligibility: params.sandbox.skillsEligibility } : {},
			...skillUsagePaths ? { skillUsagePaths } : {},
			skillsPromptWorkspaceDir,
			skillsSnapshot: selectedSnapshot,
			skillsWorkspaceDir,
			workspaceOnly: true
		};
	}
	return {
		...params.sandbox?.skillUsagePaths ? { skillUsagePaths: params.sandbox.skillUsagePaths } : {},
		skillsPromptWorkspaceDir: params.skillsAnchorWorkspace,
		skillsSnapshot: params.skillsSnapshot,
		skillsWorkspaceDir: params.skillsAnchorWorkspace,
		workspaceOnly: false
	};
}
/** Rewrites host-generated explicit skill references to the prepared runtime's exact copies. */
function remapSkillReferencePaths(text, paths) {
	return (paths ?? []).reduce((result, item) => result.replaceAll(item.skillFile, item.readPath), text);
}
//#endregion
//#region src/skills/runtime/embedded-run-entries.ts
/** Resolves skill entries embedded into a run payload into runtime-visible entries. */
async function resolveEmbeddedRunSkillEntries(params) {
	const shouldLoadSkillEntries = !params.skillsSnapshot || Boolean(params.skillsSnapshot.prompt.trim()) && !params.skillsSnapshot.resolvedSkills;
	const config = resolveSkillRuntimeConfig(params.config);
	const skillRoots = normalizeWorkspaceSkillRoots(params.workspaceOnly === true ? { agentWorkspaceDir: params.workspaceDir } : (params.skillsSnapshot?.promptFormatVersion === 6 ? params.skillsSnapshot.skillRoots : void 0) ?? {
		agentWorkspaceDir: params.workspaceDir,
		executionWorkspaceDir: params.executionWorkspaceDir
	});
	let cachedSkillEntries;
	const loadSkillEntries = async () => {
		if (cachedSkillEntries) return cachedSkillEntries;
		params.assertCurrent?.();
		const librarySelections = captureSkillLibrarySelection(params.workspaceOnly === true ? [] : params.skillsSnapshot?.librarySelections ?? []);
		const libraryContext = librarySelections.length ? captureOpenClawStateWorkerContext() : void 0;
		const assertPreparedEntriesCurrent = () => {
			params.assertCurrent?.();
			libraryContext?.maintenanceScope?.assertAdmission();
			libraryContext?.admission.assertCurrent();
		};
		const options = {
			config,
			agentId: params.agentId,
			executionWorkspaceDir: skillRoots.executionWorkspaceDir,
			...params.eligibility ? { eligibility: params.eligibility } : {},
			...params.skillsSnapshot?.skillFilter ? { skillFilter: params.skillsSnapshot.skillFilter } : {},
			...params.skillsSnapshot?.skillOverrides ? { skillOverrides: params.skillsSnapshot.skillOverrides } : {},
			...params.workspaceOnly === true ? { workspaceOnly: true } : {}
		};
		for (;;) {
			assertPreparedEntriesCurrent();
			const sourceVersion = getSkillsSourceVersion(skillRoots.agentWorkspaceDir, options);
			const workspaceEntries = await prepareWorkspaceSkills(skillRoots.agentWorkspaceDir, options, params.assertCurrent);
			assertPreparedEntriesCurrent();
			const libraryEntries = libraryContext ? await prepareSkillLibrarySelection(librarySelections, { env: libraryContext.environment }, assertPreparedEntriesCurrent) : void 0;
			assertPreparedEntriesCurrent();
			if (cachedSkillEntries) return cachedSkillEntries;
			if (getSkillsSourceVersion(skillRoots.agentWorkspaceDir, options) !== sourceVersion) continue;
			cachedSkillEntries = libraryEntries ? [...workspaceEntries, ...libraryEntries] : workspaceEntries;
			return cachedSkillEntries;
		}
	};
	return {
		shouldLoadSkillEntries,
		skillEntries: shouldLoadSkillEntries ? await loadSkillEntries() : [],
		loadSkillEntries,
		preserveEntryOrder: skillRoots.executionWorkspaceDir !== void 0
	};
}
//#endregion
//#region src/config/channel-capabilities.ts
const isStringArray = (value) => Array.isArray(value) && value.every((entry) => typeof entry === "string");
function normalizeCapabilities(capabilities) {
	if (!isStringArray(capabilities)) return;
	const normalized = normalizeStringEntries(capabilities);
	return normalized.length > 0 ? normalized : void 0;
}
/** Resolves normalized string capabilities for a channel/account config pair. */
function resolveChannelCapabilities(params) {
	const cfg = params.cfg;
	const channel = normalizeAnyChannelId(params.channel);
	if (!cfg || !channel) return;
	const channelConfig = cfg.channels?.[channel];
	if (!channelConfig) return;
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const accounts = channelConfig.accounts;
	return normalizeCapabilities((accounts && typeof accounts === "object" ? resolveChannelAccountEntry(accounts, normalizedAccountId, channel) : void 0)?.capabilities) ?? normalizeCapabilities(channelConfig.capabilities);
}
//#endregion
//#region src/agents/runtime-capabilities.ts
/**
* Runtime channel capability collector.
*
* Agent startup uses this to merge configured channel capabilities with prompt
* tools and thread-bound spawn features that depend on channel policy.
*/
const THREAD_BOUND_SUBAGENT_SPAWN_CAPABILITY = "threadbound-subagent-spawn";
const THREAD_BOUND_ACP_SPAWN_CAPABILITY = "threadbound-acp-spawn";
function mergeRuntimeCapabilities(base, additions = []) {
	const merged = [...base ?? []];
	const seen = new Set(normalizeStringEntriesLower(merged));
	for (const capability of additions) {
		const normalizedCapability = normalizeOptionalLowercaseString(capability);
		if (!normalizedCapability || seen.has(normalizedCapability)) continue;
		seen.add(normalizedCapability);
		merged.push(capability);
	}
	return merged.length > 0 ? merged : void 0;
}
/** Collects the effective runtime capabilities for a channel/account pair. */
function collectRuntimeChannelCapabilities(params) {
	if (!params.channel) return;
	const internalChannelCapabilities = params.channel === "webchat" ? ["markdownDetails"] : [];
	const threadSpawnCapabilities = [];
	if (params.cfg && supportsThreadBindingSpawn(params.channel)) for (const [kind, capability] of [["subagent", THREAD_BOUND_SUBAGENT_SPAWN_CAPABILITY], ["acp", THREAD_BOUND_ACP_SPAWN_CAPABILITY]]) {
		const policy = resolveThreadBindingSpawnPolicy({
			cfg: params.cfg,
			channel: params.channel,
			accountId: params.accountId ?? void 0,
			kind
		});
		if (policy.enabled && policy.spawnEnabled) threadSpawnCapabilities.push(capability);
	}
	const channelPromptCapabilities = params.cfg ? resolveChannelPromptCapabilities(params) : [];
	return mergeRuntimeCapabilities(resolveChannelCapabilities(params), [
		...channelPromptCapabilities,
		...internalChannelCapabilities,
		...threadSpawnCapabilities
	]);
}
//#endregion
export { remapSkillReferencePaths as a, mapSandboxSkillEntriesForPrompt as i, resolveEmbeddedRunSkillEntries as n, resolveSandboxSkillRuntimeInputs as o, createSandboxPromptEntryLoader as r, collectRuntimeChannelCapabilities as t };
