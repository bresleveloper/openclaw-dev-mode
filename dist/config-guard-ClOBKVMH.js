import { _ as shouldMigrateStateFromPath } from "./argv-APLDYHWW.js";
import { o as resolveRequiredHomeDir } from "./home-dir-CJKEsOtx.js";
import { g as resolveOAuthDir, m as resolveLegacyStateDirs, v as resolveStateDir } from "./paths-BMBAvkNf.js";
import { t as ExitError } from "./runtime-Bz6o617W.js";
import { u as readConfigFileSnapshot } from "./io-DxnOT4sF.js";
import { v as setRuntimeConfigSnapshot } from "./runtime-snapshot-DOvWRYVz.js";
import "./config-Cc93keN1.js";
import { i as withSuppressedNotes } from "./note-w8AYQ4sA.js";
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
	if (dirHasFile(path.join(stateDir, "feishu", "dedup"), (name) => name.endsWith(".json"))) return true;
	if (hasLegacyIMessageStateFiles(stateDir)) return true;
	if (fileOrDirExists(path.join(oauthDir, "telegram-allowFrom.json")) || dirHasFile(path.join(stateDir, "telegram"), isLegacyTelegramStateFile)) return true;
	return dirHasFile(oauthDir, isLegacyWhatsAppAuthFile);
}
function hasLegacyExecApprovalsMigrationInput(stateDir) {
	if (!process.env.OPENCLAW_STATE_DIR?.trim()) return false;
	const homeDir = resolveRequiredHomeDir(process.env, os.homedir);
	const sourcePath = path.join(homeDir, ".openclaw", "exec-approvals.json");
	const targetPath = path.join(stateDir, "exec-approvals.json");
	return path.resolve(sourcePath) !== path.resolve(targetPath) && fileOrDirExists(sourcePath) && !fileOrDirExists(targetPath);
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
	return [
		path.join(stateDir, "agent"),
		path.join(stateDir, "agents"),
		path.join(stateDir, "plugins", "installs.json"),
		path.join(stateDir, "sessions"),
		path.join(stateDir, "state", "openclaw.sqlite")
	].some(fileOrDirExists) || sqliteSidecarPaths.some((sourcePath) => fileOrDirExists(sourcePath) || hasPendingSqliteSidecarArchive(sourcePath)) || hasBundledChannelLegacyStateMigrationInputs(stateDir, oauthDir) || hasLegacyExecApprovalsMigrationInput(stateDir);
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
async function getConfigSnapshot() {
	if (process.env.VITEST === "true") return readConfigFileSnapshot();
	if (!configSnapshotPromise) {
		const pendingSnapshot = readConfigFileSnapshot();
		configSnapshotPromise = pendingSnapshot;
		pendingSnapshot.catch(() => {
			if (configSnapshotPromise === pendingSnapshot) configSnapshotPromise = null;
		});
	}
	return configSnapshotPromise;
}
async function ensureConfigReady(params) {
	const commandPath = params.commandPath ?? [];
	let preflightSnapshot = null;
	const shouldConsiderStateMigration = shouldMigrateStateFromPath(commandPath);
	const requiresLegacyStateInput = shouldRunStateMigrationOnlyWithLegacyInputs(commandPath);
	const runStateMigrationPreflight = async () => {
		didRunDoctorConfigFlow = true;
		const runDoctorConfigPreflight = async () => (await import("./doctor-config-preflight-AK_3iHaR.js")).runDoctorConfigPreflight({
			migrateState: true,
			migrateLegacyConfig: false,
			invalidConfigNote: false,
			...shouldRequireStartupMigrationCheckpoint(commandPath) ? { requireStartupMigrationCheckpoint: true } : {},
			...params.beforeStateMigrations ? { beforeStateMigrations: params.beforeStateMigrations } : {}
		});
		try {
			return !params.suppressDoctorStdout ? (await runDoctorConfigPreflight()).snapshot : (await withSuppressedNotes(runDoctorConfigPreflight)).snapshot;
		} catch (error) {
			if (error instanceof ExitError) params.runtime.exit(error.code);
			throw error;
		}
	};
	if (!didRunDoctorConfigFlow && shouldConsiderStateMigration && (!requiresLegacyStateInput || hasLegacyStateMigrationInputs())) preflightSnapshot = await runStateMigrationPreflight();
	let snapshot = preflightSnapshot ?? await getConfigSnapshot();
	if (!preflightSnapshot && !didRunDoctorConfigFlow && shouldConsiderStateMigration && requiresLegacyStateInput && snapshot.valid && snapshotHasConfiguredSessionStore(snapshot)) {
		preflightSnapshot = await runStateMigrationPreflight();
		snapshot = preflightSnapshot;
	}
	const commandName = commandPath[0];
	const subcommandName = commandPath[1];
	const isBareGatewayForegroundRun = commandName === "gateway" && (subcommandName === void 0 || subcommandName.trim() === "");
	const isReadOnlyTaskStateCommand = commandName === "tasks" && (subcommandName === void 0 || ALLOWED_INVALID_TASK_SUBCOMMANDS.has(subcommandName));
	const allowInvalid = commandName ? params.allowInvalid === true || ALLOWED_INVALID_COMMANDS.has(commandName) || isReadOnlyTaskStateCommand || isBareGatewayForegroundRun || commandName === "gateway" && subcommandName && ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName) : false;
	const { formatConfigIssueLines } = await import("./issue-format-Dei2dFdy.js");
	const issues = snapshot.exists && !snapshot.valid ? formatConfigIssueLines(snapshot.issues, "-", { normalizeRoot: true }) : [];
	const legacyIssues = snapshot.legacyIssues.length > 0 ? formatConfigIssueLines(snapshot.legacyIssues, "-") : [];
	const invalid = snapshot.exists && !snapshot.valid;
	if (!invalid) setRuntimeConfigSnapshot(snapshot.runtimeConfig ?? snapshot.config, snapshot.sourceConfig);
	if (!invalid) return;
	const [{ colorize, isRich, theme }, { shortenHomePath }, { formatCliCommand }, { isPluginPackagingRuntimeOutputInvalidConfigSnapshot }, { formatPluginPackagingRuntimeOutputRecoveryHint }] = await Promise.all([
		import("./terminal-core/theme.js"),
		import("./utils-DE-8o42N.js"),
		import("./command-format-CXDS0zKO.js"),
		import("./recovery-policy-XgXko0ay.js"),
		import("./config-recovery-hints-GkxQgilk.js")
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
	const fixHint = isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? formatPluginPackagingRuntimeOutputRecoveryHint() : commandText(formatCliCommand("openclaw doctor --fix"));
	params.runtime.error(`${muted("Fix:")} ${fixHint}`);
	params.runtime.error(`${muted("Inspect:")} ${commandText(formatCliCommand("openclaw config validate"))}`);
	params.runtime.error(muted("Audit, status, health, logs, tasks list/audit, and doctor commands still run with invalid config."));
	if (!allowInvalid) params.runtime.exit(1);
}
const testApi = { resetConfigGuardStateForTests };
//#endregion
export { testApi as __test__, testApi, ensureConfigReady };
