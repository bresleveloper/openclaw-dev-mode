import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
//#region src/audit/audit-event-writer.errors.ts
function formatAuditWriterError(error) {
	return truncateUtf16Safe(redactSensitiveText(error instanceof Error ? error.message : String(error), { mode: "tools" }), 512);
}
function executionIdentityFailureMessage(error) {
	const message = error instanceof Error ? error.message : String(error);
	if (message.includes("audit identity key is missing") || message.includes("audit identity key is corrupt")) return "audit execution identity key unavailable";
	if (message.includes("execution identity context conflict")) return "audit execution identity context conflict";
	if (message.includes("execution identity recovery evidence unavailable")) return "audit execution identity recovery evidence unavailable";
	if (message.includes("admission envelope") || message.includes("admission work") || message.includes("admission token")) return "audit execution identity envelope rejected";
	return "audit execution identity persistence failed";
}
function formatAuditWriterRequestError(request, error) {
	if (request.type === "record-execution-identity") return executionIdentityFailureMessage(error);
	if (request.type === "record-execution-decision" || request.type === "record-execution-decision-work") return "audit execution decision rejected";
	return formatAuditWriterError(error);
}
//#endregion
export { formatAuditWriterRequestError as n, formatAuditWriterError as t };
