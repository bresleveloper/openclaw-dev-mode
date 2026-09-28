import { n as sanitizeExecApprovalDisplayText } from "./exec-approval-text-sanitize-B7wKpPNH.mjs";
//#region src/infra/exec-approval-command-display.ts
function normalizePreview(commandText, commandPreview) {
	const previewRaw = commandPreview?.trim() ?? "";
	if (!previewRaw) return null;
	const preview = sanitizeExecApprovalDisplayText(previewRaw);
	if (preview === commandText) return null;
	return preview;
}
/** Resolves sanitized command and preview text for exec approval prompts. */
function resolveExecApprovalCommandDisplay(request) {
	const commandTextSource = request.command || (request.host === "node" && request.systemRunPlan ? request.systemRunPlan.commandText : "");
	const commandText = sanitizeExecApprovalDisplayText(commandTextSource);
	return {
		commandText,
		commandPreview: normalizePreview(commandText, request.commandPreview ?? (request.host === "node" ? request.systemRunPlan?.commandPreview ?? null : null))
	};
}
//#endregion
export { resolveExecApprovalCommandDisplay as t };
