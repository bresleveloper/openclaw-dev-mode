import { h as readNonEmptyStringPreservingWhitespace } from "./string-coerce-CIXf7egm.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import "./plugin-approvals-DV5u4TwS.mjs";
import { d as truncateRelayText } from "./native-hook-relay-utils-CJDlPOtO.mjs";
//#region src/agents/harness/native-hook-relay-approval-presentation.ts
function formatNativeHookRelayApprovalPresentation(request) {
	return formatHarnessApprovalPresentation({
		title: `${nativeHookRelayProviderDisplayName(request.provider)} permission request`,
		description: formatPermissionApprovalDescription(request)
	});
}
function formatPermissionApprovalDescription(request) {
	return [
		`Tool: ${sanitizeApprovalText(request.toolName)}`,
		request.cwd ? `Cwd: ${sanitizeApprovalText(request.cwd)}` : void 0,
		request.model ? `Model: ${sanitizeApprovalText(request.model)}` : void 0,
		formatToolInputPreview(request.toolInput)
	].filter((line) => Boolean(line)).join("\n");
}
function formatToolInputPreview(toolInput) {
	const command = readNonEmptyStringPreservingWhitespace(toolInput.command);
	if (command) return `Command: ${truncateRelayText(sanitizeApprovalText(command), 240)}`;
	const keys = Object.keys(toolInput).map(sanitizeApprovalText).filter(Boolean).toSorted();
	if (!keys.length) return;
	return `Input keys: ${keys.slice(0, 12).join(", ")}${keys.length > 12 ? ` (${keys.length - 12} omitted)` : ""}`;
}
function sanitizeApprovalText(value) {
	let sanitized = "";
	for (const char of stripAnsi(value)) {
		const codePoint = char.codePointAt(0);
		sanitized += codePoint != null && isUnsafeApprovalCodePoint(codePoint) ? " " : char;
	}
	return sanitized.replace(/\s+/g, " ").trim();
}
function isUnsafeApprovalCodePoint(codePoint) {
	return codePoint >= 0 && codePoint <= 8 || codePoint === 11 || codePoint === 12 || codePoint >= 14 && codePoint <= 31 || codePoint >= 127 && codePoint <= 159 || codePoint >= 8234 && codePoint <= 8238 || codePoint >= 8294 && codePoint <= 8297;
}
function nativeHookRelayProviderDisplayName(provider) {
	return provider === "codex" ? "Codex" : provider;
}
function formatHarnessApprovalPresentation(input) {
	return {
		title: truncateRelayText(sanitizeApprovalText(input.title), 80),
		description: truncateRelayText(input.description.split("\n").map(sanitizeApprovalText).join("\n"), 512)
	};
}
//#endregion
export { formatNativeHookRelayApprovalPresentation as n, formatPermissionApprovalDescription as r, formatHarnessApprovalPresentation as t };
