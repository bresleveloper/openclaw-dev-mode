import { r as flattenCodexDynamicToolFunctions } from "./protocol-CANUwXJ3.mjs";
import { ut as isMessageOnlyCodexSourceReply } from "./thread-requests-DMd-wcni.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { buildAgentWorkspaceInstructionSnapshot, buildBootstrapContextForFiles, embeddedAgentLog, prepareAgentWorkspaceContext } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveAgentWorkspaceMemoryRouting, shouldIncludeAgentHarnessRuntimeContext } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
import { resolveBootstrapFilesForPreparation } from "openclaw/plugin-sdk/codex-mcp-projection";
//#region extensions/codex/src/app-server/attempt-workspace-context.ts
const CODEX_NATIVE_PROJECT_DOC_BASENAMES = /* @__PURE__ */ new Set(["agents.md"]);
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
	if (path.resolve(params.workspaceDir) === path.resolve(params.cwd)) return;
	const files = await resolveBootstrapFilesForPreparation(params);
	const contextFiles = buildBootstrapContextForFiles(files, {
		config: params.config,
		agentId: params.agentId
	});
	return buildAgentWorkspaceInstructionSnapshot(contextFiles, params.workspaceDir).instructions;
}
async function buildCodexWorkspaceBootstrapContext(params) {
	const availableToolNames = new Set(flattenCodexDynamicToolFunctions(params.tools).map((tool) => normalizeLowercaseStringOrEmpty(tool.name)));
	const inheritsAgentWorkspace = (params.executionWorkspace ?? params.resolvedWorkspace) !== params.resolvedWorkspace;
	const injectOpenClawContext = shouldIncludeAgentHarnessRuntimeContext(params.params);
	const restrictedProjectDocNeedsOpenClawCarrier = params.params.pluginHarnessToolPolicyRestricted === true && !params.params.disableTools && !isMessageOnlyCodexSourceReply(params.params) && params.params.bootstrapContextMode !== "lightweight";
	const includeAgentWorkspaceInstructions = injectOpenClawContext && !params.ringZeroActive && (inheritsAgentWorkspace || restrictedProjectDocNeedsOpenClawCarrier);
	try {
		const promptWorkspace = inheritsAgentWorkspace ? params.resolvedWorkspace : params.effectiveWorkspace;
		const { memoryToolNames, memoryToolRouted } = resolveAgentWorkspaceMemoryRouting({
			config: params.params.config,
			agentId: params.params.agentId ?? params.sessionAgentId,
			workspaceDir: promptWorkspace,
			toolNames: availableToolNames
		});
		const prepared = await prepareAgentWorkspaceContext({
			scope: "full",
			workspaceDir: params.resolvedWorkspace,
			config: params.params.config,
			sessionKey: params.sessionKey,
			sessionId: params.params.sessionId,
			bootstrapUserProfileId: params.params.bootstrapUserProfileId,
			chatType: params.params.chatType,
			agentId: params.params.agentId ?? params.sessionAgentId,
			warn: (message) => embeddedAgentLog.warn(message),
			contextMode: params.params.bootstrapContextMode,
			runKind: params.params.bootstrapContextRunKind,
			memoryToolRouted,
			onMemoryPreparationError: (error) => embeddedAgentLog.warn("failed to prepare codex memory recall instructions", { error }),
			memoryTools: injectOpenClawContext ? {
				toolNames: [...availableToolNames],
				citationsMode: params.params.config?.memory?.citations,
				sandboxed: params.sandboxed
			} : void 0,
			projectPath: (filePath) => remapCodexContextFilePath({
				filePath,
				sourceWorkspaceDir: params.resolvedWorkspace,
				targetWorkspaceDir: promptWorkspace
			}),
			nativeProjectDocBasenames: CODEX_NATIVE_PROJECT_DOC_BASENAMES,
			contextFileOrder: CODEX_BOOTSTRAP_CONTEXT_ORDER,
			promptMemoryWorkspaceDir: params.effectiveWorkspace
		});
		const { bootstrapFiles, contextFiles, promptContextFiles, memoryReferenceFiles, memoryToolRoutedBootstrapFiles } = prepared;
		return {
			bootstrapFiles,
			contextFiles,
			inheritsAgentWorkspace,
			promptContextFiles,
			threadDeveloperInstructionFiles: includeAgentWorkspaceInstructions ? prepared.instructionSnapshot.files : [],
			personaFiles: injectOpenClawContext ? prepared.personaFiles : [],
			memoryReferenceFiles,
			memoryToolRoutedBootstrapFiles,
			memoryToolNames,
			memoryToolRouted,
			promptContext: renderCodexWorkspaceBootstrapPromptContext(promptContextFiles),
			threadDeveloperInstructions: includeAgentWorkspaceInstructions ? params.agentWorkspaceDeveloperInstructions ?? prepared.instructionSnapshot.instructions : void 0,
			personaInstructions: injectOpenClawContext ? prepared.personaInstructions : void 0,
			sharedPersonaInstructions: injectOpenClawContext ? prepared.sharedPersonaInstructions : void 0,
			memoryInstructions: injectOpenClawContext ? renderCodexWorkspaceMemoryInstructions({
				files: memoryReferenceFiles,
				toolNames: memoryToolNames,
				memoryRecallInstructions: prepared.memoryRecallInstructions
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
function renderCodexWorkspaceBootstrapPromptContext(contextFiles) {
	if (contextFiles.length === 0) return;
	const lines = [
		"OpenClaw loaded these user-editable workspace files for the current turn. Codex loads project-local AGENTS.md natively. When execution uses another folder, OpenClaw supplies the agent workspace AGENTS.md as thread-level developer instructions. SOUL.md, IDENTITY.md, and USER.md are prepared separately from user input and are not repeated here.",
		"",
		"# Project Context",
		"",
		"The following project context files have been loaded:",
		""
	];
	for (const file of contextFiles) lines.push(`## ${file.path}`, "", file.content, "");
	return lines.join("\n").trim();
}
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
function renderCodexWorkspaceMemoryInstructions(params) {
	const sections = [params.memoryRecallInstructions ? [params.memoryRecallInstructions, renderCodexMemoryToolSearchBridge(params.toolNames)].filter(isNonEmptyString).join("\n").trim() : void 0, renderCodexWorkspaceMemoryReference(params)].filter(isNonEmptyString);
	return sections.length > 0 ? sections.join("\n\n") : void 0;
}
function renderCodexMemoryToolSearchBridge(toolNames) {
	const memoryToolNames = toolNames.map(normalizeLowercaseStringOrEmpty).filter((name) => CODEX_MEMORY_TOOL_NAMES.has(name)).toSorted();
	if (memoryToolNames.length === 0) return;
	return `Codex may expose ${memoryToolNames.join(" and ")} as deferred tools. When the memory guidance above calls for memory recall, use an already-loaded memory tool directly. If the needed memory tool is deferred and not currently callable, use \`tool_search\` to load it, then call that memory tool.`;
}
/**
* Remaps bootstrap file paths from the resolved workspace to the effective Codex
* workspace while preserving platform path separators.
*/
function remapCodexContextFilePath(params) {
	const relativePath = path.relative(params.sourceWorkspaceDir, params.filePath);
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath) || params.sourceWorkspaceDir === params.targetWorkspaceDir) return params.filePath;
	const targetUsesPosixSeparators = params.targetWorkspaceDir.includes("/") && !params.targetWorkspaceDir.includes("\\");
	const normalizedRelativePath = targetUsesPosixSeparators ? relativePath.replaceAll("\\", "/") : relativePath.replaceAll("/", "\\");
	return targetUsesPosixSeparators ? path.posix.join(params.targetWorkspaceDir, normalizedRelativePath) : path.win32.join(params.targetWorkspaceDir, normalizedRelativePath);
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
function isNonEmptyString(value) {
	return typeof value === "string" && value.length > 0;
}
//#endregion
export { getCodexContextFileDisplayBasename as a, prepareCodexWorkspaceDeveloperInstructions as c, getCodexContextFileBasename as i, CODEX_NATIVE_PROJECT_DOC_BASENAMES as n, isNonEmptyString as o, buildCodexWorkspaceBootstrapContext as r, normalizeCodexContextFilePath as s, CODEX_MEMORY_CONTEXT_BASENAME as t };
