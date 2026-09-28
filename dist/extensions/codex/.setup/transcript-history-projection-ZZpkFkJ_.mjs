import { t as readCodexAsyncQuestions } from "./async-questions-DdhOCwGi.mjs";
import { b as readCodexProviderRefusal, c as itemName, g as codexProviderRefusalDetails, l as itemStatus, t as auditNativeToolName } from "./event-projector-items-C6L_5ZiT.mjs";
import { t as attachCodexMirrorIdentity } from "./upstream-prompt-provenance-LphB8slG.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf8Prefix } from "openclaw/plugin-sdk/text-utility-runtime";
import { Buffer } from "node:buffer";
//#region extensions/codex/src/app-server/transcript-history-projection.ts
const CODEX_HISTORY_IMPORT_MAX_MESSAGES = 200;
const CODEX_HISTORY_IMPORT_MAX_BYTES = 524288;
const CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES = 65536;
const CODEX_HISTORY_TRUNCATION_SUFFIX = "\n\n[Message truncated during Codex history import.]";
const CODEX_HISTORY_ASSISTANT_API = "openai-chatgpt-responses";
const CODEX_HISTORY_ASSISTANT_PROVIDER = "openai";
const CODEX_HISTORY_ASSISTANT_MODEL = "native-history";
const CODEX_HISTORY_ZERO_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		total: 0
	}
};
function projectCodexHistoryMessage(message, text) {
	const phase = message.role === "assistant" && "phase" in message && (message.phase === "commentary" || message.phase === "final_answer") ? message.phase : void 0;
	return {
		message,
		responseItem: {
			type: "message",
			role: message.role,
			content: [{
				type: message.role === "assistant" ? "output_text" : "input_text",
				text
			}],
			...phase ? { phase } : {}
		},
		messageBytes: Buffer.byteLength(text, "utf8") + (message.role === "assistant" ? Buffer.byteLength(message.errorMessage ?? "", "utf8") + (message.diagnostics ? Buffer.byteLength(JSON.stringify(message.diagnostics), "utf8") : 0) : 0)
	};
}
function normalizeImportedHistoryText(value) {
	if (typeof value !== "string") return;
	const text = value.trim();
	if (!text) return;
	if (Buffer.byteLength(text, "utf8") <= CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES) return text;
	const suffixBytes = Buffer.byteLength(CODEX_HISTORY_TRUNCATION_SUFFIX, "utf8");
	const contentLimitBytes = Math.max(0, CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES - suffixBytes);
	return `${truncateUtf8Prefix(text, contentLimitBytes)}${CODEX_HISTORY_TRUNCATION_SUFFIX}`;
}
function projectCodexUserItemText(item) {
	if (!Array.isArray(item.content)) return;
	const parts = [];
	for (const value of item.content) {
		if (!value || typeof value !== "object" || Array.isArray(value)) continue;
		const input = value;
		if (input.type === "text") {
			const text = normalizeImportedHistoryText(input.text);
			if (text) parts.push(text);
			continue;
		}
		if (input.type === "image" || input.type === "localImage") {
			parts.push("[Image attachment]");
			continue;
		}
		if (input.type === "audio" || input.type === "localAudio" || input.type === "local_audio") parts.push("[Audio attachment]");
		if (input.type === "skill" || input.type === "mention") {
			const name = normalizeOptionalString(input.name);
			if (name) parts.push(`${input.type === "skill" ? "$" : "@"}${name}`);
		}
	}
	return normalizeImportedHistoryText(parts.join("\n"));
}
function selectTurnsThroughBoundary(thread, throughTurnId) {
	if (throughTurnId === null) return [];
	const turns = thread.turns ?? [];
	const boundaryIndex = turns.findIndex((turn) => turn.id === throughTurnId);
	if (boundaryIndex < 0) throw new Error(`Codex history boundary turn not found: ${throughTurnId}`);
	const boundary = turns[boundaryIndex];
	if (boundary?.status !== "completed" && boundary?.status !== "interrupted" && boundary?.status !== "failed") throw new Error(`Codex history boundary turn is not terminal: ${throughTurnId}`);
	return turns.slice(0, boundaryIndex + 1);
}
function projectCodexThreadHistory(params) {
	const projected = [];
	const threadTimestamp = typeof params.thread.createdAt === "number" && Number.isFinite(params.thread.createdAt) ? params.thread.createdAt * 1e3 : params.importedAt;
	let itemOffset = 0;
	for (const turn of params.turns) {
		const refusal = turn.status === "failed" ? readCodexProviderRefusal(turn.error?.message, turn.error?.codexErrorInfo, {
			misalignment: turn.error?.misalignment,
			nativeThreadId: params.thread.id,
			nativeTurnId: turn.id
		}) : void 0;
		let hasAssistantMessage = false;
		for (const value of turn.items) {
			const item = value;
			const itemId = normalizeOptionalString(item.id);
			const identity = `${turn.id}:${itemId ?? itemOffset}`;
			const timestampSeconds = item.type === "agentMessage" ? turn.completedAt ?? turn.startedAt : turn.startedAt ?? turn.completedAt;
			const timestamp = typeof timestampSeconds === "number" && Number.isFinite(timestampSeconds) ? timestampSeconds * 1e3 + itemOffset : threadTimestamp + itemOffset;
			const text = item.type === "userMessage" ? projectCodexUserItemText(item) : item.type === "agentMessage" ? normalizeImportedHistoryText(item.text) : void 0;
			const role = item.type === "userMessage" ? "user" : item.type === "agentMessage" ? "assistant" : void 0;
			itemOffset += 1;
			if (!text || !role) continue;
			const phase = item.phase === "commentary" || item.phase === "final_answer" ? item.phase : void 0;
			const asyncDelivery = item.delivery === "async";
			const terminalAssistant = role === "assistant" && phase !== "commentary" && !asyncDelivery;
			hasAssistantMessage ||= terminalAssistant;
			const questions = asyncDelivery ? readCodexAsyncQuestions(item.questions) : void 0;
			const message = role === "assistant" ? attachCodexMirrorIdentity({
				role,
				content: [{
					type: "text",
					text
				}],
				api: CODEX_HISTORY_ASSISTANT_API,
				provider: normalizeOptionalString(params.modelProvider) ?? normalizeOptionalString(params.thread.modelProvider) ?? CODEX_HISTORY_ASSISTANT_PROVIDER,
				model: CODEX_HISTORY_ASSISTANT_MODEL,
				usage: CODEX_HISTORY_ZERO_USAGE,
				stopReason: turn.status === "interrupted" ? "aborted" : turn.status === "failed" ? "error" : "stop",
				...turn.status === "failed" && turn.error?.message ? { errorMessage: turn.error.message } : {},
				...refusal && terminalAssistant ? { diagnostics: [{
					type: "provider_refusal",
					timestamp,
					details: codexProviderRefusalDetails(refusal)
				}] } : {},
				...phase ? { phase } : {},
				...asyncDelivery && itemId ? { openclawAsyncDelivery: {
					itemId,
					...questions ? { questions } : {}
				} } : {},
				timestamp
			}, identity) : attachCodexMirrorIdentity({
				role,
				content: text,
				timestamp
			}, identity);
			projected.push(projectCodexHistoryMessage(message, text));
		}
		if (params.includeErrorOnlyTurns && !hasAssistantMessage && turn.status === "failed" && turn.error?.message) {
			const timestamp = (turn.completedAt ?? turn.startedAt ?? threadTimestamp / 1e3) * 1e3;
			const text = normalizeImportedHistoryText(turn.error.message) ?? "Codex turn failed.";
			const message = attachCodexMirrorIdentity({
				role: "assistant",
				content: [],
				api: CODEX_HISTORY_ASSISTANT_API,
				provider: normalizeOptionalString(params.modelProvider) ?? normalizeOptionalString(params.thread.modelProvider) ?? CODEX_HISTORY_ASSISTANT_PROVIDER,
				model: CODEX_HISTORY_ASSISTANT_MODEL,
				usage: CODEX_HISTORY_ZERO_USAGE,
				stopReason: "error",
				errorMessage: text,
				...refusal ? { diagnostics: [{
					type: "provider_refusal",
					timestamp,
					details: codexProviderRefusalDetails(refusal)
				}] } : {},
				timestamp
			}, `${turn.id}:assistant`);
			projected.push(projectCodexHistoryMessage(message, ""));
		}
	}
	return projected;
}
function selectBoundedCodexHistoryTail(projected) {
	const selected = [];
	let selectedBytes = 0;
	for (let index = projected.length - 1; index >= 0; index -= 1) {
		const candidate = projected[index];
		if (!candidate) continue;
		if (selected.length >= CODEX_HISTORY_IMPORT_MAX_MESSAGES || selectedBytes + candidate.messageBytes > CODEX_HISTORY_IMPORT_MAX_BYTES) break;
		selected.push(candidate);
		selectedBytes += candidate.messageBytes;
	}
	return selected.toReversed();
}
/** Projects one terminal Codex history prefix into transcript and Responses API items. */
function projectBoundedCodexThreadHistory(params) {
	const projected = projectCodexThreadHistory({
		thread: params.thread,
		turns: selectTurnsThroughBoundary(params.thread, params.throughTurnId),
		importedAt: params.importedAt,
		includeErrorOnlyTurns: true,
		...params.modelProvider ? { modelProvider: params.modelProvider } : {}
	});
	const selected = selectBoundedCodexHistoryTail(projected);
	return {
		importedMessages: selected.length,
		omittedMessages: projected.length - selected.length,
		responseItems: selected.filter(({ message }) => message.role !== "assistant" || message.stopReason !== "aborted" && message.stopReason !== "error" && !("openclawAsyncDelivery" in message)).map(({ responseItem }) => responseItem),
		transcriptMessages: selected.map(({ message }) => message)
	};
}
/** Projects only visible local user/assistant messages through the same bounded history policy. */
function projectBoundedCodexVisibleSessionHistory(entries) {
	const projected = [];
	for (const { message } of entries) {
		if (message.role !== "user" && message.role !== "assistant" || !("content" in message)) continue;
		if (message.role === "assistant" && (message.stopReason === "aborted" || message.stopReason === "error" || "openclawAsyncDelivery" in message)) continue;
		const content = message.content;
		const text = normalizeImportedHistoryText(typeof content === "string" ? content : Array.isArray(content) ? content.flatMap((part) => part && typeof part === "object" && "text" in part && typeof part.text === "string" ? [part.text] : []).join("\n") : void 0);
		if (!text) continue;
		projected.push(projectCodexHistoryMessage(message, text));
	}
	return selectBoundedCodexHistoryTail(projected).map(({ responseItem }) => responseItem);
}
/** Displays native items through the shared transcript roles, including an unfinished turn. */
function projectCodexThreadHistoryItem(thread, entry, toolItems) {
	const { item } = entry;
	const timestamp = (entry.turn?.startedAt ?? thread.createdAt ?? 0) * 1e3;
	if (item.type === "userMessage" || item.type === "agentMessage") return projectCodexThreadHistory({
		thread,
		turns: [{
			...entry.turn,
			id: entry.turnId,
			items: [item]
		}],
		importedAt: timestamp
	}).map(({ message }) => message);
	const identity = `${entry.turnId}:${item.id}`;
	const assistant = (content, toolUse = false) => attachCodexMirrorIdentity({
		role: "assistant",
		content,
		api: CODEX_HISTORY_ASSISTANT_API,
		provider: normalizeOptionalString(thread.modelProvider) ?? CODEX_HISTORY_ASSISTANT_PROVIDER,
		model: CODEX_HISTORY_ASSISTANT_MODEL,
		usage: CODEX_HISTORY_ZERO_USAGE,
		stopReason: toolUse ? "toolUse" : "stop",
		timestamp
	}, identity);
	if (item.type === "reasoning") {
		const parts = Array.isArray(item.summary) && item.summary.length > 0 ? item.summary : item.content;
		const thinking = normalizeImportedHistoryText(Array.isArray(parts) ? parts.filter((part) => typeof part === "string").join("\n") : item.text);
		return thinking ? [assistant([{
			type: "thinking",
			thinking
		}])] : [];
	}
	if (item.type === "contextCompaction") return [assistant([{
		type: "text",
		text: "Context compacted."
	}])];
	const toolName = itemName(item) ?? auditNativeToolName(item);
	if (!toolName) {
		const text = normalizeImportedHistoryText(item.text ?? item.title);
		return text ? [assistant([{
			type: "text",
			text
		}])] : [];
	}
	const messages = [assistant([{
		type: "toolCall",
		id: item.id,
		name: toolName,
		arguments: toolItems.itemToolArgs(item) ?? {}
	}], true)];
	const status = itemStatus(item);
	if (status !== "running") messages.push(attachCodexMirrorIdentity({
		role: "toolResult",
		toolCallId: item.id,
		toolName,
		content: [{
			type: "text",
			text: toolItems.itemTranscriptResultText(item) ?? status
		}],
		isError: status === "failed" || status === "blocked",
		timestamp
	}, `${identity}:result`));
	return messages;
}
//#endregion
export { projectCodexUserItemText as i, projectBoundedCodexVisibleSessionHistory as n, projectCodexThreadHistoryItem as r, projectBoundedCodexThreadHistory as t };
