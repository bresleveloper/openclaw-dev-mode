import { d as withOwnedSessionTranscriptWrites, i as captureOwnedTranscriptWriteAssertion, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-MlBhwaKa.mjs";
import { t as extractToolCallsFromAssistant } from "./tool-call-id-Dp16BALg.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-XXLoqJQC.mjs";
import { r as readAssistantDisplayContent, t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-DotKkoz0.mjs";
import { n as appendExactAssistantMessageToSessionTranscript } from "./transcript-DEj31pAK.mjs";
import { a as hasAssistantDisplayableNonTextContent, l as isAssistantTextContentType } from "./chat-display-projection.helpers-BloZC0RQ.mjs";
import { r as hasPersistedMedia } from "./provider-utils-B4V4yYub.mjs";
//#region src/agents/assistant-error-transcript.ts
/** Holds attempt failures until the logical run decides whether recovery succeeded. */
function createAssistantErrorTranscript(params) {
	const streamOutputs = /* @__PURE__ */ new WeakMap();
	let pending;
	const clear = () => {
		const failure = pending;
		pending = void 0;
		failure?.replaceStream?.(false);
	};
	return {
		clear,
		bindStream(source, replaceStream) {
			if (pending?.source === source) pending.replaceStream = replaceStream;
			else streamOutputs.set(source, replaceStream);
		},
		snapshot() {
			return pending;
		},
		restore(snapshot) {
			clear();
			pending = snapshot;
			pending?.replaceStream?.(true);
		},
		record(message, target, source = message) {
			pending = {
				message,
				source,
				target: withOwnedSessionTranscriptWriterFence(target),
				assertActive: captureOwnedTranscriptWriteAssertion(target),
				replaceStream: streamOutputs.get(source)
			};
			streamOutputs.delete(source);
			const displayContent = readAssistantDisplayContent(message);
			if (!hasAssistantDisplayableNonTextContent(message) && !hasAssistantDisplayableNonTextContent({ content: displayContent }) && !hasPersistedMedia(message) && !message.openclawDelivery?.mediaUrls?.length) return;
			const text = message.content.filter((block) => isAssistantTextContentType(block.type));
			const hasDisplayOverride = ASSISTANT_DISPLAY_CONTENT_FIELD in message;
			const { errorMessage, errorCode, errorType, errorBody, diagnostics, ...replayMessage } = message;
			pending.message = {
				role: "assistant",
				api: message.api,
				provider: message.provider,
				model: message.model,
				content: text,
				...hasDisplayOverride ? { [ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent.filter((block) => isAssistantTextContentType(block.type)) } : {},
				usage: makeZeroUsageSnapshot(),
				stopReason: "error",
				errorMessage,
				errorCode,
				errorType,
				errorBody,
				diagnostics,
				timestamp: message.timestamp
			};
			return {
				...replayMessage,
				content: message.content.filter((block) => !isAssistantTextContentType(block.type)),
				...hasDisplayOverride ? { [ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent.filter((block) => !isAssistantTextContentType(block.type)) } : {},
				stopReason: extractToolCallsFromAssistant(message).length > 0 ? "toolUse" : "stop"
			};
		},
		async settle(failed) {
			if (!failed) {
				clear();
				return;
			}
			const failure = pending;
			pending = void 0;
			if (!failure) return;
			const { message, target, assertActive } = failure;
			await withOwnedSessionTranscriptWrites({
				sessionTarget: target,
				assertCommitAllowed: assertActive,
				withTranscriptWrite: async (operation) => await operation()
			}, async () => {
				assertActive();
				const result = await appendExactAssistantMessageToSessionTranscript({
					...target,
					expectedSessionId: target.sessionId,
					message,
					runId: params.runId,
					idempotencyKey: `${params.runId}:terminal-error`,
					config: params.config
				});
				if (!result.ok) throw new Error(`Failed to persist terminal assistant error: ${result.reason}`);
			});
		}
	};
}
//#endregion
export { createAssistantErrorTranscript as t };
