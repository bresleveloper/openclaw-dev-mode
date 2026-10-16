import { _ as recordChannelHistoryEntryWithMedia } from "./history-DpVhWkup.mjs";
import { i as toHistoryMediaEntries } from "./media-_mIDNjA9.mjs";
import { t as runPreparedChannelTurn } from "./execution-BIzcYQQA.mjs";
import { n as dispatchAssembledChannelTurn, r as dispatchRoutedChannelTurn, t as assembleResolvedChannelTurn } from "./lifecycle-Df0_vlDo.mjs";
//#region src/channels/turn/run-channel-turn.ts
const DEFAULT_EVENT_CLASS = {
	kind: "message",
	canStartAgentTurn: true
};
function isAdmission(value) {
	if (!value || typeof value !== "object") return false;
	const kind = value.kind;
	return kind === "dispatch" || kind === "observeOnly" || kind === "handled" || kind === "drop";
}
function normalizePreflight(value) {
	if (!value) return {};
	if (isAdmission(value)) return { admission: value };
	return value;
}
function assertPreparedDispatchLifecycle(turn, turnAdoptionLifecycle) {
	if (!turnAdoptionLifecycle) return;
	const lifecycle = turn.runDispatchLifecycle;
	if (!lifecycle) throw new Error("runChannelInboundEvent prepared turns must declare runDispatchLifecycle when creating runDispatch");
	if (lifecycle.turnAdoptionLifecycle !== turnAdoptionLifecycle) throw new Error("runChannelInboundEvent prepared turn runDispatchLifecycle must own the top-level turnAdoptionLifecycle");
}
function emit(params, event) {
	params.log?.({
		channel: params.channel,
		accountId: params.accountId,
		...event
	});
}
function resolveDroppedHistorySender(input, preflight) {
	return preflight.message?.senderLabel ?? preflight.message?.envelopeFrom ?? (typeof input.raw === "object" && input.raw && "sender" in input.raw && typeof input.raw.sender === "string" ? input.raw.sender : void 0) ?? "unknown";
}
function resolveDroppedHistoryBody(input, preflight) {
	return preflight.message?.bodyForAgent ?? preflight.message?.body ?? preflight.message?.rawBody ?? input.textForAgent ?? input.rawText;
}
async function recordDroppedChannelTurnHistory(params) {
	const admission = params.admission ?? params.preflight.admission;
	if (admission?.kind !== "drop") return;
	const history = params.preflight.history;
	if (!history || history.limit <= 0 || !(history.recordOnDrop || admission.recordHistory)) return;
	const body = resolveDroppedHistoryBody(params.input, params.preflight);
	const entry = body.trim().length > 0 ? {
		sender: resolveDroppedHistorySender(params.input, params.preflight),
		body,
		timestamp: params.input.timestamp,
		messageId: params.input.id
	} : null;
	const media = params.preflight.media;
	await recordChannelHistoryEntryWithMedia({
		historyMap: history.historyMap,
		historyKey: history.key,
		limit: history.limit,
		entry,
		mediaLimit: history.mediaLimit,
		messageId: params.input.id,
		shouldRecord: history.shouldRecord,
		media: typeof media === "function" ? async () => toHistoryMediaEntries(await media(), { messageId: params.input.id }) : toHistoryMediaEntries(media, { messageId: params.input.id })
	});
}
async function runChannelTurn(params) {
	emit(params, {
		stage: "ingest",
		event: "start"
	});
	const input = await params.adapter.ingest(params.raw);
	if (!input) {
		const admission = {
			kind: "drop",
			reason: "ingest-null"
		};
		emit(params, {
			stage: "ingest",
			event: "drop",
			admission: admission.kind,
			reason: admission.reason
		});
		return {
			admission,
			dispatched: false
		};
	}
	emit(params, {
		stage: "ingest",
		event: "done",
		messageId: input.id
	});
	const eventClass = await params.adapter.classify?.(input) ?? DEFAULT_EVENT_CLASS;
	if (!eventClass.canStartAgentTurn) {
		const admission = {
			kind: "handled",
			reason: `event:${eventClass.kind}`
		};
		emit(params, {
			stage: "classify",
			event: "handled",
			messageId: input.id,
			admission: admission.kind,
			reason: admission.reason
		});
		return {
			admission,
			dispatched: false
		};
	}
	const preflight = normalizePreflight(await params.adapter.preflight?.(input, eventClass));
	const preflightAdmission = preflight.admission;
	if (preflightAdmission && preflightAdmission.kind !== "dispatch" && preflightAdmission.kind !== "observeOnly") {
		await recordDroppedChannelTurnHistory({
			input,
			preflight,
			admission: preflightAdmission
		});
		emit(params, {
			stage: "preflight",
			event: preflightAdmission.kind === "handled" ? "handled" : "drop",
			messageId: input.id,
			admission: preflightAdmission.kind,
			reason: preflightAdmission.reason
		});
		return {
			admission: preflightAdmission,
			dispatched: false
		};
	}
	const unresolved = await params.adapter.resolveTurn(input, eventClass, preflight);
	const isRoutedTurn = "route" in unresolved && !("runDispatch" in unresolved);
	const resolved = assembleResolvedChannelTurn(unresolved);
	emit(params, {
		accountId: resolved.accountId ?? params.accountId,
		stage: "assemble",
		event: "done",
		messageId: input.id,
		sessionKey: resolved.routeSessionKey,
		admission: resolved.admission?.kind ?? "dispatch"
	});
	const admission = resolved.admission ?? preflightAdmission ?? { kind: "dispatch" };
	const emitFinalize = (event) => emit(params, {
		accountId: resolved.accountId ?? params.accountId,
		stage: "finalize",
		messageId: input.id,
		sessionKey: resolved.routeSessionKey,
		admission: admission.kind,
		...event
	});
	const dispatchContext = {
		admission,
		log: params.log,
		messageId: input.id
	};
	const assembledDispatchContext = params.turnAdoptionLifecycle ? {
		...dispatchContext,
		turnAdoptionLifecycle: params.turnAdoptionLifecycle
	} : dispatchContext;
	let result;
	try {
		if ("runDispatch" in resolved) assertPreparedDispatchLifecycle(resolved, params.turnAdoptionLifecycle);
		const dispatchResult = "runDispatch" in resolved ? await runPreparedChannelTurn({
			...resolved,
			...dispatchContext
		}) : isRoutedTurn ? await dispatchRoutedChannelTurn({
			...unresolved,
			...assembledDispatchContext
		}) : await dispatchAssembledChannelTurn({
			...resolved,
			...assembledDispatchContext
		});
		result = dispatchResult.dispatched ? {
			...dispatchResult,
			admission
		} : dispatchResult;
	} catch (err) {
		const failedResult = {
			admission,
			dispatched: false,
			ctxPayload: resolved.ctxPayload,
			routeSessionKey: resolved.routeSessionKey
		};
		try {
			await params.adapter.onFinalize?.(failedResult);
		} catch {}
		emitFinalize({ event: "done" });
		throw err;
	}
	try {
		await params.adapter.onFinalize?.(result);
		emitFinalize({ event: "done" });
	} catch (err) {
		emitFinalize({
			event: "error",
			error: err
		});
		throw err;
	}
	return result;
}
//#endregion
export { runChannelTurn as n, recordDroppedChannelTurnHistory as t };
