import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-maXyqxro.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as ENV_SECRET_REF_ID_RE } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as danger } from "./globals-QODkv80i.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DXO3PHhc.mjs";
import { t as formatGatewayCommandFailure } from "./error-format-B21fL1a_.mjs";
import { l as rethrowExpectedCliError, r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { n as isSensitiveEnvName } from "./secret-env-name-gnYTrC3J.mjs";
//#region src/cli/secrets-cli-output.ts
/** Keep each secrets command's payload, failure envelope, and exit code in one path. */
async function runSecretsCommand(json, run, renderHumanFailure, failureExit, jsonResult) {
	try {
		const result = await run();
		if (json) defaultRuntime.writeJson(jsonResult ? jsonResult(result) : result);
		return result;
	} catch (error) {
		const failure = typeof failureExit === "function" ? failureExit(error) : {
			error,
			exitCode: failureExit
		};
		if (json) defaultRuntime.writeJson(formatCliJsonFailure(failure.error));
		else renderHumanFailure(failure.error);
		return exitCliAfterOutput(defaultRuntime, failure.exitCode);
	}
}
//#endregion
//#region src/cli/secrets-store-cli.ts
var SecretStoreCliFailure = class extends Error {
	constructor(exitCode, message) {
		super(message);
		this.exitCode = exitCode;
		this.name = "SecretStoreCliFailure";
	}
};
function teamScope(scope) {
	if (!scope || scope === "team") return { kind: "team" };
	if (scope === "me") throw new SecretStoreCliFailure(2, "Identity scope is not supported yet; use --scope team.");
	throw new SecretStoreCliFailure(2, `Invalid scope "${scope}"; only "team" is supported.`);
}
function storeKind(kind, name) {
	if (!kind) return isSensitiveEnvName(name) ? "secret" : "env";
	if (kind === "secret" || kind === "env") return kind;
	throw new SecretStoreCliFailure(2, `Invalid kind "${kind}"; use "secret" or "env".`);
}
function assertStoreName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name)) throw new SecretStoreCliFailure(2, `Name must match ${String(ENV_SECRET_REF_ID_RE)}.`);
}
function assertOutputMode(options) {
	if (options.json && options.plain) throw new SecretStoreCliFailure(2, "Choose either --json or --plain, not both.");
}
function mapStoreError(error) {
	if (error instanceof SecretStoreCliFailure) return error;
	const validation = error;
	if (validation?.name === "SecretStoreValidationError" && (validation.code === "SECRET_STORE_INVALID_NAME" || validation.code === "SECRET_STORE_VALUE_TOO_LARGE" || validation.code === "SECRET_STORE_VALUE_EMPTY" || validation.code === "SECRET_STORE_VALUE_REDACTED" || validation.code === "SECRET_STORE_INVALID_ALLOWED_HOST")) return new SecretStoreCliFailure(2, validation.message ?? "Invalid secret store input.");
	return new SecretStoreCliFailure(1, formatErrorMessage(error));
}
async function runStoreAction(action, json, renderHumanSuccess) {
	const result = await runSecretsCommand(json, action, (error) => defaultRuntime.error(danger(formatErrorMessage(error))), (error) => {
		const failure = mapStoreError(error);
		return {
			error: failure,
			exitCode: failure.exitCode
		};
	});
	if (!json) renderHumanSuccess?.(result);
}
function renderList(entries, options) {
	if (options.plain) {
		for (const entry of entries) defaultRuntime.writeStdout([
			entry.name,
			entry.kind,
			entry.kind === "env" ? entry.valuePreview ?? "" : "",
			entry.kind === "secret" ? (entry.allowedHosts ?? []).join(",") : ""
		].join("	"));
		return;
	}
	if (entries.length === 0) {
		defaultRuntime.log("No team secret store entries.");
		return;
	}
	for (const entry of entries) {
		const value = entry.kind === "env" ? ` = ${entry.valuePreview ?? ""}` : " (write-only)";
		const hosts = entry.kind === "secret" ? `; allowed hosts: ${(entry.allowedHosts ?? []).join(", ") || "none"}` : "";
		defaultRuntime.log(`${entry.name} [${entry.kind}]${value}${hosts}`);
	}
}
async function noteGatewayReload() {
	try {
		const { readActiveGatewayLockIdentity } = await import("./gateway-lock-Iihe0f2N.mjs");
		if (await readActiveGatewayLockIdentity()) defaultRuntime.log("A gateway is running. Run `openclaw secrets reload` for config-referenced values to take effect.");
	} catch {}
}
async function confirmMutation(message, yes) {
	if (yes) return;
	if (!process.stdin.isTTY || !process.stdout.isTTY) throw new SecretStoreCliFailure(2, `${message} Re-run with --yes in non-interactive mode.`);
	const { confirm, isCancel } = await import("@clack/prompts");
	const approved = await confirm({
		message,
		initialValue: false
	});
	if (isCancel(approved) || !approved) throw new SecretStoreCliFailure(2, "Operation cancelled.");
}
function registerSecretStoreCli(secrets) {
	const store = secrets.command("store").description("Manage the team-scoped SQLite secret and environment store").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/secrets", "docs.openclaw.ai/cli/secrets")}\n`);
	store.command("list").description("List stored names and non-secret metadata").option("--scope <team>", "Store scope", "team").option("--json", "Output JSON", false).option("--plain", "Output tab-separated rows", false).action((options) => runStoreAction(async () => {
		assertOutputMode(options);
		const scope = teamScope(options.scope);
		const { listSecretStoreEntries } = await import("./secret-store-BYFWlksY.mjs");
		return listSecretStoreEntries({ scope });
	}, options.json, (entries) => renderList(entries, options)));
	store.command("set <NAME>").description("Create or update one store entry").option("--value <value>", "Literal value (env kind only)").option("--value-file <path>", "Read value from a file; use - for stdin").option("--kind <secret|env>", "Entry kind (defaults from NAME)").option("--allow-host <host>", "Allow substitution only for this exact host (repeatable)", (host, hosts) => [...hosts, host], []).option("--clear-allowed-hosts", "Remove all allowed hosts", false).option("--scope <team>", "Store scope", "team").option("--dry-run", "Validate without writing", false).action((name, options) => runStoreAction(async () => {
		assertStoreName(name);
		const scope = teamScope(options.scope);
		const storeModule = await import("./secret-store-BYFWlksY.mjs");
		const requestedHosts = options.allowHost ?? [];
		const existingEntry = requestedHosts.length > 0 || options.clearAllowedHosts === true ? storeModule.listSecretStoreEntries({ scope }).find((entry) => entry.name === name) : void 0;
		const kind = options.kind ? storeKind(options.kind, name) : existingEntry?.kind ?? storeKind(void 0, name);
		if (requestedHosts.length > 0 && options.clearAllowedHosts) throw new SecretStoreCliFailure(2, "Use either --allow-host or --clear-allowed-hosts, not both.");
		if (kind === "env" && (requestedHosts.length > 0 || options.clearAllowedHosts)) throw new SecretStoreCliFailure(2, "Allowed hosts apply only to secret entries.");
		const allowedHosts = requestedHosts.length > 0 ? storeModule.normalizeSecretAllowedHosts(requestedHosts) : options.clearAllowedHosts ? [] : void 0;
		if (options.value !== void 0 && options.valueFile !== void 0) throw new SecretStoreCliFailure(2, "Use only one of --value or --value-file.");
		if (kind === "secret" && options.value !== void 0) throw new SecretStoreCliFailure(2, "--value is refused for secret entries. Use a stdin pipe, --value-file, or the interactive no-echo prompt.");
		if (allowedHosts !== void 0 && options.value === void 0 && options.valueFile === void 0 && existingEntry?.kind === "secret") {
			if (options.dryRun) {
				defaultRuntime.log(`Would update allowed hosts for ${name}.`);
				return;
			}
			storeModule.updateSecretStoreAllowedHosts({
				scope,
				name,
				allowedHosts,
				updatedBy: "cli"
			});
			defaultRuntime.log(allowedHosts.length > 0 ? `Allowed ${name} for ${allowedHosts.join(", ")}.` : `Cleared allowed hosts for ${name}.`);
			return;
		}
		const value = options.value !== void 0 ? options.value : await (await import("./secrets-store-input-GefYcKti.mjs")).readSecretStoreInput({ valueFile: options.valueFile });
		if (isRedactedSecretValue(value)) {
			const current = storeModule.readSecretStoreValue({
				scope,
				name
			});
			if (current.ok && !isRedactedSecretValue(current.value)) {
				defaultRuntime.log(`Skipped redacted value for ${name}; existing entry unchanged.`);
				return;
			}
		}
		storeModule.assertSecretStoreValue(value, kind, name);
		if (options.dryRun) {
			defaultRuntime.log(`Would ${kind === "secret" ? "write" : "set"} ${name} (${kind}).`);
			return;
		}
		storeModule.writeSecretStoreEntry({
			scope,
			name,
			value,
			kind,
			...allowedHosts !== void 0 ? { allowedHosts } : {},
			updatedBy: "cli"
		});
		await storeModule.purgeExpiredSecretStoreEntries();
		defaultRuntime.log(`Stored ${name} (${kind}).`);
		await noteGatewayReload();
	}));
	store.command("get <NAME>").description("Read an env-kind value; secret-kind values are write-only").option("--scope <team>", "Store scope", "team").option("--json", "Output JSON", false).option("--plain", "Output only the env value", false).action((name, options) => runStoreAction(async () => {
		assertOutputMode(options);
		assertStoreName(name);
		const scope = teamScope(options.scope);
		const { listSecretStoreEntries, readSecretStoreValue } = await import("./secret-store-BYFWlksY.mjs");
		const metadata = listSecretStoreEntries({ scope }).find((entry) => entry.name === name);
		if (!metadata) throw new SecretStoreCliFailure(3, `Secret store entry "${name}" was not found.`);
		if (metadata.kind === "secret") throw new SecretStoreCliFailure(2, `Secret store entry "${name}" is write-only by design. Reference it from config with a store SecretRef.`);
		const result = readSecretStoreValue({
			scope,
			name
		});
		if (!result.ok) throw new SecretStoreCliFailure(result.error.code === "SECRET_STORE_NOT_FOUND" ? 3 : 1, result.error.message);
		return {
			name,
			kind: metadata.kind,
			value: result.value
		};
	}, options.json, (result) => {
		if (options.plain) defaultRuntime.writeStdout(result.value);
		else defaultRuntime.log(`${name}=${result.value}`);
	}));
	store.command("rm <NAME...>").description("Soft-delete one or more entries").option("--scope <team>", "Store scope", "team").option("--dry-run", "Show what would be removed", false).option("--yes", "Skip confirmation", false).action((names, options) => runStoreAction(async () => {
		const scope = teamScope(options.scope);
		for (const name of names) assertStoreName(name);
		if (options.dryRun) {
			defaultRuntime.log(`Would remove ${names.length} team store entr${names.length === 1 ? "y" : "ies"}.`);
			return;
		}
		await confirmMutation(`Remove ${names.length} team store entr${names.length === 1 ? "y" : "ies"}?`, options.yes);
		const { deleteSecretStoreEntry, purgeExpiredSecretStoreEntries } = await import("./secret-store-BYFWlksY.mjs");
		for (const name of names) deleteSecretStoreEntry({
			scope,
			name
		});
		await purgeExpiredSecretStoreEntries();
		defaultRuntime.log(`Removed ${names.length} team store entr${names.length === 1 ? "y" : "ies"}.`);
		await noteGatewayReload();
	}));
	store.command("import").description("Import dotenv-formatted entries from a file or stdin").option("--from <file>", "Dotenv file; use - or omit for stdin").option("--kind <secret|env>", "Override the detected kind for all entries").option("--scope <team>", "Store scope", "team").option("--dry-run", "Validate without writing", false).option("--yes", "Skip confirmation", false).action((options) => runStoreAction(async () => {
		const scope = teamScope(options.scope);
		if (!options.from && process.stdin.isTTY) throw new SecretStoreCliFailure(2, "Import requires --from <file> or piped stdin.");
		const values = await (await import("./secrets-store-input-GefYcKti.mjs")).readSecretStoreImport(options.from);
		const entries = Object.entries(values);
		if (entries.length === 0) throw new SecretStoreCliFailure(2, "Import input contains no dotenv assignments.");
		const normalized = entries.map(([name, value]) => {
			assertStoreName(name);
			return {
				name,
				value,
				kind: storeKind(options.kind, name)
			};
		});
		const storeModule = await import("./secret-store-BYFWlksY.mjs");
		const writable = normalized.filter((entry) => {
			if (isRedactedSecretValue(entry.value)) {
				const current = storeModule.readSecretStoreValue({
					scope,
					name: entry.name
				});
				if (current.ok && !isRedactedSecretValue(current.value)) {
					defaultRuntime.log(`Skipped redacted value for ${entry.name}; existing entry unchanged.`);
					return false;
				}
			}
			storeModule.assertSecretStoreValue(entry.value, entry.kind, entry.name);
			return true;
		});
		if (options.dryRun) {
			defaultRuntime.log(`Would import ${writable.length} team store entries.`);
			return;
		}
		if (writable.length === 0) return;
		await confirmMutation(`Import ${writable.length} team store entries?`, options.yes);
		for (const entry of writable) storeModule.writeSecretStoreEntry({
			scope,
			...entry,
			updatedBy: "cli"
		});
		await storeModule.purgeExpiredSecretStoreEntries();
		defaultRuntime.log(`Imported ${writable.length} team store entries.`);
		await noteGatewayReload();
	}));
}
//#endregion
//#region src/cli/secrets-cli.ts
const fsModuleLoader = createLazyImportLoader(() => import("node:fs"));
const clackPromptsLoader = createLazyImportLoader(() => import("@clack/prompts"));
const secretsApplyLoader = createLazyImportLoader(() => import("./apply-SxhJSApi.mjs"));
var SecretsPlanFileNotFoundError = class extends Error {};
const SECRETS_PLAN_MAX_BYTES = 16777216;
function serializePlanFile(plan, pathname) {
	const raw = `${JSON.stringify(plan, null, 2)}\n`;
	if (Buffer.byteLength(raw, "utf8") > SECRETS_PLAN_MAX_BYTES) throw new RangeError(`Secrets plan exceeds ${SECRETS_PLAN_MAX_BYTES} bytes and cannot be written: ${pathname}`);
	return raw;
}
async function readPlanFile(pathname) {
	const [fsModule, { readFileDescriptorBounded }, { isSecretsApplyPlan }] = await Promise.all([
		fsModuleLoader.load(),
		import("./infra/boundary-file-read.js"),
		import("./plan-CiwZixZY.mjs")
	]);
	const fsConstants = fsModule.constants;
	const openFlags = fsConstants.O_RDONLY | (fsConstants.O_NONBLOCK ?? 0);
	const file = await fsModule.promises.open(pathname, openFlags).catch((err) => {
		if (hasErrnoCode(err, "ENOENT")) throw new SecretsPlanFileNotFoundError(`Secrets plan file not found: ${pathname}`, { cause: err });
		throw err;
	});
	let raw;
	try {
		const stat = await file.stat();
		if (!stat.isFile()) throw new Error(`Secrets plan path is not a regular file: ${pathname}`);
		if (stat.size > SECRETS_PLAN_MAX_BYTES) throw new RangeError(`Secrets plan file exceeds ${SECRETS_PLAN_MAX_BYTES} bytes: ${pathname}`);
		raw = (await readFileDescriptorBounded(file.fd, SECRETS_PLAN_MAX_BYTES)).toString("utf8");
	} finally {
		await file.close();
	}
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw new Error(`Malformed JSON in secrets plan file: ${pathname}`, { cause: err });
	}
	if (!isSecretsApplyPlan(parsed)) throw new Error(`Invalid secrets plan file: ${pathname}. Generate a fresh plan with ${formatCliCommand("openclaw secrets configure --plan-out <path>")}.`);
	return parsed;
}
function registerSecretsCli(program) {
	const secrets = program.command("secrets").description("Secrets runtime controls").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/gateway/security", "docs.openclaw.ai/gateway/security")}\n`);
	registerSecretStoreCli(secrets);
	addGatewayClientOptions(secrets.command("reload").description("Re-resolve secret references and atomically swap runtime snapshot").option("--json", "Output JSON", false)).action(async (opts) => {
		const result = await runSecretsCommand(opts.json, () => callGatewayFromCli("secrets.reload", opts, void 0, { expectFinal: false }), (err) => {
			rethrowExpectedCliError(err);
			defaultRuntime.error(danger(formatGatewayCommandFailure({
				action: "reload secrets",
				error: err,
				inspectCommand: "openclaw gateway status --deep"
			})));
		}, 1);
		if (opts.json) return;
		const warningCount = Number(result?.warningCount ?? 0);
		defaultRuntime.log(Number.isFinite(warningCount) && warningCount > 0 ? `Secrets reloaded with ${warningCount} warning(s).` : "Secrets reloaded.");
	});
	secrets.command("audit").description("Audit plaintext secrets, unresolved refs, and precedence drift").option("--check", "Exit non-zero when findings are present", false).option("--allow-exec", "Allow exec SecretRef resolution during audit (may execute provider commands)", false).option("--json", "Output JSON", false).action(async (opts) => {
		const { report, exitCode } = await runSecretsCommand(opts.json, async () => {
			const { resolveSecretsAuditExitCode, runSecretsAudit } = await import("./audit-CatxA_UL.mjs");
			const auditReport = await runSecretsAudit({ allowExec: Boolean(opts.allowExec) });
			return {
				report: auditReport,
				exitCode: resolveSecretsAuditExitCode(auditReport, Boolean(opts.check))
			};
		}, (err) => {
			defaultRuntime.error(danger(`Secrets audit failed: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw doctor")} to inspect config and credential state.`));
		}, 2, (outcome) => outcome.report);
		if (!opts.json) {
			defaultRuntime.log(`Secrets audit: ${report.status}. plaintext=${report.summary.plaintextCount}, unresolved=${report.summary.unresolvedRefCount}, shadowed=${report.summary.shadowedRefCount}, storeResidue=${report.summary.storeResidueCount}, legacy=${report.summary.legacyResidueCount}.`);
			for (const finding of report.findings.slice(0, 20)) defaultRuntime.log(`- [${finding.code}] ${finding.file}:${finding.jsonPath} ${finding.message}`);
			if (report.findings.length > 20) defaultRuntime.log(`... ${report.findings.length - 20} more finding(s).`);
			if (report.resolution.skippedExecRefs > 0) defaultRuntime.log(`Audit note: skipped ${report.resolution.skippedExecRefs} exec SecretRef resolvability check(s). Re-run with --allow-exec to execute exec providers during audit.`);
		}
		if (exitCode !== 0) exitCliAfterOutput(defaultRuntime, exitCode);
	});
	secrets.command("configure").description("Interactive secrets helper (provider setup + SecretRef mapping + preflight)").option("--apply", "Apply changes immediately after preflight", false).option("--yes", "Skip apply confirmation prompt", false).option("--providers-only", "Configure secrets.providers only, skip credential mapping", false).option("--skip-provider-setup", "Skip provider setup and only map credential fields to existing providers", false).option("--agent <id>", "Agent id for auth-profiles targets (default: configured default agent)").option("--allow-exec", "Allow exec SecretRef preflight checks (may execute provider commands)", false).option("--plan-out <path>", "Write generated plan JSON to a file (max 16 MiB)").option("--json", "Output JSON", false).action(async (opts) => {
		await runSecretsCommand(opts.json, async () => {
			const { runSecretsConfigureInteractive } = await import("./configure-CEMJMfWI.mjs");
			const configured = await runSecretsConfigureInteractive({
				providersOnly: Boolean(opts.providersOnly),
				skipProviderSetup: Boolean(opts.skipProviderSetup),
				agentId: typeof opts.agent === "string" ? opts.agent : void 0,
				allowExecInPreflight: Boolean(opts.allowExec)
			});
			if (opts.planOut) {
				const { writeFileSync } = await fsModuleLoader.load();
				writeFileSync(opts.planOut, serializePlanFile(configured.plan, opts.planOut), "utf8");
			}
			let shouldApply = Boolean(opts.apply || opts.yes);
			if (!opts.json) {
				defaultRuntime.log(`Preflight: changed=${configured.preflight.changed}, files=${configured.preflight.changedFiles.length}, warnings=${configured.preflight.warningCount}.`);
				if (configured.preflight.warningCount > 0) for (const warning of configured.preflight.warnings) defaultRuntime.log(`- warning: ${warning}`);
				if (!configured.preflight.checks.resolvabilityComplete && configured.preflight.skippedExecRefs > 0) defaultRuntime.log(`Preflight note: skipped ${configured.preflight.skippedExecRefs} exec SecretRef resolvability check(s). Re-run with --allow-exec to execute exec providers during preflight.`);
				const providerUpserts = Object.keys(configured.plan.providerUpserts ?? {}).length;
				const providerDeletes = configured.plan.providerDeletes?.length ?? 0;
				defaultRuntime.log(`Plan: targets=${configured.plan.targets.length}, providerUpserts=${providerUpserts}, providerDeletes=${providerDeletes}.`);
				if (opts.planOut) defaultRuntime.log(`Plan written to ${opts.planOut}`);
			}
			if (!shouldApply && !opts.json) {
				const { confirm } = await clackPromptsLoader.load();
				const approved = await confirm({
					message: "Apply this plan now?",
					initialValue: true
				});
				if (typeof approved === "boolean") shouldApply = approved;
			}
			if (shouldApply) {
				if (!opts.yes && !opts.json) {
					const { confirm } = await clackPromptsLoader.load();
					if (await confirm({
						message: "This migration is one-way for migrated plaintext values. Continue with apply?",
						initialValue: true
					}) !== true) {
						defaultRuntime.log("Apply cancelled.");
						return {
							plan: configured.plan,
							preflight: configured.preflight
						};
					}
				}
				const { runSecretsApply } = await secretsApplyLoader.load();
				const result = await runSecretsApply({
					plan: configured.plan,
					write: true,
					allowExec: Boolean(opts.allowExec)
				});
				if (!opts.json) defaultRuntime.log(result.changed ? `Secrets applied. Updated ${result.changedFiles.length} file(s).` : "Secrets apply: no changes.");
				return result;
			}
			return {
				plan: configured.plan,
				preflight: configured.preflight
			};
		}, (err) => {
			defaultRuntime.error(danger(`Secrets configure failed: ${formatErrorMessage(err)}. Re-run ${formatCliCommand("openclaw secrets audit")} before applying changes.`));
		}, 1);
	});
	secrets.command("apply").description("Apply a previously generated secrets plan").requiredOption("--from <path>", "Path to plan JSON (max 16 MiB)").option("--dry-run", "Validate/preflight only", false).option("--allow-exec", "Allow exec SecretRef checks (may execute provider commands)", false).option("--json", "Output JSON", false).action(async (opts) => {
		const result = await runSecretsCommand(opts.json, async () => {
			const [{ runSecretsApply }, plan] = await Promise.all([secretsApplyLoader.load(), readPlanFile(opts.from)]);
			return runSecretsApply({
				plan,
				write: !opts.dryRun,
				allowExec: Boolean(opts.allowExec)
			});
		}, (err) => {
			const message = err instanceof SecretsPlanFileNotFoundError ? err.message : formatErrorMessage(err);
			defaultRuntime.error(danger(`Secrets apply failed: ${message}. Re-run ${formatCliCommand("openclaw secrets apply --from <path> --dry-run")} to inspect the plan without writing.`));
		}, 1);
		if (opts.json) return;
		if (opts.dryRun) {
			defaultRuntime.log(result.changed ? `Secrets apply dry run: ${result.changedFiles.length} file(s) would change.` : "Secrets apply dry run: no changes.");
			if (!result.checks.resolvabilityComplete && result.skippedExecRefs > 0) defaultRuntime.log(`Secrets apply dry-run note: skipped ${result.skippedExecRefs} exec SecretRef resolvability check(s). Re-run with --allow-exec to execute exec providers during dry-run.`);
			return;
		}
		defaultRuntime.log(result.changed ? `Secrets applied. Updated ${result.changedFiles.length} file(s).` : "Secrets apply: no changes.");
	});
}
//#endregion
export { registerSecretsCli };
