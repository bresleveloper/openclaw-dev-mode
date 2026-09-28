import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as clearActiveProgressLine } from "./progress-line-DiTuCPbL.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { _ as redactSensitiveText, c as redactLogRecordForTransport } from "./redact-B5EGyLvV.mjs";
import { t as isVerbose } from "./global-state-BAD7XgmL.mjs";
import { G as hasInternalDiagnosticEventInterest, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { r as formatJsonConsoleLine } from "./json-console-line-BEWeG-Rv.mjs";
import { n as levelToMinLevel } from "./levels-qpAN12Fm.mjs";
import { o as isFileLogLevelEnabled, r as getChildLogger } from "./logger--ALOusOG.mjs";
import { c as shouldLogSubsystemToConsole, n as formatConsoleTimestamp, r as getConsoleSettings } from "./console-DwqfhE-H.mjs";
import { Chalk } from "chalk";
//#region src/logging/subsystem.ts
function normalizeSubsystemLabel(subsystem) {
	if (typeof subsystem !== "string") return "unknown";
	const normalized = subsystem.trim();
	return normalized.length > 0 ? normalized : "unknown";
}
function shouldLogToConsole(level, settings) {
	if (level === "silent") return false;
	if (settings.level === "silent") return false;
	return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
const inspectValue = (() => {
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") return null;
	try {
		const utilNamespace = getBuiltinModule("util");
		return typeof utilNamespace.inspect === "function" ? utilNamespace.inspect : null;
	} catch {
		return null;
	}
})();
function formatRuntimeArg(arg) {
	if (typeof arg === "string") return arg;
	if (inspectValue) return inspectValue(arg);
	try {
		return JSON.stringify(arg);
	} catch {
		return String(arg);
	}
}
function isRichConsoleEnv() {
	const term = normalizeLowercaseStringOrEmpty(process.env.TERM);
	if (process.env.COLORTERM || process.env.TERM_PROGRAM) return true;
	return term.length > 0 && term !== "dumb";
}
const consoleColors = [];
function getColorForConsole() {
	const level = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0" || !process.env.NO_COLOR && (process.stdout.isTTY || process.stderr.isTTY || isRichConsoleEnv()) ? 1 : 0;
	return consoleColors[level] ??= new Chalk({ level });
}
const SUBSYSTEM_COLORS = [
	"cyan",
	"green",
	"yellow",
	"blue",
	"magenta",
	"red"
];
const SUBSYSTEM_COLOR_OVERRIDES = /* @__PURE__ */ new Map([["gmail-watcher", "blue"]]);
const SUBSYSTEM_PREFIXES_TO_DROP = [
	"gateway",
	"channels",
	"providers"
];
const SUBSYSTEM_MAX_SEGMENTS = 2;
const CHANNEL_SUBSYSTEM_PREFIXES = /* @__PURE__ */ new Set([
	"clickclack",
	"discord",
	"feishu",
	"googlechat",
	"imessage",
	"irc",
	"line",
	"matrix",
	"mattermost",
	"msteams",
	"nextcloud-talk",
	"nostr",
	"openclaw-weixin",
	"qqbot",
	"signal",
	"slack",
	"synology-chat",
	"telegram",
	"tlon",
	"twitch",
	"webchat",
	"wecom",
	"whatsapp",
	"yuanbao",
	"zalo",
	"zalouser"
]);
function isChannelSubsystemPrefix(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (!normalized) return false;
	return CHANNEL_SUBSYSTEM_PREFIXES.has(normalized);
}
function pickSubsystemColor(subsystem) {
	const override = SUBSYSTEM_COLOR_OVERRIDES.get(subsystem);
	if (override) return override;
	let hash = 0;
	for (let i = 0; i < subsystem.length; i += 1) hash = hash * 31 + subsystem.charCodeAt(i) | 0;
	const idx = Math.abs(hash) % SUBSYSTEM_COLORS.length;
	return expectDefined(SUBSYSTEM_COLORS[idx], "subsystem colors entry at idx");
}
function formatSubsystemForConsole(subsystem) {
	const parts = subsystem.split("/").filter(Boolean);
	const original = parts.join("/") || subsystem;
	while (parts.length > 0) {
		const first = parts.at(0);
		if (first === void 0 || !SUBSYSTEM_PREFIXES_TO_DROP.includes(first)) break;
		parts.shift();
	}
	const first = parts.at(0);
	if (first === void 0) return original;
	if (isChannelSubsystemPrefix(first)) return first;
	if (parts.length > SUBSYSTEM_MAX_SEGMENTS) return parts.slice(-2).join("/");
	return parts.join("/");
}
function stripRedundantSubsystemPrefixForConsole(message, displaySubsystem) {
	if (!displaySubsystem) return message;
	if (message.startsWith("[")) {
		const closeIdx = message.indexOf("]");
		if (closeIdx > 1) {
			const bracketTag = message.slice(1, closeIdx);
			if (normalizeLowercaseStringOrEmpty(bracketTag) === normalizeLowercaseStringOrEmpty(displaySubsystem)) {
				let i = closeIdx + 1;
				while (message[i] === " ") i += 1;
				return message.slice(i);
			}
		}
	}
	const prefix = message.slice(0, displaySubsystem.length);
	if (normalizeLowercaseStringOrEmpty(prefix) !== normalizeLowercaseStringOrEmpty(displaySubsystem)) return message;
	const next = message.slice(displaySubsystem.length, displaySubsystem.length + 1);
	if (next !== ":" && next !== " ") return message;
	let i = displaySubsystem.length;
	while (message[i] === " ") i += 1;
	if (message[i] === ":") i += 1;
	while (message[i] === " ") i += 1;
	return message.slice(i);
}
function createConsoleLineFormatter(subsystem) {
	const displaySubsystem = formatSubsystemForConsole(subsystem);
	const prefix = `[${displaySubsystem}]`;
	const prefixColor = pickSubsystemColor(displaySubsystem);
	return (level, message, style) => {
		const color = getColorForConsole();
		const levelColor = level === "error" || level === "fatal" ? color.red : level === "warn" ? color.yellow : level === "debug" || level === "trace" ? color.gray : color.cyan;
		const displayMessage = stripRedundantSubsystemPrefixForConsole(redactSensitiveText(message), displaySubsystem);
		const time = style === "pretty" || loggingState.consoleTimestampPrefix ? color.gray(formatConsoleTimestamp(style)) : "";
		const prefixToken = color[prefixColor](prefix);
		return `${time ? `${time} ${prefixToken}` : prefixToken} ${levelColor(displayMessage)}`;
	};
}
function writeConsoleLine(level, line, opts = {}) {
	clearActiveProgressLine();
	const sanitized = process.platform === "win32" && process.env.GITHUB_ACTIONS === "true" ? line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?").replace(/[\uD800-\uDFFF]/g, "?") : line;
	const redacted = opts.redacted ? sanitized : redactSensitiveText(sanitized);
	const sink = loggingState.rawConsole ?? console;
	if (loggingState.forceConsoleToStderr || level === "error" || level === "fatal") (sink.error ?? console.error)(redacted);
	else if (level === "warn") (sink.warn ?? console.warn)(redacted);
	else (sink.log ?? console.log)(redacted);
}
function shouldSuppressProbeConsoleLine(params) {
	if (isVerbose()) return false;
	if (params.level === "error" || params.level === "fatal") return false;
	const message = typeof params.message === "string" ? params.message : "";
	if (!params.suppressProbeMessages) return false;
	if ((typeof params.meta?.runId === "string" ? params.meta.runId : typeof params.meta?.sessionId === "string" ? params.meta.sessionId : void 0)?.startsWith("probe-")) return true;
	return /(sessionId|runId)=probe-/.test(message);
}
const CONSOLE_META_LEVELS = /* @__PURE__ */ new Set([
	"warn",
	"error",
	"fatal"
]);
const CONSOLE_META_MAX_CHARS = 2048;
function formatConsoleMetaValue(value) {
	if (value === void 0) return;
	if (typeof value === "string") return /\s|=/.test(value) || value.length === 0 ? JSON.stringify(value) : value;
	if (value === null || typeof value === "number" || typeof value === "boolean") return String(value);
	return JSON.stringify(value);
}
/** Keeps an Error's message, which a JSON round-trip would otherwise reduce to `{}`. */
function prepareConsoleMetaRecord(meta) {
	let prepared;
	for (const [key, value] of Object.entries(meta)) if (value instanceof Error) {
		prepared ??= { ...meta };
		prepared[key] = value.message;
	}
	return prepared ?? meta;
}
/**
* Renders structured fields as one compact `key=value` tail so warn/error/fatal
* records keep their diagnostics in plain-text sinks such as journald, which only
* see the console line. The JSON console style and the file sink carry the same
* fields natively, so only plain styles call this.
*
* Fields pass through the shared console transport redactor before flattening, so
* key-aware protection such as `apiToken` survives the loss of structure and the
* length cap can only clip text that is already masked. That redactor also owns
* circular references, bigints, and values with no JSON form, and returns parsed
* data, so rendering a value here cannot re-enter a stateful `toJSON`.
*/
function formatConsoleMeta(meta) {
	let redacted;
	try {
		redacted = redactLogRecordForTransport(prepareConsoleMetaRecord(meta), { format: "console" });
	} catch {
		return "";
	}
	const parts = [];
	for (const [key, value] of Object.entries(redacted)) {
		const rendered = formatConsoleMetaValue(value);
		if (rendered !== void 0) parts.push(`${key}=${rendered}`);
	}
	const joined = parts.join(" ");
	return joined.length > CONSOLE_META_MAX_CHARS ? `${joined.slice(0, CONSOLE_META_MAX_CHARS)}...(truncated)` : joined;
}
function logToFile(fileLogger, level, message, meta) {
	if (level === "silent") return;
	if (meta && Object.keys(meta).length > 0) fileLogger[level](meta, message);
	else fileLogger[level](message);
}
function createSubsystemLogger(subsystem) {
	const resolvedSubsystem = normalizeSubsystemLabel(subsystem);
	const suppressProbeMessages = resolvedSubsystem === "agent/embedded" || resolvedSubsystem.startsWith("agent/embedded/") || resolvedSubsystem === "model-fallback" || resolvedSubsystem.startsWith("model-fallback/");
	let fileChild;
	let fileChildWithoutStack;
	let formatConsoleLine;
	const getFileLogger = (level) => {
		fileChild ??= getChildLogger({ subsystem: resolvedSubsystem });
		if (level === "error" || level === "fatal" || areDiagnosticsEnabledForProcess() && hasInternalDiagnosticEventInterest("log.record")) return fileChild;
		if (!fileChildWithoutStack) {
			fileChildWithoutStack = fileChild.getSubLogger({ stack: { capture: "off" } });
			fileChildWithoutStack.settings.parentNames = fileChild.settings.parentNames;
		}
		return fileChildWithoutStack;
	};
	const emitLog = (level, message, meta) => {
		const consoleSettings = getConsoleSettings();
		const consoleEnabled = shouldLogToConsole(level, { level: consoleSettings.level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
		const fileEnabled = isFileLogLevelEnabled(level);
		if (!consoleEnabled && !fileEnabled) return;
		let consoleMessageOverride;
		let fileMeta = meta;
		if (meta && Object.keys(meta).length > 0) {
			const { consoleMessage, ...rest } = meta;
			if (typeof consoleMessage === "string") consoleMessageOverride = consoleMessage;
			fileMeta = Object.keys(rest).length > 0 ? rest : void 0;
		}
		if (fileEnabled) logToFile(getFileLogger(level), level, message, fileMeta);
		if (!consoleEnabled) return;
		const consoleMeta = consoleSettings.style !== "json" && consoleMessageOverride === void 0 && fileMeta && CONSOLE_META_LEVELS.has(level) ? formatConsoleMeta(fileMeta) : "";
		const consoleMessage = consoleMessageOverride ?? (consoleMeta ? `${message} ${consoleMeta}` : message);
		if (shouldSuppressProbeConsoleLine({
			level,
			suppressProbeMessages,
			message: consoleMessage,
			meta: fileMeta
		})) return;
		writeConsoleLine(level, consoleSettings.style === "json" ? formatJsonConsoleLine({
			level,
			subsystem: resolvedSubsystem,
			message,
			meta: fileMeta
		}) : (formatConsoleLine ??= createConsoleLineFormatter(resolvedSubsystem))(level, consoleMessage, consoleSettings.style), { redacted: true });
	};
	return {
		subsystem: resolvedSubsystem,
		isEnabled(level, target = "any") {
			const isConsoleEnabled = shouldLogToConsole(level, { level: getConsoleSettings().level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
			const isFileEnabled = isFileLogLevelEnabled(level);
			if (target === "console") return isConsoleEnabled;
			if (target === "file") return isFileEnabled;
			return isConsoleEnabled || isFileEnabled;
		},
		trace(message, meta) {
			emitLog("trace", message, meta);
		},
		debug(message, meta) {
			emitLog("debug", message, meta);
		},
		info(message, meta) {
			emitLog("info", message, meta);
		},
		warn(message, meta) {
			emitLog("warn", message, meta);
		},
		error(message, meta) {
			emitLog("error", message, meta);
		},
		fatal(message, meta) {
			emitLog("fatal", message, meta);
		},
		raw(message) {
			if (isFileLogLevelEnabled("info")) logToFile(getFileLogger("info"), "info", message, { raw: true });
			const consoleSettings = getConsoleSettings();
			if (shouldLogToConsole("info", { level: consoleSettings.level }) && shouldLogSubsystemToConsole(resolvedSubsystem)) {
				if (shouldSuppressProbeConsoleLine({
					level: "info",
					suppressProbeMessages,
					message
				})) return;
				writeConsoleLine("info", consoleSettings.style === "json" ? formatJsonConsoleLine({
					level: "info",
					subsystem: resolvedSubsystem,
					message
				}) : message, { redacted: consoleSettings.style === "json" });
			}
		},
		child(name) {
			return createSubsystemLogger(`${resolvedSubsystem}/${name}`);
		}
	};
}
function runtimeForLogger(logger, exit = defaultRuntime.exit) {
	return {
		log(...args) {
			logger.info(args.map((arg) => formatRuntimeArg(arg)).join(" ").trim());
		},
		error(...args) {
			logger.error(args.map((arg) => formatRuntimeArg(arg)).join(" ").trim());
		},
		writeStdout(value) {
			logger.info(value);
		},
		writeJson(value, space = 2) {
			logger.info(JSON.stringify(value, void 0, space > 0 ? space : void 0));
		},
		exit
	};
}
function createSubsystemRuntime(subsystem, exit = defaultRuntime.exit) {
	return runtimeForLogger(createSubsystemLogger(subsystem), exit);
}
//#endregion
export { stripRedundantSubsystemPrefixForConsole as i, createSubsystemRuntime as n, runtimeForLogger as r, createSubsystemLogger as t };
