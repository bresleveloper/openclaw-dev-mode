import "./agent-scope-B2Pk_xhT.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-BxAUeF6t.js";
import { u as readConfigFileSnapshot } from "./io-DxnOT4sF.js";
import "./config-Cc93keN1.js";
import { r as extractAssistantText } from "./embedded-agent-utils-CjKqpAOm.js";
import { r as prepareSimpleCompletionModelForAgent, t as completeWithPreparedSimpleCompletionModel } from "./simple-completion-runtime-DqsS2UxT.js";
//#region src/crestodian/approval-intent.ts
const APPROVAL_INTENT_TIMEOUT_MS = 1e4;
const APPROVAL_INTENT_MAX_TOKENS = 8;
const APPROVE_RE = /^(?:y|yes|yeah|yep|yup|sure|ok|okay|approve|approved|apply|confirm|confirmed|do it|go ahead|sounds good|yes please|please do)$/i;
const DECLINE_RE = /^(?:n|no|nope|nah|skip|not now|cancel|stop|abort|later|decline|don'?t)\b/i;
function normalizeApprovalText(message) {
	return message.trim().replace(/[.!?,\s]+$/u, "").toLowerCase();
}
/** Closed-list classification: exact affirmatives, prefix declines. */
function classifyCrestodianApprovalText(message) {
	const normalized = normalizeApprovalText(message);
	if (!normalized) return "other";
	if (APPROVE_RE.test(normalized)) return "approve";
	if (DECLINE_RE.test(normalized)) return "decline";
	return "other";
}
const APPROVAL_INTENT_SYSTEM_PROMPT = [
	"You classify one chat message from a user who was just asked to approve a pending configuration change.",
	"Reply with exactly one word:",
	"approve — the message clearly consents to applying the pending change now.",
	"decline — the message clearly rejects or postpones the pending change.",
	"other — anything else: questions, new requests, partial or conditional agreement, or unclear intent.",
	"Only classify consent for the pending change itself. A message asking to change the proposal is not approval."
].join("\n");
/**
* Judge whether a message approves the pending proposal. Deterministic
* closed-list answers short-circuit (a literal "yes" needs no model and must
* keep working on configless machines); ambiguous messages go to the
* configured completion model. CLI-harness-only hosts get no model judgment —
* spawning a full harness per approval check is too slow — so their ambiguous
* replies stay "other" and the conversation asks for a clear yes.
*/
async function classifyCrestodianApprovalIntent(params, deps = {}) {
	const textIntent = classifyCrestodianApprovalText(params.message);
	if (textIntent !== "other") return textIntent;
	try {
		const snapshot = await (deps.readConfigFileSnapshot ?? readConfigFileSnapshot)();
		if (!snapshot.exists || !snapshot.valid) return "other";
		const cfg = snapshot.runtimeConfig ?? snapshot.config;
		const prepared = await (deps.prepareSimpleCompletionModelForAgent ?? prepareSimpleCompletionModelForAgent)({
			cfg,
			agentId: resolveDefaultAgentId(cfg),
			allowMissingApiKeyModes: ["aws-sdk"]
		});
		if ("error" in prepared) return "other";
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), APPROVAL_INTENT_TIMEOUT_MS);
		try {
			const verdict = extractAssistantText(await (deps.completeWithPreparedSimpleCompletionModel ?? completeWithPreparedSimpleCompletionModel)({
				model: prepared.model,
				auth: prepared.auth,
				context: {
					systemPrompt: APPROVAL_INTENT_SYSTEM_PROMPT,
					messages: [{
						role: "user",
						content: [`Pending change: ${params.proposal ?? "a configuration change proposed in this conversation"}`, `User message: ${params.message}`].join("\n"),
						timestamp: Date.now()
					}]
				},
				options: {
					maxTokens: APPROVAL_INTENT_MAX_TOKENS,
					signal: controller.signal
				}
			}))?.trim().toLowerCase().split(/\s+/)[0];
			if (verdict === "approve" || verdict === "decline") return verdict;
			return "other";
		} finally {
			clearTimeout(timer);
		}
	} catch {
		return "other";
	}
}
//#endregion
export { classifyCrestodianApprovalText as n, classifyCrestodianApprovalIntent as t };
