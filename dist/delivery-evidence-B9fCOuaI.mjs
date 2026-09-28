import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-DeX5XiDx.mjs";
import { t as hasAnyNonEmptyString } from "./delivery-evidence-values-hxU4G9Np.mjs";
import { a as hasVisibleAgentPayload, t as collectMediaUrlsFromRecord } from "./message-visibility-yTJ46I8l.mjs";
//#region src/agents/embedded-agent-runner/delivery-evidence.ts
function collectSourceReplyFinalMarkers(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const marker = asOptionalRecord(entry)?.sourceReplyFinal;
		return typeof marker === "boolean" ? [marker] : [];
	});
}
/** Resolve explicit progress/final evidence, or undefined for legacy runtimes. */
function resolveExplicitFinalSourceReplyDeliveryEvidence(result) {
	const markers = [...collectSourceReplyFinalMarkers(result.messagingToolSentTargets), ...collectSourceReplyFinalMarkers(result.messagingToolSourceReplyPayloads)];
	return markers.length > 0 ? markers.some(Boolean) : void 0;
}
/** Preserve legacy completion semantics unless the runtime emitted progress/final markers. */
function hasCompletedSourceReplyDeliveryEvidence(result) {
	return resolveSourceReplyDelivery(result) === "delivered";
}
/** Only a final reply to this input's source can satisfy its reply requirement. */
function resolveSourceReplyDelivery(result, observedDelivery = "missing") {
	if (result.sourceReplyDeliveryState !== void 0) return result.sourceReplyDeliveryState === "missing" || observedDelivery === "delivered" ? observedDelivery : result.sourceReplyDeliveryState;
	return resolveExplicitFinalSourceReplyDeliveryEvidence(result) ?? (result.sourceReplyDelivered === true || hasCommittedSourceReplyDeliveryEvidence(result)) ? "delivered" : observedDelivery;
}
/** Returns whether messaging-tool evidence completes the current source reply. */
function hasCompletedMessagingToolDeliveryEvidence(result) {
	return resolveExplicitFinalSourceReplyDeliveryEvidence(result) ?? hasMessagingToolDeliveryEvidence(result);
}
function hasNonEmptyArray(value) {
	return Array.isArray(value) && value.length > 0;
}
function hasAcceptedSessionSpawnEvidence(value) {
	return Array.isArray(value) ? value.some((entry) => {
		const spawn = asOptionalRecord(entry);
		return hasNonEmptyString(spawn?.runId) && hasNonEmptyString(spawn?.childSessionKey);
	}) : false;
}
function collectStringValues(value, output) {
	if (typeof value === "string" && value.trim()) output.add(value.trim());
	else if (Array.isArray(value)) value.filter(hasNonEmptyString).forEach((entry) => output.add(entry.trim()));
}
function normalizeEvidenceStatus(value) {
	return typeof value === "string" ? value.trim().toLowerCase() || void 0 : void 0;
}
function hasVisibleMessagingToolTarget(value) {
	const target = asOptionalRecord(value);
	if (!target) return false;
	return !("text" in target || "mediaUrls" in target || "hasRichContent" in target || "visible" in target) || hasNonEmptyString(target.text) || hasAnyNonEmptyString(target.mediaUrls) || target.hasRichContent === true || target.visible === true;
}
function collectPayloadMediaUrls(payloads, include) {
	const urls = /* @__PURE__ */ new Set();
	for (const payload of Array.isArray(payloads) ? payloads : []) {
		const record = asOptionalRecord(payload);
		if (record && (!include || include(payload))) collectMediaUrlsFromRecord(record, urls);
	}
	return Array.from(urls);
}
/** Collects media URLs from agent payloads and committed messaging-tool delivery metadata. */
function collectDeliveredMediaUrls(result) {
	return Array.from(/* @__PURE__ */ new Set([...collectPayloadMediaUrls(result.payloads), ...collectMessagingToolDeliveredMediaUrls(result)]));
}
/** Collects media URLs recorded by messaging-tool sends and their target attachments. */
function collectMessagingToolDeliveredMediaUrls(result) {
	const urls = /* @__PURE__ */ new Set();
	collectStringValues(result.messagingToolSentMediaUrls, urls);
	for (const url of collectPayloadMediaUrls(result.messagingToolSentTargets)) urls.add(url);
	return Array.from(urls);
}
function getPayloadDeliveryOutcomes(result) {
	const outcomes = asOptionalObjectRecord(result.deliveryStatus)?.payloadOutcomes;
	return Array.isArray(outcomes) ? outcomes : void 0;
}
function collectPayloadOutcomeMediaUrls(result, statuses) {
	const payloads = Array.isArray(result.payloads) ? result.payloads : [];
	const outcomes = getPayloadDeliveryOutcomes(result) ?? [];
	const urls = /* @__PURE__ */ new Set();
	for (const outcome of outcomes) {
		const record = asOptionalRecord(outcome);
		if (!record) continue;
		if (!statuses(record)) continue;
		const index = typeof record.index === "number" && Number.isInteger(record.index) ? record.index : void 0;
		const payload = asOptionalRecord(index === void 0 ? void 0 : payloads[index]);
		if (payload && hasDeliverableAgentPayload(payload)) collectMediaUrlsFromRecord(payload, urls);
	}
	return Array.from(urls);
}
function hasDeliverableAgentPayload(payload) {
	if (asOptionalRecord(payload)?.visible === false) return false;
	return hasVisibleAgentPayload({ payloads: [payload] }, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false
	});
}
/** Collect automatic-delivery media proven sent by aggregate or per-payload evidence. */
function collectAutomaticDeliveredMediaUrls(result, options = {}) {
	const outcomes = getPayloadDeliveryOutcomes(result);
	if (outcomes) {
		const payloads = Array.isArray(result.payloads) ? result.payloads : [];
		return collectPayloadOutcomeMediaUrls(result, (outcome) => normalizeEvidenceStatus(outcome.status) === "sent" || options.includeSuppressedOutcomes !== false && normalizeEvidenceStatus(outcome.status) === "suppressed" || options.includeAmbiguousSinglePayloadFailure === true && normalizeEvidenceStatus(outcome.status) === "failed" && outcome.sentBeforeError === true && outcomes.length === 1 && payloads.length === 1);
	}
	const status = normalizeEvidenceStatus(result.deliveryStatus?.status);
	return status === "sent" || status === "suppressed" ? collectPayloadMediaUrls(result.payloads, hasDeliverableAgentPayload) : [];
}
/** Collect media whose send may have committed before a per-payload failure. */
function collectAmbiguousAutomaticMediaUrls(result) {
	return collectPayloadOutcomeMediaUrls(result, (outcome) => normalizeEvidenceStatus(outcome.status) === "failed" && outcome.sentBeforeError === true);
}
/** Check that a partial automatic send classifies every expected-media payload. */
function hasCompleteAutomaticMediaDeliveryOutcomeEvidence(result, expectedMediaUrls) {
	if (result.payloadsTruncated === true) return false;
	const payloads = Array.isArray(result.payloads) ? result.payloads : [];
	const outcomes = Array.isArray(result.deliveryStatus?.payloadOutcomes) ? result.deliveryStatus.payloadOutcomes : [];
	if (payloads.length === 0 || outcomes.length === 0) return false;
	const classifiedIndexes = /* @__PURE__ */ new Set();
	for (const outcome of outcomes) {
		const record = asOptionalRecord(outcome);
		if (!record) continue;
		const index = typeof record.index === "number" && Number.isInteger(record.index) && record.index >= 0 && record.index < payloads.length ? record.index : void 0;
		const status = normalizeEvidenceStatus(record.status);
		const classified = status === "sent" || status === "suppressed" || status === "failed" && typeof record.sentBeforeError === "boolean";
		if (index !== void 0 && classified) classifiedIndexes.add(index);
	}
	const expected = new Set(expectedMediaUrls.map(normalizeMediaReferenceForComparison));
	return payloads.every((payload, index) => {
		return !collectPayloadMediaUrls([payload]).some((url) => expected.has(normalizeMediaReferenceForComparison(url))) || classifiedIndexes.has(index);
	});
}
/** Preserve batch send evidence and policy reasons hidden by the first suppressed payload. */
function getAutomaticDeliveryEvidence(result) {
	let suppressionReason = normalizeEvidenceStatus(result.deliveryStatus?.status) === "suppressed" && typeof result.deliveryStatus?.reason === "string" ? result.deliveryStatus.reason : void 0;
	let mayHaveSent = normalizeEvidenceStatus(result.deliveryStatus?.status) === "partial_failed" || suppressionReason === "adapter_returned_no_identity";
	for (const outcome of getPayloadDeliveryOutcomes(result) ?? []) {
		const record = asOptionalRecord(outcome);
		const status = normalizeEvidenceStatus(record?.status);
		mayHaveSent ||= status === "sent" || record?.sentBeforeError === true || status === "suppressed" && record?.reason === "adapter_returned_no_identity";
		if (status === "suppressed" && typeof record?.reason === "string" && (!suppressionReason || suppressionReason === "no_visible_payload")) suppressionReason = record.reason;
	}
	return {
		mayHaveSent,
		suppressionReason
	};
}
function hasPositiveNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
/** Extracts a gateway result payload when the response carries delivery evidence fields. */
function getGatewayAgentResult(response) {
	const record = asOptionalObjectRecord(response);
	const candidate = record && (hasAgentDeliveryEvidenceShape(record) ? record : asOptionalObjectRecord(record.result));
	if (!candidate || !hasAgentDeliveryEvidenceShape(candidate)) return null;
	return candidate;
}
function hasAgentDeliveryEvidenceShape(value) {
	return "payloads" in value || "deliveryStatus" in value || "didSendViaMessagingTool" in value || "messagingToolSentTexts" in value || "messagingToolSentMediaUrls" in value || "messagingToolSentTargets" in value || "acceptedSessionSpawns" in value || "successfulCronAdds" in value || "meta" in value;
}
/** Returns whether the messaging tool attempted or committed an outbound delivery. */
function hasMessagingToolDeliveryEvidence(result) {
	return result.didSendViaMessagingTool === true || hasCommittedMessagingToolDeliveryEvidence(result);
}
/** Returns whether messaging-tool metadata proves committed text, media, or target delivery. */
function hasCommittedMessagingToolDeliveryEvidence(result) {
	return hasAnyNonEmptyString(result.messagingToolSentTexts) || hasAnyNonEmptyString(result.messagingToolSentMediaUrls) || hasNonEmptyArray(result.messagingToolSentTargets);
}
function collectNonEmptyStringArray(value) {
	return Array.isArray(value) ? value.flatMap((item) => typeof item === "string" && item.trim() ? [item.trim()] : []) : [];
}
function hasUnaccountedStrings(aggregate, accounted) {
	const remaining = /* @__PURE__ */ new Map();
	for (const value of accounted) remaining.set(value, (remaining.get(value) ?? 0) + 1);
	for (const value of aggregate) {
		const count = remaining.get(value) ?? 0;
		if (count === 0) return true;
		if (count === 1) remaining.delete(value);
		else remaining.set(value, count - 1);
	}
	return false;
}
/** Returns whether aggregate message-tool sends lack route-checkable target records. */
function hasUnaccountedMessagingToolAggregateEvidence(result) {
	const routeCheckableTargets = Array.isArray(result.messagingToolSentTargets) ? result.messagingToolSentTargets.flatMap((target) => {
		const record = asOptionalRecord(target);
		return record && hasNonEmptyString(record.to) ? [record] : [];
	}) : [];
	const aggregateTexts = collectNonEmptyStringArray(result.messagingToolSentTexts);
	const aggregateMediaUrls = collectNonEmptyStringArray(result.messagingToolSentMediaUrls);
	const accountedTexts = routeCheckableTargets.flatMap((target) => typeof target.text === "string" && target.text.trim() ? [target.text.trim()] : []);
	const accountedMediaUrls = routeCheckableTargets.flatMap((target) => collectNonEmptyStringArray(target.mediaUrls));
	if (hasUnaccountedStrings(aggregateTexts, accountedTexts) || hasUnaccountedStrings(aggregateMediaUrls, accountedMediaUrls)) return true;
	return result.didSendViaMessagingTool === true && routeCheckableTargets.length === 0 && aggregateTexts.length === 0 && aggregateMediaUrls.length === 0;
}
/** Returns whether messaging-tool metadata proves a user-visible committed delivery. */
function hasVisibleCommittedMessagingToolDeliveryEvidence(result) {
	return hasAnyNonEmptyString(result.messagingToolSentTexts) || hasAnyNonEmptyString(result.messagingToolSentMediaUrls) || Array.isArray(result.messagingToolSentTargets) && result.messagingToolSentTargets.some(hasVisibleMessagingToolTarget);
}
/** Returns whether a source reply was visibly delivered through the message tool. */
function hasCommittedSourceReplyDeliveryEvidence(result) {
	return result.didDeliverSourceReplyViaMessageTool === true || hasVisibleAgentPayload({ payloads: result.messagingToolSourceReplyPayloads });
}
/** Returns whether outbound metadata proves a visible message, spawn, or cron side effect. */
function hasVisibleOutboundDeliveryEvidence(result) {
	return hasVisibleCommittedMessagingToolDeliveryEvidence(result) || result.didSendViaMessagingTool === true && result.messagingToolSentTexts === void 0 && result.messagingToolSentMediaUrls === void 0 && result.messagingToolSentTargets === void 0 || hasAcceptedSessionSpawnEvidence(result.acceptedSessionSpawns) || hasPositiveNumber(result.successfulCronAdds);
}
/** Returns whether committed outbound evidence makes replay unsafe. */
function hasCommittedOutboundDeliveryEvidence(result) {
	return hasMessagingToolDeliveryEvidence(result) || hasAcceptedSessionSpawnEvidence(result.acceptedSessionSpawns) || hasPositiveNumber(result.successfulCronAdds);
}
/** Returns whether any tool progress or outbound side effect makes a retry unsafe. */
function hasOutboundDeliveryEvidence(result) {
	return hasCommittedOutboundDeliveryEvidence(result) || hasPositiveNumber(result.meta?.toolSummary?.calls);
}
/** Formats an agent-command delivery failure message from delivery status metadata. */
function getAgentCommandDeliveryFailure(result) {
	const status = normalizeEvidenceStatus(result.deliveryStatus?.status);
	if (status !== "failed" && status !== "partial_failed") return;
	const message = result.deliveryStatus?.errorMessage;
	if (hasNonEmptyString(message)) return message;
	return status === "partial_failed" ? "agent delivery partially failed" : "agent delivery failed";
}
//#endregion
export { hasVisibleCommittedMessagingToolDeliveryEvidence as _, getAgentCommandDeliveryFailure as a, resolveSourceReplyDelivery as b, hasCommittedMessagingToolDeliveryEvidence as c, hasCompleteAutomaticMediaDeliveryOutcomeEvidence as d, hasCompletedMessagingToolDeliveryEvidence as f, hasUnaccountedMessagingToolAggregateEvidence as g, hasOutboundDeliveryEvidence as h, collectMessagingToolDeliveredMediaUrls as i, hasCommittedOutboundDeliveryEvidence as l, hasMessagingToolDeliveryEvidence as m, collectAutomaticDeliveredMediaUrls as n, getAutomaticDeliveryEvidence as o, hasCompletedSourceReplyDeliveryEvidence as p, collectDeliveredMediaUrls as r, getGatewayAgentResult as s, collectAmbiguousAutomaticMediaUrls as t, hasCommittedSourceReplyDeliveryEvidence as u, hasVisibleOutboundDeliveryEvidence as v, resolveExplicitFinalSourceReplyDeliveryEvidence as y };
