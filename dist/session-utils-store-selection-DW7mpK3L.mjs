import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { g as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-D1TSJMmX.mjs";
//#region src/gateway/session-utils-store-selection.ts
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
//#endregion
export { resolveGatewaySessionStoreReadResults as n, findCanonicalStoreMatch as t };
