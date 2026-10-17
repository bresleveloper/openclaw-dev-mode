import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./http-body-CgfQBa7S.mjs";
import "./mime-CGDYrRzL.mjs";
import "./media-services-BkfwjOhK.mjs";
import "./local-roots-D6JiS64U.mjs";
import "./store-A0dMc8iV.mjs";
import "./fetch-DbODRO30.mjs";
import { a as chunkText } from "./chunk-BenoswI3.mjs";
import "./defaults-B4lxmCMh.mjs";
import "./image-runtime-UQGMU5oF.mjs";
import "./audio-FjhEe9q3.mjs";
import "./outbound-attachment-CB4mkepg.mjs";
import "./agent-media-payload-ln7PFG0U.mjs";
import { t as sanitizeForPlainText } from "./sanitize-text-DsEmcKIF.mjs";
import "./qr-image-P8oNhW0f.mjs";
import "./qr-terminal-DidBd5mr.mjs";
import "./temp-files-BXB-NNDY.mjs";
import { t as resolveChannelMediaMaxBytes } from "./media-limits-DL4SEjTv.mjs";
//#region src/channels/plugins/outbound/direct-text-media.ts
function readNumberField(record, key) {
	const value = record?.[key];
	return typeof value === "number" ? value : void 0;
}
function createScopedChannelMediaMaxBytesResolver(channel) {
	return (params) => resolveChannelMediaMaxBytes({
		cfg: params.cfg,
		accountId: params.accountId,
		resolveChannelLimitMb: ({ cfg, accountId }) => {
			const channelConfig = asOptionalRecord(cfg.channels?.[channel]);
			return readNumberField(asOptionalRecord(asOptionalRecord(channelConfig?.accounts)?.[accountId]), "mediaMaxMb") ?? readNumberField(channelConfig, "mediaMaxMb");
		}
	});
}
function createDirectTextMediaOutbound(params) {
	const sendDirect = async ({ cfg, to, text, accountId, deps, replyToId }, buildOptions, media) => {
		const send = params.resolveSender(deps);
		const maxBytes = params.resolveMaxBytes({
			cfg,
			accountId
		});
		const result = await send(to, text, buildOptions({
			cfg,
			mediaUrl: media?.mediaUrl,
			mediaAccess: media?.mediaAccess,
			mediaLocalRoots: media?.mediaAccess?.localRoots,
			mediaReadFile: media?.mediaAccess?.readFile,
			accountId,
			replyToId,
			maxBytes
		}));
		return {
			channel: params.channel,
			...result
		};
	};
	const outbound = {
		deliveryMode: "direct",
		chunker: chunkText,
		chunkerMode: "text",
		textChunkLimit: 4e3,
		sanitizeText: ({ text }) => sanitizeForPlainText(text),
		sendPayload: async (ctx) => {
			const { sendTextMediaPayload } = await import("./plugin-sdk/reply-payload.js");
			return await sendTextMediaPayload({
				channel: params.channel,
				ctx,
				adapter: outbound
			});
		},
		sendText: (ctx) => sendDirect(ctx, params.buildTextOptions),
		sendMedia: (ctx) => {
			const { mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile } = ctx;
			return sendDirect(ctx, params.buildMediaOptions, {
				mediaUrl,
				mediaAccess: mediaAccess ?? (mediaLocalRoots || mediaReadFile ? {
					...mediaLocalRoots?.length ? { localRoots: mediaLocalRoots } : {},
					...mediaReadFile ? { readFile: mediaReadFile } : {}
				} : void 0)
			});
		}
	};
	return outbound;
}
//#endregion
//#region src/plugin-sdk/media-runtime.ts
/**
* @deprecated Broad public SDK barrel. Prefer focused media-store, media-mime,
* outbound-media, and capability runtime subpaths.
*/
const loadAudioPreflight = createLazyRuntimeModule(() => import("./audio-preflight-DN0e9rIz.mjs"));
const loadMediaRunner = createLazyRuntimeModule(() => import("./runner-DYeTQdcb.mjs"));
/** Transcribes the first audio attachment without loading the runner during plugin registration. */
const transcribeFirstAudio = async (...args) => (await loadAudioPreflight()).transcribeFirstAudio(...args);
/** Resolves an image model through the media runner when selection is requested. */
const resolveAutoImageModel = async (...args) => (await loadMediaRunner()).resolveAutoImageModel(...args);
//#endregion
export { createScopedChannelMediaMaxBytesResolver as i, transcribeFirstAudio as n, createDirectTextMediaOutbound as r, resolveAutoImageModel as t };
