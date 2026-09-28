import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { i as resolveConfigIncludeWriteBoundary } from "./mutate-CdmDoEFy.mjs";
//#region src/commands/doctor/shared/roster-include-write.ts
/** Split only a root roster repair followed by one include-owned plugin recovery. */
function prepareCanonicalRosterBeforePluginInclude(params) {
	if (!params.persistCanonicalAgentRoster || !params.installedPluginIdRecovery?.size) return;
	const includeCandidate = cloneConfigWithResolutionFacts(params.nextConfig);
	includeCandidate.agents = params.snapshot.sourceConfig.agents;
	const boundary = resolveConfigIncludeWriteBoundary({
		snapshot: params.snapshot,
		nextConfig: includeCandidate,
		explicitSetPaths: params.explicitSetPaths?.filter(([key]) => key !== "agents")
	});
	if (!boundary || boundary.boundaryPath[0] !== "plugins") return;
	const rosterCandidate = cloneConfigWithResolutionFacts(params.snapshot.sourceConfig);
	rosterCandidate.agents = params.nextConfig.agents;
	return rosterCandidate;
}
/** Preview the same physical-owner sequence that the guarded Doctor writer uses. */
function canWriteDoctorInclude(snapshot, nextConfig, options, installedPluginIdRecovery) {
	return Boolean(resolveConfigIncludeWriteBoundary({
		snapshot,
		nextConfig,
		...options
	}) || prepareCanonicalRosterBeforePluginInclude({
		snapshot,
		nextConfig,
		...options,
		installedPluginIdRecovery
	}));
}
//#endregion
export { prepareCanonicalRosterBeforePluginInclude as n, canWriteDoctorInclude as t };
