import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { S as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-BtDOU_3j.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as captureSessionStoreCandidateIdentities, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { n as preparePhysicalSessionStorePath } from "./session-store-path-BQkYPc4_.mjs";
import { o as prepareOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { t as prepareSessionStoreTargetInventoryRead } from "./session-store-target-runtime-D11id0W-.mjs";
import { c as withSessionEntriesFromStoresInWorker, u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { t as readResolvedSessionEntriesInWorker } from "./session-accessor.entry-read-runtime-BoYobsOQ.mjs";
import { l as listSessionChildEntriesReadOnly } from "./session-accessor.entry-BLpjjUTc.mjs";
import { u as listSubagentSessionListRunsForControllers } from "./subagent-registry-read-DY0g8fGW.mjs";
import { a as resolveNativeGatewaySessionStoreTargetWithStore, n as prepareGatewaySessionStoreTargetReadOnly, r as prepareGatewaySessionStoreTargetReadPlan } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { n as omitInternalSessionEffectsEntries, t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { t as attachErrorDiagnostic } from "./error-diagnostics-Cgksm9ND.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-utils-store-worker.ts
var SessionStoreUnavailableError = class extends Error {
	constructor(agentId, reason, readError) {
		const nativeKind = readError?.code ?? readError?.name;
		const suffix = nativeKind && /^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(nativeKind) ? `: ${nativeKind}` : "";
		super(`Session stores for agent ${agentId} are unavailable (${reason}${suffix}); retry after storage is available.`);
		this.reason = reason;
		this.readError = readError;
		this.name = "SessionStoreUnavailableError";
		if (readError) attachErrorDiagnostic(this, `${readError.name}: ${formatErrorMessageWithCode(readError)}`);
	}
};
/** Acquire the ordered lookup's data while its discovery and physical readers remain current. */
async function resolveGatewaySessionStoreTargetInWorker(params) {
	let prepared = await prepareGatewaySessionStoreReadInWorker(params, false, params.onSelected);
	if (params.readOnly === false && params.clone !== false && !prepared.target.capturedReadSource && !isIncognitoSessionKey(prepared.target.canonicalKey) && isConfiguredSessionStoreAgentId(params.cfg, prepared.target.agentId)) {
		const path = prepared.target.readSource?.path ?? await preparePhysicalSessionStorePath({
			agentId: prepared.target.agentId,
			sessionKey: prepared.target.canonicalKey,
			env: params.env
		}, params.cfg);
		await prepareOpenClawAgentDatabaseExecution({
			agentId: prepared.target.readSource?.agentId ?? prepared.target.agentId,
			path,
			env: params.env
		}, () => params.assertActive?.());
		prepared = await prepareGatewaySessionStoreReadInWorker({
			...params,
			readOnly: true
		}, false, params.onSelected);
	}
	const target = await includeDirectChildEntriesInWorker(prepared.target, params);
	params.assertActive?.();
	return target;
}
async function includeDirectChildEntriesInWorker(target, params) {
	if (!params.includeStoreChildEntries || isIncognitoSessionKey(target.canonicalKey)) return target;
	try {
		const parentKeys = /* @__PURE__ */ new Set([target.canonicalKey, ...target.storeKeys]);
		const children = await listSessionChildEntriesReadOnly({
			agentId: target.readSource?.agentId ?? target.agentId,
			storePath: target.readSource?.path ?? target.storePath,
			env: params.env,
			projection: "list",
			sessionKey: target.canonicalKey
		}, [...parentKeys]);
		for (const { sessionKey, entry } of children) if (!parentKeys.has(sessionKey) && (entry.parentSessionKey && parentKeys.has(entry.parentSessionKey) || entry.spawnedBy && parentKeys.has(entry.spawnedBy))) target.store[sessionKey] = entry;
		const hintedKeys = [...new Set(listSubagentSessionListRunsForControllers([...parentKeys]).map(({ childSessionKey }) => childSessionKey))].filter((key) => !target.store[key]);
		if (hintedKeys.length) {
			const retainedChildren = await readResolvedSessionEntriesInWorker({
				cfg: params.cfg,
				env: params.env,
				sessionKeys: hintedKeys
			}, "list");
			for (const { canonicalKey, entry } of retainedChildren.values()) if (entry && !parentKeys.has(canonicalKey)) target.store[canonicalKey] = entry;
		}
	} catch {}
	return target;
}
async function prepareGatewaySessionStoreReadInWorker(params, retainPlan = false, onSelected) {
	params.assertActive?.();
	const parsedAgent = parseAgentSessionKey(params.key)?.agentId;
	const retiredOwner = parsedAgent && !isConfiguredSessionStoreAgentId(params.cfg, parsedAgent);
	const agentId = retiredOwner ? parsedAgent : resolveSessionStoreIdentity({
		cfg: params.cfg,
		sessionKey: params.key,
		agentId: params.agentId,
		preserveQualifiedAddress: params.preserveQualifiedAddress
	}).agentId;
	if (isIncognitoSessionKey(params.key)) {
		const target = resolveNativeGatewaySessionStoreTargetWithStore({
			...params,
			readOnly: true,
			projection: params.projection ?? "list",
			exactRead: true
		});
		onSelected?.(target);
		return { target };
	}
	const { candidates, ...inventory } = prepareSessionStoreTargetInventory(params.cfg, [
		agentId,
		...retiredOwner ? listAgentIds(params.cfg) : [],
		...parsedAgent && parsedAgent !== agentId ? [parsedAgent] : []
	], params.env);
	const identities = retainPlan ? captureSessionStoreCandidateIdentities(candidates) : void 0;
	const inventoryRead = prepareSessionStoreTargetInventoryRead({
		...inventory,
		candidates
	});
	const captured = /* @__PURE__ */ new Map();
	const prepared = await inventoryRead.withRead(async (sources, assertCurrent) => {
		const targetDiscoveryCache = /* @__PURE__ */ new Map();
		for (const source of sources.agents) {
			if (!source.result.available && source.result.reason !== "database-missing") throw new SessionStoreUnavailableError(source.agentId, source.result.reason, source.result.error);
			targetDiscoveryCache.set(source.agentId, {
				existing: source.result.available ? source.result.targets : [],
				fallback: {
					agentId: source.agentId,
					storePath: inventory.paths.get(source.agentId).configured
				}
			});
		}
		const lookup = {
			...params,
			cfg: inventory.config,
			key: params.key,
			env: inventory.env,
			targetDiscoveryCache,
			exactRead: retainPlan ? true : params.exactRead,
			projection: params.projection,
			preserveQualifiedAddress: params.preserveQualifiedAddress
		};
		const prepareReads = async (reads, select) => {
			assertCurrent();
			const pending = reads.filter((read) => read.result === void 0);
			if (pending.some((read) => read.options.exactKeys === void 0)) {
				const readNext = async (index) => {
					const read = pending[index];
					if (!read) return select();
					return withSessionStoreReaderInWorker({
						agentId: read.agentId ?? agentId,
						storePath: read.storePath,
						env: inventory.env
					}, async ({ reader, database, continuation, assertCurrent: assertSourceCurrent }) => {
						const result = await reader.readEntries({
							agentId: database.agentId,
							storePath: database.path,
							env: database.env,
							projection: read.options.projection === "list" ? "list" : "full",
							sessionKeys: read.options.exactKeys
						}, continuation);
						assertSourceCurrent();
						read.result = ok(Object.fromEntries(result.entries.map(({ sessionKey, entry }) => [sessionKey, entry])));
						read.readSource = {
							agentId: database.agentId,
							path: database.path
						};
						read.capturedReadSource = result.source;
						return readNext(index + 1);
					}, { dataOnly: true });
				};
				return readNext(0);
			}
			return await withSessionEntriesFromStoresInWorker(pending.map((read) => ({
				agentId: read.agentId ?? agentId,
				storePath: read.storePath,
				sessionKeys: read.options.exactKeys,
				projection: read.options.projection === "list" ? "list" : "exact",
				snapshotFields: typeof read.options.projection === "object" ? read.options.projection : void 0,
				env: inventory.env
			})), (loaded) => {
				assertCurrent();
				for (const [index, read] of pending.entries()) {
					const preparedRead = loaded[index];
					read.result = ok(Object.fromEntries(preparedRead.result.entries.map(({ sessionKey, entry }) => [sessionKey, entry])));
					read.readSource = {
						agentId: preparedRead.database.agentId,
						path: preparedRead.database.path
					};
					const identity = readDatabasePathIdentitySync(preparedRead.database.path);
					preparedRead.assertCurrent();
					if (identity.key.startsWith("file:")) read.capturedReadSource = {
						...read.readSource,
						databaseIdentity: identity.key.slice(5),
						databaseBirthtime: identity.birthtime
					};
					if (retainPlan) captured.set(read, {
						input: {
							agentId: preparedRead.database.agentId,
							storePath: preparedRead.database.path,
							sessionKeys: [...read.options.exactKeys],
							projection: "exact",
							env: inventory.env
						},
						source: read.readSource,
						expectedSource: read.capturedReadSource
					});
				}
				return select();
			}, { ordered: onSelected !== void 0 });
		};
		const selected = retainPlan || onSelected ? await prepareGatewaySessionStoreTargetReadPlan(lookup, prepareReads, onSelected) : {
			target: await prepareGatewaySessionStoreTargetReadOnly(lookup, prepareReads),
			plan: void 0
		};
		assertCurrent();
		return selected;
	}, params.assertActive);
	params.assertActive?.();
	if (!retainPlan || !prepared.plan) return { target: prepared.target };
	const assertCurrent = () => {
		inventoryRead.assertRegistryCurrent();
		for (const candidate of candidates) assertSessionStoreReadCandidate(candidate.path, candidates);
		if (!isDeepStrictEqual(captureSessionStoreCandidateIdentities(candidates), identities)) throw new Error("Prepared session lookup candidates changed");
	};
	const { target: initialTarget, plan } = prepared;
	const selectedSource = {
		agentId: initialTarget.agentId,
		canonicalKey: initialTarget.canonicalKey,
		storePath: initialTarget.storePath,
		readSource: initialTarget.readSource
	};
	const reads = plan.reads.map((read) => {
		const source = captured.get(read);
		if (!source) throw new Error("Prepared session lookup source is unavailable");
		return {
			read,
			...source
		};
	});
	const select = (snapshots) => {
		assertCurrent();
		if (snapshots.length !== reads.length) throw new Error("Prepared session lookup facts are incomplete");
		try {
			for (const [index, { read, source, expectedSource }] of reads.entries()) {
				const current = snapshots[index];
				current.assertCurrent();
				if (current.source.agentId !== source.agentId || current.source.path !== source.path || current.capturedReadSource?.databaseIdentity !== expectedSource?.databaseIdentity || current.capturedReadSource?.databaseBirthtime !== expectedSource?.databaseBirthtime) throw new Error("Prepared session lookup source changed");
				read.result = ok(Object.fromEntries(current.entries.map(({ sessionKey, entry }) => [sessionKey, entry])));
				read.readSource = current.source;
				read.capturedReadSource = current.capturedReadSource;
			}
			const target = plan.resolve();
			assertCurrent();
			if (target.agentId !== selectedSource.agentId || target.canonicalKey !== selectedSource.canonicalKey || target.storePath !== selectedSource.storePath || !isDeepStrictEqual(target.readSource, selectedSource.readSource)) throw new Error("Prepared session lookup selected another source");
			return target;
		} finally {
			for (const { read } of reads) {
				read.result = void 0;
				read.readSource = void 0;
				read.capturedReadSource = void 0;
			}
		}
	};
	assertCurrent();
	for (const { read } of reads) {
		read.result = void 0;
		read.readSource = void 0;
		read.capturedReadSource = void 0;
	}
	return {
		target: initialTarget,
		readPlan: {
			reads: reads.map(({ input }) => input),
			assertCurrent,
			selectPrepared(current) {
				return select(current.map((read) => ({
					entries: read.result.entries,
					source: {
						agentId: read.database.agentId,
						path: read.database.path
					},
					capturedReadSource: read.result.source,
					assertCurrent: read.assertCurrent
				})));
			}
		}
	};
}
/** Entry preparation shares the Gateway's alias, discovery, and reader owners. */
async function loadGatewaySessionEntryReadOnlyInWorker(params) {
	const { excludeInternalEffects, ...lookup } = params;
	const target = await resolveGatewaySessionStoreTargetInWorker({
		...lookup,
		projection: params.projection ?? "full"
	});
	params.assertActive?.();
	if (excludeInternalEffects) omitInternalSessionEffectsEntries(target.store, target.storeKeys);
	const match = findCanonicalStoreMatch(target.store, target.storeKeys);
	return {
		...target,
		cfg: params.cfg,
		entry: match?.entry,
		legacyKey: match?.key !== target.canonicalKey ? match?.key : void 0
	};
}
/** Retain the original lookup domain for a later synchronous admission predicate. */
async function prepareGatewaySessionEntryReadOnlyInWorker(params, onSelected) {
	const { excludeInternalEffects, ...lookup } = params;
	const { target, readPlan } = await prepareGatewaySessionStoreReadInWorker({
		...lookup,
		projection: params.projection ?? "full"
	}, true, onSelected);
	params.assertActive?.();
	const select = (current) => {
		if (excludeInternalEffects) omitInternalSessionEffectsEntries(current.store, current.storeKeys);
		return findCanonicalStoreMatch(current.store, current.storeKeys);
	};
	await includeDirectChildEntriesInWorker(target, params);
	params.assertActive?.();
	const match = select(target);
	return {
		loaded: {
			...target,
			cfg: params.cfg,
			entry: match?.entry,
			legacyKey: match?.key !== target.canonicalKey ? match?.key : void 0
		},
		readPlan: readPlan && {
			reads: readPlan.reads,
			assertCurrent: readPlan.assertCurrent,
			selectPrepared: (reads) => select(readPlan.selectPrepared(reads))?.entry
		}
	};
}
//#endregion
export { prepareGatewaySessionEntryReadOnlyInWorker as n, resolveGatewaySessionStoreTargetInWorker as r, loadGatewaySessionEntryReadOnlyInWorker as t };
