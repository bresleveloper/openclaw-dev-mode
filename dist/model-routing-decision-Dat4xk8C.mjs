import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { h as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-QJnFIxUZ.mjs";
import { i as recordExecutionDecisionWork } from "./execution-decision-work-CnVx5C7h.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/model-routing-decision.ts
/** Receipt-grade facts for one model route that reached exact run admission. */
function boundedModelRef(provider, model) {
	return truncateUtf16Safe(redactSensitiveText(`${provider}/${model}`, { mode: "tools" }), 160);
}
/** Queue only selected routes that already own an admitted execution token. */
function recordAdmittedModelRoutingDecision(params) {
	const admittedRunContext = params.admittedRunContext;
	const token = admittedRunContext?.executionIdentityToken;
	if (!token) return false;
	const receiptId = `model-routing:${randomUUID()}`;
	const requestedRef = boundedModelRef(params.requestedProvider, params.requestedModel);
	const selectedRef = boundedModelRef(params.selectedProvider, params.selectedModel);
	const credentialProfileId = params.credentialProfileId?.trim();
	const hasCredentialOwner = Boolean(credentialProfileId);
	const reasonCode = params.fallbackReason ?? (params.fallbackSelected ? "model_route_selected_after_fallback" : "model_route_selected");
	const assertActive = resolveAdmittedRunActiveAssertion(admittedRunContext, params.abortSignal);
	if (!assertActive) throw new Error("admitted run authority is no longer active");
	assertActive();
	return recordExecutionDecisionWork({
		workVersion: 1,
		token,
		receipt: {
			schemaVersion: 1,
			receiptId,
			occurredAt: params.occurredAt ?? Date.now(),
			action: {
				family: "model-routing",
				operation: `${params.selectionMode}-selection`,
				summary: `Requested ${requestedRef}; selected ${selectedRef}.`
			},
			decision: {
				outcome: "allowed",
				reasonCode
			},
			enforcement: {
				coverageState: hasCredentialOwner ? "attribution-only" : "unknown",
				policyRefs: [],
				grantRefs: [],
				contextFieldsUsed: [
					"contextId",
					"executionId",
					"runId"
				]
			},
			source: {
				owner: "model-routing",
				recordRef: receiptId,
				decisionBoundary: "agent-runtime.post-admission"
			},
			missingEvidence: hasCredentialOwner ? [] : ["credential_profile_owner"],
			remediation: []
		},
		refs: {
			...credentialProfileId ? { resource: {
				namespace: "credential-profile",
				value: credentialProfileId
			} } : {},
			target: {
				namespace: "model-route",
				value: JSON.stringify([params.selectedProvider, params.selectedModel])
			}
		}
	});
}
//#endregion
export { recordAdmittedModelRoutingDecision as t };
