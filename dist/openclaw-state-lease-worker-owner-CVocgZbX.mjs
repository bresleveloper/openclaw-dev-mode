import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/openclaw-state-lease-worker-owner.ts
const owners = resolveGlobalSingleton(Symbol.for("openclaw.stateLeaseWorkerOwners"), () => /* @__PURE__ */ new WeakMap());
function ownershipRefused() {
	throw new OpenClawStateLeaseError("State lease worker ownership was refused", { code: "OPENCLAW_STATE_LEASE_LOST" });
}
function assertSynchronousAuthority(assertion) {
	const result = assertion?.();
	if (isPromiseLike(result)) {
		Promise.resolve(result).catch(() => {});
		throw new Error("State lease worker authority must complete synchronously");
	}
}
function captureLeaseWorkerSource(context, databasePath) {
	const { admission, maintenanceScope, runInCapturedSchemaScope, existingSchemaPath, environment } = context;
	const sourceEnvironment = { ...environment };
	const assertAdmission = admission.assertCurrent;
	const assertMaintenance = maintenanceScope?.assertAdmission;
	const assertMaintenanceOwner = maintenanceScope?.assertOwnerCurrent;
	return () => {
		if (context.admission !== admission || admission.databasePath !== databasePath || admission.assertCurrent !== assertAdmission || context.maintenanceScope !== maintenanceScope || maintenanceScope?.assertAdmission !== assertMaintenance || maintenanceScope?.assertOwnerCurrent !== assertMaintenanceOwner || context.runInCapturedSchemaScope !== runInCapturedSchemaScope || context.existingSchemaPath !== existingSchemaPath || context.environment !== environment || !isDeepStrictEqual(environment, sourceEnvironment)) throw new Error("State lease worker source binding was replaced");
		assertMaintenance?.();
		assertAdmission();
	};
}
function createLeaseAdmissionFactory(scopes, purpose, assertCurrent, beforeCommit, options = {}) {
	const firstScope = scopes[0];
	if (!firstScope) throw new Error("State lease admission requires a retained owner");
	return (retained) => {
		assertCurrent();
		for (const scope of scopes) scope.retainSettlement(retained.settled);
		retained.settled.then((outcome) => {
			for (const scope of scopes) scope.settleNative(retained.settled, outcome);
		});
		let writeStage = "waiting";
		let lifecycleStage = "transaction";
		const lifecycleWrite = purpose === "acquire" || purpose === "renew" || purpose === "release";
		const expiryRequired = purpose === "write" || purpose === "verify" || purpose === "renew";
		return {
			nativeLocations: [...new Set(scopes.map((scope) => scope.databasePath))],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				assertCurrent();
				const facts = request.facts;
				const kind = options.plural ? "state-leases" : purpose === "write" ? "state-lease" : `state-lease-${purpose}`;
				if ((purpose === "write" ? writeStage === "commit" || options.plural && request.stage === "transaction" && writeStage !== "waiting" || request.stage !== "transaction" && !(request.stage === "commit" && writeStage === "transaction") : lifecycleWrite ? request.stage !== lifecycleStage : request.stage !== "transaction") || !isRecord(facts) || facts.kind !== kind) ownershipRefused();
				const members = options.plural ? facts.leases : [facts];
				if (!Array.isArray(members) || members.length !== scopes.length) ownershipRefused();
				const assertFacts = () => {
					const now = Date.now();
					for (const [index, scope] of scopes.entries()) {
						const member = members[index];
						if (!isRecord(member) || !isDeepStrictEqual(member.identity, scope.identity) || expiryRequired && (typeof member.expiresAt !== "number" || !Number.isFinite(member.expiresAt) || member.expiresAt <= now)) ownershipRefused();
					}
				};
				assertFacts();
				if (purpose === "write" && request.stage === "commit") {
					writeStage = "commit";
					beforeCommit?.();
					assertCurrent();
					assertFacts();
				}
				if (grant()) {
					if (lifecycleWrite) lifecycleStage = lifecycleStage === "transaction" ? "commit" : "settled";
					else if (purpose === "write" && request.stage === "transaction") writeStage = "transaction";
				}
			}, options.expiryObservation && (purpose === "acquire" || purpose === "verify" || purpose === "renew") ? {
				kind: "state-lease-expiry",
				identity: firstScope.identity,
				observation: options.expiryObservation
			} : void 0)
		};
	};
}
function runRetainedLeaseScopes(scopes, operation) {
	const result = (async () => {
		try {
			const value = await operation();
			for (const scope of scopes) scope.rethrowIfUncertain(void 0, void 0);
			return value;
		} catch (failure) {
			for (const scope of scopes) scope.rethrowIfUncertain(failure, void 0);
			throw failure;
		} finally {
			for (const scope of scopes) scope.finish();
		}
	})();
	result.catch(() => {});
	return result;
}
/** Registered only by the actual lease owner, never reconstructed from a receipt. */
function createOpenClawStateLeaseWorkerOwner(params) {
	const assertSourceCurrent = params.sourceContext ? captureLeaseWorkerSource(params.sourceContext, params.databasePath) : void 0;
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
		const errors = [...new Set([
			uncertainty,
			failure,
			...authorityError === void 0 ? [] : [authorityError]
		].filter((error) => error !== void 0))];
		if (errors.length === 1) throw uncertainty instanceof Error ? uncertainty : unknownOutcome(uncertainty);
		throw unknownOutcome(createSqliteLifecycleAggregateError(errors, "state lease operation has an unknown write outcome", uncertainty));
	};
	const owner = {
		identity: params.identity,
		sourceContext: params.sourceContext,
		assertSourceCurrent() {
			if (!assertSourceCurrent) throw new Error("State leases require their original shared source context");
			assertSourceCurrent();
		},
		retain(databasePath, purpose, authority) {
			const assertCaller = authority?.assertCurrent;
			assertCurrent(purpose);
			if (!accepting && purpose !== "release" && purpose !== "verify" || databasePath !== params.databasePath) throw new Error("State lease worker operation differs from its live owner");
			const completion = createDeferredCore();
			pending.add(completion.promise);
			let active = true;
			return {
				identity: params.identity,
				databasePath: params.databasePath,
				assertCurrent() {
					assertCurrent(purpose);
					assertCaller?.();
					if (!active) throw new Error("State lease worker operation has settled");
				},
				retainSettlement(settled) {
					settlements.add(settled);
				},
				settleNative(settled, settlement) {
					if (settlement.kind === "unknown") {
						uncertain ??= { error: unknownOutcome(settlement.error) };
						accepting = false;
					}
					settlements.delete(settled);
				},
				rethrowIfUncertain,
				finish() {
					active = false;
					pending.delete(completion.promise);
					completion.resolve();
				}
			};
		},
		run(databasePath, operation, purpose, authority) {
			const beforeCommit = authority?.beforeCommit;
			const scope = owner.retain(databasePath, purpose, authority);
			return runRetainedLeaseScopes([scope], () => operation({
				identity: { ...scope.identity },
				assertCurrent: scope.assertCurrent,
				createAdmission: createLeaseAdmissionFactory([scope], purpose, scope.assertCurrent, beforeCommit, { expiryObservation: params.expiryObservation })
			}));
		}
	};
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
/** Multiple leases authorize one worker operation only from their shared captured source. */
function withOpenClawStateLeasesWorkerAdmission(leases, context, operation, authority) {
	if (leases.length === 0) throw new Error("State lease worker operation requires at least one live lease");
	const assertCaller = authority?.assertCurrent;
	const beforeCommit = authority?.beforeCommit;
	const selected = leases.map((lease) => {
		const owner = owners.get(lease);
		if (!owner || owner.sourceContext !== context) throw new Error("State leases require their original shared source context");
		return owner;
	});
	const keys = new Set(selected.map(({ identity }) => JSON.stringify([identity.scope, identity.key])));
	if (new Set(selected).size !== selected.length || keys.size !== selected.length) throw new Error("State lease worker operation contains duplicate leases");
	const scopes = [];
	const assertCurrent = () => {
		assertSynchronousAuthority(assertCaller);
		for (const scope of scopes) scope.assertCurrent();
		for (const owner of selected) owner.assertSourceCurrent();
	};
	try {
		for (const owner of selected) scopes.push(owner.retain(context.admission.databasePath, "write"));
		assertCurrent();
	} catch (error) {
		for (const scope of scopes) scope.finish();
		throw error;
	}
	return runRetainedLeaseScopes(scopes, () => operation({
		identities: scopes.map(({ identity }) => ({ ...identity })),
		assertCurrent,
		createAdmission: createLeaseAdmissionFactory(scopes, "write", assertCurrent, () => assertSynchronousAuthority(beforeCommit), { plural: true })
	}));
}
//#endregion
export { withOpenClawStateLeaseWorkerAdmission as n, withOpenClawStateLeasesWorkerAdmission as r, createOpenClawStateLeaseWorkerOwner as t };
