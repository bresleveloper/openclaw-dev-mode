import { a as copyReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { o as toRelativeWorkspacePath } from "./path-policy-BUkUD6xH.mjs";
import { t as parseReplyDirectives } from "./reply-directives-CeJbvk_b.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import { t as createBoundedOutboundMediaReadFile } from "./bounded-read-file-BXBH3Nms.mjs";
import { r as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-CWCWnxsU.mjs";
import { i as createReplyMediaSourcePreparer, t as applyPreparedReplyMedia } from "./reply-media-paths-7SJueUDk.mjs";
import { t as buildEmbeddedRunPayloads } from "./payloads-CKax0Tdb.mjs";
//#region src/agents/harness/reply-media-runtime.ts
async function prepareHarnessReplyMedia(params) {
	const { request, context, signal, assertCurrent } = params;
	const maxBytes = resolveOutboundMediaMaxBytes({
		cfg: context.cfg,
		channel: context.messageProvider,
		accountId: context.accountId
	});
	const prepare = createReplyMediaSourcePreparer({
		...context,
		workspaceMediaRoot: request.workspaceRoot ?? context.workspaceDir,
		workspaceMediaAccess: {
			localRoots: [context.workspaceDir],
			workspaceDir: context.workspaceDir,
			readFile: createBoundedOutboundMediaReadFile(async (filePath, options) => {
				assertCurrent();
				const relativePath = toRelativeWorkspacePath(context.workspaceDir, filePath);
				const bytes = await request.readWorkspaceFile(relativePath, {
					maxBytes: Math.min(maxBytes, options?.maxBytes ?? maxBytes),
					signal
				});
				assertCurrent();
				return bytes;
			})
		}
	});
	if (request.kind === "payload") {
		const directives = parseReplyDirectives(request.payload.text ?? "");
		const payload = copyReplyPayloadMetadata(request.payload, {
			...request.payload,
			text: directives.text,
			mediaUrls: [.../* @__PURE__ */ new Set([...resolveSendableOutboundReplyParts(request.payload).mediaUrls, ...directives.mediaUrls ?? []])],
			...directives.audioAsVoice ? { audioAsVoice: true } : {},
			...directives.replyToId ? { replyToId: directives.replyToId } : {},
			...directives.replyToCurrent ? { replyToCurrent: true } : {}
		});
		const prepared = await prepare(resolveSendableOutboundReplyParts(payload).mediaUrls);
		assertCurrent();
		return {
			kind: "payload",
			payload: applyPreparedReplyMedia(payload, prepared)
		};
	}
	const result = request.attempt;
	const assistant = result.yieldDetected ? result.lastAssistant : result.currentAttemptCompletedAssistant;
	const payloads = buildEmbeddedRunPayloads({
		...context,
		config: context.cfg,
		sessionKey: context.sessionKey ?? "",
		assistantTexts: result.assistantTexts,
		answerSegments: result.answerSegments,
		lastAssistant: assistant,
		currentAssistant: result.yieldDetected ? null : assistant ?? null,
		lastToolError: result.lastToolError,
		didSendViaMessagingTool: result.didSendViaMessagingTool,
		didDeliverSourceReplyViaMessageTool: result.didDeliverSourceReplyViaMessageTool,
		messagingToolSentTargets: result.messagingToolSentTargets,
		messagingToolSourceReplyPayloads: result.messagingToolSourceReplyPayloads,
		didSendDeterministicApprovalPrompt: result.didSendDeterministicApprovalPrompt,
		heartbeatToolResponse: result.heartbeatToolResponse,
		runAborted: result.terminal.kind === "aborted"
	});
	const preparedMedia = await prepare([...new Set(payloads.flatMap((payload) => resolveSendableOutboundReplyParts(payload).mediaUrls))]);
	assertCurrent();
	return {
		kind: "attempt",
		preparedMedia
	};
}
//#endregion
export { prepareHarnessReplyMedia };
