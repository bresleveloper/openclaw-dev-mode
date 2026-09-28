import { F as resolveTimerTimeoutMs, M as resolveNonNegativeIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton, n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { r as estimateStringCharsWithMinimumRawWeight } from "./cjk-chars-6ld30jSx.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { g as shortenPathWithHome } from "./utils-aKqR_F_U.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { i as readRegularFileSync, r as readRegularFile } from "./regular-file-D4i0kJHS.mjs";
import "./errors-DnjwnOju.mjs";
import { r as decodeWindowsTextFileBuffer } from "./windows-encoding-zGMz1ieM.mjs";
import { o as createCommandTerminationController, u as releaseChildProcessOutputAfterExit } from "./exec-shcN2-sN.mjs";
import { n as truncateUtf8Suffix, t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { c as waitForCommandSpawn, o as spawnCommand } from "./exec-spawn-B7redWCL.mjs";
import { a as getBashShellEnv, i as getBashShellConfig, s as sanitizeBinaryOutput, t as buildShellCommandInvocation } from "./shell-utils-D_gDHHBQ.mjs";
import { a as convertImageToPng, p as createImageProcessor } from "./image-ops-CU4vxSlO.mjs";
import { f as sliceToolResultTextToBudget, s as toolResultFitsBudget } from "./tool-result-limits-B-fhY8wF.mjs";
import { i as formatDurationSeconds } from "./format-duration-CeDWULoS.mjs";
import { r as copyCodeModeControlToolIdentity } from "./code-mode-control-tools-fvyqQnLi.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import "./common-XfKigJno.mjs";
import { c as copyInternalToolExecutionPreparer } from "./internal-hooks-DUPhyX-W.mjs";
import { i as normalizeMediaReferenceSource, r as classifyMediaReferenceSource, s as resolveMediaReferenceLocalPath } from "./media-reference-C0dWWfb0.mjs";
import { n as formatPathRelativeToCwdOrAbsolute } from "./paths-CIwQeLl6.mjs";
import { r as captureAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-CEFulHpI.mjs";
import { r as executionTitleSchema } from "./typebox-DIBvVmm8.mjs";
import { i as normalizePositiveLimit, n as appendBoundedTextTail, r as formatStderrTail } from "./limits-NtpvYfbS.mjs";
import { t as levenshteinDistance } from "./levenshtein-distance-5ose6ySZ.mjs";
import { t as getAgentToolExecutionContext } from "./tool-execution-context-C6v2UVPI.mjs";
import { a as truncateLine, i as truncateHead, n as DEFAULT_MAX_LINES, o as truncateTail, r as formatSize, t as DEFAULT_MAX_BYTES } from "./truncate-DpjxES0d.mjs";
import { n as formatFullOutputFooter, t as ReadToolContinuationSchema } from "./tool-contracts-Cdelnh4l.mjs";
import { o as getReadmePath, t as ensureTool } from "./tools-manager-9Yrcqp6W.mjs";
import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.mjs";
import { a as resolveToCwd, i as resolveLocalPathToCwd, n as getReadPathVariants, r as getReadQueuePaths } from "./path-utils-BX048BMU.mjs";
import { createRequire } from "node:module";
import * as fs$2 from "node:fs";
import { constants, createWriteStream, existsSync, realpathSync, statSync } from "node:fs";
import path, { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import * as os$1 from "node:os";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import chalk from "chalk";
import { Type } from "typebox";
import { Compile } from "typebox/compile";
import { finished } from "node:stream/promises";
import { repairJson } from "@openclaw/ai/internal/runtime";
import { createInterface } from "node:readline";
import ignore from "ignore";
import { Box, Container, Spacer, Text, getCapabilities, getImageDimensions, getKeybindings, imageFallback, truncateToWidth } from "@earendil-works/pi-tui";
import { FILE_HEADERS_ONLY, createPatch, diffWords, formatPatch, structuredPatch } from "diff";
//#region src/agents/sessions/tools/private-temp-file.ts
/**
* Private temporary file helper for tool output spillover.
*
* Creates owner-only log files without reusing predictable names.
*/
/** Opens a unique write stream with owner-only permissions. */
function createPrivateTempWriteStream(prefix) {
	const filePath = createPrivateTempFilePath(prefix);
	return {
		path: filePath,
		stream: createWriteStream(filePath, {
			flags: "wx",
			mode: 384
		})
	};
}
async function writePrivateTempFile(prefix, content) {
	const filePath = createPrivateTempFilePath(prefix);
	await writeFile(filePath, content, {
		flag: "wx",
		mode: 384
	});
	return filePath;
}
function createPrivateTempFilePath(prefix) {
	const id = randomBytes(8).toString("hex");
	return join(tmpdir(), `${prefix}-${id}.log`);
}
//#endregion
//#region src/agents/sessions/tools/output-accumulator.ts
/**
* Streaming output accumulator for tool execution.
*
* Keeps bounded display tails in memory while spilling full output to private temp files when needed.
*/
/**
* Incrementally tracks streaming output with bounded memory.
*
* Appends decode chunks with a streaming UTF-8 decoder, keeps only a decoded
* tail for display snapshots, and opens a temp file when the full output needs
* to be preserved.
*/
var OutputAccumulator = class {
	constructor(options = {}) {
		this.lanes = /* @__PURE__ */ new Map();
		this.spillChunks = [];
		this.tailText = "";
		this.tailBytes = 0;
		this.totalRawBytes = 0;
		this.totalDecodedBytes = 0;
		this.completedLines = 0;
		this.totalLines = 0;
		this.lastLineBytes = 0;
		this.hasOpenLine = false;
		this.finished = false;
		this.maxLines = options.maxLines ?? 2e3;
		this.maxBytes = options.maxBytes ?? 51200;
		this.maxRollingBytes = Math.max(this.maxBytes * 2, this.maxBytes + 5);
		this.tempFilePrefix = options.tempFilePrefix ?? "openclaw-output";
		this.createTextTransform = options.createTextTransform;
	}
	lane(stream) {
		let lane = this.lanes.get(stream);
		if (!lane) {
			lane = {
				decoder: new TextDecoder(),
				transform: this.createTextTransform?.(),
				spillDecoded: stream !== void 0 || this.createTextTransform !== void 0
			};
			this.lanes.set(stream, lane);
		}
		return lane;
	}
	append(data, stream) {
		if (this.finished) throw new Error("Cannot append to a finished output accumulator");
		this.totalRawBytes += data.length;
		const lane = this.lane(stream);
		const decodedText = lane.decoder.decode(data, { stream: true });
		const text = lane.transform?.(decodedText) ?? decodedText;
		this.appendDecodedText(text);
		const spillChunk = lane.spillDecoded ? Buffer.from(text, "utf-8") : data;
		if (this.tempFile || this.shouldUseTempFile()) this.ensureTempFile();
		this.appendSpillChunk(spillChunk);
		return text;
	}
	finish() {
		if (this.finished) return "";
		this.finished = true;
		let flushed = "";
		for (const lane of this.lanes.values()) {
			const decodedText = lane.decoder.decode();
			const text = lane.transform?.(decodedText) ?? decodedText;
			if (text.length === 0) continue;
			this.appendDecodedText(text);
			if (lane.spillDecoded) this.appendSpillChunk(Buffer.from(text, "utf-8"));
			flushed += text;
		}
		if (this.shouldUseTempFile()) this.ensureTempFile();
		return flushed;
	}
	snapshot(options = {}) {
		const tailTruncation = truncateTail(this.tailText, {
			maxLines: this.maxLines,
			maxBytes: this.maxBytes
		});
		const truncated = this.totalLines > this.maxLines || this.totalDecodedBytes > this.maxBytes;
		const truncatedBy = truncated ? tailTruncation.truncatedBy ?? (this.totalDecodedBytes > this.maxBytes ? "bytes" : "lines") : null;
		const truncation = {
			...tailTruncation,
			truncated,
			truncatedBy,
			totalLines: this.totalLines,
			totalBytes: this.totalDecodedBytes,
			maxLines: this.maxLines,
			maxBytes: this.maxBytes
		};
		if (options.persistIfTruncated && truncation.truncated) this.ensureTempFile();
		return {
			content: truncation.content,
			truncation,
			fullOutputPath: this.tempFile?.path
		};
	}
	async closeTempFile() {
		const tempFile = this.tempFile;
		if (!tempFile) return;
		tempFile.stream.end();
		await tempFile.completion;
	}
	getLastLineBytes() {
		return this.lastLineBytes;
	}
	appendDecodedText(text) {
		if (text.length === 0) return;
		const bytes = Buffer.byteLength(text);
		this.totalDecodedBytes += bytes;
		this.tailText += text;
		this.tailBytes += bytes;
		if (this.tailBytes > this.maxRollingBytes * 2) {
			this.tailText = truncateUtf8Suffix(this.tailText, this.maxRollingBytes);
			this.tailBytes = Buffer.byteLength(this.tailText);
		}
		const end = text.endsWith("\n") ? text.length - 1 : text.length;
		let start = 0;
		for (let index = text.indexOf("\n"); index !== -1; index = text.indexOf("\n", index + 1)) {
			this.completedLines++;
			if (index < end) start = index + 1;
		}
		this.lastLineBytes = (start === 0 && this.hasOpenLine ? this.lastLineBytes : 0) + (start === 0 && end === text.length ? bytes : Buffer.byteLength(text.slice(start, end)));
		this.hasOpenLine = end === text.length;
		this.totalLines = this.completedLines + (this.hasOpenLine ? 1 : 0);
	}
	shouldUseTempFile() {
		return this.totalRawBytes > this.maxBytes || this.totalDecodedBytes > this.maxBytes || this.totalLines > this.maxLines;
	}
	appendSpillChunk(chunk) {
		if (chunk.length === 0) return;
		if (this.tempFile) this.tempFile.stream.write(chunk);
		else this.spillChunks.push(chunk);
	}
	ensureTempFile() {
		if (this.tempFile) return;
		const tempFile = createPrivateTempWriteStream(this.tempFilePrefix);
		const completion = finished(tempFile.stream);
		completion.catch(() => void 0);
		this.tempFile = {
			...tempFile,
			completion
		};
		for (const chunk of this.spillChunks) tempFile.stream.write(chunk);
		this.spillChunks = [];
	}
};
//#endregion
//#region src/shared/ignore-rules.ts
const IGNORE_FILE_NAMES = [
	".gitignore",
	".ignore",
	".fdignore"
];
const IGNORE_FILE_MAX_BYTES = 4194304;
const IGNORE_MATCHER_MAX_PATTERNS = 2e4;
const IGNORE_PATTERN_MAX_CHARS = 16384;
const IGNORE_MATCHER_MAX_PATTERN_CHARS = IGNORE_FILE_MAX_BYTES;
const OVERSIZED_IGNORE_FILE = Symbol("oversizedIgnoreFile");
const COMPLEX_IGNORE_FILE = Symbol("complexIgnoreFile");
const ignoreMatcherStates = /* @__PURE__ */ new WeakMap();
function normalizeLiteralSubtreePath(pathname) {
	const posixPath = normalizeNativePathSeparators(pathname);
	return posixPath.endsWith("/") ? posixPath.slice(0, -1) : posixPath;
}
function setContainsLiteralSubtree(pathname, subtrees) {
	for (const subtree of subtrees) if (!subtree || pathname === subtree || pathname.startsWith(`${subtree}/`)) return true;
	return false;
}
function isInLiteralSubtree(pathname, state) {
	return setContainsLiteralSubtree(normalizeLiteralSubtreePath(pathname).toLowerCase(), state.excludedSubtrees);
}
function getIgnoreMatcherState(matcher) {
	if (matcher) {
		const existing = ignoreMatcherStates.get(matcher);
		if (!existing) throw new Error("addIgnoreRules requires a matcher returned by addIgnoreRules");
		return existing;
	}
	const ownedMatcher = ignore();
	const state = {
		matcher: ownedMatcher,
		excludedSubtrees: /* @__PURE__ */ new Set(),
		patternCount: 0,
		patternChars: 0
	};
	ignoreMatcherStates.set(ownedMatcher, state);
	const originalIgnores = ownedMatcher.ignores.bind(ownedMatcher);
	ownedMatcher.ignores = (pathname) => {
		const ignored = originalIgnores(pathname);
		return isInLiteralSubtree(pathname, state) || ignored;
	};
	return state;
}
function addFailClosedSubtree(state, prefix) {
	const normalized = normalizeLiteralSubtreePath(prefix).toLowerCase();
	state.excludedSubtrees.add(normalized);
}
function parseIgnorePatterns(content, prefix, budget) {
	const patterns = [];
	let patternChars = 0;
	let lineStart = 0;
	while (lineStart <= content.length) {
		const newline = content.indexOf("\n", lineStart);
		const lineEnd = newline === -1 ? content.length : newline;
		const contentEnd = lineEnd > lineStart && content[lineEnd - 1] === "\r" ? lineEnd - 1 : lineEnd;
		const pattern = prefixIgnorePattern(content.slice(lineStart, contentEnd), prefix);
		if (pattern) {
			if (pattern.length > IGNORE_PATTERN_MAX_CHARS || patterns.length >= budget.patterns) return COMPLEX_IGNORE_FILE;
			patternChars += pattern.length;
			if (patternChars > budget.chars) return COMPLEX_IGNORE_FILE;
			patterns.push(pattern);
		}
		if (newline === -1) break;
		lineStart = newline + 1;
	}
	return {
		patterns,
		chars: patternChars
	};
}
const normalizeNativePathSeparators = (pathValue) => pathValue.split(sep).join("/");
/** Adds nested rules, optionally continuing a matcher previously returned for this scan. */
function addIgnoreRules(dir, rootDir, ig) {
	const state = getIgnoreMatcherState(ig);
	const matcher = state.matcher;
	const relativeDir = relative(rootDir, dir);
	const prefix = relativeDir ? `${normalizeNativePathSeparators(relativeDir)}/` : "";
	for (const filename of IGNORE_FILE_NAMES) {
		const ignorePath = join(dir, filename);
		if (!existsSync(ignorePath)) continue;
		const content = readIgnoreFileContent(ignorePath);
		if (content === OVERSIZED_IGNORE_FILE) {
			addFailClosedSubtree(state, prefix);
			break;
		}
		if (content === null) continue;
		const parsed = parseIgnorePatterns(content, prefix, {
			patterns: IGNORE_MATCHER_MAX_PATTERNS - state.patternCount,
			chars: IGNORE_MATCHER_MAX_PATTERN_CHARS - state.patternChars
		});
		if (parsed === COMPLEX_IGNORE_FILE) {
			addFailClosedSubtree(state, prefix);
			break;
		}
		if (parsed.patterns.length > 0) {
			matcher.add(parsed.patterns);
			state.patternCount += parsed.patterns.length;
			state.patternChars += parsed.chars;
		}
	}
	return matcher;
}
function readIgnoreFileContent(ignorePath) {
	let resolvedPath;
	try {
		resolvedPath = realpathSync(ignorePath);
	} catch {
		return null;
	}
	try {
		const { buffer } = readRegularFileSync({
			filePath: resolvedPath,
			maxBytes: IGNORE_FILE_MAX_BYTES
		});
		return buffer.toString("utf-8");
	} catch (error) {
		if (error instanceof Error && error.message.startsWith(`File exceeds ${IGNORE_FILE_MAX_BYTES} bytes:`)) return OVERSIZED_IGNORE_FILE;
		return null;
	}
}
function prefixIgnorePattern(line, prefix) {
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith("#") && !trimmed.startsWith("\\#")) return "";
	const negated = line.startsWith("!");
	const pattern = negated ? line.slice(1) : line;
	const anchored = pattern.startsWith("/");
	const normalized = anchored ? pattern.slice(1) : pattern;
	const matchPattern = normalized.replace(/ +$/, "");
	const prefixed = `${prefix}${prefix && !anchored && !matchPattern.slice(0, -1).includes("/") ? "**/" : ""}${normalized}`;
	return negated ? `!${prefixed}` : prefixed;
}
//#endregion
//#region src/agents/utils/syntax-highlight.ts
/**
* Syntax highlighting renderer for terminal-friendly formatted output.
*
* Highlight.js emits HTML spans; this module walks that small HTML subset and
* maps active scopes to caller-provided text formatters.
*/
let highlightJsRuntime;
function isHighlightJs(value) {
	return typeof value === "object" && value !== null && "getLanguage" in value && typeof value.getLanguage === "function" && "highlight" in value && typeof value.highlight === "function" && "highlightAuto" in value && typeof value.highlightAuto === "function";
}
function setHighlightJsRuntime(runtime) {
	if (!isHighlightJs(runtime)) throw new TypeError("highlight.js did not expose the expected Node API");
	highlightJsRuntime = runtime;
	return runtime;
}
function loadHighlightJsRuntime() {
	if (highlightJsRuntime) return highlightJsRuntime;
	return setHighlightJsRuntime(createRequire(import.meta.url)("highlight.js"));
}
const SPAN_CLOSE = "</span>";
const HIGHLIGHT_CLASS_PREFIX = "hljs-";
function getScopeFromSpanTag(tag) {
	const match = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(tag);
	const classValue = match?.[1] ?? match?.[2];
	if (!classValue) return;
	for (const className of classValue.split(/\s+/)) if (className.startsWith(HIGHLIGHT_CLASS_PREFIX)) return className.slice(5);
}
function getScopeFormatter(scope, theme) {
	const exact = theme[scope];
	if (exact) return exact;
	const dotIndex = scope.indexOf(".");
	if (dotIndex !== -1) {
		const prefixFormatter = theme[scope.slice(0, dotIndex)];
		if (prefixFormatter) return prefixFormatter;
	}
	const dashIndex = scope.indexOf("-");
	if (dashIndex !== -1) {
		const prefixFormatter = theme[scope.slice(0, dashIndex)];
		if (prefixFormatter) return prefixFormatter;
	}
}
function getActiveFormatter(scopes, theme) {
	for (let i = scopes.length - 1; i >= 0; i--) {
		const scope = scopes[i];
		if (!scope) continue;
		const formatter = getScopeFormatter(scope, theme);
		if (formatter) return formatter;
	}
	return theme.default;
}
function isSpanOpenTagStart(html, index) {
	if (!html.startsWith("<span", index)) return false;
	const nextChar = html[index + 5];
	return nextChar === ">" || nextChar === " " || nextChar === "	" || nextChar === "\n" || nextChar === "\r";
}
/** Renders highlight.js span HTML into themed plain text. */
function renderHighlightedHtml(html, theme = {}) {
	let output = "";
	let textBuffer = "";
	const scopes = [];
	const flushText = () => {
		if (!textBuffer) return;
		const decodedText = decodeHtmlEntities(textBuffer);
		const formatter = getActiveFormatter(scopes, theme);
		output += formatter ? formatter(decodedText) : decodedText;
		textBuffer = "";
	};
	let index = 0;
	while (index < html.length) {
		if (isSpanOpenTagStart(html, index)) {
			const tagEndIndex = html.indexOf(">", index + 5);
			if (tagEndIndex !== -1) {
				flushText();
				const scope = getScopeFromSpanTag(html.slice(index, tagEndIndex + 1));
				scopes.push(scope);
				index = tagEndIndex + 1;
				continue;
			}
		}
		if (html.startsWith(SPAN_CLOSE, index)) {
			flushText();
			if (scopes.length > 0) scopes.pop();
			index += 7;
			continue;
		}
		textBuffer += html[index];
		index++;
	}
	flushText();
	return output;
}
/** Highlights code using an explicit language or highlight.js auto-detection. */
function highlight(code, options = {}) {
	const hljs = loadHighlightJsRuntime();
	return renderHighlightedHtml(options.language ? hljs.highlight(code, {
		language: options.language,
		ignoreIllegals: options.ignoreIllegals
	}).value : hljs.highlightAuto(code, options.languageSubset).value, options.theme);
}
/** Returns whether highlight.js has a registered language by this name. */
function supportsLanguage(name) {
	return loadHighlightJsRuntime().getLanguage(name) !== void 0;
}
//#endregion
//#region src/agents/modes/interactive/theme/theme.ts
/**
* Interactive terminal theme loader.
*
* Validates theme JSON, resolves color variables, watches custom theme files, and exposes terminal styling helpers.
*/
const ColorValueSchema = Type.Union([Type.String(), Type.Integer({
	minimum: 0,
	maximum: 255
})]);
const ThemeJsonSchema = Type.Object({
	$schema: Type.Optional(Type.String()),
	name: Type.String(),
	vars: Type.Optional(Type.Record(Type.String(), ColorValueSchema)),
	colors: Type.Object({
		accent: ColorValueSchema,
		border: ColorValueSchema,
		borderAccent: ColorValueSchema,
		borderMuted: ColorValueSchema,
		success: ColorValueSchema,
		error: ColorValueSchema,
		warning: ColorValueSchema,
		muted: ColorValueSchema,
		dim: ColorValueSchema,
		text: ColorValueSchema,
		thinkingText: ColorValueSchema,
		selectedBg: ColorValueSchema,
		userMessageBg: ColorValueSchema,
		userMessageText: ColorValueSchema,
		customMessageBg: ColorValueSchema,
		customMessageText: ColorValueSchema,
		customMessageLabel: ColorValueSchema,
		toolPendingBg: ColorValueSchema,
		toolSuccessBg: ColorValueSchema,
		toolErrorBg: ColorValueSchema,
		toolTitle: ColorValueSchema,
		toolOutput: ColorValueSchema,
		mdHeading: ColorValueSchema,
		mdLink: ColorValueSchema,
		mdLinkUrl: ColorValueSchema,
		mdCode: ColorValueSchema,
		mdCodeBlock: ColorValueSchema,
		mdCodeBlockBorder: ColorValueSchema,
		mdQuote: ColorValueSchema,
		mdQuoteBorder: ColorValueSchema,
		mdHr: ColorValueSchema,
		mdListBullet: ColorValueSchema,
		toolDiffAdded: ColorValueSchema,
		toolDiffRemoved: ColorValueSchema,
		toolDiffContext: ColorValueSchema,
		syntaxComment: ColorValueSchema,
		syntaxKeyword: ColorValueSchema,
		syntaxFunction: ColorValueSchema,
		syntaxVariable: ColorValueSchema,
		syntaxString: ColorValueSchema,
		syntaxNumber: ColorValueSchema,
		syntaxType: ColorValueSchema,
		syntaxOperator: ColorValueSchema,
		syntaxPunctuation: ColorValueSchema,
		thinkingOff: ColorValueSchema,
		thinkingMinimal: ColorValueSchema,
		thinkingLow: ColorValueSchema,
		thinkingMedium: ColorValueSchema,
		thinkingHigh: ColorValueSchema,
		thinkingXhigh: ColorValueSchema,
		bashMode: ColorValueSchema
	}),
	export: Type.Optional(Type.Object({
		pageBg: Type.Optional(ColorValueSchema),
		cardBg: Type.Optional(ColorValueSchema),
		infoBg: Type.Optional(ColorValueSchema)
	}))
});
const validateThemeJson = Compile(ThemeJsonSchema);
function hexToRgb(hex) {
	const cleaned = hex.replace("#", "");
	if (cleaned.length !== 6) throw new Error(`Invalid hex color: ${hex}`);
	const r = Number.parseInt(cleaned.slice(0, 2), 16);
	const g = Number.parseInt(cleaned.slice(2, 4), 16);
	const b = Number.parseInt(cleaned.slice(4, 6), 16);
	if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) throw new Error(`Invalid hex color: ${hex}`);
	return {
		r,
		g,
		b
	};
}
const CUBE_VALUES = [
	0,
	95,
	135,
	175,
	215,
	255
];
const GRAY_VALUES = Array.from({ length: 24 }, (_, i) => 8 + i * 10);
function findClosestPaletteIndex(value, palette) {
	let minDist = Infinity;
	let minIdx = 0;
	for (const [i, paletteValue] of palette.entries()) {
		const dist = Math.abs(value - paletteValue);
		if (dist < minDist) {
			minDist = dist;
			minIdx = i;
		}
	}
	return minIdx;
}
function colorDistance(r1, g1, b1, r2, g2, b2) {
	const dr = r1 - r2;
	const dg = g1 - g2;
	const db = b1 - b2;
	return dr * dr * .299 + dg * dg * .587 + db * db * .114;
}
function rgbTo256(r, g, b) {
	const rIdx = findClosestPaletteIndex(r, CUBE_VALUES);
	const gIdx = findClosestPaletteIndex(g, CUBE_VALUES);
	const bIdx = findClosestPaletteIndex(b, CUBE_VALUES);
	const cubeR = CUBE_VALUES[rIdx];
	const cubeG = CUBE_VALUES[gIdx];
	const cubeB = CUBE_VALUES[bIdx];
	if (cubeR === void 0 || cubeG === void 0 || cubeB === void 0) throw new Error("Invalid 256-color cube index");
	const cubeIndex = 16 + 36 * rIdx + 6 * gIdx + bIdx;
	const cubeDist = colorDistance(r, g, b, cubeR, cubeG, cubeB);
	const grayIdx = findClosestPaletteIndex(Math.round(.299 * r + .587 * g + .114 * b), GRAY_VALUES);
	const grayValue = GRAY_VALUES[grayIdx];
	if (grayValue === void 0) throw new Error("Invalid 256-color grayscale index");
	const grayIndex = 232 + grayIdx;
	const grayDist = colorDistance(r, g, b, grayValue, grayValue, grayValue);
	if (Math.max(r, g, b) - Math.min(r, g, b) < 10 && grayDist < cubeDist) return grayIndex;
	return cubeIndex;
}
function hexTo256(hex) {
	const { r, g, b } = hexToRgb(hex);
	return rgbTo256(r, g, b);
}
function colorAnsi(color, mode, layer) {
	const code = layer === "fg" ? 38 : 48;
	if (color === "") return layer === "fg" ? "\x1B[39m" : "\x1B[49m";
	if (typeof color === "number") return `\x1b[${code};5;${color}m`;
	if (color.startsWith("#")) {
		if (mode === "truecolor") {
			const { r, g, b } = hexToRgb(color);
			return `\x1b[${code};2;${r};${g};${b}m`;
		}
		return `\x1b[${code};5;${hexTo256(color)}m`;
	}
	throw new Error(`Invalid color value: ${color}`);
}
function resolveVarRefs(value, vars, visited = /* @__PURE__ */ new Set()) {
	if (typeof value === "number" || value === "" || value.startsWith("#")) return value;
	if (visited.has(value)) throw new Error(`Circular variable reference detected: ${value}`);
	if (!(value in vars)) throw new Error(`Variable reference not found: ${value}`);
	visited.add(value);
	const resolved = vars[value];
	if (resolved === void 0) throw new Error(`Variable reference not found: ${value}`);
	return resolveVarRefs(resolved, vars, visited);
}
function resolveThemeColors(colors, vars = {}) {
	const resolved = {};
	for (const [key, value] of Object.entries(colors)) resolved[key] = resolveVarRefs(value, vars);
	return resolved;
}
function getThemeAnsi(colors, color, label) {
	const ansi = colors.get(color);
	if (!ansi) throw new Error(`Unknown theme ${label}: ${color}`);
	return ansi;
}
var Theme = class {
	constructor(fgColors, bgColors, mode, options = {}) {
		this.name = options.name;
		this.sourcePath = options.sourcePath;
		this.sourceInfo = options.sourceInfo;
		this.mode = mode;
		this.fgColors = /* @__PURE__ */ new Map();
		for (const [key, value] of Object.entries(fgColors)) this.fgColors.set(key, colorAnsi(value, mode, "fg"));
		this.bgColors = /* @__PURE__ */ new Map();
		for (const [key, value] of Object.entries(bgColors)) this.bgColors.set(key, colorAnsi(value, mode, "bg"));
	}
	fg(color, text) {
		return `${getThemeAnsi(this.fgColors, color, "color")}${text}\x1b[39m`;
	}
	bg(color, text) {
		return `${getThemeAnsi(this.bgColors, color, "background color")}${text}\x1b[49m`;
	}
	bold(text) {
		return chalk.bold(text);
	}
	italic(text) {
		return chalk.italic(text);
	}
	underline(text) {
		return chalk.underline(text);
	}
	inverse(text) {
		return chalk.inverse(text);
	}
	strikethrough(text) {
		return chalk.strikethrough(text);
	}
	getFgAnsi(color) {
		return getThemeAnsi(this.fgColors, color, "color");
	}
	getBgAnsi(color) {
		return getThemeAnsi(this.bgColors, color, "background color");
	}
	getColorMode() {
		return this.mode;
	}
	getThinkingBorderColor(level) {
		switch (level) {
			case "off": return (str) => this.fg("thinkingOff", str);
			case "minimal": return (str) => this.fg("thinkingMinimal", str);
			case "low": return (str) => this.fg("thinkingLow", str);
			case "medium": return (str) => this.fg("thinkingMedium", str);
			case "high": return (str) => this.fg("thinkingHigh", str);
			case "xhigh": return (str) => this.fg("thinkingXhigh", str);
			default: return (str) => this.fg("thinkingOff", str);
		}
	}
	getBashModeBorderColor() {
		return (str) => this.fg("bashMode", str);
	}
};
function parseThemeJson(label, json) {
	if (!validateThemeJson.Check(json)) {
		const errors = Array.from(validateThemeJson.Errors(json));
		const missingColors = /* @__PURE__ */ new Set();
		const otherErrors = [];
		for (const error of errors) {
			if (error.keyword === "required" && error.instancePath === "/colors") {
				const requiredProperties = error.params.requiredProperties;
				for (const requiredProperty of requiredProperties ?? []) missingColors.add(requiredProperty);
				continue;
			}
			const pathLocal = error.instancePath || "/";
			otherErrors.push(`  - ${pathLocal}: ${error.message}`);
		}
		let errorMessage = `Invalid theme "${label}":\n`;
		if (missingColors.size > 0) {
			errorMessage += "\nMissing required color tokens:\n";
			errorMessage += Array.from(missingColors).toSorted().map((color) => `  - ${color}`).join("\n");
			errorMessage += "\n\nPlease add these colors to your theme's \"colors\" object.";
			errorMessage += "\nSee the built-in themes (dark.json, light.json) for reference values.";
		}
		if (otherErrors.length > 0) errorMessage += `\n\nOther errors:\n${otherErrors.join("\n")}`;
		throw new Error(errorMessage);
	}
	return json;
}
function parseThemeJsonContent(label, content) {
	let json;
	try {
		json = JSON.parse(content);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`Failed to parse theme ${label}: ${message}`, { cause: error });
	}
	return parseThemeJson(label, json);
}
function createTheme(themeJson, mode, sourcePath) {
	const colorMode = mode ?? (getCapabilities().trueColor ? "truecolor" : "256color");
	const resolvedColors = resolveThemeColors(themeJson.colors, themeJson.vars);
	const fgColors = {};
	const bgColors = {};
	const bgColorKeys = /* @__PURE__ */ new Set([
		"selectedBg",
		"userMessageBg",
		"customMessageBg",
		"toolPendingBg",
		"toolSuccessBg",
		"toolErrorBg"
	]);
	for (const [key, value] of Object.entries(resolvedColors)) if (bgColorKeys.has(key)) bgColors[key] = value;
	else fgColors[key] = value;
	return new Theme(fgColors, bgColors, colorMode, {
		name: themeJson.name,
		sourcePath
	});
}
function loadThemeFromPath(themePath, mode) {
	return createTheme(parseThemeJsonContent(themePath, fs$2.readFileSync(themePath, "utf-8")), mode, themePath);
}
const THEME_KEY = Symbol.for("openclaw:agent-theme");
const interactiveAgentTheme = new Proxy({}, { get(_target, prop) {
	const t = globalThis[THEME_KEY];
	if (!t) throw new Error("Theme not initialized. Call setTheme() first.");
	return t[prop];
} });
let cachedHighlightThemeFor;
let cachedCliHighlightTheme;
function buildCliHighlightTheme(t) {
	return {
		keyword: (s) => t.fg("syntaxKeyword", s),
		built_in: (s) => t.fg("syntaxType", s),
		literal: (s) => t.fg("syntaxNumber", s),
		number: (s) => t.fg("syntaxNumber", s),
		string: (s) => t.fg("syntaxString", s),
		comment: (s) => t.fg("syntaxComment", s),
		function: (s) => t.fg("syntaxFunction", s),
		title: (s) => t.fg("syntaxFunction", s),
		class: (s) => t.fg("syntaxType", s),
		type: (s) => t.fg("syntaxType", s),
		attr: (s) => t.fg("syntaxVariable", s),
		variable: (s) => t.fg("syntaxVariable", s),
		params: (s) => t.fg("syntaxVariable", s),
		operator: (s) => t.fg("syntaxOperator", s),
		punctuation: (s) => t.fg("syntaxPunctuation", s)
	};
}
function getCliHighlightTheme(t) {
	if (cachedHighlightThemeFor !== t || !cachedCliHighlightTheme) {
		cachedHighlightThemeFor = t;
		cachedCliHighlightTheme = buildCliHighlightTheme(t);
	}
	return cachedCliHighlightTheme;
}
/**
* Highlight code with syntax coloring based on file extension or language.
* Returns array of highlighted lines.
*/
function highlightCode(code, lang) {
	const validLang = lang && supportsLanguage(lang) ? lang : void 0;
	if (!validLang) return code.split("\n").map((line) => interactiveAgentTheme.fg("mdCodeBlock", line));
	const opts = {
		language: validLang,
		ignoreIllegals: true,
		theme: getCliHighlightTheme(interactiveAgentTheme)
	};
	try {
		return highlight(code, opts).split("\n");
	} catch {
		return code.split("\n");
	}
}
/**
* Get language identifier from file path extension.
*/
function getLanguageFromPath(filePath) {
	const ext = filePath.split(".").pop()?.toLowerCase();
	if (!ext) return;
	return {
		ts: "typescript",
		tsx: "typescript",
		js: "javascript",
		jsx: "javascript",
		mjs: "javascript",
		cjs: "javascript",
		py: "python",
		rb: "ruby",
		rs: "rust",
		go: "go",
		java: "java",
		kt: "kotlin",
		swift: "swift",
		c: "c",
		h: "c",
		cpp: "cpp",
		cc: "cpp",
		cxx: "cpp",
		hpp: "cpp",
		cs: "csharp",
		php: "php",
		sh: "bash",
		bash: "bash",
		zsh: "bash",
		fish: "fish",
		ps1: "powershell",
		sql: "sql",
		html: "html",
		htm: "html",
		css: "css",
		scss: "scss",
		sass: "sass",
		less: "less",
		json: "json",
		yaml: "yaml",
		yml: "yaml",
		toml: "toml",
		xml: "xml",
		md: "markdown",
		markdown: "markdown",
		dockerfile: "dockerfile",
		makefile: "makefile",
		cmake: "cmake",
		lua: "lua",
		perl: "perl",
		r: "r",
		scala: "scala",
		clj: "clojure",
		ex: "elixir",
		exs: "elixir",
		erl: "erlang",
		hs: "haskell",
		ml: "ocaml",
		vim: "vim",
		graphql: "graphql",
		proto: "protobuf",
		tf: "hcl",
		hcl: "hcl"
	}[ext];
}
//#endregion
//#region src/agents/modes/interactive/components/keybinding-hints.ts
/**
* Utilities for formatting keybinding hints in the UI.
*/
function formatKeyPart(part) {
	return process.platform === "darwin" && part.toLowerCase() === "alt" ? "option" : part;
}
function formatKeyText(key) {
	return key.split("/").map((k) => k.split("+").map((part) => formatKeyPart(part)).join("+")).join("/");
}
function formatKeys(keys) {
	if (keys.length === 0) return "";
	return formatKeyText(keys.join("/"));
}
function keyText(keybinding) {
	return formatKeys(getKeybindings().getKeys(keybinding));
}
function keyHint(keybinding, description) {
	return interactiveAgentTheme.fg("dim", keyText(keybinding)) + interactiveAgentTheme.fg("muted", ` ${description}`);
}
//#endregion
//#region src/agents/modes/interactive/components/visual-truncate.ts
/**
* Shared utility for truncating text to visual lines (accounting for line wrapping).
* Used by both tool-execution.ts and bash-execution.ts for consistent behavior.
*/
/**
* Truncate text to a maximum number of visual lines (from the end).
* This accounts for line wrapping based on terminal width.
*
* @param text - The text content (may contain newlines)
* @param maxVisualLines - Maximum number of visual lines to show
* @param width - Terminal/render width
* @param paddingX - Horizontal padding for Text component (default 0).
*                   Use 0 when result will be placed in a Box (Box adds its own padding).
*                   Use 1 when result will be placed in a plain Container.
* @returns The truncated visual lines and count of skipped lines
*/
function truncateToVisualLines(text, maxVisualLines, width, paddingX = 0) {
	if (!text) return {
		visualLines: [],
		skippedCount: 0
	};
	const allVisualLines = new Text(text, paddingX, 0).render(width);
	if (allVisualLines.length <= maxVisualLines) return {
		visualLines: allVisualLines,
		skippedCount: 0
	};
	return {
		visualLines: allVisualLines.slice(-maxVisualLines),
		skippedCount: allVisualLines.length - maxVisualLines
	};
}
//#endregion
//#region src/agents/sessions/tools/bash-local-exec.ts
function resolveBashTimeoutMs(timeoutSeconds) {
	if (timeoutSeconds === void 0) return;
	if (typeof timeoutSeconds !== "number" || !Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0) throw new Error("Invalid timeout: must be a positive finite number of seconds");
	return resolveTimerTimeoutMs(timeoutSeconds * 1e3, 1);
}
/** Local shell execution owns cancellation from admission through final output cleanup. */
function createLocalBashOperations(options) {
	return { exec: async (command, cwd, { onData, signal, timeout, env }) => {
		const timeoutMs = resolveBashTimeoutMs(timeout);
		const shellConfig = getBashShellConfig(options?.shellPath);
		const invocation = buildShellCommandInvocation(command, shellConfig);
		if (!existsSync(cwd)) throw new Error(`Working directory does not exist: ${cwd}\nCannot execute bash commands.`);
		if (signal?.aborted) throw new Error("aborted");
		const shellEnv = env ?? getBashShellEnv(shellConfig.shell);
		const cancelController = new AbortController();
		const startupCanceled = createDeferredCore();
		startupCanceled.promise.catch(() => {});
		let waitingForSpawn = true;
		let acceptingOutput = true;
		let cancellationRequested = false;
		let terminationStarted = false;
		let timedOut = false;
		let terminationController;
		const terminate = () => {
			cancellationRequested = true;
			if (terminationController) {
				if (!terminationStarted) {
					terminationStarted = true;
					if (!terminationController.terminate()) cancelController.abort();
				}
			} else cancelController.abort();
			if (waitingForSpawn) startupCanceled.reject(/* @__PURE__ */ new Error(signal?.aborted ? "aborted" : `timeout:${timeout}`));
		};
		signal?.addEventListener("abort", terminate, { once: true });
		const timeoutHandle = timeoutMs === void 0 ? void 0 : setTimeout(() => {
			timedOut = true;
			terminate();
		}, timeoutMs);
		try {
			const child = spawnCommand(invocation.argv, {
				baseEnv: {},
				buffer: false,
				cancelSignal: cancelController.signal,
				cwd,
				detached: process.platform !== "win32",
				env: shellEnv,
				forceKillAfterDelay: 300,
				...invocation.input === void 0 ? {} : { input: invocation.input },
				reject: false,
				stdio: [
					invocation.stdin,
					"pipe",
					"pipe"
				]
			});
			const completion = (async () => {
				if (child.pid === void 0) await waitForCommandSpawn(child);
				waitingForSpawn = false;
				const releaseOutput = releaseChildProcessOutputAfterExit(child.nodeChildProcess);
				let childExited = false;
				child.nodeChildProcess.once("exit", () => {
					childExited = true;
				});
				let commandSettled = false;
				const termination = createCommandTerminationController({
					child: child.nodeChildProcess,
					cancelController,
					baseEnv: {},
					env: shellEnv,
					processTree: { mode: "force" },
					killGraceMs: 300,
					isChildExited: () => childExited,
					isCommandSettled: () => commandSettled
				});
				terminationController = termination;
				child.stdout?.on("data", (data) => {
					if (acceptingOutput) onData(data, "stdout");
				});
				child.stderr?.on("data", (data) => {
					if (acceptingOutput) onData(data, "stderr");
				});
				if (cancellationRequested) terminate();
				let result;
				try {
					result = await child;
				} finally {
					commandSettled = true;
					try {
						await termination.settle();
					} finally {
						releaseOutput();
					}
				}
				if (result.failed && result.exitCode === void 0 && result.signal === void 0) {
					if (result instanceof Error) throw result;
					throw new Error(`Failed to launch shell: ${shellConfig.shell}`, { cause: result });
				}
				if (signal?.aborted) throw new Error("aborted");
				if (timedOut || result.timedOut) throw new Error(`timeout:${timeout}`);
				return { exitCode: result.exitCode ?? (result.failed ? 1 : 0) };
			})();
			return await Promise.race([completion, startupCanceled.promise]);
		} catch (error) {
			throw toErrorObject(error, "Non-Error rejection");
		} finally {
			acceptingOutput = false;
			clearTimeout(timeoutHandle);
			signal?.removeEventListener("abort", terminate);
		}
	} };
}
//#endregion
//#region src/agents/sessions/tools/render-utils.ts
/**
* Rendering helpers for session tool output in the TUI.
*
* Normalizes paths/text/image fallbacks before tool results are styled or truncated.
*/
/** Shortens paths under the current home directory for display. */
function shortenPath(path) {
	if (typeof path !== "string") return "";
	return shortenPathWithHome(path, {
		home: os$1.homedir(),
		prefix: "~"
	});
}
/** Returns a display string for string/nullish values, or null for unsupported values. */
function str(value) {
	if (typeof value === "string") return value;
	if (value == null) return "";
	return null;
}
/** Replaces tabs with stable spaces so terminal layout does not shift by tab stop. */
function replaceTabs$1(text) {
	return text.replace(/\t/g, "   ");
}
/** Normalizes raw terminal output before display. */
function normalizeDisplayText(text) {
	return text.replace(/\r/g, "");
}
function trimTrailingEmptyLines(lines) {
	return lines.slice(0, lines.findLastIndex((line) => line !== "") + 1);
}
function reuseTextComponent(lastComponent, content) {
	const text = lastComponent ?? new Text("", 0, 0);
	text.setText(content);
	return text;
}
/** Extracts text output and image placeholders from a tool result. */
function getTextOutput(result, showImages) {
	if (!result) return "";
	const textBlocks = result.content.filter((c) => c.type === "text");
	const imageBlocks = result.content.filter((c) => c.type === "image");
	let output = textBlocks.map((c) => sanitizeBinaryOutput(c.text || "", { ansiMode: "compat" }).replace(/\r/g, "")).join("\n");
	const caps = getCapabilities();
	if (imageBlocks.length > 0 && (!caps.images || !showImages)) {
		const imageIndicators = imageBlocks.map((img) => {
			const mimeType = img.mimeType ?? "image/unknown";
			const dims = img.data && img.mimeType ? getImageDimensions(img.data, img.mimeType) ?? void 0 : void 0;
			return imageFallback(mimeType, dims);
		}).join("\n");
		output = output ? `${output}\n${imageIndicators}` : imageIndicators;
	}
	return output;
}
/** Renders bounded text output with the shared TUI expansion hint. */
function formatSessionToolOutput(result, options, theme, showImages, collapsedLineLimit) {
	const output = getTextOutput(result, showImages).trim();
	if (!output) return "";
	const lines = output.split("\n");
	const maxLines = options.expanded ? lines.length : collapsedLineLimit;
	const displayLines = lines.slice(0, maxLines);
	const remaining = lines.length - maxLines;
	let text = `\n${displayLines.map((line) => theme.fg("toolOutput", line)).join("\n")}`;
	if (remaining > 0) text += `${theme.fg("muted", `\n... (${remaining} more lines,`)} ${keyHint("app.tools.expand", "to expand")})`;
	return text;
}
function appendSessionToolTruncationWarning(text, theme, options) {
	const warnings = [];
	if (options.limit) warnings.push(`${options.limit.count} ${options.limit.noun} limit`);
	if (options.truncation?.truncated) warnings.push(`${formatSize(options.truncation.maxBytes ?? 51200)} limit`);
	warnings.push(...options.additionalWarnings ?? []);
	if (warnings.length === 0) return text;
	return `${text}\n${theme.fg("warning", `[Truncated: ${warnings.join(", ")}]`)}`;
}
/** Formats the invalid-argument marker with the active theme. */
function invalidArgText(theme) {
	return theme.fg("error", "[invalid arg]");
}
//#endregion
//#region src/agents/sessions/tools/tool-definition-wrapper.ts
/** Wrap a ToolDefinition into an AgentTool for the core runtime. */
function wrapToolDefinition(definition, ctxFactory) {
	const tool = {
		name: definition.name,
		label: definition.label,
		...definition.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
		...definition.resultContentSource ? { resultContentSource: definition.resultContentSource } : {},
		description: definition.description,
		parameters: definition.parameters,
		...definition.outputSchema ? { outputSchema: definition.outputSchema } : {},
		prepareArguments: definition.prepareArguments,
		executionMode: definition.executionMode,
		execute: (toolCallId, params, signal, onUpdate) => definition.execute(toolCallId, params, signal, onUpdate, ctxFactory?.())
	};
	copyCodeModeControlToolIdentity(definition, tool);
	return copyInternalToolExecutionPreparer(definition, tool);
}
/** Wrap multiple ToolDefinitions into AgentTools for the core runtime. */
function wrapToolDefinitions(definitions, ctxFactory) {
	return definitions.map((definition) => wrapToolDefinition(definition, ctxFactory));
}
/**
* Synthesize a minimal ToolDefinition from an AgentTool.
*
* This keeps AgentSession's internal registry definition-first even when a caller
* provides plain AgentTool overrides that do not include prompt metadata or renderers.
*/
function createToolDefinitionFromAgentTool(tool) {
	const definition = {
		name: tool.name,
		label: tool.label,
		...tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
		...tool.resultContentSource ? { resultContentSource: tool.resultContentSource } : {},
		description: tool.description,
		parameters: tool.parameters,
		...tool.outputSchema ? { outputSchema: tool.outputSchema } : {},
		prepareArguments: tool.prepareArguments,
		executionMode: tool.executionMode,
		execute: async (toolCallId, params, signal, onUpdate) => tool.execute(toolCallId, params, signal, onUpdate)
	};
	copyCodeModeControlToolIdentity(tool, definition);
	return copyInternalToolExecutionPreparer(tool, definition);
}
//#endregion
//#region src/agents/sessions/tools/bash.ts
/**
* Built-in bash session tool.
*
* Executes local shell commands with streaming output accumulation and TUI renderers.
*/
const bashSchema = Type.Object({
	title: executionTitleSchema(),
	command: Type.String({ description: "Bash command." }),
	timeout: Type.Optional(Type.Number({ description: "Optional timeout seconds; default none." }))
});
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.bashToolTestApi")] = { resolveBashTimeoutMs };
function resolveSpawnContext(command, cwd, spawnHook, shellPath) {
	const baseContext = {
		command,
		cwd,
		env: getBashShellEnv(shellPath)
	};
	return spawnHook ? spawnHook(baseContext) : baseContext;
}
const BASH_PREVIEW_LINES = 5;
const BASH_UPDATE_THROTTLE_MS = 100;
var BashResultRenderComponent = class extends Container {
	constructor(..._args) {
		super(..._args);
		this.state = {
			cachedWidth: void 0,
			cachedLines: void 0,
			cachedSkipped: void 0
		};
	}
};
function formatBashCall(args) {
	const command = str(args?.command);
	const timeout = args?.timeout;
	const timeoutSuffix = timeout ? interactiveAgentTheme.fg("muted", ` (timeout ${timeout}s)`) : "";
	const commandDisplay = command === null ? invalidArgText(interactiveAgentTheme) : command ? command : interactiveAgentTheme.fg("toolOutput", "...");
	return interactiveAgentTheme.fg("toolTitle", interactiveAgentTheme.bold(`$ ${commandDisplay}`)) + timeoutSuffix;
}
function rebuildBashResultRenderComponent(component, result, options, showImages, startedAt, endedAt) {
	const state = component.state;
	component.clear();
	let output = getTextOutput(result, showImages).trim();
	const truncation = result.details?.truncation;
	const fullOutputPath = result.details?.fullOutputPath;
	if (!options.isPartial && truncation?.truncated && fullOutputPath && output.endsWith("]")) {
		const footerStart = output.lastIndexOf("\n\n[");
		if (footerStart !== -1 && output.slice(footerStart).includes(fullOutputPath)) output = output.slice(0, footerStart).trimEnd();
	}
	if (output) {
		const styledOutput = output.split("\n").map((line) => interactiveAgentTheme.fg("toolOutput", line)).join("\n");
		if (options.expanded) component.addChild(new Text(`\n${styledOutput}`, 0, 0));
		else component.addChild({
			render: (width) => {
				if (state.cachedLines === void 0 || state.cachedWidth !== width) {
					const preview = truncateToVisualLines(styledOutput, BASH_PREVIEW_LINES, width);
					state.cachedLines = preview.visualLines;
					state.cachedSkipped = preview.skippedCount;
					state.cachedWidth = width;
				}
				if (state.cachedSkipped && state.cachedSkipped > 0) {
					const hint = interactiveAgentTheme.fg("muted", `... (${state.cachedSkipped} earlier lines,`) + ` ${keyHint("app.tools.expand", "to expand")})`;
					return [
						"",
						truncateToWidth(hint, width, "..."),
						...state.cachedLines ?? []
					];
				}
				return ["", ...state.cachedLines ?? []];
			},
			invalidate: () => {
				state.cachedWidth = void 0;
				state.cachedLines = void 0;
				state.cachedSkipped = void 0;
			}
		});
	}
	if (truncation?.truncated || fullOutputPath) {
		const warnings = [];
		if (fullOutputPath) warnings.push(formatFullOutputFooter(fullOutputPath));
		if (truncation?.truncated) {
			if (truncation.truncatedBy === "lines") warnings.push(`Truncated: showing ${truncation.outputLines} of ${truncation.totalLines} lines`);
			else warnings.push(`Truncated: ${truncation.outputLines} lines shown (${formatSize(truncation.maxBytes ?? 51200)} limit)`);
		}
		component.addChild(new Text(`\n${interactiveAgentTheme.fg("warning", `[${warnings.join(". ")}]`)}`, 0, 0));
	}
	if (startedAt !== void 0) {
		const label = options.isPartial ? "Elapsed" : "Took";
		const endTime = endedAt ?? Date.now();
		component.addChild(new Text(`\n${interactiveAgentTheme.fg("muted", `${label} ${formatDurationSeconds(endTime - startedAt)}`)}`, 0, 0));
	}
}
function createBashToolDefinition(cwd, options) {
	const ops = options?.operations ?? createLocalBashOperations({ shellPath: options?.shellPath });
	const commandPrefix = options?.commandPrefix;
	const spawnHook = options?.spawnHook;
	return {
		name: "bash",
		label: "bash",
		description: `Run bash in cwd; stdout+stderr. Returns last ${DEFAULT_MAX_LINES} lines or ${DEFAULT_MAX_BYTES / 1024}KB; full truncated output saved temp. Optional timeout seconds.`,
		promptSnippet: "Execute bash commands (ls, grep, find, etc.)",
		parameters: bashSchema,
		async execute(toolCallId, { command, timeout }, signal, onUpdate, ctx) {
			resolveBashTimeoutMs(timeout);
			const spawnContext = resolveSpawnContext(commandPrefix ? `${commandPrefix}\n${command}` : command, cwd, spawnHook, options?.shellPath);
			const output = new OutputAccumulator({ tempFilePrefix: "openclaw-bash" });
			let acceptingOutput = true;
			let updateTimer;
			let updateDirty = false;
			let lastUpdateAt = 0;
			const emitOutputUpdate = () => {
				if (!onUpdate || !updateDirty) return;
				updateDirty = false;
				lastUpdateAt = Date.now();
				const snapshot = output.snapshot({ persistIfTruncated: true });
				onUpdate({
					content: [{
						type: "text",
						text: snapshot.content || ""
					}],
					details: {
						truncation: snapshot.truncation.truncated ? snapshot.truncation : void 0,
						fullOutputPath: snapshot.fullOutputPath
					}
				});
			};
			const clearUpdateTimer = () => {
				if (updateTimer) {
					clearTimeout(updateTimer);
					updateTimer = void 0;
				}
			};
			const scheduleOutputUpdate = () => {
				if (!onUpdate) return;
				updateDirty = true;
				const delay = BASH_UPDATE_THROTTLE_MS - (Date.now() - lastUpdateAt);
				if (delay <= 0) {
					clearUpdateTimer();
					emitOutputUpdate();
					return;
				}
				updateTimer ??= setTimeout(() => {
					updateTimer = void 0;
					emitOutputUpdate();
				}, delay);
			};
			if (onUpdate) onUpdate({
				content: [],
				details: void 0
			});
			const handleData = (data, stream) => {
				if (!acceptingOutput) return;
				output.append(data, stream);
				scheduleOutputUpdate();
			};
			const finishOutput = async () => {
				acceptingOutput = false;
				output.finish();
				clearUpdateTimer();
				emitOutputUpdate();
				const snapshot = output.snapshot({ persistIfTruncated: true });
				await output.closeTempFile();
				return snapshot;
			};
			const formatOutput = (snapshot, emptyText = "(no output)") => {
				const truncation = snapshot.truncation;
				let text = snapshot.content || emptyText;
				let details;
				if (truncation.truncated) {
					const fullOutputPath = snapshot.fullOutputPath;
					if (!fullOutputPath) throw new Error("Missing full output path for truncated bash output");
					details = {
						truncation,
						fullOutputPath
					};
					const startLine = truncation.totalLines - truncation.outputLines + 1;
					const endLine = truncation.totalLines;
					if (truncation.lastLinePartial) {
						const lastLineSize = formatSize(output.getLastLineBytes());
						text += `\n\n[Showing last ${formatSize(truncation.outputBytes)} of line ${endLine} (line is ${lastLineSize}). ${formatFullOutputFooter(fullOutputPath)}]`;
					} else if (truncation.truncatedBy === "lines") text += `\n\n[Showing lines ${startLine}-${endLine} of ${truncation.totalLines}. ${formatFullOutputFooter(fullOutputPath)}]`;
					else text += `\n\n[Showing lines ${startLine}-${endLine} of ${truncation.totalLines} (${formatSize(DEFAULT_MAX_BYTES)} limit). ${formatFullOutputFooter(fullOutputPath)}]`;
				}
				return {
					text,
					details
				};
			};
			const appendStatus = (text, status) => `${text ? `${text}\n\n` : ""}${status}`;
			try {
				let exitCode;
				try {
					exitCode = (await ops.exec(spawnContext.command, spawnContext.cwd, {
						onData: handleData,
						signal,
						timeout,
						env: spawnContext.env
					})).exitCode;
				} catch (err) {
					const { text } = formatOutput(await finishOutput(), "");
					if (err instanceof Error && err.message === "aborted") throw new Error(appendStatus(text, "Command aborted"), { cause: err });
					if (err instanceof Error && err.message.startsWith("timeout:")) {
						const timeoutSecs = err.message.split(":")[1];
						throw new Error(appendStatus(text, `Command timed out after ${timeoutSecs} seconds`), { cause: err });
					}
					throw err;
				}
				const { text: outputText, details } = formatOutput(await finishOutput());
				if (exitCode !== 0 && exitCode !== null) throw new Error(appendStatus(outputText, `Command exited with code ${exitCode}`));
				return {
					content: [{
						type: "text",
						text: outputText
					}],
					details
				};
			} finally {
				clearUpdateTimer();
			}
		},
		renderCall(args, themeValue, context) {
			const state = context.state;
			if (context.executionStarted && state.startedAt === void 0) {
				state.startedAt = Date.now();
				state.endedAt = void 0;
			}
			return reuseTextComponent(context.lastComponent, formatBashCall(args));
		},
		renderResult(result, optionsLocal, themeLocal, context) {
			const state = context.state;
			if (state.startedAt !== void 0 && optionsLocal.isPartial && !state.interval) state.interval = setInterval(() => context.invalidate(), 1e3);
			if (!optionsLocal.isPartial || context.isError) {
				state.endedAt ??= Date.now();
				if (state.interval) {
					clearInterval(state.interval);
					state.interval = void 0;
				}
			}
			const component = context.lastComponent ?? new BashResultRenderComponent();
			rebuildBashResultRenderComponent(component, result, optionsLocal, context.showImages, state.startedAt, state.endedAt);
			component.invalidate();
			return component;
		}
	};
}
function createBashTool(cwd, options) {
	return wrapToolDefinition(createBashToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/line-endings.ts
/**
* Line-ending detection and restoration shared by the file-mutating agent tools.
*/
function detectLineEnding(content) {
	const crlfIdx = content.indexOf("\r\n");
	const lfIdx = content.indexOf("\n");
	if (lfIdx === -1) return "\n";
	if (crlfIdx === -1) return "\n";
	return crlfIdx < lfIdx ? "\r\n" : "\n";
}
function normalizeToLF(text) {
	return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
//#endregion
//#region src/agents/modes/interactive/components/diff.ts
/**
* Interactive terminal diff renderer.
*
* Produces colored line and intra-line highlights for the Pi TUI review surfaces.
*/
/**
* Parse diff line to extract prefix, line number, and content.
* Format: "+123 content" or "-123 content" or " 123 content" or "     ..."
*/
function parseDiffLine(line) {
	const match = line.match(/^([+-\s])(\s*\d*)\s(.*)$/);
	if (!match) return null;
	const [, prefix, lineNum, content] = match;
	return prefix !== void 0 && lineNum !== void 0 && content !== void 0 ? {
		prefix,
		lineNum,
		content
	} : null;
}
/**
* Replace tabs with spaces for consistent rendering.
*/
function replaceTabs(text) {
	return text.replace(/\t/g, "   ");
}
/**
* Compute word-level diff and render with inverse on changed parts.
* Uses diffWords which groups whitespace with adjacent words for cleaner highlighting.
* Strips leading whitespace from inverse to avoid highlighting indentation.
*/
function renderIntraLineDiff(oldContent, newContent) {
	let removedLine = "";
	let addedLine = "";
	const seen = {
		added: false,
		removed: false
	};
	for (const part of diffWords(oldContent, newContent)) {
		const kind = part.added ? "added" : part.removed ? "removed" : void 0;
		let value = part.value;
		if (kind) {
			const changed = seen[kind] ? value : value.trimStart();
			value = value.slice(0, value.length - changed.length) + (changed ? interactiveAgentTheme.inverse(changed) : "");
			seen[kind] = true;
		}
		if (!part.added) removedLine += value;
		if (!part.removed) addedLine += value;
	}
	return {
		removedLine,
		addedLine
	};
}
/**
* Render a diff string with colored lines and intra-line change highlighting.
* - Context lines: dim/gray
* - Removed lines: red, with inverse on changed tokens
* - Added lines: green, with inverse on changed tokens
*/
function renderDiff(diffText) {
	const lines = diffText.split("\n");
	const result = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines.at(i);
		if (line === void 0) break;
		const parsed = parseDiffLine(line);
		if (!parsed) {
			result.push(interactiveAgentTheme.fg("toolDiffContext", line));
			i++;
			continue;
		}
		if (parsed.prefix === "-") {
			const removedLines = [];
			while (i < lines.length) {
				const currentLine = lines.at(i);
				const p = currentLine === void 0 ? null : parseDiffLine(currentLine);
				if (!p || p.prefix !== "-") break;
				removedLines.push({
					lineNum: p.lineNum,
					content: p.content
				});
				i++;
			}
			const addedLines = [];
			while (i < lines.length) {
				const currentLine = lines.at(i);
				const p = currentLine === void 0 ? null : parseDiffLine(currentLine);
				if (!p || p.prefix !== "+") break;
				addedLines.push({
					lineNum: p.lineNum,
					content: p.content
				});
				i++;
			}
			if (removedLines.length === 1 && addedLines.length === 1) {
				const removed = removedLines[0];
				const added = addedLines[0];
				if (!removed || !added) continue;
				const { removedLine, addedLine } = renderIntraLineDiff(replaceTabs(removed.content), replaceTabs(added.content));
				result.push(interactiveAgentTheme.fg("toolDiffRemoved", `-${removed.lineNum} ${removedLine}`));
				result.push(interactiveAgentTheme.fg("toolDiffAdded", `+${added.lineNum} ${addedLine}`));
			} else {
				for (const removed of removedLines) result.push(interactiveAgentTheme.fg("toolDiffRemoved", `-${removed.lineNum} ${replaceTabs(removed.content)}`));
				for (const added of addedLines) result.push(interactiveAgentTheme.fg("toolDiffAdded", `+${added.lineNum} ${replaceTabs(added.content)}`));
			}
		} else if (parsed.prefix === "+") {
			result.push(interactiveAgentTheme.fg("toolDiffAdded", `+${parsed.lineNum} ${replaceTabs(parsed.content)}`));
			i++;
		} else {
			result.push(interactiveAgentTheme.fg("toolDiffContext", ` ${parsed.lineNum} ${replaceTabs(parsed.content)}`));
			i++;
		}
	}
	return result.join("\n");
}
//#endregion
//#region src/agents/utf8-file.ts
const strictUtf8FileDecoder = new TextDecoder("utf-8", {
	fatal: true,
	ignoreBOM: true
});
/** Reject invalid file bytes without stripping a valid leading UTF-8 BOM. */
function decodeUtf8File(contents, filePath) {
	try {
		return strictUtf8FileDecoder.decode(contents);
	} catch (error) {
		throw new Error(`File ${filePath} is not valid UTF-8 and cannot be edited safely.`, { cause: error });
	}
}
//#endregion
//#region src/agents/sessions/tools/edit-replacements.ts
function splitLinesWithEndings(content) {
	return content.match(/[^\n]*\n|[^\n]+/g) ?? [];
}
function getLineSpans(content) {
	let offset = 0;
	return splitLinesWithEndings(content).map((line) => {
		const span = {
			start: offset,
			end: offset + line.length
		};
		offset = span.end;
		return span;
	});
}
function getReplacementLineRange(lines, replacement) {
	const replacementStart = replacement.matchIndex;
	const replacementEnd = replacement.matchIndex + replacement.matchLength;
	let lower = 0;
	let upper = lines.length;
	while (lower < upper) {
		const middle = Math.floor((lower + upper) / 2);
		const line = lines[middle];
		if (!line) throw new Error("Replacement range is outside the base content.");
		if (line.end <= replacementStart) lower = middle + 1;
		else upper = middle;
	}
	const firstLine = lines[lower];
	const startLine = firstLine && replacementStart >= firstLine.start ? lower : -1;
	if (startLine === -1) throw new Error("Replacement range is outside the base content.");
	let endLine = startLine;
	while (endLine < lines.length) {
		const line = lines.at(endLine);
		if (!line || line.end >= replacementEnd) break;
		endLine++;
	}
	if (endLine >= lines.length) throw new Error("Replacement range is outside the base content.");
	return {
		startLine,
		endLine: endLine + 1
	};
}
function applyReplacements(content, replacements, offset = 0) {
	const parts = [];
	let cursor = 0;
	for (const replacement of replacements) {
		const matchIndex = replacement.matchIndex - offset;
		parts.push(content.slice(cursor, matchIndex), replacement.newText);
		cursor = matchIndex + replacement.matchLength;
	}
	parts.push(content.slice(cursor));
	return parts.join("");
}
function groupReplacementsByLine(baseContent, replacements) {
	const lines = getLineSpans(baseContent);
	const groups = [];
	const sortedReplacements = replacements.toSorted((a, b) => a.matchIndex - b.matchIndex);
	for (const replacement of sortedReplacements) {
		const range = getReplacementLineRange(lines, replacement);
		const current = groups.at(-1);
		if (current && range.startLine < current.endLine) {
			current.endLine = Math.max(current.endLine, range.endLine);
			current.replacements.push(replacement);
		} else groups.push({
			...range,
			replacements: [replacement]
		});
	}
	return {
		lines,
		groups
	};
}
function splitLinesWithTerminators(content) {
	return content.match(/[^\r\n]*(?:\r\n|\r|\n)|[^\r\n]+/g) ?? [];
}
function getLineTerminator(line) {
	if (line === void 0) return;
	if (line.endsWith("\r\n")) return "\r\n";
	if (line.endsWith("\n")) return "\n";
	return line.endsWith("\r") ? "\r" : void 0;
}
function restoreNormalizedLineEndings(normalizedContent, sourceLines, fallback) {
	let sourceIndex = 0;
	return normalizedContent.replace(/\n/g, () => {
		const source = sourceLines[sourceIndex] ?? sourceLines.at(-1);
		sourceIndex++;
		return getLineTerminator(source) ?? fallback;
	});
}
function countLineBreaks(content) {
	return content.match(/\n/g)?.length ?? 0;
}
function applyReplacementsPreservingLineEndings(originalContent, baseContent, replacements) {
	const originalLines = splitLinesWithTerminators(originalContent);
	const { lines: baseLines, groups } = groupReplacementsByLine(baseContent, replacements);
	if (originalLines.length !== baseLines.length) throw new Error("Cannot preserve original line endings because the base content has a different line count.");
	const fileFallback = detectLineEnding(originalContent);
	let originalIndex = 0;
	let result = "";
	for (const group of groups) {
		result += originalLines.slice(originalIndex, group.startLine).join("");
		const firstLine = baseLines.at(group.startLine);
		const lastLine = baseLines.at(group.endLine - 1);
		if (!firstLine || !lastLine) throw new Error("Replacement group is outside the base content.");
		const groupStartOffset = firstLine.start;
		const normalizedGroup = baseContent.slice(groupStartOffset, lastLine.end);
		const sourceGroup = originalLines.slice(group.startLine, group.endLine);
		const groupFallback = getLineTerminator(sourceGroup[0]) ?? getLineTerminator(originalLines[group.startLine - 1]) ?? fileFallback;
		const restoredGroup = restoreNormalizedLineEndings(normalizedGroup, sourceGroup, groupFallback);
		const restoredReplacements = group.replacements.map((replacement) => {
			const relativeStart = replacement.matchIndex - groupStartOffset;
			const relativeEnd = relativeStart + replacement.matchLength;
			const restoredStart = restoreNormalizedLineEndings(normalizedGroup.slice(0, relativeStart), sourceGroup, groupFallback).length;
			const restoredEnd = restoreNormalizedLineEndings(normalizedGroup.slice(0, relativeEnd), sourceGroup, groupFallback).length;
			const range = getReplacementLineRange(baseLines, replacement);
			const replacementSource = originalLines.slice(range.startLine, range.endLine);
			const replacementFallback = getLineTerminator(replacementSource[0]) ?? getLineTerminator(originalLines[range.startLine - 1]) ?? fileFallback;
			const consumedTerminatorCount = countLineBreaks(normalizedGroup.slice(relativeStart, relativeEnd));
			const replacementTerminatorCount = countLineBreaks(replacement.newText);
			const terminatorSources = consumedTerminatorCount > 0 ? replacementSource.slice(0, consumedTerminatorCount) : replacementSource.slice(0, 1);
			const sourceOffset = Math.max(0, terminatorSources.length - replacementTerminatorCount);
			return {
				matchIndex: restoredStart,
				matchLength: restoredEnd - restoredStart,
				newText: restoreNormalizedLineEndings(replacement.newText, terminatorSources.slice(sourceOffset), replacementFallback)
			};
		});
		result += applyReplacements(restoredGroup, restoredReplacements);
		originalIndex = group.endLine;
	}
	return result + originalLines.slice(originalIndex).join("");
}
//#endregion
//#region src/agents/sessions/tools/edit-diff.ts
/**
* Shared diff computation utilities for the edit tool.
* Used by both edit.ts (for execution) and tool-execution.ts (for preview rendering).
*/
const fuzzyGraphemeSegmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
function foldFuzzyCharacters(text) {
	return text.replace(/[\u2018\u2019\u201A\u201B]/g, "'").replace(/[\u201C\u201D\u201E\u201F]/g, "\"").replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, "-").replace(/[\u00A0\u2002-\u200A\u202F\u205F\u3000]/g, " ");
}
/**
* Normalize text for fuzzy matching. Applies progressive transformations:
* - Strip trailing whitespace from each line
* - Normalize smart quotes to ASCII equivalents
* - Normalize Unicode dashes/hyphens to ASCII hyphen
* - Normalize special Unicode spaces to regular space
*
*/
function normalizeForFuzzyMatch(text) {
	return foldFuzzyCharacters(text.normalize("NFKC").split("\n").map((line) => line.trimEnd()).join("\n"));
}
function buildNfkcBoundaries(text, authoritativeNfkc) {
	const boundaries = [];
	const normalizedSegments = [];
	let normalizedOffset = 0;
	for (const segment of fuzzyGraphemeSegmenter.segment(text)) {
		const sourceStart = segment.index;
		const sourceEnd = sourceStart + segment.segment.length;
		const normalizedSegment = segment.segment.normalize("NFKC");
		normalizedSegments.push(normalizedSegment);
		const boundary = boundaries[normalizedOffset] ?? {};
		if (normalizedSegment.length === 0) {
			boundaries[normalizedOffset] = {
				end: boundary.end ?? sourceStart,
				start: sourceEnd
			};
			continue;
		}
		boundaries[normalizedOffset] = {
			start: boundary.start ?? sourceStart,
			end: boundary.end ?? sourceStart
		};
		normalizedOffset += normalizedSegment.length;
		boundaries[normalizedOffset] = {
			start: sourceEnd,
			end: sourceEnd
		};
	}
	if (normalizedSegments.join("") !== authoritativeNfkc) return;
	return boundaries;
}
function buildFuzzyBoundaries(text, normalizedText) {
	const authoritativeNfkc = text.normalize("NFKC");
	const nfkcBoundaries = buildNfkcBoundaries(text, authoritativeNfkc);
	if (!nfkcBoundaries) return;
	const boundaries = [];
	let sourceLineStart = 0;
	let normalizedLineStart = 0;
	while (sourceLineStart <= authoritativeNfkc.length) {
		const newlineIndex = authoritativeNfkc.indexOf("\n", sourceLineStart);
		const sourceLineEnd = newlineIndex === -1 ? authoritativeNfkc.length : newlineIndex;
		const line = authoritativeNfkc.slice(sourceLineStart, sourceLineEnd);
		const keptLineEnd = sourceLineStart + line.trimEnd().length;
		for (let offset = sourceLineStart; offset <= keptLineEnd; offset++) {
			const boundary = nfkcBoundaries[offset];
			if (boundary) boundaries[normalizedLineStart + offset - sourceLineStart] = boundary;
		}
		const normalizedLineEnd = normalizedLineStart + keptLineEnd - sourceLineStart;
		if (keptLineEnd < sourceLineEnd) {
			const beforeTrim = nfkcBoundaries[keptLineEnd];
			const afterTrim = nfkcBoundaries[sourceLineEnd];
			boundaries[normalizedLineEnd] = {
				end: beforeTrim?.end,
				start: afterTrim?.start
			};
		}
		if (newlineIndex === -1) break;
		const afterNewline = nfkcBoundaries[sourceLineEnd + 1];
		boundaries[normalizedLineEnd + 1] = afterNewline;
		normalizedLineStart = normalizedLineEnd + 1;
		sourceLineStart = sourceLineEnd + 1;
	}
	if (boundaries.length > normalizedText.length + 1) return;
	return boundaries;
}
function translateFuzzySpan(normalized, fuzzyStart, fuzzyLength) {
	const fuzzyEnd = fuzzyStart + fuzzyLength;
	const originalStart = normalized.boundaries?.[fuzzyStart]?.start;
	const originalEnd = normalized.boundaries?.[fuzzyEnd]?.end;
	if (originalStart === void 0 || originalEnd === void 0) return;
	return {
		originalStart,
		originalLength: originalEnd - originalStart
	};
}
var EditNoChangeError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "EditNoChangeError";
	}
};
/**
* Find oldText in content, trying exact match first, then fuzzy match.
* When fuzzy matching is used and an offsetMap is provided, the returned
* index and matchLength are translated back to original-content coordinates
* so the caller can apply replacements against the un-normalized content.
*/
function fuzzyFindText(content, oldText, normalizedFile) {
	const exactIndex = content.indexOf(oldText);
	if (exactIndex !== -1) return {
		found: true,
		index: exactIndex,
		matchLength: oldText.length,
		usedFuzzyMatch: false
	};
	const fuzzyContent = normalizedFile?.text ?? normalizeForFuzzyMatch(content);
	const fuzzyOldText = normalizeForFuzzyMatch(oldText);
	if (!fuzzyOldText) return {
		found: false,
		index: -1,
		matchLength: 0,
		usedFuzzyMatch: true,
		unsafeBoundary: true
	};
	const fuzzyIndex = fuzzyContent.indexOf(fuzzyOldText);
	if (fuzzyIndex === -1) return {
		found: false,
		index: -1,
		matchLength: 0,
		usedFuzzyMatch: false
	};
	if (normalizedFile && !normalizedFile.boundaries) normalizedFile.boundaries = buildFuzzyBoundaries(content, normalizedFile.text);
	const translated = normalizedFile ? translateFuzzySpan(normalizedFile, fuzzyIndex, fuzzyOldText.length) : void 0;
	if (!translated) return {
		found: false,
		index: -1,
		matchLength: 0,
		usedFuzzyMatch: true,
		unsafeBoundary: true
	};
	return {
		found: true,
		index: translated.originalStart,
		matchLength: translated.originalLength,
		usedFuzzyMatch: true
	};
}
/** Strip UTF-8 BOM if present, return both the BOM (if any) and the text without it */
function stripBom(content) {
	return content.startsWith("﻿") ? {
		bom: "﻿",
		text: content.slice(1)
	} : {
		bom: "",
		text: content
	};
}
function countOccurrences(fuzzyContent, oldText) {
	const fuzzyOldText = normalizeForFuzzyMatch(oldText);
	if (!fuzzyOldText) return 0;
	return fuzzyContent.split(fuzzyOldText).length - 1;
}
function countExactOccurrences(content, oldText) {
	return content.split(oldText).length - 1;
}
const EDIT_CANDIDATE_LIMIT = 3;
const EDIT_CANDIDATE_MAX_LINES = 1e3;
const EDIT_CANDIDATE_MAX_SCAN_CHARS = 131072;
const EDIT_CANDIDATE_MAX_LINE_CHARS = 120;
const EDIT_CANDIDATE_MIN_SCORE = .45;
function truncateCandidateText(text, maxChars) {
	if (text.length <= maxChars) return text;
	const cut = maxChars > 0 && /[\uD800-\uDBFF]/.test(text.charAt(maxChars - 1)) && /[\uDC00-\uDFFF]/.test(text.charAt(maxChars)) ? maxChars - 1 : maxChars;
	return text.slice(0, cut);
}
function getBoundedLines(text, maxLines, maxScanChars) {
	return truncateCandidateText(text, maxScanChars).split("\n", maxLines).map((line) => truncateCandidateText(line, EDIT_CANDIDATE_MAX_LINE_CHARS));
}
function scoreCandidate(expected, candidate) {
	const normalizedExpected = expected.trim();
	const normalizedCandidate = candidate.trim();
	const maxLength = Math.max(normalizedExpected.length, normalizedCandidate.length);
	if (maxLength === 0) return 0;
	if (Math.min(normalizedExpected.length, normalizedCandidate.length) / maxLength < EDIT_CANDIDATE_MIN_SCORE) return 0;
	return 1 - levenshteinDistance(normalizedExpected, normalizedCandidate) / maxLength;
}
function describeIndentation(line) {
	const indentation = line.match(/^[ \t]*/)?.[0] ?? "";
	if (!indentation) return "none";
	const tabs = indentation.match(/\t/g)?.length ?? 0;
	const spaces = indentation.length - tabs;
	return tabs === 0 ? `${spaces} spaces` : `${spaces} spaces and ${tabs} tabs`;
}
function firstDifferenceIndex(left, right) {
	const sharedLength = Math.min(left.length, right.length);
	for (let index = 0; index < sharedLength; index++) if (left.charAt(index) !== right.charAt(index)) return index;
	return left.length === right.length ? -1 : sharedLength;
}
function describeCandidateDifference(expected, found) {
	if ((expected.match(/^[ \t]*/)?.[0] ?? "") !== (found.match(/^[ \t]*/)?.[0] ?? "")) return `indentation differs (expected ${describeIndentation(expected)}, found ${describeIndentation(found)})`;
	const expectedBackslashes = expected.match(/\\/g)?.length ?? 0;
	const foundBackslashes = found.match(/\\/g)?.length ?? 0;
	if (expectedBackslashes !== foundBackslashes) return `escaping differs (expected ${expectedBackslashes} backslashes, found ${foundBackslashes})`;
	const differenceIndex = firstDifferenceIndex(expected, found);
	return differenceIndex === -1 ? "this line matches; surrounding lines differ" : `first difference at column ${differenceIndex + 1}`;
}
function getCandidateHint(content, oldText) {
	const expected = getBoundedLines(oldText, 32, 4096).reduce((best, line) => line.trim().length > best.trim().length ? line : best, "");
	if (!expected.trim()) return "";
	const candidates = getBoundedLines(content, EDIT_CANDIDATE_MAX_LINES, EDIT_CANDIDATE_MAX_SCAN_CHARS).map((line, index) => {
		const score = scoreCandidate(expected, line);
		return score >= EDIT_CANDIDATE_MIN_SCORE ? {
			lineNumber: index + 1,
			line,
			score
		} : void 0;
	}).filter((candidate) => candidate !== void 0).toSorted((left, right) => right.score - left.score || left.lineNumber - right.lineNumber).slice(0, EDIT_CANDIDATE_LIMIT);
	if (candidates.length === 0) return "";
	const expectedDisplay = JSON.stringify(expected);
	return "\nClosest matching lines:\n" + candidates.map((candidate) => {
		const foundDisplay = JSON.stringify(candidate.line);
		const differenceIndex = firstDifferenceIndex(expectedDisplay, foundDisplay);
		const markerIndex = differenceIndex === -1 ? Math.min(expectedDisplay.length, foundDisplay.length) : differenceIndex;
		const markerWidth = Math.max(1, Math.min(12, Math.max(expectedDisplay.length, foundDisplay.length) - markerIndex));
		return [
			`  near line ${candidate.lineNumber} (${Math.round(candidate.score * 100)}% match):`,
			`    expected: ${expectedDisplay}`,
			`    found:    ${foundDisplay}`,
			`              ${" ".repeat(markerIndex)}${"^".repeat(markerWidth)}`,
			`    hint: ${describeCandidateDifference(expected, candidate.line)}`
		].join("\n");
	}).join("\n");
}
function getNotFoundError(path, editIndex, totalEdits, content, oldText) {
	const prefix = totalEdits === 1 ? "Could not find the exact text" : `Could not find edits[${editIndex}]`;
	const hint = getCandidateHint(content, oldText);
	return /* @__PURE__ */ new Error(`${prefix} in ${path}. The old text must match exactly including all whitespace and newlines.${hint}`);
}
function getDuplicateError(path, editIndex, totalEdits, occurrences) {
	if (totalEdits === 1) return /* @__PURE__ */ new Error(`Found ${occurrences} occurrences of the text in ${path}. The text must be unique. Please provide more context to make it unique.`);
	return /* @__PURE__ */ new Error(`Found ${occurrences} occurrences of edits[${editIndex}] in ${path}. Each oldText must be unique. Please provide more context to make it unique.`);
}
function getEmptyOldTextError(path, editIndex, totalEdits) {
	if (totalEdits === 1) return /* @__PURE__ */ new Error(`oldText must not be empty in ${path}.`);
	return /* @__PURE__ */ new Error(`edits[${editIndex}].oldText must not be empty in ${path}.`);
}
function getNoChangeError(path, totalEdits) {
	if (totalEdits === 1) return new EditNoChangeError(`No changes made to ${path}. The replacement produced identical content. This might indicate an issue with special characters or the text not existing as expected.`);
	return new EditNoChangeError(`No changes made to ${path}. The replacements produced identical content.`);
}
function getUnsafeFuzzyBoundaryError(path, editIndex, totalEdits) {
	const target = totalEdits === 1 ? "The fuzzy match" : `The fuzzy match for edits[${editIndex}]`;
	return /* @__PURE__ */ new Error(`${target} in ${path} crosses an ambiguous Unicode-normalization or trimmed-whitespace boundary. Copy the exact source text or use a span whose normalized boundaries map cleanly.`);
}
/**
* Apply one or more exact-text replacements to LF-normalized content.
*
* All edits are matched against the same original content. Replacements are
* assembled from original spans so offsets remain stable. Fuzzy matching is
* lookup-only: replacements always splice into the original content.
*/
function applyEdits(normalizedContent, edits, path) {
	const normalizedEdits = edits.map((edit) => ({
		oldText: normalizeToLF(edit.oldText),
		newText: normalizeToLF(edit.newText)
	}));
	for (const [i, edit] of normalizedEdits.entries()) if (edit.oldText.length === 0) throw getEmptyOldTextError(path, i, normalizedEdits.length);
	const fuzzyFile = normalizedEdits.some((edit) => !normalizedContent.includes(edit.oldText)) ? {
		text: normalizeForFuzzyMatch(normalizedContent),
		boundaries: void 0
	} : void 0;
	const replacementBaseContent = normalizedContent;
	const matchedEdits = [];
	for (const [i, edit] of normalizedEdits.entries()) {
		const matchResult = fuzzyFindText(normalizedContent, edit.oldText, fuzzyFile);
		const occurrences = fuzzyFile && matchResult.usedFuzzyMatch ? countOccurrences(fuzzyFile.text, edit.oldText) : countExactOccurrences(replacementBaseContent, edit.oldText);
		if (occurrences > 1) throw getDuplicateError(path, i, normalizedEdits.length, occurrences);
		if (matchResult.unsafeBoundary) throw getUnsafeFuzzyBoundaryError(path, i, normalizedEdits.length);
		if (!matchResult.found) throw getNotFoundError(path, i, normalizedEdits.length, normalizedContent, edit.oldText);
		matchedEdits.push({
			editIndex: i,
			matchIndex: matchResult.index,
			matchLength: matchResult.matchLength,
			newText: edit.newText
		});
	}
	matchedEdits.sort((a, b) => a.matchIndex - b.matchIndex);
	for (let i = 1; i < matchedEdits.length; i++) {
		const previous = matchedEdits.at(i - 1);
		const current = matchedEdits.at(i);
		if (!previous || !current) continue;
		if (previous.matchIndex + previous.matchLength > current.matchIndex) throw new Error(`edits[${previous.editIndex}] and edits[${current.editIndex}] overlap in ${path}. Merge them into one edit or target disjoint regions.`);
	}
	const baseContent = normalizedContent;
	const newContent = applyReplacements(replacementBaseContent, matchedEdits);
	if (baseContent === newContent) throw getNoChangeError(path, normalizedEdits.length);
	return {
		baseContent,
		newContent,
		replacementBaseContent,
		replacements: matchedEdits
	};
}
function applyEditsToNormalizedContent(normalizedContent, edits, path) {
	const { baseContent, newContent } = applyEdits(normalizedContent, edits, path);
	return {
		baseContent,
		newContent
	};
}
function applyEditsPreservingLineEndings(originalContent, edits, path) {
	const applied = applyEdits(normalizeToLF(originalContent), edits, path);
	const finalContent = applyReplacementsPreservingLineEndings(originalContent, applied.replacementBaseContent, applied.replacements);
	if (normalizeToLF(finalContent) !== applied.newContent) throw new Error("Line-ending restoration changed the normalized edit result.");
	return {
		baseContent: applied.baseContent,
		newContent: applied.newContent,
		finalContent
	};
}
/** Generate a standard unified patch. */
function generateUnifiedPatch(path, oldContent, newContent, contextLines = 4) {
	return createPatch(path, oldContent, newContent, void 0, void 0, {
		context: contextLines,
		headerOptions: FILE_HEADERS_ONLY
	});
}
/**
* Generate a display-oriented diff string with line numbers and context.
* Returns both the diff string and the first changed line number (in the new file).
* Prepared hunks must describe these exact contents with the requested context.
*/
function generateDiffString(oldContent, newContent, contextLines = 4, preparedHunks) {
	const hunks = preparedHunks ?? structuredPatch("", "", oldContent, newContent, void 0, void 0, { context: contextLines }).hunks;
	const oldLineCount = oldContent.split("\n").length;
	const newLineCount = newContent.split("\n").length;
	const lastNewLine = newContent === "" ? 0 : newLineCount - Number(newContent.endsWith("\n"));
	const lineNumWidth = String(Math.max(oldLineCount, newLineCount)).length;
	const ellipsis = ` ${"".padStart(lineNumWidth, " ")} ...`;
	const output = [];
	let firstChangedLine;
	for (const [hunkIndex, hunk] of hunks.entries()) {
		if (hunkIndex > 0 || hunk.newStart > 1) output.push(ellipsis);
		let oldLineNum = hunk.oldStart;
		let newLineNum = hunk.newStart;
		for (const line of hunk.lines) {
			const prefix = line[0];
			if (prefix === "\\") continue;
			if (firstChangedLine === void 0 && prefix !== " ") firstChangedLine = newLineNum;
			const lineNum = prefix === "-" ? oldLineNum : newLineNum;
			output.push(`${prefix}${String(lineNum).padStart(lineNumWidth, " ")} ${line.slice(1)}`);
			oldLineNum += prefix === "+" ? 0 : 1;
			newLineNum += prefix === "-" ? 0 : 1;
		}
		if (hunkIndex === hunks.length - 1 && hunk.newStart + hunk.newLines <= lastNewLine) output.push(ellipsis);
	}
	return {
		diff: output.join("\n"),
		firstChangedLine
	};
}
function validateNoOpEditTargets(normalizedContent, noOpEdits, realEdits, path) {
	if (noOpEdits.length > 0) applyEditsToNormalizedContent(normalizedContent, noOpEdits.map((edit) => ({
		oldText: edit.oldText,
		newText: ""
	})), path);
	const exactNoOpEdits = noOpEdits.filter((edit) => normalizedContent.includes(normalizeToLF(edit.oldText)));
	if (exactNoOpEdits.length > 0 && realEdits.length > 0) applyEditsToNormalizedContent(normalizedContent, [...exactNoOpEdits, ...realEdits].map((edit) => ({
		oldText: edit.oldText,
		newText: ""
	})), path);
}
function splitNoOpEdits(normalizedContent, edits, path) {
	const noOpEdits = [];
	const realEdits = [];
	for (const edit of edits) if (edit.oldText === edit.newText) {
		applyEditsToNormalizedContent(normalizedContent, [{
			oldText: edit.oldText,
			newText: ""
		}], path);
		noOpEdits.push(edit);
	} else realEdits.push(edit);
	return {
		noOpEdits,
		realEdits
	};
}
/**
* Compute the diff for one or more edit operations without applying them.
* Used for preview rendering in the TUI before the tool executes.
*/
async function computeEditsDiff(path, edits, cwd, operations, resolvePath = operations ? resolveToCwd : resolveLocalPathToCwd) {
	const absolutePath = resolvePath(path, cwd);
	try {
		try {
			if (operations) await operations.access(absolutePath);
			else await access(absolutePath, constants.R_OK);
		} catch (error) {
			return { error: `Could not edit file: ${path}. ${error instanceof Error && "code" in error ? `Error code: ${String(error.code)}` : String(error)}.` };
		}
		const rawContentResult = operations ? await operations.readFile(absolutePath) : await readFile(absolutePath, "utf-8");
		const { text: content } = stripBom(typeof rawContentResult === "string" ? rawContentResult : rawContentResult.toString("utf-8"));
		const normalizedContent = normalizeToLF(content);
		const { noOpEdits, realEdits } = splitNoOpEdits(normalizedContent, edits, path);
		validateNoOpEditTargets(normalizedContent, noOpEdits, realEdits, path);
		if (realEdits.length === 0) return {
			diff: "",
			firstChangedLine: void 0
		};
		const { baseContent, newContent } = applyEditsToNormalizedContent(normalizedContent, realEdits, path);
		return generateDiffString(baseContent, newContent);
	} catch (err) {
		if (err instanceof EditNoChangeError) return {
			diff: "",
			firstChangedLine: void 0
		};
		return { error: err instanceof Error ? err.message : String(err) };
	}
}
//#endregion
//#region src/agents/sessions/tools/file-mutation-queue.ts
/**
* Per-file mutation queue.
*
* Serializes reads and mutations targeting the same real file while allowing independent files to run in parallel.
*/
const fileMutationTails = resolveGlobalMap(Symbol.for("openclaw.fileMutationTails"), "close-only");
const keyAdmissions = resolveGlobalSingleton(Symbol.for("openclaw.fileMutationKeyAdmissions"), () => ({
	fallbackScope: {},
	tails: /* @__PURE__ */ new WeakMap()
}));
function resolveLocalFileMutationQueueKey(filePath) {
	return resolveIdentityPathViaExistingAncestorSync(filePath);
}
async function resolveFileMutationQueueKey(filePath, resolveQueueKey, signal) {
	return await (resolveQueueKey?.(filePath, signal) ?? resolveLocalFileMutationQueueKey(filePath));
}
/**
* Preserve source-call admission while backend-owned physical identities resolve concurrently.
* Registration is ordered per assistant message; file operations still use only fileMutationTails.
*/
async function withFileMutationQueueKeyResolution(keyResolution, fn) {
	return await withFileMutationQueueKeysResolution(keyResolution.then((key) => [key]), fn);
}
async function withFileMutationQueueKeysResolution(keysResolution, fn) {
	const scope = getAgentToolExecutionContext()?.assistantMessage ?? keyAdmissions.fallbackScope;
	const previousAdmission = keyAdmissions.tails.get(scope) ?? Promise.resolve();
	keysResolution.catch(() => void 0);
	let operation;
	const admission = previousAdmission.then(async () => {
		operation = enqueueFileMutationQueueKeys(await keysResolution, fn);
	});
	const tail = admission.then(() => void 0, () => void 0);
	keyAdmissions.tails.set(scope, tail);
	const cleanup = () => {
		if (keyAdmissions.tails.get(scope) === tail) keyAdmissions.tails.delete(scope);
	};
	tail.then(cleanup, cleanup);
	await admission;
	return await operation;
}
/**
* Serialize file mutation operations targeting the same file.
* Operations for different files still run in parallel.
*/
async function withFileMutationQueue(filePath, fn) {
	return await withFileMutationQueues([filePath], fn);
}
async function withFileMutationQueues(filePaths, fn) {
	return await enqueueFileMutationQueueKeys(filePaths.map(resolveLocalFileMutationQueueKey), fn);
}
function enqueueFileMutationQueueKeys(queueKeys, fn) {
	const keys = [...new Set(queueKeys)].toSorted();
	const current = Promise.all(keys.map((key) => (fileMutationTails.get(key) ?? Promise.resolve()).catch(() => void 0))).then(fn);
	const tail = current.then(() => void 0, () => void 0);
	for (const key of keys) fileMutationTails.set(key, tail);
	const cleanup = () => {
		for (const key of keys) if (fileMutationTails.get(key) === tail) fileMutationTails.delete(key);
	};
	tail.then(cleanup, cleanup);
	return current;
}
//#endregion
//#region src/agents/sessions/tools/file-write-verification.ts
async function verifyPersistedUtf8File(absolutePath, content, operations) {
	const expectedContent = Buffer.from(content, "utf8");
	const stat = await operations.statFile(absolutePath).catch(() => null);
	if (!stat || stat.type !== "file" || stat.size !== expectedContent.byteLength) return false;
	const readback = await operations.readFile(absolutePath).catch(() => void 0);
	if (readback === void 0) return false;
	return (Buffer.isBuffer(readback) ? readback : Buffer.from(readback, "utf8")).equals(expectedContent);
}
//#endregion
//#region src/agents/sessions/tools/edit.ts
/**
* Built-in edit session tool.
*
* Applies exact targeted replacements with queued file mutation, diff previews, and TUI renderers.
*/
const replaceEditSchema = Type.Object({
	oldText: Type.String({ description: "Exact original text; unique and non-overlapping in this call." }),
	newText: Type.String({ description: "Replacement text." })
}, {});
const editSchema = Type.Object({
	path: Type.String({ description: "File path; relative/absolute." }),
	edits: Type.Array(replaceEditSchema, { description: "Targeted replacements against original file; no overlap/nesting. Merge nearby changes." })
}, {});
const EditToolOutputSchema = Type.Union([Type.Object({ changed: Type.Literal(false) }, { additionalProperties: false }), Type.Object({
	changed: Type.Literal(true),
	diff: Type.String(),
	patch: Type.String(),
	firstChangedLine: Type.Optional(Type.Integer({ minimum: 1 }))
}, { additionalProperties: false })]);
const EDIT_MISMATCH_MESSAGE = "Could not find the exact text in";
const EDIT_MISMATCH_HINT_LIMIT = 800;
const defaultEditOperations = {
	readFile: (path) => readFile(path),
	writeFile: (path, content) => writeFile(path, content, "utf-8"),
	statFile: async (path) => {
		try {
			const stat$3 = await stat(path);
			return {
				type: stat$3.isFile() ? "file" : stat$3.isDirectory() ? "directory" : "other",
				size: stat$3.size,
				mtimeMs: stat$3.mtimeMs
			};
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return null;
			throw error;
		}
	},
	access: (path) => access(path, constants.R_OK | constants.W_OK)
};
function prepareEditArguments(input) {
	if (!input || typeof input !== "object") return input;
	const args = { ...input };
	if (typeof args.edits === "string") try {
		const parsed = JSON.parse(repairJson(args.edits, { preserveValidControlEscapes: true }));
		if (Array.isArray(parsed)) args.edits = parsed;
	} catch {}
	let edits = Array.isArray(args.edits) ? args.edits.map((edit) => {
		if (!isRecord(edit)) return edit;
		return {
			oldText: edit.oldText,
			newText: edit.newText
		};
	}) : args.edits;
	const { oldText, newText } = args;
	if (typeof oldText === "string" && typeof newText === "string") {
		const batch = Array.isArray(edits) ? edits : [];
		if (!batch.some((edit) => isRecord(edit) && edit.oldText === oldText && edit.newText === newText)) batch.push({
			oldText,
			newText
		});
		edits = batch;
	}
	return {
		path: args.path,
		edits
	};
}
function validateEditInput(input) {
	if (!Array.isArray(input.edits) || input.edits.length === 0) throw new Error("Edit tool input is invalid. edits must contain at least one replacement.");
	return {
		path: input.path,
		edits: input.edits
	};
}
function appendMismatchHint(error, currentContent) {
	const snippet = currentContent.length <= EDIT_MISMATCH_HINT_LIMIT ? currentContent : `${truncateUtf16Safe(currentContent, EDIT_MISMATCH_HINT_LIMIT)}\n... (truncated)`;
	const enhanced = new Error(`${error.message}\nCurrent file contents:\n${snippet}`, { cause: error });
	enhanced.stack = error.stack;
	return enhanced;
}
function createEditCallRenderComponent() {
	return Object.assign(new Box(1, 1, (text) => text), {
		preview: void 0,
		previewArgsKey: void 0,
		previewPending: false,
		settledError: false
	});
}
function getEditCallRenderComponent(state, lastComponent) {
	if (lastComponent instanceof Box) {
		const component = lastComponent;
		state.callComponent = component;
		return component;
	}
	if (state.callComponent) return state.callComponent;
	const component = createEditCallRenderComponent();
	state.callComponent = component;
	return component;
}
function getRenderablePreviewInput(args) {
	if (!args) return null;
	const path = typeof args.path === "string" ? args.path : typeof args.file_path === "string" ? args.file_path : null;
	if (!path) return null;
	if (Array.isArray(args.edits) && args.edits.length > 0 && args.edits.every((edit) => typeof edit?.oldText === "string" && typeof edit?.newText === "string")) return {
		path,
		edits: args.edits
	};
	if (typeof args.oldText === "string" && typeof args.newText === "string") return {
		path,
		edits: [{
			oldText: args.oldText,
			newText: args.newText
		}]
	};
	return null;
}
function formatEditCall(args, theme) {
	const invalidArg = invalidArgText(theme);
	const rawPath = str(args?.file_path ?? args?.path);
	const path = rawPath !== null ? shortenPath(rawPath) : null;
	const pathDisplay = path === null ? invalidArg : path ? theme.fg("accent", path) : theme.fg("toolOutput", "...");
	return `${theme.fg("toolTitle", theme.bold("edit"))} ${pathDisplay}`;
}
function formatEditResult(preview, result, theme, isError) {
	const previewDiff = preview && !("error" in preview) ? preview.diff : void 0;
	const previewError = preview && "error" in preview ? preview.error : void 0;
	if (isError) {
		const errorText = result.content.filter((c) => c.type === "text").map((c) => c.text || "").join("\n");
		if (!errorText || errorText === previewError) return;
		return theme.fg("error", errorText);
	}
	const resultDiff = result.details?.changed === true ? result.details.diff : void 0;
	if (resultDiff && resultDiff !== previewDiff) return renderDiff(resultDiff);
}
function getEditHeaderBg(preview, settledError, theme) {
	if (preview) {
		if ("error" in preview) return (text) => theme.bg("toolErrorBg", text);
		return (text) => theme.bg("toolSuccessBg", text);
	}
	if (settledError) return (text) => theme.bg("toolErrorBg", text);
	return (text) => theme.bg("toolPendingBg", text);
}
function buildEditCallComponent(component, args, theme) {
	component.setBgFn(getEditHeaderBg(component.preview, component.settledError, theme));
	component.clear();
	component.addChild(new Text(formatEditCall(args, theme), 0, 0));
	if (!component.preview) return component;
	const body = "error" in component.preview ? theme.fg("error", component.preview.error) : renderDiff(component.preview.diff);
	component.addChild(new Spacer(1));
	component.addChild(new Text(body, 0, 0));
	return component;
}
function setEditPreview(component, preview, argsKey) {
	const current = component.preview;
	const changed = current === void 0 || ("error" in current && "error" in preview ? current.error !== preview.error : "error" in current !== "error" in preview) || !("error" in current) && !("error" in preview) && (current.diff !== preview.diff || current.firstChangedLine !== preview.firstChangedLine);
	component.preview = preview;
	component.previewArgsKey = argsKey;
	component.previewPending = false;
	return changed;
}
function createEditToolDefinition(cwd, options) {
	const ops = options?.operations ?? defaultEditOperations;
	const resolvePath = options?.operations ? resolveToCwd : resolveLocalPathToCwd;
	return {
		name: "edit",
		label: "edit",
		description: "Exact single-file replacements. oldText unique/non-overlapping against original. Merge nearby changes; omit large unchanged spans.",
		promptSnippet: "Exact file edits; multiple disjoint edits per call",
		promptGuidelines: [
			"oldText must match exactly",
			"Multiple disjoint locations: one call, multiple edits[]",
			"Match original file; no overlap/nesting; merge nearby",
			"oldText minimal but unique; no padding"
		],
		parameters: editSchema,
		outputSchema: EditToolOutputSchema,
		renderShell: "self",
		prepareArguments: prepareEditArguments,
		async execute(toolCallId, input, signal, onUpdate, ctx) {
			const assertCurrent = captureAgentToolSourceExecutionGuard();
			const { path, edits: originalEdits } = validateEditInput(input);
			const absolutePath = resolvePath(path, cwd);
			return withFileMutationQueueKeyResolution(resolveFileMutationQueueKey(absolutePath, ops.resolveQueueKey, signal), async () => {
				if (signal?.aborted) throw new Error("Operation aborted");
				assertCurrent();
				let realEdits = [];
				let expectedContent;
				try {
					await ops.access(absolutePath);
				} catch (error) {
					const errorMessage = error instanceof Error && "code" in error ? `Error code: ${String(error.code)}` : String(error);
					throw new Error(`Could not edit file: ${path}. ${errorMessage}.`, { cause: error });
				}
				const rawContent = decodeUtf8File(await ops.readFile(absolutePath), absolutePath);
				try {
					if (signal?.aborted) throw new Error("Operation aborted");
					assertCurrent();
					const { bom, text: content } = stripBom(rawContent);
					const normalizedContent = normalizeToLF(content);
					const editSets = splitNoOpEdits(normalizedContent, originalEdits, path);
					const noOpEdits = editSets.noOpEdits;
					realEdits = editSets.realEdits;
					validateNoOpEditTargets(normalizedContent, noOpEdits, realEdits, path);
					if (realEdits.length === 0) return textResult(`No changes made to ${path}. The replacement text is identical to the original.`, { changed: false });
					const { baseContent, newContent, finalContent } = applyEditsPreservingLineEndings(content, realEdits, path);
					expectedContent = bom + finalContent;
					await ops.writeFile(absolutePath, expectedContent);
					if (signal?.aborted) throw new Error("Operation aborted");
					assertCurrent();
					if (!await verifyPersistedUtf8File(absolutePath, expectedContent, ops)) throw new Error(`Edit verification failed for ${path}: the persisted regular file does not match the requested content. Inspect the target and retry.`);
					assertCurrent();
					const diffResult = generateDiffString(baseContent, newContent);
					const patch = generateUnifiedPatch(path, baseContent, newContent);
					return {
						content: [{
							type: "text",
							text: `Successfully replaced ${realEdits.length} block(s) in ${path}.`
						}],
						details: {
							changed: true,
							diff: diffResult.diff,
							patch,
							...diffResult.firstChangedLine === void 0 ? {} : { firstChangedLine: diffResult.firstChangedLine }
						}
					};
				} catch (error) {
					assertCurrent();
					const normalizedError = error instanceof Error ? error : new Error(String(error));
					const currentContent = await ops.readFile(absolutePath).then((current) => current.toString("utf-8")).catch(() => rawContent);
					if (expectedContent !== void 0 && await verifyPersistedUtf8File(absolutePath, expectedContent, ops)) {
						assertCurrent();
						return {
							content: [{
								type: "text",
								text: `Successfully replaced ${realEdits.length} block(s) in ${path}.`
							}],
							details: {
								changed: true,
								diff: "",
								patch: ""
							}
						};
					}
					if (normalizedError.message.includes(EDIT_MISMATCH_MESSAGE)) throw appendMismatchHint(normalizedError, currentContent);
					if (normalizedError instanceof EditNoChangeError) return textResult(`No changes made to ${path}. The replacement produced identical content.`, { changed: false });
					throw normalizedError;
				}
			});
		},
		renderCall(args, theme, context) {
			const component = getEditCallRenderComponent(context.state, context.lastComponent);
			const previewInput = getRenderablePreviewInput(args);
			const argsKey = previewInput ? JSON.stringify({
				path: previewInput.path,
				edits: previewInput.edits
			}) : void 0;
			if (component.previewArgsKey !== argsKey) {
				component.preview = void 0;
				component.previewArgsKey = argsKey;
				component.previewPending = false;
				component.settledError = false;
			}
			if (context.argsComplete && previewInput && !component.preview && !component.previewPending) {
				component.previewPending = true;
				const requestKey = argsKey;
				computeEditsDiff(previewInput.path, previewInput.edits, context.cwd, ops, resolvePath).then((preview) => {
					if (component.previewArgsKey === requestKey) {
						setEditPreview(component, preview, requestKey);
						context.invalidate();
					}
				});
			}
			return buildEditCallComponent(component, args, theme);
		},
		renderResult(result, optionsLocal, theme, context) {
			const callComponent = context.state.callComponent;
			const previewInput = getRenderablePreviewInput(context.args);
			const argsKey = previewInput ? JSON.stringify({
				path: previewInput.path,
				edits: previewInput.edits
			}) : void 0;
			const typedResult = result;
			const resultDiff = !context.isError && typedResult.details?.changed === true ? typedResult.details.diff : void 0;
			let changed = false;
			if (callComponent) {
				if (typeof resultDiff === "string") changed = setEditPreview(callComponent, {
					diff: resultDiff,
					firstChangedLine: typedResult.details?.changed === true ? typedResult.details.firstChangedLine : void 0
				}, argsKey) || changed;
				if (callComponent.settledError !== context.isError) {
					callComponent.settledError = context.isError;
					changed = true;
				}
				if (changed) buildEditCallComponent(callComponent, context.args, theme);
			}
			const output = formatEditResult(callComponent?.preview, typedResult, theme, context.isError);
			const component = context.lastComponent ?? new Container();
			component.clear();
			if (!output) return component;
			component.addChild(new Spacer(1));
			component.addChild(new Text(output, 1, 0));
			return component;
		}
	};
}
function createEditTool(cwd, options) {
	return wrapToolDefinition(createEditToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/sessions/tools/find.ts
/**
* Built-in find session tool.
*
* Searches files by glob through fd/local operations and returns bounded, renderable results.
*/
function isInsideGitRepository(searchPath) {
	for (let current = searchPath;;) {
		if (existsSync(path.join(current, ".git"))) return true;
		const parent = path.dirname(current);
		if (parent === current) return false;
		current = parent;
	}
}
const findSchema = Type.Object({
	pattern: Type.String({ description: "File glob, e.g. **/*.ts." }),
	path: Type.Optional(Type.String({ description: "Search dir; default cwd." })),
	limit: Type.Optional(Type.Integer({ description: "Max results; default 1000." }))
});
const DEFAULT_LIMIT$2 = 1e3;
const defaultFindOperations = {
	exists: existsSync,
	glob: () => []
};
function formatFindCall(args, theme) {
	const pattern = str(args?.pattern);
	const rawPath = str(args?.path);
	const pathLocal = rawPath !== null ? shortenPath(rawPath || ".") : null;
	const limit = args?.limit;
	const invalidArg = invalidArgText(theme);
	let text = theme.fg("toolTitle", theme.bold("find")) + " " + (pattern === null ? invalidArg : theme.fg("accent", pattern || "")) + theme.fg("toolOutput", ` in ${pathLocal === null ? invalidArg : pathLocal}`);
	if (limit !== void 0) text += theme.fg("toolOutput", ` (limit ${limit})`);
	return text;
}
function formatFindResult(result, options, theme, showImages) {
	const resultLimit = result.details?.resultLimitReached;
	return appendSessionToolTruncationWarning(formatSessionToolOutput(result, options, theme, showImages, 20), theme, {
		limit: resultLimit ? {
			count: resultLimit,
			noun: "results"
		} : void 0,
		truncation: result.details?.truncation
	});
}
function buildFindResult(params) {
	const resultLimitReached = params.paths.length > params.effectiveLimit;
	const rawOutput = params.paths.slice(0, params.effectiveLimit).map((foundPath) => {
		const normalized = normalizeNativePathSeparators(foundPath);
		const relativePath = path.isAbsolute(foundPath) ? normalizeNativePathSeparators(path.relative(params.searchPath, foundPath) || ".") : normalized;
		return normalized.endsWith("/") && !relativePath.endsWith("/") ? `${relativePath}/` : relativePath;
	}).join("\n");
	const { content, ...truncation } = truncateHead(rawOutput, { maxLines: Number.MAX_SAFE_INTEGER });
	const details = { content };
	const notices = [];
	if (resultLimitReached) {
		notices.push(params.limitNotice);
		details.resultLimitReached = params.effectiveLimit;
	}
	if (truncation.truncated) {
		notices.push(`${formatSize(DEFAULT_MAX_BYTES)} limit reached`);
		details.truncation = truncation;
	}
	if (notices.length > 0) details.content += `\n\n[${notices.join(". ")}]`;
	return {
		content: [{
			type: "text",
			text: details.content
		}],
		details
	};
}
function createFindToolDefinition(cwd, options) {
	const customOps = options?.operations;
	const resolvePath = customOps ? resolveToCwd : resolveLocalPathToCwd;
	return {
		name: "find",
		label: "find",
		description: `Find by glob; paths relative to search dir. Respects .gitignore. Caps ${DEFAULT_LIMIT$2} results/${DEFAULT_MAX_BYTES / 1024}KB.`,
		promptSnippet: "Find files by glob pattern (respects .gitignore)",
		parameters: findSchema,
		async execute(toolCallId, { pattern, path: searchDir, limit }, signal, onUpdate, ctx) {
			return new Promise((resolve, reject) => {
				if (signal?.aborted) {
					reject(/* @__PURE__ */ new Error("Operation aborted"));
					return;
				}
				let settled = false;
				let stopChild;
				const settle = (fn) => {
					if (settled) return;
					settled = true;
					signal?.removeEventListener("abort", onAbort);
					stopChild = void 0;
					fn();
				};
				const onAbort = () => {
					stopChild?.();
					settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
				};
				signal?.addEventListener("abort", onAbort, { once: true });
				(async () => {
					try {
						if (Number.isFinite(limit) && !Number.isInteger(limit)) {
							settle(() => reject(/* @__PURE__ */ new Error("Limit must be an integer")));
							return;
						}
						const searchPath = resolvePath(searchDir || ".", cwd);
						const effectiveLimit = normalizePositiveLimit(limit, DEFAULT_LIMIT$2);
						const observationLimit = effectiveLimit + 1;
						const ops = customOps ?? defaultFindOperations;
						if (customOps?.glob) {
							if (!await ops.exists(searchPath)) {
								settle(() => reject(/* @__PURE__ */ new Error(`Path not found: ${searchPath}`)));
								return;
							}
							if (signal?.aborted) {
								settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
								return;
							}
							const results = await ops.glob(pattern, searchPath, {
								ignore: ["**/node_modules/**", "**/.git/**"],
								limit: observationLimit
							});
							if (signal?.aborted) {
								settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
								return;
							}
							if (results.length === 0) {
								settle(() => resolve({
									content: [{
										type: "text",
										text: "No files found matching pattern"
									}],
									details: { content: "No files found matching pattern" }
								}));
								return;
							}
							settle(() => resolve(buildFindResult({
								paths: results,
								searchPath,
								effectiveLimit,
								limitNotice: `${effectiveLimit} results limit reached`
							})));
							return;
						}
						const fdPath = await ensureTool("fd", true);
						if (signal?.aborted) {
							settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
							return;
						}
						if (!fdPath) {
							settle(() => reject(/* @__PURE__ */ new Error("fd is not available and could not be downloaded")));
							return;
						}
						const args = [
							"--glob",
							"--color=never",
							"--hidden"
						];
						if (!isInsideGitRepository(searchPath)) args.push("--no-require-git");
						args.push("--max-results", String(observationLimit));
						let effectivePattern = pattern;
						if (pattern.includes("/")) {
							args.push("--full-path");
							if (!pattern.startsWith("/") && !pattern.startsWith("**/") && pattern !== "**") effectivePattern = `**/${pattern}`;
						}
						args.push("--", effectivePattern, searchPath);
						const child = spawnCommand([fdPath, ...args], {
							buffer: false,
							reject: false,
							stdio: [
								"ignore",
								"pipe",
								"pipe"
							]
						});
						const stop = () => {
							if (!child.nodeChildProcess.killed) child.kill();
						};
						stopChild = stop;
						if (child.pid === void 0) await waitForCommandSpawn(child);
						if (settled) {
							stop();
							return;
						}
						releaseChildProcessOutputAfterExit(child.nodeChildProcess);
						if (!child.stdout) {
							const result = await child;
							throw result instanceof Error ? result : /* @__PURE__ */ new Error("fd stdout is unavailable");
						}
						const rl = createInterface({ input: child.stdout });
						let stderr = "";
						let stderrDroppedBytes = 0;
						const lines = [];
						const cleanup = () => {
							rl.close();
						};
						const onStreamError = (stream, error) => {
							if (settled) return;
							stopChild?.();
							cleanup();
							settle(() => reject(/* @__PURE__ */ new Error(`fd ${stream} error: ${error.message}`)));
						};
						child.stderr?.setEncoding("utf8");
						child.stderr?.on("data", (chunk) => {
							const appended = appendBoundedTextTail(stderr, chunk);
							stderr = appended.tail;
							stderrDroppedBytes += appended.droppedBytes;
						});
						rl.on("error", (error) => onStreamError("stdout", error));
						child.stdout?.on("error", (error) => onStreamError("stdout", error));
						child.stderr?.on("error", (error) => onStreamError("stderr", error));
						rl.on("line", (line) => {
							lines.push(line);
						});
						child.nodeChildProcess.on("error", (error) => {
							cleanup();
							settle(() => reject(/* @__PURE__ */ new Error(`Failed to run fd: ${error.message}`)));
						});
						child.nodeChildProcess.on("close", (code) => {
							cleanup();
							if (signal?.aborted) {
								settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
								return;
							}
							const output = lines.join("\n");
							if (code !== 0) {
								const fallback = `fd exited with code ${code}`;
								const errorMsg = formatStderrTail(stderr, stderrDroppedBytes, fallback);
								settle(() => reject(new Error(errorMsg)));
								return;
							}
							if (!output) {
								settle(() => resolve({
									content: [{
										type: "text",
										text: "No files found matching pattern"
									}],
									details: { content: "No files found matching pattern" }
								}));
								return;
							}
							settle(() => resolve(buildFindResult({
								paths: lines,
								searchPath,
								effectiveLimit,
								limitNotice: `${effectiveLimit} results limit reached. Use limit=${effectiveLimit * 2} for more, or refine pattern`
							})));
						});
					} catch (e) {
						if (signal?.aborted) {
							settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")));
							return;
						}
						const error = e instanceof Error ? e : new Error(String(e));
						settle(() => reject(error));
					}
				})();
			});
		},
		renderCall(args, theme, context) {
			return reuseTextComponent(context.lastComponent, formatFindCall(args, theme));
		},
		renderResult(result, optionsLocal, theme, context) {
			const content = formatFindResult(result, optionsLocal, theme, context.showImages);
			return reuseTextComponent(context.lastComponent, content);
		}
	};
}
function createFindTool(cwd, options) {
	return wrapToolDefinition(createFindToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/sessions/tools/grep.ts
/**
* Built-in grep session tool.
*
* Searches files with ripgrep/local operations, optional context, and bounded output rendering.
*/
const grepSchema = Type.Object({
	pattern: Type.String({ description: "Regex/literal pattern." }),
	path: Type.Optional(Type.String({ description: "File/dir; default cwd." })),
	glob: Type.Optional(Type.String({ description: "File glob, e.g. *.ts." })),
	ignoreCase: Type.Optional(Type.Boolean({ description: "Ignore case; default false." })),
	literal: Type.Optional(Type.Boolean({ description: "Literal, not regex; default false." })),
	context: Type.Optional(Type.Number({ description: "Context lines each side; default 0." })),
	limit: Type.Optional(Type.Number({ description: "Max matches; default 100." }))
});
const DEFAULT_LIMIT$1 = 100;
const GREP_JSON_RECORD_MAX_BYTES = 1048576;
const GREP_JSON_CARRIAGE_RETURN = Buffer.from([13]);
const GREP_JSON_RECORD_OVERSIZED_ERROR = "grep stopped because ripgrep emitted a JSON record larger than 1 MiB; narrow the path or pattern, exclude generated/minified files, or inspect the file with a bounded read";
function decodeRipgrepJsonText(value) {
	return value?.text ?? (value?.bytes === void 0 ? void 0 : Buffer.from(value.bytes, "base64").toString("utf8"));
}
function formatGrepCall(args, theme) {
	const pattern = str(args?.pattern);
	const rawPath = str(args?.path);
	const pathLocal = rawPath !== null ? shortenPath(rawPath || ".") : null;
	const glob = str(args?.glob);
	const limit = args?.limit;
	const invalidArg = invalidArgText(theme);
	let text = theme.fg("toolTitle", theme.bold("grep")) + " " + (pattern === null ? invalidArg : theme.fg("accent", `/${pattern || ""}/`)) + theme.fg("toolOutput", ` in ${pathLocal === null ? invalidArg : pathLocal}`);
	if (glob) text += theme.fg("toolOutput", ` (${glob})`);
	if (limit !== void 0) text += theme.fg("toolOutput", ` limit ${limit}`);
	return text;
}
function formatGrepResult(result, options, theme, showImages) {
	const matchLimit = result.details?.matchLimitReached;
	const linesTruncated = result.details?.linesTruncated;
	return appendSessionToolTruncationWarning(formatSessionToolOutput(result, options, theme, showImages, 15), theme, {
		limit: matchLimit ? {
			count: matchLimit,
			noun: "matches"
		} : void 0,
		truncation: result.details?.truncation,
		additionalWarnings: linesTruncated ? ["some lines truncated"] : void 0
	});
}
function createGrepToolDefinition(cwd, options) {
	const customOps = options?.operations;
	const resolvePath = customOps ? resolveToCwd : resolveLocalPathToCwd;
	return {
		name: "grep",
		label: "grep",
		description: `Search contents; returns path:line matches. Respects .gitignore. Caps ${DEFAULT_LIMIT$1} matches/${DEFAULT_MAX_BYTES / 1024}KB; lines cap 500 chars.`,
		promptSnippet: "Search file contents for patterns (respects .gitignore)",
		parameters: grepSchema,
		async execute(toolCallId, { pattern, path: searchDir, glob, ignoreCase, literal, context, limit }, signal, onUpdate, ctx) {
			return new Promise((resolve, reject) => {
				let settled = false;
				let child;
				let childClosed = false;
				let killedDueToLimit = false;
				const cleanup = () => {
					signal?.removeEventListener("abort", onAbort);
				};
				const settle = (fn) => {
					if (settled) return false;
					settled = true;
					cleanup();
					fn();
					return true;
				};
				const stopChild = (dueToLimit = false) => {
					if (child && !childClosed && !child.nodeChildProcess.killed) {
						killedDueToLimit = dueToLimit;
						child.kill();
					}
				};
				const onAbort = () => {
					if (settle(() => reject(/* @__PURE__ */ new Error("Operation aborted")))) stopChild();
				};
				signal?.addEventListener("abort", onAbort, { once: true });
				if (signal?.aborted) {
					onAbort();
					return;
				}
				(async () => {
					try {
						const rgPath = await ensureTool("rg", true);
						if (settled) return;
						if (!rgPath) {
							settle(() => reject(/* @__PURE__ */ new Error("ripgrep (rg) is not available and could not be downloaded")));
							return;
						}
						const searchPath = resolvePath(searchDir || ".", cwd);
						let isDirectory;
						try {
							isDirectory = await (customOps?.isDirectory(searchPath) ?? statSync(searchPath).isDirectory());
						} catch {
							settle(() => reject(/* @__PURE__ */ new Error(`Path not found: ${searchPath}`)));
							return;
						}
						if (settled) return;
						const contextValue = resolveNonNegativeIntegerOption(context, 0);
						const effectiveLimit = normalizePositiveLimit(limit, DEFAULT_LIMIT$1);
						const formatPath = (filePath) => {
							const relative = isDirectory ? path.relative(searchPath, filePath) : "";
							return relative && relative !== ".." && !relative.startsWith(`..${path.sep}`) ? normalizeNativePathSeparators(relative) : path.basename(filePath);
						};
						const args = [
							"--json",
							"--line-number",
							"--color=never",
							"--hidden"
						];
						if (!customOps && contextValue > 0) args.push("--context", String(contextValue));
						if (ignoreCase) args.push("--ignore-case");
						if (literal) args.push("--fixed-strings");
						if (glob) args.push("--glob", glob);
						args.push("--", pattern, searchPath);
						if (settled) return;
						const spawnedChild = spawnCommand([rgPath, ...args], {
							buffer: false,
							reject: false,
							stdio: [
								"ignore",
								"pipe",
								"pipe"
							]
						});
						child = spawnedChild;
						if (spawnedChild.pid === void 0) await waitForCommandSpawn(spawnedChild);
						if (settled) {
							stopChild();
							return;
						}
						releaseChildProcessOutputAfterExit(spawnedChild.nodeChildProcess);
						let stderr = "";
						let stderrDroppedBytes = 0;
						let matchCount = 0;
						let matchLimitReached = false;
						let linesTruncated = false;
						const outputLines = [];
						let recordParts = [];
						let recordBytes = 0;
						let pendingCarriageReturn = false;
						spawnedChild.stderr?.setEncoding("utf8");
						spawnedChild.stderr?.on("data", (chunk) => {
							const appended = appendBoundedTextTail(stderr, chunk);
							stderr = appended.tail;
							stderrDroppedBytes += appended.droppedBytes;
						});
						const onStreamError = (stream, error) => {
							if (settled) return;
							if (settle(() => reject(/* @__PURE__ */ new Error(`ripgrep ${stream} error: ${error.message}`)))) stopChild();
						};
						spawnedChild.stdout?.on("error", (error) => onStreamError("stdout", error));
						spawnedChild.stderr?.on("error", (error) => onStreamError("stderr", error));
						const matches = [];
						const nativeFiles = /* @__PURE__ */ new Map();
						const handleJsonRecord = (line) => {
							if (!line.trim() || settled || killedDueToLimit) return;
							let event;
							try {
								event = JSON.parse(line);
							} catch {
								return;
							}
							const filePath = decodeRipgrepJsonText(event.data?.path);
							const pathIdentity = JSON.stringify(event.data?.path);
							const lineNumber = event.data?.line_number;
							const lineText = event.data?.lines?.text;
							if (event.type === "match") {
								matchCount++;
								matchLimitReached = matchCount > effectiveLimit;
								if (!matchLimitReached && filePath && pathIdentity && typeof lineNumber === "number") matches.push({
									filePath,
									pathIdentity,
									lineNumber,
									lineText
								});
							}
							const lastMatch = matches.at(-1);
							const windowEnd = (lastMatch?.lineNumber ?? 0) + contextValue;
							const inLastWindow = pathIdentity === lastMatch?.pathIdentity && typeof lineNumber === "number" && lineNumber <= windowEnd;
							if (pathIdentity && typeof lineNumber === "number" && (matchCount < effectiveLimit || inLastWindow)) {
								const text = lineText ?? (!customOps ? decodeRipgrepJsonText(event.data?.lines) : void 0);
								if (text !== void 0) {
									const lines = nativeFiles.get(pathIdentity) ?? /* @__PURE__ */ new Map();
									lines.set(lineNumber, text);
									nativeFiles.set(pathIdentity, lines);
								}
							}
							if (matchLimitReached && (customOps || !inLastWindow || lineNumber === windowEnd)) stopChild(true);
						};
						const appendRecordPart = (part) => {
							if (part.length === 0) return true;
							const nextBytes = recordBytes + part.length;
							if (nextBytes > GREP_JSON_RECORD_MAX_BYTES) {
								recordParts = [];
								recordBytes = 0;
								if (settle(() => reject(/* @__PURE__ */ new Error(GREP_JSON_RECORD_OVERSIZED_ERROR)))) stopChild();
								return false;
							}
							recordParts.push(part);
							recordBytes = nextBytes;
							return true;
						};
						const emitRecord = () => {
							const line = Buffer.concat(recordParts, recordBytes).toString("utf8");
							recordParts = [];
							recordBytes = 0;
							handleJsonRecord(line);
						};
						spawnedChild.stdout?.on("data", (chunk) => {
							if (settled || killedDueToLimit) return;
							let offset = 0;
							if (pendingCarriageReturn) {
								pendingCarriageReturn = false;
								if (chunk[0] === 10) {
									emitRecord();
									if (settled || killedDueToLimit) return;
									offset = 1;
								} else if (!appendRecordPart(GREP_JSON_CARRIAGE_RETURN)) return;
							}
							for (let index = offset; index < chunk.length; index += 1) {
								if (chunk[index] !== 10) continue;
								let recordEnd = index;
								if (index > offset && chunk[index - 1] === 13) recordEnd -= 1;
								if (!appendRecordPart(chunk.subarray(offset, recordEnd))) return;
								emitRecord();
								if (settled || killedDueToLimit) return;
								offset = index + 1;
							}
							const tail = chunk.subarray(offset);
							if (tail.at(-1) === 13) {
								if (!appendRecordPart(tail.subarray(0, -1))) return;
								pendingCarriageReturn = true;
								return;
							}
							appendRecordPart(tail);
						});
						spawnedChild.nodeChildProcess.on("error", (error) => {
							childClosed = true;
							settle(() => reject(/* @__PURE__ */ new Error(`Failed to run ripgrep: ${error.message}`)));
						});
						spawnedChild.nodeChildProcess.on("close", (code) => {
							childClosed = true;
							pendingCarriageReturn = false;
							if (recordBytes > 0 && !settled && !killedDueToLimit) emitRecord();
							(async () => {
								if (settled) return;
								if (!killedDueToLimit && code !== 0 && code !== 1) {
									const fallback = `ripgrep exited with code ${code}`;
									const errorMsg = formatStderrTail(stderr, stderrDroppedBytes, fallback);
									settle(() => reject(new Error(errorMsg)));
									return;
								}
								if (matchCount === 0) {
									settle(() => resolve({
										content: [{
											type: "text",
											text: "No matches found"
										}],
										details: { content: "No matches found" }
									}));
									return;
								}
								const fileCache = /* @__PURE__ */ new Map();
								for (const { filePath, pathIdentity, lineNumber, lineText: matchText } of matches) {
									const relativePath = formatPath(filePath);
									let customLines;
									if (customOps && (contextValue > 0 || matchText === void 0)) {
										customLines = fileCache.get(filePath);
										if (!customLines) {
											try {
												customLines = (await customOps.readFile(filePath)).replace(/\r\n?/g, "\n").split("\n");
											} catch {
												customLines = [];
											}
											fileCache.set(filePath, customLines);
										}
										if (settled) return;
										if (!customLines.length) {
											outputLines.push(`${relativePath}:${lineNumber}: (unable to read file)`);
											continue;
										}
									}
									const nativeLines = nativeFiles.get(pathIdentity);
									for (let current = Math.max(1, lineNumber - contextValue); current <= lineNumber + contextValue; current++) {
										const lineText = customLines ? customLines[current - 1] : nativeLines?.get(current);
										if (lineText === void 0) break;
										const { text, wasTruncated } = truncateLine(lineText.replace(/\r/g, "").replace(/\n$/, ""));
										linesTruncated ||= wasTruncated;
										const separator = current === lineNumber ? ":" : "-";
										outputLines.push(`${relativePath}${separator}${current}${separator} ${text}`);
									}
								}
								const rawOutput = outputLines.join("\n");
								const { content, ...truncation } = truncateHead(rawOutput, { maxLines: Number.MAX_SAFE_INTEGER });
								const details = { content };
								const notices = [];
								if (matchLimitReached) {
									notices.push(`${effectiveLimit} matches limit reached. Use limit=${effectiveLimit * 2} for more, or refine pattern`);
									details.matchLimitReached = effectiveLimit;
								}
								if (truncation.truncated) {
									notices.push(`${formatSize(DEFAULT_MAX_BYTES)} limit reached`);
									details.truncation = truncation;
								}
								if (linesTruncated) {
									notices.push(`Some lines truncated to 500 chars`);
									details.linesTruncated = true;
								}
								if (notices.length > 0) details.content += `\n\n[${notices.join(". ")}]`;
								settle(() => resolve({
									content: [{
										type: "text",
										text: details.content
									}],
									details
								}));
							})().catch((err) => {
								settle(() => reject(err));
							});
						});
					} catch (err) {
						if (settle(() => reject(err))) stopChild();
					}
				})();
			});
		},
		renderCall(args, theme, context) {
			return reuseTextComponent(context.lastComponent, formatGrepCall(args, theme));
		},
		renderResult(result, optionsLocal, theme, context) {
			const content = formatGrepResult(result, optionsLocal, theme, context.showImages);
			return reuseTextComponent(context.lastComponent, content);
		}
	};
}
function createGrepTool(cwd, options) {
	return wrapToolDefinition(createGrepToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/sessions/tools/ls.ts
/**
* Built-in ls session tool.
*
* Lists directory entries through local or injected operations with bounded output rendering.
*/
const lsSchema = Type.Object({
	path: Type.Optional(Type.String({ description: "Directory; default cwd." })),
	limit: Type.Optional(Type.Number({ description: "Max entries; default 500." })),
	after: Type.Optional(Type.String({ description: "Filename cursor returned by the previous page." }))
});
const DEFAULT_LIMIT = 500;
const defaultLsOperations = { readDirectory: async (absolutePath) => (await readdir(absolutePath, { withFileTypes: true })).map((entry) => ({
	name: entry.name,
	isDirectory: entry.isDirectory()
})) };
function formatLsCall(args, theme) {
	const rawPath = str(args?.path);
	const path = rawPath !== null ? shortenPath(rawPath || ".") : null;
	const limit = args?.limit;
	const invalidArg = invalidArgText(theme);
	let text = `${theme.fg("toolTitle", theme.bold("ls"))} ${path === null ? invalidArg : theme.fg("accent", path)}`;
	if (limit !== void 0) text += theme.fg("toolOutput", ` (limit ${limit})`);
	if (args?.after !== void 0) text += theme.fg("toolOutput", ` (after ${JSON.stringify(args.after)})`);
	return text;
}
function formatLsContinuation(after) {
	return `\n\n[More entries. Continue with the same path and after=${JSON.stringify(after)}.]`;
}
function createLsToolDefinition(cwd, options) {
	const ops = options?.operations ?? defaultLsOperations;
	const resolvePath = options?.operations ? resolveToCwd : resolveLocalPathToCwd;
	return {
		name: "ls",
		label: "ls",
		description: "List directory entries in binary filename order, including dotfiles and links. Names are JSON-quoted; / marks actual directories. Pass the returned after cursor with the same path to continue.",
		promptSnippet: "List directory contents",
		parameters: lsSchema,
		async execute(toolCallId, { path, limit, after }, signal, onUpdate, ctx) {
			if (signal?.aborted) throw new Error("Operation aborted");
			const runListing = async () => {
				try {
					const dirPath = resolvePath(path || ".", cwd);
					const effectiveLimit = normalizePositiveLimit(limit, DEFAULT_LIMIT);
					const directoryEntries = await ops.readDirectory(dirPath, signal);
					if (signal?.aborted) throw new Error("Operation aborted");
					const entries = directoryEntries.filter((entry) => after === void 0 || entry.name > after).toSorted((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
					if (entries.length === 0) return {
						content: [{
							type: "text",
							text: "(empty directory)"
						}],
						details: { content: "(empty directory)" }
					};
					const fitsPage = (text) => Buffer.byteLength(text) <= 51200 && toolResultFitsBudget(text, options?.modelBudget);
					const lines = [];
					let content = "";
					for (const entry of entries) {
						if (lines.length >= effectiveLimit) break;
						const line = JSON.stringify(entry.name + (entry.isDirectory ? "/" : ""));
						const candidate = content ? `${content}\n${line}` : line;
						if (!fitsPage(candidate)) break;
						lines.push(line);
						content = candidate;
					}
					while (lines.length > 0) {
						const nextAfter = lines.length < entries.length ? entries[lines.length - 1].name : void 0;
						const output = content + (nextAfter === void 0 ? "" : formatLsContinuation(nextAfter));
						if (fitsPage(output)) return {
							content: [{
								type: "text",
								text: output
							}],
							details: {
								content: output,
								...nextAfter === void 0 ? {} : { nextAfter }
							}
						};
						lines.pop();
						content = lines.join("\n");
					}
					throw new Error("A directory entry cannot fit within the listing output budget.");
				} catch (e) {
					throw toErrorObject(e, "Non-Error rejection");
				}
			};
			if (!signal) return await runListing();
			let onAbort;
			const abortPromise = new Promise((_resolve, reject) => {
				onAbort = () => reject(/* @__PURE__ */ new Error("Operation aborted"));
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
			});
			try {
				return await Promise.race([runListing(), abortPromise]);
			} finally {
				if (onAbort) signal.removeEventListener("abort", onAbort);
			}
		},
		renderCall(args, theme, context) {
			return reuseTextComponent(context.lastComponent, formatLsCall(args, theme));
		},
		renderResult(result, optionsLocal, theme, context) {
			const content = formatSessionToolOutput(result, optionsLocal, theme, context.showImages, 20);
			return reuseTextComponent(context.lastComponent, content);
		}
	};
}
function createLsTool(cwd, options) {
	return wrapToolDefinition(createLsToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/utils/image-resize.ts
const INLINE_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp"
]);
function baseMimeType(mimeType) {
	const normalized = mimeType?.split(";")[0]?.trim().toLowerCase();
	return normalized === "image/jpg" ? "image/jpeg" : normalized ?? "";
}
async function normalizeImageForProvider(image) {
	const mimeType = baseMimeType(image.mimeType);
	if (INLINE_IMAGE_MIME_TYPES.has(mimeType)) return { image: {
		...image,
		mimeType
	} };
	try {
		return {
			image: {
				data: await convertImageToPng(image.data),
				mimeType: "image/png"
			},
			convertedFrom: mimeType || image.mimeType
		};
	} catch {
		return null;
	}
}
/** Normalize image formats for model input, then enforce inline size limits when enabled. */
async function processImage(image, options) {
	const normalized = await normalizeImageForProvider(image);
	if (!normalized) return {
		ok: false,
		message: "[Image omitted: could not be converted to a supported inline image format.]"
	};
	const hints = [];
	if (normalized.convertedFrom) hints.push(`[Image converted from ${normalized.convertedFrom} to image/png.]`);
	let prepared = normalized.image;
	if (options.autoResizeImages) {
		const resized = await resizeImage(prepared);
		if (!resized) return {
			ok: false,
			message: "[Image omitted: could not be resized below the inline image size limit.]"
		};
		const dimensionNote = formatDimensionNote(resized);
		if (dimensionNote) hints.push(dimensionNote);
		prepared = resized;
	}
	return {
		ok: true,
		image: {
			type: "image",
			data: prepared.data.toString("base64"),
			mimeType: prepared.mimeType
		},
		hints
	};
}
const MAX_IMAGE_WIDTH = 2e3;
const MAX_IMAGE_HEIGHT = 2e3;
const MAX_IMAGE_BASE64_BYTES = 4718592;
const JPEG_QUALITY = 80;
function orientedDimensions(probe) {
	return probe.orientation && probe.orientation >= 5 && probe.orientation <= 8 ? {
		width: probe.height,
		height: probe.width
	} : {
		width: probe.width,
		height: probe.height
	};
}
/**
* Resize an image to fit within the inline dimensions and base64 payload limit.
* Returns null if Rastermill cannot produce output within those limits.
*
* Uses Rastermill for image processing. If no Rastermill backend is available,
* returns null.
*
* Strategy for staying under the inline limits:
* 1. First resize to the maximum dimensions
* 2. Let Rastermill choose JPEG or PNG for the image transparency profile
* 3. If still too large, search decreasing quality/compression settings
* 4. If still too large, progressively reduce dimensions
*/
async function resizeImage(img) {
	const inputBuffer = img.data;
	const inputBase64Size = 4 * Math.ceil(inputBuffer.byteLength / 3);
	const processor = createImageProcessor();
	try {
		const probe = await processor.probe(inputBuffer);
		if (!probe) return null;
		const { width: originalWidth, height: originalHeight } = orientedDimensions(probe);
		if (originalWidth <= MAX_IMAGE_WIDTH && originalHeight <= MAX_IMAGE_HEIGHT && inputBase64Size <= MAX_IMAGE_BASE64_BYTES) return {
			data: img.data,
			mimeType: img.mimeType,
			originalWidth,
			originalHeight,
			width: originalWidth,
			height: originalHeight,
			wasResized: false
		};
		const qualitySteps = [
			JPEG_QUALITY,
			85,
			70,
			55,
			40,
			35
		];
		const output = await processor.encode(inputBuffer, {
			format: "auto",
			limits: {
				maxWidth: MAX_IMAGE_WIDTH,
				maxHeight: MAX_IMAGE_HEIGHT
			},
			maxBase64Bytes: MAX_IMAGE_BASE64_BYTES,
			opaque: {
				format: "jpeg",
				quality: JPEG_QUALITY
			},
			transparent: { format: "png" },
			search: {
				quality: qualitySteps,
				compressionLevel: [6, 9]
			}
		});
		if (output.withinBudget !== true) return null;
		return {
			data: output.data,
			mimeType: output.mimeType,
			originalWidth,
			originalHeight,
			width: output.width,
			height: output.height,
			wasResized: output.resized
		};
	} catch {
		return null;
	}
}
/**
* Format a dimension note for resized images.
* This helps the model understand the coordinate mapping.
*/
function formatDimensionNote(result) {
	if (!result.wasResized) return;
	const scale = result.originalWidth / result.width;
	return `[Image: original ${result.originalWidth}x${result.originalHeight}, displayed at ${result.width}x${result.height}. Multiply coordinates by ${scale.toFixed(2)} to map to original image.]`;
}
//#endregion
//#region src/agents/utils/mime.ts
/**
* Lightweight MIME sniffing helpers for agent image inputs.
*
* The checks here avoid trusting file extensions and reject unsupported image
* variants before provider upload paths try to process them.
*/
const PNG_SIGNATURE = [
	137,
	80,
	78,
	71,
	13,
	10,
	26,
	10
];
/** Detects supported image MIME types from leading file bytes. */
function detectSupportedImageMimeType(buffer) {
	if (startsWith(buffer, [
		255,
		216,
		255
	])) return buffer[3] === 247 ? null : "image/jpeg";
	if (startsWith(buffer, PNG_SIGNATURE)) return isPng(buffer) && !isAnimatedPng(buffer) ? "image/png" : null;
	if (startsWithAscii(buffer, 0, "GIF")) return "image/gif";
	if (startsWithAscii(buffer, 0, "RIFF") && startsWithAscii(buffer, 8, "WEBP")) return "image/webp";
	if (startsWithAscii(buffer, 0, "BM") && isBmp(buffer)) return "image/bmp";
	return null;
}
function isPng(buffer) {
	return buffer.length >= 16 && readUint32BE(buffer, PNG_SIGNATURE.length) === 13 && startsWithAscii(buffer, 12, "IHDR");
}
function isAnimatedPng(buffer) {
	let offset = PNG_SIGNATURE.length;
	while (offset + 8 <= buffer.length) {
		const chunkLength = readUint32BE(buffer, offset);
		const chunkTypeOffset = offset + 4;
		if (startsWithAscii(buffer, chunkTypeOffset, "acTL")) return true;
		if (startsWithAscii(buffer, chunkTypeOffset, "IDAT")) return false;
		const nextOffset = offset + 8 + chunkLength + 4;
		if (nextOffset <= offset || nextOffset > buffer.length) return false;
		offset = nextOffset;
	}
	return false;
}
function isBmp(buffer) {
	if (buffer.length < 26) return false;
	const declaredFileSize = readUint32LE(buffer, 2);
	const pixelDataOffset = readUint32LE(buffer, 10);
	const dibHeaderSize = readUint32LE(buffer, 14);
	if (declaredFileSize !== 0 && declaredFileSize < 26) return false;
	if (pixelDataOffset < 14 + dibHeaderSize) return false;
	if (declaredFileSize !== 0 && pixelDataOffset >= declaredFileSize) return false;
	let colorPlanes;
	let bitsPerPixel;
	if (dibHeaderSize === 12) {
		colorPlanes = readUint16LE(buffer, 22);
		bitsPerPixel = readUint16LE(buffer, 24);
	} else if (dibHeaderSize >= 40 && dibHeaderSize <= 124) {
		if (buffer.length < 30) return false;
		colorPlanes = readUint16LE(buffer, 26);
		bitsPerPixel = readUint16LE(buffer, 28);
	} else return false;
	return colorPlanes === 1 && [
		1,
		4,
		8,
		16,
		24,
		32
	].includes(bitsPerPixel);
}
function readUint16LE(buffer, offset) {
	return (buffer[offset] ?? 0) + ((buffer[offset + 1] ?? 0) << 8);
}
function readUint32BE(buffer, offset) {
	return (buffer[offset] ?? 0) * 16777216 + ((buffer[offset + 1] ?? 0) << 16) + ((buffer[offset + 2] ?? 0) << 8) + (buffer[offset + 3] ?? 0);
}
function readUint32LE(buffer, offset) {
	return (buffer[offset] ?? 0) + ((buffer[offset + 1] ?? 0) << 8) + ((buffer[offset + 2] ?? 0) << 16) + (buffer[offset + 3] ?? 0) * 16777216;
}
function startsWith(buffer, bytes) {
	if (buffer.length < bytes.length) return false;
	return bytes.every((byte, index) => buffer[index] === byte);
}
function startsWithAscii(buffer, offset, text) {
	if (buffer.length < offset + text.length) return false;
	for (let index = 0; index < text.length; index++) if (buffer[offset + index] !== text.charCodeAt(index)) return false;
	return true;
}
//#endregion
//#region src/agents/sessions/tools/read-page.ts
/** Format model-visible pagination guidance from its exact structured continuation. */
function formatReadContinuationNotice(continuation, maxBytes, range) {
	const cursor = continuation.kind === "cursor" ? `, cursor=${continuation.cursor}` : "";
	const limit = continuation.limit === void 0 ? "" : `, limit=${continuation.limit}`;
	if (!range) return `\n\n[Read output capped at ${formatSize(maxBytes).replace(/\.0(?=KB)/, "")} for this call. Use offset=${continuation.offset}${cursor}${limit} to continue.]`;
	const label = continuation.kind === "cursor" ? `part of line ${range.startLine}` : `lines ${range.startLine}-${continuation.offset - 1} of ${range.totalLines}`;
	const action = continuation.kind === "cursor" ? "Use read with" : "Use";
	return `\n\n[Showing ${label} (${formatSize(maxBytes)} limit). ${action} offset=${continuation.offset}${cursor}${limit} to continue.]`;
}
/** Bound a selected text page once; legacy injected readers reuse this owner decision. */
function createBoundedReadTextPage(params) {
	const maxBytes = params.pageMaxBytes ?? Math.min(51200, params.maxBytes);
	const remainingLines = params.totalLines - params.endLine;
	const limitNotice = params.continuation ? formatReadContinuationNotice(params.continuation, params.maxBytes) : params.limit !== void 0 && remainingLines > 0 ? `\n\n[${remainingLines} more line${remainingLines === 1 ? "" : "s"} in file. Use offset=${params.endLine + 1} to continue.]` : "";
	const contentBytes = Buffer.byteLength(params.content, "utf8");
	const resultPrefix = params.prefix ?? "";
	const completeSelectedPage = (content) => ({
		text: `${content}${limitNotice}`,
		details: limitNotice ? {
			kind: "truncated",
			content,
			continuation: params.continuation ?? {
				kind: "line",
				offset: params.endLine + 1,
				limit: params.limit
			},
			truncation: {
				truncated: true,
				truncatedBy: params.continuation?.kind === "cursor" ? "bytes" : "lines",
				totalLines: params.totalLines,
				totalBytes: contentBytes,
				outputLines: params.continuation?.kind === "cursor" ? params.continuation.offset - params.startLine : params.endLine - params.startLine + 1,
				outputBytes: Buffer.byteLength(content, "utf8"),
				lastLinePartial: params.continuation?.kind === "cursor",
				firstLineExceedsLimit: false,
				maxLines: params.limit ?? 2e3,
				maxBytes
			}
		} : {
			kind: "text",
			content
		}
	});
	if (params.endLine - params.startLine < 2e3 && contentBytes + Buffer.byteLength(limitNotice, "utf8") <= maxBytes && toolResultFitsBudget(`${resultPrefix}${params.content}${limitNotice}`, params.modelBudget)) return completeSelectedPage(params.content);
	const range = params.adaptive ? void 0 : {
		startLine: params.startLine,
		totalLines: params.totalLines
	};
	const boundedLimit = params.limit === void 0 ? {} : { limit: params.limit };
	const firstLine = params.content.split("\n", 1)[0] ?? "";
	const cursorEstimate = {
		kind: "cursor",
		offset: params.startLine,
		cursor: (params.cursor ?? 0) + firstLine.length,
		...boundedLimit
	};
	const lineEstimate = {
		kind: "line",
		offset: params.totalLines + 1,
		...boundedLimit
	};
	const reservedBytes = Math.max(Buffer.byteLength(formatReadContinuationNotice(cursorEstimate, params.maxBytes, range), "utf8"), Buffer.byteLength(formatReadContinuationNotice(lineEstimate, params.maxBytes, range), "utf8"));
	let prefix = truncateUtf8Prefix(params.content, Math.max(0, maxBytes - reservedBytes));
	if (params.modelBudget) {
		prefix = sliceToolResultTextToBudget(prefix, params.modelBudget.maxChars - reservedBytes - estimateStringCharsWithMinimumRawWeight(resultPrefix));
		prefix = sliceToolResultTextToBudget(prefix, params.modelBudget.maxContextChars - reservedBytes * 2 - estimateStringCharsWithMinimumRawWeight(resultPrefix, { minimumRawWeight: 2 }), { minimumRawWeight: 2 });
	}
	const contentBudgetBytes = Buffer.byteLength(prefix, "utf8");
	const truncation = truncateHead(params.content, { maxBytes: contentBudgetBytes });
	if (!truncation.truncated) return completeSelectedPage(truncation.content);
	let continuation;
	let content = truncation.content;
	if (truncation.firstLineExceedsLimit) {
		content = truncateUtf8Prefix(firstLine, contentBudgetBytes);
		continuation = {
			kind: "cursor",
			offset: params.startLine,
			cursor: (params.cursor ?? 0) + content.length,
			...boundedLimit
		};
	} else {
		const nextOffset = params.startLine + truncation.outputLines;
		continuation = {
			kind: "line",
			offset: nextOffset,
			...params.limit === void 0 ? {} : { limit: Math.max(1, params.endLine - nextOffset + 1) }
		};
	}
	const { content: _content, ...truncationDetails } = truncation;
	return {
		text: `${content}${formatReadContinuationNotice(continuation, params.maxBytes, range)}`,
		details: {
			kind: "truncated",
			content,
			truncation: {
				...truncationDetails,
				outputBytes: Buffer.byteLength(content, "utf8"),
				firstLineExceedsLimit: false,
				lastLinePartial: continuation.kind === "cursor",
				totalLines: params.totalLines
			},
			continuation
		}
	};
}
//#endregion
//#region src/agents/sessions/tools/read-tool-contract.ts
const readToolInputSchema = Type.Object({
	path: Type.String({ description: "File path; relative/absolute." }),
	offset: Type.Optional(Type.Integer({
		minimum: 1,
		description: "Start line; 1-based."
	})),
	limit: Type.Optional(Type.Number({ description: "Max lines." })),
	cursor: Type.Optional(Type.Integer({
		minimum: 0,
		description: "Character position within the start line; 0-based."
	})),
	optional: Type.Optional(Type.Literal(true, { description: "Missing paths return structured not_found instead of failing." }))
});
const readTruncationOutputSchema = Type.Object({
	truncated: Type.Literal(true),
	truncatedBy: Type.Union([Type.Literal("lines"), Type.Literal("bytes")]),
	totalLines: Type.Integer({ minimum: 0 }),
	totalBytes: Type.Integer({ minimum: 0 }),
	outputLines: Type.Integer({ minimum: 0 }),
	outputBytes: Type.Integer({ minimum: 0 }),
	lastLinePartial: Type.Boolean(),
	firstLineExceedsLimit: Type.Boolean(),
	maxLines: Type.Integer({ minimum: 1 }),
	maxBytes: Type.Integer({ minimum: 1 })
}, { additionalProperties: false });
const readToolOutputSchema = Type.Union([
	Type.Object({
		kind: Type.Literal("text"),
		content: Type.String()
	}, { additionalProperties: false }),
	Type.Object({
		kind: Type.Literal("image"),
		content: Type.String(),
		mimeType: Type.String()
	}, { additionalProperties: false }),
	Type.Object({
		kind: Type.Literal("truncated"),
		content: Type.String(),
		truncation: readTruncationOutputSchema,
		continuation: ReadToolContinuationSchema
	}, { additionalProperties: false }),
	Type.Object({
		kind: Type.Literal("not_found"),
		status: Type.Literal("not_found"),
		path: Type.String(),
		optional: Type.Literal(true)
	}, { additionalProperties: false })
]);
function createReadToolDetails(content, textDetails) {
	const text = content.find((part) => part.type === "text")?.text ?? "";
	const image = content.find((part) => part.type === "image");
	if (image) return {
		kind: "image",
		content: text,
		mimeType: image.mimeType
	};
	if (textDetails) return textDetails;
	return {
		kind: "text",
		content: text
	};
}
//#endregion
//#region src/agents/sessions/tools/read.ts
/**
* Built-in read session tool.
*
* Reads text and image files through local or injected operations with highlighting, resizing, and bounded output.
*/
function normalizeReadError(error, filePath) {
	if (hasErrnoCode(error, "EISDIR")) return /* @__PURE__ */ new Error(`Read requires a file path, but ${filePath} is a directory. List the directory, then read a specific file.`);
	return toErrorObject(error, "Non-Error rejection");
}
function regularFileReadError(filePath) {
	return /* @__PURE__ */ new Error(`Read only supports regular files; no read was attempted: ${filePath}`);
}
async function assertLocalReadableFile(filePath) {
	const stat$2 = await stat(filePath);
	if (stat$2.isDirectory()) throw Object.assign(/* @__PURE__ */ new Error(`Read requires a file: ${filePath}`), { code: "EISDIR" });
	if (!stat$2.isFile()) throw regularFileReadError(filePath);
	await access(filePath, constants.R_OK);
}
async function suggestLocalReadPaths(filePath) {
	let entries;
	try {
		entries = await readdir(dirname(filePath));
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")) return [];
		throw error;
	}
	const requested = basename(filePath).toLowerCase();
	const maxDistance = Math.max(1, Math.floor(requested.length * .4));
	return entries.map((entry) => ({
		entry,
		distance: levenshteinDistance(requested, entry.toLowerCase())
	})).filter(({ entry, distance }) => entry !== basename(filePath) && distance <= maxDistance).toSorted((left, right) => left.distance - right.distance || left.entry.localeCompare(right.entry)).slice(0, 3).map(({ entry }) => entry);
}
const COMPACT_RESOURCE_FILE_NAMES = /* @__PURE__ */ new Set([
	"AGENTS.md",
	"AGENTS.MD",
	"CLAUDE.md",
	"CLAUDE.MD"
]);
const defaultReadOperations = {
	resolvePath: resolveLocalReadPath,
	decodeText: ({ buffer }) => decodeWindowsTextFileBuffer({ buffer }),
	readFile: async (filePath) => (await readRegularFile({ filePath })).buffer,
	access: assertLocalReadableFile
};
async function detectReadImageMimeType(ops, buffer, absolutePath) {
	if (ops.detectImageMimeType) return await ops.detectImageMimeType(absolutePath, buffer);
	return detectSupportedImageMimeType(buffer);
}
function formatReadLineRange(args, theme) {
	if (args?.offset === void 0 && args?.limit === void 0) return "";
	const startLine = args.offset ?? 1;
	const normalizedLimit = args.limit !== void 0 ? normalizePositiveLimit(args.limit, DEFAULT_MAX_LINES) : void 0;
	const endLine = normalizedLimit !== void 0 ? startLine + normalizedLimit - 1 : "";
	return theme.fg("warning", `:${startLine}${endLine ? `-${endLine}` : ""}`);
}
function formatReadCall(args, theme) {
	const rawPath = str(args?.file_path ?? args?.path);
	const path = rawPath !== null ? shortenPath(rawPath) : null;
	const invalidArg = invalidArgText(theme);
	const pathDisplay = path === null ? invalidArg : path ? theme.fg("accent", path) : theme.fg("toolOutput", "...");
	return `${theme.fg("toolTitle", theme.bold("read"))} ${pathDisplay}${formatReadLineRange(args, theme)}`;
}
function getOpenClawDocsClassification(absolutePath) {
	const packageRoot = dirname(getReadmePath());
	const relativePath = relative(resolve(packageRoot), resolve(absolutePath));
	if (relativePath === "" || relativePath === ".." || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) return;
	const label = normalizeNativePathSeparators(relativePath);
	if (label === "README.md" || label.startsWith("docs/") || label.startsWith("examples/")) return {
		kind: "docs",
		label
	};
}
function getCompactReadClassification(args, cwd) {
	const rawPath = str(args?.file_path ?? args?.path);
	if (!rawPath) return;
	const absolutePath = resolveToCwd(rawPath, cwd);
	const fileName = basename(absolutePath);
	if (fileName === "SKILL.md") return {
		kind: "skill",
		label: basename(dirname(absolutePath)) || fileName
	};
	const docsClassification = getOpenClawDocsClassification(absolutePath);
	if (docsClassification) return docsClassification;
	if (COMPACT_RESOURCE_FILE_NAMES.has(fileName)) return {
		kind: "resource",
		label: formatPathRelativeToCwdOrAbsolute(absolutePath, cwd)
	};
}
async function resolveLocalReadPath(filePath, cwd) {
	const normalizedMediaSource = normalizeMediaReferenceSource(filePath);
	if (classifyMediaReferenceSource(normalizedMediaSource).isMediaStoreUrl) return await resolveMediaReferenceLocalPath(normalizedMediaSource);
	return resolveLocalPathToCwd(filePath, cwd);
}
async function resolveReadToolInputPath(ops, filePath, cwd) {
	return await (ops.resolvePath?.(filePath, cwd) ?? resolveToCwd(filePath, cwd));
}
async function resolveReadToolPathFromAbsolute(ops, absolutePath) {
	try {
		await ops.access(absolutePath);
		return { absolutePath };
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "ENOTDIR")) throw error;
		const matches = [];
		for (const candidate of getReadPathVariants(absolutePath)) try {
			await ops.access(candidate);
			matches.push(candidate);
		} catch (candidateError) {
			if (!hasErrnoCode(candidateError, "ENOENT") && !hasErrnoCode(candidateError, "ENOTDIR")) throw candidateError;
		}
		if (matches.length > 1) throw new Error(`Read path is ambiguous: ${basename(absolutePath)} matches ${matches.map((match) => basename(match)).join(", ")}.`, { cause: error });
		const match = matches[0];
		if (match !== void 0) return {
			absolutePath: match,
			note: `[Resolved filename: ${basename(absolutePath)} -> ${basename(match)}.]`
		};
		const suggestions = ops === defaultReadOperations ? await suggestLocalReadPaths(absolutePath) : [];
		const suggestion = suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?` : "";
		throw Object.assign(new Error(`File not found: ${absolutePath}.${suggestion}`, { cause: error }), { code: "ENOENT" });
	}
}
function formatCompactReadCall(classification, args, theme) {
	const expandHint = theme.fg("dim", ` (${keyText("app.tools.expand")} to expand)`);
	if (classification.kind === "skill") return theme.fg("customMessageLabel", `\u001b[1m[skill]\u001b[22m `) + theme.fg("customMessageText", classification.label) + formatReadLineRange(args, theme) + expandHint;
	return theme.fg("toolTitle", theme.bold(`read ${classification.kind}`)) + " " + theme.fg("accent", classification.label) + formatReadLineRange(args, theme) + expandHint;
}
function formatReadResult(args, result, options, theme, showImages, cwd, isError) {
	if (!options.expanded && !isError && getCompactReadClassification(args, cwd)) return "";
	const rawPath = str(args?.file_path ?? args?.path);
	const output = getTextOutput(result, showImages);
	const lang = rawPath ? getLanguageFromPath(rawPath) : void 0;
	const lines = trimTrailingEmptyLines(lang ? highlightCode(replaceTabs$1(output), lang) : output.split("\n"));
	const maxLines = options.expanded ? lines.length : 10;
	const displayLines = lines.slice(0, maxLines);
	const remaining = lines.length - maxLines;
	let text = `\n${displayLines.map((line) => lang ? replaceTabs$1(line) : theme.fg("toolOutput", replaceTabs$1(line))).join("\n")}`;
	if (remaining > 0) text += `${theme.fg("muted", `\n... (${remaining} more lines,`)} ${keyHint("app.tools.expand", "to expand")})`;
	const truncation = result.details?.kind === "truncated" ? result.details.truncation : void 0;
	if (truncation?.truncated) {
		if (truncation.firstLineExceedsLimit) text += `\n${theme.fg("warning", `[First line exceeds ${formatSize(truncation.maxBytes ?? 51200)} limit]`)}`;
		else if (truncation.truncatedBy === "lines") text += `\n${theme.fg("warning", `[Truncated: showing ${truncation.outputLines} of ${truncation.totalLines} lines (${truncation.maxLines ?? 2e3} line limit)]`)}`;
		else text += `\n${theme.fg("warning", `[Truncated: ${truncation.outputLines} lines shown (${formatSize(truncation.maxBytes ?? 51200)} limit)]`)}`;
	}
	return text;
}
function createReadToolDefinition(cwd, options) {
	const autoResizeImages = options?.autoResizeImages ?? true;
	const ops = options?.operations ?? defaultReadOperations;
	const maxBytes = options?.maxBytes ?? 51200;
	return {
		name: "read",
		label: "read",
		description: `Read text/image file (jpg/png/gif/webp/bmp); images attach to model context. Text caps ${DEFAULT_MAX_LINES} lines or ${DEFAULT_MAX_BYTES / 1024}KB. Continue with offset/limit, or cursor within a long line.`,
		promptSnippet: "Read file contents",
		promptGuidelines: ["Use read to examine files and its offset, limit, or cursor to continue."],
		parameters: readToolInputSchema,
		outputSchema: readToolOutputSchema,
		async execute(toolCallId, { path, offset, limit, cursor = 0, optional }, signal, onUpdate, ctx) {
			if (offset !== void 0 && (!Number.isSafeInteger(offset) || offset < 1)) throw new Error("Offset must be an integer at least 1");
			if (!Number.isSafeInteger(cursor) || cursor < 0) throw new Error("Cursor must be an integer at least 0");
			return new Promise((resolve, reject) => {
				if (signal?.aborted) {
					reject(/* @__PURE__ */ new Error("Operation aborted"));
					return;
				}
				let aborted = false;
				const onAbort = () => {
					aborted = true;
					reject(/* @__PURE__ */ new Error("Operation aborted"));
				};
				signal?.addEventListener("abort", onAbort, { once: true });
				(async () => {
					try {
						let absolutePath;
						let note;
						let buffer;
						try {
							const inputPathResolution = resolveReadToolInputPath(ops, path, cwd);
							const snapshot = await withFileMutationQueueKeysResolution(inputPathResolution.then(async (absoluteInputPath) => await Promise.all(getReadQueuePaths(absoluteInputPath).map(async (candidate) => await resolveFileMutationQueueKey(candidate, ops.resolveQueueKey, signal)))), async () => {
								const absoluteInputPath = await inputPathResolution;
								const resolved = await resolveReadToolPathFromAbsolute(ops, absoluteInputPath);
								if (aborted) return;
								return {
									...resolved,
									buffer: await ops.readFile(resolved.absolutePath)
								};
							});
							if (!snapshot) return;
							({absolutePath, note, buffer} = snapshot);
						} catch (error) {
							if (aborted) return;
							if (optional !== true || !hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "ENOTDIR")) throw error;
							signal?.removeEventListener("abort", onAbort);
							resolve({
								content: [{
									type: "text",
									text: `Optional file not found: ${path}.`
								}],
								details: {
									kind: "not_found",
									status: "not_found",
									path,
									optional: true
								}
							});
							return;
						}
						const mimeType = await detectReadImageMimeType(ops, buffer, absolutePath);
						let content;
						let textDetails;
						const nonVisionImageNote = (options?.modelHasVision ?? ctx?.model?.input.includes("image")) === false ? "[Current model does not support images. The image will be omitted from this request.]" : void 0;
						if (mimeType) {
							const processed = await processImage({
								data: Buffer.from(buffer),
								mimeType
							}, { autoResizeImages });
							if (!processed.ok) {
								let textNote = `Read image file [${mimeType}]\n${processed.message}`;
								if (nonVisionImageNote) textNote += `\n${nonVisionImageNote}`;
								content = [{
									type: "text",
									text: textNote
								}];
							} else {
								let textNote = `Read image file [${processed.image.mimeType}]`;
								if (processed.hints.length > 0) textNote += `\n${processed.hints.join("\n")}`;
								if (nonVisionImageNote) textNote += `\n${nonVisionImageNote}`;
								content = [{
									type: "text",
									text: textNote
								}];
								if (!nonVisionImageNote) content.push(processed.image);
							}
						} else {
							const decodedText = ops.decodeText?.({
								buffer,
								absolutePath
							}) ?? buffer.toString("utf8");
							const textContent = (decodedText.startsWith("﻿") ? decodedText.slice(1) : decodedText).replaceAll("\r\n", "\n");
							const startLine = offset === void 0 ? 0 : offset - 1;
							const startLineDisplay = startLine + 1;
							const requestedLines = limit === void 0 ? void 0 : normalizePositiveLimit(limit, DEFAULT_MAX_LINES);
							let totalFileLines = 0;
							let selectedStart = 0;
							let selectedEnd = 0;
							let selectedLineCount = 0;
							let firstLineEnd = 0;
							let selectedHasText = false;
							for (let start = 0; start < textContent.length;) {
								const newline = textContent.indexOf("\n", start);
								const end = newline === -1 ? textContent.length : newline;
								if (totalFileLines >= startLine && (requestedLines === void 0 || selectedLineCount < requestedLines)) {
									if (selectedLineCount === 0) {
										selectedStart = start;
										firstLineEnd = end;
									}
									selectedEnd = end;
									selectedLineCount += 1;
									selectedHasText ||= end > start;
								}
								totalFileLines += 1;
								start = end + 1;
							}
							const firstLineLength = firstLineEnd - selectedStart;
							let outputText;
							if (totalFileLines === 0) outputText = buffer.length === 0 ? "File is empty (0 bytes)." : `File contains no readable text (${buffer.length} bytes).`;
							else if (startLine >= totalFileLines) outputText = `Offset ${offset} is beyond end of file (${totalFileLines} lines total). Retry with offset <= ${totalFileLines}.`;
							else if (cursor > 0 && cursor >= firstLineLength) outputText = `Cursor ${cursor} is at or beyond the end of line ${startLineDisplay} (${firstLineLength} characters).${startLine + 1 < totalFileLines ? ` Use offset=${startLineDisplay + 1} to continue.` : ""}`;
							else {
								if (cursor > 0 && textContent.codePointAt(selectedStart + cursor - 1) > 65535) throw new Error(`Cursor ${cursor} splits a UTF-16 surrogate pair; retry with cursor=${cursor - 1} or cursor=${cursor + 1}.`);
								const endLine = startLine + selectedLineCount;
								const userLimitedLines = limit === void 0 ? void 0 : endLine - startLine;
								const selectedContent = textContent.slice(selectedStart + cursor, endLine === totalFileLines ? textContent.length : selectedEnd);
								const noteBytes = note ? Buffer.byteLength(`${note}\n`, "utf8") : 0;
								const page = createBoundedReadTextPage({
									content: selectedContent,
									startLine: startLineDisplay,
									endLine,
									totalLines: totalFileLines,
									cursor,
									limit: userLimitedLines,
									maxBytes,
									modelBudget: options?.modelBudget,
									prefix: note ? `${note}\n` : void 0,
									pageMaxBytes: Math.min(DEFAULT_MAX_BYTES, maxBytes) - noteBytes,
									adaptive: options?.maxBytes !== void 0
								});
								outputText = page.text;
								textDetails = page.details;
								if (!selectedHasText) {
									outputText = `${startLine === 0 && endLine === totalFileLines ? "File" : "Selected range"} contains ${selectedLineCount} blank line${selectedLineCount === 1 ? "" : "s"}.`;
									if (textDetails.kind === "truncated") outputText += page.text.slice(textDetails.content.length);
								}
							}
							if (textDetails) {
								const sameContent = outputText === textDetails.content;
								outputText = Buffer.from(outputText, "utf16le").toString("utf16le");
								textDetails.content = sameContent ? outputText : Buffer.from(textDetails.content, "utf16le").toString("utf16le");
							}
							content = [{
								type: "text",
								text: outputText
							}];
						}
						if (note && content[0]?.type === "text") content = [{
							...content[0],
							text: `${note}\n${content[0].text}`
						}, ...content.slice(1)];
						if (aborted) return;
						signal?.removeEventListener("abort", onAbort);
						resolve({
							content,
							details: createReadToolDetails(content, textDetails)
						});
					} catch (error) {
						signal?.removeEventListener("abort", onAbort);
						if (!aborted) reject(normalizeReadError(error, path));
					}
				})();
			});
		},
		renderCall(args, theme, context) {
			const classification = !context.expanded ? getCompactReadClassification(args, context.cwd) : void 0;
			const content = classification ? formatCompactReadCall(classification, args, theme) : formatReadCall(args, theme);
			return reuseTextComponent(context.lastComponent, content);
		},
		renderResult(result, optionsLocal, theme, context) {
			const content = formatReadResult(context.args, result, optionsLocal, theme, context.showImages, context.cwd, context.isError);
			return reuseTextComponent(context.lastComponent, content);
		}
	};
}
function createReadTool(cwd, options) {
	return wrapToolDefinition(createReadToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/sessions/tools/write.ts
/**
* Built-in write session tool.
*
* Writes files through queued local or injected operations with readback/idempotency metadata.
*/
const writeSchema = Type.Object({
	path: Type.String({ description: "File path; relative/absolute." }),
	content: Type.String({ description: "File content." })
});
const WriteToolOutputSchema = Type.Union([
	Type.Object({ changed: Type.Literal(false) }, { additionalProperties: false }),
	Type.Object({
		changed: Type.Literal(true),
		created: Type.Literal(true),
		diff: Type.String(),
		patch: Type.String(),
		firstChangedLine: Type.Optional(Type.Integer({ minimum: 1 }))
	}, { additionalProperties: false }),
	Type.Object({
		changed: Type.Literal(true),
		created: Type.Literal(false),
		diff: Type.String(),
		patch: Type.String(),
		firstChangedLine: Type.Optional(Type.Integer({ minimum: 1 }))
	}, { additionalProperties: false }),
	Type.Object({
		changed: Type.Literal(true),
		created: Type.Optional(Type.Boolean())
	}, { additionalProperties: false })
]);
const defaultWriteOperations = {
	writeFile: (path, content) => writeFile(path, content, "utf-8"),
	mkdir: (dir) => mkdir(dir, { recursive: true }).then(() => {}),
	readFile: (path) => readFile(path),
	statFile: async (path) => {
		try {
			const stat$1 = await stat(path);
			return {
				type: stat$1.isFile() ? "file" : stat$1.isDirectory() ? "directory" : "other",
				size: stat$1.size,
				mtimeMs: stat$1.mtimeMs
			};
		} catch (error) {
			if (isMissingPathError(error)) return null;
			throw error;
		}
	}
};
const WRITE_PRECHECK_READ_LIMIT_BYTES = 1048576;
const WRITE_DIFF_MAX_COMBINED_LINES = 2e4;
const WRITE_DIFF_MAX_EDIT_LENGTH = 2e3;
function countNewlines(text) {
	let count = 0;
	for (let index = text.indexOf("\n"); index !== -1; index = text.indexOf("\n", index + 1)) count += 1;
	return count;
}
var WriteCallRenderComponent = class extends Text {
	constructor() {
		super("", 0, 0);
	}
};
const WRITE_PARTIAL_FULL_HIGHLIGHT_LINES = 50;
function highlightSingleLine(line, lang) {
	return highlightCode(line, lang)[0] ?? "";
}
function refreshWriteHighlightPrefix(cache) {
	const prefixCount = Math.min(WRITE_PARTIAL_FULL_HIGHLIGHT_LINES, cache.normalizedLines.length);
	if (prefixCount === 0) return;
	const prefixHighlighted = highlightCode(cache.normalizedLines.slice(0, prefixCount).join("\n"), cache.lang);
	for (let i = 0; i < prefixCount; i++) cache.highlightedLines[i] = prefixHighlighted[i] ?? highlightSingleLine(cache.normalizedLines[i] ?? "", cache.lang);
}
function rebuildWriteHighlightCacheFull(rawPath, fileContent) {
	const lang = rawPath ? getLanguageFromPath(rawPath) : void 0;
	if (!lang) return;
	const normalized = replaceTabs$1(normalizeDisplayText(fileContent));
	return {
		rawPath,
		lang,
		rawContent: fileContent,
		normalizedLines: normalized.split("\n"),
		highlightedLines: highlightCode(normalized, lang)
	};
}
function updateWriteHighlightCacheIncremental(cache, rawPath, fileContent) {
	const lang = rawPath ? getLanguageFromPath(rawPath) : void 0;
	if (!lang) return;
	if (!cache) return rebuildWriteHighlightCacheFull(rawPath, fileContent);
	if (cache.lang !== lang || cache.rawPath !== rawPath) return rebuildWriteHighlightCacheFull(rawPath, fileContent);
	if (!fileContent.startsWith(cache.rawContent)) return rebuildWriteHighlightCacheFull(rawPath, fileContent);
	if (fileContent.length === cache.rawContent.length) return cache;
	const deltaNormalized = replaceTabs$1(normalizeDisplayText(fileContent.slice(cache.rawContent.length)));
	cache.rawContent = fileContent;
	if (cache.normalizedLines.length === 0) {
		cache.normalizedLines.push("");
		cache.highlightedLines.push("");
	}
	const segments = deltaNormalized.split("\n");
	const lastIndex = cache.normalizedLines.length - 1;
	const firstSegment = segments.at(0);
	const currentLastLine = cache.normalizedLines.at(lastIndex);
	if (firstSegment === void 0 || currentLastLine === void 0) return rebuildWriteHighlightCacheFull(rawPath, fileContent);
	cache.normalizedLines[lastIndex] = currentLastLine + firstSegment;
	cache.highlightedLines[lastIndex] = highlightSingleLine(cache.normalizedLines[lastIndex], cache.lang);
	for (const segment of segments.slice(1)) {
		cache.normalizedLines.push(segment);
		cache.highlightedLines.push(highlightSingleLine(segment, cache.lang));
	}
	refreshWriteHighlightPrefix(cache);
	return cache;
}
function formatWriteCall(args, options, theme, cache) {
	const rawPath = str(args?.file_path ?? args?.path);
	const fileContent = str(args?.content);
	const path = rawPath !== null ? shortenPath(rawPath) : null;
	const invalidArg = invalidArgText(theme);
	let text = `${theme.fg("toolTitle", theme.bold("write"))} ${path === null ? invalidArg : path ? theme.fg("accent", path) : theme.fg("toolOutput", "...")}`;
	if (fileContent === null) text += `\n\n${theme.fg("error", "[invalid content arg - expected string]")}`;
	else if (fileContent) {
		const lang = rawPath ? getLanguageFromPath(rawPath) : void 0;
		const lines = trimTrailingEmptyLines(lang ? cache?.highlightedLines ?? highlightCode(replaceTabs$1(normalizeDisplayText(fileContent)), lang) : normalizeDisplayText(fileContent).split("\n"));
		const totalLines = lines.length;
		const maxLines = options.expanded ? lines.length : 10;
		const displayLines = lines.slice(0, maxLines);
		const remaining = lines.length - maxLines;
		text += `\n\n${displayLines.map((line) => lang ? line : theme.fg("toolOutput", replaceTabs$1(line))).join("\n")}`;
		if (remaining > 0) text += `${theme.fg("muted", `\n... (${remaining} more lines, ${totalLines} total,`)} ${keyHint("app.tools.expand", "to expand")})`;
	}
	return text;
}
function formatWriteResult(result, theme) {
	if (!result.isError) return;
	const output = result.content.filter((c) => c.type === "text").map((c) => c.text || "").join("\n");
	if (!output) return;
	return `\n${theme.fg("error", output)}`;
}
function isMissingFileError(error) {
	if (isMissingPathError(error)) return true;
	return error instanceof Error && error.message.includes("No such file or directory");
}
async function readOriginalWriteState(absolutePath, content, ops) {
	let stat;
	try {
		stat = await ops.statFile(absolutePath);
	} catch (error) {
		return isMissingFileError(error) ? {
			state: "different",
			beforeStat: null
		} : { state: "unknown" };
	}
	if (!stat) return {
		state: "different",
		beforeStat: stat
	};
	if (stat.type !== "file") return {
		state: "unknown",
		beforeStat: stat
	};
	if (stat.size !== Buffer.byteLength(content, "utf8")) return {
		state: "different",
		beforeStat: stat
	};
	if (!ops.readFile || stat.size > WRITE_PRECHECK_READ_LIMIT_BYTES) return {
		state: "unknown",
		beforeStat: stat
	};
	try {
		const originalContent = await ops.readFile(absolutePath);
		const originalBytes = Buffer.isBuffer(originalContent) ? originalContent : Buffer.from(originalContent, "utf8");
		const originalText = originalBytes.toString("utf8");
		if (Buffer.byteLength(originalText, "utf8") > WRITE_PRECHECK_READ_LIMIT_BYTES) return {
			state: "unknown",
			beforeStat: stat,
			readAttempted: true
		};
		return {
			state: originalBytes.equals(Buffer.from(content, "utf8")) ? "same" : "different",
			beforeStat: stat,
			beforeText: originalText,
			readAttempted: true
		};
	} catch {
		return {
			state: "unknown",
			beforeStat: stat,
			readAttempted: true
		};
	}
}
async function resolveWriteDetails(params) {
	if (Buffer.byteLength(params.content, "utf8") > WRITE_PRECHECK_READ_LIMIT_BYTES) {
		if (params.precheck.beforeStat === null) return {
			changed: true,
			created: true
		};
		return params.precheck.beforeStat ? {
			changed: true,
			created: false
		} : { changed: true };
	}
	if (params.precheck.beforeStat === null) {
		if (countNewlines(params.content) > WRITE_DIFF_MAX_COMBINED_LINES) return {
			changed: true,
			created: true
		};
		const diffResult = generateDiffString("", params.content);
		return {
			changed: true,
			created: true,
			diff: diffResult.diff,
			patch: generateUnifiedPatch(params.path, "", params.content),
			...diffResult.firstChangedLine === void 0 ? {} : { firstChangedLine: diffResult.firstChangedLine }
		};
	}
	const beforeStat = params.precheck.beforeStat;
	let beforeText = params.precheck.beforeText;
	if (beforeText === void 0 && !params.precheck.readAttempted && beforeStat?.type === "file" && beforeStat.size <= WRITE_PRECHECK_READ_LIMIT_BYTES && params.ops.readFile) {
		const originalContent = await params.ops.readFile(params.absolutePath).catch(() => void 0);
		const candidate = Buffer.isBuffer(originalContent) ? originalContent.toString("utf8") : originalContent;
		if (candidate !== void 0 && Buffer.byteLength(candidate, "utf8") <= WRITE_PRECHECK_READ_LIMIT_BYTES) beforeText = candidate;
	}
	if (beforeText !== void 0 && (beforeText.includes("�") || beforeText.includes("\0"))) beforeText = void 0;
	if (beforeText !== void 0 && (Buffer.byteLength(beforeText, "utf8") + Buffer.byteLength(params.content, "utf8") > WRITE_PRECHECK_READ_LIMIT_BYTES || countNewlines(beforeText) + countNewlines(params.content) > WRITE_DIFF_MAX_COMBINED_LINES)) beforeText = void 0;
	const preparedPatch = beforeText === void 0 ? void 0 : structuredPatch(params.path, params.path, beforeText, params.content, void 0, void 0, {
		context: 4,
		maxEditLength: WRITE_DIFF_MAX_EDIT_LENGTH
	});
	if (beforeText !== void 0 && preparedPatch !== void 0) {
		const diffResult = generateDiffString(beforeText, params.content, 4, preparedPatch.hunks);
		return {
			changed: true,
			created: false,
			diff: diffResult.diff,
			patch: formatPatch(preparedPatch, FILE_HEADERS_ONLY),
			...diffResult.firstChangedLine === void 0 ? {} : { firstChangedLine: diffResult.firstChangedLine }
		};
	}
	return beforeStat ? {
		changed: true,
		created: false
	} : { changed: true };
}
async function didWriteMetadataChange(absolutePath, beforeStat, ops) {
	if (!beforeStat || !ops.statFile) return false;
	const afterStat = await ops.statFile(absolutePath).catch(() => null);
	if (!afterStat || afterStat.type !== "file") return false;
	return afterStat.size !== beforeStat.size || afterStat.mtimeMs !== beforeStat.mtimeMs;
}
function isWriteRecoveryCandidate(error, signal) {
	if (signal?.aborted) return true;
	if (!(error instanceof Error)) return false;
	const message = error.message.toLowerCase();
	return error.name === "AbortError" || error.name === "TimeoutError" || message.includes("timed out") || message.includes("timeout");
}
function successfulWriteResult(path, content, details) {
	return textResult(`Successfully wrote ${Buffer.byteLength(content, "utf8")} bytes to ${path}`, details);
}
async function recoverSuccessfulWrite(params) {
	if (!isWriteRecoveryCandidate(params.error, params.signal)) return null;
	const verified = await verifyPersistedUtf8File(params.absolutePath, params.content, params.ops);
	const changed = params.precheck.state === "different" || params.precheck.state === "unknown" && await didWriteMetadataChange(params.absolutePath, params.precheck.beforeStat, params.ops);
	if (!verified || !changed) return null;
	return successfulWriteResult(params.path, params.content, params.details);
}
function createWriteToolDefinition(cwd, options) {
	const ops = options?.operations ?? defaultWriteOperations;
	const resolvePath = options?.operations ? resolveToCwd : resolveLocalPathToCwd;
	return {
		name: "write",
		label: "write",
		description: "Write/overwrite file; creates parent directories.",
		promptSnippet: "Create/overwrite files",
		promptGuidelines: ["Use only new files/complete rewrites."],
		parameters: writeSchema,
		outputSchema: WriteToolOutputSchema,
		async execute(toolCallId, { path, content }, signal, onUpdate, ctx) {
			const assertCurrent = captureAgentToolSourceExecutionGuard();
			const absolutePath = resolvePath(path, cwd);
			const dir = dirname(absolutePath);
			return withFileMutationQueueKeyResolution(resolveFileMutationQueueKey(absolutePath, ops.resolveQueueKey, signal), async () => {
				const precheck = await readOriginalWriteState(absolutePath, content, ops);
				if (signal?.aborted) throw new Error("Operation aborted");
				assertCurrent();
				if (precheck.state === "same") return textResult(`No changes made to ${path}. The file already has identical content.`, { changed: false });
				const details = await resolveWriteDetails({
					absolutePath,
					content,
					ops,
					path,
					precheck
				});
				try {
					assertCurrent();
					await ops.mkdir(dir);
					if (signal?.aborted) throw new Error("Operation aborted");
					assertCurrent();
					await ops.writeFile(absolutePath, content);
					if (signal?.aborted) throw new Error("Operation aborted");
					assertCurrent();
					if (!await verifyPersistedUtf8File(absolutePath, content, ops)) throw new Error(`Write verification failed for ${path}: the persisted regular file does not match the requested content. Inspect the target and retry.`);
					assertCurrent();
					return successfulWriteResult(path, content, details);
				} catch (error) {
					assertCurrent();
					const recovered = await recoverSuccessfulWrite({
						absolutePath,
						content,
						error,
						ops,
						path,
						precheck,
						details,
						signal
					});
					if (recovered) {
						assertCurrent();
						return recovered;
					}
					throw error;
				}
			});
		},
		renderCall(args, theme, context) {
			const renderArgs = args;
			const rawPath = str(renderArgs?.file_path ?? renderArgs?.path);
			const fileContent = str(renderArgs?.content);
			const component = context.lastComponent ?? new WriteCallRenderComponent();
			if (fileContent !== null) component.cache = context.argsComplete ? rebuildWriteHighlightCacheFull(rawPath, fileContent) : updateWriteHighlightCacheIncremental(component.cache, rawPath, fileContent);
			else component.cache = void 0;
			component.setText(formatWriteCall(renderArgs, {
				expanded: context.expanded,
				isPartial: context.isPartial
			}, theme, component.cache));
			return component;
		},
		renderResult(result, optionsLocal, theme, context) {
			const output = formatWriteResult({
				...result,
				isError: context.isError
			}, theme);
			if (!output) {
				const component = context.lastComponent ?? new Container();
				component.clear();
				return component;
			}
			return reuseTextComponent(context.lastComponent, output);
		}
	};
}
function createWriteTool(cwd, options) {
	return wrapToolDefinition(createWriteToolDefinition(cwd, options));
}
//#endregion
//#region src/agents/sessions/tools/index.ts
const allToolNames = /* @__PURE__ */ new Set([
	"read",
	"bash",
	"edit",
	"write",
	"grep",
	"find",
	"ls"
]);
/** Creates one tool definition by stable built-in tool name. */
function createToolDefinition(toolName, cwd, options) {
	switch (toolName) {
		case "read": return createReadToolDefinition(cwd, options?.read);
		case "bash": return createBashToolDefinition(cwd, options?.bash);
		case "edit": return createEditToolDefinition(cwd, options?.edit);
		case "write": return createWriteToolDefinition(cwd, options?.write);
		case "grep": return createGrepToolDefinition(cwd, options?.grep);
		case "find": return createFindToolDefinition(cwd, options?.find);
		case "ls": return createLsToolDefinition(cwd, options?.ls);
		default: throw new Error(`Unknown tool name: ${String(toolName)}`);
	}
}
/** Creates one executable built-in tool by stable tool name. */
function createTool(toolName, cwd, options) {
	return wrapToolDefinition(createToolDefinition(toolName, cwd, options));
}
/** Creates the mutable coding tool definitions used by agent coding sessions. */
function createCodingToolDefinitions(cwd, options) {
	return [
		createReadToolDefinition(cwd, options?.read),
		createBashToolDefinition(cwd, options?.bash),
		createEditToolDefinition(cwd, options?.edit),
		createWriteToolDefinition(cwd, options?.write)
	];
}
/** Creates read-only discovery tool definitions for restricted sessions. */
function createReadOnlyToolDefinitions(cwd, options) {
	return [
		createReadToolDefinition(cwd, options?.read),
		createGrepToolDefinition(cwd, options?.grep),
		createFindToolDefinition(cwd, options?.find),
		createLsToolDefinition(cwd, options?.ls)
	];
}
/** Creates all built-in tool definitions keyed by tool name. */
function createAllToolDefinitions(cwd, options) {
	return {
		read: createReadToolDefinition(cwd, options?.read),
		bash: createBashToolDefinition(cwd, options?.bash),
		edit: createEditToolDefinition(cwd, options?.edit),
		write: createWriteToolDefinition(cwd, options?.write),
		grep: createGrepToolDefinition(cwd, options?.grep),
		find: createFindToolDefinition(cwd, options?.find),
		ls: createLsToolDefinition(cwd, options?.ls)
	};
}
/** Creates the mutable coding tools used by local agent sessions. */
function createCodingTools(cwd, options) {
	return wrapToolDefinitions(createCodingToolDefinitions(cwd, options));
}
/** Creates read-only discovery tools for restricted sessions. */
function createReadOnlyTools(cwd, options) {
	return wrapToolDefinitions(createReadOnlyToolDefinitions(cwd, options));
}
/** Creates all built-in tools keyed by tool name. */
function createAllTools(cwd, options) {
	const definitions = createAllToolDefinitions(cwd, options);
	return {
		read: wrapToolDefinition(definitions.read),
		bash: wrapToolDefinition(definitions.bash),
		edit: wrapToolDefinition(definitions.edit),
		write: wrapToolDefinition(definitions.write),
		grep: wrapToolDefinition(definitions.grep),
		find: wrapToolDefinition(definitions.find),
		ls: wrapToolDefinition(definitions.ls)
	};
}
//#endregion
export { createBashToolDefinition as A, writePrivateTempFile as B, createEditToolDefinition as C, withFileMutationQueueKeysResolution as D, withFileMutationQueueKeyResolution as E, interactiveAgentTheme as F, loadThemeFromPath as I, addIgnoreRules as L, wrapToolDefinition as M, wrapToolDefinitions as N, decodeUtf8File as O, createLocalBashOperations as P, normalizeNativePathSeparators as R, createEditTool as S, withFileMutationQueue as T, createLsToolDefinition as _, createCodingTools as a, createFindTool as b, createTool as c, createWriteToolDefinition as d, createReadTool as f, createLsTool as g, formatReadContinuationNotice as h, createCodingToolDefinitions as i, createToolDefinitionFromAgentTool as j, createBashTool as k, createToolDefinition as l, createBoundedReadTextPage as m, createAllToolDefinitions as n, createReadOnlyToolDefinitions as o, createReadToolDefinition as p, createAllTools as r, createReadOnlyTools as s, allToolNames as t, createWriteTool as u, createGrepTool as v, resolveFileMutationQueueKey as w, createFindToolDefinition as x, createGrepToolDefinition as y, OutputAccumulator as z };
