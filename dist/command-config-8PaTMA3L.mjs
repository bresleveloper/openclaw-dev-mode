import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { f as resolveConfigSecretRef, s as getAuthoredConfigSecretRef } from "./resolution-facts-HH1cnmIY.mjs";
import { m as isExpectedResolvedSecretValue } from "./runtime-shared-7qI1DEx4.mjs";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-query-f56MMhmb.mjs";
import { n as getPath } from "./path-utils-DQXhHs4r.mjs";
import "./target-registry-1a6D8fYt.mjs";
//#region src/secrets/command-config.ts
/** Collects and analyzes command-scoped secret assignments from OpenClaw config. */
/**
* Compares source SecretRefs with the active resolved snapshot for command-time assignments.
*/
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
			if (params.inactiveRefPaths?.has(target.path)) {
				diagnostics.push(`${target.path}: secret ref is configured on an inactive surface; skipping command-time assignment.`);
				inactive.push({
					path: target.path,
					pathSegments: [...target.pathSegments]
				});
				continue;
			}
			unresolved.push({
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
