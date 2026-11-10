import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as prepareAgentDatabaseDeletionSnapshotRead } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { g as targetDiscoveryLane, v as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { s as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import "./targets-DJGC6v85.mjs";
import { i as prepareSessionStoreTargetInventory, t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { n as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { l as selectStoredSessionLineage, s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { r as resolveSessionParentSessionKey } from "./session-conversation-DnUQmZJM.mjs";
import { i as resolveGatewaySessionStoreTargetWithStoreAsync } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { t as resolveSessionConfiguredDefault } from "./session-model-ref-BTkDCi12.mjs";
import { t as resolveDirectStoredModelOverride } from "./stored-model-overrides-RKQxlZXm.mjs";
import { a as mergeCombinedSessionStore, l as storeTargetKey, r as listMemorySessionStoreTargets, t as applyGatewaySessionStoreAdmission } from "./combined-store-gateway-D1UQome7.mjs";
import path from "node:path";
//#region src/gateway/session-utils-store-lineage.ts
/** Prepare ordinary stored lineage through the existing Gateway worker owner. */
function createGatewaySessionLineageReaderAsync(cfg) {
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const read = async (agentId, key, preserveQualifiedAddress) => {
		const target = await resolveGatewaySessionStoreTargetWithStoreAsync({
			cfg,
			key,
			...parseAgentSessionKey(key) ? {} : { agentId },
			preserveQualifiedAddress,
			readOnly: true,
			exactRead: true,
			clone: false,
			projection: "list",
			targetDiscoveryCache
		});
		return target.store[target.canonicalKey];
	};
	return {
		readStored: (agentId, key) => read(agentId, key, true),
		readAlias: (key, agentId) => read(agentId, key, false)
	};
}
/** A model selection consumes its one prepared parent without synchronous fallback reads. */
async function prepareGatewaySessionEntryReader(params) {
	if (params.entry?.modelOverrideSource === "default" || resolveDirectStoredModelOverride({
		sessionEntry: params.entry,
		defaultProvider: resolveSessionConfiguredDefault(params.cfg, params.agentId).provider
	})) return (key) => params.store[key];
	const explicitParent = params.entry?.parentSessionKey?.trim();
	const parentKey = explicitParent && explicitParent !== params.sessionKey ? explicitParent : resolveSessionParentSessionKey(params.sessionKey);
	const prepared = /* @__PURE__ */ new Map();
	if (parentKey && parentKey !== params.sessionKey && !params.store[parentKey]) {
		if (parentKey === "global" || parentKey === "unknown") {
			const source = params.readSource ?? (await resolveGatewaySessionStoreTargetWithStoreAsync({
				cfg: params.cfg,
				agentId: params.agentId,
				key: params.sessionKey,
				readOnly: true,
				exactRead: true
			})).readSource;
			if (source) {
				const rows = await readSessionEntriesFromStoreInWorker({
					agentId: source.agentId,
					storePath: source.path,
					sessionKeys: [parentKey],
					snapshotFields: []
				});
				prepared.set(parentKey, rows.entries.find((row) => row.sessionKey === parentKey)?.entry);
			}
		} else {
			const reader = createGatewaySessionLineageReaderAsync(params.cfg);
			const owner = normalizeAgentId(parseAgentSessionKey(parentKey)?.agentId ?? params.agentId);
			const storedKey = resolveStoredSessionKeyForAgentStore({
				cfg: params.cfg,
				agentId: owner,
				sessionKey: parentKey,
				preserveQualifiedAddress: true
			});
			const stored = await reader.readStored(owner, storedKey);
			const alias = stored === void 0 && !isIncognitoSessionKey(storedKey) ? await reader.readAlias(parentKey, params.agentId) : void 0;
			const selected = selectStoredSessionLineage({
				cfg: params.cfg,
				agentId: params.agentId,
				sessionKey: parentKey,
				read: () => stored,
				readAlias: () => alias
			});
			prepared.set(parentKey, selected.value);
		}
	}
	return (key) => params.store[key] ?? prepared.get(key);
}
//#endregion
//#region src/config/sessions/combined-store-gateway-read.ts
async function loadCombinedSessionStoreForGatewayCoreAsync(cfg, opts = {}) {
	const selected = opts.includeIncognito === false ? void 0 : captureSessionActorStorageOwner({ env: opts.discovery?.env });
	const env = cloneEnvWithPlatformSemantics(opts.discovery?.env ?? (selected ? {
		...process.env,
		OPENCLAW_STATE_DIR: path.resolve(selected.path, "../../../..")
	} : process.env));
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = {
		...opts,
		...opts.discovery && { discovery: {
			...opts.discovery,
			env
		} }
	};
	return loadCombinedSessionStore(prepareSessionStoreTargetInventory(cfg, listConfiguredSessionStoreAgentIds(cfg), env, "recovery"), options);
}
/** Capture missing owners' lineage before synchronous display and model projection. */
async function prepareCombinedSessionStoreLineage(cfg, prepared, readEntries) {
	const incognitoEntries = new Map(prepared.targets.incognitoTargets.map((target) => [storeTargetKey(target), captureMemoryExactSessionReader(target)?.entries(prepared.projection) ?? []]));
	const owners = new Set(prepared.targets.preparedAgentIds);
	const rows = [];
	for (const { target, storeTarget } of prepared.reads) {
		const shared = prepared.targets.sharedStoreRowOwner;
		const rowAgentId = shared?.target.storePath === target.storePath && shared.target.agentId === target.agentId ? shared.agentId : target.agentId;
		owners.add(target.agentId);
		owners.add(storeTarget.agentId);
		owners.add(rowAgentId);
		for (const row of readEntries(storeTarget)) {
			const agentId = normalizeAgentId(parseAgentSessionKey(row.sessionKey)?.agentId ?? rowAgentId);
			owners.add(agentId);
			rows.push({
				...row,
				agentId
			});
		}
	}
	for (const target of prepared.targets.incognitoTargets) for (const row of incognitoEntries.get(storeTargetKey(target)) ?? []) rows.push({
		...row,
		agentId: target.agentId
	});
	const identity = (agentId, key) => JSON.stringify([agentId, key]);
	const parents = /* @__PURE__ */ new Map();
	for (const { agentId, sessionKey, entry } of rows) for (const parent of [
		entry.parentSessionKey,
		entry.spawnedBy,
		resolveSessionParentSessionKey(sessionKey)
	]) {
		const parentKey = parent?.trim();
		const parsed = parentKey ? parseAgentSessionKey(parentKey) : void 0;
		if (!parentKey || !parsed) continue;
		const owner = normalizeAgentId(parsed.agentId);
		if (!owners.has(owner)) parents.set(identity(agentId, parentKey), {
			agentId,
			parentKey,
			owner,
			storedKey: resolveStoredSessionKeyForAgentStore({
				cfg,
				agentId: owner,
				sessionKey: parentKey,
				preserveQualifiedAddress: true
			})
		});
	}
	const reader = createGatewaySessionLineageReaderAsync(cfg);
	const stored = /* @__PURE__ */ new Map();
	for (const { owner, storedKey } of parents.values()) {
		const key = identity(owner, storedKey);
		if (!stored.has(key)) stored.set(key, reader.readStored(owner, storedKey));
	}
	const entries = new Map(await Promise.all([...stored].map(async ([key, row]) => [key, await row])));
	const aliases = new Map(await Promise.all([...parents].map(async ([key, parent]) => [key, entries.get(identity(parent.owner, parent.storedKey)) === void 0 ? await reader.readAlias(parent.parentKey, parent.agentId) : void 0])));
	return {
		readStored: (agentId, key) => entries.get(identity(agentId, key)),
		readAlias: (key, agentId) => aliases.get(identity(agentId, key)),
		readIncognitoEntries: (target) => incognitoEntries.get(storeTargetKey(target)) ?? []
	};
}
/** Prepare durable topology in one worker request before a synchronous projection publication. */
async function prepareCombinedSessionStoreForGatewayAsync(cfg, options, scopeAgentIds) {
	const env = options.discovery?.env ?? process.env;
	return readCombinedSessionStoreTopology(prepareSessionStoreTargetInventory(cfg, listConfiguredSessionStoreAgentIds(cfg), env, "recovery"), options, scopeAgentIds);
}
async function readCombinedSessionStoreTopology(inventory, options, scopeAgentIds) {
	const { config, env } = inventory;
	const discovery = options.discovery ?? {
		env,
		snapshot: (await prepareAgentDatabaseDeletionSnapshotRead({ env }, "runtime").read()).snapshot
	};
	const candidates = [...inventory.candidates, ...(discovery.snapshot?.registeredAgentDatabases ?? []).flatMap(({ path }) => captureSessionStoreReadCandidates(path))];
	return withSessionHistoryWorkerReadCandidates(candidates, async (owner) => {
		const result = await owner.readCombinedTopology({
			config,
			options: {
				...options,
				includeIncognito: false,
				discovery
			},
			scopeAgentIds
		});
		result.prepared.targets.incognitoTargets = options.includeIncognito === false ? [] : listMemorySessionStoreTargets(env).filter((target) => !result.prepared.targets.requestedAgentId || target.agentId === result.prepared.targets.requestedAgentId);
		result.prepared.targets = applyGatewaySessionStoreAdmission(config, {
			...options,
			discovery
		}, result.prepared.targets);
		result.prepared.reads = result.prepared.targets.durableTargets.map((target) => ({
			target,
			storeTarget: expectDefined(result.prepared.targets.physicalTargets.get(storeTargetKey(target)), "physical store")
		}));
		return result;
	}, targetDiscoveryLane);
}
/** Descriptive listings consume one captured topology; later changes belong to the next read. */
async function loadCombinedSessionStore(inventory, options) {
	const { config, env } = inventory;
	const { prepared } = await readCombinedSessionStoreTopology(inventory, options);
	const transferEnv = {
		...env,
		OPENCLAW_STATE_DIR: env.OPENCLAW_STATE_DIR
	};
	return withSessionHistoryWorkerDatabases(prepared.reads.map(({ storeTarget }) => ({
		agentId: storeTarget.agentId,
		path: storeTarget.storePath,
		env
	})), async (owners) => {
		const rows = await Promise.all(prepared.reads.map(async ({ storeTarget }, index) => {
			const source = expectDefined(owners[index], "retained session store");
			const { entries } = options.transcriptSelection ? await source.readExactEntries({
				sessionKeys: options.transcriptSelection.sessionKeys,
				selection: {
					kind: "transcript-aliases",
					sessionIds: options.transcriptSelection.sessionIds
				},
				projection: "list",
				env: transferEnv
			}) : await source.readEntries({
				...storeTarget,
				env: transferEnv,
				projection: prepared.projection,
				clone: false
			});
			return [storeTargetKey(storeTarget), entries];
		}));
		const entries = new Map(rows);
		const selection = options.transcriptSelection;
		if (selection) {
			const sessionKeys = new Set(selection.sessionKeys);
			const sessionIds = new Set(selection.sessionIds);
			const sessionFiles = /* @__PURE__ */ new Set();
			for (;;) {
				const before = sessionKeys.size + sessionIds.size + sessionFiles.size;
				for (const selected of entries.values()) for (const { sessionKey, entry } of selected) {
					sessionKeys.add(sessionKey);
					if (entry.sessionId.trim()) sessionIds.add(entry.sessionId.trim());
					const sessionFile = Reflect.get(entry, "sessionFile");
					if (typeof sessionFile === "string" && sessionFile.trim()) sessionFiles.add(sessionFile.trim());
				}
				if (before === sessionKeys.size + sessionIds.size + sessionFiles.size) break;
				await Promise.all(prepared.reads.map(async ({ storeTarget }, index) => {
					const result = await expectDefined(owners[index], "retained session store").readExactEntries({
						sessionKeys: [...sessionKeys],
						selection: {
							kind: "transcript-aliases",
							sessionIds: [...sessionIds],
							sessionFiles: [...sessionFiles]
						},
						projection: "list",
						env: transferEnv
					});
					entries.set(storeTargetKey(storeTarget), result.entries);
				}));
			}
		}
		const readEntries = (target) => expectDefined(entries.get(storeTargetKey(target)), "prepared session entries");
		const lineage = selection ? void 0 : await prepareCombinedSessionStoreLineage(config, prepared, readEntries);
		const readOptions = {
			...options,
			discovery: {
				env,
				snapshot: options.discovery?.snapshot
			}
		};
		return mergeCombinedSessionStore(config, readOptions, prepared, readEntries, lineage ?? {
			readStored: () => void 0,
			readAlias: () => void 0
		}, lineage?.readIncognitoEntries);
	});
}
//#endregion
export { prepareGatewaySessionEntryReader as i, prepareCombinedSessionStoreForGatewayAsync as n, prepareCombinedSessionStoreLineage as r, loadCombinedSessionStoreForGatewayCoreAsync as t };
