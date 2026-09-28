import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { a as parseConcreteConfigPathWithProvenance, o as toDotPath, r as parseConcreteConfigPath } from "./dot-path-BSC76DAI.mjs";
import { d as isValidFileSecretRefId, f as isValidSecretProviderAlias, l as isValidEnvSecretRefId, o as formatExecSecretRefIdValidationMessage, v as validateExecSecretRefId } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { _ as SecretProviderSchema } from "./zod-schema.core-DyJd-bbI.mjs";
import { c as resolveConfigSecretTargetByPath } from "./target-registry-query-DciTXKJy.mjs";
import "./target-registry-BD3AtdiE.mjs";
import { n as visitConfigValueTree, t as rejectConfigNonFiniteNumbers } from "./value-tree-D8NwsREA.mjs";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.mjs";
import { s as parseConfigSetValue, u as validatePathSegments } from "./config-cli-path-BmFvm17U.mjs";
import { i as parseBatchSource, n as hasProviderBuilderOptions, o as readConfigMutationFileSync, r as hasRefBuilderOptions, t as hasBatchMode } from "./config-set-input-BCZGfmt-.mjs";
import JSON5 from "json5";
//#region src/cli/config-set-parser.ts
/** Resolve the config-set input mode or return the exact flag-conflict error. */
function resolveConfigSetMode(params) {
	if (params.hasBatchMode) {
		if (params.hasRefBuilderOptions || params.hasProviderBuilderOptions) return {
			ok: false,
			error: "batch mode (--batch-json/--batch-file) cannot be combined with ref builder (--ref-*) or provider builder (--provider-*) flags."
		};
		return {
			ok: true,
			mode: "batch"
		};
	}
	if (params.hasRefBuilderOptions && params.hasProviderBuilderOptions) return {
		ok: false,
		error: "choose exactly one mode: ref builder (--ref-provider/--ref-source/--ref-id) or provider builder (--provider-*), not both."
	};
	if (params.hasRefBuilderOptions) return {
		ok: true,
		mode: "ref_builder"
	};
	if (params.hasProviderBuilderOptions) return {
		ok: true,
		mode: "provider_builder"
	};
	return {
		ok: true,
		mode: params.strictJson ? "json" : "value"
	};
}
//#endregion
//#region src/cli/config-cli-input.ts
const CONFIG_PATCH_STDIN_MAX_BYTES = 1048576;
function modeError(message) {
	return /* @__PURE__ */ new Error(`config set mode error: ${message}`);
}
function configPatchModeError(message) {
	return /* @__PURE__ */ new Error(`config patch mode error: ${message}`);
}
function parseSecretRefSource(raw, label) {
	const source = raw.trim();
	if (source === "env" || source === "file" || source === "exec" || source === "store") return source;
	throw new Error(`${label} must be one of: env, file, exec, store.`);
}
function parseSecretRefBuilder(params) {
	const provider = params.provider.trim();
	if (!provider) throw new Error(`${params.fieldPrefix}.provider is required.`);
	if (!isValidSecretProviderAlias(provider)) throw new Error(`${params.fieldPrefix}.provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: "default").`);
	const source = parseSecretRefSource(params.source, `${params.fieldPrefix}.source`);
	const id = params.id.trim();
	if (!id) throw new Error(`${params.fieldPrefix}.id is required.`);
	if (source === "env" && !isValidEnvSecretRefId(id)) throw new Error(`${params.fieldPrefix}.id must match /^[A-Z][A-Z0-9_]{0,127}$/ for env refs.`);
	if (source === "store" && !isValidEnvSecretRefId(id)) throw new Error(`${params.fieldPrefix}.id must match /^[A-Z][A-Z0-9_]{0,127}$/ for store refs.`);
	if (source === "file" && !isValidFileSecretRefId(id)) throw new Error(`${params.fieldPrefix}.id must be an absolute JSON pointer (or "value" for singleValue mode).`);
	if (source === "exec" && !validateExecSecretRefId(id).ok) throw new Error(formatExecSecretRefIdValidationMessage());
	return {
		source,
		provider,
		id
	};
}
function parseOptionalPositiveInteger(raw, flag) {
	if (raw === void 0) return;
	const trimmed = raw.trim();
	if (!trimmed) throw new Error(`${flag} must not be empty.`);
	const parsed = parseStrictPositiveInteger(trimmed);
	if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
	return parsed;
}
function parseProviderEnvEntries(entries) {
	if (!entries || entries.length === 0) return;
	const env = {};
	for (const entry of entries) {
		const separator = entry.indexOf("=");
		if (separator <= 0) throw new Error("--provider-env expects KEY=*** entries.");
		const key = entry.slice(0, separator).trim();
		if (!key) throw new Error("--provider-env key must not be empty.");
		env[key] = entry.slice(separator + 1);
	}
	return Object.keys(env).length > 0 ? env : void 0;
}
function validateProviderAliasPath(path) {
	if (path.length !== 3 || path[0] !== "secrets" || path[1] !== "providers") throw new Error("Provider builder mode requires path \"secrets.providers.<alias>\" (example: secrets.providers.vault).");
	const alias = path[2] ?? "";
	if (!isValidSecretProviderAlias(alias)) throw new Error(`Provider alias "${alias}" must match /^[a-z][a-z0-9_-]{0,63}$/ (example: "default").`);
}
function buildProviderFromBuilder(opts) {
	const sourceRaw = opts.providerSource?.trim();
	if (!sourceRaw) throw new Error("--provider-source is required in provider builder mode.");
	const source = parseSecretRefSource(sourceRaw, "--provider-source");
	const timeoutMs = parseOptionalPositiveInteger(opts.providerTimeoutMs, "--provider-timeout-ms");
	const maxBytes = parseOptionalPositiveInteger(opts.providerMaxBytes, "--provider-max-bytes");
	const noOutputTimeoutMs = parseOptionalPositiveInteger(opts.providerNoOutputTimeoutMs, "--provider-no-output-timeout-ms");
	const maxOutputBytes = parseOptionalPositiveInteger(opts.providerMaxOutputBytes, "--provider-max-output-bytes");
	const providerEnv = parseProviderEnvEntries(opts.providerEnv);
	let provider;
	if (source === "env") {
		const allowlist = normalizeStringEntries(opts.providerAllowlist);
		for (const envName of allowlist) if (!isValidEnvSecretRefId(envName)) throw new Error(`--provider-allowlist entry "${envName}" must match /^[A-Z][A-Z0-9_]{0,127}$/.`);
		provider = {
			source: "env",
			...allowlist.length > 0 ? { allowlist } : {}
		};
	} else if (source === "file") {
		const filePath = opts.providerPath?.trim();
		if (!filePath) throw new Error("--provider-path is required when --provider-source file is used.");
		const modeRaw = opts.providerMode?.trim();
		if (modeRaw && modeRaw !== "singleValue" && modeRaw !== "json") throw new Error("--provider-mode must be one of: singleValue, json.");
		const mode = modeRaw === "singleValue" || modeRaw === "json" ? modeRaw : void 0;
		provider = {
			source: "file",
			path: filePath,
			...mode ? { mode } : {},
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...maxBytes !== void 0 ? { maxBytes } : {}
		};
	} else if (source === "store") provider = { source: "store" };
	else {
		const command = opts.providerCommand?.trim();
		if (!command) throw new Error("--provider-command is required when --provider-source exec is used.");
		provider = {
			source: "exec",
			command,
			...opts.providerArg?.length ? { args: opts.providerArg } : {},
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs } : {},
			...maxOutputBytes !== void 0 ? { maxOutputBytes } : {},
			...opts.providerJsonOnly ? { jsonOnly: true } : {},
			...providerEnv ? { env: providerEnv } : {},
			...opts.providerPassEnv?.length ? { passEnv: normalizeStringEntries(opts.providerPassEnv) } : {},
			...opts.providerTrustedDir?.length ? { trustedDirs: normalizeStringEntries(opts.providerTrustedDir) } : {}
		};
	}
	const validated = SecretProviderSchema.safeParse(provider);
	if (!validated.success) {
		const issue = validated.error.issues[0];
		throw new Error(`Provider builder config invalid at ${issue?.path?.join(".") ?? "<provider>"}: ${issue?.message ?? "Invalid provider config."}`);
	}
	return validated.data;
}
function parseSecretRefFromUnknown(value, label) {
	if (!isRecord(value)) throw new Error(`${label} must be an object with source/provider/id.`);
	if (typeof value.provider !== "string" || typeof value.source !== "string" || typeof value.id !== "string") throw new Error(`${label} must include string fields: source, provider, id.`);
	return parseSecretRefBuilder({
		provider: value.provider,
		source: value.source,
		id: value.id,
		fieldPrefix: label
	});
}
function buildAssignmentOperation(params) {
	const resolved = resolveConfigSecretTargetByPath(params.requestedPath, params.pathTokens);
	const coercedRef = coerceSecretRef(params.value);
	return {
		inputMode: params.inputMode,
		requestedPath: params.requestedPath,
		...params.pathTokens ? { pathTokens: params.pathTokens } : {},
		...params.quotedNumericSegments ? { quotedNumericSegments: params.quotedNumericSegments } : {},
		setPath: coercedRef && resolved?.entry.secretShape === "sibling_ref" && resolved.refPathSegments ? resolved.refPathSegments : params.requestedPath,
		value: params.value,
		...params.validatedRef && resolved ? { schemaValidated: true } : {}
	};
}
function parseBatchOperations(entries) {
	return entries.map((entry, index) => {
		const { tokens: pathTokens, quotedNumericSegments } = parseConcreteConfigPathWithProvenance(entry.path);
		const path = pathTokens.map(String);
		if (entry.ref !== void 0) return buildAssignmentOperation({
			requestedPath: path,
			pathTokens,
			quotedNumericSegments,
			value: parseSecretRefFromUnknown(entry.ref, `batch[${index}].ref`),
			inputMode: "json",
			validatedRef: true
		});
		if (entry.provider !== void 0) {
			validateProviderAliasPath(path);
			const validated = SecretProviderSchema.safeParse(entry.provider);
			if (!validated.success) {
				const issue = validated.error.issues[0];
				throw new Error(`batch[${index}].provider invalid at ${issue?.path?.join(".") ?? "<provider>"}: ${issue?.message ?? ""}`);
			}
			return {
				inputMode: "json",
				requestedPath: path,
				pathTokens,
				quotedNumericSegments,
				setPath: path,
				value: validated.data,
				schemaValidated: true
			};
		}
		return buildAssignmentOperation({
			requestedPath: path,
			pathTokens,
			quotedNumericSegments,
			value: entry.value,
			inputMode: "json"
		});
	});
}
function buildConfigSetOperations(params) {
	const strictJson = Boolean(params.opts.strictJson || params.opts.json);
	const modeResolution = resolveConfigSetMode({
		hasBatchMode: hasBatchMode(params.opts),
		hasRefBuilderOptions: hasRefBuilderOptions(params.opts),
		hasProviderBuilderOptions: hasProviderBuilderOptions(params.opts),
		strictJson
	});
	if (!modeResolution.ok) throw modeError(modeResolution.error);
	if (params.opts.allowExec && !params.opts.dryRun) throw modeError("--allow-exec requires --dry-run.");
	if (params.opts.merge && params.opts.replace) throw modeError("choose either --merge or --replace, not both.");
	const batchEntries = parseBatchSource(params.opts);
	if (batchEntries) {
		if (params.path !== void 0 || params.value !== void 0) throw modeError("batch mode does not accept <path> or <value> arguments.");
		return parseBatchOperations(batchEntries);
	}
	const pathProvided = typeof params.path === "string" && params.path.trim().length > 0;
	const parsedConcretePath = pathProvided ? parseConcreteConfigPathWithProvenance(params.path) : null;
	const pathTokens = parsedConcretePath?.tokens ?? null;
	const parsedPath = pathTokens?.map(String) ?? null;
	if (modeResolution.mode === "ref_builder") {
		if (!pathProvided || !parsedPath) throw modeError("ref builder mode requires <path>.");
		if (params.value !== void 0) throw modeError("ref builder mode does not accept <value>.");
		if (!params.opts.refProvider || !params.opts.refSource || !params.opts.refId) throw modeError("ref builder mode requires --ref-provider <alias>, --ref-source <env|file|exec|store>, and --ref-id <id>.");
		return [buildAssignmentOperation({
			requestedPath: parsedPath,
			pathTokens: pathTokens ?? void 0,
			quotedNumericSegments: parsedConcretePath?.quotedNumericSegments,
			value: parseSecretRefBuilder({
				provider: params.opts.refProvider,
				source: params.opts.refSource,
				id: params.opts.refId,
				fieldPrefix: "ref"
			}),
			inputMode: "builder",
			validatedRef: true
		})];
	}
	if (modeResolution.mode === "provider_builder") {
		if (!pathProvided || !parsedPath) throw modeError("provider builder mode requires <path>.");
		if (params.value !== void 0) throw modeError("provider builder mode does not accept <value>.");
		const value = buildProviderFromBuilder(params.opts);
		validateProviderAliasPath(parsedPath);
		return [{
			inputMode: "builder",
			requestedPath: parsedPath,
			...pathTokens ? { pathTokens } : {},
			...parsedConcretePath ? { quotedNumericSegments: parsedConcretePath.quotedNumericSegments } : {},
			setPath: parsedPath,
			value,
			schemaValidated: true
		}];
	}
	if (!pathProvided || !parsedPath) throw modeError("value/json mode requires <path> when batch mode is not used.");
	if (params.value === void 0) throw modeError("value/json mode requires <value>.");
	return [buildAssignmentOperation({
		requestedPath: parsedPath,
		pathTokens: pathTokens ?? void 0,
		quotedNumericSegments: parsedConcretePath?.quotedNumericSegments,
		value: parseConfigSetValue(params.value, strictJson),
		inputMode: modeResolution.mode === "json" ? "json" : "value"
	})];
}
async function readStdinText() {
	if (process.stdin.isTTY) throw configPatchModeError("--stdin refuses to read from an interactive terminal; pipe input or use --file <path>.");
	process.stdin.setEncoding("utf8");
	return (await readByteStreamWithLimit(process.stdin, {
		maxBytes: CONFIG_PATCH_STDIN_MAX_BYTES,
		onOverflow: ({ maxBytes }) => configPatchModeError(`--stdin input exceeds ${maxBytes} bytes; use --file <path> for larger patches.`)
	})).toString("utf8");
}
async function readConfigPatchInput(opts) {
	const file = readNonBlankString(opts.file);
	const stdin = Boolean(opts.stdin);
	if (Boolean(file) === stdin) throw configPatchModeError("provide exactly one of --file <path> or --stdin.");
	const sourceLabel = stdin ? "--stdin" : "--file";
	let raw;
	if (stdin) raw = await readStdinText();
	else raw = readConfigMutationFileSync(file, "--file");
	let parsed;
	try {
		parsed = JSON5.parse(raw);
	} catch (err) {
		throw new Error(`Failed to parse ${sourceLabel} as JSON5: ${String(err)}`, { cause: err });
	}
	rejectConfigNonFiniteNumbers(parsed);
	return parsed;
}
function buildDeleteOperation(path) {
	return {
		...buildUnsetOperation(path),
		inputMode: "json"
	};
}
function buildUnsetOperation(path, pathTokens) {
	return {
		inputMode: "unset",
		requestedPath: path,
		...pathTokens ? { pathTokens } : {},
		setPath: path,
		value: void 0,
		mutation: "delete"
	};
}
function buildApplyValueOperation(params) {
	const ref = isRecord(params.value) ? coerceSecretRef(params.value) : null;
	return {
		...buildAssignmentOperation({
			requestedPath: params.path,
			value: ref ? parseSecretRefFromUnknown(params.value, `patch.${toDotPath(params.path)}`) : params.value,
			inputMode: "json",
			validatedRef: Boolean(ref)
		}),
		...params.mutation ? { mutation: params.mutation } : {}
	};
}
function buildConfigPatchOperations(params) {
	if (!isRecord(params.patch)) throw configPatchModeError("input must be a JSON5 object patch.");
	const operations = [];
	const pathKey = (path) => JSON.stringify(path);
	const replacePathsByLength = /* @__PURE__ */ new Map();
	for (const replacePath of params.replacePaths) {
		const sameLength = replacePathsByLength.get(replacePath.length);
		const candidate = {
			path: replacePath,
			key: pathKey(replacePath)
		};
		if (sameLength) sameLength.push(candidate);
		else replacePathsByLength.set(replacePath.length, [candidate]);
	}
	const matchedReplacePathKeys = /* @__PURE__ */ new Set();
	visitConfigValueTree(params.patch, (value, path) => {
		const segment = path.at(-1);
		if (segment !== void 0) validatePathSegments([segment]);
		const replacementPath = replacePathsByLength.get(path.length)?.find((candidate) => candidate.path.every((candidateSegment, index) => candidateSegment === path[index]));
		if (path.length > 0 && replacementPath) {
			matchedReplacePathKeys.add(replacementPath.key);
			const operationPath = [...path];
			operations.push(value === null ? buildDeleteOperation(operationPath) : buildApplyValueOperation({
				path: operationPath,
				value,
				mutation: "replace"
			}));
			return false;
		}
		if (path.length > 0 && value === null) {
			operations.push(buildDeleteOperation([...path]));
			return false;
		}
		if (path.length > 0 && isRecord(value) && coerceSecretRef(value)) {
			operations.push(buildApplyValueOperation({
				path: [...path],
				value
			}));
			return false;
		}
		if (isRecord(value)) {
			if (path.length > 0 && Object.keys(value).length === 0) {
				operations.push(buildApplyValueOperation({
					path: [...path],
					value,
					mutation: "merge"
				}));
				return false;
			}
			return true;
		}
		if (path.length === 0) throw configPatchModeError("input must contain at least one config key.");
		operations.push(buildApplyValueOperation({
			path: [...path],
			value
		}));
		return false;
	});
	const unusedReplacePath = params.replacePaths.find((replacePath) => !matchedReplacePathKeys.has(pathKey(replacePath)));
	if (unusedReplacePath) throw configPatchModeError(`--replace-path ${toDotPath(unusedReplacePath)} did not match any value in the input patch.`);
	if (operations.length === 0) throw configPatchModeError("input patch did not contain any config updates.");
	return operations;
}
async function readConfigPatchOperations(opts) {
	return buildConfigPatchOperations({
		patch: await readConfigPatchInput(opts),
		replacePaths: (opts.replacePath ?? []).map(parseConcreteConfigPath)
	});
}
function formatPluginInstallConfigSetError() {
	return [
		"plugins.installs is managed by the plugin index and cannot be edited with config set.",
		"",
		"Use plugin commands instead:",
		`  ${formatCliCommand("openclaw plugins install <spec>")}`,
		`  ${formatCliCommand("openclaw plugins update <plugin-id>")}`,
		`  ${formatCliCommand("openclaw plugins uninstall <plugin-id>")}`
	].join("\n");
}
//#endregion
export { readConfigPatchOperations as a, formatPluginInstallConfigSetError as i, buildUnsetOperation as n, configPatchModeError as r, buildConfigSetOperations as t };
