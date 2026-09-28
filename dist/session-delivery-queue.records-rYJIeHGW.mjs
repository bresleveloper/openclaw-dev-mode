import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { a as generateSecureUuid } from "./secure-random-BJtJxP9Y.mjs";
//#region src/infra/session-delivery-queue.records.ts
const SESSION_DELIVERY_QUEUE_NAME = "session";
function prepareClaimedSessionDelivery(params, initialAttemptLeaseMs, now = Date.now()) {
	return {
		...params,
		retainOnFailure: true,
		id: buildEntryId(params.idempotencyKey),
		enqueuedAt: now,
		retryCount: 0,
		availableAt: now + Math.max(0, initialAttemptLeaseMs)
	};
}
var SessionDeliveryDeferredError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SessionDeliveryDeferredError";
	}
};
/** Signals that retry budget was already persisted before a later transition failed. */
var SessionDeliveryRetryChargedError = class extends Error {
	constructor(..._args2) {
		super(..._args2);
		this.name = "SessionDeliveryRetryChargedError";
	}
};
/** Signals that durable pre-delivery ownership could not be established. */
var SessionDeliveryAttemptStartError = class extends Error {
	constructor(..._args3) {
		super(..._args3);
		this.name = "SessionDeliveryAttemptStartError";
	}
};
/** Signals that delivery proved no external or transcript side effect committed. */
var SessionDeliverySafeRetryError = class extends Error {
	constructor(..._args4) {
		super(..._args4);
		this.name = "SessionDeliverySafeRetryError";
	}
};
/** Signals that recovery must settle this pending row as failed without replaying delivery. */
var SessionDeliveryDeadLetteredError = class extends Error {
	constructor(..._args5) {
		super(..._args5);
		this.name = "SessionDeliveryDeadLetteredError";
	}
};
function buildEntryId(idempotencyKey) {
	if (!idempotencyKey) return generateSecureUuid();
	return sha256Hex(idempotencyKey);
}
function prepareSessionDelivery(params) {
	return {
		...params,
		...params.completionRetention === "permanent" ? { retainOnFailure: true } : {},
		id: buildEntryId(params.idempotencyKey),
		enqueuedAt: Date.now(),
		retryCount: 0
	};
}
/** Signals that a delivered result still needs durable settlement finalization. */
var SessionDeliveryAcknowledgementFinalizeError = class extends Error {
	constructor(id, options) {
		super(`Session delivery ${id} still needs settlement finalization`, options);
		this.name = "SessionDeliveryAcknowledgementFinalizeError";
	}
};
//#endregion
export { SessionDeliveryDeferredError as a, prepareClaimedSessionDelivery as c, SessionDeliveryDeadLetteredError as i, prepareSessionDelivery as l, SessionDeliveryAcknowledgementFinalizeError as n, SessionDeliveryRetryChargedError as o, SessionDeliveryAttemptStartError as r, SessionDeliverySafeRetryError as s, SESSION_DELIVERY_QUEUE_NAME as t };
