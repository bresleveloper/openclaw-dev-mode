import { n as prepareGatewayContextBindingOwner } from "./gateway-context-binding-owner-bQvbtsTz.mjs";
import { O as validateAgentRunDelegatedAuthority, d as getAgentRunLifecycleGeneration, i as claimAgentRunDelegatedAuthority, x as releaseAgentRunDelegatedAuthority } from "./agent-run-registry-DO6Dg2r0.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import { c as executionIdentitySpawnAdmission, n as createExecutionIdentityAdmissionToken, r as enqueueExecutionIdentityContextAtAdmission } from "./execution-identity-admission-3hhMmAVK.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/admitted-run-context.ts
/** Canonical operational instance and optional enabled execution-identity evidence. */
const operatorAuthorityIssuers = /* @__PURE__ */ new WeakSet();
/** Host-only construction; public reply options cannot manufacture a source capability. */
function createAdmittedRunOperatorAuthority(source) {
	const check = source.assertCurrent;
	const signal = source.signal;
	let revoked = false;
	const authority = Object.freeze({
		profileId: source.profileId,
		scopes: Object.freeze([...source.scopes]),
		gatewayAccessGrant: source.gatewayAccessGrant ? Object.freeze({ ...source.gatewayAccessGrant }) : source.gatewayAccessGrant,
		source: source.source ?? Object.freeze({}),
		signal,
		retain: source.retain,
		assertCurrent: () => {
			if (revoked) throw new Error("operator execution authority is no longer active");
			try {
				signal?.throwIfAborted();
				check();
			} catch (error) {
				revoked = true;
				throw error;
			}
		}
	});
	operatorAuthorityIssuers.add(authority);
	return authority;
}
function assertAdmittedRunOperatorAuthority(authority) {
	if (!authority || typeof authority !== "object" || !operatorAuthorityIssuers.has(authority)) throw new Error("operator run authority must be issued by the host");
}
const delegatedAuthorityLeases = /* @__PURE__ */ new WeakMap();
const admittedContextsByAuthority = /* @__PURE__ */ new WeakMap();
const activeNativeHookRecoveryLeases = /* @__PURE__ */ new Map();
function bindAdmittedRunDelegatedAuthority(context, assertSourceCurrent, operatorAuthority) {
	const authority = claimAgentRunDelegatedAuthority(context.operationalRunInstance, assertSourceCurrent);
	const previousRecovery = activeNativeHookRecoveryLeases.get(context.operationalRunInstance.runId);
	activeNativeHookRecoveryLeases.delete(context.operationalRunInstance.runId);
	previousRecovery?.releaseOperatorAuthority?.();
	const lease = {
		authority,
		foregroundClosed: false,
		assertSourceCurrent,
		operatorAuthority
	};
	delegatedAuthorityLeases.set(context, lease);
	if (!admittedContextsByAuthority.has(authority)) admittedContextsByAuthority.set(authority, context);
}
/** Reads the immutable outer-run authority without reviving a closed claim. */
function getAdmittedRunDelegatedAuthority(context) {
	const lease = delegatedAuthorityLeases.get(context);
	return lease && !lease.foregroundClosed && validateAgentRunDelegatedAuthority(lease.authority) ? lease.authority : void 0;
}
/** Captures the operator's source lifetime from a live run, including for detached children. */
function readAdmittedRunOperatorAuthority(context) {
	if (!context) return;
	const operatorAuthority = delegatedAuthorityLeases.get(context)?.operatorAuthority;
	if (!operatorAuthority) return;
	if (!getAdmittedRunDelegatedAuthority(context)) throw new Error("admitted run operator authority is no longer active");
	return operatorAuthority;
}
/** Reads the same source ceiling used by admission without minting run authority. */
function readPreparedRunOperatorAuthority(prepared) {
	const authority = prepared?.readOperatorAuthority?.();
	if (authority !== void 0) assertAdmittedRunOperatorAuthority(authority);
	return authority;
}
/** Reads the original admission source only through its exact live authority. */
function getAdmittedRunSource(authority) {
	const context = authority && admittedContextsByAuthority.get(authority);
	return context && getAdmittedRunDelegatedAuthority(context) === authority ? context.admissionSource : void 0;
}
/** Captures an exact admitted-run assertion for work that may cross an await boundary. */
function resolveAdmittedRunActiveAssertion(context, signal) {
	const operationalRunInstance = context.operationalRunInstance;
	const authority = getAdmittedRunDelegatedAuthority(context);
	if (!authority) return;
	return () => {
		if (signal?.aborted || context.operationalRunInstance !== operationalRunInstance || getAdmittedRunDelegatedAuthority(context) !== authority) throw new Error("admitted run authority is no longer active");
	};
}
/** Idempotently compare-releases the authority captured by this admission. */
function closeAdmittedRunDelegatedAuthority(context) {
	const lease = delegatedAuthorityLeases.get(context);
	if (!lease || lease.foregroundClosed) return false;
	lease.foregroundClosed = true;
	releaseAgentRunDelegatedAuthority(lease.authority);
	return true;
}
/** Recovery-only lease for the already-created native pre-tool policy callback. */
function retainAdmittedRunBeforeToolCallRecovery(context) {
	const lease = delegatedAuthorityLeases.get(context);
	const runId = context.operationalRunInstance.runId;
	if (!lease || lease.foregroundClosed || activeNativeHookRecoveryLeases.has(runId) || !validateAgentRunDelegatedAuthority(lease.authority)) return;
	const recovery = {
		lease,
		releaseOperatorAuthority: lease.operatorAuthority?.retain?.()
	};
	activeNativeHookRecoveryLeases.set(runId, recovery);
	const assertActive = () => {
		lease.assertSourceCurrent?.();
		if (getAgentRunLifecycleGeneration() !== lease.authority.lifecycleGeneration || activeNativeHookRecoveryLeases.get(runId) !== recovery) throw new Error("admitted run native hook recovery is no longer active");
	};
	return Object.freeze({
		assertActive,
		release: () => {
			if (activeNativeHookRecoveryLeases.get(runId) === recovery) {
				activeNativeHookRecoveryLeases.delete(runId);
				recovery.releaseOperatorAuthority?.();
			}
		}
	});
}
/** Creates a one-shot recovery admission owned by the durable recovery resolver. */
function createExecutionIdentityRecoveryAdmission(params) {
	let consumed = false;
	return Object.freeze({
		retryOnly: params.retryOnly,
		consume: (runId) => {
			if (consumed) return Object.freeze({ accepted: false });
			consumed = true;
			if (params.expectedOperationalRunId !== void 0 && params.expectedOperationalRunId !== runId) return Object.freeze({ accepted: false });
			const token = params.expectedOperationalRunId !== void 0 || params.token?.runId === runId ? params.token : void 0;
			return Object.freeze({
				accepted: true,
				...token ? { token } : {}
			});
		}
	});
}
function createOperationalRunInstanceRef(runId) {
	return Object.freeze({
		instanceId: randomUUID(),
		runId
	});
}
/** Prepares a system-owned run without selecting its eventual execution runtime early. */
function prepareSystemAgentRunAdmission(cfg, runId, agentId, boundary, assertSourceCurrent, operatorAuthority) {
	return prepareAgentRunAdmission({
		cfg,
		operationalRunInstance: createOperationalRunInstanceRef(runId),
		assertSourceCurrent,
		operatorAuthority,
		facts: {
			runId,
			agentId,
			ingress: {
				kind: "system",
				boundary,
				state: "present"
			}
		}
	});
}
/**
* Freezes ingress facts before preparation while deferring allocation/capture until the
* authoritative runtime owner is selected immediately before execution.
*/
function prepareAgentRunAdmission(params) {
	const operationalRunInstance = params.operationalRunInstance;
	if (operationalRunInstance.runId !== params.facts.runId) throw new Error("operational run instance disagrees with prepared admission");
	const sourceAssertion = params.assertSourceCurrent;
	const operatorAuthority = params.operatorAuthority;
	if (operatorAuthority !== void 0) assertAdmittedRunOperatorAuthority(operatorAuthority);
	const assertOperatorCurrent = operatorAuthority?.assertCurrent;
	const releaseOperatorAuthority = operatorAuthority?.retain?.();
	let sourceClosed = false;
	const assertSourceCurrent = (sourceAssertion || assertOperatorCurrent) && (() => {
		if (sourceClosed) throw new Error("source execution authority is no longer active");
		try {
			sourceAssertion?.();
			assertOperatorCurrent?.();
		} catch (error) {
			sourceClosed = true;
			throw error;
		}
	});
	let admittedRuntimeKind;
	let admittedRuntimeInstanceId;
	let admitted;
	let admittedContext;
	let closed = false;
	return Object.freeze({
		operationalRunInstance,
		assertSourceCurrent: () => assertSourceCurrent?.(),
		readOperatorAuthority: () => {
			if (operatorAuthority) {
				if (closed) throw new Error("prepared operator authority is no longer active");
				operatorAuthority.assertCurrent();
			}
			return operatorAuthority;
		},
		close: () => {
			if (closed) return;
			closed = true;
			if (admittedContext) closeAdmittedRunDelegatedAuthority(admittedContext);
			else admitted?.then(closeAdmittedRunDelegatedAuthority).catch(() => void 0);
			releaseOperatorAuthority?.();
		},
		admit: (runtimeKind, runtimeInstanceId) => {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("prepared execution context is already closed"));
			const fixedRuntimeKind = admittedRuntimeKind ??= runtimeKind;
			admittedRuntimeInstanceId ??= runtimeInstanceId?.trim() || void 0;
			admitted ??= (async () => {
				assertSourceCurrent?.();
				const facts = executionIdentitySpawnAdmission({
					operation: "attach",
					value: {
						...params.facts,
						runtime: { kind: fixedRuntimeKind }
					},
					extra: executionIdentitySpawnAdmission({
						operation: "read",
						value: params.facts
					})
				});
				const context = admitPreparedAgentRun({
					cfg: params.cfg,
					admissionSource: params.admissionSource,
					facts,
					operationalRunInstance,
					runtimeInstanceId: admittedRuntimeInstanceId,
					...params.recovery ? { recovery: params.recovery } : {}
				});
				bindAdmittedRunDelegatedAuthority(context, assertSourceCurrent, operatorAuthority);
				admittedContext = context;
				try {
					await params.onAdmitted?.(context);
					if (closed || !getAdmittedRunDelegatedAuthority(context)) throw new Error("prepared execution authority closed during admission");
					return context;
				} catch (error) {
					closeAdmittedRunDelegatedAuthority(context);
					throw error;
				}
			})();
			return admitted;
		}
	});
}
/** Resolves a host-only continuation or validates an already-admitted internal caller. */
async function resolvePreparedRunAdmission(params) {
	if (params.admittedRunContext && params.preparedRunAdmission) throw new Error("run cannot carry both prepared and admitted execution contexts");
	const admitted = params.preparedRunAdmission ? await params.preparedRunAdmission.admit(params.runtimeKind, params.runtimeInstanceId) : params.admittedRunContext;
	if (!admitted || admitted.operationalRunInstance.runId !== params.runId) throw new Error("prepared execution context is unavailable or disagrees with the run");
	if (delegatedAuthorityLeases.get(admitted) && !getAdmittedRunDelegatedAuthority(admitted)) throw new Error("prepared execution authority is no longer active");
	return admitted;
}
function consumeRecoveryAdmission(params) {
	const consumed = typeof params.admission?.consume === "function" ? params.admission.consume(params.runId) : Object.freeze({ accepted: false });
	const token = consumed.token;
	if (!token) return consumed;
	return Object.freeze({
		accepted: consumed.accepted,
		token: Object.isFrozen(token) ? token : Object.freeze(token)
	});
}
/**
* Owns the single post-prepare allocation/adoption/capture decision for an execution.
* Queue loss remains audit loss only; the admitted execution keeps its exact token object.
*/
function admitPreparedAgentRun(params) {
	if (params.operationalRunInstance.runId !== params.facts.runId) throw new Error("operational run instance disagrees with prepared admission");
	const admitted = {
		operationalRunInstance: params.operationalRunInstance,
		...params.admissionSource ? { admissionSource: params.admissionSource } : {}
	};
	const recovery = consumeRecoveryAdmission({
		admission: params.recovery,
		runId: params.facts.runId
	});
	if (!isExecutionIdentityCollectionEnabled(params.cfg)) return Object.freeze(prepareGatewayContextBindingOwner(admitted));
	const executionIdentityToken = recovery.token ?? (!params.recovery || recovery.accepted && !params.recovery.retryOnly ? createExecutionIdentityAdmissionToken(params.facts.runId) : void 0);
	if (!executionIdentityToken) return Object.freeze(prepareGatewayContextBindingOwner(admitted));
	enqueueExecutionIdentityContextAtAdmission(params.facts, {
		enabled: true,
		token: executionIdentityToken,
		runtimeInstanceId: params.runtimeInstanceId,
		retryOnly: params.recovery?.retryOnly === true
	});
	return Object.freeze(prepareGatewayContextBindingOwner({
		...admitted,
		executionIdentityToken
	}));
}
//#endregion
export { createOperationalRunInstanceRef as a, prepareAgentRunAdmission as c, readPreparedRunOperatorAuthority as d, resolveAdmittedRunActiveAssertion as f, createExecutionIdentityRecoveryAdmission as i, prepareSystemAgentRunAdmission as l, retainAdmittedRunBeforeToolCallRecovery as m, closeAdmittedRunDelegatedAuthority as n, getAdmittedRunDelegatedAuthority as o, resolvePreparedRunAdmission as p, createAdmittedRunOperatorAuthority as r, getAdmittedRunSource as s, assertAdmittedRunOperatorAuthority as t, readAdmittedRunOperatorAuthority as u };
