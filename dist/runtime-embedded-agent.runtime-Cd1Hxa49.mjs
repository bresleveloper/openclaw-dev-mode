import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-DdRNB2jf.mjs";
import { _ as isReplyPayloadTerminalContent, d as isFastModeAutoProgressPayload, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { a as createOperationalRunInstanceRef, c as prepareAgentRunAdmission, o as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import { t as runEmbeddedAgent } from "./embedded-agent-mYH3aiyf.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/runtime/runtime-embedded-agent.runtime.ts
/** Lazy runtime adapter for plugin-owned embedded-agent execution. */
const runPluginEmbeddedAgent = async (params) => {
	const pluginId = getPluginRuntimeGatewayRequestScope()?.pluginId;
	if (!pluginId) throw new Error("Plugin embedded-agent execution requires an active plugin runtime scope.");
	if ("admittedRunContext" in params || "preparedRunAdmission" in params || "compactionCountOwner" in params || "onCompactionAccounting" in params || "onContextAccountingEvent" in params || "onDeferredLifecycleOwner" in params || "onDeferredLifecycleAbort" in params || "onRetryWait" in params) throw new Error("Plugin embedded-agent execution cannot supply host run authority.");
	params.abortSignal?.throwIfAborted();
	const decisionOccurrenceId = randomUUID();
	let admittedRunContext;
	const config = params.config ?? getRuntimeConfig();
	const preparedRunAdmission = prepareAgentRunAdmission({
		cfg: config,
		operationalRunInstance: createOperationalRunInstanceRef(params.runId),
		facts: {
			runId: params.runId,
			agentId: params.sessionTarget?.agentId ?? params.agentId ?? "main",
			ingress: {
				kind: "plugin",
				boundary: "plugin-runtime",
				rawSourceRef: pluginId,
				state: "present"
			}
		},
		onAdmitted: (context) => {
			admittedRunContext = context;
			const token = context.executionIdentityToken;
			recordRuntimeActionDecision({
				token,
				family: "plugin",
				operation: "run",
				outcome: "allowed",
				coverageState: "enforced",
				reasonCode: "plugin_runtime_owner_admitted",
				owner: "plugin-runtime",
				decisionBoundary: "plugin.runtime.run-embedded-agent",
				policyRefs: ["plugin:registered-owner", "run:admission"],
				summary: "The registered plugin owner passed exact run admission.",
				remediation: [],
				discriminator: JSON.stringify([
					pluginId,
					params.runId,
					decisionOccurrenceId,
					"admission"
				])
			});
		}
	});
	let closed = false;
	let legacyReplyCustodyIndex = -1;
	let minimumReplyMessageIndex = 0;
	const close = () => {
		if (!closed) {
			closed = true;
			legacyReplyCustodyIndex = -1;
			preparedRunAdmission.close();
		}
	};
	params.abortSignal?.addEventListener("abort", close, { once: true });
	try {
		params.abortSignal?.throwIfAborted();
		const { githubPublicationAvailable: _, ...runParams } = params;
		const onBlockReply = runParams.onBlockReply;
		if (onBlockReply && !runParams.resolveReplyDelivery) {
			runParams.onBlockReply = async (payload, context) => {
				const messageIndex = context?.assistantMessageIndex ?? getReplyPayloadMetadata(payload)?.assistantMessageIndex ?? 0;
				const retainsCustody = isReplyPayloadTerminalContent(payload) && !isFastModeAutoProgressPayload(payload) && resolveSendableOutboundReplyParts(payload).hasContent;
				if (!closed && retainsCustody && messageIndex >= minimumReplyMessageIndex) legacyReplyCustodyIndex = Math.max(legacyReplyCustodyIndex, messageIndex);
				await onBlockReply(payload, context);
			};
			runParams.resolveReplyDelivery = async (minimumAssistantMessageIndex = 0) => {
				minimumReplyMessageIndex = Math.max(minimumReplyMessageIndex, minimumAssistantMessageIndex);
				return !closed && legacyReplyCustodyIndex >= minimumReplyMessageIndex ? "pending" : "missing";
			};
		}
		const result = await runEmbeddedAgent({
			...runParams,
			config,
			preparedRunAdmission
		});
		if (admittedRunContext && getAdmittedRunDelegatedAuthority(admittedRunContext)) recordRuntimeActionDecision({
			token: admittedRunContext.executionIdentityToken,
			family: "plugin",
			operation: "run",
			outcome: "allowed",
			coverageState: "attribution-only",
			reasonCode: "plugin_runtime_completed",
			owner: "plugin-runtime",
			decisionBoundary: "plugin.runtime.run-embedded-agent",
			summary: "The plugin-owned runtime completed; this is attribution, not authorization.",
			remediation: [],
			discriminator: JSON.stringify([
				pluginId,
				params.runId,
				decisionOccurrenceId,
				"completion"
			])
		});
		return result;
	} finally {
		params.abortSignal?.removeEventListener("abort", close);
		close();
	}
};
//#endregion
export { runPluginEmbeddedAgent };
