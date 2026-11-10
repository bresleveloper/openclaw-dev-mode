import { j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { r as estimateStringCharsWithMinimumRawWeight } from "./cjk-chars-D02XG87t.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { h as shortenPathWithHome } from "./utils-gjJ-tD2q.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./errors-DPfGDWk1.mjs";
import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { t as getSpawnBroker } from "./context-JTQRB4fe.mjs";
import { i as withChildProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { r as copyCodeModeControlToolIdentity } from "./code-mode-control-tools-ktsLOa_a.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import { l as copyInternalToolExecutionPreparer } from "./internal-hooks-CSjTREUl.mjs";
import { n as normalizeMediaReferenceSource } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { r as decodeWindowsTextFileBuffer } from "./windows-encoding-BZ9QWkjs.mjs";
import { t as runCommandBuffered } from "./exec-Bf6uhUA7.mjs";
import { d as withCommandProcessScope, r as resolveCommandProcessSignal } from "./exec-spawn-Cn2m7YAI.mjs";
import { r as captureAgentToolSourceExecutionGuard, s as runWithAgentToolSourceExecutionScope } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import { s as sanitizeBinaryOutput } from "./shell-utils-bJwhgbCe.mjs";
import { a as convertImageToPng, h as createImageProcessor } from "./image-ops-DM5GUpDi.mjs";
import { f as sliceToolResultTextToBudget, s as toolResultFitsBudget } from "./tool-result-limits-tYfGdUlb.mjs";
import { t as levenshteinDistance } from "./levenshtein-distance-CanhxvCN.mjs";
import "./file-diff-Cm5KmaWf.mjs";
import { n as classifyAttachmentBytes } from "./attachment-classify-C6ki8r7-.mjs";
import { n as formatPathRelativeToCwdOrAbsolute } from "./paths-C-gBEpJw.mjs";
import { i as resolveMediaReferenceLocalPath, n as classifyMediaReferenceSource } from "./media-reference-Dlq4zAi4.mjs";
import { a as resolveToCwd, i as resolveLocalPathToCwd, n as getReadPathVariants, r as getReadQueuePaths } from "./path-utils-Bn-ftvxY.mjs";
import { n as getAgentToolExecutionContext } from "./tool-execution-context-BwYF5HLu.mjs";
import { c as writeSchema, i as editSchema, o as readToolInputSchema, r as WriteToolOutputSchema, s as readToolOutputSchema, t as EditToolOutputSchema } from "./tool-schemas-B1hOiDDb.mjs";
import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.mjs";
import { i as getReadmePath } from "./package-metadata-CjeAadCi.mjs";
import { t as isSqliteFilePath } from "./sqlite-file-path-jAGhu7_w.mjs";
import { i as truncateHead, n as DEFAULT_MAX_LINES, r as formatSize, t as DEFAULT_MAX_BYTES } from "./truncate-DH9KX6o6.mjs";
import { createRequire } from "node:module";
import * as fs$2 from "node:fs";
import { constants, lstatSync, realpathSync, statSync } from "node:fs";
import { access, mkdir, readFile, readdir, stat as stat$1, writeFile } from "node:fs/promises";
import * as os$1 from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { readRegularFile, readRegularFileSync } from "@openclaw/fs-safe/advanced";
import { hasNodeErrorCode, isPathInside, safeRealpathSync } from "@openclaw/fs-safe/path";
import chalk from "chalk";
import { deserialize } from "node:v8";
import { Type } from "typebox";
import { Compile } from "typebox/compile";
import { repairJson } from "@openclaw/ai/internal/runtime";
import ignore from "ignore";
import { Text, getCapabilities, getImageDimensions, getKeybindings, imageFallback } from "@earendil-works/pi-tui";
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
async function resolveFileMutationQueueKey(filePath, resolveQueueKey, signal) {
	return await (resolveQueueKey?.(filePath, signal) ?? resolveIdentityPathViaExistingAncestorSync(filePath));
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
//#region src/agents/sessions/tools/file-tool-abort.ts
function assertFileToolNotAborted(signal) {
	if (signal?.aborted) throw new Error("Operation aborted");
}
//#endregion
//#region src/agents/sessions/tools/file-tool-planning.ts
const pool = new WorkerTaskPool({
	workerClass: "compute",
	sharedCompute: true,
	workerUrl: resolveRuntimeProcessEntrypointUrl("fileToolPlanning")
});
function plan(input, signal) {
	const chars = input.path.length + input.content.length + (input.kind === "edit" ? input.edits.reduce((sum, edit) => sum + edit.oldText.length + edit.newText.length, 0) : input.beforeText?.length ?? 0);
	return pool.run(input, {
		signal,
		inputBytes: chars * 2
	});
}
async function planFileEdit(input, signal) {
	const result = await plan({
		kind: "edit",
		...input
	}, signal);
	if (result.kind !== "edit") throw new Error("Unexpected file edit planning result");
	return result.plan;
}
async function planFileWriteDiff(input, signal) {
	const result = await plan({
		kind: "write",
		...input
	}, signal);
	if (result.kind !== "write") throw new Error("Unexpected file write planning result");
	return result.receipt;
}
//#endregion
//#region src/agents/sessions/tools/file-write-verification.ts
async function readPersistedFileStat(absolutePath, isMissing) {
	try {
		const stat = await stat$1(absolutePath);
		return {
			type: stat.isFile() ? "file" : stat.isDirectory() ? "directory" : "other",
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	} catch (error) {
		if (isMissing(error)) return null;
		throw error;
	}
}
async function verifyPersistedUtf8File(absolutePath, content, operations) {
	const expectedContent = Buffer.from(content, "utf8");
	const stat = await operations.statFile(absolutePath).catch(() => null);
	if (!stat || stat.type !== "file" || stat.size !== expectedContent.byteLength) return false;
	const readback = await operations.readFile(absolutePath).catch(() => void 0);
	if (readback === void 0) return false;
	return (Buffer.isBuffer(readback) ? readback : Buffer.from(readback, "utf8")).equals(expectedContent);
}
//#endregion
//#region src/agents/sessions/tools/tool-definition-wrapper.ts
function toolDefinitionMetadata(tool) {
	return {
		name: tool.name,
		label: tool.label,
		...tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
		...tool.resultContentSource ? { resultContentSource: tool.resultContentSource } : {},
		description: tool.description,
		parameters: tool.parameters,
		...tool.outputSchema ? { outputSchema: tool.outputSchema } : {},
		prepareArguments: tool.prepareArguments,
		executionMode: tool.executionMode,
		...tool.async === false ? { async: false } : {}
	};
}
function wrapToolDefinition(definition, ctxFactory) {
	const tool = {
		...toolDefinitionMetadata(definition),
		execute: (toolCallId, params, signal, onUpdate) => definition.execute(toolCallId, params, signal, onUpdate, ctxFactory?.())
	};
	copyCodeModeControlToolIdentity(definition, tool);
	return copyInternalToolExecutionPreparer(definition, tool);
}
/**
* Synthesize a minimal ToolDefinition from an AgentTool.
*
* This keeps AgentSession's internal registry definition-first even when a caller
* provides plain AgentTool overrides that do not include prompt metadata or renderers.
*/
function createToolDefinitionFromAgentTool(tool) {
	const definition = {
		...toolDefinitionMetadata(tool),
		execute: async (toolCallId, params, signal, onUpdate) => tool.execute(toolCallId, params, signal, onUpdate)
	};
	copyCodeModeControlToolIdentity(tool, definition);
	return copyInternalToolExecutionPreparer(tool, definition);
}
//#endregion
//#region src/agents/sessions/tools/edit.ts
const EDIT_MISMATCH_MESSAGE = "Could not find the exact text in";
const EDIT_MISMATCH_HINT_LIMIT = 800;
const defaultEditOperations = {
	readFile: (path) => readFile(path),
	writeFile: (path, content) => writeFile(path, content, "utf-8"),
	statFile: (path) => readPersistedFileStat(path, (error) => hasErrnoCode(error, "ENOENT")),
	access: (path) => access(path, constants.R_OK | constants.W_OK)
};
function prepareEditArguments(input) {
	if (!input || typeof input !== "object") return input;
	const args = { ...input };
	if (typeof args.edits === "string") try {
		const parsed = JSON.parse(repairJson(args.edits, { preserveValidControlEscapes: true }));
		if (Array.isArray(parsed)) args.edits = parsed;
	} catch {
		if (typeof args.oldText !== "string" || typeof args.newText !== "string") throw new Error("Could not parse edits as JSON. Provide a complete JSON array of replacements.");
	}
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
function appendMismatchHint(error, currentContent) {
	const snippet = currentContent.length <= EDIT_MISMATCH_HINT_LIMIT ? currentContent : `${truncateUtf16Safe(currentContent, EDIT_MISMATCH_HINT_LIMIT)}\n... (truncated)`;
	const enhanced = new Error(`${error.message}\nCurrent file contents:\n${snippet}`, { cause: error });
	enhanced.stack = error.stack;
	return enhanced;
}
function createEditTool(cwd, options) {
	const ops = options?.operations ?? defaultEditOperations;
	const resolvePath = options?.operations ? resolveToCwd : resolveLocalPathToCwd;
	return wrapToolDefinition({
		name: "edit",
		label: "edit",
		description: "Exact single-file replacements. oldText unique/non-overlapping against original. Merge nearby changes; omit large unchanged spans.",
		parameters: editSchema,
		outputSchema: EditToolOutputSchema,
		prepareArguments: prepareEditArguments,
		async execute(_toolCallId, input, signal, _onUpdate, _ctx) {
			const assertCurrent = captureAgentToolSourceExecutionGuard();
			if (!Array.isArray(input.edits) || input.edits.length === 0) throw new Error("Edit tool input is invalid. edits must contain at least one replacement.");
			const { path, edits: originalEdits } = input;
			const absolutePath = resolvePath(path, cwd);
			return withFileMutationQueueKeyResolution(resolveFileMutationQueueKey(absolutePath, ops.resolveQueueKey, signal), async () => {
				assertFileToolNotAborted(signal);
				let editCount = 0;
				let expectedContent;
				try {
					await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
						assertCurrent();
						await ops.access(absolutePath);
					});
				} catch (error) {
					const errorMessage = error instanceof Error && "code" in error ? `Error code: ${String(error.code)}` : String(error);
					throw new Error(`Could not edit file: ${path}. ${errorMessage}.`, { cause: error });
				}
				const rawContent = decodeUtf8File(await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
					assertCurrent();
					return ops.readFile(absolutePath);
				}), absolutePath);
				try {
					assertFileToolNotAborted(signal);
					const plan = await planFileEdit({
						path,
						content: rawContent,
						edits: originalEdits
					}, signal);
					assertFileToolNotAborted(signal);
					if (!plan.changed) return textResult(plan.message, { changed: false });
					editCount = plan.editCount;
					expectedContent = plan.content;
					await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
						assertCurrent();
						await ops.writeFile(absolutePath, plan.content);
					});
					assertFileToolNotAborted(signal);
					if (!await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
						assertCurrent();
						return verifyPersistedUtf8File(absolutePath, plan.content, ops);
					})) throw new Error(`Edit verification failed for ${path}: the persisted regular file does not match the requested content. Inspect the target and retry.`);
					return textResult(`Successfully replaced ${editCount} block(s) in ${path}.`, {
						changed: true,
						...plan.receipt
					});
				} catch (error) {
					const normalizedError = error instanceof Error ? error : new Error(String(error));
					const currentContent = await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
						assertCurrent();
						return ops.readFile(absolutePath).then((current) => current.toString("utf-8")).catch(() => rawContent);
					});
					const recoveryContent = expectedContent;
					if (recoveryContent !== void 0 && await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
						assertCurrent();
						return verifyPersistedUtf8File(absolutePath, recoveryContent, ops);
					})) return textResult(`Successfully replaced ${editCount} block(s) in ${path}.`, {
						changed: true,
						diff: "",
						patch: ""
					});
					if (normalizedError.message.includes(EDIT_MISMATCH_MESSAGE)) throw appendMismatchHint(normalizedError, currentContent);
					throw normalizedError;
				}
			});
		}
	});
}
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
		const normalized = normalizeLiteralSubtreePath(pathname).toLowerCase();
		for (const subtree of state.excludedSubtrees) if (!subtree || normalized === subtree || normalized.startsWith(`${subtree}/`)) return true;
		return ignored;
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
		if (!lstatSync(ignorePath, { throwIfNoEntry: false })) continue;
		const content = readIgnoreFileContent(ignorePath);
		if (content === OVERSIZED_IGNORE_FILE) {
			addFailClosedSubtree(state, prefix);
			break;
		}
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
	const resolvedPath = realpathSync(ignorePath);
	try {
		const { buffer } = readRegularFileSync({
			filePath: resolvedPath,
			maxBytes: IGNORE_FILE_MAX_BYTES
		});
		return buffer.toString("utf-8");
	} catch (error) {
		if (hasNodeErrorCode(error, "too-large")) return OVERSIZED_IGNORE_FILE;
		throw error;
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
	const depthGlob = prefix && !anchored && !matchPattern.slice(0, -1).includes("/") ? "**/" : "";
	const prefixed = prefix ? `${prefix}${depthGlob}${normalized}` : pattern;
	return negated ? `!${prefixed}` : prefixed;
}
//#endregion
//#region src/agents/utils/syntax-highlight.ts
/**
* Highlight.js emits HTML spans; this module walks that small HTML subset and
* maps active scopes to caller-provided text formatters.
*/
let highlightJsRuntime;
function isHighlightJs(value) {
	return typeof value === "object" && value !== null && "getLanguage" in value && typeof value.getLanguage === "function" && "highlight" in value && typeof value.highlight === "function";
}
function loadHighlightJsRuntime() {
	if (highlightJsRuntime) return highlightJsRuntime;
	const runtime = createRequire(import.meta.url)("highlight.js");
	if (!isHighlightJs(runtime)) throw new TypeError("highlight.js did not expose the expected Node API");
	return highlightJsRuntime = runtime;
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
	for (const separator of [".", "-"]) {
		const index = scope.indexOf(separator);
		if (index !== -1) {
			const prefixFormatter = theme[scope.slice(0, index)];
			if (prefixFormatter) return prefixFormatter;
		}
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
function renderHighlightedHtml(html, theme) {
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
			scopes.pop();
			index += 7;
			continue;
		}
		textBuffer += html[index];
		index++;
	}
	flushText();
	return output;
}
/** Highlights code after the caller has selected a registered language. */
function highlight(code, language, theme) {
	const { value } = loadHighlightJsRuntime().highlight(code, {
		language,
		ignoreIllegals: true
	});
	return renderHighlightedHtml(value, theme);
}
function supportsLanguage(name) {
	return loadHighlightJsRuntime().getLanguage(name) !== void 0;
}
//#endregion
//#region src/agents/modes/interactive/theme/theme.ts
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
const BACKGROUND_COLOR_KEYS = [
	"selectedBg",
	"userMessageBg",
	"customMessageBg",
	"toolPendingBg",
	"toolSuccessBg",
	"toolErrorBg"
];
const THINKING_BORDER_COLORS = /* @__PURE__ */ new Map([
	["minimal", "thinkingMinimal"],
	["low", "thinkingLow"],
	["medium", "thinkingMedium"],
	["high", "thinkingHigh"],
	["xhigh", "thinkingXhigh"]
]);
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
function colorAnsi(color, mode, layer) {
	const code = layer === "fg" ? 38 : 48;
	if (color === "") return layer === "fg" ? "\x1B[39m" : "\x1B[49m";
	if (typeof color === "number") return `\x1b[${code};5;${color}m`;
	if (color.startsWith("#")) {
		const { r, g, b } = hexToRgb(color);
		return mode === "truecolor" ? `\x1b[${code};2;${r};${g};${b}m` : `\x1b[${code};5;${rgbTo256(r, g, b)}m`;
	}
	throw new Error(`Invalid color value: ${color}`);
}
function resolveVarRefs(value, vars, visited = /* @__PURE__ */ new Set()) {
	if (typeof value === "number" || value === "" || value.startsWith("#")) return value;
	if (visited.has(value)) throw new Error(`Circular variable reference detected: ${value}`);
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
		const color = THINKING_BORDER_COLORS.get(level) ?? "thinkingOff";
		return (str) => this.fg(color, str);
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
	const bgColorKeys = new Set(BACKGROUND_COLOR_KEYS);
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
const cliHighlightTheme = {
	keyword: (s) => interactiveAgentTheme.fg("syntaxKeyword", s),
	built_in: (s) => interactiveAgentTheme.fg("syntaxType", s),
	literal: (s) => interactiveAgentTheme.fg("syntaxNumber", s),
	number: (s) => interactiveAgentTheme.fg("syntaxNumber", s),
	string: (s) => interactiveAgentTheme.fg("syntaxString", s),
	comment: (s) => interactiveAgentTheme.fg("syntaxComment", s),
	function: (s) => interactiveAgentTheme.fg("syntaxFunction", s),
	title: (s) => interactiveAgentTheme.fg("syntaxFunction", s),
	class: (s) => interactiveAgentTheme.fg("syntaxType", s),
	type: (s) => interactiveAgentTheme.fg("syntaxType", s),
	attr: (s) => interactiveAgentTheme.fg("syntaxVariable", s),
	variable: (s) => interactiveAgentTheme.fg("syntaxVariable", s),
	params: (s) => interactiveAgentTheme.fg("syntaxVariable", s),
	operator: (s) => interactiveAgentTheme.fg("syntaxOperator", s),
	punctuation: (s) => interactiveAgentTheme.fg("syntaxPunctuation", s)
};
function highlightCode(code, lang) {
	const validLang = lang && supportsLanguage(lang) ? lang : void 0;
	if (!validLang) return code.split("\n").map((line) => interactiveAgentTheme.fg("mdCodeBlock", line));
	try {
		return highlight(code, validLang, cliHighlightTheme).split("\n");
	} catch {
		return code.split("\n");
	}
}
const EXTENSION_LANGUAGES = Object.fromEntries(Object.entries({
	typescript: ["ts", "tsx"],
	javascript: [
		"js",
		"jsx",
		"mjs",
		"cjs"
	],
	python: ["py"],
	ruby: ["rb"],
	rust: ["rs"],
	go: ["go"],
	java: ["java"],
	kotlin: ["kt"],
	swift: ["swift"],
	c: ["c", "h"],
	cpp: [
		"cpp",
		"cc",
		"cxx",
		"hpp"
	],
	csharp: ["cs"],
	php: ["php"],
	bash: [
		"sh",
		"bash",
		"zsh"
	],
	fish: ["fish"],
	powershell: ["ps1"],
	sql: ["sql"],
	html: ["html", "htm"],
	css: ["css"],
	scss: ["scss"],
	sass: ["sass"],
	less: ["less"],
	json: ["json"],
	yaml: ["yaml", "yml"],
	toml: ["toml"],
	xml: ["xml"],
	markdown: ["md", "markdown"],
	dockerfile: ["dockerfile"],
	makefile: ["makefile"],
	cmake: ["cmake"],
	lua: ["lua"],
	perl: ["perl"],
	r: ["r"],
	scala: ["scala"],
	clojure: ["clj"],
	elixir: ["ex", "exs"],
	erlang: ["erl"],
	haskell: ["hs"],
	ocaml: ["ml"],
	vim: ["vim"],
	graphql: ["graphql"],
	protobuf: ["proto"],
	hcl: ["tf", "hcl"]
}).flatMap(([language, extensions]) => extensions.map((extension) => [extension, language])));
function getLanguageFromPath(filePath) {
	const ext = filePath.split(".").pop()?.toLowerCase();
	return ext ? EXTENSION_LANGUAGES[ext] : void 0;
}
//#endregion
//#region src/agents/modes/interactive/components/keybinding-hints.ts
/**
* Utilities for formatting keybinding hints in the UI.
*/
function formatKeyPart(part) {
	return process.platform === "darwin" && part.toLowerCase() === "alt" ? "option" : part;
}
function keyText(keybinding) {
	return getKeybindings().getKeys(keybinding).join("/").replace(/[^+/]+/g, formatKeyPart);
}
function keyHint(keybinding, description) {
	return interactiveAgentTheme.fg("dim", keyText(keybinding)) + interactiveAgentTheme.fg("muted", ` ${description}`);
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
		if (resized.hint) hints.push(resized.hint);
		prepared = resized.image;
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
/** Returns null when the image processor cannot meet the inline dimensions and payload limit. */
async function resizeImage(img) {
	const inputBuffer = img.data;
	const inputBase64Size = 4 * Math.ceil(inputBuffer.byteLength / 3);
	const processor = createImageProcessor();
	try {
		const probe = await processor.probe(inputBuffer);
		if (!probe) return null;
		const { width: originalWidth, height: originalHeight } = orientedDimensions(probe);
		if (originalWidth <= MAX_IMAGE_WIDTH && originalHeight <= MAX_IMAGE_HEIGHT && inputBase64Size <= MAX_IMAGE_BASE64_BYTES) return { image: img };
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
			image: output,
			hint: output.resized ? `[Image: original ${originalWidth}x${originalHeight}, displayed at ${output.width}x${output.height}. Multiply coordinates by ${(originalWidth / output.width).toFixed(2)} to map to original image.]` : void 0
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/agents/utils/mime.ts
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
	return buffer.length >= 16 && readUint32(buffer, PNG_SIGNATURE.length, "big") === 13 && startsWithAscii(buffer, 12, "IHDR");
}
function isAnimatedPng(buffer) {
	let offset = PNG_SIGNATURE.length;
	while (offset + 8 <= buffer.length) {
		const chunkLength = readUint32(buffer, offset, "big");
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
	const declaredFileSize = readUint32(buffer, 2, "little");
	const pixelDataOffset = readUint32(buffer, 10, "little");
	const dibHeaderSize = readUint32(buffer, 14, "little");
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
function readUint32(buffer, offset, byteOrder) {
	let value = 0;
	for (let index = 0; index < 4; index++) {
		const shift = (byteOrder === "little" ? index : 3 - index) * 8;
		value += (buffer[offset + index] ?? 0) * 2 ** shift;
	}
	return value;
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
//#region src/agents/sessions/tools/limits.ts
/** Normalizes optional positive numeric limits to a finite integer. */
function normalizePositiveLimit(value, fallback) {
	return resolveIntegerOption(value, fallback, { min: 1 });
}
//#endregion
//#region src/agents/sessions/tools/read-file.ts
function requiresIsolatedRead(filePath) {
	const stateDir = resolveStateDir();
	if (isSqliteFilePath(filePath) || isPathInside(stateDir, filePath)) return true;
	const realPath = safeRealpathSync(filePath);
	return !realPath || isSqliteFilePath(realPath) || isPathInside(safeRealpathSync(stateDir) ?? stateDir, realPath) || statSync(realPath, { throwIfNoEntry: false })?.nlink !== 1;
}
async function readLocalFile(filePath, signal) {
	if (!requiresIsolatedRead(filePath)) return (await readRegularFile({ filePath })).buffer;
	const broker = getSpawnBroker();
	if (broker) return await broker.readFile(filePath, resolveCommandProcessSignal(signal));
	return await withCommandProcessScope(async () => {
		const result = await withChildProcessOperation("agent.file-read", () => runCommandBuffered([
			process.execPath,
			...resolveRuntimeWorkerArgv(resolveRuntimeProcessEntrypointUrl("fileToolRead")),
			filePath
		], {
			input: "",
			signal,
			maxOutputBytes: {
				stdout: Number.MAX_SAFE_INTEGER,
				stderr: 65536
			}
		}));
		if (result.code !== 0 || result.termination !== "exit") throw result.error ?? /* @__PURE__ */ new Error(`File read failed: ${result.termination}`);
		const reply = deserialize(result.stdout);
		if ("error" in reply) throw Object.assign(reply.error, { code: reply.code });
		return reply.buffer;
	}, signal);
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
	const truncatedBy = truncation.truncatedBy;
	if (!truncation.truncated || truncatedBy === null) return completeSelectedPage(truncation.content);
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
				truncated: true,
				truncatedBy,
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
//#region src/agents/sessions/tools/render-utils.ts
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
function replaceTabs(text) {
	return text.replace(/\t/g, "   ");
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
/** Formats the invalid-argument marker with the active theme. */
function invalidArgText(theme) {
	return theme.fg("error", "[invalid arg]");
}
//#endregion
//#region src/agents/sessions/tools/read.ts
function normalizeReadError(error, filePath) {
	if (hasErrnoCode(error, "EISDIR")) return /* @__PURE__ */ new Error(`Read requires a file path, but ${filePath} is a directory. List the directory, then read a specific file.`);
	return toErrorObject(error, "Non-Error rejection");
}
function regularFileReadError(filePath) {
	return /* @__PURE__ */ new Error(`Read only supports regular files; no read was attempted: ${filePath}`);
}
async function assertLocalReadableFile(filePath) {
	const stat = await stat$1(filePath);
	if (stat.isDirectory()) throw Object.assign(/* @__PURE__ */ new Error(`Read requires a file: ${filePath}`), { code: "EISDIR" });
	if (!stat.isFile()) throw regularFileReadError(filePath);
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
	readFile: readLocalFile,
	access: assertLocalReadableFile
};
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
	const lines = trimTrailingEmptyLines(lang ? highlightCode(replaceTabs(output), lang) : output.split("\n"));
	const maxLines = options.expanded ? lines.length : 10;
	const displayLines = lines.slice(0, maxLines);
	const remaining = lines.length - maxLines;
	let text = `\n${displayLines.map((line) => lang ? replaceTabs(line) : theme.fg("toolOutput", replaceTabs(line))).join("\n")}`;
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
		async execute(_toolCallId, { path, offset, limit, cursor = 0, optional }, signal, _onUpdate, ctx) {
			if (offset !== void 0 && (!Number.isSafeInteger(offset) || offset < 1)) throw new Error("Offset must be an integer at least 1");
			if (!Number.isSafeInteger(cursor) || cursor < 0) throw new Error("Cursor must be an integer at least 0");
			return await racePromiseWithAbortSignal(async () => {
				try {
					let absolutePath;
					let note;
					let buffer;
					try {
						const inputPathResolution = resolveReadToolInputPath(ops, path, cwd);
						const snapshot = await withFileMutationQueueKeysResolution(inputPathResolution.then(async (absoluteInputPath) => await Promise.all(getReadQueuePaths(absoluteInputPath).map(async (candidate) => await resolveFileMutationQueueKey(candidate, ops.resolveQueueKey, signal)))), async () => {
							const absoluteInputPath = await inputPathResolution;
							const resolved = await resolveReadToolPathFromAbsolute(ops, absoluteInputPath);
							assertFileToolNotAborted(signal);
							return {
								...resolved,
								buffer: await ops.readFile(resolved.absolutePath, signal)
							};
						});
						({absolutePath, note, buffer} = snapshot);
					} catch (error) {
						if (signal?.aborted || optional !== true || !hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "ENOTDIR")) throw error;
						return {
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
						};
					}
					const mimeType = await (ops.detectImageMimeType ? ops.detectImageMimeType(absolutePath, buffer) : detectSupportedImageMimeType(buffer));
					const attachment = mimeType ? void 0 : await classifyAttachmentBytes({ buffer });
					let content;
					let textDetails;
					const nonVisionImageNote = (options?.modelHasVision ?? ctx?.model?.input.includes("image")) === false ? "[Current model does not support images. The image will be omitted from this request.]" : void 0;
					if (attachment?.class === "document") content = [{
						type: "text",
						text: `Read did not return file contents because it detected a binary document [${attachment.mime ?? "unknown"}]. Use an available document parser or converter, or convert the file to text, Markdown, or CSV, then read the converted file.`
					}];
					else if (mimeType) {
						const processed = await processImage({
							data: Buffer.from(buffer),
							mimeType
						}, { autoResizeImages });
						const notes = processed.ok ? [`Read image file [${processed.image.mimeType}]`, ...processed.hints] : [`Read image file [${mimeType}]`, processed.message];
						if (nonVisionImageNote) notes.push(nonVisionImageNote);
						content = [{
							type: "text",
							text: notes.join("\n")
						}];
						if (processed.ok && !nonVisionImageNote) content.push(processed.image);
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
					assertFileToolNotAborted(signal);
					return {
						content,
						details: createReadToolDetails(content, textDetails)
					};
				} catch (error) {
					throw normalizeReadError(error, path);
				}
			}, signal, () => /* @__PURE__ */ new Error("Operation aborted"));
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
const defaultWriteOperations = {
	writeFile: (path, content) => writeFile(path, content, "utf-8"),
	mkdir: (dir) => mkdir(dir, { recursive: true }).then(() => {}),
	readFile: (path) => readFile(path),
	statFile: (path) => readPersistedFileStat(path, isMissingPathError)
};
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
	if (stat.size > 1048576) return {
		state: "unknown",
		beforeStat: stat
	};
	try {
		const originalContent = await ops.readFile(absolutePath);
		const originalBytes = Buffer.isBuffer(originalContent) ? originalContent : Buffer.from(originalContent, "utf8");
		const originalText = originalBytes.toString("utf8");
		if (Buffer.byteLength(originalText, "utf8") > 1048576) return {
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
	if (Buffer.byteLength(params.content, "utf8") > 1048576) {
		if (params.precheck.beforeStat === null) return {
			changed: true,
			created: true
		};
		return params.precheck.beforeStat ? {
			changed: true,
			created: false
		} : { changed: true };
	}
	const beforeStat = params.precheck.beforeStat;
	let beforeText = params.precheck.beforeText;
	if (beforeText === void 0 && !params.precheck.readAttempted && beforeStat?.type === "file" && beforeStat.size <= 1048576) {
		const originalContent = await params.ops.readFile(params.absolutePath).catch(() => void 0);
		const candidate = Buffer.isBuffer(originalContent) ? originalContent.toString("utf8") : originalContent;
		if (candidate !== void 0 && Buffer.byteLength(candidate, "utf8") <= 1048576) beforeText = candidate;
	}
	const created = beforeStat === null ? true : beforeStat ? false : void 0;
	const receipt = await planFileWriteDiff({
		path: params.path,
		content: params.content,
		beforeText,
		created
	}, params.signal);
	return {
		changed: true,
		...created === void 0 ? {} : { created },
		...receipt
	};
}
async function didWriteMetadataChange(absolutePath, beforeStat, ops) {
	if (!beforeStat) return false;
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
function createWriteTool(cwd, options) {
	const ops = options?.operations ?? defaultWriteOperations;
	const resolvePath = options?.operations ? resolveToCwd : resolveLocalPathToCwd;
	return wrapToolDefinition({
		name: "write",
		label: "write",
		description: "Write/overwrite file; creates parent directories.",
		parameters: writeSchema,
		outputSchema: WriteToolOutputSchema,
		async execute(_toolCallId, { path, content }, signal, _onUpdate, _ctx) {
			const assertCurrent = captureAgentToolSourceExecutionGuard();
			const absolutePath = resolvePath(path, cwd);
			const dir = dirname(absolutePath);
			return withFileMutationQueueKeyResolution(resolveFileMutationQueueKey(absolutePath, ops.resolveQueueKey, signal), async () => {
				const precheck = await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
					assertCurrent();
					return readOriginalWriteState(absolutePath, content, ops);
				});
				assertFileToolNotAborted(signal);
				if (precheck.state === "same") return textResult(`No changes made to ${path}. The file already has identical content.`, { changed: false });
				const details = await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
					assertCurrent();
					return resolveWriteDetails({
						absolutePath,
						content,
						ops,
						path,
						precheck,
						signal
					});
				});
				assertFileToolNotAborted(signal);
				try {
					await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
						assertCurrent();
						await ops.mkdir(dir);
					});
					assertFileToolNotAborted(signal);
					await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
						assertCurrent();
						await ops.writeFile(absolutePath, content);
					});
					assertFileToolNotAborted(signal);
					if (!await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
						assertCurrent();
						return verifyPersistedUtf8File(absolutePath, content, ops);
					})) throw new Error(`Write verification failed for ${path}: the persisted regular file does not match the requested content. Inspect the target and retry.`);
					return successfulWriteResult(path, content, details);
				} catch (error) {
					if (isWriteRecoveryCandidate(error, signal)) {
						const recovered = await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
							assertCurrent();
							return {
								verified: await verifyPersistedUtf8File(absolutePath, content, ops),
								changed: precheck.state === "different" || precheck.state === "unknown" && await didWriteMetadataChange(absolutePath, precheck.beforeStat, ops)
							};
						});
						if (recovered.verified && recovered.changed) return successfulWriteResult(path, content, details);
					}
					throw error;
				}
			});
		}
	});
}
//#endregion
export { normalizePositiveLimit as a, addIgnoreRules as c, createToolDefinitionFromAgentTool as d, wrapToolDefinition as f, decodeUtf8File as g, withFileMutationQueueKeysResolution as h, formatReadContinuationNotice as i, normalizeNativePathSeparators as l, resolveFileMutationQueueKey as m, createReadTool as n, interactiveAgentTheme as o, assertFileToolNotAborted as p, createBoundedReadTextPage as r, loadThemeFromPath as s, createWriteTool as t, createEditTool as u };
