import { r as flattenCodexDynamicToolFunctions } from "./protocol-CANUwXJ3.mjs";
import { ct as isMessageOnlyCodexSourceReply } from "./thread-requests-BLvGkP2R.mjs";
import { readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { resolveAgentWorkspaceDir } from "openclaw/plugin-sdk/agent-runtime";
import { buildBootstrapContextForFiles, embeddedAgentLog, resolveBootstrapFilesForRun } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveBootstrapFilesForPreparation } from "openclaw/plugin-sdk/codex-mcp-projection";
import { prepareMemorySystemPromptAddition } from "openclaw/plugin-sdk/core";
//#region extensions/codex/src/app-server/attempt-workspace-context.ts
/** Workspace snapshots, per-turn workspace context, and memory-tool routing for Codex. */
const CODEX_NATIVE_PROJECT_DOC_BASENAMES = /* @__PURE__ */ new Set(["agents.md"]);
const CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = /* @__PURE__ */ new Set([
	"identity.md",
	"soul.md",
	"user.md"
]);
const CODEX_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = new Set(CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES);
const CODEX_MEMORY_CONTEXT_BASENAME = "memory.md";
const CODEX_MEMORY_TOOL_NAMES = /* @__PURE__ */ new Set(["memory_search", "memory_get"]);
const CODEX_BOOTSTRAP_CONTEXT_ORDER = /* @__PURE__ */ new Map([
	["soul.md", 10],
	["identity.md", 20],
	["user.md", 30],
	["bootstrap.md", 50],
	["memory.md", 60]
]);
/** A child baseline reads the bounded workspace snapshot without invoking admission hooks. */
async function prepareCodexWorkspaceDeveloperInstructions(params) {
	if (isSameCodexWorkspacePath(params.workspaceDir, params.cwd)) return;
	const files = await resolveBootstrapFilesForPreparation(params);
	return renderCodexWorkspaceDeveloperInstructions({
		files: selectCodexWorkspaceAgentProjectInstructionFiles(buildBootstrapContextForFiles(files, {
			config: params.config,
			agentId: params.agentId
		}), params.workspaceDir),
		header: "## OpenClaw Agent Workspace Instructions",
		preamble: "OpenClaw loaded this bounded snapshot from the configured agent workspace."
	}) ?? "";
}
/** Loads and partitions workspace snapshots, turn instructions, and memory references. */
async function buildCodexWorkspaceBootstrapContext(params) {
	const inheritsAgentWorkspace = (params.executionWorkspace ?? params.resolvedWorkspace) !== params.resolvedWorkspace;
	const injectOpenClawContext = shouldInjectCodexOpenClawPromptContext(params.params);
	const restrictedProjectDocNeedsOpenClawCarrier = params.params.pluginHarnessToolPolicyRestricted === true && !params.params.disableTools && !isMessageOnlyCodexSourceReply(params.params) && params.params.bootstrapContextMode !== "lightweight";
	const includeAgentWorkspaceInstructions = injectOpenClawContext && !params.ringZeroActive && (inheritsAgentWorkspace || restrictedProjectDocNeedsOpenClawCarrier);
	try {
		const promptWorkspace = inheritsAgentWorkspace ? params.resolvedWorkspace : params.effectiveWorkspace;
		const memoryToolsAvailable = params.memoryToolNames.length > 0 && canRouteCodexWorkspaceMemoryThroughTools({
			config: params.params.config,
			agentId: params.params.agentId ?? params.sessionAgentId,
			workspaceDir: inheritsAgentWorkspace ? params.resolvedWorkspace : params.effectiveWorkspace
		});
		const bootstrapFiles = await resolveBootstrapFilesForRun({
			workspaceDir: params.resolvedWorkspace,
			config: params.params.config,
			sessionKey: params.sessionKey,
			sessionId: params.params.sessionId,
			bootstrapUserProfileId: params.params.bootstrapUserProfileId,
			chatType: params.params.chatType,
			agentId: params.params.agentId ?? params.sessionAgentId,
			warn: (message) => embeddedAgentLog.warn(message),
			contextMode: params.params.bootstrapContextMode,
			runKind: params.params.bootstrapContextRunKind
		});
		const memoryToolRoutedBootstrapFiles = memoryToolsAvailable ? selectCodexWorkspaceMemoryReferenceFiles({
			bootstrapFiles,
			workspaceDir: params.resolvedWorkspace
		}) : [];
		const memoryReferenceFiles = memoryToolRoutedBootstrapFiles.map((file) => remapCodexContextFilePath({
			file: toCodexEmbeddedContextFile(file),
			sourceWorkspaceDir: params.resolvedWorkspace,
			targetWorkspaceDir: promptWorkspace
		}));
		const contextFiles = buildBootstrapContextForFiles(memoryToolsAvailable ? bootstrapFiles.filter((file) => !isCodexWorkspaceRootMemoryBootstrapFile({
			file,
			workspaceDir: params.resolvedWorkspace
		})) : bootstrapFiles, {
			config: params.params.config,
			agentId: params.params.agentId ?? params.sessionAgentId,
			warn: (message) => embeddedAgentLog.warn(message)
		}).map((file) => remapCodexContextFilePath({
			file,
			sourceWorkspaceDir: params.resolvedWorkspace,
			targetWorkspaceDir: promptWorkspace
		}));
		const promptContextFiles = selectCodexWorkspacePromptContextFiles(contextFiles, {
			excludeMemory: memoryToolsAvailable,
			memoryWorkspaceDir: params.effectiveWorkspace
		});
		const threadDeveloperInstructionFiles = includeAgentWorkspaceInstructions ? selectCodexWorkspaceAgentProjectInstructionFiles(contextFiles, params.resolvedWorkspace) : [];
		const turnScopedDeveloperInstructionFiles = injectOpenClawContext ? selectCodexWorkspaceTurnScopedDeveloperInstructionFiles(contextFiles) : [];
		return {
			bootstrapFiles,
			contextFiles,
			inheritsAgentWorkspace,
			promptContextFiles,
			threadDeveloperInstructionFiles,
			turnScopedDeveloperInstructionFiles,
			memoryReferenceFiles,
			memoryToolRoutedBootstrapFiles,
			memoryToolNames: [...params.memoryToolNames],
			memoryToolRouted: memoryToolsAvailable,
			promptContext: renderCodexWorkspaceBootstrapPromptContext(promptContextFiles),
			threadDeveloperInstructions: includeAgentWorkspaceInstructions ? params.agentWorkspaceDeveloperInstructions ?? renderCodexWorkspaceDeveloperInstructions({
				files: threadDeveloperInstructionFiles,
				header: "## OpenClaw Agent Workspace Instructions",
				preamble: "OpenClaw loaded this bounded snapshot from the configured agent workspace."
			}) ?? "" : void 0,
			turnScopedDeveloperInstructions: renderCodexWorkspaceCollaborationDeveloperInstructions(turnScopedDeveloperInstructionFiles),
			memoryCollaborationInstructions: injectOpenClawContext ? await renderCodexWorkspaceMemoryCollaborationInstructions({
				files: memoryReferenceFiles,
				toolNames: params.memoryToolNames,
				memoryToolRouted: memoryToolsAvailable,
				citationsMode: params.params.config?.memory?.citations,
				agentId: params.params.agentId ?? params.sessionAgentId,
				agentSessionKey: params.sessionKey,
				sandboxed: params.sandboxed
			}) : void 0
		};
	} catch (error) {
		embeddedAgentLog.warn("failed to load codex workspace bootstrap instructions", { error });
		return {
			bootstrapFiles: [],
			contextFiles: [],
			inheritsAgentWorkspace,
			threadDeveloperInstructions: includeAgentWorkspaceInstructions ? params.agentWorkspaceDeveloperInstructions : void 0
		};
	}
}
function shouldInjectCodexOpenClawPromptContext(params) {
	return !(params.bootstrapContextMode === "lightweight" && params.bootstrapContextRunKind === "cron");
}
function renderCodexWorkspaceBootstrapPromptContext(contextFiles) {
	const files = contextFiles;
	if (files.length === 0) return;
	const lines = [
		"OpenClaw loaded these user-editable workspace files for the current turn. Codex loads project-local AGENTS.md natively. When execution uses another folder, OpenClaw supplies the agent workspace AGENTS.md as thread-level developer instructions. SOUL.md, IDENTITY.md, and USER.md are prepared separately from user input and are not repeated here.",
		"",
		"# Project Context",
		"",
		"The following project context files have been loaded:"
	];
	lines.push("");
	for (const file of files) lines.push(`## ${file.path}`, "", file.content, "");
	return lines.join("\n").trim();
}
function selectCodexWorkspacePromptContextFiles(contextFiles, options = {}) {
	const excludeMemory = options.excludeMemory ?? true;
	return contextFiles.filter((file) => {
		const baseName = getCodexContextFileBasename(file.path);
		return baseName && !CODEX_NATIVE_PROJECT_DOC_BASENAMES.has(baseName) && !CODEX_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES.has(baseName) && (!excludeMemory || !isCodexWorkspaceRootMemoryContextFile({
			file,
			workspaceDir: options.memoryWorkspaceDir
		})) && !isMissingCodexBootstrapContextFile(file);
	}).toSorted(compareCodexContextFiles);
}
function selectCodexWorkspaceTurnScopedDeveloperInstructionFiles(contextFiles) {
	return selectCodexWorkspaceDeveloperInstructionFiles(contextFiles, CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES);
}
function selectCodexWorkspaceAgentProjectInstructionFiles(contextFiles, agentWorkspaceDir) {
	const agentProjectDocPath = path.join(path.resolve(agentWorkspaceDir), "AGENTS.md");
	return selectCodexWorkspaceDeveloperInstructionFiles(contextFiles, CODEX_NATIVE_PROJECT_DOC_BASENAMES).filter((file) => path.resolve(file.path) === agentProjectDocPath);
}
function selectCodexWorkspaceDeveloperInstructionFiles(contextFiles, basenames) {
	return contextFiles.filter((file) => {
		const baseName = getCodexContextFileBasename(file.path);
		return baseName && basenames.has(baseName) && !isMissingCodexBootstrapContextFile(file) && file.content.trim().length > 0;
	}).toSorted(compareCodexContextFiles);
}
function renderCodexWorkspaceCollaborationDeveloperInstructions(files) {
	return renderCodexWorkspaceDeveloperInstructions({
		files,
		header: "## OpenClaw Agent Soul",
		preamble: "OpenClaw loaded these workspace instruction files from the active agent workspace. They are the canonical definitions of who you are, how you think and work, and the human you work alongside. Internalize and follow them accordingly." + (files.some((file) => file.personalUser === true) ? " The personal users/<profile-id>/USER.md belongs to this session's selected person (assigned human owner, otherwise human creator). It supplements shared USER.md and overrides conflicting shared preferences, not higher-priority rules. Other participants do not change this personal context." : ""),
		wrapperTag: "AGENT_SOUL"
	});
}
function renderCodexWorkspaceDeveloperInstructions(params) {
	const { files, header, preamble, wrapperTag } = params;
	if (files.length === 0) return;
	const lines = [
		header,
		"",
		preamble,
		""
	];
	if (wrapperTag) lines.push(`<${wrapperTag}>`, "");
	for (const file of files) lines.push(`### ${file.path}`, "", file.content, "");
	if (wrapperTag) lines.push(`</${wrapperTag}>`);
	return lines.join("\n").trim();
}
function selectCodexWorkspaceMemoryReferenceFiles(params) {
	return params.bootstrapFiles.filter((file) => {
		return isCodexWorkspaceRootMemoryBootstrapFile({
			file,
			workspaceDir: params.workspaceDir
		}) && !file.missing && (file.content ?? "").trim().length > 0;
	}).toSorted(compareCodexBootstrapFiles);
}
/**
* Renders a memory-file reference that points Codex at memory tools instead of
* embedding MEMORY.md contents.
*/
function renderCodexWorkspaceMemoryReference(params) {
	if (params.files.length === 0) return;
	const lines = [
		"## OpenClaw Workspace Memory",
		"",
		`MEMORY.md exists in the active agent workspace as a memory file, not an instruction file. OpenClaw does not paste its contents into native Codex turns; use ${(params.toolNames?.length ? params.toolNames : Array.from(CODEX_MEMORY_TOOL_NAMES)).join(" or ")} when durable memory is relevant and the tools are available.`,
		""
	];
	for (const file of params.files) lines.push(`- ${file.path}`);
	return lines.join("\n").trim();
}
async function renderCodexWorkspaceMemoryCollaborationInstructions(params) {
	const sections = [params.memoryToolRouted ? await renderCodexMemoryRecallInstructions({
		toolNames: params.toolNames,
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed
	}) : void 0, renderCodexWorkspaceMemoryReference({
		files: params.files,
		toolNames: params.toolNames
	})].filter(isNonEmptyString);
	return sections.length > 0 ? sections.join("\n\n") : void 0;
}
async function renderCodexMemoryRecallInstructions(params) {
	const availableTools = new Set(params.toolNames);
	const memoryPrompt = await prepareMemorySystemPromptAddition({
		availableTools,
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed
	}).catch((error) => {
		embeddedAgentLog.warn("failed to prepare codex memory recall instructions", { error });
	});
	if (!memoryPrompt) return;
	return [memoryPrompt, renderCodexMemoryToolSearchBridge(params.toolNames)].filter(isNonEmptyString).join("\n").trim();
}
function renderCodexMemoryToolSearchBridge(toolNames) {
	const memoryToolNames = toolNames.map((name) => normalizeCodexDynamicToolName(name)).filter((name) => CODEX_MEMORY_TOOL_NAMES.has(name)).toSorted();
	if (memoryToolNames.length === 0) return;
	return `Codex may expose ${memoryToolNames.join(" and ")} as deferred tools. When the memory guidance above calls for memory recall, use an already-loaded memory tool directly. If the needed memory tool is deferred and not currently callable, use \`tool_search\` to load it, then call that memory tool.`;
}
/** Lists available memory tool names understood by Codex workspace memory routing. */
function getCodexWorkspaceMemoryToolNames(tools) {
	const availableToolNames = new Set(flattenCodexDynamicToolFunctions(tools).map((tool) => normalizeCodexDynamicToolName(tool.name)));
	return Array.from(CODEX_MEMORY_TOOL_NAMES).filter((name) => availableToolNames.has(name));
}
function canRouteCodexWorkspaceMemoryThroughTools(params) {
	if (!params.config) return false;
	return isSameCodexWorkspacePath(resolveAgentWorkspaceDir(params.config, params.agentId), params.workspaceDir);
}
function isMissingCodexBootstrapContextFile(file) {
	return file.content.trimStart().startsWith("[MISSING] Expected at:");
}
function toCodexEmbeddedContextFile(file) {
	return {
		path: readNonBlankString(file.path) ?? readNonBlankString(file.name) ?? "",
		content: file.content ?? "",
		...file.personalUser === true ? { personalUser: true } : {}
	};
}
function isCodexWorkspaceRootMemoryBootstrapFile(params) {
	return isCodexWorkspaceRootMemoryPath({
		filePath: readNonBlankString(params.file.path) ?? readNonBlankString(params.file.name) ?? "",
		workspaceDir: params.workspaceDir
	});
}
function isCodexWorkspaceRootMemoryContextFile(params) {
	if (!params.workspaceDir) return false;
	return isCodexWorkspaceRootMemoryPath({
		filePath: params.file.path,
		workspaceDir: params.workspaceDir
	});
}
function isCodexWorkspaceRootMemoryPath(params) {
	const filePath = params.filePath.trim();
	if (!filePath) return false;
	return (path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(params.workspaceDir, filePath)) === path.join(path.resolve(params.workspaceDir), "MEMORY.md");
}
function isSameCodexWorkspacePath(left, right) {
	return path.resolve(left) === path.resolve(right);
}
/**
* Remaps bootstrap file paths from the resolved workspace to the effective Codex
* workspace while preserving platform path separators.
*/
function remapCodexContextFilePath(params) {
	const relativePath = path.relative(params.sourceWorkspaceDir, params.file.path);
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath) || params.sourceWorkspaceDir === params.targetWorkspaceDir) return params.file;
	const targetUsesPosixSeparators = params.targetWorkspaceDir.includes("/") && !params.targetWorkspaceDir.includes("\\");
	const normalizedRelativePath = targetUsesPosixSeparators ? relativePath.replaceAll("\\", "/") : relativePath.replaceAll("/", "\\");
	return {
		...params.file,
		path: targetUsesPosixSeparators ? path.posix.join(params.targetWorkspaceDir, normalizedRelativePath) : path.win32.join(params.targetWorkspaceDir, normalizedRelativePath)
	};
}
function compareCodexContextFiles(left, right) {
	const leftPath = normalizeCodexContextFilePath(left.path);
	const rightPath = normalizeCodexContextFilePath(right.path);
	const leftBase = getCodexContextFileBasename(left.path);
	const rightBase = getCodexContextFileBasename(right.path);
	const leftOrder = CODEX_BOOTSTRAP_CONTEXT_ORDER.get(leftBase) ?? Number.MAX_SAFE_INTEGER;
	const rightOrder = CODEX_BOOTSTRAP_CONTEXT_ORDER.get(rightBase) ?? Number.MAX_SAFE_INTEGER;
	if (leftOrder !== rightOrder) return leftOrder - rightOrder;
	if (leftBase !== rightBase) return leftBase.localeCompare(rightBase);
	return leftBase === "user.md" ? 0 : leftPath.localeCompare(rightPath);
}
function compareCodexBootstrapFiles(left, right) {
	return compareCodexContextFiles(toCodexEmbeddedContextFile(left), toCodexEmbeddedContextFile(right));
}
function normalizeCodexContextFilePath(filePath) {
	return filePath.trim().replaceAll("\\", "/").toLowerCase();
}
function getCodexContextFileDisplayBasename(filePath) {
	return filePath.trim().replaceAll("\\", "/").split("/").pop()?.trim() ?? "";
}
function getCodexContextFileBasename(filePath) {
	return normalizeCodexContextFilePath(filePath).split("/").pop() ?? "";
}
function normalizeCodexDynamicToolName(name) {
	return name.trim().toLowerCase();
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.length > 0;
}
//#endregion
export { getCodexContextFileDisplayBasename as a, normalizeCodexContextFilePath as c, shouldInjectCodexOpenClawPromptContext as d, getCodexContextFileBasename as i, normalizeCodexDynamicToolName as l, CODEX_NATIVE_PROJECT_DOC_BASENAMES as n, getCodexWorkspaceMemoryToolNames as o, buildCodexWorkspaceBootstrapContext as r, isNonEmptyString as s, CODEX_MEMORY_CONTEXT_BASENAME as t, prepareCodexWorkspaceDeveloperInstructions as u };
