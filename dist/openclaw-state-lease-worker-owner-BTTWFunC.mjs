import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-BXipLxiQ.mjs";
import { i as SqliteWorkerError } from "./sqlite-worker-contract-DgNznZvn.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/openclaw-state-lease-worker-owner.ts
const owners = resolveGlobalSingleton(Symbol.for("openclaw.stateLeaseWorkerOwners"), () => /* @__PURE__ */ new WeakMap());
function assertLeaseFactExpiry(purpose, expiresAt) {
	if ((purpose === "write" || purpose === "verify" || purpose === "renew") && (typeof expiresAt !== "number" || !Number.isFinite(expiresAt) || expiresAt <= Date.now())) throw new OpenClawStateLeaseError("State lease worker ownership was refused", { code: "OPENCLAW_STATE_LEASE_LOST" });
}
/** Registered only by the actual lease owner, never reconstructed from a receipt. */
function createOpenClawStateLeaseWorkerOwner(params) {
	const pending = /* @__PURE__ */ new Set();
	const settlements = /* @__PURE__ */ new Set();
	let accepting = true;
	let closed = false;
	let uncertain;
	const unknownOutcome = (cause) => Object.assign(new SqliteWorkerError("State lease worker transaction outcome is unknown", "outcome-unknown"), { cause });
	const assertCurrent = (purpose) => {
		if (uncertain) throw uncertain.error;
		if (closed) throw new OpenClawStateLeaseError("State lease worker admission is closed", { code: "OPENCLAW_STATE_LEASE_LOST" });
		params.assertCurrent(purpose);
	};
	const rethrowIfUncertain = (failure, authorityError) => {
		const uncertainty = uncertain?.error ?? collectNestedErrorCandidates(failure).find((candidate) => extractErrorCode(candidate) === "outcome-unknown");
		if (uncertainty === void 0) return;
		const errors = [.../* @__PURE__ */ new Set([
			uncertainty,
			failure,
			...authorityError === void 0 ? [] : [authorityError]
		])];
		if (errors.length === 1) throw uncertainty instanceof Error ? uncertainty : unknownOutcome(uncertainty);
		throw unknownOutcome(createSqliteLifecycleAggregateError(errors, "state lease operation has an unknown write outcome", uncertainty));
	};
	const owner = { run(databasePath, operation, purpose, authority) {
		const assertCaller = authority?.assertCurrent;
		const beforeCommit = authority?.beforeCommit;
		assertCurrent(purpose);
		if (!accepting && purpose !== "release" && purpose !== "verify" || databasePath !== params.databasePath) throw new Error("State lease worker operation differs from its live owner");
		let active = true;
		const assertScope = () => {
			assertCurrent(purpose);
			assertCaller?.();
			if (!active) throw new Error("State lease worker operation has settled");
		};
		const createAdmission = (retained) => {
			assertScope();
			settlements.add(retained.settled);
			retained.settled.then((settlement) => {
				if (settlement.kind === "unknown") {
					uncertain ??= { error: unknownOutcome(settlement.error) };
					accepting = false;
				}
				settlements.delete(retained.settled);
			});
			let writeStage = "waiting";
			let lifecycleStage = "transaction";
			const lifecycleWrite = purpose === "acquire" || purpose === "renew" || purpose === "release";
			return {
				nativeLocations: [params.databasePath],
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					assertScope();
					const facts = request.facts;
					if ((purpose === "write" ? writeStage === "commit" || request.stage !== "transaction" && !(request.stage === "commit" && writeStage === "transaction") : lifecycleWrite ? request.stage !== lifecycleStage : request.stage !== "transaction") || !isRecord(facts) || facts.kind !== (purpose === "write" ? "state-lease" : `state-lease-${purpose}`) || !isDeepStrictEqual(facts.identity, params.identity)) throw new OpenClawStateLeaseError("State lease worker ownership was refused", { code: "OPENCLAW_STATE_LEASE_LOST" });
					const expiresAt = facts.expiresAt;
					if (purpose === "write" && request.stage === "commit") {
						assertLeaseFactExpiry(purpose, expiresAt);
						writeStage = "commit";
						beforeCommit?.();
						assertScope();
					}
					assertLeaseFactExpiry(purpose, expiresAt);
					if (grant()) {
						if (lifecycleWrite) lifecycleStage = lifecycleStage === "transaction" ? "commit" : "settled";
						else if (purpose === "write" && request.stage === "transaction") writeStage = "transaction";
					}
				}, params.expiryObservation && (purpose === "acquire" || purpose === "verify" || purpose === "renew") ? {
					kind: "state-lease-expiry",
					identity: params.identity,
					observation: params.expiryObservation
				} : void 0)
			};
		};
		const result = (async () => {
			try {
				return await operation({
					identity: { ...params.identity },
					assertCurrent: assertScope,
					createAdmission
				});
			} finally {
				active = false;
			}
		})().then((value) => {
			if (uncertain) rethrowIfUncertain(uncertain.error, void 0);
			return value;
		}, (failure) => {
			rethrowIfUncertain(failure, void 0);
			throw failure;
		});
		pending.add(result);
		result.then(() => pending.delete(result), () => pending.delete(result));
		return result;
	} };
	let boundLease = params.lease;
	if (boundLease) owners.set(boundLease, owner);
	const settle = async () => {
		accepting = false;
		await Promise.allSettled(pending);
		await Promise.allSettled(settlements);
	};
	return {
		bind(lease) {
			if (closed || boundLease) throw new Error("State lease worker owner is already bound or closed");
			boundLease = lease;
			owners.set(lease, owner);
		},
		runLifecycle(purpose, operation) {
			return owner.run(params.databasePath, operation, purpose);
		},
		run(operation) {
			return owner.run(params.databasePath, operation, "write");
		},
		canRelease: () => pending.size === 0 && settlements.size === 0 && !uncertain,
		settle,
		rethrowIfUncertain,
		async drain() {
			await settle();
			if (uncertain) throw uncertain.error;
		},
		close() {
			accepting = false;
			closed = true;
			if (boundLease) owners.delete(boundLease);
		}
	};
}
function withOpenClawStateLeaseWorkerAdmission(lease, databasePath, operation, authority) {
	const owner = owners.get(lease);
	if (!owner) throw new Error("State lease worker operation requires its original live lease context");
	return owner.run(databasePath, operation, "write", authority);
}
//#endregion
export { withOpenClawStateLeaseWorkerAdmission as n, createOpenClawStateLeaseWorkerOwner as t };
