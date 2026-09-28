import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord, i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { r as signalProcessTree } from "./kill-tree-BGQdx374.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { A as tryResolveDefaultAgentId, S as tryResolveLegacyCompatibilityAgentId, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as normalizeMainKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, _ as toAgentStoreSessionKey, r as agentSessionKeysMatchByRequestKey } from "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { A as formatRawAssistantErrorForUi, b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as stripAnsi, u as iterateAnsiSegments } from "./ansi-CWsy0bu4.mjs";
import { o as setConsoleSubsystemFilter } from "./console-DwqfhE-H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { a as resolveExecutableFromPathEnv } from "./executable-path-BMRdcL7i.mjs";
import { _ as resolveSessionAgentId, l as resolveAgentIdByWorkspacePath } from "./agent-scope-CTuYDtny.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { f as resolveResponseUsageMode, i as isSessionDefaultDirectiveValue, l as normalizeUsageDisplay, s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { t as hasTerminalControl } from "./safe-text-CBmKtmbt.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { i as resolveTrustedWindowsCmdExe, n as isWindowsBatchCommand, t as buildWindowsCmdExeCommandLine } from "./windows-command-C3zotBKl.mjs";
import { o as classifyGatewayConnectFailure } from "./connect-error-details-HKRZ1hRc.mjs";
import "./gateway-error-details-D85F07e9.mjs";
import { cl as QuestionGetResultSchema, fl as QuestionRecordSchema, ul as QuestionListResultSchema, vl as QuestionResolveResultSchema, yl as QuestionResolvedEventSchema } from "./src-BRUl7oDv.mjs";
import { _t as AgentActivityItemSchema } from "./sessions-KsldKmtI.mjs";
import { i as reloadSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { i as clearRuntimeAuthProfileStoreSnapshots } from "./runtime-snapshots-CBozwlR0.mjs";
import { t as resolveCanonicalMainSessionKey } from "./main-session-key-BE52ybIt.mjs";
import { a as listThinkingLevelOptions, i as listThinkingLevelLabels } from "./thinking-B1p5pEC8.mjs";
import { r as isAuthErrorMessage } from "./message-patterns-D0mFl7L8.mjs";
import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-BEHTU0wM.mjs";
import { n as isApprovalStaleError } from "./approval-errors-BPkaCbRr.mjs";
import { t as classifyFailoverReasonCore } from "./classify-core-BTxG3xnT.mjs";
import { n as shouldForwardModelCommandToServer } from "./commands-registry.data-C5Im7bOZ.mjs";
import { t as normalizeGroupActivation } from "./group-activation-CS1DbKiO.mjs";
import { n as listChatCommands, r as listChatCommandsForConfig } from "./commands-registry-list-dv4qVJuy.mjs";
import { i as resolveTextCommand } from "./commands-registry-normalize-DJeLLZwD.mjs";
import { t as getProcessSupervisor } from "./supervisor-Dye57EtO.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./commands-registry-BUZjd6Tx.mjs";
import { o as resolveToolDisplay, t as formatToolDetail } from "./tool-display-DjrvDE8J.mjs";
import { a as isChatStopCommandText } from "./chat-abort-D7PkkSq8.mjs";
import { r as resolveSessionInfoModelSelection } from "./model-selection-display-Q0UQ9JGt.mjs";
import { s as registerUncaughtExceptionHandler } from "./unhandled-rejections-DhJgSeK4.mjs";
import { n as formatTimeAgo } from "./format-relative-BOUle7M5.mjs";
import { n as resolveCurrentOpenClawCliInvocation } from "./openclaw-cli-invocation-IIQ-EDjW.mjs";
import { t as normalizeTerminalChatSendAckStatus } from "./chat-send-ack-status-DwkWEMgk.mjs";
import { n as loadRecentSessions, t as buildSessionChoices } from "./tui-session-picker-BZRj-9P-.mjs";
import { a as resolveRememberedTuiSessionKey, i as readTuiLastSessionKey, o as writeTuiLastSessionKey, r as createRememberSessionKeyWriter, t as buildTuiLastSessionScopeKey } from "./tui-last-session-DTl9PiQ2.mjs";
import { t as resolveLocalRunShutdownGraceMs } from "./local-run-shutdown-1vdLIA4-.mjs";
import { _ as sanitizeRenderableText, a as extractTuiAbortedText, c as formatTuiAbortDiagnostic, d as isCommandMarkedMessage, f as isTerminalSafeAutocompleteValue, g as sanitizeRenderableLine, h as resolveFinalAssistantText, i as extractThinkingFromMessage, l as formatTuiErrorMessage, m as isolateRtlRenderedLine, n as extractContentFromMessage, o as formatContextUsageLine, p as isTuiAssistantAttachmentBlock, r as extractTextFromMessage, s as formatPrimitiveString, t as composeThinkingAndContent, u as formatTuiFooter, v as sanitizeTerminalControlsAndBinary } from "./tui-formatters-CE4lpodF.mjs";
import { spawn } from "node:child_process";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { randomUUID } from "node:crypto";
import chalk from "chalk";
import { Type } from "typebox";
import { Value } from "typebox/value";
import pLimit from "p-limit";
import { Box, CURSOR_MARKER, CombinedAutocompleteProvider, Container, Editor, Image, Input, Key, Loader, Markdown, ProcessTerminal, SelectList, SettingsList, Spacer, Text, TuiMainScreen, decodeKittyPrintable, encodeITerm2, fuzzyFilter, getCapabilities, getImageDimensions, getKeybindings, isKeyRelease, matchesKey, renderImage, truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
//#region packages/gateway-client/src/session-projection-message-identity.ts
function readSessionProjectionString(value) {
	return typeof value === "string" ? value.trim() || null : null;
}
function readPositiveSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : null;
}
/** History and status markers carry transcript order even when they have no chat role. */
function readSessionMessageSequence(message, envelope) {
	return readPositiveSafeInteger(asNullableRecord(asNullableRecord(message)?.["__openclaw"])?.seq) ?? readPositiveSafeInteger(envelope?.messageSeq);
}
/** Run ownership normalizes a user-turn suffix without changing its persisted send key. */
function normalizeSessionProjectionRunId(value) {
	const runId = readSessionProjectionString(value);
	return runId?.endsWith(":user") ? runId.slice(0, -5) || null : runId;
}
/** Persisted row facts win; assistant run ownership comes from its authoritative producer. */
function readSessionMessageIdentity(message, envelope) {
	const record = asNullableRecord(message);
	const role = readSessionProjectionString(record?.role)?.toLowerCase();
	if (!record || !role) return null;
	const metadata = asNullableRecord(record["__openclaw"]);
	const importedFrom = readSessionProjectionString(metadata?.importedFrom);
	const cliSessionId = readSessionProjectionString(metadata?.cliSessionId);
	const externalId = readSessionProjectionString(metadata?.externalId);
	const position = asNullableRecord(metadata?.transcriptPosition);
	const positionSource = readSessionProjectionString(position?.source);
	const isImported = !(positionSource !== null && positionSource.length <= 128 && typeof position?.rawSeq === "number" && Number.isSafeInteger(position.rawSeq) && position.rawSeq >= 0) && Boolean(importedFrom || cliSessionId || externalId);
	const idempotencyKey = readSessionProjectionString(metadata?.idempotencyKey) ?? readSessionProjectionString(record.idempotencyKey) ?? readSessionProjectionString(envelope?.idempotencyKey) ?? readSessionProjectionString(envelope?.clientRunId);
	const persistedRunId = normalizeSessionProjectionRunId(idempotencyKey);
	const envelopeRunId = normalizeSessionProjectionRunId(envelope?.runId);
	const metadataRunId = normalizeSessionProjectionRunId(metadata?.runId);
	const fallbackRunId = normalizeSessionProjectionRunId(asNullableRecord(record.openclawStreamFallback)?.runId);
	const mirroredMessage = readSessionProjectionString(metadata?.mirrorOrigin) !== null;
	const isCliAssistant = role === "assistant" && readSessionProjectionString(record.api)?.toLowerCase() === "cli";
	const canonicalPersistedRunId = isCliAssistant && persistedRunId?.startsWith("cli-assistant:") ? readSessionProjectionString(persistedRunId.slice(14)) : persistedRunId;
	const runId = role === "assistant" ? metadataRunId ?? envelopeRunId ?? fallbackRunId ?? (isCliAssistant || !mirroredMessage ? canonicalPersistedRunId : null) : metadataRunId ?? canonicalPersistedRunId ?? envelopeRunId;
	return {
		role,
		id: readSessionProjectionString(metadata?.id) ?? readSessionProjectionString(envelope?.messageId),
		sequence: readSessionMessageSequence(message, envelope),
		idempotencyKey,
		sendId: role === "user" ? persistedRunId ?? runId : null,
		runId,
		isImported,
		externalSource: isImported && importedFrom && cliSessionId && externalId ? JSON.stringify([
			importedFrom,
			cliSessionId,
			externalId
		]) : null
	};
}
/** A commentary item's display identity is separate from the transcript row that later owns it. */
function readAssistantStreamSegmentIdentity(message) {
	const record = asNullableRecord(message);
	if (readSessionProjectionString(record?.role)?.toLowerCase() !== "assistant") return;
	const fallback = asNullableRecord(record?.openclawStreamFallback);
	const itemId = readSessionProjectionString(fallback?.itemId);
	if (!itemId) return;
	const runId = readSessionMessageIdentity(message)?.runId ?? readSessionProjectionString(record?.runId) ?? readSessionProjectionString(fallback?.runId);
	return {
		itemId,
		...runId ? { runId } : {}
	};
}
/** A saved occurrence can enrich its live projection, never another durable row. */
function sameAssistantPersistenceReceipt(left, right) {
	return Boolean(left?.role === "assistant" && right?.role === "assistant" && !left.isImported && !right.isImported && left.idempotencyKey && left.idempotencyKey === right.idempotencyKey && (!left.id && left.sequence === null || !right.id && right.sequence === null));
}
/** Local turns have no durable transcript metadata beyond their own optional send key. */
function isLocallyOptimisticSessionMessage(message) {
	const record = asNullableRecord(message);
	const role = readSessionProjectionString(record?.role)?.toLowerCase();
	if (role !== "user" && role !== "assistant") return false;
	if (asNullableRecord(record?.openclawStreamFallback)) return false;
	const metadata = asNullableRecord(record?.["__openclaw"]);
	return !metadata || Object.keys(metadata).every((key) => key === "idempotencyKey");
}
function sameTranscriptIdentity(left, right) {
	if (!left || !right || left.role !== right.role) return false;
	if (left.isImported || right.isImported) {
		if (!left.isImported || !right.isImported) return false;
		if (left.externalSource || right.externalSource) return Boolean(left.externalSource && left.externalSource === right.externalSource);
		return left.sequence !== null && right.sequence !== null && left.sequence === right.sequence;
	}
	if (left.id || right.id) return Boolean(left.id && right.id && left.id === right.id);
	return left.sequence !== null && right.sequence !== null && left.sequence === right.sequence;
}
/** Normalize a message into its live, durable, or pending projection entry. */
function createSessionProjectionEntry(message, options) {
	const identity = readSessionMessageIdentity(message, options?.envelope);
	const fallback = asNullableRecord(asNullableRecord(message)?.openclawStreamFallback);
	const provisionalFallback = Boolean(fallback && identity?.role === "assistant" && !identity.id && identity.sequence === null);
	const inferredPendingRunId = options?.live !== true && isLocallyOptimisticSessionMessage(message) ? identity?.runId : null;
	const pendingRunId = normalizeSessionProjectionRunId(options?.pendingRunId ?? inferredPendingRunId);
	return {
		message,
		identity,
		afterSequence: options?.envelope?.afterSequence !== void 0 ? options.envelope.afterSequence : provisionalFallback && typeof fallback?.afterSequence === "number" ? fallback.afterSequence : void 0,
		live: options?.live === true || provisionalFallback,
		pending: pendingRunId !== null,
		pendingRunId
	};
}
//#endregion
//#region packages/gateway-client/src/session-projection-message-content.ts
function readSessionMessageDisplayContent(message) {
	const record = asNullableRecord(message);
	const content = typeof message === "string" ? message : record?.content;
	const media = asNullableRecord(record?.["__openclaw"])?.media;
	let hasNonText = Array.isArray(media) && media.length > 0;
	const texts = [];
	for (const block of Array.isArray(content) ? content : [content]) {
		const entry = asNullableRecord(block);
		if (entry && entry.type !== "text" && entry.type !== "input_text" && entry.type !== "output_text") {
			hasNonText ||= entry.type !== "thinking" && entry.type !== "reasoning" && entry.type !== "redacted_thinking";
			continue;
		}
		const text = readSessionProjectionString(entry ? entry.text : block);
		if (text) texts.push(text);
	}
	const fallback = texts.length === 0 ? readSessionProjectionString(record?.text) : null;
	return {
		text: fallback ?? texts.join("\n"),
		hasNonText,
		usesFallbackText: fallback !== null
	};
}
/** Status notices remain visible but do not define the terminal reply they accompany. */
function projectSessionTerminalReplyMessage(message) {
	const record = asNullableRecord(message);
	if (!record || !Array.isArray(record.content)) return message;
	const content = record.content.filter((block) => asNullableRecord(block)?.openclawStatusNotice !== true);
	if (content.length === record.content.length || content.length === 0) return message;
	return {
		...record,
		content,
		text: void 0
	};
}
/** Check whether a projected message has text or another displayable block. */
function hasDisplayableSessionMessage(message) {
	const { text, hasNonText } = readSessionMessageDisplayContent(message);
	return Boolean(text) || hasNonText;
}
function normalizeChatErrorComparisonText(text) {
	return text.trim().replace(/^⚠️\s*/u, "").replace(/^Error:\s*/iu, "").replace(/\s+/gu, " ").trim();
}
/** Diagnostic-only error projections can be retired when their run resumes. */
function isSessionProjectionErrorMessage(message, errorMessage) {
	const role = asNullableRecord(message)?.role;
	if (typeof role === "string" && role.trim().toLowerCase() !== "assistant") return false;
	const { text, hasNonText } = readSessionMessageDisplayContent(message);
	const normalizedText = normalizeChatErrorComparisonText(text);
	return !hasNonText && (!normalizedText || normalizedText === "[assistant turn failed before producing content]" || normalizedText === "The agent run failed before producing a reply." || normalizedText === normalizeChatErrorComparisonText(errorMessage ?? ""));
}
//#endregion
//#region packages/gateway-client/src/session-projection-final-identity.ts
/** Terminal identity rules used to reconcile live and durable assistant projections. */
/**
* The class of rows the #148297 relaxation newly admits as finals: persisted
* with the run's terminal tool stop reason while carrying no tool-call
* content. Both adoption directions and every position rule scope to this
* predicate, so pre-existing match semantics stay untouched.
*/
function isToolUsePersistedFinalRow(message) {
	return asNullableRecord(message)?.["stopReason"] === "toolUse" && !isSessionProjectionToolContinuation(message);
}
/** Tool-bearing assistant rows are continuations even without a tool stop reason. */
function isSessionProjectionToolContinuation(message) {
	const record = asNullableRecord(message);
	if (Array.isArray(record?.content) && record.content.some((block) => {
		const type = asNullableRecord(block)?.type;
		return type === "toolCall" || type === "toolUse" || type === "functionCall";
	})) return true;
	return record?.stopReason === "toolUse" && !hasDisplayableSessionMessage(message);
}
function readPersistedFinalIdentity(message) {
	const identity = readSessionMessageIdentity(message);
	if (identity?.externalSource) return `import:${identity.role}:${identity.externalSource}`;
	if (identity?.id && !identity.isImported) return `id:${identity.role}:${identity.id}`;
	if (identity?.sequence !== null && identity?.sequence !== void 0) return `seq:${identity.role}:${identity.sequence}`;
	if (identity?.role === "assistant" && !identity.isImported && identity.idempotencyKey) return `key:assistant:${identity.idempotencyKey}`;
	return null;
}
function hasCompatiblePersistedFinalIdentity(currentMessage, incomingMessage) {
	const current = readSessionMessageIdentity(currentMessage);
	const incoming = readSessionMessageIdentity(incomingMessage);
	if (!current || !incoming || current.role !== incoming.role) return false;
	if (current.isImported || incoming.isImported) {
		if (!current.isImported || !incoming.isImported) return false;
		if (current.externalSource && incoming.externalSource) return current.externalSource === incoming.externalSource;
		return current.sequence !== null && incoming.sequence !== null && current.sequence === incoming.sequence;
	}
	if (sameAssistantPersistenceReceipt(current, incoming)) return true;
	if (current.id && incoming.id) return current.id === incoming.id;
	return current.sequence !== null && incoming.sequence !== null && current.sequence === incoming.sequence;
}
function readFinalContentIdentity(message) {
	const terminalMessage = projectSessionTerminalReplyMessage(message);
	const display = readSessionMessageDisplayContent(terminalMessage);
	if (!display.text && !display.hasNonText) return null;
	const identity = readSessionMessageIdentity(message);
	const record = asNullableRecord(terminalMessage);
	const metadata = asNullableRecord(record?.["__openclaw"]);
	try {
		return `content:${stableStringify([
			identity?.role ?? "assistant",
			display.text,
			display.hasNonText ? record?.content ?? null : null,
			metadata?.media ?? null,
			identity?.isImported ? [
				metadata?.importedFrom ?? null,
				metadata?.cliSessionId ?? null,
				metadata?.externalId ?? null
			] : null
		])}`;
	} catch {
		return null;
	}
}
function hasTerminalStopReason(message) {
	const stopReason = asNullableRecord(message)?.stopReason;
	return stopReason === "stop" || stopReason === "length" || stopReason === "error" || stopReason === "aborted" || stopReason === "end_turn";
}
/** Read stable persisted identity first, falling back to canonical display content. */
function readSessionProjectionFinalMessageIdentity(message) {
	if (!hasDisplayableSessionMessage(message)) return null;
	return readPersistedFinalIdentity(message) ?? readFinalContentIdentity(message);
}
/** Check whether a displayable terminal may recover a prior empty terminal. */
function canRecoverSessionProjectionFinal(currentMessage, incomingMessage) {
	if (hasDisplayableSessionMessage(currentMessage)) return false;
	return readPersistedFinalIdentity(currentMessage) === null || hasCompatiblePersistedFinalIdentity(currentMessage, incomingMessage);
}
/** Check whether a run has already accepted the same terminal reply. */
function hasSessionProjectionAcceptedFinal(run, message) {
	const identity = readSessionProjectionFinalMessageIdentity(message);
	return Boolean(identity && run && (run.acceptedFinalMessageIdentities?.includes(identity) || readSessionProjectionFinalMessageIdentity(run.message) === identity));
}
/** Match an unsequenced live terminal to exactly one durable same-run terminal row. */
function findUniqueSnapshotTerminalMatch(current, matches, run, snapshot) {
	if (!current.live || current.identity?.role !== "assistant" || current.identity.id || current.identity.sequence !== null || !run || run.status === "streaming" || matches.length === 0) return null;
	const terminalContent = readFinalContentIdentity(current.message);
	if (!terminalContent || readFinalContentIdentity(run.message) !== terminalContent) return null;
	let snapshotIndexes;
	let firstUserIndex = -1;
	let lastAssistantIndex = -1;
	const ensureRunIndexes = () => {
		if (snapshotIndexes) return;
		const runId = current.identity?.runId;
		const indexes = /* @__PURE__ */ new Map();
		if (runId) snapshot.forEach((candidate, index) => {
			if (candidate.identity?.runId === runId) {
				if (!indexes.has(candidate)) indexes.set(candidate, index);
				if (candidate.identity.role === "user" && firstUserIndex < 0) firstUserIndex = index;
				else if (candidate.identity.role === "assistant") lastAssistantIndex = index;
			}
		});
		snapshotIndexes = indexes;
	};
	const hasCompletedRunSnapshotContext = (entry) => {
		const runId = current.identity?.runId;
		if (!runId || entry.identity?.runId !== runId) return false;
		ensureRunIndexes();
		const entryIndex = snapshotIndexes?.get(entry);
		return entryIndex !== void 0 && firstUserIndex >= 0 && firstUserIndex < entryIndex && lastAssistantIndex <= entryIndex;
	};
	const isLastSameRunAssistantRow = (entry) => {
		const runId = current.identity?.runId;
		if (!runId || entry.identity?.runId !== runId) return false;
		ensureRunIndexes();
		const entryIndex = snapshotIndexes?.get(entry);
		return entryIndex !== void 0 && lastAssistantIndex >= 0 && entryIndex >= lastAssistantIndex;
	};
	const durableTerminalMatches = matches.filter((entry) => {
		return (asNullableRecord(asNullableRecord(entry.message)?.["__openclaw"])?.runTerminal === true || entry.identity?.runId === current.identity?.runId && (hasTerminalStopReason(entry.message) || asNullableRecord(entry.message)?.["stopReason"] === "toolUse" && !isSessionProjectionToolContinuation(entry.message) && isLastSameRunAssistantRow(entry)) || hasCompletedRunSnapshotContext(entry)) && readFinalContentIdentity(entry.message) === terminalContent;
	});
	const entry = durableTerminalMatches.length === 1 ? durableTerminalMatches[0] : void 0;
	if (!entry) return null;
	return {
		entry,
		inferred: asNullableRecord(asNullableRecord(entry.message)?.["__openclaw"])?.runTerminal !== true && !hasTerminalStopReason(entry.message)
	};
}
/** Check whether ordinary single-match promotion needs terminal-content verification. */
function isUnsequencedLiveTerminal(current, run) {
	return Boolean(current.live && current.identity?.role === "assistant" && !current.identity.id && current.identity.sequence === null && run && run.status !== "streaming" && readFinalContentIdentity(current.message) === readFinalContentIdentity(run.message));
}
//#endregion
//#region packages/gateway-client/src/session-projection-run-retention.ts
/** Bounded retention for completed and active session projection runs. */
const MAX_TRACKED_SESSION_RUNS = 200;
const RETAINED_SESSION_RUNS = 150;
/** Retain every active run and the newest completed runs within the projection bound. */
function retainSessionProjectionRuns(runs) {
	const entries = Object.entries(runs);
	if (entries.length <= MAX_TRACKED_SESSION_RUNS) return runs;
	const active = entries.filter(([, run]) => run.status === "streaming");
	const terminal = entries.filter(([, run]) => run.status !== "streaming");
	const terminalLimit = Math.max(0, RETAINED_SESSION_RUNS - active.length);
	const retainedTerminal = terminalLimit > 0 ? terminal.slice(-terminalLimit) : [];
	return Object.fromEntries([...active, ...retainedTerminal]);
}
//#endregion
//#region packages/gateway-client/src/session-projection-run-event.ts
function readNonemptyString(value) {
	return typeof value === "string" ? value.trim() || null : null;
}
/** Normalizes Gateway run envelopes once for every browser and terminal adapter. */
function reduceSessionProjectionRunEvent(projection, event, scope = {}) {
	const runId = readNonemptyString(event.runId);
	if (!runId || typeof event.state !== "string" || ![
		"delta",
		"final",
		"error",
		"aborted"
	].includes(event.state)) return null;
	const message = event.message;
	const messageStopReason = isRecord(message) ? readNonemptyString(message.stopReason) : null;
	const stopReason = readNonemptyString(event.stopReason) ?? messageStopReason;
	const errorKind = readNonemptyString(event.errorKind);
	const base = {
		runId,
		seq: typeof event.seq === "number" ? event.seq : void 0,
		...message === void 0 ? {} : { message },
		scope
	};
	const next = reduceSessionProjection(projection, event.state === "delta" ? {
		type: "runDelta",
		...base
	} : {
		type: "runTerminal",
		...base,
		status: event.state === "aborted" ? "aborted" : event.state === "error" ? errorKind === "timeout" ? "timeout" : "error" : event.yielded === true && stopReason === "end_turn" ? "yielded" : stopReason === "error" ? "error" : "completed",
		...stopReason === null ? {} : { stopReason },
		...errorKind === null ? {} : { errorKind },
		...typeof event.errorMessage === "string" ? { errorMessage: event.errorMessage } : {}
	});
	return {
		projection: next,
		previousRun: projection.runs[runId],
		currentRun: next.runs[runId]
	};
}
//#endregion
//#region packages/gateway-client/src/session-projection.ts
/** Browser-safe identity and replay rules shared by Gateway conversation clients. */
const SESSION_PROJECTION_SCOPE_KEYS = [
	"sessionKey",
	"sessionId",
	"agentId",
	"lifecycleRevision",
	"activeLeafEntryId"
];
function createProjectionEntries(messages) {
	let pendingUserRunId = null;
	return messages.map((message) => {
		const entry = createSessionProjectionEntry(message);
		if (entry.identity?.role === "user") {
			pendingUserRunId = entry.pending ? entry.pendingRunId : null;
			return entry;
		}
		if (pendingUserRunId && entry.identity?.role === "assistant" && !entry.pending && isLocallyOptimisticSessionMessage(message)) return createSessionProjectionEntry(message, { pendingRunId: pendingUserRunId });
		if (!isLocallyOptimisticSessionMessage(message)) pendingUserRunId = null;
		return entry;
	});
}
function createSessionProjection(scope = {}, messages = []) {
	const entries = createProjectionEntries(messages);
	return {
		scope: { ...scope },
		entries,
		messages: entries.map((entry) => entry.message),
		runs: {},
		hasTransportGap: false
	};
}
function scopesMatch(left, right) {
	return SESSION_PROJECTION_SCOPE_KEYS.every((key) => left[key] === void 0 || right[key] === void 0 || left[key] === right[key]);
}
function readEventScope(event) {
	const scope = { ...event.scope };
	for (const key of SESSION_PROJECTION_SCOPE_KEYS) if (event[key] !== void 0) Object.assign(scope, { [key]: event[key] });
	return scope;
}
function entryMatches(left, right, allowSnapshotPromotion = false) {
	const leftSegment = readAssistantStreamSegmentIdentity(left.message);
	const rightSegment = readAssistantStreamSegmentIdentity(right.message);
	if (leftSegment?.itemId !== rightSegment?.itemId) return false;
	if (sameTranscriptIdentity(left.identity, right.identity)) return true;
	if (sameAssistantPersistenceReceipt(left.identity, right.identity)) return true;
	if (left.identity?.role === "assistant" && right.identity?.role === "assistant" && left.identity.idempotencyKey && right.identity.idempotencyKey && left.identity.idempotencyKey !== right.identity.idempotencyKey) return false;
	const durableEntry = left.identity?.id ? left : right.identity?.id ? right : null;
	const provisionalEntry = durableEntry === left ? right : durableEntry === right ? left : null;
	const durableMetadata = asNullableRecord(asNullableRecord(durableEntry?.message)?.["__openclaw"]);
	if (durableEntry?.identity?.role === "assistant" && provisionalEntry?.identity?.role === "assistant" && !durableEntry.identity.isImported && !provisionalEntry.identity.isImported && !provisionalEntry.identity.id) {
		const durableSegment = durableEntry === left ? leftSegment : rightSegment;
		const provisionalSegment = durableEntry === left ? rightSegment : leftSegment;
		if (provisionalEntry.identity.sequence === null && durableSegment?.runId && durableSegment.runId === provisionalSegment?.runId && durableSegment.itemId === provisionalSegment.itemId) return true;
		if (provisionalEntry.live && !durableSegment && !isSessionProjectionToolContinuation(durableEntry.message) && (!isToolUsePersistedFinalRow(durableEntry.message) || readFinalContentIdentity(durableEntry.message) === readFinalContentIdentity(provisionalEntry.message)) && provisionalEntry.identity.sequence === null && (provisionalEntry.afterSequence === void 0 || provisionalEntry.afterSequence !== null && durableEntry.identity.sequence !== null && durableEntry.identity.sequence > provisionalEntry.afterSequence) && durableEntry.identity.runId && durableEntry.identity.runId === provisionalEntry.identity.runId && (readSessionProjectionString(durableMetadata?.mirrorOrigin) === null || durableMetadata?.runTerminal === true)) return true;
	}
	const persisted = left.identity;
	const observed = right.identity;
	if (allowSnapshotPromotion && right.live && persisted && observed && persisted.role === observed.role && !persisted.isImported && !observed.isImported && persisted.id && !observed.id && persisted.sequence !== null && persisted.sequence === observed.sequence) return true;
	if (left.pending && right.pending) return Boolean(left.identity?.role === right.identity?.role && left.pendingRunId && left.pendingRunId === right.pendingRunId);
	const pending = left.pending ? left : right.pending ? right : null;
	const authoritative = pending === left ? right : pending === right ? left : null;
	return Boolean(pending && authoritative && pending.identity && authoritative.identity && pending.identity.role === authoritative.identity.role && !pending.identity.isImported && !authoritative.identity.isImported && pending.pendingRunId && pending.pendingRunId === (authoritative.identity.sendId ?? authoritative.identity.runId) && (pending.identity.sequence === null || authoritative.identity.sequence === null || pending.identity.sequence === authoritative.identity.sequence));
}
function withEntries(state, entries) {
	return {
		...state,
		entries,
		messages: entries.map((entry) => entry.message)
	};
}
function insertEntry(entries, incoming, runs) {
	const sequence = incoming.identity?.sequence;
	let nextIndex = sequence === void 0 || sequence === null ? -1 : entries.findIndex((entry) => {
		const candidate = entry.identity?.sequence;
		return candidate !== void 0 && candidate !== null && candidate > sequence;
	});
	if (sequence !== void 0 && sequence !== null && nextIndex < 0) nextIndex = entries.length;
	if (incoming.identity?.role === "user" && incoming.identity.runId) {
		const runId = incoming.identity.runId;
		const terminalMessage = runs?.[runId]?.message;
		const belongsToRun = (entry) => entry.identity?.role === "assistant" && (entry.identity.runId === runId || entry.message === terminalMessage);
		if (sequence !== void 0 && sequence !== null) {
			const before = [];
			const replies = [];
			for (const entry of entries.slice(0, nextIndex)) (entry.identity?.sequence === null && belongsToRun(entry) ? replies : before).push(entry);
			return [
				...before,
				incoming,
				...replies,
				...entries.slice(nextIndex)
			];
		}
		const terminalIndex = entries.findIndex(belongsToRun);
		if (terminalIndex >= 0 && (nextIndex < 0 || terminalIndex < nextIndex)) nextIndex = terminalIndex;
	}
	return nextIndex < 0 ? [...entries, incoming] : [
		...entries.slice(0, nextIndex),
		incoming,
		...entries.slice(nextIndex)
	];
}
function projectLiveSessionMessage(initialState, message, envelope, scope = {}) {
	let state = initialState;
	if (!scopesMatch(state.scope, scope)) return state;
	const incoming = createSessionProjectionEntry(message, {
		envelope,
		live: true
	});
	if (!incoming.identity) return state;
	const matches = state.entries.filter((entry) => entryMatches(entry, incoming));
	const existing = matches.find((entry) => sameTranscriptIdentity(entry.identity, incoming.identity)) ?? (matches.length === 1 ? matches[0] : void 0);
	if (existing && !sameTranscriptIdentity(existing.identity, incoming.identity) && !sameAssistantPersistenceReceipt(existing.identity, incoming.identity)) {
		const durable = existing.identity?.id ? existing : incoming.identity.id ? incoming : null;
		const provisional = durable === existing ? incoming : existing;
		if (durable && isToolUsePersistedFinalRow(durable.message)) {
			const history = state.entries.filter((entry) => entry !== provisional);
			const snapshot = durable === incoming ? insertEntry(history, durable) : history;
			const runId = provisional.identity?.runId;
			const run = runId ? state.runs[runId] : void 0;
			const terminalMatch = findUniqueSnapshotTerminalMatch(provisional, [durable], run, snapshot);
			if (!terminalMatch) return withEntries(state, insertEntry(state.entries, incoming, state.runs));
			if (terminalMatch.inferred && durable.identity && runId && run) {
				const inferredSnapshotTerminal = {
					entry: provisional,
					matchedIdentity: durable.identity
				};
				state = {
					...state,
					runs: {
						...state.runs,
						[runId]: {
							...run,
							inferredSnapshotTerminal
						}
					}
				};
			}
		}
	}
	if (!existing) return withEntries(state, insertEntry(state.entries, incoming, state.runs));
	const existingIndex = state.entries.indexOf(existing);
	if (existing.message === message && existing.live && !existing.pending) return state;
	if (!existing.pending && existing.identity?.id && !incoming.identity.id) return state;
	if (incoming.identity.sequence !== null && (existing.pending || existing.identity?.sequence === null)) {
		const sequence = incoming.identity.sequence;
		const violatesOrder = state.entries.some(({ identity }, index) => identity?.sequence != null && (index < existingIndex ? identity.sequence > sequence : identity.sequence < sequence));
		return withEntries(state, violatesOrder ? insertEntry(state.entries.filter((_, index) => index !== existingIndex), incoming, state.runs) : state.entries.toSpliced(existingIndex, 1, incoming));
	}
	return withEntries(state, state.entries.toSpliced(existingIndex, 1, incoming));
}
/** Only observed live events and this client's pending turns may survive an older snapshot. */
function reconcileSessionProjectionSnapshot(state, messages, scope = {}, options = {}) {
	const visibleMessages = options.shouldIncludeMessage ? messages.filter(options.shouldIncludeMessage) : messages;
	if (!scopesMatch(state.scope, scope)) return createSessionProjection(scope, visibleMessages);
	let entries = createProjectionEntries(visibleMessages);
	const runs = { ...state.runs };
	for (const current of state.entries) {
		if (!current.live && !current.pending || options.shouldIncludeMessage?.(current.message) === false) continue;
		const matches = entries.filter((entry) => entryMatches(entry, current, true));
		const uniqueMatch = matches.length === 1 ? matches[0] : void 0;
		const run = current.identity?.runId ? runs[current.identity.runId] : void 0;
		const terminalMatch = findUniqueSnapshotTerminalMatch(current, matches, run, entries);
		if (uniqueMatch && (sameAssistantPersistenceReceipt(uniqueMatch.identity, current.identity) || !isUnsequencedLiveTerminal(current, run)) || terminalMatch) {
			if (terminalMatch?.inferred && terminalMatch.entry.identity && current.identity?.runId && run) runs[current.identity.runId] = {
				...run,
				inferredSnapshotTerminal: {
					entry: current,
					matchedIdentity: terminalMatch.entry.identity
				}
			};
			continue;
		}
		entries = insertEntry(entries, current, runs);
	}
	for (const [runId, run] of Object.entries(runs)) {
		const inferred = run.inferredSnapshotTerminal;
		if (!inferred) continue;
		const candidateRemains = entries.some((entry) => sameTranscriptIdentity(entry.identity, inferred.matchedIdentity));
		const visible = options.shouldIncludeMessage?.(inferred.entry.message) !== false;
		const matches = entries.filter((entry) => entryMatches(entry, inferred.entry, true));
		const terminalMatch = findUniqueSnapshotTerminalMatch(inferred.entry, matches, run, entries);
		if (candidateRemains && visible && terminalMatch?.inferred) continue;
		if (candidateRemains && visible && !terminalMatch) entries = insertEntry(entries, inferred.entry, runs);
		const { inferredSnapshotTerminal: _inferred, ...settledRun } = run;
		runs[runId] = settledRun;
	}
	return {
		...withEntries(state, entries),
		runs,
		scope: {
			...state.scope,
			...scope
		},
		hasTransportGap: false
	};
}
function updateRun(state, incoming) {
	const incomingErrorMessage = readSessionProjectionString(incoming.errorMessage);
	const incomingSeq = typeof incoming.seq === "number" && Number.isSafeInteger(incoming.seq) && incoming.seq >= 0 ? incoming.seq : void 0;
	const normalizedIncoming = {
		...incoming,
		seq: incomingSeq
	};
	if (incomingErrorMessage) normalizedIncoming.errorMessage = incomingErrorMessage;
	else delete normalizedIncoming.errorMessage;
	const current = state.runs[incoming.runId];
	const resumesErrorProjection = current?.status === "error" && incoming.status === "streaming" && current.seq !== void 0 && incomingSeq !== void 0 && incomingSeq > current.seq && isSessionProjectionErrorMessage(current.message, current.errorMessage);
	if (current && current.status !== "streaming" && !resumesErrorProjection) {
		const incomingFinalIdentity = readSessionProjectionFinalMessageIdentity(incoming.message);
		const incomingIsFinal = incoming.status === "completed" || incoming.status === "yielded";
		const currentHasDisplayableMessage = hasDisplayableSessionMessage(current.message);
		const canAcceptFinal = currentHasDisplayableMessage ? current.status === incoming.status || (current.acceptedFinalMessageIdentities?.length ?? 0) > 0 : canRecoverSessionProjectionFinal(current.message, incoming.message);
		const acceptFinal = incomingIsFinal && canAcceptFinal && incomingFinalIdentity !== null && !hasSessionProjectionAcceptedFinal(current, incoming.message);
		const recoverMessage = acceptFinal && !currentHasDisplayableMessage;
		const recoverError = readSessionProjectionString(current.errorMessage) === null && incomingErrorMessage !== null;
		const updateTerminalSequence = incoming.status !== "streaming" && (incomingSeq === void 0 ? current.seq !== void 0 : current.seq === void 0 || incomingSeq > current.seq);
		if (!acceptFinal && !recoverError && !updateTerminalSequence) return state;
		const firstFinalIdentity = readSessionProjectionFinalMessageIdentity(current.message);
		const previousFinalIdentities = current.acceptedFinalMessageIdentities ?? (firstFinalIdentity ? [firstFinalIdentity] : []);
		return {
			...state,
			runs: {
				...state.runs,
				[incoming.runId]: {
					...current,
					...updateTerminalSequence ? { seq: incomingSeq } : {},
					...recoverMessage ? { message: incoming.message } : {},
					...acceptFinal && incomingFinalIdentity ? { acceptedFinalMessageIdentities: [...previousFinalIdentities, incomingFinalIdentity].slice(-32) } : {},
					...recoverError && incomingErrorMessage ? {
						errorMessage: incomingErrorMessage,
						...incoming.errorKind ? { errorKind: incoming.errorKind } : {}
					} : {}
				}
			}
		};
	}
	const resumedState = resumesErrorProjection ? withEntries(state, state.entries.filter((entry) => !((entry.identity?.runId === incoming.runId || entry.message === current.message) && (asNullableRecord(entry.message)?.stopReason === "error" || entry.message === current.message) && isSessionProjectionErrorMessage(entry.message, current.errorMessage)))) : state;
	const previousRuns = current && current.status === "streaming" && incoming.status !== "streaming" ? Object.fromEntries(Object.entries(state.runs).filter(([runId]) => runId !== incoming.runId)) : state.runs;
	const acceptedFinalIdentity = incoming.status === "completed" || incoming.status === "yielded" ? readSessionProjectionFinalMessageIdentity(incoming.message) : null;
	return {
		...resumedState,
		runs: retainSessionProjectionRuns({
			...previousRuns,
			[incoming.runId]: {
				...resumesErrorProjection ? {} : current,
				...normalizedIncoming,
				...acceptedFinalIdentity ? { acceptedFinalMessageIdentities: [acceptedFinalIdentity] } : {},
				...!resumesErrorProjection && incoming.message === void 0 && current?.message !== void 0 ? { message: current.message } : {}
			}
		})
	};
}
/** Reduces durable events, snapshots, and transport lifecycle without client-specific policy. */
function reduceSessionProjection(state, event) {
	const scope = readEventScope(event);
	if (event.type === "snapshotLoaded") return scopesMatch(state.scope, scope) ? reconcileSessionProjectionSnapshot(state, event.messages, scope, event.options) : state;
	if (event.type === "sessionReset") {
		const { sessionKey, sessionId, agentId } = state.scope;
		return scopesMatch({
			sessionKey,
			sessionId,
			agentId
		}, scope) ? createSessionProjection({
			...state.scope,
			...scope
		}) : state;
	}
	if (!scopesMatch(state.scope, scope)) return state;
	switch (event.type) {
		case "messagePersisted": return projectLiveSessionMessage(state, event.message, event.envelope ?? event, scope);
		case "sendPending": {
			const pendingRunId = normalizeSessionProjectionRunId(event.idempotencyKey ?? event.runId);
			const incoming = createSessionProjectionEntry(event.message, { pendingRunId });
			if (!pendingRunId || !incoming.identity) return state;
			const seed = state.entries.find((entry) => entry.message === event.message);
			if (seed && !seed.pending && incoming.identity.id === null && !incoming.identity.isImported && incoming.identity.runId === pendingRunId) return withEntries(state, state.entries.map((entry) => entry === seed ? {
				...seed,
				pending: true,
				pendingRunId
			} : entry));
			return seed || state.entries.some((entry) => entryMatches(entry, incoming)) ? state : withEntries(state, insertEntry(state.entries, incoming, state.runs));
		}
		case "sendAcknowledged": {
			const runId = normalizeSessionProjectionRunId(event.idempotencyKey ?? event.runId);
			const previousRunId = normalizeSessionProjectionRunId(event.previousRunId);
			if (!runId || !previousRunId || previousRunId === runId) return state;
			let changed = false;
			const entries = state.entries.flatMap((entry) => {
				if (!entry.pending || entry.pendingRunId !== previousRunId) return [entry];
				changed = true;
				const rekeyed = {
					...entry,
					pendingRunId: runId
				};
				return state.entries.some((candidate) => !candidate.pending && entryMatches(rekeyed, candidate)) ? [] : [rekeyed];
			});
			return changed ? withEntries(state, entries) : state;
		}
		case "sendFailed": {
			const runId = normalizeSessionProjectionRunId(event.runId);
			const entries = state.entries.filter((entry) => !entry.pending || entry.pendingRunId !== runId);
			return entries.length === state.entries.length ? state : withEntries(state, entries);
		}
		case "runDelta": return updateRun(state, {
			runId: event.runId,
			seq: event.seq,
			status: "streaming",
			...event.message === void 0 ? {} : { message: event.message }
		});
		case "runTerminal": return updateRun(state, {
			runId: event.runId,
			seq: event.seq,
			status: event.status,
			...event.message === void 0 ? {} : { message: event.message },
			...event.stopReason === void 0 ? {} : { stopReason: event.stopReason },
			...event.errorKind === void 0 ? {} : { errorKind: event.errorKind },
			...event.errorMessage === void 0 ? {} : { errorMessage: event.errorMessage }
		});
		case "transportGap": return state.hasTransportGap ? state : {
			...state,
			hasTransportGap: true
		};
		case "reconnected": return state;
		default: return state;
	}
}
//#endregion
//#region src/tui/commands.ts
const VERBOSE_LEVELS = [
	"on",
	"off",
	"full"
];
const TRACE_LEVELS = ["on", "off"];
const FAST_LEVELS = [
	"status",
	"auto",
	"on",
	"off",
	"default"
];
const REASONING_LEVELS = [
	"on",
	"off",
	"stream"
];
const ELEVATED_LEVELS = [
	"on",
	"off",
	"ask",
	"full"
];
const ACTIVATION_LEVELS = ["mention", "always"];
const USAGE_COMMAND_VALUES = [
	"off",
	"tokens",
	"full",
	"cost",
	"reset",
	"inherit",
	"clear",
	"default"
];
function resolveThinkingLevelLabels(options) {
	return options.thinkingLevels?.length ? options.thinkingLevels.map((level) => level.label) : listThinkingLevelLabels(options.provider, options.model, void 0, options.agentRuntime);
}
function createLevelCompletion(levels) {
	return (prefix) => levels.filter((value) => value.startsWith(normalizeLowercaseStringOrEmpty(prefix))).map((value) => ({
		value,
		label: value
	}));
}
/** Keep TUI help and no-argument usage aligned with actual directive completions. */
function formatTuiLevelCommandUsage(command) {
	return `/${command} <${(command === "verbose" ? VERBOSE_LEVELS : REASONING_LEVELS).join("|")}>`;
}
const TUI_COMMAND_DESCRIPTORS = [
	[
		"help",
		"Show slash command help",
		"/help"
	],
	[
		"browser-setup",
		"Set up Chrome on the TUI process host (not the Gateway)",
		"/browser-setup [inspect|install|verify] (TUI process host)",
		[
			"inspect",
			"install",
			"verify"
		]
	],
	[
		"question",
		"Reopen the pending agent question",
		"/question"
	],
	[
		"commands",
		void 0,
		"/commands",
		void 0,
		{
			scope: "remote",
			shared: true,
			handler: false
		}
	],
	[
		"status",
		void 0,
		"/status",
		void 0,
		{
			scope: "remote",
			shared: true,
			handler: false
		}
	],
	[
		"gateway-status",
		"Show gateway status summary",
		["/gateway-status", "/gwstatus"],
		void 0,
		{ aliases: [{
			name: "gwstatus",
			description: "Alias for /gateway-status"
		}] }
	],
	[
		"auth",
		"Run provider auth/login flow",
		"/auth [provider]",
		void 0,
		{ scope: "local" }
	],
	[
		"agent",
		"Switch agent (or open picker)",
		"/agent <id> (or /agents)"
	],
	["agents", "Open agent picker"],
	[
		"openclaw",
		"Return to OpenClaw",
		"/openclaw [request]",
		void 0,
		{ aliases: [{
			name: "crestodian",
			hidden: true
		}] }
	],
	[
		"session",
		"Switch session (or open picker)",
		"/session <key> (or /sessions)"
	],
	["sessions", "Open session picker"],
	[
		"model",
		"Set model (or open picker)",
		"/model <provider/model|default> (or /models)"
	],
	["models", "Open model picker"],
	[
		"think",
		"Set thinking level",
		"/think <{thinkingLevels}|default>",
		"thinking"
	],
	[
		"fast",
		"Set fast mode auto/on/off",
		"/fast <status|auto|on|off|default>",
		FAST_LEVELS
	],
	[
		"verbose",
		`Set verbose ${VERBOSE_LEVELS.join("/")}`,
		formatTuiLevelCommandUsage("verbose"),
		VERBOSE_LEVELS
	],
	[
		"trace",
		"Set trace on/off",
		"/trace <on|off>",
		TRACE_LEVELS
	],
	[
		"reasoning",
		`Set reasoning ${REASONING_LEVELS.join("/")}`,
		formatTuiLevelCommandUsage("reasoning"),
		REASONING_LEVELS
	],
	[
		"usage",
		"Toggle per-response usage line or show cost summary",
		"/usage <off|tokens|full|cost|reset|inherit|clear|default>",
		USAGE_COMMAND_VALUES
	],
	[
		"elevated",
		"Set elevated on/off/ask/full",
		["/elevated <on|off|ask|full>", "/elev <on|off|ask|full>"],
		ELEVATED_LEVELS,
		{ aliases: [{
			name: "elev",
			description: "Alias for /elevated"
		}] }
	],
	[
		"activation",
		"Set group activation",
		"/activation <mention|always>",
		ACTIVATION_LEVELS
	],
	[
		"context",
		void 0,
		void 0,
		void 0,
		{
			scope: "remote",
			shared: true
		}
	],
	[
		"goal",
		void 0,
		"/goal <objective> | /goal [status] | /goal start <objective> | /goal edit <objective> | /goal pause|resume|complete|block|clear",
		void 0,
		{ shared: true }
	],
	[
		"btw",
		void 0,
		"/btw <side question>",
		void 0,
		{ shared: true }
	],
	[
		"queue",
		void 0,
		"/queue [mode]",
		void 0,
		{ shared: true }
	],
	[
		"stop",
		void 0,
		"/stop",
		void 0,
		{ shared: true }
	],
	[
		"new",
		"Spawn a new isolated session",
		"/new or /reset"
	],
	["reset", "Reset the current session"],
	[
		"abort",
		"Abort active run",
		"/abort"
	],
	[
		"settings",
		"Open settings",
		"/settings"
	],
	[
		"exit",
		"Exit the TUI",
		"/exit",
		void 0,
		{ aliases: [{
			name: "quit",
			description: "Exit the TUI"
		}] }
	]
].map(([name, description, help, completions, options]) => {
	const descriptor = {
		name,
		description,
		help,
		completions
	};
	descriptor.aliases = options?.aliases;
	descriptor.scope = options?.scope;
	descriptor.shared = options?.shared;
	if (options?.handler !== false) descriptor.handler = true;
	return descriptor;
});
function resolveTuiCommandDescriptor(name) {
	return TUI_COMMAND_DESCRIPTORS.find((command) => command.name === name || command.aliases?.some((alias) => alias.name === name));
}
function commandIsVisible(command, local) {
	return command.scope !== (local ? "remote" : "local");
}
function normalizeSlashCommandName(value) {
	return value.replace(/^\//, "").trim();
}
function appendSlashCommand(commands, seen, name, description, getArgumentCompletions) {
	const normalizedName = normalizeSlashCommandName(name);
	if (!normalizedName || seen.has(normalizedName)) return;
	seen.set(normalizedName, getArgumentCompletions);
	commands.push({
		name: normalizedName,
		description,
		getArgumentCompletions
	});
}
function parseCommand(input) {
	const sharedCommand = resolveTextCommand(input);
	if (sharedCommand) return {
		name: sharedCommand.command.key,
		args: sharedCommand.args ?? ""
	};
	const trimmed = input.replace(/^\//, "").trim();
	if (!trimmed) return {
		name: "",
		args: ""
	};
	const [name, ...rest] = trimmed.split(/\s+/);
	const normalized = normalizeLowercaseStringOrEmpty(name);
	return {
		name: resolveTuiCommandDescriptor(normalized)?.name ?? normalized,
		args: rest.join(" ").trim()
	};
}
/** Whether a slash input belongs to the shared Gateway command registry. */
function isSharedTextCommand(input) {
	return resolveTextCommand(input) !== null;
}
function getSlashCommands(options = {}) {
	const thinkLevels = resolveThinkingLevelLabels(options);
	const commands = [];
	const seen = /* @__PURE__ */ new Map();
	for (const command of TUI_COMMAND_DESCRIPTORS) {
		if (command.shared || !command.description || !commandIsVisible(command, options.local === true)) continue;
		const completions = command.completions === "thinking" ? createLevelCompletion([...thinkLevels, "default"]) : command.completions ? createLevelCompletion([...command.completions]) : void 0;
		appendSlashCommand(commands, seen, command.name, command.description, completions);
		for (const alias of command.aliases ?? []) if (!alias.hidden) appendSlashCommand(commands, seen, alias.name, alias.description ?? command.description, completions);
	}
	const gatewayCommands = options.cfg ? listChatCommandsForConfig(options.cfg) : listChatCommands();
	for (const command of gatewayCommands) {
		const descriptor = resolveTuiCommandDescriptor(command.key);
		if (options.local && !seen.has(command.key) && !descriptor?.shared) continue;
		if (options.local && descriptor && !commandIsVisible(descriptor, true)) continue;
		const aliases = command.textAliases.length > 0 ? command.textAliases : [`/${command.key}`];
		for (const alias of aliases) appendSlashCommand(commands, seen, alias, command.description, seen.get(command.key));
	}
	for (const command of options.dynamicCommands ?? []) {
		const aliases = command.textAliases?.length ? command.textAliases : [command.name];
		for (const alias of aliases) appendSlashCommand(commands, seen, alias, command.description);
	}
	return commands;
}
function shouldSubmitExactArgumentCompletion(input, commands) {
	const match = /^\/([^\s]+)\s+(.+)$/u.exec(input);
	if (!match) return false;
	const [, commandName, argumentText] = match;
	if (argumentText === void 0) return false;
	const command = commands.find((candidate) => candidate.name === commandName);
	if (!command?.getArgumentCompletions) return false;
	const completions = command.getArgumentCompletions(argumentText);
	return Array.isArray(completions) && completions.length === 1 && completions[0]?.value === argumentText;
}
function helpText(options = {}) {
	const thinkLevels = resolveThinkingLevelLabels(options).join("|");
	return [
		"Slash commands:",
		...TUI_COMMAND_DESCRIPTORS.flatMap((command) => {
			if (!command.help || !commandIsVisible(command, options.local === true)) return [];
			return (typeof command.help === "string" ? [command.help] : command.help).map((line) => line.replace("{thinkingLevels}", thinkLevels));
		}),
		"",
		"Keyboard shortcuts:",
		"Enter: send message",
		"Shift+Enter or Ctrl+J: insert a newline"
	].join("\n");
}
//#endregion
//#region src/tui/theme/theme.ts
const DARK_TEXT = "#E8E3D5";
const LIGHT_TEXT = "#1E1E1E";
const XTERM_LEVELS = [
	0,
	95,
	135,
	175,
	215,
	255
];
function channelToSrgb(value) {
	const normalized = value / 255;
	return normalized <= .03928 ? normalized / 12.92 : ((normalized + .055) / 1.055) ** 2.4;
}
function relativeLuminanceRgb(r, g, b) {
	const red = channelToSrgb(r);
	const green = channelToSrgb(g);
	const blue = channelToSrgb(b);
	return .2126 * red + .7152 * green + .0722 * blue;
}
function relativeLuminanceHex(hex) {
	return relativeLuminanceRgb(Number.parseInt(hex.slice(1, 3), 16), Number.parseInt(hex.slice(3, 5), 16), Number.parseInt(hex.slice(5, 7), 16));
}
function contrastRatio(background, foregroundHex) {
	const foreground = relativeLuminanceHex(foregroundHex);
	const lighter = Math.max(background, foreground);
	const darker = Math.min(background, foreground);
	return (lighter + .05) / (darker + .05);
}
function pickHigherContrastText(r, g, b) {
	const background = relativeLuminanceRgb(r, g, b);
	return contrastRatio(background, LIGHT_TEXT) >= contrastRatio(background, DARK_TEXT);
}
function isLightBackground() {
	const explicit = normalizeOptionalLowercaseString(process.env.OPENCLAW_THEME);
	if (explicit === "light") return true;
	if (explicit === "dark") return false;
	const colorfgbg = process.env.COLORFGBG;
	if (colorfgbg && colorfgbg.length <= 64) {
		const sep = colorfgbg.lastIndexOf(";");
		const bg = Number.parseInt(sep >= 0 ? colorfgbg.slice(sep + 1) : colorfgbg, 10);
		if (bg >= 0 && bg <= 255) {
			if (bg <= 15) return bg === 7 || bg === 15;
			if (bg >= 232) return bg >= 244;
			const cubeIndex = bg - 16;
			const bVal = expectDefined(XTERM_LEVELS[cubeIndex % 6], "xterm levels entry at cube index % 6");
			const gVal = expectDefined(XTERM_LEVELS[Math.floor(cubeIndex / 6) % 6], "xterm levels entry at math.floor(cube index / 6) % 6");
			return pickHigherContrastText(expectDefined(XTERM_LEVELS[Math.floor(cubeIndex / 36)], "xterm levels entry at math.floor(cube index / 36)"), gVal, bVal);
		}
	}
	return false;
}
const palette = isLightBackground() ? {
	text: "#1E1E1E",
	dim: "#5B6472",
	accent: "#B45309",
	accentSoft: "#C2410C",
	border: "#5B6472",
	userBg: "#F3F0E8",
	userText: "#1E1E1E",
	systemText: "#4B5563",
	toolPendingBg: "#EFF6FF",
	toolSuccessBg: "#ECFDF5",
	toolErrorBg: "#FEF2F2",
	toolTitle: "#B45309",
	toolOutput: "#374151",
	quote: "#1D4ED8",
	quoteBorder: "#2563EB",
	code: "#92400E",
	codeBorder: "#92400E",
	link: "#047857",
	error: "#DC2626",
	success: "#047857"
} : {
	text: "#E8E3D5",
	dim: "#7B7F87",
	accent: "#F6C453",
	accentSoft: "#F2A65A",
	border: "#3C414B",
	userBg: "#2B2F36",
	userText: "#F3EEE0",
	systemText: "#9BA3B2",
	toolPendingBg: "#1F2A2F",
	toolSuccessBg: "#1E2D23",
	toolErrorBg: "#2F1F1F",
	toolTitle: "#F6C453",
	toolOutput: "#E1DACB",
	quote: "#8CC8FF",
	quoteBorder: "#3B4D6B",
	code: "#F0C987",
	codeBorder: "#343A45",
	link: "#7DD3A5",
	error: "#F97066",
	success: "#7DD3A5"
};
const fg = (hex) => (text) => chalk.hex(hex)(text);
const bg = (hex) => (text) => chalk.bgHex(hex)(text);
/**
* Render code blocks with the theme code color without pulling a parser into the base TUI path.
* Returns an array of lines with ANSI escape codes.
*/
function highlightCode(code) {
	return code.split("\n").map((line) => fg(palette.code)(line));
}
const tuiTheme = {
	fg: fg(palette.text),
	assistantText: (text) => text,
	dim: fg(palette.dim),
	accent: fg(palette.accent),
	accentSoft: fg(palette.accentSoft),
	success: fg(palette.success),
	error: fg(palette.error),
	header: (text) => chalk.bold(fg(palette.accent)(text)),
	system: fg(palette.systemText),
	userBg: bg(palette.userBg),
	userText: fg(palette.userText),
	toolTitle: fg(palette.toolTitle),
	toolOutput: fg(palette.toolOutput),
	toolPendingBg: bg(palette.toolPendingBg),
	toolSuccessBg: bg(palette.toolSuccessBg),
	toolErrorBg: bg(palette.toolErrorBg),
	border: fg(palette.border),
	bold: (text) => chalk.bold(text),
	italic: (text) => chalk.italic(text)
};
const markdownTheme = {
	heading: (text) => chalk.bold(fg(palette.accent)(text)),
	link: (text) => fg(palette.link)(text),
	linkUrl: (text) => chalk.dim(text),
	code: (text) => fg(palette.code)(text),
	codeBlock: (text) => fg(palette.code)(text),
	codeBlockBorder: (text) => fg(palette.codeBorder)(text),
	quote: (text) => fg(palette.quote)(text),
	quoteBorder: (text) => fg(palette.quoteBorder)(text),
	hr: (text) => fg(palette.border)(text),
	listBullet: (text) => fg(palette.accentSoft)(text),
	bold: (text) => chalk.bold(text),
	italic: (text) => chalk.italic(text),
	strikethrough: (text) => chalk.strikethrough(text),
	underline: (text) => chalk.underline(text),
	highlightCode
};
const baseSelectListTheme = {
	selectedPrefix: (text) => fg(palette.accent)(text),
	selectedText: (text) => chalk.bold(fg(palette.accent)(text)),
	description: (text) => fg(palette.dim)(text),
	scrollInfo: (text) => fg(palette.dim)(text),
	noMatch: (text) => fg(palette.dim)(text)
};
const selectListTheme = baseSelectListTheme;
const filterableSelectListTheme = {
	...baseSelectListTheme,
	filterLabel: (text) => fg(palette.dim)(text)
};
const settingsListTheme = {
	label: (text, selected) => selected ? chalk.bold(fg(palette.accent)(text)) : fg(palette.text)(text),
	value: (text, selected) => selected ? fg(palette.accentSoft)(text) : fg(palette.dim)(text),
	description: (text) => fg(palette.systemText)(text),
	cursor: fg(palette.accent)("→ "),
	hint: (text) => fg(palette.dim)(text)
};
const editorTheme = {
	borderColor: (text) => fg(palette.border)(text),
	selectList: selectListTheme
};
const searchableSelectListTheme = {
	...baseSelectListTheme,
	searchPrompt: (text) => fg(palette.accentSoft)(text),
	searchInput: (text) => fg(palette.text)(text),
	matchHighlight: (text) => chalk.bold(fg(palette.accent)(text))
};
//#endregion
//#region src/tui/osc8-hyperlinks.ts
/** Allow one level of balanced parentheses inside a URL so markdown link
*  targets like `https://en.wikipedia.org/wiki/URL_(disambiguation)` are
*  fully captured instead of truncated at the first `)`. */
const URL_PATH_WITH_PARENS = /https?:\/\/[^()\s<>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]+(?:\([^()\s<>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*\)[^()\s<>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*)*/g;
/** Strip GFM sentence punctuation and unmatched closing parentheses from bare
*  URLs, while preserving balanced parentheses and exact authored Markdown
*  destinations. `(see https://example.com/path).` must link only the URL,
*  but `[label](https://example.com/path.)` must retain its authored dot. */
function trimUrlTrailingPunctuation(url, knownUrls) {
	let open = 0;
	for (let index = 0; index < url.length; index++) {
		const ch = url[index];
		if (ch === "(") open++;
		else if (ch === ")") {
			if (open === 0) {
				const authoredUrl = url.slice(0, index);
				return knownUrls?.has(authoredUrl) ? authoredUrl : trimUrlTrailingPunctuation(authoredUrl, knownUrls);
			}
			open--;
		}
	}
	const trimmed = url.replace(/[?!.,:;*_~]+$/u, "");
	return knownUrls?.has(url) && !knownUrls.has(trimmed) ? url : trimmed;
}
function hasUrlContent(url) {
	const authority = expectDefined(url.slice(url.indexOf("://") + 3).split(/[/?#]/, 1)[0], "url.slice(url.index of(\"://\") + 3).split(/[/?#]/, 1) entry at 0");
	return /[\p{L}\p{N}]/u.test(authority) || /^\[[0-9a-f:.]+\](?::\d+)?$/i.test(authority);
}
/**
* Extract all unique URLs from raw markdown text.
* Finds both bare URLs and markdown link hrefs [text](url).
*/
function extractUrls(markdown) {
	const urls = /* @__PURE__ */ new Set();
	const mdLinkRe = new RegExp(`\\[(?:[^\\]]*)\\]\\(\\s*<?(${URL_PATH_WITH_PARENS.source})>?(?:\\s+["'][^"']*["'])?\\s*\\)`, "g");
	const stripped = markdown.replace(mdLinkRe, (_match, url) => {
		if (hasUrlContent(url)) urls.add(url);
		return "";
	});
	let m;
	const bareRe = /https?:\/\/(?:\[[0-9a-f:.]+\](?::\d+)?[^\s\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*|[^\s[\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]+)/gi;
	while ((m = bareRe.exec(stripped)) !== null) {
		const url = trimUrlTrailingPunctuation(m[0]);
		if (hasUrlContent(url)) urls.add(url);
	}
	return urls;
}
/**
* Find URL ranges in a line's visible text, handling cross-line URL splits.
*/
function findUrlRanges(visibleText, knownUrls, pending, nextVisibleText) {
	const ranges = [];
	let newPending = null;
	let searchFrom = 0;
	if (pending) {
		const remaining = pending.url.slice(pending.consumed);
		const trimmed = visibleText.trimStart();
		const leadingSpaces = visibleText.length - trimmed.length;
		let matchLen = 0;
		for (let j = 0; j < remaining.length && j < trimmed.length; j++) if (remaining[j] === trimmed[j]) matchLen++;
		else break;
		if (matchLen > 0) {
			ranges.push({
				start: leadingSpaces,
				end: leadingSpaces + matchLen,
				url: pending.url
			});
			searchFrom = leadingSpaces + matchLen;
			if (pending.consumed + matchLen < pending.url.length) newPending = {
				url: pending.url,
				consumed: pending.consumed + matchLen
			};
		}
	}
	const urlRe = /https?:\/\/(?:\[[0-9a-f:.]+\](?::\d+)?[^\s\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*|[^\s[\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*)/gi;
	urlRe.lastIndex = searchFrom;
	let match;
	while ((match = urlRe.exec(visibleText)) !== null) {
		const fragment = trimUrlTrailingPunctuation(match[0], knownUrls);
		const start = match.index;
		let resolvedUrl = fragment;
		let found = false;
		if (!hasUrlContent(fragment)) {
			if (!(fragment === match[0] && visibleText.slice(start + match[0].length).trim().length === 0)) continue;
			const nextFragment = trimUrlTrailingPunctuation(nextVisibleText?.trimStart().match(/^[^\s\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]+/)?.[0] ?? "");
			for (const known of knownUrls) {
				if (!known.startsWith(fragment)) continue;
				const remaining = known.slice(fragment.length);
				if (nextFragment.length > 0 && remaining.startsWith(nextFragment) && known.length > resolvedUrl.length) {
					resolvedUrl = known;
					found = true;
				}
			}
			if (!found) continue;
		}
		if (!found && knownUrls.has(fragment)) found = true;
		if (!found) {
			let bestLen = 0;
			for (const known of knownUrls) if (known.startsWith(fragment) && known.length > bestLen) {
				resolvedUrl = known;
				bestLen = known.length;
				found = true;
			}
		}
		if (!found) {
			let bestLen = 0;
			for (const known of knownUrls) if (fragment.startsWith(known) && known.length > bestLen) {
				resolvedUrl = known;
				bestLen = known.length;
			}
		}
		ranges.push({
			start,
			end: start + fragment.length,
			url: resolvedUrl
		});
		if (resolvedUrl.length > fragment.length && resolvedUrl.startsWith(fragment)) newPending = {
			url: resolvedUrl,
			consumed: fragment.length
		};
	}
	return {
		ranges,
		pending: newPending
	};
}
/**
* Apply OSC 8 hyperlink sequences to a line based on visible-text URL ranges.
* Preserve renderer-owned hyperlinks while linking remaining visible URL ranges.
*/
function applyOsc8Ranges(line, ranges) {
	if (ranges.length === 0) return line;
	let result = "";
	let visiblePos = 0;
	let activeUrl = null;
	let rendererLink = false;
	let rangeIndex = 0;
	let range = ranges[rangeIndex];
	for (const segment of iterateAnsiSegments(line)) {
		if (segment.kind === "ansi") {
			let code = segment.value;
			if (code.startsWith("\x1B]8;")) {
				if (activeUrl !== null) result += "\x1B]8;;\x07";
				code = code.replace(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "");
				const body = code.slice(4, code.endsWith("\x1B\\") ? -2 : -1);
				rendererLink = body.slice(body.indexOf(";") + 1).length > 0;
				activeUrl = null;
			}
			result += code;
			continue;
		}
		let offset = 0;
		while (offset < segment.value.length) {
			while (range && visiblePos >= range.end) range = ranges[++rangeIndex];
			const targetUrl = !rendererLink && range && visiblePos >= range.start ? range.url : null;
			if (targetUrl !== activeUrl) {
				if (activeUrl !== null) result += "\x1B]8;;\x07";
				if (targetUrl !== null) result += `\x1b]8;;${targetUrl}\x07`;
				activeUrl = targetUrl;
			}
			let end = rendererLink || !range ? segment.value.length : Math.min(segment.value.length, offset + (visiblePos < range.start ? range.start : range.end) - visiblePos);
			const last = segment.value.charCodeAt(end - 1);
			const next = segment.value.charCodeAt(end);
			if (last >= 55296 && last <= 56319 && next >= 56320 && next <= 57343) end += 1;
			result += segment.value.slice(offset, end);
			visiblePos += end - offset;
			offset = end;
		}
	}
	if (activeUrl !== null) result += "\x1B]8;;\x07";
	return result;
}
/**
* Add OSC 8 hyperlinks to rendered lines using a pre-extracted URL set.
*
* For each line, finds URL-like substrings in the visible text, matches them
* against known URLs, and wraps each fragment with OSC 8 escape sequences.
* Handles URLs broken across multiple lines by pi-tui's word wrapping.
*/
function addOsc8Hyperlinks(lines, urls) {
	if (urls.size === 0) return lines;
	let pending = null;
	const visibleLines = lines.map(stripAnsi);
	return lines.map((line, index) => {
		const result = findUrlRanges(expectDefined(visibleLines[index], "visible lines entry at index"), urls, pending, visibleLines[index + 1]);
		pending = result.pending;
		return applyOsc8Ranges(line, result.ranges);
	});
}
//#endregion
//#region src/tui/components/hyperlink-markdown.ts
function sanitizeMarkdownDisplayText(text) {
	if (!text) return text;
	return sanitizeTerminalControlsAndBinary(text) || "(no output)";
}
/**
* Wrapper around pi-tui's Markdown component that adds OSC 8 terminal
* hyperlinks to rendered output, making URLs clickable even when broken
* across multiple lines by word wrapping.
*/
var HyperlinkMarkdown = class {
	constructor(text, paddingX, paddingY, theme, defaultTextStyle, options) {
		const displayText = sanitizeMarkdownDisplayText(text);
		this.inner = new Markdown(displayText, paddingX, paddingY, theme, defaultTextStyle, options);
		this.urls = extractUrls(displayText);
	}
	render(width) {
		if (this.cachedRender?.width === width) return this.cachedRender.lines;
		const lines = addOsc8Hyperlinks(this.inner.render(width), this.urls).map(isolateRtlRenderedLine);
		this.cachedRender = {
			width,
			lines
		};
		return lines;
	}
	setText(text) {
		const displayText = sanitizeMarkdownDisplayText(text);
		this.inner.setText(displayText);
		this.urls = extractUrls(displayText);
		this.cachedRender = void 0;
	}
	invalidate() {
		this.inner.invalidate();
		this.cachedRender = void 0;
	}
};
//#endregion
//#region src/tui/components/message-images.ts
const MAX_IMAGE_PREVIEWS = 24;
const MAX_MESSAGE_IMAGE_PREVIEWS = 4;
function createPreviewImage(image) {
	const options = {
		maxWidthCells: 60,
		maxHeightCells: 20
	};
	const dimensions = getImageDimensions(image.data, image.mimeType);
	if (getCapabilities().images !== "iterm2" || !dimensions) return new Image(image.data, image.mimeType, { fallbackColor: tuiTheme.dim }, options);
	let cachedWidth;
	let cachedLines = [];
	return {
		invalidate() {
			cachedWidth = void 0;
		},
		render(width) {
			if (width === cachedWidth) return cachedLines;
			const rendered = renderImage(image.data, dimensions, {
				...options,
				maxWidthCells: Math.min(width - 2, options.maxWidthCells)
			});
			if (!rendered) return [];
			const { columns, rows } = rendered;
			const sequence = encodeITerm2(image.data, {
				width: columns,
				height: rows
			});
			cachedLines = [...Array(rows - 1).fill(""), `${rows > 1 ? `\x1b[${rows - 1}A` : ""}${sequence}`];
			cachedWidth = width;
			return cachedLines;
		}
	};
}
/** Owns bounded preview work for the current transcript, independent of model context. */
var TuiImageRenderer = class {
	constructor(options) {
		this.options = options;
		this.limit = pLimit(2);
		this.previews = /* @__PURE__ */ new Set();
	}
	create(source) {
		const scope = this.options.getScope();
		const preview = new ImagePreview((signal) => this.limit(() => {
			signal.throwIfAborted();
			return this.options.loadImage({
				...scope,
				...source,
				signal
			});
		}), this.options.requestRender, () => this.previews.delete(preview));
		this.previews.add(preview);
		if (this.previews.size > MAX_IMAGE_PREVIEWS) this.previews.values().next().value?.dispose("Image preview limit reached.");
		return preview;
	}
	dispose() {
		for (const preview of this.previews) preview.dispose();
	}
};
var ImagePreview = class extends Container {
	constructor(load, requestRender, release) {
		super();
		this.load = load;
		this.requestRender = requestRender;
		this.release = release;
		this.controller = new AbortController();
		this.started = false;
	}
	render(width) {
		if (!getCapabilities().images) return [];
		if (!this.started && !this.controller.signal.aborted) {
			this.started = true;
			this.addChild(new Text(tuiTheme.dim("Loading image…"), 0, 0));
			this.load(this.controller.signal).then((image) => {
				if (this.controller.signal.aborted) return;
				this.clear();
				this.addChild(createPreviewImage(image));
				this.requestRender();
			}, () => {
				if (this.controller.signal.aborted) return;
				this.clear();
				this.addChild(new Text(tuiTheme.dim("Image preview unavailable."), 0, 0));
				this.requestRender();
			});
		}
		return super.render(width);
	}
	dispose(message) {
		this.controller.abort();
		this.clear();
		if (message) this.addChild(new Text(tuiTheme.dim(message), 0, 0));
		this.release();
	}
};
/** Retains loaded images across text updates and releases them with their message row. */
var MessageImages = class extends Container {
	constructor(renderer) {
		super();
		this.renderer = renderer;
		this.sources = [];
		this.previews = [];
	}
	setImages(images) {
		const renderer = this.renderer;
		if (!renderer || !getCapabilities().images) return;
		const sources = images.slice(0, MAX_MESSAGE_IMAGE_PREVIEWS);
		if (sources.length === this.sources.length && sources.every((source, index) => source.source === this.sources[index]?.source && source.artifactId === this.sources[index]?.artifactId)) return;
		this.dispose();
		this.sources = sources;
		this.previews = sources.map((source) => renderer.create(source));
		for (const preview of this.previews) this.addChild(preview);
	}
	dispose() {
		for (const preview of this.previews) preview.dispose();
		this.previews = [];
		this.sources = [];
		this.clear();
	}
};
//#endregion
//#region src/tui/components/markdown-message.ts
/** Container-backed markdown message that can update text in place. */
var MarkdownMessageComponent = class extends Container {
	constructor(text, y, defaultTextStyle, options, imageRenderer) {
		super();
		this.body = new HyperlinkMarkdown(text, 0, y, markdownTheme, defaultTextStyle, options);
		this.addChild(new Spacer(1));
		this.addChild(this.body);
		this.images = new MessageImages(imageRenderer);
		this.addChild(this.images);
	}
	/** Updates the rendered markdown without replacing the component. */
	setText(text) {
		this.body.setText(text);
	}
	setImages(images) {
		this.images.setImages(images);
	}
	dispose() {
		this.images.dispose();
	}
};
//#endregion
//#region src/tui/components/assistant-message.ts
var AssistantMessageComponent = class extends MarkdownMessageComponent {
	constructor(text, imageRenderer) {
		super(text, 0, { color: (line) => tuiTheme.assistantText(line) }, void 0, imageRenderer);
	}
};
//#endregion
//#region src/tui/components/btw-inline-message.ts
/** Renders a dismissible BTW result, with error text or assistant markdown content. */
var BtwInlineMessage = class extends Container {
	constructor(params) {
		super();
		this.setResult(params);
	}
	/** Replaces the current BTW content without reallocating the host component. */
	setResult(params) {
		const question = sanitizeRenderableLine(params.question);
		let text = params.text;
		if (params.isError) {
			text = sanitizeRenderableText(text);
			if (!text.trim()) text = "(no output)";
		}
		this.clear();
		this.addChild(new Spacer(1));
		this.addChild(new Text(tuiTheme.header(`BTW: ${question}`), 1, 0));
		if (params.isError) this.addChild(new Text(tuiTheme.error(text), 1, 0));
		else this.addChild(new AssistantMessageComponent(text));
		this.addChild(new Text(tuiTheme.dim("Press Enter or Esc to dismiss"), 1, 0));
	}
};
//#endregion
//#region src/tui/tui-images.ts
/** Keep structured image references intact instead of recovering paths from rendered prose. */
function extractTuiImageSources(message) {
	const value = asOptionalObjectRecord(message);
	if (!value) return [];
	const images = [];
	const sources = /* @__PURE__ */ new Set();
	for (const block of Array.isArray(value.content) ? value.content : []) {
		const entry = asOptionalObjectRecord(block);
		if (!entry) continue;
		const attachment = entry.type === "attachment" ? asOptionalObjectRecord(entry.attachment) : void 0;
		const image = attachment ?? entry;
		if (attachment ? attachment.kind !== "image" && attachment.kind !== "sticker" && !(typeof attachment.mimeType === "string" && attachment.mimeType.startsWith("image/")) : entry.type !== "image" && entry.type !== "image_url" && entry.type !== "input_image") continue;
		const nestedSource = asOptionalObjectRecord(image.source);
		const url = image.url ?? asOptionalObjectRecord(image.image_url)?.url ?? image.image_url ?? nestedSource?.url ?? (typeof image.source === "string" ? image.source : void 0);
		const data = image.data ?? nestedSource?.data;
		const mimeType = image.mimeType ?? nestedSource?.media_type ?? nestedSource?.mimeType;
		const source = typeof url === "string" && url.trim() ? url.trim() : typeof data === "string" && typeof mimeType === "string" ? `data:${mimeType};base64,${data}` : void 0;
		if (source && !sources.has(source)) {
			sources.add(source);
			images.push({
				source,
				...typeof image.artifactId === "string" ? { artifactId: image.artifactId } : {}
			});
		}
	}
	for (const fact of readPersistedMediaFacts(value) ?? []) {
		const source = fact.url || fact.path;
		if (source && isImageMediaFact(fact) && !sources.has(source)) {
			sources.add(source);
			images.push({ source });
		}
	}
	return images;
}
//#endregion
//#region src/tui/components/tool-execution.ts
const PREVIEW_LINES = 12;
const MAX_PREVIEW_CHARS = PREVIEW_LINES * 256;
var ToolOutputComponent = class extends HyperlinkMarkdown {
	constructor(..._args) {
		super(..._args);
		this.active = true;
		this.expanded = false;
		this.literal = false;
		this.literalOutput = new Text("", 0, 0);
	}
	setText(text, literal = false) {
		const sourceText = text.trim() ? sanitizeTerminalControlsAndBinary(text) : void 0;
		if (this.sourceText === sourceText && this.literal === literal) return;
		this.sourceText = sourceText;
		this.literal = literal;
		this.renderedSource = void 0;
		super.invalidate();
	}
	setActive(active) {
		this.active = active;
	}
	setExpanded(expanded) {
		if (this.expanded === expanded) return;
		this.expanded = expanded;
		this.renderedSource = void 0;
		super.invalidate();
	}
	render(width) {
		const safeWidth = Math.max(0, Math.floor(width));
		const previewBudget = Math.min(MAX_PREVIEW_CHARS, PREVIEW_LINES * Math.max(1, safeWidth));
		const sourceText = this.sourceText ?? (this.active ? "…" : "");
		const text = this.expanded ? sourceText : truncateUtf16Safe(sourceText, previewBudget);
		if (this.renderedSource !== text) {
			if (this.literal) this.literalOutput.setText(tuiTheme.toolOutput(text));
			else super.setText(text);
			this.renderedSource = text;
		}
		const lines = this.literal ? this.literalOutput.render(safeWidth).map(isolateRtlRenderedLine) : super.render(safeWidth);
		if (this.expanded || text.length === sourceText.length && lines.length <= PREVIEW_LINES) return lines;
		return [...lines.slice(0, 11), truncateToWidth("…", safeWidth, "")];
	}
};
function formatArgs(detail, args) {
	if (detail) return sanitizeRenderableText(detail);
	if (!args || typeof args !== "object") return "";
	try {
		return sanitizeRenderableText(JSON.stringify(args));
	} catch {
		return "";
	}
}
function extractText(result) {
	if (!result?.content) return "";
	const lines = [];
	for (const entry of result.content) if (entry.type === "text" && entry.text) lines.push(entry.text);
	else if (entry.type === "image") {
		const mime = entry.mimeType ?? "image";
		const size = entry.bytes ? ` ${Math.round(entry.bytes / 1024)}kb` : "";
		const omitted = entry.omitted ? " (omitted)" : "";
		lines.push(`[${mime}${size}${omitted}]`);
	}
	return lines.join("\n");
}
function isCodeModeResult(toolName, result) {
	if (toolName !== "exec" && toolName !== "wait") return false;
	const visibleTools = asOptionalObjectRecord(result?.details?.telemetry)?.visibleTools;
	return Array.isArray(visibleTools) && visibleTools.length === 2 && visibleTools[0] === "exec" && visibleTools[1] === "wait";
}
/** Displays a running or completed tool call with optional expandable output. */
var ToolExecutionComponent = class extends Container {
	constructor(toolName, args, imageRenderer) {
		super();
		this.title = "";
		this.isPartial = true;
		this.isError = false;
		this.expanded = false;
		this.toolName = toolName;
		this.box = new Box(1, 1, tuiTheme.toolPendingBg);
		this.header = new Text("", 0, 0);
		this.argsLine = new Text("", 0, 0);
		this.output = new ToolOutputComponent("", 0, 0, markdownTheme, { color: (line) => tuiTheme.toolOutput(line) });
		this.addChild(new Spacer(1));
		this.addChild(this.box);
		this.box.addChild(this.header);
		this.box.addChild(this.argsLine);
		this.box.addChild(this.output);
		this.images = new MessageImages(imageRenderer);
		this.box.addChild(this.images);
		this.setArgs(args);
		this.setPartialResult(void 0);
	}
	/** Re-renders tool arguments when streaming tool call input changes. */
	setArgs(args) {
		const display = resolveToolDisplay({
			name: this.toolName,
			args
		});
		this.title = `${display.emoji} ${display.label}`;
		this.refreshTitle();
		const argLine = formatArgs(formatToolDetail(display), args);
		this.argsLine.setText(argLine ? tuiTheme.dim(argLine) : tuiTheme.dim(" "));
	}
	/** Toggles preview/full output rendering for long tool results. */
	setExpanded(expanded) {
		this.expanded = expanded;
		this.output.setExpanded(expanded);
	}
	get isActive() {
		return this.activity ? this.activity.phase !== "end" : this.isPartial;
	}
	setActivity(activity) {
		this.activity = activity;
		this.refreshResult();
	}
	render(width) {
		if (!this.expanded && (this.activity === null || this.activity?.hideFromChannelProgress || this.activity?.suppressChannelProgress)) return [];
		return super.render(width);
	}
	/** Marks the tool call complete and renders final output. */
	setResult(result, opts) {
		this.updateResult(result, false, Boolean(opts?.isError));
	}
	/** Renders partial output while the tool call is still running. */
	setPartialResult(result) {
		this.updateResult(result, true);
	}
	dispose() {
		this.images.dispose();
	}
	refreshTitle() {
		const title = sanitizeRenderableLine(this.activity ? `${this.activity.title}${this.activity.status ? ` (${this.activity.status})` : ""}` : `${this.title}${this.isPartial ? " (running)" : ""}`);
		this.header.setText(tuiTheme.toolTitle(tuiTheme.bold(title)));
	}
	updateResult(result, isPartial, isError = false) {
		this.isPartial = isPartial;
		this.isError = isError;
		this.refreshResult();
		this.output.setText(extractText(result), isCodeModeResult(this.toolName, result));
		this.images.setImages(extractTuiImageSources(result));
	}
	refreshResult() {
		this.refreshTitle();
		const status = this.activity?.status;
		this.box.setBgFn(this.isActive ? tuiTheme.toolPendingBg : this.activity ? status === "failed" ? tuiTheme.toolErrorBg : status === "completed" ? tuiTheme.toolSuccessBg : void 0 : this.isError ? tuiTheme.toolErrorBg : tuiTheme.toolSuccessBg);
		this.output.setActive(this.isActive);
	}
};
//#endregion
//#region src/tui/components/user-message.ts
/** Markdown chat-log row styled as user input. */
var UserMessageComponent = class extends MarkdownMessageComponent {
	constructor(text, imageRenderer) {
		super(text, 1, {
			bgColor: (line) => tuiTheme.userBg(line),
			color: (line) => tuiTheme.userText(line)
		}, {
			preserveOrderedListMarkers: true,
			preserveBackslashEscapes: true
		}, imageRenderer);
	}
};
//#endregion
//#region src/tui/components/chat-log.ts
/** Scrollback container that tracks pending users, streaming assistant runs, tools, and notices. */
var ChatLog = class extends Container {
	constructor(maxComponents = 180, imageOptions) {
		super();
		this.tools = /* @__PURE__ */ new Map();
		this.assistantRuns = /* @__PURE__ */ new Map();
		this.userComponents = /* @__PURE__ */ new Map();
		this.pendingUsers = /* @__PURE__ */ new Map();
		this.pendingSystemNotices = /* @__PURE__ */ new Map();
		this.btwMessage = null;
		this.toolsExpanded = false;
		this.repeatableSystemMessage = null;
		this.maxComponents = Math.max(20, Math.floor(maxComponents));
		this.imageRenderer = imageOptions ? new TuiImageRenderer(imageOptions) : void 0;
	}
	removeChild(component) {
		if (component instanceof AssistantMessageComponent || component instanceof UserMessageComponent || component instanceof ToolExecutionComponent) component.dispose();
		super.removeChild(component);
	}
	dispose() {
		this.imageRenderer?.dispose();
	}
	dropComponentReferences(component) {
		for (const [toolId, tool] of this.tools.entries()) if (tool.component === component) this.tools.delete(toolId);
		if (component instanceof AssistantMessageComponent) for (const [runId, run] of this.assistantRuns.entries()) {
			if (run.streaming === component) run.streaming = void 0;
			run.frozen.delete(component);
			run.finalized.delete(component);
			this.releaseAssistantRunIfEmpty(runId, run);
		}
		for (const [runId, entry] of this.pendingUsers.entries()) if (entry.component === component) this.pendingUsers.delete(runId);
		for (const [messageId, user] of this.userComponents.entries()) if (user === component) this.userComponents.delete(messageId);
		for (const [runId, entry] of this.pendingSystemNotices.entries()) if (entry === component) this.pendingSystemNotices.delete(runId);
		if (this.btwMessage === component) this.btwMessage = null;
		if (this.repeatableSystemMessage?.component === component) this.repeatableSystemMessage = null;
	}
	pruneOverflow(protectedComponents) {
		while (this.children.length > this.maxComponents) {
			const oldest = protectedComponents ? this.children.find((component) => !protectedComponents.has(component)) ?? this.children.find((component) => component instanceof ToolExecutionComponent) : this.children[0];
			if (!oldest) return;
			this.removeChild(oldest);
			this.dropComponentReferences(oldest);
		}
	}
	reserveLiveUserSlot(protectedComponents, firstRunComponent, runId) {
		if (protectedComponents.size <= this.maxComponents) return;
		const streaming = runId ? this.assistantRuns.get(runId)?.streaming : void 0;
		const completedTools = /* @__PURE__ */ new Set();
		for (const tool of this.tools.values()) if (!tool.component.isActive) completedTools.add(tool.component);
		const evictable = this.children.find((entry) => entry !== firstRunComponent && entry !== streaming && entry instanceof AssistantMessageComponent && protectedComponents.has(entry)) ?? this.children.find((entry) => entry !== firstRunComponent && entry instanceof ToolExecutionComponent && completedTools.has(entry) && protectedComponents.has(entry)) ?? (streaming && firstRunComponent instanceof AssistantMessageComponent && firstRunComponent !== streaming ? firstRunComponent : void 0) ?? (firstRunComponent instanceof ToolExecutionComponent && completedTools.has(firstRunComponent) ? firstRunComponent : void 0) ?? this.children.find((entry) => entry !== firstRunComponent && entry instanceof ToolExecutionComponent && protectedComponents.has(entry));
		if (evictable) protectedComponents.delete(evictable);
	}
	append(component) {
		this.addChild(component);
		this.pruneOverflow();
	}
	appendNonSystem(component) {
		this.repeatableSystemMessage = null;
		this.append(component);
	}
	clearAll() {
		this.dispose();
		this.clear();
		this.tools.clear();
		this.assistantRuns.clear();
		this.userComponents.clear();
		this.pendingUsers.clear();
		this.pendingSystemNotices.clear();
		this.btwMessage = null;
		this.repeatableSystemMessage = null;
	}
	clearTools() {
		for (const tool of this.tools.values()) this.removeChild(tool.component);
		this.tools.clear();
	}
	formatSystemText(text, count = 1) {
		const visible = sanitizeRenderableText(text).trim() || (text ? "(no output)" : "");
		return tuiTheme.system(count > 1 ? `${visible} x${count}` : visible);
	}
	createSystemMessage(text) {
		const entry = new Container();
		const textNode = new Text(this.formatSystemText(text), 1, 0);
		entry.addChild(new Spacer(1));
		entry.addChild(textNode);
		return {
			component: entry,
			textNode,
			baseText: text,
			count: 1
		};
	}
	addSystem(text, opts) {
		if (opts?.coalesceConsecutive && this.repeatableSystemMessage?.baseText === text && this.children[this.children.length - 1] === this.repeatableSystemMessage.component) {
			this.repeatableSystemMessage.count += 1;
			this.repeatableSystemMessage.textNode.setText(this.formatSystemText(text, this.repeatableSystemMessage.count));
			return;
		}
		const message = this.createSystemMessage(text);
		this.append(message.component);
		this.repeatableSystemMessage = opts?.coalesceConsecutive ? message : null;
	}
	addPendingSystem(runId, text) {
		const existing = this.pendingSystemNotices.get(runId);
		if (existing) this.removeChild(existing);
		const message = this.createSystemMessage(text);
		this.pendingSystemNotices.set(runId, message.component);
		this.append(message.component);
	}
	dismissPendingSystem(runId) {
		const existing = this.pendingSystemNotices.get(runId);
		if (!existing) return false;
		this.removeChild(existing);
		this.pendingSystemNotices.delete(runId);
		return true;
	}
	addUser(text, options) {
		const previous = options?.messageId ? this.userComponents.get(options.messageId) : void 0;
		if (previous) {
			previous.setText(text);
			previous.setImages(options?.images ?? []);
			return previous;
		}
		const component = new UserMessageComponent(text, this.imageRenderer);
		component.setImages(options?.images ?? []);
		if (options?.messageId) this.userComponents.set(options.messageId, component);
		this.appendNonSystem(component);
		return component;
	}
	addLiveUser(text, options) {
		const existing = this.userComponents.get(options.messageId);
		if (existing) {
			existing.setText(text);
			existing.setImages(options.images ?? []);
			return existing;
		}
		const pending = options.sendId ? this.pendingUsers.get(options.sendId) : void 0;
		if (pending && options.sendId && pending.text === text) {
			pending.component.setText(text);
			pending.component.setImages(options.images ?? []);
			this.pendingUsers.delete(options.sendId);
			this.userComponents.set(options.messageId, pending.component);
			return pending.component;
		}
		const component = new UserMessageComponent(text, this.imageRenderer);
		component.setImages(options.images ?? []);
		this.userComponents.set(options.messageId, component);
		const protectedComponents = /* @__PURE__ */ new Set([component]);
		if (options.runId) {
			const run = this.assistantRuns.get(options.runId);
			for (const segment of run?.frozen ?? []) protectedComponents.add(segment);
			const streaming = run?.streaming;
			if (streaming) protectedComponents.add(streaming);
			for (const segment of run?.finalized ?? []) protectedComponents.add(segment);
			for (const tool of this.tools.values()) if (tool.runId === options.runId) protectedComponents.add(tool.component);
		}
		const firstRunComponentIndex = this.children.findIndex((entry) => protectedComponents.has(entry));
		if (firstRunComponentIndex >= 0) {
			const firstRunComponent = this.children[firstRunComponentIndex];
			this.repeatableSystemMessage = null;
			this.children.splice(firstRunComponentIndex, 0, component);
			this.reserveLiveUserSlot(protectedComponents, firstRunComponent, options.runId);
			this.pruneOverflow(protectedComponents);
			return component;
		}
		this.appendNonSystem(component);
		return component;
	}
	addPendingUser(runId, text) {
		const existing = this.pendingUsers.get(runId);
		if (existing) {
			existing.text = text;
			existing.component.setText(text);
			return existing.component;
		}
		const component = new UserMessageComponent(text, this.imageRenderer);
		this.pendingUsers.set(runId, {
			component,
			text
		});
		this.appendNonSystem(component);
		return component;
	}
	dropPendingUser(runId) {
		const existing = this.pendingUsers.get(runId);
		if (!existing) return false;
		this.removeChild(existing.component);
		this.pendingUsers.delete(runId);
		return true;
	}
	rekeyPendingUser(fromRunId, toRunId) {
		if (fromRunId === toRunId) return false;
		const existing = this.pendingUsers.get(fromRunId);
		if (!existing) return false;
		this.pendingUsers.delete(fromRunId);
		this.pendingUsers.set(toRunId, existing);
		return true;
	}
	countPendingUsers() {
		return this.pendingUsers.size;
	}
	resolveRunId(runId) {
		return runId ?? "default";
	}
	getAssistantRun(runId) {
		let run = this.assistantRuns.get(runId);
		if (!run) {
			run = {
				frozen: /* @__PURE__ */ new Set(),
				finalized: /* @__PURE__ */ new Set()
			};
			this.assistantRuns.set(runId, run);
		}
		return run;
	}
	releaseAssistantRunIfEmpty(runId, run) {
		if (!run.streaming && run.frozen.size === 0 && run.finalized.size === 0 && run.committedText === void 0 && run.latestText === void 0) this.assistantRuns.delete(runId);
	}
	resolveSingleStreamingRunId() {
		let streamingRunId;
		for (const [runId, run] of this.assistantRuns) {
			if (!run.streaming) continue;
			if (streamingRunId !== void 0) return;
			streamingRunId = runId;
		}
		return streamingRunId;
	}
	resolveAssistantSegment(runId, text) {
		const run = this.assistantRuns.get(runId);
		const committed = run?.committedText;
		if (!run || !committed) return text;
		if (text.startsWith(committed)) return text.slice(committed.length).replace(/^(?:\r?\n)+/u, "");
		if (!run.frozen.size) return text;
		for (const component of run.frozen) this.removeChild(component);
		run.frozen.clear();
		if (run.streaming) {
			this.removeChild(run.streaming);
			run.streaming = void 0;
		}
		run.committedText = void 0;
		return text;
	}
	freezeStreamingAssistants() {
		for (const run of this.assistantRuns.values()) {
			if (!run.streaming) continue;
			run.frozen.add(run.streaming);
			run.committedText = run.latestText ?? "";
			run.streaming = void 0;
		}
	}
	startAssistant(text, runId) {
		const effectiveRunId = this.resolveRunId(runId);
		const run = this.getAssistantRun(effectiveRunId);
		run.finalized.clear();
		run.latestText = text;
		const segmentText = this.resolveAssistantSegment(effectiveRunId, text);
		const existing = run.streaming;
		if (existing) {
			existing.setText(segmentText);
			return existing;
		}
		const component = new AssistantMessageComponent(segmentText, this.imageRenderer);
		run.streaming = component;
		this.appendNonSystem(component);
		return component;
	}
	reserveAssistantSlot(runId) {
		const effectiveRunId = this.resolveRunId(runId);
		const existing = this.assistantRuns.get(effectiveRunId)?.streaming;
		if (existing) return existing;
		return this.startAssistant("", runId);
	}
	updateAssistant(text, runId) {
		const effectiveRunId = this.resolveRunId(runId);
		const run = this.getAssistantRun(effectiveRunId);
		run.latestText = text;
		const segmentText = this.resolveAssistantSegment(effectiveRunId, text);
		const existing = run.streaming;
		if (!existing) {
			if (!segmentText && run.committedText !== void 0) return;
			this.startAssistant(text, runId);
			return;
		}
		existing.setText(segmentText);
	}
	finalizeAssistant(text, runId, images = []) {
		const effectiveRunId = this.resolveRunId(runId);
		const run = this.getAssistantRun(effectiveRunId);
		const segmentText = this.resolveAssistantSegment(effectiveRunId, text);
		const existing = run.streaming;
		const finalized = new Set(run.frozen);
		let lastAssistant;
		run.frozen.clear();
		run.committedText = void 0;
		run.latestText = void 0;
		if (existing) {
			if (segmentText || images.length > 0) {
				existing.setText(segmentText);
				lastAssistant = existing;
			} else this.removeChild(existing);
			run.streaming = void 0;
		} else if (segmentText || images.length > 0) {
			const component = new AssistantMessageComponent(segmentText, this.imageRenderer);
			this.appendNonSystem(component);
			lastAssistant = component;
		}
		if (lastAssistant) {
			lastAssistant.setImages(images);
			finalized.add(lastAssistant);
		}
		for (const segment of finalized) if (!this.children.includes(segment)) finalized.delete(segment);
		if (finalized.size > 0) {
			run.finalized = finalized;
			this.assistantRuns.set(effectiveRunId, run);
		}
		this.releaseAssistantRunIfEmpty(effectiveRunId, run);
	}
	dropAssistant(runId) {
		const effectiveRunId = this.resolveRunId(runId);
		const run = this.assistantRuns.get(effectiveRunId);
		if (!run) return;
		for (const component of run.frozen) this.removeChild(component);
		if (run.streaming) this.removeChild(run.streaming);
		this.assistantRuns.delete(effectiveRunId);
	}
	showBtw(params) {
		if (this.btwMessage) {
			this.btwMessage.setResult(params);
			if (this.children[this.children.length - 1] !== this.btwMessage) {
				this.removeChild(this.btwMessage);
				this.appendNonSystem(this.btwMessage);
			}
			return this.btwMessage;
		}
		const component = new BtwInlineMessage(params);
		this.btwMessage = component;
		this.appendNonSystem(component);
		return component;
	}
	dismissBtw() {
		if (!this.btwMessage) return;
		this.removeChild(this.btwMessage);
		this.btwMessage = null;
	}
	hasVisibleBtw() {
		return this.btwMessage !== null;
	}
	startTool(toolCallId, toolName, args, runId, activity) {
		const existing = this.tools.get(toolCallId);
		if (existing) {
			if (args !== void 0) existing.component.setArgs(args);
			if (activity !== void 0) existing.component.setActivity(activity);
			return existing.component;
		}
		const owningRunId = runId ?? this.resolveSingleStreamingRunId();
		this.freezeStreamingAssistants();
		const component = new ToolExecutionComponent(toolName, args, this.imageRenderer);
		if (activity !== void 0) component.setActivity(activity);
		component.setExpanded(this.toolsExpanded);
		this.tools.set(toolCallId, {
			component,
			runId: owningRunId
		});
		this.appendNonSystem(component);
		return component;
	}
	updateToolResult(toolCallId, result, opts) {
		const existing = this.tools.get(toolCallId);
		if (!existing) return;
		if (opts?.partial) {
			existing.component.setPartialResult(result);
			return;
		}
		existing.component.setResult(result, { isError: opts?.isError });
	}
	setToolsExpanded(expanded) {
		this.toolsExpanded = expanded;
		for (const tool of this.tools.values()) tool.component.setExpanded(expanded);
	}
};
//#endregion
//#region src/tui/components/custom-editor.ts
const KITTY_CSI_U_SUFFIX_REGEX = /^(\d+)(?::(\d*))?(?::(\d+))?(?:;(\d+))?(?::(\d+))?u$/u;
const KITTY_MODIFIERS = {
	alt: 2,
	ctrl: 4
};
function decodeAltGrPrintable(data) {
	if (!data.startsWith("\x1B[")) return;
	const match = data.slice(2).match(KITTY_CSI_U_SUFFIX_REGEX);
	if (!match) return;
	const codepoint = Number.parseInt(match[1] ?? "", 10);
	const baseLayoutKey = match[3] ? Number.parseInt(match[3], 10) : void 0;
	const modifierValue = match[4] ? Number.parseInt(match[4], 10) : 1;
	if (((Number.isFinite(modifierValue) ? modifierValue - 1 : 0) & -193) !== (KITTY_MODIFIERS.alt | KITTY_MODIFIERS.ctrl)) return;
	if (typeof baseLayoutKey !== "number" || baseLayoutKey === codepoint) return;
	if (!Number.isFinite(codepoint) || codepoint < 32) return;
	try {
		return String.fromCodePoint(codepoint);
	} catch {
		return;
	}
}
/** Editor with OpenClaw TUI shortcuts layered on top of pi-tui text editing. */
var CustomEditor = class extends Editor {
	/** Preserve raw submit text so the owner chooses local editor dispatch before trimming. */
	handleInput(data) {
		if (isKeyRelease(data)) return;
		if (matchesKey(data, Key.alt("enter")) && this.onAltEnter) {
			this.onAltEnter();
			return;
		}
		if (matchesKey(data, Key.alt("up")) && this.onAltUp) {
			this.onAltUp();
			return;
		}
		if (matchesKey(data, Key.ctrl("l")) && this.onCtrlL) {
			this.onCtrlL();
			return;
		}
		if (matchesKey(data, Key.ctrl("o")) && this.onCtrlO) {
			this.onCtrlO();
			return;
		}
		if (matchesKey(data, Key.ctrl("p")) && this.onCtrlP) {
			this.onCtrlP();
			return;
		}
		if (matchesKey(data, Key.ctrl("g")) && this.onCtrlG) {
			this.onCtrlG();
			return;
		}
		if (matchesKey(data, Key.ctrl("t")) && this.onCtrlT) {
			this.onCtrlT();
			return;
		}
		if (matchesKey(data, Key.shift("tab")) && this.onShiftTab) {
			this.onShiftTab();
			return;
		}
		if (matchesKey(data, Key.escape) && this.onEscape && !this.isShowingAutocomplete()) {
			this.onEscape();
			return;
		}
		if (matchesKey(data, Key.ctrl("c")) && this.onCtrlC) {
			this.onCtrlC();
			return;
		}
		if (matchesKey(data, Key.ctrl("d")) && this.getText().length === 0 && this.onCtrlD) {
			this.onCtrlD();
			return;
		}
		const altGrPrintable = decodeAltGrPrintable(data);
		if (altGrPrintable !== void 0) {
			super.handleInput(altGrPrintable);
			return;
		}
		const keybindings = getKeybindings();
		if (this.isShowingAutocomplete() && keybindings.matches(data, "tui.select.confirm") && keybindings.matches(data, "tui.input.submit")) {
			const cursor = this.getCursor();
			const lines = this.getLines();
			if (cursor.line === lines.length - 1 && cursor.col === (lines[cursor.line]?.length ?? 0) && this.shouldSubmitAutocomplete?.(this.getText())) this.setText(this.getText());
		}
		if (keybindings.matches(data, "tui.input.submit") && this.onSubmit) {
			const expandedText = this.getExpandedText();
			const onSubmit = this.onSubmit;
			this.onSubmit = (text) => onSubmit(expandedText.replace(expandedText.trim(), () => text));
			try {
				super.handleInput(data);
			} finally {
				this.onSubmit = onSubmit;
			}
			return;
		}
		super.handleInput(data);
	}
};
//#endregion
//#region src/tui/tui-auth-child.ts
const AUTH_CHILD_FORCE_EXIT_MS = 1e3;
function isChildRunning(child) {
	return child.exitCode === null && child.signalCode === null;
}
function signalAuthChild(child, signal) {
	if (child.pid) {
		signalProcessTree(child.pid, signal, { detached: false });
		return;
	}
	child.kill(signal);
}
function createTuiAuthChildOwner() {
	let active = null;
	let closed = false;
	const clearActive = (owned) => {
		if (owned.forceTimer) {
			clearTimeout(owned.forceTimer);
			owned.forceTimer = void 0;
		}
		if (active === owned) active = null;
	};
	const cancel = (owned) => {
		if (!isChildRunning(owned.child)) return;
		signalAuthChild(owned.child, "SIGTERM");
		owned.forceTimer = setTimeout(() => {
			if (active !== owned || !isChildRunning(owned.child)) return;
			signalAuthChild(owned.child, "SIGKILL");
		}, AUTH_CHILD_FORCE_EXIT_MS);
		owned.forceTimer.unref?.();
	};
	return {
		get running() {
			return active !== null && isChildRunning(active.child);
		},
		spawnAndWait: async (spawnChild) => {
			if (closed) throw new Error("TUI auth child owner is closed");
			if (active) throw new Error("TUI auth child is already running");
			const owned = { child: spawnChild() };
			active = owned;
			return await new Promise((resolve, reject) => {
				let settled = false;
				const settle = (complete) => {
					if (settled) return;
					settled = true;
					clearActive(owned);
					complete();
				};
				owned.child.once("error", (error) => settle(() => reject(error)));
				owned.child.once("exit", (exitCode, signal) => settle(() => resolve({
					exitCode,
					signal
				})));
			});
		},
		close: () => {
			if (closed) return;
			closed = true;
			if (active) cancel(active);
		}
	};
}
//#endregion
//#region src/tui/tui-autocomplete.ts
const originalSafeItem = Symbol("originalSafeItem");
/** Sanitize autocomplete presentation and omit values unsafe for editor rendering. */
function sanitizeAutocompleteProvider(inner) {
	return {
		triggerCharacters: inner.triggerCharacters,
		async getSuggestions(...args) {
			const suggestions = await inner.getSuggestions(...args);
			if (!suggestions) return null;
			const safeItems = suggestions.items.filter((item) => isTerminalSafeAutocompleteValue(item.value));
			if (safeItems.length === 0) return null;
			return {
				...suggestions,
				items: Array.from(safeItems, (item) => {
					const { description: rawDescription, ...displayFields } = item;
					const label = sanitizeRenderableLine(item.label) || sanitizeRenderableLine(item.value) || "(unnamed)";
					const description = rawDescription === void 0 ? void 0 : sanitizeRenderableLine(rawDescription);
					const displayItem = {
						...displayFields,
						label,
						...description ? { description } : {}
					};
					return Object.defineProperty(displayItem, originalSafeItem, { value: item });
				})
			};
		},
		applyCompletion(lines, cursorLine, cursorCol, item, prefix) {
			return inner.applyCompletion(lines, cursorLine, cursorCol, Reflect.get(item, originalSafeItem) ?? item, prefix);
		},
		shouldTriggerFileCompletion: inner.shouldTriggerFileCompletion ? (...args) => inner.shouldTriggerFileCompletion(...args) : void 0
	};
}
function createTuiAutocompleteProvider(commands, basePath, fdPath) {
	const inner = new CombinedAutocompleteProvider(commands, basePath, fdPath);
	return sanitizeAutocompleteProvider({
		getSuggestions(lines, cursorLine, cursorCol, options) {
			const textBeforeCursor = (lines[cursorLine] ?? "").slice(0, cursorCol);
			const isNaturalCompletion = /(?:^|[\s='"])@(?:"[^"]*|[^\s='"]*)$/u.test(textBeforeCursor) || textBeforeCursor.startsWith("/");
			if (!options.force && !isNaturalCompletion) return Promise.resolve(null);
			return inner.getSuggestions(lines, cursorLine, cursorCol, options);
		},
		applyCompletion: (...args) => inner.applyCompletion(...args),
		shouldTriggerFileCompletion: (...args) => inner.shouldTriggerFileCompletion(...args)
	});
}
//#endregion
//#region src/tui/components/filterable-select-list.ts
/**
* Combines text input filtering with a select list.
* User types to filter, arrows or Ctrl+P/Ctrl+N navigate, and Escape clears or cancels.
*/
var FilterableSelectList = class {
	constructor(items, maxVisible, theme) {
		this.allItems = items.map((item) => ({
			searchText: [
				item.label,
				item.description,
				item.searchText
			].filter(Boolean).join(" "),
			item: {
				...item,
				label: sanitizeRenderableLine(item.label || item.value) || sanitizeRenderableLine(item.value) || "(unnamed)",
				description: sanitizeRenderableLine(item.description ?? "")
			}
		}));
		this.maxVisible = maxVisible;
		this.theme = theme;
		this.input = new Input();
		this.input.onEscape = () => {
			if (this.input.getValue()) this.input.setValue("");
			else this.onCancel?.();
		};
		this.selectList = this.createSelectList(this.allItems);
	}
	get focused() {
		return this.input.focused;
	}
	set focused(value) {
		this.input.focused = value;
	}
	applyFilter() {
		const filtered = fuzzyFilter(this.allItems, this.input.getValue(), (entry) => entry.searchText);
		this.selectList = this.createSelectList(filtered);
	}
	createSelectList(items) {
		return new SelectList(items.map((entry) => entry.item), this.maxVisible, this.theme);
	}
	invalidate() {
		this.input.invalidate();
		this.selectList.invalidate();
	}
	render(width) {
		const lines = [];
		const safeWidth = Math.max(0, width);
		const filterLabel = this.theme.filterLabel("Filter: ");
		const inputText = this.input.render(Math.max(0, safeWidth - visibleWidth(filterLabel)))[0] ?? "";
		lines.push(truncateToWidth(filterLabel + inputText, safeWidth, ""));
		lines.push(chalk.dim("─".repeat(safeWidth)));
		const listLines = this.selectList.render(safeWidth);
		lines.push(...listLines.map((line) => truncateToWidth(line, safeWidth, "")));
		return lines;
	}
	handleInput(keyData) {
		if (matchesKey(keyData, "up") || matchesKey(keyData, "ctrl+p")) {
			this.selectList.handleInput("\x1B[A");
			return;
		}
		if (matchesKey(keyData, "down") || matchesKey(keyData, "ctrl+n")) {
			this.selectList.handleInput("\x1B[B");
			return;
		}
		if (matchesKey(keyData, "enter")) {
			const selected = this.selectList.getSelectedItem();
			if (selected) this.onSelect?.(selected);
			return;
		}
		const prevValue = this.input.getValue();
		this.input.handleInput(keyData);
		if (this.input.getValue() !== prevValue) this.applyFilter();
	}
};
//#endregion
//#region src/tui/components/searchable-select-list.ts
/**
* A select list with a search input at the top for fuzzy filtering.
*/
var SearchableSelectList = class SearchableSelectList {
	static {
		this.DESCRIPTION_LAYOUT_MIN_WIDTH = 40;
	}
	static {
		this.DESCRIPTION_MIN_WIDTH = 12;
	}
	static {
		this.DESCRIPTION_SPACING_WIDTH = 2;
	}
	static {
		this.RIGHT_MARGIN_WIDTH = 2;
	}
	constructor(items, maxVisible, theme) {
		this.selectedIndex = 0;
		this.compareByScore = (a, b) => {
			if (a.tier !== b.tier) return a.tier - b.tier;
			if (a.score !== b.score) return a.score - b.score;
			return this.getItemLabel(a.item).localeCompare(this.getItemLabel(b.item));
		};
		this.items = items;
		this.filteredItems = items;
		this.maxVisible = maxVisible;
		this.theme = theme;
		this.searchInput = new Input();
		this.searchInput.onEscape = () => this.onCancel?.();
	}
	get focused() {
		return this.searchInput.focused;
	}
	set focused(value) {
		this.searchInput.focused = value;
	}
	updateFilter() {
		const query = this.searchInput.getValue().trim();
		if (!query) this.filteredItems = this.items;
		else this.filteredItems = this.smartFilter(query);
		this.selectedIndex = 0;
	}
	/**
	* Smart filtering that prioritizes:
	* 1. Exact substring match in label (highest priority)
	* 2. Exact substring in description
	* 3. Fuzzy match (lowest priority)
	*/
	smartFilter(query) {
		const q = normalizeLowercaseStringOrEmpty(query);
		const scoredItems = [];
		const fuzzyCandidates = [];
		this.preparedItems ??= this.items.map((item) => {
			const label = stripAnsi(this.getItemLabel(item));
			const description = stripAnsi(item.description ?? "");
			const searchText = stripAnsi(item.searchText ?? "");
			return {
				item,
				label: normalizeLowercaseStringOrEmpty(label),
				description: normalizeLowercaseStringOrEmpty(description),
				searchText: normalizeLowercaseStringOrEmpty([
					label,
					description,
					searchText
				].filter((value) => value.length > 0).join(" "))
			};
		});
		for (const prepared of this.preparedItems) {
			const labelIndex = prepared.label.indexOf(q);
			if (labelIndex !== -1) {
				scoredItems.push({
					item: prepared.item,
					tier: 0,
					score: labelIndex
				});
				continue;
			}
			const descIndex = prepared.description.indexOf(q);
			if (descIndex !== -1) {
				scoredItems.push({
					item: prepared.item,
					tier: 1,
					score: descIndex
				});
				continue;
			}
			fuzzyCandidates.push(prepared);
		}
		scoredItems.sort(this.compareByScore);
		const fuzzyMatches = fuzzyFilter(fuzzyCandidates, q, (entry) => entry.searchText);
		return [...scoredItems.map((s) => s.item), ...fuzzyMatches.map((entry) => entry.item)];
	}
	escapeRegex(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	getItemLabel(item) {
		return item.label || item.value;
	}
	highlightMatch(text, patterns) {
		if (patterns.length === 0) return text;
		let parts = [...iterateAnsiSegments(text)];
		for (const regex of patterns) {
			const nextParts = [];
			for (const part of parts) {
				if (part.kind === "ansi") {
					nextParts.push(part);
					continue;
				}
				regex.lastIndex = 0;
				const replaced = part.value.replace(regex, (match) => this.theme.matchHighlight(match));
				if (replaced === part.value) {
					nextParts.push(part);
					continue;
				}
				nextParts.push(...iterateAnsiSegments(replaced));
			}
			parts = nextParts;
		}
		return parts.map((part) => part.value).join("");
	}
	invalidate() {
		this.searchInput.invalidate();
	}
	render(width) {
		const lines = [];
		const safeWidth = Math.max(0, width);
		const prompt = this.theme.searchPrompt("search: ");
		const inputWidth = Math.max(0, safeWidth - visibleWidth(prompt));
		const inputText = this.searchInput.render(inputWidth)[0] ?? "";
		lines.push(truncateToWidth(`${prompt}${this.theme.searchInput(inputText)}`, safeWidth, ""));
		lines.push("");
		const query = this.searchInput.getValue().trim();
		if (this.filteredItems.length === 0) {
			lines.push(truncateToWidth(this.theme.noMatch("  No matches"), safeWidth, ""));
			return lines;
		}
		const patterns = this.highlightPatterns ??= uniqueStrings(query.split(/\s+/).map((token) => normalizeLowercaseStringOrEmpty(token)).filter((token) => token.length > 0)).toSorted((a, b) => b.length - a.length).map((token) => new RegExp(this.escapeRegex(token), "gi"));
		const startIndex = Math.max(0, Math.min(this.selectedIndex - Math.floor(this.maxVisible / 2), this.filteredItems.length - this.maxVisible));
		const endIndex = Math.min(startIndex + this.maxVisible, this.filteredItems.length);
		for (let i = startIndex; i < endIndex; i++) {
			const item = this.filteredItems[i];
			if (!item) continue;
			const isSelected = i === this.selectedIndex;
			lines.push(truncateToWidth(this.renderItemLine(item, isSelected, safeWidth, patterns), safeWidth, ""));
		}
		if (this.filteredItems.length > this.maxVisible) {
			const scrollInfo = `${this.selectedIndex + 1}/${this.filteredItems.length}`;
			lines.push(truncateToWidth(this.theme.scrollInfo(`  ${scrollInfo}`), safeWidth, ""));
		}
		return lines;
	}
	renderItemLine(item, isSelected, width, patterns) {
		const prefix = isSelected ? "→ " : "  ";
		const prefixWidth = prefix.length;
		const displayValue = sanitizeRenderableLine(this.getItemLabel(item)) || sanitizeRenderableLine(item.value) || "(unnamed)";
		const description = sanitizeRenderableLine(item.description ?? "");
		if (description) {
			const descriptionLayout = this.getDescriptionLayout(width, prefixWidth);
			if (descriptionLayout) {
				const truncatedValue = truncateToWidth(displayValue, descriptionLayout.maxValueWidth, "");
				const valueText = this.highlightMatch(truncatedValue, patterns);
				const usedByValue = visibleWidth(valueText);
				const descriptionWidth = descriptionLayout.availableWidth - usedByValue - descriptionLayout.spacingWidth;
				if (descriptionWidth >= SearchableSelectList.DESCRIPTION_MIN_WIDTH) {
					const spacing = " ".repeat(descriptionLayout.spacingWidth);
					const truncatedDesc = truncateToWidth(description, descriptionWidth, "");
					const highlightedDesc = this.highlightMatch(truncatedDesc, patterns);
					const line = `${prefix}${valueText}${spacing}${isSelected ? highlightedDesc : this.theme.description(highlightedDesc)}`;
					return isSelected ? this.theme.selectedText(line) : line;
				}
			}
		}
		const maxWidth = width - prefixWidth - 2;
		const truncatedValue = truncateToWidth(displayValue, maxWidth, "");
		const line = `${prefix}${this.highlightMatch(truncatedValue, patterns)}`;
		return isSelected ? this.theme.selectedText(line) : line;
	}
	getDescriptionLayout(width, prefixWidth) {
		if (width <= SearchableSelectList.DESCRIPTION_LAYOUT_MIN_WIDTH) return null;
		const availableWidth = Math.max(1, width - prefixWidth - SearchableSelectList.RIGHT_MARGIN_WIDTH);
		const maxValueWidth = availableWidth - SearchableSelectList.DESCRIPTION_MIN_WIDTH - SearchableSelectList.DESCRIPTION_SPACING_WIDTH;
		if (maxValueWidth < 1) return null;
		return {
			availableWidth,
			maxValueWidth,
			spacingWidth: SearchableSelectList.DESCRIPTION_SPACING_WIDTH
		};
	}
	handleInput(keyData) {
		if (isKeyRelease(keyData)) return;
		if (matchesKey(keyData, "up") || matchesKey(keyData, "ctrl+p")) {
			this.selectedIndex = Math.max(0, this.selectedIndex - 1);
			return;
		}
		if (matchesKey(keyData, "down") || matchesKey(keyData, "ctrl+n")) {
			this.selectedIndex = Math.min(this.filteredItems.length - 1, this.selectedIndex + 1);
			return;
		}
		if (matchesKey(keyData, "enter")) {
			const item = this.filteredItems[this.selectedIndex];
			if (item && this.onSelect) this.onSelect(item);
			return;
		}
		const prevValue = this.searchInput.getValue();
		this.searchInput.handleInput(keyData);
		if (prevValue !== this.searchInput.getValue()) {
			this.highlightPatterns = void 0;
			this.updateFilter();
		}
	}
};
//#endregion
//#region src/tui/components/selectors.ts
/** Creates a themed searchable select list for TUI overlays. */
function createSearchableSelectList(items, maxVisible = 7) {
	return new SearchableSelectList(items, maxVisible, searchableSelectListTheme);
}
/** Creates a themed filterable select list for TUI overlays. */
function createFilterableSelectList(items, maxVisible = 7) {
	return new FilterableSelectList(items, maxVisible, filterableSelectListTheme);
}
/** Creates a themed settings list with change and cancel callbacks. */
function createSettingsList(items, onChange, onCancel, maxVisible = 7) {
	return new SettingsList(items, maxVisible, settingsListTheme, onChange, onCancel);
}
//#endregion
//#region src/tui/tui-browser-setup.ts
const PHASES = /* @__PURE__ */ new Set([
	"inspection_required",
	"preparing",
	"needs_browser_action",
	"waiting_for_connection",
	"ready",
	"blocked"
]);
const CONNECTIONS = /* @__PURE__ */ new Set([
	"not_checked",
	"unavailable",
	"waiting_for_extension",
	"connected"
]);
const NEXT_ACTIONS = {
	none: "Chrome extension connected. Tab availability is checked separately.",
	install: "Run /browser-setup install to install on the TUI process host.",
	open_chrome: "Open Chrome on the TUI process host, then run /browser-setup verify.",
	approve_extension: "Approve the extension in Chrome on the TUI process host, then run /browser-setup verify.",
	install_from_store: "Install the OpenClaw extension from the Chrome Web Store, then run /browser-setup verify.",
	check_connection: "Run /browser-setup verify to check the local Chrome connection.",
	repair_native_host: "Repair the local native host with openclaw browser extension install, then retry.",
	unsupported: "Automatic setup is unavailable on this platform."
};
/** Project only bounded status fields; never echo CLI diagnostics, paths, or credential-shaped extras. */
function formatSetupResult(value, action) {
	if (!isRecord(value) || value.action !== action || !isRecord(value.target) || value.target.kind !== "local-host" || typeof value.target.profile !== "string" || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(value.target.profile) || !isRecord(value.connection) || !isRecord(value.installation) || typeof value.phase !== "string" || !PHASES.has(value.phase) || typeof value.connection.state !== "string" || !CONNECTIONS.has(value.connection.state) || typeof value.nextAction !== "string" || !Object.hasOwn(NEXT_ACTIONS, value.nextAction)) return;
	const installation = value.installation;
	if (typeof installation.nativeHostRegistered !== "boolean" || typeof installation.installRequested !== "boolean" || typeof installation.awaitingApproval !== "boolean" || typeof installation.automaticBootstrapSupported !== "boolean" || typeof installation.discoveredProfiles !== "number" || !Number.isSafeInteger(installation.discoveredProfiles) || installation.discoveredProfiles < 0) return;
	return [
		"browser setup: target=TUI process host (not the Gateway), profile=" + value.target.profile,
		"browser setup: action=" + action + " phase=" + value.phase + " connection=" + value.connection.state,
		"browser setup: nativeHostRegistered=" + installation.nativeHostRegistered + " installRequested=" + installation.installRequested + " discoveredProfiles=" + installation.discoveredProfiles + " awaitingApproval=" + installation.awaitingApproval + " automaticBootstrapSupported=" + installation.automaticBootstrapSupported,
		"browser setup: " + NEXT_ACTIONS[value.nextAction]
	];
}
async function runTuiBrowserSetup(params) {
	const action = params.args.trim() || "inspect";
	if (action !== "inspect" && action !== "install" && action !== "verify") {
		params.report("Usage: /browser-setup [inspect|install|verify] — runs on the TUI process host; no credentials accepted.");
		return;
	}
	params.report("browser setup: " + action + " on the TUI process host (not the Gateway); /stop cancels");
	const result = await params.localCli.runJson([
		"browser",
		"extension",
		"setup",
		"--action",
		action,
		"--json",
		"--wait-ms",
		"1000"
	]);
	if (!result.ok) {
		params.report("browser setup: " + result.reason + "; retry /browser-setup inspect when ready");
		return;
	}
	const lines = formatSetupResult(result.value, action);
	if (!lines) {
		params.report("browser setup: invalid_response; check the installed OpenClaw CLI version");
		return;
	}
	for (const line of lines) params.report(line);
}
//#endregion
//#region src/tui/tui-busy-notice.ts
const TUI_AGENT_BUSY_MESSAGE = "agent is busy — press Esc to abort before sending a new message";
function addBlockedChatSubmitNotice(chatLog) {
	chatLog.addSystem(TUI_AGENT_BUSY_MESSAGE, { coalesceConsecutive: true });
}
//#endregion
//#region src/tui/tui-session-projection.ts
/** Admit only finals the terminal formatter can actually render. */
function hasDisplayableTuiSessionFinal(event, showThinking) {
	if (typeof event.errorMessage === "string" && event.errorMessage.trim()) return true;
	if (!event.message) return false;
	return extractTextFromMessage(event.message, { includeThinking: showThinking }).trim().length > 0;
}
/** Distinguish a legacy batch invalidation from an individually replayable message. */
function isIdentityOnlyTuiSessionInvalidation(event) {
	if (event.phase !== "message") return false;
	const changed = event;
	return changed.message === void 0 && !(typeof changed.messageId === "string" && changed.messageId.trim().length > 0) && !(typeof changed.messageSeq === "number" && Number.isSafeInteger(changed.messageSeq) && changed.messageSeq > 0) && !(typeof event.runId === "string" && event.runId.trim().length > 0) && !(typeof event.clientRunId === "string" && event.clientRunId.trim().length > 0);
}
/** Provider-local imports require a complete source or persisted—not envelope—sequence. */
function isReplayableTuiSessionMessage(event) {
	const identity = readSessionMessageIdentity(event.message, event);
	return Boolean(identity && (!identity.isImported || identity.externalSource || readSessionMessageSequence(event.message) !== null));
}
/** Scope the shared transcript projection to the TUI's actual selected session. */
function readTuiSessionProjectionScope(state) {
	return {
		sessionKey: state.currentSessionKey,
		agentId: state.currentAgentId,
		...state.currentSessionId ? { sessionId: state.currentSessionId } : {}
	};
}
/** Keep event handlers, history, and optimistic sends on one selected-session projection. */
function getTuiSessionProjection(state) {
	const scope = readTuiSessionProjectionScope(state);
	const current = state.sessionProjection;
	if (current && agentSessionKeysMatchByRequestKey(current.scope.sessionKey, scope.sessionKey) && current.scope.agentId === scope.agentId && (current.scope.sessionId === scope.sessionId || current.scope.sessionId === void 0 && scope.sessionId !== void 0)) {
		if (current.scope.sessionKey === scope.sessionKey && current.scope.sessionId === scope.sessionId) return current;
		const projection = {
			...current,
			scope: {
				...current.scope,
				...scope
			}
		};
		state.sessionProjection = projection;
		return projection;
	}
	const projection = createSessionProjection(scope);
	state.sessionProjection = projection;
	return projection;
}
/** Apply durable facts to the same TUI-owned reducer observed by every client path. */
function reduceTuiSessionProjection(state, event) {
	const projection = reduceSessionProjection(getTuiSessionProjection(state), event);
	state.sessionProjection = projection;
	return projection;
}
/** Promote a durable assistant row into the matching live run projection. */
function projectTuiSessionMessage(state, event, unboundDisplayedRunIds) {
	if (!isReplayableTuiSessionMessage(event)) return;
	const identity = readSessionMessageIdentity(event.message, event);
	const authoritativeRunId = (identity?.role === "assistant" && !identity.isImported ? identity.id ?? void 0 : void 0) ? identity?.runId ?? event.clientRunId ?? state.activeChatRunId ?? (unboundDisplayedRunIds.length === 1 ? unboundDisplayedRunIds[0] : void 0) : void 0;
	reduceTuiSessionProjection(state, {
		type: "messagePersisted",
		message: event.message,
		envelope: authoritativeRunId ? {
			...event,
			runId: authoritativeRunId
		} : event,
		scope: readTuiSessionProjectionScope(state)
	});
	return authoritativeRunId;
}
/** Retain the assistant reply actually rendered until authoritative history adopts it. */
function projectTuiSessionFinal(state, event, finalText, hasStreamedText) {
	if (state.sessionProjection?.runs[event.runId]?.stopReason === "error" || !hasStreamedText && !hasDisplayableTuiSessionFinal({
		...event,
		errorMessage: void 0
	}, state.showThinking)) return;
	const source = event.message && typeof event.message === "object" && !Array.isArray(event.message) ? event.message : {};
	const attachments = Array.isArray(source.content) ? source.content.filter(isTuiAssistantAttachmentBlock) : [];
	reduceTuiSessionProjection(state, {
		type: "messagePersisted",
		message: {
			...source,
			role: "assistant",
			content: attachments.length ? [{
				type: "text",
				text: finalText
			}, ...attachments] : finalText
		},
		envelope: { runId: event.runId },
		scope: readTuiSessionProjectionScope(state)
	});
}
//#endregion
//#region src/tui/tui-status-summary.ts
/** Formats Gateway/session health into compact status lines for the TUI. */
function formatStatusSummary(summary) {
	const lines = [];
	lines.push("Gateway status");
	if (summary.runtimeVersion) lines.push(`Version: ${summary.runtimeVersion}`);
	if (!summary.linkChannel) lines.push("Link channel: unknown");
	else {
		const linkLabel = summary.linkChannel.label ?? "Link channel";
		const linked = summary.linkChannel.linked === true;
		const authAge = linked && typeof summary.linkChannel.authAgeMs === "number" ? ` (last refreshed ${formatTimeAgo(summary.linkChannel.authAgeMs)})` : "";
		lines.push(`${linkLabel}: ${linked ? "linked" : "not linked"}${authAge}`);
	}
	const channelSummary = Array.isArray(summary.channelSummary) ? summary.channelSummary : [];
	if (channelSummary.length > 0) {
		lines.push("");
		lines.push("System:");
		for (const line of channelSummary) lines.push(`  ${line}`);
	}
	const heartbeatAgents = summary.heartbeat?.agents ?? [];
	if (heartbeatAgents.length > 0) {
		const heartbeatParts = heartbeatAgents.map((agent) => {
			const agentId = agent.agentId ?? "unknown";
			if (!agent.enabled || !agent.everyMs) return `disabled (${agentId})`;
			return `${agent.every ?? "unknown"} (${agentId})`;
		});
		lines.push("");
		lines.push(`Heartbeat: ${heartbeatParts.join(", ")}`);
	}
	const sessionPaths = summary.sessions?.paths ?? [];
	if (sessionPaths.length === 1) lines.push(`Session store: ${sessionPaths[0]}`);
	else if (sessionPaths.length > 1) lines.push(`Session stores: ${sessionPaths.length}`);
	const defaults = summary.sessions?.defaults;
	const defaultModel = defaults?.model ?? "unknown";
	const defaultCtx = typeof defaults?.contextTokens === "number" ? ` (${formatTokenCount(defaults.contextTokens)} ctx)` : "";
	lines.push(`Default model: ${defaultModel}${defaultCtx}`);
	const sessionCount = summary.sessions?.count ?? 0;
	lines.push(`Stored sessions: ${sessionCount}`);
	const recent = Array.isArray(summary.sessions?.recent) ? summary.sessions?.recent : [];
	if (recent.length > 0) {
		lines.push("Recent sessions:");
		for (const entry of recent) {
			const ageLabel = typeof entry.age === "number" ? formatTimeAgo(entry.age) : "no activity";
			const model = entry.model ?? "unknown";
			const usage = formatContextUsageLine({
				total: entry.totalTokens ?? null,
				context: entry.contextTokens ?? null,
				remaining: entry.remainingTokens ?? null,
				percent: entry.percentUsed ?? null
			});
			const flags = entry.flags?.length ? ` | flags: ${entry.flags.join(", ")}` : "";
			lines.push(`- ${entry.key}${entry.kind ? ` [${entry.kind}]` : ""} | ${ageLabel} | model ${model} | ${usage}${flags}`);
		}
	}
	const queued = Array.isArray(summary.queuedSystemEvents) ? summary.queuedSystemEvents : [];
	if (queued.length > 0) {
		const preview = queued.slice(0, 3).join(" | ");
		lines.push(`Queued system events (${queued.length}): ${preview}`);
	}
	return lines;
}
//#endregion
//#region src/tui/tui-submit-state.ts
function beginPendingSubmit(state, runId, text) {
	state.pendingSubmit = {
		phase: "sending",
		runId,
		draftText: text
	};
}
function acceptPendingSubmit(params) {
	const pending = params.state.pendingSubmit;
	if (!pending || pending.phase !== "sending" || pending.runId !== params.provisionalRunId) return false;
	params.state.pendingSubmit = {
		phase: "accepted",
		runId: params.acceptedRunId,
		draftText: params.preserveDraft ? pending.draftText : null
	};
	return true;
}
function clearPendingSubmit(state, runId) {
	const pending = state.pendingSubmit;
	if (!pending || runId !== void 0 && pending.runId !== runId) return false;
	state.pendingSubmit = null;
	return true;
}
function clearPendingSubmitDraft(state, runId) {
	const pending = state.pendingSubmit;
	if (pending?.phase !== "accepted" || pending.runId !== runId || pending.draftText === null) return false;
	state.pendingSubmit = {
		...pending,
		draftText: null
	};
	return true;
}
function hasPendingSubmit(state) {
	return state.pendingSubmit !== null;
}
function getPendingSubmitAcceptedRunId(state) {
	return state.pendingSubmit?.phase === "accepted" ? state.pendingSubmit.runId : null;
}
function getPendingSubmitDraft(state) {
	const pending = state.pendingSubmit;
	if (!pending || pending.draftText === null) return null;
	return {
		runId: pending.runId,
		text: pending.draftText
	};
}
function reconcilePendingSubmitHistory(state, reconciledRunIds) {
	const runId = state.pendingSubmit?.runId;
	if (!runId || !new Set(reconciledRunIds).has(runId)) return false;
	state.pendingSubmit = null;
	return true;
}
function resolveTuiChatSubmitAdmission(params) {
	if (!params.isConnected) return {
		status: "blocked",
		reason: "disconnected"
	};
	if (isChatStopCommandText(params.message) && (params.activeChatRunId || params.pendingSubmit?.phase === "accepted")) return { status: "allowed" };
	return params.pendingSubmit ? {
		status: "blocked",
		reason: "pending"
	} : { status: "allowed" };
}
function disconnectedTuiChatSubmitMessage(local) {
	return local ? "local runtime not ready — message not sent" : "not connected to gateway — message not sent";
}
//#endregion
//#region src/tui/tui-command-handlers.ts
function formatTuiFastMode(mode) {
	return mode === "auto" ? "auto" : mode === true ? "on" : "off";
}
function isBtwCommand(text) {
	return /^\/(?:btw|side)(?::|\s|$)/i.test(text.trim());
}
function isSlashStopCommand(text) {
	const trimmed = text.trim();
	return trimmed.startsWith("/") && isChatStopCommandText(trimmed);
}
const TERMINAL_CHAT_SEND_FAILURE_MESSAGE = "Chat failed before the run started; try again.";
function createCommandHandlers(context) {
	const { client, chatLog, tui, opts, state, deliverDefault, openOverlay, closeOverlay, refreshSessionInfo, loadHistory, setSession, refreshAgents, abortActive, setActivityStatus, applySessionInfoFromPatch, applySessionMutationResult, noteLocalRunId, noteLocalBtwRunId, forgetLocalRunId, forgetLocalBtwRunId, consumeCompletedRunForPendingSend, isRunObserved, flushPendingHistoryRefreshIfIdle, runAuthFlow, requestExit } = context;
	let sessionTransition = {
		active: null,
		boundary: null,
		epoch: 0
	};
	let pickerRequest = null;
	const beginSessionTransition = (command) => {
		const epoch = sessionTransition.epoch + 1;
		sessionTransition = {
			active: command,
			boundary: command,
			epoch
		};
		return () => {
			if (sessionTransition.active === command && sessionTransition.epoch === epoch) sessionTransition = {
				active: null,
				boundary: command,
				epoch: epoch + 1
			};
		};
	};
	const captureMessageAdmission = () => ({
		sessionTransition: sessionTransition.active,
		sessionTransitionEpoch: sessionTransition.epoch
	});
	const resolveMessageAdmission = (message, snapshot) => {
		const admission = resolveTuiChatSubmitAdmission({
			isConnected: state.isConnected,
			activeChatRunId: state.activeChatRunId,
			pendingSubmit: state.pendingSubmit,
			message
		});
		if (admission.status === "blocked" && admission.reason === "disconnected") return admission;
		const transitionCommand = snapshot ? snapshot.sessionTransition ?? (snapshot.sessionTransitionEpoch !== sessionTransition.epoch ? sessionTransition.active ?? sessionTransition.boundary : null) : sessionTransition.active;
		if (transitionCommand) return {
			status: "blocked",
			reason: "session-transition",
			command: transitionCommand
		};
		return admission.status === "blocked" && isBtwCommand(message) ? { status: "allowed" } : admission;
	};
	const reportBlockedMessageSubmit = (_message, admission) => {
		if (admission.reason === "pending") addBlockedChatSubmitNotice(chatLog);
		else if (admission.reason === "disconnected") {
			chatLog.addSystem(disconnectedTuiChatSubmitMessage(opts.local === true));
			setActivityStatus("disconnected");
		} else chatLog.addSystem(`session change in progress; wait for /${admission.command} to finish`);
		tui.requestRender();
	};
	const addUnsupportedLocalCommand = (name) => {
		chatLog.addSystem(`/${name} is not available in local embedded mode; message not sent`);
	};
	const setAgent = async (id) => {
		await setSession("", normalizeAgentId(id));
		chatLog.addSystem(`agent set to ${state.currentAgentId}; use /openclaw to return`);
	};
	const beginPickerRequest = () => {
		if (pickerRequest && chatLog.dismissPendingSystem(pickerRequest.noticeId)) tui.requestRender();
		if (pickerRequest?.overlay) closeOverlayAndRender(pickerRequest.overlay);
		return pickerRequest = { noticeId: randomUUID() };
	};
	const closeOverlayAndRender = (handle) => {
		if (pickerRequest?.overlay !== handle) return;
		pickerRequest = null;
		closeOverlay(handle);
		tui.requestRender();
	};
	const hasTrackedAbortTarget = () => Boolean(state.activeChatRunId || hasPendingSubmit(state));
	const hasUnsafeSessionRollover = () => hasTrackedAbortTarget() || state.activityStatus === "finishing context";
	const rejectUnsafeSessionRollover = (command) => {
		if (!hasUnsafeSessionRollover()) return false;
		chatLog.addSystem(`abort the current run before /${command}`);
		tui.requestRender();
		return true;
	};
	const captureSessionSelection = () => ({
		sessionKey: state.currentSessionKey,
		agentId: state.currentAgentId
	});
	const isCurrentSessionSelection = (selection) => state.currentAgentId === selection.agentId && agentSessionKeysMatchByRequestKey(state.currentSessionKey, selection.sessionKey);
	const captureSessionIncarnation = () => {
		const selection = captureSessionSelection();
		const sessionId = state.currentSessionId;
		const generation = state.sessionGeneration ?? 0;
		return {
			selection,
			sessionId,
			isCurrent: () => isCurrentSessionSelection(selection) && (state.sessionGeneration ?? 0) === generation && (sessionId === null || state.currentSessionId === sessionId)
		};
	};
	const applySessionSetting = async (patch, success, failure, after) => {
		const { selection, isCurrent } = captureSessionIncarnation();
		try {
			const result = await client.patchSession({
				key: selection.sessionKey,
				...!parseAgentSessionKey(selection.sessionKey) ? { agentId: selection.agentId } : {},
				...patch
			});
			if (!isCurrent()) return;
			chatLog.addSystem(typeof success === "function" ? success(result) : success);
			applySessionInfoFromPatch(result);
			if (after) await after(result);
			else await refreshSessionInfo();
		} catch (err) {
			if (isCurrent()) chatLog.addSystem(`${failure}: ${formatTuiErrorMessage(err)}`);
		}
	};
	const openSelector = (selector, onSelect, request) => {
		const { isCurrent } = captureSessionIncarnation();
		selector.onSelect = (item) => {
			if (pickerRequest !== request) return;
			closeOverlayAndRender(overlayHandle);
			(async () => {
				try {
					if (isCurrent()) await onSelect(item.value);
				} catch (err) {
					if (isCurrent()) chatLog.addSystem(`selection failed: ${formatTuiErrorMessage(err)}`);
				}
				tui.requestRender();
			})();
		};
		selector.onCancel = () => closeOverlayAndRender(overlayHandle);
		const overlayHandle = request.overlay = openOverlay(selector);
		tui.requestRender();
	};
	const openModelSelector = async () => {
		const request = beginPickerRequest();
		const { selection, isCurrent } = captureSessionIncarnation();
		try {
			chatLog.addPendingSystem(request.noticeId, "loading models...");
			tui.requestRender();
			const models = await client.listModels({ agentId: selection.agentId });
			if (request !== pickerRequest || !isCurrent()) return;
			if (models.length === 0) {
				chatLog.addSystem("no models available");
				return;
			}
			const items = models.map((model) => {
				const ref = modelKey(model.provider, model.id);
				return {
					value: ref,
					label: ref,
					description: [model.name !== model.id ? model.name : "", model.available === false ? model.unavailableReason ?? "unavailable" : ""].filter(Boolean).join(" · ")
				};
			});
			openSelector(createSearchableSelectList(items, 9), async (value) => {
				const model = models.find((entry) => modelKey(entry.provider, entry.id) === value);
				if (model?.available === false) {
					const guidance = model.unavailableReason === "cooldown" ? "Wait and retry, or choose another model." : "Run openclaw models auth login or choose another model.";
					chatLog.addSystem(`model unavailable: ${model.unavailableReason ?? "unavailable"}. ${guidance}`);
					return;
				}
				await applySessionSetting({ model: value }, `model set to ${value}`, "model set failed");
			}, request);
		} catch (err) {
			if (request !== pickerRequest || !isCurrent()) return;
			chatLog.addSystem(`model list failed: ${formatTuiErrorMessage(err)}`);
		} finally {
			if (request === pickerRequest && chatLog.dismissPendingSystem(request.noticeId)) tui.requestRender();
		}
	};
	const openAgentSelector = async () => {
		const request = beginPickerRequest();
		const refreshResult = await refreshAgents(() => request === pickerRequest);
		if (request !== pickerRequest) return;
		if (!refreshResult.ok) {
			tui.requestRender();
			return;
		}
		const selectableAgents = state.agents.filter((agent) => agent.kind !== "system");
		if (selectableAgents.length === 0) {
			chatLog.addSystem("no agents found");
			tui.requestRender();
			return;
		}
		const items = selectableAgents.map((agent) => ({
			value: agent.id,
			label: agent.name ? `${agent.id} (${agent.name})` : agent.id,
			description: agent.id === state.agentDefaultId ? "default" : ""
		}));
		openSelector(createSearchableSelectList(items, 9), setAgent, request);
	};
	const openContextModeSelector = () => {
		const request = beginPickerRequest();
		const selector = createSearchableSelectList([
			["list", "Short context breakdown"],
			["detail", "Per-file, per-tool, per-skill, and system prompt size"],
			["json", "Machine-readable context report"]
		].map(([value, description]) => ({
			value,
			label: value,
			description
		})), 9);
		openSelector(selector, (value) => sendMessage(`/context ${value}`), request);
	};
	const openSessionSelector = async () => {
		const request = beginPickerRequest();
		const { selection, isCurrent } = captureSessionIncarnation();
		try {
			const sessions = await loadRecentSessions(client, { agentId: selection.agentId });
			if (request !== pickerRequest || !isCurrent()) return;
			const selector = createFilterableSelectList(buildSessionChoices(sessions), 9);
			openSelector(selector, setSession, request);
		} catch (err) {
			if (request !== pickerRequest || !isCurrent()) return;
			chatLog.addSystem(`sessions list failed: ${formatTuiErrorMessage(err)}`);
			tui.requestRender();
		}
	};
	const openSettings = () => {
		const request = beginPickerRequest();
		const settings = createSettingsList([{
			id: "tools",
			label: "Tool output",
			currentValue: state.toolsExpanded ? "expanded" : "collapsed",
			values: ["collapsed", "expanded"]
		}, {
			id: "thinking",
			label: "Show thinking",
			currentValue: state.showThinking ? "on" : "off",
			values: ["off", "on"]
		}], (id, value) => {
			if (id === "tools") {
				state.toolsExpanded = value === "expanded";
				chatLog.setToolsExpanded(state.toolsExpanded);
			}
			if (id === "thinking") {
				state.showThinking = value === "on";
				loadHistory();
			}
			tui.requestRender();
		}, () => closeOverlayAndRender(overlayHandle));
		const overlayHandle = request.overlay = openOverlay(settings);
		tui.requestRender();
	};
	const commandHandlers = {
		help: () => {
			chatLog.addSystem(helpText({
				local: opts.local,
				provider: state.sessionInfo.modelProvider,
				model: state.sessionInfo.model,
				agentRuntime: state.sessionInfo.agentRuntime?.id,
				thinkingLevels: state.sessionInfo.thinkingLevels
			}));
		},
		"browser-setup": async (args) => {
			if (!context.localCli) {
				chatLog.addSystem("browser setup: local CLI runner unavailable; message not sent");
				return;
			}
			await runTuiBrowserSetup({
				args,
				localCli: context.localCli,
				report: (line) => {
					chatLog.addSystem(line);
					tui.requestRender();
				}
			});
		},
		auth: async (args) => {
			if (!runAuthFlow) {
				chatLog.addSystem("auth login is only available in local embedded mode");
				return;
			}
			if (state.activeChatRunId || hasPendingSubmit(state)) {
				chatLog.addSystem("abort the current run before /auth");
				return;
			}
			const provider = args.trim() || state.sessionInfo.modelProvider || void 0;
			chatLog.addSystem(provider ? `opening auth flow for ${provider}; TUI will resume when it exits` : "opening auth flow; TUI will resume when it exits");
			tui.requestRender();
			setActivityStatus("auth");
			try {
				const result = await runAuthFlow({ provider });
				await refreshSessionInfo();
				if (result.exitCode === 0 && !result.signal) {
					chatLog.addSystem(provider ? `auth flow finished for ${provider}` : "auth flow finished");
					setActivityStatus("idle");
				} else {
					const failureSuffix = result.signal ? ` (signal ${result.signal})` : typeof result.exitCode === "number" ? ` (exit ${String(result.exitCode)})` : "";
					chatLog.addSystem(`auth flow failed${failureSuffix} — command argv: ${result.commandArgv}; retry provider login in a regular terminal to see its output`);
					setActivityStatus("error");
				}
			} catch (err) {
				chatLog.addSystem(`auth flow failed: ${formatTuiErrorMessage(err)}`);
				setActivityStatus("error");
			}
		},
		"gateway-status": async () => {
			try {
				const status = await client.getGatewayStatus();
				if (typeof status === "string") {
					chatLog.addSystem(status);
					return;
				}
				if (status && typeof status === "object") {
					const lines = formatStatusSummary(status);
					for (const line of lines) chatLog.addSystem(line);
					return;
				}
				chatLog.addSystem("status: unknown response");
			} catch (err) {
				chatLog.addSystem(`status failed: ${formatTuiErrorMessage(err)}`);
			}
		},
		agent: async (args) => {
			if (!args) await openAgentSelector();
			else await setAgent(args);
		},
		agents: async () => await openAgentSelector(),
		context: async (args, raw) => {
			if (opts.local) addUnsupportedLocalCommand("context");
			else if (!args) openContextModeSelector();
			else await sendMessage(raw);
		},
		goal: async (_args, raw) => {
			if (opts.local === true && client.runGoalCommand) {
				const { selection, isCurrent } = captureSessionIncarnation();
				try {
					const result = await client.runGoalCommand({
						...selection,
						command: raw
					});
					if (!isCurrent()) return;
					chatLog.addSystem(result.text);
					await refreshSessionInfo();
					if (result.continuationPrompt && isCurrent()) await sendMessage(result.continuationPrompt);
				} catch (err) {
					if (isCurrent()) chatLog.addSystem(`goal failed: ${formatTuiErrorMessage(err)}`);
				}
			} else await sendMessage(raw);
		},
		btw: async (args, raw) => {
			if (args) await sendMessage(raw);
			else chatLog.addSystem("Usage: /btw <side question>");
		},
		queue: async (_args, raw) => await sendMessage(raw),
		openclaw: (args) => {
			chatLog.addSystem(args ? `returning to OpenClaw with request: ${args}` : "returning to OpenClaw");
			requestExit({
				exitReason: "return-to-system-agent",
				...args ? { systemAgentMessage: args } : {}
			});
		},
		session: async (args) => {
			if (!args) await openSessionSelector();
			else await setSession(args);
		},
		sessions: async () => await openSessionSelector(),
		model: async (args, raw) => {
			if (shouldForwardModelCommandToServer(args)) await sendMessage(raw);
			else if (!args) await openModelSelector();
			else await applySessionSetting({ model: /^default$/i.test(args) ? null : args }, (result) => {
				const resolvedModel = result.resolved?.model;
				const resolvedProvider = result.resolved?.modelProvider;
				return `model set to ${resolvedModel ? resolvedProvider ? modelKey(resolvedProvider, resolvedModel) : resolvedModel : args}`;
			}, "model set failed");
		},
		models: async () => await openModelSelector(),
		think: async (args) => {
			const { thinkingLevels, modelProvider, model, agentRuntime } = state.sessionInfo;
			const levels = thinkingLevels?.length ? thinkingLevels : listThinkingLevelOptions(modelProvider, model, void 0, agentRuntime?.id);
			if (!args) {
				chatLog.addSystem(`usage: /think <${levels.map(({ label }) => label).join("|")}|default>`);
				return;
			}
			const normalized = args.toLowerCase();
			const thinkingLevel = isSessionDefaultDirectiveValue(args) ? null : levels.find(({ id }) => id.toLowerCase() === normalized)?.id ?? levels.find(({ label }) => label.toLowerCase() === normalized)?.id ?? args;
			await applySessionSetting({ thinkingLevel }, `thinking set to ${args}`, "think failed");
		},
		verbose: async (args) => {
			if (!args) {
				chatLog.addSystem(`usage: ${formatTuiLevelCommandUsage("verbose")}`);
				return;
			}
			await applySessionSetting({ verboseLevel: args }, `verbose set to ${args}`, "verbose failed", async () => {
				if (args === "off") {
					chatLog.clearTools();
					await refreshSessionInfo();
				} else await loadHistory();
			});
		},
		trace: async (args) => {
			if (!args) {
				chatLog.addSystem("usage: /trace <on|off>");
				return;
			}
			await applySessionSetting({ traceLevel: args }, `trace set to ${args}`, "trace failed");
		},
		fast: async (args) => {
			if (!args || args === "status") {
				chatLog.addSystem(`fast mode: ${formatTuiFastMode(state.sessionInfo.fastMode)}`);
				return;
			}
			const reset = isSessionDefaultDirectiveValue(args);
			if (!reset && ![
				"auto",
				"on",
				"off"
			].includes(args)) {
				chatLog.addSystem("usage: /fast <status|auto|on|off|default>");
				return;
			}
			await applySessionSetting({ fastMode: reset ? null : args === "auto" ? args : args === "on" }, `fast mode set to ${args}`, "fast failed");
		},
		reasoning: async (args) => {
			if (!args) {
				chatLog.addSystem(`usage: ${formatTuiLevelCommandUsage("reasoning")}`);
				return;
			}
			await applySessionSetting({ reasoningLevel: args }, `reasoning set to ${args}`, "reasoning failed");
		},
		usage: async (args, raw) => {
			if (args.toLowerCase() === "cost") {
				if (!opts.local) {
					await sendMessage(raw);
					return;
				}
				if (!client.runUsageCostCommand) {
					addUnsupportedLocalCommand("usage cost");
					return;
				}
				const { selection, isCurrent } = captureSessionIncarnation();
				try {
					const result = await client.runUsageCostCommand(selection);
					if (isCurrent()) chatLog.addSystem(result.text);
				} catch (err) {
					if (isCurrent()) chatLog.addSystem(`usage cost failed: ${formatTuiErrorMessage(err)}`);
				}
				return;
			}
			const isReset = args ? isSessionDefaultDirectiveValue(args) : false;
			const normalized = args && !isReset ? normalizeUsageDisplay(args) : void 0;
			if (args && !normalized && !isReset) {
				chatLog.addSystem("usage: /usage <off|tokens|full|cost|reset>");
				return;
			}
			if (isReset) {
				await applySessionSetting({ responseUsage: null }, "usage footer: reset to default", "usage failed", async () => {
					delete state.sessionInfo.responseUsage;
					delete state.sessionInfo.effectiveResponseUsage;
					await refreshSessionInfo();
				});
				return;
			}
			const current = state.sessionInfo.effectiveResponseUsage ?? resolveResponseUsageMode(state.sessionInfo.responseUsage);
			const next = normalized ?? (current === "off" ? "tokens" : current === "tokens" ? "full" : "off");
			await applySessionSetting({ responseUsage: next }, `usage footer: ${next}`, "usage failed");
		},
		elevated: async (args) => {
			if (![
				"on",
				"off",
				"ask",
				"full"
			].includes(args)) {
				chatLog.addSystem("usage: /elevated <on|off|ask|full>");
				return;
			}
			await applySessionSetting({ elevatedLevel: args }, `elevated set to ${args}`, "elevated failed");
		},
		activation: async (args) => {
			if (!args) {
				chatLog.addSystem("usage: /activation <mention|always>");
				return;
			}
			const activation = normalizeGroupActivation(args);
			if (!activation) {
				chatLog.addSystem("usage: /activation <mention|always>");
				return;
			}
			await applySessionSetting({ groupActivation: activation }, `activation set to ${activation}`, "activation failed");
		},
		new: async () => {
			if (rejectUnsafeSessionRollover("new")) return;
			let creationIncarnation = captureSessionIncarnation();
			const { selection, sessionId } = creationIncarnation;
			const finishSessionTransition = beginSessionTransition("new");
			try {
				const result = await client.createSession({
					key: `tui-${randomUUID()}`,
					agentId: selection.agentId,
					...sessionId ? {
						parentSessionKey: selection.sessionKey,
						succeedsParent: true
					} : {}
				});
				if (!creationIncarnation.isCurrent()) return;
				if (!result.key) throw new Error("sessions.create returned no session key");
				const adoption = setSession(result.key);
				creationIncarnation = captureSessionIncarnation();
				await adoption;
				if (creationIncarnation.isCurrent()) chatLog.addSystem(`new session: ${result.key}`);
			} catch (err) {
				if (creationIncarnation.isCurrent()) chatLog.addSystem(`new session failed: ${formatTuiErrorMessage(err)}`);
			} finally {
				finishSessionTransition();
			}
		},
		reset: async () => {
			if (rejectUnsafeSessionRollover("reset")) return;
			let resetIncarnation = captureSessionIncarnation();
			const resetSelection = resetIncarnation.selection;
			const finishSessionTransition = beginSessionTransition("reset");
			try {
				const result = await client.resetSession(resetSelection.sessionKey, "reset", !parseAgentSessionKey(resetSelection.sessionKey) ? { agentId: resetSelection.agentId } : void 0);
				if (!resetIncarnation.isCurrent()) return;
				state.sessionInfo.inputTokens = null;
				state.sessionInfo.outputTokens = null;
				state.sessionInfo.totalTokens = null;
				tui.requestRender();
				if (applySessionMutationResult(result, resetSelection)) {
					resetIncarnation = captureSessionIncarnation();
					await refreshSessionInfo();
				} else await loadHistory();
				if (!resetIncarnation.isCurrent()) return;
				chatLog.addSystem(`session ${state.currentSessionKey} reset`);
			} catch (err) {
				if (!resetIncarnation.isCurrent()) return;
				chatLog.addSystem(`reset failed: ${formatTuiErrorMessage(err)}`);
			} finally {
				finishSessionTransition();
			}
		},
		abort: async () => {
			context.localCli?.cancel();
			await abortActive();
		},
		stop: async () => {
			context.localCli?.cancel();
			await abortActive({ preferActive: true });
		},
		settings: () => openSettings(),
		question: async () => {
			if (context.reopenQuestion) await context.reopenQuestion();
			else chatLog.addSystem("no pending question");
		},
		exit: () => requestExit()
	};
	const handleCommand = async (raw) => {
		const { name, args } = parseCommand(raw);
		if (!name) return;
		const descriptor = resolveTuiCommandDescriptor(name);
		if (sessionTransition.active && descriptor?.name !== "exit") {
			chatLog.addSystem(`session change in progress; wait for /${sessionTransition.active} to finish`);
			tui.requestRender();
			return;
		}
		if (descriptor?.handler) await commandHandlers[descriptor.name](args, raw);
		else if (opts.local && isSharedTextCommand(raw)) addUnsupportedLocalCommand(name);
		else await sendMessage(raw);
		tui.requestRender();
	};
	const sendMessage = async (text, timeoutMs = opts.timeoutMs) => {
		const admission = resolveMessageAdmission(text);
		if (admission.status === "blocked") {
			reportBlockedMessageSubmit(text, admission);
			return;
		}
		const isBtw = isBtwCommand(text);
		const busy = Boolean(state.activeChatRunId || hasPendingSubmit(state));
		if (isSlashStopCommand(text) || hasTrackedAbortTarget() && busy && isChatStopCommandText(text)) {
			await abortActive({ preferActive: true });
			return;
		}
		const runId = randomUUID();
		const { selection: sendSelection, sessionId: sendSessionId, isCurrent: isCurrentSendViewport } = captureSessionIncarnation();
		const sendScope = readTuiSessionProjectionScope(state);
		try {
			if (!isBtw) {
				if (opts.local === true && state.activeChatRunId && !hasPendingSubmit(state)) chatLog.reserveAssistantSlot(state.activeChatRunId);
				chatLog.addPendingUser(runId, text);
				reduceTuiSessionProjection(state, {
					type: "sendPending",
					message: {
						role: "user",
						content: [{
							type: "text",
							text
						}],
						__openclaw: { idempotencyKey: `${runId}:user` }
					},
					runId,
					scope: sendScope
				});
				beginPendingSubmit(state, runId, text);
				noteLocalRunId?.(runId);
				setActivityStatus("sending");
			} else noteLocalBtwRunId?.(runId);
			tui.requestRender();
			const sendResult = await client.sendChat({
				sessionKey: sendSelection.sessionKey,
				...!parseAgentSessionKey(sendSelection.sessionKey) ? { agentId: sendSelection.agentId } : {},
				sessionId: sendSessionId,
				message: text,
				thinking: opts.thinking,
				deliver: deliverDefault,
				timeoutMs,
				runId
			});
			const acceptedRunId = sendResult.runId || runId;
			const terminalAckStatus = normalizeTerminalChatSendAckStatus(sendResult.status);
			const terminalAckFailure = terminalAckStatus === "timeout" || terminalAckStatus === "error";
			const terminalAck = terminalAckStatus !== void 0;
			if (!isCurrentSendViewport()) {
				if (isBtw) {
					forgetLocalBtwRunId?.(runId);
					if (acceptedRunId !== runId) forgetLocalBtwRunId?.(acceptedRunId);
				} else {
					forgetLocalRunId?.(runId);
					if (acceptedRunId !== runId) forgetLocalRunId?.(acceptedRunId);
					clearPendingSubmit(state, runId);
					clearPendingSubmit(state, acceptedRunId);
					consumeCompletedRunForPendingSend?.(acceptedRunId);
				}
				return;
			}
			if (isBtw && terminalAck) {
				forgetLocalBtwRunId?.(runId);
				if (acceptedRunId !== runId) forgetLocalBtwRunId?.(acceptedRunId);
				if (terminalAckFailure) chatLog.addSystem(`btw failed: ${TERMINAL_CHAT_SEND_FAILURE_MESSAGE}`);
				tui.requestRender();
				return;
			}
			if (isBtw) {
				if (acceptedRunId !== runId) {
					forgetLocalBtwRunId?.(runId);
					noteLocalBtwRunId?.(acceptedRunId);
				}
				return;
			}
			if (!isBtw) {
				const acknowledgedProjection = reduceTuiSessionProjection(state, {
					type: "sendAcknowledged",
					runId: acceptedRunId,
					previousRunId: runId,
					scope: sendScope
				});
				const acceptedRunAlreadyCompleted = acceptedRunId !== runId && !terminalAck && (consumeCompletedRunForPendingSend?.(acceptedRunId) ?? false);
				acceptPendingSubmit({
					state,
					provisionalRunId: runId,
					acceptedRunId,
					preserveDraft: !(isRunObserved?.(acceptedRunId) || terminalAck)
				});
				if (acceptedRunId !== runId) {
					forgetLocalRunId?.(runId);
					if (!acceptedRunAlreadyCompleted && !terminalAck) noteLocalRunId?.(acceptedRunId);
					if (acknowledgedProjection.entries.some((entry) => entry.pending && entry.pendingRunId === acceptedRunId)) chatLog.rekeyPendingUser(runId, acceptedRunId);
					else chatLog.dropPendingUser(runId);
				}
				if (terminalAck) {
					clearPendingSubmit(state, acceptedRunId);
					forgetLocalRunId?.(acceptedRunId);
					if (terminalAckFailure) {
						reduceTuiSessionProjection(state, {
							type: "sendFailed",
							runId: acceptedRunId,
							scope: sendScope
						});
						chatLog.dropPendingUser(acceptedRunId);
					}
					if (state.activeChatRunId === acceptedRunId) state.activeChatRunId = null;
					await loadHistory();
					if (!isCurrentSendViewport()) return;
					if (terminalAckFailure) {
						chatLog.addSystem(`send failed: ${TERMINAL_CHAT_SEND_FAILURE_MESSAGE}`);
						setActivityStatus("error");
					} else setActivityStatus("idle");
					tui.requestRender();
					return;
				}
				if (hasPendingSubmit(state)) {
					if (acceptedRunAlreadyCompleted) {
						clearPendingSubmit(state, acceptedRunId);
						setActivityStatus("idle");
						flushPendingHistoryRefreshIfIdle?.();
					} else setActivityStatus("waiting");
					tui.requestRender();
				}
			}
		} catch (err) {
			if (isBtw) forgetLocalBtwRunId?.(runId);
			else forgetLocalRunId?.(runId);
			if (!isCurrentSendViewport()) {
				clearPendingSubmit(state, runId);
				return;
			}
			if (!isBtw && state.activeChatRunId === runId) forgetLocalRunId?.(state.activeChatRunId);
			if (!isBtw) {
				if (state.activeChatRunId === runId) state.activeChatRunId = null;
				clearPendingSubmit(state, runId);
				reduceTuiSessionProjection(state, {
					type: "sendFailed",
					runId,
					scope: sendScope
				});
				chatLog.dropPendingUser(runId);
			}
			chatLog.addSystem(`${isBtw ? "btw failed" : "send failed"}: ${formatTuiErrorMessage(err)}`);
			if (!isBtw) setActivityStatus("error");
			tui.requestRender();
		}
	};
	return {
		handleCommand,
		sendMessage,
		captureMessageAdmission,
		resolveMessageAdmission,
		reportBlockedMessageSubmit,
		openModelSelector,
		openAgentSelector,
		openSessionSelector,
		openSettings,
		setAgent
	};
}
//#endregion
//#region src/tui/tui-session-events.ts
/** Reads the durable user identity without mistaking another run's prompt for this one. */
function readTuiSessionUserMessage(event) {
	const message = event.message;
	if (!message || typeof message !== "object" || Array.isArray(message)) return null;
	const record = message;
	const identity = readSessionMessageIdentity(message, event);
	if (identity?.role !== "user") return null;
	const persistedSequence = readSessionMessageSequence(message);
	const messageId = identity.isImported ? identity.externalSource ? `external:${identity.externalSource}` : persistedSequence !== null ? `imported-seq:${persistedSequence}` : null : identity.id ?? (identity.sequence !== null ? `seq:${identity.sequence}` : null);
	const text = extractTextFromMessage(record);
	if (!messageId || !text) return null;
	const images = extractTuiImageSources(message);
	return {
		messageId,
		text,
		...identity.runId ? { runId: identity.runId } : {},
		...identity.sendId ? { sendId: identity.sendId } : {},
		...images.length > 0 ? { images } : {}
	};
}
/** Preserves opaque peer IDs while guarding canonical, global, and alias ownership. */
function matchesSelectedTuiSession(state, event, options) {
	const legacyOwner = normalizeLowercaseStringOrEmpty(event.sessionKey) === "global" || options?.requireAliasOwnership ? state.agentDefaultId : state.currentAgentId;
	return matchesOwnedTuiSession(state.currentSessionKey, state.currentAgentId, event, legacyOwner);
}
/** Compare qualified identities without accepting contradictory owner claims. */
function matchesOwnedTuiSession(session, agentId, event, legacyOwnerAgentId) {
	const owner = normalizeLowercaseStringOrEmpty(event.agentId);
	const selected = normalizeLowercaseStringOrEmpty(agentId);
	return (parseAgentSessionKey(event.sessionKey)?.agentId || owner || normalizeLowercaseStringOrEmpty(legacyOwnerAgentId)) === selected && (!owner || owner === selected) && Boolean(event.sessionKey?.trim() && session.trim()) && toAgentStoreSessionKey({
		requestKey: event.sessionKey,
		agentId: selected
	}) === toAgentStoreSessionKey({
		requestKey: session,
		agentId: selected
	});
}
//#endregion
//#region src/tui/tui-run-lifecycle.ts
const DEFAULT_STREAMING_WATCHDOG_MS = 3e4;
const LIFECYCLE_ERROR_RETRY_GRACE_MS = 15e3;
const STREAMING_WATCHDOG_USER_MESSAGE = "This response is taking longer than expected. Still waiting for the current run.";
/** Gives session resets, concurrent runs, and reconnects one lifecycle owner. */
function createTuiRunLifecycle(context) {
	const { state, runCoordinator, chatLog, btw, tui, setActivityStatus, refreshSessionInfo, isLocalRunId, forgetLocalRunId, clearLocalRunIds, clearLocalBtwRunIds, localMode } = context;
	const { sessionRuns, liveTerminalErrorMessages } = runCoordinator;
	const pendingTerminalLifecycleErrors = /* @__PURE__ */ new Map();
	const streamingWatchdogMs = typeof context.streamingWatchdogMs === "number" && Number.isFinite(context.streamingWatchdogMs) && context.streamingWatchdogMs >= 0 ? Math.floor(context.streamingWatchdogMs) : DEFAULT_STREAMING_WATCHDOG_MS;
	let lastSessionKey = state.currentSessionKey;
	let reconnectPendingRunId = null;
	let streamingWatchdogTimer = null;
	let streamingWatchdogRunId = null;
	const flushPendingHistoryRefreshIfIdle = () => {
		if (state.activeChatRunId || hasPendingSubmit(state)) return;
		if (!runCoordinator.pendingHistoryRefresh) return;
		runCoordinator.pendingHistoryRefresh = false;
		runCoordinator.queueHistoryReload();
	};
	const clearStreamingWatchdog = () => {
		if (streamingWatchdogTimer) {
			clearTimeout(streamingWatchdogTimer);
			streamingWatchdogTimer = null;
		}
		streamingWatchdogRunId = null;
	};
	const clearPendingTerminalLifecycleError = (runId) => {
		const pending = pendingTerminalLifecycleErrors.get(runId);
		if (!pending) return;
		clearTimeout(pending.timer);
		pendingTerminalLifecycleErrors.delete(runId);
	};
	const clearPendingTerminalLifecycleErrors = () => {
		for (const pending of pendingTerminalLifecycleErrors.values()) clearTimeout(pending.timer);
		pendingTerminalLifecycleErrors.clear();
	};
	const clearTrackedRunState = () => {
		runCoordinator.clear();
		clearPendingSubmit(state);
		reconnectPendingRunId = null;
		clearLocalRunIds?.();
		clearLocalBtwRunIds?.();
		clearPendingTerminalLifecycleErrors();
		btw.clear();
		clearStreamingWatchdog();
	};
	const armStreamingWatchdog = (runId) => {
		if (streamingWatchdogMs <= 0) return;
		if (streamingWatchdogTimer) clearTimeout(streamingWatchdogTimer);
		streamingWatchdogRunId = runId;
		streamingWatchdogTimer = setTimeout(() => {
			streamingWatchdogTimer = null;
			if (streamingWatchdogRunId !== runId || state.activeChatRunId !== runId) return;
			streamingWatchdogRunId = null;
			if (reconnectPendingRunId === runId) {
				reconnectPendingRunId = null;
				state.activeChatRunId = null;
				state.activityStatus = "idle";
				setActivityStatus("idle");
				runCoordinator.pendingHistoryRefresh = false;
				runCoordinator.queueHistoryReload();
				tui.requestRender();
				return;
			}
			chatLog.addPendingSystem(runId, STREAMING_WATCHDOG_USER_MESSAGE);
			tui.requestRender();
		}, streamingWatchdogMs);
		streamingWatchdogTimer.unref?.();
	};
	const syncSessionKey = () => {
		if (state.currentSessionKey === lastSessionKey) return;
		lastSessionKey = state.currentSessionKey;
		if (!state.activeChatRunId && !hasPendingSubmit(state)) clearTrackedRunState();
	};
	const resolveAuthErrorHint = (errorMessage) => {
		if (!localMode || !isAuthErrorMessage(errorMessage)) return;
		const provider = state.sessionInfo.modelProvider?.trim();
		const failoverReason = classifyFailoverReasonCore(errorMessage, { provider });
		if (failoverReason === "billing" || failoverReason === "rate_limit") return;
		return provider ? `auth or provider access failed for ${provider}. Run /auth ${provider} to refresh credentials; if you already re-authed, switch models/providers because this account may still be blocked for inference.` : "auth or provider access failed for the current provider. Run /auth to refresh credentials; if you already re-authed, switch models/providers because this account may still be blocked for inference.";
	};
	const applyFallbackStepModelUpdate = (event) => {
		const data = event.data ?? {};
		if (event.stream !== "lifecycle" || formatPrimitiveString(data.phase, "") !== "fallback_step") return false;
		const modelRef = formatPrimitiveString(data.fallbackStepToModel).trim();
		const separator = modelRef.indexOf("/");
		if (separator <= 0 || separator >= modelRef.length - 1) return false;
		const provider = modelRef.slice(0, separator).trim();
		const model = modelRef.slice(separator + 1).trim();
		if (!provider || !model) return false;
		state.sessionInfo.modelProvider = provider;
		state.sessionInfo.model = model;
		return true;
	};
	const markSubmittedRunRegistered = (runId) => {
		clearPendingSubmitDraft(state, runId);
	};
	const acknowledgeChatRun = (runId, options) => {
		if (reconnectPendingRunId === runId) reconnectPendingRunId = null;
		clearPendingTerminalLifecycleError(runId);
		chatLog.dismissPendingSystem(runId);
		runCoordinator.noteSessionRun(runId, options);
		markSubmittedRunRegistered(runId);
	};
	const clearActiveRunIfMatch = (runId) => {
		if (state.activeChatRunId === runId) state.activeChatRunId = null;
	};
	const promoteMostRecentSessionRun = () => {
		if (state.activeChatRunId) return false;
		const nextRunId = runCoordinator.resolveMostRecentPromotableRun();
		if (!nextRunId) return false;
		state.activeChatRunId = nextRunId;
		clearStreamingWatchdog();
		setActivityStatus("running");
		armStreamingWatchdog(nextRunId);
		return true;
	};
	const clearStaleStreamingIfNoTrackedRunRemains = (event) => {
		const authoritativeIdle = Array.isArray(event?.activeRunIds) && event.activeRunIds.length === 0 && matchesSelectedTuiSession(state, event, { requireAliasOwnership: true }) && (typeof event.sessionId !== "string" || !state.currentSessionId || event.sessionId === state.currentSessionId);
		if (event && !authoritativeIdle || !event && (state.activityStatus !== "streaming" || sessionRuns.size > 0)) return;
		if (authoritativeIdle) {
			for (const runId of sessionRuns.keys()) runCoordinator.dropSessionRun(runId);
			if (state.activeChatRunId) chatLog.dismissPendingSystem(state.activeChatRunId);
			reconnectPendingRunId = null;
		}
		state.activeChatRunId = null;
		if (!hasPendingSubmit(state)) state.activityStatus = "idle";
		setActivityStatus(state.activityStatus);
		clearStreamingWatchdog();
		flushPendingHistoryRefreshIfIdle();
	};
	const reconnectStreamingWatchdog = (runOutcome) => {
		clearStreamingWatchdog();
		const activeRunId = state.activeChatRunId;
		if (!activeRunId) {
			reconnectPendingRunId = null;
			clearStaleStreamingIfNoTrackedRunRemains();
			return;
		}
		if (runOutcome && runOutcome.state !== "active") {
			if (runOutcome.state === "failed") {
				runCoordinator.notePersistedRun(activeRunId);
				renderTerminalRunError({
					runId: activeRunId,
					errorMessage: runOutcome.errorMessage
				});
				return;
			}
			if (runOutcome.state === "interrupted") {
				chatLog.addSystem("run aborted");
				liveTerminalErrorMessages.set(activeRunId, "run aborted");
			}
			runCoordinator.notePersistedRun(activeRunId);
			clearPendingTerminalLifecycleError(activeRunId);
			finalizeRun({
				runId: activeRunId,
				wasActiveRun: true,
				status: "idle",
				displayedFinal: runOutcome.state === "interrupted"
			});
			return;
		}
		reconnectPendingRunId = activeRunId;
		setActivityStatus("streaming");
		armStreamingWatchdog(activeRunId);
	};
	const finalizeRun = (params) => {
		runCoordinator.noteFinalizedRun(params.runId, { displayedFinal: params.displayedFinal });
		clearActiveRunIfMatch(params.runId);
		const promotedRemainingRun = promoteMostRecentSessionRun();
		flushPendingHistoryRefreshIfIdle();
		if (!promotedRemainingRun) {
			if (params.wasActiveRun) {
				setActivityStatus(params.status);
				clearStreamingWatchdog();
			} else {
				if (streamingWatchdogRunId === params.runId) clearStreamingWatchdog();
				clearStaleStreamingIfNoTrackedRunRemains();
			}
		}
		refreshSessionInfo?.();
	};
	const terminateRun = (params) => {
		runCoordinator.noteCompletedRun(params.runId);
		runCoordinator.dropSessionRun(params.runId);
		clearActiveRunIfMatch(params.runId);
		const promotedRemainingRun = promoteMostRecentSessionRun();
		flushPendingHistoryRefreshIfIdle();
		if (!promotedRemainingRun) {
			if (params.wasActiveRun) {
				setActivityStatus(params.status);
				clearStreamingWatchdog();
			} else if (streamingWatchdogRunId === params.runId) clearStreamingWatchdog();
		}
		refreshSessionInfo?.();
	};
	const hasConcurrentActiveRun = (runId) => {
		const activeRunId = state.activeChatRunId;
		return Boolean(activeRunId && activeRunId !== runId);
	};
	const maybeRefreshHistoryForRun = (runId, options) => {
		const isPendingChatRun = options?.wasPendingChatRun === true || getPendingSubmitAcceptedRunId(state) === runId;
		if (isLocalRunId?.(runId) ?? false) {
			forgetLocalRunId?.(runId);
			if (!options?.allowLocalWithoutDisplayableFinal) return;
			if (state.activeChatRunId && state.activeChatRunId !== runId) {
				runCoordinator.pendingHistoryRefresh = true;
				return;
			}
		}
		if (!isPendingChatRun && hasPendingSubmit(state)) {
			runCoordinator.pendingHistoryRefresh = true;
			return;
		}
		if (options?.hasDisplayableFinal || hasConcurrentActiveRun(runId)) return;
		runCoordinator.pendingHistoryRefresh = false;
		runCoordinator.queueHistoryReload();
	};
	const renderTerminalRunError = (params) => {
		const { runId, errorMessage } = params;
		const wasActiveRun = state.activeChatRunId === runId;
		if (params.requireActiveOrPending && !wasActiveRun && getPendingSubmitAcceptedRunId(state) !== runId) return false;
		const renderedError = formatRawAssistantErrorForUi(errorMessage);
		chatLog.dismissPendingSystem(runId);
		const displayMessage = resolveAuthErrorHint(errorMessage) ?? `run error: ${renderedError}`;
		liveTerminalErrorMessages.set(runId, displayMessage);
		chatLog.addSystem(displayMessage);
		runCoordinator.noteFinalizedRun(runId, { displayedFinal: true });
		terminateRun({
			runId,
			wasActiveRun,
			status: "error"
		});
		maybeRefreshHistoryForRun(runId, { hasDisplayableFinal: true });
		return true;
	};
	const scheduleTerminalLifecycleError = (runId, errorMessage) => {
		clearPendingTerminalLifecycleError(runId);
		const timer = setTimeout(() => {
			pendingTerminalLifecycleErrors.delete(runId);
			if (renderTerminalRunError({
				runId,
				errorMessage,
				requireActiveOrPending: true
			})) tui.requestRender(true);
		}, LIFECYCLE_ERROR_RETRY_GRACE_MS);
		timer.unref?.();
		pendingTerminalLifecycleErrors.set(runId, {
			errorMessage,
			timer
		});
	};
	const dispose = () => {
		clearTrackedRunState();
	};
	return {
		acknowledgeChatRun,
		applyFallbackStepModelUpdate,
		armStreamingWatchdog,
		clearPendingTerminalLifecycleError,
		clearStreamingWatchdog,
		clearStaleStreamingIfNoTrackedRunRemains,
		clearTrackedRunState,
		dispose,
		finalizeRun,
		flushPendingHistoryRefreshIfIdle,
		hasConcurrentActiveRun,
		markSubmittedRunRegistered,
		maybeRefreshHistoryForRun,
		pauseStreamingWatchdog: clearStreamingWatchdog,
		reconnectStreamingWatchdog,
		renderTerminalRunError,
		scheduleTerminalLifecycleError,
		syncSessionKey,
		terminateRun
	};
}
//#endregion
//#region src/tui/coalesced-refresh.ts
/** Keeps refresh bursts to one active lookup plus one latest-state rerun. */
function createTuiRefreshCoalescer(refresh, afterDrain) {
	let active;
	let rerunRequested = false;
	const requestRerun = () => {
		rerunRequested = true;
	};
	return {
		isRunning: () => active !== void 0,
		async run() {
			if (active) {
				requestRerun();
				return await active;
			}
			const current = (async () => {
				do {
					rerunRequested = false;
					if (await refresh(requestRerun) === false) return;
				} while (rerunRequested);
				afterDrain?.();
			})();
			active = current;
			try {
				await current;
			} finally {
				if (active === current) active = void 0;
			}
		}
	};
}
//#endregion
//#region src/tui/tui-stream-assembler.ts
const MAX_TRACKED_STREAM_RUNS = 200;
/** Assembles assistant stream deltas and final messages into stable TUI display text. */
var TuiStreamAssembler = class {
	constructor(isProtectedRun) {
		this.isProtectedRun = isProtectedRun;
		this.runs = /* @__PURE__ */ new Map();
	}
	createRunState() {
		return {
			thinkingText: "",
			contentText: "",
			displayText: ""
		};
	}
	getTrackedRun(runId) {
		const existing = this.runs.get(runId);
		if (existing) {
			this.runs.delete(runId);
			this.runs.set(runId, existing);
			return existing;
		}
		const state = this.createRunState();
		this.runs.set(runId, state);
		if (this.runs.size > MAX_TRACKED_STREAM_RUNS) for (const trackedRunId of this.runs.keys()) {
			if (this.runs.size <= MAX_TRACKED_STREAM_RUNS) break;
			if (!this.isProtectedRun?.(trackedRunId)) this.runs.delete(trackedRunId);
		}
		return state;
	}
	updateRunState(state, message, showThinking) {
		const thinkingText = extractThinkingFromMessage(message);
		const contentText = extractContentFromMessage(message);
		if (thinkingText) state.thinkingText = thinkingText;
		if (contentText) state.contentText = contentText;
		state.displayText = composeThinkingAndContent({
			thinkingText: state.thinkingText,
			contentText: state.contentText,
			showThinking
		});
	}
	/** Ingests a streaming delta and returns updated display text only when it changed. */
	ingestDelta(runId, message, showThinking) {
		const state = this.getTrackedRun(runId);
		const previousDisplayText = state.displayText;
		this.updateRunState(state, message, showThinking);
		if (!state.displayText || state.displayText === previousDisplayText) return null;
		return state.displayText;
	}
	/** Reports whether a run already has real displayable streamed content. */
	hasDisplayText(runId) {
		return Boolean(this.runs.get(runId)?.displayText);
	}
	/** Finalizes a run, combines any error text, and drops stored stream state. */
	finalize(runId, message, showThinking, errorMessage) {
		const state = this.runs.get(runId) ?? this.createRunState();
		const streamedContentText = state.contentText;
		this.updateRunState(state, message, showThinking);
		const responseText = resolveFinalAssistantText({
			finalText: state.contentText,
			streamedText: streamedContentText,
			errorMessage,
			message
		});
		const omitEmptyPlaceholder = responseText === "(no output)" && Boolean(state.thinkingText);
		const finalText = composeThinkingAndContent({
			thinkingText: state.thinkingText,
			contentText: omitEmptyPlaceholder ? "" : responseText,
			showThinking
		});
		this.runs.delete(runId);
		return finalText || "(no output)";
	}
	/** Drops stored stream state for an aborted or discarded run. */
	drop(runId) {
		this.runs.delete(runId);
	}
	/** Clears stream fragments when the selected conversation changes. */
	clear() {
		this.runs.clear();
	}
};
//#endregion
//#region src/tui/tui-session-run-coordinator.ts
const MAX_TRACKED_RUNS = 200;
const RETAINED_TRACKED_RUNS = 150;
const TRACKED_RUN_RETENTION_MS = 6e5;
const HISTORY_RELOAD_QUEUED = 1;
const HISTORY_RELOAD_OWNED = 2;
const HISTORY_RELOAD_DISPLAYED = 4;
const HISTORY_RELOAD_GAP_RECOVERY = 8;
/** A small FIFO membership tracker for run IDs that need no lifecycle metadata. */
function createTuiRunIdTracker() {
	const runIds = /* @__PURE__ */ new Set();
	return {
		note: (runId) => {
			if (runId) runIds.add(runId);
			if (runIds.size > MAX_TRACKED_RUNS) runIds.delete(runIds.values().next().value);
		},
		forget: (runId) => void runIds.delete(runId),
		has: (runId) => runIds.has(runId),
		clear: () => runIds.clear()
	};
}
/** Keeps one session's run, persistence, and transcript ownership together. */
var TuiSessionRunCoordinator = class {
	constructor(context) {
		this.context = context;
		this.sessionRuns = /* @__PURE__ */ new Map();
		this.finalizedRuns = /* @__PURE__ */ new Map();
		this.finalizedRunsWithDisplay = /* @__PURE__ */ new Map();
		this.pendingNewSessionRunIds = /* @__PURE__ */ new Set();
		this.persistedTerminalRunIds = /* @__PURE__ */ new Map();
		this.liveTerminalErrorMessages = /* @__PURE__ */ new Map();
		this.completedRuns = /* @__PURE__ */ new Map();
		this.postFinalizingRuns = /* @__PURE__ */ new Map();
		this.pendingHistoryRefresh = false;
		this.historyReloadRuns = /* @__PURE__ */ new Map();
		this.confirmedStreamRunIds = /* @__PURE__ */ new Set();
		this.rejectUnconfirmedRuns = false;
		this.historyReloadRunner = createTuiRefreshCoalescer(() => this.drainHistoryReloadQueue());
		this.historyReloadQueued = false;
		this.historyReloadGeneration = 0;
		this.streamAssembler = new TuiStreamAssembler((runId) => {
			return runId === this.context.state.activeChatRunId || runId === getPendingSubmitAcceptedRunId(this.context.state) || this.confirmedStreamRunIds.has(runId);
		});
	}
	pruneRunMap(runs, protectActiveRun = false) {
		if (runs.size <= MAX_TRACKED_RUNS) return;
		const keepUntil = Date.now() - TRACKED_RUN_RETENTION_MS;
		const canRemove = (runId) => !protectActiveRun || runId !== this.context.state.activeChatRunId && runId !== getPendingSubmitAcceptedRunId(this.context.state) && !this.confirmedStreamRunIds.has(runId);
		for (const [runId, observation] of runs) {
			if (runs.size <= RETAINED_TRACKED_RUNS) break;
			if ((typeof observation === "number" ? observation : observation.seenAt) < keepUntil && canRemove(runId)) runs.delete(runId);
		}
		if (runs.size <= MAX_TRACKED_RUNS) return;
		for (const runId of runs.keys()) {
			if (canRemove(runId)) runs.delete(runId);
			if (runs.size <= RETAINED_TRACKED_RUNS) break;
		}
	}
	noteSessionRun(runId, options) {
		const confirmedRun = options?.protectStream === true || runId === getPendingSubmitAcceptedRunId(this.context.state);
		if (!confirmedRun && this.isRetiredOrphanRun(runId)) return;
		if (confirmedRun) {
			this.confirmedStreamRunIds.add(runId);
			if (this.confirmedStreamRunIds.size > MAX_TRACKED_RUNS) {
				for (const protectedRunId of this.confirmedStreamRunIds) if (protectedRunId !== this.context.state.activeChatRunId && protectedRunId !== getPendingSubmitAcceptedRunId(this.context.state)) {
					this.confirmedStreamRunIds.delete(protectedRunId);
					break;
				}
			}
		}
		this.sessionRuns.set(runId, { seenAt: Date.now() });
		this.pruneRunMap(this.sessionRuns, true);
	}
	isRetiredOrphanRun(runId) {
		return this.rejectUnconfirmedRuns && !this.sessionRuns.has(runId);
	}
	isHistoryTerminalDiagnosticRun(runId) {
		return this.finalizedRuns.has(runId) && this.persistedTerminalRunIds.has(runId) && this.liveTerminalErrorMessages.has(runId);
	}
	resolveMostRecentPromotableRun() {
		const pendingRunId = getPendingSubmitAcceptedRunId(this.context.state);
		let nextRunId;
		let nextSeenAt = -1;
		let unconfirmedRunId;
		let unconfirmedSeenAt = -1;
		for (const [runId, { seenAt }] of this.sessionRuns) {
			if (runId !== pendingRunId && !this.confirmedStreamRunIds.has(runId)) {
				if (seenAt > unconfirmedSeenAt) {
					unconfirmedRunId = runId;
					unconfirmedSeenAt = seenAt;
				}
				continue;
			}
			if (seenAt > nextSeenAt) {
				nextRunId = runId;
				nextSeenAt = seenAt;
			}
		}
		return nextRunId ?? unconfirmedRunId;
	}
	forgetSessionRun(runId) {
		this.sessionRuns.delete(runId);
		const completedConfirmedRun = this.confirmedStreamRunIds.delete(runId);
		this.streamAssembler.drop(runId);
		return completedConfirmedRun;
	}
	captureHistoryRunMembership() {
		const generation = this.historyReloadGeneration;
		const observations = Array.from(this.sessionRuns, ([runId, observation]) => ({
			runId,
			observation,
			deferredEvent: this.historyReloadRuns.get(runId)?.deferredEvent
		}));
		return (activeRunIds) => {
			if (!activeRunIds || generation !== this.historyReloadGeneration) return;
			const active = new Set(activeRunIds);
			for (const { runId, observation, deferredEvent } of observations) if (!active.has(runId) && runId !== this.context.state.activeChatRunId && runId !== this.context.state.pendingSubmit?.runId && this.sessionRuns.get(runId) === observation && this.historyReloadRuns.get(runId)?.deferredEvent === deferredEvent) this.forgetSessionRun(runId);
		};
	}
	dropSessionRun(runId) {
		if (this.forgetSessionRun(runId) && this.confirmedStreamRunIds.size === 0) {
			this.rejectUnconfirmedRuns = true;
			const activeRunId = this.context.state.activeChatRunId;
			const pendingRunId = getPendingSubmitAcceptedRunId(this.context.state);
			for (const candidateRunId of this.sessionRuns.keys()) {
				if (candidateRunId === activeRunId || candidateRunId === pendingRunId) continue;
				this.forgetSessionRun(candidateRunId);
			}
		}
	}
	noteCompletedRun(runId) {
		this.completedRuns.set(runId, Date.now());
		this.pruneRunMap(this.completedRuns);
	}
	noteFinalizedRun(runId, options) {
		this.finalizedRuns.set(runId, Date.now());
		this.noteCompletedRun(runId);
		if (options?.displayedFinal) this.finalizedRunsWithDisplay.set(runId, Date.now());
		this.dropSessionRun(runId);
		this.pruneRunMap(this.finalizedRuns);
		this.pruneRunMap(this.finalizedRunsWithDisplay);
		for (const retainedRunId of this.liveTerminalErrorMessages.keys()) if (!this.finalizedRunsWithDisplay.has(retainedRunId)) this.liveTerminalErrorMessages.delete(retainedRunId);
	}
	notePostFinalizingRun(runId) {
		this.postFinalizingRuns.set(runId, Date.now());
		this.pruneRunMap(this.postFinalizingRuns);
	}
	notePersistedRun(runId) {
		this.persistedTerminalRunIds.set(runId, Date.now());
		this.pruneRunMap(this.persistedTerminalRunIds);
	}
	collectTrackedSessionRunIds() {
		const runIds = new Set(this.sessionRuns.keys());
		const state = this.context.state;
		if (state.activeChatRunId) runIds.add(state.activeChatRunId);
		const pendingRunId = getPendingSubmitAcceptedRunId(state);
		if (pendingRunId) runIds.add(pendingRunId);
		const finalizedRunIds = new Set(this.finalizedRuns.keys());
		const displayedRunIds = new Set(this.finalizedRunsWithDisplay.keys());
		for (const runId of finalizedRunIds) runIds.add(runId);
		return {
			runIds,
			finalizedRunIds,
			displayedRunIds
		};
	}
	routeSessionMessageRefresh(projected) {
		if (projected) return true;
		if (this.context.state.activeChatRunId || hasPendingSubmit(this.context.state)) {
			this.pendingHistoryRefresh = true;
			return true;
		}
		this.queueHistoryReload();
		return false;
	}
	isHistoryReloadingRun(runId) {
		return this.historyReloadRuns.has(runId);
	}
	deferHistoryRunEvent(event) {
		const reload = this.historyReloadRuns.get(event.runId);
		if (!reload) return;
		const previous = reload.deferredEvent;
		if (!previous || previous.state === "delta" || event.state !== "delta") reload.deferredEvent = event;
	}
	async loadHistoryPreservingTerminalErrors() {
		const generation = this.historyReloadGeneration;
		const result = await this.context.loadHistory() ?? { loaded: false };
		if (!result.loaded || generation !== this.historyReloadGeneration) return result;
		let restored = false;
		for (const [runId, message] of this.liveTerminalErrorMessages) if (this.finalizedRunsWithDisplay.has(runId)) {
			this.context.restoreTerminalError(message);
			restored = true;
		}
		if (restored) this.context.requestRender(true);
		return result;
	}
	async drainHistoryReloadQueue() {
		if (!this.historyReloadQueued) return;
		const generation = this.historyReloadGeneration;
		const reloads = [];
		for (const [runId, reload] of this.historyReloadRuns) if (reload.flags & HISTORY_RELOAD_QUEUED) {
			reloads.push({
				runId,
				flags: reload.flags,
				deferredEvent: reload.deferredEvent,
				observation: this.sessionRuns.get(runId)
			});
			reload.flags = 0;
		}
		this.historyReloadQueued = false;
		const finishReload = (result) => {
			if (generation !== this.historyReloadGeneration) return;
			for (const { runId, flags, deferredEvent, observation } of reloads) {
				const current = this.historyReloadRuns.get(runId);
				if (!current || current.flags & HISTORY_RELOAD_QUEUED) continue;
				this.historyReloadRuns.delete(runId);
				const deferred = current.deferredEvent;
				const historyOwned = Boolean(flags & HISTORY_RELOAD_OWNED);
				const previouslyDisplayed = Boolean(flags & HISTORY_RELOAD_DISPLAYED);
				const gapRecovery = Boolean(flags & HISTORY_RELOAD_GAP_RECOVERY);
				const restoredInFlight = result.loaded && (result.activeRunIds?.includes(runId) ?? (result.runOutcome.state === "active" && (gapRecovery || result.runOutcome.runId === runId)));
				const observedDuringReload = gapRecovery && (this.sessionRuns.has(runId) && this.sessionRuns.get(runId) !== observation || deferred?.state === "delta" && deferred !== deferredEvent);
				if (historyOwned && !restoredInFlight && !observedDuringReload && (result.loaded || !gapRecovery)) this.context.finalizeHistoryOwnedRun({
					runId,
					result,
					previouslyDisplayed
				});
				if (deferred && (!result.loaded || historyOwned || restoredInFlight)) this.context.replayHistoryRunEvent(deferred);
			}
		};
		await this.loadHistoryPreservingTerminalErrors().then(finishReload, () => finishReload({ loaded: false }));
	}
	/** Settle the complete queue and report whether this caller's session owner survived. */
	queueHistoryReload(runIds, historyOwnedRunIds = [], displayedRunIds = []) {
		const generation = this.historyReloadGeneration;
		const isCurrent = () => generation === this.historyReloadGeneration;
		const historyOwned = new Set(historyOwnedRunIds);
		const displayed = new Set(displayedRunIds);
		const queuedRunIds = runIds ?? [];
		if (runIds === void 0) this.historyReloadQueued = true;
		for (const runId of queuedRunIds) {
			this.historyReloadQueued = true;
			const reload = this.historyReloadRuns.get(runId) ?? { flags: 0 };
			reload.flags |= HISTORY_RELOAD_QUEUED;
			if (historyOwned.has(runId)) reload.flags |= HISTORY_RELOAD_OWNED;
			if (displayed.has(runId)) reload.flags |= HISTORY_RELOAD_DISPLAYED;
			this.historyReloadRuns.set(runId, reload);
		}
		if (!this.historyReloadQueued && !this.historyReloadRunner.isRunning()) return Promise.resolve(isCurrent());
		return this.historyReloadRunner.run().then(isCurrent);
	}
	queueGapHistoryReload(runIds, displayedRunIds = []) {
		const trackedRunIds = Array.from(runIds);
		if (trackedRunIds.length === 0) {
			this.queueHistoryReload();
			return;
		}
		for (const runId of trackedRunIds) {
			const reload = this.historyReloadRuns.get(runId) ?? { flags: 0 };
			reload.flags |= HISTORY_RELOAD_GAP_RECOVERY;
			this.historyReloadRuns.set(runId, reload);
		}
		this.queueHistoryReload(trackedRunIds, trackedRunIds, displayedRunIds);
	}
	clear() {
		this.historyReloadGeneration += 1;
		this.sessionRuns.clear();
		this.finalizedRuns.clear();
		this.finalizedRunsWithDisplay.clear();
		this.pendingNewSessionRunIds.clear();
		this.persistedTerminalRunIds.clear();
		this.liveTerminalErrorMessages.clear();
		this.completedRuns.clear();
		this.postFinalizingRuns.clear();
		this.historyReloadRuns.clear();
		this.confirmedStreamRunIds.clear();
		this.rejectUnconfirmedRuns = false;
		this.historyReloadQueued = false;
		this.pendingHistoryRefresh = false;
		this.streamAssembler.clear();
	}
};
//#endregion
//#region src/tui/tui-tool-activity.ts
const liveActivitySchema = Type.Object(AgentActivityItemSchema.properties, { additionalProperties: true });
function renderTuiActivityItem(params) {
	const item = params.event.data;
	if (!Value.Check(liveActivitySchema, item) || (params.verboseLevel ?? "off") === "off" || item.kind === "preamble" || item.suppressChannelProgress) return false;
	params.chatLog.startTool(item.toolCallId ?? item.itemId, item.name ?? item.title, void 0, params.event.runId, item);
	return true;
}
function renderTuiHistoryToolResult(params) {
	const { chatLog, message, items, verboseLevel } = params;
	const toolCallId = formatPrimitiveString(message.toolCallId, "");
	const toolName = formatPrimitiveString(message.toolName, "tool");
	const activity = items?.find((item) => item.toolCallId === toolCallId) ?? (items ? null : void 0);
	(activity === void 0 ? chatLog.startTool(toolCallId, toolName, {}) : chatLog.startTool(toolCallId, toolName, {}, void 0, activity)).setResult(verboseLevel === "full" ? {
		content: Array.isArray(message.content) ? message.content : [],
		details: asOptionalObjectRecord(message.details)
	} : { content: [] }, { isError: Boolean(message.isError) });
}
//#endregion
//#region src/tui/tui-event-handlers.ts
function isFailedTuiRunStatus(status) {
	return status === "aborted" || status === "error" || status === "timeout";
}
function createEventHandlers(context) {
	const { chatLog, btw, tui, state, setActivityStatus, refreshSessionInfo, loadHistory, noteLocalRunId, isLocalRunId, forgetLocalRunId, clearLocalRunIds, isLocalBtwRunId, forgetLocalBtwRunId, clearLocalBtwRunIds, localMode } = context;
	const runCoordinator = new TuiSessionRunCoordinator({
		state,
		loadHistory,
		restoreTerminalError: (message) => chatLog.addSystem(message),
		requestRender: (force) => tui.requestRender(force),
		finalizeHistoryOwnedRun: ({ runId, result, previouslyDisplayed }) => {
			finalizeRun({
				runId,
				wasActiveRun: state.activeChatRunId === runId,
				status: "idle",
				displayedFinal: result.loaded || previouslyDisplayed
			});
		},
		replayHistoryRunEvent: (event) => handleChatEvent(event)
	});
	const { sessionRuns, finalizedRuns, finalizedRunsWithDisplay, pendingNewSessionRunIds, persistedTerminalRunIds, completedRuns, postFinalizingRuns, streamAssembler } = runCoordinator;
	const { acknowledgeChatRun, applyFallbackStepModelUpdate, armStreamingWatchdog, clearPendingTerminalLifecycleError, clearStreamingWatchdog, clearStaleStreamingIfNoTrackedRunRemains, clearTrackedRunState, dispose, finalizeRun, flushPendingHistoryRefreshIfIdle, hasConcurrentActiveRun, markSubmittedRunRegistered, maybeRefreshHistoryForRun, pauseStreamingWatchdog, reconnectStreamingWatchdog, renderTerminalRunError, scheduleTerminalLifecycleError, syncSessionKey, terminateRun } = createTuiRunLifecycle({
		state,
		runCoordinator,
		chatLog,
		btw,
		tui,
		setActivityStatus,
		refreshSessionInfo,
		isLocalRunId,
		forgetLocalRunId,
		clearLocalRunIds,
		clearLocalBtwRunIds,
		streamingWatchdogMs: context.streamingWatchdogMs,
		localMode
	});
	const handleChatEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		if (!matchesSelectedTuiSession(state, evt)) return;
		if (runCoordinator.isHistoryTerminalDiagnosticRun(evt.runId)) return;
		const isSequencedGatewayEvent = Number.isSafeInteger(evt.seq) && (evt.seq ?? -1) >= 0;
		const isOwnedLocalPendingRun = localMode && state.pendingSubmit?.runId === evt.runId && isLocalRunId?.(evt.runId) === true;
		if (runCoordinator.isRetiredOrphanRun(evt.runId) && !isSequencedGatewayEvent && !isOwnedLocalPendingRun && evt.runId !== getPendingSubmitAcceptedRunId(state)) return;
		if (runCoordinator.isHistoryReloadingRun(evt.runId)) {
			runCoordinator.deferHistoryRunEvent(evt);
			return;
		}
		const reducedRun = reduceSessionProjectionRunEvent(getTuiSessionProjection(state), evt, readTuiSessionProjectionScope(state));
		if (!reducedRun) return;
		const previousProjectedRun = reducedRun.previousRun;
		state.sessionProjection = reducedRun.projection;
		if (evt.state === "final" && isFailedTuiRunStatus(previousProjectedRun?.status)) {
			if (!(Boolean(extractTuiAbortedText(evt.message, state.showThinking).trim()) || streamAssembler.hasDisplayText(evt.runId))) {
				clearStaleStreamingIfNoTrackedRunRemains();
				return;
			}
		}
		if (evt.state === "aborted" && previousProjectedRun?.status === "aborted") {
			clearStaleStreamingIfNoTrackedRunRemains();
			return;
		}
		if (finalizedRuns.has(evt.runId)) {
			if (evt.state === "delta") return;
			if (evt.state === "error" && finalizedRunsWithDisplay.has(evt.runId)) {
				const lateError = evt.errorMessage?.trim();
				if (lateError && !runCoordinator.liveTerminalErrorMessages.has(evt.runId) && state.sessionProjection.runs[evt.runId]?.errorMessage === lateError) {
					renderTerminalRunError({
						runId: evt.runId,
						errorMessage: lateError
					});
					tui.requestRender(true);
					return;
				}
				clearStaleStreamingIfNoTrackedRunRemains();
				return;
			}
			if (evt.state === "final") {
				if (!(hasDisplayableTuiSessionFinal(evt, state.showThinking) && (!finalizedRunsWithDisplay.has(evt.runId) || !hasSessionProjectionAcceptedFinal(previousProjectedRun, evt.message)))) {
					clearStaleStreamingIfNoTrackedRunRemains();
					return;
				}
			}
		}
		acknowledgeChatRun(evt.runId, { protectStream: isSequencedGatewayEvent || isOwnedLocalPendingRun });
		const isPendingChatRun = getPendingSubmitAcceptedRunId(state) === evt.runId;
		const isLocalChatRun = isLocalRunId?.(evt.runId) ?? false;
		const isLocalBtwRun = isLocalBtwRunId?.(evt.runId) ?? false;
		if (hasPendingSubmit(state) && !isLocalBtwRun && (isPendingChatRun || isLocalChatRun && evt.runId !== state.activeChatRunId)) {
			noteLocalRunId?.(evt.runId);
			clearPendingSubmit(state, evt.runId);
		}
		if (!state.activeChatRunId && !isLocalBtwRun) state.activeChatRunId = evt.runId;
		if (isPendingChatRun) clearPendingSubmit(state, evt.runId);
		if (evt.state === "delta") {
			setActivityStatus("streaming");
			if (state.activeChatRunId === evt.runId) armStreamingWatchdog(evt.runId);
			const displayText = streamAssembler.ingestDelta(evt.runId, evt.message, state.showThinking);
			if (!displayText) return;
			chatLog.updateAssistant(displayText, evt.runId);
		}
		if (evt.state === "final") {
			const isLocalBtwRunLocal = isLocalBtwRunId?.(evt.runId) ?? false;
			const wasActiveRun = state.activeChatRunId === evt.runId;
			if (!evt.message && isLocalBtwRunLocal) {
				forgetLocalBtwRunId?.(evt.runId);
				runCoordinator.noteFinalizedRun(evt.runId);
				clearStaleStreamingIfNoTrackedRunRemains();
				tui.requestRender(true);
				return;
			}
			if (!evt.message) {
				maybeRefreshHistoryForRun(evt.runId, {
					allowLocalWithoutDisplayableFinal: true,
					wasPendingChatRun: isPendingChatRun
				});
				chatLog.dropAssistant(evt.runId);
				finalizeRun({
					runId: evt.runId,
					wasActiveRun,
					status: "idle"
				});
				tui.requestRender(true);
				return;
			}
			if (isCommandMarkedMessage(evt.message)) {
				maybeRefreshHistoryForRun(evt.runId, { wasPendingChatRun: isPendingChatRun });
				const text = extractTextFromMessage(evt.message);
				if (text) chatLog.addSystem(text);
				finalizeRun({
					runId: evt.runId,
					wasActiveRun,
					status: "idle",
					displayedFinal: true
				});
				tui.requestRender(true);
				return;
			}
			const terminalStopReason = state.sessionProjection.runs[evt.runId]?.stopReason;
			const hasStreamedText = streamAssembler.hasDisplayText(evt.runId);
			const finalText = streamAssembler.finalize(evt.runId, evt.message, state.showThinking, evt.errorMessage);
			const suppressEmptyExternalPlaceholder = finalText === "(no output)" && !isLocalRunId?.(evt.runId);
			if (!suppressEmptyExternalPlaceholder) projectTuiSessionFinal(state, evt, finalText, hasStreamedText);
			maybeRefreshHistoryForRun(evt.runId, {
				hasDisplayableFinal: !suppressEmptyExternalPlaceholder,
				wasPendingChatRun: isPendingChatRun
			});
			if (suppressEmptyExternalPlaceholder) chatLog.dropAssistant(evt.runId);
			else {
				const images = extractTuiImageSources(evt.message);
				if (images.length > 0) chatLog.finalizeAssistant(finalText, evt.runId, images);
				else chatLog.finalizeAssistant(finalText, evt.runId);
			}
			finalizeRun({
				runId: evt.runId,
				wasActiveRun,
				status: terminalStopReason === "error" ? "error" : "idle",
				displayedFinal: !suppressEmptyExternalPlaceholder
			});
		}
		if (evt.state === "aborted") {
			forgetLocalBtwRunId?.(evt.runId);
			const wasActiveRun = state.activeChatRunId === evt.runId;
			const hasDisplayableAbortedText = Boolean(extractTuiAbortedText(evt.message, state.showThinking).trim()) || streamAssembler.hasDisplayText(evt.runId);
			const abortedText = streamAssembler.finalize(evt.runId, evt.message, state.showThinking);
			if (hasDisplayableAbortedText) chatLog.finalizeAssistant(abortedText, evt.runId);
			const diagnostic = formatTuiAbortDiagnostic(evt.errorMessage);
			chatLog.addSystem(diagnostic ? `run aborted: ${diagnostic}` : "run aborted");
			terminateRun({
				runId: evt.runId,
				wasActiveRun,
				status: "aborted"
			});
			maybeRefreshHistoryForRun(evt.runId, { hasDisplayableFinal: hasDisplayableAbortedText });
		}
		if (evt.state === "error") {
			forgetLocalBtwRunId?.(evt.runId);
			renderTerminalRunError({
				runId: evt.runId,
				errorMessage: evt.errorMessage ?? "unknown"
			});
		}
		tui.requestRender();
	};
	const handleSessionsChangedEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		if (!matchesSelectedTuiSession(state, evt, { requireAliasOwnership: true })) return;
		if (evt.phase === "message") {
			if (!(typeof evt.sessionId !== "string" || !state.currentSessionId || evt.sessionId === state.currentSessionId) || !isIdentityOnlyTuiSessionInvalidation(evt)) return;
			runCoordinator.queueHistoryReload();
			return;
		}
		const persistedRunId = evt.clientRunId || evt.runId;
		if (persistedRunId && (evt.phase === "end" || evt.phase === "error")) {
			runCoordinator.notePersistedRun(persistedRunId);
			if (pendingNewSessionRunIds.delete(persistedRunId)) {
				if (evt.phase === "end") {
					const displayedRunIds = finalizedRunsWithDisplay.has(persistedRunId) ? [persistedRunId] : [];
					runCoordinator.queueHistoryReload([persistedRunId], [persistedRunId], displayedRunIds);
				} else refreshSessionInfo?.();
			}
			flushPendingHistoryRefreshIfIdle();
			return;
		}
		if (evt.reason !== "new" && evt.reason !== "reset") return clearStaleStreamingIfNoTrackedRunRemains(evt);
		const nextSessionId = typeof evt.sessionId === "string" ? evt.sessionId : null;
		const replacesKnownSession = state.currentSessionId !== null && nextSessionId !== null && state.currentSessionId !== nextSessionId;
		if (evt.reason === "new" && !replacesKnownSession) {
			const { runIds, displayedRunIds } = runCoordinator.collectTrackedSessionRunIds();
			if (runIds.size > 0) {
				if (nextSessionId) state.currentSessionId = nextSessionId;
				if (typeof evt.updatedAt === "number" || evt.updatedAt === null) state.sessionInfo.updatedAt = evt.updatedAt;
				const persistedRunIds = [];
				for (const runId of runIds) if (persistedTerminalRunIds.has(runId)) persistedRunIds.push(runId);
				else pendingNewSessionRunIds.add(runId);
				runCoordinator.queueHistoryReload(persistedRunIds, persistedRunIds, displayedRunIds);
				tui.requestRender();
				return;
			}
		}
		const { runIds, finalizedRunIds, displayedRunIds } = runCoordinator.collectTrackedSessionRunIds();
		state.sessionGeneration = (state.sessionGeneration ?? 0) + 1;
		reduceTuiSessionProjection(state, {
			type: "sessionReset",
			scope: readTuiSessionProjectionScope(state)
		});
		clearTrackedRunState();
		state.activeChatRunId = null;
		state.activityStatus = "idle";
		setActivityStatus("idle");
		if (nextSessionId) state.currentSessionId = nextSessionId;
		if (typeof evt.updatedAt === "number" || evt.updatedAt === null) state.sessionInfo.updatedAt = evt.updatedAt;
		getTuiSessionProjection(state);
		const selection = {
			sessionKey: state.currentSessionKey,
			agentId: state.currentAgentId
		};
		const generation = state.sessionGeneration;
		runCoordinator.queueHistoryReload(runIds.size > 0 ? runIds : void 0, finalizedRunIds, displayedRunIds).then((current) => {
			if (current && evt.reason === "reset" && generation === state.sessionGeneration && matchesSelectedTuiSession(state, selection) && selection.agentId === state.currentAgentId) {
				chatLog.addSystem(`session ${state.currentSessionKey} reset`);
				tui.requestRender();
			}
		});
		tui.requestRender();
	};
	const handleSessionMessageEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		const currentUpdatedAt = state.sessionInfo.updatedAt;
		const priorSession = evt.sessionId && state.currentSessionId && evt.sessionId !== state.currentSessionId;
		const isOlderSnapshot = typeof evt.updatedAt === "number" && evt.updatedAt < (currentUpdatedAt ?? evt.updatedAt);
		if (!matchesSelectedTuiSession(state, evt, { requireAliasOwnership: true }) || priorSession && (typeof evt.updatedAt !== "number" || typeof currentUpdatedAt === "number" && evt.updatedAt <= currentUpdatedAt)) return;
		const unboundDisplayedRunIds = [...finalizedRunsWithDisplay.keys()].filter((runId) => !persistedTerminalRunIds.has(runId));
		const authoritativeRunId = projectTuiSessionMessage(state, evt, unboundDisplayedRunIds);
		if (authoritativeRunId) runCoordinator.notePersistedRun(authoritativeRunId);
		const liveUserMessage = readTuiSessionUserMessage(evt);
		if (liveUserMessage) {
			chatLog.addLiveUser(liveUserMessage.text, liveUserMessage);
			tui.requestRender();
		}
		if (!isOlderSnapshot) {
			if (typeof evt.sessionId === "string") {
				state.currentSessionId = evt.sessionId;
				getTuiSessionProjection(state);
			}
			if (typeof evt.updatedAt === "number" || evt.updatedAt === null) state.sessionInfo.updatedAt = evt.updatedAt;
		}
		if (runCoordinator.routeSessionMessageRefresh(Boolean(liveUserMessage || authoritativeRunId))) refreshSessionInfo?.();
	};
	const handleAgentEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		const isUntrackedRun = evt.runId !== state.activeChatRunId && evt.runId !== getPendingSubmitAcceptedRunId(state) && !sessionRuns.has(evt.runId) && !finalizedRuns.has(evt.runId);
		if (evt.stream === "lifecycle" && formatPrimitiveString(evt.data?.phase, "") === "start" && !finalizedRuns.has(evt.runId) && !(isLocalBtwRunId?.(evt.runId) ?? false) && matchesSelectedTuiSession(state, evt)) {
			runCoordinator.noteSessionRun(evt.runId, { protectStream: true });
			if (isUntrackedRun && !state.activeChatRunId) state.activeChatRunId = evt.runId;
		}
		const isActiveRun = evt.runId === state.activeChatRunId;
		const isPendingRun = evt.runId === getPendingSubmitAcceptedRunId(state);
		const isSessionRun = sessionRuns.has(evt.runId);
		if ((isActiveRun || isPendingRun || isSessionRun) && applyFallbackStepModelUpdate(evt)) {
			if (isActiveRun) armStreamingWatchdog(evt.runId);
			context.updateFooter();
			tui.requestRender();
			return;
		}
		if (!(isActiveRun || isPendingRun || isSessionRun || finalizedRuns.has(evt.runId))) return;
		if (evt.stream === "item") {
			if (renderTuiActivityItem({
				chatLog,
				event: evt,
				verboseLevel: state.sessionInfo.verboseLevel
			})) tui.requestRender();
			return;
		}
		if (evt.stream === "tool") {
			if (isActiveRun) armStreamingWatchdog(evt.runId);
			const verbose = state.sessionInfo.verboseLevel ?? "off";
			const allowToolEvents = verbose !== "off";
			const allowToolOutput = verbose === "full";
			if (!allowToolEvents) return;
			const data = evt.data ?? {};
			const phase = formatPrimitiveString(data.phase, "");
			const toolCallId = formatPrimitiveString(data.toolCallId, "");
			const toolName = formatPrimitiveString(data.name, "tool");
			if (!toolCallId) return;
			if (phase === "start") chatLog.startTool(toolCallId, toolName, data.args, evt.runId);
			else if (phase === "update") {
				if (!allowToolOutput) return;
				chatLog.updateToolResult(toolCallId, data.partialResult, { partial: true });
			} else if (phase === "result") {
				if (allowToolOutput) chatLog.updateToolResult(toolCallId, data.result, { isError: Boolean(data.isError) });
				else chatLog.updateToolResult(toolCallId, { content: [] }, { isError: Boolean(data.isError) });
			}
			tui.requestRender();
			return;
		}
		if (evt.stream === "lifecycle") {
			if (isPendingRun) {
				runCoordinator.noteSessionRun(evt.runId, { protectStream: true });
				markSubmittedRunRegistered(evt.runId);
				state.activeChatRunId = evt.runId;
				noteLocalRunId?.(evt.runId);
				clearPendingSubmit(state, evt.runId);
			}
			const phase = typeof evt.data?.phase === "string" ? evt.data.phase : "";
			if (phase && phase !== "error") clearPendingTerminalLifecycleError(evt.runId);
			const isPostFinalTerminalPhase = postFinalizingRuns.has(evt.runId) && (phase === "end" || phase === "error");
			if (!isActiveRun && !isPendingRun && phase !== "finishing" && !isPostFinalTerminalPhase) return;
			const canUpdateActivityStatus = !hasConcurrentActiveRun(evt.runId);
			if (phase && phase !== "end" && phase !== "error" && phase !== "finishing") armStreamingWatchdog(evt.runId);
			if (phase === "start") {
				if (!canUpdateActivityStatus) return;
				setActivityStatus("running");
			}
			if (phase === "finishing") {
				runCoordinator.notePostFinalizingRun(evt.runId);
				if (!canUpdateActivityStatus) return;
				clearStreamingWatchdog();
				setActivityStatus("finishing context");
			}
			let forceRender = phase === "end";
			if (phase === "end") {
				postFinalizingRuns.delete(evt.runId);
				if (!canUpdateActivityStatus) return;
				if (!localMode || !isLocalRunId?.(evt.runId) || finalizedRuns.has(evt.runId)) setActivityStatus("idle");
			}
			if (phase === "error") {
				postFinalizingRuns.delete(evt.runId);
				if (!canUpdateActivityStatus) return;
				if (typeof evt.data?.endedAt === "number" && (isActiveRun || isPendingRun)) {
					const errorMessage = typeof evt.data?.error === "string" ? evt.data.error : typeof evt.data?.errorMessage === "string" ? evt.data.errorMessage : "unknown";
					scheduleTerminalLifecycleError(evt.runId, errorMessage);
				}
				setActivityStatus("error");
				forceRender = true;
			}
			tui.requestRender(forceRender);
		}
	};
	const handleBtwEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		if (evt.kind !== "btw" || !matchesSelectedTuiSession(state, evt) || localMode && (!evt.runId || !isLocalBtwRunId?.(evt.runId))) return;
		const [question, text] = [evt.question.trim(), evt.text.trim()];
		if (!question || !text) return;
		btw.showResult({
			question,
			text,
			isError: evt.isError
		});
		tui.requestRender();
	};
	const reconcileHistoryAfterGap = () => {
		reduceTuiSessionProjection(state, {
			type: "transportGap",
			scope: readTuiSessionProjectionScope(state)
		});
		const { runIds, displayedRunIds } = runCoordinator.collectTrackedSessionRunIds();
		if (runIds.size === 0) {
			runCoordinator.queueHistoryReload();
			return;
		}
		runCoordinator.queueGapHistoryReload(runIds, displayedRunIds);
	};
	return {
		handleChatEvent,
		handleAgentEvent,
		handleBtwEvent,
		handleSessionsChangedEvent,
		handleSessionMessageEvent,
		pauseStreamingWatchdog,
		reconnectStreamingWatchdog,
		consumeCompletedRunForPendingSend: (runId) => completedRuns.delete(runId),
		isRunObserved: (runId) => sessionRuns.has(runId),
		captureHistoryRunMembership: () => runCoordinator.captureHistoryRunMembership(),
		reconcileHistoryAfterGap,
		flushPendingHistoryRefreshIfIdle,
		dispose
	};
}
//#endregion
//#region src/tui/tui-local-cli.ts
const MAX_JSON_CHARS = 32768;
/** Fixed-command adapters own arguments and presentation; this owner never forwards raw output. */
function createTuiLocalCliRunner() {
	const supervisor = getProcessSupervisor();
	const scopeKey = "tui-cli:" + randomUUID();
	const cleanup = supervisor.acquireScopeCleanup(scopeKey, { processTree: "required-all" });
	let closed = false;
	let active;
	let shutdownPromise;
	const cancel = () => {
		if (!active) return false;
		active.cancelled = true;
		supervisor.cancelScope(scopeKey);
		return true;
	};
	const runJson = async (args) => {
		if (closed) return {
			ok: false,
			reason: "closed"
		};
		if (active) return {
			ok: false,
			reason: "busy"
		};
		const owned = { cancelled: false };
		active = owned;
		let stdout = "";
		let overflow = false;
		try {
			const invocation = resolveCurrentOpenClawCliInvocation(args);
			owned.run = await supervisor.spawn({
				mode: "child",
				argv: [invocation.command, ...invocation.args],
				cwd: invocation.cwd,
				env: {
					...process.env,
					...invocation.env
				},
				scopeKey,
				stdinMode: "pipe-closed",
				timeoutMs: 12e4,
				captureOutput: false,
				assertCurrent: () => {
					if (closed || owned.cancelled) throw new Error("Local CLI action cancelled");
				},
				onStdout: (chunk) => {
					if (overflow) return;
					if (stdout.length + chunk.length > MAX_JSON_CHARS) {
						overflow = true;
						stdout = "";
						return;
					}
					stdout += chunk;
				}
			});
			if (closed || owned.cancelled) owned.run.cancel();
			const result = await owned.run.wait();
			if (owned.cancelled || closed || result.reason === "manual-cancel") return {
				ok: false,
				reason: "cancelled"
			};
			if (result.timedOut || result.noOutputTimedOut) return {
				ok: false,
				reason: "timeout"
			};
			if (result.exitCode !== 0 || result.exitSignal) return {
				ok: false,
				reason: "execution_failed"
			};
			if (overflow) return {
				ok: false,
				reason: "invalid_response"
			};
			try {
				return {
					ok: true,
					value: JSON.parse(stdout)
				};
			} catch {
				return {
					ok: false,
					reason: "invalid_response"
				};
			}
		} catch {
			return {
				ok: false,
				reason: owned.cancelled || closed ? "cancelled" : "execution_failed"
			};
		} finally {
			owned.run?.detachOutput?.();
			stdout = "";
			active = void 0;
		}
	};
	return {
		runJson,
		cancel,
		shutdown: () => {
			closed = true;
			cancel();
			return shutdownPromise ??= cleanup();
		}
	};
}
//#endregion
//#region src/tui/tui-local-shell.ts
function createLocalShellRunner(deps) {
	let localExecAsked = false;
	let localExecAllowed = false;
	let closing = false;
	let shutdownPromise;
	let cancelPendingApproval;
	const supervisor = getProcessSupervisor();
	const scopeKey = `tui-local:${randomUUID()}`;
	const cleanupScope = supervisor.acquireScopeCleanup(scopeKey, { processTree: "required-all" });
	const createSelector = deps.createSelector ?? createSearchableSelectList;
	const getCwd = deps.getCwd ?? tryProcessCwd;
	const env = deps.env ?? process.env;
	const maxChars = deps.maxOutputChars ?? 4e4;
	const ensureLocalExecAllowed = async () => {
		if (closing || localExecAsked) return localExecAllowed && !closing;
		localExecAsked = true;
		return await new Promise((resolve) => {
			let settled = false;
			deps.chatLog.addSystem("Allow local shell commands for this session?");
			deps.chatLog.addSystem("This runs commands on YOUR machine (not the gateway) and may delete files or reveal secrets.");
			deps.chatLog.addSystem("Select Yes/No (arrows + Enter), Esc to cancel.");
			const selector = createSelector([{
				value: "no",
				label: "No"
			}, {
				value: "yes",
				label: "Yes"
			}], 2);
			const finish = (allowed, message) => {
				if (settled) return;
				settled = true;
				deps.closeOverlay(overlayHandle);
				cancelPendingApproval = void 0;
				if (allowed) localExecAllowed = true;
				deps.chatLog.addSystem(message);
				deps.tui.requestRender();
				resolve(allowed);
			};
			selector.onSelect = (item) => {
				const allowed = item.value === "yes" && !closing;
				finish(allowed, allowed ? "local shell: enabled for this session" : "local shell: not enabled");
			};
			selector.onCancel = () => finish(false, "local shell: cancelled");
			const overlayHandle = deps.openOverlay(selector);
			cancelPendingApproval = selector.onCancel;
			deps.tui.requestRender();
		});
	};
	const runLocalShellLine = async (line) => {
		const cmd = line.slice(1);
		if (cmd === "") return;
		if (localExecAsked && !localExecAllowed) {
			deps.chatLog.addSystem("local shell: not enabled for this session");
			deps.tui.requestRender();
			return;
		}
		if (!await ensureLocalExecAllowed() || closing) return;
		const cwd = getCwd();
		if (!cwd) {
			deps.chatLog.addSystem("local shell: working directory was deleted; cd to an existing directory first");
			deps.tui.requestRender();
			return;
		}
		deps.chatLog.addSystem(`[local] $ ${cmd}`);
		deps.tui.requestRender();
		let stdout = "";
		let stderr = "";
		let error;
		let result;
		let run;
		try {
			run = await supervisor.spawn({
				mode: "anchored-shell",
				command: cmd,
				scopeKey,
				cwd,
				env: {
					...env,
					OPENCLAW_SHELL: "tui-local"
				},
				captureOutput: false,
				onStdout: (chunk) => {
					stdout = sliceUtf16Safe(stdout + chunk, -maxChars);
				},
				onStderr: (chunk) => {
					stderr = sliceUtf16Safe(stderr + chunk, -maxChars);
				}
			});
			if (closing) return;
			result = await run.wait();
		} catch (caught) {
			error = caught;
		} finally {
			run?.detachOutput?.();
		}
		const combined = sliceUtf16Safe(stdout + (stderr ? (stdout ? "\n" : "") + stderr : ""), -maxChars).trimEnd();
		if (combined) for (const lineLocal of combined.split("\n")) deps.chatLog.addSystem(`[local] ${lineLocal}`);
		const status = error ? `error: ${formatTuiErrorMessage(error)}` : `exit ${result?.exitCode ?? "?"}`;
		deps.chatLog.addSystem(`[local] ${status}${result?.exitSignal ? ` (signal ${result.exitSignal})` : ""}`);
		deps.tui.requestRender();
	};
	const shutdown = () => shutdownPromise ??= (async () => {
		closing = true;
		cancelPendingApproval?.();
		await cleanupScope();
	})();
	return {
		runLocalShellLine,
		shutdown
	};
}
//#endregion
//#region src/tui/tui-overlays.ts
/** Creates open/close handlers that restore focus when no overlay is active. */
function createOverlayHandlers(host, fallbackFocus) {
	const openOverlay = (...args) => {
		return host.showOverlay(...args);
	};
	const closeOverlay = (handle) => {
		if (handle) {
			handle.hide();
			if (!host.hasOverlay()) host.setFocus(fallbackFocus);
			return;
		}
		if (host.hasOverlay()) {
			host.hideOverlay();
			return;
		}
		host.setFocus(fallbackFocus);
	};
	return {
		openOverlay,
		closeOverlay
	};
}
//#endregion
//#region src/tui/tui-plugin-approvals.ts
const APPROVAL_BIDI_CONTROL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;
function sanitizeApprovalText(text) {
	const flattened = text.replace(APPROVAL_BIDI_CONTROL_RE, "").replace(/\s+/g, " ").trim();
	return sanitizeRenderableText(flattened);
}
var PluginApprovalPrompt = class {
	constructor(surfaceLabel, approval, selector) {
		this.selector = selector;
		this.confirmation = new Text();
		const title = sanitizeApprovalText(approval.request.title);
		const description = sanitizeApprovalText(approval.request.description ?? "");
		const severity = approval.request.severity ?? "warning";
		const metadata = [
			`Severity: ${severity === "critical" ? "Critical" : severity === "info" ? "Info" : "Warning"}`,
			...approval.request.toolName ? [`Tool: ${sanitizeApprovalText(approval.request.toolName)}`] : [],
			...approval.request.pluginId ? [`Plugin: ${sanitizeApprovalText(approval.request.pluginId)}`] : []
		];
		this.title = new Text(tuiTheme.header(`${surfaceLabel}: ${title}`));
		this.metadata = new Text(tuiTheme.dim(metadata.join("\n")));
		this.description = new Text(tuiTheme.system(description ? `Request: ${description}` : ""));
	}
	setConfirmation(text) {
		this.confirmation.setText(tuiTheme.accent(text));
	}
	invalidate() {
		this.title.invalidate();
		this.metadata.invalidate();
		this.description.invalidate();
		this.confirmation.invalidate();
		this.selector.invalidate();
	}
	render(width) {
		const description = this.description.render(width);
		const confirmation = this.confirmation.render(width);
		return [
			...this.title.render(width),
			...this.metadata.render(width),
			...description.some((line) => line.trim()) ? description : [],
			...confirmation.some((line) => line.trim()) ? ["", ...confirmation] : [],
			"",
			...this.selector.render(width)
		];
	}
	handleInput(data) {
		this.selector.handleInput?.(data);
	}
};
const DEFAULT_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
const DECISION_ITEMS = {
	"allow-once": {
		value: "allow-once",
		label: "Allow once",
		description: "Approve this change"
	},
	"allow-always": {
		value: "allow-always",
		label: "Always allow",
		description: "Approve matching future changes"
	},
	deny: {
		value: "deny",
		label: "Deny",
		description: "Do not apply this change"
	}
};
function parseDecision(value) {
	return value === "allow-once" || value === "allow-always" || value === "deny" ? value : null;
}
function parseAllowedDecisions(value) {
	if (!Array.isArray(value)) return;
	const decisions = [];
	for (const candidate of value) {
		const decision = parseDecision(candidate);
		if (decision && !decisions.includes(decision)) decisions.push(decision);
	}
	return decisions.length > 0 ? decisions : void 0;
}
function parseSeverity(value) {
	return value === "info" || value === "warning" || value === "critical" ? value : null;
}
/** Parses the gateway event/list shape used for pending plugin approvals. */
function parseTuiPluginApproval(payload) {
	const record = asOptionalObjectRecord(payload);
	const request = asOptionalObjectRecord(record?.request);
	if (!record || !request) return null;
	const id = typeof record.id === "string" ? record.id.trim() : "";
	const title = typeof request.title === "string" ? request.title.trim() : "";
	const createdAtMs = typeof record.createdAtMs === "number" ? record.createdAtMs : 0;
	const expiresAtMs = typeof record.expiresAtMs === "number" ? record.expiresAtMs : 0;
	if (!id || !title || !createdAtMs || !expiresAtMs) return null;
	return {
		id,
		request: {
			title,
			description: typeof request.description === "string" ? request.description : null,
			pluginId: typeof request.pluginId === "string" ? request.pluginId : null,
			severity: parseSeverity(request.severity),
			toolName: typeof request.toolName === "string" ? request.toolName : null,
			allowedDecisions: parseAllowedDecisions(request.allowedDecisions),
			agentId: typeof request.agentId === "string" ? request.agentId : null,
			sessionKey: typeof request.sessionKey === "string" ? request.sessionKey : null
		},
		createdAtMs,
		expiresAtMs
	};
}
function parseResolvedApprovalId(payload) {
	const id = asOptionalObjectRecord(payload)?.id;
	if (typeof id !== "string") return null;
	return id.trim() || null;
}
function decisionLabel(decision) {
	if (decision === "allow-once") return "allowed once";
	if (decision === "allow-always") return "always allowed";
	return "denied";
}
function approvalSurfaceLabel(approval) {
	return approval.request.toolName === "skill_workshop" ? "workspace skill approval" : "plugin approval";
}
/** Coordinates pending plugin approval events with the active TUI overlay. */
function createTuiPluginApprovalController(deps) {
	const createSelector = deps.createSelector ?? ((items) => new SelectList(items, items.length, selectListTheme));
	const nowMs = deps.nowMs ?? Date.now;
	const setTimeoutFn = deps.setTimeoutFn ?? setTimeout;
	const clearTimeoutFn = deps.clearTimeoutFn ?? clearTimeout;
	let queue = [];
	let activeId = null;
	let activeOverlay = null;
	let expiryTimer = null;
	let disposed = false;
	let mutationVersion = 0;
	const refreshRunner = createTuiRefreshCoalescer(async () => await refreshOnce());
	const mutations = /* @__PURE__ */ new Map();
	const resolvingIds = /* @__PURE__ */ new Set();
	const dismissedIds = /* @__PURE__ */ new Set();
	const clearExpiryTimer = () => {
		if (expiryTimer !== null) {
			clearTimeoutFn(expiryTimer);
			expiryTimer = null;
		}
	};
	const closeActiveOverlay = () => {
		const handle = activeOverlay;
		activeOverlay = null;
		if (handle) deps.closeOverlay(handle);
	};
	const recordMutation = (id, approval) => {
		if (!refreshRunner.isRunning()) return;
		mutationVersion += 1;
		mutations.set(id, {
			version: mutationVersion,
			approval
		});
	};
	const remove = (id, record = true) => {
		queue = queue.filter((approval) => approval.id !== id);
		dismissedIds.delete(id);
		if (record) recordMutation(id, null);
	};
	const add = (approval, record = true) => {
		queue = queue.filter((entry) => entry.id !== approval.id);
		queue.push(approval);
		queue.sort((left, right) => left.createdAtMs - right.createdAtMs);
		if (record) recordMutation(approval.id, approval);
	};
	const matchesActiveSession = (approval) => matchesOwnedTuiSession(deps.getSessionKey(), deps.getAgentId(), approval.request);
	const prune = () => {
		const now = nowMs();
		for (const approval of queue.filter((entry) => entry.expiresAtMs <= now)) remove(approval.id);
	};
	const presentNext = () => {
		if (disposed || activeId) return;
		prune();
		const approval = queue.find((candidate) => !resolvingIds.has(candidate.id) && !dismissedIds.has(candidate.id) && matchesActiveSession(candidate));
		if (!approval) return;
		activeId = approval.id;
		const surfaceLabel = approvalSurfaceLabel(approval);
		const decisions = approval.request.allowedDecisions ?? DEFAULT_DECISIONS;
		const selector = createSelector(decisions.map((decision) => DECISION_ITEMS[decision]));
		let allowDecisionArmed = false;
		let prompt = null;
		const denyIndex = decisions.indexOf("deny");
		let selectedDecision = denyIndex >= 0 ? decisions[denyIndex] : decisions[0];
		if (denyIndex >= 0) selector.setSelectedIndex?.(denyIndex);
		selector.onSelectionChange = (item) => {
			const decision = parseDecision(item.value);
			if (!decision || decision === selectedDecision) return;
			selectedDecision = decision;
			allowDecisionArmed = decision !== "deny";
			prompt?.setConfirmation("");
		};
		const resolve = async (decision) => {
			if (activeId !== approval.id) return;
			clearExpiryTimer();
			activeId = null;
			resolvingIds.add(approval.id);
			closeActiveOverlay();
			deps.requestRender();
			let stale = false;
			try {
				if (!deps.client.resolvePluginApproval) throw new Error("plugin approval resolution is unavailable");
				if ((await deps.client.resolvePluginApproval(approval.id, decision))?.ok === false) stale = true;
				else {
					remove(approval.id);
					deps.chatLog.addSystem(`${surfaceLabel}: ${decisionLabel(decision)}`);
				}
			} catch (error) {
				if (isApprovalStaleError(error)) stale = true;
				else deps.chatLog.addSystem(`${surfaceLabel} failed: ${formatErrorMessage(error)}`);
			}
			if (stale) {
				remove(approval.id);
				deps.chatLog.addSystem(`${surfaceLabel}: no longer pending`);
				try {
					await refreshApprovals();
				} catch (error) {
					deps.chatLog.addSystem(`${surfaceLabel} refresh failed: ${formatErrorMessage(error)}`);
				}
			}
			resolvingIds.delete(approval.id);
			presentNext();
			if (!disposed) deps.requestRender();
		};
		selector.onSelect = (item) => {
			const decision = parseDecision(item.value);
			if (!decision) return;
			if (decision !== "deny" && !allowDecisionArmed) {
				allowDecisionArmed = true;
				prompt?.setConfirmation(`Press Enter again to confirm ${item.label}.`);
				deps.requestRender();
				return;
			}
			resolve(decision);
		};
		selector.onCancel = () => {
			const deny = decisions.includes("deny") ? "deny" : null;
			if (deny) {
				resolve(deny);
				return;
			}
			clearExpiryTimer();
			dismissedIds.add(approval.id);
			activeId = null;
			closeActiveOverlay();
			deps.chatLog.addSystem(`${surfaceLabel}: dismissed; request remains pending`);
			presentNext();
			deps.requestRender();
		};
		const timer = setTimeoutFn(() => {
			if (activeId !== approval.id) return;
			expiryTimer = null;
			activeId = null;
			remove(approval.id);
			closeActiveOverlay();
			deps.chatLog.addSystem(`${surfaceLabel}: expired`);
			presentNext();
			deps.requestRender();
		}, Math.max(1, approval.expiresAtMs - nowMs()));
		expiryTimer = timer;
		if (typeof timer !== "number") timer.unref?.();
		prompt = new PluginApprovalPrompt(surfaceLabel, approval, selector);
		activeOverlay = deps.openOverlay(prompt);
		deps.requestRender();
	};
	const applySnapshot = (approvals, startedAtVersion) => {
		const next = new Map(approvals.map((approval) => [approval.id, approval]));
		for (const [id, mutation] of mutations) {
			if (mutation.version <= startedAtVersion) {
				mutations.delete(id);
				continue;
			}
			if (mutation.approval) next.set(id, mutation.approval);
			else next.delete(id);
		}
		for (const id of dismissedIds) if (!next.has(id)) dismissedIds.delete(id);
		queue = [...next.values()].toSorted((left, right) => left.createdAtMs - right.createdAtMs);
	};
	async function refreshOnce() {
		if (disposed || !deps.client.listPluginApprovals) return;
		const startedAtVersion = mutationVersion;
		const payload = await deps.client.listPluginApprovals();
		if (disposed || !Array.isArray(payload)) return;
		const approvals = [];
		for (const entry of payload) {
			const approval = parseTuiPluginApproval(entry);
			if (approval) approvals.push(approval);
		}
		applySnapshot(approvals, startedAtVersion);
		if (activeId && !queue.some((approval) => approval.id === activeId)) {
			clearExpiryTimer();
			activeId = null;
			closeActiveOverlay();
		}
		presentNext();
		deps.requestRender();
	}
	const refreshApprovals = async () => {
		if (disposed || !deps.client.listPluginApprovals) return;
		await refreshRunner.run();
	};
	return {
		handleEvent(event, payload) {
			if (disposed) return;
			if (event === "plugin.approval.requested") {
				const approval = parseTuiPluginApproval(payload);
				if (approval) {
					add(approval);
					presentNext();
				}
				return;
			}
			if (event !== "plugin.approval.resolved" && event !== "plugin.approval.removed") return;
			const id = parseResolvedApprovalId(payload);
			if (!id) return;
			remove(id);
			resolvingIds.delete(id);
			if (activeId === id) {
				clearExpiryTimer();
				activeId = null;
				closeActiveOverlay();
			}
			presentNext();
			deps.requestRender();
		},
		refresh: refreshApprovals,
		sessionChanged() {
			if (disposed) return;
			const activeApproval = activeId ? queue.find((approval) => approval.id === activeId) : void 0;
			if (activeApproval && !matchesActiveSession(activeApproval)) {
				clearExpiryTimer();
				activeId = null;
				closeActiveOverlay();
				deps.requestRender();
			}
			presentNext();
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			clearExpiryTimer();
			queue = [];
			dismissedIds.clear();
			mutations.clear();
			resolvingIds.clear();
			if (activeId) {
				activeId = null;
				closeActiveOverlay();
				deps.requestRender();
			}
		}
	};
}
//#endregion
//#region src/tui/components/question-prompt.ts
function safeText(value) {
	return sanitizeRenderableLine(value.replace(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, ""));
}
/** A secret editor has no undo/kill ring and never passes its value to a renderer. */
var MaskedQuestionInput = class {
	constructor() {
		this.characters = [];
		this.cursor = 0;
	}
	getValue() {
		return this.characters.join("");
	}
	clear() {
		this.characters = [];
		this.cursor = 0;
	}
	handleInput(data) {
		if (matchesKey(data, Key.backspace)) {
			if (this.cursor > 0) this.characters.splice(--this.cursor, 1);
		} else if (matchesKey(data, Key.delete)) this.characters.splice(this.cursor, 1);
		else if (matchesKey(data, Key.left)) this.cursor = Math.max(0, this.cursor - 1);
		else if (matchesKey(data, Key.right)) this.cursor = Math.min(this.characters.length, this.cursor + 1);
		else if (matchesKey(data, Key.home) || matchesKey(data, Key.ctrl("a"))) this.cursor = 0;
		else if (matchesKey(data, Key.end) || matchesKey(data, Key.ctrl("e"))) this.cursor = this.characters.length;
		else if (matchesKey(data, Key.ctrl("u"))) {
			this.characters.splice(0, this.cursor);
			this.cursor = 0;
		} else if (matchesKey(data, Key.ctrl("k"))) this.characters.splice(this.cursor);
		else {
			const printable = decodeKittyPrintable(data) ?? data;
			if (!hasTerminalControl(printable)) this.insert(printable);
		}
	}
	insert(value) {
		const characters = Array.from(value);
		this.characters.splice(this.cursor, 0, ...characters);
		this.cursor += characters.length;
	}
	render(width, focused) {
		const available = Math.max(1, width - 3);
		const start = Math.max(0, this.cursor - available + 1);
		const before = "•".repeat(this.cursor - start);
		const after = "•".repeat(Math.min(this.characters.length - this.cursor, available - before.length));
		return [`> ${before}${focused ? CURSOR_MARKER : ""}${after}`];
	}
};
/** One step at a time, with a separate masked editor for secret answers. */
var QuestionPrompt = class {
	constructor(record, actions) {
		this.record = record;
		this.actions = actions;
		this.focused = false;
		this.step = 0;
		this.selectedRow = 0;
		this.editing = false;
		this.closed = false;
		this.message = "";
		this.pasteBuffer = null;
		this.rejectedSecretPaste = false;
		this.answers = {};
		this.selections = /* @__PURE__ */ new Map();
		this.freeText = /* @__PURE__ */ new Map();
		this.input = new Input();
		this.secretInput = new MaskedQuestionInput();
		this.enterStep();
	}
	get question() {
		return expectDefined(this.record.questions[this.step], "active question step");
	}
	rows() {
		return [
			...this.question.options.map((option, index) => ({
				kind: "option",
				index,
				label: `${index + 1}. ${safeText(option.label)}`
			})),
			{
				kind: "other",
				label: `${this.question.options.length + 1}. Other…`
			},
			{
				kind: "confirm",
				label: this.step < this.record.questions.length - 1 ? "Next" : "Confirm answer"
			},
			{
				kind: "skip",
				label: "Skip"
			},
			...this.step > 0 ? [{
				kind: "back",
				label: "Back"
			}] : []
		];
	}
	enterStep() {
		this.input = new Input();
		this.secretInput.clear();
		const draft = this.freeText.get(this.step) ?? "";
		if (this.question.isSecret) this.secretInput.insert(draft);
		else this.input.setValue(draft);
		this.selectedRow = this.selections.get(this.step)?.values().next().value ?? 0;
		this.editing = this.question.options.length === 0;
		this.message = "";
		this.rejectedSecretPaste = false;
	}
	draft() {
		return this.question.isSecret ? this.secretInput.getValue() : this.input.getValue();
	}
	saveDraft() {
		this.freeText.set(this.step, this.draft());
	}
	toggle(index) {
		const selected = this.selections.get(this.step) ?? /* @__PURE__ */ new Set();
		if (selected.has(index)) selected.delete(index);
		else selected.add(index);
		this.selections.set(this.step, selected);
	}
	advance(singleOption) {
		if (this.rejectedSecretPaste) {
			this.message = "Secret paste contains line breaks or unsupported control characters. Enter a single-line value.";
			return;
		}
		this.saveDraft();
		const question = this.question;
		const selected = singleOption === void 0 ? this.selections.get(this.step) : /* @__PURE__ */ new Set([singleOption]);
		const values = question.options.filter((_, index) => selected?.has(index)).map((option) => option.label);
		const value = this.draft();
		if (singleOption === void 0 && (question.isSecret ? value.length > 0 : value.trim())) values.push(question.isSecret ? value : value.trim());
		if (values.length === 0) {
			this.message = "Choose an option or enter an answer.";
			return;
		}
		if (singleOption !== void 0) {
			this.selections.set(this.step, /* @__PURE__ */ new Set([singleOption]));
			this.freeText.delete(this.step);
		}
		this.answers[question.questionId] = values;
		if (this.step < this.record.questions.length - 1) {
			this.step += 1;
			this.enterStep();
			return;
		}
		this.actions.onSubmit({ answers: { ...this.answers } });
	}
	activate() {
		const row = this.rows()[this.selectedRow];
		if (!row) return;
		if (row.kind === "option") {
			if (this.question.multiSelect) this.toggle(row.index);
			else this.advance(row.index);
		} else if (row.kind === "other") {
			if (!this.question.multiSelect) this.selections.delete(this.step);
			this.editing = true;
		} else if (row.kind === "confirm") this.advance();
		else if (row.kind === "skip") this.actions.onSkip();
		else {
			this.saveDraft();
			this.step -= 1;
			this.enterStep();
		}
	}
	handleInput(data) {
		if (this.closed || isKeyRelease(data)) return;
		if (this.editing && (this.pasteBuffer !== null || data.includes("\x1B[200~"))) {
			this.pasteBuffer = (this.pasteBuffer ?? "") + data.replace("\x1B[200~", "");
			const end = this.pasteBuffer.indexOf("\x1B[201~");
			if (end >= 0) {
				const paste = this.pasteBuffer.slice(0, end);
				const remaining = this.pasteBuffer.slice(end + 6);
				this.pasteBuffer = null;
				if (this.question.isSecret) {
					this.rejectedSecretPaste = hasTerminalControl(paste.replaceAll("	", "")) || /[\u2028\u2029]/.test(paste);
					if (this.rejectedSecretPaste) this.message = "Secret paste contains line breaks or unsupported control characters. Enter a single-line value.";
					else {
						this.message = "";
						this.secretInput.insert(paste);
					}
				} else this.input.handleInput(`\x1b[200~${paste}\x1b[201~`);
				if (remaining) this.handleInput(remaining);
			}
			this.actions.requestRender();
			return;
		}
		if (matchesKey(data, Key.escape)) {
			this.saveDraft();
			this.actions.onCollapse();
			return;
		}
		this.message = "";
		if (this.editing) {
			if (matchesKey(data, Key.tab) || matchesKey(data, Key.shift("tab"))) {
				this.saveDraft();
				this.editing = false;
				this.selectedRow = this.question.options.length + 1;
			} else if (matchesKey(data, Key.enter) || data === "\n") this.advance();
			else if (this.question.isSecret) {
				this.secretInput.handleInput(data);
				const printable = decodeKittyPrintable(data) ?? data;
				if (!hasTerminalControl(printable) || matchesKey(data, Key.backspace) || matchesKey(data, Key.delete)) this.rejectedSecretPaste = false;
			} else this.input.handleInput(data);
		} else if (matchesKey(data, Key.up) || matchesKey(data, Key.shift("tab"))) this.selectedRow = (this.selectedRow + this.rows().length - 1) % this.rows().length;
		else if (matchesKey(data, Key.down) || matchesKey(data, Key.tab)) this.selectedRow = (this.selectedRow + 1) % this.rows().length;
		else if (matchesKey(data, Key.enter) || data === "\n") this.activate();
		else if (matchesKey(data, Key.space)) {
			const row = this.rows()[this.selectedRow];
			if (row?.kind === "option" && this.question.multiSelect) this.toggle(row.index);
		} else {
			const printable = decodeKittyPrintable(data) ?? data;
			if (/^[1-5]$/.test(printable)) {
				const index = Number(printable) - 1;
				if (index <= this.question.options.length) {
					this.selectedRow = index;
					if (index === this.question.options.length) this.activate();
					else if (this.question.multiSelect) this.toggle(index);
				}
			}
		}
		this.actions.requestRender();
	}
	invalidate() {
		this.input.invalidate();
	}
	render(width) {
		if (this.closed) return [];
		const question = this.question;
		const seconds = Math.max(0, Math.ceil((this.record.expiresAtMs - Date.now()) / 1e3));
		const lines = [
			tuiTheme.header(`Question ${this.step + 1}/${this.record.questions.length} · ${safeText(question.header)}`),
			safeText(question.question),
			tuiTheme.dim(`Expires in ${seconds}s`)
		];
		const binding = question.secretStore;
		if (binding) {
			lines.push(`Secret store entry: ${safeText(binding.name)}`);
			if (binding.reason) lines.push(`Reason: ${safeText(binding.reason)}`);
			lines.push(`Allowed hosts (accept as proposed): ${binding.allowedHosts?.map(safeText).join(", ") || "none"}`);
			if (question.secretStoreExisting) lines.push(tuiTheme.accent("An existing value will be replaced."));
		}
		const rendered = new Text(lines.join("\n"), 0, 0).render(width);
		for (const [index, row] of this.rows().entries()) {
			const selected = !this.editing && index === this.selectedRow;
			const checked = row.kind === "option" && this.selections.get(this.step)?.has(row.index);
			const marker = row.kind === "option" && question.multiSelect ? `[${checked ? "x" : " "}] ` : "";
			rendered.push(...new Text((selected ? tuiTheme.accent : tuiTheme.fg)(`${selected ? "›" : " "} ${marker}${row.label}`), 0, 0).render(width));
			if (row.kind === "option") {
				const description = question.options[row.index]?.description;
				if (description) rendered.push(...new Text(tuiTheme.dim(`    ${safeText(description)}`), 0, 0).render(width));
			}
			if (row.kind === "other" && (this.editing || this.draft())) {
				this.input.focused = this.focused && this.editing;
				rendered.push(...question.isSecret ? this.secretInput.render(width, this.focused && this.editing) : this.input.render(width));
			}
		}
		rendered.push(...new Text(tuiTheme.dim(this.editing ? "Enter next/submit · Tab choices · Esc collapse" : `↑/↓ or numbers select${question.multiSelect ? " · Space toggles" : ""} · Enter confirm · Esc collapse`), 0, 0).render(width));
		if (question.isSecret) rendered.push(...new Text(tuiTheme.dim("Masked entry · Answer through this prompt, not the composer."), 0, 0).render(width));
		if (this.message) rendered.push(...new Text(tuiTheme.error(this.message), 0, 0).render(width));
		return rendered;
	}
	dispose() {
		this.closed = true;
		this.pasteBuffer = null;
		this.input = new Input();
		this.secretInput.clear();
		this.freeText.clear();
		this.selections.clear();
		for (const key of Object.keys(this.answers)) delete this.answers[key];
	}
};
//#endregion
//#region src/tui/tui-questions.ts
function isSecretStoreRefreshFailure(record, error) {
	return record.questions.some((question) => question.secretStore !== void 0) && error instanceof Error && asOptionalObjectRecord(error)?.gatewayCode === "UNAVAILABLE" && error.message.startsWith("Secret store entry was saved, but runtime refresh failed.");
}
function createTuiQuestionController(deps) {
	const questions = /* @__PURE__ */ new Map();
	const mutations = /* @__PURE__ */ new Map();
	let mutationVersion = 0;
	let active = null;
	let timer;
	let disposed = false;
	let pendingText = "";
	const refreshRunner = createTuiRefreshCoalescer(refreshOnce, () => mutations.clear());
	const matchesSession = (record) => matchesOwnedTuiSession(deps.getSessionKey(), deps.getAgentId(), record);
	function closeActive() {
		if (active) {
			const handle = active.handle;
			active = null;
			deps.closeOverlay(handle);
		}
	}
	function remember(id, question) {
		if (refreshRunner.isRunning()) mutations.set(id, {
			version: ++mutationVersion,
			question
		});
	}
	const questionRecords = (field = "record") => [...questions.values()].flatMap((state) => {
		const record = state[field];
		return record ? [record] : [];
	});
	function update(id, patch) {
		const state = {
			...questions.get(id),
			...patch
		};
		if (!disposed && (state.record || state.resolving || state.recovery)) questions.set(id, state);
		else questions.delete(id);
	}
	function remove(id) {
		const state = questions.get(id);
		state?.prompt?.dispose();
		questions.delete(id);
		update(id, {
			resolving: state?.resolving,
			recovery: state?.recovery
		});
		remember(id, null);
		if (active?.id === id) closeActive();
		return state?.record;
	}
	function finish(id, status) {
		const record = remove(id);
		if (record && matchesSession(record)) deps.chatLog.addSystem(`Question: ${status === "cancelled" ? "skipped" : status}.`);
	}
	function abandon(record) {
		if (!questions.get(record.id)?.record) return;
		remove(record.id);
		if (matchesSession(record)) deps.chatLog.addSystem("Question outcome could not be recovered; check the conversation or secret store before requesting again.");
	}
	async function recoverOnce(record) {
		if (disposed || !questions.get(record.id)?.unconfirmed) return "terminal";
		if (record.expiresAtMs <= Date.now()) {
			abandon(record);
			return "terminal";
		}
		if (!deps.client.getQuestion) return "unknown";
		try {
			const result = await deps.client.getQuestion(record.id);
			if (disposed || !questions.get(record.id)?.unconfirmed) return "terminal";
			if (!Value.Check(QuestionGetResultSchema, result) || result.question.id !== record.id) return "unknown";
			if (result.question.status !== "pending") {
				finish(record.id, result.question.status);
				return "terminal";
			}
			update(record.id, {
				record: result.question,
				unconfirmed: void 0
			});
			remember(record.id, result.question);
			return "pending";
		} catch (error) {
			if (disposed || !questions.get(record.id)?.unconfirmed) return "terminal";
			const errorRecord = asOptionalObjectRecord(error);
			if (asOptionalObjectRecord(errorRecord?.details)?.reason === "QUESTION_NOT_FOUND" || errorRecord?.code === "QUESTION_NOT_FOUND") {
				abandon(record);
				return "terminal";
			}
			return "unknown";
		}
	}
	async function recover(record) {
		const current = questions.get(record.id)?.recovery;
		if (current) return current;
		const recovery = recoverOnce(record);
		update(record.id, { recovery });
		try {
			return await recovery;
		} finally {
			if (questions.get(record.id)?.recovery === recovery) update(record.id, { recovery: void 0 });
		}
	}
	function present() {
		if (disposed) return;
		clearTimeout(timer);
		timer = void 0;
		const now = Date.now();
		for (const record of questionRecords()) if (record.expiresAtMs <= now) {
			if (questions.get(record.id)?.unconfirmed) abandon(record);
			else if (!questions.get(record.id)?.resolving) finish(record.id, "expired");
		}
		const records = questionRecords().filter(matchesSession).toSorted((a, b) => a.createdAtMs - b.createdAtMs || a.id.localeCompare(b.id));
		if (active && !records.some((record) => record.id === active?.id)) closeActive();
		const record = records.find(({ id }) => {
			const state = questions.get(id);
			return !state?.collapsed && !state?.resolving && !state?.unconfirmed;
		});
		if (!active && record) {
			const prompt = questions.get(record.id)?.prompt ?? new QuestionPrompt(record, {
				onSubmit: (answers) => void resolve(record, {
					id: record.id,
					answers,
					resolutionId: randomUUID()
				}),
				onSkip: () => void resolve(record, {
					id: record.id,
					cancel: true
				}),
				onCollapse: () => {
					if (active?.id !== record.id) return;
					for (const question of questionRecords()) if (matchesSession(question)) update(question.id, { collapsed: true });
					closeActive();
					present();
				},
				requestRender: deps.requestRender
			});
			update(record.id, { prompt });
			active = {
				id: record.id,
				handle: deps.openOverlay(prompt, { width: "100%" })
			};
		}
		const firstRecord = records[0];
		const text = records.some((question) => questions.get(question.id)?.unconfirmed) ? "Answer confirmation unavailable · /question to check" : firstRecord ? `Question pending${records.length > 1 ? ` (${records.length})` : ""} · ${Math.max(0, Math.ceil((firstRecord.expiresAtMs - Date.now()) / 1e3))}s · /question to open` : "";
		if (text !== pendingText) {
			pendingText = text;
			deps.onPendingChange(text);
		}
		const expiring = questionRecords().filter((entry) => !questions.get(entry.id)?.resolving);
		if (expiring.length > 0) {
			const expiry = Math.min(...expiring.map((entry) => entry.expiresAtMs));
			timer = setTimeout(present, Math.max(1, Math.min(1e3, expiry - now)));
			timer.unref?.();
		}
		deps.requestRender();
	}
	async function resolve(record, params) {
		if (disposed || active?.id !== record.id || questions.get(record.id)?.resolving) return;
		if (record.expiresAtMs <= Date.now()) {
			finish(record.id, "expired");
			present();
			return;
		}
		update(record.id, { resolving: true });
		closeActive();
		questions.get(record.id)?.prompt?.dispose();
		update(record.id, { prompt: void 0 });
		present();
		try {
			if (!deps.client.resolveQuestion) throw new Error("question resolution unavailable");
			const result = await deps.client.resolveQuestion(params);
			if (!Value.Check(QuestionResolveResultSchema, result)) throw new Error("invalid question resolution");
			if (!disposed) finish(record.id, result.status);
		} catch (error) {
			if (!disposed && isSecretStoreRefreshFailure(record, error)) {
				finish(record.id, "answered");
				if (matchesSession(record)) deps.chatLog.addSystem("Secret stored, but runtime refresh failed. Run openclaw secrets reload; do not resubmit this answer.");
				return;
			}
			if (!disposed && questions.get(record.id)?.record) {
				update(record.id, {
					collapsed: true,
					unconfirmed: record
				});
				const outcome = await recover(record);
				if (!disposed && questions.get(record.id)?.record && matchesSession(record)) {
					if (outcome === "pending") deps.chatLog.addSystem("Question is still pending. Use /question to retry.");
					else if (outcome === "unknown") deps.chatLog.addSystem("Answer confirmation unavailable; use /question to check before retrying.");
				}
			}
		} finally {
			update(record.id, { resolving: void 0 });
			present();
		}
	}
	async function refreshOnce() {
		if (disposed) return;
		const startedAtVersion = mutationVersion;
		await Promise.all(questionRecords("unconfirmed").map(recover));
		if (disposed || !deps.client.listQuestions) {
			present();
			return;
		}
		const result = await deps.client.listQuestions();
		if (disposed) return;
		if (!Value.Check(QuestionListResultSchema, result)) throw new Error("invalid question list");
		const next = new Map(result.questions.filter((question) => question.status === "pending").map((question) => [question.id, question]));
		for (const [id, mutation] of mutations) if (mutation.version > startedAtVersion) {
			if (mutation.question) next.set(id, mutation.question);
			else next.delete(id);
		}
		for (const { id } of questionRecords()) if (!next.has(id) && !questions.get(id)?.unconfirmed && !questions.get(id)?.resolving) remove(id);
		for (const [id, question] of next) update(id, { record: question });
		present();
	}
	async function refresh() {
		return disposed ? void 0 : await refreshRunner.run();
	}
	return {
		handleEvent(event, payload) {
			if (disposed) return;
			if (event === "question.requested" && Value.Check(QuestionRecordSchema, payload)) {
				if (payload.status === "pending") {
					update(payload.id, { record: payload });
					remember(payload.id, payload);
					present();
				}
			} else if (event === "question.resolved" && Value.Check(QuestionResolvedEventSchema, payload)) {
				finish(payload.id, payload.status);
				present();
			}
		},
		refresh,
		sessionChanged() {
			present();
			return refresh();
		},
		async reopen() {
			if (disposed) return;
			await refresh();
			for (const record of questionRecords()) if (matchesSession(record) && !questions.get(record.id)?.unconfirmed) update(record.id, { collapsed: void 0 });
			present();
			if (!disposed && !questionRecords().some(matchesSession)) {
				deps.chatLog.addSystem("No pending question for this session.");
				deps.requestRender();
			}
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			clearTimeout(timer);
			closeActive();
			for (const { prompt } of questions.values()) prompt?.dispose();
			questions.clear();
			mutations.clear();
			deps.onPendingChange("");
			deps.requestRender();
		}
	};
}
//#endregion
//#region src/tui/tui-agent-list-refresh.ts
/** Refresh an authoritative agent roster without discarding the last good snapshot on failure. */
async function refreshTuiAgentList(params) {
	try {
		params.apply(await params.load());
		return ok(void 0);
	} catch (error) {
		const message = formatTuiErrorMessage(error);
		params.reportError(message);
		return err(message);
	}
}
//#endregion
//#region src/tui/tui-session-info.ts
/** Compare only session facts that change visible TUI behavior. */
function sessionInfoUiEquals(left, right) {
	return left.thinkingLevel === right.thinkingLevel && (left.thinkingLevels === right.thinkingLevels || JSON.stringify(left.thinkingLevels ?? null) === JSON.stringify(right.thinkingLevels ?? null)) && left.fastMode === right.fastMode && left.verboseLevel === right.verboseLevel && left.traceLevel === right.traceLevel && left.reasoningLevel === right.reasoningLevel && left.model === right.model && left.modelProvider === right.modelProvider && left.agentRuntime?.id === right.agentRuntime?.id && left.agentRuntime?.source === right.agentRuntime?.source && left.agentRuntime?.fallback === right.agentRuntime?.fallback && left.contextTokens === right.contextTokens && left.inputTokens === right.inputTokens && left.outputTokens === right.outputTokens && left.totalTokens === right.totalTokens && left.responseUsage === right.responseUsage && left.effectiveResponseUsage === right.effectiveResponseUsage && left.displayName === right.displayName && (left.goal === right.goal || JSON.stringify(left.goal ?? null) === JSON.stringify(right.goal ?? null));
}
//#endregion
//#region src/tui/tui-session-actions.ts
function createSessionActions(context) {
	const { client, chatLog, btw, tui, opts, state, agentNames, initialSessionInput, initialSessionAgentId, resolveSessionSelection, updateHeader, updateFooter, updateAutocompleteProvider, setActivityStatus, invalidateRunOwnership, clearLocalRunIds, rememberSessionKey } = context;
	let historyLoadGeneration = 0;
	let lastSessionDefaults = null;
	const captureSessionSelection = () => ({
		sessionKey: state.currentSessionKey,
		agentId: state.currentAgentId
	});
	const applySessionSelection = (nextSelection) => {
		const previousSelection = captureSessionSelection();
		if (nextSelection.agentId === previousSelection.agentId && agentSessionKeysMatchByRequestKey(nextSelection.key, previousSelection.sessionKey)) return false;
		invalidateRunOwnership?.();
		reduceTuiSessionProjection(state, {
			type: "sessionReset",
			scope: readTuiSessionProjectionScope(state)
		});
		state.currentAgentId = nextSelection.agentId;
		state.currentSessionKey = nextSelection.key;
		state.activeChatRunId = null;
		clearPendingSubmit(state);
		setActivityStatus("idle");
		state.currentSessionId = null;
		state.sessionInfo = {};
		lastSessionDefaults = null;
		state.historyLoaded = false;
		chatLog.clearAll();
		clearLocalRunIds?.();
		btw.clear();
		updateHeader();
		updateFooter();
		return true;
	};
	const isCurrentSessionSelection = (selection) => state.currentAgentId === selection.agentId && agentSessionKeysMatchByRequestKey(state.currentSessionKey, selection.sessionKey);
	const isCurrentSessionMutation = (result) => {
		if (!result.key) return true;
		const parsed = parseAgentSessionKey(result.key);
		return isCurrentSessionSelection({
			sessionKey: result.key,
			agentId: parsed ? normalizeAgentId(parsed.agentId) : state.currentAgentId
		});
	};
	const applyAgentsResult = (result) => {
		state.agentDefaultId = normalizeAgentId(result.defaultId);
		state.sessionMainKey = normalizeMainKey(result.mainKey);
		state.sessionScope = result.scope ?? state.sessionScope;
		state.agents = result.agents.map((agent) => ({
			id: normalizeAgentId(agent.id),
			kind: agent.kind,
			name: normalizeOptionalString(agent.name)
		}));
		agentNames.clear();
		for (const agent of state.agents) if (agent.name) agentNames.set(agent.id, agent.name);
		if (!state.initialSessionApplied) {
			if (initialSessionAgentId) {
				if (state.agents.some((agent) => agent.id === initialSessionAgentId)) state.currentAgentId = initialSessionAgentId;
			} else if (!state.agents.some((agent) => agent.id === state.currentAgentId)) state.currentAgentId = state.agents[0]?.id ?? normalizeAgentId(result.defaultId ?? state.currentAgentId);
			const nextSelection = resolveSessionSelection(initialSessionInput);
			state.currentAgentId = nextSelection.agentId;
			if (nextSelection.key !== state.currentSessionKey) state.currentSessionKey = nextSelection.key;
			state.initialSessionApplied = true;
		} else if (!state.agents.some((agent) => agent.id === state.currentAgentId)) {
			const nextAgentId = state.agents[0]?.id ?? normalizeAgentId(result.defaultId ?? state.currentAgentId);
			if (nextAgentId !== state.currentAgentId) {
				applySessionSelection(resolveSessionSelection(void 0, nextAgentId));
				return;
			}
		}
		updateHeader();
		updateFooter();
	};
	const refreshAgents = (ownsRefresh = () => true) => refreshTuiAgentList({
		load: () => client.listAgents(),
		apply: (result) => ownsRefresh() && applyAgentsResult(result),
		reportError: (error) => ownsRefresh() && chatLog.addSystem(`agents list failed: ${error}`)
	});
	const updateAgentFromSessionKey = (key) => {
		const parsed = parseAgentSessionKey(key);
		if (!parsed) return;
		const next = normalizeAgentId(parsed.agentId);
		if (next !== state.currentAgentId) state.currentAgentId = next;
	};
	const resolveModelSelection = (entry) => {
		return resolveSessionInfoModelSelection({
			currentProvider: state.sessionInfo.modelProvider,
			currentModel: state.sessionInfo.model,
			defaultProvider: lastSessionDefaults?.modelProvider,
			defaultModel: lastSessionDefaults?.model,
			entryProvider: entry?.modelProvider,
			entryModel: entry?.model,
			overrideProvider: entry?.providerOverride,
			overrideModel: entry?.modelOverride
		});
	};
	const applySessionInfo = (params) => {
		const hasEntryUpdate = "entry" in params;
		const entry = params.entry ?? void 0;
		const defaults = params.defaults ?? lastSessionDefaults ?? void 0;
		const previousDefaults = lastSessionDefaults;
		const defaultsChanged = params.defaults ? previousDefaults?.model !== params.defaults.model || previousDefaults?.modelProvider !== params.defaults.modelProvider || previousDefaults?.contextTokens !== params.defaults.contextTokens : false;
		if (params.defaults) lastSessionDefaults = params.defaults;
		const entryUpdatedAt = entry?.updatedAt ?? null;
		const currentUpdatedAt = state.sessionInfo.updatedAt ?? null;
		if (!params.force && entryUpdatedAt !== null && currentUpdatedAt !== null && entryUpdatedAt < currentUpdatedAt && !defaultsChanged) return;
		const next = { ...state.sessionInfo };
		if (entry?.thinkingLevel !== void 0) next.thinkingLevel = entry.thinkingLevel;
		if (entry?.thinkingLevels !== void 0 || defaults?.thinkingLevels !== void 0) next.thinkingLevels = entry?.thinkingLevels ?? defaults?.thinkingLevels;
		if (entry?.agentRuntime !== void 0) next.agentRuntime = entry.agentRuntime;
		if (entry?.fastMode !== void 0) next.fastMode = entry.fastMode;
		if (entry?.verboseLevel !== void 0) next.verboseLevel = entry.verboseLevel;
		if (entry?.traceLevel !== void 0) next.traceLevel = entry.traceLevel;
		if (entry?.reasoningLevel !== void 0) next.reasoningLevel = entry.reasoningLevel;
		if (entry?.responseUsage !== void 0) next.responseUsage = entry.responseUsage;
		if (entry?.effectiveResponseUsage !== void 0) next.effectiveResponseUsage = entry.effectiveResponseUsage;
		if (entry?.inputTokens !== void 0) next.inputTokens = entry.inputTokens;
		if (entry?.outputTokens !== void 0) next.outputTokens = entry.outputTokens;
		if (entry?.totalTokens !== void 0) {
			next.totalTokens = entry.totalTokens;
			next.totalTokensFresh = entry.totalTokensFresh === true;
		} else if (entry?.totalTokensFresh === true) {
			next.totalTokens = 0;
			next.totalTokensFresh = true;
		}
		if (params.clearMissingUsage) {
			if (entry?.inputTokens === void 0) next.inputTokens = null;
			if (entry?.outputTokens === void 0) next.outputTokens = null;
			if (entry?.totalTokens === void 0 && entry?.totalTokensFresh !== true) {
				next.totalTokens = null;
				next.totalTokensFresh = void 0;
			}
		}
		if (hasEntryUpdate) next.goal = entry?.goal;
		if (entry?.contextTokens !== void 0 || defaults?.contextTokens !== void 0) next.contextTokens = entry?.contextTokens ?? defaults?.contextTokens ?? state.sessionInfo.contextTokens;
		if (entry?.displayName !== void 0) next.displayName = entry.displayName;
		if (entry?.updatedAt !== void 0) next.updatedAt = entry.updatedAt;
		const selection = resolveModelSelection(entry);
		if (selection.modelProvider !== void 0) next.modelProvider = selection.modelProvider;
		if (selection.model !== void 0) next.model = selection.model;
		const previous = state.sessionInfo;
		const uiChanged = !sessionInfoUiEquals(previous, next);
		if (!uiChanged && previous.updatedAt === next.updatedAt) return;
		state.sessionInfo = next;
		if (uiChanged) {
			updateAutocompleteProvider();
			updateFooter();
			tui.requestRender();
		}
	};
	const runRefreshSessionInfo = async () => {
		const selection = captureSessionSelection();
		const historyGeneration = historyLoadGeneration;
		const sessionGeneration = state.sessionGeneration ?? 0;
		const isCurrentRefresh = () => historyGeneration === historyLoadGeneration && sessionGeneration === (state.sessionGeneration ?? 0) && isCurrentSessionSelection(selection);
		try {
			const result = await client.describeSession({
				sessionKey: selection.sessionKey,
				...!parseAgentSessionKey(selection.sessionKey) && selection.sessionKey !== "unknown" ? { agentId: selection.agentId } : {}
			});
			if (!isCurrentRefresh()) return;
			const entry = result.session && agentSessionKeysMatchByRequestKey(result.session.key, selection.sessionKey) ? result.session : void 0;
			if (entry?.key && entry.key !== state.currentSessionKey) {
				updateAgentFromSessionKey(entry.key);
				state.currentSessionKey = entry.key;
				updateHeader();
			}
			state.currentSessionId = typeof entry?.sessionId === "string" ? entry.sessionId : null;
			applySessionInfo({
				entry,
				defaults: result.defaults
			});
		} catch (err) {
			if (!isCurrentRefresh()) return;
			chatLog.addSystem(`session description failed: ${formatTuiErrorMessage(err)}`);
		}
	};
	const refreshSessionInfoRunner = createTuiRefreshCoalescer(async () => {
		await runRefreshSessionInfo();
	});
	const refreshSessionInfo = () => refreshSessionInfoRunner.run();
	const applySessionInfoFromPatch = (result) => {
		if (!result?.entry || !isCurrentSessionMutation(result)) return;
		if (result.key && result.key !== state.currentSessionKey) {
			updateAgentFromSessionKey(result.key);
			state.currentSessionKey = result.key;
			updateHeader();
		}
		const resolved = result.resolved;
		const entry = resolved ? {
			...result.entry,
			modelProvider: resolved.modelProvider ?? result.entry.modelProvider,
			model: resolved.model ?? result.entry.model,
			...resolved.agentRuntime ? { agentRuntime: resolved.agentRuntime } : {},
			...resolved.thinkingLevel ? { thinkingLevel: resolved.thinkingLevel } : {},
			...resolved.thinkingLevels ? { thinkingLevels: resolved.thinkingLevels } : {}
		} : result.entry;
		applySessionInfo({
			entry,
			force: true
		});
	};
	const applySessionMutationResult = (result, requestSelection = captureSessionSelection()) => {
		if (!result?.entry || !isCurrentSessionSelection(requestSelection)) return false;
		historyLoadGeneration += 1;
		state.sessionGeneration = (state.sessionGeneration ?? 0) + 1;
		reduceTuiSessionProjection(state, {
			type: "sessionReset",
			scope: readTuiSessionProjectionScope(state)
		});
		if (result.key && result.key !== state.currentSessionKey) {
			updateAgentFromSessionKey(result.key);
			state.currentSessionKey = result.key;
			updateHeader();
		}
		const sessionId = result.entry.sessionId;
		state.currentSessionId = typeof sessionId === "string" ? sessionId : null;
		applySessionInfoFromPatch(result);
		chatLog.clearAll();
		btw.clear();
		chatLog.addSystem(`session ${state.currentSessionKey}`);
		state.historyLoaded = true;
		rememberSessionKey?.(state.currentSessionKey);
		tui.requestRender(true);
		return true;
	};
	const loadHistory = async () => {
		const generation = ++historyLoadGeneration;
		const sessionGeneration = state.sessionGeneration ?? 0;
		const selection = captureSessionSelection();
		const isCurrentLoad = () => generation === historyLoadGeneration && (state.sessionGeneration ?? 0) === sessionGeneration && isCurrentSessionSelection(selection);
		try {
			const history = await client.loadHistory({
				sessionKey: selection.sessionKey,
				...!parseAgentSessionKey(selection.sessionKey) ? { agentId: selection.agentId } : {},
				limit: opts.historyLimit ?? 200
			});
			if (!isCurrentLoad()) return { loaded: false };
			const record = history;
			const sessionInfo = record.sessionInfo;
			if (sessionInfo?.key && sessionInfo.key !== state.currentSessionKey) {
				updateAgentFromSessionKey(sessionInfo.key);
				state.currentSessionKey = sessionInfo.key;
				selection.sessionKey = state.currentSessionKey;
				selection.agentId = state.currentAgentId;
				updateHeader();
			}
			const historySessionInfo = sessionInfo && sessionInfo.thinkingLevel === void 0 && record.thinkingLevel !== void 0 ? {
				...sessionInfo,
				thinkingLevel: record.thinkingLevel
			} : sessionInfo;
			state.currentSessionId = typeof sessionInfo?.sessionId === "string" ? sessionInfo.sessionId : typeof record.sessionId === "string" ? record.sessionId : null;
			applySessionInfo({
				entry: historySessionInfo ?? {
					sessionId: record.sessionId,
					thinkingLevel: record.thinkingLevel,
					fastMode: record.fastMode,
					verboseLevel: record.verboseLevel,
					traceLevel: record.traceLevel
				},
				defaults: record.defaults,
				clearMissingUsage: Boolean(historySessionInfo)
			});
			if (!sessionInfo) {
				await refreshSessionInfo();
				if (!isCurrentLoad()) return { loaded: false };
			}
			const pendingRunIds = new Set(getTuiSessionProjection(state).entries.flatMap((entry) => entry.pending && entry.pendingRunId ? [entry.pendingRunId] : []));
			const projection = reduceTuiSessionProjection(state, {
				type: "snapshotLoaded",
				messages: record.messages ?? [],
				scope: readTuiSessionProjectionScope(state),
				options: { shouldIncludeMessage: (message) => Boolean(message) && typeof message === "object" && (message.role !== "toolResult" || (state.sessionInfo.verboseLevel ?? "off") !== "off") }
			});
			chatLog.clearAll();
			btw.clear();
			chatLog.addSystem(`session ${state.currentSessionKey}`);
			const activityByMessageId = new Map(record.activity?.map((entry) => [entry.messageId, entry.items]));
			for (const entry of projection.entries) {
				const message = entry.message;
				if (isCommandMarkedMessage(message)) {
					const text = extractTextFromMessage(message);
					if (text) chatLog.addSystem(text);
					continue;
				}
				if (message.role === "user") {
					const text = extractTextFromMessage(message);
					if (text) {
						const liveUserMessage = readTuiSessionUserMessage({ message });
						if (entry.pending && entry.pendingRunId) chatLog.addPendingUser(entry.pendingRunId, text);
						else if (entry.live && liveUserMessage) chatLog.addLiveUser(text, liveUserMessage);
						else if (liveUserMessage) chatLog.addUser(text, {
							messageId: liveUserMessage.messageId,
							...liveUserMessage.images ? { images: liveUserMessage.images } : {}
						});
						else {
							const images = extractTuiImageSources(message);
							if (images.length > 0) chatLog.addUser(text, { images });
							else chatLog.addUser(text);
						}
					}
					continue;
				}
				if (message.role === "assistant") {
					const text = extractTextFromMessage(message, { includeThinking: state.showThinking });
					if (text) {
						const images = extractTuiImageSources(message);
						if (images.length > 0) chatLog.finalizeAssistant(text, void 0, images);
						else chatLog.finalizeAssistant(text);
					}
					continue;
				}
				if (message.role === "toolResult") {
					const messageId = entry.identity?.id;
					renderTuiHistoryToolResult({
						chatLog,
						message,
						items: messageId ? activityByMessageId.get(messageId) : void 0,
						verboseLevel: state.sessionInfo.verboseLevel
					});
				}
			}
			reconcilePendingSubmitHistory(state, projection.entries.flatMap((entry) => {
				const sendId = entry.identity?.sendId;
				return !entry.pending && sendId && pendingRunIds.has(sendId) ? [sendId] : [];
			}));
			const inFlightRunId = formatPrimitiveString(record.inFlightRun?.runId, "");
			const inFlightText = formatPrimitiveString(record.inFlightRun?.text, "");
			if (inFlightRunId) {
				if (inFlightText) chatLog.updateAssistant(inFlightText, inFlightRunId);
				state.activeChatRunId = inFlightRunId;
				setActivityStatus("streaming");
			}
			state.historyLoaded = true;
			if (record.runtimePluginsPrewarm?.status === "failed") chatLog.addSystem(`runtime prewarm failed: ${record.runtimePluginsPrewarm.error ?? "unknown"}`);
			rememberSessionKey?.(state.currentSessionKey);
			tui.requestRender(true);
			const status = sessionInfo?.status;
			const runOutcome = inFlightRunId ? {
				state: "active",
				runId: inFlightRunId
			} : status === "failed" || status === "timeout" ? {
				state: "failed",
				errorMessage: sessionInfo?.lastRunError ?? `session run ${status}`
			} : status === "killed" || sessionInfo?.abortedLastRun === true ? { state: "interrupted" } : { state: "completed" };
			const activeRunIds = sessionInfo?.activeRunIds;
			return {
				loaded: true,
				runOutcome,
				...Array.isArray(activeRunIds) && activeRunIds.every((id) => typeof id === "string") ? { activeRunIds } : {}
			};
		} catch (err) {
			if (isCurrentLoad() && !isAbortError(err)) {
				chatLog.addSystem(`history failed: ${formatTuiErrorMessage(err)}`);
				tui.requestRender(true);
			}
			return { loaded: false };
		}
	};
	const setSession = async (rawKey, agentId) => {
		if (applySessionSelection(resolveSessionSelection(rawKey, agentId)) || !state.historyLoaded) await loadHistory();
	};
	const abortActive = async (params) => {
		if (opts.local === true && state.activityStatus === "finishing context" && !params?.preferActive && !getPendingSubmitAcceptedRunId(state)) {
			chatLog.addSystem("agent is finishing context; wait for it to finish before aborting");
			tui.requestRender();
			return;
		}
		const selection = captureSessionSelection();
		const sessionId = state.currentSessionId;
		const sessionGeneration = state.sessionGeneration ?? 0;
		const pendingRunId = getPendingSubmitAcceptedRunId(state);
		const activeRunId = state.activeChatRunId;
		const isCurrentAbort = () => isCurrentSessionSelection(selection) && (state.sessionGeneration ?? 0) === sessionGeneration && (sessionId === null || state.currentSessionId === sessionId);
		const dropPendingRun = (runId) => {
			reduceTuiSessionProjection(state, {
				type: "sendFailed",
				runId,
				scope: readTuiSessionProjectionScope(state)
			});
			chatLog.dropPendingUser(runId);
		};
		try {
			const result = await client.abortChat({
				sessionKey: selection.sessionKey,
				...!parseAgentSessionKey(selection.sessionKey) ? { agentId: selection.agentId } : {}
			});
			if (!isCurrentAbort()) return;
			if (!result.aborted) {
				chatLog.addSystem("no active run", { coalesceConsecutive: true });
				tui.requestRender();
				return;
			}
			for (const runId of result.runIds ?? []) {
				const stillTracked = state.activeChatRunId === runId || getPendingSubmitAcceptedRunId(state) === runId;
				if (runId !== activeRunId && !stillTracked) dropPendingRun(runId);
			}
			if (pendingRunId) {
				const pendingDraft = getPendingSubmitDraft(state);
				clearPendingSubmit(state, pendingRunId ?? void 0);
				if (pendingDraft?.runId === pendingRunId) dropPendingRun(pendingRunId);
			}
			setActivityStatus("aborted");
		} catch (err) {
			if (!isCurrentAbort()) return;
			chatLog.addSystem(`abort failed: ${formatTuiErrorMessage(err)}`);
			setActivityStatus("abort failed");
		}
		tui.requestRender();
	};
	return {
		applyAgentsResult,
		refreshAgents,
		refreshSessionInfo,
		applySessionInfoFromPatch,
		applySessionMutationResult,
		loadHistory,
		setSession,
		abortActive
	};
}
//#endregion
//#region src/tui/tui-shutdown.ts
function beginTuiShutdown(params) {
	const hardExitTimer = setTimeout(params.forceExit, params.hardExitMs);
	hardExitTimer.unref();
	params.disposeStatus();
	Promise.resolve().then(async () => {
		const errors = [];
		const runtimeTasks = [params.stopCommandScopes, params.stopClient].map(async (task) => task?.());
		for (const result of await Promise.allSettled(runtimeTasks)) if (result.status === "rejected") errors.push(result.reason);
		try {
			await params.stopTui();
		} catch (error) {
			errors.push(error);
		}
		if (errors.length === 1) throw errors[0];
		if (errors.length > 1) throw new AggregateError(errors, "TUI shutdown failed");
	}).finally(() => {
		if (params.keepHardExitArmed !== true) clearTimeout(hardExitTimer);
		params.disposeStatus();
	}).catch(params.onError).finally(params.requestFinish);
	return hardExitTimer;
}
//#endregion
//#region src/tui/tui-submit.ts
function isBrowserSetupInput(text) {
	return /^\/browser-setup(?:\s|$)/i.test(text.trimStart());
}
function resolveEditorSubmitAction(text) {
	if (isBrowserSetupInput(text)) return "command";
	if (text.includes("\n")) return "message";
	if (text.startsWith("!") && text.trimEnd() !== "!") return "local shell";
	return text.trimStart().startsWith("/") ? "command" : "message";
}
function runSubmitAction(action, run, onError) {
	try {
		Promise.resolve(run()).catch((error) => {
			onError(action, error);
		});
	} catch (error) {
		onError(action, error);
	}
}
function createEditorSubmitHandler(params) {
	const clearSubmittedEditor = () => {
		if (!params.editor.getText?.()) params.editor.setText("");
	};
	const restoreBlockedEditor = (value) => {
		const newerDraft = params.editor.getExpandedText();
		params.editor.setText(newerDraft ? `${value}\n${newerDraft}` : value);
	};
	return (text, snapshot) => {
		const raw = text;
		const value = raw.trim();
		const action = resolveEditorSubmitAction(raw);
		const trimChangesAction = resolveEditorSubmitAction(value) !== action;
		if (!value) {
			clearSubmittedEditor();
			return;
		}
		if (action !== "message") {
			clearSubmittedEditor();
			const command = action === "local shell" ? raw : value;
			const handle = action === "local shell" ? params.handleBangLine : params.handleCommand;
			if (!isBrowserSetupInput(command)) params.editor.addToHistory(command);
			runSubmitAction(action, () => handle(command), params.onSubmitError);
			return;
		}
		const admission = (snapshot ? params.admitMessage?.(value, snapshot) : params.admitMessage?.(value)) ?? { status: "allowed" };
		if (admission.status === "blocked") {
			restoreBlockedEditor(trimChangesAction ? raw : value);
			params.onBlockedMessageSubmit?.(value, admission);
			return;
		}
		clearSubmittedEditor();
		if (!trimChangesAction) params.editor.addToHistory(value);
		runSubmitAction("message", () => params.sendMessage(value), params.onSubmitError);
	};
}
function shouldEnableWindowsGitBashPasteFallback(params) {
	const platform = params?.platform ?? process.platform;
	const env = params?.env ?? process.env;
	const termProgram = normalizeLowercaseStringOrEmpty(env.TERM_PROGRAM);
	if (platform === "darwin") {
		if (termProgram.includes("iterm") || termProgram.includes("apple_terminal")) return true;
		return false;
	}
	if (platform !== "win32") return false;
	const msystem = (env.MSYSTEM ?? "").toUpperCase();
	const shell = env.SHELL ?? "";
	if (msystem.startsWith("MINGW") || msystem.startsWith("MSYS")) return true;
	if (normalizeLowercaseStringOrEmpty(shell).includes("bash")) return true;
	return termProgram.includes("mintty");
}
function createSubmitBurstCoalescer(params) {
	const windowMs = Math.max(1, params.burstWindowMs ?? 50);
	const now = params.now ?? (() => Date.now());
	const setTimer = params.setTimer ?? setTimeout;
	const clearTimer = params.clearTimer ?? clearTimeout;
	let pending = null;
	let pendingAt = 0;
	let flushTimer = null;
	let disposed = false;
	const clearFlushTimer = () => {
		if (!flushTimer) return;
		clearTimer(flushTimer);
		flushTimer = null;
	};
	const submit = (value, snapshot) => {
		if (snapshot) params.submit(value, snapshot);
		else params.submit(value);
	};
	const flushPending = () => {
		if (disposed || !pending) return;
		const { value, snapshot } = pending;
		pending = null;
		pendingAt = 0;
		clearFlushTimer();
		submit(value, snapshot);
	};
	const scheduleFlush = () => {
		clearFlushTimer();
		flushTimer = setTimer(() => {
			flushPending();
		}, windowMs);
	};
	const submitBurst = (value) => {
		if (disposed) return;
		if (!params.enabled) {
			submit(value, params.captureSnapshot?.());
			return;
		}
		if (value.includes("\n")) {
			flushPending();
			submit(value, params.captureSnapshot?.());
			return;
		}
		const ts = now();
		const snapshot = params.captureSnapshot?.();
		params.onCapture?.(value, snapshot);
		if (!pending) {
			pending = {
				value,
				...snapshot ? { snapshot } : {}
			};
			pendingAt = ts;
			scheduleFlush();
			return;
		}
		if (ts - pendingAt <= windowMs) {
			pending = {
				value: `${pending.value}\n${value}`,
				...pending.snapshot || snapshot ? { snapshot: pending.snapshot ?? snapshot } : {}
			};
			pendingAt = ts;
			scheduleFlush();
			return;
		}
		flushPending();
		pending = {
			value,
			...snapshot ? { snapshot } : {}
		};
		pendingAt = ts;
		scheduleFlush();
	};
	const dispose = () => {
		disposed = true;
		pending = null;
		clearFlushTimer();
	};
	return Object.assign(submitBurst, { dispose });
}
//#endregion
//#region src/tui/tui-task-suggestions.ts
const TASK_BIDI_CONTROL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;
const TASK_DETAIL_VIEWPORT_LINES = 12;
const TASK_DETAIL_PAGE_LINES = 11;
const PAGE_UP_INPUT = "\x1B[5~";
const PAGE_DOWN_INPUT = "\x1B[6~";
const TASK_ACTIONS = [{
	value: "accept",
	label: "Start in a new session",
	description: "Open a new session to address this task",
	kind: "accept"
}, {
	value: "dismiss",
	label: "Dismiss",
	description: "Dismiss this suggestion without starting work",
	kind: "dismiss"
}];
function clean(text) {
	return sanitizeTaskText(text.replace(/\s+/g, " ").trim());
}
function sanitizeTaskText(text) {
	return sanitizeRenderableText(text.replace(TASK_BIDI_CONTROL_RE, ""));
}
/** Parses the task suggestion shape carried by Gateway list and event payloads. */
function parseTuiTaskSuggestion(value) {
	const record = asOptionalObjectRecord(value);
	if (!record) return null;
	if ([
		"id",
		"title",
		"prompt",
		"tldr",
		"cwd",
		"sessionKey"
	].some((field) => typeof record[field] !== "string" || !record[field].trim())) return null;
	if (typeof record.createdAt !== "number" || record.createdAt < 0) return null;
	return {
		id: record.id.trim(),
		title: record.title.trim(),
		prompt: record.prompt.trim(),
		tldr: record.tldr.trim(),
		cwd: record.cwd.trim(),
		sessionKey: record.sessionKey.trim(),
		...typeof record.agentId === "string" && record.agentId.trim() ? { agentId: record.agentId.trim() } : {},
		createdAt: record.createdAt
	};
}
var TaskPrompt = class {
	constructor(suggestion, selector, requestRender) {
		this.selector = selector;
		this.requestRender = requestRender;
		this.instructionLabel = new Text(tuiTheme.system("Instructions:"));
		this.detailPosition = new Text();
		this.confirmation = new Text();
		this.detailOffset = 0;
		this.detailLineCount = 0;
		this.title = new Text(tuiTheme.header(`Suggested follow-up: ${clean(suggestion.title)}`));
		this.metadata = new Text(tuiTheme.dim(`Project: ${clean(suggestion.cwd)}`));
		this.summary = new Text(tuiTheme.system(`Why: ${clean(suggestion.tldr)}`));
		this.instructions = new Text(tuiTheme.system(sanitizeTaskText(suggestion.prompt.trim())));
	}
	setConfirmation(text) {
		this.confirmation.setText(tuiTheme.accent(text));
	}
	invalidate() {
		for (const component of [
			this.title,
			this.metadata,
			this.summary,
			this.instructionLabel,
			this.instructions,
			this.detailPosition,
			this.confirmation,
			this.selector
		]) component.invalidate();
	}
	render(width) {
		const detailLines = [
			...this.metadata.render(width),
			...this.summary.render(width),
			...this.instructionLabel.render(width),
			...this.instructions.render(width)
		];
		this.detailLineCount = detailLines.length;
		const maxDetailOffset = Math.max(0, detailLines.length - TASK_DETAIL_VIEWPORT_LINES);
		this.detailOffset = Math.min(this.detailOffset, maxDetailOffset);
		const visibleDetails = detailLines.slice(this.detailOffset, this.detailOffset + TASK_DETAIL_VIEWPORT_LINES);
		if (detailLines.length > TASK_DETAIL_VIEWPORT_LINES) {
			const visibleEnd = this.detailOffset + visibleDetails.length;
			this.detailPosition.setText(tuiTheme.dim(`Details ${this.detailOffset + 1}-${visibleEnd} of ${detailLines.length} · PgUp/PgDn to inspect`));
		} else this.detailPosition.setText("");
		const detailPosition = this.detailPosition.render(width);
		const confirmation = this.confirmation.render(width);
		return [
			...this.title.render(width).slice(0, 2),
			...visibleDetails,
			...detailPosition.some((line) => line.trim()) ? detailPosition : [],
			...confirmation.some((line) => line.trim()) ? ["", ...confirmation] : [],
			"",
			...this.selector.render(width)
		];
	}
	handleInput(data) {
		if (data === PAGE_UP_INPUT || data === PAGE_DOWN_INPUT) {
			const maxOffset = Math.max(0, this.detailLineCount - TASK_DETAIL_VIEWPORT_LINES);
			const delta = data === PAGE_UP_INPUT ? -11 : TASK_DETAIL_PAGE_LINES;
			const nextOffset = Math.min(maxOffset, Math.max(0, this.detailOffset + delta));
			if (nextOffset !== this.detailOffset) {
				this.detailOffset = nextOffset;
				this.metadata.invalidate();
				this.summary.invalidate();
				this.instructionLabel.invalidate();
				this.instructions.invalidate();
				this.requestRender();
			}
			return;
		}
		this.selector.handleInput?.(data);
	}
};
/** Coordinates Gateway task-suggestion events with the active TUI overlay. */
function createTuiTaskSuggestionController(deps) {
	const createSelector = deps.createSelector ?? ((items) => new SelectList(items, items.length, selectListTheme));
	const suggestions = /* @__PURE__ */ new Map();
	const hiddenIds = /* @__PURE__ */ new Set();
	const resolvingIds = /* @__PURE__ */ new Set();
	let activeId = null;
	let activeOverlay = null;
	let activeSelector = null;
	let activeActionKey = null;
	let revision = 0;
	let disposed = false;
	const closeActive = () => {
		if (activeOverlay) {
			deps.closeOverlay(activeOverlay);
			activeOverlay = null;
		}
		activeId = null;
		activeSelector = null;
		activeActionKey = null;
	};
	const remove = (id) => {
		revision += 1;
		suggestions.delete(id);
		hiddenIds.delete(id);
		if (activeId === id) closeActive();
	};
	const matchesSession = (suggestion) => matchesOwnedTuiSession(deps.getSessionKey(), deps.getAgentId(), suggestion);
	const availableActions = () => {
		const capabilities = deps.client.getTaskSuggestionActionCapabilities?.() ?? {
			canAccept: Boolean(deps.client.acceptTaskSuggestion),
			canDismiss: Boolean(deps.client.dismissTaskSuggestion)
		};
		return TASK_ACTIONS.filter((action) => action.kind === "accept" ? capabilities.canAccept : capabilities.canDismiss);
	};
	const presentNext = () => {
		if (disposed) return;
		const actions = availableActions();
		const actionKey = actions.map((action) => action.value).join(",");
		if (activeId) {
			if (activeActionKey === actionKey) return;
			closeActive();
		}
		const suggestion = [...suggestions.values()].toSorted((left, right) => left.createdAt - right.createdAt).find((entry) => !hiddenIds.has(entry.id) && !resolvingIds.has(entry.id) && matchesSession(entry));
		if (!suggestion) return;
		if (actions.length === 0) return;
		activeId = suggestion.id;
		const selector = createSelector(actions);
		activeSelector = selector;
		activeActionKey = actionKey;
		const dismissIndex = actions.findIndex((action) => action.value === "dismiss");
		selector.setSelectedIndex?.(Math.max(dismissIndex, 0));
		let acceptArmed = false;
		let prompt = null;
		const resolve = async (action) => {
			if (activeId !== suggestion.id || activeSelector !== selector) return;
			closeActive();
			resolvingIds.add(suggestion.id);
			deps.requestRender();
			try {
				let acceptedKey;
				if (action.kind === "accept") {
					if (!deps.client.acceptTaskSuggestion) throw new Error("task suggestion acceptance is unavailable");
					acceptedKey = (await deps.client.acceptTaskSuggestion(suggestion.id)).key;
				} else {
					if (!deps.client.dismissTaskSuggestion) throw new Error("task suggestion dismissal is unavailable");
					if (!(await deps.client.dismissTaskSuggestion(suggestion.id)).dismissed) throw new Error("task suggestion is no longer pending");
				}
				if (disposed) return;
				remove(suggestion.id);
				deps.chatLog.addSystem(acceptedKey ? `follow-up task started in ${acceptedKey}` : "follow-up task dismissed");
				if (acceptedKey && matchesSession(suggestion)) await deps.onAccepted(acceptedKey);
			} catch (error) {
				if (disposed) return;
				deps.chatLog.addSystem(`follow-up task failed: ${formatErrorMessage(error)}`);
				refresh().catch((refreshError) => {
					if (!disposed) deps.chatLog.addSystem(`task suggestion refresh failed: ${formatErrorMessage(refreshError)}`);
				});
			} finally {
				resolvingIds.delete(suggestion.id);
			}
			presentNext();
			if (!disposed) deps.requestRender();
		};
		selector.onSelectionChange = () => {
			acceptArmed = false;
			prompt?.setConfirmation("");
		};
		selector.onSelect = (item) => {
			if (activeSelector !== selector) return;
			const selectedAction = actions.find((action) => action.value === item.value);
			if (!selectedAction || !availableActions().some((action) => action.value === item.value)) {
				closeActive();
				presentNext();
				deps.requestRender();
				return;
			}
			if (selectedAction.kind === "dismiss") {
				resolve(selectedAction);
				return;
			}
			if (acceptArmed) {
				resolve(selectedAction);
				return;
			}
			acceptArmed = true;
			prompt?.setConfirmation("Press Enter again to start this task.");
			deps.requestRender();
		};
		selector.onCancel = () => {
			if (activeSelector !== selector) return;
			hiddenIds.add(suggestion.id);
			closeActive();
			deps.chatLog.addSystem("follow-up task hidden; suggestion remains pending");
			presentNext();
			deps.requestRender();
		};
		prompt = new TaskPrompt(suggestion, selector, deps.requestRender);
		activeOverlay = deps.openOverlay(prompt);
		deps.requestRender();
	};
	const refreshRunner = createTuiRefreshCoalescer(async (requestRerun) => {
		const startRevision = revision;
		const listed = await deps.client.listTaskSuggestions?.();
		if (disposed || !listed) return false;
		if (revision !== startRevision) {
			requestRerun();
			return true;
		}
		suggestions.clear();
		for (const value of listed) {
			const suggestion = parseTuiTaskSuggestion(value);
			if (suggestion) suggestions.set(suggestion.id, suggestion);
		}
		for (const id of hiddenIds) if (!suggestions.has(id)) hiddenIds.delete(id);
		return true;
	}, () => {
		if (activeId && !suggestions.has(activeId)) closeActive();
		presentNext();
		deps.requestRender();
	});
	const refresh = async () => {
		if (disposed || !deps.client.listTaskSuggestions) return;
		await refreshRunner.run();
	};
	return {
		handleEvent(event, payload) {
			const record = asOptionalObjectRecord(payload);
			if (disposed || event !== "task.suggestion" || !record) return;
			if (record.action === "created") {
				const suggestion = parseTuiTaskSuggestion(record.suggestion);
				if (suggestion) {
					revision += 1;
					hiddenIds.delete(suggestion.id);
					suggestions.set(suggestion.id, suggestion);
					presentNext();
				}
				return;
			}
			if (record.action === "resolved" && typeof record.taskId === "string") {
				remove(record.taskId);
				presentNext();
				deps.requestRender();
			}
		},
		refresh,
		sessionChanged() {
			if (disposed) return;
			hiddenIds.clear();
			const active = activeId ? suggestions.get(activeId) : void 0;
			if (active && !matchesSession(active)) closeActive();
			presentNext();
			deps.requestRender();
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			suggestions.clear();
			hiddenIds.clear();
			closeActive();
			deps.requestRender();
		}
	};
}
//#endregion
//#region src/tui/tui-waiting.ts
/** Default phrase cycle for animated waiting status. */
const defaultWaitingPhrases = [
	"flibbertigibbeting",
	"kerfuffling",
	"dillydallying",
	"twiddling thumbs",
	"noodling",
	"bamboozling",
	"moseying",
	"hobnobbing",
	"pondering",
	"conjuring"
];
/** Picks a stable phrase for a timer tick. */
function pickWaitingPhrase(tick, phrases = defaultWaitingPhrases) {
	return phrases[Math.floor(tick / 10) % phrases.length] ?? phrases[0] ?? "waiting";
}
/** Applies a moving highlight window to status text. */
function shimmerText(theme, text, tick) {
	const width = 6;
	const hi = (ch) => theme.bold(theme.accentSoft(ch));
	const pos = tick % (text.length + width);
	const start = Math.max(0, pos - width);
	const end = Math.min(text.length - 1, pos);
	let out = "";
	for (let i = 0; i < text.length; i++) {
		const ch = text.charAt(i);
		out += i >= start && i <= end ? hi(ch) : theme.dim(ch);
	}
	return out;
}
/** Builds the single-line waiting status shown while a TUI run is active. */
function buildWaitingStatusMessage(params) {
	const phrase = pickWaitingPhrase(params.tick, params.phrases);
	return `${shimmerText(params.theme, `${phrase}…`, params.tick)} • ${params.elapsed} | ${params.connectionStatus}`;
}
//#endregion
//#region src/tui/tui.ts
const OPENAI_CODEX_PROVIDER = "openai";
const CODEX_CLI_LOOKUP_TIMEOUT_MS = 5e3;
const TUI_AUTH_COMMAND_MAX_CHARS = 320;
const SESSION_SUBSCRIPTION_MAX_ATTEMPTS = 5;
const SESSION_SUBSCRIPTION_RETRY_DELAY_MS = 25;
const tuiAuthLog = createSubsystemLogger("tui/auth");
/** Resolve the absolute path to the `codex` CLI binary, or `null` if not installed. */
async function resolveCodexCliBin() {
	if (process.platform === "win32") {
		const pathEnv = process.env.PATH ?? process.env.Path ?? "";
		return resolveExecutableFromPathEnv("codex", pathEnv, process.env, { includeExtensionless: false }) ?? resolveExecutableFromPathEnv("codex", pathEnv, process.env, { includeExtensionless: true }) ?? null;
	}
	try {
		const result = await runCommandWithTimeout(["which", "codex"], {
			killSignal: "SIGKILL",
			maxOutputBytes: 65536,
			timeoutMs: CODEX_CLI_LOOKUP_TIMEOUT_MS
		});
		if (result.code !== 0 || result.termination !== "exit") return null;
		return result.stdout.trim().split(/\r?\n/)[0]?.trim() || null;
	} catch {
		return null;
	}
}
function resolveLocalAuthSpawnInvocation(params) {
	const platform = params.platform ?? process.platform;
	if (!isWindowsBatchCommand(params.command.trim(), platform)) return {
		command: params.command,
		args: params.args,
		options: {}
	};
	return {
		command: resolveTrustedWindowsCmdExe(platform),
		args: [
			"/d",
			"/s",
			"/c",
			buildWindowsCmdExeCommandLine(params.command, params.args)
		],
		options: {
			windowsHide: true,
			windowsVerbatimArguments: true
		}
	};
}
function resolveTuiLocalAuthCliInvocation(params) {
	const provider = params.provider?.trim();
	return resolveCurrentOpenClawCliInvocation([
		"models",
		"auth",
		"login",
		...provider ? ["--provider", provider] : []
	], { execArgv: params.execArgv ?? process.execArgv });
}
function formatTuiAuthCommandArgv(command, args) {
	const value = sanitizeRenderableLine(redactToolPayloadText(JSON.stringify([command, ...args])));
	return value.length > TUI_AUTH_COMMAND_MAX_CHARS ? `${truncateUtf16Safe(value, 319)}…` : value;
}
function resolveTuiSessionKey(params) {
	const trimmed = (params.raw ?? "").trim();
	if (!trimmed) return resolveCanonicalMainSessionKey({
		agentId: params.currentAgentId,
		mainKey: params.sessionMainKey,
		sessionScope: params.sessionScope
	});
	if (parseAgentSessionKey(trimmed)?.rest === "global") return "global";
	if (trimmed === "global" || trimmed === "unknown") return trimmed;
	return toAgentStoreSessionKey({
		agentId: params.currentAgentId,
		requestKey: trimmed,
		mainKey: params.sessionMainKey
	});
}
function resolveTuiSessionSelection(params) {
	const trimmed = (params.raw ?? "").trim();
	const parsed = parseAgentSessionKey(trimmed);
	const persistedOwner = trimmed ? resolvePersistedSessionStoreOwnerForKey(params.cfg, trimmed) : void 0;
	const agentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : persistedOwner?.kind === "configured" ? persistedOwner.agentId : trimmed ? resolveSessionAgentId({
		config: params.cfg,
		sessionKey: trimmed,
		fallbackAgentId: params.currentAgentId
	}) : params.currentAgentId;
	const mainKey = normalizeMainKey(params.sessionMainKey);
	return {
		key: !parsed && persistedOwner?.kind === "configured" && trimmed !== "global" && trimmed !== "unknown" && trimmed.toLowerCase() !== "main" && trimmed.toLowerCase() !== mainKey ? trimmed : resolveTuiSessionKey({
			raw: trimmed,
			sessionScope: params.sessionScope,
			currentAgentId: agentId,
			sessionMainKey: params.sessionMainKey
		}),
		agentId
	};
}
function resolveInitialTuiAgentId(params) {
	const initialSessionInput = (params.initialSessionInput ?? "").trim();
	const explicitAgentId = resolveExplicitInitialTuiAgentId(params);
	if (explicitAgentId) return explicitAgentId;
	const effectiveUnscopedSessionKey = initialSessionInput ? initialSessionInput : params.cfg.session?.scope === "global" ? "global" : void 0;
	if (effectiveUnscopedSessionKey) return resolveSessionAgentId({
		config: params.cfg,
		sessionKey: effectiveUnscopedSessionKey,
		fallbackAgentId: params.fallbackAgentId
	});
	const cwd = params.cwd ?? tryProcessCwd();
	const inferredFromWorkspace = cwd ? resolveAgentIdByWorkspacePath(params.cfg, cwd) : null;
	if (inferredFromWorkspace) return inferredFromWorkspace;
	return normalizeAgentId(params.fallbackAgentId ?? tryResolveLegacyCompatibilityAgentId(params.cfg) ?? resolveDefaultAgentId(params.cfg, {
		surface: "TUI startup",
		hint: `Pass an agent-scoped --session key (e.g., '${formatCliCommand("openclaw tui --session agent:agentname:main")}').`
	}));
}
function resolveExplicitInitialTuiAgentId(params) {
	const explicitAgentId = parseAgentSessionKey((params.initialSessionInput ?? "").trim())?.agentId ?? params.agentId?.trim();
	return explicitAgentId ? normalizeAgentId(explicitAgentId) : null;
}
function resolveGatewayDisconnectState(input = {}) {
	if (input.reason === "gateway starting") return {
		connectionStatus: "gateway starting",
		activityStatus: "starting up"
	};
	const failure = classifyGatewayConnectFailure(input);
	const reasonLabel = failure.userMessage === "gateway unreachable" ? "closed" : failure.userMessage;
	if (failure.kind === "pairing-required") return {
		connectionStatus: `gateway disconnected: ${reasonLabel}`,
		activityStatus: "device approval needed: preview latest request",
		remediation: failure.remediation
	};
	if (failure.kind === "rate-limited") return {
		connectionStatus: `gateway disconnected: ${reasonLabel}`,
		activityStatus: "gateway authentication temporarily rate-limited",
		remediation: failure.remediation
	};
	if (failure.kind === "identity-proxy") return {
		connectionStatus: `gateway disconnected: ${reasonLabel}`,
		activityStatus: "identity-aware proxy rejected connection",
		remediation: failure.remediation
	};
	return {
		connectionStatus: `gateway disconnected: ${reasonLabel}`,
		activityStatus: failure.remediation ? "gateway authentication needs attention" : "idle",
		remediation: failure.remediation
	};
}
function createBackspaceDeduper(params) {
	const dedupeWindowMs = Math.max(0, Math.floor(params?.dedupeWindowMs ?? 8));
	const now = params?.now ?? (() => Date.now());
	let previousBackspace;
	return (data) => {
		if (data !== "\b" && data !== "" || !matchesKey(data, "backspace")) {
			previousBackspace = void 0;
			return data;
		}
		const at = now();
		const isDuplicate = previousBackspace !== void 0 && previousBackspace.data !== data && at - previousBackspace.at <= dedupeWindowMs;
		previousBackspace = isDuplicate ? void 0 : {
			data,
			at
		};
		return isDuplicate ? "" : data;
	};
}
function isIgnorableTuiStopError(error) {
	if (!error || typeof error !== "object") return false;
	const err = error;
	const code = typeof err.code === "string" ? err.code : "";
	const syscall = typeof err.syscall === "string" ? err.syscall : "";
	const message = typeof err.message === "string" ? err.message : "";
	if (code === "EBADF" && syscall === "setRawMode") return true;
	return /setRawMode/i.test(message) && /EBADF/i.test(message);
}
function stopTuiSafely(stop) {
	try {
		stop();
	} catch (error) {
		if (!isIgnorableTuiStopError(error)) throw error;
	}
}
function isTuiTerminalLossError(error) {
	if (!error || typeof error !== "object") return false;
	const err = error;
	const code = typeof err.code === "string" ? err.code : "";
	const message = typeof err.message === "string" ? err.message : "";
	const syscall = typeof err.syscall === "string" ? err.syscall : "";
	if (code === "EIO" || code === "EPIPE") return true;
	return /\b(EIO|EPIPE)\b/i.test(message) && /\b(read|write|TTY|stdin|stdout)\b/i.test(message + syscall);
}
function installTuiTerminalLossExitHandler(requestExit, targets = {
	stdin: process.stdin,
	stdout: process.stdout
}) {
	let requested = false;
	const requestOnce = () => {
		if (requested) return;
		requested = true;
		requestExit();
	};
	const removeUncaughtExceptionHandler = registerUncaughtExceptionHandler((error) => {
		if (!isTuiTerminalLossError(error)) return false;
		requestOnce();
		return true;
	});
	const onClose = () => requestOnce();
	targets.stdin?.on("end", onClose);
	targets.stdin?.on("close", onClose);
	targets.stdout?.on("close", onClose);
	return () => {
		removeUncaughtExceptionHandler();
		targets.stdin?.off("end", onClose);
		targets.stdin?.off("close", onClose);
		targets.stdout?.off("close", onClose);
	};
}
function createDeferredTuiFinish() {
	let finishTui = null;
	let finishRequested = false;
	return {
		requestFinish: () => {
			const finish = finishTui;
			if (finish) {
				finish();
				return;
			}
			finishRequested = true;
		},
		setFinish: (finish) => {
			finishTui = finish;
			if (finishRequested) finish();
		},
		clearFinish: () => {
			finishTui = null;
		}
	};
}
const TUI_SHUTDOWN_DRAIN_MAX_MS = 500;
const TUI_SHUTDOWN_DRAIN_IDLE_MS = 100;
const TUI_SHUTDOWN_HARD_EXIT_MS = 2e3;
const TUI_PROCESS_EXIT_AFTER_RETURN_MS = 2e3;
function createTuiSignalHandlers(params) {
	return {
		sigintHandler: params.handleCtrlC,
		sigtermHandler: params.requestExit,
		sighupHandler: params.requestExit
	};
}
async function drainAndStopTuiSafely(tui) {
	if (typeof tui.terminal?.drainInput === "function") try {
		await tui.terminal.drainInput(TUI_SHUTDOWN_DRAIN_MAX_MS, TUI_SHUTDOWN_DRAIN_IDLE_MS);
	} catch {}
	stopTuiSafely(() => tui.stop());
}
const TUI_BUSY_ACTIVITY_STATUSES = /* @__PURE__ */ new Set([
	"sending",
	"waiting",
	"streaming",
	"running",
	"finishing context",
	"starting up"
]);
function isTuiBusyActivityStatus(status) {
	return TUI_BUSY_ACTIVITY_STATUSES.has(status);
}
function resolveTuiToolsToggleActivityStatus(params) {
	const toolsStatus = params.toolsExpanded ? "tools expanded" : "tools collapsed";
	if (isTuiBusyActivityStatus(params.currentStatus)) return params.currentStatus;
	return toolsStatus;
}
function resolveTuiShutdownHardExitMs(params = {}) {
	return TUI_SHUTDOWN_HARD_EXIT_MS + (params.localMode ? resolveLocalRunShutdownGraceMs() : 0);
}
function scheduleProcessExitAfterTuiReturn(params = {}) {
	const delayMs = Math.max(0, Math.floor(params.delayMs ?? TUI_PROCESS_EXIT_AFTER_RETURN_MS));
	const timer = setTimeout(() => {
		try {
			process.stderr.write("openclaw tui forcing process exit after return\n");
		} catch {}
		process.exit(0);
	}, delayMs);
	timer.unref();
	return timer;
}
function cancelProcessExitAfterTuiReturn(timer) {
	clearTimeout(timer);
}
function resolveCtrlCAction(params) {
	const exitWindowMs = Math.max(1, Math.floor(params.exitWindowMs ?? 1e3));
	if (params.hasInput) return {
		action: "clear",
		nextLastCtrlCAt: params.now
	};
	if (params.now - params.lastCtrlCAt <= exitWindowMs) return {
		action: "exit",
		nextLastCtrlCAt: params.lastCtrlCAt
	};
	return {
		action: "warn",
		nextLastCtrlCAt: params.now
	};
}
function resolveTuiCtrlCAction(params) {
	if (params.exitRequested === true) return {
		action: "force-exit",
		nextLastCtrlCAt: params.lastCtrlCAt
	};
	if (params.hasInput) return resolveCtrlCAction(params);
	if (params.wasDisconnected === true) return {
		action: "exit",
		nextLastCtrlCAt: params.lastCtrlCAt
	};
	return resolveCtrlCAction(params);
}
function createTuiConnectionLineage() {
	let hasConnected = false;
	let wasDisconnected = false;
	return {
		connect: () => {
			const reconnected = wasDisconnected;
			hasConnected = true;
			wasDisconnected = false;
			return reconnected;
		},
		disconnect: () => {
			if (hasConnected) wasDisconnected = true;
		},
		wasDisconnected: () => wasDisconnected
	};
}
function resolveEmptySessionInfoDefaults(config) {
	return { verboseLevel: config.agents?.defaults?.verboseDefault };
}
function formatActiveGatewayTuiRefusal(identity) {
	return `A Gateway is running for this state directory (pid ${identity.pid}, port ${identity.port}). Run without --local to use it, or stop the Gateway first (${formatCliCommand("openclaw gateway stop")}).`;
}
/** Hold canonical state ownership for the complete lifetime of a local TUI. */
async function withEmbeddedTuiStateLock(run, deps = {}) {
	const { acquireEmbeddedStateLock, createEmbeddedStateSignalBridge } = await import("./embedded-state-lock-BYJUg_WD.mjs");
	const signalBridge = createEmbeddedStateSignalBridge(deps.process ?? process);
	let stateLock;
	try {
		stateLock = await acquireEmbeddedStateLock({
			options: deps.gatewayLockOptions,
			signal: signalBridge.signal,
			formatActiveGatewayRefusal: formatActiveGatewayTuiRefusal
		});
		return await run(signalBridge.signal);
	} finally {
		await stateLock?.release();
		signalBridge.dispose();
	}
}
async function runTui(opts) {
	if (opts.local === true && opts.backend === void 0) return await withEmbeddedTuiStateLock(async () => await runTuiUnlocked(opts));
	return await runTuiUnlocked(opts);
}
var TuiSessionIdentityState = class {
	constructor(agentId) {
		this.agentId = agentId;
		this.sessionKey = "";
		this.sessionId = null;
		this.generations = /* @__PURE__ */ new Map();
		this.sessionIds = /* @__PURE__ */ new Map();
	}
	generationKey() {
		return JSON.stringify([this.agentId, this.sessionKey]);
	}
};
async function runTuiUnlocked(opts) {
	const isLocalMode = opts.local === true || opts.backend !== void 0;
	const config = opts.config ?? getRuntimeConfig({ skipPluginValidation: !isLocalMode });
	const cliInvocation = resolveCurrentOpenClawCliInvocation([]);
	const resolveUsableCwd = () => tryProcessCwd() ?? cliInvocation.cwd;
	const emptySessionInfoDefaults = resolveEmptySessionInfoDefaults(config);
	const initialSessionInput = (opts.session ?? "").trim();
	const sessionScope = config.session?.scope ?? "per-sender";
	const sessionMainKey = normalizeMainKey(config.session?.mainKey);
	const configuredDefaultAgentId = tryResolveDefaultAgentId(config);
	const initialAgentId = resolveInitialTuiAgentId({
		cfg: config,
		fallbackAgentId: configuredDefaultAgentId,
		initialSessionInput,
		agentId: opts.agentId
	});
	const agentDefaultId = configuredDefaultAgentId ?? initialAgentId;
	const agentNames = /* @__PURE__ */ new Map();
	let rememberedSessionApplied = false;
	let connectionGeneration = 0;
	const connectionLineage = createTuiConnectionLineage();
	let remediationShown = false;
	const localRunIds = createTuiRunIdTracker();
	const localBtwRunIds = createTuiRunIdTracker();
	const deliverDefault = opts.deliver ?? false;
	const autoMessage = opts.message?.trim();
	const thinkingLevelOverride = normalizeThinkLevel(opts.thinking);
	let dynamicSlashCommands = [];
	let dynamicSlashCommandsKey = null;
	let dynamicSlashCommandsInFlightKey = null;
	let dynamicSlashCommandsRequestId = 0;
	let dynamicSlashCommandsReady = false;
	let dynamicSlashCommandsRefreshTimer = null;
	let exitRequested = false;
	let exitResult = { exitReason: "exit" };
	const authChild = createTuiAuthChildOwner();
	let statusTimer = null;
	let statusStartedAt = null;
	let lastActivityStatus = "idle";
	let invalidateSessionRunOwnership = () => void 0;
	let notifySessionChanged = () => void 0;
	let reconcileReconnectRun = () => void 0;
	const state = {
		sessionIdentity: new TuiSessionIdentityState(initialAgentId),
		agentDefaultId,
		sessionMainKey,
		sessionScope,
		agents: [],
		get currentAgentId() {
			return this.sessionIdentity.agentId;
		},
		set currentAgentId(value) {
			if (this.sessionIdentity.agentId === value) return;
			this.sessionIdentity.agentId = value;
			invalidateSessionRunOwnership();
			notifySessionChanged();
		},
		get currentSessionKey() {
			return this.sessionIdentity.sessionKey;
		},
		set currentSessionKey(value) {
			this.sessionIdentity.sessionKey = value;
			notifySessionChanged();
		},
		get currentSessionId() {
			return this.sessionIdentity.sessionId;
		},
		set currentSessionId(value) {
			if (value) {
				const generationKey = this.sessionIdentity.generationKey();
				const previousSessionId = this.sessionIdentity.sessionIds.get(generationKey);
				if (previousSessionId && previousSessionId !== value) this.sessionGeneration += 1;
				this.sessionIdentity.sessionIds.set(generationKey, value);
			}
			this.sessionIdentity.sessionId = value;
		},
		get sessionGeneration() {
			const generationKey = this.sessionIdentity.generationKey();
			return this.sessionIdentity.generations.get(generationKey) ?? 0;
		},
		set sessionGeneration(value) {
			const generationKey = this.sessionIdentity.generationKey();
			this.sessionIdentity.generations.set(generationKey, Math.max(this.sessionGeneration, value));
		},
		activeChatRunId: null,
		pendingSubmit: null,
		historyLoaded: false,
		sessionInfo: { ...emptySessionInfoDefaults },
		initialSessionApplied: false,
		isConnected: false,
		autoMessageSent: false,
		toolsExpanded: false,
		showThinking: false,
		connectionStatus: isLocalMode ? "starting local runtime" : "connecting",
		activityStatus: "idle",
		statusTimeout: null,
		lastCtrlCAt: 0
	};
	let client;
	if (opts.backend) client = opts.backend;
	else if (opts.local) {
		const { EmbeddedTuiBackend } = await import("./embedded-backend-D-V83v7B.mjs");
		client = new EmbeddedTuiBackend();
	} else {
		const { GatewayChatClient } = await import("./gateway-chat-Bfoz8yI8.mjs");
		client = opts.boundGateway ? await GatewayChatClient.connectBound({
			config,
			...opts.boundGateway
		}) : await GatewayChatClient.connect({
			url: opts.url,
			token: opts.token,
			password: opts.password,
			tlsFingerprint: opts.tlsFingerprint
		});
	}
	const previousConsoleSubsystemFilter = isLocalMode ? loggingState.consoleSubsystemFilter ? [...loggingState.consoleSubsystemFilter] : null : null;
	if (isLocalMode) setConsoleSubsystemFilter(["__openclaw_tui_quiet__"]);
	const tui = new TuiMainScreen(new ProcessTerminal());
	const dedupeBackspace = createBackspaceDeduper();
	tui.addInputListener((data) => {
		const next = dedupeBackspace(data);
		if (next.length === 0) return { consume: true };
		return { data: next };
	});
	const header = new Text("", 1, 0);
	const statusContainer = new Container();
	const footer = new Text("", 1, 0);
	const questionStatus = new Text("", 1, 0);
	const loadImage = client.loadImage?.bind(client);
	const chatLog = new ChatLog(180, loadImage ? {
		loadImage,
		getScope: () => ({
			sessionKey: state.currentSessionKey,
			agentId: state.currentAgentId
		}),
		requestRender: () => tui.requestRender()
	} : void 0);
	const connectionNotices = [];
	const addConnectionNotice = (text) => {
		connectionNotices.push(text);
		if (connectionNotices.length > 12) connectionNotices.shift();
		chatLog.addSystem(text, { coalesceConsecutive: true });
	};
	const restoreConnectionNotices = () => {
		for (const notice of connectionNotices) chatLog.addSystem(notice, { coalesceConsecutive: true });
	};
	const editor = new CustomEditor(tui, editorTheme);
	const root = new Container();
	root.addChild(header);
	root.addChild(chatLog);
	root.addChild(statusContainer);
	root.addChild(footer);
	root.addChild(questionStatus);
	root.addChild(editor);
	const resolveDynamicSlashCommandsKey = () => state.currentAgentId;
	let autocompleteFdPath;
	const applyAutocompleteProvider = () => {
		const dynamicKey = resolveDynamicSlashCommandsKey();
		const slashCommands = getSlashCommands({
			cfg: config,
			local: isLocalMode,
			provider: state.sessionInfo.modelProvider,
			model: state.sessionInfo.model,
			agentRuntime: state.sessionInfo.agentRuntime?.id,
			thinkingLevels: state.sessionInfo.thinkingLevels,
			dynamicCommands: dynamicSlashCommandsKey === dynamicKey ? dynamicSlashCommands : []
		});
		editor.shouldSubmitAutocomplete = (text) => shouldSubmitExactArgumentCompletion(text, slashCommands);
		editor.setAutocompleteProvider(createTuiAutocompleteProvider(slashCommands, resolveUsableCwd(), autocompleteFdPath));
	};
	import("./tools-manager-DWWtYv7K.mjs").then(({ ensureTool }) => ensureTool("fd", true)).then((fdPath) => {
		if (fdPath) {
			autocompleteFdPath = fdPath;
			applyAutocompleteProvider();
		}
	});
	const clearDynamicSlashCommandsRefreshTimer = () => {
		if (!dynamicSlashCommandsRefreshTimer) return;
		clearTimeout(dynamicSlashCommandsRefreshTimer);
		dynamicSlashCommandsRefreshTimer = null;
	};
	const refreshDynamicSlashCommands = () => {
		clearDynamicSlashCommandsRefreshTimer();
		const key = resolveDynamicSlashCommandsKey();
		if (!dynamicSlashCommandsReady || !state.isConnected || !client.listCommands || dynamicSlashCommandsKey === key || dynamicSlashCommandsInFlightKey === key) return;
		dynamicSlashCommandsInFlightKey = key;
		const requestId = ++dynamicSlashCommandsRequestId;
		const agentId = state.currentAgentId;
		client.listCommands({
			agentId,
			scope: "text",
			includeArgs: false
		}).then((commands) => {
			if (requestId !== dynamicSlashCommandsRequestId || key !== resolveDynamicSlashCommandsKey()) return;
			dynamicSlashCommands = commands;
			dynamicSlashCommandsKey = key;
			applyAutocompleteProvider();
		}).catch(() => void 0).finally(() => {
			if (dynamicSlashCommandsInFlightKey === key) dynamicSlashCommandsInFlightKey = null;
		});
	};
	const scheduleDynamicSlashCommandsRefresh = () => {
		if (!dynamicSlashCommandsReady || dynamicSlashCommandsRefreshTimer || dynamicSlashCommandsKey === resolveDynamicSlashCommandsKey()) return;
		dynamicSlashCommandsRefreshTimer = setTimeout(refreshDynamicSlashCommands, 0);
		dynamicSlashCommandsRefreshTimer.unref?.();
	};
	const updateAutocompleteProvider = () => {
		applyAutocompleteProvider();
		scheduleDynamicSlashCommandsRefresh();
	};
	tui.addChild(root);
	tui.setFocus(editor);
	const formatSessionKey = (key) => {
		if (key === "global" || key === "unknown") return key;
		return parseAgentSessionKey(key)?.rest ?? key;
	};
	const formatAgentLabel = (id) => {
		const name = agentNames.get(id);
		return name ? `${id} (${name})` : id;
	};
	const resolveSessionSelection = (raw, agentId = state.currentAgentId) => {
		return resolveTuiSessionSelection({
			raw,
			cfg: config,
			sessionScope: state.sessionScope,
			currentAgentId: agentId,
			sessionMainKey: state.sessionMainKey
		});
	};
	state.sessionIdentity.sessionKey = resolveSessionSelection(initialSessionInput).key;
	let provisionalSessionLabel = null;
	const resolveRememberedCandidate = async () => {
		const remembered = await readTuiLastSessionKey({ scopeKey: buildLastSessionScopeKeyFor() });
		if (!remembered) return null;
		const selection = resolveSessionSelection(remembered);
		const key = selection?.key ?? null;
		if (!key || key === state.currentSessionKey) return null;
		const agentId = selection?.agentId;
		if (agentId && normalizeAgentId(agentId) !== state.currentAgentId) return null;
		return { key };
	};
	const buildLastSessionScopeKeyFor = (sessionKey = state.currentSessionKey) => {
		const parsed = parseAgentSessionKey(sessionKey);
		return buildTuiLastSessionScopeKey({
			connectionUrl: client.connection.url,
			agentId: parsed?.agentId ?? state.currentAgentId,
			sessionScope: state.sessionScope
		});
	};
	const rememberCurrentSessionKey = createRememberSessionKeyWriter({
		buildScopeKey: buildLastSessionScopeKeyFor,
		reportFailure: (message) => {
			chatLog.addSystem(`session memory write failed: ${message}`);
			tui.requestRender();
		},
		write: writeTuiLastSessionKey
	});
	const restoreRememberedSession = async (expectedConnectionGeneration) => {
		if (initialSessionInput || rememberedSessionApplied) return;
		const candidate = await resolveRememberedCandidate();
		if (expectedConnectionGeneration !== connectionGeneration || exitRequested) return;
		if (!candidate) {
			provisionalSessionLabel = null;
			rememberedSessionApplied = true;
			return;
		}
		const rememberedKey = candidate.key;
		const description = await client.describeSession({
			sessionKey: rememberedKey,
			agentId: state.currentAgentId
		}).catch(() => null);
		if (expectedConnectionGeneration !== connectionGeneration || exitRequested) return;
		if (!description) {
			provisionalSessionLabel = null;
			return;
		}
		rememberedSessionApplied = true;
		const restored = resolveRememberedTuiSessionKey({
			rememberedKey,
			currentAgentId: state.currentAgentId,
			sessions: description.session && description.session.key !== "unknown" ? [description.session] : []
		});
		if (!restored || restored === state.currentSessionKey) {
			provisionalSessionLabel = null;
			return;
		}
		state.currentSessionKey = restored;
		provisionalSessionLabel = null;
		updateHeader();
		updateFooter();
	};
	const updateHeader = () => {
		const sessionLabel = provisionalSessionLabel ?? formatSessionKey(state.currentSessionKey);
		const agentLabel = formatAgentLabel(state.currentAgentId);
		const text = `${opts.title ?? "openclaw tui"} - ${client.connection.url} - agent ${agentLabel} - session ${sessionLabel}`;
		header.setText(tuiTheme.header(sanitizeRenderableLine(text)));
	};
	let statusText = null;
	let statusLoader = null;
	const formatElapsed = (startMs) => {
		const totalSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1e3));
		if (totalSeconds < 60) return `${totalSeconds}s`;
		return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
	};
	const ensureStatusText = () => {
		if (statusText) return;
		statusContainer.clear();
		statusLoader?.stop();
		statusLoader = null;
		statusText = new Text("", 1, 0);
		statusContainer.addChild(statusText);
	};
	const ensureStatusLoader = () => {
		if (statusLoader) return;
		statusContainer.clear();
		statusText = null;
		statusLoader = new Loader(tui, (spinner) => tuiTheme.accent(spinner), (text) => tuiTheme.bold(tuiTheme.accentSoft(text)), "");
		statusContainer.addChild(statusLoader);
	};
	let waitingTick = 0;
	let waitingTimer = null;
	let waitingPhrase = null;
	const updateBusyStatusMessage = () => {
		if (!statusLoader || !statusStartedAt) return;
		const elapsed = formatElapsed(statusStartedAt);
		if (state.activityStatus === "waiting") {
			waitingTick++;
			statusLoader.setMessage(buildWaitingStatusMessage({
				theme: tuiTheme,
				tick: waitingTick,
				elapsed,
				connectionStatus: state.connectionStatus,
				phrases: waitingPhrase ? [waitingPhrase] : void 0
			}));
			return;
		}
		statusLoader.setMessage(`${state.activityStatus} • ${elapsed} | ${state.connectionStatus}`);
	};
	const startStatusTimer = () => {
		if (statusTimer) return;
		statusTimer = setInterval(() => {
			if (!isTuiBusyActivityStatus(state.activityStatus)) return;
			updateBusyStatusMessage();
		}, 1e3);
	};
	const stopStatusTimer = () => {
		if (!statusTimer) return;
		clearInterval(statusTimer);
		statusTimer = null;
	};
	const stopStatusTimeout = () => {
		if (!state.statusTimeout) return;
		clearTimeout(state.statusTimeout);
		state.statusTimeout = null;
	};
	const startWaitingTimer = () => {
		if (waitingTimer) return;
		if (!waitingPhrase) {
			const idx = Math.floor(Math.random() * defaultWaitingPhrases.length);
			waitingPhrase = defaultWaitingPhrases[idx] ?? defaultWaitingPhrases[0] ?? "waiting";
		}
		waitingTick = 0;
		waitingTimer = setInterval(() => {
			if (state.activityStatus !== "waiting") return;
			updateBusyStatusMessage();
		}, 120);
	};
	const stopWaitingTimer = () => {
		if (!waitingTimer) return;
		clearInterval(waitingTimer);
		waitingTimer = null;
		waitingPhrase = null;
	};
	const disposeStatus = () => {
		stopStatusTimer();
		stopWaitingTimer();
		stopStatusTimeout();
		clearDynamicSlashCommandsRefreshTimer();
		dynamicSlashCommandsRequestId += 1;
		statusLoader?.stop();
		statusLoader = null;
	};
	const renderStatus = () => {
		if (isTuiBusyActivityStatus(state.activityStatus)) {
			if (!statusStartedAt || lastActivityStatus !== state.activityStatus) statusStartedAt = Date.now();
			ensureStatusLoader();
			if (state.activityStatus === "waiting") {
				stopStatusTimer();
				startWaitingTimer();
			} else {
				stopWaitingTimer();
				startStatusTimer();
			}
			updateBusyStatusMessage();
		} else {
			statusStartedAt = null;
			stopStatusTimer();
			stopWaitingTimer();
			statusLoader?.stop();
			statusLoader = null;
			ensureStatusText();
			const text = state.activityStatus ? `${state.connectionStatus} | ${state.activityStatus}` : state.connectionStatus;
			statusText?.setText(tuiTheme.dim(text));
		}
		lastActivityStatus = state.activityStatus;
	};
	const setConnectionStatus = (text, ttlMs) => {
		state.connectionStatus = sanitizeRenderableLine(text);
		renderStatus();
		if (state.statusTimeout) stopStatusTimeout();
		if (ttlMs && ttlMs > 0) state.statusTimeout = setTimeout(() => {
			state.connectionStatus = state.isConnected ? isLocalMode ? "local ready" : "connected" : isLocalMode ? "local stopped" : "disconnected";
			renderStatus();
		}, ttlMs);
	};
	const setActivityStatus = (text) => {
		state.activityStatus = text;
		renderStatus();
	};
	const withTuiSuspended = async (work) => {
		await drainAndStopTuiSafely(tui);
		if (isLocalMode) setConsoleSubsystemFilter(previousConsoleSubsystemFilter);
		try {
			return await work();
		} finally {
			if (!exitRequested) {
				if (isLocalMode) setConsoleSubsystemFilter(["__openclaw_tui_quiet__"]);
				tui.start();
				tui.setFocus(editor);
				updateHeader();
				updateFooter();
				tui.requestRender(true);
			}
		}
	};
	const runAuthFlow = isLocalMode ? async (params) => await withTuiSuspended(async () => {
		const provider = params.provider?.trim() || void 0;
		const codexBin = provider === OPENAI_CODEX_PROVIDER ? await resolveCodexCliBin() : null;
		let command;
		let args;
		let cwd;
		if (codexBin) {
			command = codexBin;
			args = ["login"];
			cwd = resolveUsableCwd();
		} else {
			const invocation = resolveTuiLocalAuthCliInvocation({ provider });
			({command, args, cwd} = invocation);
		}
		const invocation = resolveLocalAuthSpawnInvocation({
			command,
			args
		});
		const commandArgv = formatTuiAuthCommandArgv(command, args);
		tuiAuthLog.info(`auth child spawn: argv=${commandArgv}`);
		try {
			const result = await authChild.spawnAndWait(() => spawn(invocation.command, invocation.args, {
				cwd,
				env: process.env,
				stdio: "inherit",
				...invocation.options
			}));
			const outcome = `argv=${commandArgv} exitCode=${String(result.exitCode)} signal=${String(result.signal)}`;
			if (result.exitCode === 0 && !result.signal) {
				tuiAuthLog.info(`auth child finished: ${outcome}`);
				if (!codexBin) {
					reloadSharedAuthStoreOwnership();
					clearRuntimeAuthProfileStoreSnapshots();
				}
			} else tuiAuthLog.error(`auth child failed: ${outcome}`);
			return {
				...result,
				commandArgv
			};
		} catch (error) {
			tuiAuthLog.error(`auth child failed to start: argv=${commandArgv} error=${formatTuiErrorMessage(error)}`);
			throw error;
		}
	}) : void 0;
	const updateFooter = () => {
		const sessionKeyLabel = provisionalSessionLabel ?? formatSessionKey(state.currentSessionKey);
		const sessionLabel = state.sessionInfo.displayName ? `${sessionKeyLabel} (${state.sessionInfo.displayName})` : sessionKeyLabel;
		const agentLabel = formatAgentLabel(state.currentAgentId);
		footer.setText(tuiTheme.dim(formatTuiFooter({
			agentLabel,
			sessionLabel,
			sessionInfo: state.sessionInfo,
			thinkingLevel: thinkingLevelOverride ?? state.sessionInfo.thinkingLevel,
			deliver: deliverDefault
		})));
	};
	const { openOverlay, closeOverlay } = createOverlayHandlers(tui, editor);
	const questions = createTuiQuestionController({
		client,
		chatLog,
		getAgentId: () => state.currentAgentId,
		getSessionKey: () => state.currentSessionKey,
		openOverlay,
		closeOverlay,
		requestRender: () => tui.requestRender(),
		onPendingChange: (text) => questionStatus.setText(tuiTheme.accent(text))
	});
	const reportQuestionRefreshError = () => {
		chatLog.addSystem("question refresh failed; reconnect or use /question to retry");
		tui.requestRender();
	};
	const refreshQuestions = async () => {
		try {
			await questions.refresh();
		} catch {
			reportQuestionRefreshError();
		}
	};
	const pluginApprovals = createTuiPluginApprovalController({
		client,
		chatLog,
		getAgentId: () => state.currentAgentId,
		getSessionKey: () => state.currentSessionKey,
		openOverlay,
		closeOverlay,
		requestRender: () => tui.requestRender()
	});
	const btw = {
		showResult: (params) => {
			chatLog.showBtw(params);
		},
		clear: () => {
			chatLog.dismissBtw();
		}
	};
	const initialSessionAgentId = initialSessionInput ? state.currentAgentId : null;
	const { refreshAgents, refreshSessionInfo, applySessionInfoFromPatch, applySessionMutationResult, loadHistory: loadHistorySnapshot, setSession, abortActive } = createSessionActions({
		client,
		chatLog,
		btw,
		tui,
		opts,
		state,
		agentNames,
		initialSessionInput,
		initialSessionAgentId,
		resolveSessionSelection,
		updateHeader,
		updateFooter,
		updateAutocompleteProvider,
		setActivityStatus,
		invalidateRunOwnership: () => invalidateSessionRunOwnership(),
		clearLocalRunIds: localRunIds.clear,
		rememberSessionKey: rememberCurrentSessionKey
	});
	const loadHistory = async (reconcileReconnect = false) => {
		const activeRunAtStart = state.activeChatRunId;
		const reconcileMembership = captureHistoryRunMembership();
		const result = await loadHistorySnapshot();
		if (result.loaded) {
			reconcileMembership(result.activeRunIds);
			const recoveredRunId = result.runOutcome.state === "active" ? result.runOutcome.runId : activeRunAtStart;
			if (reconcileReconnect && recoveredRunId && recoveredRunId === state.activeChatRunId) reconcileReconnectRun(result.runOutcome);
			restoreConnectionNotices();
			tui.requestRender();
		}
		return result;
	};
	const taskSuggestions = createTuiTaskSuggestionController({
		client,
		chatLog,
		getAgentId: () => state.currentAgentId,
		getSessionKey: () => state.currentSessionKey,
		openOverlay,
		closeOverlay,
		requestRender: () => tui.requestRender(),
		onAccepted: setSession
	});
	notifySessionChanged = () => {
		pluginApprovals.sessionChanged();
		questions.sessionChanged().catch(reportQuestionRefreshError);
		taskSuggestions.sessionChanged();
	};
	const { handleChatEvent, handleAgentEvent, handleBtwEvent, handleSessionsChangedEvent, handleSessionMessageEvent, pauseStreamingWatchdog, reconnectStreamingWatchdog, consumeCompletedRunForPendingSend, isRunObserved, captureHistoryRunMembership, reconcileHistoryAfterGap, flushPendingHistoryRefreshIfIdle, dispose: disposeEventHandlers } = createEventHandlers({
		chatLog,
		btw,
		tui,
		state,
		localMode: isLocalMode,
		setActivityStatus,
		updateFooter,
		refreshSessionInfo,
		loadHistory,
		noteLocalRunId: localRunIds.note,
		isLocalRunId: localRunIds.has,
		forgetLocalRunId: localRunIds.forget,
		clearLocalRunIds: localRunIds.clear,
		isLocalBtwRunId: localBtwRunIds.has,
		forgetLocalBtwRunId: localBtwRunIds.forget,
		clearLocalBtwRunIds: localBtwRunIds.clear
	});
	reconcileReconnectRun = reconnectStreamingWatchdog;
	const localCli = createTuiLocalCliRunner();
	const localShell = createLocalShellRunner({
		chatLog,
		tui,
		openOverlay,
		closeOverlay
	});
	invalidateSessionRunOwnership = () => {
		disposeEventHandlers();
		state.activeChatRunId = null;
		setActivityStatus("idle");
	};
	const deferredFinish = createDeferredTuiFinish();
	let disposeSubmitBurst = () => {};
	const forceExit = () => {
		try {
			process.stderr.write("openclaw tui forcing exit\n");
		} catch {}
		process.exit(130);
	};
	const requestExit = (result) => {
		if (exitRequested) {
			forceExit();
			return;
		}
		exitRequested = true;
		authChild.close();
		disposeSubmitBurst();
		connectionGeneration += 1;
		exitResult = {
			exitReason: result?.exitReason ?? "exit",
			...result?.systemAgentMessage ? { systemAgentMessage: result.systemAgentMessage } : {}
		};
		disposeEventHandlers();
		pluginApprovals?.dispose();
		questions.dispose();
		taskSuggestions?.dispose();
		chatLog.dispose();
		beginTuiShutdown({
			stopCommandScopes: async () => {
				await Promise.all([localShell.shutdown(), localCli.shutdown()]);
			},
			stopClient: () => client.stop(),
			stopTui: () => drainAndStopTuiSafely(tui),
			disposeStatus,
			requestFinish: deferredFinish.requestFinish,
			forceExit,
			hardExitMs: resolveTuiShutdownHardExitMs({ localMode: isLocalMode }),
			keepHardExitArmed: opts.forceProcessExitOnReturn === true,
			onError: (err) => {
				if (!isTuiTerminalLossError(err)) try {
					process.stderr.write(`openclaw tui shutdown failed: ${formatTuiErrorMessage(err)}\n`);
				} catch {}
			}
		});
	};
	client.setRequestExitHandler?.(() => requestExit());
	const { handleCommand, sendMessage, captureMessageAdmission, resolveMessageAdmission, reportBlockedMessageSubmit, openModelSelector, openAgentSelector, openSessionSelector } = createCommandHandlers({
		client,
		chatLog,
		tui,
		opts: {
			...opts,
			local: isLocalMode
		},
		state,
		deliverDefault,
		openOverlay,
		closeOverlay,
		refreshSessionInfo,
		applySessionInfoFromPatch,
		applySessionMutationResult,
		loadHistory,
		setSession,
		refreshAgents,
		abortActive,
		setActivityStatus,
		formatSessionKey,
		noteLocalRunId: localRunIds.note,
		noteLocalBtwRunId: localBtwRunIds.note,
		forgetLocalRunId: localRunIds.forget,
		forgetLocalBtwRunId: localBtwRunIds.forget,
		consumeCompletedRunForPendingSend,
		isRunObserved,
		flushPendingHistoryRefreshIfIdle,
		runAuthFlow,
		localCli,
		reopenQuestion: () => questions.reopen().catch(reportQuestionRefreshError),
		requestExit
	});
	updateAutocompleteProvider();
	const notifySubmitError = (action, error) => {
		const message = formatTuiErrorMessage(error);
		chatLog.addSystem(`${action} submit failed: ${message}`);
		tui.requestRender();
	};
	const submitBurst = createSubmitBurstCoalescer({
		submit: createEditorSubmitHandler({
			editor,
			handleCommand,
			sendMessage,
			handleBangLine: localShell.runLocalShellLine,
			onSubmitError: notifySubmitError,
			admitMessage: resolveMessageAdmission,
			onBlockedMessageSubmit: reportBlockedMessageSubmit
		}),
		captureSnapshot: captureMessageAdmission,
		enabled: opts.submitBurstWindowMs !== void 0 || shouldEnableWindowsGitBashPasteFallback(),
		burstWindowMs: opts.submitBurstWindowMs,
		onCapture: opts.onSubmitBurstCaptured
	});
	disposeSubmitBurst = submitBurst.dispose;
	editor.onSubmit = submitBurst;
	editor.onEscape = () => {
		if (chatLog.hasVisibleBtw()) {
			chatLog.dismissBtw();
			tui.requestRender();
			return;
		}
		localCli.cancel();
		abortActive();
	};
	const handleCtrlC = () => {
		const now = Date.now();
		const decision = resolveTuiCtrlCAction({
			hasInput: editor.getText().length > 0,
			now,
			lastCtrlCAt: state.lastCtrlCAt,
			exitRequested,
			wasDisconnected: connectionLineage.wasDisconnected(),
			exitWindowMs: opts.ctrlCExitWindowMs
		});
		if (decision.action === "force-exit") {
			forceExit();
			return;
		}
		state.lastCtrlCAt = decision.nextLastCtrlCAt;
		if (decision.action === "clear") {
			editor.setText("");
			chatLog.addSystem("cleared input; press ctrl+c again to exit");
			tui.requestRender();
			return;
		}
		if (decision.action === "exit") {
			requestExit();
			return;
		}
		chatLog.addSystem("press ctrl+c again to exit");
		tui.requestRender();
	};
	editor.onCtrlC = () => {
		handleCtrlC();
	};
	editor.onCtrlD = () => {
		requestExit();
	};
	editor.onCtrlO = () => {
		state.toolsExpanded = !state.toolsExpanded;
		chatLog.setToolsExpanded(state.toolsExpanded);
		setActivityStatus(resolveTuiToolsToggleActivityStatus({
			currentStatus: state.activityStatus,
			toolsExpanded: state.toolsExpanded
		}));
		tui.requestRender();
	};
	editor.onCtrlL = () => {
		openModelSelector();
	};
	editor.onCtrlG = () => {
		openAgentSelector();
	};
	editor.onCtrlP = () => {
		openSessionSelector();
	};
	editor.onCtrlT = () => {
		state.showThinking = !state.showThinking;
		loadHistory();
	};
	tui.addInputListener((data) => {
		if (tui.hasOverlay() || !chatLog.hasVisibleBtw()) return;
		if (editor.getText().length > 0) return;
		if (matchesKey(data, "enter")) {
			chatLog.dismissBtw();
			tui.requestRender();
			return { consume: true };
		}
	});
	client.onEvent = (evt) => {
		if (exitRequested) return;
		pluginApprovals?.handleEvent(evt.event, evt.payload);
		questions.handleEvent(evt.event, evt.payload);
		taskSuggestions?.handleEvent(evt.event, evt.payload);
		if (evt.event === "chat") handleChatEvent(evt.payload);
		if (evt.event === "chat.side_result") handleBtwEvent(evt.payload);
		if (evt.event === "agent") handleAgentEvent(evt.payload);
		if (evt.event === "sessions.changed") handleSessionsChangedEvent(evt.payload);
		if (evt.event === "session.message") handleSessionMessageEvent(evt.payload);
	};
	client.onConnected = () => {
		if (exitRequested) return;
		const connectedGeneration = ++connectionGeneration;
		const ownsConnection = () => connectedGeneration === connectionGeneration && !exitRequested;
		state.isConnected = false;
		remediationShown = false;
		setConnectionStatus("subscribing to session events");
		if (!isTuiBusyActivityStatus(state.activityStatus)) setActivityStatus("starting up");
		(async () => {
			for (let attempt = 0; attempt < SESSION_SUBSCRIPTION_MAX_ATTEMPTS; attempt += 1) try {
				await client.subscribeSessionEvents?.();
				break;
			} catch (err) {
				if (!ownsConnection()) return;
				if (attempt + 1 === SESSION_SUBSCRIPTION_MAX_ATTEMPTS) {
					chatLog.addSystem(`session event subscribe failed: ${formatTuiErrorMessage(err)}`);
					if (state.activityStatus === "starting up") setActivityStatus("idle");
					setConnectionStatus("session event subscription failed");
					tui.requestRender();
					return;
				}
				await setTimeout$1(SESSION_SUBSCRIPTION_RETRY_DELAY_MS * (attempt + 1));
				if (!ownsConnection()) return;
			}
			if (!ownsConnection()) return;
			const reconnected = connectionLineage.connect();
			if (reconnected) reconnectStreamingWatchdog();
			await refreshAgents();
			if (!ownsConnection()) return;
			await restoreRememberedSession(connectedGeneration);
			if (!ownsConnection()) return;
			updateHeader();
			updateAutocompleteProvider();
			await refreshQuestions();
			if (!ownsConnection()) return;
			try {
				await pluginApprovals?.refresh();
			} catch (err) {
				if (!ownsConnection()) return;
				chatLog.addSystem(`plugin approval refresh failed: ${formatTuiErrorMessage(err)}`);
			}
			if (!ownsConnection()) return;
			try {
				await taskSuggestions?.refresh();
			} catch (err) {
				if (!ownsConnection()) return;
				chatLog.addSystem(`task suggestion refresh failed: ${formatTuiErrorMessage(err)}`);
			}
			if (!ownsConnection()) return;
			await loadHistory(reconnected);
			if (!ownsConnection()) return;
			state.isConnected = true;
			if (state.activityStatus === "starting up") setActivityStatus("idle");
			if (reconnected) addConnectionNotice("gateway reconnected after transport loss");
			setConnectionStatus(isLocalMode ? "local ready" : reconnected ? "gateway reconnected" : "gateway connected", 4e3);
			tui.requestRender();
			dynamicSlashCommandsReady = true;
			scheduleDynamicSlashCommandsRefresh();
			if (!state.autoMessageSent && autoMessage) {
				state.autoMessageSent = true;
				await sendMessage(autoMessage, opts.initialMessageTimeoutMs);
				if (!ownsConnection()) return;
			}
			updateFooter();
			tui.requestRender();
		})().catch((err) => {
			if (!ownsConnection()) return;
			chatLog.addSystem(`startup failed: ${formatTuiErrorMessage(err)}`);
			if (state.activityStatus === "starting up") setActivityStatus("idle");
			setConnectionStatus("startup failed", 5e3);
			tui.requestRender();
		});
	};
	const handleBackendDisconnected = (reason, details) => {
		if (exitRequested) return;
		connectionGeneration += 1;
		state.isConnected = false;
		connectionLineage.disconnect();
		state.historyLoaded = false;
		dynamicSlashCommands = [];
		dynamicSlashCommandsKey = null;
		dynamicSlashCommandsInFlightKey = null;
		dynamicSlashCommandsReady = false;
		clearDynamicSlashCommandsRefreshTimer();
		dynamicSlashCommandsRequestId += 1;
		updateAutocompleteProvider();
		pauseStreamingWatchdog();
		const disconnectState = reason === "gateway starting" ? resolveGatewayDisconnectState({
			reason,
			details
		}) : isLocalMode ? {
			connectionStatus: `local runtime stopped${reason ? `: ${reason}` : ""}`,
			activityStatus: "idle",
			remediation: void 0
		} : resolveGatewayDisconnectState({
			reason,
			details
		});
		setConnectionStatus(disconnectState.connectionStatus, 5e3);
		setActivityStatus(disconnectState.activityStatus);
		if (disconnectState.remediation && !remediationShown) {
			remediationShown = true;
			chatLog.addSystem(disconnectState.remediation);
		}
		updateFooter();
		tui.requestRender();
	};
	client.onConnectError = (error) => {
		const details = "details" in error ? error.details : void 0;
		handleBackendDisconnected(formatTuiErrorMessage(error), details);
	};
	client.onDisconnected = handleBackendDisconnected;
	client.onGap = (info) => {
		if (exitRequested || !state.isConnected) return;
		setConnectionStatus(`event gap: expected ${info.expected}, got ${info.received}`, 5e3);
		addConnectionNotice(`gateway event gap: expected ${info.expected}, got ${info.received}`);
		reconcileHistoryAfterGap();
		refreshQuestions();
		(async () => {
			try {
				await pluginApprovals?.refresh();
			} catch (err) {
				chatLog.addSystem(`plugin approval refresh failed: ${formatTuiErrorMessage(err)}`);
			}
			try {
				await taskSuggestions?.refresh();
			} catch (err) {
				chatLog.addSystem(`task suggestion refresh failed: ${formatTuiErrorMessage(err)}`);
			}
		})();
		tui.requestRender();
	};
	if (!initialSessionInput && !rememberedSessionApplied) try {
		const candidate = await resolveRememberedCandidate();
		if (candidate) provisionalSessionLabel = formatSessionKey(candidate.key);
	} catch {
		provisionalSessionLabel = null;
	}
	updateHeader();
	setConnectionStatus(isLocalMode ? "starting local runtime" : "connecting");
	updateFooter();
	const { sigintHandler, sigtermHandler, sighupHandler } = createTuiSignalHandlers({
		handleCtrlC,
		requestExit
	});
	process.on("SIGINT", sigintHandler);
	process.on("SIGTERM", sigtermHandler);
	process.on("SIGHUP", sighupHandler);
	let cleanupTerminalLossHandler = installTuiTerminalLossExitHandler(() => requestExit());
	tui.start();
	client.start();
	await new Promise((resolve) => {
		const finish = () => {
			disposeStatus();
			disposeEventHandlers();
			pluginApprovals?.dispose();
			questions.dispose();
			taskSuggestions?.dispose();
			if (isLocalMode) setConsoleSubsystemFilter(previousConsoleSubsystemFilter);
			cleanupTerminalLossHandler?.();
			cleanupTerminalLossHandler = null;
			process.removeListener("SIGINT", sigintHandler);
			process.removeListener("SIGTERM", sigtermHandler);
			process.removeListener("SIGHUP", sighupHandler);
			process.removeListener("exit", finish);
			deferredFinish.clearFinish();
			resolve();
		};
		process.once("exit", finish);
		deferredFinish.setFinish(finish);
	});
	if (opts.forceProcessExitOnReturn === true) scheduleProcessExitAfterTuiReturn();
	return exitResult;
}
//#endregion
export { runTui as C, createEditorSubmitHandler as D, withEmbeddedTuiStateLock as E, createSubmitBurstCoalescer as O, resolveTuiToolsToggleActivityStatus as S, stopTuiSafely as T, resolveTuiCtrlCAction as _, createTuiSignalHandlers as a, resolveTuiSessionSelection as b, installTuiTerminalLossExitHandler as c, isTuiTerminalLossError as d, resolveCodexCliBin as f, resolveLocalAuthSpawnInvocation as g, resolveInitialTuiAgentId as h, createTuiConnectionLineage as i, shouldEnableWindowsGitBashPasteFallback as k, isIgnorableTuiStopError as l, resolveGatewayDisconnectState as m, createBackspaceDeduper as n, drainAndStopTuiSafely as o, resolveCtrlCAction as p, createDeferredTuiFinish as r, formatTuiAuthCommandArgv as s, cancelProcessExitAfterTuiReturn as t, isTuiBusyActivityStatus as u, resolveTuiLocalAuthCliInvocation as v, scheduleProcessExitAfterTuiReturn as w, resolveTuiShutdownHardExitMs as x, resolveTuiSessionKey as y };
