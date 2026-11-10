import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as openRootFile } from "./boundary-file-read-CCth2Hwg.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { p as PROCESS_TOOL_DISPLAY_SUMMARY } from "./tool-catalog-DGlfxTaj.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { i as copyAgentToolMetadata, t as bindAgentToolActionDescriptor } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { r as captureAgentToolSourceExecutionGuard, s as runWithAgentToolSourceExecutionScope } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import { n as isToolResultError } from "./tool-result-error-IpvGgAny.mjs";
import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-sFz3TNTx.mjs";
import { r as resolveSkillFileHost } from "./skill-file-host-d_CtoZp0.mjs";
import { n as resolveSkillReadPath, r as resolveWorkspaceSkillSourcePath } from "./workspace-skill-read-path-Jvbv8xxW.mjs";
import { a as resolveToolResultBudget, s as toolResultFitsBudget } from "./tool-result-limits-tYfGdUlb.mjs";
import { a as markHostRootEscape, i as isPathBoundaryEscapeError, n as assertSandboxPath, r as isHostRootEscapeError } from "./sandbox-paths-CgSBSdCM.mjs";
import { a as toRelativeSandboxPath, i as resolveSandboxPathMapping, n as relativePathInsideSandboxRoot, r as resolvePathFromInput, t as preserveAtPrefixedRelativePath } from "./path-policy-Llwd1FHK.mjs";
import { s as normalizeFileToolPathParam } from "./agent-tools.before-tool-call.decision-DlE5PesW.mjs";
import { i as toDisplayPath, r as resolveApplyPatchInputPath } from "./apply-patch-paths-gKkcG5qn.mjs";
import { t as ProcessToolOutputSchema } from "./bash-tools.process-schema-Bj9Dor0l.mjs";
import { r as describeProcessTool } from "./bash-tools.descriptions-Cf_AKbJ6.mjs";
import { a as resolveToCwd, i as resolveLocalPathToCwd } from "./path-utils-Bn-ftvxY.mjs";
import { _ as writeHostFile, a as createOpenClawReadTool, c as createSandboxedWriteTool, d as wrapReadToolWithSkillContent, f as wrapSandboxFileToolPath, g as withMemoryWriteProvenance, i as createHostWorkspaceWriteTool, m as wrapToolWorkspaceRootGuardWithOptions, o as createSandboxedEditTool, p as wrapToolMemoryFlushAppendOnlyWrite, r as createHostWorkspaceEditTool, s as createSandboxedReadTool, u as resolveAdaptiveReadMaxBytes } from "./secrets-tool-vT5mBKZ0.mjs";
import { r as resolveSandboxFileMutationQueueKey } from "./file-mutation-identity-C_-O-u-P.mjs";
import { a as normalizePositiveLimit, f as wrapToolDefinition, g as decodeUtf8File, h as withFileMutationQueueKeysResolution, m as resolveFileMutationQueueKey, n as createReadTool, p as assertFileToolNotAborted } from "./tools-CsYUPwyX.mjs";
import { a as lsSchema } from "./tool-schemas-B1hOiDDb.mjs";
import "./truncate-DH9KX6o6.mjs";
import { n as withToolOperatorHint } from "./tool-operator-hint-DykmqkRV.mjs";
import { s as processSchema } from "./exec-tool-timeout-nIvSSNNO.mjs";
import { t as createLazyExecTool } from "./lazy-exec-tool-6rMYuHYl.mjs";
import { r as resolveReadOnlyWorkspaceSkillMounts } from "./workspace-mounts-DWoMJ-OS.mjs";
import { t as buildSandboxFsMounts } from "./fs-paths-ClIQPp0W.mjs";
import fs from "node:fs";
import fs$1, { readdir } from "node:fs/promises";
import path from "node:path";
import { PATH_ALIAS_POLICIES } from "@openclaw/fs-safe/advanced";
import { Type } from "typebox";
//#region src/agents/agent-tools.message-provider-policy.ts
/**
* Message-provider tool filtering.
* Channels can restrict tool names after runtime assembly when the active
* transport cannot safely render or execute a class of tools.
*/
const TOOL_DENY_BY_MESSAGE_PROVIDER = {
	"discord-voice": ["tts"],
	voice: ["tts"]
};
const TOOL_ALLOW_BY_MESSAGE_PROVIDER = { node: [
	"canvas",
	"pdf",
	"tts",
	"view_image",
	"web_fetch",
	"web_search"
] };
/**
* True when a provider's allowlist removes the tool by design rather than by an
* operator's policy. Callers that diagnose a missing tool use this to stay quiet about
* transports that were never meant to carry it.
*/
function messageProviderExcludesTool(messageProvider, toolName) {
	const normalizedProvider = normalizeOptionalLowercaseString(messageProvider);
	if (!normalizedProvider) return false;
	const allowedTools = TOOL_ALLOW_BY_MESSAGE_PROVIDER[normalizedProvider];
	return allowedTools !== void 0 && allowedTools.length > 0 && !allowedTools.includes(toolName);
}
/** Applies message-provider filtering while preserving duplicate tool entries. */
function filterToolsByMessageProvider(tools, messageProvider) {
	const normalizedProvider = normalizeOptionalLowercaseString(messageProvider);
	if (!normalizedProvider) return [...tools];
	const allowedTools = TOOL_ALLOW_BY_MESSAGE_PROVIDER[normalizedProvider];
	if (allowedTools && allowedTools.length > 0) {
		const allowedSet = new Set(allowedTools);
		return tools.filter((tool) => allowedSet.has(tool.name));
	}
	const deniedTools = TOOL_DENY_BY_MESSAGE_PROVIDER[normalizedProvider];
	if (!deniedTools || deniedTools.length === 0) return [...tools];
	const deniedSet = new Set(deniedTools);
	return tools.filter((tool) => !deniedSet.has(tool.name));
}
//#endregion
//#region src/agents/agent-tools.memory-flush.ts
/** Validate the memory trigger's persistence arm and expose its plugin identity. */
function resolveMemoryFlushToolSetup(options) {
	const isMemoryFlushRun = options?.trigger === "memory";
	if (isMemoryFlushRun && !options?.memoryFlushWritePath && !options?.memoryFlushTools) throw new Error("Memory flush requires memoryFlushWritePath or memoryFlushTools");
	return {
		isMemoryFlushRun,
		memoryFlushWritePath: isMemoryFlushRun ? options.memoryFlushWritePath : void 0,
		memoryFlush: isMemoryFlushRun && options?.memoryFlushTools ? { flushId: options.memoryFlushTools.flushId } : void 0
	};
}
/** Warn when policy removes the append-only writer from a file-arm flush. */
function warnIfMemoryFlushFileWriterUnavailable(params) {
	if (params.relativePath && !params.tools.some((tool) => tool.name === "write") && !messageProviderExcludesTool(params.messageProvider, "write")) logWarn(`memory flush cannot persist ${params.relativePath}: no write tool survived this agent's tool policy, so this run will not save anything.`);
}
/** A pre-inference skip when the provider has no authorized persistence tool. */
var MemoryFlushToolsUnavailableError = class extends Error {
	constructor(missingToolNames) {
		const names = missingToolNames.length > 0 ? missingToolNames.join(", ") : "<none declared>";
		super(`memory flush skipped: no declared persistence tool survived policy (${names})`);
		this.missingToolNames = missingToolNames;
		this.name = "MemoryFlushToolsUnavailableError";
		recordModelFallbackStop(this);
	}
};
function wrapPersistenceTool(tool, recordPersistenceToolSuccess) {
	return copyAgentToolMetadata(tool, {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			const result = await tool.execute(toolCallId, params, signal, onUpdate);
			if (!isToolResultError(result) && !("isError" in result && result.isError === true)) recordPersistenceToolSuccess();
			return result;
		}
	});
}
/** Project a memory flush onto its file writer or selected provider-owned persistence tools. */
function projectMemoryFlushTools(tools, projection) {
	if (!projection) return tools;
	if ("persistenceToolNames" in projection) {
		const persistenceNames = new Set(projection.persistenceToolNames);
		const lookupNames = new Set(projection.lookupToolNames ?? []);
		return tools.flatMap((tool) => {
			if (tool.name === "read") return [tool];
			if (getPluginToolMeta(tool)?.pluginId !== projection.ownerPluginId) return [];
			if (persistenceNames.has(tool.name)) return [wrapPersistenceTool(tool, projection.recordPersistenceToolSuccess)];
			return lookupNames.has(tool.name) ? [tool] : [];
		});
	}
	return tools.flatMap((tool) => {
		if (tool.name === "read") return [tool];
		return tool.name === "write" ? [wrapToolMemoryFlushAppendOnlyWrite(tool, projection)] : [];
	});
}
/** Reject a tools-arm flush before inference when policy removed every declared writer. */
function assertMemoryFlushPersistenceToolAvailable(tools, context) {
	if (!context) return;
	const availableNames = new Set(tools.filter((tool) => getPluginToolMeta(tool)?.pluginId === context.ownerPluginId).map((tool) => tool.name));
	const isPersistenceToolAvailable = (name) => name !== "read" && availableNames.has(name);
	if (!context.persistenceToolNames.some(isPersistenceToolAvailable)) throw new MemoryFlushToolsUnavailableError(context.persistenceToolNames.filter((name) => !isPersistenceToolAvailable(name)));
	const missingNames = [...new Set((context.lookupToolNames ?? []).filter((name) => !availableNames.has(name)))];
	if (missingNames.length > 0) logWarn(`plugin "${context.ownerPluginId}" flush cannot check for existing memory: ${missingNames.join(", ")} did not survive this agent's tool policy.`);
}
//#endregion
//#region src/agents/apply-patch-containment-hint.ts
/**
* Operator-facing remediation for apply_patch workspace containment.
*
* Which control imposed the boundary decides which remedy is true, so the runtime owner
* names its own source rather than the tool guessing from configuration it cannot see.
*/
const HINTS = {
	"required-root": "apply_patch is contained by this run's required workspace root. Full session permission mode and workspaceOnly configuration settings do not lift this boundary. Keep patch paths within the required root.",
	config: "apply_patch is workspace-contained by configuration. Both tools.exec.applyPatch.workspaceOnly (default true) and tools.fs.workspaceOnly impose this independently, so clearing one can leave the other in force. tools.exec.mode does not affect it.",
	session: "apply_patch is workspace-contained by this session's permission mode. Only a full permission mode lifts it; configuration settings do not override a session mode."
};
/**
* Name the control that contained this write, for the operator log only. Applies to host
* workspace-root rejections; sandbox bridges enforce their own mount boundary, report it in
* their own message, and are left untouched because host controls cannot lift a mount.
*/
function withApplyPatchContainmentHint(error, source) {
	return source && isHostRootEscapeError(error) ? withToolOperatorHint(error, HINTS[source]) : error;
}
//#endregion
//#region src/agents/apply-patch-file-ops.ts
async function createPatchTarget(params) {
	if (await params.ops.createFileExclusive(params.target.resolved, params.contents) === "exists") throw new Error(`Cannot create ${params.target.display}: the file already exists. ${params.hint}`);
}
async function resolvePatchFileOps(options) {
	const assertCurrent = captureAgentToolSourceExecutionGuard(options.signal);
	if (options.sandbox) {
		const { root, bridge } = options.sandbox;
		return withPatchMemoryWriteProvenance(options.memoryWriteProvenance, {
			readFile: (filePath) => runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				const buf = await bridge.readFile({
					filePath,
					cwd: root
				});
				assertCurrent();
				return decodeUtf8File(buf, filePath);
			}),
			writeFile: (filePath, content) => runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				assertCurrent();
				await bridge.writeFile({
					filePath,
					cwd: root,
					data: content,
					signal: options.signal
				});
			}),
			createFileExclusive: (filePath, content) => runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				if (!bridge.createFileExclusive) throw new Error("Sandbox filesystem bridge does not support atomic file creation; refusing to overwrite an existing path.");
				assertCurrent();
				return await bridge.createFileExclusive({
					filePath,
					cwd: root,
					data: content,
					signal: options.signal
				});
			}),
			remove: (filePath) => runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				assertCurrent();
				await bridge.remove({
					filePath,
					cwd: root,
					force: false,
					signal: options.signal
				});
			}),
			mkdirp: (dir) => runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				assertCurrent();
				await bridge.mkdirp({
					filePath: dir,
					cwd: root,
					signal: options.signal
				});
			})
		});
	}
	if (options.workspaceOnly === false) return withPatchMemoryWriteProvenance(options.memoryWriteProvenance, {
		readFile: (filePath) => runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
			const buffer = await fs$1.readFile(filePath);
			assertCurrent();
			return decodeUtf8File(buffer, filePath);
		}),
		writeFile: async (filePath, content) => {
			await writeHostFile(filePath, content, options.signal);
		},
		createFileExclusive: async (filePath, content) => {
			try {
				await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
					assertCurrent();
					await fs$1.writeFile(filePath, content, {
						encoding: "utf8",
						flag: "wx"
					});
				});
				return "created";
			} catch (error) {
				if (error.code === "EEXIST") return "exists";
				throw error;
			}
		},
		remove: (filePath) => runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
			assertCurrent();
			await fs$1.rm(filePath);
		}),
		mkdirp: async (dir) => {
			await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				assertCurrent();
				await fs$1.mkdir(dir, { recursive: true });
			});
		}
	});
	const containmentRoot = options.root ?? options.cwd;
	const root$1 = await root(containmentRoot, { assertBeforeMutation: assertCurrent });
	const toRootPath = (filePath) => path.resolve(root$1.rootReal, toRelativeSandboxPath(root$1.rootDir, filePath));
	return withPatchMemoryWriteProvenance(options.memoryWriteProvenance, {
		readFile: (filePath) => runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
			const opened = await openRootFile({
				absolutePath: filePath,
				rootPath: containmentRoot,
				boundaryLabel: "workspace root",
				symlinks: "follow-parents-within-root"
			});
			assertBoundaryRead(opened, filePath);
			try {
				assertCurrent();
				return decodeUtf8File(fs.readFileSync(opened.fd), filePath);
			} finally {
				fs.closeSync(opened.fd);
			}
		}),
		writeFile: async (filePath, content) => {
			await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				assertCurrent();
				await root$1.write(toRootPath(filePath), content, {
					encoding: "utf8",
					mutationSymlinks: "follow-parents-within-root"
				}).catch(rethrowHostMutationError);
			});
		},
		createFileExclusive: async (filePath, content) => {
			try {
				await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
					assertCurrent();
					await root$1.create(toRootPath(filePath), content, {
						encoding: "utf8",
						mutationSymlinks: "reject"
					});
				});
				return "created";
			} catch (error) {
				if (error instanceof FsSafeError && error.code === "already-exists") return "exists";
				return rethrowHostMutationError(error);
			}
		},
		remove: async (filePath) => {
			await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				assertCurrent();
				await root$1.remove(`./${toRelativeSandboxPath(root$1.rootDir, filePath)}`).catch(rethrowHostMutationError);
			});
		}
	});
}
function rethrowHostMutationError(error) {
	if (error instanceof FsSafeError && (error.code === "outside-workspace" || error.code === "path-alias" && error.cause instanceof Error && /^(?:Path escapes|Path resolves outside|Symlink escapes) root \(/.test(error.cause.message))) markHostRootEscape(error);
	throw error;
}
var PatchCreateExistsSignal = class extends Error {};
function withPatchMemoryWriteProvenance(observer, operations) {
	const observedOperations = withMemoryWriteProvenance(operations, observer);
	if (!observer) return observedOperations;
	return {
		...observedOperations,
		createFileExclusive: async (filePath, content) => {
			if (!await observer.classifies(filePath)) return operations.createFileExclusive(filePath, content);
			try {
				await observer.write({
					absolutePath: filePath,
					contentBefore: "",
					contentAfter: content,
					commit: async () => {
						if (await operations.createFileExclusive(filePath, content) === "exists") throw new PatchCreateExistsSignal();
					}
				});
				return "created";
			} catch (error) {
				if (error instanceof PatchCreateExistsSignal) return "exists";
				throw error;
			}
		}
	};
}
function assertBoundaryRead(opened, targetPath) {
	if (opened.ok) return;
	const reason = opened.reason === "validation" ? "unsafe path" : "path not found";
	const error = /* @__PURE__ */ new Error(`Failed boundary read for ${targetPath} (${reason})`);
	const sourceCode = opened.error && typeof opened.error === "object" && "code" in opened.error ? opened.error.code : void 0;
	if (sourceCode === "ENOENT" || sourceCode === "ENOTDIR") error.code = sourceCode;
	if (opened.reason === "validation" && (opened.error instanceof FsSafeError && opened.error.code === "outside-workspace" || isPathBoundaryEscapeError(opened.error, "workspace root"))) markHostRootEscape(error);
	throw error;
}
//#endregion
//#region src/agents/apply-patch-parse.ts
const BEGIN_PATCH_MARKER = "*** Begin Patch";
const END_PATCH_MARKER = "*** End Patch";
const ADD_FILE_MARKER = "*** Add File: ";
const DELETE_FILE_MARKER = "*** Delete File: ";
const UPDATE_FILE_MARKER = "*** Update File: ";
const MOVE_TO_MARKER = "*** Move to: ";
const EOF_MARKER = "*** End of File";
const CHANGE_CONTEXT_MARKER = "@@ ";
const EMPTY_CHANGE_CONTEXT_MARKER = "@@";
function parsePatchText(input) {
	const trimmed = input.trim();
	if (!trimmed) throw new ToolInputError("Invalid patch: input is empty.");
	const lines = checkPatchBoundaries(trimmed.split(/\r?\n/)).slice(1, -1);
	const hunks = [];
	for (let offset = 0; offset < lines.length;) {
		const { hunk, consumed } = parseOneHunk(lines.slice(offset), offset + 2);
		hunks.push(hunk);
		offset += consumed;
	}
	return hunks;
}
function checkPatchBoundaries(inputLines) {
	const first = inputLines[0];
	const last = inputLines.at(-1);
	const lines = inputLines.length >= 4 && last && (first === "<<EOF" || first === "<<'EOF'" || first === "<<\"EOF\"") && last.endsWith("EOF") ? inputLines.slice(1, -1) : inputLines;
	if (lines[0]?.trim() !== BEGIN_PATCH_MARKER) throw new ToolInputError("The first line of the patch must be '*** Begin Patch'");
	if (lines.at(-1)?.trim() !== END_PATCH_MARKER) throw new ToolInputError("The last line of the patch must be '*** End Patch'");
	return lines;
}
function parseOneHunk(lines, lineNumber) {
	const firstLine = lines[0].trim();
	if (firstLine.startsWith(ADD_FILE_MARKER)) {
		const targetPath = firstLine.slice(14);
		let contents = "";
		let consumed = 1;
		for (const addLine of lines.slice(1)) if (addLine.startsWith("+")) {
			contents += `${addLine.slice(1)}\n`;
			consumed += 1;
		} else break;
		return {
			hunk: {
				kind: "add",
				path: targetPath,
				contents
			},
			consumed
		};
	}
	if (firstLine.startsWith(DELETE_FILE_MARKER)) return {
		hunk: {
			kind: "delete",
			path: firstLine.slice(17)
		},
		consumed: 1
	};
	if (firstLine.startsWith(UPDATE_FILE_MARKER)) {
		const targetPath = firstLine.slice(17);
		let consumed = 1;
		let movePath;
		const moveCandidate = lines[consumed]?.trim();
		if (moveCandidate?.startsWith(MOVE_TO_MARKER)) {
			movePath = moveCandidate.slice(13);
			consumed += 1;
		}
		const chunks = [];
		while (consumed < lines.length) {
			const firstRemaining = lines[consumed];
			if (firstRemaining.trim() === "") {
				consumed += 1;
				continue;
			}
			if (firstRemaining.startsWith("***")) break;
			const { chunk, consumed: chunkLines } = parseUpdateFileChunk(lines.slice(consumed), lineNumber + consumed, chunks.length === 0);
			chunks.push(chunk);
			consumed += chunkLines;
		}
		if (chunks.length === 0) throw new ToolInputError(`Invalid patch hunk at line ${lineNumber}: Update file hunk for path '${targetPath}' is empty`);
		return {
			hunk: {
				kind: "update",
				path: targetPath,
				movePath,
				chunks
			},
			consumed
		};
	}
	throw new ToolInputError(`Invalid patch hunk at line ${lineNumber}: '${lines[0]}' is not a valid hunk header. Valid hunk headers: '*** Add File: {path}', '*** Delete File: {path}', '*** Update File: {path}'`);
}
function parseUpdateFileChunk(lines, lineNumber, allowMissingContext) {
	let changeContext;
	let startIndex = 0;
	const firstLine = lines.at(0);
	if (firstLine === EMPTY_CHANGE_CONTEXT_MARKER) startIndex = 1;
	else if (firstLine?.startsWith(CHANGE_CONTEXT_MARKER)) {
		changeContext = firstLine.slice(3);
		startIndex = 1;
	} else if (!allowMissingContext) throw new ToolInputError(`Invalid patch hunk at line ${lineNumber}: Expected update hunk to start with a @@ context marker, got: '${firstLine}'`);
	if (startIndex >= lines.length || lines[startIndex] === EOF_MARKER) throw new ToolInputError(`Invalid patch hunk at line ${lineNumber + 1}: Update hunk does not contain any lines`);
	const chunk = {
		changeContext,
		oldLines: [],
		newLines: [],
		contextOldIndexes: [],
		isEndOfFile: false
	};
	let parsedLines = 0;
	for (const line of lines.slice(startIndex)) {
		if (line === EOF_MARKER) {
			chunk.isEndOfFile = true;
			parsedLines += 1;
			break;
		}
		const marker = line[0];
		if (!marker || marker === " " || marker === "+" || marker === "-") {
			const content = line.slice(1);
			if (marker !== "-") {
				chunk.contextOldIndexes.push(marker === "+" ? void 0 : chunk.oldLines.length);
				chunk.newLines.push(content);
			}
			if (marker !== "+") chunk.oldLines.push(content);
			parsedLines += 1;
			continue;
		}
		if (parsedLines === 0) throw new ToolInputError(`Invalid patch hunk at line ${lineNumber + 1}: Unexpected line found in update hunk: '${line}'. Every line should start with ' ' (context line), '+' (added line), or '-' (removed line)`);
		break;
	}
	return {
		chunk,
		consumed: parsedLines + startIndex
	};
}
//#endregion
//#region src/agents/apply-patch-update.ts
/**
* Update-hunk application for the apply_patch parser.
* Locates expected old lines with tolerant matching, applies chunks in order,
* and retains source bytes that the patch does not change.
*/
const DASH_PUNCTUATION = /[\u2010-\u2015\u2212]/g;
const SINGLE_QUOTE_PUNCTUATION = /[\u2018-\u201B]/g;
const DOUBLE_QUOTE_PUNCTUATION = /[\u201C-\u201F]/g;
const SPACE_PUNCTUATION = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;
/** Apply parsed update chunks to one file and return the new file contents. */
async function applyUpdateHunk(filePath, chunks, options) {
	const source = parseSourceFile(await (options?.readFile ?? ((target) => fs$1.readFile(target, "utf8")))(filePath).catch((err) => {
		throw new Error(`Failed to read file to update ${filePath}: ${formatErrorMessage(err)}`);
	}));
	const replacements = computeReplacements(source, filePath, chunks);
	const newLines = applyReplacements(source.lines, replacements);
	ensureInteriorEndings(newLines, source.preferredEnding);
	return source.bom + newLines.map((line) => line.text + line.ending).join("");
}
function computeReplacements(source, filePath, chunks) {
	const originalLines = source.lines.map((line) => line.text);
	const replacements = [];
	let lineIndex = 0;
	for (const chunk of chunks) {
		if (chunk.changeContext) {
			const contextSearch = seekSequence(originalLines, [chunk.changeContext], lineIndex, false);
			if (contextSearch.kind === "ambiguous") throw new Error(`Found ${contextSearch.occurrences} occurrences of context '${chunk.changeContext}' in ${filePath}. The context must be unique; use a more specific @@ context line.`);
			if (contextSearch.kind === "missing") throw new Error(`Failed to find context '${chunk.changeContext}' in ${filePath}`);
			lineIndex = contextSearch.index + 1;
		}
		if (chunk.oldLines.length === 0) {
			const insertionIndex = chunk.changeContext && !chunk.isEndOfFile ? lineIndex : source.lines.length;
			const insertedLines = buildChangedLines({
				sourceLines: source.lines,
				startIndex: insertionIndex,
				oldCount: 0,
				newLines: chunk.newLines,
				preferredEnding: source.preferredEnding
			});
			const finalInsertedLine = insertedLines.at(-1);
			if (source.missingFinalEnding && insertionIndex === source.lines.length && finalInsertedLine) finalInsertedLine.ending = "";
			replacements.push([
				insertionIndex,
				0,
				insertedLines
			]);
			lineIndex = insertionIndex;
			continue;
		}
		let pattern = chunk.oldLines;
		let newSlice = chunk.newLines;
		let search = seekSequence(originalLines, pattern, lineIndex, chunk.isEndOfFile);
		if (search.kind === "missing" && pattern[pattern.length - 1] === "") {
			pattern = pattern.slice(0, -1);
			if (newSlice.length > 0 && newSlice[newSlice.length - 1] === "") newSlice = newSlice.slice(0, -1);
			search = seekSequence(originalLines, pattern, lineIndex, chunk.isEndOfFile);
		}
		if (search.kind === "ambiguous") throw new Error(`Found ${search.occurrences} occurrences of these lines in ${filePath}. The lines must be unique; include more surrounding lines in the hunk:\n${chunk.oldLines.join("\n")}`);
		if (search.kind === "missing") throw new Error(`Failed to find expected lines in ${filePath}:\n${chunk.oldLines.join("\n")}`);
		const found = search.index;
		replacements.push([
			found,
			pattern.length,
			buildChunkLines({
				source,
				matchIndex: found,
				pattern,
				newSlice,
				contextOldIndexes: chunk.contextOldIndexes
			})
		]);
		lineIndex = found + pattern.length;
	}
	replacements.sort((a, b) => a[0] - b[0]);
	return replacements;
}
function buildChunkLines(params) {
	const { source, matchIndex, pattern, newSlice, contextOldIndexes } = params;
	const lines = [];
	let oldStart = 0;
	let newStart = 0;
	for (const [newContext, oldContext] of contextOldIndexes.entries()) {
		if (oldContext === void 0 || oldContext >= pattern.length || newContext >= newSlice.length) continue;
		appendLines(lines, buildChangedLines({
			sourceLines: source.lines,
			startIndex: matchIndex + oldStart,
			oldCount: oldContext - oldStart,
			newLines: newSlice.slice(newStart, newContext),
			preferredEnding: source.preferredEnding
		}));
		lines.push(source.lines[matchIndex + oldContext]);
		oldStart = oldContext + 1;
		newStart = newContext + 1;
	}
	appendLines(lines, buildChangedLines({
		sourceLines: source.lines,
		startIndex: matchIndex + oldStart,
		oldCount: pattern.length - oldStart,
		newLines: newSlice.slice(newStart),
		preferredEnding: source.preferredEnding
	}));
	return lines;
}
function appendLines(target, items) {
	for (const item of items) target.push(item);
}
function buildChangedLines(params) {
	const { sourceLines, startIndex, oldCount, newLines, preferredEnding } = params;
	const replacedLines = sourceLines.slice(startIndex, startIndex + oldCount);
	const nearbyEnding = replacedLines.find((line) => line.ending)?.ending || sourceLines.at(startIndex)?.ending || sourceLines.at(startIndex - 1)?.ending || preferredEnding;
	return newLines.map((text, index) => {
		let ending = nearbyEnding;
		if (replacedLines.length === newLines.length) ending = replacedLines.at(index)?.ending ?? nearbyEnding;
		else if (index === newLines.length - 1 && replacedLines.length > 0) ending = replacedLines.at(-1)?.ending ?? nearbyEnding;
		else if (index < replacedLines.length - 1) ending = replacedLines.at(index)?.ending ?? nearbyEnding;
		return {
			text,
			ending
		};
	});
}
function applyReplacements(lines, replacements) {
	let result = lines;
	for (const [startIndex, oldLen, newLines] of replacements.toReversed()) result = result.slice(0, startIndex).concat(newLines, result.slice(startIndex + oldLen));
	return result;
}
function parseSourceFile(contents) {
	const bom = contents.startsWith("﻿") ? "﻿" : "";
	const lines = ((bom ? contents.slice(1) : contents).match(/[^\r\n]*(?:\r\n|\r|\n)|[^\r\n]+/g) ?? []).map(splitLineEnding);
	return {
		bom,
		lines,
		preferredEnding: lines.find((line) => line.ending)?.ending || "\n",
		missingFinalEnding: lines.length > 0 && lines.at(-1)?.ending === ""
	};
}
function splitLineEnding(line) {
	for (const ending of [
		"\r\n",
		"\r",
		"\n"
	]) if (line.endsWith(ending)) return {
		text: line.slice(0, -ending.length),
		ending
	};
	return {
		text: line,
		ending: ""
	};
}
function ensureInteriorEndings(lines, preferredEnding) {
	for (const line of lines.slice(0, -1)) line.ending ||= preferredEnding;
}
function seekSequence(lines, pattern, start, eof) {
	if (pattern.length === 0) return {
		kind: "found",
		index: start
	};
	if (pattern.length > lines.length) return { kind: "missing" };
	const maxStart = lines.length - pattern.length;
	const searchStart = eof ? Math.max(start, maxStart) : start;
	if (searchStart > maxStart) return { kind: "missing" };
	const normalizers = [
		(value) => value,
		(value) => value.trimEnd(),
		(value) => value.trim(),
		(value) => normalizePunctuation(value.trim())
	];
	for (const normalize of normalizers) {
		let index = null;
		let occurrences = 0;
		for (let i = searchStart; i <= maxStart; i += 1) if (linesMatch(lines, pattern, i, normalize)) {
			index ??= i;
			occurrences += 1;
		}
		if (index !== null) return occurrences === 1 ? {
			kind: "found",
			index
		} : {
			kind: "ambiguous",
			occurrences
		};
	}
	return { kind: "missing" };
}
function linesMatch(lines, pattern, start, normalize) {
	for (let idx = 0; idx < pattern.length; idx += 1) {
		const line = lines.at(start + idx);
		const expected = pattern.at(idx);
		if (line === void 0 || expected === void 0 || normalize(line) !== normalize(expected)) return false;
	}
	return true;
}
function normalizePunctuation(value) {
	return value.replace(DASH_PUNCTUATION, "-").replace(SINGLE_QUOTE_PUNCTUATION, "'").replace(DOUBLE_QUOTE_PUNCTUATION, "\"").replace(SPACE_PUNCTUATION, " ");
}
//#endregion
//#region src/agents/apply-patch.ts
function normalizeUpdateComparison(content) {
	const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	if (normalized.length === 0 || normalized.endsWith("\n")) return normalized;
	return `${normalized}\n`;
}
const applyPatchSchema = Type.Object({ input: Type.String({ description: "Patch content using the *** Begin Patch/End Patch format." }) });
const ApplyPatchToolOutputSchema = Type.Object({ summary: Type.Object({
	added: Type.Array(Type.String()),
	modified: Type.Array(Type.String()),
	deleted: Type.Array(Type.String())
}, { additionalProperties: false }) }, { additionalProperties: false });
/** Create the agent tool wrapper for applying patch-envelope input. */
function createApplyPatchTool(options = {}) {
	const cwd = options.cwd ?? process.cwd();
	const root = options.root ?? cwd;
	const sandbox = options.sandbox;
	const workspaceOnly = options.workspaceOnly !== false;
	return {
		name: "apply_patch",
		label: "apply_patch",
		description: "Patch one/many files. Input requires *** Begin Patch and *** End Patch.",
		parameters: applyPatchSchema,
		outputSchema: ApplyPatchToolOutputSchema,
		execute: async (_toolCallId, args, signal) => {
			const executionSignal = options.abortSignal ? AbortSignal.any(signal ? [signal, options.abortSignal] : [options.abortSignal]) : signal;
			const params = args;
			const input = typeof params.input === "string" ? params.input : "";
			if (!input.trim()) throw new ToolInputError("Provide a patch input.");
			if (executionSignal?.aborted) throw createAbortError("Aborted");
			let result;
			try {
				result = await applyPatch(input, {
					cwd,
					root,
					sandbox,
					workspaceOnly,
					memoryWriteProvenance: options.memoryWriteProvenance,
					signal: executionSignal
				});
			} catch (error) {
				throw withApplyPatchContainmentHint(error, workspaceOnly ? options.containmentSource : void 0);
			}
			return {
				content: [{
					type: "text",
					text: result.text
				}],
				details: { summary: result.summary }
			};
		}
	};
}
/** Parse and apply a patch envelope to the configured filesystem target. */
async function applyPatch(input, options) {
	const parsedHunks = parsePatchText(input);
	if (parsedHunks.length === 0) throw new ToolInputError("No files were modified.");
	const patchOptions = {
		...options,
		patchInputPaths: await resolvePatchInputPaths(parsedHunks, options)
	};
	const resolution = resolvePatchHunks(parsedHunks, patchOptions);
	return await withFileMutationQueueKeysResolution(resolution.then((hunks) => hunks.flatMap(({ keys }) => keys)), async () => {
		const hunks = await resolution;
		const fileOps = await resolvePatchFileOps(patchOptions);
		await preflightUpdateHunks(hunks, fileOps, patchOptions.signal);
		return await commitPatchHunks(hunks, fileOps, patchOptions);
	});
}
async function resolvePatchHunks(hunks, options) {
	const resolved = [];
	const unlinked = [];
	for (const hunk of hunks) {
		throwIfPatchAborted(options.signal);
		if (hunk.kind === "delete") {
			const target = await resolveOrderedPatchPath(hunk.path, options, unlinked, PATH_ALIAS_POLICIES.unlinkTarget);
			const removed = target.removed && (target.removed.link || target.readmit) ? target.removed : await resolveUnlinkedPath(hunk.path, target.target, target.stage, options);
			unlinked.push(removed);
			resolved.push({
				hunk,
				target: target.target,
				stage: removed.stage,
				keys: [...target.keys, removed.key],
				removesContents: true,
				...target.readmit ? { readmit: true } : {}
			});
			continue;
		}
		const target = await resolveOrderedPatchPath(hunk.path, options, unlinked);
		const moveTarget = hunk.kind === "update" && hunk.movePath ? await resolveOrderedPatchPath(hunk.movePath, options, unlinked) : void 0;
		let removesContents = true;
		if (moveTarget && moveTarget.stage !== target.stage) {
			const source = await resolveUnlinkedPath(hunk.path, target.target, target.stage, options);
			removesContents = !source.link || target.stage !== target.target.queueKey;
			unlinked.push(source);
			target.keys.push(source.key);
		}
		const inode = hunk.kind === "update" && !options.sandbox && options.workspaceOnly === false ? hardlinkInode(await fs$1.stat(target.target.resolved).catch(() => void 0)) : void 0;
		resolved.push({
			hunk,
			target: target.target,
			stage: target.stage,
			keys: moveTarget ? [...target.keys, ...moveTarget.keys] : target.keys,
			removesContents,
			...moveTarget ? {
				moveTarget: moveTarget.target,
				moveStage: moveTarget.stage
			} : {},
			...target.readmit || moveTarget?.readmit ? { readmit: true } : {},
			...target.unread ? { unread: true } : {},
			...inode ? { contentStage: INODE_STAGE + inode } : {}
		});
	}
	return resolved;
}
const PATH_STAGE = "\0path\0";
const INODE_STAGE = "\0inode\0";
/**
* Queue identity follows a final symlink to the file it names, so a link and
* its target share one key, but removing the link leaves that file in place.
* Such a path stages by its spelling instead, apart from the file it named.
*/
async function resolveUnlinkedPath(rawFilePath, target, stage, options) {
	const key = await resolvePathKey(target, options);
	const stat = options.sandbox ? void 0 : await lstatHostPath(target.resolved);
	const link = options.sandbox ? key !== target.queueKey : stat?.isSymbolicLink() === true;
	const lexical = await resolveLexicalPatchPath(rawFilePath, options);
	const inode = hardlinkInode(stat);
	return {
		path: lexical,
		key,
		stage: link ? PATH_STAGE + lexical : stage,
		link,
		...inode ? { inode } : {},
		...stat?.isSymbolicLink() && stat.nlink === 1 ? { entry: `${stat.dev}:${stat.ino}` } : {}
	};
}
/** Queue identity of the directory entry itself, not the file a final link names. */
async function resolvePathKey(target, options) {
	const paths = options.sandbox ? path.posix : path;
	const parent = paths.dirname(target.resolved);
	const parentKey = options.sandbox ? await resolveSandboxFileMutationQueueKey({
		bridge: options.sandbox.bridge,
		root: options.sandbox.root,
		filePath: parent,
		cwd: options.cwd,
		signal: options.signal
	}) : await resolveFileMutationQueueKey(parent);
	return paths.join(parentKey, paths.basename(target.resolved));
}
async function resolvePatchFilePath(rawFilePath, options) {
	return options.patchInputPaths?.get(rawFilePath) ?? (options.sandbox ? await resolveApplyPatchInputPath(rawFilePath, options) : preserveAtPrefixedRelativePath(rawFilePath, options.cwd));
}
/** The unadmitted spelling of a patch path, for matching it against earlier removals. */
async function resolveLexicalPatchPath(rawFilePath, options) {
	const filePath = await resolvePatchFilePath(rawFilePath, options);
	return options.sandbox ? options.sandbox.bridge.resolvePath({
		filePath,
		cwd: options.cwd
	}).containerPath : resolvePathFromInput(filePath, options.cwd);
}
/**
* Admission sees the snapshot, so a path at or under a link an earlier hunk
* unlinks (for example `Delete File: link` then `Add File: link`) still names
* the link here; it stages by spelling, apart from the link target. When an
* earlier removal changes what admission sees (a link or file replaced by a
* directory, the other name of a hardlink), a refused path is admitted again
* in commit order instead, so the link target is never used.
*/
async function resolveOrderedPatchPath(rawFilePath, options, unlinked, aliasPolicy = PATH_ALIAS_POLICIES.strict) {
	if (unlinked.length === 0) {
		const target = await resolvePatchPath(rawFilePath, options, aliasPolicy);
		return {
			target,
			stage: target.queueKey,
			keys: [target.queueKey]
		};
	}
	const lexical = await spellLikeRemovedLink(await resolveLexicalPatchPath(rawFilePath, options), unlinked, options);
	let target;
	try {
		target = await resolvePatchPath(rawFilePath, options, aliasPolicy);
	} catch (error) {
		const removed = findUnlinkedPath(unlinked, { lexical }, options);
		const placeholder = {
			resolved: lexical,
			display: rawFilePath
		};
		if (removed) {
			const queueKey = removed.key;
			return {
				target: {
					...placeholder,
					queueKey
				},
				stage: removed.stage,
				keys: [queueKey],
				readmit: true,
				removed
			};
		}
		const freed = await resolveFreedHardlink(rawFilePath, options, unlinked);
		if (!freed) throw error;
		return {
			target: freed,
			stage: freed.queueKey,
			keys: [freed.queueKey],
			readmit: true,
			unread: true
		};
	}
	const removed = findUnlinkedPath(unlinked, {
		lexical,
		key: unlinked.some((entry) => entry.link) ? await resolvePathKey(target, options) : void 0
	}, options);
	return removed?.link ? {
		target,
		stage: removed.stage,
		keys: [target.queueKey, removed.key],
		removed
	} : {
		target,
		stage: target.queueKey,
		keys: [target.queueKey]
	};
}
/**
* The filesystem decides which spellings name one entry (case-insensitive
* volumes, for example). Rewrite a path at or under a host symlink an earlier
* hunk removes to that removal's spelling, matched by the link entry's identity.
*/
async function spellLikeRemovedLink(lexical, unlinked, options) {
	const removedLinks = /* @__PURE__ */ new Map();
	for (const entry of unlinked) if (entry.entry) removedLinks.set(entry.entry, entry.path);
	if (options.sandbox || removedLinks.size === 0) return lexical;
	for (let dir = lexical;; dir = path.dirname(dir)) {
		const stat = await lstatHostPath(dir);
		const removed = stat?.isSymbolicLink() && removedLinks.get(`${stat.dev}:${stat.ino}`);
		if (removed) return path.join(removed, path.relative(dir, lexical));
		if (path.dirname(dir) === dir) return lexical;
	}
}
/** Another name of a host hardlink an earlier hunk removes; admission waits for commit order. */
async function resolveFreedHardlink(rawFilePath, options, unlinked) {
	if (options.sandbox || !unlinked.some((entry) => entry.inode)) return;
	const target = await resolvePatchPath(rawFilePath, options, PATH_ALIAS_POLICIES.unlinkTarget).catch(() => void 0);
	const stat = target && await lstatHostPath(target.resolved);
	const inode = hardlinkInode(stat);
	const removedNames = unlinked.filter((entry) => inode && entry.inode === inode).length;
	return stat && removedNames > 0 && stat.nlink - removedNames === 1 ? target : void 0;
}
async function lstatHostPath(filePath) {
	return await fs$1.lstat(filePath).catch(() => void 0);
}
function hardlinkInode(stat) {
	return stat?.isFile() && stat.nlink > 1 ? `${stat.dev}:${stat.ino}` : void 0;
}
/**
* The latest removal of this path itself, matched by spelling or entry
* identity, or of a path above it.
*/
function findUnlinkedPath(unlinked, entryPath, options) {
	const paths = options.sandbox ? path.posix : path;
	for (const entry of unlinked.toReversed()) {
		const relative = paths.relative(entry.path, entryPath.lexical);
		if (relative === "" || entry.key === entryPath.key) return entry;
		if (!(relative === ".." || relative.startsWith(`..${paths.sep}`) || paths.isAbsolute(relative))) return {
			path: entryPath.lexical,
			key: paths.join(entry.key, relative),
			stage: PATH_STAGE + entryPath.lexical,
			link: true
		};
	}
}
const REMOVED = Symbol("removed");
/**
* Reject predictable update failures (missing file, context mismatch, invalid
* UTF-8) before any hunk mutates the workspace. Staged contents follow earlier
* adds, updates, deletes, and moves by physical identity. A path at a removed
* link, or under a removed path, stages by spelling and starts out removed.
*/
async function preflightUpdateHunks(hunks, fileOps, signal) {
	const staged = /* @__PURE__ */ new Map();
	for (const entry of hunks) {
		throwIfPatchAborted(signal);
		const { hunk, target, moveStage, removesContents, unread } = entry;
		if (hunk.kind !== "update") {
			staged.set(entry.stage, hunk.kind === "add" ? hunk.contents : REMOVED);
			continue;
		}
		const stage = entry.contentStage && !staged.has(entry.stage) && !entry.stage.startsWith(PATH_STAGE) ? entry.contentStage : entry.stage;
		const current = staged.has(stage) ? staged.get(stage) : stage.startsWith(PATH_STAGE) ? REMOVED : unread ? null : void 0;
		let unreadable = false;
		const applied = current === null ? null : await applyUpdateHunk(target.resolved, hunk.chunks, { readFile: current === void 0 ? (filePath) => fileOps.readFile(filePath).catch((error) => {
			unreadable = true;
			throw error;
		}) : async () => readStaged(current) }).catch((error) => {
			if (unreadable && hasCaseVariant(staged, stage)) return null;
			throw error;
		});
		if (moveStage !== void 0 && moveStage !== entry.stage) {
			if (removesContents) staged.set(entry.stage, REMOVED);
			staged.set(moveStage, applied);
		} else staged.set(stage, applied);
	}
}
/**
* A missing path keeps its spelling in its identity, so on a case-insensitive
* filesystem a file an earlier hunk creates can stage under another spelling.
* Leave such an unreadable path to the commit pass.
*/
function hasCaseVariant(staged, stage) {
	const folded = stage.toLowerCase();
	for (const key of staged.keys()) if (key.toLowerCase() === folded) return true;
	return false;
}
function readStaged(current) {
	if (current === REMOVED) throw new Error("an earlier hunk in this patch removes it");
	return current;
}
function throwIfPatchAborted(signal) {
	if (signal?.aborted) throw createAbortError("Aborted", { cause: signal.reason });
}
async function commitPatchHunks(hunks, fileOps, options) {
	const changedPaths = {
		added: /* @__PURE__ */ new Set(),
		modified: /* @__PURE__ */ new Set(),
		deleted: /* @__PURE__ */ new Set()
	};
	const noOpPaths = /* @__PURE__ */ new Set();
	for (const entry of hunks) {
		throwIfPatchAborted(options.signal);
		const { hunk } = entry;
		const { target, moveTarget } = entry.readmit ? await readmitPatchHunk(hunk, options) : entry;
		if (hunk.kind === "add") {
			await ensureDir(target.resolved, fileOps);
			await createPatchTarget({
				target,
				contents: hunk.contents,
				ops: fileOps,
				hint: `Use "*** Update File: ${target.display}" to change it, or delete it earlier in the same patch.`
			});
			changedPaths.added.add(target.display);
			continue;
		}
		if (hunk.kind === "delete") {
			await fileOps.remove(target.resolved);
			changedPaths.deleted.add(target.display);
			continue;
		}
		const applied = await applyUpdateHunk(target.resolved, hunk.chunks, fileOps);
		if (moveTarget) await ensureDir(moveTarget.resolved, fileOps);
		if (moveTarget && entry.moveStage !== entry.stage) {
			noOpPaths.delete(target.display);
			await createPatchTarget({
				target: moveTarget,
				contents: applied,
				ops: fileOps,
				hint: "Delete it earlier in the same patch to replace it."
			});
			await fileOps.remove(target.resolved);
			changedPaths.modified.add(moveTarget.display);
			continue;
		}
		if (normalizeUpdateComparison(await fileOps.readFile(target.resolved)) === normalizeUpdateComparison(applied)) noOpPaths.add(target.display);
		else {
			noOpPaths.delete(target.display);
			await fileOps.writeFile(target.resolved, applied);
			changedPaths.modified.add(target.display);
		}
	}
	const summary = {
		added: [...changedPaths.added],
		modified: [...changedPaths.modified],
		deleted: [...changedPaths.deleted]
	};
	const noOp = noOpPaths.size > 0 && Object.values(summary).every((paths) => paths.length === 0);
	return {
		summary,
		text: noOp ? `No changes made to ${Array.from(noOpPaths).join(", ")}.` : formatSummary(summary),
		...noOp ? { noOp: true } : {}
	};
}
async function readmitPatchHunk(hunk, options) {
	return {
		target: await resolvePatchPath(hunk.path, options, hunk.kind === "delete" ? PATH_ALIAS_POLICIES.unlinkTarget : PATH_ALIAS_POLICIES.strict),
		...hunk.kind === "update" && hunk.movePath ? { moveTarget: await resolvePatchPath(hunk.movePath, options) } : {}
	};
}
async function resolvePatchInputPaths(hunks, options) {
	const rawPaths = /* @__PURE__ */ new Set();
	for (const hunk of hunks) {
		rawPaths.add(hunk.path);
		if (hunk.kind === "update" && hunk.movePath) rawPaths.add(hunk.movePath);
	}
	const resolved = /* @__PURE__ */ new Map();
	for (const rawPath of rawPaths) resolved.set(rawPath, options.sandbox ? await resolveApplyPatchInputPath(rawPath, options) : preserveAtPrefixedRelativePath(rawPath, options.cwd));
	return resolved;
}
function formatSummary(summary) {
	const lines = ["Success. Updated the following files:"];
	const filesByMarker = {
		A: summary.added,
		M: summary.modified,
		D: summary.deleted
	};
	for (const [marker, files] of Object.entries(filesByMarker)) for (const file of files) lines.push(`${marker} ${file}`);
	return lines.join("\n");
}
async function ensureDir(filePath, ops) {
	const parent = path.dirname(filePath);
	if (!parent || parent === ".") return;
	await ops.mkdirp?.(parent);
}
async function resolvePatchPath(rawFilePath, options, aliasPolicy = PATH_ALIAS_POLICIES.strict) {
	const filePath = await resolvePatchFilePath(rawFilePath, options);
	if (options.sandbox) {
		const resolved = options.sandbox.bridge.resolvePath({
			filePath,
			cwd: options.cwd
		});
		if (options.workspaceOnly !== false) {
			const legacyBridge = options.sandbox.bridge.pathMappings === void 0;
			const workspaceMapping = resolveSandboxPathMapping(options.sandbox.workspaceMounts ?? [], resolved.containerPath);
			if (!legacyBridge && !workspaceMapping) throw markHostRootEscape(/* @__PURE__ */ new Error(`Path escapes sandbox root (${options.sandbox.root}): ${filePath}`));
			if (resolved.hostPath) {
				const root = legacyBridge ? options.sandbox.root : workspaceMapping.mapping.hostRoot;
				await assertSandboxPath({
					filePath: resolved.hostPath,
					cwd: root,
					root,
					allowFinalSymlinkForUnlink: aliasPolicy.allowFinalSymlinkForUnlink,
					allowFinalHardlinkForUnlink: aliasPolicy.allowFinalHardlinkForUnlink
				});
			}
		}
		return {
			resolved: resolved.containerPath,
			queueKey: await resolveSandboxFileMutationQueueKey({
				bridge: options.sandbox.bridge,
				root: options.sandbox.root,
				filePath,
				cwd: options.cwd,
				signal: options.signal
			}),
			display: resolved.relativePath || resolved.containerPath
		};
	}
	const resolved = options.workspaceOnly !== false ? (await assertSandboxPath({
		filePath,
		cwd: options.cwd,
		root: options.root ?? options.cwd,
		allowFinalSymlinkForUnlink: aliasPolicy.allowFinalSymlinkForUnlink,
		allowFinalHardlinkForUnlink: aliasPolicy.allowFinalHardlinkForUnlink
	})).resolved : resolvePathFromInput(filePath, options.cwd);
	return {
		resolved,
		queueKey: await resolveFileMutationQueueKey(resolved),
		display: toDisplayPath(resolved, options.cwd)
	};
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.applyPatchTestApi")] = { applyPatch };
//#endregion
//#region src/agents/lazy-process-tool.ts
const bashToolsModuleLoader = createLazyImportLoader(() => import("./bash-tools-C8Xjw2dO.mjs"));
/** Build process lazily so tool discovery does not load the shell runtime. */
function createLazyProcessTool(defaults) {
	let loadedTool;
	const loadTool = async () => {
		if (!loadedTool) {
			const { createProcessTool } = await bashToolsModuleLoader.load();
			loadedTool = createProcessTool(defaults);
		}
		return loadedTool;
	};
	return {
		name: "process",
		label: "process",
		displaySummary: PROCESS_TOOL_DISPLAY_SUMMARY,
		description: describeProcessTool({ hasCronTool: defaults?.hasCronTool === true }),
		parameters: processSchema,
		outputSchema: ProcessToolOutputSchema,
		execute: async (toolCallId, params, signal, onUpdate) => (await loadTool()).execute(toolCallId, params, signal, onUpdate)
	};
}
//#endregion
//#region src/agents/sessions/tools/ls.ts
const DEFAULT_LIMIT = 500;
const defaultLsOperations = { readDirectory: async (absolutePath) => (await readdir(absolutePath, { withFileTypes: true })).map((entry) => ({
	name: entry.name,
	isDirectory: entry.isDirectory()
})) };
function formatLsContinuation(after) {
	return `\n\n[More entries. Continue with the same path and after=${JSON.stringify(after)}.]`;
}
function createLsTool(cwd, options) {
	const ops = options?.operations ?? defaultLsOperations;
	const resolvePath = options?.operations ? resolveToCwd : resolveLocalPathToCwd;
	return wrapToolDefinition({
		name: "ls",
		label: "ls",
		description: "List directory entries in binary filename order, including dotfiles and links. Names are JSON-quoted; / marks actual directories. Pass the returned after cursor with the same path to continue.",
		parameters: lsSchema,
		async execute(_toolCallId, { path, limit, after }, signal, _onUpdate, _ctx) {
			assertFileToolNotAborted(signal);
			const runListing = async () => {
				try {
					const dirPath = resolvePath(path || ".", cwd);
					const effectiveLimit = normalizePositiveLimit(limit, DEFAULT_LIMIT);
					const directoryEntries = await ops.readDirectory(dirPath, signal);
					assertFileToolNotAborted(signal);
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
			return await racePromiseWithAbortSignal(runListing, signal, () => /* @__PURE__ */ new Error("Operation aborted"));
		}
	});
}
//#endregion
//#region src/agents/core-coding-tools.ts
const filesystemAction = Object.freeze({
	family: "data",
	operation: "filesystem"
});
const processAction = Object.freeze({
	family: "tool",
	operation: "process"
});
function resolveSkillReadRoots(skills) {
	const roots = /* @__PURE__ */ new Set();
	for (const skill of skills ?? []) {
		if (resolveSkillFileHost(skill) === "workspace") continue;
		const baseDir = typeof skill.baseDir === "string" ? skill.baseDir.trim() : "";
		const filePath = typeof skill.filePath === "string" ? skill.filePath.trim() : "";
		const root = baseDir || (filePath ? path.dirname(filePath) : "");
		if (!root || !path.isAbsolute(root)) continue;
		roots.add(path.resolve(root));
	}
	return roots.size > 0 ? Array.from(roots) : void 0;
}
/** Route only selected workspace Skills; their paths never name Gateway files. */
function wrapWorkspaceSkillRead(localRead, skills, options) {
	const remoteSkills = skills?.filter((skill) => resolveSkillFileHost(skill) === "workspace") ?? [];
	const localSkills = skills?.filter((skill) => resolveSkillFileHost(skill) !== "workspace") ?? [];
	if (remoteSkills.length === 0) return localRead;
	const access = getAgentWorkspaceAccess(options.skillsSnapshot?.skillRoots?.agentWorkspaceDir ?? options.codingRoot, "loadSkills");
	const reader = access?.loadSkills ? access.skillResources : void 0;
	return {
		...localRead,
		execute: async (toolCallId, params, signal, onUpdate) => {
			const record = asOptionalObjectRecord(params);
			const input = record?.path ?? record?.file_path;
			const requestedPath = typeof input === "string" ? normalizeFileToolPathParam(input) : void 0;
			const virtualMatch = requestedPath ? remoteSkills.map((skill) => ({
				skill,
				sourcePath: resolveWorkspaceSkillSourcePath(skill, requestedPath)
			})).find((candidate) => candidate.sourcePath !== void 0) : void 0;
			const physicalPath = requestedPath && !virtualMatch ? resolvePathFromInput(requestedPath, options.codingRoot) : void 0;
			const physicalMatches = physicalPath ? remoteSkills.filter((candidate) => relativePathInsideSandboxRoot(candidate.baseDir, physicalPath) !== null) : [];
			const physicalMatch = physicalMatches.length === 1 && physicalPath && !fs.existsSync(physicalPath) && !localSkills.some((candidate) => relativePathInsideSandboxRoot(candidate.baseDir, physicalPath) !== null) ? physicalMatches[0] : void 0;
			const skill = virtualMatch?.skill ?? physicalMatch;
			const sourcePath = virtualMatch?.sourcePath ?? (physicalMatch ? physicalPath : void 0);
			if (!skill || !sourcePath) return localRead.execute(toolCallId, params, signal, onUpdate);
			if (!reader) throw new WorkspaceAccessUnavailableError("Remote workspace Skill resources are unavailable.");
			const active = AbortSignal.any([signal, options.abortSignal].filter((value) => Boolean(value)));
			const remoteRead = createReadTool(options.codingRoot, {
				maxBytes: resolveAdaptiveReadMaxBytes(options),
				modelBudget: resolveToolResultBudget(options.modelContextWindowTokens),
				modelHasVision: options.modelHasVision,
				operations: {
					resolvePath: () => sourcePath,
					resolveQueueKey: (filePath) => `workspace-skill:${filePath}`,
					access: async () => active.throwIfAborted(),
					readFile: async () => {
						active.throwIfAborted();
						if (sourcePath === skill.filePath) return Buffer.from(await reader.readInstructions(skill.filePath, { signal: active }));
						const { prepareSkillBundle } = await import("./bundle-5g69nfDq.mjs");
						const files = await reader.readSkillFiles(skill, { allowMissingRoot: false });
						active.throwIfAborted();
						const relative = relativePathInsideSandboxRoot(skill.baseDir, sourcePath);
						const bundlePath = !skill.baseDir.startsWith("/") && path.win32.isAbsolute(skill.baseDir) ? relative.split("\\").join("/") : relative;
						const file = files && prepareSkillBundle(files).files.find((entry) => entry.path === bundlePath);
						if (!file) throw Object.assign(/* @__PURE__ */ new Error(`Skill file not found: ${sourcePath}`), { code: "ENOENT" });
						return file.bytes;
					}
				}
			});
			return createOpenClawReadTool(remoteRead, {
				modelContextWindowTokens: options.modelContextWindowTokens,
				imageSanitization: options.imageSanitization,
				cwd: options.codingRoot
			}).execute(toolCallId, {
				...record,
				path: sourcePath
			}, active, onUpdate);
		}
	};
}
/** Materialize only the core file and shell families selected by the runtime owner. */
function createCoreCodingTools(options) {
	const sandbox = options.sandbox;
	const sandboxRoot = sandbox?.workspaceDir;
	const sandboxFsBridge = sandbox?.fsBridge;
	const allowWorkspaceWrites = sandbox?.workspaceAccess !== "ro";
	if (sandboxRoot && !sandboxFsBridge && (options.includeBaseCodingTools || options.shellTools !== "disabled")) throw new Error("Sandbox filesystem bridge is unavailable.");
	const skillReadResources = options.skillReadResources ?? options.skillsSnapshot?.resolvedSkills;
	const skillReadRoots = sandboxRoot ? void 0 : resolveSkillReadRoots(skillReadResources);
	const attachmentReadRoot = !sandboxRoot ? options.attachmentReadRoot : void 0;
	const hostReadRoots = [...skillReadRoots ?? [], ...attachmentReadRoot && fs.existsSync(attachmentReadRoot) ? [attachmentReadRoot] : []];
	const needsReadOnlyWorkspaceSkillMounts = options.shellTools !== "disabled" || options.includeBaseCodingTools && options.workspaceOnly;
	const readOnlyWorkspaceSkillMounts = sandbox && needsReadOnlyWorkspaceSkillMounts ? resolveReadOnlyWorkspaceSkillMounts({
		workspaceDir: sandbox.workspaceDir,
		agentWorkspaceDir: sandbox.agentWorkspaceDir,
		skillsWorkspaceDir: sandbox.skillsWorkspaceDir,
		workdir: sandbox.containerWorkdir,
		workspaceAccess: sandbox.workspaceAccess
	}) : [];
	const sandboxFileMounts = sandbox && (options.includeBaseCodingTools && options.workspaceOnly || options.shellTools !== "disabled" && options.applyPatchEnabled && options.applyPatchWorkspaceOnly) ? sandboxFsBridge?.pathMappings ?? buildSandboxFsMounts(sandbox) : [];
	const sandboxWorkspaceMounts = sandbox ? sandboxFileMounts.filter((mount) => relativePathInsideSandboxRoot(sandbox.containerWorkdir, mount.containerRoot) !== null) : [];
	const sandboxReadMounts = sandboxFileMounts;
	const guardWorkspaceTool = (tool) => options.workspaceOnly ? wrapToolWorkspaceRootGuardWithOptions(tool, sandboxRoot ?? options.containmentRoot, sandboxRoot ? {
		containerMounts: sandboxWorkspaceMounts,
		containerWorkdir: sandbox.containerWorkdir,
		bridge: sandboxFsBridge,
		normalizeGuardedPathParams: true
	} : {
		resolutionCwd: options.codingRoot,
		normalizeGuardedPathParams: true
	}) : tool;
	const base = [];
	if (options.includeBaseCodingTools) {
		const readDirectory = sandboxFsBridge?.readDirectory?.bind(sandboxFsBridge);
		const listingOperations = readDirectory ? { readDirectory: (filePath, signal) => readDirectory({
			filePath,
			cwd: sandbox?.containerWorkdir,
			signal
		}) } : options.workspaceOnly && !sandbox ? { readDirectory: async (filePath) => {
			return (await (await root(options.containmentRoot)).list(path.relative(options.containmentRoot, filePath), { withFileTypes: true })).map(({ name, isDirectory }) => ({
				name,
				isDirectory
			}));
		} } : void 0;
		if (!sandbox || readDirectory) {
			const guardedLs = guardWorkspaceTool(createLsTool(options.codingRoot, {
				operations: listingOperations,
				modelBudget: resolveToolResultBudget(options.modelContextWindowTokens)
			}));
			base.push(sandboxRoot ? wrapSandboxFileToolPath(guardedLs, {
				root: sandboxRoot,
				bridge: sandboxFsBridge,
				defaultPath: "."
			}) : guardedLs);
		}
		const read = sandboxRoot ? createSandboxedReadTool({
			root: sandboxRoot,
			bridge: sandboxFsBridge,
			modelContextWindowTokens: options.modelContextWindowTokens,
			imageSanitization: options.imageSanitization,
			modelHasVision: options.modelHasVision
		}) : createReadTool(options.codingRoot, {
			maxBytes: resolveAdaptiveReadMaxBytes(options),
			modelBudget: resolveToolResultBudget(options.modelContextWindowTokens),
			modelHasVision: options.modelHasVision
		});
		const guarded = options.workspaceOnly ? wrapToolWorkspaceRootGuardWithOptions(read, sandboxRoot ?? options.containmentRoot, sandboxRoot ? {
			containerMounts: sandboxReadMounts,
			containerWorkdir: sandbox.containerWorkdir,
			bridge: sandboxFsBridge,
			readPathValidation: "bridge"
		} : {
			additionalRoots: hostReadRoots.length > 0 ? hostReadRoots : void 0,
			resolutionCwd: options.codingRoot,
			normalizeGuardedPathParams: true
		}) : read;
		const wrapped = sandboxRoot ? guarded : createOpenClawReadTool(guarded, {
			modelContextWindowTokens: options.modelContextWindowTokens,
			imageSanitization: options.imageSanitization,
			cwd: options.codingRoot
		});
		base.push(wrapReadToolWithSkillContent(sandboxRoot ? wrapped : wrapWorkspaceSkillRead(wrapped, skillReadResources, options), skillReadResources?.map((skill) => ({
			filePath: resolveSkillReadPath(skill),
			readContent: skill.readContent
		})), {
			modelContextWindowTokens: options.modelContextWindowTokens,
			imageSanitization: options.imageSanitization,
			cwd: options.codingRoot,
			containerWorkdir: sandbox?.containerWorkdir,
			instructionPaths: options.skillInstructionPaths,
			instructionDeliveryCache: options.skillInstructionDeliveryCache
		}));
		if (!options.readOnly && !sandboxRoot) for (const createTool of [createHostWorkspaceEditTool, createHostWorkspaceWriteTool]) {
			const tool = createTool(options.codingRoot, options);
			base.push(guardWorkspaceTool(tool));
		}
	}
	if (options.includeBaseCodingTools && !options.readOnly && sandboxRoot && allowWorkspaceWrites) {
		const toolOptions = {
			root: sandboxRoot,
			bridge: sandboxFsBridge,
			memoryWriteProvenance: options.memoryWriteProvenance,
			abortSignal: options.abortSignal
		};
		for (const createTool of [createSandboxedEditTool, createSandboxedWriteTool]) {
			const tool = createTool(toolOptions);
			base.push(guardWorkspaceTool(tool));
		}
	}
	options.recordToolPrepStage?.("base-coding-tools");
	const shell = [];
	if (options.shellTools !== "disabled" && options.applyPatchEnabled && (!sandboxRoot || allowWorkspaceWrites)) shell.push(createApplyPatchTool({
		cwd: options.codingRoot,
		root: options.containmentRoot,
		sandbox: sandboxRoot && allowWorkspaceWrites ? {
			root: sandboxRoot,
			bridge: sandboxFsBridge,
			workspaceMounts: sandboxWorkspaceMounts
		} : void 0,
		workspaceOnly: options.applyPatchWorkspaceOnly,
		containmentSource: options.applyPatchContainmentSource,
		memoryWriteProvenance: options.memoryWriteProvenance,
		abortSignal: options.abortSignal
	}));
	if (options.shellTools === "full") shell.push(createLazyExecTool({
		...options.execDefaults,
		...sandbox?.required ? { sandboxRequired: true } : {},
		cwd: options.codingRoot,
		sandbox: sandbox ? {
			containerName: sandbox.containerName,
			workspaceDir: sandbox.workspaceDir,
			containerWorkdir: sandbox.containerWorkdir,
			workdirValidation: sandbox.backend?.workdirValidation,
			validateWorkdir: sandbox.backend?.validateWorkdir?.bind(sandbox.backend),
			discardPreparedWorkdir: sandbox.backend?.discardPreparedWorkdir?.bind(sandbox.backend),
			workdirRoots: sandbox.backend?.workdirRoots,
			readOnlyWorkspaceSkillMounts,
			env: sandbox.backend?.env ?? sandbox.docker.env,
			prepareProcessCleanup: sandbox.backend?.prepareProcessCleanup?.bind(sandbox.backend),
			buildExecSpec: sandbox.backend?.buildExecSpec.bind(sandbox.backend),
			finalizeExec: sandbox.backend?.finalizeExec?.bind(sandbox.backend)
		} : void 0
	}), createLazyProcessTool(options.processDefaults));
	options.recordToolPrepStage?.("shell-tools");
	base.forEach((tool) => bindAgentToolActionDescriptor(tool, filesystemAction));
	shell.forEach((tool) => bindAgentToolActionDescriptor(tool, processAction));
	return [...base, ...shell];
}
//#endregion
export { resolveMemoryFlushToolSetup as a, projectMemoryFlushTools as i, MemoryFlushToolsUnavailableError as n, warnIfMemoryFlushFileWriterUnavailable as o, assertMemoryFlushPersistenceToolAvailable as r, filterToolsByMessageProvider as s, createCoreCodingTools as t };
