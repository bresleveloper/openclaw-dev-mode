import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { safeParseJson, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/matrix/src/matrix/sdk/event-helpers.ts
const matrixEventProjections = /* @__PURE__ */ new WeakMap();
function getMatrixEventProjection(event) {
	return matrixEventProjections.get(event);
}
function matrixEventToRaw(event, opts = {}) {
	const originalContent = event.getOriginalContent();
	const content = opts.contentMode === "original" ? originalContent : event.getContent();
	const relation = originalContent["m.relates_to"] || event.getWireContent()["m.relates_to"];
	const normalizedContent = relation && !Object.hasOwn(content, "m.relates_to") ? {
		...content,
		"m.relates_to": relation
	} : content;
	const raw = {
		event_id: event.getId() ?? "",
		sender: event.getSender() ?? "",
		type: event.getType() ?? "",
		origin_server_ts: event.getTs() ?? 0,
		content: normalizedContent,
		unsigned: event.getUnsigned()
	};
	const stateKey = event.getStateKey() ?? event.getWireStateKey();
	if (typeof stateKey === "string") raw.state_key = stateKey;
	matrixEventProjections.set(raw, {
		decryptionFailure: event.isDecryptionFailure(),
		originalContent
	});
	return raw;
}
function parseMxc(url) {
	const match = /^mxc:\/\/([^/]+)\/(.+)$/.exec(url.trim());
	if (!match) return null;
	const server = match[1];
	const mediaId = match[2];
	if (!server || !mediaId) return null;
	return {
		server,
		mediaId
	};
}
function buildHttpError(statusCode, bodyText) {
	let message = `Matrix HTTP ${statusCode}`;
	if (bodyText.trim()) {
		const parsed = safeParseJson(bodyText);
		message = normalizeOptionalString(parsed?.error) ?? truncateUtf16Safe(bodyText, 500);
	}
	return Object.assign(new Error(message), { statusCode });
}
//#endregion
export { parseMxc as i, getMatrixEventProjection as n, matrixEventToRaw as r, buildHttpError as t };
