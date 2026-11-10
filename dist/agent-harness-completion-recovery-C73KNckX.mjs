import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { f as bindGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { D as readSqliteDatabaseScopedWriteTokenForPath, G as sqliteSessionIdWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as composeSessionSourceAssertion, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { n as captureSessionStoreCandidateIdentities, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { h as normalizeInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { o as createSessionWorkStartChangedError } from "./work-start-error-BI-UhSB2.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as prepareSqliteScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { n as decodeSessionTranscriptWorkerReadError } from "./session-history-worker-errors-D75quOgT.mjs";
import { r as retainSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { i as rethrowIncognitoSessionError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { t as advanceHarnessCompletionClaim } from "./harness-completion-compaction-C4ZByCQk.mjs";
import { n as sourceDeliveryTargetsMatch } from "./source-delivery-plan-iRvDmRJ3.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/agent-harness-completion-scope.ts
const scopeRegistry = resolveGlobalSingleton(Symbol.for("openclaw.agentHarnessCompletionScope.registry"), () => ({ hostIssuedScopes: /* @__PURE__ */ new WeakSet() }));
/** Creates a host-issued requester scope for agent harness completion. */
function createAgentHarnessCompletionScope(params) {
	const requesterSessionKey = params.requesterSessionKey.trim();
	if (!requesterSessionKey) throw new Error("Harness completion scope requires requesterSessionKey");
	const requesterAgentId = params.requesterAgentId?.trim() || parseAgentSessionKey(requesterSessionKey)?.agentId;
	if (!requesterAgentId) throw new Error("Harness completion scope requires an exact requester agent");
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const scope = {
		requesterSessionKey,
		requesterAgentId,
		...requesterOrigin ? { requesterOrigin } : {}
	};
	scopeRegistry.hostIssuedScopes.add(scope);
	bindGatewayContextResolver(scope, params.gatewayContextResolver);
	return scope;
}
function assertAgentHarnessCompletionScope(scope) {
	if (!scopeRegistry.hostIssuedScopes.has(scope)) throw new Error("Harness completion requires a host-issued scope");
	return scope;
}
const sourceAdmissions = resolveGlobalSingleton(Symbol.for("openclaw.harnessCompletionSourceAdmission"), () => new AsyncLocalStorage());
/** The native source owner admits delivery; the requester receipt owns accepted recovery thereafter. */
async function withAgentHarnessCompletionAdmission(params, operation) {
	const scope = assertAgentHarnessCompletionScope(params.scope);
	let active = true;
	const assertCurrent = () => {
		if (!active || !params.isSourceCurrent()) throw new Error("Harness completion source owner retired");
	};
	assertCurrent();
	try {
		return await sourceAdmissions.run({
			...params,
			scope,
			assertCurrent
		}, operation);
	} finally {
		active = false;
	}
}
function assertHarnessCompletionSourceAdmission(params) {
	const admission = sourceAdmissions.getStore();
	if (!admission || admission.scope.requesterSessionKey !== params.requesterSessionKey || admission.scope.requesterAgentId !== params.requesterAgentId || admission.requesterSessionId !== params.requesterSessionId || admission.requesterLifecycleRevision !== params.requesterLifecycleRevision || admission.sourceSessionKey !== params.sourceSessionKey || admission.sourceRunId !== params.sourceRunId) throw new Error("Harness completion requires exact host-issued source admission");
	admission.assertCurrent();
	return admission.assertCurrent;
}
//#endregion
//#region src/agents/agent-harness-completion-recovery.ts
async function readAdmittedHarnessCompletionInputAsync(params) {
	const memory = captureSessionActorStorageOwner({
		sessionKey: params.claim.requesterSessionKey,
		agentId: params.claim.requesterAgentId,
		storePath: params.storePath
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (!memory) return withSessionTranscriptReadSource({
		agentId: params.claim.requesterAgentId,
		sessionKey: params.claim.requesterSessionKey,
		sessionId: params.entry.sessionId,
		storePath: params.storePath
	}, async ({ owner, scope, expectedIdentity, assertCurrent }) => {
		if (!expectedIdentity) return false;
		const snapshot = await owner.readHarnessCompletionSource({
			env: scope.env,
			claim: params.claim,
			source: {
				agentId: scope.agentId,
				path: scope.storePath,
				databaseIdentity: expectedIdentity.key.slice(5),
				databaseBirthtime: expectedIdentity.birthtime
			},
			mode: "committed",
			admission: resolveSessionTranscriptReadFence({
				agentId: params.claim.requesterAgentId,
				sessionId: params.claim.sessionId
			})
		});
		assertCurrent();
		if (snapshot.readError) throw decodeSessionTranscriptWorkerReadError(snapshot.readError);
		return snapshot.entry?.sessionId === params.claim.sessionId && snapshot.validInput;
	});
	const query = {
		type: "session.completion.read",
		input: {
			sourceRunId: params.claim.sourceRunId,
			claim: params.claim,
			mode: "committed",
			admission: resolveSessionTranscriptReadFence({
				agentId: params.claim.requesterAgentId,
				sessionId: params.claim.sessionId
			})
		}
	};
	const snapshot = memory.binding?.actor.target.sessionKey === params.claim.requesterSessionKey ? memory.binding.actor.storage.readCurrent(query, memory.authority) : memory.owner?.readStorage(params.claim.requesterSessionKey, query, memory.authority);
	return snapshot?.entry?.sessionId === params.claim.sessionId && snapshot.validInput;
}
/** These receipts are stricter than legacy live-return classification: omission is not success. */
function hasHarnessCompletionFinalReceipt(receipt) {
	const target = receipt.deliveryContext;
	if (!target?.channel || !target.to || receipt.payloadsTruncated || receipt.messagingToolSentTargetsTruncated || receipt.messagingToolAggregateEvidenceUnaccounted) return false;
	const requiredProvider = normalizeOptionalString(target.channel)?.toLowerCase();
	if (!requiredProvider) return false;
	if (receipt.messagingToolSentTargets?.some((sent) => normalizeOptionalString(sent.provider)?.toLowerCase() === requiredProvider && normalizeOptionalString(sent.accountId) === normalizeOptionalString(target.accountId) && sent.sourceReplyFinal === true && sent.visible === true && sourceDeliveryTargetsMatch(sent, target))) return true;
	return receipt.deliveryStatus?.status === "sent" && (receipt.deliveryStatus.resultCount ?? 0) > 0 && receipt.payloads?.some((payload) => payload.visible === true) === true;
}
const admittedClaims = /* @__PURE__ */ new WeakMap();
function sameCompletionClaim(left, right) {
	return Boolean(left && left.taskId === right.taskId && left.taskRunId === right.taskRunId && left.taskStatus === right.taskStatus && left.sourceRunId === right.sourceRunId && left.requesterSessionKey === right.requesterSessionKey && left.requesterAgentId === right.requesterAgentId && left.sessionId === right.sessionId && left.lifecycleRevision === right.lifecycleRevision);
}
function captureHarnessCompletionRecovery(params) {
	const provenance = normalizeInputProvenance(params.inputProvenance);
	if (!params.runId.startsWith("announce:") || provenance?.kind !== "inter_session" || !["agent_harness_task", "agent_harness_completion"].includes(provenance.sourceTool ?? "") || provenance.sourceChannel !== "internal" || !provenance.sourceSessionKey) return;
	const assertSourceCurrent = assertHarnessCompletionSourceAdmission({
		requesterSessionKey: params.sessionKey,
		requesterAgentId: params.agentId,
		requesterSessionId: params.entry.sessionId,
		requesterLifecycleRevision: params.entry.lifecycleRevision,
		sourceSessionKey: provenance.sourceSessionKey,
		sourceRunId: params.runId
	});
	const claim = {
		taskId: provenance.sourceSessionKey,
		taskRunId: provenance.sourceSessionKey,
		taskStatus: "succeeded",
		sourceRunId: params.runId,
		requesterSessionKey: params.sessionKey,
		requesterAgentId: params.agentId,
		sessionId: params.entry.sessionId,
		...params.entry.lifecycleRevision ? { lifecycleRevision: params.entry.lifecycleRevision } : {}
	};
	admittedClaims.set(claim, assertSourceCurrent);
	return claim;
}
/** A current session incarnation and its exact admitted completion receipt own further effects. */
function getOwedHarnessCompletionTask(claim, entry) {
	if (entry.sessionId !== claim.sessionId || entry.lifecycleRevision !== claim.lifecycleRevision) return;
	if (entry.restartRecoveryHarnessCompletion && !sameCompletionClaim(entry.restartRecoveryHarnessCompletion, claim)) return;
	if (entry.restartRecoveryTerminalDeliveryEvidence?.some((receipt) => sameCompletionClaim(receipt.harnessCompletion, claim) && hasHarnessCompletionFinalReceipt(receipt))) return;
	if (sameCompletionClaim(entry.restartRecoveryHarnessCompletion, claim) || entry.restartRecoveryTerminalDeliveryEvidence?.some((receipt) => sameCompletionClaim(receipt.harnessCompletion, claim))) return claim;
	const assertSourceCurrent = admittedClaims.get(claim);
	if (!assertSourceCurrent) return;
	try {
		assertSourceCurrent();
		return claim;
	} catch (error) {
		rethrowIncognitoSessionError(error);
		return;
	}
}
/** The existing admitted execution guard rechecks this before execution and delegated effects. */
function createHarnessCompletionSourceAssertion(params) {
	let claim = params.claim;
	const onSessionCompactionCommitted = (transition, entry) => {
		const next = advanceHarnessCompletionClaim(claim, transition);
		if (!next && claim.sessionId === transition.current.sessionId && claim.lifecycleRevision === transition.current.lifecycleRevision && isDeepStrictEqual(entry.restartRecoveryHarnessCompletion, claim)) return;
		if (!next || entry.sessionId !== transition.current.sessionId || entry.lifecycleRevision !== transition.current.lifecycleRevision || !isDeepStrictEqual(entry.restartRecoveryHarnessCompletion, next)) throw createSessionWorkStartChangedError(claim.requesterSessionKey);
		claim = next;
	};
	const target = {
		agentId: claim.requesterAgentId,
		sessionKey: claim.requesterSessionKey,
		storePath: params.storePath
	};
	const memory = captureSessionActorStorageOwner(target, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		const assertCurrent = () => {
			const query = {
				type: "session.completion.read",
				input: {
					sourceRunId: claim.sourceRunId,
					claim,
					mode: params.mode,
					admission: resolveSessionTranscriptReadFence({
						agentId: target.agentId,
						sessionId: claim.sessionId
					})
				}
			};
			const snapshot = memory.binding?.actor.target.sessionKey === target.sessionKey ? memory.binding.actor.storage.readCurrent(query, memory.authority) : memory.owner?.readStorage(target.sessionKey, query, memory.authority);
			if (!snapshot?.entry || !snapshot.validInput || !getOwedHarnessCompletionTask(claim, snapshot.entry)) throw createSessionWorkStartChangedError(target.sessionKey);
		};
		const prepare = async () => {
			const preparedClaim = claim;
			return {
				assertCurrent() {
					if (claim !== preparedClaim) throw createSessionWorkStartChangedError(target.sessionKey);
					assertCurrent();
				},
				checks: []
			};
		};
		return composeSessionSourceAssertion([params.priorAssertion, Object.assign(assertCurrent, {
			onSessionCompactionCommitted,
			prepareSessionSource: prepare,
			prepareSessionSourceScope: prepare
		})]);
	}
	const refuse = () => {
		throw createSessionWorkStartChangedError(target.sessionKey);
	};
	const prepareSnapshot = (preparedClaim, snapshot, source, assertStorageCurrent, release) => {
		assertStorageCurrent();
		if (claim !== preparedClaim || !snapshot.entry || !getOwedHarnessCompletionTask(preparedClaim, snapshot.entry)) refuse();
		if (snapshot.readError) throw decodeSessionTranscriptWorkerReadError(snapshot.readError);
		if (!snapshot.validInput) refuse();
		const fields = [
			"sessionId",
			"lifecycleRevision",
			"restartRecoveryHarnessCompletion",
			"restartRecoveryTerminalDeliveryEvidence"
		];
		const retained = retainPreparedSessionEntryPredicate({
			databaseIdentity: `file:${source.databaseIdentity}`,
			sessionKey: target.sessionKey,
			entry: snapshot.entry,
			matches: (before, after) => fields.every((field) => isDeepStrictEqual(before?.[field], after?.[field]))
		});
		return {
			assertCurrent() {
				assertStorageCurrent();
				if (claim !== preparedClaim || !retained.isCurrent() || !snapshot.entry || !getOwedHarnessCompletionTask(preparedClaim, snapshot.entry)) refuse();
			},
			checks: [{
				predicate: {
					source,
					sessionKey: target.sessionKey,
					fields: [...fields],
					expected: snapshot.entry,
					...snapshot.version ? { transcript: {
						sessionId: preparedClaim.sessionId,
						version: snapshot.version
					} } : {}
				},
				refuse
			}],
			release: () => releaseSessionSourceAuthorities([retained, { release }])
		};
	};
	const assertSource = () => {};
	const prepareSessionSource = async (checkWriteToken = false) => {
		const preparedClaim = claim;
		const env = captureSessionTranscriptStorageEnvironment(process.env);
		const candidates = captureSessionStoreReadCandidates(params.storePath);
		const identities = captureSessionStoreCandidateIdentities(candidates);
		const admission = resolveSessionTranscriptReadFence({
			agentId: preparedClaim.requesterAgentId,
			sessionId: preparedClaim.sessionId
		});
		const resolved = await prepareSqliteScope({
			agentId: preparedClaim.requesterAgentId,
			sessionKey: preparedClaim.requesterSessionKey,
			storePath: params.storePath,
			env
		});
		const options = toDatabaseOptions(resolved);
		const path = resolveOpenClawAgentSqlitePath(options);
		const identity = identities.get(assertSessionStoreReadCandidate(path, candidates));
		if (!identity?.key.startsWith("file:")) return refuse();
		const source = {
			agentId: options.agentId,
			path,
			databaseIdentity: identity.key.slice(5),
			databaseBirthtime: identity.birthtime
		};
		const retained = retainSessionHistoryWorkerDatabase({
			...options,
			path
		});
		try {
			const writeScopes = [target.sessionKey, sqliteSessionIdWriteScope(preparedClaim.sessionId)];
			const snapshot = await retained.owner.readHarnessCompletionSource({
				env,
				claim: preparedClaim,
				mode: params.mode,
				source,
				...admission ? { admission } : {}
			});
			return prepareSnapshot(preparedClaim, snapshot, source, () => {
				retained.owner.assertCurrent();
				assertSessionStoreReadCandidate(path, candidates);
				assertExistingDatabaseIdentity(path, identity.key, identity.birthtime);
				if (checkWriteToken && (snapshot.writeToken === void 0 || readSqliteDatabaseScopedWriteTokenForPath(path, writeScopes) !== snapshot.writeToken)) refuse();
			}, retained.release);
		} catch (error) {
			await releaseSessionSourceAuthorities([retained], [error]);
			throw error;
		}
	};
	return composeSessionSourceAssertion([params.priorAssertion, Object.assign(assertSource, {
		onSessionCompactionCommitted,
		prepareSessionSourceScope: () => prepareSessionSource(true),
		prepareSessionSource
	})]);
}
//#endregion
export { readAdmittedHarnessCompletionInputAsync as a, withAgentHarnessCompletionAdmission as c, hasHarnessCompletionFinalReceipt as i, createHarnessCompletionSourceAssertion as n, assertAgentHarnessCompletionScope as o, getOwedHarnessCompletionTask as r, createAgentHarnessCompletionScope as s, captureHarnessCompletionRecovery as t };
