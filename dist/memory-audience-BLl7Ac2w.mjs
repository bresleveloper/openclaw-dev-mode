import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { i as isSessionDeliveryGenerationRevokedError, r as prepareSessionGenerationFacts } from "./session-delivery-generation-NkiiEowi.mjs";
//#region src/plugins/memory-audience.ts
const MAX_LINEAGE_HOPS = 64;
const SESSION_ID_PATTERN = /^[a-f0-9-]{36}$/;
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
	const { agentId } = params;
	let hopAgentId = agentId;
	let crossedAgents = false;
	const assertCallerCurrent = params.assertCallerCurrent ?? (() => {});
	const seen = /* @__PURE__ */ new Set();
	const record = {
		leases: [],
		state: "current",
		holders: 0
	};
	let requiredLifecycleRevision;
	const deny = (kind, reason) => {
		releaseRecordLeases(record);
		return {
			status: "denied",
			kind,
			reason
		};
	};
	try {
		for (let depth = 0; depth < MAX_LINEAGE_HOPS; depth += 1) {
			if (!isAgentSessionKey(sessionKey, hopAgentId) || !isSessionId(sessionId) || seen.has(sessionKey)) return deny("ineligible", `session lineage at ${sessionKey} is malformed or cyclic`);
			seen.add(sessionKey);
			const storePath = hopAgentId === agentId ? params.storePath : params.resolveAgentStorePath(hopAgentId);
			const entry = depth === 0 ? admittedEntry : await readEntryInWorker({
				agentId: hopAgentId,
				sessionKey,
				storePath,
				assertCallerCurrent
			});
			if (!entry || entry.sessionId !== sessionId || depth > 0 && entry.lifecycleRevision !== requiredLifecycleRevision) {
				if (depth === 0) return deny("unverified", `session ${sessionKey} no longer matches its admitted turn`);
				return deny("stale-lineage", `session ${params.sessionKey} has stale lineage: ancestor ${sessionKey} was reset or removed after its child was spawned. Respawn or recreate it from a current session to restore memory access; resetting it keeps the stale lineage.`);
			}
			const lease = await leaseSessionGeneration({
				agentId: hopAgentId,
				sessionKey,
				storePath,
				entry
			});
			if (!lease) return deny("unverified", `session ${sessionKey} changed while its memory audience was resolved`);
			record.leases.push(lease);
			if (entry.spawnedBy !== void 0) {
				if (typeof entry.spawnedBySenderIsOwner !== "boolean") return deny("stale-lineage", `spawned session ${sessionKey} predates memory lineage receipts (spawnedBySenderIsOwner), so it has no inherited memory audience. Respawn it from its parent session to restore memory access.`);
				if (!entry.spawnedBy || entry.parentSessionKey !== void 0 && entry.parentSessionKey !== entry.spawnedBy || !isSessionId(entry.spawnedBySessionId) || entry.parentSessionLifecycleRevision === "") return deny("ineligible", `spawned session ${sessionKey} has malformed lineage receipts`);
				const parentAgentId = parseAgentSessionKey(entry.spawnedBy)?.agentId;
				if (parentAgentId && parentAgentId !== hopAgentId) {
					if (!params.resolveAgentStorePath || !entry.spawnedBySenderIsOwner) return deny("ineligible", `session lineage at ${sessionKey} crosses agents without an owner spawn`);
					crossedAgents = true;
					hopAgentId = parentAgentId;
				}
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
			if (crossedAgents) return deny("ineligible", `cross-agent lineage grants only owner-private memory; root session ${sessionKey} is not an owner direct chat`);
			if (entry.chatType === "direct" || entry.chatType === "group" || entry.chatType === "channel") return {
				status: "granted",
				...mintMemoryAudience({
					kind: "conversation",
					agentId,
					sessionKey,
					sessionId
				}, params.sessionKey, record)
			};
			return deny("ineligible", `root session ${sessionKey} has no durable chat type`);
		}
		return deny("ineligible", `session lineage exceeds ${MAX_LINEAGE_HOPS} hops`);
	} catch (error) {
		releaseRecordLeases(record);
		assertCallerCurrent();
		return deny("unverified", `session storage could not verify the lineage: ${formatErrorMessage(error)}`);
	}
}
/** Return whether a memory audience was minted by this host process. */
function isHostMemoryAudience(value) {
	return typeof value === "object" && value !== null && audienceRecords.has(value);
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
/** Join admitted session publications without weakening the synchronous final guard. */
function prepareMemoryAudienceRead(audience) {
	const record = audienceRecords.get(audience);
	if (!record) throw new Error("memory audience was not minted by this host");
	const pending = [];
	try {
		for (let current = record; current; current = current.parent) {
			if (current.state !== "current") assertRecordCurrent(current);
			for (const lease of current.leases) {
				const publication = lease.prepareRead();
				if (publication) pending.push(publication);
			}
		}
	} catch (error) {
		Promise.all(pending).catch(() => {});
		throw error;
	}
	if (pending.length > 0) return Promise.all(pending).then(() => prepareMemoryAudienceRead(audience));
	assertRecordCurrent(record);
}
/** Prepare only the host-owned audience; callers still recheck their full authority after await. */
function prepareMemoryCallerRead(context) {
	context.signal?.throwIfAborted();
	const { authority } = context;
	if (authority.kind === "session" && authority.audience) {
		assertMemoryAudienceSession(authority.audience, authority.sessionKey);
		return prepareMemoryAudienceRead(authority.audience);
	}
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
export { isHostMemoryAudience as a, resolveMemoryAudienceFromEntry as c, delegateMemoryAudience as i, assertMemoryAudienceSession as n, prepareMemoryAudienceRead as o, assertMemoryCallerCurrent as r, prepareMemoryCallerRead as s, assertMemoryAudienceCurrent as t };
