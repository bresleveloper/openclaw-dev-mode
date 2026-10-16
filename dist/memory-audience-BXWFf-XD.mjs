import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { i as prepareSessionGenerationFacts, t as isSessionDeliveryGenerationRevokedError } from "./session-delivery-generation-C13fsg_O.mjs";
//#region src/plugins/memory-audience.ts
const MAX_LINEAGE_HOPS = 64;
const SESSION_ID_PATTERN = /^[a-f0-9-]{36}$/;
const hostAudiences = /* @__PURE__ */ new WeakSet();
const audienceRecords = /* @__PURE__ */ new WeakMap();
const audienceSessionKeys = /* @__PURE__ */ new WeakMap();
function releaseRecordLeases(record) {
	for (const lease of record.leases.splice(0)) lease.release();
}
const collectedAudienceRecords = new FinalizationRegistry((record) => {
	for (let current = record; current; current = current.parent) {
		current.holders -= 1;
		if (current.holders > 0) return;
		releaseRecordLeases(current);
	}
});
function isAgentSessionKey(sessionKey, agentId) {
	return parseAgentSessionKey(sessionKey)?.agentId === agentId;
}
function isSessionId(sessionId) {
	return typeof sessionId === "string" && SESSION_ID_PATTERN.test(sessionId);
}
function resolveGenerationStorePath(agentId, sessionKey, storePath) {
	return isIncognitoSessionKey(sessionKey) ? resolveIncognitoOpenClawAgentSqlitePath({ agentId }) : storePath;
}
async function readEntryInWorker(params) {
	const read = await withSessionEntryReadOnlyInWorker({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params.assertCallerCurrent, async (result) => result);
	if (!read.ok) throw read.error;
	return read.value;
}
async function leaseSessionGeneration(params) {
	try {
		return await prepareSessionGenerationFacts({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: resolveGenerationStorePath(params.agentId, params.sessionKey, params.storePath),
			sessionId: params.entry?.sessionId ?? null,
			lifecycleRevision: params.entry?.lifecycleRevision ?? null
		});
	} catch (error) {
		if (isSessionDeliveryGenerationRevokedError(error)) return;
		throw error;
	}
}
function assertRecordCurrent(record) {
	for (let current = record; current; current = current.parent) {
		if (current.state === "released") throw new Error("memory audience was released by its owner");
		if (current.state === "stale") throw new Error("memory audience is no longer current");
		for (const lease of current.leases) try {
			lease.assertCurrent();
		} catch (error) {
			if (isSessionDeliveryGenerationRevokedError(error)) {
				current.state = "stale";
				releaseRecordLeases(current);
				throw new Error("memory audience is no longer current", { cause: error });
			}
			throw new Error("memory audience currency is unavailable; retry the operation", { cause: error });
		}
	}
}
function mintMemoryAudience(audience, sessionKey, record) {
	const frozen = Object.freeze(audience);
	hostAudiences.add(frozen);
	audienceRecords.set(frozen, record);
	audienceSessionKeys.set(frozen, sessionKey);
	for (let current = record; current; current = current.parent) current.holders += 1;
	collectedAudienceRecords.register(frozen, record);
	return {
		audience: frozen,
		release: () => {
			if (record.state !== "current") return;
			record.state = "released";
			releaseRecordLeases(record);
		}
	};
}
/**
* Resolve from the current entry already admitted by the host turn owner.
* Parent rows are read on the read-only worker; every hop holds a session
* generation lease that is rechecked after the final await, before minting.
*/
async function resolveMemoryAudienceFromEntry(params, admittedEntry) {
	let { sessionKey, sessionId, senderIsOwner } = params;
	const { agentId, storePath } = params;
	const assertCallerCurrent = params.assertCallerCurrent ?? (() => {});
	const seen = /* @__PURE__ */ new Set();
	const record = {
		leases: [],
		state: "current",
		holders: 0
	};
	let requiredLifecycleRevision;
	const deny = (reason, legacyLineage) => {
		releaseRecordLeases(record);
		return {
			status: "denied",
			reason,
			...legacyLineage ? { legacyLineage } : {}
		};
	};
	try {
		for (let depth = 0; depth < MAX_LINEAGE_HOPS; depth += 1) {
			if (!isAgentSessionKey(sessionKey, agentId) || !isSessionId(sessionId) || seen.has(sessionKey)) return deny(`session lineage at ${sessionKey} is malformed, cyclic, or cross-agent`);
			seen.add(sessionKey);
			const entry = depth === 0 ? admittedEntry : await readEntryInWorker({
				agentId,
				sessionKey,
				storePath,
				assertCallerCurrent
			});
			if (!entry || entry.sessionId !== sessionId || depth > 0 && entry.lifecycleRevision !== requiredLifecycleRevision) return deny(`session ${sessionKey} is missing or no longer matches its recorded lineage`);
			const lease = await leaseSessionGeneration({
				agentId,
				sessionKey,
				storePath,
				entry
			});
			if (!lease) return deny(`session ${sessionKey} changed while its memory audience was resolved`);
			record.leases.push(lease);
			if (entry.spawnedBy !== void 0) {
				if (typeof entry.spawnedBySenderIsOwner !== "boolean") return deny(`spawned session ${sessionKey} predates memory lineage receipts (spawnedBySenderIsOwner), so it has no inherited memory audience. Respawn it from its parent session to restore memory access.`, true);
				if (!entry.spawnedBy || entry.parentSessionKey !== void 0 && entry.parentSessionKey !== entry.spawnedBy || !isSessionId(entry.spawnedBySessionId) || entry.parentSessionLifecycleRevision === "") return deny(`spawned session ${sessionKey} has malformed lineage receipts`);
				sessionKey = entry.spawnedBy;
				sessionId = entry.spawnedBySessionId;
				requiredLifecycleRevision = entry.parentSessionLifecycleRevision;
				senderIsOwner = entry.spawnedBySenderIsOwner;
				continue;
			}
			assertCallerCurrent();
			assertRecordCurrent(record);
			if (entry.chatType === "direct" && senderIsOwner === true) return {
				status: "granted",
				...mintMemoryAudience({
					kind: "owner-private",
					agentId
				}, params.sessionKey, record)
			};
			if (entry.chatType === "direct" || entry.chatType === "group" || entry.chatType === "channel") return {
				status: "granted",
				...mintMemoryAudience({
					kind: "conversation",
					agentId,
					sessionKey,
					sessionId
				}, params.sessionKey, record)
			};
			return deny(`root session ${sessionKey} has no durable chat type`);
		}
		return deny(`session lineage exceeds ${MAX_LINEAGE_HOPS} hops`);
	} catch (error) {
		releaseRecordLeases(record);
		assertCallerCurrent();
		return deny(`session storage could not verify the lineage: ${formatErrorMessage(error)}`);
	}
}
/** Return whether a memory audience was minted by this host process. */
function isHostMemoryAudience(value) {
	return typeof value === "object" && value !== null && hostAudiences.has(value);
}
/** Reject an audience presented outside its host-bound invocation session. */
function assertMemoryAudienceSession(audience, sessionKey) {
	if (!isHostMemoryAudience(audience)) throw new Error("memory audience was not minted by this host");
	if (audienceSessionKeys.get(audience) !== sessionKey) throw new Error("memory audience is bound to a different session");
}
/**
* Bind a child audience to the child session's current incarnation and to the
* parent's lineage, so a child reset or reassignment rejects it before provider I/O.
* A detached child has no row; its grant binds that absence instead.
*/
async function delegateMemoryAudience(audience, child) {
	assertMemoryAudienceCurrent(audience);
	const parent = audienceRecords.get(audience);
	const { agentId } = audience;
	const assertCallerCurrent = child.assertCallerCurrent ?? (() => {});
	if (!isAgentSessionKey(child.sessionKey, agentId)) throw new Error("memory audience delegation requires a session for the same agent");
	const entry = await readEntryInWorker({
		agentId,
		sessionKey: child.sessionKey,
		storePath: child.storePath,
		assertCallerCurrent
	});
	if (entry ? typeof entry.sessionId !== "string" || entry.sessionId.length === 0 : child.detached !== true) throw new Error(`memory audience delegation requires an existing child session: ${child.sessionKey}`);
	const lease = await leaseSessionGeneration({
		agentId,
		sessionKey: child.sessionKey,
		storePath: child.storePath,
		entry
	});
	if (!lease) throw new Error(`child session changed during memory audience delegation: ${child.sessionKey}`);
	const record = {
		parent,
		leases: [lease],
		state: "current",
		holders: 0
	};
	try {
		assertCallerCurrent();
		assertRecordCurrent(record);
	} catch (error) {
		releaseRecordLeases(record);
		throw error;
	}
	return mintMemoryAudience({ ...audience }, child.sessionKey, record);
}
/** Reject a retained audience after any captured session incarnation changes. */
function assertMemoryAudienceCurrent(audience) {
	const record = audienceRecords.get(audience);
	if (!record) throw new Error("memory audience was not minted by this host");
	assertRecordCurrent(record);
}
/**
* Check a memory caller's whole authority: its own currency, its audience's
* session binding and currency, and its abort signal. Final guards before
* provider I/O or prompt publication use this, never the caller's check alone.
*/
function assertMemoryCallerCurrent(context) {
	context.assertCurrent();
	const { authority } = context;
	if (authority.kind === "session" && authority.audience) {
		assertMemoryAudienceSession(authority.audience, authority.sessionKey);
		assertMemoryAudienceCurrent(authority.audience);
	}
	context.signal?.throwIfAborted();
}
//#endregion
export { isHostMemoryAudience as a, delegateMemoryAudience as i, assertMemoryAudienceSession as n, resolveMemoryAudienceFromEntry as o, assertMemoryCallerCurrent as r, assertMemoryAudienceCurrent as t };
