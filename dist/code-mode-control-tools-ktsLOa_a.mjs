import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { t as isPlainObject } from "./plain-object-BFvGATnd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import "./tool-policy-14GRhbFd.mjs";
//#region src/agents/code-mode-control-tools.ts
const CODE_MODE_EXEC_TOOL_NAME = "exec";
const CODE_MODE_WAIT_TOOL_NAME = "wait";
const CODE_MODE_EXEC_TOOL_KIND = "code_mode_exec";
const codeModeControlTools = /* @__PURE__ */ new WeakSet();
function markCodeModeControlTool(tool) {
	codeModeControlTools.add(tool);
	return tool;
}
function copyCodeModeControlToolIdentity(original, wrapper) {
	if (codeModeControlTools.has(original)) codeModeControlTools.add(wrapper);
}
function isCodeModeControlTool(tool) {
	return codeModeControlTools.has(tool);
}
/** Return whether a tool is the marked Code Mode `exec` control tool (not a plain shell exec). */
function isCodeModeExecTool(tool) {
	return isCodeModeControlTool(tool) && normalizeToolPolicyName(tool.name) === "exec";
}
function resolveCodeModeExecToolInputKind(params) {
	if (!isPlainObject(params)) return;
	return params.language === void 0 && params.typecheck === void 0 ? "javascript" : void 0;
}
function normalizeCodeModeExecParams(params) {
	if (!isPlainObject(params)) return params;
	const code = readNonBlankString(params.code);
	const command = readNonBlankString(params.command);
	if (code !== void 0 && command === void 0) return {
		...params,
		command: code
	};
	if (command !== void 0 && code === void 0) return {
		...params,
		code: command
	};
	return params;
}
function getCodeModeExecBeforeHookMetadata(params) {
	if (!isCodeModeExecTool(params.tool)) return;
	return getCodeModeExecBeforeHookMetadataForToolKind({
		toolKind: CODE_MODE_EXEC_TOOL_KIND,
		params: params.params
	});
}
function getCodeModeExecBeforeHookMetadataForToolKind(params) {
	if (params.toolKind !== CODE_MODE_EXEC_TOOL_KIND) return;
	const toolInputKind = resolveCodeModeExecToolInputKind(params.params);
	return {
		toolKind: CODE_MODE_EXEC_TOOL_KIND,
		...toolInputKind && { toolInputKind }
	};
}
function normalizeCodeModeExecBeforeHookParams(params) {
	if (!isCodeModeExecTool(params.tool)) return params.params;
	return normalizeCodeModeExecParams(params.params);
}
/** Reconcile policy- or hook-adjusted aliases after raw-input normalization. */
function reconcileCodeModeExecBeforeHookParams(params) {
	if (!("tool" in params.owner ? isCodeModeExecTool(params.owner.tool) : params.owner.toolKind === CODE_MODE_EXEC_TOOL_KIND) || !isPlainObject(params.originalParams) || !isPlainObject(params.hookParams) || !isPlainObject(params.adjustedParams)) return params.adjustedParams;
	const hookCode = params.hookParams.code;
	const hookCommand = params.hookParams.command;
	if (typeof hookCode !== "string" || hookCode !== hookCommand) return params.adjustedParams;
	const adjustedCode = params.adjustedParams.code;
	const adjustedCommand = params.adjustedParams.command;
	const adjustedCodeChanged = Object.hasOwn(params.adjustedParams, "code") && adjustedCode !== hookCode;
	const adjustedCommandChanged = Object.hasOwn(params.adjustedParams, "command") && adjustedCommand !== hookCode;
	if (adjustedCodeChanged && readNonBlankString(adjustedCode) === void 0) return {
		...params.adjustedParams,
		command: adjustedCode
	};
	if (adjustedCommandChanged && readNonBlankString(adjustedCommand) === void 0) return {
		...params.adjustedParams,
		code: adjustedCommand
	};
	if (adjustedCodeChanged === adjustedCommandChanged) return params.adjustedParams;
	if (adjustedCodeChanged) return {
		...params.adjustedParams,
		command: adjustedCode
	};
	return {
		...params.adjustedParams,
		code: adjustedCommand
	};
}
//#endregion
export { getCodeModeExecBeforeHookMetadataForToolKind as a, markCodeModeControlTool as c, getCodeModeExecBeforeHookMetadata as i, normalizeCodeModeExecBeforeHookParams as l, CODE_MODE_WAIT_TOOL_NAME as n, isCodeModeControlTool as o, copyCodeModeControlToolIdentity as r, isCodeModeExecTool as s, CODE_MODE_EXEC_TOOL_NAME as t, reconcileCodeModeExecBeforeHookParams as u };
