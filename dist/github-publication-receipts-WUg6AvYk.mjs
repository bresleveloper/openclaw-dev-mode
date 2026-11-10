import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import "./sqlite-worker-contract-DhDutMia.mjs";
import { a as deferSqliteWorkerCommitReceipt, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as createKeyedStateDomainPublication } from "./state-domain-publication-CEKqcWHX.mjs";
import { serialize } from "node:v8";
//#region src/state/github-publication-receipts.ts
function isPublicationFact(key, fact, mutation) {
	const decoded = JSON.parse(key);
	return Array.isArray(decoded) && decoded.length === 2 && (mutation ? [
		"shared",
		"personal",
		"repository",
		"shared-lifecycle",
		"personal-lifecycle"
	] : [
		"personal",
		"repository",
		"personal-lifecycle"
	]).includes(decoded[0]) && typeof decoded[1] === "string" && (fact.kind === "absent" || mutation && fact.kind === "postimage" && isRecord(fact.value) && fact.value.request_id === decoded[1]);
}
const publication = createKeyedStateDomainPublication({
	domain: "github-publication",
	isFact: (key, fact) => isPublicationFact(key, fact, true),
	invalidReceiptMessage: "GitHub publication authority receipt is invalid",
	installFailureMessage: "GitHub publication fact installation failed"
});
/** Exact owner writes only: arbitrary raw SQL remains outside this coverage. */
const githubPublicationReceipts = {
	stageRow: stageGitHubPublicationRow,
	subscribeFacts: (listener) => publication.subscribeFacts((change) => listener(change, change.kind === "pending" && typeof change.identity === "string" && owners.get(change.identity)?.pendingDeletion === true))
};
const owners = resolveGlobalMap(Symbol.for("openclaw.githubPublicationLifecycleAuthority"), "close-and-restart");
function ownerFor(identity) {
	let owner = owners.get(identity);
	if (!owner) {
		owner = {
			cells: /* @__PURE__ */ new Map(),
			pending: /* @__PURE__ */ new Set(),
			uncertain: false
		};
		owners.set(identity, owner);
	}
	return owner;
}
githubPublicationReceipts.subscribeFacts((change, deletionPending) => {
	const identity = change.kind === "committed" ? change.receipt.source.identity : change.identity;
	if (typeof identity !== "string") return;
	const owner = ownerFor(identity);
	if (change.kind === "pending") {
		if (deletionPending) owner.pending.add(change.operationId);
	} else if (change.kind === "settled") owner.pending.delete(change.operationId);
	else if (change.kind === "unknown") {
		owner.uncertain = true;
		owner.cells.clear();
	} else if (change.kind === "committed") {
		for (const [key, fact] of change.receipt.facts) if (fact.kind !== "postimage") owner.cells.delete(key);
		else if ("lifecycle_revision" in fact.value) {
			const existing = owner.cells.get(key);
			const cell = existing && !existing.loaded ? existing : { loaded: false };
			cell.value = {
				lifecycle_revision: fact.value.lifecycle_revision,
				requester_authority_json: fact.value.requester_authority_json
			};
			cell.loaded = true;
			owner.cells.set(key, cell);
		}
	}
});
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		if (event.identity) owners.delete(event.identity.key);
		else owners.clear();
	}
});
/** Capture before the cold read; this module observes pending even before the first reader. */
function captureGitHubPublicationLifecycle(context, input) {
	const identity = context.admission.identity.key;
	const owner = ownerFor(identity);
	const key = JSON.stringify([`${input.publicationKind}-lifecycle`, input.requestId]);
	let cell = owner.cells.get(key);
	if (!cell) {
		cell = { loaded: false };
		owner.cells.set(key, cell);
	}
	const retained = cell;
	const readCurrent = () => {
		context.admission.assertCurrent();
		if (owners.get(identity) !== owner || owner.cells.get(key) !== retained || owner.pending.size || owner.uncertain) throw new Error("GitHub publication lifecycle authority is unavailable; retry after owner recovery");
		return retained.value && { ...retained.value };
	};
	readCurrent();
	return {
		loaded: retained.loaded,
		readCurrent,
		observe(value) {
			readCurrent();
			if (!retained.loaded) {
				retained.value = value;
				retained.loaded = true;
			}
		}
	};
}
function deferGitHubPublicationDeletionReceipt(db, tombstones) {
	const receipt = publication.receipt(sqlPublicationAnchor(db), tombstones);
	deferSqliteWorkerCommitReceipt(sqlPublicationAnchor(db), serialize(receipt).byteLength <= 33554432 ? receipt : {
		kind: "unknown",
		identity: receipt.source.identity
	}, tombstones.size ? "commit" : "settlement");
}
/** Capture the same authority rows as native writes, including their lifecycle sidecars. */
function captureGitHubPublicationWorkerReceipt(db, write) {
	const { result, receipt: authority } = publication.capture(sqlPublicationAnchor(db), write);
	const receipt = {
		...result,
		authority
	};
	if (serialize(receipt).byteLength > 33554432) receipt.authority = {
		kind: "unknown",
		identity: authority.source.identity
	};
	return receipt;
}
function stageGitHubPublicationRow(db, kind, row) {
	const value = { ...row };
	delete value.title;
	delete value.body;
	delete value.next_action;
	publication.stagePostimages(sqlPublicationAnchor(db), [[JSON.stringify([kind, row.request_id]), value]]);
}
/** The deletion worker sends tombstones, including lifecycle rows, before its ordinary reply. */
function withGitHubPublicationDeletionReceipt(createAdmission, context) {
	return withGitHubPublicationReceipt(createAdmission, context, false);
}
/** Register before presentation observers so every reply sees installed authority facts. */
function withGitHubPublicationWorkerReceipt(createAdmission, context, publish) {
	return withGitHubPublicationReceipt(createAdmission, context, true, publish);
}
function withGitHubPublicationReceipt(createAdmission, context, mutation, publish) {
	return (operation) => {
		const owner = createAdmission(operation);
		let pending;
		const lifecycleOwner = ownerFor(context.admission.identity.key);
		const previousDeletion = lifecycleOwner.pendingDeletion;
		try {
			lifecycleOwner.pendingDeletion = !mutation;
			pending = publication.begin({
				identity: context.admission.identity.key,
				assertCurrent: context.assertPublicationCurrent ?? context.admission.assertCurrent
			}, mutation ? void 0 : (key, fact) => isPublicationFact(key, fact, false));
		} catch (error) {
			owner.admission.finish();
			throw error;
		} finally {
			lifecycleOwner.pendingDeletion = previousDeletion;
		}
		const finish = owner.admission.finish.bind(owner.admission);
		owner.admission.finish = () => {
			try {
				finish();
			} finally {
				if (owner.admission.settlement) {
					const confirmed = owner.admission.settlement.kind === "completed";
					pending.finish(confirmed, confirmed && !owner.admission.committed);
				}
			}
		};
		operation.settled.then((outcome) => {
			const known = outcome.kind !== "unknown";
			pending.finish(known, known && !owner.admission.committed);
		});
		observeSqliteWorkerCommittedFacts(owner.admission, ({ facts: payload }) => {
			pending.committed(mutation && isRecord(payload) ? payload.authority : payload, () => publish?.(payload));
		});
		return owner;
	};
}
//#endregion
export { withGitHubPublicationDeletionReceipt as a, githubPublicationReceipts as i, captureGitHubPublicationWorkerReceipt as n, withGitHubPublicationWorkerReceipt as o, deferGitHubPublicationDeletionReceipt as r, captureGitHubPublicationLifecycle as t };
