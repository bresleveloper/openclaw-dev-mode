import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-ChQJdCfP.mjs";
import { t as loadChannelOutboundAdapter } from "./load-DaP0etgn.mjs";
//#region src/cli/send-runtime/channel-outbound-send.ts
function resolveRuntimeReplyToId(opts) {
	const raw = opts.replyToMessageId ?? opts.replyToId;
	return raw == null ? void 0 : normalizeOptionalString(String(raw));
}
async function sendChannelOutboundMessage(channelId, to, text, opts = {}) {
	const outbound = await loadChannelOutboundAdapter(channelId);
	const cfg = opts.cfg ?? await captureRuntimeConfigAsyncReader()();
	const threadId = opts.messageThreadId ?? opts.threadId ?? opts.threadTs ?? void 0;
	const replyToId = resolveRuntimeReplyToId(opts);
	const buildContext = () => ({
		cfg,
		to,
		text,
		mediaUrl: opts.mediaUrl,
		mediaAccess: opts.mediaAccess,
		mediaLocalRoots: opts.mediaLocalRoots,
		mediaReadFile: opts.mediaReadFile,
		accountId: opts.accountId,
		threadId,
		replyToId,
		silent: opts.silent,
		forceDocument: opts.forceDocument,
		formatting: opts.formatting ?? (opts.textMode === "html" ? { parseMode: "HTML" } : void 0),
		gifPlayback: opts.gifPlayback,
		gatewayClientScopes: opts.gatewayClientScopes,
		deliveryQueueId: opts.deliveryQueueId,
		deliveryPartIndex: opts.deliveryPartIndex,
		deliveryPartCount: opts.deliveryPartCount,
		onPlatformSendDispatch: opts.onPlatformSendDispatch
	});
	const hasMedia = Boolean(opts.mediaUrl);
	if (opts.blocks && outbound?.sendPayload) return await outbound.sendPayload({
		...buildContext(),
		payload: {
			text,
			channelData: { [channelId]: { blocks: opts.blocks } }
		}
	});
	if (hasMedia && outbound?.sendMedia) return await outbound.sendMedia(buildContext());
	if (!outbound?.sendText) {
		const message = `${channelId} outbound adapter is unavailable.`;
		throw new PlatformMessageNotDispatchedError(message, { cause: new Error(message) });
	}
	return await outbound.sendText(buildContext());
}
//#endregion
export { sendChannelOutboundMessage };
