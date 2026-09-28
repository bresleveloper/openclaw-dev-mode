import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
//#region src/agents/code-mode-control-tools.ts
/**
* Tags Code Mode exec/wait control tools and normalizes hook params for the
* exec-compatible before-tool-call surface.
*/
/** Model-visible Code Mode exec tool name. */
const CODE_MODE_EXEC_TOOL_NAME = "exec";
/** Model-visible Code Mode wait tool name. */
const CODE_MODE_WAIT_TOOL_NAME = "wait";
/** Hook metadata kind for Code Mode exec tools. */
const CODE_MODE_EXEC_TOOL_KIND = "code_mode_exec";
const codeModeControlTools = /* @__PURE__ */ new WeakSet();
const codeModeExecDescriptionTargets = /* @__PURE__ */ new WeakMap();
/** Mark a tool as owned by code mode control flow. */
function markCodeModeControlTool(tool) {
	codeModeControlTools.add(tool);
	return tool;
}
/** Replicate code-mode identity from an original tool object to a wrapper. */
function copyCodeModeControlToolIdentity(original, wrapper) {
	if (codeModeControlTools.has(original)) {
		codeModeControlTools.add(wrapper);
		const descriptionState = codeModeExecDescriptionTargets.get(original)?.state;
		if (descriptionState && descriptionState.targets.size > 0) {
			wrapper.description = descriptionState.description;
			const reference = codeModeExecDescriptionTargets.get(wrapper)?.reference ?? new WeakRef(wrapper);
			descriptionState.targets.add(reference);
			codeModeExecDescriptionTargets.set(wrapper, {
				state: descriptionState,
				reference
			});
		}
	}
}
/** Keep catalog updates synchronized across every live exec definition and wrapper. */
function createCodeModeExecDescriptionUpdater(tool) {
	const initialDescription = tool.description;
	const toolReference = codeModeExecDescriptionTargets.get(tool)?.reference ?? new WeakRef(tool);
	const state = {
		description: initialDescription,
		targets: /* @__PURE__ */ new Set([toolReference])
	};
	codeModeExecDescriptionTargets.set(tool, {
		state,
		reference: toolReference
	});
	return {
		update(description) {
			state.description = description;
			for (const reference of state.targets) {
				const target = reference.deref();
				if (target) target.description = description;
				else state.targets.delete(reference);
			}
		},
		dispose: () => state.targets.clear()
	};
}
/** Return whether a tool was marked as code-mode owned. */
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
/** Build before-tool-call metadata for a marked code-mode exec tool. */
function getCodeModeExecBeforeHookMetadata(params) {
	if (!isCodeModeExecTool(params.tool)) return;
	const toolInputKind = resolveCodeModeExecToolInputKind(params.params);
	return {
		toolKind: CODE_MODE_EXEC_TOOL_KIND,
		...toolInputKind && { toolInputKind }
	};
}
/** Build before-tool-call metadata when only the tool kind is available. */
function getCodeModeExecBeforeHookMetadataForToolKind(params) {
	if (params.toolKind !== CODE_MODE_EXEC_TOOL_KIND) return;
	const toolInputKind = resolveCodeModeExecToolInputKind(params.params);
	return {
		toolKind: CODE_MODE_EXEC_TOOL_KIND,
		...toolInputKind && { toolInputKind }
	};
}
/** Normalize before-hook params for a marked code-mode exec tool. */
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
	if (adjustedCommandChanged) return {
		...params.adjustedParams,
		code: adjustedCommand
	};
	return params.adjustedParams;
}
//#endregion
export { getCodeModeExecBeforeHookMetadata as a, isCodeModeExecTool as c, reconcileCodeModeExecBeforeHookParams as d, resolveCodeModeExecToolInputKind as f, createCodeModeExecDescriptionUpdater as i, markCodeModeControlTool as l, CODE_MODE_WAIT_TOOL_NAME as n, getCodeModeExecBeforeHookMetadataForToolKind as o, copyCodeModeControlToolIdentity as r, isCodeModeControlTool as s, CODE_MODE_EXEC_TOOL_NAME as t, normalizeCodeModeExecBeforeHookParams as u };
