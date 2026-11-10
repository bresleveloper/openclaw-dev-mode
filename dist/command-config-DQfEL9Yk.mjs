import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { f as resolveConfigSecretRef, s as getAuthoredConfigSecretRef } from "./resolution-facts-D_pto3MV.mjs";
import { h as isExpectedResolvedSecretValue } from "./runtime-shared-DqMZ_k3n.mjs";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-query-DOYceNvb.mjs";
import { n as getPath } from "./path-utils-aDSU1mEq.mjs";
import "./target-registry-CSb4wosA.mjs";
//#region src/secrets/command-config.ts
/** Collects and analyzes command-scoped secret assignments from OpenClaw config. */
/** Analyzes command secret assignments without mutating the source config. */
function analyzeCommandSecretAssignmentsFromSnapshot(params) {
	const defaults = params.sourceConfig.secrets?.defaults;
	const assignments = [];
	const diagnostics = [];
	const unresolved = [];
	const inactive = [];
	for (const target of discoverConfigSecretTargetsByIds(params.sourceConfig, params.targetIds)) {
		if (params.allowedPaths && !params.allowedPaths.has(target.path)) continue;
		const inlineCandidateRef = resolveConfigSecretRef({
			config: params.sourceConfig,
			path: target.path,
			value: target.value,
			defaults
		});
		const explicitRef = parseSecretRef(target.refValue, defaults);
		if (!(explicitRef ?? inlineCandidateRef)) continue;
		const resolved = getPath(params.resolvedConfig, target.pathSegments);
		if (getAuthoredConfigSecretRef(params.resolvedConfig, target.path) || !isExpectedResolvedSecretValue(resolved, target.entry.expectedResolvedValue)) {
			const isInactive = params.inactiveRefPaths?.has(target.path);
			if (isInactive) diagnostics.push(`${target.path}: secret ref is configured on an inactive surface; skipping command-time assignment.`);
			(isInactive ? inactive : unresolved).push({
				path: target.path,
				pathSegments: [...target.pathSegments]
			});
			continue;
		}
		assignments.push({
			path: target.path,
			pathSegments: [...target.pathSegments],
			value: resolved
		});
		if (target.entry.secretShape === "sibling_ref" && explicitRef && inlineCandidateRef) diagnostics.push(`${target.path}: both inline and sibling ref were present; sibling ref took precedence.`);
	}
	return {
		assignments,
		diagnostics,
		unresolved,
		inactive
	};
}
//#endregion
export { analyzeCommandSecretAssignmentsFromSnapshot as t };
