import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { t as acquireSimpleCompletionModelForAgent } from "./simple-completion-runtime-2gdDKllV.mjs";
import { s as extractEmbeddedAssistantText } from "./embedded-agent-utils-Bl20r92X.mjs";
import { t as completeWithPreparedSimpleCompletionModel } from "./simple-completion-execution-6SeWwCe4.mjs";
import { r as classifySystemAgentApprovalText } from "./operator-approval-BjhYZ1TF.mjs";
import { a as resolveSystemAgentVerifiedInferenceRoute } from "./verified-inference-DGxbE23j.mjs";
//#region src/system-agent/approval-intent.ts
const APPROVAL_INTENT_TIMEOUT_MS = 1e4;
const APPROVAL_INTENT_MAX_TOKENS = 8;
const APPROVAL_INTENT_SYSTEM_PROMPT = [
	"You classify one chat message from a user who was just asked to approve a pending configuration change.",
	"Reply with exactly one word:",
	"approve — the message clearly consents to applying the pending change now.",
	"decline — the message clearly rejects or postpones the pending change.",
	"other — anything else: questions, new requests, partial or conditional agreement, or unclear intent.",
	"Only classify consent for the pending change itself. A message asking to change the proposal is not approval."
].join("\n");
/**
* Judge whether a message approves the pending proposal. Closed-list answers
* short-circuit so a literal "yes" cannot be reinterpreted by the conversation
* model; ambiguous messages go to a separate configured completion call.
* CLI-harness routes do not spawn a second harness for that check, so their
* ambiguous replies stay "other" and the conversation asks for a clear yes.
*/
async function classifySystemAgentApprovalIntent(params) {
	const textIntent = classifySystemAgentApprovalText(params.message);
	if (textIntent !== "other") return textIntent;
	try {
		const route = await resolveSystemAgentVerifiedInferenceRoute(params.verifiedInference);
		if (!route || route.runner !== "embedded" || route.agentHarnessRuntimeOverride !== "openclaw") return "other";
		const modelRef = route.authProfileId ? `${route.modelLabel}@${route.authProfileId}` : route.modelLabel;
		const callerResult = createDeferredCore();
		captureAsyncWorkTracker()(async () => {
			const prepared = await acquireSimpleCompletionModelForAgent({
				cfg: route.runConfig,
				agentId: route.agentId,
				agentDir: route.agentDir,
				modelRef,
				...route.authProfileId ? { preferredProfile: route.authProfileId } : {},
				allowMissingApiKeyModes: ["aws-sdk"],
				bindAuthOwner: true
			});
			if ("error" in prepared) {
				callerResult.resolve("other");
				return;
			}
			const work = new AsyncWorkScope();
			try {
				callerResult.resolve(await work.track(async () => {
					if ((prepared.selection.runtimeProvider ?? prepared.selection.provider) !== route.provider || prepared.selection.modelId !== route.model || prepared.selection.agentDir !== route.agentDir || prepared.selection.profileId !== route.authProfileId || prepared.auth.profileId !== route.authProfileId || !params.verifiedInference.auth.authFingerprint || prepared.sourceAuthFingerprint !== params.verifiedInference.auth.authFingerprint) return "other";
					const controller = new AbortController();
					const timer = setTimeout(() => controller.abort(), APPROVAL_INTENT_TIMEOUT_MS);
					try {
						const response = await completeWithPreparedSimpleCompletionModel({
							model: prepared.model,
							auth: prepared.auth,
							cfg: route.runConfig,
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
						});
						if (!await resolveSystemAgentVerifiedInferenceRoute(params.verifiedInference)) return "other";
						const verdict = extractEmbeddedAssistantText(response)?.trim().toLowerCase().split(/\s+/)[0];
						if (verdict === "approve" || verdict === "decline") return verdict;
						return "other";
					} finally {
						clearTimeout(timer);
					}
				}));
			} catch {
				callerResult.resolve("other");
			} finally {
				await work.drain();
				await prepared[Symbol.asyncDispose]();
			}
		}).catch(() => callerResult.resolve("other"));
		return await callerResult.promise;
	} catch {
		return "other";
	}
}
//#endregion
export { classifySystemAgentApprovalIntent };
