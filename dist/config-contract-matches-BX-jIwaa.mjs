import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { t as appendConfigPathSegment } from "./dot-path-BSC76DAI.mjs";
//#region src/plugins/config-contract-matches.ts
function normalizePathPattern(pathPattern) {
	return normalizeStringEntries(pathPattern.split("."));
}
/** Match declared migration sources without widening a scoped config edit. */
function hasPluginConfigMigrationSource(params) {
	return params.pathPatterns?.some((pathPattern) => {
		const pattern = normalizePathPattern(pathPattern);
		return (!params.touchedPaths || params.touchedPaths.some((parts) => pattern.slice(0, parts.length).every((segment, index) => segment === "*" || segment === parts[index]))) && collectPluginConfigContractMatches({
			root: params.root,
			pathPattern
		}).length > 0;
	}) ?? false;
}
function parseCanonicalArrayIndex(segment, length) {
	const index = parseConfigPathArrayIndex(segment);
	return index !== void 0 && index < length ? index : null;
}
/** Collect concrete config values that match a plugin contract path pattern. */
function collectPluginConfigContractMatches(params) {
	const pattern = normalizePathPattern(params.pathPattern);
	if (pattern.length === 0) return [];
	let states = [{
		segments: [],
		value: params.root
	}];
	for (const segment of pattern) {
		const nextStates = [];
		for (const state of states) {
			if (segment === "*") {
				if (Array.isArray(state.value)) {
					for (const [index, value] of state.value.entries()) nextStates.push({
						segments: [...state.segments, index],
						value,
						parent: state.value
					});
					continue;
				}
				if (isRecord(state.value)) for (const [key, value] of Object.entries(state.value)) nextStates.push({
					segments: [...state.segments, key],
					value,
					parent: state.value
				});
				continue;
			}
			if (Array.isArray(state.value)) {
				const index = parseCanonicalArrayIndex(segment, state.value.length);
				if (index !== null) nextStates.push({
					segments: [...state.segments, index],
					value: state.value[index],
					parent: state.value
				});
				continue;
			}
			if (!isRecord(state.value) || !Object.hasOwn(state.value, segment)) continue;
			nextStates.push({
				segments: [...state.segments, segment],
				value: state.value[segment],
				parent: state.value
			});
		}
		states = nextStates;
		if (states.length === 0) break;
	}
	return states.map((state) => ({
		path: state.segments.reduce(appendConfigPathSegment, ""),
		value: state.value,
		parent: state.parent,
		key: String(state.segments.at(-1))
	}));
}
//#endregion
export { hasPluginConfigMigrationSource as n, collectPluginConfigContractMatches as t };
