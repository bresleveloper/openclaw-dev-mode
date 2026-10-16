import { i as __exportAll } from "./doctor-contract-CsTNmbMa.mjs";
import { r as normalizeMatrixMessagingTarget, t as isMatrixQualifiedUserId } from "./target-ids-Nwx7cMVE.mjs";
import { n as listMatrixDirectoryGroupsLive, r as listMatrixDirectoryPeersLive } from "./directory-live-DW5UykLL.mjs";
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/matrix/src/resolve-targets.ts
var resolve_targets_exports = /* @__PURE__ */ __exportAll({ resolveMatrixTargets: () => resolveMatrixTargets });
function normalizeLookupQuery(query) {
	return normalizeOptionalLowercaseString(query) ?? "";
}
function findExactDirectoryMatches(matches, query) {
	const normalized = normalizeLookupQuery(query);
	if (!normalized) return [];
	return matches.filter((match) => {
		const id = normalizeOptionalLowercaseString(match.id);
		const name = normalizeOptionalLowercaseString(match.name);
		const handle = normalizeOptionalLowercaseString(match.handle);
		return normalized === id || normalized === name || normalized === handle;
	});
}
function pickBestDirectoryMatch(matches, query, kind) {
	const exact = findExactDirectoryMatches(matches, query);
	if (kind === "user") return exact.length === 1 ? { best: exact[0] } : { note: matches.length === 0 ? "no matches" : exact.length > 1 ? "multiple exact matches; use full Matrix ID" : "no exact match; use full Matrix ID" };
	const candidates = exact.length > 0 ? exact : matches;
	return {
		best: candidates[0],
		note: candidates.length > 1 ? `multiple ${exact.length > 0 ? "exact " : ""}matches; chose first` : void 0
	};
}
async function readCachedMatches(cache, query, lookup) {
	const key = normalizeLookupQuery(query);
	if (!key) return [];
	const cached = cache.get(key);
	if (cached) return cached;
	const matches = await lookup(query.trim());
	cache.set(key, matches);
	return matches;
}
async function resolveMatrixTargets(params) {
	const results = [];
	const lookupCache = /* @__PURE__ */ new Map();
	const lookup = params.kind === "user" ? listMatrixDirectoryPeersLive : listMatrixDirectoryGroupsLive;
	for (const input of params.inputs) {
		const trimmed = input.trim();
		if (!trimmed) {
			results.push({
				input,
				resolved: false,
				note: "empty input"
			});
			continue;
		}
		const normalizedTarget = normalizeMatrixMessagingTarget(trimmed);
		if (normalizedTarget && (params.kind === "user" ? isMatrixQualifiedUserId(normalizedTarget) : normalizedTarget.startsWith("!"))) {
			results.push({
				input,
				resolved: true,
				id: normalizedTarget
			});
			continue;
		}
		try {
			const { best, note } = pickBestDirectoryMatch(await readCachedMatches(lookupCache, trimmed, (query) => lookup({
				cfg: params.cfg,
				accountId: params.accountId,
				query,
				limit: 5
			})), trimmed, params.kind);
			results.push({
				input,
				resolved: Boolean(best?.id),
				id: best?.id,
				name: best?.name,
				note
			});
		} catch (err) {
			params.runtime?.error?.(`matrix resolve failed: ${String(err)}`);
			results.push({
				input,
				resolved: false,
				note: "lookup failed"
			});
		}
	}
	return results;
}
//#endregion
export { resolve_targets_exports as n, resolveMatrixTargets as t };
