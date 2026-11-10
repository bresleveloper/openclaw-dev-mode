import { r as prepareOutboundProposal, t as PipelineError } from "../../pipeline-DcY9uBop.mjs";
import { T as formatHandleEpoch } from "../../state-format-A6jMVTqv.mjs";
import { a as reefPeerIdentity, i as matchesReefPeerIdentity } from "../../friend-types-DKK2gCV4.mjs";
import { l as ReefPeerStateSchema, s as ReefOutboundDeliverySchema } from "../../trust-store-format-Ci47SDUH.mjs";
import { t as appendReefAuditEvents } from "../../audit-state-operation-B3UCNSfO.mjs";
import { i as ReefReviewCapacityError, n as requestReefReview, t as lookupReefReviewDecision } from "../../state-operation-Bzqk0WOH.mjs";
//#region extensions/reef/src/outbound-state-operation.ts
function reviewFailure(approvalDigest, denied, verdict) {
	return {
		kind: "pipeline",
		stage: "review",
		message: denied ? "review explicitly denied" : "review approval pending",
		reviewOutcome: denied ? "denied" : "pending",
		approvalDigest,
		verdict
	};
}
function runReefOutboundOperation(command, tx) {
	const scope = command.input;
	const now = Date.now();
	const events = [];
	const event = (type, payload) => events.push({
		type,
		payload,
		ts: Math.floor(now / 1e3)
	});
	const finish = (result) => {
		appendReefAuditEvents(tx, scope.audit, events);
		return result;
	};
	if (command.type === "prepare") {
		const input = command.input;
		const [peerValue, delivery] = tx.lookupMany([{
			store: 0,
			key: input.peerKey
		}, {
			store: 1,
			key: input.deliveryKey
		}]);
		const peerState = peerValue === void 0 ? { revision: 0 } : ReefPeerStateSchema.parse(peerValue);
		const friend = peerState.trust;
		if (!friend || friend.safetyNumberChanged || input.expectedRecipient && !matchesReefPeerIdentity(friend, input.expectedRecipient)) return { kind: "unapproved" };
		if (delivery !== void 0) return { kind: "duplicate" };
		const to = formatHandleEpoch(input.peer, friend.keyEpoch);
		let proposal;
		try {
			proposal = prepareOutboundProposal({
				...input,
				to,
				recipientEncryptionPublicKey: friend.x25519PublicKey
			}, input.senderSigningKeyLength);
		} catch (error) {
			if (!(error instanceof PipelineError)) throw error;
			return {
				kind: "pipeline",
				stage: error.stage,
				message: error.message
			};
		}
		const { checks, proposalHash, approvalDigest } = proposal;
		const binding = {
			id: input.id,
			from: input.from,
			to,
			direction: "outbound",
			bodyHash: proposalHash,
			approvalDigest
		};
		event("proposal", {
			id: input.id,
			from: input.from,
			to,
			bodyHash: proposalHash,
			approvalDigest,
			body: input.body
		});
		if (!checks.allowed) {
			event("deterministic_verdict", {
				id: input.id,
				approvalDigest,
				decision: "deny",
				findings: checks.findings
			});
			return finish({
				kind: "pipeline",
				stage: "deterministic",
				message: "deterministic checks denied message"
			});
		}
		const review = lookupReefReviewDecision(tx, 5, approvalDigest);
		if (review === "pending" || review !== "none" && !review.approved) return finish(reviewFailure(approvalDigest, review !== "pending"));
		const afterApproval = review !== "none";
		if (afterApproval) event("review_approval", {
			...binding,
			approved: true
		});
		return finish({
			kind: "prepared",
			prepared: {
				binding,
				recipient: reefPeerIdentity(friend),
				afterApproval,
				peerRevision: peerState.revision
			}
		});
	}
	const { prepared, verdict } = command.input;
	const { binding, recipient, afterApproval } = prepared;
	event("guard_verdict", {
		...binding,
		...afterApproval ? { afterApproval: true } : {},
		...verdict
	});
	if (verdict.decision === "deny") return finish({
		kind: "pipeline",
		stage: "guard",
		message: afterApproval ? "guard denied approved message" : "Reef outbound guard denied the message. Do not retry or rephrase it automatically; ask the owner before sending related content.",
		verdict
	});
	const review = lookupReefReviewDecision(tx, 5, binding.approvalDigest);
	if (afterApproval && (review === "none" || review === "pending" || !review.approved) || !afterApproval && review !== "none") return finish(reviewFailure(binding.approvalDigest, review !== "none" && review !== "pending" && !review.approved, verdict));
	if (!afterApproval && verdict.decision === "review") {
		try {
			requestReefReview(tx, 5, command.input.reviewMaxEntries, {
				...binding,
				verdict
			});
		} catch (error) {
			if (!(error instanceof ReefReviewCapacityError)) throw error;
			return finish({ kind: "review-capacity" });
		}
		return finish(reviewFailure(binding.approvalDigest, false, verdict));
	}
	const envelope = command.input.envelope;
	if (!envelope) return finish({ kind: "composition-failed" });
	event("envelope", {
		id: binding.id,
		approvalDigest: binding.approvalDigest,
		envelope
	});
	const [peerValue, delivery] = tx.lookupMany([{
		store: 0,
		key: scope.peerKey
	}, {
		store: 1,
		key: scope.deliveryKey
	}]);
	const peerState = peerValue === void 0 ? { revision: 0 } : ReefPeerStateSchema.parse(peerValue);
	if (peerState.revision !== prepared.peerRevision || !matchesReefPeerIdentity(peerState.trust, recipient)) return finish({ kind: "peer-changed" });
	if (delivery !== void 0) return finish({ kind: "duplicate" });
	tx.set(1, scope.deliveryKey, ReefOutboundDeliverySchema.parse({
		bodyHash: binding.bodyHash,
		textHash: command.input.textHash,
		recipient,
		sentAt: now,
		...command.input.resendDisabled ? { resendDisabled: true } : {}
	}));
	return finish({ kind: "recorded" });
}
//#endregion
export { runReefOutboundOperation };
