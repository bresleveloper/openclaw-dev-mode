import { t as createRuntimeProcessEntrypoints } from "./openclaw-state-read-runtime-process-manifest-DvMn2cl1.mjs";
//#region src/infra/runtime-process-entrypoints.ts
const SQLITE_READONLY_CHILD_ARG = "--openclaw-sqlite-readonly-child";
const runtimeProcessEntrypoints = createRuntimeProcessEntrypoints(import.meta.url);
//#endregion
//#region src/daemon/runtime-binary.ts
const NODE_VERSIONED_PATTERN = /^node(?:-\d+|\d+)(?:\.\d+)*(?:\.exe)?$/;
function normalizeRuntimeBasename(execPath) {
	const trimmed = execPath.trim().replace(/^["']|["']$/g, "");
	const lastSlash = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
	return (lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1)).trim().toLowerCase();
}
function isNodeRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return /^node(?:js)?(?:\.exe)?$/.test(base) || NODE_VERSIONED_PATTERN.test(base);
}
function isBunRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return base === "bun" || base === "bun.exe";
}
const RUNTIME_MODULE_OPTIONS = /* @__PURE__ */ new Set([
	"-r",
	"--preload",
	"--require",
	"--import",
	"--loader",
	"--experimental-loader",
	"--test-reporter",
	"--test-global-setup"
]);
const RUNTIME_VALUE_OPTIONS = /* @__PURE__ */ new Set([
	...RUNTIME_MODULE_OPTIONS,
	"-C",
	"--env-file",
	"--env-file-if-exists",
	"--tsconfig",
	"--cwd",
	"--conditions",
	"--icu-data-dir",
	"--openssl-config",
	"--title",
	"--disable-warning",
	"--disable-proto",
	"--cpu-prof-name",
	"--max-old-space-size",
	"--max-semi-space-size"
]);
const RUNTIME_BOOLEAN_OPTIONS = /* @__PURE__ */ new Set([
	"--inspect",
	"--inspect-brk",
	"--inspect-wait",
	"--expose-gc",
	"--jitless",
	"--no-opt",
	"--experimental-strip-types",
	"--watch",
	"--no-warnings",
	"--trace-uncaught",
	"--bun"
]);
/** One runtime walk locates the script, eval source, and possible artifact operands. */
function resolveRuntimeScriptPosition(args) {
	const operands = [];
	const executable = args[0] ?? "";
	const basename = executable.replaceAll("\\", "/").trim().toLowerCase().split("/").at(-1);
	const bun = isBunRuntime(executable);
	const tsx = basename === "tsx" || basename === "tsx.cmd";
	let pendingSubcommand = bun ? "run" : tsx ? "watch" : void 0;
	let unresolved;
	const sourceIndices = [];
	if (!isNodeRuntime(executable) && !bun && !tsx) return {
		position: { kind: "not-runtime" },
		operands,
		sourceIndices
	};
	for (let index = 1; index < args.length; index++) {
		const arg = args[index];
		if (arg === "--") {
			if (!unresolved) return {
				position: sourceIndices.length === 0 && args[index + 1] ? index + 1 : { kind: "other" },
				operands,
				sourceIndices
			};
			operands.push(...args.slice(index + 1).map((value) => ({
				value,
				module: false
			})));
			break;
		}
		if (arg === "-e" || arg === "-p" || /^--(?:eval|print|run)(?:=|$)/.test(arg)) {
			if (!arg.includes("=")) index++;
			sourceIndices.push(index);
			continue;
		}
		const equals = arg.indexOf("=");
		const option = equals < 0 ? arg : arg.slice(0, equals);
		if (arg.startsWith("-r") && !arg.startsWith("--") && arg.length > 2) operands.push({
			value: arg.slice(2),
			module: true
		});
		else if (RUNTIME_VALUE_OPTIONS.has(option)) {
			const value = equals < 0 ? args[++index] ?? "" : arg.slice(equals + 1);
			const builtinReporter = !bun && option === "--test-reporter" && /^(?:dot|spec|tap)$/.test(value);
			if (RUNTIME_MODULE_OPTIONS.has(option) && !builtinReporter && (!bun || option !== "--loader")) operands.push({
				value,
				module: true
			});
		} else if (arg.startsWith("-")) {
			const negated = `--no-${option.replace(/^--(?:no-)?/, "")}`;
			const nodeOption = !bun && process.allowedNodeEnvironmentFlags.has(option);
			const knownBoolean = RUNTIME_BOOLEAN_OPTIONS.has(option) || bun && (option === "--hot" || option === "--no-install") || nodeOption && process.allowedNodeEnvironmentFlags.has(negated);
			if (sourceIndices.length === 0 && !knownBoolean && !/^--[^=]+=/.test(arg)) unresolved ??= {
				kind: "unclassified",
				reason: `unsupported runtime option ${arg}`
			};
			if (equals >= 0 && !knownBoolean && !nodeOption) operands.push({
				value: arg.slice(equals + 1),
				module: true
			});
		} else if (sourceIndices.length === 0 && arg === pendingSubcommand) pendingSubcommand = void 0;
		else if (sourceIndices.length === 0) {
			if (!unresolved) return {
				position: index,
				operands,
				sourceIndices
			};
			pendingSubcommand = void 0;
			operands.push({
				value: arg,
				module: false
			});
		} else break;
	}
	return {
		position: unresolved ?? { kind: "other" },
		operands,
		sourceIndices: unresolved ? [] : sourceIndices
	};
}
//#endregion
export { runtimeProcessEntrypoints as a, SQLITE_READONLY_CHILD_ARG as i, isNodeRuntime as n, resolveRuntimeScriptPosition as r, isBunRuntime as t };
