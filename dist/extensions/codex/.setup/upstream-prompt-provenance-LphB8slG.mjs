import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/upstream-prompt-provenance.ts
const UPSTREAM_USER_TEXT_META_KEY = "upstreamUserText";
const MIRROR_IDENTITY_META_KEY = "mirrorIdentity";
const CODEX_META_KEY = "__openclaw";
function attachCodexMirrorIdentity(message, identity) {
	const existing = CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0;
	const baseMeta = asOptionalRecord(existing) ?? {};
	return {
		...message,
		__openclaw: {
			...baseMeta,
			[MIRROR_IDENTITY_META_KEY]: identity
		}
	};
}
function readMirrorIdentity(message) {
	const meta = CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0;
	const record = asOptionalRecord(meta);
	if (!record) return;
	const id = record[MIRROR_IDENTITY_META_KEY];
	return typeof id === "string" && id ? id : void 0;
}
function attachUpstreamUserText(message, text) {
	const existing = CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0;
	const baseMeta = asOptionalRecord(existing) ?? {};
	return {
		...message,
		__openclaw: {
			...baseMeta,
			[UPSTREAM_USER_TEXT_META_KEY]: text
		}
	};
}
function readUpstreamUserText(message) {
	const meta = message && CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0;
	const record = asOptionalRecord(meta);
	if (!record) return;
	const text = record[UPSTREAM_USER_TEXT_META_KEY];
	return typeof text === "string" && text ? text : void 0;
}
//#endregion
export { readUpstreamUserText as i, attachUpstreamUserText as n, readMirrorIdentity as r, attachCodexMirrorIdentity as t };
