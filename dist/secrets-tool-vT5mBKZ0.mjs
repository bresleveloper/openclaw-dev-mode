import { M as resolveNonNegativeIntegerOption, u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { c as isRecord, i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { h as resolveDefaultSecretProviderAlias, n as ENV_SECRET_REF_ID_RE } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import { i as resolveRootPath } from "./boundary-path-CAv_plX7.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { i as clampNumber } from "./utils-gjJ-tD2q.mjs";
import { i as readErrorCause } from "./errors-DPfGDWk1.mjs";
import { i as overwriteFileHandle$1 } from "./file-descriptor-BWLpOgrg.mjs";
import { a as canonicalPathFromExistingAncestor$1, s as findExistingAncestor$1, t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { si as validateSecretsStoreListResult } from "./src-pLJQA6J5.mjs";
import { k as describeSecretsTool } from "./tool-catalog-DGlfxTaj.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { n as textResult, t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { n as detectMime } from "./mime-C3j3dfQb.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { m as readToolStringParam } from "./common-BofcG96e.mjs";
import { n as normalizeMediaReferenceSource } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { r as decodeWindowsTextFileBuffer } from "./windows-encoding-BZ9QWkjs.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { r as captureAgentToolSourceExecutionGuard, s as runWithAgentToolSourceExecutionScope } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import { l as resolveAgentQuestionGatewayCall } from "./gateway-question-dispatch-CakNMdfI.mjs";
import { t as GatewayClientRequestError } from "./request-error-CnPCYq3A.mjs";
import { t as collectTextContentBlocks } from "./content-blocks-DDtxq3Ff.mjs";
import { r as sanitizeToolResultImages } from "./tool-images-dsyNDL1H.mjs";
import { a as resolveToolResultBudget, s as toolResultFitsBudget } from "./tool-result-limits-tYfGdUlb.mjs";
import { t as sniffMimeFromBase64 } from "./sniff-mime-from-base64-BS5-3Pm_.mjs";
import { n as assertSandboxPath, o as normalizeFileReferencePrefix } from "./sandbox-paths-CgSBSdCM.mjs";
import { i as resolveSandboxPathMapping, o as toRelativeWorkspacePath } from "./path-policy-Llwd1FHK.mjs";
import { n as classifyMediaReferenceSource, o as resolveMediaReferenceSandboxPath } from "./media-reference-Dlq4zAi4.mjs";
import { a as assertRequiredParams, c as normalizeFileToolPathParamsFromKeys, i as REQUIRED_PARAM_GROUPS, s as normalizeFileToolPathParam, u as wrapToolParamValidation } from "./agent-tools.before-tool-call.decision-DlE5PesW.mjs";
import { t as callGatewayTool } from "./gateway-BC8tozR0.mjs";
import { g as readQuestionRejection, h as createQuestionPromptLifetime, m as createGatewayQuestionCanceller, p as awaitGatewayQuestionAnswer } from "./gateway-question-DpNVBEhx.mjs";
import { i as normalizeQuestionTimeoutSeconds } from "./ask-user-tool-normalization-Cqh2rKIa.mjs";
import { l as sendQuestionToolPrompt, t as beginAskUserPromptDelivery } from "./ask-user-tool-CIppZGJ0.mjs";
import { a as resolveToCwd, t as expandOsHomePrefix } from "./path-utils-Bn-ftvxY.mjs";
import { a as recordMemoryArtifactWriteProvenance, r as normalizeMemoryArtifactRelativePath, t as clearMemoryArtifactProvenance } from "./memory-artifact-provenance-CLGkndXF.mjs";
import { r as resolveSandboxFileMutationQueueKey } from "./file-mutation-identity-C_-O-u-P.mjs";
import { a as normalizePositiveLimit, i as formatReadContinuationNotice, n as createReadTool, r as createBoundedReadTextPage, t as createWriteTool, u as createEditTool } from "./tools-CsYUPwyX.mjs";
import { l as stringEnum } from "./typebox-DhJiP5MZ.mjs";
import { n as ReadToolContinuationSchema } from "./tool-schemas-B1hOiDDb.mjs";
import { n as DEFAULT_MAX_LINES, t as DEFAULT_MAX_BYTES } from "./truncate-DH9KX6o6.mjs";
import "./tool-contracts-D2t36Mmf.mjs";
import { URL } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";
import { hasEncodedFileUrlSeparator, trySafeFileURLToPath } from "@openclaw/fs-safe/advanced";
import { Type } from "typebox";
import { Value } from "typebox/value";
import { isWindowsDrivePath } from "@openclaw/fs-safe/archive";
//#region src/agents/host-file-write.ts
async function openHostFileForUpdate(resolved) {
	try {
		return (await fs.stat(resolved)).isFile() ? await fs.open(resolved, "r+") : void 0;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
async function writeHostFile(absolutePath, content, abortSignal) {
	const assertCurrent = captureAgentToolSourceExecutionGuard(abortSignal);
	const resolved = path.resolve(expandOsHomePrefix(absolutePath));
	await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
		assertCurrent();
		await fs.mkdir(path.dirname(resolved), { recursive: true });
	});
	const handle = await openHostFileForUpdate(resolved);
	if (!handle) {
		await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
			assertCurrent();
			await fs.writeFile(resolved, content, "utf-8");
		});
		return;
	}
	try {
		await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
			await overwriteFileHandle$1(handle, Buffer.from(content, "utf-8"), { beforeWrite: assertCurrent });
		});
	} finally {
		await handle.close().catch(() => void 0);
	}
}
//#endregion
//#region src/agents/memory-flush-content.ts
/** Reject replayed notes without editing either the saved bytes or the proposed delta. */
function assertNewMemoryFlushContent(existing, content) {
	const previous = existing.replaceAll("\r\n", "\n").trim();
	if (!previous) return;
	const proposed = content.replaceAll("\r\n", "\n").trim();
	const proposedBlocks = new Set(proposed.split(/\n[\t ]*\n+/));
	if ([previous, ...previous.split(/\n[\t ]*\n+/)].some((block) => /[\p{L}\p{N}]/u.test(block) && !/^#{1,6}[\t ]+[^\n]+$/.test(block) && (proposedBlocks.has(block) || proposed.startsWith(`${block}\n`)))) throw new Error("Memory flush content repeats saved note text. Nothing was appended. Retry with only new content; do not include existing entries or a complete rewritten note.");
}
//#endregion
//#region src/agents/memory-write-provenance.ts
function withMemoryWriteProvenance(operations, observer) {
	if (!observer) return operations;
	const readContentBefore = (absolutePath) => operations.readFile(absolutePath).then((value) => Buffer.isBuffer(value) ? value.toString("utf8") : value).catch((error) => {
		if (!isMissingPathError(error) && !isMissingPathError(readErrorCause(error))) throw error;
		return "";
	});
	const remove = operations.remove;
	return {
		...operations,
		writeFile: async (absolutePath, content) => {
			const assertCurrent = captureAgentToolSourceExecutionGuard();
			const commit = () => runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				assertCurrent();
				await operations.writeFile(absolutePath, content);
			});
			if (!await observer.classifies(absolutePath)) {
				await commit();
				return;
			}
			await observer.write({
				absolutePath,
				contentBefore: await readContentBefore(absolutePath),
				contentAfter: content,
				commit
			});
		},
		...remove ? { remove: async (absolutePath) => {
			const assertCurrent = captureAgentToolSourceExecutionGuard();
			const contentBefore = await observer.classifies(absolutePath) ? await readContentBefore(absolutePath) : "";
			await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				assertCurrent();
				await remove(absolutePath);
			});
			await observer.clearAfterDelete(absolutePath, contentBefore);
		} } : {}
	};
}
function resolveMemoryRelativePath(root, absolutePath) {
	const relativePath = path.relative(root, absolutePath);
	if (!relativePath || path.isAbsolute(relativePath) || relativePath === ".." || relativePath.startsWith(`..${path.sep}`)) return;
	return normalizeMemoryArtifactRelativePath(relativePath.replaceAll(path.sep, "/"));
}
function createMemoryWriteProvenanceObserver(params) {
	const now = params.now ?? Date.now;
	const resolvePath = params.resolvePath ?? canonicalPathFromExistingAncestor$1;
	const resolveRelativePath = async (absolutePath) => {
		const [root, target] = await Promise.all([resolvePath(params.mutationRoot), resolvePath(absolutePath)]);
		return resolveMemoryRelativePath(root, target);
	};
	return {
		classifies: async (absolutePath) => await resolveRelativePath(absolutePath) !== void 0,
		write: async ({ absolutePath, contentBefore, contentAfter, commit }) => {
			const relativePath = await resolveRelativePath(absolutePath);
			if (!relativePath) {
				await commit();
				return;
			}
			const rollback = await recordMemoryArtifactWriteProvenance({
				workspaceDir: params.workspaceDir,
				relativePath,
				contentBefore,
				contentAfter,
				originClass: params.resolveOriginClass(),
				observedAt: now(),
				sessionId: params.sessionId,
				sessionKey: params.sessionKey
			});
			try {
				await commit();
			} catch (error) {
				try {
					await rollback?.();
				} catch (rollbackError) {
					throw new Error(`File write failed and memory provenance rollback also failed: ${String(error)}`, { cause: rollbackError });
				}
				throw error;
			}
		},
		clearAfterDelete: async (absolutePath, contentBefore) => {
			const relativePath = await resolveRelativePath(absolutePath);
			if (!relativePath) return;
			try {
				await clearMemoryArtifactProvenance({
					workspaceDir: params.workspaceDir,
					relativePath,
					contentBefore
				});
			} catch (error) {
				logWarn(`memory provenance cleanup failed for ${relativePath}: ${String(error)}`);
			}
		}
	};
}
//#endregion
//#region src/agents/agent-tools.read.ts
const DEFAULT_READ_PAGE_MAX_BYTES = 32768;
const MAX_ADAPTIVE_READ_MAX_BYTES = 131072;
const ADAPTIVE_READ_CONTEXT_SHARE = .1;
const CHARS_PER_TOKEN_ESTIMATE = 4;
const MAX_ADAPTIVE_READ_PAGES = 4;
function createSkillInstructionDeliveryCache() {
	return /* @__PURE__ */ new Map();
}
/** Erase a schema-specific session tool only after its input passes that owned schema. */
function eraseSessionFileTool(tool) {
	return {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			if (!Value.Check(tool.parameters, params)) throw new Error(`Invalid parameters for ${tool.name}`);
			const typedParams = params;
			return await tool.execute(toolCallId, typedParams, signal, onUpdate ? (update) => onUpdate(update) : void 0);
		}
	};
}
const READ_CONTINUATION_NOTICE_RE = /\n\n\[(?:Showing (?:lines|part of line) [^\]]*|Read output capped [^\]]*|\d+ more lines? in file\. [^\]]*)\]\s*$/;
function resolveAdaptiveReadMaxBytes(options) {
	const contextWindowTokens = asPositiveFiniteNumber(options?.modelContextWindowTokens);
	if (contextWindowTokens === void 0) return DEFAULT_READ_PAGE_MAX_BYTES;
	const fromContext = Math.floor(contextWindowTokens * CHARS_PER_TOKEN_ESTIMATE * ADAPTIVE_READ_CONTEXT_SHARE);
	return clampNumber(fromContext, DEFAULT_READ_PAGE_MAX_BYTES, MAX_ADAPTIVE_READ_MAX_BYTES);
}
function malformedXmlArgValuePathError(key) {
	return /* @__PURE__ */ new Error(`Malformed path parameter: ${key}. Supply correct parameters before retrying.`);
}
function getToolResultText(result) {
	const textBlocks = collectTextContentBlocks(result.content);
	return textBlocks.length > 0 ? textBlocks.join("\n") : void 0;
}
function getReadResultContent(result) {
	const details = result.details;
	return details && typeof details === "object" && "kind" in details && (details.kind === "text" || details.kind === "truncated") && "content" in details && typeof details.content === "string" ? details.content : void 0;
}
function withToolResultText(result, text, fileContent) {
	let replaced = false;
	const nextContent = result.content.map((block) => {
		if (!replaced && block.type === "text") {
			replaced = true;
			return Object.assign({}, block, { text });
		}
		return block;
	});
	const textBlock = {
		type: "text",
		text
	};
	return {
		...result,
		content: replaced ? nextContent : [textBlock],
		...fileContent !== void 0 && getReadResultContent(result) !== void 0 ? { details: {
			kind: "text",
			content: fileContent
		} } : {}
	};
}
function extractReadTruncationDetails(result) {
	const details = result.details;
	if (!details || typeof details !== "object" || !("truncation" in details)) return null;
	const truncation = details.truncation;
	if (!truncation || typeof truncation !== "object") return null;
	const record = truncation;
	if (record.truncated !== true) return null;
	return {
		truncated: true,
		outputLines: resolveNonNegativeIntegerOption(record.outputLines, 0),
		totalLines: resolveNonNegativeIntegerOption(record.totalLines, 0),
		continuation: extractReadContinuation(details)
	};
}
function extractReadContinuation(details) {
	const candidate = "continuation" in details ? details.continuation : void 0;
	return Value.Check(ReadToolContinuationSchema, candidate) ? candidate : void 0;
}
function withReadContinuation(result, text, continuation, fileContent, initialOffset, truncation) {
	const details = result.details && typeof result.details === "object" ? result.details : {};
	const authoritative = ("truncation" in details ? details.truncation : void 0) ?? truncation;
	if (!authoritative || typeof authoritative !== "object") return withToolResultText(result, text);
	return {
		...withToolResultText(result, text),
		details: {
			kind: "truncated",
			content: fileContent,
			truncation: {
				...authoritative,
				outputLines: continuation.offset - initialOffset,
				outputBytes: Buffer.byteLength(fileContent, "utf8"),
				lastLinePartial: continuation.kind === "cursor"
			},
			continuation
		}
	};
}
function stripReadContinuationNotice(text) {
	return text.replace(READ_CONTINUATION_NOTICE_RE, "");
}
function stripReadTruncationContentDetails(result) {
	const details = result.details;
	if (!details || typeof details !== "object" || !("truncation" in details)) return result;
	const truncationRaw = details.truncation;
	if (!truncationRaw || typeof truncationRaw !== "object") return result;
	const truncation = truncationRaw;
	if (!Object.hasOwn(truncation, "content")) return result;
	const { content: _content, ...restTruncation } = truncation;
	return {
		...result,
		details: {
			...details,
			truncation: restTruncation
		}
	};
}
async function executeReadWithAdaptivePaging(params) {
	const userLimit = params.args.limit;
	const hasExplicitLimit = typeof userLimit === "number";
	const initialOffset = Math.floor(asPositiveFiniteNumber(params.args.offset) ?? 1);
	const initialLimit = hasExplicitLimit ? { limit: normalizePositiveLimit(userLimit, DEFAULT_MAX_LINES) } : {};
	let next = typeof params.args.cursor === "number" ? {
		kind: "cursor",
		offset: initialOffset,
		cursor: params.args.cursor,
		...initialLimit
	} : {
		kind: "line",
		offset: initialOffset,
		...initialLimit
	};
	let firstResult;
	let aggregatedText = "";
	let aggregatedContent = "";
	let aggregatedBytes = 0;
	let previousNotice = "";
	for (let page = 0; page < MAX_ADAPTIVE_READ_PAGES; page += 1) {
		const pageArgs = {
			...params.args,
			offset: next.offset,
			...next.kind === "cursor" ? { cursor: next.cursor } : {},
			...next.limit === void 0 ? {} : { limit: next.limit }
		};
		if (next.kind === "line") delete pageArgs.cursor;
		const pageResult = await params.base.execute(params.toolCallId, pageArgs, params.signal);
		firstResult ??= pageResult;
		const rawText = getToolResultText(pageResult);
		if (typeof rawText !== "string") return pageResult;
		const truncation = extractReadTruncationDetails(pageResult);
		const pageEndLine = next.offset - 1 + (truncation?.outputLines ?? 0);
		const reachedEof = Boolean(truncation?.truncated) && pageEndLine >= (truncation?.totalLines ?? 0);
		const pageContinuation = truncation?.continuation;
		const pageText = pageContinuation || reachedEof ? stripReadContinuationNotice(rawText) : rawText;
		const structuredContent = getReadResultContent(pageResult);
		const pageContent = structuredContent ?? pageText;
		const delimiter = page > 0 && next.kind === "line" ? "\n" : "";
		const candidateBytes = aggregatedBytes + delimiter.length + Buffer.byteLength(pageText, "utf8");
		const candidateContent = `${aggregatedContent}${delimiter}${pageContent}`;
		const continuationNotice = pageContinuation ? formatReadContinuationNotice(pageContinuation, params.maxBytes) : "";
		if (candidateBytes + Buffer.byteLength(continuationNotice, "utf8") > params.maxBytes || Buffer.byteLength(candidateContent, "utf8") > params.maxBytes || !toolResultFitsBudget(candidateContent, params.modelBudget) || !toolResultFitsBudget(`${aggregatedText}${delimiter}${pageText}${continuationNotice}`, params.modelBudget)) {
			if (page > 0) return withReadContinuation(firstResult, `${aggregatedText}${previousNotice}`, next, aggregatedContent, initialOffset);
			const lineCount = pageContent.split("\n").length;
			const displayPrefix = structuredContent === void 0 || !pageText.endsWith(pageContent) ? "" : pageText.slice(0, pageText.length - pageContent.length);
			const bounded = createBoundedReadTextPage({
				content: pageContent,
				startLine: next.offset,
				endLine: next.offset + lineCount - 1,
				totalLines: truncation?.totalLines ?? next.offset + lineCount - 1,
				continuation: pageContinuation,
				...next.kind === "cursor" ? { cursor: next.cursor } : {},
				limit: next.limit,
				maxBytes: params.maxBytes,
				pageMaxBytes: Math.min(DEFAULT_MAX_BYTES, params.maxBytes) - Buffer.byteLength(displayPrefix, "utf8"),
				prefix: displayPrefix,
				modelBudget: params.modelBudget,
				adaptive: true
			});
			if (bounded.details.kind === "text") return withToolResultText(pageResult, `${displayPrefix}${bounded.text}`, bounded.details.content);
			return withReadContinuation(firstResult, `${displayPrefix}${bounded.text}`, bounded.details.continuation, bounded.details.content, initialOffset, bounded.details.truncation);
		}
		if (hasExplicitLimit && structuredContent !== void 0) return pageResult;
		aggregatedText += `${delimiter}${pageText}`;
		aggregatedContent = candidateContent;
		aggregatedBytes = candidateBytes;
		if (!pageContinuation || reachedEof) return withToolResultText(pageResult, aggregatedText, aggregatedContent);
		if (hasExplicitLimit || page === 3) return withReadContinuation(firstResult, `${aggregatedText}${continuationNotice}`, pageContinuation, aggregatedContent, initialOffset);
		previousNotice = continuationNotice;
		next = pageContinuation;
	}
	return firstResult;
}
function rewriteReadImageHeader(text, mimeType) {
	if (text.startsWith("Read image file [") && text.endsWith("]")) return `Read image file [${mimeType}]`;
	return text;
}
async function normalizeReadImageResult(result, filePath) {
	const content = result.content;
	const image = content.find((block) => block.type === "image");
	if (!image) return result;
	if (!image.data.trim()) throw new Error(`read: image payload is empty (${filePath})`);
	const sniffed = await sniffMimeFromBase64(image.data);
	if (!sniffed) return result;
	if (!sniffed.startsWith("image/")) throw new Error(`read: file looks like ${sniffed} but was treated as ${image.mimeType} (${filePath})`);
	if (sniffed === image.mimeType) return result;
	const nextContent = content.map((block) => {
		if (block.type === "image") return Object.assign({}, block, { mimeType: sniffed });
		if (block.type === "text") return Object.assign({}, block, { text: rewriteReadImageHeader(block.text, sniffed) });
		return block;
	});
	return {
		...result,
		content: nextContent
	};
}
function normalizeReadResultDetails(result) {
	const currentDetails = result.details && typeof result.details === "object" ? result.details : void 0;
	if (currentDetails?.status === "not_found" && typeof currentDetails.path === "string" && currentDetails.optional === true) return {
		...result,
		details: {
			kind: "not_found",
			status: "not_found",
			path: currentDetails.path,
			optional: true
		}
	};
	const displayText = getToolResultText(result) ?? "";
	const image = result.content.find((block) => block.type === "image");
	if (image) return {
		...result,
		details: {
			kind: "image",
			content: displayText,
			mimeType: image.mimeType
		}
	};
	const text = getReadResultContent(result) ?? displayText;
	const truncation = currentDetails?.truncation;
	if (currentDetails && truncation && typeof truncation === "object") {
		const continuation = extractReadContinuation(currentDetails);
		if (!continuation) return {
			...result,
			details: {
				kind: "text",
				content: text
			}
		};
		return {
			...result,
			details: {
				kind: "truncated",
				content: text,
				truncation,
				continuation
			}
		};
	}
	return {
		...result,
		details: {
			kind: "text",
			content: text
		}
	};
}
function resolveContainerPathCandidate(filePath) {
	let candidate = normalizeFileReferencePrefix(filePath);
	if (/^file:\/\//i.test(candidate)) {
		const localFilePath = trySafeFileURLToPath(candidate);
		if (localFilePath) candidate = localFilePath;
		else {
			let parsed;
			try {
				parsed = new URL(candidate);
			} catch {
				return filePath;
			}
			if (parsed.protocol !== "file:") return filePath;
			const host = parsed.hostname.trim().toLowerCase();
			if (host && host !== "localhost") return filePath;
			if (hasEncodedFileUrlSeparator(parsed.pathname)) return filePath;
			let normalizedPathname;
			try {
				normalizedPathname = decodeURIComponent(parsed.pathname).replace(/\\/g, "/");
			} catch {
				return filePath;
			}
			candidate = normalizedPathname;
		}
	}
	return candidate;
}
function mapContainerPathToWorkspaceRoot(params) {
	const candidate = resolveContainerPathCandidate(params.filePath);
	return (params.containerWorkdir ? resolveSandboxPathMapping([{
		hostRoot: params.root,
		containerRoot: params.containerWorkdir
	}], candidate) : null)?.hostPath ?? candidate;
}
function resolveToolPathAgainstWorkspaceRoot(params) {
	const mapped = mapContainerPathToWorkspaceRoot(params);
	const candidate = normalizeFileReferencePrefix(mapped);
	if (isWindowsDrivePath(candidate)) return path.win32.normalize(candidate);
	if (path.isAbsolute(candidate)) return path.resolve(candidate);
	return path.resolve(params.root, candidate || ".");
}
async function readOptionalUtf8File(params) {
	try {
		if (params.sandbox) {
			if (!await params.sandbox.bridge.stat({
				filePath: params.relativePath,
				cwd: params.sandbox.root,
				signal: params.signal
			})) return "";
			return (await params.sandbox.bridge.readFile({
				filePath: params.relativePath,
				cwd: params.sandbox.root,
				signal: params.signal
			})).toString("utf-8");
		}
		return await fs.readFile(params.absolutePath, "utf-8");
	} catch (error) {
		if (error?.code === "ENOENT") return "";
		throw error;
	}
}
async function appendMemoryFlushContent(params) {
	if (!params.sandbox) {
		const root$1 = await root(params.root);
		await runWithAgentToolSourceExecutionScope(params.assertCurrent, async () => {
			params.assertCurrent();
			await root$1.append(params.relativePath, params.content, {
				mkdir: true,
				prependNewlineIfNeeded: true,
				assertBeforeMutation: params.assertCurrent
			});
		});
		return;
	}
	const existing = await runWithAgentToolSourceExecutionScope(params.assertCurrent, async () => {
		const content = await readOptionalUtf8File({
			absolutePath: params.absolutePath,
			relativePath: params.relativePath,
			sandbox: params.sandbox,
			signal: params.signal
		});
		params.assertCurrent();
		return content;
	});
	const next = `${existing}${existing.length > 0 && !existing.endsWith("\n") && !params.content.startsWith("\n") ? "\n" : ""}${params.content}`;
	const sandbox = params.sandbox;
	await runWithAgentToolSourceExecutionScope(params.assertCurrent, async () => {
		params.assertCurrent();
		await sandbox.bridge.writeFile({
			filePath: params.relativePath,
			cwd: sandbox.root,
			data: next,
			mkdir: true,
			signal: params.signal
		});
	});
}
/** Restrict a write tool to appending memory-flush content to one path. */
function wrapToolMemoryFlushAppendOnlyWrite(tool, options) {
	const allowedAbsolutePath = path.resolve(options.root, options.relativePath);
	return {
		...tool,
		description: `Append new memory notes to ${options.relativePath}; creates parent directories. The content is appended verbatim. Send only new text, never existing entries or a rewritten file.`,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const assertCurrent = captureAgentToolSourceExecutionGuard(signal);
			const record = asOptionalObjectRecord(args);
			const normalizedRecord = record ? await normalizeFileToolPathParamsFromKeys(record, ["path"], options.root, options.sandbox?.bridge) : void 0;
			assertRequiredParams(normalizedRecord, REQUIRED_PARAM_GROUPS.write, tool.name);
			const filePath = typeof normalizedRecord?.path === "string" && normalizedRecord.path.trim() ? normalizedRecord.path : void 0;
			const content = typeof record?.content === "string" ? record.content : void 0;
			if (!filePath || content === void 0) return tool.execute(toolCallId, args, signal, onUpdate);
			const resolvedPath = resolveToolPathAgainstWorkspaceRoot({
				filePath,
				root: options.root,
				containerWorkdir: options.containerWorkdir
			});
			if (filePath.startsWith("@") || resolvedPath !== allowedAbsolutePath) throw new Error(`Memory flush writes are restricted to ${options.relativePath}; use that path only.`);
			const contentBefore = await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				const previousContent = await readOptionalUtf8File({
					absolutePath: allowedAbsolutePath,
					relativePath: options.relativePath,
					sandbox: options.sandbox,
					signal
				});
				assertCurrent();
				return previousContent;
			});
			assertNewMemoryFlushContent(contentBefore, content);
			const separator = contentBefore.length > 0 && !contentBefore.endsWith("\n") && !content.startsWith("\n") ? "\n" : "";
			const commit = () => appendMemoryFlushContent({
				absolutePath: allowedAbsolutePath,
				root: options.root,
				relativePath: options.relativePath,
				content,
				sandbox: options.sandbox,
				signal,
				assertCurrent
			});
			const memoryWriteProvenance = options.memoryWriteProvenance;
			if (memoryWriteProvenance && await memoryWriteProvenance.classifies(allowedAbsolutePath)) await memoryWriteProvenance.write({
				absolutePath: allowedAbsolutePath,
				contentBefore,
				contentAfter: `${contentBefore}${separator}${content}`,
				commit
			});
			else await commit();
			return {
				content: [{
					type: "text",
					text: `Appended content to ${options.relativePath}.`
				}],
				details: { changed: true }
			};
		}
	};
}
function isSandboxRootEscapeError(error) {
	return error instanceof Error && /^Path escapes sandbox root \(/i.test(error.message);
}
function withWorkspaceSafeTempHint(error) {
	if (!isSandboxRootEscapeError(error)) return error;
	const message = error.message.includes(".openclaw/tmp/") ? error.message : `${error.message}. Use a relative path under \`.openclaw/tmp/\` inside the workspace for scratch/temp/meta files that file tools need to read or write later.`;
	return new Error(message, { cause: error });
}
async function assertSandboxPathWithinAnyRoot(params) {
	let firstRootEscapeError;
	const seen = /* @__PURE__ */ new Set();
	for (const [index, candidateRoot] of params.roots.entries()) {
		if (!candidateRoot) continue;
		const root = path.resolve(candidateRoot);
		if (seen.has(root)) continue;
		seen.add(root);
		try {
			return await assertSandboxPath({
				filePath: params.filePath,
				cwd: index === 0 ? params.cwd ?? root : root,
				root
			});
		} catch (error) {
			if (!isSandboxRootEscapeError(error)) throw error;
			firstRootEscapeError ??= error;
		}
	}
	throw toErrorObject(firstRootEscapeError ?? /* @__PURE__ */ new Error("Path guard has no configured roots."), "Non-Error thrown");
}
/** Wrap a file tool with workspace guards and optional container path mapping. */
function wrapToolWorkspaceRootGuardWithOptions(tool, root, options) {
	const declaredMappings = options?.bridge?.pathMappings;
	const legacyBridge = options?.bridge && declaredMappings === void 0;
	const mounts = options?.containerMounts ?? declaredMappings ?? (options?.containerWorkdir ? [{
		hostRoot: root,
		containerRoot: options.containerWorkdir
	}] : []);
	const pathParamKeys = options?.pathParamKeys && options.pathParamKeys.length > 0 ? options.pathParamKeys : ["path"];
	return {
		...tool,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const record = asOptionalObjectRecord(args);
			let normalizedRecord;
			for (const key of pathParamKeys) {
				const rawFilePath = record?.[key];
				if (typeof rawFilePath !== "string" || !rawFilePath.trim()) continue;
				const filePath = await normalizeFileToolPathParam(rawFilePath, options?.resolutionCwd ?? root, options?.bridge);
				if (!filePath.trim()) throw malformedXmlArgValuePathError(key);
				if (filePath !== rawFilePath && record) {
					normalizedRecord ??= { ...record };
					normalizedRecord[key] = filePath;
				}
				const guardPath = options?.bridge && !legacyBridge ? options.bridge.resolvePath({
					filePath: resolveContainerPathCandidate(filePath),
					cwd: options.resolutionCwd ?? root
				}).containerPath : filePath;
				const candidate = resolveContainerPathCandidate(guardPath);
				const workspaceMapping = resolveSandboxPathMapping(mounts, candidate);
				const guardedRoot = workspaceMapping?.mapping.hostRoot ?? root;
				const sandboxPath = workspaceMapping?.hostPath ?? candidate;
				const additionalRoots = workspaceMapping ? [] : options?.additionalRoots ?? [];
				let sandboxResult;
				try {
					if (options?.bridge && !legacyBridge && !workspaceMapping) throw new Error(`Path escapes sandbox root (${options.containerWorkdir ?? root}): ${guardPath}`);
					if (!options?.bridge || legacyBridge || options.readPathValidation !== "bridge") sandboxResult = await assertSandboxPathWithinAnyRoot({
						cwd: !workspaceMapping ? options?.resolutionCwd : void 0,
						filePath: sandboxPath,
						roots: [guardedRoot, ...additionalRoots]
					});
				} catch (error) {
					throw withWorkspaceSafeTempHint(error);
				}
				if (options?.normalizeGuardedPathParams && record) {
					normalizedRecord ??= { ...record };
					normalizedRecord[key] = options.bridge && !legacyBridge ? guardPath : sandboxResult.resolved;
				}
			}
			return tool.execute(toolCallId, normalizedRecord ?? args, signal, onUpdate);
		}
	};
}
/** Preserve the sandbox namespace before session tools use host path resolution. */
function wrapSandboxFileToolPath(tool, params) {
	return {
		...tool,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const record = asOptionalObjectRecord(args);
			const rawPath = record?.path;
			const filePath = rawPath === void 0 || rawPath === "" ? params.defaultPath : rawPath;
			if (!record || typeof filePath !== "string") return tool.execute(toolCallId, args, signal, onUpdate);
			const normalized = await normalizeFileToolPathParam(filePath, params.root, params.bridge);
			if (normalized === "") throw malformedXmlArgValuePathError("path");
			const resolved = params.bridge.resolvePath({
				filePath: resolveContainerPathCandidate(normalized),
				cwd: params.root
			});
			return tool.execute(toolCallId, {
				...record,
				path: resolved.containerPath
			}, signal, onUpdate);
		}
	};
}
function createSandboxedReadTool(params) {
	return createOpenClawReadTool(eraseSessionFileTool(createReadTool(params.root, {
		operations: createSandboxReadOperations(params),
		maxBytes: resolveAdaptiveReadMaxBytes(params),
		modelBudget: resolveToolResultBudget(params.modelContextWindowTokens),
		modelHasVision: params.modelHasVision
	})), {
		modelContextWindowTokens: params.modelContextWindowTokens,
		imageSanitization: params.imageSanitization,
		cwd: params.root,
		bridge: params.bridge
	});
}
function createSandboxedWriteTool(params) {
	const base = eraseSessionFileTool(createWriteTool(params.root, { operations: createSandboxMutationOperations(params) }));
	return wrapToolParamValidation(wrapSandboxFileToolPath(base, params), REQUIRED_PARAM_GROUPS.write);
}
function createSandboxedEditTool(params) {
	const base = eraseSessionFileTool(createEditTool(params.root, { operations: createSandboxMutationOperations(params) }));
	return wrapToolParamValidation(wrapSandboxFileToolPath(base, params), REQUIRED_PARAM_GROUPS.edit);
}
function createHostWorkspaceMutationTool(kind, root, options) {
	const operations = createHostMutationOperations(options?.containmentRoot ?? root, options);
	const base = kind === "write" ? eraseSessionFileTool(createWriteTool(root, { operations })) : eraseSessionFileTool(createEditTool(root, { operations }));
	return wrapToolParamValidation(base, REQUIRED_PARAM_GROUPS[kind], root);
}
function createHostWorkspaceWriteTool(root, options) {
	return createHostWorkspaceMutationTool("write", root, options);
}
function createHostWorkspaceEditTool(root, options) {
	return createHostWorkspaceMutationTool("edit", root, options);
}
function createOpenClawReadTool(base, options) {
	const modelBudget = resolveToolResultBudget(options?.modelContextWindowTokens);
	return {
		...base,
		execute: async (toolCallId, params, signal) => {
			const record = asOptionalObjectRecord(params);
			const normalizedRecord = record ? await normalizeFileToolPathParamsFromKeys(record, ["path"], options?.cwd, options?.bridge) : void 0;
			assertRequiredParams(normalizedRecord, REQUIRED_PARAM_GROUPS.read, base.name);
			const filePath = typeof normalizedRecord?.path === "string" ? normalizedRecord.path : "<unknown>";
			const dailyMemoryPath = process.platform === "win32" ? filePath.replace(/\\/g, "/") : filePath;
			const normalizedResult = await normalizeReadImageResult(stripReadTruncationContentDetails(await executeReadWithAdaptivePaging({
				base,
				toolCallId,
				args: normalizedRecord?.optional === void 0 && /^(?:\.\/)*memory\/\d{4}-\d{2}-\d{2}\.md$/u.test(dailyMemoryPath) ? {
					...normalizedRecord,
					optional: true
				} : normalizedRecord ?? {},
				signal,
				maxBytes: resolveAdaptiveReadMaxBytes(options),
				modelBudget
			})), filePath);
			return normalizeReadResultDetails(await sanitizeToolResultImages(normalizedResult, `read:${filePath}`, options?.imageSanitization));
		}
	};
}
/** Serve exact non-filesystem skill locators before workspace path guards run. */
function wrapReadToolWithSkillContent(tool, skills, options) {
	const cwd = options?.cwd ?? process.cwd();
	const resolveInstructionPath = (filePath) => {
		if (filePath.startsWith("node://")) return filePath;
		const mapped = mapContainerPathToWorkspaceRoot({
			filePath,
			root: cwd,
			containerWorkdir: options?.containerWorkdir
		});
		return resolveToCwd(mapped, cwd);
	};
	const instructionContent = new Map((options?.instructionPaths ?? []).map((filePath) => [resolveInstructionPath(filePath), void 0]));
	for (const skill of skills ?? []) instructionContent.set(resolveInstructionPath(skill.filePath), skill.filePath.startsWith("node://") ? skill.readContent : void 0);
	if (instructionContent.size === 0) return tool;
	const instructionDeliveryCache = options?.instructionDeliveryCache;
	const alreadyDeliveredResult = () => {
		const text = "Skill instructions were already served whole earlier in the current model context. Reuse that content; the full document will be served again if compaction removes it.";
		return {
			content: [{
				type: "text",
				text
			}],
			details: {
				kind: "text",
				content: text
			}
		};
	};
	const readContent = (filePath) => {
		const content = instructionContent.get(filePath);
		if (content === void 0) throw Object.assign(/* @__PURE__ */ new Error(`Virtual skill file not found: ${filePath}`), { code: "ENOENT" });
		return content;
	};
	let virtualRead;
	return {
		...tool,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const record = asOptionalObjectRecord(args);
			const rawPath = record?.path;
			const normalizedPath = typeof rawPath === "string" ? normalizeFileToolPathParam(rawPath) : void 0;
			const instructionPath = normalizedPath ? resolveInstructionPath(normalizedPath) : void 0;
			if (!normalizedPath || !instructionPath || !instructionContent.has(instructionPath)) return tool.execute(toolCallId, args, signal, onUpdate);
			for (;;) {
				const priorDelivery = instructionDeliveryCache?.get(instructionPath);
				if (!priorDelivery) break;
				const delivered = await priorDelivery;
				if (instructionDeliveryCache?.get(instructionPath) !== priorDelivery) continue;
				if (delivered) return alreadyDeliveredResult();
				instructionDeliveryCache?.delete(instructionPath);
			}
			let settleDelivery = (_delivered) => void 0;
			let delivery;
			if (instructionDeliveryCache) {
				delivery = new Promise((resolve) => {
					settleDelivery = resolve;
				});
				instructionDeliveryCache.set(instructionPath, delivery);
			}
			const resetDelivery = () => {
				settleDelivery(false);
				if (delivery && instructionDeliveryCache?.get(instructionPath) === delivery) instructionDeliveryCache.delete(instructionPath);
			};
			const instructionTool = typeof instructionContent.get(instructionPath) === "string" ? virtualRead ??= createOpenClawReadTool(eraseSessionFileTool(createReadTool("/", {
				maxBytes: resolveAdaptiveReadMaxBytes(options),
				modelBudget: resolveToolResultBudget(options?.modelContextWindowTokens),
				operations: {
					resolvePath: (filePath) => filePath,
					access: async (filePath) => void readContent(filePath),
					readFile: async (filePath) => Buffer.from(readContent(filePath), "utf8")
				}
			})), options) : tool;
			const instructionArgs = {
				...record,
				path: normalizedPath
			};
			for (const key of [
				"offset",
				"limit",
				"cursor"
			]) delete instructionArgs[key];
			try {
				const result = await instructionTool.execute(toolCallId, instructionArgs, signal, onUpdate);
				const details = result.details;
				const detailsKind = details && typeof details === "object" && "kind" in details && typeof details.kind === "string" ? details.kind : void 0;
				if (detailsKind === "truncated") {
					resetDelivery();
					const text = "Skill instructions cannot be partially served: the whole document exceeds this call's read or model-context budget. Ask the operator to reduce the document or increase the model context.";
					return {
						content: [{
							type: "text",
							text
						}],
						details: {
							kind: "text",
							content: text
						}
					};
				}
				if (detailsKind !== "text") {
					resetDelivery();
					return result;
				}
				settleDelivery(true);
				return result;
			} catch (error) {
				resetDelivery();
				throw error;
			}
		}
	};
}
function createSandboxReadOperations(params) {
	return {
		resolveQueueKey: (absolutePath, signal) => resolveSandboxFileQueueKey(params, absolutePath, signal),
		resolvePath: (filePath) => {
			const normalizedMediaSource = normalizeMediaReferenceSource(filePath);
			if (classifyMediaReferenceSource(normalizedMediaSource).isMediaStoreUrl) return resolveMediaReferenceSandboxPath(normalizedMediaSource, "media/inbound").resolved;
			return resolveContainerPathCandidate(filePath);
		},
		decodeText: ({ buffer, absolutePath }) => params.bridge.resolvePath({
			filePath: absolutePath,
			cwd: params.root
		}).hostPath ? decodeWindowsTextFileBuffer({ buffer }) : decodeWindowsTextFileBuffer({
			buffer,
			platform: "linux"
		}),
		readFile: (absolutePath) => params.bridge.readFile({
			filePath: absolutePath,
			cwd: params.root
		}),
		access: (absolutePath) => assertSandboxFileExists(params, absolutePath),
		detectImageMimeType: async (absolutePath, buffer) => {
			const mime = await detectMime({
				buffer,
				filePath: absolutePath
			});
			return mime?.startsWith("image/") ? mime : void 0;
		}
	};
}
function createSandboxMutationOperations(params) {
	return withMemoryWriteProvenance({
		resolveQueueKey: (absolutePath, signal) => resolveSandboxFileQueueKey(params, absolutePath, signal),
		mkdir: async (dir) => {
			await params.bridge.mkdirp({
				filePath: dir,
				cwd: params.root,
				signal: params.abortSignal
			});
		},
		writeFile: async (absolutePath, content) => {
			await params.bridge.writeFile({
				filePath: absolutePath,
				cwd: params.root,
				data: content,
				signal: params.abortSignal
			});
		},
		readFile: (absolutePath) => params.bridge.readFile({
			filePath: absolutePath,
			cwd: params.root
		}),
		statFile: (absolutePath) => params.bridge.stat({
			filePath: absolutePath,
			cwd: params.root
		}),
		access: (absolutePath) => assertSandboxFileExists(params, absolutePath)
	}, params.memoryWriteProvenance);
}
async function resolveSandboxFileQueueKey(params, absolutePath, signal) {
	return await resolveSandboxFileMutationQueueKey({
		bridge: params.bridge,
		root: params.root,
		filePath: absolutePath,
		cwd: params.root,
		signal
	});
}
async function assertSandboxFileExists(params, absolutePath) {
	const stat = await params.bridge.stat({
		filePath: absolutePath,
		cwd: params.root
	});
	if (!stat) throw createFsAccessError("ENOENT", absolutePath);
	if (stat.type === "directory") throw createFsAccessError("EISDIR", absolutePath);
}
function resolveHostPath(filePath) {
	return path.resolve(expandOsHomePrefix(filePath));
}
async function statHostFile(absolutePath) {
	try {
		const stat = await fs.stat(absolutePath);
		return {
			type: stat.isFile() ? "file" : stat.isDirectory() ? "directory" : "other",
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return null;
		throw error;
	}
}
async function writeWorkspaceFile(root, getRoot, absolutePath, content, abortSignal) {
	const assertCurrent = captureAgentToolSourceExecutionGuard(abortSignal);
	const relative = toRelativeWorkspacePath(root, absolutePath);
	const rootHandle = await getRoot();
	await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
		await rootHandle.write(path.resolve(rootHandle.rootReal, relative), content, {
			mkdir: true,
			mutationSymlinks: "follow-parents-within-root",
			assertBeforeMutation: assertCurrent
		});
	});
}
function createHostMutationOperations(root$2, options) {
	if (!(options?.workspaceOnly ?? false)) return withMemoryWriteProvenance({
		mkdir: async (dir) => {
			const resolved = resolveHostPath(dir);
			const assertCurrent = captureAgentToolSourceExecutionGuard(options?.abortSignal);
			await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				assertCurrent();
				await fs.mkdir(resolved, { recursive: true });
			});
		},
		writeFile: (filePath, content) => writeHostFile(filePath, content, options?.abortSignal),
		readFile: async (absolutePath) => fs.readFile(resolveHostPath(absolutePath)),
		statFile: (absolutePath) => statHostFile(resolveHostPath(absolutePath)),
		access: async (absolutePath) => {
			await fs.access(resolveHostPath(absolutePath));
		}
	}, options?.memoryWriteProvenance);
	let rootPromise;
	const getRoot = () => rootPromise ??= root(root$2);
	return withMemoryWriteProvenance({
		mkdir: async (dir) => {
			const assertCurrent = captureAgentToolSourceExecutionGuard(options?.abortSignal);
			const relative = toRelativeWorkspacePath(root$2, dir, { allowRoot: true });
			const resolved = await resolveRootPath({
				absolutePath: path.resolve(root$2, relative),
				rootPath: root$2,
				boundaryLabel: "workspace root"
			});
			const ancestor = await findExistingAncestor$1(resolved.rootCanonicalPath);
			if (ancestor && ancestor !== resolved.rootCanonicalPath) {
				const ancestorRoot = await root(ancestor);
				await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
					await ancestorRoot.mkdir(`./${path.relative(ancestor, resolved.rootCanonicalPath)}`, { assertBeforeMutation: assertCurrent });
				});
			}
			const rootHandle = await getRoot();
			const canonicalRelative = toRelativeWorkspacePath(rootHandle.rootReal, resolved.canonicalPath, { allowRoot: true });
			const mutationOptions = {
				mutationSymlinks: "reject",
				assertBeforeMutation: assertCurrent
			};
			await runWithAgentToolSourceExecutionScope(assertCurrent, async () => {
				if (canonicalRelative) await rootHandle.mkdir(`./${canonicalRelative}`, mutationOptions);
				else await rootHandle.ensureRoot(mutationOptions);
			});
		},
		writeFile: (absolutePath, content) => writeWorkspaceFile(root$2, getRoot, absolutePath, content, options?.abortSignal),
		readFile: async (absolutePath) => {
			const relative = await toCanonicalRelativeWorkspacePath(root$2, absolutePath);
			const rootHandle = await getRoot();
			return (await rootHandle.read(path.resolve(rootHandle.rootReal, relative))).buffer;
		},
		statFile: async (absolutePath) => {
			const relative = toRelativeWorkspacePath(root$2, absolutePath);
			return statHostFile(path.resolve(root$2, relative));
		},
		access: async (absolutePath) => {
			let relative;
			try {
				relative = await toCanonicalRelativeWorkspacePath(root$2, absolutePath);
			} catch {
				return;
			}
			try {
				const rootHandle = await getRoot();
				await (await rootHandle.open(path.resolve(rootHandle.rootReal, relative))).handle.close().catch(() => {});
			} catch (error) {
				if (error instanceof FsSafeError && error.code === "not-found") throw createFsAccessError("ENOENT", absolutePath);
				if (error instanceof FsSafeError && error.code === "outside-workspace") return;
				throw error;
			}
		}
	}, options?.memoryWriteProvenance);
}
async function toCanonicalRelativeWorkspacePath(root, absolutePath) {
	const lexicalRelative = toRelativeWorkspacePath(root, absolutePath);
	const lexicalPath = path.resolve(root, lexicalRelative);
	const parentPath = path.dirname(lexicalPath);
	const [rootReal, canonicalParentPath] = await Promise.all([fs.realpath(root), canonicalPathFromExistingAncestor$1(parentPath)]);
	const canonicalPath = path.join(canonicalParentPath, path.basename(lexicalPath));
	return toRelativeWorkspacePath(rootReal, canonicalPath);
}
function createFsAccessError(code, filePath) {
	const error = /* @__PURE__ */ new Error(`Sandbox FS error (${code}): ${filePath}`);
	error.code = code;
	return error;
}
//#endregion
//#region src/agents/tools/secrets-tool.ts
const SecretsToolSchema = Type.Object({
	action: stringEnum([
		"request",
		"list",
		"delete"
	], { description: "`request` a value from the human, `list` entry metadata, or `delete` an entry." }),
	name: Type.Optional(Type.String({
		maxLength: 128,
		pattern: "^[A-Z][A-Z0-9_]{0,127}$",
		description: "Entry name in uppercase environment-variable form, also its SecretRef id (STRIPE_API_KEY). Required for request and delete."
	})),
	kind: Type.Optional(stringEnum(["secret"], { description: "Only `secret` may be requested; requested values are never readable back." })),
	allowedHosts: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 253
	}), {
		maxItems: 128,
		uniqueItems: true,
		description: "Exact hostnames allowed to receive a secret, without scheme or port (api.stripe.com). Leaving this empty prevents egress substitution; config SecretRefs remain usable."
	})),
	reason: Type.Optional(Type.String({
		maxLength: 200,
		description: "One line shown to the human explaining why the credential is needed."
	})),
	timeoutSeconds: Type.Optional(Type.Integer({ description: "Maximum human wait in seconds on request; default 900, clamped 30-3600. Earlier run cancellation or overall run timeout still applies." }))
}, { additionalProperties: false });
function readSecretStoreName(params) {
	const name = readToolStringParam(params, "name", { required: true });
	if (!ENV_SECRET_REF_ID_RE.test(name)) throw new ToolInputError("name must be an uppercase environment-variable name");
	return name;
}
/** Normalizes one secure question for both tool-start reservation and tool execution. */
function normalizeSecretsRequestParams(params) {
	if (!isRecord(params)) throw new ToolInputError("secrets arguments must be an object");
	const name = readSecretStoreName(params);
	if ((readToolStringParam(params, "kind", { required: false }) ?? "secret") !== "secret") throw new ToolInputError("kind must be \"secret\"; environment values are set in Settings or the CLI, not requested from the model");
	const allowedHosts = params.allowedHosts;
	if (allowedHosts !== void 0) {
		if (!Array.isArray(allowedHosts) || allowedHosts.length > 128 || allowedHosts.some((host) => typeof host !== "string" || !host || host.length > 253) || new Set(allowedHosts).size !== allowedHosts.length) throw new ToolInputError("allowedHosts must contain up to 128 unique non-empty hostnames");
	}
	if (params.reason !== void 0 && typeof params.reason !== "string") throw new ToolInputError("reason must be a string");
	const reason = typeof params.reason === "string" ? params.reason.trim() : void 0;
	if (reason && reason.length > 200) throw new ToolInputError("reason must be at most 200 characters");
	const timeoutSeconds = normalizeQuestionTimeoutSeconds(params.timeoutSeconds);
	const binding = {
		name,
		kind: "secret",
		...allowedHosts !== void 0 ? { allowedHosts } : {},
		...reason ? { reason } : {}
	};
	return {
		name,
		timeoutSeconds,
		questions: [{
			questionId: "secret_value",
			header: "API key",
			question: `Provide the secret for ${name}.`,
			options: [],
			isSecret: true,
			secretStore: binding
		}]
	};
}
function noSecretAnswerResult(status) {
	const details = { status: "no_answer" };
	return textResult(`${status === "cancelled" ? "The credential request was cancelled; proceed with best judgment." : "No credential arrived; proceed with best judgment."}\n\n${JSON.stringify(details, null, 2)}`, details);
}
async function fetchSecretStore(gatewayCall, signal) {
	const result = await gatewayCall("secrets.store.list", {}, {}, signal ? { signal } : void 0);
	if (!validateSecretsStoreListResult(result)) throw new Error("secrets.store.list returned invalid metadata");
	return result;
}
async function storedSecretResult(name, provider, gatewayCall, signal) {
	const currentPolicy = await fetchSecretStore(gatewayCall, signal).then(({ entries }) => {
		const entry = entries.find((candidate) => candidate.name === name);
		if (!entry) return { status: "missing" };
		if (entry.kind !== "secret") return { status: "kind_changed" };
		const allowedHosts = entry.allowedHosts;
		if (allowedHosts === void 0) return { status: "unavailable" };
		return JSON.stringify(allowedHosts).length > 512 ? {
			status: "omitted",
			allowedHostCount: allowedHosts.length
		} : {
			status: "available",
			allowedHosts
		};
	}).catch(() => ({ status: "unavailable" }));
	signal?.throwIfAborted();
	const details = {
		status: "stored",
		name,
		kind: "secret",
		ref: {
			source: "store",
			provider,
			id: name
		},
		currentPolicy
	};
	return textResult(`${[
		"Stored; value hidden. Use the returned ref for config SecretRefs.",
		"currentPolicy is this entry's current host list; the human may edit it. Not Gateway config or an approval receipt; may change later.",
		"Report current hosts, not proposed hosts. Do not infer why they differ or prescribe Gateway config changes from the difference.",
		"Only available hosts are complete; [] means no egress. Otherwise make no host claims.",
		"Stored does not prove proxy enabled or current exec snapshot; config refs are independent.",
		"Protected exec use is HTTPS proxy substitution only, not SSH/sudo passwords or stdin. `${secret:NAME}` is not shell substitution."
	].join(" ")}\n\n${JSON.stringify(details)}`, details);
}
function listSecretStoreResult(result) {
	const lines = result.entries.map((entry) => {
		const fields = [entry.name, entry.kind];
		if (entry.kind === "secret" && entry.allowedHosts?.length) fields.push(`hosts: ${entry.allowedHosts.join(", ")}`);
		if (entry.kind === "env") fields.push(`value: ${entry.value}`);
		fields.push(`updated: ${new Date(entry.updatedAtMs).toISOString()}`);
		if (entry.updatedBy) fields.push(`by: ${entry.updatedBy}`);
		return fields.join(" | ");
	});
	return textResult(lines.length ? lines.join("\n") : "The secret store is empty.", result);
}
/** Creates the metadata-only secret-store tool and its human-entered write flow. */
function createSecretsTool(params) {
	const gatewayCall = params.gatewayCall ?? callGatewayTool;
	const questionGatewayCall = params.gatewayCall ?? resolveAgentQuestionGatewayCall();
	const storeProvider = resolveDefaultSecretProviderAlias(params.config ?? {}, "store");
	const publishOwnPrompt = params.questionPrompt && isDeliverableMessageChannel(params.questionPrompt.messageChannel ?? "") ? params.questionPrompt.send : void 0;
	return {
		label: "Secrets",
		name: "secrets",
		description: describeSecretsTool(),
		parameters: SecretsToolSchema,
		execute: async (toolCallId, input, signal) => {
			try {
				var _usingCtx$1 = _usingCtx();
				if (!isRecord(input)) throw new ToolInputError("secrets arguments must be an object");
				const action = readToolStringParam(input, "action", { required: true });
				if (action === "list") return listSecretStoreResult(await fetchSecretStore(gatewayCall, signal));
				if (action === "delete") {
					const name = readSecretStoreName(input);
					const result = await gatewayCall("secrets.store.delete", {}, { name }, {
						requireAgentRuntimeIdentity: true,
						...signal ? { signal } : {}
					});
					return jsonResult(result);
				}
				if (action !== "request") throw new ToolInputError(`Unknown secrets action: ${action}`);
				const request = normalizeSecretsRequestParams(input);
				const prompt = _usingCtx$1.u(createQuestionPromptLifetime(signal));
				const delivery = beginAskUserPromptDelivery({
					toolCallId,
					sessionKey: params.sessionKey,
					runId: params.runId,
					agentId: params.agentId,
					questions: request.questions,
					timeoutSeconds: request.timeoutSeconds,
					...publishOwnPrompt ? { deliverPrompt: (questionId) => sendQuestionToolPrompt({
						toolName: "secrets",
						questionId,
						questions: request.questions,
						config: params.config,
						send: publishOwnPrompt,
						signal: prompt.signal
					}) } : {}
				});
				const timeoutMs = request.timeoutSeconds * 1e3;
				let registered = false;
				const cancelPendingQuestion = createGatewayQuestionCanceller({
					gatewayCall: questionGatewayCall,
					questionId: delivery.questionId,
					beforeCancel: prompt.close
				});
				const cancelOnAbort = () => {
					prompt.close();
					delivery.release();
					cancelPendingQuestion("run-abort");
				};
				try {
					signal?.throwIfAborted();
					const registration = asNullableRecord(await questionGatewayCall("question.request", {}, {
						id: delivery.questionId,
						questions: request.questions,
						...params.agentId ? { agentId: params.agentId } : {},
						...params.sessionKey ? { sessionKey: params.sessionKey } : {},
						...params.runId ? { runId: params.runId } : {},
						timeoutMs
					}, {
						scopes: [ADMIN_SCOPE],
						requireAgentRuntimeIdentity: true,
						...signal ? { signal } : {}
					}));
					registered = true;
					if (registration?.id !== delivery.questionId) throw new Error("question.request returned an unexpected question id");
					signal?.addEventListener("abort", cancelOnAbort, { once: true });
					if (signal?.aborted) {
						cancelOnAbort();
						signal.throwIfAborted();
					}
					const answerPromise = awaitGatewayQuestionAnswer({
						gatewayCall: questionGatewayCall,
						questionId: delivery.questionId,
						timeoutMs,
						...signal ? { signal } : {}
					}).finally(prompt.close);
					delivery.markReady();
					let questionResult;
					if (delivery.hasSubscriber) {
						const first = await Promise.race([delivery.waitForDelivery(signal).then((result) => ({
							kind: "delivery",
							result
						})), answerPromise.then((result) => ({
							kind: "answer",
							result
						}))]);
						if (first.kind === "delivery" && first.result.error !== void 0) {
							questionResult = await cancelPendingQuestion("prompt-delivery-failed");
							signal?.throwIfAborted();
							if (!questionResult) throw new Error("credential-request prompt delivery failed", { cause: first.result.error });
						}
					}
					questionResult ??= await answerPromise;
					if (questionResult.status === "pending") questionResult = await cancelPendingQuestion("wait-timeout") ?? questionResult;
					signal?.throwIfAborted();
					if (questionResult.status === "answered") {
						if (questionResult.answers.answers.secret_value?.[0] !== "stored") throw new Error("credential request returned an unexpected answer marker");
						return await storedSecretResult(request.name, storeProvider, gatewayCall, signal);
					}
					if (questionResult.status === "pending" || questionResult.status === "expired" || questionResult.status === "cancelled") return noSecretAnswerResult(questionResult.status);
					throw new Error("question.waitAnswer returned an invalid status");
				} catch (error) {
					const reason = readQuestionRejection(error)?.reason;
					const registrationRefused = error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" || reason === "QUESTION_ID_IN_USE" || reason === "QUESTION_REQUESTER_INACTIVE";
					if (registered || !registrationRefused) await cancelPendingQuestion(signal?.aborted ? "run-abort" : registered ? "tool-error" : "registration-failed");
					throw error;
				} finally {
					signal?.removeEventListener("abort", cancelOnAbort);
					delivery.release();
				}
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		}
	};
}
//#endregion
export { writeHostFile as _, createOpenClawReadTool as a, createSandboxedWriteTool as c, wrapReadToolWithSkillContent as d, wrapSandboxFileToolPath as f, withMemoryWriteProvenance as g, createMemoryWriteProvenanceObserver as h, createHostWorkspaceWriteTool as i, createSkillInstructionDeliveryCache as l, wrapToolWorkspaceRootGuardWithOptions as m, normalizeSecretsRequestParams as n, createSandboxedEditTool as o, wrapToolMemoryFlushAppendOnlyWrite as p, createHostWorkspaceEditTool as r, createSandboxedReadTool as s, createSecretsTool as t, resolveAdaptiveReadMaxBytes as u };
