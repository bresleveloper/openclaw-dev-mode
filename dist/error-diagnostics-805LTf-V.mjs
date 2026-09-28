import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
//#region src/infra/error-diagnostics.ts
const diagnostics = /* @__PURE__ */ new WeakMap();
/** Attach operator diagnostics; callers must mask opaque credentials before attachment. */
function attachErrorDiagnostic(error, diagnostic) {
	diagnostics.set(error, sliceUtf16Safe(redactSensitiveText(diagnostic, { mode: "tools" }), 0, 2048).trim());
	return error;
}
function findErrorDiagnostic(error) {
	for (const candidate of collectNestedErrorCandidates(error)) {
		const diagnostic = candidate && typeof candidate === "object" ? diagnostics.get(candidate) : void 0;
		if (diagnostic) return diagnostic;
	}
}
/** Preserve display metadata when an owner must clone a typed failure. */
function copyErrorDiagnostic(source, target) {
	const diagnostic = findErrorDiagnostic(source);
	if (diagnostic) diagnostics.set(target, diagnostic);
}
/** Terminal display only. Never classify this text or use it to decide retries. */
function formatErrorMessageForDisplay(error, message = formatErrorMessage(error)) {
	const diagnostic = findErrorDiagnostic(error);
	return diagnostic ? `${message}\n${diagnostic}` : message;
}
//#endregion
export { copyErrorDiagnostic as n, formatErrorMessageForDisplay as r, attachErrorDiagnostic as t };
