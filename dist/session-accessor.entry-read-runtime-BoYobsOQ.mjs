import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as collectCanonicalSessionLookupKeys } from "./main-session-key-BNNxukz6.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import "./targets-DJGC6v85.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { t as prepareSessionStoreTargetInventoryRead } from "./session-store-target-runtime-D11id0W-.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
//#region src/config/sessions/session-accessor.entry-read-runtime.ts
function selectCanonicalSessionEntryMatch(entries, canonicalKey) {
	let selected;
	for (const match of entries) {
		if (selected) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
		if (match.sessionKey !== canonicalKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${canonicalKey}`);
		selected = match;
	}
	return selected;
}
/** Read descriptive entry data with the logical accessor's existing candidate selection. */
async function readResolvedSessionEntryInWorker(scope) {
	return (await readResolvedSessionEntriesInWorker({
		...scope,
		sessionKeys: [scope.sessionKey]
	})).get(scope.sessionKey)?.entry;
}
/** One selected metadata read per store, shared by every requested logical owner. */
async function readResolvedSessionEntriesInWorker(input, projection = "exact") {
	const targets = await readResolvedSessionStoreTargetsInWorker(input, projection);
	return new Map([...targets].map(([key, { storePath: _storePath, ...target }]) => [key, target]));
}
async function readResolvedSessionStoreTargetsInWorker(input, projection = "exact") {
	const scope = {
		...input,
		env: cloneEnvWithPlatformSemantics(input.env ?? process.env)
	};
	const actorEnv = input.env === void 0 ? void 0 : scope.env;
	const result = /* @__PURE__ */ new Map();
	const prepared = [...new Set(scope.sessionKeys)].map((requestedKey) => {
		const { agentId, canonicalKey } = resolveSessionStoreIdentity({
			...scope,
			sessionKey: requestedKey.trim()
		});
		return {
			agentId,
			canonicalKey,
			requestedKey,
			storePath: resolveSessionStorePathCore(scope.cfg.session?.store, {
				agentId,
				env: scope.env
			}),
			sessionKeys: collectCanonicalSessionLookupKeys({
				agentId,
				canonicalKey,
				requestedKey: requestedKey.trim(),
				mainKey: scope.cfg.session?.mainKey
			})
		};
	});
	const requests = [];
	for (const request of prepared) {
		const { agentId, canonicalKey, requestedKey } = request;
		const actorScope = {
			...scope,
			env: actorEnv,
			sessionKey: canonicalKey
		};
		const memory = captureMemoryExactSessionReader({
			...actorScope,
			agentId
		});
		if (memory) {
			result.set(requestedKey, {
				agentId,
				canonicalKey,
				requestedKey,
				storeKey: canonicalKey,
				storePath: memory.path,
				entry: memory.read(canonicalKey, projection === "worktree" ? "list" : void 0)
			});
			continue;
		}
		requests.push(request);
	}
	if (!requests.length) return result;
	const agents = new Set(requests.map(({ agentId }) => agentId));
	const read = async (targets, assertCurrent) => {
		const stores = [...new Map([...requests, ...targets.filter(({ agentId }) => agents.has(agentId))].map((target) => [JSON.stringify([target.agentId, target.storePath]), target])).values()];
		return withSessionEntriesFromStoresInWorker(stores.map(({ agentId, storePath }) => ({
			agentId,
			storePath,
			sessionKeys: [...new Set(requests.filter((request) => request.agentId === agentId).flatMap((request) => request.sessionKeys))],
			projection,
			snapshotFields: [],
			env: scope.env
		})), (loaded) => {
			assertCurrent();
			const entries = loaded.map(({ result: loadedResult }, index) => ({
				agentId: expectDefined(stores[index], "session store request").agentId,
				storePath: loaded[index].database.path,
				rows: new Map(loadedResult.entries.map((entry) => [entry.sessionKey, entry]))
			}));
			for (const request of requests) {
				const selected = selectCanonicalSessionEntryMatch(entries.flatMap(({ agentId, rows }) => agentId === request.agentId ? request.sessionKeys.flatMap((key) => rows.get(key) ?? []) : []), request.canonicalKey);
				result.set(request.requestedKey, {
					agentId: request.agentId,
					canonicalKey: request.canonicalKey,
					requestedKey: request.requestedKey,
					storeKey: selected?.sessionKey ?? request.canonicalKey,
					entry: selected?.entry,
					storePath: selected ? entries.find(({ rows }) => rows.get(selected.sessionKey) === selected).storePath : request.storePath
				});
			}
			return result;
		});
	};
	if (!scope.cfg.session?.store?.includes("{agentId}")) return read([], () => {});
	const inventory = prepareSessionStoreTargetInventory(scope.cfg, [.../* @__PURE__ */ new Set([...agents, ...listConfiguredSessionStoreAgentIds(scope.cfg)])], scope.env, "recovery");
	return prepareSessionStoreTargetInventoryRead(inventory).withRead((sources, assertCurrent) => read(sources.agents.flatMap(({ result: source }) => source.available ? source.targets : []), assertCurrent));
}
//#endregion
export { selectCanonicalSessionEntryMatch as i, readResolvedSessionEntryInWorker as n, readResolvedSessionStoreTargetsInWorker as r, readResolvedSessionEntriesInWorker as t };
