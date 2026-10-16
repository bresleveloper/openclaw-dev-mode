import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { o as persistSessionTranscriptTurn, t as appendAbortedSessionTranscriptPartial } from "./session-accessor-cUVSaeKy.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-XmAH1cfG.mjs";
import { i as retainAssistantModelContent, n as projectAssistantDisplayContent, t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
//#region src/gateway/server-methods/chat-transcript-inject.ts
function resolveInjectedAssistantContent(params) {
	const labelPrefix = params.label ? `[${params.label}]\n\n` : "";
	if (params.content && params.content.length > 0) {
		if (!labelPrefix) return params.content;
		const first = params.content[0];
		if (first?.type === "text" && typeof first.text === "string") return [{
			...first,
			text: `${labelPrefix}${first.text}`
		}, ...params.content.slice(1)];
		return [{
			type: "text",
			text: labelPrefix.trim()
		}, ...params.content];
	}
	return [{
		type: "text",
		text: `${labelPrefix}${params.message}`
	}];
}
/** Append a gateway-authored assistant message while preserving transcript parent links. */
async function appendInjectedAssistantMessageToTranscript(params) {
	if (!params.sessionKey.trim() || !params.sessionId.trim() || !params.storePath) return {
		ok: false,
		error: "transcript identity not resolved"
	};
	const now = Date.now();
	const displayMessage = {
		role: "assistant",
		content: resolveInjectedAssistantContent(params).map((block) => Object.assign({}, block))
	};
	const preparedDisplayMessage = applyAssistantDeliveryDirectives(displayMessage);
	const displayContent = preparedDisplayMessage.content;
	const canonicalContent = retainAssistantModelContent(displayContent);
	const rawDeliveryFacts = preparedDisplayMessage.openclawDelivery;
	const messageBody = applyAssistantDeliveryDirectives({
		role: "assistant",
		content: canonicalContent,
		[ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent,
		timestamp: now,
		stopReason: params.stopReason ?? "stop",
		usage: makeZeroUsageSnapshot(),
		api: "openai-responses",
		provider: "openclaw",
		model: "gateway-injected",
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...params.ttsSupplement ? { openclawTtsSupplement: params.ttsSupplement } : {},
		...params.contextFreeCommand === true ? {
			excludeFromContext: true,
			__openclaw: { contextFreeCommand: true }
		} : {},
		...params.abortMeta ? { openclawAbort: {
			aborted: true,
			origin: params.abortMeta.origin,
			runId: params.abortMeta.runId
		} } : {}
	});
	if (rawDeliveryFacts && messageBody.openclawDelivery === void 0) messageBody.openclawDelivery = rawDeliveryFacts;
	try {
		if (params.abortMeta?.producerSettled) {
			const scope = {
				storePath: params.storePath,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				...params.agentId ? { agentId: params.agentId } : {}
			};
			const result = await appendAbortedSessionTranscriptPartial(scope, {
				runId: params.abortMeta.runId,
				message: messageBody,
				expectedLifecycleRevision: params.expectedLifecycleRevision,
				now,
				config: params.config
			});
			if (!result.ok) return {
				ok: false,
				error: result.error.code
			};
			if (result.value.skipped) return {
				ok: true,
				skipped: true
			};
			const { append } = result.value;
			return {
				ok: true,
				messageId: append.messageId,
				message: projectAssistantDisplayContent(append.message)
			};
		}
		const turn = await persistSessionTranscriptTurn({
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			sessionId: params.sessionId,
			...params.agentId ? { agentId: params.agentId } : {}
		}, {
			expectedSessionId: params.expectedSessionId,
			expectedLifecycleRevision: params.expectedLifecycleRevision,
			updateMode: "inline",
			onMessageCommitted: params.onMessageCommitted,
			...params.abortMeta ? { runId: params.abortMeta.runId } : {},
			touchSessionEntry: true,
			...params.config ? { config: params.config } : {},
			messages: [{
				message: messageBody,
				idempotencyLookup: "scan-assistant",
				...params.abortMeta ? { predicate: {
					kind: "latest-assistant-differs",
					runId: params.abortMeta.runId,
					text: params.message.trim()
				} } : {},
				now,
				useRawWhenLinear: true
			}]
		});
		if (turn.rejectedReason) return {
			ok: false,
			error: turn.rejectedReason
		};
		const appended = turn.messages[0];
		if (!appended) {
			if (turn.predicateSkipped) return {
				ok: true,
				skipped: true
			};
			return {
				ok: false,
				error: "gateway-injected assistant message was not appended"
			};
		}
		return {
			ok: true,
			messageId: appended.messageId,
			message: projectAssistantDisplayContent(appended.message)
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
export { appendInjectedAssistantMessageToTranscript as t };
