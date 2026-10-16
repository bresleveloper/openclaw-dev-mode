import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as maxBytesForKind } from "./constants-GzjKtFvA.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { t as MEDIA_MAX_BYTES } from "./store-A0dMc8iV.mjs";
//#region src/media/configured-max-bytes.ts
const MB = 1048576;
/** Native local audio/video displayed by webchat is streamed, independently of channel caps. */
const WEBCHAT_LOCAL_MEDIA_MAX_BYTES = 4096 * MB;
const TELEGRAM_DEFAULT_MEDIA_MAX_MB = 100;
/** Returns the configured media cap, falling back to the media-core per-kind default. */
function resolveGeneratedMediaMaxBytes(cfg, kind) {
	const configured = cfg?.agents?.defaults?.mediaMaxMb;
	return typeof configured === "number" && Number.isFinite(configured) && configured > 0 ? Math.floor(configured * MB) : maxBytesForKind(kind);
}
/** Reads channel/account media caps from raw channel config without requiring typed account schemas. */
function resolveChannelAccountMediaMaxMb(params) {
	const channelId = params.channel?.trim();
	const accountId = params.accountId?.trim();
	const channelCfg = channelId ? params.cfg.channels?.[channelId] : void 0;
	const channelObj = asOptionalObjectRecord(channelCfg);
	const channelMediaMax = typeof channelObj?.mediaMaxMb === "number" ? channelObj.mediaMaxMb : void 0;
	const accountsObj = asOptionalObjectRecord(channelObj?.accounts);
	const accountMediaMax = (accountId && channelId ? asOptionalObjectRecord(resolveChannelAccountEntry(accountsObj, accountId, channelId, normalizeAccountId)) : void 0)?.mediaMaxMb;
	return (typeof accountMediaMax === "number" ? accountMediaMax : void 0) ?? channelMediaMax;
}
/** Resolves the byte cap for staging an outbound reply's media from its configured channel/account, agent, or Telegram default. */
function resolveOutboundMediaMaxBytes(params) {
	const limitMb = resolveChannelAccountMediaMaxMb(params) ?? params.cfg.agents?.defaults?.mediaMaxMb ?? (params.channel?.trim().toLowerCase() === "telegram" ? TELEGRAM_DEFAULT_MEDIA_MAX_MB : void 0);
	return typeof limitMb === "number" && Number.isFinite(limitMb) && limitMb > 0 ? Math.floor(limitMb * MB) : MEDIA_MAX_BYTES;
}
//#endregion
export { resolveOutboundMediaMaxBytes as i, resolveChannelAccountMediaMaxMb as n, resolveGeneratedMediaMaxBytes as r, WEBCHAT_LOCAL_MEDIA_MAX_BYTES as t };
