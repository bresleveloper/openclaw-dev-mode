import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as readFileDescriptorBoundedSync } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./errors-O33D01XW.mjs";
import { t as rejectConfigNonFiniteNumbers } from "./value-tree-3oLf9xok.mjs";
import fs from "node:fs";
import JSON5 from "json5";
//#region src/cli/config-set-input.ts
const CONFIG_MUTATION_FILE_MAX_BYTES = 8388608;
function readConfigMutationFileSync(filePath, sourceLabel) {
	const openFlags = process.platform === "win32" ? "r" : fs.constants.O_RDONLY | fs.constants.O_NONBLOCK;
	let fd;
	try {
		fd = fs.openSync(filePath, openFlags);
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
function resolveConfigSetMode(opts) {
	const hasRef = Boolean(opts.refProvider || opts.refSource || opts.refId);
	const hasProvider = Boolean(opts.providerSource || opts.providerAllowlist?.length || opts.providerPath || opts.providerMode || opts.providerTimeoutMs || opts.providerMaxBytes || opts.providerCommand || opts.providerArg?.length || opts.providerNoOutputTimeoutMs || opts.providerMaxOutputBytes || opts.providerJsonOnly || opts.providerEnv?.length || opts.providerPassEnv?.length || opts.providerTrustedDir?.length);
	if (opts.batchJson !== void 0 || opts.batchFile !== void 0) {
		if (hasRef || hasProvider) throw new Error("config set mode error: batch mode (--batch-json/--batch-file) cannot be combined with ref builder (--ref-*) or provider builder (--provider-*) flags.");
		return "batch";
	}
	if (hasRef && hasProvider) throw new Error("config set mode error: choose exactly one mode: ref builder (--ref-provider/--ref-source/--ref-id) or provider builder (--provider-*), not both.");
	return hasRef ? "ref_builder" : hasProvider ? "provider_builder" : opts.strictJson || opts.json ? "json" : "value";
}
function parseConfigMutationJson5(raw, label) {
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
	const parsed = parseConfigMutationJson5(raw, sourceLabel);
	if (!Array.isArray(parsed)) throw new Error(`${sourceLabel} must be a JSON array.`);
	if (parsed.length === 0) throw new Error(`${sourceLabel} must contain at least one config update.`);
	const entries = [];
	for (const [index, entry] of parsed.entries()) {
		if (!isRecord(entry)) throw new Error(`${sourceLabel}[${index}] must be an object.`);
		const path = normalizeOptionalString(entry.path);
		if (!path) throw new Error(`${sourceLabel}[${index}].path is required.`);
		const hasValue = Object.hasOwn(entry, "value");
		const hasRef = Object.hasOwn(entry, "ref");
		const hasProvider = Object.hasOwn(entry, "provider");
		if (Number(hasValue) + Number(hasRef) + Number(hasProvider) !== 1) throw new Error(`${sourceLabel}[${index}] must include exactly one of: value, ref, provider.`);
		entries.push({
			path,
			...hasValue ? { value: entry.value } : {},
			...hasRef ? { ref: entry.ref } : {},
			...hasProvider ? { provider: entry.provider } : {}
		});
	}
	return entries;
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
export { resolveConfigSetMode as a, readConfigMutationFileSync as i, parseConfigMutationJson5 as n, parseConfigSetCurrentExpectation as r, parseBatchSource as t };
