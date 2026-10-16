import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as isSilentReplyPayloadText } from "./tokens-D4ghQG_g.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/auto-reply/group-thread-context.ts
const turns = resolveGlobalSingleton(Symbol.for("openclaw.groupThreadContext"), () => new AsyncLocalStorage());
const toolReplies = resolveGlobalSingleton(Symbol.for("openclaw.groupThreadToolReplies"), () => new AsyncLocalStorage());
async function captureGroupThreadToolReply(run, source) {
	if (!currentScope()) return {
		result: await run(),
		observed: false
	};
	const capture = {
		active: true,
		observed: false,
		source
	};
	return toolReplies.run(capture, async () => {
		try {
			return {
				result: await run(),
				observed: capture.observed,
				text: capture.text
			};
		} finally {
			capture.active = false;
		}
	});
}
/** Restore source attribution after modifying hooks; undefined preserves cancellation. */
function finalizeGroupThreadToolReply(text, event, context) {
	const capture = toolReplies.getStore();
	let content = text;
	if (capture?.active && currentScope() && (!capture.source || capture.source.matches(event, context))) {
		if (content?.trim() && !isSilentReplyPayloadText(content)) content = capture.source?.format(content) ?? content;
		capture.observed = true;
		capture.text = content?.slice(0, 4e3);
	}
	return content;
}
function withGroupThreadTurn(scope, run) {
	const owned = {
		...scope,
		active: true
	};
	return turns.run(owned, async () => {
		try {
			return await run();
		} finally {
			owned.active = false;
		}
	});
}
function currentScope() {
	const scope = turns.getStore();
	return scope?.active ? scope : void 0;
}
function getGroupThreadTurn() {
	return currentScope()?.turn;
}
function getGroupThreadParticipant() {
	return currentScope()?.participant;
}
async function adoptGroupThreadRoot(lifecycle) {
	if (lifecycle) await currentScope()?.adopt?.(lifecycle);
}
function bindGroupThreadDispatchContext(ctx) {
	const runState = {};
	const scope = currentScope();
	if (scope) scope.dispatch = {
		ctx,
		runState
	};
	return runState;
}
function getGroupThreadDispatchContext() {
	return currentScope()?.dispatch;
}
/** Data-only delivery identity, including unlabeled single-participant groups. */
function getGroupThreadDeliverySession() {
	const ctx = currentScope()?.dispatch?.ctx;
	return ctx?.AgentId && ctx.SessionKey ? {
		agentId: ctx.AgentId,
		sessionKey: ctx.SessionKey
	} : void 0;
}
function recordGroupThreadReply(payload) {
	currentScope()?.recordReply(payload);
}
/** Message actions use the initiating channel's encoder, without changing delivery ownership. */
function formatGroupThreadReply(text) {
	const scope = currentScope();
	if (!scope?.participant || !scope.formatReply) return text;
	const label = scope.formatReply("", scope.participant);
	return label && text.startsWith(label) ? text : scope.formatReply(text, scope.participant);
}
//#endregion
export { formatGroupThreadReply as a, getGroupThreadParticipant as c, withGroupThreadTurn as d, finalizeGroupThreadToolReply as i, getGroupThreadTurn as l, bindGroupThreadDispatchContext as n, getGroupThreadDeliverySession as o, captureGroupThreadToolReply as r, getGroupThreadDispatchContext as s, adoptGroupThreadRoot as t, recordGroupThreadReply as u };
