import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { r as listAgentEntriesWithSource } from "./agent-roster-gkYP38su.mjs";
import { n as isTrustedSafeBinPath, o as listRiskyConfiguredSafeBins, s as normalizeSafeBinName, t as getTrustedSafeBinDirs } from "./exec-safe-bin-trust-C3Qa4Q90.mjs";
import { c as resolveCommandResolutionFromArgv } from "./exec-command-resolution-BBO1XScO.mjs";
import { i as resolveMergedSafeBinProfileFixtures, n as listInterpreterLikeSafeBins } from "./exec-safe-bin-runtime-policy-_gMQWKKJ.mjs";
import { n as normalizeConfiguredTrustedSafeBinDirs, t as normalizeConfiguredSafeBins } from "./exec-safe-bin-config-BLqQY2Oz.mjs";
//#region src/commands/doctor/shared/exec-safe-bins.ts
function collectExecSafeBinScopes(cfg) {
	const scopes = [];
	const globalExec = asNullableRecord(cfg.tools?.exec);
	const globalTrustedDirs = normalizeConfiguredTrustedSafeBinDirs(globalExec?.safeBinTrustedDirs);
	const candidates = [{
		exec: globalExec,
		scopePath: "tools.exec",
		local: void 0
	}, ...listAgentEntriesWithSource(cfg).map(({ entry: agent, source }) => {
		const exec = asNullableRecord(agent.tools?.exec);
		return {
			exec,
			local: exec,
			scopePath: source.kind === "entries" ? `agents.entries.${source.key}.tools.exec` : `agents.list.${source.index}.tools.exec`
		};
	})];
	for (const { exec, scopePath, local } of candidates) {
		if (!exec) continue;
		const safeBins = normalizeConfiguredSafeBins(exec.safeBins);
		if (safeBins.length === 0) continue;
		scopes.push({
			scopePath,
			safeBins,
			exec,
			mergedProfiles: resolveMergedSafeBinProfileFixtures({
				global: globalExec,
				local
			}) ?? {},
			trustedSafeBinDirs: getTrustedSafeBinDirs({ extraDirs: [...globalTrustedDirs, ...normalizeConfiguredTrustedSafeBinDirs(local?.safeBinTrustedDirs)] })
		});
	}
	return scopes;
}
function inspectSafeBinProfiles(scope) {
	const interpreterBins = new Set(listInterpreterLikeSafeBins(scope.safeBins));
	const riskyHits = listRiskyConfiguredSafeBins(scope.safeBins);
	const riskyBins = new Set(riskyHits.map((hit) => hit.bin));
	return {
		interpreterBins,
		riskyHits,
		missingBins: scope.safeBins.filter((bin) => !scope.mergedProfiles[bin] && !riskyBins.has(normalizeSafeBinName(bin)))
	};
}
function scanExecSafeBinCoverage(cfg) {
	const hits = [];
	for (const scope of collectExecSafeBinScopes(cfg)) {
		const { interpreterBins, riskyHits, missingBins } = inspectSafeBinProfiles(scope);
		for (const bin of missingBins) hits.push({
			scopePath: scope.scopePath,
			bin,
			kind: "missingProfile",
			isInterpreter: interpreterBins.has(bin)
		});
		for (const hit of riskyHits) hits.push({
			scopePath: scope.scopePath,
			bin: hit.bin,
			kind: "riskySemantics",
			warning: hit.warning
		});
	}
	return hits;
}
function scanExecSafeBinTrustedDirHints(cfg) {
	const hits = [];
	for (const scope of collectExecSafeBinScopes(cfg)) for (const bin of scope.safeBins) {
		const resolution = resolveCommandResolutionFromArgv([bin]);
		if (!resolution?.execution.resolvedPath) continue;
		if (isTrustedSafeBinPath({
			resolvedPath: resolution.execution.resolvedPath,
			trustedDirs: scope.trustedSafeBinDirs
		})) continue;
		hits.push({
			scopePath: scope.scopePath,
			bin,
			resolvedPath: resolution.execution.resolvedPath
		});
	}
	return hits;
}
function collectLimitedWarnings(hits, format, remainder) {
	const lines = hits.slice(0, 5).map(format);
	if (hits.length > 5) lines.push(`- ${hits.length - 5} more ${remainder}`);
	return lines;
}
function collectExecSafeBinCoverageWarnings(params) {
	const interpreterHits = params.hits.filter((hit) => hit.kind === "missingProfile" && hit.isInterpreter);
	const customHits = params.hits.filter((hit) => hit.kind === "missingProfile" && !hit.isInterpreter);
	const riskyHits = params.hits.filter((hit) => hit.kind === "riskySemantics");
	const lines = [
		...collectLimitedWarnings(interpreterHits, (hit) => `- ${sanitizeForLog(hit.scopePath)}.safeBins includes interpreter/runtime '${sanitizeForLog(hit.bin)}' without profile.`, "interpreter/runtime safeBins entries are missing profiles."),
		...collectLimitedWarnings(customHits, (hit) => `- ${sanitizeForLog(hit.scopePath)}.safeBins entry '${sanitizeForLog(hit.bin)}' is missing safeBinProfiles.${sanitizeForLog(hit.bin)}.`, "custom safeBins entries are missing profiles."),
		...collectLimitedWarnings(riskyHits, (hit) => `- ${sanitizeForLog(hit.scopePath)}.safeBins includes '${sanitizeForLog(hit.bin)}': ${sanitizeForLog(hit.warning ?? "prefer explicit allowlist entries or approval-gated runs.")}`, "safeBins entries should not use the low-risk safeBins fast path.")
	];
	if (customHits.length > 0) lines.push(`- Run "${params.doctorFixCommand}" to scaffold missing custom safeBinProfiles entries.`);
	return lines;
}
function collectExecSafeBinTrustedDirHintWarnings(hits) {
	if (hits.length === 0) return [];
	const lines = collectLimitedWarnings(hits, (hit) => `- ${sanitizeForLog(hit.scopePath)}.safeBins entry '${sanitizeForLog(hit.bin)}' resolves to '${sanitizeForLog(hit.resolvedPath)}' outside trusted safe-bin dirs.`, "safeBins entries resolve outside trusted safe-bin dirs.");
	lines.push("- If intentional, add the binary directory to tools.exec.safeBinTrustedDirs (global or agent scope).");
	return lines;
}
function maybeRepairExecSafeBinProfiles(cfg) {
	const next = structuredClone(cfg);
	const changes = [];
	const warnings = [];
	for (const scope of collectExecSafeBinScopes(next)) {
		const { interpreterBins, riskyHits, missingBins } = inspectSafeBinProfiles(scope);
		for (const hit of riskyHits) warnings.push(`- ${scope.scopePath}.safeBins includes '${hit.bin}': ${hit.warning}`);
		if (missingBins.length === 0) continue;
		const profileHolder = asNullableRecord(scope.exec.safeBinProfiles) ?? (scope.exec.safeBinProfiles = {});
		for (const bin of missingBins) {
			if (interpreterBins.has(bin)) {
				warnings.push(`- ${scope.scopePath}.safeBins includes interpreter/runtime '${bin}' without profile; remove it from safeBins or use explicit allowlist entries.`);
				continue;
			}
			if (profileHolder[bin] !== void 0) continue;
			profileHolder[bin] = {};
			changes.push(`- ${scope.scopePath}.safeBinProfiles.${bin}: added scaffold profile {} (review and tighten flags/positionals).`);
		}
	}
	return {
		config: changes.length > 0 || warnings.length > 0 ? next : cfg,
		changes,
		warnings
	};
}
//#endregion
export { scanExecSafeBinTrustedDirHints as a, scanExecSafeBinCoverage as i, collectExecSafeBinTrustedDirHintWarnings as n, maybeRepairExecSafeBinProfiles as r, collectExecSafeBinCoverageWarnings as t };
