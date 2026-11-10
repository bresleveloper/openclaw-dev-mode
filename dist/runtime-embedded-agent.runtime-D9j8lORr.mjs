import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { c as createOperationalRunInstanceRef, f as prepareAgentRunAdmission, u as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { c as getReplyPayloadMetadata, f as isFastModeAutoProgressPayload, y as isReplyPayloadTerminalContent } from "./reply-payload-BLX_BF2U.mjs";
import "./config-B3oiWDlr.mjs";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-DfuJOyLj.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-XnYlwTNV.mjs";
import { a as isHostMemoryAudience, i as delegateMemoryAudience } from "./memory-audience-BLl7Ac2w.mjs";
import { a as drainAgentRunTerminalWrites } from "./agent-run-terminal-writes-D1C5plfs.mjs";
import { t as runEmbeddedAgent } from "./embedded-agent-B8S-WtrO.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/runtime/runtime-embedded-agent.runtime.ts
const runPluginEmbeddedAgent = async (params) => {
	const pluginId = getPluginRuntimeGatewayRequestScope()?.pluginId;
	if (!pluginId) throw new Error("Plugin embedded-agent execution requires an active plugin runtime scope.");
	if ("admittedRunContext" in params || "preparedRunAdmission" in params || "compactionCountOwner" in params || "onCompactionAccounting" in params || "onContextAccountingEvent" in params || "onDeferredLifecycleOwner" in params || "onDeferredLifecycleAbort" in params || "onRetryWait" in params) throw new Error("Plugin embedded-agent execution cannot supply host run authority.");
	if (params.memoryAudience && !isHostMemoryAudience(params.memoryAudience)) throw new Error("Plugin embedded-agent memory audience must be host-minted.");
	params.abortSignal?.throwIfAborted();
	const config = params.config ?? readRuntimeConfig();
	const delegated = params.memoryAudience ? await delegateMemoryAudience(params.memoryAudience, {
		sessionKey: params.sessionKey?.trim() ?? params.sessionTarget?.sessionKey ?? "",
		storePath: params.sessionTarget?.storePath ?? resolveSessionStorePathCore(config.session?.store, { agentId: params.memoryAudience.agentId }),
		detached: params.sessionPersistence === "detached",
		assertCallerCurrent: () => params.abortSignal?.throwIfAborted()
	}) : void 0;
	const decisionOccurrenceId = randomUUID();
	let admittedRunContext;
	let preparedRunAdmission;
	try {
		preparedRunAdmission = prepareAgentRunAdmission({
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
	} catch (error) {
		delegated?.release();
		throw error;
	}
	let closed = false;
	let legacyReplyCustodyIndex = -1;
	let minimumReplyMessageIndex = 0;
	const close = () => {
		if (!closed) {
			closed = true;
			legacyReplyCustodyIndex = -1;
			preparedRunAdmission.close();
			delegated?.release();
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
			memoryAudience: delegated?.audience,
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
		try {
			await drainAgentRunTerminalWrites(preparedRunAdmission.operationalRunInstance);
		} finally {
			params.abortSignal?.removeEventListener("abort", close);
			close();
		}
	}
};
//#endregion
export { runPluginEmbeddedAgent };
