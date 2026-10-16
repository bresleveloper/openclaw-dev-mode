import { d as getPluginMetadataSnapshotCache, n as adoptProcessPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { t as ExitError } from "./runtime-DlO3PTAd.mjs";
import { a as isConfigReadFailure, n as createConfigReadError, r as createInvalidConfigError, t as configFailureHeading } from "./io.invalid-config-BzeD3bi5.mjs";
import { S as resolveIsConfigReadOnly } from "./paths-DGIwWbpu.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { a as isExistingOpenClawStateSchema, i as getExistingOpenClawStateSchemaPath } from "./openclaw-state-db-schema-policy-BxAJZRG6.mjs";
import { D as setRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { a as withSuppressedNotes } from "./note-Byxgt4MB.mjs";
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
	"install",
	"uninstall",
	"start",
	"stop",
	"restart"
]);
let didRunStartupConfigPreflight = false;
let configSnapshotPromise = null;
function resetConfigGuardStateForTests() {
	didRunStartupConfigPreflight = false;
	configSnapshotPromise = null;
}
function shouldPrepareGatewayState(commandPath) {
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
	const shouldRunStartupPreflight = !params.validateConfigOnly && commandName !== "doctor" && !isManagedNodeRuntime && commandName !== "config" && commandName !== "health" && commandName !== "logs" && commandName !== "sessions" && !isRestartController && !(commandName === "update" && subcommandName === "status");
	const runStartupPreflight = async () => {
		didRunStartupConfigPreflight = true;
		const runStartupConfigPreflight = async () => (await import("./startup-config-preflight-Lbx30r32.mjs")).runStartupConfigPreflight({
			gateway: shouldPrepareGatewayState(commandPath),
			...params.measure ? { measure: params.measure } : {},
			...commandName === "status" ? { observe: false } : {},
			...shouldPrepareGatewayState(commandPath) ? { validateStartupConfig: async (snapshot) => {
				const { getGatewayStartGuardErrors } = await import("./pre-bootstrap-DigA57gy.mjs");
				const errors = getGatewayStartGuardErrors({
					allowUnconfigured: params.allowInvalid,
					configExists: snapshot.exists,
					mode: snapshot.config.gateway?.mode
				});
				if (errors.length > 0) {
					params.runtime.error(errors.join("\n"));
					throw new ExitError(78);
				}
			} } : {},
			...params.beforeStatePreparation ? { beforeStatePreparation: params.beforeStatePreparation } : {}
		});
		try {
			return !params.suppressDoctorStdout ? await runStartupConfigPreflight() : await withSuppressedNotes(runStartupConfigPreflight);
		} catch (error) {
			if (shouldPrepareGatewayState(commandPath)) await (await import("./startup-maintenance-BTfUfuxc.mjs")).handleGatewayStartupMaintenance(error);
			if (error instanceof ExitError) params.runtime.exit(error.code);
			throw error;
		}
	};
	if (!didRunStartupConfigPreflight && shouldRunStartupPreflight) preflightResult = await runStartupPreflight();
	const configSnapshotOptions = params.validateConfigOnly || commandName === "logs" ? {
		observe: false,
		pluginValidation: "core-only"
	} : isManagedNodeRuntime || commandName === "status" || isRestartController ? { observe: false } : void 0;
	const snapshot = preflightResult?.snapshot ?? await getConfigSnapshot(configSnapshotOptions, params.measure);
	const isBareGatewayForegroundRun = commandName === "gateway" && (subcommandName === void 0 || subcommandName.trim() === "");
	const allowInvalid = commandName ? params.allowInvalid === true || ALLOWED_INVALID_COMMANDS.has(commandName) || isBareGatewayForegroundRun || commandName === "gateway" && subcommandName && ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName) : false;
	const [{ formatConfigIssueLines }, { renderConfigValidationIssueLines }] = await Promise.all([import("./issue-format-Bj4Iwq7G.mjs"), import("./issue-location-rqvn212G.mjs")]);
	const issues = snapshot.exists && !snapshot.valid ? renderConfigValidationIssueLines(snapshot) : [];
	const legacyIssues = snapshot.legacyIssues.length > 0 ? formatConfigIssueLines(snapshot.legacyIssues, "-") : [];
	if (!(snapshot.exists && !snapshot.valid)) {
		setRuntimeConfigSnapshot(snapshot.runtimeConfig ?? snapshot.config, snapshot.sourceConfig);
		if (shouldPrepareGatewayState(commandPath) && preflightResult?.pluginMetadataSnapshot) adoptProcessPluginCache(getPluginMetadataSnapshotCache(preflightResult.pluginMetadataSnapshot));
		return;
	}
	const [{ colorize, isRich, theme }, { shortenHomePath }, { formatCliCommand }, { isPluginPackagingRuntimeOutputInvalidConfigSnapshot }, { formatPluginPackagingRuntimeOutputRecoveryHint }] = await Promise.all([
		import("./terminal-core/theme.js"),
		import("./utils-CZEHCb0v.mjs"),
		import("./command-format-BFUvMAFa.mjs"),
		import("./recovery-policy-feWQeZ1o.mjs"),
		import("./config-recovery-hints-L54HOZy6.mjs")
	]);
	const rich = isRich();
	const muted = (value) => colorize(rich, theme.muted, value);
	const error = (value) => colorize(rich, theme.error, value);
	const heading = (value) => colorize(rich, theme.heading, value);
	const commandText = (value) => colorize(rich, theme.command, value);
	const readFailure = isConfigReadFailure(snapshot);
	params.runtime.error(heading(configFailureHeading(snapshot)));
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
	const shouldOfferRecovery = mustBlockInvalid && !readFailure && !params.suppressDoctorStdout && !isReadOnlyConfig && !isManagedNodeRuntime;
	if (readFailure) params.runtime.error(muted("Resolve the read error shown above, then retry."));
	else if (isPluginPackagingFailure || isReadOnlyConfig || !shouldOfferRecovery) {
		const fixHint = isPluginPackagingFailure ? formatPluginPackagingRuntimeOutputRecoveryHint() : isReadOnlyConfig ? (await import("./config-write-guard-DwtgeHY2.mjs")).createConfigMutationError({ configPath: snapshot.path }).message : commandText(formatCliCommand("openclaw doctor --fix"));
		params.runtime.error(`${muted("Fix:")} ${fixHint}`);
	}
	params.runtime.error(`${muted("Inspect:")} ${commandText(formatCliCommand("openclaw config validate"))}`);
	params.runtime.error(muted(readFailure ? "Audit, status, health, logs, and doctor commands still run when config cannot be read." : "Audit, status, health, logs, and doctor commands still run with invalid config."));
	if (mustBlockInvalid && (await import("./json-output-mode-BR-Z3WUl.mjs")).isJsonOutputModeActive(process.argv)) {
		const { writeInvalidConfigCliJson } = await import("./config-validation-output-erKJV715.mjs");
		writeInvalidConfigCliJson(params.runtime, snapshot);
	}
	if (isPluginPackagingFailure && isGatewayStartup) {
		params.runtime.exit(78);
		return;
	}
	if (shouldOfferRecovery && !isPluginPackagingFailure) {
		const { offerInvalidConfigRecovery } = await import("./invalid-config-recovery-RvtIt0yH.mjs");
		if ((await offerInvalidConfigRecovery({
			runtime: params.runtime,
			deps: recoveryDeps,
			retry: async () => {
				configSnapshotPromise = null;
				const retrySnapshot = shouldRunStartupPreflight ? (await (await import("./startup-config-preflight-Lbx30r32.mjs")).runStartupConfigPreflight({
					gateway: false,
					...params.measure ? { measure: params.measure } : {},
					...configSnapshotOptions?.observe === false ? { observe: false } : {}
				})).snapshot : await getConfigSnapshot(configSnapshotOptions, params.measure);
				if (retrySnapshot.exists && !retrySnapshot.valid) {
					const details = renderConfigValidationIssueLines(retrySnapshot).join("\n") || "Unknown validation issue.";
					throw isConfigReadFailure(retrySnapshot) ? createConfigReadError(retrySnapshot, details) : createInvalidConfigError(retrySnapshot.path, details);
				}
				setRuntimeConfigSnapshot(retrySnapshot.runtimeConfig ?? retrySnapshot.config, retrySnapshot.sourceConfig);
			}
		})).status === "recovered") return;
		params.runtime.exit(isGatewayStartup ? 78 : 1);
		return;
	}
	if (mustBlockInvalid) params.runtime.exit(isGatewayStartup && !readFailure ? 78 : 1);
}
const testApi = { resetConfigGuardStateForTests };
//#endregion
export { ensureConfigReady, testApi };
