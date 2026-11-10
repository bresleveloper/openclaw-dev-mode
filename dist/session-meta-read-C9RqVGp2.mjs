import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { t as captureRuntimeConfigWithSource } from "./runtime-config-capture-state-CxduIFzk.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { o as runWithSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { n as buildAcpDatabaseSessionKey } from "./session-meta-keys-BWMCJN-1.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-DksRcpO8.mjs";
import { t as matchesAcpSessionControlBinding } from "./session-control-owner-CbeH1iSF.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
//#region src/acp/runtime/session-meta-read-context.ts
/** Capture routing inputs before a read yields, retaining the caller's live assertion. */
async function captureAcpSessionReadContext(params) {
	const cwd = tryProcessCwd();
	const assertCallerCurrent = params.assertCurrent;
	const databasePath = params.databasePath ? path.resolve(params.databasePath) : void 0;
	const suppliedEnv = params.env ? cloneEnvWithPlatformSemantics(params.env) : void 0;
	const assertInputCurrent = () => {
		assertCallerCurrent?.();
		if (tryProcessCwd() !== cwd) throw new Error("ACP session read working directory changed; retry the read.");
	};
	assertInputCurrent();
	let assertCurrent = assertInputCurrent;
	let captured;
	if (params.cfg) captured = {
		config: captureRuntimeConfigWithSource(params.cfg, params.cfg),
		env: cloneEnvWithPlatformSemantics(process.env)
	};
	else {
		const read = captureRuntimeConfigAsyncReader({
			capture: true,
			assertCurrent: assertInputCurrent
		});
		captured = await read();
		assertCurrent = read.assertCurrent;
	}
	assertCurrent();
	const env = suppliedEnv ?? captured.env;
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	return {
		cfg: captured.config,
		env,
		databasePath,
		assertCurrent
	};
}
//#endregion
//#region src/acp/runtime/session-meta-worker-mutation.ts
async function prepareAcpSessionMutation(context, input, mutate, assertCurrent, authorize) {
	const nonce = randomUUID();
	let decision;
	const preparation = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "acp.prepareMutation",
		input: {
			...input,
			nonce
		}
	}), {
		assertCurrent,
		createAdmission() {
			let phase = "transaction";
			const admission = createSqliteWorkerOperationAdmission((request, grant) => {
				const facts = request.facts;
				assertCurrent();
				if (!isRecord(facts) || facts.nonce !== nonce || request.stage !== phase) throw new Error("ACP callback differs from its retained transaction");
				authorize?.(request.stage === "transaction" ? "transaction" : "commit");
				if (request.stage === "transaction") {
					if (decision) throw new Error("ACP callback has no unique decision");
					const prepared = facts.preparation;
					const next = mutate(prepared.current, prepared.current ? mergeSessionEntry(prepared.preparedEntry, { acp: prepared.current }) : prepared.entry);
					decision = next === void 0 ? { kind: "keep" } : next === null ? { kind: "clear" } : {
						kind: "set",
						meta: next
					};
					assertCurrent();
					structuredClone(decision);
					phase = "commit";
				} else phase = "settled";
				if (!grant()) throw new Error("ACP callback admission expired");
			});
			return {
				nativeLocations: [context.admission.databasePath, ..."kind" in input.source ? [] : [input.source.path]],
				admission
			};
		}
	});
	assertCurrent();
	if (!decision) throw new Error("ACP metadata mutation returned no decision");
	return {
		preparation,
		decision
	};
}
async function commitAcpSessionMutation(context, input, assertCurrent, authorize) {
	const nonce = randomUUID();
	let admitted;
	let published = false;
	let pending = false;
	let superseded = false;
	const target = {
		agentId: input.agentId,
		sessionKey: input.sessionKey,
		storePath: input.source.path,
		scope: "acp"
	};
	const invalidation = {
		...target,
		factsInvalidated: true
	};
	const unsubscribe = sessionChanges.subscribeFacts((change) => {
		if (pending && !published && ("all" in change || change.sessionKey === input.sessionKey && (!change.agentId || change.agentId === input.agentId))) superseded = true;
	});
	const publish = () => {
		const receipt = admitted?.admission.committed?.facts;
		if (!published && isRecord(receipt) && receipt.nonce === nonce) {
			published = true;
			try {
				assertCurrent();
			} catch {
				superseded = true;
			}
			let facts;
			if (!superseded && isRecord(receipt.facts) && receipt.facts.kind === "acp") facts = receipt.facts;
			sessionChanges.emit(facts ? {
				...target,
				facts
			} : invalidation);
		}
	};
	try {
		await runOpenClawStateWorkerOperation(context, async (scope) => {
			try {
				assertCurrent();
				sessionChanges.invalidate(invalidation);
				await scope.execute({
					type: "acp.commitMutation",
					input: {
						...input,
						nonce
					}
				});
			} finally {
				await admitted?.retained.settled;
				publish();
			}
		}, {
			assertCurrent,
			createAdmission(retained) {
				let phase = "transaction";
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					assertCurrent();
					if (!isRecord(request.facts) || request.facts.nonce !== nonce || request.stage !== phase) throw new Error("ACP metadata commit differs from its retained owner");
					authorize?.(request.stage === "transaction" ? "transaction" : "commit");
					if (request.stage === "transaction") pending = true;
					phase = request.stage === "transaction" ? "commit" : "settled";
					if (!grant()) throw new Error("ACP metadata commit admission expired");
				});
				admitted = {
					admission,
					retained
				};
				observeSqliteWorkerCommittedFacts(admission, publish);
				return {
					nativeLocations: [context.admission.databasePath, ..."kind" in input.source && input.source.kind !== "reset" ? [] : [input.source.path]],
					admission
				};
			}
		});
	} finally {
		try {
			await admitted?.retained.settled;
			publish();
			if (!published) sessionChanges.invalidate(invalidation);
		} finally {
			unsubscribe();
		}
	}
}
//#endregion
//#region src/acp/runtime/session-meta-memory.ts
function acquireAcpMemorySession(params, create = false) {
	const assertCurrent = () => params.assertCurrent?.();
	return acquireSessionActorStorage({
		sessionKey: normalizeStoreSessionKey(params.sessionKey),
		agentId: params.agentId,
		env: params.env
	}, {
		create,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		authority: {
			assertCurrent,
			authorize: assertCurrent
		}
	});
}
/** The session actor owns entries; the existing shared worker owns ACP runtime metadata. */
async function prepareMemoryAcpSessionEntryRead(params) {
	const binding = await acquireAcpMemorySession(params);
	if (!binding) return {
		session: null,
		assertCurrent: () => params.assertCurrent?.(),
		release() {}
	};
	try {
		const prepared = await prepareBoundMemoryAcpSessionEntryRead(params, binding);
		return {
			...prepared,
			release() {
				prepared.release();
				binding.actor.release();
			}
		};
	} catch (error) {
		await binding.actor.release();
		throw error;
	}
}
async function prepareBoundMemoryAcpSessionEntryRead(params, binding) {
	const captured = await captureAcpSessionReadContext(params);
	const target = resolveSessionStorePathForAcp({
		...params,
		...captured
	});
	const entry = binding.actor.snapshot(binding.authority)?.entry;
	const [acp] = await readAcpSessionMetaForEntries({
		entries: [{
			sessionKey: target.storeSessionKey,
			agentId: binding.agentId,
			entry
		}],
		...captured
	});
	let active = true;
	return {
		session: {
			...target,
			storePath: binding.path,
			sessionKey: params.sessionKey.trim(),
			entry,
			acp: acp ?? void 0
		},
		assertCurrent() {
			if (!active) throw new Error("ACP session read was released");
			params.assertCurrent?.();
			binding.actor.snapshot(binding.authority);
		},
		release() {
			active = false;
		}
	};
}
async function upsertMemoryAcpSessionMeta(params) {
	const binding = await acquireAcpMemorySession(params, true);
	if (!binding) return null;
	try {
		return await runWithSessionActorStorage(binding, () => upsertBoundMemoryAcpSessionMeta(params, binding));
	} finally {
		await binding.actor.release();
	}
}
async function upsertBoundMemoryAcpSessionMeta(params, binding) {
	const captured = await captureAcpSessionReadContext(params);
	const target = resolveSessionStorePathForAcp({
		...params,
		...captured
	});
	const context = captureOpenClawStateWorkerContext({
		path: captured.databasePath,
		env: captured.env
	});
	const sessionKey = target.storeSessionKey;
	const assertControlTarget = (entry) => {
		if (params.expectedControlBinding && !matchesAcpSessionControlBinding(entry, params.expectedControlBinding)) throw new Error("Canonical ACP control target changed before mutation");
	};
	const authority = {
		...binding.authority,
		authorize(stage, facts, publication) {
			binding.authority.authorize(stage, facts, publication);
			if (stage === "commit") {
				params.assertCommitAllowed?.();
				assertControlTarget(facts.entry);
			}
		}
	};
	const assertCurrent = () => {
		binding.actor.assertCurrent();
		binding.authority.assertCurrent();
	};
	const entry = binding.actor.snapshot(authority)?.entry;
	const source = (current) => ({
		kind: "memory",
		agentId: binding.agentId,
		path: binding.path,
		snapshot: {
			entry: current,
			sources: []
		}
	});
	const updatedAt = params.now?.() ?? Date.now();
	const { preparation, decision } = await prepareAcpSessionMutation(context, {
		read: {
			keys: [buildAcpDatabaseSessionKey(sessionKey, binding.agentId)],
			entry
		},
		entry,
		source: source(entry),
		updatedAt,
		sessionKey,
		agentId: binding.agentId
	}, params.mutate, assertCurrent);
	if (decision.kind === "keep") return preparation.current ? mergeSessionEntry(entry, { acp: preparation.current }) : entry ?? null;
	const outcome = await binding.actor.storage.mutate({
		type: "session.entry.patch",
		input: {
			operation: {
				kind: "fields",
				patch: {
					acp: void 0,
					...decision.kind === "set" ? { updatedAt } : {}
				}
			},
			...decision.kind === "set" ? { fallbackEntry: preparation.preparedEntry } : {},
			preserveActivity: decision.kind === "clear"
		}
	}, authority);
	if (outcome.kind === "rolled-back") throw Object.assign(new Error(outcome.error.message), { name: outcome.error.name });
	const changed = outcome.value;
	if (decision.kind === "set" && !changed) {
		readSessionActorStorageResult(outcome);
		return null;
	}
	await commitAcpSessionMutation(context, {
		agentId: binding.agentId,
		storageSessionKey: sessionKey,
		sessionKey,
		entry: changed,
		currentRowKey: preparation.currentRowKey,
		currentRowSessionId: preparation.currentRowSessionId,
		updatedAt,
		decision,
		source: source(changed)
	}, assertCurrent, params.expectedControlBinding ? (stage) => {
		if (stage === "commit") assertControlTarget(binding.actor.snapshot(binding.authority)?.entry);
	} : void 0);
	readSessionActorStorageResult(outcome);
	return decision.kind === "clear" ? changed ?? null : mergeSessionEntry(changed, { acp: decision.meta });
}
//#endregion
//#region src/acp/runtime/session-meta-read.ts
/** Retain the canonical session source through its lifecycle-bound ACP metadata join. */
async function readAcpSessionEntryAsync(params) {
	return withAcpSessionEntryRead(params, (entry) => entry);
}
/** Retain a private source through the caller's asynchronous cleanup operation. */
function prepareAcpSessionEntryRead(params) {
	return isIncognitoSessionKey(params.sessionKey.trim()) ? prepareMemoryAcpSessionEntryRead(params) : void 0;
}
/** The consuming owner can verify the exact selected physical source before custody ends. */
async function withAcpSessionEntryRead(params, consume, options = {}) {
	const input = { ...params };
	const sessionKey = input.sessionKey.trim();
	input.assertCurrent?.();
	if (!sessionKey) return consume(null, void 0);
	const memory = prepareAcpSessionEntryRead(input);
	if (memory) {
		const prepared = await memory;
		try {
			prepared.assertCurrent();
			return await consume(prepared.session, void 0);
		} finally {
			prepared.release();
		}
	}
	const { cfg, env, databasePath, assertCurrent } = await captureAcpSessionReadContext(input);
	assertCurrent();
	const target = resolveSessionStorePathForAcp({
		...input,
		sessionKey,
		cfg,
		env
	});
	const storeSessionKey = target.storeSessionKey;
	return await withSessionEntryReadOnlyInWorker({
		agentId: target.agentId,
		storePath: target.storePath,
		sessionKey: storeSessionKey,
		env
	}, assertCurrent, async (read, owner) => {
		const entry = read.ok ? read.value : void 0;
		const [acp] = await readAcpSessionMetaForEntries({
			entries: [{
				sessionKey: storeSessionKey,
				agentId: target.agentId,
				entry
			}],
			cfg,
			env,
			databasePath
		}, { current: options.currentMetadata });
		assertCurrent();
		return consume({
			cfg,
			agentId: target.agentId,
			storePath: target.storePath,
			sessionKey,
			storeSessionKey,
			entry,
			acp: acp ?? void 0,
			...!read.ok ? { storeReadFailed: true } : {}
		}, owner);
	});
}
async function readAcpSessionMetaAsync(params) {
	return (await readAcpSessionEntryAsync({
		...params,
		clone: false
	}))?.acp;
}
//#endregion
export { acquireAcpMemorySession as a, prepareAcpSessionMutation as c, withAcpSessionEntryRead as i, captureAcpSessionReadContext as l, readAcpSessionEntryAsync as n, upsertMemoryAcpSessionMeta as o, readAcpSessionMetaAsync as r, commitAcpSessionMutation as s, prepareAcpSessionEntryRead as t };
