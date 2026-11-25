import { a as resolveMatrixAccountConfig } from "./account-config-CVM2a28p.mjs";
import { a as resolveMatrixInboundRouteAsync, o as resolveMatrixThreadRouting } from "./channel-DkjJIQBk.mjs";
import { c as extractMatrixReactionAnnotation } from "./send-currentness-D1x6YP9O.mjs";
import { p as resolveMatrixThreadRootId } from "./direct-management-D59C1WO-.mjs";
import { i as resolveMatrixApprovalReactionTargetWithPersistence, o as unregisterMatrixApprovalReactionTargetsForApproval } from "./approval-reactions-Bz_8XB01.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { isApprovalNotFoundError } from "openclaw/plugin-sdk/error-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { getSessionBindingService } from "openclaw/plugin-sdk/session-binding-runtime";
// extensions/matrix/src/matrix/monitor/reaction-events.ts
const loadApprovalReactionAuth = createLazyRuntimeModule(() => import("./channel-DkjJIQBk.mjs").then((n) => n.s));
const loadExecApprovalResolver = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/approval-gateway-runtime"));
const loadMatrixSend = createLazyRuntimeModule(() => import("./send-COg4UAcR.mjs").then((n) => n.s));
function buildMatrixApprovalTerminalText(result) {
	const approval = result.approval;
	const terminalLabel = approval.status === "allowed" ? approval.decision === "allow-always" ? "Allowed always" : "Allowed once" : approval.status === "denied" ? "Denied" : approval.status === "expired" ? "Expired" : "Cancelled";
	return `${result.applied ? "Resolved" : "Already resolved"}: ${terminalLabel}\n\nID: ${approval.id}`;
}
async function handleInboundMatrixReaction(params) {
	const reaction = extractMatrixReactionAnnotation(params.event.content);
	if (!reaction?.eventId) return;
	if (params.senderId === params.selfUserId) return;
	const approvalTarget = await resolveMatrixApprovalReactionTargetWithPersistence({
		accountId: params.accountId,
		roomId: params.roomId,
		eventId: reaction.eventId,
		reactionKey: reaction.key
	});
	const { cfg, accountId, senderId, client, roomId, logVerboseMessage } = params;
	const targetEventId = reaction.eventId;
	if (await (async () => {
		if (!approvalTarget) return false;
		const { isMatrixApprovalReactionAuthorizedSender } = await loadApprovalReactionAuth();
		if (!isMatrixApprovalReactionAuthorizedSender({
			cfg,
			accountId,
			senderId,
			approvalKind: approvalTarget.approvalKind
		})) return false;
		const { resolveApprovalOverGateway } = await loadExecApprovalResolver();
		try {
			const result = await resolveApprovalOverGateway({
				cfg,
				approvalId: approvalTarget.approvalId,
				approvalKind: approvalTarget.approvalKind,
				decision: approvalTarget.decision,
				channel: "matrix",
				accountId,
				senderId
			});
			const retiredAccountId = normalizeAccountId(accountId);
			const registeredTargets = await unregisterMatrixApprovalReactionTargetsForApproval({
				accountId: retiredAccountId,
				approvalId: approvalTarget.approvalId,
				approvalKind: approvalTarget.approvalKind
			});
			const targets = /* @__PURE__ */ new Map();
			for (const target of [...registeredTargets, {
				accountId: retiredAccountId,
				roomId,
				eventId: targetEventId
			}]) targets.set(JSON.stringify([
				target.accountId,
				target.roomId,
				target.eventId
			]), target);
			const { editMessageMatrix } = await loadMatrixSend();
			const terminalText = buildMatrixApprovalTerminalText(result);
			const failedUpdates = (await Promise.allSettled(Array.from(targets.values(), async (target) => {
				await editMessageMatrix(target.roomId, target.eventId, terminalText, {
					cfg,
					accountId: target.accountId,
					client
				});
			}))).filter((update) => update.status === "rejected").length;
			if (failedUpdates > 0) logVerboseMessage(`matrix: failed to terminalize ${failedUpdates} approval prompt(s) id=${approvalTarget.approvalId}`);
			const canonicalDecision = "decision" in result.approval ? result.approval.decision : "none";
			logVerboseMessage(`matrix: approval reaction resolved id=${approvalTarget.approvalId} sender=${senderId} applied=${result.applied} status=${result.approval.status} decision=${canonicalDecision}`);
			return true;
		} catch (err) {
			if (isApprovalNotFoundError(err)) {
				await unregisterMatrixApprovalReactionTargetsForApproval({
					accountId,
					approvalId: approvalTarget.approvalId,
					approvalKind: approvalTarget.approvalKind
				});
				logVerboseMessage(`matrix: approval reaction ignored for expired approval id=${approvalTarget.approvalId} sender=${senderId}`);
				return true;
			}
			logVerboseMessage(`matrix: approval reaction failed id=${approvalTarget.approvalId} sender=${senderId}: ${String(err)}`);
			throw err;
		}
	})()) return;
	const matrixConfig = params.cfg.channels?.matrix;
	const notificationMode = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	}).reactionNotifications ?? matrixConfig?.reactionNotifications ?? "own";
	if (notificationMode === "off") return;
	const targetEvent = await params.client.getEvent(params.roomId, reaction.eventId).catch((err) => {
		params.logVerboseMessage(`matrix: failed resolving reaction target room=${params.roomId} id=${reaction.eventId}: ${String(err)}`);
		return null;
	});
	const targetSender = targetEvent && typeof targetEvent.sender === "string" ? targetEvent.sender.trim() : "";
	if (!targetSender) return;
	if (notificationMode === "own" && targetSender !== params.selfUserId) return;
	const targetContent = targetEvent && targetEvent.content && typeof targetEvent.content === "object" ? targetEvent.content : void 0;
	const threadRootId = targetContent ? resolveMatrixThreadRootId(targetContent) : void 0;
	const accountConfig = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const thread = resolveMatrixThreadRouting({
		isDirectMessage: params.isDirectMessage,
		threadReplies: accountConfig.threadReplies ?? "inbound",
		dmThreadReplies: accountConfig.dm?.threadReplies,
		messageId: reaction.eventId,
		threadRootId
	});
	const { route, runtimeBindingId } = await resolveMatrixInboundRouteAsync({
		cfg: params.cfg,
		accountId: params.accountId,
		roomId: params.roomId,
		senderId: params.senderId,
		isDirectMessage: params.isDirectMessage,
		dmSessionScope: accountConfig.dm?.sessionScope ?? "per-user",
		threadId: thread.threadId,
		resolveAgentRoute: params.core.channel.routing.resolveAgentRoute
	});
	if (runtimeBindingId) await getSessionBindingService().touchAsync(runtimeBindingId, params.event.origin_server_ts, {
		channel: "matrix",
		accountId: params.accountId
	});
	const text = `Matrix reaction added: ${reaction.key} by ${params.senderLabel} on msg ${reaction.eventId}`;
	params.core.system.enqueueSystemEvent(text, {
		sessionKey: route.sessionKey,
		agentId: route.agentId,
		contextKey: `matrix:reaction:add:${params.roomId}:${reaction.eventId}:${params.senderId}:${reaction.key}`
	});
	params.logVerboseMessage(`matrix: reaction event enqueued room=${params.roomId} target=${reaction.eventId} sender=${params.senderId} emoji=${reaction.key}`);
}
export { handleInboundMatrixReaction };
