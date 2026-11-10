import { n as sanitizeExecApprovalDisplayText } from "./exec-approval-text-sanitize-pO0fnlnc.mjs";
//#region src/infra/exec-approval-command-display.ts
/** Resolves sanitized command and preview text for exec approval prompts. */
function resolveExecApprovalCommandDisplay(request) {
	const commandTextSource = request.command || (request.host === "node" && request.systemRunPlan ? request.systemRunPlan.commandText : "");
	const commandText = sanitizeExecApprovalDisplayText(commandTextSource);
	const previewRaw = (request.commandPreview ?? (request.host === "node" ? request.systemRunPlan?.commandPreview ?? null : null))?.trim() ?? "";
	const preview = previewRaw ? sanitizeExecApprovalDisplayText(previewRaw) : null;
	return {
		commandText,
		commandPreview: preview !== commandText ? preview : null
	};
}
//#endregion
export { resolveExecApprovalCommandDisplay as t };
