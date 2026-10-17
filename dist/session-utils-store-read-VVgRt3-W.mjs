import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { i as loadExactSessionEntryCandidatesReadOnlyBatch, r as loadExactSessionEntryCandidates } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-8r2jOQkD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
//#region src/gateway/session-utils-store-read.ts
/** Single-target resolution keeps its original lazy read and failure order. */
function readGatewaySessionStore(read) {
	if (read.result === void 0) {
		const loaded = loadGatewaySessionLookupStore(read.storePath, read.clone, read.agentId, read.options);
		read.result = ok(loaded.store);
		read.readSource = loaded.readSource;
		read.capturedReadSource = loaded.capturedReadSource;
	}
	if (!read.result.ok) throw read.result.error;
	return read.result.value;
}
/** Populate exact logical lookups without materializing unrelated store entries. */
function loadGatewaySessionStoreReads(reads) {
	const pending = reads.filter((read) => read.result === void 0);
	const results = loadExactSessionEntryCandidatesReadOnlyBatch(pending.map((read) => ({
		agentId: read.agentId,
		env: read.options.env,
		storePath: read.storePath,
		projection: read.options.projection,
		clone: false,
		sessionKeys: expectDefined(read.options.exactKeys, "exact batch lookup keys"),
		onReadSource: (source) => {
			read.readSource = source;
		}
	})));
	for (const [index, read] of pending.entries()) {
		const result = expectDefined(results[index], "exact batch lookup result");
		read.result = result.ok ? ok(Object.fromEntries(result.value.map(({ sessionKey, entry }) => [sessionKey, entry]))) : result;
		if (!result.ok) read.readSource = void 0;
	}
}
function loadGatewaySessionLookupStore(storePath, clone, agentId, options = {}) {
	const cache = options.cache;
	const cacheKey = cache ? `${storePath}\u0000${agentId ?? ""}\u0000${clone === false ? "0" : "1"}\u0000${options.readOnly}\u0000${options.projection ?? "full"}\u0000${options.readConsistency ?? ""}\u0000${options.exactKeys?.join("") ?? ""}` : "";
	if (cache) {
		const cached = cache.get(cacheKey);
		if (cached) return cached;
	}
	const loaded = loadGatewaySessionLookupStoreUncached(storePath, clone, agentId, options);
	cache?.set(cacheKey, loaded);
	return loaded;
}
function loadGatewaySessionLookupStoreUncached(storePath, clone, agentId, options = {}) {
	if (options.exactKeys) {
		let readSource;
		let capturedReadSource;
		const target = options.readSource ? {
			readSource: options.readSource,
			readOnly: true
		} : {
			...agentId ? { agentId } : {},
			storePath,
			readOnly: options.readOnly !== false || clone === false
		};
		const entries = loadExactSessionEntryCandidates({
			...target,
			env: options.env,
			projection: options.projection,
			sessionKeys: options.exactKeys,
			onReadSource: (source) => {
				readSource = {
					agentId: source.agentId,
					path: source.path
				};
				capturedReadSource = source;
			}
		});
		return {
			store: Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry])),
			...readSource ? { readSource } : {},
			...capturedReadSource ? { capturedReadSource } : {}
		};
	}
	const listEntries = options.readOnly ? listSessionEntriesReadOnly : listSessionEntriesCore;
	return { store: Object.fromEntries(listEntries({
		env: options.env,
		...agentId ? { agentId } : {},
		...clone === false ? { clone: false } : {},
		...options.projection ? { projection: options.projection } : {},
		...options.readConsistency ? { readConsistency: options.readConsistency } : {},
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry])) };
}
//#endregion
export { readGatewaySessionStore as n, loadGatewaySessionStoreReads as t };
