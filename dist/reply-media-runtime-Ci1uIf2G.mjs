import { n as addReplyPayloadMediaFailures, o as copyReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { t as parseReplyDirectives } from "./reply-directives-Ciui4dZv.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-BtASEhL4.mjs";
import { o as toRelativeWorkspacePath } from "./path-policy-CDc3034l.mjs";
import { t as createBoundedOutboundMediaReadFile } from "./bounded-read-file-BXBH3Nms.mjs";
import { i as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-CtwRSse3.mjs";
import { t as resolveOutboundAttachmentFromBuffer } from "./outbound-attachment-CB4mkepg.mjs";
import { i as createReplyMediaSourcePreparer, t as applyPreparedReplyMedia } from "./reply-media-paths-CpgXVoJV.mjs";
import { t as buildEmbeddedRunPayloads } from "./payloads-CfmN66kP.mjs";
//#region src/agents/harness/reply-media-runtime.ts
async function prepareHarnessReplyMedia(params) {
	const { request, context, signal, assertCurrent } = params;
	const maxBytes = resolveOutboundMediaMaxBytes({
		cfg: context.cfg,
		channel: context.messageProvider,
		accountId: context.accountId
	});
	if (request.kind === "artifact") {
		const saved = await resolveOutboundAttachmentFromBuffer(request.buffer, maxBytes, { filename: request.fileName });
		assertCurrent();
		return {
			kind: "payload",
			payload: {
				mediaUrl: saved.path,
				mediaUrls: [saved.path],
				trustedLocalMedia: true
			}
		};
	}
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
		addReplyPayloadMediaFailures(payload, directives.mediaFailures);
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
