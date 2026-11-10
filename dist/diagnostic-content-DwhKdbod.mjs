import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
//#region src/infra/diagnostic-content.ts
/** Maximum UTF-16 code units retained for one captured diagnostic content field. */
const MAX_DIAGNOSTIC_CONTENT_CHARS = 131072;
function truncateDiagnosticContent(value) {
	return truncateUtf16Safe(redactSensitiveText(value), MAX_DIAGNOSTIC_CONTENT_CHARS);
}
function joinDiagnosticContent(parts, truncationSuffix = "") {
	const contentBudget = MAX_DIAGNOSTIC_CONTENT_CHARS - truncationSuffix.length;
	const redacted = redactSensitiveText(parts.filter((part) => part).join("\n"));
	if (!redacted) return;
	if (redacted.length <= contentBudget) return redacted;
	return `${truncateUtf16Safe(redacted, contentBudget)}${truncationSuffix}`;
}
//#endregion
export { truncateDiagnosticContent as n, joinDiagnosticContent as t };
