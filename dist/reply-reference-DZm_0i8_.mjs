import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/auto-reply/reply/reply-reference.ts
function isSingleUseReplyToMode(mode) {
	return mode === "first" || mode === "batched";
}
function createReplyReferencePlanner(options) {
	let hasReplied = options.hasReplied ?? false;
	const allowReference = options.allowReference !== false;
	const existingId = normalizeOptionalString(options.existingId);
	const startId = normalizeOptionalString(options.startId);
	const resolve = () => {
		if (!allowReference || options.replyToMode === "off" || isSingleUseReplyToMode(options.replyToMode) && hasReplied) return;
		return existingId ?? startId;
	};
	return {
		peek: resolve,
		use() {
			const id = resolve();
			if (id) hasReplied = true;
			return id;
		},
		markSent() {
			hasReplied = true;
		},
		hasReplied: () => hasReplied
	};
}
//#endregion
export { isSingleUseReplyToMode as n, createReplyReferencePlanner as t };
