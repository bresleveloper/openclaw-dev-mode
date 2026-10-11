import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as INCLUDE_KEY } from "./includes-CaaCq-XN.mjs";
import { n as containsAuthoredInclude } from "./include-migration-ownership-D1fnTYxB.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as collectBlockedLegacyOpenAICodexProviderPlan } from "./legacy-config-migrations.runtime.models-BvDaSkAf.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { a as validateConfigObjectRawWithPlugins } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CXaC-ufL.mjs";
import { a as transformConfigFile } from "./mutate-DyAZbu2S.mjs";
import "./config-DH29aVhU.mjs";
import { i as restoreDoctorConfigEnvRefs, n as applyUnknownConfigKeyStep, r as prepareDoctorConfigReferenceSource, t as applyLegacyCompatibilityStep } from "./config-flow-steps-JyDeZDer.mjs";
import { t as addDoctorLegacyIssues } from "./legacy-config-issues-Bkih_luc.mjs";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-Dw7MiJi5.mjs";
import { t as normalizeCompatibilityConfigValues } from "./legacy-config-core-migrate-CI0FaT1s.mjs";
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
	const rosterMigrations = [read.sourceConfigBeforeMigrations, read.parsed].map((source) => migratePersistedImplicitMainRoster(source)).filter((migration) => migration.changed);
	const rosterDiagnostics = [...new Set(rosterMigrations.flatMap((m) => m.diagnostics))];
	if (rosterDiagnostics.length > 0) return {
		...report,
		status: "skipped",
		reason: `the agent roster needs doctor's one-time migration (${rosterDiagnostics.join(" ")}); run ${doctorFixCommand}`
	};
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
		sourceRaw: snapshot.parsed,
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations
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
	const candidate = rosterMigrations.length > 0 ? withoutImplicitMainRoster(state.cfg, read.parsed) : state.cfg;
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
