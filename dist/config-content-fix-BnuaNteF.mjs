import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { i as INCLUDE_KEY } from "./includes-BkzfmxST.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { h as LEGACY_AGENT_ROSTER_RULES, n as findLegacyConfigRuleIssues } from "./legacy-Ccc1pb1u.mjs";
import { n as containsAuthoredInclude } from "./include-migration-ownership-jJubBWXv.mjs";
import { r as collectBlockedLegacyOpenAICodexProviderPlan } from "./legacy-config-migrations.runtime.models-BRNqx9R4.mjs";
import { n as validateConfigObjectRawWithPlugins } from "./validation-BeAnc62d.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import { a as transformConfigFile } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { i as restoreDoctorConfigEnvRefs, n as applyUnknownConfigKeyStep, r as prepareDoctorConfigReferenceSource, t as applyLegacyCompatibilityStep } from "./config-flow-steps-DJkdcxLn.mjs";
import { t as addDoctorLegacyIssues } from "./legacy-config-issues-BWZ_nhfc.mjs";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-T3qeDQIp.mjs";
import { t as normalizeCompatibilityConfigValues } from "./legacy-config-core-migrate-ChPShz81.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/config-content-fix.ts
/** Drop the reader's implicit `agents.entries.main` placeholder unless a repair changed it. */
function withoutImplicitMainRoster(config, authored) {
	const { entries, ...agents } = config.agents ?? {};
	if (!isDeepStrictEqual(entries, { main: {} })) return config;
	const authoredAgents = isRecord(authored) ? authored.agents : void 0;
	if (isRecord(authoredAgents) && Object.hasOwn(authoredAgents, "entries")) return {
		...config,
		agents: {
			...agents,
			entries: {}
		}
	};
	if (authoredAgents === void 0 && Object.keys(agents).length === 0) {
		const { agents: _agents, ...rest } = config;
		return rest;
	}
	return {
		...config,
		agents
	};
}
/** Apply doctor's config-content repairs to openclaw.json, or preview them with dryRun. */
async function fixConfigContent(params = {}) {
	const read = await readConfigFileSnapshot({ observe: false });
	const report = {
		path: read.path,
		changes: [],
		warnings: [],
		issues: []
	};
	const doctorFixCommand = formatCliCommand("openclaw doctor --fix");
	if (!read.exists) return {
		...report,
		status: "skipped",
		reason: "config file not found"
	};
	if (containsAuthoredInclude(read.parsed)) return {
		...report,
		status: "skipped",
		reason: `config uses ${INCLUDE_KEY}; run ${doctorFixCommand} instead`
	};
	const referenceSource = prepareDoctorConfigReferenceSource(read);
	if (!referenceSource) {
		const detail = read.issues[0]?.message;
		return {
			...report,
			status: "skipped",
			reason: `config file could not be read${detail ? ` (${detail})` : ""}`
		};
	}
	const sourceRosterConfig = read.sourceConfigBeforeMigrations ?? read.sourceConfig;
	const rosterDiagnostics = [...new Set(findLegacyConfigRuleIssues(sourceRosterConfig, LEGACY_AGENT_ROSTER_RULES).map((issue) => issue.message))];
	if (read.sourceConfig.agents?.ownership === void 0 && listAgentEntries(read.sourceConfig).length > 1) rosterDiagnostics.push("The multi-agent roster needs explicit per-surface ownership.");
	if (rosterDiagnostics.length > 0) return {
		...report,
		status: "skipped",
		reason: `the agent roster needs doctor's one-time migration (${rosterDiagnostics.join(" ")}); run ${doctorFixCommand}`
	};
	const implicitMainRoster = listAgentEntries(sourceRosterConfig).length === 0;
	const snapshot = addDoctorLegacyIssues(read);
	let state = {
		cfg: snapshot.sourceConfig,
		candidate: structuredClone(snapshot.sourceConfig),
		pendingChanges: false,
		fixHints: []
	};
	const legacyStep = applyLegacyCompatibilityStep({
		snapshot,
		state,
		shouldRepair: true,
		doctorFixCommand
	});
	if (legacyStep.blocksWrite) return {
		...report,
		status: "skipped",
		reason: legacyStep.issueLines.join(" ")
	};
	state = legacyStep.state;
	const detectedLegacyLines = new Set(formatConfigIssueLines(snapshot.legacyIssues, "-"));
	const blockedCodexProviderPlan = collectBlockedLegacyOpenAICodexProviderPlan(state.candidate);
	const normalized = normalizeCompatibilityConfigValues(state.candidate, {
		blockedModelIdentities: new Set(blockedCodexProviderPlan.blockedModelIdentities),
		sourceRaw: snapshot.parsed
	});
	state = applyDoctorConfigMutation({
		state,
		mutation: normalized,
		shouldRepair: true
	});
	const unknownStep = applyUnknownConfigKeyStep({
		state,
		shouldRepair: true,
		doctorFixCommand
	});
	state = unknownStep.state;
	const changes = [
		...legacyStep.changeLines,
		...normalized.changes,
		...unknownStep.removed.map((removedPath) => `Removed unknown config key: ${removedPath}`),
		...unknownStep.repairs
	];
	const warnings = [
		...legacyStep.issueLines.filter((line) => !detectedLegacyLines.has(line)),
		...normalized.warnings ?? [],
		...unknownStep.warnings
	];
	if (!state.pendingChanges) return {
		...report,
		status: "unchanged",
		warnings
	};
	const candidate = implicitMainRoster ? withoutImplicitMainRoster(state.cfg, read.parsed) : state.cfg;
	const validated = validateConfigObjectRawWithPlugins(candidate, { semanticValidation: "strict" });
	if (!validated.ok) return {
		...report,
		status: "still-invalid",
		changes,
		warnings,
		issues: validated.issues
	};
	if (params.dryRun) return {
		...report,
		status: "would-fix",
		changes,
		warnings
	};
	const nextConfig = restoreDoctorConfigEnvRefs(candidate, referenceSource);
	try {
		await transformConfigFile({
			baseHash: read.hash,
			transform: () => ({ nextConfig }),
			afterWrite: { mode: "auto" },
			writeOptions: {
				expectedConfigPath: read.path,
				auditOrigin: "doctor",
				...params.skipOutputLogs ? { skipOutputLogs: true } : {}
			}
		});
	} catch (err) {
		return {
			...report,
			status: "write-failed",
			changes,
			warnings,
			error: formatErrorMessage(err)
		};
	}
	return {
		...report,
		status: "fixed",
		changes,
		warnings
	};
}
//#endregion
export { fixConfigContent };
