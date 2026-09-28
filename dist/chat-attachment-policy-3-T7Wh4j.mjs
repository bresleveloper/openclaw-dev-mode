import { r as MAX_IMAGE_BYTES } from "./constants-DUxuqQz8.mjs";
import { a as MAX_PAYLOAD_BYTES } from "./server-constants-Dx_kHnY5.mjs";
//#region src/gateway/chat-attachment-policy.ts
const DEFAULT_CHAT_ATTACHMENT_MAX_MB = 20;
const MAX_ADVERTISED_ATTACHMENT_BYTES = Math.floor((MAX_PAYLOAD_BYTES - 262144) * 3 / 4);
/** Default decoded-size ceiling when `agents.defaults.mediaMaxMb` is unset or invalid. */
const DEFAULT_CHAT_ATTACHMENT_MAX_BYTES = DEFAULT_CHAT_ATTACHMENT_MAX_MB * 1024 * 1024;
/** Resolve the maximum decoded attachment size accepted for chat inputs. */
function resolveChatAttachmentMaxBytes(cfg) {
	const configured = cfg.agents?.defaults?.mediaMaxMb;
	const mb = typeof configured === "number" && Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_CHAT_ATTACHMENT_MAX_MB;
	return Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, Math.floor(mb * 1024 * 1024)));
}
/**
* Resolve the decoded-size ceilings every chat attachment faces regardless of
* entrypoint or model. Images are checked against the configured ceiling first
* and the agent-hydration cap second, so their effective limit is the smaller of
* the two. MIME acceptance and per-message counts are deliberately absent: they
* depend on the entrypoint, the resolved model, and payload sniffing, so they
* cannot be stated once per connection.
*/
function resolveChatAttachmentPolicy(cfg) {
	const maxBytes = Math.min(resolveChatAttachmentMaxBytes(cfg), MAX_ADVERTISED_ATTACHMENT_BYTES);
	return {
		maxBytes,
		maxImageBytes: Math.min(maxBytes, MAX_IMAGE_BYTES)
	};
}
//#endregion
export { resolveChatAttachmentMaxBytes as n, resolveChatAttachmentPolicy as r, DEFAULT_CHAT_ATTACHMENT_MAX_BYTES as t };
