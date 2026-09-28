import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { c as readFileDescriptorBoundedSync } from "./boundary-file-read-D-Aa04On.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import "./errors-DnjwnOju.mjs";
import { t as rejectConfigNonFiniteNumbers } from "./value-tree-D8NwsREA.mjs";
import fs from "node:fs";
import JSON5 from "json5";
//#region src/cli/config-set-input.ts
const CONFIG_MUTATION_FILE_MAX_BYTES = 8388608;
function readConfigMutationFileSync(filePath, sourceLabel) {
	let fd;
	try {
		fd = fs.openSync(filePath, "r");
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) throw new Error(`${sourceLabel} not found: ${filePath}. Check the path and try again.`, { cause: error });
		throw error;
	}
	try {
		if (!fs.fstatSync(fd).isFile()) throw new Error(`${sourceLabel} must be a regular file: ${filePath}. Choose a JSON5 input file and try again.`);
		try {
			return readFileDescriptorBoundedSync(fd, CONFIG_MUTATION_FILE_MAX_BYTES).toString("utf8");
		} catch (error) {
			if (error instanceof RangeError) throw new RangeError(`${sourceLabel} exceeds the 8 MiB supported maximum (${CONFIG_MUTATION_FILE_MAX_BYTES} bytes): ${filePath}`, { cause: error });
			throw error;
		}
	} finally {
		fs.closeSync(fd);
	}
}
function hasBatchMode(opts) {
	return opts.batchJson !== void 0 || opts.batchFile !== void 0;
}
function hasRefBuilderOptions(opts) {
	return Boolean(opts.refProvider || opts.refSource || opts.refId);
}
function hasProviderBuilderOptions(opts) {
	return Boolean(opts.providerSource || opts.providerAllowlist?.length || opts.providerPath || opts.providerMode || opts.providerTimeoutMs || opts.providerMaxBytes || opts.providerCommand || opts.providerArg?.length || opts.providerNoOutputTimeoutMs || opts.providerMaxOutputBytes || opts.providerJsonOnly || opts.providerEnv?.length || opts.providerPassEnv?.length || opts.providerTrustedDir?.length);
}
function parseJson5Raw(raw, label) {
	let parsed;
	try {
		parsed = JSON5.parse(raw);
	} catch (err) {
		throw new Error(`Failed to parse ${label}: ${String(err)}`, { cause: err });
	}
	rejectConfigNonFiniteNumbers(parsed);
	return parsed;
}
function parseBatchEntries(raw, sourceLabel) {
	const parsed = parseJson5Raw(raw, sourceLabel);
	if (!Array.isArray(parsed)) throw new Error(`${sourceLabel} must be a JSON array.`);
	if (parsed.length === 0) throw new Error(`${sourceLabel} must contain at least one config update.`);
	const out = [];
	for (const [index, entry] of parsed.entries()) {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new Error(`${sourceLabel}[${index}] must be an object.`);
		const typed = entry;
		const path = normalizeOptionalString(typed.path) ?? "";
		if (!path) throw new Error(`${sourceLabel}[${index}].path is required.`);
		const hasValue = Object.hasOwn(typed, "value");
		const hasRef = Object.hasOwn(typed, "ref");
		const hasProvider = Object.hasOwn(typed, "provider");
		if (Number(hasValue) + Number(hasRef) + Number(hasProvider) !== 1) throw new Error(`${sourceLabel}[${index}] must include exactly one of: value, ref, provider.`);
		out.push({
			path,
			...hasValue ? { value: typed.value } : {},
			...hasRef ? { ref: typed.ref } : {},
			...hasProvider ? { provider: typed.provider } : {}
		});
	}
	return out;
}
function parseConfigSetCurrentExpectation(opts) {
	const expectAbsent = opts.expectCurrentAbsent === true;
	const hasExpectedJson = opts.expectCurrentJson !== void 0;
	if (!expectAbsent && !hasExpectedJson) return;
	if (expectAbsent && hasExpectedJson) throw new Error("config set mode error: choose either --expect-current-absent or --expect-current-json, not both.");
	if (opts.dryRun) throw new Error("config set mode error: conditional expectations cannot be combined with --dry-run.");
	if (opts.batchJson !== void 0 || opts.batchFile !== void 0) throw new Error("config set mode error: conditional expectations require one path operation and cannot be combined with batch mode.");
	if (expectAbsent) return { kind: "absent" };
	const expectedJson = opts.expectCurrentJson;
	if (expectedJson === void 0) throw new Error("config set mode error: missing conditional expectation.");
	let value;
	try {
		value = JSON.parse(expectedJson);
		rejectConfigNonFiniteNumbers(value);
	} catch (error) {
		throw new Error("config set mode error: --expect-current-json must be valid JSON.", { cause: error });
	}
	return {
		kind: "json",
		value
	};
}
function parseBatchSource(opts) {
	const batchJson = opts.batchJson;
	const hasInline = batchJson !== void 0;
	const hasFile = opts.batchFile !== void 0;
	if (!hasInline && !hasFile) return null;
	if (hasInline && hasFile) throw new Error("Use either --batch-json or --batch-file, not both.");
	if (hasInline) return parseBatchEntries(batchJson, "--batch-json");
	const pathname = readNonBlankString(opts.batchFile);
	if (!pathname) throw new Error("--batch-file must not be empty.");
	return parseBatchEntries(readConfigMutationFileSync(pathname, "--batch-file"), "--batch-file");
}
//#endregion
export { parseConfigSetCurrentExpectation as a, parseBatchSource as i, hasProviderBuilderOptions as n, readConfigMutationFileSync as o, hasRefBuilderOptions as r, hasBatchMode as t };
