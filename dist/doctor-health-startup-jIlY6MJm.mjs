import { n as createNonExitingRuntime, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { C as resolveIsNixMode } from "./paths-orClZ-2Z.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import { r as stylePromptTitle } from "./prompt-style-zarsDmI2.mjs";
import { n as resolveDoctorRepairMode } from "./doctor-repair-mode-CGb0a8nw.mjs";
import fs from "node:fs";
import { intro, outro } from "@clack/prompts";
//#region src/flows/doctor-health-startup.ts
const showDoctorIntro = (message) => intro(stylePromptTitle(message) ?? message);
const showDoctorOutro = (message) => outro(stylePromptTitle(message) ?? message);
function exitDoctorHealthFlow(runtime, code) {
	if (runtime === defaultRuntime) exitCliAfterOutput(runtime, code);
	runtime.exit(code);
}
function stateDirectoryExistsAtDoctorStart() {
	try {
		return fs.statSync(resolveStateDir()).isDirectory();
	} catch {
		return false;
	}
}
async function prepareDoctorHealthFlow(runtime, options, showIntro) {
	const effectiveRuntime = runtime ?? (await import("./runtime-DqKM42HJ.mjs")).defaultRuntime;
	const repairRuntime = {
		...effectiveRuntime,
		exit: createNonExitingRuntime().exit
	};
	const stateDirExistedAtStart = stateDirectoryExistsAtDoctorStart();
	showIntro("OpenClaw doctor");
	const { resolveOpenClawPackageRoot } = await import("./openclaw-root-Dkw5sjL6.mjs");
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (resolveIsNixMode() && (options.repair === true || options.yes === true || options.generateGatewayToken === true)) {
		const { assertConfigWriteAllowedInCurrentMode } = await import("./config-write-guard-BgXOVsHJ.mjs");
		assertConfigWriteAllowedInCurrentMode();
	}
	if (!resolveDoctorRepairMode(options).updateInProgress) {
		const [{ readSourceConfigBestEffort }, { inspectDoctorTailscalePrerequisite }] = await Promise.all([import("./io.runtime.js"), import("./doctor-tailscale-DhDGysqS.mjs")]);
		const prerequisite = await inspectDoctorTailscalePrerequisite(await readSourceConfigBestEffort());
		if (prerequisite) {
			const { note } = await import("./terminal-core/note.js");
			note(prerequisite, "Gateway startup prerequisite");
		}
	}
	return {
		effectiveRuntime,
		repairRuntime,
		stateDirExistedAtStart,
		root
	};
}
async function prepareDoctorInteractiveMaintenance(params) {
	const { createDoctorPrompter } = await import("./doctor-prompter-CP6ANN7m.mjs");
	const { prepareDoctorDatabasePreflight } = await import("./doctor-database-preflight-D2a0BEQu.mjs");
	const prompter = createDoctorPrompter({
		runtime: params.runtime,
		options: params.options
	});
	if (!params.databasePreflight) await prepareDoctorDatabasePreflight({ scope: "state" });
	const { maybeOfferUpdateBeforeDoctor } = await import("./doctor-update-CheGXRC6.mjs");
	if ((await maybeOfferUpdateBeforeDoctor({
		options: params.options,
		root: params.root,
		confirm: (p) => prompter.confirm(p),
		outro: params.outro
	})).handled) return "handled";
	if (!params.databasePreflight) await prepareDoctorDatabasePreflight();
	if (await prompter.confirmRuntimeRepair({
		message: "Pause the managed Gateway while you review repairs? Doctor restores its prior service state when finished.",
		initialValue: true,
		requiresInteractiveConfirmation: true
	})) return "accepted";
	params.runtime.log("Doctor repairs skipped. Continuing read-only diagnosis.");
	const { runDoctorLintCli } = await import("./doctor-lint-CCVmQOI7.mjs");
	return { diagnosticExitCode: await runDoctorLintCli(params.runtime, {
		allowExec: params.options.allowExec,
		deep: params.options.deep
	}) };
}
async function prepareDoctorMaintenanceArchives(databasePreflight, runtime, preflightOptions = {}) {
	let discovery;
	try {
		const { prepareDoctorDatabasePreflight } = await import("./doctor-database-preflight-D2a0BEQu.mjs");
		discovery = (databasePreflight ?? await prepareDoctorDatabasePreflight(preflightOptions)).agentDatabaseMigrationDiscovery;
		if (discovery) {
			const { prepareCanonicalTranscriptArchiveMigrations } = await import("./state-migrations.transcript-directives-archives-j4gB6rEN.mjs");
			await prepareCanonicalTranscriptArchiveMigrations(discovery);
		}
	} catch (error) {
		runtime.log(`Archive verification preparation deferred: ${String(error)}`);
	}
	const { waitForCliSignalExit } = await import("./signal-exit-barrier-Bj-a5wKU.mjs");
	await waitForCliSignalExit();
	return discovery;
}
async function prepareDoctorStateSchema(schemas, shouldRepair) {
	if (!shouldRepair || !schemas.pendingMigrations?.some((entry) => entry.kind === "state")) return;
	const { prepareLegacyStateDatabaseSchema } = await import("./state-migrations.doctor-CxSGwF1E.mjs");
	const { throwIfDoctorStateMigrationRefused } = await import("./state-migrations.messages-2aF4-Shb.mjs");
	const receipt = await prepareLegacyStateDatabaseSchema(process.env);
	throwIfDoctorStateMigrationRefused([receipt]);
	return receipt;
}
//#endregion
export { prepareDoctorStateSchema as a, prepareDoctorMaintenanceArchives as i, prepareDoctorHealthFlow as n, showDoctorIntro as o, prepareDoctorInteractiveMaintenance as r, showDoctorOutro as s, exitDoctorHealthFlow as t };
