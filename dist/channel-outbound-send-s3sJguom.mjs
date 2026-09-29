import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
import { t as loadChannelOutboundAdapter } from "./load-B9M3eoYt.mjs";
//#region src/cli/send-runtime/channel-outbound-send.ts
function resolveRuntimeThreadId(opts) {
	return opts.messageThreadId ?? opts.threadId ?? opts.threadTs ?? void 0;
}
function resolveRuntimeReplyToId(opts) {
	const raw = opts.replyToMessageId ?? opts.replyToId;
	return raw == null ? void 0 : normalizeOptionalString(String(raw));
}
/** Create a send runtime that dispatches text, media, or rich blocks through a channel plugin. */
function createChannelOutboundRuntimeSend(params) {
	return { sendMessage: async (to, text, opts = {}) => {
		const outbound = await loadChannelOutboundAdapter(params.channelId);
		const threadId = resolveRuntimeThreadId(opts);
		const replyToId = resolveRuntimeReplyToId(opts);
		const buildContext = () => ({
			cfg: opts.cfg ?? getRuntimeConfig(),
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
				channelData: { [params.channelId]: { blocks: opts.blocks } }
			}
		});
		if (hasMedia && outbound?.sendMedia) return await outbound.sendMedia(buildContext());
		if (!outbound?.sendText) {
			const cause = new Error(params.unavailableMessage);
			throw new PlatformMessageNotDispatchedError(params.unavailableMessage, { cause });
		}
		return await outbound.sendText(buildContext());
	} };
}
//#endregion
export { createChannelOutboundRuntimeSend };
