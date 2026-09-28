import { t as clearActiveProgressLine } from "./progress-line-DiTuCPbL.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { _ as redactSensitiveText, q as readLoggingConfig } from "./redact-B5EGyLvV.mjs";
import { t as isVerbose } from "./global-state-BAD7XgmL.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import { n as formatTimestamp } from "./timestamps-tLN31L4a.mjs";
import { r as formatJsonConsoleLine } from "./json-console-line-BEWeG-Rv.mjs";
import { r as normalizeLogLevel } from "./levels-qpAN12Fm.mjs";
import { i as getLogger, m as resolveEnvLogLevelOverride } from "./logger--ALOusOG.mjs";
import util from "node:util";
//#region src/logging/console.ts
function normalizeConsoleLevel(level) {
	if (isVerbose()) return "debug";
	if (!level && process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1") return "silent";
	return normalizeLogLevel(level, "info");
}
function normalizeConsoleStyle(style) {
	if (style === "compact" || style === "json" || style === "pretty") return style;
	if (!process.stdout.isTTY) return "compact";
	return "pretty";
}
function resolveConsoleSettings() {
	const envLevel = resolveEnvLogLevelOverride();
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1" && !isVerbose() && !envLevel && !loggingState.overrideSettings) return {
		level: "silent",
		style: normalizeConsoleStyle(void 0)
	};
	const cfg = loggingState.overrideSettings ?? readLoggingConfig();
	return {
		level: envLevel ?? normalizeConsoleLevel(cfg?.consoleLevel),
		style: normalizeConsoleStyle(cfg?.consoleStyle)
	};
}
function getConsoleSettings() {
	const cached = loggingState.cachedConsoleSettings;
	if (cached) return cached;
	const settings = resolveConsoleSettings();
	loggingState.cachedConsoleSettings = settings;
	return loggingState.cachedConsoleSettings;
}
function getResolvedConsoleSettings() {
	return getConsoleSettings();
}
function routeLogsToStderr() {
	loggingState.forceConsoleToStderr = true;
}
function setConsoleSubsystemFilter(filters) {
	if (!filters || filters.length === 0) {
		loggingState.consoleSubsystemFilter = null;
		return;
	}
	const normalized = filters.map((value) => value.trim()).filter((value) => value.length > 0);
	loggingState.consoleSubsystemFilter = normalized.length > 0 ? normalized : null;
}
/** Hides subsystem console lines for TTY-owned work while preserving file logging. */
async function withConsoleSubsystemsSuppressed(work) {
	const previousFilter = loggingState.consoleSubsystemFilter ? [...loggingState.consoleSubsystemFilter] : null;
	setConsoleSubsystemFilter(["__openclaw_tui_quiet__"]);
	try {
		return await work();
	} finally {
		setConsoleSubsystemFilter(previousFilter);
	}
}
function setConsoleTimestampPrefix(enabled) {
	loggingState.consoleTimestampPrefix = enabled;
}
function normalizeConsoleSubsystem(subsystem) {
	if (typeof subsystem !== "string") return null;
	const normalized = subsystem.trim();
	return normalized.length > 0 ? normalized : null;
}
function shouldLogSubsystemToConsole(subsystem) {
	const filter = loggingState.consoleSubsystemFilter;
	if (!filter || filter.length === 0) return true;
	const normalizedSubsystem = normalizeConsoleSubsystem(subsystem);
	if (!normalizedSubsystem) return false;
	return filter.some((prefix) => normalizedSubsystem === prefix || normalizedSubsystem.startsWith(`${prefix}/`));
}
const SUPPRESSED_CONSOLE_PREFIXES = [
	"Closing session:",
	"Opening session:",
	"Removing old closed session:",
	"Session already closed",
	"Session already open"
];
const NODE_PROCESS_WARNING_PREFIX = `(${process.release.name}:${process.pid}) `;
function shouldSuppressConsoleMessage(message) {
	return SUPPRESSED_CONSOLE_PREFIXES.some((prefix) => message.startsWith(prefix));
}
function isEpipeError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
function formatConsoleTimestamp(style) {
	const now = /* @__PURE__ */ new Date();
	if (style === "pretty") return formatTimestamp(now, { style: "short" }).replace(/[+-]\d{2}:\d{2}$/, "");
	return formatTimestamp(now, { style: "long" });
}
function captureConsoleTraceStack(message, caller) {
	const trace = new Error(message);
	trace.name = "Trace";
	Error.captureStackTrace(trace, caller);
	return trace.stack === void 0 ? `Trace: ${message}` : typeof trace.stack === "string" ? trace.stack : util.format(trace.stack);
}
function hasTimestampPrefix(value) {
	return /^(?:\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)/.test(value);
}
function writeFormattedConsoleOutput(params) {
	const consoleStyle = getConsoleSettings().style;
	const trimmed = consoleStyle !== "json" && loggingState.consoleTimestampPrefix ? stripAnsi(params.formatted).trimStart() : "";
	const timestamp = trimmed && !hasTimestampPrefix(trimmed) ? formatConsoleTimestamp(consoleStyle) : "";
	const stack = params.level === "trace" && params.caller ? captureConsoleTraceStack(params.formatted, params.caller) : void 0;
	try {
		const rendered = consoleStyle === "json" ? formatJsonConsoleLine({
			level: params.level,
			message: stripAnsi(params.formatted),
			meta: stack === void 0 ? void 0 : { stack: stripAnsi(stack) }
		}) : redactSensitiveText(stack ?? params.formatted);
		const line = timestamp ? `${timestamp} ${rendered}` : rendered;
		clearActiveProgressLine();
		if (loggingState.forceConsoleToStderr) process.stderr.write(`${line}\n`);
		else if (consoleStyle !== "json" && !timestamp && params.args.length === 0 && stack === void 0) params.write.apply(console, params.args);
		else params.write.call(console, line);
	} catch (err) {
		if (isEpipeError(err)) return;
		throw err;
	}
}
/** Writes a root logger line to the pre-capture console sink without re-entering file capture. */
function writeRootConsoleLine(method, line) {
	const rawConsole = loggingState.rawConsole;
	if (!rawConsole) return false;
	if (shouldSuppressConsoleMessage(line)) return true;
	writeFormattedConsoleOutput({
		level: method === "error" ? "error" : "info",
		args: [line],
		formatted: line,
		write: rawConsole[method]
	});
	return true;
}
/**
* Route console.* calls through file logging while still emitting to stdout/stderr.
* This keeps user-facing output unchanged but guarantees every console call is captured in log files.
*/
function enableConsoleCapture() {
	if (loggingState.consolePatched) return;
	loggingState.consolePatched = true;
	if (!loggingState.streamErrorHandlersInstalled) {
		loggingState.streamErrorHandlersInstalled = true;
		for (const stream of [process.stdout, process.stderr]) stream.on("error", (err) => {
			if (isEpipeError(err)) {
				const exitCode = process.exitCode;
				process.exit(exitCode !== void 0 && exitCode !== 0 && exitCode !== "0" ? exitCode : 0);
				return;
			}
			throw err;
		});
	}
	const original = {
		log: console.log,
		info: console.info,
		warn: console.warn,
		error: console.error,
		debug: console.debug
	};
	loggingState.rawConsole = {
		log: original.log,
		info: original.info,
		warn: original.warn,
		error: original.error
	};
	const forward = (level, orig) => {
		const forwardedConsoleCall = (...args) => {
			const formatted = util.format(...args);
			let routedLevel = level;
			if (level === "error" && formatted.startsWith(NODE_PROCESS_WARNING_PREFIX) && typeof util.getCallSites === "function") {
				const caller = util.getCallSites(2, { sourceMap: false })[1];
				if (caller?.functionName === "writeOut" && caller.scriptName === "node:internal/process/warning") routedLevel = "warn";
			}
			if (shouldSuppressConsoleMessage(formatted)) return;
			try {
				getLogger()[routedLevel](formatted);
			} catch {}
			writeFormattedConsoleOutput({
				level: routedLevel,
				args,
				formatted,
				write: orig,
				caller: forwardedConsoleCall
			});
		};
		return forwardedConsoleCall;
	};
	console.log = forward("info", original.log);
	console.info = forward("info", original.info);
	console.warn = forward("warn", original.warn);
	console.error = forward("error", original.error);
	console.debug = forward("debug", original.debug);
	console.trace = forward("trace", original.error);
}
//#endregion
export { routeLogsToStderr as a, shouldLogSubsystemToConsole as c, getResolvedConsoleSettings as i, withConsoleSubsystemsSuppressed as l, formatConsoleTimestamp as n, setConsoleSubsystemFilter as o, getConsoleSettings as r, setConsoleTimestampPrefix as s, enableConsoleCapture as t, writeRootConsoleLine as u };
