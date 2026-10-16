import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as stripAnsi, n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { i as isSensitiveUrlQueryParamName } from "./redact-sensitive-url-BnHakqqk.mjs";
import { B as parseRedactPatternSource, R as AWS_SECRET_ACCESS_KEY_MATCHER, V as replaceRedactPattern, _ as redactSensitiveText, v as redactText, z as VENDOR_TOKEN_REDACT_PATTERNS } from "./redact-DJ8j6ADa.mjs";
import "./redact-sentinel-f_PhnHTI.mjs";
import { i as isSecretRefShape } from "./redact-snapshot-Ds6C-7Ba.mjs";
import path from "node:path";
import { getSystemErrorMap } from "node:util";
import { valid } from "semver";
//#region src/logging/diagnostic-support-redaction.ts
const SECRET_SUPPORT_FIELD_RE = /(?:authorization|cookie|credential|key|password|passwd|secret|token)/iu;
const PAYLOAD_SUPPORT_FIELD_RE = /(?:body|chat|content|detail|error|header|instruction|message|payload|prompt|result|text|tool|transcript)/iu;
const IDENTIFIER_SUPPORT_FIELD_RE = /(?:account[-_]?id|chat[-_]?id|conversation[-_]?id|email|message[-_]?id|phone|thread[-_]?id|user[-_]?id|username)/iu;
const PRIVATE_MAP_SUPPORT_FIELD_RE = /^(?:accounts|chats|conversations|messages|threads|users)$/iu;
const CONFIG_PRIVATE_FIELD_RE = /(?:allow[-_]?from|allow[-_]?to|deny[-_]?from|deny[-_]?to|blocked[-_]?from|blocked[-_]?users|owner[-_]?id|sender[-_]?id|recipient[-_]?id)/iu;
const SENSITIVE_COMMAND_ARG_RE = /^--(?:aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey|api[-_]?key|hook[-_]?token|password|password-file|passwd|secret|token)(?:=.*)?$/iu;
const BASIC_AUTH_RE = /\bBasic\s+[A-Za-z0-9+/]+={0,2}/giu;
const COOKIE_HEADER_RE = /\b(Cookie|Set-Cookie)\s*:\s*[^\r\n]+/giu;
const AWS_ACCESS_KEY_ID_RE = /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/gu;
const vendorTokenPatterns = VENDOR_TOKEN_REDACT_PATTERNS.map((pattern) => new RegExp(...parseRedactPatternSource(pattern)));
const JWT_RE = /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/gu;
const URL_USERINFO_RE = /\b([a-z][a-z0-9+.-]*:\/\/)([^/@\s:?#]+)(?::([^/@\s?#]+))?@/giu;
const URL_PARAM_RE = /([?&])([^=&\s]+)=([^&#\s]+)/giu;
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu;
const MATRIX_USER_ID_RE = /@[A-Za-z0-9._=-]+:[A-Za-z0-9.-]+/gu;
const MATRIX_ROOM_ID_RE = /![A-Za-z0-9._=-]+:[A-Za-z0-9.-]+/gu;
const MATRIX_EVENT_ID_RE = /\$[A-Za-z0-9_-]{16,}/gu;
const HANDLE_RE = /(^|[^\w:/])@(?!openclaw\/[a-z0-9])[A-Za-z0-9_]{5,}\b(?!\.)/gu;
const LONG_DECIMAL_ID_RE = /\b\d{9,}\b/gu;
const MAX_SUPPORT_STRING_LENGTH = 2e3;
const MAX_SUPPORT_SNAPSHOT_DEPTH = 10;
const MAX_SUPPORT_ARRAY_ITEMS = 1e3;
const MAX_SUPPORT_OBJECT_ENTRIES = 1e3;
const DEFAULT_TRUNCATION_SUFFIX = "...<truncated>";
const TRUNCATED_SUPPORT_FIELD = "<truncated>";
function isPrivateSupportField(key) {
	return SECRET_SUPPORT_FIELD_RE.test(key) || PAYLOAD_SUPPORT_FIELD_RE.test(key) || IDENTIFIER_SUPPORT_FIELD_RE.test(key);
}
function sanitizeSecretRefForSupport(value) {
	const sanitized = createSupportRecord();
	if (typeof value.source === "string") sanitized.source = value.source;
	if (typeof value.provider === "string") sanitized.provider = value.provider;
	sanitized.id = "<redacted>";
	return sanitized;
}
function privateMapEntryLabel(key) {
	const normalized = key.toLowerCase();
	return normalized.endsWith("s") ? normalized.slice(0, -1) : normalized;
}
function createSupportRecord() {
	return Object.create(null);
}
function countOwnObjectEntries(record) {
	let count = 0;
	for (const key in record) if (Object.hasOwn(record, key)) count += 1;
	return count;
}
function limitedSupportObjectEntries(record) {
	let count = 0;
	const entries = [];
	for (const key in record) {
		if (!Object.hasOwn(record, key)) continue;
		count += 1;
		if (isBlockedObjectKey(key) || entries.length >= MAX_SUPPORT_OBJECT_ENTRIES) continue;
		entries.push({
			key,
			value: record[key]
		});
	}
	entries.sort((a, b) => a.key.localeCompare(b.key));
	return {
		count,
		entries
	};
}
function addTruncationMetadata(sanitized, count) {
	if (count > MAX_SUPPORT_OBJECT_ENTRIES) sanitized[TRUNCATED_SUPPORT_FIELD] = {
		truncated: true,
		count,
		limit: MAX_SUPPORT_OBJECT_ENTRIES
	};
}
function supportArrayResult(items, count) {
	if (count <= MAX_SUPPORT_ARRAY_ITEMS) return items;
	return {
		items,
		truncated: true,
		count,
		limit: MAX_SUPPORT_ARRAY_ITEMS
	};
}
function isWindowsAbsolutePath(value) {
	return /^(?:[A-Za-z]:[\\/]|\\\\)/u.test(value);
}
function pathRedactionPrefixes(options) {
	const prefixes = /* @__PURE__ */ new Map();
	for (const [value, label] of [
		[options.stateDir, "$OPENCLAW_STATE_DIR"],
		[options.env.HOME, "~"],
		[options.env.USERPROFILE, "~"]
	]) {
		if (!value) continue;
		const normalized = isWindowsAbsolutePath(value) ? path.win32.resolve(value) : path.resolve(value);
		const caseInsensitive = isWindowsAbsolutePath(normalized);
		for (const prefix of caseInsensitive ? [normalized, normalized.replaceAll("\\", "/")] : [normalized]) if (!prefixes.has(prefix)) prefixes.set(prefix, {
			prefix,
			label,
			caseInsensitive
		});
	}
	return [...prefixes.values()].toSorted((a, b) => b.prefix.length - a.prefix.length);
}
function pathCandidates(file) {
	if (!isWindowsAbsolutePath(file)) return [path.resolve(file)];
	const resolved = path.win32.resolve(file);
	const candidates = [resolved, resolved.replaceAll("\\", "/")];
	const marker = WINDOWS_NAMESPACE_MARKER_RE.exec(file);
	if (marker) {
		const stripped = file.slice(marker[0].length);
		let unmarked;
		if (/^UNC[\\/]/iu.test(stripped)) unmarked = path.win32.resolve(`\\\\${stripped.slice(4)}`);
		else if (/^[A-Za-z]:[\\/]/u.test(stripped)) unmarked = path.win32.resolve(stripped);
		if (unmarked !== void 0) candidates.push(unmarked, unmarked.replaceAll("\\", "/"));
	}
	return candidates;
}
function hasPathPrefix(value, prefix) {
	return prefix.caseInsensitive ? value.toLowerCase().startsWith(prefix.prefix.toLowerCase()) : value.startsWith(prefix.prefix);
}
function matchPathPrefix(file, prefix) {
	if (file.length === prefix.prefix.length && hasPathPrefix(file, prefix)) return "";
	if (!hasPathPrefix(file, prefix)) return;
	const next = file[prefix.prefix.length];
	return next === "/" || next === "\\" ? file.slice(prefix.prefix.length) : void 0;
}
function isSupportAbsolutePath(value) {
	return path.isAbsolute(value) || isWindowsAbsolutePath(value);
}
function redactPathForSupport(file, options) {
	if (file == null || typeof file !== "string") return "";
	if (file.startsWith("$")) return file;
	const candidates = pathCandidates(file);
	const prefixes = pathRedactionPrefixes(options);
	for (const next of candidates) for (const prefix of prefixes) {
		const suffix = matchPathPrefix(next, prefix);
		if (suffix !== void 0) return `${prefix.label}${suffix}`;
	}
	return redactSensitiveText(candidates[0] ?? file, { mode: "tools" });
}
const WINDOWS_NAMESPACE_MARKER_RE = /^\\\\[?.][\\/]/u;
const WINDOWS_NAMESPACE_MARKER_LENGTH = 4;
function namespaceMarkerLengthBefore(value, endIndex) {
	const start = endIndex - WINDOWS_NAMESPACE_MARKER_LENGTH;
	if (start < 0) return 0;
	return WINDOWS_NAMESPACE_MARKER_RE.test(value.slice(start, endIndex)) ? WINDOWS_NAMESPACE_MARKER_LENGTH : 0;
}
function replaceKnownPathPrefix(value, prefix) {
	const search = prefix.caseInsensitive ? prefix.prefix.toLowerCase() : prefix.prefix;
	const haystack = prefix.caseInsensitive ? value.toLowerCase() : value;
	let offset = 0;
	let next = "";
	while (offset < value.length) {
		const index = haystack.indexOf(search, offset);
		if (index === -1) {
			next += value.slice(offset);
			break;
		}
		next += value.slice(offset, index - namespaceMarkerLengthBefore(value, index));
		next += prefix.label;
		offset = index + prefix.prefix.length;
	}
	return next;
}
function redactKnownPathPrefixesForSupport(value, redaction) {
	let next = value;
	for (const prefix of pathRedactionPrefixes(redaction)) next = replaceKnownPathPrefix(next, prefix);
	return next;
}
function redactTextForSupport(value) {
	const redacted = value.replace(BASIC_AUTH_RE, "Basic <redacted>").replace(COOKIE_HEADER_RE, "$1: <redacted>").replace(AWS_ACCESS_KEY_ID_RE, "<redacted-aws-key>").replace(JWT_RE, "<redacted-jwt>");
	const credentialsRedacted = replaceRedactPattern(redactText(redacted, vendorTokenPatterns, { fullContext: true }), AWS_SECRET_ACCESS_KEY_MATCHER, () => "<redacted-aws-secret-key>");
	return redactSensitiveText(credentialsRedacted, { mode: "tools" }).replace(URL_USERINFO_RE, (_match, scheme, _username, password) => password ? `${scheme}<redacted>:<redacted>@` : `${scheme}<redacted>@`).replace(URL_PARAM_RE, (match, prefix, key) => isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=<redacted>` : match).replace(MATRIX_USER_ID_RE, "<redacted-matrix-user>").replace(MATRIX_ROOM_ID_RE, "<redacted-matrix-room>").replace(MATRIX_EVENT_ID_RE, (eventId) => eventId === "$OPENCLAW_STATE_DIR" ? eventId : "<redacted-matrix-event>").replace(EMAIL_RE, "<redacted-email>").replace(HANDLE_RE, "$1<redacted-handle>").replace(LONG_DECIMAL_ID_RE, "<redacted-id>");
}
function redactSupportString(value, redaction, options = {}) {
	const maxLength = options.maxLength ?? MAX_SUPPORT_STRING_LENGTH;
	const truncationSuffix = options.truncationSuffix ?? DEFAULT_TRUNCATION_SUFFIX;
	const redacted = redactTextForSupport(value);
	const pathRedacted = isSupportAbsolutePath(redacted) ? redactPathForSupport(redacted, redaction) : redactKnownPathPrefixesForSupport(redacted, redaction);
	if (pathRedacted.length <= maxLength) return pathRedacted;
	return `${truncateUtf16Safe(pathRedacted, maxLength)}${truncationSuffix}`;
}
/** One diagnostic line; paths never expose private suffixes in public reports. */
function redactSupportDiagnosticLine(value, context, maxLength = 200) {
	const commandRedacted = redactSupportString(sanitizeForLog(stripAnsi(value).split(/[\r\n\u2028\u2029]/u).find((line) => line.trim()) ?? ""), context, { maxLength: Number.MAX_SAFE_INTEGER }).replace(/["'`]?(?:file:\/\/|\$OPENCLAW_STATE_DIR|(?:^|(?<=[\s=(:["'`]))(?:~[\\/]|[A-Za-z]:[\\/]|\/+|\\+)).*/gu, "[redacted-path]").replace(/\b(?:Command failed:|command (?:sh|cmd|powershell|bash)\b).*/giu, "[redacted-command]");
	const missingGlibc = /\bversion [`'"](GLIBC_\d{1,3}(?:\.\d{1,3}){1,2})['"] not found\b/u.exec(value)?.[1];
	const diagnostic = missingGlibc && !commandRedacted.includes(`${missingGlibc} not found`) ? `${missingGlibc} not found; ${commandRedacted.trim()}` : commandRedacted.trim();
	return truncateUtf16Safe(diagnostic, maxLength);
}
const PUBLIC_ERROR_CODES = /* @__PURE__ */ new Set([
	...Array.from(getSystemErrorMap().values(), ([code]) => code),
	"ENOTFOUND",
	"EOTP",
	"ERESOLVE",
	"E401",
	"E403",
	"E404",
	"ETARGET",
	"EUSAGE",
	"EOVERRIDE",
	"EINVALIDTAGNAME",
	"EUNSUPPORTEDPROTOCOL",
	"EBADENGINE",
	"EINTEGRITY",
	"CERT_HAS_EXPIRED",
	"UNABLE_TO_VERIFY_LEAF_SIGNATURE",
	"SELF_SIGNED_CERT_IN_CHAIN",
	"DEPTH_ZERO_SELF_SIGNED_CERT",
	"ERR_MODULE_NOT_FOUND",
	"ERR_PACKAGE_PATH_NOT_EXPORTED",
	"ERR_SQLITE_ERROR",
	"SQLITE_BUSY",
	"SQLITE_LOCKED",
	"SQLITE_READONLY",
	"SQLITE_IOERR",
	"SQLITE_FULL"
]);
/** Error-code syntax alone cannot distinguish private identifiers from known errors. */
function normalizeSupportDiagnosticErrorCode(value) {
	return value && PUBLIC_ERROR_CODES.has(value) ? value : void 0;
}
/** Custom SemVer labels can contain private project or host names. */
function redactPublicSupportVersion(version) {
	return version === "unknown" || version === "unspecified" || valid(version) && /^\d+\.\d+\.\d+(?:-(?:0|(?:alpha|beta|rc|dev)(?:\.\d{1,8})?))?$/u.test(version) ? version : "[redacted-version]";
}
/** Validation paths may include operator-defined keys at any depth. */
function redactPublicSupportConfigKey(value) {
	const anchor = /^(mcp\.servers|models\.providers|plugins\.entries|skills\.entries|auth\.profiles|cron\.jobs|agents\.list|hooks\.internal\.entries|engines\.node)(?:\.|$)/u.exec(value)?.[1] ?? /^(agents|auth|channels|commands|cron|engines|gateway|hooks|mcp|messages|models|plugins|session|skills|stateDir|tools)(?:\.|$)/u.exec(value)?.[1];
	return anchor ? value === anchor ? anchor : `${anchor}.*` : "[redacted-key]";
}
/** Public diagnostics expose recognized causes, never arbitrary prose or executable arguments. */
function redactPublicSupportDiagnosticLine(value, context) {
	const line = redactSupportDiagnosticLine(value, context);
	const packagePath = /^Package rollback entry "([A-Za-z0-9_@.+/-]{1,90})": fields=((?:added|removed|dev:ino|mode|uid|gid|nlink|size|mtimeNs|ctimeNs|target|sha256)(?:,(?:dev:ino|mode|uid|gid|nlink|size|mtimeNs|ctimeNs|target|sha256))*)$/u.exec(line)?.[1];
	if (packagePath && !packagePath.startsWith("/") && packagePath.split("/").every((part) => part !== ".." && (!part.includes("@") || part === "@openclaw"))) return line;
	if (line === "Invalid configuration field" || line === "Configuration could not be read.") return line;
	if (line.startsWith("System-scope Gateway package update cannot write its install root ")) return "System-scope Gateway package update cannot write its install root.";
	if ([
		"The npm global install layout cannot stage a candidate. Reinstall with npm into its default global layout, then retry the update.",
		"Cannot locate the installed updater; run `openclaw doctor` before retrying.",
		"Managed update handoff requires a user-scope systemd unit; perform a manual system-service update.",
		"managed update handoff requires a finite restart deadline",
		"systemd-run is required to launch a transient user scope",
		"managed update handoff process start identity is unavailable",
		"managed update handoff returned an invalid readiness response",
		"managed update handoff helper lease identity is unavailable",
		"managed update handoff control input closed",
		"managed update ownership transfer failed",
		"requester-revoked",
		"Doctor could not enter maintenance. An agent database is in use. Stop other OpenClaw processes using this state, then retry the update."
	].includes(line)) return line;
	const maintenance = /^(?:(?:Error|DoctorMaintenanceRefusalError): )?Doctor could not enter maintenance\.(?: Error: The update parent owns Gateway activation\.)?/u.exec(line);
	if (maintenance) return maintenance[0];
	const runtime = /^Target package: openclaw@(\S+); Minimum Node engine: (\S+); Running Node: (\S+)$/u.exec(line);
	if (runtime) {
		const [target, minimum, running] = runtime.slice(1).map(redactPublicSupportVersion);
		return truncateUtf16Safe(`Target package: openclaw@${target}; Minimum Node engine: ${minimum}; Running Node: ${running}`, 200);
	}
	if (/^Gateway readiness endpoint returned HTTP (?:[1-5]\d{2}|unavailable); expected HTTP 200\.$/u.test(line)) return line;
	const lines = value.split(/[\r\n\u2028\u2029]/u).map((entry) => redactSupportDiagnosticLine(entry, context)).join("\n");
	const codes = (lines.match(/\b[A-Z][A-Z0-9_]+\b/gu) ?? []).filter((code) => normalizeSupportDiagnosticErrorCode(code));
	const causes = (lines.match(/\b(?:GLIBC_\d{1,3}(?:\.\d{1,3}){1,2} not found|[Cc]onnection (?:refused|closed|timed out)|[Pp]ermission denied|[Nn]o space left on device|MCP error -?\d{1,5}|HTTP [1-5]\d{2}|Invalid package dist content inventory|Package rollback (?:launcher backup changed|verification (?:timed out|failed))|managed update handoff (?:exited before (?:responding|signaling readiness)|did not (?:respond|signal readiness)))\b/gu) ?? []).map((cause) => cause.replace(/^permission denied$/u, "Permission denied"));
	const configFields = value.split(/[\r\n\u2028\u2029]|; /u).flatMap((entry) => {
		const field = /^(?:- )?(.+): Invalid configuration field$/u.exec(entry)?.[1];
		return field ? [`${redactPublicSupportConfigKey(field)}: Invalid configuration field`] : [];
	});
	return truncateUtf16Safe([.../* @__PURE__ */ new Set([
		...codes,
		...causes,
		...configFields
	])].join("; ") || "[redacted-diagnostic]", 200);
}
function sanitizeCommandArguments(args, redaction) {
	let redactNext = false;
	return args.map((arg) => {
		if (typeof arg !== "string") return sanitizeSupportSnapshotValue(arg, redaction);
		if (redactNext) {
			redactNext = false;
			return "<redacted>";
		}
		if (SENSITIVE_COMMAND_ARG_RE.test(arg)) {
			const hasInlineValue = arg.includes("=");
			if (!hasInlineValue) redactNext = true;
			return hasInlineValue ? arg.replace(/[=].*/u, "=<redacted>") : arg;
		}
		return redactSupportString(arg, redaction);
	});
}
/** Sanitizes general diagnostic snapshots while keeping bounded object/array structure. */
function sanitizeSupportSnapshotValue(value, redaction, key = "", depth = 0) {
	return sanitizeSupportValue(value, redaction, key, depth, false);
}
/** Sanitizes config-shaped values with stricter private field handling. */
function sanitizeSupportConfigValue(value, redaction, key = "", depth = 0) {
	return sanitizeSupportValue(value, redaction, key, depth, true);
}
function sanitizeSupportValue(value, redaction, key, depth, config) {
	if (value == null || typeof value === "boolean") return value;
	const privateField = isPrivateSupportField(key) || config && CONFIG_PRIVATE_FIELD_RE.test(key);
	if (typeof value === "number") return privateField ? "<redacted>" : value;
	if (typeof value === "string") return privateField || config && value === "__OPENCLAW_REDACTED__" ? "<redacted>" : redactSupportString(value, redaction);
	if (depth >= MAX_SUPPORT_SNAPSHOT_DEPTH) return "<truncated>";
	if (Array.isArray(value)) {
		if (config && privateField) return {
			redacted: true,
			count: value.length
		};
		const count = value.length;
		const items = value.slice(0, MAX_SUPPORT_ARRAY_ITEMS);
		return supportArrayResult(!config && key === "programArguments" ? sanitizeCommandArguments(items, redaction) : items.map((entry) => sanitizeSupportValue(entry, redaction, key, depth + 1, config)), count);
	}
	const record = asOptionalRecord(value);
	if (!record) return "<unsupported>";
	if (config && privateField) return isSecretRefShape(record) ? sanitizeSecretRefForSupport(record) : "<redacted>";
	const privateMap = PRIVATE_MAP_SUPPORT_FIELD_RE.test(key);
	if (!config && privateMap) return { count: countOwnObjectEntries(record) };
	const sanitized = createSupportRecord();
	let privateEntryIndex = 0;
	const redactEntryKeys = config && privateMap;
	const privateEntryLabel = redactEntryKeys ? privateMapEntryLabel(key) : "";
	const { count, entries } = limitedSupportObjectEntries(record);
	for (const { key: entryKey, value: entryValue } of entries) {
		let outputKey = entryKey;
		if (redactEntryKeys) {
			privateEntryIndex += 1;
			outputKey = `<redacted-${privateEntryLabel}-${privateEntryIndex}>`;
		}
		sanitized[outputKey] = !config && isPrivateSupportField(entryKey) ? "<redacted>" : sanitizeSupportValue(entryValue, redaction, entryKey, depth + 1, config);
	}
	addTruncationMetadata(sanitized, count);
	return sanitized;
}
//#endregion
export { redactPublicSupportDiagnosticLine as a, redactSupportString as c, sanitizeSupportSnapshotValue as d, redactPublicSupportConfigKey as i, redactTextForSupport as l, redactKnownPathPrefixesForSupport as n, redactPublicSupportVersion as o, redactPathForSupport as r, redactSupportDiagnosticLine as s, normalizeSupportDiagnosticErrorCode as t, sanitizeSupportConfigValue as u };
