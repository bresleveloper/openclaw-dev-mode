import { a as resolveMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { i as resolveMatrixThreadRouting, r as resolveMatrixInboundRoute } from "./channel-ConuJfxT.mjs";
import { c as extractMatrixReactionAnnotation } from "./send-currentness-BrGXL7b8.mjs";
import { p as resolveMatrixThreadRootId } from "./direct-management-B2Bno2xL.mjs";
import { i as resolveMatrixApprovalReactionTargetWithPersistence, o as unregisterMatrixApprovalReactionTargetsForApproval } from "./approval-reactions-B0hfA6qz.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { isApprovalNotFoundError } from "openclaw/plugin-sdk/error-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { getSessionBindingService } from "openclaw/plugin-sdk/session-binding-runtime";
//#region extensions/matrix/src/matrix/monitor/reaction-events.ts
const loadApprovalReactionAuth = createLazyRuntimeModule(() => import("./approval-reaction-auth-DMVE7VSp.mjs"));
const loadExecApprovalResolver = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/approval-gateway-runtime"));
const loadMatrixSend = createLazyRuntimeModule(() => import("./send-aVdC5NJO.mjs").then((n) => n.s));
function buildMatrixApprovalTerminalText(result) {
	const approval = result.approval;
	const terminalLabel = approval.status === "allowed" ? approval.decision === "allow-always" ? "Allowed always" : "Allowed once" : approval.status === "denied" ? "Denied" : approval.status === "expired" ? "Expired" : "Cancelled";
	return `${result.applied ? "Resolved" : "Already resolved"}: ${terminalLabel}\n\nID: ${approval.id}`;
}
async function retireMatrixApprovalReactionTargets(params) {
	const accountId = normalizeAccountId(params.accountId);
	const registeredTargets = await unregisterMatrixApprovalReactionTargetsForApproval({
		accountId,
		approvalId: params.approvalId,
		approvalKind: params.approvalKind
	});
	const targets = /* @__PURE__ */ new Map();
	for (const target of [...registeredTargets, {
		accountId,
		roomId: params.roomId,
		eventId: params.targetEventId
	}]) targets.set(JSON.stringify([
		target.accountId,
		target.roomId,
		target.eventId
	]), target);
	const { editMessageMatrix } = await loadMatrixSend();
	const terminalText = buildMatrixApprovalTerminalText(params.result);
	const failedUpdates = (await Promise.allSettled(Array.from(targets.values(), async (target) => {
		await editMessageMatrix(target.roomId, target.eventId, terminalText, {
			cfg: params.cfg,
			accountId: target.accountId,
			client: params.client
		});
	}))).filter((update) => update.status === "rejected").length;
	if (failedUpdates > 0) params.logVerboseMessage(`matrix: failed to terminalize ${failedUpdates} approval prompt(s) id=${params.approvalId}`);
}
function resolveMatrixReactionNotificationMode(params) {
	const matrixConfig = params.cfg.channels?.matrix;
	return resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId
	}).reactionNotifications ?? matrixConfig?.reactionNotifications ?? "own";
}
async function maybeResolveMatrixApprovalReaction(params) {
	if (!params.target) return false;
	const { isMatrixApprovalReactionAuthorizedSender } = await loadApprovalReactionAuth();
	if (!isMatrixApprovalReactionAuthorizedSender({
		...params,
		approvalKind: params.target.approvalKind
	})) return false;
	const { resolveApprovalOverGateway } = await loadExecApprovalResolver();
	try {
		const result = await resolveApprovalOverGateway({
			cfg: params.cfg,
			approvalId: params.target.approvalId,
			approvalKind: params.target.approvalKind,
			decision: params.target.decision,
			channel: "matrix",
			accountId: params.accountId,
			senderId: params.senderId
		});
		await retireMatrixApprovalReactionTargets({
			cfg: params.cfg,
			accountId: params.accountId,
			client: params.client,
			roomId: params.roomId,
			targetEventId: params.targetEventId,
			approvalId: params.target.approvalId,
			approvalKind: params.target.approvalKind,
			result,
			logVerboseMessage: params.logVerboseMessage
		});
		const canonicalDecision = "decision" in result.approval ? result.approval.decision : "none";
		params.logVerboseMessage(`matrix: approval reaction resolved id=${params.target.approvalId} sender=${params.senderId} applied=${result.applied} status=${result.approval.status} decision=${canonicalDecision}`);
		return true;
	} catch (err) {
		if (isApprovalNotFoundError(err)) {
			await unregisterMatrixApprovalReactionTargetsForApproval({
				accountId: params.accountId,
				approvalId: params.target.approvalId,
				approvalKind: params.target.approvalKind
			});
			params.logVerboseMessage(`matrix: approval reaction ignored for expired approval id=${params.target.approvalId} sender=${params.senderId}`);
			return true;
		}
		params.logVerboseMessage(`matrix: approval reaction failed id=${params.target.approvalId} sender=${params.senderId}: ${String(err)}`);
		throw err;
	}
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
	if (await maybeResolveMatrixApprovalReaction({
		cfg: params.cfg,
		accountId: params.accountId,
		senderId: params.senderId,
		target: approvalTarget,
		targetEventId: reaction.eventId,
		roomId: params.roomId,
		client: params.client,
		logVerboseMessage: params.logVerboseMessage
	})) return;
	const notificationMode = resolveMatrixReactionNotificationMode({
		cfg: params.cfg,
		accountId: params.accountId
	});
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
	const { route, runtimeBindingId } = resolveMatrixInboundRoute({
		cfg: params.cfg,
		accountId: params.accountId,
		roomId: params.roomId,
		senderId: params.senderId,
		isDirectMessage: params.isDirectMessage,
		dmSessionScope: accountConfig.dm?.sessionScope ?? "per-user",
		threadId: thread.threadId,
		resolveAgentRoute: params.core.channel.routing.resolveAgentRoute
	});
	if (runtimeBindingId) getSessionBindingService().touch(runtimeBindingId, params.event.origin_server_ts, {
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
//#endregion
export { handleInboundMatrixReaction };
