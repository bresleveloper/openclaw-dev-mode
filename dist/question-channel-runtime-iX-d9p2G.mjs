import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { T as runWithRetainedGatewayRootWork } from "./gateway-work-admission-CHv_0noy.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/question-channel-runtime-internal.ts
const TERMINAL_DELIVERY_RETENTION_MS = 864e5;
function collectAnsweredLabels(record, event) {
	const answers = event.answers.answers;
	return record.questions.flatMap((question) => {
		if (question.isSecret || question.options.length === 0) return [];
		const optionLabels = new Set(question.options.map((option) => option.label));
		return (answers[question.questionId] ?? []).filter((answer) => optionLabels.has(answer));
	});
}
function formatQuestionTerminalStatusLine(params) {
	if (params.event.status === "expired") return "Expired";
	if (params.event.status === "cancelled") return "Cancelled";
	const labels = collectAnsweredLabels(params.record, params.event);
	return labels.length > 0 ? `Answered: ${labels.join(", ")}` : "Answered";
}
function createQuestionChannelRuntime(options = {}) {
	const entries = /* @__PURE__ */ new Map();
	const retainedEntries = /* @__PURE__ */ new Set();
	const deliveryContext = new AsyncLocalStorage();
	const retiredGateways = /* @__PURE__ */ new WeakSet();
	let finalizers = new AsyncWorkScope();
	let clearing;
	const terminalRetentionMs = options.terminalRetentionMs ?? TERMINAL_DELIVERY_RETENTION_MS;
	const runFinalizer = (questionId, deliveryId, finalize, statusLine, track) => {
		finalizers.track(() => track(() => runWithRetainedGatewayRootWork(() => finalize(statusLine)))).catch((error) => options.onFinalizeError?.(error, questionId, deliveryId));
	};
	const finalizeDelivery = (questionId, entry, deliveryId, finalize) => {
		if (!entry.terminal || entry.finalizedDeliveryIds.has(deliveryId)) return;
		entry.deliveries.delete(deliveryId);
		entry.finalizedDeliveryIds.add(deliveryId);
		const statusLine = formatQuestionTerminalStatusLine({
			record: entry.record,
			event: entry.terminal
		});
		runFinalizer(questionId, deliveryId, finalize, statusLine, entry.track);
	};
	const releaseEntry = (entry) => {
		retainedEntries.delete(entry);
		if (entries.get(entry.record.id) === entry) entries.delete(entry.record.id);
		clearTimeout(entry.cleanupTimer);
		entry.deliveries.clear();
		entry.finalizedDeliveryIds.clear();
	};
	const scheduleCleanup = (entry) => {
		if (entry.cleanupTimer || !retainedEntries.has(entry)) return;
		entry.cleanupTimer = setTimeout(() => releaseEntry(entry), terminalRetentionMs);
		entry.cleanupTimer.unref?.();
	};
	return {
		handleRequested(record) {
			const owner = getAsyncWorkSignal();
			if (clearing || owner && retiredGateways.has(owner)) return;
			const entry = {
				record,
				owner,
				track: captureAsyncWorkTracker(),
				deliveries: /* @__PURE__ */ new Map(),
				finalizedDeliveryIds: /* @__PURE__ */ new Set()
			};
			retainedEntries.add(entry);
			entries.set(record.id, entry);
		},
		handleResolved(event) {
			const entry = entries.get(event.id);
			if (!entry || entry.terminal) return;
			entry.terminal = event;
			for (const [deliveryId, finalize] of entry.deliveries) finalizeDelivery(event.id, entry, deliveryId, finalize);
			scheduleCleanup(entry);
		},
		runWithDeliveries(questionIds, run, deliveryOptions) {
			if (!questionIds.some(Boolean)) return run();
			const parent = deliveryContext.getStore();
			const captured = new Map(parent?.entries);
			for (const id of questionIds) if (id && (deliveryOptions?.unbound || !captured.has(id))) captured.set(id, deliveryOptions?.unbound ? void 0 : entries.get(id));
			return deliveryContext.run({
				entries: captured,
				finalizers: parent?.finalizers ?? finalizers,
				owner: parent ? parent.owner : getAsyncWorkSignal(),
				track: parent ? parent.track : captureAsyncWorkTracker()
			}, run);
		},
		registerDelivery({ questionId, deliveryId, finalize }) {
			const captured = deliveryContext.getStore();
			if (clearing || captured && (captured.finalizers !== finalizers || captured.owner && retiredGateways.has(captured.owner))) return;
			const entry = captured?.entries.has(questionId) ? captured.entries.get(questionId) : entries.get(questionId);
			if (entry?.owner && retiredGateways.has(entry.owner)) return;
			if (!entry || !retainedEntries.has(entry)) {
				if (captured?.entries.has(questionId)) runFinalizer(questionId, deliveryId, finalize, "Unavailable: request a new question.", captured.track);
				return;
			}
			if (entry.finalizedDeliveryIds.has(deliveryId)) return;
			entry.deliveries.set(deliveryId, finalize);
			finalizeDelivery(questionId, entry, deliveryId, finalize);
		},
		retireGateway(owner) {
			retiredGateways.add(owner);
			for (const entry of retainedEntries) if (entry.owner === owner) releaseEntry(entry);
		},
		clear() {
			if (clearing) return clearing;
			for (const entry of retainedEntries) releaseEntry(entry);
			clearing = finalizers.drain().then(() => {
				finalizers = new AsyncWorkScope();
				clearing = void 0;
			});
			return clearing;
		}
	};
}
//#endregion
//#region src/infra/question-channel-runtime.ts
const log = createSubsystemLogger("gateway/questions");
const questionChannelRuntime = resolveGlobalSingleton(Symbol.for("openclaw.questionChannelRuntime"), () => createQuestionChannelRuntime({ onFinalizeError: (error, questionId, deliveryId) => {
	log.warn(`question message finalization failed id=${questionId} delivery=${deliveryId}`, { error: String(error) });
} }), (runtime) => runtime.clear());
const handleQuestionChannelRequested = questionChannelRuntime.handleRequested;
const handleQuestionChannelResolved = questionChannelRuntime.handleResolved;
const runWithQuestionChannelDeliveries = questionChannelRuntime.runWithDeliveries;
const registerQuestionChannelDelivery = questionChannelRuntime.registerDelivery;
const retireQuestionChannelGateway = questionChannelRuntime.retireGateway;
//#endregion
export { runWithQuestionChannelDeliveries as a, retireQuestionChannelGateway as i, handleQuestionChannelResolved as n, registerQuestionChannelDelivery as r, handleQuestionChannelRequested as t };
