import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-B7chVWi3.mjs";
//#region src/gateway/session-utils-store-selection.ts
/** Ordinary Gateway lookups exclude rows reserved for suppressed run effects. */
function omitInternalSessionEffectsEntries(store, storeKeys) {
	for (const storeKey of storeKeys) if (isInternalSessionEffectsKey(storeKey)) delete store[storeKey];
}
function findCanonicalStoreMatch(store, candidates, onCanonicalError) {
	const matches = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const trimmed = normalizeOptionalString(candidate) ?? "";
		if (!trimmed) continue;
		const exact = store[trimmed];
		if (exact) matches.set(trimmed, {
			entry: exact,
			key: trimmed
		});
	}
	if (matches.size === 0) return;
	const canonicalKey = candidates[0] ?? "";
	const selected = matches.get(canonicalKey) ?? matches.values().next().value;
	if (matches.size > 1) {
		const error = canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey || selected?.key || ""}`);
		if (!onCanonicalError) throw error;
		onCanonicalError(error);
	}
	if (selected && selected.key !== canonicalKey) {
		const error = canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${canonicalKey || selected.key}`);
		if (!onCanonicalError) throw error;
		onCanonicalError(error);
	}
	return selected;
}
/** Selects canonical rows in read order; callers own acquisition or admitted reads. */
function resolveGatewaySessionStoreReadResults(params) {
	const first = expectDefined(params.reads[0], "first configured or discovered session store");
	let selectedStorePath = first.storePath;
	let selectedStore = params.readStore(first);
	let selectedReadSource = first.readSource;
	let selectedCapturedReadSource = first.capturedReadSource;
	let canonicalValidationError;
	const recordCanonicalError = params.deferCanonicalValidation ? (error) => {
		canonicalValidationError ??= error;
	} : void 0;
	let selectedMatch = findCanonicalStoreMatch(selectedStore, params.scanTargets, recordCanonicalError);
	for (const candidate of params.reads.slice(1)) {
		const store = params.readStore(candidate);
		const match = findCanonicalStoreMatch(store, params.scanTargets, recordCanonicalError);
		if (!match) continue;
		if (selectedMatch) {
			const error = canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${params.canonicalKey}`);
			if (!recordCanonicalError) throw error;
			recordCanonicalError(error);
			if (match.key !== params.canonicalKey || selectedMatch.key === params.canonicalKey) continue;
		}
		selectedStorePath = candidate.storePath;
		selectedStore = store;
		selectedReadSource = candidate.readSource;
		selectedCapturedReadSource = candidate.capturedReadSource;
		selectedMatch = match;
	}
	return {
		storePath: selectedStorePath,
		store: selectedStore,
		...selectedReadSource ? { readSource: selectedReadSource } : {},
		...selectedCapturedReadSource ? { capturedReadSource: selectedCapturedReadSource } : {},
		capturedReadSources: params.reads.flatMap((read) => read.capturedReadSource ? [read.capturedReadSource] : []),
		match: selectedMatch,
		...canonicalValidationError ? { canonicalValidationError } : {}
	};
}
/** Retain scanned stages without planning a replacement before legacy selection finishes. */
async function prepareGatewaySessionStoreReadPlan(params) {
	const resolve = async (plan) => await params.prepareReads(plan.reads, () => {
		if (plan.reads.some((read) => read.result === void 0)) throw new Error("Session lookup facts were not prepared");
		const target = plan.resolve();
		if (target && params.onSelected) {
			const result = params.onSelected(target);
			if (isPromiseLike(result)) {
				Promise.resolve(result).catch(() => {});
				throw new Error("Session selection consumers must remain synchronous");
			}
		}
		return target;
	});
	const deletedMain = params.legacy;
	if (deletedMain) {
		const target = await resolve(deletedMain);
		if (target) return {
			target,
			plan: {
				reads: deletedMain.reads,
				resolve() {
					const current = deletedMain.resolve();
					if (!current) throw new Error("Prepared legacy session target changed");
					return current;
				}
			}
		};
	}
	const current = params.prepareCurrent();
	return {
		target: await resolve(current),
		plan: {
			reads: [...deletedMain?.reads ?? [], ...current.reads],
			resolve: () => deletedMain?.resolve() ?? current.resolve()
		}
	};
}
//#endregion
export { resolveGatewaySessionStoreReadResults as i, omitInternalSessionEffectsEntries as n, prepareGatewaySessionStoreReadPlan as r, findCanonicalStoreMatch as t };
