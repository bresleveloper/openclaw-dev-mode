import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-GzjKtFvA.mjs";
import { t as MAX_PAYLOAD_BYTES } from "./payload-limits-ChDi8AHf.mjs";
import { t as resolveChatAttachmentFrameBudgetBytes } from "./chat-attachment-frame-budget-BBmKdOhk.mjs";
//#region src/gateway/chat-attachment-policy.ts
const DEFAULT_CHAT_ATTACHMENT_MAX_MB = 20;
const MAX_ADVERTISED_ATTACHMENT_BYTES = resolveChatAttachmentFrameBudgetBytes(MAX_PAYLOAD_BYTES);
/** Default decoded-size ceiling when `agents.defaults.mediaMaxMb` is unset or invalid. */
const DEFAULT_CHAT_ATTACHMENT_MAX_BYTES = DEFAULT_CHAT_ATTACHMENT_MAX_MB * 1024 * 1024;
function resolveChatAttachmentMaxBytes(cfg) {
	const configured = cfg.agents?.defaults?.mediaMaxMb;
	const mb = asPositiveFiniteNumber(configured) ?? DEFAULT_CHAT_ATTACHMENT_MAX_MB;
	return Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, Math.floor(mb * 1024 * 1024)));
}
/**
* Connection-wide decoded-size ceilings; MIME and count limits depend on the
* entrypoint and model. Images must also fit the agent-hydration cap.
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
