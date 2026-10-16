import { n as isConfigSetJsonParseOnly, t as isConfigMachineOutput } from "./config-output-mode-B0q9nhjd.mjs";
import { a as writeRuntimeJson, o as writeRuntimeStdout, r as defaultRuntime, t as ExitError } from "./runtime-DlO3PTAd.mjs";
import { i as parseConcreteConfigPathTokens, r as parseConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { i as normalizeConfigIssues, n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { m as resolveConfigPath, t as CONFIG_PATH } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as formatCliJsonFailure } from "./failure-output-gtb9zaTk.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-CSOrFNcy.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { c as warn, r as isDevMode, s as success, t as danger } from "./globals-BXbZ1A_g.mjs";
import { a as isConfigSchemaPath, i as getAtPath } from "./config-cli-path-Dh9BCpH3.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { t as collectOption } from "./helpers-Bbrcmhji.mjs";
import { t as renderConfigValidationIssueLines } from "./issue-location-nU8-G0tV.mjs";
import { n as setCommandJsonMode } from "./json-mode-e6DlzpSi.mjs";
//#region src/cli/config-cli.ts
const CONFIG_SET_DESCRIPTION = [
	"Set config values by path (value mode, ref/provider builder mode, or batch JSON mode).",
	"Examples:",
	formatCliCommand("openclaw config set gateway.port 19001 --strict-json"),
	formatCliCommand("openclaw config set channels.discord.token --ref-provider default --ref-source env --ref-id DISCORD_BOT_TOKEN"),
	formatCliCommand("openclaw config set secrets.providers.vault --provider-source file --provider-path /etc/openclaw/secrets.json --provider-mode json"),
	formatCliCommand("openclaw config set --batch-file ./config-set.batch.json --dry-run")
].join("\n");
const CONFIG_PATCH_DESCRIPTION = [
	"Patch config from a JSON5 object in one validated write.",
	"Objects merge recursively, arrays/scalars replace, and null deletes a path.",
	"Examples:",
	formatCliCommand("openclaw config patch --file ./openclaw.patch.json5 --dry-run"),
	formatCliCommand("openclaw config patch --stdin")
].join("\n");
async function runConfigSet(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	const { handleConfigMutationError, runConfigOperations } = await import("./config-cli-runner-BIbY8UP7.mjs");
	try {
		const { buildConfigSetOperations } = await import("./config-cli-input-C8xyvMew.mjs");
		const { parseConfigSetCurrentExpectation } = await import("./config-set-input-BfmDNn7T.mjs");
		const currentExpectation = parseConfigSetCurrentExpectation(opts.cliOptions);
		const operations = buildConfigSetOperations({
			path: opts.path,
			value: opts.value,
			opts: opts.cliOptions
		});
		if (currentExpectation && operations.length !== 1) throw new Error("config set mode error: conditional expectations require exactly one resolved operation.");
		await runConfigOperations({
			runtime,
			operations,
			options: opts.cliOptions,
			successMode: "set",
			...currentExpectation ? { currentExpectation } : {},
			...opts.beforePersistentApply ? { beforePersistentApply: opts.beforePersistentApply } : {}
		});
	} catch (err) {
		if (opts.throwOnError) throw err;
		handleConfigMutationError({
			err,
			runtime,
			options: opts.cliOptions,
			jsonOutput: Boolean(opts.cliOptions.dryRun && opts.cliOptions.json)
		});
	}
}
async function runConfigPatch(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	const { handleConfigMutationError, runConfigOperations } = await import("./config-cli-runner-BIbY8UP7.mjs");
	try {
		const { configPatchModeError, readConfigPatchOperations } = await import("./config-cli-input-C8xyvMew.mjs");
		if (opts.cliOptions.allowExec && !opts.cliOptions.dryRun) throw configPatchModeError("--allow-exec requires --dry-run.");
		if (opts.cliOptions.json && !opts.cliOptions.dryRun) throw configPatchModeError("--json requires --dry-run.");
		await runConfigOperations({
			runtime,
			operations: await readConfigPatchOperations(opts.cliOptions),
			options: opts.cliOptions,
			successMode: "patch"
		});
	} catch (err) {
		handleConfigMutationError({
			err,
			runtime,
			options: opts.cliOptions,
			jsonOutput: Boolean(opts.cliOptions.json)
		});
	}
}
async function runConfigGet(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	try {
		const parsedPath = parseConcreteConfigPath(opts.path);
		const { readConfigFileSnapshotWithPluginMetadata } = await import("./config/config.js");
		const { ensureValidConfigSnapshotForCli } = await import("./config-cli-validation-2jdMxzNJ.mjs");
		const { snapshot, pluginMetadataSnapshot } = await readConfigFileSnapshotWithPluginMetadata({ observe: false });
		ensureValidConfigSnapshotForCli(snapshot, runtime, { json: opts.json });
		if (!pluginMetadataSnapshot) throw new Error("Config plugin metadata unavailable; refusing to display config values.");
		const { buildRuntimeConfigSchemaFromRegistry } = await import("./runtime-schema-BAzAM4nC.mjs");
		const { redactConfigObject } = await import("./redact-snapshot-CofJpNJL.mjs");
		const { schema, uiHints } = buildRuntimeConfigSchemaFromRegistry(pluginMetadataSnapshot.manifestRegistry, snapshot.sourceConfig);
		const visible = isDevMode() ? snapshot.config : redactConfigObject(snapshot.config, uiHints);
		const res = getAtPath(visible, parsedPath);
		if (!res.found || res.value === void 0) {
			const message = isConfigSchemaPath(schema, parsedPath) ? `Config path is valid but unset: ${opts.path}. The runtime default applies until you set an authored value with ${formatCliCommand(`openclaw config set ${quoteCliArg(opts.path)} <value>`)}.` : `Unknown config path: ${opts.path}. Run ${formatCliCommand("openclaw config schema")} to inspect valid paths.`;
			if (opts.json) {
				writeRuntimeJson(runtime, formatCliJsonFailure(message));
				exitCliAfterOutput(runtime, 1);
			}
			runtime.error(danger(message));
			exitCliAfterOutput(runtime, 1);
		}
		if (!opts.json && (typeof res.value === "string" || typeof res.value === "number" || typeof res.value === "boolean")) writeRuntimeStdout(runtime, `${String(res.value)}\n`);
		else writeRuntimeJson(runtime, res.value);
	} catch (err) {
		if (err instanceof ExitError) throw err;
		if (opts.json) {
			writeRuntimeJson(runtime, formatCliJsonFailure(err));
			exitCliAfterOutput(runtime, 1);
		}
		runtime.error(danger(formatErrorMessage(err)));
		exitCliAfterOutput(runtime, 1);
	}
}
async function runConfigUnset(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	const cliOptions = opts.cliOptions ?? {};
	const { handleConfigMutationError, runConfigOperations } = await import("./config-cli-runner-BIbY8UP7.mjs");
	try {
		const { buildUnsetOperation } = await import("./config-cli-input-C8xyvMew.mjs");
		if (cliOptions.allowExec && !cliOptions.dryRun) throw new Error("--allow-exec can only be used with --dry-run.");
		if (cliOptions.json && !cliOptions.dryRun) throw new Error("--json can only be used with --dry-run.");
		const pathTokens = parseConcreteConfigPathTokens(opts.path);
		await runConfigOperations({
			runtime,
			operations: [buildUnsetOperation(pathTokens.map(String), pathTokens)],
			options: cliOptions,
			successMode: "set",
			...opts.beforePersistentApply ? { beforePersistentApply: opts.beforePersistentApply } : {}
		});
	} catch (err) {
		handleConfigMutationError({
			err,
			runtime,
			options: cliOptions,
			jsonOutput: Boolean(cliOptions.json)
		});
	}
}
async function runConfigFile(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	try {
		const path = resolveConfigPath();
		if (opts.json) {
			writeRuntimeJson(runtime, { path });
			return;
		}
		writeRuntimeStdout(runtime, `${path}\n`);
	} catch (err) {
		runtime.error(danger(formatErrorMessage(err)));
		exitCliAfterOutput(runtime, 1);
	}
}
async function runConfigSchema(opts = {}) {
	const runtime = opts.runtime ?? defaultRuntime;
	try {
		const { readBestEffortRuntimeConfigSchema } = await import("./runtime-schema-BAzAM4nC.mjs");
		const schema = (await readBestEffortRuntimeConfigSchema()).schema;
		writeRuntimeJson(runtime, {
			...schema,
			properties: {
				$schema: { type: "string" },
				...schema.properties
			}
		});
	} catch (err) {
		runtime.error(danger(`Config schema error: ${formatErrorMessage(err)}`));
		exitCliAfterOutput(runtime, 1);
	}
}
async function runConfigValidate(opts = {}) {
	const runtime = opts.runtime ?? defaultRuntime;
	let outputPath = CONFIG_PATH ?? "openclaw.json";
	try {
		const fixJson = opts.fix ? await (await import("./config-validate-fix-BMxZWI2j.mjs")).runConfigValidateFix({
			runtime,
			json: opts.json === true,
			dryRun: opts.dryRun === true
		}) : {};
		if (!fixJson) return;
		const { readConfigFileSnapshotWithPluginMetadata } = await import("./config/config.js");
		const { formatInvalidConfigRepairHint, finishConfigValidationForCli } = await import("./config-cli-validation-2jdMxzNJ.mjs");
		const snapshot = await finishConfigValidationForCli(await readConfigFileSnapshotWithPluginMetadata({
			observe: false,
			prepareValidation: "strict"
		}));
		outputPath = snapshot.path;
		const shortPath = shortenHomePath(outputPath);
		if (!snapshot.exists) {
			if (opts.json) writeRuntimeJson(runtime, {
				...formatCliJsonFailure("file not found"),
				valid: false,
				path: outputPath
			}, 0);
			else {
				runtime.error(danger(`Config file not found: ${shortPath}`));
				runtime.error(`Create one with ${formatCliCommand("openclaw onboard")} or run ${formatCliCommand("openclaw doctor --fix")}.`);
			}
			exitCliAfterOutput(runtime, 1);
		}
		if (!snapshot.valid) {
			const issues = normalizeConfigIssues(snapshot.issues);
			if (opts.json) writeRuntimeJson(runtime, {
				...formatCliJsonFailure(`OpenClaw config is invalid: ${shortPath}`),
				valid: false,
				path: outputPath,
				issues,
				...fixJson
			});
			else {
				runtime.error(`Config needs correction: ${shortPath}`);
				for (const line of renderConfigValidationIssueLines(snapshot, "-")) runtime.error(`  ${line}`);
				runtime.error("");
				runtime.error(formatInvalidConfigRepairHint(snapshot, "to repair, or fix the keys above manually."));
				runtime.error(`Run ${formatCliCommand("openclaw config schema")} to inspect supported settings and values, then rerun ${formatCliCommand("openclaw config validate")}.`);
			}
			exitCliAfterOutput(runtime, 1);
		}
		const warnings = normalizeConfigIssues(snapshot.warnings);
		if (opts.json) writeRuntimeJson(runtime, {
			valid: true,
			path: outputPath,
			warnings,
			...fixJson
		}, 0);
		else {
			runtime.log(success(`Config valid: ${shortPath}`));
			if (warnings.length > 0) {
				runtime.log(warn(`${warnings.length} warning(s):`));
				for (const line of formatConfigIssueLines(warnings, warn("!"), { normalizeRoot: true })) runtime.log(`  ${line}`);
			}
		}
	} catch (err) {
		if (err instanceof ExitError) throw err;
		if (opts.json) writeRuntimeJson(runtime, {
			...formatCliJsonFailure(err),
			valid: false,
			path: outputPath
		}, 0);
		else runtime.error(danger(`Config validation error: ${formatErrorMessage(err)}`));
		exitCliAfterOutput(runtime, 1);
	}
}
function registerConfigCli(program) {
	const cmd = program.command("config").description("Non-interactive config helpers (get/set/patch/unset/file/schema/validate). Run without subcommand for guided setup.").addHelpText("after", () => formatDocsHelp("/cli/config")).option("--section <section>", "Configuration sections for guided setup (repeatable). Use with no subcommand.", collectOption, []).action(async (opts) => {
		const { configureCommandFromSectionsArg } = await import("./configure.commands-CbTa7THd.mjs");
		await configureCommandFromSectionsArg(opts.section, defaultRuntime);
	});
	setCommandJsonMode(cmd, "output", ({ argv }) => isConfigMachineOutput(argv));
	cmd.command("get").description("Get a config value by dot path").argument("<path>", "Config path (dot or bracket notation)").option("--json", "Output JSON", false).action(async (path, opts) => {
		await runConfigGet({
			path,
			json: Boolean(opts.json)
		});
	});
	setCommandJsonMode(cmd.command("set"), "parse-only", ({ argv }) => isConfigSetJsonParseOnly(argv)).description(CONFIG_SET_DESCRIPTION).argument("[path]", "Config path (dot or bracket notation)").argument("[value]", "Value (JSON/JSON5 or raw string)").option("--strict-json", "Strict JSON parsing (error instead of raw string fallback)", false).option("--json", "Legacy alias for --strict-json", false).option("--expect-current-absent", "Write only when the authored path is absent", false).option("--expect-current-json <json>", "Write only when the authored path exactly matches this strict JSON value").option("--dry-run", "Validate changes without writing openclaw.json (checks run in builder/json/batch modes; exec SecretRefs are skipped unless --allow-exec is set)", false).option("--allow-exec", "Dry-run only: allow exec SecretRef resolvability checks (may execute provider commands)", false).option("--merge", "Merge object/map values instead of replacing the target path", false).option("--replace", "Allow full replacement of protected map/list paths such as agents.defaults.models", false).option("--ref-provider <alias>", "SecretRef builder: provider alias").option("--ref-source <source>", "SecretRef builder: source (env|file|exec|store)").option("--ref-id <id>", "SecretRef builder: ref id").option("--provider-source <source>", "Provider builder: source (env|file|exec|store)").option("--provider-allowlist <envVar>", "Provider builder (env): allowlist entry (repeatable)", collectOption, []).option("--provider-path <path>", "Provider builder (file): path").option("--provider-mode <mode>", "Provider builder (file): mode (singleValue|json)").option("--provider-timeout-ms <ms>", "Provider builder (file|exec): timeout ms").option("--provider-max-bytes <bytes>", "Provider builder (file): max bytes").option("--provider-command <path>", "Provider builder (exec): absolute command path").option("--provider-arg <arg>", "Provider builder (exec): command arg (repeatable)", collectOption, []).option("--provider-no-output-timeout-ms <ms>", "Provider builder (exec): no-output timeout ms").option("--provider-max-output-bytes <bytes>", "Provider builder (exec): max output bytes").option("--provider-json-only", "Provider builder (exec): require JSON output", false).option("--provider-env <key=value>", "Provider builder (exec): env assignment (repeatable)", collectOption, []).option("--provider-pass-env <envVar>", "Provider builder (exec): pass host env var (repeatable)", collectOption, []).option("--provider-trusted-dir <path>", "Provider builder (exec): trusted directory (repeatable)", collectOption, []).option("--batch-json <json>", "Batch mode: JSON array of set operations").option("--batch-file <path>", "Batch mode: read JSON array of set operations from file").action(async (path, value, opts) => {
		await runConfigSet({
			path,
			value,
			cliOptions: opts
		});
	});
	cmd.command("patch").description(CONFIG_PATCH_DESCRIPTION).option("--file <path>", "Read a JSON5 config patch object from file").option("--stdin", "Read a JSON5 config patch object from stdin", false).option("--dry-run", "Validate changes without writing openclaw.json (checks schema and SecretRef resolvability; exec SecretRefs are skipped unless --allow-exec is set)", false).option("--allow-exec", "Dry-run only: allow exec SecretRef resolvability checks (may execute provider commands)", false).option("--json", "Output dry-run result as JSON", false).option("--replace-path <path>", "Replace the object or array at this dot/bracket path instead of recursively applying it (repeatable)", collectOption, []).action(async (opts) => {
		await runConfigPatch({ cliOptions: opts });
	});
	cmd.command("unset").description("Remove a config value by dot path").argument("<path>", "Config path (dot or bracket notation)").option("--dry-run", "validate the removal without writing the config file").option("--allow-exec", "allow exec SecretRef providers during --dry-run").option("--json", "print dry-run result as JSON").action(async (path, options) => {
		await runConfigUnset({
			path,
			cliOptions: options
		});
	});
	cmd.command("file").description("Print the active config file path").option("--json", "Output JSON", false).action((opts) => runConfigFile(opts));
	cmd.command("schema").description("Print the JSON schema for openclaw.json").option("--json", "Output JSON", false).action(runConfigSchema);
	cmd.command("validate").description("Validate the current config against the schema without starting the gateway").option("--json", "Output validation result as JSON", false).option("--fix", "Apply doctor's config-only repairs (legacy keys, old value formats, unknown keys) before validating", false).option("--dry-run", "With --fix: show the repairs without writing", false).action(async (opts) => {
		await runConfigValidate({
			json: Boolean(opts.json),
			fix: Boolean(opts.fix),
			dryRun: Boolean(opts.dryRun)
		});
	});
}
//#endregion
export { registerConfigCli, runConfigGet, runConfigSet, runConfigUnset };
