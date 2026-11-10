import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import { a as getCodeModeExecBeforeHookMetadataForToolKind, o as isCodeModeControlTool } from "./code-mode-control-tools-ktsLOa_a.mjs";
import { g as wrapToolWithGatewayCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { i as copyAgentToolMetadata, o as getAgentToolActionDescriptor } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { a as attachInternalToolExecutionPreparer, m as getInternalToolExecutionPreparer } from "./internal-hooks-CSjTREUl.mjs";
import { r as markToolExecutionNotStarted } from "./tool-effect-receipt-BHVAm8DM.mjs";
import { c as rewrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { s as runWithAgentToolSourceExecutionScope, t as bindAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import "./tool-result-error-IpvGgAny.mjs";
import { t as captureAgentWorkspaceReadiness } from "./workspace-readiness-B5JSqS7C.mjs";
import { n as wrapToolWithAbortSignal } from "./agent-tools.abort-Vm0F-Le2.mjs";
import { isPathInsideWithRealpath } from "@openclaw/fs-safe/path";
//#region src/agents/harness/host-snapshot.ts
/** Host capabilities retain immutable input facts independently of caller mutation. */
function cloneHostSnapshot(value) {
	return freezeJsonSnapshot(structuredClone(value));
}
//#endregion
//#region src/agents/harness/host-capability-workspace.ts
const WORKSPACE_TOOL_NAMES = Object.freeze([
	"exec",
	"process",
	"read",
	"write",
	"edit",
	"ls",
	"grep",
	"find",
	"apply_patch",
	"view_image",
	"pdf"
]);
const workspaceToolNames = new Set(WORKSPACE_TOOL_NAMES);
const nativeWorkspaceToolNames = {
	exec_command: "exec",
	write_stdin: "process",
	read_file: "read",
	list_dir: "ls",
	grep_files: "grep",
	glob: "find"
};
function isWorkspaceToolName(name) {
	const normalized = normalizeToolPolicyName(name);
	return workspaceToolNames.has(nativeWorkspaceToolNames[normalized] ?? normalized);
}
function isWorkspaceTool(tool) {
	if (isCodeModeControlTool(tool)) return false;
	const plugin = getPluginToolMeta(tool);
	if (plugin) return plugin.workspaceAccess !== false;
	const operation = getAgentToolActionDescriptor(tool)?.operation;
	return operation === "filesystem" || operation === "process" || isWorkspaceToolName(tool.name);
}
/** Bind one captured workspace owner to native admission and the host tool surface. */
function prepareHostWorkspaceReadiness(sessionKey, assertActive) {
	const readiness = captureAgentWorkspaceReadiness(sessionKey);
	const wait = readiness ? async (assertCurrent) => {
		assertCurrent();
		readiness.assertCurrent();
		await readiness.waitUntilReady();
		assertCurrent();
		readiness.assertCurrent();
	} : void 0;
	return {
		readiness,
		capability: wait ? Object.freeze({
			toolNames: WORKSPACE_TOOL_NAMES,
			waitUntilReady: () => wait(assertActive)
		}) : void 0,
		beforeToolCall: wait ? async (request, assertCurrent) => {
			if (!getCodeModeExecBeforeHookMetadataForToolKind({
				toolKind: request.toolKind,
				params: request.params
			}) && isWorkspaceToolName(request.toolName)) await wait(assertCurrent);
		} : void 0
	};
}
function captureRequiredWorkspaceToolFloor(attempt, pluginId, config) {
	if (attempt.requireWorkspaceOnly !== true) return;
	const requiredWorkspace = {
		workspaceDir: attempt.workspaceDir,
		cwd: attempt.cwd ?? attempt.workspaceDir,
		root: attempt.sandbox?.enabled ? attempt.sandbox.workspaceDir : attempt.sessionRoot ?? attempt.workspaceDir,
		sandbox: attempt.sandbox ? Object.freeze({
			...attempt.sandbox,
			tools: cloneHostSnapshot(attempt.sandbox.tools)
		}) : void 0,
		permissionMode: attempt.permissionMode
	};
	if (!requiredWorkspace.workspaceDir || !requiredWorkspace.root) throw new Error("required workspace tool surface has no captured root");
	const root = requiredWorkspace.root;
	const apply = (options) => {
		const requestedPermissionRoot = options?.sessionPermissionPolicy?.root;
		if (requestedPermissionRoot && requestedPermissionRoot !== root && !isPathInsideWithRealpath(root, requestedPermissionRoot)) throw new Error("tool permission root escapes the captured required workspace");
		return {
			config,
			workspaceDir: requiredWorkspace.workspaceDir,
			cwd: requiredWorkspace.cwd,
			sandbox: requiredWorkspace.sandbox,
			requireWorkspaceOnly: true,
			sessionPermissionPolicy: requiredWorkspace.permissionMode || options?.sessionPermissionPolicy ? {
				root: requestedPermissionRoot ?? root,
				mode: requiredWorkspace.permissionMode === "read-only" || options?.sessionPermissionPolicy?.mode === "read-only" ? "read-only" : requiredWorkspace.permissionMode ?? options.sessionPermissionPolicy.mode
			} : void 0,
			...pluginId === "codex" ? {
				exec: {
					...options?.exec,
					mode: "deny"
				},
				toolConstructionPlan: {
					...options?.toolConstructionPlan ?? {
						includeBaseCodingTools: options?.includeCoreTools !== false,
						includeChannelTools: options?.includeCoreTools !== false,
						includeOpenClawTools: options?.includeCoreTools !== false,
						includePluginTools: true
					},
					includeShellTools: false
				}
			} : {}
		};
	};
	return {
		root,
		apply
	};
}
//#endregion
//#region src/agents/harness/host-bound-tool.ts
/** Assemble each host tool's policy, caller and readiness gates in their execution order. */
function bindHostToolSurface(tools, params) {
	params.assertActive();
	return tools.map((tool) => bindAgentToolSourceExecutionGuard(tool, params.assertActive)).map((tool) => rewrapToolWithBeforeToolCallHook(tool, params.hookContext)).map((tool) => params.callerIdentity ? wrapToolWithGatewayCallerIdentity(tool, params.callerIdentity) : tool).map((tool) => wrapToolWithAbortSignal(tool, params.abortSignal)).map((tool) => gateBoundTool(tool, params.assertActive, params.observeResult, isWorkspaceTool(tool) ? params.workspaceReadiness : void 0));
}
function gateBoundTool(tool, assertActive, observeResult, workspaceReadiness) {
	const execute = tool.execute;
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (!execute && !sourcePreparer) return tool;
	const assertCurrent = () => runWithAgentToolSourceExecutionScope(assertActive, async () => {
		assertActive();
		workspaceReadiness?.assertCurrent();
	});
	const acceptResult = (result) => {
		(assertActive.assertScopeCurrent ?? assertActive)();
		workspaceReadiness?.assertCurrent();
		observeResult(result);
		return result;
	};
	const awaitWorkspace = async () => {
		await assertCurrent();
		if (workspaceReadiness) {
			await workspaceReadiness.waitUntilReady();
			await assertCurrent();
		}
	};
	const gated = {
		...tool,
		...execute ? { execute: async (...args) => {
			try {
				if (workspaceReadiness) await awaitWorkspace();
				else await assertCurrent();
			} catch (error) {
				throw markToolExecutionNotStarted(error);
			}
			return acceptResult(await execute(...args));
		} } : {}
	};
	copyAgentToolMetadata(tool, gated, (source) => gateBoundTool(source, assertActive, observeResult, workspaceReadiness));
	if (sourcePreparer) attachInternalToolExecutionPreparer(gated, async (preparationParams) => {
		if (workspaceReadiness) await awaitWorkspace();
		else await assertCurrent();
		const prepared = await sourcePreparer(preparationParams);
		try {
			await assertCurrent();
		} catch (error) {
			prepared.dispose();
			throw error;
		}
		if (prepared.kind === "immediate") {
			if (prepared.outcome.kind === "result") observeResult(prepared.outcome.result);
			return prepared;
		}
		return {
			...prepared,
			execute: async (onImplementationStart) => {
				if (workspaceReadiness) await awaitWorkspace();
				else await assertCurrent();
				return acceptResult(await prepared.execute(onImplementationStart));
			}
		};
	});
	return gated;
}
//#endregion
export { prepareHostWorkspaceReadiness as a, isWorkspaceTool as i, gateBoundTool as n, cloneHostSnapshot as o, captureRequiredWorkspaceToolFloor as r, bindHostToolSurface as t };
