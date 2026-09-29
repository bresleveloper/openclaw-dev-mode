import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Un as validatePluginApprovalRequestParams, Wn as validatePluginApprovalResolveParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { i as sanitizeExecApprovalWarningText, n as sanitizeExecApprovalDisplayText, t as exceedsApprovalTextLimit } from "./exec-approval-text-sanitize-B7wKpPNH.mjs";
import { t as sanitizeApprovalScope } from "./approval-scope-CfvRogZm.mjs";
import { f as resolvePluginApprovalTimeoutMs, p as truncatePluginApprovalDetail } from "./plugin-approvals-DV5u4TwS.mjs";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-QZU5yCd0.mjs";
import { n as takeMcpToolApprovalBinding } from "./mcp-tool-approval-binding-z65X_L_Y.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { r as listVisiblePendingApprovalRequests } from "./approval-record-lookup-CABTquV3.mjs";
import { a as handleApprovalResolve, c as registerPendingApprovalRecord, l as resolveApprovalDecisionParams, n as bindApprovalReviewerDeviceIds, o as handleApprovalWaitDecision, t as bindApprovalRequesterMetadata } from "./approval-shared-Dq8WeEIr.mjs";
import { t as handlePendingPluginApprovalRequest } from "./plugin-approval-request-delivery-B_YPXKg6.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/plugin-approval.ts
/** Create plugin approval handlers backed by the shared approval manager. */
function createPluginApprovalHandlers(manager, opts) {
	return {
		"plugin.approval.list": async ({ respond, client, context }) => {
			respond(true, await listVisiblePendingApprovalRequests({
				manager,
				client,
				approvalKind: "plugin",
				...client?.authenticatedUserProfile ? { getCfg: context.getRuntimeConfig } : {}
			}), void 0);
		},
		"plugin.approval.request": async ({ params, client, respond, context }) => {
			if (!assertValidParams(params, validatePluginApprovalRequestParams, "plugin.approval.request", respond)) return;
			const p = params;
			const twoPhase = p.twoPhase === true;
			const timeoutMs = resolvePluginApprovalTimeoutMs(p.timeoutMs);
			const trustedAgentRuntime = client?.internal?.agentRuntimeIdentity;
			if (trustedAgentRuntime && context.validateAgentRuntimeApprovalAuthority?.(trustedAgentRuntime) !== true) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime approval authority is no longer active"));
				return;
			}
			if (trustedAgentRuntime && !trustedAgentRuntime.approvalOwnerPluginId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "signed plugin approval owner is unavailable"));
				return;
			}
			const normalizeTrimmedString = (value) => normalizeOptionalString(value) || null;
			const rawSessionKey = normalizeOptionalString(trustedAgentRuntime?.sessionKey ?? p.sessionKey);
			const sessionOwner = rawSessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), rawSessionKey, normalizeOptionalString(trustedAgentRuntime?.agentId ?? p.agentId)) : void 0;
			if (sessionOwner && !sessionOwner.ok) {
				respond(false, void 0, sessionOwner.error);
				return;
			}
			const sessionKey = rawSessionKey && sessionOwner?.ok ? resolveStoredSessionKeyForAgentStore({
				cfg: context.getRuntimeConfig(),
				agentId: sessionOwner.agentId,
				sessionKey: rawSessionKey
			}) : null;
			const sanitizedTitle = sanitizeExecApprovalDisplayText(p.title);
			const sanitizedDescription = sanitizeExecApprovalWarningText(p.description);
			if (exceedsApprovalTextLimit(sanitizedTitle, 80) || exceedsApprovalTextLimit(sanitizedDescription, 512)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval title or description exceeds the display limit after sanitization"));
				return;
			}
			const rawDetail = normalizeTrimmedString(p.detail);
			const sanitizeMeta = (value) => normalizeTrimmedString(value) === null ? null : sanitizeExecApprovalDisplayText(normalizeTrimmedString(value));
			const request = {
				pluginId: trustedAgentRuntime?.approvalOwnerPluginId ?? sanitizeMeta(p.pluginId),
				title: sanitizedTitle,
				description: sanitizedDescription,
				scope: p.scope ? sanitizeApprovalScope(p.scope) : null,
				detail: rawDetail === null ? null : truncatePluginApprovalDetail(sanitizeExecApprovalWarningText(rawDetail)),
				severity: p.severity ?? null,
				toolName: sanitizeMeta(p.toolName),
				toolCallId: p.toolCallId ?? null,
				...trustedAgentRuntime && p.mcpTool ? { mcpTool: { ...p.mcpTool } } : {},
				...Array.isArray(p.allowedDecisions) ? { allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions({ allowedDecisions: p.allowedDecisions }) } : {},
				agentId: trustedAgentRuntime?.agentId ?? (sessionOwner?.ok ? sessionOwner.agentId : sanitizeMeta(p.agentId)),
				sessionKey,
				runId: trustedAgentRuntime?.operationalRunInstance.runId ?? null,
				turnSourceChannel: trustedAgentRuntime ? normalizeTrimmedString(trustedAgentRuntime.turnSourceChannel) : normalizeTrimmedString(p.turnSourceChannel),
				turnSourceTo: trustedAgentRuntime ? normalizeTrimmedString(trustedAgentRuntime.turnSourceTo) : normalizeTrimmedString(p.turnSourceTo),
				turnSourceAccountId: trustedAgentRuntime ? normalizeTrimmedString(trustedAgentRuntime.turnSourceAccountId) : normalizeTrimmedString(p.turnSourceAccountId),
				turnSourceThreadId: trustedAgentRuntime ? trustedAgentRuntime.turnSourceThreadId ?? null : p.turnSourceThreadId ?? null
			};
			const record = manager.create(request, timeoutMs, `plugin:${randomUUID()}`);
			if (trustedAgentRuntime) {
				record.agentRuntimeDelegatedAuthority = trustedAgentRuntime.delegatedAuthority;
				if (request.mcpTool && request.toolCallId) record.mcpToolApprovalActive = takeMcpToolApprovalBinding({
					authority: trustedAgentRuntime.delegatedAuthority,
					agentId: trustedAgentRuntime.agentId,
					toolCallId: request.toolCallId,
					...request.mcpTool
				});
			}
			if (trustedAgentRuntime?.executionIdentity && request.runId === trustedAgentRuntime.executionIdentity.runId) record.executionIdentityToken = trustedAgentRuntime.executionIdentity;
			bindApprovalRequesterMetadata({
				record,
				client
			});
			if (client?.internal?.approvalRuntime === true) bindApprovalReviewerDeviceIds({
				record,
				deviceIds: p.approvalReviewerDeviceIds
			});
			if (!await registerPendingApprovalRecord({
				manager,
				record,
				timeoutMs,
				respond,
				context
			})) return;
			await handlePendingPluginApprovalRequest({
				manager,
				record,
				respond,
				context,
				clientConnId: client?.connId,
				twoPhase,
				forwardRequest: opts?.forwarder?.handlePluginApprovalRequested?.bind(opts.forwarder),
				getIosPushDelivery: () => opts?.iosPushDelivery,
				source: "rpc"
			});
		},
		"plugin.approval.waitDecision": async ({ params, respond, client, context }) => {
			await handleApprovalWaitDecision({
				manager,
				inputId: params.id,
				client,
				...client?.authenticatedUserProfile ? { getCfg: context.getRuntimeConfig } : {},
				respond
			});
		},
		"plugin.approval.resolve": async ({ params, respond, client, context }) => {
			const resolveParams = resolveApprovalDecisionParams({
				rawParams: params,
				validate: validatePluginApprovalResolveParams,
				methodName: "plugin.approval.resolve",
				respond
			});
			if (!resolveParams) return;
			const { inputId, decision, reviewer } = resolveParams;
			await handleApprovalResolve({
				approvalKind: "plugin",
				manager,
				inputId,
				decision,
				respond,
				context,
				client,
				reviewer,
				exposeAmbiguousPrefixError: false,
				validateDecision: (snapshot) => resolveCanonicalPluginApprovalRequestAllowedDecisions(snapshot.request).includes(decision) ? null : {
					message: `${decision} is unavailable for this plugin approval`,
					details: { allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(snapshot.request) }
				},
				forwardResolved: (resolvedEvent) => opts?.forwarder?.handlePluginApprovalResolved?.(resolvedEvent),
				forwardResolvedErrorLabel: "plugin approvals: forward resolve failed",
				extraResolvedHandlers: opts?.iosPushDelivery?.handleResolved ? [{
					run: (resolvedEvent) => opts.iosPushDelivery.handleResolved(resolvedEvent),
					errorLabel: "plugin approvals: iOS push resolve failed"
				}] : void 0
			});
		}
	};
}
//#endregion
export { createPluginApprovalHandlers };
