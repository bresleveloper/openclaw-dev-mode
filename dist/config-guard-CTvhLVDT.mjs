import { p as getPluginMetadataSnapshotCache, r as adoptProcessPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as ExitError } from "./runtime-BazLsT0s.mjs";
import { S as resolveIsConfigReadOnly } from "./paths-orClZ-2Z.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { a as isExistingOpenClawStateSchema, i as getExistingOpenClawStateSchemaPath } from "./openclaw-state-db-schema-policy-CuEyLsE2.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { O as setRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as isConfigReadFailure, n as createConfigReadError, r as createInvalidConfigError, t as configFailureHeading } from "./io.invalid-config-CsqYoW4w.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { a as withSuppressedNotes } from "./note-CmoIRLec.mjs";
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
async function ensureConfigReady(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const preflightResources = _usingCtx$1.a(new AsyncDisposableStack());
		let preflightCache;
		preflightResources.defer(async () => {
			await preflightCache?.[Symbol.asyncDispose]();
		});
		const commandPath = params.commandPath ?? [];
		const commandName = commandPath[0];
		const subcommandName = commandPath[1];
		const prepareGatewayState = commandName === "gateway" && (subcommandName === void 0 || subcommandName === "run" || subcommandName.trim() === "");
		const existingStatePath = getExistingOpenClawStateSchemaPath();
		const isManagedNodeRuntime = existingStatePath !== void 0 && (commandName === "node" && subcommandName === "run" || commandName === "connect");
		if (existingStatePath !== void 0) {
			if (!isManagedNodeRuntime) throw new Error("The managed node runtime cannot run shared-state maintenance commands.");
			if (!isExistingOpenClawStateSchema(resolveOpenClawStateSqlitePath())) throw new Error("The managed node runtime state directory changed after launcher admission.");
		}
		const isRestartController = (commandName === "gateway" || commandName === "daemon") && subcommandName === "restart";
		let preflightResult = null;
		const shouldRunStartupPreflight = !params.validateConfigOnly && commandName !== "doctor" && !isManagedNodeRuntime && commandName !== "config" && commandName !== "health" && commandName !== "logs" && commandName !== "sessions" && !isRestartController && !(commandName === "update" && subcommandName === "status");
		if (!didRunStartupConfigPreflight && shouldRunStartupPreflight) {
			didRunStartupConfigPreflight = true;
			const runStartupConfigPreflight = async () => (await import("./startup-config-preflight-BmQpww6c.mjs")).runStartupConfigPreflight({
				gateway: prepareGatewayState,
				...params.measure ? { measure: params.measure } : {},
				...commandName === "status" ? { observe: false } : {},
				...prepareGatewayState ? { validateStartupConfig: async (snapshot) => {
					const { getGatewayStartGuardErrors } = await import("./pre-bootstrap-B-l2TRKm.mjs");
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
				preflightResult = !params.suppressDoctorStdout ? await runStartupConfigPreflight() : await withSuppressedNotes(runStartupConfigPreflight);
				preflightCache = preflightResult.pluginCache;
			} catch (error) {
				if (prepareGatewayState) await (await import("./startup-maintenance-DZ2dgGeZ.mjs")).handleGatewayStartupMaintenance(error);
				if (error instanceof ExitError) params.runtime.exit(error.code);
				throw error;
			}
		}
		const configSnapshotOptions = params.validateConfigOnly || commandName === "logs" ? {
			observe: false,
			pluginValidation: "core-only"
		} : isManagedNodeRuntime || commandName === "status" || isRestartController ? { observe: false } : void 0;
		const snapshot = preflightResult?.snapshot ?? await getConfigSnapshot(configSnapshotOptions, params.measure);
		const isBareGatewayForegroundRun = commandName === "gateway" && (subcommandName === void 0 || subcommandName.trim() === "");
		const allowInvalid = commandName ? params.allowInvalid === true || ALLOWED_INVALID_COMMANDS.has(commandName) || isBareGatewayForegroundRun || commandName === "gateway" && subcommandName && ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName) : false;
		const [{ formatConfigIssueLines }, { renderConfigValidationIssueLines }] = await Promise.all([import("./issue-format-BthLOJ3-.mjs"), import("./issue-location-CDR65Yag.mjs")]);
		const issues = snapshot.exists && !snapshot.valid ? renderConfigValidationIssueLines(snapshot) : [];
		const legacyIssues = snapshot.legacyIssues.length > 0 ? formatConfigIssueLines(snapshot.legacyIssues, "-") : [];
		if (!(snapshot.exists && !snapshot.valid)) {
			setRuntimeConfigSnapshot(snapshot.runtimeConfig ?? snapshot.config, snapshot.sourceConfig);
			if (prepareGatewayState && preflightResult?.pluginMetadataSnapshot) {
				adoptProcessPluginCache(getPluginMetadataSnapshotCache(preflightResult.pluginMetadataSnapshot));
				preflightCache = void 0;
			}
			return;
		}
		const [{ colorize, isRich, theme }, { shortenHomePath }, { formatCliCommand }, { isPluginPackagingRuntimeOutputInvalidConfigSnapshot }, { formatPluginPackagingRuntimeOutputRecoveryHint }] = await Promise.all([
			import("./terminal-core/theme.js"),
			import("./utils-a_bDQSyF.mjs"),
			import("./command-format-Blfiiv-c.mjs"),
			import("./recovery-policy-feWQeZ1o.mjs"),
			import("./config-recovery-hints-BXZ491ii.mjs")
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
		const isGatewayStartup = commandName === "gateway" && (subcommandName === void 0 || subcommandName === "run" || subcommandName === "start" || subcommandName === "restart");
		const mustBlockInvalid = !allowInvalid || isGatewayStartup && params.allowInvalid !== true;
		const shouldOfferRecovery = mustBlockInvalid && !readFailure && !params.suppressDoctorStdout && !isReadOnlyConfig && !isManagedNodeRuntime;
		if (readFailure) params.runtime.error(muted("Resolve the read error shown above, then retry."));
		else if (isPluginPackagingFailure || isReadOnlyConfig || !shouldOfferRecovery) {
			const fixHint = isPluginPackagingFailure ? formatPluginPackagingRuntimeOutputRecoveryHint() : isReadOnlyConfig ? (await import("./config-write-guard-BgXOVsHJ.mjs")).createConfigMutationError({ configPath: snapshot.path }).message : commandText(formatCliCommand("openclaw doctor --fix"));
			params.runtime.error(`${muted("Fix:")} ${fixHint}`);
		}
		params.runtime.error(`${muted("Inspect:")} ${commandText(formatCliCommand("openclaw config validate"))}`);
		params.runtime.error(muted(readFailure ? "Audit, status, health, logs, and doctor commands still run when config cannot be read." : "Audit, status, health, logs, and doctor commands still run with invalid config."));
		if (mustBlockInvalid && (await import("./json-output-mode-DJvhLoPt.mjs")).isJsonOutputModeActive(process.argv)) {
			const { writeInvalidConfigCliJson } = await import("./config-validation-output-l9Pix1zG.mjs");
			writeInvalidConfigCliJson(params.runtime, snapshot);
		}
		if (isPluginPackagingFailure && isGatewayStartup) {
			params.runtime.exit(78);
			return;
		}
		if (shouldOfferRecovery && !isPluginPackagingFailure) {
			const { offerInvalidConfigRecovery } = await import("./invalid-config-recovery-Ck-_QfuW.mjs");
			if ((await offerInvalidConfigRecovery({
				runtime: params.runtime,
				retry: async () => {
					configSnapshotPromise = null;
					const retryPreflight = shouldRunStartupPreflight ? await (await import("./startup-config-preflight-BmQpww6c.mjs")).runStartupConfigPreflight({
						gateway: false,
						...params.measure ? { measure: params.measure } : {},
						...configSnapshotOptions?.observe === false ? { observe: false } : {}
					}) : void 0;
					preflightResources.use(retryPreflight?.pluginCache);
					const retrySnapshot = retryPreflight?.snapshot ?? await getConfigSnapshot(configSnapshotOptions, params.measure);
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
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
const testApi = { resetConfigGuardStateForTests };
//#endregion
export { ensureConfigReady, testApi };
