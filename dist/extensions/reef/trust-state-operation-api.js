import { i as matchesReefPeerIdentity, o as sameReefPeerIdentity, r as ReefPeerTrustSchema, t as ReefAutonomySchema } from "../../friend-types-DKK2gCV4.mjs";
import { _ as mergeReefRejectionNotice, b as reefOutboundRequestStatus, c as ReefOutboundRejectionSchema, d as ReefRejectionNoticeStateSchema, g as matchesReefDeliveryBinding, h as listReefPeerTrust, l as ReefPeerStateSchema, p as currentReefDeliveries, s as ReefOutboundDeliverySchema, w as withoutReefOutboundRequest, y as parseReefPeerState } from "../../trust-store-format-Ci47SDUH.mjs";
//#region extensions/reef/src/trust-delivery-transition.ts
function rejectReefDelivery(value, expected, category, rejectedAt) {
	const parsed = ReefOutboundDeliverySchema.safeParse(value);
	if (!parsed.success || !matchesReefDeliveryBinding(parsed.data, expected)) return;
	return {
		changed: parsed.data.rejection === void 0,
		delivery: parsed.data.rejection ? parsed.data : {
			...parsed.data,
			rejection: ReefOutboundRejectionSchema.parse({
				...category ? { category } : {},
				...parsed.data.resendDisabled ? { notice: { lastRejectionAt: rejectedAt } } : {}
			})
		}
	};
}
function reserveReefRejection(value, recipient, notice) {
	const parsed = ReefOutboundDeliverySchema.safeParse(value);
	if (!parsed.success || !parsed.data.rejection || !sameReefPeerIdentity(parsed.data.recipient, recipient)) return;
	const existing = parsed.data.rejection.notice;
	return {
		delivery: existing ? parsed.data : {
			...parsed.data,
			rejection: {
				...parsed.data.rejection,
				notice: ReefRejectionNoticeStateSchema.parse(notice)
			}
		},
		outcome: existing ? {
			kind: "existing",
			state: existing
		} : { kind: "reserved" }
	};
}
function overdueReefDeliveries(deliveries, olderThanMs, now) {
	return deliveries.flatMap(({ peer, id, delivery }) => delivery.rejection || delivery.overdueNotifiedAt !== void 0 || delivery.sentAt === void 0 || delivery.sentAt + olderThanMs > now ? [] : [{
		peer,
		id,
		sentAt: delivery.sentAt
	}]);
}
function pendingReefRejections(deliveries) {
	return deliveries.flatMap(({ peer, id, delivery }) => delivery.rejection ? [{
		peer,
		id,
		recipient: delivery.recipient,
		...delivery.textHash ? { textHash: delivery.textHash } : {},
		...delivery.rejection.category ? { category: delivery.rejection.category } : {},
		...delivery.rejection.notice ? { reservedNotice: delivery.rejection.notice } : {}
	}] : []).toSorted((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
}
//#endregion
//#region extensions/reef/src/trust-peer-transition.ts
/** Shared policy; native and worker adapters own their respective atomic writes. */
function transitionReefPeer(command, current) {
	switch (command.type) {
		case "set": return {
			...current,
			revision: current.revision + 1,
			trust: ReefPeerTrustSchema.parse(command.input.trust)
		};
		case "remove": return { revision: current.revision + 1 };
		case "setAutonomy": return current.trust ? {
			...current,
			trust: {
				...current.trust,
				autonomy: ReefAutonomySchema.parse(command.input.autonomy)
			}
		} : void 0;
		case "markSafetyNumberChanged": return current.revision === command.input.expectedRevision && current.trust ? {
			...current,
			revision: current.revision + 1,
			trust: {
				...current.trust,
				safetyNumberChanged: true
			}
		} : void 0;
		case "commitPeerTrust": {
			const { friend, expectedRevision, expectedOutboundRequestId, approvedAt } = command.input;
			if (current.revision !== expectedRevision || expectedOutboundRequestId !== void 0 && current.outboundRequests?.[expectedOutboundRequestId] === void 0) return;
			return {
				revision: current.revision + 1,
				trust: ReefPeerTrustSchema.parse({
					autonomy: current.trust?.autonomy ?? "bounded",
					ed25519PublicKey: friend.ed25519_pub,
					x25519PublicKey: friend.x25519_pub,
					keyEpoch: friend.key_epoch,
					safetyNumberChanged: false,
					approvedAt
				}),
				...current.rejectionNotice ? { rejectionNotice: current.rejectionNotice } : {}
			};
		}
		case "beginRequest": return ReefPeerStateSchema.parse({
			...current,
			outboundRequests: {
				...current.outboundRequests,
				[command.input.requestId]: command.input.requestedAt
			}
		});
		case "removeRequest": return withoutReefOutboundRequest(current, command.input.requestId);
	}
	return command;
}
//#endregion
//#region extensions/reef/src/trust-state-operation.ts
function readReefPeerState(tx, key) {
	return parseReefPeerState(tx.lookup(0, key));
}
function deliveriesForCurrentPeers(tx, prefix, requireValid = false) {
	const peers = new Map(listReefPeerTrust(tx.entries(0), prefix).map(({ peer, trust }) => [peer, trust]));
	return currentReefDeliveries(tx.entries(1), prefix, (peer) => peers.get(peer), requireValid);
}
function runReefTrustStateOperation(command, tx) {
	switch (command.type) {
		case "snapshot": return readReefPeerState(tx, command.input.key);
		case "list": return listReefPeerTrust(tx.entries(0), command.input.prefix);
		case "set":
		case "remove":
		case "setAutonomy":
		case "markSafetyNumberChanged":
		case "commitPeerTrust":
		case "beginRequest":
		case "removeRequest": {
			const next = transitionReefPeer(command, readReefPeerState(tx, command.input.key));
			if (next) tx.set(0, command.input.key, next);
			return command.type === "set" || command.type === "beginRequest" ? void 0 : Boolean(next);
		}
		case "requestStatus": return reefOutboundRequestStatus(readReefPeerState(tx, command.input.key), command.input.requestId);
		case "readDelivery": {
			const [peer, value] = tx.lookupMany([{
				store: 0,
				key: command.input.peerKey
			}, {
				store: 1,
				key: command.input.deliveryKey
			}]);
			return value === void 0 ? void 0 : {
				delivery: ReefOutboundDeliverySchema.parse(value),
				trust: parseReefPeerState(peer).trust
			};
		}
		case "consumeDelivery":
		case "discardDelivery": {
			const { deliveryKey, expected } = command.input;
			const parsed = ReefOutboundDeliverySchema.safeParse(tx.lookup(1, deliveryKey));
			const matches = parsed.success && matchesReefDeliveryBinding(parsed.data, expected);
			if (command.type === "consumeDelivery" && parsed.success && parsed.data.rejection) return "rejected";
			if (matches) tx.delete(1, deliveryKey);
			return command.type === "consumeDelivery" ? matches ? "consumed" : "unavailable" : matches;
		}
		case "rejectDelivery": {
			const { deliveryKey, expected, category, rejectedAt } = command.input;
			const next = rejectReefDelivery(tx.lookup(1, deliveryKey), expected, category, rejectedAt);
			if (next?.changed) tx.set(1, deliveryKey, next.delivery);
			return next?.delivery.rejection;
		}
		case "reserveRejection": {
			const { peerKey, deliveryKey, recipient, notice } = command.input;
			const [peerValue, value] = tx.lookupMany([{
				store: 0,
				key: peerKey
			}, {
				store: 1,
				key: deliveryKey
			}]);
			if (!matchesReefPeerIdentity(parseReefPeerState(peerValue).trust, recipient)) return { kind: "peer-changed" };
			const reservation = reserveReefRejection(value, recipient, notice);
			if (!reservation) return { kind: "unavailable" };
			tx.set(1, deliveryKey, reservation.delivery);
			return reservation.outcome;
		}
		case "completeRejection": {
			const { peerKey, deliveryKey } = command.input;
			const notice = ReefRejectionNoticeStateSchema.parse(command.input.notice);
			const [peerValue, value] = tx.lookupMany([{
				store: 0,
				key: peerKey
			}, {
				store: 1,
				key: deliveryKey
			}]);
			const current = parseReefPeerState(peerValue);
			tx.set(0, peerKey, {
				...current,
				rejectionNotice: mergeReefRejectionNotice(current.rejectionNotice, notice)
			});
			const delivery = ReefOutboundDeliverySchema.safeParse(value);
			const consumed = delivery.success && delivery.data.rejection?.notice !== void 0;
			if (consumed) tx.delete(1, deliveryKey);
			return consumed || value === void 0;
		}
		case "overdueDeliveries": return overdueReefDeliveries(deliveriesForCurrentPeers(tx, command.input.prefix), command.input.olderThanMs, command.input.now);
		case "markDeliveryOverdue": {
			const { deliveryKey, now } = command.input;
			const parsed = ReefOutboundDeliverySchema.safeParse(tx.lookup(1, deliveryKey));
			if (!parsed.success || parsed.data.rejection || parsed.data.overdueNotifiedAt !== void 0) return false;
			tx.set(1, deliveryKey, {
				...parsed.data,
				overdueNotifiedAt: now
			});
			return true;
		}
		case "pendingRejections": return pendingReefRejections(deliveriesForCurrentPeers(tx, command.input.prefix, true));
	}
}
//#endregion
export { runReefTrustStateOperation };
