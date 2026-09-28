import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { c as redactLogRecordForTransport, q as readLoggingConfig } from "./redact-B5EGyLvV.mjs";
import { n as formatTimestamp } from "./timestamps-tLN31L4a.mjs";
import { stripVTControlCharacters } from "node:util";
//#region src/logging/json-console-line.ts
function formatJsonConsoleLine(params) {
	const envelope = {
		...params.meta,
		time: formatTimestamp(/* @__PURE__ */ new Date(), { style: "long" }),
		level: params.level,
		...params.subsystem ? { subsystem: params.subsystem } : {},
		message: params.message
	};
	return JSON.stringify(redactLogRecordForTransport(envelope, { format: "console" }));
}
/** Formats diagnostics that must bypass console capture without bypassing JSON console style. */
function formatConsoleDiagnosticLine(params) {
	return (loggingState.overrideSettings?.consoleStyle ?? readLoggingConfig()?.consoleStyle) === "json" ? formatJsonConsoleLine(params) : params.message;
}
/** Preserves human diagnostic blocks while serializing the whole block as one JSONL record. */
function formatConsoleDiagnosticBlock(params) {
	if ((loggingState.overrideSettings?.consoleStyle ?? readLoggingConfig()?.consoleStyle) !== "json") return params.message;
	const trailingNewline = params.message.endsWith("\n") ? "\n" : "";
	return `${formatJsonConsoleLine({
		level: params.level,
		message: stripVTControlCharacters(params.message).trimEnd()
	})}${trailingNewline}`;
}
//#endregion
export { formatConsoleDiagnosticLine as n, formatJsonConsoleLine as r, formatConsoleDiagnosticBlock as t };
