import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger, j as resolveIntegerOption, v as parseDateFirstTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as mergeDeep } from "./deep-merge-D15Q7TVh.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { k as walkDirectorySync } from "./fs-safe-6Z4UiMS4.mjs";
import { t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { r as createInvalidConfigError, s as isInvalidConfigError } from "./io.invalid-config-CsqYoW4w.mjs";
import { d as acquireFileLockSyncWithRetry } from "./update-managed-service-handoff-database-DQAEU12_.mjs";
import { i as sameSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { E as mergePreparedUserTurnMessageForRuntime, O as readModelPromptProjection } from "./session-actor-memory-owner-BSARM2d5.mjs";
import "./run-termination-Dwf1ksjA.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-BqbJmOEZ.mjs";
import { u as copyInternalToolResultState } from "./internal-hooks-CSjTREUl.mjs";
import { t as buildSessionContext } from "./session-BEAHkH3E.mjs";
import { m as orderSystemUpdateMessages, p as isOpenClawSystemUpdateMessage } from "./messages-Cdi_z_94.mjs";
import { C as generateBranchSummary, N as parseCommandArgs, P as substituteArgs, S as collectEntriesForBranchSummaryFromBranches, c as compactWithoutSummary, g as shouldCompact, h as prepareCompaction, l as estimateContextTokens, n as openClawAgentCoreRuntime, o as calculateContextTokens, s as compact, u as estimateTokens, y as capCompactionSummary } from "./agent-core-BbGXCiXw.mjs";
import { f as resolvePendingRuntimeContextReplay } from "./internal-runtime-context-DLJtDQoI.mjs";
import { t as parseCompactionDetails } from "./compaction-details-BL6y2Xrl.mjs";
import { r as attachRuntimePromptMediaFacts } from "./media-facts-BIPREXi-.mjs";
import { i as rethrowIncognitoSessionError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-BRA1CvXF.mjs";
import { _ as withSessionMetadataPublication, i as captureOwnedTranscriptWriteAssertion, m as withOwnedSessionRestartAbortWrite, y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import { t as createWindowsOutputDecoder } from "./windows-encoding-BZ9QWkjs.mjs";
import { o as createCommandTerminationController, s as releaseChildProcessOutputAfterExit } from "./exec-Bf6uhUA7.mjs";
import { s as spawnCommand, u as waitForCommandSpawn } from "./exec-spawn-Cn2m7YAI.mjs";
import { t as extractFrontmatterBlock } from "./frontmatter-yV_HVb74.mjs";
import { n as resolveJsonSaveTarget } from "./json-file-5C1aYJVp.mjs";
import { t as getAgentDir } from "./config-BWKdpC6X.mjs";
import { n as isToolResultError } from "./tool-result-error-IpvGgAny.mjs";
import { c as enqueueMessageInjection, l as withMessageInjectionAdmission, t as MessageInjectionAcceptedUnconfirmedError } from "./message-injection-authority-Mu3hgByB.mjs";
import { n as createSyntheticSourceInfo, t as createSourceInfo } from "./source-info-CcFiWAof.mjs";
import { t as parseSkillFrontmatter } from "./frontmatter-siV6LZij.mjs";
import { t as materializeSkill } from "./skill-materializer-AWMxpV2k.mjs";
import { t as classifyRateLimitWindow } from "./retry-evidence-BSh9bhDe.mjs";
import { n as getModelRegistryRuntime } from "./model-registry-pyM1O0Zs.mjs";
import { s as getStreamLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { t as canonicalizePath } from "./paths-C-gBEpJw.mjs";
import { t as formatSkillsForPromptBounded } from "./skill-prompt-limits-BAc6uCwo.mjs";
import { t as isRetryableAssistantError } from "./retry-2KnjF4V1.mjs";
import { r as InvalidSummaryOutputError } from "./types-CPdr3cVV.mjs";
import { c as addIgnoreRules, f as wrapToolDefinition, l as normalizeNativePathSeparators, o as interactiveAgentTheme, s as loadThemeFromPath } from "./tools-CsYUPwyX.mjs";
import { n as CONFIG_DIR_NAME, r as getDocsPath } from "./package-metadata-CjeAadCi.mjs";
import { i as wrapUntrustedPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { f as shouldRetainSteeringRuntimeContext, r as attachSteeringRuntimeContext, s as getSteeringRuntimeContext } from "./runtime-context-prompt-D_5rC-8c.mjs";
import { a as agentSessionRunProviderCompaction, i as agentSessionDeferThresholdCompaction, r as createSessionManagerRuntimeRegistry, t as recordSessionModelUsage } from "./session-model-usage-C52vsLrM.mjs";
import { s as SAFETY_MARGIN } from "./context-token-pressure-II9nRGTn.mjs";
import { r as stripStaleThinkingSignaturesForCompactionReplay } from "./thinking-signatures-BcLQ71PH.mjs";
import { n as readRuntimePromptImageFactIndexes } from "./runtime-prompt-image-provenance-DfZxZge1.mjs";
import { t as attachRuntimeUserTurnTranscriptContext } from "./user-turn-transcript-runtime-context-T4-x_GL3.mjs";
import { d as withSessionManagerAppend, f as SessionMetadataCommittedError } from "./session-manager-Mve5HWCW.mjs";
import { a as withSessionManagerWriteAssertion, i as withSessionManagerWrite } from "./session-manager-write-admission-Ca7jiEvG.mjs";
import { a as resolveCompactionRetentionBudget, i as estimateCompactionHistoryTokens, n as createCompactionRequestBudget, o as takePromptCompactionRequestBudget, r as estimateCompactedRequestTokens, s as withCompactionQueuedContext } from "./request-budget-DkXbt99N.mjs";
import { f as generateSessionEntryId, r as getLatestCompactionEntry } from "./session-manager-codec-DTpe_z-3.mjs";
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { homedir } from "node:os";
import * as path$1 from "node:path";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { replaceFileAtomicSync } from "@openclaw/fs-safe/atomic";
import { EventEmitter } from "node:events";
import { isResponsesOutputLimitToolCallError } from "@openclaw/ai/diagnostics";
import { parse as parse$1 } from "yaml";
import { clampThinkingLevel, cleanupSessionResources, getSupportedThinkingLevels, isContextOverflow, modelsAreEqual } from "@openclaw/ai/internal/runtime";
import { isCompactionReplayCheckpoint } from "@openclaw/ai/transports";
//#region src/agents/agent-hooks/compaction-instructions.ts
const DEFAULT_COMPACTION_INSTRUCTIONS = "Write the summary body in the primary language used in the conversation.\nFocus on factual content: what was discussed, decisions made, and current state.\nKeep the required summary structure and section headers unchanged.\nDo not translate or alter code, file paths, identifiers, or error messages.";
const MAX_INSTRUCTION_LENGTH = 800;
/** Blank overrides fall through to runtime configuration, then the language-preserving default. */
function resolveCompactionInstructions(eventInstructions, runtimeInstructions) {
	const resolved = normalizeOptionalString(eventInstructions) ?? normalizeOptionalString(runtimeInstructions) ?? DEFAULT_COMPACTION_INSTRUCTIONS;
	return truncateCodePoints(resolved, MAX_INSTRUCTION_LENGTH);
}
//#endregion
//#region src/agents/compaction-usage.ts
function stripStaleAssistantUsageBeforeLatestCompaction(messages, options = {}) {
	const latestCompactionSummaryIndex = messages.findLastIndex((entry) => entry?.role === "compactionSummary");
	const hasCompactionSummary = latestCompactionSummaryIndex !== -1;
	if (!hasCompactionSummary && options.whenMissingCompactionSummary !== "zeroAssistantUsage") return messages;
	const latestCompactionTimestamp = parseDateFirstTimestampMs(messages[latestCompactionSummaryIndex]?.timestamp);
	let out = messages;
	for (let i = 0; i < messages.length; i += 1) {
		const candidate = messages[i];
		if (candidate?.role !== "assistant" || !candidate.usage || typeof candidate.usage !== "object") continue;
		const messageTimestamp = parseDateFirstTimestampMs(candidate.timestamp);
		if (!(!hasCompactionSummary || (latestCompactionTimestamp !== void 0 && messageTimestamp !== void 0 ? messageTimestamp <= latestCompactionTimestamp : i < latestCompactionSummaryIndex))) continue;
		if (out === messages && !options.mutate) out = [...messages];
		out[i] = {
			...candidate,
			usage: makeZeroUsageSnapshot()
		};
	}
	return out;
}
//#endregion
//#region src/agents/compaction-replay.ts
/** Keep every transcript rebuild safe for the next provider request. */
function sanitizeCompactionReplayMessages(messages) {
	return stripStaleThinkingSignaturesForCompactionReplay(stripStaleAssistantUsageBeforeLatestCompaction(messages));
}
//#endregion
//#region src/agents/utils/frontmatter.ts
const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
const parsePromptFrontmatter = (content) => {
	const normalized = normalizeNewlines(content);
	const extracted = extractFrontmatterBlock(normalized);
	if (!extracted) return {
		frontmatter: {},
		body: normalized
	};
	return {
		frontmatter: parse$1(extracted.block) ?? {},
		body: extracted.body.trim()
	};
};
const stripFrontmatter = (content) => parsePromptFrontmatter(content).body;
//#endregion
//#region src/agents/sessions/agent-session-transcript.ts
/** Persist completed model messages through their existing custody owner. */
async function persistAgentSessionMessage(manager, message, options) {
	applyAssistantDeliveryDirectives(message);
	const appendOptions = { invalidateSerializedPrefixCache: options.invalidateSerializedPrefixCache };
	const append = () => manager.appendMessageAsync(message, appendOptions);
	return message.role === "assistant" && (message.stopReason === "aborted" || message.stopReason === "error") && message.errorCode === "OPENCLAW_RESTART_ABORT" ? await withOwnedSessionRestartAbortWrite(manager.getSessionTarget(), append) : await append();
}
//#endregion
//#region src/agents/sessions/agent-session-utils.ts
function unwrapCoreResult(result) {
	if (result.ok) return result.value;
	throw result.error;
}
function hasPersistedAssistantContent(content) {
	return (typeof content === "string" || Array.isArray(content)) && content.length > 0;
}
function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	let text = "";
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const candidate = block;
		if (candidate.type === "text" && typeof candidate.text === "string") text += candidate.text;
	}
	return text;
}
function replaceAgentMessageInPlace(target, replacement) {
	if (target === replacement) return;
	for (const key of Object.keys(target)) Reflect.deleteProperty(target, key);
	Object.assign(target, replacement);
}
function estimateMessagesFromContent(messages) {
	return messages.reduce((total, message) => total + estimateTokens(message), 0);
}
//#endregion
//#region src/agents/sessions/auth-guidance.ts
/**
* Shared user-facing auth guidance for session/model selection failures.
*
* Uses docs paths instead of provider-specific instructions so guidance stays correct across OAuth/API-key providers.
*/
const UNKNOWN_PROVIDER = "unknown";
/** Returns the standard provider login help block. */
function getProviderLoginHelp() {
	return [
		"Use /login to log into a provider via OAuth or API key. See:",
		`  ${join(getDocsPath(), "providers.md")}`,
		`  ${join(getDocsPath(), "models.md")}`
	].join("\n");
}
/** Formats the message shown before a model is selected. */
function formatNoModelSelectedMessage() {
	return `No model selected.\n\n${getProviderLoginHelp()}\n\nThen use /model to select a model.`;
}
/** Formats the missing API key guidance for a provider or unknown selected model. */
function formatNoApiKeyFoundMessage(provider) {
	return `No API key found for ${provider === UNKNOWN_PROVIDER ? "the selected model" : provider}.\n\n${getProviderLoginHelp()}`;
}
//#endregion
//#region src/agents/sessions/exec.ts
const DEFAULT_OUTPUT_LIMIT_CHARS = 16777216;
const FORCE_KILL_GRACE_MS = 5e3;
function decodeCapturedOutput(decoder, chunk) {
	return Buffer.isBuffer(chunk) ? decoder.decode(chunk) : `${decoder.flush()}${chunk}`;
}
function clampMaxOutputChars(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_OUTPUT_LIMIT_CHARS;
	return Math.max(1, Math.floor(value));
}
function appendCapturedOutput(current, chunk, maxOutputChars, truncateTail) {
	const combined = `${current.text}${chunk}`;
	const overflowChars = Math.max(0, combined.length - maxOutputChars);
	const nextText = overflowChars === 0 ? combined : truncateTail ? sliceUtf16Safe(combined, overflowChars) : sliceUtf16Safe(combined, 0, maxOutputChars);
	return {
		text: nextText,
		truncatedChars: current.truncatedChars + combined.length - nextText.length
	};
}
async function execCommand(command, args, cwd, options) {
	const cancelController = new AbortController();
	const startupCanceled = createDeferredCore();
	let waitingForSpawn = true;
	let acceptingOutput = true;
	let killed = false;
	let terminationStarted = false;
	let timeoutId;
	let terminationController;
	const killProcess = () => {
		killed = true;
		if (terminationController) {
			if (!terminationStarted) {
				terminationStarted = true;
				if (!terminationController.terminate()) cancelController.abort();
			}
		} else cancelController.abort();
		if (waitingForSpawn) startupCanceled.resolve({
			stdout: "",
			stderr: "",
			code: 1,
			killed: true
		});
	};
	try {
		const proc = spawnCommand([command, ...args], {
			buffer: false,
			cancelSignal: cancelController.signal,
			cwd,
			detached: process.platform !== "win32",
			forceKillAfterDelay: FORCE_KILL_GRACE_MS,
			reject: false,
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		options?.signal?.addEventListener("abort", killProcess, { once: true });
		if (options?.timeout && options.timeout > 0) timeoutId = setTimeout(killProcess, options.timeout);
		const completion = (async () => {
			if (proc.pid === void 0) await waitForCommandSpawn(proc);
			waitingForSpawn = false;
			const releaseOutput = releaseChildProcessOutputAfterExit(proc.nodeChildProcess);
			let childExited = false;
			proc.nodeChildProcess.once("exit", () => {
				childExited = true;
			});
			let settled = false;
			const termination = createCommandTerminationController({
				child: proc.nodeChildProcess,
				cancelController,
				processTree: { mode: "graceful" },
				killGraceMs: FORCE_KILL_GRACE_MS,
				isChildExited: () => childExited,
				isCommandSettled: () => settled
			});
			terminationController = termination;
			const captures = {
				stdout: {
					text: "",
					truncatedChars: 0
				},
				stderr: {
					text: "",
					truncatedChars: 0
				}
			};
			const decoders = {
				stdout: createWindowsOutputDecoder({ preserveUtf8Bom: true }),
				stderr: createWindowsOutputDecoder({ preserveUtf8Bom: true })
			};
			const maxOutputChars = clampMaxOutputChars(options?.maxOutputChars);
			const truncateOutput = options?.maxOutputChars !== void 0;
			let outputLimitExceeded;
			const captureOutput = (stream, chunk) => {
				const before = captures[stream].truncatedChars;
				captures[stream] = appendCapturedOutput(captures[stream], chunk, maxOutputChars, truncateOutput);
				if (!truncateOutput && captures[stream].truncatedChars > before && !outputLimitExceeded) {
					outputLimitExceeded = stream;
					return true;
				}
				return false;
			};
			const ignoreOutputStreamError = () => {};
			for (const stream of ["stdout", "stderr"]) {
				proc[stream]?.on("error", ignoreOutputStreamError);
				proc[stream]?.on("data", (data) => {
					if (!acceptingOutput) return;
					if (captureOutput(stream, decodeCapturedOutput(decoders[stream], data))) killProcess();
				});
			}
			if (killed) killProcess();
			try {
				const code = await proc.then((result) => result.exitCode ?? (result.failed ? 1 : 0), () => 1);
				settled = true;
				clearTimeout(timeoutId);
				options?.signal?.removeEventListener("abort", killProcess);
				const cleanup = await termination.settle();
				for (const stream of ["stdout", "stderr"]) captureOutput(stream, decoders[stream].flush());
				if (outputLimitExceeded) captures.stderr = appendCapturedOutput(captures.stderr, `${captures.stderr.text ? "\n" : ""}exec ${outputLimitExceeded} exceeded output limit ${maxOutputChars} chars`, maxOutputChars, true);
				const result = {
					stdout: captures.stdout.text,
					stderr: captures.stderr.text,
					stdoutTruncatedChars: captures.stdout.truncatedChars || void 0,
					stderrTruncatedChars: captures.stderr.truncatedChars || void 0,
					outputLimitExceeded,
					code: outputLimitExceeded ? 1 : code,
					killed
				};
				if (cleanup === "uncertain") throw new CommandProcessCleanupError({ cause: result });
				return result;
			} finally {
				releaseOutput();
			}
		})();
		if (options?.signal?.aborted) killProcess();
		return await Promise.race([completion, startupCanceled.promise]);
	} finally {
		acceptingOutput = false;
		clearTimeout(timeoutId);
		options?.signal?.removeEventListener("abort", killProcess);
	}
}
//#endregion
//#region src/agents/sessions/extensions/loader.ts
/**
* Create a runtime with throwing stubs for action methods.
* Runner.bindCore() replaces these with real implementations.
*/
function createExtensionRuntime() {
	const notInitialized = () => {
		throw new Error("Extension runtime not initialized. Action methods cannot be called during extension loading.");
	};
	let staleMessage;
	const assertActive = () => {
		if (staleMessage) throw new Error(staleMessage);
	};
	const runtime = {
		sendMessage: notInitialized,
		sendUserMessage: notInitialized,
		appendEntry: notInitialized,
		appendEntryAsync: notInitialized,
		setSessionName: notInitialized,
		setSessionNameAsync: notInitialized,
		getSessionName: notInitialized,
		setLabel: notInitialized,
		setLabelAsync: notInitialized,
		getActiveTools: notInitialized,
		getAllTools: notInitialized,
		setActiveTools: notInitialized,
		refreshTools: () => {},
		getCommands: notInitialized,
		setModel: () => Promise.reject(/* @__PURE__ */ new Error("Extension runtime not initialized")),
		getThinkingLevel: notInitialized,
		setThinkingLevel: notInitialized,
		flagValues: /* @__PURE__ */ new Map(),
		pendingProviderRegistrations: [],
		assertActive,
		invalidate: (message) => {
			staleMessage ??= message ?? "This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().";
		},
		registerProvider: (name, config, extensionPath = "<unknown>") => {
			runtime.pendingProviderRegistrations.push({
				name,
				config,
				extensionPath
			});
		},
		unregisterProvider: (name) => {
			runtime.pendingProviderRegistrations = runtime.pendingProviderRegistrations.filter((r) => r.name !== name);
		}
	};
	return runtime;
}
/**
* Create the ExtensionAPI for an extension.
* Registration methods write to the extension object.
* Action methods delegate to the shared runtime.
*/
function createExtensionAPI(extension, runtime, cwd, eventBus) {
	const activeRuntime = () => {
		runtime.assertActive();
		return runtime;
	};
	const persist = async (action) => {
		const owner = activeRuntime();
		const pending = action(owner);
		if (!pending) throw new Error("Extension host must bind worker persistence with bindCoreAsync");
		const result = await pending;
		owner.assertActive();
		return result;
	};
	return {
		on(event, handler) {
			runtime.assertActive();
			const list = extension.handlers.get(event) ?? [];
			list.push(handler);
			extension.handlers.set(event, list);
		},
		registerTool(tool) {
			runtime.assertActive();
			extension.tools.set(tool.name, {
				definition: tool,
				sourceInfo: extension.sourceInfo
			});
			runtime.refreshTools();
		},
		registerCommand(name, options) {
			runtime.assertActive();
			extension.commands.set(name, {
				name,
				sourceInfo: extension.sourceInfo,
				...options
			});
		},
		registerShortcut(shortcut, options) {
			runtime.assertActive();
			extension.shortcuts.set(shortcut, {
				shortcut,
				extensionPath: extension.path,
				...options
			});
		},
		registerFlag(name, options) {
			runtime.assertActive();
			extension.flags.set(name, {
				name,
				extensionPath: extension.path,
				...options
			});
			if (options.default !== void 0 && !runtime.flagValues.has(name)) runtime.flagValues.set(name, options.default);
		},
		registerMessageRenderer(customType, renderer) {
			runtime.assertActive();
			extension.messageRenderers.set(customType, renderer);
		},
		getFlag(name) {
			runtime.assertActive();
			if (!extension.flags.has(name)) return;
			return runtime.flagValues.get(name);
		},
		sendMessage: (message, options) => {
			activeRuntime().sendMessage(message, options);
		},
		sendUserMessage: (content, options) => {
			activeRuntime().sendUserMessage(content, options);
		},
		appendEntry: (customType, data) => {
			warnSessionPersistenceDeprecation("ExtensionAPI.appendEntry", "appendEntryAsync");
			activeRuntime().appendEntry(customType, data);
		},
		appendEntryAsync: (customType, data) => persist((owner) => owner.appendEntryAsync?.(customType, data)),
		setSessionName: (name) => {
			warnSessionPersistenceDeprecation("ExtensionAPI.setSessionName", "setSessionNameAsync");
			activeRuntime().setSessionName(name);
		},
		setSessionNameAsync: (name) => persist((owner) => owner.setSessionNameAsync?.(name)),
		getSessionName: () => activeRuntime().getSessionName(),
		setLabel: (entryId, label) => {
			warnSessionPersistenceDeprecation("ExtensionAPI.setLabel", "setLabelAsync");
			activeRuntime().setLabel(entryId, label);
		},
		setLabelAsync: (entryId, label) => persist((owner) => owner.setLabelAsync?.(entryId, label)),
		exec(command, args, options) {
			runtime.assertActive();
			return execCommand(command, args, options?.cwd ?? cwd, options);
		},
		getActiveTools: () => activeRuntime().getActiveTools(),
		getAllTools: () => activeRuntime().getAllTools(),
		setActiveTools: (toolNames) => {
			activeRuntime().setActiveTools(toolNames);
		},
		getCommands: () => activeRuntime().getCommands(),
		setModel: (model) => activeRuntime().setModel(model),
		getThinkingLevel: () => activeRuntime().getThinkingLevel(),
		setThinkingLevel: (level) => activeRuntime().setThinkingLevel(level),
		registerProvider: (name, config) => {
			activeRuntime().registerProvider(name, config, extension.path);
		},
		unregisterProvider: (name) => {
			activeRuntime().unregisterProvider(name, extension.path);
		},
		events: eventBus
	};
}
async function loadExtensionFromFactory(factory, cwd, eventBus, runtime, extensionPath = "<inline>") {
	const source = extensionPath.startsWith("<") && extensionPath.endsWith(">") ? extensionPath.slice(1, -1).split(":")[0] || "temporary" : "local";
	const baseDir = extensionPath.startsWith("<") ? void 0 : path$1.dirname(extensionPath);
	const extension = {
		path: extensionPath,
		resolvedPath: extensionPath,
		sourceInfo: createSyntheticSourceInfo(extensionPath, {
			source,
			baseDir
		}),
		handlers: /* @__PURE__ */ new Map(),
		tools: /* @__PURE__ */ new Map(),
		messageRenderers: /* @__PURE__ */ new Map(),
		commands: /* @__PURE__ */ new Map(),
		flags: /* @__PURE__ */ new Map(),
		shortcuts: /* @__PURE__ */ new Map()
	};
	await factory(createExtensionAPI(extension, runtime, cwd, eventBus));
	return extension;
}
//#endregion
//#region src/agents/sessions/extensions/metadata-actions.ts
function bindPersistenceScope(manager, runtime) {
	return (action) => {
		runtime.assertActive();
		const target = manager.getSessionTarget();
		const assertCurrent = () => {
			runtime.assertActive();
			const current = manager.getSessionTarget();
			if (!sameSessionTranscriptTargetBinding(target, current)) throw new Error("Extension session manager changed before metadata persistence");
		};
		return withSessionManagerWriteAssertion(manager, assertCurrent, () => target ? withSessionTranscriptWriteAssertion(target, assertCurrent, action) : action());
	};
}
/** Retain the bound runtime and manager through queued metadata transaction/commit grants. */
function bindExtensionMetadataActions(manager, runtime, actions) {
	const run = bindPersistenceScope(manager, runtime);
	runtime.setModel = (model) => run(() => actions.setModel(model));
	runtime.setThinkingLevel = (level) => run(() => actions.setThinkingLevel(level));
}
/** Bind awaited writes to the same runtime and transcript target through worker commit. */
function bindExtensionPersistenceActions(manager, runtime, actions) {
	const run = bindPersistenceScope(manager, runtime);
	runtime.appendEntryAsync = (customType, data) => run(() => actions.appendEntryAsync(customType, data));
	runtime.setSessionNameAsync = (name) => run(() => actions.setSessionNameAsync(name));
	runtime.setLabelAsync = (entryId, label) => run(() => actions.setLabelAsync(entryId, label));
}
//#endregion
//#region src/agents/sessions/extensions/provider-actions.ts
function bindExtensionProviderActions(runtime, modelRegistry, emitError, providerActions) {
	const registerProvider = (name, config) => {
		if (providerActions?.registerProvider) providerActions.registerProvider(name, config);
		else modelRegistry.registerProvider(name, config);
	};
	for (const { name, config, extensionPath } of runtime.pendingProviderRegistrations) try {
		registerProvider(name, config);
	} catch (err) {
		emitError({
			extensionPath,
			event: "register_provider",
			error: coerceErrorMessage(err),
			stack: err instanceof Error ? err.stack : void 0
		});
	}
	runtime.pendingProviderRegistrations = [];
	runtime.registerProvider = registerProvider;
	runtime.unregisterProvider = (name) => {
		if (providerActions?.unregisterProvider) {
			providerActions.unregisterProvider(name);
			return;
		}
		modelRegistry.unregisterProvider(name);
	};
}
//#endregion
//#region src/agents/sessions/extensions/runner.ts
const RESERVED_KEYBINDINGS_FOR_EXTENSION_CONFLICTS = [
	"app.interrupt",
	"app.clear",
	"app.exit",
	"app.suspend",
	"app.thinking.cycle",
	"app.model.cycleForward",
	"app.model.cycleBackward",
	"app.model.select",
	"app.tools.expand",
	"app.thinking.toggle",
	"app.editor.external",
	"app.message.followUp",
	"tui.input.submit",
	"tui.select.confirm",
	"tui.select.cancel",
	"tui.input.copy",
	"tui.editor.deleteToLineEnd"
];
const buildBuiltinKeybindings = (resolvedKeybindings) => {
	const builtinKeybindings = {};
	for (const [keybinding, keys] of Object.entries(resolvedKeybindings)) {
		if (keys === void 0) continue;
		const keyList = Array.isArray(keys) ? keys : [keys];
		const restrictOverride = RESERVED_KEYBINDINGS_FOR_EXTENSION_CONFLICTS.includes(keybinding);
		for (const key of keyList) {
			const normalizedKey = key.toLowerCase();
			if (builtinKeybindings[normalizedKey]?.restrictOverride && !restrictOverride) continue;
			builtinKeybindings[normalizedKey] = {
				keybinding,
				restrictOverride
			};
		}
	}
	return builtinKeybindings;
};
async function emitSessionShutdownEvent(extensionRunner, event) {
	if (extensionRunner.hasHandlers("session_shutdown")) {
		await extensionRunner.emit(event);
		return true;
	}
	return false;
}
const noOpUIContext = {
	select: async () => void 0,
	confirm: async () => false,
	input: async () => void 0,
	notify: () => {},
	onTerminalInput: () => () => {},
	setStatus: () => {},
	setWorkingMessage: () => {},
	setWorkingVisible: () => {},
	setWorkingIndicator: () => {},
	setHiddenThinkingLabel: () => {},
	setWidget: () => {},
	setFooter: () => {},
	setHeader: () => {},
	setTitle: () => {},
	custom: async () => void 0,
	pasteToEditor: () => {},
	setEditorText: () => {},
	getEditorText: () => "",
	editor: async () => void 0,
	addAutocompleteProvider: () => {},
	setEditorComponent: () => {},
	getEditorComponent: () => void 0,
	get theme() {
		return interactiveAgentTheme;
	},
	getAllThemes: () => [],
	getTheme: () => void 0,
	setTheme: () => ({
		success: false,
		error: "UI not available"
	}),
	getToolsExpanded: () => false,
	setToolsExpanded: () => {}
};
const noOpCommandContextActions = {
	waitForIdle: async () => {},
	newSession: async () => ({ cancelled: false }),
	fork: async () => ({ cancelled: false }),
	navigateTree: async () => ({ cancelled: false }),
	switchSession: async () => ({ cancelled: false }),
	reload: async () => {}
};
var ExtensionRunner = class {
	constructor(extensions, runtime, cwd, sessionManager, modelRegistry) {
		this.extensions = extensions;
		this.runtime = runtime;
		this.cwd = cwd;
		this.sessionManager = sessionManager;
		this.modelRegistry = modelRegistry;
		this.errorListeners = /* @__PURE__ */ new Set();
		this.getModel = () => void 0;
		this.isIdleFn = () => true;
		this.getSignalFn = () => void 0;
		this.waitForIdleFn = noOpCommandContextActions.waitForIdle;
		this.abortFn = () => {};
		this.hasPendingMessagesFn = () => false;
		this.getContextUsageFn = () => void 0;
		this.compactFn = () => {};
		this.getSystemPromptFn = () => "";
		this.newSessionHandler = noOpCommandContextActions.newSession;
		this.forkHandler = noOpCommandContextActions.fork;
		this.navigateTreeHandler = noOpCommandContextActions.navigateTree;
		this.switchSessionHandler = noOpCommandContextActions.switchSession;
		this.reloadHandler = noOpCommandContextActions.reload;
		this.shutdownHandler = () => {};
		this.shortcutDiagnostics = [];
		this.commandDiagnostics = [];
		this.uiContext = noOpUIContext;
	}
	/** Bind host actions with worker-backed persistence; legacy bindCore remains source-compatible. */
	bindCoreAsync(actions, contextActions, providerActions) {
		this.bindCore(actions, contextActions, providerActions);
		bindExtensionPersistenceActions(this.sessionManager, this.runtime, actions);
	}
	/** @deprecated Use bindCoreAsync with ExtensionActionsV2. Supported through 2026-12-31. */
	bindCore(actions, contextActions, providerActions) {
		this.runtime.sendMessage = actions.sendMessage;
		this.runtime.sendUserMessage = actions.sendUserMessage;
		this.runtime.appendEntry = actions.appendEntry;
		this.runtime.setSessionName = actions.setSessionName;
		this.runtime.getSessionName = actions.getSessionName;
		this.runtime.setLabel = actions.setLabel;
		this.runtime.getActiveTools = actions.getActiveTools;
		this.runtime.getAllTools = actions.getAllTools;
		this.runtime.setActiveTools = actions.setActiveTools;
		this.runtime.refreshTools = actions.refreshTools;
		this.runtime.getCommands = actions.getCommands;
		bindExtensionMetadataActions(this.sessionManager, this.runtime, actions);
		this.runtime.getThinkingLevel = actions.getThinkingLevel;
		this.getModel = contextActions.getModel;
		this.isIdleFn = contextActions.isIdle;
		this.getSignalFn = contextActions.getSignal;
		this.abortFn = contextActions.abort;
		this.hasPendingMessagesFn = contextActions.hasPendingMessages;
		this.shutdownHandler = contextActions.shutdown;
		this.getContextUsageFn = contextActions.getContextUsage;
		this.compactFn = contextActions.compact;
		this.getSystemPromptFn = contextActions.getSystemPrompt;
		bindExtensionProviderActions(this.runtime, this.modelRegistry, (error) => this.emitError(error), providerActions);
	}
	bindCommandContext(actions) {
		const boundActions = actions ?? noOpCommandContextActions;
		this.waitForIdleFn = boundActions.waitForIdle;
		this.newSessionHandler = boundActions.newSession;
		this.forkHandler = boundActions.fork;
		this.navigateTreeHandler = boundActions.navigateTree;
		this.switchSessionHandler = boundActions.switchSession;
		this.reloadHandler = boundActions.reload;
	}
	setUIContext(uiContext) {
		this.uiContext = uiContext ?? noOpUIContext;
	}
	getUIContext() {
		return this.uiContext;
	}
	hasUI() {
		return this.uiContext !== noOpUIContext;
	}
	getExtensionPaths() {
		return this.extensions.map((e) => e.path);
	}
	/** Get all registered tools from all extensions (first registration per name wins). */
	getAllRegisteredTools() {
		const toolsByName = /* @__PURE__ */ new Map();
		for (const ext of this.extensions) for (const tool of ext.tools.values()) if (!toolsByName.has(tool.definition.name)) toolsByName.set(tool.definition.name, tool);
		return Array.from(toolsByName.values());
	}
	getToolDefinition(toolName) {
		for (const ext of this.extensions) {
			const tool = ext.tools.get(toolName);
			if (tool) return tool.definition;
		}
	}
	getFlags() {
		const allFlags = /* @__PURE__ */ new Map();
		for (const ext of this.extensions) for (const [name, flag] of ext.flags) if (!allFlags.has(name)) allFlags.set(name, flag);
		return allFlags;
	}
	setFlagValue(name, value) {
		this.runtime.flagValues.set(name, value);
	}
	getFlagValues() {
		return new Map(this.runtime.flagValues);
	}
	getShortcuts(resolvedKeybindings) {
		this.shortcutDiagnostics = [];
		const builtinKeybindings = buildBuiltinKeybindings(resolvedKeybindings);
		const extensionShortcuts = /* @__PURE__ */ new Map();
		const addDiagnostic = (message, extensionPath) => {
			this.shortcutDiagnostics.push({
				type: "warning",
				message,
				path: extensionPath
			});
			if (!this.hasUI()) console.warn(message);
		};
		for (const ext of this.extensions) for (const [key, shortcut] of ext.shortcuts) {
			const normalizedKey = key.toLowerCase();
			const builtInKeybinding = builtinKeybindings[normalizedKey];
			if (builtInKeybinding?.restrictOverride === true) {
				addDiagnostic(`Extension shortcut '${key}' from ${shortcut.extensionPath} conflicts with built-in shortcut. Skipping.`, shortcut.extensionPath);
				continue;
			}
			if (builtInKeybinding?.restrictOverride === false) addDiagnostic(`Extension shortcut conflict: '${key}' is built-in shortcut for ${builtInKeybinding.keybinding} and ${shortcut.extensionPath}. Using ${shortcut.extensionPath}.`, shortcut.extensionPath);
			const existingExtensionShortcut = extensionShortcuts.get(normalizedKey);
			if (existingExtensionShortcut) addDiagnostic(`Extension shortcut conflict: '${key}' registered by both ${existingExtensionShortcut.extensionPath} and ${shortcut.extensionPath}. Using ${shortcut.extensionPath}.`, shortcut.extensionPath);
			extensionShortcuts.set(normalizedKey, shortcut);
		}
		return extensionShortcuts;
	}
	getShortcutDiagnostics() {
		return this.shortcutDiagnostics;
	}
	invalidate(message = "This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().") {
		if (!this.staleMessage) {
			this.staleMessage = message;
			this.runtime.invalidate(message);
		}
	}
	requireActive() {
		if (this.staleMessage) throw new Error(this.staleMessage);
		this.runtime.assertActive();
		return this;
	}
	onError(listener) {
		return registerListener(this.errorListeners, listener);
	}
	emitError(error) {
		for (const listener of this.errorListeners) listener(error);
	}
	hasHandlers(eventType) {
		return this.extensions.some((ext) => (ext.handlers.get(eventType)?.length ?? 0) > 0);
	}
	getMessageRenderer(customType) {
		for (const ext of this.extensions) {
			const renderer = ext.messageRenderers.get(customType);
			if (renderer) return renderer;
		}
	}
	resolveRegisteredCommands() {
		const commands = [];
		const counts = /* @__PURE__ */ new Map();
		for (const ext of this.extensions) for (const command of ext.commands.values()) {
			commands.push(command);
			counts.set(command.name, (counts.get(command.name) ?? 0) + 1);
		}
		const seen = /* @__PURE__ */ new Map();
		const takenInvocationNames = /* @__PURE__ */ new Set();
		return commands.map((command) => {
			const occurrence = (seen.get(command.name) ?? 0) + 1;
			seen.set(command.name, occurrence);
			let invocationName = (counts.get(command.name) ?? 0) > 1 ? `${command.name}:${occurrence}` : command.name;
			if (takenInvocationNames.has(invocationName)) {
				let suffix = occurrence;
				do {
					suffix++;
					invocationName = `${command.name}:${suffix}`;
				} while (takenInvocationNames.has(invocationName));
			}
			takenInvocationNames.add(invocationName);
			return Object.assign({}, command, { invocationName });
		});
	}
	getRegisteredCommands() {
		this.commandDiagnostics = [];
		return this.resolveRegisteredCommands();
	}
	getCommandDiagnostics() {
		return this.commandDiagnostics;
	}
	getCommand(name) {
		return this.resolveRegisteredCommands().find((command) => command.invocationName === name);
	}
	/**
	* Request a graceful shutdown. Called by extension tools and event handlers.
	* The actual shutdown behavior is provided by the mode via bindExtensions().
	*/
	shutdown() {
		this.shutdownHandler();
	}
	/**
	* Create an ExtensionContext for use in event handlers and tool execution.
	* Context values are resolved at call time, so changes via bindCore/bindUI are reflected.
	*/
	createContext() {
		const requireActiveRunner = () => this.requireActive();
		const getModel = this.getModel;
		return {
			get ui() {
				return requireActiveRunner().uiContext;
			},
			get hasUI() {
				return requireActiveRunner().hasUI();
			},
			get cwd() {
				return requireActiveRunner().cwd;
			},
			get sessionManager() {
				return requireActiveRunner().sessionManager;
			},
			get modelRegistry() {
				return requireActiveRunner().modelRegistry;
			},
			get model() {
				requireActiveRunner();
				return getModel();
			},
			isIdle: () => requireActiveRunner().isIdleFn(),
			get signal() {
				return requireActiveRunner().getSignalFn();
			},
			abort: () => requireActiveRunner().abortFn(),
			hasPendingMessages: () => requireActiveRunner().hasPendingMessagesFn(),
			shutdown: () => requireActiveRunner().shutdownHandler(),
			getContextUsage: () => requireActiveRunner().getContextUsageFn(),
			compact: (options) => requireActiveRunner().compactFn(options),
			getSystemPrompt: () => requireActiveRunner().getSystemPromptFn()
		};
	}
	createCommandContext() {
		return Object.assign(this.createContext(), {
			waitForIdle: () => this.requireActive().waitForIdleFn(),
			newSession: (options) => this.requireActive().newSessionHandler(options),
			fork: (entryId, options) => this.requireActive().forkHandler(entryId, options),
			navigateTree: (targetId, options) => this.requireActive().navigateTreeHandler(targetId, options),
			switchSession: (sessionPath, options) => this.requireActive().switchSessionHandler(sessionPath, options),
			reload: () => this.requireActive().reloadHandler()
		});
	}
	async dispatchHandlers(eventType, invoke, ctx) {
		let handlerContext = ctx;
		for (const ext of this.extensions) for (const handler of ext.handlers.get(eventType) ?? []) {
			handlerContext ??= this.createContext();
			try {
				const result = await invoke(handler, handlerContext, ext.path);
				if (result !== void 0) return result;
			} catch (err) {
				if (eventType === "tool_call") throw err;
				rethrowIncognitoSessionError(err);
				if (err instanceof SessionMetadataCommittedError) throw err;
				this.emitError({
					extensionPath: ext.path,
					event: eventType,
					error: coerceErrorMessage(err),
					stack: err instanceof Error ? err.stack : void 0
				});
			}
		}
	}
	async emit(event) {
		let result;
		return await this.dispatchHandlers(event.type, async (handler, ctx) => {
			const handlerResult = await handler(event, ctx);
			if ((event.type === "session_before_switch" || event.type === "session_before_fork" || event.type === "session_before_compact" || event.type === "session_before_tree") && handlerResult) {
				result = handlerResult;
				if (result.cancel) return result;
			}
		}) ?? result;
	}
	async emitMessageEnd(event) {
		let currentMessage = event.message;
		let modified = false;
		await this.dispatchHandlers("message_end", async (handler, ctx, extensionPath) => {
			const handlerResult = await handler({
				...event,
				message: currentMessage
			}, ctx);
			if (handlerResult?.message) {
				if (handlerResult.message.role !== currentMessage.role) this.emitError({
					extensionPath,
					event: "message_end",
					error: "message_end handlers must return a message with the same role"
				});
				else {
					currentMessage = handlerResult.message;
					modified = true;
				}
			}
		});
		return modified ? currentMessage : void 0;
	}
	async emitToolResult(event) {
		const currentEvent = { ...event };
		let modified = false;
		await this.dispatchHandlers("tool_result", async (handler, ctx) => {
			const handlerResult = await handler(currentEvent, ctx);
			if (handlerResult?.content !== void 0) {
				currentEvent.content = handlerResult.content;
				modified = true;
			}
			if (handlerResult?.details !== void 0) {
				currentEvent.details = handlerResult.details;
				modified = true;
			}
			if (handlerResult?.isError !== void 0 || isToolResultError(handlerResult)) {
				currentEvent.isError = handlerResult?.isError ?? true;
				modified = true;
			}
			if (handlerResult?.terminate !== void 0) {
				currentEvent.terminate = handlerResult.terminate;
				modified = true;
			}
		});
		if (!modified) return;
		return {
			content: currentEvent.content,
			details: currentEvent.details,
			isError: currentEvent.isError,
			terminate: currentEvent.terminate
		};
	}
	async emitToolCall(event) {
		let result;
		await this.dispatchHandlers("tool_call", async (handler, ctx) => {
			const handlerResult = await handler(event, ctx);
			if (handlerResult) {
				result = handlerResult;
				if (result.block) return result;
			}
		});
		return result;
	}
	async emitUserBash(event) {
		return await this.dispatchHandlers("user_bash", async (handler, ctx) => {
			const handlerResult = await handler(event, ctx);
			return handlerResult ? handlerResult : void 0;
		});
	}
	async emitContext(messages) {
		if (!this.hasHandlers("context")) return messages;
		let currentMessages = structuredClone(messages);
		await this.dispatchHandlers("context", async (handler, ctx) => {
			const handlerResult = await handler({
				type: "context",
				messages: currentMessages
			}, ctx);
			if (handlerResult?.messages) currentMessages = handlerResult.messages;
		});
		return currentMessages;
	}
	async emitBeforeProviderRequest(payload) {
		let currentPayload = payload;
		await this.dispatchHandlers("before_provider_request", async (handler, ctx) => {
			const handlerResult = await handler({
				type: "before_provider_request",
				payload: currentPayload
			}, ctx);
			if (handlerResult !== void 0) currentPayload = handlerResult;
		});
		return currentPayload;
	}
	async emitBeforeAgentStart(prompt, images, systemPrompt, systemPromptOptions) {
		let currentSystemPrompt = systemPrompt;
		const ctx = this.createContext();
		ctx.getSystemPrompt = () => {
			this.requireActive();
			return currentSystemPrompt;
		};
		const messages = [];
		let systemPromptModified = false;
		await this.dispatchHandlers("before_agent_start", async (handler, handlerCtx) => {
			const handlerResult = await handler({
				type: "before_agent_start",
				prompt,
				images,
				systemPrompt: currentSystemPrompt,
				systemPromptOptions
			}, handlerCtx);
			if (handlerResult?.message) messages.push(handlerResult.message);
			if (handlerResult?.systemPrompt !== void 0) {
				currentSystemPrompt = handlerResult.systemPrompt;
				systemPromptModified = true;
			}
		}, ctx);
		if (messages.length > 0 || systemPromptModified) return {
			messages: messages.length > 0 ? messages : void 0,
			systemPrompt: systemPromptModified ? currentSystemPrompt : void 0
		};
	}
	async emitResourcesDiscover(cwd, reason) {
		const paths = {
			skillPaths: [],
			promptPaths: [],
			themePaths: []
		};
		await this.dispatchHandlers("resources_discover", async (handler, ctx, extensionPath) => {
			const result = await handler({
				type: "resources_discover",
				cwd,
				reason
			}, ctx);
			for (const key of [
				"skillPaths",
				"promptPaths",
				"themePaths"
			]) {
				const discovered = result?.[key];
				if (discovered?.length) paths[key].push(...discovered.map((path) => ({
					path,
					extensionPath
				})));
			}
		});
		return paths;
	}
	/** Emit input event. Transforms chain, "handled" short-circuits. */
	async emitInput(text, images, source) {
		let currentText = text;
		let currentImages = images;
		const handled = await this.dispatchHandlers("input", async (handler, ctx) => {
			const result = await handler({
				type: "input",
				text: currentText,
				images: currentImages,
				source
			}, ctx);
			if (result?.action === "handled") return result;
			if (result?.action === "transform") {
				currentText = result.text;
				currentImages = result.images ?? currentImages;
			}
		});
		if (handled) return handled;
		return currentText !== text || currentImages !== images ? {
			action: "transform",
			text: currentText,
			images: currentImages
		} : { action: "continue" };
	}
};
//#endregion
//#region src/agents/sessions/extensions/wrapper.ts
/**
* Wrap all registered tools into AgentTools.
* Uses the runner's createContext() for consistent context across tools and event handlers.
*/
function wrapRegisteredTools(registeredTools, runner) {
	return registeredTools.map((tool) => wrapToolDefinition(tool.definition, () => runner.createContext()));
}
//#endregion
//#region src/agents/sessions/queued-user-message-retirement.ts
const queuedUserMessageRetirements = /* @__PURE__ */ new WeakMap();
/** Binds one runtime message to the exact display entry created for it. */
function registerQueuedUserMessageRetirement(message, retire) {
	queuedUserMessageRetirements.set(message, retire);
}
/** Consumes the display retirement owned by this exact runtime message. */
function retireQueuedUserMessage(message) {
	const retire = queuedUserMessageRetirements.get(message);
	if (!retire) return false;
	queuedUserMessageRetirements.delete(message);
	return retire();
}
//#endregion
//#region src/agents/sessions/session-tool-result-preparation.ts
const preparers = createSessionManagerRuntimeRegistry();
const unchangedToolResult = () => false;
/** Bind the guard's size cap without extending the public SessionManager contract. */
function setSessionToolResultPreparer(sessionManager, preparation) {
	preparers.set(sessionManager, preparation);
}
function createSessionToolResultPreparer(sessionManager, event) {
	if (event.type !== "message_end" || event.message.role !== "toolResult") return unchangedToolResult;
	return () => {
		if (event.message.role !== "toolResult") return false;
		const message = event.message;
		const capped = preparers.get(sessionManager)?.cap(message) ?? message;
		if (capped === message) return false;
		if (Object.isFrozen(message)) event.message = copyInternalToolResultState(message, freezeJsonSnapshot(capped));
		else message.content = capped.content;
		return true;
	};
}
//#endregion
//#region src/agents/sessions/steering-message-identity.ts
const STEERING_MESSAGE_IDENTITY = Symbol.for("openclaw.steeringMessageIdentity");
const steeringMessagePersistenceFailureListeners = /* @__PURE__ */ new Map();
function setSteeringMessageIdentity(message, identity) {
	if (identity) Object.defineProperty(message, STEERING_MESSAGE_IDENTITY, {
		configurable: true,
		value: identity
	});
}
function getSteeringMessageIdentity(message) {
	return message && typeof message === "object" ? message[STEERING_MESSAGE_IDENTITY] : void 0;
}
/** Keeps persistence failures private to the exact in-flight steering identity. */
function subscribeSteeringMessagePersistenceFailure(identity, listener) {
	const listeners = steeringMessagePersistenceFailureListeners.get(identity) ?? /* @__PURE__ */ new Set();
	listeners.add(listener);
	steeringMessagePersistenceFailureListeners.set(identity, listeners);
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && steeringMessagePersistenceFailureListeners.get(identity) === listeners) steeringMessagePersistenceFailureListeners.delete(identity);
	};
}
/** Rejects a queued receipt before a failed append can strand or acknowledge its source. */
function reportSteeringMessagePersistenceFailure(message, error) {
	const identity = getSteeringMessageIdentity(message);
	if (identity) steeringMessagePersistenceFailureListeners.get(identity)?.forEach((listener) => listener(error));
}
//#endregion
//#region src/agents/sessions/agent-session-base.ts
const log = createSubsystemLogger("agents/session");
var AgentSessionBase = class {
	constructor(config) {
		this.eventListeners = [];
		this.steeringMessages = [];
		this.followUpMessages = [];
		this.pendingNextTurnMessages = [];
		this.compactionAbortController = void 0;
		this.autoCompactionAbortController = void 0;
		this.overflowRecoveryAttempts = 0;
		this.branchSummaryAbortController = void 0;
		this.extensionModifiedToolResultIds = /* @__PURE__ */ new Set();
		this.retryAbortController = void 0;
		this.retryCount = 0;
		this.turnIndex = 0;
		this.toolRegistry = /* @__PURE__ */ new Map();
		this.toolDefinitions = /* @__PURE__ */ new Map();
		this.lastAssistantMessage = void 0;
		this.lastRunEndedForTurnHandoff = false;
		this.handleAgentEvent = async (event, signal) => {
			const prepareToolResult = createSessionToolResultPreparer(this.sessionManager, event);
			if (event.type === "agent_end") {
				const reason = signal?.reason;
				this.lastRunEndedForTurnHandoff = signal?.aborted === true && typeof reason === "object" && reason !== null && reason.turnHandoff === true;
			}
			if (this.eventMayWriteSession(event)) {
				await this.runWithSessionWriteSettlement(async () => await this.handleAgentEventUnlocked(event, prepareToolResult));
				prepareToolResult();
				return;
			}
			await this.handleAgentEventUnlocked(event, prepareToolResult);
		};
		this.agent = config.agent;
		this.baseSystemPrompt = config.systemPrompt;
		this.sessionManager = config.sessionManager;
		this.settingsManager = config.settingsManager;
		this.sessionResourceLoader = config.resourceLoader;
		this.customTools = config.customTools ?? [];
		this.cwd = config.cwd;
		this.sessionModelRegistry = config.modelRegistry;
		this.extensionRunnerRef = config.extensionRunnerRef;
		this.allowedToolNames = new Set(config.allowedToolNames);
		this.withExternalSessionWriteSettlement = config.withSessionWriteSettlement;
		this.contextOverflowRecoveryOwner = config.contextOverflowRecoveryOwner ?? "session";
		this.resolveCompactionThinkingLevel = config.resolveCompactionThinkingLevel;
		this.cleanupProviderSessionResourcesOnDispose = config.cleanupProviderSessionResourcesOnDispose ?? true;
	}
	get modelRegistry() {
		return this.sessionModelRegistry;
	}
	async getRequiredRequestAuth(model) {
		const result = await this.sessionModelRegistry.getApiKeyAndHeaders(model);
		if (!result.ok) {
			if (result.error.startsWith("No API key found")) throw new Error(formatNoApiKeyFoundMessage(model.provider));
			throw new Error(result.error);
		}
		if (result.apiKey) return {
			apiKey: result.apiKey,
			headers: result.headers
		};
		if (this.sessionModelRegistry.isUsingOAuth(model)) throw new Error(`Authentication failed for "${model.provider}". Credentials may have expired or network is unavailable. Run '/login ${model.provider}' to re-authenticate.`);
		throw new Error(formatNoApiKeyFoundMessage(model.provider));
	}
	async getCompactionRequestAuth(model) {
		if (getStreamLlmRuntime(this.agent.streamFn) === getModelRegistryRuntime(this.sessionModelRegistry).llmRuntime) return this.getRequiredRequestAuth(model);
		const result = await this.sessionModelRegistry.getApiKeyAndHeaders(model);
		return result.ok ? {
			apiKey: result.apiKey,
			headers: result.headers
		} : {};
	}
	async runWithSessionWriteSettlement(run) {
		return this.withExternalSessionWriteSettlement ? await this.withExternalSessionWriteSettlement(run) : await run();
	}
	eventMayWriteSession(event) {
		return event.type === "message_end" || this.currentExtensionRunner.hasHandlers(event.type);
	}
	/**
	* Hooks resolve the current extension runner at execution time so reloads
	* need no reinstall. Wrappers only adapt registered tools to extension context.
	*/
	installAgentToolHooks() {
		this.agent.beforeToolCall = async ({ toolCall, args }) => {
			const runner = this.currentExtensionRunner;
			return await this.runWithSessionWriteSettlement(async () => {
				if (!runner.hasHandlers("tool_call")) return;
				try {
					return await runner.emitToolCall({
						type: "tool_call",
						toolName: toolCall.name,
						toolCallId: toolCall.id,
						input: args
					});
				} catch (err) {
					if (err instanceof Error) throw err;
					throw new Error(`Extension failed, blocking execution: ${String(err)}`, { cause: err });
				}
			});
		};
		this.agent.afterToolCall = async ({ toolCall, args, result, isError }) => {
			const resultIsError = isError || isToolResultError(result);
			const runner = this.currentExtensionRunner;
			if (!runner.hasHandlers("tool_result")) return { isError: resultIsError };
			const hookResult = await this.runWithSessionWriteSettlement(async () => await runner.emitToolResult({
				type: "tool_result",
				toolName: toolCall.name,
				toolCallId: toolCall.id,
				input: args,
				content: result.content,
				details: result.details,
				isError: resultIsError,
				...result.terminate !== void 0 ? { terminate: result.terminate } : {}
			}));
			if (hookResult) this.extensionModifiedToolResultIds.add(toolCall.id);
			return {
				...hookResult,
				isError: hookResult?.isError ?? resultIsError
			};
		};
		this.agent.afterToolOutcome = async ({ executionStarted, result, isError }) => executionStarted ? void 0 : { isError: isError || isToolResultError(result) };
	}
	/** Copy-on-write listener registration keeps dispatch stable without per-event snapshots. */
	emit(event) {
		for (const l of this.eventListeners) l(event);
	}
	/** Terminal listeners form a barrier before retry, compaction, or queue draining. */
	async emitTerminal(event) {
		const listeners = this.eventListeners;
		for (const listener of listeners) try {
			await listener(event);
		} catch (error) {
			log.warn(`agent_end listener failed: ${String(error)}`);
		}
	}
	emitQueueUpdate() {
		this.emit({
			type: "queue_update",
			steering: this.steeringMessages.map((entry) => entry.text),
			followUp: this.followUpMessages.map((entry) => entry.text)
		});
	}
	trackQueuedUserMessage(message, owner, text) {
		const queue = owner === "steering" ? this.steeringMessages : this.followUpMessages;
		const entry = { text };
		queue.push(entry);
		registerQueuedUserMessageRetirement(message, () => {
			if (queue !== this.steeringMessages && queue !== this.followUpMessages) return false;
			const queueIndex = queue.indexOf(entry);
			if (queueIndex === -1) return false;
			queue.splice(queueIndex, 1);
			this.emitQueueUpdate();
			return true;
		});
	}
	async handleAgentEventUnlocked(event, prepareToolResult) {
		if (event.type === "agent_start") {
			this.lastAssistantEntryId = void 0;
			this.turnIndex = 0;
		}
		if (event.type === "message_start" && event.message.role === "user") {
			this.overflowRecoveryAttempts = 0;
			retireQueuedUserMessage(event.message);
		}
		let messageChanged = false;
		if (this.currentExtensionRunner.hasHandlers(event.type)) messageChanged = await this.emitExtensionEvent(event);
		if (event.type === "turn_end") this.turnIndex++;
		messageChanged = prepareToolResult() || messageChanged;
		const publishAfterPersistence = event.type === "message_end" && event.message.role === "user";
		if (event.type === "agent_end") await this.emitTerminal({
			...event,
			willRetry: this.willRetryAfterAgentEnd(event),
			...this.lastAssistantEntryId ? { assistantEntryId: this.lastAssistantEntryId } : {}
		});
		else if (!publishAfterPersistence) this.emit(event);
		messageChanged = prepareToolResult() || messageChanged;
		if (event.type === "message_end") {
			if (event.message.role === "custom") {
				const message = event.message;
				await this.sessionManager.appendCustomMessageEntryAsync(message.customType, message.content, message.display, message.details, message.timestamp);
			} else if (event.message.role === "user" || event.message.role === "assistant" || event.message.role === "toolResult") {
				const toolResultChangedByExtension = event.message.role === "toolResult" && this.extensionModifiedToolResultIds.delete(event.message.toolCallId);
				try {
					const retainedSteeringContext = event.message.role === "user" && shouldRetainSteeringRuntimeContext(this) ? getSteeringRuntimeContext(event.message) : void 0;
					if (retainedSteeringContext) await this.sessionManager.appendCustomMessageEntryAsync(retainedSteeringContext.customType, retainedSteeringContext.content, retainedSteeringContext.display, retainedSteeringContext.details, retainedSteeringContext.timestamp);
					const entryId = await persistAgentSessionMessage(this.sessionManager, event.message, { invalidateSerializedPrefixCache: messageChanged || toolResultChangedByExtension });
					if (event.message.role === "assistant") this.lastAssistantEntryId = entryId;
				} catch (error) {
					if (event.message.role === "user") reportSteeringMessagePersistenceFailure(event.message, error);
					throw error;
				}
				if (event.message.role === "user") this.emit(event);
			}
			if (event.message.role === "assistant") this.lastAssistantMessage = event.message;
		}
		if (event.type === "turn_end" && event.message.role === "assistant") {
			const assistantMsg = event.message;
			if (assistantMsg.stopReason !== "error" && assistantMsg.stopReason !== "length") this.overflowRecoveryAttempts = 0;
			if (assistantMsg.stopReason !== "error" && this.retryCount > 0) {
				this.emit({
					type: "auto_retry_end",
					success: assistantMsg.stopReason !== "aborted",
					attempt: this.retryCount,
					...assistantMsg.stopReason === "aborted" ? { finalError: assistantMsg.errorMessage } : {}
				});
				this.retryCount = 0;
			}
		}
	}
	willRetryAfterAgentEnd(event) {
		const settings = this.settingsManager.getRetrySettings();
		if (!settings.enabled || this.retryCount >= settings.maxRetries) return false;
		const lastAssistant = event.messages.findLast((message) => message.role === "assistant");
		return lastAssistant !== void 0 && this.isRetryableError(lastAssistant);
	}
	/** Find the last assistant message in agent state (including aborted ones) */
	findLastAssistantMessage() {
		return this.agent.state.messages.findLast((message) => message.role === "assistant");
	}
	async emitExtensionEvent(event) {
		if (event.type === "turn_start") await this.currentExtensionRunner.emit({
			type: "turn_start",
			turnIndex: this.turnIndex,
			timestamp: Date.now()
		});
		else if (event.type === "turn_end") await this.currentExtensionRunner.emit({
			type: "turn_end",
			turnIndex: this.turnIndex,
			message: event.message,
			toolResults: event.toolResults
		});
		else if (event.type === "message_end") {
			const replacement = await this.currentExtensionRunner.emitMessageEnd({
				type: "message_end",
				message: event.message
			});
			if (replacement) {
				replaceAgentMessageInPlace(event.message, replacement);
				return true;
			}
		} else if (event.type === "tool_execution_start") await this.currentExtensionRunner.emit({
			type: "tool_execution_start",
			toolCallId: event.toolCallId,
			toolName: event.toolName,
			args: event.args
		});
		else if (event.type === "tool_execution_update") await this.currentExtensionRunner.emit({
			type: "tool_execution_update",
			toolCallId: event.toolCallId,
			toolName: event.toolName,
			args: event.args,
			partialResult: event.partialResult
		});
		else if (event.type === "tool_execution_end") await this.currentExtensionRunner.emit({
			type: "tool_execution_end",
			toolCallId: event.toolCallId,
			toolName: event.toolName,
			result: event.result,
			isError: event.isError
		});
		else await this.currentExtensionRunner.emit({ ...event });
		return false;
	}
	/**
	* Subscribe to agent events.
	* Session persistence is handled internally (saves messages on message_end).
	* Multiple listeners can be added. Returns unsubscribe function for this listener.
	*/
	subscribe(listener) {
		this.eventListeners = [...this.eventListeners, listener];
		return () => {
			const index = this.eventListeners.indexOf(listener);
			if (index !== -1) this.eventListeners = this.eventListeners.toSpliced(index, 1);
		};
	}
	/**
	* Temporarily disconnect from agent events.
	* User listeners are preserved and will receive events again after resubscribe().
	* Used internally during operations that need to pause event processing.
	*/
	disconnectFromAgent() {
		if (this.unsubscribeAgent) {
			this.unsubscribeAgent();
			this.unsubscribeAgent = void 0;
		}
	}
	/**
	* Reconnect to agent events after disconnectFromAgent().
	* Preserves all existing listeners.
	*/
	reconnectToAgent() {
		if (this.unsubscribeAgent) return;
		this.unsubscribeAgent = this.agent.subscribe(this.handleAgentEvent);
	}
	/**
	* Remove all listeners and disconnect from agent.
	* Call this when completely done with the session.
	*/
	dispose() {
		notifyListeners([
			() => this.abortRetry(),
			() => this.abortCompaction(),
			() => this.abortBranchSummary(),
			() => this.agent.abort()
		], void 0);
		this.currentExtensionRunner.invalidate();
		this.disconnectFromAgent();
		this.eventListeners = [];
		if (this.cleanupProviderSessionResourcesOnDispose) cleanupSessionResources(this.sessionId);
	}
	get state() {
		return this.agent.state;
	}
	get model() {
		return this.agent.state.model;
	}
	get thinkingLevel() {
		return this.agent.state.thinkingLevel;
	}
	get isStreaming() {
		return this.agent.state.isStreaming;
	}
	/** Current effective system prompt (includes any per-turn extension modifications) */
	get systemPrompt() {
		return this.agent.state.systemPrompt;
	}
	/** Current retry attempt (0 if not retrying) */
	get retryAttempt() {
		return this.retryCount;
	}
	getActiveToolNames() {
		return this.agent.state.tools.map((t) => t.name);
	}
	/** All configured tools with their schema and source metadata. */
	getAllTools() {
		return Array.from(this.toolDefinitions.values()).map(({ definition, sourceInfo }) => ({
			name: definition.name,
			description: definition.description,
			parameters: definition.parameters,
			sourceInfo
		}));
	}
	getToolDefinition(name) {
		return this.toolDefinitions.get(name)?.definition;
	}
	/**
	* Set active tools by name.
	* Only tools in the registry can be enabled. Unknown tool names are ignored.
	* Refreshes extension prompt metadata while preserving the runtime-owned prompt.
	* Changes take effect on the next agent turn.
	*/
	setActiveToolsByName(toolNames) {
		const tools = [];
		const validToolNames = [];
		for (const name of toolNames) {
			const tool = this.toolRegistry.get(name);
			if (tool) {
				tools.push(tool);
				validToolNames.push(name);
			}
		}
		this.agent.state.tools = tools;
		this.refreshSystemPromptMetadata(validToolNames);
		this.agent.state.systemPrompt = this.systemPromptOverride ?? this.baseSystemPrompt;
	}
	/** Set an exact base prompt owned by the current runtime. */
	setBaseSystemPrompt(systemPrompt) {
		this.baseSystemPrompt = systemPrompt;
		this.refreshSystemPromptMetadata(this.getActiveToolNames());
		this.agent.state.systemPrompt = systemPrompt;
	}
	/** Whether compaction or branch summarization is currently running */
	get isCompacting() {
		return this.autoCompactionAbortController !== void 0 || this.compactionAbortController !== void 0 || this.branchSummaryAbortController !== void 0;
	}
	/** All messages including custom types like BashExecutionMessage */
	get messages() {
		return this.agent.state.messages;
	}
	get steeringMode() {
		return this.agent.steeringMode;
	}
	get followUpMode() {
		return this.agent.followUpMode;
	}
	/** Current persisted transcript target, or undefined for in-memory sessions. */
	get sessionTarget() {
		return this.sessionManager.getSessionTarget();
	}
	/** Current persisted session key, or undefined for in-memory sessions. */
	get sessionKey() {
		return this.sessionTarget?.sessionKey;
	}
	/** @deprecated Compatibility token; returns the session key, not a file path. */
	get sessionFile() {
		return this.sessionKey;
	}
	get sessionId() {
		return this.sessionManager.getSessionId();
	}
	get sessionName() {
		return this.sessionManager.getSessionName();
	}
	/** File-based prompt templates */
	get promptTemplates() {
		return this.sessionResourceLoader.getPrompts().prompts;
	}
	refreshSystemPromptMetadata(toolNames) {
		const validToolNames = toolNames.filter((name) => this.toolRegistry.has(name));
		const toolSnippets = {};
		const promptGuidelines = [];
		for (const name of validToolNames) {
			const definition = this.toolDefinitions.get(name)?.definition;
			const snippet = definition?.promptSnippet?.replace(/\s+/g, " ").trim();
			if (snippet) toolSnippets[name] = snippet;
			promptGuidelines.push(...new Set(definition?.promptGuidelines?.map((guideline) => guideline.trim()).filter(Boolean)));
		}
		this.baseSystemPromptOptions = {
			cwd: this.cwd,
			customPrompt: this.baseSystemPrompt,
			selectedTools: validToolNames,
			toolSnippets,
			promptGuidelines
		};
	}
};
//#endregion
//#region src/shared/tilde-path.ts
/**
* Expands a leading `~` against the OS home dir, keeping relative inputs
* relative so callers can resolve them against their own base dir. Unlike
* `resolveHomeRelativePath`, `~name` is treated as `<home>/name` (shipped
* loader behavior for prompt/skill path lists).
*/
function expandTildePath(input) {
	const trimmed = input.trim();
	if (trimmed === "~") return homedir();
	if (trimmed.startsWith("~/")) return join(homedir(), trimmed.slice(2));
	if (trimmed.startsWith("~")) return join(homedir(), trimmed.slice(1));
	return trimmed;
}
//#endregion
//#region src/agents/sessions/prompt-templates.ts
function loadTemplateFromFile(filePath, sourceInfo) {
	try {
		const rawContent = readFileSync(filePath, "utf-8");
		const { frontmatter, body } = parsePromptFrontmatter(rawContent);
		const name = basename(filePath).replace(/\.md$/, "");
		let description = frontmatter.description || "";
		if (!description) {
			const firstLine = body.split("\n").find((line) => line.trim());
			if (firstLine) description = truncateUtf16Safe(firstLine, 60) + (firstLine.length > 60 ? "..." : "");
		}
		return {
			name,
			description,
			...frontmatter["argument-hint"] && { argumentHint: frontmatter["argument-hint"] },
			content: body,
			sourceInfo,
			filePath
		};
	} catch {
		return null;
	}
}
function resolvePromptPath(p, cwd) {
	const normalized = expandTildePath(p);
	return isAbsolute(normalized) ? normalized : resolve(cwd, normalized);
}
/** Load explicit prompt paths with metadata for their source scope. */
function loadPromptTemplates({ cwd, agentDir, promptPaths }) {
	const templates = [];
	const globalPromptsDir = agentDir ? join(agentDir, "prompts") : agentDir;
	const projectPromptsDir = resolve(cwd, CONFIG_DIR_NAME, "prompts");
	const getSourceInfo = (resolvedPath) => {
		for (const [baseDir, scope] of [[globalPromptsDir, "user"], [projectPromptsDir, "project"]]) if (isPathInside(baseDir, resolvedPath)) return createSyntheticSourceInfo(resolvedPath, {
			source: "local",
			scope,
			baseDir
		});
		return createSyntheticSourceInfo(resolvedPath, {
			source: "local",
			baseDir: statSync(resolvedPath).isDirectory() ? resolvedPath : dirname(resolvedPath)
		});
	};
	for (const rawPath of promptPaths) {
		const resolvedPath = resolvePromptPath(rawPath, cwd);
		if (!existsSync(resolvedPath)) continue;
		try {
			const stats = statSync(resolvedPath);
			let filePaths = [];
			if (stats.isDirectory()) {
				const { entries } = walkDirectorySync(resolvedPath, {
					maxDepth: 1,
					symlinks: "follow",
					include: (entry) => entry.kind === "file" && entry.name.endsWith(".md")
				});
				filePaths = entries.map((entry) => join(resolvedPath, entry.name));
			} else if (stats.isFile() && resolvedPath.endsWith(".md")) filePaths = [resolvedPath];
			const loadedTemplates = [];
			try {
				for (const filePath of filePaths) {
					const template = loadTemplateFromFile(filePath, getSourceInfo(filePath));
					if (template) loadedTemplates.push(template);
				}
			} finally {
				templates.push(...loadedTemplates);
			}
		} catch {}
	}
	return templates;
}
/**
* Expand a prompt template if it matches a template name.
* Returns the expanded content or the original text if not a template.
*/
function expandPromptTemplate(text, templates) {
	const match = text.match(/^\/([^\s]+)(?:\s+([\s\S]*))?$/);
	if (!match) return text;
	const templateName = match[1];
	const argsString = match[2] ?? "";
	const template = templates.find((t) => t.name === templateName);
	if (template) {
		const args = parseCommandArgs(argsString);
		return substituteArgs(template.content, args);
	}
	return text;
}
//#endregion
//#region src/agents/sessions/agent-session-prompting.ts
function createCustomMessage(message) {
	return {
		role: "custom",
		customType: message.customType,
		content: message.content,
		display: message.display,
		details: message.details,
		timestamp: Date.now()
	};
}
/** @internal Host preparation runs after SDK prompt hooks and owns its run cancellation. */
const agentSessionSetPromptPreparation = Symbol.for("openclaw.agent-session.set-prompt-preparation");
/** @internal Queue prompt-owned context with cleanup for preflight exits. */
const agentSessionQueuePromptContext = Symbol.for("openclaw.agent-session.queue-prompt-context");
var AgentSessionPrompting = class extends AgentSessionBase {
	constructor(..._args) {
		super(..._args);
		this.logicalPromptActive = false;
	}
	[agentSessionQueuePromptContext](message, options) {
		if (options?.delivery === "current-request") return this.persistCustomMessage(message);
		if (this.logicalPromptActive && isOpenClawSystemUpdateMessage(message)) {
			this.agent.steer(message);
			return () => {
				this.agent.cancelSteeringMessage((pending) => pending === message);
			};
		}
		if (isOpenClawSystemUpdateMessage(message)) this.pendingNextTurnMessages.push(message);
		else this.pendingNextTurnMessages.unshift(message);
		return () => {
			this.pendingNextTurnMessages = this.pendingNextTurnMessages.filter((pending) => pending !== message);
		};
	}
	[agentSessionSetPromptPreparation](prepare) {
		this.promptPreparation = prepare;
	}
	dispose() {
		this.promptPreparation = void 0;
		super.dispose();
	}
	async runAgentPrompt(messages) {
		if (this.logicalPromptActive) throw new Error("Agent is already processing a prompt. Use steer() or followUp() to queue messages, or wait for completion.");
		this.logicalPromptActive = true;
		let endedForTurnHandoff = false;
		try {
			await this.runPreparedAgentLoop(() => this.agent.prompt(messages));
			while (true) {
				const action = await this.handlePostAgentRun();
				if (action !== "continue") {
					endedForTurnHandoff = action === "handoff";
					break;
				}
				await this.runPreparedAgentLoop(() => this.agent.continue());
			}
		} finally {
			this.systemPromptOverride = void 0;
			this.logicalPromptActive = false;
			endedForTurnHandoff ||= this.lastRunEndedForTurnHandoff;
			this.lastRunEndedForTurnHandoff = false;
			if (endedForTurnHandoff) this.emit({ type: "agent_handoff" });
			else {
				this.emit({ type: "agent_settled" });
				await this.currentExtensionRunner.emit({ type: "agent_settled" });
			}
		}
	}
	async runPreparedAgentLoop(run) {
		const prepare = this.promptPreparation;
		if (!prepare) return run();
		const admit = await prepare();
		const assertCurrent = () => {
			if (prepare !== this.promptPreparation) throw new Error("Session prompt preparation is stale after replacement or disposal.");
		};
		assertCurrent();
		let running;
		const start = (commit) => {
			assertCurrent();
			commit?.();
			assertCurrent();
			running = run().then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}));
		};
		try {
			if (admit) await admit(start);
			else start();
		} catch (error) {
			await running;
			throw error;
		}
		if (!running) throw new Error("Session prompt admission did not start the agent loop.");
		const result = await running;
		if (result.status === "rejected") throw result.reason;
	}
	async handlePostAgentRun() {
		const msg = this.lastAssistantMessage;
		this.lastAssistantMessage = void 0;
		const endedForTurnHandoff = this.lastRunEndedForTurnHandoff;
		this.lastRunEndedForTurnHandoff = false;
		if (endedForTurnHandoff) return "handoff";
		if (!msg || msg.stopReason === "aborted") return "settled";
		if (this.isRetryableError(msg) && await this.prepareRetry(msg)) return "continue";
		if (msg.stopReason === "error" && this.retryCount > 0) {
			this.emit({
				type: "auto_retry_end",
				success: false,
				attempt: this.retryCount,
				finalError: msg.errorMessage
			});
			this.retryCount = 0;
		}
		if (await this.checkCompaction(msg)) return "continue";
		return msg.stopReason !== "error" && this.agent.hasQueuedMessages() ? "continue" : "settled";
	}
	createUserMessage(text, images, preparedMessage) {
		const imageFactIndexes = readRuntimePromptImageFactIndexes(images);
		const message = {
			role: "user",
			content: [{
				type: "text",
				text
			}, ...images ?? []],
			timestamp: Date.now(),
			...imageFactIndexes ? { __openclaw: { mediaImageBlockFactIndexes: imageFactIndexes } } : {}
		};
		return Object.assign(message, mergePreparedUserTurnMessageForRuntime({
			runtimeMessage: message,
			preparedMessage
		}), { content: message.content });
	}
	/**
	* Send a prompt to the agent.
	* - Handles extension commands immediately, even during streaming
	* - Expands file-based prompt templates by default
	* - During streaming, queues via steer() or followUp() based on streamingBehavior option
	* - Validates model and API key before sending (when not streaming)
	* @throws Error if streaming and no streamingBehavior specified
	* @throws Error if no model selected or no API key available (when not streaming)
	*/
	async prompt(text, options) {
		const preparedCompactionBudget = takePromptCompactionRequestBudget(options);
		const expandPromptTemplates = options?.expandPromptTemplates ?? true;
		const preflightResult = options?.preflightResult;
		let steeringAccepted = false;
		let steeringPreflightReported = false;
		let messages;
		try {
			if (expandPromptTemplates && text.startsWith("/")) {
				if (await this.tryExecuteExtensionCommand(text)) {
					preflightResult?.(true);
					return;
				}
			}
			let currentText = text;
			let currentImages = options?.images;
			if (this.currentExtensionRunner.hasHandlers("input")) {
				const inputResult = await this.currentExtensionRunner.emitInput(currentText, currentImages, options?.source ?? "interactive");
				if (inputResult.action === "handled") {
					preflightResult?.(true);
					return;
				}
				if (inputResult.action === "transform") {
					currentText = inputResult.text;
					currentImages = inputResult.images ?? currentImages;
				}
			}
			const expandedText = expandPromptTemplates ? this.expandPrompt(currentText) : currentText;
			if (this.isStreaming || this.logicalPromptActive) {
				if (!options?.streamingBehavior) throw new Error("Agent is already processing. Specify streamingBehavior ('steer' or 'followUp') to queue the message.");
				if (options.streamingBehavior === "followUp") await this.queueFollowUp(expandedText, currentImages);
				else {
					const notify = this.queueSteer(this.createSteeringMessage(expandedText, currentImages), expandedText);
					steeringAccepted = true;
					notify();
				}
				steeringPreflightReported = steeringAccepted;
				preflightResult?.(true);
				return;
			}
			if (!this.model) throw new Error(formatNoModelSelectedMessage());
			if (!this.sessionModelRegistry.hasConfiguredAuth(this.model)) {
				if (this.sessionModelRegistry.isUsingOAuth(this.model)) throw new Error(`Authentication failed for "${this.model.provider}". Credentials may have expired or network is unavailable. Run '/login ${this.model.provider}' to re-authenticate.`);
				throw new Error(formatNoApiKeyFoundMessage(this.model.provider));
			}
			const persistedUserIdempotencyKey = options?.persistedUserIdempotencyKey;
			const contextWindow = this.model.contextWindow;
			const lastAssistant = this.findLastAssistantMessage();
			if (lastAssistant) {
				const pendingQueuedContextMessages = resolvePendingRuntimeContextReplay({
					messages: this.agent.state.messages,
					pendingContextMessages: this.pendingNextTurnMessages,
					persistedUserIdempotencyKey
				}).pendingContextMessages;
				await this.checkCompaction(lastAssistant, false, preparedCompactionBudget ? withCompactionQueuedContext(preparedCompactionBudget, pendingQueuedContextMessages) : typeof contextWindow === "number" && Number.isFinite(contextWindow) && contextWindow > 0 ? createCompactionRequestBudget({
					contextWindow,
					reserveTokens: this.settingsManager.getCompactionSettings().reserveTokens,
					systemPrompt: this.agent.state.systemPrompt,
					tools: this.agent.state.tools,
					pendingPrompt: expandedText,
					pendingImageCount: currentImages?.length,
					pendingQueuedContextMessages,
					pendingUserIdempotencyKey: persistedUserIdempotencyKey
				}) : void 0);
			}
			const { persistedUserIndex, replayPersistedCarrier, pendingContextMessages } = resolvePendingRuntimeContextReplay({
				messages: this.agent.state.messages,
				pendingContextMessages: this.pendingNextTurnMessages,
				persistedUserIdempotencyKey
			});
			const replayPersistedTurn = persistedUserIndex >= 0;
			const persistedUser = this.agent.state.messages[persistedUserIndex];
			if (!replayPersistedCarrier && persistedUser?.role === "user" && readModelPromptProjection(persistedUser) === void 0) {
				const runtimeUser = this.createUserMessage(expandedText, currentImages, persistedUser);
				this.agent.state.messages = this.agent.state.messages.with(persistedUserIndex, runtimeUser);
			}
			messages = [];
			if (!replayPersistedTurn) messages.push({
				...this.createUserMessage(expandedText, currentImages),
				...persistedUserIdempotencyKey ? { idempotencyKey: persistedUserIdempotencyKey } : {}
			});
			messages.push(...pendingContextMessages);
			this.pendingNextTurnMessages = [];
			const result = await this.currentExtensionRunner.emitBeforeAgentStart(expandedText, currentImages, this.baseSystemPrompt, this.baseSystemPromptOptions);
			if (result?.messages) for (const msg of result.messages) messages.push(createCustomMessage(msg));
			this.systemPromptOverride = result?.systemPrompt;
			this.agent.state.systemPrompt = this.systemPromptOverride !== void 0 ? this.systemPromptOverride : this.baseSystemPrompt;
		} catch (error) {
			if (steeringAccepted) {
				let cause = error;
				if (!steeringPreflightReported) try {
					preflightResult?.(true);
				} catch (preflightError) {
					cause = new AggregateError([error, preflightError], "Steering feedback failed");
				}
				throw new MessageInjectionAcceptedUnconfirmedError({ cause });
			}
			preflightResult?.(false);
			throw error;
		}
		preflightResult?.(true);
		await this.runAgentPrompt(orderSystemUpdateMessages(messages));
	}
	async tryExecuteExtensionCommand(text) {
		const spaceIndex = text.indexOf(" ");
		const commandName = spaceIndex === -1 ? text.slice(1) : text.slice(1, spaceIndex);
		const args = spaceIndex === -1 ? "" : text.slice(spaceIndex + 1);
		const command = this.currentExtensionRunner.getCommand(commandName);
		if (!command) return false;
		const ctx = this.currentExtensionRunner.createCommandContext();
		try {
			await command.handler(args, ctx);
		} catch (err) {
			this.currentExtensionRunner.emitError({
				extensionPath: `command:${commandName}`,
				event: "command",
				error: err instanceof Error ? err.message : String(err)
			});
		}
		return true;
	}
	/**
	* Expand skill commands (/skill:name args) to their full content.
	* Returns the expanded text, or the original text if not a skill command or skill not found.
	* Emits errors via extension runner if file read fails.
	*/
	expandSkillCommand(text) {
		if (!text.startsWith("/skill:")) return text;
		const spaceIndex = text.indexOf(" ");
		const skillName = spaceIndex === -1 ? text.slice(7) : text.slice(7, spaceIndex);
		const args = spaceIndex === -1 ? "" : text.slice(spaceIndex + 1).trim();
		const skill = this.sessionResourceLoader.getSkills().skills.find((s) => s.name === skillName);
		if (!skill) return text;
		try {
			const content = readFileSync(skill.filePath, "utf-8");
			const body = stripFrontmatter(content).trim();
			const skillBlock = `<skill name="${skill.name}" location="${skill.filePath}">\nReferences are relative to ${skill.baseDir}.\n\n${body}\n</skill>`;
			return args ? `${skillBlock}\n\n${args}` : skillBlock;
		} catch (err) {
			this.currentExtensionRunner.emitError({
				extensionPath: skill.filePath,
				event: "skill_expansion",
				error: err instanceof Error ? err.message : String(err)
			});
			return text;
		}
	}
	expandPrompt(text) {
		return expandPromptTemplate(this.expandSkillCommand(text), [...this.promptTemplates]);
	}
	/**
	* Queue a steering message while the agent is running.
	* Delivered before the next unstarted tool launch or model call. Running tools
	* continue; suppressed calls receive paired synthetic results.
	* Expands skill commands and prompt templates. Errors on extension commands.
	* @param userTurnTranscriptRecorder Prepared channel fields for transcript-only persistence
	* @param currentInboundContext This turn's runtime facts, separate from its command and transcript
	* @throws Error if text is an extension command
	*/
	async steer(text, images, userTurnTranscriptRecorder, media, imageOrder, queueIdentity, canInject, currentInboundContext, prepareInjection) {
		if (text.startsWith("/")) this.throwIfExtensionCommand(text);
		const expandedText = this.expandPrompt(text);
		return enqueueMessageInjection(this, async () => {
			const preparedMessage = await userTurnTranscriptRecorder?.resolveMessage();
			const message = this.createSteeringMessage(expandedText, images, preparedMessage && userTurnTranscriptRecorder ? {
				message: preparedMessage,
				recorder: userTurnTranscriptRecorder
			} : void 0, media, imageOrder, queueIdentity, currentInboundContext);
			let notify;
			let failure;
			try {
				await withMessageInjectionAdmission(prepareInjection, () => {
					if (canInject && !canInject()) throw new Error("active session is finalizing");
					notify = this.queueSteer(message, expandedText);
				});
			} catch (error) {
				failure = { error };
			}
			try {
				notify?.();
			} catch (cause) {
				throw new MessageInjectionAcceptedUnconfirmedError({ cause: failure ? new AggregateError([failure.error, cause], "Steering admission and notification failed") : cause });
			}
			if (failure) throw failure.error;
		});
	}
	/**
	* Queue a follow-up message to be processed after the agent finishes.
	* Delivered only when agent has no more tool calls or steering messages.
	* Expands skill commands and prompt templates. Errors on extension commands.
	* @throws Error if text is an extension command
	*/
	async followUp(text, images) {
		if (text.startsWith("/")) this.throwIfExtensionCommand(text);
		await this.queueFollowUp(this.expandPrompt(text), images);
	}
	createSteeringMessage(text, images, transcriptContext, media, imageOrder, queueIdentity, currentInboundContext) {
		const runtimeMessage = this.createUserMessage(text, images, transcriptContext?.message);
		const promptMessage = media?.length ? attachRuntimePromptMediaFacts(runtimeMessage, media, imageOrder) : runtimeMessage;
		attachSteeringRuntimeContext(promptMessage, currentInboundContext);
		setSteeringMessageIdentity(promptMessage, queueIdentity);
		return transcriptContext ? attachRuntimeUserTurnTranscriptContext(promptMessage, transcriptContext) : promptMessage;
	}
	/** Install only queue state here; arbitrary listeners run after admission cleanup. */
	queueSteer(message, text) {
		this.trackQueuedUserMessage(message, "steering", text);
		const notifyAgent = this.agent.admitSteeringMessage(message);
		return () => {
			const errors = [];
			notifyListeners([() => this.emitQueueUpdate(), () => notifyAgent()], void 0, (error) => errors.push(error));
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "Steering notifications failed");
		};
	}
	/** Queue pre-expanded follow-up input without an extension-command check. */
	async queueFollowUp(text, images) {
		const message = this.createUserMessage(text, images);
		this.trackQueuedUserMessage(message, "followUp", text);
		this.emitQueueUpdate();
		this.agent.followUp(message);
	}
	throwIfExtensionCommand(text) {
		const spaceIndex = text.indexOf(" ");
		const commandName = spaceIndex === -1 ? text.slice(1) : text.slice(1, spaceIndex);
		if (this.currentExtensionRunner.getCommand(commandName)) throw new Error(`Extension command "/${commandName}" cannot be queued. Use prompt() or execute the command when not streaming.`);
	}
	/**
	* Send a custom message to the session. Creates a CustomMessageEntry.
	*
	* Handles three cases:
	* - Streaming: queues message, processed when loop pulls from queue
	* - Not streaming + triggerTurn: appends to state/session, starts new turn
	* - Not streaming + no trigger: appends to state/session, no turn
	*
	* @param options.triggerTurn If true and not streaming, triggers a new LLM turn
	*/
	async sendCustomMessage(message, options) {
		const appMessage = createCustomMessage(message);
		if (options?.deliverAs === "nextTurn") this.pendingNextTurnMessages.push(appMessage);
		else if (this.isStreaming) {
			if (options?.deliverAs === "followUp") this.agent.followUp(appMessage);
			else this.agent.steer(appMessage);
		} else if (options?.triggerTurn) await this.runAgentPrompt(appMessage);
		else await this.persistCustomMessage(appMessage);
	}
	async persistCustomMessage(message) {
		await withSessionManagerAppend(this.sessionManager, async () => {
			await this.sessionManager.appendCustomMessageEntryAsync(message.customType, message.content, message.display, message.details, message.timestamp);
			this.agent.state.messages.push(message);
		});
		this.emit({
			type: "message_start",
			message
		});
		this.emit({
			type: "message_end",
			message
		});
	}
	/**
	* Send a user message to the agent. Always triggers a turn.
	* When the agent is streaming, use deliverAs to specify how to queue the message.
	*/
	async sendUserMessage(content, options) {
		let text;
		let images;
		if (typeof content === "string") text = content;
		else {
			const textParts = [];
			images = [];
			for (const part of content) if (part.type === "text") textParts.push(part.text);
			else images.push(part);
			text = textParts.join("\n");
			if (images.length === 0) images = void 0;
		}
		await this.prompt(text, {
			expandPromptTemplates: false,
			streamingBehavior: options?.deliverAs,
			images,
			source: "extension"
		});
	}
	/**
	* Clear all queued messages and return them.
	* Useful for restoring to editor when user aborts.
	*/
	clearQueue() {
		const steering = this.steeringMessages.map((entry) => entry.text);
		const followUp = this.followUpMessages.map((entry) => entry.text);
		this.steeringMessages = [];
		this.followUpMessages = [];
		this.agent.clearAllQueues();
		this.emitQueueUpdate();
		return {
			steering,
			followUp
		};
	}
	/** Number of pending messages (includes both steering and follow-up) */
	get pendingMessageCount() {
		return this.steeringMessages.length + this.followUpMessages.length;
	}
	getSteeringMessages() {
		return this.steeringMessages.map((entry) => entry.text);
	}
	getFollowUpMessages() {
		return this.followUpMessages.map((entry) => entry.text);
	}
	get resourceLoader() {
		return this.sessionResourceLoader;
	}
	/** Abort the current run; yield callers pass a turnHandoff reason to skip interruption guidance. */
	async abort(reason) {
		this.abortRetry();
		this.agent.abort(reason);
		await this.agent.waitForIdle();
	}
};
//#endregion
//#region src/agents/sessions/agent-session-models.ts
const THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high"
];
var AgentSessionModels = class extends AgentSessionPrompting {
	async emitModelSelect(nextModel, previousModel, runner, isCurrent) {
		if (!isCurrent() || modelsAreEqual(previousModel, nextModel)) return;
		await runner.emit({
			type: "model_select",
			model: nextModel,
			previousModel,
			source: "set"
		});
	}
	/** Set the model after validating its current auth at write admission. */
	async setModel(model) {
		const owner = this.captureMetadataOwner();
		const { previousModel, thinkingSelection: committedThinkingSelection, commit: committedMetadata } = await owner.run(async () => {
			owner.assertCurrent();
			if (!this.sessionModelRegistry.hasConfiguredAuth(model)) throw new Error(`No API key for ${model.provider}/${model.id}`);
			const previous = this.model;
			const thinkingSelection = this.planThinkingLevel(this.getThinkingLevelForModelSwitch(), model);
			const publication = {};
			await withSessionMetadataPublication(owner.manager, {
				type: "model_change",
				provider: model.provider,
				modelId: model.id
			}, (commit) => {
				publication.commit = commit;
				this.agent.state.model = model;
				this.settingsManager.setDefaultModelAndProvider(model.provider, model.id);
			}, () => owner.manager.appendModelChange(model.provider, model.id));
			if (thinkingSelection) try {
				owner.assertCurrent();
				publication.commit = await this.appendThinkingSelection(owner, thinkingSelection) ?? publication.commit;
			} catch (cause) {
				this.failAfterMetadataCommit(cause, publication.commit);
			}
			return {
				previousModel: previous,
				thinkingSelection: thinkingSelection?.event,
				commit: publication.commit
			};
		});
		try {
			const thinking = this.emitThinkingLevelSelect(committedThinkingSelection, owner.runner, owner.isCurrent);
			const selected = this.emitModelSelect(model, previousModel, owner.runner, owner.isCurrent);
			const failures = (await Promise.allSettled([thinking, selected])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Session metadata notifications failed", { cause: failures[0] });
		} catch (cause) {
			this.failAfterMetadataCommit(cause, committedMetadata);
		}
	}
	/**
	* Set thinking level.
	* Clamps to model capabilities based on available thinking levels.
	* Saves to session and settings only if the level actually changes.
	*/
	async setThinkingLevel(level) {
		const owner = this.captureMetadataOwner();
		const committedSelection = await owner.run(async () => {
			owner.assertCurrent();
			const selection = this.planThinkingLevel(level, this.model);
			if (!selection) return;
			const commit = await this.appendThinkingSelection(owner, selection);
			return {
				event: selection.event,
				commit
			};
		});
		try {
			await this.emitThinkingLevelSelect(committedSelection?.event, owner.runner, owner.isCurrent);
		} catch (cause) {
			this.failAfterMetadataCommit(cause, committedSelection?.commit);
		}
	}
	planThinkingLevel(level, model) {
		const effectiveLevel = (model ? getSupportedThinkingLevels(model) : THINKING_LEVELS).includes(level) ? level : model ? clampThinkingLevel(model, level) : "off";
		const previousLevel = this.agent.state.thinkingLevel;
		if (effectiveLevel === previousLevel) return;
		return {
			event: {
				type: "thinking_level_select",
				level: effectiveLevel,
				previousLevel
			},
			saveDefault: Boolean(model?.reasoning) || effectiveLevel !== "off"
		};
	}
	async appendThinkingSelection(owner, selection) {
		const publication = {};
		await withSessionMetadataPublication(owner.manager, {
			type: "thinking_level_change",
			thinkingLevel: selection.event.level
		}, (commit) => {
			publication.commit = commit;
			this.agent.state.thinkingLevel = selection.event.level;
			if (selection.saveDefault) this.settingsManager.setDefaultThinkingLevel(selection.event.level);
		}, () => owner.manager.appendThinkingLevelChange(selection.event.level));
		return publication.commit;
	}
	emitThinkingLevelSelect(event, runner, isCurrent) {
		if (event && isCurrent()) {
			this.emit({
				type: "thinking_level_changed",
				level: event.level
			});
			if (isCurrent()) return runner.emit(event);
		}
		return Promise.resolve();
	}
	failAfterMetadataCommit(cause, commit) {
		if (cause instanceof SessionMetadataCommittedError || !commit) throw cause;
		throw new SessionMetadataCommittedError(commit.entry, commit.version, cause, commit.target);
	}
	captureMetadataOwner() {
		const manager = this.sessionManager;
		const target = manager.getSessionTarget();
		const sessionId = manager.getSessionId();
		const runner = this.currentExtensionRunner;
		const assertAmbient = target ? captureOwnedTranscriptWriteAssertion(target) : void 0;
		const assertCurrent = () => {
			const current = manager.getSessionTarget();
			if (manager.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(target, current)) throw new Error("Session manager identity changed before transcript write admission");
			if (this.currentExtensionRunner !== runner || runner.createContext().sessionManager !== manager) throw new Error("Session metadata source changed before publication");
			assertAmbient?.();
		};
		return {
			manager,
			runner,
			assertCurrent,
			isCurrent: () => {
				try {
					assertCurrent();
					return true;
				} catch {
					return false;
				}
			},
			run: (operation) => {
				const write = () => withSessionManagerAppend(manager, operation);
				return target ? withSessionTranscriptWriteAssertion(target, assertCurrent, write) : write();
			}
		};
	}
	supportsThinking() {
		return Boolean(this.model?.reasoning);
	}
	getThinkingLevelForModelSwitch() {
		if (!this.supportsThinking()) return this.settingsManager.getDefaultThinkingLevel() ?? "medium";
		return this.thinkingLevel;
	}
	/** Update steering mode and persist it to settings. */
	setSteeringMode(mode) {
		this.agent.steeringMode = mode;
		this.settingsManager.setSteeringMode(mode);
	}
	/** Update follow-up mode and persist it to settings. */
	setFollowUpMode(mode) {
		this.agent.followUpMode = mode;
		this.settingsManager.setFollowUpMode(mode);
	}
};
//#endregion
//#region src/agents/sessions/agent-session-inspection.ts
var AgentSessionInspection = class extends AgentSessionModels {
	/** @deprecated Await setSessionNameAsync. Supported through 2026-12-31. */
	setSessionName(name) {
		warnSessionPersistenceDeprecation("AgentSession.setSessionName", "setSessionNameAsync");
		this.sessionManager.appendSessionInfo(name);
		this.emit({
			type: "session_info_changed",
			name: this.sessionManager.getSessionName()
		});
	}
	/** Persist the display name before publishing its changed event. */
	async setSessionNameAsync(name) {
		const manager = this.sessionManager;
		const target = manager.getSessionTarget();
		const sessionId = manager.getSessionId();
		const runner = this.currentExtensionRunner;
		const context = runner.createContext();
		const assertOwned = target ? captureOwnedTranscriptWriteAssertion(target) : void 0;
		const assertCurrent = () => {
			assertOwned?.();
			if (this.sessionManager !== manager || manager.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(target, manager.getSessionTarget()) || this.currentExtensionRunner !== runner || context.sessionManager !== manager) throw new Error("Session changed before publishing its display name");
		};
		await withSessionManagerWriteAssertion(manager, assertCurrent, () => manager.appendSessionInfoAsync(name));
		assertCurrent();
		this.emit({
			type: "session_info_changed",
			name: manager.getSessionName()
		});
	}
	getContextUsage() {
		const model = this.model;
		if (!model) return;
		const contextWindow = model.contextWindow ?? 0;
		if (contextWindow <= 0) return;
		const branchEntries = this.sessionManager.getBranch();
		const latestCompaction = getLatestCompactionEntry(branchEntries);
		const providerCheckpointIndex = branchEntries.findLastIndex((entry) => entry.type === "message" && entry.message.role === "assistant" && isCompactionReplayCheckpoint(entry.message.providerReplay));
		const clientCompactionIndex = latestCompaction ? branchEntries.lastIndexOf(latestCompaction) : -1;
		const compactionIndex = Math.max(clientCompactionIndex, providerCheckpointIndex);
		const providerCheckpoint = providerCheckpointIndex > clientCompactionIndex;
		let usageSource = "unknown";
		if (compactionIndex >= 0) {
			for (let index = branchEntries.length - 1; index > compactionIndex; index -= 1) {
				const entry = branchEntries[index];
				if (entry.type === "message" && entry.message.role === "assistant") {
					const assistant = entry.message;
					if (assistant.stopReason !== "aborted" && assistant.stopReason !== "error") {
						if (providerCheckpoint && assistant.usage.contextUsage?.state !== "available") continue;
						if (assistant.usage.contextUsage?.state === "unavailable") {
							usageSource = "content";
							continue;
						}
						if (calculateContextTokens(assistant.usage) > 0) {
							usageSource = "provider";
							break;
						}
					}
				}
			}
			if (usageSource !== "provider" && (providerCheckpoint || usageSource !== "content")) return {
				tokens: null,
				contextWindow,
				percent: null
			};
		}
		const tokens = usageSource === "content" ? estimateMessagesFromContent(this.messages) : estimateContextTokens(this.messages).tokens;
		return {
			tokens,
			contextWindow,
			percent: tokens / contextWindow * 100
		};
	}
	getLastAssistantText() {
		const message = this.messages.findLast((entry) => entry.role === "assistant" && (entry.stopReason !== "aborted" || hasPersistedAssistantContent(entry.content)));
		return message ? extractTextContent(message.content).trim() || void 0 : void 0;
	}
};
//#endregion
//#region src/agents/sessions/compaction/runtime.ts
/** Adds a private usage sink without changing public summary result shapes. */
function createCompactionRuntime(usageSink) {
	return usageSink ? {
		...openClawAgentCoreRuntime,
		internalUsageSink: usageSink
	} : openClawAgentCoreRuntime;
}
//#endregion
//#region src/agents/sessions/manual-compaction-preflight.ts
/** Plans manual compaction without aborting or otherwise mutating the active session. */
function preflightManualSessionCompaction(pathEntries, settings) {
	let result = prepareCompaction(pathEntries, settings);
	if (result.ok && !result.value) result = prepareCompaction(pathEntries, {
		...settings,
		keepRecentTokens: 0
	});
	if (!result.ok) throw result.error;
	const preparation = result.value;
	if (preparation) return {
		compactable: true,
		preparation
	};
	return {
		compactable: false,
		reason: pathEntries.at(-1)?.type === "compaction" ? "Already compacted" : "Nothing to compact (session too small)"
	};
}
//#endregion
//#region src/agents/sessions/agent-session-compaction.ts
function compactionErrorMessage(error, fallback) {
	const message = error instanceof Error ? error.message : String(error);
	return message.trim() ? message : fallback;
}
/** @internal */
const agentSessionAutomaticCompaction = Symbol.for("openclaw.agent-session.automatic-compaction");
/** Installs a synchronous callback for model-context replacement during compaction. */
const agentSessionSetContextReplacementHook = Symbol.for("openclaw.agent-session.set-context-replacement-hook");
var AgentSessionCompaction = class extends AgentSessionInspection {
	constructor(..._args) {
		super(..._args);
		this[agentSessionDeferThresholdCompaction] = false;
	}
	async [agentSessionRunProviderCompaction](run, hooksHandled = false) {
		const controller = new AbortController();
		const itemId = generateSessionEntryId();
		let committed = false;
		this.autoCompactionAbortController = controller;
		try {
			this.emit({
				type: "compaction_start",
				reason: "threshold",
				itemId,
				hooksHandled
			});
			return await run(controller.signal, (tokensBefore, tokensAfter) => {
				committed = true;
				this.emit({
					type: "compaction_end",
					reason: "threshold",
					itemId,
					hooksHandled,
					outcome: {
						status: "completed",
						tokensBefore,
						tokensAfter,
						willRetry: false
					}
				});
				this.onContextReplaced?.(tokensAfter, tokensBefore);
			});
		} catch (error) {
			if (!committed) this.emit({
				type: "compaction_end",
				reason: "threshold",
				itemId,
				hooksHandled,
				outcome: controller.signal.aborted ? { status: "aborted" } : {
					status: "failed",
					reason: compactionErrorMessage(error, "Provider compaction failed")
				}
			});
			throw error;
		} finally {
			if (this.autoCompactionAbortController === controller) this.autoCompactionAbortController = void 0;
		}
	}
	[agentSessionSetContextReplacementHook](callback, assertActive) {
		this.onContextReplaced = callback;
		this.assertContextReplacementActive = assertActive;
	}
	/**
	* Manually compact the session context.
	* Aborts current agent operation first.
	*/
	async compact(customInstructions) {
		return await this.runWithSessionWriteSettlement(async () => {
			const outcome = await this.compactWithSessionWriteSettlement(customInstructions, "none");
			if (outcome.status === "skipped") throw new Error(outcome.reason);
			return outcome.result;
		});
	}
	async [agentSessionAutomaticCompaction](customInstructions, requestState, summaryOutputPolicy = "retry-invalid-once", constraints) {
		return await this.runWithSessionWriteSettlement(() => this.compactWithSessionWriteSettlement(customInstructions, summaryOutputPolicy, requestState, constraints));
	}
	async compactWithSessionWriteSettlement(customInstructions, summaryOutputPolicy = "none", requestState, constraints) {
		this.disconnectFromAgent();
		await this.abort();
		const abortController = new AbortController();
		this.compactionAbortController = abortController;
		const itemId = generateSessionEntryId();
		this.emit({
			type: "compaction_start",
			reason: "manual",
			itemId
		});
		try {
			const settings = this.settingsManager.getCompactionSettings();
			let outcome;
			try {
				outcome = await this.runCompactionWork({
					itemId,
					customInstructions,
					mode: "manual",
					summaryOutputPolicy,
					requestState,
					...constraints,
					settings,
					signal: abortController.signal
				});
			} catch (error) {
				const message = compactionErrorMessage(error, "Compaction failed");
				const aborted = abortController.signal.aborted || error instanceof Error && error.name === "AbortError";
				this.emit({
					type: "compaction_end",
					reason: "manual",
					itemId,
					outcome: aborted ? { status: "aborted" } : {
						status: "failed",
						reason: `Compaction failed: ${message}`
					}
				});
				throw error;
			}
			if (outcome.status === "skipped") {
				this.emit({
					type: "compaction_end",
					reason: "manual",
					itemId,
					outcome
				});
				return outcome;
			}
			if (outcome.status === "aborted") {
				this.emit({
					type: "compaction_end",
					reason: "manual",
					itemId,
					outcome
				});
				throw new Error("Compaction cancelled");
			}
			this.emitCompletedCompaction("manual", itemId, outcome, false);
			return outcome;
		} finally {
			if (this.compactionAbortController === abortController) this.compactionAbortController = void 0;
			this.reconnectToAgent();
		}
	}
	emitCompletedCompaction(reason, itemId, outcome, willRetry) {
		this.emit({
			type: "compaction_end",
			reason,
			itemId,
			outcome: {
				status: "completed",
				tokensBefore: outcome.result.tokensBefore,
				tokensAfter: outcome.tokensAfter,
				willRetry,
				...parseCompactionDetails(outcome.result.details)?.qualityDegraded ? { qualityDegraded: true } : {}
			}
		});
	}
	/** Cancel in-progress compaction (manual or auto). */
	abortCompaction() {
		this.compactionAbortController?.abort();
		this.autoCompactionAbortController?.abort();
	}
	abortBranchSummary() {
		this.branchSummaryAbortController?.abort();
	}
	async runCompactionWork(options) {
		const isManual = options.mode === "manual";
		const assertContextReplacementActive = this.assertContextReplacementActive;
		const onContextReplaced = this.onContextReplaced;
		if (!this.model) {
			if (isManual) throw new Error(formatNoModelSelectedMessage());
			return {
				status: "skipped",
				reason: formatNoModelSelectedMessage()
			};
		}
		const model = this.model;
		const compactionThinkingLevel = this.resolveCompactionThinkingLevel?.(model, this.thinkingLevel) ?? this.thinkingLevel;
		let auth = {};
		if (options.summaryOutputPolicy !== "deterministic") try {
			auth = await this.getCompactionRequestAuth(model);
		} catch (error) {
			if (isManual) throw error;
			return {
				status: "skipped",
				reason: compactionErrorMessage(error, "Compaction authentication failed")
			};
		}
		const pathEntries = this.sessionManager.getBranch();
		const requestBudget = options.requestBudget;
		const pendingUserIdempotencyKey = requestBudget?.pendingTokens ? requestBudget.pendingUserIdempotencyKey : void 0;
		const pendingEntryIndex = options.pendingUserEntryId || pendingUserIdempotencyKey ? pathEntries.findLastIndex((entry) => entry.type === "message" && entry.message.role === "user" && (options.pendingUserEntryId ? entry.id === options.pendingUserEntryId : "idempotencyKey" in entry.message && entry.message.idempotencyKey === pendingUserIdempotencyKey)) : -1;
		if (options.pendingUserEntryId && pendingEntryIndex < 0) throw new Error("Compaction cannot find the admitted pending user request.");
		const retention = requestBudget ? resolveCompactionRetentionBudget(requestBudget, buildSessionContext(pathEntries).messages) : void 0;
		const requestTokenLimit = requestBudget && retention ? requestBudget.fixedTokens + requestBudget.pendingTokens + retention.maxTokens : void 0;
		let preparation;
		if (isManual && !options.requestState && !requestBudget && pendingEntryIndex < 0) {
			const manualPreflight = preflightManualSessionCompaction(pathEntries, options.settings);
			if (!manualPreflight.compactable) throw new Error(manualPreflight.reason);
			preparation = manualPreflight.preparation;
		} else preparation = unwrapCoreResult(prepareCompaction(pathEntries, options.settings, pendingUserIdempotencyKey && pendingEntryIndex < 0 ? void 0 : options.requestState, requestBudget || pendingEntryIndex >= 0 || options.requestFromEntryId ? {
			requestFromEntryId: options.requestFromEntryId ?? pathEntries[pendingEntryIndex]?.id,
			preserveFromEntryId: pathEntries[pendingEntryIndex]?.id,
			...requestBudget && retention ? { budget: {
				...retention,
				estimateTokens: (message) => estimateCompactionHistoryTokens([message], requestBudget)
			} } : {}
		} : void 0));
		if (!preparation) return {
			status: "skipped",
			reason: "Nothing to compact (session too small)"
		};
		const projectReplacement = (result, summary) => buildSessionContext([...pathEntries, {
			...result,
			type: "compaction",
			id: options.itemId,
			parentId: pathEntries.at(-1)?.id ?? null,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			summary
		}]).messages;
		if (requestBudget && requestTokenLimit !== void 0) {
			const remaining = requestTokenLimit - estimateCompactedRequestTokens(projectReplacement(preparation, ""), requestBudget);
			preparation.summaryTokenBudget = Math.floor(remaining / SAFETY_MARGIN) - 1;
		}
		let compactionResult;
		let fromExtension = false;
		if (options.summaryOutputPolicy === "deterministic") compactionResult = unwrapCoreResult(compactWithoutSummary(preparation));
		else if (this.currentExtensionRunner.hasHandlers("session_before_compact")) {
			const extensionResult = await this.currentExtensionRunner.emit({
				type: "session_before_compact",
				preparation,
				branchEntries: pathEntries,
				customInstructions: options.customInstructions,
				signal: options.signal,
				thinkingLevel: compactionThinkingLevel,
				streamFn: this.agent.streamFn
			});
			if (extensionResult?.cancel) return { status: "aborted" };
			if (extensionResult?.compaction) {
				compactionResult = extensionResult.compaction;
				fromExtension = true;
			}
		}
		if (!compactionResult) {
			const focus = normalizeOptionalString(options.customInstructions);
			const boundedFocus = focus ? resolveCompactionInstructions(focus, void 0) : void 0;
			const coreInstructions = [boundedFocus ? wrapUntrustedPromptDataBlock({
				label: "Compaction focus",
				text: boundedFocus
			}) : "", preparation.latestUnresolvedUserRequest ? ["The run owner will resume this request after compaction. Preserve it as current work.", wrapUntrustedPromptDataBlock({
				label: "Latest unresolved user request",
				text: preparation.latestUnresolvedUserRequest
			})].join("\n") : ""].filter(Boolean).join("\n\n");
			const runCoreCompaction = () => compact(preparation, model, auth.apiKey, auth.headers, coreInstructions || void 0, options.signal, compactionThinkingLevel, this.agent.streamFn, createCompactionRuntime((usage) => recordSessionModelUsage(this.sessionManager, usage)));
			let result = await runCoreCompaction();
			if (options.signal.aborted) return { status: "aborted" };
			if (options.summaryOutputPolicy === "retry-invalid-once" && !result.ok && result.error instanceof InvalidSummaryOutputError) {
				result = await runCoreCompaction();
				if (options.signal.aborted) return { status: "aborted" };
			}
			compactionResult = unwrapCoreResult(result);
		}
		options.onSummaryReady?.();
		if (options.signal.aborted) return { status: "aborted" };
		const completedCompaction = {
			...compactionResult,
			summary: capCompactionSummary(compactionResult.summary)
		};
		const { firstKeptEntryId } = completedCompaction;
		const firstKeptIndex = pathEntries.findIndex((entry) => entry.id === firstKeptEntryId);
		if (pendingEntryIndex >= 0 && (firstKeptIndex < 0 || firstKeptIndex > pendingEntryIndex)) throw new Error("Compaction must retain the unprocessed pending user request.");
		if (requestBudget && requestTokenLimit !== void 0 && estimateCompactedRequestTokens(projectReplacement(completedCompaction, completedCompaction.summary), requestBudget) > requestTokenLimit) throw new Error("The finalized compaction exceeds the foreground request budget. Reduce the request or select a larger context window.");
		const contextReplacementChanged = (controller) => controller?.signal !== options.signal || this.assertContextReplacementActive !== assertContextReplacementActive || this.onContextReplaced !== onContextReplaced;
		const committed = await withSessionManagerWrite(this.sessionManager, async () => {
			const currentController = isManual ? this.compactionAbortController : this.autoCompactionAbortController;
			if (options.signal.aborted || contextReplacementChanged(currentController)) return;
			assertContextReplacementActive?.();
			const replacementMessages = sanitizeCompactionReplayMessages(projectReplacement(completedCompaction, completedCompaction.summary));
			const tokensAfter = requestBudget ? estimateCompactedRequestTokens(replacementMessages, {
				...requestBudget,
				pendingTokens: 0
			}) : estimateContextTokens(replacementMessages).tokens;
			const assertCommitCurrent = () => {
				options.signal.throwIfAborted();
				const controller = isManual ? this.compactionAbortController : this.autoCompactionAbortController;
				if (contextReplacementChanged(controller)) throw new Error("Compaction context changed before transcript commit");
				assertContextReplacementActive?.();
			};
			const append = () => this.sessionManager.appendCompactionAsync(completedCompaction.summary, completedCompaction.firstKeptEntryId, completedCompaction.tokensBefore, completedCompaction.details, fromExtension, { itemId: options.itemId }, tokensAfter);
			const target = this.sessionManager.getSessionTarget();
			const entryId = await (target ? withSessionTranscriptWriteAssertion(target, assertCommitCurrent, append) : append());
			const sessionContext = this.sessionManager.buildSessionContext();
			this.agent.state.messages = sanitizeCompactionReplayMessages(sessionContext.messages);
			onContextReplaced?.(tokensAfter, completedCompaction.tokensBefore, completedCompaction.details);
			return {
				entryId,
				tokensAfter
			};
		});
		if (committed === void 0) return { status: "aborted" };
		const { entryId: compactionEntryId, tokensAfter } = committed;
		const savedCompactionEntry = this.sessionManager.getEntry(compactionEntryId);
		if (this.currentExtensionRunner && savedCompactionEntry?.type === "compaction") await this.currentExtensionRunner.emit({
			type: "session_compact",
			compactionEntry: savedCompactionEntry,
			fromExtension
		});
		return {
			status: "completed",
			result: completedCompaction,
			tokensAfter
		};
	}
	/**
	* Check if compaction is needed and run it.
	* Called after agent_end and before prompt submission.
	*
	* Two cases:
	* 1. Overflow: LLM returned context overflow error, remove error message from agent state, compact, auto-retry
	* 2. Threshold: Context over threshold, compact, NO auto-retry (user continues manually)
	*
	* @param assistantMessage The assistant message to check
	* @param skipAbortedCheck If false, include aborted messages (for pre-prompt check). Default: true
	*/
	async checkCompaction(assistantMessage, skipAbortedCheck = true, requestBudget) {
		const settings = this.settingsManager.getCompactionSettings();
		if (!settings.enabled) return false;
		if (skipAbortedCheck && assistantMessage.stopReason === "aborted") return false;
		const contextWindow = this.model?.contextWindow ?? 0;
		const sameModel = this.model && assistantMessage.provider === this.model.provider && assistantMessage.model === this.model.id;
		const compactionEntry = getLatestCompactionEntry(this.sessionManager.getBranch());
		if (compactionEntry !== null && assistantMessage.timestamp <= new Date(compactionEntry.timestamp).getTime()) return false;
		if (sameModel && (assistantMessage.stopReason === "error" || assistantMessage.stopReason === "length") && isContextOverflow(assistantMessage, contextWindow)) {
			if (this.contextOverflowRecoveryOwner === "caller") return false;
			if (this.overflowRecoveryAttempts >= 3) {
				this.emit({
					type: "compaction_end",
					reason: "overflow",
					outcome: {
						status: "failed",
						reason: `Context overflow recovery failed after 3 compact-and-retry attempts. Try reducing context or switching to a larger-context model.`
					}
				});
				return false;
			}
			this.overflowRecoveryAttempts += 1;
			const messages = this.agent.state.messages;
			if (messages.at(-1)?.role === "assistant") this.agent.state.messages = messages.slice(0, -1);
			return await this.runAutoCompaction("overflow", true, requestBudget);
		}
		if (this[agentSessionDeferThresholdCompaction]) return false;
		let contextTokens;
		if (assistantMessage.stopReason === "error") {
			const messages = this.agent.state.messages;
			const estimate = estimateContextTokens(messages);
			if (estimate.lastUsageIndex === null) return false;
			contextTokens = estimate.tokens;
		} else if (assistantMessage.usage.contextUsage?.state === "unavailable") {
			const estimatedContextTokens = this.getContextUsage()?.tokens;
			if (estimatedContextTokens == null) return false;
			contextTokens = estimatedContextTokens;
		} else contextTokens = calculateContextTokens(assistantMessage.usage);
		if (shouldCompact(contextTokens, contextWindow, settings)) return await this.runAutoCompaction("threshold", false, requestBudget);
		return false;
	}
	async runAutoCompaction(reason, willRetry, requestBudget) {
		const settings = this.settingsManager.getCompactionSettings();
		const contextWindow = this.model?.contextWindow;
		const itemId = generateSessionEntryId();
		this.emit({
			type: "compaction_start",
			reason,
			itemId
		});
		const abortController = new AbortController();
		this.autoCompactionAbortController = abortController;
		try {
			const outcome = await this.runCompactionWork({
				itemId,
				mode: "auto",
				requestBudget: requestBudget ?? (typeof contextWindow === "number" && Number.isFinite(contextWindow) && contextWindow > 0 ? createCompactionRequestBudget({
					contextWindow,
					reserveTokens: settings.reserveTokens,
					systemPrompt: this.agent.state.systemPrompt,
					tools: this.agent.state.tools
				}) : void 0),
				...willRetry ? { requestState: "unresolved" } : {},
				summaryOutputPolicy: "retry-invalid-once",
				settings,
				signal: abortController.signal
			});
			if (outcome.status !== "completed") {
				this.emit({
					type: "compaction_end",
					reason,
					itemId,
					outcome
				});
				return false;
			}
			this.emitCompletedCompaction(reason, itemId, outcome, willRetry);
			if (willRetry) {
				const messages = this.agent.state.messages;
				const lastMsg = messages[messages.length - 1];
				if (lastMsg?.role === "assistant" && (lastMsg.stopReason === "error" || lastMsg.stopReason === "length")) this.agent.state.messages = messages.slice(0, -1);
				return true;
			}
			return this.agent.hasQueuedMessages();
		} catch (error) {
			if (abortController.signal.aborted) {
				this.emit({
					type: "compaction_end",
					reason,
					itemId,
					outcome: { status: "aborted" }
				});
				return false;
			}
			const errorMessage = compactionErrorMessage(error, "compaction failed");
			this.emit({
				type: "compaction_end",
				reason,
				itemId,
				outcome: {
					status: "failed",
					reason: reason === "overflow" ? `Context overflow recovery failed: ${errorMessage}` : `Auto-compaction failed: ${errorMessage}`
				}
			});
			return false;
		} finally {
			if (this.autoCompactionAbortController === abortController) this.autoCompactionAbortController = void 0;
		}
	}
	get autoCompactionEnabled() {
		return this.settingsManager.getCompactionEnabled();
	}
};
//#endregion
//#region src/agents/sessions/agent-session-extensions.ts
function describeCommands(commands, source, name) {
	return commands.map((command) => ({
		name: name(command),
		description: command.description,
		source,
		sourceInfo: command.sourceInfo
	}));
}
var AgentSessionExtensions = class extends AgentSessionCompaction {
	async bindExtensions(bindings) {
		if (bindings.uiContext !== void 0) this.extensionUIContext = bindings.uiContext;
		if (bindings.commandContextActions !== void 0) this.extensionCommandContextActions = bindings.commandContextActions;
		if (bindings.abortHandler !== void 0) this.extensionAbortHandler = bindings.abortHandler;
		if (bindings.shutdownHandler !== void 0) this.extensionShutdownHandler = bindings.shutdownHandler;
		if (bindings.onError !== void 0) this.extensionErrorListener = bindings.onError;
		this.applyExtensionBindings(this.currentExtensionRunner);
		await this.currentExtensionRunner.emit({
			type: "session_start",
			reason: "startup"
		});
		await this.extendResourcesFromExtensions("startup");
	}
	async extendResourcesFromExtensions(reason) {
		if (!this.currentExtensionRunner.hasHandlers("resources_discover")) return;
		const { skillPaths, promptPaths, themePaths } = await this.currentExtensionRunner.emitResourcesDiscover(this.cwd, reason);
		if (skillPaths.length === 0 && promptPaths.length === 0 && themePaths.length === 0) return;
		const extensionPaths = {
			skillPaths: this.buildExtensionResourcePaths(skillPaths),
			promptPaths: this.buildExtensionResourcePaths(promptPaths),
			themePaths: this.buildExtensionResourcePaths(themePaths)
		};
		this.sessionResourceLoader.extendResources(extensionPaths);
		this.agent.state.systemPrompt = this.baseSystemPrompt;
	}
	buildExtensionResourcePaths(entries) {
		return entries.map((entry) => {
			const synthetic = entry.extensionPath.startsWith("<");
			return {
				path: entry.path,
				metadata: {
					source: `extension:${synthetic ? entry.extensionPath.replace(/[<>]/g, "") : basename(entry.extensionPath).replace(/\.(ts|js)$/, "")}`,
					scope: "temporary",
					origin: "top-level",
					baseDir: synthetic ? void 0 : dirname(entry.extensionPath)
				}
			};
		});
	}
	applyExtensionBindings(runner) {
		runner.setUIContext(this.extensionUIContext);
		runner.bindCommandContext(this.extensionCommandContextActions);
		this.extensionErrorUnsubscriber?.();
		this.extensionErrorUnsubscriber = this.extensionErrorListener ? runner.onError(this.extensionErrorListener) : void 0;
	}
	refreshCurrentModelFromRegistry() {
		const currentModel = this.model;
		if (!currentModel) return;
		const refreshedModel = this.sessionModelRegistry.find(currentModel.provider, currentModel.id);
		if (!refreshedModel || refreshedModel === currentModel) return;
		this.agent.state.model = refreshedModel;
	}
	bindExtensionCore(runner) {
		const reportSendError = (event, err) => {
			runner.emitError({
				extensionPath: "<runtime>",
				event,
				error: err instanceof Error ? err.message : String(err)
			});
		};
		const getCommands = () => [
			...describeCommands(runner.getRegisteredCommands(), "extension", (command) => command.invocationName),
			...describeCommands(this.promptTemplates, "prompt", (template) => template.name),
			...describeCommands(this.sessionResourceLoader.getSkills().skills, "skill", (skill) => `skill:${skill.name}`)
		];
		runner.bindCoreAsync({
			sendMessage: (message, options) => {
				this.sendCustomMessage(message, options).catch((err) => reportSendError("send_message", err));
			},
			sendUserMessage: (content, options) => {
				this.sendUserMessage(content, options).catch((err) => reportSendError("send_user_message", err));
			},
			appendEntry: (customType, data) => {
				this.sessionManager.appendCustomEntry(customType, data);
			},
			appendEntryAsync: (customType, data) => this.sessionManager.appendCustomEntryAsync(customType, data),
			setSessionName: (name) => {
				this.setSessionName(name);
			},
			setSessionNameAsync: (name) => this.setSessionNameAsync(name),
			getSessionName: () => {
				return this.sessionManager.getSessionName();
			},
			setLabel: (entryId, label) => {
				this.sessionManager.appendLabelChange(entryId, label);
			},
			setLabelAsync: async (entryId, label) => {
				await this.sessionManager.appendLabelChangeAsync(entryId, label);
			},
			getActiveTools: () => this.getActiveToolNames(),
			getAllTools: () => this.getAllTools(),
			setActiveTools: (toolNames) => this.setActiveToolsByName(toolNames),
			refreshTools: () => this.refreshToolRegistry(),
			getCommands,
			setModel: async (model) => {
				if (!this.sessionModelRegistry.hasConfiguredAuth(model)) return false;
				await this.setModel(model);
				return true;
			},
			getThinkingLevel: () => this.thinkingLevel,
			setThinkingLevel: (level) => this.setThinkingLevel(level)
		}, {
			getModel: () => this.model,
			isIdle: () => !this.isStreaming,
			getSignal: () => this.agent.signal,
			abort: () => {
				if (this.extensionAbortHandler) {
					this.extensionAbortHandler();
					return;
				}
				this.abort();
			},
			hasPendingMessages: () => this.pendingMessageCount > 0,
			shutdown: () => {
				this.extensionShutdownHandler?.();
			},
			getContextUsage: () => this.getContextUsage(),
			compact: (options) => {
				(async () => {
					try {
						const result = await this.compact(options?.customInstructions);
						options?.onComplete?.(result);
					} catch (error) {
						const err = error instanceof Error ? error : new Error(String(error));
						options?.onError?.(err);
					}
				})();
			},
			getSystemPrompt: () => this.systemPrompt
		}, {
			registerProvider: (name, config) => {
				this.sessionModelRegistry.registerProvider(name, config);
				this.refreshCurrentModelFromRegistry();
			},
			unregisterProvider: (name) => {
				this.sessionModelRegistry.unregisterProvider(name);
				this.refreshCurrentModelFromRegistry();
			}
		});
	}
	/** Replace a runtime-owned tool surface without restarting its active agent loop. */
	replaceCustomTools(customTools, activeToolNames) {
		this.customTools = customTools;
		this.allowedToolNames = new Set(activeToolNames);
		this.refreshToolRegistry(activeToolNames);
	}
	refreshToolRegistry(activeToolNames = this.getActiveToolNames()) {
		const allCustomTools = [...this.currentExtensionRunner.getAllRegisteredTools(), ...this.customTools.map((definition) => ({
			definition,
			sourceInfo: createSyntheticSourceInfo(`<sdk:${definition.name}>`, { source: "sdk" })
		}))].filter((tool) => this.allowedToolNames.has(tool.definition.name));
		this.toolDefinitions = new Map(allCustomTools.map((tool) => [tool.definition.name, tool]));
		this.toolRegistry = new Map(wrapRegisteredTools(allCustomTools, this.currentExtensionRunner).map((tool) => [tool.name, tool]));
		this.setActiveToolsByName([.../* @__PURE__ */ new Set([...activeToolNames, ...this.toolRegistry.keys()])]);
	}
	buildRuntime(options) {
		const extensionsResult = this.sessionResourceLoader.getExtensions();
		if (options.flagValues) for (const [name, value] of options.flagValues) extensionsResult.runtime.flagValues.set(name, value);
		this.currentExtensionRunner = new ExtensionRunner(extensionsResult.extensions, extensionsResult.runtime, this.cwd, this.sessionManager, this.sessionModelRegistry);
		if (this.extensionRunnerRef) this.extensionRunnerRef.current = this.currentExtensionRunner;
		this.bindExtensionCore(this.currentExtensionRunner);
		this.applyExtensionBindings(this.currentExtensionRunner);
		this.refreshToolRegistry(options.activeToolNames);
	}
	async reload() {
		const previousFlagValues = this.currentExtensionRunner.getFlagValues();
		await emitSessionShutdownEvent(this.currentExtensionRunner, {
			type: "session_shutdown",
			reason: "reload"
		});
		await this.settingsManager.reload();
		this.agent.steeringMode = this.settingsManager.getSteeringMode();
		this.agent.followUpMode = this.settingsManager.getFollowUpMode();
		await this.sessionResourceLoader.reload();
		await this.sessionModelRegistry.refreshAsync();
		this.buildRuntime({
			activeToolNames: this.getActiveToolNames(),
			flagValues: previousFlagValues
		});
		if (this.extensionUIContext || this.extensionCommandContextActions || this.extensionShutdownHandler || this.extensionErrorListener) {
			await this.currentExtensionRunner.emit({
				type: "session_start",
				reason: "reload"
			});
			await this.extendResourcesFromExtensions("reload");
		}
	}
};
//#endregion
//#region src/agents/sessions/agent-session-execution.ts
var AgentSessionExecution = class extends AgentSessionExtensions {
	/**
	* Check if an error is retryable (overloaded, rate limit, server errors).
	* Context overflow errors are NOT retryable (handled by compaction instead).
	*/
	isRetryableError(message) {
		if (message.stopReason !== "error" || !message.errorMessage) return false;
		const contextWindow = this.model?.contextWindow ?? 0;
		if (isContextOverflow(message, contextWindow)) return false;
		return isResponsesOutputLimitToolCallError(message) || isRetryableAssistantError(message);
	}
	/**
	* Prepare a retryable error for continuation with exponential backoff.
	* @returns true if the caller should continue the agent, false otherwise
	*/
	async prepareRetry(message) {
		const settings = this.settingsManager.getRetrySettings();
		if (!settings.enabled) return false;
		this.retryCount++;
		if (this.retryCount > settings.maxRetries) {
			this.retryCount--;
			return false;
		}
		const backoffDelayMs = settings.baseDelayMs * 2 ** (this.retryCount - 1);
		const rateLimitWindow = classifyRateLimitWindow(message.errorMessage);
		const retryAfterDelayMs = rateLimitWindow.kind === "short" && rateLimitWindow.retryAfterSeconds !== void 0 ? Math.ceil(rateLimitWindow.retryAfterSeconds * 1e3) : 0;
		const delayMs = Math.max(backoffDelayMs, retryAfterDelayMs);
		this.emit({
			type: "auto_retry_start",
			attempt: this.retryCount,
			maxAttempts: settings.maxRetries,
			delayMs,
			errorMessage: message.errorMessage || "Unknown error"
		});
		this.retryAbortController = new AbortController();
		try {
			await sleep(delayMs, this.retryAbortController.signal);
		} catch {
			const attempt = this.retryCount;
			this.retryCount = 0;
			this.emit({
				type: "auto_retry_end",
				success: false,
				attempt,
				finalError: "Retry cancelled"
			});
			return false;
		} finally {
			this.retryAbortController = void 0;
		}
		return true;
	}
	/** Cancel an in-progress retry. */
	abortRetry() {
		this.retryAbortController?.abort();
	}
};
//#endregion
//#region src/agents/sessions/agent-session-tree.ts
var AgentSessionTree = class extends AgentSessionExecution {
	/**
	* Navigate to a different node in the session tree.
	* Unlike fork() which creates a new session file, this stays in the same file.
	*
	* @param options.summarize Whether user wants to summarize abandoned branch
	* @param options.replaceInstructions If true, customInstructions replaces the default prompt
	* @param options.label Label to attach to the branch summary entry
	* @returns Result with editorText (if user message) and cancelled status
	*/
	async navigateTree(targetId, options = {}) {
		const oldLeafId = this.sessionManager.getLeafId();
		if (targetId === oldLeafId) return { cancelled: false };
		if (options.summarize && !this.model) throw new Error("No model available for summarization");
		const targetEntry = this.sessionManager.getEntry(targetId);
		if (!targetEntry) throw new Error(`Entry ${targetId} not found`);
		const { entries: entriesToSummarize, commonAncestorId } = oldLeafId ? collectEntriesForBranchSummaryFromBranches(this.sessionManager.getBranch(oldLeafId), this.sessionManager.getBranch(targetId)) : {
			entries: [],
			commonAncestorId: null
		};
		let customInstructions = options.customInstructions;
		let replaceInstructions = options.replaceInstructions;
		let label = options.label;
		const preparation = {
			targetId,
			oldLeafId,
			commonAncestorId,
			entriesToSummarize,
			userWantsSummary: options.summarize ?? false,
			customInstructions,
			replaceInstructions,
			label
		};
		const abortController = new AbortController();
		this.branchSummaryAbortController = abortController;
		try {
			let extensionSummary;
			if (this.currentExtensionRunner.hasHandlers("session_before_tree")) {
				const result = await this.currentExtensionRunner.emit({
					type: "session_before_tree",
					preparation,
					signal: abortController.signal
				});
				if (result?.cancel) return { cancelled: true };
				if (result?.summary && options.summarize) extensionSummary = result.summary;
				if (result?.customInstructions !== void 0) customInstructions = result.customInstructions;
				if (result?.replaceInstructions !== void 0) replaceInstructions = result.replaceInstructions;
				if (result?.label !== void 0) label = result.label;
			}
			const fromExtension = extensionSummary !== void 0;
			let summaryText;
			let summaryDetails;
			if (options.summarize && entriesToSummarize.length > 0 && !extensionSummary) {
				const model = this.model;
				const { apiKey, headers } = await this.getRequiredRequestAuth(model);
				const branchSummarySettings = this.settingsManager.getBranchSummarySettings();
				const result = await generateBranchSummary(entriesToSummarize, {
					model,
					apiKey,
					headers,
					signal: abortController.signal,
					customInstructions,
					replaceInstructions,
					reserveTokens: branchSummarySettings.reserveTokens,
					streamFn: this.agent.streamFn,
					runtime: createCompactionRuntime((usage) => recordSessionModelUsage(this.sessionManager, usage))
				});
				if (!result.ok) {
					if (result.error.code === "aborted") return {
						cancelled: true,
						aborted: true
					};
					throw new Error(result.error.message);
				}
				summaryText = result.value.summary;
				summaryDetails = {
					readFiles: result.value.readFiles,
					modifiedFiles: result.value.modifiedFiles
				};
			} else if (extensionSummary) {
				summaryText = extensionSummary.summary;
				summaryDetails = extensionSummary.details;
			}
			let newLeafId;
			let editorText;
			if (targetEntry.type === "message" && targetEntry.message.role === "user") {
				newLeafId = targetEntry.parentId;
				editorText = extractTextContent(targetEntry.message.content);
			} else if (targetEntry.type === "custom_message") {
				newLeafId = targetEntry.parentId;
				editorText = extractTextContent(targetEntry.content);
			} else newLeafId = targetId;
			const navigation = await withSessionManagerWrite(this.sessionManager, async () => {
				if (abortController.signal.aborted || this.branchSummaryAbortController !== abortController) return {
					cancelled: true,
					aborted: true
				};
				const mutate = async () => {
					let summaryEntry;
					if (summaryText) {
						const summaryId = await this.sessionManager.branchWithSummaryAsync(newLeafId, summaryText, summaryDetails, fromExtension);
						summaryEntry = this.sessionManager.getEntry(summaryId);
						if (label) await this.sessionManager.appendLabelChangeAsync(summaryId, label);
					} else if (newLeafId === null) await this.sessionManager.resetLeafAsync();
					else await this.sessionManager.branchAsync(newLeafId);
					if (label && !summaryText) await this.sessionManager.appendLabelChangeAsync(targetId, label);
					const sessionContext = this.sessionManager.buildSessionContext();
					this.agent.state.messages = sanitizeCompactionReplayMessages(sessionContext.messages);
					return {
						cancelled: false,
						summaryEntry
					};
				};
				const target = this.sessionManager.getSessionTarget();
				return target ? await withSessionTranscriptWriteAssertion(target, () => {
					abortController.signal.throwIfAborted();
					if (this.branchSummaryAbortController !== abortController) throw new Error("Session tree navigation changed before transcript commit");
				}, mutate) : await mutate();
			});
			if (navigation.cancelled) return navigation;
			const { summaryEntry } = navigation;
			await this.currentExtensionRunner.emit({
				type: "session_tree",
				newLeafId: this.sessionManager.getLeafId(),
				oldLeafId,
				summaryEntry,
				fromExtension: summaryText ? fromExtension : void 0
			});
			return {
				editorText,
				cancelled: false,
				summaryEntry
			};
		} finally {
			if (this.branchSummaryAbortController === abortController) this.branchSummaryAbortController = void 0;
		}
	}
	get extensionRunner() {
		return this.currentExtensionRunner;
	}
};
//#endregion
//#region src/agents/sessions/agent-session.ts
/**
* Core abstraction for agent lifecycle and session management.
*
* Shared by interactive, print, and RPC modes. Mode-specific I/O stays above
* this class while the feature layers below own session behavior.
*/
var AgentSession = class extends AgentSessionTree {
	constructor(config) {
		super(config);
		this.unsubscribeAgent = this.agent.subscribe(this.handleAgentEvent);
		this.installAgentToolHooks();
		this.buildRuntime({ activeToolNames: [...this.allowedToolNames] });
	}
};
//#endregion
//#region src/agents/sessions/event-bus.ts
/**
* Tiny event bus abstraction for session UI/runtime notifications.
*
* Isolates handler failures so one bad subscriber cannot break later listeners.
*/
/** Creates an in-process event bus with unsubscribe and clear support. */
function createEventBus() {
	const emitter = new EventEmitter();
	return {
		emit: (channel, data) => {
			emitter.emit(channel, data);
		},
		on: (channel, handler) => {
			const safeHandler = (data) => {
				try {
					handler(data);
				} catch (err) {
					console.error(`Event handler error (${channel}):`, err);
				}
			};
			emitter.on(channel, safeHandler);
			return () => emitter.off(channel, safeHandler);
		},
		clear: () => {
			emitter.removeAllListeners();
		}
	};
}
//#endregion
//#region src/skills/loading/session.ts
const MAX_NAME_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 1024;
function validateSkillMetadata(name, description) {
	const errors = [];
	if (!description || description.trim() === "") errors.push("description is required");
	else if (description.length > MAX_DESCRIPTION_LENGTH) errors.push(`description exceeds ${MAX_DESCRIPTION_LENGTH} characters (${description.length})`);
	if (name.length > MAX_NAME_LENGTH) errors.push(`name exceeds ${MAX_NAME_LENGTH} characters (${name.length})`);
	if (!/^[a-z0-9-]+$/.test(name)) errors.push(`name contains invalid characters (must be lowercase a-z, 0-9, hyphens only)`);
	if (name.startsWith("-") || name.endsWith("-")) errors.push(`name must not start or end with a hyphen`);
	if (name.includes("--")) errors.push(`name must not contain consecutive hyphens`);
	return errors;
}
function resolveSkillEntryType(dir, entry) {
	if (!entry.isSymbolicLink()) return entry;
	try {
		return statSync(join(dir, entry.name));
	} catch {
		return;
	}
}
function loadSkillsFromDirInternal(dir, source, includeRootFiles, ignoreMatcher, rootDir) {
	const skills = [];
	const diagnostics = [];
	if (!existsSync(dir)) return {
		skills,
		diagnostics
	};
	const root = rootDir ?? dir;
	try {
		const ig = addIgnoreRules(dir, root, ignoreMatcher);
		const entries = readdirSync(dir, { withFileTypes: true });
		const skillFile = entries.find((entry) => entry.name === "SKILL.md");
		if (skillFile && resolveSkillEntryType(dir, skillFile)?.isFile()) {
			const fullPath = join(dir, skillFile.name);
			const relPath = normalizeNativePathSeparators(relative(root, fullPath));
			if (!ig.ignores(relPath)) return loadSkillFromFile(fullPath, source);
		}
		for (const entry of entries) {
			if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
			const fullPath = join(dir, entry.name);
			const entryType = resolveSkillEntryType(dir, entry);
			if (!entryType) continue;
			const isDirectory = entryType.isDirectory();
			const relPath = normalizeNativePathSeparators(relative(root, fullPath));
			const ignorePath = isDirectory ? `${relPath}/` : relPath;
			if (ig.ignores(ignorePath)) continue;
			if (!isDirectory && (!entryType.isFile() || !includeRootFiles || !entry.name.endsWith(".md"))) continue;
			const result = isDirectory ? loadSkillsFromDirInternal(fullPath, source, false, ig, root) : loadSkillFromFile(fullPath, source);
			skills.push(...result.skills);
			diagnostics.push(...result.diagnostics);
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "failed to scan skill directory";
		diagnostics.push({
			type: "warning",
			message,
			path: dir
		});
	}
	return {
		skills,
		diagnostics
	};
}
function loadSkillFromFile(filePath, source) {
	const diagnostics = [];
	try {
		const rawContent = readFileSync(filePath, "utf-8");
		const frontmatter = parseSkillFrontmatter(rawContent);
		const skillDir = dirname(filePath);
		const name = frontmatter.name || basename(skillDir);
		for (const error of validateSkillMetadata(name, frontmatter.description)) diagnostics.push({
			type: "warning",
			message: error,
			path: filePath
		});
		if (!frontmatter.description || frontmatter.description.trim() === "") return {
			skills: [],
			diagnostics
		};
		return {
			skills: [materializeSkill({
				content: rawContent,
				frontmatter,
				name,
				description: frontmatter.description,
				filePath,
				baseDir: skillDir,
				source,
				sourceOptions: source === "user" || source === "project" ? {
					source: "local",
					scope: source
				} : { source: source === "path" ? "local" : source }
			})],
			diagnostics
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "failed to parse skill file";
		diagnostics.push({
			type: "warning",
			message,
			path: filePath
		});
		return {
			skills: [],
			diagnostics
		};
	}
}
/** Agent Skills catalog: https://agentskills.io/integrate-skills */
function formatSkillsForPrompt(skills) {
	return formatSkillsForPromptBounded({ skills: skills.filter((s) => !s.disableModelInvocation) });
}
function loadSkills(options) {
	const { cwd, agentDir, skillPaths, includeDefaults } = options;
	const skillMap = /* @__PURE__ */ new Map();
	const realPathSet = /* @__PURE__ */ new Set();
	const allDiagnostics = [];
	const collisionDiagnostics = [];
	function addSkills(result) {
		allDiagnostics.push(...result.diagnostics);
		for (const skill of result.skills) {
			const realPath = canonicalizePath(skill.filePath);
			if (realPathSet.has(realPath)) continue;
			const existing = skillMap.get(skill.name);
			if (existing) collisionDiagnostics.push({
				type: "collision",
				message: `name "${skill.name}" collision`,
				path: skill.filePath,
				collision: {
					resourceType: "skill",
					name: skill.name,
					winnerPath: existing.filePath,
					loserPath: skill.filePath
				}
			});
			else {
				skillMap.set(skill.name, skill);
				realPathSet.add(realPath);
			}
		}
	}
	const userSkillsDir = join(agentDir, "skills");
	const projectSkillsDir = resolve(cwd, CONFIG_DIR_NAME, "skills");
	if (includeDefaults) {
		addSkills(loadSkillsFromDirInternal(userSkillsDir, "user", true));
		addSkills(loadSkillsFromDirInternal(projectSkillsDir, "project", true));
	}
	for (const rawPath of skillPaths) {
		const expandedPath = expandTildePath(rawPath);
		const resolvedPath = isAbsolute(expandedPath) ? expandedPath : resolve(cwd, expandedPath);
		if (!existsSync(resolvedPath)) {
			allDiagnostics.push({
				type: "warning",
				message: "skill path does not exist",
				path: resolvedPath
			});
			continue;
		}
		try {
			const stats = statSync(resolvedPath);
			const source = !includeDefaults && isPathInside(userSkillsDir, resolvedPath) ? "user" : !includeDefaults && isPathInside(projectSkillsDir, resolvedPath) ? "project" : "path";
			if (stats.isDirectory()) addSkills(loadSkillsFromDirInternal(resolvedPath, source, true));
			else if (stats.isFile() && resolvedPath.endsWith(".md")) addSkills(loadSkillFromFile(resolvedPath, source));
			else allDiagnostics.push({
				type: "warning",
				message: "skill path is not a markdown file",
				path: resolvedPath
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "failed to read skill path";
			allDiagnostics.push({
				type: "warning",
				message,
				path: resolvedPath
			});
		}
	}
	return {
		skills: Array.from(skillMap.values()),
		diagnostics: [...allDiagnostics, ...collisionDiagnostics]
	};
}
//#endregion
//#region src/agents/sessions/resource-loader.ts
var ResourceCollection = class {
	constructor(load, decorate) {
		this.load = load;
		this.decorate = decorate;
		this.resources = [];
		this.diagnostics = [];
		this.paths = [];
		this.sourceInfos = /* @__PURE__ */ new Map();
	}
	register(entries, resolvePath) {
		const sourceInfos = this.sourceInfos;
		return (entries ?? []).map((entry) => {
			const path = resolvePath(entry.path);
			sourceInfos.set(path, createSourceInfo(path, entry.metadata));
			return path;
		});
	}
	update(paths) {
		const loaded = this.load(paths);
		this.resources = loaded.resources.map((resource) => this.decorate(resource, this.sourceInfos));
		this.diagnostics = loaded.diagnostics;
	}
};
var DefaultResourceLoader = class {
	constructor(options) {
		this.skillResources = new ResourceCollection((skillPaths) => {
			const { skills, diagnostics } = loadSkills({
				cwd: this.cwd,
				agentDir: this.agentDir,
				skillPaths,
				includeDefaults: false
			});
			return {
				resources: skills,
				diagnostics
			};
		}, (skill, sources) => ({
			...skill,
			sourceInfo: this.resolveSourceInfoForPath(skill.filePath, sources, skill.sourceInfo)
		}));
		this.promptResources = new ResourceCollection((promptPaths) => this.dedupeResources(loadPromptTemplates({
			cwd: this.cwd,
			agentDir: this.agentDir,
			promptPaths
		}), "prompt", (prompt) => prompt.name, (prompt) => prompt.filePath), (prompt, sources) => Object.assign({}, prompt, { sourceInfo: this.resolveSourceInfoForPath(prompt.filePath, sources, prompt.sourceInfo) }));
		this.themeResources = new ResourceCollection((themePaths) => {
			const loaded = this.loadThemes(themePaths);
			const deduped = this.dedupeResources(loaded.themes, "theme", (theme) => theme.name ?? "unnamed", (theme) => theme.sourcePath);
			return {
				resources: deduped.resources,
				diagnostics: [...loaded.diagnostics, ...deduped.diagnostics]
			};
		}, (theme, sources) => {
			const sourcePath = theme.sourcePath;
			theme.sourceInfo = sourcePath ? this.resolveSourceInfoForPath(sourcePath, sources, theme.sourceInfo) : theme.sourceInfo;
			return theme;
		});
		this.cwd = options.cwd;
		this.agentDir = options.agentDir;
		this.eventBus = createEventBus();
		this.extensionFactories = options.extensionFactories ?? [];
		this.extensionsResult = {
			extensions: [],
			errors: [],
			runtime: createExtensionRuntime()
		};
	}
	getExtensions() {
		return this.extensionsResult;
	}
	getSkills() {
		return {
			skills: this.skillResources.resources,
			diagnostics: this.skillResources.diagnostics
		};
	}
	getPrompts() {
		return {
			prompts: this.promptResources.resources,
			diagnostics: this.promptResources.diagnostics
		};
	}
	getThemes() {
		return {
			themes: this.themeResources.resources,
			diagnostics: this.themeResources.diagnostics
		};
	}
	extendResources(paths) {
		const resolvePath = (path) => this.resolveResourcePath(path);
		const registered = [
			[this.skillResources, this.skillResources.register(paths.skillPaths, resolvePath)],
			[this.promptResources, this.promptResources.register(paths.promptPaths, resolvePath)],
			[this.themeResources, this.themeResources.register(paths.themePaths, resolvePath)]
		];
		for (const [collection, additional] of registered) if (additional.length > 0) {
			collection.paths = this.mergePaths(collection.paths, additional);
			collection.update(collection.paths);
		}
	}
	async reload() {
		for (const collection of [
			this.skillResources,
			this.promptResources,
			this.themeResources
		]) collection.sourceInfos = /* @__PURE__ */ new Map();
		const extensionsResult = {
			extensions: [],
			errors: [],
			runtime: createExtensionRuntime()
		};
		for (const [index, factory] of this.extensionFactories.entries()) {
			const extensionPath = `<inline:${index + 1}>`;
			try {
				extensionsResult.extensions.push(await loadExtensionFromFactory(factory, this.cwd, this.eventBus, extensionsResult.runtime, extensionPath));
			} catch (error) {
				const message = error instanceof Error ? error.message : "failed to load extension";
				extensionsResult.errors.push({
					path: extensionPath,
					error: message
				});
			}
		}
		const conflicts = this.detectExtensionConflicts(extensionsResult.extensions);
		for (const conflict of conflicts) extensionsResult.errors.push({
			path: conflict.path,
			error: conflict.message
		});
		this.extensionsResult = extensionsResult;
		for (const collection of [
			this.skillResources,
			this.promptResources,
			this.themeResources
		]) collection.paths = [];
		this.skillResources.update([]);
		this.promptResources.update([]);
		this.themeResources.update([]);
	}
	resolveSourceInfoForPath(resourcePath, extraSourceInfos, existing) {
		const normalizedResourcePath = resolve(resourcePath);
		for (const [sourcePath, sourceInfo] of extraSourceInfos) if (isPathInside(sourcePath, normalizedResourcePath)) return {
			...sourceInfo,
			path: resourcePath
		};
		return existing ?? this.getDefaultSourceInfoForPath(resourcePath);
	}
	getDefaultSourceInfoForPath(filePath) {
		const normalizedPath = resolve(filePath);
		for (const [baseDir, scope] of [[this.agentDir, "user"], [join(this.cwd, CONFIG_DIR_NAME), "project"]]) for (const resource of [
			"skills",
			"prompts",
			"themes",
			"extensions"
		]) {
			const root = join(baseDir, resource);
			if (isPathInside(root, normalizedPath)) return {
				path: filePath,
				source: "local",
				scope,
				origin: "top-level",
				baseDir: root
			};
		}
		return {
			path: filePath,
			source: "local",
			scope: "temporary",
			origin: "top-level",
			baseDir: statSync(normalizedPath).isDirectory() ? normalizedPath : resolve(normalizedPath, "..")
		};
	}
	mergePaths(primary, additional) {
		const merged = [];
		const seen = /* @__PURE__ */ new Set();
		for (const p of [...primary, ...additional]) {
			const resolved = this.resolveResourcePath(p);
			const canonicalPath = canonicalizePath(resolved);
			if (seen.has(canonicalPath)) continue;
			seen.add(canonicalPath);
			merged.push(resolved);
		}
		return merged;
	}
	resolveResourcePath(p) {
		return resolve(this.cwd, expandTildePath(p));
	}
	loadThemes(paths) {
		const themes = [];
		const diagnostics = [];
		for (const p of paths) {
			const resolved = resolve(this.cwd, p);
			if (!existsSync(resolved)) {
				diagnostics.push({
					type: "warning",
					message: "theme path does not exist",
					path: resolved
				});
				continue;
			}
			let failureMessage = "failed to read theme path";
			try {
				const stats = statSync(resolved);
				let filePaths;
				if (stats.isDirectory()) {
					if (!existsSync(resolved)) continue;
					failureMessage = "failed to read theme directory";
					const { entries, failedDirs } = walkDirectorySync(resolved, {
						maxDepth: 1,
						symlinks: "follow",
						include: (entry) => entry.kind === "file" && entry.name.endsWith(".json")
					});
					const failure = failedDirs[0];
					if (failure) throw failure.error;
					filePaths = entries.map((entry) => join(resolved, entry.name));
				} else if (stats.isFile() && resolved.endsWith(".json")) filePaths = [resolved];
				else {
					diagnostics.push({
						type: "warning",
						message: "theme path is not a json file",
						path: resolved
					});
					continue;
				}
				for (const filePath of filePaths) try {
					themes.push(loadThemeFromPath(filePath));
				} catch (error) {
					const message = error instanceof Error ? error.message : "failed to load theme";
					diagnostics.push({
						type: "warning",
						message,
						path: filePath
					});
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : failureMessage;
				diagnostics.push({
					type: "warning",
					message,
					path: resolved
				});
			}
		}
		return {
			themes,
			diagnostics
		};
	}
	dedupeResources(resources, resourceType, getName, getPath) {
		const seen = /* @__PURE__ */ new Map();
		const diagnostics = [];
		for (const resource of resources) {
			const name = getName(resource);
			const existing = seen.get(name);
			if (existing) {
				const path = getPath(resource);
				diagnostics.push({
					type: "collision",
					message: `name "${resourceType === "prompt" ? "/" : ""}${name}" collision`,
					path,
					collision: {
						resourceType,
						name,
						winnerPath: getPath(existing) ?? "<builtin>",
						loserPath: path ?? "<builtin>"
					}
				});
			} else seen.set(name, resource);
		}
		return {
			resources: Array.from(seen.values()),
			diagnostics
		};
	}
	detectExtensionConflicts(extensions) {
		const conflicts = [];
		const owners = {
			tools: /* @__PURE__ */ new Map(),
			flags: /* @__PURE__ */ new Map()
		};
		for (const ext of extensions) for (const kind of ["tools", "flags"]) for (const name of ext[kind].keys()) {
			const existingOwner = owners[kind].get(name);
			if (existingOwner && existingOwner !== ext.path) {
				const label = kind === "tools" ? `Tool "${name}"` : `Flag "--${name}"`;
				conflicts.push({
					path: ext.path,
					message: `${label} conflicts with ${existingOwner}`
				});
			} else owners[kind].set(name, ext.path);
		}
		return conflicts;
	}
};
//#endregion
//#region src/agents/sessions/http-dispatcher.ts
const DEFAULT_HTTP_IDLE_TIMEOUT_MS = 3e5;
/** Parses idle timeout values, using `0` for the explicit disabled sentinel. */
function parseHttpIdleTimeoutMs(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.toLowerCase() === "disabled") return 0;
		if (trimmed.length === 0) return;
		return parseStrictNonNegativeInteger(trimmed);
	}
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	return Math.floor(value);
}
//#endregion
//#region src/agents/sessions/settings-storage.ts
const SETTINGS_SCOPES = ["global", "project"];
var FileSettingsStorage = class {
	constructor(cwd, agentDir) {
		this.paths = {
			global: join(agentDir, "settings.json"),
			project: join(cwd, CONFIG_DIR_NAME, "settings.json")
		};
	}
	readSettingsScope(scope) {
		const path = this.paths[scope];
		if (!lstatSync(`${path}.lock`, { throwIfNoEntry: false }) && !lstatSync(`${path}.lock.reclaim`, { throwIfNoEntry: false }) && !existsSync(path)) return;
		let content;
		this.withLock(scope, (current) => {
			content = current;
		});
		return content;
	}
	withLock(scope, fn) {
		const path = this.paths[scope];
		const release = acquireFileLockSyncWithRetry(path);
		try {
			const next = fn(existsSync(path) ? readFileSync(path, "utf-8") : void 0);
			if (next !== void 0) {
				const savePath = resolveJsonSaveTarget(path);
				const saveDir = realpathSync(dirname(savePath));
				const canonicalSavePath = join(saveDir, basename(savePath));
				replaceFileAtomicSync({
					filePath: canonicalSavePath,
					content: next,
					dirMode: statSync(saveDir).mode & 4095,
					mode: 438 & ~process.umask(),
					preserveExistingMode: true,
					tempPrefix: basename(canonicalSavePath)
				});
			}
		} finally {
			release();
		}
	}
};
var InMemorySettingsStorage = class {
	constructor() {
		this.values = {
			global: void 0,
			project: void 0
		};
	}
	withLock(scope, fn) {
		const next = fn(this.values[scope]);
		if (next !== void 0) this.values[scope] = next;
	}
};
//#endregion
//#region src/agents/sessions/settings-manager.ts
/**
* Session settings manager.
*
* Loads and persists user/session defaults for models, transports, retry policy, UI, packages, and telemetry.
*/
/** Deep merge settings: project/overrides take precedence, nested objects merge recursively */
function deepMergeSettings(base, overrides) {
	return mergeDeep(base, overrides);
}
function requireSupportedSettings(value, scope) {
	if (!isRecord(value)) throw new TypeError("Session settings must be an object");
	const retired = [];
	if (Object.hasOwn(value, "queueMode")) retired.push("queueMode: use steeringMode");
	if (Object.hasOwn(value, "websockets")) retired.push("websockets: use transport (true becomes \"websocket\", false becomes \"sse\")");
	if (isRecord(value.skills)) retired.push("skills: use its customDirectories array (or []), and move skills.enableSkillCommands to top-level enableSkillCommands if present");
	if (isRecord(value.retry) && Object.hasOwn(value.retry, "maxDelayMs")) retired.push("retry.maxDelayMs: use retry.provider.maxRetryDelayMs");
	if (retired.length > 0) throw createInvalidConfigError(`${scope} session settings.json`, `Retired session settings: ${retired.join("; ")}. Preserve the original file and replace the retired forms while retaining values that already use the current forms before retrying. For a staged upgrade, OpenClaw 2026.9.7 retains the former settings reader. See https://docs.openclaw.ai/gateway/doctor/config-migrations#session-settings.`, { recovery: "manual" });
	return value;
}
var SettingsManager = class SettingsManager {
	constructor(storage, scopes) {
		this.storage = storage;
		this.scopes = scopes;
		this.settings = {};
		this.runtimeOverrides = {};
		this.writeQueue = Promise.resolve();
		this.errors = SETTINGS_SCOPES.flatMap((scope) => {
			const error = scopes[scope].loadError;
			return error ? [{
				scope,
				error
			}] : [];
		});
		this.recomputeSettings();
	}
	static create(cwd, agentDir = getAgentDir()) {
		return SettingsManager.fromStorage(new FileSettingsStorage(cwd, agentDir));
	}
	static fromStorage(storage) {
		return new SettingsManager(storage, {
			global: SettingsManager.loadScope(storage, "global"),
			project: SettingsManager.loadScope(storage, "project")
		});
	}
	static inMemory(settings = {}) {
		const storage = new InMemorySettingsStorage();
		const initialSettings = requireSupportedSettings(structuredClone(settings), "global");
		storage.withLock("global", () => JSON.stringify(initialSettings, null, 2));
		return SettingsManager.fromStorage(storage);
	}
	static loadScope(storage, scope) {
		const state = {
			settings: {},
			modified: /* @__PURE__ */ new Map(),
			loadError: null
		};
		let content;
		try {
			if (storage.readSettingsScope) content = storage.readSettingsScope(scope);
			else storage.withLock(scope, (current) => {
				content = current;
			});
			state.settings = content ? requireSupportedSettings(JSON.parse(content), scope) : {};
		} catch (error) {
			if (isInvalidConfigError(error)) throw error;
			state.loadError = error;
		}
		return state;
	}
	getGlobalSettings() {
		return structuredClone(this.scopes.global.settings);
	}
	getProjectSettings() {
		return structuredClone(this.scopes.project.settings);
	}
	recomputeSettings() {
		this.settings = deepMergeSettings(deepMergeSettings(this.scopes.global.settings, this.scopes.project.settings), this.runtimeOverrides);
	}
	async reload() {
		await this.writeQueue;
		for (const scope of SETTINGS_SCOPES) {
			const state = this.scopes[scope];
			const loaded = SettingsManager.loadScope(this.storage, scope);
			if (loaded.loadError) {
				state.loadError = loaded.loadError;
				this.recordError(scope, loaded.loadError);
			} else {
				state.settings = loaded.settings;
				state.loadError = null;
			}
			state.modified.clear();
		}
		this.recomputeSettings();
	}
	/** Apply non-persisted overrides on top of global/project settings. */
	applyOverrides(overrides) {
		this.runtimeOverrides = deepMergeSettings(this.runtimeOverrides, overrides);
		this.recomputeSettings();
	}
	recordError(scope, error) {
		const normalizedError = error instanceof Error ? error : new Error(String(error));
		this.errors.push({
			scope,
			error: normalizedError
		});
	}
	persistScopedSettings(scope, snapshotSettings, modified) {
		this.storage.withLock(scope, (current) => {
			const currentFileSettings = current ? requireSupportedSettings(JSON.parse(current), scope) : {};
			const mergedSettings = { ...currentFileSettings };
			for (const [field, nestedModified] of modified) {
				const value = snapshotSettings[field];
				if (nestedModified && typeof value === "object" && value !== null) {
					const baseNested = currentFileSettings[field] ?? {};
					const inMemoryNested = value;
					const mergedNested = { ...baseNested };
					for (const nestedKey of nestedModified) mergedNested[nestedKey] = inMemoryNested[nestedKey];
					mergedSettings[field] = mergedNested;
				} else mergedSettings[field] = value;
			}
			return JSON.stringify(mergedSettings, null, 2);
		});
	}
	save(scope) {
		this.recomputeSettings();
		const state = this.scopes[scope];
		if (state.loadError) return;
		const snapshotSettings = structuredClone(state.settings);
		const modified = new Map([...state.modified].map(([field, nested]) => [field, nested && new Set(nested)]));
		this.writeQueue = this.writeQueue.then(() => {
			this.persistScopedSettings(scope, snapshotSettings, modified);
			state.modified.clear();
		}).catch((error) => {
			this.recordError(scope, error);
		});
	}
	setScopedSettings(scope, values, nestedField) {
		const state = this.scopes[scope];
		Object.assign(state.settings, scope === "project" ? structuredClone(values) : values);
		for (const field of Object.keys(values)) {
			const existing = state.modified.get(field);
			if (!nestedField || existing === null) state.modified.set(field, null);
			else {
				const nestedFields = existing ?? /* @__PURE__ */ new Set();
				nestedFields.add(nestedField);
				state.modified.set(field, nestedFields);
			}
		}
		this.save(scope);
	}
	setGlobalNestedSetting(field, nestedField, value) {
		const current = this.scopes.global.settings[field];
		const nested = isRecord(current) ? { ...current } : {};
		nested[nestedField] = value;
		this.setScopedSettings("global", { [field]: nested }, nestedField);
	}
	async flush() {
		await this.writeQueue;
	}
	drainErrors() {
		const drained = this.errors;
		this.errors = [];
		return drained;
	}
	getLastChangelogVersion() {
		return this.settings.lastChangelogVersion;
	}
	setLastChangelogVersion(version) {
		this.setScopedSettings("global", { lastChangelogVersion: version });
	}
	getSessionDir() {
		const sessionDir = this.settings.sessionDir;
		if (!sessionDir) return sessionDir;
		return sessionDir === "~" ? homedir() : sessionDir.startsWith("~/") ? join(homedir(), sessionDir.slice(2)) : sessionDir;
	}
	getDefaultProvider() {
		return this.settings.defaultProvider;
	}
	getDefaultModel() {
		return this.settings.defaultModel;
	}
	setDefaultProvider(provider) {
		this.setScopedSettings("global", { defaultProvider: provider });
	}
	setDefaultModel(modelId) {
		this.setScopedSettings("global", { defaultModel: modelId });
	}
	setDefaultModelAndProvider(provider, modelId) {
		this.setScopedSettings("global", {
			defaultProvider: provider,
			defaultModel: modelId
		});
	}
	getSteeringMode() {
		return this.settings.steeringMode || "one-at-a-time";
	}
	setSteeringMode(mode) {
		this.setScopedSettings("global", { steeringMode: mode });
	}
	getFollowUpMode() {
		return this.settings.followUpMode || "one-at-a-time";
	}
	setFollowUpMode(mode) {
		this.setScopedSettings("global", { followUpMode: mode });
	}
	getTheme() {
		return this.settings.theme;
	}
	setTheme(theme) {
		this.setScopedSettings("global", { theme });
	}
	getDefaultThinkingLevel() {
		return this.settings.defaultThinkingLevel;
	}
	setDefaultThinkingLevel(level) {
		this.setScopedSettings("global", { defaultThinkingLevel: level });
	}
	getTransport() {
		return this.settings.transport ?? "auto";
	}
	setTransport(transport) {
		this.setScopedSettings("global", { transport });
	}
	getCompactionEnabled() {
		return this.settings.compaction?.enabled ?? true;
	}
	setCompactionEnabled(enabled) {
		this.setGlobalNestedSetting("compaction", "enabled", enabled);
	}
	getCompactionReserveTokens() {
		return this.settings.compaction?.reserveTokens ?? 16384;
	}
	getCompactionKeepRecentTokens() {
		return this.settings.compaction?.keepRecentTokens ?? 2e4;
	}
	getCompactionSettings() {
		return {
			enabled: this.getCompactionEnabled(),
			reserveTokens: this.getCompactionReserveTokens(),
			keepRecentTokens: this.getCompactionKeepRecentTokens()
		};
	}
	getBranchSummarySettings() {
		return {
			reserveTokens: this.settings.branchSummary?.reserveTokens ?? 16384,
			skipPrompt: this.settings.branchSummary?.skipPrompt ?? false
		};
	}
	getBranchSummarySkipPrompt() {
		return this.settings.branchSummary?.skipPrompt ?? false;
	}
	getRetryEnabled() {
		return this.settings.retry?.enabled ?? true;
	}
	setRetryEnabled(enabled) {
		this.setGlobalNestedSetting("retry", "enabled", enabled);
	}
	getRetrySettings() {
		return {
			enabled: this.getRetryEnabled(),
			maxRetries: this.settings.retry?.maxRetries ?? 3,
			baseDelayMs: this.settings.retry?.baseDelayMs ?? 2e3
		};
	}
	getHttpIdleTimeoutMs() {
		const value = this.settings.httpIdleTimeoutMs;
		const timeoutMs = parseHttpIdleTimeoutMs(value);
		if (timeoutMs !== void 0) return timeoutMs;
		if (value !== void 0) throw new Error(`Invalid httpIdleTimeoutMs setting: ${String(value)}`);
		return DEFAULT_HTTP_IDLE_TIMEOUT_MS;
	}
	setHttpIdleTimeoutMs(timeoutMs) {
		if (!Number.isFinite(timeoutMs) || timeoutMs < 0) throw new Error(`Invalid httpIdleTimeoutMs setting: ${String(timeoutMs)}`);
		this.setScopedSettings("global", { httpIdleTimeoutMs: Math.floor(timeoutMs) });
	}
	getProviderRetrySettings() {
		return {
			timeoutMs: this.settings.retry?.provider?.timeoutMs,
			maxRetries: this.settings.retry?.provider?.maxRetries,
			maxRetryDelayMs: this.settings.retry?.provider?.maxRetryDelayMs ?? 6e4
		};
	}
	getHideThinkingBlock() {
		return this.settings.hideThinkingBlock ?? false;
	}
	setHideThinkingBlock(hide) {
		this.setScopedSettings("global", { hideThinkingBlock: hide });
	}
	getShellPath() {
		return this.settings.shellPath;
	}
	setShellPath(path) {
		this.setScopedSettings("global", { shellPath: path });
	}
	getQuietStartup() {
		return this.settings.quietStartup ?? false;
	}
	setQuietStartup(quiet) {
		this.setScopedSettings("global", { quietStartup: quiet });
	}
	getShellCommandPrefix() {
		return this.settings.shellCommandPrefix;
	}
	setShellCommandPrefix(prefix) {
		this.setScopedSettings("global", { shellCommandPrefix: prefix });
	}
	getNpmCommand() {
		return this.settings.npmCommand ? [...this.settings.npmCommand] : void 0;
	}
	setNpmCommand(command) {
		this.setScopedSettings("global", { npmCommand: command ? [...command] : void 0 });
	}
	getCollapseChangelog() {
		return this.settings.collapseChangelog ?? false;
	}
	setCollapseChangelog(collapse) {
		this.setScopedSettings("global", { collapseChangelog: collapse });
	}
	getEnableInstallTelemetry() {
		return this.settings.enableInstallTelemetry ?? true;
	}
	setEnableInstallTelemetry(enabled) {
		this.setScopedSettings("global", { enableInstallTelemetry: enabled });
	}
	getPackages() {
		return [...this.settings.packages ?? []];
	}
	setPackages(packages) {
		this.setScopedSettings("global", { packages });
	}
	setProjectPackages(packages) {
		this.setScopedSettings("project", { packages });
	}
	getExtensionPaths() {
		return [...this.settings.extensions ?? []];
	}
	setExtensionPaths(paths) {
		this.setScopedSettings("global", { extensions: paths });
	}
	setProjectExtensionPaths(paths) {
		this.setScopedSettings("project", { extensions: paths });
	}
	getSkillPaths() {
		return [...this.settings.skills ?? []];
	}
	setSkillPaths(paths) {
		this.setScopedSettings("global", { skills: paths });
	}
	setProjectSkillPaths(paths) {
		this.setScopedSettings("project", { skills: paths });
	}
	getPromptTemplatePaths() {
		return [...this.settings.prompts ?? []];
	}
	setPromptTemplatePaths(paths) {
		this.setScopedSettings("global", { prompts: paths });
	}
	setProjectPromptTemplatePaths(paths) {
		this.setScopedSettings("project", { prompts: paths });
	}
	getThemePaths() {
		return [...this.settings.themes ?? []];
	}
	setThemePaths(paths) {
		this.setScopedSettings("global", { themes: paths });
	}
	setProjectThemePaths(paths) {
		this.setScopedSettings("project", { themes: paths });
	}
	getEnableSkillCommands() {
		return this.settings.enableSkillCommands ?? true;
	}
	setEnableSkillCommands(enabled) {
		this.setScopedSettings("global", { enableSkillCommands: enabled });
	}
	getThinkingBudgets() {
		return this.settings.thinkingBudgets;
	}
	getShowImages() {
		return this.settings.terminal?.showImages ?? true;
	}
	setShowImages(show) {
		this.setGlobalNestedSetting("terminal", "showImages", show);
	}
	getImageWidthCells() {
		return resolveIntegerOption(this.settings.terminal?.imageWidthCells, 60, { min: 1 });
	}
	setImageWidthCells(width) {
		this.setGlobalNestedSetting("terminal", "imageWidthCells", Math.max(1, Math.floor(width)));
	}
	getClearOnShrink() {
		return this.settings.terminal?.clearOnShrink ?? false;
	}
	setClearOnShrink(enabled) {
		this.setGlobalNestedSetting("terminal", "clearOnShrink", enabled);
	}
	getShowTerminalProgress() {
		return this.settings.terminal?.showTerminalProgress ?? false;
	}
	setShowTerminalProgress(enabled) {
		this.setGlobalNestedSetting("terminal", "showTerminalProgress", enabled);
	}
	getImageAutoResize() {
		return this.settings.images?.autoResize ?? true;
	}
	setImageAutoResize(enabled) {
		this.setGlobalNestedSetting("images", "autoResize", enabled);
	}
	getBlockImages() {
		return this.settings.images?.blockImages ?? false;
	}
	setBlockImages(blocked) {
		this.setGlobalNestedSetting("images", "blockImages", blocked);
	}
	getEnabledModels() {
		return this.settings.enabledModels;
	}
	setEnabledModels(patterns) {
		this.setScopedSettings("global", { enabledModels: patterns });
	}
	getDoubleEscapeAction() {
		return this.settings.doubleEscapeAction ?? "tree";
	}
	setDoubleEscapeAction(action) {
		this.setScopedSettings("global", { doubleEscapeAction: action });
	}
	getTreeFilterMode() {
		const mode = this.settings.treeFilterMode;
		return mode && [
			"default",
			"no-tools",
			"user-only",
			"labeled-only",
			"all"
		].includes(mode) ? mode : "default";
	}
	setTreeFilterMode(mode) {
		this.setScopedSettings("global", { treeFilterMode: mode });
	}
	getShowHardwareCursor() {
		return this.settings.showHardwareCursor ?? false;
	}
	setShowHardwareCursor(enabled) {
		this.setScopedSettings("global", { showHardwareCursor: enabled });
	}
	getEditorPaddingX() {
		return this.settings.editorPaddingX ?? 0;
	}
	setEditorPaddingX(padding) {
		this.setScopedSettings("global", { editorPaddingX: Math.max(0, Math.min(3, Math.floor(padding))) });
	}
	getAutocompleteMaxVisible() {
		return this.settings.autocompleteMaxVisible ?? 5;
	}
	setAutocompleteMaxVisible(maxVisible) {
		this.setScopedSettings("global", { autocompleteMaxVisible: Math.max(3, Math.min(20, Math.floor(maxVisible))) });
	}
	getCodeBlockIndent() {
		return this.settings.markdown?.codeBlockIndent ?? "  ";
	}
	getWarnings() {
		return { ...this.settings.warnings };
	}
	setWarnings(warnings) {
		this.setScopedSettings("global", { warnings: { ...warnings } });
	}
};
//#endregion
export { stripStaleAssistantUsageBeforeLatestCompaction as C, sanitizeCompactionReplayMessages as S, wrapRegisteredTools as _, createEventBus as a, loadExtensionFromFactory as b, agentSessionSetContextReplacementHook as c, agentSessionQueuePromptContext as d, agentSessionSetPromptPreparation as f, retireQueuedUserMessage as g, setSessionToolResultPreparer as h, loadSkills as i, preflightManualSessionCompaction as l, subscribeSteeringMessagePersistenceFailure as m, DefaultResourceLoader as n, AgentSession as o, getSteeringMessageIdentity as p, formatSkillsForPrompt as r, agentSessionAutomaticCompaction as s, SettingsManager as t, createCompactionRuntime as u, ExtensionRunner as v, resolveCompactionInstructions as w, unwrapCoreResult as x, createExtensionRuntime as y };
