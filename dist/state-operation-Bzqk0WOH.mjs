import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { i as base64url } from "./canonical-C1hv0IfI.mjs";
import { E as generateIdentity, d as REEF_REGISTRATION_IDENTITY_KEY, i as REEF_KEYS_MIGRATION_KEY, l as parseReefKeys, r as REEF_KEYS_KEY, t as REEF_DURABLE_MIGRATION_KEY, u as parseReefReviewRecord, y as parseReefIdentityBinding } from "./state-format-A6jMVTqv.mjs";
//#region extensions/reef/src/state-policy.ts
var ReefReviewCapacityError = class extends Error {
	constructor() {
		super("Reef pending review capacity is exhausted");
		this.name = "ReefReviewCapacityError";
	}
};
function completedReefReviewToEvict(entries, maxEntries) {
	if (entries.length < maxEntries) return;
	const completed = entries.filter((entry) => entry.value.approved !== void 0).toSorted((left, right) => left.createdAt - right.createdAt)[0];
	if (!completed) throw new ReefReviewCapacityError();
	return completed.key;
}
function reefReviewDecision(current) {
	return !current ? "none" : current.approved === void 0 ? "pending" : { approved: current.approved };
}
function assertReefIdentityMigrationComplete(durable, identity) {
	if (durable || identity) throw new Error(`Reef ${durable ? "durable state" : "identity"} migration is incomplete; repair the legacy ${durable ? "state" : "identity"} files and rerun openclaw doctor --fix`);
}
function generateReefKeys() {
	const random = () => base64url(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(32)));
	return {
		...generateIdentity(),
		auditKey: random(),
		replayKey: random(),
		keyEpoch: 1
	};
}
//#endregion
//#region extensions/reef/src/state-operation.ts
const REEF_INBOX_CURSOR_KEY = "current";
function requestReefReview(tx, store, maxEntries, review) {
	const key = review.approvalDigest;
	const current = parseReefReviewRecord(tx.lookup(store, key));
	if (current) return current.approved === void 0 ? void 0 : {
		approved: current.approved,
		approvalDigest: key
	};
	const evicted = completedReefReviewToEvict(tx.entries(store), maxEntries);
	if (evicted !== void 0) tx.delete(store, evicted);
	tx.set(store, key, { review });
}
function decideReefReview(tx, store, digest, approved) {
	const current = parseReefReviewRecord(tx.lookup(store, digest));
	if (!current) return;
	tx.set(store, digest, {
		...current,
		approved
	});
	return current.review;
}
function lookupReefReviewDecision(tx, store, digest) {
	return reefReviewDecision(parseReefReviewRecord(tx.lookup(store, digest)));
}
function requireReefInboxCursorRecord(value, binding) {
	if (!isRecord(value) || typeof value.handle !== "string" || value.handle.length === 0 || typeof value.relayUrl !== "string" || value.relayUrl.length === 0 || typeof value.cursor !== "number" || !Number.isSafeInteger(value.cursor) || value.cursor < 0) throw new Error("invalid Reef inbox cursor state");
	if (value.handle !== binding.handle || value.relayUrl !== binding.relayUrl) throw new Error("Reef inbox cursor belongs to a different identity");
	return {
		handle: value.handle,
		relayUrl: value.relayUrl,
		cursor: value.cursor
	};
}
function runReefStateOperation(command, tx) {
	switch (command.type) {
		case "identity.generate": {
			const [durable, migration, existing, registered] = tx.lookupMany([
				{
					store: 0,
					key: REEF_DURABLE_MIGRATION_KEY
				},
				{
					store: 1,
					key: REEF_KEYS_MIGRATION_KEY
				},
				{
					store: 2,
					key: REEF_KEYS_KEY
				},
				{
					store: 3,
					key: REEF_REGISTRATION_IDENTITY_KEY
				}
			]);
			assertReefIdentityMigrationComplete(durable, migration);
			const binding = parseReefIdentityBinding(registered);
			if (binding) throw new Error(`Reef identity @${binding.handle} on ${binding.relayUrl} has no stored keys; restore the original keys before registration`);
			if (existing !== void 0) throw new Error("Reef keys already exist in plugin state");
			const keys = generateReefKeys();
			tx.set(2, REEF_KEYS_KEY, keys);
			return keys;
		}
		case "identity.load": {
			const [durable, migration, value] = tx.lookupMany([
				{
					store: 0,
					key: REEF_DURABLE_MIGRATION_KEY
				},
				{
					store: 1,
					key: REEF_KEYS_MIGRATION_KEY
				},
				{
					store: 2,
					key: REEF_KEYS_KEY
				}
			]);
			assertReefIdentityMigrationComplete(durable, migration);
			return value ? parseReefKeys(value) : void 0;
		}
		case "identity.admit": {
			const [durable, migration] = tx.lookupMany([{
				store: 0,
				key: REEF_DURABLE_MIGRATION_KEY
			}, {
				store: 1,
				key: REEF_KEYS_MIGRATION_KEY
			}]);
			assertReefIdentityMigrationComplete(durable, migration);
			return;
		}
		case "review.request": return requestReefReview(tx, 0, command.input.maxEntries, command.input.review);
		case "review.decide": return decideReefReview(tx, 0, command.input.digest, command.input.approved);
		case "review.lookup": return lookupReefReviewDecision(tx, 0, command.input.digest);
		case "review.list": return tx.entries(0).filter((entry) => entry.value.approved === void 0).map((entry) => entry.value.review);
		case "cursor.load": {
			const value = tx.lookup(0, REEF_INBOX_CURSOR_KEY);
			return value === void 0 ? 0 : requireReefInboxCursorRecord(value, command.input).cursor;
		}
		case "cursor.advance": {
			const { cursor } = command.input;
			if (!Number.isSafeInteger(cursor) || cursor < 0) throw new Error("invalid Reef inbox cursor");
			const value = tx.lookup(0, REEF_INBOX_CURSOR_KEY);
			const previous = value === void 0 ? void 0 : requireReefInboxCursorRecord(value, command.input);
			if (!previous || cursor > previous.cursor) tx.set(0, REEF_INBOX_CURSOR_KEY, command.input);
			return;
		}
	}
	return command;
}
//#endregion
export { ReefReviewCapacityError as i, requestReefReview as n, runReefStateOperation as r, lookupReefReviewDecision as t };
