import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import "./utils-aKqR_F_U.mjs";
import { o as isInternalIncludeWriteTarget } from "./includes-CaaCq-XN.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/include-write-boundary.ts
function collectInto(base, next, prefix, output) {
	if (isDeepStrictEqual(base, next)) return;
	if (!isRecord(base) || !isRecord(next)) {
		output.push([...prefix]);
		return;
	}
	for (const key of /* @__PURE__ */ new Set([...Object.keys(base), ...Object.keys(next)])) {
		if (!Object.hasOwn(base, key) || !Object.hasOwn(next, key)) {
			output.push([...prefix, key]);
			continue;
		}
		collectInto(base[key], next[key], [...prefix, key], output);
	}
}
/**
* Lists the changed keyed paths between two authored configs. Arrays and
* primitives compare whole, so a changed array reports its own path rather than
* per-index paths an include boundary could not own positionally.
*/
function collectChangedConfigPaths(base, next) {
	const paths = [];
	collectInto(base, next, [], paths);
	const rootChanged = paths.some((entry) => entry.length === 0);
	return {
		paths: rootChanged ? [] : paths,
		rootChanged
	};
}
function isPathPrefix(prefix, candidate) {
	return prefix.length <= candidate.length && prefix.every((segment, index) => segment === candidate[index]);
}
function pathsEqual(left, right) {
	return left.length === right.length && left.every((segment, index) => segment === right[index]);
}
function pathTouchesAgentRoster(path) {
	return [["agents", "entries"], ["agents", "list"]].some((rosterPath) => isPathPrefix(path, rosterPath) || isPathPrefix(rosterPath, path));
}
function isKeyedAgentEntryPath(path) {
	return path.length === 3 && path[0] === "agents" && path[1] === "entries";
}
function isSoleOwner(entry) {
	return entry.kind === "single" && !entry.hasSiblingOverrides;
}
/**
* Finds the deepest authored include that solely owns every changed path.
*
* A boundary is writable only when it names exactly one file, carries no
* sibling overrides, every enclosing include is itself a sole owner —
* otherwise an ancestor could merge over the included content — and no deeper
* include was recorded beneath it, since a file that still authors $include
* directives cannot absorb a write. The deepest such boundary wins so the
* write stays in the narrowest owning file rather than flattening a nested
* include into its parent.
*/
function resolveIncludeWriteBoundary(params) {
	const provenance = params.provenance;
	if (!provenance || params.changed.rootChanged || params.changed.paths.length === 0) return null;
	if (provenance.some((entry) => entry.path.length === 0)) return null;
	const targets = provenance.flatMap((entry) => entry.targetPaths ?? (entry.targetPath ? [entry.targetPath] : []));
	const canonicalTargets = new Map([...new Set(targets)].map((target) => [target, resolvePathViaExistingAncestorSync(target)]));
	let best = null;
	let bestDepth = 0;
	for (const entry of provenance) {
		if (!isSoleOwner(entry) || !entry.targetPath || entry.hasArrayAncestor) continue;
		if (provenance.some((candidate) => candidate !== entry && candidate.path.length <= entry.path.length && isPathPrefix(candidate.path, entry.path) && !isSoleOwner(candidate))) continue;
		if (provenance.some((candidate) => candidate !== entry && candidate.path.length > entry.path.length && isPathPrefix(entry.path, candidate.path))) continue;
		if (!params.changed.paths.every((changedPath) => isPathPrefix(entry.path, changedPath))) continue;
		const canonicalTarget = canonicalTargets.get(entry.targetPath);
		if (provenance.some((candidate) => !pathsEqual(candidate.path, entry.path) && (candidate.targetPaths ?? (candidate.targetPath ? [candidate.targetPath] : [])).some((target) => canonicalTargets.get(target) === canonicalTarget))) continue;
		if (entry.path.length > bestDepth) {
			best = {
				boundaryPath: entry.path,
				includePath: entry.targetPath
			};
			bestDepth = entry.path.length;
		}
	}
	return best;
}
/** Exact keyed-entry includes whose authored pointers may survive a root-owned roster edit. */
function resolveKeyedAgentEntryIncludePreservation(params) {
	const provenance = params.provenance;
	if (!provenance) return null;
	const rosterOwnership = provenance.filter((entry) => pathTouchesAgentRoster(entry.path));
	if (rosterOwnership.length === 0 || rosterOwnership.some((entry) => !isKeyedAgentEntryPath(entry.path))) return null;
	const includePaths = [];
	for (const entry of rosterOwnership) {
		if (rosterOwnership.filter((candidate) => pathsEqual(candidate.path, entry.path)).length !== 1) return null;
		const boundary = resolveIncludeWriteBoundary({
			provenance,
			changed: {
				paths: [[...entry.path, "$value"]],
				rootChanged: false
			}
		});
		if (!boundary || !pathsEqual(boundary.boundaryPath, entry.path) || boundary.includePath !== entry.targetPath || !isInternalIncludeWriteTarget({
			configPath: params.configPath,
			includePath: boundary.includePath
		})) return null;
		includePaths.push([...entry.path]);
	}
	return { includePaths };
}
//#endregion
export { resolveIncludeWriteBoundary as n, resolveKeyedAgentEntryIncludePreservation as r, collectChangedConfigPaths as t };
