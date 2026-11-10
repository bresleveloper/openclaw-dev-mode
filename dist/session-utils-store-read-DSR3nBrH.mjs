import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { n as loadExactSessionEntryCandidates, r as loadExactSessionEntryCandidatesReadOnlyBatch } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
import { t as listSessionEntriesCore } from "./session-accessor.entry-BLpjjUTc.mjs";
//#region src/gateway/session-utils-store-read.ts
function gatewaySessionStoreReadOptions(params, keys, readOnly) {
	return {
		env: params.env,
		readOnly,
		...params.exactRead || params.preserveQualifiedAddress ? { exactKeys: keys } : {},
		...params.projection ? { projection: params.projection } : {},
		...params.readConsistency ? { readConsistency: params.readConsistency } : {},
		...params.storeCache ? { cache: params.storeCache } : {}
	};
}
/** Single-target resolution keeps its original lazy read and failure order. */
function readGatewaySessionStore(read) {
	if (read.result === void 0) {
		const { storePath, clone, agentId, options } = read;
		const cache = options.cache;
		const cacheKey = cache ? `${storePath}\u0000${agentId ?? ""}\u0000${clone === false ? "0" : "1"}\u0000${options.readOnly}\u0000${JSON.stringify(options.projection ?? "full")}\u0000${options.readConsistency ?? ""}\u0000${options.exactKeys?.join("") ?? ""}` : "";
		let loaded = cache?.get(cacheKey);
		if (!loaded) {
			loaded = loadGatewaySessionLookupStore(read);
			cache?.set(cacheKey, loaded);
		}
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
function loadGatewaySessionLookupStore({ storePath, clone, agentId, options }) {
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
		...options.projection ? { projection: typeof options.projection === "object" ? "full" : options.projection } : {},
		...options.readConsistency ? { readConsistency: options.readConsistency } : {},
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry])) };
}
//#endregion
export { loadGatewaySessionStoreReads as n, readGatewaySessionStore as r, gatewaySessionStoreReadOptions as t };
