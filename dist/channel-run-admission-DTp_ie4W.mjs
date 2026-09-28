import { i as consumeChannelAdmissionEvidence, u as recordChannelAdmissionDecision } from "./admission-evidence-aqOMZf0e.mjs";
import { a as createOperationalRunInstanceRef, c as prepareAgentRunAdmission } from "./admitted-run-context-BNasoszr.mjs";
//#region src/auto-reply/reply/channel-run-admission.ts
/** Adapt one opaque channel carrier to the canonical admitted-run facts and decision FIFO. */
function consumeChannelRunAdmission(evidence) {
	const admission = consumeChannelAdmissionEvidence(evidence);
	return Object.freeze({
		ingressState: admission.ingressState,
		facts: Object.freeze({
			invoker: admission.invoker,
			...admission.assuranceRef ? { assurance: [{
				kind: "channel-admission",
				rawEvidenceRef: admission.assuranceRef,
				strength: "boundary-verified"
			}] } : {}
		}),
		onAdmitted: (context) => {
			const token = context.executionIdentityToken;
			if (token && admission.decisionCoverage && admission.identifierAuthentication) recordChannelAdmissionDecision(evidence, {
				contextId: token.contextId,
				executionId: token.executionId,
				runId: token.runId,
				occurredAt: token.createdAt,
				coverageState: admission.decisionCoverage,
				identifierAuthentication: admission.identifierAuthentication
			});
		}
	});
}
/** Defer evidence consumption until the selected runtime actually admits the run. */
function prepareChannelRunAdmission(params) {
	const operationalRunInstance = createOperationalRunInstanceRef(params.runId);
	let prepared;
	let closed = false;
	const assertSourceCurrent = () => {
		if (prepared) {
			prepared.assertSourceCurrent();
			return;
		}
		params.assertSourceCurrent?.();
		params.operatorAuthority?.assertCurrent();
	};
	return Object.freeze({
		operationalRunInstance,
		assertSourceCurrent,
		readOperatorAuthority: () => {
			if (closed && params.operatorAuthority) throw new Error("prepared operator authority is no longer active");
			assertSourceCurrent();
			return params.operatorAuthority;
		},
		admit: (runtimeKind, runtimeInstanceId) => {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("prepared execution context is already closed"));
			if (!prepared) {
				const channelAdmission = consumeChannelRunAdmission(params.evidence);
				prepared = prepareAgentRunAdmission({
					cfg: params.cfg,
					assertSourceCurrent: params.assertSourceCurrent,
					operationalRunInstance,
					operatorAuthority: params.operatorAuthority,
					facts: {
						runId: params.runId,
						agentId: params.agentId,
						ingress: {
							kind: params.ingressKind,
							boundary: params.boundary,
							state: channelAdmission.ingressState
						},
						...channelAdmission.facts
					},
					onAdmitted: (context) => {
						channelAdmission.onAdmitted(context);
						params.onAdmitted?.(context);
					}
				});
			}
			return prepared.admit(runtimeKind, runtimeInstanceId);
		},
		close: () => {
			closed = true;
			prepared?.close();
		}
	});
}
//#endregion
export { prepareChannelRunAdmission as n, consumeChannelRunAdmission as t };
