import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { C as resolveRedactOptions, _ as redactSensitiveText, n as computeSensitiveRedactionBitmap } from "./redact-B5EGyLvV.mjs";
//#region src/infra/exec-approval-text-sanitize.ts
const EXEC_APPROVAL_INVISIBLE_CHAR_REGEX = /[\p{Cc}\p{Cf}\p{Cs}\p{Zl}\p{Zp}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0]/gu;
const EXEC_APPROVAL_INVISIBLE_CHAR_SINGLE = /^[\p{Cc}\p{Cf}\p{Cs}\p{Zl}\p{Zp}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0]$/u;
const EXEC_APPROVAL_MAX_INPUT = 262144;
const EXEC_APPROVAL_MAX_OUTPUT = 16384;
const EXEC_APPROVAL_TRUNCATION_MARKER = "…[truncated]";
const EXEC_APPROVAL_OVERSIZED_MARKER = "[exec approval command exceeds display size limit; full text suppressed]";
const EXEC_APPROVAL_WARNING_OVERSIZED_MARKER = "[exec approval warning exceeds display size limit; full text suppressed]";
const BYPASS_MASK = "***";
function formatCodePointEscape(char) {
	return `\\u{${char.codePointAt(0)?.toString(16).toUpperCase() ?? "FFFD"}}`;
}
function normalizeDisplayLineBreaks(text) {
	return text.replace(/\r\n?/g, "\n").replace(/[\u2028\u2029]/g, "\n");
}
function escapeInvisibles(text, options) {
	return text.replace(EXEC_APPROVAL_INVISIBLE_CHAR_REGEX, (char) => options?.preserveLineBreaks && char === "\n" ? "\n" : formatCodePointEscape(char));
}
function truncateForDisplay(text) {
	if (text.length <= EXEC_APPROVAL_MAX_OUTPUT) return {
		text,
		truncated: false,
		oversized: false
	};
	return {
		text: truncateUtf16Safe(text, EXEC_APPROVAL_MAX_OUTPUT) + EXEC_APPROVAL_TRUNCATION_MARKER,
		truncated: true,
		oversized: false
	};
}
function buildStrippedView(original) {
	const strippedChars = [];
	const strippedToOrig = [];
	let offset = 0;
	for (const cp of original) {
		if (!EXEC_APPROVAL_INVISIBLE_CHAR_SINGLE.test(cp)) {
			strippedChars.push(cp);
			for (let k = 0; k < cp.length; k++) strippedToOrig.push(offset + k);
		}
		offset += cp.length;
	}
	return {
		stripped: strippedChars.join(""),
		strippedToOrig
	};
}
function sanitizeExecApprovalDisplayTextInternal(commandText, options) {
	if (commandText.length > EXEC_APPROVAL_MAX_INPUT) return {
		text: options?.oversizedMarker ?? EXEC_APPROVAL_OVERSIZED_MARKER,
		truncated: false,
		oversized: true
	};
	const rawRedacted = redactSensitiveText(commandText, { mode: "tools" });
	if (commandText.search(EXEC_APPROVAL_INVISIBLE_CHAR_REGEX) === -1) return truncateForDisplay(escapeInvisibles(rawRedacted, options));
	const { stripped, strippedToOrig } = buildStrippedView(commandText);
	if (redactSensitiveText(stripped, { mode: "tools" }) === stripped) return truncateForDisplay(escapeInvisibles(rawRedacted, options));
	const redaction = resolveRedactOptions({ mode: "tools" });
	const rawMask = computeSensitiveRedactionBitmap(commandText, redaction);
	const strippedMask = computeSensitiveRedactionBitmap(stripped, redaction);
	let bypassDetected = false;
	for (let i = 0; i < strippedMask.length; i++) if (strippedMask[i] && !rawMask[expectDefined(strippedToOrig[i], "stripped to orig entry at i")]) {
		bypassDetected = true;
		break;
	}
	if (!bypassDetected) return truncateForDisplay(escapeInvisibles(rawRedacted, options));
	const unionMask = rawMask.slice();
	for (let i = 0; i < strippedMask.length; i++) if (strippedMask[i]) unionMask[expectDefined(strippedToOrig[i], "stripped to orig entry at i")] = true;
	let out = "";
	let i = 0;
	while (i < commandText.length) {
		if (unionMask[i]) {
			let j = i;
			while (j < commandText.length && unionMask[j]) j++;
			out += BYPASS_MASK;
			i = j;
			continue;
		}
		const codePoint = commandText.codePointAt(i) ?? 65533;
		const cp = String.fromCodePoint(codePoint);
		out += options?.preserveLineBreaks && cp === "\n" ? cp : EXEC_APPROVAL_INVISIBLE_CHAR_SINGLE.test(cp) ? formatCodePointEscape(cp) : cp;
		i += cp.length;
	}
	return truncateForDisplay(out);
}
/** Sanitizes exec command text for approval UI without exposing status metadata. */
function sanitizeExecApprovalDisplayText(commandText) {
	return sanitizeExecApprovalDisplayTextInternal(commandText).text;
}
/**
* Sanitizes exec command text for approval UI and reports whether size caps changed it.
*/
function sanitizeExecApprovalDisplayTextWithStatus(commandText) {
	return sanitizeExecApprovalDisplayTextInternal(commandText);
}
/**
* Sanitizes warning prose for approval UI while preserving real line boundaries.
*/
function sanitizeExecApprovalWarningText(warningText) {
	return sanitizeExecApprovalWarningTextWithStatus(warningText).text;
}
/** Sanitizes warning prose and reports whether display bounds suppressed any content. */
function sanitizeExecApprovalWarningTextWithStatus(warningText) {
	return sanitizeExecApprovalDisplayTextInternal(normalizeDisplayLineBreaks(warningText), {
		preserveLineBreaks: true,
		oversizedMarker: EXEC_APPROVAL_WARNING_OVERSIZED_MARKER
	});
}
/** Checks the existing approval code-point cap without materializing every character. */
function exceedsApprovalTextLimit(value, maxLength) {
	if (value.length <= maxLength) return false;
	if (value.length > maxLength * 2) return true;
	let remaining = maxLength;
	for (const _ of value) if (--remaining < 0) return true;
	return false;
}
//#endregion
export { sanitizeExecApprovalWarningTextWithStatus as a, sanitizeExecApprovalWarningText as i, sanitizeExecApprovalDisplayText as n, sanitizeExecApprovalDisplayTextWithStatus as r, exceedsApprovalTextLimit as t };
