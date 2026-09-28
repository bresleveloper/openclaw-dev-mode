import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import "./http-body-Bl_jph25.mjs";
import "./mime-1zBUMwu6.mjs";
import "./media-services-VTwDQdlk.mjs";
import "./local-roots-CfRBR4Iu.mjs";
import "./store-BrX2xbJz.mjs";
import "./fetch-BwQIypCT.mjs";
import { a as chunkText } from "./chunk-D0NagiTt.mjs";
import "./defaults-CJPLJeAl.mjs";
import "./image-runtime-CgM_qz8p.mjs";
import "./audio-DJnvjL4a.mjs";
import "./outbound-attachment-CkZRbKkg.mjs";
import "./agent-media-payload-DMClcnNY.mjs";
import { t as sanitizeForPlainText } from "./sanitize-text-q5V8Zg_l.mjs";
import "./qr-image-BrIEup0G.mjs";
import "./qr-terminal-D9I7Hp6E.mjs";
import "./temp-files-Dwz8r2k2.mjs";
import { t as resolveChannelMediaMaxBytes } from "./media-limits-CiIIWne3.mjs";
//#region src/channels/plugins/outbound/direct-text-media.ts
/**
* Direct text/media outbound adapter helpers.
*
* Builds lightweight SDK-backed send adapters with chunking, sanitization, and media limits.
*/
function readNumberField(record, key) {
	const value = record?.[key];
	return typeof value === "number" ? value : void 0;
}
/**
* Builds a media byte-limit resolver for channels with `mediaMaxMb` config.
*/
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
/**
* Creates a channel outbound adapter backed by direct text/media send functions.
*/
function createDirectTextMediaOutbound(params) {
	const sendDirect = async (sendParams) => {
		const send = params.resolveSender(sendParams.deps);
		const maxBytes = params.resolveMaxBytes({
			cfg: sendParams.cfg,
			accountId: sendParams.accountId
		});
		const result = await send(sendParams.to, sendParams.text, sendParams.buildOptions({
			cfg: sendParams.cfg,
			mediaUrl: sendParams.mediaUrl,
			mediaAccess: sendParams.mediaAccess,
			mediaLocalRoots: sendParams.mediaAccess?.localRoots,
			mediaReadFile: sendParams.mediaAccess?.readFile,
			accountId: sendParams.accountId,
			replyToId: sendParams.replyToId,
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
		sendText: async ({ cfg, to, text, accountId, deps, replyToId }) => {
			return await sendDirect({
				cfg,
				to,
				text,
				accountId,
				deps,
				replyToId,
				buildOptions: params.buildTextOptions
			});
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile, accountId, deps, replyToId }) => {
			return await sendDirect({
				cfg,
				to,
				text,
				mediaUrl,
				mediaAccess: mediaAccess ?? (mediaLocalRoots || mediaReadFile ? {
					...mediaLocalRoots?.length ? { localRoots: mediaLocalRoots } : {},
					...mediaReadFile ? { readFile: mediaReadFile } : {}
				} : void 0),
				accountId,
				deps,
				replyToId,
				buildOptions: params.buildMediaOptions
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
const loadAudioPreflight = createLazyRuntimeModule(() => import("./audio-preflight-CRY2u0dB.mjs"));
const loadMediaRunner = createLazyRuntimeModule(() => import("./runner-C19_MoAt.mjs"));
/** Transcribes the first audio attachment without loading the runner during plugin registration. */
const transcribeFirstAudio = async (...args) => (await loadAudioPreflight()).transcribeFirstAudio(...args);
/** Resolves an image model through the media runner when selection is requested. */
const resolveAutoImageModel = async (...args) => (await loadMediaRunner()).resolveAutoImageModel(...args);
//#endregion
export { createScopedChannelMediaMaxBytesResolver as i, transcribeFirstAudio as n, createDirectTextMediaOutbound as r, resolveAutoImageModel as t };
