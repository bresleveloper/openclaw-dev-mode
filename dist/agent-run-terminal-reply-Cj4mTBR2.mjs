import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-DM667iyR.mjs";
import { n as normalizeAgentRunRouteChange } from "./agent-run-terminal-receipt-Cxhd8xRy.mjs";
//#region src/agents/agent-run-terminal-reply.ts
const AGENT_RUN_TERMINAL_REPLY_MAX_CHARS = 4096;
function isMessageToolNotCalledTerminalReply(reply) {
	return reply?.disposition === "empty" && reply.code === "message-tool-not-called";
}
/** Sanitizes and caps producer-owned text before it enters lifecycle or durable state. */
function sanitizeAgentRunTerminalReplyText(text) {
	return truncateWithMarker(stripInternalMetadataForDisplay(text).trim(), AGENT_RUN_TERMINAL_REPLY_MAX_CHARS, {
		marker: "…",
		reserve: 1,
		trimEnd: true
	});
}
/** Builds the authoritative terminal reply fact while raw assistant text is still available. */
function buildAgentRunTerminalReplySnapshot(params) {
	if (params.terminalReplyKind === "silent-empty" || isSilentReplyText(params.rawText ?? params.visibleText, "NO_REPLY")) return { disposition: "silent" };
	const text = sanitizeAgentRunTerminalReplyText(params.visibleText ?? "");
	return text ? {
		disposition: "visible",
		text
	} : { disposition: "empty" };
}
/** Normalizes lifecycle/RPC evidence without allowing raw or unbounded text through. */
function normalizeAgentRunTerminalReplySnapshot(value) {
	if (!isRecord(value)) return;
	const disposition = value.disposition;
	if (disposition === "silent") return { disposition };
	if (disposition === "empty") {
		if (value.code === "message-tool-not-called") return {
			disposition,
			code: "message-tool-not-called"
		};
		return { disposition };
	}
	if (disposition !== "visible") return;
	const rawText = value.text;
	if (typeof rawText !== "string") return;
	const text = sanitizeAgentRunTerminalReplyText(rawText);
	const modelRouteChange = normalizeAgentRunRouteChange(value.modelRouteChange);
	return text ? {
		disposition: "visible",
		text,
		...modelRouteChange ? { modelRouteChange } : {}
	} : { disposition: "empty" };
}
/** Reply evidence merges independently from sticky timeout/cancellation precedence. */
function mergeAgentRunTerminalReplySnapshot(existing, incoming) {
	if (!incoming || isMessageToolNotCalledTerminalReply(existing)) return existing;
	if (!existing || isMessageToolNotCalledTerminalReply(incoming) || existing.disposition === "empty") return incoming;
	return incoming.disposition === "empty" ? existing : incoming;
}
//#endregion
export { sanitizeAgentRunTerminalReplyText as i, mergeAgentRunTerminalReplySnapshot as n, normalizeAgentRunTerminalReplySnapshot as r, buildAgentRunTerminalReplySnapshot as t };
