import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/harness/host-private-capabilities.ts
const replyInputChannel = resolveGlobalSingleton(Symbol.for("openclaw.replyInputChannel"), () => Symbol("replyInputChannel"));
function bindReplyInputChannel(input, channel) {
	Object.assign(input, { [replyInputChannel]: channel });
}
function readReplyInputChannel(input) {
	const channel = Reflect.get(input, replyInputChannel);
	return typeof channel === "string" ? channel : void 0;
}
const sharedGatewayOwnerSources = resolveGlobalSingleton(Symbol.for("openclaw.sharedGatewayOwnerSources"), () => /* @__PURE__ */ new WeakSet());
function bindSharedGatewayOwnerRunAuthority(authority) {
	if (authority.source) sharedGatewayOwnerSources.add(authority.source);
}
function isSharedGatewayOwnerRunAuthority(authority) {
	return Boolean(authority?.profileId === "gateway-owner" && authority.source && sharedGatewayOwnerSources.has(authority.source));
}
const questionDispatchCapabilities = /* @__PURE__ */ new WeakMap();
function bindQuestionDispatchCapability(assertCurrent, capability, prepareCurrent) {
	questionDispatchCapabilities.set(assertCurrent, capability);
	if (prepareCurrent) questionDispatchCapabilities.set(prepareCurrent, capability);
}
function readQuestionDispatchCapability(assertCurrent) {
	return assertCurrent ? questionDispatchCapabilities.get(assertCurrent) : void 0;
}
/** Preserve reservation refusal tracking on every final policy check. */
function bindQuestionDispatchGuard(assertCurrent, authority, refuse) {
	const prepareCurrent = authority?.prepareCurrent && (async () => {
		try {
			assertCurrent();
			await authority?.prepareCurrent?.();
			assertCurrent();
		} catch (error) {
			refuse(error);
		}
	});
	const guard = (check) => {
		try {
			assertCurrent();
			check();
			assertCurrent();
		} catch (error) {
			refuse(error);
		}
	};
	const capability = readQuestionDispatchCapability(authority?.assertCurrent);
	const callerRead = capability?.callerRead;
	bindQuestionDispatchCapability(assertCurrent, {
		assertCompatibilityCurrent: () => guard(capability?.assertCompatibilityCurrent ?? assertCurrent),
		callerRead: callerRead && {
			reads: callerRead.reads,
			prepareCurrent,
			assertPrepared: (reads) => guard(() => callerRead.assertPrepared(reads)),
			retainCurrent: () => {
				let retained;
				try {
					retained = callerRead.retainCurrent();
				} catch (error) {
					return refuse(error);
				}
				return {
					release: retained.release,
					assertCurrent: () => guard(retained.assertCurrent)
				};
			}
		}
	}, prepareCurrent);
	return prepareCurrent;
}
function prepareQuestionGatewayDispatch(authority, inProcess = false) {
	const capability = readQuestionDispatchCapability(authority?.assertCurrent);
	return {
		assertDispatchCurrent: inProcess ? authority?.assertCurrent : capability?.assertCompatibilityCurrent ?? authority?.assertCurrent,
		prepareDispatchCurrent: authority?.prepareCurrent
	};
}
const callerReadPreparers = /* @__PURE__ */ new WeakMap();
const toolAuthorityReadScope = new AsyncLocalStorage();
const workerToolPreparations = /* @__PURE__ */ new WeakMap();
function bindWorkerToolPreparation(preparation, dependencies = []) {
	workerToolPreparations.set(preparation.prepareCurrent, { complete: dependencies.every((dependency) => workerToolPreparations.get(dependency.prepareCurrent)?.complete === true) });
	return preparation;
}
function isToolAuthorityReadCaptureActive() {
	return toolAuthorityReadScope.getStore() !== void 0;
}
function recordPreparedToolAuthorityRead(read) {
	toolAuthorityReadScope.getStore()?.reads.push(read);
}
async function capturePreparedToolAuthorityReads(preparation) {
	const metadata = workerToolPreparations.get(preparation.prepareCurrent);
	const scope = {
		reads: [],
		complete: metadata?.complete ?? false
	};
	if (metadata) await toolAuthorityReadScope.run(scope, preparation.prepareCurrent);
	else await preparation.prepareCurrent();
	preparation.assertCurrent();
	return {
		reads: scope.reads,
		assertCompatibility: !scope.complete || !scope.reads.length ? preparation.compatAssertCurrent : void 0
	};
}
function bindReplyToolAuthorityCallerRead(projector, prepare) {
	callerReadPreparers.set(projector, prepare);
}
async function prepareReplyToolAuthorityCallerRead(projector, caller, fingerprint, route, assertCurrent) {
	assertCurrent();
	const prepared = projector && fingerprint ? await callerReadPreparers.get(projector)?.(caller, fingerprint, route, assertCurrent) : void 0;
	const scope = toolAuthorityReadScope.getStore();
	if (scope && !prepared) scope.complete = false;
	return prepared;
}
function assertQuestionCompatibilityCurrent(assertActive, callerRead, fallback) {
	assertActive();
	const retained = callerRead?.retainCurrent();
	try {
		if (retained) retained.assertCurrent();
		else {
			warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "question dispatcher authority.assertCurrent synchronous preparation",
				replacement: "await authority.assertCurrentAsync() before the final effect assertion"
			});
			fallback();
		}
	} finally {
		retained?.release();
	}
	assertActive();
}
/** Compose captured policy reads with the question owner's final synchronous admission. */
async function prepareQuestionInputAuthority(authority) {
	const preparation = authority.toolAuthorityPreparation;
	if (!preparation) return authority;
	const assertActive = () => {
		authority.assertCurrent();
		preparation.assertCurrent();
	};
	assertActive();
	const captured = await capturePreparedToolAuthorityReads(preparation);
	assertActive();
	const supported = !captured.assertCompatibility && captured.reads.length > 0 && captured.reads.every((read) => read.retainCurrent);
	const assertLegacyReads = () => {
		for (const read of captured.reads) read.assertLegacyCurrent();
	};
	const prepareCurrent = async () => {
		assertActive();
		await preparation.prepareCurrent();
		if (!supported) assertLegacyReads();
		assertActive();
	};
	const callerRead = supported ? {
		reads: captured.reads.flatMap((read) => read.reads),
		prepareCurrent,
		assertPrepared: (reads) => {
			assertActive();
			let offset = 0;
			for (const read of captured.reads) {
				read.assertPrepared(reads.slice(offset, offset + read.reads.length));
				offset += read.reads.length;
			}
			assertActive();
		},
		retainCurrent: () => {
			const retained = [];
			const release = () => {
				const errors = [];
				for (const read of retained.toReversed()) try {
					read.release();
				} catch (error) {
					errors.push(error);
				}
				throwSqliteLifecycleErrors(errors, "Question authority reader release failed");
			};
			try {
				for (const read of captured.reads) retained.push(read.retainCurrent());
				return {
					release,
					assertCurrent: () => {
						assertActive();
						retained.forEach((read) => read.assertCurrent());
						assertActive();
					}
				};
			} catch (error) {
				release();
				throw error;
			}
		}
	} : void 0;
	const assertCompatibilityCurrent = () => assertQuestionCompatibilityCurrent(assertActive, callerRead, () => {
		preparation.compatAssertCurrent();
		assertLegacyReads();
	});
	const assertCurrent = supported ? assertActive : () => {
		assertActive();
		preparation.compatAssertCurrent();
		assertActive();
	};
	bindQuestionDispatchCapability(assertCurrent, {
		assertCompatibilityCurrent,
		callerRead
	});
	return {
		kind: authority.kind,
		assertCurrent,
		prepareCurrent
	};
}
async function prepareQuestionCallerAuthority(authority, caller, assertActive) {
	assertActive();
	const callerRead = await authority.prepareCaller?.(caller);
	assertActive();
	const assertCompatibilityCurrent = () => assertQuestionCompatibilityCurrent(assertActive, callerRead, () => authority.assertCaller(caller));
	const assertCurrent = callerRead ? assertActive : assertCompatibilityCurrent;
	bindQuestionDispatchCapability(assertCurrent, {
		assertCompatibilityCurrent,
		callerRead
	});
	return {
		kind: "source-bound",
		assertCurrent,
		prepareCurrent: async () => {
			assertActive();
			if (callerRead) await callerRead.prepareCurrent();
			else authority.assertCaller(caller);
			assertActive();
		}
	};
}
const questionAnswerScope = new AsyncLocalStorage();
const questionAnswerCapabilities = /* @__PURE__ */ new WeakMap();
/** Retain the creator's prepared policy; a matching hash alone never grants authority. */
function createAgentQuestionAnswerAuthority(params) {
	return Object.freeze({
		sessionKey: params.sessionKey.trim(),
		requesterProfileId: params.requesterProfileId,
		assertActive: params.assertActive,
		admitTranscriptAnswer: params.admitTranscriptAnswer,
		prepareCaller: params.prepareCaller,
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
export { resolveAgentHarnessTtsProvenanceTransferCapability as C, withAgentQuestionAnswerAuthority as E, resolveAgentHarnessScheduledToolProjectionCapability as S, retainBeforeToolCallForNativeHookRelay as T, recordPreparedToolAuthorityRead as _, bindWorkerToolPreparation as a, registerAgentHarnessScheduledToolProjectionCapability as b, createAgentQuestionAnswerAuthority as c, prepareQuestionCallerAuthority as d, prepareQuestionGatewayDispatch as f, readReplyInputChannel as g, readQuestionDispatchCapability as h, bindSharedGatewayOwnerRunAuthority as i, isSharedGatewayOwnerRunAuthority as l, prepareReplyToolAuthorityCallerRead as m, bindReplyInputChannel as n, captureAgentQuestionAnswerAuthority as o, prepareQuestionInputAuthority as p, bindReplyToolAuthorityCallerRead as r, capturePreparedToolAuthorityReads as s, bindQuestionDispatchGuard as t, isToolAuthorityReadCaptureActive as u, registerAgentHarnessBeforeToolCallRetention as v, resolveAgentQuestionAnswerAuthority as w, registerAgentHarnessTtsProvenanceTransferCapability as x, registerAgentHarnessQuestionAnswerAuthority as y };
