import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord, c as isRecord, u as readStringField } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.mjs";
import { l as resolveConfigIncludes, u as resolveConfigIncludesForTopLevelKey } from "./includes-CaaCq-XN.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { p as resolveConfigPath, y as resolveIncludeRoots } from "./paths-DehQwyE0.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as appendConfigPathSegment } from "./dot-path-BSC76DAI.mjs";
import { d as parseEnvTemplateSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { i as isSensitiveUrlQueryParamName } from "./redact-sensitive-url-DspuXlEe.mjs";
import { a as HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN, c as HTTP_AUTH_SERIALIZED_QUOTE_PATTERN, i as HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN, l as findStructuredAuthParamRanges, n as HTTP_AUTH_HEADER_BOUNDARY_PATTERN, o as HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN, r as HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN, s as HTTP_AUTH_SCHEME_PATTERN, u as redactStructuredAuthHeaders } from "./structured-auth-redaction-OhcG53GS.mjs";
import { n as createSecretValueRedactor, o as redactRegisteredSecretValues, r as getSecretRedactionRegistryRevision, t as captureSecretRedactionRegistrySnapshot } from "./secret-redaction-registry-CKxLTepq.mjs";
import fs from "node:fs";
import { performance } from "node:perf_hooks";
import { channel } from "node:diagnostics_channel";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/security/safe-regex.ts
const SAFE_REGEX_CACHE_MAX = 256;
const SAFE_REGEX_TEST_WINDOW = 2048;
const safeRegexCache = /* @__PURE__ */ new Map();
function createParseFrame() {
	return {
		lastToken: null,
		containsRepetition: false,
		hasAlternation: false,
		branchMinLength: 0,
		branchMaxLength: 0,
		altMinLength: null,
		altMaxLength: null
	};
}
function addLength(left, right) {
	if (!Number.isFinite(left) || !Number.isFinite(right)) return Number.POSITIVE_INFINITY;
	return left + right;
}
function multiplyLength(length, factor) {
	if (!Number.isFinite(length)) return factor === 0 ? 0 : Number.POSITIVE_INFINITY;
	return length * factor;
}
function recordAlternative(frame) {
	if (frame.altMinLength === null || frame.altMaxLength === null) {
		frame.altMinLength = frame.branchMinLength;
		frame.altMaxLength = frame.branchMaxLength;
		return;
	}
	frame.altMinLength = Math.min(frame.altMinLength, frame.branchMinLength);
	frame.altMaxLength = Math.max(frame.altMaxLength, frame.branchMaxLength);
}
function readQuantifier(source, index) {
	const ch = source[index];
	const consumed = source[index + 1] === "?" ? 2 : 1;
	if (ch === "*") return {
		consumed,
		minRepeat: 0,
		maxRepeat: null
	};
	if (ch === "+") return {
		consumed,
		minRepeat: 1,
		maxRepeat: null
	};
	if (ch === "?") return {
		consumed,
		minRepeat: 0,
		maxRepeat: 1
	};
	if (ch !== "{") return null;
	let i = index + 1;
	while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
	if (i === index + 1) return null;
	const minRepeat = Number.parseInt(source.slice(index + 1, i), 10);
	let maxRepeat = minRepeat;
	if (source[i] === ",") {
		i += 1;
		const maxStart = i;
		while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
		maxRepeat = i === maxStart ? null : Number.parseInt(source.slice(maxStart, i), 10);
	}
	if (source[i] !== "}") return null;
	i += 1;
	if (source[i] === "?") i += 1;
	if (maxRepeat !== null && maxRepeat < minRepeat) return null;
	return {
		consumed: i - index,
		minRepeat,
		maxRepeat
	};
}
function tokenizePattern(source) {
	const tokens = [];
	let inCharClass = false;
	for (let i = 0; i < source.length; i += 1) {
		const ch = source[i];
		if (inCharClass) {
			if (ch === "\\") {
				i += 1;
				continue;
			}
			if (ch === "]") inCharClass = false;
			continue;
		}
		if (ch === "\\") {
			i += 1;
			tokens.push({ kind: "simple-token" });
			continue;
		}
		if (ch === "[") {
			inCharClass = true;
			tokens.push({ kind: "simple-token" });
			continue;
		}
		if (ch === "(") {
			tokens.push({ kind: "group-open" });
			continue;
		}
		if (ch === ")") {
			tokens.push({ kind: "group-close" });
			continue;
		}
		if (ch === "|") {
			tokens.push({ kind: "alternation" });
			continue;
		}
		const quantifier = readQuantifier(source, i);
		if (quantifier) {
			tokens.push({
				kind: "quantifier",
				quantifier
			});
			i += quantifier.consumed - 1;
			continue;
		}
		tokens.push({ kind: "simple-token" });
	}
	return tokens;
}
function analyzeTokensForNestedRepetition(tokens) {
	const frames = [createParseFrame()];
	const emitToken = (token) => {
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		frame.lastToken = token;
		if (token.containsRepetition) frame.containsRepetition = true;
		frame.branchMinLength = addLength(frame.branchMinLength, token.minLength);
		frame.branchMaxLength = addLength(frame.branchMaxLength, token.maxLength);
	};
	const emitSimpleToken = () => {
		emitToken({
			containsRepetition: false,
			hasAmbiguousAlternation: false,
			minLength: 1,
			maxLength: 1
		});
	};
	for (const token of tokens) {
		if (token.kind === "simple-token") {
			emitSimpleToken();
			continue;
		}
		if (token.kind === "group-open") {
			frames.push(createParseFrame());
			continue;
		}
		if (token.kind === "group-close") {
			if (frames.length > 1) {
				const frame = frames.pop();
				if (frame.hasAlternation) recordAlternative(frame);
				const groupMinLength = frame.hasAlternation ? frame.altMinLength ?? 0 : frame.branchMinLength;
				const groupMaxLength = frame.hasAlternation ? frame.altMaxLength ?? 0 : frame.branchMaxLength;
				emitToken({
					containsRepetition: frame.containsRepetition,
					hasAmbiguousAlternation: frame.hasAlternation && frame.altMinLength !== null && frame.altMaxLength !== null && frame.altMinLength !== frame.altMaxLength,
					minLength: groupMinLength,
					maxLength: groupMaxLength
				});
			}
			continue;
		}
		if (token.kind === "alternation") {
			const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
			frame.hasAlternation = true;
			recordAlternative(frame);
			frame.branchMinLength = 0;
			frame.branchMaxLength = 0;
			frame.lastToken = null;
			continue;
		}
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		const previousToken = frame.lastToken;
		if (!previousToken) continue;
		if (previousToken.containsRepetition) return true;
		if (previousToken.hasAmbiguousAlternation && token.quantifier.maxRepeat === null) return true;
		const previousMinLength = previousToken.minLength;
		const previousMaxLength = previousToken.maxLength;
		previousToken.minLength = multiplyLength(previousToken.minLength, token.quantifier.minRepeat);
		previousToken.maxLength = token.quantifier.maxRepeat === null ? Number.POSITIVE_INFINITY : multiplyLength(previousToken.maxLength, token.quantifier.maxRepeat);
		previousToken.containsRepetition = true;
		frame.containsRepetition = true;
		frame.branchMinLength = frame.branchMinLength - previousMinLength + previousToken.minLength;
		frame.branchMaxLength = addLength(Number.isFinite(frame.branchMaxLength) && Number.isFinite(previousMaxLength) ? frame.branchMaxLength - previousMaxLength : Number.POSITIVE_INFINITY, previousToken.maxLength);
	}
	return false;
}
function testRegexFromStart(regex, value) {
	regex.lastIndex = 0;
	return regex.test(value);
}
function testRegexWithBoundedInput(regex, input, maxWindow = SAFE_REGEX_TEST_WINDOW) {
	if (maxWindow <= 0) return false;
	if (input.length <= maxWindow) return testRegexFromStart(regex, input);
	if (testRegexFromStart(regex, input.slice(0, maxWindow))) return true;
	return testRegexFromStart(regex, input.slice(-maxWindow));
}
function hasNestedRepetition(source) {
	return analyzeTokensForNestedRepetition(tokenizePattern(source));
}
function compileSafeRegexDetailed(source, flags = "") {
	const trimmed = source.trim();
	if (!trimmed) return {
		regex: null,
		source: trimmed,
		flags,
		reason: "empty"
	};
	const cacheKey = `${flags}::${trimmed}`;
	if (safeRegexCache.has(cacheKey)) return safeRegexCache.get(cacheKey) ?? {
		regex: null,
		source: trimmed,
		flags,
		reason: "invalid-regex"
	};
	let result;
	if (hasNestedRepetition(trimmed)) result = {
		regex: null,
		source: trimmed,
		flags,
		reason: "unsafe-nested-repetition"
	};
	else try {
		result = {
			regex: new RegExp(trimmed, flags),
			source: trimmed,
			flags,
			reason: null
		};
	} catch {
		result = {
			regex: null,
			source: trimmed,
			flags,
			reason: "invalid-regex"
		};
	}
	safeRegexCache.set(cacheKey, result);
	pruneMapToMaxSize(safeRegexCache, SAFE_REGEX_CACHE_MAX);
	return result;
}
function compileSafeRegex(source, flags = "") {
	return compileSafeRegexDetailed(source, flags).regex;
}
//#endregion
//#region src/security/config-regex.ts
function normalizeRejectReason(result) {
	if (result.reason === null || result.reason === "empty") return null;
	return result.reason;
}
/**
* Compile a single user-configured regex with the shared safe-regex guardrails.
* Returns null for blank patterns so optional config entries can be skipped silently.
*/
function compileConfigRegex(pattern, flags = "") {
	const result = compileSafeRegexDetailed(pattern, flags);
	if (result.reason === "empty") return null;
	return {
		regex: result.regex,
		pattern: result.source,
		flags: result.flags,
		reason: normalizeRejectReason(result)
	};
}
/**
* Compile a list of user-configured regex patterns, separating usable regexes from diagnostics.
* Callers can keep operating with safe entries while reporting rejected unsafe patterns once.
*/
function compileConfigRegexes(patterns, flags = "") {
	const regexes = [];
	const rejected = [];
	for (const pattern of patterns) {
		const compiled = compileConfigRegex(pattern, flags);
		if (!compiled) continue;
		if (compiled.regex) {
			regexes.push(compiled.regex);
			continue;
		}
		rejected.push({
			pattern: compiled.pattern,
			flags: compiled.flags,
			reason: compiled.reason
		});
	}
	return {
		regexes,
		rejected
	};
}
//#endregion
//#region src/config/env-substitution.ts
/**
* Environment variable substitution for config values.
*
* Supports `${VAR_NAME}` syntax in string values, substituted at config load time.
* - Only uppercase env vars are matched: `[A-Z_][A-Z0-9_]*`
* - Escape with `$${}` to output literal `${}`
* - Missing env vars throw `MissingEnvVarError` with context
*
* @example
* ```json5
* {
*   models: {
*     providers: {
*       "vercel-gateway": {
*         apiKey: "${VERCEL_GATEWAY_API_KEY}"
*       }
*     }
*   }
* }
* ```
*/
const ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
/** Error thrown when a config value references a missing or empty environment variable. */
var MissingEnvVarError = class extends Error {
	constructor(varName, configPath) {
		super(`Missing env var "${varName}" referenced at config path: ${configPath}`);
		this.varName = varName;
		this.configPath = configPath;
		this.name = "MissingEnvVarError";
	}
};
function parseEnvTokenAt(value, index) {
	if (value[index] !== "$") return null;
	const next = value[index + 1];
	const afterNext = value[index + 2];
	if (next === "$" && afterNext === "{") {
		const start = index + 3;
		const end = value.indexOf("}", start);
		if (end !== -1) {
			const name = value.slice(start, end);
			if (ENV_VAR_NAME_PATTERN.test(name)) return {
				kind: "escaped",
				name,
				end
			};
		}
	}
	if (next === "{") {
		const start = index + 2;
		const end = value.indexOf("}", start);
		if (end !== -1) {
			const name = value.slice(start, end);
			if (ENV_VAR_NAME_PATTERN.test(name)) return {
				kind: "substitution",
				name,
				end
			};
		}
	}
	return null;
}
function substituteString(value, env, configPath, opts) {
	if (!value.includes("$")) return value;
	const authoredRef = parseEnvTemplateSecretRef(value);
	if (authoredRef && !containsEnvVarReference(value)) opts?.onPendingEnvSecretRef?.(authoredRef.id, configPath);
	const chunks = [];
	for (let i = 0; i < value.length; i += 1) {
		const char = value.charAt(i);
		if (char !== "$") {
			chunks.push(char);
			continue;
		}
		const token = parseEnvTokenAt(value, i);
		if (token?.kind === "escaped") {
			chunks.push(`\${${token.name}}`);
			i = token.end;
			continue;
		}
		if (token?.kind === "substitution") {
			const envValue = env[token.name];
			if (envValue === void 0 || envValue === "") {
				if (opts?.onMissing) {
					opts.onMissing({
						varName: token.name,
						configPath
					});
					if (authoredRef?.id === token.name) opts.onPendingEnvSecretRef?.(token.name, configPath);
					chunks.push(`\${${token.name}}`);
					i = token.end;
					continue;
				}
				throw new MissingEnvVarError(token.name, configPath);
			}
			if (authoredRef?.id === token.name) opts?.onResolvedEnvSecretRef?.(token.name, configPath);
			chunks.push(envValue);
			i = token.end;
			continue;
		}
		chunks.push(char);
	}
	return chunks.join("");
}
/** Detects unescaped `${VAR}` references without treating escaped `$${VAR}` as references. */
function containsEnvVarReference(value) {
	if (!value.includes("$")) return false;
	for (let i = 0; i < value.length; i += 1) {
		if (value[i] !== "$") continue;
		const token = parseEnvTokenAt(value, i);
		if (token?.kind === "escaped") {
			i = token.end;
			continue;
		}
		if (token?.kind === "substitution") return true;
	}
	return false;
}
function substituteAny(value, env, path, opts) {
	const pending = [];
	const visit = (current, currentPath) => {
		if (typeof current === "string") return substituteString(current, env, currentPath, opts);
		if (Array.isArray(current)) {
			const length = current.length;
			const result = [];
			result.length = length;
			let index = 0;
			pending.push(() => {
				while (index < length) {
					const key = index++;
					if (key in current) {
						result[key] = visit(current[key], `${currentPath}[${key}]`);
						return true;
					}
				}
				return false;
			});
			return result;
		}
		if (isPlainObject(current)) {
			const result = {};
			const entries = Object.entries(current)[Symbol.iterator]();
			pending.push(() => {
				const entry = entries.next();
				if (entry.done) return false;
				const [key, child] = entry.value;
				result[key] = visit(child, appendConfigPathSegment(currentPath, key));
				return true;
			});
			return result;
		}
		return current;
	};
	const result = visit(value, path);
	for (let next = pending.at(-1); next; next = pending.at(-1)) if (!next()) pending.pop();
	return result;
}
/**
* Resolves `${VAR_NAME}` environment variable references in config values.
*
* @param obj - The parsed config object (after JSON5 parse and $include resolution)
* @param env - Environment variables to use for substitution (defaults to process.env)
* @param opts - Options: `onMissing` callback to collect warnings instead of throwing.
* @returns The config object with env vars substituted
* @throws {MissingEnvVarError} If a referenced env var is not set or empty (unless `onMissing` is set)
*/
function resolveConfigEnvVars(obj, env = process.env, opts) {
	return substituteAny(obj, env, "", opts);
}
//#endregion
//#region src/logging/config.ts
let cachedLoggingConfig;
function invalidateLoggingConfigCache() {
	cachedLoggingConfig = void 0;
}
function resolveLoggingConfigSelector() {
	const env = process.env;
	return [
		env.OPENCLAW_CONFIG_PATH,
		env.OPENCLAW_STATE_DIR,
		env.OPENCLAW_HOME,
		env.OPENCLAW_PROFILE,
		env.HOME,
		env.USERPROFILE,
		env.HOMEDRIVE,
		env.HOMEPATH,
		env.PREFIX,
		env.ANDROID_DATA,
		env.OPENCLAW_TEST_FAST,
		tryProcessCwd() ?? ""
	].map((value) => value ?? "").join("\0");
}
function resolvePartialDiagnosticLoggingConfig(logging) {
	if (!isRecord(logging)) return;
	const partial = {};
	if (typeof logging.consoleStyle === "string") try {
		const resolved = resolveConfigEnvVars({ consoleStyle: logging.consoleStyle });
		if (isRecord(resolved) && (resolved.consoleStyle === "pretty" || resolved.consoleStyle === "compact" || resolved.consoleStyle === "json")) partial.consoleStyle = resolved.consoleStyle;
	} catch {}
	if (Array.isArray(logging.redactPatterns)) try {
		const resolved = resolveConfigEnvVars({ redactPatterns: logging.redactPatterns });
		if (isRecord(resolved) && Array.isArray(resolved.redactPatterns) && resolved.redactPatterns.every((entry) => typeof entry === "string")) partial.redactPatterns = resolved.redactPatterns;
	} catch {}
	return Object.keys(partial).length > 0 ? partial : void 0;
}
/** Reads the logging block from config, caching by resolved config path. */
function readLoggingConfig() {
	try {
		if (loggingState.appliedConfig !== "unowned") return loggingState.appliedConfig;
		const selector = resolveLoggingConfigSelector();
		if (cachedLoggingConfig?.selector === selector) return cachedLoggingConfig.logging;
		const configPath = resolveConfigPath();
		if (!fs.existsSync(configPath)) {
			cachedLoggingConfig = {
				selector,
				logging: void 0
			};
			return;
		}
		const parsed = parseJsonWithJson5Fallback(fs.readFileSync(configPath, "utf8"));
		const allowedRoots = resolveIncludeRoots();
		let includedConfig;
		try {
			includedConfig = resolveConfigIncludesForTopLevelKey(parsed, configPath, "logging", void 0, { allowedRoots });
		} catch {
			const directLogging = isRecord(parsed) ? parsed.logging : void 0;
			if (directLogging === void 0) return;
			try {
				includedConfig = resolveConfigIncludes({ logging: directLogging }, configPath, void 0, { allowedRoots });
			} catch {
				return resolvePartialDiagnosticLoggingConfig(directLogging);
			}
		}
		let resolvedConfig;
		try {
			resolvedConfig = resolveConfigEnvVars(includedConfig);
		} catch {
			return resolvePartialDiagnosticLoggingConfig(isRecord(includedConfig) ? includedConfig.logging : void 0);
		}
		const logging = isRecord(resolvedConfig) ? resolvedConfig.logging : void 0;
		const resolvedLogging = isRecord(logging) ? logging : void 0;
		cachedLoggingConfig = {
			selector,
			logging: resolvedLogging
		};
		return resolvedLogging;
	} catch {
		return;
	}
}
//#endregion
//#region src/logging/redact-bounded.ts
const REDACT_REGEX_CHUNK_THRESHOLD = 32768;
const REDACT_REGEX_CHUNK_SIZE = 16384;
/** Applies a regex replacement in chunks once input crosses the redaction size threshold. */
function replacePatternBounded(text, pattern, replacer, options) {
	const chunkThreshold = options?.chunkThreshold ?? REDACT_REGEX_CHUNK_THRESHOLD;
	const chunkSize = options?.chunkSize ?? REDACT_REGEX_CHUNK_SIZE;
	if (chunkThreshold <= 0 || chunkSize <= 0 || text.length <= chunkThreshold) return text.replace(pattern, replacer);
	let output;
	for (let index = 0; index < text.length; index += chunkSize) {
		const chunk = text.slice(index, index + chunkSize);
		const replaced = chunk.replace(pattern, replacer);
		if (output !== void 0) output += replaced;
		else if (replaced !== chunk) output = text.slice(0, index) + replaced;
	}
	return output ?? text;
}
//#endregion
//#region src/logging/redact-edit-composition.ts
/** Compose sorted, disjoint current-value edits while retaining original source spans. */
function composeRedactionEdits(length, previous, edits) {
	if (previous.length === 0) return edits;
	const pieces = [];
	let source = 0;
	for (const edit of previous) {
		if (source < edit.start) pieces.push({
			start: source,
			end: edit.start
		});
		pieces.push(edit);
		source = edit.end;
	}
	if (source < length) pieces.push({
		start: source,
		end: length
	});
	const output = [];
	let index = 0;
	let offset = 0;
	let position = 0;
	const consume = (end, keep) => {
		if (end === position) {
			const piece = pieces[index];
			if (!piece) return {
				start: length,
				end: length
			};
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			return {
				start,
				end: piece.replacement !== void 0 && offset > 0 ? piece.end : start
			};
		}
		let sourceStart;
		let sourceEnd = 0;
		while (position < end) {
			const piece = expectDefined(pieces[index], "current redaction piece");
			const size = piece.replacement?.length ?? piece.end - piece.start;
			const count = Math.min(size - offset, end - position);
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			const finish = piece.replacement === void 0 ? start + count : piece.end;
			sourceStart ??= start;
			sourceEnd = finish;
			if (keep && count > 0) output.push({
				start,
				end: finish,
				replacement: piece.replacement?.slice(offset, offset + count)
			});
			position += count;
			offset += count;
			if (offset === size) {
				index += 1;
				offset = 0;
			}
		}
		return {
			start: sourceStart ?? sourceEnd,
			end: sourceEnd
		};
	};
	for (const edit of edits) {
		consume(edit.start, true);
		output.push({
			...consume(edit.end, false),
			replacement: edit.replacement
		});
	}
	while (index < pieces.length) {
		const piece = expectDefined(pieces[index], "remaining redaction piece");
		consume(position + (piece.replacement?.length ?? piece.end - piece.start) - offset, true);
	}
	const composed = [];
	let fragments = [];
	let pending;
	const flush = () => {
		if (pending) {
			pending.replacement = fragments.join("");
			composed.push(pending);
			pending = void 0;
			fragments = [];
		}
	};
	for (const piece of output) {
		if (piece.replacement === void 0) {
			flush();
			continue;
		}
		const sameEmptySpan = pending && pending.start === piece.start && pending.end === piece.end && piece.start === piece.end;
		if (!pending || piece.start >= pending.end && !sameEmptySpan) {
			flush();
			pending = {
				start: piece.start,
				end: piece.end,
				replacement: ""
			};
		} else pending.end = Math.max(pending.end, piece.end);
		fragments.push(piece.replacement);
	}
	flush();
	return composed;
}
/** Project source-span replacements onto a value that already contains replacements. */
function rebaseRedactionEdits(previous, edits) {
	let shift = 0;
	const spans = previous.map((edit) => {
		const start = edit.start + shift;
		shift += edit.replacement.length - (edit.end - edit.start);
		return {
			...edit,
			currentStart: start,
			currentEnd: edit.end + shift
		};
	});
	const boundary = (position, end) => {
		let low = 0;
		let high = spans.length;
		while (low < high) {
			const middle = low + high >>> 1;
			const span = expectDefined(spans[middle], "source redaction span");
			if (span.end < position || span.end === position && span.start !== span.end) low = middle + 1;
			else high = middle;
		}
		const span = spans[low];
		if (span && (position > span.start || position === span.start && span.start === span.end)) return end ? span.currentEnd : span.currentStart;
		const before = spans[low - 1];
		return position + (before ? before.currentEnd - before.end : 0);
	};
	return edits.map((edit) => ({
		start: boundary(edit.start, false),
		end: boundary(edit.end, true),
		replacement: edit.replacement
	}));
}
function mergeRedactionEdits(edits) {
	edits.sort((left, right) => left.start - right.start || left.end - right.end);
	const merged = [];
	for (const edit of edits) {
		const previous = merged.at(-1);
		if (!previous || edit.start >= previous.end) merged.push({ ...edit });
		else if (edit.start !== previous.start || edit.end !== previous.end || edit.replacement !== previous.replacement) {
			previous.end = Math.max(previous.end, edit.end);
			previous.replacement = "***";
		}
	}
	return merged;
}
function applyRedactionEdits(value, edits) {
	const parts = [];
	let cursor = 0;
	for (const edit of mergeRedactionEdits(edits)) {
		parts.push(value.slice(cursor, edit.start), edit.replacement);
		cursor = edit.end;
	}
	return parts.join("") + value.slice(cursor);
}
//#endregion
//#region src/logging/redact-internal-state.ts
const fullContextToolPayloadRedaction = Symbol("full-context-tool-payload-redaction");
const preparedToolText = /* @__PURE__ */ new WeakMap();
const fullContextToolPayloadRedactionState = {
	mark(loggingConfig) {
		return {
			...loggingConfig,
			[fullContextToolPayloadRedaction]: true
		};
	},
	isMarked(loggingConfig) {
		return Boolean(loggingConfig?.[fullContextToolPayloadRedaction]);
	}
};
function captureModelVisibleRedactionPolicy(loggingConfig) {
	return {
		patterns: [...loggingConfig?.redactPatterns ?? []],
		fullContext: fullContextToolPayloadRedactionState.isMarked(loggingConfig),
		registryRevision: getSecretRedactionRegistryRevision()
	};
}
function matchesModelVisibleRedactionPolicy(policy, loggingConfig) {
	const patterns = loggingConfig?.redactPatterns ?? [];
	return policy.registryRevision === getSecretRedactionRegistryRevision() && policy.fullContext === fullContextToolPayloadRedactionState.isMarked(loggingConfig) && policy.patterns.length === patterns.length && policy.patterns.every((pattern, index) => pattern === patterns[index]);
}
const modelVisibleToolTextRedactionState = {
	record(block, text, loggingConfig) {
		preparedToolText.set(block, {
			text,
			...captureModelVisibleRedactionPolicy(loggingConfig)
		});
	},
	matches(block, text, loggingConfig) {
		const prepared = preparedToolText.get(block);
		return prepared !== void 0 && prepared.text === text && matchesModelVisibleRedactionPolicy(prepared, loggingConfig);
	},
	copy(source, target, text) {
		const prepared = preparedToolText.get(source);
		if (prepared?.text === text) preparedToolText.set(target, prepared);
	}
};
//#endregion
//#region src/logging/redact-internal.ts
function isFullContextToolPayloadRedaction(loggingConfig) {
	return fullContextToolPayloadRedactionState.isMarked(loggingConfig);
}
function isPreparedModelVisibleToolText(block, text, loggingConfig) {
	return modelVisibleToolTextRedactionState.matches(block, text, loggingConfig);
}
function copyPreparedModelVisibleToolText(source, target) {
	const text = source.text;
	if (typeof text === "string" && text === target.text) modelVisibleToolTextRedactionState.copy(source, target, text);
}
//#endregion
//#region src/logging/redact-json-tokens.ts
const JSON_TOKEN_RE = /"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\]]/g;
function readScalarTokens(text, origins) {
	const tokens = [];
	const containers = [];
	const root = {
		key: "",
		path: [],
		origins,
		origin: origins.value,
		objectPath: true
	};
	const valueContext = (parent) => !parent ? root : parent.array ? {
		...parent.context,
		origin: parent.context.origins?.value ?? parent.context.origin,
		origins: parent.context.origins?.children.get(String(parent.nextIndex++))
	} : expectDefined(parent.field, "JSON object field context");
	for (const match of text.matchAll(JSON_TOKEN_RE)) {
		const raw = match[0];
		const parent = containers.at(-1);
		if (raw === "{" || raw === "[") {
			const context = valueContext(parent);
			const array = raw === "[";
			containers.push({
				array,
				nextIndex: 0,
				context: array ? {
					...context,
					objectPath: false
				} : context,
				start: match.index,
				tokenStart: tokens.length
			});
			continue;
		}
		if (raw === "}" || raw === "]") {
			const container = expectDefined(containers.pop(), "JSON container");
			if (container.tokenStart === tokens.length) {
				const end = match.index + 1;
				const value = text.slice(container.start, end);
				tokens.push({
					...container.context,
					isKey: false,
					string: false,
					value,
					start: container.start,
					end,
					escaped: false,
					edits: [],
					projectedEdits: [],
					currentValue: value,
					currentStart: container.start,
					currentEnd: end
				});
			}
			continue;
		}
		const start = match.index;
		const end = start + raw.length;
		const string = raw.startsWith("\"");
		const value = string ? JSON.parse(raw) : raw;
		let next = end;
		while (text[next] === " " || text[next] === "	" || text[next] === "\r" || text[next] === "\n") next += 1;
		const isKey = string && text[next] === ":";
		let context;
		if (isKey) {
			const container = expectDefined(parent, "JSON property container");
			const inherited = container.context;
			context = {
				key: "",
				path: [],
				origin: inherited.origin,
				objectPath: false,
				rootKey: inherited.rootKey,
				rootValueStart: inherited.rootValueStart
			};
			let valueStart = next + 1;
			while (text[valueStart] === " " || text[valueStart] === "	" || text[valueStart] === "\r" || text[valueStart] === "\n") valueStart += 1;
			container.field = {
				key: value,
				path: [...inherited.path, value],
				origins: inherited.origins?.children.get(value),
				origin: inherited.origins?.value ?? inherited.origin,
				objectPath: inherited.objectPath,
				rootKey: containers.length === 1 ? value : inherited.rootKey,
				rootValueStart: containers.length === 1 ? valueStart : inherited.rootValueStart
			};
		} else context = valueContext(parent);
		const origin = isKey ? {
			structured: false,
			primitiveMask: false
		} : context.origins?.value ?? context.origin;
		tokens.push({
			...context,
			origin,
			start,
			end,
			isKey,
			string,
			value,
			escaped: string && raw.includes("\\"),
			edits: [],
			projectedEdits: [],
			currentValue: value,
			currentStart: start,
			currentEnd: end
		});
	}
	return tokens;
}
function readBatchTokens(input, origins, preserveLines = false) {
	const tokens = [];
	let offset = 0;
	for (const line of input.split("\n")) {
		let json = false;
		try {
			JSON.parse(line);
			json = true;
		} catch {}
		if (json) for (const token of readScalarTokens(line, origins)) {
			token.deferEncoding = !token.string;
			token.start += offset;
			token.end += offset;
			token.currentStart += offset;
			token.currentEnd += offset;
			tokens.push(token);
		}
		else {
			const previous = tokens.at(-1);
			if (!preserveLines && previous?.raw && previous.end + 1 === offset) {
				previous.value += `\n${line}`;
				previous.currentValue = previous.value;
				previous.end = previous.currentEnd = offset + line.length;
			} else tokens.push({
				raw: true,
				origin: origins.value,
				key: "",
				path: [],
				objectPath: false,
				isKey: false,
				string: false,
				value: line,
				escaped: false,
				start: offset,
				end: offset + line.length,
				currentStart: offset,
				currentEnd: offset + line.length,
				currentValue: line,
				edits: [],
				projectedEdits: []
			});
		}
		offset += line.length + 1;
	}
	return tokens;
}
//#endregion
//#region src/logging/redact-pattern-runtime.ts
function parseRedactPatternSource(raw) {
	const literal = raw.match(/^\/(.+)\/([gimsuy]*)$/);
	if (!literal) return [raw, "gi"];
	const source = literal[1] ?? "";
	const flags = literal[2] ?? "";
	return [source, flags.includes("g") ? flags : `${flags}g`];
}
function readRedactMatch(args) {
	const inputIndex = args.length > 0 && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null ? args.length - 2 : args.length - 1;
	const offsetIndex = inputIndex - 1;
	const match = typeof args[0] === "string" ? args[0] : "";
	const groups = args.slice(1, offsetIndex).map((value) => typeof value === "string" ? value : "");
	const offset = typeof args[offsetIndex] === "number" ? args[offsetIndex] : -1;
	return {
		match,
		groups,
		input: typeof args[inputIndex] === "string" ? args[inputIndex] : "",
		offset
	};
}
function getIndexedCaptureStart(pattern, input, match, matchOffset, captureIndex) {
	if (!(pattern instanceof RegExp) || matchOffset < 0 || !input) return null;
	try {
		const flags = pattern.flags.includes("d") ? pattern.flags : `${pattern.flags}d`;
		const indexedPattern = new RegExp(pattern.source, flags);
		indexedPattern.lastIndex = matchOffset;
		const indexedMatch = indexedPattern.exec(input);
		const captureIndices = indexedMatch?.indices?.[captureIndex + 1];
		if (!indexedMatch || indexedMatch.index !== matchOffset || indexedMatch[0] !== match) return null;
		if (!captureIndices) return null;
		return captureIndices[0] - matchOffset;
	} catch {
		return null;
	}
}
function hasBackreferenceToGroup(pattern, groupNumber) {
	return new RegExp(String.raw`\\${groupNumber}(?!\d)`).test(pattern.source);
}
function selectSecretCapture(match, groups) {
	const selected = {
		index: -1,
		value: match,
		captureCount: 0
	};
	for (let index = 0; index < groups.length; index++) {
		const value = groups[index];
		if (typeof value === "string" && value.length > 0) {
			selected.index = index;
			selected.value = value;
			selected.captureCount++;
		}
	}
	return selected;
}
function getSecretCaptureStart(pattern, input, match, matchOffset, selected) {
	const indexedTokenStart = getIndexedCaptureStart(pattern, input, match, matchOffset, selected.index);
	if (indexedTokenStart !== null) return indexedTokenStart;
	return pattern instanceof RegExp && selected.captureCount === 1 && selected.index >= 0 && hasBackreferenceToGroup(pattern, selected.index + 1) ? match.indexOf(selected.value) : match.lastIndexOf(selected.value);
}
const globalPatterns = /* @__PURE__ */ new WeakMap();
function* iterateRedactMatches(text, pattern) {
	if (!(pattern instanceof RegExp)) {
		yield* pattern.exec(text);
		return;
	}
	let regex = pattern;
	if (!pattern.global) {
		const cached = globalPatterns.get(pattern);
		regex = cached ?? new RegExp(pattern.source, `${pattern.flags}g`);
		if (!cached) globalPatterns.set(pattern, regex);
	}
	const unicode = regex.unicode || regex.flags.includes("v");
	let cursor = 0;
	while (cursor <= text.length) {
		const previousIndex = regex.lastIndex;
		let match;
		try {
			regex.lastIndex = cursor;
			match = regex.exec(text);
		} finally {
			regex.lastIndex = previousIndex;
		}
		if (!match) return;
		cursor = match.index + match[0].length;
		if (!match[0]) {
			const codePoint = text.codePointAt(cursor);
			cursor += unicode && codePoint !== void 0 && codePoint > 65535 ? 2 : 1;
		}
		yield {
			match: match[0],
			groups: match.slice(1).map((group) => group ?? ""),
			input: text,
			offset: match.index
		};
	}
}
function replaceRedactPattern(text, pattern, replace, replaceRegex) {
	if (pattern instanceof RegExp) return text.replace(pattern, replaceRegex ?? ((...args) => replace(readRedactMatch(args))));
	const parts = [];
	let end = 0;
	for (const match of iterateRedactMatches(text, pattern)) {
		parts.push(text.slice(end, match.offset), replace(match));
		end = match.offset + match.match.length;
	}
	return parts.length ? parts.join("") + text.slice(end) : text;
}
function redactPemBlock(block, marker) {
	const lines = block.split(/\r?\n/).filter(Boolean);
	if (lines.length < 2) return "***";
	return `${lines[0]}\n${marker}\n${lines[lines.length - 1]}`;
}
//#endregion
//#region src/logging/redact-json.ts
function getPatternRedactionEdits(value, pattern, getCapture) {
	const edits = [];
	for (const match of iterateRedactMatches(value, pattern)) {
		const capture = getCapture(match, pattern);
		const edit = capture?.redact({
			start: capture.start,
			end: capture.end,
			value: value.slice(capture.start, capture.end)
		});
		if (edit && edit.end >= edit.start) edits.push(edit);
	}
	return edits;
}
function stringBoundaries(text, token) {
	const boundaries = /* @__PURE__ */ new Map();
	let decoded = 0;
	for (let offset = token.start + 1; offset < token.end - 1; decoded += 1) {
		boundaries.set(offset, decoded);
		offset += text[offset] === "\\" ? text[offset + 1] === "u" ? 6 : 2 : 1;
	}
	boundaries.set(token.end - 1, decoded);
	return boundaries;
}
function decodedBoundary(text, token, offset) {
	if (!token.escaped) return offset - token.start - 1;
	token.boundaries ??= stringBoundaries(text, token);
	return token.boundaries.get(offset);
}
function encodedBoundary(text, token, offset) {
	if (!token.escaped) return token.start + 1 + offset;
	if (!token.encodedBoundaries) {
		token.boundaries ??= stringBoundaries(text, token);
		token.encodedBoundaries = [];
		for (const [encoded, decoded] of token.boundaries) token.encodedBoundaries[decoded] = encoded;
	}
	return expectDefined(token.encodedBoundaries[offset], "decoded JSON edit boundary");
}
function projectMessageEdits(input, tokens, message, getEdits) {
	const parts = new Map(message.parts.map((part) => [part.key, part]));
	const projected = [];
	for (const token of tokens) {
		if (!token.isKey && token.path.length === 1 && token.key === "message") continue;
		const part = token.rootKey === void 0 ? void 0 : parts.get(token.rootKey);
		if (!part) continue;
		if (!part.json && (token.isKey || (part.messageField ? token.path.length !== 2 || token.key !== "message" : token.path.length !== 1))) continue;
		const edits = getEdits(token);
		for (const edit of edits) {
			let start;
			let end;
			let replacement = edit.replacement;
			if (part.json) {
				const base = part.start - expectDefined(token.rootValueStart, "displayed JSON argument");
				if (token.string) {
					start = base + encodedBoundary(input, token, edit.start);
					end = base + encodedBoundary(input, token, edit.end);
					replacement = JSON.stringify(replacement).slice(1, -1);
				} else {
					start = base + token.start;
					end = base + token.end;
					replacement = JSON.stringify(replacement);
				}
			} else {
				start = part.start + edit.start;
				end = part.start + (part.primitiveLength ?? edit.end);
			}
			if (start < message.contentLength) projected.push({
				start,
				end: Math.min(end, message.contentLength),
				replacement,
				scalar: part.json && !token.string
			});
		}
	}
	return projected.toSorted((left, right) => left.start - right.start || left.end - right.end);
}
function firstIntersectingToken(tokens, start) {
	let low = 0;
	let high = tokens.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(tokens[middle], "bounded JSON token search").currentEnd <= start) low = middle + 1;
		else high = middle;
	}
	return low;
}
function updateCurrentToken(input, token) {
	if (token.raw || token.deferEncoding) {
		token.currentRaw = token.currentValue;
		return;
	}
	const parts = [];
	const encodedEdits = [];
	let cursor = token.start + (token.string ? 1 : 0);
	let encodedLength = 0;
	let decodedShift = 0;
	for (const edit of token.edits) {
		const start = token.string ? encodedBoundary(input, token, edit.start) : token.start + edit.start;
		const end = token.string ? encodedBoundary(input, token, edit.end) : token.start + edit.end;
		const replacement = JSON.stringify(edit.replacement).slice(1, -1);
		const encodedStart = encodedLength + start - cursor;
		const encodedEnd = encodedStart + replacement.length;
		encodedEdits.push({
			start: encodedStart,
			end: encodedEnd,
			decodedStart: edit.start + decodedShift,
			decodedEnd: edit.start + decodedShift + edit.replacement.length,
			sourceEnd: end,
			sourceDecodedEnd: edit.end,
			replacement
		});
		parts.push(input.slice(cursor, start), replacement);
		encodedLength = encodedEnd;
		decodedShift += edit.replacement.length - (edit.end - edit.start);
		cursor = end;
	}
	parts.push(input.slice(cursor, token.end - (token.string ? 1 : 0)));
	token.currentRaw = `"${parts.join("")}"`;
	token.encodedEdits = encodedEdits;
}
function currentDecodedBoundary(input, token, position, replacements) {
	const offset = position - token.currentStart - 1;
	const edits = token.encodedEdits;
	if (!edits) return decodedBoundary(input, token, token.start + 1 + offset);
	let low = 0;
	let high = edits.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(edits[middle], "current encoded edit").end < offset) low = middle + 1;
		else high = middle;
	}
	const edit = edits[low];
	if (edit && offset >= edit.start) {
		const within = offset - edit.start;
		if (!edit.replacement.includes("\\")) return edit.decodedStart + within;
		let boundaries = replacements.get(edit.replacement);
		if (!boundaries) {
			boundaries = /* @__PURE__ */ new Map();
			let decoded = 0;
			for (let encoded = 0; encoded < edit.replacement.length; decoded += 1) {
				boundaries.set(encoded, decoded);
				encoded += edit.replacement[encoded] === "\\" ? edit.replacement[encoded + 1] === "u" ? 6 : 2 : 1;
			}
			boundaries.set(edit.replacement.length, decoded);
			replacements.set(edit.replacement, boundaries);
		}
		const decoded = boundaries.get(within);
		return decoded === void 0 ? void 0 : edit.decodedStart + decoded;
	}
	const previous = edits[low - 1];
	const decoded = decodedBoundary(input, token, offset + (previous ? previous.sourceEnd - previous.end : token.start + 1));
	return decoded === void 0 ? void 0 : decoded + (previous ? previous.decodedEnd - previous.sourceDecodedEnd : 0);
}
function commitPatternEdits(token) {
	const pending = token.pending;
	token.pending = void 0;
	if (!pending) return false;
	const edits = mergeRedactionEdits(pending);
	const value = applyRedactionEdits(token.currentValue, edits);
	if (value === token.currentValue) return false;
	token.edits = composeRedactionEdits(token.value.length, token.edits, edits);
	token.currentValue = value;
	return true;
}
function changedRedactionEdits(previous, current) {
	let index = 0;
	return current.filter((edit) => {
		while (previous[index] && expectDefined(previous[index], "previous configured edit").start < edit.start) index += 1;
		const before = previous[index];
		return !before || before.start !== edit.start || before.end !== edit.end || before.replacement !== edit.replacement;
	});
}
function commitOriginalEdits(token, edits) {
	if (edits.length === 0) return false;
	const combined = mergeRedactionEdits([...token.edits, ...edits]);
	const value = applyRedactionEdits(token.value, combined);
	if (value === token.currentValue) return false;
	token.edits = combined;
	token.currentValue = value;
	return true;
}
function updateCurrentRecord(input, current, tokens, changed) {
	const parts = [];
	let cursor = 0;
	let shift = 0;
	for (const token of tokens) {
		const start = token.currentStart;
		const end = token.currentEnd;
		if (changed.has(token)) {
			updateCurrentToken(input, token);
			const raw = expectDefined(token.currentRaw, "changed JSON token");
			parts.push(current.slice(cursor, start), raw);
			cursor = end;
			token.currentStart = start + shift;
			shift += raw.length - (end - start);
		} else token.currentStart = start + shift;
		token.currentEnd = end + shift;
	}
	parts.push(current.slice(cursor));
	return parts.join("");
}
function projectedStringEnd(input, tokens, message, token, start, end) {
	const jsonParts = new Set(message.parts.filter((part) => part.json).map((part) => part.key));
	const spans = projectMessageEdits(input, tokens, message, (source) => source.string && !source.isKey && source.rootKey !== void 0 && jsonParts.has(source.rootKey) ? [{
		start: 0,
		end: source.value.length,
		replacement: ""
	}] : []).filter((span) => span.end < message.contentLength);
	const containing = rebaseRedactionEdits(token.edits, spans).filter((span) => span.start <= start && start < span.end && end <= span.end);
	return containing.length === 1 ? expectDefined(containing[0], "displayed source string").end : token.currentValue.length;
}
function redactJsonRecord(input, origins, patternPhases, getCapture, legacyFieldEdits, fieldEdits, prepEdits, skipDecodedPatterns, message, batch) {
	let tokens = batch ? [] : readScalarTokens(input, origins);
	const messageToken = message ? tokens.find((token) => !token.isKey && token.path.length === 1 && token.key === "message") : void 0;
	const replacementBoundaries = /* @__PURE__ */ new Map();
	let projectedMessageEdits = [];
	let projectedMessageValue = messageToken?.value ?? "";
	let current = input;
	const prepared = /* @__PURE__ */ new Set();
	for (const token of tokens) if (commitOriginalEdits(token, prepEdits(token))) prepared.add(token);
	if (prepared.size > 0) current = updateCurrentRecord(input, current, tokens, prepared);
	const decodedTokens = tokens.filter((token) => !token.isKey && token.string && !skipDecodedPatterns(token, token.currentValue));
	const projectMessage = () => {
		if (!messageToken || !message) return false;
		const projected = projectMessageEdits(input, tokens, message, (token) => {
			const edits = changedRedactionEdits(token.projectedEdits, token.edits);
			token.projectedEdits = token.edits;
			return edits;
		});
		if (projected.length === 0) return false;
		const sourceEdits = rebaseRedactionEdits(projectedMessageEdits, projected);
		const messageEdits = rebaseRedactionEdits(messageToken.edits, projected);
		let generatedIndex = 0;
		for (let index = 0; index < messageEdits.length; index += 1) {
			const edit = expectDefined(messageEdits[index], "projected message edit");
			const sourceEdit = expectDefined(sourceEdits[index], "projected source edit");
			const projection = expectDefined(projected[index], "source projection");
			while (messageToken.edits[generatedIndex] && expectDefined(messageToken.edits[generatedIndex], "generated message span").start < projection.start) generatedIndex += 1;
			const generated = messageToken.edits[generatedIndex];
			const scalarPromotion = projection.scalar && generated?.start === projection.start && generated.end === projection.end && edit.replacement === JSON.stringify(generated.replacement);
			const before = messageToken.currentValue.slice(edit.start, edit.end);
			if (!scalarPromotion && before !== edit.replacement && before !== projectedMessageValue.slice(sourceEdit.start, sourceEdit.end)) edit.replacement = projection.scalar ? JSON.stringify("***") : "***";
		}
		messageToken.pending = messageEdits;
		projectedMessageValue = applyRedactionEdits(projectedMessageValue, sourceEdits);
		projectedMessageEdits = composeRedactionEdits(messageToken.value.length, projectedMessageEdits, sourceEdits);
		return commitPatternEdits(messageToken);
	};
	for (const [phase, groups] of patternPhases.entries()) {
		const changed = /* @__PURE__ */ new Set();
		const pending = /* @__PURE__ */ new Set();
		const add = (token, edit) => {
			(token.pending ??= []).push(edit);
			pending.add(token);
		};
		for (const group of groups) {
			if (group.couldMatch && !group.couldMatch(current)) continue;
			for (const pattern of group.patterns) {
				if (phase === 0) for (const token of decodedTokens) for (const edit of getPatternRedactionEdits(token.currentValue, pattern, getCapture)) add(token, edit);
				else for (const match of iterateRedactMatches(current, pattern)) {
					const capture = getCapture(match, pattern);
					if (!capture || capture.end < capture.start) continue;
					if (batch && tokens.length === 0) tokens = readBatchTokens(input, origins, batch.preserveLines);
					for (let index = firstIntersectingToken(tokens, capture.start); index < tokens.length; index += 1) {
						const token = expectDefined(tokens[index], "serialized capture token");
						if (token.currentStart >= capture.end) break;
						const unquoted = token.raw || token.deferEncoding;
						const padding = unquoted ? 0 : 1;
						const captureInsideToken = capture.start >= token.currentStart + padding && capture.end <= token.currentEnd - padding;
						if (batch && token.isKey && !captureInsideToken) continue;
						const value = token.currentValue;
						if (!token.raw && !token.string && token.edits.length === 0) {
							add(token, {
								start: 0,
								end: value.length,
								replacement: "***"
							});
							continue;
						}
						let startPosition = Math.max(capture.start, token.currentStart + padding);
						let start = unquoted ? startPosition - token.currentStart : currentDecodedBoundary(input, token, startPosition, replacementBoundaries);
						let endPosition = Math.min(capture.end, token.currentEnd - padding);
						let end = unquoted ? endPosition - token.currentStart : currentDecodedBoundary(input, token, endPosition, replacementBoundaries);
						if (start === void 0 || end === void 0) {
							while (start === void 0) start = currentDecodedBoundary(input, token, --startPosition, replacementBoundaries);
							while (end === void 0) end = currentDecodedBoundary(input, token, ++endPosition, replacementBoundaries);
							const maskEnd = token === messageToken && message ? projectedStringEnd(input, tokens, message, token, start, end) : value.length;
							add(token, {
								start,
								end: maskEnd,
								replacement: "***"
							});
							continue;
						}
						if (end < start || batch && end === start) continue;
						const { start: captureStart, end: captureEnd } = capture;
						const edit = capture.redact({
							start,
							end,
							value: current.slice(Math.max(captureStart, token.currentStart + padding), Math.min(captureEnd, token.currentEnd - padding))
						});
						if (!edit) continue;
						let replacement = "***";
						if (captureInsideToken) try {
							replacement = unquoted ? edit.replacement : JSON.parse(`"${edit.replacement}"`);
						} catch {}
						add(token, {
							...edit,
							replacement
						});
					}
				}
				if (pending.size === 0) continue;
				for (const token of pending) if (!commitPatternEdits(token)) pending.delete(token);
				else if (phase === 0) changed.add(token);
				if (phase !== 0 && pending.size > 0) current = updateCurrentRecord(input, current, tokens, pending);
				pending.clear();
			}
		}
		for (const token of tokens) if (phase === 0) {
			token.pending = legacyFieldEdits(token, token.currentValue);
			if (commitPatternEdits(token)) changed.add(token);
		} else if (commitOriginalEdits(token, fieldEdits(token))) changed.add(token);
		if ((phase !== 0 || prepared.size > 0 || changed.size > 0) && projectMessage() && messageToken) changed.add(messageToken);
		if (changed.size > 0) current = updateCurrentRecord(input, current, tokens, changed);
	}
	if (messageToken && message) {
		const finished = message.finish(messageToken.currentValue);
		if (finished !== messageToken.currentValue) return applyRedactionEdits(current, [{
			start: messageToken.currentStart,
			end: messageToken.currentEnd,
			replacement: JSON.stringify(finished)
		}]);
	}
	return applyRedactionEdits(current, tokens.flatMap((token) => token.deferEncoding && token.edits.length > 0 ? [{
		start: token.currentStart,
		end: token.currentEnd,
		replacement: JSON.stringify(token.currentValue)
	}] : []));
}
//#endregion
//#region src/logging/redact-pem.ts
const PEM_REDACT_PATTERN_SOURCE = String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`;
function createState() {
	return {
		scanner: {
			offset: 0,
			phase: "search",
			dashes: 0,
			keyword: "BEGIN ",
			keywordOffset: 0,
			start: 0,
			suffix: ""
		},
		matchEnd: 0
	};
}
function resetScanner(scanner, char) {
	scanner.phase = "search";
	scanner.dashes = char === "-" ? 1 : 0;
	scanner.suffix = "";
}
function* readDelimiters(text, scanner) {
	for (let index = 0; index < text.length; index += 1) {
		if (scanner.phase === "search" && scanner.dashes === 0) {
			const nextDash = text.indexOf("-", index);
			if (nextDash === -1) {
				scanner.offset += text.length - index;
				return;
			}
			scanner.offset += nextDash - index;
			index = nextDash;
		}
		const code = text.charCodeAt(index);
		const char = code >= 97 && code <= 122 ? String.fromCharCode(code - 32) : text.charAt(index);
		const offset = scanner.offset++;
		switch (scanner.phase) {
			case "search":
				if (char === "-") scanner.dashes = Math.min(5, scanner.dashes + 1);
				else if (scanner.dashes === 5 && (char === "B" || char === "E")) {
					scanner.phase = "keyword";
					scanner.keyword = char === "B" ? "BEGIN " : "END ";
					scanner.keywordOffset = 1;
					scanner.start = offset - 5;
				} else scanner.dashes = 0;
				break;
			case "keyword":
				if (char !== scanner.keyword.charAt(scanner.keywordOffset)) resetScanner(scanner, char);
				else if (++scanner.keywordOffset === scanner.keyword.length) {
					scanner.phase = "label";
					scanner.suffix = "";
				}
				break;
			case "label":
				if (char >= "A" && char <= "Z" || char === " ") scanner.suffix = (scanner.suffix + char).slice(-11);
				else if (char === "-" && scanner.suffix === "PRIVATE KEY") {
					scanner.phase = "close";
					scanner.dashes = 1;
				} else resetScanner(scanner, char);
				break;
			case "close": if (char !== "-") resetScanner(scanner, char);
			else if (++scanner.dashes === 5) {
				scanner.phase = "search";
				scanner.suffix = "";
				yield {
					kind: scanner.keyword === "BEGIN " ? "begin" : "end",
					start: scanner.start,
					end: offset + 1
				};
			}
		}
	}
}
function consumeDelimiter(state, delimiter) {
	if (!state.open) {
		if (delimiter.kind === "begin" && delimiter.start >= state.matchEnd) state.open = {
			start: delimiter.start,
			end: delimiter.end
		};
		return;
	}
	if (delimiter.kind !== "end" || delimiter.start <= state.open.end) return;
	const block = {
		start: state.open.start,
		end: delimiter.end,
		bodyStart: state.open.end,
		bodyEnd: delimiter.start
	};
	state.open = void 0;
	state.matchEnd = delimiter.end;
	return block;
}
function* matchPem(text, context, incomplete) {
	const state = {
		...context,
		scanner: { ...context.scanner },
		open: context.open && { ...context.open }
	};
	const origin = state.scanner.offset;
	for (const delimiter of readDelimiters(text, state.scanner)) {
		const block = consumeDelimiter(state, delimiter);
		if (!block) continue;
		const start = Math.max(0, (incomplete ? block.bodyStart : block.start) - origin);
		const end = (incomplete ? block.bodyEnd : block.end) - origin;
		if (end <= start) continue;
		yield {
			match: text.slice(start, end),
			groups: [],
			input: text,
			offset: start,
			...incomplete ? { replacement: "…redacted…" } : {}
		};
	}
	if (incomplete && state.open) {
		const start = Math.max(0, state.open.end - origin);
		if (start < text.length) yield {
			match: text.slice(start),
			groups: [],
			input: text,
			offset: start,
			replacement: "…redacted…"
		};
	}
}
const PEM_REDACT_MATCHER = {
	source: PEM_REDACT_PATTERN_SOURCE,
	exec(text) {
		return matchPem(text, createState(), false);
	},
	createContext() {
		let whenClosed = false;
		let whenOpen = true;
		return {
			prepend() {
				const closed = createState();
				const open = createState();
				open.open = {
					start: -1,
					end: -1
				};
				return {
					consume(text) {
						for (const delimiter of readDelimiters(text, closed.scanner)) {
							consumeDelimiter(closed, delimiter);
							consumeDelimiter(open, delimiter);
						}
					},
					finish() {
						const nextClosed = closed.open ? whenOpen : whenClosed;
						const nextOpen = open.open ? whenOpen : whenClosed;
						whenClosed = nextClosed;
						whenOpen = nextOpen;
						return whenClosed === whenOpen;
					}
				};
			},
			pattern: {
				source: PEM_REDACT_PATTERN_SOURCE,
				exec(text) {
					const state = createState();
					if (whenClosed) state.open = {
						start: -1,
						end: -1
					};
					return matchPem(text, state, true);
				}
			}
		};
	}
};
//#endregion
//#region src/logging/redact-patterns.ts
const PAYMENT_CREDENTIAL_ENV_KEYS = String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`;
const PAYMENT_CREDENTIAL_QUERY_KEYS = String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`;
const PAYMENT_CREDENTIAL_JSON_KEYS = String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`;
const AWS_SECRET_ACCESS_KEY_FIELD_KEYS = String.raw`aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey`;
const AUTH_QUERY_KEYS = String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`;
const FORM_BODY_FIRST_PAIR_KEYS = String.raw`${AUTH_QUERY_KEYS}|app[-_]?secret|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const STANDALONE_ASSIGNMENT_SECRET_KEYS = String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS = String.raw`access-token|refresh-token|id-token|auth-token|hook-token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|passphrase`;
const CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS = String.raw`password|passphrase|pass|passwd`;
const CLI_SECRET_FLAG_KEYS = String.raw`${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const BODY_SECRET_KEYS = /* @__PURE__ */ new Set([
	"access_token",
	"auth_token",
	"awssecretaccesskey",
	"aws_secret_access_key",
	"hook_token",
	"refresh_token",
	"id_token",
	"token",
	"api_key",
	"apikey",
	"client_secret",
	"app_secret",
	"password",
	"pass",
	"passwd",
	"auth",
	"jwt",
	"session",
	"code",
	"signature",
	"x_amz_signature",
	"x_amz_security_token",
	"secret",
	"secretaccesskey",
	"credential",
	"private_key",
	"authorization",
	"key",
	"card_number",
	"card_cvc",
	"card_cvv",
	"cvc",
	"cvv",
	"security_code",
	"payment_credential",
	"shared_payment_token"
]);
const FORM_BODY_KEY_INVISIBLE_CHARS = String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`;
const ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`;
const ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`;
const STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`;
const STANDALONE_ASSIGNMENT_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60]?[^\s&#"'\x60<>]+)`;
const CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:(?:${CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*)(["'\x60])((?:(?!\2)[^\r\n])+)\2/g`;
const CONFIG_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s+)([^\s#"'\x60<>]+)/g`;
const CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:${CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS})=([^\s#"'\x60<>]+)/g`;
const CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
const CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
const STRUCTURED_JSON_SECRET_REDACT_PATTERN = String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material)"\s*:\s*"([^"]+)"`;
const STRUCTURED_JSON_PAYMENT_REDACT_PATTERN = String.raw`"(?:${PAYMENT_CREDENTIAL_JSON_KEYS})"\s*:\s*"([^"]+)"`;
const AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
const AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
const BASE64_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9])(?<!;base64,[A-Za-z0-9+/=]*)`;
const IDENTIFIER_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9_])`;
function isAwsValueCharacter(char) {
	const code = char.charCodeAt(0);
	return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || char === "/" || char === "+" || char === "=";
}
const AWS_SECRET_ACCESS_KEY_VALUE_RE = /(?=[A-Za-z0-9/+=]{0,39}[A-Z])(?=[A-Za-z0-9/+=]{0,39}[a-z])(?=[A-Za-z0-9/+=]{0,39}[0-9/+=])(?=[A-Za-z0-9/+=]{0,39}[G-Zg-z/+=])[A-Za-z0-9/+=]{40}/u;
const AWS_SECRET_ACCESS_KEY_RUN_RE = /[A-Za-z0-9/+=]{40}/u;
function couldMatchAwsSecretAccessKey(text) {
	return text.length >= 40 && AWS_SECRET_ACCESS_KEY_RUN_RE.test(text) && AWS_SECRET_ACCESS_KEY_VALUE_RE.test(text);
}
const AWS_VALUE_WHITESPACE_RE = /\s/;
const AWS_URL_SCHEME_CHARACTER_RE = /[A-Za-z0-9+.-]/;
const AWS_URL_SCHEME_START_RE = /[A-Za-z]/;
function* matchAwsSecretAccessKeys(text) {
	if (!couldMatchAwsSecretAccessKey(text)) return;
	const closingDelimiters = {
		"\"": "\"",
		"'": "'",
		"`": "`",
		"<": ">",
		"(": ")",
		"[": "]",
		"{": "}"
	};
	let runStart = -1;
	let schemeStart = -1;
	let url;
	let backslashes = 0;
	const runs = [];
	for (let index = 0; index <= text.length; index++) {
		const char = text[index] ?? "";
		const whitespace = index === text.length || AWS_VALUE_WHITESPACE_RE.test(char);
		const escapeDepth = backslashes;
		backslashes = char === "\\" ? backslashes + 1 : 0;
		if (char && isAwsValueCharacter(char)) {
			if (runStart === -1) runStart = index;
		} else if (runStart !== -1) {
			if (index - runStart === 40) runs.push({
				start: runStart,
				end: index,
				origin: runStart,
				url
			});
			else if (index - runStart > 40 && char === "@" && text[index - 41] === "/") runs.push({
				start: index - 40,
				end: index,
				origin: runStart,
				url
			});
			runStart = -1;
		}
		if (whitespace) {
			if (url) url.end = Math.min(url.end, index);
			for (const run of runs) {
				const context = run.url;
				const publicUrl = context && !context.hasAt && context.portValid && (context.portStart === -1 || (context.authorityEnd === -1 ? context.end : context.authorityEnd) > context.portStart + 1);
				const before = text[run.start - 1] ?? "";
				const after = text[run.end] ?? "";
				const slashCredential = run.start !== run.origin;
				const portCredential = context && context.portStart !== -1 && run.origin === context.portStart + 1 && context.authorityEnd > run.origin && run.end > context.authorityEnd && after === "@";
				if (!slashCredential && (before === "_" || isAwsValueCharacter(before)) || after === "_" || text.slice(run.origin - 8, run.origin) === ";base64," || publicUrl && !portCredential && run.start >= context.start && run.end <= context.end) continue;
				const match = text.slice(run.start, run.end);
				if (AWS_SECRET_ACCESS_KEY_VALUE_RE.test(match)) yield {
					match,
					groups: [match],
					input: text,
					offset: run.start
				};
			}
			runs.length = 0;
			schemeStart = -1;
			url = void 0;
			continue;
		}
		if (url && index >= url.start) {
			if (char === url.closing && escapeDepth === url.closingEscapeDepth) {
				url.end = Math.min(url.end, index);
				url = void 0;
			} else {
				if ("?#\"'<>`|()[]{}".includes(char)) url.end = Math.min(url.end, index);
				url.queryOrFragment ||= char === "?" || char === "#";
				if (url.authorityEnd === -1) {
					url.hasAt ||= char === "@";
					if ("/?#".includes(char)) url.authorityEnd = index;
					else if (index < url.end) {
						if (char === ":") {
							url.portValid &&= url.portStart === -1;
							url.portStart = index;
						} else if (url.portStart !== -1 && (char < "0" || char > "9")) url.portValid = false;
					}
				}
			}
		}
		if (AWS_URL_SCHEME_CHARACTER_RE.test(char)) {
			if (schemeStart === -1) schemeStart = index;
		} else {
			if ((!url || index >= url.end && !url.queryOrFragment) && char === ":" && text.startsWith("//", index + 1) && schemeStart !== -1 && AWS_URL_SCHEME_START_RE.test(text[schemeStart])) {
				const opening = text[schemeStart - 1];
				let closingEscapeDepth = 0;
				for (let offset = schemeStart - 2; offset >= 0 && text[offset] === "\\"; offset--) closingEscapeDepth++;
				url = {
					start: index + 3,
					end: text.length,
					authorityEnd: -1,
					portStart: -1,
					portValid: true,
					hasAt: false,
					queryOrFragment: false,
					closing: opening ? closingDelimiters[opening] : void 0,
					closingEscapeDepth
				};
			}
			schemeStart = -1;
		}
	}
}
const AWS_SECRET_ACCESS_KEY_MATCHER = Object.freeze({
	source: "aws-secret-access-key",
	exec: matchAwsSecretAccessKeys,
	couldMatch: couldMatchAwsSecretAccessKey
});
const TELEGRAM_BOT_TOKEN_REDACT_PATTERN = String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const TELEGRAM_TOKEN_REDACT_PATTERN = String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const CREDENTIAL_STYLE_HEADER_KEYS = "x-goog-api-key|api-key|apikey|x-api-token|x-access-token";
const GATEWAY_SECURITY_HEADER_KEYS = "X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token";
const CREDENTIAL_HEADER_FIELD_RE = new RegExp(`^(?:${CREDENTIAL_STYLE_HEADER_KEYS}|${GATEWAY_SECURITY_HEADER_KEYS})$`, "i");
const LOG_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_?&-]|\\{1,64}[rn])`;
const CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*:${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*=${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*:\s*([^\s"',;]+)`;
const GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*=\s*([^\s"',;]+)`;
const FORM_AWARE_EQUALS_ASSIGNMENT_PATTERN_SOURCES = /* @__PURE__ */ new Set([CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN, GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN]);
const HTTP_AUTH_HEADER_REDACT_PATTERNS = [
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
	CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN,
	CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN
];
const AUTHORIZATION_BEARER_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const AUTHORIZATION_BASIC_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const AUTHORIZATION_BOT_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bot${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const STANDALONE_BEARER_REDACT_PATTERN = String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`;
const SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES = /* @__PURE__ */ new Set([
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN
]);
const CHUNK_UNSAFE_PATTERN_SOURCES = /* @__PURE__ */ new Set([
	TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
	TELEGRAM_TOKEN_REDACT_PATTERN,
	AUTHORIZATION_BEARER_REDACT_PATTERN,
	AUTHORIZATION_BASIC_REDACT_PATTERN,
	AUTHORIZATION_BOT_REDACT_PATTERN,
	STANDALONE_BEARER_REDACT_PATTERN,
	...HTTP_AUTH_HEADER_REDACT_PATTERNS
]);
const DEFAULT_REDACT_FIELD_PATTERNS = [
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STRUCTURED_JSON_SECRET_REDACT_PATTERN,
	STRUCTURED_JSON_PAYMENT_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN,
	String.raw`--(?:${CLI_SECRET_FLAG_KEYS})=([^\s"']+)`,
	String.raw`--(?:${CLI_SECRET_FLAG_KEYS})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,
	AUTHORIZATION_BEARER_REDACT_PATTERN,
	AUTHORIZATION_BASIC_REDACT_PATTERN,
	AUTHORIZATION_BOT_REDACT_PATTERN,
	...HTTP_AUTH_HEADER_REDACT_PATTERNS,
	GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN,
	GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN,
	STANDALONE_BEARER_REDACT_PATTERN,
	String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,
	String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,
	String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN,
	PEM_REDACT_PATTERN_SOURCE,
	String.raw`(^|[\s,{])["']?(?:${AWS_SECRET_ACCESS_KEY_FIELD_KEYS})["']?\s*[:=]\s*(["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])\2`
];
const VENDOR_TOKEN_REDACT_PATTERNS = [
	String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
	String.raw`(ghp_[A-Za-z0-9]{10,})`,
	String.raw`(github_pat_[A-Za-z0-9_]{10,})`,
	String.raw`(gho_[A-Za-z0-9]{10,})`,
	String.raw`(ghu_[A-Za-z0-9]{10,})`,
	String.raw`(ghs_[A-Za-z0-9]{10,})`,
	String.raw`(ghr_[A-Za-z0-9]{10,})`,
	String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,
	String.raw`(gloas-(?:[A-Fa-f0-9]{65,}|[A-Za-z0-9_-]{64}|[A-Fa-f0-9]{32,}))`,
	String.raw`(gldt-[A-Za-z0-9_-]{20,})`,
	String.raw`(glcbt-[A-Za-z0-9]{1,5}_[A-Za-z0-9_-]{20,})`,
	String.raw`(glptt-[A-Za-z0-9_-]{40,})`,
	String.raw`(glft-(?:[A-Za-z0-9_-]{20,}|[a-h0-9]+-[0-9]+_))`,
	String.raw`(glimt-[A-Za-z0-9_-]{25,})`,
	String.raw`(glagent-[A-Za-z0-9_-]{50,})`,
	String.raw`(glwt-[A-Za-z0-9_-]{20,})`,
	String.raw`(glsoat-[A-Za-z0-9_-]{20,})`,
	String.raw`(glffct-[A-Za-z0-9_-]{20,})`,
	String.raw`(glrt-[A-Za-z0-9._-]{20,})`,
	String.raw`(glrtr?-[A-Za-z0-9_-]{27,300}\.[0-9a-z]{2}\.[0-9a-z]{9})`,
	String.raw`(GR1348941[A-Za-z0-9_-]{20,})`,
	String.raw`(_gitlab_session=[A-Za-z0-9%._-]{20,})`,
	String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,
	String.raw`(xapp-[A-Za-z0-9-]{10,})`,
	String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,
	String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,
	String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,
	String.raw`(gsk_[A-Za-z0-9_-]{10,})`,
	String.raw`(AIza[0-9A-Za-z\-_]{20,})`,
	String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,
	String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,
	String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
	String.raw`(pplx-[A-Za-z0-9_-]{10,})`,
	String.raw`(fal_[A-Za-z0-9_-]{10,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fc-[A-Za-z0-9]{10,})`,
	String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(gAAAA[A-Za-z0-9_=-]{20,})`,
	String.raw`(sk_live_[A-Za-z0-9]{10,})`,
	String.raw`(sk_test_[A-Za-z0-9]{10,})`,
	String.raw`(rk_live_[A-Za-z0-9]{10,})`,
	String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
	String.raw`(npm_[A-Za-z0-9]{10,})`,
	String.raw`(pypi-[A-Za-z0-9_-]{10,})`,
	String.raw`(dop_v1_[A-Za-z0-9]{10,})`,
	String.raw`(doo_v1_[A-Za-z0-9]{10,})`,
	String.raw`(dor_v1_[A-Za-z0-9]{10,})`,
	String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,
	String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,
	String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,
	String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,
	String.raw`(bkua_[a-z0-9]{40})`,
	String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,
	String.raw`(sbp_[a-z0-9]{40})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(dapi[0-9a-f]{32}(?:-\d)?)`,
	String.raw`(dd[pw]_[A-Za-z0-9]{36})`,
	String.raw`(glsa_[A-Za-z0-9_]{41})`,
	String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,
	String.raw`(nfp_[A-Za-z0-9_]{36})`,
	String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATBB[A-Za-z0-9_=.-]{16,})`,
	String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,
	String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,
	String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,
	String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,
	String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,
	String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,
	String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,
	String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,
	String.raw`(tvly-[A-Za-z0-9]{10,})`,
	String.raw`(exa_[A-Za-z0-9]{10,})`,
	String.raw`(syt_[A-Za-z0-9]{10,})`,
	String.raw`(retaindb_[A-Za-z0-9]{10,})`,
	String.raw`(hsk-[A-Za-z0-9]{10,})`,
	String.raw`(mem0_[A-Za-z0-9]{10,})`,
	String.raw`(brv_[A-Za-z0-9]{10,})`,
	String.raw`(xai-[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw-[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw_[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fpk_[A-Za-z0-9]{30,})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(AKIA[A-Z0-9]{16})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ASIA[A-Z0-9]{16})`,
	String.raw`(AKID[A-Za-z0-9]{10,})`,
	String.raw`(LTAI[A-Za-z0-9]{10,})`,
	String.raw`(hf_[A-Za-z0-9]{10,})`,
	String.raw`(api_org_[A-Za-z0-9]{20,})`,
	String.raw`(r8_[A-Za-z0-9]{10,})`,
	TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
	TELEGRAM_TOKEN_REDACT_PATTERN
];
const DEFAULT_REDACT_STRING_PATTERNS = [...DEFAULT_REDACT_FIELD_PATTERNS, ...VENDOR_TOKEN_REDACT_PATTERNS];
const DEFAULT_REDACT_PATTERNS = [...DEFAULT_REDACT_STRING_PATTERNS, AWS_SECRET_ACCESS_KEY_MATCHER];
const TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS = /* @__PURE__ */ new Set([
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STRUCTURED_JSON_SECRET_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN
]);
const TOOL_PAYLOAD_REDACT_PATTERNS = DEFAULT_REDACT_PATTERNS.filter((pattern) => typeof pattern !== "string" || !TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS.has(pattern));
//#endregion
//#region src/logging/redact-performance.ts
const redactionPerformance = channel("openclaw.redaction");
/** The capture subscriber receives counts and synchronous CPU time, never text or patterns. */
function startRedactionMeasurement(operation) {
	if (!redactionPerformance.hasSubscribers) return;
	const startedAt = performance.now();
	const cpu = process.threadCpuUsage();
	return (outcome, inputChars, patternCount) => {
		const elapsedMs = performance.now() - startedAt;
		const used = process.threadCpuUsage(cpu);
		redactionPerformance.publish({
			operation,
			outcome,
			pid: process.pid,
			threadId,
			isMainThread,
			elapsedMs,
			threadCpuMs: (used.user + used.system) / 1e3,
			...inputChars === void 0 ? {} : { inputChars },
			...patternCount === void 0 ? {} : { patternCount }
		});
	};
}
//#endregion
//#region src/shared/http-error-response.ts
const HTML_ERROR_PREFIX_RE$1 = /^\s*(?:<!doctype\s+html\b|<html\b)/i;
function extractHttpResponseBody(status) {
	if (!status) return null;
	if (HTML_ERROR_PREFIX_RE$1.test(status.rest)) return {
		code: status.code,
		body: status.rest
	};
	const lineBreak = status.rest.indexOf("\n");
	return {
		code: status.code,
		body: lineBreak === -1 ? status.rest : status.rest.slice(lineBreak + 1).trimStart()
	};
}
//#endregion
//#region src/shared/assistant-error-format.ts
const ERROR_PAYLOAD_PREFIX_RE = /^(?:error|(?:[a-z][\w-]*\s+)?api\s*error|apierror|openai\s*error|anthropic\s*error|gateway\s*error|codex\s*error)(?:\s+\d{3})?[:\s-]+/i;
const HTTP_STATUS_DELIMITER_RE = /(?:\s*:\s*|\s+)/;
const HTTP_STATUS_PREFIX_RE = new RegExp(`^(?:http\\s*)?(\\d{3})${HTTP_STATUS_DELIMITER_RE.source}(.+)$`, "i");
const HTTP_STATUS_CODE_PREFIX_RE = new RegExp(`^(?:http\\s*)?(\\d{3})(?:${HTTP_STATUS_DELIMITER_RE.source}([\\s\\S]+))?$`, "i");
const PROVIDER_WRAPPED_HTTP_STATUS_RE = /^(?:[a-z][\w-]*(?:\s+[a-z][\w-]*){0,3}\s+)?api\s*error\s*\((\d{3})\)(?:\s*:\s*([\s\S]*))?$/i;
const LABELED_HTTP_STATUS_RE = /^(?:status code|unexpected status|http status)\s*[:=]?\s*(\d{3})\b(?:\s*[:,]?\s*(?:message\s*:\s*)?([\s\S]*))?$/i;
const ERROR_STATUS_ENVELOPE_RE = /^error\s*[:,]\s*/i;
const HTML_ERROR_PREFIX_RE = /^\s*(?:<!doctype\s+html\b|<html\b)/i;
const HTML_CLOSE_RE = /<\/html>/i;
const CLOUDFLARE_HTML_ERROR_CODES = /* @__PURE__ */ new Set([
	521,
	522,
	523,
	524,
	525,
	526,
	530
]);
const STANDALONE_HTML_ERROR_HINT_RE = /\bcloudflare\b|cdn-cgi\/challenge-platform|challenge-error-text|enable javascript and cookies to continue|access denied|forbidden|service unavailable|bad gateway|web server is down|captcha|attention required/i;
const GENERIC_PROVIDER_INTERNAL_ERROR_RE = /an error occurred while processing your request/i;
const SUPPORT_REQUEST_ID_RE = /(?:request[\s_-]*id)\s*[:#]?\s*([a-z0-9][a-z0-9_-]{6,}[a-z0-9])/i;
const GENERIC_PROVIDER_INTERNAL_ERROR_USER_MESSAGE = "The AI service returned an internal error. Please try again in a moment.";
const MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE = "OpenClaw transport error: malformed_streaming_fragment";
const MALFORMED_STREAMING_FRAGMENT_USER_MESSAGE = "LLM streaming response contained a malformed fragment. Please try again.";
function formatProviderRefusalText(message) {
	const refusal = Array.isArray(message.diagnostics) ? message.diagnostics.find((diagnostic) => asOptionalRecord(diagnostic)?.type === "provider_refusal") : void 0;
	if (!refusal) return;
	const category = asOptionalRecord(asOptionalRecord(refusal)?.details)?.category;
	const safeCategory = typeof category === "string" && /^[a-z0-9_-]{1,64}$/i.test(category) ? category : void 0;
	if (safeCategory === "misalignment") return "Chat stopped as a precaution. Review the findings in chat before continuing.";
	return `The provider refused this request${safeCategory ? ` (category: ${safeCategory})` : ""}. Revise the request and try again.`;
}
function isErrorPayloadObject(payload) {
	const record = asOptionalRecord(payload);
	if (!record) return false;
	if (record.type === "error") return true;
	if (typeof record.request_id === "string" || typeof record.requestId === "string") return true;
	const error = asOptionalRecord(record.error);
	return [
		error?.message,
		error?.type,
		error?.code
	].some((value) => typeof value === "string") || typeof record.error === "string" && typeof record.message === "string";
}
function parseApiErrorPayload(raw) {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const candidate = trimmed.replace(ERROR_PAYLOAD_PREFIX_RE, "").trim();
	if (!candidate.startsWith("{") || !candidate.endsWith("}")) return null;
	try {
		const parsed = JSON.parse(candidate);
		return isErrorPayloadObject(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function extractHttpStatusMatch(match) {
	if (!match) return null;
	const code = Number(match[1]);
	if (!Number.isInteger(code) || code < 100 || code > 599) return null;
	return {
		code,
		rest: (match[2] ?? "").trim()
	};
}
function extractLeadingHttpStatus(raw) {
	return extractHttpStatusMatch(raw.match(HTTP_STATUS_CODE_PREFIX_RE));
}
function extractProviderWrappedHttpStatus(raw) {
	return extractHttpStatusMatch(raw.match(PROVIDER_WRAPPED_HTTP_STATUS_RE));
}
/** Extract an explicitly labeled provider HTTP status without matching embedded numeric text. */
function extractErrorHttpStatus(raw) {
	const candidate = raw.trim().replace(ERROR_STATUS_ENVELOPE_RE, "");
	return extractLeadingHttpStatus(candidate) ?? extractProviderWrappedHttpStatus(candidate) ?? extractHttpStatusMatch(candidate.match(LABELED_HTTP_STATUS_RE));
}
function isCloudflareOrHtmlErrorPage(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (HTML_ERROR_PREFIX_RE.test(trimmed) && HTML_CLOSE_RE.test(trimmed) && STANDALONE_HTML_ERROR_HINT_RE.test(trimmed)) return true;
	const status = extractHttpResponseBody(extractLeadingHttpStatus(trimmed));
	if (!status || status.code < 500) return false;
	if (CLOUDFLARE_HTML_ERROR_CODES.has(status.code)) return true;
	return status.code < 600 && HTML_ERROR_PREFIX_RE.test(status.body) && HTML_CLOSE_RE.test(status.body);
}
function isGenericProviderInternalError(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	return GENERIC_PROVIDER_INTERNAL_ERROR_RE.test(trimmed) && (/help\.openai\.com/i.test(trimmed) || SUPPORT_REQUEST_ID_RE.test(trimmed));
}
function parseApiErrorInfo(raw) {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	let httpCode;
	let candidate = trimmed;
	const httpPrefix = extractLeadingHttpStatus(candidate);
	if (httpPrefix) {
		httpCode = String(httpPrefix.code);
		candidate = httpPrefix.rest;
	}
	let payload = parseApiErrorPayload(candidate);
	if (!payload) return null;
	for (let depth = 0; depth < 4; depth++) {
		const attempts = asOptionalRecord(payload.error)?.attempts;
		const details = (Array.isArray(attempts) ? asOptionalRecord(attempts.at(-1)) : void 0)?.details;
		if (!isErrorPayloadObject(details)) break;
		payload = details;
	}
	const error = asOptionalRecord(payload.error);
	const errorCode = readStringField(error, "code");
	const errorType = readStringField(error, "type");
	const type = error ? errorCode !== void 0 && !errorType ? errorCode : errorType : readStringField(payload, "error");
	const code = errorCode ?? readStringField(payload, "code");
	return {
		httpCode,
		type: type ?? readStringField(payload, "type"),
		...code === void 0 ? {} : { code },
		message: readStringField(error, "message") ?? readStringField(payload, "message"),
		requestId: readStringField(payload, "request_id") ?? readStringField(payload, "requestId")
	};
}
function formatRawAssistantErrorForUi(raw) {
	const trimmed = (raw ?? "").trim();
	if (!trimmed) return "LLM request failed with an unknown error.";
	if (trimmed === "OpenClaw transport error: malformed_streaming_fragment") return MALFORMED_STREAMING_FRAGMENT_USER_MESSAGE;
	if (isGenericProviderInternalError(trimmed)) return GENERIC_PROVIDER_INTERNAL_ERROR_USER_MESSAGE;
	const leadingStatus = extractLeadingHttpStatus(trimmed);
	const isHtmlChallenge = isCloudflareOrHtmlErrorPage(trimmed);
	if (leadingStatus && isHtmlChallenge) return `The AI service is temporarily unavailable (HTTP ${leadingStatus.code}). Please try again in a moment.`;
	if (isHtmlChallenge) return "The provider returned an HTML error page instead of an API response. This usually means a CDN or gateway (e.g. Cloudflare) blocked the request. Retry in a moment or check provider status.";
	const httpMatch = extractHttpStatusMatch(trimmed.match(HTTP_STATUS_PREFIX_RE));
	if (httpMatch) {
		if (!httpMatch.rest.startsWith("{")) return `HTTP ${httpMatch.code}: ${httpMatch.rest}`;
	}
	const info = parseApiErrorInfo(trimmed);
	if (info?.message) return `${info.httpCode ? `HTTP ${info.httpCode}` : "LLM error"}${info.type ? ` ${info.type}` : ""}: ${info.message}`;
	return trimmed.length > 600 ? `${truncateUtf16Safe(trimmed, 600)}…` : trimmed;
}
const REFUSED_TRANSPORT_CODE_RE = /\beconnrefused\b/i;
const INTERRUPTED_TRANSPORT_CODE_RE = /\beconnreset\b|\beconnaborted\b|\benetreset\b|\bepipe\b/i;
const DNS_TRANSPORT_CODE_RE = /\benotfound\b|\beai_again\b/i;
const UNREACHABLE_TRANSPORT_CODE_RE = /\benetunreach\b|\behostunreach\b|\behostdown\b/i;
function isKnownTransportErrorCode(value) {
	return [
		REFUSED_TRANSPORT_CODE_RE,
		INTERRUPTED_TRANSPORT_CODE_RE,
		DNS_TRANSPORT_CODE_RE,
		UNREACHABLE_TRANSPORT_CODE_RE
	].some((pattern) => pattern.exec(value)?.[0] === value);
}
function formatTransportErrorCopy(raw) {
	if (!raw || isCloudflareOrHtmlErrorPage(raw)) return;
	const lower = normalizeLowercaseStringOrEmpty(raw);
	if (REFUSED_TRANSPORT_CODE_RE.test(raw) || lower.includes("connection refused") || lower.includes("actively refused")) return "LLM request failed: connection refused by the provider endpoint.";
	if (INTERRUPTED_TRANSPORT_CODE_RE.test(raw) || lower.includes("socket hang up") || lower.includes("connection reset") || lower.includes("connection aborted")) return "LLM request failed: network connection was interrupted.";
	if (DNS_TRANSPORT_CODE_RE.test(raw) || lower.includes("getaddrinfo") || lower.includes("no such host") || lower.includes("dns")) return "LLM request failed: DNS lookup for the provider endpoint failed.";
	if (UNREACHABLE_TRANSPORT_CODE_RE.test(raw) || lower.includes("network is unreachable") || lower.includes("host is unreachable")) return "LLM request failed: the provider endpoint is unreachable from this host.";
	if (lower.includes("fetch failed") || lower.includes("connection error") || lower.includes("network request failed")) return "LLM request failed: network connection error.";
	if (raw.includes("网络错误") || raw.includes("网络异常") || raw.includes("连接错误")) return "LLM request failed: provider reported a network error.";
}
//#endregion
//#region src/logging/structured-authorization-code.ts
function pathEndsWith(path, suffix) {
	if (path.length < suffix.length) return false;
	return suffix.every((part, index) => path[path.length - suffix.length + index] === part);
}
function shouldRedactStructuredAuthorizationCode(normalizedKey, path, transportCode) {
	if (normalizedKey !== "code") return false;
	const normalizedPath = path.map((part) => part.toLowerCase());
	if (normalizedPath.length === 1 || pathEndsWith(normalizedPath, ["error", "code"]) || pathEndsWith(normalizedPath, ["nodeerror", "code"]) || pathEndsWith(normalizedPath, ["status", "code"]) || pathEndsWith(normalizedPath, ["details", "code"]) || pathEndsWith(normalizedPath, ["warnings", "code"])) return false;
	return !(transportCode !== void 0 && normalizedPath.length > 1 && normalizedPath.slice(0, -1).every((part) => part === "cause") && isKnownTransportErrorCode(transportCode));
}
//#endregion
//#region src/logging/redact.ts
const DEFAULT_REDACT_MODE = "tools";
const DEFAULT_REDACT_MIN_LENGTH = 18;
const DEFAULT_REDACT_KEEP_START = 6;
const shellReferencePreservingPatterns = /* @__PURE__ */ new WeakSet();
const chunkUnsafePatterns = /* @__PURE__ */ new WeakSet();
const formAwareEqualsAssignmentPatterns = /* @__PURE__ */ new WeakSet();
const sourceAssignmentPatterns = /* @__PURE__ */ new WeakSet();
let defaultResolvedPatterns;
let toolPayloadResolvedPatterns;
const FORM_BODY_KEY_OBFUSCATION_RE = new RegExp(String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]`, "gu");
const FORM_BODY_KEY_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
const FORM_BODY_PERCENT_ESCAPE_RE = /%[0-9A-Fa-f]{2}/u;
const FORM_BODY_KEY = String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${FORM_BODY_KEY_INVISIBLE_CHARS}+])*`;
const FORM_BODY_VALUE = "[^&\\s<>]*";
const URL_QUERY_VALUE = "[^&#\\s<>]*";
const FORM_BODY_PAIR = String.raw`${FORM_BODY_KEY}=${FORM_BODY_VALUE}`;
const FORM_BODY_RE = new RegExp(String.raw`^${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+$`, "u");
const FORM_BODY_SUBSTRING_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`])(${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+)`, "gu");
const ENCODED_FORM_PAIR_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`&])(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})`, "gu");
const FORM_BODY_CONTEXT_SINGLE_PAIR_RE = new RegExp(String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})(["'\x60]?)`, "giu");
const URL_QUERY_PAIR_RE = new RegExp(String.raw`([?&])(${FORM_BODY_KEY})=(${URL_QUERY_VALUE})`, "gu");
const SECRET_VALUE_TRAILING_DELIMITER_RE = /(["'`,;)}\]]+)$/u;
const SECRET_VALUE_SUFFIX_RE = /^["'`,;)}\]]*$/u;
const SECRET_VALUE_QUOTE_CHARS = /* @__PURE__ */ new Set([
	"\"",
	"'",
	"`"
]);
const FORM_BODY_LINE_BREAK_SPLIT_RE = /(\r\n|\r|\n)/u;
const FORM_BODY_LINE_BREAK_SEGMENT_RE = /^(?:\r\n|\r|\n)$/u;
const STRUCTURED_SECRET_FIELD_RE = new RegExp(String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${PAYMENT_CREDENTIAL_QUERY_KEYS}|${PAYMENT_CREDENTIAL_JSON_KEYS})$`, "i");
const STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE = /^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u;
const STRUCTURED_APP_PASSWORD_FIELD_RE = /^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i;
const APP_SPECIFIC_PASSWORD_RE = /\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g;
const BENIGN_APP_PASSWORD_WORDS = /* @__PURE__ */ new Set([
	"case",
	"claw",
	"demo",
	"file",
	"main",
	"name",
	"open",
	"path",
	"slug",
	"test"
]);
const STRUCTURED_SECRET_ENV_FIELD_RE = new RegExp(String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})$`, "i");
const DEFAULT_REDACT_PREFILTER_SOURCES = [
	String.raw`KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|PRIVATE KEY`,
	String.raw`security[-_]?code|\bpass\s*[=:]|\bpassphrase\s*[=:]|_(?:password|pass|passphrase|passwd)\s*[=:]|jwt\s*[=:]|session=|code=|\bsig\s*=`,
	String.raw`\bBearer\s+`,
	String.raw`:\/\/[^\/\s:@]*:[^\s@]+@`,
	String.raw`sk-|gh[opsur]_|github_pat_|glpat-|gloas-|gldt-|glcbt-|glptt-|glft-|glimt-|glagent-|glwt-|glsoat-|glffct-|glrt-|glrtr-|GR1348941|_gitlab_session=|xox[baprs]-|xapp-|hooks\.slack\.com|discord|gsk_|AIza|ya29\.|1\/\/0|eyJ|pplx-|fal_|fc-|bb_live_|gAAAA|[sr]k_(?:live|test)_|SG\.|npm_|pypi-|do[opr]_v1_|dp\.(?:ct|pt|sa|st|scim|audit)\.|dckr_|bkua_|CCIPAT_|sbp_|dapi[0-9a-f]|dd[pw]_|glsa_|nfp_|CFPAT-|ATCTT3|ATATT|ATBB|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|FlyV1|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_`,
	String.raw`(?:^|[^A-Za-z0-9_])(?:am_|sk_)`,
	String.raw`A[KS]IA[A-Z0-9]|AKID|LTAI|hf_|api_org_|r8_`,
	String.raw`\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}`,
	String.raw`%[0-9A-Fa-f]{2}[${FORM_BODY_KEY_INVISIBLE_CHARS}+A-Za-z0-9_%.-]*=`,
	String.raw`=(?<=(?:\+|[${FORM_BODY_KEY_INVISIBLE_CHARS}])(?:[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*[A-Za-z0-9_%.-])+[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*=)|=(?<=[A-Za-z0-9_%.-][${FORM_BODY_KEY_INVISIBLE_CHARS}+]+=)`
];
const DEFAULT_REDACT_PREFILTER_RE = new RegExp(`(?:${DEFAULT_REDACT_PREFILTER_SOURCES.join("|")})`, "iu");
const FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE = /JWT|Bearer\s+|am_|sk_|(?<!\d)\d{6,}:[A-Za-z0-9_-]{20,}/i;
function normalizeMode(value) {
	return value === "off" ? "off" : DEFAULT_REDACT_MODE;
}
function parsePattern(raw) {
	if (raw === PEM_REDACT_PATTERN_SOURCE) return PEM_REDACT_MATCHER;
	if (typeof raw !== "string" && !(raw instanceof RegExp)) return raw;
	let pattern = null;
	if (raw instanceof RegExp) {
		if (raw.flags.includes("g")) pattern = raw;
		else pattern = new RegExp(raw.source, `${raw.flags}g`);
	} else if (raw.trim()) pattern = compileConfigRegex(...parseRedactPatternSource(raw))?.regex ?? null;
	if (pattern && typeof raw === "string" && SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES.has(raw)) shellReferencePreservingPatterns.add(pattern);
	if (pattern && typeof raw === "string" && TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS.has(raw)) sourceAssignmentPatterns.add(pattern);
	if (pattern && typeof raw === "string" && FORM_AWARE_EQUALS_ASSIGNMENT_PATTERN_SOURCES.has(raw)) formAwareEqualsAssignmentPatterns.add(pattern);
	if (pattern && typeof raw === "string" && (raw.startsWith(BASE64_SAFE_TOKEN_BOUNDARY) || raw.startsWith(IDENTIFIER_SAFE_TOKEN_BOUNDARY) || CHUNK_UNSAFE_PATTERN_SOURCES.has(raw))) chunkUnsafePatterns.add(pattern);
	return pattern;
}
function resolvePatterns(value) {
	if (value === TOOL_PAYLOAD_REDACT_PATTERNS) {
		toolPayloadResolvedPatterns ??= TOOL_PAYLOAD_REDACT_PATTERNS.map(parsePattern).filter((re) => Boolean(re));
		return toolPayloadResolvedPatterns;
	}
	if (!value?.length || value === DEFAULT_REDACT_PATTERNS) {
		defaultResolvedPatterns ??= DEFAULT_REDACT_PATTERNS.map(parsePattern).filter((re) => Boolean(re));
		return defaultResolvedPatterns;
	}
	return [.../* @__PURE__ */ new Set([...value.map(parsePattern).filter((re) => Boolean(re)), AWS_SECRET_ACCESS_KEY_MATCHER])];
}
function usesBuiltInRedactPatterns(value) {
	return !value?.length || value === DEFAULT_REDACT_PATTERNS || value === TOOL_PAYLOAD_REDACT_PATTERNS;
}
function maskToken(token) {
	if (token === "***") return token;
	if (token.length < DEFAULT_REDACT_MIN_LENGTH) return "***";
	return `${sliceUtf16Safe(token, 0, DEFAULT_REDACT_KEEP_START)}…${sliceUtf16Safe(token, -4)}`;
}
function splitSecretValueForMask(token) {
	const openingQuote = token[0] ?? "";
	if (SECRET_VALUE_QUOTE_CHARS.has(openingQuote)) {
		const closingQuoteIndex = token.lastIndexOf(openingQuote);
		if (closingQuoteIndex > 0) {
			const suffix = token.slice(closingQuoteIndex + 1);
			if (SECRET_VALUE_SUFFIX_RE.test(suffix)) return {
				maskable: token.slice(1, closingQuoteIndex),
				suffix,
				maskStart: 0,
				maskEnd: closingQuoteIndex + 1
			};
		}
		const tokenWithoutLeadingQuote = token.slice(1);
		const trailingDelimiter = tokenWithoutLeadingQuote.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
		const maskable = trailingDelimiter && trailingDelimiter.length < tokenWithoutLeadingQuote.length ? tokenWithoutLeadingQuote.slice(0, -trailingDelimiter.length) : tokenWithoutLeadingQuote;
		return {
			maskable,
			suffix: trailingDelimiter && trailingDelimiter.length < tokenWithoutLeadingQuote.length ? trailingDelimiter : "",
			maskStart: 0,
			maskEnd: 1 + maskable.length
		};
	}
	const trailingDelimiter = token.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
	const maskable = trailingDelimiter && trailingDelimiter.length < token.length ? token.slice(0, -trailingDelimiter.length) : token;
	return {
		maskable,
		suffix: maskable === token ? "" : trailingDelimiter,
		maskStart: 0,
		maskEnd: maskable.length
	};
}
function splitFormAwareCredentialValue(token) {
	const pairBoundary = token.search(/&[A-Za-z_][A-Za-z0-9_.-]*=/u);
	return pairBoundary < 0 ? {
		secret: token,
		suffix: ""
	} : {
		secret: token.slice(0, pairBoundary),
		suffix: token.slice(pairBoundary)
	};
}
function maskSecretValue(token, options) {
	const { maskable, suffix } = splitSecretValueForMask(token);
	return `${options?.hinted ? maskToken(maskable) : "***"}${suffix}`;
}
function normalizeSensitiveKeyName(value) {
	const stripped = value.replace(FORM_BODY_KEY_SEPARATOR_RE, "");
	try {
		return decodeURIComponent(stripped).replace(FORM_BODY_KEY_SEPARATOR_RE, "").toLowerCase().replaceAll("-", "_");
	} catch {
		return stripped.toLowerCase().replaceAll("-", "_");
	}
}
function isSensitiveBodyKey(key) {
	return isSensitiveUrlQueryParamName(key) || BODY_SECRET_KEYS.has(normalizeSensitiveKeyName(key));
}
function hasEncodedOrInvisibleFormKey(key) {
	return FORM_BODY_PERCENT_ESCAPE_RE.test(key) || key.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") !== key;
}
function visitSensitiveAssignments(text, kind, visit) {
	if (!text || kind === "url" && !text.includes("?")) return;
	if (kind === "encoded" && !text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text) return;
	if (kind === "context" && !/[=:]/u.test(text)) return;
	const visitPair = (key, token, valueOffset) => {
		if (kind === "encoded" && !hasEncodedOrInvisibleFormKey(key)) return;
		if (!isSensitiveBodyKey(key)) return;
		const { maskable, maskStart, maskEnd } = splitSecretValueForMask(token);
		visit(valueOffset + maskStart, valueOffset + maskEnd, maskable);
	};
	if (kind === "form") {
		let cursor = 0;
		for (const pair of text.split("&")) {
			const equalsIndex = pair.indexOf("=");
			if (equalsIndex >= 0) visitPair(pair.slice(0, equalsIndex), pair.slice(equalsIndex + 1), cursor + equalsIndex + 1);
			cursor += pair.length + 1;
		}
		return;
	}
	const pattern = kind === "url" ? URL_QUERY_PAIR_RE : kind === "encoded" ? ENCODED_FORM_PAIR_RE : FORM_BODY_CONTEXT_SINGLE_PAIR_RE;
	const keyIndex = kind === "context" ? 3 : 2;
	pattern.lastIndex = 0;
	try {
		for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
			const prefix = match[1] ?? "";
			const key = match[keyIndex] ?? "";
			visitPair(key, match[keyIndex + 1] ?? "", match.index + prefix.length + key.length + 1);
		}
	} finally {
		pattern.lastIndex = 0;
	}
}
function redactAssignmentValues(text, kind, onEdits) {
	const parts = [];
	const edits = [];
	let cursor = 0;
	visitSensitiveAssignments(text, kind, (start, end, maskable) => {
		const replacement = kind === "url" ? maskToken(maskable) : "***";
		parts.push(text.slice(cursor, start), replacement);
		if (onEdits) edits.push({
			start,
			end,
			replacement
		});
		cursor = end;
	});
	if (edits.length > 0) onEdits?.(edits);
	return parts.length > 0 ? parts.join("") + text.slice(cursor) : text;
}
function markBitmapRange(bitmap, start, end) {
	const boundedStart = Math.max(0, start);
	const boundedEnd = Math.min(bitmap.length, end);
	for (let i = boundedStart; i < boundedEnd; i++) bitmap[i] = true;
}
function markAssignmentValues(text, kind, bitmap, offset = 0) {
	visitSensitiveAssignments(text, kind, (start, end) => {
		markBitmapRange(bitmap, offset + start, offset + end);
	});
}
function redactFormBodyLine(text, onEdits) {
	if (!text) return text;
	const contextRedacted = redactAssignmentValues(redactAssignmentValues(text, "encoded", onEdits), "context", onEdits);
	if (!contextRedacted.includes("&")) return contextRedacted;
	if (FORM_BODY_RE.test(contextRedacted)) return redactAssignmentValues(contextRedacted, "form", onEdits);
	const substringEdits = [];
	const redacted = contextRedacted.replace(FORM_BODY_SUBSTRING_RE, (match, prefix, body, offset) => {
		const redactedBody = redactAssignmentValues(body, "form", onEdits ? (edits) => {
			for (const edit of edits) substringEdits.push({
				...edit,
				start: offset + prefix.length + edit.start,
				end: offset + prefix.length + edit.end
			});
		} : void 0);
		return redactedBody === body ? match : `${prefix}${redactedBody}`;
	});
	if (substringEdits.length > 0) onEdits?.(substringEdits);
	return redactAssignmentValues(redactAssignmentValues(redacted, "encoded", onEdits), "context", onEdits);
}
function redactFormBody(text, onEdits) {
	if (!text.includes("=")) return text;
	if (FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
		let offset = 0;
		return text.split(FORM_BODY_LINE_BREAK_SPLIT_RE).map((segment) => {
			const result = FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment) ? segment : redactFormBodyLine(segment, onEdits ? (edits) => onEdits(edits.map((edit) => ({
				...edit,
				start: offset + edit.start,
				end: offset + edit.end
			}))) : void 0);
			offset += result.length;
			return result;
		}).join("");
	}
	return redactFormBodyLine(text, onEdits);
}
function markFormBodyLineRedactions(text, bitmap, offset) {
	if (!text) return;
	markAssignmentValues(text, "encoded", bitmap, offset);
	markAssignmentValues(text, "context", bitmap, offset);
	if (!text.includes("&")) return;
	if (FORM_BODY_RE.test(text)) {
		markAssignmentValues(text, "form", bitmap, offset);
		return;
	}
	for (const match of text.matchAll(FORM_BODY_SUBSTRING_RE)) {
		if (match.index === void 0) continue;
		const prefix = match[1] ?? "";
		markAssignmentValues(match[2] ?? "", "form", bitmap, offset + match.index + prefix.length);
	}
}
function markFormBodyRedactions(text, bitmap) {
	if (!text) return;
	if (!FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
		markFormBodyLineRedactions(text, bitmap, 0);
		return;
	}
	let offset = 0;
	for (const segment of text.split(FORM_BODY_LINE_BREAK_SPLIT_RE)) {
		if (!FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment)) markFormBodyLineRedactions(segment, bitmap, offset);
		offset += segment.length;
	}
}
function isShellReferenceToKey(key, value) {
	if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) return false;
	const bare = value.match(/^\$([A-Z_][A-Z0-9_]*)$/);
	if (bare) return bare[1] === key;
	return value.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/)?.[1] === key;
}
function maskSecretFieldValue(key, value) {
	const expansion = value.match(/^\$\{([A-Z_][A-Z0-9_]*):[-=?+][^{}]+\}(?![\s\S])/);
	if (expansion && expansion[1] === key) return `${value.slice(0, value.indexOf(":") + 2)}***}`;
	return "***";
}
function readEnvAssignmentKey(match) {
	return match.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];
}
function shouldPreserveShellReferenceMatch(match, token) {
	const key = readEnvAssignmentKey(match);
	return key ? isShellReferenceToKey(key, token) : false;
}
function isEmptyShellParameterExpansionTail(token) {
	return /^[-=?+]\}$/.test(token);
}
function prepareRedactionCapture({ match, groups, input, offset, replacement: policyReplacement }, pattern, preserveSourceAssignment) {
	if (match.includes("PRIVATE KEY-----")) return {
		start: offset,
		end: offset + match.length,
		value: match,
		redact: (target) => ({
			start: target.start,
			end: target.end,
			value: target.value,
			replacement: policyReplacement ?? redactPemBlock(target.value, "…redacted…")
		})
	};
	const selected = selectSecretCapture(match, groups);
	if (selected.value === "***") return;
	const tokenIndex = selected.value === match ? 0 : getSecretCaptureStart(pattern, input, match, offset, selected);
	if (tokenIndex < 0) return;
	const start = offset + tokenIndex;
	return {
		start,
		end: start + selected.value.length,
		value: selected.value,
		redact: (target) => {
			const token = target.value;
			if (sourceAssignmentPatterns.has(pattern) && preserveSourceAssignment?.(input, offset + getSecretCaptureStart(pattern, input, match, offset, selected))) return;
			const formAwareValue = formAwareEqualsAssignmentPatterns.has(pattern) ? splitFormAwareCredentialValue(token) : {
				secret: token,
				suffix: ""
			};
			if (splitSecretValueForMask(formAwareValue.secret).maskable === "***") return;
			const isShellReferencePattern = shellReferencePreservingPatterns.has(pattern);
			if (isShellReferencePattern && (shouldPreserveShellReferenceMatch(match, token) || isEmptyShellParameterExpansionTail(token))) return;
			const masked = policyReplacement ?? (preserveSourceAssignment && sourceAssignmentPatterns.has(pattern) ? maskSecretValue(token) : isShellReferencePattern ? maskToken(token) : `${maskSecretValue(formAwareValue.secret, { hinted: true })}${formAwareValue.suffix}`);
			return {
				start: target.start,
				end: target.end,
				replacement: masked
			};
		}
	};
}
function redactMatch(match, pattern, preserveSourceAssignment) {
	const capture = prepareRedactionCapture(match, pattern, preserveSourceAssignment);
	const edit = capture?.redact(capture);
	return edit ? match.match.slice(0, edit.start - match.offset) + edit.replacement + match.match.slice(edit.end - match.offset) : match.match;
}
function redactText(text, patterns, options) {
	const finishMeasurement = startRedactionMeasurement("text");
	let outcome = "error";
	try {
		let next = redactFormBody(redactAssignmentValues(redactStructuredAuthHeaders(text, "***"), "url"));
		let pattern;
		const replace = (match) => redactMatch(match, pattern, options?.preserveSourceAssignment);
		const replaceRegex = (...args) => replace(readRedactMatch(args));
		for (pattern of patterns) next = pattern instanceof RegExp && !options?.fullContext && !chunkUnsafePatterns.has(pattern) ? replacePatternBounded(next, pattern, replaceRegex) : replaceRedactPattern(next, pattern, replace, replaceRegex);
		outcome = "ok";
		return next;
	} finally {
		finishMeasurement?.(outcome, text.length, patterns.length);
	}
}
function couldMatchDefaultRedactPatterns(text) {
	return DEFAULT_REDACT_PREFILTER_RE.test(text) || AWS_SECRET_ACCESS_KEY_MATCHER.couldMatch(text);
}
function couldMatchDefaultFullContextPatterns(text) {
	return couldMatchDefaultRedactPatterns(text) || FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE.test(text);
}
function markPatternMatchRedaction(bitmap, input, pattern, match) {
	const fullMatch = match.match;
	if (fullMatch.includes("PRIVATE KEY-----")) {
		markBitmapRange(bitmap, match.offset, match.offset + fullMatch.length);
		return;
	}
	const selected = selectSecretCapture(fullMatch, match.groups);
	const tokenStart = selected.value === fullMatch ? 0 : getSecretCaptureStart(pattern, input, fullMatch, match.offset, selected);
	if (tokenStart < 0) return;
	const secretValue = splitSecretValueForMask(formAwareEqualsAssignmentPatterns.has(pattern) ? splitFormAwareCredentialValue(selected.value).secret : selected.value);
	markBitmapRange(bitmap, match.offset + tokenStart + secretValue.maskStart, match.offset + tokenStart + secretValue.maskEnd);
}
function computeSensitiveRedactionBitmap(text, resolved) {
	const bitmap = new Array(text.length).fill(false);
	if (resolved.mode === "off" || !text) return bitmap;
	for (const range of findStructuredAuthParamRanges(text)) markBitmapRange(bitmap, range.start, range.end);
	markAssignmentValues(text, "url", bitmap);
	markFormBodyRedactions(text, bitmap);
	for (const pattern of resolved.patterns) for (const match of iterateRedactMatches(text, pattern)) markPatternMatchRedaction(bitmap, text, pattern, match);
	return bitmap;
}
function looksLikeAppSpecificPassword(candidate) {
	return candidate.split("-").every((part) => !BENIGN_APP_PASSWORD_WORDS.has(part.toLowerCase()));
}
function redactAppSpecificPasswords(text) {
	return replacePatternBounded(text, APP_SPECIFIC_PASSWORD_RE, (match, token) => looksLikeAppSpecificPassword(token) ? maskToken(token) : match);
}
function resolveConfigRedaction() {
	const cfg = readLoggingConfig();
	return {
		mode: DEFAULT_REDACT_MODE,
		patterns: cfg?.redactPatterns
	};
}
function resolveRedactOptions(options) {
	const resolved = options ?? resolveConfigRedaction();
	const mode = normalizeMode(resolved.mode);
	return {
		mode,
		patterns: mode === "off" ? [] : resolvePatterns(resolved.patterns)
	};
}
function redactSensitiveText(text, options) {
	if (!text) return text;
	return redactSensitiveTextWithOptions(redactRegisteredSecretValues(text, maskToken), options ?? resolveConfigRedaction());
}
/** Captures the built-in tools-mode policy used by session preparation. Never log this snapshot. */
function captureSensitiveTextRedactionSnapshot() {
	const { revision, values } = captureSecretRedactionRegistrySnapshot();
	return {
		registryRevision: revision,
		registeredSecretValues: values
	};
}
function createSensitiveTextRedactor(snapshot) {
	const redactExactValues = createSecretValueRedactor(snapshot.registeredSecretValues);
	const options = { mode: "tools" };
	return (text) => redactSensitiveTextWithOptions(redactExactValues(text, maskToken), options);
}
function redactSensitiveTextWithOptions(exactRedacted, resolvedOptions) {
	if (normalizeMode(resolvedOptions.mode) === "off") return exactRedacted;
	if (usesBuiltInRedactPatterns(resolvedOptions.patterns) && !couldMatchDefaultRedactPatterns(exactRedacted)) return exactRedacted;
	return redactText(exactRedacted, resolveRedactOptions(resolvedOptions).patterns);
}
function redactToolDetail(detail) {
	return redactToolPayloadText(detail);
}
function resolveToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
	const userPatterns = loggingConfig?.redactPatterns;
	return {
		mode: "tools",
		patterns: userPatterns && userPatterns.length > 0 ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS] : void 0
	};
}
function resolveModelVisibleToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
	const userPatterns = loggingConfig?.redactPatterns;
	const hasUserPatterns = userPatterns && userPatterns.length > 0;
	return {
		mode: "tools",
		patterns: hasUserPatterns ? [...userPatterns, ...TOOL_PAYLOAD_REDACT_PATTERNS] : TOOL_PAYLOAD_REDACT_PATTERNS,
		sensitiveFieldPatterns: hasUserPatterns ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS] : DEFAULT_REDACT_PATTERNS
	};
}
function redactToolPayloadText(text) {
	return redactToolPayloadTextWithConfig(text, readLoggingConfig());
}
function redactToolPayloadTextWithPolicy(text, loggingConfig, options) {
	if (!text) return text;
	if (!isFullContextToolPayloadRedaction(loggingConfig)) return redactSensitiveText(text, options);
	const resolved = resolveRedactOptions(options);
	return redactText(redactRegisteredSecretValues(text, maskToken), resolved.patterns, { fullContext: true });
}
function redactToolPayloadTextWithConfig(text, loggingConfig) {
	return redactToolPayloadTextWithPolicy(text, loggingConfig, resolveToolPayloadRedaction(loggingConfig));
}
/** Input source retains computations, but uses diagnostic credential masking, not output policy. */
function redactInputTextWithSourcePolicy(text, loggingConfig, preserveSourceAssignment) {
	const customPatterns = loggingConfig?.redactPatterns;
	return redactText(customPatterns?.length ? redactSensitiveText(text, {
		mode: "tools",
		patterns: customPatterns
	}) : redactRegisteredSecretValues(text, maskToken), resolvePatterns(), {
		fullContext: true,
		preserveSourceAssignment
	});
}
function redactModelVisibleToolPayloadText(text) {
	return redactModelVisibleToolPayloadTextWithConfig(text, readLoggingConfig());
}
/** Owns the admitted text and its provenance so persistence can reuse its exact bytes. */
function prepareModelVisibleToolTextBlock(block, loggingConfig = readLoggingConfig()) {
	if (modelVisibleToolTextRedactionState.matches(block, block.text, loggingConfig)) return block;
	const prepared = {
		...block,
		text: redactModelVisibleSensitiveFieldValueWithConfig("text", block.text, loggingConfig)
	};
	modelVisibleToolTextRedactionState.record(prepared, prepared.text, loggingConfig);
	return prepared;
}
function redactModelVisibleToolPayloadTextWithConfig(text, loggingConfig) {
	return redactToolPayloadTextWithPolicy(text, loggingConfig, resolveModelVisibleToolPayloadRedaction(loggingConfig));
}
function isSensitiveFieldKey(key) {
	return STRUCTURED_SECRET_FIELD_RE.test(key) || STRUCTURED_SECRET_ENV_FIELD_RE.test(key);
}
function isPublicShareIdPath(path) {
	if (path.at(-1)?.toLowerCase() !== "id") return false;
	return path.at(-2)?.toLowerCase().replaceAll("-", "").replaceAll("_", "") === "publicshare";
}
function redactSensitiveFieldValueWithOptions(key, value, options, path = [key], objectPath = true) {
	const exactRedacted = redactRegisteredSecretValues(value, maskToken);
	if (isPublicShareIdPath(path)) return maskToken(exactRedacted);
	const fieldOptions = isSensitiveFieldKey(key) && options.sensitiveFieldPatterns ? {
		...options,
		patterns: options.sensitiveFieldPatterns
	} : options;
	const resolved = resolveRedactOptions(fieldOptions);
	if (resolved.mode === "off") return exactRedacted;
	const redacted = !usesBuiltInRedactPatterns(fieldOptions.patterns) || couldMatchDefaultRedactPatterns(exactRedacted) ? redactText(exactRedacted, resolved.patterns) : exactRedacted;
	if (redacted !== value || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		const appRedacted = redactAppSpecificPasswords(redacted);
		if (appRedacted !== value) return appRedacted;
	}
	if (redacted !== value) return redacted;
	return shouldRedactStructuredStringField(key, exactRedacted, path, objectPath) ? maskToken(exactRedacted) : exactRedacted;
}
function redactSensitiveFieldValue(key, value, options) {
	return redactSensitiveFieldValueWithOptions(key, value, options ?? resolveToolPayloadRedaction());
}
function redactSensitiveFieldValueWithConfig(key, value, loggingConfig) {
	return redactSensitiveFieldValueWithOptions(key, value, resolveToolPayloadRedaction(loggingConfig));
}
function redactModelVisibleSensitiveFieldValueWithConfig(key, value, loggingConfig) {
	return redactSensitiveFieldValueWithOptions(key, value, resolveModelVisibleToolPayloadRedaction(loggingConfig));
}
function shouldRedactStructuredPrimitiveField(key, path) {
	const normalizedKey = key.toLowerCase();
	return isPublicShareIdPath(path) || shouldRedactStructuredAuthorizationCode(normalizedKey, path) || isSensitiveFieldKey(key);
}
function isPlainRedactableObject(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, path = key ? [key] : [], objectPath = true) {
	if (typeof value === "string") return redactSensitiveFieldValueWithOptions(key, value, options, path, objectPath);
	if (value === null || value === void 0) return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return shouldRedactStructuredPrimitiveField(key, path) ? "***" : value;
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, path, false));
		seen.delete(value);
		return out;
	}
	if (typeof value === "object") {
		if (seen.has(value)) return "[Circular]";
		if (!isPlainRedactableObject(value)) return value;
		seen.add(value);
		const entries = Object.entries(value);
		for (const entry of entries) {
			const [name, child] = entry;
			entry[1] = redactStructuredSecretValue(name, child, seen, options, [...path, name], objectPath);
		}
		seen.delete(value);
		return Object.fromEntries(entries);
	}
	return value;
}
function redactSecretsWithOptions(value, options) {
	if (typeof value === "string") return redactSensitiveText(value, options);
	if (value === null || value === void 0) return value;
	if (typeof value !== "object") return value;
	return redactStructuredSecretValue("", value, /* @__PURE__ */ new WeakSet(), options);
}
function redactSecrets(value) {
	return redactSecretsWithOptions(value, resolveToolPayloadRedaction());
}
function preservesStructuredReference(key, value) {
	return key.toLowerCase() === "session" && STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE.test(value) || isShellReferenceToKey(key, value);
}
function shouldRedactStructuredStringField(key, value, path, objectPath) {
	return shouldRedactStructuredAuthorizationCode(key.toLowerCase(), path, objectPath ? value : void 0) || isSensitiveFieldKey(key) && !preservesStructuredReference(key, value);
}
function classifyLogFieldProtection(key, path, objectPath, value) {
	return (value === void 0 ? shouldRedactStructuredPrimitiveField(key, path) : isPublicShareIdPath(path) || shouldRedactStructuredStringField(key, value, path, objectPath)) ? "legacy" : CREDENTIAL_HEADER_FIELD_RE.test(key) ? "header" : void 0;
}
function getFieldRecordEdits(field, mode) {
	const { key, value, path, objectPath } = field;
	if (mode === "off" || !field.string && value === "null" || !classifyLogFieldProtection(key, path, objectPath, field.string ? value : void 0)) return [];
	return [{
		start: 0,
		end: value.length,
		replacement: maskSecretFieldValue(key, value)
	}];
}
function getTextRecordEdits(field, mode, fileFields) {
	const { value } = field;
	if (field.isKey || fileFields && !field.origin.structured) return [];
	if (fileFields && field.origin.primitiveMask) return [{
		start: 0,
		end: value.length,
		replacement: "***"
	}];
	if (!field.string) return [];
	const edits = [];
	const registered = redactRegisteredSecretValues(value, (secret, start) => {
		const replacement = maskToken(secret);
		edits.push({
			start,
			end: start + secret.length,
			replacement
		});
		return replacement;
	});
	if (fileFields && isPublicShareIdPath(field.path)) return [{
		start: 0,
		end: value.length,
		replacement: maskToken(registered)
	}];
	if (mode === "off") return edits;
	let combined = edits;
	const receive = (added) => {
		combined = composeRedactionEdits(value.length, combined, added);
	};
	const headers = findStructuredAuthParamRanges(registered).map(({ start, end }) => ({
		start,
		end,
		replacement: "***"
	}));
	receive(headers);
	redactFormBody(redactAssignmentValues(applyRedactionEdits(registered, headers), "url", receive), receive);
	return combined;
}
function getLegacyFieldRecordEdits(field, value, beforeConversion = false) {
	const { key, value: original, path, objectPath } = field;
	if (field.isKey || !field.origin.structured || !field.string) return [];
	if (isPublicShareIdPath(path)) return [];
	const edits = [];
	if (value !== original || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		for (const match of value.matchAll(APP_SPECIFIC_PASSWORD_RE)) if (looksLikeAppSpecificPassword(match[0])) edits.push({
			start: match.index,
			end: match.index + match[0].length,
			replacement: maskToken(match[0])
		});
	}
	if (edits.length > 0 || value !== original) return edits;
	const protection = classifyLogFieldProtection(key, path, objectPath, value);
	return protection === "legacy" || beforeConversion && protection === "header" ? [{
		start: 0,
		end: value.length,
		replacement: maskToken(value)
	}] : [];
}
function resolveFileLogRedactOptions() {
	return resolveRedactOptions(resolveToolPayloadRedaction());
}
const preparationPatterns = [
	{
		source: "registered secret values",
		*exec(input) {
			const matches = [];
			redactRegisteredSecretValues(input, (secret, offset) => {
				matches.push({
					match: secret,
					groups: [],
					input,
					offset,
					replacement: maskToken(secret)
				});
				return secret;
			});
			yield* matches;
		}
	},
	{
		source: "structured authorization parameters",
		*exec(input) {
			for (const { start, end } of findStructuredAuthParamRanges(input)) yield {
				match: input.slice(start, end),
				groups: [],
				input,
				offset: start,
				replacement: "***"
			};
		}
	},
	{
		source: "URL query assignments",
		*exec(input) {
			const edits = [];
			redactAssignmentValues(input, "url", (added) => edits.push(...added));
			for (const edit of edits) yield {
				match: input.slice(edit.start, edit.end),
				groups: [],
				input,
				offset: edit.start,
				replacement: edit.replacement
			};
		}
	},
	{
		source: "form bodies",
		*exec(input) {
			let edits = [];
			redactFormBody(input, (added) => {
				edits = composeRedactionEdits(input.length, edits, added);
			});
			for (const edit of edits) yield {
				match: input.slice(edit.start, edit.end),
				groups: [],
				input,
				offset: edit.start,
				replacement: edit.replacement
			};
		}
	}
];
const CONSOLE_STRUCTURAL_FIELDS = /* @__PURE__ */ new Set(["time", "level"]);
function prepareFileToJsonReceivers(record, patterns) {
	const decoded = /* @__PURE__ */ new WeakSet();
	const active = /* @__PURE__ */ new WeakSet();
	const visit = (value, key, path, objectPath, decode) => {
		if (typeof value === "string" && decode) {
			const field = {
				key,
				path,
				objectPath,
				value,
				isKey: false,
				string: true,
				origin: {
					structured: true,
					primitiveMask: false
				}
			};
			let current = applyRedactionEdits(value, getTextRecordEdits(field, "tools", true));
			if (!isPublicShareIdPath(path)) for (const pattern of patterns) current = applyRedactionEdits(current, getPatternRedactionEdits(current, pattern, prepareRedactionCapture));
			return applyRedactionEdits(current, getLegacyFieldRecordEdits(field, current, true));
		}
		if (value === null || typeof value !== "object") return decode && [
			"number",
			"boolean",
			"bigint"
		].includes(typeof value) && classifyLogFieldProtection(key, path, objectPath, void 0) ? "***" : value;
		if (!Array.isArray(value) && !isPlainRedactableObject(value)) return value;
		if (active.has(value)) return "[Circular]";
		active.add(value);
		let clone;
		let decodeFields = decode;
		if (Array.isArray(value)) clone = value.map((entry) => visit(entry, key, path, false, decodeFields));
		else {
			const entries = Object.entries(value);
			decodeFields ||= entries.some(([name, entry]) => name === "toJSON" && typeof entry === "function");
			clone = Object.fromEntries(entries.map(([name, entry]) => [name, visit(entry, name, [...path, name], objectPath, decodeFields)]));
		}
		if (decodeFields) decoded.add(clone);
		active.delete(value);
		return clone;
	};
	return {
		record: visit(record, "", [], true, false),
		decoded
	};
}
/** Converts native values once and applies configured and structural protection before output. */
function redactLogRecord(record, options, finish) {
	const finishMeasurement = startRedactionMeasurement("log-record");
	let outcome = "error";
	let inputChars;
	try {
		const resolved = resolveRedactOptions();
		const prepared = options.format === "console" ? {
			record,
			decoded: /* @__PURE__ */ new WeakSet()
		} : prepareFileToJsonReceivers(record, options.decodedOptions?.patterns ?? resolved.patterns);
		const ordinary = {
			structured: true,
			primitiveMask: false
		};
		const origins = {
			value: ordinary,
			children: /* @__PURE__ */ new Map()
		};
		const ancestors = [];
		const json = JSON.stringify(prepared.record, function(key, value) {
			while (ancestors.length > 0 && ancestors.at(-1)?.value !== this) ancestors.pop();
			const parent = ancestors.at(-1);
			const array = Array.isArray(this);
			const fieldKey = array && parent ? parent.key : key;
			const path = array && parent ? parent.path : parent ? [...parent.path, key] : [];
			const source = !parent ? prepared.record : parent.structured && options.format !== "console" ? Reflect.get(this, key) : value;
			const structured = (parent?.structured ?? true) && (source === null || typeof source !== "object" || !prepared.decoded.has(source) && source === value && (Array.isArray(source) || isPlainRedactableObject(source)));
			const primitiveMask = structured && [
				"number",
				"boolean",
				"bigint"
			].includes(typeof source) && classifyLogFieldProtection(fieldKey, path, !array, void 0) === "legacy";
			const circular = value !== null && typeof value === "object" && ancestors.some((frame) => frame.value === value);
			const emitted = circular ? "[Circular]" : typeof value === "bigint" ? String(value) : value;
			const container = emitted !== null && typeof emitted === "object";
			let node = origins;
			if (parent && parent.structured && (container || !structured || primitiveMask || circular)) {
				node = {
					value: {
						structured: structured && !circular,
						primitiveMask
					},
					children: /* @__PURE__ */ new Map()
				};
				parent.origins.children.set(key, node);
			} else if (parent) node = parent.origins;
			else origins.value = {
				structured,
				primitiveMask
			};
			if (container) ancestors.push({
				value: emitted,
				path,
				key: fieldKey,
				origins: node,
				structured
			});
			return emitted;
		});
		inputChars = json.length;
		let materialized = JSON.parse(json);
		const message = options.deriveMessage?.(materialized);
		if (message) {
			origins.children.set("message", {
				value: ordinary,
				children: /* @__PURE__ */ new Map()
			});
			if (Object.hasOwn(materialized, "message")) materialized.message = message.text;
			else {
				const entries = Object.entries(materialized);
				entries.splice(entries.findIndex(([key]) => key === "hostname") + 1, 0, ["message", message.text]);
				materialized = Object.fromEntries(entries);
			}
		}
		const serialized = message ? JSON.stringify(materialized) : json;
		const decodedPatterns = options.decodedOptions?.patterns ?? resolved.patterns;
		const result = finish(redactJsonRecord(serialized, origins, [[{ patterns: decodedPatterns }], [{ patterns: preparationPatterns }, {
			patterns: resolved.patterns,
			...resolved.patterns === defaultResolvedPatterns ? { couldMatch: couldMatchDefaultFullContextPatterns } : {}
		}]], prepareRedactionCapture, options.format === "console" ? () => [] : getLegacyFieldRecordEdits, (field) => getFieldRecordEdits(field, resolved.mode), (field) => getTextRecordEdits(field, resolved.mode, options.format !== "console"), (field, currentValue) => (options.format === "console" ? field.path.length === 1 && CONSOLE_STRUCTURAL_FIELDS.has(field.key) : !field.origin.structured || field.origin.primitiveMask || isPublicShareIdPath(field.path)) || decodedPatterns === defaultResolvedPatterns && !couldMatchDefaultFullContextPatterns(currentValue), message), message ? serialized : void 0);
		outcome = "ok";
		return result;
	} finally {
		finishMeasurement?.(outcome, inputChars);
	}
}
function redactLogRecordForTransport(record, options = {}) {
	return redactLogRecord(record, options, (redacted) => JSON.parse(redacted));
}
function serializeRedactedFileLogRecord(record, options = {}) {
	return redactLogRecord(record, options, (redacted, canonical) => redacted === canonical ? redacted : JSON.stringify(JSON.parse(redacted)));
}
function redactModelVisibleSecrets(value) {
	return redactSecretsWithOptions(value, resolveModelVisibleToolPayloadRedaction());
}
function getDefaultRedactPatterns() {
	return [...DEFAULT_REDACT_STRING_PATTERNS];
}
function redactSensitiveLines(lines, resolved, selectedLines) {
	if (lines.length === 0 || resolved.mode === "off") return selectedLines ? lines.filter((_, index) => selectedLines[index]) : lines;
	return redactJsonRecord(lines.join("\n"), {
		value: {
			structured: false,
			primitiveMask: false
		},
		children: /* @__PURE__ */ new Map()
	}, [[], [{ patterns: [...preparationPatterns, ...resolved.patterns] }]], prepareRedactionCapture, () => [], () => [], () => [], () => true, void 0, { preserveLines: selectedLines !== void 0 }).split("\n").filter((_, index) => selectedLines === void 0 || selectedLines[index]);
}
//#endregion
export { compileSafeRegexDetailed as $, formatRawAssistantErrorForUi as A, parseRedactPatternSource as B, resolveRedactOptions as C, extractLeadingHttpStatus as D, extractErrorHttpStatus as E, parseApiErrorInfo as F, matchesModelVisibleRedactionPolicy as G, copyPreparedModelVisibleToolText as H, parseApiErrorPayload as I, MissingEnvVarError as J, invalidateLoggingConfigCache as K, extractHttpResponseBody as L, isCloudflareOrHtmlErrorPage as M, isGenericProviderInternalError as N, extractProviderWrappedHttpStatus as O, isKnownTransportErrorCode as P, compileSafeRegex as Q, AWS_SECRET_ACCESS_KEY_MATCHER as R, resolveFileLogRedactOptions as S, MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE as T, isPreparedModelVisibleToolText as U, replaceRedactPattern as V, captureModelVisibleRedactionPolicy as W, resolveConfigEnvVars as X, containsEnvVarReference as Y, compileConfigRegexes as Z, redactSensitiveText as _, isSensitiveFieldKey as a, redactToolPayloadText as b, redactLogRecordForTransport as c, redactModelVisibleToolPayloadText as d, testRegexWithBoundedInput as et, redactModelVisibleToolPayloadTextWithConfig as f, redactSensitiveLines as g, redactSensitiveFieldValueWithConfig as h, getDefaultRedactPatterns as i, formatTransportErrorCopy as j, formatProviderRefusalText as k, redactModelVisibleSecrets as l, redactSensitiveFieldValue as m, computeSensitiveRedactionBitmap as n, prepareModelVisibleToolTextBlock as o, redactSecrets as p, readLoggingConfig as q, createSensitiveTextRedactor as r, redactInputTextWithSourcePolicy as s, captureSensitiveTextRedactionSnapshot as t, redactModelVisibleSensitiveFieldValueWithConfig as u, redactText as v, serializeRedactedFileLogRecord as w, redactToolPayloadTextWithConfig as x, redactToolDetail as y, VENDOR_TOKEN_REDACT_PATTERNS as z };
