import { d as getPluginMetadataSnapshotCache, n as adoptProcessPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { t as ExitError } from "./runtime-BC29JSZp.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-BKwhAL2c.mjs";
import { C as resolveOAuthDir, E as resolveStateDir, b as resolveIsConfigReadOnly, w as resolveLegacyStateDirs } from "./paths-DehQwyE0.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { i as isExistingOpenClawStateSchema, r as getExistingOpenClawStateSchemaPath } from "./openclaw-state-db-schema-policy-BpQ7rCsk.mjs";
import { k as setRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as createInvalidConfigError } from "./io.invalid-config-Deld-wtR.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { l as resolveExecApprovalsPath } from "./exec-approvals-config-C7iYNiP7.mjs";
import { a as withSuppressedNotes } from "./note-UlSlsJKw.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/cli/program/config-guard.ts
const ALLOWED_INVALID_COMMANDS = /* @__PURE__ */ new Set([
	"audit",
	"doctor",
	"logs",
	"health",
	"help",
	"status"
]);
const ALLOWED_INVALID_GATEWAY_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"run",
	"status",
	"probe",
	"health",
	"discover",
	"call",
	"install",
	"uninstall",
	"start",
	"stop",
	"restart"
]);
const ALLOWED_INVALID_TASK_SUBCOMMANDS = /* @__PURE__ */ new Set(["list", "audit"]);
let didRunDoctorConfigFlow = false;
let configSnapshotPromise = null;
function resetConfigGuardStateForTests() {
	didRunDoctorConfigFlow = false;
	configSnapshotPromise = null;
}
function fileOrDirExists(pathname) {
	try {
		return fs.existsSync(pathname);
	} catch {
		return false;
	}
}
function dirHasFile(dir, predicate) {
	try {
		return fs.readdirSync(dir, { withFileTypes: true }).some((entry) => entry.isFile() && predicate(entry.name));
	} catch {
		return false;
	}
}
function isLegacyWhatsAppAuthFile(name) {
	if (name === "creds.json" || name === "creds.json.bak") return true;
	return name.endsWith(".json") && /^(app-state-sync|session|sender-key|pre-key)-/.test(name);
}
function isLegacyTelegramStateFile(name) {
	return name.startsWith("bot-info-") && name.endsWith(".json") || name.startsWith("update-offset-") && name.endsWith(".json") || name === "sticker-cache.json" || name.startsWith("thread-bindings-") && name.endsWith(".json");
}
function hasLegacyIMessageStateFiles(stateDir) {
	return fileOrDirExists(path.join(stateDir, "imessage", "reply-cache.jsonl")) || fileOrDirExists(path.join(stateDir, "imessage", "sent-echoes.jsonl")) || dirHasFile(path.join(stateDir, "imessage", "catchup"), (name) => name.endsWith(".json"));
}
function hasBundledChannelLegacyStateMigrationInputs(stateDir, oauthDir) {
	if (fileOrDirExists(path.join(stateDir, "discord", "model-picker-preferences.json")) || fileOrDirExists(path.join(stateDir, "discord", "thread-bindings.json"))) return true;
	if (hasLegacyIMessageStateFiles(stateDir)) return true;
	if (fileOrDirExists(path.join(oauthDir, "telegram-allowFrom.json")) || dirHasFile(path.join(stateDir, "telegram"), isLegacyTelegramStateFile)) return true;
	return dirHasFile(oauthDir, isLegacyWhatsAppAuthFile);
}
function hasPendingSqliteSidecarArchive(sourcePath) {
	return fileOrDirExists(`${sourcePath}.migrated`) && [
		"-shm",
		"-wal",
		"-journal"
	].some((suffix) => fileOrDirExists(`${sourcePath}${suffix}`));
}
function hasLegacyStateMigrationInputs() {
	const stateDir = resolveStateDir(process.env, os.homedir);
	const oauthDir = resolveOAuthDir(process.env, stateDir);
	if (!process.env.OPENCLAW_STATE_DIR?.trim() && resolveLegacyStateDirs(() => resolveRequiredHomeDir(process.env, os.homedir)).some(fileOrDirExists)) return true;
	const sqliteSidecarPaths = [
		path.join(stateDir, "flows", "registry.sqlite"),
		path.join(stateDir, "plugin-state", "state.sqlite"),
		path.join(stateDir, "tasks", "runs.sqlite")
	];
	const legacyExecApprovalsPath = resolveExecApprovalsPath(process.env);
	return [
		path.join(stateDir, "agent"),
		path.join(stateDir, "agents"),
		legacyExecApprovalsPath,
		`${legacyExecApprovalsPath}.doctor-importing`,
		path.join(stateDir, "plugins", "installs.json"),
		path.join(stateDir, "restart-sentinel.json"),
		path.join(stateDir, "restart-sentinel.json.doctor-importing"),
		path.join(stateDir, "sessions"),
		path.join(stateDir, "state", "openclaw.sqlite")
	].some(fileOrDirExists) || sqliteSidecarPaths.some((sourcePath) => fileOrDirExists(sourcePath) || hasPendingSqliteSidecarArchive(sourcePath)) || hasBundledChannelLegacyStateMigrationInputs(stateDir, oauthDir);
}
function shouldRunStateMigrationOnlyWithLegacyInputs(commandPath) {
	const commandName = commandPath[0];
	const subcommandName = commandPath[1];
	return commandName === "agent" || commandName === "status" || commandName === "plugins" && subcommandName === "list" || commandName === "tasks" && (subcommandName === void 0 || ALLOWED_INVALID_TASK_SUBCOMMANDS.has(subcommandName));
}
function snapshotHasConfiguredSessionStore(snapshot) {
	const store = (snapshot.runtimeConfig ?? snapshot.config)?.session?.store;
	return typeof store === "string" && store.trim().length > 0;
}
function shouldRequireStartupMigrationCheckpoint(commandPath) {
	const commandName = commandPath[0];
	const subcommandName = commandPath[1];
	return commandName === "gateway" && (subcommandName === void 0 || subcommandName === "run" || subcommandName.trim() === "");
}
function isGatewayStartupCommand(commandPath) {
	const [commandName, subcommandName] = commandPath;
	return commandName === "gateway" && (subcommandName === void 0 || subcommandName === "run" || subcommandName === "start" || subcommandName === "restart");
}
async function getConfigSnapshot(options, measure) {
	if (options?.observe === false) return readConfigFileSnapshot({
		...options,
		...measure ? { measure } : {}
	});
	if (!configSnapshotPromise) {
		const pendingSnapshot = readConfigFileSnapshot(measure ? { measure } : void 0);
		configSnapshotPromise = pendingSnapshot;
		pendingSnapshot.catch(() => {
			if (configSnapshotPromise === pendingSnapshot) configSnapshotPromise = null;
		});
	}
	return configSnapshotPromise;
}
async function ensureConfigReady(params, recoveryDeps) {
	const commandPath = params.commandPath ?? [];
	const commandName = commandPath[0];
	const subcommandName = commandPath[1];
	const existingStatePath = getExistingOpenClawStateSchemaPath();
	const isManagedNodeRuntime = existingStatePath !== void 0 && (commandName === "node" && subcommandName === "run" || commandName === "connect");
	if (existingStatePath !== void 0) {
		if (!isManagedNodeRuntime) throw new Error("The managed node runtime cannot run shared-state maintenance commands.");
		if (!isExistingOpenClawStateSchema(resolveOpenClawStateSqlitePath())) throw new Error("The managed node runtime state directory changed after launcher admission.");
	}
	const isRestartController = (commandName === "gateway" || commandName === "daemon") && subcommandName === "restart";
	let preflightResult = null;
	const shouldConsiderStateMigration = !params.validateConfigOnly && !isManagedNodeRuntime && commandName !== "config" && commandName !== "health" && commandName !== "logs" && commandName !== "sessions" && !(commandName === "gateway" && subcommandName === "call") && !isRestartController && !(commandName === "update" && subcommandName === "status");
	const requiresLegacyStateInput = shouldRunStateMigrationOnlyWithLegacyInputs(commandPath);
	const runStateMigrationPreflight = async () => {
		didRunDoctorConfigFlow = true;
		const runDoctorConfigPreflight = async () => (await import("./doctor-config-preflight-CifHK8oB.mjs")).runDoctorConfigPreflight({
			migrateState: true,
			migrateLegacyConfig: false,
			invalidConfigNote: false,
			...params.measure ? { measure: params.measure } : {},
			...commandName === "status" ? { observe: false } : {},
			...shouldRequireStartupMigrationCheckpoint(commandPath) ? {
				requireStartupMigrationCheckpoint: true,
				validateStartupConfig: async (snapshot) => {
					const { getGatewayStartGuardErrors } = await import("./pre-bootstrap-DoapnnEw.mjs");
					const errors = getGatewayStartGuardErrors({
						allowUnconfigured: params.allowInvalid,
						configExists: snapshot.exists,
						mode: snapshot.config.gateway?.mode
					});
					if (errors.length > 0) throw new Error(errors.join("\n"));
				}
			} : { requireStateMigrationCheckpoint: true },
			...params.beforeStateMigrations ? { beforeStateMigrations: params.beforeStateMigrations } : {},
			...params.skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
			...params.skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}
		});
		try {
			return !params.suppressDoctorStdout ? await runDoctorConfigPreflight() : await withSuppressedNotes(runDoctorConfigPreflight);
		} catch (error) {
			if (shouldRequireStartupMigrationCheckpoint(commandPath)) await (await import("./startup-maintenance-D4bbYXb-.mjs")).handleGatewayStartupMaintenance(error);
			if (error instanceof ExitError) params.runtime.exit(error.code);
			throw error;
		}
	};
	if (!didRunDoctorConfigFlow && shouldConsiderStateMigration && (!requiresLegacyStateInput || hasLegacyStateMigrationInputs())) preflightResult = await runStateMigrationPreflight();
	const configSnapshotOptions = params.validateConfigOnly ? {
		observe: false,
		pluginValidation: "core-only"
	} : commandName === "logs" ? {
		observe: false,
		pluginValidation: "core-only"
	} : isManagedNodeRuntime || commandName === "status" || commandName === "gateway" && subcommandName === "call" || isRestartController ? { observe: false } : void 0;
	let snapshot = preflightResult?.snapshot ?? await getConfigSnapshot(configSnapshotOptions, params.measure);
	if (!preflightResult && !didRunDoctorConfigFlow && shouldConsiderStateMigration && requiresLegacyStateInput && snapshot.valid && snapshotHasConfiguredSessionStore(snapshot)) {
		preflightResult = await runStateMigrationPreflight();
		snapshot = preflightResult.snapshot;
	}
	const isBareGatewayForegroundRun = commandName === "gateway" && (subcommandName === void 0 || subcommandName.trim() === "");
	const isReadOnlyTaskStateCommand = commandName === "tasks" && (subcommandName === void 0 || ALLOWED_INVALID_TASK_SUBCOMMANDS.has(subcommandName));
	const allowInvalid = commandName ? params.allowInvalid === true || ALLOWED_INVALID_COMMANDS.has(commandName) || isReadOnlyTaskStateCommand || isBareGatewayForegroundRun || commandName === "gateway" && subcommandName && ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName) : false;
	const [{ formatConfigIssueLines }, { renderConfigValidationIssueLines }] = await Promise.all([import("./issue-format-q3XEPmIM.mjs"), import("./issue-location-DcVnJjT9.mjs")]);
	const issues = snapshot.exists && !snapshot.valid ? renderConfigValidationIssueLines(snapshot) : [];
	const legacyIssues = snapshot.legacyIssues.length > 0 ? formatConfigIssueLines(snapshot.legacyIssues, "-") : [];
	if (!(snapshot.exists && !snapshot.valid)) {
		setRuntimeConfigSnapshot(snapshot.runtimeConfig ?? snapshot.config, snapshot.sourceConfig);
		if (shouldRequireStartupMigrationCheckpoint(commandPath) && preflightResult?.pluginMetadataSnapshot) adoptProcessPluginCache(getPluginMetadataSnapshotCache(preflightResult.pluginMetadataSnapshot));
		return;
	}
	const [{ colorize, isRich, theme }, { shortenHomePath }, { formatCliCommand }, { isPluginPackagingRuntimeOutputInvalidConfigSnapshot }, { formatPluginPackagingRuntimeOutputRecoveryHint }] = await Promise.all([
		import("./terminal-core/theme.js"),
		import("./utils-CgtqH0G3.mjs"),
		import("./command-format-BWFOOPTU.mjs"),
		import("./recovery-policy-BfUJcLQL.mjs"),
		import("./config-recovery-hints-D2No3Djb.mjs")
	]);
	const rich = isRich();
	const muted = (value) => colorize(rich, theme.muted, value);
	const error = (value) => colorize(rich, theme.error, value);
	const heading = (value) => colorize(rich, theme.heading, value);
	const commandText = (value) => colorize(rich, theme.command, value);
	params.runtime.error(heading("OpenClaw config is invalid"));
	params.runtime.error(`${muted("File:")} ${muted(shortenHomePath(snapshot.path))}`);
	if (issues.length > 0) {
		params.runtime.error(muted("Problem:"));
		params.runtime.error(issues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	if (legacyIssues.length > 0) {
		params.runtime.error(muted("Legacy config keys detected:"));
		params.runtime.error(legacyIssues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	params.runtime.error("");
	const isPluginPackagingFailure = isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot);
	const isReadOnlyConfig = resolveIsConfigReadOnly();
	const isGatewayStartup = isGatewayStartupCommand(commandPath);
	const mustBlockInvalid = !allowInvalid || isGatewayStartup && params.allowInvalid !== true;
	const shouldOfferRecovery = mustBlockInvalid && !params.suppressDoctorStdout && !isReadOnlyConfig && !isManagedNodeRuntime;
	if (isPluginPackagingFailure || isReadOnlyConfig || !shouldOfferRecovery) {
		const fixHint = isPluginPackagingFailure ? formatPluginPackagingRuntimeOutputRecoveryHint() : isReadOnlyConfig ? (await import("./config-write-guard-D0eCMYLV.mjs")).createConfigMutationError({ configPath: snapshot.path }).message : commandText(formatCliCommand("openclaw doctor --fix"));
		params.runtime.error(`${muted("Fix:")} ${fixHint}`);
	}
	params.runtime.error(`${muted("Inspect:")} ${commandText(formatCliCommand("openclaw config validate"))}`);
	params.runtime.error(muted("Audit, status, health, logs, tasks list/audit, and doctor commands still run with invalid config."));
	if (mustBlockInvalid && (await import("./json-output-mode-pwhUEVjJ.mjs")).isJsonOutputModeActive(process.argv)) {
		const { writeInvalidConfigCliJson } = await import("./config-validation-output-Cb1Wk-Jr.mjs");
		writeInvalidConfigCliJson(params.runtime, snapshot);
	}
	if (isPluginPackagingFailure && isGatewayStartup) {
		params.runtime.exit(78);
		return;
	}
	if (shouldOfferRecovery && !isPluginPackagingFailure) {
		const { offerInvalidConfigRecovery } = await import("./invalid-config-recovery-D2cE67dO.mjs");
		if ((await offerInvalidConfigRecovery({
			runtime: params.runtime,
			deps: recoveryDeps,
			retry: async () => {
				configSnapshotPromise = null;
				const { runDoctorConfigPreflight } = await import("./doctor-config-preflight-CifHK8oB.mjs");
				const retrySnapshot = (await runDoctorConfigPreflight({
					migrateState: false,
					migrateLegacyConfig: false,
					invalidConfigNote: false,
					...params.measure ? { measure: params.measure } : {},
					...configSnapshotOptions
				})).snapshot;
				if (retrySnapshot.exists && !retrySnapshot.valid) {
					const retryIssues = renderConfigValidationIssueLines(retrySnapshot);
					throw createInvalidConfigError(retrySnapshot.path, retryIssues.join("\n") || "Unknown validation issue.");
				}
				setRuntimeConfigSnapshot(retrySnapshot.runtimeConfig ?? retrySnapshot.config, retrySnapshot.sourceConfig);
			}
		})).status === "recovered") return;
		params.runtime.exit(isGatewayStartup ? 78 : 1);
		return;
	}
	if (mustBlockInvalid) params.runtime.exit(isGatewayStartup ? 78 : 1);
}
const testApi = { resetConfigGuardStateForTests };
//#endregion
export { ensureConfigReady, testApi };
