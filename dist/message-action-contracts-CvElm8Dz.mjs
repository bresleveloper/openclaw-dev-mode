import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.mjs";
//#region src/infra/outbound/message-action-contracts.ts
function resolveMessageSendOutcome(sendResult, action = "Message") {
	if (sendResult?.deliveryStatus === void 0 || sendResult.deliveryStatus === "sent") return { ok: true };
	switch (sendResult.deliveryStatus) {
		case "suppressed": return {
			ok: false,
			error: `${action} send suppressed: ${sendResult.suppressionReason ?? "unknown reason"}.`,
			...sendResult.sentBeforeError ? { sentBeforeError: true } : {}
		};
		case "failed": return {
			ok: false,
			error: sendResult.error ?? `${action} send failed.`,
			...sendResult.sentBeforeError ? { sentBeforeError: true } : {}
		};
		case "partial_failed": return {
			ok: false,
			error: sendResult.error ?? `${action} send partially failed.`,
			sentBeforeError: true
		};
	}
	return sendResult.deliveryStatus;
}
function resolveMessageActionOutcome(result, action = "Message") {
	if (result.kind === "broadcast") {
		const failure = result.payload.results.find((entry) => !entry.ok);
		return failure ? {
			ok: false,
			error: failure.error ?? "Broadcast failed."
		} : { ok: true };
	}
	if (result.dryRun) return { ok: true };
	const outcome = result.kind === "send" ? resolveMessageSendOutcome(result.sendResult, action) : { ok: true };
	const payload = result.payload;
	if (!outcome.ok || !isRecord(payload) || payload.ok !== false) return outcome;
	const error = [
		payload.error,
		payload.warning,
		payload.hint,
		payload.reason
	].map(normalizeOptionalString).find(Boolean) ?? `Message ${result.action} failed.`;
	return payload.sentBeforeError === true ? {
		ok: false,
		error,
		sentBeforeError: true
	} : {
		ok: false,
		error
	};
}
function resolveMessageActionMessageId(payload) {
	const record = asOptionalObjectRecord(payload);
	return normalizeOptionalString(record?.messageId) ?? normalizeOptionalString(asOptionalObjectRecord(record?.result)?.messageId);
}
function createChannelActionContext(params) {
	const mediaAccess = params.mediaAccess ?? params.ctx.mediaAccess;
	return {
		channel: params.ctx.channel,
		action: params.action,
		cfg: params.ctx.cfg,
		params: params.ctx.params,
		...params.reply ? { reply: params.reply } : {},
		...mediaAccess ? { mediaAccess } : {},
		mediaLocalRoots: mediaAccess?.localRoots,
		mediaReadFile: mediaAccess?.readFile,
		accountId: params.ctx.accountId ?? void 0,
		requesterAccountId: params.ctx.input.requesterAccountId ?? void 0,
		requesterSenderId: params.ctx.input.requesterSenderId ?? void 0,
		senderIsOwner: params.ctx.input.senderIsOwner,
		conversationReadOrigin: normalizeConversationReadInvocationOrigin(params.ctx.input.conversationReadOrigin),
		sessionKey: params.ctx.input.sessionKey,
		sessionId: params.ctx.input.sessionId,
		inboundEventKind: params.ctx.input.inboundEventKind,
		agentId: params.ctx.agentId,
		gateway: params.ctx.gateway,
		toolContext: params.ctx.input.toolContext,
		dryRun: params.ctx.dryRun,
		onPlatformSendDispatch: params.ctx.input.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.ctx.input.assertDirectAdapterHandoff,
		...params.action === "send" ? { skipQueue: params.ctx.input.skipQueue } : {}
	};
}
//#endregion
export { resolveMessageActionMessageId as n, resolveMessageActionOutcome as r, createChannelActionContext as t };
