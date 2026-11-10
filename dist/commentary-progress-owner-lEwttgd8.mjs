import { f as normalizeStringifiedEntries, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { b as hasRestartRecoveryTerminalRun, m as buildRestartRecoveryClaimCleanupPatch, y as hasRestartRecoverySourceClaim } from "./store-maintenance-BqMt1Twc.mjs";
import { n as isTerminalSessionStatus } from "./types-BGDhC4_W.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { s as patchSessionEntryTarget } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-CP5xMNf9.mjs";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.mjs";
//#region src/auto-reply/reply/reply-admission-ticket.ts
const REPLY_ADMISSION_TICKET = Symbol("openclaw.replyAdmissionTicket");
const replyAdmissionTickets = createKeyedFifoLeaseRegistry(Symbol.for("openclaw.replyAdmissionTickets"));
/** Briefly orders queue publication across a command's source and target sessions. */
function reserveReplyAdmissionTicket(sessionKeys) {
	return replyAdmissionTickets.reserve(normalizeStringifiedEntries(sessionKeys));
}
//#endregion
//#region src/auto-reply/reply/restart-recovery-source.ts
/** Provider redelivery guard shared by ingress and the agent admission boundary. */
function isDuplicateRestartRecoverySource(entry, sourceTurnId) {
	const normalizedSourceTurnId = normalizeOptionalString(sourceTurnId);
	return Boolean(normalizedSourceTurnId && (hasRestartRecoveryTerminalRun(entry ?? void 0, normalizedSourceTurnId) || hasRestartRecoverySourceClaim(entry ?? void 0, normalizedSourceTurnId)));
}
async function retireTerminalRestartRecoverySourceClaim(params) {
	let didRetire = false;
	const retired = await patchSessionEntryTarget(params.target, (current) => {
		if (current.sessionId !== params.sessionId || !isTerminalSessionStatus(current.status) || current.status === "interrupted" || current.abortedLastRun === true || current.restartRecoveryDeliveryReceiptState === "terminal-pending" || !hasRestartRecoverySourceClaim(current, params.sourceTurnId)) return null;
		didRetire = true;
		return {
			...buildRestartRecoveryClaimCleanupPatch({
				entry: current,
				recordTerminalSource: true,
				terminalSourceRunId: params.sourceTurnId
			}),
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true,
		workerGuard: { source: params.assertCurrent }
	});
	return didRetire ? retired ?? void 0 : void 0;
}
//#endregion
//#region src/auto-reply/reply/stalled-turn-recovery.ts
/** Last-resort feedback once no continuation can answer a stalled turn. */
const STALLED_TURN_NOTICE_TEXT = "⚠️ This turn was interrupted because it stopped making progress. Please try again.";
const STALLED_TURN_GUIDANCE = "Your previous turn stopped making progress and was stopped before you replied, so the user's request from that turn is still unanswered. Answer it now, together with any newer message, from what the transcript already contains. Keep further tool use to a minimum, do not repeat actions that already ran, and briefly say what you could not verify.";
/** A stale watchdog expired this operation before it delivered output: the user saw nothing. */
function isReplyOperationStalledBeforeOutput(operation) {
	return operation?.result?.kind === "failed" && !operation.sourceReplyDelivered && operation.result.code === "run_stalled" && (operation.staleExpiryReason === "no_activity" || operation.staleExpiryReason === "stuck_recovery");
}
/** Builds the one recovery run that answers a stalled turn over its persisted transcript. */
function buildStalledTurnRecoveryRun(base, guidance) {
	const source = base.queuedFollowupReplyDisposition;
	return {
		...base,
		prompt: formatSystemTurnPrompt(guidance ?? "Your previous turn stopped making progress and was stopped before you replied, so the user's request from that turn is still unanswered. Answer it now, together with any newer message, from what the transcript already contains. Keep further tool use to a minimum, do not repeat actions that already ran, and briefly say what you could not verify."),
		summaryLine: "stalled-turn-recovery",
		stalledTurnRecovery: true,
		disableCollectBatching: true,
		enqueuedAt: Date.now(),
		transcriptPrompt: void 0,
		userTurnTranscriptRecorder: void 0,
		sourceTurnId: void 0,
		currentInboundContext: void 0,
		images: void 0,
		imageOrder: void 0,
		media: void 0,
		abortSignal: void 0,
		turnAdoptionLifecycle: void 0,
		replyOperationRunStates: void 0,
		onQueueDisposition: void 0,
		queuedFollowupReplyDisposition: source?.kind === "deliver" ? {
			kind: "deliver",
			deliver: source.deliver.createSourceRetry?.() ?? source.deliver
		} : source,
		run: {
			...base.run,
			inputProvenance: {
				kind: "internal_system",
				sourceTool: "stalled-turn-recovery"
			},
			suppressNextUserMessagePersistence: true,
			skillLibraryAuthoring: base.run.skillLibraryAuthoring && {
				target: "personal",
				defaultTarget: "personal",
				multipleProfiles: base.run.skillLibraryAuthoring.multipleProfiles,
				bind: () => {},
				invoke: async () => {
					throw new SkillLibraryError("AUTHORITY_EXPIRED", "Skill authoring is unavailable while recovering an interrupted turn. Send a fresh message requesting the change.");
				}
			}
		}
	};
}
//#endregion
//#region src/auto-reply/reply/commentary-progress-owner.ts
/** Freezes and registers one commentary owner for the current agent turn. */
async function resolveTurnCommentaryProgressOwner(params) {
	const shouldDeliverCommentaryPayloads = params.commentaryPayloadsEnabled ? params.options?.shouldDeliverCommentaryPayloads : void 0;
	if (params.options?.onVerboseProgressVisibilityAsync) {
		const frozen = shouldDeliverCommentaryPayloads ? await params.resolveVerboseProgressVisibilityAsync() : void 0;
		await params.options.onVerboseProgressVisibilityAsync(frozen === void 0 ? params.resolveVerboseProgressVisibilityAsync : async () => frozen);
	} else if (params.options?.onVerboseProgressVisibility) {
		warnPluginSdkDeprecation({
			family: "reply-visibility",
			method: "onVerboseProgressVisibility",
			replacement: "onVerboseProgressVisibilityAsync with awaited visibility predicates"
		});
		const frozen = shouldDeliverCommentaryPayloads ? params.resolveVerboseProgressVisibility() : void 0;
		params.options.onVerboseProgressVisibility(frozen === void 0 ? params.resolveVerboseProgressVisibility : () => frozen);
	}
	const commentaryPayloadsEnabled = params.commentaryPayloadsEnabled && (shouldDeliverCommentaryPayloads?.() ?? true);
	return {
		commentaryPayloadsEnabled,
		draftOwnsCommentaryProgress: params.commentaryPayloadsEnabled && shouldDeliverCommentaryPayloads !== void 0 && !commentaryPayloadsEnabled
	};
}
//#endregion
export { isReplyOperationStalledBeforeOutput as a, REPLY_ADMISSION_TICKET as c, buildStalledTurnRecoveryRun as i, reserveReplyAdmissionTicket as l, STALLED_TURN_GUIDANCE as n, isDuplicateRestartRecoverySource as o, STALLED_TURN_NOTICE_TEXT as r, retireTerminalRestartRecoverySourceClaim as s, resolveTurnCommentaryProgressOwner as t };
