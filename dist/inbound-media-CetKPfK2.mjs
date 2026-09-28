import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizeMediaFacts, s as isMeaningfulMediaFact } from "./media-facts-BEHTU0wM.mjs";
//#region src/auto-reply/reply/inbound-media.ts
/** Detects inbound media and audio facts in channel message context. */
function meaningfulMedia(ctx) {
	return normalizeMediaFacts(ctx.media).filter(isMeaningfulMediaFact);
}
/** Returns true when the context carries current-turn media or sticker data. */
function hasInboundMedia(ctx) {
	return Boolean(ctx.StickerMediaIncluded || ctx.Sticker || meaningfulMedia(ctx).length > 0);
}
/** Returns true when current-turn media still needs automatic understanding. */
function hasInboundMediaForUnderstanding(ctx) {
	if (!ctx.SkipStickerMediaUnderstanding) return hasInboundMedia(ctx);
	return meaningfulMedia(ctx).length > 1;
}
function normalizeMediaType(value) {
	return normalizeOptionalString(value)?.split(";", 1)[0]?.trim().toLowerCase() || void 0;
}
/** Returns true when the current turn carries structured audio media facts. */
function hasInboundAudio(ctx) {
	const isAudio = (type) => type === "audio" || type?.startsWith("audio/") === true;
	return normalizeMediaFacts(ctx.media).some((media) => media.kind === "audio" || isAudio(normalizeMediaType(media.contentType)));
}
//#endregion
export { hasInboundMedia as n, hasInboundMediaForUnderstanding as r, hasInboundAudio as t };
