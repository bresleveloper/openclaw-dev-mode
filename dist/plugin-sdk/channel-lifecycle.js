import { F as resolveTimerTimeoutMs } from "../number-coercion-CLj0HTDM.mjs";
import { a as deliverFinalizableLivePreview } from "../live-CJusMVR5.mjs";
import { a as takeMessageIdAfterStop, i as createFinalizableDraftStreamControlsForState, n as createFinalizableDraftLifecycle, o as createDraftStreamLoop, r as createFinalizableDraftStreamControls, t as clearFinalizableDraftMessage } from "../draft-stream-controls-D6z2jkZk.mjs";
import { a as waitUntilAbort, i as runPassiveAccountLifecycle, n as createChannelRunQueue, o as createRunStateMachine, r as keepHttpServerTaskAlive, t as createAccountStatusSink } from "../channel-lifecycle.core-BJ8ntgEB.mjs";
//#region src/channels/draft-preview-finalizer.ts
/**
* Deprecated draft preview finalizer facade.
*
* Forwards legacy draft-preview callers to live preview finalization helpers.
*/
/**
* @deprecated Use `deliverFinalizableLivePreview` from `openclaw/plugin-sdk/channel-outbound`.
*/
async function deliverFinalizableDraftPreview(params) {
	const result = await deliverFinalizableLivePreview({
		kind: params.kind,
		payload: params.payload,
		...params.draft ? { draft: params.draft } : {},
		buildFinalEdit: params.buildFinalEdit,
		editFinal: params.editFinal,
		deliverNormally: params.deliverNormally,
		onPreviewFinalized: async (id) => {
			await params.onPreviewFinalized?.(id);
		},
		...params.onNormalDelivered ? { onNormalDelivered: params.onNormalDelivered } : {},
		...params.logPreviewEditFailure ? { logPreviewEditFailure: params.logPreviewEditFailure } : {}
	});
	return result.kind === "preview-retained" ? "normal-skipped" : result.kind;
}
//#endregion
//#region src/channels/transport/stall-watchdog.ts
function stringifyFailure(error) {
	try {
		return String(error);
	} catch {
		return "Unknown error";
	}
}
/** Creates a watchdog that reports once when an armed transport goes idle. */
function createArmableStallWatchdog(params) {
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	const defaultCheckIntervalMs = Math.min(5e3, Math.max(250, timeoutMs / 6));
	const checkIntervalMs = resolveTimerTimeoutMs(params.checkIntervalMs, defaultCheckIntervalMs, 100);
	let armed = false;
	let stopped = false;
	let lastActivityAt = Date.now();
	let timer = null;
	const report = (message) => {
		try {
			const result = params.runtime?.error?.(message);
			Promise.resolve(result).catch(() => {});
		} catch {}
	};
	const reportTimeoutFailure = (error) => report(`[${params.label}] transport watchdog timeout handler failed: ${stringifyFailure(error)}`);
	const clearTimer = () => {
		if (!timer) return;
		clearInterval(timer);
		timer = null;
	};
	const disarm = () => {
		armed = false;
	};
	const stop = () => {
		if (stopped) return;
		stopped = true;
		disarm();
		clearTimer();
		params.abortSignal?.removeEventListener("abort", stop);
	};
	const arm = (atMs) => {
		if (stopped) return;
		lastActivityAt = atMs ?? Date.now();
		armed = true;
	};
	const touch = (atMs) => {
		if (stopped) return;
		lastActivityAt = atMs ?? Date.now();
	};
	const check = () => {
		if (!armed || stopped) return;
		const idleMs = Date.now() - lastActivityAt;
		if (idleMs < timeoutMs) return;
		disarm();
		report(`[${params.label}] transport watchdog timeout: idle ${Math.round(idleMs / 1e3)}s (limit ${Math.round(timeoutMs / 1e3)}s)`);
		try {
			Promise.resolve(params.onTimeout({
				idleMs,
				timeoutMs
			})).catch(reportTimeoutFailure);
		} catch (error) {
			reportTimeoutFailure(error);
		}
	};
	if (params.abortSignal?.aborted) stop();
	else {
		params.abortSignal?.addEventListener("abort", stop, { once: true });
		timer = setInterval(check, checkIntervalMs);
		timer.unref?.();
	}
	return {
		arm,
		touch,
		disarm,
		stop,
		isArmed: () => armed
	};
}
//#endregion
export { clearFinalizableDraftMessage, createAccountStatusSink, createArmableStallWatchdog, createChannelRunQueue, createDraftStreamLoop, createFinalizableDraftLifecycle, createFinalizableDraftStreamControls, createFinalizableDraftStreamControlsForState, createRunStateMachine, deliverFinalizableDraftPreview, keepHttpServerTaskAlive, runPassiveAccountLifecycle, takeMessageIdAfterStop, waitUntilAbort };
