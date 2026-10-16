import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as isOpenClawRuntimeContextCustomMessage } from "./internal-runtime-context-CAWYwg4i.mjs";
import { o as readSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { n as HEARTBEAT_PROMPT } from "./heartbeat-BjLIgeQc.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { a as isOpenClawDeliveryMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-CNurmdgT.mjs";
import { h as normalizeInputProvenance, m as isSubagentCoordinationInputProvenance, u as isCompletionReportInputProvenance, y as stripInterSessionPromptPrefixForDisplay } from "./input-provenance-D1LHo5Qj.mjs";
import { n as projectAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { n as isHeartbeatOkResponse, r as isHeartbeatUserMessage } from "./heartbeat-filter-CNihh_E4.mjs";
import { n as prepareCronJobNameResolver } from "./job-name-96dek-P6.mjs";
import { i as extractChatHistoryBlockText } from "./chat-display-projection.canvas-DwEc-tyR.mjs";
import { a as hasAssistantDisplayableNonTextContent, d as isEmptyTextOnlyContent, f as isForwardedUserMessage, i as extractProjectedText, n as asRoleContentMessage, o as hasAssistantNonTextContent, p as isProjectedForwardedMessage, s as hasTranscriptMediaFacts, u as isCronRunMessage } from "./chat-display-projection.helpers-pbUdgTgb.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/chat-display-projection.history.ts
function isSubagentCoordinationHistoryInput(message, isSubagentSession) {
	if (message.role !== "user") return false;
	const provenance = normalizeInputProvenance(message.provenance);
	if (isSubagentCoordinationInputProvenance(provenance)) return true;
	return Boolean(provenance?.kind === "inter_session" && provenance.sourceTool === "sessions_send" && provenance.sourceSessionKey && isSubagentSession?.(provenance.sourceSessionKey));
}
/** Keep coordination in the model transcript while projecting only human-facing outcomes. */
function createSubagentCoordinationHistoryProjection(resolver, state = {
	hiddenInputKeys: /* @__PURE__ */ new Set(),
	visibleInputKeys: /* @__PURE__ */ new Set(),
	visibleSteerRunIds: /* @__PURE__ */ new Set()
}) {
	const { hiddenInputKeys, visibleInputKeys, visibleSteerRunIds } = state;
	return (messages) => {
		resolver?.assertCurrent?.();
		const projected = messages.map((message) => {
			const record = asOptionalRecord(message);
			if (!record) return message;
			const metadata = asOptionalRecord(record["__openclaw"]);
			if (isSubagentCoordinationHistoryInput(record, resolver?.isSubagentSession)) {
				const inputKey = record.idempotencyKey ?? metadata?.idempotencyKey;
				if (typeof inputKey === "string" && !metadata?.steerTargetRunId) hiddenInputKeys.add(inputKey);
				return record.display === false ? record : {
					...record,
					display: false
				};
			}
			const runId = readSessionTranscriptRunId(record);
			if (record.role === "user") {
				const inputKey = record.idempotencyKey ?? metadata?.idempotencyKey;
				if (typeof inputKey === "string") visibleInputKeys.add(inputKey);
				const steerTargetRunId = metadata?.steerTargetRunId ?? runId;
				if (typeof steerTargetRunId === "string") visibleSteerRunIds.add(steerTargetRunId);
				return message;
			}
			if (record.display === false) return message;
			if ((record.role === "assistant" || record.role === "toolResult" || record.role === "custom") && runId && !visibleSteerRunIds.has(runId) && (hiddenInputKeys.has(buildRunUserTurnIdempotencyKey(runId)) || !visibleInputKeys.has(buildRunUserTurnIdempotencyKey(runId)) && resolver?.isSubagentRunMessage(runId, typeof metadata?.seq === "number" ? metadata.seq : void 0))) return {
				...record,
				display: false
			};
			return message;
		});
		resolver?.assertCurrent?.();
		return projected;
	};
}
function readTtsSupplementMarker(message) {
	const marker = asOptionalRecord(message.openclawTtsSupplement);
	if (!marker) return;
	const textSha256 = normalizeOptionalString(marker.textSha256);
	const spokenText = normalizeOptionalString(marker.spokenText);
	return textSha256 || spokenText ? {
		textSha256,
		spokenText
	} : void 0;
}
function readAssistantTtsSupplementMarker(message) {
	const marker = readTtsSupplementMarker(message);
	if (!marker || asRoleContentMessage(message)?.role !== "assistant") return;
	const content = message.content;
	if (!Array.isArray(content)) return;
	let hasSupplementBlock = false;
	for (const block of content) {
		const record = asOptionalRecord(block);
		if (!record) continue;
		if (record.type !== "text") {
			hasSupplementBlock = true;
			continue;
		}
		const text = typeof record.text === "string" ? record.text.trim() : "";
		if (text && text !== "Audio reply") return;
	}
	return hasSupplementBlock ? marker : void 0;
}
/** Recognize stored supplements using the same display content as full history. */
function isAssistantTtsSupplementMessage(message) {
	const record = asOptionalRecord(message);
	return record !== void 0 && readAssistantTtsSupplementMarker(projectAssistantDisplayContent(record)) !== void 0;
}
function readTtsSupplementTargetText(message) {
	return asRoleContentMessage(message)?.role === "assistant" && !isProjectedForwardedMessage(message) && !readTtsSupplementMarker(message) ? extractProjectedText(message.content ?? message.text).trim() : "";
}
function mergeTtsSupplementContent(target, supplement) {
	const supplementBlocks = Array.isArray(supplement.content) ? supplement.content.filter((block) => {
		const record = asOptionalRecord(block);
		return record !== void 0 && record.type !== "text";
	}) : [];
	if (supplementBlocks.length === 0) return target;
	const targetContent = target.content;
	if (Array.isArray(targetContent)) return {
		...target,
		content: [...targetContent, ...supplementBlocks]
	};
	const targetText = extractProjectedText(targetContent ?? target.text).trim();
	return {
		...target,
		content: [...targetText ? [{
			type: "text",
			text: targetText
		}] : [], ...supplementBlocks]
	};
}
function mergeTtsSupplementMessages(messages) {
	if (!messages.some(readAssistantTtsSupplementMarker)) return messages;
	const targetTexts = [];
	const targetHashes = [];
	const merged = [];
	let changed = false;
	for (const message of messages) {
		const marker = readAssistantTtsSupplementMarker(message);
		if (marker) {
			let targetIndex = -1;
			for (let i = merged.length - 1; i >= 0; i--) {
				const candidate = merged[i];
				if (!candidate) continue;
				const text = targetTexts[i] ??= readTtsSupplementTargetText(candidate);
				if (text && (marker.textSha256 && (targetHashes[i] ??= createHash("sha256").update(text).digest("hex")) === marker.textSha256 || marker.spokenText && text === marker.spokenText)) {
					targetIndex = i;
					break;
				}
			}
			if (targetIndex >= 0) {
				merged[targetIndex] = mergeTtsSupplementContent(expectDefined(merged[targetIndex], "merged entry at target index"), message);
				targetTexts[targetIndex] = targetHashes[targetIndex] = void 0;
				changed = true;
				continue;
			}
		}
		merged.push(message);
	}
	return changed ? merged : messages;
}
function isSubagentAnnounceInterSessionUserMessage(message, readText) {
	const provenance = normalizeInputProvenance(message.provenance);
	if (provenance?.kind === "inter_session" && (provenance.sourceTool === "subagent_announce" || provenance.sourceTool === "subagent_settle")) return true;
	const text = readText ? readText(message) : extractProjectedText(message.content ?? message.text);
	return typeof text === "string" && text.includes("[Inter-session message]") && text.includes("sourceTool=subagent_announce");
}
function readChatHistoryRecordTimestampMs(message) {
	const meta = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	return asFiniteNumber(meta?.recordTimestampMs) ?? asFiniteNumber(asOptionalRecord(message)?.timestamp);
}
function createPreSessionStartAnnouncePairFilter(sessionStartedAt) {
	let precedingAnnounce = false;
	return (messages) => {
		if (sessionStartedAt === void 0 || messages.length === 0) return messages;
		let changed = false;
		const kept = [];
		for (const current of messages) {
			if (precedingAnnounce) {
				precedingAnnounce = false;
				const ts = asOptionalRecord(current)?.role === "assistant" ? readChatHistoryRecordTimestampMs(current) : void 0;
				if (typeof ts === "number" && ts < sessionStartedAt) {
					changed = true;
					continue;
				}
			}
			const record = asOptionalRecord(current);
			if (record?.role === "user" && isSubagentAnnounceInterSessionUserMessage(record, extractChatHistoryBlockText)) {
				const ts = readChatHistoryRecordTimestampMs(current);
				if (typeof ts === "number" && ts < sessionStartedAt) {
					precedingAnnounce = true;
					changed = true;
					continue;
				}
			}
			kept.push(current);
		}
		return changed ? kept : messages;
	};
}
function dropPreSessionStartAnnouncePairs(messages, sessionStartedAt) {
	return createPreSessionStartAnnouncePairFilter(sessionStartedAt)(messages);
}
function isDisplayHiddenProjectedMessage(message) {
	if (message.display === false) return true;
	return isOpenClawRuntimeContextCustomMessage(message);
}
function shouldHideProjectedHistoryMessage(message, roleContent, heartbeatUser) {
	if (isDisplayHiddenProjectedMessage(message)) return true;
	if (isProjectedForwardedMessage(message)) return false;
	if (!roleContent) return false;
	if (roleContent.role === "user" && isCompletionReportInputProvenance(message.provenance)) return true;
	if (roleContent.role === "user" && isSubagentAnnounceInterSessionUserMessage(message)) return true;
	if (roleContent.role === "user" && isEmptyTextOnlyContent(message.content ?? message.text) && !hasTranscriptMediaFacts(message)) return true;
	if (roleContent.role === "assistant" && isEmptyTextOnlyContent(message.content ?? message.text)) return false;
	return heartbeatUser || isHeartbeatOkResponse(roleContent);
}
/** Identifies the hidden native input that starts a heartbeat-driven turn. */
function isHeartbeatHistoryTurnBoundaryMessage(message) {
	const record = asOptionalRecord(message);
	if (!record || isForwardedUserMessage(record)) return false;
	const roleContent = asRoleContentMessage(record);
	return roleContent?.role === "user" && isHeartbeatUserMessage(roleContent, HEARTBEAT_PROMPT);
}
function attachProjectedTurnBoundary(message) {
	const metadata = asOptionalRecord(message["__openclaw"]);
	if (metadata?.turnBoundary === true) return message;
	return {
		...message,
		__openclaw: {
			...metadata,
			turnBoundary: true
		}
	};
}
function canCarryProjectedTurnBoundary(message) {
	return Boolean(message && message.role !== "system" && message.role !== "custom");
}
function openclawAssistantModel(message) {
	return message.role === "assistant" && message.provider === "openclaw" && typeof message.model === "string" ? message.model : void 0;
}
function displayTextForDuplicateCheck(message) {
	const text = extractProjectedText(message.content ?? message.text).trim();
	return text ? text : void 0;
}
function isDuplicateAssistantDelivery(current, previousVisible) {
	if (!previousVisible) return false;
	if (!(openclawAssistantModel(previousVisible) === "acp-runtime" && openclawAssistantModel(current) === "gateway-injected")) {
		const deliveryMirror = asOptionalRecord(current.openclawDeliveryMirror);
		if (!isOpenClawDeliveryMirrorAssistantMessage(current) || deliveryMirror?.kind !== "channel-final" || asRoleContentMessage(previousVisible)?.role !== "assistant" || isOpenClawDeliveryMirrorAssistantMessage(previousVisible) || isProjectedForwardedMessage(previousVisible)) return false;
		const previousMeta = asOptionalRecord(previousVisible["__openclaw"]);
		if (typeof deliveryMirror.sourceAssistantMessageId === "string") {
			if (!deliveryMirror.sourceAssistantMessageId || deliveryMirror.sourceAssistantMessageId !== previousMeta?.id || hasAssistantDisplayableNonTextContent(previousVisible) || hasAssistantNonTextContent(current) || hasTranscriptMediaFacts(previousVisible) || hasTranscriptMediaFacts(current)) return false;
			const previousText = extractAssistantPhaseText(previousVisible)?.trim();
			const currentText = extractAssistantPhaseText(current)?.trim();
			return Boolean(previousText && currentText && previousText === currentText);
		}
		if (typeof previousMeta?.mirrorIdentity !== "string" || !previousMeta.mirrorIdentity.trim()) return false;
	}
	if (hasAssistantNonTextContent(previousVisible) || hasAssistantNonTextContent(current)) return false;
	const previousText = displayTextForDuplicateCheck(previousVisible);
	const currentText = displayTextForDuplicateCheck(current);
	return Boolean(previousText && currentText && previousText === currentText);
}
function toProjectedMessages(messages) {
	return messages.flatMap((message) => {
		const record = asOptionalRecord(message);
		return record ? [projectAssistantDisplayContent(record)] : [];
	});
}
function filterVisibleProjectedHistoryMessages(messages, turnBoundaryPending = false) {
	if (messages.length === 0) return {
		messages,
		turnBoundaryPending
	};
	let pendingTurnBoundary = turnBoundaryPending;
	let changed = false;
	const visible = [];
	for (let i = 0; i < messages.length; i++) {
		const current = messages[i];
		if (!current) continue;
		const currentRoleContent = asRoleContentMessage(current);
		const heartbeatUser = Boolean(currentRoleContent && isHeartbeatUserMessage(currentRoleContent, HEARTBEAT_PROMPT));
		const next = heartbeatUser ? messages[i + 1] : void 0;
		const nextRoleContent = next ? asRoleContentMessage(next) : null;
		if (next && nextRoleContent && isHeartbeatOkResponse(nextRoleContent) && !isProjectedForwardedMessage(next)) {
			changed = true;
			pendingTurnBoundary = true;
			i++;
			continue;
		}
		if (shouldHideProjectedHistoryMessage(current, currentRoleContent, heartbeatUser)) {
			changed = true;
			pendingTurnBoundary ||= heartbeatUser && !isForwardedUserMessage(current);
			continue;
		}
		if (isDuplicateAssistantDelivery(current, messages[i - 1])) {
			changed = true;
			continue;
		}
		if (pendingTurnBoundary && canCarryProjectedTurnBoundary(currentRoleContent)) {
			visible.push(attachProjectedTurnBoundary(current));
			pendingTurnBoundary = false;
			changed = true;
		} else visible.push(current);
	}
	return {
		messages: changed ? visible : messages,
		turnBoundaryPending: pendingTurnBoundary
	};
}
function stripPromptPrefixFromContent(content, strip) {
	if (typeof content === "string") return strip(content);
	if (!Array.isArray(content)) return content;
	return content.map((block) => {
		if (!block || typeof block !== "object" || Array.isArray(block)) return block;
		const record = block;
		if (typeof record.text !== "string") return block;
		const stripped = strip(record.text);
		return stripped === record.text ? block : {
			...record,
			text: stripped
		};
	});
}
function readForwardedSender(message) {
	const provenance = normalizeInputProvenance(message.provenance);
	const sourceSessionKey = provenance?.sourceSessionKey;
	const parsed = parseAgentSessionKey(sourceSessionKey);
	return {
		sourceSessionKey,
		agentId: parsed?.agentId,
		jobId: isCronRunMessage(message) ? provenance?.jobId : parsed?.rest.match(/^cron:([^:]+):run:[^:]+$/u)?.[1]
	};
}
function resolveForwardedSenderSession(message, resolveCronJobName) {
	const { sourceSessionKey, agentId, jobId } = readForwardedSender(message);
	const label = jobId ? resolveCronJobName(jobId) ?? "Automation" : void 0;
	return sourceSessionKey ? {
		sessionKey: sourceSessionKey,
		...agentId ? { agentId } : {},
		...label ? { label } : {}
	} : void 0;
}
function readForwardedCronJobIds(messages) {
	return messages.flatMap((value) => {
		const message = asOptionalRecord(value);
		if (!message || !isForwardedUserMessage(message) && !isProjectedForwardedMessage(message)) return [];
		const jobId = readForwardedSender(message).jobId;
		return jobId ? [jobId] : [];
	});
}
async function prepareForwardedMessageCronJobNameResolver(messages, storePath) {
	return await prepareCronJobNameResolver(readForwardedCronJobIds(messages), storePath);
}
function projectForwardedMessages(messages, resolveCronJobName) {
	const resolve = resolveCronJobName ?? (() => {
		throw new Error("Cron job names must be prepared before projecting forwarded messages");
	});
	const names = /* @__PURE__ */ new Map();
	const resolveName = (jobId) => {
		if (!names.has(jobId)) names.set(jobId, resolve(jobId));
		return names.get(jobId);
	};
	let changed = false;
	const projected = messages.map((message) => {
		if (!isForwardedUserMessage(message) && !isProjectedForwardedMessage(message)) return message;
		const senderSession = resolveForwardedSenderSession(message, resolveName);
		if (message.role === "assistant") {
			if (asOptionalRecord(message.senderSession)?.label === senderSession?.label) return message;
			changed = true;
			return {
				...message,
				senderSession,
				senderLabel: `Forwarded from ${senderSession?.label ?? senderSession?.agentId}`
			};
		}
		changed = true;
		const cronRun = isCronRunMessage(message);
		const prefix = normalizeInputProvenance(message.provenance)?.sourcePromptPrefix;
		const strip = cronRun ? (text) => prefix && text.startsWith(prefix) ? text.slice(prefix.length).replace(/^ /u, "") : text : stripInterSessionPromptPrefixForDisplay;
		const next = {
			...message,
			role: "assistant",
			...cronRun ? { __openclaw: {
				...asOptionalRecord(message["__openclaw"]),
				turnBoundary: true
			} } : {},
			senderLabel: senderSession?.label || senderSession?.agentId ? `Forwarded from ${senderSession.label ?? senderSession.agentId}` : "Forwarded agent message",
			...senderSession ? { senderSession } : {}
		};
		if ("content" in next) next.content = stripPromptPrefixFromContent(next.content, strip);
		if (typeof next.text === "string") next.text = strip(next.text);
		return next;
	});
	return changed ? projected : messages;
}
//#endregion
export { isAssistantTtsSupplementMessage as a, mergeTtsSupplementMessages as c, readForwardedCronJobIds as d, toProjectedMessages as f, filterVisibleProjectedHistoryMessages as i, prepareForwardedMessageCronJobNameResolver as l, createSubagentCoordinationHistoryProjection as n, isHeartbeatHistoryTurnBoundaryMessage as o, dropPreSessionStartAnnouncePairs as r, isSubagentCoordinationHistoryInput as s, createPreSessionStartAnnouncePairFilter as t, projectForwardedMessages as u };
