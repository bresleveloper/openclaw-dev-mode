import { s as withSessionTranscriptQuestionAnswers } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { f as resolveAdmittedRunActiveAssertion, u as readAdmittedRunOperatorAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { d as getAttachedBackend } from "./reply-run-registry.state-C5EjI8Kf.mjs";
import { g as resolveActiveReplyOperationForSessionId } from "./reply-run-registry.registry-DycIsDrE.mjs";
import "./reply-run-registry-Cpef_Ljt.mjs";
import { i as getGatewayToolCallerIdentity, o as withGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { d as withAgentQuestionAnswerAuthority, i as registerAgentHarnessQuestionAnswerAuthority, n as createAgentQuestionAnswerAuthority } from "./host-private-capabilities-D8EEgJHq.mjs";
import { t as prepareReplyToolAuthority } from "./reply-tool-authority-_0-jZU7C.mjs";
//#region src/agents/harness/tool-authority.runtime.ts
/** Execution-only: policy preparation must finish before authority reaches a publisher. */
async function withPreparedEmbeddedRunToolAuthority(internal, attempt, narrow, run) {
	const admitted = internal.admittedRunContext;
	const instance = admitted.operationalRunInstance;
	const assertAdmitted = resolveAdmittedRunActiveAssertion(admitted, attempt.abortSignal);
	const inherited = getGatewayToolCallerIdentity();
	const source = inherited?.operationalRunInstance === instance ? inherited : void 0;
	const { sessionId, sessionKey, sessionFile, agentId, runId } = attempt;
	const route = {
		provider: attempt.provider,
		model: attempt.modelId
	};
	const operation = attempt.toolAuthorityFingerprint ? internal.replyOperation : void 0;
	const assertHostActive = attempt.hostCapabilities?.assertActive;
	const input = {
		originatingChannel: attempt.messageChannel,
		toolsAllow: attempt.toolsAllow,
		disableTools: attempt.disableTools,
		operatorAuthority: readAdmittedRunOperatorAuthority(admitted),
		run: {
			...attempt,
			model: attempt.modelId,
			runtimePolicySessionKey: attempt.sandboxSessionKey,
			traceAuthorized: false,
			spawnedBy: attempt.spawnedBy ?? void 0,
			senderId: attempt.senderId ?? void 0,
			senderName: attempt.senderName ?? void 0,
			senderUsername: attempt.senderUsername ?? void 0,
			senderE164: attempt.senderE164 ?? void 0,
			messageProvider: attempt.messageProvider ?? void 0,
			agentAccountId: attempt.agentAccountId ?? void 0,
			groupId: attempt.groupId ?? void 0,
			groupChannel: attempt.groupChannel ?? void 0,
			groupSpace: attempt.groupSpace ?? void 0
		}
	};
	let live = true;
	const direct = operation ? void 0 : prepareReplyToolAuthority(input, narrow);
	if (operation) assertActive();
	const fingerprint = operation ? operation.bindToolAuthorityRoute(route) : direct?.fingerprint();
	function assertActive() {
		if (!live || !assertAdmitted || admitted.operationalRunInstance !== instance || instance.runId !== runId) throw new Error("embedded tool authority is no longer active");
		assertAdmitted();
		assertHostActive?.();
		if (source && (source.agentId !== agentId || source.sessionKey !== sessionKey) || source?.workerTurnClaim && (source.workerTurnClaim.sessionId !== sessionId || source.workerTurnClaim.runId !== runId || !source.receiptAuthority) || source?.receiptAuthority?.() === false || source?.gatewayContextResolver && !source.gatewayContextResolver()) throw new Error("embedded tool authority lost its source execution claim");
	}
	const assertQuestionActive = () => {
		assertActive();
		if (operation && (resolveActiveReplyOperationForSessionId(sessionId) !== operation || operation.toolAuthorityRoute?.provider !== route.provider || operation.toolAuthorityRoute.model !== route.model || operation.toolAuthorityFingerprint !== fingerprint)) throw new Error("question creator reply authority is no longer active");
	};
	const runPrepared = () => withSessionTranscriptQuestionAnswers(attempt.userTurnTranscriptRecorder, assertQuestionActive, (admitTranscriptAnswer) => {
		const questionAuthority = sessionKey ? createAgentQuestionAnswerAuthority({
			sessionKey,
			fingerprint,
			project: (caller) => operation ? operation.projectToolAuthorityFingerprint(caller) : direct?.project(caller, route),
			assertActive: assertQuestionActive,
			admitTranscriptAnswer
		}) : void 0;
		if (attempt.hostCapabilities && questionAuthority) registerAgentHarnessQuestionAnswerAuthority(attempt.hostCapabilities, questionAuthority);
		return withAgentQuestionAnswerAuthority(questionAuthority, () => run({
			...attempt,
			toolAuthorityFingerprint: fingerprint
		}));
	});
	try {
		if (!agentId || !sessionKey) return await runPrepared();
		return await withGatewayToolCallerIdentity({
			agentId,
			sessionKey,
			operationalRunInstance: instance,
			embeddedRunToolAuthorityBinding: (registration) => {
				assertActive();
				const { handle } = registration;
				if (registration.sessionId !== sessionId || registration.sessionKey !== sessionKey || registration.sessionFile !== sessionFile || registration.agentId !== void 0 && registration.agentId !== agentId || handle.runId !== runId || !fingerprint || handle.toolAuthorityFingerprint !== fingerprint) throw new Error("embedded tool authority registration does not match its attempt");
				const assertRegistered = () => {
					assertActive();
					if (handle.runId !== runId || handle.toolAuthorityFingerprint !== fingerprint) throw new Error("embedded tool authority handle changed");
				};
				const ownsOperation = () => !operation || resolveActiveReplyOperationForSessionId(sessionId) === operation && getAttachedBackend(operation) === handle && operation.toolAuthorityRoute?.provider === route.provider && operation.toolAuthorityRoute.model === route.model;
				assertRegistered();
				return {
					source: operation ? "reply" : "attempt",
					assertActive: assertRegistered,
					project: (overlay) => {
						assertRegistered();
						if (!ownsOperation()) return;
						const projected = operation ? operation.projectToolAuthorityFingerprint(overlay) : direct?.project(overlay, route);
						assertRegistered();
						return ownsOperation() ? projected : void 0;
					}
				};
			}
		}, runPrepared);
	} finally {
		live = false;
	}
}
//#endregion
export { withPreparedEmbeddedRunToolAuthority };
