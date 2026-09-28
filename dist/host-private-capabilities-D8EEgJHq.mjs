import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/harness/host-private-capabilities.ts
const questionAnswerScope = new AsyncLocalStorage();
const questionAnswerCapabilities = /* @__PURE__ */ new WeakMap();
/** Retain the creator's prepared policy; a matching hash alone never grants authority. */
function createAgentQuestionAnswerAuthority(params) {
	return Object.freeze({
		sessionKey: params.sessionKey.trim(),
		assertActive: params.assertActive,
		admitTranscriptAnswer: params.admitTranscriptAnswer,
		assertCaller: (caller) => {
			params.assertActive();
			const projected = params.project(caller);
			params.assertActive();
			if (!params.fingerprint || projected !== params.fingerprint) throw new Error("question answer caller policy does not match its creator");
		}
	});
}
function withAgentQuestionAnswerAuthority(authority, run) {
	return questionAnswerScope.run(authority, run);
}
function registerAgentHarnessQuestionAnswerAuthority(hostCapabilities, authority) {
	questionAnswerCapabilities.set(hostCapabilities, authority);
}
/** An explicit host carrier cannot fall back to an unrelated ambient creator. */
function resolveAgentQuestionAnswerAuthority(hostCapabilities) {
	return hostCapabilities ? questionAnswerCapabilities.get(hostCapabilities) : questionAnswerScope.getStore();
}
function captureAgentQuestionAnswerAuthority(sessionKey) {
	const authority = questionAnswerScope.getStore();
	authority?.assertActive();
	if (authority && authority.sessionKey !== sessionKey.trim()) throw new Error("question creator authority belongs to another session");
	return authority;
}
const retainedBeforeToolCallRunners = /* @__PURE__ */ new WeakMap();
/** Retain issued policy without importing the capability constructor and its tool graph. */
function retainBeforeToolCallForNativeHookRelay(runBeforeToolCall) {
	return retainedBeforeToolCallRunners.get(runBeforeToolCall)?.();
}
function registerAgentHarnessBeforeToolCallRetention(runBeforeToolCall, retain) {
	retainedBeforeToolCallRunners.set(runBeforeToolCall, retain);
}
const scheduledToolProjectionCapabilities = /* @__PURE__ */ new WeakMap();
const ttsProvenanceTransferCapabilities = /* @__PURE__ */ new WeakMap();
function registerAgentHarnessScheduledToolProjectionCapability(params) {
	scheduledToolProjectionCapabilities.set(params.hostCapabilities, Object.freeze({
		ownerPluginId: params.ownerPluginId,
		create: params.create
	}));
}
/** Resolves a private issuer only for the exact authoritative plugin owner. */
function resolveAgentHarnessScheduledToolProjectionCapability(params) {
	const capability = scheduledToolProjectionCapabilities.get(params.hostCapabilities);
	return capability?.ownerPluginId === params.ownerPluginId ? capability.create : void 0;
}
function registerAgentHarnessTtsProvenanceTransferCapability(params) {
	ttsProvenanceTransferCapabilities.set(params.hostCapabilities, Object.freeze({
		ownerPluginId: params.ownerPluginId,
		transfer: params.transfer
	}));
}
/** Resolves private TTS delivery transfer only for the exact authoritative plugin owner. */
function resolveAgentHarnessTtsProvenanceTransferCapability(params) {
	const capability = ttsProvenanceTransferCapabilities.get(params.hostCapabilities);
	return capability?.ownerPluginId === params.ownerPluginId ? capability.transfer : void 0;
}
//#endregion
export { registerAgentHarnessScheduledToolProjectionCapability as a, resolveAgentHarnessTtsProvenanceTransferCapability as c, withAgentQuestionAnswerAuthority as d, registerAgentHarnessQuestionAnswerAuthority as i, resolveAgentQuestionAnswerAuthority as l, createAgentQuestionAnswerAuthority as n, registerAgentHarnessTtsProvenanceTransferCapability as o, registerAgentHarnessBeforeToolCallRetention as r, resolveAgentHarnessScheduledToolProjectionCapability as s, captureAgentQuestionAnswerAuthority as t, retainBeforeToolCallForNativeHookRelay as u };
